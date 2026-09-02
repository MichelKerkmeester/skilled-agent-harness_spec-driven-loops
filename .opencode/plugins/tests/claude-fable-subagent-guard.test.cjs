// ╔══════════════════════════════════════════════════════════════════════════╗
// ║ COMPONENT: Claude PreToolUse(Task|Agent) Fable subagent guard -- Regression║
// ╠══════════════════════════════════════════════════════════════════════════╣
// ║ PURPOSE: Pin the policy that a Fable main loop may not put a subagent on ║
// ║          Fable. Three dispatch shapes inherit the parent model and must   ║
// ║          be denied: a fork, a call with no model, and a call naming a     ║
// ║          model outside the allowlist. Two must be allowed, and every      ║
// ║          unreadable input must fail open.                                 ║
// ║                                                                           ║
// ║          The transcript case matters most. Dispatching an Opus subagent   ║
// ║          is the action this guard PERMITS, and a subagent entry carries   ║
// ║          its own model. A reader that scans the transcript without        ║
// ║          separating those entries from the main loop reads the permitted  ║
// ║          subagent's model as the parent's, and waves through the fork it  ║
// ║          exists to stop. The guard is defeated by its own allowed path,   ║
// ║          so that case is pinned here.                                     ║
// ╚══════════════════════════════════════════════════════════════════════════╝
'use strict';

const assert = require('node:assert/strict');
const fs = require('node:fs');
const os = require('node:os');
const path = require('node:path');
const test = require('node:test');
const { spawnSync } = require('node:child_process');

const HOOK_PATH = path.join(
  __dirname, '..', '..', 'hooks', 'task-dispatch', 'claude', 'fable-subagent-guard.mjs',
);

let tmpDir;
function transcript(name, lines) {
  tmpDir = tmpDir || fs.mkdtempSync(path.join(os.tmpdir(), 'fable-guard-'));
  const p = path.join(tmpDir, `${name}.jsonl`);
  fs.writeFileSync(p, lines.map((l) => JSON.stringify(l)).join('\n') + '\n');
  return p;
}

const mainLine = (model) => ({ type: 'assistant', isSidechain: false, message: { model } });
const sideLine = (model) => ({ type: 'assistant', isSidechain: true, message: { model } });

function run(toolInput, transcriptPath, toolName = 'Agent') {
  const res = spawnSync(process.execPath, [HOOK_PATH], {
    input: JSON.stringify({ tool_name: toolName, transcript_path: transcriptPath, tool_input: toolInput }),
    encoding: 'utf8',
  });
  assert.equal(res.status, 0, 'the guard must always exit 0 and speak through stdout');
  if (!res.stdout.trim()) return { decision: 'allow', reason: null };
  const parsed = JSON.parse(res.stdout);
  return {
    decision: parsed.hookSpecificOutput.permissionDecision,
    reason: parsed.hookSpecificOutput.permissionDecisionReason,
  };
}

test('a Fable main loop cannot reach Fable through any of the three inheriting shapes', () => {
  const t = transcript('fable', [mainLine('claude-fable-5')]);
  for (const input of [
    { subagent_type: 'fork' },
    { subagent_type: 'general-purpose' },
    { subagent_type: 'general-purpose', model: 'fable' },
    { subagent_type: 'general-purpose', model: 'claude-fable-5' },
    { subagent_type: 'general-purpose', model: 'haiku' },
  ]) {
    const out = run(input, t);
    assert.equal(out.decision, 'deny', `expected deny for ${JSON.stringify(input)}`);
    assert.match(out.reason, /fable/i, 'the reason must name the model that triggered it');
  }
});

test('a Fable main loop may dispatch an explicit Opus or Sonnet subagent', () => {
  const t = transcript('fable-allow', [mainLine('claude-fable-5')]);
  for (const model of ['opus', 'sonnet']) {
    assert.equal(run({ subagent_type: 'general-purpose', model }, t).decision, 'allow');
  }
});

test('a subagent entry never stands in for the main loop model', () => {
  // The guard permits an Opus subagent, and that dispatch writes an Opus model into
  // the transcript. Reading it as the parent's model would allow the next fork.
  const t = transcript('mixed', [mainLine('claude-fable-5'), sideLine('claude-opus-5')]);
  const out = run({ subagent_type: 'fork' }, t);
  assert.equal(out.decision, 'deny', 'a sidechain entry must not mask a Fable parent');
  assert.match(out.reason, /fable/i);
});

test('a non-Fable main loop is left alone', () => {
  const t = transcript('opus', [mainLine('claude-opus-5')]);
  assert.equal(run({ subagent_type: 'fork' }, t).decision, 'allow');
  assert.equal(run({ subagent_type: 'general-purpose' }, t).decision, 'allow');
});

test('unreadable input fails open rather than blocking legitimate work', () => {
  const missing = path.join(os.tmpdir(), 'fable-guard-does-not-exist.jsonl');
  assert.equal(run({ subagent_type: 'fork' }, missing).decision, 'allow');

  const t = transcript('fable-other-tool', [mainLine('claude-fable-5')]);
  assert.equal(run({ subagent_type: 'fork' }, t, 'Bash').decision, 'allow');

  const noModel = transcript('no-model', [{ type: 'user', isSidechain: false }]);
  assert.equal(run({ subagent_type: 'fork' }, noModel).decision, 'allow');
});
