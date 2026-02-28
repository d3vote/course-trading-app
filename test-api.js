// Test script for TradingView API service
const { TradingViewAPI } = require('./services/TradingViewAPI.ts');

async function testAPI() {
  console.log('Testing TradingView API service...');
  
  const api = TradingViewAPI.getInstance();
  
  // Test crypto prices
  const cryptoSymbols = ['BTCUSD', 'ETHUSD', 'SOLUSD'];
  console.log('\nTesting crypto prices:');
  
  for (const symbol of cryptoSymbols) {
    try {
      const price = await api.fetchPrice(symbol);
      console.log(`${symbol}: $${price.toFixed(2)}`);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }
  
  // Test stock prices
  const stockSymbols = ['AAPL', 'TSLA', 'GOOGL'];
  console.log('\nTesting stock prices:');
  
  for (const symbol of stockSymbols) {
    try {
      const price = await api.fetchPrice(symbol);
      console.log(`${symbol}: $${price.toFixed(2)}`);
    } catch (error) {
      console.error(`Error fetching ${symbol}:`, error.message);
    }
  }
  
  // Test batch fetching
  console.log('\nTesting batch price fetching:');
  try {
    const allSymbols = [...cryptoSymbols, ...stockSymbols];
    const prices = await api.fetchPrices(allSymbols);
    console.log('Batch results:', prices);
  } catch (error) {
    console.error('Error in batch fetch:', error.message);
  }
  
  console.log('\nTest completed!');
}

testAPI().catch(console.error); 