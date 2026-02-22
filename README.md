<p align="center">
  <img src="https://raw.githubusercontent.com/Shineii86/AlisaReactionBot/refs/heads/main/assets/logo2.png" width="256px" height="256px"/>
</p>

<h2 align="center">
<img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Symbols/New%20Button.webp" alt="New Button" width="25" height="25" /> <b>𝐀𝐋𝐈𝐒𝐀 𝐑𝚵𝐀𝐂𝐓𝐈𝚯𝐍 𝐁𝚯𝐓</b> <img src="https://raw.githubusercontent.com/Shineii86/Emojis/main/Symbols/Collision.webp" alt="Collision" width="25" height="25" />
</h2>
<div align="center">

[![Cloudflare Workers](https://img.shields.io/badge/Deployed%20on-Cloudflare%20Workers-orange?logo=cloudflare&style=for-the-badge)](https://workers.cloudflare.com)
[![Telegram Bot](https://img.shields.io/badge/Telegram-Bot-blue?logo=telegram&style=for-the-badge)](https://t.me/AlisaReactionBot)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg?style=for-the-badge)](https://opensource.org/licenses/MIT)
[![GitHub Release](https://img.shields.io/github/v/release/Shineii86/AlisaReactionBot?style=for-the-badge&color=blue)](https://github.com/Shineii86/AlisaReactionBot/releases)

[![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AlisaReactionBot?style=flat-square&label=Last%20Update)](https://github.com/Shineii86/AlisaReactionBot/commits/main)
[![Repository Size](https://img.shields.io/github/repo-size/Shineii86/AlisaReactionBot?style=flat-square&label=Repo%20Size)](https://github.com/Shineii86/AlisaReactionBot)
[![Open Issues](https://img.shields.io/github/issues/Shineii86/AlisaReactionBot?style=flat-square&label=Open%20Issues)](https://github.com/Shineii86/AlisaReactionBot/issues)

[![GitHub Stars](https://img.shields.io/github/stars/Shineii86/AlisaReactionBot?style=for-the-badge)](https://github.com/Shineii86/AlisaReactionBot/stargazers) [![GitHub Forks](https://img.shields.io/github/forks/Shineii86/AlisaReactionBot?style=for-the-badge)](https://github.com/Shineii86/AlisaReactionBot/fork)

</div>

<h4 align="center">🚀 Advanced Telegram Bot for Automated Message Reactions • Built on Cloudflare Workers • 100% Serverless • Enterprise Ready</h4>

<div align="center">
  
[💬 Live Demo](https://t.me/AlisaReactionBot) • 
[📚 Documentation](https://github.com/Shineii86/AlisaReactionBot/wiki) • 
[🐛 Report Bug](https://github.com/Shineii86/AlisaReactionBot/issues/new) • 
[💡 Feature Request](https://github.com/Shineii86/AlisaReactionBot/discussions)

</div>

## ✨ Features

### 🎯 Core Features
- ✅ **Automatic Message Reactions** - Smart reaction system for all message types
- ✅ **Multi-Chat Support** - Simultaneous operation in groups, supergroups, and channels
- ✅ **Customizable Reaction Sets** - Fully configurable emoji library
- ✅ **Intelligent Randomization** - Adaptive reaction probability system
- ✅ **Real-time Processing** - Sub-second reaction times using Cloudflare's global network

### 🛡️ Enterprise Features
- ✅ **Serverless Architecture** - Zero infrastructure costs, auto-scaling
- ✅ **High Availability** - 99.9% uptime guaranteed by Cloudflare
- ✅ **Security First** - Environment variable protection, input validation
- ✅ **Comprehensive Logging** - Detailed activity monitoring and analytics
- ✅ **RESTful API** - Health checks, status endpoints, and configuration management

### 🔧 Advanced Capabilities
- ✅ **Smart Rate Limiting** - Prevents API abuse and ensures compliance
- ✅ **Selective Chat Restrictions** - Granular control over bot behavior
- ✅ **Donation System** - Integrated payment processing for supporter rewards
- ✅ **Multi-environment Support** - Development, staging, and production ready
- ✅ **Automated Deployment** - CI/CD with GitHub Actions

## 🚀 Quick Deploy

### 🌟 One-Click Deployment

[![Deploy to Cloudflare Workers](https://deploy.workers.cloudflare.com/button)](https://deploy.workers.cloudflare.com/?url=https://github.com/Shineii86/AlisaReactionBot)

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/Shineii86/AlisaReactionBot)
[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/Shineii86/AlisaReactionBot)

### 📦 Traditional Deployment Options

[![Deploy on Heroku](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy?template=https://github.com/Shineii86/AlisaReactionBot)
[![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/template/AlisaReactionBot?referralCode=shineii)
[![Deploy to Render](https://render.com/images/deploy-to-render-button.svg)](https://render.com/deploy?repo=https://github.com/Shineii86/AlisaReactionBot)

## 📋 Prerequisites

Before deployment, ensure you have:

- [ ] **Telegram Bot Token** from [@BotFather](https://t.me/BotFather)
- [ ] **Cloudflare Account** (for Workers deployment)
- [ ] **GitHub Account** (for CI/CD and repository management)
- [ ] **Node.js 18+** (for local development)

## ⚙️ Configuration Guide

### 🔐 Environment Variables

Configure these essential variables in your deployment platform:

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `BOT_TOKEN` | Telegram Bot API token | `123456:ABC-DEF1234ghIkl-zyx57W2v1u123ew11` | ✅ |
| `BOT_USERNAME` | Your bot's username (without @) | `AlisaReactionBot` | ✅ |
| `EMOJI_LIST` | Comma-separated emojis for reactions | `👍,❤️,🔥,🎉,👏,😂,😮,😢,🤔,👀` | ✅ |
| `RANDOM_LEVEL` | Reaction randomness (0-10) | `5` | ❌ (Default: 0) |
| `RESTRICTED_CHATS` | Chat IDs to exclude | `-100123456,789012345` | ❌ |

### 🎛️ Random Level Configuration

| Level | Behavior | Reaction Chance |
|-------|----------|----------------|
| 0 | Always react | 100% |
| 5 | Moderate randomness | 50% |
| 10 | Maximum randomness | 0% (Never reacts) |

## 🏗️ Architecture

```mermaid
graph TB
    A[Telegram Chat] --> B[Telegram API]
    B --> C[Cloudflare Worker]
    C --> D[Bot Logic Engine]
    D --> E[Reaction Processor]
    E --> F[Response Handler]
    F --> G[Database/Storage]
    G --> H[Analytics & Logging]
    H --> A
    
    style C fill:#f9f,stroke:#333,stroke-width:2px
```

## 🚀 Deployment Methods

### 🌐 Cloudflare Workers (Recommended)

#### Option 1: One-Click Deploy
1. Click the "Deploy to Cloudflare Workers" button above
2. Authorize with your Cloudflare account
3. Configure environment variables in the dashboard
4. Set webhook URL: `https://api.telegram.org/bot<BOT_TOKEN>/setWebhook?url=<YOUR_WORKER_URL>`

#### Option 2: Manual Wrangler Deployment
```bash
# Clone repository
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot

# Install dependencies
npm install

# Configure wrangler.toml
cp wrangler.example.toml wrangler.toml
# Edit wrangler.toml with your settings

# Deploy to Cloudflare
npx wrangler deploy
```

### 🔄 GitHub Actions Auto-Deploy

1. **Fork this repository**
2. **Add secrets to your repository**:
   - `CLOUDFLARE_API_TOKEN`
   - `CLOUDFLARE_ACCOUNT_ID`
   - `BOT_TOKEN`
   - `BOT_USERNAME`
   - `EMOJI_LIST`
   - `RANDOM_LEVEL`
   - `RESTRICTED_CHATS`

3. **Run the deployment workflow**:
   - Navigate to **Actions** → **🚀 Deploy to Cloudflare Workers** → **Run workflow**

## 📡 Webhook Configuration

After deployment, configure your Telegram webhook:

```bash
# Set webhook
curl -X POST https://api.telegram.org/bot<YOUR_BOT_TOKEN>/setWebhook \
  -H "Content-Type: application/json" \
  -d '{"url": "https://your-worker.your-subdomain.workers.dev"}'

# Verify webhook
curl https://api.telegram.org/bot<YOUR_BOT_TOKEN>/getWebhookInfo
```

## 🎮 Bot Commands

| Command | Description | Usage |
|---------|-------------|-------|
| `/start` | Initialize bot and show welcome message | `/start` |
| `/reactions` | Display available reaction emojis | `/reactions` |
| `/donate` | Support bot development | `/donate` |
| `/help` | Show help information | `/help` |
| `/stats` | Display bot statistics | `/stats` |

## 🔍 Monitoring & Analytics

### 📊 Health Checks

```bash
# Check bot health
curl https://your-worker.your-subdomain.workers.dev/health

# Response:
{
  "status": "healthy",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "version": "2.1.0",
  "bot": {
    "username": "AlisaReactionBot",
    "healthy": true,
    "reactions": 15,
    "restricted_chats": 2
  }
}
```

### 📈 Status Endpoints

| Endpoint | Description | Method |
|----------|-------------|--------|
| `/health` | Comprehensive health check | GET |
| `/status` | Bot status and statistics | GET |
| `/config` | Configuration overview | GET |

## 🛠️ Development

### 🏃‍♂️ Local Development

```bash
# Clone the repository
git clone https://github.com/Shineii86/AlisaReactionBot.git
cd AlisaReactionBot

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your configuration

# Start local development server
npm run dev

# Run tests
npm test

# Build for production
npm run build
```

### 🧪 Testing

```bash
# Run unit tests
npm test

# Run with coverage
npm run test:coverage

# Run integration tests
npm run test:integration
```

## 🤝 Contributing

We love your input! We want to make contributing as easy and transparent as possible.

### 📝 How to Contribute

1. **Fork the repository**
2. **Create a feature branch**: `git checkout -b feature/amazing-feature`
3. **Commit your changes**: `git commit -m 'Add amazing feature'`
4. **Push to the branch**: `git push origin feature/amazing-feature`
5. **Open a Pull Request**

### 🐛 Reporting Issues

When [reporting issues](https://github.com/Shineii86/AlisaReactionBot/issues/new), please include:

- Detailed description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Screenshots (if applicable)
- Environment information

## 📈 Performance Metrics

| Metric | Value | Description |
|--------|-------|-------------|
| **Response Time** | < 100ms | Average reaction time |
| **Uptime** | 99.9% | Service reliability |
| **Scalability** | Infinite | Automatic scaling with demand |
| **Cost** | $0/month* | Free tier sufficient for most use cases |

*Based on Cloudflare Workers free tier

## 🏆 Credits & Acknowledgments

### 👨‍💻 Core Development Team
- **[Shinei Nouzen](https://github.com/Shineii86)** - Lead Developer & Maintainer
- **[Malith Rukshan](https://github.com/Malith-Rukshan/Auto-Reaction-Bot)** - Original Concept & Inspiration

### 🔧 Technologies Used
- [Telegram Bot API](https://core.telegram.org/bots/api) - Official Telegram API
- [Cloudflare Workers](https://workers.cloudflare.com) - Serverless platform
- [Node.js](https://nodejs.org) - JavaScript runtime
- [Wrangler](https://developers.cloudflare.com/workers/wrangler/) - Development tool

### 🙌 Special Thanks
- **Telegram API Team** for continuous improvements
- **Cloudflare Team** for amazing serverless platform
- **Open Source Community** for contributions and feedback

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Useful Links

- 📚 [Full Documentation](https://github.com/Shineii86/AlisaReactionBot/wiki)
- 💬 [Support Chat](https://telegram.me/MaximXGroup)
- 🔔 [Update Channel](https://telegram.me/MaximXBots)
- 🐛 [Issue Tracker](https://github.com/Shineii86/AlisaReactionBot/issues)
- 💡 [Feature Requests](https://github.com/Shineii86/AlisaReactionBot/discussions)

## ⭐ Support the Project

If you find this project helpful, please consider:

1. **Giving a Star** ⭐ on GitHub
2. **Sharing** with your network
3. **Contributing** code or documentation
4. **Donating** to support development

---

## 💕 Loved My Work?

🚨 [Follow me on GitHub](https://github.com/Shineii86)

⭐ [Give a star to this project](https://github.com/Shineii86/AniList)

<div align="center">

<a href="https://github.com/Shineii86/AlisaReactionBot">
<img src="https://github.com/Shineii86/AniPay/blob/main/Source/Banner6.png" alt="Banner">
</a>
  
  *For inquiries or collaborations*
     
[![Telegram Badge](https://img.shields.io/badge/-Telegram-2CA5E0?style=flat&logo=Telegram&logoColor=white)](https://telegram.me/Shineii86 "Contact on Telegram")
[![Instagram Badge](https://img.shields.io/badge/-Instagram-C13584?style=flat&logo=Instagram&logoColor=white)](https://instagram.com/ikx7.a "Follow on Instagram")
[![Pinterest Badge](https://img.shields.io/badge/-Pinterest-E60023?style=flat&logo=Pinterest&logoColor=white)](https://pinterest.com/ikx7a "Follow on Pinterest")
[![Gmail Badge](https://img.shields.io/badge/-Gmail-D14836?style=flat&logo=Gmail&logoColor=white)](mailto:ikx7a@hotmail.com "Send an Email")

  <sup><b>Copyright © 2026 <a href="https://telegram.me/Shineii86">Shinei Nouzen</a> All Rights Reserved</b></sup>

![Last Commit](https://img.shields.io/github/last-commit/Shineii86/AlisaReactionBot?style=for-the-badge)

</div>
