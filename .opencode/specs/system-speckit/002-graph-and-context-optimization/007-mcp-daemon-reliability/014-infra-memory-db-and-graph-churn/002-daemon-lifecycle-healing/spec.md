---
title: "Feature Specification: Daemon-lifecycle healing (FTS auto-heal + clean-close barrier + substrate test)"
description: "Implements the 032 deep-research root-cause fixes (F1 boot FTS5 shadow auto-rebuild, F2 launcher clean-close barrier, F3 corrected substrate stress test). Closes the SQ2 memory-DB SQLITE_CONSTRAINT_PRIMARYKEY recurrence and the SQ1 stale-test failure that share the SQ4 daemon-lifecycle root cause."
trigger_phrases:
  - "daemon lifecycle healing fts auto-heal"
  - "boot fts rebuild clean-close barrier"
  - "substrate stress test diagnostic row fix"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/002-graph-and-context-optimization/007-mcp-daemon-reliability/014-infra-memory-db-and-graph-churn/002-daemon-lifecycle-healing"
    last_updated_at: "2026-05-30T18:40:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Implemented + tested F1/F2/F3; rewriting docs to manifest scaffold"
    next_safe_action: "Strict-validate then commit atomically"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/context-server.ts"
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000321"
      session_id: "032-001-spec"
      parent_session_id: null
    completion_pct: 95
    open_questions: []
    answered_questions:
      - "Scope = F1+F2+F3 (F4 worktree isolation stays deferred as packet 035)."
      - "Root cause (from 032 research): launcher respawns over an unresponsive incumbent with no DB clean-close barrier -> divergent FTS5 shadow -> PRIMARYKEY on next write."
---
# Feature Specification: Daemon-lifecycle healing (FTS auto-heal + clean-close barrier + substrate test)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Completed (2026-05-30) |
| **Created** | 2026-05-30 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The 032 deep-research loop established a single production root cause behind two live symptoms (SQ4): the `mk-spec-memory` launcher's respawn path can `SIGTERM`->`SIGKILL` an incumbent `context-server` child when its IPC deep-probe fails, then relaunch without verifying the DB closed cleanly (WAL checkpoint + `db.close()` + `.unclean-shutdown` removal). The result is a divergent FTS5 shadow (`memory_fts_data`); the next `memory_index` insert fires the `memory_fts_insert` trigger into the bad shadow and aborts with `SQLITE_CONSTRAINT_PRIMARYKEY` (SQ2). The same wedged incumbent surfaces the SQ1 substrate `Connection closed` diagnostic row that makes a stale test assert 5-vs-4. The boot FTS integrity probe currently only detects corruption and never repairs it, so the failure recurs after every unclean exit.

### Purpose
Heal the root cause and its user-visible recurrence: make boot self-healing (F1), detect+log unclean handoffs in the launcher (F2), and correct the stale substrate test (F3).
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- F1 `context-server.ts` `runBootFtsIntegrityCheck()`: on integrity-check failure rebuild + re-verify the FTS5 shadow -> health `'repaired'`; fall back to `'corrupt'` detect-only on rebuild failure or `SPECKIT_BOOT_FTS_AUTOHEAL=0`.
- F2 `mk-spec-memory-launcher.cjs` `reapLeaseChildBeforeRespawn()`: compute + log a verified clean DB close before respawn; export pure helpers for unit tests.
- F3 `substrate-runner-harness.vitest.ts`: separate `runner:*` diagnostics from scenario rows; reject connection/scenario FAIL; tolerate SKIP/PARTIAL; require the memory scenario to run.

### Out of Scope
- F4 worktree-per-session isolation - deferred to packet 035 (separate, larger change).
- Live two-launcher integration test - same gap 031/009 left open; covered here only at unit + syntax level.
- Graph-metadata churn (SQ3) - already fixed at HEAD, re-verified by research.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| `.opencode/skills/system-spec-kit/mcp_server/context-server.ts` | Modify | F1 boot FTS auto-heal |
| `.opencode/bin/mk-spec-memory-launcher.cjs` | Modify | F2 clean-close barrier + helper exports |
| `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-runner-harness.vitest.ts` | Modify | F3 assertion correctness |
| `.opencode/skills/system-spec-kit/mcp_server/tests/context-server.vitest.ts` | Modify | F1 guardrail assertion update |
| `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-barrier.vitest.ts` | Create | F2 unit test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | F1 boot FTS auto-heal | On marker + integrity-check failure, the shadow is rebuilt + re-verified; health becomes `'repaired'`. Rebuild failure or `SPECKIT_BOOT_FTS_AUTOHEAL=0` falls back to `'corrupt'` detect-only with the corruption banner preserved. |
| REQ-002 | F2 clean-close barrier | The reap path computes `cleanClose` (SIGTERM exit AND marker gone), logs unclean handoffs, never blocks respawn. `reason: 'child-reaped'` preserved. |
| REQ-003 | F3 substrate test correctness | Test passes on a healthy single-daemon run (memory scenario runs; Code-Graph scenarios SKIP) and fails on a real connection FAIL or scenario FAIL. |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Tests | `context-server.vitest.ts` boot-FTS assertions updated; new `launcher-clean-close-barrier.vitest.ts` covers the `cleanCloseAfterReap` truth table + marker-path resolution. |
| REQ-005 | Verification | Build passes; affected vitest passes; `node --check` launcher passes; strict-validate exit <=1. |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A daemon opening a DB left dirty by an unclean predecessor rebuilds the FTS5 shadow at boot and serves writes without `SQLITE_CONSTRAINT_PRIMARYKEY` (F1 closes SQ2's recurrence).
- **SC-002**: The launcher reap path distinguishes clean vs unclean DB handoff and logs the unclean case (F2 fills SQ2's forensics residual).
- **SC-003**: The substrate stress test is meaningful and non-flaky: green on a healthy single-daemon run, red on a real failure (F3 closes SQ1).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | Highest-blast-radius surface (DB-corruption origin) | A subtle change can corrupt the DB | FTS rebuild is non-destructive (derivable from `memory_index`); reuse the proven `memory_health` rebuild command; preserve detect-only fallback; env opt-out |
| Risk | `context-server.vitest.ts` asserts compiled-JS structure | F1 refactor could break DETECT-ONLY regex guardrails | Preserve `integrity-check` insert + `'corrupt'` + corruption banner; build then run the test and update the assertion for the new auto-heal branch |
| Risk | F2 changes the launcher reap path | Could affect respawn behavior | Keep `reason: 'child-reaped'`; barrier is observe-and-log only (never blocks respawn); `node --check` + unit test the pure helpers |
| Dependency | Concurrent sessions mutate the shared tree | Lost/clobbered edits | Scope commits with explicit pathspecs; re-grep on disk before commit; commit atomically |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: F1 rebuild runs only when the unclean-shutdown marker is present AND the integrity-check fails - zero added boot latency on a clean boot.

### Security
- **NFR-S01**: No new external input; the FTS rebuild is an internal SQLite verb on the local DB.

### Reliability
- **NFR-R01**: The auto-heal path is non-destructive (the FTS5 shadow is fully derivable from `memory_index`); a failed rebuild degrades to the prior detect-only behavior, never to data loss.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Clean boot (no marker): integrity check is skipped entirely; no rebuild.
- Marker present but FTS healthy: integrity-check passes; health `'ok'`; no rebuild.

### Error Scenarios
- Rebuild itself throws: health `'corrupt'`, corruption banner + runbook logged, no further recovery (manual repair required).
- Auto-heal disabled (`SPECKIT_BOOT_FTS_AUTOHEAL=0`): detect-only, no rebuild attempted.

### State Transitions
- F2 reap where the marker path cannot be resolved (wrong `MEMORY_DB_PATH` dirname): only the clean-close confirmation is forfeited; the replacement daemon's boot still self-heals.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 12/25 | 4 code/test files modified + 1 new test, ~121 insertions |
| Risk | 18/25 | Highest-blast-radius surface (DB-corruption origin); mitigated by non-destructive rebuild + detect-only fallback |
| Research | 8/20 | Root cause already established by the 032 deep-research loop |
| **Total** | **38/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- None blocking. Live two-launcher integration coverage remains deferred (same gap 031/009 left open); F4 worktree isolation (packet 035) is the durable systemic mitigation.
<!-- /ANCHOR:questions -->
