import { findExecutable, runCommand } from "./util";

const getOrgs = () => {
  const orgListOutput = JSON.parse(
    runCommand(`${findExecutable("sfdx")} force:org:list --json`)
  );
  return [
    ...orgListOutput.result.nonScratchOrgs,
    ...orgListOutput.result.scratchOrgs,
  ];
};

export { getOrgs };
