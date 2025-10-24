import { NextResponse } from 'next/server'

export async function GET() {
  const apiKey = process.env.OPENAI_API_KEY || ''

  // Análise detalhada da API key
  const keyAnalysis = {
    exists: !!apiKey,
    length: apiKey.length,
    first_10: apiKey.substring(0, 10),
    last_10: apiKey.substring(apiKey.length - 10),
    starts_with_sk: apiKey.startsWith('sk-'),
    starts_with_sk_proj: apiKey.startsWith('sk-proj-'),

    // Verifica se há duplicação
    has_multiple_sk: (apiKey.match(/sk-/g) || []).length,

    // Verifica caracteres especiais ou espaços
    has_whitespace: /\s/.test(apiKey),
    has_newline: /\n/.test(apiKey),
    has_quotes: /["']/.test(apiKey),

    // Análise de segmentos (se houver duplicação)
    segments_by_sk: apiKey.split('sk-').length - 1,

    // Caracteres não-ASCII
    has_non_ascii: /[^\x00-\x7F]/.test(apiKey),

    // Full key encoded em base64 para análise segura
    key_base64: Buffer.from(apiKey).toString('base64'),

    // Verifica se é uma concatenação óbvia
    possible_concatenation: apiKey.length > 60 && (apiKey.match(/sk-/g) || []).length > 1
  }

  // Análise do ambiente
  const envAnalysis = {
    node_env: process.env.NODE_ENV,
    vercel: process.env.VERCEL,
    vercel_env: process.env.VERCEL_ENV,
    all_openai_keys: Object.keys(process.env).filter(k => k.includes('OPENAI')),
    all_env_count: Object.keys(process.env).length
  }

  return NextResponse.json({
    key_analysis: keyAnalysis,
    env_analysis: envAnalysis,
    supabase_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    timestamp: new Date().toISOString()
  })
}
