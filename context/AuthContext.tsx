import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../services/supabaseClient';
import { UserProfile } from '../types';

interface AuthContextType {
    user: UserProfile | null;
    loading: boolean;
    signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProfile = async (id: string, email?: string) => {
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', id)
                .single();

            if (error && error.code === 'PGRST116') {
                // Profile doesn't exist, create it
                const newProfile = {
                    id,
                    email,
                    username: email?.split('@')[0],
                    points: 200,
                    facetas: 5,
                };
                const { data: created } = await supabase.from('profiles').insert(newProfile).select().single();
                if (created) setUser(created as any);
            } else if (data) {
                setUser(data as any);
            }
            setLoading(false);
        };

        // Check active sessions
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setLoading(false);
            }
        });

        // Listen for changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session) {
                fetchProfile(session.user.id, session.user.email);
            } else {
                setUser(null);
                setLoading(false);
            }
        });

        return () => subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        await supabase.auth.signOut();
    };

    return (
        <AuthContext.Provider value={{ user, loading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
