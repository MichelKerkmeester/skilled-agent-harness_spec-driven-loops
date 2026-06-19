#!/usr/bin/env node
// Route `npm test -- --run ...` to the requested Vitest lane without running the full core suite first.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';

const args = process.argv.slice(2);
const vitestBin = fileURLToPath(new URL(`../node_modules/.bin/vitest${process.platform === 'win32' ? '.cmd' : ''}`, import.meta.url));
const laneSelectors = new Map([
  ['--security', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
  ['security', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
  ['redteam-probe-gate', ['run', 'tests/security/redteam-probe-gate.vitest.ts']],
]);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return result.status ?? 1;
}

const selectedLane = laneSelectors.get(args[0]);
if (selectedLane) {
  process.exit(run(vitestBin, [...selectedLane, ...args.slice(1)]));
}

if (args.length > 0) {
  process.exit(run(vitestBin, args));
}

let status = run('npm', ['run', 'test:core']);
if (status !== 0) {
  process.exit(status);
}

status = run('npm', ['run', 'test:file-watcher']);
if (status !== 0) {
  process.exit(status);
}

status = run('npm', ['run', 'test:spec-validation']);
process.exit(status);
