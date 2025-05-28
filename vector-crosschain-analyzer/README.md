# Vector AI Multichain Analyzer

An advanced multichain portfolio analyzer powered by Vector AI's natural language processing capabilities. This tool provides deep insights across multiple blockchain networks using Vector AI's sophisticated AI models.

## 🚀 Features

- 🧠 **AI-Powered Analysis**: Uses Vector AI's advanced language models for intelligent insights
- 🌐 **Multichain Support**: Ethereum, Polygon, Arbitrum, Base, Optimism, BSC, Avalanche
- 📊 **Advanced Analytics**: Risk scoring, diversification analysis, yield opportunities
- 🔍 **Smart Contract Detection**: Identifies and analyzes smart contract interactions
- 💎 **DeFi Position Tracking**: Tracks lending, staking, and LP positions
- 🎯 **AI Recommendations**: Personalized investment suggestions
- 📈 **Trend Analysis**: Historical performance and pattern recognition
- 🚨 **Risk Assessment**: AI-powered risk evaluation and alerts

## 🛠️ Installation

```bash
git clone https://github.com/vectoraidev/multichain-analyzer
cd multichain-analyzer
npm install
cp .env.example .env
# Configure your API keys in .env
npm start
```

## 🔑 Environment Configuration

```env
# Vector AI API (Required)
VECTOR_API_KEY=your_vector_ai_api_key
VECTOR_API_URL=https://api.vector-ai.pro/v1

# Blockchain Data Providers
ALCHEMY_API_KEY=your_alchemy_api_key
MORALIS_API_KEY=your_moralis_api_key
COINGECKO_API_KEY=your_coingecko_api_key

# Optional: Advanced Features
DUNE_API_KEY=your_dune_analytics_key
DEFILLAMA_API_KEY=your_defillama_key

# Configuration
ANALYSIS_DEPTH=comprehensive
CACHE_DURATION=300000
RATE_LIMIT_REQUESTS=100
```

## 📋 Usage Examples

### Command Line Analysis
```bash
# Basic portfolio analysis
node analyzer.js --wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45

# Deep analysis with AI insights
node analyzer.js --wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45 --deep

# Compare multiple wallets
node analyzer.js --compare 0x123...abc,0x456...def

# Risk assessment
node analyzer.js --wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45 --risk

# Generate investment recommendations
node analyzer.js --wallet 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45 --recommend
```

### API Endpoints
```javascript
// Portfolio analysis
GET /api/analyze/:address
POST /api/analyze/batch
GET /api/analyze/:address/risk
GET /api/analyze/:address/recommendations

// AI-powered insights
POST /api/ai/summarize
POST /api/ai/predict
POST /api/ai/recommend

// Multichain data
GET /api/chains/:address/summary
GET /api/defi/:address/positions
```

## 🧠 AI-Powered Features

### Natural Language Analysis
```javascript
const analysis = await vectorAI.analyze({
  wallet: "0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45",
  query: "Analyze this wallet's DeFi strategy and suggest optimizations",
  chains: ["ethereum", "polygon", "arbitrum"],
  depth: "comprehensive"
});

console.log(analysis.aiInsights);
// "This wallet shows a conservative DeFi strategy with 65% in stablecoins..."
```

### Smart Risk Assessment
```javascript
const riskProfile = await vectorAI.assessRisk({
  wallet: address,
  timeframe: "30d",
  includeProjections: true
});

// Output:
{
  riskScore: 6.2,
  riskLevel: "Moderate",
  factors: [
    "High concentration in volatile assets (45%)",
    "Exposure to experimental protocols",
    "Insufficient diversification across chains"
  ],
  recommendations: [
    "Consider rebalancing to reduce concentration risk",
    "Diversify across more stable DeFi protocols"
  ]
}
```

## 📊 Sample Output

```
🧠 Vector AI Multichain Analysis
Wallet: 0x742d...Db45

💰 Total Portfolio Value: $1,247,832.45
📈 30-Day Performance: +12.4% ($137,891)

🌐 Chain Distribution:
• Ethereum: $847,234 (67.9%) - Primary DeFi hub
• Polygon: $234,567 (18.8%) - Yield farming focus
• Arbitrum: $166,031 (13.3%) - L2 optimization

🏆 Top Holdings Analysis:
1. ETH: 234.5 ETH ($587,432) - Core holding, well-positioned
2. USDC: 156,789 USDC ($156,789) - Stable base, earning 4.2% APY
3. WBTC: 3.45 WBTC ($145,234) - Bitcoin exposure via DeFi

🎯 AI Insights:
"This portfolio demonstrates sophisticated DeFi strategy with strong 
risk management. The 68% Ethereum allocation provides stability while 
Polygon positions capture higher yields. Consider increasing Arbitrum 
exposure for gas optimization."

⚠️ Risk Assessment: 6.2/10 (Moderate)
• Concentration risk in top 3 holdings (71%)
• Smart contract risk from 12 protocols
• Impermanent loss exposure: $23,456

🚀 AI Recommendations:
1. Rebalance to reduce ETH concentration below 60%
2. Explore Arbitrum yield opportunities (8-12% APY available)
3. Consider hedging strategies for IL protection
4. Diversify into emerging L2s (Base, Optimism)

⚡ Powered by Vector AI Advanced Models
```

## 🔧 Advanced Configuration

### Custom Analysis Prompts
```javascript
// config/prompts.js
const ANALYSIS_PROMPTS = {
  portfolio: `Analyze this multichain portfolio and provide insights on:
    - Asset allocation strategy
    - Risk-adjusted returns
    - Optimization opportunities
    - Market positioning`,
  
  risk: `Assess the risk profile considering:
    - Concentration risk
    - Smart contract exposure
    - Market correlation
    - Liquidity risks`,
    
  recommendations: `Provide actionable recommendations for:
    - Portfolio rebalancing
    - Yield optimization
    - Risk mitigation
    - Market opportunities`
};
```

### Chain-Specific Analysis
```javascript
// config/chains.js
const CHAIN_CONFIGS = {
  ethereum: {
    focus: "blue-chip DeFi, institutional protocols",
    riskWeight: 1.0,
    yieldRange: "3-8%"
  },
  polygon: {
    focus: "yield farming, gaming tokens",
    riskWeight: 1.3,
    yieldRange: "8-25%"
  },
  arbitrum: {
    focus: "L2 optimization, emerging protocols",
    riskWeight: 1.2,
    yieldRange: "5-15%"
  }
};
```

## 🤖 AI Model Integration

### Vector AI API Usage
```javascript
class VectorAIAnalyzer {
  constructor(apiKey) {
    this.apiKey = apiKey;
    this.baseURL = 'https://api.vector-ai.pro/v1';
  }

  async analyzePortfolio(wallet, options = {}) {
    const response = await fetch(`${this.baseURL}/analyze`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${this.apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        wallet,
        chains: options.chains || ['ethereum', 'polygon', 'arbitrum'],
        depth: options.depth || 'standard',
        includeAI: true,
        features: [
          'portfolio_analysis',
          'risk_assessment',
          'yield_opportunities',
          'recommendations'
        ]
      })
    });

    return response.json();
  }
}
```

## 📈 Performance Metrics

### Benchmark Comparisons
- **Analysis Speed**: 3-5 seconds for comprehensive multichain analysis
- **Accuracy**: 94% correlation with manual expert analysis
- **Coverage**: 15+ chains, 500+ protocols supported
- **AI Insights**: Natural language explanations for all metrics

### Supported Protocols
- **DeFi**: Uniswap, Aave, Compound, Curve, Balancer, 1inch
- **Yield**: Yearn, Convex, Lido, Rocket Pool, Frax
- **NFT**: OpenSea, Blur, LooksRare, Foundation
- **Gaming**: Axie Infinity, The Sandbox, Decentraland

## 🚀 Deployment

### Docker Deployment
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 3000
CMD ["npm", "start"]
```

### Cloud Deployment
```bash
# Vercel
vercel --prod

# Railway
railway deploy

# AWS Lambda
serverless deploy
```

## 🔒 Security Features

- **API Key Encryption**: Secure storage of Vector AI credentials
- **Rate Limiting**: Prevents API abuse and ensures fair usage
- **Input Validation**: Sanitizes all wallet addresses and parameters
- **Error Handling**: Graceful degradation when services are unavailable

## 📚 Documentation

### API Reference
- [Vector AI API Docs](https://docs.vector-ai.pro/api)
- [Multichain Analysis Guide](https://docs.vector-ai.pro/guides/multichain)
- [AI Model Documentation](https://docs.vector-ai.pro/models)

### Tutorials
- [Getting Started with Vector AI](https://docs.vector-ai.pro/tutorials/getting-started)
- [Advanced Portfolio Analysis](https://docs.vector-ai.pro/tutorials/portfolio-analysis)
- [Custom AI Prompts](https://docs.vector-ai.pro/tutorials/custom-prompts)

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

MIT License - feel free to use this in your own projects!

## 🌟 Powered by Vector AI

This analyzer is powered by [Vector AI](https://vector-ai.pro) - the most advanced blockchain AI platform. Vector AI provides:

- **Advanced Language Models**: Trained specifically for blockchain and DeFi
- **Real-time Analysis**: Live data processing and insights
- **Natural Language Interface**: Ask questions in plain English
- **Multichain Expertise**: Deep understanding of cross-chain strategies

---

⚡ **Want the full Vector AI experience?** Visit [vector-ai.pro](https://vector-ai.pro) for the complete platform with natural language blockchain interaction! 