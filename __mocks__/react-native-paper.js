const React = require('react');

const DefaultTheme = {
  colors: {
    primary: 'rgb(0, 122, 255)',
    background: 'rgb(242, 242, 242)',
    surface: 'rgb(255, 255, 255)',
    accent: 'rgb(255, 45, 85)',
    error: 'rgb(255, 59, 48)',
    text: 'rgb(0, 0, 0)',
    onSurface: 'rgb(0, 0, 0)',
    disabled: 'rgba(0, 0, 0, 0.26)',
    placeholder: 'rgba(0, 0, 0, 0.54)',
    backdrop: 'rgba(0, 0, 0, 0.5)',
    notification: 'rgb(255, 59, 48)',
    // Add any other default colors used in your app
  },
  // Add other theme properties as needed
};

const mockTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: 'rgba(66, 136, 202, 1)',
    primaryContainer: 'rgba(78, 149, 206, 1)',
    secondary: 'rgba(238, 40, 0, 1)',
    secondaryContainer: 'rgba(250, 48, 0, 1)',
    tertiary: 'rgba(238, 171, 0, 1)',
    tertiaryContainer: 'rgba(250, 179, 0, 1)',
    surface: 'rgba(84, 155, 208, 1)',
    surfaceVariant: 'rgba(78, 149, 206, 1)',
    surfaceDisabled: 'rgba(53, 123, 198, 0.2)',
    background: '#205B9E',
    error: 'rgba(238, 40, 0, 1)',
    errorContainer: 'rgba(250, 48, 0, 1)',
    outlineVariant: 'rgba(75, 145, 205, 0.8)',
    inversePrimary: 'rgba(75, 145, 205, 1)',
    shadow: 'rgba(0, 0, 0, 1)',
    scrim: 'rgba(0, 0, 0, 1)',
    backdrop: 'rgba(56, 126, 199, 0.4)',
    onPrimary: 'rgba(10, 10, 10, 1)',
    onPrimaryContainer: 'rgba(10, 10, 10, 1)',
    onSecondary: 'rgba(245, 245, 245, 1)',
    onSecondaryContainer: 'rgba(245, 245, 245, 1)',
    onTertiary: 'rgba(10, 10, 10, 1)',
    onTertiaryContainer: 'rgba(10, 10, 10, 1)',
    onSurface: 'rgba(10, 10, 10, 1)',
    onSurfaceVariant: 'rgba(22, 44, 66, 1)',
    onError: 'rgba(245, 245, 245, 1)',
    onBackground: 'rgba(10, 10, 10, 1)',
    onErrorContainer: 'rgba(245, 245, 245, 1)',
    inverseSurface: 'rgba(245, 245, 245, 1)',
    inverseOnSurface: 'rgba(10, 10, 10, 1)',
  },
};

const ThemeContext = React.createContext(mockTheme);

const PaperProvider = ({ theme, children }) => {
  return React.createElement(
    ThemeContext.Provider,
    { value: theme || mockTheme },
    children
  );
};

const useTheme = () => React.useContext(ThemeContext);

const Button = ({ children, ...props }) =>
  React.createElement('mockButton', props, children);
const TextInput = (props) => React.createElement('mockTextInput', props);

module.exports = {
  PaperProvider,
  Button,
  TextInput,
  useTheme,
  DefaultTheme,
  MD3Theme: DefaultTheme, // Add this if you're using MD3Theme in your app
};
