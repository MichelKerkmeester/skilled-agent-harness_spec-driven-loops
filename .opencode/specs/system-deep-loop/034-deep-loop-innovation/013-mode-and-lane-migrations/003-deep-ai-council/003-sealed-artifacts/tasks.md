---
title: "Tasks: Deep AI Council - Sealed Reference Artifacts"
description: "Tasks for the Deep AI Council sealed reference artifact phase: inventory immutable inputs and outputs, bind them to shared content-addressed sealing primitives, define tamper-evident reads, and prove replay-safe reuse without certification or authority cutover."
trigger_phrases:
  - "Deep AI Council sealed artifacts tasks"
  - "deep-ai-council seal-on-write tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-07-15T22:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Separated sealing tasks from certificate and reducer ownership"
    next_safe_action: "Complete the council seal inventory and contract map"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Deep AI Council - Sealed Reference Artifacts

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

- [ ] T001 Confirm phase-006 sealing primitives and phase-012 shared identity, artifact-reference, replay, receipt, authorization, and write-set contracts are frozen read-only inputs
- [ ] T002 Confirm predecessor `002-reducers-and-projections` owns reference indexing and successor `004-certificates-and-receipts` owns certification; this phase introduces no second seal scheme
- [ ] T003 [P] Read the typed ledger schema, council findings registries, legacy `ai-council/**` artifacts, state fixtures, replay fixtures, and protected-vs-known-defect decisions
- [ ] T004 [P] Record artifact ownership, logical identities, lifecycle scope, visibility classes, requiredness, source-event ranges, and supersession boundaries
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T005 Define the immutable input manifest for target, task class, strategy, prompt/tool/model capabilities, seat roster, reasoning methods, budgets, convergence policy, contract revisions, control arms, and test fixtures
- [ ] T006 Define the immutable output inventory for proposals, critiques, blinded candidates, pairwise judgments, bias and counterfactual probes, convergence evidence, synthesis, minority records, council artifacts, and test-gate evidence
- [ ] T007 Map each inventory row to the phase-006 seal primitive and phase-012 shared digest, identity, reference, replay, receipt, authorization, visibility, and write-set fields
- [ ] T008 Define canonicalization and digest rules using the shared primitive, including byte metadata, schema version, policy version, and replay-fingerprint binding
- [ ] T009 Define seal-on-write ordering: canonicalize, digest, atomically create or reuse the immutable object, persist the shared manifest, and append the authorized seal/reference record
- [ ] T010 Define idempotent duplicate handling, changed-content behavior, supersession lineage, concurrent duplicate writes, failed writes, late outputs, and quarantine states
- [ ] T011 Define the tamper-evident read contract for digest resolution, manifest verification, logical scope, source-event range, replay compatibility, visibility, safe path handling, and explicit failure results
- [ ] T012 Define resume and reproduction decisions for compatible reuse, re-execution, compensation, quarantine, and rejection without overwriting historical sealed objects
- [ ] T013 Define the shadow-parity adapter comparing typed sealed references with legacy artifact identity, scope, content, required sections, and availability without changing authority
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T014 Verify the contract map has no mode-local digest, manifest, seal, verification, or persistence authority outside the phase-006 primitive
- [ ] T015 Verify identical canonical bytes return one stable digest and object; changed bytes create a new digest and append-only supersession lineage
- [ ] T016 Verify missing, changed, malformed, unsafe, wrong-scope, wrong-visibility, stale, and quarantined reads return explicit blocked or non-verified results with no mutable-path fallback
- [ ] T017 Verify private seat evidence and blinded candidate identity remain inaccessible outside their declared information surfaces
- [ ] T018 Verify repeated replay of one sealed input manifest and output set returns identical bytes, reference identities, manifests, and replay decisions
- [ ] T019 Verify resume after prompt, model, tool, policy, fixture, or output drift chooses re-execute, compensate, quarantine, or reject rather than unsafe reuse
- [ ] T020 Verify concurrent duplicate writes, late results, superseding gate evidence, and historical as-of reads preserve prior sealed evidence
- [ ] T021 Verify shadow parity against frozen legacy Deep AI Council artifacts and record differences without moving authority or issuing certificates
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/replay/seal-read/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
