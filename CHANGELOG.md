# Changelog

All notable changes to Alisa Reaction Bot are documented here.

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
