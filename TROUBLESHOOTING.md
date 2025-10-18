# 🔧 TROUBLESHOOTING - GUIA DE RESOLUÇÃO DE PROBLEMAS

## 🆘 PROBLEMA: "Internal Server Error" ao acessar página

### ❌ Sintomas:
- Erro 500 ao acessar qualquer página
- Mensagem "Internal Server Error" no navegador
- Logs mostrando: `ENOENT: no such file or directory`
- Arquivos de manifesto faltando (`.next/server/...manifest.json`)

### ✅ Solução Rápida (3 comandos):

```bash
# 1. Parar todos os processos Next.js
pkill -9 -f "next dev"

# 2. Limpar cache
rm -rf .next

# 3. Reiniciar servidor
npm run dev
```

---

## 🆘 PROBLEMA: Servidor não inicia ou trava

### ❌ Sintomas:
- Comando `npm run dev` trava
- Servidor não responde
- Porta já em uso

### ✅ Solução Completa:

```bash
# 1. Encerrar TODOS os processos Next.js e Node
pkill -9 -f "next dev"
pkill -9 -f "node"

# 2. Liberar portas específicas (3000, 3001)
lsof -ti:3000,3001 | xargs kill -9 2>/dev/null

# 3. Limpar cache
rm -rf .next

# 4. Reiniciar
npm run dev
```

---

## 🆘 PROBLEMA: Erro após modificar código

### ❌ Sintomas:
- Erro apareceu após editar arquivos
- Fast Refresh falhou
- Página em branco

### ✅ Solução:

```bash
# 1. Hard refresh no navegador
# Mac: Cmd + Shift + R
# Windows/Linux: Ctrl + Shift + R

# 2. Se não resolver, limpar cache do Next.js
pkill -9 -f "next dev"
rm -rf .next
npm run dev
```

---

## 🆘 PROBLEMA: Dependências quebradas ou conflitos

### ❌ Sintomas:
- Erro "Cannot find module"
- Versões incompatíveis
- Erros de PostCSS/Tailwind

### ✅ Solução Completa (Limpeza Total):

```bash
# 1. Parar servidor
pkill -9 -f "next dev"

# 2. Remover TUDO
rm -rf .next node_modules package-lock.json

# 3. Reinstalar
npm install

# 4. Reiniciar
npm run dev
```

**⏱️ Tempo estimado:** 2-5 minutos (download de dependências)

---

## 🆘 PROBLEMA: Turbopack vs Webpack

### ❌ Sintomas:
- Erro mencionando "turbopack"
- Conflito entre modos de compilação
- Cache corrompido

### ✅ Solução:

1. **Verificar `package.json`:**
```json
{
  "scripts": {
    "dev": "next dev",        // ✅ CORRETO (sem --turbopack)
    "build": "next build"     // ✅ CORRETO (sem --turbopack)
  }
}
```

2. **Se tiver `--turbopack`, remover:**
```bash
# Editar package.json manualmente
# OU usar sed:
sed -i '' 's/ --turbopack//g' package.json
```

3. **Limpar e reiniciar:**
```bash
pkill -9 -f "next dev"
rm -rf .next
npm run dev
```

---

## 🆘 PROBLEMA: Página em branco ou não carrega

### ❌ Sintomas:
- Navegador mostra página branca
- Nenhum erro no console
- Servidor rodando normalmente

### ✅ Soluções:

**1. Limpar cache do navegador:**
- Mac: `Cmd + Shift + Delete`
- Windows: `Ctrl + Shift + Delete`
- Marcar: "Cookies" e "Cache"

**2. Testar em modo anônimo:**
- Chrome: `Cmd/Ctrl + Shift + N`
- Firefox: `Cmd/Ctrl + Shift + P`

**3. Verificar JavaScript habilitado:**
- Configurações → Privacidade → JavaScript

**4. Desabilitar extensões:**
- Testar com extensões desativadas

---

## 🆘 PROBLEMA: Console.logs não aparecem

### ❌ Sintomas:
- Logs esperados não aparecem no DevTools
- Console está vazio

### ✅ Soluções:

**1. Verificar DevTools:**
- Pressionar F12 (ou Cmd+Option+I)
- Ir para aba "Console"
- Verificar se há filtros ativos

**2. Verificar nível de log:**
- Clicar no ícone de filtro (⚙️)
- Marcar: Verbose, Info, Warnings, Errors

**3. Limpar e recarregar:**
- Limpar console (ícone 🚫)
- Recarregar página (F5 ou Cmd/Ctrl + R)

---

## 🆘 PROBLEMA: Erro 404 em rotas

### ❌ Sintomas:
- Redireciona para `/login` (404)
- "Page not found"
- Rota não existe

### ✅ Soluções:

**1. Verificar rota correta:**
```typescript
// ❌ ERRADO
redirect('/login')

// ✅ CORRETO
redirect('/auth/login')
```

**2. Verificar estrutura de pastas:**
```
src/app/
  auth/
    login/
      page.tsx  ← Rota: /auth/login
```

**3. Limpar cache e reiniciar:**
```bash
pkill -9 -f "next dev"
rm -rf .next
npm run dev
```

---

## 📊 VERIFICAÇÃO DE STATUS

### Como verificar se o servidor está funcionando:

**1. Verificar processo:**
```bash
ps aux | grep "next dev"
```

**2. Testar porta:**
```bash
lsof -i :3001
# ou
curl -I http://localhost:3001
```

**3. Verificar logs:**
```bash
tail -50 /tmp/next-dev.log
```

---

## 🔄 COMANDOS ÚTEIS

### Reinício Rápido:
```bash
pkill -9 -f "next dev" && rm -rf .next && npm run dev
```

### Limpeza Completa:
```bash
pkill -9 -f "next dev" && rm -rf .next node_modules && npm install && npm run dev
```

### Ver logs em tempo real:
```bash
npm run dev 2>&1 | tee /tmp/next-dev.log
```

### Verificar portas em uso:
```bash
lsof -i :3000
lsof -i :3001
```

### Liberar portas:
```bash
lsof -ti:3000,3001 | xargs kill -9
```

---

## 🎯 CHECKLIST DE DIAGNÓSTICO

Quando tiver um problema, siga esta ordem:

- [ ] 1. Verificar se há erros no console do navegador (F12)
- [ ] 2. Verificar logs do servidor (`tail /tmp/next-dev.log`)
- [ ] 3. Tentar hard refresh (Cmd/Ctrl + Shift + R)
- [ ] 4. Limpar cache do Next.js (`rm -rf .next`)
- [ ] 5. Reiniciar servidor (`pkill -9 -f "next dev" && npm run dev`)
- [ ] 6. Testar em modo anônimo
- [ ] 7. Limpar cache do navegador
- [ ] 8. Verificar `package.json` (sem --turbopack)
- [ ] 9. Reinstalar dependências (`rm -rf node_modules && npm install`)
- [ ] 10. Se nada funcionar, reportar o erro com logs completos

---

## 📞 QUANDO REPORTAR UM PROBLEMA

Antes de reportar, incluir:

1. ✅ **Erro exato:** Mensagem de erro completa
2. ✅ **Logs do servidor:** `tail -100 /tmp/next-dev.log`
3. ✅ **Logs do navegador:** Console do DevTools (F12)
4. ✅ **O que estava fazendo:** Ação que causou o erro
5. ✅ **Já tentou:** Quais soluções deste guia já testou
6. ✅ **Screenshot:** Se possível

---

## 🏥 HEALTH CHECK

Verificar saúde do sistema:

```bash
# 1. Verificar Node.js
node --version
# Deve ser: v20.x ou superior

# 2. Verificar npm
npm --version
# Deve ser: 10.x ou superior

# 3. Verificar Next.js
npm list next
# Deve ser: 15.5.4

# 4. Verificar servidor
curl -I http://localhost:3001
# Deve retornar: HTTP/1.1 200 OK
```

---

## 📚 LINKS ÚTEIS

- [Next.js Troubleshooting](https://nextjs.org/docs/messages)
- [Supabase Docs](https://supabase.com/docs)
- [Tailwind CSS Docs](https://tailwindcss.com/docs)

---

**Última atualização:** 2025-10-18  
**Versão:** 1.0

