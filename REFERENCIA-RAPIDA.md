# 📖 REFERÊNCIA RÁPIDA - LOCALIZAÇÃO DAS MODIFICAÇÕES

## 🎯 Use este documento para encontrar rapidamente onde cada modificação foi feita

---

## 📁 1. src/components/wizard/ProjectWizard.tsx

### Imports
```typescript
Linha 6:  import { toast } from 'sonner'
Linha 7:  import { ..., Copy, Download } from 'lucide-react'
```

### Seção de Resultados (if generatedResult)
```typescript
Linhas ~470-650: Toda a seção foi reescrita

Estrutura:
  └─ Linhas 470-485: Header com botões "Novo Projeto" e "Dashboard"
  └─ Linhas 487-520: Card 1 - PROMPT (Sparkles roxo)
      ├─ Botão Copiar (onClick → navigator.clipboard)
      └─ Botão Download (onClick → Blob + download)
  └─ Linhas 522-555: Card 2 - PRD (FileText azul)
      ├─ Botão Copiar
      └─ Botão Download
  └─ Linhas 557-590: Card 3 - RESEARCH (FileCheck verde)
      ├─ Botão Copiar
      └─ Botão Download
```

### Funcionalidades em cada botão:
- **Copiar:** `navigator.clipboard.writeText(generatedResult.prompt)`
- **Download:** Cria `Blob` → `URL.createObjectURL` → `<a>.download`
- **Toast:** `toast.success('Prompt copiado!')`
- **Arquivo:** `${generatedResult.projectName}-prompt.md`

---

## 📁 2. src/app/dashboard/page.tsx

### Import
```typescript
Linha 7: import Link from 'next/link';
```

### Console.log ao Renderizar
```typescript
Linhas 209-213:
  console.log('🔍 [DASHBOARD] Renderizando projeto:', {
    id: project.id,
    name: project.name,
    linkHref: `/projects/${project.id}`
  });
```

### Link "Ver detalhes →"
```typescript
Linhas 241-253:
  <Link
    href={`/projects/${project.id}`}
    onClick={(e) => {
      console.log('🔗 [DASHBOARD] Link clicado!');
      console.log('ID do projeto:', project.id);
      console.log('Href completo:', e.currentTarget.href);
      console.log('getAttribute:', e.currentTarget.getAttribute('href'));
      console.log('Window location atual:', window.location.href);
    }}
    className="text-purple-400 hover:text-purple-300 text-sm font-medium"
  >
    Ver detalhes →
  </Link>
```

---

## 📁 3. src/app/projects/[id]/page.tsx

### Logs de Inicialização
```typescript
Linhas 17-19:
  console.log('🔍 [PROJECT PAGE] Iniciando carregamento...')
  console.log('🔍 [PROJECT PAGE] ID recebido:', id)
  console.log('🔍 [PROJECT PAGE] Tipo do ID:', typeof id)
```

### Logs de Autenticação
```typescript
Linha 24:
  console.log('🔐 [PROJECT PAGE] Verificando autenticação...')

Linhas 27-33:
  console.log('🔐 [PROJECT PAGE] Resultado auth:', {
    userExists: !!user,
    userId: user?.id,
    hasError: !!authError,
    errorMessage: authError?.message
  })

Linha 35:
  console.log('❌ [PROJECT PAGE] Não autenticado, redirecionando para /auth/login')

Linha 36:
  redirect('/auth/login')  // ← CONFIRMADO: /auth/login

Linha 39:
  console.log('✅ [PROJECT PAGE] Usuário autenticado:', user.id)
```

### Logs de Busca do Projeto
```typescript
Linha 42:
  console.log('📊 [PROJECT PAGE] Buscando projeto com ID:', id)

Linhas 50-56:
  console.log('📊 [PROJECT PAGE] Resultado da busca:', {
    projetoEncontrado: !!project,
    hasError: !!projectError,
    errorMessage: projectError?.message,
    errorCode: projectError?.code
  })

Linha 58:
  console.log('❌ [PROJECT PAGE] Projeto não encontrado, retornando 404')

Linha 62:
  console.log('✅ [PROJECT PAGE] Projeto carregado com sucesso:', project.name)
```

---

## 🔍 LOGS POR EMOJI

### 🔍 [DASHBOARD]
- **Onde:** `src/app/dashboard/page.tsx`
- **Linha:** 209-213 (ao renderizar)
- **Captura:** ID, name, linkHref

### 🔗 [DASHBOARD]
- **Onde:** `src/app/dashboard/page.tsx`
- **Linhas:** 244-248 (ao clicar)
- **Captura:** ID, href completo, getAttribute, location

### 🔍 [PROJECT PAGE]
- **Onde:** `src/app/projects/[id]/page.tsx`
- **Linhas:** 17-19 (inicialização)
- **Captura:** ID recebido, tipo do ID

### 🔐 [PROJECT PAGE]
- **Onde:** `src/app/projects/[id]/page.tsx`
- **Linhas:** 24-33 (autenticação)
- **Captura:** User exists, user ID, erros

### 📊 [PROJECT PAGE]
- **Onde:** `src/app/projects/[id]/page.tsx`
- **Linhas:** 42-56 (busca)
- **Captura:** Projeto encontrado, erros

### ✅ [PROJECT PAGE]
- **Onde:** `src/app/projects/[id]/page.tsx`
- **Linhas:** 39, 62 (sucesso)
- **Captura:** User ID, project name

### ❌ [PROJECT PAGE]
- **Onde:** `src/app/projects/[id]/page.tsx`
- **Linhas:** 35, 58 (erro)
- **Captura:** Mensagem de erro

---

## 🧪 COMANDOS PARA BUSCAR NO CÓDIGO

### Buscar todos os console.logs adicionados:
```bash
grep -n "console.log" src/app/dashboard/page.tsx
grep -n "console.log" src/app/projects/[id]/page.tsx
```

### Buscar imports específicos:
```bash
grep -n "import.*Copy.*Download" src/components/wizard/ProjectWizard.tsx
grep -n "import.*toast" src/components/wizard/ProjectWizard.tsx
grep -n "import Link from 'next/link'" src/app/dashboard/page.tsx
```

### Verificar o redirect:
```bash
grep -n "redirect('/auth/login')" src/app/projects/[id]/page.tsx
```

---

## 📊 TABELA DE REFERÊNCIA RÁPIDA

| Arquivo | Tipo de Modificação | Linhas | Emojis |
|---------|-------------------|--------|--------|
| `ProjectWizard.tsx` | Imports | 6-7 | - |
| `ProjectWizard.tsx` | Cards separados | ~470-650 | ✨📄✅ |
| `ProjectWizard.tsx` | Botões Copiar/Download | ~490-650 | - |
| `dashboard/page.tsx` | Import Link | 7 | - |
| `dashboard/page.tsx` | Log renderização | 209-213 | 🔍 |
| `dashboard/page.tsx` | Log clique | 244-248 | 🔗 |
| `dashboard/page.tsx` | Link component | 241-253 | - |
| `projects/[id]/page.tsx` | Logs init | 17-19 | 🔍 |
| `projects/[id]/page.tsx` | Logs auth | 24-39 | 🔐✅❌ |
| `projects/[id]/page.tsx` | Logs busca | 42-62 | 📊✅❌ |
| `projects/[id]/page.tsx` | Redirect | 36 | - |

---

## 🎯 QUICK LINKS

### Para DEBUG:
1. Abra DevTools (F12)
2. Vá para Console
3. Limpe com 🚫
4. Navegue pela aplicação
5. Procure por logs com emojis: 🔍 🔗 🔐 📊 ✅ ❌

### Para VERIFICAR CÓDIGO:
```bash
# Dashboard
code src/app/dashboard/page.tsx:209

# Project Page
code src/app/projects/[id]/page.tsx:17

# Wizard
code src/components/wizard/ProjectWizard.tsx:470
```

### Para TESTAR:
1. `http://localhost:3001/projects/new` → Wizard
2. Preencher wizard → Ver 3 cards
3. `http://localhost:3001/dashboard` → Ver logs 🔍
4. Clicar "Ver detalhes →" → Ver logs 🔗
5. Ver logs 🔐 e 📊 na página do projeto

---

## 💡 DICAS DE DEBUG

### Se não aparecem logs:
1. ✅ Verificar se o console está aberto (F12)
2. ✅ Verificar se o filtro do console não está ativo
3. ✅ Recarregar a página (Cmd/Ctrl + R)
4. ✅ Limpar cache (Cmd/Ctrl + Shift + R)

### Se o redirect vai para /login (404):
1. ✅ Verificar linha 36 de `projects/[id]/page.tsx`
2. ✅ Deve ser `redirect('/auth/login')` e não `redirect('/login')`
3. ✅ Limpar cache do navegador
4. ✅ Testar em modo anônimo

### Se os botões não funcionam no Wizard:
1. ✅ Verificar imports nas linhas 6-7
2. ✅ Verificar se `toast` está importado
3. ✅ Verificar se `Copy` e `Download` estão importados
4. ✅ Verificar console do navegador por erros

---

**Última atualização:** 2025-10-18  
**Versão:** 1.0

