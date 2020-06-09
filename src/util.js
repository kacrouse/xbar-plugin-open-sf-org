import path from "path";
import { execSync } from "child_process";

const findExecutable = (name) =>
  execSync(`which ${name}`, {
    env: {
      ...process.env,
      PATH: [path.resolve("/usr/local/bin"), process.env.PATH].join(":"),
    },
  })
    .toString()
    .trim();
const runCommand = (command) => execSync(command).toString();

export { findExecutable, runCommand };
