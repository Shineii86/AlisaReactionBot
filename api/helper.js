// Helper function to select random emoji-reaction
export function getRandomPositiveReaction(reaction) {
    if (!reaction || reaction.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * reaction.length);
    return reaction[randomIndex];
}

// Get Emoji Array from String emoji set
// Handles ZWJ sequences (👨‍👩‍👧), skin tones (👩🏽), flag sequences (🇺🇸),
// and basic emojis. Each returned element is a complete, valid emoji.
export function splitEmojis(emojiString) {
    if (!emojiString) return [];
    // Match complete emoji sequences:
    //   1. Regional indicator pairs (🇺🇸)
    //   2. Single emojis with optional skin tone / VS16, chained via ZWJ
    //      e.g. 👨‍👩‍👧  🏳️‍🌈  🧑‍💻  ❤️‍🔥
    // Key: ZWJ (\u200D) is NOT in the modifier group — only matched as a chain connector
    const emojiRegex = /\p{Regional_Indicator}\p{Regional_Indicator}|(?:[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*(?:\u200D[\p{Emoji_Presentation}\p{Extended_Pictographic}\p{Emoji_Modifier_Base}][\uFE0F\p{Emoji_Modifier}]*)*)/gu;
    return emojiString.match(emojiRegex) || [];
}

// Get Chat IDs from Env | Split by `,`
export function getChatIds(chats) {
    return chats ? chats.split(',').map(Number).filter(Boolean) : [];
}

// Helper function to return HTML with correct headers
export function returnHTML(content) {
    return new Response(content, {
        headers: { 'content-type': 'text/html' },
    });
}

// ─── Telegram Card API ──────────────────────────────────────────
const TELEGRAM_CARD_API = 'https://telegramcard.vercel.app/';

// Theme presets (simple light/dark)
export const CARD_THEMES = {
    light: { theme: 'light', label: '☀️ Light' },
    dark:  { theme: 'dark',  label: '🌙 Dark' },
};

// 12 Ready-Made Color Palettes
export const CARD_PALETTES = {
    midnight:   { label: '🌙 Midnight Blue',   bgColor: 'rgba(15,23,42,1)',    textColor: '%23F8FAFC', subtleTextColor: '%2394A3B8', extraColor: '%2338BDF8', shadowColor: 'rgba(0,0,0,0.5)' },
    sunset:     { label: '🌅 Warm Sunset',      bgColor: 'rgba(120,53,15,1)',   textColor: '%23FEF3C7', subtleTextColor: '%23FDE68A', extraColor: '%23F59E0B', shadowColor: 'rgba(0,0,0,0.4)' },
    emerald:    { label: '🌲 Emerald Forest',   bgColor: 'rgba(6,78,59,1)',     textColor: '%23ECFDF5', subtleTextColor: '%23A7F3D0', extraColor: '%2334D399', shadowColor: 'rgba(0,0,0,0.4)' },
    royal:      { label: '👑 Royal Purple',      bgColor: 'rgba(46,16,101,1)',   textColor: '%23EDE9FE', subtleTextColor: '%23C4B5FD', extraColor: '%23A78BFA', shadowColor: 'rgba(0,0,0,0.4)' },
    cherry:     { label: '🌸 Cherry Blossom',   bgColor: 'rgba(131,24,67,1)',   textColor: '%23FCE7F3', subtleTextColor: '%23F9A8D4', extraColor: '%23F472B6', shadowColor: 'rgba(0,0,0,0.4)' },
    arctic:     { label: '❄️ Arctic Frost',     bgColor: 'rgba(224,242,254,1)', textColor: '%230C4A6E', subtleTextColor: '%230369A1', extraColor: '%230284C7', shadowColor: 'rgba(0,0,0,0.08)' },
    lava:       { label: '🔥 Lava Glow',        bgColor: 'rgba(124,45,18,1)',   textColor: '%23FFF7ED', subtleTextColor: '%23FED7AA', extraColor: '%23FB923C', shadowColor: 'rgba(0,0,0,0.4)' },
    ocean:      { label: '🌊 Ocean Deep',       bgColor: 'rgba(8,47,73,1)',     textColor: '%23E0F2FE', subtleTextColor: '%237DD3FC', extraColor: '%2338BDF8', shadowColor: 'rgba(0,0,0,0.4)' },
    mint:       { label: '🍃 Mint Fresh',       bgColor: 'rgba(20,83,45,1)',    textColor: '%23DCFCE7', subtleTextColor: '%2386EFAC', extraColor: '%234ADE80', shadowColor: 'rgba(0,0,0,0.4)' },
    black:      { label: '🌑 Pure Black',       bgColor: 'rgba(0,0,0,1)',       textColor: '%23FFFFFF', subtleTextColor: '%23888888', extraColor: '%230088CC', shadowColor: 'rgba(255,255,255,0.05)' },
    cloud:      { label: '☁️ Cloud White',      bgColor: 'rgba(249,250,251,1)', textColor: '%23111827', subtleTextColor: '%236B7280', extraColor: '%232563EB', shadowColor: 'rgba(0,0,0,0.06)' },
    cosmic:     { label: '🌌 Cosmic Indigo',    bgColor: 'rgba(30,27,75,1)',    textColor: '%23E0E7FF', subtleTextColor: '%23A5B4FC', extraColor: '%23818CF8', shadowColor: 'rgba(0,0,0,0.4)' },
};

/**
 * Build a Telegram Card image URL for a given username.
 * Supports ALL API parameters: theme, bgColor, textColor, subtleTextColor,
 * extraColor, shadowColor, fontFamily, verified, photo.
 *
 * @param {string} username - Telegram username (without @)
 * @param {Object} [opts] - Optional overrides
 * @returns {string} Full card image URL
 */
export function getTelegramCardUrl(username, opts = {}) {
    const params = new URLSearchParams({ username });
    if (opts.theme) params.set('theme', opts.theme);
    if (opts.bgColor) params.set('bgColor', opts.bgColor);
    if (opts.textColor) params.set('textColor', opts.textColor);
    if (opts.subtleTextColor) params.set('subtleTextColor', opts.subtleTextColor);
    if (opts.extraColor) params.set('extraColor', opts.extraColor);
    if (opts.shadowColor) params.set('shadowColor', opts.shadowColor);
    if (opts.fontFamily) params.set('fontFamily', opts.fontFamily);
    if (opts.verified !== undefined) params.set('verified', opts.verified);
    if (opts.photo) params.set('photo', opts.photo);
    return `${TELEGRAM_CARD_API}?${params.toString()}`;
}

/**
 * Get card URL using a palette key from CARD_PALETTES.
 */
export function getCardUrlByPalette(username, paletteKey) {
    const palette = CARD_PALETTES[paletteKey];
    if (!palette) return getTelegramCardUrl(username, { theme: 'light' });
    return getTelegramCardUrl(username, palette);
}

// ─── Structured Logger ───────────────────────────────────────────
export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};