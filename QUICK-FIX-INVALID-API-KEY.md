# ⚡ CORREÇÃO RÁPIDA: Invalid API Key

**Erro:** "Invalid API key" após deploy  
**Tempo:** 5-10 minutos  
**Objetivo:** Configurar variáveis de ambiente corretamente

---

## 🎯 RESUMO DO PROBLEMA

Você fez deploy mas as **4 variáveis de ambiente** não foram configuradas (ou estão erradas) no painel da Vercel.

**Solução:** Copiar as chaves dos dashboards e colar na Vercel.

---

## 🚀 AÇÃO RÁPIDA (5 PASSOS)

### ✅ PASSO 1: Copiar Chaves do Supabase

1. Abrir: https://supabase.com/dashboard
2. Clicar no projeto: `wzsbehqbwzfouuxgdwbx`
3. Menu: **Settings** → **API**
4. Copiar 3 valores:

```
📍 Project URL
→ https://wzsbehqbwzfouuxgdwbx.supabase.co

🔑 anon / public key
→ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (200+ chars)

🔒 service_role / secret key  
→ eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (200+ chars, diferente da anon)
```

✂️ **Colar em um bloco de notas temporário**

---

### ✅ PASSO 2: Copiar Chave da OpenAI

1. Abrir: https://platform.openai.com/api-keys
2. Copiar chave existente OU criar nova: **"+ Create new secret key"**
3. Copiar:

```
🤖 OpenAI API Key
→ sk-proj-xxxxxxxxxxxxxxxxxx (40-60 chars)
```

✂️ **Colar no bloco de notas**

---

### ✅ PASSO 3: Colar na Vercel

1. Abrir: https://vercel.com/dashboard
2. Clicar no projeto: **marketforge-clean**
3. **Settings** → **Environment Variables**
4. Adicionar/Editar as 4 variáveis:

#### Variável 1
```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wzsbehqbwzfouuxgdwbx.supabase.co
Environment: ✅ Production ✅ Preview ✅ Development
```
Clicar **Save**

#### Variável 2
```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua anon key completa)
Environment: ✅ Production ✅ Preview ✅ Development
```
Clicar **Save**

#### Variável 3
```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9... (sua service_role key completa)
Environment: ✅ Production ✅ Preview ✅ Development
```
Clicar **Save**

#### Variável 4
```
Name: OPENAI_API_KEY
Value: sk-proj-xxxxxxxxxxxxxxxxxx (sua OpenAI key completa)
Environment: ✅ Production ✅ Preview ✅ Development
```
Clicar **Save**

---

### ✅ PASSO 4: Configurar Redirect URLs no Supabase

1. Voltar ao Supabase: https://supabase.com/dashboard
2. Menu: **Authentication** → **URL Configuration**
3. Preencher:

**Site URL:**
```
https://[SEU-DOMINIO-VERCEL].vercel.app
```

**Redirect URLs (adicionar todas):**
```
https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/callback
https://[SEU-DOMINIO-VERCEL].vercel.app/auth/callback
https://[SEU-DOMINIO-VERCEL].vercel.app/**
http://localhost:3000/**
```

Clicar **Save**

**⚠️ Substituir `[SEU-DOMINIO-VERCEL]` pela URL real do Vercel!**

Exemplo:
```
https://marketforge-abc123.vercel.app
```

---

### ✅ PASSO 5: Redeploy

1. Vercel Dashboard → Aba **"Deployments"**
2. Clicar no primeiro deployment da lista
3. Clicar nos **3 pontinhos** → **"Redeploy"**
4. Confirmar
5. ⏱️ **Aguardar 2-5 minutos**

---

## 🧪 TESTAR

Após o deploy completar:

**1. Testar diagnóstico:**
```
https://[SEU-DOMINIO].vercel.app/api/test-config
```

Deve retornar:
```json
{
  "status": "✅ TODAS AS VARIÁVEIS CONFIGURADAS CORRETAMENTE"
}
```

**2. Testar login:**
- Acessar: `https://[SEU-DOMINIO].vercel.app/auth/login`
- Clicar em "Continuar com Google"
- ✅ Deve funcionar!

---

## ⚠️ PROBLEMAS COMUNS

### Ainda dá erro "Invalid API key"

**Causa:** Variável copiada errada ou com espaços

**Solução:**
1. Verificar `/api/test-config` para ver qual variável está errada
2. No Supabase, copiar a chave **inteira** (até o final)
3. No Vercel, **editar** a variável e colar novamente
4. **Salvar** e fazer **redeploy**

### "Redirect URL mismatch"

**Causa:** URL não configurada no Supabase

**Solução:**
1. Adicionar TODAS as URLs no PASSO 4
2. Incluir `/**` no final
3. Aguardar 2 minutos

### Build falha

**Causa:** Variável faltando ou nome errado

**Solução:**
1. Ver logs na aba "Deployments"
2. Verificar se os 4 **nomes** das variáveis estão EXATAMENTE como acima
3. Copiar/colar os nomes (não digitar)

---

## ✅ CHECKLIST RÁPIDO

- [ ] Copiei Project URL do Supabase
- [ ] Copiei anon key do Supabase (200+ chars)
- [ ] Copiei service_role key do Supabase (200+ chars, diferente)
- [ ] Copiei OpenAI key (sk-proj-...)
- [ ] Colei as 4 variáveis na Vercel
- [ ] Marquei Production + Preview + Development em todas
- [ ] Salvei cada variável
- [ ] Configurei Redirect URLs no Supabase (4 URLs)
- [ ] Fiz redeploy na Vercel
- [ ] Aguardei build completar
- [ ] Testei `/api/test-config` → sucesso
- [ ] Testei login → funcionou

---

## 📚 GUIA COMPLETO

Para mais detalhes, ver: `GUIA-CORRECAO-DEPLOY.md`

---

## 🎉 PRONTO!

Se seguiu todos os passos, o erro está resolvido!

**Login funcionando ✅**  
**Google OAuth funcionando ✅**  
**Dashboard carregando ✅**

---

**Tempo:** 5-10 minutos  
**Última atualização:** 2025-11-01

