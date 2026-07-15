---
title: "Tasks: Deep Alignment shadow parity (phase 013 mode 008 concern 006)"
description: "Tasks for the Deep Alignment shadow-parity concern: pair the legacy emitter with the ledger path, compare event and projection semantics, and produce a fail-closed parity receipt before authority cutover."
trigger_phrases:
  - "Deep Alignment shadow parity tasks"
  - "deep-alignment parity harness tasks"
  - "ledger event comparison tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
    last_updated_at: "2026-07-15T21:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined event-for-event shadow parity before Deep Alignment authority cutover"
    next_safe_action: "Freeze paired runners and execute the parity fixture matrix"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Alignment Shadow Parity

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [ ] T001 Confirm `005-resume-adapter`, the phase-011 shadow framework, and the phase-009 shared review-loop contract are available and version-pinned
- [ ] T002 Inventory Deep Alignment legacy events and public projections by lane, subject, authority epoch, finding lifecycle, applicability, deviation, conflict, and terminal state
- [ ] T003 Define the paired-run manifest and require identical target, authority, verifier, lane, review-loop, capability, budget, and fixture inputs
- [ ] T004 Define event identity, causal-order, semantic-payload, projection-identity, and non-semantic-field normalization contracts
- [ ] T005 Define mismatch classes and fail-closed dispositions for `PARITY_PASS`, `PARITY_FAIL`, and `PARITY_BLOCKED`
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T006 [P] Add the Deep Alignment adapter to the phase-011 paired shadow runner without changing legacy authority
- [ ] T007 Capture legacy and ledger events, receipts, raw findings, projections, terminal decisions, and provenance from the same run manifest
- [ ] T008 Implement one-to-one event pairing and comparison for logical identity, event type, lane, subject, authority epoch, causal parent, sequence/barrier position, and lifecycle transition
- [ ] T009 Implement semantic payload comparison with an explicit versioned allowlist and unknown-field rejection
- [ ] T010 Implement projection comparison for finding lifecycle, applicability, evidence, known deviations, authority conflicts, terminal state, and public gauges
- [ ] T011 Implement authority capsule and verifier provenance checks for stale, expired, rolled-back, mixed, or unbound inputs
- [ ] T012 Add deterministic replay and seeded mismatch fixtures for missing, extra, duplicate, reordered, changed-payload, changed-applicability, and changed-verdict events
- [ ] T013 Emit a mode-scoped parity receipt with paired-run inputs, comparator version, fixture coverage, event/projection fingerprints, first divergence, and legacy-authoritative status
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify: The shadow runner executes legacy and ledger paths from identical frozen inputs — A manifest mismatch blocks before comparison
- [ ] T015 Verify: Every legacy event has exactly one ledger counterpart and vice versa — Missing, extra, duplicate, or unpaired events fail the gate
- [ ] T016 Verify: Stable event identities and causal order are preserved — Arrival-order variation does not hide semantic order drift
- [ ] T017 Verify: Semantic event payloads are equivalent — Unknown or changed fields fail closed outside the explicit normalization allowlist
- [ ] T018 Verify: Deep Alignment projections are equivalent — Findings, applicability, evidence, deviations, conflicts, terminal status, and gauges match by identity
- [ ] T019 Verify: Authority provenance is valid and identical — Invalid, stale, expired, rolled-back, or mixed material yields `PARITY_BLOCKED`
- [ ] T020 Verify: Capture and replay are deterministic — Repeated runs produce the same first divergence and projection fingerprints
- [ ] T021 Verify: Mismatch reports are actionable — Each failure identifies event/projection references, lane, subject, authority epoch, and replay command
- [ ] T022 Verify: A green parity receipt does not cut over authority — Legacy remains authoritative and the receipt is handed to `007-rollback-and-mode-gate`
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/build/test/replay as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
