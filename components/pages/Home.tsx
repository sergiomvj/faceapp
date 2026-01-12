import React, { useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArticleCard } from '../ArticleCard';
import { ARTICLES } from '../../constants';

export const Home: React.FC = () => {
    const navigate = useNavigate();
    const featuredArticle = ARTICLES.find(a => a.isFeatured) || ARTICLES[0];
    const quickHits = useMemo(() => ARTICLES.filter(a => !a.isFeatured).slice(0, 6), []);

    return (
        <main className="w-full max-w-2xl mx-auto flex flex-col gap-8 pb-32 animate-in fade-in duration-700">
            <section className="px-4 pt-4">
                <ArticleCard article={featuredArticle} variant="featured" onClick={(id) => navigate(`/article/${id}`)} />
            </section>

            <section className="flex flex-col gap-4">
                <div className="px-5 flex justify-between items-center">
                    <h3 className="text-xl font-display font-bold italic">Destaques Rápidos</h3>
                    <Link to="/news" className="text-[10px] font-black uppercase text-primary tracking-[2px] hover:underline underline-offset-4 transition-all">Ver Mais</Link>
                </div>
                <div className="flex gap-4 overflow-x-auto px-5 pb-4 no-scrollbar snap-x snap-mandatory">
                    {quickHits.map(article => (
                        <div key={article.id} className="w-36 shrink-0 snap-start">
                            <ArticleCard article={article} variant="story" onClick={(id) => navigate(`/article/${id}`)} />
                        </div>
                    ))}
                </div>
            </section>

            <section className="px-4 grid grid-cols-2 gap-4">
                {/* Agenda */}
                <Link to="/agenda" className="group relative h-40 rounded-[32px] overflow-hidden bg-gradient-to-br from-indigo-600 to-purple-800 p-6 text-white shadow-xl transition-all active:scale-95">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold font-display italic leading-tight">Agenda de Eventos</h3>
                            <p className="text-[10px] opacity-70 font-medium">Os melhores encontros</p>
                        </div>
                        <div className="bg-white/20 w-fit p-1.5 rounded-xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-[20px] block">trending_flat</span>
                        </div>
                    </div>
                    <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-7xl opacity-10 filled rotate-12 group-hover:scale-110 transition-transform duration-500">calendar_month</span>
                </Link>

                {/* Club */}
                <Link to="/clube" className="group relative h-40 rounded-[32px] overflow-hidden bg-gradient-to-br from-yellow-400 to-amber-600 p-6 text-white shadow-xl transition-all active:scale-95">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div className="text-slate-900">
                            <h3 className="text-lg font-bold font-display italic leading-tight">Club Facebrasil</h3>
                            <p className="text-[10px] opacity-70 font-black uppercase tracking-widest">Minhas Facetas</p>
                        </div>
                        <div className="bg-slate-900/10 w-fit p-1.5 rounded-xl backdrop-blur-md text-slate-900">
                            <span className="material-symbols-outlined text-[20px] block">toll</span>
                        </div>
                    </div>
                    <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-7xl opacity-10 filled -rotate-12 group-hover:scale-110 transition-transform duration-500 text-slate-900">stars</span>
                </Link>

                {/* BalcaoUSA */}
                <Link to="/balcao" className="group relative h-40 rounded-[32px] overflow-hidden bg-gradient-to-br from-emerald-500 to-teal-700 p-6 text-white shadow-xl transition-all active:scale-95">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold font-display italic leading-tight">BalcãoUSA</h3>
                            <p className="text-[10px] opacity-70 font-medium">Oportunidades únicas</p>
                        </div>
                        <div className="bg-white/20 w-fit p-1.5 rounded-xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-[20px] block">campaign</span>
                        </div>
                    </div>
                    <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-7xl opacity-10 filled rotate-6 group-hover:scale-110 transition-transform duration-500">dashboard_customize</span>
                </Link>

                {/* News */}
                <Link to="/news" className="group relative h-40 rounded-[32px] overflow-hidden bg-gradient-to-br from-sky-500 to-blue-700 p-6 text-white shadow-xl transition-all active:scale-95">
                    <div className="relative z-10 flex flex-col h-full justify-between">
                        <div>
                            <h3 className="text-lg font-bold font-display italic leading-tight">Mundo News</h3>
                            <p className="text-[10px] opacity-70 font-medium">Giro de notícias</p>
                        </div>
                        <div className="bg-white/20 w-fit p-1.5 rounded-xl backdrop-blur-md">
                            <span className="material-symbols-outlined text-[20px] block">newspaper</span>
                        </div>
                    </div>
                    <span className="absolute -bottom-4 -right-4 material-symbols-outlined text-7xl opacity-10 filled -rotate-6 group-hover:scale-110 transition-transform duration-500">public</span>
                </Link>
            </section>

            <section className="flex flex-col gap-4">
                <div className="px-5">
                    <h3 className="text-xl font-display font-bold italic border-b border-slate-100 dark:border-slate-800 pb-3">Matérias Recentes</h3>
                </div>
                <div className="px-3 flex flex-col gap-1">
                    {ARTICLES.slice(1).map(article => (
                        <ArticleCard key={article.id} article={article} onClick={(id) => navigate(`/article/${id}`)} />
                    ))}
                </div>
            </section>
        </main>
    );
};
