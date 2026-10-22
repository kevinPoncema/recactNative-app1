import React from 'react';
import {
  ScrollView,
  TouchableOpacity,
  Text,
  StyleSheet,
  View,
  Alert,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import type { Account } from '../types/notebook';
import { colors } from '../theme/colors';

interface AccountTabsProps {
  accounts: Account[];
  activeAccountId: string | null;
  onSelectAccount: (accountId: string) => void;
  onOpenNewAccountModal: () => void;
  onDeleteAccount: (accountId: string) => void;
}

export function AccountTabs({
  accounts,
  activeAccountId,
  onSelectAccount,
  onOpenNewAccountModal,
  onDeleteAccount,
}: AccountTabsProps) {
  const handleLongPress = (account: Account) => {
    if (accounts.length <= 1) {
      Alert.alert(
        'Cuenta principal',
        'Esta es tu única cuenta. Si deseas otra, pulsa "+ Nueva cuenta".'
      );
      return;
    }

    Alert.alert(
      `Opciones de "${account.name}"`,
      '¿Qué deseas hacer con esta cuenta y sus notas?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Eliminar cuenta',
          style: 'destructive',
          onPress: () => {
            Alert.alert(
              '¿Eliminar libreta?',
              `Se borrará la cuenta de "${account.name}" y todos sus renglones. Esta acción no se puede deshacer.`,
              [
                { text: 'No borrar', style: 'cancel' },
                {
                  text: 'Sí, eliminar',
                  style: 'destructive',
                  onPress: () => onDeleteAccount(account.id),
                },
              ]
            );
          },
        },
      ]
    );
  };

  return (
    <View style={styles.wrapper}>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {accounts.map((acc) => {
          const isActive = acc.id === activeAccountId;
          return (
            <TouchableOpacity
              key={acc.id}
              style={[
                styles.tabPill,
                isActive ? styles.tabPillActive : styles.tabPillInactive,
              ]}
              onPress={() => onSelectAccount(acc.id)}
              onLongPress={() => handleLongPress(acc)}
              activeOpacity={0.75}
              accessibilityRole="tab"
              accessibilityState={{ selected: isActive }}
              accessibilityLabel={`Cuenta de ${acc.name}${isActive ? ', activa' : ''}`}
              accessibilityHint="Mantén presionado para ver opciones de eliminar"
            >
              <Text
                style={[
                  styles.tabText,
                  isActive ? styles.tabTextActive : styles.tabTextInactive,
                ]}
              >
                {acc.name}
              </Text>
            </TouchableOpacity>
          );
        })}

        {/* Botón "+ Nueva cuenta" */}
        <TouchableOpacity
          style={[styles.tabPill, styles.tabNewPill]}
          onPress={onOpenNewAccountModal}
          activeOpacity={0.75}
          accessibilityRole="button"
          accessibilityLabel="Crear una nueva cuenta"
        >
          <Ionicons name="add" size={18} color={colors.tabNewText} style={styles.plusIcon} />
          <Text style={styles.tabNewText}>Nueva cuenta</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    marginVertical: 6,
  },
  scrollContent: {
    paddingHorizontal: 20,
    gap: 10,
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabPill: {
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 9999,
    minHeight: 44,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  tabPillActive: {
    backgroundColor: colors.primary,
    shadowColor: '#C86A0F',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  tabPillInactive: {
    backgroundColor: colors.tabInactiveBg,
  },
  tabNewPill: {
    backgroundColor: colors.tabNewBg,
    paddingLeft: 14,
    paddingRight: 18,
  },
  tabText: {
    fontSize: 16,
    fontWeight: '700',
  },
  tabTextActive: {
    color: '#FFFFFF',
  },
  tabTextInactive: {
    color: colors.tabInactiveText,
  },
  plusIcon: {
    marginRight: 4,
  },
  tabNewText: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.tabNewText,
  },
});
