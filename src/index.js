#!/usr/bin/env /usr/local/bin/node
import bitbar from "bitbar";
import templateImage from /* preval */ "./get-template-image";
import { findExecutable, runCommand } from "./util";

const sfdx = findExecutable("sfdx");
const orgListOutput = JSON.parse(runCommand(`${sfdx} force:org:list --json`));
const orgs = [
  ...orgListOutput.result.nonScratchOrgs,
  ...orgListOutput.result.scratchOrgs,
];

bitbar([
  {
    templateImage,
    text: "",
  },
  bitbar.separator,
  ...orgs.map((org) => ({
    text: org.alias,
    bash: sfdx,
    param1: "force:org:open",
    param2: "--targetusername",
    param3: org.username,
    terminal: false,
  })),
]);
