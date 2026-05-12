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

import TelegramBotAPI from "./TelegramBotAPI.js";
import { htmlContent } from './constants.js';
import { splitEmojis, returnHTML, getChatIds } from "./helper.js";
import { onUpdate } from './bot-handler.js';

// Cache for parsed environment variables to avoid repeated parsing
let configCache = null;

function getConfig(env) {
    if (!configCache || configCache.env !== env) {
        configCache = {
            env: env,
            botToken: env.BOT_TOKEN,
            botUsername: env.BOT_USERNAME,
            reactions: splitEmojis(env.EMOJI_LIST),
            restrictedChats: getChatIds(env.RESTRICTED_CHATS),
            randomLevel: parseInt(env.RANDOM_LEVEL || '0', 10),
            ownerId: env.OWNER_ID || '',
            webhookSecret: env.WEBHOOK_SECRET || '',
            botApi: new TelegramBotAPI(env.BOT_TOKEN)
        };
    }
    return configCache;
}

export default {
    async fetch(request, env) {
        const config = getConfig(env);
        const url = new URL(request.url);

        // Health check endpoint
        if (url.pathname === '/health' && request.method === 'GET') {
            return new Response(JSON.stringify({
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV || 'production',
                botConfigured: !!config.botToken && !!config.botUsername,
                webhookSecured: !!config.webhookSecret
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Webhook endpoint (POST only)
        if (request.method === 'POST') {
            // Validate webhook secret
            if (config.webhookSecret) {
                const token = request.headers.get('x-telegram-bot-api-secret-token');
                if (token !== config.webhookSecret) {
                    console.warn('[Webhook] Secret mismatch — rejecting');
                    return new Response('Forbidden', { status: 403 });
                }
            }

            // Reject oversized payloads
            const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
            if (contentLength > 1048576) { // 1MB
                return new Response('Payload too large', { status: 413 });
            }

            const data = await request.json();
            try {
                await onUpdate(
                    data, config.botApi, config.reactions,
                    config.restrictedChats, config.botUsername,
                    config.randomLevel, config.ownerId
                );
            } catch (error) {
                console.error('[Webhook] Error:', error.message);
            }

            return new Response('Ok', { status: 200 });
        }

        // GET → Landing page
        return new returnHTML(htmlContent);
    }
};
