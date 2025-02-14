const StyleDictionary = require('style-dictionary');

// ✅ Register a custom format for Compose (Jetpack Compose)
StyleDictionary.registerFormat({
  name: 'compose-kotlin',
  formatter: function({ dictionary }) {
    return `// Generated Compose Tokens\n\n` +
      `package com.example.tokens\n\n` +
      `object Tokens {\n` +
      dictionary.allProperties
        .map(prop => `    val ${prop.name.replace(/ /g, '_')} = "${prop.value}"`)
        .join('\n') +
      `\n}`;
  }
});

// ✅ Register a custom format for SCSS (ensures valid output)
StyleDictionary.registerFormat({
  name: 'custom-scss',
  formatter: function({ dictionary }) {
    return `// Generated SCSS Tokens\n\n` +
      dictionary.allProperties
        .map(prop => `$${prop.name.replace(/\./g, '-')} : ${prop.value};`)
        .join('\n');
  }
});

// ✅ Transform to extract `$value`
StyleDictionary.registerTransform({
  name: 'custom/flatten',
  type: 'value',
  matcher: function(token) {
    return token.hasOwnProperty('$value');
  },
  transformer: function(token) {
    return token.$value;
  }
});

// ✅ Define the Style Dictionary configuration
module.exports = {
  source: ['tokens/**/*.json'],
  transform: ['custom/flatten'],
  platforms: {
    ios: {
      transformGroup: 'ios',
      buildPath: 'output/ios/',
      files: [
        {
          destination: 'Tokens.swift',
          format: 'ios-swift',
        }
      ]
    },
    android: {
      transformGroup: 'android',
      buildPath: 'output/android/',
      files: [
        {
          destination: 'Tokens.kt',
          format: 'compose-kotlin', // 👈 Generates Compose tokens in Kotlin
        }
      ]
    },
    scss: {
      transformGroup: 'scss',
      buildPath: 'output/web/',
      files: [
        {
          destination: '_tokens.scss',
          format: 'custom-scss', // 👈 Generates valid SCSS variables
        }
      ]
    }
  }
};
