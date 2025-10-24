'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { getUserProjects } from '@/lib/supabase/projects';
import Link from 'next/link';
import { Loader2, Plus, LogOut, FileText, Sparkles } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState<any[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  const [quota, setQuota] = useState<any>(null);

  useEffect(() => {
    checkUser();
    loadProjects();
    loadQuota();
  }, []);

  const checkUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        router.push('/auth/login');
        return;
      }

      setUser(user);
    } catch (error) {
      console.error('Erro ao verificar usuário:', error);
      router.push('/auth/login');
    } finally {
      setLoading(false);
    }
  };

  const loadProjects = async () => {
    setLoadingProjects(true);
    try {
      const { data, error } = await getUserProjects();
      
      if (error) {
        console.error('Erro ao carregar projetos:', error);
        return;
      }
      
      setProjects(data || []);
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
    } finally {
      setLoadingProjects(false);
    }
  };

  const loadQuota = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return;

      const { data, error } = await supabase
        .from('user_quotas')
        .select('*')
        .eq('user_id', user.id)
        .single();
      
      if (error) {
        console.error('Erro ao carregar quota:', error);
        return;
      }
      
      setQuota(data);
    } catch (error) {
      console.error('Erro ao carregar quota:', error);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push('/');
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900 flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-white animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-purple-900">
      {/* Header */}
      <header className="bg-white/10 backdrop-blur-sm border-b border-white/20">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-white">
            MarketForge
          </Link>

          <div className="flex items-center gap-4">
            <span className="text-white/80 text-sm">
              {user?.user_metadata?.name || user?.email}
            </span>
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all"
            >
              <LogOut className="w-4 h-4" />
              Sair
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12">
        {/* Welcome Section */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-white mb-2">
            Bem-vindo, {user?.user_metadata?.name?.split(' ')[0] || 'Usuário'}! 👋
          </h1>
          <p className="text-white/80 text-lg">
            Pronto para criar projetos incríveis?
          </p>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {/* Card 1: Novo Projeto */}
          <Link
            href="/projects/new"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center">
                <Plus className="w-6 h-6 text-gray-900" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Novo Projeto</h3>
                <p className="text-white/60 text-sm">Criar com IA</p>
              </div>
            </div>
            <p className="text-white/80">
              Gere especificações completas em 90 segundos
            </p>
          </Link>

          {/* Card 2: Proposta */}
          <Link
            href="/copywriter/proposal"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-purple-400 to-pink-400 rounded-lg flex items-center justify-center">
                <FileText className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Proposta</h3>
                <p className="text-white/60 text-sm">Comercial</p>
              </div>
            </div>
            <p className="text-white/80">
              Crie propostas profissionais com IA
            </p>
          </Link>

          {/* Card 3: Contrato */}
          <Link
            href="/copywriter/contract"
            className="group bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all cursor-pointer"
          >
            <div className="flex items-center gap-4 mb-4">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-400 to-cyan-400 rounded-lg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-white">Contrato</h3>
                <p className="text-white/60 text-sm">Serviços</p>
              </div>
            </div>
            <p className="text-white/80">
              Gere contratos personalizados
            </p>
          </Link>
        </div>

        {/* CTA de Upgrade - Mostrar sempre para usuários FREE */}
        {quota && quota.plan === 'free' && (
          <div className="mb-8 p-6 bg-gradient-to-r from-purple-50 to-blue-50 border-2 border-purple-200 rounded-xl">
            <h3 className="text-lg font-bold text-gray-900 mb-2">
              🚀 Crie mais projetos com Starter!
            </h3>
            <p className="text-sm text-gray-700 mb-4">
              Upgrade para <strong>30 projetos/mês</strong> (1 por dia) + Contratos + Propostas
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="https://pay.kiwify.com.br/1ekenIY"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold text-center transition-all"
              >
                Starter - R$ 97/mês →
              </Link>
              <Link
                href="https://pay.kiwify.com.br/e5HpFT0"
                target="_blank"
                rel="noopener noreferrer"
                className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center transition-all"
              >
                Pro - R$ 197/mês →
              </Link>
            </div>
            <Link
              href="https://pay.kiwify.com.br/J3OG1QU"
              target="_blank"
              rel="noopener noreferrer"
              className="block mt-3 text-center text-sm text-purple-700 hover:text-purple-900 font-semibold"
            >
              Ou torne-se Founder (R$ 997 vitalício) →
            </Link>
          </div>
        )}

        {/* CTA quando atingir o limite */}
        {quota && quota.projects_used >= quota.projects_limit && quota.plan === 'free' && (
          <div className="mb-8 p-6 bg-red-50 border-2 border-red-200 rounded-xl">
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center flex-shrink-0">
                <span className="text-2xl">⚠️</span>
              </div>
              <div className="flex-1">
                <h4 className="text-lg font-bold text-red-900 mb-1">
                  Limite de projetos atingido!
                </h4>
                <p className="text-sm text-red-800 mb-3">
                  Você usou seus <strong>3 projetos gratuitos</strong> deste mês. 
                  Faça upgrade para continuar criando projetos incríveis!
                </p>
                <div className="flex flex-col sm:flex-row gap-2">
                  <Link
                    href="https://pay.kiwify.com.br/1ekenIY"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-semibold text-center text-sm"
                  >
                    ⚡ Starter - 30 projetos (R$ 97)
                  </Link>
                  <Link
                    href="https://pay.kiwify.com.br/e5HpFT0"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-semibold text-center text-sm"
                  >
                    🚀 Pro - Ilimitado (R$ 197)
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Projetos Section */}
        <div className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-white">Meus Projetos</h2>
            <Link
              href="/projects/new"
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-gray-900 font-semibold rounded-lg hover:shadow-lg transition-all"
            >
              <Plus className="w-4 h-4" />
              Novo Projeto
            </Link>
          </div>

          {/* Lista de Projetos */}
          {loadingProjects ? (
            <div className="text-center py-12">
              <Loader2 className="w-8 h-8 text-white/60 animate-spin mx-auto mb-4" />
              <p className="text-white/60">Carregando projetos...</p>
            </div>
          ) : projects.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <FileText className="w-8 h-8 text-white/60" />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">
                Nenhum projeto ainda
              </h3>
              <p className="text-white/60 mb-6">
                Crie seu primeiro projeto e comece a transformar ideias em realidade!
              </p>
              <Link
                href="/projects/new"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all"
              >
                <Plus className="w-5 h-5" />
                Criar Primeiro Projeto
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project) => (
                <div
                  key={project.id}
                  className="bg-white/10 backdrop-blur-sm border border-white/20 rounded-xl p-6 hover:bg-white/20 transition-all"
                >
                  <h3 className="text-xl font-bold text-white mb-2">
                    {project.name}
                  </h3>
                  <p className="text-white/80 text-sm mb-4">
                    {project.niche}
                  </p>
                  <div className="flex items-center gap-2 text-white/60 text-xs mb-4">
                    <span className="px-2 py-1 bg-white/10 rounded">
                      {project.platform}
                    </span>
                    <span className="px-2 py-1 bg-white/10 rounded">
                      {project.design_style}
                    </span>
                  </div>
                  <p className="text-white/60 text-sm line-clamp-2">
                    {project.summary}
                  </p>
                  <div className="mt-4 flex items-center justify-between">
                    <span className="text-white/40 text-xs">
                      {new Date(project.created_at).toLocaleDateString('pt-BR')}
                    </span>
                    <Link
                      href={`/projects/${project.id}`}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}