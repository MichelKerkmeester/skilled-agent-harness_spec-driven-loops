---
title: "Verification Checklist: Substrate Stress Harness Sandbox Cleanup [template:level_2/checklist.md]"
description: "Verification Date: 2026-06-23. All P0 and P1 items verified with evidence; node --check OK, comment-hygiene exit 0 on both files, a standalone --clean run reaped the whole sandbox, and npm run stress:substrate passed with _sandbox gone after the run."
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
    packet_pointer: "system-speckit/004-memory-search-intelligence/002-speckit-memory/039-substrate-sandbox-cleanup"
    last_updated_at: "2026-07-04T17:50:58.595Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Verified all P0/P1 checklist items against the shipped implementation"
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
    answered_questions: []
---
# Verification Checklist: Substrate Stress Harness Sandbox Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->
<!--
SELF-CHECK:
- Confirm every required item has concrete evidence before marking it complete.
- Keep optional deferrals explicit, owned, and separate from blockers.
FAILURE MODES:
- Rubber-stamping the checklist, vague tested-claims, and hidden blocker deferrals.
-->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim done until complete |
| **[P1]** | Required | Must complete OR get user approval |
| **[P2]** | Optional | Can defer with documented reason |
<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Requirements documented in spec.md
- [x] CHK-002 [P0] Technical approach defined in plan.md
- [x] CHK-003 [P1] The TSV-read-before-cleanup ordering and the repo-root DB-path constraint are confirmed. Evidence: the test reads `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` after the subprocess exits; the hermetic code-graph DB must resolve inside `REPO_ROOT` for the launcher path guard
<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The harness parses with no syntax errors and both files carry no artifact ids. Evidence: `node --check run-substrate-stress-harness.mjs` OK; `check-comment-hygiene.sh` via python3 exit 0 on both files
- [x] CHK-011 [P0] No console errors or warnings from the cleanup path on a valid run. Evidence: the standalone `--clean` run and `npm run stress:substrate` both completed clean
- [x] CHK-012 [P1] The missing-DB, shared-parent, and interrupted-run branches handled. Evidence: every cleanup path is best-effort in try/catch; the `_sandbox/` parent removal uses an `rmdir` that fails closed when the parent is shared or non-empty; a missing hermetic DB is a no-op
- [x] CHK-013 [P1] Change follows the existing harness patterns (a parsed CLI flag in `parseArgs`, a `SANDBOX_RUN_DIR` constant naming the path once, cleanup in the `main()` `finally`)
<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All acceptance criteria met (REQ-001 through REQ-005). Evidence: `node --check` OK, the standalone `--clean` run reaped the sandbox, and `npm run stress:substrate` passed with `_sandbox` gone afterward
- [x] CHK-021 [P0] The cleanup never runs before the test reads the TSV. Evidence: the harness `finally` removes the run dir only under `--clean`, which the test does not pass; the test reaps the sandbox only in `afterAll`, after the suite has read the TSV; `npm run stress:substrate` reports Test Files 1 passed (1) / Tests 1 passed (1)
- [x] CHK-022 [P1] The standalone `--clean` run exits 0 and the `_sandbox` folder is fully removed afterward (run dir plus empty parent). Evidence: `node <harness> --clean --scenarios 410 --no-stderr-log` exits 0; runner:mk-spec-memory, runner:mk-code-index and scenario 410 SKIP because a live operator daemon holds the single-writer lease, which the harness tolerates by design; `_sandbox` is gone after the run
- [x] CHK-023 [P1] The test `afterAll` reap fires only after the TSV is read. Evidence: `_sandbox` is GONE after `npm run stress:substrate`, proving the `afterAll` cleanup fired once the suite had consumed the TSV
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-FIX-001 [P0] Finding class: `resource-leak` (sandbox left at the repo root) plus `test-ordering` (cleanup must not precede the TSV read)
- [x] CHK-FIX-002 [P0] Same-class producer inventory: `rg SANDBOX|_sandbox|tmp-cg-db|REPO_ROOT` over `stress_test/substrate`; the harness is the only producer of the sandbox and the hermetic DB, and it is the only file given cleanup
- [x] CHK-FIX-003 [P0] Consumer inventory: the vitest runner is the only consumer of the summary TSV; it now reaps the sandbox in `afterAll` after reading the TSV; `parseArgs` consumes the new `--clean` flag and the `main()` `finally` consumes `cleanupSandbox`
- [x] CHK-FIX-004 [P0] No security/path-guard surface changed; the hermetic DB still resolves inside `REPO_ROOT` and the cleanup only removes paths the harness wrote, with the `_sandbox/` parent removal failing closed on a shared parent
- [x] CHK-FIX-005 [P1] Matrix axes listed in plan.md: a standalone run with `--clean` and without, a test run that reads the TSV before reaping, a missing hermetic DB, a shared non-empty `_sandbox/` parent, and an interrupted run
- [x] CHK-FIX-006 [P1] Hostile-state variant executed: the standalone `--clean` run was exercised with a live operator daemon holding the single-writer lease, and the harness tolerated the SKIPs while still reaping the sandbox
- [x] CHK-FIX-007 [P1] Evidence pinned to the working-tree diff; no commit is made this session, so there is no moving branch range to pin against
<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-030 [P0] No hardcoded secrets
- [x] CHK-031 [P0] The cleanup removes only paths the harness wrote under the sandbox and the hermetic DB; it introduces no new untrusted input and changes no path guard
- [x] CHK-032 [P1] No new execution surface introduced; the `--clean` flag toggles best-effort filesystem removals only
<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-040 [P1] Spec/plan/tasks synchronized to COMPLETE with evidence
- [x] CHK-041 [P1] Code comments carry the durable WHY (the TSV-before-cleanup ordering and the fail-closed parent removal), no artifact ids or spec paths
- [x] CHK-042 [P2] No env-flag or reference doc applies; the `--clean` flag is documented in the harness help and the spec docs
<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-050 [P1] No temp files created outside the source tree; the change's whole point is to stop the sandbox accumulating at the repo root
- [x] CHK-051 [P1] No scratch artifacts to clean; the sandbox is reaped by the new cleanup
<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 11 | 11/11 |
| P1 Items | 11 | 11/11 |
| P2 Items | 1 | 1/1 |

**Verification Date**: 2026-06-23
<!-- /ANCHOR:summary -->

---
