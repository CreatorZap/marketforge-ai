import { openAIProvider } from './providers/openai'
import { buildProjectPrompt, parseGeneratedContent, generateProjectSummary, type ProjectData } from '../prompts/site-generation'

/**
 * Dados do wizard de 7 passos
 * 
 * Esta interface é o que chega da interface do usuário (frontend)
 * É idêntica a ProjectData, mas mantemos separada para facilitar
 * mudanças futuras (ex: adicionar campos só no wizard)
 */
export interface WizardData {
  projectName: string   // Passo 1: Nome do projeto
  niche: string        // Passo 2: Nicho de mercado
  audience: string     // Passo 3: Público-alvo
  features: string     // Passo 4: Funcionalidades
  platform: string     // Passo 5: Plataforma (bolt/lovable/v0/cursor/outro)
  goal: string         // Passo 6: Objetivo do negócio
  designStyle: string  // Passo 7: Estilo visual (minimalista/moderno/corporativo/criativo)
}

/**
 * Resultado completo da geração de IA
 * 
 * Tudo que o usuário vai receber após a geração:
 * - Os 3 documentos (prompt, prd, research)
 * - Métricas de performance
 * - Resumo do projeto
 */
export interface GenerationResult {
  // Documentos gerados
  prompt: string       // Prompt para Bolt/Lovable/v0/Cursor
  prd: string         // Product Requirements Document
  research: string    // Análise de mercado
  
  // Resumo executivo (para salvar no banco)
  summary: string     // Resumo de 1-2 parágrafos
  
  // Métricas de performance
  metadata: {
    provider: string        // Ex: "openai"
    model: string          // Ex: "gpt-4o-mini"
    tokensUsed: number     // Quanto de crédito foi consumido
    duration: number       // Tempo total em milissegundos
    timestamp: string      // Quando foi gerado
  }
}

/**
 * Motor de IA - Função Principal de Geração
 * 
 * Esta é a função mais importante do MarketForge!
 * Ela orquestra todo o processo de geração:
 * 
 * Fluxo:
 * 1. Recebe dados do wizard
 * 2. Monta prompt estruturado
 * 3. Envia para OpenAI (com retry se falhar)
 * 4. Separa os 3 documentos
 * 5. Gera resumo
 * 6. Calcula métricas
 * 7. Retorna tudo empacotado
 * 
 * @param data - Dados coletados no wizard de 6 passos
 * @param userPlan - Plano do usuário (starter/pro/lifetime)
 * @returns Resultado completo com documentos e métricas
 * 
 * Exemplo de uso:
 * const result = await generateProject(wizardData, 'starter')
 * console.log(result.prompt)     // Prompt para Bolt
 * console.log(result.prd)        // PRD completo
 * console.log(result.research)   // Análise de mercado
 * console.log(result.metadata)   // Quanto custou/demorou
 */
export async function generateProject(
  data: WizardData,
  userPlan: string = 'starter'
): Promise<GenerationResult> {
  
  // ==========================================
  // PASSO 1: Inicializar métricas
  // ==========================================
  
  const startTime = Date.now()
  const timestamp = new Date().toISOString()
  
  console.log('🚀 Iniciando geração de projeto:', data.projectName)
  console.log('📊 Plano do usuário:', userPlan)
  
  try {
    
    // ==========================================
    // PASSO 2: Construir o prompt estruturado
    // ==========================================
    
    console.log('📝 Construindo prompt estruturado...')
    
    const fullPrompt = buildProjectPrompt(data as ProjectData)
    
    console.log(`✅ Prompt construído: ${fullPrompt.length} caracteres`)
    
    
    // ==========================================
    // PASSO 3: Escolher modelo de IA baseado no plano
    // ==========================================
    
    // Plano Starter: usa gpt-4o-mini (mais barato)
    // Plano Pro/Lifetime: usa gpt-4o (mais inteligente)
    const model = userPlan === 'starter' ? 'gpt-4o-mini' : 'gpt-4o'
    
    console.log(`🤖 Modelo selecionado: ${model}`)
    
    
    // ==========================================
    // PASSO 4: Chamar OpenAI com retry automático
    // ==========================================
    
    console.log('🔄 Enviando para OpenAI...')
    
    const aiResult = await openAIProvider.generateWithRetry(
      fullPrompt,
      {
        model: model,
        temperature: 0.7,     // Equilíbrio entre criatividade e consistência
        maxTokens: 4000       // ~16.000 caracteres de resposta
      },
      2  // Tenta até 3 vezes se falhar (0 + 2 retries)
    )
    
    console.log(`✅ OpenAI respondeu: ${aiResult.content.length} caracteres`)
    console.log(`💰 Tokens usados: ${aiResult.tokensUsed}`)
    
    
    // ==========================================
    // PASSO 5: Separar os 3 documentos
    // ==========================================
    
    console.log('📄 Parseando documentos gerados...')
    
    const sections = parseGeneratedContent(aiResult.content)
    
    // Validação: verificar se todos os documentos foram gerados
    if (!sections.prompt || !sections.prd || !sections.research) {
      console.warn('⚠️ Alguns documentos podem estar incompletos')
    }
    
    console.log(`✅ Prompt extraído: ${sections.prompt.length} caracteres`)
    console.log(`✅ PRD extraído: ${sections.prd.length} caracteres`)
    console.log(`✅ Research extraído: ${sections.research.length} caracteres`)
    
    
    // ==========================================
    // PASSO 6: Gerar resumo do projeto
    // ==========================================
    
    console.log('📝 Gerando resumo executivo...')
    
    const summary = generateProjectSummary(data as ProjectData)
    
    console.log(`✅ Resumo: ${summary}`)
    
    
    // ==========================================
    // PASSO 7: Calcular métricas finais
    // ==========================================
    
    const duration = Date.now() - startTime
    
    console.log(`⏱️ Geração concluída em ${duration}ms (${(duration/1000).toFixed(2)}s)`)
    
    
    // ==========================================
    // PASSO 8: Retornar resultado completo
    // ==========================================
    
    return {
      // Os 3 documentos principais
      prompt: sections.prompt,
      prd: sections.prd,
      research: sections.research,
      
      // Resumo executivo
      summary: summary,
      
      // Métricas de performance
      metadata: {
        provider: 'openai',
        model: model,
        tokensUsed: aiResult.tokensUsed,
        duration: duration,
        timestamp: timestamp
      }
    }
    
  } catch (error: any) {
    
    // ==========================================
    // TRATAMENTO DE ERROS
    // ==========================================
    
    console.error('❌ Erro na geração:', error.message)
    
    // Lança erro com mensagem amigável
    throw new Error(`Falha na geração do projeto: ${error.message}`)
  }
}

/**
 * Estima o custo de uma geração baseado no plano
 * 
 * Útil para mostrar ao usuário antes de gerar
 * 
 * @param userPlan - Plano do usuário
 * @returns Estimativa de tokens e custo em USD
 */
export function estimateGenerationCost(userPlan: string = 'starter'): {
  model: string
  estimatedTokens: number
  estimatedCostUSD: number
} {
  const model = userPlan === 'starter' ? 'gpt-4o-mini' : 'gpt-4o'
  
  // Estimativas baseadas em testes
  const estimatedTokens = 3500  // ~3500 tokens por geração
  
  // Custos OpenAI (março 2024)
  // gpt-4o-mini: $0.15 / 1M tokens output
  // gpt-4o: $2.50 / 1M tokens output
  const costPer1MTokens = model === 'gpt-4o-mini' ? 0.15 : 2.50
  
  const estimatedCostUSD = (estimatedTokens / 1_000_000) * costPer1MTokens
  
  return {
    model,
    estimatedTokens,
    estimatedCostUSD: Number(estimatedCostUSD.toFixed(4))
  }
}

/**
 * Valida os dados do wizard antes de gerar
 * 
 * Evita desperdício de tokens da OpenAI com dados inválidos
 * 
 * @param data - Dados do wizard
 * @returns true se válido, lança erro se inválido
 */
export function validateWizardData(data: WizardData): boolean {
  const errors: string[] = []
  
  // Validação 1: Nome do projeto (min 3 chars)
  if (!data.projectName || data.projectName.trim().length < 3) {
    errors.push('Nome do projeto deve ter no mínimo 3 caracteres')
  }
  
  // Validação 2: Nicho (min 10 chars)
  if (!data.niche || data.niche.trim().length < 10) {
    errors.push('Descrição do nicho deve ter no mínimo 10 caracteres')
  }
  
  // Validação 3: Público-alvo (min 10 chars)
  if (!data.audience || data.audience.trim().length < 10) {
    errors.push('Público-alvo deve ter no mínimo 10 caracteres')
  }
  
  // Validação 4: Features (min 20 chars)
  if (!data.features || data.features.trim().length < 20) {
    errors.push('Funcionalidades devem ter no mínimo 20 caracteres')
  }
  
  // Validação 5: Plataforma válida
  const validPlatforms = ['bolt', 'lovable', 'v0', 'cursor', 'outro']
  if (!data.platform || !validPlatforms.includes(data.platform.toLowerCase())) {
    errors.push(`Plataforma deve ser uma de: ${validPlatforms.join(', ')}`)
  }
  
  // Validação 6: Objetivo (min 15 chars)
  if (!data.goal || data.goal.trim().length < 15) {
    errors.push('Objetivo deve ter no mínimo 15 caracteres')
  }
  
  // Se tem erros, lança exceção
  if (errors.length > 0) {
    throw new Error(`Dados inválidos:\n${errors.join('\n')}`)
  }
  
  return true
}

/**
 * Versão do prompt (para tracking)
 * 
 * Útil para A/B testing de diferentes versões de prompts
 * Incremente quando mudar o template de prompts
 */
export const PROMPT_VERSION = '1.0.0'
