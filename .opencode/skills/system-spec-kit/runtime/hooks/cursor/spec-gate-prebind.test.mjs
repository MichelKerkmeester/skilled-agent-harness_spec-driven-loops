// ───────────────────────────────────────────────────────────────────
// MODULE: Cursor SessionStart Gate-3 Prebind Hook Tests
// ───────────────────────────────────────────────────────────────────
// STATUS: process-level regression coverage for spec-gate-prebind.mjs and its
// downstream interaction with spec-gate-enforce.mjs, across disabled/child/
// malformed/declared-folder/whitespace-root/padded-session-id cases.

// ─────────────────────────────────────────────────────────────────────────────
// 1. IMPORTS
// ─────────────────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  realpathSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

// ─────────────────────────────────────────────────────────────────────────────
// 2. CONSTANTS
// ─────────────────────────────────────────────────────────────────────────────

const PREBIND_HOOK_PATH = fileURLToPath(new URL('./spec-gate-prebind.mjs', import.meta.url));
const ENFORCE_HOOK_PATH = fileURLToPath(new URL('./spec-gate-enforce.mjs', import.meta.url));

// ─────────────────────────────────────────────────────────────────────────────
// 3. TEST FIXTURES
// ─────────────────────────────────────────────────────────────────────────────

function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'cursor-spec-gate-prebind-'));
  const folderRel = '.opencode/specs/999-test-folder';
  const folderAbs = join(root, folderRel);
  mkdirSync(folderAbs, { recursive: true });
  writeFileSync(join(folderAbs, 'spec.md'), '# Test Spec\n\n| **Status** | Active |\n');
  writeFileSync(join(folderAbs, 'description.json'), '{}\n');
  writeFileSync(join(folderAbs, 'graph-metadata.json'), '{}\n');
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'src', 'app.js'), '// test target\n');
  return { root, folderAbs, folderRel };
}

function isolatedEnv(overrides = {}) {
  const env = { ...process.env };
  delete env.MK_SPEC_FOLDER;
  delete env[guardCore.DISABLED_ENV];
  delete env[guardCore.ENFORCE_ENV];
  delete env[guardCore.CHILD_SESSION_ENV];
  return { ...env, ...overrides };
}

function runHook(hookPath, root, payload, env = {}) {
  return spawnSync(process.execPath, [hookPath], {
    cwd: root,
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
    encoding: 'utf8',
    env: isolatedEnv(env),
  });
}

function sessionPayload(root, sessionID = 'cursor-session') {
  return { session_id: sessionID, workspace_roots: [root] };
}

function statePath(root, sessionID) {
  const { stateDir } = guardCore.resolveGuardPaths(root);
  return join(stateDir, `${guardCore.sessionStateKey(sessionID)}.json`);
}

function assertAllowed(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.deepEqual(JSON.parse(result.stdout), { permission: 'allow' });
}

// ─────────────────────────────────────────────────────────────────────────────
// 4. TESTS
// ─────────────────────────────────────────────────────────────────────────────

test('malformed input and missing session identity fail open without state', () => {
  const { root } = makeWorkspace();
  try {
    const malformed = runHook(PREBIND_HOOK_PATH, root, '{not-json', {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(malformed);

    for (const sessionID of [undefined, '', '   ']) {
      const payload = sessionPayload(root, sessionID);
      if (sessionID === undefined) delete payload.session_id;
      const result = runHook(PREBIND_HOOK_PATH, root, payload, {
        [guardCore.ENFORCE_ENV]: '1',
      });
      assertAllowed(result);
    }

    assert.equal(existsSync(guardCore.resolveGuardPaths(root).stateDir), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('disabled and autonomous child sessions are complete no-ops', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const disabled = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, 'disabled'), {
      MK_SPEC_FOLDER: folderRel,
      [guardCore.DISABLED_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(disabled);

    const child = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, 'child'), {
      MK_SPEC_FOLDER: folderRel,
      [guardCore.CHILD_SESSION_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(child);

    assert.equal(existsSync(statePath(root, 'disabled')), false);
    assert.equal(existsSync(statePath(root, 'child')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforcement remains inert without a declaration or explicit opt-in', () => {
  const { root } = makeWorkspace();
  try {
    const result = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, 'inert'));
    assertAllowed(result);
    assert.equal(existsSync(statePath(root, 'inert')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a valid declared folder satisfies the gate and allows the existing consumer', () => {
  const { root, folderAbs, folderRel } = makeWorkspace();
  try {
    const sessionID = 'prebound';
    const prebind = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, sessionID), {
      MK_SPEC_FOLDER: folderRel,
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(prebind);

    const state = JSON.parse(readFileSync(statePath(root, sessionID), 'utf8'));
    assert.equal(state.status, 'satisfied');
    assert.deepEqual(state.boundSpecFolder, { path: folderRel, source: 'flags' });
    assert.equal(state.validatedResolvedPath, realpathSync(folderAbs));

    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      ...sessionPayload(root, sessionID),
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assertAllowed(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('explicit enforcement opens an unbound top-level session and denies Write', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'enforced';
    const prebind = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(prebind);
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');

    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      ...sessionPayload(root, sessionID),
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assert.equal(enforce.status, 2, enforce.stderr);
    assert.equal(JSON.parse(enforce.stdout).permission, 'deny');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('invalid declarations never satisfy and only open under explicit enforcement', () => {
  const { root } = makeWorkspace();
  try {
    const invalidFolder = '../outside-spec-tree';
    const inert = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, 'invalid-inert'), {
      MK_SPEC_FOLDER: invalidFolder,
    });
    assertAllowed(inert);
    assert.equal(existsSync(statePath(root, 'invalid-inert')), false);

    const enforced = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, 'invalid-enforced'), {
      MK_SPEC_FOLDER: invalidFolder,
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(enforced);
    assert.equal(JSON.parse(readFileSync(statePath(root, 'invalid-enforced'), 'utf8')).status, 'open');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('repeated startup preserves satisfied and skipped terminal state', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = guardCore.resolveGuardPaths(root);
    const terminalStates = [
      ['already-satisfied', { status: 'satisfied', answeredAtMs: 10 }],
      ['already-skipped', { status: 'skipped', answeredAtMs: 20 }],
    ];

    for (const [sessionID, state] of terminalStates) {
      assert.equal(guardCore.writeGateStateAtomic(stateDir, sessionID, state), true);
      const before = readFileSync(statePath(root, sessionID), 'utf8');
      const result = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, sessionID), {
        [guardCore.ENFORCE_ENV]: '1',
      });
      assertAllowed(result);
      assert.equal(readFileSync(statePath(root, sessionID), 'utf8'), before);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a padded session id is preserved verbatim so the enforce consumer reads the same state key', () => {
  const { root } = makeWorkspace();
  try {
    // Leading/trailing whitespace must not be trimmed: the enforce consumer and
    // the shared sessionStateKey() never trim, so trimming at prebind would
    // persist under a key enforcement cannot find and let the mutation through.
    const paddedID = '  cursor-session  ';
    const prebind = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, paddedID), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(prebind);

    // Open state must be written under the VERBATIM id. This assertion fails
    // under the old trim-at-prebind behavior before enforcement is exercised.
    assert.equal(JSON.parse(readFileSync(statePath(root, paddedID), 'utf8')).status, 'open');
    assert.equal(existsSync(statePath(root, paddedID.trim())), false);

    // The enforce consumer, given the same padded id, finds the open state
    // and denies the mutation. Missing state would fail open, so allow is not a
    // valid success signal for this regression row.
    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      ...sessionPayload(root, paddedID),
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assert.equal(enforce.status, 2, enforce.stderr);
    assert.equal(JSON.parse(enforce.stdout).permission, 'deny');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a valid declared folder satisfies the gate even when enforcement is off', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = 'prebound-no-enforce';
    const prebind = runHook(PREBIND_HOOK_PATH, root, sessionPayload(root, sessionID), {
      MK_SPEC_FOLDER: folderRel,
    });
    assertAllowed(prebind);
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'satisfied');

    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      ...sessionPayload(root, sessionID),
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    });
    assertAllowed(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing workspace_roots field falls back to process.cwd() and still enforces', () => {
  // Cursor may omit workspace_roots entirely in some builds. The prebind's
  // cwd fallback must write state under the spawn cwd (the test root), and
  // the enforce consumer must read it from the same place. Without this row
  // the fallback path is untested -- a future regression breaking it would
  // pass silently.
  const { root } = makeWorkspace();
  try {
    const sessionID = 'missing-roots';
    const prebind = runHook(PREBIND_HOOK_PATH, root, { session_id: sessionID }, {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertAllowed(prebind);
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');

    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assert.equal(enforce.status, 2, enforce.stderr);
    assert.equal(JSON.parse(enforce.stdout).permission, 'deny');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a whitespace-only workspace_root is treated as absent by both producer and consumer', () => {
  // The prebind trims and falls back to cwd for a whitespace-only root; the
  // enforce consumer must agree, or it would look for state under a
  // different directory and silently fail open. This row fails on the
  // pre-fix enforce consumer (raw `||` treated "   " as a truthy root), so
  // it is the discriminating evidence for the producer-consumer agreement.
  const { root } = makeWorkspace();
  try {
    const sessionID = 'whitespace-root';
    const prebind = runHook(PREBIND_HOOK_PATH, root,
      { session_id: sessionID, workspace_roots: ['   '] }, {
        [guardCore.ENFORCE_ENV]: '1',
      });
    assertAllowed(prebind);
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');

    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      workspace_roots: ['   '],
      tool_name: 'Write',
      tool_input: { file_path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assert.equal(enforce.status, 2, enforce.stderr);
    assert.equal(JSON.parse(enforce.stdout).permission, 'deny');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
