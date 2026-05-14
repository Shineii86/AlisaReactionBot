<div align="center">

<img src="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/refs/heads/main/assets/logo2.png" width="200" height="200" style="border-radius: 24px;" />

# 𝐀𝐋𝐈𝐒𝐀 𝐑𝐄𝐀𝐂𝐓𝐈𝐎𝐍 𝐁𝐎𝐓

### *Automated Telegram Reactions — Edge-Deployed, Zero-Log, Infinite Scale*

<br/>

[![Cloudflare Workers](https://img.shields.io/badge/Deployed_on-Cloudflare_Workers-F48120?style=for-the-badge&logo=cloudflare&logoColor=white)](https://workers.cloudflare.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://t.me/AlisaReactionBot)
[![License: MIT](https://img.shields.io/badge/License-MIT-008000.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/Shineii86/AlisaReactionBot?style=for-the-badge&color=blue)](https://github.com/Shineii86/AlisaReactionBot/releases)

[![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/fork)
[![GitHub Issues](https://img.shields.io/github/issues/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/issues)
[![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AlisaReactionBot?style=for-the-badge&logo=github)](https://github.com/Shineii86/AlisaReactionBot/commits/main)

<br/>

[💬 Try Bot](https://t.me/AlisaReactionBot) · [📖 Complete Guide](GUIDE.md) · [🐛 Report Bug](https://github.com/Shineii86/AlisaReactionBot/issues/new) · [💡 Request Feature](https://github.com/Shineii86/AlisaReactionBot/discussions) · [📝 Changelog](CHANGELOG.md)

</div>

---

## 📖 Table of Contents

- [What Is Alisa?](#-what-is-alisa)
- [Who Is Alisa Mikhailovna Kujou?](#-who-is-alisa-mikhailovna-kujou)
- [✨ Features](#-features)
- [🎮 Commands](#-commands)
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

Хмпф… Not that you need my permission to add me.

---

## 🦊 Who Is Alisa Mikhailovna Kujou?

<img src="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/refs/heads/main/assets/logo2.png" width="120" height="120" style="border-radius: 16px;" align="right" />

**Alisa Mikhailovna Kujou** (アリサ・ミハイロヴナ・九条) is the female lead of *"Tokidoki Bosotto Russia-go de Dereru Tonari no Alya-san"* (Alya Sometimes Hides Her Feelings in Russian), a romantic comedy light novel and anime series.

| | |
|:---|:---|
| **Full Name** | Alisa Mikhailovna Kujou (Алиса Михайловна Кудзё) |
| **Aliases** | Alya, The Ice Queen |
| **Heritage** | Half-Russian, Half-Japanese |
| **Family** | Masachika Kuze (love interest), Maria Kujou (older sister) |
| **Role** | Student Council Treasurer |
| **Personality** | Tsundere — proud, elegant, and sharp-tongued on the surface, but secretly caring and easily flustered |
| **Signature Trait** | Speaks her true feelings in Russian, believing no one around her can understand |
| **Common Phrases** | Хмпф (hmph), Хорошо (okay), Дурак (idiot), Спасибо (thank you), До свидания (goodbye) |

### Why Alisa?

The character's defining trait — **hiding emotions behind a language barrier** — perfectly mirrors this bot's behavior: silently reacting to messages with the right emoji at the right time. Just like Alisa watches from a distance and slips in her true feelings in Russian, this bot observes your chats and drops reactions that say more than words.

Her tsundere personality — cold on the outside, warm on the inside — gives the bot its voice. Every message carries her pride, her wit, and those rare moments of genuine warmth.

> *"N-Not that I care about your chats or anything… Хмпф."*

---

## ✨ Features

<table>
<tr>
<td width="50%">

### ⚡ Core
- **Auto-Reactions** — Smart emoji reactions for private, group, and channel messages
- **Per-Chat Emoji Sets** — Each group can choose its own reaction emojis
- **Pause / Resume** — Group admins can temporarily disable reactions
- **Runtime Restrictions** — Owner can restrict/unrestrict chats at runtime via commands
- **Intelligent Randomization** — Configurable randomness level (0-10) for natural behavior
- **Per-Chat Random Level** — Group admins can override random level per chat via `/randomlevel`
- **Rate Limiting** — Max 30 reactions/min per chat to prevent API abuse

</td>
<td width="50%">

### 🛡️ Security & Privacy
- **Webhook Secret Validation** — Rejects spoofed requests (auto-generated if not set)
- **Owner-Only Commands** — Broadcast, log, leave, chats, restrict, webhook restricted to owner
- **Admin Permission Checks** — `/setreactions`, `/pause`, `/resume` require group admin rights
- **No Message Storage** — Only metadata (chat IDs, counters) is persisted, never message content
- **Request Size Limit** — Rejects payloads over 1MB
- **Broadcast Cooldown** — 60-second cooldown between broadcasts

</td>
</tr>
<tr>
<td>

### 📊 Monitoring
- **Live Stats** — Messages processed, reactions sent, unique chats, paused, restricted, uptime
- **Command Usage Tracking** — See which commands are used most
- **Top Chats Leaderboard** — Which chats get the most reactions
- **Reaction Log** — Last 50 reactions with chat, emoji, and timestamp
- **Health Endpoint** — `/health` for uptime monitoring with config status

</td>
<td>

### 🚀 Deployment
- **Multi-Platform** — Cloudflare Workers, Vercel, Docker, Railway, Render
- **Zero Cold Starts** — Edge-optimized for instant responses
- **One-Click Deploy** — Deploy buttons for every platform
- **Free Tier Friendly** — Works on free tiers (Docker for persistent storage)
- **Webhook Setup** — Set webhook directly from Telegram via `/setwebhook`
- **Persistent Storage** — File-based (Docker/Local), Upstash Redis free (Vercel), in-memory (Workers)

</td>
</tr>
<tr>
<td>

### 📮 Ad Library (AdLab)
- **Random Ad Selection** — Picks one ad from a curated pool per message
- **Formatted Ad Footers** — Styled ad blocks appended to bot responses automatically
- **Default Ad Pool** — Promotes @MaximX channels (Emojis, Stickers, Bots, Arts, Icons, Anime)
- **Inspired by [AdLab](https://github.com/Shineii86/AdLab)** — Centralized ad management

</td>
<td>

### 📸 Photo & UI
- **Photo Messages** — Bot sends photos with `/start`, `/help`, `/about`, `/stats`, `/reactions`, `/donate`
- **Close Button** — ✖️ Close on every keyboard deletes the message
- **Buttons Everywhere** — All commands have inline keyboard buttons
- **`BOT_PHOTO` Env Var** — Set photo URL or Telegram file_id
- **Photo Callback Support** — Menu navigation works on both photo and text messages

</td>
</tr>
<tr>
<td>

### 👋 Welcome & Leave
- **Welcome Messages** — Greet new members when they join a group
- **Leave Messages** — Farewell members when they leave
- **Admin Toggle** — `/welcome` and `/goodbye` to enable/disable per group
- **Auto-Delete Notifications** — Removes Telegram's default join/leave messages
- **Photo Support** — Uses `BOT_PHOTO` when set

</td>
</tr>
</table>

---

## 🎮 Commands

### 👤 Everyone

| Command | Description |
|:---|:---|
| `/start` | Welcome menu with quick links |
| `/help` | Full command reference with access levels |
| `/about` | Bot features, tech stack, and links |
| `/ping` | Check bot latency and response time |
| `/stats` | Live statistics — messages, reactions, uptime, top chats |
| `/reactions` | List currently enabled reaction emojis |
| `/donate` | Support the project |

### 👑 Group Admins

| Command | Description |
|:---|:---|
| `/setreactions 👍 ❤ 🔥` | Set custom reaction emojis for this chat |
| `/setreactions` | Reset to default global emoji set |
| `/pause` | Pause auto-reactions in this chat |
| `/resume` | Resume auto-reactions in this chat |
| `/randomlevel <0-10>` | Set reaction randomness for this chat |
| `/randomlevel` | View current random level |
| `/welcome` | Toggle welcome messages for new members |
| `/goodbye` | Toggle farewell messages when members leave |

### 🔒 Owner Only

| Command | Description |
|:---|:---|
| `/broadcast <message>` | Send a message to every chat (60s cooldown) |
| `/leave <chat_id>` | Remove the bot from any chat |
| `/remove <chat_id>` | Alias for `/leave` |
| `/chats` | List all active chats with status indicators |
| `/restrict <chat_id>` | Restrict a chat — bot stops reacting |
| `/unrestrict <chat_id>` | Remove restriction from a chat |
| `/setwebhook <url>` | Set webhook URL via Telegram |
| `/setwebhook` | View current webhook status and errors |
| `/log` | View the last 10 reactions sent |

---

## 📊 How Stats Work

The `/stats` command shows:

```
📊 Alisa Bot Stats

📨 Messages Processed: 1,247
💫 Reactions Sent: 983
💬 Unique Chats: 42
⏸️ Paused Chats: 2
🚫 Restricted Chats: 1
⏱️ Uptime: 3ʜ 24ᴍ 17s
🕐 Started: Mon, 12 May 2026 04:12:00 GMT

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
- **Stats persist** across restarts on Docker/Local (file) and Vercel (KV). On Cloudflare Workers, stats reset per invocation.

---

## 📡 How Broadcast Works

The `/broadcast <message>` command lets the bot owner send a message to every chat:

1. You send `/broadcast Hey everyone! New update! 🎉`
2. Bot checks — are you the `OWNER_ID`?
   - ❌ No → *"This command is only available to the bot owner."*
   - ⏳ Cooldown active → *"Wait Xs before next broadcast."*
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
- **60-second cooldown** between broadcasts to prevent spam
- Failed sends (bot kicked, chat deleted) are counted but don't stop the broadcast
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

> **Note:** The `wrangler.toml` includes `compatibility_flags = ["nodejs_compat"]` for Node.js API compatibility. Storage is in-memory only on Workers (no filesystem).

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

> **Data persists** across restarts via `./data:/app/data` volume mount. State stored in `data/state.json`.

### 🚂 Railway / Render

[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/AlisaReactionBot?referralCode=shineii)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Shineii86/AlisaReactionBot)

### 📡 Set Webhook After Deploy

**Option A — Via Telegram (recommended):**
```
/setwebhook https://your-worker.your-subdomain.workers.dev
```

**Option B — Via curl:**
```bash
curl -X POST "https://api.telegram.org/bot<BOT_TOKEN>/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.your-subdomain.workers.dev", "secret_token": "your_secret"}'
```

**Verify:**
```bash
curl "https://api.telegram.org/bot<BOT_TOKEN>/getWebhookInfo"
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
| `BOT_PHOTO` | Photo URL or Telegram file_id for bot messages | `https://example.com/photo.jpg` | ❌ |
| `PORT` | Server port for Docker/VPS | `3000` | ❌ |

> **Note:** If `WEBHOOK_SECRET` is not set, a random secret is auto-generated at startup. If `OWNER_ID` is not set, owner-only commands are disabled. If `EMOJI_LIST` is not set, the bot will not react to any messages.

### Redis Variables (Optional — for persistent storage on serverless)

**Option 1: Upstash Redis (Free — 10,000 req/day, 256MB)**

| Variable | Description | Required |
|:---|:---|:---:|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | ❌ |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | ❌ |

> Sign up free at [console.upstash.com](https://console.upstash.com), create a Redis database, copy the REST URL and token.

**Option 2: Vercel KV (Paid — starts at $8/month)**

| Variable | Description | Required |
|:---|:---|:---:|
| `KV_REST_API_URL` | Vercel KV Redis connection URL | ❌ (auto-set) |
| `KV_REST_API_TOKEN` | Vercel KV authentication token | ❌ (auto-set) |

> Without any Redis vars, Docker/Local uses file storage (`data/state.json`). Vercel and Cloudflare Workers fall back to in-memory (resets on cold starts).

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

When `WEBHOOK_SECRET` is set (or auto-generated), the bot validates every incoming request against the `x-telegram-bot-api-secret-token` header. Requests with an invalid or missing secret are rejected with `403 Forbidden`.

Set the secret via `/setwebhook` or BotFather:
```json
{
  "url": "https://your-worker.url",
  "secret_token": "your_webhook_secret"
}
```

### Owner-Only Commands

Set `OWNER_ID` to your Telegram user ID (get it from @userinfobot). Only that user can use:
- `/broadcast` — Send messages to all chats
- `/leave` / `/remove` — Remove bot from any chat
- `/chats` — List all active chats
- `/restrict` / `/unrestrict` — Runtime chat restrictions
- `/setwebhook` — Set or view webhook configuration
- `/log` — View reaction history

### Rate Limiting

The bot enforces a **30 reactions per minute per chat** limit. This prevents:
- Telegram API rate limit errors
- Spam in active groups
- Abuse in high-traffic channels

### Broadcast Cooldown

The `/broadcast` command has a **60-second cooldown** between uses to prevent accidental spam.

### Request Size

Incoming webhook payloads larger than **1MB** are rejected with `413 Payload Too Large`.

### Runtime Restrictions

The owner can restrict chats at runtime using `/restrict <chat_id>`. These restrictions:
- Work alongside env-based `RESTRICTED_CHATS`
- Persist across restarts (file/KV storage)
- Are shown in `/chats` and `/stats`
- Can be removed with `/unrestrict <chat_id>`
- Are cleaned up automatically when using `/leave`

---

## 🏗️ Project Structure

```
AlisaReactionBot/
├── api/
│   ├── index.js              # Express server (Docker/Vercel/Local)
│   ├── worker.js             # Cloudflare Worker entry point
│   ├── bot-handler.js        # Core logic — commands, reactions, stats
│   ├── store.js              # Persistent state storage (file/KV/memory)
│   ├── TelegramBotAPI.js     # Telegram API wrapper (all methods)
│   ├── constants.js          # Message templates and keyboard layouts
│   ├── landing.js            # Landing page HTML (separated for clarity)
│   ├── helper.js             # Emoji parsing, chat ID parsing, logger
│   └── ads.js                # AdLab — centralized ad management library
├── assets/                   # Logo and banner images
├── data/                     # Runtime state (auto-created, gitignored)
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
├── GUIDE.md                  # Complete setup & usage guide
├── LICENSE                   # MIT License
└── README.md                 # This file
```

---

## 🧠 Architecture

**Request Flow:**

1. User sends a message in Telegram
2. Telegram forwards it to your webhook (POST `/`)
3. Bot validates the webhook secret
4. `bot-handler.js` processes the update:
   - Command? → Execute command, send response
   - Regular message? → Check restrictions, rate limit, pick emoji, react
5. Stats are updated in-memory
6. `200 OK` returned to Telegram

**Memory Model:**

| State | Type | Persistent | Purpose |
|:---|:---|:---:|:---|
| `stats.messagesProcessed` | Counter | ✅ | Total messages seen |
| `stats.reactionsSent` | Counter | ✅ | Total reactions placed |
| `chats` | Object | ✅ | Chat registry (ID, name, type, count) |
| `reactions` | Object | ✅ | Custom emoji per chat |
| `paused` | Array | ✅ | Paused chat IDs |
| `restricted` | Array | ✅ | Runtime-restricted chat IDs |
| `welcome` / `goodbye` | Array | ✅ | Toggle states per chat |
| `stats.commandUsage` | Object | ✅ | Command name → count |
| `reactionLog[]` | Array (last 50) | ❌ | Recent reactions |
| `rateLimitMap` | Object | ❌ | Per-chat rate limit windows |
| `chatNames` | Object | ❌ | Chat ID → display name |
| `perChatRandomLevel` | Object | ❌ | Per-chat random overrides |

> **Persistence:** State marked ✅ persists to file (Docker/Local) or Upstash Redis (Vercel, free). On Cloudflare Workers, all state is in-memory. No message content is ever stored — only metadata.

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

**Latest: v2.12.0** — Batched saves with debounced writes, graceful shutdown with SIGTERM/SIGINT handlers, and full state persistence across restarts.

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
