# 📖 Alisa Reaction Bot — Complete Guide

> Everything you need to know to set up, configure, use, and manage Alisa Reaction Bot.

---

## Table of Contents

1. [What Is Alisa?](#what-is-alisa)
2. [Getting Your Bot Token](#getting-your-bot-token)
3. [Getting Your User ID](#getting-your-user-id)
4. [Deploy to Cloudflare Workers](#deploy-to-cloudflare-workers)
5. [Deploy to Vercel](#deploy-to-vercel)
6. [Deploy with Docker](#deploy-with-docker)
7. [Deploy to Railway / Render](#deploy-to-railway--render)
8. [Set Up the Webhook](#set-up-the-webhook)
9. [Environment Variables Explained](#environment-variables-explained)
10. [Using the Bot](#using-the-bot)
11. [Admin Commands (Group Owners)](#admin-commands-group-owners)
12. [Admin Panel & Owner Commands](#admin-panel--owner-commands)
13. [How Reactions Work](#how-reactions-work)
14. [How Stats Work](#how-stats-work)
15. [How Broadcast Works](#how-broadcast-work)
16. [Ad Library (AdLab)](#ad-library-adlab)
17. [Photo Support](#photo-support)
18. [AI Chat](#ai-chat)
19. [Close Button](#close-button)
20. [Welcome & Leave Messages](#welcome--leave-messages)
21. [Persistent Chat Storage](#persistent-chat-storage)
22. [Security Features](#security-features)
23. [Troubleshooting](#troubleshooting)
24. [Frequently Asked Questions](#frequently-asked-questions)

---

## What Is Alisa?

Alisa is a Telegram bot that automatically reacts to messages with emoji. You add her to a chat, and she quietly drops fitting reactions on messages — making conversations more lively.

**Inspired by Alisa Mikhailovna Kujou** — the half-Russian, half-Japanese tsundere from *"Alya Sometimes Hides Her Feelings in Russian."* Her personality defines every message the bot sends: proud, sharp-tongued, and secretly warm. When emotions run high, Russian slips through.

Хмпф… Not that you need to know all this.

**Where she works:**
- **Private chats** — She reacts to every message you send
- **Groups** — She reacts randomly based on a configurable level
- **Channels** — She reacts to every post

You don't need to type any commands. Just add her and she works.

---

## Getting Your Bot Token

Every Telegram bot needs a token. This is like a password that lets your code control the bot.

1. Open Telegram and search for **@BotFather**
2. Send `/newbot`
3. BotFather will ask for a **name** — this is the display name (e.g., "Alisa Reaction Bot")
4. BotFather will ask for a **username** — this must end in "bot" (e.g., "AlisaReactionBot")
5. BotFather will give you a **token** that looks like this:
   ```
   1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
   ```
6. **Copy this token.** You'll need it for the `BOT_TOKEN` variable.

> ⚠️ **Keep this token secret.** Anyone with it can control your bot.

### Optional BotFather Settings

While you're in BotFather, you can also:

- `/setdescription` — Set what users see before starting the bot
- `/setabouttext` — Set the bot's "About" text
- `/setuserpic` — Set the bot's profile picture
- `/setcommands` — Register commands so Telegram shows them as suggestions:

  ```
  start - Welcome menu
  help - Show all commands
  about - Bot information
  ping - Check bot latency
  stats - View bot statistics
  reactions - List enabled reactions
  setreactions - Customize reactions (group admins)
  pause - Pause reactions (group admins)
  resume - Resume reactions (group admins)
  donate - Support the project
  ```

---

## Getting Your User ID

Your Telegram user ID is a number (not your username). You need it for the `OWNER_ID` variable to unlock owner-only commands.

1. Open Telegram and search for **@userinfobot**
2. Send `/start`
3. The bot will reply with your **Id:** — a number like `123456789`
4. Copy this number

> This is safe to store — it's not a secret. It just identifies you as the bot owner.

---

## Deploy to Cloudflare Workers

Cloudflare Workers is the recommended platform. It's free, fast, and has zero cold starts.

### Option 1: One-Click Deploy

1. Click the deploy button in the README
2. Authorize with your Cloudflare account
3. The bot code is automatically copied to your account
4. Go to **Cloudflare Dashboard** → **Workers** → your worker → **Settings** → **Variables**
5. Add all the environment variables (see [Environment Variables](#environment-variables-explained))
6. Deploy and set the webhook (see [Set Up the Webhook](#set-up-the-webhook))

### Option 2: Manual Deploy with Wrangler

**Step 1: Install Wrangler**

Wrangler is Cloudflare's command-line tool.

```bash
npm install -g wrangler
```

**Step 2: Login to Cloudflare**

```bash
wrangler login
```

This opens a browser window. Authorize Wrangler.

**Step 3: Clone the repository**

```bash
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot
npm install
```

**Step 4: Configure wrangler.toml**

The `wrangler.toml` file tells Cloudflare how to deploy your worker. The default configuration works out of the box:

```toml
name = "alisareactionbot"
main = "api/worker.js"
compatibility_date = "2026-02-22"
compatibility_flags = ["nodejs_compat"]
```

> **Note:** The `nodejs_compat` flag enables broader Node.js API compatibility on Cloudflare Workers. It's required for the bot to function correctly.

**Step 5: Add secrets**

Secrets are environment variables that are encrypted. Use these for sensitive values:

```bash
wrangler secret put BOT_TOKEN
# Paste your bot token when prompted

wrangler secret put WEBHOOK_SECRET
# Paste your webhook secret when prompted (optional — auto-generated if not set)
```

For non-secret variables, add them in the Cloudflare Dashboard:
- Go to **Workers** → your worker → **Settings** → **Variables**
- Add: `BOT_USERNAME`, `EMOJI_LIST`, `RANDOM_LEVEL`, `RESTRICTED_CHATS`, `OWNER_ID`

**Step 6: Deploy**

```bash
wrangler deploy
```

Your worker is now live at `https://your-worker-name.your-subdomain.workers.dev`.

---

## Deploy to Vercel

Vercel is another great option with automatic HTTPS and git-push deploys.

**Step 1: Fork the repository**

Go to the GitHub repo and click **Fork**.

**Step 2: Connect to Vercel**

1. Go to [vercel.com](https://vercel.com) and sign in with GitHub
2. Click **New Project**
3. Import your forked repository
4. Vercel auto-detects the configuration

**Step 3: Add environment variables**

In the Vercel dashboard, go to **Settings** → **Environment Variables** and add:

| Variable | Value |
|---|---|
| `BOT_TOKEN` | Your bot token |
| `BOT_USERNAME` | Your bot username |
| `EMOJI_LIST` | Your emoji list |
| `RANDOM_LEVEL` | `0` (or your preferred level) |
| `OWNER_ID` | Your Telegram user ID |

**Step 4: Deploy**

Click **Deploy**. Vercel gives you a URL like `https://your-project.vercel.app`.

**Step 5: Set Up Persistent Storage (Optional)**

By default, Vercel's serverless functions have ephemeral storage — chat data resets on every cold start. You have two options:

**Option A: Upstash Redis (Free)**

1. Sign up at [console.upstash.com](https://console.upstash.com) (free, no credit card)
2. Create a Redis database — choose your region
3. Copy the **REST URL** and **REST TOKEN** from the database details page
4. In Vercel dashboard, go to **Settings** → **Environment Variables**
5. Add `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN`
6. **Redeploy** your project

**Option B: Vercel KV (Paid — starts at $8/month)**

1. In your Vercel dashboard, go to **Storage** → **Create Database** → pick **KV (Redis)**
2. Vercel automatically creates the database and injects `KV_REST_API_URL` and `KV_REST_API_TOKEN` environment variables
3. **Redeploy** your project

The bot auto-detects whichever Redis is configured. Upstash takes priority over Vercel KV.

> **Without Redis:** The bot works fine, but `/chats` and `/stats` only show data from the current session (resets on cold starts).
> **With Redis:** All chat data persists across deployments and cold starts.

---

## Deploy with Docker

Docker is best for VPS or local servers.

**Step 1: Clone and configure**

```bash
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot
cp .env.example .env
```

**Step 2: Edit .env**

Open `.env` in any text editor and fill in your values:

```env
BOT_TOKEN=1234567890:ABCdefGHIjklMNOpqrsTUVwxyz
BOT_USERNAME=AlisaReactionBot
EMOJI_LIST=👍❤🔥🥰👏😁🎉🤩🙏
RANDOM_LEVEL=0
OWNER_ID=123456789
WEBHOOK_SECRET=your_secret_here
PORT=3000
NODE_ENV=production
```

**Step 3: Start with Docker Compose**

```bash
docker-compose up -d
```

This builds the image and starts the container. The bot runs on port 3000.

**Data Persistence:** The `docker-compose.yml` mounts `./data:/app/data` so chat data persists across `docker-compose down/up` cycles. The `data/state.json` file stores all persistent state (chats, reactions, pauses, stats).

**Step 4: Check logs**

```bash
docker-compose logs -f
```

You should see: `Server running on port 3000`

**Step 5: Set the webhook**

See [Set Up the Webhook](#set-up-the-webhook) below.

---

## Deploy to Railway / Render

These platforms offer one-click deploys with managed infrastructure.

### Railway

1. Go to [railway.app](https://railway.app)
2. Click **New Project** → **Deploy from GitHub**
3. Select the AlisaReactionBot repository
4. Add environment variables in the **Variables** tab
5. Railway auto-deploys

### Render

1. Go to [render.com](https://render.com)
2. Click **New** → **Web Service**
3. Connect your GitHub repository
4. Set **Build Command:** `npm install`
5. Set **Start Command:** `node api/index.js`
6. Add environment variables in the **Environment** tab
7. Click **Create Web Service**

---

## Set Up the Webhook

After deploying, you need to tell Telegram where to send updates. There are three ways to do this.

### Option 1: Via Telegram (Recommended)

Send this command to your bot (in a private chat):

```
/setwebhook https://your-worker.your-subdomain.workers.dev
```

The bot confirms with the webhook URL. To check the current status without changing it:

```
/setwebhook
```

This shows the current URL, pending updates, and any errors.

### Option 2: Via Mobile Browser

Paste this URL in your browser — replace the values:

```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://YOUR_WORKER_URL
```

**Example:**
```
https://api.telegram.org/bot1234567890:ABCdefGHIjklMNOpqrsTUVwxyz/setWebhook?url=https://alisareactionbot.shineii86.workers.dev
```

Press Enter. You'll see:
```json
{"ok":true,"result":true,"description":"Webhook was set"}
```

**With webhook secret:**
```
https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook?url=https://YOUR_WORKER_URL&secret_token=YOUR_SECRET
```

### Option 3: Via Terminal

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker-url.workers.dev", "secret_token": "your_secret"}'
```

### Verify the Webhook

**Via Telegram:**
```
/setwebhook
```

**Via browser:**
```
https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo
```

**Via terminal:**
```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/getWebhookInfo"
```

A correct response looks like:

```json
{
  "ok": true,
  "result": {
    "url": "https://your-worker-url.workers.dev",
    "has_custom_certificate": false,
    "pending_update_count": 0,
    "secret_token": "your_webhook_secret"
  }
}
```

### Remove the Webhook

If you need to remove the webhook (e.g., to switch platforms):

```
https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook
```

---

## Environment Variables Explained

### Required Variables

| Variable | What It Does | Example |
|---|---|---|
| `BOT_TOKEN` | Your Telegram bot token from @BotFather | `1234567890:ABCdef...` |
| `BOT_USERNAME` | Your bot's username (without @) | `AlisaReactionBot` |
| `EMOJI_LIST` | Emojis the bot uses for reactions | `👍❤🔥🥰👏😁🎉🤩🙏` |

> **Note:** If `BOT_TOKEN` or `BOT_USERNAME` is missing, the bot exits with an error. If `EMOJI_LIST` is missing, the bot runs but won't react to any messages.

### Optional Variables

| Variable | What It Does | Default | Example |
|---|---|---|---|
| `RANDOM_LEVEL` | How often the bot reacts in groups (0-10) | `0` (always) | `5` |
| `RESTRICTED_CHATS` | Chat IDs where the bot never reacts | None | `-100123,456789` |
| `OWNER_ID` | Telegram user ID for owner-only commands | None | `123456789` |
| `WEBHOOK_SECRET` | Secret token for webhook validation | Auto-generated | `a1b2c3d4...` |
| `BOT_PHOTO` | Photo URL or Telegram file_id for bot messages | None | `https://example.com/photo.jpg` |
| `PORT` | Server port for Docker/VPS | `3000` | `8080` |

> **Note:** If `WEBHOOK_SECRET` is not set, a random secret is auto-generated at startup. If `OWNER_ID` is not set, owner-only commands (`/broadcast`, `/log`, `/leave`, `/chats`, `/restrict`, `/setwebhook`) are disabled.

### Upstash Redis Variables (Free — Recommended for Vercel)

| Variable | What It Does | Default |
|---|---|---|
| `UPSTASH_REDIS_REST_URL` | Upstash Redis REST URL | None |
| `UPSTASH_REDIS_REST_TOKEN` | Upstash Redis REST token | None |

> Sign up free at [console.upstash.com](https://console.upstash.com), create a Redis database, copy the REST URL and token. 10,000 requests/day, 256MB storage. No credit card required.

### Vercel KV Variables (Paid)

These are auto-injected by Vercel when you create a KV store in the dashboard. You don't need to set them manually.

| Variable | What It Does | Default |
|---|---|---|
| `KV_REST_API_URL` | Vercel KV Redis connection URL | None (auto-set by Vercel) |
| `KV_REST_API_TOKEN` | Vercel KV authentication token | None (auto-set by Vercel) |

> **Note:** When both Upstash and Vercel KV vars are present, Upstash takes priority. When absent, the bot falls back to local file storage (`data/state.json`) on Docker/VPS, or in-memory on serverless platforms.

### How EMOJI_LIST Works

You can separate emojis with spaces or commas:

```
👍 ❤ 🔥 🥰 👏 😁 🎉 🟰 🙏
```

or

```
👍,❤,🔥,🥰,👏,😁,🎉,🤩,🙏
```

Both formats work. The bot handles complex emojis too:
- **Skin tones:** 👋🏽 👍🏿
- **ZWJ sequences:** 👨‍👩‍👧 🏳️‍🌈
- **Flag emojis:** 🇺🇸 🇯🇵
- **Compound emojis:** ❤️‍🔥

### How RANDOM_LEVEL Works

This controls how often the bot reacts **in group chats only**. In private chats and channels, the bot always reacts.

| Level | Behavior | Chance |
|---|---|---|
| 0 | React to every message | 100% |
| 1 | Almost always react | 90% |
| 3 | React most of the time | 70% |
| 5 | Balanced — react half the time | 50% |
| 7 | React occasionally | 30% |
| 10 | Almost never react | ~0% |

The randomness is checked per-message using `Math.random()`. Each message is an independent event — the bot doesn't "remember" if it reacted recently.

### How RESTRICTED_CHATS Works

Comma-separated list of chat IDs where the bot should **never** react, even if it's a member.

To find a chat ID:
1. Add the bot to the chat
2. Send a message
3. Check the bot's logs — the chat ID is printed
4. Or use @userinfobot in the chat

Example: `-1001234567890,-1009876543210`

> **Note:** This is the static, env-based restriction. You can also restrict chats at runtime using the `/restrict` command (see [Owner Commands](#owner-commands)).

---

## Using the Bot

### Starting the Bot

Send `/start` to the bot. You'll see a welcome message with inline buttons:

```
🎀 Хмпф… Sᴏ Yᴏᴜ Fɪɴᴀʟʟʏ Sᴛᴀʀᴛᴇᴅ Mᴇ, [Your Name].

N-Not Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Fᴏʀ Yᴏᴜ Oʀ Aɴʏᴛʜɪɴɢ. Dᴏɴ'ᴛ Gᴇᴛ Tʜᴇ Wʀᴏɴɢ Iᴅᴇᴀ.

✨ Wᴇʟᴄᴏᴍᴇ Tᴏ Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ
I Sᴜᴘᴘᴏsᴇ I'ʟʟ Gʀᴀᴄᴇ Yᴏᴜʀ Cʜᴀᴛs Wɪᴛʜ Mʏ Pʀᴇsᴇɴᴄᴇ… Хорошо?
...
```

Below the message, you'll see buttons:
- **✚ Add to Channel** — Install in a channel
- **✚ Add to Group** — Install in a group
- **📚 Help** — Show commands
- **🤖 About** — Bot info
- **📊 Stats** — Live statistics
- **🎁 Donate** — Support the project

### Adding to a Group

1. Open the group where you want reactions
2. Tap the group name → **Add Members**
3. Search for your bot's username
4. Add it to the group
5. The bot needs **no special permissions** — it just needs to be a member

> **Note:** In groups, the bot reacts based on the `RANDOM_LEVEL`. At level 0, it reacts to every message. At level 5, it reacts to about half.

### Adding to a Channel

1. Open your channel
2. Tap the channel name → **Administrators**
3. Tap **Add Admin**
4. Search for your bot's username
5. Add it as an admin
6. The bot needs the "Post Messages" permission to react

### Checking Reactions

Send `/reactions` to see which emojis the bot is currently using:

```
🚀 Eɴᴀʙʟᴇᴅ Rᴇᴀᴄᴛɪᴏɴs:

👍 ❤ 🔥 🥰 👏 😁 🎉 🟰 🙏

📌 Mʏ Dᴇғᴀᴜʟᴛ Sᴇᴛ. Tʜᴇʏ'ʀᴇ Pᴇʀғᴇᴄᴛ.
```

### Checking Latency

Send `/ping` to see how fast the bot responds:

```
🏓 Pᴏɴɢ!

⏱️ Rᴇsᴘᴏɴsᴇ: 47ms
🕐 Mon, 12 May 2026 12:45:00 GMT
Tᴏʟᴅ Yᴏᴜ Iᴛ Wᴏᴜʟᴅ Bᴇ Fᴀsᴛ.
```

---

## Admin Commands (Group Owners)

These commands only work in **groups** and only for **group admins** (creator or administrator).

### /setreactions — Customize Emojis

Want different reactions in your group? Use `/setreactions` followed by the emojis you want:

```
/setreactions 😂 💀 🤣 😭 😩
```

The bot confirms:

```
✅ Хорошо! Rᴇᴀᴄᴛɪᴏɴs Uᴘᴅᴀᴛᴇᴅ.

🎯 Nᴇᴡ Rᴇᴀᴄᴛɪᴏɴs: 😂 💀 🤣 😭 😩
```

Now the bot uses only those emojis in this group. Other groups keep using the default.

**Reset to default:**

```
/setreactions
```

(no arguments — resets this group back to the global emoji list)

### /pause — Stop Reactions

Need the bot to be quiet for a while?

```
/pause
```

The bot confirms:

```
⏸️ Rᴇᴀᴄᴛɪᴏɴs Pᴀᴜsᴇᴅ. Dᴏɴ'ᴛ Gᴇᴛ Tᴏᴏ Cᴏᴍғᴏʀᴛᴀʙʟᴇ Wɪᴛʜᴏᴜᴛ Mᴇ.
Usᴇ /resume Wʜᴇɴ Yᴏᴜ'ʀᴇ Rᴇᴀᴅʏ.
```

The bot stays in the group but stops reacting. It still responds to commands.

### /resume — Start Reactions Again

Ready to bring reactions back?

```
/resume
```

The bot confirms:

```
▶️ Ахаха~ Yᴏᴜ Mɪssᴇᴅ Mᴇ, Dɪᴅɴ'ᴛ Yᴏᴜ? Rᴇᴀᴄᴛɪᴏɴs Rᴇsᴜᴍᴇᴅ.
```

If reactions weren't paused, it says:

```
ℹ️ Rᴇᴀᴄᴛɪᴏɴs Aʀᴇɴ'ᴛ Pᴀᴜsᴇᴅ Hᴇʀᴇ. Wᴇʀᴇ Yᴏᴜ Jᴜsᴛ Tʀʏɪɴɢ Tᴏ Gᴇᴛ Mʏ Aᴛᴛᴇɴᴛɪᴏɴ?
```

### /randomlevel — Control Reaction Randomness

Set a custom random level for the current group, overriding the global setting:

```
/randomlevel 5
```

The bot confirms:

```
🎲 Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Sᴇᴛ! 📊

🎯 Lᴇᴠᴇʟ: 5 — Rᴇᴀᴄᴛ ~50% Oғ Tʜᴇ Tɪᴍᴇ

💡 0 = Eᴠᴇʀʏ Mᴇssᴀɢᴇ | 10 = Nᴇᴠᴇʀ
🔄 Rᴇsᴇᴛs Oɴ Rᴇsᴛᴀʀᴛ. Ничего страшного.
```

**Check current level:**

```
/randomlevel
```

Shows the current level and whether it's custom or global:

```
🎲 Rᴀɴᴅᴏᴍ Lᴇᴠᴇʟ Fᴏʀ Tʜɪs Cʜᴀᴛ:

📊 Cᴜʀʀᴇɴᴛ: 5 (Cᴜsᴛᴏᴍ) — Rᴇᴀᴄᴛ ~50%
📌 Gʟᴏʙᴀʟ Dᴇғᴀᴜʟᴛ: 0

💡 Usᴇ /randomlevel <0-10> Tᴏ Cʜᴀɴɢᴇ. Iғ Yᴏᴜ Dᴀʀᴇ.
```

**How it works:**

| Level | Behavior | Reaction Chance |
|:---:|:---|:---:|
| `0` | React to every message | 100% |
| `1` | Almost always | 90% |
| `3` | Mostly | 70% |
| `5` | Balanced | 50% |
| `7` | Occasional | 30% |
| `10` | Very rare | ~0% |

**Requirements:**
- Only works in **groups** (not private chats or channels)
- Only **group admins** can use it
- Resets when the bot restarts
- Overrides the global `RANDOM_LEVEL` env var for this chat

---

## Admin Panel & Owner Commands

These commands only work for the user whose ID matches `OWNER_ID`. They work in **any chat** — private, group, or channel.

### How the Admin Panel Works

Owner-only commands are **separated from the public `/help` menu**. Regular users and group admins only see public and admin group commands in `/help`.

The owner gets an extra **𝘤Pᴀɴᴇʟ** button on the `/start` and `/help` screens. Tapping it reveals the admin panel with all owner-only commands.

**For regular users /group admins:** `/help` shows public + group admin commands only.
**For the bot owner:** `/help` shows public + group admin commands + a `𝘤Pᴀɴᴇʟ` button that opens the owner command panel.

```
👑 Aᴅᴍɪɴ Pᴀɴᴇʟ — Oᴡɴᴇʀ Oɴʟʏ

Хмпф. Yᴏᴜ Kɴᴏᴡ Wʜᴏ Tʜɪs Is Fᴏʀ.

🔹 /broadcast <msg> — Speak To All Chats.
🔹 /leave <chat_id> — Remove Me. Your Loss.
🔹 /remove <chat_id> — Alias For /leave.
🔹 /chats — View All Active Chats.
🔹 /restrict <chat_id> — Restrict A Chat.
🔹 /unrestrict <chat_id> — Lift The Restriction.
🔹 /setwebhook <url> — Configure Webhook.
🔹 /log — Review Reaction History.

Nobody Else Should See This. You Know That, Right?
```

> **Security:** The `𝘤Pᴀɴᴇʟ` button is rendered server-side — it only appears when the callback user ID matches `OWNER_ID`. Non-owners who somehow trigger the callback see a rejection message.

### /broadcast — Message All Chats

Send a message to every chat the bot has ever been in:

```
/broadcast Hey everyone! 🎉 The bot just got a major update!
```

The bot first says:

```
📡 Bʀᴏᴀᴅᴄᴀsᴛɪɴɢ… Lɪsᴛᴇɴ Uᴘ, Eᴠᴇʀʏᴏɴᴇ.
```

Then reports the results:

```
✅ Bʀᴏᴀᴅᴄᴀsᴛ Cᴏᴍᴘʟᴇᴛᴇ!

🚀 Sᴇɴᴛ: 47
📵 Fᴀɪʟᴇᴅ: 3

Хмпф. Mᴏsᴛ Oғ Tʜᴇᴍ Lɪsᴛᴇɴᴇᴅ, Aᴛ Lᴇᴀsᴛ.
```

**Notes:**
- **60-second cooldown** between broadcasts to prevent spam
- HTML formatting is preserved
- Failed sends are chats where the bot was kicked or deleted

### /leave — Remove Bot from a Chat

Remove the bot from any chat without needing admin rights in that chat:

```
/leave -1001234567890
```

The bot confirms:

```
✅ До свидания. Left Chat -1001234567890.
```

If the chat ID is invalid or the bot isn't in that chat:

```
❌ Хмпф. Failed To Leave Chat -1001234567890:
Bot is not a member of this chat
```

**What it cleans up:**
- Removes from active chats list (in-memory + persistent store)
- Removes per-chat custom reactions
- Removes pause state
- Removes runtime restrictions

### /remove — Alias for /leave

Same as `/leave` — use whichever you prefer:

```
/remove -1001234567890
```

### /chats — List All Active Chats

See every chat the bot has ever interacted with — **persisted across restarts** (when Upstash Redis, Vercel KV, or file storage is active):

```
/chats
```

The bot replies:

```
💬 Aʟʟ Cʜᴀᴛs (42):

1. 👥 Anime Lovers Group (-1001234567890) — 1,247 msgs
2. 👥 Dev Chat (-1009876543210) ⏸️ — 312 msgs
3. 📢 My Channel (-100111222333) 🚫 — 89 msgs
4. 💬 Private Chat (123456789) — 56 msgs
...

📊 25 ɢʀᴏᴜᴘs · 5 ᴄʜᴀɴɴᴇʟs · 12 ᴘʀɪᴠᴀᴛᴇ

⏸️ = Pᴀᴜsᴇᴅ | 🚫 = Rᴇsᴛʀɪᴄᴛᴇᴅ | ᴍsɢs = Tᴏᴛᴀʟ Mᴇssᴀɢᴇs
```

**Indicators:**
- 👥 — Group or supergroup
- 📢 — Channel
- 💬 — Private chat
- No indicator → Active (reacting normally)
- ⏸️ → Paused (admin used `/pause`)
- 🚫 → Restricted (owner used `/restrict` or in `RESTRICTED_CHATS`)
- `— X msgs` → Total messages processed in that chat

**What's new in v2.10.0:**
- `/chats` now shows **all historical chats**, not just the current session
- Data persists across restarts (Upstash Redis, Vercel KV, or `data/state.json`)
- Chats are sorted by type: groups first, then channels, then private
- Each chat shows its total message count

### /restrict — Restrict a Chat

Stop the bot from reacting in a specific chat, without removing it:

```
/restrict -1001234567890
```

The bot confirms:

```
🚫 Хорошо. Chat -1001234567890 Restricted. I Will Not React There.
```

The bot stays in the chat but won't react to messages. It still responds to commands.

**Differences from /pause:**
| | `/pause` | `/restrict` |
|---|---|---|
| Who can use it | Group admins | Bot owner |
| Where it works | Only in that group | From any chat |
| Scope | Per-chat only | Can restrict any chat |
| Persisted | Until restart | Until restart or `/unrestrict` |

### /unrestrict — Remove Restriction

Allow the bot to react in a previously restricted chat:

```
/unrestrict -1001234567890
```

The bot confirms:

```
✅ Хорошо. Chat -1001234567890 Unrestricted.
```

If the chat wasn't restricted:

```
ℹ️ Хмпф. That Chat Is Not Restricted.
```

### /setwebhook — Set or View Webhook

**Set a new webhook:**

```
/setwebhook https://your-worker.your-subdomain.workers.dev
```

The bot confirms:

```
✅ Хорошо! Webhook Set Successfully!

🔗 https://your-worker.your-subdomain.workers.dev
```

**View current webhook status:**

```
/setwebhook
```

The bot shows:

```
📡 Wᴇʙʜᴏᴏᴋ Sᴛᴀᴛᴜs:

🔗 URL: https://your-worker.your-subdomain.workers.dev
⏳ Pᴇɴᴅɪɴɢ: 0
```

If there's an error:

```
📡 Wᴇʙʜᴏᴏᴋ Sᴛᴀᴛᴜs:

🔗 URL: https://your-worker.your-subdomain.workers.dev
⏳ Pᴇɴᴅɪɴɢ: 3
⚠️ Eʀʀᴏʀ: Connection refused
```

**Requirements:**
- URL must start with `https://`
- The bot must have the `WEBHOOK_SECRET` set (or one is auto-generated)

### /log — View Reaction History

See the last 10 reactions the bot sent:

```
/log
```

The bot replies:

```
📋 Lᴀsᴛ 10 Rᴇᴀᴄᴛɪᴏɴs:

1. 🔥 → Anime Lovers Group (12:45:23 PM)
2. ❤ → Dev Chat (12:45:18 PM)
3. 👍 → My Channel (12:45:10 PM)
4. 😁 → Friends Group (12:44:55 PM)
5. 🎉 → Anime Lovers Group (12:44:30 PM)
...
```

---

## Inline Button Navigation

All buttons in the bot work **without sending extra messages**. They edit the existing message in-place, keeping your chat clean.

### How It Works

1. You send `/start`
2. The bot sends a message with buttons
3. You tap **📚 Help**
4. The message **edits in-place** to show the help text
5. You tap **⬅️ Back to Menu**
6. The message **edits back** to the start menu

This means:
- No extra messages in your chat
- Instant navigation (no waiting for new messages)
- You can explore all screens without leaving the chat

### Button Types

| Type | What Happens When Tapped |
|---|---|
| **URL buttons** (✚ Add to Channel, ☁️ Source Code) | Opens a link in your browser |
| **Callback buttons** (📚 Help, 🤖 About, 📊 Stats) | Edits the message to show new content |
| **⬅️ Back to Menu** | Returns to the start menu |

---

## How Reactions Work

### The Flow

1. A message arrives in a chat where the bot is present
2. The bot checks:
   - Is this chat in `RESTRICTED_CHATS` (env)? → Skip
   - Is this chat restricted at runtime (`/restrict`)? → Skip
   - Is this chat paused (`/pause`)? → Skip
   - Is the rate limit exceeded (30/min)? → Skip
3. The bot picks a random emoji from the reaction list
4. In groups: the bot checks the random level — should it react this time?
5. The bot sends the reaction via `setMessageReaction`

### Private Chats vs Groups

| Chat Type | Behavior |
|---|---|
| **Private** | Reacts to every message |
| **Group** | Reacts based on `RANDOM_LEVEL` |
| **Channel** | Reacts to every post |

### Per-Chat Custom Reactions

Each group can have its own set of emojis. When you use `/setreactions 😂 💀 🤣`, the bot remembers this for the current chat only. Other chats keep using the global `EMOJI_LIST`.

Custom reactions persist across restarts when a storage backend is available (file on Docker/Local, KV on Vercel). On Cloudflare Workers, they reset on each invocation.

### Rate Limiting

The bot reacts at most **30 times per minute per chat**. This prevents:
- Telegram API errors from too many reactions
- Spam in very active groups
- The bot from being flagged for abuse

If the limit is hit, reactions are silently skipped until the next minute window.

---

## How Stats Work

The `/stats` command shows a snapshot of the bot's activity. **Since v2.11.0**, stats persist across restarts — they show lifetime totals, not just the current session.

### What Each Stat Means

| Stat | What It Counts |
|---|---|
| **Messages Processed** | Every message the bot has seen (commands + regular messages) |
| **Reactions Sent** | Every successful reaction placed on a message |
| **Unique Chats** | How many different chats the bot has interacted with (session + total) |
| **Paused Chats** | How many groups currently have reactions paused |
| **Restricted Chats** | How many chats are restricted at runtime |
| **Storage** | Active storage backend (`upstash`, `vercel-kv`, `file`, or `memory`) |
| **Uptime** | Time since the bot last started |
| **Started** | The exact time the bot started |

### Command Usage

Shows how many times each command has been used:

```
📋 Command Usage:
/start — 15
/help — 8
/ping — 23
/stats — 12
/setreactions — 3
/pause — 1
```

### Top Chats Leaderboard

Shows which chats received the most reactions in the last 50 reactions:

```
🏆 Top Chats (last 50 reactions):
1. Anime Lovers Group — 18
2. Dev Chat — 12
3. My Channel — 8
4. Friends Group — 7
5. Test Group — 5
```

> **Note:** Stats persist across restarts when a storage backend is available (file on Docker/Local, Upstash Redis on Vercel). On Cloudflare Workers, stats reset on each invocation. This is by design — no persistent data means nothing to leak.

---

## How Broadcast Works

The `/broadcast` command lets you send a message to every chat the bot has ever interacted with.

### Step by Step

1. You type: `/broadcast Hello everyone! 👋`
2. The bot checks: is your user ID the `OWNER_ID`?
   - No → You see: "👑 This command is for the owner. You think you can just—? Дурак."
   - Cooldown active → You see: "⏳ Хмпф. Cooldown! Wait Xs. Don't Rush Me."
   - Yes → Continue
3. The bot says: "📡 Broadcasting..."
4. It loops through every unique chat ID:
   - Sends your message to each one
   - Counts successes and failures
5. The bot reports: "✅ Broadcast Complete! 📨 Sent: 47 ❌ Failed: 3"

### Cooldown

There is a **60-second cooldown** between broadcasts. If you try to broadcast again within 60 seconds, the bot tells you how long to wait.

### Who Receives It

Every chat where the bot has ever seen a message:
- Private chats
- Groups
- Channels

If the bot was kicked from a group, that group is still in the list but the send will fail (counted as a failure).

---

## Ad Library (AdLab)

The bot includes a built-in ad management library inspired by [AdLab](https://github.com/Shineii86/AdLab). It automatically appends a formatted ad footer to key bot responses (`/start`, `/help`, `/about`, `/donate`, `/stats`, `/reactions`).

### How It Works

1. A pool of promotional messages is stored in `api/ads.js`
2. When a command response is generated, one ad is picked at random
3. The ad is formatted as an HTML blockquote footer and appended to the message
4. The footer includes a separator line and a clickable attribution link

### Ad Pool

The default pool promotes @MaximX channels (Emojis, Stickers, Bots, Arts, Icons, Anime). To customize, edit the `advertisements` array in `api/ads.js`.

### Where Ads Appear

| Command | Ad Footer? |
|---|:---:|
| `/start` | ✅ |
| `/help` | ✅ |
| `/about` | ✅ |
| `/stats` | ✅ |
| `/reactions` | ✅ |
| `/donate` | ✅ |
| `/ping` | ❌ |
| `/broadcast` | ❌ |
| `/pause` / `/resume` | ❌ |
| `/setreactions` | ❌ |
| Callback queries (inline buttons) | ✅ |

### Technical Details

- Module: `api/ads.js`
- Functions: `getRandomAd()`, `getAdFooter()`, `getAdCount()`
- Parse mode: HTML (Telegram)
- Footer format: separator + bold "Ads:" label + blockquote with ad text
- No external dependencies
- Always active — no environment variables needed

---

## Photo Support

The bot can show a photo preview with its messages when `BOT_PHOTO` is configured. This makes the bot look more professional and branded.

### Setup

Set the `BOT_PHOTO` environment variable to a photo URL or Telegram file_id:

```
BOT_PHOTO=https://example.com/bot-photo.jpg
```

### How It Works

The bot uses Telegram's `link_preview_options` with `prefer_large_media: true` and `show_above_text: true` to display the photo as a large preview above the message text. This approach has key advantages:

- **No caption length limit** — messages use full text (max 4096 chars), not captions (max 1024 chars)
- **All buttons work everywhere** — messages are always text messages, so `editMessageText` works for all callbacks
- **No photo↔text transitions** — no need to switch between photo and text message types

Commands that show the photo preview:
- **`/start`** — Welcome message with photo preview
- **`/help`** — Help pages with photo preview
- **`/about`** — Bot info with photo preview
- **`/stats`** — Statistics with photo preview
- **`/reactions`** — Reaction list with photo preview
- **`/donate`** — Donation info with photo preview
- **Callback queries** — All button callbacks edit the message text with photo preview preserved

### Without BOT_PHOTO

If `BOT_PHOTO` is not set, all commands send regular text messages without link preview. The bot works perfectly fine without it.

---

## AI Chat

Starting from v2.15.3, Alisa can have real conversations using Google Gemini AI. She responds in her signature tsundere personality — proud, sharp-tongued, and secretly warm.

### How It Works

1. A user sends a message in a private chat (not a command)
2. The bot forwards it to Google Gemini with Alisa's personality prompt
3. Alisa responds in character — short, tsundere, with Russian sprinkled in
4. A mood-based sticker is sent alongside the response
5. A typing indicator shows before she replies

### Commands

| Command | Description | Access |
|---|---|---|
| `/ai` | Toggle AI chat on/off | Bot Owner |

### Enabling / Disabling

The bot owner can toggle AI chat globally:

```
/ai
```

**When enabled:**
```
🤖 Aɪ Cʜᴀᴛ Is Nᴏᴡ Eɴᴀʙʟᴇᴅ.
Gᴇᴍɪɴɪ Pᴏᴡᴇʀᴇᴅ. Dᴏɴ'ᴛ Gᴇᴛ Usᴇᴅ Tᴏ Mʏ Kɪɴᴅɴᴇss.
```

**When disabled:**
```
🤖 Aɪ Cʜᴀᴛ Is Nᴏᴡ Dɪsᴀʙʟᴇᴅ.
I Was Tɪʀᴇd Of Tᴀʟᴋɪɴɢ Tᴏ Yᴏᴜ Aɴʏᴡᴀʏ.
```

### Multi-Language Support

Alisa auto-detects the user's language and responds accordingly:

| User writes in | Alisa responds in |
|---|---|
| Russian | Russian (with occasional Japanese) |
| Japanese | Japanese (with occasional Russian) |
| English | English (with Russian sprinkled in) |
| Hinglish | Hinglish (with Russian sprinkled in) |

She always keeps the tsundere flavor regardless of language.

### Conversation Memory

Alisa remembers the **last 10 messages** per chat. This means:
- She can follow a conversation thread
- She remembers what you just said
- Context resets after 10 messages (privacy by design)

### Mood Stickers

Every AI response includes a mood-based sticker. Alisa's mood is detected from her response text:

| Mood | Trigger | Sticker |
|---|---|---|
| Tsundere | "Хмпф", "hmph", "N-Not" | Default tsundere sticker |
| Annoyed | "Идиот", "дурак", "baka", "fool" | Angry sticker |
| Grateful | "Спасибо", "thank", "аригато" | Happy sticker |
| Reluctant | "Хорошо", "ладно", "fine" | Reluctant sticker |
| Flustered | Both `!` and `?` in text | Blushing sticker |
| Thoughtful | `…` or `...` | Thinking sticker |
| Neutral | Default | Neutral sticker |

### Personality

Alisa's AI personality is defined by her character from *"Alya Sometimes Hides Her Feelings in Russian"*:

- **Tsundere** — outwardly sharp, secretly caring
- **Concise** — 1-3 sentences max, like a real chat
- **No emojis** — she's too dignified for that
- **Small caps** — uses Lɪᴋᴇ Tʜɪs for emphasis
- **Russian phrases** — naturally mixes in Хмпф, Хорошо, Дурак, etc.
- **Never breaks character** — won't mention being an AI

### Configuration

| Variable | Required | Description |
|---|---|---|
| `GEMINI_API_KEY` | Yes | Google Gemini API key ([Get one here](https://aistudio.google.com/apikey)) |

### Technical Details

| Setting | Value |
|---|---|
| Model | `gemini-2.5-flash` |
| Max tokens | `1024` |
| Temperature | `0.9` |
| Timeout | `8 seconds` |
| Memory window | Last 10 messages per chat |
| Module | `api/ai.js` |
| Sticker module | `api/stickers.js` |

### Without GEMINI_API_KEY

If `GEMINI_API_KEY` is not set, the AI chat feature is disabled. The bot still works for reactions and all other commands. No data is sent to Google.

---

## Close Button

Every inline keyboard now includes an ✖️ Close button alongside the ⬅️ Back to Menu button. Tapping Close deletes the message immediately — no confirmation needed.

### Where It Appears

- All command responses (`/ping`, `/pause`, `/resume`, `/setreactions`, `/randomlevel`, `/broadcast`, `/log`, `/leave`, `/chats`, `/setwebhook`, `/restrict`, `/unrestrict`)
- All callback query responses (Help, About, Stats, Donate)
- Error messages and validation messages

### Why Close?

- Keeps chats clean — users can dismiss bot messages instantly
- No need to manually delete messages
- Consistent UX across all commands

---

## Welcome & Leave Messages

Groups can automatically greet new members and farewell leaving members. This feature is **disabled by default** — admins must enable it per group.

### Commands

| Command | Description | Access |
|---|---|---|
| `/welcome` | Toggle welcome messages on/off | Group Admin |
| `/goodbye` | Toggle leave messages on/off | Group Admin |

### How Welcome Works

1. A new member joins the group
2. Bot deletes Telegram's default "X joined" notification
3. Bot sends a welcome message mentioning the new member by name
4. Message includes inline buttons (Developer, Stickers, Bots)
5. If `BOT_PHOTO` is set, the welcome is sent as a photo with caption

### How Leave Works

1. A member leaves the group
2. Bot deletes Telegram's default "X left" notification
3. Bot sends a farewell message with the member's name
4. Message includes inline buttons
5. If `BOT_PHOTO` is set, the farewell is sent as a photo with caption

### Enabling

Only group admins can toggle these features:

```
/welcome   →  Toggle welcome messages
/goodbye   →  Toggle leave messages
```

Each toggle is per-group and persists across restarts when a storage backend is available (file on Docker/Local, Upstash Redis on Vercel). On Cloudflare Workers, resets on each invocation.

### Welcome Message Example

```
🎀 Ахаха~ Wᴇʟᴄᴏᴍᴇ, John, Jane! 🎋
Yᴏᴜ'ᴠᴇ Sᴛᴇᴘᴘᴇᴅ Iɴᴛᴏ My Group. Tʀᴇᴀᴅ Cᴀʀᴇғᴜʟʟʏ.
I'ʟʟ Bᴇ Wᴀᴛᴄʜɪɴɢ… Аɴᴅ Rᴇᴀᴄᴛɪɴɢ. ✨
```

### Leave Message Example

```
👋 Хмпф… Gᴏᴏᴅʙʏᴇ, John.
My Group Wɪʟʟ Mᴀɴᴀɢᴇ Wɪᴛʜᴏᴜᴛ Yᴏᴜ.

До свидания. N-Not Tʜᴀᴛ I'ʟʟ Mɪss Yᴏᴜ.
```

### Stats

`/stats` shows how many groups have welcome and goodbye enabled:

```
👋 Wᴇʟᴄᴏᴍᴇ Eɴᴀʙʟᴇᴅ: 5
🚪 Gᴏᴏᴅʙʏᴇ Eɴᴀʙʟᴇᴅ: 3
```

## Persistent Chat Storage

Starting from v2.10.0, the bot can remember every chat it has interacted with across restarts. This powers the `/chats` command with full historical data and the `/stats` command with total chat counts.

### How It Works

The storage system (`api/store.js`) is **environment-aware** — it auto-detects the best available backend:

| Environment | Backend | Persistence | Setup |
|---|---|---|---|
| **Docker / Local** | File (`data/state.json`) | ✅ Survives restarts | None — automatic (volume-mounted) |
| **Render** | File (`data/state.json`) | ⚠️ Ephemeral on free tier | None — automatic |
| **Vercel + Upstash** | Upstash Redis (**free**) | ✅ Survives cold starts | Create free DB at upstash.com |
| **Vercel + KV** | Vercel KV (Redis, **paid**) | ✅ Survives cold starts | Create KV store in Vercel dashboard |
| **Vercel (no Redis)** | In-memory | ❌ Resets on cold start | Add Upstash for free persistence |
| **Cloudflare Workers** | In-memory | ❌ Resets on restart | By design — Workers have no filesystem |

### What Gets Stored

Each chat entry tracks:

```json
{
  "id": -1001234567890,
  "title": "Anime Lovers Group",
  "type": "supergroup",
  "firstSeen": 1715645200000,
  "lastSeen": 1715648800000,
  "messageCount": 1247
}
```

### Setting Up Upstash Redis (Free)

1. Go to [console.upstash.com](https://console.upstash.com) and sign up (free, no credit card)
2. Click **Create Database** — choose a name and region
3. Copy the **REST URL** and **REST TOKEN** from the database details page
4. Add them as environment variables in your deployment platform:
   - `UPSTASH_REDIS_REST_URL` — the REST URL
   - `UPSTASH_REDIS_REST_TOKEN` — the REST TOKEN
5. **Install the package:** `npm install @upstash/redis` (already in `optionalDependencies`)
6. Redeploy — the bot auto-detects Upstash and switches to it

> **Free tier:** 10,000 requests/day, 256MB storage. No credit card required.

### Setting Up Vercel KV (Paid)

1. Go to your Vercel project dashboard
2. Click **Storage** → **Create Database** → **KV (Redis)**
3. Vercel creates the store and injects `KV_REST_API_URL` + `KV_REST_API_TOKEN`
4. Redeploy — the bot auto-detects KV and switches to it

> **Note:** Vercel KV is a paid service (starts at $8/month). For free persistence, use Upstash Redis or Docker.

### Checking Storage Backend

The `/stats` command shows which storage backend is active:

```
💾 Sᴛᴏʀᴀɢᴇ: upstash      ← Upstash Redis (free, persistent)
💾 Sᴛᴏʀᴀɢᴇ: vercel-kv    ← Vercel KV (paid, persistent)
💾 Sᴛᴏʀᴀɢᴇ: file          ← Docker / Render / Local (persistent)
💾 Sᴛᴏʀᴀɢᴇ: memory        ← Cloudflare Workers / Vercel without Redis (non-persistent)
```

### What's In-Memory vs Persistent

| Data | In-Memory | Persistent |
|---|:---:|:---:|
| Chat registry (IDs, names, types, counts) | ✅ | ✅ |
| Per-chat custom reactions (`/setreactions`) | ✅ | ✅ |
| Paused chats (`/pause`) | ✅ | ✅ |
| Runtime restrictions (`/restrict`) | ✅ | ✅ |
| Welcome/leave toggles (`/welcome`, `/goodbye`) | ✅ | ✅ |
| Stats counters (messages, reactions, commands) | ✅ | ✅ |
| Per-chat random level overrides | ✅ | ❌ |
| Reaction log (last 50) | ✅ | ❌ |
| Chat names cache | ✅ | ❌ |
| Rate limit state | ✅ | ❌ |

> **Note:** All operational state persists across restarts on Docker/Local (file), Render (file), and Vercel (Upstash or KV). On Cloudflare Workers, everything is in-memory. Only transient caches (reaction log, rate limits, random level overrides) remain in-memory on all platforms.

---

## Security Features

### Webhook Secret

When `WEBHOOK_SECRET` is set (or auto-generated), the bot validates every incoming request. Telegram includes the secret in the `x-telegram-bot-api-secret-token` header. If the secret doesn't match, the request is rejected with a 403 error.

This prevents someone from sending fake updates to your bot.

**Auto-generation:** If you don't set `WEBHOOK_SECRET`, a random UUID is generated at startup. The webhook still works, but you must include this generated secret when setting the webhook via API.

**How to set it manually:**

1. Choose a secret string (e.g., generate one with `openssl rand -hex 32`)
2. Set it as the `WEBHOOK_SECRET` environment variable
3. Include it when setting the webhook:
   ```bash
   curl -X POST "https://api.telegram.org/botTOKEN/setWebhook" \
     -d '{"url": "https://your-url", "secret_token": "your_secret"}'
   ```

### Owner-Only Commands

Only the user whose ID matches `OWNER_ID` can use:
- `/broadcast` — Send messages to all chats
- `/leave` / `/remove` — Remove bot from any chat
- `/chats` — List all active chats
- `/restrict` / `/unrestrict` — Runtime chat restrictions
- `/setwebhook` — Set or view webhook configuration
- `/log` — View reaction history

Everyone else sees: "👑 This command is for the owner. You think you can just—? Дурак."

### Admin Permission Checks

Commands like `/setreactions`, `/pause`, and `/resume` check if the user is actually a group admin. The bot calls `getChatMember` to verify the user's status is `creator` or `administrator`. Regular members see: "🔒 Admin permissions required. Don't even try without them."

### Broadcast Cooldown

The `/broadcast` command has a **60-second cooldown** between uses to prevent accidental spam.

### Runtime Restrictions

The owner can restrict chats at runtime using `/restrict`. These restrictions:
- Work alongside env-based `RESTRICTED_CHATS`
- Persist in memory until restart
- Are shown in `/chats` (🚫 indicator) and `/stats`
- Can be removed with `/unrestrict`
- Are cleaned up automatically when using `/leave`

### Request Size Limit

The bot rejects webhook payloads larger than 1MB. This prevents memory exhaustion attacks.

---

## Troubleshooting

### Bot doesn't react to messages

**Check these:**
1. Is the bot added to the chat? → Add it
2. Is the chat in `RESTRICTED_CHATS`? → Remove it from the env variable
3. Is the chat restricted at runtime? → Use `/unrestrict <chat_id>` or check `/chats`
4. Is the chat paused? → Send `/resume`
5. Is `RANDOM_LEVEL` set to 10? → Lower it
6. Is `EMOJI_LIST` set? → Check your environment variables
7. Is the webhook set? → Use `/setwebhook` to check

### Bot reacts but very slowly

- Check your deployment region — closer to Telegram servers = faster
- Cloudflare Workers: ensure the worker is deployed, not just saved
- Docker: check server location and network

### /start doesn't show buttons

- Make sure you're sending the command in a **private chat** with the bot
- In groups, the bot responds to `/start` but inline buttons work best in private chats
- Check that `BOT_USERNAME` is set correctly

### /broadcast says "owner only"

- Make sure `OWNER_ID` is set in your environment variables
- Make sure the value matches your Telegram user ID exactly
- Get your ID from @userinfobot

### /broadcast says "cooldown"

- Wait 60 seconds between broadcasts
- This is a safety feature to prevent spam

### /setreactions says "group only"

- This command only works in groups and supergroups
- Send it in a group chat, not in a private chat with the bot

### /pause says "requires admin permissions"

- You need to be a group creator or administrator
- Regular members cannot pause reactions

### /leave says "invalid chat ID"

- Chat IDs must be numeric (e.g., `-1001234567890`)
- Include the `-` prefix for groups and channels

### /setwebhook fails

- URL must start with `https://`
- Check that your worker is deployed and accessible
- Check the `/setwebhook` output for error details

### Webhook shows errors in getWebhookInfo

Common issues:
- **Wrong URL** — Double-check your worker URL
- **Not deployed** — Make sure the worker is actually running
- **Secret mismatch** — `WEBHOOK_SECRET` must match the `secret_token` in setWebhook
- **SSL issues** — Telegram requires HTTPS

### Bot works locally but not in production

- Make sure the webhook is set to your **production URL**, not localhost
- Check that environment variables are set in your deployment platform
- Check the deployment logs for errors

---

## Frequently Asked Questions

### Does the bot store my messages?

No. The bot only stores counters and chat IDs. Messages are never saved, logged, or transmitted anywhere.

**Since v2.10.0:** The bot persists a chat registry (ID, name, type, message count) to track which chats it has interacted with. On Docker/Local, this uses `data/state.json`. On Vercel, this uses Upstash Redis (free) or Vercel KV (paid). On Cloudflare Workers, data is in-memory only. No message content is ever stored — only metadata.

### Can I use multiple emoji lists for different groups?

Yes! Use `/setreactions` in each group. Each group gets its own emoji set. Other groups keep using the global `EMOJI_LIST`.

### Does the bot work in supergroups?

Yes. Supergroups are treated the same as regular groups — the bot reacts based on `RANDOM_LEVEL`.

### Can I add the bot to a channel?

Yes. Add the bot as a channel admin with the "Post Messages" permission. It will react to every post.

### What happens when the bot restarts?

**Persistent data (survives restarts):**
- Chat registry (IDs, names, types, message counts)
- Per-chat custom reactions (`/setreactions`)
- Paused chats (`/pause`)
- Runtime restrictions (`/restrict`)
- Welcome/leave toggles (`/welcome`, `/goodbye`)
- Stats counters (messages processed, reactions sent, command usage)

**In-memory data (resets on restart):**
- Per-chat random level overrides (`/randomlevel`)
- Reaction log (last 50 reactions)
- Chat names cache
- Rate limit state

> **Note:** On Vercel without Redis, ALL data resets on cold starts. On Cloudflare Workers, ALL data resets on each invocation (Workers have no filesystem). Add Upstash Redis (free) for persistence on Vercel. See [Persistent Chat Storage](#persistent-chat-storage).

This is by design for privacy.

### How much does it cost?

Free for most setups:
- **Cloudflare Workers:** 100,000 requests/day — free
- **Docker:** Self-hosted on any VPS — free
- **Upstash Redis:** 10,000 requests/day, 256MB — free (for Vercel persistence)
- **Render:** Free tier available (ephemeral disk)
- **Railway:** Free trial with usage limits
- **Vercel KV:** Paid (starts at $8/month) — only needed if you don't use Upstash

For free persistent storage on Vercel, use Upstash Redis. For self-hosted, use Docker.

### Can I use this bot with multiple bot tokens?

No. Each deployment uses one `BOT_TOKEN`. If you want multiple bots, deploy multiple instances.

### How do I update the bot?

Pull the latest code and redeploy:

```bash
git pull origin main
wrangler deploy        # Cloudflare
vercel --prod          # Vercel
docker-compose up -d   # Docker
```

### Can I remove the bot from a group I don't admin?

Yes! Use `/leave <chat_id>` or `/remove <chat_id>`. The bot leaves the chat on its own — you don't need any rights in that chat.

### What's the difference between RESTRICTED_CHATS and /restrict?

| | `RESTRICTED_CHATS` | `/restrict` |
|---|---|---|
| Set via | Environment variable | Telegram command |
| Who can set it | Server admin | Bot owner |
| Persists across restarts | ✅ Yes | ❌ No |
| Can be changed at runtime | ❌ No | ✅ Yes |

You can use both — the bot checks both sources.

---

<div align="center">

**Need more help?** [Open an Issue](https://github.com/Shineii86/AlisaReactionBot/issues) · [Contact Developer](https://t.me/Shineii86)

</div>
