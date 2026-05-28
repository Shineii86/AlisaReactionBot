/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — constants.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   All user-facing message templates and inline keyboard layouts.
 *   Every string the bot sends to Telegram lives here.
 *
 * @exports
 *   startMessage, helpMessage, aboutMessage, donateMessage,
 *   statsHeader, reactionsUpdated, reactionsReset, reactionsInvalid,
 *   pausedMessage, resumedMessage, notPausedMessage,
 *   broadcastStarted, broadcastDone, onlyOwnerMessage,
 *   onlyAdminMessage, groupOnlyMessage, pingMessage
 *
 * @version 2.15.2
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

// ══════════════════════════════════════════════════════════════
// START MESSAGE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /start welcome message ----
export const startMessage = `🎀 Хмпф… Sᴏ Yᴏᴜ Fɪɴᴀʟʟʏ Sᴛᴀʀᴛᴇᴅ Mᴇ, <b>UserName</b>.

N-Not Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Fᴏʀ Yᴏᴜ Oʀ Aɴʏᴛʜɪɴɢ. Dᴏɴ'ᴛ Gᴇᴛ Tʜᴇ Wʀᴏɴɢ Iᴅᴇᴀ.

✨ Wᴇʟᴄᴏᴍᴇ Tᴏ <b>Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ</b>
I Sᴜᴘᴘᴏsᴇ I'ʟʟ Gʀᴀᴄᴇ Yᴏᴜʀ Cʜᴀᴛs Wɪᴛʜ Mʏ Pʀᴇsᴇɴᴄᴇ… Хорошо?

💬 <b>Lɪsᴛᴇɴ Cᴀʀᴇғᴜʟʟʏ:</b>
<b>• Pʀɪᴠᴀᴛᴇ Cʜᴀᴛ</b>: I Rᴇᴀᴄᴛ Tᴏ Yᴏᴜʀ Mᴇssᴀɢᴇs. Cᴏɴsɪᴅᴇʀ Iᴛ A Fᴀᴠᴏʀ.
<b>• Gʀᴏᴜᴘs & Cʜᴀɴɴᴇʟs</b>: Aᴅᴅ Mᴇ Aɴᴅ I'ʟʟ Bᴇsᴛᴏᴡ Fɪᴛᴛɪɴɢ Rᴇᴀᴄᴛɪᴏɴs Wʜᴇɴ Tʜᴇ Mᴏᴍᴇɴᴛ Sᴛʀɪᴋᴇs.

Usᴇ Tʜᴇ Bᴜᴛᴛᴏɴs Bᴇʟᴏᴡ. Aɴᴅ Dᴏɴ'ᴛ Mᴀᴋᴇ Mᴇ Rᴇᴘᴇᴀᴛ Mʏsᴇʟғ.`

// ══════════════════════════════════════════════════════════════
// HELP MESSAGE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /help command list ----
export const helpMessage = `📚 <b>Cᴏᴍᴍᴀɴᴅs — Pᴀʏ Aᴛᴛᴇɴᴛɪᴏɴ</b>

Dᴏɴ'ᴛ Mᴀᴋᴇ Mᴇ Exᴘʟᴀɪɴ Tᴡɪᴄᴇ.

🔹 <code>/start</code> — Wʜᴇʀᴇ Yᴏᴜ Mᴇᴛ Mᴇ.
🔹 <code>/help</code> — Tʜɪs Vᴇʀʏ Mᴇssᴀɢᴇ. Oʙᴠɪᴏᴜsʟʏ.
🔹 <code>/about</code> — Lᴇᴀʀɴ Aʙᴏᴜᴛ Mᴇ. Tʜᴇʀᴇ's Qᴜɪᴛᴇ A Lᴏᴛ.
🔹 <code>/stats</code> — Mʏ Pᴇʀғᴏʀᴍᴀɴᴄᴇ Mᴇᴛʀɪᴄs. Великолепно, Rɪɢʜᴛ?
🔹 <code>/ping</code> — Cʜᴇᴄᴋ Mʏ Rᴇsᴘᴏɴsᴇ Tɪᴍᴇ. Spᴏɪʟᴇʀ: Iᴛ's Fᴀsᴛ.
🔹 <code>/donate</code> — Sᴜᴘᴘᴏʀᴛ Mʏ Dᴇᴠᴇʟᴏᴘᴍᴇɴᴛ. Может быть.
🔹 <code>/reactions</code> — Sᴇᴇ Mʏ Cᴜʀᴀᴛᴇᴅ Eᴍᴏᴊɪ Sᴇᴛ.

────────────────

🔒 <b>Gʀᴏᴜᴘ Aᴅᴍɪɴs Oɴʟʏ:</b>

🔹 <code>/pause</code> — Pᴀᴜsᴇ Mʏ Rᴇᴀᴄᴛɪᴏɴs. Yᴏᴜ'ʟʟ Mɪss Tʜᴇᴍ.
🔹 <code>/resume</code> — Rᴇsᴜᴍᴇ. Ахаха, Wᴇʟᴄᴏᴍᴇ Bᴀᴄᴋ.
🔹 <code>/setreactions</code> — Cᴜsᴛᴏᴍɪᴢᴇ Rᴇᴀᴄᴛɪᴏɴs Fᴏʀ Tʜɪs Cʜᴀᴛ.
🔹 <code>/randomlevel &lt;0-10&gt;</code> — Aᴅᴊᴜsᴛ Rᴇᴀᴄᴛɪᴏɴ Fʀᴇǫᴜᴇɴᴄʏ.
🔹 <code>/welcome</code> — Tᴏɢɢʟᴇ Gʀᴇᴇᴛɪɴɢs Fᴏʀ Nᴇᴡ Mᴇᴍʙᴇʀs.
🔹 <code>/goodbye</code> — Tᴏɢɢʟᴇ Fᴀʀᴇᴡᴇʟʟs Wʜᴇɴ Mᴇᴍʙᴇʀs Lᴇᴀᴠᴇ.

💡 <b>Pʀᴏ Tɪᴘs:</b>
• Aᴅᴅ Mᴇ Tᴏ A Gʀᴏᴜᴘ Aɴᴅ I'ʟʟ Rᴇᴀᴄᴛ Aᴜᴛᴏᴍᴀᴛɪᴄᴀʟʟʏ.
• Iɴ Pʀɪᴠᴀᴛᴇ Cʜᴀᴛ, I Rᴇᴀᴄᴛ Tᴏ Eᴠᴇʀʏ Mᴇssᴀɢᴇ.
• Gʀᴏᴜᴘ Aᴅᴍɪɴs Cᴀɴ Usᴇ <code>/pause</code> Aɴᴅ <code>/setreactions</code>.
• Usᴇ <code>/setwebhook</code> Wɪᴛʜᴏᴜᴛ Aʀɢs Tᴏ Cʜᴇᴄᴋ Cᴜʀʀᴇɴᴛ Sᴛᴀᴛᴜs.`;

// ---- FEATURE: Admin panel — owner-only commands ----
export const adminPanelMessage = `👑 <b>Aᴅᴍɪɴ Pᴀɴᴇʟ — Oᴡɴᴇʀ Oɴʟʏ</b>

Хмпф. Yᴏᴜ Kɴᴏᴡ Wʜᴏ Tʜɪs Is Fᴏʀ.

🔹 <code>/broadcast &lt;msg&gt;</code> — Sᴘᴇᴀᴋ Tᴏ Aʟʟ Cʜᴀᴛs.
🔹 <code>/leave &lt;chat_id&gt;</code> — Rᴇᴍᴏᴠᴇ Mᴇ. Yᴏᴜʀ Lᴏss.
🔹 <code>/remove &lt;chat_id&gt;</code> — Aʟɪᴀs Fᴏʀ /leave.
🔹 <code>/chats</code> — Vɪᴇᴡ Aʟʟ Aᴄᴛɪᴠᴇ Cʜᴀᴛs.
🔹 <code>/restrict &lt;chat_id&gt;</code> — Rᴇsᴛʀɪᴄᴛ A Cʜᴀᴛ.
🔹 <code>/unrestrict &lt;chat_id&gt;</code> — Lɪғᴛ Tʜᴇ Rᴇsᴛʀɪᴄᴛɪᴏɴ.
🔹 <code>/setwebhook &lt;url&gt;</code> — Cᴏɴғɪɢᴜʀᴇ Wᴇʙʜᴏᴏᴋ.
🔹 <code>/log</code> — Rᴇᴠɪᴇᴡ Rᴇᴀᴄᴛɪᴏɴ Hɪsᴛᴏʀʏ.

────────────────

<i>Nᴏʙᴏᴅʏ Eʟsᴇ Sʜᴏᴜʟᴅ Sᴇᴇ Tʜɪs. Yᴏᴜ Kɴᴏᴡ Tʜᴀᴛ, Rɪɢʜᴛ?</i>`

// ══════════════════════════════════════════════════════════════
// ABOUT MESSAGE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /about bot info + character lore ----
export const aboutMessage = `🦊 <a href='https://t.me/AlisaReactionBot'>Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴs Bᴏᴛ</a> Cʀᴀғᴛᴇᴅ Bʏ <b><a href='https://t.me/Shineii86'>Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a></b> Usɪɴɢ <b>Nᴏᴅᴇ.js</b> & <b>Express</b> — Dᴇᴘʟᴏʏᴇᴅ Oɴ <b>Cʟᴏᴜᴅғʟᴀʀᴇ Wᴏʀᴋᴇʀs</b>, <b>Vᴇʀᴄᴇʟ</b> & <b>Dᴏᴄᴋᴇʀ</b>.

<b>Tʜᴇ Sᴘɪʀɪᴛ Oғ Tʜɪs Bᴏᴛ Is Iɴғᴜsᴇᴅ Wɪᴛʜ Tʜᴇ Essᴇɴᴄᴇ Oғ Aʟɪsᴀ Mɪᴋʜᴀɪʟᴏᴠɴᴀ Kᴜᴊᴏᴜ</b>, Tʜᴇ Hᴀʟꜰ-Rᴜssɪᴀɴ, Hᴀʟꜰ-Jᴀᴘᴀɴᴇsᴇ Iᴄᴇ Ҩᴜᴇᴇɴ Wʜᴏsᴇ Sʜᴀʀᴘ Tᴏɴɢᴜᴇ Aɴᴅ Hɪᴅᴅᴇɴ Wᴀʀᴍᴛʜ Gᴏᴠᴇʀɴ Hᴇʀ Eᴠᴇʀʏ Wᴏʀᴅ. As Tʜᴇ Tsᴜɴᴅᴇʀᴇ Pʀɪᴅᴇ Oғ "Tᴏᴋɪᴅᴏᴋɪ Bᴏsᴏᴛᴛᴏ Rᴏssɪᴀ-ɢᴏ Dᴇ Dᴇʀᴇʀᴜ Tᴏɴᴀʀɪ Nᴏ Aʟʏᴀ-Sᴀɴ," Sʜᴇ Cᴀᴘᴛɪᴠᴀᴛᴇs Wɪᴛʜ Hᴇʀ Eʟᴇɢᴀɴᴛ Pʀɪᴅᴇ, Sʜᴀʀᴘ Wɪᴛ, Aɴᴅ Tʜᴏsᴇ Mᴏᴍᴇɴᴛs Wʜᴇɴ Rᴜssɪᴀɴ Sʟɪᴘs Tʜʀᴏᴜɢʜ Hᴇʀ Cᴏᴍᴘᴏsᴇᴅ Fᴀᴄᴀᴅᴇ—Ҩᴜᴀʟɪᴛɪᴇs Eᴍʙᴏᴅɪᴇᴅ Iɴ Tʜɪs Bᴏᴛ's Dᴇsɪɢɴ.

Хмпф… N-Nᴏᴛ Tʜᴀᴛ I Cᴀʀᴇ Iғ Yᴏᴜ Rᴇᴀᴅ Tʜɪs Fᴀʀ.

<b>» 🚀 Vᴇʀsɪᴏɴ:</b> v2.14.0
<b>» 📡 Nᴇᴛᴡᴏʀᴋ:</b> <a href='https://t.me/QuinxNetwork'>Ҩᴜɪɴx Nᴇᴛᴡᴏʀᴋ</a>
<b>» 🔔 Mᴀɪɴ Cʜᴀɴɴᴇʟ:</b> <a href='https://t.me/MaximXBots'>Mᴀxɪᴍ 𝕏 Bᴏᴛs</a>
<b>» 💬 Sᴜᴘᴘᴏʀᴛ Gʀᴏᴜᴘ:</b> <a href='https://t.me/MaximXGroup'>Mᴀxɪᴍ 𝕏 Gʀᴏᴜᴘ</a>

<b>Bᴏᴛ Cʀᴇᴅɪᴛs</b>
<b>» 💀 Dᴇᴠᴇʟᴏᴘᴇʀ:</b> <a href='https://t.me/Shineii86'>Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a>`

// ══════════════════════════════════════════════════════════════
// DONATE MESSAGE
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /donate payment info ----
export const donateMessage = `🎁 <b>Sᴜᴘᴘᴏʀᴛ Tʜᴇ Pʀᴏᴊᴇᴄᴛ</b>

L-Lᴏᴏᴋ… Iғ Yᴏᴜ Eɴᴊᴏʏ Usɪɴɢ Mʏ Sᴇʀᴠɪᴄᴇs, I Sᴜᴘᴘᴏsᴇ A Sᴍᴀʟʟ Cᴏɴᴛʀɪʙᴜᴛɪᴏɴ Wᴏᴜʟᴅɴ'ᴛ Hᴜʀᴛ. N-Not Tʜᴀᴛ I Nᴇᴇᴅ Iᴛ! Bᴜᴛ Iᴛ Kᴇᴇᴘs Mᴇ Rᴜɴɴɪɴɢ.

💰 <b>Hᴏᴡ Tᴏ Dᴏɴᴀᴛᴇ:</b>

∇ <b>Tᴏɴ Pᴀʏᴍᴇɴᴛ Vɪᴀ Tᴏɴᴋᴇᴇᴘᴇʀ</b>
- <b>Aᴅᴅʀᴇss:</b> <code>UQBmK_-2A-gHnhx0hmWdFeQc8X7iZ0O_UkxQbQGU2uA6OwmX</code>
<i>(Aᴄᴄᴇᴘᴛs Bᴏᴛʜ Tᴏɴ Aɴᴅ Usᴅᴛ Oɴ Tᴏɴ Nᴇᴛᴡᴏʀᴋ)</i>

🇮🇳 <b>Iɴʀ PʜᴏɴᴇPᴇ</b>
- <b>Uᴘɪ Iᴅ:</b> Dᴍ Aᴛ <a href="https://t.me/Shineii86">Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a>

💜 <b>Tᴇʟᴇɢʀᴀᴍ Sᴛᴀʀs</b>
Sᴇɴᴅ Sᴛᴀʀs Dɪʀᴇᴄᴛʟʏ Tᴏ <a href="https://t.me/Shineii86">Sʜɪɴᴇɪ Nᴏᴜᴢᴇɴ</a>

────────────────

Eᴠᴇɴ A Sᴍᴀʟʟ Gᴇsᴛᴜʀᴇ Mᴇᴀɴs Mᴏʀᴇ Tʜᴀɴ Yᴏᴜ Tʜɪɴᴋ.
Спасибо. 🙏`

// ══════════════════════════════════════════════════════════════
// SHORT MESSAGES & STATUS STRINGS
// ══════════════════════════════════════════════════════════════

// ---- FEATURE: /stats header ----
export const statsHeader = `📊 <b>Aʟɪsᴀ Bᴏᴛ Sᴛᴀᴛs</b>\n\n`

// ---- FEATURE: /setreactions success ----
export const reactionsUpdated = `✅ Хорошо! Rᴇᴀᴄᴛɪᴏɴs Uᴘᴅᴀᴛᴇᴅ.\n\n`

// ---- FEATURE: /setreactions reset ----
export const reactionsReset = `🔄 Rᴇsᴇᴛ Tᴏ Mʏ Dᴇғᴀᴜʟᴛs. Tʀᴜsᴛ Mᴇ, Tʜᴇʏ'ʀᴇ Bᴇᴛᴛᴇʀ.`

// ---- FEATURE: /setreactions invalid input ----
export const reactionsInvalid = `📵 Iɴᴠᴀʟɪᴅ Eᴍᴏᴊɪ Lɪsᴛ. Sᴇɴᴅ Eᴍᴏᴊɪs Sᴇᴘᴀʀᴀᴛᴇᴅ Bʏ Sᴘᴀᴄᴇs.\n\nExᴀᴍᴘʟᴇ: /setreactions 👍 ❤ 🔥 🎉 👏`

// ---- FEATURE: /pause success ----
export const pausedMessage = `⏸️ Rᴇᴀᴄᴛɪᴏɴs <b>Pᴀᴜsᴇᴅ</b>. Dᴏɴ'ᴛ Gᴇᴛ Tᴏᴏ Cᴏᴍғᴏʀᴛᴀʙʟᴇ Wɪᴛʜᴏᴜᴛ Mᴇ.\nUsᴇ /resume Wʜᴇɴ Yᴏᴜ'ʀᴇ Rᴇᴀᴅʏ.`

// ---- FEATURE: /resume success ----
export const resumedMessage = `▶️ Ахаха~ Yᴏᴜ Mɪssᴇᴅ Mᴇ, Dɪᴅɴ'ᴛ Yᴏᴜ? Rᴇᴀᴄᴛɪᴏɴs <b>Rᴇsᴜᴍᴇᴅ</b>.`

// ---- FEATURE: /resume when not paused ----
export const notPausedMessage = `ℹ️ Rᴇᴀᴄᴛɪᴏɴs Aʀᴇɴ'ᴛ Pᴀᴜsᴇᴅ Hᴇʀᴇ. Wᴇʀᴇ Yᴏᴜ Jᴜsᴛ Tʀʏɪɴɢ Tᴏ Gᴇᴛ Mʏ Aᴛᴛᴇɴᴛɪᴏɴ?`

// ---- FEATURE: /broadcast started ----
export const broadcastStarted = `📡 Bʀᴏᴀᴅᴄᴀsᴛɪɴɢ… Lɪsᴛᴇɴ Uᴘ, Eᴠᴇʀʏᴏɴᴇ.`

// ---- FEATURE: /broadcast complete ----
export const broadcastDone = (success, failed) =>
    `✅ <b>Bʀᴏᴀᴅᴄᴀsᴛ Cᴏᴍᴘʟᴇᴛᴇ!</b>\n\n🚀 Sᴇɴᴛ: ${success}\n📵 Fᴀɪʟᴇᴅ: ${failed}\n\nХмпф. Mᴏsᴛ Oғ Tʜᴇᴍ Lɪsᴛᴇɴᴇᴅ, Aᴛ Lᴇᴀsᴛ.`

// ---- FEATURE: Owner-only command denial ----
export const onlyOwnerMessage = `👑 Tʜɪs Cᴏᴍᴍᴀɴᴅ Is Fᴏʀ Tʜᴇ Oᴡɴᴇʀ. Yᴏᴜ Tʜɪɴᴋ Yᴏᴜ Cᴀɴ Jᴜsᴛ—? Дурак.`

// ---- FEATURE: Admin-only command denial ----
export const onlyAdminMessage = `🔒 Aᴅᴍɪɴ Pᴇʀᴍɪssɪᴏɴs Rᴇǫᴜɪʀᴇᴅ. Dᴏɴ'ᴛ Eᴠᴇɴ Tʀʏ Wɪᴛʜᴏᴜᴛ Tʜᴇᴍ.`

// ---- FEATURE: Group-only command denial ----
export const groupOnlyMessage = `🏘️ Tʜɪs Cᴏᴍᴍᴀɴᴅ Oɴʟʏ Wᴏʀᴋs Iɴ Gʀᴏᴜᴘs. Are Yᴏᴜ Eᴠᴇɴ Lɪsᴛᴇɴɪɴɢ?`

// ---- FEATURE: /ping response ----
export const pingMessage = (ms) => `🏓 <b>Pᴏɴɢ!</b>\n\n⏱️ Rᴇsᴘᴏɴsᴇ: <code>${ms}ms</code>\n<i>Tᴏʟᴅ Yᴏᴜ Iᴛ Wᴏᴜʟᴅ Bᴇ Fᴀsᴛ.</i>`

// ══════════════════════════════════════════════════════════════ END: constants.js
