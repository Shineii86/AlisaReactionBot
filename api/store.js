/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — store.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Persistent chat storage. Tracks every chat the bot has
 *   interacted with across restarts. Writes to data/chats.json.
 *
 * @exports
 *   Store — { load, save, updateChat, getAllChats, getChatCount,
 *             getChatsByType, removeChat }
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

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const DATA_DIR = join(__dirname, '..', 'data');
const CHATS_FILE = join(DATA_DIR, 'chats.json');

// ══════════════════════════════════════════════════════════════
// PERSISTENT CHAT STORE
// ══════════════════════════════════════════════════════════════

let chats = {};  // chatId (string) → { id, title, type, firstSeen, lastSeen, messageCount }

/**
 * Load chats from disk. Creates data/ and chats.json if missing.
 */
function load() {
    try {
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true });
        }
        if (existsSync(CHATS_FILE)) {
            const raw = readFileSync(CHATS_FILE, 'utf-8');
            chats = JSON.parse(raw);
            log.info(`[Store] Loaded ${Object.keys(chats).length} chat(s) from disk`);
        } else {
            chats = {};
            save();
            log.info('[Store] Created fresh chats.json');
        }
    } catch (error) {
        log.error('[Store] Failed to load chats.json:', error.message);
        chats = {};
    }
}

/**
 * Write chats to disk (sync, atomic enough for single-process bots).
 */
function save() {
    try {
        if (!existsSync(DATA_DIR)) {
            mkdirSync(DATA_DIR, { recursive: true });
        }
        writeFileSync(CHATS_FILE, JSON.stringify(chats, null, 2), 'utf-8');
    } catch (error) {
        log.error('[Store] Failed to save chats.json:', error.message);
    }
}

/**
 * Record or update a chat interaction.
 * @param {number|string} chatId
 * @param {string} title
 * @param {string} type — 'private' | 'group' | 'supergroup' | 'channel'
 */
function updateChat(chatId, title, type) {
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

    save();
}

/**
 * Remove a chat from the store.
 * @param {number|string} chatId
 * @returns {boolean} — true if removed
 */
function removeChat(chatId) {
    const key = String(chatId);
    if (chats[key]) {
        delete chats[key];
        save();
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
};

// ══════════════════════════════════════════════════════════════ END: store.js
