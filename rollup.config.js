import { preserveShebangs } from "rollup-plugin-preserve-shebangs";
import nodeResolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import path from "path";
import babel from "@rollup/plugin-babel";
import builtinModules from "builtin-modules";
import fs from "fs";
import packageJson from "./package.json";

const render = (template, data) =>
  template.replace(/\{\{(.+)\}\}/g, (_, key) => data[key] || "");

export default {
  input: "src/index.js",
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
    {
      name: "bitbar-metadata-banner",
      banner: render(
        fs.readFileSync(path.resolve(__dirname, "bitbar-metadata.js"), {
          encoding: "utf8",
        }),
        {
          title: packageJson.bitbar.title,
          version: packageJson.version,
          author: packageJson.author,
          authorGithub: packageJson.bitbar.authorGithub,
          desc: packageJson.bitbar.desc,
          image: packageJson.bitbar.image,
          dependencies: packageJson.bitbar.dependencies,
          abouturl: packageJson.homepage,
        }
      ),
    },
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
