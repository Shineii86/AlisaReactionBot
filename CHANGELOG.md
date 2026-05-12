# Changelog

All notable changes to Alisa Reaction Bot are documented here.

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
