import test from "ava";
import { startCapture, parseParams, bitbarSpy } from "./helper/util";
import mockery from "mockery";
import decache from "decache";
import { promises as fs } from "fs";
import path from "path";
import tmp from "tmp-promise";

const MOCK_ORGS = [
  {
    username: "nonscratchorg@example.com",
    alias: "non-scratch-org",
  },
  {
    username: "scratchorg@example.com",
    alias: "scratch-org",
  },
];

test.before(() => {
  mockery.enable({ warnOnUnregistered: false });
});
test.beforeEach(() => {
  mockery.deregisterAll();
  decache("../src/index");
});
test.after(() => {
  mockery.disable();
});
test.serial("it prints the expected output", (t) => {
  t.plan(4 + MOCK_ORGS.length * 3);

  mockery.registerMock("./salesforce", { getOrgs: () => MOCK_ORGS });
  mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });
  const stdout = startCapture(process.stdout);
  const stderr = startCapture(process.stderr);

  // start test
  require("../src/index");
  // stop test

  const stderrOutput = stderr.stopCapture();
  t.is(stderrOutput, "", "nothing should have been output to stderr");
  const stdoutOutput = stdout.stopCapture();
  t.not(stdoutOutput, "", "something should have been written to stdout");

  const lines = stdoutOutput.split("\n");
  const [iconText, iconParams] = lines[0].split("|");
  t.is(iconText, "", "The icon should have no text with it");
  t.truthy(
    parseParams(iconParams).templateImage,
    "The template image should be populated with the base64 encoded icon"
  );

  MOCK_ORGS.forEach((org) => {
    const orgLine = lines.find((line) => line.startsWith(org.alias));
    t.truthy(orgLine, "Each org should be printed as an item");
    const [text, params] = orgLine.split("|");
    t.is(text, org.alias, "The org alias should be printed as the item text");
    t.is(
      parseParams(params).param3,
      org.username,
      "The item command should pass the org's username"
    );
  });
});

test.serial("it prints a message when there are no orgs", (t) => {
  t.plan(3);

  mockery.registerMock("./salesforce", { getOrgs: () => [] });
  mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });
  const stdout = startCapture(process.stdout);
  const stderr = startCapture(process.stderr);

  // start test
  require("../src/index");
  // stop test

  const stderrOutput = stderr.stopCapture();
  t.is(stderrOutput, "", "nothing should have been output to stderr");
  const stdoutOutput = stdout.stopCapture();
  t.not(stdoutOutput, "", "something should have been written to stdout");

  t.assert(
    stdoutOutput.toLowerCase().includes("no orgs found"),
    "when no orgs are found, a message that indicates such should be printed"
  );
});

test.serial("errors while getting orgs list are written to stderr", (t) => {
  t.plan(1);

  const errorMessage = "uh oh";

  mockery.registerMock("./salesforce", {
    getOrgs: () => {
      throw Error(errorMessage);
    },
  });
  mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });
  const stderr = startCapture(process.stderr);
  const stdout = startCapture(process.stdout);

  // start test
  require("../src/index");
  // stop test

  stdout.stopCapture();
  const stderrOutput = stderr.stopCapture();
  t.is(
    stderrOutput.trim(),
    errorMessage,
    "if an error occurs while getting the orgs list, the error message should be written to stderr"
  );
});

test.serial(
  "if a default path is specified in the bitbarrc, it should be used as the path for all orgs",
  async (t) => {
    t.plan(2 + MOCK_ORGS.length);

    const DEFAULT_PATH = "/path/to/somewhere";
    const testHome = (await tmp.dir()).path;
    process.env.HOME = testHome;
    await fs.appendFile(path.resolve(testHome, ".bitbarrc"), [
      "[open_salesforce_org]",
      `DEFAULT_PATH=${DEFAULT_PATH}`,
    ].join("\n"));
    
    const spy = bitbarSpy();
    mockery.registerMock("bitbar", spy);
    mockery.registerMock("./salesforce", { getOrgs: () => MOCK_ORGS });
    mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });

    // start test
    require("../src/index");
    // stop test

    t.is(spy.calls.length, 1, "bitbar should be called one time");
    const [, , ...actualOrgs] = spy.calls[0].items;
    t.is(
      actualOrgs.length,
      MOCK_ORGS.length,
      "each org should be listed as an item"
    );
    actualOrgs.forEach((org) =>
      t.is(org.param5, DEFAULT_PATH, "the path didn't match")
    );
  }
);

test.serial(
  "if a path is specified by alias for a specific org in the bitbarrc, it should be used as the path for that org",
  async (t) => {
    t.plan(3);

    const nonDefaultPathOrg = MOCK_ORGS[0];
    const orgPath = "/path/to/somewhere";

    const testHome = (await tmp.dir()).path;
    process.env.HOME = testHome;
    await fs.appendFile(path.resolve(testHome, ".bitbarrc"), [
      "[open_salesforce_org.paths]",
      `${nonDefaultPathOrg.alias}=${orgPath}`,
    ].join("\n"));

    const spy = bitbarSpy();
    mockery.registerMock("bitbar", spy);
    mockery.registerMock("./salesforce", {
      getOrgs: () => [nonDefaultPathOrg],
    });
    mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });

    // start test
    require("../src/index");
    // stop test

    t.is(spy.calls.length, 1, "bitbar should be called one time");
    const [, , ...actualOrgs] = spy.calls[0].items;
    t.is(actualOrgs.length, 1, "each org should be listed as an item");
    t.is(actualOrgs[0].param5, orgPath, "the path didn't match");
  }
);

test.serial(
  "if a path is specified by username for a specific org in the bitbarrc, it should be used as the path for that org",
  async (t) => {
    t.plan(3);

    const nonDefaultPathOrg = MOCK_ORGS[0];
    const orgPath = "/path/to/somewhere";

    const testHome = (await tmp.dir()).path;
    process.env.HOME = testHome;
    await fs.appendFile(path.resolve(testHome, ".bitbarrc"), [
      "[open_salesforce_org.paths]",
      `${nonDefaultPathOrg.username}=${orgPath}`,
    ].join("\n"));

    const spy = bitbarSpy();
    mockery.registerMock("bitbar", spy);
    mockery.registerMock("./salesforce", {
      getOrgs: () => [nonDefaultPathOrg],
    });
    mockery.registerMock("./util", { findExecutable: () => "path/to/sfdx" });

    // start test
    require("../src/index");
    // stop test

    t.is(spy.calls.length, 1, "bitbar should be called one time");
    const [, , ...actualOrgs] = spy.calls[0].items;
    t.is(actualOrgs.length, 1, "each org should be listed as an item");
    t.is(actualOrgs[0].param5, orgPath, "the path didn't match");
  }
);
