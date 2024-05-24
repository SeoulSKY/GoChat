// @ts-check
/* eslint-disable @typescript-eslint/naming-convention */

import stylistic from "@stylistic/eslint-plugin";

import eslint from "@eslint/js";
import tseslint from "typescript-eslint";

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...tseslint.configs.stylistic,
  {
    files: ["**/*.js", "**/*.jsx", "**/*.ts", "**/*.tsx"],
  },
  {
    ignores: ["node_modules", "dist", ".*"],
  },
  {
    plugins: {
      "@stylistic": stylistic,
    }
  },
  {
    rules: {
      semi: ["error", "always"],
      quotes: ["error", "double"],
      "@stylistic/jsx-quotes": ["error", "prefer-double"],
      indent: ["error", 2],
      "no-unused-vars": [
        "error",
        {
          argsIgnorePattern: "^_",
          varsIgnorePattern: "^_"
        }
      ],
      "@typescript-eslint/naming-convention": [
        "error",
        {
          selector: "parameter",
          format: ["camelCase"],
          leadingUnderscore: "allow"
        },
        {
          selector: "memberLike",
          format: ["camelCase"],
          leadingUnderscore: "allow"
        },
        {
          selector: "typeParameter",
          format: ["PascalCase"],
          prefix: ["T"]
        },
        {
          selector: "interface",
          format: ["PascalCase"],
        },
        {
          selector: "typeLike",
          format: ["PascalCase"]
        },
        {
          selector: "enumMember",
          format: ["UPPER_CASE"]
        }
      ],
      "camelcase": ["error", {properties: "always"}],
      "max-len": ["error", {code: 120}],
      "eol-last": ["error", "always"],
      "prefer-const": "error",
      "func-style": ["error", "declaration"],
      "prefer-arrow-callback": "error",
    }
  }
);
