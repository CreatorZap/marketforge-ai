# 🧪 Versão de Teste - Sem Banco de Dados

## ⚠️ O Que Foi Modificado

Esta é uma **versão temporária** do MarketForge que funciona **SEM** Supabase, permitindo que você teste o fluxo completo enquanto configura o banco de dados.

### Arquivos Modificados:

#### 1. `components/wizard/ProjectWizard.tsx`
**Mudanças:**
- ✅ Removida chamada à API `/api/generate`
- ✅ Geração **simulada** de documentos (2 segundos de delay)
- ✅ Dados salvos no **localStorage** do navegador
- ✅ Redirect para `/projects/success` (nova rota)

**Código alterado:**
```typescript
// ANTES (com Supabase):
const response = await fetch('/api/generate', ...)
router.push(`/projects/${data.projectId}`)

// AGORA (sem Supabase):
await new Promise(resolve => setTimeout(resolve, 2000)) // Simula geração
localStorage.setItem('marketforge_latest_project', JSON.stringify(mockResult))
router.push('/projects/success')
```

#### 2. `app/projects/success/page.tsx` (NOVO)
**Funcionalidade:**
- ✅ Lê dados do **localStorage**
- ✅ Exibe 3 tabs (Prompt | PRD | Pesquisa)
- ✅ Botões Copiar e Download funcionais
- ✅ **Não depende** do Supabase
- ✅ Alert visual indicando que é versão de teste

---

## 🚀 Como Testar

### 1. Acessar a Landing Page
```
http://localhost:3000
```

### 2. Clicar em "Começar Agora"
Você será redirecionado para:
```
http://localhost:3000/projects/new
```

### 3. Preencher o Wizard
- **Passo 1:** Nome do projeto (ex: "EcoVendas Pro")
- **Passo 2:** Nicho (ex: "E-commerce sustentável")
- **Passo 3:** Público (ex: "Mulheres 25-45 anos")
- **Passo 4:** Funcionalidades (ex: "Catálogo, carrinho, PIX")
- **Passo 5:** Plataforma (ex: "Bolt")
- **Passo 6:** Objetivo (ex: "R$ 50k em vendas")

### 4. Clicar em "Gerar Projeto"
- Loading aparece por 2 segundos
- Toast de sucesso
- Redirect automático para `/projects/success`

### 5. Ver Resultados
Na página de sucesso você verá:
- **Header** com nome do projeto
- **Alert amarelo** indicando que é versão de teste
- **3 Tabs:**
  - Prompt (para Bolt/Lovable/v0/Cursor)
  - PRD (Product Requirements Document)
  - Pesquisa de Mercado
- **Botões:**
  - Copiar (copia para clipboard + toast)
  - Download (baixa arquivo .md)

---

## 📝 Dados Gerados (Mock)

Os documentos são gerados automaticamente com base nos seus inputs:

### Prompt
```markdown
# PROMPT PARA [PLATAFORMA]

Crie um projeto completo de [SEU PROJETO].

## VISÃO GERAL
[SEU NICHO]

## PÚBLICO-ALVO
[SEU PÚBLICO]

## FUNCIONALIDADES PRINCIPAIS
[SUAS FUNCIONALIDADES]

## OBJETIVO DO NEGÓCIO
[SEU OBJETIVO]

## STACK TECNOLÓGICA RECOMENDADA
- Frontend: React/Next.js
- Backend: Node.js/Express
- Database: PostgreSQL
...
```

### PRD (Product Requirements Document)
- Visão geral do produto
- Público-alvo
- Requisitos funcionais
- Requisitos não-funcionais
- Stack tecnológica
- Cronograma sugerido
- Métricas de sucesso

### Pesquisa de Mercado
- Contexto do mercado
- Análise de concorrentes
- Persona detalhada
- Diferenciais competitivos
- Estratégia go-to-market
- Análise de viabilidade
- Riscos e mitigação

---

## 🔄 Quando Configurar o Supabase

Depois que você aplicar o schema SQL no Supabase, você pode:

### 1. Reverter as mudanças no `ProjectWizard.tsx`
Trocar de volta para:
```typescript
const response = await fetch('/api/generate', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(formData)
})

router.push(`/projects/${data.projectId}`)
```

### 2. Usar a rota original `/projects/[id]`
Ela já está pronta e integrada com Supabase:
- Busca projeto do banco
- Busca documentos relacionados
- Verifica permissões do usuário
- Exibe resultados

### 3. Deletar a rota temporária
```bash
rm -rf src/app/projects/success
```

---

## 💾 LocalStorage

Os dados ficam salvos em:
```javascript
localStorage.getItem('marketforge_latest_project')
```

### Estrutura dos Dados:
```json
{
  "projectName": "EcoVendas Pro",
  "niche": "E-commerce sustentável",
  "platform": "bolt",
  "prompt": "# PROMPT...",
  "prd": "# PRD...",
  "research": "# PESQUISA..."
}
```

### Limpar Dados (se necessário):
No console do navegador (F12):
```javascript
localStorage.removeItem('marketforge_latest_project')
```

---

## ✅ Vantagens da Versão de Teste

1. **Testar imediatamente** sem configurar banco
2. **Ver o fluxo completo** de ponta a ponta
3. **Validar a UI/UX** antes de integrar
4. **Copiar e usar** os documentos gerados
5. **Zero dependências** externas

---

## 🎯 Limitações

⚠️ Esta versão temporária tem limitações:

1. **Dados não persistem** entre sessões (localStorage é local)
2. **Sem histórico** de projetos anteriores
3. **Sem autenticação** de usuário
4. **Sem quotas** (pode gerar quantos quiser)
5. **Mock de documentos** (não usa IA real)

Quando configurar o Supabase + OpenAI, você terá:
- ✅ Persistência permanente
- ✅ Histórico completo
- ✅ Autenticação segura
- ✅ Sistema de quotas funcionando
- ✅ Geração real com GPT-4

---

## 🔧 Comandos Úteis

### Iniciar servidor:
```bash
npm run dev
```

### Limpar localStorage (navegador):
```javascript
localStorage.clear()
```

### Ver dados salvos:
```javascript
console.log(localStorage.getItem('marketforge_latest_project'))
```

---

## 📚 Próximos Passos

1. ✅ **Testar fluxo completo** com esta versão
2. ⏳ **Aplicar schema SQL** no Supabase
3. ⏳ **Reverter mudanças** no ProjectWizard
4. ⏳ **Testar com banco real**
5. ⏳ **Deletar versão temporária**

---

## 🆘 Troubleshooting

### Erro: "Nenhum projeto encontrado"
**Solução:** Gere um novo projeto no wizard

### Dados não aparecem
**Solução:** Verifique o console (F12) → Application → Local Storage

### Download não funciona
**Solução:** Certifique-se que está usando HTTPS ou localhost

---

## 📞 Suporte

Se encontrar problemas, verifique:
1. Console do navegador (F12 → Console)
2. Network tab (F12 → Network)
3. LocalStorage (F12 → Application → Local Storage)

**Boa sorte com os testes! 🚀**
