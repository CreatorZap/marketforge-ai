import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const origin = requestUrl.origin;

  if (code) {
    const supabase = await createClient();
    
    try {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      
      if (error) {
        console.error('Erro ao trocar código:', error);
        return NextResponse.redirect(`${origin}/auth/login?error=auth_callback_error`);
      }
    } catch (error) {
      console.error('Erro inesperado:', error);
      return NextResponse.redirect(`${origin}/auth/login?error=server_error`);
    }
  }

  // Sucesso - redirecionar para dashboard
  return NextResponse.redirect(`${origin}/dashboard`);
}

