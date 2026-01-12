import React, { useState, useMemo } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ARTICLES } from '../../constants';
import { ArticleCard } from '../ArticleCard';

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
    const stats = JSON.parse(localStorage.getItem('userStats') || '{"points":200,"facetas":5,"level":"Bronze"}');
    return (
        <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-6 pb-24">
            <div className="flex items-center gap-6 p-8 bg-white dark:bg-slate-800 rounded-[40px] shadow-sm border border-slate-100 dark:border-slate-700">
                <div className="size-20 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden border-2 border-primary"><span className="material-symbols-outlined text-4xl text-primary">person</span></div>
                <div><h2 className="text-2xl font-display font-bold">Membro Premium</h2><span className="px-3 py-1 rounded-full bg-yellow-400 text-yellow-900 font-black text-[10px] tracking-[2px]">NÍVEL {stats.level}</span></div>
            </div>
            <div className="grid grid-cols-2 gap-4">
                <div className="bg-primary text-white p-6 rounded-[32px] flex flex-col gap-1 shadow-xl"><p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo de Pontos</p><h3 className="text-3xl font-black">{stats.points}</h3></div>
                <div className="bg-yellow-500 text-slate-900 p-6 rounded-[32px] flex flex-col gap-1 shadow-xl"><p className="text-[10px] opacity-80 uppercase font-black tracking-widest">Saldo FACETAS</p><h3 className="text-3xl font-black">{stats.facetas}</h3></div>
            </div>
        </main>
    );
};
