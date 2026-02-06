'use server';

import { connectToDatabase } from '@/database/mongoose';
import { Watchlist } from '@/database/models/watchlist.model';

type BasicUserDoc = { id?: string; _id?: { toString: () => string }; email?: string };

export const getWatchlistSymbolsByEmail = async (email: string): Promise<string[]> => {
    if (!email || typeof email !== 'string') return [];

    try {
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;
        if (!db) return [];

        const user = await db.collection('users').findOne<BasicUserDoc>({ email });
        if (!user) return [];

        const userId = user.id || user._id?.toString();
        if (!userId) return [];

        const items = await Watchlist.find({ userId }, { symbol: 1, _id: 0 }).lean<{ symbol: string }[]>();
        return Array.isArray(items) ? items.map((i) => String(i.symbol)) : [];
    } catch (err) {
        console.error('Error getting watchlist symbols by email:', err);
        return [];
    }
};
