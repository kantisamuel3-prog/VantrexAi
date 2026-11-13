import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Dimensions,
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
  Easing,
} from 'react-native-reanimated';
import {
  TrendingUp,
  TrendingDown,
  Bell,
  Zap,
  ArrowUpRight,
  ArrowDownLeft,
  Plus,
  Eye,
  EyeOff,
} from 'lucide-react-native';
import { theme } from '@/lib/theme';
import { CoinLogo } from '@/components/CoinLogo';
import { ChartSection } from '@/components/CandlestickChart';

// chartWidth is computed inside the component from screen dimensions

// ---- Animated counter ----
function useCountUp(target: number, duration = 1500) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let start: number | null = null;
    let raf: number;
    const tick = (ts: number) => {
      if (!start) start = ts;
      const t = Math.min((ts - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      setVal(target * eased);
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return val;
}

// ---- FadeUp wrapper ----
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

// ---- Live dot ----
function LiveDot() {
  const sv = useSharedValue(1);
  useEffect(() => {
    sv.value = withRepeat(
      withSequence(
        withTiming(0.3, { duration: 800 }),
        withTiming(1, { duration: 800 })
      ),
      -1,
      true
    );
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
    transform: [{ scale: interpolate(sv.value, [0.3, 1], [0.7, 1]) }],
  }));
  return <Animated.View style={[styles.liveDot, style]} />;
}

// ---- Progress ring ----
function ProgressRing({ pct, color }: { pct: number; color: string }) {
  const sv = useSharedValue(0);
  useEffect(() => {
    sv.value = withTiming(pct / 100, { duration: 1100, easing: Easing.out(Easing.cubic) });
  }, [pct]);
  const size = 52;
  const stroke = 5;
  const r = (size - stroke) / 2;
  const arcStyle = useAnimatedStyle(() => {
    const rotation = sv.value * 360;
    return {
      transform: [{ rotate: '-90deg' }, { rotate: `${rotation}deg` }],
    } as any;
  });
  return (
    <View style={{ width: size, height: size, justifyContent: 'center', alignItems: 'center' }}>
      <View style={{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: r + stroke / 2,
        borderWidth: stroke,
        borderColor: 'rgba(255,255,255,0.08)',
      }} />
      <Animated.View style={[{
        position: 'absolute',
        width: size,
        height: size,
        borderRadius: r + stroke / 2,
        borderWidth: stroke,
        borderColor: color,
        borderLeftColor: 'transparent',
        borderBottomColor: 'transparent',
      }, arcStyle]} />
      <Text style={styles.ringPct}>{Math.round(pct)}%</Text>
    </View>
  );
}

// ---- Card wrapper ----
function Card({ children, style }: { children: React.ReactNode; style?: object }) {
  return <View style={[styles.card, style]}>{children}</View>;
}

// ---- Data ----
const POSITIONS = [
  { sym: 'BTC', pair: 'BTC/USDT', qty: '0.245 BTC', entry: '$65,980', pnl: 351.2, pct: 2.31 },
  { sym: 'ETH', pair: 'ETH/USDT', qty: '2.10 ETH', entry: '$3,120', pnl: 96.4, pct: 1.47 },
  { sym: 'SOL', pair: 'SOL/USDT', qty: '18.5 SOL', entry: '$141.20', pnl: -22.7, pct: -0.86 },
  { sym: 'XRP', pair: 'XRP/USDT', qty: '4,200 XRP', entry: '$0.62', pnl: 41.8, pct: 1.62 },
];

const MARKET = [
  { sym: 'BTC', name: 'Bitcoin', price: '$67,412.50', chg: 2.31 },
  { sym: 'ETH', name: 'Ethereum', price: '$3,184.20', chg: 1.47 },
  { sym: 'SOL', name: 'Solana', price: '$141.85', chg: -0.86 },
  { sym: 'BNB', name: 'BNB Chain', price: '$592.30', chg: 0.94 },
  { sym: 'ADA', name: 'Cardano', price: '$0.4485', chg: -1.23 },
  { sym: 'DOGE', name: 'Dogecoin', price: '$0.1638', chg: 3.12 },
];

const TICKER = [
  { sym: 'BTC', price: '67,412', chg: '+2.31%', up: true },
  { sym: 'ETH', price: '3,184', chg: '+1.47%', up: true },
  { sym: 'SOL', price: '141.8', chg: '-0.86%', up: false },
  { sym: 'BNB', price: '592.3', chg: '+0.94%', up: true },
  { sym: 'XRP', price: '0.6234', chg: '+1.62%', up: true },
  { sym: 'ADA', price: '0.4485', chg: '-1.23%', up: false },
  { sym: 'DOGE', price: '0.1638', chg: '+3.12%', up: true },
];

// ---- Main ----
export default function DashboardScreen() {
  const winRate = useCountUp(78.4, 1700);
  const tradesVal = useCountUp(127, 1500);
  const aiAcc = useCountUp(94.2, 1900);
  const balanceVal = useCountUp(48295.14, 1200);

  const [showBalance, setShowBalance] = useState(true);
  const [signalBuy, setSignalBuy] = useState(true);
  const [confidence, setConfidence] = useState(86);
  const [rsi, setRsi] = useState(62.4);
  const [macd, setMacd] = useState(1.8);
  const [screenW, setScreenW] = useState(Dimensions.get('window').width);

  useEffect(() => {
    const sub = Dimensions.addEventListener('change', () => {
      setScreenW(Dimensions.get('window').width);
    });
    return () => sub?.remove();
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignalBuy(Math.random() > 0.38);
      setConfidence(68 + Math.floor(Math.random() * 30));
      setRsi(35 + Math.random() * 40);
      setMacd(0.5 + Math.random() * 2);
    }, 7000);
    return () => clearInterval(interval);
  }, []);

  const plPct = (1782.6 / (48295.14 - 1782.6)) * 100;
  const balInt = Math.floor(balanceVal);
  const balDec = balanceVal.toFixed(2).split('.')[1] || '00';
  const cw = screenW - 32;

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        {/* Header */}
        <FadeUp delay={0}>
          <View style={styles.header}>
            <View style={styles.brandRow}>
              <View style={styles.logoBox}>
                <View style={styles.logoInner}>
                  <TrendingUp size={22} color="#052A20" strokeWidth={2.8} />
                </View>
              </View>
              <View>
                <Text style={styles.logoText}>
                  VANTREX <Text style={styles.logoAccent}>AI</Text>
                </Text>
                <Text style={styles.logoSub}>Smart Trading</Text>
              </View>
            </View>
            <View style={styles.headerRight}>
              <View style={styles.liveBadge}>
                <LiveDot />
                <Text style={styles.liveText}>LIVE</Text>
              </View>
              <TouchableOpacity style={styles.bellBtn} activeOpacity={0.7}>
                <Bell size={18} color={theme.colors.textDim} strokeWidth={2} />
                <View style={styles.bellDot} />
              </TouchableOpacity>
            </View>
          </View>
        </FadeUp>

        {/* Hero balance card */}
        <FadeUp delay={80}>
          <View style={styles.heroCard}>
            <View style={styles.heroTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardLabel}>PORTFOLIO BALANCE</Text>
                <View style={styles.balanceRow}>
                  <Text style={styles.balance}>
                    ${showBalance ? balInt.toLocaleString('en-US') : '••••••'}
                    {showBalance && <Text style={styles.balanceCents}>.{balDec}</Text>}
                  </Text>
                  <TouchableOpacity onPress={() => setShowBalance(!showBalance)} hitSlop={8}>
                    {showBalance ? (
                      <Eye size={18} color={theme.colors.textDim} strokeWidth={2} />
                    ) : (
                      <EyeOff size={18} color={theme.colors.textDim} strokeWidth={2} />
                    )}
                  </TouchableOpacity>
                </View>
                <Text style={styles.balanceSub}>
                  Today's P/L: <Text style={styles.plInline}>+$1,782.60</Text>
                </Text>
              </View>
              <View style={styles.plBadge}>
                <TrendingUp size={13} color={theme.colors.green} strokeWidth={2.5} />
                <Text style={styles.plBadgeText}>+{plPct.toFixed(2)}%</Text>
              </View>
            </View>
            <View style={styles.heroActions}>
              <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.85}>
                <Plus size={16} color="#04231A" strokeWidth={2.5} />
                <Text style={styles.btnPrimaryText}>Deposit</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.btnGhost} activeOpacity={0.85}>
                <Text style={styles.btnGhostText}>Trade Now</Text>
                <ArrowUpRight size={16} color={theme.colors.text} strokeWidth={2.5} />
              </TouchableOpacity>
            </View>
          </View>
        </FadeUp>

        {/* Ticker tape */}
        <FadeUp delay={160}>
          <View style={styles.tickerTape}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.tickerTrack}>
                {[...TICKER, ...TICKER].map((t, i) => (
                  <View key={i} style={styles.tickerItem}>
                    <CoinLogo symbol={t.sym} size={18} />
                    <Text style={styles.tickerPrice}>${t.price}</Text>
                    <Text style={[styles.tickerChg, { color: t.up ? theme.colors.green : theme.colors.red }]}>
                      {t.chg}
                    </Text>
                  </View>
                ))}
              </View>
            </ScrollView>
          </View>
        </FadeUp>

        {/* Stats */}
        <FadeUp delay={240}>
          <View style={styles.statsRow}>
            <StatCard label="Win Rate" value={`${winRate.toFixed(1)}%`} color={theme.colors.green} />
            <StatCard label="Trades" value={`${Math.round(tradesVal)}`} color={theme.colors.text} />
            <StatCard label="AI Acc" value={`${aiAcc.toFixed(1)}%`} color={theme.colors.accent} />
          </View>
        </FadeUp>

        {/* Candlestick Chart + Mini Charts */}
        <FadeUp delay={280}>
          <ChartSection chartWidth={cw} />
        </FadeUp>

        {/* AI Signal */}
        <FadeUp delay={320}>
          <Card style={styles.signalCard}>
            <View style={styles.signalMain}>
              <ProgressRing pct={confidence} color={signalBuy ? theme.colors.green : theme.colors.red} />
              <View style={{ flex: 1, marginLeft: 14 }}>
                <Text style={styles.signalLabel}>AI SIGNAL</Text>
                <Text
                  style={[
                    styles.signalValue,
                    { color: signalBuy ? theme.colors.green : theme.colors.red },
                  ]}
                >
                  {signalBuy ? 'STRONG BUY' : 'SELL SIGNAL'}
                </Text>
                <Text style={styles.signalSub}>BTC/USDT · next 15m</Text>
              </View>
              <Zap size={20} color={theme.colors.accent} strokeWidth={2} />
            </View>
            <View style={styles.signalChips}>
              <View style={styles.chip}>
                <Text style={[styles.chipVal, { color: signalBuy ? theme.colors.green : theme.colors.red }]}>
                  {rsi.toFixed(1)}
                </Text>
                <Text style={styles.chipKey}>RSI</Text>
              </View>
              <View style={styles.chip}>
                <Text style={[styles.chipVal, { color: signalBuy ? theme.colors.green : theme.colors.red }]}>
                  {signalBuy ? '+' : '-'}{macd.toFixed(1)}
                </Text>
                <Text style={styles.chipKey}>MACD</Text>
              </View>
              <View style={styles.chip}>
                <Text style={styles.chipVal}>HIGH</Text>
                <Text style={styles.chipKey}>Volume</Text>
              </View>
            </View>
          </Card>
        </FadeUp>

        {/* Open Positions */}
        <FadeUp delay={400}>
          <Card>
            <Text style={styles.cardLabel}>OPEN POSITIONS</Text>
            <View style={{ marginTop: 8 }}>
              {POSITIONS.map((p, i) => {
                const up = p.pnl >= 0;
                return (
                  <View key={p.sym} style={[styles.posRow, i < POSITIONS.length - 1 && styles.posBorder]}>
                    <View style={styles.posLeft}>
                      <CoinLogo symbol={p.sym} size={34} />
                      <View>
                        <Text style={styles.posName}>{p.pair}</Text>
                        <Text style={styles.posSub}>{p.qty} @ {p.entry}</Text>
                      </View>
                    </View>
                    <View style={styles.posRight}>
                      <Text style={[styles.posPnl, { color: up ? theme.colors.green : theme.colors.red }]}>
                        {up ? '+' : '-'}${Math.abs(p.pnl).toFixed(2)}
                      </Text>
                      <Text style={[styles.posPct, { color: up ? theme.colors.green : theme.colors.red }]}>
                        {up ? '+' : ''}{p.pct.toFixed(2)}%
                      </Text>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </FadeUp>

        {/* Market Watch */}
        <FadeUp delay={480}>
          <Card style={{ marginBottom: 0 }}>
            <Text style={styles.cardLabel}>MARKET WATCH</Text>
            <View style={{ marginTop: 8 }}>
              {MARKET.map((m, i) => {
                const up = m.chg >= 0;
                return (
                  <View key={m.sym} style={[styles.marketRow, i < MARKET.length - 1 && styles.posBorder]}>
                    <View style={styles.posLeft}>
                      <CoinLogo symbol={m.sym} size={34} />
                      <View>
                        <Text style={styles.posName}>{m.sym}</Text>
                        <Text style={styles.posSub}>{m.name}</Text>
                      </View>
                    </View>
                    <View style={styles.posRight}>
                      <Text style={styles.marketPrice}>{m.price}</Text>
                      <View style={styles.marketChgRow}>
                        {up ? (
                          <TrendingUp size={11} color={theme.colors.green} strokeWidth={2.5} />
                        ) : (
                          <TrendingDown size={11} color={theme.colors.red} strokeWidth={2.5} />
                        )}
                        <Text style={[styles.marketChg, { color: up ? theme.colors.green : theme.colors.red }]}>
                          {up ? '+' : ''}{m.chg.toFixed(2)}%
                        </Text>
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </FadeUp>

        <Text style={styles.footer}>Vantrex AI Trading · Simulated data for demo</Text>
      </ScrollView>
    </SafeAreaView>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  const sv = useSharedValue(0);
  useEffect(() => {
    sv.value = withDelay(300, withSpring(1, { damping: 15, stiffness: 100 }));
  }, []);
  const style = useAnimatedStyle(() => ({
    opacity: sv.value,
    transform: [{ scale: interpolate(sv.value, [0, 1], [0.8, 1]) }],
  }));
  return (
    <Animated.View style={[styles.statCard, style]}>
      <Text style={[styles.statValue, { color }]}>{value}</Text>
      <Text style={styles.statLabel}>{label}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 8,
    marginBottom: 16,
  },
  brandRow: { flexDirection: 'row', alignItems: 'center', gap: 11 },
  logoBox: { width: 42, height: 42, borderRadius: 13, overflow: 'hidden' },
  logoInner: {
    width: 42,
    height: 42,
    borderRadius: 13,
    backgroundColor: theme.colors.green,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 19,
    color: theme.colors.text,
    letterSpacing: 0.5,
  },
  logoAccent: { color: theme.colors.accent },
  logoSub: {
    fontFamily: 'Inter-Regular',
    fontSize: 9.5,
    color: theme.colors.textDim,
    letterSpacing: 2.4,
    textTransform: 'uppercase',
    marginTop: 1,
  },
  headerRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  liveBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    backgroundColor: theme.colors.greenSoft,
    borderWidth: 1,
    borderColor: 'rgba(22,199,132,0.35)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 999,
  },
  liveDot: { width: 7, height: 7, borderRadius: 4, backgroundColor: theme.colors.green },
  liveText: { fontFamily: 'Inter-Bold', fontSize: 10, color: theme.colors.green, letterSpacing: 1.4 },
  bellBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bellDot: {
    position: 'absolute',
    top: 9,
    right: 10,
    width: 7,
    height: 7,
    borderRadius: 4,
    backgroundColor: theme.colors.red,
    borderWidth: 1.5,
    borderColor: theme.colors.card,
  },
  heroCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
    overflow: 'hidden',
  },
  heroTop: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', gap: 10 },
  cardLabel: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 11,
    color: theme.colors.textDim,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  balanceRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginTop: 8 },
  balance: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 36, color: theme.colors.text, letterSpacing: -1 },
  balanceCents: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, color: theme.colors.textDim },
  balanceSub: { fontFamily: 'Inter-Regular', fontSize: 13, color: theme.colors.textDim, marginTop: 6 },
  plInline: { color: theme.colors.green, fontFamily: 'Inter-SemiBold' },
  plBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: theme.colors.greenSoft,
    borderWidth: 1,
    borderColor: 'rgba(22,199,132,0.3)',
    paddingHorizontal: 11,
    paddingVertical: 6,
    borderRadius: 999,
  },
  plBadgeText: { fontFamily: 'Inter-Bold', fontSize: 13, color: theme.colors.green },
  heroActions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.colors.green,
    borderRadius: 13,
    paddingVertical: 13,
  },
  btnPrimaryText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: '#04231A' },
  btnGhost: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 13,
    paddingVertical: 13,
  },
  btnGhostText: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: theme.colors.text },
  tickerTape: {
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 12,
    marginBottom: 14,
    overflow: 'hidden',
  },
  tickerTrack: { flexDirection: 'row', paddingVertical: 8, alignItems: 'center' },
  tickerItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 14,
  },
  tickerPrice: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: theme.colors.text },
  tickerChg: { fontFamily: 'Inter-SemiBold', fontSize: 11 },
  statsRow: { flexDirection: 'row', gap: 10, marginBottom: 14 },
  statCard: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 15,
    padding: 14,
    alignItems: 'center',
  },
  statValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 22 },
  statLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: theme.colors.textDim,
    marginTop: 4,
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  card: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 14,
  },
  signalCard: { marginBottom: 14 },
  signalMain: { flexDirection: 'row', alignItems: 'center' },
  ringPct: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 12, color: theme.colors.text, position: 'absolute' },
  signalLabel: { fontFamily: 'Inter-SemiBold', fontSize: 10, color: theme.colors.textDim, letterSpacing: 1.4 },
  signalValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 20, marginTop: 2 },
  signalSub: { fontFamily: 'Inter-Regular', fontSize: 11.5, color: theme.colors.textDim, marginTop: 2 },
  signalChips: { flexDirection: 'row', gap: 8, marginTop: 14 },
  chip: {
    flex: 1,
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    borderRadius: 11,
    paddingVertical: 9,
    alignItems: 'center',
  },
  chipVal: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 14, color: theme.colors.text },
  chipKey: {
    fontFamily: 'Inter-Regular',
    fontSize: 10,
    color: theme.colors.textDim,
    marginTop: 2,
    textTransform: 'uppercase',
    letterSpacing: 0.7,
  },
  posRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 13 },
  posBorder: { borderBottomWidth: 1, borderBottomColor: 'rgba(255,255,255,0.05)' },
  posLeft: { flexDirection: 'row', alignItems: 'center', gap: 11, flex: 1 },
  posName: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text },
  posSub: { fontFamily: 'Inter-Regular', fontSize: 11.5, color: theme.colors.textDim, marginTop: 1 },
  posRight: { alignItems: 'flex-end' },
  posPnl: { fontFamily: 'Inter-Bold', fontSize: 14.5 },
  posPct: { fontFamily: 'Inter-SemiBold', fontSize: 11.5, marginTop: 1 },
  marketRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 11 },
  marketPrice: { fontFamily: 'Inter-SemiBold', fontSize: 14, color: theme.colors.text, textAlign: 'right' },
  marketChgRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginTop: 2, justifyContent: 'flex-end' },
  marketChg: { fontFamily: 'Inter-SemiBold', fontSize: 12 },
  footer: { textAlign: 'center', fontFamily: 'Inter-Regular', fontSize: 11.5, color: theme.colors.textDim, marginTop: 8 },
});
