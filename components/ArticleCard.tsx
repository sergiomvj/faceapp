
import React from 'react';
import { Article } from '../types';

interface ArticleCardProps {
  article: Article;
  variant?: 'list' | 'featured' | 'story';
  onClick: (id: string) => void;
}

export const ArticleCard: React.FC<ArticleCardProps> = ({ article, variant = 'list', onClick }) => {
  if (variant === 'featured') {
    return (
      <section 
        className="relative w-full aspect-[4/5] sm:aspect-video flex flex-col justify-end overflow-hidden group cursor-pointer"
        onClick={() => onClick(article.id)}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-105" 
          style={{ backgroundImage: `url("${article.imageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background-dark via-background-dark/40 to-transparent"></div>
        <div className="relative z-10 p-5 flex flex-col gap-3">
          <span className="inline-flex w-fit items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-primary text-white uppercase tracking-wider">
            {article.category}
          </span>
          <h2 className="text-3xl sm:text-4xl font-display font-bold leading-tight text-white drop-shadow-sm">
            {article.title}
          </h2>
          <div className="flex items-center gap-2 text-slate-300 text-sm">
            <span>Por {article.author}</span>
            <span className="size-1 rounded-full bg-slate-400"></span>
            <span>{article.readingTime}</span>
          </div>
        </div>
      </section>
    );
  }

  if (variant === 'story') {
    return (
      <div 
        className="group relative aspect-[3/4] rounded-[24px] overflow-hidden cursor-pointer shadow-md transition-all active:scale-95"
        onClick={() => onClick(article.id)}
      >
        <div 
          className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
          style={{ backgroundImage: `url("${article.imageUrl}")` }}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
        <div className="absolute bottom-0 left-0 p-3 w-full flex flex-col gap-1">
          <span className="text-[8px] font-black text-white/80 uppercase tracking-widest px-2 py-0.5 bg-white/10 backdrop-blur-md rounded-full w-fit">
            {article.category}
          </span>
          <h4 className="text-white font-bold leading-tight text-xs font-display italic line-clamp-2">
            "{article.title}"
          </h4>
        </div>
      </div>
    );
  }

  return (
    <article 
      className="flex gap-4 group cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/50 p-2 rounded-xl transition-colors"
      onClick={() => onClick(article.id)}
    >
      <div 
        className="shrink-0 size-24 rounded-lg bg-cover bg-center shadow-sm" 
        style={{ backgroundImage: `url("${article.imageUrl}")` }}
      />
      <div className="flex flex-1 flex-col justify-center gap-1">
        <span className="text-xs font-bold text-primary uppercase">{article.category}</span>
        <h4 className="text-lg font-display font-bold leading-snug group-hover:text-primary transition-colors line-clamp-2">
          {article.title}
        </h4>
        <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-1">
          {article.excerpt}
        </p>
      </div>
    </article>
  );
};
