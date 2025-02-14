const StyleDictionary = require('style-dictionary');

// Register custom transform to flatten keys (removes $ prefix from type and value)
StyleDictionary.registerTransform({
  name: 'flatten/json',
  type: 'value',
  transformer: (token) => {
    const flattenedToken = {};
    for (let [key, value] of Object.entries(token)) {
      if (key.startsWith('$')) {
        flattenedToken[key.slice(1)] = value;
      } else {
        flattenedToken[key] = value;
      }
    }
    return flattenedToken;
  }
});

// Register SCSS specific transforms
StyleDictionary.registerTransform({
  name: 'name/cti/scss',
  type: 'name',
  transformer: (token) => {
    return `$${token.name.replace(/\./g, '-')}`; // SCSS variable format: $name
  }
});

// Register Compose specific transforms
StyleDictionary.registerTransform({
  name: 'name/cti/compose',
  type: 'name',
  transformer: (token) => {
    return token.name.replace(/\./g, '_'); // Compose uses underscores, no $
  }
});

// Register Swift specific transforms
StyleDictionary.registerTransform({
  name: 'name/cti/swift',
  type: 'name',
  transformer: (token) => {
    return token.name.charAt(0).toUpperCase() + token.name.slice(1).replace(/\./g, ''); // Swift format: camelCase
  }
});

// Custom Kotlin format for Compose
StyleDictionary.registerFormat({
  name: 'compose/kt',
  formatter: function({ dictionary }) {
    let output = '';
    dictionary.allProperties.forEach((token) => {
      const name = token.name.replace(/\./g, '_');
      output += `val ${name} = "${token.value}"\n`;
    });
    return output;
  },
});

// Configure Style Dictionary
module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    scss: {
      transformGroup: 'scss',
      transforms: [
        'flatten/json',
        'name/cti/scss',
        'color/css',
      ],
      buildPath: 'build/scss/',
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',
        },
      ],
    },
    compose: {
      transformGroup: 'compose',
      transforms: [
        'flatten/json',
        'name/cti/compose',
      ],
      buildPath: 'build/compose/',
      files: [
        {
          destination: 'tokens.kt',
          format: 'compose/kt',  // Now using the custom "compose/kt" format
        },
      ],
    },
    swift: {
      transformGroup: 'swift',
      transforms: [
        'flatten/json',
        'name/cti/swift',
        'color/hex',
      ],
      buildPath: 'build/swift/',
      files: [
        {
          destination: 'Tokens.swift',
          format: 'swift/enum',
        },
      ],
    },
  },
};
