import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import { Tabs } from 'expo-router';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  interpolate,
} from 'react-native-reanimated';
import { LayoutGrid, ArrowLeftRight, Users, Wallet } from 'lucide-react-native';
import { theme } from '@/lib/theme';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

const SPRING = { damping: 16, stiffness: 300, mass: 0.6 };

type IconType = React.ComponentType<{ size?: number; color?: string; strokeWidth?: number }>;

interface TabDef {
  name: string;
  title: string;
  icon: IconType;
}

const TABS: TabDef[] = [
  { name: 'index', title: 'Dashboard', icon: LayoutGrid },
  { name: 'exchange', title: 'Exchange', icon: ArrowLeftRight },
  { name: 'group', title: 'Group', icon: Users },
  { name: 'wallet', title: 'Wallet', icon: Wallet },
];

function TabButton({
  isActive,
  onPress,
  label,
  Icon,
}: {
  isActive: boolean;
  onPress: () => void;
  label: string;
  Icon: IconType;
}) {
  const active = useSharedValue(isActive ? 1 : 0);

  React.useEffect(() => {
    active.value = withSpring(isActive ? 1 : 0, SPRING);
  }, [isActive, active]);

  const pillStyle = useAnimatedStyle(() => ({
    opacity: withTiming(active.value > 0.5 ? 1 : 0, { duration: 150 }),
    transform: [{ scale: withSpring(active.value, SPRING) }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: withSpring(active.value * 0.35, SPRING),
  }));

  const iconStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: withSpring(isActive ? 1.18 : 1, SPRING) },
      { translateY: withSpring(isActive ? -5 : 0, SPRING) },
    ],
  }));

  const labelStyle = useAnimatedStyle(() => ({
    opacity: withTiming(isActive ? 1 : 0, { duration: 200 }),
    transform: [{ translateY: interpolate(active.value, [0, 1], [4, 0]) }],
  }));

  return (
    <TouchableOpacity style={styles.tabBtn} onPress={onPress} activeOpacity={0.7}>
      <View style={styles.tabInner}>
        <Animated.View style={[styles.glow, glowStyle]} />
        <Animated.View style={[styles.pill, pillStyle]} />
        <Animated.View style={iconStyle}>
          <Icon
            size={22}
            color={isActive ? theme.colors.green : theme.colors.textMuted}
            strokeWidth={2.2}
          />
        </Animated.View>
        <Animated.View style={[styles.labelWrap, labelStyle]}>
          <Text
            style={[
              styles.label,
              { color: isActive ? theme.colors.green : theme.colors.textMuted },
            ]}
          >
            {label}
          </Text>
        </Animated.View>
      </View>
    </TouchableOpacity>
  );
}

function CustomTabBar({ state, descriptors, navigation }: any) {
  const insets = useSafeAreaInsets();

  return (
    <View style={[styles.barWrap, { paddingBottom: Math.max(insets.bottom, 6) }]}>
      <View style={styles.bar}>
        {state.routes.map((route: any, index: number) => {
          const isFocused = state.index === index;
          const tab = TABS[index];

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          return (
            <TabButton
              key={route.key}
              isActive={isFocused}
              onPress={onPress}
              label={tab.title}
              Icon={tab.icon}
            />
          );
        })}
      </View>
    </View>
  );
}

export default function TabLayout() {
  return (
    <Tabs
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tabs.Screen name="index" options={{ title: 'Dashboard' }} />
      <Tabs.Screen name="exchange" options={{ title: 'Exchange' }} />
      <Tabs.Screen name="group" options={{ title: 'Group' }} />
      <Tabs.Screen name="wallet" options={{ title: 'Wallet' }} />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  barWrap: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: theme.colors.bgSoft,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: -2 },
        shadowOpacity: 0.5,
        shadowRadius: 16,
      },
      android: { elevation: 20 },
    }),
  },
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: 8,
    paddingHorizontal: 4,
  },
  tabBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 4,
  },
  tabInner: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    paddingVertical: 6,
    paddingHorizontal: 14,
    minWidth: 66,
  },
  pill: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: theme.colors.greenSoft,
    borderRadius: theme.radius.lg,
  },
  glow: {
    position: 'absolute',
    top: -6,
    left: -10,
    right: -10,
    bottom: -6,
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.lg,
    opacity: 0.08,
  },
  labelWrap: {
    marginTop: 3,
    height: 14,
    justifyContent: 'center',
  },
  label: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10.5,
    letterSpacing: 0.3,
  },
});
