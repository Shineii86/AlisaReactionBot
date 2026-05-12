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
12. [Owner Commands](#owner-commands)
13. [Inline Button Navigation](#inline-button-navigation)
14. [How Reactions Work](#how-reactions-work)
15. [How Stats Work](#how-stats-work)
16. [How Broadcast Works](#how-broadcast-works)
17. [Security Features](#security-features)
18. [Troubleshooting](#troubleshooting)
19. [Frequently Asked Questions](#frequently-asked-questions)

---

## What Is Alisa?

Alisa is a Telegram bot that automatically reacts to messages with emoji. You add her to a chat, and she quietly drops fitting reactions on messages — making conversations more lively.

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

The `wrangler.toml` file tells Cloudflare how to deploy your worker. You don't need to change anything in it for basic deployment.

**Step 5: Add secrets**

Secrets are environment variables that are encrypted. Use these for sensitive values:

```bash
wrangler secret put BOT_TOKEN
# Paste your bot token when prompted

wrangler secret put WEBHOOK_SECRET
# Paste your webhook secret when prompted (optional)
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

After deploying, you need to tell Telegram where to send updates. This is called setting a webhook.

### Basic Webhook

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker-url.workers.dev"}'
```

Replace:
- `YOUR_BOT_TOKEN` with your actual bot token
- `https://your-worker-url.workers.dev` with your actual worker URL

### Webhook with Secret (Recommended)

If you set `WEBHOOK_SECRET` in your environment variables, include it when setting the webhook:

```bash
curl -X POST "https://api.telegram.org/botYOUR_BOT_TOKEN/setWebhook" \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker-url.workers.dev", "secret_token": "your_webhook_secret"}'
```

### Verify the Webhook

Check if the webhook is set correctly:

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

```bash
curl "https://api.telegram.org/botYOUR_BOT_TOKEN/deleteWebhook"
```

---

## Environment Variables Explained

### Required Variables

| Variable | What It Does | Example |
|---|---|---|
| `BOT_TOKEN` | Your Telegram bot token from @BotFather | `1234567890:ABCdef...` |
| `BOT_USERNAME` | Your bot's username (without @) | `AlisaReactionBot` |
| `EMOJI_LIST` | Emojis the bot uses for reactions | `👍❤🔥🥰👏😁🎉🤩🙏` |

### Optional Variables

| Variable | What It Does | Default | Example |
|---|---|---|---|
| `RANDOM_LEVEL` | How often the bot reacts in groups (0-10) | `0` (always) | `5` |
| `RESTRICTED_CHATS` | Chat IDs where the bot never reacts | None | `-100123,456789` |
| `OWNER_ID` | Telegram user ID for owner-only commands | None | `123456789` |
| `WEBHOOK_SECRET` | Secret token for webhook validation | None | `a1b2c3d4...` |
| `PORT` | Server port for Docker/VPS | `3000` | `8080` |

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

---

## Using the Bot

### Starting the Bot

Send `/start` to the bot. You'll see a welcome message with inline buttons:

```
👋 Oʜ? Hᴇʟʟᴏ, [Your Name].

Sᴏ Yᴏᴜ Sᴛᴀʀᴛᴇᴅ Mᴇ. Nᴏᴛ Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Oʀ Aɴʏᴛʜɪɴɢ.

🎊 Wᴇʟᴄᴏᴍᴇ Tᴏ Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ ✨
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

📌 Dᴇғᴀᴜʟᴛ ɢʟᴏʙᴀʟ sᴇᴛ.
```

### Checking Latency

Send `/ping` to see how fast the bot responds:

```
🏓 Pᴏɴɢ!

⏱️ Rᴇsᴘᴏɴsᴇ: 47ms
🕐 Mon, 12 May 2025 12:45:00 GMT
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
✅ Rᴇᴀᴄᴛɪᴏɴs Uᴘᴅᴀᴛᴇᴅ Fᴏʀ Tʜɪs Cʜᴀᴛ!

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
⏸️ Aᴜᴛᴏ-Rᴇᴀᴄᴛɪᴏɴs ᴘᴀᴜsᴇᴅ Iɴ Tʜɪs Cʜᴀᴛ.
Usᴇ /resume Tᴏ Rᴇsᴜᴍᴇ.
```

The bot stays in the group but stops reacting. It still responds to commands.

### /resume — Start Reactions Again

Ready to bring reactions back?

```
/resume
```

The bot confirms:

```
▶️ Aᴜᴛᴏ-Rᴇᴀᴄᴛɪᴏɴs ʀᴇsᴜᴍᴇᴅ Iɴ Tʜɪs Cʜᴀᴛ.
```

If reactions weren't paused, it says:

```
ℹ️ Rᴇᴀᴄᴛɪᴏɴs Aʀᴇ Nᴏᴛ Pᴀᴜsᴇᴅ Iɴ Tʜɪs Cʜᴀᴛ.
```

---

## Owner Commands

These commands only work for the user whose ID matches `OWNER_ID`.

### /broadcast — Message All Chats

Send a message to every chat the bot has ever been in:

```
/broadcast Hey everyone! 🎉 The bot just got a major update with new features. Check /help for details!
```

The bot first says:

```
📡 Bʀᴏᴀᴅᴄᴀsᴛɪɴɢ...
```

Then reports the results:

```
✅ Bʀᴏᴀᴅᴄᴀsᴛ Cᴏᴍᴘʟᴇᴛᴇ!

📨 Sᴇɴᴛ: 47
❌ Fᴀɪʟᴇᴅ: 3
```

**Tips:**
- You can use Markdown formatting: **bold**, *italic*, `code`
- Failed sends are chats where the bot was kicked or the chat was deleted
- The broadcast goes to every unique chat ID the bot has seen since last restart

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

This helps you see which chats are getting the most reactions.

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
   - Is this chat restricted? → Skip
   - Is this chat paused? → Skip
   - Is the rate limit exceeded? → Skip
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

Custom reactions are stored in memory and reset when the bot restarts.

### Rate Limiting

The bot reacts at most **30 times per minute per chat**. This prevents:
- Telegram API errors from too many reactions
- Spam in very active groups
- The bot from being flagged for abuse

If the limit is hit, reactions are silently skipped until the next minute window.

---

## How Stats Work

The `/stats` command shows a snapshot of the bot's activity since the last restart.

### What Each Stat Means

| Stat | What It Counts |
|---|---|
| **Messages Processed** | Every message the bot has seen (commands + regular messages) |
| **Reactions Sent** | Every successful reaction placed on a message |
| **Unique Chats** | How many different chats the bot has interacted with |
| **Paused Chats** | How many groups currently have reactions paused |
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

> **Note:** All stats are in-memory. They reset when the bot restarts. This is by design — no persistent data means nothing to leak.

---

## How Broadcast Works

The `/broadcast` command lets you send a message to every chat the bot has ever interacted with.

### Step by Step

1. You type: `/broadcast Hello everyone! 👋`
2. The bot checks: is your user ID the `OWNER_ID`?
   - No → You see: "👑 This command is only available to the bot owner."
   - Yes → Continue
3. The bot says: "📡 Broadcasting..."
4. It loops through every unique chat ID:
   - Sends your message to each one
   - Counts successes and failures
5. The bot reports: "✅ Broadcast Complete! 📨 Sent: 47 ❌ Failed: 3"

### What Gets Broadcasted

- Your message text (after `/broadcast `)
- Markdown formatting is preserved (**bold**, *italic*, etc.)
- The message is prefixed with `📢 Broadcast:`

### Who Receives It

Every chat where the bot has ever seen a message:
- Private chats
- Groups
- Channels

If the bot was kicked from a group, that group is still in the list but the send will fail (counted as a failure).

---

## Security Features

### Webhook Secret

When you set `WEBHOOK_SECRET`, the bot validates every incoming request. Telegram includes the secret in the `x-telegram-bot-api-secret-token` header. If the secret doesn't match, the request is rejected with a 403 error.

This prevents someone from sending fake updates to your bot.

**How to set it:**

1. Choose a secret string (e.g., generate one with `openssl rand -hex 32`)
2. Set it as the `WEBHOOK_SECRET` environment variable
3. Include it when setting the webhook:
   ```bash
   curl -X POST "https://api.telegram.org/botTOKEN/setWebhook" \
     -d '{"url": "https://your-url", "secret_token": "your_secret"}'
   ```

### Owner-Only Commands

Only the user whose ID matches `OWNER_ID` can use `/broadcast` and `/log`. Everyone else sees: "👑 This command is only available to the bot owner."

### Admin Permission Checks

Commands like `/setreactions`, `/pause`, and `/resume` check if the user is actually a group admin. The bot calls `getChatMember` to verify the user's status is `creator` or `administrator`. Regular members see: "🔒 This command requires group admin permissions."

### Request Size Limit

The bot rejects webhook payloads larger than 1MB. This prevents memory exhaustion attacks.

---

## Troubleshooting

### Bot doesn't react to messages

**Check these:**
1. Is the bot added to the chat? → Add it
2. Is the chat in `RESTRICTED_CHATS`? → Remove it
3. Is the chat paused? → Send `/resume`
4. Is `RANDOM_LEVEL` set to 10? → Lower it
5. Is the webhook set? → Check with `getWebhookInfo`
6. Is the bot token correct? → Check your environment variables

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

### /setreactions says "group only"

- This command only works in groups and supergroups
- Send it in a group chat, not in a private chat with the bot

### /pause says "requires admin permissions"

- You need to be a group creator or administrator
- Regular members cannot pause reactions

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

No. The bot only stores counters and chat IDs in memory. Messages are never saved, logged, or transmitted anywhere. When the bot restarts, all state is lost.

### Can I use multiple emoji lists for different groups?

Yes! Use `/setreactions` in each group. Each group gets its own emoji set. Other groups keep using the global `EMOJI_LIST`.

### Does the bot work in supergroups?

Yes. Supergroups are treated the same as regular groups — the bot reacts based on `RANDOM_LEVEL`.

### Can I add the bot to a channel?

Yes. Add the bot as a channel admin with the "Post Messages" permission. It will react to every post.

### What happens when the bot restarts?

All in-memory state is lost:
- Stats counters reset to 0
- Per-chat custom reactions reset to default
- Paused chats unpause
- Reaction log clears
- Chat names cache clears

This is by design for privacy.

### How much does it cost?

Free. Cloudflare Workers free tier gives you 100,000 requests per day. Each Telegram update is one request. For most bots, this is more than enough.

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

---

<div align="center">

**Need more help?** [Open an Issue](https://github.com/Shineii86/AlisaReactionBot/issues) · [Contact Developer](https://t.me/Shineii86)

</div>
