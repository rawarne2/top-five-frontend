import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { PaperProvider } from 'react-native-paper';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './src/contexts/AuthContext';
import MainComponents from './src/components/MainComponents';
import { StyleSheet, View } from 'react-native';
import { customTheme } from './src/constants/customTheme';

const queryClient = new QueryClient();

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <PaperProvider theme={customTheme}>
          <NavigationContainer>
            <View style={styles.mainView}>
              <MainComponents />
            </View>
          </NavigationContainer>
        </PaperProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

const styles = StyleSheet.create({
  mainView: {
    flex: 1,
    paddingTop: 48,
    backgroundColor: customTheme.colors.background,
  },
});
