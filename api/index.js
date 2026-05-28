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
 * @version 2.14.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import crypto from 'crypto';
import TelegramBotAPI from './TelegramBotAPI.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
import { htmlContent } from './landing.js';
import { splitEmojis, getChatIds, log } from './helper.js';
import { onUpdate } from './bot-handler.js';
import { Store } from './store.js';

// dotenv only needed for local/Docker — Vercel/Render inject env vars natively
if (!process.env.VERCEL) {
    dotenv.config();
}

const botToken = process.env.BOT_TOKEN;
const botUsername = process.env.BOT_USERNAME;

if (!botToken || !botUsername) {
    log.error('Missing required environment variables: BOT_TOKEN and/or BOT_USERNAME');
    process.exit(1);
}

const Reactions = splitEmojis(process.env.EMOJI_LIST);
const RestrictedChats = getChatIds(process.env.RESTRICTED_CHATS);
const RandomLevel = (() => {
    const parsed = parseInt(process.env.RANDOM_LEVEL || '0', 10);
    return (isNaN(parsed) || parsed < 0 || parsed > 10) ? 0 : parsed;
})();
const ownerId = process.env.OWNER_ID || '';
const webhookSecret = process.env.WEBHOOK_SECRET || crypto.randomUUID();
const botPhoto = process.env.BOT_PHOTO || '';

if (!process.env.EMOJI_LIST) {
    log.warn('EMOJI_LIST not set — bot will not react to any messages');
}

if (!process.env.WEBHOOK_SECRET) {
    log.warn('WEBHOOK_SECRET not set — auto-generated a random secret for this session');
}

if (!process.env.OWNER_ID) {
    log.warn('OWNER_ID not set — /broadcast, /log, /leave, /chats, /restrict commands disabled');
}

const botApi = new TelegramBotAPI(botToken);

const app = express();
app.use(express.json({ limit: '1mb' }));
app.use('/assets', express.static(path.join(__dirname, '..', 'assets')));

// ─── Webhook Endpoint ───
app.post('/', async (req, res) => {
    // Validate webhook secret
    const token = req.headers['x-telegram-bot-api-secret-token'];
    if (token !== webhookSecret) {
        log.warn('Webhook secret mismatch — rejecting request');
        return res.status(403).send('Forbidden');
    }

    const data = req.body;
    try {
        await onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, ownerId, webhookSecret, botPhoto);
        res.status(200).send('Ok');
    } catch (error) {
        log.error('Webhook handler error:', error.message);
        res.status(200).send('Ok'); // Always return 200 to Telegram
    }
});

// ─── Landing Page ───
app.get('/', (req, res) => {
    res.send(htmlContent);
});

// ─── Health Check ───
app.get('/health', (req, res) => {
    res.status(200).json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: process.env.NODE_ENV || 'development',
        botConfigured: !!botToken && !!botUsername,
        webhookSecured: !!process.env.WEBHOOK_SECRET,
        reactionsConfigured: Reactions.length > 0,
        restrictedChats: RestrictedChats.length
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
        log.info(`Owner ID: ${ownerId || 'NOT SET'}`);
        log.info(`Reactions: ${Reactions.length} emoji(s) loaded`);
        log.info(`Restricted chats: ${RestrictedChats.length}`);
        log.info(`Random level: ${RandomLevel}`);
    });
}

export default app;

// ══════════════════════════════════════════════════════════════ END: index.js
