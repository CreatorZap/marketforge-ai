'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Loader2, Sparkles } from 'lucide-react';
import type { ProposalData } from '@/lib/prompts/copywriter';

const proposalSchema = z.object({
  clientName: z.string().min(3, 'Nome do cliente deve ter pelo menos 3 caracteres'),
  clientCompany: z.string().optional(),
  providerName: z.string().min(3, 'Seu nome deve ter pelo menos 3 caracteres'),
  providerCompany: z.string().optional(),
  scope: z.string().min(50, 'Descreva o escopo com pelo menos 50 caracteres'),
  deadline: z.string().min(3, 'Informe o prazo de entrega'),
  value: z.string().min(3, 'Informe o valor do projeto'),
  paymentTerms: z.string().min(10, 'Descreva as condições de pagamento'),
  differentials: z.string().optional(),
});

interface ProposalFormProps {
  onSuccess: (proposal: string, metadata: any) => void;
}

export default function ProposalForm({ onSuccess }: ProposalFormProps) {
  const [formData, setFormData] = useState<ProposalData>({
    clientName: '',
    clientCompany: '',
    providerName: '',
    providerCompany: '',
    scope: '',
    deadline: '',
    value: '',
    paymentTerms: '',
    differentials: '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    if (errors[name]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const result = proposalSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      // 🔧 CORREÇÃO: errors → issues
      result.error.issues.forEach(err => {
        if (err.path[0]) {
          fieldErrors[err.path[0].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/copywriter/proposal', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar proposta');
      }

      onSuccess(data.proposal, data.metadata);
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro ao gerar proposta. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Erro Geral */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      {/* Dados do Cliente */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dados do Cliente</h3>
        
        <div>
          <label htmlFor="clientName" className="block text-sm font-medium text-gray-700 mb-1">
            Nome do Cliente *
          </label>
          <input
            type="text"
            id="clientName"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.clientName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="João Silva"
          />
          {errors.clientName && (
            <p className="mt-1 text-sm text-red-600">{errors.clientName}</p>
          )}
        </div>

        <div>
          <label htmlFor="clientCompany" className="block text-sm font-medium text-gray-700 mb-1">
            Empresa do Cliente (opcional)
          </label>
          <input
            type="text"
            id="clientCompany"
            name="clientCompany"
            value={formData.clientCompany}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
            placeholder="Empresa LTDA"
          />
        </div>
      </div>

      {/* Seus Dados */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Seus Dados</h3>
        
        <div>
          <label htmlFor="providerName" className="block text-sm font-medium text-gray-700 mb-1">
            Seu Nome *
          </label>
          <input
            type="text"
            id="providerName"
            name="providerName"
            value={formData.providerName}
            onChange={handleChange}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.providerName ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Maria Oliveira"
          />
          {errors.providerName && (
            <p className="mt-1 text-sm text-red-600">{errors.providerName}</p>
          )}
        </div>

        <div>
          <label htmlFor="providerCompany" className="block text-sm font-medium text-gray-700 mb-1">
            Sua Empresa (opcional)
          </label>
          <input
            type="text"
            id="providerCompany"
            name="providerCompany"
            value={formData.providerCompany}
            onChange={handleChange}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
            placeholder="Dev Studio"
          />
        </div>
      </div>

      {/* Detalhes do Projeto */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detalhes do Projeto</h3>
        
        <div>
          <label htmlFor="scope" className="block text-sm font-medium text-gray-700 mb-1">
            Escopo do Projeto *
          </label>
          <textarea
            id="scope"
            name="scope"
            value={formData.scope}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.scope ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descreva o que será entregue: funcionalidades, páginas, integrações, etc."
          />
          {errors.scope && (
            <p className="mt-1 text-sm text-red-600">{errors.scope}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="deadline" className="block text-sm font-medium text-gray-700 mb-1">
              Prazo de Entrega *
            </label>
            <input
              type="text"
              id="deadline"
              name="deadline"
              value={formData.deadline}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.deadline ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 30 dias"
            />
            {errors.deadline && (
              <p className="mt-1 text-sm text-red-600">{errors.deadline}</p>
            )}
          </div>

          <div>
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Valor do Projeto *
            </label>
            <input
              type="text"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.value ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: R$ 5.000"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="paymentTerms" className="block text-sm font-medium text-gray-700 mb-1">
            Condições de Pagamento *
          </label>
          <textarea
            id="paymentTerms"
            name="paymentTerms"
            value={formData.paymentTerms}
            onChange={handleChange}
            rows={2}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.paymentTerms ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 50% no início, 50% na entrega"
          />
          {errors.paymentTerms && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentTerms}</p>
          )}
        </div>

        <div>
          <label htmlFor="differentials" className="block text-sm font-medium text-gray-700 mb-1">
            Seus Diferenciais (opcional)
          </label>
          <textarea
            id="differentials"
            name="differentials"
            value={formData.differentials}
            onChange={handleChange}
            rows={2}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
            placeholder="Ex: 10 anos de experiência, +50 projetos entregues, certificações..."
          />
        </div>
      </div>

      {/* Botão Submit */}
      <button
        type="submit"
        disabled={loading}
        className="w-full bg-[#a855f7] hover:bg-[#9333ea] text-white font-semibold py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg hover:shadow-[#a855f7]/50"
      >
        {loading ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Gerando proposta...
          </>
        ) : (
          <>
            <Sparkles className="w-5 h-5" />
            Gerar Proposta Comercial
          </>
        )}
      </button>
    </form>
  );
}
