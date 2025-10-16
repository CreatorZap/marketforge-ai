import { createClient } from '@/lib/supabase/server'

/**
 * Tipos de quota disponíveis no sistema
 * 
 * - projects: Geração de projetos (Prompt + PRD + Research)
 * - proposals: Geração de propostas comerciais (Sprint 3)
 * - contracts: Geração de contratos de serviços (Sprint 3)
 */
export type QuotaType = 'projects' | 'proposals' | 'contracts'

/**
 * Status da quota do usuário
 * 
 * Contém todas as informações sobre o uso e limites
 */
export interface QuotaStatus {
  allowed: boolean        // Se o usuário pode usar o recurso
  remaining: number       // Quantos ainda restam no mês
  limit: number          // Limite total do plano
  used: number           // Quantos já foram usados
  message?: string       // Mensagem de erro (se allowed = false)
}

/**
 * Serviço de Quotas - Controla limites de uso
 * 
 * O MarketForge tem 3 planos:
 * 
 * 1. STARTER (Gratuito)
 *    - 10 projetos/mês
 *    - 3 propostas/mês
 *    - 1 contrato/mês
 * 
 * 2. PRO (Pago)
 *    - Projetos ilimitados
 *    - Propostas ilimitadas
 *    - Contratos ilimitados
 * 
 * 3. LIFETIME (Pagamento único)
 *    - Projetos ilimitados
 *    - Propostas ilimitadas
 *    - Contratos ilimitados
 *    - 500 créditos bônus
 * 
 * Este serviço garante que:
 * - Usuários não ultrapassem seus limites
 * - Quotas sejam resetadas mensalmente
 * - Consumo seja rastreado corretamente
 */
export class QuotaService {
  
  /**
   * Verifica se o usuário pode usar um recurso
   * 
   * Consulta o banco de dados para:
   * 1. Buscar quota do usuário
   * 2. Comparar uso atual vs limite
   * 3. Retornar se está permitido + informações
   * 
   * @param userId - ID do usuário (UUID do Supabase Auth)
   * @param type - Tipo de quota (projects/proposals/contracts)
   * @returns Status completo da quota
   * 
   * Exemplo de uso:
   * const status = await QuotaService.checkQuota(userId, 'projects')
   * if (status.allowed) {
   *   // Pode gerar projeto
   * } else {
   *   // Mostrar mensagem: status.message
   * }
   */
  static async checkQuota(
    userId: string,
    type: QuotaType
  ): Promise<QuotaStatus> {
    
    // ==========================================
    // PASSO 1: Conectar com Supabase
    // ==========================================
    
    const supabase = await createClient()
    
    
    // ==========================================
    // PASSO 2: Buscar quota do usuário
    // ==========================================
    
    const { data: quota, error } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', userId)
      .single()  // Espera 1 resultado (cada usuário tem 1 quota)
    
    // Se deu erro ou não encontrou quota
    if (error || !quota) {
      console.error('❌ Erro ao buscar quota:', error?.message)
      
      return {
        allowed: false,
        remaining: 0,
        limit: 0,
        used: 0,
        message: 'Erro ao verificar quotas. Tente novamente.'
      }
    }
    
    
    // ==========================================
    // PASSO 3: Determinar colunas do banco
    // ==========================================
    
    // Tabela user_quotas tem:
    // - monthly_projects_limit
    // - monthly_proposals_limit
    // - monthly_contracts_limit
    // - projects_used
    // - proposals_used
    // - contracts_used
    
    const limitColumn = `monthly_${type}_limit` as keyof typeof quota
    const usedColumn = `${type}_used` as keyof typeof quota
    
    const limit = quota[limitColumn] as number
    const used = quota[usedColumn] as number
    
    
    // ==========================================
    // PASSO 4: Verificar se é ilimitado
    // ==========================================
    
    // Planos Pro e Lifetime têm limite = 999999 (ilimitado)
    const isUnlimited = limit >= 999999
    
    if (isUnlimited) {
      return {
        allowed: true,
        remaining: Infinity,
        limit: Infinity,
        used: used
      }
    }
    
    
    // ==========================================
    // PASSO 5: Calcular quota restante
    // ==========================================
    
    const remaining = limit - used
    const allowed = remaining > 0
    
    
    // ==========================================
    // PASSO 6: Retornar status
    // ==========================================
    
    return {
      allowed,
      remaining: Math.max(0, remaining),
      limit,
      used,
      message: allowed 
        ? undefined 
        : `Limite de ${limit} ${type} atingido este mês. ${this.getUpgradeMessage(type)}`
    }
  }
  
  /**
   * Consome 1 unidade de quota
   * 
   * Após gerar um projeto/proposta/contrato com sucesso,
   * esta função DEVE ser chamada para incrementar o contador.
   * 
   * Usa a função SQL `increment_usage` do banco de dados
   * que faz o incremento de forma atômica (evita race conditions)
   * 
   * @param userId - ID do usuário
   * @param type - Tipo de quota a consumir
   * @returns true se sucesso, false se falhou
   * 
   * Exemplo de uso:
   * // 1. Verificar se pode
   * const status = await QuotaService.checkQuota(userId, 'projects')
   * if (!status.allowed) return
   * 
   * // 2. Gerar projeto
   * const result = await generateProject(data)
   * 
   * // 3. Consumir quota
   * await QuotaService.consumeQuota(userId, 'projects')
   */
  static async consumeQuota(
    userId: string,
    type: QuotaType
  ): Promise<boolean> {
    
    // ==========================================
    // PASSO 1: Conectar com Supabase
    // ==========================================
    
    const supabase = await createClient()
    
    
    // ==========================================
    // PASSO 2: Chamar função SQL increment_usage
    // ==========================================
    
    // Esta função foi criada no schema SQL e faz:
    // UPDATE user_quotas 
    // SET projects_used = projects_used + 1
    // WHERE user_id = userId
    
    const { error } = await supabase.rpc('increment_usage', {
      p_user_id: userId,
      p_type: type
    })
    
    if (error) {
      console.error('❌ Erro ao consumir quota:', error.message)
      return false
    }
    
    console.log(`✅ Quota consumida: ${type} para usuário ${userId}`)
    return true
  }
  
  /**
   * Retorna quota status de TODOS os tipos para dashboard
   * 
   * Útil para exibir uma visão geral no dashboard do usuário
   * 
   * @param userId - ID do usuário
   * @returns Status de projects, proposals e contracts
   */
  static async getAllQuotas(userId: string): Promise<{
    projects: QuotaStatus
    proposals: QuotaStatus
    contracts: QuotaStatus
  }> {
    const [projects, proposals, contracts] = await Promise.all([
      this.checkQuota(userId, 'projects'),
      this.checkQuota(userId, 'proposals'),
      this.checkQuota(userId, 'contracts')
    ])
    
    return { projects, proposals, contracts }
  }
  
  /**
   * Verifica se usuário tem plano ilimitado
   * 
   * @param userId - ID do usuário
   * @returns true se Pro ou Lifetime
   */
  static async hasUnlimitedPlan(userId: string): Promise<boolean> {
    const supabase = await createClient()
    
    const { data: quota } = await supabase
      .from('user_quotas')
      .select('plan')
      .eq('user_id', userId)
      .single()
    
    return quota?.plan === 'pro' || quota?.plan === 'lifetime'
  }
  
  /**
   * Retorna o plano do usuário
   * 
   * @param userId - ID do usuário
   * @returns 'starter' | 'pro' | 'lifetime' | null
   */
  static async getUserPlan(userId: string): Promise<string | null> {
    const supabase = await createClient()
    
    const { data: quota } = await supabase
      .from('user_quotas')
      .select('plan')
      .eq('user_id', userId)
      .single()
    
    return quota?.plan || null
  }
  
  /**
   * Mensagem de upgrade personalizada por tipo
   * 
   * @param type - Tipo de quota
   * @returns Mensagem sugerindo upgrade
   */
  private static getUpgradeMessage(type: QuotaType): string {
    const messages = {
      projects: 'Faça upgrade para Pro e gere projetos ilimitados!',
      proposals: 'Faça upgrade para Pro e gere propostas ilimitadas!',
      contracts: 'Faça upgrade para Pro e gere contratos ilimitados!'
    }
    
    return messages[type]
  }
  
  /**
   * Formata quota para exibição na UI
   * 
   * @param status - Status da quota
   * @returns String formatada (ex: "7/10" ou "∞")
   */
  static formatQuotaDisplay(status: QuotaStatus): string {
    if (status.limit === Infinity) {
      return '∞'
    }
    
    return `${status.used}/${status.limit}`
  }
  
  /**
   * Calcula percentual de uso
   * 
   * Útil para progress bars
   * 
   * @param status - Status da quota
   * @returns Percentual de 0 a 100
   */
  static getUsagePercentage(status: QuotaStatus): number {
    if (status.limit === Infinity) {
      return 0
    }
    
    return Math.round((status.used / status.limit) * 100)
  }
}

export default QuotaService
