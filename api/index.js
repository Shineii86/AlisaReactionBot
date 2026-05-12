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

import express from 'express';
import dotenv from 'dotenv';
import TelegramBotAPI from './TelegramBotAPI.js';
import { htmlContent } from './constants.js';
import { splitEmojis, getChatIds } from './helper.js';
import { onUpdate } from './bot-handler.js';

// dotenv only needed for local/Docker — Vercel/Render inject env vars natively
if (!process.env.VERCEL) {
    dotenv.config();
}

const botToken = process.env.BOT_TOKEN;
const botUsername = process.env.BOT_USERNAME;
const Reactions = splitEmojis(process.env.EMOJI_LIST);
const RestrictedChats = getChatIds(process.env.RESTRICTED_CHATS);
const RandomLevel = parseInt(process.env.RANDOM_LEVEL || '0', 10);
const ownerId = process.env.OWNER_ID || '';
const webhookSecret = process.env.WEBHOOK_SECRET || '';

const botApi = new TelegramBotAPI(botToken);

const app = express();
app.use(express.json({ limit: '1mb' }));

// ─── Webhook Endpoint ───
app.post('/', async (req, res) => {
    // Validate webhook secret if configured
    if (webhookSecret) {
        const token = req.headers['x-telegram-bot-api-secret-token'];
        if (token !== webhookSecret) {
            console.warn('[Webhook] Secret mismatch — rejecting request');
            return res.status(403).send('Forbidden');
        }
    }

    const data = req.body;
    try {
        await onUpdate(data, botApi, Reactions, RestrictedChats, botUsername, RandomLevel, ownerId);
        res.status(200).send('Ok');
    } catch (error) {
        console.error('[Webhook] Error:', error.message);
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
        webhookSecured: !!webhookSecret
    });
});

// ─── Request size error handler ───
app.use((err, req, res, next) => {
    if (err.type === 'entity.too.large') {
        console.warn('[Server] Request too large — rejected');
        return res.status(413).send('Payload too large');
    }
    next(err);
});

// ─── Start Server (Docker/Render/Local) ───
if (!process.env.VERCEL) {
    const PORT = process.env.PORT || 3000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
        console.log(`Webhook secret: ${webhookSecret ? 'ENABLED' : 'DISABLED'}`);
        console.log(`Owner ID: ${ownerId || 'NOT SET'}`);
    });
}

export default app;
