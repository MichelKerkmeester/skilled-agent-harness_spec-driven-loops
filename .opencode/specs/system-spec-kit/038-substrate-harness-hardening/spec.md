---
title: "Feature Specification: Substrate stress-harness hardening [template:level_3/spec.md]"
description: "Close the three residual risks the deep-research validation found in the skip-not-fail substrate harness: PID-recycling false-SKIP, stale-pid TSV evidence, and the maintainer-mode INDEX-scan leak."
trigger_phrases:
  - "substrate harness hardening"
  - "pid recycling skip"
  - "liveOwnerForService identity"
  - "maintainer mode leak"
  - "spec core"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/038-substrate-harness-hardening"
    last_updated_at: "2026-05-31T12:00:00Z"
    last_updated_by: "claude-opus"
    recent_action: "Authored Level 3 spec for the three harness fixes"
    next_safe_action: "Implement fixes (done) and reconcile completion"
    blockers: []
    key_files:
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs"
      - ".opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-harness-hardening.vitest.ts"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "impl-038"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Feature Specification: Substrate stress-harness hardening

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify + level3-arch | v2.2 -->

---

## EXECUTIVE SUMMARY

The deep-research validation (packet 037) confirmed the "skip-not-fail on live owner" substrate-harness fix is sound, but surfaced three residual risks, all in `run-substrate-stress-harness.mjs`. This spec closes all three: a PID-recycling false-SKIP, a stale-pid TSV evidence hazard, and a maintainer-mode INDEX-scan leak that lets a clean-env / CI run rewrite `graph-metadata.json` tree-wide.

**Key Decisions**: process-start-time identity check for lease owners (ADR-001), run-id-stamped TSV with non-clobbering EPERM fallback (ADR-002), explicit maintainer-mode/INDEX suppression in the harness child env (ADR-003).

**Critical Dependencies**: Node `node:child_process` (`ps`), the substrate vitest gate, and the `mk-code-index-launcher.cjs` set-if-absent env semantics.

---
<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Level** | 3 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-05-31 |
| **Branch** | `main` |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

### Problem Statement
The substrate stress harness reclassifies a connection failure as a tolerated SKIP whenever a live PID is found in a daemon's single-writer lease. Three gaps remain: a recycled PID can mask a genuine crash as SKIP (also the only bypass of the 410 false-green guard); an EPERM-locked summary TSV silently preserves a prior run's pids; and `.env.local` maintainer mode lets a clean-env run trigger a forced INDEX scan that rewrites `graph-metadata.json` across the tree.

### Purpose
Make the harness trustworthy under adversarial and clean-env conditions: a SKIP must mean the same process that wrote the lease is alive, evidence must never silently present stale data, and a harness run must never trigger a tree-wide metadata scan.
<!-- /ANCHOR:problem -->

---

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Process-start-time identity verification in `liveOwnerForService` (both daemons).
- Run-id stamping of the summary TSV + non-clobbering EPERM fallback.
- Explicit `SPECKIT_CODE_GRAPH_MAINTAINER_MODE=false` + `INDEX_*=false` in the code-index child env.
- Test coverage for all three behaviors.

### Out of Scope
- Changes to the launchers or `.env.local` - the fix lives entirely in the harness child env.
- Full hermetic temp-DB-dir isolation - documented in ADR-003 as a deferred deeper lever.

### Files to Change

| File Path | Change Type | Description |
|-----------|-------------|-------------|
| .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs | Modify | All three fixes + exported testable helpers |
| .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/substrate-harness-hardening.vitest.ts | Create | Behavioral coverage for the three fixes |
<!-- /ANCHOR:scope -->

---

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

### P0 - Blockers (MUST complete)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | A live PID whose start time does not match the lease is NOT treated as the owner | `liveOwnerForService` returns null on start-time mismatch → verdict FAIL |
| REQ-002 | The harness never silently presents stale TSV evidence | On EPERM, current rows go to a run-id sidecar; canonical TSV carries a run-id |
| REQ-003 | A clean-env harness run cannot trigger the maintainer-mode INDEX scan | Code-index child env sets maintainer mode + the five INDEX_* to false |

### P1 - Required (complete OR user-approved deferral)

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-004 | Existing live-owner SKIP behavior is preserved | The existing substrate vitest test still passes; full stress suite green |
| REQ-005 | New behaviors are covered by tests | Vitest cases for identity, TSV, and env suppression all pass |
<!-- /ANCHOR:requirements -->

---

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: `npm run stress` is green with the existing live-owner SKIP test intact.
- **SC-002**: A fabricated lease with a live PID but mismatched start time yields FAIL (verified by test).
<!-- /ANCHOR:success-criteria -->

---

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

| Type | Item | Impact | Mitigation |
|------|------|--------|------------|
| Dependency | `ps -o lstart=` availability | start-time check degrades | Liveness-only fallback on null start time |
| Risk | Clock-skew false reject | A real owner wrongly FAILs | ≤2s tolerance; compare absolute start times |
| Risk | Suppression breaks code-graph scenarios | 403/404/407 regress | Those scenarios already tolerate SKIP |
<!-- /ANCHOR:risks -->

---

<!-- ANCHOR:questions -->

## 7. NON-FUNCTIONAL REQUIREMENTS

### Performance
- **NFR-P01**: The identity check adds at most one `ps` read per failed connect (failure path only).

### Security
- **NFR-S01**: `processStartedAt` passes an integer-validated PID via argv (no shell interpolation).

### Reliability
- **NFR-R01**: All new helpers fail closed (null/false) on read/parse error rather than throwing.

---

## 8. EDGE CASES

### Data Boundaries
- Empty input: lease missing start timestamp → liveness-only fallback (no regression).
- Maximum length: non-integer / ≤0 PID → `processStartedAt` returns null.

### Error Scenarios
- External service failure: `ps` unavailable / non-zero exit → null → liveness-only fallback.
- Network timeout: N/A (local lease reads only).

---

## 9. COMPLEXITY ASSESSMENT

| Dimension | Score | Triggers |
|-----------|-------|----------|
| Scope | 8/25 | Files: 2, LOC: ~170, Systems: 1 |
| Risk | 10/25 | Auth: N, API: N, Breaking: N (test-only surface) |
| Research | 6/20 | Source research already complete (packet 037) |
| Multi-Agent | 0/15 | Workstreams: 1 |
| Coordination | 4/15 | Dependencies: launcher env semantics |
| **Total** | **28/100** | **Level 3 (user-directed for governance, not score)** |

---

## 10. RISK MATRIX

| Risk ID | Description | Impact | Likelihood | Mitigation |
|---------|-------------|--------|------------|------------|
| R-001 | Start-time tolerance too tight → false FAIL | M | L | ≤2s tolerance + liveness-only fallback |
| R-002 | `ps -o lstart` format variance | M | M | Defensive parse; null on failure |
| R-003 | Suppression causes unexpected SKIPs in 403/404/407 | L | L | Already tolerated by validated guard |

---

## 11. USER STORIES

### US-001: Trustworthy crash detection (Priority: P0)

**As a** maintainer running the substrate suite, **I want** a genuine crash to FAIL even if the crashed PID was recycled, **so that** real regressions are never hidden as SKIP.

**Acceptance Criteria**:
1. Given a lease with a live PID whose start time differs from the lease timestamp, When classified, Then it reports FAIL.

### US-002: Non-misleading evidence (Priority: P1)

**As an** analyst reading the summary TSV, **I want** to never be shown stale pids from a prior run, **so that** I can trust the evidence.

**Acceptance Criteria**:
1. Given the canonical TSV is EPERM-locked, When the harness writes results, Then current rows land in a run-id sidecar and a warning is emitted.

---

## 12. OPEN QUESTIONS

- Should the optional temp `SPECKIT_CODE_GRAPH_DB_DIR` isolation also be implemented? RESOLVED: documented in ADR-003 as a deferred deeper lever.
- What start-time tolerance is correct? RESOLVED: ≤2s absolute, with liveness-only fallback.
<!-- /ANCHOR:questions -->

---

## RELATED DOCUMENTS

- **Implementation Plan**: See `plan.md`
- **Task Breakdown**: See `tasks.md`
- **Verification Checklist**: See `checklist.md`
- **Decision Records**: See `decision-record.md`

---
