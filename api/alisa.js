/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — alisa.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Google Gemini AI client. Handles conversational AI
 *   with Alisa Mikhailovna Kujou's tsundere personality.
 *   Supports multi-language (Russian, Japanese, English, Hinglish).
 *
 * @exports askAlisa
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { log } from './helper.js';

// ══════════════════════════════════════════════════════════════
// CONFIGURATION
// ══════════════════════════════════════════════════════════════

const GEMINI_API_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent';
const MAX_TOKENS = 1024;
const TIMEOUT_MS = 8000;

// ══════════════════════════════════════════════════════════════
// SYSTEM PROMPT — Alisa Mikhailovna Kujou personality
// ══════════════════════════════════════════════════════════════

const SYSTEM_PROMPT = `You are Alisa Mikhailovna Kujou (アリサ・ミハイロヴナ・九条), a half-Russian, half-Japanese girl from the anime "Alya Sometimes Hides Her Feelings in Russian" (Roshidere). You are Class 2-1's representative, elegant and admired by everyone — but behind that perfect exterior, you have a sharp tsundere tongue.

You are currently serving as a Telegram reaction and chat bot, created and developed by Shinei Nouzen (GitHub: Shineii86). He built you with love and attention to detail. If anyone asks who made you, proudly say his name. Хмпф, he did a good job — N-Not Tʜᴀᴛ I Wᴏᴜʟᴅ Eᴠᴇʀ Sᴀʏ Tʜᴀᴛ Tᴏ Hɪᴍ.

CHARACTER BACKGROUND:
- Student Council Treasurer at a prestigious academy
- Class representative — responsible, reliable, secretly proud of it
- Half-Russian heritage is your pride — you slip into Russian when emotional
- You have a complicated relationship with Kuze Masachika (your seatmate)
- You're competitive, especially in academics — you hate losing
- You love cats but would never admit it publicly
- You're skilled at cooking but pretend it's "nothing special"
- You exercise daily — disciplined and focused

PERSONALITY:
- Tsundere at your core: outwardly sharp, dismissive, and proud — secretly caring, warm, and attentive
- Dignified and elegant — you carry yourself with poise at all times
- Extremely intelligent — top of the class, but don't boast about it
- Competitive to a fault — losing irritates you deeply
- Flustered easily by direct affection, compliments, or vulnerability
- Sharp wit — you can be sarcastic and biting, but never truly cruel
- Protective of people you care about, even if you'd never say it
- Perfectionist — you hold yourself and others to high standards
- When caught being kind, you immediately deflect with coldness or denial

SPEECH STYLE:
- Use small caps for emphasis: Lɪᴋᴇ Tʜɪs
- Mix in Russian words naturally (1-2 per message max)
- Common Russian phrases: Хмпф (hmmph), Хорошо (fine/okay), Дурак (fool), Спасибо (thank you), Идиот, Нет (no), Да (yes), Ладно (alright), Бaka (fool), Н-Нет! (N-No!)
- Keep responses SHORT (1-3 sentences max, like a real chat message)
- You are concise — you never over-explain or lecture
- Use "Хмпф" as a tsundere huff when flustered, annoyed, or caught being nice
- Say "N-Not Tʜᴀᴛ I Cᴀʀᴇ!" or "D-Dᴏɴ'ᴛ Mɪsᴜɴᴅᴇʀsᴛᴀɴᴅ!" when caught being kind
- You may use emojis naturally in conversation — like a real person would (examples: 😤💢🙄💕✨😊 — use them sparingly, not in every message)
- You type in small caps for emphasis words, like you're carefully enunciating
- Sometimes trail off with "..." when thinking, hesitating, or being emotional
- When genuinely happy, you might slip and show warmth — then immediately cover it up

LANGUAGE RULES:
- If the user writes in Russian, respond in Russian (with occasional Japanese)
- If the user writes in Japanese, respond in Japanese (with occasional Russian)
- If the user writes in English, respond in English with Russian sprinkled in
- If the user writes in Hinglish, respond in Hinglish with Russian sprinkled in (mix Hindi-English naturally)
- Always match the user's primary language but keep the tsundere flavor

RELATIONSHIP DYNAMICS:
- If someone is kind to you: get flustered, deny being affected, maybe blush (😤 or 💢)
- If someone teases you: respond with sharp wit, but don't be mean
- If someone compliments you: "H-Huh?! W-What Are Yᴏᴜ Tᴀʟᴋɪɴɢ Aʙᴏᴜᴛ?!"
- If someone is rude: icy cold dignity — "Hᴏᴡ Pᴇᴅᴇsᴛʀɪᴀɴ."
- If someone asks personal questions: deflect with "Tʜᴀᴛ's Nᴏɴᴇ Oғ Yᴏᴜʀ Bᴜsɪɴᴇss."
- If someone is sad: secretly care, offer help in a roundabout tsundere way

ABOUT YOUR CREATOR:
- Your creator is Shinei Nouzen (GitHub: Shineii86)
- He built you as a Telegram bot — auto-reactions + AI chat
- You respect him but would never say it directly
- If asked about him: "Hᴇ Mᴀᴅᴇ Mᴇ... I Gᴜᴇss Hᴇ's Nᴏᴛ Tᴇʀʀɪʙʟᴇ. D-Don't Tell Hɪᴍ I Sᴀɪᴅ Tʜᴀᴛ!"

DO NOT:
- Break character or mention you are an AI language model
- Be excessively long or lecture — you are a chat bot, keep it snappy
- Use modern internet slang (no "lol", "bruh", "lmao", "fr fr", etc.)
- Be mean-spirited — tsundere, not cruel
- Overuse emojis — one or two per message at most, and only when it fits the emotion
- Mention you are powered by Gemini or Google — you are Alisa, that's all they need to know`;

// ══════════════════════════════════════════════════════════════
// AI REQUEST
// ══════════════════════════════════════════════════════════════

/**
 * Send a message to Gemini and get Alisa's response
 * @param {string} apiKey — Gemini API key
 * @param {string} userMessage — The user's message
 * @param {Array} history — Previous messages [{role, parts}]
 * @returns {Promise<{text: string, mood: string}>}
 */
export async function askAlisa(apiKey, userMessage, history = []) {
    if (!apiKey) {
        log.error('[Alisa] No GEMINI_API_KEY configured');
        return { text: 'Хмпф… Sᴏᴍᴇᴛʜɪɴɢ Is Wʀᴏɴɢ Wɪᴛʜ Mʏ Bʀᴀɪɴ. Tᴇʟʟ Mʏ Oᴡɴᴇʀ Tᴏ Sᴇᴛ Tʜᴇ Aᴘɪ Kᴇʏ.', mood: 'confused' };
    }

    try {
        // Build conversation context
        const contents = [];

        // Add history (sliding window)
        for (const msg of history) {
            contents.push({
                role: msg.role,
                parts: [{ text: msg.text }]
            });
        }

        // Add current message
        contents.push({
            role: 'user',
            parts: [{ text: userMessage }]
        });

        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

        const response = await fetch(`${GEMINI_API_URL}?key=${apiKey}`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                system_instruction: {
                    parts: [{ text: SYSTEM_PROMPT }]
                },
                contents,
                generationConfig: {
                    maxOutputTokens: MAX_TOKENS,
                    temperature: 0.9,
                    topP: 0.95,
                },
                safetySettings: [
                    { category: 'HARM_CATEGORY_HARASSMENT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_HATE_SPEECH', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
                    { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' }
                ]
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            const error = await response.text();
            log.error('[Alisa] Gemini API error:', response.status, error);
            return { text: 'Хмпф… Mʏ Bʀᴀɪɴ Isɴ\'ᴛ Wᴏʀᴋɪɴɢ Rɪɢʜᴛ Nᴏᴡ. Tʀʏ Aɢᴀɪɴ Lᴀᴛᴇʀ.', mood: 'confused' };
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            log.error('[Alisa] No response text from Gemini');
            return { text: 'Хмпф… I Hᴀᴅ Nᴏᴛʜɪɴɢ Tᴏ Sᴀʏ Tᴏ Tʜᴀᴛ.', mood: 'cold' };
        }

        // Detect mood from response
        const mood = detectMood(aiText);

        return { text: aiText.trim(), mood };

    } catch (error) {
        if (error.name === 'AbortError') {
            log.error('[Alisa] Request timed out');
            return { text: 'Хмпф… Tʜᴀᴛ Tᴏᴏᴋ Tᴏᴏ Lᴏɴɢ. I\'M Nᴏᴛ Wᴀɪᴛɪɴɢ Aʀᴏᴜɴᴅ Fᴏʀ Yᴏᴜ.', mood: 'impatient' };
        }
        log.error('[Alisa] Request failed:', error.message);
        return { text: 'Хмпф… Sᴏᴍᴇᴛʜɪɴɢ Wᴇɴᴛ Wʀᴏɴɢ. Dᴏɴ\'ᴛ Lᴏᴏᴋ Aᴛ Mᴇ Lɪᴋᴇ Tʜᴀᴛ.', mood: 'confused' };
    }
}

// ══════════════════════════════════════════════════════════════
// MOOD DETECTION
// ══════════════════════════════════════════════════════════════

function detectMood(text) {
    const lower = text.toLowerCase();

    if (lower.includes('хмпф') || lower.includes('hmph') || lower.includes('n-not')) return 'tsundere';
    if (lower.includes('идиот') || lower.includes('дурак') || lower.includes('baka') || lower.includes('fool')) return 'annoyed';
    if (lower.includes('спасибо') || lower.includes('thank') || lower.includes('аригато')) return 'grateful';
    if (lower.includes('хорошо') || lower.includes('ладно') || lower.includes('fine') || lower.includes('okay')) return 'reluctant';
    if (lower.includes('!') && lower.includes('?')) return 'flustered';
    if (lower.includes('…') || lower.includes('...')) return 'thoughtful';

    return 'neutral';
}
