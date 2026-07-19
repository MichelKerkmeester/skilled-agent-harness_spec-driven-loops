---
title: "Completion Evidence Sentinel"
description: "Manual scenario validating the mk-completion-sentinel plugin and Stop hook advisory flow."
trigger_phrases:
  - "plg-001"
  - "mk-completion-sentinel"
  - "completion evidence sentinel"
  - "completion sentinel plugin"
  - "completion-evidence-sentinel"
  - "stop hook advisory"
version: 1.0.0.1
id: plugins-and-hooks-completion-evidence-sentinel
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# Completion Evidence Sentinel

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-completion-sentinel` is an OpenCode plugin (`.opencode/plugins/mk-completion-sentinel.js`) that
adapts the runtime-neutral core `completion-evidence-sentinel.cjs`
(`.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs`) onto
OpenCode's `session.idle` and `session.created` events. The identical core is also consumed by a
standalone Claude Code Stop hook,
`.opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs`, wired in
`.claude/settings.json` under the `Stop` matcher alongside the existing `session-stop.js` owner.

When a turn ends with a completion claim (a word from `COMPLETION_CLAIM_PATTERN` -- `completed`,
`resolved`, `fixed`, `finished`, `shipped`, `released`, `deployed`, `implemented`, `occurred`,
`happened` -- matched only against the trailing 400 characters of the turn) AND a candidate spec
folder can be resolved, the core checks recorded evidence only: `checklist.md` via
`check-completion.sh --json` when present, otherwise a `stat` of `implementation-summary.md` for a
Level 1 folder. It never runs a test, a build, or `validate.sh`, never writes stdout/stderr itself,
never returns a block decision, and fails open on every internal error. A dedup store keyed on
`sha256(specFolder)` fingerprints `specFolder + claimText` so an identical claim against the same
packet is advised at most once. Both adapters also throttled-sweep the shared state
(`sweepStaleSentinelState`): OpenCode on `session.created`, the Claude Stop hook as a best-effort
step on every invocation.

This scenario validates:
- claim-detection anchoring and spec-folder text resolution in the core
- the checklist `EVIDENCE_MISSING` advisory path and its dedup suppression on a repeat claim
- the Level 1 `implementation-summary.md` advisory path (present vs. absent)
- the `MK_COMPLETION_SENTINEL_DISABLED=1` kill switch as a full no-op on the core, the OpenCode
  plugin, and the Claude Stop hook
- the throttled dedup-store sweep pruning aged entries
- both runtime adapters (OpenCode `session.idle` plugin, Claude `Stop` hook) delegating to the
  identical core and neither ever blocking
- the existing automated suites (OpenCode plugin unit test, `mcp_server` vitest suites for the core
  and the Stop hook transport) all passing live

---

## 2. SCENARIO CONTRACT

- Preconditions: repository checked out at project root; Node.js available on `PATH` (verified
  live on v22.23.1); `mcp_server` dependencies installed so `npx vitest` resolves under
  `.opencode/skills/system-spec-kit/mcp-server`. No live OpenCode or Claude Code session is
  required for the automatable evidence below -- the core and both runtime adapters are
  hermetically testable via direct `node` invocation.
- Real user-facing trigger: an agent in a live Claude Code or OpenCode session ends a turn with a
  completion claim (for example "...all done." or "...shipped.") that references a spec folder
  which has NOT recorded qualifying evidence -- either a `checklist.md` with a completed P0/P1 item
  lacking an evidence marker, or a Level 1 folder missing `implementation-summary.md`.
- Expected signals:
  - First occurrence: core returns `{"decision":"advise","detail":"claimed done but ...","deduped":false}`.
  - Identical claim text against the identical packet, next check: `{"decision":"ok","detail":null,"deduped":true}`.
  - A genuinely satisfied packet (implementation-summary.md present, or a fully evidenced
    checklist): `{"decision":"ok","detail":null,"deduped":false}`.
  - `MK_COMPLETION_SENTINEL_DISABLED=1` (any adapter, any call): unconditional `{"decision":"ok"}`,
    no filesystem probe, no advisory written.
  - The OpenCode plugin appends the advisory line to
    `.opencode/logs/completion-sentinel-advisories.log` and never writes stdout/stderr.
  - The Claude Stop hook writes the same advisory text to stderr (`WARN [speckit-hook:completion-evidence-stop] ...`)
    AND appends it to the identical shared log, and its process always exits `0` (never blocks the
    turn, even on `stop_hook_active:true` or invalid stdin).
- Pass/fail: PASS if the core's claim-detection, evidence-evaluation, dedup, kill-switch, and sweep
  logic behave as specified above AND the OpenCode plugin's own unit test AND the `mcp_server`
  vitest suites (core + Stop hook transport) all pass AND a fresh, out-of-suite live invocation of
  the core, the OpenCode adapter, and the Claude Stop hook reproduce the same behavior. FAIL if any
  suite fails, if the sentinel ever returns a block-shaped decision or a non-zero exit from the Stop
  hook, or if an evidence-missing packet is silently approved.

---

## 3. TEST EXECUTION

### 1. OpenCode plugin unit test (session.created sweep, kill switch, throttling, unrelated event)

```bash
node .opencode/plugins/tests/mk-completion-sentinel.test.cjs
```

Expected: `# tests 4`, `# pass 4`, `# fail 0`.

### 2. mcp_server vitest suites for the core and the Claude Stop hook transport

```bash
cd .opencode/skills/system-spec-kit/mcp-server && \
  npx vitest run tests/completion-evidence-sentinel.vitest.ts tests/hook-completion-evidence-stop.vitest.ts
```

Expected: `Test Files  2 passed (2)`, `Tests  28 passed (28)`.

### 3. Live invocation of the runtime-neutral core (claim detection, evidence, dedup, kill switch, sweep)

Run from the project root. This writes a script to a temp path, executes it against a disposable
`mkdtemp` scratch project directory (never touching the real repo), and cleans up after itself.

```bash
SCRIPT="$(mktemp -t sentinel-live-invoke).cjs"
cat > "$SCRIPT" <<'NODE_EOF'
'use strict';
const path = require('node:path');
const fs = require('node:fs');
const os = require('node:os');

const core = require(path.resolve(process.cwd(), '.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs'));
const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentinel-core-live-'));

function section(title) { console.log(`\n--- ${title} ---`); }

try {
  section('detectCompletionClaim');
  console.log('claim tail   =>', core.detectCompletionClaim('I looked at the logs. I fixed the bug and shipped it.'));
  console.log('non-claim    =>', core.detectCompletionClaim('I am investigating the bug and reading the logs.'));
  console.log('empty string =>', core.detectCompletionClaim(''));

  section('resolveSpecFolderFromText');
  console.log(core.resolveSpecFolderFromText('All done, see specs/999-fake-packet/checklist.md for evidence.'));
  console.log(core.resolveSpecFolderFromText('No spec folder mentioned here.'));

  fs.mkdirSync(path.join(projectDir, 'specs/999-fake-packet'), { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, 'specs/999-fake-packet/checklist.md'),
    '# Checklist\n\n- [x] [P0] Implement the core feature\n- [x] [P1] Add tests\n',
  );

  section('evaluateCompletionEvidence -- checklist present, P0/P1 complete, NO evidence markers (expect advise)');
  const claimTextA = 'I have completed everything in specs/999-fake-packet, all done.';
  console.log(JSON.stringify(core.evaluateCompletionEvidence({
    specFolder: 'specs/999-fake-packet', claimText: claimTextA, projectDir, env: process.env,
  }), null, 2));

  section('evaluateCompletionEvidence -- SAME claim again (expect dedup: decision=ok, deduped=true)');
  console.log(JSON.stringify(core.evaluateCompletionEvidence({
    specFolder: 'specs/999-fake-packet', claimText: claimTextA, projectDir, env: process.env,
  }), null, 2));

  section('evaluateCompletionEvidence -- Level 1 packet, no checklist.md, no implementation-summary.md (expect advise)');
  fs.mkdirSync(path.join(projectDir, 'specs/999-level1-no-summary'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'specs/999-level1-no-summary/spec.md'), '# Spec\n');
  console.log(JSON.stringify(core.evaluateCompletionEvidence({
    specFolder: 'specs/999-level1-no-summary',
    claimText: 'Finished implementing the small fix, all done.',
    projectDir, env: process.env,
  }), null, 2));

  section('evaluateCompletionEvidence -- Level 1 packet WITH implementation-summary.md (expect decision=ok)');
  fs.mkdirSync(path.join(projectDir, 'specs/999-level1-with-summary'), { recursive: true });
  fs.writeFileSync(path.join(projectDir, 'specs/999-level1-with-summary/implementation-summary.md'), '# Implementation Summary\nDone.\n');
  console.log(JSON.stringify(core.evaluateCompletionEvidence({
    specFolder: 'specs/999-level1-with-summary',
    claimText: 'Finished implementing the small fix, all done.',
    projectDir, env: process.env,
  }), null, 2));

  section('evaluateCompletionEvidence -- KILL SWITCH env=1 (expect decision=ok, no evaluation at all)');
  console.log(JSON.stringify(core.evaluateCompletionEvidence({
    specFolder: 'specs/999-fake-packet',
    claimText: 'This is a brand-new claim text never seen before, all done.',
    projectDir, env: { ...process.env, [core.KILL_SWITCH_ENV]: '1' },
  }), null, 2));

  section('sweepStaleSentinelState -- prune a manually-aged dedup entry');
  const { stateDir } = core.resolveSentinelPaths(projectDir);
  const dedupPath = path.join(stateDir, 'advisory-dedup.json');
  const before = JSON.parse(fs.readFileSync(dedupPath, 'utf8'));
  console.log('dedup store before sweep (keys):', Object.keys(before));
  const aged = {};
  for (const [k, v] of Object.entries(before)) {
    aged[k] = { ...v, advisedAt: new Date(Date.now() - 400 * 24 * 60 * 60 * 1000).toISOString() };
  }
  fs.writeFileSync(dedupPath, JSON.stringify(aged), 'utf8');
  core.sweepStaleSentinelState(projectDir, { lastSentinelSweepAtMs: 0 });
  console.log('dedup store after sweep:', JSON.stringify(JSON.parse(fs.readFileSync(dedupPath, 'utf8'))));
} finally {
  fs.rmSync(projectDir, { recursive: true, force: true });
}
NODE_EOF
node "$SCRIPT"
rm -f "$SCRIPT"
```

Expected: `advise` on the checklist-evidence-missing check, `ok`/`deduped:true` on the repeat, `advise`
for the Level 1 folder without `implementation-summary.md`, `ok` for the one with it, `ok` when the
kill switch env is set, and an empty dedup store (`{}`) after the sweep.

### 4. Live invocation of the full OpenCode adapter (session.idle -> ctx.client -> log)

```bash
SCRIPT="$(mktemp -t sentinel-live-adapter).mjs"
cat > "$SCRIPT" <<'NODE_EOF'
import path from 'node:path';
import fs from 'node:fs';
import os from 'node:os';
import { pathToFileURL } from 'node:url';

const pluginUrl = pathToFileURL(path.resolve(process.cwd(), '.opencode/plugins/mk-completion-sentinel.js')).href;
const { default: MkCompletionSentinelPlugin } = await import(pluginUrl);
const projectDir = fs.mkdtempSync(path.join(os.tmpdir(), 'sentinel-adapter-live-'));

try {
  fs.mkdirSync(path.join(projectDir, 'specs/999-adapter-packet'), { recursive: true });
  fs.writeFileSync(
    path.join(projectDir, 'specs/999-adapter-packet/checklist.md'),
    '# Checklist\n\n- [x] [P0] Implement the core feature\n- [x] [P1] Add tests\n',
  );
  const claimText = 'All good, I have finished and shipped specs/999-adapter-packet, all done.';
  const fakeClient = {
    session: {
      async messages({ path: p, query }) {
        console.log('client.session.messages() called with', JSON.stringify({ path: p, query }));
        return {
          data: [
            { info: { role: 'user' }, parts: [{ type: 'text', text: 'please finish the packet' }] },
            { info: { role: 'assistant' }, parts: [{ type: 'text', text: claimText, ignored: false }] },
          ],
        };
      },
    },
  };
  const hooks = await MkCompletionSentinelPlugin({ directory: projectDir, client: fakeClient });

  console.log('\n--- dispatching session.idle through the OpenCode adapter ---');
  await hooks.event({ event: { type: 'session.idle', sessionID: 'sess-live-adapter-test' } });

  const logPath = path.join(projectDir, '.opencode/logs/completion-sentinel-advisories.log');
  console.log('\n--- advisory log contents ---');
  console.log(fs.readFileSync(logPath, 'utf8'));

  console.log('--- dispatching the SAME session.idle event again (expect dedup: no new log line) ---');
  await hooks.event({ event: { type: 'session.idle', sessionID: 'sess-live-adapter-test' } });
  const logContents2 = fs.readFileSync(logPath, 'utf8');
  console.log('log line count first vs second pass: 1 vs', logContents2.trim().split('\n').length);
} finally {
  fs.rmSync(projectDir, { recursive: true, force: true });
}
NODE_EOF
node "$SCRIPT"
rm -f "$SCRIPT"
```

Expected: one advisory log line after the first `session.idle`, and the SAME single line (no
duplicate append) after the second, dedicated to `deduped:true` in the core.

### 5. Direct manual invocation of the real Claude Stop hook (stdin contract, exit-code contract)

```bash
REPO_ROOT="$(pwd)"
PROJECT_DIR="$(mktemp -d)"
SPEC_DIR="$(mktemp -d)"
SESSION_ID="manual-stop-hook-demo"
node -e "
const crypto = require('node:crypto');
const fs = require('node:fs');
const path = require('node:path');
const os = require('node:os');
const projectHash = crypto.createHash('sha256').update(fs.realpathSync('$PROJECT_DIR')).digest('hex').slice(0,12);
const sessionHash = crypto.createHash('sha256').update('$SESSION_ID').digest('hex').slice(0,16);
const stateDir = path.join(os.tmpdir(), 'speckit-claude-hooks', projectHash);
fs.mkdirSync(stateDir, { recursive: true });
fs.writeFileSync(path.join(stateDir, sessionHash + '.json'), JSON.stringify({ lastSpecFolder: '$SPEC_DIR' }), 'utf8');
"
printf '%s' '{"stop_hook_active":false,"session_id":"'"$SESSION_ID"'","last_assistant_message":"The core is now complete and shipped."}' \
  | (cd "$PROJECT_DIR" && node "$REPO_ROOT/.opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs")
echo "exit code: $?"
cat "$PROJECT_DIR/.opencode/logs/completion-sentinel-advisories.log"
rm -rf "$PROJECT_DIR" "$SPEC_DIR"
```

Note: `REPO_ROOT` is captured before the `cd`, and the hook script is invoked by its ABSOLUTE
`$REPO_ROOT/.opencode/skills/.../completion-evidence-stop.cjs` path. This is required because the
`cd "$PROJECT_DIR"` puts the shell in a disposable scratch directory that has no `.opencode/`
subtree, so a repo-relative script path would fail with `MODULE_NOT_FOUND`. The `cd` into
`$PROJECT_DIR` is still intentional and must stay: the hook derives BOTH its `projectDir` (where it
writes the advisory log) and its `sha256(cwd)` state-file lookup key from `process.cwd()`, so the
hook's working directory has to be `$PROJECT_DIR` — matching the state file seeded above — for the
seeded `lastSpecFolder` to resolve. Only the script PATH is absolute; the runtime CWD payload the
hook consumes is `$PROJECT_DIR`, exactly as `.claude/settings.json` wires it (`cd
"${CLAUDE_PROJECT_DIR:-$PWD}" && node <repo-relative hook>`), where the project dir and the repo
root coincide in production.

Expected: `WARN [speckit-hook:completion-evidence-stop] claimed done but no implementation-summary.md
recorded in <SPEC_DIR>` on stderr, `exit code: 0`, and the identical line appended to
`.opencode/logs/completion-sentinel-advisories.log` under `$PROJECT_DIR`.

### Kill-switch flip (covered inline above and in the suites)

`MK_COMPLETION_SENTINEL_DISABLED=1` is exercised as a full no-op in: the core's own kill-switch unit
test (`completion-evidence-sentinel.vitest.ts`), the OpenCode plugin's kill-switch unit test
(`mk-completion-sentinel.test.cjs`), the Claude Stop hook's kill-switch vitest
(`hook-completion-evidence-stop.vitest.ts`), and step 3's live invocation above (`KILL SWITCH env=1`
section). No separate live flip was needed beyond those four independent confirmations.

---

## 4. EVIDENCE

### Step 1 -- OpenCode plugin unit test

Command:

```bash
node .opencode/plugins/tests/mk-completion-sentinel.test.cjs
```

Output:

```text
TAP version 13
# Subtest: session.created invokes the throttled state sweep, pruning a stale dedup entry
ok 1 - session.created invokes the throttled state sweep, pruning a stale dedup entry
# Subtest: kill switch (MK_COMPLETION_SENTINEL_DISABLED=1) makes session.created a full no-op, sweep included
ok 2 - kill switch (MK_COMPLETION_SENTINEL_DISABLED=1) makes session.created a full no-op, sweep included
# Subtest: a second session.created on the same plugin instance within the sweep interval is throttled (no re-sweep)
ok 3 - a second session.created on the same plugin instance within the sweep interval is throttled (no re-sweep)
# Subtest: an unrelated event type never triggers the sweep
ok 4 - an unrelated event type never triggers the sweep
1..4
# tests 4
# suites 0
# pass 4
# fail 0
# cancelled 0
# skipped 0
# todo 0
```

### Step 2 -- mcp_server vitest suites (core + Claude Stop hook transport)

Command:

```bash
cd .opencode/skills/system-spec-kit/mcp-server && \
  npx vitest run tests/completion-evidence-sentinel.vitest.ts tests/hook-completion-evidence-stop.vitest.ts --reporter=verbose
```

Output:

```text
 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > exists as a real, spawnable script 1ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > P1 regression: a normal turn-end (stop_hook_active:false) with a completion claim reaches evidence evaluation 31ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > missing stop_hook_active field (undefined) behaves like a normal turn-end and still evaluates 34ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > a re-entrant continuation (stop_hook_active:true) still skips evaluation 26ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > a non-claim message never reaches evaluation regardless of stop_hook_active 26ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > kill switch: MK_COMPLETION_SENTINEL_DISABLED=1 makes the hook a full no-op even on a normal turn-end 25ms
 ✓ mcp-server/tests/hook-completion-evidence-stop.vitest.ts > completion-evidence-stop.cjs (Claude Stop hook transport) > invalid stdin JSON fails open silently 26ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > detectCompletionClaim anchors to the trailing slice of the turn 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > resolveSpecFolderFromText extracts a spec-folder-shaped path and trims trailing punctuation 0ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-001: no completion claim is a no-op and never spawns check-completion.sh 2ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-001: a completion claim with no resolved spec folder is a no-op 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-002 fixture A: a completed P0 item lacking an evidence marker advises EVIDENCE_MISSING 13ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-002 fixture B: the same packet with a full evidence marker resolves ok 11ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-003: a Level 1 folder with no checklist.md and no implementation-summary.md advises 2ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-003: a Level 1 folder WITH implementation-summary.md resolves ok 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-004: never invokes validate.sh, vitest, npm test, or a build 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-004: a forced internal error (unexpected spawn failure shape) fails open to ok 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-007: dedups an identical packet+message pair to at most one advisory 22ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > REQ-007: a different claim against the same packet advises again (fingerprint changed) 25ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > kill switch: MK_COMPLETION_SENTINEL_DISABLED=1 makes the core a full no-op 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > completion-evidence-sentinel core > appendAdvisoryLog writes a bounded, append-only line under .opencode/logs 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > prunes a stale dedup entry by advisedAt age while keeping a fresh one 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > removes a stray .tmp file older than the retention window, keeps a fresh one 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > age-prunes the rotated advisory-log backup past the retention window 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > keeps a rotated advisory-log backup that is still within the retention window 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > an unreadable/corrupt dedup store is a no-op: never throws, never rewrites 2ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > kill switch (MK_COMPLETION_SENTINEL_DISABLED=1) makes the sweep a full no-op 1ms
 ✓ mcp-server/tests/completion-evidence-sentinel.vitest.ts > sweepStaleSentinelState (throttled, adapter-invoked, fail-open state maintenance) > throttles a second sweep on the same runtimeState within the interval (no-op) 2ms

 Test Files  2 passed (2)
      Tests  28 passed (28)
   Start at  14:40:44
   Duration  431ms (transform 25ms, setup 16ms, import 27ms, tests 263ms, environment 0ms)
```

### Step 3 -- live invocation of the core (real stdout, executed from project root)

```text
--- detectCompletionClaim ---
claim tail   => true
non-claim    => false
empty string => false

--- resolveSpecFolderFromText ---
specs/999-fake-packet/checklist.md
null

--- evaluateCompletionEvidence -- checklist present, P0/P1 complete, NO evidence markers (expect advise) ---
{
  "decision": "advise",
  "detail": "claimed done but 2 completed P0/P1 checklist item(s) in specs/999-fake-packet lack an evidence marker",
  "deduped": false
}

--- evaluateCompletionEvidence -- SAME claim again (expect dedup: decision=ok, deduped=true) ---
{
  "decision": "ok",
  "detail": null,
  "deduped": true
}

--- evaluateCompletionEvidence -- Level 1 packet, no checklist.md, no implementation-summary.md (expect advise) ---
{
  "decision": "advise",
  "detail": "claimed done but no implementation-summary.md recorded in specs/999-level1-no-summary",
  "deduped": false
}

--- evaluateCompletionEvidence -- Level 1 packet WITH implementation-summary.md (expect decision=ok) ---
{
  "decision": "ok",
  "detail": null,
  "deduped": false
}

--- evaluateCompletionEvidence -- KILL SWITCH env=1 (expect decision=ok, no evaluation at all) ---
{
  "decision": "ok",
  "detail": null,
  "deduped": false
}

--- sweepStaleSentinelState -- prune a manually-aged dedup entry ---
dedup store before sweep (keys): [ '4873147ec28c50b9ebc1d91c', '41f4c004c3e5e7609601528b' ]
dedup store after sweep: {}
```

### Step 4 -- live invocation of the full OpenCode adapter (real stdout, fake ctx.client)

```text
--- dispatching session.idle through the OpenCode adapter ---
client.session.messages() called with {"path":{"id":"sess-live-adapter-test"},"query":{"limit":20}}

--- advisory log contents ---
2026-07-11T12:42:30.786Z [completion-evidence-sentinel] claimed done but 2 completed P0/P1 checklist item(s) in specs/999-adapter-packet lack an evidence marker

--- dispatching the SAME session.idle event again (expect dedup: no new log line) ---
client.session.messages() called with {"path":{"id":"sess-live-adapter-test"},"query":{"limit":20}}
log line count first vs second pass: 1 vs 1
```

### Step 5 -- direct manual invocation of the real Claude Stop hook (real stdout/stderr)

Command as documented above, run fresh from the repo root (`REPO_ROOT="$(pwd)"` captured before the
`cd "$PROJECT_DIR"`; hook invoked by absolute `$REPO_ROOT/.opencode/.../completion-evidence-stop.cjs`
path while CWD is `$PROJECT_DIR`). Real output:

```text
WARN [speckit-hook:completion-evidence-stop] claimed done but no implementation-summary.md recorded in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/tmp.X9LI0uE5ue
exit code: 0
2026-07-11T16:40:25.639Z [completion-evidence-sentinel] claimed done but no implementation-summary.md recorded in /var/folders/3c/zfqcqsts0kn19cgblj82gqhm0000gn/T/tmp.X9LI0uE5ue
```

The `WARN [speckit-hook:completion-evidence-stop] ...` line is stderr, `exit code: 0` confirms the
hook never blocked, and the trailing `[completion-evidence-sentinel] ...` line is the identical
advisory appended to `$PROJECT_DIR/.opencode/logs/completion-sentinel-advisories.log`.

---

## 5. SOURCE FILES

- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- OpenCode plugin (adapter): `.opencode/plugins/mk-completion-sentinel.js`
- OpenCode plugin unit test: `.opencode/plugins/tests/mk-completion-sentinel.test.cjs`
- Runtime-neutral core: `.opencode/skills/system-spec-kit/mcp-server/lib/hooks/completion-evidence-sentinel.cjs`
- Core vitest suite: `.opencode/skills/system-spec-kit/mcp-server/tests/completion-evidence-sentinel.vitest.ts`
- Claude Stop hook (adapter): `.opencode/skills/system-spec-kit/mcp-server/hooks/claude/completion-evidence-stop.cjs`
- Claude Stop hook vitest suite: `.opencode/skills/system-spec-kit/mcp-server/tests/hook-completion-evidence-stop.vitest.ts`
- Shared completion-state helper: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`
- Checklist evaluator script: `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh`
- Claude hook wiring: `.claude/settings.json` (`hooks.Stop`)

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: completion-evidence-sentinel
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/completion-evidence-sentinel.md

---

## 7. PASS/FAIL

PASS

The OpenCode plugin's own unit test (4/4), the `mcp_server` vitest suites covering the
runtime-neutral core and the Claude Stop hook transport (28/28, `Test Files 2 passed (2)`), and
three independent fresh live invocations (the core directly, the full OpenCode adapter with a fake
`ctx.client`, and the real Claude Stop hook script via stdin) all reproduced the specified behavior
with no fabricated output: claim detection anchored to the trailing slice of the turn; a
checklist with a completed P0/P1 item lacking an evidence marker advised `EVIDENCE_MISSING`; the
identical claim against the identical packet deduped to `ok` on the next check; a Level 1 folder
without `implementation-summary.md` advised, the same folder with it resolved `ok`; the
`MK_COMPLETION_SENTINEL_DISABLED=1` kill switch made every layer (core, OpenCode plugin, Claude
Stop hook) a full no-op; the throttled sweep pruned an artificially aged dedup entry to `{}`; the
OpenCode adapter appended exactly one advisory log line across two identical `session.idle` events
(dedup held at the adapter layer); and the Claude Stop hook printed the advisory to stderr, appended
the identical line to the shared log, and exited `0` on every path, including the re-entrant
`stop_hook_active:true` and invalid-stdin cases covered by the vitest suite. No block-shaped
decision, no stdout emission, and no evidence-missing packet was ever silently approved.
