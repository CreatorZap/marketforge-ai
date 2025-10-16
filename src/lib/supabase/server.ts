import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { cookies } from 'next/headers'

/**
 * Cria um cliente Supabase para uso em Server Components e Server Actions do Next.js.
 * 
 * O que este código faz:
 * - Conecta com o Supabase usando cookies seguros (SSR)
 * - Permite autenticação de usuários
 * - Gerencia sessões automaticamente
 * 
 * Por que usar cookies?
 * - Cookies mantêm o usuário logado entre páginas
 * - São seguros (httpOnly, secure, sameSite)
 * - Funcionam tanto no servidor quanto no cliente
 */
export async function createClient() {
  const cookieStore = await cookies()

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        /**
         * get() - Lê um cookie específico
         * Usado para verificar se o usuário está logado
         */
        get(name: string) {
          return cookieStore.get(name)?.value
        },
        
        /**
         * set() - Salva um novo cookie
         * Usado quando o usuário faz login
         */
        set(name: string, value: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value, ...options })
          } catch (error) {
            // Erro silencioso: pode acontecer em alguns Server Components
            // O Supabase tenta novamente em outro momento
          }
        },
        
        /**
         * remove() - Remove um cookie
         * Usado quando o usuário faz logout
         */
        remove(name: string, options: CookieOptions) {
          try {
            cookieStore.set({ name, value: '', ...options })
          } catch (error) {
            // Erro silencioso
          }
        },
      },
    }
  )
}
