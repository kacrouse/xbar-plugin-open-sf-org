import { findExecutable, runCommand } from "./util";

const getOrgs = () => {
  const orgListOutput = JSON.parse(
    runCommand(`${findExecutable("sfdx")} force:org:list --json`)
  );
  if (orgListOutput.status && orgListOutput.status !== 0) {
    throw Error(
      "Error getting orgs through the Salesforce CLI. " +
        JSON.stringify(orgListOutput.result)
    );
  }
  return [
    ...orgListOutput.result.nonScratchOrgs,
    ...orgListOutput.result.scratchOrgs,
  ];
};

export { getOrgs };
