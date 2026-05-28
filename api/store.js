/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — store.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Persistent state storage. Environment-aware:
 *   - Upstash Redis (free): when UPSTASH_REDIS_REST_URL is set
 *   - Vercel KV (paid): when KV_REST_API_URL is set
 *   - Local/Docker/Render: uses data/state.json file
 *   - Cloudflare Workers / Fallback: in-memory (non-persistent)
 *
 *   Persists: chats, per-chat reactions, paused/restricted chats,
 *   welcome/leave toggles, and global stats counters.
 *
 * @exports Store
 *
 * @version 2.15.2
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { log } from './helper.js';

// ══════════════════════════════════════════════════════════════
// ENVIRONMENT DETECTION
// ══════════════════════════════════════════════════════════════

// Detect Node.js vs Cloudflare Workers / other runtimes
const isNode = typeof process !== 'undefined'
    && typeof process.versions === 'object'
    && !!process.versions.node;

// Lazy-loaded Node.js fs module (avoids top-level import that breaks Workers bundler)
let fs = null;
let path = null;
let DATA_DIR = null;
let STATE_FILE = null;

async function loadNodeModules() {
    if (fs) return true;
    if (!isNode) return false;
    try {
        [fs, path] = await Promise.all([import('fs'), import('path')]);
        const { fileURLToPath } = await import('url');
        const __filename = fileURLToPath(import.meta.url);
        const __dirname = path.dirname(__filename);
        DATA_DIR = path.join(__dirname, '..', 'data');
        STATE_FILE = path.join(DATA_DIR, 'state.json');
        return true;
    } catch {
        return false;
    }
}

// Redis detection (Upstash free tier > Vercel KV paid)
let isUpstash = false;
let isVercelKV = false;
const KV_KEY = 'alisareactionbot:state';

function detectRedis() {
    isUpstash = isNode
        && typeof process.env !== 'undefined'
        && !!(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);

    isVercelKV = !isUpstash
        && isNode
        && typeof process.env !== 'undefined'
        && !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
}

let storageType = 'memory';  // 'upstash' | 'vercel-kv' | 'file' | 'memory'
let redis = null;
let loaded = false;

// ══════════════════════════════════════════════════════════════
// STATE — single source of truth
// ══════════════════════════════════════════════════════════════

let state = getDefaultState();

function getDefaultState() {
    return {
        chats: {},                  // chatId → { id, title, type, firstSeen, lastSeen, messageCount }
        reactions: {},              // chatId → emoji string (custom per-chat)
        paused: [],                 // chat IDs with reactions paused
        restricted: [],             // chat IDs with runtime restrictions
        welcome: [],                // chat IDs with welcome messages enabled
        goodbye: [],                // chat IDs with leave messages enabled
        stats: {
            messagesProcessed: 0,
            reactionsSent: 0,
            commandUsage: {},       // command name → count
        },
    };
}

// ══════════════════════════════════════════════════════════════
// FILE STORAGE (Local / Docker / Render — Node.js only)
// ══════════════════════════════════════════════════════════════

function fileLoad() {
    if (!fs || !STATE_FILE) return false;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        if (fs.existsSync(STATE_FILE)) {
            const raw = fs.readFileSync(STATE_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            state = { ...getDefaultState(), ...parsed, stats: { ...getDefaultState().stats, ...parsed.stats } };
            log.info(`[Store:File] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            fileSave();
            log.info('[Store:File] Created fresh state.json');
        }
        return true;
    } catch (error) {
        log.error('[Store:File] Failed to load:', error.message);
        state = getDefaultState();
        return false;
    }
}

function fileSave() {
    if (!fs || !STATE_FILE) return;
    try {
        if (!fs.existsSync(DATA_DIR)) fs.mkdirSync(DATA_DIR, { recursive: true });
        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
        log.error('[Store:File] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// UPSTASH REDIS STORAGE (Free tier — 10,000 req/day, 256MB)
// Requires: npm install @upstash/redis
// Env vars: UPSTASH_REDIS_REST_URL + UPSTASH_REDIS_REST_TOKEN
// Get them free at: https://console.upstash.com
// ══════════════════════════════════════════════════════════════

async function upstashInit() {
    if (redis) return;
    try {
        const { Redis } = await import('@upstash/redis');
        redis = new Redis({
            url: process.env.UPSTASH_REDIS_REST_URL,
            token: process.env.UPSTASH_REDIS_REST_TOKEN,
        });
        log.info('[Store:Upstash] Redis client initialized');
    } catch (error) {
        log.error('[Store:Upstash] Failed to initialize:', error.message);
        log.error('[Store:Upstash] Run: npm install @upstash/redis');
        storageType = 'memory';
    }
}

async function upstashLoad() {
    await upstashInit();
    if (!redis) return;
    try {
        const data = await redis.get(KV_KEY);
        if (data) {
            state = { ...getDefaultState(), ...data, stats: { ...getDefaultState().stats, ...data.stats } };
            log.info(`[Store:Upstash] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            await upstashSave();
            log.info('[Store:Upstash] Created fresh state in Redis');
        }
    } catch (error) {
        log.error('[Store:Upstash] Failed to load:', error.message);
        state = getDefaultState();
    }
}

async function upstashSave() {
    if (!redis) return;
    try {
        await redis.set(KV_KEY, state);
    } catch (error) {
        log.error('[Store:Upstash] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// VERCEL KV STORAGE (Paid — requires Vercel KV database)
// Optional: set KV_REST_API_URL + KV_REST_API_TOKEN to enable
// ══════════════════════════════════════════════════════════════

async function vercelKVInit() {
    if (redis) return;
    try {
        const { createClient } = await import('@vercel/kv');
        redis = createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });
        log.info('[Store:KV] Vercel KV client initialized');
    } catch (error) {
        log.error('[Store:KV] Failed to initialize:', error.message);
        storageType = 'memory';
    }
}

async function vercelKVLoad() {
    await vercelKVInit();
    if (!redis) return;
    try {
        const data = await redis.get(KV_KEY);
        if (data) {
            state = { ...getDefaultState(), ...data, stats: { ...getDefaultState().stats, ...data.stats } };
            log.info(`[Store:KV] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            await vercelKVSave();
            log.info('[Store:KV] Created fresh state in KV');
        }
    } catch (error) {
        log.error('[Store:KV] Failed to load:', error.message);
        state = getDefaultState();
    }
}

async function vercelKVSave() {
    if (!redis) return;
    try {
        await redis.set(KV_KEY, state);
    } catch (error) {
        log.error('[Store:KV] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// UNIFIED SAVE — batched to reduce write frequency
// ══════════════════════════════════════════════════════════════

const SAVE_DEBOUNCE_MS = 5000;  // Batch writes: max once per 5 seconds
let dirty = false;
let saveTimer = null;

/**
 * Schedule a save. Marks state as dirty and debounces writes.
 * Actual write happens after SAVE_DEBOUNCE_MS of inactivity.
 */
function scheduleSave() {
    dirty = true;
    if (saveTimer) return;
    saveTimer = setTimeout(async () => {
        saveTimer = null;
        if (!dirty) return;
        dirty = false;
        if (storageType === 'upstash') await upstashSave();
        else if (storageType === 'vercel-kv') await vercelKVSave();
        else if (storageType === 'file') fileSave();
    }, SAVE_DEBOUNCE_MS);
}

/**
 * Immediate save — used on shutdown / critical moments.
 * Flushes any pending debounced write.
 */
async function flush() {
    if (saveTimer) {
        clearTimeout(saveTimer);
        saveTimer = null;
    }
    dirty = false;
    if (storageType === 'upstash') await upstashSave();
    else if (storageType === 'vercel-kv') await vercelKVSave();
    else if (storageType === 'file') fileSave();
    log.info('[Store] Flushed to disk');
}

// ══════════════════════════════════════════════════════════════
// LOAD (idempotent — only loads once)
// ══════════════════════════════════════════════════════════════

async function load() {
    if (loaded) return;

    // Detect available Redis backend
    detectRedis();

    if (isUpstash) {
        // Upstash Redis (free tier — 10,000 req/day, 256MB)
        storageType = 'upstash';
        await upstashLoad();
    } else if (isVercelKV) {
        // Vercel KV (paid)
        storageType = 'vercel-kv';
        await vercelKVLoad();
    } else {
        // Try file storage (Node.js only)
        const hasFS = await loadNodeModules();
        if (hasFS && fileLoad()) {
            storageType = 'file';
        } else {
            // Cloudflare Workers / other runtimes: in-memory only
            storageType = 'memory';
            state = getDefaultState();
            log.info('[Store] Using in-memory storage (no filesystem available)');
        }
    }
    loaded = true;
    log.info(`[Store] Storage backend: ${storageType}`);
}

// ══════════════════════════════════════════════════════════════
// CHATS
// ══════════════════════════════════════════════════════════════

async function updateChat(chatId, title, type) {
    const key = String(chatId);
    const now = Date.now();
    if (state.chats[key]) {
        state.chats[key].title = title || state.chats[key].title;
        state.chats[key].type = type || state.chats[key].type;
        state.chats[key].lastSeen = now;
        state.chats[key].messageCount = (state.chats[key].messageCount || 0) + 1;
    } else {
        state.chats[key] = {
            id: Number(chatId),
            title: title || `Chat ${chatId}`,
            type: type || 'unknown',
            firstSeen: now,
            lastSeen: now,
            messageCount: 1,
        };
    }
    scheduleSave();
}

async function removeChat(chatId) {
    const key = String(chatId);
    if (state.chats[key]) {
        delete state.chats[key];
        delete state.reactions[key];
        state.paused = state.paused.filter(id => String(id) !== key);
        state.restricted = state.restricted.filter(id => String(id) !== key);
        state.welcome = state.welcome.filter(id => String(id) !== key);
        state.goodbye = state.goodbye.filter(id => String(id) !== key);
        scheduleSave();
        return true;
    }
    return false;
}

function getAllChats() { return Object.values(state.chats); }
function getChatCount() { return Object.keys(state.chats).length; }
function getChatsByType(type) { return Object.values(state.chats).filter(c => c.type === type); }
function hasChat(chatId) { return String(chatId) in state.chats; }

// ══════════════════════════════════════════════════════════════
// PER-CHAT REACTIONS
// ══════════════════════════════════════════════════════════════

function getReaction(chatId) { return state.reactions[String(chatId)] || null; }

async function setReaction(chatId, emojiString) {
    state.reactions[String(chatId)] = emojiString;
    scheduleSave();
}

async function deleteReaction(chatId) {
    delete state.reactions[String(chatId)];
    scheduleSave();
}

// ══════════════════════════════════════════════════════════════
// PAUSED CHATS
// ══════════════════════════════════════════════════════════════

function isPaused(chatId) { return state.paused.includes(Number(chatId)); }
function getPausedChats() { return [...state.paused]; }
function getPausedCount() { return state.paused.length; }

async function pauseChat(chatId) {
    const id = Number(chatId);
    if (!state.paused.includes(id)) {
        state.paused.push(id);
        scheduleSave();
    }
}

async function resumeChat(chatId) {
    const id = Number(chatId);
    const idx = state.paused.indexOf(id);
    if (idx !== -1) {
        state.paused.splice(idx, 1);
        scheduleSave();
    }
}

// ══════════════════════════════════════════════════════════════
// RESTRICTED CHATS (runtime)
// ══════════════════════════════════════════════════════════════

function isRestricted(chatId) { return state.restricted.includes(Number(chatId)); }
function getRestrictedChats() { return [...state.restricted]; }
function getRestrictedCount() { return state.restricted.length; }

async function restrictChat(chatId) {
    const id = Number(chatId);
    if (!state.restricted.includes(id)) {
        state.restricted.push(id);
        scheduleSave();
    }
}

async function unrestrictChat(chatId) {
    const id = Number(chatId);
    const idx = state.restricted.indexOf(id);
    if (idx !== -1) {
        state.restricted.splice(idx, 1);
        scheduleSave();
    }
}

// ══════════════════════════════════════════════════════════════
// WELCOME & GOODBYE TOGGLES
// ══════════════════════════════════════════════════════════════

function isWelcomeEnabled(chatId) { return state.welcome.includes(Number(chatId)); }
function isGoodbyeEnabled(chatId) { return state.goodbye.includes(Number(chatId)); }
function getWelcomeCount() { return state.welcome.length; }
function getGoodbyeCount() { return state.goodbye.length; }

async function toggleWelcome(chatId) {
    const id = Number(chatId);
    const idx = state.welcome.indexOf(id);
    if (idx !== -1) {
        state.welcome.splice(idx, 1);
        scheduleSave();
        return false;
    } else {
        state.welcome.push(id);
        scheduleSave();
        return true;
    }
}

async function toggleGoodbye(chatId) {
    const id = Number(chatId);
    const idx = state.goodbye.indexOf(id);
    if (idx !== -1) {
        state.goodbye.splice(idx, 1);
        scheduleSave();
        return false;
    } else {
        state.goodbye.push(id);
        scheduleSave();
        return true;
    }
}

// ══════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════

function getStats() { return state.stats; }

async function trackMessage() {
    state.stats.messagesProcessed++;
    scheduleSave();
}

async function trackReaction() {
    state.stats.reactionsSent++;
    scheduleSave();
}

async function trackCommand(cmd) {
    state.stats.commandUsage[cmd] = (state.stats.commandUsage[cmd] || 0) + 1;
    scheduleSave();
}

// ══════════════════════════════════════════════════════════════
// UTILITY
// ══════════════════════════════════════════════════════════════

function getStorageType() { return storageType; }

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export const Store = {
    // Lifecycle
    load,
    flush,
    getStorageType,
    // Chats
    updateChat,
    removeChat,
    getAllChats,
    getChatCount,
    getChatsByType,
    hasChat,
    // Reactions
    getReaction,
    setReaction,
    deleteReaction,
    // Paused
    isPaused,
    getPausedChats,
    getPausedCount,
    pauseChat,
    resumeChat,
    // Restricted
    isRestricted,
    getRestrictedChats,
    getRestrictedCount,
    restrictChat,
    unrestrictChat,
    // Welcome / Goodbye
    isWelcomeEnabled,
    isGoodbyeEnabled,
    getWelcomeCount,
    getGoodbyeCount,
    toggleWelcome,
    toggleGoodbye,
    // Stats
    getStats,
    trackMessage,
    trackReaction,
    trackCommand,
};

// ══════════════════════════════════════════════════════════════ END: store.js
