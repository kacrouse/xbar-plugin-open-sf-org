import { findExecutable, runCommand } from "./util";

const getOrgs = () => {
  const commandResult = runCommand(
    `${findExecutable("sfdx")} force:org:list --json`
  );
  const stdout = commandResult.stdout.toString();
  const stderr = commandResult.stderr.toString();
  if (!stdout && stderr) {
    throw Error(stderr);
  }
  const orgListOutput = JSON.parse(stdout);
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
