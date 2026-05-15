# 🔌 Plugins

Drop `.js` files here to extend Alisa without touching core code.

## Quick Start

1. Copy `_example.js` → `my-plugin.js`
2. Edit the exported object (name, commands, handlers)
3. Restart the bot — auto-loaded

## Plugin Interface

```javascript
export default {
    name: 'my-plugin',           // Required — unique identifier
    description: 'What it does',  // Required — shown in /plugins
    version: '1.0.0',            // Optional
    author: 'You',                // Optional

    commands: ['/mycommand'],     // Commands this plugin handles
    callbacks: ['myprefix_'],     // Callback data prefixes

    async init() { },             // Called once on load

    async onCommand(cmd, args, ctx) {
        // cmd = '/mycommand'
        // args = 'everything after the command'
        // ctx = { chatId, userId, messageId, chatType, botApi, Store, keyboard }
    },

    async onCallback(data, ctx) {
        // data = full callback_data string
        // ctx.callbackQueryId = for answerCallbackQuery
    },
};
```

## Context Object

| Field | Type | Description |
|---|---|---|
| `chatId` | number | Current chat ID |
| `userId` | number | Sender's user ID |
| `messageId` | number | Current message ID |
| `chatType` | string | `'private'` / `'group'` / `'supergroup'` / `'channel'` |
| `botApi` | TelegramBotAPI | API wrapper (sendMessage, editMessageText, etc.) |
| `callbackQueryId` | string | For `answerCallbackQuery()` |
| `Store` | object | Persistent store (getReaction, setReaction, etc.) |
| `keyboard` | object | `{ close(), back(), menu(userId, ownerId) }` |

## Naming Convention

| File | Loads? | Why |
|---|---|---|
| `anime-news.js` | ✅ | Normal plugin |
| `manhwa.js` | ✅ | Normal plugin |
| `_example.js` | ❌ | Starts with `_` — skipped |
| `readme.md` | ❌ | Not `.js` |

Prefix files with `_` to disable them without deleting.

## Commands

- `/plugins` — List all installed plugins and their status
- `/plugins toggle <name>` — Enable/disable a plugin (owner only)

## Tips

- Each plugin is isolated — one crashing doesn't affect others
- Commands are first-come-first-served (don't overlap with core commands)
- Keep plugin files small and focused
- Use `ctx.keyboard.close()` for a close button on responses
