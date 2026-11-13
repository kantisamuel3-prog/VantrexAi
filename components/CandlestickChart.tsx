import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, PanResponder } from 'react-native';
import Svg, { Rect, Line, Text as SvgText, Defs, LinearGradient, Stop, Path } from 'react-native-svg';
import { ZoomIn, ZoomOut, Maximize } from 'lucide-react-native';
import { theme } from '@/lib/theme';

interface Candle {
  o: number;
  h: number;
  l: number;
  c: number;
  v: number;
}

function genCandles(count: number, basePrice: number): Candle[] {
  const candles: Candle[] = [];
  let price = basePrice * (0.94 + Math.random() * 0.04);
  for (let i = 0; i < count; i++) {
    const change = (Math.random() - 0.46) * price * 0.012;
    const open = price;
    const close = price + change;
    const high = Math.max(open, close) + Math.random() * price * 0.004;
    const low = Math.min(open, close) - Math.random() * price * 0.004;
    candles.push({ o: open, h: high, l: low, c: close, v: 20 + Math.random() * 80 });
    price = close;
  }
  return candles;
}

function fmtPrice(n: number): string {
  if (n < 1) return n.toFixed(4);
  return n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

// ---- Mini candlestick chart ----
function MiniCandleChart({
  label,
  pairLabel,
  basePrice,
}: {
  label: string;
  pairLabel: string;
  basePrice: number;
}) {
  const [candles, setCandles] = useState<Candle[]>([]);
  const W = 100;
  const H = 56;

  useEffect(() => {
    setCandles(genCandles(18, basePrice));
  }, [basePrice]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const last = next[next.length - 1];
        const move = (Math.random() - 0.48) * last.c * 0.004;
        last.c = last.c + move;
        last.h = Math.max(last.h, last.c);
        last.l = Math.min(last.l, last.c);
        if (Math.random() > 0.55) {
          next.push({ o: last.c, h: last.c, l: last.c, c: last.c, v: 5 + Math.random() * 40 });
          if (next.length > 18) next.shift();
        }
        return next;
      });
    }, 2200);
    return () => clearInterval(interval);
  }, []);

  if (!candles.length) return <View style={miniStyles.container} />;

  const hi = Math.max(...candles.map((c) => c.h));
  const lo = Math.min(...candles.map((c) => c.l));
  const range = hi - lo || 1;
  const padTop = 4;
  const padBot = 4;
  const plotH = H - padTop - padBot;
  const slot = W / candles.length;
  const bodyW = Math.max(2, slot * 0.5);

  const y = (p: number) => padTop + ((hi - p) / range) * plotH;

  const lastCandle = candles[candles.length - 1];
  const rising = lastCandle.c >= lastCandle.o;
  const chgPct = ((lastCandle.c - candles[0].o) / candles[0].o) * 100;

  return (
    <View style={miniStyles.container}>
      <View style={miniStyles.header}>
        <Text style={miniStyles.label}>{label}</Text>
        <Text style={[miniStyles.chg, { color: rising ? theme.colors.green : theme.colors.red }]}>
          {chgPct >= 0 ? '+' : ''}{chgPct.toFixed(2)}%
        </Text>
      </View>
      <Svg width={W} height={H}>
        {candles.map((c, i) => {
          const up = c.c >= c.o;
          const col = up ? theme.colors.green : theme.colors.red;
          const cx = slot * i + slot / 2;
          const top = y(Math.max(c.o, c.c));
          const bot = y(Math.min(c.o, c.c));
          return (
            <React.Fragment key={i}>
              <Line x1={cx} y1={y(c.h)} x2={cx} y2={y(c.l)} stroke={col} strokeWidth={1} />
              <Rect
                x={cx - bodyW / 2}
                y={top}
                width={bodyW}
                height={Math.max(1.5, bot - top)}
                rx={1}
                fill={col}
                opacity={i === candles.length - 1 ? 1 : 0.65}
              />
            </React.Fragment>
          );
        })}
      </Svg>
      <Text style={miniStyles.pairLabel}>{pairLabel}</Text>
    </View>
  );
}

// ---- Main candlestick chart ----
interface CandlestickChartProps {
  width: number;
  height: number;
}

function CandlestickChart({ width, height }: CandlestickChartProps) {
  const W = width;
  const H = height;
  const padTop = 14;
  const padBottom = 32;
  const padRight = 62;
  const plotW = W - padRight;
  const volH = (H - padTop - padBottom) * 0.14;
  const plotH = H - padTop - padBottom - volH - 6;

  const [candles, setCandles] = useState<Candle[]>([]);
  const [visible, setVisible] = useState(22);
  const [offset, setOffset] = useState(0);
  const [tickCount, setTickCount] = useState(0);
  const panRef = useRef<{ startOffset: number; startX: number }>({ startOffset: 0, startX: 0 });
  const pinchRef = useRef<{ startDist: number; startVisible: number }>({ startDist: 0, startVisible: 0 });

  const basePrice = 67412.5;

  useEffect(() => {
    setCandles(genCandles(55, basePrice));
  }, []);

  const clampVisible = useCallback((v: number) => Math.max(8, Math.min(45, v)), []);
  const clampOffset = useCallback((o: number) => {
    const maxOff = Math.max(0, candles.length - visible);
    return Math.max(0, Math.min(maxOff, o));
  }, [candles.length, visible]);

  // Slow live ticking
  useEffect(() => {
    const interval = setInterval(() => {
      setCandles((prev) => {
        if (!prev.length) return prev;
        const next = [...prev];
        const last = next[next.length - 1];
        const move = (Math.random() - 0.48) * last.c * 0.0022;
        last.c = last.c + move;
        last.h = Math.max(last.h, last.c);
        last.l = Math.min(last.l, last.c);
        last.v = Math.min(last.v + 2, 100);
        return next;
      });
      setTickCount((t) => t + 1);
    }, 1200);
    return () => clearInterval(interval);
  }, []);

  // New candle every ~5 ticks
  useEffect(() => {
    if (tickCount > 0 && tickCount % 5 === 0) {
      setCandles((prev) => {
        if (!prev.length) return prev;
        const last = prev[prev.length - 1];
        const next = [...prev, { o: last.c, h: last.c, l: last.c, c: last.c, v: 5 + Math.random() * 50 }];
        if (next.length > 70) next.shift();
        return next;
      });
    }
  }, [tickCount]);

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) => {
        panRef.current = { startOffset: offset, startX: e.nativeEvent.locationX };
        if (e.nativeEvent.touches && e.nativeEvent.touches.length >= 2) {
          const dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
          const dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);
          pinchRef.current = { startDist: dx + dy, startVisible: visible };
        }
      },
      onPanResponderMove: (e, ges) => {
        if (e.nativeEvent.touches && e.nativeEvent.touches.length >= 2) {
          const dx = Math.abs(e.nativeEvent.touches[0].pageX - e.nativeEvent.touches[1].pageX);
          const dy = Math.abs(e.nativeEvent.touches[0].pageY - e.nativeEvent.touches[1].pageY);
          const dist = dx + dy;
          if (pinchRef.current.startDist > 0 && dist > 0) {
            const ratio = pinchRef.current.startDist / dist;
            setVisible(clampVisible(Math.round(pinchRef.current.startVisible * ratio)));
          }
        } else {
          const dxCandles = (ges.dx / plotW) * visible;
          setOffset(clampOffset(panRef.current.startOffset - dxCandles));
        }
      },
    })
  ).current;

  const zoomIn = () => setVisible(clampVisible(visible - 4));
  const zoomOut = () => setVisible(clampVisible(visible + 4));
  const resetView = () => { setVisible(22); setOffset(0); };

  if (!candles.length) return <View style={{ width: W, height: H }} />;

  const end = Math.max(1, candles.length - offset);
  const start = Math.max(0, end - visible);
  const view = candles.slice(start, end);

  let hi = -Infinity, lo = Infinity, maxV = 0;
  for (const c of view) {
    if (c.h > hi) hi = c.h;
    if (c.l < lo) lo = c.l;
    if (c.v > maxV) maxV = c.v;
  }
  const range = hi - lo || 1;
  hi += range * 0.08;
  lo -= range * 0.08;
  const totalRange = hi - lo;

  const y = (p: number) => padTop + ((hi - p) / totalRange) * plotH;
  const slot = plotW / Math.max(1, view.length);
  const bodyW = Math.max(3, Math.min(slot * 0.6, 16));

  const last = view[view.length - 1];
  const rising = last.c >= last.o;
  const lastPrice = last.c;
  const chgPct = ((last.c - view[0].o) / view[0].o) * 100;

  let linePath = '';
  view.forEach((c, i) => {
    const x = slot * i + slot / 2;
    const yp = y(c.c);
    linePath += i === 0 ? `M${x},${yp}` : ` L${x},${yp}`;
  });

  return (
    <View>
      {/* Chart header */}
      <View style={styles.chartHeader}>
        <View>
          <Text style={styles.chartPair}>BTC / USDT</Text>
          <Text style={styles.chartPriceRow}>
            <Text style={styles.chartPrice}>${fmtPrice(lastPrice)}</Text>{'  '}
            <Text style={[styles.chartChg, { color: rising ? theme.colors.green : theme.colors.red }]}>
              {chgPct >= 0 ? '+' : ''}{chgPct.toFixed(2)}%
            </Text>
          </Text>
        </View>
        <View style={styles.chartControls}>
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomIn} activeOpacity={0.7}>
            <ZoomIn size={16} color={theme.colors.textDim} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={zoomOut} activeOpacity={0.7}>
            <ZoomOut size={16} color={theme.colors.textDim} strokeWidth={2} />
          </TouchableOpacity>
          <TouchableOpacity style={styles.zoomBtn} onPress={resetView} activeOpacity={0.7}>
            <Maximize size={15} color={theme.colors.textDim} strokeWidth={2} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Chart SVG */}
      <View style={{ width: W, height: H }} {...panResponder.panHandlers}>
        <Svg width={W} height={H}>
          <Defs>
            <LinearGradient id="areaGlow" x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={rising ? theme.colors.green : theme.colors.red} stopOpacity={0.12} />
              <Stop offset="1" stopColor={rising ? theme.colors.green : theme.colors.red} stopOpacity={0} />
            </LinearGradient>
          </Defs>

          {/* Grid lines */}
          {[0, 1, 2, 3, 4].map((g) => {
            const gy = padTop + (plotH / 4) * g;
            const gp = hi - (totalRange / 4) * g;
            return (
              <React.Fragment key={g}>
                <Line x1={0} y1={gy} x2={plotW} y2={gy} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
                <SvgText x={plotW + 5} y={gy + 3} fontSize={8.5} fill="#5B6577" fontFamily="Inter-Regular">
                  {fmtPrice(gp)}
                </SvgText>
              </React.Fragment>
            );
          })}

          {/* Area fill */}
          <Path d={`${linePath} L${plotW},${padTop + plotH} L0,${padTop + plotH} Z`} fill="url(#areaGlow)" />

          {/* Volume bars */}
          {view.map((c, i) => {
            const vx = slot * i + slot / 2;
            const vh = (c.v / maxV) * volH;
            return (
              <Rect
                key={`v${i}`}
                x={vx - bodyW / 2}
                y={H - padBottom - vh}
                width={bodyW}
                height={vh}
                rx={1.5}
                fill={c.c >= c.o ? theme.colors.green : theme.colors.red}
                opacity={0.22}
              />
            );
          })}

          {/* Candles */}
          {view.map((c, i) => {
            const up = c.c >= c.o;
            const col = up ? theme.colors.green : theme.colors.red;
            const cx = slot * i + slot / 2;
            const top = y(Math.max(c.o, c.c));
            const bot = y(Math.min(c.o, c.c));
            const isLast = i === view.length - 1 && offset === 0;
            return (
              <React.Fragment key={`c${i}`}>
                <Line x1={cx} y1={y(c.h)} x2={cx} y2={y(c.l)} stroke={col} strokeWidth={1.3} />
                <Rect
                  x={cx - bodyW / 2}
                  y={top}
                  width={bodyW}
                  height={Math.max(1.5, bot - top)}
                  rx={2}
                  fill={col}
                  opacity={isLast ? 1 : 0.85}
                />
              </React.Fragment>
            );
          })}

          {/* Close price line */}
          <Path d={linePath} stroke={rising ? theme.colors.green : theme.colors.red} strokeWidth={1.3} fill="none" opacity={0.45} />

          {/* Current price dashed line + tag */}
          <Line
            x1={0}
            y1={y(lastPrice)}
            x2={plotW}
            y2={y(lastPrice)}
            stroke={rising ? theme.colors.green : theme.colors.red}
            strokeWidth={1}
            strokeDasharray="4 4"
            opacity={0.5}
          />
          <Rect x={plotW + 2} y={y(lastPrice) - 9} width={padRight - 4} height={18} rx={5} fill={rising ? theme.colors.green : theme.colors.red} />
          <SvgText x={plotW + 5} y={y(lastPrice) + 3} fontSize={8.5} fontWeight="bold" fill="#FFFFFF" fontFamily="Inter-SemiBold">
            {fmtPrice(lastPrice)}
          </SvgText>
        </Svg>
      </View>

      <Text style={styles.hint}>Pinch to zoom · Drag to pan · Use buttons above</Text>
    </View>
  );
}

// ---- Exported wrapper with mini charts ----
export function ChartSection({ chartWidth }: { chartWidth: number }) {
  return (
    <View>
      <View style={styles.chartCard}>
        <CandlestickChart width={chartWidth} height={280} />
      </View>

      <View style={styles.miniRow}>
        <MiniCandleChart label="ETH" pairLabel="ETH/USDT" basePrice={3184} />
        <MiniCandleChart label="SOL" pairLabel="SOL/USDT" basePrice={141.8} />
        <MiniCandleChart label="BNB" pairLabel="BNB/USDT" basePrice={592.3} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  chartCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 16,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 12,
  },
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  chartPair: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 15,
    color: theme.colors.text,
    letterSpacing: 0.2,
  },
  chartPriceRow: { marginTop: 2 },
  chartPrice: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 14,
    color: theme.colors.text,
  },
  chartChg: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 13,
  },
  chartControls: { flexDirection: 'row', gap: 6 },
  zoomBtn: {
    width: 32,
    height: 32,
    borderRadius: 9,
    backgroundColor: theme.colors.bgSoft,
    borderWidth: 1,
    borderColor: theme.colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hint: {
    textAlign: 'center',
    fontSize: 10,
    color: theme.colors.textDim,
    marginTop: 6,
    fontFamily: 'Inter-Regular',
  },
  miniRow: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 14,
  },
});

const miniStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.colors.card,
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    fontFamily: 'SpaceGrotesk-Bold',
    fontSize: 12,
    color: theme.colors.text,
  },
  chg: {
    fontFamily: 'Inter-SemiBold',
    fontSize: 10,
  },
  pairLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 9,
    color: theme.colors.textDim,
    marginTop: 2,
    textAlign: 'center',
  },
});
