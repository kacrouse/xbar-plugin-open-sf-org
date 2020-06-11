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

  let config;
  try {
    config = parse(fs.readFileSync(configPath, { encoding: "utf8" }));
  } catch (e) {
    console.error(`Error reading .bitbarrc: ${e.message || "Unknown error"}`);
  }

  return {
    ...defaultConfig,
    ...config.open_salesforce_org,
  };
};

export { loadConfig };
