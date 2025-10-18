import { supabase } from './client';

// Interface para criar novo projeto
export interface ProjectData {
  name: string;
  niche: string;
  audience: string;
  features: string;
  platform: string;
  goal: string;
  design_style: string;
  generated_prompt?: string;
  generated_prd?: string;
  generated_research?: string;
  tokens_used?: number;
  generation_time?: number;
}

// Interface de metadados (JSONB)
export interface ProjectMetadata {
  generated_prompt: string;
  generated_prd: string;
  generated_research: string;
  generation_time: number;
  tokens_used: number;
}

export async function createProject(projectData: ProjectData) {
  try {
    // Pegar usuário logado
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    // Preparar metadados (JSONB)
    const metadata: ProjectMetadata = {
      generated_prompt: projectData.generated_prompt || '',
      generated_prd: projectData.generated_prd || '',
      generated_research: projectData.generated_research || '',
      generation_time: projectData.generation_time || 0,
      tokens_used: projectData.tokens_used || 0,
    };

    // Criar summary (resumo do conteúdo gerado)
    const summary = `Projeto ${projectData.name} - ${projectData.niche}. Público: ${projectData.audience}. Plataforma: ${projectData.platform}.`;

    // Salvar projeto com nomes corretos das colunas
    const { data, error } = await supabase
      .from('projects')
      .insert([
        {
          user_id: user.id,
          name: projectData.name,
          niche: projectData.niche,
          audience: projectData.audience,
          features: projectData.features,
          platform: projectData.platform,
          goal: projectData.goal,
          design_style: projectData.design_style,
          status: 'active',
          summary: summary,
          metadata: metadata,
        },
      ])
      .select()
      .single();

    if (error) throw error;

    // Atualizar quota do usuário
    await updateUserQuota(user.id);

    return { data, error: null };
  } catch (error: any) {
    console.error('Erro ao criar projeto:', error);
    return { data: null, error: error.message };
  }
}

async function updateUserQuota(userId: string) {
  try {
    // Buscar quota atual
    const { data: quota } = await supabase
      .from('user_quotas')
      .select('projects_used')
      .eq('user_id', userId)
      .single();

    if (quota) {
      // Incrementar contador
      await supabase
        .from('user_quotas')
        .update({ projects_used: quota.projects_used + 1 })
        .eq('user_id', userId);
    }
  } catch (error) {
    console.error('Erro ao atualizar quota:', error);
  }
}

export async function getUserProjects() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('projects')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}

export async function getUserQuota() {
  try {
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    
    if (userError || !user) {
      throw new Error('Usuário não autenticado');
    }

    const { data, error } = await supabase
      .from('user_quotas')
      .select('*')
      .eq('user_id', user.id)
      .single();

    if (error) throw error;

    return { data, error: null };
  } catch (error: any) {
    return { data: null, error: error.message };
  }
}