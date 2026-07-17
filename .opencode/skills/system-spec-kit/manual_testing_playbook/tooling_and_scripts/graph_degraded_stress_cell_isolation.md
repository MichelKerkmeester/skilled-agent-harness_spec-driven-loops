---
title: "279 -- Graph degraded stress cell with SPEC_KIT_DB_DIR isolation"
description: "This scenario validates the deterministic isolated-DB sweep that exercises all 4 fallbackDecision matrix branches without touching the live code-graph DB. Pattern: initDb(tmpdir) + vi.spyOn(getDb) + sha256 byte-equality."
version: 3.6.0.13
id: tooling-and-scripts-graph-degraded-stress-cell-isolation
expected_workflow_mode: UNKNOWN
expected_leaf_resources: []
---

# 279 -- Graph degraded stress cell with SPEC_KIT_DB_DIR isolation

## 1. OVERVIEW

This scenario validates the integration sweep that closes the v1.0.2 NEUTRAL verdict on the fast-fail handler. It focuses on the test-isolation pattern (`initDb(tmpdir)` + `vi.spyOn(getDb)` + `vi.spyOn(process, 'cwd')`) plus the live-DB byte-equality guard that proves the sweep cannot mutate production bytes.

---

## 2. SCENARIO CONTRACT


- Objective: Verify the deterministic isolated-DB sweep exercises all 4 `fallbackDecision` matrix branches end-to-end without touching the live code-graph DB; Each bucket sets up a fresh tmpdir, swaps the DB singleton via `initDb(tempDir)`, and pins `process.cwd()` to keep the readiness-debounce cache key unique per test.
- Real user request: `` Please validate Graph degraded stress cell with SPEC_KIT_DB_DIR isolation against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts and tell me whether the expected signals are present: All 4 buckets pass: empty + broad-stale → `nextTool:"code_graph_scan"`; readiness exception → `nextTool:"rg"`; fresh → no `fallbackDecision`; Live `code-graph.sqlite` sha256 byte-equal before and after the sweep (proves `initDb(tmpdir)` + spy isolation works); Suite runtime < 1 second (deterministic, no I/O against the live DB); The dedicated guard test (`does not mutate the live code-graph.sqlite during the sweep`) is wired and passes. ``
- Prompt: `Validate the graph degraded stress cell isolation contract against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts and report cited pass/fail evidence.`
- Expected execution process: Run the documented TEST EXECUTION command sequence, capture the transcript and evidence, compare the observed output against the expected signals, and return the pass/fail verdict.
- Expected signals: All 4 buckets pass: empty + broad-stale → `nextTool:"code_graph_scan"`; readiness exception → `nextTool:"rg"`; fresh → no `fallbackDecision`; Live `code-graph.sqlite` sha256 byte-equal before and after the sweep (proves `initDb(tmpdir)` + spy isolation works); Suite runtime < 1 second (deterministic, no I/O against the live DB); The dedicated guard test (`does not mutate the live code-graph.sqlite during the sweep`) is wired and passes
- Desired user-visible outcome: A concise pass/fail verdict with the main reason and cited evidence.
- Pass/fail: PASS: 4 buckets correct routing AND live DB byte-equal AND runtime under 1s AND guard test passes; FAIL: any bucket mis-routes, live DB sha256 changes, runtime exceeds budget by >5x, or the guard test silently no-ops because the live DB is missing

---

## 3. TEST EXECUTION

### Prompt

```
Validate the graph degraded stress cell isolation contract against cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts and report cited pass/fail evidence.
```

### Commands

1. `shasum -a 256 .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite > /tmp/279-pre.sha`
2. `cd .opencode/skills/system-spec-kit/mcp_server && npx vitest run tests/code-graph-degraded-sweep.vitest.ts 2>&1 | tee /tmp/279-vitest.txt`
3. `shasum -a 256 .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite > /tmp/279-post.sha && diff /tmp/279-pre.sha /tmp/279-post.sha`

### Expected

Vitest exits 0 with all 4 bucket assertions passing and the dedicated live-DB guard test passing. Sha256 diff is empty (live DB byte-equal pre/post). Suite total runtime under 1 second.

### Evidence

`/tmp/279-vitest.txt`:

```text

 RUN  v4.1.9 /Users/michelkerkmeester/MEGA/Development/Code_Environment/Public/.opencode/skills/system-spec-kit

No test files found, exiting with code 1

filter: tests/code-graph-degraded-sweep.vitest.ts
include: mcp_server/tests/**/*.{vitest,test}.ts, ../runtime//tests/**/*.{vitest,test}.ts, scripts/tests/**/*.{vitest,test}.ts
exclude:  mcp_server/tests/memory-save.vitest.ts, mcp_server/tests/archive/**
```

`/tmp/279-pre.sha`:

```text
f817640df0db31c04220f159b7a71c9e038f6965c84704a9fe1fca34288adaf5  .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
```

`/tmp/279-post.sha`:

```text
f817640df0db31c04220f159b7a71c9e038f6965c84704a9fe1fca34288adaf5  .opencode/skills/system-code-graph/mcp_server/database/code-graph.sqlite
```

`diff /tmp/279-pre.sha /tmp/279-post.sha`:

```text
```

### Pass / Fail

- **FAIL**: vitest exited 1 with `No test files found, exiting with code 1`; the expected 5 passing tests were not observed. The sha256 diff was empty.

### Failure Triage

If sha256 diff non-empty: inspect `mcp_server/tests/code-graph-degraded-sweep.vitest.ts` for missing `initDb(tempDir)` call, missing `vi.spyOn(process, 'cwd')` pin, or readiness-debounce cache leak. If guard test no-ops (live DB absent): the protection check cannot run; restore the live DB before re-running. If a bucket mis-routes: cross-check against `.opencode/skills/system-code-graph/mcp_server/handlers/query.ts` `buildGraphQueryPayload()` and `.opencode/skills/system-code-graph/mcp_server/lib/ensure-ready.ts` `detectState()`.

## 4. SOURCE FILES
- Root playbook: [manual_testing_playbook.md](../manual_testing_playbook.md)
- Sibling (rebuild + restart + live probe): [mcp-daemon-rebuild-restart-live-probe.md](./mcp_daemon_rebuild_restart_live_probe.md)
- Implementation context: local graph-degraded stress-cell notes

---

## 5. SOURCE METADATA

- Group: Tooling and Scripts
- Playbook ID: 279
- Canonical root source: `manual_testing_playbook.md`
- Feature file path: `tooling_and_scripts/graph_degraded_stress_cell_isolation.md`
