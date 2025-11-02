import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * 🛡️ MIDDLEWARE DE AUTENTICAÇÃO
 * 
 * Protege TODAS as rotas privadas do sistema.
 * Se usuário não estiver logado, redireciona para /auth/login.
 * 
 * CRÍTICO: Este middleware é a primeira linha de defesa do sistema!
 */
export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  // Verificar autenticação
  const { data: { user }, error } = await supabase.auth.getUser()

  // Rotas PÚBLICAS (acessíveis sem login)
  const publicRoutes = [
    '/',                      // Landing page
    '/auth/login',            // Página de login
    '/auth/signup',           // Página de cadastro
    '/auth/callback',         // Callback OAuth
    '/pricing',               // Página de preços (pública)
    '/api/test-env',          // Teste de ambiente
    '/api/test-config',       // Diagnóstico de config
  ]

  // Rotas de ASSETS (sempre públicas)
  const assetRoutes = [
    '/_next',                 // Next.js assets
    '/favicon.ico',           // Favicon
    '/file.svg',              // SVGs públicos
    '/globe.svg',
    '/next.svg',
    '/vercel.svg',
    '/window.svg',
  ]

  const pathname = request.nextUrl.pathname

  // Permitir assets sempre
  if (assetRoutes.some(route => pathname.startsWith(route))) {
    return response
  }

  // Permitir rotas públicas
  if (publicRoutes.some(route => pathname === route)) {
    return response
  }

  // 🚨 PROTEÇÃO: Se não está logado E está tentando acessar rota privada
  if (!user) {
    const redirectUrl = new URL('/auth/login', request.url)
    // Guardar para onde o usuário queria ir (redirect após login)
    redirectUrl.searchParams.set('redirect', pathname)
    
    console.log(`🛡️ ACESSO NEGADO: ${pathname} (usuário não autenticado)`)
    
    return NextResponse.redirect(redirectUrl)
  }

  // ✅ Usuário autenticado, permitir acesso
  console.log(`✅ ACESSO PERMITIDO: ${pathname} (user: ${user.id})`)
  
  return response
}

/**
 * Configuração do Matcher
 * 
 * Define quais rotas o middleware deve interceptar.
 * Excluímos apenas arquivos estáticos do Next.js.
 */
export const config = {
  matcher: [
    /*
     * Aplicar middleware em todas as rotas EXCETO:
     * - _next/static (arquivos estáticos)
     * - _next/image (otimização de imagens)
     * - favicon.ico (ícone do site)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}

