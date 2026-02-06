'use server';

import { getDateRange, validateArticle, formatArticle } from '@/lib/utils';

const FINNHUB_BASE_URL = 'https://finnhub.io/api/v1';
const NEXT_PUBLIC_FINNHUB_API_KEY = process.env.NEXT_PUBLIC_FINNHUB_API_KEY || '';

async function fetchJSON<T>(url: string, revalidateSeconds?: number): Promise<T> {
    const res = await fetch(url, revalidateSeconds
        ? { cache: 'force-cache', next: { revalidate: revalidateSeconds } }
        : { cache: 'no-store' }
    );

    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`Request failed: ${res.status} ${res.statusText} - ${text}`);
    }

    return res.json() as Promise<T>;
}

export async function getNews(symbols?: string[]): Promise<MarketNewsArticle[]> {
    try {
        const { from, to } = getDateRange(5);

        const tokenParam = `token=${encodeURIComponent(NEXT_PUBLIC_FINNHUB_API_KEY)}`;

        const cleanSymbols = (symbols || [])
            .map((s) => s?.trim().toUpperCase())
            .filter((s): s is string => !!s);

        const maxArticles = 6;

        const seen = new Set<string>();
        const addKey = (a: RawNewsArticle) => `${a.id || ''}|${a.url || ''}|${a.headline || ''}`;

        const addIfValid = (
            list: MarketNewsArticle[],
            article: RawNewsArticle,
            isCompany: boolean,
            symbol?: string,
            index: number = 0
        ) => {
            if (!validateArticle(article)) return false;
            const key = addKey(article);
            if (seen.has(key)) return false;
            const formatted = formatArticle(article, isCompany, symbol, index);
            list.push(formatted);
            seen.add(key);
            return true;
        };

        // If we have symbols, attempt round-robin company news
        if (cleanSymbols.length > 0) {
            const selected: MarketNewsArticle[] = [];

            // Pre-fetch news per symbol once to avoid repeated calls in rounds
            const perSymbolNews: Record<string, RawNewsArticle[]> = {};

            await Promise.all(
                cleanSymbols.map(async (sym) => {
                    try {
                        const url = `${FINNHUB_BASE_URL}/company-news?symbol=${encodeURIComponent(sym)}&from=${from}&to=${to}&${tokenParam}`;
                        const items = await fetchJSON<RawNewsArticle[]>(url);
                        perSymbolNews[sym] = Array.isArray(items) ? items : [];
                    } catch (e) {
                        console.error(`Error fetching company news for ${sym}:`, e);
                        perSymbolNews[sym] = [];
                    }
                })
            );

            let round = 0;
            const maxRounds = maxArticles; // at most 6 picks
            const indices: Record<string, number> = Object.fromEntries(cleanSymbols.map((s) => [s, 0]));

            while (selected.length < maxArticles && round < maxRounds) {
                const sym = cleanSymbols[round % cleanSymbols.length];
                const list = perSymbolNews[sym] || [];
                let i = indices[sym] || 0;
                let picked = false;
                while (i < list.length) {
                    const art = list[i];
                    indices[sym] = i + 1;
                    if (addIfValid(selected, art, true, sym, selected.length)) {
                        picked = true;
                        break;
                    }
                    i++;
                }
                // If nothing valid from this symbol, just advance
                round++;
                // If we tried at least one full cycle and still nothing, break to avoid infinite loop
                if (round >= maxRounds && selected.length === 0) break;
            }

            if (selected.length > 0) {
                // Sort by datetime desc
                selected.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
                return selected.slice(0, maxArticles);
            }
            // else fallthrough to general news
        }

        // General market news
        const generalUrl = `${FINNHUB_BASE_URL}/news?category=general&${tokenParam}`;
        const general = await fetchJSON<RawNewsArticle[]>(generalUrl, 300);
        const results: MarketNewsArticle[] = [];

        for (let i = 0; i < (general?.length || 0) && results.length < maxArticles; i++) {
            const art = general[i];
            addIfValid(results, art, false);
        }

        // Sort by datetime desc and return top 6
        results.sort((a, b) => (b.datetime || 0) - (a.datetime || 0));
        return results.slice(0, maxArticles);
    } catch (err) {
        console.error('Failed to get news:', err);
        throw new Error('Failed to fetch news');
    }
}


