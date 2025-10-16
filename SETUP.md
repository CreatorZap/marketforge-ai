# 🚀 Guia de Configuração - MarketForge

## 📋 Checklist Rápido

- [ ] Criar projeto no Supabase
- [ ] Aplicar schema SQL
- [ ] Copiar chaves do Supabase
- [ ] Obter API key da OpenAI
- [ ] Criar arquivo `.env.local`
- [ ] Testar conexões

---

## 1️⃣ CONFIGURAR SUPABASE (5-10 minutos)

### Passo 1.1: Criar Projeto

1. Acesse: https://supabase.com/dashboard
2. Clique em **"New Project"**
3. Preencha:
   - **Nome**: `marketforge` (ou qualquer nome)
   - **Database Password**: Crie uma senha forte e **ANOTE**
   - **Region**: Escolha mais próxima (ex: South America)
4. Clique em **"Create new project"**
5. Aguarde 2-3 minutos (projeto sendo criado)

### Passo 1.2: Aplicar Schema SQL

1. No dashboard do Supabase, vá em **SQL Editor** (ícone de código no menu lateral)
2. Clique em **"New query"**
3. **ABRA O ARQUIVO:** `supabase/migrations/001_initial_schema.sql`
4. **COPIE TODO O CONTEÚDO** (Cmd+A, Cmd+C)
5. **COLE** no editor SQL do Supabase
6. Clique em **"Run"** (ou pressione Cmd+Enter)
7. Aguarde alguns segundos
8. ✅ Deve aparecer: **"Success. No rows returned"**

### Passo 1.3: Verificar Tabelas Criadas

1. Vá em **Table Editor** (ícone de tabela no menu)
2. Você deve ver **6 tabelas**:
   - ✅ subscriptions
   - ✅ user_quotas
   - ✅ projects
   - ✅ documents
   - ✅ generation_metrics
   - ✅ audit_logs

### Passo 1.4: Copiar Chaves do Supabase

1. Vá em **Settings** (ícone de engrenagem)
2. Clique em **API** no menu lateral
3. **COPIE E ANOTE:**

```
Project URL: https://xxxxxxxxxxxxx.supabase.co
anon public key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
service_role key: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
```

⚠️ **IMPORTANTE:** 
- `anon public` vai no `.env.local` como `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `service_role` vai no `.env.local` como `SUPABASE_SERVICE_ROLE_KEY`
- **NUNCA** compartilhe a `service_role` key publicamente!

---

## 2️⃣ CONFIGURAR OPENAI (2-3 minutos)

### Passo 2.1: Criar Conta OpenAI

1. Acesse: https://platform.openai.com/signup
2. Crie uma conta (ou faça login)
3. **Adicione créditos** (mínimo $5):
   - Vá em: https://platform.openai.com/account/billing
   - Clique em **"Add payment method"**
   - Adicione cartão de crédito
   - Adicione $5-$10 de crédito

### Passo 2.2: Criar API Key

1. Vá em: https://platform.openai.com/api-keys
2. Clique em **"Create new secret key"**
3. **Nome**: `MarketForge`
4. **Permissions**: All (ou apenas `write`)
5. Clique em **"Create secret key"**
6. **COPIE A CHAVE AGORA** (ela só aparece uma vez!)
   - Formato: `sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx`

⚠️ **ATENÇÃO:** Você só consegue ver a chave UMA VEZ. Se perder, precisa criar nova.

---

## 3️⃣ CRIAR ARQUIVO .ENV.LOCAL

### Passo 3.1: Criar o Arquivo

No terminal, execute:

```bash
cd /Users/antonioedineutodesouza/Documents/marketforge-clean
touch .env.local
```

Ou crie manualmente no seu editor de código.

### Passo 3.2: Adicionar Variáveis

Abra `.env.local` e cole:

```bash
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ...

# OpenAI
OPENAI_API_KEY=sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### Passo 3.3: Substituir os Valores

Substitua:
- `https://xxxxx.supabase.co` → Sua Project URL do Supabase
- `eyJhbG...` (ANON_KEY) → Sua anon public key
- `eyJhbG...` (SERVICE_ROLE) → Sua service_role key
- `sk-proj-xxx...` → Sua OpenAI API key

### Passo 3.4: Salvar e Fechar

Salve o arquivo (Cmd+S) e feche.

---

## 4️⃣ TESTAR CONFIGURAÇÃO

### Teste 1: Verificar Variáveis

```bash
npm run dev
```

Se iniciar sem erros, as variáveis estão carregadas!

### Teste 2: Testar Supabase

Abra o navegador em: http://localhost:3000

No console do navegador (F12), teste:

```javascript
// Teste se consegue conectar
fetch('/api/generate', { method: 'GET' })
  .then(r => r.json())
  .then(console.log)
```

Se retornar `{ error: 'Não autenticado' }` → ✅ Supabase funcionando!

### Teste 3: Criar Usuário de Teste

1. Vá no Supabase Dashboard
2. **Authentication** → **Users**
3. Clique em **"Add user"** → **"Create new user"**
4. Email: `teste@marketforge.com`
5. Password: `Teste123!`
6. Clique em **"Create user"**

Agora você tem um usuário para testar!

---

## ✅ CHECKLIST FINAL

Antes de continuar, confirme:

- [ ] Projeto Supabase criado
- [ ] 6 tabelas visíveis no Table Editor
- [ ] Chaves do Supabase copiadas
- [ ] Créditos adicionados na OpenAI ($5+)
- [ ] OpenAI API key criada e copiada
- [ ] Arquivo `.env.local` criado
- [ ] Todas as 5 variáveis preenchidas
- [ ] `npm run dev` funciona sem erros
- [ ] Usuário de teste criado

---

## 🆘 TROUBLESHOOTING

### Erro: "OPENAI_API_KEY não configurada"

**Solução:**
1. Verifique se `.env.local` existe na raiz do projeto
2. Verifique se a chave começa com `sk-proj-`
3. Reinicie o servidor: `Ctrl+C` e `npm run dev`

### Erro: "Invalid API Key" (OpenAI)

**Solução:**
1. Vá em: https://platform.openai.com/api-keys
2. Verifique se a chave está ativa
3. Se não funcionar, crie uma nova chave

### Erro: "relation does not exist" (Supabase)

**Solução:**
1. Vá no SQL Editor do Supabase
2. Execute novamente o schema SQL
3. Verifique se todas as tabelas apareceram

### Erro: "Insufficient quota" (OpenAI)

**Solução:**
1. Adicione mais créditos em: https://platform.openai.com/account/billing
2. Verifique se o cartão foi aceito

---

## 💡 DICAS

1. **Custo por Geração:**
   - Plano Starter (gpt-4o-mini): ~$0.0005 (meio centavo)
   - Plano Pro (gpt-4o): ~$0.008 (menos de 1 centavo)

2. **Teste Gratuito:**
   - Use plano Starter para economizar
   - $5 de crédito = ~10.000 gerações!

3. **Segurança:**
   - NUNCA commite `.env.local` no git
   - NUNCA compartilhe suas API keys
   - O `.gitignore` já está configurado para proteger

---

## 📞 PRÓXIMOS PASSOS

Após completar esta configuração, você pode:

1. ✅ Continuar implementando a UI (Wizard + Páginas)
2. ✅ Testar geração de projetos
3. ✅ Explorar o código e customizar

**Tudo configurado? Vamos continuar! 🚀**
