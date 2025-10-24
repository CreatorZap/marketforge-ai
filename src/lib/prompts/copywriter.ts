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
  city: string;
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

  return `Você é um advogado especialista em contratos de tecnologia e prestação de serviços no Brasil, com experiência em contratos SaaS e compliance com LGPD.

MODELO DE REFERÊNCIA:
Baseie-se na estrutura de contratos profissionais reconhecidos pelo mercado, como os da Plataforma Pontue, que são padrão ouro em contratos de tecnologia.

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

## INSTRUÇÕES PARA GERAR O CONTRATO

Gere um CONTRATO COMPLETO E PROFISSIONAL de prestação de serviços seguindo OBRIGATORIAMENTE esta estrutura em 14 SEÇÕES com NO MÍNIMO 35 CLÁUSULAS:

# CONTRATO DE PRESTAÇÃO DE SERVIÇOS ${data.type === 'PF' ? 'DE PESSOA FÍSICA' : 'DE PESSOA JURÍDICA'}

**Contrato celebrado em ${hoje}**

---

## PARTES CONTRATANTES

**CONTRATADO:** ${data.provider.name}, inscrito no ${tipoDoc} sob o nº ${data.provider.document}, com endereço na ${data.provider.address}, e-mail ${data.provider.email}, telefone ${data.provider.phone}, doravante denominado **CONTRATADO**.

**CONTRATANTE:** ${data.client.name}, inscrito no ${tipoDoc} sob o nº ${data.client.document}, com endereço na ${data.client.address}, e-mail ${data.client.email}, telefone ${data.client.phone}, doravante denominado **CONTRATANTE**.

As partes acima qualificadas têm, entre si, justo e acordado o presente Contrato de Prestação de Serviços, que se regerá pelas cláusulas e condições seguintes e pela legislação aplicável:

---

## I - DO OBJETO

**CLÁUSULA 1ª - DA DESCRIÇÃO DOS SERVIÇOS**

O presente contrato tem como objeto a prestação de serviços de ${data.object}.

Parágrafo Único: Os serviços serão prestados com observância das melhores práticas de mercado, legislação vigente e normas técnicas aplicáveis.

**CLÁUSULA 2ª - DA PROPRIEDADE INTELECTUAL E DIREITOS AUTORAIS**

Os direitos de propriedade intelectual sobre o trabalho desenvolvido serão regidos pela Lei nº 9.609/98 (Lei do Software) e Lei nº 9.610/98 (Lei de Direitos Autorais).

Parágrafo 1º: Todos os direitos autorais e de propriedade intelectual sobre o trabalho desenvolvido serão transferidos ao CONTRATANTE após o pagamento integral do valor acordado.

Parágrafo 2º: O CONTRATADO garante que o trabalho desenvolvido é original e não viola direitos de terceiros.

---

## II - DAS OBRIGAÇÕES DO CONTRATADO

**CLÁUSULA 3ª - DO FORNECIMENTO DO SERVIÇO**

São obrigações do CONTRATADO:

a) Executar os serviços com qualidade técnica, dentro do prazo estabelecido e conforme especificações acordadas;
b) Fornecer todos os recursos técnicos necessários para a execução dos serviços;
c) Garantir que os serviços prestados estejam em conformidade com a legislação brasileira vigente;
d) Informar imediatamente ao CONTRATANTE sobre qualquer impedimento ou dificuldade na execução dos serviços.

**CLÁUSULA 4ª - DA MANUTENÇÃO E SUPORTE**

O CONTRATADO compromete-se a:

a) Prestar suporte técnico durante a vigência do contrato;
b) Responder às solicitações de suporte em até 48 horas úteis;
c) Corrigir eventuais falhas ou defeitos identificados nos serviços prestados;
d) Manter documentação atualizada sobre os serviços fornecidos.

**CLÁUSULA 5ª - DO COMPLIANCE E PROTEÇÃO DE DADOS (LGPD)**

O CONTRATADO obriga-se a:

a) Cumprir integralmente a Lei nº 13.709/2018 (Lei Geral de Proteção de Dados - LGPD);
b) Tratar os dados pessoais do CONTRATANTE apenas para as finalidades autorizadas;
c) Implementar medidas de segurança técnicas e administrativas adequadas para proteger os dados;
d) Notificar o CONTRATANTE imediatamente em caso de incidente de segurança envolvendo dados pessoais;
e) Não compartilhar dados pessoais com terceiros sem autorização expressa.

**CLÁUSULA 6ª - DA COMUNICAÇÃO E TRANSPARÊNCIA**

O CONTRATADO deverá:

a) Manter canal de comunicação ativo e acessível;
b) Fornecer relatórios de progresso conforme solicitado;
c) Informar sobre quaisquer alterações que possam impactar os serviços;
d) Manter o CONTRATANTE informado sobre o andamento dos trabalhos.

---

## III - DOS DIREITOS DO CONTRATADO

**CLÁUSULA 7ª - DO DIREITO À REMUNERAÇÃO**

O CONTRATADO tem direito a:

a) Receber a remuneração nos valores e prazos estabelecidos neste contrato;
b) Suspender os serviços em caso de atraso superior a 15 dias no pagamento;
c) Aplicar correção monetária pelo IPCA em caso de atraso no pagamento.

**CLÁUSULA 8ª - DO DIREITO A ALTERAÇÕES CONTRATUAIS**

O CONTRATADO poderá solicitar alterações no escopo mediante:

a) Notificação prévia de 15 dias;
b) Justificativa técnica ou comercial;
c) Acordo mútuo entre as partes.

---

## IV - DAS OBRIGAÇÕES DO CONTRATANTE

**CLÁUSULA 9ª - DAS INFORMAÇÕES E COLABORAÇÃO**

São obrigações do CONTRATANTE:

a) Fornecer todas as informações, dados e materiais necessários à execução dos serviços;
b) Garantir que as informações fornecidas são verdadeiras e atualizadas;
c) Responder às solicitações do CONTRATADO em tempo hábil;
d) Designar interlocutor responsável pelo acompanhamento do contrato;
e) Aprovar ou reprovar entregas em até 7 dias úteis.

**CLÁUSULA 10ª - DO PAGAMENTO PONTUAL**

O CONTRATANTE obriga-se a:

a) Efetuar os pagamentos nas datas acordadas;
b) Manter dados bancários e fiscais atualizados;
c) Arcar com eventuais encargos decorrentes de atraso no pagamento.

**CLÁUSULA 11ª - DO USO ADEQUADO**

O CONTRATANTE compromete-se a:

a) Utilizar os serviços de forma adequada e dentro das especificações;
b) Não realizar engenharia reversa, cópia ou redistribuição não autorizada;
c) Respeitar os direitos de propriedade intelectual do CONTRATADO;
d) Cumprir todas as normativas legais aplicáveis.

---

## V - DO PRAZO E VIGÊNCIA

**CLÁUSULA 12ª - DO PRAZO DE EXECUÇÃO**

O prazo para execução dos serviços será de ${data.term}, contados a partir da assinatura deste contrato e confirmação do primeiro pagamento.

Parágrafo Único: O prazo poderá ser prorrogado mediante acordo entre as partes, formalizado por escrito.

**CLÁUSULA 13ª - DA VIGÊNCIA CONTRATUAL**

Este contrato tem vigência a partir da data de sua assinatura e permanecerá válido até a conclusão dos serviços e cumprimento integral das obrigações pelas partes.

---

## VI - DA FORMA DE PAGAMENTO

**CLÁUSULA 14ª - DO VALOR DOS SERVIÇOS**

Pelo serviço objeto deste contrato, o CONTRATANTE pagará ao CONTRATADO o valor total de ${data.value} (valor por extenso).

**CLÁUSULA 15ª - DAS CONDIÇÕES DE PAGAMENTO**

Forma de pagamento: ${data.paymentMethod}

Parágrafo 1º: Os valores acordados incluem todos os custos, despesas e tributos relacionados à prestação dos serviços.

Parágrafo 2º: O atraso no pagamento sujeitará o CONTRATANTE a multa de 2% sobre o valor devido, acrescida de juros de 1% ao mês e correção monetária pelo IPCA.

Parágrafo 3º: Após 30 dias de atraso, o CONTRATADO poderá considerar rescindido o contrato, sem prejuízo de cobrança dos valores devidos.

**CLÁUSULA 16ª - DA CORREÇÃO MONETÁRIA**

Os valores deste contrato poderão ser reajustados anualmente pelo IPCA, mediante notificação prévia de 30 dias.

---

## VII - DAS FORMAS DE EXTINÇÃO DO CONTRATO

**CLÁUSULA 17ª - DA RESILIÇÃO UNILATERAL**

Qualquer das partes poderá rescindir este contrato mediante:

a) Notificação prévia por escrito com 30 dias de antecedência;
b) Cumprimento das obrigações até a data da rescisão;
c) Pagamento proporcional pelos serviços executados.

**CLÁUSULA 18ª - DA RESCISÃO POR INADIMPLEMENTO**

O contrato poderá ser rescindido imediatamente em caso de:

a) Inadimplência superior a 30 dias;
b) Descumprimento de cláusulas essenciais do contrato;
c) Falência ou recuperação judicial de qualquer das partes;
d) Violação de confidencialidade ou LGPD.

Parágrafo Único: A parte que der causa à rescisão arcará com perdas e danos causados à outra parte.

**CLÁUSULA 19ª - DO PROCEDIMENTO DE RECURSO**

Em caso de discordância quanto aos serviços prestados:

a) O CONTRATANTE deverá notificar o CONTRATADO por escrito em até 7 dias;
b) O CONTRATADO terá 15 dias para apresentar justificativas ou propor correções;
c) Persistindo a discordância, as partes buscarão solução amigável antes de recorrer ao judiciário.

---

## VIII - DA CONFIDENCIALIDADE E PRIVACIDADE

**CLÁUSULA 20ª - DAS INFORMAÇÕES CONFIDENCIAIS**

As partes comprometem-se a:

a) Manter sigilo absoluto sobre todas as informações confidenciais trocadas;
b) Não divulgar, reproduzir ou utilizar informações confidenciais para outros fins;
c) Limitar o acesso às informações apenas aos envolvidos diretos;
d) Manter a confidencialidade mesmo após o término do contrato.

**CLÁUSULA 21ª - DO COMPLIANCE COM A LGPD**

Em conformidade com a Lei nº 13.709/2018 (LGPD):

a) Os dados pessoais serão tratados apenas para as finalidades deste contrato;
b) Serão implementadas medidas de segurança adequadas;
c) Os titulares dos dados têm direito de acesso, correção, exclusão e portabilidade;
d) Incidentes de segurança serão notificados à ANPD conforme legislação.

**CLÁUSULA 22ª - DA POLÍTICA DE PRIVACIDADE**

O tratamento de dados pessoais seguirá os princípios de finalidade, adequação, necessidade, transparência e segurança estabelecidos na LGPD.

---

## IX - DA PROPRIEDADE INTELECTUAL E DIREITOS AUTORAIS

**CLÁUSULA 23ª - DA LEI DO SOFTWARE**

Em conformidade com a Lei nº 9.609/98:

a) O software desenvolvido é considerado propriedade intelectual protegida;
b) É vedada a reprodução, distribuição ou modificação não autorizada;
c) A transferência de direitos dar-se-á após pagamento integral.

**CLÁUSULA 24ª - DOS DIREITOS PATRIMONIAIS**

Após o pagamento integral, o CONTRATANTE terá:

a) Direito de uso, modificação e distribuição do trabalho desenvolvido;
b) Direitos patrimoniais sobre o produto final;
c) Autorização para licenciar ou sublicenciar o trabalho desenvolvido.

Parágrafo Único: O CONTRATADO manterá direitos morais sobre o trabalho, incluindo reconhecimento de autoria.

---

## X - DAS DISPOSIÇÕES GERAIS

**CLÁUSULA 25ª - DA BOA-FÉ OBJETIVA**

As partes comprometem-se a agir com boa-fé, probidade e lealdade contratual, conforme Art. 422 do Código Civil.

**CLÁUSULA 26ª - DAS ALTERAÇÕES CONTRATUAIS**

Qualquer alteração deste contrato deverá ser:

a) Formalizada por escrito;
b) Acordada por ambas as partes;
c) Registrada como aditivo contratual.

**CLÁUSULA 27ª - DA CESSÃO DO CONTRATO**

É vedada a cessão deste contrato a terceiros sem anuência prévia e expressa da outra parte.

**CLÁUSULA 28ª - DA INDEPENDÊNCIA DAS CLÁUSULAS**

A invalidade ou ineficácia de qualquer cláusula não afetará a validade das demais disposições contratuais.

**CLÁUSULA 29ª - DO CASO FORTUITO E FORÇA MAIOR**

As partes não serão responsabilizadas por inadimplemento decorrente de caso fortuito ou força maior, conforme Art. 393 do Código Civil.

**CLÁUSULA 30ª - DA ANTICORRUPÇÃO**

As partes declaram conhecer e comprometer-se a cumprir a Lei nº 12.846/2013 (Lei Anticorrupção), abstendo-se de práticas corruptas.

${data.specificClauses ? `\n**CLÁUSULA 31ª - DISPOSIÇÕES ESPECÍFICAS**\n\n${data.specificClauses}\n` : ''}

---

## XI - DO FORO

**CLÁUSULA FINAL - DA ELEIÇÃO DE FORO**

Fica eleito o foro da comarca de ${data.city}, com exclusão de qualquer outro, por mais privilegiado que seja, para dirimir quaisquer dúvidas ou controvérsias oriundas do presente contrato.

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

---

## DIRETRIZES DE QUALIDADE OBRIGATÓRIAS:

1. ✅ Use LINGUAGEM JURÍDICA FORMAL e profissional
2. ✅ Numere TODAS as cláusulas (Cláusula 1ª, 2ª, 3ª, etc)
3. ✅ Use parágrafos quando necessário (Parágrafo Único, 1º, 2º, etc)
4. ✅ Mencione LEIS ESPECÍFICAS: Lei 9.609/98 (Software), Lei 13.709/18 (LGPD), Lei 12.846/13 (Anticorrupção), Código Civil
5. ✅ Inclua NO MÍNIMO 30-35 CLÁUSULAS detalhadas
6. ✅ Organize em 11 SEÇÕES principais (I a XI)
7. ✅ Cada cláusula deve ter SUBTÓPICOS (a, b, c, d, etc)
8. ✅ Defina PRAZOS ESPECÍFICOS (ex: 48h para suporte, 7 dias para aprovação)
9. ✅ Inclua cláusulas de COMPLIANCE (LGPD, Anticorrupção)
10. ✅ Estabeleça PROCEDIMENTO DE RECURSO detalhado
11. ✅ Defina DIREITOS E DEVERES de ambas as partes
12. ✅ Inclua MULTAS E JUROS específicos (2% multa + 1% ao mês)
13. ✅ Mencione CORREÇÃO MONETÁRIA (IPCA)
14. ✅ Use formatação Markdown com headers (# ## ###)
15. ✅ O contrato deve ter NO MÍNIMO 1500-2000 PALAVRAS

## EVITE ABSOLUTAMENTE:

❌ Cláusulas genéricas ou vagas
❌ Linguagem informal ou coloquial
❌ Contratos muito curtos (menos de 1500 palavras)
❌ Esquecer de mencionar LGPD e compliance
❌ Omitir prazos específicos
❌ Não numerar cláusulas
❌ Falta de estrutura em seções

## QUALIDADE ESPERADA:

O contrato gerado deve ter qualidade IGUAL OU SUPERIOR aos contratos profissionais da Plataforma Pontue, com robustez jurídica, clareza e completude para uso comercial real.

Gere APENAS o contrato completo e profissional, sem textos introdutórios ou explicações adicionais.`;
}
