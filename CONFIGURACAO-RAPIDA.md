# ⚡ Configuração Rápida - 3 Opções

## 🎯 Escolha Seu Caminho

### Opção 1: Script Automático (Mais Fácil) ⭐

```bash
./setup-helper.sh
```

Escolha **opção 5** (Fazer tudo automaticamente)

O script vai:
1. ✅ Criar `.env.local`
2. ✅ Abrir Supabase e OpenAI no navegador
3. ✅ Validar suas chaves

---

### Opção 2: Manual Guiado (Recomendado para Iniciantes) 📖

1. **Abra o arquivo:** `SETUP.md`
2. **Siga o passo a passo** (está tudo explicado)
3. **Tempo estimado:** 10-15 minutos

---

### Opção 3: Rápido (Se Você Já Sabe) 🚀

1. **Crie `.env.local`:**
   ```bash
   cp ENV_TEMPLATE.txt .env.local
   ```

2. **Supabase:**
   - Crie projeto: https://supabase.com/dashboard
   - Aplique SQL: `supabase/migrations/001_initial_schema.sql`
   - Copie chaves: Settings → API

3. **OpenAI:**
   - Crie key: https://platform.openai.com/api-keys
   - Adicione $5 de crédito

4. **Preencha `.env.local`** com as chaves

5. **Teste:**
   ```bash
   npm run dev
   ```

---

## 📋 Checklist Ultra-Rápido

```
[ ] Projeto Supabase criado
[ ] Schema SQL aplicado (6 tabelas)
[ ] Chaves Supabase copiadas
[ ] OpenAI API key criada
[ ] Créditos OpenAI adicionados ($5+)
[ ] .env.local criado
[ ] Todas variáveis preenchidas
[ ] npm run dev funciona
```

---

## 🆘 Problemas?

**Erro de API Key:**
```bash
./setup-helper.sh
# Escolha opção 2 para verificar
```

**Precisa de Ajuda:**
- Leia: `SETUP.md` (guia completo)
- Veja: `ENV_TEMPLATE.txt` (exemplo de .env)

---

## ✅ Tudo Pronto?

Se todos os itens do checklist estão ✅, você pode:

```bash
npm run dev
```

E seguir para implementação da UI! 🎨
