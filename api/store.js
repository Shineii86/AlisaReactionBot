/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — store.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Persistent chat storage. Environment-aware:
 *   - Vercel: uses Vercel KV (Redis) via @vercel/kv
 *   - Local/Docker/Render: uses data/chats.json file
 *   - Fallback: in-memory (non-persistent)
 *
 * @exports
 *   Store — { load, save, updateChat, getAllChats, getChatCount,
 *             getChatsByType, removeChat, getStorageType }
 *
 * @version 2.10.0
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
const KV_KEY = 'alisareactionbot:chats';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'data');
const CHATS_FILE = join(DATA_DIR, 'chats.json');

let storageType = 'memory';  // 'vercel-kv' | 'file' | 'memory'
let kv = null;                // Lazy-loaded @vercel/kv client
let chats = {};               // In-memory cache (shared across all backends)
let loaded = false;

// ══════════════════════════════════════════════════════════════
// FILE STORAGE (Local / Docker / Render)
// ══════════════════════════════════════════════════════════════

function fileLoad() {
    try {
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true });
        }
        if (existsSync(CHATS_FILE)) {
            const raw = readFileSync(CHATS_FILE, 'utf-8');
            chats = JSON.parse(raw);
            log.info(`[Store:File] Loaded ${Object.keys(chats).length} chat(s) from disk`);
        } else {
            chats = {};
            fileSave();
            log.info('[Store:File] Created fresh chats.json');
        }
    } catch (error) {
        log.error('[Store:File] Failed to load:', error.message);
        chats = {};
    }
}

function fileSave() {
    try {
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true });
        }
        writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2), 'utf-8');
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
        chats = data || {};
        log.info(`[Store:KV] Loaded ${Object.keys(chats).length} chat(s) from Redis`);
    } catch (error) {
        log.error('[Store:KV] Failed to load:', error.message);
        chats = {};
    }
}

async function kvSave() {
    if (!kv) return;
    try {
        await kv.set(KV_KEY, chats);
    } catch (error) {
        log.error('[Store:KV] Failed to save:', error.message);
    }
}

// ══════════════════════════════════════════════════════════════
// UNIFIED STORE API
// ══════════════════════════════════════════════════════════════

/**
 * Initialize the store. Auto-detects environment:
 * - Vercel KV env vars present → Redis
 * - Otherwise → file storage
 * Call once at startup (idempotent).
 */
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
            chats = {};
            log.warn('[Store] Falling back to in-memory storage (non-persistent)');
        }
    }

    loaded = true;
    log.info(`[Store] Storage backend: ${storageType}`);
}

/**
 * Save chats to the active backend.
 */
async function save() {
    if (storageType === 'vercel-kv') {
        await kvSave();
    } else if (storageType === 'file') {
        fileSave();
    }
}

/**
 * Record or update a chat interaction.
 * @param {number|string} chatId
 * @param {string} title
 * @param {string} type — 'private' | 'group' | 'supergroup' | 'channel'
 */
async function updateChat(chatId, title, type) {
    const key = String(chatId);
    const now = Date.now();

    if (chats[key]) {
        chats[key].title = title || chats[key].title;
        chats[key].type = type || chats[key].type;
        chats[key].lastSeen = now;
        chats[key].messageCount = (chats[key].messageCount || 0) + 1;
    } else {
        chats[key] = {
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

/**
 * Remove a chat from the store.
 * @param {number|string} chatId
 * @returns {boolean} — true if removed
 */
async function removeChat(chatId) {
    const key = String(chatId);
    if (chats[key]) {
        delete chats[key];
        await save();
        return true;
    }
    return false;
}

/**
 * Get all stored chats as an array.
 * @returns {Array<{ id, title, type, firstSeen, lastSeen, messageCount }>
 */
function getAllChats() {
    return Object.values(chats);
}

/**
 * Get total number of tracked chats.
 * @returns {number}
 */
function getChatCount() {
    return Object.keys(chats).length;
}

/**
 * Get chats filtered by type.
 * @param {string} type — 'private' | 'group' | 'supergroup' | 'channel'
 * @returns {Array}
 */
function getChatsByType(type) {
    return Object.values(chats).filter(c => c.type === type);
}

/**
 * Check if a chat exists in the store.
 * @param {number|string} chatId
 * @returns {boolean}
 */
function hasChat(chatId) {
    return String(chatId) in chats;
}

/**
 * Get the active storage backend type.
 * @returns {string} — 'vercel-kv' | 'file' | 'memory'
 */
function getStorageType() {
    return storageType;
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export const Store = {
    load,
    save,
    updateChat,
    removeChat,
    getAllChats,
    getChatCount,
    getChatsByType,
    hasChat,
    getStorageType,
};

// ══════════════════════════════════════════════════════════════ END: store.js
