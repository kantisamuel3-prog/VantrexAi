import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useEffect } from 'react';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withDelay,
  interpolate,
} from 'react-native-reanimated';
import { Users, Plus, Crown, ChevronRight } from 'lucide-react-native';
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

const GROUPS = [
  { id: '1', name: 'Family Savings Pool', members: 6, collected: 45000, goal: 60000, yourShare: 7500, lead: true },
  { id: '2', name: 'Office Paluwagan', members: 10, collected: 120000, goal: 120000, yourShare: 12000, lead: false },
  { id: '3', name: 'Weekend Trip Fund', members: 4, collected: 8200, goal: 20000, yourShare: 2050, lead: false },
  { id: '4', name: 'Investment Circle', members: 8, collected: 96000, goal: 160000, yourShare: 12000, lead: true },
];

function GroupCard({ group, index }: { group: (typeof GROUPS)[number]; index: number }) {
  const pct = Math.min(100, Math.round((group.collected / group.goal) * 100));
  const barSV = useSharedValue(0);
  useEffect(() => {
    barSV.value = withDelay(200 + index * 100, withSpring(pct / 100, { damping: 15, stiffness: 80 }));
  }, [pct, index]);
  const barStyle = useAnimatedStyle(() => ({
    width: `${interpolate(barSV.value, [0, 1], [0, pct])}%`,
  }));

  return (
    <FadeUp delay={index * 80}>
      <TouchableOpacity style={styles.groupCard} activeOpacity={0.7}>
        <View style={styles.groupTop}>
          <View style={styles.groupIconWrap}>
            <Users size={20} color={theme.colors.green} strokeWidth={2.2} />
            {group.lead && (
              <View style={styles.crownBadge}>
                <Crown size={10} color="#0A0B0F" strokeWidth={2.5} />
              </View>
            )}
          </View>
          <View style={styles.groupInfo}>
            <Text style={styles.groupName}>{group.name}</Text>
            <Text style={styles.groupMembers}>{group.members} members</Text>
          </View>
          <ChevronRight size={20} color={theme.colors.textMuted} strokeWidth={2} />
        </View>

        <View style={styles.progressRow}>
          <View style={styles.progressTrack}>
            <Animated.View style={[styles.progressFill, barStyle]} />
          </View>
          <Text style={styles.progressPct}>{pct}%</Text>
        </View>

        <View style={styles.groupFooter}>
          <View>
            <Text style={styles.footerLabel}>Collected</Text>
            <Text style={styles.footerValue}>₱{group.collected.toLocaleString()}</Text>
          </View>
          <View style={styles.footerCenter}>
            <Text style={styles.footerLabel}>Goal</Text>
            <Text style={styles.footerValue}>₱{group.goal.toLocaleString()}</Text>
          </View>
          <View style={styles.footerRight}>
            <Text style={styles.footerLabel}>Your Share</Text>
            <Text style={[styles.footerValue, { color: theme.colors.green }]}>
              ₱{group.yourShare.toLocaleString()}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    </FadeUp>
  );
}

export default function GroupScreen() {
  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.pageTitle}>My Groups</Text>
            <Text style={styles.pageSub}>4 active savings circles</Text>
          </View>
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
            <Plus size={22} color={theme.colors.green} strokeWidth={2.2} />
          </TouchableOpacity>
        </View>

        <FadeUp delay={100}>
          <View style={styles.summaryCard}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₱269,200</Text>
              <Text style={styles.summaryLabel}>Total Collected</Text>
            </View>
            <View style={styles.summaryDivider} />
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>₱33,550</Text>
              <Text style={styles.summaryLabel}>Your Contribution</Text>
            </View>
          </View>
        </FadeUp>

        <View style={{ gap: 12 }}>
          {GROUPS.map((g, i) => (
            <GroupCard key={g.id} group={g} index={i} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: theme.colors.bg },
  scroll: { padding: 16, paddingBottom: 100 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  pageTitle: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 26, color: theme.colors.text },
  pageSub: { fontFamily: 'Inter-Regular', fontSize: 14, color: theme.colors.textDim, marginTop: 4 },
  addBtn: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: theme.colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(22,199,132,0.3)',
  },
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.xl,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.colors.border,
    marginBottom: 16,
  },
  summaryItem: { flex: 1, alignItems: 'center' },
  summaryDivider: { width: 1, backgroundColor: theme.colors.border },
  summaryValue: { fontFamily: 'SpaceGrotesk-Bold', fontSize: 18, color: theme.colors.text },
  summaryLabel: {
    fontFamily: 'Inter-Regular',
    fontSize: 11,
    color: theme.colors.textDim,
    marginTop: 4,
    textAlign: 'center',
  },
  groupCard: {
    backgroundColor: theme.colors.card,
    borderRadius: theme.radius.lg,
    padding: 18,
    borderWidth: 1,
    borderColor: theme.colors.border,
  },
  groupTop: { flexDirection: 'row', alignItems: 'center', marginBottom: 14 },
  groupIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: theme.colors.greenSoft,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  crownBadge: {
    position: 'absolute',
    top: -4,
    right: -4,
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: theme.colors.gold,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: theme.colors.card,
  },
  groupInfo: { flex: 1 },
  groupName: { fontFamily: 'Inter-SemiBold', fontSize: 15, color: theme.colors.text },
  groupMembers: { fontFamily: 'Inter-Regular', fontSize: 12, color: theme.colors.textDim, marginTop: 2 },
  progressRow: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  progressTrack: {
    flex: 1,
    height: 8,
    borderRadius: 4,
    backgroundColor: theme.colors.elevated,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    backgroundColor: theme.colors.green,
  },
  progressPct: { fontFamily: 'Inter-SemiBold', fontSize: 12, color: theme.colors.green },
  groupFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: theme.colors.border,
  },
  footerCenter: { alignItems: 'center' },
  footerRight: { alignItems: 'flex-end' },
  footerLabel: { fontFamily: 'Inter-Regular', fontSize: 11, color: theme.colors.textDim, marginBottom: 3 },
  footerValue: { fontFamily: 'Inter-SemiBold', fontSize: 13, color: theme.colors.text },
});
