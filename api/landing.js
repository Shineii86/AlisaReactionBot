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
 * @version 2.15.2
 * @author  Shinei Nouzen
 * @license MIT
 * ======= • ======= • ======= • ======= • =======• =======
 */

import { VERSION } from './version.js';

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
  <link rel="icon" type="image/png" sizes="32x32" href="/assets/icon.png">
  <link rel="icon" type="image/png" sizes="192x192" href="/assets/logo.png">
  <link rel="apple-touch-icon" href="/assets/logo2.png">
  <meta name="theme-color" content="#6366f1">
  <meta name="msapplication-TileColor" content="#6366f1">

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Primary Meta — Search engines + browser tabs               -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta name="description" content="Alisa Reaction Bot — fast Telegram auto-reaction bot inspired by Alisa Mikhailovna Kujou. Deploy on Cloudflare, Vercel, or Docker. Auto-react to messages with curated emojis.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="https://alisareactionbot.vercel.app">

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Open Graph — Facebook, Discord, Telegram preview, LinkedIn -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta property="og:title" content="Alisa · Reaction Bot" />
  <meta property="og:type" content="website" />
  <meta property="og:url" content="https://alisareactionbot.vercel.app" />
  <meta property="og:image" content="/assets/banner1.png" />
  <meta property="og:image:secure_url" content="/assets/banner1.png" />
  <meta property="og:image:type" content="image/png" />
  <meta property="og:image:width" content="1280" />
  <meta property="og:image:height" content="640" />
  <meta property="og:image:alt" content="Alisa Reaction Bot — Automated Telegram Reactions" />
  <meta property="og:description" content="Fast Telegram auto-reaction bot inspired by Alisa Mikhailovna Kujou. Deploy on Cloudflare, Vercel, or Docker. Auto-react to messages with curated emojis." />
  <meta property="og:site_name" content="Alisa Reaction Bot" />
  <meta property="og:locale" content="en_US" />

  <!-- ═══════════════════════════════════════════════════════════ -->
  <!-- Twitter Card — X/Twitter preview                           -->
  <!-- ═══════════════════════════════════════════════════════════ -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:site" content="@Shineii86" />
  <meta name="twitter:creator" content="@Shineii86" />
  <meta name="twitter:title" content="Alisa · Reaction Bot" />
  <meta name="twitter:description" content="Fast Telegram auto-reaction bot inspired by Alisa Mikhailovna Kujou. Deploy anywhere, react to everything." />
  <meta name="twitter:image" content="/assets/banner1.png" />
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
    "description": "Fast Telegram auto-reaction bot inspired by Alisa Mikhailovna Kujou. Deploy on Cloudflare, Vercel, or Docker. Per-chat customization and privacy-first design.",
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
    "image": "/assets/banner1.png",
    "softwareVersion": "${VERSION}",
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

    /* Navigation — Dynamic Island (always open) */
    .island-wrap {
      position: fixed; top: 16px; left: 50%; transform: translateX(-50%);
      z-index: 100; display: flex; justify-content: center;
    }
    .island {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.88);
      backdrop-filter: blur(24px) saturate(1.4);
      -webkit-backdrop-filter: blur(24px) saturate(1.4);
      border: 1px solid rgba(255,255,255,0.6);
      border-radius: 100px;
      padding: 8px 12px;
      box-shadow: 0 4px 24px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.8);
    }
    .island-brand {
      display: flex; align-items: center; gap: 8px;
      flex-shrink: 0;
      padding: 4px 8px; border-radius: 100px;
      text-decoration: none;
    }
    .island-logo {
      width: 32px; height: 32px; border-radius: 50%;
      object-fit: cover;
      box-shadow: 0 2px 8px rgba(99,102,241,0.25);
    }
    .island-title {
      font-size: 15px; font-weight: 700; color: var(--text);
      letter-spacing: -0.02em; white-space: nowrap;
    }
    .island-divider {
      width: 1px; height: 24px; background: var(--border);
      flex-shrink: 0;
    }
    .island-links {
      display: flex; align-items: center; gap: 4px;
    }
    .island-links a {
      padding: 6px 14px; border-radius: 100px;
      font-size: 13px; font-weight: 500; color: var(--text-secondary);
      transition: all 0.2s; white-space: nowrap;
      text-decoration: none;
    }
    .island-links a:hover {
      color: var(--primary); background: var(--primary-bg);
    }
    .island-cta {
      display: inline-flex; align-items: center; gap: 5px;
      padding: 7px 16px; border-radius: 100px;
      background: var(--primary); color: #fff;
      font-size: 12px; font-weight: 600;
      box-shadow: 0 2px 8px rgba(99,102,241,0.2);
      flex-shrink: 0; white-space: nowrap;
      transition: background 0.2s, transform 0.2s, box-shadow 0.2s;
      text-decoration: none;
    }
    .island-cta .lucide { width: 13px; height: 13px; }
    .island-cta:hover {
      background: var(--primary-light); color: #fff;
      transform: translateY(-1px);
      box-shadow: 0 4px 16px rgba(99,102,241,0.3);
    }

    /* Mobile dynamic island */
    @media (max-width: 640px) {
      .island-wrap { top: 10px; }
      .island { padding: 6px 10px; gap: 6px; }
      .island-logo { width: 28px; height: 28px; }
      .island-title { font-size: 13px; }
      .island-links a { padding: 5px 10px; font-size: 12px; }
      .island-cta { padding: 6px 12px; font-size: 11px; }
    }

    /* Parallax background layers */
    .parallax-bg {
      position: fixed; inset: 0; z-index: -3; pointer-events: none; overflow: hidden;
    }
    .parallax-layer {
      position: absolute; width: 100%; opacity: 0.08;
    }
    .parallax-layer:nth-child(1) { top: 10%; left: -5%; width: 60%; }
    .parallax-layer:nth-child(2) { top: 50%; right: -10%; width: 50%; }
    .parallax-layer img { width: 100%; height: auto; }

    /* Hero — character page layout */
    .hero {
      min-height: 100vh; display: flex; align-items: center;
      padding-top: 100px; position: relative; overflow: hidden;
    }
    .hero-chara-bg {
      position: absolute; top: 50%; left: 50%;
      transform: translate(-50%, -50%);
      z-index: -1; opacity: 0.06; pointer-events: none;
      width: 80%; max-width: 900px;
    }
    .hero-chara-bg img { width: 100%; height: auto; }
    .hero .container { width: 100%; }
    .hero-split {
      display: grid; grid-template-columns: 1fr 1fr;
      gap: 40px; align-items: center;
    }

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

    .hero-name-jp {
      display: block; font-size: clamp(16px, 2.2vw, 22px);
      font-weight: 600; color: var(--text-muted);
      letter-spacing: 0.05em; margin-bottom: 6px;
    }
    .hero-name-en {
      display: block; font-size: clamp(36px, 5vw, 60px);
      font-weight: 800; line-height: 1.1;
      letter-spacing: -0.03em; color: var(--text);
    }
    .hero h1 .hl {
      background: var(--gradient-main);
      -webkit-background-clip: text; background-clip: text;
      color: transparent;
    }
    .hero-desc {
      font-size: 16px; color: var(--text-secondary);
      max-width: 480px; line-height: 1.7; margin: 24px 0 36px;
    }

    .hero-btns { display: flex; gap: 12px; flex-wrap: wrap; }

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

    /* Character image area */
    .hero-character {
      position: relative; display: flex; flex-direction: column;
      align-items: center; justify-content: center;
    }
    .chara-season-switch {
      display: flex; gap: 8px; margin-bottom: 20px;
    }
    .chara-season {
      padding: 6px 18px; border-radius: 100px;
      font-family: var(--mono); font-size: 12px;
      font-weight: 600; cursor: pointer;
      background: var(--surface); color: var(--text-muted);
      border: 1px solid var(--border); transition: all 0.25s;
    }
    .chara-season.active {
      background: var(--primary); color: #fff;
      border-color: var(--primary);
      box-shadow: 0 2px 12px rgba(99,102,241,0.3);
    }
    .chara-img-wrap {
      position: relative; width: 100%; max-width: 420px;
    }
    .hero-char-img {
      width: 100%; height: auto; max-height: 65vh;
      object-fit: contain; object-position: bottom center;
      filter: drop-shadow(0 16px 40px rgba(99,102,241,0.18));
      transition: opacity 0.4s ease;
    }
    .hero-char-img.season-2,
    .hero-char-img.season-1 { display: none; }
    .hero-char-img.active { display: block; animation: charFadeIn 0.5s ease; }
    @keyframes charFadeIn {
      from { opacity: 0; transform: translateY(10px); }
      to { opacity: 1; transform: translateY(0); }
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
    .ft-heart {
      color: #ef4444; vertical-align: middle; display: inline-block;
      width: 14px; height: 14px;
      animation: heartbeat 1.2s ease-in-out infinite;
    }
    @keyframes heartbeat {
      0%, 100% { transform: scale(1); }
      14% { transform: scale(1.3); }
      28% { transform: scale(1); }
      42% { transform: scale(1.3); }
      70% { transform: scale(1); }
    }

    /* Back to top button */
    .page-top {
      position: fixed; bottom: 32px; right: 32px; z-index: 90;
      width: 48px; height: 48px; border-radius: 50%;
      background: var(--primary); color: #fff;
      display: flex; align-items: center; justify-content: center;
      border: none; cursor: pointer;
      box-shadow: 0 4px 20px rgba(99,102,241,0.3);
      opacity: 0; transform: translateY(20px);
      transition: all 0.3s ease;
      pointer-events: none;
    }
    .page-top .lucide { width: 20px; height: 20px; }
    .page-top.visible {
      opacity: 1; transform: translateY(0);
      pointer-events: auto;
    }
    .page-top:hover {
      background: var(--primary-light);
      transform: translateY(-3px);
      box-shadow: 0 8px 28px rgba(99,102,241,0.4);
    }

    /* Reveal — staggered */
    .reveal {
      opacity: 0; transform: translateY(28px);
      transition: opacity 0.7s cubic-bezier(0.16, 1, 0.3, 1),
                  transform 0.7s cubic-bezier(0.16, 1, 0.3, 1);
    }
    .reveal.visible { opacity: 1; transform: translateY(0); }
    .reveal.d1 { transition-delay: 0.08s; }
    .reveal.d2 { transition-delay: 0.16s; }
    .reveal.d3 { transition-delay: 0.24s; }
    .reveal.d4 { transition-delay: 0.32s; }

    /* Card hover lift */
    .feat-card, .deploy-card {
      transition: transform 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
    }

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
      .hero { padding-top: 80px; }
      .hero-split { grid-template-columns: 1fr; text-align: center; gap: 40px; }
      .hero-content { order: 2; }
      .hero-character { order: 1; }
      .hero-desc { max-width: 560px; margin: 24px auto 36px; }
      .hero-btns { justify-content: center; }
      .chara-img-wrap { max-width: 320px; }
      .hero-chara-bg { width: 90%; }
      .parallax-bg { display: none; }
      .cta { padding: 80px 0; }
      .cta-box { padding: 40px 28px; }
    }

    /* Mobile */
    @media (max-width: 640px) {
      .container { padding: 0 16px; }
      section { padding: 56px 0; }
      .hero { padding-top: 70px; min-height: auto; }
      .hero-name-jp { font-size: 14px; }
      .hero-name-en { font-size: clamp(28px, 8vw, 40px); }
      .hero-desc { font-size: 15px; }
      .hero-btns { flex-direction: column; align-items: stretch; }
      .hero-btns .btn { justify-content: center; }
      .chara-img-wrap { max-width: 260px; }
      .hero-char-img { max-height: 50vh; }
      .chara-season { padding: 5px 14px; font-size: 11px; }
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
    }

    /* Small phones */
    @media (max-width: 380px) {
      .container { padding: 0 12px; }
      .hero-name-jp { font-size: 13px; }
      .hero-name-en { font-size: 26px; }
      .hero-desc { font-size: 14px; }
      .chara-img-wrap { max-width: 220px; }
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
  <canvas id="particles" style="position:fixed;inset:0;z-index:-1;pointer-events:none;"></canvas>

  <!-- Dynamic Island Navigation -->
  <div class="island-wrap">
    <div class="island">
      <a href="/" class="island-brand">
        <img src="/assets/icon.png" alt="Alisa" class="island-logo">
        <span class="island-title">Alisa</span>
      </a>
      <div class="island-divider"></div>
      <div class="island-links">
        <a href="#features">Features</a>
        <a href="#deploy">Deploy</a>
        <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank">GitHub</a>
      </div>
      <a href="https://t.me/AlisaReactionBot" target="_blank" class="island-cta"><i data-lucide="zap"></i> Launch</a>
    </div>
  </div>

  <!-- Decorative background layers — parallax scroll like roshidere.com -->
  <div class="parallax-bg">
    <div class="parallax-layer" data-speed="0.3"><img src="/assets/bg_deco_01.png" alt=""></div>
    <div class="parallax-layer" data-speed="0.5"><img src="/assets/bg_deco_02.png" alt=""></div>
  </div>

  <section class="hero">
    <div class="hero-chara-bg">
      <img src="/assets/alisa_bg_name.png" alt="" class="hero-nameplate">
    </div>
    <div class="container">
      <div class="hero-split">
        <div class="hero-content">
          <div class="hero-tag">
            <span class="hero-tag-dot"></span>
            ХОРОШО — БОТОВАЯ СЕТЬ АКТИВНА
          </div>
          <h1>
            <span class="hero-name-jp">アリサ・ミハイロヴナ・九条</span>
            <span class="hero-name-en"><span class="hl">Alisa</span> Mikhailovna Kujou</span>
          </h1>
          <p class="hero-desc">The half-Russian, half-Japanese tsundere whose sharp tongue, elegant pride, and moments when Russian slips through her composed facade define every interaction. This Telegram bot carries her essence — precise, proud, and secretly warm. Хмпф.</p>
          <div class="hero-btns">
            <a href="#deploy" class="btn btn-primary"><i data-lucide="rocket"></i> Deploy Now</a>
            <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn btn-ghost"><i data-lucide="code-2"></i> Source Code</a>
          </div>
        </div>
        <div class="hero-character">
          <div class="chara-season-switch" id="charaChange">
            <span class="chara-season active" data-season="1">Season 1</span>
            <span class="chara-season" data-season="2">Season 2</span>
          </div>
          <div class="chara-img-wrap">
            <img src="/assets/alisa_stand.png" alt="Alisa Mikhailovna Kujou — Season 1" class="hero-char-img season-1 active">
            <img src="/assets/alisa_stand_s2.png" alt="Alisa Mikhailovna Kujou — Season 2" class="hero-char-img season-2">
          </div>
        </div>
      </div>
    </div>
  </section>

  <section id="features">
    <div class="container">
      <div class="features-head reveal">
        <div class="section-label">Возможности</div>
        <h2 class="section-title">Key Features</h2>
        <p class="section-subtitle">A fast, reliable Telegram bot that auto-reacts to messages. Deploy anywhere, react to everything. Хмпф, naturally.</p>
      </div>
      <div class="feat-grid">
        <div class="feat-card reveal d1">
          <div class="feat-icon c1"><i data-lucide="zap"></i></div>
          <h3>Fast Reactions</h3>
          <p>Sub-100ms response time with edge-deployed workers across 300+ global nodes. Blink and you'll miss it.</p>
          <span class="feat-tag">fast</span>
        </div>
        <div class="feat-card reveal d2">
          <div class="feat-icon c2"><i data-lucide="shield-check"></i></div>
          <h3>Privacy First</h3>
          <p>Only metadata is stored — never message content. Your chats stay private, as they should.</p>
          <span class="feat-tag">secure</span>
        </div>
        <div class="feat-card reveal d3">
          <div class="feat-icon c3"><i data-lucide="smile-plus"></i></div>
          <h3>Smart Reactions</h3>
          <p>Configurable emoji list with randomization levels. Reacts naturally to messages, not robotically.</p>
          <span class="feat-tag">customizable</span>
        </div>
        <div class="feat-card reveal d4">
          <div class="feat-icon c4"><i data-lucide="server"></i></div>
          <h3>Easy Deploy</h3>
          <p>Deploy on Cloudflare Workers, Vercel, Docker, or Railway. Same codebase, zero cold starts.</p>
          <span class="feat-tag">multi-platform</span>
        </div>
      </div>
    </div>
  </section>

  <section style="background: var(--surface);">
    <div class="container">
      <div class="reveal" style="text-align: center; max-width: 700px; margin: 0 auto;">
        <div class="section-label" style="justify-content:center;">Персонаж</div>
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
        <div class="section-label">Установка</div>
        <h2 class="section-title">Deploy Anywhere</h2>
        <p class="section-subtitle">One codebase, every platform. Pick your hosting and ship in seconds.</p>
      </div>
      <div class="deploy-grid">
        <div class="deploy-card reveal d1">
          <div class="deploy-ico"><i data-lucide="cloud"></i></div>
          <div>
            <h4>Cloudflare Workers</h4>
            <p>Recommended. Zero cold starts, 300+ edge locations. Free tier available.</p>
            <code>npx wrangler deploy</code>
          </div>
        </div>
        <div class="deploy-card reveal d2">
          <div class="deploy-ico"><i data-lucide="triangle"></i></div>
          <div>
            <h4>Vercel</h4>
            <p>Serverless functions with automatic HTTPS. Git-push deploys.</p>
            <code>vercel --prod</code>
          </div>
        </div>
        <div class="deploy-card reveal d3">
          <div class="deploy-ico"><i data-lucide="container"></i></div>
          <div>
            <h4>Docker</h4>
            <p>Self-hosted on any VPS. Full control, persistent server.</p>
            <code>docker-compose up -d</code>
          </div>
        </div>
        <div class="deploy-card reveal d4">
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
        <div class="section-label" style="justify-content:center; margin-bottom: 16px;">Начать</div>
        <h3>Ready to add <span class="hl" style="background:var(--gradient-main);-webkit-background-clip:text;background-clip:text;color:transparent;">Alisa</span> to your group?</h3>
        <p>Deploy your own reaction bot in minutes. Not that you need my permission. Хорошо?</p>
        <div class="cta-btns">
          <a href="https://t.me/AlisaReactionBot" target="_blank" class="btn btn-primary"><i data-lucide="message-circle"></i> Try on Telegram</a>
          <a href="https://github.com/Shineii86/AlisaReactionBot" target="_blank" class="btn btn-ghost"><i data-lucide="code-2"></i> GitHub</a>
        </div>
        <div class="cta-badges">
          <span><i data-lucide="zap"></i> fast</span>
          <span><i data-lucide="lock"></i> private</span>
          <span><i data-lucide="globe-2"></i> 300+ nodes</span>
        </div>
      </div>
    </div>
  </section>

  <!-- Back to top button -->
  <button class="page-top" id="pageTop" onclick="window.scrollTo({top:0,behavior:'smooth'})">
    <i data-lucide="chevron-up"></i>
  </button>

  <footer>
    <div class="container">
      <span>© <span id="year"></span> Alisa Reaction Bot · Хмпф</span>
      <div class="ft-right">
        <span>Built with <i data-lucide="heart" class="ft-heart"></i> by <a href="https://github.com/Shineii86">Shinei Nouzen</a></span>
        <span class="ft-ver">v${VERSION}</span>
      </div>
    </div>
  </footer>

  <script>
    lucide.createIcons();

    // Dynamic year in footer
    document.getElementById('year').textContent = new Date().getFullYear();

    // Back to top button
    (function() {
      var btn = document.getElementById('pageTop');
      window.addEventListener('scroll', function() {
        if (window.scrollY > 400) {
          btn.classList.add('visible');
        } else {
          btn.classList.remove('visible');
        }
      });
    })();

    // Scroll reveal — IntersectionObserver
    (function() {
      var reveals = document.querySelectorAll('.reveal');
      var observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
          }
        });
      }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
      reveals.forEach(function(el) { observer.observe(el); });
    })();


    // Floating dots — roshidere.com style (random appear/fade)
    (function() {
      var canvas = document.getElementById('particles');
      var ctx = canvas.getContext('2d');
      var dots = [];
      var dotColors = [
        'rgba(99,102,241,',   /* indigo */
        'rgba(6,182,212,',    /* cyan */
        'rgba(236,72,153,',   /* pink */
        'rgba(16,185,129,',   /* green */
        'rgba(245,158,11,'    /* amber */
      ];

      function resize() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
      }
      resize();
      window.addEventListener('resize', resize);

      function spawnDot() {
        dots.push({
          x: Math.random() * canvas.width * 0.9 + canvas.width * 0.05,
          y: Math.random() * canvas.height * 0.85 + canvas.height * 0.05,
          size: Math.random() * 4 + 2,
          color: dotColors[Math.floor(Math.random() * dotColors.length)],
          opacity: 0,
          phase: 'in',
          life: 0,
          maxLife: 280 + Math.random() * 200
        });
      }

      function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        for (var i = dots.length - 1; i >= 0; i--) {
          var d = dots[i];
          d.life++;

          if (d.phase === 'in') {
            d.opacity += 0.012;
            if (d.opacity >= 0.35) { d.opacity = 0.35; d.phase = 'hold'; }
          } else if (d.phase === 'hold') {
            if (d.life > d.maxLife * 0.6) d.phase = 'out';
          } else {
            d.opacity -= 0.01;
            if (d.opacity <= 0) { dots.splice(i, 1); continue; }
          }

          ctx.beginPath();
          ctx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
          ctx.fillStyle = d.color + d.opacity + ')';
          ctx.fill();
        }

        if (Math.random() < 0.018) spawnDot();

        requestAnimationFrame(animate);
      }

      /* stagger initial spawns */
      spawnDot();
      setTimeout(spawnDot, 600);
      setTimeout(spawnDot, 1200);
      setTimeout(spawnDot, 2000);
      setTimeout(spawnDot, 2800);
      animate();
    })();

    // Character season toggle
    (function() {
      var btns = document.querySelectorAll('.chara-season');
      var imgs = document.querySelectorAll('.hero-char-img');
      btns.forEach(function(btn) {
        btn.addEventListener('click', function() {
          var season = this.getAttribute('data-season');
          btns.forEach(function(b) { b.classList.remove('active'); });
          this.classList.add('active');
          imgs.forEach(function(img) { img.classList.remove('active'); });
          document.querySelector('.season-' + season).classList.add('active');
        });
      });
    })();

    // Parallax scroll effect
    (function() {
      var layers = document.querySelectorAll('.parallax-layer');
      window.addEventListener('scroll', function() {
        var scrollY = window.scrollY;
        layers.forEach(function(layer) {
          var speed = parseFloat(layer.getAttribute('data-speed')) || 0.3;
          layer.style.transform = 'translateY(' + (scrollY * speed) + 'px)';
        });
      });
    })();

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
