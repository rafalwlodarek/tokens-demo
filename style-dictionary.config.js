const StyleDictionary = require('style-dictionary');

// Register custom transforms
StyleDictionary.registerTransform({
  name: 'attribute/cti',
  type: 'name',
  transformer: (token) => `${token.name}`,
});

StyleDictionary.registerTransform({
  name: 'name/cti/pascal',
  type: 'name',
  transformer: (token) => `${token.name.replace(/-/g, '')}`, // Converts names like "some-name" to "SomeName"
});

StyleDictionary.registerTransform({
  name: 'color/UIColor',
  type: 'value',
  transformer: (token) => {
    // Example transformation for color value
    if (token.value.includes('rgba')) {
      return token.value.replace('rgba', 'UIColor').replace(')', ')');
    }
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'content/objC/literal',
  type: 'value',
  transformer: (token) => {
    return `"${token.value}"`; // Wrap values in double quotes for Objective-C literals
  },
});

StyleDictionary.registerTransform({
  name: 'asset/objC/literal',
  type: 'value',
  transformer: (token) => {
    return `"${token.value}"`; // Similar transformation for assets
  },
});

StyleDictionary.registerTransform({
  name: 'size/remToPt',
  type: 'value',
  transformer: (token) => {
    // Example transformation from rem to pt (1 rem = 16 pt)
    if (token.value.includes('rem')) {
      const valueInRem = parseFloat(token.value);
      return `${valueInRem * 16}pt`;
    }
    return token.value;
  },
});

StyleDictionary.registerTransform({
  name: 'font/objC/literal',
  type: 'value',
  transformer: (token) => {
    return `"${token.value}"`; // Wrap font values in double quotes for Objective-C literals
  },
});

// Configure the Style Dictionary build system
module.exports = {
  source: ['tokens/**/*.json'], // Include all token JSON files inside the 'tokens' directory
  platforms: {
    ios: {
      transformGroup: 'ios', // This is used to group your transforms and can be customized
      transforms: [
        'attribute/cti',           // Custom transform for attribute/cti
        'name/cti/pascal',         // Custom transform for name/cti/pascal
        'color/UIColor',           // Custom transform for color/UIColor
        'content/objC/literal',    // Custom transform for content/objC/literal
        'asset/objC/literal',      // Custom transform for asset/objC/literal
        'size/remToPt',            // Custom transform for size/remToPt
        'font/objC/literal',       // Custom transform for font/objC/literal
      ],
      buildPath: 'build/ios/', // Path where the generated files will be stored
      files: [
        {
          destination: 'tokens.json',  // Output file name
          format: 'json',              // Output format
        },
      ],
    },
  },
};
