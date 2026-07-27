// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Codex Spec-Gate Enforce Process Tests                          ║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Exercise Codex's classify/enforce transport and alias matrix.    ║
// ╚══════════════════════════════════════════════════════════════════════════╝

import assert from 'node:assert/strict';
import {
  existsSync,
  mkdirSync,
  mkdtempSync,
  readFileSync,
  rmSync,
  writeFileSync,
} from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

import * as guardCore from '../../lib/spec-gate/spec-gate-core.mjs';

const CLASSIFY_HOOK_PATH = fileURLToPath(new URL('./spec-gate-classify.mjs', import.meta.url));
const ENFORCE_HOOK_PATH = fileURLToPath(new URL('./spec-gate-enforce.mjs', import.meta.url));

function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'codex-spec-gate-'));
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
  delete env.CODEX_PROJECT_DIR;
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

function classifyPayload(root, sessionID, prompt = 'fix the login bug') {
  return { session_id: sessionID, cwd: root, prompt };
}

function enforcePayload(root, sessionID, toolName = 'edit', toolInput = { file_path: 'src/app.js' }) {
  return { session_id: sessionID, cwd: root, tool_name: toolName, tool_input: toolInput };
}

function statePath(root, sessionID) {
  const { stateDir } = guardCore.resolveGuardPaths(root);
  return join(stateDir, `${guardCore.sessionStateKey(sessionID)}.json`);
}

function assertNoOutput(result) {
  assert.equal(result.status, 0, result.stderr);
  assert.equal(result.stdout.trim(), '', 'expected no stdout output');
}

function assertHasAdditionalContext(result, eventName) {
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.hookSpecificOutput.hookEventName, eventName);
  assert.ok(typeof parsed.hookSpecificOutput.additionalContext === 'string');
  return parsed;
}

function assertDeny(result) {
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.equal(parsed.hookSpecificOutput.permissionDecision, 'deny');
}

function openGate(root, sessionID) {
  runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
    [guardCore.ENFORCE_ENV]: '1',
  });
}

test('malformed input and missing session identity fail open without state', () => {
  const { root } = makeWorkspace();
  try {
    assertNoOutput(runHook(CLASSIFY_HOOK_PATH, root, '{not-json', { [guardCore.ENFORCE_ENV]: '1' }));
    assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, '{not-json', { [guardCore.ENFORCE_ENV]: '1' }));

    for (const sessionID of [undefined, '', '   ']) {
      assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID), {
        [guardCore.ENFORCE_ENV]: '1',
      }));
    }

    assert.equal(existsSync(guardCore.resolveGuardPaths(root).stateDir), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('disabled and autonomous child sessions are complete no-ops', () => {
  const { root } = makeWorkspace();
  try {
    assertNoOutput(runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'disabled'), {
      [guardCore.DISABLED_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    }));
    assertNoOutput(runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'child'), {
      [guardCore.CHILD_SESSION_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    }));
    assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, 'child'), {
      [guardCore.CHILD_SESSION_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    }));
    assert.equal(existsSync(statePath(root, 'disabled')), false);
    assert.equal(existsSync(statePath(root, 'child')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a mutating prompt opens the gate and surfaces the Gate-3 question', () => {
  const { root } = makeWorkspace();
  try {
    const result = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'open-session'), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    const parsed = assertHasAdditionalContext(result, 'UserPromptSubmit');
    assert.ok(parsed.hookSpecificOutput.additionalContext.includes('SPEC FOLDER QUESTION'));
    assert.equal(JSON.parse(readFileSync(statePath(root, 'open-session'), 'utf8')).status, 'open');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a non-mutating prompt never opens the gate and writes no state', () => {
  const { root } = makeWorkspace();
  try {
    assertNoOutput(runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'read-only', 'review the auth module')));
    assert.equal(existsSync(statePath(root, 'read-only')), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce denies an edit when the gate is open and enforce is on', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'denied-session';
    openGate(root, sessionID);
    assertDeny(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce remains inert without explicit opt-in and advises instead of denying', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'advise-session';
    openGate(root, sessionID);
    const result = runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID));
    const parsed = assertHasAdditionalContext(result, 'PreToolUse');
    assert.equal(parsed.hookSpecificOutput.permissionDecision, undefined);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a satisfied gate allows the edit through the enforce consumer', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = 'satisfied-session';
    const { stateDir } = guardCore.resolveGuardPaths(root);
    guardCore.writeGateStateAtomic(stateDir, sessionID, {
      status: 'satisfied',
      boundSpecFolder: { path: folderRel, source: 'flags' },
      answeredAtMs: Date.now(),
    });
    assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('repeated classify preserves satisfied and skipped terminal state', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = guardCore.resolveGuardPaths(root);
    for (const [sessionID, state] of [
      ['already-satisfied', { status: 'satisfied', answeredAtMs: 10 }],
      ['already-skipped', { status: 'skipped', answeredAtMs: 20 }],
    ]) {
      guardCore.writeGateStateAtomic(stateDir, sessionID, state);
      const before = readFileSync(statePath(root, sessionID), 'utf8');
      assertNoOutput(runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
        [guardCore.ENFORCE_ENV]: '1',
      }));
      assert.equal(readFileSync(statePath(root, sessionID), 'utf8'), before);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing cwd falls back to CODEX_PROJECT_DIR then process.cwd()', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'missing-cwd';
    const payload = { session_id: sessionID, prompt: 'fix the login bug' };
    assertHasAdditionalContext(runHook(CLASSIFY_HOOK_PATH, root, payload, {
      [guardCore.ENFORCE_ENV]: '1',
      CODEX_PROJECT_DIR: root,
    }), 'UserPromptSubmit');
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce recognizes filePath and path aliases when file_path is absent', () => {
  const { root } = makeWorkspace();
  try {
    for (const [sessionID, toolInput] of [
      ['filepath-alias', { filePath: 'src/app.js' }],
      ['path-alias', { path: 'src/app.js' }],
    ]) {
      openGate(root, sessionID);
      assertDeny(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID, 'edit', toolInput), {
        [guardCore.ENFORCE_ENV]: '1',
      }));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce prefers file_path over later aliases', () => {
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = 'precedence-session';
    openGate(root, sessionID);
    assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID, 'edit', {
      file_path: `${folderRel}/spec.md`,
      filePath: 'src/app.js',
      path: 'src/app.js',
    }), { [guardCore.ENFORCE_ENV]: '1' }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing or blank path resolves to an exempt allow', () => {
  const { root } = makeWorkspace();
  try {
    for (const [index, toolInput] of [{}, { file_path: '' }, { file_path: '   ' }].entries()) {
      const sessionID = `blank-path-${index}`;
      openGate(root, sessionID);
      assertNoOutput(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID, 'edit', toolInput), {
        [guardCore.ENFORCE_ENV]: '1',
      }));
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a truthy non-string in an earlier field does not mask a valid later alias', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'masking-fix-session';
    openGate(root, sessionID);
    assertDeny(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID, 'edit', {
      file_path: { nested: 'object' },
      path: 'src/app.js',
    }), { [guardCore.ENFORCE_ENV]: '1' }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('Codex apply_patch still resolves a patch header for enforcement', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'apply-patch-session';
    openGate(root, sessionID);
    const patch = [
      '*** Begin Patch',
      '*** Update File: src/app.js',
      '@@',
      '-// test target',
      '+// changed target',
      '*** End Patch',
    ].join('\n');
    assertDeny(runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID, 'apply_patch', {
      command: patch,
    }), { [guardCore.ENFORCE_ENV]: '1' }));
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
