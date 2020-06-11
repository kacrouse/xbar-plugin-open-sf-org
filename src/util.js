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

const sortBy = (items, identity) => {
  return items.sort((value, other) => {
    const valueId = identity(value);
    const otherId = identity(other);
    if (valueId > otherId) {
      return 1;
    }
    if (valueId < otherId) {
      return -1;
    }
    return 0;
  });
};

export { findExecutable, runCommand, sortBy };
