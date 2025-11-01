# 🔧 GUIA DE CORREÇÃO: Invalid API Key no Deploy

**Problema:** Erro "Invalid API key" após fazer deploy  
**Causa:** Variáveis de ambiente não configuradas corretamente no serviço de deploy  
**Tempo estimado:** 10-15 minutos

---

## 📋 PASSO A PASSO COMPLETO

### PASSO 1: Diagnosticar o Problema

**1.1. Acessar o endpoint de diagnóstico**

Acesse a URL do seu deploy + `/api/test-config`:
```
https://[SEU-DOMINIO].vercel.app/api/test-config
```

Exemplo:
```
https://marketforge-abc123.vercel.app/api/test-config
```

**1.2. Analisar o resultado**

Você verá um JSON mostrando quais variáveis estão faltando ou incorretas:

```json
{
  "status": "❌ 2 problema(s) encontrado(s)",
  "issues_found": [
    "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não está configurada",
    "❌ OPENAI_API_KEY não está configurada"
  ]
}
```

**⚠️ IMPORTANTE:** Anote quais variáveis estão com problema!

---

### PASSO 2: Obter as Chaves Corretas do Supabase

**2.1. Acessar o Supabase Dashboard**

1. Ir em: https://supabase.com/dashboard
2. Fazer login (se necessário)
3. Selecionar seu projeto: `wzsbehqbwzfouuxgdwbx`

**2.2. Copiar as chaves**

1. No menu lateral, ir em: **Settings** → **API**
2. Você verá esta tela:

```
Project URL
https://wzsbehqbwzfouuxgdwbx.supabase.co
```

**Copiar esta URL completa!** ✂️

3. Descer a página até "Project API keys"
4. Copiar as duas chaves:

**anon / public key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6c2JlaHFid3pmb3V1eGdk...
```
✂️ **Copiar esta chave completa (200+ caracteres)!**

**service_role / secret key:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind6c2JlaHFid3pmb3V1eGdk...
```
✂️ **Copiar esta chave completa (200+ caracteres)!**

**⚠️ ATENÇÃO:**
- As duas chaves começam com `eyJ` mas são DIFERENTES
- Não copie aspas, espaços ou quebras de linha
- Copie TODA a chave (até o final)

---

### PASSO 3: Obter a Chave da OpenAI

**3.1. Acessar o OpenAI Dashboard**

1. Ir em: https://platform.openai.com/api-keys
2. Fazer login (se necessário)

**3.2. Verificar chave existente ou criar nova**

Se você já tem uma chave:
- Clique no ícone de **"Copy"** ao lado da chave
- ✂️ Cole em um lugar seguro

Se não tem chave ou ela expirou:
1. Clique em **"+ Create new secret key"**
2. Nome: "MarketForge Production"
3. Clique em **"Create secret key"**
4. ✂️ **COPIE A CHAVE AGORA** (ela só aparece UMA vez!)
5. Cole em lugar seguro

**Formato esperado:**
```
sk-proj-xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

**⚠️ ATENÇÃO:**
- Começa com `sk-proj-` ou `sk-`
- Tem entre 40-60 caracteres
- Não copie aspas ou espaços

---

### PASSO 4: Configurar Variáveis no Vercel

**4.1. Acessar o Dashboard da Vercel**

1. Ir em: https://vercel.com/dashboard
2. Fazer login (se necessário)
3. Clicar no seu projeto: **marketforge-clean**

**4.2. Abrir Configurações de Ambiente**

1. Clicar na aba **"Settings"**
2. No menu lateral, clicar em **"Environment Variables"**

**4.3. Adicionar/Atualizar as 4 variáveis**

Para cada variável abaixo, você vai:
1. Clicar em **"Add New"** (se não existe) ou **"Edit"** (se existe)
2. Preencher os campos conforme tabela
3. Marcar: **Production**, **Preview**, **Development** (todas as 3!)
4. Clicar em **"Save"**

---

#### Variável 1: NEXT_PUBLIC_SUPABASE_URL

```
Name: NEXT_PUBLIC_SUPABASE_URL
Value: https://wzsbehqbwzfouuxgdwbx.supabase.co
```

**✅ Checklist:**
- [ ] Começa com `https://`
- [ ] Termina com `.supabase.co`
- [ ] Sem espaços no início/fim
- [ ] Sem aspas

---

#### Variável 2: NEXT_PUBLIC_SUPABASE_ANON_KEY

```
Name: NEXT_PUBLIC_SUPABASE_ANON_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... (sua chave completa)
```

**✅ Checklist:**
- [ ] Começa com `eyJ`
- [ ] Tem 200+ caracteres
- [ ] É a chave "anon public" do Supabase
- [ ] Sem espaços ou quebras de linha
- [ ] Sem aspas

---

#### Variável 3: SUPABASE_SERVICE_ROLE_KEY

```
Name: SUPABASE_SERVICE_ROLE_KEY
Value: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJz... (sua chave service_role completa)
```

**✅ Checklist:**
- [ ] Começa com `eyJ`
- [ ] Tem 200+ caracteres
- [ ] É a chave "service_role secret" do Supabase
- [ ] É DIFERENTE da anon key
- [ ] Sem espaços ou quebras de linha
- [ ] Sem aspas

---

#### Variável 4: OPENAI_API_KEY

```
Name: OPENAI_API_KEY
Value: sk-proj-xxxxxxxxxxxxxxxxxx (sua chave OpenAI completa)
```

**✅ Checklist:**
- [ ] Começa com `sk-proj-` ou `sk-`
- [ ] Tem 40-60 caracteres
- [ ] Sem espaços ou quebras de linha
- [ ] Sem aspas

---

### PASSO 5: Configurar Redirect URLs no Supabase

**5.1. Voltar ao Supabase Dashboard**

1. Ir em: https://supabase.com/dashboard
2. Selecionar projeto: `wzsbehqbwzfouuxgdwbx`
3. Menu lateral: **Authentication** → **URL Configuration**

**5.2. Configurar Site URL**

No campo **"Site URL"**, colocar a URL do seu deploy:
```
https://[SEU-DOMINIO].vercel.app
```

Exemplo:
```
https://marketforge-abc123.vercel.app
```

Clicar em **"Save"**

**5.3. Adicionar Redirect URLs**

No campo **"Redirect URLs"**, adicionar TODAS estas URLs (uma por linha):

```
https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/callback
https://[SEU-DOMINIO].vercel.app/auth/callback
https://[SEU-DOMINIO].vercel.app/**
http://localhost:3000/**
```

**Exemplo preenchido:**
```
https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/callback
https://marketforge-abc123.vercel.app/auth/callback
https://marketforge-abc123.vercel.app/**
http://localhost:3000/**
```

Clicar em **"Save"**

**⚠️ IMPORTANTE:** Substituir `[SEU-DOMINIO]` pela URL real do Vercel!

---

### PASSO 6: Configurar Google OAuth (se usar Google Login)

**6.1. Acessar Google Cloud Console**

1. Ir em: https://console.cloud.google.com/apis/credentials
2. Fazer login (se necessário)
3. Selecionar seu projeto

**6.2. Editar OAuth Client**

1. Clicar no seu **OAuth 2.0 Client ID**
2. Descer até **"Authorized redirect URIs"**
3. Clicar em **"+ ADD URI"**

**6.3. Adicionar a URI do Supabase**

Adicionar esta URL:
```
https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/callback
```

Clicar em **"Save"**

**✅ A lista deve conter:**
```
https://wzsbehqbwzfouuxgdwbx.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback (para desenvolvimento)
```

---

### PASSO 7: Fazer Redeploy

**7.1. Ir ao Dashboard da Vercel**

1. Ir em: https://vercel.com/dashboard
2. Clicar no projeto: **marketforge-clean**
3. Clicar na aba **"Deployments"**

**7.2. Forçar Redeploy**

Método 1 (Recomendado):
1. Clicar no deployment mais recente (primeiro da lista)
2. Clicar nos **3 pontinhos** no canto superior direito
3. Clicar em **"Redeploy"**
4. Confirmar: **"Redeploy"**

Método 2 (Via Git):
1. No seu computador, abrir terminal
2. Fazer um commit vazio:
```bash
git commit --allow-empty -m "Trigger redeploy"
git push origin main
```

**7.3. Aguardar Build**

- O deploy leva 2-5 minutos
- Aguarde até aparecer "Ready" ou "Completed"
- ✅ Deploy concluído!

---

### PASSO 8: Testar a Correção

**8.1. Testar o endpoint de diagnóstico novamente**

Acessar:
```
https://[SEU-DOMINIO].vercel.app/api/test-config
```

**Resultado esperado:**
```json
{
  "status": "✅ TODAS AS VARIÁVEIS CONFIGURADAS CORRETAMENTE",
  "issues_found": []
}
```

Se ainda houver erros, voltar ao PASSO 4 e revisar as variáveis.

**8.2. Testar Login com Email/Senha**

1. Acessar: `https://[SEU-DOMINIO].vercel.app/auth/login`
2. Digitar email e senha de teste
3. Clicar em "Entrar"
4. ✅ Deve redirecionar para `/dashboard`

**8.3. Testar Login com Google**

1. Acessar: `https://[SEU-DOMINIO].vercel.app/auth/login`
2. Clicar em "Continuar com Google"
3. Escolher conta Google
4. Autorizar permissões
5. ✅ Deve redirecionar para `/dashboard`

**8.4. Testar Dashboard**

1. Verificar se seu nome aparece no header
2. Verificar se a lista de projetos carrega
3. Tentar criar um novo projeto
4. ✅ Tudo funcionando!

---

## 🎯 CHECKLIST FINAL

Antes de considerar resolvido, confirme:

### Variáveis de Ambiente
- [ ] NEXT_PUBLIC_SUPABASE_URL configurada
- [ ] NEXT_PUBLIC_SUPABASE_ANON_KEY configurada
- [ ] SUPABASE_SERVICE_ROLE_KEY configurada (diferente da anon)
- [ ] OPENAI_API_KEY configurada
- [ ] Todas marcadas para Production, Preview e Development
- [ ] Nenhuma tem espaços ou aspas

### Supabase
- [ ] Site URL configurada com domínio do Vercel
- [ ] Redirect URLs configuradas (3-4 URLs)
- [ ] Google Provider habilitado (se usar)

### Google OAuth
- [ ] Redirect URI do Supabase adicionada
- [ ] Client ID e Secret configurados no Supabase

### Deploy
- [ ] Redeploy feito após configurar variáveis
- [ ] Build completado com sucesso
- [ ] Sem erros no build log

### Testes
- [ ] `/api/test-config` retorna sucesso
- [ ] Login com email/senha funciona
- [ ] Login com Google funciona
- [ ] Dashboard carrega corretamente
- [ ] Criar projeto funciona

---

## 🐛 TROUBLESHOOTING

### Ainda aparece "Invalid API key"

**Solução:**
1. Verificar se o redeploy foi feito APÓS salvar as variáveis
2. Limpar cache do navegador (Ctrl+Shift+Delete)
3. Testar em aba anônima
4. Verificar `/api/test-config` para ver qual variável está errada

### "Redirect URL mismatch"

**Solução:**
1. Verificar se a URL no Supabase está correta (sem barra final)
2. Verificar se adicionou `/**` no final
3. Aguardar 2-3 minutos (propagação)

### "Google OAuth não funciona"

**Solução:**
1. Verificar se adicionou a URI no Google Cloud Console
2. Verificar se Google Provider está HABILITADO no Supabase
3. Verificar se Client ID e Secret estão corretos

### Build falha na Vercel

**Solução:**
1. Ver logs completos na aba "Deployments"
2. Procurar por erro de variável de ambiente
3. Confirmar que todas as 4 variáveis estão salvas

### `/api/test-config` dá erro 404

**Solução:**
1. Aguardar o build completar (2-5 minutos)
2. Verificar se o arquivo foi commitado no Git
3. Forçar novo deploy

---

## 📞 SUPORTE

Se após seguir TODOS os passos o erro persistir:

1. **Tirar screenshot** do `/api/test-config`
2. **Tirar screenshot** das variáveis configuradas na Vercel (ocultando os valores)
3. **Copiar o erro** exato que aparece no navegador
4. **Copiar os logs** do build da Vercel

---

## ✅ RESULTADO ESPERADO

Após seguir este guia:

✅ Login com email/senha funcionando  
✅ Login com Google funcionando  
✅ Dashboard carregando  
✅ Criar projeto funcionando  
✅ Sem erros "Invalid API key"  
✅ Todas as variáveis configuradas  

**🎉 Problema resolvido!**

---

**Tempo total:** 10-15 minutos  
**Dificuldade:** Fácil 🟢  
**Última atualização:** 2025-11-01

