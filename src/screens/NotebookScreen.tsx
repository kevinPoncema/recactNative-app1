import React, { useState } from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Text,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNotebook } from '../hooks/useNotebook';
import { Header } from '../components/Header';
import { AccountTabs } from '../components/AccountTabs';
import { SheetCard } from '../components/SheetCard';
import { SummaryFooter } from '../components/SummaryFooter';
import { NewAccountModal } from '../components/NewAccountModal';
import { colors } from '../theme/colors';

export function NotebookScreen() {
  const insets = useSafeAreaInsets();
  const [modalVisible, setModalVisible] = useState(false);

  const {
    accounts,
    activeAccount,
    items,
    totals,
    isLoading,
    selectAccount,
    createAccount,
    deleteAccount,
    addItem,
    toggleItemPaid,
    deleteItem,
    clearSheet,
  } = useNotebook();

  if (isLoading) {
    return (
      <View style={[styles.center, { paddingTop: insets.top }]}>
        <ActivityIndicator size="large" color={colors.primary} />
        <Text style={styles.loadingText}>Cargando tus notas...</Text>
      </View>
    );
  }

  return (
    <View
      style={[
        styles.safeContainer,
        {
          paddingTop: insets.top,
          paddingBottom: insets.bottom,
        },
      ]}
    >
      <KeyboardAvoidingView
        style={styles.keyboardContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        {/* Cabecera Principal */}
        <Header />

        {/* Pestañas de Cuentas */}
        <AccountTabs
          accounts={accounts}
          activeAccountId={activeAccount?.id || null}
          onSelectAccount={selectAccount}
          onOpenNewAccountModal={() => setModalVisible(true)}
          onDeleteAccount={deleteAccount}
        />

        {/* Contenido Principal con Scroll */}
        <ScrollView
          style={styles.scrollArea}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <SheetCard
            account={activeAccount}
            items={items}
            onAddItem={addItem}
            onTogglePaid={toggleItemPaid}
            onDeleteItem={deleteItem}
            onClearSheet={clearSheet}
          />
        </ScrollView>

        {/* Barra Fija Inferior con Totales */}
        <SummaryFooter
          totalPending={totals.totalPending}
          totalPaid={totals.totalPaid}
        />

        {/* Modal de Creación de Cuenta */}
        <NewAccountModal
          visible={modalVisible}
          onClose={() => setModalVisible(false)}
          onCreate={createAccount}
        />
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  safeContainer: {
    flex: 1,
    backgroundColor: colors.background,
  },
  keyboardContainer: {
    flex: 1,
  },
  scrollArea: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 16,
  },
  center: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textDark,
  },
});
