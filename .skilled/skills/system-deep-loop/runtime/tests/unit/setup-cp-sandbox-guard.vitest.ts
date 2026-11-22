// ───────────────────────────────────────────────────────────────────
// MODULE: Command Sandbox Setup Guard Tests
// ───────────────────────────────────────────────────────────────────
//
// Both command-flow sandbox setup scripts run `rm -rf` on the --sandbox-dir value, so the
// guard in front of it must refuse /tmp itself and any path that resolves outside /tmp.
// Every run puts logging stubs for rm, cp and ln first on PATH, and a mkdir stub that only
// creates directories under this test's scratch root, so a guard that wrongly accepts a
// value can never delete or write a real system path.

import { chmodSync, mkdirSync, mkdtempSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { spawnSync } from 'node:child_process';

import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { runtimeRoot } from '../helpers/spawn-cjs';

const skillRoot = resolve(runtimeRoot, '..');
const SETUP_SCRIPTS = [
  join(skillRoot, 'deep-research', 'manual-testing-playbook', 'command-flow-stress-tests', 'setup-cp-sandbox.sh'),
  join(skillRoot, 'deep-review', 'manual-testing-playbook', 'command-flow-stress-tests', 'setup-cp-sandbox.sh'),
];
const GUARD_REFUSAL_EXIT = 2;

let scratchReal = '';
let scratch = '';
let stubBin = '';
let callLog = '';
let outsideTarget = '';

// The guard accepts only paths spelled under /tmp, so the scratch root is named through
// /tmp even where the system temp dir reaches it through a link, as on macOS.
function scratchUnderTmp(): string {
  const tmpReal = realpathSync('/tmp');
  const base = realpathSync(tmpdir());
  const parent = base.startsWith(`${tmpReal}/`) ? `/tmp${base.slice(tmpReal.length)}` : '/tmp';
  return mkdtempSync(join(parent, 'cp-sandbox-guard-'));
}

function writeStub(name: string, body: string): void {
  const stubPath = join(stubBin, name);
  writeFileSync(stubPath, `#!/usr/bin/env bash\n${body}\n`, 'utf8');
  chmodSync(stubPath, 0o755);
}

function runSetup(script: string, sandboxDir: string) {
  writeFileSync(callLog, '', 'utf8');
  const result = spawnSync('bash', [script, '--sandbox-dir', sandboxDir], {
    encoding: 'utf8',
    env: { ...process.env, PATH: `${stubBin}:${process.env.PATH ?? ''}` },
  });
  const calls = readFileSync(callLog, 'utf8').split('\n').filter(Boolean);
  return { status: result.status, stderr: result.stderr, rmCalls: calls.filter((line) => line.startsWith('rm ')) };
}

beforeAll(() => {
  scratch = scratchUnderTmp();
  scratchReal = realpathSync(scratch);
  stubBin = join(scratchReal, 'stub-bin');
  callLog = join(scratchReal, 'calls.log');
  mkdirSync(stubBin);
  for (const name of ['rm', 'cp', 'ln']) writeStub(name, `echo "${name} $*" >> ${JSON.stringify(callLog)}`);
  writeStub('mkdir', [
    `echo "mkdir $*" >> ${JSON.stringify(callLog)}`,
    'for arg in "$@"; do',
    '  case "$arg" in',
    '    -*) ;;',
    `    ${JSON.stringify(scratch)}/*|${JSON.stringify(scratchReal)}/*) /bin/mkdir -p -- "$arg" ;;`,
    '  esac',
    'done',
  ].join('\n'));
  // A real directory outside /tmp for the symlink-escape cases. The rm stub never deletes it.
  outsideTarget = runtimeRoot;
  symlinkSync(outsideTarget, join(scratchReal, 'escape-link'));
});

afterAll(() => {
  if (scratchReal) rmSync(scratchReal, { recursive: true, force: true });
});

describe.each(SETUP_SCRIPTS)('sandbox dir guard in %s', (script) => {
  it('accepts a fresh child of a /tmp scratch dir and clears only that path', () => {
    const candidate = join(scratch, 'sandbox');
    const run = runSetup(script, candidate);
    expect(run.stderr).toBe('');
    expect(run.status).toBe(0);
    expect(run.rmCalls[0]).toBe(`rm -rf ${candidate}`);
  });

  it.each(['/tmp', '/tmp/', '/tmp//', '/tmp/./', '/tmp/.', '/tmp/..', '/tmp/../etc'])(
    'refuses %s before any rm runs',
    (candidate) => {
      const run = runSetup(script, candidate);
      expect(run.status).toBe(GUARD_REFUSAL_EXIT);
      expect(run.rmCalls).toEqual([]);
      expect(run.stderr).toMatch(/ERROR: sandbox dir/);
    },
  );

  it('refuses a symlink under /tmp that resolves outside it', () => {
    for (const candidate of [join(scratch, 'escape-link'), join(scratch, 'escape-link', 'sandbox')]) {
      const run = runSetup(script, candidate);
      expect(run.status).toBe(GUARD_REFUSAL_EXIT);
      expect(run.rmCalls).toEqual([]);
      expect(run.stderr).toMatch(/ERROR: sandbox dir must resolve inside \/tmp/);
    }
  });
});
