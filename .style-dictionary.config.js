const StyleDictionary = require('style-dictionary');

StyleDictionary.registerFormat({
  name: 'compose/variables',
  formatter: ({ dictionary, file }) => {
    return `${dictionary.allTokens.map(token => `val ${token.name} = ${token.value}`).join('\n')}`;
  }
});

StyleDictionary.registerFormat({
  name: 'swiftui/variables',
  formatter: ({ dictionary, file }) => {
    return `${dictionary.allTokens.map(token => `static let ${token.name} = ${token.value}`).join('\n')}`;
  }
});

StyleDictionary.registerTransform({
  name: 'size/pxToDp',
  type: 'value',
  matcher: token => token.unit === 'pixel',
  transformer: token => {
    return `${parseFloat(token.value) * 0.75}dp`;
  }
});

module.exports = {
  source: ['tokens/**/*.json'],
  platforms: {
    compose: {
      transforms: ['attribute/cti', 'name/cti/camel', 'size/pxToDp'],
      buildPath: 'build/compose/',
      files: [{
        destination: 'Variables.kt',
        format: 'compose/variables'
      }]
    },
    swiftui: {
      transforms: ['attribute/cti', 'name/cti/camel'],
      buildPath: 'build/swiftui/',
      files: [{
        destination: 'Variables.swift',
        format: 'swiftui/variables'
      }]
    },
    scss: {
      transforms: ['attribute/cti', 'name/cti/kebab', 'size/pxToDp'],
      buildPath: 'build/scss/',
      files: [{
        destination: 'variables.scss',
        format: 'scss/variables'
      }]
    }
  }
};
