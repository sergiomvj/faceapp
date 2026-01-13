import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';
import { cn } from '../../utils';

interface Article {
    id: string;
    title: string;
    category_id: string;
    author_id: string;
    created_at: string;
}

interface Category { id: string; name: string; }
interface Author { id: string; name: string; }

export const ContentManager: React.FC = () => {
    const [activeTab, setActiveTab] = useState<'articles' | 'pending' | 'categories' | 'authors'>('articles');
    const [items, setItems] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    const fetchData = async () => {
        setLoading(true);
        let query = supabase.from(activeTab === 'pending' ? 'pending_articles' : activeTab).select('*');

        if (activeTab === 'articles') {
            query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (data) setItems(data);
        setLoading(false);
    };

    return (
        <div className="flex flex-col gap-6 p-4 pb-32">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold italic text-slate-900 dark:text-white">Gestão de Conteúdo</h2>
                    <p className="text-slate-500 text-sm font-medium tracking-tight">Administre artigos, categorias e autores do portal.</p>
                </div>
                <button
                    onClick={() => setShowForm(true)}
                    className="bg-primary text-white h-12 px-6 rounded-2xl text-xs font-black uppercase tracking-widest flex items-center gap-2 shadow-lg shadow-primary/20 hover:scale-105 transition-all active:scale-95"
                >
                    <span className="material-symbols-outlined text-lg">add_circle</span> Novo {activeTab.slice(0, -1)}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar py-2">
                {[
                    { id: 'articles', label: 'Artigos', icon: 'description' },
                    { id: 'pending', label: 'Fila de Espera', icon: 'hourglass_empty' },
                    { id: 'categories', label: 'Categorias', icon: 'dashboard' },
                    { id: 'authors', label: 'Autores', icon: 'history_edu' },
                ].map((tab) => (
                    <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id as any)}
                        className={cn(
                            "flex items-center gap-2 px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-[2px] whitespace-nowrap transition-all border",
                            activeTab === tab.id
                                ? "bg-slate-900 border-slate-900 text-white shadow-xl dark:bg-white dark:text-slate-900"
                                : "bg-white border-slate-100 text-slate-400 dark:bg-slate-800 dark:border-slate-700 hover:border-slate-300"
                        )}
                    >
                        <span className="material-symbols-outlined text-sm">{tab.icon}</span>
                        {tab.label}
                    </button>
                ))}
            </div>

            {/* List */}
            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 shadow-sm overflow-hidden min-h-[400px]">
                {loading ? (
                    <div className="flex flex-col items-center justify-center h-full py-20 gap-4">
                        <div className="w-12 h-12 border-4 border-slate-100 border-t-primary rounded-full animate-spin" />
                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sincronizando...</span>
                    </div>
                ) : items.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-32 text-slate-400 gap-4">
                        <span className="material-symbols-outlined text-6xl opacity-20">cloud_off</span>
                        <p className="text-sm font-medium">Nenhum item encontrado.</p>
                    </div>
                ) : (
                    <div className="flex flex-col divide-y divide-slate-50 dark:divide-slate-800">
                        {items.map((item) => (
                            <motion.div
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                key={item.id}
                                className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors group"
                            >
                                <div className="flex flex-col gap-1">
                                    <h4 className="font-bold text-slate-900 dark:text-white group-hover:text-primary transition-colors">
                                        {item.title || item.name}
                                    </h4>
                                    <div className="flex items-center gap-3 text-[10px] text-slate-400 font-bold uppercase tracking-widest">
                                        <span>ID: {item.id.slice(0, 8)}</span>
                                        {item.created_at && (
                                            <>
                                                <span className="size-1 bg-slate-200 rounded-full" />
                                                <span>{new Date(item.created_at).toLocaleDateString()}</span>
                                            </>
                                        )}
                                        {activeTab === 'pending' && (
                                            <span className="px-2 py-0.5 bg-yellow-100 text-yellow-600 rounded-full text-[8px]">Aguardando Aprovação</span>
                                        )}
                                    </div>
                                </div>
                                <div className="flex items-center gap-2">
                                    {activeTab === 'pending' && (
                                        <button
                                            onClick={async () => {
                                                const { ContentService } = await import('../../services/ContentService');
                                                await ContentService.approveArticle(item.id);
                                                fetchData();
                                            }}
                                            className="size-10 rounded-xl bg-green-50 text-green-600 hover:bg-green-600 hover:text-white transition-all flex items-center justify-center shadow-sm"
                                        >
                                            <span className="material-symbols-outlined text-lg">check</span>
                                        </button>
                                    )}
                                    <button className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-primary hover:bg-primary/10 transition-all flex items-center justify-center shadow-sm">
                                        <span className="material-symbols-outlined text-lg">edit</span>
                                    </button>
                                    <button
                                        onClick={async () => {
                                            if (!confirm("Tem certeza?")) return;
                                            await supabase.from(activeTab === 'pending' ? 'pending_articles' : activeTab).delete().eq('id', item.id);
                                            fetchData();
                                        }}
                                        className="size-10 rounded-xl bg-slate-50 dark:bg-slate-800 text-slate-400 hover:text-red-500 hover:bg-red-50 transition-all flex items-center justify-center shadow-sm"
                                    >
                                        <span className="material-symbols-outlined text-lg">delete</span>
                                    </button>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                )}
            </div>

            {/* Info Box */}
            <div className="p-8 bg-indigo-50 dark:bg-indigo-900/10 rounded-[40px] border border-indigo-100 dark:border-indigo-800/30 flex flex-col gap-4 relative overflow-hidden">
                <div className="relative z-10 flex flex-col gap-2">
                    <h3 className="text-xl font-display font-bold italic text-indigo-900 dark:text-indigo-300">Integração Externa Ativa</h3>
                    <p className="text-sm text-indigo-600/80 leading-relaxed font-medium">
                        Seu portal está configurado para receber conteúdo via API. A "Fila de Espera" contém artigos enviados por parceiros ou sistemas de IA que aguardam seu aval antes de ir ao ar.
                    </p>
                </div>
                <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[150px] opacity-10 text-indigo-600 filled">hub</span>
            </div>
        </div>
    );
};
