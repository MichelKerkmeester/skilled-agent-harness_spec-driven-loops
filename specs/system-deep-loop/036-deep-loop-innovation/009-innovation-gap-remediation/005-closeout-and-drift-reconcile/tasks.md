---
title: "Tasks: Closeout and Drift Reconcile"
description: "Tasks for three-field mode status, 178-row composition reconciliation, stale-claim and path cleanup, final production-boundary verification, and epic closeout alignment."
trigger_phrases:
  - "closeout drift reconciliation tasks"
  - "three field status tasks"
  - "ledger composition reconciliation tasks"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
    last_updated_at: "2026-08-14T12:25:54Z"
    last_updated_by: "opencode"
    recent_action: "Decomposed the planned closeout and reconciliation work"
    next_safe_action: "Wait for fleet cutover, then execute the measured reconciliation"
    blockers:
      - "Predecessor 004-fleet-authority-cutover must complete"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Closeout and Drift Reconcile

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

- [ ] T001 Verify `004-fleet-authority-cutover` is complete and freeze its per-mode authority, rollback, and production-boundary evidence; stop if any blocking row remains open
- [ ] T002 Freeze one final candidate, tree identity, BASE identity, tool versions, clean-state evidence, matrix manifest, and approved closeout path set
- [ ] T003 Load and validate phase 1's complete mode-parent inventory, recommendation traceability join, closed `composition_status` vocabulary, and evidence-key contract
- [ ] T004 Baseline the canonical 178-row ledger, schema, deterministic projection, validation report, validator result, stable IDs, source fields, and historical dispositions
- [ ] T005 Inventory every mode-parent document and record pre-edit coverage for `library/status`, `shadow/status`, and `authority/status`
- [ ] T006 Build bounded pre-edit inventories for stale historical claims, stale pre-consolidation paths, broken links, and contradictory epic-completion statements
- [ ] T007 Record the evidence precedence rule: final-candidate production and durable authority facts outrank summaries, packet status, and generated metadata
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T008 Add `library/status` to every inventoried mode parent using phase-1 composition evidence, without implying shadow or authority state
- [ ] T009 Add `shadow/status` to every inventoried mode parent using current production shadow, parity, and observation evidence, without implying authority state
- [ ] T010 Add `authority/status` to every inventoried mode parent using the durable per-mode canonical route and current phase-4 evidence
- [ ] T011 Reject or explicitly mark unavailable any status value whose evidence is missing, contradictory, stale, wrong-mode, or bound to another candidate
- [ ] T012 Join every immutable ledger ID exactly once to phase-1 traceability evidence and write its validated `composition_status` without changing source provenance or disposition
- [ ] T013 Update the ledger schema, deterministic review projection, validation report, and validator to enforce the composition join and preserve existing bijection guarantees
- [ ] T014 Rebuild ledger artifacts twice and require byte-identical output before accepting the reconciled files
- [ ] T015 Verify each stale historical claim against current code and final evidence, then correct only claims with a confirmed superseding fact
- [ ] T016 Replace each stale pre-consolidation path with an existing canonical path, or retain it only as explicitly labeled historical evidence with rationale
- [ ] T017 Execute every production-boundary matrix row on the frozen candidate and route any failure to its owning phase instead of continuing closeout
- [ ] T018 Reconcile the epic goal, parent phase map, mode-parent fields, completion records, tasks, checklists, implementation summaries, changelogs, descriptions, and graph metadata with the green final evidence
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T019 Rescan the frozen mode-parent inventory and prove every document contains all three exact fields with separate current evidence
- [ ] T020 Test stage-boundary semantics with library-only, shadow-without-authority, reversible-authority, final-authority, rollback-pending, and unavailable-evidence cases
- [ ] T021 Verify the ledger still has 178 immutable IDs and source rows, every ID has exactly one accepted composition join, and every historical disposition is unchanged
- [ ] T022 Run missing-row, duplicate-row, unsupported-status, evidence-mismatch, source-mutation, disposition-mutation, and nondeterministic-output negative fixtures against the ledger validator
- [ ] T023 Rerun the stale-claim, stale-path, broken-link, and contradictory-status scans over the original bounded inventories and require zero unresolved in-scope entries
- [ ] T024 Rerun the complete production-boundary matrix if reconciliation changed any matrix input, candidate identity, authority evidence, or protected contract
- [ ] T025 Regenerate only the scoped canonical metadata and verify mode-parent, ledger, epic, completion, description, and graph status consistency
- [ ] T026 Run strict validation for this child and recursive strict validation for the epic from the final candidate; record commands, exit codes, errors, and warnings
- [ ] T027 Inspect the scoped final diff, remove task-created temporary output, and prove only approved closeout artifacts changed
- [ ] T028 Record the final closeout receipt with candidate identity, phase-1 and phase-4 input digests, matrix verdict, ledger validation, drift-scan results, strict-validation results, and reopening rules
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in `spec.md` met with current evidence
- [ ] Every mode parent reports independent library, shadow, and authority status
- [ ] All 178 ledger rows carry one validated composition status with immutable source and disposition fields preserved
- [ ] No unresolved stale claim, stale pre-consolidation path, broken link, or contradictory completion statement remains
- [ ] The complete production-boundary matrix is green on one final candidate with zero blocking skips or waivers
- [ ] Epic-completion documents and generated metadata match the verified code and durable authority state
- [ ] Strict validation and final scoped-diff checks pass with no task-created residue
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Phase parent**: See `../spec.md`
- **Measurement and traceability predecessor input**: See `../001-measurement-and-traceability/`
- **Fleet authority predecessor**: See `../004-fleet-authority-cutover/`
- **Epic architecture and closeout contract**: See `../../../goal.md:23-29,84-101,295-315,496-517`
- **Recommendation ledger contract**: See `../../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md:79-87,100-111`
- **Recommendation ledger baseline evidence**: See `../../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:116-168`
- **Authority-stage contract**: See `../../../003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:117-147`
- **Current cutover coordinator evidence**: See `.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:48-84,108-150,291-317`
- **Identity status correction evidence**: See `../../../006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md:57-76`
- **Superseded-claim warning evidence**: See `../../../005-blocker-closeout/004-durable-write-boundaries/build-spec.md:3-14,62-66`
<!-- /ANCHOR:cross-refs -->
