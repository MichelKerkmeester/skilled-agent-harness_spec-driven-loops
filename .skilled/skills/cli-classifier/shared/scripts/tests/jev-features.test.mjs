// ───────────────────────────────────────────────────────────────────
// MODULE: Jev Features Tests
// ───────────────────────────────────────────────────────────────────
// Every switch resolves in process against an injected environment or config.
// Readiness runs against a stub `jev` in a temp directory that records its
// argv. No test calls a real backend, opens a socket or needs a key.
// ───────────────────────────────────────────────────────────────────

// ───────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import os from 'node:os';
import path from 'node:path';
import process from 'node:process';
import { test } from 'node:test';

import * as F from '../jev-features.mjs';

// ───────────────────────────────────────────────────────────────────
// 2. FIXTURES
// ───────────────────────────────────────────────────────────────────

// Fresh temp directory whose name marks it as a fixture.
function tempDir(prefix) {
  return fs.mkdtempSync(path.join(os.tmpdir(), `jevfeatures-${prefix}-`));
}

// A stub `jev` the fixture PATH finds: it appends its argv to a log and exits
// with the code the test chose. Only `auth status` is ever run through it, so
// the recorded line is the proof a readiness check spawned.
function stubJev(root, exitCode) {
  const bin = path.join(root, 'bin');
  const log = path.join(root, 'jev.log');
  fs.mkdirSync(bin);
  fs.writeFileSync(
    path.join(bin, 'jev'),
    `#!/bin/sh\nprintf '%s\\n' "$*" >> '${log}'\nexit ${exitCode}\n`,
    { mode: 0o755 },
  );
  return { bin, log };
}

// The lines the stub recorded, and none until its first call.
function loggedCalls(logPath) {
  return fs.existsSync(logPath) ? fs.readFileSync(logPath, 'utf8') : '';
}

// ───────────────────────────────────────────────────────────────────
// 3. SWITCH RESOLUTION
// ───────────────────────────────────────────────────────────────────

test('unset_switches_leave_every_feature_enabled', () => {
  for (const name of Object.keys(F.FEATURES)) {
    assert.deepEqual(F.featureSwitch(name, {}, {}), { enabled: true, reason: 'on: default' }, name);
  }
});

test('registry_holds_exactly_the_four_proven_features', () => {
  assert.deepEqual(Object.keys(F.FEATURES).sort(), [
    'cite-drift',
    'hallucination-grader',
    'injection-screen',
    'verdict-fallback',
  ]);
});

test('master_switch_off_disables_every_feature', () => {
  for (const value of ['0', 'false', 'NO', 'off']) {
    for (const name of Object.keys(F.FEATURES)) {
      assert.deepEqual(
        F.featureSwitch(name, { JEV_FEATURES: value }, {}),
        { enabled: false, reason: 'off: JEV_FEATURES' },
        `${name} with ${value}`,
      );
    }
  }
});

test('master_switch_on_stays_enabled', () => {
  for (const value of ['1', 'true', 'YES', 'on']) {
    assert.deepEqual(
      F.featureSwitch('cite-drift', { JEV_FEATURES: value }, {}),
      { enabled: true, reason: 'on: default' },
      value,
    );
  }
});

test('isOff_accepts_only_the_off_spellings', () => {
  for (const value of ['0', 'false', 'no', 'off', ' OFF ', '  No ']) {
    assert.equal(F.isOff(value), true, value);
  }
  for (const value of ['', '   ', '1', 'true', 'yes', 'on', '2', 'nope', 'off-ish']) {
    assert.equal(F.isOff(value), false, value);
  }
  for (const value of [undefined, null, 0, false, 1, {}, [], ['0']]) {
    assert.equal(F.isOff(value), false, String(value));
  }
});

test('one_feature_switch_disables_only_that_feature', () => {
  const env = { JEV_FEATURE_INJECTION_SCREEN: '0' };
  assert.deepEqual(F.featureSwitch('injection-screen', env, {}), {
    enabled: false,
    reason: 'off: JEV_FEATURE_INJECTION_SCREEN',
  });
  for (const name of ['cite-drift', 'verdict-fallback', 'hallucination-grader']) {
    assert.equal(F.featureSwitch(name, env, {}).enabled, true, name);
  }
});

test('an_alias_disables_its_feature_only', () => {
  const env = { SKDOC_CITE_DRIFT_CHECK: '0' };
  assert.deepEqual(F.featureSwitch('cite-drift', env, {}), {
    enabled: false,
    reason: 'off: SKDOC_CITE_DRIFT_CHECK',
  });
  assert.equal(F.featureSwitch('verdict-fallback', env, {}).enabled, true);
});

test('config_disables_when_env_is_unset_and_env_overrides_config', () => {
  assert.deepEqual(F.featureSwitch('cite-drift', {}, { JEV_FEATURES: '0' }), {
    enabled: false,
    reason: 'off: JEV_FEATURES',
  });
  assert.equal(F.featureSwitch('cite-drift', { JEV_FEATURES: '1' }, { JEV_FEATURES: '0' }).enabled, true);
  assert.equal(
    F.featureSwitch('cite-drift', {}, { JEV_FEATURE_CITE_DRIFT: '0' }).enabled,
    false,
  );
  assert.equal(
    F.featureSwitch('cite-drift', { JEV_FEATURE_CITE_DRIFT: '1' }, { JEV_FEATURE_CITE_DRIFT: '0' }).enabled,
    true,
  );
});

test('config_file_is_read_when_config_is_omitted', () => {
  const root = tempDir('flags');
  const flagsPath = path.join(root, 'hook-flags.env');
  fs.writeFileSync(flagsPath, 'JEV_FEATURE_VERDICT_FALLBACK=0\n');
  const savedPath = process.env.HOOK_FLAGS_CONFIG;
  process.env.HOOK_FLAGS_CONFIG = flagsPath;
  try {
    assert.deepEqual(F.featureSwitch('verdict-fallback', {}), {
      enabled: false,
      reason: 'off: JEV_FEATURE_VERDICT_FALLBACK',
    });
    assert.equal(F.featureSwitch('cite-drift', {}).enabled, true);
    assert.equal(F.featureSwitch('verdict-fallback', { JEV_FEATURE_VERDICT_FALLBACK: '1' }).enabled, true);
  } finally {
    if (savedPath === undefined) delete process.env.HOOK_FLAGS_CONFIG;
    else process.env.HOOK_FLAGS_CONFIG = savedPath;
  }
});

test('unknown_feature_throws', () => {
  assert.throws(() => F.featureSwitch('not-a-feature', {}, {}), /unknown jev feature/);
});

// ───────────────────────────────────────────────────────────────────
// 4. READINESS
// ───────────────────────────────────────────────────────────────────

test('jevReady_reports_no_cli_on_path', () => {
  const root = tempDir('missing');
  assert.deepEqual(F.jevReady({ PATH: path.join(root, 'empty') }), {
    ready: false,
    reason: 'jev not on PATH',
    provider: 'official',
  });
});

test('jevReady_passes_when_the_stub_auth_exits_zero', () => {
  const root = tempDir('auth-ok');
  const { bin, log } = stubJev(root, 0);
  const result = F.jevReady({ PATH: bin, JEV_PROVIDER: 'openrouter' });
  assert.deepEqual(result, {
    ready: true,
    path: path.join(bin, 'jev'),
    provider: 'openrouter',
    reason: 'ready',
  });
  assert.equal(loggedCalls(log).trim(), 'auth status --provider openrouter');
});

test('jevReady_fails_when_the_stub_auth_exits_nonzero', () => {
  const root = tempDir('auth-fail');
  const { bin, log } = stubJev(root, 1);
  assert.deepEqual(F.jevReady({ PATH: bin }), {
    ready: false,
    path: path.join(bin, 'jev'),
    provider: 'official',
    reason: 'no stored credential',
  });
  assert.equal(loggedCalls(log).trim(), 'auth status --provider official');
});

// ───────────────────────────────────────────────────────────────────
// 5. FEATURE GATE
// ───────────────────────────────────────────────────────────────────

test('featureReady_returns_disabled_without_spawning', () => {
  const root = tempDir('off');
  const { bin, log } = stubJev(root, 0);
  assert.deepEqual(F.featureReady('verdict-fallback', { PATH: bin, JEV_FEATURES: '0' }, { config: {} }), {
    ready: false,
    name: 'verdict-fallback',
    reason: 'off: JEV_FEATURES',
  });
  assert.equal(loggedCalls(log), '');
});

test('featureReady_combines_the_switch_and_the_auth_check', () => {
  const root = tempDir('on');
  const { bin, log } = stubJev(root, 0);
  assert.deepEqual(F.featureReady('cite-drift', { PATH: bin }, { config: {} }), {
    ready: true,
    name: 'cite-drift',
    path: path.join(bin, 'jev'),
    provider: 'official',
    reason: 'ready',
  });
  assert.equal(loggedCalls(log).trim(), 'auth status --provider official');
});

test('featureReady_reports_an_enabled_feature_with_no_cli', () => {
  const root = tempDir('enabled-missing');
  assert.deepEqual(F.featureReady('cite-drift', { PATH: path.join(root, 'empty') }, { config: {} }), {
    ready: false,
    name: 'cite-drift',
    provider: 'official',
    reason: 'jev not on PATH',
  });
});

// ───────────────────────────────────────────────────────────────────
// 6. COMMONJS REACH
// ───────────────────────────────────────────────────────────────────

test('module_requires_from_commonjs', async () => {
  const require = createRequire(import.meta.url);
  const warnings = [];
  const onWarning = (warning) => warnings.push(warning);
  process.on('warning', onWarning);
  let required;
  try {
    required = require('../jev-features.mjs');
    await new Promise((resolve) => setImmediate(resolve));
  } finally {
    process.off('warning', onWarning);
  }

  assert.deepEqual(warnings, []);
  assert.deepEqual(Object.keys(required).sort(), [
    'FEATURES',
    'MASTER_SWITCH',
    'featureReady',
    'featureSwitch',
    'isOff',
    'jevReady',
  ]);
  assert.equal(required.MASTER_SWITCH, 'JEV_FEATURES');
  assert.equal(Object.isFrozen(required.FEATURES), true);
  assert.equal(Object.isFrozen(required.FEATURES['cite-drift'].aliases), true);
});
