module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module:react-native-dotenv',
        {
          moduleName: '@env',
          path: '.env',
          safe: false,
          allowUndefined: true,
        },
      ],
    ],
    env: {
      production: {
        plugins: ['react-native-paper/babel', 'react-native-reanimated/plugin'],
      },
    },
  };
};

// 'react-native-reanimated/plugin' has to be listed last
