import React from 'react';
import {
  render,
  screen,
  fireEvent,
  waitFor,
} from '@testing-library/react-native';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LoginScreen from '../LoginScreen';

// Mock the AuthContext
const mockSetIsLoggedIn = jest.fn();
jest.mock('../../contexts/AuthContext', () => ({
  useAuth: () => ({
    isLoggedIn: false,
    setIsLoggedIn: mockSetIsLoggedIn,
  }),
}));

// Mock the useLogin hook
const mockLoginMutate = jest.fn();
jest.mock('../../hooks/mutations', () => ({
  useLogin: () => ({
    mutate: mockLoginMutate,
    isLoading: false,
  }),
}));

// Create a wrapper component with QueryClientProvider
const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: false,
      },
    },
  });
  return ({ children }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('LoginScreen', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders correctly', () => {
    render(<LoginScreen />, { wrapper: createWrapper() });

    expect(screen.getByTestId('email-input')).toBeTruthy();
    expect(screen.getByTestId('password-input')).toBeTruthy();
    expect(screen.getByTestId('login-button')).toBeTruthy();
    expect(screen.getByTestId('signup-button')).toBeTruthy();
  });

  it('handles input changes', () => {
    render(<LoginScreen />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');

    expect(emailInput.props.value).toBe('test@example.com');
    expect(passwordInput.props.value).toBe('password123');
  });

  it('submits the form with correct data', async () => {
    render(<LoginScreen />, { wrapper: createWrapper() });

    const emailInput = screen.getByTestId('email-input');
    const passwordInput = screen.getByTestId('password-input');
    const loginButton = screen.getByTestId('login-button');

    fireEvent.changeText(emailInput, 'test@example.com');
    fireEvent.changeText(passwordInput, 'password123');
    fireEvent.press(loginButton);

    await waitFor(() => {
      expect(mockLoginMutate).toHaveBeenCalledWith({
        email: 'test@example.com',
        password: 'password123',
      });
    });
  });

  // Add more tests as needed
});
