import React, { useState } from 'react';
import { TextInput, View, StyleSheet } from 'react-native';
import { Button } from 'react-native-paper';
import { useAuth } from '../contexts/AuthContext';
import { login } from '../utils/authHelpers';

function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { isLoggedIn, setUser, setIsLoading, setIsLoggedIn } = useAuth();

  const handleLogin = async () => {
    login(email, password, setUser, setIsLoggedIn, setIsLoading);
  };

  return (
    <>
      {!isLoggedIn && (
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
          <Button onPress={handleLogin} mode='contained-tonal'>
            Login
          </Button>
        </View>
      )}
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'lightblue',
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
});

export default LoginScreen;
