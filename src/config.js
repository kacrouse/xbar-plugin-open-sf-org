import fs from "fs";
import path from "path";
import { parse } from "ini";

const loadConfig = (homePath, defaultConfig) => {
  const configPath = path.resolve(homePath, ".bitbarrc");
  try {
    fs.accessSync(configPath, fs.constants.R_OK);
  } catch (e) {
    return defaultConfig;
  }
  const config = parse(fs.readFileSync(configPath, { encoding: "utf8" }));
  return {
    ...defaultConfig,
    ...config.salesforce_login,
  };
};

export { loadConfig };
