import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { generateProject, validateWizardData, PROMPT_VERSION } from '@/lib/ai/engine'
import { QuotaService } from '@/lib/quotas/quota-service'
import { validateProjectData } from '@/lib/validations/project'
import type { GenerateProjectRequest, GenerateProjectResponse } from '@/types'

/**
 * POST /api/generate
 * 
 * API principal do MarketForge - Gera projetos com IA
 * 
 * Fluxo completo:
 * 1. Autentica usuário
 * 2. Valida dados do wizard
 * 3. Verifica quota
 * 4. Gera projeto com OpenAI
 * 5. Salva no Supabase
 * 6. Consome quota
 * 7. Registra métricas
 * 8. Retorna ID do projeto
 * 
 * @param request - Request com dados do wizard
 * @returns Response com projectId ou erro
 */
export async function POST(request: NextRequest) {
  const startTime = Date.now()
  
  // 🔍 DEBUG: Verificar variáveis de ambiente
  console.log('=== DEBUG OPENAI API KEY ===')
  console.log('NODE_ENV:', process.env.NODE_ENV)
  console.log('OPENAI_API_KEY exists:', !!process.env.OPENAI_API_KEY)
  console.log('OPENAI_API_KEY length:', process.env.OPENAI_API_KEY?.length || 0)
  console.log('OPENAI_API_KEY starts with sk-:', process.env.OPENAI_API_KEY?.startsWith('sk-') || false)
  console.log('OPENAI_API_KEY first 10 chars:', process.env.OPENAI_API_KEY?.substring(0, 10) || 'undefined')
  console.log('OPENAI_API_KEY last 10 chars:', process.env.OPENAI_API_KEY?.substring(-10) || 'undefined')
  console.log('All env vars with OPENAI:', Object.keys(process.env).filter(key => key.includes('OPENAI')))
  console.log('All env vars with API:', Object.keys(process.env).filter(key => key.includes('API')))
  console.log('================================')
  
  try {
    
    // ==========================================
    // PASSO 1: Autenticar Usuário
    // ==========================================
    
    console.log('🔐 Verificando autenticação...')
    
    const supabase = await createClient()
    
    const { data: { user }, error: authError } = await supabase.auth.getUser()
    
    if (authError || !user) {
      console.error('❌ Usuário não autenticado')
      return NextResponse.json(
        { 
          success: false,
          error: 'Não autenticado',
          message: 'Você precisa estar logado para gerar projetos'
        },
        { status: 401 }
      )
    }
    
    console.log('✅ Usuário autenticado:', user.id)
    
    
    // ==========================================
    // PASSO 2: Parse e Validação dos Dados
    // ==========================================
    
    console.log('📝 Validando dados do wizard...')
    
    const body: GenerateProjectRequest = await request.json()
    
    // Validação com Zod
    const validation = validateProjectData(body)
    
    if (!validation.success) {
      console.error('❌ Dados inválidos:', validation.error.errors)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validação falhou',
          message: validation.error.errors[0]?.message || 'Dados inválidos'
        },
        { status: 400 }
      )
    }
    
    const validatedData = validation.data
    
    // Validação adicional do engine
    try {
      validateWizardData(validatedData)
    } catch (error: any) {
      console.error('❌ Validação do engine falhou:', error.message)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Validação falhou',
          message: error.message
        },
        { status: 400 }
      )
    }
    
    console.log('✅ Dados validados:', validatedData.projectName)
    
    
    // ==========================================
    // PASSO 3: Verificar Quota
    // ==========================================
    
    console.log('📊 Verificando quota...')
    
    const quotaStatus = await QuotaService.checkQuota(user.id, 'projects')
    
    if (!quotaStatus.allowed) {
      console.error('❌ Quota excedida:', quotaStatus.message)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Quota excedida',
          message: quotaStatus.message || 'Limite de projetos atingido'
        },
        { status: 403 }
      )
    }
    
    console.log(`✅ Quota disponível: ${quotaStatus.remaining} de ${quotaStatus.limit}`)
    
    
    // ==========================================
    // PASSO 4: Buscar Plano do Usuário
    // ==========================================
    
    const userPlan = await QuotaService.getUserPlan(user.id)
    
    console.log('📋 Plano do usuário:', userPlan || 'starter')
    
    
    // ==========================================
    // PASSO 5: Gerar Projeto com IA
    // ==========================================
    
    console.log('🤖 Iniciando geração com IA...')
    
    const generationResult = await generateProject(
      validatedData,
      userPlan || 'starter'
    )
    
    console.log('✅ Geração concluída!')
    console.log(`   Tokens: ${generationResult.metadata.tokensUsed}`)
    console.log(`   Duração: ${generationResult.metadata.duration}ms`)
    
    
    // ==========================================
    // PASSO 6: Salvar Projeto no Banco
    // ==========================================
    
    console.log('💾 Salvando projeto no banco...')
    
    const { data: project, error: projectError } = await supabase
      .from('projects')
      .insert({
        user_id: user.id,
        name: validatedData.projectName,
        niche: validatedData.niche,
        audience: validatedData.audience,
        features: validatedData.features,
        platform: validatedData.platform,
        goal: validatedData.goal,
        status: 'active',
        summary: generationResult.summary
      })
      .select()
      .single()
    
    if (projectError || !project) {
      console.error('❌ Erro ao salvar projeto:', projectError?.message)
      
      return NextResponse.json(
        {
          success: false,
          error: 'Erro ao salvar',
          message: 'Não foi possível salvar o projeto no banco de dados'
        },
        { status: 500 }
      )
    }
    
    console.log('✅ Projeto salvo:', project.id)
    
    
    // ==========================================
    // PASSO 7: Salvar Documentos Gerados
    // ==========================================
    
    console.log('📄 Salvando documentos...')
    
    const documents = [
      {
        project_id: project.id,
        user_id: user.id,
        type: 'prompt' as const,
        title: `Prompt para ${validatedData.platform}`,
        content_markdown: generationResult.prompt,
        metadata: {
          platform: validatedData.platform,
          model: generationResult.metadata.model
        }
      },
      {
        project_id: project.id,
        user_id: user.id,
        type: 'prd' as const,
        title: 'Product Requirements Document (PRD)',
        content_markdown: generationResult.prd,
        metadata: {
          version: '1.0',
          model: generationResult.metadata.model
        }
      },
      {
        project_id: project.id,
        user_id: user.id,
        type: 'research' as const,
        title: 'Análise de Mercado',
        content_markdown: generationResult.research,
        metadata: {
          niche: validatedData.niche,
          model: generationResult.metadata.model
        }
      }
    ]
    
    const { error: documentsError } = await supabase
      .from('documents')
      .insert(documents)
    
    if (documentsError) {
      console.error('❌ Erro ao salvar documentos:', documentsError.message)
      // Não retorna erro - o projeto já foi criado
    } else {
      console.log('✅ 3 documentos salvos')
    }
    
    
    // ==========================================
    // PASSO 8: Consumir Quota
    // ==========================================
    
    console.log('📉 Consumindo quota...')
    
    const quotaConsumed = await QuotaService.consumeQuota(user.id, 'projects')
    
    if (!quotaConsumed) {
      console.warn('⚠️ Falha ao consumir quota (não crítico)')
    } else {
      console.log('✅ Quota consumida')
    }
    
    
    // ==========================================
    // PASSO 9: Registrar Métricas
    // ==========================================
    
    console.log('📊 Registrando métricas...')
    
    const { error: metricsError } = await supabase
      .from('generation_metrics')
      .insert({
        user_id: user.id,
        project_id: project.id,
        prompt_version: PROMPT_VERSION,
        provider: generationResult.metadata.provider,
        model: generationResult.metadata.model,
        tokens_used: generationResult.metadata.tokensUsed,
        duration_ms: generationResult.metadata.duration,
        success: true,
        error_code: null
      })
    
    if (metricsError) {
      console.warn('⚠️ Erro ao registrar métricas:', metricsError.message)
      // Não crítico - continua
    } else {
      console.log('✅ Métricas registradas')
    }
    
    
    // ==========================================
    // PASSO 10: Registrar Log de Auditoria
    // ==========================================
    
    const { error: auditError } = await supabase
      .from('audit_logs')
      .insert({
        user_id: user.id,
        action: 'project_created',
        resource_type: 'project',
        resource_id: project.id,
        metadata: {
          project_name: validatedData.projectName,
          platform: validatedData.platform,
          tokens_used: generationResult.metadata.tokensUsed,
          duration_ms: generationResult.metadata.duration
        }
      })
    
    if (auditError) {
      console.warn('⚠️ Erro ao registrar auditoria:', auditError.message)
    }
    
    
    // ==========================================
    // PASSO 11: Retornar Sucesso
    // ==========================================
    
    const totalDuration = Date.now() - startTime
    
    console.log(`✅ Processo completo em ${totalDuration}ms`)
    
    const response: GenerateProjectResponse = {
      success: true,
      projectId: project.id,
      message: 'Projeto gerado com sucesso!'
    }
    
    return NextResponse.json(response, { status: 200 })
    
  } catch (error: any) {
    
    // ==========================================
    // TRATAMENTO DE ERROS
    // ==========================================
    
    console.error('❌ Erro na API /api/generate:', error)
    
    // Tentar registrar erro nas métricas
    try {
      const supabase = await createClient()
      const { data: { user } } = await supabase.auth.getUser()
      
      if (user) {
        await supabase
          .from('generation_metrics')
          .insert({
            user_id: user.id,
            project_id: null,
            prompt_version: PROMPT_VERSION,
            provider: 'openai',
            model: 'unknown',
            tokens_used: null,
            duration_ms: Date.now() - startTime,
            success: false,
            error_code: error.code || 'UNKNOWN_ERROR'
          })
      }
    } catch {
      // Ignora erro ao registrar erro
    }
    
    // Retornar erro formatado
    return NextResponse.json(
      {
        success: false,
        error: 'Erro interno',
        message: error.message || 'Ocorreu um erro ao gerar o projeto. Tente novamente.'
      },
      { status: 500 }
    )
  }
}

/**
 * GET /api/generate
 * 
 * Retorna informações sobre quotas e custos
 */
export async function GET() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    
    if (!user) {
      return NextResponse.json(
        { error: 'Não autenticado' },
        { status: 401 }
      )
    }
    
    const quotaStatus = await QuotaService.checkQuota(user.id, 'projects')
    const userPlan = await QuotaService.getUserPlan(user.id)
    
    return NextResponse.json({
      quota: quotaStatus,
      plan: userPlan,
      promptVersion: PROMPT_VERSION
    })
    
  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }
}
