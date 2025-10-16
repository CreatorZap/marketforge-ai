import { Suspense } from 'react'
import { Loader2, Sparkles } from 'lucide-react'
import { ProjectWizard } from '@/components/wizard/ProjectWizard'

export const metadata = {
  title: 'Criar Novo Projeto | MarketForge',
  description: 'Crie um projeto completo com IA em 6 passos'
}

function WizardLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center space-y-4">
        <Loader2 className="w-12 h-12 animate-spin text-purple-500 mx-auto" />
        <p className="text-muted-foreground">Carregando wizard...</p>
      </div>
    </div>
  )
}

export default function NewProjectPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0e1a] via-purple-900/10 to-[#0a0e1a]">
      {/* Header */}
      <header className="border-b border-purple-500/20 bg-black/20 backdrop-blur-sm">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-gradient-to-br from-purple-500 to-blue-600">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
                Criar Novo Projeto
              </h1>
              <p className="text-sm text-muted-foreground">
                Gere especificações completas com IA em 6 passos
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Suspense fallback={<WizardLoader />}>
          <ProjectWizard />
        </Suspense>
      </main>

      {/* Footer com dica */}
      <footer className="border-t border-purple-500/20 bg-black/20 backdrop-blur-sm mt-12">
        <div className="container mx-auto px-4 py-6">
          <p className="text-center text-sm text-muted-foreground">
            💡 <strong>Dica:</strong> Seja específico nas respostas para resultados melhores
          </p>
        </div>
      </footer>
    </div>
  )
}
