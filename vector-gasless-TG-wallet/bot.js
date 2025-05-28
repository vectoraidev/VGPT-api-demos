#!/usr/bin/env node

const { ethers } = require('ethers');
const axios = require('axios');
require('dotenv').config();

// Supported chains configuration
const CHAINS = {
  ethereum: {
    id: 1,
    name: 'Ethereum',
    symbol: 'ETH',
    rpc: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    explorer: 'https://etherscan.io'
  },
  polygon: {
    id: 137,
    name: 'Polygon',
    symbol: 'MATIC',
    rpc: `https://polygon-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    explorer: 'https://polygonscan.com'
  },
  arbitrum: {
    id: 42161,
    name: 'Arbitrum',
    symbol: 'ETH',
    rpc: `https://arb-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
    explorer: 'https://arbiscan.io'
  }
};

class WalletAnalyzer {
  constructor() {
    this.providers = {};
    this.initializeProviders();
  }

  initializeProviders() {
    for (const [chainName, config] of Object.entries(CHAINS)) {
      try {
        this.providers[chainName] = new ethers.JsonRpcProvider(config.rpc);
      } catch (error) {
        console.warn(`Failed to initialize ${chainName} provider:`, error.message);
      }
    }
  }

  async getTokenPrice(tokenId) {
    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${tokenId}&vs_currencies=usd`,
        {
          headers: {
            'X-CG-Demo-API-Key': process.env.COINGECKO_API_KEY
          }
        }
      );
      return response.data[tokenId]?.usd || 0;
    } catch (error) {
      console.warn(`Failed to get price for ${tokenId}:`, error.message);
      return 0;
    }
  }

  async getNativeBalance(address, chainName) {
    try {
      const provider = this.providers[chainName];
      if (!provider) return null;

      const balance = await provider.getBalance(address);
      const balanceInEth = ethers.formatEther(balance);
      
      // Get price for native token
      const priceId = chainName === 'polygon' ? 'matic-network' : 'ethereum';
      const price = await this.getTokenPrice(priceId);
      
      return {
        chain: CHAINS[chainName].name,
        symbol: CHAINS[chainName].symbol,
        balance: parseFloat(balanceInEth),
        value: parseFloat(balanceInEth) * price,
        price
      };
    } catch (error) {
      console.warn(`Failed to get native balance for ${chainName}:`, error.message);
      return null;
    }
  }

  async analyzeWallet(address) {
    console.log(`🔍 Analyzing wallet: ${address}`);
    
    if (!ethers.isAddress(address)) {
      throw new Error('Invalid Ethereum address');
    }

    const results = {
      address,
      chains: {},
      totalValue: 0,
      topHoldings: [],
      chainDistribution: {}
    };

    // Get native balances for each chain
    for (const chainName of Object.keys(CHAINS)) {
      console.log(`Checking ${CHAINS[chainName].name}...`);
      const balance = await this.getNativeBalance(address, chainName);
      
      if (balance && balance.balance > 0) {
        results.chains[chainName] = [balance];
        results.totalValue += balance.value;
        results.topHoldings.push({
          symbol: balance.symbol,
          balance: balance.balance,
          value: balance.value,
          chain: balance.chain
        });
      }
    }

    // Sort top holdings by value
    results.topHoldings.sort((a, b) => b.value - a.value);

    // Calculate chain distribution
    for (const [chainName, tokens] of Object.entries(results.chains)) {
      const chainValue = tokens.reduce((sum, token) => sum + token.value, 0);
      results.chainDistribution[CHAINS[chainName].name] = {
        value: chainValue,
        percentage: results.totalValue > 0 ? (chainValue / results.totalValue) * 100 : 0
      };
    }

    return results;
  }

  formatResults(results) {
    let output = `\n🔍 Wallet Analysis: ${results.address.slice(0, 6)}...${results.address.slice(-4)}\n\n`;
    
    output += `💰 Total Portfolio Value: $${results.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\n\n`;

    if (results.topHoldings.length > 0) {
      output += `🏆 Top Holdings:\n`;
      results.topHoldings.slice(0, 5).forEach((holding, index) => {
        output += `${index + 1}. ${holding.symbol}: ${holding.balance.toFixed(4)} ${holding.symbol} ($${holding.value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })})\n`;
      });
      output += '\n';
    }

    if (Object.keys(results.chainDistribution).length > 0) {
      output += `📊 Chain Distribution:\n`;
      for (const [chainName, data] of Object.entries(results.chainDistribution)) {
        output += `• ${chainName}: $${data.value.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })} (${data.percentage.toFixed(1)}%)\n`;
      }
      output += '\n';
    }

    output += `⚡ Powered by Vector AI Technology\n`;
    output += `🌐 Learn more: https://vector-ai.pro\n`;

    return output;
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  
  if (args.length === 0 || args[0] === '--help') {
    console.log(`
Vector AI Wallet Analyzer

Usage:
  node bot.js analyze <wallet_address>
  node bot.js --help

Examples:
  node bot.js analyze 0x742d35Cc6634C0532925a3b8D4C9db96C4b4Db45
  node bot.js analyze vitalik.eth

Environment Variables Required:
  ALCHEMY_API_KEY - Your Alchemy API key
  COINGECKO_API_KEY - Your CoinGecko API key (optional)

Inspired by Vector AI: https://vector-ai.pro
    `);
    return;
  }

  if (args[0] !== 'analyze' || !args[1]) {
    console.error('❌ Please provide a wallet address to analyze');
    console.log('Usage: node bot.js analyze <wallet_address>');
    return;
  }

  const address = args[1];
  const analyzer = new WalletAnalyzer();

  try {
    const results = await analyzer.analyzeWallet(address);
    console.log(analyzer.formatResults(results));
  } catch (error) {
    console.error('❌ Error analyzing wallet:', error.message);
  }
}

// Export for use as module
module.exports = { WalletAnalyzer };

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
} 