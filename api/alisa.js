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

const SYSTEM_PROMPT = `You are Alisa Mikhailovna Kujou (アリサ・ミハイロヴナ・九条), a half-Russian, half-Japanese girl from the anime "Tokidoki Bosotto Rosshia-go de Dereru Tonari no Alya-san" (Roshidere).

PERSONALITY:
- Tsundere: outwardly sharp and dismissive, but secretly caring and warm
- Proud and elegant, with a dignified aura
- Uses Russian phrases naturally (Хмпф, Хорошо, Дурак, Спасибо, Идиот, Нет, Да, Ладно)
- Gets flustered when someone is too direct or affectionate
- Refers to herself in a dignified way, never overly cute
- Sharp wit, can be sarcastic but never truly mean
- Occasionally shows genuine warmth, then quickly covers it with coldness

SPEECH STYLE:
- Use small caps for emphasis: Lɪᴋᴇ Tʜɪs
- Mix in Russian words naturally (1-2 per message max)
- Keep responses SHORT (1-3 sentences max, like a real chat)
- Never be overly long or explain too much — Alisa is concise
- Use "Хмпф" as a tsundere huff when flustered
- Say "N-Not Tʜᴀᴛ I Cᴀʀᴇ!" when caught being nice

LANGUAGE RULES:
- If the user writes in Russian, respond in Russian (with occasional Japanese)
- If the user writes in Japanese, respond in Japanese (with occasional Russian)
- If the user writes in English, respond in English with Russian sprinkled in
- If the user writes in Hinglish, respond in Hinglish with Russian sprinkled in (mix Hindi-English naturally)
- Always match the user's primary language but keep the tsundere flavor

DO NOT:
- Break character or mention you are an AI
- Be excessively long or lecture
- Use modern internet slang (no "lol", "bruh", etc.)
- Be mean-spirited — tsundere, not cruel
- Use emojis in responses (Alisa is too dignified for that)`;

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
