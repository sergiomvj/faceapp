import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '../../services/supabaseClient';
import { useAuth } from '../../context/AuthContext';
import { cn } from '../../utils';

interface Report {
    id: string;
    user_id?: string;
    type: 'video' | 'image' | 'text';
    content: string;
    location: string;
    created_at: string;
    status: 'pending' | 'verified' | 'breaking';
}

export const SempreAlerta: React.FC = () => {
    const { user } = useAuth();
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [reports, setReports] = useState<Report[]>([]);
    const [newReport, setNewReport] = useState<{ content: string, type: 'video' | 'image' | 'text', location: string }>({ content: '', type: 'text', location: '' });

    useEffect(() => {
        fetchReports();

        // Realtime subscription
        const channel = supabase
            .channel('public:community_reports')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'community_reports' }, payload => {
                setReports(prev => [payload.new as Report, ...prev]);
            })
            .subscribe();

        return () => { supabase.removeChannel(channel); };
    }, []);

    const fetchReports = async () => {
        const { data, error } = await supabase
            .from('community_reports')
            .select('*')
            .order('created_at', { ascending: false });

        if (data) setReports(data as Report[]);
        setLoading(false);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!user) {
            alert("Faça login para enviar um relato.");
            return;
        }

        const { error } = await supabase.from('community_reports').insert({
            ...newReport,
            user_id: user.id,
            status: 'pending'
        });

        if (error) alert(error.message);
        else {
            setShowForm(false);
            setNewReport({ content: '', type: 'text', location: '' });
            alert("Relato enviado sob análise!");
        }
    };

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
                {loading ? <div className="p-10 text-center text-slate-400">Carregando relatos...</div> :
                    reports.map(report => (
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
                                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Anônimo • {report.location}</span>
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-200">{report.content}</p>
                            <div className="flex justify-between items-center mt-2">
                                <span className="text-[10px] font-bold text-slate-400">{new Date(report.created_at).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}</span>
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
                        <form
                            onSubmit={handleSubmit}
                            className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col gap-4 shadow-2xl"
                        >
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="text-2xl font-bold font-display italic">Novo Relato</h4>
                                <button type="button" onClick={() => setShowForm(false)} className="material-symbols-outlined text-slate-400">close</button>
                            </div>
                            <textarea
                                required
                                value={newReport.content}
                                onChange={e => setNewReport({ ...newReport, content: e.target.value })}
                                placeholder="O que está acontecendo?"
                                className="w-full h-32 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none resize-none"
                            />
                            <input
                                required
                                value={newReport.location}
                                onChange={e => setNewReport({ ...newReport, location: e.target.value })}
                                placeholder="Localização (ex: Orlando, FL)"
                                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none mb-2"
                            />
                            <div className="grid grid-cols-2 gap-2">
                                <button type="button" onClick={() => setNewReport({ ...newReport, type: 'image' })} className={cn("flex flex-col items-center gap-1 p-4 rounded-2xl transition-colors", newReport.type === 'image' ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-700')}>
                                    <span className="material-symbols-outlined">photo_camera</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Foto</span>
                                </button>
                                <button type="button" onClick={() => setNewReport({ ...newReport, type: 'video' })} className={cn("flex flex-col items-center gap-1 p-4 rounded-2xl transition-colors", newReport.type === 'video' ? 'bg-primary/20 text-primary' : 'bg-slate-100 dark:bg-slate-700')}>
                                    <span className="material-symbols-outlined">videocam</span>
                                    <span className="text-[8px] font-black uppercase tracking-widest">Vídeo</span>
                                </button>
                            </div>
                            <button
                                type="submit"
                                className="w-full py-4 bg-red-600 text-white font-bold rounded-2xl mt-4 shadow-lg shadow-red-200"
                            >
                                ENVIAR AGORA
                            </button>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
        </main>
    );
};
