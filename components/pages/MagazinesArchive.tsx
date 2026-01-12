import React, { useState, useEffect } from 'react';
import { MAGAZINES as INITIAL_MAGAZINES } from '../../constants';
import { MagazineCard } from '../MagazineCard';
import { MagazineIssue } from '../../types';
import { supabase } from '../../services/supabaseClient';

export const MagazinesArchive: React.FC = () => {
    const [magazines, setMagazines] = useState<MagazineIssue[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchMagazines();
    }, []);

    const fetchMagazines = async () => {
        const { data } = await supabase
            .from('magazines')
            .select('*')
            .order('created_at', { ascending: false });

        if (data && data.length > 0) {
            setMagazines(data as any);
        } else {
            setMagazines(INITIAL_MAGAZINES);
        }
        setLoading(false);
    };

    if (loading) return <div className="p-20 text-center animate-pulse">Carregando banca...</div>;

    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col gap-6">
            <h2 className="text-3xl font-display font-bold italic">Banca Digital</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {magazines.map(mag => <MagazineCard key={mag.id} magazine={mag} />)}
            </div>
        </main>
    );
};
