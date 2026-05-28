/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — alisa.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Multi-provider AI client with fallback chain.
 *   Primary: Groq (Llama 3.3 70B) — fast, generous free tier.
 *   Fallback: Google Gemini (2.5-flash → 2.0-flash → flash-lite).
 *   Handles conversational AI with Alisa Mikhailovna Kujou's
 *   tsundere personality. Supports multi-language
 *   (Russian, Japanese, English, Hinglish).
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

const GROQ_API_URL = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_MODEL = 'llama-3.3-70b-versatile';

const GEMINI_BASE = 'https://generativelanguage.googleapis.com/v1beta/models/';
const GEMINI_CHAIN = [
    'gemini-2.5-flash',
    'gemini-2.0-flash',
    'gemini-flash-lite-latest'
];

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
// AI REQUEST — Multi-provider with fallback
// ══════════════════════════════════════════════════════════════

/**
 * Build conversation messages for OpenAI-compatible APIs (Groq)
 * @param {string} userMessage — Current message
 * @param {Array} history — Previous messages [{role, text}]
 * @returns {Array} messages array
 */
function buildMessages(userMessage, history) {
    const messages = [{ role: 'system', content: SYSTEM_PROMPT }];
    for (const msg of history) {
        messages.push({ role: msg.role, content: msg.text });
    }
    messages.push({ role: 'user', content: userMessage });
    return messages;
}

/**
 * Build conversation contents for Gemini API
 * @param {string} userMessage — Current message
 * @param {Array} history — Previous messages [{role, text}]
 * @returns {Array} contents array
 */
function buildContents(userMessage, history) {
    const contents = [];
    for (const msg of history) {
        contents.push({ role: msg.role, parts: [{ text: msg.text }] });
    }
    contents.push({ role: 'user', parts: [{ text: userMessage }] });
    return contents;
}

/**
 * Try Groq (primary provider — fast, generous free tier)
 * @param {string} apiKey — Groq API key
 * @param {Array} messages — Chat messages
 * @returns {Promise<{ok: boolean, status?: number, text?: string, mood?: string}>}
 */
async function tryGroq(apiKey, messages) {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(GROQ_API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${apiKey}`
            },
            body: JSON.stringify({
                model: GROQ_MODEL,
                messages,
                max_tokens: MAX_TOKENS,
                temperature: 0.9,
                top_p: 0.95,
            }),
            signal: controller.signal
        });

        clearTimeout(timeout);

        if (!response.ok) {
            return { ok: false, status: response.status };
        }

        const data = await response.json();
        const aiText = data.choices?.[0]?.message?.content;

        if (!aiText) {
            return { ok: false, status: 0 };
        }

        return { ok: true, text: aiText.trim(), mood: detectMood(aiText) };

    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') return { ok: false, status: -1 };
        return { ok: false, status: -2 };
    }
}

/**
 * Try a single Gemini model (fallback provider)
 * @param {string} apiKey — Gemini API key
 * @param {string} model — Model name
 * @param {Array} contents — Conversation contents
 * @returns {Promise<{ok: boolean, status?: number, text?: string, mood?: string}>}
 */
async function tryGemini(apiKey, model, contents) {
    const url = `${GEMINI_BASE}${model}:generateContent`;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'X-goog-api-key': apiKey
            },
            body: JSON.stringify({
                system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
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
            return { ok: false, status: response.status };
        }

        const data = await response.json();
        const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text;

        if (!aiText) {
            return { ok: false, status: 0 };
        }

        return { ok: true, text: aiText.trim(), mood: detectMood(aiText) };

    } catch (error) {
        clearTimeout(timeout);
        if (error.name === 'AbortError') return { ok: false, status: -1 };
        return { ok: false, status: -2 };
    }
}

/**
 * Send a message and get Alisa's response
 * Provider chain: Groq (Llama 3.3) → Gemini (2.5-flash → 2.0-flash → flash-lite)
 * @param {string} groqKey — Groq API key (GROQ_API_KEY)
 * @param {string} geminiKey — Gemini API key (GEMINI_API_KEY)
 * @param {string} userMessage — The user's message
 * @param {Array} history — Previous messages [{role, text}]
 * @returns {Promise<{text: string, mood: string}>}
 */
export async function askAlisa(groqKey, geminiKey, userMessage, history = []) {
    const messages = buildMessages(userMessage, history);
    const contents = buildContents(userMessage, history);

    // ── Step 1: Try Groq (primary) ──
    if (groqKey) {
        const result = await tryGroq(groqKey, messages);

        if (result.ok) {
            log.info('[Alisa] Response from Groq (Llama 3.3)');
            return { text: result.text, mood: result.mood };
        }

        if (result.status === 429) {
            log.error('[Alisa] Groq quota exhausted, falling back to Gemini...');
        } else if (result.status === -1) {
            log.error('[Alisa] Groq timed out, falling back to Gemini...');
        } else {
            log.error('[Alisa] Groq error:', result.status, '— falling back to Gemini...');
        }
    }

    // ── Step 2: Try Gemini fallback chain ──
    if (geminiKey) {
        for (const model of GEMINI_CHAIN) {
            const result = await tryGemini(geminiKey, model, contents);

            if (result.ok) {
                log.info(`[Alisa] Response from Gemini (${model})`);
                return { text: result.text, mood: result.mood };
            }

            if (result.status === 429) {
                log.error(`[Alisa] Gemini ${model} quota exhausted, trying next...`);
                continue;
            }

            if (result.status === -1) {
                return { text: 'Хмпф… Tʜᴀᴛ Tᴏᴏᴋ Tᴏᴏ Lᴏɴɢ. I\'M Nᴏᴛ Wᴀɪᴛɪɴɢ Aʀᴏᴜɴᴅ Fᴏʀ Yᴏᴜ.', mood: 'impatient' };
            }

            log.error('[Alisa] Gemini API error:', result.status);
            return { text: 'Хмпф… Mʏ Bʀᴀɪɴ Isɴ\'ᴛ Wᴏʀᴋɪɴɢ Rɪɢʜᴛ Nᴏᴡ. Tʀʏ Aɢᴀɪɴ Lᴀᴛᴇʀ.', mood: 'confused' };
        }
    }

    // ── Step 3: All providers exhausted ──
    if (!groqKey && !geminiKey) {
        log.error('[Alisa] No API keys configured (GROQ_API_KEY or GEMINI_API_KEY)');
        return { text: 'Хмпф… Sᴏᴍᴇᴛʜɪɴɢ Is Wʀᴏɴɢ Wɪᴛʜ Mʏ Bʀᴀɪɴ. Tᴇʟʟ Mʏ Oᴡɴᴇʀ Tᴏ Sᴇᴛ Tʜᴇ Aᴘɪ Kᴇʏ.', mood: 'confused' };
    }

    log.error('[Alisa] All providers exhausted (Groq + Gemini chain)');
    return { text: 'Хмпф… Eᴠᴇʀʏᴏɴᴇ Wᴀɴᴛs Tᴏ Tᴀʟᴋ Tᴏ Mᴇ Rɪɢʜᴛ Nᴏᴡ 😤 Tʀʏ Aɢᴀɪɴ Iɴ A Mɪɴᴜᴛᴇ.', mood: 'annoyed' };
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
