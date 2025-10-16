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
  const supabase = await createClient()

  // Verificar autenticação
  const { data: { user }, error: authError } = await supabase.auth.getUser()

  if (authError || !user) {
    redirect('/login')
  }

  // Buscar projeto
  const { data: project, error: projectError } = await supabase
    .from('projects')
    .select('*')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  if (projectError || !project) {
    notFound()
  }

  // Buscar documentos
  const { data: documents, error: docsError } = await supabase
    .from('documents')
    .select('*')
    .eq('project_id', id)
    .eq('user_id', user.id)

  if (docsError || !documents) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-red-500">Erro ao carregar documentos</h2>
          <p className="text-muted-foreground">{docsError?.message}</p>
        </div>
      </div>
    )
  }

  // Organizar documentos por tipo
  const promptDoc = documents.find(d => d.type === 'prompt')
  const prdDoc = documents.find(d => d.type === 'prd')
  const researchDoc = documents.find(d => d.type === 'research')

  return (
    <ProjectResults
      project={project}
      prompt={promptDoc?.content_markdown || ''}
      prd={prdDoc?.content_markdown || ''}
      research={researchDoc?.content_markdown || ''}
    />
  )
}
