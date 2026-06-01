/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — bot-handler.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Core bot logic. Processes all Telegram updates:
 *   commands, callback queries, welcome/leave events,
 *   and auto-reaction engine with rate limiting.
 *
 * @exports onUpdate(data, botApi, Reactions, RestrictedChats,
 *                   botUsername, RandomLevel, ownerId,
 *                   webhookSecret, botPhoto)
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import {
    startMessage, helpMessage, aboutMessage, donateMessage, statsHeader,
    reactionsUpdated, reactionsReset, reactionsInvalid,
    pausedMessage, resumedMessage, notPausedMessage,
    broadcastStarted, broadcastDone, onlyOwnerMessage,
    onlyAdminMessage, groupOnlyMessage, pingMessage,
    adminPanelMessage
} from './constants.js';
import { getRandomPositiveReaction, splitEmojis, log } from './helper.js';
import { getAdFooter } from './ads.js';
import { Store } from './store.js';

// ══════════════════════════════════════════════════════════════
// IN-MEMORY STATE (runtime-only, not persisted)
// ══════════════════════════════════════════════════════════════

// NOTE: Persistent state (chats, reactions, paused, restricted, welcome,
//       goodbye, stats) lives in the Store. These are runtime-only:

const uniqueChats = new Set();   // Chat IDs seen this session
const reactionLog = [];          // Last 50 Reactions: [{chatId, emoji, timestamp}]
const rateLimitMap = {};         // chatId → { count, resetAt }
const chatNames = {};            // chatId → Chat Title (Cached)
const perChatRandomLevel = {};   // chatId → Random Level Override (0-10)
const lastBotMessage = {};       // chatId → last bot message_id (for cleanup)

const LOG_MAX = 50;
const RATE_LIMIT_MAX = 30;       // Max Reactions Per Minute Per Chat
const RATE_LIMIT_WINDOW = 60000; // 1 Minute
const BROADCAST_COOLDOWN = 60000; // 1 Minute Between Broadcasts
let lastBroadcastTime = 0;

// ══════════════════════════════════════════════════════════════
// HELPER FUNCTIONS
// ══════════════════════════════════════════════════════════════

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
    const month = ['Jᴀɴ', 'Fᴇʙ', 'Mᴀʀ', 'Aᴘʀ', 'Mᴀʏ', 'Jᴜɴ', 'Jᴜʟ', 'Aᴜɢ', 'Sᴇᴘ', 'Oᴄᴛ', 'Nᴏᴠ', 'Dᴇᴄ'][ist.getUTCMonth()];
    const year = ist.getUTCFullYear();
    let hours = ist.getUTCHours();
    const ampm = hours >= 12 ? 'Pᴍ' : 'Aᴍ';
    hours = hours % 12 || 12;
    const mins = String(ist.getUTCMinutes()).padStart(2, '0');
    const secs = String(ist.getUTCSeconds()).padStart(2, '0');
    return `${day} ${month} ${year}, ${hours}:${mins}:${secs} ${ampm} Isᴛ`;
}

async function trackCommand(cmd) {
    await Store.trackCommand(cmd);
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
    const custom = Store.getReaction(chatId);
    if (custom) {
        return splitEmojis(custom);
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

/**
 * Clean up previous bot response and user command message.
 * Deletes the old bot message (if tracked) and the triggering message.
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {number} chatId - Chat ID
 * @param {number} userMessageId - User's command message ID to delete
 */
async function cleanupMessages(botApi, chatId, userMessageId) {
    // Delete previous bot response
    if (lastBotMessage[chatId]) {
        try { await botApi.deleteMessage(chatId, lastBotMessage[chatId]); } catch {}
        delete lastBotMessage[chatId];
    }
    // Delete user's command message
    try { await botApi.deleteMessage(chatId, userMessageId); } catch {}
}

/**
 * Track a sent bot message for future cleanup.
 * @param {number} chatId - Chat ID
 * @param {Object} sent - Telegram API response from sendMessage
 */
function trackBotMessage(chatId, sent) {
    const msgId = sent?.result?.message_id;
    if (msgId) lastBotMessage[chatId] = msgId;
}

// ══════════════════════════════════════════════════════════════
// INLINE KEYBOARDS
// ══════════════════════════════════════════════════════════════
const startTime = Date.now();

function getStatsMessage() {
    const storeStats = Store.getStats();
    const uptime = formatUptime(Date.now() - startTime);
    const cmdLines = Object.entries(storeStats.commandUsage)
        .map(([cmd, count]) => `<code>/${cmd}</code> — ${count}`)
        .join('\n') || 'Nᴏ Cᴏᴍᴍᴀɴᴅs Usᴇᴅ Yᴇᴛ. Iᴍᴘʀᴇssɪᴠᴇ Rᴇsᴛʀᴀɪɴᴛ.';

    let topChatsText = '';
    const top = getTopChats(5);
    if (top.length) {
        topChatsText = '\n\n🏆 <b>Tᴏᴘ Cʜᴀᴛs (Lᴀsᴛ 50 Rᴇᴀᴄᴛɪᴏɴs):</b>\n' +
            top.map(([id, count], i) => {
                const name = chatNames[id] || `Chat ${id}`;
                return `${i + 1}. ${name} — ${count}`;
            }).join('\n');
    }

    return `${statsHeader}📨 <b>Mᴇssᴀɢᴇs Pʀᴏᴄᴇssᴇᴅ:</b> ${storeStats.messagesProcessed.toLocaleString()}
💫 <b>Rᴇᴀᴄᴛɪᴏɴs Sᴇɴᴛ:</b> ${storeStats.reactionsSent.toLocaleString()}
💬 <b>Uɴɪҩᴜᴇ Cʜᴀᴛs:</b> ${uniqueChats.size.toLocaleString()} (sᴇssɪᴏɴ) · ${Store.getChatCount().toLocaleString()} (ᴛᴏᴛᴀʟ)
💾 <b>Sᴛᴏʀᴀɢᴇ:</b> ${Store.getStorageType()}
⏸️ <b>Pᴀᴜsᴇᴅ Cʜᴀᴛs:</b> ${Store.getPausedCount().toLocaleString()}
🚫 <b>Rᴇsᴛʀɪᴄᴛᴇᴅ Cʜᴀᴛs:</b> ${Store.getRestrictedCount().toLocaleString()}
🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Oᴠᴇʀʀɪᴅᴇs:</b> ${Object.keys(perChatRandomLevel).length.toLocaleString()}
👋 <b>Wᴇʟᴄᴏᴍᴇ Eɴᴀʙʟᴇᴅ:</b> ${Store.getWelcomeCount().toLocaleString()}
🚪 <b>Gᴏᴏᴅʙʏᴇ Eɴᴀʙʟᴇᴅ:</b> ${Store.getGoodbyeCount().toLocaleString()}
⏱️ <b>Uᴘᴛɪᴍᴇ:</b> ${uptime}
🕐 <b>Sᴛᴀʀᴛᴇᴅ:</b> ${formatIST(startTime)}

📋 <b>Cᴏᴍᴍᴀɴᴅ Usᴀɢᴇ:</b>
${cmdLines}${topChatsText}

<i>Gʟᴏʙᴀʟ Sᴛᴀᴛs. Хорошо, Rɪɢʜᴛ?</i>`;
}

// ══════════════════════════════════════════════════════════════
// INLINE KEYBOARDS
// ══════════════════════════════════════════════════════════════
// INLINE KEYBOARDS
// ══════════════════════════════════════════════════════════════

// ─── Keyboards ───

function getStartKeyboard(botUsername, userId, ownerId) {
    const keyboard = [];

    // Website button (only if WEB_URL is set)
    if (process.env.WEB_URL) {
        keyboard.push([{ text: '🌐 Wᴇʙsɪᴛᴇ 🖥️', url: process.env.WEB_URL, style: 'success' }]);
    }

    keyboard.push(
        [
            { text: '✚ Aᴅᴅ Tᴏ Cʜᴀɴɴᴇʟ', url: `https://t.me/${botUsername}?startchannel=botstart`, style: 'success' },
            { text: 'Aᴅᴅ Tᴏ Gʀᴏᴜᴘ ✚', url: `https://t.me/${botUsername}?startgroup=botstart`, style: 'success' },
        ],
        [
            { text: '📚 Hᴇʟᴘ', callback_data: 'cb_help', style: 'primary' },
            { text: 'Aʙᴏᴜᴛ 🤖', callback_data: 'cb_about', style: 'primary' },
        ],
        [
            { text: '🎁 Dᴏɴᴀᴛᴇ', callback_data: 'cb_donate', style: 'primary' },
            { text: 'Sᴛᴀᴛs 📊', callback_data: 'cb_stats', style: 'primary' },
        ],
    );

    // Show admin panel button only to the owner
    if (ownerId && userId && String(userId) === String(ownerId)) {
        keyboard.push([{ text: '𝘤Pᴀɴᴇʟ', callback_data: '!admin', style: 'success' }]);
    }

    keyboard.push([{ text: '💥 Cʟᴏsᴇ Mᴇɴᴜ ✨', callback_data: 'cb_close', style: 'danger' }]);
    return keyboard;
}

function getHelpKeyboard(userId, ownerId) {
    const keyboard = [
        [
            { text: '👀 Aʟʏᴀ Rᴇᴀᴄᴛɪᴏɴs ✨', callback_data: 'cb_reactions', style: 'success' },
        ],
        [
            { text: '🔔 Uᴘᴅᴀᴛᴇs', url: 'https://t.me/MaximXBots', style: 'primary' },
            { text: 'Sᴜᴘᴘᴏʀᴛ 💬', url: 'https://t.me/MaximXGroup', style: 'primary' },
        ],
        [
            { text: '🔔 Sᴘᴏɴsᴏʀᴇᴅ Cʜᴀɴɴᴇʟ 💥', url: 'https://t.me/CodeFlix_Bots', style: 'primary' },
        ],
    ];

    // Show admin panel button only to the owner
    if (ownerId && userId && String(userId) === String(ownerId)) {
        keyboard.push([{ text: '𝘤Pᴀɴᴇʟ', callback_data: '!admin', style: 'success' }]);
    }

    keyboard.push([
        { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu', style: 'primary' },
        { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
    ]);
    return keyboard;
}

function getBackKeyboard() {
    return [
        [
            { text: '🔔 Uᴘᴅᴀᴛᴇs', url: 'https://t.me/MaximXBots', style: 'success' },
            { text: 'Sᴜᴘᴘᴏʀᴛ 💬', url: 'https://t.me/MaximXGroup', style: 'success' },
        ],
        [
            { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu', style: 'primary' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
        ]
    ];
}

function getCloseKeyboard() {
    return [
        [
            { text: '◁ Bᴀᴄᴋ', callback_data: 'cb_menu', style: 'primary' },
            { text: 'Cʟᴏsᴇ ✕', callback_data: 'cb_close', style: 'danger' }
        ]
    ];
}

// ══════════════════════════════════════════════════════════════
// FORCE SUBSCRIBE
// ══════════════════════════════════════════════════════════════

/**
 * Check if a user is a member of all required force-subscribe channels.
 *
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {number|string} userId - Telegram user ID to check
 * @param {Array<string>} channels - Channel usernames or IDs
 * @returns {Promise<Object>} { subscribed: boolean, notJoined: Array }
 */
async function checkForceSubscribe(botApi, userId, channels) {
    if (!channels || channels.length === 0) return { subscribed: true, notJoined: [] };

    const notJoined = [];

    for (const channel of channels) {
        try {
            const member = await botApi.getChatMember(channel, userId);
            const status = member?.result?.status;
            if (!status || ['left', 'kicked', 'banned'].includes(status)) {
                notJoined.push(channel);
            }
        } catch {
            // Channel might be invalid or bot not admin — skip silently
            log.warn(`[ForceSub] Cannot check membership for ${channel}`);
        }
    }

    return { subscribed: notJoined.length === 0, notJoined };
}

/**
 * Build the "join required channels" message with buttons.
 */
function getForceSubMessage(notJoined) {
    const buttons = notJoined.map((ch, i) => {
        const clean = ch.replace(/^@/, '');
        const url = clean.match(/^-?\d+$/)
            ? `https://t.me/c/${clean.replace(/^-100/, '')}`
            : `https://t.me/${clean}`;
        return [{ text: `📢 Join Channel ${i + 1}`, url, style: 'success' }];
    });

    buttons.push([{ text: '✅ Jᴏɪɴᴇᴅ? Tʀʏ Aɢᴀɪɴ ↻', callback_data: 'cb_forcecheck', style: 'primary' }]);

    return {
        text: `<b>⚠️ Access Denied!</b>\n\nYou must join the required channel(s) to use this bot.\n\nPlease join and try again.`,
        keyboard: buttons,
    };
}

// ══════════════════════════════════════════════════════════════
// MAIN HANDLER
// ══════════════════════════════════════════════════════════════

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
 * @param {Array} forceSubChannels - Channel usernames/IDs for force subscribe (optional)
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, ownerId, webhookSecret, botPhoto, forceSubChannels = []) {

    // Load persistent chat store (idempotent — only loads once)
    await Store.load();

    // Guard against NaN RandomLevel from invalid env var
    if (isNaN(RandomLevel) || RandomLevel < 0 || RandomLevel > 10) {
        RandomLevel = 0;
    }

    // ---- FEATURE: Callback Query Handler ----

    // ─── Callback Query ───
    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;

        try {
            // Link preview options — show BOT_PHOTO as large preview above text
            const linkPreview = botPhoto ? {
                url: botPhoto,
                prefer_large_media: true,
                show_above_text: true
            } : null;

            /**
             * Smart edit: edits message text in place.
             * Uses link_preview_options for photo display — no caption
             * length limits, no photo↔text transitions needed.
             */
            const editMsg = async (text, keyboard) => {
                await botApi.editMessageText(chatId, messageId, text, keyboard, linkPreview);
            };

            // Retrieve owner ID dynamically for admin panel visibility
            const callbackUserId = cq.from?.id;

            switch (cq.data) {
                case 'cb_help':
                    await editMsg(withAd(helpMessage), getHelpKeyboard(callbackUserId, ownerId));
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
                case 'cb_reactions': {
                    const reactions = getReactionsForChat(chatId, Reactions).join(' ');
                    const isCustom = Store.getReaction(chatId) ? `\n\n<i>✨ Хорошᴏ. Cᴜsᴛᴏᴍ Sᴇᴛ Fᴏʀ Tʜɪs Cʜᴀᴛ.</i>` : `\n\n<i>📌 Mʏ Dᴇғᴀᴜʟᴛ Sᴇᴛ. Tʜᴇʏ'ʀᴇ Pᴇʀғᴇᴄᴛ.</i>`;
                    await editMsg(withAd(`🚀 <b>Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:</b>\n\n${reactions}${isCustom}`), getBackKeyboard());
                    break;
                }
                case '!admin':
                    if (!isOwner(callbackUserId, ownerId)) {
                        await botApi.answerCallbackQuery(cq.id, '👑 Tʜɪs Cᴏᴍᴍᴀɴᴅ Is Fᴏʀ Tʜᴇ Oᴡɴᴇʀ. Дурак.', true);
                        return;
                    }
                    await editMsg(withAd(adminPanelMessage), getCloseKeyboard());
                    break;
                case 'cb_menu': {
                    const name = cq.message?.chat?.type === 'private'
                        ? (cq.from?.first_name || cq.message?.chat?.title)
                        : cq.message?.chat?.title;
                    const caption = withAd(startMessage.replace('UserName', name));
                    const keyboard = getStartKeyboard(botUsername, callbackUserId, ownerId);
                    await editMsg(caption, keyboard);
                    break;
                }
                case 'cb_forcecheck': {
                    // Re-check force subscribe status
                    if (forceSubChannels.length > 0) {
                        const { subscribed, notJoined } = await checkForceSubscribe(botApi, callbackUserId, forceSubChannels);
                        if (subscribed) {
                            await botApi.answerCallbackQuery(cq.id, '✅ Tʜᴀɴᴋ ʏᴏᴜ! Yᴏᴜ ᴄᴀɴ ɴᴏᴡ ᴜsᴇ ᴛʜᴇ ʙᴏᴛ.');
                            const name = cq.from?.first_name || 'User';
                            const caption = withAd(startMessage.replace('UserName', name));
                            const keyboard = getStartKeyboard(botUsername, callbackUserId, ownerId);
                            await editMsg(caption, keyboard);
                        } else {
                            await botApi.answerCallbackQuery(cq.id, '❌ Yᴏᴜ ʜᴀᴠᴇɴ\'ᴛ ᴊᴏɪɴᴇᴅ ᴀʟʟ ᴄʜᴀɴɴᴇʟs ʏᴇᴛ!', true);
                        }
                    } else {
                        await botApi.answerCallbackQuery(cq.id, '✅ Fᴏʀᴄᴇ Sᴜʙsᴄʀɪʙᴇ ɪs ᴅɪsᴀʙʟᴇᴅ.');
                    }
                    break;
                }
                case 'cb_close':
                    await botApi.deleteMessage(chatId, messageId);
                    break;
                default: {
                    await botApi.answerCallbackQuery(cq.id, '❓ Хмпф. Uɴᴋɴᴏᴡɴ Aᴄᴛɪᴏɴ.', true);
                    return;
                }
            }
            await botApi.answerCallbackQuery(cq.id);
        } catch (error) {
            log.error('[Callback]', error.message);
            try { await botApi.answerCallbackQuery(cq.id, '⚠️ Что?! Sᴏᴍᴇᴛʜɪɴɢ Wᴇɴᴛ Wʀᴏɴɢ.', true); } catch {}
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

        // Persist chat to disk
        await Store.updateChat(chatId, chatNames[chatId], chatType);

        // Track stats
        await Store.trackMessage();
        uniqueChats.add(chatId);

        // ---- FEATURE: Command Router ----

        // Link preview options — show BOT_PHOTO as large preview above text
        const linkPreview = botPhoto ? {
            url: botPhoto,
            prefer_large_media: true,
            show_above_text: true
        } : null;

    // ─── Commands (only from users, not channel posts) ───
        if (data.message && text) {
            const cmd = text.split(' ')[0].replace(/@\S+/, '');
            const args = text.split(' ').slice(1).join(' ');

            // ─── Force Subscribe Check (private chats only, skip owner) ───
            if (chatType === 'private' && forceSubChannels.length > 0 && String(userId) !== String(ownerId)) {
                const { subscribed, notJoined } = await checkForceSubscribe(botApi, userId, forceSubChannels);
                if (!subscribed) {
                    const fsMsg = getForceSubMessage(notJoined);
                    await botApi.sendMessage(chatId, fsMsg.text, fsMsg.keyboard);
                    return;
                }
            }

            // /start
            if (cmd === '/start') {
                trackCommand('start');
                const displayName = chatType === 'private'
                    ? (content.from?.first_name || content.chat.title)
                    : content.chat.title;
                const caption = withAd(startMessage.replace('UserName', displayName));
                const keyboard = getStartKeyboard(botUsername, userId, ownerId);
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, caption, keyboard, linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /help
            if (cmd === '/help') {
                trackCommand('help');
                const keyboard = getHelpKeyboard(userId, ownerId);
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, withAd(helpMessage), keyboard, linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /about
            if (cmd === '/about') {
                trackCommand('about');
                const caption = withAd(aboutMessage);
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, caption, getBackKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /ping
            if (cmd === '/ping') {
                trackCommand('ping');
                const start = Date.now();
                await cleanupMessages(botApi, chatId, message_id);
                try {
                    const sent = await botApi.sendMessage(chatId, '🏓 Хмпф. Pɪɴɢɪɴɢ...', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    const latency = Date.now() - start;
                    const msgId = sent?.result?.message_id;
                    const pingText = withAd(pingMessage(latency) + `\n🕐 ${formatIST(Date.now())}`);
                    if (msgId) {
                        await botApi.editMessageText(chatId, msgId, pingText, getCloseKeyboard(), linkPreview);
                    } else {
                        const sent2 = await botApi.sendMessage(chatId, pingText, getCloseKeyboard(), linkPreview);
                        trackBotMessage(chatId, sent2);
                    }
                } catch {
                    const latency = Date.now() - start;
                    const pingText = withAd(pingMessage(latency) + `\n🕐 ${formatIST(Date.now())}`);
                    const sent2 = await botApi.sendMessage(chatId, pingText, getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, sent2);
                }
                return;
            }

            // /stats
            if (cmd === '/stats') {
                trackCommand('stats');
                const caption = withAd(getStatsMessage());
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, caption, getBackKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /reactions
            if (cmd === '/reactions') {
                trackCommand('reactions');
                const reactions = getReactionsForChat(chatId, Reactions).join(' ');
                const isCustom = Store.getReaction(chatId) ? `\n\n<i>✨ Хорошо. Cᴜsᴛᴏᴍ Sᴇᴛ Fᴏʀ Tʜɪs Cʜᴀᴛ.</i>` : `\n\n<i>📌 Mʏ Dᴇғᴀᴜʟᴛ Sᴇᴛ. Tʜᴇʏ'ʀᴇ Pᴇʀғᴇᴄᴛ.</i>`;
                const caption = withAd(`🚀 <b>Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:</b>\n\n${reactions}${isCustom}`);
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, caption, getBackKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /setreactions (group admins only)
            if (cmd === '/setreactions') {
                trackCommand('setreactions');
                if (!isGroupChat(chatType)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await cleanupMessages(botApi, chatId, message_id);
                if (!args || args.trim().length === 0) {
                    await Store.deleteReaction(chatId);
                    const sent = await botApi.sendMessage(chatId, reactionsReset, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const emojis = splitEmojis(args.trim());
                if (emojis.length === 0) {
                    const sent = await botApi.sendMessage(chatId, reactionsInvalid, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await Store.setReaction(chatId, emojis.join(''));
                const sent = await botApi.sendMessage(chatId,
                    withAd(`${reactionsUpdated}🎯 <b>Nᴇᴡ Rᴇᴀᴄᴛɪᴏɴs:</b> ${emojis.join(' ')}`),
                    getBackKeyboard(), linkPreview
                );
                trackBotMessage(chatId, sent);
                return;
            }

            // /pause (group admins only)
            if (cmd === '/pause') {
                trackCommand('pause');
                await cleanupMessages(botApi, chatId, message_id);
                if (!isGroupChat(chatType)) {
                    const sent = await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await Store.pauseChat(chatId);
                const sent = await botApi.sendMessage(chatId, withAd(pausedMessage), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /resume (group admins only)
            if (cmd === '/resume') {
                trackCommand('resume');
                await cleanupMessages(botApi, chatId, message_id);
                if (!isGroupChat(chatType)) {
                    const sent = await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!Store.isPaused(chatId)) {
                    const sent = await botApi.sendMessage(chatId, withAd(notPausedMessage), getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, sent);
                    return;
                }
                await Store.resumeChat(chatId);
                const sent = await botApi.sendMessage(chatId, withAd(resumedMessage), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /randomlevel <0-10> (group admins only for override; shows info in DMs)
            if (cmd === '/randomlevel') {
                trackCommand('randomlevel');
                await cleanupMessages(botApi, chatId, message_id);
                try {
                    const trimmedArgs = args?.trim();
                    const isGroup = isGroupChat(chatType);

                    // In private chats, show global default info (no override possible)
                    if (!isGroup) {
                        const globalLevel = RandomLevel;
                        const globalChance = (10 - globalLevel) * 10;
                        const sent = await botApi.sendMessage(chatId,
                            withAd(`🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ — Gʟᴏʙᴀʟ Dᴇғᴀᴜʟᴛ</b>\n\n` +
                            `📊 Cᴜʀʀᴇɴᴛ: <code>${globalLevel}</code> — Rᴇᴀᴄᴛ ~${globalChance}% Oғ Tʜᴇ Tɪᴍᴇ\n\n` +
                            `💡 <code>0</code> = Eᴠᴇʀʏ Mᴇssᴀɢᴇ | <code>10</code> = Nᴇᴠᴇʀ\n\n` +
                            `⚠️ To Oᴠᴇʀʀɪᴅᴇ, Usᴇ <code>/randomlevel &lt;0-10&gt;</code> Iɴ A Gʀᴏᴜᴘ.\n` +
                            `📌 Aᴅᴍɪɴs Oɴʟʏ. Dᴏɴ'ᴛ Eᴠᴇɴ Tʀʏ Oᴛʜᴇʀᴡɪsᴇ.`),
                            getCloseKeyboard(), linkPreview
                        );
                        trackBotMessage(chatId, sent);
                        return;
                    }

                    // Group: require admin permission
                    if (!await isGroupAdmin(botApi, chatId, userId)) {
                        const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                        trackBotMessage(chatId, sent);
                        return;
                    }

                    // No args → show current level for this chat
                    if (!trimmedArgs) {
                        const current = perChatRandomLevel[chatId] !== undefined
                            ? perChatRandomLevel[chatId]
                            : RandomLevel;
                        const source = perChatRandomLevel[chatId] !== undefined ? 'Cᴜsᴛᴏᴍ' : 'Gʟᴏʙᴀʟ';
                        const currentChance = (10 - current) * 10;
                        const sent = await botApi.sendMessage(chatId,
                            withAd(`🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Fᴏʀ Tʜɪs Cʜᴀᴛ:</b>\n\n` +
                            `📊 Cᴜʀʀᴇɴᴛ: <code>${current}</code> (${source}) — Rᴇᴀᴄᴛ ~${currentChance}%\n` +
                            `📌 Gʟᴏʙᴀʟ Dᴇғᴀᴜʟᴛ: <code>${RandomLevel}</code>\n\n` +
                            `💡 Usᴇ <code>/randomlevel &lt;0-10&gt;</code> To Cʜᴀɴᴀɢᴇ. Iғ Yᴏᴜ Dᴀʀᴇ.`),
                            getCloseKeyboard(), linkPreview
                        );
                        trackBotMessage(chatId, sent);
                        return;
                    }

                    // Validate the level value
                    const level = parseInt(trimmedArgs, 10);
                    if (isNaN(level) || level < 0 || level > 10) {
                        const sent = await botApi.sendMessage(chatId,
                            `📵 Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Mᴜsᴛ Bᴇ A Nᴜᴍʙᴇʀ Bᴇᴛᴡᴇᴇɴ <code>0</code> Aɴᴅ <code>10</code>.\n\n` +
                            `📌 Usᴀɢᴇ: <code>/randomlevel &lt;0-10&gt;</code>\n` +
                            `💡 <code>0</code> = Eᴠᴇʀʏ Mᴇssᴀɢᴇ | <code>10</code> = Nᴇᴠᴇʀ. Eᴠᴇɴ I Cᴏᴜʟᴅ Fɪɢᴜʀᴇ Tʜᴀᴛ Oᴜᴛ.`,
                            getCloseKeyboard()
                        );
                        trackBotMessage(chatId, sent);
                        return;
                    }

                    // Set per-chat override
                    perChatRandomLevel[chatId] = level;
                    const chance = (10 - level) * 10;
                    const sent = await botApi.sendMessage(chatId,
                        withAd(`🎲 <b>Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Sᴇᴛ!</b> 📊\n\n` +
                        `🎯 Lᴇᴠᴇʟ: <code>${level}</code> — Rᴇᴀᴄᴛ ~${chance}% Oғ Tʜᴇ Tɪᴍᴇ\n\n` +
                        `💡 <code>0</code> = Eᴠᴇʀʏ Mᴇssᴀɢᴇ | <code>10</code> = Nᴇᴠᴇʀ\n` +
                        `🔄 Rᴇsᴇᴛs Oɴ Rᴇsᴛᴀʀᴛ. Ничего страшного.`),
                        getCloseKeyboard(), linkPreview
                    );
                    trackBotMessage(chatId, sent);
                } catch (error) {
                    log.error('[/randomlevel]', error.message);
                    try {
                        const sent = await botApi.sendMessage(chatId, `📵 Хмпф. Fᴀɪʟᴇᴅ Tᴏ Pʀᴏᴄᴇss /randomlevel: ${error.message}`, getCloseKeyboard());
                        trackBotMessage(chatId, sent);
                    } catch {}
                }
                return;
            }

            // /donate
            if (cmd === '/donate') {
                trackCommand('donate');
                const caption = withAd(donateMessage);
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, caption, getBackKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /broadcast (owner only, with cooldown)
            if (cmd === '/broadcast') {
                trackCommand('broadcast');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📝 Хмпф… Usᴀɢᴇ: <code>/broadcast &lt;message&gt;</code>', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const now = Date.now();
                if (now - lastBroadcastTime < BROADCAST_COOLDOWN) {
                    const remaining = Math.ceil((BROADCAST_COOLDOWN - (now - lastBroadcastTime)) / 1000);
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, `⏳ Хмпф. Cᴏᴏʟᴅᴏᴡɴ! Wᴀɪᴛ ${remaining}s. Dᴏɴ'ᴛ Rᴜsʜ Mᴇ.`, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                lastBroadcastTime = now;
                await cleanupMessages(botApi, chatId, message_id);
                let sent = await botApi.sendMessage(chatId, broadcastStarted, getCloseKeyboard());
                trackBotMessage(chatId, sent);
                const allChats = new Set(uniqueChats);
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
                sent = await botApi.sendMessage(chatId, withAd(broadcastDone(success, failed)), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /log (owner only)
            if (cmd === '/log') {
                trackCommand('log');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (reactionLog.length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📋 Хмпф. Tʜᴇ Rᴇᴀᴄᴛɪᴏɴ Lᴏɢ Is Eᴍᴘᴛʏ. Gɪᴠᴇ Iᴛ Sᴏᴍᴇ Tɪᴍᴇ.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const lines = reactionLog.slice(-10).reverse().map((e, i) => {
                    const time = formatIST(e.timestamp);
                    const name = chatNames[e.chatId] || e.chatId;
                    return `${i + 1}. ${e.emoji} → ${name} (${time})`;
                }).join('\n');
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId, withAd(`📋 <b>Lᴀsᴛ 10 Rᴇᴀᴄᴛɪᴏɴs:</b>\n\n${lines}`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /leave and /remove (owner only)
            if (cmd === '/leave' || cmd === '/remove') {
                trackCommand(cmd === '/leave' ? 'leave' : 'remove');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📝 Хмпф. Usᴀɢᴇ: <code>/leave &lt;chat_id&gt;</code>', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const targetChatId = args.trim();
                if (!/^-?\d+$/.test(targetChatId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📵 Хмпф. Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID. Mᴜsᴛ Bᴇ Nᴜᴍᴇʀɪᴄ.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await cleanupMessages(botApi, chatId, message_id);
                try {
                    await botApi.leaveChat(targetChatId);
                    uniqueChats.delete(Number(targetChatId));
                    delete perChatRandomLevel[targetChatId];
                    await Store.removeChat(targetChatId);
                    const sent = await botApi.sendMessage(chatId, withAd(`✅ До свидания. Lᴇғᴛ Cʜᴀᴛ <code>${targetChatId}</code>.`), getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, sent);
                } catch (error) {
                    const sent = await botApi.sendMessage(chatId, `📵 Хмпф. Fᴀɪʟᴇᴅ Tᴏ Lᴇᴀᴠᴇ Cʜᴀᴛ <code>${targetChatId}</code>:\n${error.message}`, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                }
                return;
            }

            // /chats (owner only)
            if (cmd === '/chats') {
                trackCommand('chats');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const allChats = Store.getAllChats();
                if (allChats.length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📭 Хмпф. Nᴏ Aᴄᴛɪᴠᴇ Cʜᴀᴛs Yᴇᴛ.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const typeOrder = { supergroup: 0, group: 1, channel: 2, private: 3, unknown: 4 };
                allChats.sort((a, b) => (typeOrder[a.type] ?? 9) - (typeOrder[b.type] ?? 9));

                const chatLines = allChats.map((c, i) => {
                    const typeEmoji = { group: '👥', supergroup: '👥', channel: '📢', private: '💬' }[c.type] || '❓';
                    const paused = Store.isPaused(c.id) ? ' ⏸️' : '';
                    const restricted = Store.isRestricted(c.id) || RestrictedChats.includes(c.id) ? ' 🚫' : '';
                    const msgs = c.messageCount ? ` — ${c.messageCount} msgs` : '';
                    return `${i + 1}. ${typeEmoji} ${c.title} (<code>${c.id}</code>)${paused}${restricted}${msgs}`;
                }).join('\n');

                const groups = allChats.filter(c => c.type === 'group' || c.type === 'supergroup').length;
                const channels = allChats.filter(c => c.type === 'channel').length;
                const privates = allChats.filter(c => c.type === 'private').length;

                const summary = `📊 ${groups} ɢʀᴏᴜᴘs · ${channels} ᴄʜᴀɴɴᴇʟs · ${privates} ᴘʀɪᴠᴀᴛᴇ`;
                await cleanupMessages(botApi, chatId, message_id);
                const sent = await botApi.sendMessage(chatId,
                    withAd(`💬 <b>Aʟʟ Cʜᴀᴛs (${allChats.length}):</b>\n\n${chatLines}\n\n${summary}\n\n⏸️ = Pᴀᴜsᴇᴅ | 🚫 = Rᴇsᴛʀɪᴄᴛᴇᴅ | ᴍsɢs = Tᴏᴛᴀʟ Mᴇssᴀɢᴇs`),
                    getCloseKeyboard(), linkPreview
                );
                trackBotMessage(chatId, sent);
                return;
            }

            // /setwebhook <url> (owner only)
            if (cmd === '/setwebhook') {
                trackCommand('setwebhook');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await cleanupMessages(botApi, chatId, message_id);
                if (!args || args.trim().length === 0) {
                    try {
                        const info = await botApi.getWebhookInfo();
                        const wh = info.result;
                        const status = wh.url ? `🔗 <b>Uʀʟ:</b> ${wh.url}` : '📵 Nᴏ Wᴇʙʜᴏᴏᴋ Sᴇᴛ.';
                        const pending = wh.pending_update_count > 0 ? `\n⏳ <b>Pᴇɴᴅɪɴɢ:</b> ${wh.pending_update_count}` : '';
                        const error = wh.last_error_message ? `\n⚠️ <b>Eʀʀᴏʀ:</b> ${wh.last_error_message}` : '';
                        const sent = await botApi.sendMessage(chatId, `📡 <b>Wᴇʙʜᴏᴏᴋ Sᴛᴀᴛᴜs:</b>\n\n${status}${pending}${error}`, getCloseKeyboard(), linkPreview);
                        trackBotMessage(chatId, sent);
                    } catch (error) {
                        const sent = await botApi.sendMessage(chatId, `📵 Хмпф. Fᴀɪʟᴇᴅ Tᴏ Fᴇᴛᴄʜ Wᴇʙʜᴏᴏᴋ Iɴғᴏ:\n${error.message}`, getCloseKeyboard());
                        trackBotMessage(chatId, sent);
                    }
                    return;
                }
                const webhookUrl = args.trim();
                if (!webhookUrl.startsWith('https://')) {
                    const sent = await botApi.sendMessage(chatId, '📵 Хмпф. Wᴇʙʜᴏᴏᴋ Uʀʟ Mᴜsᴛ Sᴛᴀʀᴛ Wɪᴛʜ<code>https://</code>', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                try {
                    await botApi.setWebhook(webhookUrl, webhookSecret || '');
                    const sent = await botApi.sendMessage(chatId, withAd(`✅ Хорошо! Wᴇʙʜᴏᴏᴋ Sᴇᴛ Sᴜᴄᴄᴇssғᴜʟʟʏ!

🔗 ${webhookUrl}`), getCloseKeyboard(), linkPreview);
                    trackBotMessage(chatId, sent);
                } catch (error) {
                    const sent = await botApi.sendMessage(chatId, `📵 Хмпф. Fᴀɪʟᴇᴅ Tᴏ Sᴇᴛ Wᴇʙʜᴏᴏᴋ:\n${error.message}`, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                }
                return;
            }

            // /restrict <chatId> (owner only)
            if (cmd === '/restrict') {
                trackCommand('restrict');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📝 Хмпф. Usᴀɢᴇ: <code>/restrict &lt;chat_id&gt;</code>', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const restrictId = Number(args.trim());
                if (!restrictId) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📵 Хмпф. Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await cleanupMessages(botApi, chatId, message_id);
                await Store.restrictChat(restrictId);
                const sent = await botApi.sendMessage(chatId, withAd(`🚫 Хорошо. Cʜᴀᴛ <code>${restrictId}</code> Rᴇsᴛʀɪᴄᴛᴇᴅ. I Wɪʟʟ Nᴏᴛ Rᴇᴀᴄᴛ Tʜᴇʀᴇ.`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /unrestrict <chatId> (owner only)
            if (cmd === '/unrestrict') {
                trackCommand('unrestrict');
                if (!isOwner(userId, ownerId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, onlyOwnerMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!args || args.trim().length === 0) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📝 Хмпф. Usᴀɢᴇ: <code>/unrestrict &lt;chat_id&gt;</code>', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const unrestrictId = Number(args.trim());
                if (!unrestrictId) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, '📵 Хмпф. Iɴᴠᴀʟɪᴅ Cʜᴀᴛ ID.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!Store.isRestricted(unrestrictId)) {
                    await cleanupMessages(botApi, chatId, message_id);
                    const sent = await botApi.sendMessage(chatId, 'ℹ️ Хмпф. Tʜᴀᴛ Cʜᴀᴛ Is Nᴏᴛ Rᴇsᴛʀɪᴄᴛᴇᴅ.', getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                await cleanupMessages(botApi, chatId, message_id);
                await Store.unrestrictChat(unrestrictId);
                const sent = await botApi.sendMessage(chatId, withAd(`✅ Хорошо. Cʜᴀᴛ <code>${unrestrictId}</code> Uɴʀᴇsᴛʀɪᴄᴛᴇᴅ.`), getCloseKeyboard(), linkPreview);
                trackBotMessage(chatId, sent);
                return;
            }

            // /welcome (group admins only — toggle welcome messages)
            if (cmd === '/welcome') {
                trackCommand('welcome');
                await cleanupMessages(botApi, chatId, message_id);
                if (!isGroupChat(chatType)) {
                    const sent = await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const enabled = await Store.toggleWelcome(chatId);
                let sent;
                if (!enabled) {
                    sent = await botApi.sendMessage(chatId,
                        withAd(`🔕 <b>Wᴇʟᴄᴏᴍᴇ Mᴇssᴀɢᴇs Dɪsᴀʙʟᴇᴅ</b>\n\nХмпф. Fɪɴᴇ. Nᴏ Gʀᴇᴇᴛɪɴɢs.`),
                        getCloseKeyboard(), linkPreview
                    );
                } else {
                    sent = await botApi.sendMessage(chatId,
                        withAd(`🔔 <b>Wᴇʟᴄᴏᴍᴇ Mᴇssᴀɢᴇs Eɴᴀʙʟᴇᴅ</b>\n\nХорошо. Nᴇᴡ Mᴇᴍʙᴇʀs Wɪʟʟ Rᴇᴄᴇɪᴠᴇ Mʏ Gʀᴇᴇᴛɪɴɢ.`),
                        getCloseKeyboard(), linkPreview
                    );
                }
                trackBotMessage(chatId, sent);
                return;
            }

            // /goodbye (group admins only — toggle leave messages)
            if (cmd === '/goodbye') {
                trackCommand('goodbye');
                await cleanupMessages(botApi, chatId, message_id);
                if (!isGroupChat(chatType)) {
                    const sent = await botApi.sendMessage(chatId, groupOnlyMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                if (!await isGroupAdmin(botApi, chatId, userId)) {
                    const sent = await botApi.sendMessage(chatId, onlyAdminMessage, getCloseKeyboard());
                    trackBotMessage(chatId, sent);
                    return;
                }
                const enabled = await Store.toggleGoodbye(chatId);
                let sent;
                if (!enabled) {
                    sent = await botApi.sendMessage(chatId,
                        withAd(`🔕 <b>Lᴇᴀᴠᴇ Mᴇssᴀɢᴇs Dɪsᴀʙʟᴇᴅ</b>\n\nХмпф. Fɪɴᴇ. Tʜᴇʏ Cᴀɴ Jᴜsᴛ… Lᴇᴀᴠᴇ.`),
                        getCloseKeyboard(), linkPreview
                    );
                } else {
                    sent = await botApi.sendMessage(chatId,
                        withAd(`🔔 <b>Lᴇᴀᴠᴇ Mᴇssᴀɢᴇs Eɴᴀʙʟᴇᴅ</b>\n\nХорошо. I'ʟʟ Sᴀʏ Gᴏᴏᴅʙʏᴇ. Iᴛ's Oɴʟʏ Pᴏʟɪᴛᴇ.`),
                        getCloseKeyboard(), linkPreview
                    );
                }
                trackBotMessage(chatId, sent);
                return;
            }

        }

        // ---- FEATURE: Welcome & Leave Messages ----

        // ─── Welcome & Leave Messages ───
        if (data.message) {
            const msg = data.message;

            // New members joined
            if (msg.new_chat_members && msg.new_chat_members.length > 0 && Store.isWelcomeEnabled(chatId)) {
                const mentions = msg.new_chat_members
                    .map(m => `<b>${m.first_name || m.username || 'Traveler'}</b>`)
                    .join(', ');
                const chatTitle = content.chat.title || 'this group';
                const welcomeText =
                    `🎀 Ахаха~ Wᴇʟᴄᴏᴍᴇ, ${mentions}! 🎋\n` +
                    `Yᴏᴜ'ᴠᴇ Sᴛᴇᴘᴘᴇᴅ Iɴᴛᴏ <b>${chatTitle}</b>. Tʀᴇᴀᴅ Cᴀʀᴇғᴜʟʟʏ.\n` +
                    `I'ʟʟ Bᴇ Wᴀᴛᴄʜɪɴɢ… Аɴᴅ Rᴇᴀᴄᴛɪɴɢ. ✨`

                const welcomeBtns = [
                    [
                        { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ ✨', url: 'https://t.me/Shineii86' , style: 'success'}
                    ],
                    [
                        { text: '⭐ Sᴛɪᴄᴋᴇʀs', url: 'https://t.me/MaximXStickers', style: 'primary' },
                        { text: 'Bᴏᴛs 🤖', url: 'https://t.me/MaximXBots', style: 'primary' }
                    ],
                    [
                        { text: '💥 Cʟᴏsᴇ Mᴇɴᴜ ✨', callback_data: 'cb_close' , style: 'danger'}
                    ]
                ];

                try {
                    // Delete join notification
                    await botApi.deleteMessage(chatId, msg.message_id);
                } catch {}

                try {
                    await botApi.sendMessage(chatId, welcomeText, welcomeBtns, linkPreview);
                } catch {}
            }

            // Member left
            if (msg.left_chat_member && Store.isGoodbyeEnabled(chatId)) {
                const user = msg.left_chat_member;
                const userName = user.first_name || user.username || 'Traveler';
                const chatTitle = content.chat.title || 'this group';
                const leaveText =
                    `👋 Хмпф… Gᴏᴏᴅʙʏᴇ, <b>${userName}</b>.\n` +
                    `<b>${chatTitle}</b> Wɪʟʟ Mᴀɴᴀɢᴇ Wɪᴛʜᴏᴜᴛ Yᴏᴜ.\n\n` +
                    `До свидания. N-Not Tʜᴀᴛ I'ʟʟ Mɪss Yᴏᴜ.`;

                const leaveBtns = [
                    [
                        { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ ✨', url: 'https://t.me/Shineii86' , style: 'success'}
                    ],
                    [
                        { text: '⭐ Sᴛɪᴄᴋᴇʀs', url: 'https://t.me/MaximXStickers', style: 'primary' },
                        { text: 'Bᴏᴛs 🤖', url: 'https://t.me/MaximXBots', style: 'primary' }
                    ],
                    [
                        { text: '💥 Cʟᴏsᴇ Mᴇɴᴜ ✨', callback_data: 'cb_close' , style: 'danger'}
                    ]
                ];

                try {
                    // Delete leave notification
                    await botApi.deleteMessage(chatId, msg.message_id);
                } catch {}

                try {
                    await botApi.sendMessage(chatId, leaveText, leaveBtns, linkPreview);
                } catch {}
            }
        }

        // ---- FEATURE: Auto-Reaction Engine ----

        // ─── Auto-Reaction Logic ───
        if (RestrictedChats.includes(chatId)) return;
        if (Store.isRestricted(chatId)) return;
        if (Store.isPaused(chatId)) return;
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
                    await Store.trackReaction();
                    logReaction(chatId, reaction);
                } catch {}
            }
        } else {
            try {
                await botApi.setMessageReaction(chatId, message_id, reaction);
                await Store.trackReaction();
                logReaction(chatId, reaction);
            } catch {}
        }
    }
}

// ══════════════════════════════════════════════════════════════ END: bot-handler.js
