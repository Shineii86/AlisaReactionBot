/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * Telegram Bot API wrapper — all methods used by the bot
 *
 * Copyright (c) 2026 Shinei Nouzen
 *
 * Released under the MIT License.
 * You Are Free To Use, Modify, And Distribute This Software In Accordance With The Terms Of The License.
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

    async sendMessage(chatId, text, inlineKeyboard = null) {
        return this.callApi('sendMessage', {
            chat_id: chatId,
            text: text,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
        });
    }

    async editMessageText(chatId, messageId, text, inlineKeyboard = null) {
        return this.callApi('editMessageText', {
            chat_id: chatId,
            message_id: messageId,
            text: text,
            parse_mode: 'Markdown',
            disable_web_page_preview: true,
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
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

    async sendPhoto(chatId, photoUrl, caption = '', inlineKeyboard = null) {
        return this.callApi('sendPhoto', {
            chat_id: chatId,
            photo: photoUrl,
            caption: caption,
            parse_mode: 'Markdown',
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
        });
    }

    async editMessageMedia(chatId, messageId, photoUrl, caption = '', inlineKeyboard = null) {
        return this.callApi('editMessageMedia', {
            chat_id: chatId,
            message_id: messageId,
            media: {
                type: 'photo',
                media: photoUrl,
                caption: caption,
                parse_mode: 'Markdown',
            },
            ...(inlineKeyboard && { reply_markup: { inline_keyboard: inlineKeyboard } })
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
