'use client';

import { useState } from 'react';
import { z } from 'zod';
import { Loader2, FileText, AlertCircle } from 'lucide-react';
import type { ContractData } from '@/lib/prompts/copywriter';

const contractSchema = z.object({
  type: z.enum(['PF', 'PJ']),
  provider: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    document: z.string().min(11, 'CPF/CNPJ inválido'),
    address: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
  }),
  client: z.object({
    name: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
    document: z.string().min(11, 'CPF/CNPJ inválido'),
    address: z.string().min(10, 'Endereço deve ter pelo menos 10 caracteres'),
    email: z.string().email('Email inválido'),
    phone: z.string().min(10, 'Telefone inválido'),
  }),
  object: z.string().min(50, 'Descreva o objeto com pelo menos 50 caracteres'),
  term: z.string().min(3, 'Informe o prazo'),
  value: z.string().min(3, 'Informe o valor'),
  paymentMethod: z.string().min(10, 'Descreva a forma de pagamento'),
  specificClauses: z.string().optional(),
});

interface ContractFormProps {
  onSuccess: (contract: string, metadata: any) => void;
}

export default function ContractForm({ onSuccess }: ContractFormProps) {
  const [contractType, setContractType] = useState<'PF' | 'PJ'>('PF');
  const [formData, setFormData] = useState<ContractData>({
    type: 'PF',
    provider: {
      name: '',
      document: '',
      address: '',
      email: '',
      phone: '',
    },
    client: {
      name: '',
      document: '',
      address: '',
      email: '',
      phone: '',
    },
    object: '',
    term: '',
    value: '',
    paymentMethod: '',
    specificClauses: '',
  });

  const [errors, setErrors] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);

  const handleTypeChange = (type: 'PF' | 'PJ') => {
    setContractType(type);
    setFormData(prev => ({ ...prev, type }));
  };

  const handleProviderChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      provider: { ...prev.provider, [name]: value }
    }));
    
    if (errors.provider?.[name]) {
      setErrors(prev => ({
        ...prev,
        provider: { ...prev.provider, [name]: undefined }
      }));
    }
  };

  const handleClientChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      client: { ...prev.client, [name]: value }
    }));
    
    if (errors.client?.[name]) {
      setErrors(prev => ({
        ...prev,
        client: { ...prev.client, [name]: undefined }
      }));
    }
  };

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
    
    const result = contractSchema.safeParse(formData);
    
    if (!result.success) {
      const fieldErrors: Record<string, any> = {};
      // 🔧 CORREÇÃO: errors → issues
      result.error.issues.forEach(err => {
        const path = err.path;
        if (path.length === 1) {
          fieldErrors[path[0].toString()] = err.message;
        } else if (path.length === 2) {
          if (!fieldErrors[path[0].toString()]) {
            fieldErrors[path[0].toString()] = {};
          }
          fieldErrors[path[0].toString()][path[1].toString()] = err.message;
        }
      });
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const response = await fetch('/api/copywriter/contract', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao gerar contrato');
      }

      onSuccess(data.contract, data.metadata);
    } catch (error: any) {
      setErrors({ general: error.message || 'Erro ao gerar contrato. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* Aviso Legal */}
      <div className="bg-[#fef3c7] border-2 border-[#fbbf24] rounded-lg p-4 flex gap-3">
        <AlertCircle className="w-5 h-5 text-[#d97706] flex-shrink-0 mt-0.5" />
        <div className="text-sm text-[#92400e]">
          <p className="font-semibold mb-1">⚠️ Aviso Legal Importante</p>
          <p>Este contrato é um modelo gerado por IA. Recomendamos <strong>fortemente</strong> a revisão por um advogado antes de usar.</p>
        </div>
      </div>

      {/* Erro Geral */}
      {errors.general && (
        <div className="p-4 bg-red-50 border border-red-300 rounded-lg text-red-700 text-sm">
          {errors.general}
        </div>
      )}

      {/* Tipo de Contrato */}
      <div className="space-y-3">
        <label className="block text-sm font-medium text-gray-700">Tipo de Contrato *</label>
        <div className="flex gap-4">
          <button
            type="button"
            onClick={() => handleTypeChange('PF')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
              contractType === 'PF'
                ? 'border-[#a855f7] bg-[#f3e8ff] text-[#7c3aed]'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">Pessoa Física</div>
            <div className="text-xs mt-1 opacity-70">CPF</div>
          </button>
          <button
            type="button"
            onClick={() => handleTypeChange('PJ')}
            className={`flex-1 py-3 px-4 rounded-lg border-2 transition-all font-medium ${
              contractType === 'PJ'
                ? 'border-[#a855f7] bg-[#f3e8ff] text-[#7c3aed]'
                : 'border-gray-300 bg-white text-gray-700 hover:border-gray-400'
            }`}
          >
            <div className="font-semibold">Pessoa Jurídica</div>
            <div className="text-xs mt-1 opacity-70">CNPJ</div>
          </button>
        </div>
      </div>

      {/* Dados do Fornecedor */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Seus Dados (Fornecedor)</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="provider-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="provider-name"
              name="name"
              value={formData.provider.name}
              onChange={handleProviderChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.provider?.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Seu nome completo"
            />
            {errors.provider?.name && (
              <p className="mt-1 text-sm text-red-600">{errors.provider.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="provider-document" className="block text-sm font-medium text-gray-700 mb-1">
              {contractType === 'PF' ? 'CPF' : 'CNPJ'} *
            </label>
            <input
              type="text"
              id="provider-document"
              name="document"
              value={formData.provider.document}
              onChange={handleProviderChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.provider?.document ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={contractType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
            />
            {errors.provider?.document && (
              <p className="mt-1 text-sm text-red-600">{errors.provider.document}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="provider-address" className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo *
          </label>
          <textarea
            id="provider-address"
            name="address"
            value={formData.provider.address}
            onChange={handleProviderChange}
            rows={2}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.provider?.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Rua, número, bairro, cidade, estado, CEP"
          />
          {errors.provider?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.provider.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="provider-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="provider-email"
              name="email"
              value={formData.provider.email}
              onChange={handleProviderChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.provider?.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="seu@email.com"
            />
            {errors.provider?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.provider.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="provider-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              id="provider-phone"
              name="phone"
              value={formData.provider.phone}
              onChange={handleProviderChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.provider?.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(00) 00000-0000"
            />
            {errors.provider?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.provider.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Dados do Cliente */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Dados do Cliente</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="client-name" className="block text-sm font-medium text-gray-700 mb-1">
              Nome Completo *
            </label>
            <input
              type="text"
              id="client-name"
              name="name"
              value={formData.client.name}
              onChange={handleClientChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.client?.name ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Nome do cliente"
            />
            {errors.client?.name && (
              <p className="mt-1 text-sm text-red-600">{errors.client.name}</p>
            )}
          </div>

          <div>
            <label htmlFor="client-document" className="block text-sm font-medium text-gray-700 mb-1">
              {contractType === 'PF' ? 'CPF' : 'CNPJ'} *
            </label>
            <input
              type="text"
              id="client-document"
              name="document"
              value={formData.client.document}
              onChange={handleClientChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.client?.document ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder={contractType === 'PF' ? '000.000.000-00' : '00.000.000/0000-00'}
            />
            {errors.client?.document && (
              <p className="mt-1 text-sm text-red-600">{errors.client.document}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="client-address" className="block text-sm font-medium text-gray-700 mb-1">
            Endereço Completo *
          </label>
          <textarea
            id="client-address"
            name="address"
            value={formData.client.address}
            onChange={handleClientChange}
            rows={2}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.client?.address ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Rua, número, bairro, cidade, estado, CEP"
          />
          {errors.client?.address && (
            <p className="mt-1 text-sm text-red-600">{errors.client.address}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label htmlFor="client-email" className="block text-sm font-medium text-gray-700 mb-1">
              Email *
            </label>
            <input
              type="email"
              id="client-email"
              name="email"
              value={formData.client.email}
              onChange={handleClientChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.client?.email ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="cliente@email.com"
            />
            {errors.client?.email && (
              <p className="mt-1 text-sm text-red-600">{errors.client.email}</p>
            )}
          </div>

          <div>
            <label htmlFor="client-phone" className="block text-sm font-medium text-gray-700 mb-1">
              Telefone *
            </label>
            <input
              type="tel"
              id="client-phone"
              name="phone"
              value={formData.client.phone}
              onChange={handleClientChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.client?.phone ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="(00) 00000-0000"
            />
            {errors.client?.phone && (
              <p className="mt-1 text-sm text-red-600">{errors.client.phone}</p>
            )}
          </div>
        </div>
      </div>

      {/* Detalhes do Contrato */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold text-gray-900">Detalhes do Contrato</h3>
        
        <div>
          <label htmlFor="object" className="block text-sm font-medium text-gray-700 mb-1">
            Objeto do Contrato *
          </label>
          <textarea
            id="object"
            name="object"
            value={formData.object}
            onChange={handleChange}
            rows={4}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.object ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Descreva detalhadamente os serviços que serão prestados..."
          />
          {errors.object && (
            <p className="mt-1 text-sm text-red-600">{errors.object}</p>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="term" className="block text-sm font-medium text-gray-700 mb-1">
              Prazo *
            </label>
            <input
              type="text"
              id="term"
              name="term"
              value={formData.term}
              onChange={handleChange}
              className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
                errors.term ? 'border-red-500' : 'border-gray-300'
              }`}
              placeholder="Ex: 30 dias"
            />
            {errors.term && (
              <p className="mt-1 text-sm text-red-600">{errors.term}</p>
            )}
          </div>

          <div className="md:col-span-2">
            <label htmlFor="value" className="block text-sm font-medium text-gray-700 mb-1">
              Valor *
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
              placeholder="Ex: R$ 10.000,00"
            />
            {errors.value && (
              <p className="mt-1 text-sm text-red-600">{errors.value}</p>
            )}
          </div>
        </div>

        <div>
          <label htmlFor="paymentMethod" className="block text-sm font-medium text-gray-700 mb-1">
            Forma de Pagamento *
          </label>
          <textarea
            id="paymentMethod"
            name="paymentMethod"
            value={formData.paymentMethod}
            onChange={handleChange}
            rows={2}
            className={`w-full px-4 py-3 bg-white border rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all ${
              errors.paymentMethod ? 'border-red-500' : 'border-gray-300'
            }`}
            placeholder="Ex: 30% no início, 40% na entrega da primeira fase, 30% na conclusão"
          />
          {errors.paymentMethod && (
            <p className="mt-1 text-sm text-red-600">{errors.paymentMethod}</p>
          )}
        </div>

        <div>
          <label htmlFor="specificClauses" className="block text-sm font-medium text-gray-700 mb-1">
            Cláusulas Específicas (opcional)
          </label>
          <textarea
            id="specificClauses"
            name="specificClauses"
            value={formData.specificClauses}
            onChange={handleChange}
            rows={3}
            className="w-full px-4 py-3 bg-white border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:ring-2 focus:ring-[#a855f7] focus:border-transparent transition-all"
            placeholder="Adicione cláusulas personalizadas que deseja incluir no contrato..."
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
            Gerando contrato...
          </>
        ) : (
          <>
            <FileText className="w-5 h-5" />
            Gerar Contrato
          </>
        )}
      </button>
    </form>
  );
}
