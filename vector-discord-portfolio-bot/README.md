# Discord Portfolio Bot

A Discord bot that provides real-time portfolio tracking and blockchain analytics, inspired by Vector AI's portfolio management features.

## Features

- 💼 **Portfolio Tracking**: Track wallet balances across multiple chains
- 🔍 **Wallet Analysis**: Detailed breakdown of holdings and values
- 📊 **Price Alerts**: Set alerts for token price changes
- 🏆 **Leaderboards**: Compare portfolios with server members
- 🎯 **Commands**: Easy-to-use slash commands
- ⚡ **Real-time Updates**: Live price and balance updates

## Quick Start

```bash
git clone https://github.com/vectoraidev/discord-portfolio-bot
cd discord-portfolio-bot
npm install
cp .env.example .env
# Add your Discord bot token and API keys to .env
npm start
```

## Bot Commands

### Portfolio Commands
```
/portfolio <wallet_address> - View wallet portfolio
/track <wallet_address> - Track a wallet for updates
/untrack <wallet_address> - Stop tracking a wallet
/mywallets - View your tracked wallets
```

### Price Commands
```
/price <token> - Get current token price
/alert <token> <price> - Set price alert
/alerts - View your active alerts
/top - Show top cryptocurrencies
```

### Analysis Commands
```
/analyze <wallet_address> - Deep wallet analysis
/compare <wallet1> <wallet2> - Compare two wallets
/leaderboard - Server portfolio leaderboard
/gas - Current gas prices across chains
```

## Example Usage

### Portfolio Tracking
```
User: /portfolio 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45

Bot: 📊 Portfolio Analysis for 0x742d...Db45

💰 Total Value: $45,234.56

🏆 Top Holdings:
• ETH: 12.5 ETH ($31,250.00)
• USDC: 8,500 USDC ($8,500.00)
• WBTC: 0.15 WBTC ($4,234.56)

📈 24h Change: +$1,234.56 (+2.8%)

⚡ Powered by Vector AI
```

### Price Alerts
```
User: /alert bitcoin 50000

Bot: 🔔 Price alert set!
I'll notify you when Bitcoin reaches $50,000

Current price: $43,250.00
Target: $50,000.00 (+15.6%)
```

### Wallet Comparison
```
User: /compare 0x123... 0x456...

Bot: ⚖️ Wallet Comparison

Wallet A (0x123...): $125,000
Wallet B (0x456...): $89,500

Common Holdings:
• ETH: A has 45.2 ETH, B has 32.1 ETH
• USDC: A has 15,000 USDC, B has 8,500 USDC

Unique to A: WBTC, UNI, AAVE
Unique to B: MATIC, LINK, CRV
```

## Setup Instructions

### 1. Create Discord Application
1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to "Bot" section and create a bot
4. Copy the bot token

### 2. Environment Variables
```env
# Discord
DISCORD_BOT_TOKEN=your_discord_bot_token
DISCORD_CLIENT_ID=your_discord_client_id

# APIs
ALCHEMY_API_KEY=your_alchemy_key
COINGECKO_API_KEY=your_coingecko_key

# Database (optional)
DATABASE_URL=your_database_url

# Configuration
PREFIX=!
CACHE_DURATION=300000
```

### 3. Invite Bot to Server
Use this URL template (replace CLIENT_ID):
```
https://discord.com/api/oauth2/authorize?client_id=CLIENT_ID&permissions=2048&scope=bot%20applications.commands
```

### 4. Deploy Commands
```bash
npm run deploy-commands
```

## Features

### Real-time Notifications
- Price alerts when targets are hit
- Portfolio value change notifications
- Large transaction alerts for tracked wallets

### Data Persistence
- User preferences and tracked wallets
- Price alert settings
- Historical portfolio data

### Multi-chain Support
- Ethereum, Polygon, Arbitrum, Base, Optimism
- Automatic chain detection
- Cross-chain portfolio aggregation

### Security Features
- Rate limiting per user
- Input validation and sanitization
- Secure API key handling

## Customization

### Add Custom Commands
```javascript
// commands/custom.js
const { SlashCommandBuilder } = require('discord.js');

module.exports = {
  data: new SlashCommandBuilder()
    .setName('custom')
    .setDescription('Your custom command'),
  async execute(interaction) {
    // Your custom logic here
    await interaction.reply('Custom response!');
  },
};
```

### Add New Chains
```javascript
// config/chains.js
const CHAINS = {
  ethereum: { id: 1, name: 'Ethereum', symbol: 'ETH' },
  polygon: { id: 137, name: 'Polygon', symbol: 'MATIC' },
  // Add your chain here
  avalanche: { id: 43114, name: 'Avalanche', symbol: 'AVAX' },
};
```

### Custom Embeds
```javascript
// utils/embeds.js
const { EmbedBuilder } = require('discord.js');

function createPortfolioEmbed(portfolio) {
  return new EmbedBuilder()
    .setTitle('📊 Portfolio Analysis')
    .setColor('#8B5CF6') // Vector AI purple
    .addFields(
      { name: '💰 Total Value', value: `$${portfolio.totalValue}` },
      { name: '🏆 Top Holdings', value: portfolio.topHoldings }
    )
    .setFooter({ text: 'Powered by Vector AI' });
}
```

## Deployment

### Heroku
```bash
heroku create your-bot-name
heroku config:set DISCORD_BOT_TOKEN=your_token
git push heroku main
```

### Railway
```bash
railway login
railway deploy
```

### VPS/Server
```bash
# Using PM2
npm install -g pm2
pm2 start bot.js --name portfolio-bot
pm2 startup
pm2 save
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

MIT License - feel free to use this in your own projects!

## Inspiration

This Discord bot is inspired by [Vector AI](https://vector-ai.pro) - the most advanced blockchain AI assistant. Vector AI provides comprehensive portfolio management with natural language queries and real-time insights.

### Vector AI Features:
- Natural language blockchain interaction
- Advanced portfolio analytics
- Multi-chain asset tracking
- NFT collection management
- AI-powered trading insights
- Real-time transaction execution

---

⚡ **Want the full AI experience?** Try [Vector AI](https://vector-ai.pro) for advanced blockchain interactions with natural language! 