import { DefaultTheme } from "react-native-paper";

export const customTheme = {
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
        background: 'rgba(84, 155, 208, 1)',
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
        onSurfaceVariant: 'rgba(10, 10, 10, 1)',

        onError: 'rgba(245, 245, 245, 1)',

        onBackground: 'rgba(10, 10, 10, 1)',

        onErrorContainer: 'rgba(245, 245, 245, 1)',
        inverseSurface: 'rgba(245, 245, 245, 1)',
        inverseOnSurface: 'rgba(10, 10, 10, 1)',
    },
};