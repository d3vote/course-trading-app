import { Link, Stack } from 'expo-router';
import { StyleSheet, View, Text } from 'react-native';
import { Colors, Typography, Spacing } from '@/constants/theme';
import { TradeBull } from '@/components/svg/TradeBull';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Oops!' }} />
      <View style={styles.container}>
        <TradeBull size={100} mood="sad" />
        <Text style={styles.title}>Page Not Found</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Go to home screen</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
  },
  title: {
    ...Typography.h2,
    color: Colors.text,
    marginTop: Spacing.lg,
  },
  link: {
    marginTop: Spacing.lg,
    paddingVertical: Spacing.md,
  },
  linkText: {
    ...Typography.bodyBold,
    color: Colors.macaw,
  },
});
