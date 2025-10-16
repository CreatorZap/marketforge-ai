import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { generateContractPrompt, type ContractData } from '@/lib/prompts/copywriter';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const data: ContractData = await request.json();

    // Validação básica
    if (!data.type || !data.provider || !data.client || !data.object || !data.term || !data.value || !data.paymentMethod) {
      return NextResponse.json(
        { error: 'Campos obrigatórios faltando' },
        { status: 400 }
      );
    }

    const startTime = Date.now();

    // Gerar prompt
    const prompt = generateContractPrompt(data);

    // Chamar OpenAI
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'Você é um especialista em direito contratual brasileiro, especializado em contratos de prestação de serviços. Crie contratos claros, formais e juridicamente adequados.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.3, // Mais conservador para contratos
      max_tokens: 3000,
    });

    const contract = completion.choices[0]?.message?.content || '';
    const duration = Date.now() - startTime;

    return NextResponse.json({
      contract,
      metadata: {
        tokens: completion.usage?.total_tokens || 0,
        duration,
        model: 'gpt-4o-mini',
      }
    });

  } catch (error: unknown) {
    console.error('Erro ao gerar contrato:', error);
    
    return NextResponse.json(
      { 
        error: 'Erro ao gerar contrato',
        message: error instanceof Error ? error.message : 'Unknown error' 
      },
      { status: 500 }
    );
  }
}
