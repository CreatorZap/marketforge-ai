# 🚀 Guia de Deploy - MarketForge

**Status:** Pronto para deploy na Vercel  
**Última atualização:** 24 de Outubro de 2025

---

## 📋 Variáveis de Ambiente Necessárias

### 1. NEXT_PUBLIC_SUPABASE_URL
**Onde encontrar:**
- Acesse: https://supabase.com/dashboard
- Selecione seu projeto
- Settings → API
- Copie: "Project URL"

**Exemplo:**
```
https://abcdefghijklmnop.supabase.co
```

### 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
**Onde encontrar:**
- Mesma página: Settings → API
- Copie: "anon / public" key

**Exemplo:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 3. OPENAI_API_KEY
**Onde encontrar:**
- Acesse: https://platform.openai.com/api-keys
- Clique em "Create new secret key"
- Copie a chave (só aparece uma vez!)

**Exemplo:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxx
```

### 4. NEXT_PUBLIC_APP_URL
**Desenvolvimento:**
```
http://localhost:3000
```

**Produção:**
```
https://seudominio.com.br
```
ou
```
https://marketforge.vercel.app
```

---

## 📦 Deploy na Vercel (Passo a Passo)

### Passo 1: Preparar Projeto
```bash
# 1. Commit das mudanças
git add .
git commit -m "Preparar para deploy"
git push origin main

# 2. Verificar se build funciona localmente
npm run build
```

### Passo 2: Importar Projeto na Vercel
1. Acesse: https://vercel.com
2. Clique em **"New Project"**
3. Clique em **"Import Git Repository"**
4. Selecione: **marketforge-clean** (ou seu repositório)
5. Clique em **"Import"**

### Passo 3: Configurar Projeto
**Framework Preset:** Next.js (detectado automaticamente)  
**Root Directory:** `.` (raiz)  
**Build Command:** `npm run build` (padrão)  
**Output Directory:** `.next` (padrão)  
**Install Command:** `npm install` (padrão)

**✅ Deixe tudo no padrão!**

### Passo 4: Adicionar Variáveis de Ambiente
Clique em **"Environment Variables"** e adicione:

1. **NEXT_PUBLIC_SUPABASE_URL**
   - Name: `NEXT_PUBLIC_SUPABASE_URL`
   - Value: `https://seu-projeto.supabase.co`

2. **NEXT_PUBLIC_SUPABASE_ANON_KEY**
   - Name: `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

3. **OPENAI_API_KEY**
   - Name: `OPENAI_API_KEY`
   - Value: `sk-proj-xxxxxxxxxxxxxxxxxxxxx`

4. **NEXT_PUBLIC_APP_URL**
   - Name: `NEXT_PUBLIC_APP_URL`
   - Value: Deixe vazio por enquanto (preencher após deploy)

### Passo 5: Deploy
1. Clique em **"Deploy"**
2. Aguarde 5-10 minutos
3. ✅ Deploy concluído!

### Passo 6: Atualizar NEXT_PUBLIC_APP_URL
1. Após deploy, copie a URL da Vercel (ex: `https://marketforge-xxx.vercel.app`)
2. Vercel Dashboard → Settings → Environment Variables
3. Edite `NEXT_PUBLIC_APP_URL` e coloque a URL da Vercel
4. Clique em **"Redeploy"** para aplicar

---

## 🔧 Configurações Pós-Deploy

### 1. Atualizar Google OAuth
**Adicionar redirect URL:**
1. Google Cloud Console → Credentials
2. Edite seu OAuth 2.0 Client
3. "Authorized redirect URIs" → Add URI:
   ```
   https://seu-projeto.supabase.co/auth/v1/callback
   https://marketforge-xxx.vercel.app/auth/callback
   ```

### 2. Atualizar Supabase
**Adicionar site URLs:**
1. Supabase Dashboard → Authentication → URL Configuration
2. Site URL:
   ```
   https://marketforge-xxx.vercel.app
   ```
3. Redirect URLs (adicionar):
   ```
   https://marketforge-xxx.vercel.app/auth/callback
   https://marketforge-xxx.vercel.app/**
   ```

### 3. Configurar Domínio Customizado (Opcional)
1. Vercel → Settings → Domains
2. Add Domain: `seudominio.com.br`
3. Configure DNS conforme instruções
4. Aguarde propagação (5-60 minutos)
5. Atualizar Google OAuth e Supabase com novo domínio

---

## ✅ Checklist Pós-Deploy

### Testes Básicos
- [ ] Site abre (https://marketforge-xxx.vercel.app)
- [ ] Landing page carrega corretamente
- [ ] Header e navegação funcionam
- [ ] Página /pricing abre
- [ ] Links da Kiwify abrem em nova aba

### Testes de Autenticação
- [ ] Login com email/senha funciona
- [ ] Login com Google funciona
- [ ] Signup com email/senha funciona
- [ ] Signup com Google funciona
- [ ] Logout funciona
- [ ] Redirecionamento para dashboard após login

### Testes de Funcionalidades
- [ ] Dashboard carrega projetos
- [ ] Criar novo projeto funciona
- [ ] Ver detalhes do projeto funciona
- [ ] Gerar proposta funciona
- [ ] Gerar contrato funciona
- [ ] CTAs de upgrade aparecem (usuários FREE)
- [ ] Links da Kiwify funcionam

### Configurações
- [ ] Google OAuth atualizado
- [ ] Supabase URLs atualizadas
- [ ] Variáveis de ambiente configuradas
- [ ] Build sem erros
- [ ] Sem erros no console do navegador

---

## 🐛 Troubleshooting

### Erro: "Invalid redirect URL"
**Solução:** Adicionar URL da Vercel no Supabase → Authentication → URL Configuration

### Erro: "Google OAuth não funciona"
**Solução:** Adicionar redirect URI no Google Cloud Console

### Erro: "OpenAI API key invalid"
**Solução:** Verificar se a chave foi copiada corretamente e está ativa

### Erro: "Supabase connection failed"
**Solução:** Verificar se as variáveis NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY estão corretas

### Build Error
**Solução:** 
```bash
# Testar build localmente
npm run build

# Ver logs na Vercel
# Vercel Dashboard → Deployments → Click no deployment → View Build Logs
```

---

## 📊 Monitoramento

### Vercel Analytics
1. Vercel → Analytics
2. Monitore: Page views, Top pages, Visitors

### Supabase Logs
1. Supabase Dashboard → Logs
2. Monitore: API requests, Auth attempts, Errors

### OpenAI Usage
1. OpenAI Dashboard → Usage
2. Monitore: Total cost, Requests per day

---

## 🔄 Deploy Contínuo

Após configuração inicial, cada `git push` no branch `main` faz deploy automático!

```bash
# Fazer mudanças
git add .
git commit -m "Nova feature"
git push origin main

# Vercel detecta push e faz deploy automaticamente
# Aguarde 2-5 minutos
# ✅ Nova versão no ar!
```

---

## 🚀 Otimizações para Produção

### 1. Configurar Domínio Customizado
- Melhor SEO
- Mais profissional
- Melhor confiança do usuário

### 2. Configurar Edge Functions
- Melhor performance global
- Menor latência

### 3. Configurar Caching
- Imagens otimizadas automaticamente
- Static pages em CDN

### 4. Monitorar Custos
- OpenAI: ~R$ 0,0125 por projeto
- Vercel: Grátis até 100GB bandwidth
- Supabase: Grátis até 500MB database

---

## 📚 Documentação Relacionada

- **Vercel Docs:** https://vercel.com/docs
- **Next.js Deployment:** https://nextjs.org/docs/deployment
- **Supabase Docs:** https://supabase.com/docs
- **OpenAI Docs:** https://platform.openai.com/docs

---

## 🎉 Conclusão

Seguindo este guia, seu MarketForge estará:

✅ Rodando em produção na Vercel  
✅ Conectado ao Supabase (database + auth)  
✅ Gerando conteúdo com OpenAI  
✅ Aceitando pagamentos via Kiwify  
✅ Com deploy contínuo configurado  

**Próximo passo:** Divulgar e começar a vender! 💰

---

**Tempo estimado de deploy:** 15-30 minutos  
**Dificuldade:** Fácil 🟢  
**Custo inicial:** R$ 0 (todos os serviços têm plano gratuito)

🚀 **Boa sorte com o deploy!** 🚀

