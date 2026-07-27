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
  const root = mkdtempSync(join(tmpdir(), 'devin-spec-gate-'));
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
  delete env.DEVIN_PROJECT_DIR;
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

function enforcePayload(root, sessionID, toolName = 'edit', filePath = 'src/app.js') {
  return {
    session_id: sessionID,
    cwd: root,
    tool_name: toolName,
    tool_input: { file_path: filePath },
  };
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

test('malformed input and missing session identity fail open without state', () => {
  const { root } = makeWorkspace();
  try {
    const malformedClassify = runHook(CLASSIFY_HOOK_PATH, root, '{not-json', {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(malformedClassify);

    const malformedEnforce = runHook(ENFORCE_HOOK_PATH, root, '{not-json', {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(malformedEnforce);

    for (const sessionID of [undefined, '', '   ']) {
      const payload = classifyPayload(root, sessionID);
      if (sessionID === undefined) delete payload.session_id;
      const result = runHook(CLASSIFY_HOOK_PATH, root, payload, {
        [guardCore.ENFORCE_ENV]: '1',
      });
      assertNoOutput(result);
    }

    assert.equal(existsSync(guardCore.resolveGuardPaths(root).stateDir), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('disabled and autonomous child sessions are complete no-ops', () => {
  const { root } = makeWorkspace();
  try {
    const disabled = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'disabled'), {
      [guardCore.DISABLED_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(disabled);
    assert.equal(existsSync(statePath(root, 'disabled')), false);

    const child = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, 'child'), {
      [guardCore.CHILD_SESSION_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(child);
    assert.equal(existsSync(statePath(root, 'child')), false);

    const childEnforce = runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, 'child'), {
      [guardCore.CHILD_SESSION_ENV]: '1',
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(childEnforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a mutating prompt opens the gate and surfaces the Gate-3 question', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'open-session';
    const result = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    const parsed = assertHasAdditionalContext(result, 'UserPromptSubmit');
    assert.ok(parsed.hookSpecificOutput.additionalContext.includes('SPEC FOLDER QUESTION'));
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a non-mutating prompt never opens the gate and writes no state', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'read-only';
    const result = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID, 'review the auth module'), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(result);
    assert.equal(existsSync(statePath(root, sessionID)), false);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce denies an edit when the gate is open and enforce is on', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'denied-session';
    runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    });

    const enforce = runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertDeny(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce remains inert without explicit opt-in (advise, not deny)', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'advise-session';
    runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID));

    const enforce = runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID));
    assert.equal(enforce.status, 0, enforce.stderr);
    const parsed = JSON.parse(enforce.stdout);
    assert.equal(parsed.hookSpecificOutput.hookEventName, 'PreToolUse');
    assert.ok(parsed.hookSpecificOutput.additionalContext);
    // No permissionDecision field -> advisory only, not a deny.
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

    const enforce = runHook(ENFORCE_HOOK_PATH, root, enforcePayload(root, sessionID), {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertNoOutput(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('repeated classify preserves satisfied and skipped terminal state', () => {
  const { root } = makeWorkspace();
  try {
    const { stateDir } = guardCore.resolveGuardPaths(root);
    const terminalStates = [
      ['already-satisfied', { status: 'satisfied', answeredAtMs: 10 }],
      ['already-skipped', { status: 'skipped', answeredAtMs: 20 }],
    ];

    for (const [sessionID, state] of terminalStates) {
      guardCore.writeGateStateAtomic(stateDir, sessionID, state);
      const before = readFileSync(statePath(root, sessionID), 'utf8');
      const result = runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
        [guardCore.ENFORCE_ENV]: '1',
      });
      assertNoOutput(result);
      assert.equal(readFileSync(statePath(root, sessionID), 'utf8'), before);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a whitespace-only cwd falls back to process.cwd() and still enforces', () => {
  // The pre-fix adapter used `payload?.cwd || DEVIN_PROJECT_DIR || process.cwd()`,
  // which treated "   " as a truthy cwd and looked for state under a bogus
  // subdirectory. The fix treats whitespace-only cwd as absent, so state is
  // written under the spawn cwd (the test root) and the enforce consumer finds
  // it. This row fails on the pre-fix adapter: classify writes state under
  // `resolve("   /.opencode/...")` which is a different directory than where
  // enforce (also using "   ") reads it -- wait, both sides used the same
  // bogus path, so they agreed. The real discrimination is that the bogus
  // path is NOT the test root, so the statePath assertion below fails on the
  // pre-fix adapter because state is written under `<root>/   /.opencode/...`
  // instead of `<root>/.opencode/...`.
  const { root } = makeWorkspace();
  try {
    const sessionID = 'whitespace-cwd';
    const payload = { session_id: sessionID, cwd: '   ', prompt: 'fix the login bug' };
    const classify = runHook(CLASSIFY_HOOK_PATH, root, payload, {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertHasAdditionalContext(classify, 'UserPromptSubmit');

    // State must be under the test root (the spawn cwd), not under a "   " subdirectory.
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');

    const enforcePayload = {
      session_id: sessionID,
      cwd: '   ',
      tool_name: 'edit',
      tool_input: { file_path: 'src/app.js' },
    };
    const enforce = runHook(ENFORCE_HOOK_PATH, root, enforcePayload, {
      [guardCore.ENFORCE_ENV]: '1',
    });
    assertDeny(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing cwd falls back to DEVIN_PROJECT_DIR then process.cwd()', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'missing-cwd';
    const payload = { session_id: sessionID, prompt: 'fix the login bug' };
    // No cwd field at all; DEVIN_PROJECT_DIR is set to the test root.
    const classify = runHook(CLASSIFY_HOOK_PATH, root, payload, {
      [guardCore.ENFORCE_ENV]: '1',
      DEVIN_PROJECT_DIR: root,
    });
    assertHasAdditionalContext(classify, 'UserPromptSubmit');
    assert.equal(JSON.parse(readFileSync(statePath(root, sessionID), 'utf8')).status, 'open');
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

function openGate(root, sessionID) {
  runHook(CLASSIFY_HOOK_PATH, root, classifyPayload(root, sessionID), {
    [guardCore.ENFORCE_ENV]: '1',
  });
}

test('enforce recognizes the filePath alias when file_path is absent', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'filepath-alias';
    openGate(root, sessionID);
    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      cwd: root,
      tool_name: 'edit',
      tool_input: { filePath: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assertDeny(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce recognizes the generic path alias when file_path and filePath are absent', () => {
  const { root } = makeWorkspace();
  try {
    const sessionID = 'path-alias';
    openGate(root, sessionID);
    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      cwd: root,
      tool_name: 'edit',
      tool_input: { path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assertDeny(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('enforce prefers file_path over filePath/path when multiple fields are present', () => {
  // file_path points at an exempt target (the spec tree) while filePath/path
  // point at a real, non-exempt file. Canonical-field-first precedence means
  // the exempt file_path wins -> allow. If a later alias won instead, this
  // would deny, so this test discriminates precedence order observably.
  const { root, folderRel } = makeWorkspace();
  try {
    const sessionID = 'precedence-session';
    openGate(root, sessionID);
    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      cwd: root,
      tool_name: 'edit',
      tool_input: {
        file_path: `${folderRel}/spec.md`,
        filePath: 'src/app.js',
        path: 'src/app.js',
      },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assertNoOutput(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a missing/blank path resolves to an exempt allow, not a deny', () => {
  // spec-gate-core.mjs's isExemptTargetPath() treats a non-string or blank
  // filePath as exempt, and evaluateMutation() allows any exempt non-bash
  // target. This is the corrected, verified behavior -- a caller that never
  // supplies a resolvable path is NOT enforcement-conservative, it is
  // silently allowed. This test locks that behavior in as a regression gate.
  const { root } = makeWorkspace();
  try {
    for (const toolInput of [{}, { file_path: '' }, { file_path: '   ' }]) {
      const sessionID = `blank-path-${JSON.stringify(toolInput)}`;
      openGate(root, sessionID);
      const enforce = runHook(ENFORCE_HOOK_PATH, root, {
        session_id: sessionID,
        cwd: root,
        tool_name: 'edit',
        tool_input: toolInput,
      }, { [guardCore.ENFORCE_ENV]: '1' });
      assertNoOutput(enforce);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('a truthy non-string in an earlier field does not mask a valid string in a later field', () => {
  // Regression test for the exact bug the || -> firstNonBlankString fix
  // closed: a `||` chain picks the first truthy VALUE, so a truthy object in
  // file_path would previously short-circuit past a real string in `path`,
  // resolve to null via the old typeof-string guard, and fall through to the
  // exempt-allow branch above -- a silent enforcement bypass despite a valid
  // path being available. The fix must still find and use `path` here.
  const { root } = makeWorkspace();
  try {
    const sessionID = 'masking-fix-session';
    openGate(root, sessionID);
    const enforce = runHook(ENFORCE_HOOK_PATH, root, {
      session_id: sessionID,
      cwd: root,
      tool_name: 'edit',
      tool_input: { file_path: { nested: 'object' }, path: 'src/app.js' },
    }, { [guardCore.ENFORCE_ENV]: '1' });
    assertDeny(enforce);
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});
