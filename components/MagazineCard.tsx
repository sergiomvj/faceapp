
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
      <div className="aspect-[3/4] w-full rounded-lg shadow-lg overflow-hidden relative bg-slate-200 dark:bg-slate-800">
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-500 group-hover:scale-105" 
          style={{ backgroundImage: `url("${magazine.coverUrl}")` }}
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
          <span className="bg-white/90 text-slate-900 rounded-full p-2">
            <span className="material-symbols-outlined">visibility</span>
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
