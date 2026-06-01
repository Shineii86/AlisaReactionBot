/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — worker.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Cloudflare Workers entry point. Handles webhook routing,
 *   env validation, health checks, and the landing page.
 *   Supports both single-bot and multi-bot modes.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { htmlContent } from './landing.js';
import { returnHTML, log } from './helper.js';
import { BotManager } from './bot-manager.js';

export default {
    async fetch(request, env) {
        const url = new URL(request.url);

        // Lazy-init BotManager (cached per isolate)
        if (!this._manager || this._managerEnv !== env) {
            this._manager = new BotManager(env);
            this._managerEnv = env;
        }
        const manager = this._manager;

        // Health check endpoint
        if (url.pathname === '/health' && request.method === 'GET') {
            const bots = manager.getAllBots();
            return new Response(JSON.stringify({
                status: 'ok',
                timestamp: new Date().toISOString(),
                environment: env.NODE_ENV || 'production',
                bots: bots.map(b => ({
                    username: b.username,
                    webhookSecured: !!b.webhookSecret,
                    reactionsConfigured: b.reactions.length > 0,
                    restrictedChats: b.restrictedChats.length,
                })),
                botCount: manager.count,
            }), {
                status: 200,
                headers: { 'Content-Type': 'application/json' }
            });
        }

        // Multi-bot webhook: POST /bot/<botId>
        if (url.pathname.startsWith('/bot/') && request.method === 'POST') {
            const botId = url.pathname.split('/')[2];
            const bot = manager.getBot(botId);

            if (!bot) {
                return new Response('Unknown bot', { status: 404 });
            }

            const token = request.headers.get('x-telegram-bot-api-secret-token');
            if (token !== bot.webhookSecret) {
                log.warn(`Webhook secret mismatch for @${bot.username}`);
                return new Response('Forbidden', { status: 403 });
            }

            const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
            if (contentLength > 1048576) {
                return new Response('Payload too large', { status: 413 });
            }

            const data = await request.json();
            try {
                await manager.handleUpdate(botId, data);
            } catch (error) {
                log.error(`Webhook error for @${bot.username}:`, error.message);
            }

            return new Response('Ok', { status: 200 });
        }

        // Single-bot webhook (backward compatible): POST /
        if (request.method === 'POST' && url.pathname === '/') {
            const token = request.headers.get('x-telegram-bot-api-secret-token');
            const contentLength = parseInt(request.headers.get('content-length') || '0', 10);
            if (contentLength > 1048576) {
                return new Response('Payload too large', { status: 413 });
            }

            const data = await request.json();
            const handled = await manager.handleBySecret(token, data);

            if (!handled) {
                log.warn('Webhook secret mismatch on /');
                return new Response('Forbidden', { status: 403 });
            }

            return new Response('Ok', { status: 200 });
        }

        // GET → Landing page
        return returnHTML(htmlContent);
    }
};

// ══════════════════════════════════════════════════════════════ END: worker.js
