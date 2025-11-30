import { ServiceCategory } from './types';
import { Wrench, Sparkles, BookOpen, Scissors, Car, Leaf, Laptop, MoreHorizontal } from 'lucide-react';

export const APP_NAME = "TrampoFácil";

export const CATEGORY_ICONS: Record<ServiceCategory, any> = {
  [ServiceCategory.HOME_REPAIR]: Wrench,
  [ServiceCategory.CLEANING]: Sparkles,
  [ServiceCategory.EDUCATION]: BookOpen,
  [ServiceCategory.BEAUTY]: Scissors,
  [ServiceCategory.TRANSPORT]: Car,
  [ServiceCategory.GARDENING]: Leaf,
  [ServiceCategory.TECH]: Laptop,
  [ServiceCategory.OTHER]: MoreHorizontal
};

// Kept relatively neutral or matching standard category colors, but can be overridden by UI theme
export const CATEGORY_COLORS: Record<ServiceCategory, string> = {
  [ServiceCategory.HOME_REPAIR]: "bg-orange-100 text-orange-700",
  [ServiceCategory.CLEANING]: "bg-blue-100 text-blue-700",
  [ServiceCategory.EDUCATION]: "bg-yellow-100 text-yellow-700",
  [ServiceCategory.BEAUTY]: "bg-pink-100 text-pink-700",
  [ServiceCategory.TRANSPORT]: "bg-slate-100 text-slate-700",
  [ServiceCategory.GARDENING]: "bg-green-100 text-green-700",
  [ServiceCategory.TECH]: "bg-purple-100 text-purple-700",
  [ServiceCategory.OTHER]: "bg-gray-100 text-gray-700"
};

export const CATEGORY_IMAGES: Record<ServiceCategory, string> = {
  // Using Pexels for reliable static hosting
  [ServiceCategory.HOME_REPAIR]: "https://images.pexels.com/photos/2219024/pexels-photo-2219024.jpeg?auto=compress&cs=tinysrgb&w=400",
  [ServiceCategory.CLEANING]: "https://images.pexels.com/photos/4108715/pexels-photo-4108715.jpeg?auto=compress&cs=tinysrgb&w=400", // Domestic worker cleaning
  [ServiceCategory.EDUCATION]: "https://images.pexels.com/photos/1741230/pexels-photo-1741230.jpeg?auto=compress&cs=tinysrgb&w=400", // Woman teaching child
  [ServiceCategory.BEAUTY]: "https://images.pexels.com/photos/3993449/pexels-photo-3993449.jpeg?auto=compress&cs=tinysrgb&w=400",
  [ServiceCategory.TRANSPORT]: "https://images.pexels.com/photos/116675/pexels-photo-116675.jpeg?auto=compress&cs=tinysrgb&w=400",
  [ServiceCategory.GARDENING]: "https://images.pexels.com/photos/1301856/pexels-photo-1301856.jpeg?auto=compress&cs=tinysrgb&w=400",
  [ServiceCategory.TECH]: "https://images.pexels.com/photos/1181675/pexels-photo-1181675.jpeg?auto=compress&cs=tinysrgb&w=400",
  [ServiceCategory.OTHER]: "https://images.pexels.com/photos/66134/pexels-photo-66134.jpeg?auto=compress&cs=tinysrgb&w=400"
};

// Fallback data for demo purposes if Supabase isn't connected
export const MOCK_SERVICES = [
  {
    id: '1',
    provider_id: 'user1',
    title: 'Eletricista Residencial',
    description: 'Troca de fiação, instalação de chuveiros e tomadas.',
    category: ServiceCategory.HOME_REPAIR,
    price: 80,
    price_unit: 'hour',
    latitude: -23.550520,
    longitude: -46.633308,
    created_at: new Date().toISOString(),
    provider_name: 'Carlos Silva'
  },
  {
    id: '2',
    provider_id: 'user2',
    title: 'Aulas de Matemática',
    description: 'Reforço escolar para ensino fundamental e médio.',
    category: ServiceCategory.EDUCATION,
    price: 50,
    price_unit: 'hour',
    latitude: -23.551520,
    longitude: -46.634308,
    created_at: new Date().toISOString(),
    provider_name: 'Ana Souza'
  },
  {
    id: '3',
    provider_id: 'user3',
    title: 'Jardinagem Completa',
    description: 'Poda, corte de grama e paisagismo.',
    category: ServiceCategory.GARDENING,
    price: 150,
    price_unit: 'job',
    latitude: -23.548520,
    longitude: -46.632308,
    created_at: new Date().toISOString(),
    provider_name: 'Roberto Mendes'
  }
];