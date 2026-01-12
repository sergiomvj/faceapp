import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';

interface Story {
    id: string;
    name: string;
    role: string;
    image_url: string;
    excerpt: string;
    color?: string;
}

export const BrVIP: React.FC = () => {
    const [stories, setStories] = useState<Story[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchStories();
    }, []);

    const fetchStories = async () => {
        const { data } = await supabase
            .from('celebrity_stories')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            setStories(data as Story[]);
        } else {
            // Fallback for demo
            setStories([
                { id: '1', name: 'Gisele Bündchen', role: 'Supermodelo & Filantropa', excerpt: 'Como a conexão com a natureza e as raízes brasileiras moldaram sua vida na Florida...', image_url: 'https://images.unsplash.com/photo-1594744803329-a584af1cae23?q=80&w=400', color: 'bg-amber-500' },
                { id: '2', name: 'Alok', role: 'DJ & Produtor', excerpt: 'Os novos projetos sociais e a expansão da música brasileira no mercado internacional.', image_url: 'https://images.unsplash.com/photo-1493225255756-d9584f8606e9?q=80&w=400', color: 'bg-sky-500' },
            ]);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando BrVIP...</div>;

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-32 flex flex-col gap-8 animate-in fade-in duration-700">
            <div className="flex flex-col gap-2 pt-4">
                <div className="flex items-center gap-3">
                    <span className="material-symbols-outlined text-4xl text-yellow-500 filled">stars</span>
                    <h2 className="text-4xl font-display font-bold italic tracking-tighter">BrVIP</h2>
                </div>
                <p className="text-slate-500 text-sm font-medium">As histórias inspiradoras das personalidades que brilham no exterior.</p>
            </div>

            <section className="flex flex-col gap-10">
                {stories.map((story, index) => (
                    <motion.article
                        key={story.id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.2 }}
                        className="group cursor-pointer"
                    >
                        <div className="relative aspect-[4/5] rounded-[48px] overflow-hidden shadow-2xl mb-6">
                            <img src={story.image_url} className="w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110" alt={story.name} />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent"></div>
                            <div className="absolute bottom-10 left-10 right-10 flex flex-col gap-2">
                                <span className={`w-fit px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[3px] text-white ${story.color}`}>
                                    Destaque
                                </span>
                                <h3 className="text-4xl font-display font-bold text-white italic leading-tight">{story.name}</h3>
                                <p className="text-slate-300 text-xs font-bold uppercase tracking-widest">{story.role}</p>
                            </div>
                        </div>
                        <div className="px-6 flex flex-col gap-4">
                            <p className="text-lg leading-relaxed text-slate-600 dark:text-slate-400 font-medium italic">
                                "{story.excerpt}"
                            </p>
                            <button className="flex items-center gap-3 text-[10px] font-black uppercase tracking-[4px] text-primary group-hover:gap-5 transition-all">
                                LER HISTÓRIA COMPLETA <span className="material-symbols-outlined">trending_flat</span>
                            </button>
                        </div>
                    </motion.article>
                ))}
            </section>
        </main>
    );
};
