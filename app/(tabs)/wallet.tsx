import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  withRepeat,
  withSequence,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import {
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  CreditCard,
  Lock,
  ChevronRight,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { theme } from '@/lib/theme';

function FadeUp({ delay, children }: { delay: number; children: React.ReactNode }) {
  const sv = useSharedValue(0);
  useEffect(() => {
    sv.value = withDelay(delay, withSpring(1, { damping: 18, stiffness: 120 }));
  }, [delay]);
  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
    transform: [{ translateY: interpolate(sv.value, [0, 1], [18, 0]) }],
  }));
  return <Animated.View style={style}>{children}</Animated.View>;
}

const WALLETS = [
  { id: '1', name: 'Main Wallet', balance: '$54,320.50', icon: 'MW', color: theme.colors.green },
  { id: '2', name: 'Crypto Wallet', balance: '$18,240.25', icon: 'CW', color: theme.colors.accent },
  { id: '3', name: 'Savings Vault', balance: '$12,000.00', icon: 'SV', color: theme.colors.gold },
];

const CARDS = [
  { id: '1', label: 'Virtual Card', number: '•••• 4821', balance: '$8,450', type: 'virtual' as const },
  { id: '2', label: 'Physical Card', number: '•••• 7390', balance: '$12,300', type: 'physical' as const },
];

const RECENT = [
  { id: '1', label: 'Wallet Transfer', time: '10:30 AM', amount: '-$5,000', type: 'out' as const },
  { id: '2', label: 'Cash In', time: '09:15 AM', amount: '+$10,000', type: 'in' as const },
  { id: '3', label: 'Payment to Group', time: 'Yesterday', amount: '-$1,200', type: 'out' as const },
  { id: '4', label: 'Exchange Payout', time: 'Yesterday', amount: '+$3,400', type: 'in' as const },
];

export default function WalletScreen() {
  const [showBalance, setShowBalance] = useState(true);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Wallet</Text>
        <Text style={styles.pageSub}>Manage your funds and cards</Text>

        {/* Wallets */}
        <View style={{ gap: 10, marginBottom: 16 }}>
          {WALLETS.map((w, i) => (
            <FadeUp key={w.id} delay={i * 80}>
              <TouchableOpacity style={styles.walletCard} activeOpacity={0.7}>
                <View style={styles.walletLeft}>
                  <View style={[styles.walletIcon, { backgroundColor: w.color + '22' }]}>
                    <Text style={[styles.walletIconText, { color: w.color }]}>{w.icon}</Text>
                  </View>
                  <View>
                    <Text style={styles.walletName}>{w.name}</Text>
                    <Text style={styles.walletCurrency}>USD</Text>
                  </View>
                </View>
                <View style={styles.walletRight}>
                  <Text style={styles.walletBalance}>
                    {showBalance ? w.balance : '••••••'}
                  </Text>
                  <ChevronRight size={18} color={theme.colors.textMuted} strokeWidth={2} />
                </View>
              </TouchableOpacity>
            </FadeUp>
          ))}
        </View>

        {/* Total balance + toggle */}
        <FadeUp delay={280}>
          <View style={styles.totalCard}>
            <View>
              <Text style={styles.totalLabel}>TOTAL BALANCE</Text>
              <Text style={styles.totalValue}>
                {showBalance ? '$84,560.75' : '••••••••'}
              </Text>
            </View>
            <TouchableOpacity
              style={styles.eyeBtn}
              onPress={() => setShowBalance(!showBalance)}
              activeOpacity={0.7}
            >
              {showBalance ? (
                <Eye size={18} color={theme.colors.textDim} strokeWidth={2} />
              ) : (
                <EyeOff size={18} color={theme.colors.textDim} strokeWidth={2} />
              )}
            </TouchableOpacity>
          </View>
        </FadeUp>

        {/* Quick actions */}
        <FadeUp delay={340}>
          <View style={styles.actionRow}>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: theme.colors.greenSoft }]}>
                <Plus size={18} color={theme.colors.green} strokeWidth={2.3} />
              </View>
              <Text style={styles.actionLabel}>Cash In</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(34,211,238,0.13)' }]}>
                <ArrowUpRight size={18} color={theme.colors.accent} strokeWidth={2.3} />
              </View>
              <Text style={styles.actionLabel}>Send</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
              <View style={[styles.actionIcon, { backgroundColor: 'rgba(247,183,51,0.13)' }]}>
                <ArrowDownLeft size={18} color={theme.colors.gold} strokeWidth={2.3} />
              </View>
              <Text style={styles.actionLabel}>Withdraw</Text>
            </TouchableOpacity>
          </View>
        </FadeUp>

        {/* Cards */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>My Cards</Text>
          <TouchableOpacity activeOpacity={0.6}>
            <Text style={styles.addLink}>+ Add Card</Text>
          </TouchableOpacity>
        </View>

        <View style={{ gap: 10, marginBottom: 16 }}>
          {CARDS.map((c, i) => (
            <FadeUp key={c.id} delay={400 + i * 80}>
              <TouchableOpacity style={styles.cardItem} activeOpacity={0.7}>
                <View style={styles.cardTop}>
                  <View style={styles.cardChip}>
                    <CreditCard size={16} color={theme.colors.textDim} strokeWidth={2} />
                  </View>
                  {c.type === 'virtual' && (
                    <View style={styles.cardBadge}>
                      <Lock size={10} color={theme.colors.text} strokeWidth={2.5} />
                      <Text style={styles.cardBadgeText}>Virtual</Text>
                    </View>
                  )}
                </View>
                <Text style={styles.cardNumber}>{c.number}</Text>
                <View style={styles.cardFooter}>
                  <View>
                    <Text style={styles.cardLabel}>{c.label}</Text>
                    <Text style={styles.cardBalance}>{showBalance ? c.balance : '••••'}</Text>
                  </View>
                  <View style={styles.cardDot} />
                </View>
              </TouchableOpacity>
            </FadeUp>
          ))}
        </View>

        {/* Recent activity */}
        <Text style={styles.sectionTitle}>Recent Activity</Text>
        <View style={styles.recentList}>
          {RECENT.map((r, i) => {
            const up = r.type === 'in';
            return (
              <View key={r.id} style={[styles.recentItem, i < RECENT.length - 1 && styles.recentBorder]}>
                <View
                  style={[
                    styles.recentIcon,
                    { backgroundColor: up ? theme.colors.greenSoft : 'rgba(34,211,238,0.13)' },
                  ]}
                >
                  {up ? (
                    <ArrowDownLeft size={15} color={theme.colors.green} strokeWidth={2.3} />
                  ) : (
                    <ArrowUpRight size={15} color={theme.colors.accent} strokeWidth={2.3} />
                  )}
                </View>
                <View style={styles.recentInfo}>
                  <Text style={styles.recentLabel}>{r.label}</Text>
                  <Text style={styles.recentTime}>{r.time}</Text>
                </View>
                <Text
                  style={[
                    styles.recentAmount,
                    { color: up ? theme.colors.green : theme.colors.text },
                  ]}
                >
                  {r.amount}
                </Text>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 16, paddingBottom: 100 },
  pageTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 26, color: theme.colors.text },
  pageSub: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.colors.textDim, marginTop: 4, marginBottom: 20 },
  walletCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  walletLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  walletIcon: {
    width: 42,
    height: 42,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  walletIconText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 13 },
  walletName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  walletCurrency: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.textDim, marginTop: 1 },
  walletRight: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  walletBalance: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: theme.colors.text },
  totalCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  totalLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: theme.colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  totalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 28, color: theme.colors.text, letterSpacing: -0.5 },
  eyeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionRow: { flexDirection: 'row', gap: 10, marginBottom: 20 },
  actionBtn: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    paddingVertical: 14,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  actionLabel: { fontFamily: 'Inter-Medium', fontSize: 12, color: theme.colors.textDim },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontFamily: 'SpaceGrotesk-SemiBold', fontSize: 17, color: theme.colors.text, marginBottom: 12 },
  addLink: { fontFamily: 'Inter-Medium', fontSize: 13, color: theme.colors.green },
  cardItem: {
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardChip: {
    width: 32,
    height: 24,
    borderRadius: 6,
    backgroundColor: theme.colors.card,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  cardBadgeText: { fontFamily: 'Inter-Medium', fontSize: 10, color: theme.colors.text },
  cardNumber: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 18,
    color: theme.colors.text,
    letterSpacing: 2,
    marginBottom: 16,
  },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: theme.colors.textDim, marginBottom: 2 },
  cardBalance: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  cardDot: { width: 28, height: 28, borderRadius: 14, backgroundColor: theme.colors.green, opacity: 0.3 },
  recentList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  recentBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  recentIcon: { width: 34, height: 34, borderRadius: 11, alignItems: 'center', justifyContent: 'center' },
  recentInfo: { flex: 1, marginLeft: 12 },
  recentLabel: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  recentTime: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.textDim, marginTop: 1 },
  recentAmount: { fontFamily: 'Inter-SemiBold', fontSize: 14 },
});
