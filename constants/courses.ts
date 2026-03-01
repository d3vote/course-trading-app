import { Course, CourseId } from '@/types';
import { Colors } from './theme';

export const COURSES: Course[] = [
  {
    id: 'fundamentals',
    title: 'Trading Fundamentals',
    description: 'Learn the basics of financial markets',
    color: Colors.course1,
    colorDark: Colors.course1Dark,
    category: 'beginner',
    isFree: true,
    units: [
      {
        id: 'fund-u1',
        courseId: 'fundamentals',
        title: 'What is Trading?',
        description: 'Understanding the basics of buying and selling',
        levels: [
          {
            id: 'fund-u1-l1',
            courseId: 'fundamentals',
            unitIndex: 0,
            levelIndex: 0,
            title: 'Introduction to Markets',
            description: 'Learn what financial markets are',
            type: 'info',
            xpReward: 20,
            gemsReward: 5,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Welcome to Trading!', body: 'Trading is the act of buying and selling financial instruments like stocks, bonds, cryptocurrencies, or currencies. Traders aim to profit from price movements over time.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'Financial Markets', body: 'Markets are platforms where buyers and sellers come together. The stock market, forex market, and crypto market are the most popular. Each has unique characteristics and opportunities.', icon: 'star' },
              { id: 's3', type: 'content', title: 'Why People Trade', body: 'People trade to grow their wealth, hedge against inflation, or generate income. Unlike long-term investing, trading focuses on shorter-term price movements.', icon: 'gem' },
              { id: 's4', type: 'completion', title: 'Lesson Complete!', body: 'You now understand the basics of financial markets. Great start!', xpReward: 20, gemsReward: 5 },
            ],
          },
          {
            id: 'fund-u1-l2',
            courseId: 'fundamentals',
            unitIndex: 0,
            levelIndex: 1,
            title: 'Market Participants',
            description: 'Who trades and why',
            type: 'info',
            xpReward: 20,
            gemsReward: 5,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Retail Traders', body: 'Individual traders like you who use personal funds. Thanks to technology, anyone can now access markets from their phone!', icon: 'star' },
              { id: 's2', type: 'content', title: 'Institutional Traders', body: 'Banks, hedge funds, and mutual funds that manage large amounts of money. They often move markets with their large orders.', icon: 'crown' },
              { id: 's3', type: 'question', title: 'Quick Check', question: 'Who is a retail trader?', options: [{ id: 'a', text: 'A bank trading desk', correct: false }, { id: 'b', text: 'An individual trading with personal funds', correct: true }, { id: 'c', text: 'A government agency', correct: false }] },
              { id: 's4', type: 'completion', title: 'Well Done!', body: 'You now know the key market participants.', xpReward: 20, gemsReward: 5 },
            ],
          },
          {
            id: 'fund-u1-l3',
            courseId: 'fundamentals',
            unitIndex: 0,
            levelIndex: 2,
            title: 'Market Basics Quiz',
            description: 'Test your knowledge',
            type: 'quiz',
            xpReward: 30,
            gemsReward: 10,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Quiz Time!', body: 'Let\'s test what you\'ve learned about market basics. Answer the following questions.', icon: 'trophy' },
              { id: 's2', type: 'question', title: 'Question 1', question: 'What is the main goal of trading?', options: [{ id: 'a', text: 'To lose money', correct: false }, { id: 'b', text: 'To profit from price movements', correct: true }, { id: 'c', text: 'To avoid the stock market', correct: false }] },
              { id: 's3', type: 'question', title: 'Question 2', question: 'Which is NOT a financial market?', options: [{ id: 'a', text: 'Stock market', correct: false }, { id: 'b', text: 'Grocery market', correct: true }, { id: 'c', text: 'Forex market', correct: false }] },
              { id: 's4', type: 'question', title: 'Question 3', question: 'What makes trading different from investing?', options: [{ id: 'a', text: 'Trading focuses on shorter-term price movements', correct: true }, { id: 'b', text: 'Trading is only for stocks', correct: false }, { id: 'c', text: 'Trading requires no knowledge', correct: false }] },
              { id: 's5', type: 'completion', title: 'Quiz Complete!', body: 'Excellent! You\'ve mastered the market basics.', xpReward: 30, gemsReward: 10 },
            ],
          },
        ],
      },
      {
        id: 'fund-u2',
        courseId: 'fundamentals',
        title: 'Order Types & Execution',
        description: 'How to place trades like a pro',
        levels: [
          {
            id: 'fund-u2-l1',
            courseId: 'fundamentals',
            unitIndex: 1,
            levelIndex: 0,
            title: 'Market & Limit Orders',
            description: 'Understanding order types',
            type: 'info',
            xpReward: 25,
            gemsReward: 5,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Market Orders', body: 'A market order buys or sells immediately at the current best price. It\'s the fastest way to enter or exit a trade, but the exact price isn\'t guaranteed.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'Limit Orders', body: 'A limit order lets you set the exact price you want. Buy limits go below current price, sell limits go above. The trade only happens when the market reaches your price.', icon: 'star' },
              { id: 's3', type: 'question', title: 'Quick Check', question: 'Which order type guarantees execution but not price?', options: [{ id: 'a', text: 'Limit order', correct: false }, { id: 'b', text: 'Market order', correct: true }, { id: 'c', text: 'Neither', correct: false }] },
              { id: 's4', type: 'completion', title: 'Orders Mastered!', body: 'You now know the two most important order types.', xpReward: 25, gemsReward: 5 },
            ],
          },
          {
            id: 'fund-u2-l2',
            courseId: 'fundamentals',
            unitIndex: 1,
            levelIndex: 1,
            title: 'Stop Loss & Take Profit',
            description: 'Protect your trades automatically',
            type: 'info',
            xpReward: 25,
            gemsReward: 5,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Stop Loss Orders', body: 'A stop loss automatically closes your trade if the price moves against you by a set amount. It\'s your safety net to prevent large losses.', icon: 'shield' },
              { id: 's2', type: 'content', title: 'Take Profit Orders', body: 'A take profit automatically closes your trade when it reaches a target profit level. This locks in gains without needing to watch the market constantly.', icon: 'gem' },
              { id: 's3', type: 'content', title: 'Risk-Reward Ratio', body: 'Professional traders always set their take profit further from entry than their stop loss. A common ratio is 1:2 - risk $1 to make $2.', icon: 'crown' },
              { id: 's4', type: 'completion', title: 'Safety First!', body: 'You now understand how to protect your trades.', xpReward: 25, gemsReward: 5 },
            ],
          },
          {
            id: 'fund-u2-l3',
            courseId: 'fundamentals',
            unitIndex: 1,
            levelIndex: 2,
            title: 'Orders Quiz',
            description: 'Test your order knowledge',
            type: 'quiz',
            xpReward: 35,
            gemsReward: 10,
            isFree: true,
            slides: [
              { id: 's1', type: 'content', title: 'Orders Quiz', body: 'Let\'s make sure you understand how to place orders correctly.', icon: 'trophy' },
              { id: 's2', type: 'question', title: 'Question 1', question: 'What does a stop loss do?', options: [{ id: 'a', text: 'Increases your profit', correct: false }, { id: 'b', text: 'Automatically closes a losing trade', correct: true }, { id: 'c', text: 'Opens a new trade', correct: false }] },
              { id: 's3', type: 'question', title: 'Question 2', question: 'A 1:2 risk-reward ratio means:', options: [{ id: 'a', text: 'Risk $2 to make $1', correct: false }, { id: 'b', text: 'Risk $1 to make $2', correct: true }, { id: 'c', text: 'Risk $1 to make $1', correct: false }] },
              { id: 's4', type: 'completion', title: 'Quiz Done!', body: 'You\'re becoming a knowledgeable trader!', xpReward: 35, gemsReward: 10 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'technical-analysis',
    title: 'Technical Analysis',
    description: 'Master chart patterns and indicators',
    color: Colors.course2,
    colorDark: Colors.course2Dark,
    category: 'intermediate',
    isFree: false,
    units: [
      {
        id: 'ta-u1',
        courseId: 'technical-analysis',
        title: 'Reading Charts',
        description: 'Understanding candlestick charts',
        levels: [
          {
            id: 'ta-u1-l1',
            courseId: 'technical-analysis',
            unitIndex: 0,
            levelIndex: 0,
            title: 'Candlestick Basics',
            description: 'Learn to read candlestick charts',
            type: 'info',
            xpReward: 25,
            gemsReward: 5,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'What are Candlesticks?', body: 'Candlestick charts show price movements over time. Each candle shows the open, high, low, and close prices for a time period. Green candles mean the price went up, red means it went down.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'Reading the Body', body: 'The thick part (body) shows the opening and closing price range. A long body means strong buying or selling pressure. A short body means indecision.', icon: 'star' },
              { id: 's3', type: 'content', title: 'Understanding Wicks', body: 'The thin lines (wicks or shadows) show the highest and lowest prices reached. Long upper wicks suggest selling pressure, long lower wicks suggest buying pressure.', icon: 'gem' },
              { id: 's4', type: 'completion', title: 'Chart Reader!', body: 'You can now read candlestick charts like a pro.', xpReward: 25, gemsReward: 5 },
            ],
          },
          {
            id: 'ta-u1-l2',
            courseId: 'technical-analysis',
            unitIndex: 0,
            levelIndex: 1,
            title: 'Support & Resistance',
            description: 'Key price levels',
            type: 'info',
            xpReward: 30,
            gemsReward: 8,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'Support Levels', body: 'Support is a price level where buying pressure is strong enough to prevent further decline. Think of it as a floor for the price.', icon: 'shield' },
              { id: 's2', type: 'content', title: 'Resistance Levels', body: 'Resistance is a price level where selling pressure is strong enough to prevent further rise. Think of it as a ceiling for the price.', icon: 'crown' },
              { id: 's3', type: 'question', title: 'Quick Check', question: 'What happens at a support level?', options: [{ id: 'a', text: 'Price tends to bounce up', correct: true }, { id: 'b', text: 'Price always crashes', correct: false }, { id: 'c', text: 'Nothing happens', correct: false }] },
              { id: 's4', type: 'completion', title: 'Level Master!', body: 'You understand support and resistance.', xpReward: 30, gemsReward: 8 },
            ],
          },
          {
            id: 'ta-u1-l3',
            courseId: 'technical-analysis',
            unitIndex: 0,
            levelIndex: 2,
            title: 'Charts Quiz',
            description: 'Test your chart reading skills',
            type: 'quiz',
            xpReward: 40,
            gemsReward: 12,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'Chart Reading Quiz', body: 'Time to prove your chart reading skills!', icon: 'trophy' },
              { id: 's2', type: 'question', title: 'Question 1', question: 'A green candlestick means:', options: [{ id: 'a', text: 'Price went down', correct: false }, { id: 'b', text: 'Price went up', correct: true }, { id: 'c', text: 'Market is closed', correct: false }] },
              { id: 's3', type: 'question', title: 'Question 2', question: 'A long upper wick suggests:', options: [{ id: 'a', text: 'Strong buying pressure', correct: false }, { id: 'b', text: 'Selling pressure at higher prices', correct: true }, { id: 'c', text: 'The market is stable', correct: false }] },
              { id: 's4', type: 'completion', title: 'Quiz Complete!', body: 'Your chart skills are growing!', xpReward: 40, gemsReward: 12 },
            ],
          },
        ],
      },
      {
        id: 'ta-u2',
        courseId: 'technical-analysis',
        title: 'Indicators',
        description: 'RSI, MACD, and Moving Averages',
        levels: [
          {
            id: 'ta-u2-l1',
            courseId: 'technical-analysis',
            unitIndex: 1,
            levelIndex: 0,
            title: 'Moving Averages',
            description: 'Trend following with MAs',
            type: 'info',
            xpReward: 30,
            gemsReward: 8,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'What are Moving Averages?', body: 'Moving averages smooth out price data to show the overall trend. The 50-day and 200-day MAs are the most popular among traders.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'Golden & Death Cross', body: 'When the 50-day MA crosses above the 200-day MA, it\'s called a "Golden Cross" (bullish). The opposite is a "Death Cross" (bearish).', icon: 'star' },
              { id: 's3', type: 'question', title: 'Quick Check', question: 'What is a Golden Cross?', options: [{ id: 'a', text: '50-day MA crosses above 200-day MA', correct: true }, { id: 'b', text: '200-day MA crosses above 50-day MA', correct: false }, { id: 'c', text: 'Price crosses above $100', correct: false }] },
              { id: 's4', type: 'completion', title: 'MA Expert!', body: 'Moving averages are now part of your toolkit.', xpReward: 30, gemsReward: 8 },
            ],
          },
          {
            id: 'ta-u2-l2',
            courseId: 'technical-analysis',
            unitIndex: 1,
            levelIndex: 1,
            title: 'RSI & MACD',
            description: 'Momentum indicators',
            type: 'info',
            xpReward: 30,
            gemsReward: 8,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'RSI (Relative Strength Index)', body: 'RSI measures momentum on a 0-100 scale. Above 70 means overbought (might drop), below 30 means oversold (might rise). It helps spot potential reversals.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'MACD', body: 'MACD shows the relationship between two moving averages. When the MACD line crosses above the signal line, it\'s bullish. Below is bearish.', icon: 'star' },
              { id: 's3', type: 'completion', title: 'Indicator Pro!', body: 'You now understand RSI and MACD.', xpReward: 30, gemsReward: 8 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'risk-management',
    title: 'Risk Management',
    description: 'Protect your capital like the pros',
    color: Colors.course3,
    colorDark: Colors.course3Dark,
    category: 'intermediate',
    isFree: false,
    units: [
      {
        id: 'rm-u1',
        courseId: 'risk-management',
        title: 'Position Sizing',
        description: 'Never risk more than you can afford',
        levels: [
          {
            id: 'rm-u1-l1',
            courseId: 'risk-management',
            unitIndex: 0,
            levelIndex: 0,
            title: 'The 1% Rule',
            description: 'Never risk more than 1% per trade',
            type: 'info',
            xpReward: 30,
            gemsReward: 8,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'The Golden Rule', body: 'Professional traders never risk more than 1-2% of their total capital on a single trade. This means even a losing streak won\'t wipe out your account.', icon: 'shield' },
              { id: 's2', type: 'content', title: 'Calculating Position Size', body: 'If you have $10,000 and risk 1%, your max loss per trade is $100. This determines how many shares/contracts you can buy based on your stop loss distance.', icon: 'gem' },
              { id: 's3', type: 'question', title: 'Quick Check', question: 'With $5,000 capital and 1% risk, your max loss per trade is:', options: [{ id: 'a', text: '$500', correct: false }, { id: 'b', text: '$50', correct: true }, { id: 'c', text: '$5', correct: false }] },
              { id: 's4', type: 'completion', title: 'Risk Manager!', body: 'You now know the most important rule in trading.', xpReward: 30, gemsReward: 8 },
            ],
          },
          {
            id: 'rm-u1-l2',
            courseId: 'risk-management',
            unitIndex: 0,
            levelIndex: 1,
            title: 'Portfolio Diversification',
            description: 'Don\'t put all eggs in one basket',
            type: 'info',
            xpReward: 30,
            gemsReward: 8,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'Why Diversify?', body: 'Diversification spreads risk across different assets. If one trade fails, others may succeed. Never put all your capital in a single trade or asset.', icon: 'star' },
              { id: 's2', type: 'content', title: 'Asset Correlation', body: 'Choose assets that don\'t move together. If stocks drop but you also hold gold, the gold might go up and offset your losses.', icon: 'crown' },
              { id: 's3', type: 'completion', title: 'Diversified!', body: 'Smart diversification is now in your playbook.', xpReward: 30, gemsReward: 8 },
            ],
          },
        ],
      },
    ],
  },
  {
    id: 'advanced-strategies',
    title: 'Advanced Strategies',
    description: 'Pro-level trading techniques',
    color: Colors.course4,
    colorDark: Colors.course4Dark,
    category: 'advanced',
    isFree: false,
    units: [
      {
        id: 'as-u1',
        courseId: 'advanced-strategies',
        title: 'Advanced Entry Strategies',
        description: 'Precise entries for maximum profit',
        levels: [
          {
            id: 'as-u1-l1',
            courseId: 'advanced-strategies',
            unitIndex: 0,
            levelIndex: 0,
            title: 'Breakout Trading',
            description: 'Catch the big moves',
            type: 'info',
            xpReward: 40,
            gemsReward: 12,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'What is a Breakout?', body: 'A breakout occurs when price moves beyond a key support or resistance level with increased volume. Breakouts often lead to strong trending moves.', icon: 'chart-up' },
              { id: 's2', type: 'content', title: 'Confirming Breakouts', body: 'Look for volume confirmation - a true breakout should have above-average volume. False breakouts often occur with low volume and quickly reverse.', icon: 'star' },
              { id: 's3', type: 'content', title: 'Entry & Stop Placement', body: 'Enter after the candle closes beyond the level. Place your stop loss just below the breakout level. This gives you a tight stop with large potential reward.', icon: 'gem' },
              { id: 's4', type: 'completion', title: 'Breakout Trader!', body: 'You\'ve learned one of the most powerful strategies. You\'re ready for real trading!', xpReward: 40, gemsReward: 12 },
            ],
          },
          {
            id: 'as-u1-l2',
            courseId: 'advanced-strategies',
            unitIndex: 0,
            levelIndex: 1,
            title: 'Final Challenge',
            description: 'Complete your trading education',
            type: 'quiz',
            xpReward: 50,
            gemsReward: 25,
            isFree: false,
            slides: [
              { id: 's1', type: 'content', title: 'The Final Challenge', body: 'This is it! Complete this final quiz to prove you\'re ready for real trading. Show us what you\'ve learned!', icon: 'trophy' },
              { id: 's2', type: 'question', title: 'Question 1', question: 'What confirms a true breakout?', options: [{ id: 'a', text: 'Low volume', correct: false }, { id: 'b', text: 'Above-average volume', correct: true }, { id: 'c', text: 'No volume change', correct: false }] },
              { id: 's3', type: 'question', title: 'Question 2', question: 'The 1% rule means:', options: [{ id: 'a', text: 'Only buy 1% of stocks', correct: false }, { id: 'b', text: 'Never risk more than 1% of capital per trade', correct: true }, { id: 'c', text: 'Trade only 1% of the time', correct: false }] },
              { id: 's4', type: 'question', title: 'Question 3', question: 'RSI above 70 means:', options: [{ id: 'a', text: 'Oversold (might rise)', correct: false }, { id: 'b', text: 'Overbought (might drop)', correct: true }, { id: 'c', text: 'Fair value', correct: false }] },
              { id: 's5', type: 'completion', title: 'Congratulations, Trader!', body: 'You\'ve completed the entire trading education program! You\'re ready to take the next step.', xpReward: 50, gemsReward: 25 },
            ],
          },
        ],
      },
    ],
  },
];

export function getCourse(id: CourseId): Course | undefined {
  return COURSES.find(c => c.id === id);
}

export function getLevel(levelId: string): { course: Course; unit: typeof COURSES[0]['units'][0]; level: typeof COURSES[0]['units'][0]['levels'][0] } | undefined {
  for (const course of COURSES) {
    for (const unit of course.units) {
      for (const level of unit.levels) {
        if (level.id === levelId) {
          return { course, unit, level };
        }
      }
    }
  }
  return undefined;
}

export function getAllLevelIds(): string[] {
  return COURSES.flatMap(c => c.units.flatMap(u => u.levels.map(l => l.id)));
}

export function getNextLevelId(currentLevelId: string): string | null {
  const allIds = getAllLevelIds();
  const idx = allIds.indexOf(currentLevelId);
  return idx >= 0 && idx < allIds.length - 1 ? allIds[idx + 1] : null;
}

export function isLastLevel(levelId: string): boolean {
  const allIds = getAllLevelIds();
  return allIds.indexOf(levelId) === allIds.length - 1;
}

export function getLevelState(levelId: string, completedLessons: string[]): 'locked' | 'available' | 'completed' {
  if (completedLessons.includes(levelId)) return 'completed';
  const allIds = getAllLevelIds();
  const idx = allIds.indexOf(levelId);
  if (idx === 0) return 'available';
  if (idx > 0 && completedLessons.includes(allIds[idx - 1])) return 'available';
  return 'locked';
}
