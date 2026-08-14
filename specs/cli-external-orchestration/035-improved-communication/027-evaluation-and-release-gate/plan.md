---
title: "Implementation Plan: Phase 027 Evaluation and Release Gate"
description: "Wire the blind non-inferiority evaluation into the production projection path as a reject-only consult and gate the multi-runtime rollout on dated non-inferiority, smoke, and canary evidence."
trigger_phrases:
  - "evaluation-and-release-gate"
  - "implementation plan"
  - "non-inferiority consult and rollout gate plan"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "cli-external-orchestration/035-improved-communication/027-evaluation-and-release-gate"
    last_updated_at: "2026-08-14T09:24:23.000Z"
    last_updated_by: "opencode"
    recent_action: "Completed and verified the reject-only evaluation consult and release gate."
    next_safe_action: "Proceed to operator rollout documentation with the validated release evidence contract."
    blockers: []
    key_files:
      - "plan.md"
      - "spec.md"
      - "tasks.md"
      - "checklist.md"
      - "decision-record.md"
      - "implementation-summary.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-027-evaluation-release-20260814"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The offer consult and the release gate are the two wiring seams."
      - "Dated evidence references and reject-only semantics are the gate contract."
---
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core + level2-verify + level3-arch | v2.2 -->
# Implementation Plan: Phase 027 Evaluation and Release Gate

<!-- SPECKIT_LEVEL: 3 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | TypeScript projection package under `cli-communication-projection` |
| **Framework** | Node runtime adapters; Phase 007 evaluation harness; system-spec-kit Level-3 closeout |
| **Storage** | Repository files only; dated evidence references with observed and expiry timestamps |
| **Testing** | Package `npm run check`, new offer and release-gate tests, six-runtime smokes, privacy canaries, and strict packet validation |

### Overview

Compose the completed blind non-inferiority evaluation into the production offer path as a reject-only quality signal, and gate the multi-runtime rollout on dated non-inferiority plus smoke plus canary evidence. The Phase 007 statistics and the release contracts stay unchanged; this phase wires and proves the gating.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready

- [x] The production offer seam and evaluation evidence input are inventoried.
- [x] The release readiness inputs and the dated evidence contract are inventoried.
- [x] The reject-only policy, six-runtime smoke set, and evidence expiry rules are frozen.

### Definition of Done

- [x] All eight requirements have observed evidence.
- [x] The production path consults the evaluation verdict and returns the exact original on fail or inconclusive.
- [x] Runtime and aggregate release readiness require fresh non-inferiority, smoke, and privacy-canary evidence.
- [x] The package gate and strict packet validation pass.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

A reject-only evaluation consult at the production offer seam plus a dated rollout gate, both built on the Phase 007 harness and the existing release evidence contracts.

### Key Components

| Component | Responsibility |
|-----------|----------------|
| Offer-seam consult | Call the evaluation verdict before projection is offered for a runtime / prompt-profile combination |
| Reject-only policy | Return the exact original on any fail or inconclusive verdict, never a rewrite |
| Rollout readiness gate | Mark a runtime rollout-ready only on fresh non-inferiority plus six-runtime smoke plus privacy-canary evidence |
| Dated evidence references | Carry observed and expiry timestamps that the gate enforces, rejecting stale and invalid entries |

### Data Flow

Runtime / prompt-profile combination -> evaluation verdict -> reject-only offer decision. Then evidence references -> `evaluateReleaseReadiness` -> rollout-ready or blocked, with stale and invalid evidence aborting the gate.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## Affected Surfaces

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `src/runtimes/adapter.ts` | Resolve runtime offers | Consult the evaluation verdict before offering | Offer tests prove reject-only behavior |
| `src/release/release-gate.ts` | Fail-closed release readiness | Require fresh non-inferiority, smokes, and canaries | Release gate tests prove blocked on missing, stale, and failing evidence |
| `src/release/evidence.ts` | Release evidence contracts | Date and expire every reference | Evidence validation tests |
| `src/evaluation/gate.ts` | Phase 007 harness | Reused unchanged by the consult | Existing evaluation tests |
| `test/runtimes/smoke.test.ts`, `test/release/` | Runtime and release coverage | Prove the consult and the gate end to end | Six-runtime smokes and new gate tests |
| Phase and parent packet docs | Record and route the planned phase | Wire Phase 027 into the parent map | Strict validation and graph backfill |
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup

- [x] Inventory the production offer seam and evaluation evidence input.
- [x] Inventory the release readiness inputs and the dated evidence contract.
- [x] Freeze the reject-only policy, six-runtime smoke set, and evidence expiry rules.

### Phase 2: Implementation

- [x] Wire the evaluation verdict consult at the production offer seam.
- [x] Keep the consult reject-only and return the exact original on fail or inconclusive.
- [x] Extend the release gate to require fresh non-inferiority plus smokes plus canaries.
- [x] Date and expire every evidence reference and block on stale or invalid entries.

### Phase 3: Verification

- [x] Prove missing, stale, invalid, and failing evidence block the gate.
- [x] Prove a measured regression on any dimension blocks the gate.
- [x] Run the six-runtime smokes, privacy canaries, package gate, and strict packet validation.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Offer consult | Verdict consulted per runtime / prompt-profile combination; fail and inconclusive return the exact original | Package vitest, new offer tests |
| Release gate | Missing, stale, invalid, and failing evidence abort the gate; regression blocks rollout | Package vitest, new gate tests |
| Six-runtime smokes | Each runtime passes pinned replay smokes | `test/runtimes/smoke.test.ts` |
| Privacy canaries | Canaries report zero leaks before a runtime is rollout-ready | `test/runtimes/`, release gate tests |
| Package gate | Typecheck, build, tests, and public-import smoke | `npm run check` from the package directory |
| Packet integrity | Phase 027 metadata, navigation, and graph truth | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|-------------------|
| Phases 019 through 026 runtime and capability wiring | Internal | Pending | The offer seam and rollout surface are not ready to consume |
| Phase 007 evaluation harness | Internal | Available | No verdict exists to consult |
| Release evidence contracts | Internal | Available | Dated rollout evidence cannot be expressed |
| Six-runtime smoke and privacy canary suites | Internal | Available | Rollout readiness cannot be proven |
| Package build and test gate | Internal | Available | The wiring cannot be verified |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: the consult blocks or rewrites offers incorrectly, or the gate marks a runtime rollout-ready on stale or failing evidence.
- **Procedure**: revert the offer-seam consult and the release-gate wiring, restore the prior evidence reference handling, then rerun the package gate, the smokes, and the privacy canaries, refresh graph metadata, and rerun Phase 027 plus parent strict validation.
<!-- /ANCHOR:rollback -->

---

<!-- ANCHOR:phase-deps -->
## L2: PHASE DEPENDENCIES

```text
Offer seam and evidence inventory -> Reject-only consult and dated gate -> Regression and packet verification
```

| Stage | Depends On | Blocks |
|-------|------------|--------|
| Offer seam and evidence inventory | Phases 019-026 and the Phase 007 harness | Reject-only consult and dated gate |
| Reject-only consult and dated gate | Complete inventory | Regression and packet verification |
| Regression and packet verification | Completed wiring | Phase handoff |
<!-- /ANCHOR:phase-deps -->

---

<!-- ANCHOR:effort -->
## L2: EFFORT ESTIMATION

| Stage | Complexity | Estimated Effort |
|-------|------------|------------------|
| Offer seam and evidence inventory | Low | 0.5 day |
| Reject-only consult and dated gate | Medium | 1-2 days |
| Verification and packet closeout | Medium | 1-2 days |
<!-- /ANCHOR:effort -->

---

<!-- ANCHOR:enhanced-rollback -->
## L2: ENHANCED ROLLBACK

### Pre-Change Checks

- [x] Record the offer behavior baseline before the consult is wired.
- [x] Capture the release gate baseline and the evidence reference format.
- [x] Confirm no canonical, fidelity, or evaluation-statistic change was introduced.

### Procedure

1. Restore only the offer-seam consult or the release-gate wiring that regressed.
2. Rerun the package gate and the release gate tests as applicable.
3. Refresh the affected graph metadata.
4. Rerun strict validation for Phase 027 and the parent.

### Data Reversal

- **Has data migrations?** No.
- **Reversal procedure**: Restore source and evidence references only; no runtime or persisted user data is changed.
<!-- /ANCHOR:enhanced-rollback -->

---

<!-- ANCHOR:dependency-graph -->
## L3: DEPENDENCY GRAPH

```text
Phases 019-026 and Phase 007 harness
                    |
                    v
        Offer seam and evidence inventory
                    |
        +-----------+-----------+
        |                       |
        v                       v
Reject-only offer consult   Dated rollout gate
        |                       |
        +----------+------------+
                   |
                   v
        Regression and packet verification
                   |
                   v
             Phase handoff
```

### Dependency Matrix

| Component | Depends On | Produces | Blocks |
|-----------|------------|----------|--------|
| Offer-seam consult | Runtime adapters and the evaluation verdict | A reject-only offer decision | Verified production offers |
| Rollout gate | Evidence references and `evaluateReleaseReadiness` | A rollout-ready or blocked decision | Rollout handoff |
| Dated evidence | Release evidence contracts | Timestamped references the gate enforces | Rollout readiness proof |
| Packet and parent wiring | All verification evidence | Strict conformance, navigation, and graph truth | Phase handoff |
<!-- /ANCHOR:dependency-graph -->

---

<!-- ANCHOR:critical-path -->
## L3: CRITICAL PATH

1. **Inventory the offer seams and the gate inputs** - 0.5 day - critical.
2. **Wire the reject-only consult and the dated gate** - 1-2 days - critical.
3. **Prove regression blocking and close the packet** - 1-2 days - critical.

**Parallel opportunities**:

- The offer-path tests and the release-gate tests run on independent surfaces.
- Packet authoring can proceed while the smokes and canaries run.
<!-- /ANCHOR:critical-path -->

---

<!-- ANCHOR:milestones -->
## L3: MILESTONES

| Milestone | Description | Success Criteria | Target |
|-----------|-------------|------------------|--------|
| M1 | Seams and inputs confirmed | Offer seams and evidence contract inventoried with the reject-only policy frozen | Stage 1 |
| M2 | Wiring proven | Consult and gate tests pass with the six-runtime smokes and canaries | Stage 2 |
| M3 | Phase handoff accepted | Regression blocks the gate, package gate is green, and strict validation passes | Stage 3 |
<!-- /ANCHOR:milestones -->

---

## L3: ARCHITECTURE DECISION SUMMARY

**Decision**: compose the evaluation verdict as a reject-only consult at the production offer seam, and gate rollout on dated non-inferiority plus smoke plus canary evidence.

**Status**: Accepted and implemented. Full rationale and alternatives are in `decision-record.md`.

---

## AI EXECUTION PROTOCOL

### Pre-Task Checklist

- [x] Confirm the predecessor handoff and availability of the evaluation harness before recording evidence.
- [x] Re-read every target file before editing and keep writes inside the implementation scope.
- [x] Translate each requirement into an observable check before claiming completion.

### Execution Rules

| Rule | Requirement |
|------|-------------|
| TASK-SEQ | Follow `tasks.md` in order; evidence cannot precede inventory. |
| TASK-SCOPE | Modify only the Phase 027 surfaces and the named parent links. |
| TASK-PROOF | Run focused checks, then rerun the authoritative gates and strict validation from the final state. |

### Status Reporting Format

Use `STATUS=<planned|in-progress|blocked|validated> PHASE=027 TASK=T### EVIDENCE=<short receipt>`.

### Blocked Task Protocol

If the package gate, the offer consult, or the release gate disagree with this plan, mark the task blocked, preserve the reject-only and fail-closed behavior, and update the decision record before resuming.
