import { z } from 'zod'

/**
 * Validações do Wizard de Projetos
 * 
 * Usa Zod para validar os dados ANTES de enviar para a IA.
 * 
 * Por que usar Zod?
 * - Type-safe: TypeScript entende automaticamente os tipos
 * - Mensagens de erro customizadas
 * - Validação robusta (min/max length, regex, etc)
 * - Transformações (trim, lowercase, etc)
 */

/**
 * Schema de validação do wizard de 6 passos
 * 
 * Cada campo tem:
 * - Tipo (string)
 * - Validações (min/max length)
 * - Mensagens de erro amigáveis em português
 */
export const ProjectWizardSchema = z.object({
  
  // ==========================================
  // PASSO 1: Nome do Projeto
  // ==========================================
  projectName: z
    .string({
      required_error: 'Nome do projeto é obrigatório',
      invalid_type_error: 'Nome do projeto deve ser texto'
    })
    .min(3, 'Nome deve ter pelo menos 3 caracteres')
    .max(100, 'Nome não pode ter mais de 100 caracteres')
    .trim()
    .refine(
      (val) => val.length > 0,
      'Nome do projeto não pode ser apenas espaços'
    ),
  
  // ==========================================
  // PASSO 2: Nicho de Mercado
  // ==========================================
  niche: z
    .string({
      required_error: 'Nicho de mercado é obrigatório',
      invalid_type_error: 'Nicho deve ser texto'
    })
    .min(10, 'Descreva o nicho com pelo menos 10 caracteres')
    .max(500, 'Descrição do nicho muito longa (máx 500 caracteres)')
    .trim()
    .refine(
      (val) => val.split(' ').length >= 3,
      'Descreva o nicho com mais detalhes (mínimo 3 palavras)'
    ),
  
  // ==========================================
  // PASSO 3: Público-Alvo
  // ==========================================
  audience: z
    .string({
      required_error: 'Público-alvo é obrigatório',
      invalid_type_error: 'Público-alvo deve ser texto'
    })
    .min(10, 'Descreva o público-alvo com pelo menos 10 caracteres')
    .max(500, 'Descrição do público muito longa (máx 500 caracteres)')
    .trim()
    .refine(
      (val) => val.split(' ').length >= 3,
      'Descreva o público com mais detalhes (mínimo 3 palavras)'
    ),
  
  // ==========================================
  // PASSO 4: Funcionalidades
  // ==========================================
  features: z
    .string({
      required_error: 'Funcionalidades são obrigatórias',
      invalid_type_error: 'Funcionalidades devem ser texto'
    })
    .min(20, 'Liste as funcionalidades com pelo menos 20 caracteres')
    .max(2000, 'Descrição das funcionalidades muito longa (máx 2000 caracteres)')
    .trim()
    .refine(
      (val) => val.split(' ').length >= 5,
      'Descreva as funcionalidades com mais detalhes (mínimo 5 palavras)'
    ),
  
  // ==========================================
  // PASSO 5: Plataforma
  // ==========================================
  platform: z.enum(
    ['bolt', 'lovable', 'v0', 'cursor', 'outro'],
    {
      required_error: 'Selecione uma plataforma',
      invalid_type_error: 'Plataforma inválida'
    }
  ),
  
  // ==========================================
  // PASSO 6: Objetivo do Negócio
  // ==========================================
  goal: z
    .string({
      required_error: 'Objetivo do negócio é obrigatório',
      invalid_type_error: 'Objetivo deve ser texto'
    })
    .min(15, 'Descreva o objetivo com pelo menos 15 caracteres')
    .max(1000, 'Descrição do objetivo muito longa (máx 1000 caracteres)')
    .trim()
    .refine(
      (val) => val.split(' ').length >= 3,
      'Descreva o objetivo com mais detalhes (mínimo 3 palavras)'
    ),
  
  // ==========================================
  // PASSO 7: Estilo Visual
  // ==========================================
  designStyle: z.enum(
    ['minimalista', 'moderno', 'corporativo', 'criativo'],
    {
      required_error: 'Selecione um estilo visual',
      invalid_type_error: 'Estilo visual inválido'
    }
  )
})

/**
 * Tipo TypeScript gerado automaticamente pelo Zod
 * 
 * Usar este tipo garante que:
 * - Os dados estão validados
 * - TypeScript autocompleta os campos
 * - Não há erros de digitação
 */
export type ProjectWizardData = z.infer<typeof ProjectWizardSchema>

/**
 * Valida os dados do wizard e retorna erros formatados
 * 
 * @param data - Dados a serem validados
 * @returns Objeto com success e data/errors
 * 
 * Exemplo de uso:
 * const result = validateProjectData(formData)
 * if (result.success) {
 *   // result.data contém dados validados
 * } else {
 *   // result.errors contém erros formatados
 * }
 */
export function validateProjectData(data: unknown) {
  return ProjectWizardSchema.safeParse(data)
}

/**
 * Valida apenas um campo específico
 * 
 * Útil para validação em tempo real (enquanto usuário digita)
 * 
 * @param field - Nome do campo
 * @param value - Valor a validar
 * @returns Mensagem de erro ou undefined se válido
 */
export function validateField(
  field: keyof ProjectWizardData,
  value: unknown
): string | undefined {
  try {
    const fieldSchema = ProjectWizardSchema.shape[field]
    fieldSchema.parse(value)
    return undefined
  } catch (error) {
    if (error instanceof z.ZodError) {
      // ZodError usa 'issues', não 'errors'
      return error.issues[0]?.message || 'Erro de validação'
    }
    return 'Erro de validação'
  }
}

/**
 * Formata erros do Zod para exibição
 * 
 * Transforma:
 * { projectName: ["Nome muito curto"], niche: ["Campo obrigatório"] }
 * 
 * Em:
 * { projectName: "Nome muito curto", niche: "Campo obrigatório" }
 * 
 * @param errors - Erros do Zod
 * @returns Objeto com mensagens simplificadas
 */
export function formatZodErrors(errors: z.ZodError): Record<string, string> {
  const formatted: Record<string, string> = {}
  
  // ZodError usa 'issues', não 'errors'
  errors.issues.forEach((error) => {
    const field = error.path[0]
    if (field && typeof field === 'string') {
      formatted[field] = error.message
    }
  })
  
  return formatted
}

/**
 * Schema para atualização de projeto (campos opcionais)
 * 
 * Usado quando usuário edita um projeto existente
 */
export const ProjectUpdateSchema = ProjectWizardSchema.partial()

/**
 * Tipo para atualização de projeto
 */
export type ProjectUpdateData = z.infer<typeof ProjectUpdateSchema>

/**
 * Lista de plataformas válidas (para usar em <select>)
 */
export const VALID_PLATFORMS = [
  { value: 'bolt', label: 'Bolt.new' },
  { value: 'lovable', label: 'Lovable.dev' },
  { value: 'v0', label: 'v0.dev (Vercel)' },
  { value: 'cursor', label: 'Cursor AI' },
  { value: 'outro', label: 'Outro' }
] as const

/**
 * Lista de estilos visuais disponíveis
 */
export const DESIGN_STYLES = [
  { 
    value: 'minimalista', 
    label: 'Minimalista',
    description: 'Clean, espaços em branco, tipografia elegante, cores neutras',
    icon: '⚪️'
  },
  { 
    value: 'moderno', 
    label: 'Moderno',
    description: 'Gradientes, glassmorphism, animações suaves, cores vibrantes',
    icon: '🎨'
  },
  { 
    value: 'corporativo', 
    label: 'Corporativo',
    description: 'Profissional, sóbrio, confiável, azul e cinza predominantes',
    icon: '💼'
  },
  { 
    value: 'criativo', 
    label: 'Criativo',
    description: 'Ousado, ilustrações, formas orgânicas, paleta expressiva',
    icon: '✨'
  }
] as const

/**
 * Exemplos de preenchimento para ajudar o usuário
 */
export const FIELD_EXAMPLES = {
  projectName: 'Ex: EcoVendas Pro, FitApp Coach, DeliveryRápido',
  
  niche: 'Ex: E-commerce de produtos sustentáveis, App de treinos personalizados, Delivery de comida saudável',
  
  audience: 'Ex: Mulheres 25-45 anos, classe média, conscientes ambientalmente',
  
  features: 'Ex: Catálogo de produtos, Carrinho de compras, Checkout com PIX, Rastreamento de pedidos, Sistema de avaliações',
  
  platform: 'Escolha a plataforma onde você vai desenvolver o projeto',
  
  goal: 'Ex: Alcançar R$ 50.000 em vendas mensais nos primeiros 6 meses',
  
  designStyle: 'Escolha o estilo visual que melhor representa seu projeto'
} as const

/**
 * Placeholders para inputs
 */
export const FIELD_PLACEHOLDERS = {
  projectName: 'Digite o nome do seu projeto...',
  niche: 'Descreva o nicho de mercado...',
  audience: 'Quem é o público-alvo?',
  features: 'Liste as principais funcionalidades...',
  goal: 'Qual o objetivo principal?'
} as const

/**
 * Labels dos campos
 */
export const FIELD_LABELS = {
  projectName: 'Nome do Projeto',
  niche: 'Nicho de Mercado',
  audience: 'Público-Alvo',
  features: 'Funcionalidades Principais',
  platform: 'Plataforma de Desenvolvimento',
  goal: 'Objetivo do Negócio',
  designStyle: 'Estilo Visual'
} as const

/**
 * Descrições/dicas dos campos
 */
export const FIELD_DESCRIPTIONS = {
  projectName: 'Escolha um nome criativo e memorável para o projeto',
  
  niche: 'Descreva o segmento de mercado e o tipo de solução que está criando',
  
  audience: 'Defina claramente quem são seus usuários ideais (idade, gênero, interesses, comportamento)',
  
  features: 'Liste as funcionalidades essenciais que o projeto deve ter. Seja específico!',
  
  platform: 'Onde você vai desenvolver o projeto? Escolha a plataforma que você prefere usar',
  
  goal: 'Qual resultado você quer alcançar? Seja específico e mensurável (ex: número de usuários, vendas, etc)',
  
  designStyle: 'Selecione o estilo visual que será aplicado em todas as recomendações de design (cores, tipografia, componentes)'
} as const
