import React, { ReactNode, Suspense } from 'react';
import { SQLiteProvider } from 'expo-sqlite';
import { ActivityIndicator, View, Text, StyleSheet } from 'react-native';
import { initializeDatabase } from './schema';
import { colors } from '../theme/colors';

export const DATABASE_NAME = 'milibretita.db';

interface Props {
  children: ReactNode;
}

function DatabaseFallback() {
  return (
    <View style={styles.loadingContainer}>
      <ActivityIndicator size="large" color={colors.primary} />
      <Text style={styles.loadingText}>Abriendo Mi Libretita...</Text>
    </View>
  );
}

export function DatabaseProvider({ children }: Props) {
  return (
    <Suspense fallback={<DatabaseFallback />}>
      <SQLiteProvider
        databaseName={DATABASE_NAME}
        onInit={initializeDatabase}
        useSuspense={true}
      >
        {children}
      </SQLiteProvider>
    </Suspense>
  );
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 14,
  },
  loadingText: {
    fontSize: 18,
    color: colors.textDark,
    fontWeight: '600',
  },
});
