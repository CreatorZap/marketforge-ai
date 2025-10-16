-- ============================================
-- SCHEMA MARKETFORGE v1.1 - CORRIGIDO
-- Data: 13 de Outubro de 2025
-- Melhorias: design_style, índices, políticas RLS
-- ============================================

-- TABELA: subscriptions (Planos e assinaturas)
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL CHECK (plan IN ('starter', 'pro', 'lifetime')),
  status TEXT NOT NULL CHECK (status IN ('active', 'canceled', 'expired', 'trialing')),
  kiwify_transaction_id TEXT UNIQUE,
  kiwify_subscription_id TEXT,
  started_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  expires_at TIMESTAMP WITH TIME ZONE,
  trial_ends_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_subscriptions_user ON subscriptions(user_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);

-- TABELA: user_quotas (Limites de uso)
CREATE TABLE user_quotas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  plan TEXT NOT NULL DEFAULT 'starter',
  monthly_projects_limit INT NOT NULL DEFAULT 10,
  monthly_proposals_limit INT NOT NULL DEFAULT 3,
  monthly_contracts_limit INT NOT NULL DEFAULT 1,
  projects_used INT NOT NULL DEFAULT 0,
  proposals_used INT NOT NULL DEFAULT 0,
  contracts_used INT NOT NULL DEFAULT 0,
  credits_balance INT NOT NULL DEFAULT 0,
  last_reset_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id)
);

CREATE INDEX idx_user_quotas_user ON user_quotas(user_id);

-- TABELA: projects (Projetos criados)
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  niche TEXT NOT NULL,
  audience TEXT NOT NULL,
  features TEXT NOT NULL,
  platform TEXT NOT NULL CHECK (platform IN ('bolt', 'lovable', 'v0', 'cursor', 'outro')),
  goal TEXT NOT NULL,
  design_style TEXT CHECK (design_style IN ('minimalista', 'moderno', 'corporativo', 'criativo')),
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'archived', 'deleted')),
  summary TEXT,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_projects_user ON projects(user_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_created ON projects(created_at DESC);
CREATE INDEX idx_projects_design_style ON projects(design_style);

-- TABELA: documents (Documentos gerados)
CREATE TABLE documents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  type TEXT NOT NULL CHECK (type IN ('prompt', 'prd', 'research', 'proposal', 'contract', 'update_prompt', 'changelog')),
  title TEXT NOT NULL,
  content_markdown TEXT NOT NULL,
  metadata JSONB,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_documents_project ON documents(project_id);
CREATE INDEX idx_documents_user ON documents(user_id);
CREATE INDEX idx_documents_type ON documents(type);
CREATE INDEX idx_documents_created ON documents(created_at DESC);

-- TABELA: generation_metrics (Métricas de geração)
CREATE TABLE generation_metrics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  project_id UUID REFERENCES projects(id) ON DELETE SET NULL,
  prompt_version TEXT NOT NULL,
  provider TEXT NOT NULL,
  model TEXT NOT NULL,
  tokens_used INT,
  duration_ms INT,
  success BOOLEAN NOT NULL,
  error_code TEXT,
  error_message TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_metrics_user ON generation_metrics(user_id);
CREATE INDEX idx_metrics_project ON generation_metrics(project_id);
CREATE INDEX idx_metrics_success ON generation_metrics(success);
CREATE INDEX idx_metrics_created ON generation_metrics(created_at DESC);

-- TABELA: audit_logs (Auditoria)
CREATE TABLE audit_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  action TEXT NOT NULL,
  resource_type TEXT,
  resource_id UUID,
  metadata JSONB,
  ip_address TEXT,
  user_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX idx_audit_user ON audit_logs(user_id);
CREATE INDEX idx_audit_action ON audit_logs(action);
CREATE INDEX idx_audit_created ON audit_logs(created_at DESC);

-- ROW LEVEL SECURITY
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_quotas ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE generation_metrics ENABLE ROW LEVEL SECURITY;
ALTER TABLE audit_logs ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users view own subscriptions" ON subscriptions FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own quotas" ON user_quotas FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users view own projects" ON projects FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own projects" ON projects FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users view own documents" ON documents FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users manage own documents" ON documents FOR ALL USING (auth.uid() = user_id);

CREATE POLICY "Service role full access subscriptions" ON subscriptions FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access quotas" ON user_quotas FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access projects" ON projects FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access documents" ON documents FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access metrics" ON generation_metrics FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access audit" ON audit_logs FOR ALL USING (auth.role() = 'service_role');

-- FUNÇÕES
CREATE OR REPLACE FUNCTION increment_usage(p_user_id UUID, p_type TEXT)
RETURNS VOID AS $$
BEGIN
  EXECUTE format('UPDATE user_quotas SET %I = %I + 1, updated_at = NOW() WHERE user_id = $1', p_type || '_used', p_type || '_used') USING p_user_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION reset_monthly_quotas()
RETURNS VOID AS $$
BEGIN
  UPDATE user_quotas SET projects_used = 0, proposals_used = 0, contracts_used = 0, last_reset_at = NOW(), updated_at = NOW() WHERE last_reset_at < date_trunc('month', NOW());
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE FUNCTION create_user_quota()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_quotas (user_id, plan) VALUES (NEW.id, 'starter') ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION create_user_quota();

CREATE OR REPLACE FUNCTION update_quota_limits_by_plan(p_user_id UUID, p_plan TEXT)
RETURNS VOID AS $$
BEGIN
  IF p_plan = 'starter' THEN
    UPDATE user_quotas SET plan = 'starter', monthly_projects_limit = 10, monthly_proposals_limit = 3, monthly_contracts_limit = 1, updated_at = NOW() WHERE user_id = p_user_id;
  ELSIF p_plan = 'pro' THEN
    UPDATE user_quotas SET plan = 'pro', monthly_projects_limit = 999999, monthly_proposals_limit = 999999, monthly_contracts_limit = 999999, updated_at = NOW() WHERE user_id = p_user_id;
  ELSIF p_plan = 'lifetime' THEN
    UPDATE user_quotas SET plan = 'lifetime', monthly_projects_limit = 999999, monthly_proposals_limit = 999999, monthly_contracts_limit = 999999, credits_balance = credits_balance + 500, updated_at = NOW() WHERE user_id = p_user_id;
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
