/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — version.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Single source of truth for the bot version.
 *   Reads from package.json — change version there only.
 *
 * @exports VERSION
 *
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { version } = require('../package.json');

export const VERSION = version;
