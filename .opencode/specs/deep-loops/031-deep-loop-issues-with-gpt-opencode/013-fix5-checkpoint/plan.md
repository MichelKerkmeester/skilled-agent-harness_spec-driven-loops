---
title: "Implementation Plan: FIX-5 Decision Checkpoint"
description: "Read phase 012's benchmark results, apply research's cross-validated negative gate, cross-check against the failure-classification schema to avoid misapplying the gate on an already-fixed Mode-D failure, then update 006's decision-record.md with the outcome."
trigger_phrases:
  - "implementation"
  - "plan"
  - "fix5 checkpoint"
  - "fix5 unpark decision"
importance_tier: "high"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "deep-loops/031-deep-loop-issues-with-gpt-opencode/013-fix5-checkpoint"
    last_updated_at: "2026-07-01T17:15:00Z"
    last_updated_by: "claude-code"
    recent_action: "Gate applied; FIX-5 closed"
    next_safe_action: "None -- packet complete"
    blockers: []
    key_files:
      - "../012-gpt-claude-benchmark/"
      - "../006-host-hard-identity-fix5/decision-record.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "031-013-plan"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Implementation Plan: FIX-5 Decision Checkpoint

<!-- SPECKIT_LEVEL: 1 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

---

<!-- ANCHOR:summary -->
## 1. SUMMARY

### Technical Context

| Aspect | Value |
|--------|-------|
| **Language/Stack** | Markdown decision-record update |
| **Framework** | spec-kit decision-record convention |
| **Storage** | `../006-host-hard-identity-fix5/decision-record.md` |
| **Testing** | None beyond re-reading the gate criterion against actual evidence |

### Overview

This is an evaluation phase, not an implementation phase: read phase 012's classified benchmark results, apply the already-settled negative gate (unpark only if GPT still shows semantic wrong-mode artifacts, a route-proof mismatch, or disproportionate stuck/latency failures on any mode while Claude passes), cross-check that no `phase0_self_check`/Mode-D-classified failure gets misapplied to trigger the gate (since FIX-5 doesn't fix that class), and record the outcome in `006`'s decision-record.md.
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 012's `benchmark-results.md` exists and is complete (not partial).

### Definition of Done
- [x] Gate applied against phase 012's classified results, cell by cell.
- [x] `phase0_self_check`/Mode-D-classified failures explicitly excluded from triggering the gate (they don't indicate FIX-5 is needed).
- [x] `../006-host-hard-identity-fix5/decision-record.md` updated with the final outcome (closed or unparked) and the specific evidence.
- [x] If unparked: a new follow-on phase is flagged as needed, not started under this phase's scope.
- [x] `validate.sh --strict` passes for this phase.
<!-- /ANCHOR:quality-gates -->

---

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

### Pattern

Evidence-evaluation-and-record, not implementation: this phase applies a pre-settled decision rule to new evidence and writes the outcome to an existing decision record. No new code or agent-behavior surface is created.

### Key Components

- **Phase 012's `benchmark-results.md`**: the sole evidence input.
- **The negative-gate criterion** (research/research.md §3): a fixed rule, not re-derived here.
- **Phase 012's failure-classification schema**: used to cross-check that a `phase0_self_check`/Mode-D result doesn't get misread as a FIX-5 trigger.
- **`../006-host-hard-identity-fix5/decision-record.md`**: the output — this phase's only durable artifact.

### Data Flow

Phase 012 produces classified results → this phase reads them → applies the gate cell by cell, cross-checking classification buckets → writes the outcome (closed or unparked, with evidence) to 006's decision-record.md.
<!-- /ANCHOR:architecture -->

---

<!-- ANCHOR:affected-surfaces -->
## FIX ADDENDUM: AFFECTED SURFACES

| Surface | Current Role | Action | Verification |
|---------|--------------|--------|--------------|
| `../006-host-hard-identity-fix5/decision-record.md` | Interim trigger language, written before this research existed | Updated with the final gate outcome and evidence | Re-read for internal consistency after the update |

Required inventories:
- Same-class producers: none — this phase produces no code, only a decision-record update.
- Consumers: any future phase considering FIX-5 implementation reads this updated decision-record as its starting point.
- Matrix axes: 4 modes x 2 models x (pass / 4 failure buckets), inherited from phase 012.
- Algorithm invariant: a `phase0_self_check`/Mode-D-classified failure must never, by itself, trigger the FIX-5 unpark gate — FIX-5 does not address that failure class (research/research.md §1).
<!-- /ANCHOR:affected-surfaces -->

---

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- [x] Confirm phase 012's `benchmark-results.md` is complete.
- [x] Re-read the gate criterion from research/research.md §3 and `../006-host-hard-identity-fix5/decision-record.md`'s existing trigger language.

### Phase 2: Evaluation
- [x] Apply the gate to each of phase 012's cells, cross-checking the failure-classification bucket for any cell that looks like a trigger.
- [x] Determine the outcome: close 006 permanently, or unpark with specific cited evidence.

### Phase 3: Recording
- [x] Update `../006-host-hard-identity-fix5/decision-record.md` with the outcome.
- [x] If unparked: explicitly flag that a new phase is needed for FIX-5 implementation, without starting it here.
- [x] Run `validate.sh --strict` for this phase folder.
<!-- /ANCHOR:phases -->

---

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Test Type | Scope | Tools |
|-----------|-------|-------|
| Manual evaluation | Gate applied against phase 012's results | Direct read-through, cross-checked against classification schema |
| Spec | Phase documentation and metadata integrity | `validate.sh --strict` |
<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

| Dependency | Type | Status | Impact if Blocked |
|------------|------|--------|--------------------|
| Phase 012 | Predecessor | Not yet complete | This phase cannot run at all without it |
<!-- /ANCHOR:dependencies -->

---

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

- **Trigger**: The gate evaluation is later found to have misread phase 012's results (e.g., miscounted a classified failure).
- **Procedure**: Correct the evaluation and update `006`'s decision-record.md again, documenting the correction rather than silently overwriting the prior entry.
<!-- /ANCHOR:rollback -->

---
