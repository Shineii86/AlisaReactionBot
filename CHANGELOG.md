# Changelog

All notable changes to Alisa Reaction Bot are documented here.

---

## [v2.12.0] — 2026-05-15

### 🐛 Bug Fixes

- **Fixed menu buttons not working with BOT_PHOTO** — Help and About messages (1865 and 1295 chars) exceed Telegram's 1024-character caption limit. When `BOT_PHOTO` was set, `editMessageCaption` failed silently and the fallback also failed.
  - **Help now paginated** — Split into 3 pages (Basic Commands, Admin Commands, Plugins) with ◁ Prev / Nᴇxᴛ ▷ navigation buttons. All pages edit in place via callback.
  - `editMsg` helper now checks caption length — uses delete + sendMessage when text exceeds 1024 chars.

- **Fixed callback buttons sending new messages instead of editing** — Inline buttons (📚 Help, 💫 Reactions, 🤖 About, 📊 Stats, 🎁 Donate, etc.) were sending new messages instead of editing the existing message when `BOT_PHOTO` was configured.
  - **Root cause**: The `editMsg` helper in the callback handler decided edit method based on `botPhoto` (env var) instead of the actual message type (`cq.message.photo`). When `editMessageCaption` failed (e.g., caption too long, or message was actually text), the catch block called `sendMessage` — creating a duplicate message instead of editing.
  - **Fix**: `editMsg` now checks the actual message type (`cq.message.photo`) to determine whether to use `editMessageCaption` or `editMessageText`. If the first method fails, it tries the other method before falling back to delete + send new (preventing duplicate messages).
  - Affected callbacks: `cb_help`, `cb_about`, `cb_stats`, `cb_donate`, `cb_reactions`, `!admin`.

- **Fixed plugin loader running on every request** — `loadPlugins()` had no idempotency guard, causing duplicate plugin registrations and log spam on every webhook request. Added `pluginsLoaded` flag to ensure plugins load only once.

- **Added sendPhoto fallback for all commands** — All commands using `sendPhoto` (`/start`, `/stats`, `/reactions`, `/donate`, welcome/goodbye messages) now gracefully fall back to `sendMessage` if the photo fails to send. Previously, a failed `sendPhoto` would propagate the error and the user received nothing.

### ✨ Plugins

- **AniNews Plugin** (`plugins/aninews.js`) — Anime news from 7 sources powered by [AniNewsAPI](https://github.com/Shineii86/AniNewsAPI).

- **AniList Plugin** (`plugins/anilist.js`) — Anime, manga & characters via AniList GraphQL API.
  - `/anilist <query>` — Search anime with cover art
  - `/anilistmanga <query>` — Search manga
  - `/anichar <query>` — Search characters with portraits
  - `/anitrending` — Trending anime
  - `/aniseason` — Current seasonal anime with season picker
  - Inline buttons: detail view with cover, character portraits, season filter, AniList link
  - Score bars, studio info, character lists, airing schedule
  - Free, no auth, unlimited

- **Kitsu Plugin** (`plugins/kitsu.js`) — Anime & manga via Kitsu JSON:API.
  - `/kitsu <query>` — Search anime with cover art
  - `/kitsumanga <query>` — Search manga
  - `/kitsutrending` — Trending anime
  - `/kitcategories` — Browse categories
  - Inline buttons: detail view with cover/poster, back navigation
  - Free, no auth

- **Manga Plugin** (`plugins/manga.js`) — Manga, manhwa & webtoon data powered by [ShineiAPI](https://github.com/Shineii86/ShineiAPI).
  - `/manga <query>` — Full-text search across thousands of series
  - `/mangapopular` — Popular manga/manhwa with type filter buttons
  - `/mangatop` — Top rated series
  - `/mangarandom` — Random discovery with cover art
  - `/mangaschedule [day]` — Release schedule with day picker
  - `/mangagenres` — Browse available genres
  - Inline buttons: series detail with cover, chapter list, type filter, day selector, random refresh
  - Cover images displayed for series detail and random discovery
  - Rich metadata: rating, chapters, authors, artists, genres, status, synopsis
  - Styled with box-drawing characters and source emojis
  - Zero auth, free, 60 req/min
  - `/animenews` or `/aninews` — Latest anime news with pagination
  - `/anisearch <query>` — Full-text search with relevance scoring
  - `/anitags` — List available news tags
  - Inline buttons: pagination (Prev/Next), source filter (All/CR/ANN/MAL), numbered article buttons, full article view
  - Sources: Anime News Network, Anime Corner, MyAnimeList, Crunchyroll, Otaku USA, Anime Herald, Comic Book
  - Smart caching via API (~200ms responses, 10-min auto-refresh)

### 📝 Docs

- **README.md** — Updated features (plugin system), commands table (18 plugin commands), project structure (plugin-loader.js, plugins/), architecture memory model, latest version description.
- **GUIDE.md** — Added full Plugin System section covering: how it works, built-in plugins list, managing plugins, installing/removing, removing the system completely, creating plugins, context object, external APIs, photos, error handling, naming conventions, and tips.
- **landing.js** — Added Plugin System feature card with puzzle icon, version badge with plugin tag.

### ✨ Improvements

- **Plugins button in Help menu** — New 🔌 Plugins button in the help keyboard shows all installed plugins with status, descriptions, and commands. Help message updated with plugin command references.

- **Plugin System** — Extensible architecture for adding custom commands and features without modifying core code.
  - New `api/plugin-loader.js` — auto-discovers `.js` files in `plugins/` directory.
  - Each plugin exports: `name`, `description`, `commands`, `callbacks`, `onCommand()`, `onCallback()`.
  - Plugins receive a context object with `botApi`, `Store`, `chatId`, `userId`, keyboard builders.
  - Plugin errors are caught and reported to the user without crashing the bot.
  - New `/plugins` command — list all installed plugins with status and commands.
  - New `/plugins toggle <name>` — enable/disable plugins at runtime (owner only).
  - Files prefixed with `_` are skipped (use for templates/disabled plugins).
  - New `plugins/_example.js` — template plugin with all available hooks documented.
  - New `plugins/README.md` — plugin development guide.

- **Auto-cleanup on command usage** — When a user sends a command, the bot now automatically deletes both the user's command message and the previous bot response before sending the new response. Keeps chats clean without manual cleanup.
  - Tracks last bot message ID per chat (runtime only, resets on restart).
  - Works for all commands: `/start`, `/help`, `/about`, `/ping`, `/stats`, `/reactions`, `/donate`, `/setreactions`, `/pause`, `/resume`, `/randomlevel`, `/broadcast`, `/log`, `/leave`, `/remove`, `/chats`, `/setwebhook`, `/restrict`, `/unrestrict`, `/welcome`, `/goodbye`.
  - Gracefully handles delete failures (e.g., missing permissions in groups).

---

## [v2.12.0] — 2026-05-14

### ✨ New Features

- **Added Upstash Redis support** — Free Redis storage for Vercel deployments (10,000 req/day, 256MB, no credit card). Drop-in alternative to paid Vercel KV.
  - New `@upstash/redis` optional dependency in `package.json`.
  - Store auto-detects: Upstash (free) > Vercel KV (paid) > File > Memory.
  - Set `UPSTASH_REDIS_REST_URL` + `UPSTASH_REDIS_REST_TOKEN` env vars to enable.
  - Sign up free at [console.upstash.com](https://console.upstash.com).

### 🔧 Changes

- **Removed false free tier claims for Vercel KV** — Corrected documentation across all files. Vercel KV (Redis) is a **paid service** (starts at $8/month), not free. For free persistent storage, use Upstash Redis or Docker.

---

## [v2.12.0] — 2026-05-14

### 🐛 Bug Fixes

- **Fixed Cloudflare Workers deployment crash** — `store.js` had static `import { readFileSync } from 'fs'` at the top level, which Cloudflare Workers cannot bundle. This caused `wrangler deploy` to fail with module resolution errors. Fixed by:
  - Replaced static `fs`/`path`/`url` imports with dynamic `import()` inside a guarded `loadNodeModules()` function.
  - Added `isNode` runtime detection — Node.js-specific code (file I/O, `process.env`, `__dirname`) only executes in Node.js environments.
  - Cloudflare Workers now correctly falls back to in-memory storage without crashing.
  - All other modules (`helper.js`, `ads.js`, `constants.js`, `TelegramBotAPI.js`, `landing.js`) are pure JS — no Node.js deps.

- **Fixed example wrangler.toml wrong entry point** — `example.wrangler.toml` had `main = "src/index.js"` (non-existent path). Corrected to `main = "api/worker.js"`. Users copying the example file would get deployment failures.

### 🔧 Changes

- **Added `nodejs_compat` flag** — Added `compatibility_flags = ["nodejs_compat"]` to both `wrangler.toml` and `example.wrangler.toml` for broader Node.js API compatibility on Cloudflare Workers.
- Store now gracefully detects runtime environment: Node.js → file/KV storage, Workers → in-memory.
- `load()` is idempotent and environment-aware — works identically across all platforms.

### 📦 Deployment Platform Status

| Platform | Storage | Persistence | Config Needed |
|---|---|---|---|
| Docker | File (`data/state.json`) | ✅ Volume-mounted | None |
| Local | File (`data/state.json`) | ✅ Disk | None |
| Render | File (`data/state.json`) | ⚠️ Ephemeral on free tier | None |
| Vercel | Upstash (free) / KV (paid) / in-memory | ✅ With Redis / ❌ Without | Upstash or KV env vars |
| Cloudflare Workers | In-memory | ❌ Resets per instance | None |

---

## [v2.12.0] — 2026-05-14

### 🐛 Bug Fixes

- **Fixed start message not showing ads on menu navigation** — The `cb_menu` callback (Back to Menu button) was not wrapping the start message with `getAdFooter()`, so ads were missing when users navigated back to the start screen via inline buttons. Now all entry points to the start message consistently include the ad footer.

### 🔧 Changes

- **Storage clarification — Vercel KV is free** — Vercel KV (Redis) uses the **free Hobby tier** (3,000 req/day, 256MB storage, no credit card). It is kept as an optional dependency for serverless persistence. When `KV_REST_API_URL` and `KV_REST_API_TOKEN` are not set, the bot falls back to file storage (`data/state.json`) or in-memory (non-persistent).
  - `@vercel/kv` remains in `optionalDependencies` — only installed when available.
  - Docker/Render/Local: uses `data/state.json` (file storage, zero config).
  - Vercel: uses KV when configured, otherwise in-memory fallback.
  - Cloudflare Workers: in-memory only (no filesystem, no Store import).

- **Docker data persistence** — Added volume mount (`./data:/app/data`) to `docker-compose.yml` so state persists across `docker-compose down/up` cycles, not just container restarts.

---

## [v2.12.0] — 2026-05-14

### ⚡ Performance — Batched Saves

- **Writes are now debounced** — state changes accumulate in memory and flush to storage at most once every 5 seconds, instead of on every single event.
  - Reduces Vercel KV writes dramatically (from hundreds/minute to ~12/minute max).
  - Reduces disk I/O for file-based deployments.
  - `scheduleSave()` marks state dirty and schedules a delayed write.
  - `flush()` does an immediate write — used on shutdown and critical moments.

### 🛡️ Robustness — Graceful Shutdown

- **SIGTERM/SIGINT handlers** — bot now flushes all pending state to storage before exiting.
  - Prevents data loss when Vercel kills a function or Docker stops the container.
  - `uncaughtException` handler also triggers a flush before crash-exit.
  - Store initialized at startup in `index.js` (in addition to bot-handler's idempotent load).

### 🔧 Changes

- `api/store.js` — Replaced direct `save()` with `scheduleSave()` (debounced, 5s window). Added `flush()` for immediate write on shutdown. Exported `flush`. Version bumped to v2.12.0.
- `api/index.js` — Added Store import, `Store.load()` at startup, SIGTERM/SIGINT/uncaughtException handlers with `Store.flush()`. Version bumped to v2.12.0.
- `api/bot-handler.js` — Version bumped to v2.12.0.
- `api/constants.js` — Version bumped to v2.12.0.
- `package.json` — Version bumped to v2.12.0.
- `CHANGELOG.md` — v2.12.0 entry added.

---

## [v2.11.0] — 2026-05-14

### ✨ Full State Persistence

- **All in-memory state now persists across restarts** via the Store (Vercel KV or file storage).
  - **Per-chat custom reactions** (`/setreactions`) — survives restarts.
  - **Paused chats** (`/pause`, `/resume`) — survives restarts.
  - **Runtime restrictions** (`/restrict`, `/unrestrict`) — survives restarts.
  - **Welcome/leave toggles** (`/welcome`, `/goodbye`) — survives restarts.
  - **Stats counters** (messages processed, reactions sent, command usage) — survives restarts.
  - `/stats` now shows global lifetime stats, not just current session.
  - `/leave` and `/remove` clean up all related persistent data (reactions, paused, restricted, welcome, goodbye).

### 🔧 Changes

- `api/store.js` — Major rewrite. Single `state` object with sections for chats, reactions, paused, restricted, welcome, goodbye, stats. Added 20+ new methods: getReaction, setReaction, deleteReaction, isPaused, pauseChat, resumeChat, isRestricted, restrictChat, unrestrictChat, isWelcomeEnabled, isGoodbyeEnabled, toggleWelcome, toggleGoodbye, getStats, trackMessage, trackReaction, trackCommand. Version bumped to v2.11.0.
- `api/bot-handler.js` — Removed all in-memory state (pausedChats, perChatReactions, restrictedChatsRuntime, welcomeEnabled, leaveEnabled, stats). Replaced with Store method calls throughout. All command handlers now use persistent store. Version bumped to v2.11.0.
- `package.json` — Version bumped to v2.11.0.
- `CHANGELOG.md` — v2.11.0 entry added.

---

## [v2.10.0] — 2026-05-14

### ✨ Persistent Chat Tracking

- **Added persistent chat storage** — Bot now remembers every chat it has interacted with across restarts.
  - **Environment-aware storage**: auto-detects Vercel KV (Redis) or falls back to local file storage (`data/chats.json`).
  - New `api/store.js` module with unified API: load, save, updateChat, removeChat, getAllChats, getChatCount, getChatsByType, hasChat.
  - Tracks: chat ID, title, type (group/supergroup/channel/private), first seen, last seen, total message count.
  - `/chats` command now shows **all historical chats** (not just current session), sorted by type with emoji indicators (👥📢💬) and message counts.
  - `/stats` now displays both session and total persistent chat counts, plus active storage backend.
  - `/leave` and `/remove` commands clean up the persistent store when the bot leaves a chat.

### 🔧 Changes

- `api/store.js` — New environment-aware persistence module. Uses `@vercel/kv` (Redis) when `KV_REST_API_URL` and `KV_REST_API_TOKEN` are set; otherwise uses local `data/chats.json`.
- `api/bot-handler.js` — Integrated Store into chat tracking lifecycle (async). Updated `/chats`, `/stats`, `/leave`, `/remove` to use persistent data. Version bumped to v2.10.0.
- `.env.example` — Added Vercel KV environment variable documentation.
- `.gitignore` — Added `data/` directory to exclusions (runtime data, not source).
- `package.json` — Added `@vercel/kv` as optional dependency. Version bumped to v2.10.0.
- `CHANGELOG.md` — v2.10.0 entry added.

### 📦 Vercel Setup

To enable persistent storage on Vercel:
1. Go to your project dashboard → **Storage** → **Create Database** → **KV (Redis)**
2. Vercel auto-injects `KV_REST_API_URL` and `KV_REST_API_TOKEN`
3. Redeploy — done

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
