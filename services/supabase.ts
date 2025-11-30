import { createClient } from '@supabase/supabase-js';
import { ServiceJob, UserProfile } from '../types';
import { MOCK_SERVICES } from '../constants';

// NOTE: In a real environment, these would be process.env.VITE_SUPABASE_URL
// For this demo generation, we check if they exist, otherwise we fallback to localStorage/Mock

// Safely access process.env to avoid ReferenceError in browser
const getEnv = (key: string) => {
  try {
    if (typeof process !== 'undefined' && process.env) {
      return process.env[key];
    }
  } catch (e) {
    // process not defined
  }
  return '';
};

const supabaseUrl = getEnv('SUPABASE_URL');
const supabaseKey = getEnv('SUPABASE_ANON_KEY');

const isSupabaseConfigured = supabaseUrl && supabaseKey;

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl, supabaseKey)
  : null;

// --- Data Services ---

// Fetch services (Mock or Real)
export const fetchServices = async (): Promise<ServiceJob[]> => {
  if (isSupabaseConfigured && supabase) {
    const { data, error } = await supabase
      .from('services')
      .select('*, profiles(name)')
      .order('created_at', { ascending: false });

    if (error) throw error;
    
    // Map the joined profile name to the flat structure
    return data.map((item: any) => ({
      ...item,
      provider_name: item.profiles?.name || 'Usuário'
    }));
  } else {
    // Return Mock Data simulation
    return new Promise((resolve) => {
      // Check local storage for added services in this session
      const stored = localStorage.getItem('trampolocal_services');
      const localServices = stored ? JSON.parse(stored) : [];
      resolve([...MOCK_SERVICES, ...localServices] as any);
    });
  }
};

// Create Service
export const createService = async (service: Omit<ServiceJob, 'id' | 'created_at' | 'distance'>, userId: string): Promise<void> => {
  if (isSupabaseConfigured && supabase) {
    const { error } = await supabase.from('services').insert([service]);
    if (error) throw error;
  } else {
    // Mock Create
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