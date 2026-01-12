
import React, { useState, useEffect, useMemo } from 'react';
import { HashRouter, Routes, Route, Link, useNavigate, useParams, useLocation, useSearchParams } from 'react-router-dom';
import { ArticleCard } from './components/ArticleCard';
import { MagazineCard } from './components/MagazineCard';
import { ARTICLES, MAGAZINES as INITIAL_MAGAZINES, AUTHORS, BALCAO_MOCK, EVENTS_MOCK } from './constants';
import { geminiService } from './services/geminiService';
import { Article, MagazineIssue, UserStats, Reward, BalcaoPost, CommunityEvent } from './types';

// --- CONFIG ---
const COST_POST = 50;
const REWARD_REPLY = 5;
const CONVERSION_RATE = 10; // 10 points = 1 Faceta

// --- Helpers ---
const getMagazines = (): MagazineIssue[] => {
  const localMagazines = JSON.parse(localStorage.getItem('customMagazines') || '[]');
  return [...INITIAL_MAGAZINES, ...localMagazines].sort((a, b) => String(b.year).localeCompare(String(a.year)));
};

const getUserStats = (): UserStats => {
  const defaults: UserStats = { points: 200, facetas: 5, level: 'Bronze', articlesRead: [], lastCheckIn: '' };
  return JSON.parse(localStorage.getItem('userStats') || JSON.stringify(defaults));
};

const saveUserStats = (stats: UserStats) => {
  if (stats.points > 2000) stats.level = 'Diamante';
  else if (stats.points > 1000) stats.level = 'Ouro';
  else if (stats.points > 300) stats.level = 'Prata';
  else stats.level = 'Bronze';
  localStorage.setItem('userStats', JSON.stringify(stats));
};

const getBalcaoPosts = (): BalcaoPost[] => {
  const local = JSON.parse(localStorage.getItem('balcaoPosts') || '[]');
  return [...BALCAO_MOCK, ...local];
};

const getEvents = (): CommunityEvent[] => {
  const local = JSON.parse(localStorage.getItem('communityEvents') || '[]');
  return [...EVENTS_MOCK, ...local].sort((a, b) => a.date.localeCompare(b.date));
};

// --- Components ---

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const stats = getUserStats();
  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="text-2xl font-sans font-extrabold tracking-tighter text-primary">Facebrasil</Link>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/clube" className="flex flex-col items-end">
            <div className="flex items-center gap-1 text-[10px] font-bold text-yellow-600 dark:text-yellow-400">
              <span className="material-symbols-outlined text-[14px] filled">toll</span>
              {stats.facetas} FCT
            </div>
            <div className="flex items-center gap-1 text-[9px] font-bold text-slate-400">
              <span className="material-symbols-outlined text-[12px] filled">stars</span>
              {stats.points} PTS
            </div>
          </Link>
          <Link to="/search" className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">search</span>
          </Link>
        </div>
      </div>
    </header>
  );
};

const BottomNav: React.FC = () => {
  const location = useLocation();
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="fixed bottom-0 w-full bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 z-50">
      <div className="flex items-center justify-around h-16 max-w-2xl mx-auto px-2">
        <Link to="/" className={`flex flex-col items-center gap-1 w-14 ${isActive('/') ? 'text-primary' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/') ? 'filled' : ''}`}>home</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Início</span>
        </Link>
        <Link to="/news" className={`flex flex-col items-center gap-1 w-14 ${isActive('/news') ? 'text-primary' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/news') ? 'filled' : ''}`}>newspaper</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">News</span>
        </Link>
        <Link to="/balcao" className={`flex flex-col items-center gap-1 w-14 ${isActive('/balcao') ? 'text-green-600' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/balcao') ? 'filled' : ''}`}>dashboard_customize</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Balcão</span>
        </Link>
        <Link to="/clube" className={`flex flex-col items-center gap-1 w-14 ${isActive('/clube') ? 'text-yellow-500' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/clube') ? 'filled' : ''}`}>workspace_premium</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Club</span>
        </Link>
        <Link to="/profile" className={`flex flex-col items-center gap-1 w-14 ${isActive('/profile') ? 'text-primary' : 'text-slate-400'}`}>
          <span className={`material-symbols-outlined text-[24px] ${isActive('/profile') ? 'filled' : ''}`}>person</span>
          <span className="text-[9px] font-bold uppercase tracking-widest">Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

// --- Pages ---

const AgendaEventos: React.FC = () => {
  const [events, setEvents] = useState(getEvents());
  const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newEvent, setNewEvent] = useState<Partial<CommunityEvent>>({ category: 'Social' });

  const filteredEvents = useMemo(() => {
    const now = new Date();
    return events.filter(e => {
      const eventDate = new Date(e.date);
      if (filter === 'week') {
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        return eventDate >= now && eventDate <= nextWeek;
      }
      if (filter === 'month') {
        return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
      }
      return true;
    });
  }, [events, filter]);

  const handleAddEvent = (e: React.FormEvent) => {
    e.preventDefault();
    const event: CommunityEvent = {
      id: `e-${Date.now()}`,
      title: newEvent.title || 'Sem título',
      description: newEvent.description || '',
      date: newEvent.date || new Date().toISOString().split('T')[0],
      time: newEvent.time || '00:00',
      location: newEvent.location || 'Não especificado',
      organizer: newEvent.organizer || 'Comunidade',
      category: newEvent.category as any
    };
    const updated = [...getEvents(), event];
    localStorage.setItem('communityEvents', JSON.stringify(updated.filter(ev => ev.id.startsWith('e-'))));
    setEvents(updated.sort((a, b) => a.date.localeCompare(b.date)));
    setShowAddModal(false);
  };

  return (
    <main className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col gap-6 animate-in fade-in duration-500">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-display font-bold italic">Agenda de Eventos</h2>
          <p className="text-slate-500 text-sm">O que acontece na comunidade brasileira.</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-primary text-white size-10 rounded-full flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">add</span></button>
      </div>

      <div className="flex gap-2">
        {(['all', 'week', 'month'] as const).map(f => (
          <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
            {f === 'all' ? 'Tudo' : f === 'week' ? 'Esta Semana' : 'Este Mês'}
          </button>
        ))}
      </div>

      <div className="flex flex-col gap-4">
        {filteredEvents.map(event => (
          <div key={event.id} className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
            <div className="flex flex-col items-center justify-center min-w-[60px] p-3 bg-primary/5 rounded-2xl">
              <span className="text-[10px] font-black text-primary uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
              <span className="text-2xl font-black">{new Date(event.date + 'T00:00:00').getDate()}</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-primary uppercase tracking-widest">{event.category}</span>
              <h4 className="font-display font-bold text-lg leading-tight">{event.title}</h4>
              <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {event.time}</span>
                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {event.location}</span>
              </div>
            </div>
          </div>
        ))}
        {filteredEvents.length === 0 && <p className="text-center py-20 text-slate-400 font-bold italic">Nenhum evento encontrado para este período.</p>}
      </div>

      {showAddModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
          <form onSubmit={handleAddEvent} className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col gap-4">
            <h4 className="text-2xl font-bold font-display italic">Novo Evento</h4>
            <input required placeholder="Nome do Evento" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({...newEvent, title: e.target.value})} />
            <div className="flex gap-2">
              <input type="date" required className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({...newEvent, date: e.target.value})} />
              <input type="time" required className="w-28 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({...newEvent, time: e.target.value})} />
            </div>
            <input required placeholder="Local (Cidade, Estado)" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({...newEvent, location: e.target.value})} />
            <select className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({...newEvent, category: e.target.value as any})}>
              <option value="Social">Social</option>
              <option value="Cultura">Cultura</option>
              <option value="Negócios">Negócios</option>
              <option value="Religioso">Religioso</option>
            </select>
            <div className="flex gap-2 mt-4">
              <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-sm bg-slate-100 dark:bg-slate-700 rounded-2xl">Cancelar</button>
              <button type="submit" className="flex-1 py-4 font-bold text-sm bg-primary text-white rounded-2xl">Cadastrar</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
};

const Categories: React.FC = () => {
  const navigate = useNavigate();
  const categoryConfig = [
    { name: 'Comunidade', icon: 'groups' },
    { name: 'Personalidades', icon: 'stars' },
    { name: 'Imigração', icon: 'travel_explore' },
    { name: 'Onde ir', icon: 'explore' },
    { name: 'Saúde', icon: 'medical_services' },
    { name: 'Tecnologia', icon: 'smart_toy' }
  ];

  return (
    <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1">
        <h2 className="text-3xl font-display font-bold italic">Categorias</h2>
        <p className="text-slate-500 text-sm">Explore os principais temas da Facebrasil.</p>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {categoryConfig.map(cat => (
          <button 
            key={cat.name}
            onClick={() => navigate(`/search?category=${cat.name}`)}
            className="p-8 rounded-[40px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center gap-4 hover:border-primary transition-all group shadow-sm active:scale-95"
          >
            <div className="size-16 rounded-3xl bg-primary/5 text-primary flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
              <span className="material-symbols-outlined text-3xl filled">{cat.icon}</span>
            </div>
            <span className="font-bold text-base">{cat.name}</span>
          </button>
        ))}
      </div>
    </main>
  );
};

// --- Standard News Page ---
const News: React.FC = () => {
  const navigate = useNavigate();
  return (
    <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 pb-24 animate-in fade-in duration-500">
      <div className="flex flex-col gap-1 border-b border-slate-100 dark:border-slate-800 pb-4">
        <h2 className="text-3xl font-display font-bold italic">Últimas News</h2>
        <p className="text-slate-500 text-sm">Notícias e atualidades para brasileiros nos EUA.</p>
      </div>
      <div className="flex flex-col gap-6">
        {ARTICLES.map(article => (
          <ArticleCard key={article.id} article={article} onClick={(id) => navigate(`/article/${id}`)} />
        ))}
      </div>
    </main>
  );
};

// --- Facebrasil Club ---
const FacebrasilClub: React.FC = () => {
  const [stats, setStats] = useState(getUserStats());
  const [converting, setConverting] = useState(false);

  const handleConvert = () => {
    if (stats.points < CONVERSION_RATE) {
      alert("Mínimo de 10 pontos para converter.");
      return;
    }
    setConverting(true);
    setTimeout(() => {
      const newFacetas = Math.floor(stats.points / CONVERSION_RATE);
      const remainingPoints = stats.points % CONVERSION_RATE;
      const newStats: UserStats = { ...stats, facetas: stats.facetas + newFacetas, points: remainingPoints };
      saveUserStats(newStats);
      setStats(newStats);
      setConverting(false);
      alert(`Sucesso! Você recebeu ${newFacetas} FACETAS.`);
    }, 1200);
  };

  return (
    <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8 pb-32">
      <h2 className="text-3xl font-display font-bold italic text-yellow-600">Facebrasil Club</h2>
      <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
        <div className="relative z-10">
          <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1">Status: Nível {stats.level}</p>
          <div className="flex justify-between items-end">
            <div>
              <p className="text-xs opacity-60">Saldos Digitais</p>
              <h3 className="text-4xl font-black text-yellow-400">{stats.facetas} <small className="text-lg">FCT</small></h3>
            </div>
            <div className="text-right">
              <p className="text-xl font-bold">{stats.points} <small className="text-xs opacity-60">PTS</small></p>
            </div>
          </div>
          <button onClick={handleConvert} disabled={converting} className="w-full mt-6 py-4 bg-yellow-500 text-slate-900 font-bold rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-50">
            {converting ? 'PROCESSANDO...' : 'CONVERTER PONTOS EM FACETAS'}
          </button>
        </div>
        <span className="absolute -bottom-20 -right-20 material-symbols-outlined text-[300px] opacity-10 filled text-white">toll</span>
      </div>
      <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
        <h4 className="text-xl font-display font-bold italic mb-4">O que é o Club?</h4>
        <p className="text-sm text-slate-500 leading-relaxed">Cada matéria lida gera pontos. Esses pontos podem ser convertidos em FACETAS, nossa moeda exclusiva usada para resgatar benefícios com nossos parceiros em toda a América.</p>
      </div>
    </main>
  );
};

const BalcaoUSA: React.FC = () => {
  const [posts] = useState(getBalcaoPosts());
  const stats = getUserStats();
  return (
    <main className="w-full max-w-2xl mx-auto p-4 pb-32 flex flex-col gap-6 animate-in fade-in duration-500">
      <h2 className="text-3xl font-display font-bold italic">BalcãoUSA</h2>
      <div className="grid gap-4">
        {posts.map(post => (
          <div key={post.id} className="p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-2">
            <span className="text-[9px] font-black uppercase tracking-widest text-primary">{post.category}</span>
            <h4 className="font-display font-bold text-xl leading-tight">{post.title}</h4>
            <p className="text-sm opacity-80 leading-relaxed line-clamp-2">{post.description}</p>
            <div className="flex justify-between items-center mt-3 pt-4 border-t border-slate-50 dark:border-slate-800">
               <span className="text-[10px] font-bold opacity-60">Por {post.author}</span>
               <button onClick={() => alert(`Contato: ${post.contact}`)} className="bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white text-[10px] font-bold px-4 py-2 rounded-full">Ver Contato</button>
            </div>
          </div>
        ))}
      </div>
    </main>
  );
};

const Home: React.FC = () => {
  const navigate = useNavigate();
  const featuredArticle = ARTICLES.find(a => a.isFeatured) || ARTICLES[0];
  return (
    <main className="w-full max-w-2xl mx-auto flex flex-col gap-6 pb-24 animate-in fade-in duration-500">
      <ArticleCard article={featuredArticle} variant="featured" onClick={(id) => navigate(`/article/${id}`)} />
      <section className="px-4 grid grid-cols-2 gap-4">
        <Link to="/agenda" className="relative h-36 rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-500 to-purple-700 p-6 text-white shadow-lg">
           <h3 className="text-xl font-bold font-display italic">Agenda</h3>
           <p className="text-[10px] opacity-70">Eventos da Semana</p>
           <span className="absolute bottom-4 right-4 material-symbols-outlined text-4xl opacity-20 filled">calendar_month</span>
        </Link>
        <Link to="/clube" className="relative h-36 rounded-[32px] overflow-hidden bg-gradient-to-br from-yellow-500 to-amber-700 p-6 text-white shadow-lg">
           <h3 className="text-xl font-bold font-display italic text-slate-900">Club</h3>
           <p className="text-[10px] opacity-70 text-slate-900">Minhas Facetas</p>
           <span className="absolute bottom-4 right-4 material-symbols-outlined text-4xl opacity-20 filled text-slate-900">toll</span>
        </Link>
      </section>
      <section className="px-4 flex flex-col gap-4">
        <h3 className="text-xl font-display font-bold italic border-b border-slate-100 dark:border-slate-800 pb-2">Matérias Recentes</h3>
        {ARTICLES.slice(1).map(article => (
          <ArticleCard key={article.id} article={article} onClick={(id) => navigate(`/article/${id}`)} />
        ))}
      </section>
    </main>
  );
};

const ArticleDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const article = useMemo(() => ARTICLES.find(a => a.id === id), [id]);
  useEffect(() => {
    if (id) {
      const stats = getUserStats();
      if (!stats.articlesRead.includes(id)) {
        const newStats = { ...stats, articlesRead: [...stats.articlesRead, id], points: stats.points + 10 };
        saveUserStats(newStats);
      }
    }
  }, [id]);
  if (!article) return null;
  return (
    <main className="w-full max-w-2xl mx-auto pb-32 animate-in fade-in duration-700">
      <div className="relative aspect-video w-full">
        <img src={article.imageUrl} className="w-full h-full object-cover" alt={article.title} />
        <button onClick={() => navigate(-1)} className="absolute top-4 left-4 size-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center"><span className="material-symbols-outlined">arrow_back</span></button>
      </div>
      <div className="px-6 -mt-10 relative z-10">
        <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-6">
          <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary w-fit uppercase tracking-widest">{article.category}</span>
          <h1 className="text-3xl font-display font-bold leading-tight">{article.title}</h1>
          <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line">{article.content}</p>
        </div>
      </div>
    </main>
  );
};

const Profile: React.FC = () => {
  const stats = getUserStats();
  return (
    <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 pb-24">
      <div className="flex items-center gap-6 p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
        <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary"><span className="material-symbols-outlined text-4xl text-primary">person</span></div>
        <div>
          <h2 className="text-2xl font-display font-bold">Membro Premium</h2>
          <span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 font-black text-[10px] tracking-[2px]">NÍVEL {stats.level}</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-primary text-white p-6 rounded-[32px] flex flex-col gap-1 shadow-xl">
           <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo de Pontos</p>
           <h3 className="text-3xl font-black">{stats.points}</h3>
        </div>
        <div className="bg-yellow-500 text-slate-900 p-6 rounded-[32px] flex flex-col gap-1 shadow-xl">
           <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo FACETAS</p>
           <h3 className="text-3xl font-black">{stats.facetas}</h3>
        </div>
      </div>
    </main>
  );
};

const MagazinesArchive: React.FC = () => {
  const magazines = getMagazines();
  return (
    <main className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col gap-6">
      <h2 className="text-3xl font-display font-bold italic">Banca Digital</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
        {magazines.map(mag => <MagazineCard key={mag.id} magazine={mag} />)}
      </div>
    </main>
  );
};

const Search: React.FC = () => {
  const [query, setQuery] = useState('');
  const [searchParams] = useSearchParams();
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  
  const catParam = searchParams.get('category');
  const navigate = useNavigate();

  // Calcula cidades disponíveis apenas para a categoria "Onde ir"
  const availableCities = useMemo(() => {
    if (catParam !== 'Onde ir') return [];
    const cities = ARTICLES
      .filter(a => a.category === 'Onde ir' && a.city)
      .map(a => a.city as string);
    return Array.from(new Set(cities)).sort();
  }, [catParam]);

  const filtered = useMemo(() => {
    let list = ARTICLES;
    if (catParam) {
      list = list.filter(a => a.category === catParam);
      if (catParam === 'Onde ir' && selectedCity) {
        list = list.filter(a => a.city === selectedCity);
      }
    }
    if (query.length > 2) list = list.filter(a => a.title.toLowerCase().includes(query.toLowerCase()));
    return list;
  }, [query, catParam, selectedCity]);

  return (
    <div className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6">
      <div className="flex flex-col gap-4">
        <input 
          type="text" 
          value={query} 
          onChange={e => setQuery(e.target.value)} 
          placeholder="Pesquisar notícias..." 
          className="w-full p-4 rounded-3xl border-slate-200 dark:border-slate-800 dark:bg-slate-900 outline-none focus:ring-2 focus:ring-primary shadow-sm" 
        />
        
        {catParam === 'Onde ir' && availableCities.length > 0 && (
          <div className="flex flex-col gap-2">
            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-1">Filtrar por Cidade</span>
            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
              <button 
                onClick={() => setSelectedCity(null)}
                className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shrink-0 ${!selectedCity ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
              >
                Todas
              </button>
              {availableCities.map(city => (
                <button 
                  key={city}
                  onClick={() => setSelectedCity(city)}
                  className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shrink-0 ${selectedCity === city ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="flex flex-col gap-4">
        {filtered.map(a => <ArticleCard key={a.id} article={a} onClick={id => navigate(`/article/${id}`)} />)}
        {filtered.length === 0 && (
          <div className="text-center py-20">
             <span className="material-symbols-outlined text-4xl text-slate-200 mb-2">search_off</span>
             <p className="text-slate-400 italic font-display">Nenhum resultado encontrado.</p>
          </div>
        )}
      </div>
    </div>
  );
};

const Drawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-background-dark z-[70] transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full">
          <div className="mb-10">
            <Link to="/" onClick={onClose} className="text-2xl font-sans font-extrabold tracking-tighter text-primary">Facebrasil</Link>
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">home</span> Início</Link>
            <Link to="/news" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">newspaper</span> News</Link>
            <Link to="/agenda" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-indigo-600"><span className="material-symbols-outlined filled">calendar_month</span> Agenda de Eventos</Link>
            <Link to="/balcao" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-green-600"><span className="material-symbols-outlined filled">dashboard_customize</span> BalcãoUSA</Link>
            <Link to="/clube" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-yellow-600"><span className="material-symbols-outlined filled text-yellow-500">toll</span> Facebrasil Club</Link>
            <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
            <Link to="/magazines" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">library_books</span> Banca Digital</Link>
            <Link to="/categories" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">grid_view</span> Categorias</Link>
            <Link to="/profile" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">person</span> Meu Perfil</Link>
          </nav>
          <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Facebrasil v2.7
          </div>
        </div>
      </aside>
    </>
  );
};

const App: React.FC = () => {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  useEffect(() => {
    const today = new Date().toISOString().split('T')[0];
    const stats = getUserStats();
    if (stats.lastCheckIn !== today) {
      const newStats = { ...stats, points: stats.points + 5, lastCheckIn: today };
      saveUserStats(newStats);
    }
  }, []);
  return (
    <HashRouter>
      <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
        <Header onMenuClick={() => setIsDrawerOpen(true)} />
        <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/news" element={<News />} />
          <Route path="/agenda" element={<AgendaEventos />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/article/:id" element={<ArticleDetail />} />
          <Route path="/search" element={<div className="pt-2"><Search /></div>} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/clube" element={<FacebrasilClub />} />
          <Route path="/balcao" element={<BalcaoUSA />} />
          <Route path="/magazines" element={<MagazinesArchive />} />
        </Routes>
        <BottomNav />
      </div>
    </HashRouter>
  );
};

export default App;
