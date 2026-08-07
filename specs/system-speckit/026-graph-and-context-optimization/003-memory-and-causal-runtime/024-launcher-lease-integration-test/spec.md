---
title: "Feature Specification: Launcher Lease Integration Test De-Flake"
description: "The spawned-launcher lease integration suite was describe.skip'd as a flake; in truth it fails 100% because the fixture never copies the launcher's lib/ tree, so every launcher dies MODULE_NOT_FOUND before writing a lease. Un-skip it and verify packet 020's lease.socketPath end-to-end."
trigger_phrases:
  - "launcher lease integration test"
  - "deflake launcher lease suite"
  - "spawned launcher socketPath test"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-speckit/026-graph-and-context-optimization/003-memory-and-causal-runtime/024-launcher-lease-integration-test"
    last_updated_at: "2026-06-04T13:35:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Un-skipped suite; copied lib/ into fixture; added socketPath bridge test"
    next_safe_action: "None. Suite green 3x, no orphans, regressions pass"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Was the suite actually flaky? No: deterministic MODULE_NOT_FOUND from a fixture that copied only the launcher .cjs and not its ./lib/*.cjs requires."
---
# Feature Specification: Launcher Lease Integration Test De-Flake

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->

---

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-06-04 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The spawned-launcher lease integration suite (`tests/launcher-lease.vitest.ts`) sat behind `describe.skip` with the comment "known launcher process lifecycle flake." It is the only harness that boots a real `mk-spec-memory` launcher to exercise lease write/read end-to-end, and packet 020's `lease.socketPath` persistence was therefore verified by unit tests only, never by a real spawned launcher. The skip label was a misdiagnosis: the suite fails 100% of the time, not intermittently.

### Purpose
Un-skip the suite, fix its real root cause, and add an end-to-end test that proves a real spawned launcher records its bound socket path in the lease and that a second launcher under a divergent `SPECKIT_IPC_SOCKET_DIR` bridges to the stored path.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Diagnose and fix the deterministic boot failure in the lease integration fixture.
- Un-skip the suite (`describe.skip` to `describe`) with reliable readiness polling and guaranteed process cleanup.
- Add a spawned-launcher test for packet 020's `lease.socketPath` (owner records path, divergent-env launcher prefers stored path and bridges).

### Out of Scope
- Production `.cjs` changes - the fix is test-only; the launcher and bridge already work correctly.
- The existing unit-level socketPath tests in `launcher-ipc-bridge-probe.vitest.ts` - left untouched; this packet adds the integration counterpart.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/tests/launcher-lease.vitest.ts | Modify | Copy lib/ into fixture, per-test isolated socket dir, un-skip, add socketPath bridge test |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The suite runs un-skipped and passes | `npx vitest run tests/launcher-lease.vitest.ts` reports 9 passed, 0 skipped |
| REQ-002 | The fixture copies the launcher's lib/ tree | Spawned launchers boot and write a lease (no MODULE_NOT_FOUND) |
| REQ-003 | A real launcher records its socketPath; a divergent-env launcher bridges to it | The new test asserts `lease.socketPath` equals the owner socket and the secondary logs `bridging to lease holder ... socket=<owner socket>` |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | No leaked launcher/daemon processes after the run | `ps` shows no process running from a temp fixture dir after the suite |
| REQ-005 | Tests use isolated temp dirs and a test-only SPECKIT_IPC_SOCKET_DIR | No spawned launcher resolves the live `/tmp/mk-spec-memory` daemon socket |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Suite green across 3 consecutive runs with zero flakes.
- **SC-002**: `launcher-ipc-bridge-probe.vitest.ts` and `launcher-recycle-lease.vitest.ts` still pass (no regression).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Risk | A bridge attempt against the real daemon socket | High - could disturb live sessions | Per-test `SPECKIT_IPC_SOCKET_DIR` inside the temp root; bridge-disabled diagnostics for the LEASE_HELD_BY tests |
| Risk | Orphaned spawned launchers after a failure | Med - leaked processes | `afterEach` reaps every launcher SIGTERM then SIGKILL before removing temp dirs |
| Dependency | Packet 020 lease.socketPath fix | Test asserts its behavior | Already shipped; this packet only verifies it end-to-end |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

---

<!-- ANCHOR:nfr -->
## L2: NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: Full suite completes under 2s (was a 12s timeout-failure when un-skipped naively).

### Security
- **NFR-S01**: No spawned process touches a path outside its per-test temp root.

### Reliability
- **NFR-R01**: Zero flakes across at least 3 runs; every spawned process reaped.
<!-- /ANCHOR:nfr -->

---

<!-- ANCHOR:edge-cases -->
## L2: EDGE CASES

### Data Boundaries
- Empty input: planted lease files with only `{pid, startedAt}` (no socketPath) still take the recompute fallback path.
- Invalid format: corrupt lease JSON is treated as no active lease by `readLeaseFile`.

### Error Scenarios
- Owner stub daemon never binds a socket: secondary launcher reports no-bridge-socket (covered by bridge-disabled LEASE_HELD_BY tests).
- Child ignores SIGTERM: the SIGKILL backstop still clears the lease (preserved test).

### State Transitions
- Stale (dead-pid) lease: reclaimable; the new owner takes the lease.
<!-- /ANCHOR:edge-cases -->

---

<!-- ANCHOR:complexity -->
## L2: COMPLEXITY ASSESSMENT

| Dimension | Score | Notes |
|-----------|-------|-------|
| Scope | 8/25 | One test file, ~156 net inserted lines |
| Risk | 10/25 | Spawns real processes; mitigated by isolation and reaping |
| Research | 8/20 | Root-cause diagnosis of the misdiagnosed flake |
| **Total** | **26/70** | **Level 2** |
<!-- /ANCHOR:complexity -->

---

## 10. OPEN QUESTIONS

- None. The flake was fully root-caused and the fix verified.
<!-- /ANCHOR:questions -->
