import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import MainComponents from './src/components/MainComponents';
import { SafeAreaView, StyleSheet } from 'react-native';

export default function App() {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider>
          <NavigationContainer>
            <SafeAreaView style={styles.container}>
              <MainComponents />
            </SafeAreaView>
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
