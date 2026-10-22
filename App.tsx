import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { DatabaseProvider } from './src/database/DatabaseProvider';
import { NotebookScreen } from './src/screens/NotebookScreen';

export default function App() {
  return (
    <SafeAreaProvider>
      <DatabaseProvider>
        <StatusBar style="dark" />
        <NotebookScreen />
      </DatabaseProvider>
    </SafeAreaProvider>
  );
}
