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

// ─── Structured Logger ───────────────────────────────────────────
export const log = {
    info: (...args) => console.log('[INFO]', new Date().toISOString(), ...args),
    warn: (...args) => console.warn('[WARN]', new Date().toISOString(), ...args),
    error: (...args) => console.error('[ERROR]', new Date().toISOString(), ...args),
};