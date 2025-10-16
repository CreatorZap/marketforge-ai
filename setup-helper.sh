#!/bin/bash

# ============================================
# MARKETFORGE - SETUP HELPER
# Script auxiliar para configuração inicial
# ============================================

echo "🚀 MarketForge - Assistente de Configuração"
echo "=========================================="
echo ""

# Verificar se está na pasta correta
if [ ! -f "package.json" ]; then
    echo "❌ Erro: Execute este script na raiz do projeto MarketForge"
    exit 1
fi

# Função para verificar se .env.local existe
check_env_file() {
    if [ -f ".env.local" ]; then
        echo "✅ Arquivo .env.local encontrado"
        return 0
    else
        echo "❌ Arquivo .env.local NÃO encontrado"
        return 1
    fi
}

# Função para criar .env.local
create_env_file() {
    echo ""
    echo "📝 Criando arquivo .env.local..."
    
    cat > .env.local << 'EOF'
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# OpenAI
OPENAI_API_KEY=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
EOF

    echo "✅ Arquivo .env.local criado!"
    echo ""
    echo "⚠️  PRÓXIMO PASSO:"
    echo "   Abra o arquivo .env.local e preencha as chaves"
    echo "   Use o arquivo ENV_TEMPLATE.txt como referência"
}

# Função para verificar variáveis
check_env_vars() {
    echo ""
    echo "🔍 Verificando variáveis de ambiente..."
    
    # Source o .env.local
    if [ -f ".env.local" ]; then
        export $(cat .env.local | grep -v '^#' | xargs)
    fi
    
    local all_ok=true
    
    # Verificar SUPABASE_URL
    if [ -z "$NEXT_PUBLIC_SUPABASE_URL" ] || [ "$NEXT_PUBLIC_SUPABASE_URL" = "https://xxxxxxxxxxxxx.supabase.co" ]; then
        echo "❌ NEXT_PUBLIC_SUPABASE_URL não configurada"
        all_ok=false
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_URL configurada"
    fi
    
    # Verificar SUPABASE_ANON_KEY
    if [ -z "$NEXT_PUBLIC_SUPABASE_ANON_KEY" ] || [[ "$NEXT_PUBLIC_SUPABASE_ANON_KEY" == eyJhbG* ]]; then
        echo "❌ NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada"
        all_ok=false
    else
        echo "✅ NEXT_PUBLIC_SUPABASE_ANON_KEY configurada"
    fi
    
    # Verificar SERVICE_ROLE_KEY
    if [ -z "$SUPABASE_SERVICE_ROLE_KEY" ] || [[ "$SUPABASE_SERVICE_ROLE_KEY" == eyJhbG* ]]; then
        echo "❌ SUPABASE_SERVICE_ROLE_KEY não configurada"
        all_ok=false
    else
        echo "✅ SUPABASE_SERVICE_ROLE_KEY configurada"
    fi
    
    # Verificar OPENAI_API_KEY
    if [ -z "$OPENAI_API_KEY" ] || [[ "$OPENAI_API_KEY" == sk-proj-xxx* ]]; then
        echo "❌ OPENAI_API_KEY não configurada"
        all_ok=false
    else
        echo "✅ OPENAI_API_KEY configurada"
    fi
    
    echo ""
    
    if [ "$all_ok" = true ]; then
        echo "🎉 Todas as variáveis estão configuradas!"
        return 0
    else
        echo "⚠️  Algumas variáveis ainda precisam ser configuradas"
        echo "   Abra o arquivo .env.local e preencha as chaves"
        return 1
    fi
}

# Função para abrir links úteis
open_links() {
    echo ""
    echo "🔗 Abrindo links úteis..."
    
    # Abrir Supabase
    echo "   → Supabase Dashboard"
    open "https://supabase.com/dashboard" 2>/dev/null || xdg-open "https://supabase.com/dashboard" 2>/dev/null
    
    sleep 2
    
    # Abrir OpenAI
    echo "   → OpenAI API Keys"
    open "https://platform.openai.com/api-keys" 2>/dev/null || xdg-open "https://platform.openai.com/api-keys" 2>/dev/null
    
    echo ""
    echo "✅ Links abertos no navegador!"
}

# Função para mostrar próximos passos
show_next_steps() {
    echo ""
    echo "📋 PRÓXIMOS PASSOS:"
    echo "=========================================="
    echo ""
    echo "1. Configure o Supabase:"
    echo "   - Crie um projeto em https://supabase.com/dashboard"
    echo "   - Aplique o schema SQL (arquivo: supabase/migrations/001_initial_schema.sql)"
    echo "   - Copie as chaves (Settings → API)"
    echo ""
    echo "2. Configure a OpenAI:"
    echo "   - Crie uma API key em https://platform.openai.com/api-keys"
    echo "   - Adicione créditos (mínimo $5)"
    echo ""
    echo "3. Preencha o .env.local com suas chaves"
    echo ""
    echo "4. Execute novamente: ./setup-helper.sh"
    echo ""
    echo "📖 Guia completo: SETUP.md"
    echo ""
}

# ============================================
# MENU PRINCIPAL
# ============================================

echo "Escolha uma opção:"
echo ""
echo "1. Criar arquivo .env.local"
echo "2. Verificar variáveis de ambiente"
echo "3. Abrir links úteis (Supabase + OpenAI)"
echo "4. Ver próximos passos"
echo "5. Fazer tudo automaticamente"
echo "0. Sair"
echo ""
read -p "Digite o número da opção: " option

case $option in
    1)
        if check_env_file; then
            read -p "⚠️  Arquivo já existe. Sobrescrever? (s/n): " confirm
            if [ "$confirm" = "s" ]; then
                create_env_file
            fi
        else
            create_env_file
        fi
        ;;
    2)
        check_env_vars
        ;;
    3)
        open_links
        ;;
    4)
        show_next_steps
        ;;
    5)
        echo ""
        echo "🔄 Executando configuração completa..."
        
        if ! check_env_file; then
            create_env_file
        fi
        
        open_links
        
        echo ""
        echo "⏳ Aguarde configurar suas chaves e pressione ENTER..."
        read
        
        check_env_vars
        
        if [ $? -eq 0 ]; then
            echo ""
            echo "🎉 Configuração completa!"
            echo "   Execute: npm run dev"
        else
            show_next_steps
        fi
        ;;
    0)
        echo "👋 Até logo!"
        exit 0
        ;;
    *)
        echo "❌ Opção inválida"
        exit 1
        ;;
esac

echo ""
echo "✅ Concluído!"
