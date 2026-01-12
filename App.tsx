import React, { useState, useEffect } from 'react';
import { HashRouter, Routes, Route, Link, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Home } from './components/pages/Home';
import { NewsPage } from './components/pages/NewsContent';
import { AgendaEventos } from './components/pages/AgendaEventos';
import { Categories } from './components/pages/NewsContent';
import { ArticleDetail } from './components/pages/ArticleDetail';
import { Search, Profile } from './components/pages/UserProfile';
import { FacebrasilClub } from './components/pages/FacebrasilClub';
import { BalcaoUSA, BalcaoWelcome } from './components/pages/BalcaoUSA';
import { MagazinesArchive } from './components/pages/MagazinesArchive';
import { SempreAlerta } from './components/pages/SempreAlerta';
import { BrVIP } from './components/pages/BrVIP';

// Admin Components
import { AdManager } from './components/admin/AdManager';
import { ExternalCreatorAPI } from './components/admin/ExternalCreatorAPI';
import { NewsletterManager } from './components/admin/NewsletterManager';
import { TopicGenerator } from './components/admin/TopicGenerator';

// --- Components ---

const Logo: React.FC = () => (
  <div className="flex items-center gap-1.5">
    <div className="size-8 rounded-xl bg-primary flex items-center justify-center shadow-lg shadow-primary/20 rotate-3 group-hover:rotate-0 transition-transform">
      <span className="material-symbols-outlined text-white text-lg filled">bolt</span>
    </div>
    <span className="text-2xl font-sans font-black tracking-tighter text-slate-900 dark:text-white">
      Facebrasil<span className="text-primary">.app</span>
    </span>
  </div>
);

const Header: React.FC<{ onMenuClick: () => void }> = ({ onMenuClick }) => {
  const statsStr = localStorage.getItem('userStats') || '{"points":200,"facetas":5}';
  const stats = JSON.parse(statsStr);

  return (
    <header className="sticky top-0 z-40 w-full bg-surface-light/95 dark:bg-background-dark/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800">
      <div className="flex items-center justify-between px-4 h-16 max-w-2xl mx-auto">
        <div className="flex items-center gap-3">
          <button onClick={onMenuClick} className="flex items-center justify-center w-10 h-10 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <span className="material-symbols-outlined">menu</span>
          </button>
          <Link to="/" className="flex items-center">
            <Logo />
          </Link>
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
    <nav className="fixed bottom-0 w-full bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-xl border-t border-slate-200/50 dark:border-slate-800/50 z-50">
      <div className="flex items-center justify-around h-20 max-w-2xl mx-auto px-4 pb-4">
        <Link to="/" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/') ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isActive('/') ? 'filled' : ''}`}>home</span>
          <span className="text-[9px] font-black uppercase tracking-[1px]">Início</span>
          {isActive('/') && <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />}
        </Link>
        <Link to="/news" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/news') ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isActive('/news') ? 'filled' : ''}`}>newspaper</span>
          <span className="text-[9px] font-black uppercase tracking-[1px]">News</span>
          {isActive('/news') && <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />}
        </Link>
        <Link to="/balcao" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/balcao') ? 'text-emerald-600 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isActive('/balcao') ? 'filled' : ''}`}>dashboard_customize</span>
          <span className="text-[9px] font-black uppercase tracking-[1px]">Balcão</span>
          {isActive('/balcao') && <div className="absolute -top-1 w-1 h-1 bg-emerald-600 rounded-full animate-pulse" />}
        </Link>
        <Link to="/clube" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/clube') ? 'text-yellow-500 scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isActive('/clube') ? 'filled' : ''}`}>workspace_premium</span>
          <span className="text-[9px] font-black uppercase tracking-[1px]">Club</span>
          {isActive('/clube') && <div className="absolute -top-1 w-1 h-1 bg-yellow-500 rounded-full animate-pulse" />}
        </Link>
        <Link to="/profile" className={`relative flex flex-col items-center gap-1 transition-all duration-300 ${isActive('/profile') ? 'text-primary scale-110' : 'text-slate-400 hover:text-slate-600'}`}>
          <span className={`material-symbols-outlined text-[26px] ${isActive('/profile') ? 'filled' : ''}`}>person</span>
          <span className="text-[9px] font-black uppercase tracking-[1px]">Perfil</span>
          {isActive('/profile') && <div className="absolute -top-1 w-1 h-1 bg-primary rounded-full animate-pulse" />}
        </Link>
      </div>
    </nav>
  );
};

const Drawer: React.FC<{ isOpen: boolean; onClose: () => void }> = ({ isOpen, onClose }) => {
  const handleHomeClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    onClose();
  };

  return (
    <>
      <div className={`fixed inset-0 bg-black/50 z-[60] transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose} />
      <aside className={`fixed top-0 left-0 h-full w-72 bg-white dark:bg-background-dark z-[70] transition-transform duration-300 ease-out transform ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-8 flex flex-col h-full overflow-y-auto no-scrollbar">
          <div className="mb-10 flex items-center">
            <Link to="/" onClick={handleHomeClick}>
              <Logo />
            </Link>
          </div>
          <nav className="flex flex-col gap-1">
            <Link to="/" onClick={handleHomeClick} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">home</span> Início</Link>
            <Link to="/news" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">newspaper</span> News</Link>
            <Link to="/brvip" onClick={onClose} className="py-3 px-4 rounded-2xl bg-amber-50 dark:bg-amber-900/10 text-amber-700 dark:text-amber-400 font-bold flex items-center gap-3"><span className="material-symbols-outlined filled">stars</span> BrVIP</Link>
            <Link to="/sempre-alerta" onClick={onClose} className="py-3 px-4 rounded-2xl bg-red-50 dark:bg-red-900/10 text-red-600 dark:text-red-400 font-bold flex items-center gap-3"><span className="material-symbols-outlined filled">emergency</span> Sempre Alerta</Link>
            <Link to="/agenda" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-indigo-600"><span className="material-symbols-outlined filled">calendar_month</span> Agenda de Eventos</Link>
            <Link to="/balcao" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-green-600"><span className="material-symbols-outlined filled">dashboard_customize</span> BalcãoUSA</Link>
            <Link to="/clube" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-yellow-600"><span className="material-symbols-outlined filled">toll</span> Club de Vantagens</Link>

            <div className="my-4 border-t border-slate-100 dark:border-slate-800 pt-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest ml-4 mb-2 block">Administração</span>
              <Link to="/admin/ads" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-slate-600"><span className="material-symbols-outlined">ads_click</span> Gestão de Ads</Link>
              <Link to="/admin/api" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-purple-600"><span className="material-symbols-outlined">api</span> API External</Link>
              <Link to="/admin/newsletter" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-sky-600"><span className="material-symbols-outlined">mail</span> Newsletter</Link>
              <Link to="/admin/topics" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3 text-orange-600"><span className="material-symbols-outlined">auto_awesome</span> Gerador de Pautas</Link>
            </div>

            <div className="my-2 border-t border-slate-100 dark:border-slate-800"></div>
            <Link to="/magazines" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">library_books</span> Banca Digital</Link>
            <Link to="/categories" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">grid_view</span> Categorias</Link>
            <Link to="/profile" onClick={onClose} className="py-3 px-4 rounded-2xl hover:bg-slate-100 dark:hover:bg-slate-800 font-bold flex items-center gap-3"><span className="material-symbols-outlined">person</span> Meu Perfil</Link>
          </nav>
          <div className="mt-auto p-4 bg-slate-50 dark:bg-slate-800/50 rounded-3xl text-[10px] text-slate-400 font-bold uppercase tracking-widest text-center">
            Facebrasil v3.0-RC
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
    const statsStr = localStorage.getItem('userStats') || '{"points":200,"facetas":5,"articlesRead":[],"lastCheckIn":""}';
    const stats = JSON.parse(statsStr);
    if (stats.lastCheckIn !== today) {
      stats.points += 5;
      stats.lastCheckIn = today;
      localStorage.setItem('userStats', JSON.stringify(stats));
    }
  }, []);

  return (
    <AuthProvider>
      <HashRouter>
        <div className="min-h-screen flex flex-col bg-background-light dark:bg-background-dark text-slate-900 dark:text-slate-100 font-sans">
          <Header onMenuClick={() => setIsDrawerOpen(true)} />
          <Drawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)} />
          <div className="flex-1 pb-24">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/news" element={<NewsPage />} />
              <Route path="/agenda" element={<AgendaEventos />} />
              <Route path="/categories" element={<Categories />} />
              <Route path="/article/:id" element={<ArticleDetail />} />
              <Route path="/search" element={<div className="pt-2"><Search /></div>} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/clube" element={<FacebrasilClub />} />
              <Route path="/balcao" element={<BalcaoUSA />} />
              <Route path="/balcao/welcome" element={<BalcaoWelcome />} />
              <Route path="/magazines" element={<MagazinesArchive />} />
              <Route path="/sempre-alerta" element={<SempreAlerta />} />
              <Route path="/brvip" element={<BrVIP />} />

              {/* Admin Routes */}
              <Route path="/admin/ads" element={<AdManager />} />
              <Route path="/admin/api" element={<ExternalCreatorAPI />} />
              <Route path="/admin/newsletter" element={<NewsletterManager />} />
              <Route path="/admin/topics" element={<TopicGenerator />} />
            </Routes>
          </div>
          <BottomNav />
        </div>
      </HashRouter>
    </AuthProvider>
  );
};

export default App;
