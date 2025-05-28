# Token Price API

A simple REST API for cryptocurrency prices and token information, inspired by Vector AI's token search functionality.

## Features

- 🔍 **Token Search**: Search for tokens by name or symbol
- 💰 **Real-time Prices**: Get current token prices in USD
- 📊 **Market Data**: Market cap, volume, and price changes
- 🏆 **Top Tokens**: Get trending and popular cryptocurrencies
- ⚡ **Fast Responses**: Cached results for better performance

## Quick Start

```bash
git clone https://github.com/vectoraidev/token-price-api
cd token-price-api
npm install
cp .env.example .env
# Add your CoinGecko API key to .env
npm start
```

## API Endpoints

### Search Tokens
```
GET /api/search?q=bitcoin
GET /api/search?q=eth&limit=5
```

### Get Token Price
```
GET /api/price/bitcoin
GET /api/price/ethereum
```

### Get Multiple Prices
```
GET /api/prices?ids=bitcoin,ethereum,cardano
```

### Top Tokens
```
GET /api/top?limit=10
GET /api/trending
```

### Token Details
```
GET /api/token/bitcoin
```

## Example Responses

### Search Response
```json
{
  "success": true,
  "data": [
    {
      "id": "bitcoin",
      "name": "Bitcoin",
      "symbol": "btc",
      "market_cap_rank": 1,
      "thumb": "https://coin-images.coingecko.com/coins/images/1/thumb/bitcoin.png"
    }
  ]
}
```

### Price Response
```json
{
  "success": true,
  "data": {
    "id": "bitcoin",
    "symbol": "btc",
    "name": "Bitcoin",
    "current_price": 43250.00,
    "market_cap": 847234567890,
    "price_change_24h": 2.5,
    "last_updated": "2024-01-15T10:30:00Z"
  }
}
```

## Environment Variables

```env
# Required
COINGECKO_API_KEY=your_coingecko_api_key

# Optional
PORT=3000
CACHE_DURATION=300000
RATE_LIMIT_REQUESTS=100
RATE_LIMIT_WINDOW=900000
```

## Usage Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

// Search for tokens
const searchResults = await axios.get('http://localhost:3000/api/search?q=ethereum');
console.log(searchResults.data);

// Get token price
const price = await axios.get('http://localhost:3000/api/price/bitcoin');
console.log(`Bitcoin price: $${price.data.data.current_price}`);
```

### Python
```python
import requests

# Search for tokens
response = requests.get('http://localhost:3000/api/search?q=cardano')
tokens = response.json()['data']

# Get multiple prices
response = requests.get('http://localhost:3000/api/prices?ids=bitcoin,ethereum')
prices = response.json()['data']
```

### cURL
```bash
# Search tokens
curl "http://localhost:3000/api/search?q=polygon"

# Get price
curl "http://localhost:3000/api/price/ethereum"

# Get top tokens
curl "http://localhost:3000/api/top?limit=5"
```

## Features

### Rate Limiting
- 100 requests per 15 minutes per IP
- Configurable limits via environment variables

### Caching
- 5-minute cache for price data
- 1-hour cache for token metadata
- Redis support for production

### Error Handling
- Graceful error responses
- Automatic retries for failed requests
- Fallback to cached data when API is down

## Deployment

### Docker
```bash
docker build -t token-price-api .
docker run -p 3000:3000 -e COINGECKO_API_KEY=your_key token-price-api
```

### Vercel
```bash
npm install -g vercel
vercel --prod
```

### Railway
```bash
railway login
railway deploy
```

## Customization

### Add New Data Sources
```javascript
// Add custom price providers
const providers = {
  coingecko: require('./providers/coingecko'),
  coinmarketcap: require('./providers/coinmarketcap'),
  // Add your provider here
};
```

### Custom Endpoints
```javascript
// Add custom routes
app.get('/api/custom/portfolio', async (req, res) => {
  // Your custom logic here
});
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

This API is inspired by [Vector AI](https://vector-ai.pro) - the most advanced blockchain AI assistant. The token search functionality in Vector AI provides real-time token discovery with natural language queries.

### Vector AI Features:
- Natural language blockchain queries
- Real-time transaction execution
- Advanced token search with `$` trigger
- Multi-chain portfolio management
- AI-powered trading insights

---

⚡ **Want the full AI experience?** Try [Vector AI](https://vector-ai.pro) for advanced blockchain interactions! 