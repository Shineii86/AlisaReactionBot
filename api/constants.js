export const startMessage = `👋 Oʜ? Hᴇʟʟᴏ, *UserName*.

Sᴏ Yᴏᴜ Sᴛᴀʀᴛᴇᴅ Mᴇ. Nᴏᴛ Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Oʀ Aɴʏᴛʜɪɴɢ.

🎊 Wᴇʟᴄᴏᴍᴇ Tᴏ *Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ* ✨
I’ʟʟ Mᴀᴋᴇ Yᴏᴜʀ Cʜᴀᴛs Mᴏʀᴇ Fᴜɴ… Iғ Yᴏᴜ Bᴇʜᴀᴠᴇ.

💬 *Hᴇʀᴇ's Hᴏᴡ I Sᴘɪᴄᴇ Uᴘ Yᴏᴜʀ Cʜᴀᴛs:*
*• Pʀɪᴠᴀᴛᴇ Cʜᴀᴛ*: I Rᴇᴀᴄᴛ Tᴏ Yᴏᴜʀ Mᴇssᴀɢᴇs Wɪᴛʜ Tʜᴇ Pᴇʀғᴇᴄᴛ Eᴍᴏᴊɪ.
*• Gʀᴏᴜᴘs & Cʜᴀɴɴᴇʟs*: Aᴅᴅ Mᴇ Aɴᴅ I’ʟʟ Dʀᴏᴘ Fɪᴛᴛɪɴɢ Rᴇᴀᴄᴛɪᴏɴs Wʜᴇɴ Tʜᴇ Mᴏᴏᴅ Fᴇᴇʟs Rɪɢʜᴛ.

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
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Alisa · Neural Reaction Engine</title>
  <meta name="description" content="Alisa Reaction Bot — ultra-low latency Telegram automation, edge-deployed neural architecture.">
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2300f3ff' stroke-width='1.5'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E">
  
  <!-- Google Fonts: Modern anime/tech style -->
  <link href="https://fonts.googleapis.com/css2?family=Inter:opsz,wght@14..32,300;14..32,400;14..32,500;14..32,600;14..32,700;14..32,800&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
  
  <!-- TailwindCSS + basic overrides -->
  <script src="https://cdn.tailwindcss.com"></script>
  <!-- Lucide Icons -->
  <script src="https://unpkg.com/lucide@latest"></script>
  
  <style>
    /* ===== ROSHIDERE-INSPIRED DEEP AESTHETIC ===== */
    * {
      margin: 0;
      padding: 0;
      box-sizing: border-box;
    }

    body {
      background-color: #02020c;
      font-family: 'Inter', sans-serif;
      color: #f0f0ff;
      overflow-x: hidden;
    }

    /* animated gradient bg + noise texture */
    .cyber-bg {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: -2;
      background: radial-gradient(circle at 30% 10%, rgba(15, 25, 55, 0.9), #02020c 80%);
    }
    .cyber-bg::before {
      content: "";
      position: absolute;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.045'/%3E%3C/svg%3E");
      opacity: 0.3;
      pointer-events: none;
    }

    /* animated grid (glow lines) */
    .grid-lines {
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: 
        linear-gradient(to right, rgba(0, 243, 255, 0.08) 1px, transparent 1px),
        linear-gradient(to bottom, rgba(0, 243, 255, 0.08) 1px, transparent 1px);
      background-size: 60px 60px;
      pointer-events: none;
      z-index: -1;
    }

    /* glass card (roshidere signature) */
    .glass-panel {
      background: rgba(12, 15, 35, 0.55);
      backdrop-filter: blur(12px);
      border: 1px solid rgba(0, 243, 255, 0.2);
      border-radius: 2rem;
      box-shadow: 0 25px 40px -12px rgba(0,0,0,0.4);
      transition: all 0.3s ease;
    }
    .glass-panel:hover {
      border-color: rgba(0, 243, 255, 0.5);
      box-shadow: 0 0 25px rgba(0, 243, 255, 0.15);
    }

    /* glowing text styles */
    .glow-cyan {
      text-shadow: 0 0 8px #00f3ff80, 0 0 2px #00f3ff;
    }
    .glow-pink {
      text-shadow: 0 0 8px #ff44e6, 0 0 2px #ff44e6;
    }
    .gradient-text {
      background: linear-gradient(135deg, #E6E9FF 0%, #A0C4FF 40%, #6C8CFF 100%);
      background-clip: text;
      -webkit-background-clip: text;
      color: transparent;
    }

    /* button roshidere style */
    .btn-primary {
      background: linear-gradient(105deg, #00e0ff20, #7a2eff20);
      border: 1px solid rgba(0, 240, 255, 0.6);
      backdrop-filter: blur(4px);
      transition: 0.25s;
      border-radius: 2.5rem;
      font-weight: 600;
      letter-spacing: -0.01em;
    }
    .btn-primary:hover {
      background: linear-gradient(105deg, #00e0ff40, #9d4eff40);
      border-color: #00f3ff;
      box-shadow: 0 0 18px rgba(0, 243, 255, 0.3);
      transform: scale(1.02);
    }

    /* animated orb (character replacement) */
    .orb-pulse {
      width: 280px;
      height: 280px;
      background: radial-gradient(circle at 30% 35%, rgba(0, 243, 255, 0.2), rgba(111, 0, 255, 0.15));
      border-radius: 50%;
      filter: blur(40px);
      animation: orbFloat 6s infinite alternate;
    }
    @keyframes orbFloat {
      0% { transform: translateY(0px) scale(1); opacity: 0.6; }
      100% { transform: translateY(-25px) scale(1.05); opacity: 0.9; }
    }

    /* scroll reveal */
    .reveal {
      opacity: 0;
      transform: translateY(28px);
      transition: opacity 0.8s cubic-bezier(0.2, 0.9, 0.4, 1.1), transform 0.7s ease;
    }
    .reveal.visible {
      opacity: 1;
      transform: translateY(0);
    }

    /* custom scrollbar */
    ::-webkit-scrollbar { width: 5px; }
    ::-webkit-scrollbar-track { background: #03030e; }
    ::-webkit-scrollbar-thumb { background: #00f3ff; border-radius: 10px; }

    /* floating particles */
    .particle {
      position: fixed;
      background: #00f3ff;
      border-radius: 50%;
      opacity: 0.3;
      pointer-events: none;
      z-index: -1;
      filter: blur(2px);
    }
  </style>
</head>
<body>

  <div class="cyber-bg"></div>
  <div class="grid-lines"></div>

  <!-- NAVIGATION (sleek & minimal) -->
  <nav class="fixed top-0 left-0 w-full z-50 backdrop-blur-xl bg-black/40 border-b border-white/10 transition-all duration-300">
    <div class="max-w-7xl mx-auto px-6 md:px-8 py-4 flex items-center justify-between">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full bg-gradient-to-tr from-cyan-400 to-purple-500 flex items-center justify-center shadow-lg">
          <i data-lucide="bot" class="w-5 h-5 text-white"></i>
        </div>
        <span class="font-bold text-xl tracking-tight bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">ALISA</span>
        <span class="hidden md:block text-[11px] font-mono text-cyan-400/70 border-l border-cyan-500/30 pl-2 ml-1">reaction.engine</span>
      </div>
      <div class="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
        <a href="#features" class="hover:text-cyan-400 transition-colors">Neural Cores</a>
        <a href="#deploy" class="hover:text-cyan-400 transition-colors">Edge Deployment</a>
        <a href="#protocol" class="hover:text-cyan-400 transition-colors">Protocol</a>
      </div>
      <div class="flex items-center gap-3">
        <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="text-gray-300 hover:text-cyan-400 transition">
          <i data-lucide="github" class="w-5 h-5"></i>
        </a>
        <a href="https://t.me/AlisaReactionBot" target="_blank" class="btn-primary px-4 py-1.5 text-xs md:text-sm flex items-center gap-1.5">
          <i data-lucide="zap" class="w-3.5 h-3.5"></i> <span>LAUNCH BOT</span>
        </a>
      </div>
    </div>
  </nav>

  <main class="relative z-10">
    <!-- HERO SECTION (inspired by roshidere's visual impact) -->
    <section class="pt-32 md:pt-40 pb-20 px-6 max-w-7xl mx-auto">
      <div class="grid md:grid-cols-2 gap-12 items-center">
        <div class="reveal">
          <div class="inline-flex items-center gap-2 bg-white/5 rounded-full px-4 py-1.5 border border-cyan-500/30 mb-6 backdrop-blur-sm">
            <span class="relative flex h-2 w-2">
              <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75"></span>
              <span class="relative inline-flex rounded-full h-2 w-2 bg-cyan-400"></span>
            </span>
            <span class="text-[11px] font-mono tracking-wider text-cyan-300">NEURAL LINK ACTIVE</span>
          </div>
          <h1 class="text-5xl md:text-7xl font-bold tracking-tighter leading-[1.2]">
            <span class="gradient-text">Alisa</span><br>
            <span class="text-white">Reaction <span class="text-cyan-400 glow-cyan">Matrix</span></span>
          </h1>
          <p class="text-gray-300 text-lg md:text-xl mt-6 max-w-lg leading-relaxed font-light">
            Sub-100ms Telegram automation • serverless mesh • infinite scaling. Deploy at the edge with zero cold starts.
          </p>
          <div class="flex flex-wrap gap-4 mt-10">
            <a href="#deploy" class="btn-primary px-8 py-3 text-base flex items-center gap-2">
              <i data-lucide="cloud" class="w-5 h-5"></i> Edge Deploy
            </a>
            <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="border border-white/20 rounded-full px-7 py-3 text-base hover:bg-white/5 transition flex items-center gap-2">
              <i data-lucide="code-2" class="w-5 h-5"></i> Source
            </a>
          </div>
          <div class="flex items-center gap-5 mt-8 text-xs font-mono text-gray-400">
            <div class="flex items-center gap-1"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-green-400"></i> <span>Cloudflare Workers</span></div>
            <div class="flex items-center gap-1"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-green-400"></i> <span>Vercel Edge</span></div>
            <div class="flex items-center gap-1"><i data-lucide="check-circle" class="w-3.5 h-3.5 text-green-400"></i> <span>Telegram API 6+</span></div>
          </div>
        </div>
        <div class="relative flex justify-center md:justify-end reveal" style="transition-delay: 0.1s;">
          <div class="relative w-full max-w-md">
            <div class="orb-pulse absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"></div>
            <div class="glass-panel p-6 relative z-10 backdrop-blur-xl bg-black/30 border border-cyan-400/40 rounded-3xl shadow-2xl">
              <div class="flex flex-col items-center text-center">
                <div class="w-24 h-24 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-purple-600/20 flex items-center justify-center mb-4 border border-white/20">
                  <i data-lucide="cpu" class="w-12 h-12 text-cyan-300"></i>
                </div>
                <h3 class="font-display text-xl font-semibold tracking-tight">reaction.core</h3>
                <div class="flex items-center gap-2 mt-2 text-sm font-mono">
                  <span class="text-green-400">●</span> <span class="text-gray-300">99.99% uptime</span>
                </div>
                <div class="w-full mt-5 bg-white/5 rounded-full h-1.5">
                  <div class="bg-gradient-to-r from-cyan-400 to-purple-500 w-[92%] h-1.5 rounded-full"></div>
                </div>
                <p class="text-xs text-gray-400 mt-3 font-mono">Edge latency: 47ms · 300+ global nodes</p>
                <div class="grid grid-cols-2 gap-3 w-full mt-6 text-left">
                  <div><span class="text-cyan-400 text-xs font-bold">⌁ 1.2M</span><p class="text-[10px] text-gray-400">requests/day</p></div>
                  <div><span class="text-cyan-400 text-xs font-bold">⚡ &lt;90ms</span><p class="text-[10px] text-gray-400">p95 response</p></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- FEATURES SECTION (roshidere-like card grid) -->
    <section id="features" class="py-20 px-6 max-w-7xl mx-auto">
      <div class="text-center mb-14 reveal">
        <span class="text-cyan-400 font-mono text-sm tracking-widest bg-white/5 px-4 py-1 rounded-full">// CORE_MODULES //</span>
        <h2 class="text-4xl md:text-5xl font-bold mt-4 tracking-tight">Neural <span class="gradient-text">Primitives</span></h2>
        <p class="text-gray-400 max-w-2xl mx-auto mt-3">Built for hyper-reactive Telegram bots — military-grade encryption, mesh routing, and sub‑linear scaling.</p>
      </div>
      <div class="grid md:grid-cols-2 lg:grid-cols-4 gap-5">
        <!-- card 1 -->
        <div class="glass-panel p-6 group hover:border-cyan-400/60 transition-all duration-300 reveal">
          <div class="flex justify-between items-start">
            <i data-lucide="zap" class="w-7 h-7 text-cyan-400"></i>
            <span class="text-4xl font-black text-cyan-400/20 group-hover:text-cyan-400/30">01</span>
          </div>
          <h3 class="font-bold text-xl mt-4">Quantum Speed</h3>
          <p class="text-gray-300 text-sm mt-2">Edge-optimized workers · sub-100ms median latency · instant failover</p>
          <div class="mt-5 h-1 bg-gray-800 rounded-full"><div class="h-full w-[96%] bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full"></div></div>
        </div>
        <!-- card 2 -->
        <div class="glass-panel p-6 group hover:border-pink-400/60 transition-all duration-300 reveal">
          <div class="flex justify-between items-start">
            <i data-lucide="shield" class="w-7 h-7 text-pink-400"></i>
            <span class="text-4xl font-black text-pink-400/20 group-hover:text-pink-400/30">02</span>
          </div>
          <h3 class="font-bold text-xl mt-4">Neural Shield</h3>
          <p class="text-gray-300 text-sm mt-2">End-to-end encryption · no persistent logs · zero-trust architecture</p>
          <div class="mt-5 h-1 bg-gray-800 rounded-full"><div class="h-full w-full bg-gradient-to-r from-pink-400 to-rose-500 rounded-full"></div></div>
        </div>
        <!-- card 3 -->
        <div class="glass-panel p-6 group hover:border-purple-400/60 transition-all duration-300 reveal">
          <div class="flex justify-between items-start">
            <i data-lucide="network" class="w-7 h-7 text-purple-400"></i>
            <span class="text-4xl font-black text-purple-400/20 group-hover:text-purple-400/30">03</span>
          </div>
          <h3 class="font-bold text-xl mt-4">Mesh Edge</h3>
          <p class="text-gray-300 text-sm mt-2">Global anycast routing · auto‑healing · regional replication</p>
          <div class="mt-5 h-1 bg-gray-800 rounded-full"><div class="h-full w-[90%] bg-gradient-to-r from-purple-400 to-fuchsia-500 rounded-full"></div></div>
        </div>
        <!-- card 4 -->
        <div class="glass-panel p-6 group hover:border-green-400/60 transition-all duration-300 reveal">
          <div class="flex justify-between items-start">
            <i data-lucide="infinity" class="w-7 h-7 text-green-400"></i>
            <span class="text-4xl font-black text-green-400/20 group-hover:text-green-400/30">04</span>
          </div>
          <h3 class="font-bold text-xl mt-4">Infinite Scale</h3>
          <p class="text-gray-300 text-sm mt-2">Serverless scaling from 0 to ∞ · pay‑per‑request · no cold starts</p>
          <div class="mt-5 h-1 bg-gray-800 rounded-full"><div class="h-full w-[99%] bg-gradient-to-r from-green-400 to-emerald-500 rounded-full"></div></div>
        </div>
      </div>
      <!-- additional micro stats -->
      <div class="grid grid-cols-2 md:grid-cols-4 gap-3 mt-6 reveal">
        <div class="glass-panel p-3 flex items-center gap-3 border-white/5"><i data-lucide="activity" class="w-4 h-4 text-cyan-400"></i><span class="text-xs font-mono">real‑time analytics</span></div>
        <div class="glass-panel p-3 flex items-center gap-3 border-white/5"><i data-lucide="webhook" class="w-4 h-4 text-purple-400"></i><span class="text-xs font-mono">webhook multiplex</span></div>
        <div class="glass-panel p-3 flex items-center gap-3 border-white/5"><i data-lucide="gauge" class="w-4 h-4 text-pink-400"></i><span class="text-xs font-mono">rate limiting AI</span></div>
        <div class="glass-panel p-3 flex items-center gap-3 border-white/5"><i data-lucide="bot" class="w-4 h-4 text-green-400"></i><span class="text-xs font-mono">reaction trainer</span></div>
      </div>
    </section>

    <!-- DEPLOYMENT + TERMINAL (roshidere's sleek technical block) -->
    <section id="deploy" class="py-20 px-6 max-w-7xl mx-auto">
      <div class="text-center mb-12 reveal">
        <span class="text-pink-400 font-mono text-sm tracking-widest bg-white/5 px-4 py-1 rounded-full">// EDGE_DEPLOYMENT //</span>
        <h2 class="text-4xl md:text-5xl font-bold mt-3">One‑click <span class="gradient-text">global launch</span></h2>
      </div>
      <div class="grid lg:grid-cols-2 gap-8 items-start">
        <!-- terminal card -->
        <div class="glass-panel overflow-hidden border-cyan-500/30 reveal">
          <div class="bg-black/40 px-5 py-3 border-b border-white/10 flex items-center gap-2">
            <div class="flex gap-1.5">
              <div class="w-3 h-3 rounded-full bg-red-400/70"></div>
              <div class="w-3 h-3 rounded-full bg-yellow-400/70"></div>
              <div class="w-3 h-3 rounded-full bg-green-400/70"></div>
            </div>
            <span class="text-xs font-mono text-cyan-400/80 ml-3">alisa@edge:~/deploy</span>
          </div>
          <div class="p-6 font-mono text-sm space-y-2 bg-black/20">
            <div class="text-gray-400">$ git clone https://github.com/Shineii86/AlisaReactionBot.git</div>
            <div class="text-green-400">✓ Cloning neural layers... done</div>
            <div class="text-gray-400">$ cd AlisaReactionBot && npm ci</div>
            <div class="text-green-400">✓ dependencies installed (workers runtime)</div>
            <div class="text-gray-400">$ cp .env.example .env</div>
            <div class="text-yellow-300">⚠️  set BOT_TOKEN + WEBHOOK_SECRET</div>
            <div class="text-gray-400">$ npm run deploy:cloudflare</div>
            <div class="text-cyan-400 animate-pulse">› Deploying to Cloudflare Workers edge network...</div>
            <div class="text-green-400">✔ Published: https://alisa-bot.edge.workers.dev</div>
            <div class="border-t border-gray-700 my-2 pt-2 text-gray-500"># alternative: Vercel</div>
            <div class="text-gray-400">$ npx vercel --prod</div>
          </div>
        </div>

        <!-- deploy cards (quick actions) -->
        <div class="space-y-5 reveal">
          <div class="glass-panel p-5 flex justify-between items-center hover:border-cyan-400/50 transition">
            <div><i data-lucide="cloud-lightning" class="w-7 h-7 text-orange-400"></i></div>
            <div class="flex-1 ml-4"><h4 class="font-bold">Cloudflare Workers</h4><p class="text-xs text-gray-400">Global edge · free tier available</p></div>
            <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn-primary text-xs px-4 py-2">Deploy →</a>
          </div>
          <div class="glass-panel p-5 flex justify-between items-center hover:border-purple-400/50 transition">
            <div><i data-lucide="triangle" class="w-7 h-7 text-white"></i></div>
            <div class="flex-1 ml-4"><h4 class="font-bold">Vercel Edge</h4><p class="text-xs text-gray-400">Serverless functions + instant cache</p></div>
            <a href="https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn-primary text-xs px-4 py-2">Deploy →</a>
          </div>
          <div class="bg-cyan-950/20 rounded-2xl p-4 border border-cyan-500/20 flex items-start gap-3">
            <i data-lucide="terminal" class="w-5 h-5 text-cyan-400 shrink-0 mt-0.5"></i>
            <div><p class="text-sm font-mono text-gray-300"><span class="text-cyan-400">⤷</span> Local dev: <code class="bg-black/50 px-2 py-0.5 rounded text-xs">npm run dev</code> — requires Wrangler CLI</p></div>
          </div>
        </div>
      </div>
    </section>

    <!-- PROTOCOL / CTA (inspired by roshidere's final engage) -->
    <section id="protocol" class="py-24 px-6 max-w-7xl mx-auto text-center">
      <div class="glass-panel p-8 md:p-12 max-w-4xl mx-auto reveal border-gradient">
        <i data-lucide="sparkles" class="w-10 h-10 text-cyan-400 mx-auto mb-4"></i>
        <h3 class="text-3xl md:text-4xl font-bold">Ready to integrate <span class="gradient-text">Alisa</span>?</h3>
        <p class="text-gray-300 max-w-xl mx-auto mt-3">Deploy your own neural reaction bot in minutes — full Telegram API compatibility, built-in analytics, and zero maintenance overhead.</p>
        <div class="flex flex-wrap gap-4 justify-center mt-8">
          <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn-primary px-6 py-3 flex items-center gap-2">
            <i data-lucide="github"></i> GitHub
          </a>
          <a href="https://t.me/AlisaReactionBot" target="_blank" class="bg-white/5 border border-white/20 rounded-full px-6 py-3 hover:bg-white/10 transition flex items-center gap-2">
            <i data-lucide="message-circle"></i> Try on Telegram
          </a>
        </div>
        <div class="text-[11px] font-mono text-gray-500 mt-8 flex justify-center gap-4">
          <span>⚡ edge-native</span> <span>🔒 zero-log</span> <span>🌍 28+ regions</span>
        </div>
      </div>
    </section>
  </main>

  <!-- FOOTER (clean minimal) -->
  <footer class="border-t border-white/10 py-8 mt-10 bg-black/30 backdrop-blur-sm">
    <div class="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500 font-mono">
      <div class="flex items-center gap-2">
        <i data-lucide="copyright" class="w-3 h-3"></i> 2026 Alisa Reaction Bot — neural-linked automation
      </div>
      <div class="flex items-center gap-5 mt-3 md:mt-0">
        <span>Built with <i data-lucide="heart" class="w-3 h-3 text-pink-400 inline"></i> by Shinei Nouzen</span>
        <span class="text-cyan-400">v2.0.0</span>
      </div>
    </div>
  </footer>

  <!-- dynamic particles -->
  <script>
    (function(){
      // init lucide icons
      lucide.createIcons();

      // scroll reveal observer
      const reveals = document.querySelectorAll('.reveal');
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if(entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });
      reveals.forEach(el => observer.observe(el));

      // floating particles effect (small tech vibe)
      const particleCount = 45;
      for(let i=0; i<particleCount; i++) {
        let particle = document.createElement('div');
        particle.classList.add('particle');
        let size = Math.random() * 3 + 1;
        particle.style.width = size + 'px';
        particle.style.height = size + 'px';
        particle.style.left = Math.random() * 100 + '%';
        particle.style.top = Math.random() * 100 + '%';
        particle.style.animation = `floatParticle ${Math.random() * 20 + 15}s infinite linear`;
        particle.style.opacity = Math.random() * 0.2 + 0.05;
        particle.style.background = `radial-gradient(circle, #00f3ff, #a855f7)`;
        document.body.appendChild(particle);
      }
      const styleAnim = document.createElement('style');
      styleAnim.textContent = `
        @keyframes floatParticle {
          0% { transform: translateY(0px) translateX(0px); }
          50% { transform: translateY(-30px) translateX(15px); }
          100% { transform: translateY(0px) translateX(0px); }
        }
        .particle { position: fixed; border-radius: 50%; pointer-events: none; z-index: -1; }
      `;
      document.head.appendChild(styleAnim);

      // small interactive hover for terminal command lines (just for style)
      const terminalLines = document.querySelectorAll('.font-mono .text-gray-400, .font-mono .text-green-400');
      terminalLines.forEach(line => {
        line.addEventListener('mouseenter', () => { line.classList.add('text-cyan-300'); });
        line.addEventListener('mouseleave', () => { line.classList.remove('text-cyan-300'); });
      });
    })();
  </script>
</body>
</html> 
`;
