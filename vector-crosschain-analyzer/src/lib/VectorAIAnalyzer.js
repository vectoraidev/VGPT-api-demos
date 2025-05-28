const axios = require('axios');
const logger = require('../utils/logger');

class VectorAIAnalyzer {
  constructor(apiKey) {
    if (!apiKey) {
      throw new Error('Vector AI API key is required');
    }
    
    this.apiKey = apiKey;
    this.baseURL = process.env.VECTOR_API_URL || 'https://api.vector-ai.pro/v1';
    this.client = axios.create({
      baseURL: this.baseURL,
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
        'User-Agent': 'Vector-Multichain-Analyzer/1.0.0'
      },
      timeout: 30000
    });
    
    // Add request/response interceptors for logging
    this.client.interceptors.request.use(
      (config) => {
        logger.debug(`Vector AI Request: ${config.method?.toUpperCase()} ${config.url}`);
        return config;
      },
      (error) => {
        logger.error('Vector AI Request Error:', error);
        return Promise.reject(error);
      }
    );
    
    this.client.interceptors.response.use(
      (response) => {
        logger.debug(`Vector AI Response: ${response.status} ${response.statusText}`);
        return response;
      },
      (error) => {
        logger.error('Vector AI Response Error:', error.response?.data || error.message);
        return Promise.reject(error);
      }
    );
  }

  /**
   * Analyze a portfolio using Vector AI
   * @param {string} wallet - Wallet address
   * @param {Object} options - Analysis options
   * @returns {Promise<Object>} Analysis results
   */
  async analyzePortfolio(wallet, options = {}) {
    try {
      const payload = {
        type: 'portfolio_analysis',
        wallet,
        chains: options.chains || ['ethereum', 'polygon', 'arbitrum'],
        depth: options.depth || 'standard',
        features: [
          'portfolio_summary',
          'risk_assessment',
          'diversification_analysis',
          'yield_opportunities',
          ...(options.includeRecommendations ? ['investment_recommendations'] : [])
        ],
        parameters: {
          timeframe: options.timeframe || '30d',
          includeHistorical: options.includeHistorical || true,
          riskTolerance: options.riskTolerance || 'moderate'
        }
      };

      const response = await this.client.post('/analyze', payload);
      
      return this.processAnalysisResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Portfolio analysis failed');
    }
  }

  /**
   * Assess risk for a wallet
   * @param {Object} params - Risk assessment parameters
   * @returns {Promise<Object>} Risk assessment results
   */
  async assessRisk(params) {
    try {
      const payload = {
        type: 'risk_assessment',
        wallet: params.wallet,
        timeframe: params.timeframe || '30d',
        features: [
          'concentration_risk',
          'smart_contract_risk',
          'market_risk',
          'liquidity_risk',
          'correlation_analysis'
        ],
        includeProjections: params.includeProjections || false
      };

      const response = await this.client.post('/risk', payload);
      
      return this.processRiskResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Risk assessment failed');
    }
  }

  /**
   * Get investment recommendations
   * @param {Object} params - Recommendation parameters
   * @returns {Promise<Object>} Investment recommendations
   */
  async getRecommendations(params) {
    try {
      const payload = {
        type: 'investment_recommendations',
        wallet: params.wallet,
        features: [
          'portfolio_rebalancing',
          ...(params.includeYieldOpportunities ? ['yield_opportunities'] : []),
          ...(params.includeRiskMitigation ? ['risk_mitigation'] : []),
          'market_opportunities'
        ],
        preferences: {
          riskTolerance: params.riskTolerance || 'moderate',
          investmentHorizon: params.investmentHorizon || 'medium',
          preferredChains: params.preferredChains || ['ethereum', 'polygon', 'arbitrum']
        }
      };

      const response = await this.client.post('/recommend', payload);
      
      return this.processRecommendationResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Recommendation generation failed');
    }
  }

  /**
   * Analyze patterns in whale behavior
   * @param {Object} params - Pattern analysis parameters
   * @returns {Promise<Object>} Pattern analysis results
   */
  async analyzePatterns(params) {
    try {
      const payload = {
        type: 'pattern_analysis',
        data: params.data,
        analysisType: params.analysisType || 'behavioral',
        timeframe: params.timeframe || '7d',
        features: [
          'trend_identification',
          'anomaly_detection',
          'correlation_analysis',
          'predictive_modeling'
        ],
        confidenceThreshold: params.confidenceThreshold || 0.75
      };

      const response = await this.client.post('/patterns', payload);
      
      return this.processPatternResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Pattern analysis failed');
    }
  }

  /**
   * Generate market predictions
   * @param {Object} params - Prediction parameters
   * @returns {Promise<Object>} Market predictions
   */
  async predict(params) {
    try {
      const payload = {
        type: 'market_prediction',
        data: params.data,
        timeframe: params.timeframe || '7d',
        confidenceThreshold: params.confidenceThreshold || 0.7,
        features: [
          'price_movement',
          'volume_analysis',
          'sentiment_analysis',
          'technical_indicators'
        ]
      };

      const response = await this.client.post('/predict', payload);
      
      return this.processPredictionResponse(response.data);
    } catch (error) {
      throw this.handleError(error, 'Market prediction failed');
    }
  }

  /**
   * Process portfolio analysis response
   * @private
   */
  processAnalysisResponse(data) {
    return {
      summary: data.summary || 'No summary available',
      riskScore: data.risk_score || 0,
      riskLevel: this.getRiskLevel(data.risk_score),
      diversificationScore: data.diversification_score || 0,
      recommendations: data.recommendations || [],
      riskFactors: data.risk_factors || [],
      yieldOpportunities: data.yield_opportunities || [],
      insights: data.insights || {},
      confidence: data.confidence || 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process risk assessment response
   * @private
   */
  processRiskResponse(data) {
    return {
      riskScore: data.risk_score || 0,
      riskLevel: this.getRiskLevel(data.risk_score),
      factors: data.risk_factors || [],
      recommendations: data.recommendations || [],
      projections: data.projections || null,
      breakdown: {
        concentrationRisk: data.concentration_risk || 0,
        smartContractRisk: data.smart_contract_risk || 0,
        marketRisk: data.market_risk || 0,
        liquidityRisk: data.liquidity_risk || 0
      },
      confidence: data.confidence || 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process recommendation response
   * @private
   */
  processRecommendationResponse(data) {
    return {
      rebalancing: data.rebalancing || [],
      yieldOpportunities: data.yield_opportunities || [],
      riskMitigation: data.risk_mitigation || [],
      marketOpportunities: data.market_opportunities || [],
      priority: data.priority || 'medium',
      confidence: data.confidence || 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process pattern analysis response
   * @private
   */
  processPatternResponse(data) {
    return {
      patterns: data.patterns || [],
      trends: data.trends || [],
      anomalies: data.anomalies || [],
      predictions: data.predictions || [],
      confidence: data.confidence || 0,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Process prediction response
   * @private
   */
  processPredictionResponse(data) {
    return {
      predictions: data.predictions || [],
      confidence: data.confidence || 0,
      timeframe: data.timeframe || '7d',
      factors: data.factors || [],
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get risk level from score
   * @private
   */
  getRiskLevel(score) {
    if (score <= 3) return 'Low';
    if (score <= 6) return 'Moderate';
    if (score <= 8) return 'High';
    return 'Very High';
  }

  /**
   * Handle API errors
   * @private
   */
  handleError(error, defaultMessage) {
    if (error.response) {
      // API responded with error status
      const status = error.response.status;
      const message = error.response.data?.message || error.response.data?.error || defaultMessage;
      
      switch (status) {
        case 401:
          return new Error('Invalid Vector AI API key. Please check your credentials.');
        case 403:
          return new Error('Access denied. Please check your Vector AI subscription tier.');
        case 429:
          return new Error('Rate limit exceeded. Please try again later.');
        case 500:
          return new Error('Vector AI service temporarily unavailable. Please try again later.');
        default:
          return new Error(`Vector AI API error (${status}): ${message}`);
      }
    } else if (error.request) {
      // Network error
      return new Error('Unable to connect to Vector AI service. Please check your internet connection.');
    } else {
      // Other error
      return new Error(error.message || defaultMessage);
    }
  }

  /**
   * Check API health
   * @returns {Promise<boolean>} API health status
   */
  async checkHealth() {
    try {
      const response = await this.client.get('/health');
      return response.status === 200;
    } catch (error) {
      logger.error('Vector AI health check failed:', error.message);
      return false;
    }
  }

  /**
   * Get API usage statistics
   * @returns {Promise<Object>} Usage statistics
   */
  async getUsageStats() {
    try {
      const response = await this.client.get('/usage');
      return response.data;
    } catch (error) {
      logger.error('Failed to get usage stats:', error.message);
      return null;
    }
  }
}

module.exports = VectorAIAnalyzer; 