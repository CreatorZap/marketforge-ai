#!/bin/bash

# ============================================
# SCRIPT DE BACKUP - MarketForge
# ============================================

# Cores para output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo -e "${BLUE}   📦 MarketForge - Backup Automático   ${NC}"
echo -e "${BLUE}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
echo ""

# Definir diretórios
SOURCE_DIR="$(pwd)"
BACKUP_BASE_DIR="../backups"
TIMESTAMP=$(date +%Y%m%d-%H%M%S)
BACKUP_NAME="marketforge-backup-${TIMESTAMP}"
BACKUP_DIR="${BACKUP_BASE_DIR}/${BACKUP_NAME}"

# Criar pasta de backups se não existir
if [ ! -d "$BACKUP_BASE_DIR" ]; then
    echo -e "${YELLOW}📁 Criando pasta de backups...${NC}"
    mkdir -p "$BACKUP_BASE_DIR"
fi

# Iniciar backup
echo -e "${BLUE}🚀 Iniciando backup...${NC}"
echo -e "   Origem: ${SOURCE_DIR}"
echo -e "   Destino: ${BACKUP_DIR}"
echo ""

# Copiar arquivos (excluir node_modules e .next)
echo -e "${BLUE}📋 Copiando arquivos...${NC}"
rsync -av --progress \
    --exclude 'node_modules' \
    --exclude '.next' \
    --exclude '.git' \
    --exclude 'backups' \
    --exclude '.DS_Store' \
    "$SOURCE_DIR/" "$BACKUP_DIR/" > /dev/null 2>&1

# Verificar se backup foi criado
if [ -d "$BACKUP_DIR" ]; then
    # Calcular tamanho do backup
    BACKUP_SIZE=$(du -sh "$BACKUP_DIR" | cut -f1)
    
    echo ""
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo -e "${GREEN}   ✅ Backup concluído com sucesso!     ${NC}"
    echo -e "${GREEN}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${NC}"
    echo ""
    echo -e "   📦 Nome: ${BACKUP_NAME}"
    echo -e "   📏 Tamanho: ${BACKUP_SIZE}"
    echo -e "   📍 Local: ${BACKUP_DIR}"
    echo ""
    
    # Listar backups existentes
    echo -e "${BLUE}📚 Backups existentes:${NC}"
    ls -lh "$BACKUP_BASE_DIR" | grep "^d" | awk '{print "   " $9 " (" $5 ")"}'
    echo ""
    
    # Contar total de backups
    TOTAL_BACKUPS=$(ls -1 "$BACKUP_BASE_DIR" | wc -l | tr -d ' ')
    echo -e "${BLUE}📊 Total de backups: ${TOTAL_BACKUPS}${NC}"
    echo ""
    
else
    echo ""
    echo -e "${RED}❌ Erro ao criar backup!${NC}"
    exit 1
fi

echo -e "${GREEN}🎉 Processo finalizado!${NC}"
echo ""
