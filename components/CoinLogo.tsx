import React from 'react';
import { View } from 'react-native';
import Svg, { Circle, Path, Text as SvgText, Defs, LinearGradient, Stop } from 'react-native-svg';

interface CoinLogoProps {
  symbol: string;
  size?: number;
}

const COLORS: Record<string, { bg: string; fg: string; accent?: string }> = {
  BTC: { bg: '#F7931A', fg: '#FFFFFF' },
  ETH: { bg: '#627EEA', fg: '#FFFFFF' },
  USDT: { bg: '#26A17B', fg: '#FFFFFF' },
  SOL: { bg: '#14181F', fg: '#9945FF', accent: '#14F195' },
  BNB: { bg: '#F3BA2F', fg: '#FFFFFF' },
  XRP: { bg: '#23292F', fg: '#FFFFFF' },
  ADA: { bg: '#2C4A7C', fg: '#FFFFFF' },
  DOGE: { bg: '#C2A633', fg: '#FFFFFF' },
};

export function CoinLogo({ symbol, size = 34 }: CoinLogoProps) {
  const c = COLORS[symbol] || { bg: '#1A2236', fg: '#16C784' };
  const half = size / 2;

  const renderInner = () => {
    switch (symbol) {
      case 'BTC':
        return (
          <Path
            d="M23.19 14.02c.31-2.1-1.29-3.22-3.47-3.98l.71-2.84-1.73-.43-.69 2.77c-.45-.11-.92-.21-1.38-.34l.69-2.78L15.6 6l-.71 2.84c-.38-.09-.75-.17-1.1-.27v-.01l-2.39-.6-.46 1.85s1.28.29 1.25.31c.7.17.83.64.81 1l-.81 3.24c.05.01.11.03.18.06l-.18-.05-1.13 4.53c-.09.21-.31.53-.8.41.02.03-1.26-.31-1.26-.31l-.86 1.98 2.25.56c.42.1.83.21 1.23.32l-.72 2.87 1.73.43.71-2.84c.47.13.93.25 1.38.36l-.71 2.83 1.73.43.72-2.87c2.95.56 5.16.33 6.1-2.33.75-2.15-.04-3.39-1.59-4.19 1.13-.26 1.98-.9 2.21-2.28z"
            transform={`scale(${size / 32})`}
            fill={c.fg}
          />
        );
      case 'ETH':
        return (
          <>
            <Path d={`M${half} ${size * 0.125} L${size * 0.28} ${half} L${half} ${size * 0.59} Z`} fill={c.fg} fillOpacity={0.6} />
            <Path d={`M${half} ${size * 0.125} L${size * 0.72} ${half} L${half} ${size * 0.59} Z`} fill={c.fg} />
            <Path d={`M${half} ${size * 0.69} L${size * 0.28} ${size * 0.56} L${half} ${size * 0.875} Z`} fill={c.fg} fillOpacity={0.6} />
            <Path d={`M${half} ${size * 0.69} L${size * 0.72} ${size * 0.56} L${half} ${size * 0.875} Z`} fill={c.fg} />
            <Path d={`M${half} ${size * 0.59} L${size * 0.28} ${half} L${half} ${size * 0.69} Z`} fill={c.fg} fillOpacity={0.2} />
            <Path d={`M${half} ${size * 0.59} L${size * 0.72} ${half} L${half} ${size * 0.69} Z`} fill={c.fg} fillOpacity={0.6} />
          </>
        );
      case 'USDT':
        return (
          <Path
            d="M17.92 17.89c-.11.008-.68.042-1.94.042-1.01 0-1.72-.03-1.97-.042-3.89-.171-6.79-.848-6.79-1.658 0-.809 2.9-1.486 6.79-1.66v2.644c.25.018.98.061 1.99.061 1.2 0 1.81-.05 1.92-.06v-2.643c3.88.173 6.78.85 6.78 1.658 0 .81-2.9 1.486-6.78 1.657m0-3.59v-2.37h5.41V8.315H8.6v3.615h5.41v2.369c-4.4.202-7.71 1.074-7.71 2.117 0 1.044 3.31 1.915 7.71 2.118v7.582h3.91v-7.584c4.39-.202 7.7-1.073 7.7-2.116 0-1.043-3.31-1.913-7.7-2.116"
            transform={`scale(${size / 32})`}
            fill={c.fg}
          />
        );
      case 'SOL':
        return (
          <>
            <Defs>
              <LinearGradient id={`sol-${size}`} x1="0" y1="1" x2="1" y2="0">
                <Stop offset="0" stopColor="#9945FF" />
                <Stop offset="1" stopColor="#14F195" />
              </LinearGradient>
            </Defs>
            <Path
              d="M10.9 20.7c.14-.14.33-.22.53-.22h11.9c.33 0 .5.4.26.63l-2.34 2.34c-.14.14-.33.22-.53.22H8.83c-.33 0-.5-.4-.26-.63l2.33-2.34zm0-12.4c.14-.14.33-.22.53-.22h11.9c.33 0 .5.4.26.63l-2.34 2.34c-.14.14-.33.22-.53.22H8.83c-.33 0-.5-.4-.26-.63l2.33-2.34zm11.71 6.2c-.14-.14-.33-.22-.53-.22H10.17c-.33 0-.5.4-.26.63l2.34 2.34c.14.14.33.22.53.22h11.9c.33 0 .5-.4.26-.63l-2.34-2.34z"
              transform={`scale(${size / 32})`}
              fill={`url(#sol-${size})`}
            />
          </>
        );
      case 'BNB':
        return (
          <Path
            d="M12.12 14.4L16 10.52l3.89 3.89 2.26-2.26L16 6l-6.14 6.14 2.26 2.26zM6 16l2.26-2.26L10.52 16l-2.26 2.26L6 16zm6.12 1.6L16 21.48l3.89-3.89 2.26 2.26L16 26l-6.14-6.14-.01-.01 2.27-2.25zM21.48 16l2.26-2.26L26 16l-2.26 2.26L21.48 16zm-3.19 0h.01L16 13.71 13.71 16 16 18.29 18.29 16z"
            transform={`scale(${size / 32})`}
            fill={c.fg}
          />
        );
      case 'XRP':
        return (
          <Path
            d="M21.5 6.5h3.2l-6.7 6.6c-1.1 1.1-2.9 1.1-4 0L7.3 6.5h3.2l5 5c.3.3.7.3 1 0l5-5zm3.2 19h-3.2l-5-5c-.3-.3-.7-.3-1 0l-5 5H7.3l6.7-6.6c1.1-1.1 2.9-1.1 4 0l6.7 6.6z"
            transform={`scale(${size / 32})`}
            fill={c.fg}
          />
        );
      case 'ADA':
        return (
          <>
            <Circle cx={half} cy={half} r={size * 0.08} fill={c.fg} />
            <Circle cx={half} cy={size * 0.27} r={size * 0.047} fill={c.fg} />
            <Circle cx={half} cy={size * 0.73} r={size * 0.047} fill={c.fg} />
            <Circle cx={size * 0.3} cy={size * 0.38} r={size * 0.047} fill={c.fg} />
            <Circle cx={size * 0.7} cy={size * 0.38} r={size * 0.047} fill={c.fg} />
            <Circle cx={size * 0.3} cy={size * 0.62} r={size * 0.047} fill={c.fg} />
            <Circle cx={size * 0.7} cy={size * 0.62} r={size * 0.047} fill={c.fg} />
            <Circle cx={size * 0.31} cy={size * 0.22} r={size * 0.03} fill={c.fg} />
            <Circle cx={size * 0.69} cy={size * 0.22} r={size * 0.03} fill={c.fg} />
            <Circle cx={size * 0.31} cy={size * 0.78} r={size * 0.03} fill={c.fg} />
            <Circle cx={size * 0.69} cy={size * 0.78} r={size * 0.03} fill={c.fg} />
          </>
        );
      case 'DOGE':
        return (
          <SvgText
            x={half}
            y={size * 0.69}
            fontSize={size * 0.5}
            fontWeight="bold"
            fill={c.fg}
            textAnchor="middle"
          >
            D
          </SvgText>
        );
      default:
        return (
          <SvgText
            x={half}
            y={size * 0.65}
            fontSize={size * 0.35}
            fontWeight="bold"
            fill={c.fg}
            textAnchor="middle"
          >
            {symbol.slice(0, 3)}
          </SvgText>
        );
    }
  };

  return (
    <View style={{ width: size, height: size }}>
      <Svg width={size} height={size}>
        <Circle cx={half} cy={half} r={half} fill={c.bg} />
        {renderInner()}
      </Svg>
    </View>
  );
}
