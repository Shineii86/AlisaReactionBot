/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — helper.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Utility functions: emoji parsing, chat ID parsing,
 *   HTML response builder, and structured logger.
 *
 * @exports
 *   getRandomPositiveReaction, splitEmojis, getChatIds,
 *   returnHTML, log
 *
 * @version 2.8.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// EMOJI UTILITIES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Random Reaction Picker ----

/**
 * Pick a random emoji from the given reaction array.
 *
 * @param {string[]} reaction - Array of emoji strings
 * @returns {string|null} A random emoji, or null if array is empty
 */
export function getRandomPositiveReaction(reaction) {
    if (!reaction || reaction.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reaction.length);
    return reaction[randomIndex];
}

// ---- FEATURE: Emoji String Splitter ----

/**
 * Split an emoji string into individual complete emoji sequences.
 * Handles ZWJ sequences (👨‍👩‍👧), skin tones (👩🏽), flag sequences (🇺🇸),
 * and basic emojis. Each returned element is a complete, valid emoji.
 *
 * @param {string} emojiString - Raw emoji string (space or joined)
 * @returns {string[]} Array of individual complete emojis
 */
export function splitEmojis(emojiString) {
    if (!emojiString) return [];

    // NOTE: Regex matches complete emoji sequences:
    //   1. Regional indicator pairs (🇺🇸)
    //   2. Single emojis with optional skin tone / VS16, chained via ZWJ
    //      e.g. 👨‍👩‍👧  🏳️‍🌈  🧑‍💻  ❤️‍🔥
    // Key: ZWJ (\u200D) is NOT in the modifier group — only matched as a chain connector
    const emojiRegex = /\p{Regional_Indicator}\p{Regional_Indicator}|(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*(?:\u200D[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*)*)/gu;
    return emojiString.match(emojiRegex) || [];
}

// ══════════════════════════════════════════════════════════════
// CHAT & HTTP UTILITIES
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Chat ID Parser ----

/**
 * Parse comma-separated chat IDs from environment variable.
 *
 * @param {string} chats - Comma-separated chat ID string
 * @returns {number[]} Array of numeric chat IDs
 */
export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

// ---- FEATURE: HTML Response Builder ----

/**
 * Create an HTTP Response with HTML content type.
 *
 * @param {string} content - HTML string
 * @returns {Response} HTTP Response object
 */
export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}

// ══════════════════════════════════════════════════════════════
// STRUCTURED LOGGER
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: Logging ----

/**
 * Structured logger with ISO timestamps.
 * All bot output goes through here for consistency.
 */
export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};

// ══════════════════════════════════════════════════════════════ END: helper.js
