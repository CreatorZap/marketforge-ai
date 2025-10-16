-- ============================================
-- MARKETFORGE - SCHEMA COMPLETO
-- Data: 15 de Outubro de 2024
-- ============================================

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================
-- TABELA: projects
-- ============================================
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  project_name VARCHAR(255) NOT NULL,
  niche VARCHAR(255) NOT NULL,
  target_audience TEXT NOT NULL,
  main_features TEXT NOT NULL,
  platform VARCHAR(50) NOT NULL,
  main_goal TEXT NOT NULL,
  design_style VARCHAR(100) NOT NULL,
  generated_prompt TEXT,
  generated_prd TEXT,
  generated_research TEXT,
  status VARCHAR(50) DEFAULT 'draft',
  tokens_used INTEGER DEFAULT 0,
  generation_time INTEGER,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_projects_user_id ON public.projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON public.projects(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_projects_status ON public.projects(status);

-- ============================================
-- TABELA: user_quotas
-- ============================================
CREATE TABLE IF NOT EXISTS public.user_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE NOT NULL,
  projects_limit INTEGER DEFAULT 3,
  projects_used INTEGER DEFAULT 0,
  plan VARCHAR(50) DEFAULT 'free',
  plan_started_at TIMESTAMPTZ DEFAULT NOW(),
  plan_expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_user_quotas_user_id ON public.user_quotas(user_id);

-- ============================================
-- TABELA: copywriter_documents
-- ============================================
CREATE TABLE IF NOT EXISTS public.copywriter_documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  type VARCHAR(50) NOT NULL,
  content TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_copywriter_user_id ON public.copywriter_documents(user_id);
CREATE INDEX IF NOT EXISTS idx_copywriter_type ON public.copywriter_documents(type);

-- ============================================
-- RLS (ROW LEVEL SECURITY)
-- ============================================
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.copywriter_documents ENABLE ROW LEVEL SECURITY;

-- Policies projects
CREATE POLICY "Users can view own projects" ON public.projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own projects" ON public.projects FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own projects" ON public.projects FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own projects" ON public.projects FOR DELETE USING (auth.uid() = user_id);

-- Policies user_quotas
CREATE POLICY "Users can view own quotas" ON public.user_quotas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can update own quotas" ON public.user_quotas FOR UPDATE USING (auth.uid() = user_id);

-- Policies copywriter_documents
CREATE POLICY "Users can view own documents" ON public.copywriter_documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own documents" ON public.copywriter_documents FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own documents" ON public.copywriter_documents FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own documents" ON public.copywriter_documents FOR DELETE USING (auth.uid() = user_id);

-- ============================================
-- FUNÇÕES E TRIGGERS
-- ============================================
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.user_quotas (user_id) VALUES (NEW.id);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_updated_at_projects ON public.projects;
CREATE TRIGGER set_updated_at_projects BEFORE UPDATE ON public.projects FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_quotas ON public.user_quotas;
CREATE TRIGGER set_updated_at_quotas BEFORE UPDATE ON public.user_quotas FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_updated_at_docs ON public.copywriter_documents;
CREATE TRIGGER set_updated_at_docs BEFORE UPDATE ON public.copywriter_documents FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();