'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import { Loader2, ArrowLeft, ArrowRight, Sparkles, AlertCircle, FileText, FileCheck, Copy, Download } from 'lucide-react'
import { createProject } from '@/lib/supabase/projects'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  ProjectWizardSchema, 
  type ProjectWizardData,
  VALID_PLATFORMS,
  DESIGN_STYLES,
  FIELD_LABELS,
  FIELD_PLACEHOLDERS,
  FIELD_DESCRIPTIONS,
  FIELD_EXAMPLES,
  validateField
} from '@/lib/validations/project'

interface WizardStep {
  id: number
  title: string
  description: string
  field: keyof ProjectWizardData
}

const STEPS: WizardStep[] = [
  {
    id: 1,
    title: 'Nome do Projeto',
    description: 'Como você quer chamar seu projeto?',
    field: 'projectName'
  },
  {
    id: 2,
    title: 'Nicho de Mercado',
    description: 'Qual é o segmento e tipo de solução?',
    field: 'niche'
  },
  {
    id: 3,
    title: 'Público-Alvo',
    description: 'Para quem é este projeto?',
    field: 'audience'
  },
  {
    id: 4,
    title: 'Funcionalidades',
    description: 'Quais recursos principais você precisa?',
    field: 'features'
  },
  {
    id: 5,
    title: 'Plataforma',
    description: 'Onde você vai desenvolver?',
    field: 'platform'
  },
  {
    id: 6,
    title: 'Objetivo',
    description: 'Qual resultado você quer alcançar?',
    field: 'goal'
  },
  {
    id: 7,
    title: 'Estilo Visual',
    description: 'Qual identidade visual combina com seu projeto?',
    field: 'designStyle'
  }
]

// Mensagens rotativas durante geração
const LOADING_MESSAGES = [
  { text: '🔍 Analisando seu mercado...', duration: 2000 },
  { text: '🏗️ Criando arquitetura técnica...', duration: 2500 },
  { text: '📝 Gerando documentação profissional...', duration: 2000 },
  { text: '✨ Quase pronto! Finalizando detalhes...', duration: 1500 }
]

export function ProjectWizard() {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [isGenerating, setIsGenerating] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const [loadingMessage, setLoadingMessage] = useState(LOADING_MESSAGES[0].text)
  const [errors, setErrors] = useState<Partial<Record<keyof ProjectWizardData, string>>>({})
  const [saving, setSaving] = useState(false)
  const [saveError, setSaveError] = useState('')
  const [generatedResult, setGeneratedResult] = useState<any>(null)
  
  const [formData, setFormData] = useState<ProjectWizardData>({
    projectName: '',
    niche: '',
    audience: '',
    features: '',
    platform: 'bolt',
    goal: '',
    designStyle: 'moderno'
  })

  // Valida campo atual
  const validateCurrentField = (): boolean => {
    const currentField = STEPS[currentStep - 1].field
    const value = formData[currentField]
    
    const error = validateField(currentField, value)
    
    if (error) {
      setErrors({ ...errors, [currentField]: error })
      toast.error(error)
      return false
    }
    
    setErrors({ ...errors, [currentField]: undefined })
    return true
  }

  // Verifica se campo atual está VÁLIDO (para habilitar botão)
  const isCurrentFieldValid = (): boolean => {
    const currentField = STEPS[currentStep - 1].field
    const value = formData[currentField]
    
    // Verificar se campo está preenchido
    const isFilled = typeof value === 'string' ? value.trim().length > 0 : true
    
    // Verificar se NÃO tem erro
    const hasError = !!errors[currentField]
    
    // Só retorna true se está preenchido E não tem erro
    return isFilled && !hasError
  }

  // Avançar para próximo step
  const handleNext = () => {
    if (!validateCurrentField()) return
    
    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  // Voltar para step anterior
  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Atualizar campo COM VALIDAÇÃO EM TEMPO REAL
  const updateField = (field: keyof ProjectWizardData, value: string) => {
    setFormData({ ...formData, [field]: value })
    
    // Validar em tempo real
    const error = validateField(field, value)
    
    if (error) {
      setErrors({ ...errors, [field]: error })
    } else {
      // Limpar erro se campo ficou válido
      setErrors({ ...errors, [field]: undefined })
    }
  }

  // Gerar projeto e salvar no Supabase
  const handleGenerate = async () => {
    // Validar todos os campos
    const validation = ProjectWizardSchema.safeParse(formData)
    
    if (!validation.success) {
      const firstError = validation.error.issues[0]
      toast.error(firstError.message)
      
      // Voltar para o step com erro
      const errorField = firstError.path[0] as keyof ProjectWizardData
      const errorStep = STEPS.findIndex(s => s.field === errorField) + 1
      setCurrentStep(errorStep)
      return
    }

    const startTime = Date.now()
    setIsGenerating(true)
    setLoadingProgress(0)
    
    try {
      // Animação de progresso e mensagens rotativas
      let currentMessageIndex = 0
      const totalDuration = LOADING_MESSAGES.reduce((acc, msg) => acc + msg.duration, 0)
      
      const progressInterval = setInterval(() => {
        setLoadingProgress(prev => {
          const next = prev + (100 / (totalDuration / 50))
          return next >= 100 ? 100 : next
        })
      }, 50)

      // Trocar mensagens
      for (const message of LOADING_MESSAGES) {
        setLoadingMessage(message.text)
        await new Promise(resolve => setTimeout(resolve, message.duration))
      }

      clearInterval(progressInterval)
      setLoadingProgress(100)
      
      const mockResult = {
        projectName: formData.projectName,
        niche: formData.niche,
        platform: formData.platform,
        designStyle: formData.designStyle,
        prompt: `# PROMPT PARA ${formData.platform.toUpperCase()}

Crie um projeto completo de ${formData.projectName}.

## VISÃO GERAL
${formData.niche}

## PÚBLICO-ALVO
${formData.audience}

## FUNCIONALIDADES PRINCIPAIS
${formData.features}

## OBJETIVO DO NEGÓCIO
${formData.goal}

## STACK TECNOLÓGICA RECOMENDADA
- Frontend: React/Next.js
- Backend: Node.js/Express
- Database: PostgreSQL
- Autenticação: NextAuth.js
- Estilização: Tailwind CSS

## IDENTIDADE VISUAL
- Paleta de cores moderna
- Design responsivo mobile-first
- Componentes reutilizáveis

## FLUXOS DE USUÁRIO
1. Landing page
2. Cadastro/Login
3. Dashboard principal
4. Funcionalidades específicas
5. Perfil do usuário

Implemente este projeto completo com código limpo e bem documentado.`,
        
        prd: `# PRODUCT REQUIREMENTS DOCUMENT (PRD)
## ${formData.projectName}

### 1. VISÃO GERAL DO PRODUTO
${formData.niche}

**Objetivo:** ${formData.goal}

### 2. PÚBLICO-ALVO
${formData.audience}

### 3. REQUISITOS FUNCIONAIS

#### 3.1 Funcionalidades Principais
${formData.features}

#### 3.2 Fluxos de Usuário
- Onboarding e cadastro
- Navegação principal
- Execução de tarefas
- Notificações e feedback

### 4. REQUISITOS NÃO-FUNCIONAIS

#### 4.1 Performance
- Tempo de carregamento < 3s
- Suporte para 1000+ usuários simultâneos

#### 4.2 Segurança
- Autenticação JWT
- Criptografia de dados sensíveis
- Proteção contra XSS e CSRF

#### 4.3 Usabilidade
- Interface intuitiva
- Responsivo (mobile, tablet, desktop)
- Acessibilidade WCAG 2.1

### 5. STACK TECNOLÓGICA
- **Frontend:** React, Next.js, TypeScript
- **Backend:** Node.js, Express
- **Database:** PostgreSQL
- **Cache:** Redis
- **Deploy:** Vercel/AWS

### 6. CRONOGRAMA SUGERIDO
- **Sprint 1 (2 semanas):** Setup e autenticação
- **Sprint 2 (2 semanas):** Funcionalidades core
- **Sprint 3 (1 semana):** Testes e ajustes
- **Sprint 4 (1 semana):** Deploy e monitoramento

### 7. MÉTRICAS DE SUCESSO
- Taxa de conversão de visitantes
- Retenção de usuários
- NPS (Net Promoter Score)
- ${formData.goal}`,

        research: `# ANÁLISE DE MERCADO E VIABILIDADE
## ${formData.projectName}

### 1. CONTEXTO DO MERCADO
${formData.niche}

### 2. ANÁLISE DE CONCORRENTES

#### Concorrente 1: [Nome]
- **Pontos fortes:** Interface limpa, boa UX
- **Pontos fracos:** Preço alto, falta de features X
- **Diferencial nosso:** Melhor custo-benefício

#### Concorrente 2: [Nome]
- **Pontos fortes:** Grande base de usuários
- **Pontos fracos:** Interface desatualizada
- **Diferencial nosso:** Tecnologia moderna

### 3. PERSONA DETALHADA

**Nome:** [Persona Principal]
**Idade:** Extraído de "${formData.audience}"
**Comportamento:** ${formData.audience}
**Dores:**
- Dificuldade com soluções existentes
- Falta de opções acessíveis
- Necessidade de automação

**Ganhos esperados:**
- Economia de tempo
- Melhor organização
- Resultados mensuráveis

### 4. DIFERENCIAIS COMPETITIVOS
1. Foco específico em ${formData.niche}
2. Atendimento personalizado para ${formData.audience}
3. Funcionalidades exclusivas
4. Preço competitivo

### 5. ESTRATÉGIA GO-TO-MARKET

**Fase 1 - Validação (1-2 meses)**
- Landing page + waitlist
- 50 early adopters
- Feedback contínuo

**Fase 2 - Lançamento (3-4 meses)**
- Marketing digital (Google Ads, Meta Ads)
- SEO e content marketing
- Parcerias estratégicas

**Fase 3 - Crescimento (6+ meses)**
- Expansão de funcionalidades
- Programa de referência
- ${formData.goal}

### 6. ANÁLISE DE VIABILIDADE

**Viabilidade Técnica:** ✅ Alta
- Stack moderna e testada
- Recursos disponíveis
- Escalabilidade garantida

**Viabilidade Financeira:** ✅ Boa
- Investimento inicial moderado
- Modelo de receita recorrente
- ROI esperado em 12-18 meses

**Viabilidade de Mercado:** ✅ Alta
- Demanda existente
- Público-alvo bem definido
- Diferenciação clara

### 7. RISCOS E MITIGAÇÃO

**Risco 1:** Competição acirrada
**Mitigação:** Foco em nicho específico e diferenciação

**Risco 2:** Baixa adoção inicial
**Mitigação:** Programa de early adopters e onboarding eficiente

**Risco 3:** Custos operacionais
**Mitigação:** Infraestrutura escalável e automação`
      }
      
      // Salvar resultado para exibição
      setGeneratedResult(mockResult)
      
      // Salvar no localStorage (backup)
      localStorage.setItem('marketforge_latest_project', JSON.stringify(mockResult))
      
      toast.success('Projeto gerado com sucesso!', { id: 'generating' })
      
      // Salvar no banco de dados Supabase
      setSaving(true)
      setSaveError('')
      setLoadingMessage('💾 Salvando projeto no banco de dados...')

      try {
        const endTime = Date.now()
        const generationTime = Math.round((endTime - startTime) / 1000)

        const projectData = {
          name: formData.projectName,
          niche: formData.niche,
          audience: formData.audience,
          features: formData.features,
          platform: formData.platform,
          goal: formData.goal,
          design_style: formData.designStyle,
          generated_prompt: mockResult.prompt,
          generated_prd: mockResult.prd,
          generated_research: mockResult.research,
          tokens_used: 0,
          generation_time: generationTime,
        }

        const { data, error } = await createProject(projectData)

        if (error) {
          setSaveError(error)
          toast.error(`Erro ao salvar: ${error}`)
        } else {
          toast.success('✅ Projeto salvo com sucesso!')
        }
      } catch (error: any) {
        const errorMsg = error.message || 'Erro ao salvar projeto'
        setSaveError(errorMsg)
        toast.error(`Erro ao salvar: ${errorMsg}`)
      } finally {
        setSaving(false)
        setIsGenerating(false)
      }
      
    } catch (error: any) {
      console.error('Erro na geração:', error)
      toast.error(error.message || 'Erro ao gerar projeto. Tente novamente.', { 
        id: 'generating' 
      })
      setIsGenerating(false)
    }
  }

  const currentStepData = STEPS[currentStep - 1]
  const currentField = currentStepData.field
  const progress = (currentStep / STEPS.length) * 100

  // Loading state melhorado
  if (isGenerating) {
    return (
      <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
        <Card className="border-purple-500/20">
          <CardContent className="pt-12 pb-12">
            <div className="text-center space-y-8">
              {/* Ícone animado */}
              <div className="flex justify-center">
                <div className="relative">
                  <Loader2 className="w-16 h-16 text-purple-500 animate-spin" />
                  <Sparkles className="w-8 h-8 text-blue-400 absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 animate-pulse" />
                </div>
              </div>

              {/* Mensagem rotativa */}
              <div className="space-y-2">
                <h3 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent animate-pulse">
                  {loadingMessage}
                </h3>
                <p className="text-muted-foreground">
                  Estamos criando documentos profissionais para seu projeto...
                </p>
              </div>

              {/* Progress bar animada */}
              <div className="space-y-2">
                <div className="h-3 bg-secondary rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-gradient-to-r from-purple-500 via-blue-500 to-purple-500 transition-all duration-300 animate-pulse"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-sm text-muted-foreground">
                  {Math.round(loadingProgress)}% concluído
                </p>
              </div>

              {/* Mensagens de salvamento */}
              {saving && (
                <div className="p-4 bg-blue-50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-800 rounded-lg animate-pulse">
                  <p className="text-blue-700 dark:text-blue-400 font-semibold">💾 Salvando projeto...</p>
                </div>
              )}

              {saveError && (
                <div className="p-4 bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-700 dark:text-red-400">❌ Erro ao salvar: {saveError}</p>
                </div>
              )}

              {/* Skeleton cards */}
              <div className="grid grid-cols-3 gap-4 pt-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="space-y-2 animate-pulse">
                    <div className="h-4 bg-secondary rounded" />
                    <div className="h-3 bg-secondary/50 rounded w-3/4" />
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  // Results screen
  if (generatedResult) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 p-4">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between flex-wrap gap-4">
            <h1 className="text-3xl font-bold text-white">Projeto Gerado com Sucesso! 🎉</h1>
            <div className="flex gap-3">
              <button
                onClick={() => {
                  setGeneratedResult(null)
                  setCurrentStep(1)
                  setFormData({
                    projectName: '',
                    niche: '',
                    audience: '',
                    features: '',
                    platform: 'bolt',
                    goal: '',
                    designStyle: 'moderno'
                  })
                }}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
              >
                ← Novo Projeto
              </button>
              <Link
                href="/dashboard"
                className="px-4 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                Ir para Dashboard →
              </Link>
            </div>
          </div>

          {/* Results Cards */}
          <div className="space-y-6">
            {/* Prompt */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  Prompt Gerado
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedResult.prompt)
                      toast.success('Prompt copiado!')
                    }}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedResult.prompt], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${generatedResult.projectName || 'projeto'}-prompt.md`
                      a.click()
                      URL.revokeObjectURL(url)
                      toast.success('Prompt baixado!')
                    }}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={generatedResult.prompt}
                onChange={(e) => setGeneratedResult({...generatedResult, prompt: e.target.value})}
                className="w-full h-48 p-4 border border-gray-300 rounded-lg font-mono text-sm resize-y"
              />
            </Card>

            {/* PRD */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Product Requirements Document (PRD)
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedResult.prd)
                      toast.success('PRD copiado!')
                    }}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedResult.prd], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${generatedResult.projectName || 'projeto'}-prd.md`
                      a.click()
                      URL.revokeObjectURL(url)
                      toast.success('PRD baixado!')
                    }}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={generatedResult.prd}
                onChange={(e) => setGeneratedResult({...generatedResult, prd: e.target.value})}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm resize-y"
              />
            </Card>

            {/* Research */}
            <Card className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-green-600" />
                  Pesquisa de Mercado
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      navigator.clipboard.writeText(generatedResult.research)
                      toast.success('Research copiado!')
                    }}
                    className="px-3 py-1.5 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Copy className="w-4 h-4" />
                    Copiar
                  </button>
                  <button
                    onClick={() => {
                      const blob = new Blob([generatedResult.research], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = `${generatedResult.projectName || 'projeto'}-research.md`
                      a.click()
                      URL.revokeObjectURL(url)
                      toast.success('Research baixado!')
                    }}
                    className="px-3 py-1.5 bg-blue-100 hover:bg-blue-200 text-blue-700 rounded-lg text-sm flex items-center gap-2 transition-all"
                  >
                    <Download className="w-4 h-4" />
                    Download
                  </button>
                </div>
              </div>
              <textarea
                value={generatedResult.research}
                onChange={(e) => setGeneratedResult({...generatedResult, research: e.target.value})}
                className="w-full h-64 p-4 border border-gray-300 rounded-lg text-sm resize-y"
              />
            </Card>

            {/* Action Buttons */}
            <div className="flex justify-center gap-4 flex-wrap">
              <button
                onClick={() => {
                  const content = `# PROMPT\n\n${generatedResult.prompt}\n\n# PRD\n\n${generatedResult.prd}\n\n# RESEARCH\n\n${generatedResult.research}`
                  const blob = new Blob([content], { type: 'text/markdown' })
                  const url = URL.createObjectURL(blob)
                  const a = document.createElement('a')
                  a.href = url
                  a.download = `${generatedResult.projectName || 'projeto'}.md`
                  a.click()
                  URL.revokeObjectURL(url)
                  toast.success('Arquivo baixado com sucesso!')
                }}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all flex items-center gap-2"
              >
                <FileText className="w-5 h-5" />
                Baixar Markdown
              </button>
              <Link
                href="/dashboard"
                className="px-6 py-3 bg-gradient-to-r from-green-600 to-emerald-600 text-white font-semibold rounded-lg hover:from-green-700 hover:to-emerald-700 transition-all flex items-center gap-2"
              >
                <FileCheck className="w-5 h-5" />
                Ver no Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-3xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Progress Bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-muted-foreground">
          <span>Passo {currentStep} de {STEPS.length}</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <div className="h-2 bg-secondary rounded-full overflow-hidden">
          <div 
            className="h-full bg-gradient-to-r from-purple-500 to-blue-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Card do Step Atual */}
      <Card className="border-purple-500/20 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <CardHeader>
          <CardTitle className="text-2xl bg-gradient-to-r from-purple-400 to-blue-500 bg-clip-text text-transparent">
            {currentStepData.title}
          </CardTitle>
          <CardDescription className="text-base">
            {currentStepData.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Campo do Step Atual */}
          <div className="space-y-2">
            <Label htmlFor={currentField} className="text-base">
              {FIELD_LABELS[currentField]}
            </Label>
            
            {/* Cards para estilo visual */}
            {currentField === 'designStyle' ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {DESIGN_STYLES.map((style) => (
                  <button
                    key={style.value}
                    type="button"
                    onClick={() => updateField('designStyle', style.value)}
                    className={cn(
                      "p-4 rounded-lg border-2 text-left transition-all duration-300",
                      "hover:scale-105 hover:shadow-xl",
                      formData.designStyle === style.value
                        ? 'border-purple-500 bg-purple-500/10 shadow-lg shadow-purple-500/20'
                        : 'border-border hover:border-purple-500/50'
                    )}
                  >
                    <div className="text-3xl mb-2">{style.icon}</div>
                    <h3 className="font-semibold mb-1">{style.label}</h3>
                    <p className="text-sm text-muted-foreground">{style.description}</p>
                  </button>
                ))}
              </div>
            ) :
            /* Input para plataforma (select) */
            currentField === 'platform' ? (
              <Select
                value={formData.platform}
                onValueChange={(value) => updateField('platform', value)}
              >
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Selecione uma plataforma" />
                </SelectTrigger>
                <SelectContent>
                  {VALID_PLATFORMS.map((platform) => (
                    <SelectItem key={platform.value} value={platform.value}>
                      {platform.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            ) : 
            /* Textarea para campos longos */
            currentField === 'niche' || currentField === 'audience' || 
            currentField === 'features' || currentField === 'goal' ? (
              <Textarea
                id={currentField}
                value={formData[currentField] as string}
                onChange={(e) => updateField(currentField, e.target.value)}
                placeholder={FIELD_PLACEHOLDERS[currentField]}
                className={cn(
                  "min-h-[120px] resize-none transition-all duration-300",
                  errors[currentField] && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={isGenerating}
              />
            ) : (
              /* Input para projectName */
              <Input
                id={currentField}
                value={formData[currentField] as string}
                onChange={(e) => updateField(currentField, e.target.value)}
                placeholder={FIELD_PLACEHOLDERS[currentField]}
                className={cn(
                  "h-12 transition-all duration-300",
                  errors[currentField] && "border-red-500 focus-visible:ring-red-500"
                )}
                disabled={isGenerating}
              />
            )}
            
            {/* Descrição/Dica */}
            <p className="text-sm text-muted-foreground">
              {FIELD_DESCRIPTIONS[currentField]}
            </p>
            
            {/* Exemplo */}
            {FIELD_EXAMPLES[currentField] && (
              <p className="text-xs text-purple-400/70 italic">
                {FIELD_EXAMPLES[currentField]}
              </p>
            )}
            
            {/* Erro com ícone */}
            {errors[currentField] && (
              <div className="flex items-center gap-1.5 text-red-500 text-sm mt-1">
                <AlertCircle className="h-4 w-4 flex-shrink-0" />
                <span>{errors[currentField]}</span>
              </div>
            )}
          </div>

          {/* Botões de Navegação */}
          <div className="flex gap-3 pt-4">
            {/* Botão Voltar */}
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={isGenerating}
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            )}
            
            {/* Botão Próximo ou Gerar */}
            {currentStep < STEPS.length ? (
              <Button
                onClick={handleNext}
                disabled={isGenerating || !isCurrentFieldValid()}
                className={cn(
                  "flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all duration-300",
                  !isCurrentFieldValid() ? 'opacity-50 cursor-not-allowed' : 'hover:scale-105 hover:shadow-lg'
                )}
              >
                Próximo
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerate}
                disabled={isGenerating}
                className={cn(
                  "flex-1 bg-gradient-to-r from-purple-500 to-blue-600 hover:from-purple-600 hover:to-blue-700 transition-all duration-300",
                  !isGenerating && "animate-pulse shadow-xl shadow-purple-500/50"
                )}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Gerando...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 mr-2" />
                    Gerar Projeto
                  </>
                )}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumo dos Steps Preenchidos */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
        {STEPS.map((step) => {
          const isFilled = formData[step.field]
          const isCurrent = step.id === currentStep
          
          return (
            <button
              key={step.id}
              onClick={() => setCurrentStep(step.id)}
              disabled={isGenerating}
              className={cn(
                "p-3 rounded-lg text-left text-sm transition-all duration-300",
                "hover:scale-105 hover:shadow-md",
                isCurrent 
                  ? 'bg-purple-500/20 border-2 border-purple-500 shadow-lg shadow-purple-500/20' 
                  : isFilled
                  ? 'bg-secondary border-2 border-green-500/30'
                  : 'bg-secondary/50 border-2 border-transparent hover:border-purple-500/30'
              )}
            >
              <div className="font-medium truncate">{step.title}</div>
              <div className="text-xs text-muted-foreground mt-1">
                {isFilled ? '✓ Preenchido' : 'Vazio'}
              </div>
            </button>
          )
        })}
      </div>
    </div>
  )
}
