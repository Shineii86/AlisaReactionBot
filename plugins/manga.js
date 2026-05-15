/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Manga Plugin — Manga & Manhwa for Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/ShineiAPI
 *
 * @description
 *   Search manga, manhwa & webtoons. Browse popular, trending,
 *   top rated, random discovery, release schedules, and genres.
 *   Powered by ShineiAPI (free, no auth required).
 *
 * @commands
 *   /manga <query> — Search manga/manhwa
 *   /mangapopular — Popular & trending
 *   /mangatop — Top rated series
 *   /mangarandom — Random discovery
 *   /mangaschedule [day] — Release schedule
 *   /mangagenres — Available genres
 *
 * @callbacks
 *   manga_detail:<slug>     — Series detail
 *   manga_chapters:<slug>   — Chapter list
 *   manga_popular:<type>    — Popular filter (manga/manhwa)
 *   manga_schedule:<day>    — Day schedule
 *   manga_random            — New random
 *   manga_back              — Back to list
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const API_BASE = 'https://shineiapi.vercel.app/api/v1';
const PAGE_SIZE = 5;

const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const TYPE_EMOJI = { manga: '📕', manhwa: '📖', webtoon: '📜', novel: '📚' };
const STATUS_EMOJI = { ongoing: '🟢', completed: '✅', hiatus: '⏸️', cancelled: '❌' };

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

async function fetchAPI(endpoint, params = {}) {
    const url = new URL(`${API_BASE}${endpoint}`);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
        signal: AbortSignal.timeout(8000),
        headers: { 'User-Agent': 'AlisaReactionBot/1.0' }
    });
    if (!res.ok) throw new Error(`API ${res.status}: ${res.statusText}`);
    return res.json();
}

function truncate(text, max = 200) {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
}

function formatRating(rating) {
    if (!rating) return '—';
    const stars = Math.round(rating / 2);
    return '⭐'.repeat(Math.min(stars, 5)) + ` (${rating})`;
}

function formatGenres(genres) {
    if (!genres || genres.length === 0) return '';
    return genres.slice(0, 5).map(g => `<code>${g}</code>`).join(' · ');
}

function typeEmoji(type) {
    return TYPE_EMOJI[type?.toLowerCase()] || '📚';
}

function statusEmoji(status) {
    return STATUS_EMOJI[status?.toLowerCase()] || '❓';
}

// ══════════════════════════════════════════════════════════════
// MESSAGE BUILDERS
// ══════════════════════════════════════════════════════════════

function buildSeriesList(data, title = 'Sᴇʀɪᴇs') {
    if (!data || data.length === 0) {
        return `📭 Nᴏ sᴇʀɪᴇs ғᴏᴜɴᴅ.`;
    }

    const lines = data.map((s, i) => {
        const emoji = typeEmoji(s.type);
        const status = statusEmoji(s.status);
        const rating = s.rating ? `⭐ ${s.rating}` : '';
        const chapters = s.chapters_count ? `📖 ${s.chapters_count} ᴄʜ.` : '';
        const meta = [rating, chapters, status].filter(Boolean).join(' · ');
        const genres = formatGenres(s.genres);
        return `┌─${emoji} <b><a href="https://shineiapi.vercel.app/series/${s.slug}">${truncate(s.title, 60)}</a></b>\n` +
               `├─ ${meta}\n` +
               (genres ? `├─ 🏷️ ${genres}\n` : '') +
               `├─ <i>${truncate(s.synopsis || s.description || '', 100)}</i>\n` +
               `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
    }).join('\n\n');

    return `╔═══════════════════════\n` +
           `║ 📚 <b>${title}</b>\n` +
           `╟─── ${data.length} sᴇʀɪᴇs\n` +
           `╚═══════════════════════\n\n` + lines;
}

function buildSeriesDetail(s) {
    if (!s) return '📭 Sᴇʀɪᴇs Nᴏᴛ Fᴏᴜɴᴅ.';

    const emoji = typeEmoji(s.type);
    const status = statusEmoji(s.status);
    const genres = formatGenres(s.genres);
    const altTitles = s.alt_titles?.slice(0, 3).map(t => `<i>${t}</i>`).join(', ') || '';

    let text = `╔═══════════════════════\n` +
               `║ ${emoji} <b>Sᴇʀɪᴇs Dᴇᴛᴀɪʟ</b>\n` +
               `╚═══════════════════════\n\n` +
               `📰 <b>${s.title}</b>\n`;

    if (altTitles) text += `📝 ${altTitles}\n`;
    text += '\n';

    text += `┌─ ${status} <b>${s.status || 'Unknown'}</b>  ·  ${emoji} <b>${s.type || 'Unknown'}</b>\n`;

    if (s.rating) text += `├─ ${formatRating(s.rating)}\n`;
    if (s.chapters_count) text += `├─ 📖 <b>${s.chapters_count}</b> ᴄʜᴀᴘᴛᴇʀs\n`;
    if (s.authors?.length) text += `├─ ✍️ ${s.authors.join(', ')}\n`;
    if (s.artists?.length) text += `├─ 🎨 ${s.artists.join(', ')}\n`;
    if (genres) text += `├─ 🏷️ ${genres}\n`;
    text += `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n`;

    const synopsis = s.synopsis || s.description || 'Nᴏ sʏɴᴏᴘsɪs ᴀᴠᴀɪʟᴀʙʟᴇ.';
    text += truncate(synopsis, 600);

    if (s.popularity_rank) {
        text += `\n\n🏆 Pᴏᴘᴜʟᴀʀɪᴛʏ: #${s.popularity_rank}`;
    }

    return text;
}

function buildSeriesDetailKeyboard(slug) {
    return [
        [
            { text: '📖 Cʜᴀᴘᴛᴇʀs', callback_data: `manga_chapters:${slug}`, style: 'success' },
            { text: '🎲 Rᴀɴᴅᴏᴍ', callback_data: 'manga_random', style: 'primary' },
        ],
        [
            { text: '◁ Bᴀᴄᴋ', callback_data: 'manga_back', style: 'primary' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
        ]
    ];
}

function buildChapterList(chapters, seriesTitle) {
    if (!chapters || chapters.length === 0) {
        return `📭 Nᴏ ᴄʜᴀᴘᴛᴇʀs ᴀᴠᴀɪʟᴀʙʟᴇ.`;
    }

    const lines = chapters.slice(0, 15).map((ch, i) => {
        const date = ch.date ? new Date(ch.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) : '';
        const locked = ch.locked ? ' 🔒' : '';
        return `├─ <b>Ch. ${ch.number || ch.chapter || i + 1}</b>${locked}  ${ch.title || ''}  <i>${date}</i>`;
    }).join('\n');

    return `╔═══════════════════════\n` +
           `║ 📖 <b>Cʜᴀᴘᴛᴇʀs</b>\n` +
           `╟─── ${seriesTitle}\n` +
           `╚═══════════════════════\n\n` +
           `${lines}\n` +
           `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n` +
           `<i>Sʜᴏᴡɪɴɢ ${Math.min(15, chapters.length)} ᴏғ ${chapters.length}</i>`;
}

function buildSchedule(data, day) {
    if (!data || data.length === 0) {
        return `📭 Nᴏ sᴇʀɪᴇs sᴄʜᴇᴅᴜʟᴇᴅ ғᴏʀ ${day}.`;
    }

    const lines = data.map((s, i) => {
        const emoji = typeEmoji(s.type);
        return `├─${emoji} <b>${truncate(s.title, 50)}</b>  ${s.status || ''}`;
    }).join('\n');

    return `╔═══════════════════════\n` +
           `║ 📅 <b>Rᴇʟᴇᴀsᴇ Sᴄʜᴇᴅᴜʟᴇ</b>\n` +
           `╟─── ${day.charAt(0).toUpperCase() + day.slice(1)}\n` +
           `╚═══════════════════════\n\n` +
           `${lines}\n` +
           `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
}

function buildGenres(data) {
    if (!data || data.length === 0) return `📭 Nᴏ ɢᴇɴʀᴇs ᴀᴠᴀɪʟᴀʙʟᴇ.`;

    const lines = data.map(g => `├─ 📌 <code>${g.name || g}</code>${g.count ? `  ·  ${g.count} sᴇʀɪᴇs` : ''}`).join('\n');

    return `╔═══════════════════════\n` +
           `║ 🏷️ <b>Gᴇɴʀᴇs</b>\n` +
           `╚═══════════════════════\n\n` +
           `${lines}\n` +
           `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n` +
           `<i>Usᴇ <code>/manga genre:action</code> ᴛᴏ ғɪʟᴛᴇʀ.</i>`;
}

function buildListKeyboard(items, callbackPrefix, backCallback = 'manga_back') {
    const keyboard = [];

    // Numbered buttons for items
    if (items && items.length > 0) {
        const row = items.slice(0, 5).map((item, i) => ({
            text: `${typeEmoji(item.type)} ${i + 1}`,
            callback_data: `${callbackPrefix}:${item.slug}`,
        }));
        keyboard.push(row);
    }

    keyboard.push([
        { text: '🎲 Rᴀɴᴅᴏᴍ', callback_data: 'manga_random', style: 'success' },
        { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
    ]);

    return keyboard;
}

function buildScheduleKeyboard(currentDay) {
    const keyboard = [];
    const row1 = DAYS.slice(0, 4).map(d => ({
        text: d === currentDay ? `☑️ ${d.slice(0, 3)}` : d.slice(0, 3),
        callback_data: `manga_schedule:${d}`,
        style: d === currentDay ? 'success' : 'primary',
    }));
    const row2 = DAYS.slice(4).map(d => ({
        text: d === currentDay ? `☑️ ${d.slice(0, 3)}` : d.slice(0, 3),
        callback_data: `manga_schedule:${d}`,
        style: d === currentDay ? 'success' : 'primary',
    }));
    keyboard.push(row1, row2);
    keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);
    return keyboard;
}

// ══════════════════════════════════════════════════════════════
// PLUGIN EXPORT
// ══════════════════════════════════════════════════════════════

export default {
    name: 'manga',
    description: 'Search manga, manhwa & webtoons — popular, top rated, random, schedules, genres',
    version: '1.0.0',
    author: 'Shinei Nouzen',

    commands: ['/manga', '/mangapopular', '/mangatop', '/mangarandom', '/mangaschedule', '/mangagenres'],
    callbacks: ['manga_detail:', 'manga_chapters:', 'manga_popular:', 'manga_schedule:', 'manga_random', 'manga_back'],

    async onCommand(cmd, args, ctx) {
        // /manga <query> — Search
        if (cmd === '/manga') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `🔍 Usᴀɢᴇ: <code>/manga &lt;query&gt;</code>\n\n` +
                    `Exᴀᴍᴘʟᴇs:\n` +
                    `• <code>/manga Naruto</code>\n` +
                    `• <code>/manga Solo Leveling</code>\n` +
                    `• <code>/manga genre:action</code>`,
                    ctx.keyboard.close()
                );
                return;
            }

            try {
                const query = args.trim();
                // Check if it's a genre filter
                if (query.startsWith('genre:')) {
                    const genre = query.replace('genre:', '').trim();
                    const result = await fetchAPI('/series', { genre, limit: PAGE_SIZE });
                    const data = result.data || result;
                    const text = buildSeriesList(Array.isArray(data) ? data : [], `Gᴇɴʀᴇ: ${genre}`);
                    const keyboard = buildListKeyboard(Array.isArray(data) ? data : [], 'manga_detail');
                    await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
                } else {
                    const result = await fetchAPI('/search', { q: query, limit: PAGE_SIZE });
                    const data = result.data || result;
                    const text = buildSeriesList(Array.isArray(data) ? data : [], `Sᴇᴀʀᴄʜ: ${query}`);
                    const keyboard = buildListKeyboard(Array.isArray(data) ? data : [], 'manga_detail');
                    await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Sᴇᴀʀᴄʜ Fᴀɪʟᴇᴅ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /mangapopular
        if (cmd === '/mangapopular') {
            try {
                const result = await fetchAPI('/popular', { type: 'manga', limit: PAGE_SIZE });
                const data = result.data || result;
                const text = buildSeriesList(Array.isArray(data) ? data : [], 'Pᴏᴘᴜʟᴀʀ Mᴀɴɢᴀ');
                const keyboard = [
                    [
                        { text: '📕 Mᴀɴɢᴀ', callback_data: 'manga_popular:manga', style: 'success' },
                        { text: '📖 Mᴀɴʜᴡᴀ', callback_data: 'manga_popular:manhwa', style: 'primary' },
                    ],
                    ...buildListKeyboard(Array.isArray(data) ? data : [], 'manga_detail').slice(0, -1),
                    [{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]
                ];
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Pᴏᴘᴜʟᴀʀ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /mangatop
        if (cmd === '/mangatop') {
            try {
                const result = await fetchAPI('/top', { limit: PAGE_SIZE });
                const data = result.data || result;
                const text = buildSeriesList(Array.isArray(data) ? data : [], 'Tᴏᴘ Rᴀᴛᴇᴅ');
                const keyboard = buildListKeyboard(Array.isArray(data) ? data : [], 'manga_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Tᴏᴘ Rᴀᴛᴇᴅ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /mangarandom
        if (cmd === '/mangarandom') {
            try {
                const result = await fetchAPI('/random');
                const s = result.data || result;
                if (Array.isArray(s)) {
                    const text = buildSeriesList(s, 'Rᴀɴᴅᴏᴍ Dɪsᴄᴏᴠᴇʀʏ');
                    const keyboard = buildListKeyboard(s, 'manga_detail');
                    await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
                } else {
                    const text = buildSeriesDetail(s);
                    const keyboard = buildSeriesDetailKeyboard(s.slug);
                    await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Rᴀɴᴅᴏᴍ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /mangaschedule [day]
        if (cmd === '/mangaschedule') {
            const day = args?.trim()?.toLowerCase() || DAYS[new Date().getDay() === 0 ? 6 : new Date().getDay() - 1];
            try {
                const result = await fetchAPI('/schedule', { day });
                const data = result.data || result;
                const text = buildSchedule(Array.isArray(data) ? data : [], day);
                const keyboard = buildScheduleKeyboard(day);
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Sᴄʜᴇᴅᴜʟᴇ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /mangagenres
        if (cmd === '/mangagenres') {
            try {
                const result = await fetchAPI('/genres');
                const data = result.data || result;
                const text = buildGenres(Array.isArray(data) ? data : []);
                await ctx.botApi.sendMessage(ctx.chatId, text, ctx.keyboard.close());
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Gᴇɴʀᴇs.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }
    },

    async onCallback(data, ctx) {
        // Series detail: manga_detail:<slug>
        if (data.startsWith('manga_detail:')) {
            const slug = data.replace('manga_detail:', '');
            try {
                const result = await fetchAPI(`/series/${slug}`);
                const s = result.data || result;
                const text = buildSeriesDetail(s);
                const keyboard = buildSeriesDetailKeyboard(slug);
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Chapter list: manga_chapters:<slug>
        if (data.startsWith('manga_chapters:')) {
            const slug = data.replace('manga_chapters:', '');
            try {
                const seriesRes = await fetchAPI(`/series/${slug}`);
                const chaptersRes = await fetchAPI(`/series/${slug}/chapters`);
                const s = seriesRes.data || seriesRes;
                const chapters = chaptersRes.data || chaptersRes;
                const text = buildChapterList(Array.isArray(chapters) ? chapters : [], s.title || slug);
                const keyboard = [
                    [{ text: '◁ Bᴀᴄᴋ Tᴏ Dᴇᴛᴀɪʟ', callback_data: `manga_detail:${slug}`, style: 'primary' },
                     { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]
                ];
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Popular filter: manga_popular:<type>
        if (data.startsWith('manga_popular:')) {
            const type = data.replace('manga_popular:', '');
            try {
                const result = await fetchAPI('/popular', { type, limit: PAGE_SIZE });
                const items = result.data || result;
                const text = buildSeriesList(Array.isArray(items) ? items : [], `Pᴏᴘᴜʟᴀʀ ${type.charAt(0).toUpperCase() + type.slice(1)}`);
                const keyboard = [
                    [
                        { text: type === 'manga' ? '☑️ Mᴀɴɢᴀ' : 'Mᴀɴɢᴀ', callback_data: 'manga_popular:manga', style: type === 'manga' ? 'success' : 'primary' },
                        { text: type === 'manhwa' ? '☑️ Mᴀɴʜᴡᴀ' : 'Mᴀɴʜᴡᴀ', callback_data: 'manga_popular:manhwa', style: type === 'manhwa' ? 'success' : 'primary' },
                    ],
                    ...buildListKeyboard(Array.isArray(items) ? items : [], 'manga_detail').slice(0, -1),
                    [{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]
                ];
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Schedule: manga_schedule:<day>
        if (data.startsWith('manga_schedule:')) {
            const day = data.replace('manga_schedule:', '');
            try {
                const result = await fetchAPI('/schedule', { day });
                const items = result.data || result;
                const text = buildSchedule(Array.isArray(items) ? items : [], day);
                const keyboard = buildScheduleKeyboard(day);
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Random: manga_random
        if (data === 'manga_random') {
            try {
                const result = await fetchAPI('/random');
                const s = result.data || result;
                if (Array.isArray(s)) {
                    const text = buildSeriesList(s, 'Rᴀɴᴅᴏᴍ Dɪsᴄᴏᴠᴇʀʏ');
                    const keyboard = buildListKeyboard(s, 'manga_detail');
                    await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
                } else {
                    const text = buildSeriesDetail(s);
                    const keyboard = buildSeriesDetailKeyboard(s.slug);
                    await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Back: manga_back
        if (data === 'manga_back') {
            try {
                const result = await fetchAPI('/popular', { limit: PAGE_SIZE });
                const items = result.data || result;
                const text = buildSeriesList(Array.isArray(items) ? items : [], 'Pᴏᴘᴜʟᴀʀ');
                const keyboard = buildListKeyboard(Array.isArray(items) ? items : [], 'manga_detail');
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }
    },
};
