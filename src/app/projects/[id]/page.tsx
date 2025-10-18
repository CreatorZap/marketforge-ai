import { notFound, redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { ProjectResults } from './ProjectResults'

export const metadata = {
  title: 'Projeto | MarketForge',
  description: 'Veja os documentos gerados para seu projeto'
}

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function ProjectPage({ params }: PageProps) {
  const { id } = await params
  
  console.log('🔍 [PROJECT PAGE] Iniciando carregamento...')
  console.log('🔍 [PROJECT PAGE] ID recebido:', id)
  console.log('🔍 [PROJECT PAGE] Tipo do ID:', typeof id)
  
  const supabase = await createClient()

  // Verificar autenticação
  console.log('🔐 [PROJECT PAGE] Verificando autenticação...')
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  console.log('🔐 [PROJECT PAGE] Resultado auth:', {
    userExists: !!user,
    userId: user?.id,
    hasError: !!authError,
    errorMessage: authError?.message
  })

  if (authError || !user) {
    console.log('❌ [PROJECT PAGE] Não autenticado, redirecionando para /auth/login')
    redirect('/auth/login')
  }

  console.log('✅ [PROJECT PAGE] Usuário autenticado:', user.id)

  // Buscar projeto
  console.log('📊 [PROJECT PAGE] Buscando projeto com ID:', id)
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  console.log('📊 [PROJECT PAGE] Resultado da busca:', {
    projetoEncontrado: !!project,
    hasError: !!projectError,
    errorMessage: projectError?.message,
    errorCode: projectError?.code
  })

  if (projectError || !project) {
    console.log('❌ [PROJECT PAGE] Projeto não encontrado, retornando 404')
    notFound()
  }

  console.log('✅ [PROJECT PAGE] Projeto carregado com sucesso:', project.name)

  // Extrair conteúdo do metadata (JSONB)
  const metadata = project.metadata || {}
  const prompt = metadata.generated_prompt || ''
  const prd = metadata.generated_prd || ''
  const research = metadata.generated_research || ''

  return (
    <ProjectResults
      project={project}
      prompt={prompt}
      prd={prd}
      research={research}
    />
  )
}
