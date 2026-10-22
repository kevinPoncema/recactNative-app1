import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Item } from '../types/notebook';
import { colors } from '../theme/colors';

interface ItemRowProps {
  item: Item;
  onTogglePaid: (id: string) => void;
  onDelete: (id: string) => void;
}

export function ItemRow({ item, onTogglePaid, onDelete }: ItemRowProps) {
  const isPaid = item.is_paid === 1;

  const handleDelete = () => {
    Alert.alert(
      '¿Borrar este renglón?',
      `Se eliminará "${item.concept}" (L. ${item.amount.toFixed(2)}) de la libreta.`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sí, borrar',
          style: 'destructive',
          onPress: () => onDelete(item.id),
        },
      ]
    );
  };

  return (
    <View style={[styles.container, isPaid && styles.containerPaid]}>
      {/* Área táctil principal de tachado */}
      <TouchableOpacity
        style={styles.mainTouchArea}
        onPress={() => onTogglePaid(item.id)}
        activeOpacity={0.7}
        accessibilityRole="checkbox"
        accessibilityState={{ checked: isPaid }}
        accessibilityLabel={`${item.concept}, Lempiras ${item.amount.toFixed(2)}, ${
          isPaid ? 'marcado como pagado' : 'pendiente de pago'
        }`}
        accessibilityHint="Toca para cambiar entre pagado y pendiente"
      >
        {/* Checkbox táctil */}
        <View style={[styles.checkbox, isPaid && styles.checkboxPaid]}>
          {isPaid ? (
            <Ionicons name="checkmark-sharp" size={18} color="#FFFFFF" />
          ) : (
            <View style={styles.checkboxInnerHole} />
          )}
        </View>

        {/* Concepto con efecto de tachado */}
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.conceptText,
              isPaid && styles.conceptTextPaid,
            ]}
            numberOfLines={2}
          >
            {item.concept}
          </Text>
        </View>

        {/* Monto formateado */}
        <View style={styles.amountContainer}>
          <Text
            style={[
              styles.amountText,
              isPaid && styles.amountTextPaid,
            ]}
          >
            L. {item.amount.toFixed(2)}
          </Text>
        </View>
      </TouchableOpacity>

      {/* Botón discreto de eliminación */}
      <TouchableOpacity
        style={styles.deleteButton}
        onPress={handleDelete}
        hitSlop={{ top: 12, bottom: 12, left: 10, right: 10 }}
        accessibilityRole="button"
        accessibilityLabel={`Borrar ${item.concept}`}
      >
        <Ionicons name="trash-outline" size={18} color="#A8A196" />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.divider,
    backgroundColor: '#FFFFFF',
    minHeight: 56,
  },
  containerPaid: {
    backgroundColor: '#FAF9F6',
  },
  mainTouchArea: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 28,
    height: 28,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C7BFB3',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    backgroundColor: '#FFFFFF',
  },
  checkboxPaid: {
    backgroundColor: colors.paidGreen,
    borderColor: colors.paidGreen,
  },
  checkboxInnerHole: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'transparent',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    paddingRight: 8,
  },
  conceptText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
  conceptTextPaid: {
    color: colors.textStrikethrough,
    textDecorationLine: 'line-through',
    textDecorationStyle: 'solid',
  },
  amountContainer: {
    alignItems: 'flex-end',
    justifyContent: 'center',
    minWidth: 80,
  },
  amountText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textDark,
  },
  amountTextPaid: {
    color: colors.textStrikethrough,
    textDecorationLine: 'line-through',
  },
  deleteButton: {
    width: 36,
    height: 44,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
  },
});
