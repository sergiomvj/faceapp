import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface APIKey {
    id: string;
    name: string;
    key: string;
    createdAt: string;
}

export const ExternalCreatorAPI: React.FC = () => {
    const [keys] = useState<APIKey[]>([
        { id: '1', name: 'Z-Crawler Bot', key: 'face_live_k8s_92837...', createdAt: '2023-12-01' },
        { id: '2', name: 'Partner: Florida News', key: 'face_live_p2p_11209...', createdAt: '2023-11-20' },
    ]);

    return (
        <div className="flex flex-col gap-6 p-4">
            <div>
                <h2 className="text-2xl font-display font-bold italic text-purple-600">Acesso Externo (API)</h2>
                <p className="text-slate-500 text-sm">Gerencie chaves para criadores e sistemas externos.</p>
            </div>

            <div className="bg-purple-50 dark:bg-purple-900/10 p-6 rounded-[32px] border border-purple-100 dark:border-purple-800/30 flex flex-col gap-4">
                <div className="flex items-center gap-3">
                    <div className="size-10 rounded-2xl bg-purple-600 text-white flex items-center justify-center">
                        <span className="material-symbols-outlined filled">key</span>
                    </div>
                    <div>
                        <h3 className="font-bold underline">Nova Chave de Acesso</h3>
                        <p className="text-[10px] text-purple-600/70 font-bold uppercase tracking-widest">Gere tokens para integração externa</p>
                    </div>
                </div>
                <button className="w-full py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-200 dark:shadow-none active:scale-95 transition-all">
                    GERAR NOVO TOKEN
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400 ml-2">Chaves Ativas</h3>
                {keys.map(key => (
                    <motion.div
                        key={key.id}
                        className="p-5 bg-white dark:bg-slate-900 rounded-[24px] border border-slate-100 dark:border-slate-800 flex flex-col gap-3 relative overflow-hidden"
                    >
                        <div className="flex justify-between items-center">
                            <h4 className="font-bold">{key.name}</h4>
                            <span className="text-[10px] text-slate-400">{key.createdAt}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-800 p-3 rounded-xl">
                            <code className="text-[10px] text-purple-600 font-mono flex-1">{key.key}</code>
                            <button className="material-symbols-outlined text-slate-400 text-sm">content_copy</button>
                        </div>
                        <button className="text-[10px] font-black text-red-500 uppercase tracking-widest w-fit hover:underline">Revogar Acesso</button>
                    </motion.div>
                ))}
            </div>
        </div>
    );
};
