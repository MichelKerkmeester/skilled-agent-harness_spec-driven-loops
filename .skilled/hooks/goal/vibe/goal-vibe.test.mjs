// ───────────────────────────────────────────────────────────────────
// MODULE: Goal-Vibe Tests
// ───────────────────────────────────────────────────────────────────
// Goal slice injection through the Vibe session_start hook, from a named or a
// handover-claimed packet, plus the no-packet and malformed-input fail-open paths

import { test } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { renderVibeGoalSlice } from './goal-inject.mjs';

const require = createRequire(import.meta.url);
const core = require('../lib/goal-core.cjs');

const __dirname = dirname(fileURLToPath(import.meta.url));
const REPO_ROOT = resolve(__dirname, '../../../..');
const HOOK_PATH = resolve(REPO_ROOT, '.skilled/hooks/session-lifecycle/vibe/session-start.mjs');
const GOAL_BIN = resolve(REPO_ROOT, '.skilled/hooks/goal/bin/goal.cjs');

// The hook resolves VIBE_SPEC_FOLDER against the checkout, so the fixture lives
// in the gitignored runtime state rather than in a real packet. A test that
// reads a live packet fails as soon as that packet's goal changes.
const FIXTURE_GOAL = [
  '---',
  'title: "Fixture packet"',
  '---',
  '<!-- ANCHOR:directive -->',
  '**Objective:** Ship the fixture.',
  '<!-- /ANCHOR:directive -->',
  '<!-- ANCHOR:completion -->',
  '- [ ] done',
  '<!-- /ANCHOR:completion -->',
  '<!-- ANCHOR:log -->',
  '| Item | State | Evidence |',
  '|---|---|---|',
  '<!-- /ANCHOR:log -->',
  '',
].join('\n');

/**
 * Builds a throwaway packet inside the checkout and returns its path relative
 * to the checkout, the form VIBE_SPEC_FOLDER carries.
 * @returns {{ root: string, packet: string }} The fixture root and packet path.
 */
function makeFixturePacket() {
  const stateDir = join(REPO_ROOT, '.skilled', 'skills', '.state');
  mkdirSync(stateDir, { recursive: true });
  const root = mkdtempSync(join(stateDir, 'goal-vibe-fixture-'));
  const packet = join('specs', 't', '001-fixture');
  mkdirSync(join(root, packet), { recursive: true });
  writeFileSync(join(root, packet, 'goal.md'), FIXTURE_GOAL, 'utf8');
  return { root, packet: relative(REPO_ROOT, join(root, packet)) };
}

// Only the goal part may contribute: the other three parts answer to these
// switches, so a stray warning can never mask the slice under test.
function hookEnv(overrides = {}) {
  return {
    ...process.env,
    SYSTEM_SESSION_LIFECYCLE_DISABLED: '1',
    SYSTEM_DIST_FRESHNESS_DISABLED: '1',
    SYSTEM_SESSION_CLEANUP_DISABLED: '1',
    ...overrides,
  };
}

function runHook(input, overrides = {}) {
  return spawnSync(process.execPath, [HOOK_PATH], {
    input,
    env: hookEnv(overrides),
    encoding: 'utf8',
  });
}

function payload() {
  return JSON.stringify({
    hook_event_name: 'session_start',
    session_id: 't',
    cwd: REPO_ROOT,
    source: 'startup',
  });
}

test('bound packet', () => {
  const { root, packet } = makeFixturePacket();
  try {
    const cli = spawnSync(
      process.execPath,
      [GOAL_BIN, 'packet', packet, '--workspace', REPO_ROOT],
      { cwd: REPO_ROOT, encoding: 'utf8' },
    );
    assert.equal(cli.status, 0, cli.stderr);

    const expected = core.describePacketGoal(packet, { workspace: REPO_ROOT }).chatSlice;
    assert.ok(expected, 'the fixture packet renders a non-empty chat slice');

    const result = runHook(payload(), { VIBE_SPEC_FOLDER: packet });
    assert.equal(result.status, 0);
    const response = JSON.parse(result.stdout);
    assert.equal(response.hook_specific_output.additional_context, expected);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('claimed packet', () => {
  const { root, packet } = makeFixturePacket();
  try {
    const expected = core.describePacketGoal(packet, { workspace: REPO_ROOT }).chatSlice;
    const env = hookEnv({ SESSION_HANDOVER_GOAL_PACKET: packet });
    delete env.VIBE_SPEC_FOLDER;

    const result = spawnSync(process.execPath, [HOOK_PATH], {
      input: payload(),
      env,
      encoding: 'utf8',
    });
    assert.equal(result.status, 0);
    const response = JSON.parse(result.stdout);
    assert.equal(response.hook_specific_output.additional_context, expected);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('named packet wins over a claimed one', () => {
  const asked = [];
  const stub = {
    describePacketGoal(packetPath) {
      asked.push(packetPath);
      return { chatSlice: packetPath };
    },
  };
  const slice = renderVibeGoalSlice({
    env: { VIBE_SPEC_FOLDER: 'specs/t/002-named', SESSION_HANDOVER_GOAL_PACKET: 'specs/t/001-claimed' },
    workspace: REPO_ROOT,
    core: stub,
  });
  assert.equal(slice, 'specs/t/002-named');
  assert.deepEqual(asked, ['specs/t/002-named']);
});

test('no packet', () => {
  const env = hookEnv();
  delete env.VIBE_SPEC_FOLDER;
  delete env.SESSION_HANDOVER_GOAL_PACKET;

  const result = spawnSync(process.execPath, [HOOK_PATH], {
    input: payload(),
    env,
    encoding: 'utf8',
  });
  assert.equal(result.status, 0);
  assert.ok(!result.stdout.includes('# Goal:'));
});

test('malformed input', () => {
  const result = runHook('not json{');
  assert.equal(result.status, 0);
  assert.equal(result.stdout, '');
});
