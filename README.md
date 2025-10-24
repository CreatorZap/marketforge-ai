# 🚀 MarketForge

> Gere Projetos Completos com IA em 90 Segundos

**MarketForge** é uma plataforma SaaS que utiliza IA (GPT-4) para gerar especificações completas de projetos digitais, incluindo Prompt para IA, PRD (Product Requirements Document), Pesquisa de Mercado, Propostas Comerciais e Contratos de Serviços.

---

## 🎯 O Que É o MarketForge?

MarketForge elimina as **5-8 horas** de trabalho manual necessárias para criar documentação profissional de projetos. Em apenas **90 segundos**, você responde 7 perguntas simples e recebe:

- 📝 **Prompt Otimizado** para Bolt.new, Lovable, v0.dev
- 📄 **PRD Completo** com requisitos funcionais e não-funcionais
- 🔍 **Pesquisa de Mercado** com análise de concorrentes
- 💼 **Propostas Comerciais** personalizadas
- ⚖️ **Contratos de Serviços** com cláusulas profissionais

---

## 💰 Planos e Preços

### 🆓 FREE (Grátis)
- **3 projetos/mês**
- Todas as ferramentas básicas
- Suporte por email
- Login com Google

### 💼 STARTER (R$ 97/mês)
- **30 projetos/mês** (1 por dia!)
- Gerador de Contratos
- Gerador de Propostas
- Export PDF Premium
- Suporte prioritário

### 💎 PRO (R$ 197/mês)
- **Projetos ILIMITADOS**
- Tudo do Starter
- API Access
- Templates premium
- Suporte via WhatsApp

### 🚀 LIFETIME (R$ 997 pagamento único)
- Tudo do Pro
- **Vitalício** (paga 1x, usa sempre)
- Atualizações vitalícias
- 500 créditos bônus
- Badge exclusivo "Founder" 🏆

**Documentação completa:** [PLANOS-E-QUOTAS.md](./PLANOS-E-QUOTAS.md)

---

## 🛠️ Tech Stack

- **Framework:** Next.js 15.5.4 (App Router)
- **UI:** React 19, Tailwind CSS 4, Radix UI
- **Backend:** Supabase (PostgreSQL + Auth + RLS)
- **IA:** OpenAI GPT-4 / GPT-4o-mini
- **Validação:** Zod
- **PDF:** jsPDF
- **Deploy:** Vercel

---

## 🚀 Getting Started

### 1. Instalar Dependências

```bash
npm install
```

### 2. Configurar Variáveis de Ambiente

Crie um arquivo `.env.local`:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua-chave-publica
SUPABASE_SERVICE_ROLE_KEY=sua-chave-privada

# OpenAI
OPENAI_API_KEY=sk-...
```

### 3. Rodar Migrations do Supabase

Execute o SQL em `supabase/migrations/001_marketforge_schema.sql` no Supabase Dashboard.

### 4. Iniciar Servidor de Desenvolvimento

```bash
npm run dev
```

Acesse: [http://localhost:3000](http://localhost:3000)

---

## 📁 Estrutura do Projeto

```
marketforge-clean/
├── src/
│   ├── app/
│   │   ├── api/              # API Routes (geração de conteúdo)
│   │   ├── auth/             # Login, Signup, Callback OAuth
│   │   ├── copywriter/       # Contratos e Propostas
│   │   ├── dashboard/        # Dashboard do usuário
│   │   ├── projects/         # Wizard de criação de projetos
│   │   └── page.tsx          # Landing Page
│   ├── components/
│   │   ├── copywriter/       # ContractForm, ProposalForm, DocumentPreview
│   │   ├── layout/           # Header
│   │   ├── ui/               # Componentes Radix UI
│   │   └── wizard/           # ProjectWizard
│   ├── lib/
│   │   ├── ai/               # Engine de IA (OpenAI)
│   │   ├── prompts/          # Prompts otimizados
│   │   ├── quotas/           # Sistema de quotas
│   │   ├── supabase/         # Cliente Supabase
│   │   └── validations/      # Schemas Zod
│   └── types/
│       └── index.ts
├── supabase/
│   └── migrations/           # Migrations SQL
├── PLANOS-E-QUOTAS.md        # Documentação de planos
├── package.json
└── README.md
```

---

## 🔥 Funcionalidades

### 1. Wizard de Projetos
- 7 perguntas guiadas
- Geração em 90 segundos
- 3 documentos (Prompt, PRD, Research)
- Copy/Download individual

### 2. Gerador de Propostas
- Formulário com dados do cliente
- IA escreve proposta persuasiva
- Export em Markdown e PDF

### 3. Gerador de Contratos
- Suporte PF e PJ
- 30+ cláusulas profissionais
- Compliance LGPD, Lei do Software
- Formatação profissional em PDF

### 4. Sistema de Quotas
- FREE: 3 projetos/mês
- STARTER: 30 projetos/mês
- PRO/LIFETIME: Ilimitado
- Progress bar no dashboard

### 5. Autenticação
- Email/Senha
- Google OAuth
- Sessão segura (Supabase Auth)
- Proteção RLS

---

## 📊 Sistema de Quotas

O MarketForge utiliza um sistema de quotas baseado em planos:

| Plano | Projetos/mês | Valor |
|-------|--------------|-------|
| Free | 3 | R$ 0 |
| Starter | 30 | R$ 97 |
| Pro | ∞ | R$ 197 |
| Lifetime | ∞ | R$ 997 (único) |

**Custo por projeto (OpenAI):** ~R$ 0,0125  
**Margem de lucro:** 99%+

Ver: [PLANOS-E-QUOTAS.md](./PLANOS-E-QUOTAS.md)

---

## 🧪 Como Testar

### Testar Sistema de Quotas

1. Criar conta FREE (3 projetos)
2. Gerar 3 projetos
3. Tentar gerar 4º projeto → **Deve bloquear**
4. Fazer upgrade manual no banco:
   ```sql
   UPDATE user_quotas 
   SET plan = 'pro', projects_limit = 999999 
   WHERE user_id = 'seu-user-id';
   ```
5. Tentar gerar projeto novamente → **Deve funcionar**

### Testar Google OAuth

1. Configurar Google Cloud Console
2. Adicionar redirect URL no Supabase
3. Testar login em `/auth/login`
4. Verificar redirecionamento para `/dashboard`

---

## 📚 Documentação Adicional

- **Planos e Quotas:** [PLANOS-E-QUOTAS.md](./PLANOS-E-QUOTAS.md)
- **Google OAuth:** [GOOGLE-OAUTH-IMPLEMENTADO.md](./GOOGLE-OAUTH-IMPLEMENTADO.md)
- **Gerador de Contratos:** [CORRECAO-GERADOR-CONTRATOS-PROFISSIONAL.md](./CORRECAO-GERADOR-CONTRATOS-PROFISSIONAL.md)
- **Campo Cidade:** [CORRECAO-CAMPO-CIDADE.md](./CORRECAO-CAMPO-CIDADE.md)

---

## 🚀 Deploy

### Vercel

```bash
vercel --prod
```

### Variáveis de Ambiente

Configure no Vercel Dashboard:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENAI_API_KEY`

---

## 🤝 Contribuindo

Pull requests são bem-vindos! Para mudanças importantes, abra uma issue primeiro.

---

## 📄 Licença

Propriedade privada - Todos os direitos reservados.

---

## 📧 Contato

**Suporte:** contato@edysouzafotografia.com

---

**MarketForge** © 2025 - Transformando ideias em projetos com IA 🚀
