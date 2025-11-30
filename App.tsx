import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Navigate, useNavigate, useParams, Link, useSearchParams } from 'react-router-dom';
import Layout from './components/Layout';
import ServiceCard from './components/ServiceCard';
import { AuthState, ServiceJob, ServiceCategory, UserProfile } from './types';
import { calculateDistance, getCurrentLocation } from './services/geo';
import { fetchServices, createService, supabase } from './services/supabase';
import { CATEGORY_ICONS, CATEGORY_COLORS, CATEGORY_IMAGES } from './constants';
import { LogOut, Phone, MessageCircle, MapPin, Search, Loader2, ArrowLeft, ChevronDown, ChevronRight, SlidersHorizontal, Grid, Hammer, Home as HomeIcon, Moon, Sun, GraduationCap } from 'lucide-react';

// --- Interfaces for Props ---
interface PageProps {
  theme: string;
  toggleTheme: () => void;
}

// --- Pages ---

// 1. All Categories Page
const AllCategories: React.FC<PageProps> = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();

  const handleSelect = (cat: string) => {
    // Navigate back to home with the category filter applied
    navigate(`/?category=${encodeURIComponent(cat)}`);
  };

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="flex items-center gap-2 mb-6">
         <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <span className="font-bold text-gray-900 dark:text-white text-lg">Todas as Categorias</span>
      </div>

      <div className="grid grid-cols-2 gap-4 pb-4">
        {Object.values(ServiceCategory).map((cat) => {
            const bgImage = CATEGORY_IMAGES[cat];
            return (
                <button
                    key={cat}
                    onClick={() => handleSelect(cat)}
                    className="aspect-square bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
                >
                    <div 
                        className="h-2/3 w-full bg-cover bg-center bg-gray-200 dark:bg-gray-700"
                        style={{ backgroundImage: `url('${bgImage}')` }}
                    >
                    </div>
                    <div className="h-1/3 flex items-center justify-center p-2 bg-white dark:bg-gray-800">
                        <span className="text-sm font-bold text-gray-800 dark:text-gray-200 text-center leading-tight">
                            {cat}
                        </span>
                    </div>
                </button>
            );
        })}
      </div>
    </Layout>
  );
};

// 2. Home / Feed
const Home: React.FC<{ userLocation: { lat: number; lng: number } | null; user: UserProfile | null } & PageProps> = ({ userLocation, user, theme, toggleTheme }) => {
  const [services, setServices] = useState<ServiceJob[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');
  
  // Use URL search params to manage category state
  const [searchParams, setSearchParams] = useSearchParams();
  const selectedCategory = searchParams.get('category');

  const setSelectedCategory = (cat: string | null) => {
    if (cat) {
      setSearchParams({ category: cat });
    } else {
      setSearchParams({});
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        const data = await fetchServices();
        
        // Calculate distances if user location is available
        const processed = data.map(s => {
          if (userLocation) {
            return {
              ...s,
              distance: calculateDistance(userLocation.lat, userLocation.lng, s.latitude, s.longitude)
            };
          }
          return s;
        });

        // Sort by distance if available, otherwise date
        if (userLocation) {
          processed.sort((a, b) => (a.distance || 0) - (b.distance || 0));
        }

        setServices(processed);
      } catch (err) {
        console.error("Failed to load services", err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [userLocation]);

  const filteredServices = services.filter(s => {
    const matchesSearch = s.title.toLowerCase().includes(filter.toLowerCase()) || 
                          s.description.toLowerCase().includes(filter.toLowerCase());
    const matchesCategory = selectedCategory ? s.category === selectedCategory : true;
    return matchesSearch && matchesCategory;
  });

  // If a category is selected, show list. If not, show grid.
  // Unless user searches, then show list.
  const showList = selectedCategory !== null || filter.length > 0;

  // Group categories into chunks of 3 for the carousel
  const categorySlides = useMemo(() => {
    const allCategories = Object.values(ServiceCategory);
    const chunks = [];
    for (let i = 0; i < allCategories.length; i += 3) {
      chunks.push(allCategories.slice(i, i + 3));
    }
    return chunks;
  }, []);

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="space-y-6 relative min-h-[80vh]">
        
        {/* Hero / Header Section - COMPACT PURPLE BANNER */}
        {!showList && (
            <div className="bg-primary rounded-2xl p-4 mb-4 text-white shadow-lg shadow-primary/20 relative overflow-hidden flex items-center">
                {/* Decorative background blurs */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full -mr-10 -mt-10 blur-xl"></div>
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/10 rounded-full -ml-8 -mb-8 blur-lg"></div>

                <div className="relative z-10">
                    <span className="text-purple-200 text-sm font-medium mr-1">Olá,</span>
                    <span className="text-xl font-extrabold tracking-tight text-white leading-tight">
                        {user?.name ? user.name.split(' ')[0] : 'Visitante'}
                    </span>
                </div>
            </div>
        )}

        {/* Search Bar */}
        <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-primary group-focus-within:text-primary transition-colors" />
            </div>
            <input
              type="text"
              placeholder="O que você precisa?"
              className="block w-full pl-11 pr-4 py-4 border-none rounded-2xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-primary/20 shadow-sm font-medium transition-colors"
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
            />
        </div>

        {/* Categories Section (Paged Carousel) */}
        {!showList && (
            <div>
                <div className="flex justify-between items-center mb-4 px-1">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Categorias</h3>
                    <Link to="/categories" className="text-sm font-bold text-primary hover:underline">
                      Ver tudo
                    </Link>
                </div>
                
                {/* 
                   Carousel Container
                */}
                <div className="flex overflow-x-auto pb-4 -mx-4 scrollbar-hide snap-x snap-mandatory">
                    {categorySlides.map((slide, index) => (
                        <div key={index} className="w-full flex-shrink-0 px-4 grid grid-cols-3 gap-3 snap-center">
                            {slide.map((cat) => {
                                const bgImage = CATEGORY_IMAGES[cat];
                                return (
                                    <button
                                        key={cat}
                                        onClick={() => setSelectedCategory(cat)}
                                        className="h-32 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col overflow-hidden hover:shadow-md transition-all active:scale-[0.98]"
                                    >
                                        <div 
                                            className="h-[65%] w-full bg-cover bg-center bg-gray-200 dark:bg-gray-700"
                                            style={{ backgroundImage: `url('${bgImage}')` }}
                                        >
                                        </div>
                                        <div className="h-[35%] flex items-center justify-center px-1 bg-white dark:bg-gray-800">
                                            <span className="text-[10px] font-bold text-gray-800 dark:text-gray-200 text-center leading-tight line-clamp-2">
                                                {cat}
                                            </span>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    ))}
                </div>
            </div>
        )}

        {/* Filtered List Header */}
        {showList && (
             <div className="flex items-center gap-2 mb-4">
                <button 
                    onClick={() => setSelectedCategory(null)}
                    className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-600 dark:text-gray-300"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <h3 className="font-bold text-gray-900 dark:text-white">
                    {selectedCategory || 'Resultados da busca'}
                </h3>
             </div>
        )}

        {/* Service List or Recommendations */}
        <div>
            {!showList && (
                <div className="flex justify-between items-center mb-4 px-1 mt-2">
                    <h3 className="font-bold text-lg text-gray-900 dark:text-white">Recomendados</h3>
                </div>
            )}

            {loading ? (
                <div className="flex justify-center py-10">
                <Loader2 className="animate-spin text-primary w-8 h-8" />
                </div>
            ) : (showList ? filteredServices : services.slice(0, 5)).length > 0 ? (
                (showList ? filteredServices : services.slice(0, 5)).map(service => (
                <ServiceCard key={service.id} service={service} />
                ))
            ) : (
                <div className="text-center py-12 flex flex-col items-center">
                    <div className="bg-gray-100 dark:bg-gray-800 w-20 h-20 rounded-full flex items-center justify-center mb-4 text-gray-400 dark:text-gray-500">
                        <Search className="w-8 h-8" />
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">Nenhum serviço encontrado</h3>
                    <p className="text-gray-500 dark:text-gray-400 mt-2 text-sm max-w-[200px]">
                        Não encontramos resultados para sua busca nesta região.
                    </p>
                    <button 
                        onClick={() => {setFilter(''); setSelectedCategory(null);}}
                        className="mt-6 text-primary font-bold text-sm"
                    >
                        Limpar filtros
                    </button>
                </div>
            )}
        </div>
      </div>
    </Layout>
  );
};

// 3. Service Details
const ServiceDetail: React.FC<PageProps> = ({ theme, toggleTheme }) => {
  const { id } = useParams();
  const [service, setService] = useState<ServiceJob | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // In a real app, we'd fetch specific ID. Here we filter the mock/fetched list
    const load = async () => {
      const all = await fetchServices();
      const found = all.find(s => s.id === id);
      setService(found || null);
      setLoading(false);
    };
    load();
  }, [id]);

  if (loading) return <Layout theme={theme} toggleTheme={toggleTheme}><div className="flex justify-center pt-20"><Loader2 className="animate-spin text-primary" /></div></Layout>;
  if (!service) return <Layout theme={theme} toggleTheme={toggleTheme}><div className="text-center pt-20 font-bold text-gray-500">Serviço não encontrado.</div></Layout>;

  const Icon = CATEGORY_ICONS[service.category];
  
  const handleWhatsApp = () => {
    const phone = "5511999999999"; 
    const msg = `Olá, vi seu anúncio "${service.title}" no TrampoFácil e gostaria de saber mais.`;
    window.open(`https://wa.me/${phone}?text=${encodeURIComponent(msg)}`, '_blank');
  };

  const handleCall = () => {
    window.location.href = `tel:5511999999999`;
  };

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="flex items-center gap-2 mb-4">
         <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <span className="font-bold text-gray-900 dark:text-white">Detalhes</span>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-sm overflow-hidden mb-6 border border-gray-100 dark:border-gray-700">
        <div className="h-32 bg-primary/10 dark:bg-purple-900/20 flex items-center justify-center">
          <Icon className="w-16 h-16 text-primary opacity-50" />
        </div>
        
        <div className="p-6">
           <div className="flex justify-between items-start mb-4">
                <div>
                    <h1 className="text-xl font-extrabold text-gray-900 dark:text-white leading-tight">{service.title}</h1>
                    <span className="inline-block mt-2 px-3 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold rounded-full">
                        {service.category}
                    </span>
                </div>
                <div className="text-right">
                    <div className="text-2xl font-extrabold text-primary">R$ {service.price}</div>
                    <div className="text-xs text-gray-400 font-bold uppercase">/{service.price_unit === 'hour' ? 'hora' : 'serviço'}</div>
                </div>
           </div>

           <div className="flex items-center gap-4 py-6 border-t border-gray-100 dark:border-gray-700">
             <div className="w-12 h-12 bg-gray-900 dark:bg-gray-700 text-white rounded-full flex items-center justify-center font-bold text-lg shadow-md">
                {service.provider_name ? service.provider_name.charAt(0) : 'U'}
             </div>
             <div>
                <p className="text-xs text-gray-500 dark:text-gray-400 font-medium">Profissional</p>
                <p className="font-bold text-gray-900 dark:text-white">{service.provider_name}</p>
                <div className="flex items-center text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                    <MapPin className="w-3 h-3 mr-1" /> {service.distance} km de distância
                </div>
             </div>
           </div>

           <div className="bg-gray-50 dark:bg-gray-900/50 p-5 rounded-2xl">
             <h3 className="text-xs font-bold text-gray-900 dark:text-white uppercase tracking-wide mb-2 opacity-70">Sobre o serviço</h3>
             <p className="text-gray-700 dark:text-gray-300 leading-relaxed text-sm">
               {service.description}
             </p>
           </div>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-3 pb-6">
        <button 
          onClick={handleCall}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-white dark:bg-gray-800 border-2 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-white font-bold active:bg-gray-50 dark:active:bg-gray-700 transition-colors"
        >
          <Phone className="w-5 h-5" />
          Ligar
        </button>
        <button 
          onClick={handleWhatsApp}
          className="flex items-center justify-center gap-2 py-4 rounded-xl bg-primary text-white font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all hover:bg-purple-700"
        >
          <MessageCircle className="w-5 h-5" />
          WhatsApp
        </button>
      </div>
    </Layout>
  );
};

// 4. Add Service
const AddService: React.FC<{ user: UserProfile | null; userLocation: any } & PageProps> = ({ user, userLocation, theme, toggleTheme }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: ServiceCategory.HOME_REPAIR,
    price: '',
    price_unit: 'job' as 'job' | 'hour'
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userLocation) {
      alert("Precisamos da sua localização para publicar.");
      return;
    }
    setSubmitting(true);
    try {
      await createService({
        title: formData.title,
        description: formData.description,
        category: formData.category,
        price: parseFloat(formData.price),
        price_unit: formData.price_unit,
        latitude: userLocation.lat,
        longitude: userLocation.lng,
        provider_id: user?.id || 'demo_user'
      }, user?.id || 'demo_user');
      
      navigate('/');
    } catch (err) {
      alert('Erro ao criar serviço');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="mb-6">
        <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">Anunciar Serviço</h2>
        <p className="text-gray-500 dark:text-gray-400 font-medium text-sm">Divulgue seu trabalho para a vizinhança.</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5 bg-white dark:bg-gray-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-gray-700">
        <div>
          <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Título do Anúncio</label>
          <input
            required
            type="text"
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Ex: Eletricista 24h"
            value={formData.title}
            onChange={e => setFormData({...formData, title: e.target.value})}
          />
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Categoria</label>
          <select
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all"
            value={formData.category}
            onChange={e => setFormData({...formData, category: e.target.value as ServiceCategory})}
          >
            {Object.values(ServiceCategory).map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Descrição</label>
          <textarea
            required
            rows={4}
            className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition-all placeholder-gray-400 dark:placeholder-gray-500"
            placeholder="Descreva sua experiência e o serviço..."
            value={formData.description}
            onChange={e => setFormData({...formData, description: e.target.value})}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Valor (R$)</label>
            <input
              required
              type="number"
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent outline-none"
              placeholder="0.00"
              value={formData.price}
              onChange={e => setFormData({...formData, price: e.target.value})}
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-900 dark:text-gray-300 uppercase tracking-wide mb-2">Cobrança</label>
            <select
              className="w-full p-4 rounded-xl bg-gray-50 dark:bg-gray-900 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary outline-none"
              value={formData.price_unit}
              onChange={e => setFormData({...formData, price_unit: e.target.value as any})}
            >
              <option value="job">Por Serviço</option>
              <option value="hour">Por Hora</option>
            </select>
          </div>
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="w-full bg-primary text-white py-4 rounded-xl font-bold shadow-lg shadow-primary/30 active:scale-[0.98] transition-all disabled:opacity-70 flex items-center justify-center gap-2 hover:bg-purple-700"
        >
          {submitting ? <Loader2 className="animate-spin" /> : 'Publicar Anúncio'}
        </button>
      </form>
    </Layout>
  );
};

// 5. Auth Pages (Updated with Welcome Screen and Custom Logo)
const Login: React.FC<{ setAuth: any }> = ({ setAuth }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showInput, setShowInput] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    setTimeout(() => {
        setAuth({
            user: { id: 'demo_id', name: 'Marcelo', email: 'marcelo@trampo.com', phone: '1199999999' },
            loading: false,
            session: { access_token: 'fake' }
        });
        navigate('/');
    }, 1000);
  };

  // High-Resolution Vector Cutout Logo - HOUSE + TF Monogram
  const FinalLogo = ({ className = "w-48 h-48" }) => (
    <div className={`relative flex items-center justify-center ${className}`}>
      {/* Main Logo: House + TF Cutout */}
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full drop-shadow-2xl relative z-10">
        <defs>
          <mask id="cutout-mask">
            {/* Base: White (Visible) - House Shape */}
            <rect width="24" height="24" fill="black" />
            <path d="M2 12L12 2L22 12H19V21H5V12H2Z" fill="white" />
            
            {/* Cutout: Joined TF Monogram (Black = Transparent) */}
            {/* T part */}
            <rect x="10" y="8" width="4" height="10" fill="black" /> {/* Stem */}
            <rect x="6" y="8" width="12" height="3" fill="black" /> {/* Top Bar */}
            
            {/* F part (Right side extension) */}
            <rect x="14" y="13" width="4" height="2.5" fill="black" /> {/* F Middle Bar */}
          </mask>
        </defs>
        
        {/* Final Render */}
        <rect width="24" height="24" fill="white" mask="url(#cutout-mask)" />
      </svg>
    </div>
  );

  // Welcome Screen
  if (!showInput) {
      return (
          <div className="min-h-screen bg-gradient-to-br from-purple-800 to-purple-600 flex flex-col items-center justify-center p-6 text-center text-white relative overflow-hidden">
              {/* Background pattern */}
              <div className="absolute inset-0 overflow-hidden opacity-30">
                  <div className="absolute top-10 right-10 w-96 h-96 bg-purple-500 rounded-full blur-3xl mix-blend-screen"></div>
                  <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-900 rounded-full blur-3xl mix-blend-multiply"></div>
                  {/* Faint network lines simulation */}
                  <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDQwIDQwIDQwIiBzdHlsZT0ib3BhY2l0eTogMC4wNSI+PHBhdGggZD0iTTAgNDBMNDAgMEgwVjQwWiIgZmlsbD0id2hpdGUiLz48L3N2Zz4=')]"></div>
              </div>

              <div className="flex-1 flex flex-col items-center justify-center z-10 w-full animate-fade-in-up">
                  <div className="mb-10 transform drop-shadow-2xl">
                      <FinalLogo />
                  </div>
                  <h1 className="text-5xl font-extrabold tracking-tight mb-2 drop-shadow-md">TrampoFácil</h1>
                  <p className="text-purple-100/90 font-medium max-w-[240px] leading-relaxed text-lg tracking-wide">
                    Conectando pessoas a oportunidades reais.
                  </p>
              </div>

              <div className="z-10 w-full mb-12 space-y-4 max-w-sm">
                  <button 
                    onClick={() => setShowInput(true)}
                    className="w-full bg-white text-purple-700 font-bold py-4 rounded-xl shadow-xl shadow-purple-900/20 active:scale-[0.98] transition-all text-lg hover:bg-gray-50"
                  >
                      Fazer Login
                  </button>
                  <button className="w-full bg-transparent border-2 border-white/40 text-white font-bold py-4 rounded-xl active:scale-[0.98] transition-all hover:bg-white/10 hover:border-white/60">
                      Criar Conta
                  </button>
              </div>
          </div>
      );
  }

  // Form Screen
  return (
    <div className="min-h-screen bg-white dark:bg-gray-900 flex flex-col items-center justify-center p-6 text-center relative overflow-hidden transition-colors duration-200">
       {/* Decorative circles */}
       <div className="absolute top-[-20%] right-[-20%] w-[80%] h-[40%] bg-primary/10 rounded-full blur-3xl pointer-events-none"></div>
       <div className="absolute bottom-[-10%] left-[-10%] w-[60%] h-[30%] bg-primary/5 rounded-full blur-3xl pointer-events-none"></div>

       <div className="w-full max-w-sm relative z-10 flex justify-start mb-4">
           <button onClick={() => setShowInput(false)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500 dark:text-gray-400">
               <ArrowLeft className="w-6 h-6" />
           </button>
       </div>

       <div className="bg-primary p-5 rounded-3xl mb-8 shadow-xl shadow-primary/20 rotate-0 transform hover:rotate-0 transition-all flex items-center justify-center mx-auto">
          {/* Reuse logo in small version */}
          <div className="w-16 h-16">
             <FinalLogo className="w-full h-full" />
          </div>
       </div>
       
       <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white mb-2">Bem-vindo</h1>
       <p className="text-gray-500 dark:text-gray-400 mb-10 max-w-xs font-medium">Insira seus dados para continuar.</p>

       <form onSubmit={handleLogin} className="w-full max-w-sm space-y-4 relative z-10 mx-auto">
          <div className="space-y-4">
            <input type="email" placeholder="E-mail" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900 transition-all" required />
            <input type="password" placeholder="Senha" className="w-full p-4 bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white outline-none focus:ring-2 focus:ring-primary focus:bg-white dark:focus:bg-gray-900 transition-all" required />
          </div>
          <button disabled={loading} className="w-full bg-primary text-white font-bold py-4 rounded-xl shadow-xl shadow-primary/30 active:scale-95 transition-all hover:bg-purple-700">
             {loading ? 'Entrando...' : 'Entrar'}
          </button>
       </form>
       <button className="mt-8 text-primary font-bold text-sm hover:underline">Esqueci minha senha</button>
    </div>
  );
};

// 6. Profile
const Profile: React.FC<{ user: UserProfile | null; onLogout: () => void } & PageProps> = ({ user, onLogout, theme, toggleTheme }) => {
    const [settingsOpen, setSettingsOpen] = useState(false);
    const [radius, setRadius] = useState(30);

    return (
        <Layout theme={theme} toggleTheme={toggleTheme}>
            <div className="flex flex-col items-center py-10">
                <div className="w-24 h-24 bg-primary text-white rounded-full flex items-center justify-center text-3xl font-bold mb-4 shadow-lg shadow-primary/30 border-4 border-white dark:border-gray-800 transition-colors">
                    {user?.name?.charAt(0) || 'U'}
                </div>
                <h2 className="text-2xl font-extrabold text-gray-900 dark:text-white">{user?.name || 'Visitante'}</h2>
                <p className="text-gray-500 dark:text-gray-400 font-medium">{user?.email || 'email@exemplo.com'}</p>
                <div className="flex items-center gap-2 mt-3 text-sm text-gray-400 dark:text-gray-500 bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
                    <MapPin className="w-3 h-3" /> Brasília, DF
                </div>
            </div>

            <div className="space-y-3">
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:border-primary/20 transition-colors cursor-pointer">
                    <span className="text-gray-900 dark:text-white font-bold text-sm">Meus Anúncios</span>
                    <span className="bg-primary/10 dark:bg-purple-900/30 text-primary dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">0</span>
                </div>
                <div className="bg-white dark:bg-gray-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 flex justify-between items-center hover:border-primary/20 transition-colors cursor-pointer">
                    <span className="text-gray-900 dark:text-white font-bold text-sm">Serviços Contratados</span>
                    <span className="bg-primary/10 dark:bg-purple-900/30 text-primary dark:text-purple-300 px-3 py-1 rounded-full text-xs font-bold">0</span>
                </div>
                
                {/* Configurações with Radius Slider and Theme Toggle */}
                <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden transition-all">
                    <div 
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        className="p-5 flex justify-between items-center hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer"
                    >
                        <div className="flex items-center gap-3">
                            <span className="text-gray-900 dark:text-white font-bold text-sm">Configurações</span>
                        </div>
                        {settingsOpen ? <ChevronDown className="w-5 h-5 text-primary" /> : <ChevronRight className="w-5 h-5 text-gray-300 dark:text-gray-600" />}
                    </div>
                    
                    {settingsOpen && (
                        <div className="p-5 pt-0 bg-white dark:bg-gray-800 border-t border-gray-50 dark:border-gray-700">
                            
                            {/* Theme Toggle (Inside Settings too) */}
                            <div className="flex justify-between items-center py-4 border-b border-gray-100 dark:border-gray-700">
                                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-xs uppercase tracking-wide">
                                    {theme === 'dark' ? <Moon className="w-4 h-4 text-purple-400" /> : <Sun className="w-4 h-4 text-orange-400" />}
                                    Modo Escuro
                                </div>
                                <button 
                                    onClick={toggleTheme}
                                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 dark:focus:ring-offset-gray-900 ${theme === 'dark' ? 'bg-primary' : 'bg-gray-200'}`}
                                >
                                    <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${theme === 'dark' ? 'translate-x-6' : 'translate-x-1'}`} />
                                </button>
                            </div>

                            <div className="bg-gray-50 dark:bg-gray-900/50 rounded-xl p-4 mt-4">
                                <div className="flex justify-between items-center mb-3">
                                    <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300 font-medium text-xs uppercase tracking-wide">
                                        <SlidersHorizontal className="w-4 h-4" />
                                        Raio de Distância
                                    </div>
                                    <span className="text-primary font-bold text-sm">{radius} km</span>
                                </div>
                                <input 
                                    type="range" 
                                    min="1" 
                                    max="100" 
                                    value={radius} 
                                    onChange={(e) => setRadius(parseInt(e.target.value))}
                                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-primary"
                                />
                                <div className="flex justify-between text-[10px] text-gray-400 mt-2 font-medium">
                                    <span>1 km</span>
                                    <span>100 km</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            <button 
                onClick={onLogout}
                className="w-full mt-10 flex items-center justify-center gap-2 text-red-600 font-bold py-4 rounded-xl hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors border border-transparent hover:border-red-100 dark:hover:border-red-900/30"
            >
                <LogOut className="w-5 h-5" />
                Sair da conta
            </button>
        </Layout>
    );
};

// 7. Training Page (New)
const Training: React.FC<PageProps> = ({ theme, toggleTheme }) => {
  const navigate = useNavigate();
  return (
    <Layout theme={theme} toggleTheme={toggleTheme}>
      <div className="flex items-center gap-2 mb-6">
         <button onClick={() => navigate(-1)} className="p-2 -ml-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-200">
            <ArrowLeft className="w-5 h-5" />
         </button>
         <span className="font-bold text-gray-900 dark:text-white text-lg">Cursos e Treinamentos</span>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-2xl p-8 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center text-center">
        <div className="bg-primary/10 w-24 h-24 rounded-full flex items-center justify-center mb-6">
            <GraduationCap className="w-12 h-12 text-primary" />
        </div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">Área de Aprendizado</h2>
        <p className="text-gray-500 dark:text-gray-400 mb-6 max-w-xs">
            Em breve você terá acesso a conteúdos exclusivos para aprimorar seus serviços e gestão.
        </p>
        <button disabled className="bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 font-bold py-3 px-8 rounded-xl cursor-not-allowed">
            Aguarde Novidades
        </button>
      </div>
    </Layout>
  );
};

// App Main Component
const App: React.FC = () => {
    const [auth, setAuth] = useState<AuthState>({
        user: null,
        loading: true,
        session: null
    });
    const [userLocation, setUserLocation] = useState<{lat: number; lng: number} | null>(null);
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('theme') || 'light';
        }
        return 'light';
    });

    useEffect(() => {
        // Theme Management
        const root = window.document.documentElement;
        root.classList.remove('light', 'dark');
        root.classList.add(theme);
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    useEffect(() => {
        // Try to load from local storage
        const storedAuth = localStorage.getItem('trampo_auth');
        if (storedAuth) {
            try {
                setAuth(JSON.parse(storedAuth));
            } catch (e) {
                console.error("Failed to parse auth", e);
                setAuth(prev => ({ ...prev, loading: false }));
            }
        } else {
            setAuth(prev => ({ ...prev, loading: false }));
        }

        // Get location
        getCurrentLocation()
            .then(loc => {
                setUserLocation({ lat: loc.latitude, lng: loc.longitude });
            })
            .catch(err => {
                console.log("Location denied or error", err);
                // Default location (Sao Paulo) if denied
                setUserLocation({ lat: -23.550520, lng: -46.633308 }); 
            });
    }, []);

    const handleLogin = (authData: AuthState) => {
        setAuth(authData);
        localStorage.setItem('trampo_auth', JSON.stringify(authData));
    };

    const handleLogout = () => {
        const newState = { user: null, loading: false, session: null };
        setAuth(newState);
        localStorage.removeItem('trampo_auth');
    };

    if (auth.loading) {
        return (
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                <Loader2 className="w-8 h-8 text-primary animate-spin" />
            </div>
        );
    }

    return (
        <HashRouter>
            <Routes>
                <Route path="/login" element={
                    !auth.user ? <Login setAuth={handleLogin} /> : <Navigate to="/" />
                } />
                
                <Route path="/" element={
                    auth.user ? <Home user={auth.user} userLocation={userLocation} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />
                
                <Route path="/categories" element={
                    auth.user ? <AllCategories theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />
                
                <Route path="/training" element={
                    auth.user ? <Training theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />

                <Route path="/service/:id" element={
                    auth.user ? <ServiceDetail theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />
                
                <Route path="/add" element={
                    auth.user ? <AddService user={auth.user} userLocation={userLocation} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />
                
                <Route path="/profile" element={
                    auth.user ? <Profile user={auth.user} onLogout={handleLogout} theme={theme} toggleTheme={toggleTheme} /> : <Navigate to="/login" />
                } />
                
                <Route path="*" element={<Navigate to="/" />} />
            </Routes>
        </HashRouter>
    );
};

export default App;