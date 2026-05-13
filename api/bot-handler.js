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
    onlyAdminMessage, groupOnlyMessage, pingMessage
} from './constants.js';
import { getRandomPositiveReaction, splitEmojis, log } from './helper.js';
import { getAdFooter } from './ads.js';

// ─── In-Memory State (resets on restart — no persistent storage) ───

const stats = {
    messagesProcessed: 0,
    reactionsSent: 0,
    uniqueChats: new Set(),
    commandUsage: {},
    startTime: Date.now(),
};

const reactionLog = [];          // Last 50 Reactions: [{chatId, emoji, timestamp}]
const pausedChats = new Set();   // Chat IDs Where Reactions Are Paused
const perChatReactions = {};     // chatId → Emoji String (Custom Per-Chat)
const restrictedChatsRuntime = new Set(); // Runtime-restricted Chat IDs
const rateLimitMap = {};         // chatId → { count, resetAt }
const chatNames = {};            // chatId → Chat Title (Cached)
const perChatRandomLevel = {};   // chatId → Random Level Override (0-10)
const welcomeEnabled = new Set(); // Chat IDs Where Welcome Messages Are Enabled
const leaveEnabled = new Set();   // Chat IDs Where Leave Messages Are Enabled

const LOG_MAX = 50;
const RATE_LIMIT_MAX = 30;       // Max Reactions Per Minute Per Chat
const RATE_LIMIT_WINDOW = 60000; // 1 Minute
const BROADCAST_COOLDOWN = 60000; // 1 Minute Between Broadcasts
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

/**
 * Format a Date/timestamp to IST (Indian Standard Time, UTC+5:30)
 * @param {Date|number} date — Date object or timestamp ms
 * @returns {string} — Formatted IST string (12-hour AM/PM)
 */
function formatIST(date) {
    const d = date instanceof Date ? date : new Date(date);
    const ist = new Date(d.getTime() + (5 * 60 + 30) * 60 * 1000);
    const day = String(ist.getUTCDate()).padStart(2, '0');
    const month = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][ist.getUTCMonth()];
    const year = ist.getUTCFullYear();
    let hours = ist.getUTCHours();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12 || 12;
    const mins = String(ist.getUTCMinutes()).padStart(2, '0');
    const secs = String(ist.getUTCSeconds()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins}:${secs} ${ampm} IST`;
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

/**
 * Append ad footer to a message.
 * @param {string} msg — Original message text
 * @returns {string} — Message with ad footer appended
 */
function withAd(msg) {
    return msg + getAdFooter();
}

function getStatsMessage() {
    const uptime = formatUptime(Date.now() - stats.startTime);
    const cmdLines = Object.entries(stats.commandUsage)
        .map(([cmd, count]) => `<code>/${cmd}</code> — ${count}`)
        .join('\n') || 'Nᴏ Cᴏᴍᴍᴀɴᴅs Usᴇᴅ Yᴇᴛ.';

    let topChatsText = '';
    const top = getTopChats(5);
    if (top.length) {
        topChatsText = '\n\n🏆 <b>Tᴏᴘ Cʜᴀᴛs (Lᴀsᴛ 50 Rᴇᴀᴄᴛɪᴏɴs):</b>\n' +
            top.map(([id, count], i) => {
                const name = chatNames[id] || `Chat ${id}`;
                return `${i + 1}. ${name} — ${count}`;
            }).join('\n');
    }

    return `${statsHeader}📨 <b>Mᴇssᴀɢᴇs Pʀᴏᴄᴇssᴇᴅ:</b> ${stats.messagesProcessed.toLocaleString()}
💫 <b>Rᴇᴀᴄᴛɪᴏɴs Sᴇɴᴛ:</b> ${stats.reactionsSent.toLocaleString()}
💬 <b>Uɴɪҩᴜᴇ Cʜᴀᴛs:</b> ${stats.uniqueChats.size.toLocaleString()}
⏸️ <b>Pᴀᴜsᴇᴅ Cʜᴀᴛs:</b> ${pausedChats.size.toLocaleString()}
🚫 <b>Rᴇsᴛʀɪᴄᴛᴇᴅ Cʜᴀᴛs:</b> ${restrictedChatsRuntime.size.toLocaleString()}
🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Oᴠᴇʀʀɪᴅᴇs:</b> ${Object.keys(perChatRandomLevel).length.toLocaleString()}
👋 <b>Wᴇʟᴄᴏᴍᴇ Eɴᴀʙʟᴇᴅ:</b> ${welcomeEnabled.size.toLocaleString()}
🚪 <b>Gᴏᴏᴅʙʏᴇ Eɴᴀʙʟᴇᴅ:</b> ${leaveEnabled.size.toLocaleString()}
⏱️ <b>Uᴘᴛɪᴍᴇ:</b> ${uptime}
🕐 <b>Sᴛᴀʀᴛᴇᴅ:</b> ${formatIST(stats.startTime)}

📋 <b>Cᴏᴍᴍᴀɴᴅ Usᴀɢᴇ:</b>
${cmdLines}${topChatsText}

<i>Gʟᴏʙᴀʟ Sᴛᴀᴛs Sɪɴᴄᴇ Lᴀsᴛ Rᴇsᴛᴀʀᴛ.</i>`;
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
            { text: '💥 Cʟᴏsᴇ Mᴇɴᴜ ✨', callback_data: 'cb_close' },
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
            { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' }
        ]
    ];
}

function getCloseKeyboard() {
    return [
        [
            { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close' }
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
 * @param {string} botPhoto - Bot photo URL from env
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, ownerId, webhookSecret, botPhoto) {

    // Guard against NaN RandomLevel from invalid env var
    if (isNaN(RandomLevel) || RandomLevel < 0 || RandomLevel > 10) {
        RandomLevel = 0;
    }

    // ─── Callback Query ───
    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        try {
            // Helper: edit message — handles both photo and text messages
            const editMsg = async (text, keyboard) => {
                if (botPhoto) {
                    // Photo message — try caption edit, fallback to new message if too long
                    try {
                        await botApi.editMessageCaption(chatId, messageId, text, keyboard);
                    } catch {
                        await botApi.sendMessage(chatId, text, keyboard);
                    }
                } else {
                    // Text message — edit directly
                    await botApi.editMessageText(chatId, messageId, text, keyboard);
                }
            };

            switch (cq.data) {
                case 'cb_help':
                    await editMsg(withAd(helpMessage), getBackKeyboard());
                    break;
                case 'cb_about':
                    await editMsg(withAd(aboutMessage), getBackKeyboard());
                    break;
                case 'cb_stats':
                    await editMsg(withAd(getStatsMessage()), getBackKeyboard());
                    break;
                case 'cb_donate':
                    await editMsg(withAd(donateMessage), getBackKeyboard());
                    break;
                case 'cb_menu': {
                    const name = cq.message?.chat?.type === 'private'
                        ? (cq.from?.first_name || cq.message?.chat?.title)
                        : cq.message?.chat?.title;
                    const caption = startMessage.replace('UserName', name);
                    const keyboard = getStartKeyboard(botUsername);
                    // Check if current message is a photo message
                    const hasPhoto = cq.message?.photo;
                    if (hasPhoto) {
                        try {
                            await botApi.editMessageMedia(chatId, messageId, {
                                type: 'photo',
                                media: botPhoto,
                                caption: caption,
                                parse_mode: 'HTML'
                            }, keyboard);
                        } catch {
                            await botApi.editMessageCaption(chatId, messageId, caption, keyboard);
                        }
                    } else if (botPhoto) {
                        // Current message is text but we want photo — send new photo
                        await botApi.deleteMessage(chatId, messageId).catch(() => {});
                        await botApi.sendPhoto(chatId, botPhoto, caption, keyboard);
                    } else {
                        await botApi.editMessageText(chatId, messageId, caption, keyboard);
                    }
                    break;
                }
                case 'cb_close':
                    await botApi.deleteMessage(chatId, messageId);
                    break;
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
                const caption = withAd(startMessage.replace('UserName', displayName));
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getStartKeyboard(botUsername));
                } else {
                    await botApi.sendMessage(chatId, caption, getStartKeyboard(botUsername));
                }
                return;
            }

            // /help
            if (cmd === '/help') {
                trackCommand('help');
                const caption = withAd(helpMessage);
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getBackKeyboard());
                } else {
                    await botApi.sendMessage(chatId, caption, getBackKeyboard());
                }
                return;
            }

            // /about
            if (cmd === '/about') {
                trackCommand('about');
                const caption = withAd(aboutMessage);
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getBackKeyboard());
                } else {
                    await botApi.sendMessage(chatId, caption, getBackKeyboard());
                }
                return;
            }

            // /ping
            if (cmd === '/ping') {
                trackCommand('ping');
                const start = Date.now();
                try {
                    const sent = await botApi.sendMessage(chatId, '🏓 Pɪɴɢɪɴɢ...', getCloseKeyboard());
                    const latency = Date.now() - start;
                    const msgId = sent?.result?.message_id;
                    const pingText = pingMessage(latency) + `\n🕐 ${formatIST(Date.now())}`;
                    if (msgId) {
                        await botApi.editMessageText(chatId, msgId, pingText, getCloseKeyboard());
                    } else {
                        await botApi.sendMessage(chatId, pingText, getCloseKeyboard());
                    }
                } catch {
                    const latency = Date.now() - start;
                    const pingText = pingMessage(latency) + `\n🕐 ${formatIST(Date.now())}`;
                    await botApi.sendMessage(chatId, pingText, getCloseKeyboard());
                }
                return;
            }

            // /stats
            if (cmd === '/stats') {
                trackCommand('stats');
                const caption = withAd(getStatsMessage());
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getBackKeyboard());
                } else {
                    await botApi.sendMessage(chatId, caption, getBackKeyboard());
                }
                return;
            }

            // /reactions
            if (cmd === '/reactions') {
                trackCommand('reactions');
                const reactions = getReactionsForChat(chatId, Reactions).join(' ');
                const isCustom = perChatReactions[chatId] ? '\n\n<i>✨ Cᴜsᴛᴏᴍ Sᴇᴛ Fᴏʀ Tʜɪs Cʜᴀᴛ.</i>' : '\n\n<i>📌 Dᴇғᴀᴜʟᴛ Gʟᴏʙᴀʟ Sᴇᴛ.</i>';
                const caption = withAd(`🚀 <b>Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:</b>\n\n${reactions}${isCustom}`);
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getBackKeyboard());
                } else {
                    await botApi.sendMessage(chatId, caption, getBackKeyboard());
                }
                return;
            }

            // /setreactions (group admins only)
            if (cmd === '/setreactions') {
                trackCommand('setreactions');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    // Reset to default
                    delete perChatReactions[chatId];
                    await botApi.sendMessage(chatId, reactionsReset, getCloseKeyboard());
                    return;
                }
                const emojis = splitEmojis(args.trim());
                if (emojis.length === 0) {
                    await botApi.sendMessage(chatId, reactionsInvalid, getCloseKeyboard());
                    return;
                }
                perChatReactions[chatId] = emojis.join('');
                await botApi.sendMessage(chatId,
                    `${reactionsUpdated}🎯 <b>Nᴇᴡ Rᴇᴀᴄᴛɪᴏɴs:</b> ${emojis.join(' ')}`,
                    getBackKeyboard()
                );
                return;
            }

            // /pause (group admins only)
            if (cmd === '/pause') {
                trackCommand('pause');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    return;
                }
                pausedChats.add(chatId);
                await botApi.sendMessage(chatId, pausedMessage, getCloseKeyboard());
                return;
            }

            // /resume (group admins only)
            if (cmd === '/resume') {
                trackCommand('resume');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    return;
                }
                if (!pausedChats.has(chatId)) {
                    await botApi.sendMessage(chatId, notPausedMessage, getCloseKeyboard());
                    return;
                }
                pausedChats.delete(chatId);
                await botApi.sendMessage(chatId, resumedMessage, getCloseKeyboard());
                return;
            }

            // /randomlevel <0-10> (group admins only for override; shows info in DMs)
            if (cmd === '/randomlevel') {
                trackCommand('randomlevel');
                try {
                    const trimmedArgs = args?.trim();
                    const isGroup = isGroupChat(chatType);

                    // In private chats, show global default info (no override possible)
                    if (!isGroup) {
                        const globalLevel = RandomLevel;
                        const globalChance = (10 - globalLevel) * 10;
                        await botApi.sendMessage(chatId,
                            `🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ — Gʟᴏʙᴀʟ Dᴇғᴀᴜʟᴛ</b>\n\n` +
                            `📊 Cᴜʀʀᴇɴᴛ: <code>${globalLevel}</code> — Rᴇᴀᴄᴛ ~${globalChance}% Oғ Tʜᴇ Tɪᴍᴇ\n\n` +
                            `💡 <code>0</code> = ᴇᴠᴇʀʏ ᴍᴇssᴀɢᴇ | <code>10</code> = ɴᴇᴠᴇʀ\n\n` +
                            `⚠️ Tᴏ Oᴠᴇʀʀɪᴅᴇ Iɴ A Gʀᴏᴜᴘ, Usᴇ <code>/randomlevel &lt;0-10&gt;</code> Tʜᴇʀᴇ.\n` +
                            `📌 Aᴅᴍɪɴs Oɴʟʏ Iɴ Gʀᴏᴜᴘs.`,
                            getCloseKeyboard()
                        );
                        return;
                    }

                    // Group: require admin permission
                    if (!await isGroupAdmin(botApi, chatId, userId)) {
                        await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                        return;
                    }

                    // No args → show current level for this chat
                    if (!trimmedArgs) {
                        const current = perChatRandomLevel[chatId] !== undefined
                            ? perChatRandomLevel[chatId]
                            : RandomLevel;
                        const source = perChatRandomLevel[chatId] !== undefined ? 'Cᴜsᴛᴏᴍ' : 'Gʟᴏʙᴀʟ';
                        const currentChance = (10 - current) * 10;
                        await botApi.sendMessage(chatId,
                            `🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Fᴏʀ Tʜɪs Cʜᴀᴛ:</b>\n\n` +
                            `📊 Cᴜʀʀᴇɴᴛ: <code>${current}</code> (${source}) — Rᴇᴀᴄᴛ ~${currentChance}%\n` +
                            `📌 Gʟᴏʙᴀʟ Dᴇғᴀᴜʟᴛ: <code>${RandomLevel}</code>\n\n` +
                            `💡 Usᴇ <code>/randomlevel &lt;0-10&gt;</code> Tᴏ Cʜᴀɴɢᴇ.`,
                            getCloseKeyboard()
                        );
                        return;
                    }

                    // Validate the level value
                    const level = parseInt(trimmedArgs, 10);
                    if (isNaN(level) || level < 0 || level > 10) {
                        await botApi.sendMessage(chatId,
                            `❌ Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Mᴜsᴛ Bᴇ A Nᴜᴍʙᴇʀ Bᴇᴛᴡᴇᴇɴ <code>0</code> Aɴᴅ <code>10</code>.\n\n` +
                            `📌 Usᴀɢᴇ: <code>/randomlevel &lt;0-10&gt;</code>\n` +
                            `💡 <code>0</code> = Aʟᴡᴀʏs Rᴇᴀᴄᴛ | <code>10</code> = Nᴇᴠᴇʀ Rᴇᴀᴄᴛ`,
                            getCloseKeyboard()
                        );
                        return;
                    }

                    // Set per-chat override
                    perChatRandomLevel[chatId] = level;
                    const chance = (10 - level) * 10;
                    await botApi.sendMessage(chatId,
                        `🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Sᴇᴛ!</b> 📊\n\n` +
                        `🎯 Lᴇᴠᴇʟ: <code>${level}</code> — Rᴇᴀᴄᴛ ~${chance}% Oғ Tʜᴇ Tɪᴍᴇ\n\n` +
                        `💡 <code>0</code> = Eᴠᴇʀʏ Mᴇssᴀɢᴇ | <code>10</code> = Nᴇᴠᴇʀ\n` +
                        `🔄 Rᴇsᴇᴛs Oɴ Rᴇsᴛᴀʀᴛ.`,
                        getCloseKeyboard()
                    );
                } catch (error) {
                    log.error('[/randomlevel]', error.message);
                    try {
                        await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Pʀᴏᴄᴇss /randomlevel: ${error.message}`, getCloseKeyboard());
                    } catch {}
                }
                return;
            }

            // /donate
            if (cmd === '/donate') {
                trackCommand('donate');
                const caption = withAd(donateMessage);
                if (botPhoto) {
                    await botApi.sendPhoto(chatId, botPhoto, caption, getBackKeyboard());
                } else {
                    await botApi.sendMessage(chatId, caption, getBackKeyboard());
                }
                return;
            }

            // /broadcast (owner only, with cooldown)
            if (cmd === '/broadcast') {
                trackCommand('broadcast');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/broadcast &lt;message&gt;</code>', getCloseKeyboard());
                    return;
                }
                const now = Date.now();
                if (now - lastBroadcastTime < BROADCAST_COOLDOWN) {
                    const remaining = Math.ceil((BROADCAST_COOLDOWN - (now - lastBroadcastTime)) / 1000);
                    await botApi.sendMessage(chatId, `⏳ Cᴏᴏʟᴅᴏᴡɴ! Wᴀɪᴛ ${remaining}s Bᴇғᴏʀᴇ Nᴇxᴛ Bʀᴏᴀᴅᴄᴀsᴛ.`, getCloseKeyboard());
                    return;
                }
                lastBroadcastTime = now;
                await botApi.sendMessage(chatId, broadcastStarted, getCloseKeyboard());
                const allChats = new Set(stats.uniqueChats);
                if (userId) allChats.add(userId);
                let success = 0, failed = 0;
                for (const cid of allChats) {
                    try {
                        await botApi.sendMessage(cid, `📢 <b>Bʀᴏᴀᴅᴄᴀsᴛ:</b>\n\n${args.trim()}`);
                        success++;
                    } catch {
                        failed++;
                    }
                }
                await botApi.sendMessage(chatId, broadcastDone(success, failed), getCloseKeyboard());
                return;
            }

            // /log (owner only)
            if (cmd === '/log') {
                trackCommand('log');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (reactionLog.length === 0) {
                    await botApi.sendMessage(chatId, '📋 Rᴇᴀᴄᴛɪᴏɴ Lᴏɢ Is Eᴍᴘᴛʏ.', getCloseKeyboard());
                    return;
                }
                const lines = reactionLog.slice(-10).reverse().map((e, i) => {
                    const time = formatIST(e.timestamp);
                    const name = chatNames[e.chatId] || e.chatId;
                    return `${i + 1}. ${e.emoji} → ${name} (${time})`;
                }).join('\n');
                await botApi.sendMessage(chatId, `📋 <b>Lᴀsᴛ 10 Rᴇᴀᴄᴛɪᴏɴs:</b>\n\n${lines}`, getCloseKeyboard());
                return;
            }

            // /leave and /remove (owner only)
            if (cmd === '/leave' || cmd === '/remove') {
                trackCommand(cmd === '/leave' ? 'leave' : 'remove');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/leave &lt;chat_id&gt;</code>', getCloseKeyboard());
                    return;
                }
                const targetChatId = args.trim();
                if (!/^-?\d+$/.test(targetChatId)) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID. Mᴜsᴛ Bᴇ A Nᴜᴍᴇʀɪᴄ Vᴀʟᴜᴇ.', getCloseKeyboard());
                    return;
                }
                try {
                    await botApi.leaveChat(targetChatId);
                    stats.uniqueChats.delete(Number(targetChatId));
                    delete perChatReactions[targetChatId];
                    delete perChatRandomLevel[targetChatId];
                    pausedChats.delete(Number(targetChatId));
                    restrictedChatsRuntime.delete(Number(targetChatId));
                    await botApi.sendMessage(chatId, `✅ Bᴏᴛ Hᴀs Lᴇғᴛ Cʜᴀᴛ <code>${targetChatId}</code>.`, getCloseKeyboard());
                } catch (error) {
                    await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Lᴇᴀᴠᴇ Cʜᴀᴛ <code>${targetChatId}</code>:\n${error.message}`, getCloseKeyboard());
                }
                return;
            }

            // /chats (owner only)
            if (cmd === '/chats') {
                trackCommand('chats');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (stats.uniqueChats.size === 0) {
                    await botApi.sendMessage(chatId, '📭 Nᴏ Aᴄᴛɪᴠᴇ Cʜᴀᴛs.', getCloseKeyboard());
                    return;
                }
                const chatLines = Array.from(stats.uniqueChats).map((cid, i) => {
                    const name = chatNames[cid] || `Chat ${cid}`;
                    const paused = pausedChats.has(cid) ? ' ⏸️' : '';
                    const restricted = restrictedChatsRuntime.has(cid) || RestrictedChats.includes(cid) ? ' 🚫' : '';
                    return `${i + 1}. ${name} (${cid})${paused}${restricted}`;
                }).join('\n');
                await botApi.sendMessage(chatId, `💬 <b>Aᴄᴛɪᴠᴇ Cʜᴀᴛs (${stats.uniqueChats.size}):</b>\n\n${chatLines}\n\n⏸️ = Pᴀᴜsᴇᴅ | 🚫 = Rᴇsᴛʀɪᴄᴛᴇᴅ`, getCloseKeyboard());
                return;
            }

            // /setwebhook <url> (owner only)
            if (cmd === '/setwebhook') {
                trackCommand('setwebhook');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    // Show current webhook info
                    try {
                        const info = await botApi.getWebhookInfo();
                        const wh = info.result;
                        const status = wh.url ? `🔗 <b>URL:</b> ${wh.url}` : '❌ Nᴏ Wᴇʙʜᴏᴏᴋ Sᴇᴛ';
                        const pending = wh.pending_update_count > 0 ? `\n⏳ <b>Pᴇɴᴅɪɴɢ:</b> ${wh.pending_update_count}` : '';
                        const error = wh.last_error_message ? `\n⚠️ <b>Eʀʀᴏʀ:</b> ${wh.last_error_message}` : '';
                        await botApi.sendMessage(chatId, `📡 <b>Wᴇʙʜᴏᴏᴋ Sᴛᴀᴛᴜs:</b>\n\n${status}${pending}${error}`, getCloseKeyboard());
                    } catch (error) {
                        await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Wᴇʙʜᴏᴏᴋ Iɴғᴏ:\n${error.message}`, getCloseKeyboard());
                    }
                    return;
                }
                const webhookUrl = args.trim();
                if (!webhookUrl.startsWith('https://')) {
                    await botApi.sendMessage(chatId, '❌ Wᴇʙʜᴏᴏᴋ Uʀʟ Mᴜsᴛ Sᴛᴀʀᴛ Wɪᴛʜ <code>https://</code>', getCloseKeyboard());
                    return;
                }
                try {
                    await botApi.setWebhook(webhookUrl, webhookSecret || '');
                    await botApi.sendMessage(chatId, `✅ Wᴇʙʜᴏᴏᴋ Sᴇᴛ Sᴜᴄᴄᴇssғᴜʟʟʏ!\n\n🔗 ${webhookUrl}`, getCloseKeyboard());
                } catch (error) {
                    await botApi.sendMessage(chatId, `❌ Fᴀɪʟᴇᴅ Tᴏ Sᴇᴛ Wᴇʙʜᴏᴏᴋ:\n${error.message}`, getCloseKeyboard());
                }
                return;
            }

            // /restrict <chatId> (owner only)
            if (cmd === '/restrict') {
                trackCommand('restrict');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/restrict &lt;chat_id&gt;</code>', getCloseKeyboard());
                    return;
                }
                const restrictId = Number(args.trim());
                if (!restrictId) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.', getCloseKeyboard());
                    return;
                }
                restrictedChatsRuntime.add(restrictId);
                await botApi.sendMessage(chatId, `🚫 Cʜᴀᴛ <code>${restrictId}</code> Rᴇsᴛʀɪᴄᴛᴇᴅ. Bᴏᴛ Wɪʟʟ Nᴏᴛ Rᴇᴀᴄᴛ.`, getCloseKeyboard());
                return;
            }

            // /unrestrict <chatId> (owner only)
            if (cmd === '/unrestrict') {
                trackCommand('unrestrict');
                if (!isOwner(userId, ownerId)) {
                    await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await botApi.sendMessage(chatId, '📝 Usᴀɢᴇ: <code>/unrestrict &lt;chat_id&gt;</code>', getCloseKeyboard());
                    return;
                }
                const unrestrictId = Number(args.trim());
                if (!unrestrictId) {
                    await botApi.sendMessage(chatId, '❌ Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.', getCloseKeyboard());
                    return;
                }
                if (!restrictedChatsRuntime.has(unrestrictId)) {
                    await botApi.sendMessage(chatId, 'ℹ️ Cʜᴀᴛ Is Nᴏᴛ Rᴇsᴛʀɪᴄᴛᴇᴅ.', getCloseKeyboard());
                    return;
                }
                restrictedChatsRuntime.delete(unrestrictId);
                await botApi.sendMessage(chatId, `✅ Cʜᴀᴛ <code>${unrestrictId}</code> Uɴʀᴇsᴛʀɪᴄᴛᴇᴅ.`, getCloseKeyboard());
                return;
            }

            // /welcome (group admins only — toggle welcome messages)
            if (cmd === '/welcome') {
                trackCommand('welcome');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    return;
                }
                if (welcomeEnabled.has(chatId)) {
                    welcomeEnabled.delete(chatId);
                    await botApi.sendMessage(chatId,
                        `🔕 <b>Wᴇʟᴄᴏᴍᴇ Mᴇssᴀɢᴇs Dɪsᴀʙʟᴇᴅ</b>\n\nMᴇᴍʙᴇʀs Wɪʟʟ Nᴏᴛ Rᴇᴄᴇɪᴠᴇ A Gʀᴇᴇᴛɪɴɢ Wʜᴇɴ Tʜᴇʏ Jᴏɪɴ.`,
                        getCloseKeyboard()
                    );
                } else {
                    welcomeEnabled.add(chatId);
                    await botApi.sendMessage(chatId,
                        `🔔 <b>Wᴇʟᴄᴏᴍᴇ Mᴇssᴀɢᴇs Eɴᴀʙʟᴇᴅ</b>\n\nNᴇᴡ Mᴇᴍʙᴇʀs Wɪʟʟ Rᴇᴄᴇɪᴠᴇ A Gʀᴇᴇᴛɪɴɢ Wʜᴇɴ Tʜᴇʏ Jᴏɪɴ.`,
                        getCloseKeyboard()
                    );
                }
                return;
            }

            // /goodbye (group admins only — toggle leave messages)
            if (cmd === '/goodbye') {
                trackCommand('goodbye');
                if (!isGroupChat(chatType)) {
                    await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    return;
                }
                if (leaveEnabled.has(chatId)) {
                    leaveEnabled.delete(chatId);
                    await botApi.sendMessage(chatId,
                        `🔕 <b>Lᴇᴀᴠᴇ Mᴇssᴀɢᴇs Dɪsᴀʙʟᴇᴅ</b>\n\nMᴇᴍʙᴇʀs Wɪʟʟ Nᴏᴛ Rᴇᴄᴇɪᴠᴇ A Fᴀʀᴇᴡᴇʟʟ Wʜᴇɴ Tʜᴇʏ Lᴇᴀᴠᴇ.`,
                        getCloseKeyboard()
                    );
                } else {
                    leaveEnabled.add(chatId);
                    await botApi.sendMessage(chatId,
                        `🔔 <b>Lᴇᴀᴠᴇ Mᴇssᴀɢᴇs Eɴᴀʙʟᴇᴅ</b>\n\nMᴇᴍʙᴇʀs Wɪʟʟ Rᴇᴄᴇɪᴠᴇ A Fᴀʀᴇᴡᴇʟʟ Wʜᴇɴ Tʜᴇʏ Lᴇᴀᴠᴇ.`,
                        getCloseKeyboard()
                    );
                }
                return;
            }
        }

        // ─── Welcome & Leave Messages ───
        if (data.message) {
            const msg = data.message;

            // New members joined
            if (msg.new_chat_members && msg.new_chat_members.length > 0 && welcomeEnabled.has(chatId)) {
                const mentions = msg.new_chat_members
                    .map(m => `<b>${m.first_name || m.username || 'Traveler'}</b>`)
                    .join(', ');
                const chatTitle = content.chat.title || 'this group';
                const welcomeText =
                    `🦊 Aʜᴀʜᴀ, Wᴇʟᴄᴏᴍᴇ, ${mentions}! 🎋\n` +
                    `Yᴏᴜ'ᴠᴇ Sᴛᴇᴘᴘᴇᴅ Iɴᴛᴏ Tʜᴇ Sᴀᴄʀᴇᴅ Hᴀʟʟs Oғ <b>${chatTitle}</b>\n` +
                    `Wʜᴇʀᴇ Eᴠᴇʀʏ Cʜᴀᴛ Sᴘᴀʀᴋʟᴇs Lɪᴋᴇ A Gʀᴀɴᴅ Fᴇsᴛɪᴠᴀʟ. ✨`;

                const welcomeBtns = [
                    [
                        { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ ✨', url: 'https://t.me/Shineii86' }
                    ],
                    [
                        { text: '⭐ Sᴛɪᴄᴋᴇʀs', url: 'https://t.me/MaximXStickers' },
                        { text: 'Bᴏᴛs 🤖', url: 'https://t.me/MaximXBots' }
                    ]
                ];

                try {
                    // Delete join notification
                    await botApi.deleteMessage(chatId, msg.message_id);
                } catch {}

                try {
                    if (botPhoto) {
                        await botApi.sendPhoto(chatId, botPhoto, welcomeText, welcomeBtns);
                    } else {
                        await botApi.sendMessage(chatId, welcomeText, welcomeBtns);
                    }
                } catch {}
            }

            // Member left
            if (msg.left_chat_member && leaveEnabled.has(chatId)) {
                const user = msg.left_chat_member;
                const userName = user.first_name || user.username || 'Traveler';
                const chatTitle = content.chat.title || 'this group';
                const leaveText =
                    `👋 Fᴀʀᴇᴡᴇʟʟ, <b>${userName}</b>…\n` +
                    `Yᴏᴜʀ Sᴘᴀʀᴋ Wɪʟʟ Aʟᴡᴀʏs Lɪɴɢᴇʀ Wɪᴛʜɪɴ <b>${chatTitle}</b>.\n\n` +
                    `Mᴀʏ Tʜᴇ Eʟᴇᴄᴛʀᴏ Aʀᴄʜᴏɴ Gᴜɪᴅᴇ Yᴏᴜ Bᴀᴄᴋ Aɴʏᴛɪᴍᴇ.`;

                const leaveBtns = [
                    [
                        { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ ✨', url: 'https://t.me/Shineii86' }
                    ],
                    [
                        { text: '⭐ Sᴛɪᴄᴋᴇʀs', url: 'https://t.me/MaximXStickers' },
                        { text: 'Bᴏᴛs 🤖', url: 'https://t.me/MaximXBots' }
                    ]
                ];

                try {
                    // Delete leave notification
                    await botApi.deleteMessage(chatId, msg.message_id);
                } catch {}

                try {
                    if (botPhoto) {
                        await botApi.sendPhoto(chatId, botPhoto, leaveText, leaveBtns);
                    } else {
                        await botApi.sendMessage(chatId, leaveText, leaveBtns);
                    }
                } catch {}
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
            const chatRandomLevel = perChatRandomLevel[chatId] !== undefined
                ? perChatRandomLevel[chatId]
                : RandomLevel;
            const threshold = (10 - chatRandomLevel) / 10;
            if (Math.random() < threshold) {
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
