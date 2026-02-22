export const startMessage = `👋 Oʜ? Hᴇʟʟᴏ, *userName*.

Sᴏ Yᴏᴜ Sᴛᴀʀᴛᴇᴅ Mᴇ. Nᴏᴛ Tʜᴀᴛ I Wᴀs Wᴀɪᴛɪɴɢ Oʀ Aɴʏᴛʜɪɴɢ.

🎊 Wᴇʟᴄᴏᴍᴇ Tᴏ *Aʟɪsᴀ Eᴍᴏᴊɪ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ* ✨
I’ʟʟ Mᴀᴋᴇ Yᴏᴜʀ Cʜᴀᴛs Mᴏʀᴇ Fᴜɴ… Iғ Yᴏᴜ Bᴇʜᴀᴠᴇ.

💬 *Hᴇʀᴇ's Hᴏᴡ I Sᴘɪᴄᴇ Uᴘ Yᴏᴜʀ Cʜᴀᴛs:*

✨ *Pʀɪᴠᴀᴛᴇ Cʜᴀᴛ*: I ʀᴇᴀᴄᴛ ᴛᴏ ʏᴏᴜʀ ᴍᴇssᴀɢᴇs ᴡɪᴛʜ ᴛʜᴇ ᴘᴇʀғᴇᴄᴛ ᴇᴍᴏᴊɪ.
🌸 *Gʀᴏᴜᴘs & Cʜᴀɴɴᴇʟs*: Aᴅᴅ ᴍᴇ ᴀɴᴅ I’ʟʟ ᴅʀᴏᴘ ғɪᴛᴛɪɴɢ ʀᴇᴀᴄᴛɪᴏɴs ᴡʜᴇɴ ᴛʜᴇ ᴍᴏᴏᴅ ғᴇᴇʟs ʀɪɢʜᴛ.

Cᴜʀɪᴏᴜs Aʙᴏᴜᴛ Mʏ Eᴍᴏᴊɪs? Usᴇ /ʀᴇᴀᴄᴛɪᴏɴs.

Lᴇᴛ’s Bʀɪɢʜᴛᴇɴ Yᴏᴜʀ Cʜᴀᴛs A Lɪᴛᴛʟᴇ.
I’ᴍ Oɴʟʏ Hᴇʟᴘɪɴɢ Bᴇᴄᴀᴜsᴇ I Wᴀɴᴛ Tᴏ… Oᴋᴀʏ?`

export const donateMessage = `🫣 Oʜ… Yᴏᴜ’ʀᴇ Sᴛɪʟʟ Hᴇʀᴇ?

Iғ Yᴏᴜ Eɴᴊᴏʏ Usɪɴɢ Aʟɪsᴀ Rᴇᴀᴄᴛɪᴏɴ Bᴏᴛ, Yᴏᴜ Cᴀɴ Sᴜᴘᴘᴏʀᴛ ɪᴛ.
Eᴠᴇɴ Oɴᴇ ⭐ Hᴇʟᴘs Kᴇᴇᴘ Iᴛ Oɴʟɪɴᴇ Aɴᴅ Iᴍᴘʀᴏᴠɪɴɢ.

Спасибо Fᴏʀ Yᴏᴜʀ Sᴜᴘᴘᴏʀᴛ.

I’ᴍ Oɴʟʏ Sᴀʏɪɴɢ Tʜɪs Bᴇᴄᴀᴜsᴇ I Aᴘᴘʀᴇᴄɪᴀᴛᴇ Yᴏᴜ.`

export const htmlContent = `
<!DOCTYPE html>
<html lang="en" class="scroll-smooth">
<head>
 <meta charset="UTF-8">
 <meta name="viewport" content="width=device-width, initial-scale=1.0">
 <title>ALISA REACTION BOT · Next-Gen Telegram Automation</title>
 
 <!-- Modern Typography: Space Grotesk for headings, Inter for body -->
 <link rel="preconnect" href="https://fonts.googleapis.com">
 <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
 <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@400;500;600;700&display=swap" rel="stylesheet">
 
 <!-- Tailwind CSS -->
 <script src="https://cdn.tailwindcss.com"></script>
 
 <!-- GSAP for animations -->
 <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/gsap.min.js"></script>
 <script src="https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.2/ScrollTrigger.min.js"></script>
 
 <!-- Lucide Icons -->
 <script src="https://unpkg.com/lucide@latest"></script>

 <script>
   tailwind.config = {
     darkMode: 'class',
     theme: {
       extend: {
         fontFamily: {
           sans: ['Inter', 'sans-serif'],
           display: ['Space Grotesk', 'sans-serif'],
         },
         colors: {
           primary: {
             50: '#f0f9ff',
             100: '#e0f2fe',
             200: '#bae6fd',
             300: '#7dd3fc',
             400: '#38bdf8',
             500: '#0ea5e9',
             600: '#0284c7',
             700: '#0369a1',
             800: '#075985',
             900: '#0c4a6e',
           },
           accent: {
             purple: '#8b5cf6',
             pink: '#ec4899',
             cyan: '#06b6d4',
           }
         },
         animation: {
           'float': 'float 6s ease-in-out infinite',
           'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
           'gradient-x': 'gradient-x 15s ease infinite',
         },
         keyframes: {
           float: {
             '0%, 100%': { transform: 'translateY(0)' },
             '50%': { transform: 'translateY(-20px)' },
           },
           'gradient-x': {
             '0%, 100%': { 'background-position': '0% 50%' },
             '50%': { 'background-position': '100% 50%' },
           }
         }
       }
     }
   }
 </script>

 <style>
   /* Custom Scrollbar */
   ::-webkit-scrollbar {
     width: 10px;
   }
   ::-webkit-scrollbar-track {
     background: #0f172a;
   }
   ::-webkit-scrollbar-thumb {
     background: linear-gradient(180deg, #8b5cf6, #ec4899);
     border-radius: 5px;
   }
   ::-webkit-scrollbar-thumb:hover {
     background: linear-gradient(180deg, #7c3aed, #db2777);
   }

   /* Noise Texture Overlay */
   .noise-overlay {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     pointer-events: none;
     z-index: 50;
     opacity: 0.03;
     background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
   }

   /* Glassmorphism Utilities */
   .glass {
     background: rgba(255, 255, 255, 0.03);
     backdrop-filter: blur(16px);
     -webkit-backdrop-filter: blur(16px);
     border: 1px solid rgba(255, 255, 255, 0.08);
   }
   
   .glass-card {
     background: linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0.01) 100%);
     backdrop-filter: blur(20px);
     border: 1px solid rgba(255,255,255,0.1);
     box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.37);
   }

   /* Gradient Text */
   .text-gradient {
     background: linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }

   .text-gradient-cyan {
     background: linear-gradient(135deg, #06b6d4 0%, #3b82f6 50%, #8b5cf6 100%);
     -webkit-background-clip: text;
     -webkit-text-fill-color: transparent;
     background-clip: text;
   }

   /* Mesh Gradient Background */
   .mesh-bg {
     background-color: #0f172a;
     background-image: 
       radial-gradient(at 0% 0%, hsla(253,16%,7%,1) 0, transparent 50%), 
       radial-gradient(at 50% 0%, hsla(225,39%,30%,1) 0, transparent 50%), 
       radial-gradient(at 100% 0%, hsla(339,49%,30%,1) 0, transparent 50%);
   }

   /* Animated Border */
   .animated-border {
     position: relative;
     background: rgba(255, 255, 255, 0.05);
     border-radius: 16px;
     overflow: hidden;
   }
   .animated-border::before {
     content: '';
     position: absolute;
     inset: -2px;
     background: linear-gradient(90deg, #8b5cf6, #ec4899, #06b6d4, #8b5cf6);
     background-size: 300% 300%;
     animation: gradient-x 3s ease infinite;
     border-radius: 18px;
     z-index: -1;
   }

   /* Custom Cursor */
   .cursor-glow {
     width: 20px;
     height: 20px;
     background: radial-gradient(circle, rgba(139, 92, 246, 0.6) 0%, transparent 70%);
     border-radius: 50%;
     position: fixed;
     pointer-events: none;
     z-index: 9999;
     transition: transform 0.1s;
   }

   /* Toggle Switch */
   .toggle-checkbox:checked {
     right: 0;
     border-color: #8b5cf6;
   }
   .toggle-checkbox:checked + .toggle-label {
     background-color: #8b5cf6;
   }
   
   /* Code Block Styling */
   .code-block {
     background: #1e1b4b;
     border-radius: 12px;
     padding: 1.5rem;
     font-family: 'Fira Code', monospace;
     font-size: 0.875rem;
     overflow-x: auto;
     border: 1px solid rgba(139, 92, 246, 0.3);
   }

   /* Particle Canvas */
   #particles-canvas {
     position: fixed;
     top: 0;
     left: 0;
     width: 100%;
     height: 100%;
     pointer-events: none;
     z-index: 1;
   }
 </style>
</head>
<body class="bg-slate-900 text-white overflow-x-hidden selection:bg-purple-500 selection:text-white">

 <!-- Noise Overlay -->
 <div class="noise-overlay"></div>
 
 <!-- Particle Canvas -->
 <canvas id="particles-canvas"></canvas>

 <!-- Cursor Glow -->
 <div class="cursor-glow hidden md:block" id="cursor"></div>

 <!-- Navigation -->
 <nav class="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300" id="navbar">
   <div class="max-w-7xl mx-auto glass rounded-2xl px-6 py-3 flex items-center justify-between">
     <div class="flex items-center gap-3 group cursor-pointer">
       <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center transform group-hover:rotate-12 transition-transform">
         <i data-lucide="bot" class="w-6 h-6 text-white"></i>
       </div>
       <span class="font-display font-bold text-xl tracking-tight">ALISA</span>
     </div>
     
     <div class="hidden md:flex items-center gap-8">
       <a href="#features" class="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
         Features
         <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
       </a>
       <a href="#deploy" class="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
         Deploy
         <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
       </a>
       <a href="#stats" class="text-sm font-medium text-slate-300 hover:text-white transition-colors relative group">
         Stats
         <span class="absolute -bottom-1 left-0 w-0 h-0.5 bg-purple-500 transition-all group-hover:w-full"></span>
       </a>
     </div>

     <div class="flex items-center gap-4">
       <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="p-2 text-slate-300 hover:text-white transition-colors">
         <i data-lucide="github" class="w-5 h-5"></i>
       </a>
       <a href="https://t.me/AlisaReactionBot" target="_blank" class="hidden sm:flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-purple-600 to-pink-600 rounded-full font-medium text-sm hover:shadow-lg hover:shadow-purple-500/25 transition-all transform hover:scale-105">
         <i data-lucide="send" class="w-4 h-4"></i>
         Open Bot
       </a>
     </div>
   </div>
 </nav>

 <!-- Hero Section -->
 <section class="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden mesh-bg">
   <!-- Background Elements -->
   <div class="absolute inset-0 overflow-hidden">
     <div class="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse-slow"></div>
     <div class="absolute bottom-1/4 right-1/4 w-96 h-96 bg-cyan-600/20 rounded-full blur-3xl animate-pulse-slow" style="animation-delay: 2s;"></div>
     <div class="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-pink-600/10 rounded-full blur-3xl"></div>
   </div>

   <div class="relative z-10 max-w-7xl mx-auto px-6 grid lg:grid-cols-2 gap-12 items-center">
     <!-- Left Content -->
     <div class="space-y-8 text-center lg:text-left">
       <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-purple-500/30 text-sm font-medium text-purple-300 animate-float">
         <span class="w-2 h-2 rounded-full bg-green-400 animate-pulse"></span>
         v2.0 Now Available
       </div>
       
       <h1 class="font-display text-5xl md:text-7xl font-bold leading-tight">
         Automate Reactions with 
         <span class="text-gradient">Intelligence</span>
       </h1>
       
       <p class="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
         The most advanced serverless Telegram reaction bot. Built on Cloudflare Workers for sub-100ms response times and infinite scalability.
       </p>

       <div class="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
         <a href="https://t.me/AlisaReactionBot" target="_blank" class="group relative px-8 py-4 bg-white text-slate-900 rounded-full font-semibold overflow-hidden transition-all hover:shadow-2xl hover:shadow-white/20">
           <span class="relative z-10 flex items-center justify-center gap-2">
             <i data-lucide="rocket" class="w-5 h-5"></i>
             Try Live Demo
           </span>
           <div class="absolute inset-0 bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-100 transition-opacity"></div>
         </a>
         
         <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="px-8 py-4 glass rounded-full font-semibold border border-white/10 hover:border-white/30 transition-all flex items-center justify-center gap-2 group">
           <i data-lucide="star" class="w-5 h-5 group-hover:text-yellow-400 transition-colors"></i>
           Star on GitHub
         </a>
       </div>

       <div class="flex items-center gap-6 justify-center lg:justify-start pt-4">
         <div class="flex -space-x-3">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=1" class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800" alt="user">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=2" class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800" alt="user">
           <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=3" class="w-10 h-10 rounded-full border-2 border-slate-900 bg-slate-800" alt="user">
           <div class="w-10 h-10 rounded-full border-2 border-slate-900 bg-purple-600 flex items-center justify-center text-xs font-bold">+2k</div>
         </div>
         <div class="text-sm text-slate-400">
           <span class="text-white font-semibold">2,000+</span> active users
         </div>
       </div>
     </div>

     <!-- Right Content - Interactive Card -->
     <div class="relative">
       <div class="absolute inset-0 bg-gradient-to-r from-purple-600 to-pink-600 rounded-3xl blur-2xl opacity-30 transform rotate-6"></div>
       <div class="relative glass-card rounded-3xl p-8 transform hover:scale-[1.02] transition-transform duration-500">
         <!-- Mock Chat Interface -->
         <div class="space-y-4">
           <div class="flex items-center justify-between border-b border-white/10 pb-4">
             <div class="flex items-center gap-3">
               <div class="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                 <i data-lucide="bot" class="w-6 h-6"></i>
               </div>
               <div>
                 <h3 class="font-semibold">Alisa Bot</h3>
                 <p class="text-xs text-green-400 flex items-center gap-1">
                   <span class="w-1.5 h-1.5 rounded-full bg-green-400"></span>
                   Online
                 </p>
               </div>
             </div>
             <div class="flex gap-2">
               <div class="w-3 h-3 rounded-full bg-red-500/20 border border-red-500/50"></div>
               <div class="w-3 h-3 rounded-full bg-yellow-500/20 border border-yellow-500/50"></div>
               <div class="w-3 h-3 rounded-full bg-green-500/20 border border-green-500/50"></div>
             </div>
           </div>

           <div class="space-y-3 py-4">
             <div class="flex gap-3">
               <div class="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0"></div>
               <div class="glass rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                 <p class="text-sm">Hey! Can you react to all messages in this group?</p>
               </div>
             </div>
             
             <div class="flex gap-3 flex-row-reverse">
               <div class="w-8 h-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex-shrink-0 flex items-center justify-center">
                 <i data-lucide="bot" class="w-4 h-4"></i>
               </div>
               <div class="bg-gradient-to-r from-purple-600/20 to-pink-600/20 border border-purple-500/30 rounded-2xl rounded-tr-none px-4 py-2 max-w-[80%]">
                 <p class="text-sm">Absolutely! I'm now monitoring this chat. I'll react with emojis based on message content 🎯</p>
               </div>
             </div>

             <div class="flex gap-3">
               <div class="w-8 h-8 rounded-full bg-slate-700 flex-shrink-0"></div>
               <div class="glass rounded-2xl rounded-tl-none px-4 py-2 max-w-[80%]">
                 <p class="text-sm">Great! This is amazing 🔥</p>
                 <div class="flex gap-1 mt-2">
                   <span class="text-lg animate-bounce">🔥</span>
                   <span class="text-lg animate-bounce" style="animation-delay: 0.1s">❤️</span>
                   <span class="text-lg animate-bounce" style="animation-delay: 0.2s">🚀</span>
                 </div>
               </div>
             </div>
           </div>

           <div class="relative">
             <input type="text" placeholder="Type a message..." class="w-full bg-slate-800/50 border border-white/10 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500/50 transition-colors" readonly>
             <button class="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors">
               <i data-lucide="send" class="w-4 h-4"></i>
             </button>
           </div>
         </div>
       </div>
     </div>
   </div>

   <!-- Scroll Indicator -->
   <div class="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
     <i data-lucide="chevron-down" class="w-6 h-6 text-slate-400"></i>
   </div>
 </section>

 <!-- Features Grid -->
 <section id="features" class="relative py-32 bg-slate-900">
   <div class="max-w-7xl mx-auto px-6">
     <div class="text-center mb-20">
       <h2 class="font-display text-4xl md:text-5xl font-bold mb-6">
         Built for <span class="text-gradient-cyan">Performance</span>
       </h2>
       <p class="text-slate-400 text-lg max-w-2xl mx-auto">
         Every millisecond counts. Alisa is engineered from the ground up for speed, reliability, and scale.
       </p>
     </div>

     <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
       <!-- Feature Cards -->
       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-purple-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-purple-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="zap" class="w-7 h-7 text-purple-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Lightning Fast</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             Sub-100ms reaction times powered by Cloudflare's global edge network. No latency, no waiting.
           </p>
         </div>
       </div>

       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-pink-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-pink-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="shield" class="w-7 h-7 text-pink-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Secure by Design</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             Environment variable protection, input validation, and rate limiting built-in. Your data never touches a disk.
           </p>
         </div>
       </div>

       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-cyan-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-cyan-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="globe" class="w-7 h-7 text-cyan-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Global Edge</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             Deployed on 300+ data centers worldwide. Your bot is always closest to your users.
           </p>
         </div>
       </div>

       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-emerald-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-emerald-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="bar-chart-3" class="w-7 h-7 text-emerald-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Analytics</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             Detailed logging and metrics. Track reaction counts, popular emojis, and chat activity in real-time.
           </p>
         </div>
       </div>

       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-orange-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-orange-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="sliders" class="w-7 h-7 text-orange-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Highly Configurable</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             Custom emoji sets, randomization levels (0-10), selective chat restrictions. Tailor it to your needs.
           </p>
         </div>
       </div>

       <div class="feature-card group relative p-8 rounded-2xl glass-card hover:bg-white/5 transition-all duration-300 transform hover:-translate-y-1">
         <div class="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity rounded-2xl"></div>
         <div class="relative">
           <div class="w-14 h-14 rounded-xl bg-blue-500/20 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
             <i data-lucide="infinity" class="w-7 h-7 text-blue-400"></i>
           </div>
           <h3 class="font-display text-xl font-semibold mb-3">Auto-Scaling</h3>
           <p class="text-slate-400 text-sm leading-relaxed">
             From 0 to millions of requests. Zero configuration required. Pay only for what you use.
           </p>
         </div>
       </div>
     </div>
   </div>
 </section>

 <!-- Interactive Quote Section -->
 <section class="py-32 relative overflow-hidden">
   <div class="absolute inset-0 bg-gradient-to-b from-slate-900 via-purple-900/20 to-slate-900"></div>
   <div class="max-w-4xl mx-auto px-6 relative z-10 text-center">
     <div class="mb-8">
       <i data-lucide="quote" class="w-16 h-16 text-purple-500/30 mx-auto"></i>
     </div>
     
     <blockquote class="mb-8">
       <p id="quote-text" class="font-display text-3xl md:text-5xl font-medium leading-tight transition-all duration-500">
         "The most intelligent reaction bot on Telegram – it feels <span class="text-gradient">alive</span>."
       </p>
     </blockquote>

     <div class="flex items-center justify-center gap-4 mb-8">
       <button onclick="toggleLanguage()" class="flex items-center gap-3 px-6 py-3 rounded-full glass border border-white/10 hover:border-purple-500/50 transition-all group">
         <span class="text-sm font-medium text-slate-300 group-hover:text-white" id="lang-label">EN</span>
         <div class="w-12 h-6 rounded-full bg-slate-700 relative transition-colors" id="toggle-bg">
           <div class="w-4 h-4 rounded-full bg-white absolute top-1 left-1 transition-transform" id="toggle-dot"></div>
         </div>
         <span class="text-sm font-medium text-slate-500 group-hover:text-slate-300">RU</span>
       </button>
     </div>

     <cite class="text-slate-400 not-italic">
       — <span class="text-white font-medium">Early Beta Tester</span>, Telegram Power User
     </cite>
   </div>
 </section>

 <!-- Stats Section -->
 <section id="stats" class="py-32 bg-slate-900 relative">
   <div class="max-w-7xl mx-auto px-6">
     <div class="grid grid-cols-2 md:grid-cols-4 gap-6">
       <div class="glass-card rounded-2xl p-8 text-center group hover:border-purple-500/30 transition-all">
         <div class="text-4xl md:text-5xl font-display font-bold text-gradient mb-2 counter" data-target="16">0</div>
         <div class="text-slate-400 text-sm font-medium uppercase tracking-wider">GitHub Stars</div>
       </div>
       <div class="glass-card rounded-2xl p-8 text-center group hover:border-pink-500/30 transition-all">
         <div class="text-4xl md:text-5xl font-display font-bold text-gradient mb-2 counter" data-target="4">0</div>
         <div class="text-slate-400 text-sm font-medium uppercase tracking-wider">Forks</div>
       </div>
       <div class="glass-card rounded-2xl p-8 text-center group hover:border-cyan-500/30 transition-all">
         <div class="text-4xl md:text-5xl font-display font-bold text-gradient mb-2 counter" data-target="99">0</div>
         <div class="text-slate-400 text-sm font-medium uppercase tracking-wider">% Uptime</div>
       </div>
       <div class="glass-card rounded-2xl p-8 text-center group hover:border-emerald-500/30 transition-all">
         <div class="text-4xl md:text-5xl font-display font-bold text-gradient mb-2"><span class="counter" data-target="100">0</span>ms</div>
         <div class="text-slate-400 text-sm font-medium uppercase tracking-wider">Response</div>
       </div>
     </div>
   </div>
 </section>

 <!-- Deployment Section -->
 <section id="deploy" class="py-32 relative">
   <div class="max-w-5xl mx-auto px-6">
     <div class="text-center mb-16">
       <h2 class="font-display text-4xl md:text-5xl font-bold mb-6">
         Deploy in <span class="text-gradient">Seconds</span>
       </h2>
       <p class="text-slate-400 text-lg">
         Choose your preferred platform. One click deployment with zero configuration.
       </p>
     </div>

     <div class="grid md:grid-cols-2 gap-6 mb-12">
       <a href="https://deploy.workers.cloudflare.com/?url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="group relative p-8 rounded-2xl glass-card border border-orange-500/20 hover:border-orange-500/50 transition-all hover:-translate-y-1">
         <div class="flex items-center gap-4 mb-4">
           <div class="w-12 h-12 rounded-xl bg-orange-500/20 flex items-center justify-center">
             <i data-lucide="cloud" class="w-6 h-6 text-orange-400"></i>
           </div>
           <div>
             <h3 class="font-display text-xl font-semibold">Cloudflare Workers</h3>
             <p class="text-sm text-slate-400">Recommended</p>
           </div>
         </div>
         <p class="text-slate-400 text-sm mb-4">Edge deployment with 0ms cold start. Perfect for Telegram bots.</p>
         <div class="flex items-center text-orange-400 text-sm font-medium group-hover:gap-2 transition-all">
           Deploy Now <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
         </div>
       </a>

       <a href="https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="group relative p-8 rounded-2xl glass-card border border-white/10 hover:border-white/30 transition-all hover:-translate-y-1">
         <div class="flex items-center gap-4 mb-4">
           <div class="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center">
             <i data-lucide="triangle" class="w-6 h-6 text-white"></i>
           </div>
           <div>
             <h3 class="font-display text-xl font-semibold">Vercel</h3>
             <p class="text-sm text-slate-400">Serverless Functions</p>
           </div>
         </div>
         <p class="text-slate-400 text-sm mb-4">Deploy as a serverless function with automatic HTTPS.</p>
         <div class="flex items-center text-white text-sm font-medium group-hover:gap-2 transition-all">
           Deploy Now <i data-lucide="arrow-right" class="w-4 h-4 ml-1"></i>
         </div>
       </a>
     </div>

     <!-- Prerequisites -->
     <div class="glass-card rounded-2xl p-8 border border-purple-500/20">
       <h3 class="font-display text-xl font-semibold mb-6 flex items-center gap-2">
         <i data-lucide="check-circle" class="w-5 h-5 text-purple-400"></i>
         Prerequisites
       </h3>
       <div class="grid md:grid-cols-2 gap-4">
         <div class="flex items-center gap-3 text-slate-300">
           <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
             <i data-lucide="check" class="w-3 h-3 text-green-400"></i>
           </div>
           <span class="text-sm">Telegram Bot Token (@BotFather)</span>
         </div>
         <div class="flex items-center gap-3 text-slate-300">
           <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
             <i data-lucide="check" class="w-3 h-3 text-green-400"></i>
           </div>
           <span class="text-sm">Cloudflare Account (Free tier works)</span>
         </div>
         <div class="flex items-center gap-3 text-slate-300">
           <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
             <i data-lucide="check" class="w-3 h-3 text-green-400"></i>
           </div>
           <span class="text-sm">GitHub Account</span>
         </div>
         <div class="flex items-center gap-3 text-slate-300">
           <div class="w-6 h-6 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0">
             <i data-lucide="check" class="w-3 h-3 text-green-400"></i>
           </div>
           <span class="text-sm">Node.js 18+ (for local dev)</span>
         </div>
       </div>
     </div>
   </div>
 </section>

 <!-- Footer -->
 <footer class="relative py-20 border-t border-white/10 bg-slate-900">
   <div class="max-w-7xl mx-auto px-6">
     <div class="grid md:grid-cols-4 gap-12 mb-12">
       <div class="col-span-2">
         <div class="flex items-center gap-3 mb-6">
           <div class="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
             <i data-lucide="bot" class="w-6 h-6 text-white"></i>
           </div>
           <span class="font-display font-bold text-2xl">ALISA</span>
         </div>
         <p class="text-slate-400 mb-6 max-w-sm">
           Advanced Telegram automation built for the modern web. Open source, serverless, and infinitely scalable.
         </p>
         <div class="flex gap-4">
           <a href="https://github.com/Shineii86" target="_blank" class="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white hover:border-purple-500/50 transition-all">
             <i data-lucide="github" class="w-5 h-5"></i>
           </a>
           <a href="https://telegram.me/Shineii86" target="_blank" class="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white hover:border-blue-500/50 transition-all">
             <i data-lucide="send" class="w-5 h-5"></i>
           </a>
           <a href="mailto:ikx7a@hotmail.com" class="w-10 h-10 rounded-full glass flex items-center justify-center text-slate-400 hover:text-white hover:border-red-500/50 transition-all">
             <i data-lucide="mail" class="w-5 h-5"></i>
           </a>
         </div>
       </div>
       
       <div>
         <h4 class="font-semibold mb-4">Product</h4>
         <ul class="space-y-2 text-sm text-slate-400">
           <li><a href="#features" class="hover:text-white transition-colors">Features</a></li>
           <li><a href="#deploy" class="hover:text-white transition-colors">Deploy</a></li>
           <li><a href="https://github.com/Shineii86/AlisaReactionBot/blob/main/README.md" target="_blank" class="hover:text-white transition-colors">Documentation</a></li>
           <li><a href="https://github.com/Shineii86/AlisaReactionBot/releases" target="_blank" class="hover:text-white transition-colors">Changelog</a></li>
         </ul>
       </div>

       <div>
         <h4 class="font-semibold mb-4">Legal</h4>
         <ul class="space-y-2 text-sm text-slate-400">
           <li><a href="#" class="hover:text-white transition-colors">MIT License</a></li>
           <li><a href="#" class="hover:text-white transition-colors">Privacy Policy</a></li>
           <li><a href="#" class="hover:text-white transition-colors">Terms of Service</a></li>
         </ul>
       </div>
     </div>
     
     <div class="pt-8 border-t border-white/10 flex flex-col md:flex-row justify-between items-center gap-4">
       <p class="text-slate-500 text-sm">
         © 2026 Shinei Nouzen. All rights reserved.
       </p>
       <p class="text-slate-600 text-sm flex items-center gap-2">
         Made with <i data-lucide="heart" class="w-4 h-4 text-pink-500 fill-pink-500"></i> for the Telegram community
       </p>
     </div>
   </div>
 </footer>

 <script>
   // Initialize Lucide Icons
   lucide.createIcons();

   // Custom Cursor
   const cursor = document.getElementById('cursor');
   document.addEventListener('mousemove', (e) => {
     cursor.style.left = e.clientX - 10 + 'px';
     cursor.style.top = e.clientY - 10 + 'px';
   });

   // Navbar Scroll Effect
   const navbar = document.getElementById('navbar');
   window.addEventListener('scroll', () => {
     if (window.scrollY > 50) {
       navbar.classList.add('py-2');
       navbar.classList.remove('py-4');
     } else {
       navbar.classList.add('py-4');
       navbar.classList.remove('py-2');
     }
   });

   // Language Toggle
   let isRussian = false;
   const quotes = {
     en: "The most intelligent reaction bot on Telegram – it feels <span class='text-gradient'>alive</span>.",
     ru: "Самый умный бот реакций в Telegram – он словно <span class='text-gradient'>живой</span>."
   };

   function toggleLanguage() {
     isRussian = !isRussian;
     const quoteText = document.getElementById('quote-text');
     const toggleDot = document.getElementById('toggle-dot');
     const toggleBg = document.getElementById('toggle-bg');
     
     quoteText.style.opacity = '0';
     
     setTimeout(() => {
       quoteText.innerHTML = isRussian ? quotes.ru : quotes.en;
       quoteText.style.opacity = '1';
     }, 250);

     if (isRussian) {
       toggleDot.style.transform = 'translateX(24px)';
       toggleBg.classList.add('bg-purple-600');
       toggleBg.classList.remove('bg-slate-700');
     } else {
       toggleDot.style.transform = 'translateX(0)';
       toggleBg.classList.remove('bg-purple-600');
       toggleBg.classList.add('bg-slate-700');
     }
   }

   // GSAP Animations
   gsap.registerPlugin(ScrollTrigger);

   // Animate feature cards on scroll
   gsap.from('.feature-card', {
     scrollTrigger: {
       trigger: '#features',
       start: 'top 80%',
     },
     y: 50,
     opacity: 0,
     duration: 0.8,
     stagger: 0.1,
     ease: 'power3.out'
   });

   // Animate stats counters
   const counters = document.querySelectorAll('.counter');
   counters.forEach(counter => {
     const target = parseInt(counter.getAttribute('data-target'));
     gsap.to(counter, {
       scrollTrigger: {
         trigger: counter,
         start: 'top 85%',
       },
       innerHTML: target,
       duration: 2,
       snap: { innerHTML: 1 },
       ease: 'power2.out'
     });
   });

   // Particle System
   const canvas = document.getElementById('particles-canvas');
   const ctx = canvas.getContext('2d');
   let particles = [];
   let mouse = { x: null, y: null };

   function resizeCanvas() {
     canvas.width = window.innerWidth;
     canvas.height = window.innerHeight;
   }

   class Particle {
     constructor() {
       this.x = Math.random() * canvas.width;
       this.y = Math.random() * canvas.height;
       this.size = Math.random() * 2 + 0.5;
       this.speedX = Math.random() * 1 - 0.5;
       this.speedY = Math.random() * 1 - 0.5;
       this.opacity = Math.random() * 0.5 + 0.1;
     }

     update() {
       this.x += this.speedX;
       this.y += this.speedY;

       if (this.x > canvas.width) this.x = 0;
       if (this.x < 0) this.x = canvas.width;
       if (this.y > canvas.height) this.y = 0;
       if (this.y < 0) this.y = canvas.height;

       // Mouse interaction
       if (mouse.x != null) {
         let dx = mouse.x - this.x;
         let dy = mouse.y - this.y;
         let distance = Math.sqrt(dx * dx + dy * dy);
         if (distance < 100) {
           const forceDirectionX = dx / distance;
           const forceDirectionY = dy / distance;
           const force = (100 - distance) / 100;
           const directionX = forceDirectionX * force * 0.6;
           const directionY = forceDirectionY * force * 0.6;
           this.speedX -= directionX;
           this.speedY -= directionY;
         }
       }
     }

     draw() {
       ctx.fillStyle = \`rgba(147, 51, 234, \${this.opacity})\`;
       ctx.beginPath();
       ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
       ctx.fill();
     }
   }

   function initParticles() {
     particles = [];
     const particleCount = Math.min(window.innerWidth / 10, 100);
     for (let i = 0; i < particleCount; i++) {
       particles.push(new Particle());
     }
   }

   function animateParticles() {
     ctx.clearRect(0, 0, canvas.width, canvas.height);
     particles.forEach(particle => {
       particle.update();
       particle.draw();
     });
     
     // Connect particles
     particles.forEach((a, index) => {
       particles.slice(index + 1).forEach(b => {
         let dx = a.x - b.x;
         let dy = a.y - b.y;
         let distance = Math.sqrt(dx * dx + dy * dy);
         
         if (distance < 150) {
           ctx.strokeStyle = \`rgba(147, 51, 234, \${0.1 * (1 - distance/150)})\`;
           ctx.lineWidth = 0.5;
           ctx.beginPath();
           ctx.moveTo(a.x, a.y);
           ctx.lineTo(b.x, b.y);
           ctx.stroke();
         }
       });
     });
     
     requestAnimationFrame(animateParticles);
   }

   window.addEventListener('resize', () => {
     resizeCanvas();
     initParticles();
   });

   window.addEventListener('mousemove', (e) => {
     mouse.x = e.x;
     mouse.y = e.y;
   });

   window.addEventListener('mouseout', () => {
     mouse.x = null;
     mouse.y = null;
   });

   resizeCanvas();
   initParticles();
   animateParticles();
 </script>
</body>
</html>
`;
