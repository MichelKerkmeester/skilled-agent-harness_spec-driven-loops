// Run the binary we actually ship for this machine.
//
// Every release publishes eight native packages, and until now three of them
// -- linux-arm64-gnu, linux-arm64-musl and win32-arm64 -- had never executed
// anywhere but the cross-compiler that produced them. This installs the
// latest published `supercov` from npm the way a user does, checks that the
// native package the launcher chose is the one this platform is supposed to
// get, and measures a real project with it. Run on each runner and container
// the release set covers, that is the whole set, executed.
import assert from 'node:assert/strict';
import { cpSync, mkdtempSync, readdirSync, realpathSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

const repository = resolve(import.meta.dirname, '..');
const expected = process.env.SUPERCOV_EXPECTED_NATIVE;
assert.ok(expected, 'SUPERCOV_EXPECTED_NATIVE names the native package this platform must receive, e.g. cli-linux-arm64-musl');

function run(program, args, options = {}) {
  // npm is a batch shim on Windows; a shell finds it either way.
  const result = spawnSync(program, args, { encoding: 'utf8', shell: process.platform === 'win32', ...options });
  if (result.error) throw result.error;
  assert.equal(result.status, 0, `${program} ${args.join(' ')} exited ${result.status}\n${result.stdout}\n${result.stderr}`);
  return result;
}

const temporary = mkdtempSync(resolve(realpathSync.native(tmpdir()), 'supercov-released-'));
try {
  const version = process.env.SUPERCOV_RELEASED_VERSION ?? run('npm', ['view', 'supercov', 'version']).stdout.trim();
  assert.match(version, /^\d+\.\d+\.\d+$/, `npm view supercov version: ${version}`);

  const project = resolve(temporary, 'project');
  cpSync(resolve(repository, 'tests/fixtures/no-build-node'), project, { recursive: true });
  run('npm', ['install', `supercov@${version}`, '--loglevel=error', '--no-fund', '--no-audit'], { cwd: project });

  const natives = readdirSync(resolve(project, 'node_modules/@supercov')).sort();
  assert.deepEqual(natives, [expected], `the launcher installed ${natives.join(', ')}; this platform ships ${expected}`);

  const launcher = resolve(project, 'node_modules/supercov/bin/supercov.js');
  const reported = run(process.execPath, [launcher, '--version'], { cwd: project, shell: false }).stdout.trim();
  assert.match(reported, new RegExp(`^supercov ${version.replaceAll('.', '\\.')}\\b`), reported);

  const measured = run(process.execPath, [launcher, '--', 'npm', 'test'], { cwd: project, shell: false });
  assert.match(measured.stdout + measured.stderr, /\[coverage\] evidence:/, measured.stdout + measured.stderr);
  const summary = run(process.execPath, [launcher, 'runs', 'latest', 'summary', '--json'], { cwd: project, shell: false });
  const payload = JSON.parse(summary.stdout);
  assert.equal(payload.ok, true, summary.stdout);
  assert.ok(payload.data.coverage.lines.covered > 0, JSON.stringify(payload.data.coverage));

  console.log(`[released-binary] ${process.platform}/${process.arch}: supercov@${version} ran through @supercov/${expected} and measured a real project`);
} finally {
  rmSync(temporary, { recursive: true, force: true, maxRetries: 10, retryDelay: 20 });
}
