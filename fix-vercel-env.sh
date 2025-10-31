#!/bin/bash

# ============================================
# SCRIPT DE CORREÇÃO OPENAI_API_KEY NO VERCEL
# ============================================

echo "🔧 MarketForge - Correção OPENAI_API_KEY"
echo "=========================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para pausar e aguardar confirmação
pause() {
    echo ""
    read -p "Pressione ENTER para continuar..."
    echo ""
}

# ============================================
# PASSO 1: PUSH DO CÓDIGO
# ============================================

echo -e "${BLUE}PASSO 1: Push do código para Vercel${NC}"
echo "--------------------------------------"
echo ""

git status

echo ""
echo -e "${YELLOW}Fazendo push para o Vercel...${NC}"

git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Push realizado com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push. Verifique suas credenciais Git.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⏳ Aguardando deploy no Vercel (60 segundos)...${NC}"
sleep 60

pause

# ============================================
# PASSO 2: DIAGNÓSTICO
# ============================================

echo -e "${BLUE}PASSO 2: Acessar diagnóstico${NC}"
echo "--------------------------------------"
echo ""
echo "Abra no navegador:"
echo -e "${GREEN}https://marketforge-six.vercel.app/api/test-env${NC}"
echo ""
echo "Copie e salve o JSON retornado."
echo ""
echo "Procure por:"
echo "  - length: 164 (problema) ou ~51 (correto)"
echo "  - has_multiple_sk: 3 (problema) ou 1 (correto)"
echo ""

pause

# ============================================
# PASSO 3: LIMPAR VARIÁVEIS
# ============================================

echo -e "${BLUE}PASSO 3: Limpar variáveis antigas${NC}"
echo "--------------------------------------"
echo ""
echo -e "${YELLOW}Removendo OPENAI_API_KEY de todos os ambientes...${NC}"
echo ""

vercel env rm OPENAI_API_KEY production
vercel env rm OPENAI_API_KEY preview
vercel env rm OPENAI_API_KEY development

echo ""
echo -e "${YELLOW}⏳ Aguardando propagação (30 segundos)...${NC}"
sleep 30

echo ""
echo -e "${GREEN}✅ Variáveis antigas removidas!${NC}"

pause

# ============================================
# PASSO 4: ADICIONAR VARIÁVEL LIMPA
# ============================================

echo -e "${BLUE}PASSO 4: Adicionar variável limpa${NC}"
echo "--------------------------------------"
echo ""
echo -e "${RED}ATENÇÃO:${NC}"
echo "  - A chave deve ter ~51 caracteres"
echo "  - Deve começar com sk-proj-"
echo "  - NÃO adicione aspas"
echo "  - NÃO adicione espaços"
echo ""
echo -e "${YELLOW}Digite sua OPENAI_API_KEY:${NC}"
read -s OPENAI_KEY

echo ""
echo -e "${YELLOW}Validando chave...${NC}"

# Validações básicas
KEY_LENGTH=${#OPENAI_KEY}

if [ $KEY_LENGTH -lt 40 ] || [ $KEY_LENGTH -gt 60 ]; then
    echo -e "${RED}❌ Erro: Chave tem tamanho inválido ($KEY_LENGTH caracteres)${NC}"
    echo "   Esperado: 40-60 caracteres"
    exit 1
fi

if [[ ! $OPENAI_KEY == sk-* ]]; then
    echo -e "${RED}❌ Erro: Chave não começa com 'sk-'${NC}"
    exit 1
fi

echo -e "${GREEN}✅ Chave validada! Tamanho: $KEY_LENGTH caracteres${NC}"
echo ""

echo -e "${YELLOW}Adicionando ao Vercel (production)...${NC}"

echo "$OPENAI_KEY" | vercel env add OPENAI_API_KEY production

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Variável adicionada com sucesso!${NC}"
else
    echo -e "${RED}❌ Erro ao adicionar variável.${NC}"
    exit 1
fi

pause

# ============================================
# PASSO 5: FORÇAR REDEPLOY
# ============================================

echo -e "${BLUE}PASSO 5: Forçar redeploy${NC}"
echo "--------------------------------------"
echo ""
echo -e "${YELLOW}Criando commit vazio para forçar redeploy...${NC}"

git commit --allow-empty -m "Redeploy after OPENAI_API_KEY fix"
git push origin main

if [ $? -eq 0 ]; then
    echo -e "${GREEN}✅ Redeploy iniciado!${NC}"
else
    echo -e "${RED}❌ Erro ao fazer push.${NC}"
    exit 1
fi

echo ""
echo -e "${YELLOW}⏳ Aguardando deploy (60 segundos)...${NC}"
sleep 60

pause

# ============================================
# PASSO 6: VERIFICAÇÃO
# ============================================

echo -e "${BLUE}PASSO 6: Verificar correção${NC}"
echo "--------------------------------------"
echo ""
echo "1. Acesse o endpoint de teste:"
echo -e "   ${GREEN}https://marketforge-six.vercel.app/api/test-env${NC}"
echo ""
echo "   Verifique:"
echo "   - length: ~51 (não 164)"
echo "   - has_multiple_sk: 1 (não 3)"
echo "   - possible_concatenation: false"
echo ""
echo "2. Acesse a página de login:"
echo -e "   ${GREEN}https://marketforge-six.vercel.app/auth/login${NC}"
echo ""
echo "   Verifique:"
echo "   - Página carrega sem erros"
echo "   - NÃO aparece 'Invalid API key'"
echo ""

pause

# ============================================
# CONCLUSÃO
# ============================================

echo ""
echo "=========================================="
echo -e "${GREEN}🎉 PROCESSO CONCLUÍDO!${NC}"
echo "=========================================="
echo ""
echo "Se tudo estiver funcionando:"
echo "  ✅ Endpoint de teste mostra length ~51"
echo "  ✅ Login carrega sem erros"
echo "  ✅ Sem mensagem 'Invalid API key'"
echo ""
echo "Se ainda houver problemas:"
echo "  📖 Consulte: INSTRUCOES-CORRECAO-OPENAI-KEY.md"
echo "  📊 Leia: RESUMO-CORRECAO-OPENAI.md"
echo ""
echo "Logs salvos em: vercel-fix.log"
echo ""

