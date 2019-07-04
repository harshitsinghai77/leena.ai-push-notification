module.exports = {
  "extends": "airbnb",
  "parser": "babel-eslint",
  "parserOptions": {
    "ecmaFeatures": {
      "jsx": true
    }
  },
  "ecmaFeatures": {
    "jsx": true
  },
  "plugins": [
    "react"
  ],
  "rules":{
    "global-require": 2,
    "jsx-a11y/anchor-is-valid": 1,
    "jsx-a11y/media-has-caption": 1,
    "jsx-a11y/label-has-associated-control": 0,
    "jsx-a11y/label-has-for": 0,
    "max-len": 1,
    "no-dupe-keys": 2, // Duplicate keys in objects need to throw error.
    "no-else-return": 2, // If an if block contains a return statement, the else block becomes unnecessary.
    "no-fallthrough": 2, // Case should always throw, return or break;
    "no-unused-expressions": [2, {"allowShortCircuit" :true}], // un used expressions needs to throw errors
    "no-underscore-dangle": 0,
    "no-unused-vars": [2, { "vars": "local", "args": "after-used", "ignoreRestSiblings": true }],
    "object-curly-newline": 0,
    "react/no-did-update-set-state": 2,
    "react/prop-types": 0,
    "react/jsx-filename-extension": [1, { "extensions": [".js", ".jsx"] }],
    "react/destructuring-assignment": 0,
  }
};
