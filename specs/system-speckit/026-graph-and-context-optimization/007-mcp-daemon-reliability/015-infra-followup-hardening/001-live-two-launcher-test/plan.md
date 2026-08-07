---
title: "Implementation Plan: Live F2 clean-close reap coverage"
description: "Export the reap function and add a deterministic vitest that exercises the four clean-close branches against real throwaway children, avoiding launcher-lifecycle flake."
trigger_phrases:
  - "live reap test plan"
  - "F2 clean-close coverage plan"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/007-mcp-daemon-reliability/015-infra-followup-hardening/001-live-two-launcher-test"
    last_updated_at: "2026-05-30T22:10:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored plan to manifest scaffold"
    next_safe_action: "Gate then commit"
    blockers: []
    key_files:
      - ".opencode/bin/mk-spec-memory-launcher.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000003602"
      session_id: "036-001-plan"
      parent_session_id: null
    completion_pct: 90
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Live F2 clean-close reap coverage

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | CommonJS launcher (.cjs) + TypeScript vitest |
| **Framework** | Node.js child_process, Vitest |
| **Storage** | Real `.unclean-shutdown` marker file in a temp dir (via MEMORY_DB_PATH) |
| **Testing** | Vitest (mcp_server tests) |

### Overview
Export `reapLeaseChildBeforeRespawn` + `uncleanMarkerPresent` from the launcher, then drive the real reap orchestration with throwaway `node -e` children whose SIGTERM behavior selects each clean/unclean/killed branch.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] F2 reap seams + marker resolution mapped (scope/verify swarm)
- [x] Deterministic strategy chosen over launcher-spawn flake
- [x] Launcher clean at HEAD (disk == HEAD)

### Definition of Done
- [x] All four branches asserted; suite green
- [x] `node --check` launcher passes
- [x] Docs validate strict
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern
Direct unit-of-behavior test: import the real reap function, feed it real child PIDs, assert on its structured return + the marker file it inspects.

### Key Components
- **`reapLeaseChildBeforeRespawn(childPid)`**: the function under test (now exported).
- **Throwaway child stubs**: `graceful-clean` / `graceful-dirty` / `ignore-sigterm` select the branch.
- **`MEMORY_DB_PATH`**: pins the marker location into the test's temp dir.

### Data Flow
Test creates marker + child → calls reap → reap SIGTERMs (and SIGKILLs if ignored) → reads marker → returns `{allowed, reaped, cleanClose, reason}` → test asserts.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `mk-spec-memory-launcher.cjs` module.exports | Public test surface | add 2 names (export-only) | `node --check` + require introspection |
| `reapLeaseChildBeforeRespawn` | F2 reap orchestration | unchanged (tested, not edited) | new vitest green |
| `launcher-lease.vitest.ts` (skipped) | Legacy real-process suite | untouched | grep: still `describe.skip` |

Required inventories:
- Confirm the export adds no auto-run: `require.main === module` guard present → importing does not start a daemon.
- Confirm reap deps (`processLiveness`, `signalProcess`, `reapProcessTreeGroups`, `waitForPidExit`, `RESPAWN_REAP_GRACE_MS`) are module-level and resolve on require.
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Map reap seams + marker resolution; confirm launcher clean at HEAD

### Phase 2: Core Implementation
- [x] Export `reapLeaseChildBeforeRespawn` + `uncleanMarkerPresent`
- [x] Write `launcher-clean-close-reap.vitest.ts` (4 branches + marker-path case)

### Phase 3: Verification
- [x] Suite green (5/5); `node --check` launcher; hygiene; strict-validate
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Unit-of-behavior | reap orchestration (4 branches) | Vitest + real child_process |
| Syntax | launcher export edit | `node --check` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| `RESPAWN_REAP_GRACE_MS` (7s) | Internal | Green | Drives the bounded SIGKILL-escalation case |
| Process liveness readability | Platform | Green (guarded) | unknown-eperm → skip-with-reason |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the reap test proves flaky in CI.
- **Procedure**: revert the test file (test-only) and the export edit; both are independent and additive. No production behavior to roll back.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```
Phase 1 (Map) ──► Phase 2 (Export + Test) ──► Phase 3 (Verify)
```

| Phase | Depends On | Blocks |
|-------|------------|--------|
| Setup | None | Core |
| Core | Setup | Verify |
| Verify | Core | None |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Phase | Complexity | Estimated Effort |
|-------|------------|------------------|
| Setup | Low | seam mapping (done in swarm) |
| Core Implementation | Med | export + 5-case test |
| Verification | Low | one suite run + validate |
| **Total** | | **single focused session** |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-deployment Checklist
- [x] Export-only production change (no logic edit)
- [x] Test isolated (own temp dirs + afterEach cleanup)

### Rollback Procedure
1. Revert `launcher-clean-close-reap.vitest.ts`.
2. Revert the 2 added export names in the launcher.
3. Re-run `node --check` + the launcher test suite.

### Data Reversal
- **Has data migrations?** No.
- **Reversal procedure**: N/A.
<!-- /ANCHOR:enhanced-rollback -->
