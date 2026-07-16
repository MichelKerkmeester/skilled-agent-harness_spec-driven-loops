---
title: "Feature Specification: Substrate Stress Harness Sandbox Cleanup [template:level_2/spec.md]"
description: "The substrate stress harness writes its evidence and scratch into _sandbox/24--local-llm-query-intelligence/ at the repository root and nothing removes it, so every run leaves a clutter folder behind. The obvious in-harness cleanup breaks the vitest runner, which reads the summary TSV after the subprocess exits. This phase adds a flag-gated and test-driven sandbox cleanup that removes the throwaway hermetic code-graph DB on every run, removes the whole run dir on demand, and lets the test reap the sandbox only after it has consumed the TSV."
trigger_phrases:
  - "substrate sandbox cleanup"
  - "substrate stress harness"
  - "hermetic code graph db cleanup"
  - "sandbox clean flag"
  - "vitest afterall sandbox reap"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/029-memory-search-intelligence/002-speckit-memory/039-substrate-sandbox-cleanup"
    last_updated_at: "2026-07-04T17:50:58.595Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "Added cleanupSandbox, the --clean flag, and the test afterAll reap, all checks green"
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
      - "The cleanup must run after the test consumes the TSV, so the reap lives in the test afterAll, not in the harness finally"
---
# Feature Specification: Substrate Stress Harness Sandbox Cleanup

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!--
SELF-CHECK:
- Confirm the artifact states the current problem, intended outcome, scope and verification evidence.
- Remove placeholders, stale status and claims that are not backed by a check.
FAILURE MODES:
- Scope drift, vague acceptance criteria and optimistic done-language without evidence.
-->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P2 |
| **Status** | COMPLETE |
| **Created** | 2026-06-23 |
| **Completed** | 2026-06-23 |
| **Branch** | `029-substrate-sandbox-cleanup` |
| **Parent Spec** | ../spec.md |
| **Predecessor** | ../038-scoring-hardening/spec.md |
| **Successor** | ../040-opencode-temp-worker-reaping/spec.md |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The substrate stress harness `run-substrate-stress-harness.mjs` writes its evidence and scratch into `_sandbox/24--local-llm-query-intelligence/` at the REPOSITORY ROOT, and nothing cleans it, so every harness run leaves that folder at the repo root. `REPO_ROOT` resolves to the repository root by design and the hermetic code-graph DB must stay inside it, because the launcher path guard rejects an out-of-repo DB directory. The sandbox is gitignored so it never reaches a commit, but it clutters the working tree and confused operators who asked "what creates this?" with no answer in the tree. The naive fix is wrong for a load-bearing reason. The `substrate-runner-harness.vitest.ts` test execs the harness as a subprocess, then reads the summary TSV at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` AFTER the subprocess exits, so deleting the sandbox inside the harness's own `finally` would delete the TSV before the test reads it and break the test. The cleanup must run after the test consumes the TSV, not inside the run that produced it.

### Purpose
Stop the substrate stress harness from leaving a sandbox folder at the repository root after a run, without breaking the vitest runner that reads the summary TSV after the subprocess exits. Always remove the throwaway hermetic code-graph DB at the end of a run because no consumer ever reads it back. Add an opt-in `--clean` flag so a standalone manual run that does not need the persisted evidence removes the whole run dir and the now-empty `_sandbox/` parent. Move the common-path auto-clean into the test's `afterAll`, which runs only after the suite has read the TSV, so the usual runner leaves no sandbox behind while the TSV stays present for the duration of the run. Keep every cleanup best-effort so it can never fail a run, and fail closed on the shared `_sandbox/` parent so a non-empty or shared parent is left in place rather than removed.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `cleanupSandbox({ clean })` helper called at the end of the `main()` `finally` block that ALWAYS removes the throwaway hermetic code-graph DB (`.tmp-cg-db/`), and when `clean` is true also removes the whole `_sandbox/24--local-llm-query-intelligence/` run dir and then the now-empty `_sandbox/` parent.
- A new `--clean` CLI flag parsed in `parseArgs`, defaulting to false, for standalone manual runs that do not need the persisted evidence.
- A test `afterAll` in `substrate-runner-harness.vitest.ts` that removes the sandbox (run dir plus empty parent) after the suite has read the TSV, providing the auto-clean for the common path because the test is the usual runner.
- A `SANDBOX_RUN_DIR` constant in the harness so the run dir path is named once and reused by the cleanup.
- Best-effort cleanup throughout, wrapped in try/catch so it never fails a run, with the `_sandbox/` parent removed by an `rmdir` that fails closed when the parent is shared or non-empty.

### Out of Scope
- Any change to where the harness writes its evidence and scratch, or to the `REPO_ROOT` resolution, since the hermetic code-graph DB must stay inside the repo root for the launcher path guard.
- Any change to the harness scenarios, the single-writer lease behavior, or the summary TSV format and path the test reads.
- Removing a shared or non-empty `_sandbox/` parent; the cleanup fails closed and leaves it in place.
- Any change to the memory or code-graph subsystems; this is test-infrastructure-only and changes no runtime behavior.
- Passing `--clean` from the test, because the test needs the TSV to exist during the run and reaps the sandbox only afterward in `afterAll`.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs` | Modify | Add the `SANDBOX_RUN_DIR` constant, the `--clean` flag in `parseArgs`, the `cleanupSandbox` helper, and the `finally` call that always reaps the hermetic DB and optionally the run dir and empty parent |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modify | Add the `afterAll` import and an `afterAll` cleanup that removes the sandbox run dir and the empty parent after the suite reads the TSV |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The harness MUST always remove the throwaway hermetic code-graph DB at the end of a run so it never accumulates | `cleanupSandbox` runs in the `main()` `finally` block on every run and removes `.tmp-cg-db/`; the removal is best-effort so a missing or locked DB never fails the run |
| REQ-002 | The vitest runner MUST still read the summary TSV, so the sandbox cleanup MUST NOT run before the test consumes the TSV | The harness `finally` removes the run dir only when `--clean` is passed; the test does NOT pass `--clean` and reaps the sandbox only in `afterAll`, after the suite has read the TSV; `npm run stress:substrate` reports the suite passing |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-003 | A `--clean` flag MUST exist for standalone manual runs that do not need the persisted evidence | `parseArgs` parses `--clean` defaulting to false; a standalone `node <harness> --clean ...` run removes the whole `_sandbox/24--local-llm-query-intelligence/` run dir and then the now-empty `_sandbox/` parent |
| REQ-004 | The test MUST auto-clean the sandbox for the common path after it has read the TSV | `substrate-runner-harness.vitest.ts` removes the run dir and the empty parent in `afterAll`; after `npm run stress:substrate` the `_sandbox` folder is gone, proving the `afterAll` cleanup fired |
| REQ-005 | All cleanup MUST be best-effort and MUST fail closed on a shared or non-empty `_sandbox/` parent | Every cleanup path is wrapped in try/catch so it never throws into a run; the `_sandbox/` parent is removed by an `rmdir` that fails closed when the parent is shared or non-empty, leaving it in place |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A standalone `node <harness> --clean --scenarios 410 --no-stderr-log` run exits 0 and the `_sandbox` folder is fully removed afterward (run dir plus empty parent), proving the `--clean` path reaps the whole sandbox.
- **SC-002**: `npm run stress:substrate` over `substrate-runner-harness.vitest.ts` reports `Test Files 1 passed (1)` and `Tests 1 passed (1)`, proving the test still reads the TSV during the run.
- **SC-003**: After `npm run stress:substrate` the `_sandbox` folder is gone, proving the `afterAll` cleanup fired only after the suite consumed the TSV.
- **SC-004**: `node --check run-substrate-stress-harness.mjs` reports OK and the comment-hygiene check passes on both files, proving the change is syntactically clean and carries no artifact ids.
- **SC-005**: The change touches only the two test-infra files, adds no behavior change to the memory or code-graph subsystems, and a shared or non-empty `_sandbox/` parent is left in place, proving the cleanup fails closed.
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Deleting the sandbox inside the harness `finally` would remove the TSV before the test reads it | High | Keep the run-dir removal behind `--clean`, which the test never passes, and move the common-path reap into the test `afterAll` after the TSV is consumed |
| Risk | The hermetic code-graph DB must stay inside the repo root for the launcher path guard | Med | Do not move where the harness writes; only add cleanup, so the DB still resolves inside `REPO_ROOT` for the duration of a run |
| Risk | A shared or non-empty `_sandbox/` parent removed by mistake | Med | Remove the parent with an `rmdir` that fails closed when the parent is shared or non-empty, leaving it in place |
| Risk | A cleanup failure aborting an otherwise green run | Low | Wrap every cleanup path in try/catch so the cleanup is best-effort and never fails a run |
| Dependency | The summary TSV at `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.summary.tsv` | The test reads this TSV after the subprocess exits | Leave the TSV path and format unchanged and reap only after the suite has read it |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The cleanup is a handful of best-effort filesystem removals at the end of a run and adds no measurable latency to the harness or the test suite.

### Reliability
- **NFR-R01**: Every cleanup path is best-effort and fails closed on a shared parent, so a cleanup error can never fail an otherwise green run and never removes a parent it does not own.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- A standalone run with `--clean` whose `_sandbox/` parent holds another sibling's run dir: the `rmdir` on the parent fails closed because the parent is non-empty, so only this run's dir is removed and the shared parent is left in place.
- A run where the hermetic code-graph DB was never created: the always-on DB removal is best-effort, so a missing `.tmp-cg-db/` is a no-op rather than an error.

### Error Scenarios
- A cleanup removal throwing on a locked or missing path: the try/catch swallows it and the run still exits with its real status, so cleanup never converts a pass into a failure.
- A standalone run interrupted before `finally`: the next run's always-on DB removal and the test `afterAll` reap recover the sandbox, so an interrupted run does not leave a permanent DB or run dir.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 5/25 | Two test-infra files, ~30 LOC, one helper plus a flag plus a test afterAll |
| Risk | 6/25 | TSV-before-cleanup ordering, fail-closed parent removal, repo-root DB-path guard left untouched |
| Research | 2/20 | The TSV read order and the run-dir path verified directly in the harness and test |
| **Total** | **13/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 10. OPEN QUESTIONS

- None. The TSV-before-cleanup ordering, the fail-closed parent removal, and the repo-root DB-path constraint are all resolved in the shipped implementation.
<!-- /ANCHOR:questions -->

---

<!-- ANCHOR:verdict -->
## 11. VERDICT

COMPLETE. The substrate stress harness no longer leaves a sandbox folder at the repository root after a run. `cleanupSandbox({ clean })` runs in the `main()` `finally` block and always removes the throwaway hermetic code-graph DB, and when `--clean` is passed it also removes the whole run dir and the now-empty `_sandbox/` parent. The new `--clean` flag covers standalone manual runs that do not need the persisted evidence, defaulting to false. The common-path auto-clean lives in the test `afterAll`, which runs only after the suite has read the summary TSV, so the usual runner leaves no sandbox behind while the TSV stays present during the run. Every cleanup is best-effort and the `_sandbox/` parent removal fails closed on a shared or non-empty parent. `node --check`, the comment-hygiene check on both files, a standalone `--clean` run, and `npm run stress:substrate` are all green, and the `_sandbox` folder is gone after both the standalone and the test runs.
<!-- /ANCHOR:verdict -->
