import assert from 'node:assert/strict';
import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { test } from 'node:test';

const HOOK_PATH = fileURLToPath(new URL('./permission-request-policy.mjs', import.meta.url));

function makeWorkspace() {
  const root = mkdtempSync(join(tmpdir(), 'devin-permission-request-'));
  mkdirSync(join(root, 'src'), { recursive: true });
  writeFileSync(join(root, 'src', 'app.js'), '// test target\n');
  return root;
}

function basePayload(root, overrides = {}) {
  return {
    hook_event_name: 'PermissionRequest',
    tool_name: 'edit',
    tool_input: { file_path: 'src/app.js' },
    tool_use_id: 'tool-1',
    session_id: 'session-1',
    prompt_id: 'prompt-1',
    cwd: root,
    ...overrides,
  };
}

function runHook(root, payload) {
  return spawnSync(process.execPath, [HOOK_PATH], {
    cwd: root,
    env: { ...process.env, DEVIN_PROJECT_DIR: root },
    encoding: 'utf8',
    input: typeof payload === 'string' ? payload : JSON.stringify(payload),
  });
}

function readDecision(result) {
  assert.equal(result.status, 0, result.stderr);
  const parsed = JSON.parse(result.stdout);
  assert.equal(parsed.hookSpecificOutput.hookEventName, 'PermissionRequest');
  assert.equal(parsed.hookSpecificOutput.permissionDecision, parsed.decision === 'approve' ? 'allow' : 'deny');
  return parsed.hookSpecificOutput.permissionDecision;
}

const MATRIX = [
  {
    name: 'write-allow',
    expected: 'allow',
    payload: (root) => basePayload(root, { tool_input: { file_path: '/tmp/devin-permission-allow.txt' } }),
  },
  {
    name: 'write-deny',
    expected: 'deny',
    payload: (root) => basePayload(root),
  },
  {
    name: 'exec-allow',
    expected: 'allow',
    payload: (root) => basePayload(root, { tool_name: 'exec', tool_input: { command: 'git status' } }),
  },
  {
    name: 'exec-deny',
    expected: 'deny',
    payload: (root) => basePayload(root, { tool_name: 'exec', tool_input: { command: 'opencode run "permission probe"' } }),
  },
  {
    name: 'unclassifiable-deny',
    expected: 'deny',
    payload: (root) => basePayload(root, { tool_name: 'read', tool_input: { file_path: 'src/app.js' } }),
  },
  {
    name: 'malformed-input',
    expected: 'deny',
    payload: () => '{not-json',
  },
  {
    name: 'missing-identity',
    expected: 'deny',
    payload: (root) => {
      const payload = basePayload(root);
      delete payload.session_id;
      return payload;
    },
  },
];

test('PermissionRequest policy discriminates the required decision matrix', () => {
  const root = makeWorkspace();
  try {
    for (const row of MATRIX) {
      assert.equal(readDecision(runHook(root, row.payload(root))), row.expected, row.name);
    }
  } finally {
    rmSync(root, { recursive: true, force: true });
  }
});

test('decision matrix fails against an always-allow classifier stub', () => {
  const deniedRows = MATRIX.filter((row) => row.expected === 'deny');
  const naiveAlwaysAllow = () => 'allow';
  const mismatches = deniedRows.filter((row) => naiveAlwaysAllow() !== row.expected);

  assert.ok(mismatches.length > 0, 'the matrix must contain deny rows that reject an always-allow stub');
  assert.deepEqual(mismatches.map((row) => row.name), deniedRows.map((row) => row.name));
});

