import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface Subscriber {
    id: string;
    email: string;
    name: string;
    joinedAt: string;
}

export const NewsletterManager: React.FC = () => {
    const [subscribers] = useState<Subscriber[]>([
        { id: '1', email: 'joao@example.com', name: 'João Silva', joinedAt: '12/01/2026' },
        { id: '2', email: 'maria@test.com', name: 'Maria Santos', joinedAt: '11/01/2026' },
        { id: '3', email: 'carlos@florida.com', name: 'Carlos Jr', joinedAt: '10/01/2026' },
    ]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-2xl font-display font-bold italic text-sky-600">Newsletter Center</h2>
                    <p className="text-slate-500 text-sm">Gerencie sua base de leitores fiéis.</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className="text-2xl font-black text-sky-600">{subscribers.length}</span>
                    <span className="text-[8px] font-black uppercase tracking-widest text-slate-400">Inscritos</span>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
                <button className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] flex flex-col items-center gap-2 hover:border-sky-500 transition-all active:scale-95 group">
                    <div className="size-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined filled">send</span>
                    </div>
                    <span className="text-xs font-bold">Enviar Edição</span>
                </button>
                <button className="p-6 bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-[32px] flex flex-col items-center gap-2 hover:border-sky-500 transition-all active:scale-95 group">
                    <div className="size-10 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center group-hover:bg-sky-600 group-hover:text-white transition-colors">
                        <span className="material-symbols-outlined filled">download</span>
                    </div>
                    <span className="text-xs font-bold">Exportar CSV</span>
                </button>
            </div>

            <div className="bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800 p-6">
                <h4 className="text-xs font-black uppercase tracking-[3px] text-slate-400 mb-6">Últimos Inscritos</h4>
                <div className="flex flex-col gap-6">
                    {subscribers.map(sub => (
                        <div key={sub.id} className="flex items-center justify-between border-b border-slate-50 dark:border-slate-800 pb-4 last:border-0 last:pb-0">
                            <div className="flex flex-col">
                                <span className="font-bold text-sm">{sub.name}</span>
                                <span className="text-xs text-slate-400">{sub.email}</span>
                            </div>
                            <span className="text-[10px] font-bold text-slate-300">{sub.joinedAt}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
};
