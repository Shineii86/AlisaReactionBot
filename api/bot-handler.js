/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * Copyright (c) 2026 Shinei Nouzen
 *
 * Released under the MIT License.
 * You Are Free To Use, Modify, And Distribute This Software In Accordance With The Terms Of The License.
 * ======= • ======= • ======= • ======= • =======• =======
 */

import {
    startMessage, helpMessage, aboutMessage, donateMessage, statsHeader,
    reactionsUpdated, reactionsReset, reactionsInvalid,
    pausedMessage, resumedMessage, notPausedMessage,
    broadcastStarted, broadcastDone, onlyOwnerMessage,
    onlyAdminMessage, groupOnlyMessage, pingMessage,
    cardMessage, cardGenerating, cardError
} from './constants.js';
import { getRandomPositiveReaction, splitEmojis, getTelegramCardUrl, getCardUrlByPalette, CARD_THEMES, CARD_PALETTES, log } from './helper.js';

// ─── In-Memory State (resets on restart — no persistent storage) ───

const stats = {
    messagesProcessed: 0,
    reactionsSent: 0,
    uniqueChats: new Set(),
    commandUsage: {},
    startTime: Date.now(),
};

const reactionLog = [];          // Last 50 reactions: [{chatId, emoji, timestamp}]
const pausedChats = new Set();   // Chat IDs where reactions are paused
const perChatReactions = {};     // chatId → emoji string (custom per-chat)
const restrictedChatsRuntime = new Set(); // Runtime-restricted chat IDs
const rateLimitMap = {};         // chatId → { count, resetAt }
const chatNames = {};            // chatId → chat title (cached)

const LOG_MAX = 50;
const RATE_LIMIT_MAX = 30;       // max reactions per minute per chat
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const BROADCAST_COOLDOWN = 60000; // 1 minute between broadcasts
const CARD_COOLDOWN = 60000;     // 60 seconds cooldown for /card (non-owner)
const cardCooldownMap = {};      // userId → lastCardTimestamp
let lastBroadcastTime = 0;

// ─── Helpers ───

function formatUptime(ms) {
    const s = Math.floor(ms / 1000);
    const m = Math.floor(s / 60);
    const h = Math.floor(m / 60);
    const d = Math.floor(h / 24);
    if (d > 0) return `${d}ᴅ ${h % 24}ʜ ${m % 60}ᴍ`;
    if (h > 0) return `${h}ʜ ${m % 60}ᴍ ${s % 60}s`;
    if (m > 0) return `${m}ᴍ ${s % 60}s`;
    return `${s}s`;
}

function trackCommand(cmd) {
    stats.commandUsage[cmd] = (stats.commandUsage[cmd] || 0) + 1;
}

function isOwner(userId, ownerId) {
    return ownerId && String(userId) === String(ownerId);
}

function isGroupChat(chatType) {
    return ['group', 'supergroup'].includes(chatType);
}

async function isGroupAdmin(botApi, chatId, userId) {
    try {
        const res = await botApi.getChatMember(chatId, userId);
        return ['creator', 'administrator'].includes(res.result?.status);
    } catch {
        return false;
    }
}

function getReactionsForChat(chatId, globalReactions) {
    if (perChatReactions[chatId]) {
        return splitEmojis(perChatReactions[chatId]);
    }
    return globalReactions;
}

function checkRateLimit(chatId) {
    const now = Date.now();
    const entry = rateLimitMap[chatId];

    if (!entry || now > entry.resetAt) {
        rateLimitMap[chatId] = { count: 1, resetAt: now + RATE_LIMIT_WINDOW };
        return true;
    }

    if (entry.count >= RATE_LIMIT_MAX) return false;
    entry.count++;
    return true;
}

function logReaction(chatId, emoji) {
    reactionLog.push({ chatId, emoji, timestamp: Date.now() });
    if (reactionLog.length > LOG_MAX) reactionLog.shift();
}

function getTopChats(limit = 5) {
    const counts = {};
    for (const entry of reactionLog) {
        counts[entry.chatId] = (counts[entry.chatId] || 0) + 1;
    }
    return Object.entries(counts)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
}

function getStatsMessage() {
    const uptime = formatUptime(Date.now() - stats.startTime);
    const cmdLines = Object.entries(stats.commandUsage)
        .map(([cmd, count]) => `\`/${cmd}\` — ${count}`)
        .join('\n') || 'Nᴏ Cᴏᴍᴍᴀɴᴅs Usᴇᴅ Yᴇᴛ.';

    let topChatsText = '';
    const top = getTopChats(5);
    if (top.length) {
        topChatsText = '\n\n🏆 *Tᴏᴘ Cʜᴀᴛs (Lᴀsᴛ 50 Rᴇᴀᴄᴛɪᴏɴs):*\n' +
            top.map(([id, count], i) => {
                const name = chatNames[id] || `Chat ${id}`;
                return `${i + 1}. ${name} — ${count}`;
            }).join('\n');
    }

    return `${statsHeader}📨 *Mᴇssᴀɢᴇs Pʀᴏᴄᴇssᴇᴅ:* ${stats.messagesProcessed.toLocaleString()}
💫 *Rᴇᴀᴄᴛɪᴏɴs Sᴇɴᴛ:* ${stats.reactionsSent.toLocaleString()}
💬 *Uɴɪqᴜᴇ Cʜᴀᴛs:* ${stats.uniqueChats.size.toLocaleString()}
⏸️ *Pᴀᴜsᴇᴅ Cʜᴀᴛs:* ${pausedChats.size.toLocaleString()}
🚫 *Rᴇsᴛʀɪᴄᴛᴇᴅ Cʜᴀᴛs:* ${restrictedChatsRuntime.size.toLocaleString()}
⏱️ *Uᴘᴛɪᴍᴇ:* ${uptime}
🕐 *Sᴛᴀʀᴛᴇᴅ:* ${new Date(stats.startTime).toUTCString()}

📋 *Cᴏᴍᴍᴀɴᴅ Usᴀɢᴇ:*
${cmdLines}${topChatsText}

_Gʟᴏʙᴀʟ Sᴛᴀᴛs Sɪɴᴄᴇ Lᴀsᴛ Rᴇsᴛᴀʀᴛ._`;
}

// ─── Keyboards ───

function getStartKeyboard(botUsername) {
    return [
        [
            { text: '✚ Aᴅᴅ Tᴏ Cʜᴀɴɴᴇʟ', url: `https://t.me/${botUsername}?startchannel=botstart` },
            { text: 'Aᴅᴅ Tᴏ Gʀᴏᴜᴘ ✚', url: `https://t.me/${botUsername}?startgroup=botstart` },
        ],
        [
            { text: '📚 Hᴇʟᴘ', callback_data: 'cb_help' },
            { text: 'Aʙᴏᴜᴛ 🤖', callback_data: 'cb_about' },
        ],
        [
            { text: '🎁 Dᴏɴᴀᴛᴇ', callback_data: 'cb_donate' },
            { text: 'Sᴛᴀᴛs 📊', callback_data: 'cb_stats' },
        ],
        [
            { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ', url: 'https://t.me/Shineii86' },
            { text: 'Sᴏᴜʀᴄᴇ Cᴏᴅᴇ ☁️', url: 'https://github.com/Shineii86/AlisaReactionBot' },
        ],
    ];
}

function getBackKeyboard() {
    return [
        [
            { text: '🔔 Uᴘᴅᴀᴛᴇs', url: 'https://t.me/MaximXBots' },
            { text: 'Sᴜᴘᴘᴏʀᴛ 💬', url: 'https://t.me/MaximXGroup' },
        ],
        [
            { text: '⬅️ Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'cb_menu' }
        ]
    ];
}

// ─── Main Handler ───

/**
 * Handle incoming Telegram Update
 *
 * @param {Object} data - Telegram update object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {Array} Reactions - Default emoji reactions array
 * @param {Array} RestrictedChats - Array of restricted chat IDs (from env)
 * @param {string} botUsername - Bot username
 * @param {number} RandomLevel - Random level for group reactions (0-10)
 * @param {string} ownerId - Bot owner's Telegram user ID
 * @param {string} webhookSecret - Webhook secret token
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, ownerId, webhookSecret) {

    // ─── Callback Query ───
    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        try {
            switch (cq.data) {
                case 'cb_help':
                    await botApi.editMessageText(chatId, messageId, helpMessage, getBackKeyboard());
                    break;
                case 'cb_about':
                    await botApi.editMessageText(chatId, messageId, aboutMessage, getBackKeyboard());
                    break;
                case 'cb_stats':
                    await botApi.editMessageText(chatId, messageId, getStatsMessage(), getBackKeyboard());
                    break;
                case 'cb_donate':
                    await botApi.editMessageText(chatId, messageId, donateMessage, getBackKeyboard());
                    break;
                case 'cb_menu': {
                    const name = cq.message?.chat?.type === 'private'
                        ? (cq.from?.first_name || cq.message?.chat?.title)
                        : cq.message?.chat?.title;
                    await botApi.editMessageText(chatId, messageId, startMessage.replace('UserName', name), getStartKeyboard(botUsername));
                    break;
                }
                default:
                    await botApi.answerCallbackQuery(cq.id, '❓ Unknown action', true);
                    return;
            }
            await botApi.answerCallbackQuery(cq.id);
        } catch (error) {
            log.error('[Callback]', error.message);
            try { await botApi.answerCallbackQuery(cq.id, '⚠️ Error', true); } catch {}
        }
        return;
    }

    // ─── Messages ───
    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        const chatId = content.chat.id;
        const message_id = content.message_id;
        const text = content.text;
        const chatType = content.chat.type;
        const userId = content.from?.id;

        // Cache chat name
        chatNames[chatId] = content.chat.title || content.chat.first_name || String(chatId);

        // Track stats
        stats.messagesProcessed++;
        stats.uniqueChats.add(chatId);

        // ─── Commands (only from users, not channel posts) ───
        if (data.message && text) {
            const cmd = text.split(' ')[0].replace(/@\S+/, '');
            const args = text.split(' ').slice(1).join(' ');

            // /start
            if (cmd === '/start') {
                trackCommand('start');
                const displayName = chatType === 'private'
                    ? (content.from?.first_name || content.chat.title)
                    : content.chat.title;
                await botApi.sendMessage(chatId, startMessage.replace('UserName', displayName), getStartKeyboard(botUsername));
                return;
            }

            // /help
            if (cmd === '/help') {
                trackCommand('help');
                await botApi.sendMessage(chatId, helpMessage, getBackKeyboard());
                return;
            }

            // /about
            if (cmd === '/about') {
                trackCommand('about');
                await botApi.sendMessage(chatId, aboutMessage, getBackKeyboard());
                return;
            }

            // /ping
            if (cmd === '/ping') {
                trackCommand('ping');
                const start = Date.now();
                try {
                    const sent = await botApi.sendMessage(chatId, '🏓 Pɪɴɢɪɴɢ...', null);
                    const latency = Date.now() - start;
                    const msgId = sent?.result?.message_id;
                    if (msgId) {
                        await botApi.editMessageText(chatId, msgId, pingMessage(latency));
                    } else {
                        await botApi.sendMessage(chatId, pingMessage(latency));
                    }
                } catch {
                    const latency = Date.now() - start;
                    await botApi.sendMessage(chatId, pingMessage(latency));
                }
                return;
            }

            // /card
            if (cmd === '/card') {
                trackCommand('card');

                // Cooldown: 60s per user (owner exempt)
                if (!isOwner(userId, ownerId)) {
                    const now = Date.now();
                    const lastCard = cardCooldownMap[userId] || 0;
                    if (now - lastCard < CARD_COOLDOWN) {
                        const remaining = Math.ceil((CARD_COOLDOWN - (now - lastCard)) / 1000);
                        await botApi.sendMessage(chatId, `⏳ Cᴏᴏʟᴅᴏᴡɴ! Wᴀɪᴛ ${remaining}s ʙᴇғᴏʀᴇ ɢᴇɴᴇʀᴀᴛɪɴɢ ᴀɴᴏᴛʜᴇʀ ᴄᴀʀᴅ.`);
                        return;
                    }
                    cardCooldownMap[userId] = now;
                }

                const rawInput = args?.trim().replace(/^@/, '');
                let username = rawInput;

                if (!username) {
                    username = content.from?.username;
                    if (!username) {
                        await botApi.sendMessage(chatId, '⚠️ Yᴏᴜ ᴅᴏɴ\'ᴛ ʜᴀᴠᴇ ᴀ Tᴇʟᴇɢʀᴀᴍ ᴜsᴇʀɴᴀᴍᴇ sᴇᴛ. Usᴇ `/card <username>` ᴡɪᴛʜ ᴀɴ ᴜsᴇʀɴᴀᴍᴇ.');
                        return;
                    }
                }

                // Validate username format (Telegram: a-zA-Z0-9_, 5-32 chars)
                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ. Usᴇʀɴᴀᴍᴇs ᴍᴜsᴛ ʙᴇ 5-32 ᴄʜᴀʀᴀᴄᴛᴇʀs (ᴀ-Z, 0-9, _).');
                    return;
                }

                const cardUrl = getTelegramCardUrl(username, { theme: 'light' });
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}*`);
                return;
            }

            // /cardlight <username>
            if (cmd === '/cardlight') {
                trackCommand('cardlight');
                const rawInput = args?.trim().replace(/^@/, '');
                let username = rawInput || content.from?.username;
                if (!username) {
                    await botApi.sendMessage(chatId, '⚠️ Usᴀɢᴇ: `/cardlight <username>`');
                    return;
                }
                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ.');
                    return;
                }
                const cardUrl = getTelegramCardUrl(username, { theme: 'light' });
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}* — ☀️ Lɪɢʜᴛ`);
                return;
            }

            // /carddark <username>
            if (cmd === '/carddark') {
                trackCommand('carddark');
                const rawInput = args?.trim().replace(/^@/, '');
                let username = rawInput || content.from?.username;
                if (!username) {
                    await botApi.sendMessage(chatId, '⚠️ Usᴀɢᴇ: `/carddark <username>`');
                    return;
                }
                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ.');
                    return;
                }
                const cardUrl = getTelegramCardUrl(username, { theme: 'dark' });
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}* — 🌙 Dᴀʀᴋ`);
                return;
            }

            // /cardpal <palette> <username>
            if (cmd === '/cardpal') {
                trackCommand('cardpal');
                const parts = args?.trim().split(/\s+/) || [];
                const paletteKey = parts[0];
                const rawUsername = parts[1]?.replace(/^@/, '');
                let username = rawUsername || content.from?.username;

                if (!paletteKey) {
                    const paletteList = Object.entries(CARD_PALETTES)
                        .map(([key, val]) => `\`${key}\` — ${val.label}`)
                        .join('\n');
                    await botApi.sendMessage(chatId, `🎨 *Aᴠᴀɪʟᴀʙʟᴇ Pᴀʟᴇᴛᴛᴇs:*\n\n${paletteList}\n\n📌 Usᴀɢᴇ: \`/cardpal <palette> <username>\``);
                    return;
                }

                if (!CARD_PALETTES[paletteKey]) {
                    await botApi.sendMessage(chatId, `❌ Uɴᴋɴᴏᴡɴᴘᴀʟᴇᴛᴛᴇ \`${paletteKey}\`. Usᴇ \`/cardpal\` ᴛᴏ sᴇᴇ ᴀᴠᴀɪʟᴀʙʟᴇ ᴏᴘᴛɪᴏɴs.`);
                    return;
                }

                if (!username) {
                    await botApi.sendMessage(chatId, '⚠️ Usᴀɢᴇ: `/cardpal <palette> <username>`');
                    return;
                }

                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ.');
                    return;
                }

                const cardUrl = getTelegramCardUrl(username, CARD_PALETTES[paletteKey]);
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}* — ${CARD_PALETTES[paletteKey].label}`);
                return;
            }

            // /cardvrf <mode> <username>  (mode: auto | show | hide)
            if (cmd === '/cardvrf') {
                trackCommand('cardvrf');
                const parts = args?.trim().split(/\s+/) || [];
                const mode = parts[0]?.toLowerCase();
                const rawUsername = parts[1]?.replace(/^@/, '');
                let username = rawUsername || content.from?.username;

                if (!mode || !['auto', 'show', 'hide'].includes(mode)) {
                    await botApi.sendMessage(chatId, '🔖 *Vᴇʀɪғɪᴇᴅ Bᴀᴅɢᴇ Mᴏᴅᴇs:*\n\n• `auto` — Dᴇᴛᴇᴄᴛ Aᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ\n• `show` — Fᴏʀᴄᴇ Sʜᴏᴡ\n• `hide` — Fᴏʀᴄᴇ Hɪᴅᴇ\n\n📌 Usᴀɢᴇ: `/cardvrf <mode> <username>`');
                    return;
                }

                if (!username) {
                    await botApi.sendMessage(chatId, '⚠️ Usᴀɢᴇ: `/cardvrf <mode> <username>`');
                    return;
                }

                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ.');
                    return;
                }

                const verifiedValue = mode === 'show' ? 'true' : mode === 'hide' ? 'false' : 'auto';
                const opts = { theme: 'light', verified: verifiedValue };
                const cardUrl = getTelegramCardUrl(username, opts);
                const modeLabel = mode === 'auto' ? '🔖 Aᴜᴛᴏ' : mode === 'show' ? '✅ Sʜᴏᴡ' : '❌ Hɪᴅᴇ';
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}* — ${modeLabel}`);
                return;
            }

            // /cardphoto <url> <username>
            if (cmd === '/cardphoto') {
                trackCommand('cardphoto');
                const parts = args?.trim().split(/\s+/) || [];
                const photoUrl = parts[0];
                const rawUsername = parts[1]?.replace(/^@/, '');
                let username = rawUsername || content.from?.username;

                if (!photoUrl || !/^https?:\/\/.+/i.test(photoUrl)) {
                    await botApi.sendMessage(chatId, '🖼️ *Cᴜsᴛᴏᴍ Pʜᴏᴛᴏ Aᴠᴀᴛᴀʀ*\n\n📌 Usᴀɢᴇ: `/cardphoto <url> <username>`\n\nExᴀᴍᴘʟᴇ: `/cardphoto https://example.com/avatar.png Shineii86`\n\n_URL ᴍᴜsᴛ sᴛᴀʀᴛ ᴡɪᴛʜ http:// ᴏʀ https://_`');
                    return;
                }

                if (!username) {
                    await botApi.sendMessage(chatId, '⚠️ Usᴀɢᴇ: `/cardphoto <url> <username>`');
                    return;
                }

                if (!/^[a-zA-Z0-9_]{5,32}$/.test(username)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ ᴜsᴇʀɴᴀᴍᴇ.');
                    return;
                }

                const opts = { theme: 'light', photo: photoUrl };
                const cardUrl = getTelegramCardUrl(username, opts);
                await botApi.sendPhoto(chatId, cardUrl, `🃏 *${username}* — 🖼️ Cᴜsᴛᴏᴍ Pʜᴏᴛᴏ`);
                return;
            }

            // /stats
            if (cmd === '/stats') {
                trackCommand('stats');
                await botApi.sendMessage(chatId, getStatsMessage(), getBackKeyboard());
                return;
            }

            // /reactions
            if (cmd === '/reactions') {
                trackCommand('reactions');
                const reactions = getReactionsForChat(chatId, Reactions).join(' ');
                const isCustom = perChatReactions[chatId] ? '\n\n_✨ Cᴜsᴛᴏᴍ Sᴇᴛ Fᴏʀ Tʜɪs Cʜᴀᴛ._' : '\n\n_📌 Dᴇғᴀᴜʟᴛ Gʟᴏʙᴀʟ Sᴇᴛ._';
                await botApi.sendMessage(chatId, `🚀 *Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:*\n\n${reactions}${isCustom}`, getBackKeyboard());
                return;
            }

            // /setreactions (group admins only)
            if (cmd === '/setreactions') {
                trackCommand('setreactions');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    // Reset to default
                    delete perChatReactions[chatId];
                    await botApi.sendMessage(chatId, reactionsReset, getBackKeyboard());
                    return;
                }
                const emojis = splitEmojis(args.trim());
                if (emojis.length === 0) {
                    await botApi.sendMessage(chatId, reactionsInvalid);
                    return;
                }
                perChatReactions[chatId] = emojis.join('');
                await botApi.sendMessage(chatId,
                    `${reactionsUpdated}🎯 *Nᴇᴡ Rᴇᴀᴄᴛɪᴏɴs:* ${emojis.join(' ')}`,
                    getBackKeyboard()
                );
                return;
            }

            // /pause (group admins only)
            if (cmd === '/pause') {
                trackCommand('pause');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage);
                    return;
                }
                pausedChats.add(chatId);
                await botApi.sendMessage(chatId, pausedMessage);
                return;
            }

            // /resume (group admins only)
            if (cmd === '/resume') {
                trackCommand('resume');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage);
                    return;
                }
                if (!pausedChats.has(chatId)) {
                    await botApi.sendMessage(chatId, notPausedMessage);
                    return;
                }
                pausedChats.delete(chatId);
                await botApi.sendMessage(chatId, resumedMessage);
                return;
            }

            // /donate
            if (cmd === '/donate') {
                trackCommand('donate');
                await botApi.sendMessage(chatId, donateMessage, getBackKeyboard());
                return;
            }

            // /broadcast (owner only, with cooldown)
            if (cmd === '/broadcast') {
                trackCommand('broadcast');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: `/broadcast <message>`');
                    return;
                }
                const now = Date.now();
                if (now - lastBroadcastTime < BROADCAST_COOLDOWN) {
                    const remaining = Math.ceil((BROADCAST_COOLDOWN - (now - lastBroadcastTime)) / 1000);
                    await botApi.sendMessage(chatId, `⏳ Cᴏᴏʟᴅᴏᴡɴ! Wᴀɪᴛ ${remaining}s Bᴇғᴏʀᴇ Nᴇxᴛ Bʀᴏᴀᴅᴄᴀsᴛ.`);
                    return;
                }
                lastBroadcastTime = now;
                await botApi.sendMessage(chatId, broadcastStarted);
                const allChats = new Set(stats.uniqueChats);
                if (userId) allChats.add(userId);
                let success = 0, failed = 0;
                for (const cid of allChats) {
                    try {
                        await botApi.sendMessage(cid, `📢 *Bʀᴏᴀᴅᴄᴀsᴛ:*\n\n${args.trim()}`);
                        success++;
                    } catch {
                        failed++;
                    }
                }
                await botApi.sendMessage(chatId, broadcastDone(success, failed));
                return;
            }

            // /log (owner only)
            if (cmd === '/log') {
                trackCommand('log');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (reactionLog.length === 0) {
                    await botApi.sendMessage(chatId, '📋 Rᴇᴀᴄᴛɪᴏɴ Lᴏɢ Is Eᴍᴘᴛʏ.');
                    return;
                }
                const lines = reactionLog.slice(-10).reverse().map((e, i) => {
                    const time = new Date(e.timestamp).toLocaleTimeString();
                    const name = chatNames[e.chatId] || e.chatId;
                    return `${i + 1}. ${e.emoji} → ${name} (${time})`;
                }).join('\n');
                await botApi.sendMessage(chatId, `📋 *Lᴀsᴛ 10 Rᴇᴀᴄᴛɪᴏɴs:*\n\n${lines}`);
                return;
            }

            // /leave and /remove (owner only)
            if (cmd === '/leave' || cmd === '/remove') {
                trackCommand(cmd === '/leave' ? 'leave' : 'remove');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: `/leave <chat_id>`');
                    return;
                }
                const targetChatId = args.trim();
                if (!/^-?\d+$/.test(targetChatId)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID. Mᴜsᴛ Bᴇ A Nᴜᴍᴇʀɪᴄ Vᴀʟᴜᴇ.');
                    return;
                }
                try {
                    await botApi.leaveChat(targetChatId);
                    stats.uniqueChats.delete(Number(targetChatId));
                    delete perChatReactions[targetChatId];
                    pausedChats.delete(Number(targetChatId));
                    restrictedChatsRuntime.delete(Number(targetChatId));
                    await botApi.sendMessage(chatId, `✅ Bᴏᴛ Hᴀs Lᴇғᴛ Cʜᴀᴛ \`${targetChatId}\`.`);
                } catch (error) {
                    await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Lᴇᴀᴠᴇ Cʜᴀᴛ \`${targetChatId}\`:\n${error.message}`);
                }
                return;
            }

            // /chats (owner only)
            if (cmd === '/chats') {
                trackCommand('chats');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (stats.uniqueChats.size === 0) {
                    await botApi.sendMessage(chatId, '📭 Nᴏ Aᴄᴛɪᴠᴇ Cʜᴀᴛs.');
                    return;
                }
                const chatLines = Array.from(stats.uniqueChats).map((cid, i) => {
                    const name = chatNames[cid] || `Chat ${cid}`;
                    const paused = pausedChats.has(cid) ? ' ⏸️' : '';
                    const restricted = restrictedChatsRuntime.has(cid) || RestrictedChats.includes(cid) ? ' 🚫' : '';
                    return `${i + 1}. ${name} (${cid})${paused}${restricted}`;
                }).join('\n');
                await botApi.sendMessage(chatId, `💬 *Aᴄᴛɪᴠᴇ Cʜᴀᴛs (${stats.uniqueChats.size}):*\n\n${chatLines}\n\n⏸️ = Pᴀᴜsᴇᴅ | 🚫 = Rᴇsᴛʀɪᴄᴛᴇᴅ`);
                return;
            }

            // /setwebhook <url> (owner only)
            if (cmd === '/setwebhook') {
                trackCommand('setwebhook');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    // Show current webhook info
                    try {
                        const info = await botApi.getWebhookInfo();
                        const wh = info.result;
                        const status = wh.url ? `🔗 *URL:* ${wh.url}` : '❌ Nᴏ Wᴇʙʜᴏᴏᴋ Sᴇᴛ';
                        const pending = wh.pending_update_count > 0 ? `\n⏳ *Pᴇɴᴅɪɴɢ:* ${wh.pending_update_count}` : '';
                        const error = wh.last_error_message ? `\n⚠️ *Eʀʀᴏʀ:* ${wh.last_error_message}` : '';
                        await botApi.sendMessage(chatId, `📡 *Wᴇʙʜᴏᴏᴋ Sᴛᴀᴛᴜs:*\n\n${status}${pending}${error}`);
                    } catch (error) {
                        await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Wᴇʙʜᴏᴏᴋ Iɴғᴏ:\n${error.message}`);
                    }
                    return;
                }
                const webhookUrl = args.trim();
                if (!webhookUrl.startsWith('https://')) {
                    await botApi.sendMessage(chatId, '❌ Wᴇʙʜᴏᴏᴋ URL Mᴜsᴛ Sᴛᴀʀᴛ Wɪᴛʜ `https://`');
                    return;
                }
                try {
                    await botApi.setWebhook(webhookUrl, webhookSecret || '');
                    await botApi.sendMessage(chatId, `✅ Wᴇʙʜᴏᴏᴋ Sᴇᴛ Sᴜᴄᴄᴇssғᴜʟʟʏ!\n\n🔗 ${webhookUrl}`);
                } catch (error) {
                    await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Sᴇᴛ Wᴇʙʜᴏᴏᴋ:\n${error.message}`);
                }
                return;
            }

            // /restrict <chatId> (owner only)
            if (cmd === '/restrict') {
                trackCommand('restrict');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: `/restrict <chat_id>`');
                    return;
                }
                const restrictId = Number(args.trim());
                if (!restrictId) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.');
                    return;
                }
                restrictedChatsRuntime.add(restrictId);
                await botApi.sendMessage(chatId, `🚫 Cʜᴀᴛ \`${restrictId}\` Rᴇsᴛʀɪᴄᴛᴇᴅ. Bᴏᴛ Wɪʟʟ Nᴏᴛ Rᴇᴀᴄᴛ.`);
                return;
            }

            // /unrestrict <chatId> (owner only)
            if (cmd === '/unrestrict') {
                trackCommand('unrestrict');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: `/unrestrict <chat_id>`');
                    return;
                }
                const unrestrictId = Number(args.trim());
                if (!unrestrictId) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.');
                    return;
                }
                if (!restrictedChatsRuntime.has(unrestrictId)) {
                    await botApi.sendMessage(chatId, 'ℹ️ Cʜᴀᴛ Is Nᴏᴛ Rᴇsᴛʀɪᴄᴛᴇᴅ.');
                    return;
                }
                restrictedChatsRuntime.delete(unrestrictId);
                await botApi.sendMessage(chatId, `✅ Cʜᴀᴛ \`${unrestrictId}\` Uɴʀᴇsᴛʀɪᴄᴛᴇᴅ.`);
                return;
            }
        }

        // ─── Auto-Reaction Logic ───
        if (RestrictedChats.includes(chatId)) return;
        if (restrictedChatsRuntime.has(chatId)) return;
        if (pausedChats.has(chatId)) return;
        if (!checkRateLimit(chatId)) return;

        const chatReactions = getReactionsForChat(chatId, Reactions);
        const reaction = getRandomPositiveReaction(chatReactions);
        if (!reaction) return;

        const isGroup = isGroupChat(chatType);
        if (isGroup) {
            const threshold = 1 - (RandomLevel / 10);
            if (Math.random() <= threshold) {
                try {
                    await botApi.setMessageReaction(chatId, message_id, reaction);
                    stats.reactionsSent++;
                    logReaction(chatId, reaction);
                } catch {}
            }
        } else {
            try {
                await botApi.setMessageReaction(chatId, message_id, reaction);
                stats.reactionsSent++;
                logReaction(chatId, reaction);
            } catch {}
        }
    }
}
