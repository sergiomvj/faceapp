import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../utils';

interface Ad {
    id: string;
    title: string;
    client: string;
    position: string;
    views: number;
    clicks: number;
    isActive: boolean;
}

export const AdManager: React.FC = () => {
    const [ads] = useState<Ad[]>([
        { id: '1', title: 'Banner Verão Orlando', client: 'Disney World', position: 'Home Top', views: 12400, clicks: 450, isActive: true },
        { id: '2', title: 'Consultoria Imigração', client: 'Legal Brazil', position: 'Article Sidebar', views: 8200, clicks: 210, isActive: false },
    ]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-display font-bold italic">Gestão de Anúncios</h2>
                    <p className="text-slate-500 text-sm">Controle seus banners e patrocinadores.</p>
                </div>
                <button className="bg-primary text-white px-4 py-2 rounded-2xl text-xs font-bold flex items-center gap-2">
                    <span className="material-symbols-outlined text-sm">add</span> Novo Anúncio
                </button>
            </div>

            <div className="grid gap-4">
                {ads.map(ad => (
                    <motion.div
                        key={ad.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-4"
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <span className={cn(
                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest",
                                    ad.isActive ? "bg-green-100 text-green-600" : "bg-slate-100 text-slate-400"
                                )}>
                                    {ad.isActive ? 'Ativo' : 'Pausado'}
                                </span>
                                <h3 className="text-lg font-bold mt-2">{ad.title}</h3>
                                <p className="text-xs text-slate-500 font-medium">{ad.client} • {ad.position}</p>
                            </div>
                            <div className="flex gap-2">
                                <button className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center">
                                    <span className="material-symbols-outlined text-[18px]">edit</span>
                                </button>
                                <button className="size-8 rounded-full bg-slate-50 dark:bg-slate-800 flex items-center justify-center text-red-500">
                                    <span className="material-symbols-outlined text-[18px]">delete</span>
                                </button>
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4 border-t border-slate-50 dark:border-slate-800 pt-4">
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Visualizações</span>
                                <span className="text-xl font-display font-bold">{ad.views.toLocaleString()}</span>
                            </div>
                            <div className="flex flex-col gap-0.5">
                                <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest">Cliques</span>
                                <span className="text-xl font-display font-bold">{ad.clicks.toLocaleString()}</span>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
