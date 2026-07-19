---
title: "Code Graph Freshness Guard"
description: "Manual scenario validating the mk-code-graph-freshness plugin and hook."
trigger_phrases:
  - "plg-001"
  - "code graph freshness guard"
  - "mk-code-graph-freshness"
  - "code-graph-freshness-guard"
  - "stale code graph self-heal"
version: 1.0.0.0
id: code-graph-freshness-guard
category: plugins_and_hooks
stage: routing
expected_workflow_mode: system-code-graph
expected_leaf_resources: []
---

# Code Graph Freshness Guard

<!-- sk-doc-template: manual_testing_playbook -->

---

## 1. OVERVIEW

`mk-code-graph-freshness` lets an already-established, warm structural code graph self-heal from soft-stale back to fresh without an operator manually re-running a scan. After a source-file Write/Edit lands, it debounces the edit burst per session, and -- only when the graph is not empty and the daemon is already warm -- fire-and-forget dispatches a warm-only incremental `code_graph_scan`. It never blocks the tool call it observed, never cold-starts the daemon, and never writes stdout/stderr.

The policy is a single runtime-neutral core (`freshness-core.cjs`) consumed by two thin transport adapters that must agree on identical behavior:
- The OpenCode plugin (`mk-code-graph-freshness.js`), which correlates `tool.execute.before`/`tool.execute.after` by `callID` and owns a real in-memory debounce-drain timer plus `session.created` leftover-drain.
- The Claude Code PostToolUse hook (`code-graph-freshness.cjs`), a short-lived process that must release the shared scan lock synchronously (it cannot rely on a detached child's `exit` event firing before its own `process.exit(0)`).

This scenario validates:
- The fixed gate order in `evaluateEdit()`: disabled -> in-scope filter -> empty-graph gate -> debounce -> warm probe -> concurrency -> scan.
- The OpenCode plugin's before/after callID correlation (a P0 regression fix: `tool.execute.after`'s own output never carries `args`, only its input does).
- The Claude hook's synchronous scan-lock release (a P1 regression fix) and its fail-open behavior on malformed input.
- The kill-switch (`MK_CODE_GRAPH_FRESHNESS_DISABLED=1`) makes both adapters a full no-op.
- The guard's actual live state against this real project's current readiness/owner markers.

---

## 2. SCENARIO CONTRACT

- Preconditions:
  - `.opencode/plugins/mk-code-graph-freshness.js` exists (OpenCode adapter).
  - `.opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs` exists (Claude adapter).
  - `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs` exists (shared runtime-neutral core).
  - Claude wiring: `.claude/settings.json` `hooks.PostToolUse` has a `Write|Edit` matcher block that runs this hook, co-resident with `sk-code`'s `claude-posttooluse.cjs` in the same block.
- Real user-facing trigger: an agent edits a source file with Write or Edit inside a live Claude Code or OpenCode session. There is no explicit user command for this guard; it is silent background infrastructure that fires after every mutating tool call.
- Expected signals:
  - `evaluateEdit()` returns exactly one of `skip | defer-empty | defer-debounce | defer-cold | defer-inflight | scan`.
  - A `scan` decision carries `dispatch.bin = ".opencode/bin/code-index.cjs"` with args including `code_graph_scan`, `--json` `{"incremental":true}`, and `--warm-only`.
  - The Claude hook process always exits `0` and never writes to stdout/stderr, even on malformed JSON input.
  - The OpenCode plugin's `tool.execute.after` retrieves the file path stashed by `tool.execute.before` via `callID`, never via `output.args` (which is always `undefined` on `after`'s own output).
  - The shared scan lock (`.scan.lock`) never survives past the dispatching process's own exit.
  - `MK_CODE_GRAPH_FRESHNESS_DISABLED=1` suppresses every adapter path, including lock acquisition, for both runtimes.
- Pass/fail: PASS if the unit-test suites are green, the gate order is provably followed against real hermetic fixtures (empty-graph gate, debounce, warm-probe, scan, kill-switch), and the Claude hook releases its lock synchronously with exit 0. FAIL if any gate is bypassed, the lock leaks past process exit, or the hook ever blocks/crashes the tool call it observed.

---

## 3. TEST EXECUTION

1. Run the plugin's Node test-runner unit-test suite (P0/P1/P2 regression pins):

```bash
node .opencode/plugins/tests/mk-code-graph-freshness.test.cjs
```

Expected: `# tests 12`, `# pass 12`, `# fail 0`.

2. Run the shared core's Vitest spec:

```bash
cd .opencode/skills/system-code-graph && npx vitest run runtime/lib/code-graph/freshness-core.vitest.ts
```

Expected: `Test Files  1 passed (1)`, `Tests  19 passed (19)`.

3. Exercise `evaluateEdit()`/`classifyEditScope()`/`probeDaemonWarm()` directly against real, hermetic temp-project fixtures (in-scope filter, cold-daemon debounce, scan dispatch, empty-graph gate, kill-switch):

```bash
node -e '
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const core = require("./.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs");

function tmp(prefix) { return fs.mkdtempSync(path.join(os.tmpdir(), prefix)); }
function seedReadiness(dir, graphFreshness) {
  const d = path.join(dir, ".opencode/skills/system-code-graph/mcp-server/database");
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, ".code-graph-readiness.json"), JSON.stringify({ graphFreshness }));
}
function seedOwner(dir, iso, ttlMs) {
  const d = path.join(dir, ".opencode/skills/system-code-graph/mcp-server/database");
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, ".code-graph-owner.json"), JSON.stringify({ lastHeartbeatIso: iso, ttlMs }));
}

console.log("classifyEditScope: src/foo.ts ->", JSON.stringify(core.classifyEditScope("src/foo.ts", {})));
console.log("classifyEditScope: .opencode/plugins/mk-code-graph-freshness.js ->", JSON.stringify(core.classifyEditScope(".opencode/plugins/mk-code-graph-freshness.js", {})));
console.log("classifyEditScope: README.md ->", JSON.stringify(core.classifyEditScope("README.md", {})));

const dirCold = tmp("mk-freshness-live-cold-");
seedReadiness(dirCold, "stale");
console.log("evaluateEdit (first edit, no owner heartbeat) ->", JSON.stringify(core.evaluateEdit({ filePath: "src/foo.ts", sessionID: "live-session-1", projectDir: dirCold, env: {} })));

const dirScan = tmp("mk-freshness-live-scan-");
seedReadiness(dirScan, "stale");
seedOwner(dirScan, new Date().toISOString(), 60000);
core.writeDebounceStateAtomic(core.resolveFreshnessPaths(dirScan).stateDir, core.sessionStateKey("live-session-2"), {
  pending: ["src/bar.ts"], firstPendingAt: Date.now() - 25000, lastEditAt: Date.now() - 25000,
});
console.log("evaluateEdit (quiet elapsed + warm daemon) ->", JSON.stringify(core.evaluateEdit({ filePath: "src/bar.ts", sessionID: "live-session-2", projectDir: dirScan, env: {} })));

const dirEmpty = tmp("mk-freshness-live-empty-");
seedReadiness(dirEmpty, "empty");
console.log("evaluateEdit (empty graph, no bootstrap) ->", JSON.stringify(core.evaluateEdit({ filePath: "src/foo.ts", sessionID: "live-session-3", projectDir: dirEmpty, env: {} })));

const dirKill = tmp("mk-freshness-live-kill-");
seedReadiness(dirKill, "stale");
console.log("evaluateEdit (kill-switch) ->", JSON.stringify(core.evaluateEdit({ filePath: "src/foo.ts", sessionID: "live-session-4", projectDir: dirKill, env: { MK_CODE_GRAPH_FRESHNESS_DISABLED: "1" } })));

console.log("probeDaemonWarm (real repo owner marker) ->", JSON.stringify(core.probeDaemonWarm({ projectDir: process.cwd() })));

for (const d of [dirCold, dirScan, dirEmpty, dirKill]) fs.rmSync(d, { recursive: true, force: true });
'
```

Expected: `.opencode/plugins` and `.opencode/skills` classify out-of-scope (excluded-dir), `README.md` classifies out-of-scope (non-source extension), a plain `src/foo.ts` stays in-scope; a fresh edit with no prior debounce state returns `defer-debounce`; a quiet-elapsed + warm-daemon edit returns `scan` with the exact `code-index.cjs code_graph_scan --warm-only` dispatch spec; `graphFreshness: "empty"` without the bootstrap opt-in returns `defer-empty`; the kill-switch returns `skip`/`disabled`.

4. Run the live Claude PostToolUse hook end-to-end (via `spawnSync`, matching the real `tool_name`/`tool_input`/`cwd`/`session_id` PostToolUse payload shape) against a scan-ready fixture, and confirm the lock never leaks past the hook's own exit:

```bash
node -e '
const path = require("node:path");
const fs = require("node:fs");
const os = require("node:os");
const { spawnSync } = require("node:child_process");
const core = require("./.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs");

function tmp(prefix) { return fs.mkdtempSync(path.join(os.tmpdir(), prefix)); }
function seedReadiness(dir, graphFreshness) {
  const d = path.join(dir, ".opencode/skills/system-code-graph/mcp-server/database");
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, ".code-graph-readiness.json"), JSON.stringify({ graphFreshness }));
}
function seedOwner(dir, iso, ttlMs) {
  const d = path.join(dir, ".opencode/skills/system-code-graph/mcp-server/database");
  fs.mkdirSync(d, { recursive: true });
  fs.writeFileSync(path.join(d, ".code-graph-owner.json"), JSON.stringify({ lastHeartbeatIso: iso, ttlMs }));
}

const dir = tmp("mk-freshness-live-claude-hook-");
seedReadiness(dir, "stale");
seedOwner(dir, new Date().toISOString(), 60000);
core.writeDebounceStateAtomic(core.resolveFreshnessPaths(dir).stateDir, core.sessionStateKey("live-claude-session"), {
  pending: ["src/bar.ts"], firstPendingAt: Date.now() - 25000, lastEditAt: Date.now() - 25000,
});

const result = spawnSync(process.execPath, [".opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs"], {
  input: JSON.stringify({ tool_name: "Edit", tool_input: { file_path: "src/bar.ts" }, cwd: dir, session_id: "live-claude-session" }),
  encoding: "utf8", timeout: 10000,
});
console.log("exit status:", result.status);
console.log("stdout:", JSON.stringify(result.stdout));
console.log("stderr:", JSON.stringify(result.stderr));

const lockPath = core.resolveFreshnessPaths(dir).lockPath;
console.log("lock file exists after exit:", fs.existsSync(lockPath));

const debouncePath = path.join(core.resolveFreshnessPaths(dir).stateDir, core.sessionStateKey("live-claude-session") + ".json");
console.log("debounce state after scan:", fs.readFileSync(debouncePath, "utf8"));

fs.rmSync(dir, { recursive: true, force: true });
'
```

Expected: exit status `0`, empty stdout/stderr, lock file absent after exit, and the session's debounce state cleared to `pending: []`.

5. Live-repo state check (the real project's own markers, not a fixture -- explains what the guard would actually do right now):

```bash
cat .opencode/skills/system-code-graph/mcp-server/database/.code-graph-readiness.json
cat .opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json
ls -la .opencode/skills/.code-graph-freshness-state
```

Expected/observed: whatever the real project's current `graphFreshness` and daemon heartbeat are; the accompanying `evaluateEdit()` decision this yields is documented in Evidence below.

---

## 4. EVIDENCE

Node test-runner unit-test tail (`node .opencode/plugins/tests/mk-code-graph-freshness.test.cjs`):

```text
# Subtest: Claude hook is a full no-op under its kill-switch env (no lock ever acquired)
ok 12 - Claude hook is a full no-op under its kill-switch env (no lock ever acquired)
  ---
  duration_ms: 31.162333
  type: 'test'
  ...
1..12
# tests 12
# suites 0
# pass 12
# fail 0
# cancelled 0
# skipped 0
# todo 0
# duration_ms 355.415041
```

Vitest core-spec run (`npx vitest run runtime/lib/code-graph/freshness-core.vitest.ts` from `.opencode/skills/system-code-graph`):

```text
 RUN  v4.1.7 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public


 Test Files  1 passed (1)
      Tests  19 passed (19)
   Start at  14:42:06
   Duration  129ms (transform 27ms, setup 0ms, import 37ms, tests 25ms, environment 0ms)
```

Direct core-policy invocation against hermetic temp-project fixtures (real output, step 3 script):

```text
classifyEditScope: src/foo.ts -> {"inScope":true,"reason":"in-scope"}
classifyEditScope: .opencode/plugins/mk-code-graph-freshness.js -> {"inScope":false,"reason":"excluded-dir:.opencode/plugins"}
classifyEditScope: README.md -> {"inScope":false,"reason":"non-source-extension"}
evaluateEdit (first edit, no owner heartbeat) -> {"decision":"defer-debounce","reason":"awaiting-quiet-or-maxwait","pendingCount":1,"warnings":[],"audits":[]}
evaluateEdit (quiet elapsed + warm daemon) -> {"decision":"scan","pendingPaths":["src/bar.ts"],"dispatch":{"bin":".opencode/bin/code-index.cjs","args":["code_graph_scan","--json","{\"incremental\":true}","--warm-only","--format","json","--timeout-ms","8000"],"env":{"SPECKIT_CODE_INDEX_CLI_PROMPT_TIME":"1"}},"nextState":{"pending":[],"firstPendingAt":null,"lastEditAt":1783773614174},"warnings":[],"audits":[]}
evaluateEdit (empty graph, no bootstrap) -> {"decision":"defer-empty","reason":"graph-empty","warnings":[],"audits":[]}
evaluateEdit (kill-switch) -> {"decision":"skip","reason":"disabled","warnings":[],"audits":[]}
probeDaemonWarm (real repo owner marker) -> {"isWarm":true,"reason":"heartbeat-fresh","ageMs":2628,"ttlMs":60000}
```

Live Claude PostToolUse hook, end-to-end via `spawnSync` against a scan-ready fixture (real output, step 4 script):

```text
exit status: 0
stdout: ""
stderr: ""
lock file exists after exit: false
debounce state after scan: {
  "pending": [],
  "firstPendingAt": null,
  "lastEditAt": 1783773632796
}
```

Live-repo state check (this real project's actual markers, captured 2026-07-11):

```text
$ cat .opencode/skills/system-code-graph/mcp-server/database/.code-graph-readiness.json
{
  "schemaVersion": 1,
  "generatedAt": "2026-07-11T05:55:40.708Z",
  "producer": "mk-code-index",
  "graphFreshness": "empty",
  "graphState": "empty",
  "readiness": { "freshness": "empty", "action": "full_scan", "reason": "graph is empty (0 nodes)" },
  ...
}

$ cat .opencode/skills/system-code-graph/mcp-server/database/.code-graph-owner.json
{
  "ownerPid": 46779,
  "lastHeartbeatIso": "2026-07-11T12:40:42.220Z",
  "ttlMs": 60000,
  ...
}

$ ls -la .opencode/skills/.code-graph-freshness-state
total 0
drwxr-xr-x@  3 michelkerkmeester  staff   96 Jul 11 14:02 .
drwxr-xr-x@ 24 michelkerkmeester  staff  768 Jul 11 10:15 ..
drwx------@  2 michelkerkmeester  staff   64 Jul 11 09:22 .archive
```

Given this real, live state (`graphFreshness: "empty"`, daemon heartbeat fresh), a direct real-repo call confirms the guard currently gates every real edit at the empty-graph check, before debounce state is ever written -- consistent with the state directory holding only an empty `.archive/` and no per-session debounce files or lock:

```text
$ node -e 'const core=require("./.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"); console.log(JSON.stringify(core.evaluateEdit({ filePath: "src/example.ts", sessionID: "docs-authoring-check", projectDir: process.cwd(), env: process.env })));'
{"decision":"defer-empty","reason":"graph-empty","warnings":[],"audits":[]}

$ node -e 'const core=require("./.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs"); console.log(JSON.stringify(core.evaluateEdit({ filePath: ".opencode/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/code-graph-freshness-guard.md", sessionID: "docs-authoring-check", projectDir: process.cwd(), env: process.env })));'
{"decision":"skip","reason":"excluded-dir:.opencode/skills","warnings":[],"audits":[]}
```

Note: writing this very scenario file would not itself trigger the guard even with a non-empty graph -- it lives under the `.opencode/skills` scoped directory (excluded by default, widened only via `SPECKIT_CODE_GRAPH_INDEX_SKILLS`) and carries a `.md` extension (a `NON_SOURCE_EXTENSIONS` entry) -- the in-scope filter would reject it before the empty-graph gate is ever reached.

---

## 5. SOURCE FILES

- OpenCode plugin (adapter): `.opencode/plugins/mk-code-graph-freshness.js`
- OpenCode plugin unit test: `.opencode/plugins/tests/mk-code-graph-freshness.test.cjs`
- Claude PostToolUse hook (adapter): `.opencode/skills/system-code-graph/runtime/hooks/claude/code-graph-freshness.cjs`
- Shared runtime-neutral core: `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.cjs`
- Core Vitest spec: `.opencode/skills/system-code-graph/runtime/lib/code-graph/freshness-core.vitest.ts`
- Claude hook wiring: `.claude/settings.json` (`hooks.PostToolUse`, `Write|Edit` matcher, co-resident with `sk-code`'s posttooluse hook)

---

## 6. SOURCE METADATA

- Group: Plugins And Hooks
- Playbook ID: code-graph-freshness-guard
- Canonical root source: manual-testing-playbook.md
- Feature file path: plugins-and-hooks/code-graph-freshness-guard.md

---

## 7. PASS/FAIL

PASS

Both unit-test suites are fully green against the live source (`mk-code-graph-freshness.test.cjs`: 12/12; `freshness-core.vitest.ts`: 19/19). Direct, real invocations of the runtime-neutral core against hermetic fixtures confirmed every documented gate fires exactly as coded: the in-scope filter excludes `.opencode/plugins`, `.opencode/skills`, and non-source extensions while leaving plain source paths in scope; a first edit with no prior debounce state defers; a quiet-elapsed edit against a warm daemon returns the exact `code-index.cjs code_graph_scan --warm-only` dispatch; an empty graph defers without ever touching debounce state; and the kill-switch produces a clean `skip`. The live Claude PostToolUse hook, run end-to-end via `spawnSync` against a scan-ready fixture, exited `0` with empty stdout/stderr, released its scan lock synchronously, and cleared the session's debounce state -- confirming the P1 fix (no lock leak from a short-lived process) holds. Checking this real project's own current readiness/owner markers additionally confirmed the guard is honestly gated at `defer-empty` for every real edit right now (the actual code graph is empty), which matches the observed real state directory holding only an empty `.archive/` with no debounce or lock files -- no fabricated evidence was required to reach this verdict.
