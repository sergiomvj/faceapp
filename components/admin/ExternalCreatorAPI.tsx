import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';

interface ExternalKey {
    id: string;
    creator_name: string;
    api_key: string;
    is_active: boolean;
    created_at: string;
}

export const ExternalCreatorAPI: React.FC = () => {
    const [keys, setKeys] = useState<ExternalKey[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchKeys();
    }, []);

    const fetchKeys = async () => {
        const { data } = await supabase.from('external_api_keys').select('*');
        if (data) setKeys(data);
        setLoading(false);
    };

    const generateNewKey = async () => {
        const name = prompt("Nome do Criador/Sistema:");
        if (!name) return;

        const { error } = await supabase.from('external_api_keys').insert({
            creator_name: name
        });

        if (error) alert(error.message);
        else fetchKeys();
    };

    return (
        <div className="flex flex-col gap-8 p-4">
            <div className="flex flex-col gap-2">
                <h2 className="text-3xl font-display font-bold italic text-purple-600">Portal "Terceirizado"</h2>
                <p className="text-slate-500 text-sm font-medium">Crie chaves de acesso para que sistemas externos gerenciem seu conteúdo automaticamente.</p>
            </div>

            <div className="bg-purple-600 rounded-[40px] p-10 text-white shadow-2xl relative overflow-hidden group">
                <div className="relative z-10 flex flex-col gap-6">
                    <div className="flex items-center gap-4">
                        <div className="size-14 rounded-3xl bg-white/20 backdrop-blur-md flex items-center justify-center border border-white/30 rotate-3 group-hover:rotate-0 transition-transform">
                            <span className="material-symbols-outlined text-3xl filled text-white">key</span>
                        </div>
                        <div>
                            <h3 className="text-2xl font-display font-bold italic underline decoration-purple-300 underline-offset-8">Nova Chave de Gestor</h3>
                            <p className="text-[10px] font-black uppercase tracking-[3px] text-purple-200 mt-2">Permissões de Escrita via API</p>
                        </div>
                    </div>
                    <p className="text-sm text-purple-100/80 leading-relaxed font-medium">
                        Ao gerar uma chave, você permite que o possuidor envie artigos diretamente para o seu portal (Fila de Espera ou Publicação Direta).
                    </p>
                    <button
                        onClick={generateNewKey}
                        className="w-full py-4 bg-white text-purple-600 rounded-2xl font-black text-xs uppercase tracking-[3px] shadow-xl hover:scale-[1.02] transition-all active:scale-95"
                    >
                        GERAR TOKEN DE GESTÃO
                    </button>
                </div>
                <span className="absolute -bottom-20 -right-20 material-symbols-outlined text-[300px] opacity-10 text-white filled select-none">safety_check</span>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400 ml-4 mb-2">Chaves Ativas e Privilégios</h3>
                {loading ? <div className="p-10 text-center animate-pulse text-slate-400 uppercase text-[10px] font-black">Lendo Tokens...</div> :
                    keys.map(k => (
                        <motion.div
                            key={k.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-3">
                                    <div className="size-2 bg-green-500 rounded-full animate-pulse" />
                                    <h4 className="font-bold text-slate-900 dark:text-white">{k.creator_name}</h4>
                                </div>
                                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{new Date(k.created_at).toLocaleDateString()}</span>
                            </div>

                            <div className="bg-slate-50 dark:bg-slate-800 p-4 rounded-2xl flex items-center gap-3 border border-slate-100 dark:border-slate-700">
                                <code className="text-[10px] font-mono text-purple-500 flex-1 truncate">{k.api_key}</code>
                                <button
                                    onClick={() => { navigator.clipboard.writeText(k.api_key); alert("Copiado!"); }}
                                    className="material-symbols-outlined text-slate-400 hover:text-purple-600 transition-colors"
                                >
                                    content_copy
                                </button>
                            </div>

                            <div className="flex gap-4">
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                    <span className="text-[9px] font-black uppercase text-slate-400">Postar Artigos</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <span className="material-symbols-outlined text-green-500 text-sm">check_circle</span>
                                    <span className="text-[9px] font-black uppercase text-slate-400">Editar Metadados</span>
                                </div>
                            </div>
                        </motion.div>
                    ))}
            </div>

            {/* API Documentation Preview */}
            <div className="mt-4 p-8 bg-slate-100 dark:bg-slate-800/30 rounded-[40px] border border-dashed border-slate-300 dark:border-slate-700">
                <h4 className="text-xs font-black uppercase tracking-[3px] text-slate-500 mb-6">Como integrar (Webhook/API)</h4>
                <div className="flex flex-col gap-4">
                    <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                        Faça um POST para <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">/api/content</code> incluindo o header <code className="bg-slate-200 dark:bg-slate-800 px-2 py-1 rounded">X-API-KEY</code>.
                    </p>
                    <pre className="bg-slate-900 text-purple-300 p-6 rounded-3xl text-[10px] overflow-x-auto font-mono leading-relaxed shadow-xl">
                        {`{
  "title": "Novo Evento em Miami",
  "content": "...",
  "category": "Eventos",
  "status": "pending"
}`}
                    </pre>
                </div>
            </div>
        </div>
    );
};
