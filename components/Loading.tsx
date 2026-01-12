import React from 'react';
import { motion } from 'framer-motion';

export const LoadingScreen: React.FC = () => {
    return (
        <div className="fixed inset-0 z-[100] bg-surface-light/80 dark:bg-background-dark/80 backdrop-blur-md flex items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <motion.div
                    animate={{
                        rotate: 360,
                        borderRadius: ["20%", "50%", "20%"]
                    }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                    className="size-12 bg-primary flex items-center justify-center shadow-xl shadow-primary/20"
                >
                    <span className="material-symbols-outlined text-white filled">bolt</span>
                </motion.div>
                <span className="text-[10px] font-black uppercase tracking-[3px] text-slate-400 animate-pulse">
                    Carregando Facebrasil...
                </span>
            </div>
        </div>
    );
};

export const LoadingDots: React.FC = () => (
    <div className="flex gap-1 justify-center items-center py-4">
        {[0, 1, 2].map((i) => (
            <motion.div
                key={i}
                animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
                transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
                className="size-1.5 rounded-full bg-primary"
            />
        ))}
    </div>
);
