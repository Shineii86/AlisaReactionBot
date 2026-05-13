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
  "@MaximXEmojis - Dive into a collection of expressive emojis for every mood! Join now and add flair to your conversations.",
  "@MaximXStickers - Discover vibrant and diverse sticker packs to enhance your messaging experience. Join us for a visual delight!",
  "@MaximXBots - Engage with cutting-edge bots designed for fun, utility, and more. Join the bot revolution and elevate your Telegram experience!",
  "@MaximXArts - Immerse yourself in a gallery of stunning wallpapers to revamp your device's look. Join for a daily dose of aesthetic inspiration.",
  "@MaximXIcons - Upgrade your profile with unique and stylish icons. Join now and make your profile stand out!",
  "@MaximXAnime - Dive into the world of anime with curated recommendations and community discussions. Join us and elevate your anime experience!"
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
    return `\n\n━━━━━━━━━━━\n📮 <b>Aᴅs:</b> <a href="https://t.me/QuinxAds">Ҩᴜɪɴx Aᴅs</a>\n<blockquote>${ad}</blockquote>`;
}

/**
 * Returns the current number of ads in the pool.
 * @returns {number}
 */
export function getAdCount() {
    return advertisements.length;
}
