---
title: "Tasks: Deep AI Council - Sealed Reference Artifacts"
description: "Tasks for the Deep AI Council sealed reference artifact phase: inventory immutable inputs and outputs, bind them to shared content-addressed sealing primitives, define tamper-evident reads, and prove replay-safe reuse without certification or authority cutover."
trigger_phrases:
  - "Deep AI Council sealed artifacts tasks"
  - "deep-ai-council seal-on-write tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/002-mode-and-lane-migrations/003-deep-ai-council/003-sealed-artifacts"
    last_updated_at: "2026-08-15T13:00:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the ordered verified council artifact set"
    next_safe_action: "Consume the exported set only from separately scoped successor work"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-sealed-artifacts/deep-ai-council-artifact-set.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-sealed-artifacts.vitest.ts"
    completion_pct: 100
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

- [x] T001 Confirm phase-007 sealing primitives and phase-012 shared identity, artifact-reference, replay, receipt, authorization, and write-set contracts are frozen read-only inputs [EVIDENCE: focused Vitest 13/13; completed sibling and shared reference-set contracts reviewed]
- [x] T002 Confirm predecessor `002-reducers-and-projections` owns reference indexing and successor `004-certificates-and-receipts` owns certification; this phase introduces no second seal scheme [EVIDENCE: scoped diff contains no reducer, certificate, shared-service, or authority path]
- [x] T003 [P] Read the typed ledger schema, council findings registries, legacy `ai-council/**` artifacts, state fixtures, replay fixtures, and protected-vs-known-defect decisions [EVIDENCE: completed council ledger/reducer siblings and both sealed-artifact reference implementations inspected]
- [x] T004 [P] Record artifact ownership, logical identities, lifecycle scope, visibility classes, requiredness, source-event ranges, and supersession boundaries [EVIDENCE: focused Vitest 13/13; 25-kind closed registry and complete-set fixture]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Define the immutable input manifest for target, task class, strategy, prompt/tool/model capabilities, seat roster, reasoning methods, budgets, convergence policy, contract revisions, control arms, and test fixtures [EVIDENCE: focused Vitest 13/13; focused all-kind fixture seals every input registration]
- [x] T006 Define the immutable output inventory for proposals, critiques, blinded candidates, pairwise judgments, bias and counterfactual probes, convergence evidence, synthesis, minority records, council artifacts, and test-gate evidence [EVIDENCE: focused Vitest 13/13; focused all-kind fixture seals every output registration]
- [x] T007 Map each inventory row to the phase-007 seal primitive and phase-012 shared digest, identity, reference, replay, receipt, authorization, visibility, and write-set fields [EVIDENCE: real shared store, authorized ledger, verified evidence, and `ArtifactReferenceSet` path in focused Vitest]
- [x] T008 Define canonicalization and digest rules using the shared primitive, including byte metadata, schema version, policy version, and replay-fingerprint binding [EVIDENCE: repeated equivalent seals and complete-set builds are deterministic]
- [x] T009 Define seal-on-write ordering: canonicalize, digest, atomically create or reuse the immutable object, persist the shared manifest, and append the authorized seal/reference record [EVIDENCE: focused Vitest 13/13; focused real-store publication and ledger-recording harness]
- [x] T010 Define idempotent duplicate handling, changed-content behavior, supersession lineage, concurrent duplicate writes, failed writes, late outputs, and quarantine states [EVIDENCE: focused Vitest 13/13; focused idempotence and partial-publication fixtures plus shared store contract]
- [x] T011 Define the tamper-evident read contract for digest resolution, manifest verification, logical scope, source-event range, replay compatibility, visibility, safe path handling, and explicit failure results [EVIDENCE: focused Vitest 13/13; focused tamper, missing, dependency, epoch, kind, binding, and visibility fixtures]
- [x] T012 Define resume and reproduction decisions for compatible reuse, re-execution, compensation, quarantine, and rejection without overwriting historical sealed objects [EVIDENCE: focused Vitest 13/13; stale context blocks replay; shared store preserves published content addresses]
- [x] T013 Define the shadow-parity adapter comparing typed sealed references with legacy artifact identity, scope, content, required sections, and availability without changing authority [EVIDENCE: exact set comparator gates parity on the shared `reference_set_digest`; no authority path changed]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T014 Verify the contract map has no mode-local digest, manifest, seal, verification, or persistence authority outside the phase-007 primitive [EVIDENCE: source audit shows only shared `ArtifactReferenceSet` and `SealedArtifactStore` identities]
- [x] T015 Verify identical canonical bytes return one stable digest and object; changed bytes create a new digest and append-only supersession lineage [EVIDENCE: focused Vitest 13/13; focused equivalent-seal fixture plus shared content-addressed store contract]
- [x] T016 Verify missing, changed, malformed, unsafe, wrong-scope, wrong-visibility, stale, and quarantined reads return explicit blocked or non-verified results with no mutable-path fallback [EVIDENCE: focused suite 13/13 and shared substrate failure contract]
- [x] T017 Verify private seat evidence and blinded candidate identity remain inaccessible outside their declared information surfaces [EVIDENCE: focused Vitest 13/13; closed visibility map and allowed-visibility read expectation fixture]
- [x] T018 Verify repeated replay of one sealed input manifest and output set returns identical bytes, reference identities, manifests, and replay decisions [EVIDENCE: two complete-set builds are byte-identical and share one `reference_set_digest`]
- [x] T019 Verify resume after prompt, model, tool, policy, fixture, or output drift chooses re-execute, compensate, quarantine, or reject rather than unsafe reuse [EVIDENCE: changed replay context returns byte-free `EVIDENCE_CONFLICT`]
- [x] T020 Verify concurrent duplicate writes, late results, superseding test-gate evidence, and historical as-of reads preserve prior sealed evidence [EVIDENCE: focused Vitest 13/13; shared store is publish-once; focused partial-publication and supersession material remain fail-closed]
- [x] T021 Verify shadow parity against frozen legacy Deep AI Council artifacts and record differences without moving authority or issuing certificates [EVIDENCE: focused Vitest 13/13; exact reference-set comparator is additive-only and exports no certificate or authority mutation]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete
- [x] All requirements in spec.md met with evidence
- [x] Phase gate green (validate/replay/seal-read/shadow-parity as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
<!-- /ANCHOR:cross-refs -->
