import { NextResponse } from 'next/server';

/**
 * Endpoint de diagnóstico para verificar configuração das variáveis de ambiente
 * 
 * Acesse: /api/test-config
 * 
 * Este endpoint NÃO revela os valores completos das chaves (segurança),
 * mas mostra se elas existem e se estão no formato correto.
 */
export async function GET() {
  try {
    const diagnosis = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV || 'unknown',
      checks: {
        supabase_url: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_URL,
          value_preview: process.env.NEXT_PUBLIC_SUPABASE_URL 
            ? `${process.env.NEXT_PUBLIC_SUPABASE_URL.substring(0, 20)}...`
            : 'NOT SET',
          is_valid_format: process.env.NEXT_PUBLIC_SUPABASE_URL?.startsWith('https://') || false,
          expected_format: 'https://[project-id].supabase.co'
        },
        supabase_anon_key: {
          exists: !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          length: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.length || 0,
          starts_with_eyJ: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.startsWith('eyJ') || false,
          first_20_chars: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY.substring(0, 20)
            : 'NOT SET',
          has_whitespace: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY 
            ? /\s/.test(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
            : false,
          has_quotes: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
            ? /["']/.test(process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY)
            : false,
          expected_format: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...'
        },
        supabase_service_role_key: {
          exists: !!process.env.SUPABASE_SERVICE_ROLE_KEY,
          length: process.env.SUPABASE_SERVICE_ROLE_KEY?.length || 0,
          starts_with_eyJ: process.env.SUPABASE_SERVICE_ROLE_KEY?.startsWith('eyJ') || false,
          first_20_chars: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)
            : 'NOT SET',
          is_different_from_anon: process.env.SUPABASE_SERVICE_ROLE_KEY !== process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
          has_whitespace: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? /\s/.test(process.env.SUPABASE_SERVICE_ROLE_KEY)
            : false,
          has_quotes: process.env.SUPABASE_SERVICE_ROLE_KEY
            ? /["']/.test(process.env.SUPABASE_SERVICE_ROLE_KEY)
            : false,
          expected_format: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (diferente da anon key)'
        },
        openai_key: {
          exists: !!process.env.OPENAI_API_KEY,
          length: process.env.OPENAI_API_KEY?.length || 0,
          starts_with_sk: process.env.OPENAI_API_KEY?.startsWith('sk-') || false,
          first_10_chars: process.env.OPENAI_API_KEY
            ? process.env.OPENAI_API_KEY.substring(0, 10)
            : 'NOT SET',
          has_whitespace: process.env.OPENAI_API_KEY
            ? /\s/.test(process.env.OPENAI_API_KEY)
            : false,
          has_quotes: process.env.OPENAI_API_KEY
            ? /["']/.test(process.env.OPENAI_API_KEY)
            : false,
          expected_format: 'sk-proj-... (40-60 chars)'
        }
      },
      issues_found: [] as string[],
      status: 'checking...'
    };

    // Detectar problemas
    const issues: string[] = [];

    if (!diagnosis.checks.supabase_url.exists) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_URL não está configurada');
    } else if (!diagnosis.checks.supabase_url.is_valid_format) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_URL não começa com https://');
    }

    if (!diagnosis.checks.supabase_anon_key.exists) {
      issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada');
    } else {
      if (!diagnosis.checks.supabase_anon_key.starts_with_eyJ) {
        issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não começa com "eyJ"');
      }
      if (diagnosis.checks.supabase_anon_key.length < 100) {
        issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY parece muito curta (esperado ~200+ chars)');
      }
      if (diagnosis.checks.supabase_anon_key.has_whitespace) {
        issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY contém espaços em branco');
      }
      if (diagnosis.checks.supabase_anon_key.has_quotes) {
        issues.push('❌ NEXT_PUBLIC_SUPABASE_ANON_KEY contém aspas');
      }
    }

    if (!diagnosis.checks.supabase_service_role_key.exists) {
      issues.push('⚠️  SUPABASE_SERVICE_ROLE_KEY não está configurada (opcional para algumas features)');
    } else {
      if (!diagnosis.checks.supabase_service_role_key.starts_with_eyJ) {
        issues.push('❌ SUPABASE_SERVICE_ROLE_KEY não começa com "eyJ"');
      }
      if (diagnosis.checks.supabase_service_role_key.length < 100) {
        issues.push('❌ SUPABASE_SERVICE_ROLE_KEY parece muito curta');
      }
      if (!diagnosis.checks.supabase_service_role_key.is_different_from_anon) {
        issues.push('❌ SUPABASE_SERVICE_ROLE_KEY é igual à ANON_KEY (devem ser diferentes!)');
      }
      if (diagnosis.checks.supabase_service_role_key.has_whitespace) {
        issues.push('❌ SUPABASE_SERVICE_ROLE_KEY contém espaços em branco');
      }
      if (diagnosis.checks.supabase_service_role_key.has_quotes) {
        issues.push('❌ SUPABASE_SERVICE_ROLE_KEY contém aspas');
      }
    }

    if (!diagnosis.checks.openai_key.exists) {
      issues.push('❌ OPENAI_API_KEY não está configurada');
    } else {
      if (!diagnosis.checks.openai_key.starts_with_sk) {
        issues.push('❌ OPENAI_API_KEY não começa com "sk-"');
      }
      if (diagnosis.checks.openai_key.length < 40 || diagnosis.checks.openai_key.length > 60) {
        issues.push(`❌ OPENAI_API_KEY tem tamanho suspeito (${diagnosis.checks.openai_key.length} chars, esperado 40-60)`);
      }
      if (diagnosis.checks.openai_key.has_whitespace) {
        issues.push('❌ OPENAI_API_KEY contém espaços em branco');
      }
      if (diagnosis.checks.openai_key.has_quotes) {
        issues.push('❌ OPENAI_API_KEY contém aspas');
      }
    }

    diagnosis.issues_found = issues;
    diagnosis.status = issues.length === 0 
      ? '✅ TODAS AS VARIÁVEIS CONFIGURADAS CORRETAMENTE' 
      : `❌ ${issues.length} problema(s) encontrado(s)`;

    return NextResponse.json(diagnosis, { 
      status: 200,
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate',
      }
    });

  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Erro ao verificar configuração',
        message: error.message,
        status: '❌ ERRO'
      },
      { status: 500 }
    );
  }
}

