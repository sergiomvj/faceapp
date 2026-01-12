import React, { useState } from 'react';
import { UserStats } from '../../types';

const getUserStats = (): UserStats => {
    const defaults: UserStats = { points: 200, facetas: 5, level: 'Bronze', articlesRead: [], lastCheckIn: '' };
    return JSON.parse(localStorage.getItem('userStats') || JSON.stringify(defaults));
};

const saveUserStats = (stats: UserStats) => {
    if (stats.points > 2000) stats.level = 'Diamante';
    else if (stats.points > 1000) stats.level = 'Ouro';
    else if (stats.points > 300) stats.level = 'Prata';
    else stats.level = 'Bronze';
    localStorage.setItem('userStats', JSON.stringify(stats));
};

export const FacebrasilClub: React.FC = () => {
    const [stats, setStats] = useState(getUserStats());
    const [converting, setConverting] = useState(false);
    const CONVERSION_RATE = 10;

    const handleConvert = () => {
        if (stats.points < CONVERSION_RATE) {
            alert("Mínimo de 10 pontos para converter.");
            return;
        }
        setConverting(true);
        setTimeout(() => {
            const newFacetas = Math.floor(stats.points / CONVERSION_RATE);
            const remainingPoints = stats.points % CONVERSION_RATE;
            const newStats: UserStats = { ...stats, facetas: stats.facetas + newFacetas, points: remainingPoints };
            saveUserStats(newStats);
            setStats(newStats);
            setConverting(false);
            alert(`Sucesso! Você recebeu ${newFacetas} FACETAS.`);
        }, 1200);
    };

    return (
        <main className="w-full max-w-2xl mx-auto p-4 flex flex-col gap-8 pb-32">
            <h2 className="text-3xl font-display font-bold italic text-yellow-600">Club de Vantagens</h2>
            <div className="bg-slate-900 text-white rounded-[40px] p-8 shadow-2xl relative overflow-hidden">
                <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-widest text-yellow-500 mb-1">Status: Nível {stats.level}</p>
                    <div className="flex justify-between items-end">
                        <div>
                            <p className="text-xs opacity-60">Saldos Digitais</p>
                            <h3 className="text-4xl font-black text-yellow-400">{stats.facetas} <small className="text-lg">FCT</small></h3>
                        </div>
                        <div className="text-right">
                            <p className="text-xl font-bold">{stats.points} <small className="text-xs opacity-60">PTS</small></p>
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
