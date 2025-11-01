#!/bin/bash

# 🔧 Script para verificar variáveis de ambiente localmente
# Uso: bash check-env.sh

echo "🔍 VERIFICANDO VARIÁVEIS DE AMBIENTE"
echo "===================================="
echo ""

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Contador de problemas
ISSUES=0

# Verificar se .env.local existe
if [ ! -f .env.local ]; then
    echo -e "${RED}❌ Arquivo .env.local NÃO ENCONTRADO${NC}"
    echo "   Crie o arquivo .env.local na raiz do projeto"
    echo ""
    exit 1
else
    echo -e "${GREEN}✅ Arquivo .env.local encontrado${NC}"
    echo ""
fi

# Carregar variáveis
source .env.local 2>/dev/null

echo "📋 VERIFICANDO VARIÁVEIS:"
echo "------------------------"
echo ""

# 1. NEXT_PUBLIC_SUPABASE_URL
echo "1️⃣  NEXT_PUBLIC_SUPABASE_URL"
if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ]; then
    echo -e "   ${RED}❌ NÃO CONFIGURADA${NC}"
    ISSUES=$((ISSUES+1))
else
    if [[ $NEXT_PUBLIC_SUPABASE_URL == https://*.supabase.co ]]; then
        echo -e "   ${GREEN}✅ OK${NC} - $NEXT_PUBLIC_SUPABASE_URL"
    else
        echo -e "   ${YELLOW}⚠️  FORMATO SUSPEITO${NC} - $NEXT_PUBLIC_SUPABASE_URL"
        echo "      Esperado: https://[project-id].supabase.co"
        ISSUES=$((ISSUES+1))
    fi
fi
echo ""

# 2. NEXT_PUBLIC_SUPABASE_ANON_KEY
echo "2️⃣  NEXT_PUBLIC_SUPABASE_ANON_KEY"
if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
    echo -e "   ${RED}❌ NÃO CONFIGURADA${NC}"
    ISSUES=$((ISSUES+1))
else
    LEN=${#NEXT_PUBLIC_SUPABASE_ANON_KEY}
    if [[ $NEXT_PUBLIC_SUPABASE_ANON_KEY == eyJ* ]] && [ $LEN -gt 100 ]; then
        echo -e "   ${GREEN}✅ OK${NC} - ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:30}... ($LEN chars)"
    else
        echo -e "   ${RED}❌ FORMATO INVÁLIDO${NC}"
        echo "      Deve começar com 'eyJ' e ter 200+ caracteres"
        echo "      Atual: ${NEXT_PUBLIC_SUPABASE_ANON_KEY:0:20}... ($LEN chars)"
        ISSUES=$((ISSUES+1))
    fi
fi
echo ""

# 3. SUPABASE_SERVICE_ROLE_KEY
echo "3️⃣  SUPABASE_SERVICE_ROLE_KEY"
if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
    echo -e "   ${YELLOW}⚠️  NÃO CONFIGURADA (opcional)${NC}"
else
    LEN=${#SUPABASE_SERVICE_ROLE_KEY}
    if [[ $SUPABASE_SERVICE_ROLE_KEY == eyJ* ]] && [ $LEN -gt 100 ]; then
        if [ "$SUPABASE_SERVICE_ROLE_KEY" = "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ]; then
            echo -e "   ${RED}❌ IGUAL À ANON KEY${NC}"
            echo "      As duas chaves devem ser DIFERENTES"
            ISSUES=$((ISSUES+1))
        else
            echo -e "   ${GREEN}✅ OK${NC} - ${SUPABASE_SERVICE_ROLE_KEY:0:30}... ($LEN chars)"
        fi
    else
        echo -e "   ${RED}❌ FORMATO INVÁLIDO${NC}"
        echo "      Deve começar com 'eyJ' e ter 200+ caracteres"
        echo "      Atual: ${SUPABASE_SERVICE_ROLE_KEY:0:20}... ($LEN chars)"
        ISSUES=$((ISSUES+1))
    fi
fi
echo ""

# 4. OPENAI_API_KEY
echo "4️⃣  OPENAI_API_KEY"
if [ -z "$OPENAI_API_KEY" ]; then
    echo -e "   ${RED}❌ NÃO CONFIGURADA${NC}"
    ISSUES=$((ISSUES+1))
else
    LEN=${#OPENAI_API_KEY}
    if [[ $OPENAI_API_KEY == sk-* ]] && [ $LEN -ge 40 ] && [ $LEN -le 60 ]; then
        echo -e "   ${GREEN}✅ OK${NC} - ${OPENAI_API_KEY:0:15}... ($LEN chars)"
    else
        echo -e "   ${RED}❌ FORMATO INVÁLIDO${NC}"
        echo "      Deve começar com 'sk-' e ter 40-60 caracteres"
        echo "      Atual: ${OPENAI_API_KEY:0:15}... ($LEN chars)"
        ISSUES=$((ISSUES+1))
    fi
fi
echo ""

# Resumo
echo "===================================="
if [ $ISSUES -eq 0 ]; then
    echo -e "${GREEN}✅ CONFIGURAÇÃO OK - Todas as variáveis corretas!${NC}"
    echo ""
    echo "Próximos passos:"
    echo "1. Rodar: npm run dev"
    echo "2. Acessar: http://localhost:3000"
    echo ""
    exit 0
else
    echo -e "${RED}❌ $ISSUES PROBLEMA(S) ENCONTRADO(S)${NC}"
    echo ""
    echo "📚 Para corrigir:"
    echo "1. Edite o arquivo .env.local"
    echo "2. Copie as chaves corretas do Supabase e OpenAI"
    echo "3. Rode este script novamente: bash check-env.sh"
    echo ""
    echo "📖 Ver guia completo: QUICK-FIX-INVALID-API-KEY.md"
    echo ""
    exit 1
fi

