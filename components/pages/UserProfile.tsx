import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARTICLES } from '../../constants';
import { ArticleCard } from '../ArticleCard';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export const Search: React.FC = () => {
    const [query, setQuery] = useState('');
    const [searchParams] = useSearchParams();
    const [selectedCity, setSelectedCity] = useState<string | null>(null);
    const catParam = searchParams.get('category');
    const navigate = useNavigate();

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
                            <button onClick={() => setSelectedCity(null)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shrink-0 ${!selectedCity ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>Todas</button>
                            {availableCities.map(city => (
                                <button key={city} onClick={() => setSelectedCity(city)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all shrink-0 ${selectedCity === city ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>{city}</button>
                            ))}
                        </div>
                    </div>
                )}
            </div>
            <div className="flex flex-col gap-4">
                {filtered.map(a => <ArticleCard key={a.id} article={a} onClick={id => navigate(`/article/${id}`)} />)}
            </div>
        </div>
    );
};

export const Profile: React.FC = () => {
    const { user, loading, signOut } = useAuth();
    const navigate = useNavigate();

    const handleLogin = async () => {
        const email = window.prompt("Digite seu email para o Magic Link:");
        if (email) {
            const { error } = await supabase.auth.signInWithOtp({ email });
            if (error) alert(error.message);
            else alert("Verifique seu email para o link de acesso!");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando perfil...</div>;

    if (!user) {
        return (
            <main className="w-full max-w-2xl mx-auto p-8 flex flex-col items-center justify-center gap-6 min-h-[60vh]">
                <div className="size-24 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center">
                    <span className="material-symbols-outlined text-5xl text-slate-400">person_off</span>
                </div>
                <div className="text-center">
                    <h2 className="text-2xl font-display font-bold">Acesse sua conta</h2>
                    <p className="text-slate-500 text-sm">Entre para salvar seus pontos e resgatar benefícios.</p>
                </div>
                <button
                    onClick={handleLogin}
                    className="w-full py-4 bg-primary text-white font-black rounded-2xl shadow-xl shadow-primary/20 active:scale-95 transition-all"
                >
                    ENTRAR COM EMAIL
                </button>
            </main>
        );
    }

    return (
        <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-6 p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700 relative overflow-hidden">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary">
                    {user.avatar_url ? (
                        <img src={user.avatar_url} alt={user.full_name || 'User'} className="w-full h-full object-cover" />
                    ) : (
                        <span className="material-symbols-outlined text-4xl text-primary">person</span>
                    )}
                </div>
                <div className="flex-1">
                    <h2 className="text-2xl font-display font-bold">{user.full_name || user.username || 'Membro'}</h2>
                    <span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 font-black text-[10px] tracking-[2px] uppercase">
                        NÍVEL {user.level}
                    </span>
                </div>
                <button onClick={() => signOut()} className="absolute top-4 right-4 text-slate-400 hover:text-red-500">
                    <span className="material-symbols-outlined text-[20px]">logout</span>
                </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary text-white p-6 rounded-[32px] flex flex-col gap-1 shadow-xl">
                    <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo de Pontos</p>
                    <h3 className="text-3xl font-black">{user.points}</h3>
                </div>
                <div className="bg-yellow-500 text-slate-900 p-6 rounded-[32px] flex flex-col gap-1 shadow-xl">
                    <p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo FACETAS</p>
                    <h3 className="text-3xl font-black">{user.facetas}</h3>
                </div>
            </div>

            <div className="mt-4 p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white">
                <h4 className="font-display font-bold text-xl mb-2">Conquiste mais Facetas</h4>
                <p className="text-sm text-slate-400 mb-6">Continue lendo matérias e participando da comunidade para subir de nível.</p>
                <div className="flex flex-col gap-3">
                    <div className="flex justify-between text-[10px] font-black uppercase tracking-widest">
                        <span>Progresso Prata</span>
                        <span>{Math.min(user.points, 300)} / 300 PTS</span>
                    </div>
                    <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                        <div className="h-full bg-primary" style={{ width: `${Math.min((user.points / 300) * 100, 100)}%` }} />
                    </div>
                </div>
            </div>
        </main>
    );
};
