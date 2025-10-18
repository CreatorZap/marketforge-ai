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

  useEffect(() => {
    checkUser();
    loadProjects();
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
              {projects.map((project) => {
                // 🔍 DEBUG - Log do projeto
                console.log('🔍 [DASHBOARD] Renderizando projeto:', {
                  id: project.id,
                  name: project.name,
                  linkHref: `/projects/${project.id}`
                });
                
                return (
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
                      onClick={(e) => {
                        console.log('🔗 [DASHBOARD] Link clicado!');
                        console.log('ID do projeto:', project.id);
                        console.log('Href completo:', e.currentTarget.href);
                        console.log('getAttribute:', e.currentTarget.getAttribute('href'));
                        console.log('Window location atual:', window.location.href);
                      }}
                      className="text-purple-400 hover:text-purple-300 text-sm font-medium"
                    >
                      Ver detalhes →
                    </Link>
                  </div>
                </div>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}