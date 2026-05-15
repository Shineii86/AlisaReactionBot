/*
 * ══════════════════════════════════════════════════════════════
 *  📝 PLUGIN TEMPLATE — Copy this file to create a new plugin
 * ══════════════════════════════════════════════════════════════
 *
 *  1. Copy this file → plugins/my-plugin.js
 *  2. Fill in the fields below
 *  3. Restart the bot — plugin auto-loads
 *
 *  Context object passed to handlers contains:
 *    {
 *      chatId,          — Current chat ID
 *      userId,          — Sender's user ID
 *      messageId,       — Current message ID
 *      chatType,        — 'private' | 'group' | 'supergroup' | 'channel'
 *      botApi,          — TelegramBotAPI instance (sendMessage, editMessageText, etc.)
 *      callbackQueryId, — Callback query ID (for answerCallbackQuery)
 *      Store,           — Persistent store (getReaction, setReaction, etc.)
 *      keyboard,        — Keyboard builders { close(), back(), menu() }
 *    }
 *
 * ══════════════════════════════════════════════════════════════
 */

export default {
    // ─── Required ───
    name: 'example-plugin',
    description: 'A template plugin — replace with your own',

    // ─── Optional ───
    version: '1.0.0',
    author: 'Your Name',

    // ─── Commands this plugin handles ───
    // Array of command strings (with or without leading /)
    commands: ['/example', '/hello'],

    // ─── Callback data prefixes this plugin handles ───
    // Array of prefix strings — matches if callback_data starts with prefix
    callbacks: ['example_'],

    // ─── Init (optional) ───
    // Called once when the plugin is loaded. Use for setup, API init, etc.
    async init() {
        // console.log('[ExamplePlugin] Initialized');
    },

    // ─── Command Handler (required if commands defined) ───
    async onCommand(cmd, args, ctx) {
        if (cmd === '/example') {
            await ctx.botApi.sendMessage(ctx.chatId,
                `🔧 <b>Example Plugin</b>\n\n` +
                `Command: <code>${cmd}</code>\n` +
                `Args: <code>${args || '(none)'}</code>\n` +
                `Chat: <code>${ctx.chatId}</code>`,
                ctx.keyboard.close()
            );
        }

        if (cmd === '/hello') {
            const name = ctx.userId;
            await ctx.botApi.sendMessage(ctx.chatId,
                `👋 Хмпф. Hᴇʟʟᴏ, <b>${name}</b>. Tʜɪs Is Tʜᴇ Exᴀᴍᴘʟᴇ Pʟᴜɢɪɴ.`,
                ctx.keyboard.close()
            );
        }
    },

    // ─── Callback Handler (required if callbacks defined) ───
    async onCallback(data, ctx) {
        if (data === 'example_ping') {
            await ctx.botApi.answerCallbackQuery(ctx.callbackQueryId, '🏓 Pong from plugin!');
        }
    },
};
