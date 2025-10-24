'use client';

import { useState } from 'react';
import { Download, Copy, Edit3, Check, FileText } from 'lucide-react';
import { toast } from 'sonner';

interface DocumentPreviewProps {
  content: string;
  type: 'proposal' | 'contract';
  onDownload: (content: string) => void;
}

export default function DocumentPreview({ content, type, onDownload }: DocumentPreviewProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedContent, setEditedContent] = useState(content);
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      // Método 1: Clipboard API (moderno)
      if (navigator.clipboard && navigator.clipboard.writeText) {
        await navigator.clipboard.writeText(editedContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
        toast.success('✅ Conteúdo copiado com sucesso!');
      } else {
        // Método 2: Fallback para navegadores antigos
        const textArea = document.createElement('textarea');
        textArea.value = editedContent;
        textArea.style.position = 'fixed';
        textArea.style.left = '-999999px';
        textArea.style.top = '-999999px';
        textArea.style.opacity = '0';
        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();
        
        try {
          const successful = document.execCommand('copy');
          if (successful) {
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
            toast.success('✅ Conteúdo copiado com sucesso!');
          } else {
            throw new Error('Falha ao executar comando de cópia');
          }
        } catch (err) {
          console.error('Erro no fallback de cópia:', err);
          toast.error('❌ Erro ao copiar. Tente selecionar e copiar manualmente (Ctrl+C)');
        } finally {
          document.body.removeChild(textArea);
        }
      }
    } catch (error) {
      console.error('Erro ao copiar:', error);
      toast.error('❌ Erro ao copiar. Use Ctrl+C ou Cmd+C para copiar manualmente.');
    }
  };

  const handleDownloadMarkdown = () => {
    try {
      const blob = new Blob([editedContent], { type: 'text/markdown' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${type === 'proposal' ? 'proposta' : 'contrato'}-${Date.now()}.md`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      onDownload(editedContent);
      toast.success('✅ Arquivo Markdown baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao baixar Markdown:', error);
      toast.error('❌ Erro ao baixar arquivo Markdown.');
    }
  };

  const handleDownloadPDF = async () => {
    try {
      // Importação dinâmica do jsPDF para evitar problemas com SSR
      const { default: jsPDF } = await import('jspdf');
      
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4'
      });
      
      // Configurações de layout
      const marginLeft = 20;
      const marginTop = 25;
      const pageWidth = 210; // A4 width in mm
      const pageHeight = 297; // A4 height in mm
      const marginRight = 20;
      const marginBottom = 25;
      const maxWidth = pageWidth - marginLeft - marginRight;
      
      let y = marginTop;
      
      // Função para adicionar nova página se necessário
      const checkNewPage = (spaceNeeded: number) => {
        if (y + spaceNeeded > pageHeight - marginBottom) {
          doc.addPage();
          y = marginTop;
        }
      };
      
      // Processar markdown linha por linha
      const lines = editedContent.split('\n');
      
      for (const line of lines) {
        // Verificar tipo de linha
        
        // Título H1 (# )
        if (line.startsWith('# ')) {
          checkNewPage(15);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(2).trim();
          const wrapped = doc.splitTextToSize(text, maxWidth);
          wrapped.forEach((l: string) => {
            doc.text(l, marginLeft, y);
            y += 8;
          });
          y += 5; // Espaço extra após H1
        }
        // Título H2 (## )
        else if (line.startsWith('## ')) {
          checkNewPage(12);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(3).trim();
          const wrapped = doc.splitTextToSize(text, maxWidth);
          wrapped.forEach((l: string) => {
            doc.text(l, marginLeft, y);
            y += 7;
          });
          y += 4; // Espaço extra após H2
        }
        // Título H3 (### )
        else if (line.startsWith('### ')) {
          checkNewPage(10);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const text = line.substring(4).trim();
          const wrapped = doc.splitTextToSize(text, maxWidth);
          wrapped.forEach((l: string) => {
            doc.text(l, marginLeft, y);
            y += 6;
          });
          y += 3; // Espaço extra após H3
        }
        // Separador (--- ou ***)
        else if (line.trim() === '---' || line.trim() === '***') {
          checkNewPage(5);
          doc.setLineWidth(0.5);
          doc.setDrawColor(200, 200, 200);
          doc.line(marginLeft, y, pageWidth - marginRight, y);
          y += 8;
        }
        // Linha vazia
        else if (line.trim() === '') {
          y += 3;
        }
        // Lista (a), b), c), etc)
        else if (/^[a-e]\)/.test(line.trim())) {
          checkNewPage(7);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const text = line.trim();
          const wrapped = doc.splitTextToSize(text, maxWidth - 5);
          wrapped.forEach((l: string, index: number) => {
            doc.text(l, index === 0 ? marginLeft + 3 : marginLeft + 8, y);
            y += 5;
          });
        }
        // Lista numerada (1., 2., etc)
        else if (/^\d+\./.test(line.trim())) {
          checkNewPage(7);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const text = line.trim();
          const wrapped = doc.splitTextToSize(text, maxWidth - 5);
          wrapped.forEach((l: string, index: number) => {
            doc.text(l, index === 0 ? marginLeft + 3 : marginLeft + 8, y);
            y += 5;
          });
        }
        // Texto com negrito (**texto**)
        else if (line.includes('**')) {
          checkNewPage(7);
          doc.setFontSize(10);
          
          // Processar negrito inline
          const parts = line.split('**');
          let currentX = marginLeft;
          const lineY = y;
          
          parts.forEach((part, index) => {
            if (index % 2 === 0) {
              // Texto normal
              doc.setFont('helvetica', 'normal');
            } else {
              // Texto em negrito
              doc.setFont('helvetica', 'bold');
            }
            
            if (part.trim()) {
              const wrapped = doc.splitTextToSize(part, maxWidth - (currentX - marginLeft));
              wrapped.forEach((l: string, wIndex: number) => {
                if (wIndex > 0) {
                  y += 5;
                  currentX = marginLeft;
                }
                doc.text(l, currentX, y);
                currentX += doc.getTextWidth(l);
              });
            }
          });
          
          y += 6;
        }
        // Texto normal (parágrafo)
        else if (line.trim()) {
          checkNewPage(7);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const text = line.trim();
          const wrapped = doc.splitTextToSize(text, maxWidth);
          wrapped.forEach((l: string) => {
            doc.text(l, marginLeft, y);
            y += 5;
          });
          y += 2; // Pequeno espaço entre parágrafos
        }
      }
      
      // Adicionar rodapé em todas as páginas
      const totalPages = doc.internal.pages.length - 1; // -1 porque a primeira página é vazia
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${totalPages} - Gerado por MarketForge em ${new Date().toLocaleDateString('pt-BR')}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }
      
      // Salvar PDF
      const fileName = `${type === 'proposal' ? 'proposta' : 'contrato'}-${Date.now()}.pdf`;
      doc.save(fileName);
      
      toast.success('✅ PDF baixado com sucesso!');
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      toast.error('❌ Erro ao gerar PDF. Tente baixar como Markdown (.MD)');
    }
  };

  const handleSaveEdit = () => {
    setIsEditing(false);
  };

  const wordCount = editedContent.trim().split(/\s+/).length;
  const charCount = editedContent.length;
  const lineCount = editedContent.split('\n').length;

  // Função para renderizar markdown com formatação melhorada
  const renderMarkdown = (text: string) => {
    return text.split('\n').map((line, index) => {
      // Headers
      if (line.startsWith('# ')) {
        return (
          <h1 key={index} className="text-3xl font-bold text-gray-900 mt-8 mb-4 text-center">
            {line.replace('# ', '')}
          </h1>
        );
      }
      if (line.startsWith('## ')) {
        return (
          <h2 key={index} className="text-2xl font-bold text-gray-800 mt-6 mb-3">
            {line.replace('## ', '')}
          </h2>
        );
      }
      if (line.startsWith('### ')) {
        return (
          <h3 key={index} className="text-xl font-semibold text-gray-800 mt-4 mb-2">
            {line.replace('### ', '')}
          </h3>
        );
      }
      
      // Bold text com **
      if (line.includes('**')) {
        const parts = line.split('**');
        return (
          <p key={index} className="text-gray-700 mb-2 leading-relaxed">
            {parts.map((part, i) => 
              i % 2 === 1 ? <strong key={i} className="font-semibold">{part}</strong> : part
            )}
          </p>
        );
      }
      
      // Lists
      if (line.trim().startsWith('- ')) {
        return (
          <li key={index} className="text-gray-700 ml-6 mb-1 list-disc">
            {line.trim().replace(/^- /, '')}
          </li>
        );
      }
      
      if (line.trim().match(/^\d+\./)) {
        return (
          <li key={index} className="text-gray-700 ml-6 mb-1 list-decimal">
            {line.trim().replace(/^\d+\.\s*/, '')}
          </li>
        );
      }
      
      // Horizontal rule
      if (line.trim() === '---') {
        return <hr key={index} className="my-6 border-gray-300" />;
      }
      
      // Empty lines
      if (line.trim() === '') {
        return <br key={index} />;
      }
      
      // Centralizar linhas que começam com ** (geralmente headers de dados)
      if (line.startsWith('**') && line.endsWith('**')) {
        return (
          <p key={index} className="text-gray-700 mb-2 font-semibold text-center">
            {line.replace(/\*\*/g, '')}
          </p>
        );
      }
      
      // Normal paragraphs
      return (
        <p key={index} className="text-gray-700 mb-2 leading-relaxed">
          {line}
        </p>
      );
    });
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 p-4">
        <div className="flex items-center justify-between flex-wrap gap-2">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            {type === 'proposal' ? '📄 Proposta Comercial' : '📜 Contrato de Serviços'}
          </h2>
          
          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm"
            >
              {isEditing ? (
                <>
                  <Check className="w-4 h-4" />
                  Salvar
                </>
              ) : (
                <>
                  <Edit3 className="w-4 h-4" />
                  Editar
                </>
              )}
            </button>

            <button
              onClick={handleCopy}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4" />
                  Copiado!
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  Copiar
                </>
              )}
            </button>

            <button
              onClick={handleDownloadPDF}
              className="flex items-center gap-2 px-3 py-2 bg-white text-purple-600 hover:bg-gray-100 rounded-lg transition-all font-semibold text-sm"
            >
              <Download className="w-4 h-4" />
              PDF
            </button>

            <button
              onClick={handleDownloadMarkdown}
              className="flex items-center gap-2 px-3 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all text-sm"
            >
              <FileText className="w-4 h-4" />
              MD
            </button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-8">
        {isEditing ? (
          <div>
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="w-full h-[600px] p-4 border border-gray-300 rounded-lg font-mono text-sm text-gray-900 bg-white focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              style={{ resize: 'vertical' }}
            />
            <div className="mt-4 flex justify-end">
              <button
                onClick={handleSaveEdit}
                className="px-6 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
              >
                Salvar Alterações
              </button>
            </div>
          </div>
        ) : (
          <div className="prose prose-lg max-w-none">
            <div className="font-serif leading-relaxed">
              {renderMarkdown(editedContent)}
            </div>
          </div>
        )}
      </div>

      {/* Footer Stats */}
      <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <div className="flex items-center gap-6">
            <span><strong>{wordCount}</strong> palavras</span>
            <span><strong>{charCount}</strong> caracteres</span>
            <span><strong>{lineCount}</strong> linhas</span>
          </div>
          
          {isEditing && (
            <div className="flex items-center gap-2 text-amber-600">
              <Edit3 className="w-4 h-4" />
              <span className="font-medium">Modo de edição ativo</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
