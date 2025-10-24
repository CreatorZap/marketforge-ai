# 🔧 SOLUÇÃO PARA PROBLEMA DO JSPDF

**Problema:** Páginas de Proposta Comercial e Contrato não carregam  
**Causa:** Dependências opcionais do jsPDF não resolvidas pelo Webpack  
**Status:** ⚠️ NECESSITA CORREÇÃO

---

## 🚨 ERRO ATUAL

```
Module not found: Can't resolve 'html2canvas'
Module not found: Can't resolve 'dompurify'  
Module not found: Can't resolve 'canvg'
```

**Páginas afetadas:**
- `/copywriter/proposal`
- `/copywriter/contract`

**Componente com problema:**
- `src/components/copywriter/DocumentPreview.tsx`

---

## 💡 SOLUÇÕES POSSÍVEIS

### SOLUÇÃO 1: Desabilitar jsPDF Temporariamente (RÁPIDA) ⚡

**Tempo:** 5 minutos  
**Complexidade:** Baixa

**Passos:**

1. Comentar o import do jsPDF em `src/components/copywriter/DocumentPreview.tsx`:

```typescript
// import { jsPDF } from 'jspdf'

const DocumentPreview = ({ content, type }: DocumentPreviewProps) => {
  // ...
  
  const handleDownloadPDF = () => {
    // Temporariamente desabilitado
    toast.error('Download PDF temporariamente indisponível. Use "Copiar Texto" para salvar o conteúdo.')
    return
    
    /* Original code:
    const doc = new jsPDF()
    doc.text(content, 10, 10)
    doc.save(`${type}.pdf`)
    */
  }
  
  // ...
}
```

2. Ocultar/desabilitar botão "Download PDF":

```typescript
<button
  onClick={handleDownloadPDF}
  disabled={true}
  className="px-4 py-2 bg-gray-400 text-white rounded-lg cursor-not-allowed"
>
  <Download className="w-4 h-4" />
  Download PDF (Em breve)
</button>
```

**Prós:**
- ✅ Rápido de implementar
- ✅ Páginas voltam a funcionar imediatamente
- ✅ Usuário pode copiar e colar o texto

**Contras:**
- ❌ Perde funcionalidade de PDF
- ❌ Solução temporária

---

### SOLUÇÃO 2: Configurar Next.js Config (MÉDIO) 🛠️

**Tempo:** 30 minutos  
**Complexidade:** Média

**Passos:**

1. Atualizar `next.config.ts`:

```typescript
import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Ignorar dependências opcionais do jsPDF no client
      config.resolve.fallback = {
        ...config.resolve.fallback,
        'html2canvas': false,
        'dompurify': false,
        'canvg': false,
      }
    }
    return config
  },
  // Outras configurações...
}

export default nextConfig
```

2. Instalar dependências explicitamente:

```bash
npm install html2canvas dompurify canvg --save
```

3. Testar build:

```bash
rm -rf .next
npm run build
npm run dev
```

**Prós:**
- ✅ Mantém funcionalidade de PDF
- ✅ Configuração permanente
- ✅ Webpack resolve corretamente

**Contras:**
- ⚠️ Pode aumentar bundle size
- ⚠️ Requer teste extensivo

---

### SOLUÇÃO 3: Migrar para `react-pdf` (LONGO PRAZO) 🚀

**Tempo:** 2-3 horas  
**Complexidade:** Alta

**Passos:**

1. Instalar `react-pdf`:

```bash
npm install @react-pdf/renderer
npm uninstall jspdf
```

2. Criar novo componente `PDFDocument.tsx`:

```typescript
import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: 30,
  },
  section: {
    margin: 10,
  },
  title: {
    fontSize: 24,
    marginBottom: 10,
  },
  text: {
    fontSize: 12,
  },
})

export const PDFDocument = ({ content, title }: PDFDocumentProps) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View style={styles.section}>
        <Text style={styles.title}>{title}</Text>
        <Text style={styles.text}>{content}</Text>
      </View>
    </Page>
  </Document>
)
```

3. Atualizar `DocumentPreview.tsx`:

```typescript
import { PDFDownloadLink } from '@react-pdf/renderer'
import { PDFDocument } from './PDFDocument'

const DocumentPreview = ({ content, type }: DocumentPreviewProps) => {
  return (
    <PDFDownloadLink 
      document={<PDFDocument content={content} title={type} />} 
      fileName={`${type}.pdf`}
    >
      {({ loading }) => (
        <button
          disabled={loading}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg"
        >
          {loading ? 'Gerando...' : 'Download PDF'}
        </button>
      )}
    </PDFDownloadLink>
  )
}
```

**Prós:**
- ✅ Biblioteca moderna e mantida
- ✅ Melhor compatibilidade com React/Next.js
- ✅ Mais controle sobre layout do PDF
- ✅ Sem dependências opcionais problemáticas

**Contras:**
- ⏱️ Requer mais tempo de implementação
- 📚 Curva de aprendizado para sintaxe diferente
- 🔄 Precisa refatorar código existente

---

### SOLUÇÃO 4: Dynamic Import com Error Boundary (AVANÇADO) 💪

**Tempo:** 1 hora  
**Complexidade:** Alta

**Passos:**

1. Criar wrapper com dynamic import:

```typescript
// src/lib/pdf/pdf-utils.ts
export async function generatePDF(content: string, filename: string) {
  try {
    const jsPDF = (await import('jspdf')).jsPDF
    const doc = new jsPDF()
    
    // Configurar PDF
    doc.text(content, 10, 10)
    doc.save(filename)
    
    return { success: true }
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return { success: false, error }
  }
}
```

2. Usar no componente:

```typescript
import { generatePDF } from '@/lib/pdf/pdf-utils'

const DocumentPreview = ({ content, type }: DocumentPreviewProps) => {
  const [loading, setLoading] = useState(false)
  
  const handleDownloadPDF = async () => {
    setLoading(true)
    const result = await generatePDF(content, `${type}.pdf`)
    
    if (result.success) {
      toast.success('PDF gerado com sucesso!')
    } else {
      toast.error('Erro ao gerar PDF. Tente copiar o texto.')
    }
    
    setLoading(false)
  }
  
  return (
    <button
      onClick={handleDownloadPDF}
      disabled={loading}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg"
    >
      {loading ? 'Gerando...' : 'Download PDF'}
    </button>
  )
}
```

3. Adicionar Error Boundary:

```typescript
// src/components/ErrorBoundary.tsx
'use client'

import { Component, ReactNode } from 'react'

export class ErrorBoundary extends Component<
  { children: ReactNode },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError() {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
          <h2 className="text-red-800 font-bold">Algo deu errado</h2>
          <p className="text-red-600">Por favor, tente novamente.</p>
        </div>
      )
    }

    return this.props.children
  }
}
```

**Prós:**
- ✅ Mantém jsPDF
- ✅ Tratamento de erro robusto
- ✅ Não quebra a aplicação
- ✅ Loading state para UX

**Contras:**
- ⚠️ Mais complexo
- ⚠️ Ainda depende do jsPDF

---

## 🎯 RECOMENDAÇÃO

### Para Curto Prazo (AGORA):
**Use SOLUÇÃO 1** - Desabilitar jsPDF temporariamente

**Motivo:**
- Sistema volta a funcionar em 5 minutos
- Usuário pode copiar e colar o conteúdo
- Ganho de tempo para implementar solução permanente

### Para Médio Prazo (1-2 dias):
**Use SOLUÇÃO 3** - Migrar para `react-pdf`

**Motivo:**
- Solução moderna e robusta
- Melhor integração com Next.js
- Evita problemas futuros
- Melhor experiência de desenvolvimento

---

## 📋 CHECKLIST DE IMPLEMENTAÇÃO

### Solução Temporária (5 min):
- [ ] Comentar import jsPDF
- [ ] Modificar handleDownloadPDF para mostrar toast
- [ ] Desabilitar botão Download PDF
- [ ] Testar páginas de Proposta e Contrato
- [ ] Commit: "fix: disable jsPDF temporarily"

### Solução Permanente (2-3h):
- [ ] Instalar @react-pdf/renderer
- [ ] Criar componente PDFDocument
- [ ] Atualizar DocumentPreview
- [ ] Testar geração de PDF
- [ ] Testar download
- [ ] Verificar formatação do PDF
- [ ] Remover jsPDF do package.json
- [ ] Commit: "feat: migrate to react-pdf"

---

## 🧪 COMO TESTAR

### Teste Manual:

1. **Acessar páginas:**
   ```
   http://localhost:3000/copywriter/proposal
   http://localhost:3000/copywriter/contract
   ```

2. **Verificar:**
   - [ ] Página carrega sem erro
   - [ ] Formulário visível
   - [ ] Pode preencher campos
   - [ ] Botão "Gerar" funciona
   - [ ] Preview do documento aparece
   - [ ] Botão "Copiar" funciona
   - [ ] Botão "Download" (ou alternativa) funciona

3. **Testar em navegadores:**
   - [ ] Chrome
   - [ ] Firefox
   - [ ] Safari
   - [ ] Edge

### Teste Automatizado:

```typescript
// tests/copywriter.spec.ts
import { test, expect } from '@playwright/test'

test('Proposta Comercial carrega corretamente', async ({ page }) => {
  await page.goto('http://localhost:3000/copywriter/proposal')
  await expect(page).toHaveTitle(/Proposta/)
  
  // Preencher formulário
  await page.fill('[name="clientName"]', 'Teste Cliente')
  await page.fill('[name="projectValue"]', '5000')
  
  // Gerar documento
  await page.click('button:has-text("Gerar Proposta")')
  
  // Verificar preview
  await expect(page.locator('.document-preview')).toBeVisible()
  
  // Testar botões
  const copyButton = page.locator('button:has-text("Copiar")')
  await expect(copyButton).toBeEnabled()
})
```

---

## 📚 REFERÊNCIAS

- [jsPDF Documentation](https://github.com/parallax/jsPDF)
- [React-PDF Documentation](https://react-pdf.org/)
- [Next.js Webpack Config](https://nextjs.org/docs/app/api-reference/next-config-js/webpack)
- [Webpack Resolve Fallback](https://webpack.js.org/configuration/resolve/#resolvefallback)

---

## 💬 AJUDA

Se encontrar dificuldades:

1. **Verificar logs:**
   ```bash
   tail -f /tmp/marketforge-dev.log
   ```

2. **Limpar cache:**
   ```bash
   rm -rf .next node_modules/.cache
   npm run dev
   ```

3. **Reinstalar dependências:**
   ```bash
   rm -rf node_modules package-lock.json
   npm install
   ```

4. **Consultar documentação:** `TROUBLESHOOTING.md`

---

**Última atualização:** 18/10/2025  
**Status:** ⚠️ Problema identificado, soluções documentadas  
**Prioridade:** Alta - Afeta 2 funcionalidades importantes


