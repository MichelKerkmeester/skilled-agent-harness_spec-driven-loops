---
title: "Completion Evidence Sentinel"
description: "Manual scenario validating the system-completion-sentinel plugin and Stop hook advisory flow."
trigger_phrases:
  - "plg-001"
  - "system-completion-sentinel"
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

`system-completion-sentinel` is an OpenCode plugin (`.opencode/plugins/system-completion-sentinel.js`) that
adapts the runtime-neutral core `completion-evidence-sentinel.cjs`
(`.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`) onto
OpenCode's `session.idle` and `session.created` events. The identical core is also consumed by a
standalone Claude Code Stop hook,
`.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`, wired in
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
- the `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` kill switch as a full no-op on the core, the OpenCode
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
  `.opencode/skills/system-spec-kit/runtime`. No live OpenCode or Claude Code session is
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
  - `SYSTEM_COMPLETION_SENTINEL_DISABLED=1` (any adapter, any call): unconditional `{"decision":"ok"}`,
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

### Prompt

- Prompt: `Validate the Completion Evidence Sentinel end to end against the commands below, and report a PASS or FAIL verdict with cited command output.`

```text
an agent in a live Claude Code or OpenCode session ends a turn with a
```

### Commands

### 1. OpenCode plugin unit test (session.created sweep, kill switch, throttling, unrelated event)

```bash
node .opencode/plugins/tests/system-completion-sentinel.test.cjs
```

Expected: `# tests 4`, `# pass 4`, `# fail 0`.

### 2. mcp_server vitest suites for the core and the Claude Stop hook transport

```bash
cd .opencode/skills/system-spec-kit/runtime && \
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

const core = require(path.resolve(process.cwd(), '.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs'));
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

const pluginUrl = pathToFileURL(path.resolve(process.cwd(), '.opencode/plugins/system-completion-sentinel.js')).href;
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
  | (cd "$PROJECT_DIR" && node "$REPO_ROOT/.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs")
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

`SYSTEM_COMPLETION_SENTINEL_DISABLED=1` is exercised as a full no-op in: the core's own kill-switch unit
test (`completion-evidence-sentinel.vitest.ts`), the OpenCode plugin's kill-switch unit test
(`system-completion-sentinel.test.cjs`), the Claude Stop hook's kill-switch vitest
(`hook-completion-evidence-stop.vitest.ts`), and step 3's live invocation above (`KILL SWITCH env=1`
section). No separate live flip was needed beyond those four independent confirmations.

### Evidence

Capture, for every step in the Commands sequence above:

- The exact command or tool call issued, its full output, and its exit status.
- The output lines that carry each expected signal listed in the Scenario Contract.
- Any deviation from the expected result, quoted verbatim from the output.
- The resolved path of every file or log the run reads or writes.

### Pass / Fail

- **Pass**: The core's claim-detection, evidence-evaluation, dedup, kill-switch, and sweep.
- **Fail**: The Pass condition above is not met, or any command in the sequence errors unexpectedly.

### Failure Triage

1. Re-run each command in the sequence on its own and record its exit status; the first non-zero exit names the failing step.
2. Confirm the plugin host, bridge, and core files listed in section 4 are the ones actually loaded, and that any compiled output is current.
3. Compare the observed output field by field against the expected signals in section 2, and quote the first field that disagrees.


---

## 4. SOURCE FILES


- Root playbook: [manual-testing-playbook.md](../../manual-testing-playbook/manual-testing-playbook.md)
- OpenCode plugin (adapter): `.opencode/plugins/system-completion-sentinel.js`
- OpenCode plugin unit test: `.opencode/plugins/tests/system-completion-sentinel.test.cjs`
- Runtime-neutral core: `.opencode/skills/system-spec-kit/runtime/lib/hooks/completion-evidence-sentinel.cjs`
- Core vitest suite: `.opencode/skills/system-spec-kit/runtime/tests/completion-evidence-sentinel.vitest.ts`
- Claude Stop hook (adapter): `.opencode/skills/system-spec-kit/runtime/hooks/claude/completion-evidence-stop.cjs`
- Claude Stop hook vitest suite: `.opencode/skills/system-spec-kit/runtime/tests/hook-completion-evidence-stop.vitest.ts`
- Shared completion-state helper: `.opencode/skills/system-spec-kit/scripts/lib/completion-state.cjs`
- Checklist evaluator script: `.opencode/skills/system-spec-kit/scripts/spec/check-completion.sh`
- Claude hook wiring: `.claude/settings.json` (`hooks.Stop`)

---

## 5. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: completion-evidence-sentinel
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/completion-evidence-sentinel.md
