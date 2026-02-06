import {inngest} from "@/lib/Inngest/client";
import {NEWS_SUMMARY_EMAIL_PROMPT, PERSONALIZED_WELCOME_EMAIL_PROMPT} from "@/lib/Inngest/prompts";
import {sendDailyNewsEmail, sendWelcomeEmail} from "@/lib/nodemailer";
import {getAllusersforNewsEmail} from "@/lib/actions/user.actons";
import { getWatchlistSymbolsByEmail } from "@/lib/actions/watchlist.actions";
import { getNews } from "@/lib/actions/finnhub.actions";
import {formatDateToday, getFormattedTodayDate} from "@/lib/utils";

export const sendSignUpEmail = inngest.createFunction(
    { id: 'sign-up-email' },
    { event: 'app/user.created'},
    async ({ event, step }) => {
        const userProfile = `
            - Country: ${event.data.country}
            - Investment goals: ${event.data.investmentGoals}
            - Risk tolerance: ${event.data.riskTolerance}
            - Preferred industry: ${event.data.preferredIndustry}
        `

        const prompt = PERSONALIZED_WELCOME_EMAIL_PROMPT.replace('{{userProfile}}', userProfile)

        const response = await step.ai.infer('generate-welcome-intro', {
            model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
            body: {
                contents: [
                    {
                        role: 'user',
                        parts: [
                            { text: prompt }
                        ]
                    }]
            }
        })

        await step.run('send-welcome-email', async () => {
            const part = response.candidates?.[0]?.content?.parts?.[0];
            const introText = (part && 'text' in part ? part.text : null) ||'Thanks for joining Signalist. You now have the tools to track markets and make smarter moves.'

            const { data: { email, name } } = event;

            return await sendWelcomeEmail({ email, name, intro: introText });
        })

        return {
            success: true,
            message: 'Welcome email sent successfully'
        }
    }
)


export const sendDailyNewsSummary = inngest.createFunction(
    { id: 'daily-news-summary' },
    [
        // This function can be triggered either by an app event or on a daily schedule.
        { event: 'app/send.daily.news' },
        // Cron expression explained: '0 12 * * *'
        //   ┌─ minute (0)
        //   │  ┌─ hour (12)
        //   │  │  ┌─ day of month (*)
        //   │  │  │  ┌─ month (*)
        //   │  │  │  │  ┌─ day of week (*)
        //   0  12 *  *  *
        // Meaning: Run every day at 12:00 (noon) UTC.
        // Note: Inngest schedules run in UTC by default. To use a specific timezone, you can provide:
        //   { cron: '0 12 * * *', timezone: 'America/New_York' }
        // Run every day at 12:00 (noon) UTC
        //{ cron: '0 12 * * *' },
        // TEMP: One-off run ~5 minutes from user's local time
        // User timezone: Asia/Kolkata (IST)
        // Current local time: 2026-02-05 15:03 IST
        // Original intent was 15:08 IST; adjusting to the next near-term run for verification.
        // Current local time ~ 2026-02-05 15:42 IST; schedule a one-off at 15:47 IST today for testing.
        // Note: This cron will recur annually on the same month/day/hour/minute.
        // Remove this entry after it fires, or adjust to your desired timing.
        { cron: '30 16 * * *', timezone: 'Asia/Kolkata' }
    ],
    async ({ step }) => {
        // Step 1: get all users for news delivery
        const users = await step.run('get-all-users', getAllusersforNewsEmail);
        console.info('[daily-news] fetched users for news email:', Array.isArray(users) ? users.length : 0);

        if (!users || users.length === 0) {
            return { success: true, message: 'No users to process.' };
        }

        // Step 2: For each user, get watchlist symbols and fetch news (fallback to general if none)
        const perUser = await step.run('fetch-user-news', async () => {
            const results: Array<{
                user: { id?: string; email: string; name?: string };
                articles: MarketNewsArticle[];
            }> = [];

            for (const u of users as Array<{ id?: string; email: string; name?: string }>) {
                const user = { id: u.id, email: u.email, name: u.name };
                if (!user.email) {
                    results.push({ user, articles: [] });
                    continue;
                }

                try {
                    const symbols = await getWatchlistSymbolsByEmail(user.email);
                    let articles = await getNews(symbols && symbols.length > 0 ? symbols : undefined);

                    if (!articles || articles.length === 0) {
                        articles = await getNews();
                    }

                    results.push({ user, articles: (articles || []).slice(0, 6) });
                } catch (err) {
                    console.error('daily-news: error preparing user news', user.email, err);
                    results.push({ user, articles: [] });
                }
            }

            return results;
        });

       //step-3:
        const userNewsSummaries: {
            user: { id?: string; email: string; name?: string };
            newsContent: string | null;
        }[] = [];

        for (const { user, articles } of perUser as Array<{
            user: { id?: string; email: string; name?: string };
            articles: MarketNewsArticle[];
        }>) {
            try {
                const prompt = NEWS_SUMMARY_EMAIL_PROMPT.replace(
                    '{{newsData}}',
                    JSON.stringify(articles ?? [], null, 2)
                );
                const response = await step.ai.infer(`summarize-news-${user.email}`, {
                    model: step.ai.models.gemini({ model: 'gemini-2.5-flash-lite' }),
                    body: {
                        contents: [{ role: 'user', parts: [{ text: prompt }] }],
                    },
                });
                const part = response.candidates?.[0]?.content?.parts?.[0];
                const newsContent = (part && 'text' in part ? part.text : null) || 'no market news';

                userNewsSummaries.push({ user, newsContent });
            } catch (err) {
                console.error('failed to summarize the news for:', user.email);
                userNewsSummaries.push({ user, newsContent: null });
            }
        }
        
        //step-4:
        
        await step.run('send-news-emails',async ()=>{
            await Promise.all(
                userNewsSummaries.map(async({user,newsContent}) => {
                    if(!newsContent) return false;
                    
                    // Ensure we pass a proper formatted date string (or rely on default in mailer)
                    try {
                        console.info('[daily-news] sending email to:', user.email);
                        const res = await sendDailyNewsEmail({ email: user.email, date:formatDateToday(), newsHtml: newsContent })
                        console.info('[daily-news] sent email to:', user.email);
                        return res;
                    } catch (err) {
                        console.error('[daily-news] failed sending email to:', user.email, err);
                        return false;
                    }
                })
            )
        })

        return { success: true, processedUsers: (perUser as any[]).length, message:'Daily news Summary email sent successfully' };
    }
)