/**
 * Tipos TypeScript Globais do MarketForge
 * 
 * Centraliza todas as interfaces e types usados no projeto
 */

/**
 * Tipos de banco de dados (Supabase)
 * 
 * Correspondem às tabelas criadas no schema SQL
 */

// ==========================================
// PROJECTS
// ==========================================

export interface Project {
  id: string
  user_id: string
  name: string
  niche: string
  audience: string
  features: string
  platform: 'bolt' | 'lovable' | 'v0' | 'cursor' | 'outro'
  goal: string
  status: 'active' | 'archived' | 'deleted'
  summary: string | null
  created_at: string
  updated_at: string
}

export type ProjectInsert = Omit<Project, 'id' | 'created_at' | 'updated_at'>
export type ProjectUpdate = Partial<ProjectInsert>

// ==========================================
// DOCUMENTS
// ==========================================

export type DocumentType = 
  | 'prompt' 
  | 'prd' 
  | 'research' 
  | 'proposal' 
  | 'contract' 
  | 'update_prompt' 
  | 'changelog'

export interface Document {
  id: string
  project_id: string
  user_id: string
  type: DocumentType
  title: string
  content_markdown: string
  metadata: Record<string, any> | null
  created_at: string
}

export type DocumentInsert = Omit<Document, 'id' | 'created_at'>

// ==========================================
// SUBSCRIPTIONS
// ==========================================

export type PlanType = 'starter' | 'pro' | 'lifetime'
export type SubscriptionStatus = 'active' | 'canceled' | 'expired' | 'trialing'

export interface Subscription {
  id: string
  user_id: string
  plan: PlanType
  status: SubscriptionStatus
  kiwify_transaction_id: string | null
  started_at: string
  expires_at: string | null
  created_at: string
}

// ==========================================
// USER QUOTAS
// ==========================================

export interface UserQuota {
  id: string
  user_id: string
  plan: PlanType
  
  // Limites mensais
  monthly_projects_limit: number
  monthly_proposals_limit: number
  monthly_contracts_limit: number
  
  // Uso atual
  projects_used: number
  proposals_used: number
  contracts_used: number
  
  // Créditos (Lifetime)
  credits_balance: number
  
  last_reset_at: string
  created_at: string
  updated_at: string
}

// ==========================================
// GENERATION METRICS
// ==========================================

export interface GenerationMetric {
  id: string
  user_id: string | null
  project_id: string | null
  prompt_version: string
  provider: string
  model: string
  tokens_used: number | null
  duration_ms: number | null
  success: boolean
  error_code: string | null
  created_at: string
}

export type GenerationMetricInsert = Omit<GenerationMetric, 'id' | 'created_at'>

// ==========================================
// AUDIT LOGS
// ==========================================

export interface AuditLog {
  id: string
  user_id: string | null
  action: string
  resource_type: string | null
  resource_id: string | null
  metadata: Record<string, any> | null
  created_at: string
}

export type AuditLogInsert = Omit<AuditLog, 'id' | 'created_at'>

// ==========================================
// UI TYPES
// ==========================================

/**
 * Estado do wizard de criação
 */
export interface WizardStep {
  id: number
  title: string
  description: string
  field: keyof ProjectInsert
  completed: boolean
}

/**
 * Resultados da geração para exibir na UI
 */
export interface GenerationDisplay {
  project: Project
  documents: {
    prompt: Document
    prd: Document
    research: Document
  }
  metadata: {
    tokensUsed: number
    duration: number
    model: string
  }
}

/**
 * Props comuns de componentes
 */
export interface BaseComponentProps {
  className?: string
  children?: React.ReactNode
}

// ==========================================
// API TYPES
// ==========================================

/**
 * Requisição para /api/generate
 */
export interface GenerateProjectRequest {
  projectName: string
  niche: string
  audience: string
  features: string
  platform: string
  goal: string
}

/**
 * Resposta de /api/generate
 */
export interface GenerateProjectResponse {
  success: boolean
  projectId?: string
  message?: string
  error?: string
}

/**
 * Resposta de erro da API
 */
export interface APIError {
  error: string
  message: string
  statusCode: number
}

// ==========================================
// UTILITY TYPES
// ==========================================

/**
 * Estado de loading
 */
export type LoadingState = 'idle' | 'loading' | 'success' | 'error'

/**
 * Resultado assíncrono genérico
 */
export interface AsyncResult<T> {
  data?: T
  error?: string
  loading: boolean
}

/**
 * Paginação
 */
export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}
