export const startMessage = `👋 Oʜ? Hᴇʟʟᴏ, *UserName*.

Sᴏ Yᴏᴜ Sᴛᴀʀᴛᴇᴅ Mᴇ. Nᴏᴛ Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Oʀ Aɴʏᴛʜɪɴɢ.

🎊 Wᴇʟᴄᴏᴍᴇ Tᴏ *Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ* ✨
I’ʟʟ Mᴀᴋᴇ Yᴏᴜʀ Cʜᴀᴛs Mᴏʀᴇ Fᴜɴ… Iғ Yᴏᴜ Bᴇʜᴀᴠᴇ.

💬 *Hᴇʀᴇ's Hᴏᴡ I Sᴘɪᴄᴇ Uᴘ Yᴏᴜʀ Cʜᴀᴛs:*

✨ *Pʀɪᴠᴀᴛᴇ Cʜᴀᴛ*: I Rᴇᴀᴄᴛ Tᴏ Yᴏᴜʀ Mᴇssᴀɢᴇs Wɪᴛʜ Tʜᴇ Pᴇʀғᴇᴄᴛ Eᴍᴏᴊɪ.
🌸 *Gʀᴏᴜᴘs & Cʜᴀɴɴᴇʟs*: Aᴅᴅ Mᴇ Aɴᴅ I’ʟʟ Dʀᴏᴘ Fɪᴛᴛɪɴɢ Rᴇᴀᴄᴛɪᴏɴs Wʜᴇɴ Tʜᴇ Mᴏᴏᴅ Fᴇᴇʟs Rɪɢʜᴛ.

Cᴜʀɪᴏᴜs Aʙᴏᴜᴛ Mʏ Eᴍᴏᴊɪs? Usᴇ /reactions.

Lᴇᴛ’s Bʀɪɢʜᴛᴇɴ Yᴏᴜʀ Cʜᴀᴛs A Lɪᴛᴛʟᴇ.
I’ᴍ Oɴʟʏ Hᴇʟᴘɪɴɢ Bᴇᴄᴀᴜsᴇ I Wᴀɴᴛ Tᴏ… Oᴋᴀʏ?`

export const donateMessage = `🫣 Oʜ... Yᴏᴜ’ʀᴇ Sᴛɪʟʟ Hᴇʀᴇ?

Iғ Yᴏᴜ Eɴᴊᴏʏ Usɪɴɢ Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ, Yᴏᴜ Cᴀɴ Sᴜᴘᴘᴏʀᴛ ɪᴛ. Eᴠᴇɴ Oɴᴇ ⭐ Hᴇʟᴘs Kᴇᴇᴘ Iᴛ Oɴʟɪɴᴇ Aɴᴅ Iᴍᴘʀᴏᴠɪɴɢ.

Спасибо Fᴏʀ Yᴏᴜʀ Sᴜᴘᴘᴏʀᴛ.
I’ᴍ Oɴʟʏ Sᴀʏɪɴɢ Tʜɪs Bᴇᴄᴀᴜsᴇ I Aᴘᴘʀᴇᴄɪᴀᴛᴇ Yᴏᴜ.`

export const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Alisa Reaction Bot</title>
  <meta name="description" content="Neural-linked Telegram automation – main modules & edge deployment.">
  <link rel="icon" href="https://github.com/Shineii86/AlisaReactionBot/raw/refs/heads/main/assets/icon.png" type="image/png">

  <!-- fonts: Orbitron (headers), Rajdhani (ui), Share Tech Mono (terminal) -->
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Orbitron:wght@400;500;600;700;800;900&family=Rajdhani:wght@300;400;500;600;700&family=Share+Tech+Mono&display=swap" rel="stylesheet">

  <!-- Tailwind (lightweight) -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide icons -->
  <script src="https://unpkg.com/lucide@latest"></script>

  <script>
    tailwind.config = {
      darkMode: 'class',
      theme: {
        extend: {
          fontFamily: {
            display: ['Orbitron', 'sans-serif'],
            ui: ['Rajdhani', 'sans-serif'],
            mono: ['Share Tech Mono', 'monospace'],
          },
          colors: {
            cyber: {
              black: '#050505',
              dark: '#0a0a0f',
              panel: '#111118',
              neon: { cyan: '#00f3ff', pink: '#ff00ff', purple: '#b026ff', yellow: '#ffff00', green: '#00ff41' }
            }
          },
          animation: { 'pulse-fast': 'pulse 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite' }
        }
      }
    }
  </script>

  <style>
    :root {
      --neon-cyan: #00f3ff; --neon-pink: #ff00ff; --neon-purple: #b026ff;
      --neon-green: #00ff41; --cyber-black: #050505; --cyber-dark: #0a0a0f; --cyber-panel: #111118;
    }
    body {
      background-color: var(--cyber-black);
      color: #e0e0e0;
      font-family: 'Rajdhani', sans-serif;
      overflow-x: hidden;
    }
    /* scanlines + grid (ambient) */
    .scanlines {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 9999;
      background: linear-gradient(to bottom, rgba(255,255,255,0), rgba(255,255,255,0) 50%, rgba(0,0,0,0.1) 50%, rgba(0,0,0,0.1));
      background-size: 100% 4px; opacity: 0.3;
    }
    .scanlines::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 10px;
      background: rgba(0, 243, 255, 0.1); animation: scan 6s linear infinite;
      box-shadow: 0 0 20px rgba(0, 243, 255, 0.5);
    }
    .cyber-grid {
      background-image: linear-gradient(rgba(0, 243, 255, 0.03) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(0, 243, 255, 0.03) 1px, transparent 1px);
      background-size: 50px 50px; position: fixed; top: 0; left: 0; width: 100%; height: 100%; pointer-events: none; z-index: 0;
    }
    .hex-bg {
      position: fixed; top: 0; left: 0; width: 100%; height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='28' height='49' viewBox='0 0 28 49'%3E%3Cg fill-rule='evenodd'%3E%3Cg id='hexagons' fill='%2300f3ff' fill-opacity='0.03' fill-rule='nonzero'%3E%3Cpath d='M13.99 9.25l13 7.5v15l-13 7.5L1 31.75v-15l12.99-7.5zM3 17.9v12.7l10.99 6.34 11-6.35V17.9l-11-6.34L3 17.9zM0 15l12.98-7.5V0h-2v6.35L0 12.69v2.3zm0 18.5L12.98 41v8h-2v-6.85L0 35.81v-2.3zM15 0v7.5L27.99 15H28v-2.31h-.01L17 6.35V0h-2zm0 49v-8l12.99-7.5H28v2.31h-.01L17 42.15V49h-2z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
      pointer-events: none; z-index: 1;
    }
    @keyframes scan { 0% { transform: translateY(-100%); } 100% { transform: translateY(100%); } }

    /* cyber card (reduced) */
    .cyber-card {
      background: rgba(17, 17, 24, 0.8); border: 1px solid rgba(0, 243, 255, 0.2); position: relative; overflow: hidden;
    }
    .cyber-card::before {
      content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 2px;
      background: linear-gradient(90deg, transparent, var(--neon-cyan), transparent); animation: scan 3s linear infinite;
    }
    .cyber-card::after {
      content: ''; position: absolute; bottom: 0; right: 0; width: 20px; height: 20px;
      border-bottom: 2px solid var(--neon-cyan); border-right: 2px solid var(--neon-cyan);
    }
    /* terminal */
    .cyber-terminal {
      background: rgba(5, 5, 5, 0.95); border: 1px solid var(--neon-green); box-shadow: 0 0 20px rgba(0, 255, 65, 0.2);
      font-family: 'Share Tech Mono', monospace;
    }
    .terminal-header { background: rgba(0, 255, 65, 0.1); border-bottom: 1px solid var(--neon-green); }
    .glow-text-cyan { text-shadow: 0 0 10px rgba(0, 243, 255, 0.8); }
    .glow-text-pink { text-shadow: 0 0 10px rgba(255, 0, 255, 0.8); }
    .glow-text-purple { text-shadow: 0 0 10px rgba(176, 38, 255, 0.8); }
    .cyber-btn {
      background: transparent; border: 2px solid var(--neon-cyan); color: var(--neon-cyan); font-family: 'Orbitron', sans-serif;
      text-transform: uppercase; letter-spacing: 2px; overflow: hidden; transition: all 0.3s;
      clip-path: polygon(10% 0, 100% 0, 100% 70%, 90% 100%, 0 100%, 0 30%);
    }
    .cyber-btn:hover { background: var(--neon-cyan); color: black; box-shadow: 0 0 30px rgba(0,243,255,0.6); }
    ::-webkit-scrollbar { width: 6px; } ::-webkit-scrollbar-track { background: #050505; } ::-webkit-scrollbar-thumb { background: #00f3ff; }
  </style>
</head>
<body class="antialiased">

  <!-- persistent ambient layers -->
  <div class="scanlines"></div>
  <div class="cyber-grid"></div>
  <div class="hex-bg"></div>

  <!-- ========== MINIMAL NAV ========== -->
  <nav class="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur border-b border-cyan-500/30 px-6 py-3">
    <div class="max-w-6xl mx-auto flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 border border-cyan-400 flex items-center justify-center">
          <i data-lucide="cpu" class="w-4 h-4 text-cyan-400"></i>
        </div>
        <span class="font-display font-bold text-white tracking-widest text-lg">ALISA</span>
        <span class="font-mono text-[0.6rem] text-cyan-400/70 ml-2">Reaction Bot</span>
      </div>
      <div class="flex items-center gap-3">
        <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="text-gray-400 hover:text-cyan-400 transition">
          <i data-lucide="github" class="w-5 h-5"></i>
        </a>
        <a href="https://t.me/AlisaReactionBot" target="_blank" class="cyber-btn px-4 py-1 text-xs flex items-center gap-1">
          <i data-lucide="zap" class="w-3 h-3"></i> BOT
        </a>
      </div>
    </div>
  </nav>

  <!-- ========== MAIN (only features + deployment) ========== -->
  <main class="relative z-10 max-w-6xl mx-auto px-4 pt-28 pb-16">

    <!-- FEATURES SECTION (CORE MODULES) -->
    <section id="features" class="mb-24">
      <div class="text-center mb-12">
        <div class="inline-block border border-cyan-500/30 px-4 py-1 mb-3">
          <span class="text-xs font-mono text-cyan-400 tracking-widest">// CORE_MODULES //</span>
        </div>
        <h2 class="font-display text-4xl md:text-5xl font-black tracking-tight">
          <span class="text-white">NEURAL</span>
          <span class="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-400">PRIMITIVES</span>
        </h2>
      </div>

      <!-- compact feature grid (4 essential modules) -->
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- feature 1: speed -->
        <div class="cyber-card p-5 group hover:border-cyan-400 transition-all">
          <div class="flex justify-between items-start">
            <i data-lucide="zap" class="w-6 h-6 text-cyan-400"></i>
            <span class="text-2xl font-display font-black text-cyan-400/30 group-hover:text-cyan-400/50">01</span>
          </div>
          <h3 class="font-display font-bold text-white mt-2 text-lg tracking-wide">QUANTUM SPEED</h3>
          <p class="text-gray-400 text-xs font-ui leading-relaxed">sub-100ms edge latency · 300+ nodes · zero cold starts</p>
          <div class="mt-3 h-1 bg-gray-800 w-full rounded"><div class="h-full w-[95%] bg-cyan-400 shadow-[0_0_6px_#00f3ff]"></div></div>
        </div>
        <!-- feature 2: shield -->
        <div class="cyber-card p-5 group hover:border-pink-400 transition-all">
          <div class="flex justify-between items-start">
            <i data-lucide="shield" class="w-6 h-6 text-pink-400"></i>
            <span class="text-2xl font-display font-black text-pink-400/30 group-hover:text-pink-400/50">02</span>
          </div>
          <h3 class="font-display font-bold text-white mt-2 text-lg tracking-wide">NEURAL SHIELD</h3>
          <p class="text-gray-400 text-xs font-ui">military-grade encryption · no disk persistence</p>
          <div class="mt-3 h-1 bg-gray-800 w-full rounded"><div class="h-full w-full bg-pink-400 shadow-[0_0_6px_#ff00ff]"></div></div>
        </div>
        <!-- feature 3: mesh -->
        <div class="cyber-card p-5 group hover:border-purple-400 transition-all">
          <div class="flex justify-between items-start">
            <i data-lucide="network" class="w-6 h-6 text-purple-400"></i>
            <span class="text-2xl font-display font-black text-purple-400/30 group-hover:text-purple-400/50">03</span>
          </div>
          <h3 class="font-display font-bold text-white mt-2 text-lg tracking-wide">MESH NETWORK</h3>
          <p class="text-gray-400 text-xs font-ui">global edge · auto-routing · anycast backbone</p>
          <div class="mt-3 h-1 bg-gray-800 w-full rounded"><div class="h-full w-[88%] bg-purple-400 shadow-[0_0_6px_#b026ff]"></div></div>
        </div>
        <!-- feature 4: infinite scale -->
        <div class="cyber-card p-5 group hover:border-green-400 transition-all">
          <div class="flex justify-between items-start">
            <i data-lucide="infinity" class="w-6 h-6 text-green-400"></i>
            <span class="text-2xl font-display font-black text-green-400/30 group-hover:text-green-400/50">04</span>
          </div>
          <h3 class="font-display font-bold text-white mt-2 text-lg tracking-wide">INFINITE SCALE</h3>
          <p class="text-gray-400 text-xs font-ui">auto-scaling 0→∞ · pay-per-use · serverless</p>
          <div class="mt-3 h-1 bg-gray-800 w-full rounded"><div class="h-full w-[99%] bg-green-400 shadow-[0_0_6px_#00ff41]"></div></div>
        </div>
      </div>
      <!-- secondary features (condensed) -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
        <div class="border border-cyan-500/20 bg-cyber-panel/50 p-3 flex items-center gap-2">
          <i data-lucide="bar-chart-2" class="w-4 h-4 text-cyan-400"></i>
          <span class="font-mono text-xs text-gray-300">data stream</span>
        </div>
        <div class="border border-pink-500/20 bg-cyber-panel/50 p-3 flex items-center gap-2">
          <i data-lucide="sliders" class="w-4 h-4 text-pink-400"></i>
          <span class="font-mono text-xs text-gray-300">custom protocol</span>
        </div>
        <div class="border border-purple-500/20 bg-cyber-panel/50 p-3 flex items-center gap-2">
          <i data-lucide="activity" class="w-4 h-4 text-purple-400"></i>
          <span class="font-mono text-xs text-gray-300">live metrics</span>
        </div>
        <div class="border border-green-500/20 bg-cyber-panel/50 p-3 flex items-center gap-2">
          <i data-lucide="bot" class="w-4 h-4 text-green-400"></i>
          <span class="font-mono text-xs text-gray-300">reaction matrix</span>
        </div>
      </div>
    </section>

    <!-- DEPLOYMENT SECTION (TERMINAL FOCUS) -->
    <section id="deploy">
      <div class="text-center mb-10">
        <div class="inline-block border border-pink-500/30 px-4 py-1 mb-3">
          <span class="text-xs font-mono text-pink-400 tracking-widest">// DEPLOY_PROTOCOL //</span>
        </div>
        <h2 class="font-display text-4xl md:text-5xl font-black tracking-tight">
          <span class="text-white">EDGE</span>
          <span class="text-pink-400 glow-text-pink">TERMINAL</span>
        </h2>
      </div>

      <!-- main terminal window -->
      <div class="cyber-terminal rounded-lg overflow-hidden mb-6">
        <div class="terminal-header px-4 py-2 flex items-center gap-2">
          <div class="w-3 h-3 rounded-full bg-red-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-yellow-500/50"></div>
          <div class="w-3 h-3 rounded-full bg-green-500/50"></div>
          <span class="ml-2 text-xs text-green-400/70 font-mono">alisa@edge:~$</span>
        </div>
        <div class="p-5 font-mono text-sm space-y-2">
          <div class="text-gray-500"># === DEPLOY TO CLOUDFLARE WORKERS (RECOMMENDED) ===</div>
          <div><span class="text-cyan-400">$</span> <span class="text-white">git clone</span> <span class="text-green-400">https://github.com/Shineii86/AlisaReactionBot.git</span></div>
          <div class="text-gray-500">→ Cloning neural pathways... <span class="text-green-400">OK</span></div>
          <div class="mt-3"><span class="text-cyan-400">$</span> <span class="text-white">cd AlisaReactionBot && npm ci</span></div>
          <div class="text-gray-500">→ Dependencies installed <span class="text-green-400">[esbuild+workers]</span></div>
          <div class="mt-3"><span class="text-cyan-400">$</span> <span class="text-white">cp .env.example .env</span></div>
          <div class="text-yellow-400">⚠️  edit .env: add BOT_TOKEN (from @BotFather) and SECRET</div>
          <div class="mt-3"><span class="text-cyan-400">$</span> <span class="text-white">npm run deploy</span></div>
          <div class="text-green-400 animate-pulse">› Deploying to Cloudflare Edge...</div>
          <div class="text-cyan-400 mt-2">✓ Published: https://alisa-bot.your-subdomain.workers.dev</div>
          <div class="border-t border-green-500/30 my-3 pt-2 text-gray-500"># alternative: vercel</div>
          <div><span class="text-cyan-400">$</span> <span class="text-white">npx vercel --prod</span>  <span class="text-gray-500"># auto HTTPS</span></div>
        </div>
      </div>

      <!-- prerequisites + one-click cards -->
      <div class="grid md:grid-cols-2 gap-5">
        <!-- prerequisites box -->
        <div class="cyber-card p-5 border-l-4 border-l-purple-500">
          <h4 class="font-display text-white text-md mb-3 flex items-center gap-2"><i data-lucide="check-circle" class="w-4 h-4 text-purple-400"></i> REQUIRED_MODULES</h4>
          <ul class="font-mono text-xs space-y-2 text-gray-300">
            <li class="flex items-center gap-2"><span class="text-purple-400">⟡</span> Telegram Bot Token (from @BotFather)</li>
            <li class="flex items-center gap-2"><span class="text-purple-400">⟡</span> Cloudflare account (free) – or Vercel</li>
            <li class="flex items-center gap-2"><span class="text-purple-400">⟡</span> Node.js 18+ / npm</li>
            <li class="flex items-center gap-2"><span class="text-purple-400">⟡</span> Git (optional but recommended)</li>
          </ul>
        </div>

        <!-- quick deploy links (terminal style) -->
        <div class="grid grid-cols-2 gap-3">
          <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="cyber-card p-4 flex flex-col items-start hover:border-orange-400 transition group">
            <i data-lucide="cloud" class="w-6 h-6 text-orange-400 mb-2"></i>
            <span class="font-display text-sm font-bold text-white">CF WORKERS</span>
            <span class="text-[0.65rem] font-mono text-orange-400/80 group-hover:text-orange-300">1-CLICK DEPLOY</span>
          </a>
          <a href="https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="cyber-card p-4 flex flex-col items-start hover:border-white transition group">
            <i data-lucide="triangle" class="w-6 h-6 text-white mb-2"></i>
            <span class="font-display text-sm font-bold text-white">VERCEL</span>
            <span class="text-[0.65rem] font-mono text-gray-400 group-hover:text-white">SERVERLESS</span>
          </a>
        </div>
      </div>

      <!-- additional tip: local dev -->
      <div class="mt-5 text-xs font-mono text-gray-500 border border-cyan-500/20 p-3 bg-cyber-panel/30 flex items-center gap-2">
        <i data-lucide="terminal" class="w-4 h-4 text-cyan-400"></i>
        <span>local dev: <span class="text-cyan-400">npm run dev</span> · requires wrangler for workers</span>
      </div>
    </section>
  </main>

  <!-- ========== MINIMAL FOOTER ========== -->
  <footer class="relative z-10 border-t border-cyan-500/20 bg-cyber-black/80 py-6 mt-10">
    <div class="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center text-[0.65rem] font-mono text-gray-600">
      <span>Copyright © 2026 Alisa Reaction Bot</span>
      <span class="flex items-center gap-2 mt-2 md:mt-0">
        Made With <i data-lucide="heart" class="w-3 h-3 text-pink-500"></i> By Shinei Nouzen
        <span class="w-1 h-1 bg-cyan-400 rounded-full mx-2"></span>
        <span class="text-cyan-400">v1.0.1</span>
      </span>
    </div>
  </footer>

  <!-- lucide init -->
  <script>
    lucide.createIcons();

    // tiny interactive: make the terminal feel a bit more dynamic (blinking cursor, but static)
    // we can also add a hover effect on the terminal lines (just for fun)
    document.querySelectorAll('.cyber-terminal .text-cyan-400').forEach(el => {
      el.addEventListener('mouseenter', () => el.classList.add('glow-text-cyan'));
      el.addEventListener('mouseleave', () => el.classList.remove('glow-text-cyan'));
    });
  </script>
</body>
</html>
`;
