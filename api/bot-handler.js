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

import { startMessage, helpMessage, aboutMessage, donateMessage, statsHeader } from './constants.js';
import { getRandomPositiveReaction } from './helper.js';

// In-memory stats (resets on restart — no persistent storage by design)
const stats = {
    messagesProcessed: 0,
    reactionsSent: 0,
    uniqueChats: new Set(),
    startTime: Date.now(),
};

/**
 * Build the start menu inline keyboard
 */
function getStartKeyboard(botUsername) {
    return [
        [
            { text: '✚ Aᴅᴅ Tᴏ Cʜᴀɴɴᴇʟ ✚', url: `https://t.me/${botUsername}?startchannel=botstart` },
            { text: '✚ Aᴅᴅ Tᴏ Gʀᴏᴜᴘ ✚', url: `https://t.me/${botUsername}?startgroup=botstart` },
        ],
        [
            { text: '📚 Hᴇʟᴘ', callback_data: 'cb_help' },
            { text: '🤖 Aʙᴏᴜᴛ', callback_data: 'cb_about' },
            { text: '📊 Sᴛᴀᴛs', callback_data: 'cb_stats' },
        ],
        [
            { text: '🎁 Dᴏɴᴀᴛᴇ', callback_data: 'cb_donate' },
            { text: '🧑‍💻 Dᴇᴠᴇʟᴏᴘᴇʀ', url: 'https://t.me/Shineii86' },
        ],
        [
            { text: '☁️ Sᴏᴜʀᴄᴇ Cᴏᴅᴇ', url: 'https://github.com/Shineii86/AlisaReactionBot' },
        ],
    ];
}

/**
 * Build the back-to-menu keyboard
 */
function getBackKeyboard() {
    return [
        [
            { text: '⬅️ Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'cb_menu' },
        ],
    ];
}

/**
 * Build the donate keyboard with payment links
 */
function getDonateKeyboard() {
    return [
        [
            { text: '🅿️ PayPal', url: 'https://www.paypal.com/paypalme/ikx7a' },
            { text: '☕ Ko-fi', url: 'https://ko-fi.com/ikx7a' },
        ],
        [
            { text: '⬅️ Bᴀᴄᴋ Tᴏ Mᴇɴᴜ', callback_data: 'cb_menu' },
        ],
    ];
}

/**
 * Format uptime into human-readable string
 */
function formatUptime(ms) {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}ᴅ ${hours % 24}ʜ ${minutes % 60}ᴍ`;
    if (hours > 0) return `${hours}ʜ ${minutes % 60}ᴍ ${seconds % 60}s`;
    if (minutes > 0) return `${minutes}ᴍ ${seconds % 60}s`;
    return `${seconds}s`;
}

/**
 * Build the stats message text
 */
function getStatsMessage() {
    const uptime = formatUptime(Date.now() - stats.startTime);
    return `${statsHeader}📨 *Mᴇssᴀɢᴇs Pʀᴏᴄᴇssᴇᴅ:* ${stats.messagesProcessed.toLocaleString()}
💫 *Rᴇᴀᴄᴛɪᴏɴs Sᴇɴᴛ:* ${stats.reactionsSent.toLocaleString()}
💬 *Uɴɪqᴜᴇ Cʜᴀᴛs:* ${stats.uniqueChats.size.toLocaleString()}
⏱️ *Uᴘᴛɪᴍᴇ:* ${uptime}
🕐 *Sᴛᴀʀᴛᴇᴅ:* ${new Date(stats.startTime).toUTCString()}

_Gʟᴏʙᴀʟ sᴛᴀᴛs sɪɴᴄᴇ ʟᴀsᴛ ʀᴇsᴛᴀʀt._`;
}

/**
 * Handle incoming Telegram Update
 * https://core.telegram.org/bots/api#update
 *
 * @param {Object} data - Telegram update object
 * @param {Object} botApi - TelegramBotAPI instance
 * @param {Array} Reactions - Array of emoji reactions
 * @param {Array} RestrictedChats - Array of restricted chat IDs
 * @param {string} botUsername - Bot username
 * @param {number} RandomLevel - Random level for group reactions (0-10)
 */
export async function onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel) {

    // ─── Callback Query (inline button press) ───
    if (data.callback_query) {
        const cq = data.callback_query;
        const chatId = cq.message?.chat?.id;
        const messageId = cq.message?.message_id;
        const callbackData = cq.data;

        try {
            switch (callbackData) {
                case 'cb_help':
                    await botApi.editMessageText(chatId, messageId, helpMessage, getBackKeyboard());
                    await botApi.answerCallbackQuery(cq.id);
                    break;

                case 'cb_about':
                    await botApi.editMessageText(chatId, messageId, aboutMessage, getBackKeyboard());
                    await botApi.answerCallbackQuery(cq.id);
                    break;

                case 'cb_stats':
                    await botApi.editMessageText(chatId, messageId, getStatsMessage(), getBackKeyboard());
                    await botApi.answerCallbackQuery(cq.id);
                    break;

                case 'cb_donate':
                    await botApi.editMessageText(chatId, messageId, donateMessage, getDonateKeyboard());
                    await botApi.answerCallbackQuery(cq.id);
                    break;

                case 'cb_menu': {
                    const displayName = cq.message?.chat?.type === 'private'
                        ? (cq.from?.first_name || cq.message?.chat?.title)
                        : cq.message?.chat?.title;
                    await botApi.editMessageText(chatId, messageId, startMessage.replace('UserName', displayName), getStartKeyboard(botUsername));
                    await botApi.answerCallbackQuery(cq.id);
                    break;
                }

                default:
                    await botApi.answerCallbackQuery(cq.id, 'Unknown action', true);
            }
        } catch (error) {
            console.error('Callback query error:', error.message);
            try { await botApi.answerCallbackQuery(cq.id, 'Something went wrong', true); } catch {}
        }
        return;
    }

    // ─── Messages & Channel Posts ───
    if (data.message || data.channel_post) {
        const content = data.message || data.channel_post;
        const chatId = content.chat.id;
        const message_id = content.message_id;
        const text = content.text;

        // Track stats
        stats.messagesProcessed++;
        stats.uniqueChats.add(chatId);

        if (data.message) {
            const isPrivate = content.chat.type === 'private';
            const displayName = isPrivate
                ? (content.from?.first_name || content.chat.title)
                : content.chat.title;

            // /start
            if (text === '/start' || text === '/start@' + botUsername) {
                await botApi.sendMessage(chatId, startMessage.replace('UserName', displayName), getStartKeyboard(botUsername));
                return;
            }

            // /help
            if (text === '/help' || text === '/help@' + botUsername) {
                await botApi.sendMessage(chatId, helpMessage, getBackKeyboard());
                return;
            }

            // /about
            if (text === '/about' || text === '/about@' + botUsername) {
                await botApi.sendMessage(chatId, aboutMessage, getBackKeyboard());
                return;
            }

            // /stats
            if (text === '/stats' || text === '/stats@' + botUsername) {
                await botApi.sendMessage(chatId, getStatsMessage(), getBackKeyboard());
                return;
            }

            // /donate
            if (text === '/donate' || text === '/donate@' + botUsername) {
                await botApi.sendMessage(chatId, donateMessage, getDonateKeyboard());
                return;
            }

            // /reactions
            if (text === '/reactions' || text === '/reactions@' + botUsername) {
                const reactions = Reactions.join(' ');
                await botApi.sendMessage(chatId, `🚀 *Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:*\n\n${reactions}`, getBackKeyboard());
                return;
            }
        }

        // ─── Auto-Reaction Logic ───
        const reaction = getRandomPositiveReaction(Reactions);
        if (reaction && !RestrictedChats.includes(chatId)) {
            const isGroup = ['group', 'supergroup'].includes(content.chat.type);
            if (isGroup) {
                // Group: react based on RandomLevel threshold
                const threshold = 1 - (RandomLevel / 10);
                if (Math.random() <= threshold) {
                    await botApi.setMessageReaction(chatId, message_id, reaction);
                    stats.reactionsSent++;
                }
            } else {
                // Private/Channel: always react
                await botApi.setMessageReaction(chatId, message_id, reaction);
                stats.reactionsSent++;
            }
        }
    }
}
