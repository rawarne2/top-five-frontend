import React from 'react';
import { View, StyleSheet, Image } from 'react-native';
import { Button, Text, TextInput, useTheme } from 'react-native-paper';
import { useForm, Controller } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { useLogin } from '../hooks/mutations';

function LoginScreen() {
  const theme = useTheme();
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const login = useLogin(useAuth);
  const onSubmit = async (data) => {
    await login.mutate({ email: data.email, password: data.password });
  };
  return (
    <View
      style={{
        marginTop: 40,
        paddingHorizontal: 20,
        flexDirection: 'column',
      }}
    >
      <Image
        source={require('../../assets/top5-logo.png')}
        style={styles.image}
      />
      <View style={styles.form}>
        <Controller
          control={control}
          rules={{
            required: 'Email is required',
            pattern: { value: /^\S+@\S+$/i, message: 'Invalid email' },
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                ...styles.input,
                borderBottomColor: theme.colors.secondary,
              }}
              placeholder='Email'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              autoCapitalize='none'
              keyboardType='email-address'
              error={!!errors.email}
              autoCorrect={false}
              textContentType='emailAddress'
              testID='email-input'
            />
          )}
          name='email'
          shouldUnregister
        />
        {errors.email && (
          <Text style={{ color: theme.colors.error }} testID='email-error'>
            {errors.email.message}
          </Text>
        )}
        <Controller
          control={control}
          rules={{
            required: 'Please enter your password',
          }}
          render={({ field: { onChange, onBlur, value } }) => (
            <TextInput
              style={{
                ...styles.input,
                borderBottomColor: theme.colors.secondary,
              }}
              placeholder='Password'
              onBlur={onBlur}
              onChangeText={onChange}
              value={value}
              secureTextEntry
              error={!!errors.password}
              autoCorrect={false}
              keyboardType='default'
              textContentType='password'
              testID='password-input'
            />
          )}
          name='password'
        />
        {errors.password && (
          <Text style={{ color: theme.colors.error }} testID='password-error'>
            {errors.password.message}
          </Text>
        )}
        <Button
          onPress={handleSubmit(onSubmit)}
          mode='contained-tonal'
          style={{
            marginTop: 8,
          }}
          testID='login-button'
        >
          {'Login'}
        </Button>
        <Button
          onPress={handleSubmit(() => console.log('signup'))}
          mode='contained-tonal'
          style={{
            marginVertical: 4,
          }}
          testID='signup-button'
        >
          {'Sign Up'}
        </Button>
      </View>
    </View>
  );
}
const styles = StyleSheet.create({
  container: {
    margin: 20,
    height: '100%',
  },
  scrollContainer: {
    flexDirection: 'column',
    justifyContent: 'flex-start',
  },
  scrollView: {
    paddingTop: 0,
  },
  form: {
    paddingBottom: 0,
  },
  image: {
    width: '100%',
    height: 240,
  },
  input: {
    height: 36,
    borderBottomWidth: 2,
    padding: 4,
    backgroundColor: 'white',
    marginBottom: 4,
  },
});

export default LoginScreen;
