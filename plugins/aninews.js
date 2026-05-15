/*
 * ======= • ======= • ======= • ======= • =======• =======
 * AniNews Plugin — Anime News for Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/AniNewsAPI
 *
 * @description
 *   Fetches latest anime news from 7 sources (ANN, MAL,
 *   Crunchyroll, Anime Corner, Otaku USA, Anime Herald,
 *   Comic Book). Supports search, pagination, source
 *   filtering, and full article extraction.
 *
 * @commands
 *   /animenews — Latest anime news
 *   /anisearch <query> — Search anime news
 *   /anitags — List news tags
 *
 * @callbacks
 *   aninews_page:<offset>     — Pagination
 *   aninews_source:<source>   — Filter by source
 *   aninews_article:<slug>    — Full article
 *   aninews_back              — Back to news list
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const API_BASE = 'https://aninews.vercel.app/api';
const PAGE_SIZE = 5;  // Articles per page (keep messages compact)
const SOURCES = {
    all: '📡 Aʟʟ Sᴏᴜʀᴄᴇs',
    ann: '📰 Aɴɪᴍᴇ Nᴇᴡs Nᴇᴛᴡᴏʀᴋ',
    animecorner: '🌸 Aɴɪᴍᴇ Cᴏʀɴᴇʀ',
    myanimelist: '📊 MʏAɴɪᴍᴇLɪsᴛ',
    crunchyroll: '🍿 Cʀᴜɴᴄʜʏʀᴏʟʟ',
    otakuusa: '🇺🇸 Oᴛᴀᴋᴜ USA',
    animeherald: '📰 Aɴɪᴍᴇ Hᴇʀᴀʟᴅ',
    comicbook: '📕 Cᴏᴍɪᴄ Bᴏᴏᴋ',
};

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

function formatDate(dateStr) {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    const day = String(d.getDate()).padStart(2, '0');
    const month = ['Jᴀɴ', 'Fᴇʙ', 'Mᴀʀ', 'Aᴘʀ', 'Mᴀʏ', 'Jᴜɴ', 'Jᴜʟ', 'Aᴜɢ', 'Sᴇᴘ', 'Oᴄᴛ', 'Nᴏᴠ', 'Dᴇᴄ'][d.getMonth()];
    const year = d.getFullYear();
    return `${day} ${month} ${year}`;
}

function sourceEmoji(source) {
    const map = {
        'Anime News Network': '📰',
        'Anime Corner': '🌸',
        'MyAnimeList': '📊',
        'Crunchyroll': '🍿',
        'Otaku USA Magazine': '🇺🇸',
        'Anime Herald': '📰',
        'Comic Book': '📕',
    };
    return map[source] || '📡';
}

// ══════════════════════════════════════════════════════════════
// MESSAGE BUILDERS
// ══════════════════════════════════════════════════════════════

function buildNewsList(data, meta, source = 'all') {
    if (!data || data.length === 0) {
        return `📭 Nᴏ Aɴɪᴍᴇ Nᴇᴡs Fᴏᴜɴᴅ. Tʀʏ Aɢᴀɪɴ Lᴀᴛᴇʀ.`;
    }

    const lines = data.map((article, i) => {
        const emoji = sourceEmoji(article.source);
        const date = formatDate(article.date);
        const tags = article.tags?.slice(0, 3).map(t => `#${t}`).join(' · ') || '';
        return `┌─${emoji} <b><a href="${article.link}">${truncate(article.title, 70)}</a></b>\n` +
               `├─ 📅 <i>${date}</i>  ·  <b>${article.source}</b>\n` +
               `├─ <i>${truncate(article.excerpt, 110)}</i>\n` +
               (tags ? `└─ 🏷️ <code>${tags}</code>` : `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`);
    }).join('\n\n');

    const sourceLabel = SOURCES[source] || '📡 Aʟʟ Sᴏᴜʀᴄᴇs';
    const page = Math.floor((meta.offset || 0) / PAGE_SIZE) + 1;
    const totalPages = Math.ceil(meta.total / PAGE_SIZE);
    const header = `╔═══════════════════════\n` +
                   `║ 🎌 <b>Aɴɪᴍᴇ Nᴇᴡs</b>\n` +
                   `║ ${sourceLabel}\n` +
                   `╟─── 📰 ${meta.total} ᴀʀᴛɪᴄʟᴇs · Pᴀɢᴇ ${page}/${totalPages}\n` +
                   `╚═══════════════════════\n\n`;

    return header + lines;
}

function buildArticle(article) {
    if (!article) return '📭 Aʀᴛɪᴄʟᴇ Nᴏᴛ Fᴏᴜɴᴅ.';

    const emoji = sourceEmoji(article.source);
    const date = formatDate(article.date);
    const tags = article.tags?.map(t => `<code>${t}</code>`).join(' · ') || '';

    let text = `╔═══════════════════════\n` +
               `║ ${emoji} <b>Aʀᴛɪᴄʟᴇ</b>\n` +
               `╚═══════════════════════\n\n` +
               `📰 <b>${article.title}</b>\n\n` +
               `┌─ 📅 <i>${date}</i>\n` +
               `├─ 📡 <b>${article.source}</b>\n`;

    if (tags) text += `├─ 🏷️ ${tags}\n`;
    text += `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n`;

    text += article.excerpt || 'Nᴏ sᴜᴍᴍᴀʀʏ ᴀᴠᴀɪʟᴀʙʟᴇ.';

    if (article.content && article.content !== article.excerpt) {
        const content = truncate(article.content, 800);
        text += `\n\n${content}`;
    }

    text += `\n\n┌─ 🔗 <a href="${article.link}">Rᴇᴀᴅ Fᴜʟʟ Aʀᴛɪᴄʟᴇ</a>\n` +
            `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;

    return text;
}

function buildNewsKeyboard(data, meta, source = 'all') {
    const keyboard = [];

    // Source filter row with emojis
    const sourceRow = [
        { text: source === 'all' ? '🌐 Aʟʟ' : 'Aʟʟ', callback_data: 'aninews_source:all' },
        { text: source === 'crunchyroll' ? '🍿 CR' : 'CR', callback_data: 'aninews_source:crunchyroll' },
        { text: source === 'ann' ? '📰 ANN' : 'ANN', callback_data: 'aninews_source:ann' },
        { text: source === 'myanimelist' ? '📊 MAL' : 'MAL', callback_data: 'aninews_source:myanimelist' },
    ];
    keyboard.push(sourceRow);

    // Article buttons (numbered with emoji)
    if (data && data.length > 0) {
        const articleRow = data.map((_, i) => ({
            text: `${sourceEmoji(data[i].source)} ${i + 1}`,
            callback_data: `aninews_article:${data[i].slug}`,
        }));
        keyboard.push(articleRow);
    }

    // Pagination row
    const paginationRow = [];
    const offset = meta.offset || 0;
    if (offset > 0) {
        paginationRow.push({ text: '◁ Pʀᴇᴠ', callback_data: `aninews_page:${Math.max(0, offset - PAGE_SIZE)}`, style: 'primary' });
    }
    if (meta.hasMore) {
        paginationRow.push({ text: 'Nᴇxᴛ ▷', callback_data: `aninews_page:${offset + PAGE_SIZE}`, style: 'primary' });
    }
    if (paginationRow.length > 0) {
        keyboard.push(paginationRow);
    }

    // Close
    keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);

    return keyboard;
}

function buildArticleKeyboard() {
    return [
        [
            { text: '◁ Bᴀᴄᴋ Tᴏ Nᴇᴡs', callback_data: 'aninews_back', style: 'primary' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
        ]
    ];
}

// ══════════════════════════════════════════════════════════════
// PLUGIN EXPORT
// ══════════════════════════════════════════════════════════════

export default {
    name: 'aninews',
    description: 'Latest anime news from 7 sources (ANN, MAL, Crunchyroll, Anime Corner, etc.)',
    version: '1.0.0',
    author: 'Shinei Nouzen',

    commands: ['/animenews', '/aninews', '/anisearch', '/anitags'],
    callbacks: ['aninews_page:', 'aninews_source:', 'aninews_article:', 'aninews_back'],

    async onCommand(cmd, args, ctx) {
        // /animenews or /aninews — show latest news
        if (cmd === '/animenews' || cmd === '/aninews') {
            const source = args?.trim()?.toLowerCase() || 'all';
            try {
                const result = await fetchAPI('/news', {
                    limit: PAGE_SIZE,
                    offset: 0,
                    source: source === 'all' ? undefined : source,
                    sort: 'latest',
                });

                const text = buildNewsList(result.data, result.meta, source);
                const keyboard = buildNewsKeyboard(result.data, result.meta, source);

                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Aɴɪᴍᴇ Nᴇᴡs.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /anisearch <query>
        if (cmd === '/anisearch') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `🔍 Usᴀɢᴇ: <code>/anisearch &lt;query&gt;</code>\n\nExᴀᴍᴘʟᴇ: <code>/anisearch Demon Slayer</code>`,
                    ctx.keyboard.close()
                );
                return;
            }

            try {
                const result = await fetchAPI('/search', {
                    q: args.trim(),
                    limit: PAGE_SIZE,
                });

                if (!result.data || result.data.length === 0) {
                    await ctx.botApi.sendMessage(ctx.chatId,
                        `🔍 Nᴏ ʀᴇsᴜʟᴛs ғᴏʀ "<b>${args.trim()}</b>". Tʀʏ ᴅɪғғᴇʀᴇɴᴛ ᴋᴇʏᴡᴏʀᴅs.`,
                        ctx.keyboard.close()
                    );
                    return;
                }

                const header = `╔═══════════════════════\n` +
                               `║ 🔍 <b>Sᴇᴀʀᴄʜ Rᴇsᴜʟᴛs</b>\n` +
                               `╟─── "${args.trim()}"\n` +
                               `╟─── 📰 ${result.meta.total} ғᴏᴜɴᴅ\n` +
                               `╚═══════════════════════\n\n`;

                const lines = result.data.map((article, i) => {
                    const emoji = sourceEmoji(article.source);
                    return `┌─${emoji} <b><a href="${article.link}">${truncate(article.title, 70)}</a></b>\n` +
                           `├─ 📅 <i>${formatDate(article.date)}</i>  ·  <b>${article.source}</b>\n` +
                           `├─ <i>${truncate(article.excerpt, 100)}</i>\n` +
                           `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
                }).join('\n\n');

                // Build keyboard with article buttons
                const keyboard = [];
                const articleRow = result.data.map((_, i) => ({
                    text: `${i + 1}`,
                    callback_data: `aninews_article:${result.data[i].slug}`,
                }));
                keyboard.push(articleRow);
                keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);

                await ctx.botApi.sendMessage(ctx.chatId, header + lines, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Sᴇᴀʀᴄʜ Fᴀɪʟᴇᴅ.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }

        // /anitags
        if (cmd === '/anitags') {
            try {
                const result = await fetchAPI('/news/tags');

                if (!result.data || result.data.length === 0) {
                    await ctx.botApi.sendMessage(ctx.chatId,
                        `📭 Nᴏ ᴛᴀɢs ᴀᴠᴀɪʟᴀʙʟᴇ.`,
                        ctx.keyboard.close()
                    );
                    return;
                }

                const lines = result.data
                    .slice(0, 30)
                    .map(t => `├─ 📌 <code>${t.name || t.tag}</code>  ·  ${t.count || 0} ᴀʀᴛɪᴄʟᴇs`)
                    .join('\n');

                await ctx.botApi.sendMessage(ctx.chatId,
                    `╔═══════════════════════\n` +
                    `║ 🏷️ <b>Aᴠᴀɪʟᴀʙʟᴇ Tᴀɢs</b>\n` +
                    `╚═══════════════════════\n\n` +
                    `${lines}\n` +
                    `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─\n\n` +
                    `<i>Usᴇ <code>/animenews</code> Tᴏ ʙʀᴏᴡsᴇ ɴᴇᴡs.</i>`,
                    ctx.keyboard.close()
                );
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId,
                    `⚠️ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Tᴀɢs.\n<code>${error.message}</code>`,
                    ctx.keyboard.close()
                );
            }
            return;
        }
    },

    async onCallback(data, ctx) {
        // Pagination: aninews_page:<offset>
        if (data.startsWith('aninews_page:')) {
            const offset = parseInt(data.split(':')[1], 10) || 0;
            try {
                const result = await fetchAPI('/news', {
                    limit: PAGE_SIZE,
                    offset,
                    sort: 'latest',
                });

                const text = buildNewsList(result.data, result.meta, 'all');
                const keyboard = buildNewsKeyboard(result.data, result.meta, 'all');

                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId,
                    `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Source filter: aninews_source:<source>
        if (data.startsWith('aninews_source:')) {
            const source = data.split(':')[1];
            try {
                const result = await fetchAPI('/news', {
                    limit: PAGE_SIZE,
                    offset: 0,
                    source: source === 'all' ? undefined : source,
                    sort: 'latest',
                });

                const text = buildNewsList(result.data, result.meta, source);
                const keyboard = buildNewsKeyboard(result.data, result.meta, source);

                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId,
                    `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Full article: aninews_article:<slug>
        if (data.startsWith('aninews_article:')) {
            const slug = data.replace('aninews_article:', '');
            try {
                const result = await fetchAPI(`/news/${slug}`);
                const text = buildArticle(result.data);
                const keyboard = buildArticleKeyboard();

                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId,
                    `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Back to news list: aninews_back
        if (data === 'aninews_back') {
            try {
                const result = await fetchAPI('/news', {
                    limit: PAGE_SIZE,
                    offset: 0,
                    sort: 'latest',
                });

                const text = buildNewsList(result.data, result.meta, 'all');
                const keyboard = buildNewsKeyboard(result.data, result.meta, 'all');

                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId,
                    `⚠️ ${error.message}`, true);
            }
            return;
        }
    },
};
