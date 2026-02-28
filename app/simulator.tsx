import React, { useState, useEffect, useRef } from 'react';
import { 
  StyleSheet, 
  View, 
  TouchableOpacity, 
  ScrollView, 
  Alert, 
  Animated, 
  Dimensions,
  TextInput,
  Modal,
  StatusBar
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ThemedText } from '@/components/ThemedText';
import { Colors } from '@/constants/Colors';
import { WebView } from 'react-native-webview';
import { TradingViewAPI } from '@/services/TradingViewAPI';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addGems, spendGems } from '@/store/slices/userSlice';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

// TradingView API integration for real-time data
const TRADINGVIEW_SYMBOLS = [
  { symbol: 'SOLUSD', name: 'Solana', category: 'Cryptocurrency', price: 179.87 },
  { symbol: 'BTCUSD', name: 'Bitcoin', category: 'Cryptocurrency', price: 43444.50 },
  { symbol: 'ETHUSD', name: 'Ethereum', category: 'Cryptocurrency', price: 2650.30 },
  { symbol: 'ADAUSD', name: 'Cardano', category: 'Cryptocurrency', price: 0.485 },
  { symbol: 'DOTUSD', name: 'Polkadot', category: 'Cryptocurrency', price: 7.25 },
  { symbol: 'LINKUSD', name: 'Chainlink', category: 'Cryptocurrency', price: 15.80 },
  { symbol: 'MATICUSD', name: 'Polygon', category: 'Cryptocurrency', price: 0.85 },
  { symbol: 'AVAXUSD', name: 'Avalanche', category: 'Cryptocurrency', price: 35.60 },
  { symbol: 'UNIUSD', name: 'Uniswap', category: 'Cryptocurrency', price: 8.90 },
  { symbol: 'ATOMUSD', name: 'Cosmos', category: 'Cryptocurrency', price: 9.45 },
  { symbol: 'AAPL', name: 'Apple Inc.', category: 'Technology', price: 185.50 },
  { symbol: 'TSLA', name: 'Tesla Inc.', category: 'Automotive', price: 245.80 },
  { symbol: 'GOOGL', name: 'Alphabet Inc.', category: 'Technology', price: 142.30 },
  { symbol: 'MSFT', name: 'Microsoft Corp.', category: 'Technology', price: 378.90 },
  { symbol: 'AMZN', name: 'Amazon.com Inc.', category: 'E-commerce', price: 155.20 },
  { symbol: 'NVDA', name: 'NVIDIA Corp.', category: 'Technology', price: 485.60 },
  { symbol: 'META', name: 'Meta Platforms', category: 'Technology', price: 320.40 },
];



interface Asset {
  symbol: string;
  name: string;
  category: string;
  price: number;
  change: number;
  changePercent: number;
  volume: number;
}

interface PortfolioPosition {
  symbol: string;
  shares: number;
  avgPrice: number;
  currentPrice: number;
  leverage: number;
  margin: number;
  unrealizedPnL: number;
  unrealizedPnLPercent: number;
}

interface TradeOrder {
  symbol: string;
  type: 'buy' | 'sell';
  shares: number;
  price: number;
  leverage: number;
  margin: number;
  stopLoss?: number;
  takeProfit?: number;
  timestamp: Date;
}

// TradingView Chart Component
const TradingViewChart = ({ symbol, timeframe }: { symbol: string; timeframe: string }) => {
  // Map our symbols to TradingView symbols with proper format
  const getTradingViewSymbol = (symbol: string) => {
    const symbolMap: { [key: string]: string } = {
      'BTCUSD': 'BINANCE:BTCUSDT',
      'ETHUSD': 'BINANCE:ETHUSDT',
      'SOLUSD': 'BINANCE:SOLUSDT',
      'ADAUSD': 'BINANCE:ADAUSDT',
      'DOTUSD': 'BINANCE:DOTUSDT',
      'LINKUSD': 'BINANCE:LINKUSDT',
      'MATICUSD': 'BINANCE:MATICUSDT',
      'AVAXUSD': 'BINANCE:AVAXUSDT',
      'UNIUSD': 'BINANCE:UNIUSDT',
      'ATOMUSD': 'BINANCE:ATOMUSDT',
      'AAPL': 'NASDAQ:AAPL',
      'TSLA': 'NASDAQ:TSLA',
      'GOOGL': 'NASDAQ:GOOGL',
      'MSFT': 'NASDAQ:MSFT',
      'AMZN': 'NASDAQ:AMZN',
      'NVDA': 'NASDAQ:NVDA',
      'META': 'NASDAQ:META',
    };
    return symbolMap[symbol] || `BINANCE:${symbol}`;
  };

  // Map timeframes to TradingView format
  const getTradingViewTimeframe = (timeframe: string) => {
    const timeframeMap: { [key: string]: string } = {
      '1m': '1',
      '5m': '5',
      '15m': '15',
      '1h': '60',
      '3h': '180',
      '1D': '1D',
      '1W': '1W',
      '1M': '1M',
    };
    return timeframeMap[timeframe] || '1D';
  };

  const tradingViewHtml = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>TradingView Chart</title>
        <style>
          body {
            margin: 0;
            padding: 0;
            background: #ffffff;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            overflow: hidden;
            height: 100vh;
          }
          #tradingview_widget {
            width: 100%;
            height: 100vh;
            min-height: 0px;
          }
        </style>
      </head>
      <body>
        <div id="tradingview_widget"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <script type="text/javascript">
          new TradingView.widget({
            "autosize": true,
            "symbol": "${getTradingViewSymbol(symbol)}",
            "interval": "${getTradingViewTimeframe(timeframe)}",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_side_toolbar": true,
            "hide_top_toolbar": true,
            "hide_legend": true,
            "allow_symbol_change": false,
            "container_id": "tradingview_widget",
            "show_popup_button": false,
            "hide_volume": false,
            "studies": [],
            "save_image": false,
            "details": false,
            "hotlist": false,
            "calendar": false,
            "news": false
          });
        </script>
      </body>
    </html>
  `;

  return (
    <WebView
      source={{ html: tradingViewHtml }}
      style={{ flex: 1, backgroundColor: '#ffffff', minHeight: 350 }}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      startInLoadingState={true}
      scalesPageToFit={true}
      scrollEnabled={false}
      bounces={false}
    />
  );
};

export default function SimulatorScreen() {
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector((state: any) => state.user);
  
  // Use all user progress data from Redux store
  const username = progress.username;
  const gems = progress.gems;
  const streak = progress.currentStreak;
  const currentLevel = progress.currentLevel;
  const totalXP = progress.totalXP;
  
  const [assets, setAssets] = useState<Asset[]>([]);
  const [filteredAssets, setFilteredAssets] = useState<Asset[]>([]);
  const [portfolio, setPortfolio] = useState<PortfolioPosition[]>([]);
  const [showAssetMenu, setShowAssetMenu] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [showTradeModal, setShowTradeModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [tradeOrder, setTradeOrder] = useState<TradeOrder>({
    symbol: '',
    type: 'buy',
    shares: 1,
    price: 0,
    leverage: 1,
    margin: 0,
    stopLoss: 0,
    takeProfit: 0,
    timestamp: new Date(),
  });
  const [activeTab, setActiveTab] = useState<'chart' | 'details'>('chart');
  const [selectedTimeframe, setSelectedTimeframe] = useState('1D');
  const [isConnected, setIsConnected] = useState(false);
  const [focusedAsset, setFocusedAsset] = useState<string | null>(null);
  
  const slideAnim = useRef(new Animated.Value(-screenWidth)).current;

  // Initialize assets with mock prices
  useEffect(() => {
    const initialAssets = TRADINGVIEW_SYMBOLS.map(symbol => ({
      ...symbol,
      price: symbol.price || Math.random() * 500 + 50,
      change: 0,
      changePercent: 0,
      volume: Math.floor(Math.random() * 1000000) + 100000,
    }));
    setAssets(initialAssets);
    setFilteredAssets(initialAssets);
  }, []);

  // Filter assets based on search query
  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredAssets(assets);
    } else {
      const filtered = assets.filter(asset =>
        asset.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        asset.category.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredAssets(filtered);
    }
  }, [searchQuery, assets]);

  // Real-time price updates from TradingView API
  useEffect(() => {
    const tradingViewAPI = TradingViewAPI.getInstance();
    
    const updatePrices = async () => {
      try {
        if (focusedAsset) {
          // If user has opened a specific asset, only fetch that one (optimized)
          const newPrice = await tradingViewAPI.fetchSinglePrice(focusedAsset);
          
          setAssets(prevAssets => 
            prevAssets.map(asset => {
              if (asset.symbol === focusedAsset) {
                const change = newPrice - asset.price;
                const changePercent = (change / asset.price) * 100;
                
                return {
                  ...asset,
                  price: newPrice,
                  change,
                  changePercent,
                };
              }
              return asset; // Keep existing price for other assets
            })
          );
        } else {
          // Otherwise fetch all assets
          const symbols = assets.map(asset => asset.symbol);
          const prices = await tradingViewAPI.fetchPrices(symbols);
          
          setAssets(prevAssets => 
            prevAssets.map(asset => {
              const newPrice = prices[asset.symbol] || asset.price;
              const change = newPrice - asset.price;
              const changePercent = (change / asset.price) * 100;
              
              return {
                ...asset,
                price: newPrice,
                change,
                changePercent,
              };
            })
          );
        }
      } catch (error) {
        console.error('Error updating prices:', error);
      }
    };

    // Initialize WebSocket for real-time crypto updates
    let cryptoSymbols: string[];
    
    if (focusedAsset) {
      // If focused on specific asset, only connect WebSocket for that one
      const isCrypto = focusedAsset.includes('USD') && 
        !['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META'].includes(focusedAsset);
      cryptoSymbols = isCrypto ? [focusedAsset] : [];
    } else {
      // Otherwise connect for all crypto assets
      cryptoSymbols = assets.filter(asset => asset.symbol.includes('USD') && 
        !['AAPL', 'TSLA', 'GOOGL', 'MSFT', 'AMZN', 'NVDA', 'META'].includes(asset.symbol))
        .map(asset => asset.symbol);
    }
    
    if (cryptoSymbols.length > 0) {
      tradingViewAPI.initializeWebSocket(cryptoSymbols);
    }

    // Check connection status
    const checkConnection = () => {
      setIsConnected(tradingViewAPI.getConnectionStatus());
    };
    
    // Check connection status every 5 seconds
    const connectionInterval = setInterval(checkConnection, 5000);
    checkConnection(); // Initial check

    // Initial price update
    updatePrices();
    
    // Set up interval for real-time updates
    const interval = setInterval(updatePrices, 1000); // Update every second

    return () => {
      clearInterval(interval);
      clearInterval(connectionInterval);
      tradingViewAPI.closeWebSocket();
    };
  }, [assets, focusedAsset]); // Add focusedAsset to dependencies

  // Update portfolio prices when assets change
  useEffect(() => {
    setPortfolio(prevPortfolio =>
      prevPortfolio.map(position => {
        const asset = assets.find(a => a.symbol === position.symbol);
        if (asset) {
          const unrealizedPnL = (asset.price - position.avgPrice) * position.shares * position.leverage;
          const unrealizedPnLPercent = ((asset.price - position.avgPrice) / position.avgPrice) * 100;
          
          return {
            ...position,
            currentPrice: asset.price,
            unrealizedPnL,
            unrealizedPnLPercent,
          };
        }
        return position;
      })
    );
  }, [assets]);

  const toggleAssetMenu = () => {
    if (showAssetMenu) {
      Animated.timing(slideAnim, {
        toValue: -screenWidth,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setShowAssetMenu(false));
    } else {
      setShowAssetMenu(true);
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
  };

  const selectAsset = (asset: Asset) => {
    setSelectedAsset(asset);
    setFocusedAsset(asset.symbol); // Set focused asset for API optimization
    console.log(`🔍 Focused on ${asset.symbol} - API calls optimized`);
    setTradeOrder(prev => ({
      ...prev,
      symbol: asset.symbol,
      price: asset.price,
      stopLoss: asset.price * 0.95, // Default 5% below current price
      takeProfit: asset.price * 1.05, // Default 5% above current price
    }));
    toggleAssetMenu();
    // Open the trade modal after a short delay to ensure the asset menu closes first
    setTimeout(() => {
      setShowTradeModal(true);
    }, 350);
  };

  const calculateMargin = (shares: number, price: number, leverage: number) => {
    return (shares * price) / leverage;
  };

  const executeTrade = () => {
    const margin = calculateMargin(tradeOrder.shares, tradeOrder.price, tradeOrder.leverage);
    
    if (tradeOrder.type === 'buy' && margin > gems) {
      Alert.alert('Insufficient Gems', `You need ${margin.toFixed(2)} gems for this trade!`);
      return;
    }

    if (tradeOrder.type === 'sell') {
      const position = portfolio.find(p => p.symbol === tradeOrder.symbol);
      if (!position || position.shares < tradeOrder.shares) {
        Alert.alert('Insufficient Shares', 'You don\'t have enough shares to sell!');
        return;
      }
    }

    // Execute the trade
    if (tradeOrder.type === 'buy') {
      const existingPosition = portfolio.find(p => p.symbol === tradeOrder.symbol);
      if (existingPosition) {
        // Update existing position
        const totalShares = existingPosition.shares + tradeOrder.shares;
        const totalCost = (existingPosition.avgPrice * existingPosition.shares) + (tradeOrder.price * tradeOrder.shares);
        const newAvgPrice = totalCost / totalShares;
        
        setPortfolio(prev => prev.map(p => 
          p.symbol === tradeOrder.symbol 
            ? { ...p, shares: totalShares, avgPrice: newAvgPrice }
            : p
        ));
      } else {
        // Create new position
        setPortfolio(prev => [...prev, {
          symbol: tradeOrder.symbol,
          shares: tradeOrder.shares,
          avgPrice: tradeOrder.price,
          currentPrice: tradeOrder.price,
          leverage: tradeOrder.leverage,
          margin: margin,
          unrealizedPnL: 0,
          unrealizedPnLPercent: 0,
        }]);
      }
      
      // Deduct gems using Redux
      dispatch(spendGems(margin));
    } else {
      // Sell logic
      const position = portfolio.find(p => p.symbol === tradeOrder.symbol);
      if (position) {
        const remainingShares = position.shares - tradeOrder.shares;
        const realizedPnL = (tradeOrder.price - position.avgPrice) * tradeOrder.shares * position.leverage;
        
        if (remainingShares === 0) {
          setPortfolio(prev => prev.filter(p => p.symbol !== tradeOrder.symbol));
        } else {
          setPortfolio(prev => prev.map(p => 
            p.symbol === tradeOrder.symbol 
              ? { ...p, shares: remainingShares }
              : p
          ));
        }
        
        // Add gems (including profit/loss) using Redux
        dispatch(addGems(margin + realizedPnL));
      }
    }

    setShowTradeModal(false);
    Alert.alert('Trade Executed', `${tradeOrder.type === 'buy' ? 'Bought' : 'Sold'} ${tradeOrder.shares} shares of ${tradeOrder.symbol}`);
  };

  const totalPortfolioValue = portfolio.reduce((total, position) => {
    return total + (position.currentPrice * position.shares * position.leverage);
  }, 0);

  const totalUnrealizedPnL = portfolio.reduce((total, position) => {
    return total + position.unrealizedPnL;
  }, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1a1a1a" />
      
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <ThemedText style={styles.headerTitle}>Trading Simulator</ThemedText>
          <View style={styles.connectionStatus}>
            <View style={[styles.connectionDot, { backgroundColor: isConnected ? Colors.success : Colors.error }]} />
            <ThemedText style={styles.connectionText}>
              {focusedAsset ? `${focusedAsset} Live` : (isConnected ? 'Live' : 'Offline')}
            </ThemedText>
          </View>
        </View>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Gems</ThemedText>
            <ThemedText style={styles.statValue}>{gems.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>Portfolio</ThemedText>
            <ThemedText style={styles.statValue}>${totalPortfolioValue.toFixed(2)}</ThemedText>
          </View>
          <View style={styles.statItem}>
            <ThemedText style={styles.statLabel}>PnL</ThemedText>
            <ThemedText style={[
              styles.statValue,
              { color: totalUnrealizedPnL >= 0 ? Colors.success : Colors.error }
            ]}>
              {totalUnrealizedPnL >= 0 ? '+' : ''}{totalUnrealizedPnL.toFixed(2)}
            </ThemedText>
          </View>
        </View>
      </View>

      {/* Main Portfolio Section */}
      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Asset Selection Card */}
        <TouchableOpacity style={styles.assetSelectionCard} onPress={toggleAssetMenu}>
          <View style={styles.assetSelectionContent}>
            <ThemedText style={styles.assetSelectionTitle}>
              {focusedAsset ? `Focused: ${focusedAsset}` : 'View All Assets'}
            </ThemedText>
            <ThemedText style={styles.assetSelectionSubtitle}>
              {focusedAsset ? 'Tap to return to all assets' : 'Tap to browse available stocks'}
            </ThemedText>
          </View>
          <Ionicons name="chevron-forward" size={24} color={Colors.primary} />
        </TouchableOpacity>

        {/* Portfolio Positions */}
        <View style={styles.portfolioSection}>
          <ThemedText style={styles.sectionTitle}>Your Portfolio</ThemedText>
          {portfolio.length === 0 ? (
            <View style={styles.emptyPortfolio}>
              <Ionicons name="wallet-outline" size={48} color={Colors.darkGray} />
              <ThemedText style={styles.emptyPortfolioText}>No positions yet</ThemedText>
              <ThemedText style={styles.emptyPortfolioSubtext}>Start trading to build your portfolio</ThemedText>
            </View>
          ) : (
            portfolio.map((position) => (
              <TouchableOpacity
                key={position.symbol}
                style={styles.portfolioCard}
                onPress={() => {
                  const asset = assets.find(a => a.symbol === position.symbol);
                  if (asset) {
                    setSelectedAsset(asset);
                    setFocusedAsset(asset.symbol); // Set focused asset for API optimization
                    setTradeOrder(prev => ({
                      ...prev,
                      symbol: asset.symbol,
                      price: asset.price,
                    }));
                    setShowTradeModal(true);
                  }
                }}
              >
                <View style={styles.portfolioHeader}>
                  <View style={styles.portfolioSymbolContainer}>
                    <ThemedText style={styles.portfolioSymbol}>{position.symbol}</ThemedText>
                    <View style={styles.positionTypeBadge}>
                      <ThemedText style={styles.positionTypeText}>
                        {position.unrealizedPnL >= 0 ? 'LONG' : 'SHORT'}
                      </ThemedText>
                    </View>
                    <View style={styles.leverageBadge}>
                      <ThemedText style={styles.leverageText}>{position.leverage}x</ThemedText>
                    </View>
                  </View>
                  <View style={styles.portfolioPnL}>
                    <ThemedText style={[
                      styles.portfolioPnLValue,
                      { color: position.unrealizedPnL >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {position.unrealizedPnL >= 0 ? '+' : ''}${position.unrealizedPnL.toFixed(2)}
                    </ThemedText>
                    <ThemedText style={[
                      styles.portfolioPnLPercent,
                      { color: position.unrealizedPnLPercent >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {position.unrealizedPnLPercent >= 0 ? '+' : ''}{position.unrealizedPnLPercent.toFixed(2)}%
                    </ThemedText>
                  </View>
                </View>
                <View style={styles.portfolioDetails}>
                  <View style={styles.portfolioDetailRow}>
                    <ThemedText style={styles.portfolioDetailLabel}>
                      {position.symbol.includes('USD') ? 'Assets:' : 'Shares:'}
                    </ThemedText>
                    <ThemedText style={styles.portfolioDetailValue}>{position.shares}</ThemedText>
                  </View>
                  <View style={styles.portfolioDetailRow}>
                    <ThemedText style={styles.portfolioDetailLabel}>Avg Price:</ThemedText>
                    <ThemedText style={styles.portfolioDetailValue}>${position.avgPrice.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.portfolioDetailRow}>
                    <ThemedText style={styles.portfolioDetailLabel}>Current:</ThemedText>
                    <ThemedText style={styles.portfolioDetailValue}>${position.currentPrice.toFixed(2)}</ThemedText>
                  </View>
                  <View style={styles.portfolioDetailRow}>
                    <ThemedText style={styles.portfolioDetailLabel}>Margin:</ThemedText>
                    <ThemedText style={styles.portfolioDetailValue}>${position.margin.toFixed(2)}</ThemedText>
                  </View>
                </View>
              </TouchableOpacity>
            ))
          )}
        </View>
      </ScrollView>

      {/* Asset Selection Menu */}
      <Modal
        visible={showAssetMenu}
        transparent={true}
        animationType="none"
        onRequestClose={toggleAssetMenu}
      >
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} onPress={toggleAssetMenu} />
          <Animated.View style={[styles.assetMenu, { transform: [{ translateX: slideAnim }] }]}>
            <View style={styles.assetMenuHeader}>
              <ThemedText style={styles.assetMenuTitle}>Available Assets</ThemedText>
              <TouchableOpacity onPress={toggleAssetMenu}>
                <Ionicons name="close" size={24} color={Colors.darkGray} />
              </TouchableOpacity>
            </View>
            <View style={styles.searchContainer}>
              <View style={styles.searchInputContainer}>
                <Ionicons name="search" size={20} color={Colors.darkGray} />
                <TextInput
                  style={styles.searchInput}
                  placeholder="Search assets..."
                  placeholderTextColor={Colors.darkGray}
                  value={searchQuery}
                  onChangeText={setSearchQuery}
                />
                {searchQuery.length > 0 && (
                  <TouchableOpacity onPress={() => setSearchQuery('')}>
                    <Ionicons name="close-circle" size={20} color={Colors.darkGray} />
                  </TouchableOpacity>
                )}
              </View>
            </View>
            <ScrollView style={styles.assetList}>
              {filteredAssets.map((asset) => (
                <TouchableOpacity
                  key={asset.symbol}
                  style={styles.assetItem}
                  onPress={() => selectAsset(asset)}
                >
                  <View style={styles.assetInfo}>
                    <ThemedText style={styles.assetSymbol}>{asset.symbol}</ThemedText>
                    <ThemedText style={styles.assetName}>{asset.name}</ThemedText>
                    <ThemedText style={styles.assetCategory}>{asset.category}</ThemedText>
                  </View>
                  <View style={styles.assetPrice}>
                    <ThemedText style={styles.assetPriceValue}>${asset.price.toFixed(2)}</ThemedText>
                    <ThemedText style={[
                      styles.assetPriceChange,
                      { color: asset.changePercent >= 0 ? Colors.success : Colors.error }
                    ]}>
                      {asset.changePercent >= 0 ? '+' : ''}{asset.changePercent.toFixed(2)}%
                    </ThemedText>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </Animated.View>
        </View>
      </Modal>

             {/* Full Screen Trade Modal */}
       <Modal
         visible={showTradeModal}
         animationType="slide"
         onRequestClose={() => {
           setShowTradeModal(false);
           setFocusedAsset(null); // Clear focused asset when modal closes
         }}
       >
         <View style={styles.fullScreenModal}>
           {/* Header */}
           <View style={styles.fullScreenHeader}>
             <TouchableOpacity onPress={() => {
               setShowTradeModal(false);
               setFocusedAsset(null); // Clear focused asset when modal closes
               console.log('🔍 Focus cleared - returning to full asset updates');
             }} style={styles.backButton}>
               <Ionicons name="arrow-back" size={24} color="white" />
             </TouchableOpacity>
             <View style={styles.headerInfo}>
              <View style={styles.logoContainer}>
                <View style={styles.logoBars}>
                  <View style={[styles.logoBar, { backgroundColor: '#8B5CF6' }]} />
                  <View style={[styles.logoBar, { backgroundColor: '#60A5FA' }]} />
                  <View style={[styles.logoBar, { backgroundColor: '#10B981' }]} />
                </View>
                <ThemedText style={styles.headerSymbol}>{selectedAsset?.name}</ThemedText>
                {focusedAsset && (
                  <View style={styles.focusedIndicator}>
                    <Ionicons name="radio-button-on" size={12} color={Colors.success} />
                    <ThemedText style={styles.focusedText}>Live</ThemedText>
                  </View>
                )}
              </View>
             </View>
             <View style={styles.headerPrice}>
               <ThemedText style={styles.currentPrice}>${selectedAsset?.price.toFixed(2)}</ThemedText>
               <ThemedText style={[
                 styles.priceChange,
                 { color: selectedAsset?.changePercent && selectedAsset.changePercent >= 0 ? Colors.success : Colors.error }
               ]}>
                 {selectedAsset?.changePercent && selectedAsset.changePercent >= 0 ? '+' : ''}{selectedAsset?.changePercent.toFixed(2)}%
               </ThemedText>
             </View>
           </View>

          {/* Navigation Tabs */}
          <View style={styles.navigationTabs}>
               <TouchableOpacity
              style={[styles.navTab, activeTab === 'chart' && styles.navTabActive]}
              onPress={() => setActiveTab('chart')}
               >
              <ThemedText style={[styles.navTabText, activeTab === 'chart' && styles.navTabTextActive]}>
                Chart
                 </ThemedText>
               </TouchableOpacity>
               <TouchableOpacity
              style={[styles.navTab, activeTab === 'details' && styles.navTabActive]}
              onPress={() => setActiveTab('details')}
               >
              <ThemedText style={[styles.navTabText, activeTab === 'details' && styles.navTabTextActive]}>
                Details
                 </ThemedText>
               </TouchableOpacity>
             </View>

          {/* Chart Section */}
          {activeTab === 'chart' && (
            <View style={styles.chartSection}>
                <View style={styles.chartContainer}>
                 {selectedAsset && <TradingViewChart symbol={selectedAsset.symbol} timeframe={selectedTimeframe} />}
               </View>
              
                             {/* Timeframe Selector */}
               <View style={styles.timeframeSelector}>
                 {['1m', '5m', '15m', '1h', '3h', '1D', '1W', '1M'].map((timeframe) => (
                     <TouchableOpacity
                     key={timeframe} 
                       style={[
                       styles.timeframeButton,
                       selectedTimeframe === timeframe && styles.timeframeButtonActive
                       ]}
                     onPress={() => setSelectedTimeframe(timeframe)}
                     >
                       <ThemedText style={[
                       styles.timeframeText,
                       selectedTimeframe === timeframe && styles.timeframeTextActive
                     ]}>
                       {timeframe}
                     </ThemedText>
                     </TouchableOpacity>
                 ))}
                   </View>

              {/* Informational Banner
              <View style={styles.infoBanner}>
                <View style={styles.infoBannerContent}>
                  <Ionicons name="flame" size={20} color="#FF6B35" />
                  <View style={styles.infoBannerText}>
                    <ThemedText style={styles.infoBannerTitle}>
                      Wondering if it's the right time to sell? Our guide helps you make informed decisions on when to cash in!
                    </ThemedText>
                    <TouchableOpacity style={styles.infoBannerButton}>
                      <ThemedText style={styles.infoBannerButtonText}>See how it works</ThemedText>
                       </TouchableOpacity>
                     </View>
                   </View>
              </View> */}
            </View>
          )}

          {/* Details Section */}
          {activeTab === 'details' && (
            <View style={styles.detailsSection}>
              <ScrollView style={styles.detailsContent}>
                <View style={styles.detailCard}>
                  <ThemedText style={styles.detailTitle}>Asset Information</ThemedText>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Symbol:</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedAsset?.symbol}</ThemedText>
                     </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Name:</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedAsset?.name}</ThemedText>
                   </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Category:</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedAsset?.category}</ThemedText>
                  </View>
                  <View style={styles.detailRow}>
                    <ThemedText style={styles.detailLabel}>Volume:</ThemedText>
                    <ThemedText style={styles.detailValue}>{selectedAsset?.volume.toLocaleString()}</ThemedText>
                  </View>
                </View>
              </ScrollView>
            </View>
          )}

          {/* Trading Interface */}
          <View style={styles.tradingInterface}>
                         <View style={styles.tradeInputs}>
                   <View style={styles.tradeInputGroup}>
                 <ThemedText style={styles.tradeInputLabel}>
                   {selectedAsset?.symbol.includes('USD') ? selectedAsset.symbol.replace('USD', '') : 'SOL'}
                 </ThemedText>
                     <TextInput
                   style={styles.tradeInput}
                   value={tradeOrder.shares.toString()}
                   onChangeText={(text) => setTradeOrder(prev => ({ ...prev, shares: parseInt(text) || 0 }))}
                       keyboardType="numeric"
                   placeholder="0"
                       placeholderTextColor={Colors.darkGray}
                     />
                   </View>
                   <View style={styles.tradeInputGroup}>
                <ThemedText style={styles.tradeInputLabel}>USD</ThemedText>
                     <TextInput
                  style={styles.tradeInput}
                  value={(tradeOrder.shares * tradeOrder.price).toFixed(2)}
                  editable={false}
                  placeholder="0.00"
                       placeholderTextColor={Colors.darkGray}
                     />
              </View>
                   </View>

            <View style={styles.cashInfo}>
              <View style={styles.cashRow}>
                <ThemedText style={styles.cashLabel}>Available cash</ThemedText>
                <ThemedText style={styles.cashValue}>${gems.toFixed(2)}</ThemedText>
                     </View>
              <View style={styles.cashRow}>
                <ThemedText style={styles.cashLabel}>Total</ThemedText>
                <ThemedText style={styles.cashValue}>${(tradeOrder.shares * tradeOrder.price).toFixed(2)}</ThemedText>
                     </View>
                   </View>

            <View style={styles.tradeButtons}>
                   <TouchableOpacity 
                style={[styles.tradeButton, styles.sellButton]} 
                onPress={() => {
                  setTradeOrder(prev => ({ ...prev, type: 'sell' }));
                  executeTrade();
                }}
                   >
                <ThemedText style={styles.tradeButtonText}>Sell</ThemedText>
                <ThemedText style={styles.tradeButtonPrice}>${(selectedAsset?.price || 0).toFixed(2)}</ThemedText>
                   </TouchableOpacity>
                         <TouchableOpacity 
                style={[styles.tradeButton, styles.buyButton]} 
                           onPress={() => {
                  setTradeOrder(prev => ({ ...prev, type: 'buy' }));
                  executeTrade();
                           }}
                         >
                <ThemedText style={styles.tradeButtonText}>Buy</ThemedText>
                <ThemedText style={styles.tradeButtonPrice}>${(selectedAsset?.price || 0).toFixed(2)}</ThemedText>
                         </TouchableOpacity>
                       </View>
           </View>
         </View>
       </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: Colors.background,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingTop: 20,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  connectionStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  connectionDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  connectionText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.darkGray,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  statItem: {
    alignItems: 'center',
  },
  statLabel: {
    fontSize: 12,
    color: Colors.darkGray,
    marginBottom: 4,
  },
  statValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  scrollContent: {
    flex: 1,
  },
  assetSelectionCard: {
    backgroundColor: Colors.primary,
    marginHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
    borderRadius: 13,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: Colors.shadwPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  assetSelectionContent: {
    flex: 1,
  },
  assetSelectionTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 4,
    textTransform: 'uppercase',
    opacity: 0.7,
  },
  assetSelectionSubtitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 22,
  },
  portfolioSection: {
    paddingHorizontal: 20,
    paddingBottom: 120,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  emptyPortfolio: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyPortfolioText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.darkGray,
    marginTop: 10,
  },
  emptyPortfolioSubtext: {
    fontSize: 14,
    color: Colors.darkGray,
    marginTop: 5,
  },
  portfolioCard: {
    backgroundColor: Colors.gray,
    borderRadius: 13,
    padding: 20,
    marginBottom: 15,
    shadowColor: Colors.shadwPrimary,
    shadowOffset: {
      width: 0,
      height: 6,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  portfolioHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  portfolioSymbolContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  portfolioSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    marginRight: 10,
  },
  positionTypeBadge: {
    backgroundColor: Colors.success,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    marginRight: 8,
  },
  positionTypeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: 'white',
  },
  leverageBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  leverageText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: 'white',
  },
  portfolioPnL: {
    alignItems: 'flex-end',
  },
  portfolioPnLValue: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  portfolioPnLPercent: {
    fontSize: 14,
    fontWeight: '600',
  },
  portfolioDetails: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  portfolioDetailRow: {
    width: '48%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  portfolioDetailLabel: {
    fontSize: 14,
    color: Colors.darkGray,
  },
  portfolioDetailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalBackdrop: {
    flex: 1,
  },
  assetMenu: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: screenWidth * 0.8,
    height: '100%',
    backgroundColor: Colors.background,
    shadowColor: Colors.shadwPrimary,
    shadowOffset: {
      width: 6,
      height: 0,
    },
    shadowOpacity: 1,
    shadowRadius: 0,
    elevation: 0,
  },
  assetMenuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    paddingTop: 60,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  assetMenuTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  searchContainer: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.gray,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  searchInput: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    color: Colors.text,
  },
  assetList: {
    flex: 1,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderGray,
  },
  assetInfo: {
    flex: 1,
  },
  assetSymbol: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  assetName: {
    fontSize: 14,
    color: Colors.darkGray,
    marginBottom: 2,
  },
  assetCategory: {
    fontSize: 12,
    color: Colors.darkGray,
  },
  assetPrice: {
    alignItems: 'flex-end',
  },
  assetPriceValue: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  assetPriceChange: {
    fontSize: 14,
    fontWeight: '600',
  },
  fullScreenModal: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  fullScreenHeader: {
    backgroundColor: '#1a1a1a',
    paddingTop: 60,
    paddingHorizontal: 20,
    paddingBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  logoContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  logoBars: {
    flexDirection: 'row',
    marginRight: 10,
  },
  logoBar: {
    width: 3,
    height: 20,
    marginRight: 2,
    borderRadius: 1,
  },
  headerSymbol: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
  },
  focusedIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 10,
  },
  focusedText: {
    fontSize: 12,
    fontWeight: '600',
    color: Colors.success,
    marginLeft: 4,
  },
  headerPrice: {
    alignItems: 'flex-end',
  },
  currentPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 2,
  },
  priceChange: {
    fontSize: 14,
    fontWeight: '600',
    color: 'white',
  },
  navigationTabs: {
    flexDirection: 'row',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 20,
    paddingBottom: 10,
  },
  navTab: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    marginRight: 20,
  },
  navTabActive: {
    borderBottomWidth: 3,
    borderBottomColor: '#8B5CF6',
  },
  navTabText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#666',
  },
  navTabTextActive: {
    color: 'white',
  },
  chartSection: {
    flex: 1,
  },
  chartContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
    minHeight: 300,
  },
  timeframeSelector: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 15,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  timeframeButton: {
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e5e5e5',
  },
  timeframeButtonActive: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
  },
  timeframeTextActive: {
    color: 'white',
  },
  infoBanner: {
    backgroundColor: '#FFF3E0',
    marginHorizontal: 20,
    marginVertical: 15,
    borderRadius: 12,
    padding: 15,
  },
  infoBannerContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoBannerText: {
    flex: 1,
    marginLeft: 10,
  },
  infoBannerTitle: {
    fontSize: 14,
    color: '#E65100',
    lineHeight: 20,
    marginBottom: 10,
  },
  infoBannerButton: {
    backgroundColor: '#FF6B35',
    paddingHorizontal: 20,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  infoBannerButtonText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  detailsSection: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  detailsContent: {
    flex: 1,
    padding: 20,
  },
  detailCard: {
    backgroundColor: '#f8f9fa',
    borderRadius: 12,
    padding: 20,
  },
  detailTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tradingInterface: {
    backgroundColor: '#ffffff',
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#e5e5e5',
  },
  tradeInputs: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  tradeInputGroup: {
    flex: 1,
    marginHorizontal: 5,
  },
  tradeInputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#666',
    marginBottom: 8,
  },
  tradeInput: {
    borderWidth: 1,
    borderColor: '#e5e5e5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    backgroundColor: '#ffffff',
    textAlign: 'center',
  },
  cashInfo: {
    marginBottom: 20,
  },
  cashRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  cashLabel: {
    fontSize: 14,
    color: '#666',
  },
  cashValue: {
    fontSize: 14,
    fontWeight: '600',
  },
  tradeButtons: {
    flexDirection: 'row',
    gap: 10,
  },
  tradeButton: {
    flex: 1,
    paddingVertical: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  sellButton: {
    backgroundColor: '#EF4444',
  },
  buyButton: {
    backgroundColor: '#10B981',
  },
  tradeButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  tradeButtonPrice: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
  },
}); 