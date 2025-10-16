// ============================================
// PROMPTS PARA IA COPYWRITER
// ============================================

export interface ProposalData {
  clientName: string;
  clientCompany?: string;
  providerName: string;
  providerCompany?: string;
  scope: string;
  deadline: string;
  value: string;
  paymentTerms: string;
  differentials?: string;
}

export interface ContractData {
  type: 'PF' | 'PJ';
  provider: {
    name: string;
    document: string;
    address: string;
    email: string;
    phone: string;
  };
  client: {
    name: string;
    document: string;
    address: string;
    email: string;
    phone: string;
  };
  object: string;
  term: string;
  value: string;
  paymentMethod: string;
  specificClauses?: string;
}

export function generateProposalPrompt(data: ProposalData): string {
  const clientDisplay = data.clientCompany 
    ? `${data.clientName} (${data.clientCompany})` 
    : data.clientName;
  
  const providerDisplay = data.providerCompany
    ? `${data.providerName} (${data.providerCompany})` 
    : data.providerName;

  return `Você é um especialista em vendas e redação comercial. Crie uma proposta comercial profissional, persuasiva e bem estruturada.

## INFORMAÇÕES DO PROJETO

**Cliente:** ${clientDisplay}
**Fornecedor:** ${providerDisplay}
**Escopo:** ${data.scope}
**Prazo:** ${data.deadline}
**Investimento:** ${data.value}
**Condições de Pagamento:** ${data.paymentTerms}
${data.differentials ? `**Diferenciais do Fornecedor:** ${data.differentials}` : ''}

## INSTRUÇÕES

Crie uma proposta comercial seguindo esta estrutura exata:

# Proposta Comercial

**Para:** ${clientDisplay}  
**De:** ${providerDisplay}  
**Data:** ${new Date().toLocaleDateString('pt-BR')}  
**Validade:** 15 dias

---

## 📋 Apresentação

[Parágrafo de abertura caloroso e profissional, demonstrando entusiasmo pela oportunidade de trabalhar com o cliente. Mencione brevemente sua experiência/credibilidade.]

## 🎯 Entendimento do Projeto

[Demonstre que você compreendeu profundamente as necessidades do cliente. Reformule o problema/objetivo que o projeto vai resolver. Use uma linguagem que mostre empatia e alinhamento.]

## 💡 Nossa Solução

[Detalhe o escopo de forma clara e estruturada. Use tópicos se necessário. Explique COMO você vai entregar, não apenas O QUÊ. Foque nos benefícios para o cliente.]

**Entregas principais:**
- [Lista detalhada das entregas]

## 💰 Investimento

**Valor do Projeto:** ${data.value}

**Condições de Pagamento:**  
${data.paymentTerms}

[Parágrafo justificando o valor - foque no ROI e valor agregado, não no preço.]

## 📅 Cronograma

**Prazo de execução:** ${data.deadline}

[Se possível, quebre em fases ou milestones]

## ✨ Por Que Escolher ${data.providerCompany || data.providerName}?

${data.differentials ? `${data.differentials}\n\n` : ''}[Adicione 2-3 pontos de diferenciação, mesmo que já tenha diferenciais fornecidos. Foque em confiança, qualidade, compromisso.]

## 🚀 Próximos Passos

Para darmos início ao projeto, basta:

1. Aprovar esta proposta
2. Efetivar o pagamento da primeira parcela
3. Agendar reunião de kickoff

Estou à disposição para esclarecer qualquer dúvida!

---

**${providerDisplay}**  
[Adicione uma frase de call-to-action confiante e entusiasmada]

## DIRETRIZES DE TOM

- Use tom profissional mas acessível (evite jargão excessivo)
- Seja persuasivo sem ser agressivo
- Foque em valor e benefícios para o cliente
- Use verbos de ação
- Demonstre confiança e entusiasmo
- Personalize com base nas informações fornecidas
- Mantenha formatação markdown limpa e legível

Gere APENAS a proposta, sem textos introdutórios ou explicações adicionais.`;
}

export function generateContractPrompt(data: ContractData): string {
  const hoje = new Date().toLocaleDateString('pt-BR');
  const tipoDoc = data.type === 'PF' ? 'CPF' : 'CNPJ';

  return `Você é um especialista em contratos de prestação de serviços. Crie um contrato formal, claro e juridicamente adequado para o Brasil.

## INFORMAÇÕES DO CONTRATO

**Tipo:** ${data.type === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}

**CONTRATADO (Fornecedor):**
- Nome: ${data.provider.name}
- ${tipoDoc}: ${data.provider.document}
- Endereço: ${data.provider.address}
- Email: ${data.provider.email}
- Telefone: ${data.provider.phone}

**CONTRATANTE (Cliente):**
- Nome: ${data.client.name}
- ${tipoDoc}: ${data.client.document}
- Endereço: ${data.client.address}
- Email: ${data.client.email}
- Telefone: ${data.client.phone}

**OBJETO:** ${data.object}
**PRAZO:** ${data.term}
**VALOR:** ${data.value}
**FORMA DE PAGAMENTO:** ${data.paymentMethod}
${data.specificClauses ? `**CLÁUSULAS ADICIONAIS:** ${data.specificClauses}` : ''}

## INSTRUÇÕES

Crie um contrato de prestação de serviços seguindo esta estrutura:

# CONTRATO DE PRESTAÇÃO DE SERVIÇOS

**Contrato celebrado em ${hoje}**

---

## PARTES

**CONTRATADO:** ${data.provider.name}, inscrito no ${tipoDoc} sob o nº ${data.provider.document}, com endereço na ${data.provider.address}, doravante denominado **CONTRATADO**.

**CONTRATANTE:** ${data.client.name}, inscrito no ${tipoDoc} sob o nº ${data.client.document}, com endereço na ${data.client.address}, doravante denominado **CONTRATANTE**.

As partes acima qualificadas têm, entre si, justo e acordado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas seguintes:

---

## CLÁUSULA 1ª - DO OBJETO

O presente contrato tem como objeto a prestação de serviços de ${data.object}.

[Detalhe o escopo de forma clara e completa]

## CLÁUSULA 2ª - DO PRAZO

O prazo para execução dos serviços será de ${data.term}, contados a partir da assinatura deste contrato e confirmação do pagamento inicial.

## CLÁUSULA 3ª - DO VALOR E FORMA DE PAGAMENTO

Pelo serviço objeto deste contrato, o CONTRATANTE pagará ao CONTRATADO o valor de ${data.value}.

**Forma de pagamento:**  
${data.paymentMethod}

Parágrafo Único: Os valores acordados não incluem reajustes, salvo acordo expresso entre as partes.

## CLÁUSULA 4ª - DAS OBRIGAÇÕES DO CONTRATADO

São obrigações do CONTRATADO:

a) Executar os serviços com qualidade e dentro do prazo estabelecido;
b) Manter sigilo sobre informações confidenciais do CONTRATANTE;
c) Informar o CONTRATANTE sobre o andamento dos trabalhos;
d) Entregar os trabalhos conforme especificado na Cláusula 1ª.

## CLÁUSULA 5ª - DAS OBRIGAÇÕES DO CONTRATANTE

São obrigações do CONTRATANTE:

a) Efetuar os pagamentos nas datas acordadas;
b) Fornecer todas as informações necessárias para execução dos serviços;
c) Responder às solicitações do CONTRATADO em tempo hábil;
d) Aprovar ou reprovar entregas em até 5 dias úteis.

## CLÁUSULA 6ª - DA PROPRIEDADE INTELECTUAL

Todos os direitos autorais e de propriedade intelectual sobre o trabalho desenvolvido serão transferidos ao CONTRATANTE após o pagamento integral do valor acordado.

## CLÁUSULA 7ª - DA RESCISÃO

Este contrato poderá ser rescindido por qualquer das partes mediante aviso prévio de 15 dias, sem prejuízo das obrigações já assumidas.

Parágrafo Único: Em caso de rescisão, o CONTRATANTE deverá pagar pelos serviços já executados proporcionalmente.

## CLÁUSULA 8ª - DA CONFIDENCIALIDADE

As partes se comprometem a manter sigilo sobre informações confidenciais trocadas durante a vigência deste contrato, mesmo após seu término.

## CLÁUSULA 9ª - DAS ALTERAÇÕES

Qualquer alteração deste contrato deverá ser feita por escrito e acordada entre ambas as partes.

${data.specificClauses ? `\n## CLÁUSULA 10ª - DISPOSIÇÕES ESPECÍFICAS\n\n${data.specificClauses}\n` : ''}

## CLÁUSULA FINAL - DO FORO

Fica eleito o foro da comarca de [CIDADE], para dirimir quaisquer dúvidas oriundas do presente contrato, renunciando as partes a qualquer outro, por mais privilegiado que seja.

E, por estarem assim justos e contratados, firmam o presente instrumento em duas vias de igual teor e forma, na presença de duas testemunhas.

---

**Local e Data:** _________________________, ___/___/______

---

**CONTRATADO:**

_________________________________  
${data.provider.name}  
${tipoDoc}: ${data.provider.document}

---

**CONTRATANTE:**

_________________________________  
${data.client.name}  
${tipoDoc}: ${data.client.document}

---

**TESTEMUNHAS:**

1. _________________________________  
   Nome:  
   CPF:

2. _________________________________  
   Nome:  
   CPF:

---

## ⚠️ IMPORTANTE - AVISO LEGAL

**Este contrato é um modelo gerado por inteligência artificial e serve apenas como ponto de partida. É FORTEMENTE RECOMENDADO que você consulte um advogado especializado antes de utilizar este documento, para garantir que ele atenda às suas necessidades específicas e esteja em conformidade com a legislação vigente.**

## DIRETRIZES

- Use linguagem formal e jurídica apropriada
- Seja claro e direto nas cláusulas
- Numere todas as cláusulas
- Inclua todas as informações fornecidas
- Mantenha formatação markdown limpa
- Adicione o aviso legal no final
- Se houver cláusulas específicas fornecidas, incorpore-as adequadamente

Gere APENAS o contrato, sem textos introdutórios ou explicações adicionais.`;
}
