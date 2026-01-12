import React, { useState, useEffect } from 'react';
import { CommunityEvent } from '../../types';
import { EVENTS_MOCK as INITIAL_EVENTS } from '../../constants';
import { supabase } from '../../services/supabaseClient';

export const AgendaEventos: React.FC = () => {
    const [events, setEvents] = useState<CommunityEvent[]>([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CommunityEvent>>({ category: 'Social' });

    useEffect(() => {
        fetchEvents();
    }, []);

    const fetchEvents = async () => {
        const { data } = await supabase
            .from('events')
            .select('*')
            .order('date', { ascending: true });

        if (data && data.length > 0) {
            setEvents(data as any);
        } else {
            setEvents(INITIAL_EVENTS);
        }
        setLoading(false);
    };

    const handleAddEvent = async () => {
        const { error } = await supabase.from('events').insert(newEvent);
        if (error) alert(error.message);
        else {
            setShowAddModal(false);
            fetchEvents();
            alert("Evento sugerido com sucesso!");
        }
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando eventos...</div>;

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-32 flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-display font-bold italic">Agenda de Eventos</h2>
                <button onClick={() => setShowAddModal(true)} className="size-10 rounded-full bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-200">
                    <span className="material-symbols-outlined">add</span>
                </button>
            </div>

            <div className="flex gap-2 overflow-x-auto no-scrollbar pb-2">
                {(['all', 'week', 'month'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-6 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${filter === f ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white dark:bg-slate-800 text-slate-400 border-slate-200 dark:border-slate-700'}`}>
                        {f === 'all' ? 'Todos' : f === 'week' ? 'Esta Semana' : 'Este Mês'}
                    </button>
                ))}
            </div>

            <div className="grid gap-4">
                {events.map(event => (
                    <div key={event.id} className="p-6 rounded-[32px] border border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm flex flex-col gap-3">
                        <div className="flex justify-between items-start">
                            <span className="px-3 py-1 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 text-[9px] font-black uppercase tracking-widest rounded-full">
                                {event.category}
                            </span>
                            <div className="text-right">
                                <p className="text-sm font-bold">{new Date(event.date).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' })}</p>
                                <p className="text-[10px] opacity-50">{event.time}</p>
                            </div>
                        </div>
                        <h4 className="font-display font-bold text-lg leading-tight">{event.title}</h4>
                        <p className="text-xs opacity-70 leading-relaxed font-medium">{event.description}</p>
                        <div className="flex items-center gap-4 mt-2 pt-4 border-t border-slate-50 dark:border-slate-800">
                            <span className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                                <span className="material-symbols-outlined text-[14px]">location_on</span> {event.location}
                            </span>
                            <span className="flex items-center gap-1 text-[10px] font-bold opacity-60">
                                <span className="material-symbols-outlined text-[14px]">person</span> {event.organizer}
                            </span>
                        </div>
                    </div>
                ))}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <div className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col gap-4">
                        <h4 className="text-2xl font-bold font-display italic">Sugerir Evento</h4>
                        <input placeholder="Título do Evento" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                        <textarea placeholder="Descrição" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none h-24" onChange={e => setNewEvent({ ...newEvent, description: e.target.value })} />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="date" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none text-xs" onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                            <input type="time" className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none text-xs" onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                        </div>
                        <button onClick={handleAddEvent} className="w-full py-4 bg-indigo-600 text-white font-bold rounded-2xl mt-4">ENVIAR SUGESTÃO</button>
                        <button onClick={() => setShowAddModal(false)} className="text-[10px] font-black uppercase tracking-widest text-slate-400">Cancelar</button>
                    </div>
                </div>
            )}
        </main>
    );
};
