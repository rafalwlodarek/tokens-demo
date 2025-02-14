const StyleDictionary = require("style-dictionary");

StyleDictionary.registerTransform({
  name: "custom/flatten",
  type: "attribute",
  matcher: () => true,
  transformer: (token) => ({
    type: token.$type,
    value: token.$value,
  }),
});

module.exports = {
  source: ["tokens/**/*.json"],
  platforms: {
    scss: {
      transformGroup: "scss",
      buildPath: "output/web/",
      transforms: ["custom/flatten"],
      files: [
        {
          destination: "_tokens.scss",
          format: "scss/variables",
        },
      ],
    },
    ios: {
      transformGroup: "ios",
      buildPath: "output/ios/",
      transforms: ["custom/flatten"],
      files: [
        {
          destination: "Tokens.swift",
          format: "ios-swift/any.swift",
        },
      ],
    },
    android: {
      transformGroup: "compose",
      buildPath: "output/compose/",
      transforms: ["custom/flatten"],
      files: [
        {
          destination: "Tokens.kt",
          format: "compose/object",
        },
      ],
    },
  },
};
