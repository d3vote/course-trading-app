// Real-time price API service with multiple data sources
export class TradingViewAPI {
  private static instance: TradingViewAPI;
  private priceCache: { [symbol: string]: number } = {};
  private lastUpdate: { [symbol: string]: number } = {};
  private updateInterval = 1000; // 1 second
  private websocket: WebSocket | null = null;
  private isConnected = false;

  static getInstance(): TradingViewAPI {
    if (!TradingViewAPI.instance) {
      TradingViewAPI.instance = new TradingViewAPI();
    }
    return TradingViewAPI.instance;
  }

  // Get symbol mapping for different APIs
  private getSymbolMapping(symbol: string): { 
    binance: string; 
    coinGecko: string; 
    alphaVantage: string; 
  } {
    const mappings: { [key: string]: { binance: string; coinGecko: string; alphaVantage: string } } = {
      'BTCUSD': { binance: 'BTCUSDT', coinGecko: 'bitcoin', alphaVantage: 'BTC' },
      'ETHUSD': { binance: 'ETHUSDT', coinGecko: 'ethereum', alphaVantage: 'ETH' },
      'SOLUSD': { binance: 'SOLUSDT', coinGecko: 'solana', alphaVantage: 'SOL' },
      'ADAUSD': { binance: 'ADAUSDT', coinGecko: 'cardano', alphaVantage: 'ADA' },
      'DOTUSD': { binance: 'DOTUSDT', coinGecko: 'polkadot', alphaVantage: 'DOT' },
      'LINKUSD': { binance: 'LINKUSDT', coinGecko: 'chainlink', alphaVantage: 'LINK' },
      'MATICUSD': { binance: 'MATICUSDT', coinGecko: 'matic-network', alphaVantage: 'MATIC' },
      'AVAXUSD': { binance: 'AVAXUSDT', coinGecko: 'avalanche-2', alphaVantage: 'AVAX' },
      'UNIUSD': { binance: 'UNIUSDT', coinGecko: 'uniswap', alphaVantage: 'UNI' },
      'ATOMUSD': { binance: 'ATOMUSDT', coinGecko: 'cosmos', alphaVantage: 'ATOM' },
      'AAPL': { binance: '', coinGecko: '', alphaVantage: 'AAPL' },
      'TSLA': { binance: '', coinGecko: '', alphaVantage: 'TSLA' },
      'GOOGL': { binance: '', coinGecko: '', alphaVantage: 'GOOGL' },
      'MSFT': { binance: '', coinGecko: '', alphaVantage: 'MSFT' },
      'AMZN': { binance: '', coinGecko: '', alphaVantage: 'AMZN' },
      'NVDA': { binance: '', coinGecko: '', alphaVantage: 'NVDA' },
      'META': { binance: '', coinGecko: '', alphaVantage: 'META' },
    };
    return mappings[symbol] || { binance: `${symbol}USDT`, coinGecko: symbol.toLowerCase(), alphaVantage: symbol };
  }

  // Check if symbol is crypto
  private isCrypto(symbol: string): boolean {
    return symbol.includes('USD') && !['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META'].includes(symbol);
  }

  // Fetch price from Binance API (for crypto)
  private async fetchFromBinance(symbol: string): Promise<number | null> {
    try {
      const mapping = this.getSymbolMapping(symbol);
      if (!mapping.binance) return null;

      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

      const response = await fetch(`https://api.binance.com/api/v3/ticker/price?symbol=${mapping.binance}`, {
        signal: controller.signal,
        headers: {
          'User-Agent': 'TradingSimulator/1.0',
        }
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        console.warn(`Binance API returned ${response.status} for ${symbol}`);
        return null;
      }

      const data = await response.json();
      const price = parseFloat(data.price);
      
      if (isNaN(price) || price <= 0) {
        console.warn(`Invalid price from Binance for ${symbol}: ${data.price}`);
        return null;
      }
      
      return price;
    } catch (error) {
      if (error instanceof Error && error.name === 'AbortError') {
        console.warn(`Binance API timeout for ${symbol}`);
      } else {
        console.error(`Binance API error for ${symbol}:`, error);
      }
      return null;
    }
  }

  // Fetch price from CoinGecko API (for crypto)
  private async fetchFromCoinGecko(symbol: string): Promise<number | null> {
    try {
      const mapping = this.getSymbolMapping(symbol);
      if (!mapping.coinGecko) return null;

      const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${mapping.coinGecko}&vs_currencies=usd`);
      if (!response.ok) return null;

      const data = await response.json();
      return data[mapping.coinGecko]?.usd || null;
    } catch (error) {
      console.error(`CoinGecko API error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch price from Alpha Vantage API (for stocks)
  private async fetchFromAlphaVantage(symbol: string): Promise<number | null> {
    try {
      const mapping = this.getSymbolMapping(symbol);
      if (!mapping.alphaVantage) return null;

      // Note: Alpha Vantage requires an API key for production use
      // For demo purposes, we'll use a free endpoint or fallback
      const response = await fetch(`https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol=${mapping.alphaVantage}&apikey=demo`);
      if (!response.ok) return null;

      const data = await response.json();
      const quote = data['Global Quote'];
      return quote ? parseFloat(quote['05. price']) : null;
    } catch (error) {
      console.error(`Alpha Vantage API error for ${symbol}:`, error);
      return null;
    }
  }

  // Fetch price with multiple fallback sources
  async fetchPrice(symbol: string): Promise<number> {
    const now = Date.now();
    
    // Check cache first
    if (this.priceCache[symbol] && this.lastUpdate[symbol] && 
        (now - this.lastUpdate[symbol]) < this.updateInterval) {
      return this.priceCache[symbol];
    }

    let price: number | null = null;

    if (this.isCrypto(symbol)) {
      // Try Binance first, then CoinGecko
      price = await this.fetchFromBinance(symbol);
      if (!price) {
        price = await this.fetchFromCoinGecko(symbol);
      }
    } else {
      // For stocks, try Alpha Vantage
      price = await this.fetchFromAlphaVantage(symbol);
    }

    if (price) {
      this.priceCache[symbol] = price;
      this.lastUpdate[symbol] = now;
      return price;
    }

    // Fallback to mock data if all APIs fail
    console.warn(`All APIs failed for ${symbol}, using fallback`);
    return this.getFallbackPrice(symbol);
  }

  // Fallback price generation (used when all APIs fail)
  private getFallbackPrice(symbol: string): number {
    const basePrices: { [key: string]: number } = {
      'BTCUSD': 43444.50,
      'ETHUSD': 2650.30,
      'SOLUSD': 179.87,
      'ADAUSD': 0.485,
      'DOTUSD': 7.25,
      'LINKUSD': 15.80,
      'MATICUSD': 0.85,
      'AVAXUSD': 35.60,
      'UNIUSD': 8.90,
      'ATOMUSD': 9.45,
      'AAPL': 185.50,
      'TSLA': 245.80,
      'GOOGL': 142.30,
      'MSFT': 378.90,
      'AMZN': 155.20,
      'NVDA': 485.60,
      'META': 320.40,
    };

    const basePrice = basePrices[symbol] || 100;
    const volatility = 0.005; // 0.5% volatility for fallback
    const change = (Math.random() - 0.5) * volatility;
    return basePrice * (1 + change);
  }

  // Fetch prices for multiple symbols
  async fetchPrices(symbols: string[]): Promise<{ [symbol: string]: number }> {
    const prices: { [symbol: string]: number } = {};
    
    // If only one symbol, optimize the fetch
    if (symbols.length === 1) {
      const symbol = symbols[0];
      const price = await this.fetchPrice(symbol);
      prices[symbol] = price;
      return prices;
    }
    
    // Fetch prices in parallel for better performance
    const pricePromises = symbols.map(async (symbol) => {
      const price = await this.fetchPrice(symbol);
      return { symbol, price };
    });

    const results = await Promise.all(pricePromises);
    
    results.forEach(({ symbol, price }) => {
      prices[symbol] = price;
    });

    return prices;
  }

  // Fetch single symbol price (optimized for focused mode)
  async fetchSinglePrice(symbol: string): Promise<number> {
    return await this.fetchPrice(symbol);
  }

  // Initialize WebSocket connection for real-time updates (optional enhancement)
  initializeWebSocket(symbols: string[]): void {
    if (this.websocket) {
      this.websocket.close();
    }

    // For crypto, we could use Binance WebSocket
    const cryptoSymbols = symbols.filter(s => this.isCrypto(s));
    if (cryptoSymbols.length > 0) {
      const binanceSymbols = cryptoSymbols
        .map(s => this.getSymbolMapping(s).binance)
        .filter(s => s)
        .map(s => s.toLowerCase());

      if (binanceSymbols.length > 0) {
        const wsUrl = `wss://stream.binance.com:9443/ws/${binanceSymbols.join('@ticker/')}@ticker`;
        
        this.websocket = new WebSocket(wsUrl);
        
        this.websocket.onopen = () => {
          console.log('WebSocket connected');
          this.isConnected = true;
        };

        this.websocket.onmessage = (event) => {
          try {
            const data = JSON.parse(event.data);
            if (data.s && data.c) {
              const symbol = data.s.replace('USDT', 'USD');
              const price = parseFloat(data.c);
              this.priceCache[symbol] = price;
              this.lastUpdate[symbol] = Date.now();
            }
          } catch (error) {
            console.error('WebSocket message error:', error);
          }
        };

        this.websocket.onerror = (error) => {
          console.error('WebSocket error:', error);
          this.isConnected = false;
        };

        this.websocket.onclose = () => {
          console.log('WebSocket disconnected');
          this.isConnected = false;
        };
      }
    }
  }

  // Close WebSocket connection
  closeWebSocket(): void {
    if (this.websocket) {
      this.websocket.close();
      this.websocket = null;
      this.isConnected = false;
    }
  }

  // Clear cache for a specific symbol
  clearCache(symbol?: string): void {
    if (symbol) {
      delete this.priceCache[symbol];
      delete this.lastUpdate[symbol];
    } else {
      this.priceCache = {};
      this.lastUpdate = {};
    }
  }

  // Get connection status
  getConnectionStatus(): boolean {
    return this.isConnected;
  }
} 