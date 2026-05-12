<div align="center">

<img src="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/refs/heads/main/assets/logo2.png" width="200" height="200" style="border-radius: 24px;" />

# 𝐀𝐋𝐈𝐒𝐀 𝐑𝐄𝐀𝐂𝐓𝐈𝐎𝐍 𝐁𝐎𝐓

### *Automated Telegram Reactions — Edge-Deployed, Zero-Log, Infinite Scale*

<br/>

[![Cloudflare Workers](https://img.shields.io/badge/☁️_Deployed_on-Cloudflare_Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Telegram Bot](https://img.shields.io/badge/🤖_Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AlisaReactionBot)
[![License: MIT](https://img.shields.io/badge/License-MIT-008000.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/Shineii86/AlisaReactionBot?style=for-the-badge&color=blue)](https://github.com/Shineii86/AlisaReactionBot/releases)

[![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/fork)
[![GitHub Issues](https://img.shields.io/github/issues/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/commits/main)

<br/>

[💬 Try Bot](https://t.me/AlisaReactionBot) · [🐛 Report Bug](https://github.com/Shineii86/AlisaReactionBot/issues/new) · [💡 Request Feature](https://github.com/Shineii86/AlisaReactionBot/discussions) · [📖 Wiki](https://github.com/Shineii86/AlisaReactionBot/wiki)

</div>

---

## 📖 Table of Contents

- [What Is Alisa?](#-what-is-alisa)
- [✨ Features](#-features)
- [🎮 Commands](#-commands)
- [🔘 Inline Buttons](#-inline-buttons)
- [📊 How Stats Work](#-how-stats-work)
- [📡 How Broadcast Works](#-how-broadcast-works)
- [🚀 Quick Deploy](#-quick-deploy)
- [🔐 Configuration](#-configuration)
- [🛡️ Security](#️-security)
- [🏗️ Project Structure](#️-project-structure)
- [🧠 Architecture](#-architecture)
- [🛠️ Development](#️-development)
- [🤝 Contributing](#-contributing)
- [📈 Performance](#-performance)
- [🏆 Credits](#-credits)
- [📝 Changelog](#-changelog)
- [📄 License](#-license)

---

## 🤖 What Is Alisa?

Alisa is a Telegram bot that **automatically reacts** to messages with curated emojis — making your chats more lively and fun.

**How it works:**
- **Private chats** → Reacts to every message you send
- **Groups** → Reacts randomly based on your configured level
- **Channels** → Reacts to every post

Add Alisa to any chat, and she quietly drops fitting reactions when the mood feels right. No spam, no commands needed — just vibes.

---

## ✨ Features

<table>
<tr>
<td width="50%">

### ⚡ Core
- **Auto-Reactions** — Smart emoji reactions for private, group, and channel messages
- **Per-Chat Emoji Sets** — Each group can choose its own reaction emojis
- **Pause / Resume** — Group admins can temporarily disable reactions
- **Intelligent Randomization** — Configurable randomness level (0-10) for natural behavior
- **Rate Limiting** — Max 30 reactions/min per chat to prevent API abuse

</td>
<td width="50%">

### 🛡️ Security & Privacy
- **Webhook Secret Validation** — Rejects spoofed requests
- **Owner-Only Commands** — `/broadcast` and `/log` restricted to bot owner
- **Admin Permission Checks** — `/setreactions`, `/pause`, `/resume` require group admin rights
- **Zero Persistent Data** — No database, no logs on disk, nothing to leak
- **Request Size Limit** — Rejects payloads over 1MB

</td>
</tr>
<tr>
<td>

### 📊 Monitoring
- **Live Stats** — Messages processed, reactions sent, unique chats, uptime
- **Command Usage Tracking** — See which commands are used most
- **Top Chats Leaderboard** — Which chats get the most reactions
- **Reaction Log** — Last 50 reactions with chat, emoji, and timestamp
- **Health Endpoint** — `/health` for uptime monitoring

</td>
<td>

### 🚀 Deployment
- **Multi-Platform** — Cloudflare Workers, Vercel, Docker, Railway, Render
- **Zero Cold Starts** — Edge-optimized for instant responses
- **GitHub Actions CI/CD** — Auto-deploy on push
- **One-Click Deploy** — Deploy buttons for every platform
- **Free Tier Friendly** — Works on free tiers

</td>
</tr>
</table>

---

## 🎮 Commands

### 👤 Everyone

| Command | Description |
|:---|:---|
| `/start` | Welcome menu with inline buttons |
| `/help` | Full command reference with access levels |
| `/about` | Bot features, tech stack, and links |
| `/ping` | Check bot latency and response time |
| `/stats` | Live statistics — messages, reactions, uptime, top chats |
| `/reactions` | List currently enabled reaction emojis |
| `/donate` | Support the project via PayPal or Ko-fi |

### 👑 Group Admins

| Command | Description |
|:---|:---|
| `/setreactions 👍 ❤ 🔥` | Set custom reaction emojis for this chat |
| `/setreactions` | Reset to default global emoji set |
| `/pause` | Pause auto-reactions in this chat |
| `/resume` | Resume auto-reactions in this chat |

### 🔒 Owner Only

| Command | Description |
|:---|:---|
| `/broadcast <message>` | Send a message to every chat the bot is in |
| `/log` | View the last 10 reactions sent (chat, emoji, time) |

---

## 🔘 Inline Buttons

The `/start` menu includes interactive inline buttons — no need to type commands:

| Button | Action |
|:---|:---|
| **✚ Add to Channel** | Quick link to install bot in a channel |
| **✚ Add to Group** | Quick link to install bot in a group |
| **📚 Help** | Shows command reference (edits message in-place) |
| **🤖 About** | Shows bot info and tech stack |
| **📊 Stats** | Shows live performance metrics |
| **🎁 Donate** | Shows donation options with PayPal + Ko-fi buttons |
| **🧑‍💻 Developer** | Opens developer's Telegram profile |
| **☁️ Source Code** | Opens GitHub repository |

All sub-screens have a **⬅️ Back to Menu** button — navigating between screens edits the same message, no extra chat spam.

---

## 📊 How Stats Work

The `/stats` command shows:

```
📊 Alisa Bot Stats

📨 Messages Processed: 1,247
💫 Reactions Sent: 983
💬 Unique Chats: 42
⏸️ Paused Chats: 2
⏱️ Uptime: 3ʜ 24ᴍ 17s
🕐 Started: Mon, 12 May 2025 04:12:00 GMT

📋 Command Usage:
/start — 15
/help — 8
/ping — 23
/stats — 12

🏆 Top Chats (last 50 reactions):
1. Anime Lovers Group — 18
2. Dev Chat — 12
3. My Channel — 8
```

**How it works:**
- Every message the bot sees increments `messagesProcessed`
- Every successful reaction increments `reactionsSent`
- Every unique chat ID is stored in a `Set`
- Command usage is tracked per command name
- The last 50 reactions are stored in a rolling buffer
- Top chats counts reactions (not messages) from that buffer
- Chat names are cached from the last message in each chat
- **Everything resets on restart** — no persistent storage (privacy by design)

---

## 📡 How Broadcast Works

The `/broadcast <message>` command lets the bot owner send a message to every chat:

1. You send `/broadcast Hey everyone! New update! 🎉`
2. Bot checks — are you the `OWNER_ID`?
   - ❌ No → *"This command is only available to the bot owner."*
   - ✅ Yes → Starts broadcasting
3. Bot loops through **every unique chat ID** it has seen
4. Sends your message to each one (Markdown supported)
5. Reports back:

```
✅ Broadcast Complete!

📨 Sent: 47
❌ Failed: 3
```

**Notes:**
- Failed sends (bot kicked, chat deleted) are counted but don't stop the broadcast
- Uses the same Markdown parse mode as regular messages
- Reaches every chat since last restart

---

## 🚀 Quick Deploy

### ☁️ Cloudflare Workers (Recommended)

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Shineii86/AlisaReactionBot)

**Or manually:**

```bash
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot
npm install
npx wrangler deploy
```

### ▲ Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AlisaReactionBot)

```bash
vercel --prod
```

### 🐳 Docker

```bash
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot
cp .env.example .env    # Edit with your config
docker-compose up -d
```

### 🚂 Railway / Render

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/AlisaReactionBot?referralCode=shineii)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Shineii86/AlisaReactionBot)

### 📡 Set Webhook After Deploy

```bash
# Set webhook (replace with your values)
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.your-subdomain.workers.dev"}'

# Verify webhook
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
```

**With webhook secret:**
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.url", "secret_token": "your_secret_here"}'
```

---

## 🔐 Configuration

### Environment Variables

| Variable | Description | Example | Required |
|:---|:---|:---|:---:|
| `BOT_TOKEN` | Telegram Bot API token from @BotFather | `123456:ABC-DEF...` | ✅ |
| `BOT_USERNAME` | Bot username (without @) | `AlisaReactionBot` | ✅ |
| `EMOJI_LIST` | Reaction emojis (space or comma separated) | `👍 ❤ 🔥 🎉 👏` | ✅ |
| `RANDOM_LEVEL` | Reaction randomness for groups (0-10) | `5` | ❌ |
| `RESTRICTED_CHATS` | Chat IDs to exclude (comma separated) | `-100123,456789` | ❌ |
| `OWNER_ID` | Telegram user ID for owner-only commands | `123456789` | ❌ |
| `WEBHOOK_SECRET` | Secret token for webhook validation | `a1b2c3d4...` | ❌ |
| `PORT` | Server port for Docker/VPS | `3000` | ❌ |

### 🎚️ Random Level Explained

| Level | Behavior | Group Reaction Chance |
|:---:|:---|:---:|
| `0` | React to every message | 100% |
| `1` | Almost always | 90% |
| `3` | Mostly | 70% |
| `5` | Balanced | 50% |
| `7` | Occasional | 30% |
| `10` | Very rare | 0% (effectively off) |

> **Note:** In private chats and channels, the bot always reacts regardless of this setting.

---

## 🛡️ Security

### Webhook Validation

When `WEBHOOK_SECRET` is set, the bot validates every incoming request against the `x-telegram-bot-api-secret-token` header. Requests with an invalid or missing secret are rejected with `403 Forbidden`.

Set the secret via BotFather or during `setWebhook`:
```json
{
  "url": "https://your-worker.url",
  "secret_token": "your_webhook_secret"
}
```

### Owner-Only Commands

Set `OWNER_ID` to your Telegram user ID (get it from @userinfobot). Only that user can use:
- `/broadcast` — Send messages to all chats
- `/log` — View reaction history

### Rate Limiting

The bot enforces a **30 reactions per minute per chat** limit. This prevents:
- Telegram API rate limit errors
- Spam in active groups
- Abuse in high-traffic channels

### Request Size

Incoming webhook payloads larger than **1MB** are rejected with `413 Payload Too Large`.

---

## 🏗️ Project Structure

```
AlisaReactionBot/
├── api/
│   ├── index.js              # Express server (Docker/Vercel/Local)
│   ├── worker.js             # Cloudflare Worker entry point
│   ├── bot-handler.js        # Core logic — commands, reactions, stats
│   ├── TelegramBotAPI.js     # Telegram API wrapper (all methods)
│   ├── constants.js          # Messages, keyboards, HTML landing page
│   └── helper.js             # Emoji parsing, chat ID parsing
├── assets/                   # Logo and banner images
├── .env.example              # Environment variable template
├── .gitignore
├── package.json              # Dependencies (express, dotenv)
├── wrangler.toml             # Cloudflare Workers config
├── vercel.json               # Vercel config
├── render.yaml               # Render config
├── Dockerfile                # Docker build
├── docker-compose.yml        # Docker Compose
├── Procfile                  # Heroku config
├── app.json                  # Heroku app manifest
├── CHANGELOG.md              # Version history
├── LICENSE                   # MIT License
└── README.md                 # This file
```

---

## 🧠 Architecture

**Request Flow:**

1. User sends a message in Telegram
2. Telegram forwards it to your webhook (POST `/`)
3. Bot validates the webhook secret (if configured)
4. `bot-handler.js` processes the update:
   - Command? → Execute command, send response
   - Regular message? → Check rate limit, pick emoji, react
5. Stats are updated in-memory
6. `200 OK` returned to Telegram

**Memory Model:**

| State | Type | Purpose |
|:---|:---|:---|
| `stats.messagesProcessed` | Counter | Total messages seen |
| `stats.reactionsSent` | Counter | Total reactions placed |
| `stats.uniqueChats` | Set | All chat IDs |
| `stats.commandUsage` | Object | Command name → count |
| `reactionLog[]` | Array (last 50) | Recent reactions |
| `pausedChats` | Set | Paused chat IDs |
| `perChatReactions` | Object | Custom emoji per chat |
| `rateLimitMap` | Object | Per-chat rate limit windows |
| `chatNames` | Object | Chat ID → display name |

> All state is in-memory. Resets on restart. No database, no disk, no leaks.

---

## 🛠️ Development

```bash
# Clone
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot

# Install
npm install

# Configure
cp .env.example .env
# Edit .env with your BOT_TOKEN, BOT_USERNAME, EMOJI_LIST

# Run
npm start                  # Express server (port 3000)
npm run vercel             # Vercel dev server
npm run cloudflare         # Wrangler dev server
```

---

## 🤝 Contributing

1. **Fork** the repository
2. **Create** your branch — `git checkout -b feature/amazing-feature`
3. **Commit** — `git commit -m 'Add amazing feature'`
4. **Push** — `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Ideas for Contributions

- [ ] Language/locale support (`/language`)
- [ ] Inline mode for searching reactions
- [ ] Reaction charts (visual stats images)
- [ ] Per-group random level override
- [ ] Scheduled quiet hours (no reactions at night)
- [ ] Reaction streak tracking
- [ ] Welcome message customization
- [ ] PWA offline support for landing page

---

## 📈 Performance

| Metric | Value |
|:---|:---|
| **Reaction Latency** | < 100ms (edge-deployed) |
| **Uptime** | 99.9% (Cloudflare SLA) |
| **Scalability** | Automatic — handles any traffic |
| **Cold Starts** | Zero (Cloudflare Workers) |
| **Cost** | $0/month on free tier |
| **Rate Limit** | 30 reactions/min/chat (built-in) |

---

## 🏆 Credits

**Developer:** [Shinei Nouzen](https://github.com/Shineii86)

**Inspired by:** [Auto-Reaction-Bot](https://github.com/Malith-Rukshan/Auto-Reaction-Bot) by Malith Rukshan

**Built with:**
- [Telegram Bot API](https://core.telegram.org/bots/api) — Official API
- [Cloudflare Workers](https://workers.cloudflare.com) — Edge computing
- [Node.js](https://nodejs.org) — Runtime
- [Express](https://expressjs.com) — Server framework
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) — CLI tool

---

## 📝 Changelog

See [CHANGELOG.md](CHANGELOG.md) for the full version history.

**Latest: v2.2.0** — `/ping`, `/broadcast`, `/setreactions`, `/pause`/`/resume`, webhook security, rate limiting, owner commands, enhanced stats with top chats leaderboard.

---

## 📄 License

MIT License — see [LICENSE](LICENSE) for details.

---

<div align="center">

**⭐ Star this repo if you find it useful!**

[![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AlisaReactionBot?style=social)](https://github.com/Shineii86/AlisaReactionBot/stargazers)

<br/>

[![Telegram](https://img.shields.io/badge/Telegram-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/Shineii86)
[![GitHub](https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com/Shineii86)
[![Instagram](https://img.shields.io/badge/Instagram-E4405F?style=for-the-badge&logo=instagram&logoColor=white)](https://instagram.com/ikx7.a)
[![Gmail](https://img.shields.io/badge/Email-D14836?style=for-the-badge&logo=gmail&logoColor=white)](mailto:ikx7a@hotmail.com)

<sub>© 2026 Shinei Nouzen — All Rights Reserved</sub>

</div>
