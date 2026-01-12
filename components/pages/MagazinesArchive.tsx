import React from 'react';
import { MAGAZINES as INITIAL_MAGAZINES } from '../../constants';
import { MagazineCard } from '../MagazineCard';
import { MagazineIssue } from '../../types';

const getMagazines = (): MagazineIssue[] => {
    const localMagazines = JSON.parse(localStorage.getItem('customMagazines') || '[]');
    return [...INITIAL_MAGAZINES, ...localMagazines];
};

export const MagazinesArchive: React.FC = () => {
    const magazines = getMagazines();
    return (
        <main className="w-full max-w-2xl mx-auto p-4 pb-24 flex flex-col gap-6">
            <h2 className="text-3xl font-display font-bold italic">Banca Digital</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {magazines.map(mag => <MagazineCard key={mag.id} magazine={mag} />)}
            </div>
        </main>
    );
};
