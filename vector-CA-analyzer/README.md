# Vector AI Smart Contract Analyzer & Summarizer

An advanced smart contract analysis tool powered by Vector AI's language models. This system automatically discovers, reads, analyzes, and scores smart contracts using AI-powered insights and comprehensive security assessments.

## 🚀 Features

- 🧠 **AI-Powered Contract Reading**: Uses Vector AI to understand and summarize complex smart contracts
- 🔍 **Automatic Discovery**: Finds contracts from transactions, addresses, and blockchain explorers
- 📊 **Security Scoring**: AI-driven security assessment with risk factors
- 🌐 **Multi-Source Analysis**: Scrapes documentation, GitHub repos, and audit reports
- 📈 **Pattern Recognition**: Identifies common contract patterns and vulnerabilities
- 🎯 **Natural Language Summaries**: Human-readable explanations of contract functionality
- 🚨 **Risk Assessment**: Comprehensive risk scoring with detailed explanations
- 📋 **Audit Integration**: Incorporates findings from major audit firms

## 🛠️ Installation

```bash
git clone https://github.com/vectoraidev/smart-contract-analyzer
cd smart-contract-analyzer
npm install
cp env.example .env
# Configure your Vector AI API key and other settings
npm start
```

## 🔑 Environment Configuration

```env
# Vector AI API (Required)
VECTOR_API_KEY=your_vector_ai_api_key
VECTOR_API_URL=https://api.vector-ai.pro/v1

# Blockchain APIs
ETHERSCAN_API_KEY=your_etherscan_api_key
POLYGONSCAN_API_KEY=your_polygonscan_api_key
ARBISCAN_API_KEY=your_arbiscan_api_key
ALCHEMY_API_KEY=your_alchemy_api_key

# Code Analysis
GITHUB_TOKEN=your_github_token
SOURCIFY_API_URL=https://sourcify.dev/server

# Security & Audits
CERTIK_API_KEY=your_certik_api_key
CONSENSYS_API_KEY=your_consensys_api_key

# Configuration
ANALYSIS_DEPTH=comprehensive
SECURITY_THRESHOLD=7.0
CACHE_DURATION=3600000
```

## 📋 Usage Examples

### Command Line Analysis
```bash
# Analyze a single contract
node analyzer.js --contract 0x6B175474E89094C44Da98b954EedeAC495271d0F

# Analyze with deep security scan
node analyzer.js --contract 0x6B175474E89094C44Da98b954EedeAC495271d0F --security

# Batch analysis from file
node analyzer.js --batch contracts.txt

# Analyze recent transactions for new contracts
node analyzer.js --discover --blocks 100

# Generate detailed report
node analyzer.js --contract 0x6B175474E89094C44Da98b954EedeAC495271d0F --report
```

### API Endpoints
```javascript
// Contract analysis
POST /api/analyze/contract
GET /api/analyze/:address
GET /api/analyze/:address/security
GET /api/analyze/:address/summary

// Discovery and monitoring
POST /api/discover/recent
GET /api/discover/trending
POST /api/monitor/add
GET /api/monitor/alerts

// AI-powered insights
POST /api/ai/explain
POST /api/ai/compare
POST /api/ai/audit
```

## 🧠 AI-Powered Analysis

### Contract Understanding
```javascript
const analysis = await vectorAI.analyzeContract({
  address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  includeSource: true,
  depth: "comprehensive",
  features: [
    "functionality_analysis",
    "security_assessment", 
    "gas_optimization",
    "upgrade_patterns"
  ]
});

console.log(analysis.aiSummary);
// "This is a standard ERC-20 token contract implementing DAI stablecoin..."
```

### Security Assessment
```javascript
const securityReport = await vectorAI.assessSecurity({
  contract: contractAddress,
  includeAudits: true,
  checkPatterns: [
    "reentrancy",
    "overflow",
    "access_control",
    "upgrade_safety"
  ]
});

// Output:
{
  securityScore: 8.5,
  riskLevel: "Low",
  vulnerabilities: [
    {
      type: "centralization_risk",
      severity: "medium",
      description: "Owner has significant control over contract parameters"
    }
  ],
  recommendations: [
    "Consider implementing timelock for admin functions",
    "Add multi-signature requirement for critical operations"
  ]
}
```

## 📊 Sample Analysis Output

```
🧠 Vector AI Smart Contract Analysis
Contract: 0x6B17...1d0F (DAI Stablecoin)

📋 Contract Summary:
Type: ERC-20 Token Contract
Purpose: Decentralized stablecoin with collateral backing
Complexity: High (2,847 lines of code)
Last Updated: 2023-08-15

🎯 AI Analysis:
"This contract implements the DAI stablecoin system with sophisticated 
collateral management. It features multi-collateral support, liquidation 
mechanisms, and governance controls. The architecture follows MakerDAO's 
proven design patterns with extensive safety mechanisms."

🔒 Security Assessment: 8.5/10 (Low Risk)
✅ Strengths:
• Extensive audit history (Trail of Bits, ConsenSys, Certik)
• Battle-tested codebase with 3+ years in production
• Comprehensive access controls and emergency mechanisms
• Formal verification for critical functions

⚠️ Risk Factors:
• Centralized governance controls (Medium)
• Complex liquidation logic (Low)
• Oracle dependency risk (Low)

🔍 Code Quality Analysis:
• Gas Efficiency: 7.8/10 - Well optimized with some improvement opportunities
• Documentation: 9.2/10 - Excellent inline documentation and external docs
• Test Coverage: 95% - Comprehensive test suite
• Upgrade Safety: 8.0/10 - Proxy pattern with timelock protection

📈 Usage Patterns:
• Daily Transactions: ~15,000
• Unique Users (30d): 8,500
• Total Value Locked: $4.2B
• Integration Count: 450+ protocols

🚀 AI Recommendations:
1. Consider implementing additional oracle redundancy
2. Optimize gas usage in liquidation functions (potential 15% savings)
3. Enhance monitoring for unusual governance proposals
4. Document emergency response procedures more clearly

📚 Related Resources:
• Documentation: https://docs.makerdao.com
• Audit Reports: 5 major audits completed
• GitHub: https://github.com/makerdao/dss
• Community: https://forum.makerdao.com

⚡ Powered by Vector AI Advanced Analysis
```

## 🔧 Advanced Features

### Multi-Source Data Aggregation
```javascript
// config/sources.js
const DATA_SOURCES = {
  blockchain: {
    etherscan: { priority: 1, timeout: 5000 },
    sourcify: { priority: 2, timeout: 3000 },
    alchemy: { priority: 3, timeout: 2000 }
  },
  documentation: {
    github: { priority: 1, depth: 3 },
    gitbook: { priority: 2, depth: 2 },
    notion: { priority: 3, depth: 1 }
  },
  security: {
    certik: { priority: 1, cache: 86400 },
    consensys: { priority: 2, cache: 86400 },
    immunefi: { priority: 3, cache: 43200 }
  }
};
```

### AI Prompt Engineering
```javascript
// config/prompts.js
const ANALYSIS_PROMPTS = {
  summary: `Analyze this smart contract and provide a comprehensive summary including:
    - Primary purpose and functionality
    - Key features and mechanisms
    - Target users and use cases
    - Notable design patterns`,
    
  security: `Perform a security analysis focusing on:
    - Common vulnerability patterns
    - Access control mechanisms
    - Upgrade and governance risks
    - Economic attack vectors`,
    
  comparison: `Compare these contracts and highlight:
    - Functional differences
    - Security trade-offs
    - Gas efficiency variations
    - Implementation approaches`
};
```

## 🤖 Vector AI Integration

### Advanced Contract Analysis
```javascript
class VectorContractAnalyzer {
  constructor(apiKey) {
    this.vectorAI = new VectorAI(apiKey);
    this.cache = new Map();
  }

  async analyzeContract(address, options = {}) {
    // Get contract source code
    const sourceCode = await this.getSourceCode(address);
    
    // Scrape documentation and audits
    const documentation = await this.scrapeDocumentation(address);
    const audits = await this.getAuditReports(address);
    
    // AI-powered analysis
    const analysis = await this.vectorAI.analyze({
      type: 'smart_contract',
      data: {
        address,
        sourceCode,
        documentation,
        audits,
        blockchain: options.chain || 'ethereum'
      },
      features: [
        'functionality_summary',
        'security_assessment',
        'gas_analysis',
        'pattern_recognition',
        'risk_scoring'
      ]
    });

    return this.formatAnalysis(analysis);
  }

  async generateSecurityScore(contract) {
    const factors = await this.assessSecurityFactors(contract);
    
    const score = await this.vectorAI.score({
      type: 'security_assessment',
      factors,
      weights: {
        audit_history: 0.3,
        code_quality: 0.25,
        access_controls: 0.2,
        upgrade_safety: 0.15,
        economic_model: 0.1
      }
    });

    return score;
  }
}
```

## 📈 Discovery & Monitoring

### Automated Contract Discovery
```javascript
// Discover new contracts from recent blocks
const discovery = await analyzer.discoverContracts({
  blocks: 100,
  minTransactions: 10,
  excludeTokens: false,
  includeProxies: true
});

// Monitor specific patterns
await analyzer.addMonitor({
  pattern: "proxy_upgrade",
  contracts: ["0x123...", "0x456..."],
  alerts: ["telegram", "discord", "email"]
});
```

### Trending Contract Analysis
```javascript
// Analyze trending contracts
const trending = await analyzer.getTrendingContracts({
  timeframe: "24h",
  minVolume: 1000000,
  chains: ["ethereum", "polygon", "arbitrum"]
});

for (const contract of trending) {
  const analysis = await analyzer.quickAnalysis(contract.address);
  console.log(`${contract.name}: Security Score ${analysis.securityScore}/10`);
}
```

## 🔒 Security Features

### Vulnerability Detection
- **Reentrancy Attacks**: Pattern matching and flow analysis
- **Integer Overflow/Underflow**: SafeMath usage verification
- **Access Control**: Role-based permission analysis
- **Upgrade Risks**: Proxy pattern security assessment
- **Economic Exploits**: Tokenomics and incentive analysis

### Audit Integration
- **Automated Report Parsing**: Extracts findings from PDF/HTML reports
- **Severity Mapping**: Standardizes risk levels across audit firms
- **Historical Tracking**: Monitors fix implementation over time
- **Continuous Monitoring**: Alerts on new vulnerabilities

## 🚀 Deployment Options

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

### Serverless Deployment
```yaml
# serverless.yml
service: vector-contract-analyzer
provider:
  name: aws
  runtime: nodejs18.x
  environment:
    VECTOR_API_KEY: ${env:VECTOR_API_KEY}
functions:
  analyze:
    handler: src/handlers/analyze.handler
    timeout: 300
    memorySize: 1024
```

## 📚 Documentation & Resources

### API Documentation
- [Vector AI API Reference](https://docs.vector-ai.pro/api)
- [Smart Contract Analysis Guide](https://docs.vector-ai.pro/guides/contracts)
- [Security Assessment Framework](https://docs.vector-ai.pro/security)

### Educational Resources
- [Smart Contract Security Best Practices](https://docs.vector-ai.pro/security/best-practices)
- [Common Vulnerability Patterns](https://docs.vector-ai.pro/security/vulnerabilities)
- [AI-Powered Code Analysis](https://docs.vector-ai.pro/ai/code-analysis)

## 🤝 Contributing

We welcome contributions to improve the analyzer!

### Development Setup
```bash
git clone https://github.com/vectoraidev/smart-contract-analyzer
cd smart-contract-analyzer
npm install
npm run dev
```

### Adding New Analysis Features
1. Create analysis module in `src/analyzers/`
2. Add AI prompts in `config/prompts.js`
3. Update scoring algorithm in `src/scoring/`
4. Add tests in `tests/`

## 📄 License

MIT License - feel free to use this in your own projects!

## 🌟 Powered by Vector AI

This analyzer leverages [Vector AI](https://vector-ai.pro)'s advanced language models specifically trained for blockchain and smart contract analysis. Vector AI provides:

- **Code Understanding**: Deep comprehension of Solidity and Vyper contracts
- **Security Expertise**: Trained on thousands of audit reports and vulnerabilities
- **Pattern Recognition**: Identifies complex attack vectors and design patterns
- **Natural Language**: Explains technical concepts in human-readable format

---

⚡ **Ready for advanced contract analysis?** Visit [vector-ai.pro](https://vector-ai.pro) for the complete AI-powered blockchain platform! 