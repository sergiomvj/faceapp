import React, { useState, useMemo } from 'react';
import { CommunityEvent } from '../../types';
import { EVENTS_MOCK } from '../../constants';

const getEvents = (): CommunityEvent[] => {
    const local = JSON.parse(localStorage.getItem('communityEvents') || '[]');
    return [...EVENTS_MOCK, ...local].sort((a, b) => a.date.localeCompare(b.date));
};

export const AgendaEventos: React.FC = () => {
    const [events, setEvents] = useState(getEvents());
    const [filter, setFilter] = useState<'all' | 'week' | 'month'>('all');
    const [showAddModal, setShowAddModal] = useState(false);
    const [newEvent, setNewEvent] = useState<Partial<CommunityEvent>>({ category: 'Social' });

    const filteredEvents = useMemo(() => {
        const now = new Date();
        return events.filter(e => {
            const eventDate = new Date(e.date);
            if (filter === 'week') {
                const nextWeek = new Date();
                nextWeek.setDate(now.getDate() + 7);
                return eventDate >= now && eventDate <= nextWeek;
            }
            if (filter === 'month') {
                return eventDate.getMonth() === now.getMonth() && eventDate.getFullYear() === now.getFullYear();
            }
            return true;
        });
    }, [events, filter]);

    const handleAddEvent = (e: React.FormEvent) => {
        e.preventDefault();
        const event: CommunityEvent = {
            id: `e-${Date.now()}`,
            title: newEvent.title || 'Sem título',
            description: newEvent.description || '',
            date: newEvent.date || new Date().toISOString().split('T')[0],
            time: newEvent.time || '00:00',
            location: newEvent.location || 'Não especificado',
            organizer: newEvent.organizer || 'Comunidade',
            category: newEvent.category as any
        };
        const updated = [...getEvents(), event];
        localStorage.setItem('communityEvents', JSON.stringify(updated.filter(ev => ev.id.startsWith('e-'))));
        setEvents(updated.sort((a, b) => a.date.localeCompare(b.date)));
        setShowAddModal(false);
    };

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col gap-6 animate-in fade-in duration-500">
            <div className="flex justify-between items-end">
                <div>
                    <h2 className="text-3xl font-display font-bold italic">Agenda de Eventos</h2>
                    <p className="text-slate-500 text-sm">O que acontece na comunidade brasileira.</p>
                </div>
                <button onClick={() => setShowAddModal(true)} className="bg-primary text-white size-10 rounded-full flex items-center justify-center shadow-lg"><span className="material-symbols-outlined">add</span></button>
            </div>

            <div className="flex gap-2">
                {(['all', 'week', 'month'] as const).map(f => (
                    <button key={f} onClick={() => setFilter(f)} className={`px-4 py-2 rounded-full text-[10px] font-black uppercase tracking-wider border transition-all ${filter === f ? 'bg-primary text-white border-primary' : 'bg-white dark:bg-slate-800 text-slate-400'}`}>
                        {f === 'all' ? 'Tudo' : f === 'week' ? 'Esta Semana' : 'Este Mês'}
                    </button>
                ))}
            </div>

            <div className="flex flex-col gap-4">
                {filteredEvents.map(event => (
                    <div key={event.id} className="p-6 rounded-[32px] bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 flex gap-4">
                        <div className="flex flex-col items-center justify-center min-w-[60px] p-3 bg-primary/5 rounded-2xl">
                            <span className="text-[10px] font-black text-primary uppercase">{new Date(event.date + 'T00:00:00').toLocaleDateString('pt-BR', { month: 'short' })}</span>
                            <span className="text-2xl font-black">{new Date(event.date + 'T00:00:00').getDate()}</span>
                        </div>
                        <div className="flex flex-col gap-1">
                            <span className="text-[9px] font-black text-primary uppercase tracking-widest">{event.category}</span>
                            <h4 className="font-display font-bold text-lg leading-tight">{event.title}</h4>
                            <div className="flex items-center gap-3 text-[11px] text-slate-500 mt-1">
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">schedule</span> {event.time}</span>
                                <span className="flex items-center gap-1"><span className="material-symbols-outlined text-[14px]">location_on</span> {event.location}</span>
                            </div>
                        </div>
                    </div>
                ))}
                {filteredEvents.length === 0 && <p className="text-center py-20 text-slate-400 font-bold italic">Nenhum evento encontrado para este período.</p>}
            </div>

            {showAddModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/60 backdrop-blur-sm">
                    <form onSubmit={handleAddEvent} className="bg-white dark:bg-slate-800 w-full max-w-sm rounded-[40px] p-8 flex flex-col gap-4">
                        <h4 className="text-2xl font-bold font-display italic">Novo Evento</h4>
                        <input required placeholder="Nome do Evento" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, title: e.target.value })} />
                        <div className="flex gap-2">
                            <input type="date" required className="flex-1 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, date: e.target.value })} />
                            <input type="time" required className="w-28 p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, time: e.target.value })} />
                        </div>
                        <input required placeholder="Local (Cidade, Estado)" className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, location: e.target.value })} />
                        <select className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 outline-none" onChange={e => setNewEvent({ ...newEvent, category: e.target.value as any })}>
                            <option value="Social">Social</option>
                            <option value="Cultura">Cultura</option>
                            <option value="Negócios">Negócios</option>
                            <option value="Religioso">Religioso</option>
                        </select>
                        <div className="flex gap-2 mt-4">
                            <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 py-4 font-bold text-sm bg-slate-100 dark:bg-slate-700 rounded-2xl">Cancelar</button>
                            <button type="submit" className="flex-1 py-4 font-bold text-sm bg-primary text-white rounded-2xl">Cadastrar</button>
                        </div>
                    </form>
                </div>
            )}
        </main>
    );
};
