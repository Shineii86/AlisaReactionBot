/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — store.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Persistent state storage. Environment-aware:
 *   - Vercel: uses Vercel KV (Redis) via @vercel/kv
 *   - Local/Docker/Render: uses data/state.json file
 *   - Fallback: in-memory (non-persistent)
 *
 *   Persists: chats, per-chat reactions, paused/restricted chats,
 *   welcome/leave toggles, and global stats counters.
 *
 * @exports Store
 *
 * @version 2.11.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { readFileSync, writeFileSync, mkdirSync, existsSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { log } from './helper.js';

// ══════════════════════════════════════════════════════════════
// ENVIRONMENT DETECTION
// ══════════════════════════════════════════════════════════════

const isVercelKV = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);
const KV_KEY = 'alisareactionbot:state';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'data');
const STATE_FILE = join(DATA_DIR, 'state.json');

let storageType = 'memory';  // 'vercel-kv' | 'file' | 'memory'
let kv = null;
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
// FILE STORAGE (Local / Docker / Render)
// ══════════════════════════════════════════════════════════════

function fileLoad() {
    try {
        if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
        if (existsSync(STATE_FILE)) {
            const raw = readFileSync(STATE_FILE, 'utf-8');
            const parsed = JSON.parse(raw);
            // Merge with defaults to handle new fields added in future versions
            state = { ...getDefaultState(), ...parsed, stats: { ...getDefaultState().stats, ...parsed.stats } };
            log.info(`[Store:File] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            fileSave();
            log.info('[Store:File] Created fresh state.json');
        }
    } catch (error) {
        log.error('[Store:File] Failed to load:', error.message);
        state = getDefaultState();
    }
}

function fileSave() {
    try {
        if (!existsSync(DATA_DIR)) mkdirSync(DATA_DIR, { recursive: true });
        writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), 'utf-8');
    } catch (error) {
        log.error('[Store:File] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// VERCEL KV STORAGE (Redis)
// ══════════════════════════════════════════════════════════════

async function kvInit() {
    if (kv) return;
    try {
        const { createClient } = await import('@vercel/kv');
        kv = createClient({
            url: process.env.KV_REST_API_URL,
            token: process.env.KV_REST_API_TOKEN,
        });
        log.info('[Store:KV] Vercel KV client initialized');
    } catch (error) {
        log.error('[Store:KV] Failed to initialize:', error.message);
        storageType = 'memory';
    }
}

async function kvLoad() {
    await kvInit();
    if (!kv) return;
    try {
        const data = await kv.get(KV_KEY);
        if (data) {
            state = { ...getDefaultState(), ...data, stats: { ...getDefaultState().stats, ...data.stats } };
            log.info(`[Store:KV] Loaded state: ${Object.keys(state.chats).length} chats`);
        } else {
            state = getDefaultState();
            await kvSave();
            log.info('[Store:KV] Created fresh state in Redis');
        }
    } catch (error) {
        log.error('[Store:KV] Failed to load:', error.message);
        state = getDefaultState();
    }
}

async function kvSave() {
    if (!kv) return;
    try {
        await kv.set(KV_KEY, state);
    } catch (error) {
        log.error('[Store:KV] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// UNIFIED SAVE
// ══════════════════════════════════════════════════════════════

async function save() {
    if (storageType === 'vercel-kv') await kvSave();
    else if (storageType === 'file') fileSave();
}

// ══════════════════════════════════════════════════════════════
// LOAD (idempotent — only loads once)
// ══════════════════════════════════════════════════════════════

async function load() {
    if (loaded) return;
    if (isVercelKV) {
        storageType = 'vercel-kv';
        await kvLoad();
    } else {
        try {
            storageType = 'file';
            fileLoad();
        } catch {
            storageType = 'memory';
            state = getDefaultState();
            log.warn('[Store] Falling back to in-memory (non-persistent)');
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
    await save();
}

async function removeChat(chatId) {
    const key = String(chatId);
    if (state.chats[key]) {
        delete state.chats[key];
        // Also clean up related data
        delete state.reactions[key];
        state.paused = state.paused.filter(id => String(id) !== key);
        state.restricted = state.restricted.filter(id => String(id) !== key);
        state.welcome = state.welcome.filter(id => String(id) !== key);
        state.goodbye = state.goodbye.filter(id => String(id) !== key);
        await save();
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
    await save();
}

async function deleteReaction(chatId) {
    delete state.reactions[String(chatId)];
    await save();
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
        await save();
    }
}

async function resumeChat(chatId) {
    const id = Number(chatId);
    const idx = state.paused.indexOf(id);
    if (idx !== -1) {
        state.paused.splice(idx, 1);
        await save();
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
        await save();
    }
}

async function unrestrictChat(chatId) {
    const id = Number(chatId);
    const idx = state.restricted.indexOf(id);
    if (idx !== -1) {
        state.restricted.splice(idx, 1);
        await save();
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
        await save();
        return false; // disabled
    } else {
        state.welcome.push(id);
        await save();
        return true; // enabled
    }
}

async function toggleGoodbye(chatId) {
    const id = Number(chatId);
    const idx = state.goodbye.indexOf(id);
    if (idx !== -1) {
        state.goodbye.splice(idx, 1);
        await save();
        return false;
    } else {
        state.goodbye.push(id);
        await save();
        return true;
    }
}

// ══════════════════════════════════════════════════════════════
// STATS
// ══════════════════════════════════════════════════════════════

function getStats() { return state.stats; }

async function trackMessage() {
    state.stats.messagesProcessed++;
    await save();
}

async function trackReaction() {
    state.stats.reactionsSent++;
    await save();
}

async function trackCommand(cmd) {
    state.stats.commandUsage[cmd] = (state.stats.commandUsage[cmd] || 0) + 1;
    await save();
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
    save,
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
