import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import babel from "@rollup/plugin-babel";
import builtinModules from "builtin-modules";

export default {
  input: "index.js",
  output: {
    file: "dist/salesforce-login.1h.js",
    format: "cjs",
  },
  plugins: [
    preserveShebangs(),
    nodeResolve(),
    commonjs(),
    {
      name: "section-labels",
      transform: (code, id) =>
        [
          flowerBox(path.relative(__dirname, removeNonPrintableChars(id))),
          code,
        ].join("\n"),
    },
    babel({ babelHelpers: "bundled" }),
  ],
  external: builtinModules,
};

const flowerBox = (content) => {
  const flowers = (length) => Array(length).fill("*").join("");
  return [
    `/${flowers(content.length + 6)}`,
    ` *  ${content}  *`,
    ` ${flowers(content.length + 6)}/`,
  ].join("\n");
};

const removeNonPrintableChars = (value) =>
  value
    .split("")
    .map((char) => char.charCodeAt(0))
    .filter((code) => code > 31)
    .map((code) => String.fromCharCode(code))
    .join("");
