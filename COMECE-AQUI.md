# 🎯 COMECE AQUI - Correção "Invalid API Key"

**Problema:** Erro "Invalid API key" após deploy  
**Solução:** Seguir um dos guias abaixo  
**Tempo:** 5-15 minutos

---

## 📖 ESCOLHA SEU GUIA

### 🚀 Opção 1: RÁPIDO (5-10 min)

Abrir: **[QUICK-FIX-INVALID-API-KEY.md](./QUICK-FIX-INVALID-API-KEY.md)**

**Para quem:**
- Quer resolver rápido
- Já fez deploy antes
- Sabe onde estão os dashboards

**Resumo dos passos:**
1. Copiar 3 chaves do Supabase
2. Copiar 1 chave da OpenAI  
3. Colar na Vercel
4. Configurar URLs
5. Redeploy

---

### 📚 Opção 2: COMPLETO (10-15 min)

Abrir: **[GUIA-CORRECAO-DEPLOY.md](./GUIA-CORRECAO-DEPLOY.md)**

**Para quem:**
- Primeira vez fazendo isso
- Quer entender cada passo
- Quer ver screenshots e exemplos

**Resumo dos passos:**
1. Diagnosticar o problema
2. Obter chaves (com capturas de tela)
3. Configurar tudo passo-a-passo
4. Testar e confirmar

---

## 🛠️ FERRAMENTAS CRIADAS

### 1. Verificação Local

Antes de fazer deploy, testar localmente:

```bash
bash check-env.sh
```

Se retornar ✅ OK, pode prosseguir.

---

### 2. Verificação em Produção

Após deploy, testar se configurou corretamente:

```
https://[SEU-DOMINIO].vercel.app/api/test-config
```

Se retornar `"status": "✅ TODAS AS VARIÁVEIS CONFIGURADAS CORRETAMENTE"`, está pronto!

---

## 🎯 OBJETIVO

Ao final, você terá:

✅ Login funcionando em produção  
✅ Google OAuth funcionando  
✅ Dashboard carregando  
✅ Sem erros "Invalid API key"

---

## 📋 CHECKLIST SIMPLES

- [ ] 1. Escolher um guia (rápido ou completo)
- [ ] 2. Abrir o arquivo markdown escolhido
- [ ] 3. Seguir TODOS os passos do guia
- [ ] 4. Testar com `/api/test-config`
- [ ] 5. Confirmar que login funciona
- [ ] 6. ✅ Resolvido!

---

## 🆘 AJUDA RÁPIDA

### Não sei qual URL do meu deploy

1. Ir em: https://vercel.com/dashboard
2. Clicar no projeto
3. Ver URL tipo: `https://marketforge-xxx.vercel.app`

### Não sei qual meu projeto do Supabase

1. Ir em: https://supabase.com/dashboard
2. Procurar projeto: `wzsbehqbwzfouuxgdwbx`
3. Clicar nele

### Ainda dá erro após seguir guia

1. Ver `/api/test-config` para saber qual variável está errada
2. Confirmar que fez REDEPLOY após configurar
3. Aguardar 2-5 minutos (tempo de build)
4. Limpar cache do navegador
5. Testar em aba anônima

---

## 📚 TODOS OS ARQUIVOS

Para referência, aqui está TUDO que foi criado:

| Arquivo | Descrição | Quando Usar |
|---------|-----------|-------------|
| **COMECE-AQUI.md** | Este arquivo | Primeiro acesso |
| **QUICK-FIX-INVALID-API-KEY.md** | Guia rápido | Correção rápida |
| **GUIA-CORRECAO-DEPLOY.md** | Guia completo | Entender tudo |
| **SOLUCAO-INVALID-API-KEY.md** | Resumo executivo | Referência |
| **INSTRUCOES-USUARIO.md** | Instruções detalhadas | Dúvidas |
| **check-env.sh** | Script de verificação | Testar local |
| **src/app/api/test-config/route.ts** | Endpoint de diagnóstico | Testar produção |

---

## 🚀 PRÓXIMO PASSO

### 👉 Abrir um destes arquivos AGORA:

- **Quer rapidez?** → `QUICK-FIX-INVALID-API-KEY.md`
- **Quer detalhes?** → `GUIA-CORRECAO-DEPLOY.md`

### Seguir TODOS os passos do guia escolhido

### ✅ Problema resolvido!

---

**Criado em:** 2025-11-01  
**Por:** Cursor AI Assistant  
**Status:** ✅ Pronto para uso

