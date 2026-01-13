import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface AdConfig {
    id: string;
    imageUrl: string;
    linkUrl: string;
    type: 'banner' | 'popup' | 'native';
    provider: string;
}

interface MonetizaiAdProps {
    zoneId: string; // e.g., 'home-top', 'article-bottom'
    className?: string;
}

/**
 * MonetizaiAd: Client-side component that fetches external ad configurations.
 * This component "outsources" the ad logic to the Monetizai app.
 */
export const MonetizaiAd: React.FC<MonetizaiAdProps> = ({ zoneId, className }) => {
    const [ad, setAd] = useState<AdConfig | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // In a real scenario, this would call:
        // fetch(`https://monetizai.app/api/ads?zone=${zoneId}&apiKey=...`)

        const simulateFetch = setTimeout(() => {
            // Mock response from Monetizai API
            const mockAds: Record<string, AdConfig> = {
                'home-top': {
                    id: 'ext_ad_1',
                    imageUrl: 'https://images.unsplash.com/photo-1614850523296-d8c1af93d400?q=80&w=1200',
                    linkUrl: 'https://facebrasil.app/brvip',
                    type: 'banner',
                    provider: 'MonetizAI'
                },
                'article-sidebar': {
                    id: 'ext_ad_2',
                    imageUrl: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?q=80&w=400',
                    linkUrl: 'https://facebrasil.app/clube',
                    type: 'native',
                    provider: 'MonetizAI'
                }
            };

            setAd(mockAds[zoneId] || null);
            setLoading(false);
        }, 800);

        return () => clearTimeout(simulateFetch);
    }, [zoneId]);

    const handleAdClick = () => {
        if (!ad) return;
        console.log(`[MonetizAI] Recording click for AD ${ad.id} in zone ${zoneId}`);
        // In real app: fetch(`https://monetizai.app/api/clicks/${ad.id}`, { method: 'POST' })
        window.open(ad.linkUrl, '_blank');
    };

    if (loading) return (
        <div className={`w-full bg-slate-100 dark:bg-slate-800 animate-pulse rounded-3xl flex items-center justify-center text-[10px] font-black text-slate-400 uppercase tracking-widest ${className}`}>
            Carregando MonetizAI...
        </div>
    );

    if (!ad) return null;

    return (
        <AnimatePresence mode="wait">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className={className}
            >
                <div
                    onClick={handleAdClick}
                    className="relative w-full h-full cursor-pointer rounded-3xl overflow-hidden group shadow-xl hover:shadow-2xl transition-all"
                >
                    <img
                        src={ad.imageUrl}
                        alt="Anúncio"
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Badge showing external management */}
                    <div className="absolute top-4 left-4 flex items-center gap-1.5 px-2.5 py-1 bg-white/10 backdrop-blur-md border border-white/20 rounded-full">
                        <span className="size-1.5 bg-green-500 rounded-full animate-pulse shadow-[0_0_8px_rgba(34,197,94,0.8)]" />
                        <span className="text-[8px] font-black text-white uppercase tracking-widest">{ad.provider} Active</span>
                    </div>
                </div>
            </motion.div>
        </AnimatePresence>
    );
};
