/*
 * ======= • ======= • ======= • ======= • =======• =======
 * Alisa Reaction Bot — landing.js
 * Repository: https://github.com/Shineii86/AlisaReactionBot
 *
 * @description
 *   Landing page HTML template. Self-contained single-page
 *   with inline CSS, Lucide icons, scroll animations,
 *   and character DNA section.
 *
 * @exports htmlContent (named)
 *
 * @version 2.14.0
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

export const htmlContent = `
<!DOCTYPE html>
<html lang="en" prefix="og: https://ogp.me/ns#">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
  <title>Alisa · Neural Reaction Engine</title>

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Favicon Stack — Every size for every platform              -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%236366f1' stroke-width='1.5'%3E%3Cpath d='M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5'/%3E%3C/svg%3E">
  <link rel="icon" type="image/png" sizes="32x32" href="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/logo.png">
  <link rel="apple-touch-icon" href="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/logo2.png">
  <meta name="theme-color" content="#6366f1">
  <meta name="msapplication-TileColor" content="#6366f1">

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Primary Meta — Search engines + browser tabs               -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta name="description" content="Alisa Reaction Bot — ultra-low latency Telegram automation inspired by Alisa Mikhailovna Kujou. Edge-deployed neural architecture. Auto-react to messages with curated emojis.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://alisareactionbot.vercel.app">

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Open Graph — Facebook, Discord, Telegram preview, LinkedIn -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta property="og:title" content="Alisa · Neural Reaction Engine" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://alisareactionbot.vercel.app" />
  <meta property="og:image" content="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/banner1.png" />
  <meta property="og:image:secure_url" content="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/banner1.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="640" />
  <meta property="og:image:alt" content="Alisa Reaction Bot — Automated Telegram Reactions" />
  <meta property="og:description" content="Sub-100ms Telegram automation. Inspired by Alisa Mikhailovna Kujou — the tsundere ice queen whose Russian slips through when emotions run high. Edge-deployed, zero-log, infinite scale." />
  <meta property="og:site_name" content="Alisa Reaction Bot" />
  <meta property="og:locale" content="en_US" />

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Twitter Card — X/Twitter preview                           -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Shineii86" />
  <meta name="twitter:creator" content="@Shineii86" />
  <meta name="twitter:title" content="Alisa · Neural Reaction Engine" />
  <meta name="twitter:description" content="Sub-100ms Telegram automation. Inspired by Alisa Mikhailovna Kujou. Edge-deployed, zero-log, infinite scale." />
  <meta name="twitter:image" content="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/banner1.png" />
  <meta name="twitter:image:alt" content="Alisa Reaction Bot — Automated Telegram Reactions" />
  <meta name="twitter:domain" content="alisareactionbot.vercel.app" />

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- JSON-LD Structured Data — Google rich results              -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Alisa Reaction Bot",
    "description": "Automated Telegram reaction bot inspired by Alisa Mikhailovna Kujou. Sub-100ms latency, edge-deployed serverless architecture, per-chat customization, and privacy-first design.",
    "url": "https://alisareactionbot.vercel.app",
    "applicationCategory": "CommunicationApplication",
    "operatingSystem": "Cloudflare Workers, Vercel, Docker",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "author": {
      "@type": "Person",
      "name": "Shinei Nouzen",
      "url": "https://github.com/Shineii86"
    },
    "image": "https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/main/assets/banner1.png",
    "softwareVersion": "2.14.0",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    }
  }
  </script>

  <script src="https://unpkg.com/lucide@latest"></script>
  <style>
    :root {
      --bg: #fafafa;
      --bg-alt: #f1f3f9;
      --bg-card: #ffffff;
      --surface: #f8f9fc;
      --border: #e5e7eb;
      --border-hover: #c4b5fd;
      --text: #1e1b4b;
      --text-secondary: #4b5563;
      --text-muted: #9ca3af;
      --primary: #6366f1;
      --primary-light: #818cf8;
      --primary-bg: #eef2ff;
      --accent: #06b6d4;
      --accent-bg: #ecfeff;
      --success: #10b981;
      --success-bg: #ecfdf5;
      --warning: #f59e0b;
      --gradient-main: linear-gradient(135deg, #6366f1 0%, #06b6d4 100%);
      --gradient-soft: linear-gradient(135deg, rgba(99,102,241,0.06) 0%, rgba(6,182,212,0.06) 100%);
      --radius: 16px;
      --radius-lg: 24px;
      --radius-sm: 10px;
      --font: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
      --mono: 'JetBrains Mono', 'SF Mono', monospace;
      --shadow-sm: 0 1px 3px rgba(0,0,0,0.04), 0 1px 2px rgba(0,0,0,0.06);
      --shadow-md: 0 4px 16px rgba(0,0,0,0.06), 0 2px 4px rgba(0,0,0,0.04);
      --shadow-lg: 0 12px 40px rgba(0,0,0,0.08), 0 4px 12px rgba(0,0,0,0.04);
      --shadow-xl: 0 24px 60px rgba(0,0,0,0.1);
    }

    *, *::before, *::after { margin: 0; padding: 0; box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body {
      font-family: var(--font);
      background: var(--bg);
      color: var(--text);
      line-height: 1.65;
      overflow-x: hidden;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }

    a { color: var(--primary); text-decoration: none; transition: all 0.2s; }
    a:hover { color: var(--primary-light); }
    ::selection { background: rgba(99,102,241,0.15); color: var(--text); }
    ::-webkit-scrollbar { width: 8px; }
    ::-webkit-scrollbar-track { background: var(--bg-alt); }
    ::-webkit-scrollbar-thumb { background: #d1d5db; border-radius: 4px; }
    ::-webkit-scrollbar-thumb:hover { background: #9ca3af; }

    .container { max-width: 1140px; margin: 0 auto; padding: 0 24px; }
    section { padding: 100px 0; }

    /* Background */
    .bg-pattern {
      position: fixed; inset: 0; z-index: -2;
      background-image:
        radial-gradient(circle at 1px 1px, rgba(99,102,241,0.05) 1px, transparent 0);
      background-size: 40px 40px;
    }
    .bg-blur-top {
      position: fixed; top: -300px; right: -200px; z-index: -1;
      width: 700px; height: 700px; border-radius: 50%;
      background: radial-gradient(circle, rgba(99,102,241,0.07) 0%, transparent 70%);
      pointer-events: none;
    }
    .bg-blur-bottom {
      position: fixed; bottom: -400px; left: -200px; z-index: -1;
      width: 600px; height: 600px; border-radius: 50%;
      background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%);
      pointer-events: none;
    }

    /* Navigation */
    nav {
      position: fixed; top: 0; left: 0; right: 0; z-index: 100;
      padding: 12px 0;
      background: rgba(255,255,255,0.82);
      backdrop-filter: blur(16px);
      -webkit-backdrop-filter: blur(16px);
      border-bottom: 1px solid var(--border);
      transition: box-shadow 0.3s;
    }
    nav.scrolled { box-shadow: var(--shadow-sm); }
    nav .container { display: flex; align-items: center; justify-content: space-between; }
    .nav-brand { display: flex; align-items: center; gap: 12px; }
    .nav-logo-wrap {
      width: 38px; height: 38px; border-radius: 10px;
      background: var(--gradient-main);
      display: flex; align-items: center; justify-content: center;
      font-size: 18px; font-weight: 800; color: #fff;
      box-shadow: 0 2px 8px rgba(99,102,241,0.25);
    }
    .nav-title { font-size: 17px; font-weight: 700; color: var(--text); letter-spacing: -0.02em; }
    .nav-badge {
      font-family: var(--mono); font-size: 10px; color: var(--primary);
      padding: 2px 8px; border-radius: 100px;
      background: var(--primary-bg); margin-left: 8px;
      letter-spacing: 0.04em;
    }
    .nav-links { display: flex; align-items: center; gap: 32px; }
    .nav-links a {
      font-size: 14px; font-weight: 500; color: var(--text-secondary);
      transition: color 0.2s; position: relative;
    }
    .nav-links a::after {
      content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
      height: 2px; background: var(--primary); border-radius: 1px;
      transform: scaleX(0); transition: transform 0.2s;
    }
    .nav-links a:hover { color: var(--primary); }
    .nav-links a:hover::after { transform: scaleX(1); }
    .nav-cta {
      display: inline-flex; align-items: center; gap: 6px;
      padding: 10px 22px; border-radius: 100px;
      background: var(--primary); color: #fff;
      font-size: 13px; font-weight: 600;
      transition: all 0.25s;
      box-shadow: 0 2px 8px rgba(99,102,241,0.2);
    }
    .nav-cta .lucide { width: 14px; height: 14px; }
    .nav-cta:hover {
      background: var(--primary-light); color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 6px 20px rgba(99,102,241,0.3);
    }
    @media (max-width: 768px) { .nav-links, .nav-badge { display: none; } }

    /* Hero */
    .hero { min-height: 100vh; display: flex; align-items: center; padding-top: 80px; position: relative; }
    .hero .container {
      display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
    }
    @media (max-width: 960px) { .hero .container { grid-template-columns: 1fr; text-align: center; gap: 48px; } }

    .hero-tag {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 6px 14px 6px 8px; border-radius: 100px;
      background: var(--accent-bg); border: 1px solid #a5f3fc;
      font-family: var(--mono); font-size: 12px; color: #0e7490;
      margin-bottom: 28px;
    }
    .hero-tag-dot {
      width: 8px; height: 8px; border-radius: 50%; background: var(--accent);
      animation: tagPulse 2s infinite;
    }
    @keyframes tagPulse {
      0%, 100% { opacity: 1; }
      50% { opacity: 0.4; }
    }

    .hero h1 {
      font-size: clamp(40px, 5.5vw, 64px);
      font-weight: 800; line-height: 1.08;
      letter-spacing: -0.035em; color: var(--text);
      margin-bottom: 20px;
    }
    .hero h1 .hl {
      background: var(--gradient-main);
      -webkit-background-clip: text; background-clip: text;
      color: transparent;
    }
    .hero-desc {
      font-size: 17px; color: var(--text-secondary);
      max-width: 480px; line-height: 1.7; margin-bottom: 36px;
    }
    @media (max-width: 960px) { .hero-desc { margin: 0 auto 36px; } }

    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }
    @media (max-width: 960px) { .hero-btns { justify-content: center; } }

    .btn {
      display: inline-flex; align-items: center; gap: 8px;
      padding: 14px 28px; border-radius: 100px;
      font-size: 15px; font-weight: 600;
      border: none; cursor: pointer;
      transition: all 0.25s; font-family: var(--font);
    }
    .btn .lucide { width: 16px; height: 16px; }
    .btn-primary {
      background: var(--primary); color: #fff;
      box-shadow: 0 4px 16px rgba(99,102,241,0.25);
    }
    .btn-primary:hover {
      background: var(--primary-light); color: #fff;
      transform: translateY(-2px);
      box-shadow: 0 8px 28px rgba(99,102,241,0.35);
    }
    .btn-ghost {
      background: var(--bg-card); color: var(--text-secondary);
      border: 1px solid var(--border);
    }
    .btn-ghost:hover {
      border-color: var(--primary-light); color: var(--primary);
      background: var(--primary-bg);
    }

    .hero-metrics {
      display: flex; gap: 36px; margin-top: 48px;
      padding-top: 32px; border-top: 1px solid var(--border);
    }
    @media (max-width: 960px) { .hero-metrics { justify-content: center; } }
    .metric-val {
      font-size: 28px; font-weight: 800;
      font-family: var(--mono); color: var(--primary);
    }
    .metric-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; text-transform: uppercase; letter-spacing: 0.08em; }

    .hero-visual { position: relative; }
    @media (max-width: 960px) { .hero-visual { display: block; margin-top: 16px; } }

    .glow-blob {
      position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%);
      width: 360px; height: 360px; border-radius: 50%; z-index: -1;
      background: radial-gradient(circle, rgba(99,102,241,0.08) 0%, rgba(6,182,212,0.05) 60%, transparent 100%);
      animation: blobDrift 10s ease-in-out infinite alternate;
    }
    @keyframes blobDrift {
      0% { transform: translate(-50%,-50%) scale(1) rotate(0deg); }
      100% { transform: translate(-45%,-55%) scale(1.1) rotate(5deg); }
    }

    .code-window {
      background: var(--bg-card); border: 1px solid var(--border);
      border-radius: var(--radius-lg); overflow: hidden;
      box-shadow: var(--shadow-xl);
    }
    .code-header {
      display: flex; align-items: center; gap: 8px;
      padding: 14px 18px; background: var(--surface);
      border-bottom: 1px solid var(--border);
    }
    .code-dot { width: 11px; height: 11px; border-radius: 50%; }
    .code-dot.r { background: #fca5a5; }
    .code-dot.y { background: #fde047; }
    .code-dot.g { background: #86efac; }
    .code-title { font-family: var(--mono); font-size: 12px; color: var(--text-muted); margin-left: 10px; }
    .code-body { padding: 22px; font-family: var(--mono); font-size: 13px; line-height: 2.1; word-break: break-word; }
    .code-line { display: flex; gap: 10px; }
    .code-prompt { color: var(--primary); font-weight: 600; }
    .code-cmd { color: var(--text); }
    .code-ok { color: var(--success); }
    .code-muted { color: var(--text-muted); }

    .code-line .cursor-blink {
      display: inline-block; width: 2px; height: 14px;
      background: var(--primary); vertical-align: middle; margin-left: 2px;
      animation: blink 1s step-end infinite;
    }
    @keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0; } }

    /* Sections */
    .section-label {
      font-family: var(--mono); font-size: 12px; color: var(--primary);
      letter-spacing: 0.12em; text-transform: uppercase;
      display: inline-flex; align-items: center; gap: 8px;
      margin-bottom: 12px; padding: 4px 12px; border-radius: 100px;
      background: var(--primary-bg);
    }
    .section-title {
      font-size: clamp(30px, 4vw, 44px);
      font-weight: 800; color: var(--text);
      letter-spacing: -0.03em; margin-bottom: 12px; line-height: 1.15;
    }
    .section-subtitle {
      font-size: 16px; color: var(--text-secondary); max-width: 500px; line-height: 1.7;
    }

    /* Features */
    .features-head { text-align: center; margin-bottom: 56px; }
    .features-head .section-subtitle { margin: 0 auto; }

    .feat-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(250px, 100%), 1fr));
      gap: 20px;
    }
    .feat-card {
      padding: 32px; border-radius: var(--radius);
      background: var(--bg-card); border: 1px solid var(--border);
      transition: all 0.3s; position: relative; overflow: hidden;
    }
    .feat-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-lg);
      transform: translateY(-4px);
    }
    .feat-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 3px;
      background: var(--gradient-main); opacity: 0; transition: opacity 0.3s;
    }
    .feat-card:hover::after { opacity: 1; }

    .feat-icon {
      width: 48px; height: 48px; border-radius: 14px;
      display: flex; align-items: center; justify-content: center;
      margin-bottom: 20px;
      background: var(--primary-bg); color: var(--primary);
    }
    .feat-icon .lucide { width: 24px; height: 24px; }
    .feat-icon.c2 { background: var(--accent-bg); color: var(--accent); }
    .feat-icon.c3 { background: #fdf2f8; color: #ec4899; }
    .feat-icon.c4 { background: var(--success-bg); color: var(--success); }

    .feat-card h3 { font-size: 17px; font-weight: 700; color: var(--text); margin-bottom: 8px; }
    .feat-card p { font-size: 14px; color: var(--text-secondary); line-height: 1.6; }
    .feat-tag {
      display: inline-block; margin-top: 16px; padding: 4px 12px;
      border-radius: 100px; font-family: var(--mono); font-size: 11px;
      background: var(--surface); color: var(--text-muted);
    }

    /* Deploy */
    .deploy-grid {
      display: grid; grid-template-columns: repeat(auto-fit, minmax(min(280px, 100%), 1fr));
      gap: 20px; margin-top: 48px;
    }
    .deploy-card {
      padding: 28px; border-radius: var(--radius);
      background: var(--bg-card); border: 1px solid var(--border);
      transition: all 0.3s; display: flex; align-items: flex-start; gap: 16px;
    }
    .deploy-card:hover {
      border-color: var(--border-hover);
      box-shadow: var(--shadow-md);
      transform: translateY(-2px);
    }
    .deploy-ico {
      width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
      display: flex; align-items: center; justify-content: center;
      background: var(--primary-bg); color: var(--primary);
    }
    .deploy-ico .lucide { width: 20px; height: 20px; }
    .deploy-card h4 { font-size: 16px; font-weight: 700; color: var(--text); margin-bottom: 6px; }
    .deploy-card p { font-size: 13px; color: var(--text-secondary); line-height: 1.5; }
    .deploy-card code {
      font-family: var(--mono); font-size: 12px; padding: 4px 10px;
      background: var(--surface); border: 1px solid var(--border);
      border-radius: 8px; color: var(--primary); margin-top: 10px;
      display: inline-block;
    }

    /* CTA */
    .cta { text-align: center; padding: 120px 0; }
    .cta-box {
      max-width: 620px; margin: 0 auto; padding: 56px 40px;
      border-radius: var(--radius-lg); position: relative; overflow: hidden;
      background: var(--bg-card); border: 1px solid var(--border);
      box-shadow: var(--shadow-lg);
    }
    .cta-box::before {
      content: ''; position: absolute; inset: -1px; border-radius: inherit;
      background: var(--gradient-main); z-index: -1; opacity: 0.06;
    }
    .cta-box h3 {
      font-size: clamp(26px, 3.5vw, 36px);
      font-weight: 800; color: var(--text); margin-bottom: 14px;
    }
    .cta-box p {
      font-size: 16px; color: var(--text-secondary); max-width: 400px;
      margin: 0 auto 32px; line-height: 1.7;
    }
    .cta-btns { display: flex; gap: 12px; justify-content: center; flex-wrap: wrap; }
    .cta-badges {
      display: flex; gap: 20px; justify-content: center; margin-top: 28px;
      font-family: var(--mono); font-size: 11px; color: var(--text-muted);
    }
    .cta-badges .lucide { width: 12px; height: 12px; }
    .cta-badges span { display: flex; align-items: center; gap: 6px; }

    /* Footer */
    footer {
      padding: 28px 0; border-top: 1px solid var(--border);
      background: var(--surface);
    }
    footer .container { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px; }
    footer span { font-size: 13px; color: var(--text-muted); }
    footer a { color: var(--text-secondary); }
    footer a:hover { color: var(--primary); }
    .ft-right { display: flex; align-items: center; gap: 20px; }
    .ft-ver {
      font-family: var(--mono); font-size: 11px; color: var(--primary);
      padding: 2px 10px; background: var(--primary-bg); border-radius: 100px;
    }

    /* Reveal */
    .reveal {
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.65s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }

    /* Floating shapes */
    .floater {
      position: fixed; border-radius: 50%; pointer-events: none; z-index: -1;
      opacity: 0.04;
    }
    @keyframes floaterMove {
      0%, 100% { transform: translateY(0) rotate(0deg); }
      33% { transform: translateY(-30px) rotate(5deg); }
      66% { transform: translateY(10px) rotate(-3deg); }
    }

    /* Tablet */
    @media (max-width: 960px) {
      section { padding: 72px 0; }
      .hero { padding-top: 64px; }
      .hero .container { gap: 40px; }
      .code-body { padding: 16px; font-size: 11px; line-height: 1.9; }
      .code-window { margin: 0 auto; max-width: 100%; }
      .glow-blob { display: none; }
      .hero-metrics { gap: 24px; }
      .cta { padding: 80px 0; }
      .cta-box { padding: 40px 28px; }
    }

    /* Mobile */
    @media (max-width: 640px) {
      .container { padding: 0 16px; }
      section { padding: 56px 0; }
      .hero { padding-top: 56px; min-height: auto; }
      .hero .container { gap: 32px; }
      .hero h1 { font-size: clamp(28px, 8vw, 40px); }
      .hero-desc { font-size: 15px; }
      .hero-btns { flex-direction: column; align-items: stretch; }
      .hero-btns .btn { justify-content: center; }
      .hero-metrics { flex-wrap: wrap; gap: 16px 24px; }
      .metric-val { font-size: 22px; }
      .code-body { padding: 12px; font-size: 10px; line-height: 1.8; overflow-x: auto; }
      .code-window { border-radius: var(--radius); }
      .section-title { font-size: clamp(24px, 6vw, 32px); }
      .section-subtitle { font-size: 14px; }
      .feat-grid { grid-template-columns: 1fr; gap: 14px; }
      .feat-card { padding: 24px; }
      .deploy-grid { grid-template-columns: 1fr; gap: 14px; }
      .deploy-card { padding: 20px; flex-direction: column; gap: 12px; }
      .cta { padding: 56px 0; }
      .cta-box { padding: 32px 20px; }
      .cta-box h3 { font-size: 22px; }
      .cta-box p { font-size: 14px; }
      .cta-btns { flex-direction: column; align-items: stretch; }
      .cta-btns .btn { justify-content: center; }
      .cta-badges { flex-wrap: wrap; gap: 12px; }
      footer .container { flex-direction: column; text-align: center; gap: 10px; }
      .ft-right { justify-content: center; flex-wrap: wrap; }
      .nav-cta { padding: 8px 16px; font-size: 12px; }
      .nav-title { font-size: 15px; }
    }

    /* Small phones */
    @media (max-width: 380px) {
      .container { padding: 0 12px; }
      .hero h1 { font-size: 26px; }
      .hero-desc { font-size: 14px; }
      .hero-metrics { gap: 12px 20px; }
      .metric-val { font-size: 20px; }
      .metric-label { font-size: 10px; }
      .feat-card { padding: 20px; }
      .section-title { font-size: 22px; }
    }

    /* Stats counter animation */
    .counter { display: inline-block; }
  </style>
</head>
<body>

  <div class="bg-pattern"></div>
  <div class="bg-blur-top"></div>
  <div class="bg-blur-bottom"></div>

  <nav id="navbar">
    <div class="container">
      <div class="nav-brand">
        <div class="nav-logo-wrap">A</div>
        <span class="nav-title">ALISA</span>
        <span class="nav-badge">ENGINE</span>
      </div>
      <div class="nav-links">
        <a href="#features">Features</a>
        <a href="#deploy">Deploy</a>
        <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank">GitHub</a>
      </div>
      <a href="https://t.me/AlisaReactionBot" target="_blank" class="nav-cta"><i data-lucide="zap"></i> Launch Bot</a>
    </div>
  </nav>

  <section class="hero">
    <div class="container">
      <div class="hero-content">
        <div class="hero-tag">
          <span class="hero-tag-dot"></span>
          ХОРОШО — NEURAL LINK ACTIVE
        </div>
        <h1><span class="hl">Alisa</span><br>Reaction Matrix</h1>
        <p class="hero-desc">Sub-100ms Telegram automation. Inspired by Alisa Mikhailovna Kujou — the tsundere ice queen who hides her feelings in Russian. Reacts with precision. Not that she cares or anything.</p>
        <div class="hero-btns">
          <a href="#deploy" class="btn btn-primary"><i data-lucide="cloud"></i> Edge Deploy</a>
          <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn btn-ghost"><i data-lucide="code-2"></i> Source</a>
        </div>
        <div class="hero-metrics">
          <div><div class="metric-val">&lt;90ms</div><div class="metric-label">p95 latency</div></div>
          <div><div class="metric-val">99.9%</div><div class="metric-label">uptime</div></div>
          <div><div class="metric-val">300+</div><div class="metric-label">edge nodes</div></div>
        </div>
      </div>
      <div class="hero-visual">
        <div class="glow-blob"></div>
        <div class="code-window">
          <div class="code-header">
            <div class="code-dot r"></div>
            <div class="code-dot y"></div>
            <div class="code-dot g"></div>
            <span class="code-title">~/alisareactionbot</span>
          </div>
          <div class="code-body">
            <div class="code-line"><span class="code-prompt">$</span> <span class="code-cmd">npx wrangler deploy</span></div>
            <div class="code-line"><span class="code-ok"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle"></i></span> <span class="code-muted">Deployed to Cloudflare Workers</span></div>
            <div class="code-line"><span class="code-ok"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle"></i></span> <span class="code-muted">Webhook configured</span></div>
            <div class="code-line"><span class="code-ok"><i data-lucide="check-circle" style="width:14px;height:14px;vertical-align:middle"></i></span> <span class="code-muted">Bot online — Хорошо, reaction.core active</span></div>
            <div class="code-line" style="margin-top:14px"><span class="code-prompt">$</span> <span class="code-cmd">curl /health</span></div>
            <div class="code-line"><span class="code-muted">{ "status": "ok", "latency": "47ms" }</span></div>
            <div class="code-line" style="margin-top:14px"><span class="code-prompt">$</span> <span class="code-cmd">_</span><span class="cursor-blink"></span></div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <div class="features-head reveal">
        <div class="section-label">core_modules</div>
        <h2 class="section-title">Neural Primitives</h2>
        <p class="section-subtitle">Built for hyper-reactive Telegram bots — edge-optimized, zero-trust, sub-linear scaling. Хмпф, naturally.</p>
      </div>
      <div class="feat-grid">
        <div class="feat-card reveal">
          <div class="feat-icon c1"><i data-lucide="zap"></i></div>
          <h3>Quantum Speed</h3>
          <p>Edge-optimized workers with sub-100ms median latency and instant failover across 300+ global nodes.</p>
          <span class="feat-tag">edge-native</span>
        </div>
        <div class="feat-card reveal">
          <div class="feat-icon c2"><i data-lucide="shield-check"></i></div>
          <h3>Neural Shield</h3>
          <p>Privacy-first architecture. Only metadata is stored — never message content. Your chats stay private.</p>
          <span class="feat-tag">zero-log</span>
        </div>
        <div class="feat-card reveal">
          <div class="feat-icon c3"><i data-lucide="target"></i></div>
          <h3>Smart Reactions</h3>
          <p>Context-aware emoji selection with configurable randomization. Reacts naturally, not robotically.</p>
          <span class="feat-tag">adaptive</span>
        </div>
        <div class="feat-card reveal">
          <div class="feat-icon c4"><i data-lucide="layers"></i></div>
          <h3>Serverless Mesh</h3>
          <p>Deploy on Cloudflare Workers, Vercel, or Docker. Same codebase, zero cold starts everywhere.</p>
          <span class="feat-tag">multi-platform</span>
        </div>
      </div>
    </div>
  </section>

  <section style="background: var(--surface);">
    <div class="container">
      <div class="reveal" style="text-align: center; max-width: 700px; margin: 0 auto;">
        <div class="section-label" style="justify-content:center;">character_dna</div>
        <h2 class="section-title">Inspired by Alisa Mikhailovna Kujou</h2>
        <p style="font-size: 15px; color: var(--text-secondary); line-height: 1.8; margin-top: 16px;">
          The half-Russian, half-Japanese tsundere from <i>"Alya Sometimes Hides Her Feelings in Russian"</i> — whose sharp tongue, elegant pride, and moments when Russian slips through her composed facade define every interaction. This bot carries her essence: precise, proud, and secretly warm.
        </p>
        <div style="display: flex; gap: 24px; justify-content: center; margin-top: 28px; flex-wrap: wrap;">
          <span style="font-family: var(--mono); font-size: 13px; color: var(--primary); background: var(--primary-bg); padding: 6px 16px; border-radius: 100px;">Хмпф — Hmph</span>
          <span style="font-family: var(--mono); font-size: 13px; color: var(--primary); background: var(--primary-bg); padding: 6px 16px; border-radius: 100px;">Хорошо — Okay</span>
          <span style="font-family: var(--mono); font-size: 13px; color: var(--primary); background: var(--primary-bg); padding: 6px 16px; border-radius: 100px;">Дурак — Idiot</span>
          <span style="font-family: var(--mono); font-size: 13px; color: var(--primary); background: var(--primary-bg); padding: 6px 16px; border-radius: 100px;">Спасибо — Thank You</span>
        </div>
      </div>
    </div>
  </section>

  <section id="deploy" style="background: var(--bg);">
    <div class="container">
      <div class="reveal">
        <div class="section-label">edge_deployment</div>
        <h2 class="section-title">Deploy Anywhere</h2>
        <p class="section-subtitle">One codebase, every platform. Pick your edge and ship in seconds.</p>
      </div>
      <div class="deploy-grid">
        <div class="deploy-card reveal">
          <div class="deploy-ico"><i data-lucide="cloud"></i></div>
          <div>
            <h4>Cloudflare Workers</h4>
            <p>Recommended. Zero cold starts, 300+ edge locations. Free tier available.</p>
            <code>npx wrangler deploy</code>
          </div>
        </div>
        <div class="deploy-card reveal">
          <div class="deploy-ico"><i data-lucide="triangle"></i></div>
          <div>
            <h4>Vercel</h4>
            <p>Serverless functions with automatic HTTPS. Git-push deploys.</p>
            <code>vercel --prod</code>
          </div>
        </div>
        <div class="deploy-card reveal">
          <div class="deploy-ico"><i data-lucide="container"></i></div>
          <div>
            <h4>Docker</h4>
            <p>Self-hosted on any VPS. Full control, persistent server.</p>
            <code>docker-compose up -d</code>
          </div>
        </div>
        <div class="deploy-card reveal">
          <div class="deploy-ico"><i data-lucide="train-front"></i></div>
          <div>
            <h4>Railway / Render</h4>
            <p>One-click deploy with automatic scaling and managed infrastructure.</p>
            <code>git push railway main</code>
          </div>
        </div>
      </div>
    </div>
  </section>

  <section class="cta">
    <div class="container">
      <div class="cta-box reveal">
        <div class="section-label" style="justify-content:center; margin-bottom: 16px;">protocol</div>
        <h3>Ready to integrate <span class="hl" style="background:var(--gradient-main);-webkit-background-clip:text;background-clip:text;color:transparent;">Alisa</span>?</h3>
        <p>Deploy your own neural reaction bot in minutes. Not that you need my permission. Хорошо?</p>
        <div class="cta-btns">
          <a href="https://t.me/AlisaReactionBot" target="_blank" class="btn btn-primary"><i data-lucide="message-circle"></i> Try on Telegram</a>
          <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn btn-ghost"><i data-lucide="code-2"></i> GitHub</a>
        </div>
        <div class="cta-badges">
          <span><i data-lucide="zap"></i> edge-native</span>
          <span><i data-lucide="lock"></i> zero-log</span>
          <span><i data-lucide="globe-2"></i> 28+ regions</span>
        </div>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <span>© 2026 Alisa Reaction Bot · Хмпф</span>
      <div class="ft-right">
        <span>Built with ❤️ by <a href="https://github.com/Shineii86">Shinei Nouzen</a></span>
        <span class="ft-ver">v2.14.0</span>
      </div>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    // Floating background shapes
    (function() {
      var shapes = [];
      var colors = ['#6366f1', '#06b6d4', '#ec4899', '#10b981'];
      for (var i = 0; i < 6; i++) {
        var s = document.createElement('div');
        s.className = 'floater';
        var sz = Math.random() * 120 + 40;
        s.style.width = sz + 'px';
        s.style.height = sz + 'px';
        s.style.left = Math.random() * 100 + '%';
        s.style.top = Math.random() * 100 + '%';
        s.style.background = colors[i % colors.length];
        s.style.animation = 'floaterMove ' + (Math.random() * 25 + 15) + 's ease-in-out infinite';
        s.style.animationDelay = -(Math.random() * 15) + 's';
        document.body.appendChild(s);
      }
    })();

    // Nav scroll shadow
    (function() {
      var nav = document.getElementById('navbar');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 10) nav.classList.add('scrolled');
        else nav.classList.remove('scrolled');
      });
    })();

    // Scroll reveal
    (function() {
      var items = document.querySelectorAll('.reveal');
      var obs = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
      items.forEach(function(el) { obs.observe(el); });
    })();

    // Smooth anchor scroll
    document.querySelectorAll('a[href^="#"]').forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var target = document.querySelector(this.getAttribute('href'));
        if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      });
    });
  </script>
</body>
</html>
`;

// ══════════════════════════════════════════════════════════════ END: landing.js
