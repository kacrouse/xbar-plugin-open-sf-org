#!/usr/bin/env /usr/local/bin/node
import bitbar from "bitbar";
import templateImage from /* preval */ "./get-template-image";
import { findExecutable, runCommand } from "./util";

const sfdx = findExecutable("sfdx");
const orgList = JSON.parse(runCommand(`${sfdx} force:org:list --json`));

const orgOption = (org) => ({
  text: org.alias,
  bash: sfdx,
  param1: "force:org:open",
  param2: "--targetusername",
  param3: org.username,
});

bitbar(
  [
    {
      templateImage,
      text: "",
    },
    bitbar.separator,
    ...orgList.result.nonScratchOrgs.map(orgOption),
    bitbar.separator,
    {
      text: "Scratch Orgs",
    },
    ...orgList.result.scratchOrgs.map(orgOption),
  ],
  { terminal: false }
);
