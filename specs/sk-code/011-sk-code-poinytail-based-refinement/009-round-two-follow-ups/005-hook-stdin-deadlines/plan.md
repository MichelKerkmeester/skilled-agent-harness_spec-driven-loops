---
title: "Implementation Plan: Phase 5: hook-stdin-deadlines"
description: "Replace the fourteen unbounded stdin readers in the ESM hooks under .skilled/hooks/ with the existing shared deadline reader, keep every hook's fail-open path, and prove both with one table-driven test that leaves stdin open."
trigger_phrases:
  - "hook stdin deadlines plan"
importance_tier: "normal"
contextType: "general"
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->
# Implementation Plan: Phase 5: hook-stdin-deadlines

<!-- SPECKIT_LEVEL: 1 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Node.js ES modules (`.mjs`) importing a CommonJS helper (`.cjs`), Node built-ins only. Node v26.8.2 observed |
| **Framework** | None |
| **Storage** | None |
| **Testing** | `node --test` (node:test) with `spawn` and `spawnSync` of the hook processes. `.skilled/scripts/run-node-tests.mjs` discovers `*.test.mjs` under `.skilled/hooks`. The existing Codex dispatch suite runs under vitest |

### Overview
Thirteen hooks carry a private `readStdin` that loops `for await (const chunk of process.stdin)`, and the Fable guard reads with `fs.readFileSync(0, 'utf8')`. The shared helper `readStdin({ timeoutMs = 3000 })` in `.skilled/hooks/shared/hook-adapter-shared.cjs` already settles on whichever comes first, the end of the stream or a 3000 ms timer, and then releases stdin so the process can exit. Each hook deletes its private reader and imports the helper by name, which Node allows because the helper's `module.exports` is a plain object literal. Every hook keeps the `JSON.parse` inside its own `try` block, so a partial or empty read takes the fail-open path it already has. The Fable guard becomes `async` and awaits the helper inside its existing `try`.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Problem statement clear and scope documented
- [x] Success criteria measurable
- [x] Dependencies identified

### Definition of Done
- [ ] All acceptance criteria met
- [ ] Tests passing (if applicable)
- [ ] Docs updated (spec/plan/tasks)
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Thin adapters over one shared helper: each ESM hook imports `readStdin` by name from the CommonJS helper in `.skilled/hooks/shared/`, the same way the eight CommonJS adapters already `require` it. No second helper is added.

### Key Components
- **`readStdin`** (`.skilled/hooks/shared/hook-adapter-shared.cjs`): the deadline reader. Only its header comment changes in this phase.
- **The fourteen hooks**: listed in the table below with their anchor lines and fail-open output.
- **`hook-stdin-deadline.test.mjs`** (`.skilled/hooks/shared/`): one deadline test over all fourteen plus a payload test over the seven hooks no other suite spawns.
- **The two hooks READMEs** (`.skilled/hooks/README.md`, `.skilled/hooks/shared/README.md`): they list the helper's consumers and the validation commands, so they change with it.

### Data Flow
A host starts the hook and writes one JSON payload to its stdin. `readStdin` collects chunks until the stream ends or 3000 ms pass, then removes its listeners, pauses stdin and returns the text read so far. The hook runs `JSON.parse` on that text inside a `try`. An empty, partial or invalid text throws, and the `catch` takes the hook's existing fail-open exit. A complete payload parses and the hook continues exactly as before. A stream error rejects the helper's promise, which the same `try` catches.

### Import form (confirmed)
Add this line to each hook:

```js
import { readStdin } from '../../shared/hook-adapter-shared.cjs';
```

The relative path is the same one each hook already uses for `../../shared/hook-flags.mjs`, and it resolves from the real file even when a runtime reaches the hook through a symlink, because Node resolves the entry file's real path first. Confirmed on Node v26.8.2: `scratch/probe/named-import.mjs` imports both names, prints `function function`, and under a held-open pipe returned the partial text at 3001 ms and exited 0. Fallback only if a task shows `SyntaxError: Named export 'readStdin' not found`:

```js
import { createRequire } from 'node:module';
const { readStdin } = createRequire(import.meta.url)('../../shared/hook-adapter-shared.cjs');
```

The two `goal-inject.mjs` hooks already hold a `createRequire`, but the named import is used there too so all fourteen read the same.

### The reader block to delete (thirteen hooks)
Exactly these five lines plus the blank line after them. Trust the text over the line numbers.

```js
async function readStdin() {
  const chunks = [];
  for await (const chunk of process.stdin) chunks.push(chunk);
  return Buffer.concat(chunks).toString('utf8');
}
```

### Per-file edit table
Line numbers are before any edit of that file. After an import is added, the reader block moves down one line, so delete the block first. Each of the thirteen shows a diff of exactly 7 changed lines against `scratch/before/` (one added, six removed).

| # | File under `.skilled/hooks/` | Add the import after this line (pre-edit line) | Reader block (pre-edit lines) | Output when stdin is empty | Wired host timeout |
|---|------------------------------|------------------------------------------------|-------------------------------|----------------------------|--------------------|
| 1 | `classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs` | `import { isHookEnabled } from '../../shared/hook-flags.mjs';` (23) | 35-39 | nothing, exit 0 | 30 |
| 2 | `classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs` | same `isHookEnabled` import (24) | 36-40 | nothing, exit 0 | 30 |
| 3 | `dispatch/claude/dispatch-preflight-lint.mjs` | same (23) | 43-47 | nothing, exit 0 | 5 |
| 4 | `dispatch/codex/dispatch-preflight-lint.mjs` | same (24) | 38-42 | nothing, exit 0 | 5 |
| 5 | `dispatch/cursor/dispatch-preflight-lint.mjs` | same (20) | 42-46 | `{"permission":"allow"}` | 10 |
| 6 | `dispatch/devin/dispatch-preflight-lint.mjs` | same (23) | 34-38 | nothing, exit 0 | 5 |
| 7 | `dispatch/claude/dispatch-audit-posttooluse.mjs` | same (23) | 34-38 | nothing, exit 0 | 5 |
| 8 | `dispatch/codex/dispatch-audit-posttooluse.mjs` | same (22) | 44-48 | nothing, exit 0 | 5 |
| 9 | `dispatch/devin/dispatch-audit-posttooluse.mjs` | same (21) | 40-44 | nothing, exit 0 | 5 |
| 10 | `goal/cursor/goal-inject.mjs` | `import { createRequire } from 'node:module';` (33) | 47-51 | `{"permission":"allow"}` | 10 |
| 11 | `goal/devin/goal-inject.mjs` | same `createRequire` import (22) | 36-40 | `{}` | 10 |
| 12 | `mcp-route-guard/cursor/mcp-route-guard.mjs` | `isHookEnabled` import (31) | 57-61 | `{"permission":"allow"}` | 10 |
| 13 | `task-dispatch/cursor/task-dispatch-guard.mjs` | `isHookEnabled` import (36) | 58-62 | `{"permission":"allow"}` | 10 |
| 14 | `task-dispatch/claude/fable-subagent-guard.mjs` | `isHookEnabled` import (17) | 22-28 (different, see below) | nothing, exit 0 | 5 |

The host timeouts come from `.claude/settings.json`, `.cursor/hooks.json`, `.codex/hooks.json` and `.devin/hooks.v1.json`. The planner's walk found 15 wired entries and a shortest timeout of 5. The unit is inferred to be seconds, as in Claude Code's hook settings, since 5, 10 and 30 would be meaningless as milliseconds. Every timeout is longer than the 3000 ms deadline, so no hook takes a shorter deadline and there is no exception. The Cursor shims add child time after the read (a 5 s child limit for the preflight and task guards, 3 s for the MCP guard), so the worst case is about 8 s and 6 s against Cursor's 10 s.

### The Fable guard
`fable-subagent-guard.mjs` has no `process.exit`, so it ends when its event loop drains. The helper clears its timer and pauses stdin on both paths, which lets that happen. Four edits:

1. Add the import after the `isHookEnabled` import (line 17).
2. Delete the synchronous reader and the blank line after it (lines 22-28):

```js
function readStdin() {
  try {
    return fs.readFileSync(0, 'utf8');
  } catch {
    return '';
  }
}
```

3. Change `function main() {` (line 77) to `async function main() {`.
4. Change `payload = JSON.parse(readStdin());` (line 81) to `payload = JSON.parse(await readStdin());`.

The call at the bottom stays `main();`, so no top-level await is needed. The existing `try`/`catch` around the parse now also catches a rejected read and returns with no output, which is what the old code did when `readFileSync` threw and returned an empty string: `JSON.parse('')` threw and the `catch` returned. The `fs` import stays, because `activeMainModel` still uses `fs.statSync`, `fs.openSync`, `fs.readSync` and `fs.closeSync`. An unexpected throw inside `main` now rejects the promise instead of throwing, and both end with exit 1 and a printed error.

### Proposed header comment for the helper
In `.skilled/hooks/shared/hook-adapter-shared.cjs`, replace lines 4-10:

```js
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every CommonJS runtime hook adapter under .skilled/hooks/. A
// second, independent ESM sibling lives at
// system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs for that
// skill's own spec-gate-enforce.mjs adapters, which are not part of the
// fully-portable set -- keeping this copy local means every adapter under
// hooks/ has zero dependency outside this tree.
```

with:

```js
// Keeps stdin collection and fail-open JSON parsing byte-identical across
// every runtime hook adapter under .skilled/hooks/. CommonJS adapters
// require it. ESM adapters import readStdin and parseJsonFailOpen by
// name, which Node resolves from the plain object literal assigned to
// module.exports at the bottom of this file, so keep that assignment a
// literal of bare names. A second, independent ESM sibling lives at
// system-spec-kit/runtime/hooks/lib/hook-adapter-shared.mjs for that
// skill's own spec-gate-enforce.mjs adapters, which are not part of the
// fully-portable set -- keeping this copy local means every adapter under
// hooks/ has zero dependency outside this tree.
```

The `MODULE:` title line stays, because the file itself is still CommonJS. The sibling's reason is kept word for word.

### Proposed test file
Create `.skilled/hooks/shared/hook-stdin-deadline.test.mjs` with this content. The planner ran this exact file against a scratch copy of the tree: 15 of 18 tests failed on the unfixed hooks (the 14 deadline subtests and their parent) and 18 of 18 passed after the planned edits. A byte-identical copy is saved at `scratch/probe/hook-stdin-deadline.test.mjs`.

```js
// ───────────────────────────────────────────────────────────────────
// MODULE: ESM Hook Stdin Deadline Tests
// ───────────────────────────────────────────────────────────────────
// A host that never closes a hook's stdin must not hold the hook until the
// host's own timeout kills it. Every ESM adapter below reads stdin through the
// shared reader, so with stdin left open and never written it gives up at the
// deadline, exits 0 and prints its fail-open output. A second group of tests
// pins the payload path of the adapters that no other suite spawns; the classifier,
// goal, Codex dispatch and Fable adapters already have payload suites of their
// own (classifier-injection-screen-posttooluse.test.mjs, goal-cursor.test.mjs,
// goal-devin.test.mjs, codex-shell-tool.test.mjs and the Fable subagent guard
// test under .opencode/plugins/tests).
// ───────────────────────────────────────────────────────────────────

import assert from 'node:assert/strict';
import { spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { test } from 'node:test';
import { fileURLToPath } from 'node:url';

const HOOKS_ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const REPO_ROOT = path.resolve(HOOKS_ROOT, '..', '..');

// The shared reader waits 3000 ms. A hook blocked on an open stdin cannot exit
// before that, so the lower bound shows the hook reached the read at all; the
// upper bound is the deadline plus room for start-up with fourteen processes
// running at once; the kill timer only stops a regression from hanging the run.
const EARLIEST_EXIT_MS = 2900;
const LATEST_EXIT_MS = 8000;
const KILL_AFTER_MS = 12000;

const ALLOW = '{"permission":"allow"}';

const HOOKS = [
  { id: 'classifier-injection-screen/claude', file: 'classifier-injection-screen/claude/classifier-injection-screen-posttooluse.mjs', failOpen: '' },
  { id: 'classifier-injection-screen/devin', file: 'classifier-injection-screen/devin/classifier-injection-screen-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/claude preflight', file: 'dispatch/claude/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/codex preflight', file: 'dispatch/codex/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/cursor preflight', file: 'dispatch/cursor/dispatch-preflight-lint.mjs', failOpen: ALLOW },
  { id: 'dispatch/devin preflight', file: 'dispatch/devin/dispatch-preflight-lint.mjs', failOpen: '' },
  { id: 'dispatch/claude audit', file: 'dispatch/claude/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/codex audit', file: 'dispatch/codex/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'dispatch/devin audit', file: 'dispatch/devin/dispatch-audit-posttooluse.mjs', failOpen: '' },
  { id: 'goal/cursor', file: 'goal/cursor/goal-inject.mjs', failOpen: ALLOW },
  { id: 'goal/devin', file: 'goal/devin/goal-inject.mjs', failOpen: '{}' },
  { id: 'mcp-route-guard/cursor', file: 'mcp-route-guard/cursor/mcp-route-guard.mjs', failOpen: ALLOW },
  { id: 'task-dispatch/cursor', file: 'task-dispatch/cursor/task-dispatch-guard.mjs', failOpen: ALLOW },
  { id: 'task-dispatch/claude fable', file: 'task-dispatch/claude/fable-subagent-guard.mjs', failOpen: '' },
];

// No kill-switch may leak in: a disabled hook exits at once without reading
// stdin, which would hide a missing deadline.
function hookEnv(extra = {}) {
  const env = { ...process.env };
  for (const name of Object.keys(env)) {
    if (name.endsWith('_DISABLED')) delete env[name];
  }
  return { ...env, HOOK_FLAGS_CONFIG: path.join(os.tmpdir(), 'hook-stdin-deadline-absent.env'), ...extra };
}

// Spawns the hook and leaves its stdin pipe open: nothing is written and
// nothing is ended.
function runWithOpenStdin(file) {
  return new Promise((resolve) => {
    const started = Date.now();
    const child = spawn(process.execPath, [path.join(HOOKS_ROOT, file)], {
      cwd: REPO_ROOT,
      env: hookEnv(),
      stdio: ['pipe', 'pipe', 'pipe'],
    });
    let stdout = '';
    child.stdout.on('data', (chunk) => { stdout += chunk; });
    const killer = setTimeout(() => child.kill('SIGKILL'), KILL_AFTER_MS);
    child.on('close', (code, signal) => {
      clearTimeout(killer);
      resolve({ code, signal, stdout, elapsedMs: Date.now() - started });
    });
  });
}

test('every ESM hook exits 0 at the stdin deadline when its host never closes stdin', async (t) => {
  const results = await Promise.all(HOOKS.map((hook) => runWithOpenStdin(hook.file)));
  for (const [index, hook] of HOOKS.entries()) {
    await t.test(hook.id, () => {
      const result = results[index];
      assert.equal(result.signal, null, 'the hook must exit on its own, not be killed');
      assert.equal(result.code, 0);
      assert.equal(result.stdout, hook.failOpen);
      assert.ok(result.elapsedMs >= EARLIEST_EXIT_MS, `exited after ${result.elapsedMs} ms, before it could have waited on stdin`);
      assert.ok(result.elapsedMs < LATEST_EXIT_MS, `exited after ${result.elapsedMs} ms, past the deadline plus margin`);
    });
  }
});

// A flagged dispatch trips one hard rule whose id the assertions look for.
const FLAGGED_DISPATCH = 'opencode run -m p/m --agent general "x" </dev/null';
const RULE_ID = 'no-bare-agent-general';

function runWithPayload(file, payload, env) {
  return spawnSync(process.execPath, [path.join(HOOKS_ROOT, file)], {
    input: JSON.stringify(payload),
    encoding: 'utf8',
    env: hookEnv(env),
    cwd: REPO_ROOT,
    timeout: 15000,
  });
}

function recordedAuditLine(projectDir) {
  const logPath = path.join(projectDir, '.skilled', 'logs', 'cli-dispatch-audit.log');
  return JSON.parse(fs.readFileSync(logPath, 'utf8').trim().split('\n').pop());
}

test('the Claude and Devin preflight lints still flag a dispatch sent on a normal payload', () => {
  const claude = runWithPayload(
    'dispatch/claude/dispatch-preflight-lint.mjs',
    { tool_name: 'Bash', cwd: REPO_ROOT, tool_input: { command: FLAGGED_DISPATCH } },
    { CLAUDE_PROJECT_DIR: REPO_ROOT },
  );
  assert.equal(claude.status, 0, claude.stderr);
  assert.equal(JSON.parse(claude.stdout).hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.ok(claude.stdout.includes(RULE_ID));

  const devin = runWithPayload(
    'dispatch/devin/dispatch-preflight-lint.mjs',
    { tool_name: 'exec', cwd: REPO_ROOT, tool_input: { command: FLAGGED_DISPATCH } },
  );
  assert.equal(devin.status, 0, devin.stderr);
  assert.equal(JSON.parse(devin.stdout).hookSpecificOutput.hookEventName, 'PreToolUse');
  assert.ok(devin.stdout.includes(RULE_ID));
});

test('the Claude and Devin dispatch audits still record a dispatch sent on a normal payload', (t) => {
  for (const { file, tool, runtime } of [
    { file: 'dispatch/claude/dispatch-audit-posttooluse.mjs', tool: 'Bash', runtime: 'claude' },
    { file: 'dispatch/devin/dispatch-audit-posttooluse.mjs', tool: 'exec', runtime: 'devin' },
  ]) {
    const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), `${runtime}-dispatch-audit-`));
    t.after(() => fs.rmSync(projectDir, { recursive: true, force: true }));
    const result = runWithPayload(file, {
      tool_name: tool,
      cwd: projectDir,
      session_id: 'stdin-deadline-session',
      tool_input: { command: FLAGGED_DISPATCH },
      tool_response: { stdout: 'done\n', stderr: '' },
    });
    assert.equal(result.status, 0, result.stderr);
    assert.equal(result.stdout, '');
    assert.equal(recordedAuditLine(projectDir).runtime, runtime);
  }
});

test('the Cursor preflight, MCP route and Task guards still answer a normal payload', () => {
  const lint = runWithPayload('dispatch/cursor/dispatch-preflight-lint.mjs', {
    tool_name: 'Shell',
    workspace_roots: [REPO_ROOT],
    tool_input: { command: FLAGGED_DISPATCH },
  });
  assert.equal(lint.status, 0, lint.stderr);
  assert.equal(JSON.parse(lint.stdout).permission, 'allow');
  assert.ok(JSON.parse(lint.stdout).agent_message.includes(RULE_ID));

  const mcp = runWithPayload(
    'mcp-route-guard/cursor/mcp-route-guard.mjs',
    { mcp_server_name: 'external-example', tool_name: 'lookup', workspace_roots: [REPO_ROOT] },
    { MCP_ROUTE_GUARD_BROAD_MODE: '1' },
  );
  assert.equal(mcp.status, 0, mcp.stderr);
  assert.equal(JSON.parse(mcp.stdout).permission, 'allow');
  assert.ok(JSON.parse(mcp.stdout).agent_message.includes('native call to "external-example"'));

  const task = runWithPayload(
    'task-dispatch/cursor/task-dispatch-guard.mjs',
    {
      tool_name: 'Task',
      workspace_roots: [REPO_ROOT],
      tool_input: { subagent_type: 'ai-council', prompt: 'mode=research do the thing' },
    },
    { SYSTEM_DEEP_LOOP_GUARD_REJECT: '1' },
  );
  assert.equal(task.status, 2, task.stderr);
  assert.equal(JSON.parse(task.stdout).permission, 'deny');
  assert.match(JSON.parse(task.stdout).agent_message, /Deep Route mode mismatch/);
});
```

Why the numbers: the helper waits 3000 ms, so a hook blocked on an open stdin cannot exit sooner than that, which makes the 2900 ms lower bound proof that the hook reached the read. A hook disabled by a kill-switch would exit at once and pass a plain exit-0 check, so the test deletes every `*_DISABLED` variable and also asserts the lower bound. The 8000 ms upper bound leaves 5 s for fourteen Node start-ups at once. The 12000 ms kill timer only stops a regression from hanging the run.

### Documentation edits
Both READMEs are code-folder or concern READMEs under `.skilled/hooks/`, so `sk-create-readme` rules apply: current-state wording, no packet or phase labels, no em dashes, no semicolons and no Oxford commas in new prose, numbered headings untouched, and `validate_document.py` must still print `VALID`. The exact find and replace strings are in `tasks.md`. In short:
- `shared/README.md`: the overview and plumbing paragraphs say CommonJS and ESM adapters share the helper, the consumer table gains an ESM row, the directory tree and key-files table gain the new test, the "every CommonJS consumer" wording becomes "every consumer", and the validation section gains the new command.
- `README.md`: the tree comment and the key-files sentence stop saying the helper serves 5 adapters (it served 8 before this phase and serves 22 after), and the validation block gains the new command.

No version bump and no changelog entry apply: `.skilled/hooks/` is not a skill packet, so the sk-code hub's and sk-doc hub's version authority (hub-root artifacts only) does not reach these files, and neither README carries a version field.
<!-- /ANCHOR:architecture -->


---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

Follow the ordered tasks in `tasks.md`. It owns the Setup, Implementation and Verification phase checkboxes and task state. Phase 1 records the baselines and the scope snapshot, Phase 2 reads the contracts first and then makes one edit per file, and Phase 3 runs one verification per requirement and success criterion.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

### New suite: `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`
- **Deadline test** (one parent test, 14 subtests, one per hook): all fourteen are spawned at once with a stdin pipe that is never written and never ended. Each must report no signal, exit code 0, stdout equal to its fail-open output, and an elapsed time of at least 2900 ms and under 8000 ms. Subtest names are the hook ids in the table (for example `dispatch/claude preflight`).
- **Payload tests** (three tests whose names contain `still`): they cover the seven hooks that no existing suite spawns, using a flagged dispatch (`opencode run -m p/m --agent general "x" </dev/null`, which trips rule `no-bare-agent-general`). Claude and Devin preflight must print an advisory naming the rule. Claude and Devin audit must exit 0 with no output and append a log line tagged with their runtime. Cursor preflight must answer `permission: allow` with an `agent_message` naming the rule. Cursor MCP guard, with `MCP_ROUTE_GUARD_BROAD_MODE=1`, must answer `allow` with an advisory. Cursor task guard, with `SYSTEM_DEEP_LOOP_GUARD_REJECT=1` and a mode mismatch, must exit 2 with `permission: deny`.
- Run it with `node --test .skilled/hooks/shared/hook-stdin-deadline.test.mjs`, the runner the neighbouring hook tests use. Expected: `ℹ tests 18`, `ℹ pass 18`, `ℹ fail 0`, about 3.4 s. Before the hook edits it must print `ℹ pass 3` and `ℹ fail 15`, which `scratch/baseline/new-test-before-fix.txt` records.

### Existing suites that already cover the payload path of the other seven hooks
| Hook | Suite | Runner | Tests |
|------|-------|--------|-------|
| classifier-injection-screen claude and devin | `classifier-injection-screen/{claude,devin}/classifier-injection-screen-posttooluse.test.mjs` | node:test | 6 + 6 |
| goal cursor | `goal/cursor/goal-cursor.test.mjs` | node:test | 15 |
| goal devin | `goal/devin/goal-devin.test.mjs` | node:test | 3 |
| dispatch codex preflight and audit | `dispatch/codex/codex-shell-tool.test.mjs` | vitest | 5 |
| fable-subagent-guard | `.opencode/plugins/tests/claude-fable-subagent-guard.test.cjs` | node:test | 5 |

The node:test group that must stay green also holds `dispatch/lib/dispatch-rule-checks.test.mjs` (20, pins the four preflight hook paths in the registry), `mcp-route-guard/lib/mcp-route-guard.test.cjs` (1), `shared/hook-flags.test.cjs` (20) and `shared/hook-adapter-shared.test.cjs` (2). Planner baseline on the unchanged tree: `ℹ tests 78`, `ℹ pass 78`, `ℹ fail 0` for the nine node:test files, and `Tests  5 passed (5)` for the vitest file (`scratch/baseline/`).

### Behavior comparison against the saved copy
`scratch/probe/compare-inputs.mjs` copies `scratch/before/.skilled/hooks` into a temporary root, runs each of the fourteen hooks from there and from the live tree with five stdin cases (empty, invalid JSON, `123`, `null`, and stdin ignored), all from the same empty working directory, and prints one line per hook and `diffs=N`. Expected `diffs=0` and exit 0. A seeded change to one fail-open output produced `diffs=3` and exit 1 during planning, so the check can fail.

### Exact-edit check
`scratch/probe/verify-exact-edits.mjs` rebuilds each of the fourteen hooks from `scratch/before/` by applying only the planned edits (the reader block removed, the import line added after its anchor, and for the Fable guard the three extra replacements), then compares the result with the live file byte for byte. Expected `mismatches=0` and exit 0. On the unedited tree it printed `mismatches=14`, and one stray appended comment in an otherwise correct copy printed `mismatches=1`, so it fails on any extra or missing change.

### Prototype evidence
On a scratch copy of the tree the planner applied every edit in this plan: each find text matched exactly once, all fourteen hooks passed `node --check`, the new test went from 15 failures to 18 passes, the existing suites that spawn the hooks passed unchanged (the Fable suite pointed at the edited copy: 5 of 5), and `compare-inputs.mjs` printed `diffs=0`. A 4 MB payload sent to the edited Claude preflight was read whole. With stdin held open, the unedited Fable guard was killed at 10007 ms and the edited one exited 0 at 3029 ms.

### Other checks
- `node --check` on all sixteen JavaScript files.
- `python3 -I .skilled/skills/sk-code/sk-code-opencode/assets/scripts/verify_alignment_drift.py --root .skilled/hooks`: planner baseline `[alignment-drift] PASS`, `Errors: 0`, `Warnings: 0`. It reads only files git tracks, so the new untracked test is not scanned until staged.
- `python3 -I .skilled/skills/sk-doc/scripts/validate_document.py` on both READMEs: planner baseline `VALID`, `Total issues: 0`.
- `node .skilled/scripts/run-node-tests.mjs --list`: the new file must appear as `node:test` and not `vitest`, which proves the repo gate will run it.

### Gaps
- The test proves each hook exits at the deadline when stdin stays open. It does not prove how any real host behaves, and no host write latency was measured.
- Pi and OpenCode adapters read no stdin and are not touched.
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

- The helper and its test (`hook-adapter-shared.cjs`, `hook-adapter-shared.test.cjs`) are committed and stay unchanged apart from the header comment.
- `.skilled/scripts/run-node-tests.mjs` already lists `.skilled/hooks` as a live root, so the new test joins the repo's node:test gate with no registration.
- No Hermes regeneration task is needed. `sync-skills-hermes.cjs` mirrors `.skilled/skills` and `.skilled/agents` only, and this phase touches neither. The orchestrator still runs its `--check` in the parent goal.
- Runtime mirrors under `.claude/hooks/`, `.cursor/hooks/`, `.codex/hooks/` and `.devin/hooks/` hold symlinks to the edited files, so they need nothing.
- The spec's `Changelog` line (refresh the matching file in `../changelog/` when the phase closes) is a phase-close step for the orchestrator, not a builder task.
- Follow-up, not in this phase: the readers under `.skilled/skills/system-spec-kit/runtime/hooks/`. `rg -n "for await \(const chunk of process\.stdin\)|readFileSync\(0" .skilled/skills/system-spec-kit/runtime/hooks` prints 15 lines in 15 files: six TypeScript files built to dist (`claude/compact-inject.ts`, `claude/directive-lifecycle-boundary.ts` and the four `shared.ts` files for claude, codex, cursor and devin) and nine `.mjs` or `.cjs` files (`lib/hook-adapter-shared.mjs`, `cursor/post-tool-use.mjs`, `cursor/spec-gate-prebind.mjs`, `cursor/completion-evidence-response.mjs`, `devin/permission-request-policy.mjs`, `devin/post-compaction.cjs` and the three `completion-evidence-stop.cjs` files for claude, codex and devin). Several are reached through symlinks from `.skilled/hooks/<concern>/<runtime>/`, for example `dispatch/cursor/post-tool-use.mjs` and `post-edit-quality/cursor/post-tool-use.mjs`, so the requirement search over `.skilled/hooks` does not see them. They belong to system-spec-kit, whose ESM sibling `lib/hook-adapter-shared.mjs` needs the same deadline in its own change.
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- The 17 modified files are tracked, so `git restore` on them undoes the edits. Without git, copy each one back from `scratch/before/.skilled/hooks/<same relative path>`; those copies are verbatim pre-edit files. The README copies there are also verbatim.
- Delete the one new file, `.skilled/hooks/shared/hook-stdin-deadline.test.mjs`, with a single-file `rm`.
- Rerun the Phase 1 baseline commands in `tasks.md`; their counts must match `scratch/baseline/`.
- Once Phase 3 passes, `scratch/before/` (73 files, 880 KB) is needed only for rollback and the comparison script. The orchestrator can drop it before the commit if the packet should stay small.
<!-- /ANCHOR:rollback -->

---
