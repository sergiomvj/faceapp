import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ARTICLES } from '../../constants';
import { ArticleCard } from '../ArticleCard';

export const Categories: React.FC = () => {
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
                    <button key={cat.name} onClick={() => navigate(`/search?category=${cat.name}`)} className="p-8 rounded-[40px] bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-center flex flex-col items-center gap-4 hover:border-primary transition-all group shadow-sm active:scale-95">
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

export const NewsPage: React.FC = () => {
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
