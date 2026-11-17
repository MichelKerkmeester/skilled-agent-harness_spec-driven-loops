import { pathToFileURL } from 'node:url';
const mod = await import(pathToFileURL(process.cwd() + '/.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts').href);
const rows = [
  ['refactor the parser so there are no changes to its public api', false],
  ['fix the flaky test and make sure there are no changes in behaviour', false],
  ['create an agent called invoice-parser with no changes to existing agents', false],
  ['show me the plan and make no changes to the files', true],
  ['refactor the parser and make no changes to its public api', true],
];
for (const [p, expected] of rows) {
  const actual = mod.isNoEditRequest(p);
  console.log(JSON.stringify({ prompt: p, expected, actual, pinnedRowHolds: actual === expected }));
}
