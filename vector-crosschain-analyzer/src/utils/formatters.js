/**
 * Format a number as currency (USD)
 * @param {number} value - The value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted currency string
 */
function formatCurrency(value, options = {}) {
  const {
    currency = 'USD',
    minimumFractionDigits = 2,
    maximumFractionDigits = 2,
    compact = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '$0.00';
  }

  // Handle very large numbers with compact notation
  if (compact && Math.abs(value) >= 1000000) {
    if (Math.abs(value) >= 1000000000) {
      return `$${(value / 1000000000).toFixed(1)}B`;
    } else if (Math.abs(value) >= 1000000) {
      return `$${(value / 1000000).toFixed(1)}M`;
    } else if (Math.abs(value) >= 1000) {
      return `$${(value / 1000).toFixed(1)}K`;
    }
  }

  try {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value);
  } catch (error) {
    // Fallback formatting
    return `$${value.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',')}`;
  }
}

/**
 * Format a number as percentage
 * @param {number} value - The value to format (as decimal, e.g., 0.1 for 10%)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted percentage string
 */
function formatPercentage(value, options = {}) {
  const {
    minimumFractionDigits = 1,
    maximumFractionDigits = 2,
    showSign = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }

  try {
    const formatted = new Intl.NumberFormat('en-US', {
      style: 'percent',
      minimumFractionDigits,
      maximumFractionDigits
    }).format(value / 100); // Assuming value is already in percentage form

    if (showSign && value > 0) {
      return `+${formatted}`;
    }

    return formatted;
  } catch (error) {
    // Fallback formatting
    const sign = showSign && value > 0 ? '+' : '';
    return `${sign}${value.toFixed(maximumFractionDigits)}%`;
  }
}

/**
 * Format a large number with appropriate suffixes (K, M, B, T)
 * @param {number} value - The value to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted number string
 */
function formatLargeNumber(value, options = {}) {
  const {
    decimals = 1,
    forceDecimals = false
  } = options;

  if (value === null || value === undefined || isNaN(value)) {
    return '0';
  }

  const absValue = Math.abs(value);
  const sign = value < 0 ? '-' : '';

  if (absValue >= 1e12) {
    const formatted = (absValue / 1e12).toFixed(decimals);
    return `${sign}${forceDecimals ? formatted : parseFloat(formatted)}T`;
  } else if (absValue >= 1e9) {
    const formatted = (absValue / 1e9).toFixed(decimals);
    return `${sign}${forceDecimals ? formatted : parseFloat(formatted)}B`;
  } else if (absValue >= 1e6) {
    const formatted = (absValue / 1e6).toFixed(decimals);
    return `${sign}${forceDecimals ? formatted : parseFloat(formatted)}M`;
  } else if (absValue >= 1e3) {
    const formatted = (absValue / 1e3).toFixed(decimals);
    return `${sign}${forceDecimals ? formatted : parseFloat(formatted)}K`;
  } else {
    return value.toString();
  }
}

/**
 * Format a token amount with appropriate decimal places
 * @param {number} amount - The token amount
 * @param {Object} options - Formatting options
 * @returns {string} Formatted token amount
 */
function formatTokenAmount(amount, options = {}) {
  const {
    decimals = 18,
    displayDecimals = 4,
    symbol = '',
    compact = false
  } = options;

  if (amount === null || amount === undefined || isNaN(amount)) {
    return `0${symbol ? ' ' + symbol : ''}`;
  }

  let formatted;

  if (compact && amount >= 1000) {
    formatted = formatLargeNumber(amount, { decimals: 2 });
  } else if (amount >= 1) {
    formatted = amount.toFixed(Math.min(displayDecimals, 4));
  } else if (amount >= 0.0001) {
    formatted = amount.toFixed(displayDecimals);
  } else if (amount > 0) {
    formatted = amount.toExponential(2);
  } else {
    formatted = '0';
  }

  // Remove trailing zeros
  if (formatted.includes('.') && !formatted.includes('e')) {
    formatted = formatted.replace(/\.?0+$/, '');
  }

  return `${formatted}${symbol ? ' ' + symbol : ''}`;
}

/**
 * Format a wallet address for display
 * @param {string} address - The wallet address
 * @param {Object} options - Formatting options
 * @returns {string} Formatted address
 */
function formatAddress(address, options = {}) {
  const {
    startChars = 6,
    endChars = 4,
    separator = '...'
  } = options;

  if (!address || typeof address !== 'string') {
    return 'Invalid Address';
  }

  if (address.length <= startChars + endChars) {
    return address;
  }

  return `${address.slice(0, startChars)}${separator}${address.slice(-endChars)}`;
}

/**
 * Format a timestamp for display
 * @param {string|number|Date} timestamp - The timestamp to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted timestamp
 */
function formatTimestamp(timestamp, options = {}) {
  const {
    format = 'relative', // 'relative', 'absolute', 'date', 'time'
    locale = 'en-US'
  } = options;

  try {
    const date = new Date(timestamp);
    
    if (isNaN(date.getTime())) {
      return 'Invalid Date';
    }

    switch (format) {
      case 'relative':
        return formatRelativeTime(date);
      case 'absolute':
        return date.toLocaleString(locale);
      case 'date':
        return date.toLocaleDateString(locale);
      case 'time':
        return date.toLocaleTimeString(locale);
      default:
        return date.toLocaleString(locale);
    }
  } catch (error) {
    return 'Invalid Date';
  }
}

/**
 * Format relative time (e.g., "2 hours ago")
 * @param {Date} date - The date to format
 * @returns {string} Relative time string
 */
function formatRelativeTime(date) {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffSeconds = Math.floor(diffMs / 1000);
  const diffMinutes = Math.floor(diffSeconds / 60);
  const diffHours = Math.floor(diffMinutes / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffSeconds < 60) {
    return 'just now';
  } else if (diffMinutes < 60) {
    return `${diffMinutes} minute${diffMinutes !== 1 ? 's' : ''} ago`;
  } else if (diffHours < 24) {
    return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  } else if (diffDays < 30) {
    return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString();
  }
}

/**
 * Format a hash (transaction hash, block hash, etc.)
 * @param {string} hash - The hash to format
 * @param {Object} options - Formatting options
 * @returns {string} Formatted hash
 */
function formatHash(hash, options = {}) {
  const {
    startChars = 8,
    endChars = 6,
    separator = '...'
  } = options;

  if (!hash || typeof hash !== 'string') {
    return 'Invalid Hash';
  }

  if (hash.length <= startChars + endChars) {
    return hash;
  }

  return `${hash.slice(0, startChars)}${separator}${hash.slice(-endChars)}`;
}

/**
 * Format gas price in Gwei
 * @param {number} gasPrice - Gas price in wei
 * @returns {string} Formatted gas price
 */
function formatGasPrice(gasPrice) {
  if (gasPrice === null || gasPrice === undefined || isNaN(gasPrice)) {
    return '0 Gwei';
  }

  const gwei = gasPrice / 1e9;
  return `${gwei.toFixed(1)} Gwei`;
}

/**
 * Format APY (Annual Percentage Yield)
 * @param {number} apy - APY as decimal (e.g., 0.05 for 5%)
 * @param {Object} options - Formatting options
 * @returns {string} Formatted APY
 */
function formatAPY(apy, options = {}) {
  const {
    decimals = 2,
    showPercent = true
  } = options;

  if (apy === null || apy === undefined || isNaN(apy)) {
    return showPercent ? '0.00%' : '0.00';
  }

  const percentage = apy * 100;
  const formatted = percentage.toFixed(decimals);
  
  return showPercent ? `${formatted}%` : formatted;
}

module.exports = {
  formatCurrency,
  formatPercentage,
  formatLargeNumber,
  formatTokenAmount,
  formatAddress,
  formatTimestamp,
  formatRelativeTime,
  formatHash,
  formatGasPrice,
  formatAPY
}; 