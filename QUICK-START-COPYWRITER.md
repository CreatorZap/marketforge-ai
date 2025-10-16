# ⚡ Quick Start - IA Copywriter

## 🚀 Início Rápido em 3 Passos

### **1️⃣ Instalar Dependências**

```bash
chmod +x INSTALL-COPYWRITER-DEPS.sh
./INSTALL-COPYWRITER-DEPS.sh
```

### **2️⃣ Executar Projeto**

```bash
npm run dev
```

### **3️⃣ Acessar e Testar**

**Propostas:** http://localhost:3000/copywriter/proposal  
**Contratos:** http://localhost:3000/copywriter/contract  
**Landing:** http://localhost:3000 (scroll até "IA Copywriter")

---

## 📝 Gerar Proposta Comercial (30s)

1. Acesse: `http://localhost:3000/copywriter/proposal`

2. Preencha:
   - **Cliente:** João Silva
   - **Seu Nome:** Maria Santos
   - **Escopo:** Desenvolvimento de site institucional responsivo com 5 páginas (home, sobre, serviços, portfólio, contato), formulário de contato integrado e sistema de gerenciamento de conteúdo.
   - **Prazo:** 30 dias
   - **Valor:** R$ 5.000
   - **Pagamento:** 50% no início do projeto e 50% na entrega final

3. Clique em **"Gerar Proposta Comercial"**

4. Aguarde ~30 segundos

5. **Edite, Copie ou Baixe** o resultado!

---

## 📜 Gerar Contrato de Serviços (45s)

1. Acesse: `http://localhost:3000/copywriter/contract`

2. Selecione: **🔘 Pessoa Física** ou **🔘 Pessoa Jurídica**

3. Preencha **Dados do Fornecedor (VOCÊ):**
   - Nome: Maria Santos
   - CPF: 000.000.000-00
   - Endereço: Rua das Flores, 123, Centro, São Paulo, SP, 01000-000
   - Email: maria@email.com
   - Telefone: (11) 99999-9999

4. Preencha **Dados do Cliente:**
   - Nome: João Silva
   - CPF: 111.111.111-11
   - Endereço: Av. Principal, 456, Centro, São Paulo, SP, 02000-000
   - Email: joao@email.com
   - Telefone: (11) 88888-8888

5. Preencha **Detalhes do Contrato:**
   - **Objeto:** Prestação de serviços de desenvolvimento de site institucional responsivo com 5 páginas, incluindo formulário de contato e sistema de gerenciamento de conteúdo CMS.
   - **Prazo:** 60 dias
   - **Valor:** R$ 10.000,00
   - **Pagamento:** 30% entrada, 40% meio do projeto, 30% entrega final

6. Clique em **"Gerar Contrato de Serviços"**

7. Aguarde ~45 segundos

8. **⚠️ LEIA O DISCLAIMER** e **Edite, Copie ou Baixe** o resultado!

---

## 🎯 Funcionalidades Principais

### **Preview Editável:**
- ✏️ **Editar:** Clique em "Editar" para ajustar o documento
- 💾 **Salvar:** Clique em "Salvar Edição" quando terminar
- 📋 **Copiar:** Clique em "Copiar" para área de transferência
- 💾 **Download:** Clique em "Download" para baixar .md

### **Validações:**
- ✅ Campos obrigatórios marcados com `*`
- ✅ Border vermelho em campos inválidos
- ✅ Mensagens de erro contextuais
- ✅ Botão desabilitado se formulário inválido

### **Estatísticas:**
- 📊 Contador de palavras
- 📊 Contador de caracteres
- 📊 Contador de linhas
- ⚠️ Indicador de edição

---

## ⚙️ Configuração OpenAI

Certifique-se de que `.env.local` tem:

```env
OPENAI_API_KEY=sk-...seu-api-key...
```

**Obter API Key:**
1. Acesse: https://platform.openai.com/api-keys
2. Crie nova chave
3. Cole no `.env.local`

---

## 🎨 Navegação

### **Na Landing Page:**

Scroll até a seção **"IA Copywriter"**:

```
┌─────────────────────────────────┐
│  📄 Gerar Proposta Comercial    │ → /copywriter/proposal
├─────────────────────────────────┤
│  📜 Gerar Contrato de Serviços  │ → /copywriter/contract
└─────────────────────────────────┘
```

### **URLs Diretas:**

- **Propostas:** `http://localhost:3000/copywriter/proposal`
- **Contratos:** `http://localhost:3000/copywriter/contract`

---

## 🔍 Solução de Problemas

### **Erro: Cannot find module 'react-markdown'**
```bash
npm install react-markdown remark-gfm
```

### **Erro: OpenAI API Key inválida**
```bash
# Verifique .env.local
cat .env.local | grep OPENAI_API_KEY
```

### **Erro: Insufficient quota (OpenAI)**
- Adicione créditos em: https://platform.openai.com/account/billing

---

## 📚 Documentação Completa

- 📖 **README:** `COPYWRITER-README.md` (471 linhas)
- 📊 **Resumo:** `COPYWRITER-RESUMO-EXECUTIVO.md` (445 linhas)
- ⚡ **Quick Start:** `QUICK-START-COPYWRITER.md` (este arquivo)

---

## ✅ Checklist de Teste

### **Propostas:**
- [ ] Acessar `/copywriter/proposal`
- [ ] Preencher formulário completo
- [ ] Gerar proposta
- [ ] Editar conteúdo
- [ ] Copiar para clipboard
- [ ] Download .md
- [ ] Criar nova proposta

### **Contratos:**
- [ ] Acessar `/copywriter/contract`
- [ ] Selecionar Pessoa Física
- [ ] Preencher dados completos
- [ ] Gerar contrato
- [ ] Verificar disclaimer
- [ ] Editar conteúdo
- [ ] Download .md
- [ ] Testar Pessoa Jurídica

### **Validações:**
- [ ] Campo vazio → Border vermelho
- [ ] Escopo < 50 chars → Erro
- [ ] Email inválido → Erro
- [ ] Botão desabilitado se inválido

---

## 🎯 Exemplo Completo - Proposta

**Input:**
```
Cliente: João Silva (Startup Tech)
Seu Nome: Maria Santos (Dev Studio)
Escopo: Site institucional moderno com 5 páginas, 
        formulário de contato, blog integrado e painel admin
Prazo: 45 dias
Valor: R$ 8.500
Pagamento: 40% início, 30% aprovação layout, 30% entrega
Diferenciais: +100 projetos entregues, 8 anos no mercado, 
              especialista em Next.js
```

**Output (exemplo):**
```markdown
# Proposta Comercial

**Para:** João Silva (Startup Tech)
**De:** Maria Santos (Dev Studio)
**Data:** 13 de outubro de 2025
**Validade:** 15 dias

---

## 📋 Apresentação

Olá João,

É um prazer apresentar esta proposta para o desenvolvimento
do site institucional da Startup Tech...

[... documento completo gerado pela IA ...]
```

---

## 💡 Dicas de Uso

### **Para Propostas:**
1. Seja específico no escopo (min 50 caracteres)
2. Inclua diferenciais se tiver (aumenta persuasão)
3. Defina valor e condições claras
4. Revise e edite conforme necessário

### **Para Contratos:**
1. Preencha TODOS os dados corretamente
2. Use CPF/CNPJ reais (sem validação de dígito)
3. Endereços completos facilitam
4. **SEMPRE revise por advogado antes de usar**

---

## 🎉 Pronto!

Você está pronto para usar o IA Copywriter!

**Teste agora:**

```bash
npm run dev
open http://localhost:3000/copywriter/proposal
```

**Dúvidas?**
- Leia: `COPYWRITER-README.md`
- Ou: `COPYWRITER-RESUMO-EXECUTIVO.md`

---

**Happy Copywriting!** 🚀✨
