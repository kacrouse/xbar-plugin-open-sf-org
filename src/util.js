import path from "path";
import { spawnSync } from "child_process";

const simpleCache =
  (getValue, cache = {}) =>
  (key) => {
    let result = cache[key];
    if (!result) {
      result = getValue(key);
      cache[key] = result;
    }
    return result;
  };

const findExecutable = simpleCache((name) =>
  spawnSync(`which ${name}`, [], {
    shell: true,
    env: {
      ...process.env,
      PATH: [path.resolve("/usr/local/bin"), process.env.PATH].join(":"),
    },
  })
    .stdout?.toString()
    .trim()
);

const runCommand = (command) =>
  spawnSync(command, [], { shell: true }).stdout?.toString();

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
