import { Tabs } from 'expo-router';
import { View, StyleSheet, Text } from 'react-native';
import { Colors, Typography } from '@/constants/theme';
import { ChartUpIcon } from '@/components/svg/ChartUpIcon';
import { TrophyIcon } from '@/components/svg/TrophyIcon';

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  const color = focused ? Colors.macaw : Colors.hare;
  const size = 24;

  const icons: Record<string, React.ReactNode> = {
    learn: (
      <View style={styles.iconContainer}>
        <ChartUpIcon size={size} color={color} />
      </View>
    ),
    simulator: (
      <View style={styles.iconContainer}>
        <View style={[styles.simIcon, { borderColor: color }]}>
          <Text style={[styles.simText, { color }]}>$</Text>
        </View>
      </View>
    ),
    leaderboard: (
      <View style={styles.iconContainer}>
        <TrophyIcon size={size} color={color} />
      </View>
    ),
    profile: (
      <View style={styles.iconContainer}>
        <View style={[styles.profileIcon, { backgroundColor: color }]}>
          <View style={[styles.profileHead, { backgroundColor: focused ? Colors.snow : Colors.polar }]} />
        </View>
      </View>
    ),
  };

  return icons[name] || null;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: Colors.macaw,
        tabBarInactiveTintColor: Colors.hare,
        tabBarStyle: styles.tabBar,
        tabBarLabelStyle: styles.tabLabel,
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Learn',
          tabBarIcon: ({ focused }) => <TabIcon name="learn" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="simulator"
        options={{
          title: 'Simulator',
          tabBarIcon: ({ focused }) => <TabIcon name="simulator" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: 'Leaderboard',
          tabBarIcon: ({ focused }) => <TabIcon name="leaderboard" focused={focused} />,
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ focused }) => <TabIcon name="profile" focused={focused} />,
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  tabBar: {
    backgroundColor: Colors.snow,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 8,
    height: 88,
  },
  tabLabel: {
    ...Typography.small,
    marginTop: 4,
  },
  iconContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    width: 28,
    height: 28,
  },
  simIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  simText: {
    fontSize: 14,
    fontWeight: '800',
  },
  profileIcon: {
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileHead: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
});
