# Review Report: 021-cooperative-heavy-phases

---

## 1. Executive Summary

| Field | Value |
|-------|-------|
| **Verdict** | CONDITIONAL |
| **Active P0** | 0 |
| **Active P1** | 1 |
| **Active P2** | 1 |
| **hasAdvisories** | true |
| **Scope** | Spec folder 021-cooperative-heavy-phases (Level 1): spec.md, plan.md, tasks.md, implementation-summary.md |
| **Stop Reason** | maxIterationsReached |
| **Iterations** | 1 |
| **Dimension Coverage** | 1/4 (correctness only) |
| **Release Readiness** | in-progress |

The spec packet proposes a sound design for keeping the daemon responsive through heavy scan phases: event-loop lag instrumentation, trigger-backfill transaction chunking, and per-tail-phase marker refresh. The correctness dimension review found no P0 blockers. One P1 finding concerns the deferred deploy-time lag read (the actual blocker-identification mechanism), and one P2 finding notes missing test coverage for chunk transaction failure. Security, traceability, and maintainability dimensions were not reviewed in this single-iteration fan-out lineage.

---

## 2. Planning Trigger

**Verdict: CONDITIONAL** — One active P1 finding requires attention before the spec can claim full verification. The next step is `/speckit:plan` to address the deferred deploy-time lag read, or explicit acknowledgment that the clone test is sufficient.

The P1 finding (F001) is not a code defect but a verification gap: the spec's primary purpose (making the daemon responsive through heavy phases) relies on a deploy-time lag read that has not occurred. The lag sampler is shipped and working, but the actual identification of the blocking phase — and the resulting fix — is deferred.

---

## 3. Active Finding Registry

| ID | Severity | Dimension | Title | File:Line | First Seen | Last Seen | Status |
|----|----------|-----------|-------|-----------|------------|-----------|--------|
| F001 | P1 | Correctness | Deploy-time lag read deferred | implementation-summary.md:104 | 1 | 1 | active |
| F002 | P2 | Correctness | No chunk transaction failure test | tasks.md:58 | 1 | 1 | active |

### F001 — Deploy-time lag read deferred (P1)

**Claim:** The spec's primary verification mechanism (deploy-time lag read to pin the blocking phase) is deferred, leaving the core responsiveness claim unvalidated on the live daemon.

**Evidence:**
- `implementation-summary.md:104` — "The blocking phase is not yet pinned in code."
- `spec.md:55` — Status: "Complete (code); deploy-time lag read pending"
- `spec.md:62` — Handoff criteria include "the live single-launcher lag read is the deploy-time check"
- `implementation-summary.md:96` — Live clone test confirmed max lag 634ms with no block spikes

**Adjudication:**
```json
{
  "findingId": "F001",
  "claim": "The spec's primary verification mechanism (deploy-time lag read to pin the blocking phase) is deferred, leaving the core responsiveness claim unvalidated on the live daemon.",
  "evidenceRefs": ["implementation-summary.md:104", "spec.md:55", "spec.md:62", "implementation-summary.md:96"],
  "counterevidenceSought": "Checked whether the live clone lag read at implementation-summary.md:96 constitutes sufficient validation. The clone test showed max lag 634ms with no block spikes, but the spec itself distinguishes this from the deploy-time check (implementation-summary.md:105) and notes the clone test is on a snapshot clone, not the live daemon with real workload.",
  "alternativeExplanation": "The spec may consider the clone test sufficient proof that no block exists, making the deploy-time read a formality. However, the spec explicitly marks it as pending and distinguishes it from the clone test, so this reading is inconsistent with the spec's own framing.",
  "finalSeverity": "P1",
  "confidence": 0.82,
  "downgradeTrigger": "If the deploy-time lag read is performed and confirms no block on the live daemon, downgrade to P2 (deferred verification, not a defect).",
  "transitions": [{"iteration": 1, "from": null, "to": "P1", "reason": "Initial discovery: deferred verification of spec's core claim"}]
}
```

### F002 — No chunk transaction failure test (P2)

**Claim:** The test suite covers cancel and yield scenarios but not chunk transaction failure, leaving the idempotent-recovery claim untested.

**Evidence:**
- `tasks.md:58` — Three test cases: cancel-immediate, cancel-at-chunk-boundary, cooperative-yield
- `plan.md:79` — "the upserts are idempotent (ON CONFLICT DO UPDATE) and the deletes are per-memory-id, so the next scan reconciles a partial state"

**Adjudication:**
```json
{
  "findingId": "F002",
  "claim": "The test suite covers cancel and yield scenarios but not chunk transaction failure, leaving the idempotent-recovery claim untested.",
  "evidenceRefs": ["tasks.md:58", "plan.md:79"],
  "counterevidenceSought": "Reviewed all test case descriptions in tasks.md and the testing strategy in plan.md:87. The three cases are cancel-immediate, cancel-at-chunk-boundary, and cooperative-yield. None simulate a transaction failure.",
  "alternativeExplanation": "Testing database transaction failure in unit tests may be difficult without integration test infrastructure. The idempotent upsert behavior is well-understood from SQLite semantics.",
  "finalSeverity": "P2",
  "confidence": 0.78,
  "downgradeTrigger": "If a transaction-failure test is added, or if integration tests cover this path, this finding is resolved.",
  "transitions": [{"iteration": 1, "from": null, "to": "P2", "reason": "Initial discovery: untested failure mode"}]
}
```

---

## 4. Remediation Workstreams

### Workstream 1: Deploy-time validation (F001)
**Priority:** P1 | **Effort:** Low (operational, not code)
- Perform the deploy-time lag read on a clean single-launcher live reindex session
- Read the `phase=` and `event-loop blocked`/`max-event-loop-lag` logs
- If any phase shows a block exceeding the launcher probe timeout, apply the 018 chunk-and-yield
- Confirm daemon pid unchanged and `vec == fts`

### Workstream 2: Test coverage gap (F002)
**Priority:** P2 | **Effort:** Low
- Add a test case that simulates a `syncPhraseChunk` transaction failure on chunk 2 of N
- Verify that the next scan reconciles the partial state
- Confirm idempotent upsert behavior is exercised

---

## 5. Spec Seed

No spec changes required. The spec correctly acknowledges the deferred deploy-time read in its status field and handoff criteria. If the deploy-time read confirms no block, update spec.md:55 status from "Complete (code); deploy-time lag read pending" to "Complete".

---

## 6. Plan Seed

| Task | Finding | Description |
|------|---------|-------------|
| Deploy lag read | F001 | Run clean single-launcher force reindex, read lag logs, apply yield if needed |
| Add failure test | F002 | Add syncPhraseChunk transaction-failure unit test |

---

## 7. Traceability Status

### Core Protocols

| Protocol | Status | Gate | Evidence | Notes |
|----------|--------|------|----------|-------|
| spec_code | partial | hard | spec.md:55, implementation-summary.md:96 | Spec-level analysis confirms design is sound; code-level verification requires source access; deploy-time validation deferred |
| checklist_evidence | blocked | hard | N/A | No checklist.md present (Level 1 packet) |

### Overlay Protocols

| Protocol | Status | Gate | Notes |
|----------|--------|------|-------|
| feature_catalog_code | pending | advisory | Not evaluated in this iteration |
| playbook_capability | pending | advisory | Not evaluated in this iteration |
| skill_agent | notApplicable | advisory | Not a skill target |
| agent_cross_runtime | notApplicable | advisory | Not an agent target |

---

## 8. Deferred Items

- **Security dimension** (D2): Not reviewed. Recommended for next fan-out lineage.
- **Traceability dimension** (D3): Not reviewed. Recommended for next fan-out lineage.
- **Maintainability dimension** (D4): Not reviewed. Recommended for next fan-out lineage.
- **spec_code full verification**: Requires source code access to memory-index.ts and trigger-embedding-backfill.ts.
- **checklist_evidence**: Blocked by absence of checklist.md (Level 1 packet, expected).

---

## 9. Audit Appendix

### Iteration Table

| # | Focus | Dimension | Findings | Ratio | Status |
|---|-------|-----------|----------|-------|--------|
| 1 | Correctness | D1 | +1 P1, +1 P2 | 1.0 | complete |

### Convergence Signal Replay

| Signal | Value | Threshold | Vote | Notes |
|--------|-------|-----------|------|-------|
| Rolling Average | N/A | 0.08 | - | Only 1 iteration, insufficient data |
| MAD Noise Floor | N/A | - | - | Only 1 iteration, insufficient data |
| Dimension Coverage | 0.25 | 1.0 | CONTINUE | 1/4 dimensions covered |
| Composite Stop Score | 0.0 | 0.60 | CONTINUE | Insufficient data |

**Stop Decision:** maxIterationsReached — loop stopped because maxIterations=1 was reached, not because convergence was detected.

### File Coverage Matrix

| File | D1 | D2 | D3 | D4 |
|------|----|----|----|----|
| spec.md | reviewed | - | - | - |
| plan.md | reviewed | - | - | - |
| tasks.md | reviewed | - | - | - |
| implementation-summary.md | reviewed | - | - | - |

### Dimension Breakdown

| Dimension | Iterations | Findings | Status |
|-----------|-----------|----------|--------|
| Correctness | 1 | 1 P1, 1 P2 | covered (1 pass) |
| Security | 0 | 0 | pending |
| Traceability | 0 | 0 | pending |
| Maintainability | 0 | 0 | pending |

### Severity Reconciliation

No severity transitions occurred. F001 remains P1, F002 remains P2 as initially discovered.
