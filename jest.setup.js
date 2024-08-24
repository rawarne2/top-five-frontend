jest.mock('./src/utils/secureStoreManager', () => ({
  getSecureStoreValue: jest.fn().mockResolvedValue('mocked_value'),
  saveToSecureStore: jest.fn().mockResolvedValue(undefined),
  deleteSecureStoreValue: jest.fn().mockResolvedValue(undefined),
  getSecureStoreUID: jest.fn().mockResolvedValue('123'),
  getFullNameFromSecureStore: jest.fn().mockResolvedValue('John Doe'),
  getEmailFromSecureStore: jest.fn().mockResolvedValue('john.doe@example.com'),
}));

jest.mock('expo-secure-store', () => ({
  setItemAsync: jest.fn(),
  getItemAsync: jest.fn(),
  deleteItemAsync: jest.fn(),
}));
