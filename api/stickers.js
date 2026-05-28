/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — stickers.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Mood-based sticker mapping for Alisa's responses.
 *   Maps detected moods to Telegram sticker file_ids.
 *   Uses placeholder IDs — replace with real sticker file_ids
 *   from your sticker pack after uploading.
 *
 * @exports getSticker
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// STICKER PACK — Replace these with your actual file_ids
// ══════════════════════════════════════════════════════════════
//
// To get sticker file_ids:
// 1. Create a sticker pack with @Stickers bot
// 2. Send each sticker to your bot
// 3. Check the update JSON for sticker.file_id
// 4. Paste the file_ids below
//
// ══════════════════════════════════════════════════════════════

const STICKER_MAP = {
    // Tsundere huff / dismissive
    tsundere: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Annoyed / calling someone idiot
    annoyed: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Grateful but trying to hide it
    grateful: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Reluctant agreement
    reluctant: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Flustered / embarrassed
    flustered: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Thoughtful / pensive
    thoughtful: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Default neutral expression
    neutral: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Confused / error state
    confused: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Impatient / waiting
    impatient: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],

    // Cold / dismissive
    cold: [
        'CAACAgIAAxkBAAMOZ2hQ1AA…',  // Replace with real file_id
    ],
};

// ══════════════════════════════════════════════════════════════
// STICKER SELECTION
// ══════════════════════════════════════════════════════════════

/**
 * Get a random sticker for the detected mood
 * @param {string} mood — Detected mood from AI response
 * @returns {string|null} — Sticker file_id or null if not configured
 */
export function getSticker(mood) {
    const stickers = STICKER_MAP[mood] || STICKER_MAP.neutral;

    // Check if stickers are configured (not placeholder)
    if (!stickers || stickers.length === 0) return null;
    if (stickers[0].includes('…')) return null; // Still placeholder

    return stickers[Math.floor(Math.random() * stickers.length)];
}

/**
 * Check if stickers are properly configured
 * @returns {boolean}
 */
export function stickersConfigured() {
    const first = STICKER_MAP.neutral?.[0];
    return first && !first.includes('…');
}
