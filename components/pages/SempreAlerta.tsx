import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Report {
    id: string;
    user: string;
    type: 'video' | 'image' | 'text';
    content: string;
    location: string;
    timestamp: string;
    status: 'pending' | 'verified' | 'breaking';
}

export const SempreAlerta: React.FC = () => {
    const [showForm, setShowForm] = useState(false);
    const [reports] = useState<Report[]>([
        { id: '1', user: 'Marcos R.', type: 'image', content: 'Acidente na I-4 próximo à saída 72. Trânsito lento.', location: 'Orlando, FL', timestamp: '10 min atrás', status: 'breaking' },
        { id: '2', user: 'Lúcia M.', type: 'text', content: 'Novo restaurante brasileiro inaugurando em Pompano Beach este final de semana!', location: 'Pompano Beach, FL', timestamp: '1h atrás', status: 'verified' },
    ]);

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-32 flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="relative rounded-[40px] overflow-hidden bg-slate-900 p-8 text-white shadow-2xl border-b-4 border-red-600">
                <div className="relative z-10 flex flex-col gap-4">
                    <div className="flex items-center gap-3">
                        <div className="size-10 rounded-full bg-red-600 flex items-center justify-center animate-pulse">
                            <span className="material-symbols-outlined text-white filled">emergency</span>
                        </div>
                        <h2 className="text-3xl font-display font-bold italic">Sempre Alerta</h2>
                    </div>
                    <p className="text-sm opacity-80 leading-relaxed font-medium">
                        Viou algo importante na comunidade? Seja o repórter. Envie fotos, vídeos ou relatos em tempo real.
                    </p>
                    <button
                        onClick={() => setShowForm(true)}
                        className="w-full mt-2 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-2xl text-xs uppercase tracking-[3px] transition-all active:scale-95 shadow-lg shadow-red-900/20"
                    >
                        ENVIAR RELATO AGORA
                    </button>
                </div>
                <span className="absolute -bottom-10 -right-10 material-symbols-outlined text-[200px] opacity-5 filled">campaign</span>
            </div>

            <div className="flex flex-col gap-4">
                <h3 className="text-xs font-black uppercase tracking-[3px] text-slate-400 ml-2">Relatos da Comunidade</h3>
                {reports.map(report => (
                    <motion.div
                        key={report.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-slate-100 dark:border-slate-800 shadow-sm flex flex-col gap-3 relative overflow-hidden"
                    >
                        {report.status === 'breaking' && (
                            <div className="absolute top-0 right-0 px-4 py-1 bg-red-600 text-[8px] font-black text-white uppercase tracking-widest rounded-bl-2xl">
                                Urgente
                            </div>
                        )}
                        <div className="flex items-center gap-2">
                            <span className="material-symbols-outlined text-slate-400 text-sm">
                                {report.type === 'video' ? 'videocam' : report.type === 'image' ? 'image' : 'chat_bubble'}
                            </span>
                            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{report.user} • {report.location}</span>
                        </div>
                        <p className="font-medium text-slate-700 dark:text-slate-200">{report.content}</p>
                        <div className="flex justify-between items-center mt-2">
                            <span className="text-[10px] font-bold text-slate-400">{report.timestamp}</span>
                            <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:underline">Ver Detalhes</button>
                        </div>
                    </motion.div>
                ))}
            </div>

            <AnimatePresence>
                {showForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col gap-4"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-2xl font-bold font-display italic">Novo Relato</h4>
                                <button onClick={() => setShowForm(false)} className="material-symbols-outlined text-slate-400">close</button>
                            </div>
                            <textarea
                                placeholder="O que está acontecendo?"
                                className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none resize-none"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary">photo_camera</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Foto</span>
                                </button>
                                <button className="flex flex-col items-center gap-1 p-4 rounded-2xl bg-slate-100 dark:bg-slate-700 hover:bg-primary/10 transition-colors">
                                    <span className="material-symbols-outlined text-primary">videocam</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Vídeo</span>
                                </button>
                            </div>
                            <button className="w-full py-4 bg-slate-900 dark:bg-white text-white dark:text-slate-900 font-bold rounded-2xl mt-4">
                                ENVIAR AGORA
                            </button>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};
