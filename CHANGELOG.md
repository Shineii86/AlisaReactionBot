# Changelog

All notable changes to Alisa Reaction Bot are documented here.

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
