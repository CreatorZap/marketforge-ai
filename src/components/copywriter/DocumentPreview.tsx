'use client';

import { useState } from 'react';
import { Download, Copy, Edit3, Check, FileText } from 'lucide-react';
import jsPDF from 'jspdf';

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
      await navigator.clipboard.writeText(editedContent);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error('Erro ao copiar:', error);
    }
  };

  const handleDownloadMarkdown = () => {
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
  };

  const handleDownloadPDF = () => {
    try {
      const doc = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      // Configurações
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      const margin = 20;
      const maxWidth = pageWidth - (margin * 2);
      let yPosition = margin;

      // Função para adicionar nova página se necessário
      const checkPageBreak = (lineHeight: number) => {
        if (yPosition + lineHeight > pageHeight - margin) {
          doc.addPage();
          yPosition = margin;
        }
      };

      // Processar cada linha
      const lines = editedContent.split('\n');
      
      lines.forEach((line) => {
        // Remover markdown
        let cleanLine = line.replace(/\*\*/g, '');
        
        // Headers H1 (#)
        if (line.startsWith('# ')) {
          checkPageBreak(15);
          doc.setFontSize(18);
          doc.setFont('helvetica', 'bold');
          const text = cleanLine.replace('# ', '');
          const textLines = doc.splitTextToSize(text, maxWidth);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, pageWidth / 2, yPosition, { align: 'center' });
            yPosition += 8;
          });
          yPosition += 5;
        }
        // Headers H2 (##)
        else if (line.startsWith('## ')) {
          checkPageBreak(12);
          doc.setFontSize(14);
          doc.setFont('helvetica', 'bold');
          const text = cleanLine.replace('## ', '');
          const textLines = doc.splitTextToSize(text, maxWidth);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, margin, yPosition);
            yPosition += 7;
          });
          yPosition += 3;
        }
        // Headers H3 (###)
        else if (line.startsWith('### ')) {
          checkPageBreak(10);
          doc.setFontSize(12);
          doc.setFont('helvetica', 'bold');
          const text = cleanLine.replace('### ', '');
          const textLines = doc.splitTextToSize(text, maxWidth);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, margin, yPosition);
            yPosition += 6;
          });
          yPosition += 2;
        }
        // Linha horizontal (---)
        else if (line.trim() === '---') {
          checkPageBreak(5);
          doc.setDrawColor(200, 200, 200);
          doc.line(margin, yPosition, pageWidth - margin, yPosition);
          yPosition += 5;
        }
        // Lista com bullet (-)
        else if (line.trim().startsWith('- ')) {
          checkPageBreak(6);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const text = cleanLine.replace(/^- /, '• ');
          const textLines = doc.splitTextToSize(text, maxWidth - 5);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, margin + 5, yPosition);
            yPosition += 5;
          });
        }
        // Lista numerada
        else if (line.trim().match(/^\d+\./)) {
          checkPageBreak(6);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const textLines = doc.splitTextToSize(cleanLine, maxWidth - 5);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, margin + 5, yPosition);
            yPosition += 5;
          });
        }
        // Linha vazia
        else if (line.trim() === '') {
          yPosition += 3;
        }
        // Texto com negrito (**...**)
        else if (line.includes('**')) {
          checkPageBreak(6);
          doc.setFontSize(10);
          
          // Detectar se é header de dados (centralizar)
          if (line.startsWith('**') && line.endsWith('**')) {
            doc.setFont('helvetica', 'bold');
            const text = cleanLine.replace(/\*\*/g, '');
            const textLines = doc.splitTextToSize(text, maxWidth);
            textLines.forEach((textLine: string) => {
              doc.text(textLine, pageWidth / 2, yPosition, { align: 'center' });
              yPosition += 5;
            });
          } else {
            // Mistura de bold e normal - simplificar para normal com negrito inline
            doc.setFont('helvetica', 'normal');
            const textLines = doc.splitTextToSize(cleanLine, maxWidth);
            textLines.forEach((textLine: string) => {
              doc.text(textLine, margin, yPosition);
              yPosition += 5;
            });
          }
        }
        // Texto normal
        else if (line.trim() !== '') {
          checkPageBreak(6);
          doc.setFontSize(10);
          doc.setFont('helvetica', 'normal');
          const textLines = doc.splitTextToSize(cleanLine, maxWidth);
          textLines.forEach((textLine: string) => {
            doc.text(textLine, margin, yPosition);
            yPosition += 5;
          });
        }
      });

      // Adicionar rodapé em todas as páginas
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont('helvetica', 'italic');
        doc.setTextColor(150, 150, 150);
        doc.text(
          `Página ${i} de ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: 'center' }
        );
      }

      // Salvar PDF
      const filename = `${type === 'proposal' ? 'proposta' : 'contrato'}-${Date.now()}.pdf`;
      doc.save(filename);
      onDownload(editedContent);
    } catch (error) {
      console.error('Erro ao gerar PDF:', error);
      alert('Erro ao gerar PDF. Tente o download em Markdown.');
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
