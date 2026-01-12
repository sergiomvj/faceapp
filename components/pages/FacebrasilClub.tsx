import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { supabase } from '../../services/supabaseClient';

export const FacebrasilClub: React.FC = () => {
    const { user, refreshProfile } = useAuth();
    const [converting, setConverting] = useState(false);
    const CONVERSION_RATE = 10;

    if (!user) return (
        <main className="w-full max-w-2xl mx-auto p-4 flex flex-col items-center justify-center min-h-[60vh] gap-4">
            <span className="material-symbols-outlined text-6xl text-slate-300">lock</span>
            <h2 className="text-2xl font-display font-bold">Área Exclusiva</h2>
            <p className="text-slate-500 text-center text-sm">Faça login para converter seus pontos e ver seus benefícios.</p>
        </main>
    );

    const handleConvert = async () => {
        if (user.points < CONVERSION_RATE) {
            alert("Mínimo de 10 pontos para converter.");
            return;
        }
        setConverting(true);

        const newFacetas = Math.floor(user.points / CONVERSION_RATE);
        const remainingPoints = user.points % CONVERSION_RATE;

        const { error } = await supabase
            .from('profiles')
            .update({
                points: remainingPoints,
                facetas: user.facetas + newFacetas
            })
            .eq('id', user.id);

        if (error) alert(error.message);
        else {
            await refreshProfile();
            alert(`Sucesso! Você recebeu ${newFacetas} FACETAS.`);
        }
        setConverting(false);
    };

    return (
        <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8 pb-32">
            <h2 className="text-3xl font-display font-bold italic text-yellow-600">Club de Vantagens</h2>
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1">Status: Nível {user.level}</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-60">Saldos Digitais</p>
                            <h3 className="text-4xl font-black text-yellow-400">{user.facetas} <small className="text-lg">FCT</small></h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">{user.points} <small className="text-xs opacity-60">PTS</small></p>
                        </div>
                    </div>
                    <button onClick={handleConvert} disabled={converting} className="w-full mt-6 py-4 bg-yellow-500 text-slate-900 font-bold rounded-2xl text-sm transition-all active:scale-95 disabled:opacity-50">
                        {converting ? 'PROCESSANDO...' : 'CONVERTER PONTOS EM FACETAS'}
                    </button>
                </div>
                <span className="absolute -bottom-20 -right-20 material-symbols-outlined text-[300px] opacity-10 filled text-white">toll</span>
            </div>
            <div className="p-8 bg-white dark:bg-slate-900 rounded-[40px] border border-slate-100 dark:border-slate-800">
                <h4 className="text-xl font-display font-bold italic mb-4">O que é o Club?</h4>
                <p className="text-sm text-slate-500 leading-relaxed">Cada matéria lida gera pontos. Esses pontos podem ser convertidos em FACETAS, nossa moeda exclusiva usada para resgatar benefícios com nossos parceiros em toda a América.</p>
            </div>
        </main>
    );
};
