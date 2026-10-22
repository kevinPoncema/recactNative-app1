import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface SummaryFooterProps {
  totalPending: number;
  totalPaid: number;
}

export function SummaryFooter({
  totalPending,
  totalPaid,
}: SummaryFooterProps) {
  return (
    <View style={styles.footerContainer}>
      {/* Ya Pagado / Cobrado */}
      <View style={styles.paidSection}>
        <View style={styles.paidHeader}>
          <Ionicons name="checkmark-circle" size={17} color={colors.paidGreen} />
          <Text style={styles.paidLabel}>Ya Pagado</Text>
        </View>
        <Text style={styles.paidAmount}>
          L. {totalPaid.toFixed(2)}
        </Text>
      </View>

      {/* Indicador visual central */}
      <View style={styles.centerBadge}>
        <Ionicons name="swap-vertical" size={18} color="#8A8275" />
      </View>

      {/* TOTAL PENDIENTE (Destacado en Grande) */}
      <View style={styles.pendingCard}>
        <Text style={styles.pendingLabel}>TOTAL PENDIENTE</Text>
        <Text
          style={styles.pendingAmount}
          numberOfLines={1}
          adjustsFontSizeToFit
        >
          L. {totalPending.toFixed(2)}
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  footerContainer: {
    backgroundColor: '#FFFFFF',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1.5,
    borderTopColor: colors.divider,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -3 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 8,
  },
  paidSection: {
    flex: 1,
    justifyContent: 'center',
  },
  paidHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginBottom: 2,
  },
  paidLabel: {
    fontSize: 12.5,
    fontWeight: '700',
    color: colors.paidGreen,
  },
  paidAmount: {
    fontSize: 17,
    fontWeight: '800',
    color: colors.textDark,
  },
  centerBadge: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#F3EFE9',
    justifyContent: 'center',
    alignItems: 'center',
    marginHorizontal: 8,
  },
  pendingCard: {
    flex: 1.4,
    backgroundColor: colors.pendingBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.pendingBorder,
    paddingVertical: 8,
    paddingHorizontal: 14,
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  pendingLabel: {
    fontSize: 10,
    fontWeight: '900',
    color: colors.pendingText,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  pendingAmount: {
    fontSize: 22,
    fontWeight: '900',
    color: colors.pendingText,
  },
});
