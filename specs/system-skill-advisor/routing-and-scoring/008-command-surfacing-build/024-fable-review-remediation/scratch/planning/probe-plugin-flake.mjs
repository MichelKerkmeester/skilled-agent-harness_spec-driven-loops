// Run from the repository root: node <this file> [<runs>]
// Planning probe for the plugin test `termination grace stays inside the configured
// timeout budget`, which a worker saw fail once under load. It runs that one test the
// given number of times (default 20) with nothing else running beside it and prints the
// pass and fail counts and the slowest run. It starts no daemon and no model session
// and writes nothing.
import { spawnSync } from 'node:child_process';

const runs = Number(process.argv[2] ?? 20);
const env = { ...process.env };
delete env.AI_SESSION_CHILD;

let pass = 0;
let fail = 0;
let slowest = 0;
for (let index = 0; index < runs; index += 1) {
  const startedAt = Date.now();
  const result = spawnSync('node', [
    '--test',
    '--test-name-pattern',
    'termination grace stays inside the configured timeout budget',
    '.opencode/plugins/tests/system-skill-advisor.test.cjs',
  ], { encoding: 'utf8', env });
  slowest = Math.max(slowest, Date.now() - startedAt);
  // The reporter differs between Node versions, so the summary line is read in both
  // the TAP form and the spec form.
  const failed = /^(?:# |ℹ )fail (\d+)$/m.exec(result.stdout);
  if (result.status === 0 && failed !== null && failed[1] === '0') pass += 1;
  else {
    fail += 1;
    if (fail === 1) console.log(`first failing run, exit ${result.status}:\n${`${result.stdout}${result.stderr}`.split('\n').slice(-14).join('\n')}`);
  }
}
console.log(`termination grace test: ${pass} passed, ${fail} failed of ${runs} runs, slowest process ${slowest} ms`);
