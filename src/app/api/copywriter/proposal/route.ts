import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateProposalPrompt, type ProposalData } from '@/lib/prompts/copywriter';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: NextRequest) {
  try {
    // 🛡️ PROTEÇÃO: Verificar autenticação
    const supabase = await createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      console.error('❌ [PROPOSAL API] Tentativa de acesso não autenticado');
      return NextResponse.json(
        { error: 'Não autenticado. Faça login para gerar propostas.' },
        { status: 401 }
      );
    }

    console.log('✅ [PROPOSAL API] Usuário autenticado:', user.id);

    const data: ProposalData = await request.json();

    // Validação básica
    if (!data.clientName || !data.providerName || !data.scope || !data.deadline || !data.value || !data.paymentTerms) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    // ✅ LAZY INITIALIZATION: criar cliente OpenAI DENTRO da função
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OPENAI_API_KEY não configurada' },
        { status: 500 }
      );
    }

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const startTime = Date.now();

    // Gerar prompt
    const prompt = generateProposalPrompt(data);

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em redação comercial e vendas B2B, criando propostas profissionais e persuasivas.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    const proposal = completion.choices[0]?.message?.content || '';
    const duration = Date.now() - startTime;

    return NextResponse.json({
      proposal,
      metadata: {
        tokens: completion.usage?.total_tokens || 0,
        duration,
        model: 'gpt-4o-mini',
      }
    });

  } catch (error: unknown) {
    console.error('Erro ao gerar proposta:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao gerar proposta',
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
