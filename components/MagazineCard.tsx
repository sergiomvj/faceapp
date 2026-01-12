
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { MagazineIssue } from '../types';

interface MagazineCardProps {
  magazine: MagazineIssue;
}

export const MagazineCard: React.FC<MagazineCardProps> = ({ magazine }) => {
  const navigate = useNavigate();

  return (
    <div
      className="snap-center shrink-0 w-40 flex flex-col gap-3 group cursor-pointer"
      onClick={() => navigate(`/magazine/${magazine.id}`)}
    >
      <div className="aspect-[3/4] w-full rounded-2xl shadow-xl overflow-hidden relative bg-slate-200 dark:bg-slate-800 border border-slate-200/50 dark:border-slate-700/50">
        <div
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105"
          style={{ backgroundImage: `url("${magazine.coverUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100 backdrop-blur-[2px]">
          <span className="bg-white text-slate-900 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest shadow-lg">
            Ver Edição
          </span>
        </div>
      </div>
      <div className="flex flex-col">
        <span className="text-xs font-bold text-slate-500 uppercase">{magazine.month} {magazine.year}</span>
        <h4 className="text-base font-bold leading-tight font-display">{magazine.title}</h4>
      </div>
    </div>
  );
};
