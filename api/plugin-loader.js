/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — Plugin Loader
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Dynamic plugin system. Scans the plugins/ directory,
 *   loads each .js file that exports a valid plugin interface,
 *   and provides routing for commands and callback queries.
 *
 *   Plugins are self-contained — add/remove without touching core.
 *
 * @version 1.0.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { log } from './helper.js';
import { readdir } from 'fs/promises';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PLUGINS_DIR = join(__dirname, '..', 'plugins');

// ══════════════════════════════════════════════════════════════
// PLUGIN REGISTRY
// ══════════════════════════════════════════════════════════════

const plugins = [];           // All loaded plugins
const commandMap = {};        // command string → plugin
const callbackPrefixMap = {}; // callback prefix → plugin
const disabledPlugins = new Set(); // Runtime-disabled plugin names

// ══════════════════════════════════════════════════════════════
// PLUGIN LOADER
// ══════════════════════════════════════════════════════════════

/**
 * Scan plugins/ directory and load all valid plugin files.
 * Each plugin must export: name, description, onCommand or onCallback.
 */
async function loadPlugins() {
    try {
        const files = readdir(PLUGINS_DIR);
        const pluginFiles = (await files).filter(f => f.endsWith('.js') && !f.startsWith('_'));

        if (pluginFiles.length === 0) {
            log.info('[Plugins] No plugins found in plugins/ directory');
            return;
        }

        for (const file of pluginFiles) {
            try {
                const filePath = join(PLUGINS_DIR, file);
                const mod = await import(filePath);
                const plugin = mod.default || mod;

                // Validate plugin interface
                if (!plugin.name || !plugin.description) {
                    log.warn(`[Plugins] Skipped ${file}: missing name or description`);
                    continue;
                }

                // Register plugin
                plugins.push(plugin);
                log.info(`[Plugins] Loaded: ${plugin.name} v${plugin.version || '1.0.0'}`);

                // Register commands
                if (plugin.commands && plugin.commands.length > 0) {
                    for (const cmd of plugin.commands) {
                        const normalized = cmd.startsWith('/') ? cmd : `/${cmd}`;
                        if (commandMap[normalized]) {
                            log.warn(`[Plugins] Command ${normalized} already registered by ${commandMap[normalized].name}, skipping (from ${plugin.name})`);
                            continue;
                        }
                        commandMap[normalized] = plugin;
                        log.info(`[Plugins]   → Command: ${normalized}`);
                    }
                }

                // Register callback prefixes
                if (plugin.callbacks && plugin.callbacks.length > 0) {
                    for (const prefix of plugin.callbacks) {
                        if (callbackPrefixMap[prefix]) {
                            log.warn(`[Plugins] Callback prefix ${prefix} already registered by ${callbackPrefixMap[prefix].name}, skipping (from ${plugin.name})`);
                            continue;
                        }
                        callbackPrefixMap[prefix] = plugin;
                        log.info(`[Plugins]   → Callback: ${prefix}*`);
                    }
                }

                // Run plugin init if provided
                if (typeof plugin.init === 'function') {
                    try {
                        await plugin.init();
                    } catch (error) {
                        log.error(`[Plugins] Init failed for ${plugin.name}:`, error.message);
                    }
                }

            } catch (error) {
                log.error(`[Plugins] Failed to load ${file}:`, error.message);
            }
        }

        log.info(`[Plugins] Loaded ${plugins.length} plugin(s) — ${Object.keys(commandMap).length} commands, ${Object.keys(callbackPrefixMap).length} callback prefixes`);

    } catch (error) {
        if (error.code === 'ENOENT') {
            log.info('[Plugins] No plugins/ directory — plugin system idle');
        } else {
            log.error('[Plugins] Failed to scan plugins directory:', error.message);
        }
    }
}

// ══════════════════════════════════════════════════════════════
// ROUTING
// ══════════════════════════════════════════════════════════════

/**
 * Try to route a command to a plugin.
 * @returns {boolean} true if a plugin handled the command
 */
async function routeCommand(cmd, args, context) {
    const plugin = commandMap[cmd];
    if (!plugin) return false;
    if (disabledPlugins.has(plugin.name)) return false;
    if (typeof plugin.onCommand !== 'function') return false;

    try {
        await plugin.onCommand(cmd, args, context);
        return true;
    } catch (error) {
        log.error(`[Plugins] ${plugin.name} error handling ${cmd}:`, error.message);
        try {
            await context.botApi.sendMessage(context.chatId,
                `⚠️ Plugin <b>${plugin.name}</b> encountered an error.\n<code>${error.message}</code>`,
                context.keyboard?.close()
            );
        } catch {}
        return true; // Still counts as handled
    }
}

/**
 * Try to route a callback query to a plugin.
 * @returns {boolean} true if a plugin handled the callback
 */
async function routeCallback(callbackData, context) {
    for (const [prefix, plugin] of Object.entries(callbackPrefixMap)) {
        if (callbackData.startsWith(prefix)) {
            if (disabledPlugins.has(plugin.name)) continue;
            if (typeof plugin.onCallback !== 'function') continue;

            try {
                await plugin.onCallback(callbackData, context);
                return true;
            } catch (error) {
                log.error(`[Plugins] ${plugin.name} error handling callback ${callbackData}:`, error.message);
                try {
                    await context.botApi.answerCallbackQuery(context.callbackQueryId,
                        `⚠️ Plugin error: ${error.message}`, true);
                } catch {}
                return true;
            }
        }
    }
    return false;
}

// ══════════════════════════════════════════════════════════════
// MANAGEMENT
// ══════════════════════════════════════════════════════════════

function getAllPlugins() {
    return plugins.map(p => ({
        name: p.name,
        description: p.description,
        version: p.version || '1.0.0',
        commands: p.commands || [],
        callbacks: p.callbacks || [],
        enabled: !disabledPlugins.has(p.name),
    }));
}

function getPluginCount() {
    return plugins.length;
}

function getEnabledCount() {
    return plugins.length - disabledPlugins.size;
}

function togglePlugin(name) {
    if (disabledPlugins.has(name)) {
        disabledPlugins.delete(name);
        return true; // enabled
    } else {
        disabledPlugins.add(name);
        return false; // disabled
    }
}

function isPluginEnabled(name) {
    return !disabledPlugins.has(name);
}

// ══════════════════════════════════════════════════════════════
// EXPORTS
// ══════════════════════════════════════════════════════════════

export const PluginLoader = {
    loadPlugins,
    routeCommand,
    routeCallback,
    getAllPlugins,
    getPluginCount,
    getEnabledCount,
    togglePlugin,
    isPluginEnabled,
};

// ══════════════════════════════════════════════════════════════ END: plugin-loader.js
