/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — index.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Express server entry point for Docker, Vercel, and local
 *   development. Handles webhook routing, env validation,
 *   health checks, and the landing page.
 *
 *   Supports both single-bot (BOT_TOKEN) and multi-bot
 *   (BOT_TOKENS) modes with full backward compatibility.
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { htmlContent } from './landing.js';
import { log } from './helper.js';
import { Store } from './store.js';
import { BotManager } from './botManager.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// dotenv only needed for local/Docker — Vercel/Render inject env vars natively
if (!process.env.VERCEL) {
    dotenv.config();
}

// ══════════════════════════════════════════════════════════════
// BOT MANAGER INITIALIZATION
// ══════════════════════════════════════════════════════════════

const manager = new BotManager(process.env);

if (manager.count === 0) {
    log.error('No bots configured. Set BOT_TOKEN + BOT_USERNAME or BOT_TOKENS.');
    process.exit(1);
}

if (!process.env.EMOJI_LIST) {
    log.warn('EMOJI_LIST not set — bots will not react to any messages');
}

if (!process.env.WEBHOOK_SECRET) {
    log.warn('WEBHOOK_SECRET not set — auto-generated random secrets for this session');
}

if (!process.env.OWNER_ID) {
    log.warn('OWNER_ID not set — /broadcast, /log, /leave, /chats, /restrict commands disabled');
}

// ══════════════════════════════════════════════════════════════
// EXPRESS APP
// ══════════════════════════════════════════════════════════════

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// ─── Multi-bot Webhook Endpoint ───
// Each bot registers: POST /bot/<botId>
app.post('/bot/:botId', async (req, res) => {
    const { botId } = req.params;
    const bot = manager.getBot(botId);

    if (!bot) {
        return res.status(404).send('Unknown bot');
    }

    // Validate webhook secret
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== bot.webhookSecret) {
        log.warn(`Webhook secret mismatch for @${bot.username} — rejecting`);
        return res.status(403).send('Forbidden');
    }

    try {
        await manager.handleUpdate(botId, req.body);
        res.status(200).send('Ok');
    } catch (error) {
        log.error(`Webhook error for @${bot.username}:`, error.message);
        res.status(200).send('Ok'); // Always return 200 to Telegram
    }
});

// ─── Single-bot Webhook (backward compatible) ───
// POST / — routes via webhook secret (only works with single bot)
app.post('/', async (req, res) => {
    const token = req.headers['x-telegram-bot-api-secret-token'];
    const handled = await manager.handleBySecret(token, req.body);

    if (!handled) {
        log.warn('Webhook secret mismatch on / — rejecting');
        return res.status(403).send('Forbidden');
    }

    res.status(200).send('Ok');
});

// ─── Landing Page ───
app.get('/', (req, res) => {
    res.send(htmlContent);
});

// ─── Set Webhooks for All Bots ───
// POST /set-webhooks  { "base_url": "https://your-domain.com" }
// Registers webhook for every bot in one request: <base_url>/bot/<botId>
app.post('/set-webhooks', async (req, res) => {
    const { base_url } = req.body;
    if (!base_url) {
        return res.status(400).json({ error: 'base_url is required' });
    }

    const cleanUrl = base_url.replace(/\/+$/, '');
    const results = [];

    for (const bot of manager.getAllBots()) {
        const webhookUrl = `${cleanUrl}/bot/${bot.botId}`;
        try {
            const resp = await fetch(
                `https://api.telegram.org/bot${bot.token}/setWebhook`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        url: webhookUrl,
                        secret_token: bot.webhookSecret,
                    }),
                }
            );
            const data = await resp.json();
            results.push({
                bot: `@${bot.username}`,
                url: webhookUrl,
                ok: data.ok,
                description: data.description || null,
            });
            log.info(`[Webhook] @${bot.username} → ${webhookUrl} (${data.description})`);
        } catch (error) {
            results.push({
                bot: `@${bot.username}`,
                url: webhookUrl,
                ok: false,
                error: error.message,
            });
        }
    }

    res.json({ ok: true, results });
});

// ─── Health Check ───
app.get('/health', (req, res) => {
    const bots = manager.getAllBots();
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        bots: bots.map(b => ({
            username: b.username,
            webhookSecured: !!b.webhookSecret,
            reactionsConfigured: b.reactions.length > 0,
            restrictedChats: b.restrictedChats.length,
        })),
        botCount: manager.count,
    });
});

// ─── Request size error handler ───
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        log.warn('Request too large — rejected');
        return res.status(413).send('Payload too large');
    }
    next(err);
});

// ─── Initialize Persistent Store ───
Store.load();

// ─── Graceful Shutdown ───
async function shutdown(signal) {
    log.info(`[Shutdown] ${signal} received — flushing state...`);
    try {
        await Store.flush();
        log.info('[Shutdown] State flushed. Goodbye.');
    } catch (error) {
        log.error('[Shutdown] Flush failed:', error.message);
    }
    process.exit(0);
}

process.on('SIGTERM', () => shutdown('SIGTERM'));
process.on('SIGINT', () => shutdown('SIGINT'));
process.on('uncaughtException', (error) => {
    log.error('[Fatal] Uncaught exception:', error.message);
    shutdown('uncaughtException');
});

// ─── Start Server (Docker/Render/Local) ───
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        log.info(`Server running on port ${PORT}`);
        log.info(`Bots: ${manager.count} configured`);
        for (const bot of manager.getAllBots()) {
            log.info(`  @${bot.username} → /bot/${bot.botId}`);
            log.info(`    Owner ID: ${bot.ownerId || 'NOT SET'}`);
            log.info(`    Reactions: ${bot.reactions.length} emoji(s)`);
            log.info(`    Restricted: ${bot.restrictedChats.length} chat(s)`);
            log.info(`    Random level: ${bot.randomLevel}`);
        }
    });
}

export default app;

// ══════════════════════════════════════════════════════════════ END: index.js
