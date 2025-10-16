'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Copy, Download, FileText, BookOpen, TrendingUp, Home } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProjectResult {
  projectName: string
  niche: string
  platform: string
  designStyle: string
  prompt: string
  prd: string
  research: string
}

export default function SuccessPage() {
  const router = useRouter()
  const [project, setProject] = useState<ProjectResult | null>(null)
  const [activeTab, setActiveTab] = useState('prompt')
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Ler dados do localStorage
    const storedData = localStorage.getItem('marketforge_latest_project')
    
    if (!storedData) {
      toast.error('Nenhum projeto encontrado. Crie um novo projeto.')
      router.push('/projects/new')
      return
    }

    try {
      const parsedData = JSON.parse(storedData) as ProjectResult
      setProject(parsedData)
      setIsLoading(false)
    } catch (error) {
      toast.error('Erro ao carregar projeto. Tente novamente.')
      router.push('/projects/new')
    }
  }, [router])

  // Copiar para clipboard
  const copyToClipboard = async (content: string, label: string) => {
    try {
      await navigator.clipboard.writeText(content)
      toast.success(`${label} copiado com sucesso!`)
    } catch (error) {
      toast.error('Erro ao copiar. Tente novamente.')
    }
  }

  // Baixar como Markdown
  const downloadMarkdown = (content: string, filename: string) => {
    const blob = new Blob([content], { type: 'text/markdown' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${filename}.md`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
    toast.success('Download iniciado!')
  }

  const getCurrentContent = () => {
    if (!project) return { content: '', label: '', filename: '' }
    
    switch (activeTab) {
      case 'prompt': 
        return { 
          content: project.prompt, 
          label: 'Prompt', 
          filename: `${project.projectName}-prompt` 
        }
      case 'prd': 
        return { 
          content: project.prd, 
          label: 'PRD', 
          filename: `${project.projectName}-prd` 
        }
      case 'research': 
        return { 
          content: project.research, 
          label: 'Pesquisa', 
          filename: `${project.projectName}-research` 
        }
      default: 
        return { content: '', label: '', filename: '' }
    }
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-purple-900/10 to-[#0a0e1a] flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="animate-spin w-12 h-12 border-4 border-purple-500 border-t-transparent rounded-full mx-auto" />
          <p className="text-muted-foreground">Carregando projeto...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return null
  }

  const current = getCurrentContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-purple-900/10 to-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <Home className="w-4 h-4 mr-2" />
                  Home
                </Button>
                <div className="h-6 w-px bg-border" />
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/projects/new')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Novo Projeto
                </Button>
              </div>
              <h1 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                {project.projectName}
              </h1>
              <p className="text-sm text-muted-foreground">
                {project.niche.substring(0, 80)}... • {project.platform}
              </p>
            </div>

            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(current.content, current.label)}
                className="border-purple-500/20 hover:border-purple-500/40"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copiar
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => downloadMarkdown(current.content, current.filename)}
                className="border-purple-500/20 hover:border-purple-500/40"
              >
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {/* Alert - Versão Temporária */}
        <Card className="mb-6 border-yellow-500/30 bg-yellow-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <div className="text-2xl">⚠️</div>
              <div className="space-y-1">
                <h3 className="font-semibold text-yellow-400">Versão de Teste (Sem Banco de Dados)</h3>
                <p className="text-sm text-muted-foreground">
                  Este é um preview temporário. Os dados estão salvos apenas no seu navegador (localStorage).
                  Quando você configurar o Supabase, os projetos serão salvos permanentemente.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-black/20 border border-purple-500/20">
            <TabsTrigger 
              value="prompt"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600"
            >
              <FileText className="w-4 h-4 mr-2" />
              Prompt
            </TabsTrigger>
            <TabsTrigger 
              value="prd"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600"
            >
              <BookOpen className="w-4 h-4 mr-2" />
              PRD
            </TabsTrigger>
            <TabsTrigger 
              value="research"
              className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-purple-500 data-[state=active]:to-blue-600"
            >
              <TrendingUp className="w-4 h-4 mr-2" />
              Pesquisa
            </TabsTrigger>
          </TabsList>

          {/* Tab: Prompt */}
          <TabsContent value="prompt" className="mt-6">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-purple-400" />
                  Prompt para {project.platform}
                </CardTitle>
                <CardDescription>
                  Cole este prompt na plataforma escolhida para gerar seu projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="relative">
                  <pre className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6 overflow-x-auto text-sm leading-relaxed whitespace-pre-wrap">
                    <code className="text-gray-300">{project.prompt}</code>
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: PRD */}
          <TabsContent value="prd" className="mt-6">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-blue-400" />
                  Product Requirements Document
                </CardTitle>
                <CardDescription>
                  Especificações técnicas completas do projeto
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6">
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">
                    {project.prd}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Tab: Research */}
          <TabsContent value="research" className="mt-6">
            <Card className="border-purple-500/20 bg-black/40 backdrop-blur-sm">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <TrendingUp className="w-5 h-5 text-green-400" />
                  Análise de Mercado
                </CardTitle>
                <CardDescription>
                  Pesquisa de concorrentes, público e viabilidade
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6">
                  <div className="prose prose-invert max-w-none whitespace-pre-wrap text-gray-300">
                    {project.research}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        {/* Dica de Uso */}
        <Card className="mt-6 border-purple-500/20 bg-purple-500/5">
          <CardContent className="pt-6">
            <div className="flex gap-4">
              <div className="text-4xl">💡</div>
              <div className="space-y-2">
                <h3 className="font-semibold text-purple-400">Próximos Passos</h3>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>1. Copie o <strong>Prompt</strong> e cole no {project.platform}</li>
                  <li>2. Use o <strong>PRD</strong> como referência técnica durante o desenvolvimento</li>
                  <li>3. Consulte a <strong>Pesquisa</strong> para validar decisões de produto</li>
                  <li>4. Faça download dos documentos para consulta offline</li>
                  <li>5. Configure o Supabase para salvar projetos permanentemente</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
