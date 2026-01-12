import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ARTICLES } from '../../constants';
import { Article } from '../../types';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';

export const ArticleDetail: React.FC = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [article, setArticle] = useState<Article | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            // First check mock data
            const mock = ARTICLES.find(a => a.id === id);
            if (mock) {
                setArticle(mock);
                setLoading(false);
            } else {
                // Fetch from Supabase
                const { data } = await supabase
                    .from('articles')
                    .select('*')
                    .eq('id', id)
                    .single();

                if (data) {
                    setArticle({
                        ...data,
                        isFeatured: data.is_featured,
                        readingTime: data.reading_time,
                        imageUrl: data.image_url
                    } as Article);
                }
                setLoading(false);
            }
        };

        fetchArticle();
    }, [id]);

    useEffect(() => {
        const syncPoints = async () => {
            if (id && user) {
                // Simple logic: add 10 points if not read (we can improve this later with a dedicated table)
                const { data: profile } = await supabase.from('profiles').select('points').eq('id', user.id).single();
                if (profile) {
                    await supabase.from('profiles').update({ points: profile.points + 10 }).eq('id', user.id);
                }
            }
        };
        if (article) syncPoints();
    }, [article, user, id]);

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando matéria...</div>;
    if (!article) return <div className="p-20 text-center">Matéria não encontrada.</div>;

    return (
        <main className="w-full max-w-2xl mx-auto pb-32 animate-in fade-in duration-700">
            <div className="relative aspect-video w-full">
                <img src={article.imageUrl} className="w-full h-full object-cover" alt={article.title} />
                <button onClick={() => navigate(-1)} className="absolute top-4 left-4 size-10 rounded-full bg-black/20 backdrop-blur-md text-white flex items-center justify-center transition-colors hover:bg-black/40">
                    <span className="material-symbols-outlined">arrow_back</span>
                </button>
            </div>
            <div className="px-6 -mt-10 relative z-10">
                <div className="bg-white dark:bg-slate-900 rounded-[40px] p-8 shadow-2xl border border-slate-100 dark:border-slate-800 flex flex-col gap-6">
                    <nav className="flex items-center gap-2 text-[10px] font-bold uppercase tracking-widest text-slate-400">
                        <Link to="/" className="hover:text-primary transition-colors">Início</Link>
                        <span className="material-symbols-outlined text-[14px]">chevron_right</span>
                        <Link to={`/search?category=${article.category}`} className="hover:text-primary transition-colors">{article.category}</Link>
                    </nav>
                    <div className="flex flex-col gap-4">
                        <span className="px-4 py-1.5 rounded-full text-[10px] font-black bg-primary/10 text-primary w-fit uppercase tracking-widest">
                            {article.category}
                        </span>
                        <h1 className="text-3xl font-display font-bold leading-tight">{article.title}</h1>
                        <div className="flex items-center gap-3 text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-bold italic"><span className="material-symbols-outlined text-[16px]">person</span> {article.author}</span>
                            <span className="size-1 rounded-full bg-slate-300"></span>
                            <span>{article.date}</span>
                        </div>
                    </div>
                    <p className="text-lg leading-relaxed text-slate-700 dark:text-slate-300 whitespace-pre-line border-t border-slate-50 dark:border-slate-800 pt-6">
                        {article.content}
                    </p>
                </div>
            </div>
        </main>
    );
};
