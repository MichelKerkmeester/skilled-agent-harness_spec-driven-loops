#!/usr/bin/env node
// Route `npm test -- --run ...` to the requested Vitest lane without running the full core suite first.
import { spawnSync } from 'node:child_process';

const args = process.argv.slice(2);

function run(command, commandArgs) {
  const result = spawnSync(command, commandArgs, {
    stdio: 'inherit',
    shell: process.platform === 'win32',
  });
  return result.status ?? 1;
}

if (args.length > 0) {
  process.exit(run('vitest', args));
}

let status = run('npm', ['run', 'test:core']);
if (status !== 0) {
  process.exit(status);
}

status = run('npm', ['run', 'test:file-watcher']);
process.exit(status);
