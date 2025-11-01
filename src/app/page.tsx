import Link from 'next/link';
import { ArrowRight, Sparkles, FileText, FileCheck, Check } from 'lucide-react';
import Header from '@/components/layout/Header';

export default function Home() {
  return (
    <>
      <Header />
      <div className="pt-16">
        
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 scroll-smooth">
      {/* Hero Section */}
      <section className="relative flex items-center justify-center px-4 pt-20 pb-12">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-10" />
        
        <div className="relative z-10 max-w-6xl mx-auto text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 rounded-full px-4 py-2 mb-8">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span className="text-white text-sm font-medium">1.247 projetos gerados esta semana</span>
          </div>

          {/* Main Title */}
          <h1 className="text-5xl md:text-7xl font-bold mb-6">
            <span className="text-white">Pare de Perder Horas</span>
            <br />
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              Criando Prompts
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-white/90 mb-4 max-w-3xl mx-auto">
            Gere Projetos Completos com IA em <span className="font-bold text-yellow-400">90 Segundos</span>
          </p>

          <p className="text-base text-white/70 mb-10 max-w-2xl mx-auto">
            (Não, você não precisa saber programar)
          </p>

          {/* CTAs */}
<div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
  {/* Botão 1: CTA Principal */}
  <Link 
    href="/projects/new"
    className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-lg hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
  >
    <Sparkles className="w-5 h-5" />
    Criar Meu Primeiro Projeto
    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
  </Link>
  
  {/* Botão 2: Ver Exemplo */}
  <a 
    href="#como-funciona"
    className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-300 inline-block"
  >
    Ver Exemplo Real
  </a>
</div>
          {/* Stats */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-6 text-white/80 text-sm">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>Sem cartão de crédito</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 bg-blue-400 rounded-full animate-pulse" />
              <span>Resultado em 90s</span>
            </div>
          </div>
        </div>
      </section>

      {/* 🆕 FERRAMENTAS IA - Espaçamento Reduzido */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          {/* Título da Seção */}
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              🤖 Ferramentas com IA
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Escolha a ferramenta ideal para seu projeto
            </p>
          </div>

          {/* Grid de Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Criar Projeto */}
            <Link href="/projects/new">
              <div className="relative group cursor-pointer bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl p-8 min-h-[280px] shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-green-500 text-white text-xs px-3 py-1 rounded-full font-semibold">
                    Popular
                  </span>
                </div>
                
                <div className="flex flex-col h-full">
                  <Sparkles className="w-12 h-12 text-white mb-4" />
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Criar Novo Projeto
                  </h3>
                  
                  <p className="text-white/90 text-base leading-relaxed flex-grow">
                    Gere especificações completas com Prompt, PRD e Pesquisa de Mercado em 90 segundos
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-white font-semibold">
                    <span>Começar agora</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 2: Gerar Proposta */}
            <Link href="/copywriter/proposal">
              <div className="relative group cursor-pointer bg-gradient-to-br from-purple-600 to-pink-600 rounded-xl p-8 min-h-[280px] shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">
                    Novo
                  </span>
                </div>
                
                <div className="flex flex-col h-full">
                  <FileText className="w-12 h-12 text-white mb-4" />
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Proposta Comercial
                  </h3>
                  
                  <p className="text-white/90 text-base leading-relaxed flex-grow">
                    Crie propostas profissionais e persuasivas para impressionar seus clientes
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-white font-semibold">
                    <span>Gerar proposta</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>

            {/* Card 3: Gerar Contrato */}
            <Link href="/copywriter/contract">
              <div className="relative group cursor-pointer bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl p-8 min-h-[280px] shadow-lg hover:shadow-2xl hover:scale-105 transition-all duration-300">
                <div className="absolute top-4 right-4">
                  <span className="bg-yellow-400 text-gray-900 text-xs px-3 py-1 rounded-full font-semibold">
                    Novo
                  </span>
                </div>
                
                <div className="flex flex-col h-full">
                  <FileCheck className="w-12 h-12 text-white mb-4" />
                  
                  <h3 className="text-2xl font-bold text-white mb-3">
                    Contrato de Serviços
                  </h3>
                  
                  <p className="text-white/90 text-base leading-relaxed flex-grow">
                    Gere contratos completos e personalizados com cláusulas essenciais
                  </p>
                  
                  <div className="mt-6 flex items-center gap-2 text-white font-semibold">
                    <span>Gerar contrato</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </div>
      </section>

      {/* Seção: Como Funciona - Espaçamento Reduzido */}
      <section id="como-funciona" className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Como Funciona
              </span>
            </h2>
            <p className="text-xl text-white/80">
              Processo simples e rápido para criar projetos profissionais
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Step 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">📝</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Responda 7 Perguntas Simples
              </h3>
              <p className="text-white/70 mb-4">
                Nome, nicho, público, funcionalidades, plataforma, objetivo e estilo visual
              </p>
              <div className="text-yellow-400 font-semibold">2 minutos</div>
            </div>

            {/* Step 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">🤖</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                IA Trabalha Por Você
              </h3>
              <p className="text-white/70 mb-4">
                GPT-4 gera 3 documentos profissionais baseados em +1.000 projetos reais
              </p>
              <div className="text-yellow-400 font-semibold">90 segundos</div>
            </div>

            {/* Step 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-8 hover:bg-white/10 transition-all">
              <div className="text-5xl mb-4">🚀</div>
              <h3 className="text-2xl font-bold text-white mb-3">
                Copie & Cole na Plataforma
              </h3>
              <p className="text-white/70 mb-4">
                Prompt pronto para Bolt/Lovable/v0 + PRD técnico + Pesquisa de mercado
              </p>
              <div className="text-yellow-400 font-semibold">Pronto para usar</div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Benefícios - Espaçamento Reduzido */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">⏱️</div>
              <h3 className="text-xl font-bold text-white mb-2">5-8 Horas → 90 Segundos</h3>
              <p className="text-white/70 text-sm">
                Economize até 8 horas de trabalho manual. O que levaria dias agora fica pronto em menos de 2 minutos.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">💰</div>
              <h3 className="text-xl font-bold text-white mb-2">R$ 0 → R$ 3.000+</h3>
              <p className="text-white/70 text-sm">
                Cobre 3-5x mais por projetos com documentação profissional completa. Seus clientes veem mais valor.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">🎯</div>
              <h3 className="text-xl font-bold text-white mb-2">Taxa de Fechamento +40%</h3>
              <p className="text-white/70 text-sm">
                Propostas com PRD + Pesquisa convertem muito mais. Clientes confiam em quem entrega valor desde o primeiro contato.
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="text-4xl mb-3">♾️</div>
              <h3 className="text-xl font-bold text-white mb-2">Projetos Ilimitados</h3>
              <p className="text-white/70 text-sm">
                Sem limites de uso. Gere quantos projetos precisar, teste ideias diferentes, escale seu negócio.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Depoimentos - Espaçamento Reduzido */}
      <section className="relative py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                O Que Nossos Usuários Dizem
              </span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Depoimento 1 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-white/90 mb-4">
                &quot;Fechei meu primeiro cliente de R$ 2.500 na primeira semana usando o MarketForge. O PRD gerado impressionou muito!&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-400 to-blue-400 flex items-center justify-center text-white font-bold">
                  LS
                </div>
                <div>
                  <div className="text-white font-semibold">Lucas Silva</div>
                  <div className="text-white/60 text-sm">Freelancer</div>
                </div>
              </div>
            </div>

            {/* Depoimento 2 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-white/90 mb-4">
                &quot;Como designer, eu não sabia criar especificações técnicas. Agora consigo entregar projetos completos sozinha.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-pink-400 to-purple-400 flex items-center justify-center text-white font-bold">
                  AC
                </div>
                <div>
                  <div className="text-white font-semibold">Ana Costa</div>
                  <div className="text-white/60 text-sm">Designer UX</div>
                </div>
              </div>
            </div>

            {/* Depoimento 3 */}
            <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 hover:bg-white/10 transition-all">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-yellow-400">⭐</span>
                ))}
              </div>
              <p className="text-white/90 mb-4">
                &quot;Economizo 6 horas por projeto. Consigo fazer 3x mais trabalhos no mês.&quot;
              </p>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-400 to-cyan-400 flex items-center justify-center text-white font-bold">
                  PO
                </div>
                <div>
                  <div className="text-white font-semibold">Pedro Oliveira</div>
                  <div className="text-white/60 text-sm">Dev Freelancer</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: Planos e Preços */}
      <section className="relative py-16 px-4" id="pricing">
        <div className="max-w-7xl mx-auto">
          {/* Título da Seção */}
          <div className="text-center mb-12">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
              💎 Escolha Seu Plano
            </h2>
            <p className="text-xl text-white/80 max-w-2xl mx-auto">
              Comece grátis e faça upgrade quando quiser
            </p>
          </div>

          {/* Grid de Planos */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            
            {/* FREE */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">R$ 0</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">3 projetos/mês</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Todas as ferramentas básicas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte por email</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Login com Google</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/signup"
                className="block w-full text-center px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-semibold transition-all"
              >
                Começar Grátis
              </Link>
            </div>

            {/* STARTER */}
            <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-500 relative hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
                Mais Popular
              </div>
              
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">R$ 97</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>30 projetos/mês</strong> (1 por dia!)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Contratos + Propostas</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Export PDF Premium</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Suporte prioritário</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/login?redirect=/pricing&plan=starter"
                className="block w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Assinar Starter →
              </Link>
            </div>

            {/* PRO */}
            <div className="bg-white rounded-2xl p-8 shadow-lg border-2 border-gray-200 hover:shadow-xl transition-all">
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold text-gray-900">R$ 197</span>
                  <span className="text-gray-600">/mês</span>
                </div>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700"><strong>Projetos ILIMITADOS</strong></span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Tudo do Starter</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">API Access</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">Templates premium</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/login?redirect=/pricing&plan=pro"
                className="block w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
              >
                Assinar Pro →
              </Link>
            </div>

            {/* LIFETIME */}
            <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-all transform hover:scale-105">
              <div className="mb-6">
                <h3 className="text-2xl font-bold mb-2">Lifetime</h3>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-bold">R$ 997</span>
                  <span className="text-purple-200">/único</span>
                </div>
                <p className="text-sm text-purple-200 mt-1">Pagamento único</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Tudo do Pro</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span><strong>Vitalício</strong> (paga 1x, usa sempre)</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>500 créditos bônus</span>
                </li>
                <li className="flex items-start gap-3">
                  <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                  <span>Badge &quot;Founder&quot; 🏆</span>
                </li>
              </ul>
              
              <Link 
                href="/auth/login?redirect=/pricing&plan=lifetime"
                className="block w-full text-center px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl border-2 border-white/20"
              >
                Tornar-se Founder 🏆
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* Seção: Urgência - PALETA CORRIGIDA (Roxo/Amarelo) */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative bg-gradient-to-br from-purple-600 to-blue-600 rounded-2xl p-8 md:p-12 text-center shadow-2xl overflow-hidden">
            {/* Borda Dourada */}
            <div className="absolute inset-0 border-4 border-yellow-400 rounded-2xl opacity-50"></div>
            
            <div className="relative z-10">
              <div className="text-5xl mb-4">🔥</div>
              <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
                Oferta de Lançamento
              </h2>
              
              <div className="space-y-3 mb-6 text-white/90">
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-lg">30 dias grátis do Plano Pro (Valor: R$ 197)</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-lg">Acesso vitalício ao Update Hub</span>
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl">✅</span>
                  <span className="text-lg">100 créditos extras de bônus</span>
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-lg p-4 mb-6">
                <div className="text-white text-lg font-semibold mb-2">⏰ Restam 127 vagas</div>
                <div className="w-full bg-white/30 rounded-full h-2">
                  <div className="bg-yellow-400 h-2 rounded-full" style={{ width: '25%' }}></div>
                </div>
              </div>

              <Link 
                href="/projects/new"
                className="inline-block bg-yellow-400 hover:bg-yellow-300 text-gray-900 font-bold py-4 px-8 rounded-lg transition-all duration-300 hover:scale-105 shadow-xl"
              >
                Garantir Minha Vaga Agora
              </Link>

              <p className="text-white/70 text-sm mt-4">
                *Após 500 usuários, volta ao preço normal
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Seção: FAQ - Espaçamento Reduzido */}
      <section className="relative py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-10">
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
                Perguntas Frequentes
              </span>
            </h2>
          </div>

          <div className="space-y-4">
            {[
              {
                q: '❓ Preciso saber programar?',
                a: 'Não! O MarketForge é feito para quem NÃO programa. Você só precisa ter a ideia.'
              },
              {
                q: '❓ Funciona para qualquer tipo de projeto?',
                a: 'Sim! E-commerce, SaaS, landing pages, apps, dashboards... Qualquer projeto digital.'
              },
              {
                q: '❓ A qualidade é realmente boa?',
                a: 'Nossos usuários fecham contratos de R$ 1.500 a R$ 5.000 com os documentos gerados.'
              },
              {
                q: '❓ Posso testar antes de pagar?',
                a: 'Sim! Crie seu primeiro projeto grátis. Zero risco, zero cartão de crédito.'
              },
              {
                q: '❓ E se eu não gostar do resultado?',
                a: 'Você pode regenerar quantas vezes quiser mudando as respostas do wizard.'
              }
            ].map((faq, index) => (
              <details key={index} className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl overflow-hidden group hover:bg-white/10 transition-all">
                <summary className="p-6 cursor-pointer text-white font-semibold text-lg list-none">
                  {faq.q}
                </summary>
                <div className="px-6 pb-6 text-white/80">
                  {faq.a}
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* Seção: CTA Final - Espaçamento Reduzido */}
      <section className="relative py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Sua Próxima Venda Está a{' '}
            <span className="bg-gradient-to-r from-yellow-400 to-orange-500 bg-clip-text text-transparent">
              90 Segundos de Distância
            </span>
          </h2>

          <p className="text-xl text-white/80 mb-10 max-w-3xl mx-auto">
            Junte-se a 1.247 freelancers, designers e empreendedores que já transformaram 
            ideias em projetos vendáveis
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-12">
            <Link 
              href="/projects/new"
              className="group bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-bold py-4 px-8 rounded-lg hover:shadow-2xl hover:shadow-yellow-500/50 transition-all duration-300 hover:scale-105 flex items-center gap-2"
            >
              <Sparkles className="w-5 h-5" />
              Criar Meu Projeto Agora
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>

            <button className="bg-white/10 backdrop-blur-sm border border-white/20 text-white font-semibold py-4 px-8 rounded-lg hover:bg-white/20 transition-all duration-300">
              📹 Ver MarketForge em Ação
            </button>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 max-w-2xl mx-auto">
            {[
              '✅ Resultado em 90 segundos',
              '✅ 3 documentos profissionais',
              '✅ Sem cartão de crédito',
              '✅ Projetos ilimitados'
            ].map((item, index) => (
              <div key={index} className="text-white/90 text-sm">
                {item}
              </div>
            ))}
          </div>

          <div className="bg-white/5 backdrop-blur-sm border border-white/10 rounded-xl p-6 max-w-3xl mx-auto hover:bg-white/10 transition-all">
            <p className="text-white/90 italic mb-2">
              &quot;Aumentei minha receita em 3x no primeiro mês. O MarketForge me deu a confiança 
              para cobrar o que eu realmente valho.&quot;
            </p>
            <p className="text-white/70 text-sm">— Maria Santos, Freelancer</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative py-8 px-4 border-t border-white/10">
        <div className="max-w-7xl mx-auto text-center">
          <p className="text-white/60 text-sm">
            MarketForge © 2025 - Transformando ideias em projetos com IA
          </p>
        </div>
      </footer>
    </div>
    </div>
    </>
  );
}
