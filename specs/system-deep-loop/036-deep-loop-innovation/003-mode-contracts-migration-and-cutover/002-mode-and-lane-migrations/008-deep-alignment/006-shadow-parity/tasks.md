---
title: "Tasks: Deep Alignment shadow parity"
description: "Tasks for the Deep Alignment shadow-parity concern: pair the legacy emitter with the ledger path, compare event and projection semantics, and produce a fail-closed parity receipt before authority cutover."
trigger_phrases:
  - "Deep Alignment shadow parity tasks"
  - "deep-alignment parity harness tasks"
  - "ledger event comparison tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/008-deep-alignment/006-shadow-parity"
    last_updated_at: "2026-08-15T16:12:18Z"
    last_updated_by: "codex"
    recent_action: "Verified the cited suite and reconciled closeout evidence"
    next_safe_action: "No leaf-local closeout action remains"
    blockers: []
    key_files: []
    completion_pct: 100
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

- [x] T001 Confirm `005-resume-adapter`, the phase-014 shadow framework, and the phase-012 shared review-loop contract are available and version-pinned [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T002 Inventory Deep Alignment legacy events and public projections by lane, subject, authority epoch, finding lifecycle, applicability, deviation, conflict, and terminal state [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T003 Define the paired-run manifest and require identical target, authority, verifier, lane, review-loop, capability, budget, and fixture inputs [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T004 Define event identity, causal-order, semantic-payload, projection-identity, and non-semantic-field normalization contracts [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T005 Define mismatch classes and fail-closed dispositions for `PARITY_PASS`, `PARITY_FAIL`, and `PARITY_BLOCKED` [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 [P] Add the Deep Alignment adapter to the phase-014 paired shadow runner without changing legacy authority [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T007 Capture legacy and ledger events, receipts, raw findings, projections, terminal decisions, and provenance from the same run manifest [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T008 Implement one-to-one event pairing and comparison for logical identity, event type, lane, subject, authority epoch, causal parent, sequence/barrier position, and lifecycle transition [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T009 Implement semantic payload comparison with an explicit versioned allowlist and unknown-field rejection [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T010 Implement projection comparison for finding lifecycle, applicability, evidence, known deviations, authority conflicts, terminal state, and public gauges [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T011 Implement authority capsule and verifier provenance checks for stale, expired, rolled-back, mixed, or unbound inputs [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T012 Add deterministic replay and seeded mismatch fixtures for missing, extra, duplicate, reordered, changed-payload, changed-applicability, and changed-verdict events [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T013 Emit a mode-scoped parity receipt with paired-run inputs, comparator version, fixture coverage, event/projection fingerprints, first divergence, and legacy-authoritative status [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify: The shadow runner executes legacy and ledger paths from identical frozen inputs - A manifest mismatch blocks before comparison [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T015 Verify: Every legacy event has exactly one ledger counterpart and vice versa - Missing, extra, duplicate, or unpaired events fail the gate [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T016 Verify: Stable event identities and causal order are preserved - Arrival-order variation does not hide semantic order drift [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T017 Verify: Semantic event payloads are equivalent - Unknown or changed fields fail closed outside the explicit normalization allowlist [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T018 Verify: Deep Alignment projections are equivalent - Findings, applicability, evidence, deviations, conflicts, terminal status, and gauges match by identity [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T019 Verify: Authority provenance is valid and identical - Invalid, stale, expired, rolled-back, or mixed material yields `PARITY_BLOCKED` [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T020 Verify: Capture and replay are deterministic - Repeated runs produce the same first divergence and projection fingerprints [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T021 Verify: Mismatch reports are actionable - Each failure identifies event/projection references, lane, subject, authority epoch, and replay command [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] T022 Verify: A green parity receipt does not cut over authority - Legacy remains authoritative and the receipt is ready for `007-rollback-and-mode-gate` [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] All requirements in spec.md met with evidence [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
- [x] Phase gate green (validate/build/test/replay as applicable) [Test: "Deep Alignment shadow parity" suite, 10/10 PASS (123.77s); `tsc --noEmit --ignoreDeprecations 6.0` exit 0.]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
