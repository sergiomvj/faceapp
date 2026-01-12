import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BALCAO_MOCK as INITIAL_POSTS } from '../../constants';
import { BalcaoPost } from '../../types';
import { supabase } from '../../services/supabaseClient';

export const BalcaoUSA: React.FC = () => {
    const [posts, setPosts] = useState<BalcaoPost[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        const { data } = await supabase
            .from('balcao_posts')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            setPosts(data as any);
        } else {
            setPosts(INITIAL_POSTS);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando balcão...</div>;

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-32 flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold italic">BalcãoUSA</h2>
                <Link to="/balcao/welcome" className="px-4 py-2 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold rounded-full text-xs flex items-center gap-2 border border-emerald-200 dark:border-emerald-800">
                    <span className="material-symbols-outlined text-[18px]">add</span>
                    Anuncie de Graça
                </Link>
            </div>
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

export const BalcaoWelcome: React.FC = () => {
    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-32 animate-in fade-in slide-in-from-bottom-4 duration-700">
            <div className="relative rounded-[48px] overflow-hidden bg-gradient-to-br from-emerald-600 to-teal-800 p-8 sm:p-12 text-white shadow-2xl mb-8">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="size-16 rounded-2xl bg-white/20 flex items-center justify-center">
                        <span className="material-symbols-outlined text-4xl filled">campaign</span>
                    </div>
                    <h1 className="text-4xl sm:text-5xl font-display font-bold italic leading-tight">
                        O Maior Balcão de Negócios da Comunidade.
                    </h1>
                    <p className="text-lg opacity-90 leading-relaxed font-medium">
                        Conectando brasileiros nos EUA. O BalcãoUSA é o lugar definitivo para quem deseja crescer, contratar ou vender dentro da nossa comunidade.
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
                        {[
                            { icon: 'work', title: 'Empregos', desc: 'Contrate talentos brasileiros' },
                            { icon: 'storefront', title: 'Negócios', desc: 'Venda ou passe seu ponto' },
                            { icon: 'handshake', title: 'Serviços', desc: 'Ofereça suas habilidades' },
                            { icon: 'lightbulb', title: 'Oportunidades', desc: 'Parcerias e investimentos' }
                        ].map(item => (
                            <div key={item.title} className="flex items-center gap-3 p-4 rounded-3xl bg-white/10 backdrop-blur-md">
                                <span className="material-symbols-outlined text-emerald-300">{item.icon}</span>
                                <div>
                                    <h4 className="font-bold text-sm">{item.title}</h4>
                                    <p className="text-[10px] opacity-70">{item.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-8 flex flex-col gap-4">
                        <button onClick={() => alert('Sistema de anúncios em desenvolvimento. Em breve!')} className="w-full py-5 bg-white text-emerald-800 font-black rounded-3xl text-sm shadow-xl active:scale-95 transition-transform">
                            CRIAR MEU ANÚNCIO AGORA
                        </button>
                        <p className="text-center text-[10px] font-bold opacity-60 uppercase tracking-[3px]">Anúncios 100% gratuitos para a comunidade</p>
                    </div>
                </div>
                <span className="absolute -top-10 -right-10 material-symbols-outlined text-[200px] opacity-10 filled rotate-12">dashboard_customize</span>
            </div>
        </main>
    );
};
