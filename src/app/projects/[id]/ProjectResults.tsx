'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Copy, Download, FileText, BookOpen, TrendingUp } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface ProjectResultsProps {
  project: {
    id: string
    name: string
    niche: string
    platform: string
    created_at: string
  }
  prompt: string
  prd: string
  research: string
}

export function ProjectResults({ project, prompt, prd, research }: ProjectResultsProps) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState('prompt')

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
    switch (activeTab) {
      case 'prompt': return { content: prompt, label: 'Prompt', filename: `${project.name}-prompt` }
      case 'prd': return { content: prd, label: 'PRD', filename: `${project.name}-prd` }
      case 'research': return { content: research, label: 'Pesquisa', filename: `${project.name}-research` }
      default: return { content: '', label: '', filename: '' }
    }
  }

  const current = getCurrentContent()

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-purple-900/10 to-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <div className="flex items-center gap-3">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => router.push('/')}
                  className="text-muted-foreground hover:text-foreground"
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Voltar
                </Button>
                <div className="h-6 w-px bg-border" />
                <span className="text-sm text-muted-foreground">
                  {new Date(project.created_at).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                {project.name}
              </h1>
              <p className="text-sm text-muted-foreground">
                {project.niche} • {project.platform}
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
                Download MD
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
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
              Pesquisa de Mercado
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
                  <pre className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6 overflow-x-auto text-sm leading-relaxed">
                    <code className="text-gray-300">{prompt}</code>
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
                <div className="prose prose-invert prose-purple max-w-none">
                  <div className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6">
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: prd.replace(/\n/g, '<br />') 
                      }} 
                    />
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
                <div className="prose prose-invert prose-green max-w-none">
                  <div className="bg-[#0a0e1a] border border-purple-500/20 rounded-lg p-6">
                    <div 
                      className="markdown-content"
                      dangerouslySetInnerHTML={{ 
                        __html: research.replace(/\n/g, '<br />') 
                      }} 
                    />
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
                  <li>2. Use o <strong>PRD</strong> como referência técnica</li>
                  <li>3. Consulte a <strong>Pesquisa</strong> para validar o mercado</li>
                  <li>4. Faça download dos documentos para consulta offline</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </main>
    </div>
  )
}
