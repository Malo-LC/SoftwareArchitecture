module.exports = {
  extends: ["semistandard"],

  rules: {
    "no-console": "off",
    quotes: ["error", "double"],
    indent: ["error", 2],
    semi: ["error", "always"],
    "comma-dangle": ["error", "always-multiline"],
    "space-before-function-paren": [
      "error",
      {
        anonymous: "always",
        named: "never",
        asyncArrow: "always",
      },
    ],
  },
};
