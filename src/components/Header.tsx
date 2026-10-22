import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { colors } from '../theme/colors';

interface HeaderProps {
  onPressMenu?: () => void;
}

export function Header({ onPressMenu }: HeaderProps) {
  const handleShowInfo = () => {
    if (onPressMenu) {
      onPressMenu();
      return;
    }
    Alert.alert(
      'Mi Libretita 📖',
      'Tu libreta digital sencilla para llevar cuentas sin enredos.\n\n• Toca un renglón para tacharlo.\n• Puedes crear varias cuentas como Papá, Casa, etc.\n• 100% privado y guardado en tu teléfono.',
      [{ text: 'Entendido' }]
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.leftSection}>
        <View style={styles.iconBadge}>
          <MaterialCommunityIcons name="book-open-page-variant-outline" size={26} color="#A35613" />
        </View>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>Mi Libretita</Text>
          <Text style={styles.subtitle}>Anotaciones rápidas</Text>
        </View>
      </View>

      <TouchableOpacity
        style={styles.menuButton}
        onPress={handleShowInfo}
        accessibilityRole="button"
        accessibilityLabel="Información y opciones"
        hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
      >
        <Ionicons name="ellipsis-horizontal" size={24} color={colors.textMuted} />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 14,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBadge: {
    width: 44,
    height: 44,
    borderRadius: 14,
    backgroundColor: '#FDE7CA',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F8D8B0',
  },
  titleContainer: {
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: colors.textDark,
    letterSpacing: -0.3,
  },
  subtitle: {
    fontSize: 13,
    color: colors.textMuted,
    fontWeight: '500',
  },
  menuButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
  },
});
