const StyleDictionary = require('style-dictionary');

// Register custom transform to flatten keys (removes $ prefix from type and value)
StyleDictionary.registerTransform({
  name: 'flatten/json',
  type: 'value',
  transformer: (token) => {
    // Remove $ from type and value keys and return the new structure
    const flattenedToken = {};
    for (let [key, value] of Object.entries(token)) {
      if (key.startsWith('$')) {
        flattenedToken[key.slice(1)] = value; // Remove the $ prefix
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

// Configure Style Dictionary
module.exports = {
  source: ['tokens/**/*.json'],  // Look for token files inside the tokens folder
  platforms: {
    scss: {
      transformGroup: 'scss',
      transforms: [
        'flatten/json',    // Flatten tokens (remove $ from type and value)
        'name/cti/scss',   // Format SCSS variables
        'color/css'        // Apply standard color transformation
      ],
      buildPath: 'build/scss/',  // Output path for SCSS files
      files: [
        {
          destination: '_variables.scss',
          format: 'scss/variables',  // Format as SCSS variables
        },
      ],
    },
    compose: {
      transformGroup: 'compose',
      transforms: [
        'flatten/json',        // Flatten tokens
        'name/cti/compose',    // Format Compose variable names
        'color/rgba'           // Apply standard color transformation for Compose
      ],
      buildPath: 'build/compose/',  // Output path for Compose files
      files: [
        {
          destination: 'tokens.kt',
          format: 'compose/kt',   // Format as Compose (Kotlin) file
        },
      ],
    },
    swift: {
      transformGroup: 'swift',
      transforms: [
        'flatten/json',        // Flatten tokens
        'name/cti/swift',      // Format Swift variable names
        'color/rgba'           // Apply standard color transformation for Swift
      ],
      buildPath: 'build/swift/',  // Output path for Swift files
      files: [
        {
          destination: 'Tokens.swift',
          format: 'swift/enum',    // Format as Swift Enum
        },
      ],
    },
  },
};
