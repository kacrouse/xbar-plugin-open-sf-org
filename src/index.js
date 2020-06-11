#!/usr/bin/env /usr/local/bin/node
import bitbar from "bitbar";
import templateImage from /* preval */ "./get-template-image";
import { findExecutable, sortBy } from "./util";
import { getOrgs } from "./salesforce";
import { loadConfig } from "./config";

const sfdx = findExecutable("sfdx");
if (!sfdx) {
  console.error("Unable to find sfdx executable.");
}

let orgs = [];
try {
  orgs = getOrgs();
} catch (e) {
  console.error(e.message);
}

const { DEFAULT_PATH, paths } = loadConfig(process.env.HOME, {
  DEFAULT_PATH: "/",
  paths: {},
});

bitbar([
  {
    templateImage,
    text: "",
  },
  bitbar.separator,
  ...(orgs.length > 0
    ? sortBy(orgs, (o) => (o.alias || o.username).toLowerCase()).map(
        ({ alias, username }) => ({
          text: alias || username,
          bash: sfdx,
          param1: "force:org:open",
          param2: "--targetusername",
          param3: username,
          param4: "--path",
          param5: paths[alias] || paths[username] || DEFAULT_PATH,
          terminal: false,
        })
      )
    : [
        "No orgs found. To see orgs here, create or authenticate one with the Salesforce CLI.",
      ]),
]);
