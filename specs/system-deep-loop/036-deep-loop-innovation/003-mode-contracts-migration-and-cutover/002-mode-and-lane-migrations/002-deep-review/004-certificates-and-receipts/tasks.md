---
title: "Tasks: Deep Review - Certificates & Receipts"
description: "Tasks for the Deep Review per-run certificate, per-transition receipt, replay-fingerprint, and independent offline-verifier contract."
trigger_phrases:
  - "deep review certificates and receipts tasks"
  - "deep-review transition receipt tasks"
  - "offline certificate verifier tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/002-mode-and-lane-migrations/002-deep-review/004-certificates-and-receipts"
    last_updated_at: "2026-08-17T04:04:40Z"
    last_updated_by: "codex"
    recent_action: "Reverified receipts, certificates, and offline closure at HEAD"
    next_safe_action: "Successor 005 can consume verified checkpoint evidence"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-review-certificates/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-review-certificates.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The certificate attests recorded process integrity, not semantic truth"
---
# Tasks: Deep Review - Certificates & Receipts

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

- [x] T001 Confirm phase `003-sealed-artifacts`, phase 012 shared review-loop contracts, and `001-typed-ledger-schema` are frozen before naming certificate or receipt fields [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T002 Inventory every Deep Review typed event and its scope, evidence, adjudication, convergence, synthesis, report, and continuity references [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T003 Build the receipt coverage matrix for run, scope, pass, evidence, adjudication, lineage, convergence, recovery, synthesis, report, and completion transitions [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T004 [P] Record the Deep Review and deep-alignment shared-backbone boundary and reject mode-local copies of shared transitions [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T005 [P] Freeze the offline verifier trust bundle and its allowed certificate, ledger, contract, and sealed-artifact inputs [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T006 Define the versioned transition receipt type with shared identity, causal, authorization, event-tail, attempt, effect, input, output, and review evidence references [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T007 Define the per-run certificate subject, attested claims, receipt-set root, finalized event range, report handoff, unresolved state, and verifier result [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T008 Define the receipt matrix for scope resolution, ordered dimensions, candidate/evidence events, adjudication, finding lineage, convergence, blocked stop, synthesis, report publication, and completion [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T009 Define stable and behavior input classes for the canonical replay fingerprint, including target, scope, dimensions, protocol, executor, tool, analyzer, evaluator, schema, policy, artifact, reducer, and report inputs [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T010 Define exact, compatible, migrate, pin-old-runtime, blocked, invalid, incomplete, and unknown-effect outcomes without collapsing them into terminal success [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T011 Define append-only supersession and late-evidence links; preserve raw observations and require adjudication receipts before P0/P1/P2 activation [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T012 Define the independent offline verifier pipeline and fixtures for normal, incomplete, blocked, contested, retried, late, tampered, unknown-version, and missing-reference runs [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify the receipt and certificate types reuse phase `003-sealed-artifacts` and phase 012 primitives without duplicate shared identity, lineage, authorization, or replay fields [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T014 Verify every in-scope transition has immutable receipt coverage and every receipt resolves to causal, authorization, event-tail, input, output, and effect references [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T015 Verify certificate claims resolve to the pinned event range, receipt-set root, scope and dimension coverage, convergence outcome, report revision, and unresolved or blocked IDs [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T016 Verify unchanged replay produces stable receipt and run fingerprints, while changed target, policy, schema, tool, evaluator, artifact, reducer, or report inputs produce typed mismatch decisions [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T017 Verify candidate, evidence, adjudication, P0/P1/P2, convergence, and report stages remain separate and raw observations are never replaced by derived claims [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T018 Verify the offline verifier runs without model, network, external tool, or mutable workspace access and fails closed on tampering, missing inputs, unknown versions, and contradictory chains [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T019 Verify unknown external effects remain unknown or recovery-required and cannot be certified as successful completion [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
- [x] T020 Verify the phase scope excludes reducers, report rendering, resume policy, rollback switching, authority cutover, and mode-gate implementation [Evidence: `implementation-summary.md` records the delivered contract and passing verification]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: `implementation-summary.md#verification`; fresh certificate suite exit 0, 67/67]
- [x] All requirements in spec.md met with evidence [Evidence: `runtime/tests/unit/deep-review-certificates.vitest.ts:1271-1713`; fresh certificate suite exit 0, 67/67]
- [x] Phase gate green (validate/build/test as applicable) [Evidence: fresh targeted Vitest 67/67 and whole-runtime TypeScript exit 0; strict packet result recorded in `implementation-summary.md#verification`]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Predecessor**: See `003-sealed-artifacts/`
- **Successor**: See `005-resume-adapter/`
<!-- /ANCHOR:cross-refs -->
