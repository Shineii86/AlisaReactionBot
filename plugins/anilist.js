/*
 * ======= • ======= • ======= • ======= • =======• =======
 * AniList Plugin — Anime & Manga for Alisa Reaction Bot
 * Repository: https://github.com/AniListAPI
 *
 * @description
 *   Search anime, manga, characters, and studios via AniList
 *   GraphQL API. Browse trending, seasonal, and top rated.
 *   Free, no auth, unlimited requests.
 *
 * @commands
 *   /anilist <query> — Search anime
 *   /anilistmanga <query> — Search manga
 *   /anichar <query> — Search characters
 *   /anitrending — Trending anime
 *   /aniseason — Current season
 *
 * @callbacks
 *   ani_detail:<id>:<type>   — Anime/Manga detail
 *   ani_char:<id>            — Character detail
 *   ani_trending:<page>      — Trending page
 *   ani_season:<season>:<year> — Season filter
 *   ani_back                 — Back to list
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

const API_URL = 'https://graphql.anilist.co';
const PAGE_SIZE = 5;

// ══════════════════════════════════════════════════════════════
// GRAPHQL QUERIES
// ══════════════════════════════════════════════════════════════

const SEARCH_ANIME = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: ANIME, sort: POPULARITY_DESC) {
      id title { romaji english native }
      coverImage { large color }
      bannerImage
      description format status episodes chapters
      averageScore meanScore popularity
      genres season seasonYear
      studios(isMain: true) { nodes { name } }
      characters(per_page: 5, role: MAIN) { nodes { name { full } } }
      nextAiringEpisode { airingAt episode }
    }
  }
}`;

const SEARCH_MANGA = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(search: $search, type: MANGA, sort: POPULARITY_DESC) {
      id title { romaji english native }
      coverImage { large color }
      description format status chapters volumes
      averageScore meanScore popularity
      genres
      characters(per_page: 5, role: MAIN) { nodes { name { full } } }
    }
  }
}`;

const SEARCH_CHARACTER = `
query ($search: String, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    characters(search: $search, sort: FAVOURITES_DESC) {
      id name { full native alternative }
      image { large }
      description gender dateOfBirth { month day }
      favourites
      media(per_page: 5, type: ANIME) { nodes { title { romaji } format } }
    }
  }
}`;

const TRENDING = `
query ($page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, sort: TRENDING_DESC) {
      id title { romaji english }
      coverImage { large }
      format status episodes
      averageScore popularity
      genres season seasonYear
      nextAiringEpisode { airingAt episode }
    }
  }
}`;

const SEASONAL = `
query ($season: MediaSeason, $year: Int, $page: Int, $perPage: Int) {
  Page(page: $page, perPage: $perPage) {
    media(type: ANIME, season: $season, seasonYear: $year, sort: POPULARITY_DESC) {
      id title { romaji english }
      coverImage { large }
      format status episodes
      averageScore popularity
      genres
      nextAiringEpisode { airingAt episode }
    }
  }
}`;

const ANIME_DETAIL = `
query ($id: Int) {
  Media(id: $id, type: ANIME) {
    id title { romaji english native }
    coverImage { large color } bannerImage
    description format status episodes chapters
    averageScore meanScore popularity trending
    genres season seasonYear duration
    studios(isMain: true) { nodes { name siteUrl } }
    characters(per_page: 10, role: MAIN) { nodes { name { full } } }
    relations { nodes { title { romaji } type format } }
    nextAiringEpisode { airingAt episode timeUntilAiring }
    siteUrl
  }
}`;

const MANGA_DETAIL = `
query ($id: Int) {
  Media(id: $id, type: MANGA) {
    id title { romaji english native }
    coverImage { large color } bannerImage
    description format status chapters volumes
    averageScore meanScore popularity trending
    genres
    characters(per_page: 10, role: MAIN) { nodes { name { full } } }
    siteUrl
  }
}`;

// ══════════════════════════════════════════════════════════════
// HELPERS
// ══════════════════════════════════════════════════════════════

async function graphql(query, variables = {}) {
    const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify({ query, variables }),
        signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) throw new Error(`AniList ${res.status}`);
    const json = await res.json();
    if (json.errors) throw new Error(json.errors[0].message);
    return json.data;
}

function truncate(text, max = 200) {
    if (!text) return '';
    // Strip HTML tags from AniList descriptions
    const clean = text.replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '');
    return clean.length > max ? clean.slice(0, max) + '…' : clean;
}

function scoreBar(score) {
    if (!score) return '—';
    const filled = Math.round(score / 10);
    return '▰'.repeat(filled) + '▱'.repeat(10 - filled) + ` ${score}%`;
}

function formatEnum(val) {
    if (!val) return '';
    return val.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, c => c.toUpperCase());
}

function currentSeason() {
    const now = new Date();
    const month = now.getMonth();
    const year = now.getFullYear();
    if (month >= 0 && month <= 2) return { season: 'WINTER', year };
    if (month >= 3 && month <= 5) return { season: 'SPRING', year };
    if (month >= 6 && month <= 8) return { season: 'SUMMER', year };
    return { season: 'FALL', year };
}

function seasonEmoji(s) {
    return { WINTER: '❄️', SPRING: '🌸', SUMMER: '☀️', FALL: '🍂' }[s] || '📅';
}

// ══════════════════════════════════════════════════════════════
// MESSAGE BUILDERS
// ══════════════════════════════════════════════════════════════

function buildAnimeList(media, title = 'Sᴇᴀʀᴄʜ') {
    if (!media || media.length === 0) return `📭 Nᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ.`;

    const lines = media.map((m, i) => {
        const t = m.title.english || m.title.romaji;
        const meta = [
            formatEnum(m.format),
            m.episodes ? `${m.episodes}ᴇᴘ` : '',
            m.seasonYear ? `${seasonEmoji(m.season)} ${m.seasonYear}` : '',
            m.averageScore ? `⭐ ${m.averageScore}%` : '',
        ].filter(Boolean).join(' · ');
        const genres = m.genres?.slice(0, 3).join(', ') || '';
        return `┌─🎬 <b>${truncate(t, 55)}</b>\n` +
               `├─ ${meta}\n` +
               (genres ? `├─ 🏷️ <code>${genres}</code>\n` : '') +
               `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
    }).join('\n\n');

    return `╔═══════════════════════\n` +
           `║ 🎬 <b>AɴɪLɪsᴛ · ${title}</b>\n` +
           `╟─── ${media.length} ʀᴇsᴜʟᴛs\n` +
           `╚═══════════════════════\n\n` + lines;
}

function buildMangaList(media, title = 'Sᴇᴀʀᴄʜ') {
    if (!media || media.length === 0) return `📭 Nᴏ ʀᴇsᴜʟᴛs ғᴏᴜɴᴅ.`;

    const lines = media.map((m, i) => {
        const t = m.title.english || m.title.romaji;
        const meta = [
            formatEnum(m.format),
            m.chapters ? `${m.chapters}ᴄʜ` : '',
            m.averageScore ? `⭐ ${m.averageScore}%` : '',
        ].filter(Boolean).join(' · ');
        return `┌─📖 <b>${truncate(t, 55)}</b>\n` +
               `├─ ${meta}\n` +
               `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
    }).join('\n\n');

    return `╔═══════════════════════\n` +
           `║ 📖 <b>AɴɪLɪsᴛ Mᴀɴɢᴀ · ${title}</b>\n` +
           `╟─── ${media.length} ʀᴇsᴜʟᴛs\n` +
           `╚═══════════════════════\n\n` + lines;
}

function buildCharacterList(chars) {
    if (!chars || chars.length === 0) return `📭 Nᴏ ᴄʜᴀʀᴀᴄᴛᴇʀs ғᴏᴜɴᴅ.`;

    const lines = chars.map((c, i) => {
        const anime = c.media?.nodes?.slice(0, 2).map(a => a.title.romaji).join(', ') || '';
        return `┌─👤 <b>${c.name.full}</b>${c.name.native ? ` (${c.name.native})` : ''}\n` +
               (anime ? `├─ 🎬 ${anime}\n` : '') +
               `├─ ❤️ ${c.favourites?.toLocaleString() || 0} ꜰᴀᴠᴏᴜʀɪᴛᴇs\n` +
               `└─ ─ ─ ─ ─ ─ ─ ─ ─ ─`;
    }).join('\n\n');

    return `╔═══════════════════════\n` +
           `║ 👤 <b>Cʜᴀʀᴀᴄᴛᴇʀs</b>\n` +
           `╚═══════════════════════\n\n` + lines;
}

function buildAnimeDetail(m) {
    if (!m) return '📭 Nᴏᴛ ꜰᴏᴜɴᴅ.';

    const t = m.title.english || m.title.romaji;
    const meta = [
        formatEnum(m.format),
        m.episodes ? `${m.episodes}ᴇᴘ` : '',
        m.duration ? `${m.duration}ᴍɪɴ` : '',
        m.seasonYear ? `${seasonEmoji(m.season)} ${m.season} ${m.seasonYear}` : '',
    ].filter(Boolean).join(' · ');

    let text = `🎬 <b>${t}</b>`;
    if (m.title.native) text += `\n📝 <i>${m.title.native}</i>`;
    text += `\n\n${meta}\n`;
    text += `📊 ${scoreBar(m.averageScore)}\n`;
    if (m.popularity) text += `🔥 ${m.popularity.toLocaleString()} ᴘᴏᴘᴜʟᴀʀɪᴛʏ\n`;

    const genres = m.genres?.join(', ') || '';
    if (genres) text += `🏷️ ${genres}\n`;

    const studios = m.studios?.nodes?.map(s => s.name).join(', ') || '';
    if (studios) text += `🏢 ${studios}\n`;

    const chars = m.characters?.nodes?.map(c => c.name.full).slice(0, 5).join(', ') || '';
    if (chars) text += `\n👤 <b>Cʜᴀʀᴀᴄᴛᴇʀs:</b> ${chars}`;

    const desc = truncate(m.description, 400);
    if (desc) text += `\n\n${desc}`;

    if (m.nextAiringEpisode) {
        const ep = m.nextAiringEpisode.episode;
        const airDate = new Date(m.nextAiringEpisode.airingAt * 1000);
        text += `\n\n📺 Nᴇxᴛ: Eᴘ ${ep} — ${airDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
    }

    return text;
}

function buildCharacterDetail(c) {
    if (!c) return '📭 Nᴏᴛ ꜰᴏᴜɴᴅ.';

    let text = `👤 <b>${c.name.full}</b>`;
    if (c.name.native) text += `\n📝 <i>${c.name.native}</i>`;
    if (c.name.alternative?.length) text += `\n🔤 ${c.name.alternative.slice(0, 3).join(', ')}`;
    text += '\n';

    if (c.gender) text += `\n⚧️ ${c.gender}`;
    if (c.dateOfBirth?.month) text += ` · 🎂 ${c.dateOfBirth.month}/${c.dateOfBirth.day || '?'}`;
    text += `\n❤️ ${c.favourites?.toLocaleString() || 0} ꜰᴀᴠᴏᴜʀɪᴛᴇs`;

    const anime = c.media?.nodes?.slice(0, 5).map(a => `• ${a.title.romaji} (${formatEnum(a.format)})`).join('\n') || '';
    if (anime) text += `\n\n🎬 <b>Aᴘᴘᴇᴀʀᴀɴᴄᴇs:</b>\n${anime}`;

    const desc = truncate(c.description, 400);
    if (desc) text += `\n\n${desc}`;

    return text;
}

function buildListKeyboard(items, callbackPrefix) {
    const keyboard = [];
    if (items?.length > 0) {
        const row = items.slice(0, 5).map((item, i) => {
            const id = item.id;
            const type = item.format ? (['MANGA', 'ONE_SHOT', 'NOVEL'].includes(item.format) ? 'manga' : 'anime') : 'anime';
            return { text: `${i + 1}`, callback_data: `${callbackPrefix}:${id}:${type}` };
        });
        keyboard.push(row);
    }
    keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);
    return keyboard;
}

function buildDetailKeyboard(id, type, siteUrl) {
    const keyboard = [];
    if (siteUrl) {
        keyboard.push([{ text: '🌐 AɴɪLɪsᴛ', url: siteUrl, style: 'primary' }]);
    }
    keyboard.push([
        { text: '◁ Bᴀᴄᴋ', callback_data: 'ani_back', style: 'primary' },
        { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
    ]);
    return keyboard;
}

function buildSeasonKeyboard(current) {
    const seasons = ['WINTER', 'SPRING', 'SUMMER', 'FALL'];
    const now = currentSeason();
    const keyboard = [];
    const row = seasons.map(s => ({
        text: `${seasonEmoji(s)} ${s.slice(0, 3)}`,
        callback_data: `ani_season:${s}:${now.year}`,
        style: s === current ? 'success' : 'primary',
    }));
    keyboard.push(row);
    keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);
    return keyboard;
}

// ══════════════════════════════════════════════════════════════
// PLUGIN EXPORT
// ══════════════════════════════════════════════════════════════

export default {
    name: 'anilist',
    description: 'Anime, manga & characters via AniList — trending, seasonal, search',
    version: '1.0.0',
    author: 'Shinei Nouzen',

    commands: ['/anilist', '/anilistmanga', '/anichar', '/anitrending', '/aniseason'],
    callbacks: ['ani_detail:', 'ani_char:', 'ani_trending:', 'ani_season:', 'ani_back'],

    async onCommand(cmd, args, ctx) {
        // /anilist <query>
        if (cmd === '/anilist') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId, `🔍 Usᴀɢᴇ: <code>/anilist &lt;anime name&gt;</code>`, ctx.keyboard.close());
                return;
            }
            try {
                const data = await graphql(SEARCH_ANIME, { search: args.trim(), perPage: PAGE_SIZE });
                const media = data.Page.media;
                const text = buildAnimeList(media, args.trim());
                const keyboard = buildListKeyboard(media, 'ani_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /anilistmanga <query>
        if (cmd === '/anilistmanga') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId, `🔍 Usᴀɢᴇ: <code>/anilistmanga &lt;manga name&gt;</code>`, ctx.keyboard.close());
                return;
            }
            try {
                const data = await graphql(SEARCH_MANGA, { search: args.trim(), perPage: PAGE_SIZE });
                const media = data.Page.media;
                const text = buildMangaList(media, args.trim());
                const keyboard = buildListKeyboard(media, 'ani_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /anichar <query>
        if (cmd === '/anichar') {
            if (!args || args.trim().length < 2) {
                await ctx.botApi.sendMessage(ctx.chatId, `🔍 Usᴀɢᴇ: <code>/anichar &lt;character name&gt;</code>`, ctx.keyboard.close());
                return;
            }
            try {
                const data = await graphql(SEARCH_CHARACTER, { search: args.trim(), perPage: PAGE_SIZE });
                const chars = data.Page.characters;
                const text = buildCharacterList(chars);
                const keyboard = [];
                if (chars?.length > 0) {
                    const row = chars.slice(0, 5).map((c, i) => ({
                        text: `${i + 1}`, callback_data: `ani_char:${c.id}`,
                    }));
                    keyboard.push(row);
                }
                keyboard.push([{ text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]);
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /anitrending
        if (cmd === '/anitrending') {
            try {
                const data = await graphql(TRENDING, { perPage: PAGE_SIZE });
                const media = data.Page.media;
                const text = buildAnimeList(media, 'Tʀᴇɴᴅɪɴɢ');
                const keyboard = buildListKeyboard(media, 'ani_detail');
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }

        // /aniseason
        if (cmd === '/aniseason') {
            const { season, year } = currentSeason();
            try {
                const data = await graphql(SEASONAL, { season, year, perPage: PAGE_SIZE });
                const media = data.Page.media;
                const text = buildAnimeList(media, `${seasonEmoji(season)} ${season} ${year}`);
                const keyboard = [
                    buildSeasonKeyboard(season)[0],
                    ...buildListKeyboard(media, 'ani_detail'),
                ];
                await ctx.botApi.sendMessage(ctx.chatId, text, keyboard);
            } catch (error) {
                await ctx.botApi.sendMessage(ctx.chatId, `⚠️ ${error.message}`, ctx.keyboard.close());
            }
            return;
        }
    },

    async onCallback(data, ctx) {
        // Anime/Manga detail: ani_detail:<id>:<type>
        if (data.startsWith('ani_detail:')) {
            const [, idStr, type] = data.split(':');
            const id = parseInt(idStr, 10);
            try {
                const query = type === 'manga' ? MANGA_DETAIL : ANIME_DETAIL;
                const result = await graphql(query, { id });
                const m = result.Media;
                const text = type === 'manga' ? buildAnimeDetail(m) : buildAnimeDetail(m);
                const keyboard = buildDetailKeyboard(id, type, m.siteUrl);

                if (m.coverImage?.large) {
                    try {
                        await ctx.botApi.editMessageMedia(ctx.chatId, ctx.messageId, {
                            type: 'photo',
                            media: m.coverImage.large,
                            caption: m.title.english || m.title.romaji,
                            parse_mode: 'HTML'
                        }, keyboard);
                    } catch {
                        try { await ctx.botApi.deleteMessage(ctx.chatId, ctx.messageId); } catch {}
                        await ctx.botApi.sendPhoto(ctx.chatId, m.coverImage.large, text, keyboard);
                    }
                } else {
                    await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Character detail: ani_char:<id>
        if (data.startsWith('ani_char:')) {
            const id = parseInt(data.replace('ani_char:', ''), 10);
            try {
                const result = await graphql(`
                    query ($id: Int) {
                        Character(id: $id) {
                            id name { full native alternative }
                            image { large }
                            description gender dateOfBirth { month day }
                            favourites
                            media(per_page: 5, type: ANIME) { nodes { title { romaji } format } }
                        }
                    }`, { id });
                const c = result.Character;
                const text = buildCharacterDetail(c);
                const keyboard = [
                    [{ text: '◁ Bᴀᴄᴋ', callback_data: 'ani_back', style: 'primary' },
                     { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }]
                ];

                if (c.image?.large) {
                    try {
                        await ctx.botApi.editMessageMedia(ctx.chatId, ctx.messageId, {
                            type: 'photo',
                            media: c.image.large,
                            caption: c.name.full,
                            parse_mode: 'HTML'
                        }, keyboard);
                    } catch {
                        try { await ctx.botApi.deleteMessage(ctx.chatId, ctx.messageId); } catch {}
                        await ctx.botApi.sendPhoto(ctx.chatId, c.image.large, text, keyboard);
                    }
                } else {
                    await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
                }
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Seasonal: ani_season:<season>:<year>
        if (data.startsWith('ani_season:')) {
            const [, season, yearStr] = data.split(':');
            const year = parseInt(yearStr, 10);
            try {
                const result = await graphql(SEASONAL, { season, year, perPage: PAGE_SIZE });
                const media = result.Page.media;
                const text = buildAnimeList(media, `${seasonEmoji(season)} ${season} ${year}`);
                const keyboard = [
                    buildSeasonKeyboard(season)[0],
                    ...buildListKeyboard(media, 'ani_detail'),
                ];
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }

        // Back: ani_back
        if (data === 'ani_back') {
            try {
                const result = await graphql(TRENDING, { perPage: PAGE_SIZE });
                const media = result.Page.media;
                const text = buildAnimeList(media, 'Tʀᴇɴᴅɪɴɢ');
                const keyboard = buildListKeyboard(media, 'ani_detail');
                await ctx.botApi.editMessageText(ctx.chatId, ctx.messageId, text, keyboard);
            } catch (error) {
                await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, `⚠️ ${error.message}`, true);
            }
            return;
        }
    },
};
