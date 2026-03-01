import React, { useState, useEffect, useRef } from 'react';
import {
  StyleSheet,
  View,
  ScrollView,
  Pressable,
  Text,
  TextInput,
  Modal,
  Dimensions,
} from 'react-native';
import { WebView } from 'react-native-webview';
import { Colors, Spacing, Radius, Typography, buttonShadow } from '@/constants/theme';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { addGems, spendGems } from '@/store/slices/userSlice';
import { TradingViewAPI } from '@/services/TradingViewAPI';
import { GemIcon } from '@/components/svg/GemIcon';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { DuoButton } from '@/components/ui/DuoButton';

const { width: screenWidth } = Dimensions.get('window');

const ASSETS = [
  { symbol: 'BTCUSD', name: 'Bitcoin', tvSymbol: 'BINANCE:BTCUSDT', category: 'Crypto' },
  { symbol: 'ETHUSD', name: 'Ethereum', tvSymbol: 'BINANCE:ETHUSDT', category: 'Crypto' },
  { symbol: 'SOLUSD', name: 'Solana', tvSymbol: 'BINANCE:SOLUSDT', category: 'Crypto' },
  { symbol: 'AAPL', name: 'Apple', tvSymbol: 'NASDAQ:AAPL', category: 'Stocks' },
  { symbol: 'TSLA', name: 'Tesla', tvSymbol: 'NASDAQ:TSLA', category: 'Stocks' },
  { symbol: 'NVDA', name: 'NVIDIA', tvSymbol: 'NASDAQ:NVDA', category: 'Stocks' },
];

interface Position {
  id: string;
  symbol: string;
  type: 'buy' | 'sell';
  entryPrice: number;
  amount: number;
  gemsCost: number;
  timestamp: number;
}

function getChartHtml(symbol: string, timeframe: string): string {
  return `
    <!DOCTYPE html>
    <html><head>
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <style>body{margin:0;padding:0;background:#fff;}</style>
    </head><body>
      <div class="tradingview-widget-container" style="height:100%;width:100%;">
        <div id="tv_chart" style="height:100%;width:100%;"></div>
        <script type="text/javascript" src="https://s3.tradingview.com/tv.js"></script>
        <script type="text/javascript">
          new TradingView.widget({
            "autosize": true,
            "symbol": "${symbol}",
            "interval": "${timeframe}",
            "timezone": "Etc/UTC",
            "theme": "light",
            "style": "1",
            "locale": "en",
            "toolbar_bg": "#f1f3f6",
            "enable_publishing": false,
            "hide_top_toolbar": true,
            "hide_legend": false,
            "save_image": false,
            "container_id": "tv_chart"
          });
        </script>
      </div>
    </body></html>
  `;
}

export default function SimulatorScreen() {
  const dispatch = useAppDispatch();
  const { progress } = useAppSelector((state) => state.user);
  const [selectedAsset, setSelectedAsset] = useState(ASSETS[0]);
  const [timeframe, setTimeframe] = useState('60');
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [positions, setPositions] = useState<Position[]>([]);
  const [tradeModalVisible, setTradeModalVisible] = useState(false);
  const [tradeAmount, setTradeAmount] = useState('10');
  const [tradeType, setTradeType] = useState<'buy' | 'sell'>('buy');
  const api = useRef(TradingViewAPI.getInstance());

  useEffect(() => {
    const fetchPrices = async () => {
      const symbols = ASSETS.map(a => a.symbol);
      const result = await api.current.fetchPrices(symbols);
      setPrices(result);
    };
    fetchPrices();
    const interval = setInterval(fetchPrices, 5000);
    return () => clearInterval(interval);
  }, []);

  const currentPrice = prices[selectedAsset.symbol] || 0;

  const handleOpenTrade = (type: 'buy' | 'sell') => {
    setTradeType(type);
    setTradeModalVisible(true);
  };

  const executeTrade = () => {
    const amount = parseInt(tradeAmount);
    if (isNaN(amount) || amount <= 0 || amount > progress.gems) return;

    const position: Position = {
      id: Date.now().toString(),
      symbol: selectedAsset.symbol,
      type: tradeType,
      entryPrice: currentPrice,
      amount,
      gemsCost: amount,
      timestamp: Date.now(),
    };

    dispatch(spendGems(amount));
    setPositions(prev => [...prev, position]);
    setTradeModalVisible(false);
    setTradeAmount('10');
  };

  const closePosition = (positionId: string) => {
    const pos = positions.find(p => p.id === positionId);
    if (!pos) return;

    const price = prices[pos.symbol] || pos.entryPrice;
    const priceDiff = pos.type === 'buy'
      ? (price - pos.entryPrice) / pos.entryPrice
      : (pos.entryPrice - price) / pos.entryPrice;
    const pnlGems = Math.round(pos.gemsCost * (1 + priceDiff));
    const gemsBack = Math.max(0, pnlGems);

    dispatch(addGems(gemsBack));
    setPositions(prev => prev.filter(p => p.id !== positionId));
  };

  const TIMEFRAMES = ['1', '5', '15', '60', '240', 'D'];
  const TIMEFRAME_LABELS: Record<string, string> = { '1': '1m', '5': '5m', '15': '15m', '60': '1h', '240': '4h', 'D': '1D' };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Trading Simulator</Text>
        <View style={styles.gemsDisplay}>
          <GemIcon size={18} />
          <Text style={styles.gemsText}>{progress.gems}</Text>
        </View>
      </View>

      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Asset Selector */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.assetScroll} contentContainerStyle={styles.assetScrollContent}>
          {ASSETS.map((asset) => (
            <Pressable
              key={asset.symbol}
              style={[styles.assetChip, selectedAsset.symbol === asset.symbol && styles.assetChipActive]}
              onPress={() => setSelectedAsset(asset)}
            >
              <Text style={[styles.assetChipText, selectedAsset.symbol === asset.symbol && styles.assetChipTextActive]}>
                {asset.name}
              </Text>
              {prices[asset.symbol] && (
                <Text style={[styles.assetChipPrice, selectedAsset.symbol === asset.symbol && styles.assetChipTextActive]}>
                  ${prices[asset.symbol]?.toFixed(asset.symbol.includes('USD') && prices[asset.symbol]! < 1 ? 4 : 2)}
                </Text>
              )}
            </Pressable>
          ))}
        </ScrollView>

        {/* Chart */}
        <View style={styles.chartContainer}>
          <WebView
            source={{ html: getChartHtml(selectedAsset.tvSymbol, timeframe) }}
            style={styles.chart}
            javaScriptEnabled
            domStorageEnabled
            scrollEnabled={false}
          />
        </View>

        {/* Timeframe Selector */}
        <View style={styles.timeframeRow}>
          {TIMEFRAMES.map((tf) => (
            <Pressable
              key={tf}
              style={[styles.timeframeChip, timeframe === tf && styles.timeframeChipActive]}
              onPress={() => setTimeframe(tf)}
            >
              <Text style={[styles.timeframeText, timeframe === tf && styles.timeframeTextActive]}>
                {TIMEFRAME_LABELS[tf]}
              </Text>
            </Pressable>
          ))}
        </View>

        {/* Trade Buttons */}
        <View style={styles.tradeButtons}>
          <Pressable
            style={[styles.tradeButton, styles.buyButton, buttonShadow('#16A34A')]}
            onPress={() => handleOpenTrade('buy')}
          >
            <Text style={styles.tradeButtonText}>BUY</Text>
            <Text style={styles.tradeButtonPrice}>${currentPrice.toFixed(2)}</Text>
          </Pressable>
          <Pressable
            style={[styles.tradeButton, styles.sellButton, buttonShadow('#DC2626')]}
            onPress={() => handleOpenTrade('sell')}
          >
            <Text style={styles.tradeButtonText}>SELL</Text>
            <Text style={styles.tradeButtonPrice}>${currentPrice.toFixed(2)}</Text>
          </Pressable>
        </View>

        {/* Open Positions */}
        {positions.length > 0 && (
          <View style={styles.positionsSection}>
            <Text style={styles.sectionTitle}>Open Positions</Text>
            {positions.map((pos) => {
              const price = prices[pos.symbol] || pos.entryPrice;
              const priceDiff = pos.type === 'buy'
                ? (price - pos.entryPrice) / pos.entryPrice
                : (pos.entryPrice - price) / pos.entryPrice;
              const pnlGems = Math.round(pos.gemsCost * priceDiff);
              const isProfit = pnlGems >= 0;

              return (
                <View key={pos.id} style={styles.positionCard}>
                  <View style={styles.positionInfo}>
                    <View style={styles.positionHeader}>
                      <Text style={styles.positionSymbol}>{pos.symbol}</Text>
                      <View style={[styles.positionTypeBadge, { backgroundColor: pos.type === 'buy' ? Colors.featherLight : Colors.cardinalLight }]}>
                        <Text style={[styles.positionTypeText, { color: pos.type === 'buy' ? Colors.feather : Colors.cardinal }]}>
                          {pos.type.toUpperCase()}
                        </Text>
                      </View>
                    </View>
                    <Text style={styles.positionEntry}>Entry: ${pos.entryPrice.toFixed(2)}</Text>
                    <Text style={[styles.positionPnl, { color: isProfit ? Colors.feather : Colors.cardinal }]}>
                      {isProfit ? '+' : ''}{pnlGems} gems ({(priceDiff * 100).toFixed(2)}%)
                    </Text>
                  </View>
                  <Pressable style={styles.closePositionButton} onPress={() => closePosition(pos.id)}>
                    <Text style={styles.closePositionText}>Close</Text>
                  </Pressable>
                </View>
              );
            })}
          </View>
        )}

        <View style={{ height: 120 }} />
      </ScrollView>

      {/* Trade Modal */}
      <Modal visible={tradeModalVisible} animationType="slide" presentationStyle="pageSheet" onRequestClose={() => setTradeModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Pressable onPress={() => setTradeModalVisible(false)}>
              <Text style={styles.modalClose}>✕</Text>
            </Pressable>
            <Text style={styles.modalTitle}>{tradeType === 'buy' ? 'Buy' : 'Sell'} {selectedAsset.name}</Text>
            <View style={{ width: 30 }} />
          </View>

          <View style={styles.modalBody}>
            <Text style={styles.modalPrice}>${currentPrice.toFixed(2)}</Text>
            <Text style={styles.modalLabel}>Amount (gems)</Text>
            <TextInput
              style={styles.modalInput}
              value={tradeAmount}
              onChangeText={setTradeAmount}
              keyboardType="numeric"
              placeholder="Amount in gems"
            />
            <Text style={styles.modalBalance}>Available: {progress.gems} gems</Text>

            <DuoButton
              title={`${tradeType === 'buy' ? 'BUY' : 'SELL'} ${selectedAsset.symbol}`}
              onPress={executeTrade}
              variant={tradeType === 'buy' ? 'primary' : 'danger'}
              size="lg"
              fullWidth
              disabled={!tradeAmount || parseInt(tradeAmount) > progress.gems || parseInt(tradeAmount) <= 0}
            />
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 60,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  headerTitle: { ...Typography.h2, color: Colors.text },
  gemsDisplay: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  gemsText: { ...Typography.bodyBold, color: Colors.macaw },

  scrollView: { flex: 1 },

  assetScroll: { maxHeight: 60 },
  assetScrollContent: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, gap: Spacing.sm },
  assetChip: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    borderRadius: Radius.xl,
    backgroundColor: Colors.polar,
    borderWidth: 1,
    borderColor: Colors.border,
    marginRight: Spacing.sm,
  },
  assetChipActive: { backgroundColor: Colors.macaw, borderColor: Colors.macaw },
  assetChipText: { ...Typography.captionBold, color: Colors.text },
  assetChipPrice: { ...Typography.small, color: Colors.textSecondary, marginTop: 2 },
  assetChipTextActive: { color: Colors.snow },

  chartContainer: {
    height: 320,
    marginHorizontal: Spacing.md,
    marginVertical: Spacing.sm,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  chart: { flex: 1 },

  timeframeRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.xs,
    paddingHorizontal: Spacing.md,
    marginBottom: Spacing.md,
  },
  timeframeChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: Radius.sm,
    backgroundColor: Colors.polar,
  },
  timeframeChipActive: { backgroundColor: Colors.macaw },
  timeframeText: { ...Typography.small, color: Colors.textSecondary },
  timeframeTextActive: { color: Colors.snow },

  tradeButtons: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingHorizontal: Spacing.lg,
    marginBottom: Spacing.lg,
  },
  tradeButton: {
    flex: 1,
    borderRadius: Radius.lg,
    paddingVertical: Spacing.md,
    alignItems: 'center',
  },
  buyButton: { backgroundColor: '#22C55E' },
  sellButton: { backgroundColor: '#EF4444' },
  tradeButtonText: { ...Typography.button, color: Colors.snow },
  tradeButtonPrice: { ...Typography.caption, color: 'rgba(255,255,255,0.8)', marginTop: 2 },

  positionsSection: { paddingHorizontal: Spacing.lg },
  sectionTitle: { ...Typography.h3, color: Colors.text, marginBottom: Spacing.md },
  positionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: Spacing.md,
    backgroundColor: Colors.polar,
    borderRadius: Radius.lg,
    marginBottom: Spacing.sm,
  },
  positionInfo: { flex: 1 },
  positionHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm, marginBottom: 4 },
  positionSymbol: { ...Typography.bodyBold, color: Colors.text },
  positionTypeBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: Radius.sm },
  positionTypeText: { ...Typography.small },
  positionEntry: { ...Typography.caption, color: Colors.textSecondary },
  positionPnl: { ...Typography.captionBold, marginTop: 2 },
  closePositionButton: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    backgroundColor: Colors.swan,
    borderRadius: Radius.sm,
  },
  closePositionText: { ...Typography.captionBold, color: Colors.wolf },

  modalContainer: { flex: 1, backgroundColor: Colors.background },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 20,
    paddingHorizontal: Spacing.lg,
    paddingBottom: Spacing.md,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalClose: { fontSize: 20, color: Colors.hare, fontWeight: '700' },
  modalTitle: { ...Typography.h3, color: Colors.text },
  modalBody: { padding: Spacing.xl, gap: Spacing.lg },
  modalPrice: { ...Typography.h1, color: Colors.text, textAlign: 'center' },
  modalLabel: { ...Typography.captionBold, color: Colors.textSecondary },
  modalInput: {
    borderWidth: 2,
    borderColor: Colors.border,
    borderRadius: Radius.lg,
    padding: Spacing.md,
    ...Typography.h3,
    color: Colors.text,
    textAlign: 'center',
  },
  modalBalance: { ...Typography.caption, color: Colors.textSecondary, textAlign: 'center' },
});
