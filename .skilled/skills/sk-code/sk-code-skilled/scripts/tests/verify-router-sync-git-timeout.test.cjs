// ───────────────────────────────────────────────────────────────────
// MODULE: Router-sync guard, git check-ignore timeout tests
// ───────────────────────────────────────────────────────────────────
'use strict';

// Drives leg 1b of verify-router-sync.cjs against a throwaway hub with a stub git first on PATH,
// so a wedged check-ignore is bounded and the guarded invocation can be inspected.
// Run from the repository root:
//   node --test .skilled/skills/sk-code/sk-code-skilled/scripts/tests/verify-router-sync-git-timeout.test.cjs

const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const { spawnSync } = require('node:child_process');

const SCRIPTS = path.resolve(__dirname, '..', '..', 'assets', 'scripts');
const LIVE_SKILLS = path.resolve(__dirname, '..', '..', '..', '..');
const CONTRACT = path.join('sk-doc', 'sk-create-skill', 'scripts', 'lib', 'leaf-resource-contract.cjs');

function write(file, text) {
  fs.mkdirSync(path.dirname(file), { recursive: true });
  fs.writeFileSync(file, text);
}

// The guard resolves the hub from its own location, so it runs from a copy placed where a real
// one would sit. The hub has one packet whose router names one reference.
function buildHub(t) {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), 'router-sync-'));
  t.after(() => fs.rmSync(root, { recursive: true, force: true }));
  const skills = path.join(root, '.skilled', 'skills');
  const hub = path.join(skills, 'sk-code');
  const scripts = path.join(hub, 'sk-code-skilled', 'assets', 'scripts');
  fs.mkdirSync(scripts, { recursive: true });
  for (const name of ['verify-router-sync.cjs', 'router-replay-lib.cjs']) {
    fs.copyFileSync(path.join(SCRIPTS, name), path.join(scripts, name));
  }
  write(path.join(skills, CONTRACT), fs.readFileSync(path.join(LIVE_SKILLS, CONTRACT), 'utf8'));
  write(path.join(hub, 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["sk-code-demo/references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'SKILL.md'), 'RESOURCE_MAP = {\n  "DEMO": ["references/routed.md"],\n}\n');
  write(path.join(hub, 'sk-code-demo', 'references', 'routed.md'), '# routed\n');
  return { root, hub, guard: path.join(scripts, 'verify-router-sync.cjs') };
}

// The stub records every invocation, hangs on check-ignore and delegates anything else to the
// real git, which the caller locates before prepending this directory to PATH.
function writeStubGit(dir) {
  const stub = path.join(dir, 'git');
  write(stub, [
    '#!/bin/sh',
    'printf \'%s\\n\' "$*" >> "$STUB_LOG"',
    'case " $* " in',
    '  *" check-ignore "*) exec sleep 60 ;;',
    'esac',
    'exec "$REAL_GIT" "$@"',
    '',
  ].join('\n'));
  fs.chmodSync(stub, 0o755);
}

test('leg 1b bounds a wedged check-ignore and disables fsmonitor', (t) => {
  const { root, guard } = buildHub(t);
  const bin = path.join(root, 'stub-bin');
  const log = path.join(root, 'git-argv.log');
  fs.mkdirSync(bin);
  writeStubGit(bin);
  const probe = spawnSync('sh', ['-c', 'command -v git'], { encoding: 'utf8' });
  const realGit = (probe.stdout || '').trim();
  assert.ok(realGit, 'real git not found on PATH');

  const started = Date.now();
  const run = spawnSync(process.execPath, [guard, '--checks', '1b'], {
    encoding: 'utf8',
    timeout: 30000,
    env: {
      ...process.env,
      PATH: `${bin}${path.delimiter}${process.env.PATH || ''}`,
      REAL_GIT: realGit,
      STUB_LOG: log,
    },
  });
  const elapsed = Date.now() - started;

  assert.equal(run.status, 0, run.stdout + run.stderr);
  assert.ok(elapsed < 25000, `guard took ${elapsed}ms, expected under 25000ms`);
  const calls = fs.existsSync(log) ? fs.readFileSync(log, 'utf8').split('\n').filter(Boolean) : [];
  const checkIgnore = calls.find((line) => line.includes('check-ignore'));
  assert.ok(checkIgnore, `no check-ignore call logged: ${JSON.stringify(calls)}`);
  assert.ok(checkIgnore.includes('-c core.fsmonitor=false'), `check-ignore argv lacks -c core.fsmonitor=false: ${checkIgnore}`);
});
