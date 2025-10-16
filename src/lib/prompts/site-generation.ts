/**
 * Templates de Prompts para Geração de Projetos
 * 
 * Este arquivo é o "cérebro" do MarketForge - define exatamente
 * o que a IA deve gerar quando o usuário preenche o wizard.
 */

/**
 * Dados do projeto coletados no wizard de 7 passos
 */
export interface ProjectData {
  projectName: string   // Ex: "EcoVendas Pro"
  niche: string        // Ex: "E-commerce de produtos sustentáveis"
  audience: string     // Ex: "Mulheres 25-45 anos, classe média, conscientes"
  features: string     // Ex: "Catálogo, carrinho, pagamento PIX"
  platform: string     // Ex: "bolt", "lovable", "v0", "cursor", "outro"
  goal: string         // Ex: "Aumentar vendas online em 200%"
  designStyle: string  // Ex: "minimalista", "moderno", "corporativo", "criativo"
}

/**
 * Retorna as diretrizes de design específicas para cada estilo visual
 * 
 * @param style - Estilo visual escolhido
 * @returns String com as diretrizes detalhadas
 */
function getDesignGuidelines(style: string): string {
  const guidelines: Record<string, string> = {
    minimalista: `
**Características do Estilo Minimalista:**
• Paleta de cores: Branco (#FFFFFF), Preto (#000000), Cinza claro (#F5F5F5), Cinza médio (#9CA3AF)
• Tipografia: Sans-serif clean e elegante (Inter, Helvetica Neue, SF Pro)
• Espaçamentos: Generosos - padding e margin grandes para criar respiração visual
• Componentes: Bordas finas (1px), sem sombras pesadas, formas geométricas simples
• Layout: Grid limpo e organizado, muito espaço em branco, hierarquia clara
• Botões: Simples, texto preto em fundo branco com borda fina, ou inverso
• Cards: Fundo branco, borda sutil, sem elevação
• Animações: Mínimas ou inexistentes, transições suaves quando necessárias
`,
    moderno: `
**Características do Estilo Moderno:**
• Paleta de cores: Gradientes vibrantes (Purple #A855F7 → Blue #3B82F6), cores saturadas
• Tipografia: Sans-serif moderno (Poppins, Montserrat, DM Sans)
• Espaçamentos: Balanceados, confortáveis
• Componentes: Bordas arredondadas (8-16px), sombras suaves, glassmorphism (backdrop-blur)
• Layout: Cards flutuantes, sobreposições, camadas
• Botões: Gradientes, bordas arredondadas, hover effects interessantes
• Cards: Fundo com blur, bordas arredondadas, elevação com sombra colorida
• Animações: Micro-animações ao hover, transições suaves, efeitos parallax
`,
    corporativo: `
**Características do Estilo Corporativo:**
• Paleta de cores: Azul profissional (#0066CC, #1E40AF), Cinza (#4B5563, #6B7280), Branco (#FFFFFF)
• Tipografia: Sans-serif profissional e legível (Roboto, Open Sans, Lato)
• Espaçamentos: Conservadores, estruturados
• Componentes: Bordas retas ou levemente arredondadas (4px), sem efeitos chamativos
• Layout: Grade estruturada, hierarquia rígida, alinhamento preciso
• Botões: Sólidos, azul ou cinza, texto branco, bordas retas
• Cards: Fundo branco, borda sutil cinza, sombra leve
• Animações: Mínimas, apenas quando necessário para UX
`,
    criativo: `
**Características do Estilo Criativo:**
• Paleta de cores: Cores vibrantes e contrastantes (#FF6B6B, #4ECDC4, #FFE66D, #A8E6CF)
• Tipografia: Mix criativo - Serif para títulos (Playfair, Merriweather) + Sans-serif para corpo
• Espaçamentos: Assimétricos, ousados, quebras inesperadas
• Componentes: Formas orgânicas, bordas irregulares, ilustrações custom
• Layout: Quebras de grid, elementos sobrepostos, assimetria intencional
• Botões: Formatos únicos, cores vibrantes, efeitos criativos
• Cards: Formas não-retangulares, ilustrações de fundo, bordas criativas
• Animações: Ousadas, criativas, interações surpreendentes
`
  }
  
  return guidelines[style] || guidelines.moderno
}

/**
 * Constrói o prompt estruturado que será enviado para a OpenAI
 * 
 * Este é o prompt "mestre" que instrui a IA a gerar 3 documentos:
 * 1. PROMPT - Instruções para Bolt/Lovable/v0/Cursor
 * 2. PRD - Product Requirements Document (documento técnico)
 * 3. RESEARCH - Análise de mercado e concorrentes
 * 
 * @param data - Dados coletados do wizard
 * @returns String com o prompt completo e estruturado
 * 
 * Por que usar marcadores BEGIN/END?
 * - Facilita separar os 3 documentos depois
 * - A IA entende onde começa e termina cada seção
 * - Evita misturar conteúdos
 */
export function buildProjectPrompt(data: ProjectData): string {
  return `
Você é um Product Manager Sênior especializado em criar especificações técnicas completas.
Seu trabalho é analisar as informações do projeto e gerar 3 documentos profissionais em português brasileiro.

═══════════════════════════════════════════════════════════════
📋 INFORMAÇÕES DO PROJETO
═══════════════════════════════════════════════════════════════

🎯 Nome do Projeto: ${data.projectName}

📊 Nicho de Mercado: ${data.niche}

👥 Público-Alvo: ${data.audience}

⚙️ Funcionalidades Principais: ${data.features}

🛠️ Plataforma de Desenvolvimento: ${data.platform}

🎯 Objetivo do Negócio: ${data.goal}

🎨 Estilo Visual: ${data.designStyle.toUpperCase()}

═══════════════════════════════════════════════════════════════
🎨 DIRETRIZES DE DESIGN (${data.designStyle.toUpperCase()})
═══════════════════════════════════════════════════════════════

${getDesignGuidelines(data.designStyle)}

**IMPORTANTE:** Adapte TODAS as recomendações de design (cores, tipografia, 
componentes, layout, espaçamentos, animações) para o estilo ${data.designStyle}.

═══════════════════════════════════════════════════════════════
📝 INSTRUÇÕES DE GERAÇÃO
═══════════════════════════════════════════════════════════════



Gere 3 documentos separados com os marcadores EXATOS abaixo:

---BEGIN_PROMPT---
[Aqui você deve criar um prompt COMPLETO e ESTRUTURADO para ser usado em ${data.platform}]

O prompt deve conter:

1. VISÃO GERAL
   - Descrição do projeto em 2-3 parágrafos
   - Problema que resolve
   - Público-alvo detalhado

2. ARQUITETURA E STACK
   - Framework recomendado (Next.js, React, Vue, etc)
   - Banco de dados sugerido
   - Serviços necessários (auth, pagamento, etc)
   - Justificativa técnica de cada escolha

3. FUNCIONALIDADES DETALHADAS
   - Liste CADA funcionalidade mencionada
   - Para cada uma, descreva:
     * Como deve funcionar
     * Fluxo do usuário
     * Regras de negócio
     * Validações necessárias

4. IDENTIDADE VISUAL (Estilo: ${data.designStyle})
   - Paleta de cores sugerida (com códigos hex) - SEGUIR ESTILO ${data.designStyle.toUpperCase()}
   - Tipografia (fontes) - SEGUIR ESTILO ${data.designStyle.toUpperCase()}
   - Componentes UI (botões, cards, inputs) - SEGUIR ESTILO ${data.designStyle.toUpperCase()}
   - Layout e espaçamentos - SEGUIR ESTILO ${data.designStyle.toUpperCase()}
   - Referências visuais compatíveis com ${data.designStyle}

5. FLUXOS DE USUÁRIO
   - Jornada completa do usuário
   - Páginas necessárias
   - Navegação entre telas

6. CRITÉRIOS DE SUCESSO
   - Métricas a serem acompanhadas
   - KPIs importantes
   - Como medir o objetivo: ${data.goal}

Seja ULTRA-ESPECÍFICO. Este prompt será usado diretamente em ${data.platform}.
---END_PROMPT---

---BEGIN_PRD---
# PRD: ${data.projectName}

## 1. CONTEXTO E PROBLEMA

### 1.1 Cenário Atual
[Descreva o problema ou oportunidade de mercado]

### 1.2 Solução Proposta
[Como este projeto resolve o problema]

## 2. OBJETIVOS

### 2.1 Objetivo Principal
${data.goal}

### 2.2 Objetivos Secundários
- [Liste 3-5 objetivos específicos e mensuráveis]

## 3. PÚBLICO-ALVO

### 3.1 Persona Primária
- **Dados Demográficos**: ${data.audience}
- **Comportamento**: [Hábitos digitais, preferências]
- **Dores**: [3-5 problemas principais]
- **Motivações**: [O que os motiva a usar o produto]

## 4. REQUISITOS FUNCIONAIS

### 4.1 Features Essenciais (MVP)
${data.features}

Para cada feature acima, detalhe:
- **Descrição**: O que faz
- **Comportamento**: Como funciona
- **Regras**: Validações e restrições
- **Prioridade**: Alta/Média/Baixa

### 4.2 Features Futuras (Roadmap)
[Funcionalidades para versões posteriores]

## 5. REQUISITOS NÃO-FUNCIONAIS

### 5.1 Performance
- Tempo de carregamento: < 2s
- Responsividade: Mobile-first
- SEO: Otimizado para buscadores

### 5.2 Segurança
- Autenticação: [Método]
- Proteção de dados: LGPD compliant
- SSL/TLS obrigatório

### 5.3 Escalabilidade
- Suporte para [X] usuários simultâneos
- Arquitetura serverless/cloud

## 6. STACK TECNOLÓGICA

### 6.1 Frontend
- Framework: [Recomendação baseada em ${data.platform}]
- UI Library: [shadcn/ui, Material, etc]
- Styling: [Tailwind, CSS-in-JS]

### 6.2 Backend
- Runtime: [Node.js, Python, etc]
- Database: [PostgreSQL, MongoDB, etc]
- API: [REST, GraphQL, tRPC]

### 6.3 Serviços Terceiros
- Auth: [Clerk, Auth0, Supabase Auth]
- Pagamentos: [Stripe, Kiwify, Mercado Pago]
- Email: [Resend, SendGrid]
- Storage: [S3, Cloudinary]

## 7. CASOS DE USO

### 7.1 Caso de Uso 1: [Nome]
- **Ator**: [Tipo de usuário]
- **Pré-condições**: [O que precisa existir antes]
- **Fluxo Principal**: [Passo a passo]
- **Pós-condições**: [Estado final]

[Repita para 3-5 casos de uso principais]

## 8. MÉTRICAS DE SUCESSO

### 8.1 KPIs Principais
- [Métrica 1]: [Meta]
- [Métrica 2]: [Meta]
- [Métrica 3]: [Meta]

### 8.2 Analytics
- Ferramentas: Google Analytics, Hotjar, etc
- Eventos a rastrear: [Liste eventos importantes]

## 9. CRONOGRAMA SUGERIDO

### Fase 1 - MVP (2-4 semanas)
- [Features essenciais]

### Fase 2 - Melhorias (2-3 semanas)
- [Features secundárias]

### Fase 3 - Escala (ongoing)
- [Otimizações e crescimento]

## 10. RISCOS E MITIGAÇÕES

| Risco | Probabilidade | Impacto | Mitigação |
|-------|---------------|---------|-----------|
| [Risco 1] | Alta/Média/Baixa | Alto/Médio/Baixo | [Como evitar] |

---END_PRD---

---BEGIN_RESEARCH---
# Análise de Mercado: ${data.projectName}

## 1. ANÁLISE DO NICHO

### 1.1 Tamanho do Mercado
- **Nicho**: ${data.niche}
- **Potencial de Mercado**: [Estimativa de volume]
- **Crescimento**: [Tendência: crescendo/estável/declinando]

### 1.2 Tendências
[Liste 3-5 tendências relevantes para ${data.niche}]

## 2. ANÁLISE DE CONCORRENTES

### 2.1 Concorrente Direto #1
- **Nome**: [Nome do produto/serviço]
- **URL**: [Site se aplicável]
- **Pontos Fortes**: [3-5 pontos]
- **Pontos Fracos**: [3-5 pontos]
- **Preço**: [Modelo de precificação]
- **Diferenciais**: [O que eles fazem bem]

### 2.2 Concorrente Direto #2
[Mesma estrutura acima]

### 2.3 Concorrente Indireto #3
[Soluções alternativas ao problema]

## 3. ANÁLISE DE PÚBLICO

### 3.1 Persona Detalhada
Baseado em: ${data.audience}

**Demographics:**
- Idade: [Faixa etária]
- Gênero: [Distribuição]
- Localização: [Geográfica]
- Renda: [Faixa salarial]

**Psychographics:**
- Valores: [O que é importante]
- Estilo de vida: [Como vivem]
- Comportamento online: [Redes, horários]

**Dores e Necessidades:**
1. [Dor principal]
2. [Dor secundária]
3. [Necessidade não atendida]

**Objeções Potenciais:**
1. [Por que não compraria]
2. [Barreiras à adoção]

## 4. DIFERENCIAIS COMPETITIVOS

### 4.1 Proposta de Valor Única (UVP)
[O que ${data.projectName} faz de DIFERENTE dos concorrentes]

### 4.2 Vantagens Competitivas
1. **[Diferencial 1]**: [Por que importa]
2. **[Diferencial 2]**: [Por que importa]
3. **[Diferencial 3]**: [Por que importa]

## 5. ESTRATÉGIA DE GO-TO-MARKET

### 5.1 Canais de Aquisição
Considerando público: ${data.audience}

**Canal 1: [Nome]**
- Tática: [Como usar]
- Custo: [Estimativa]
- ROI esperado: [Previsão]

**Canal 2: [Nome]**
[Mesma estrutura]

**Canal 3: [Nome]**
[Mesma estrutura]

### 5.2 Estratégia de Conteúdo
- Tópicos: [Temas relevantes para o público]
- Formatos: [Blog, vídeo, podcast]
- Frequência: [Cadência de publicação]

## 6. MODELO DE MONETIZAÇÃO

### 6.1 Opções Recomendadas
Considerando objetivo: ${data.goal}

**Opção 1: [Modelo]**
- Descrição: [Como funciona]
- Vantagens: [Benefícios]
- Desvantagens: [Limitações]

**Opção 2: [Modelo Alternativo]**
[Mesma estrutura]

### 6.2 Precificação Sugerida
- **Plano Básico**: R$ [Valor] - [O que inclui]
- **Plano Premium**: R$ [Valor] - [O que inclui]
- **Plano Enterprise**: R$ [Valor] - [O que inclui]

**Justificativa**: [Por que esses valores]

## 7. VIABILIDADE

### 7.1 Técnica
- **Complexidade**: [Baixa/Média/Alta]
- **Tempo de Desenvolvimento**: [Estimativa]
- **Recursos Necessários**: [Equipe, ferramentas]

### 7.2 Financeira
- **Investimento Inicial**: R$ [Estimativa]
- **Custo Mensal Operacional**: R$ [Estimativa]
- **Break-even**: [Quando se paga]
- **ROI Projetado**: [% em X meses]

### 7.3 Mercado
- **Demanda**: [Alta/Média/Baixa]
- **Competição**: [Baixa/Média/Alta]
- **Oportunidade**: [Score de 1-10 com justificativa]

## 8. RECOMENDAÇÕES FINAIS

### 8.1 Próximos Passos Imediatos
1. [Ação prioritária 1]
2. [Ação prioritária 2]
3. [Ação prioritária 3]

### 8.2 Alertas e Considerações
⚠️ [Pontos de atenção importantes]

### 8.3 Potencial de Sucesso
**Score: [X/10]**
**Justificativa**: [Análise baseada nos dados acima]

---END_RESEARCH---

═══════════════════════════════════════════════════════════════
⚠️ INSTRUÇÕES FINAIS IMPORTANTES
═══════════════════════════════════════════════════════════════

1. Use SEMPRE os marcadores BEGIN/END exatamente como mostrado
2. Preencha TODAS as seções com conteúdo relevante e específico
3. Não use placeholder genéricos - seja específico para ${data.projectName}
4. Baseie-se nas informações fornecidas: nicho, público, features, objetivo
5. Escreva em português brasileiro profissional
6. Seja detalhista - quanto mais informação, melhor
7. Foque em actionable insights, não teoria genérica

Gere agora os 3 documentos completos e profissionais.
`.trim()
}

/**
 * Extrai os 3 documentos do conteúdo gerado pela IA
 * 
 * A IA retorna um texto gigante com 3 documentos misturados.
 * Esta função separa cada um usando os marcadores BEGIN/END.
 * 
 * @param content - Conteúdo completo retornado pela OpenAI
 * @returns Objeto com os 3 documentos separados
 * 
 * Como funciona:
 * 1. Procura por "---BEGIN_PROMPT---" e "---END_PROMPT---"
 * 2. Extrai tudo que está entre eles
 * 3. Repete para PRD e RESEARCH
 * 4. Se não encontrar algum marcador, retorna o conteúdo completo
 * 
 * Regex usado: /---BEGIN_X---([\s\S]*?)---END_X---/
 * - [\s\S]* = qualquer caractere (incluindo quebras de linha)
 * - *? = não-greedy (para no primeiro END encontrado)
 */
export function parseGeneratedContent(content: string): {
  prompt: string
  prd: string
  research: string
} {
  // Regex para capturar o PROMPT
  const promptMatch = content.match(/---BEGIN_PROMPT---([\s\S]*?)---END_PROMPT---/)
  
  // Regex para capturar o PRD
  const prdMatch = content.match(/---BEGIN_PRD---([\s\S]*?)---END_PRD---/)
  
  // Regex para capturar o RESEARCH
  // Nota: não precisa do END porque é o último documento
  const researchMatch = content.match(/---BEGIN_RESEARCH---([\s\S]*)/)

  return {
    // Se encontrou, usa o grupo capturado [1] e remove espaços das pontas
    // Se não encontrou, retorna o conteúdo completo (fallback)
    prompt: promptMatch ? promptMatch[1].trim() : content,
    
    prd: prdMatch ? prdMatch[1].trim() : '',
    
    research: researchMatch ? researchMatch[1].trim() : ''
  }
}

/**
 * Valida se o conteúdo gerado contém os 3 documentos
 * 
 * Útil para verificar se a IA seguiu as instruções corretamente
 * 
 * @param content - Conteúdo gerado pela IA
 * @returns true se contém os 3 marcadores, false caso contrário
 */
export function validateGeneratedContent(content: string): boolean {
  const hasPrompt = content.includes('---BEGIN_PROMPT---') && content.includes('---END_PROMPT---')
  const hasPrd = content.includes('---BEGIN_PRD---') && content.includes('---END_PRD---')
  const hasResearch = content.includes('---BEGIN_RESEARCH---')
  
  return hasPrompt && hasPrd && hasResearch
}

/**
 * Gera um resumo executivo do projeto
 * 
 * Útil para salvar no banco e exibir em listas
 * 
 * @param data - Dados do projeto
 * @returns String com resumo de 1-2 parágrafos
 */
export function generateProjectSummary(data: ProjectData): string {
  return `${data.projectName} é um projeto focado em ${data.niche}, direcionado para ${data.audience}. O objetivo principal é ${data.goal}. As funcionalidades principais incluem: ${data.features}.`
}
