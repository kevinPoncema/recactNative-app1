import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import type { Account, Item } from '../types/notebook';
import { QuickInputBar } from './QuickInputBar';
import { ItemRow } from './ItemRow';
import { EmptySheet } from './EmptySheet';
import { colors } from '../theme/colors';

interface SheetCardProps {
  account: Account | null;
  items: Item[];
  onAddItem: (concept: string, amount: number) => void;
  onTogglePaid: (id: string) => void;
  onDeleteItem: (id: string) => void;
  onClearSheet: () => void;
}

export function SheetCard({
  account,
  items,
  onAddItem,
  onTogglePaid,
  onDeleteItem,
  onClearSheet,
}: SheetCardProps) {
  // Fecha amigable en español (ej. "22 oct")
  const formattedDate = React.useMemo(() => {
    try {
      const now = new Date();
      const day = now.getDate();
      const monthNames = [
        'ene', 'feb', 'mar', 'abr', 'may', 'jun',
        'jul', 'ago', 'sep', 'oct', 'nov', 'dic',
      ];
      return `${day} ${monthNames[now.getMonth()]}`;
    } catch {
      return '';
    }
  }, []);

  const handleClearSheet = () => {
    if (items.length === 0) {
      Alert.alert('Hoja limpia', 'Esta hoja ya está completamente vacía.');
      return;
    }

    Alert.alert(
      '¿Comenzar nueva hoja?',
      `Se limpiarán todos los renglones anotados en la cuenta de "${account?.name || 'esta libreta'}".`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, nueva hoja',
          style: 'destructive',
          onPress: onClearSheet,
        },
      ]
    );
  };

  return (
    <View style={styles.sheetContainer}>
      {/* Cabecera de la Hoja */}
      <View style={styles.headerArea}>
        <View style={styles.metaRow}>
          <Text style={styles.accountLabel}>CUENTA DE:</Text>
          <Text style={styles.dateLabel}>{formattedDate}</Text>
        </View>
        <Text style={styles.accountTitle}>
          {account?.name || 'Hoja'}
        </Text>
      </View>

      <View style={styles.divider} />

      {/* Barra de Entrada Rápida */}
      <QuickInputBar onAddItem={onAddItem} />

      {/* Lista de Renglones o Estado Vacío */}
      <View style={styles.itemsWrapper}>
        {items.length === 0 ? (
          <EmptySheet />
        ) : (
          items.map((item) => (
            <ItemRow
              key={item.id}
              item={item}
              onTogglePaid={onTogglePaid}
              onDelete={onDeleteItem}
            />
          ))
        )}
      </View>

      {/* Botón inferior: Nueva Hoja (Vaciar) */}
      <View style={styles.footerActionContainer}>
        <View style={styles.divider} />
        <View style={styles.actionRow}>
          <TouchableOpacity
            style={styles.newSheetButton}
            onPress={handleClearSheet}
            activeOpacity={0.75}
            accessibilityRole="button"
            accessibilityLabel="Nueva hoja, vaciar renglones actuales"
          >
            <MaterialCommunityIcons
              name="trash-can-outline"
              size={18}
              color={colors.leafActionText}
              style={{ marginRight: 6 }}
            />
            <Text style={styles.newSheetText}>Nueva Hoja (Vaciar)</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sheetContainer: {
    backgroundColor: colors.sheetBackground,
    borderRadius: 24,
    borderWidth: 1.5,
    borderColor: colors.sheetBorder,
    shadowColor: '#2D251E',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.06,
    shadowRadius: 12,
    elevation: 3,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 10,
  },
  headerArea: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 10,
  },
  metaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  accountLabel: {
    fontSize: 11,
    fontWeight: '800',
    color: colors.inputLabel,
    letterSpacing: 0.8,
  },
  dateLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: colors.textMuted,
  },
  accountTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.5,
  },
  divider: {
    height: 1,
    backgroundColor: colors.divider,
    width: '100%',
  },
  itemsWrapper: {
    paddingBottom: 6,
  },
  footerActionContainer: {
    marginTop: 6,
  },
  actionRow: {
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  newSheetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 18,
    borderRadius: 12,
    backgroundColor: colors.leafActionBg,
    borderWidth: 1,
    borderColor: colors.leafActionBorder,
  },
  newSheetText: {
    fontSize: 13.5,
    fontWeight: '700',
    color: colors.leafActionText,
  },
});
