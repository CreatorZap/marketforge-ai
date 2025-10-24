import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    openai_exists: !!process.env.OPENAI_API_KEY,
    openai_length: process.env.OPENAI_API_KEY?.length || 0,
    openai_starts: process.env.OPENAI_API_KEY?.substring(0, 7) || 'none',
    supabase_exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
    all_env_keys: Object.keys(process.env).filter(k => 
      k.includes('OPENAI') || k.includes('SUPABASE')
    )
  })
}
