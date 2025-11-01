'use client'

import Link from 'next/link'
import { Check, ArrowLeft } from 'lucide-react'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'

export default function PricingPage() {
  const router = useRouter()
  const [user, setUser] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkUser()
  }, [])

  const checkUser = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    setUser(user)
    setLoading(false)
  }

  const handleUpgrade = (plan: string, kiwifyUrl: string) => {
    if (!user) {
      // Redirecionar para login com o plano desejado
      router.push(`/auth/login?redirect=/pricing&plan=${plan}`)
      return
    }
    
    // Se está logado, ir direto para Kiwify
    window.location.href = kiwifyUrl
  }
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 py-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        {/* Botão Voltar */}
        <Link 
          href="/"
          className="inline-flex items-center gap-2 text-white/80 hover:text-white mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Voltar para home
        </Link>

        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-white mb-4">
            💎 Escolha seu plano
          </h1>
          <p className="text-xl text-purple-200">
            Comece grátis e faça upgrade quando precisar
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          
          {/* FREE */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Free</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900">R$ 0</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">3 projetos/mês</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Gerador de Projetos</span>
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
          <div className="bg-white rounded-2xl p-8 shadow-xl border-2 border-purple-500 relative transform scale-105 hover:scale-110 transition-all">
            <div className="absolute -top-4 left-1/2 -translate-x-1/2 bg-purple-500 text-white px-4 py-1 rounded-full text-sm font-semibold">
              Mais Popular
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Starter</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900">R$ 97</span>
              <span className="text-gray-600">/mês</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700"><strong>30 projetos/mês</strong></span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Gerador de Contratos</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Gerador de Propostas</span>
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
            <button
              onClick={() => handleUpgrade('starter', 'https://pay.kiwify.com.br/1ekenIY')}
              className="w-full text-center px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Carregando...' : 'Assinar Starter →'}
            </button>
          </div>

          {/* PRO */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">Pro</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold text-gray-900">R$ 197</span>
              <span className="text-gray-600">/mês</span>
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
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-gray-700">Suporte via WhatsApp</span>
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('pro', 'https://pay.kiwify.com.br/e5HpFT0')}
              className="w-full text-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Carregando...' : 'Assinar Pro →'}
            </button>
          </div>

          {/* LIFETIME */}
          <div className="bg-gradient-to-br from-purple-900 to-blue-900 rounded-2xl p-8 shadow-xl text-white hover:shadow-2xl transition-all transform hover:scale-105">
            <div className="text-sm font-semibold text-purple-300 mb-2">🏆 ESPECIAL</div>
            <h3 className="text-2xl font-bold mb-2">Lifetime</h3>
            <div className="flex items-baseline gap-2 mb-6">
              <span className="text-4xl font-bold">R$ 997</span>
              <span className="text-purple-200">/único</span>
            </div>
            <ul className="space-y-4 mb-8">
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Tudo do Pro</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span><strong>Vitalício</strong> (paga 1x)</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>500 créditos bônus</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Badge &quot;Founder&quot;</span>
              </li>
              <li className="flex items-start gap-3">
                <Check className="w-5 h-5 text-green-400 mt-0.5 flex-shrink-0" />
                <span>Acesso antecipado</span>
              </li>
            </ul>
            <button
              onClick={() => handleUpgrade('lifetime', 'https://pay.kiwify.com.br/J3OG1QU')}
              className="w-full text-center px-6 py-3 bg-white text-purple-900 hover:bg-purple-50 rounded-lg font-semibold transition-all shadow-lg hover:shadow-xl"
            >
              {loading ? 'Carregando...' : 'Tornar-se Founder 🏆'}
            </button>
          </div>

        </div>

        {/* Garantias e Segurança */}
        <div className="mt-16 text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-6 text-purple-200">
            <div className="flex items-center gap-2">
              <span className="text-2xl">💳</span>
              <span>Pagamento seguro via Kiwify</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">🔒</span>
              <span>Seus dados protegidos</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-2xl">✨</span>
              <span>Cancele quando quiser</span>
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div className="mt-16 max-w-3xl mx-auto">
          <h2 className="text-3xl font-bold text-white text-center mb-8">
            ❓ Perguntas Frequentes
          </h2>
          
          <div className="space-y-4">
            <details className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group hover:bg-white/20 transition-all">
              <summary className="cursor-pointer text-white font-semibold text-lg list-none">
                Como funciona o pagamento?
              </summary>
              <p className="mt-4 text-white/80">
                Pagamento 100% seguro via Kiwify. Aceitamos cartão de crédito, PIX e boleto. Após o pagamento, você receberá acesso imediato ao plano escolhido.
              </p>
            </details>

            <details className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group hover:bg-white/20 transition-all">
              <summary className="cursor-pointer text-white font-semibold text-lg list-none">
                Posso cancelar a qualquer momento?
              </summary>
              <p className="mt-4 text-white/80">
                Sim! Você pode cancelar sua assinatura a qualquer momento sem burocracia. Após o cancelamento, você terá acesso até o fim do período já pago.
              </p>
            </details>

            <details className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group hover:bg-white/20 transition-all">
              <summary className="cursor-pointer text-white font-semibold text-lg list-none">
                E se eu quiser fazer upgrade depois?
              </summary>
              <p className="mt-4 text-white/80">
                Você pode fazer upgrade do seu plano a qualquer momento. O valor proporcional do plano atual será descontado do novo plano.
              </p>
            </details>

            <details className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 group hover:bg-white/20 transition-all">
              <summary className="cursor-pointer text-white font-semibold text-lg list-none">
                O que acontece se eu atingir o limite de projetos?
              </summary>
              <p className="mt-4 text-white/80">
                Se você atingir o limite de projetos do plano FREE (3/mês), basta fazer upgrade para continuar criando. No plano PRO e LIFETIME, você tem projetos ilimitados!
              </p>
            </details>
          </div>
        </div>

      </div>
    </div>
  )
}

