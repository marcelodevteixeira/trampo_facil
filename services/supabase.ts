
import { createClient } from '@supabase/supabase-js';
import { ServiceJob, UserProfile } from '../types';
import { MOCK_SERVICES } from '../constants';
import { SUPABASE_URL as FILE_URL, SUPABASE_ANON_KEY as FILE_KEY } from './credentials';

// Função auxiliar para buscar variáveis de ambiente em diferentes padrões
const getEnv = (key: string): string => {
  let value = '';
  
  try {
    if (typeof process !== 'undefined' && process.env) {
      value = process.env[key] || process.env[`REACT_APP_${key}`] || process.env[`VITE_${key}`] || '';
    }
  } catch (e) { }

  if (!value) {
    try {
      // @ts-ignore
      if (typeof import.meta !== 'undefined' && import.meta.env) {
        // @ts-ignore
        value = import.meta.env[key] || import.meta.env[`VITE_${key}`] || '';
      }
    } catch (e) { }
  }

  return value;
};

// Pegamos as chaves: Prioridade para o arquivo credentials.ts (mais fácil de editar), depois variáveis de ambiente
const supabaseUrl = FILE_URL || getEnv('SUPABASE_URL');
const supabaseKey = FILE_KEY || getEnv('SUPABASE_ANON_KEY');

const isSupabaseConfigured = supabaseUrl && supabaseKey && supabaseUrl !== "" && supabaseKey !== "";

if (!isSupabaseConfigured) {
  console.log('⚠️ Supabase não configurado. Usando dados de teste (Mock).');
  console.log('Para conectar, preencha o arquivo services/credentials.ts');
} else {
  console.log('✅ Supabase conectado!');
}

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// --- Auth Services ---

export const signInWithGoogle = async () => {
  if (!isSupabaseConfigured || !supabase) {
    alert("Supabase não configurado. Preencha as chaves em services/credentials.ts");
    return;
  }
  
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: window.location.origin
    }
  });

  if (error) throw error;
  return data;
};

export const signInWithEmail = async (email: string, password: string): Promise<any> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    if (error) throw error;
    return data;
  } else {
    // Mock Login Simulation
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          user: { id: 'demo_id', email },
          session: { access_token: 'fake' }
        });
      }, 1000);
    });
  }
};

export const signUpWithEmail = async (email: string, password: string, name: string, phone: string) => {
    if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    name,
                    phone
                }
            }
        });
        if (error) throw error;
        return data;
    } else {
        // Mock SignUp
        return { user: { id: 'new_user', email }, session: null };
    }
};

export const signOut = async () => {
    if (isSupabaseConfigured && supabase) {
        await supabase.auth.signOut();
    }
};

export const getUserProfile = async (userId: string): Promise<UserProfile | null> => {
    if (isSupabaseConfigured && supabase) {
        const { data, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', userId)
            .single();
        
        if (error) return null;
        return data;
    }
    return {
        id: userId,
        name: 'Usuário Demo',
        email: 'demo@exemplo.com',
        phone: '1199999999'
    };
};

// --- Data Services ---

export const fetchServices = async (): Promise<ServiceJob[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('services')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Erro ao buscar serviços:", error);
      throw error;
    }
    
    return data.map((item: any) => ({
      ...item,
      provider_name: item.profiles?.name || 'Usuário'
    }));
  } else {
    return new Promise((resolve) => {
      const stored = localStorage.getItem('trampolocal_services');
      const localServices = stored ? JSON.parse(stored) : [];
      resolve([...MOCK_SERVICES, ...localServices] as any);
    });
  }
};

export const createService = async (service: Omit<ServiceJob, 'id' | 'created_at' | 'distance'>, userId: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('services').insert([service]);
    if (error) throw error;
  } else {
    const newService = {
      ...service,
      id: Math.random().toString(36).substr(2, 9),
      created_at: new Date().toISOString(),
      provider_name: 'Você (Demo)',
      provider_id: userId
    };
    
    const stored = localStorage.getItem('trampolocal_services');
    const localServices = stored ? JSON.parse(stored) : [];
    localServices.push(newService);
    localStorage.setItem('trampolocal_services', JSON.stringify(localServices));
  }
};
