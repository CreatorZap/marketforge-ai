'use client';

import { useState } from 'react';
import { ArrowLeft, FileText } from 'lucide-react';
import Link from 'next/link';
import ProposalForm from '@/components/copywriter/ProposalForm';
import DocumentPreview from '@/components/copywriter/DocumentPreview';

export default function ProposalPage() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [generatedProposal, setGeneratedProposal] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{tokens: number; duration: number; model: string} | null>(null);

  const handleSuccess = (proposal: string, meta: {tokens: number; duration: number; model: string}) => {
    setGeneratedProposal(proposal);
    setMetadata(meta);
    setStep('preview');
  };

  const handleNewProposal = () => {
    setStep('form');
    setGeneratedProposal(null);
    setMetadata(null);
  };

  const handleDownload = (content: string) => {
    console.log('Download realizado:', content.substring(0, 50) + '...');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar</span>
              </Link>
              
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Gerador de Propostas Comerciais
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Crie propostas profissionais em minutos com IA
                </p>
              </div>
            </div>

            {step === 'preview' && (
              <button
                onClick={handleNewProposal}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
              >
                Nova Proposta
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'form' ? (
          <div className="max-w-3xl mx-auto">
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Informações do Projeto
                </h2>
                <p className="text-gray-600">
                  Preencha os campos abaixo para gerar uma proposta comercial personalizada
                </p>
              </div>
              
              <ProposalForm onSuccess={handleSuccess} />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">⚡</div>
                <h3 className="font-semibold text-gray-900 mb-1">Rápido</h3>
                <p className="text-sm text-gray-600">Gera em menos de 30 segundos</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">��</div>
                <h3 className="font-semibold text-gray-900 mb-1">Profissional</h3>
                <p className="text-sm text-gray-600">Tom persuasivo e estruturado</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">✏️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Editável</h3>
                <p className="text-sm text-gray-600">Personalize antes de enviar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            {metadata && (
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <span>✨ Gerado por IA</span>
                    <span>•</span>
                    <span>⏱️ {(metadata.duration / 1000).toFixed(1)}s</span>
                    <span>•</span>
                    <span>🔤 {metadata.tokens} tokens</span>
                  </div>
                </div>
              </div>
            )}
            
            {generatedProposal && (
              <DocumentPreview
                content={generatedProposal}
                type="proposal"
                onDownload={handleDownload}
              />
            )}
          </div>
        )}
      </main>

      <footer className="mt-16 py-8 border-t border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center text-sm text-gray-600">
          <p>MarketForge © 2025 - Transformando ideias em projetos com IA</p>
        </div>
      </footer>
    </div>
  );
}
