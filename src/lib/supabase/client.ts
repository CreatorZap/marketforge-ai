import { createBrowserClient } from '@supabase/ssr'

/**
 * Cliente Supabase para uso em Client Components.
 * 
 * Usa @supabase/ssr para compatibilidade com o servidor.
 * Gerencia cookies automaticamente no navegador.
 */
export const supabase = createBrowserClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)