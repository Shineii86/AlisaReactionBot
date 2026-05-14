# Changelog

All notable changes to Alisa Reaction Bot are documented here.

---

## [v2.9.0] — 2026-05-14

### ✨ Owner Commands Separated from Help

- **Separated owner-only commands from the public `/help` command** — Owner commands are no longer visible to regular users in the help menu.
  - Removed owner command section (`/broadcast`, `/leave`, `/remove`, `/chats`, `/restrict`, `/unrestrict`, `/setwebhook`, `/log`) from `helpMessage`.
  - Created new `adminPanelMessage` constant with all owner-only commands, styled as a dedicated admin panel.
  - Added `𝘤Pᴀɴᴇʟ` inline button that appears **only for the bot owner** (dynamically checked via `OWNER_ID`).
  - New callback handler `!admin` — displays the admin panel with owner-only commands. Non-owners get a rejection notice.

### 🔧 Changes

- `api/constants.js` — Split `helpMessage` into public commands + new `adminPanelMessage` export. Version bumped to v2.9.0.
- `api/bot-handler.js` — Added `!admin` callback handler with owner verification. Updated `getStartKeyboard()` and `getHelpKeyboard()` to accept `userId`/`ownerId` for conditional admin button rendering. Updated `/start`, `/help`, `cb_help`, and `cb_menu` to pass owner context. Fixed pre-existing syntax error: unescaped apostrophe in single-quoted string (line 488 — `Tʜᴇʏ'ʀᴇ` broke string delimiter). Version bumped to v2.9.0.
- `package.json` — Version bumped to v2.9.0.
- `CHANGELOG.md` — v2.9.0 entry added.

---

## [v2.8.0] — 2026-05-14

### ✨ Character Rewrite — Alisa Mikhailovna Kujou Voice

- **Rewrote all bot messages** to match the personality and vibes of **Alisa Mikhailovna Kujou** from *Alya Sometimes Hides Her Feelings in Russian (Roshidere)*.
  - **Tsundere tone**: Messages carry Alisa's signature pride, sharp wit, and hidden warmth.
  - **Russian at emotional moments**: Proper Cyrillic Russian words appear naturally when Alisa is flustered, proud, or emotional — exactly like in the anime where she hides her true feelings in Russian. Not random mixing, but character-authentic placement.
  - **Key Russian phrases used**: Хмпф (hmph), Хорошо (okay/good), Спасибо (thank you), Дурак (idiot), До свидания (goodbye), Может быть (perhaps), Что (what), Ничего страшного (no big deal), Великолепно (magnificent), Ахаха (her signature laugh).
  - **Start message**: Cold greeting with Russian "Хмпф" and "Хорошо?" — secretly welcomes users.
  - **Help message**: Commands delivered with confident authority, "Может быть" for donate.
  - **About message**: Styled after Miko Reactions Bot layout — bot identity, character essence description, version, network, channels, and credits. Includes Alisa's tsundere touch at the end.
  - **Donate message**: Tsundere deflection ending with authentic "Спасибо".
  - **Ping response**: "Тold You It Would Be Fast."
  - **Paused/Resumed**: "Don't Get Too Comfortable" / "Аahaha~ You Missed Me, Didn't You?"
  - **Broadcast**: "Listen Up, Everyone" / "Хмпф. Most Of Them Listened."
  - **Permission errors**: "Дурaк" for unauthorized owner access, sharp refusals for others.
  - **Welcome/Leave**: "Аahaha~ Welcome" / "До свидания. Not That I'll Miss You."
  - **Stats footer**: "Хорошо, Right?"
  - **Callbacks**: "Что?! Something Went Wrong."
  - All inline responses updated with personality-appropriate variants.

### 🔧 Changes

- `api/constants.js` — Complete rewrite of all exported message constants with Alisa's personality. About message restructured with character-lore layout, credits, and metadata.
- `api/bot-handler.js` — Updated all inline message strings (welcome, leave, randomlevel, broadcast, stats, error callbacks).
- `api/landing.js` — Version badge updated to v2.8.0. Added Alisa's personality to hero, terminal, features, CTA, and footer. Added "Inspired by Alisa Mikhailovna Kujou" character DNA section with Russian phrase badges. Updated meta descriptions and JSON-LD with character references.
- `package.json` — Version bumped to v2.8.0.

### 📝 Docs

- **README.md** — Added "Who Is Alisa Mikhailovna Kujou?" wiki profile section with character bio, personality traits, common Russian phrases, and the connection between the character's signature trait and the bot's behavior. Updated "What Is Alisa?" with personality touch. Updated latest version reference to v2.8.0.
- **CHANGELOG.md** — v2.8.0 entry added.

---

## [v2.7.0] — 2026-05-14

### ✨ New Features

- **AdLab — Centralized Ad Library** — Added a built-in advertisement management module (`api/ads.js`) inspired by [AdLab](https://github.com/Shineii86/AdLab).
  - Random ad selection from a curated pool of promotional messages
  - HTML-formatted ad footers appended to bot responses (`/start`, `/help`, `/about`, `/stats`, `/reactions`, `/donate`, callback queries)
  - Default ads promoting @MaximX channels (Emojis, Stickers, Bots, Arts, Icons, Anime)
  - New functions: `getRandomAd()`, `getAdFooter()`, `getAdCount()`
  - No external dependencies — pure JavaScript module
  - Always active — no configuration needed

- **Photo Support** — Bot now sends photos with key commands when `BOT_PHOTO` is configured.
  - New `sendPhoto()` method — sends photo with HTML caption and inline keyboard
  - New `editMessageMedia()` method — edits photo messages (used for menu navigation)
  - New `editMessageCaption()` method — edits caption on photo messages
  - New `deleteMessage()` method — deletes messages (used for close button)
  - Commands with photo: `/start`, `/help`, `/about`, `/stats`, `/reactions`, `/donate`
  - Callback queries (Help, About, Stats, Donate, Menu) work on both photo and text messages
  - `BOT_PHOTO` env var — accepts URL or Telegram file_id

- **Close Button** — Added ✖️ Close button to all inline keyboards.
  - Deletes the message when tapped
  - Available on every command response and callback query
  - Back button now paired with Close on all keyboards

- **Buttons on All Commands** — Every command now shows inline keyboard buttons.
  - `/ping` — Close + Back to Menu
  - `/pause`, `/resume` — Close + Back to Menu
  - `/setreactions` — Close + Back to Menu
  - `/randomlevel` — Close + Back to Menu
  - `/broadcast` — Close + Back to Menu
  - `/log` — Close + Back to Menu
  - `/leave`, `/remove` — Close + Back to Menu
  - `/chats` — Close + Back to Menu
  - `/setwebhook` — Close + Back to Menu
  - `/restrict`, `/unrestrict` — Close + Back to Menu

- **Welcome & Leave Messages** — Groups can now greet new members and farewell leaving members.
  - `/welcome` — Admin-only toggle to enable/disable welcome messages for new members
  - `/goodbye` — Admin-only toggle to enable/disable farewell messages when members leave
  - Welcome message: greets new members with mention, chat name, and inline buttons
  - Leave message: farewell with member name, chat name, and inline buttons
  - Auto-deletes Telegram's default join/leave notification messages
  - Uses `BOT_PHOTO` when configured, falls back to text
  - `/stats` shows welcome and goodbye enabled chat counts
  - Inspired by [feature.txt](https://github.com/Shineii86) welcome/leave implementation

- **IST Timestamps** — All times displayed in Indian Standard Time (UTC+5:30).
  - `/stats` start time now shows IST
  - `/ping` response time shows IST
  - `/log` reaction timestamps show IST
  - New `formatIST()` helper function

### 🔧 Changes

- **Switched parse_mode from Markdown to HTML** — All bot messages now use `parse_mode: 'HTML'` for more reliable formatting across all Telegram clients.
  - Converted all constants.js messages: `*bold*` → `<b>`, `_italic_` → `<i>`, backtick code → `<code>`, `[text](url)` → `<a href>`
  - Converted all inline messages in `bot-handler.js` to HTML
  - Updated `TelegramBotAPI.js` — `sendMessage` and `editMessageText` now use `parse_mode: 'HTML'`
- `api/bot-handler.js` — Imported `getAdFooter` from ads module; added `withAd()` helper; `onUpdate()` now accepts `botPhoto` parameter
- `api/index.js` — Reads `BOT_PHOTO` env var, passes to `onUpdate()`
- `api/worker.js` — Reads `BOT_PHOTO` env var, passes to `onUpdate()`
- `.env.example` — Added `BOT_PHOTO` variable
- `package.json` — Version bumped to v2.7.0
- `api/landing.js` — Version badge updated to v2.7.0

### 📝 Docs

- **README.md** — Added AdLab feature section, `ads.js` to project structure, updated Latest version
- **GUIDE.md** — Added "Ad Library (AdLab)" section with usage and technical details; added to table of contents
- **CHANGELOG.md** — v2.7.0 entry added

---

## [v2.6.1] — 2026-05-14

### 🐛 Bug Fixes

- **Fixed `/randomlevel` command** — Resolved multiple issues causing the command to not work correctly:
  - Command now works in private chats (shows global default info instead of blocking with "group only" error)
  - Added `isNaN` guard for `RandomLevel` initialization — invalid `RANDOM_LEVEL` env var no longer causes the bot to skip all group reactions (`Math.random() <= NaN` was always `false`)
  - Fixed auto-reaction threshold logic: changed `Math.random() <= threshold` to `Math.random() < threshold` so level 10 (`0` threshold) truly means "never react" (previously `Math.random()` could return exactly `0`, bypassing the threshold)
  - Added try-catch error handling around the command handler — Telegram API errors are now logged and surfaced to the user instead of being silently swallowed by the outer webhook catch block
  - Cleaner response messages: show current reaction percentage, clearer usage hints

### 🔧 Changes

- `RandomLevel` is now validated at startup in both `index.js` and `worker.js` — falls back to `0` if the env var is missing, non-numeric, or out of range (0–10)
- `/randomlevel` in DMs now displays the global default level with an explanation that per-chat overrides require group admin access
- `/randomlevel` without args now also shows the reaction percentage alongside the level number

### 📝 Docs

- **CHANGELOG.md** — v2.6.1 entry added

---

## [v2.6.0] — 2026-05-12

### 🗑️ Removed

- **Card Feature Completely Removed** — All `/card` related commands and functionality have been removed from the bot.
  - Removed commands: `/card`, `/cardlight`, `/carddark`, `/cardpal`, `/cardvrf`, `/cardphoto`
  - Removed inline query handler (card generation via `@AlisaReactionBot <username>`)
  - Removed card-related constants: `cardMessage`, `cardGenerating`, `cardError`
  - Removed card helper functions: `getTelegramCardUrl`, `getCardUrlByPalette`, `CARD_THEMES`, `CARD_PALETTES`
  - Removed card cooldown system (`CARD_COOLDOWN`, `cardCooldownMap`)
  - Removed `sendPhoto`, `editMessageMedia`, `answerInlineQuery` methods from `TelegramBotAPI.js`
  - Removed `inline_query` from `allowed_updates` in webhook configuration
  - Removed card preview from landing page
  - Removed all card references from `helpMessage` and `aboutMessage`
  - Removed card and inline mode documentation from `README.md` and `GUIDE.md`

### 🔧 Changes

- Bot now focuses purely on auto-reaction functionality
- Updated version to v2.6.0 across `package.json`, landing page, and documentation
- Cleaned up unused imports in `bot-handler.js`

### 📝 Docs

- **README.md** — Removed card commands table, inline mode tip, and card-related features
- **GUIDE.md** — Removed Telegram Card Generator and Inline Mode sections entirely
- **CHANGELOG.md** — v2.6.0 entry added

---

## [v2.5.0] — 2026-05-12

### ✨ New Features

- **Inline Mode** — Type `@AlisaReactionBot <username>` in any Telegram chat to generate profile cards inline. Shows 6 theme options (Light, Dark, Midnight, Sunset, Royal, Ocean) as photo results. No need to open a private chat. Requires inline mode enabled in BotFather.
- **`/randomlevel <0-10>`** — Group admins can set a custom reaction randomness level per chat, overriding the global `RANDOM_LEVEL` env var. `/randomlevel` without args shows current level and source (custom vs global). Resets on restart.
- **`answerInlineQuery` API** — Added `answerInlineQuery()` method to `TelegramBotAPI.js` for inline query responses.
- **`inline_query` in allowed_updates** — Webhook now receives inline query updates from Telegram.

### 🔧 Changes

- Auto-reaction logic now checks per-chat random level before falling back to global `RANDOM_LEVEL`.
- `/stats` now shows count of random level overrides.
- `/leave` now cleans up per-chat random level state.
- Updated `helpMessage` with `/randomlevel` command.
- Updated `aboutMessage` with inline mode and per-chat random level features.
- Updated README.md features list and commands table.
- Updated GUIDE.md with Inline Mode setup guide and `/randomlevel` documentation.

### 📝 Docs

- **README.md** — Added inline mode tip, `/randomlevel` command, inline mode feature bullet.
- **GUIDE.md** — Added "Inline Mode — Cards Anywhere" section with setup instructions. Added `/randomlevel` section with usage examples and level table.
- **CHANGELOG.md** — v2.5.0 entry added.

---

## [v2.4.0] — 2026-05-12

### 🔧 Changes

- **Removed `/card` inline buttons** — Card customization no longer uses callback query inline buttons. All customization is now command-based for a simpler, faster workflow.
- **Removed `getCardMainKeyboard()`** — Inline keyboard builder function removed from `helper.js`. No more callback data state management for card options.
- **Removed `pendingCardPhoto` state** — Custom photo flow no longer requires multi-step conversation state. Single command replaces the button → prompt → URL flow.
- **Removed card callback query handler** — `card:*` callback processing removed from `bot-handler.js`. Menu callbacks (`cb_help`, `cb_about`, `cb_stats`, `cb_donate`, `cb_menu`) remain unchanged.

### ✨ New Commands

- **`/cardlight <username>`** — Generate card with ☀️ Light theme.
- **`/carddark <username>`** — Generate card with 🌙 Dark theme.
- **`/cardpal <palette> <username>`** — Generate card with a color palette. Run without args to list all 12 palettes.
- **`/cardvrf <mode> <username>`** — Control verified badge: `auto` (detect), `show` (force show), `hide` (force hide).
- **`/cardphoto <url> <username>`** — Generate card with custom avatar photo URL. Single command, no multi-step flow.

### 📝 Docs

- **README.md** — Updated commands table with all new card commands. Removed "Inline Buttons" section from TOC and content.
- **GUIDE.md** — Replaced "Inline Button Customization", "Verified Badge Control", and "Custom Photo Avatar" sections with command-based documentation.
- **constants.js** — Updated `helpMessage` with new card command section. Updated `cardMessage` with all card commands.
- **landing.js** — Version bumped to v2.4.0.

---

## [v2.3.0] — 2026-05-12

### ✨ New Features

- **`/card <username>`** — Generate a live Telegram profile card image for any public username. Shows avatar, name, type (User/Bot/Channel/Group), verified badge, and live subscriber count. Powered by [Telegram Card API](https://github.com/Shineii86/Telegram-Card).
- **`/card`** (no args) — Generate your own profile card using your Telegram username.
- **Inline Button Themes** — After generating a card, choose between ☀️ Light and 🌙 Dark themes via inline buttons. Active theme is marked with ☑️.
- **12 Color Palettes** — Choose from ready-made palettes: 🌙 Midnight Blue, 🌅 Warm Sunset, 🌲 Emerald Forest, 👑 Royal Purple, 🌸 Cherry Blossom, ❄️ Arctic Frost, 🔥 Lava Glow, 🌊 Ocean Deep, 🍃 Mint Fresh, 🌑 Pure Black, ☁️ Cloud White, 🌌 Cosmic Indigo.
- **Verified Badge Toggle** — Inline buttons to control the verified badge: 🔖 Auto (detect), ✅ Force Show, ❌ Force Hide. Active option marked with ☑️.
- **Custom Photo Avatar** — 🖼️ Custom Photo button lets users send any image URL (http/https) to use as the card avatar. Includes `/cancel` to abort the flow. Cards update in-place with custom photo.
- **Card Cooldown (60s)** — Non-owner users have a 60-second cooldown between `/card` commands to prevent API abuse. Bot owner (OWNER_ID) is exempt.
- **Card Refresh Button** — 🔄 Refresh button regenerates the card with current theme/palette.
- **`editMessageMedia` API** — Added `editMessageMedia()` to `TelegramBotAPI` for updating card images in-place without sending new messages.
- **Full API parameter support** — `getTelegramCardUrl()` now supports all Telegram Card API params: `theme`, `bgColor`, `textColor`, `subtleTextColor`, `extraColor`, `shadowColor`, `fontFamily`, `verified`, `photo`.
- **Landing page card preview** — Hero section now showcases the bot's live Telegram Card.

### 🔧 Changes

- Card command now sends photo with inline keyboard (theme/palette/action buttons) instead of plain image.
- Callback query handler now processes `card:*` callbacks for theme switching, palette selection, and refresh.
- Updated `/help` message with `/card` command.
- Updated `/about` feature list to include Telegram Card Generator.
- Updated README.md features section and command table with `/card`.
- Updated GUIDE.md with full `/card` documentation, table of contents entry, and usage examples.

### 📝 Docs

- **README.md** — Added `/card <username>` to command table and features list.
- **GUIDE.md** — Added Telegram Card Generator section with usage examples and TOC entry.

---

## [v2.2.1] — 2026-05-12

### ✨ New Features

- **`/leave <chat_id>`** — Owner-only command to remove the bot from any group or channel. No admin rights required in the target chat. Cleans up local state on leave.
- **`/remove <chat_id>`** — Alias for `/leave`.
- **`/chats`** — Owner-only command to list all active chats with names, IDs, pause/restrict status.
- **`/setwebhook <url>`** — Owner-only command to set webhook URL via Telegram. Without args, shows current webhook status, pending updates, and last error.
- **`/restrict <chat_id>`** — Owner-only command to restrict a chat at runtime (bot stops reacting).
- **`/unrestrict <chat_id>`** — Owner-only command to remove runtime restriction.
- **Webhook auto-secret** — If `WEBHOOK_SECRET` env is not set, a random UUID is auto-generated at startup.
- **Broadcast cooldown** — 60-second cooldown between `/broadcast` commands to prevent spam.
- **Chat ID validation** — `/leave` and `/remove` now validate that the chat ID is numeric before attempting to leave.
- **Runtime restrictions** — `/restrict` and `/unrestrict` work alongside env-based `RESTRICTED_CHATS`, persisted in memory.
- **Structured logger** — All files use a consistent `log.info/warn/error` utility with timestamps.
- **Enhanced health check** — `/health` endpoint now includes `reactionsConfigured` and `restrictedChats` count.

### 🐛 Bug Fixes

- **Fixed Cloudflare Workers crash** — `new returnHTML(htmlContent)` in `api/worker.js` incorrectly used `new` on a regular function, causing a `TypeError` on every GET request. Changed to `returnHTML(htmlContent)`.
- **Fixed donate message formatting** — Removed backticks around TON/USDT address (underscores inside backticks can break Telegram Markdown parsing). Consolidated duplicate address lines into one.
- **Updated landing page version** — Footer badge showed `v2.0.0` instead of current `v2.2.0`.

### 🧹 Code Cleanup

- **Removed dead code** — Deleted unused `sendInvoice()` and `answerPreCheckoutQuery()` methods from `TelegramBotAPI.js` (payment logic removed in v2.1.0 but methods were still present).
- **Removed duplicate keyboard** — `getDonateKeyboard()` in `bot-handler.js` was identical to `getBackKeyboard()`. Consolidated to use `getBackKeyboard()` everywhere.
- **Extracted landing page** — Moved HTML landing page from `constants.js` to dedicated `api/landing.js` module. Constants file is now clean message definitions only.

### 🔒 Robustness

- **Added startup env validation** — `api/index.js` now checks for required `BOT_TOKEN` and `BOT_USERNAME` environment variables at startup and exits with a clear error message if missing.
- **Startup warnings** — Logs warnings for missing `EMOJI_LIST`, `WEBHOOK_SECRET`, and `OWNER_ID` at startup.

### 📝 Docs

- **README.md** — Overhauled with all v2.2.1 commands, security features, architecture updates
- **GUIDE.md** — Rewritten with all new owner commands, webhook setup via Telegram, runtime restrictions, broadcast cooldown, troubleshooting, and FAQ

---

## [v2.2.0] — 2025-05-12

### ✨ New Features

**Commands**
- `/ping` — Check bot latency with live response time measurement
- `/setreactions <emojis>` — Group admins can set custom reaction emojis per chat
- `/setreactions` (no args) — Reset to default global reactions
- `/pause` — Group admins can pause auto-reactions in their chat
- `/resume` — Resume auto-reactions in a paused chat
- `/broadcast <message>` — Owner-only: send a message to all chats the bot is in
- `/log` — Owner-only: view the last 10 reactions sent (chat, emoji, timestamp)

**Security**
- `OWNER_ID` env var — restricts `/broadcast` and `/log` to the bot owner
- `WEBHOOK_SECRET` env var — validates incoming webhook requests via `x-telegram-bot-api-secret-token` header
- Rejects requests with invalid/missing webhook secret (403 Forbidden)
- Request size limit: rejects payloads > 1MB (413)

**Per-Chat Customization**
- Per-chat emoji sets via `/setreactions` — each group can have its own reaction emojis
- Per-chat pause/resume — admins can temporarily disable reactions
- Custom reactions persist in memory until restart

**Rate Limiting**
- Max 30 reactions per minute per chat — prevents Telegram API abuse
- Automatic reset every 60 seconds

**Stats Improvements**
- `/stats` now shows: messages processed, reactions sent, unique chats, paused chats, uptime, start time
- Command usage breakdown — tracks how many times each command was used
- Top chats leaderboard — shows which chats got the most reactions (last 50)
- Chat names cached for readable leaderboard entries

**Reaction Log**
- Last 50 reactions stored in memory with chat ID, emoji, and timestamp
- Viewable by owner via `/log`

**API Methods**
- Added `getMe()`, `getChat()`, `getChatMember()` to TelegramBotAPI
- Admin permission check for `/setreactions`, `/pause`, `/resume`

### 🔧 Changes

- `/help` updated with all new commands including access levels
- `/about` updated with new features (per-chat reactions, pause/resume, webhook security, rate limiting)
- `/stats` completely rewritten with command usage and top chats
- `/reactions` now shows whether using custom or default emoji set
- Simplified TelegramBotAPI logging (removed redundant per-action logs)
- Cleaner error handling in callback query processing

### 📝 Notes

- All state is in-memory — resets on serverless cold starts (by design)
- Per-chat reactions and pause state also reset on restart
- Set `OWNER_ID` in env to enable broadcast/log commands
- Set `WEBHOOK_SECRET` in env + BotFather for webhook security

---

## [v2.1.0] — 2025-05-12

### ✨ New Features

**Interactive Inline Buttons**
- Added **📚 Help** button with full command reference and usage tips
- Added **🤖 About** button with bot features, tech stack, and GitHub link
- Added **📊 Stats** button showing live bot statistics (messages processed, reactions sent, unique chats, uptime)
- Added **⬅️ Back to Menu** button on all sub-screens for seamless navigation
- All buttons use Telegram callback queries for instant in-message navigation (no extra messages)

**Custom Donate Message**
- Replaced Telegram Stars invoice payment with a custom donate message
- Added **PayPal** and **Ko-fi** donation links as inline buttons
- Removed `pre_checkout_query` and `sendInvoice` handling from bot logic
- Donate message includes multiple payment options and a heartfelt thank-you

**New Commands**
- `/help` — Full command list with descriptions and usage tips
- `/about` — Bot features, tech stack, privacy info, and source link
- `/stats` — Live performance metrics (messages, reactions, chats, uptime)
- `/donate` — Custom donation message with payment options

**Stats Tracking**
- Added in-memory stats tracking (messages processed, reactions sent, unique chats, uptime)
- Stats reset on restart (no persistent storage by design — privacy first)

### 🔧 Changes

- Updated `/start` menu with new inline keyboard layout (Add to Channel/Group, Help/About/Stats, Donate/Developer, Source Code)
- Shortened `/start` welcome message (removed last paragraph)
- All commands now show a back-to-menu button for easy navigation
- Added `answerCallbackQuery` and `editMessageText` methods to TelegramBotAPI class

### 📝 Notes

- Stats are in-memory only — resets on serverless cold starts (by design)
- Invoice/Stars payment code is preserved in TelegramBotAPI.js but no longer called by bot logic

---

## [v2.0.0] — 2025-01-01

### Initial Release
- Auto-reaction for private chats, groups, and channels
- Configurable emoji list and randomization level
- Chat restriction support
- Telegram Stars donation via invoice
- Cloudflare Workers, Vercel, Docker deployment
- Serverless architecture with zero persistent data
