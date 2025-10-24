import OpenAI from 'openai'

/**
 * Opções de configuração para geração de conteúdo com IA
 * 
 * model: Qual IA usar (gpt-4o-mini é mais barato, gpt-4o é mais inteligente)
 * temperature: Criatividade (0 = robótico, 1 = criativo)
 * maxTokens: Tamanho máximo da resposta (1 token ≈ 4 caracteres)
 */
interface GenerationOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

/**
 * Resultado da geração de conteúdo
 */
interface GenerationResult {
  content: string      // Texto gerado pela IA
  tokensUsed: number   // Quanto de "crédito" foi usado
}

/**
 * Provider OpenAI - Responsável por toda comunicação com a API da OpenAI
 * 
 * O que esta classe faz:
 * - Conecta com a OpenAI usando sua API key
 * - Envia prompts e recebe respostas
 * - Trata erros (sem créditos, API fora do ar, etc)
 * - Faz retry automático se falhar
 */
export class OpenAIProvider {
  private client: OpenAI

  /**
   * Construtor - Inicializa a conexão com OpenAI
   * 
   * Valida se a API key existe antes de permitir uso
   * Se não existir, lança erro para avisar o desenvolvedor
   */
  constructor() {
    // 🔍 DEBUG: Verificar API Key no construtor
    console.log('=== DEBUG OPENAI PROVIDER ===')
    console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
    console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
    console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false)
    console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined')
    console.log('OPENAI_API_KEY last 10 chars:', process.env.OPENAI_API_KEY?.substring(-10) || 'undefined')
    console.log('================================')
    
    if (!process.env.OPENAI_API_KEY) {
      throw new Error(
        '❌ OPENAI_API_KEY não configurada! Adicione no arquivo .env.local'
      )
    }

    this.client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    })
  }

  /**
   * Método Principal - Gera conteúdo usando a IA
   * 
   * @param prompt - O que você quer que a IA faça (ex: "Crie um site de vendas")
   * @param options - Configurações opcionais (modelo, temperatura, etc)
   * @returns Objeto com o conteúdo gerado e tokens usados
   * 
   * Exemplo de uso:
   * const result = await provider.generate("Crie uma landing page")
   * console.log(result.content) // Resposta da IA
   * console.log(result.tokensUsed) // Quanto custou
   */
  async generate(
    prompt: string, 
    options: GenerationOptions = {}
  ): Promise<GenerationResult> {
    // Valores padrão se não forem especificados
    const {
      model = 'gpt-4o-mini',        // Modelo padrão (mais barato)
      temperature = 0.7,             // Equilíbrio entre criativo e consistente
      maxTokens = 4000               // ~16.000 caracteres de resposta
    } = options

    try {
      // Chama a API da OpenAI
      const completion = await this.client.chat.completions.create({
        model,
        messages: [
          { 
            role: 'system', 
            content: 'Você é um Senior Product Designer + Tech Lead experiente que cria especificações técnicas detalhadas em português brasileiro.' 
          },
          { 
            role: 'user', 
            content: prompt 
          }
        ],
        temperature,
        max_tokens: maxTokens
      })

      // Extrai a resposta
      const content = completion.choices[0].message.content || ''
      const tokensUsed = completion.usage?.total_tokens || 0

      return {
        content,
        tokensUsed
      }

    } catch (error: any) {
      // Tratamento de erros específicos
      
      // Erro 1: Sem créditos na OpenAI
      if (error.code === 'insufficient_quota') {
        throw new Error(
          '💳 Créditos OpenAI esgotados! Adicione créditos em https://platform.openai.com/account/billing'
        )
      }
      
      // Erro 2: API key inválida
      if (error.status === 401) {
        throw new Error(
          '🔑 API Key inválida! Verifique sua OPENAI_API_KEY no .env.local'
        )
      }
      
      // Erro 3: Rate limit (muitas requisições)
      if (error.status === 429) {
        throw new Error(
          '⏱️ Muitas requisições! Aguarde alguns segundos e tente novamente.'
        )
      }
      
      // Erro genérico
      throw new Error(`Erro OpenAI: ${error.message}`)
    }
  }

  /**
   * Método com Retry Automático - Tenta novamente se falhar
   * 
   * Backoff Exponencial: 
   * - 1ª tentativa: imediato
   * - 2ª tentativa: espera 2s
   * - 3ª tentativa: espera 4s
   * - 4ª tentativa: espera 8s
   * 
   * @param prompt - O que você quer que a IA faça
   * @param options - Configurações de geração
   * @param retries - Quantas vezes tentar novamente se falhar
   * @param currentAttempt - Tentativa atual (usado internamente para o backoff)
   * @returns Resultado da geração
   * 
   * Exemplo de uso:
   * // Tenta até 3 vezes se a OpenAI estiver lenta
   * const result = await provider.generateWithRetry(prompt, {}, 3)
   */
  async generateWithRetry(
    prompt: string, 
    options: GenerationOptions = {},
    retries: number = 2,
    currentAttempt: number = 0
  ): Promise<GenerationResult> {
    try {
      // Tenta gerar normalmente
      return await this.generate(prompt, options)
      
    } catch (error: any) {
      // Se ainda tem tentativas disponíveis
      if (retries > 0) {
        // Calcula tempo de espera: 2^tentativa * 1000ms
        // Tentativa 1: 2^1 = 2s
        // Tentativa 2: 2^2 = 4s
        // Tentativa 3: 2^3 = 8s
        const backoffTime = Math.pow(2, currentAttempt + 1) * 1000
        
        console.log(
          `⚠️ Erro na tentativa ${currentAttempt + 1}. Tentando novamente em ${backoffTime/1000}s...`
        )
        
        // Espera o tempo calculado
        await new Promise(resolve => setTimeout(resolve, backoffTime))
        
        // Tenta novamente (recursivo)
        return this.generateWithRetry(
          prompt, 
          options, 
          retries - 1,
          currentAttempt + 1
        )
      }
      
      // Se acabaram as tentativas, lança o erro
      throw error
    }
  }
}

/**
 * Singleton - Instância única do OpenAIProvider
 * 
 * Por que usar singleton?
 * - Evita criar múltiplas conexões com a OpenAI
 * - Economiza memória
 * - Garante que todos usem a mesma configuração
 * 
 * Como usar em outros arquivos:
 * import { openAIProvider } from '@/lib/ai/providers/openai'
 * const result = await openAIProvider.generate("meu prompt")
 */
export const openAIProvider = new OpenAIProvider()
