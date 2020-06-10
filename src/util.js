import path from "path";
import { execSync } from "child_process";

const simpleCache = (getValue, cache = {}) => (key) => {
  let result = cache[key];
  if (!result) {
    result = getValue(key);
    cache[key] = result;
  }
  return result;
};

const findExecutable = simpleCache((name) =>
  execSync(`which ${name}`, {
    env: {
      ...process.env,
      PATH: [path.resolve("/usr/local/bin"), process.env.PATH].join(":"),
    },
  })
    .toString()
    .trim()
);

const runCommand = (command) => execSync(command).toString();

export { findExecutable, runCommand };
