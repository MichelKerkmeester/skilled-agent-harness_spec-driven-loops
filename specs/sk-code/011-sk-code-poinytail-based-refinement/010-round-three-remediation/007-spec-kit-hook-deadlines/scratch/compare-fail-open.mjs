// Runs every hook entry with an empty stdin and with invalid JSON, and compares
// each exit code and stdout with the answers recorded on the unedited tree.
// Usage from the repository root:
//   node <folder>/scratch/compare-fail-open.mjs           compare with the record
//   node <folder>/scratch/compare-fail-open.mjs --record  write the record
import { spawn } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const HERE = path.dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = path.resolve(HERE, '..', '..', '..', '..', '..', '..');
const RUNTIME = path.join(REPO_ROOT, '.skilled', 'skills', 'system-spec-kit', 'runtime');
const RECORD = path.join(HERE, 'baseline', 'fail-open-before.json');
const ENTRIES = [
  'hooks/claude/completion-evidence-stop.cjs', 'hooks/codex/completion-evidence-stop.cjs',
  'hooks/devin/completion-evidence-stop.cjs', 'hooks/devin/post-compaction.cjs',
  'hooks/devin/permission-request-policy.mjs', 'hooks/cursor/post-tool-use.mjs',
  'hooks/cursor/spec-gate-prebind.mjs', 'hooks/cursor/completion-evidence-response.mjs',
  'hooks/claude/spec-gate-enforce.mjs', 'hooks/codex/spec-gate-enforce.mjs',
  'hooks/cursor/spec-gate-enforce.mjs', 'hooks/devin/spec-gate-enforce.mjs',
  'hooks/claude/spec-gate-classify.mjs', 'hooks/codex/spec-gate-classify.mjs',
  'hooks/cursor/spec-gate-classify.mjs', 'hooks/devin/spec-gate-classify.mjs',
  'dist/hooks/claude/compact-inject.js', 'dist/hooks/claude/compact-inject.js --authored-snapshot-worker',
  'dist/hooks/claude/session-prime.js', 'dist/hooks/claude/session-stop.js',
  'dist/hooks/claude/directive-lifecycle-boundary.js',
  'dist/hooks/codex/session-start.js', 'dist/hooks/codex/session-stop.js',
  'dist/hooks/codex/user-prompt-submit.js', 'dist/hooks/codex/compact-inject.js',
  'dist/hooks/cursor/session-start.js', 'dist/hooks/cursor/session-end.js',
  'dist/hooks/cursor/user-prompt-submit.js', 'dist/hooks/cursor/precompact.js',
  'dist/hooks/devin/session-start.js', 'dist/hooks/devin/session-stop.js',
  'dist/hooks/devin/user-prompt-submit.js',
];
const INPUTS = { empty: '', invalid: '{not-json' };

function hookEnv() {
  const env = { ...process.env };
  for (const name of Object.keys(env)) if (name.endsWith('_DISABLED')) delete env[name];
  delete env.SPECKIT_DIRECTIVE_LIFECYCLE_BOUNDARY_TARGET;
  return { ...env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'hook-stdin-deadline-absent.env') };
}

function run(entry, input) {
  const [file, ...args] = entry.split(' ');
  return new Promise((resolve) => {
    const child = spawn(process.execPath, [path.join(RUNTIME, file), ...args], {
      cwd: REPO_ROOT, env: hookEnv(), stdio: ['pipe', 'pipe', 'ignore'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    child.stdin.on('error', () => {});
    child.stdin.end(input);
    const killer = setTimeout(() => child.kill('SIGKILL'), 15000);
    child.on('close', (code, signal) => { clearTimeout(killer); resolve({ code, signal, stdout: stdout.trim() }); });
  });
}

const results = {};
for (const [name, input] of Object.entries(INPUTS)) {
  const answers = await Promise.all(ENTRIES.map((entry) => run(entry, input)));
  ENTRIES.forEach((entry, index) => { results[`${name} ${entry}`] = answers[index]; });
}

if (process.argv.includes('--record')) {
  fs.mkdirSync(path.dirname(RECORD), { recursive: true });
  fs.writeFileSync(RECORD, `${JSON.stringify(results, null, 2)}\n`);
  console.log(`recorded=${Object.keys(results).length}`);
} else {
  const before = JSON.parse(fs.readFileSync(RECORD, 'utf8'));
  let mismatches = 0;
  for (const [key, value] of Object.entries(before)) {
    const same = JSON.stringify(value) === JSON.stringify(results[key]);
    if (!same) {
      mismatches += 1;
      console.log(`DIFF ${key} before=${JSON.stringify(value)} after=${JSON.stringify(results[key])}`);
    }
  }
  console.log(`cases=${Object.keys(before).length} mismatches=${mismatches}`);
  process.exitCode = mismatches === 0 ? 0 : 1;
}
