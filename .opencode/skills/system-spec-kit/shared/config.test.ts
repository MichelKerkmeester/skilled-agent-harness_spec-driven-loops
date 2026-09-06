// Script-style assertions for the shared config package root, mirroring the
// colocated *.test.ts convention in shared/parsing. Run directly (tsx/node
// type stripping); throws on the first failing assertion.
//
// The database directory must sit under the skill root, never under the shared
// package itself. The test harness overrides the directory through the
// environment, so the check runs in a child process with those variables
// removed.

import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SHARED_DIR = path.dirname(fileURLToPath(import.meta.url));
const SKILL_ROOT = path.resolve(SHARED_DIR, '..');

const env = { ...process.env };
delete env.SPEC_KIT_DB_DIR;
delete env.SPECKIT_DB_DIR;
delete env.MEMORY_DB_PATH;

const result = spawnSync(
  process.execPath,
  ['--import', 'tsx', '-e', "import('./config.ts').then((m) => process.stdout.write(m.DB_UPDATED_FILE))"],
  { cwd: SHARED_DIR, env, encoding: 'utf8' },
);
if (result.status !== 0) {
  throw new Error(`config probe failed: ${result.stderr}`);
}
const databaseDir = path.dirname(result.stdout.trim());
const expected = path.join(SKILL_ROOT, 'runtime', 'database');
if (databaseDir !== expected) {
  throw new Error(`DB_UPDATED_FILE dir failed: expected ${expected}, got ${databaseDir}`);
}
if (databaseDir.startsWith(path.join(SHARED_DIR, 'runtime'))) {
  throw new Error('database dir must not sit under the shared package');
}
process.stdout.write('config package root ok\n');
