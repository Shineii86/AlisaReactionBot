/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — version.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Single source of truth for the bot version.
 *   Reads from package.json in Node.js; uses fallback in
 *   Cloudflare Workers and other non-Node.js runtimes.
 *
 * @exports VERSION
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

let VERSION = '2.15.4'; // Fallback for Cloudflare Workers / non-Node.js runtimes

try {
    if (import.meta.url) {
        const { createRequire } = await import('node:module');
        const require = createRequire(import.meta.url);
        const pkg = require('../package.json');
        VERSION = pkg.version;
    }
} catch {
    // Cloudflare Workers or other non-Node.js runtime — use fallback above
}

export { VERSION };
