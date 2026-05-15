/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Kitsu Plugin — Anime & Manga for Alisa Reaction Bot
 * Repository: https://github.com/kitsu
 *
 * @description
 *   Search anime & manga via Kitsu JSON:API. Browse trending,
 *   categories, and get streaming links. Free, no auth.
 *
 * @commands
 *   /kitsu <query> — Search anime
 *   /kitsumanga <query> — Search manga
 *   /kitsutrending — Trending anime
 *   /kitcategories — Browse categories
 *
 * @callbacks
 *   kitsu_detail:<id>:<type> — Detail view
 *   kitsu_trending:<offset>  — Trending page
 *   kitsu_cat:<id>           — Category filter
 *   kitsu_back               — Back to list
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const API_BASE = 'https://kitsu.io/api/edge';
const PAGE_SIZE = 5;

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

async function fetchAPI(endpoint, params = {}) {
    const url = new URL(`${API_BASE}${endpoint}`);
    for (const [k, v] of Object.entries(params)) {
        if (v !== undefined && v !== null) url.searchParams.set(k, v);
    }
    const res = await fetch(url.toString(), {
        headers: { 'Accept': 'application/vnd.api+json', 'User-Agent': 'AlisaReactionBot/1.0' },
        signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`Kitsu ${res.status}`);
    const json = await res.json();
    return json.data;
}

function truncate(text, max = 200) {
    if (!text) return '';
    return text.length > max ? text.slice(0, max) + '…' : text;
}

function getAttr(data) {
    return data?.attributes || data || {};
}

function getCover(d) {
    const a = getAttr(d);
    return a.coverImage?.large || a.coverImage?.original || a.posterImage?.large || null;
}

function getPoster(d) {
    const a = getAttr(d);
    return a.posterImage?.large || a.posterImage?.medium || null;
}

function getTitle(d) {
    const a = getAttr(d);
    return a.titles?.en || a.titles?.en_jp || a.canonicalTitle || a.slug;
}

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function statusEmoji(s) {
    return { current: '🟢', finished: '✅', upcoming: '🔜', tba: '❓' }[s] || '❓';
}

function ratingStars(rating) {
    if (!rating) return '—';
    const score = parseFloat(rating);
    const stars = Math.round(score / 20);
    return '⭐'.repeat(Math.min(stars, 5)) + ` (${score.toFixed(1)})`;
}

// ══════════════════════════════════════════════════════════════
// MESSAGE BUILDERS
// ══════════════════════════════════════════════════════════════

function buildList(data, title = 'Sᴇᴀʀᴄʜ') {
    if (!data || data.length === 0) return `📭 Nᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ.`;

    const lines = data.map((d, i) => {
        const a = getAttr(d);
        const name = getTitle(d);
        const meta = [
            formatEnum(a.subtype),
            a.episodeCount ? `${a.episodeCount}ᴇᴘ` : '',
            a.startDate?.slice(0, 4),
            a.averageRating ? `⭐ ${a.averageRating}` : '',
        ].filter(Boolean).join(' · ');
        const genres = a.categories?.slice(0, 3).join(', ') || '';
        return `┌─🎬 <b>${truncate(name, 55)}</b>\n` +
               `├─ ${meta}\n` +
               (genres ? `├─ 🏷️ <code>${genres}</code>\n` : '') +
               `├─ ${statusEmoji(a.status)} ${formatEnum(a.status)}\n` +
               `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
    }).join('\n\n');

    return `╔═══════════════════════\n` +
           `║ 🦊 <b>Kɪᴛsᴜ · ${title}</b>\n` +
           `╟─── ${data.length} ʀᴇsᴜʟᴛs\n` +
           `╚═══════════════════════\n\n` + lines;
}

function formatEnum(val) {
    if (!val) return '';
    return val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function buildDetail(d) {
    if (!d) return '📭 Nᴏᴛ ꜰᴏᴜɴᴅ.';
    const a = getAttr(d);
    const name = getTitle(d);

    let text = `🎬 <b>${name}</b>`;
    if (a.titles?.ja_jp) text += `\n📝 <i>${a.titles.ja_jp}</i>`;
    text += '\n\n';

    const meta = [
        formatEnum(a.subtype),
        a.episodeCount ? `${a.episodeCount} ᴇᴘɪsᴏᴅᴇs` : '',
        a.episodeLength ? `${a.episodeLength}ᴍɪɴ/ᴇᴘ` : '',
        a.startDate ? `📅 ${formatDate(a.startDate)}` : '',
    ].filter(Boolean).join(' · ');
    text += `${meta}\n`;

    if (a.averageRating) text += `${ratingStars(a.averageRating)}\n`;
    if (a.popularityRank) text += `🏆 Pᴏᴘᴜʟᴀʀɪᴛʏ: #${a.popularityRank}\n`;
    if (a.favoritesCount) text += `❤️ ${a.favoritesCount.toLocaleString()} ꜰᴀᴠᴏʀɪᴛᴇs\n`;

    text += `${statusEmoji(a.status)} ${formatEnum(a.status)}\n`;

    const desc = truncate(a.synopsis, 400);
    if (desc) text += `\n${desc}`;

    return text;
}

function buildListKeyboard(data, callbackPrefix) {
    const keyboard = [];
    if (data?.length > 0) {
        const row = data.slice(0, 5).map((d, i) => ({
            text: `${i + 1}`,
            callback_data: `${callbackPrefix}:${d.id}:anime`,
        }));
        keyboard.push(row);
    }
    keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);
    return keyboard;
}

// ══════════════════════════════════════════════════════════════
// PLUGIN EXPORT
// ══════════════════════════════════════════════════════════════

export default {
    name: 'kitsu',
    description: 'Anime & manga via Kitsu — search, trending, categories',
    version: '1.0.0',
    author: 'Shinei Nouzen',

    commands: ['/kitsu', '/kitsumanga', '/kitsutrending', '/kitcategories'],
    callbacks: ['kitsu_detail:', 'kitsu_trending:', 'kitsu_cat:', 'kitsu_back'],

    async onCommand(cmd, args, ctx) {
        // /kitsu <query>
        if (cmd === '/kitsu') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId, `🔍 Usᴀɢᴇ: <code>/kitsu &lt;anime name&gt;</code>`, ctx.keyboard.close());
                return;
            }
            try {
                const data = await fetchAPI('/anime', {
                    'filter[text]': args.trim(),
                    'page[limit]': PAGE_SIZE,
                    'page[offset]': 0,
                    include: 'categories',
                });
                const text = buildList(data, args.trim());
                const keyboard = buildListKeyboard(data, 'kitsu_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /kitsumanga <query>
        if (cmd === '/kitsumanga') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId, `🔍 Usᴀɢᴇ: <code>/kitsumanga &lt;manga name&gt;</code>`, ctx.keyboard.close());
                return;
            }
            try {
                const data = await fetchAPI('/manga', {
                    'filter[text]': args.trim(),
                    'page[limit]': PAGE_SIZE,
                    include: 'categories',
                });
                const text = buildList(data, args.trim());
                const keyboard = buildListKeyboard(data, 'kitsu_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /kitsutrending
        if (cmd === '/kitsutrending') {
            try {
                const data = await fetchAPI('/trending/anime', { 'page[limit]': PAGE_SIZE });
                const text = buildList(data, 'Tʀᴇɴᴅɪɴɢ');
                const keyboard = buildListKeyboard(data, 'kitsu_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /kitcategories
        if (cmd === '/kitcategories') {
            try {
                const data = await fetchAPI('/categories', {
                    'page[limit]': 20,
                    sort: '-totalMediaCount',
                });
                const lines = data.map(c => {
                    const a = getAttr(c);
                    return `├─ 📌 <code>${a.title}</code>  ·  ${a.totalMediaCount || 0} ᴍᴇᴅɪᴀ`;
                }).join('\n');

                await ctx.botApi.sendMessage(ctx.chatId,
                    `╔═══════════════════════\n` +
                    `║ 🏷️ <b>Kɪᴛsᴜ Cᴀᴛᴇɢᴏʀɪᴇs</b>\n` +
                    `╚═══════════════════════\n\n` +
                    `${lines}\n` +
                    `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n` +
                    `<i>Usᴇ <code>/kitsu</code> ᴛᴏ sᴇᴀʀᴄʜ.</i>`,
                    ctx.keyboard.close()
                );
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }
    },

    async onCallback(data, ctx) {
        // Detail: kitsu_detail:<id>:<type>
        if (data.startsWith('kitsu_detail:')) {
            const [, id, type] = data.split(':');
            try {
                const endpoint = type === 'manga' ? `/manga/${id}` : `/anime/${id}`;
                const d = await fetchAPI(endpoint, { include: 'categories' });
                const a = getAttr(d);
                const text = buildDetail(d);
                const keyboard = [
                    [{ text: '◁ Bᴀᴄᴋ', callback_data: 'kitsu_back', style: 'primary' },
                     { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]
                ];

                const cover = getCover(d) || getPoster(d);
                if (cover) {
                    try {
                        await ctx.botApi.editMessageMedia(ctx.chatId, ctx.messageId, {
                            type: 'photo',
                            media: cover,
                            caption: getTitle(d),
                            parse_mode: 'HTML'
                        }, keyboard);
                    } catch {
                        try { await ctx.botApi.deleteMessage(ctx.chatId, ctx.messageId); } catch {}
                        await ctx.botApi.sendPhoto(ctx.chatId, cover, text, keyboard);
                    }
                } else {
                    await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Trending page: kitsu_trending:<offset>
        if (data.startsWith('kitsu_trending:')) {
            const offset = parseInt(data.split(':')[1], 10) || 0;
            try {
                const trending = await fetchAPI('/trending/anime', { 'page[limit]': PAGE_SIZE });
                const text = buildList(trending, 'Tʀᴇɴᴅɪɴɢ');
                const keyboard = buildListKeyboard(trending, 'kitsu_detail');
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Category: kitsu_cat:<id>
        if (data.startsWith('kitsu_cat:')) {
            const catId = data.split(':')[1];
            try {
                const d = await fetchAPI(`/categories/${catId}`);
                const a = getAttr(d);
                const anime = await fetchAPI('/anime', {
                    'filter[categories]': a.slug,
                    'page[limit]': PAGE_SIZE,
                    sort: '-averageRating',
                });
                const text = buildList(anime, a.title);
                const keyboard = buildListKeyboard(anime, 'kitsu_detail');
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Back: kitsu_back
        if (data === 'kitsu_back') {
            try {
                const trending = await fetchAPI('/trending/anime', { 'page[limit]': PAGE_SIZE });
                const text = buildList(trending, 'Tʀᴇɴᴅɪɴɢ');
                const keyboard = buildListKeyboard(trending, 'kitsu_detail');
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }
    },
};
