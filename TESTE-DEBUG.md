# 🧪 GUIA DE TESTE - DEBUG DO SISTEMA MARKETFORGE

## ⚡ PREPARAÇÃO

1. Abrir o navegador (Chrome, Edge ou Firefox)
2. Pressionar **F12** (ou Cmd+Option+I no Mac) para abrir DevTools
3. Ir na aba **"Console"**
4. Limpar o console clicando no ícone 🚫 (Clear console)
5. Manter o console aberto durante todos os testes

---

## 📋 TESTE 1: WIZARD - BOTÕES INDIVIDUAIS

### 🎯 Objetivo:
Verificar se os 3 documentos (Prompt, PRD, Research) têm botões individuais de Copiar e Download.

### Passos:
1. Acesse: **http://localhost:3000/projects/new** (ou porta 3001 se 3000 estiver ocupada)
2. Preencha o wizard completo (7 passos):
   - Passo 1: Nome do Projeto
   - Passo 2: Nicho de Mercado
   - Passo 3: Público-Alvo
   - Passo 4: Funcionalidades
   - Passo 5: Plataforma (deixe padrão)
   - Passo 6: Objetivo
   - Passo 7: Estilo Visual (deixe padrão)
3. Clique em **"Gerar Projeto"**
4. Aguarde a geração (aproximadamente 90 segundos)

### ✅ Verificar:
- [ ] Apareceram **3 cards separados** (Prompt, PRD, Research)?
- [ ] Card 1 (Prompt) tem ícone **✨ (Sparkles)** roxo?
- [ ] Card 1 tem botão **"Copiar"** roxo?
- [ ] Card 1 tem botão **"Download"** azul?
- [ ] Card 2 (PRD) tem ícone **📄 (FileText)** azul?
- [ ] Card 2 tem botão **"Copiar"** roxo?
- [ ] Card 2 tem botão **"Download"** azul?
- [ ] Card 3 (Research) tem ícone **✅ (FileCheck)** verde?
- [ ] Card 3 tem botão **"Copiar"** roxo?
- [ ] Card 3 tem botão **"Download"** azul?

### 🧪 Testar Funcionalidade:
1. Clique no botão **"Copiar"** do Prompt:
   - [ ] Apareceu toast "Prompt copiado!"?
   - [ ] Consegue colar (Ctrl+V) o conteúdo em um editor de texto?

2. Clique no botão **"Download"** do Prompt:
   - [ ] Baixou arquivo `[nome-do-projeto]-prompt.md`?
   - [ ] O arquivo contém o prompt completo?

3. Repita para PRD e Research:
   - [ ] PRD: Copiar funciona?
   - [ ] PRD: Download baixa `[nome-do-projeto]-prd.md`?
   - [ ] Research: Copiar funciona?
   - [ ] Research: Download baixa `[nome-do-projeto]-research.md`?

### 📊 Resultado esperado:
✅ **TODOS os itens devem estar marcados**

### ❌ Se algo falhar:
- Anote qual botão não funcionou
- Tire um screenshot da tela
- Verifique se aparecem erros no console

---

## 📋 TESTE 2: DASHBOARD - DEBUG DE NAVEGAÇÃO

### 🎯 Objetivo:
Capturar logs detalhados da navegação do dashboard para a página do projeto.

### Passos:

#### 2.1 - Carregar Dashboard
1. Console aberto (F12)
2. Limpe o console (🚫)
3. Acesse: **http://localhost:3000/dashboard**
4. Aguarde carregar completamente

### 📝 Logs esperados ao carregar:
```
🔍 [DASHBOARD] Renderizando projeto: { id: "...", name: "...", linkHref: "/projects/..." }
```

### ✅ Verificar:
- [ ] Apareceram logs com 🔍 [DASHBOARD]?
- [ ] Cada projeto tem um log?
- [ ] Os logs mostram o `id` correto?
- [ ] Os logs mostram o `linkHref` correto?

### 📋 Copie e salve:
```
[Cole aqui TODOS os logs que começam com 🔍 [DASHBOARD]]




```

### 📊 Anote:
- Quantos projetos foram renderizados: ______
- Os IDs dos projetos parecem corretos (UUID)? [ ] SIM [ ] NÃO

---

#### 2.2 - Clicar no Link

### Passos:
1. **NÃO limpe o console** (precisamos ver o fluxo completo)
2. Clique em **"Ver detalhes →"** de **qualquer projeto**

### 📝 Logs esperados ao clicar:
```
🔗 [DASHBOARD] Link clicado!
ID do projeto: abc-123-def-456...
Href completo: http://localhost:3000/projects/abc-123-def-456...
getAttribute: /projects/abc-123-def-456...
Window location atual: http://localhost:3000/dashboard
```

### ✅ Verificar:
- [ ] Apareceu log **"🔗 [DASHBOARD] Link clicado!"**?
- [ ] Apareceu log **"ID do projeto:"** com UUID?
- [ ] Apareceu log **"Href completo:"** com URL completa?
- [ ] Apareceu log **"getAttribute:"** com path relativo?
- [ ] Apareceu log **"Window location atual:"**?

### 📋 Copie e salve:
```
[Cole aqui TODOS os logs que começam com 🔗 [DASHBOARD]]




```

### 📊 Anote:
- **Href completo** mostrado no log: _________________________________
- **getAttribute** mostrado no log: _________________________________

---

#### 2.3 - Verificar Navegação

### ✅ Verificar no navegador:

1. **Para qual URL o navegador redirecionou?**
   - [ ] `/projects/[id]` (correto)
   - [ ] `/login` (errado - 404)
   - [ ] `/auth/login` (página de login)
   - [ ] Outra: _________________

2. **O que apareceu na tela?**
   - [ ] Página do projeto com 3 documentos
   - [ ] Página de login
   - [ ] Erro 404 Not Found
   - [ ] Página em branco
   - [ ] Outro: _________________

3. **A URL no navegador é:**
   ```
   _________________________________________________
   ```

---

## 📋 TESTE 3: PÁGINA DE PROJETO - DEBUG COMPLETO

### 🎯 Objetivo:
Capturar logs detalhados do carregamento da página do projeto.

### ⚠️ Este teste só funciona se o TESTE 2 levou você para `/projects/[id]`

### Se a página carregou corretamente:

### 📝 Logs esperados:
```
🔍 [PROJECT PAGE] Iniciando carregamento...
🔍 [PROJECT PAGE] ID recebido: abc-123-def-456...
🔍 [PROJECT PAGE] Tipo do ID: string
🔐 [PROJECT PAGE] Verificando autenticação...
🔐 [PROJECT PAGE] Resultado auth: { userExists: true, userId: "...", hasError: false }
✅ [PROJECT PAGE] Usuário autenticado: abc-123...
📊 [PROJECT PAGE] Buscando projeto com ID: abc-123-def-456...
📊 [PROJECT PAGE] Resultado da busca: { projetoEncontrado: true, hasError: false }
✅ [PROJECT PAGE] Projeto carregado com sucesso: [Nome do Projeto]
```

### ✅ Verificar:
- [ ] Apareceram logs com 🔍 [PROJECT PAGE]?
- [ ] Apareceu log com **"ID recebido"**?
- [ ] Apareceu log com **"Tipo do ID: string"**?
- [ ] Apareceram logs com 🔐 [PROJECT PAGE]?
- [ ] Apareceu **"userExists: true"**?
- [ ] Apareceu ✅ **"Usuário autenticado"**?
- [ ] Apareceram logs com 📊 [PROJECT PAGE]?
- [ ] Apareceu **"projetoEncontrado: true"**?
- [ ] Apareceu ✅ **"Projeto carregado com sucesso"**?

### 📋 Copie e salve:
```
[Cole aqui TODOS os logs que começam com 🔍, 🔐, 📊, ✅ ou ❌]




```

---

## 📋 TESTE 4: SE DEU ERRO 404 OU REDIRECIONOU PARA /login

### 🎯 Objetivo:
Identificar onde está o problema se a navegação falhar.

### Se redirecionou para `/login` (404):

1. **Volte para o dashboard:**
   - Digite na barra: `http://localhost:3000/dashboard`

2. **Abra o console novamente (F12)**

3. **Limpe o console (🚫)**

4. **Clique em OUTRO projeto** (diferente do primeiro)

5. **Veja os logs e anote:**

### 📊 Anote:
- O **"Href completo"** mostra `/login` ou `/projects/[id]`? _______________
- O **"getAttribute"** mostra `/login` ou `/projects/[id]`? _______________
- A **URL no navegador** é `/login` ou `/projects/[id]`? _______________

### ✅ Verificar:
- [ ] Os logs mostram `/projects/[id]` mas o navegador vai para `/login`?
- [ ] Os logs JÁ mostram `/login`?
- [ ] Não aparecem logs do [PROJECT PAGE]?

### 📋 Cenários possíveis:

**Cenário A:** Logs mostram `/projects/[id]` mas navegador vai para `/login`
- ✅ Problema: Algo está interceptando a navegação
- 🔍 Possível causa: Cache do navegador, Service Worker, ou extensão

**Cenário B:** Logs JÁ mostram `/login`
- ❌ Problema: O código está gerando o link errado
- 🔍 Possível causa: Código não foi salvo corretamente

**Cenário C:** Não aparecem logs do [PROJECT PAGE]
- ❌ Problema: A página não está sendo carregada
- 🔍 Possível causa: Erro no servidor Next.js

---

## 📋 TESTE 5: LIMPEZA DE CACHE (SE TESTE 4 FALHOU)

### 🎯 Objetivo:
Limpar cache do navegador que pode estar causando redirecionamentos incorretos.

### Passos:

#### 5.1 - Limpar Cache (Chrome/Edge)
1. Pressione **Cmd+Shift+Delete** (Mac) ou **Ctrl+Shift+Delete** (Windows)
2. Selecione período: **"Últimas 24 horas"**
3. Marque:
   - [x] Imagens e arquivos em cache
   - [x] Cookies e outros dados de sites
4. Clique em **"Limpar dados"**
5. Feche e reabra o navegador

#### 5.2 - Force Refresh
1. Acesse: `http://localhost:3000/dashboard`
2. Pressione **Cmd+Shift+R** (Mac) ou **Ctrl+Shift+R** (Windows)

#### 5.3 - Teste em Modo Anônimo
1. Abra uma janela anônima/privada:
   - Chrome: **Cmd+Shift+N** (Mac) ou **Ctrl+Shift+N** (Windows)
   - Firefox: **Cmd+Shift+P** (Mac) ou **Ctrl+Shift+P** (Windows)
2. Acesse: `http://localhost:3000/dashboard`
3. Faça login
4. Clique em "Ver detalhes →"

### ✅ Verificar:
- [ ] No modo anônimo funcionou?
- [ ] Se SIM: Problema é cache do navegador
- [ ] Se NÃO: Problema é no código

---

## 📊 RELATÓRIO FINAL

### Preencha este relatório e envie os resultados:

---

### 🧪 TESTE 1 - Wizard (Botões Individuais):
- Botões de Copiar funcionando? **[ ] SIM [ ] NÃO**
- Botões de Download funcionando? **[ ] SIM [ ] NÃO**
- Toasts aparecem? **[ ] SIM [ ] NÃO**
- Problema encontrado: _______________________________________________

---

### 🧪 TESTE 2 - Dashboard (Logs de Navegação):
- Logs aparecem ao carregar? **[ ] SIM [ ] NÃO**
- Logs aparecem ao clicar? **[ ] SIM [ ] NÃO**
- **Href completo mostrado:** ___________________________________________
- **URL real no navegador:** ___________________________________________
- São iguais? **[ ] SIM [ ] NÃO**

---

### 🧪 TESTE 3 - Página Projeto (Logs Completos):
- Página carregou? **[ ] SIM [ ] NÃO**
- Logs do [PROJECT PAGE] aparecem? **[ ] SIM [ ] NÃO**
- Usuário foi autenticado? **[ ] SIM [ ] NÃO**
- Projeto foi encontrado? **[ ] SIM [ ] NÃO**
- Erro encontrado: _______________________________________________

---

### 🧪 TESTE 4 - Erro 404 (Se aplicável):
- Redirecionou para `/login`? **[ ] SIM [ ] NÃO**
- Logs mostram URL correta? **[ ] SIM [ ] NÃO**
- Diferença entre logs e navegador? **[ ] SIM [ ] NÃO**

---

### 🧪 TESTE 5 - Limpeza de Cache (Se aplicável):
- Limpou o cache? **[ ] SIM [ ] NÃO**
- Funcionou após limpar cache? **[ ] SIM [ ] NÃO**
- Testou em modo anônimo? **[ ] SIM [ ] NÃO**
- Funcionou em modo anônimo? **[ ] SIM [ ] NÃO**

---

## 📝 LOGS COMPLETOS DO CONSOLE

Cole aqui **TODOS** os logs capturados durante os testes:

```
[Cole aqui todos os logs do console - quanto mais detalhes, melhor!]





































```

---

## 🎯 CONCLUSÃO

Com base nos testes realizados, o problema é:

**[ ] RESOLVIDO** - Tudo funcionando corretamente

**[ ] PROBLEMA IDENTIFICADO:**
- Tipo: _______________________________________________
- Local: _______________________________________________
- Logs relevantes: _______________________________________________

---

## 📞 SUPORTE

Se precisar de ajuda, envie:
1. ✅ Este relatório preenchido
2. ✅ Todos os logs do console
3. ✅ Screenshots das telas onde ocorreram problemas
4. ✅ Descrição detalhada do que esperava vs o que aconteceu

---

**Versão do Guia:** 1.0  
**Data:** 2025-10-18  
**Projeto:** MarketForge Clean

