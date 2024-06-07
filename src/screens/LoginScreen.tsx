import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { Button, Text, TextInput } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../utils/authHelpers';
import LoadingScreen from './LoadingScreen';
import apiClient from '../api/apiClient';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const { setUser, setIsLoggedIn } = useAuth();

  const handleLogin = async () => {
    // show spinner if loading
    setIsLoggingIn(true);
    try {
      const loginResult = await login(email, password);
      if (loginResult) {
        console.log({ loginResult });
        setUser(loginResult.user);
        setIsLoggedIn(true);
        setErrorMessage('');
      } else {
        console.log('Invalid email or password.');
        setErrorMessage('Invalid email or password.');
      }
    } catch (error) {
      setErrorMessage('An error occurred. Please try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  if (isLoggingIn) {
    return <LoadingScreen />;
  }

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder='Email'
        value={email}
        onChangeText={setEmail}
        autoCapitalize={'none'}
      />
      <TextInput
        style={styles.input}
        placeholder='Password'
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Text style={{ color: 'red' }}>{errorMessage}</Text>
      <Button onPress={handleLogin} mode='contained-tonal'>
        Login
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingTop: 24,
  },
  input: {
    width: '80%',
    height: 40,
    margin: 12,
    borderWidth: 1,
    padding: 10,
    backgroundColor: 'white',
  },
  modal: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalText: {
    fontSize: 20,
    paddingTop: 10,
    paddingHorizontal: 10,
  },
  error: {
    color: 'red',
    padding: 4,
  },
});

export default LoginScreen;
