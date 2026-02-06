'use server';

import {connectToDatabase} from "@/database/mongoose";

// Fetch all users eligible for news emails. No parameters required.
export const getAllusersforNewsEmail = async () => {

    try{
        const mongoose = await connectToDatabase();
        const db = mongoose.connection.db;

        if(!db) throw new Error('MongoDB connection error');

        // Try a few likely collections used by auth providers
        const candidateCollections = ['users', 'auth_users', 'authUsers', 'user'];

        let chosenCollection: string | null = null;
        let docs: any[] = [];

        for (const col of candidateCollections) {
            try {
                const exists = await db.listCollections({ name: col }).hasNext();
                if (!exists) continue;

                const found = await db
                    .collection(col)
                    .find(
                        // Look for email in common shapes
                        {
                            $or: [
                                { email: { $exists: true, $ne: null } },
                                { 'emails.0.email': { $exists: true, $ne: null } },
                                { 'profile.email': { $exists: true, $ne: null } },
                            ],
                        },
                        { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1, emails: 1, profile: 1 } }
                    )
                    .toArray();

                if (Array.isArray(found) && found.length > 0) {
                    chosenCollection = col;
                    docs = found;
                    break;
                }
            } catch (e) {
                // ignore and try next
            }
        }

        // If still none, at least attempt the default 'users' without existence check
        if (!chosenCollection) {
            try {
                const fallback = await db
                    .collection('users')
                    .find({}, { projection: { _id: 1, id: 1, email: 1, name: 1, country: 1, emails: 1, profile: 1 } })
                    .toArray();
                if (Array.isArray(fallback) && fallback.length > 0) {
                    chosenCollection = 'users';
                    docs = fallback;
                }
            } catch (e) {
                // ignore
            }
        }

        const rawCount = Array.isArray(docs) ? docs.length : 0;

        // Normalize email from various shapes
        const getEmail = (u: any): string | null => {
            if (typeof u?.email === 'string' && u.email.trim().length > 0) return String(u.email).trim();
            const emailsArr = Array.isArray(u?.emails) ? u.emails : [];
            if (emailsArr.length > 0 && typeof emailsArr[0]?.email === 'string') return String(emailsArr[0].email).trim();
            if (typeof u?.profile?.email === 'string' && u.profile.email.trim().length > 0) return String(u.profile.email).trim();
            return null;
        };

        const sanitized = (docs || [])
            .map((user) => {
                const email = getEmail(user);
                return email
                    ? {
                          id: user.id || user._id?.toString(),
                          email,
                          name:
                              user.name && String(user.name).trim().length > 0
                                  ? String(user.name).trim()
                                  : email.split('@')[0],
                      }
                    : null;
            })
            .filter(Boolean) as Array<{ id?: string; email: string; name?: string }>;

        console.info(
            '[daily-news] users query count:',
            rawCount,
            'after filter:',
            sanitized.length,
            'collection:',
            chosenCollection || 'unknown'
        );

        // If nothing found, log available collections once to aid debugging
        if (sanitized.length === 0) {
            try {
                const colls = await db.listCollections().toArray();
                console.info('[daily-news] available collections:', colls.map((c: any) => c.name));
            } catch (e) {
                // ignore
            }
        }

        return sanitized;
    }catch(err){
        console.error('error fetching users for news email :',err)
        return []
    }
}