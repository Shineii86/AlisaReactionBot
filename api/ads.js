/*
 * ======= • ======= • ======= • ======= • =======• =======
 * AdLib — Centralized Advertisement Library
 * Part of Alisa Reaction Bot
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * Inspired by: https://github.com/Shineii86/AdLab
 *
 * @description
 * Lightweight ad management module. Stores a pool of promotional
 * messages and exposes two functions:
 *   - getRandomAd()  → raw ad text (string)
 *   - getAdFooter()  → HTML‑formatted ad block ready to append
 *                       to any bot message (parse_mode: "HTML")
 *
 * @customization
 *   Edit the `advertisements` array below to add, remove, or modify ads.
 *
 * @author  Shinei Nouzen
 * @version 1.0.0
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ─── Advertisement Pool ──────────────────────────────────────
const advertisements = [
    '@MaximXEmojis — Expressive emojis for every mood. Join now and add flair to your conversations!',
    '@MaximXStickers — Vibrant and diverse sticker packs to enhance your messaging experience.',
    '@MaximXBots — Cutting-edge bots for fun, utility, and more. Elevate your Telegram experience!',
    '@MaximXArts — Stunning wallpapers and digital art to revamp your device\'s look.',
    '@MaximXIcons — Unique and stylish profile icons. Make your profile stand out!',
    '@MaximXAnime — Curated anime recommendations and community discussions. Join us!',
];

// ─── Public API ──────────────────────────────────────────────

/**
 * Returns a randomly selected ad text (plain string, no formatting).
 * @returns {string}
 */
export function getRandomAd() {
    return advertisements[Math.floor(Math.random() * advertisements.length)];
}

/**
 * Returns an HTML-formatted ad footer block ready to append
 * to any bot message. Uses Telegram HTML (parse_mode: "HTML").
 *
 * Format:
 *   ──────
 *   📮 Ads: Quinx Ads
 *   > ad text here
 *
 * @returns {string}
 */
export function getAdFooter() {
    const ad = getRandomAd();
    return `\n\n──────────\n📮 <b>Aᴅs:</b> <a href="https://t.me/QuinxAds">Ҩᴜɪɴx Aᴅs</a>\n<blockquote>${ad}</blockquote>`;
}

/**
 * Returns the current number of ads in the pool.
 * @returns {number}
 */
export function getAdCount() {
    return advertisements.length;
}
