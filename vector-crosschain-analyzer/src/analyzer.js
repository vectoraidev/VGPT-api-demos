#!/usr/bin/env node

const { Command } = require('commander');
const chalk = require('chalk');
const ora = require('ora');
const { table } = require('table');
require('dotenv').config();

const VectorAIAnalyzer = require('./lib/VectorAIAnalyzer');
const ChainManager = require('./lib/ChainManager');
const { formatCurrency, formatPercentage } = require('./utils/formatters');
const logger = require('./utils/logger');

const program = new Command();

// Initialize services
const vectorAI = new VectorAIAnalyzer(process.env.VECTOR_API_KEY);
const chainManager = new ChainManager();

program
  .name('vector-analyzer')
  .description('Vector AI Multichain Portfolio Analyzer')
  .version('1.0.0');

program
  .command('analyze')
  .description('Analyze a wallet address')
  .argument('<address>', 'Wallet address to analyze')
  .option('-d, --deep', 'Perform deep analysis with AI insights')
  .option('-c, --chains <chains>', 'Comma-separated list of chains', 'ethereum,polygon,arbitrum')
  .option('-o, --output <format>', 'Output format (table, json)', 'table')
  .action(async (address, options) => {
    const spinner = ora('Analyzing wallet...').start();
    
    try {
      // Validate address
      if (!isValidAddress(address)) {
        spinner.fail('Invalid wallet address');
        process.exit(1);
      }

      const chains = options.chains.split(',');
      
      // Get portfolio data
      spinner.text = 'Fetching portfolio data...';
      const portfolioData = await chainManager.getPortfolioData(address, chains);
      
      // Perform Vector AI analysis
      if (options.deep) {
        spinner.text = 'Performing AI analysis...';
        const aiAnalysis = await vectorAI.analyzePortfolio(address, {
          chains,
          depth: 'comprehensive',
          includeRecommendations: true
        });
        portfolioData.aiInsights = aiAnalysis;
      }

      spinner.succeed('Analysis complete!');
      
      // Display results
      if (options.output === 'json') {
        console.log(JSON.stringify(portfolioData, null, 2));
      } else {
        displayAnalysis(portfolioData, options.deep);
      }

    } catch (error) {
      spinner.fail('Analysis failed');
      logger.error('Analysis error:', error);
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('compare')
  .description('Compare multiple wallets')
  .argument('<addresses>', 'Comma-separated wallet addresses')
  .option('-c, --chains <chains>', 'Comma-separated list of chains', 'ethereum,polygon,arbitrum')
  .action(async (addresses, options) => {
    const spinner = ora('Comparing wallets...').start();
    
    try {
      const walletAddresses = addresses.split(',');
      const chains = options.chains.split(',');
      
      const comparisons = [];
      
      for (const address of walletAddresses) {
        spinner.text = `Analyzing ${address.slice(0, 8)}...`;
        const data = await chainManager.getPortfolioData(address, chains);
        const aiAnalysis = await vectorAI.analyzePortfolio(address, { chains });
        
        comparisons.push({
          address,
          ...data,
          aiInsights: aiAnalysis
        });
      }
      
      spinner.succeed('Comparison complete!');
      displayComparison(comparisons);
      
    } catch (error) {
      spinner.fail('Comparison failed');
      logger.error('Comparison error:', error);
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('risk')
  .description('Perform risk assessment on a wallet')
  .argument('<address>', 'Wallet address to assess')
  .option('-t, --timeframe <timeframe>', 'Analysis timeframe', '30d')
  .action(async (address, options) => {
    const spinner = ora('Assessing risk...').start();
    
    try {
      spinner.text = 'Performing risk analysis...';
      const riskAssessment = await vectorAI.assessRisk({
        wallet: address,
        timeframe: options.timeframe,
        includeProjections: true
      });
      
      spinner.succeed('Risk assessment complete!');
      displayRiskAssessment(riskAssessment);
      
    } catch (error) {
      spinner.fail('Risk assessment failed');
      logger.error('Risk assessment error:', error);
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

program
  .command('recommend')
  .description('Get AI investment recommendations')
  .argument('<address>', 'Wallet address for recommendations')
  .action(async (address, options) => {
    const spinner = ora('Generating recommendations...').start();
    
    try {
      spinner.text = 'Analyzing portfolio for recommendations...';
      const recommendations = await vectorAI.getRecommendations({
        wallet: address,
        includeYieldOpportunities: true,
        includeRiskMitigation: true
      });
      
      spinner.succeed('Recommendations generated!');
      displayRecommendations(recommendations);
      
    } catch (error) {
      spinner.fail('Recommendation generation failed');
      logger.error('Recommendation error:', error);
      console.error(chalk.red(`Error: ${error.message}`));
      process.exit(1);
    }
  });

function displayAnalysis(data, includeAI = false) {
  console.log('\n' + chalk.bold.blue('🧠 Vector AI Multichain Analysis'));
  console.log(chalk.gray(`Wallet: ${data.address}\n`));
  
  // Portfolio summary
  console.log(chalk.bold('💰 Portfolio Summary:'));
  console.log(`Total Value: ${chalk.green(formatCurrency(data.totalValue))}`);
  console.log(`24h Change: ${data.change24h >= 0 ? chalk.green('+') : chalk.red('')}${formatPercentage(data.change24h)}`);
  console.log(`30d Change: ${data.change30d >= 0 ? chalk.green('+') : chalk.red('')}${formatPercentage(data.change30d)}\n`);
  
  // Chain distribution
  if (data.chainDistribution) {
    console.log(chalk.bold('🌐 Chain Distribution:'));
    const chainData = data.chainDistribution.map(chain => [
      chain.name,
      formatCurrency(chain.value),
      formatPercentage(chain.percentage),
      chain.description || ''
    ]);
    
    console.log(table([
      ['Chain', 'Value', 'Percentage', 'Focus'],
      ...chainData
    ]));
  }
  
  // Top holdings
  if (data.topHoldings) {
    console.log(chalk.bold('🏆 Top Holdings:'));
    const holdingsData = data.topHoldings.map((holding, index) => [
      index + 1,
      holding.symbol,
      formatCurrency(holding.value),
      formatPercentage(holding.percentage),
      holding.aiInsight || ''
    ]);
    
    console.log(table([
      ['#', 'Token', 'Value', '%', 'AI Insight'],
      ...holdingsData
    ]));
  }
  
  // AI insights
  if (includeAI && data.aiInsights) {
    console.log(chalk.bold('🎯 AI Insights:'));
    console.log(chalk.italic(`"${data.aiInsights.summary}"`));
    
    if (data.aiInsights.riskScore) {
      console.log(`\n⚠️ Risk Assessment: ${data.aiInsights.riskScore}/10 (${data.aiInsights.riskLevel})`);
      
      if (data.aiInsights.riskFactors) {
        data.aiInsights.riskFactors.forEach(factor => {
          console.log(`• ${factor}`);
        });
      }
    }
    
    if (data.aiInsights.recommendations) {
      console.log(chalk.bold('\n🚀 AI Recommendations:'));
      data.aiInsights.recommendations.forEach((rec, index) => {
        console.log(`${index + 1}. ${rec}`);
      });
    }
  }
  
  console.log(chalk.gray('\n⚡ Powered by Vector AI Advanced Models'));
}

function displayComparison(comparisons) {
  console.log('\n' + chalk.bold.blue('🔍 Wallet Comparison'));
  
  const comparisonData = comparisons.map(comp => [
    comp.address.slice(0, 8) + '...',
    formatCurrency(comp.totalValue),
    formatPercentage(comp.change24h),
    comp.aiInsights?.riskScore || 'N/A',
    comp.aiInsights?.strategy || 'Unknown'
  ]);
  
  console.log(table([
    ['Wallet', 'Total Value', '24h Change', 'Risk Score', 'Strategy'],
    ...comparisonData
  ]));
}

function displayRiskAssessment(assessment) {
  console.log('\n' + chalk.bold.red('⚠️ Risk Assessment'));
  console.log(`Risk Score: ${assessment.riskScore}/10 (${assessment.riskLevel})\n`);
  
  if (assessment.factors) {
    console.log(chalk.bold('Risk Factors:'));
    assessment.factors.forEach(factor => {
      console.log(`• ${factor}`);
    });
  }
  
  if (assessment.recommendations) {
    console.log(chalk.bold('\nRecommendations:'));
    assessment.recommendations.forEach(rec => {
      console.log(`• ${rec}`);
    });
  }
}

function displayRecommendations(recommendations) {
  console.log('\n' + chalk.bold.green('🚀 AI Investment Recommendations'));
  
  if (recommendations.rebalancing) {
    console.log(chalk.bold('\nPortfolio Rebalancing:'));
    recommendations.rebalancing.forEach(rec => {
      console.log(`• ${rec}`);
    });
  }
  
  if (recommendations.yieldOpportunities) {
    console.log(chalk.bold('\nYield Opportunities:'));
    recommendations.yieldOpportunities.forEach(opp => {
      console.log(`• ${opp.protocol}: ${opp.apy} APY - ${opp.description}`);
    });
  }
  
  if (recommendations.riskMitigation) {
    console.log(chalk.bold('\nRisk Mitigation:'));
    recommendations.riskMitigation.forEach(rec => {
      console.log(`• ${rec}`);
    });
  }
}

function isValidAddress(address) {
  return /^0x[a-fA-F0-9]{40}$/.test(address);
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, promise) => {
  logger.error('Unhandled Rejection at:', promise, 'reason:', reason);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  logger.error('Uncaught Exception:', error);
  process.exit(1);
});

// Parse command line arguments
program.parse();

// If no command provided, show help
if (!process.argv.slice(2).length) {
  program.outputHelp();
} 