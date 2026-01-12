import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Topic {
    id: string;
    topic: string;
    source: string;
    score: number;
    aiSuggestion: string;
}

export const TopicGenerator: React.FC = () => {
    const [isGenerating, setIsGenerating] = useState(false);
    const [topics, setTopics] = useState<Topic[]>([
        { id: '1', topic: 'Mudanças no Visto EB-2', source: 'Google Trends (US)', score: 98, aiSuggestion: 'Como brasileiros qualificados podem aproveitar o novo memorando...' },
        { id: '2', topic: 'Preço de Imóveis em Orlando', source: 'Zillow Insight', score: 85, aiSuggestion: 'As 5 áreas subvalorizadas em Central Florida para investir agora.' },
    ]);

    const handleGenerate = () => {
        setIsGenerating(true);
        // Simulation of API call to Google Trends / Gemini
        setTimeout(() => {
            const newTopic: Topic = {
                id: Date.now().toString(),
                topic: 'Crise dos Aluguéis em Miami',
                source: 'Twitter Trends (Miami)',
                score: 92,
                aiSuggestion: 'Guia de sobrevivência: Alternativas em Broward para quem foge dos preços de Brickell.'
            };
            setTopics([newTopic, ...topics]);
            setIsGenerating(false);
        }, 1500);
    };

    return (
        <div className="flex flex-col gap-6 p-4">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-2xl font-display font-bold italic text-orange-600">Fábrica de Pautas</h2>
                    <p className="text-slate-500 text-sm">Assuntos quentes gerados por IA e Trends.</p>
                </div>
                <button
                    onClick={handleGenerate}
                    disabled={isGenerating}
                    className="size-12 rounded-full bg-orange-500 text-white flex items-center justify-center shadow-lg shadow-orange-200 dark:shadow-none active:scale-95 disabled:opacity-50 transition-all"
                >
                    <span className={isGenerating ? "animate-spin material-symbols-outlined" : "material-symbols-outlined filled"}>
                        {isGenerating ? 'sync' : 'bolt'}
                    </span>
                </button>
            </div>

            <div className="flex flex-col gap-4">
                <AnimatePresence>
                    {topics.map(t => (
                        <motion.div
                            key={t.id}
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            className="p-6 bg-white dark:bg-slate-900 rounded-[32px] border border-orange-100 dark:border-orange-900/30 flex flex-col gap-3 relative"
                        >
                            <div className="flex justify-between items-center">
                                <span className="text-[9px] font-black uppercase tracking-widest text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">
                                    Trend Score: {t.score}%
                                </span>
                                <span className="text-[10px] text-slate-400 font-bold">{t.source}</span>
                            </div>
                            <h3 className="font-display font-bold text-xl leading-tight">"{t.topic}"</h3>
                            <div className="p-4 bg-slate-50 dark:bg-slate-800/50 rounded-2xl italic text-xs text-slate-600 dark:text-slate-400 border-l-4 border-orange-500">
                                <p><strong>Sugestão IA:</strong> {t.aiSuggestion}</p>
                            </div>
                            <div className="flex gap-2 mt-2">
                                <button className="flex-1 py-3 bg-slate-900 text-white dark:bg-white dark:text-slate-900 rounded-xl font-bold text-[10px] uppercase tracking-widest">Aprovar Pauta</button>
                                <button className="px-4 py-3 border border-slate-200 dark:border-slate-800 rounded-xl text-slate-400"><span className="material-symbols-outlined text-[18px]">share</span></button>
                            </div>
                        </motion.div>
                    ))}
                </AnimatePresence>
            </div>
        </div>
    );
};
