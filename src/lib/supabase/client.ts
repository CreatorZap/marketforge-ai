import { createBrowserClient } from '@supabase/ssr'
import type { SupabaseClient } from '@supabase/supabase-js'

/**
 * Cliente Supabase para uso em Client Components.
 *
 * Usa @supabase/ssr para compatibilidade com o servidor.
 * Gerencia cookies automaticamente no navegador.
 *
 * IMPORTANTE: Usa lazy initialization para evitar erros durante o build
 * quando as variáveis de ambiente podem não estar disponíveis.
 */

let supabaseInstance: SupabaseClient | null = null

function getSupabaseClient(): SupabaseClient {
  if (!supabaseInstance) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      throw new Error(
        'Variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY são obrigatórias'
      )
    }

    supabaseInstance = createBrowserClient(supabaseUrl, supabaseAnonKey)
  }

  return supabaseInstance
}

// Exporta um proxy que cria o cliente apenas quando usado
export const supabase = new Proxy({} as SupabaseClient, {
  get: (target, prop) => {
    const client = getSupabaseClient()
    return (client as any)[prop]
  }
})