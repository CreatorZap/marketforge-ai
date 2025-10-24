'use client';

import { useState } from 'react';
import { ArrowLeft, FileText, AlertCircle } from 'lucide-react';
import Link from 'next/link';
import ContractForm from '@/components/copywriter/ContractForm';
import DocumentPreview from '@/components/copywriter/DocumentPreview';

export default function ContractPage() {
  const [step, setStep] = useState<'form' | 'preview'>('form');
  const [generatedContract, setGeneratedContract] = useState<string | null>(null);
  const [metadata, setMetadata] = useState<{tokens: number; duration: number; model: string} | null>(null);

  const handleSuccess = (contract: string, meta: {tokens: number; duration: number; model: string}) => {
    setGeneratedContract(contract);
    setMetadata(meta);
    setStep('preview');
  };

  const handleNewContract = () => {
    setStep('form');
    setGeneratedContract(null);
    setMetadata(null);
  };

  const handleDownload = (content: string) => {
    // Download realizado com sucesso
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link 
                href="/dashboard"
                className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span className="font-medium">Voltar</span>
              </Link>
              
              <div className="hidden sm:block w-px h-6 bg-gray-300" />
              
              <div>
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2">
                  <FileText className="w-6 h-6 text-purple-600" />
                  Gerador de Contratos de Serviços
                </h1>
                <p className="text-sm text-gray-600 mt-1">
                  Crie contratos personalizados com IA
                </p>
              </div>
            </div>

            {step === 'preview' && (
              <button
                onClick={handleNewContract}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-all font-semibold"
              >
                Novo Contrato
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {step === 'form' ? (
          <div className="max-w-4xl mx-auto">
            <div className="mb-6 bg-amber-50 border-2 border-amber-200 rounded-xl p-6">
              <div className="flex gap-4">
                <AlertCircle className="w-6 h-6 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h3 className="text-lg font-bold text-amber-900 mb-2">
                    ⚠️ Aviso Legal Importante
                  </h3>
                  <p className="text-amber-800 mb-2">
                    Este contrato é um <strong>modelo gerado por inteligência artificial</strong> e 
                    serve apenas como ponto de partida.
                  </p>
                  <p className="text-amber-800 font-semibold">
                    É FORTEMENTE RECOMENDADO que você consulte um advogado especializado 
                    antes de utilizar este documento, para garantir que ele atenda às suas 
                    necessidades específicas e esteja em conformidade com a legislação vigente.
                  </p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <div className="mb-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-2">
                  Informações do Contrato
                </h2>
                <p className="text-gray-600">
                  Preencha os campos abaixo para gerar um contrato de prestação de serviços
                </p>
              </div>
              
              <ContractForm onSuccess={handleSuccess} />
            </div>

            <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">📜</div>
                <h3 className="font-semibold text-gray-900 mb-1">Completo</h3>
                <p className="text-sm text-gray-600">Todas as cláusulas essenciais</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">🇧🇷</div>
                <h3 className="font-semibold text-gray-900 mb-1">Brasileiro</h3>
                <p className="text-sm text-gray-600">Conforme legislação do Brasil</p>
              </div>
              
              <div className="bg-white rounded-lg p-4 shadow-sm border border-gray-200">
                <div className="text-3xl mb-2">✏️</div>
                <h3 className="font-semibold text-gray-900 mb-1">Personalizável</h3>
                <p className="text-sm text-gray-600">Edite antes de usar</p>
              </div>
            </div>
          </div>
        ) : (
          <div className="space-y-6">
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800">
                  <strong>Lembre-se:</strong> Este é um modelo gerado por IA. 
                  Consulte um advogado antes de usar.
                </p>
              </div>
            </div>

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
            
            {generatedContract && (
              <DocumentPreview
                content={generatedContract}
                type="contract"
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
