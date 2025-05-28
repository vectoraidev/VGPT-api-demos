const { ethers } = require('ethers');
const axios = require('axios');
const logger = require('../utils/logger');

class ChainManager {
  constructor() {
    this.chains = {
      ethereum: {
        id: 1,
        name: 'Ethereum',
        symbol: 'ETH',
        rpc: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        explorer: 'https://etherscan.io',
        coingeckoId: 'ethereum'
      },
      polygon: {
        id: 137,
        name: 'Polygon',
        symbol: 'MATIC',
        rpc: `https://polygon-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        explorer: 'https://polygonscan.com',
        coingeckoId: 'polygon-pos'
      },
      arbitrum: {
        id: 42161,
        name: 'Arbitrum',
        symbol: 'ETH',
        rpc: `https://arb-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        explorer: 'https://arbiscan.io',
        coingeckoId: 'arbitrum-one'
      },
      base: {
        id: 8453,
        name: 'Base',
        symbol: 'ETH',
        rpc: `https://base-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        explorer: 'https://basescan.org',
        coingeckoId: 'base'
      },
      optimism: {
        id: 10,
        name: 'Optimism',
        symbol: 'ETH',
        rpc: `https://opt-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
        explorer: 'https://optimistic.etherscan.io',
        coingeckoId: 'optimistic-ethereum'
      }
    };

    this.providers = {};
    this.initializeProviders();
    
    // Cache for price data
    this.priceCache = new Map();
    this.cacheTimeout = 5 * 60 * 1000; // 5 minutes
  }

  /**
   * Initialize blockchain providers
   * @private
   */
  initializeProviders() {
    for (const [chainName, config] of Object.entries(this.chains)) {
      try {
        this.providers[chainName] = new ethers.JsonRpcProvider(config.rpc);
        logger.debug(`Initialized provider for ${config.name}`);
      } catch (error) {
        logger.error(`Failed to initialize provider for ${config.name}:`, error.message);
      }
    }
  }

  /**
   * Get portfolio data across multiple chains
   * @param {string} address - Wallet address
   * @param {string[]} chains - Array of chain names
   * @returns {Promise<Object>} Portfolio data
   */
  async getPortfolioData(address, chains = ['ethereum', 'polygon', 'arbitrum']) {
    try {
      logger.info(`Fetching portfolio data for ${address} across ${chains.length} chains`);
      
      const portfolioPromises = chains.map(chain => 
        this.getChainPortfolio(address, chain).catch(error => {
          logger.error(`Failed to get portfolio for ${chain}:`, error.message);
          return { chain, error: error.message, tokens: [], totalValue: 0 };
        })
      );

      const chainPortfolios = await Promise.all(portfolioPromises);
      
      return this.aggregatePortfolioData(address, chainPortfolios);
    } catch (error) {
      logger.error('Portfolio data aggregation failed:', error);
      throw new Error(`Failed to fetch portfolio data: ${error.message}`);
    }
  }

  /**
   * Get portfolio data for a specific chain
   * @param {string} address - Wallet address
   * @param {string} chainName - Chain name
   * @returns {Promise<Object>} Chain portfolio data
   */
  async getChainPortfolio(address, chainName) {
    const chain = this.chains[chainName];
    if (!chain) {
      throw new Error(`Unsupported chain: ${chainName}`);
    }

    const provider = this.providers[chainName];
    if (!provider) {
      throw new Error(`Provider not available for ${chainName}`);
    }

    try {
      // Get native token balance
      const nativeBalance = await provider.getBalance(address);
      const nativePrice = await this.getTokenPrice(chain.symbol.toLowerCase());
      
      const nativeValue = parseFloat(ethers.formatEther(nativeBalance)) * nativePrice;

      // Get ERC-20 token balances (using Alchemy or Moralis)
      const tokenBalances = await this.getTokenBalances(address, chainName);
      
      // Calculate total chain value
      const totalValue = nativeValue + tokenBalances.reduce((sum, token) => sum + token.value, 0);

      return {
        chain: chainName,
        chainId: chain.id,
        name: chain.name,
        nativeToken: {
          symbol: chain.symbol,
          balance: ethers.formatEther(nativeBalance),
          price: nativePrice,
          value: nativeValue
        },
        tokens: tokenBalances,
        totalValue,
        error: null
      };
    } catch (error) {
      logger.error(`Error fetching ${chainName} portfolio:`, error);
      throw error;
    }
  }

  /**
   * Get ERC-20 token balances for an address
   * @param {string} address - Wallet address
   * @param {string} chainName - Chain name
   * @returns {Promise<Array>} Token balances
   */
  async getTokenBalances(address, chainName) {
    try {
      // Use Alchemy API for token balances
      const alchemyUrl = this.getAlchemyUrl(chainName);
      
      const response = await axios.post(alchemyUrl, {
        jsonrpc: '2.0',
        method: 'alchemy_getTokenBalances',
        params: [address],
        id: 1
      }, {
        headers: { 'Content-Type': 'application/json' },
        timeout: 10000
      });

      if (response.data.error) {
        throw new Error(response.data.error.message);
      }

      const tokenBalances = response.data.result.tokenBalances || [];
      
      // Get token metadata and prices
      const enrichedTokens = await Promise.all(
        tokenBalances
          .filter(token => token.tokenBalance !== '0x0')
          .slice(0, 20) // Limit to top 20 tokens
          .map(token => this.enrichTokenData(token, chainName))
      );

      return enrichedTokens.filter(token => token !== null);
    } catch (error) {
      logger.error(`Error fetching token balances for ${chainName}:`, error.message);
      return [];
    }
  }

  /**
   * Enrich token data with metadata and price
   * @param {Object} token - Raw token data
   * @param {string} chainName - Chain name
   * @returns {Promise<Object|null>} Enriched token data
   */
  async enrichTokenData(token, chainName) {
    try {
      const provider = this.providers[chainName];
      
      // Get token metadata
      const tokenContract = new ethers.Contract(
        token.contractAddress,
        [
          'function name() view returns (string)',
          'function symbol() view returns (string)',
          'function decimals() view returns (uint8)'
        ],
        provider
      );

      const [name, symbol, decimals] = await Promise.all([
        tokenContract.name().catch(() => 'Unknown'),
        tokenContract.symbol().catch(() => 'UNKNOWN'),
        tokenContract.decimals().catch(() => 18)
      ]);

      const balance = parseFloat(ethers.formatUnits(token.tokenBalance, decimals));
      
      if (balance === 0) return null;

      // Get token price
      const price = await this.getTokenPrice(symbol.toLowerCase());
      const value = balance * price;

      return {
        contractAddress: token.contractAddress,
        name,
        symbol,
        decimals,
        balance,
        price,
        value
      };
    } catch (error) {
      logger.debug(`Failed to enrich token ${token.contractAddress}:`, error.message);
      return null;
    }
  }

  /**
   * Get token price from CoinGecko
   * @param {string} symbol - Token symbol
   * @returns {Promise<number>} Token price in USD
   */
  async getTokenPrice(symbol) {
    const cacheKey = symbol.toLowerCase();
    const cached = this.priceCache.get(cacheKey);
    
    if (cached && Date.now() - cached.timestamp < this.cacheTimeout) {
      return cached.price;
    }

    try {
      const response = await axios.get(
        `https://api.coingecko.com/api/v3/simple/price?ids=${this.getCoingeckoId(symbol)}&vs_currencies=usd`,
        {
          headers: process.env.COINGECKO_API_KEY ? {
            'X-CG-Pro-API-Key': process.env.COINGECKO_API_KEY
          } : {},
          timeout: 5000
        }
      );

      const coingeckoId = this.getCoingeckoId(symbol);
      const price = response.data[coingeckoId]?.usd || 0;
      
      // Cache the price
      this.priceCache.set(cacheKey, {
        price,
        timestamp: Date.now()
      });

      return price;
    } catch (error) {
      logger.debug(`Failed to get price for ${symbol}:`, error.message);
      return 0;
    }
  }

  /**
   * Aggregate portfolio data from multiple chains
   * @param {string} address - Wallet address
   * @param {Array} chainPortfolios - Array of chain portfolio data
   * @returns {Object} Aggregated portfolio data
   */
  aggregatePortfolioData(address, chainPortfolios) {
    const totalValue = chainPortfolios.reduce((sum, chain) => sum + (chain.totalValue || 0), 0);
    
    // Calculate chain distribution
    const chainDistribution = chainPortfolios
      .filter(chain => !chain.error && chain.totalValue > 0)
      .map(chain => ({
        name: chain.name,
        value: chain.totalValue,
        percentage: (chain.totalValue / totalValue) * 100,
        description: this.getChainDescription(chain.chain)
      }))
      .sort((a, b) => b.value - a.value);

    // Get top holdings across all chains
    const allTokens = [];
    chainPortfolios.forEach(chain => {
      if (!chain.error) {
        // Add native token
        if (chain.nativeToken.value > 0) {
          allTokens.push({
            ...chain.nativeToken,
            chain: chain.name,
            contractAddress: 'native'
          });
        }
        // Add ERC-20 tokens
        chain.tokens.forEach(token => {
          allTokens.push({
            ...token,
            chain: chain.name
          });
        });
      }
    });

    const topHoldings = allTokens
      .sort((a, b) => b.value - a.value)
      .slice(0, 10)
      .map(token => ({
        ...token,
        percentage: (token.value / totalValue) * 100
      }));

    return {
      address,
      totalValue,
      chainDistribution,
      topHoldings,
      chainPortfolios: chainPortfolios.filter(chain => !chain.error),
      errors: chainPortfolios.filter(chain => chain.error),
      timestamp: new Date().toISOString(),
      // Placeholder for performance data (would need historical data)
      change24h: 0,
      change30d: 0
    };
  }

  /**
   * Get Alchemy URL for a chain
   * @param {string} chainName - Chain name
   * @returns {string} Alchemy URL
   */
  getAlchemyUrl(chainName) {
    const chain = this.chains[chainName];
    return chain.rpc;
  }

  /**
   * Get CoinGecko ID for a token symbol
   * @param {string} symbol - Token symbol
   * @returns {string} CoinGecko ID
   */
  getCoingeckoId(symbol) {
    const symbolMap = {
      'eth': 'ethereum',
      'matic': 'matic-network',
      'btc': 'bitcoin',
      'usdc': 'usd-coin',
      'usdt': 'tether',
      'dai': 'dai',
      'weth': 'weth',
      'wbtc': 'wrapped-bitcoin',
      'uni': 'uniswap',
      'aave': 'aave',
      'comp': 'compound-governance-token',
      'mkr': 'maker',
      'snx': 'havven',
      'crv': 'curve-dao-token',
      'bal': 'balancer',
      'yfi': 'yearn-finance',
      'sushi': 'sushi',
      '1inch': '1inch',
      'link': 'chainlink'
    };

    return symbolMap[symbol.toLowerCase()] || symbol.toLowerCase();
  }

  /**
   * Get chain description
   * @param {string} chainName - Chain name
   * @returns {string} Chain description
   */
  getChainDescription(chainName) {
    const descriptions = {
      ethereum: 'Primary DeFi hub',
      polygon: 'Yield farming focus',
      arbitrum: 'L2 optimization',
      base: 'Coinbase L2',
      optimism: 'Optimistic rollup'
    };

    return descriptions[chainName] || 'Multi-chain network';
  }

  /**
   * Get supported chains
   * @returns {Array} Array of supported chain names
   */
  getSupportedChains() {
    return Object.keys(this.chains);
  }

  /**
   * Check if a chain is supported
   * @param {string} chainName - Chain name
   * @returns {boolean} Whether the chain is supported
   */
  isChainSupported(chainName) {
    return chainName in this.chains;
  }
}

module.exports = ChainManager; 