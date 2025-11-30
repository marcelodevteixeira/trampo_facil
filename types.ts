export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone: string;
  latitude?: number;
  longitude?: number;
  avatar_url?: string;
}

export interface ServiceJob {
  id: string;
  provider_id: string;
  title: string;
  description: string;
  category: ServiceCategory;
  price: number;
  price_unit: 'hour' | 'job';
  latitude: number;
  longitude: number;
  created_at: string;
  provider_name?: string; // Joined field
  distance?: number; // Calculated field
}

export enum ServiceCategory {
  HOME_REPAIR = 'Reparos Domésticos',
  CLEANING = 'Limpeza',
  EDUCATION = 'Aulas Particulares',
  BEAUTY = 'Beleza e Estética',
  TRANSPORT = 'Transporte',
  GARDENING = 'Jardinagem',
  TECH = 'Tecnologia',
  OTHER = 'Outros'
}

export interface AuthState {
  user: UserProfile | null;
  loading: boolean;
  session: any | null;
}
