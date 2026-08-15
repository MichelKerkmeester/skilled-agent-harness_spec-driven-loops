---
title: "Tasks: Deep Review - Rollback & Mode Gate"
description: "Tasks for the Deep Review rollback switch and independent mode gate: freeze shared inputs, specify fail-closed authority control and bounded rollback, assemble parity/seal/certificate evidence, and verify the non-authoritative phase-014 handoff."
trigger_phrases:
  - "Deep Review rollback and mode gate tasks"
  - "deep-review rollback switch tasks"
  - "deep-review mode gate tasks"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/007-rollback-and-mode-gate"
    last_updated_at: "2026-08-15T12:22:55Z"
    last_updated_by: "codex"
    recent_action: "Reverified the rollback gate at HEAD; 83 of 84 focused assertions passed"
    next_safe_action: "Verify parity exit-status independence"
    blockers:
      - "Focused rollback-gate suite timed out in the parity exit-status independence probe"
    key_files: []
    completion_pct: 95
    open_questions: []
    answered_questions: []
---
# Tasks: Deep Review - Rollback & Mode Gate

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

- [x] T001 Pin BASE, the parent 036 invariants, `manifest/phase-tree.json`, phase-012 shared mode-contract and write-set digests, and the phase-006 authorization boundary [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T002 Read the six Deep Review sibling contracts and record ownership for typed events, reducers, seals, certificates, resume, and shadow parity [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T003 Inventory the legacy Deep Review lifecycle, authority selector, blocked-stop path, report synthesis, resume path, and existing rollback anchors [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T004 Freeze the authority-control vocabulary, gate result states, rollback trigger classes, dual window bounds, fixture IDs, and phase-014 handoff fields [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the fail-closed Deep Review authority-control record, legacy/shadow/ledger postures, authority epoch, digest bindings, and invalid-input resolution [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T006 Define the externally authorized rollback switch as an auditable `ledger -> legacy` transition with healthy ledger frontier, legacy checkpoint, observed tail, reason, and restoration receipt [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T007 Define the bounded rollback window with start event, deadline, logical-operation or attempt budget, expiry disposition, renewal rule, and no-self-clear invariant [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T008 Define the rollback trigger matrix for parity drift, replay mismatch, seal/receipt failure, unknown effect, stale fence, contract drift, integrity failure, health quarantine, and canonical-write leakage [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T009 Build the independent Deep Review gate matrix for scope, dimensions, candidates, evidence, adjudication, P0/P1/P2, convergence, blocked stop, synthesis, report, resume, and continuity handoff [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T010 Bind the gate to the phase-012 shared review-loop and deep-alignment fence; reject mode-local copies of scope, lineage, convergence, report, or write-set semantics [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T011 Bind shadow-parity receipts, verified seal manifests, run certificates, receipt roots, replay fingerprints, resume outcomes, and rollback-drill evidence into the mode-gate certificate [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T012 Define the `PASS`, `BLOCKED`, `INDETERMINATE`, and `MIGRATED_SHADOW_READY` handoff semantics; prohibit authority movement and legacy-writer retirement [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T013 [P] Create clean, missing, stale, malformed, drifted, corrupted, unknown-effect, expired-window, and legacy-restoration fixtures [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify the full Deep Review lifecycle has a named gate row and evidence reference from scope through report and continuity handoff [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [ ] T015 Verify shadow parity event count, order, identity, causal links, payload digest, projection fingerprint, and declared volatility across all required fixtures [OPEN: the fresh focused gate run timed out in the parity exit-status independence probe]
- [x] T016 Verify every target, pass, candidate, adjudication, convergence, synthesis, report, and resume reference is sealed and tamper-evident [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T017 Verify the run certificate, receipt-set closure, replay fingerprint, and mode-gate certificate independently from live execution [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T018 Verify absent, malformed, stale, unauthorized, mismatched, or expired authority controls resolve to legacy authority or block [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T019 Verify every rollback trigger freezes ledger-authoritative work, restores the matching legacy checkpoint when possible, and emits an immutable restoration receipt [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [x] T020 Verify deadline and logical-operation rollback bounds, expiry, renewal, and stale-window rejection [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
- [ ] T021 Verify Deep Review gate status is independent from deep-alignment, generic dashboards, final report text, and numeric convergence alone [OPEN: the fresh focused gate run timed out in the parity exit-status independence probe]
- [x] T022 Verify the phase-014 handoff emits only `MIGRATED_SHADOW_READY` evidence and no cutover, window-close, or legacy-retirement action [Evidence: HEAD `b14b87a`; `runtime/lib/deep-review-rollback-gate/mode-gate.ts:62-844`, `rollback-switch.ts:183-396`; fresh focused suite recorded 83 passing assertions, with only the parity exit-status independence probe timing out]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete [OPEN: T015 and T021 remain unverified because the focused parity exit-status independence probe timed out]
- [ ] All requirements in spec.md met with evidence [OPEN: REQ-007 independence remains unverified by the timed-out focused probe]
- [ ] Phase gate green (`validate.sh`, contract, fixture, parity, seal, certificate, and rollback checks as applicable) [OPEN: focused rollback-gate suite exit 1, 83/84; one 30s timeout]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
