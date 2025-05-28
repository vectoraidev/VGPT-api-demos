# Simple Wallet Analysis Bot

A lightweight bot that analyzes Ethereum wallets and provides portfolio insights, inspired by Vector AI's portfolio management features.

## Features

- 🔍 **Wallet Analysis**: Get token balances across multiple chains
- 💰 **Portfolio Value**: Calculate total portfolio worth in USD
- 🏆 **Top Holdings**: Display largest token positions
- 📊 **Chain Distribution**: Show assets across different networks
- 🎯 **Simple Commands**: Easy-to-use command interface

## Quick Start

```bash
git clone https://github.com/vectoraidev/simple-wallet-bot
cd simple-wallet-bot
npm install
cp .env.example .env
# Add your API keys to .env
npm start
```

## Environment Variables

```env
# Required
ALCHEMY_API_KEY=your_alchemy_key
COINGECKO_API_KEY=your_coingecko_key

# Optional
DISCORD_BOT_TOKEN=your_discord_token
TELEGRAM_BOT_TOKEN=your_telegram_token
```

## Usage Examples

### Command Line
```bash
node bot.js analyze 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45
```

### Discord Bot
```
!wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45
```

### Telegram Bot
```
/analyze 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45
```

## Sample Output

```
🔍 Wallet Analysis: 0x742d...Db45

💰 Total Portfolio Value: $45,234.56

🏆 Top Holdings:
1. ETH: 12.5 ETH ($31,250.00)
2. USDC: 8,500 USDC ($8,500.00)
3. WBTC: 0.15 WBTC ($4,234.56)

📊 Chain Distribution:
• Ethereum: $38,500 (85.1%)
• Polygon: $4,200 (9.3%)
• Arbitrum: $2,534 (5.6%)

⚡ Powered by Vector AI Technology
```

## Customization

### Add New Chains
```javascript
const SUPPORTED_CHAINS = {
  ethereum: { id: 1, name: 'Ethereum', rpc: 'https://eth-mainnet.alchemyapi.io/v2/' },
  polygon: { id: 137, name: 'Polygon', rpc: 'https://polygon-mainnet.alchemyapi.io/v2/' },
  arbitrum: { id: 42161, name: 'Arbitrum', rpc: 'https://arb-mainnet.alchemyapi.io/v2/' },
  // Add your chain here
};
```

### Custom Analysis Features
```javascript
// Add custom metrics
async function analyzeWallet(address) {
  const portfolio = await getPortfolio(address);
  
  // Your custom analysis here
  const riskScore = calculateRiskScore(portfolio);
  const diversification = calculateDiversification(portfolio);
  
  return {
    ...portfolio,
    riskScore,
    diversification
  };
}
```

## API Endpoints

If running as a web service:

```
GET /api/wallet/:address
POST /api/analyze
GET /api/portfolio/:address/summary
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

This bot is inspired by [Vector AI](https://vector-ai.pro) - the most advanced blockchain AI assistant. Check out the full platform for advanced features like:

- Natural language blockchain queries
- Real-time transaction execution
- Multi-chain portfolio management
- NFT collection tracking
- Advanced trading tools

---

⚡ **Want more advanced features?** Check out [Vector AI](https://vector-ai.pro) for the full experience! 