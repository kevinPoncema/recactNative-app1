import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface QuickInputBarProps {
  onAddItem: (concept: string, amount: number) => void;
}

export function QuickInputBar({ onAddItem }: QuickInputBarProps) {
  const [concept, setConcept] = useState('');
  const [amountStr, setAmountStr] = useState('');
  const conceptInputRef = useRef<React.ElementRef<typeof TextInput>>(null);
  const amountInputRef = useRef<React.ElementRef<typeof TextInput>>(null);

  const handleAdd = () => {
    const trimmedConcept = concept.trim();
    if (!trimmedConcept) {
      Alert.alert('Falta el concepto', 'Escribe de qué es la cuenta (ej. Pan, Café, Renta).');
      conceptInputRef.current?.focus();
      return;
    }

    // Limpieza de formato decimal (soporta coma o punto)
    const normalizedAmount = amountStr.replace(',', '.').trim();
    const parsedAmount = normalizedAmount === '' ? 0 : parseFloat(normalizedAmount);

    if (isNaN(parsedAmount) || parsedAmount < 0) {
      Alert.alert('Precio inválido', 'Por favor ingresa un número válido para el precio.');
      amountInputRef.current?.focus();
      return;
    }

    onAddItem(trimmedConcept, parsedAmount);

    // Limpiar entradas manteniendo el teclado abierto en el concepto para agilidad
    setConcept('');
    setAmountStr('');
    conceptInputRef.current?.focus();
  };

  return (
    <View style={styles.outerContainer}>
      <View style={styles.cardBox}>
        {/* Campo Concepto */}
        <View style={styles.conceptCol}>
          <Text style={styles.label}>CONCEPTO O COSA</Text>
          <TextInput
            ref={conceptInputRef}
            style={styles.textInput}
            value={concept}
            onChangeText={setConcept}
            placeholder="Ej. Café, Leche, Renta.."
            placeholderTextColor={colors.inputPlaceholder}
            returnKeyType="next"
            onSubmitEditing={() => amountInputRef.current?.focus()}
            blurOnSubmit={false}
            accessibilityLabel="Nombre del concepto o producto"
          />
        </View>

        {/* Separador vertical sutil */}
        <View style={styles.verticalDivider} />

        {/* Campo Precio */}
        <View style={styles.amountCol}>
          <Text style={styles.label}>PRECIO (L.)</Text>
          <View style={styles.amountRow}>
            <Text style={styles.currencyPrefix}>L.</Text>
            <TextInput
              ref={amountInputRef}
              style={[styles.textInput, styles.amountInput]}
              value={amountStr}
              onChangeText={setAmountStr}
              placeholder="0.00"
              placeholderTextColor={colors.inputPlaceholder}
              keyboardType="decimal-pad"
              returnKeyType="done"
              onSubmitEditing={handleAdd}
              blurOnSubmit={false}
              accessibilityLabel="Precio en Lempiras"
            />
          </View>
        </View>

        {/* Botón táctil grande + */}
        <TouchableOpacity
          style={styles.addButton}
          onPress={handleAdd}
          activeOpacity={0.8}
          accessibilityRole="button"
          accessibilityLabel="Añadir a la cuenta"
          accessibilityHint="Agrega este renglón a la libreta"
        >
          <Ionicons name="add" size={30} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <Text style={styles.helperTip}>
        Toca cualquier renglón para marcarlo como pagado
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  outerContainer: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 4,
  },
  cardBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.inputBg,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: colors.inputBorder,
    paddingVertical: 6,
    paddingLeft: 14,
    paddingRight: 6,
    minHeight: 64,
  },
  conceptCol: {
    flex: 1.3,
    justifyContent: 'center',
  },
  verticalDivider: {
    width: 1,
    height: 38,
    backgroundColor: colors.inputBorder,
    marginHorizontal: 8,
  },
  amountCol: {
    flex: 0.9,
    justifyContent: 'center',
  },
  label: {
    fontSize: 10,
    fontWeight: '800',
    color: colors.inputLabel,
    letterSpacing: 0.6,
    marginBottom: 2,
  },
  textInput: {
    fontSize: 15,
    fontWeight: '600',
    color: colors.inputText,
    padding: 0,
    margin: 0,
  },
  amountRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  currencyPrefix: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textDark,
    marginRight: 4,
  },
  amountInput: {
    flex: 1,
  },
  addButton: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: colors.primary,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 6,
    shadowColor: '#C86A0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3,
    elevation: 3,
  },
  helperTip: {
    textAlign: 'center',
    fontSize: 12.5,
    color: colors.textMuted,
    marginTop: 10,
    marginBottom: 4,
    fontWeight: '500',
  },
});
