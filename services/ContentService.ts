import { supabase } from './supabaseClient';

export const ContentService = {
    /**
     * For external creators to submit articles.
     * This would typically be called from a server-side route that validates the X-API-KEY.
     */
    async submitExternalArticle(payload: {
        title: string;
        content: string;
        author_name?: string;
        category_name?: string;
        image_url?: string;
        api_key: string;
    }) {
        // 1. Validate API Key
        const { data: keyValid } = await supabase
            .from('external_api_keys')
            .select('creator_name')
            .eq('api_key', payload.api_key)
            .eq('is_active', true)
            .single();

        if (!keyValid) throw new Error('Chave de API inválida ou inativa.');

        // 2. Insert into Pending
        const { data, error } = await supabase
            .from('pending_articles')
            .insert({
                title: payload.title,
                content: payload.content,
                author_name: payload.author_name,
                category_name: payload.category_name,
                image_url: payload.image_url,
                external_source: keyValid.creator_name,
                status: 'pending'
            })
            .select();

        if (error) throw error;
        return data;
    },

    /**
     * Approve a pending article and move it to the main articles table.
     */
    async approveArticle(pendingId: string) {
        // 1. Get Pending Data
        const { data: pending, error: fetchError } = await supabase
            .from('pending_articles')
            .select('*')
            .eq('id', pendingId)
            .single();

        if (fetchError || !pending) throw new Error('Artigo não encontrado.');

        // 2. Insert into Main Articles
        const { data: article, error: insertError } = await supabase
            .from('articles')
            .insert({
                title: pending.title,
                content: pending.content,
                excerpt: pending.content.slice(0, 150) + '...',
                image_url: pending.image_url,
                // For simplicity, we assign to a default author/category if name matching is too complex for basic
                created_at: new Date().toISOString()
            })
            .select();

        if (insertError) throw insertError;

        // 3. Delete from Pending
        await supabase.from('pending_articles').delete().eq('id', pendingId);

        return article;
    }
};
