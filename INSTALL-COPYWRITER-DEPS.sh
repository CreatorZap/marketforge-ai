#!/bin/bash

# ════════════════════════════════════════════════════════════════════
# Script de Instalação - Dependências do IA Copywriter
# MarketForge
# ════════════════════════════════════════════════════════════════════

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   📦 Instalando dependências do IA Copywriter..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Instalar react-markdown para renderização de markdown
echo "📄 Instalando react-markdown..."
npm install react-markdown

# Instalar remark-gfm para suporte a GitHub Flavored Markdown
echo "📝 Instalando remark-gfm..."
npm install remark-gfm

# Instalar @radix-ui/react-radio-group para o componente RadioGroup
echo "🔘 Instalando @radix-ui/react-radio-group..."
npm install @radix-ui/react-radio-group

echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo "   ✅ Instalação concluída com sucesso!"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "📋 Próximos passos:"
echo "   1. Execute: npm run dev"
echo "   2. Acesse: http://localhost:3000/copywriter/proposal"
echo "   3. Ou: http://localhost:3000/copywriter/contract"
echo ""
echo "🎉 O IA Copywriter está pronto para usar!"
echo ""
