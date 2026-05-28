/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — TelegramBotAPI.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Telegram Bot API wrapper. All HTTP calls to the Telegram
 *   API go through this class for consistent error handling,
 *   logging, and request formatting.
 *
 * @exports TelegramBotAPI (default)
 *
 * @version 2.15.2
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

export default class TelegramBotAPI {
    constructor(botToken) {
        this.apiUrl = `https://api.telegram.org/bot${botToken}/`;
    }

    async callApi(action, body) {
        try {
            const response = await fetch(this.apiUrl + action, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(body),
                signal: AbortSignal.timeout(10000)
            });

            const data = await response.json();

            if (!response.ok) {
                console.error(`[TG API] ${action} failed (${response.status}): ${data.description || 'Unknown'}`);
                throw new Error(`Telegram API error: ${data.description || 'Unknown error'}`);
            }

            return data;
        } catch (error) {
            if (error.name === 'AbortError') {
                console.error(`[TG API] Timeout: ${action}`);
                throw new Error(`Telegram API timeout: ${action}`);
            }
            throw error;
        }
    }

    // ─── Core Methods ───

    async getMe() {
        return this.callApi('getMe', {});
    }

    async getChat(chatId) {
        return this.callApi('getChat', { chat_id: chatId });
    }

    async getChatMember(chatId, userId) {
        return this.callApi('getChatMember', { chat_id: chatId, user_id: userId });
    }

    async sendMessage(chatId, text, inlineKeyboard = null, linkPreviewOptions = null) {
        return this.callApi('sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: !linkPreviewOptions,
            ...(linkPreviewOptions && { link_preview_options: linkPreviewOptions }),
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
        });
    }

    async editMessageText(chatId, messageId, text, inlineKeyboard = null, linkPreviewOptions = null) {
        return this.callApi('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: 'HTML',
            disable_web_page_preview: !linkPreviewOptions,
            ...(linkPreviewOptions && { link_preview_options: linkPreviewOptions }),
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
        });
    }

    async deleteMessage(chatId, messageId) {
        return this.callApi('deleteMessage', {
            chat_id: chatId,
            message_id: messageId
        });
    }

    async setMessageReaction(chatId, messageId, emoji) {
        return this.callApi('setMessageReaction', {
            chat_id: chatId,
            message_id: messageId,
            reaction: [{ type: 'emoji', emoji: emoji }],
            is_big: true
        });
    }

    async answerCallbackQuery(callbackQueryId, text = '', showAlert = false) {
        return this.callApi('answerCallbackQuery', {
            callback_query_id: callbackQueryId,
            text: text,
            show_alert: showAlert
        });
    }

    async leaveChat(chatId) {
        return this.callApi('leaveChat', { chat_id: chatId });
    }

    async setWebhook(url, secretToken = '') {
        return this.callApi('setWebhook', {
            url: url,
            secret_token: secretToken,
            allowed_updates: ['message', 'channel_post', 'callback_query']
        });
    }

    async deleteWebhook() {
        return this.callApi('deleteWebhook', {});
    }

    async getWebhookInfo() {
        return this.callApi('getWebhookInfo', {});
    }
}

// ══════════════════════════════════════════════════════════════ END: TelegramBotAPI.js
