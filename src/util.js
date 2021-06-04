import path from "path";
import { spawnSync } from "child_process";
import which from "which";

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
  which.sync(name, {
    nothrow: true,
    path: [path.resolve("/usr/local/bin"), process.env.PATH].join(":"),
  })
);

const runCommand = (command) => spawnSync(command, [], { shell: true });

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
