import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect, useState } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { ArrowDownUp, TrendingUp, TrendingDown, ChevronDown, Zap } from 'lucide-react-native';
import { theme } from '@/lib/theme';
import { CoinLogo } from '@/components/CoinLogo';

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

const COINS = [
  { sym: 'BTC', name: 'Bitcoin', price: '$67,412.50', chg: 2.31 },
  { sym: 'ETH', name: 'Ethereum', price: '$3,184.20', chg: 1.47 },
  { sym: 'SOL', name: 'Solana', price: '$141.85', chg: -0.86 },
  { sym: 'XRP', name: 'Ripple', price: '$0.6234', chg: 1.62 },
  { sym: 'BNB', name: 'BNB Chain', price: '$592.30', chg: 0.94 },
  { sym: 'DOGE', name: 'Dogecoin', price: '$0.1638', chg: 3.12 },
  { sym: 'ADA', name: 'Cardano', price: '$0.4485', chg: -1.23 },
];

export default function ExchangeScreen() {
  const [fromCoin, setFromCoin] = useState('BTC');
  const [toCoin, setToCoin] = useState('USDT');
  const [amount, setAmount] = useState('');

  const swap = () => {
    const tmp = fromCoin;
    setFromCoin(toCoin);
    setToCoin(tmp);
  };

  const rate = 67412.5;
  const received = amount ? (parseFloat(amount) * rate).toLocaleString('en-US', { maximumFractionDigits: 2 }) : '0.00';

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <Text style={styles.pageTitle}>Exchange</Text>
        <Text style={styles.pageSub}>Trade instantly at the best rates</Text>

        {/* Exchange card */}
        <View style={styles.exchangeCard}>
          <Text style={styles.fieldLabel}>YOU PAY</Text>
          <View style={styles.fieldRow}>
            <TextInput
              style={styles.amountInput}
              placeholder="0.00"
              placeholderTextColor={theme.colors.textMuted}
              keyboardType="decimal-pad"
              value={amount}
              onChangeText={setAmount}
            />
            <TouchableOpacity style={styles.coinSelector} activeOpacity={0.7}>
              <Text style={styles.coinSymbol}>{fromCoin}</Text>
              <ChevronDown size={15} color={theme.colors.textDim} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          {/* Swap button */}
          <View style={styles.swapRow}>
            <TouchableOpacity style={styles.swapBtn} onPress={swap} activeOpacity={0.7}>
              <ArrowDownUp size={18} color={theme.colors.green} strokeWidth={2.2} />
            </TouchableOpacity>
          </View>

          <Text style={styles.fieldLabel}>YOU RECEIVE</Text>
          <View style={styles.fieldRow}>
            <Text style={styles.amountDisplay}>{received}</Text>
            <TouchableOpacity style={styles.coinSelector} activeOpacity={0.7}>
              <Text style={styles.coinSymbol}>{toCoin}</Text>
              <ChevronDown size={15} color={theme.colors.textDim} strokeWidth={2} />
            </TouchableOpacity>
          </View>

          <View style={styles.rateRow}>
            <Text style={styles.rateText}>1 {fromCoin} ≈ ${rate.toLocaleString('en-US')}</Text>
            <Text style={styles.rateFee}>Fee 0.1%</Text>
          </View>

          <TouchableOpacity style={styles.exchangeBtn} activeOpacity={0.8}>
            <Zap size={17} color="#04231A" strokeWidth={2.3} />
            <Text style={styles.exchangeBtnText}>Exchange Now</Text>
          </TouchableOpacity>
        </View>

        {/* Market prices */}
        <Text style={styles.sectionTitle}>Market Prices</Text>
        <View style={styles.coinList}>
          {COINS.map((c, i) => {
            const up = c.chg >= 0;
            return (
              <TouchableOpacity
                key={c.sym}
                style={[styles.coinItem, i < COINS.length - 1 && styles.coinBorder]}
                activeOpacity={0.6}
              >
                <CoinLogo symbol={c.sym} size={38} />
                <View style={styles.coinInfo}>
                  <Text style={styles.coinName}>{c.name}</Text>
                  <Text style={styles.coinSym}>{c.sym}</Text>
                </View>
                <View style={styles.coinRight}>
                  <Text style={styles.coinPrice}>{c.price}</Text>
                  <View style={styles.coinChgRow}>
                    {up ? (
                      <TrendingUp size={11} color={theme.colors.green} strokeWidth={2.5} />
                    ) : (
                      <TrendingDown size={11} color={theme.colors.red} strokeWidth={2.5} />
                    )}
                    <Text style={[styles.coinChg, { color: up ? theme.colors.green : theme.colors.red }]}>
                      {up ? '+' : ''}{c.chg.toFixed(2)}%
                    </Text>
                  </View>
                </View>
              </TouchableOpacity>
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
  pageTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 26, color: theme.colors.text, marginBottom: 4 },
  pageSub: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.colors.textDim, marginBottom: 20 },
  exchangeCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 20,
  },
  fieldLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: theme.colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  fieldRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: theme.colors.elevated,
    borderRadius: theme.radius.md,
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  amountInput: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 20,
    color: theme.colors.text,
  },
  amountDisplay: {
    flex: 1,
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 20,
    color: theme.colors.text,
  },
  coinSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.card,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  coinSymbol: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  swapRow: { alignItems: 'center', marginVertical: 6 },
  swapBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.elevated,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  rateRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 12 },
  rateText: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.textDim },
  rateFee: { fontFamily: 'Inter-Medium', fontSize: 12, color: theme.colors.textDim },
  exchangeBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.colors.green,
    borderRadius: theme.radius.md,
    paddingVertical: 16,
    marginTop: 16,
  },
  exchangeBtnText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 16, color: '#04231A' },
  sectionTitle: {
    fontFamily: 'SpaceGrotesk-SemiBold',
    fontSize: 17,
    color: theme.colors.text,
    marginBottom: 12,
  },
  coinList: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    borderWidth: 1,
    borderColor: theme.colors.border,
    overflow: 'hidden',
  },
  coinItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
  },
  coinBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  coinIcon: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  coinInitials: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 12, color: theme.colors.green },
  coinInfo: { flex: 1, marginLeft: 12 },
  coinName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  coinSym: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.textDim, marginTop: 1 },
  coinRight: { alignItems: 'flex-end' },
  coinPrice: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  coinChgRow: { flexDirection: 'row', alignItems: 'center', gap: 3, marginTop: 3 },
  coinChg: { fontFamily: 'Inter-SemiBold', fontSize: 11 },
});
