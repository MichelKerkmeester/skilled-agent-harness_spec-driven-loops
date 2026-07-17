---
title: "Implementation Summary [template:level_2/implementation-summary.md]"
description: "Status COMPLETE. Added cleanupSandbox({ clean }) to the substrate stress harness finally block, a --clean CLI flag, and a test afterAll reap. The harness always removes the throwaway hermetic code-graph DB and, under --clean, the whole run dir and the now-empty _sandbox parent; the test reaps the sandbox only after it reads the summary TSV. All cleanup is best-effort and fails closed on a shared parent. node --check, comment-hygiene, a standalone --clean run, and npm run stress:substrate are all green and _sandbox is gone after each run."
trigger_phrases:
  - "substrate sandbox cleanup"
  - "substrate stress harness"
  - "hermetic code graph db cleanup"
  - "sandbox clean flag"
  - "vitest afterall sandbox reap"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/028-memory-search-intelligence/002-speckit-memory/039-substrate-sandbox-cleanup"
    last_updated_at: "2026-07-04T17:50:58.595Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added cleanupSandbox, the --clean flag, and the test afterAll reap; all checks green"
    next_safe_action: "Revert the two files if a future run needs the persisted sandbox evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-opus-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The cleanup runs after the test consumes the TSV by living in the test afterAll, while the harness finally only reaps the run dir under --clean"
      - "The shared _sandbox parent is removed by an rmdir that fails closed, so a non-empty or shared parent is left in place"
---
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 029-substrate-sandbox-cleanup |
| **Completed** | 2026-06-23 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Status COMPLETE. The substrate stress harness no longer leaves a sandbox folder at the repository root after a run. The fix is three parts in two test-infra files, roughly 30 LOC, with no behavior change to the memory or code-graph subsystems. The write location is unchanged, because the hermetic code-graph DB must stay inside `REPO_ROOT` for the launcher path guard, so cleanup is the only lever.

The load-bearing constraint shaped the design. The `substrate-runner-harness.vitest.ts` test execs the harness as a subprocess and reads the summary TSV at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` AFTER the subprocess exits. Deleting the sandbox inside the harness's own `finally` would remove the TSV before the test reads it and break the test, so the run-dir cleanup is gated behind a flag the test never passes, and the common-path reap lives in the test `afterAll`, which runs only after the suite has consumed the TSV.

### Always-on hermetic DB cleanup (part 1)

`cleanupSandbox({ clean })` is called at the end of the `main()` `finally` block. It ALWAYS removes the throwaway hermetic code-graph DB (`.tmp-cg-db/`), because no consumer ever reads it back. When `clean` is true it also removes the whole `_sandbox/24--local-llm-query-intelligence/` run dir and then the now-empty `_sandbox/` parent, where the `rmdir` on the parent fails closed if the parent is shared or non-empty. Every cleanup path is wrapped in try/catch, so the cleanup is best-effort and never fails a run.

### The `--clean` flag (part 2)

A new `--clean` CLI flag is parsed in `parseArgs`, defaulting to false, for standalone manual runs that do not need the persisted evidence. A run that passes `--clean` reaps the whole sandbox at the end of the run; a run that omits it keeps the run dir in place so a consumer such as the test can read the TSV.

### Test `afterAll` reap (part 3)

The test `afterAll` in `substrate-runner-harness.vitest.ts` removes the sandbox (the run dir plus the empty parent) after the suite has read the TSV. This is the auto-clean for the common path, because the test is the usual runner. The test does NOT pass `--clean`, because it needs the TSV to exist during the run, and reaps the sandbox only once the suite has consumed it.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modified | Added the `SANDBOX_RUN_DIR` constant, the `--clean` flag in `parseArgs`, the `cleanupSandbox` helper, and the `finally` call |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modified | Added the `afterAll` import and the `afterAll` cleanup that removes the sandbox after the suite reads the TSV |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The run dir path was named once with a `SANDBOX_RUN_DIR` constant so the cleanup removes exactly what the harness wrote. The `--clean` flag was added to `parseArgs` with the existing flag-parsing pattern, defaulting to false. The `cleanupSandbox({ clean })` helper was written to always remove the hermetic DB and, under `clean`, to remove the run dir and then the now-empty `_sandbox/` parent with an `rmdir` that fails closed, every step wrapped in try/catch so it stays best-effort. The helper was called in the `main()` `finally` block so it runs on every run regardless of the run's outcome. In the test, the `afterAll` import was added and an `afterAll` reap removes the run dir and the empty parent after the suite has read the TSV, without passing `--clean`. The change was then verified statically with `node --check` and the comment-hygiene check, and dynamically with a standalone `--clean` run and `npm run stress:substrate`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Put the common-path reap in the test `afterAll`, not the harness `finally` | The test reads the summary TSV after the subprocess exits, so reaping inside the run would delete the TSV before the test reads it and break the test |
| Gate the run-dir removal behind `--clean` and never pass it from the test | A standalone manual run can reap immediately, but the test needs the TSV present during the run, so the run dir must survive until the test reaps it in `afterAll` |
| Always remove the hermetic code-graph DB regardless of `--clean` | No consumer ever reads the throwaway DB back, so it can be reaped unconditionally without affecting the TSV the test reads |
| Remove the `_sandbox/` parent with a fail-closed `rmdir` | The parent may be shared with a sibling's run dir, so it must be removed only when it is empty and owned, and left in place otherwise |
| Keep every cleanup best-effort in try/catch | Cleanup must never convert an otherwise green run into a failure, so a locked or missing path is swallowed rather than thrown |
| Leave the write location and `REPO_ROOT` resolution untouched | The hermetic DB must stay inside the repo root for the launcher path guard, so only cleanup can be added, not a relocation |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check run-substrate-stress-harness.mjs` | PASS, OK (no syntax errors) |
| Comment-hygiene (`check-comment-hygiene.sh` via python3) on both files | PASS, exit 0 (clean) |
| Standalone `node <harness> --clean --scenarios 410 --no-stderr-log` | PASS, exits 0; runner:mk-spec-memory, runner:mk-code-index and scenario 410 SKIP because a live operator daemon holds the single-writer lease during an interactive session, which the harness tolerates by design |
| `_sandbox` removed after the standalone `--clean` run | PASS, fully removed (run dir plus empty parent) |
| `npm run stress:substrate` over `substrate-runner-harness.vitest.ts` | PASS, Test Files 1 passed (1), Tests 1 passed (1) |
| `_sandbox` removed after `npm run stress:substrate` | PASS, gone after the run, proving the `afterAll` cleanup fired once the suite had read the TSV |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Shared parent is left in place.** The `_sandbox/` parent is removed only when it is empty and owned; a shared or non-empty parent fails closed and is left in the working tree, so a concurrent run sharing the parent keeps it.
2. **Cleanup is best-effort.** A locked or missing path during cleanup is swallowed rather than retried, so a rare leftover artifact is possible after an unusual run, though the next run's always-on DB removal and the test `afterAll` reap recover it.
3. **Standalone runs without `--clean` still persist the run dir.** A standalone run that omits `--clean` keeps the run dir so a consumer can read the TSV; the evidence is reaped only by a later `--clean` run or by the test `afterAll`.
4. **Write location unchanged.** The fix removes the sandbox after a run but does not change where the harness writes, because the hermetic code-graph DB must resolve inside `REPO_ROOT` for the launcher path guard.
<!-- /ANCHOR:limitations -->

---
