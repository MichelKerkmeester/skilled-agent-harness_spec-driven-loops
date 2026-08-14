---
title: "Implementation Plan: Closeout and Drift Reconcile"
description: "Implementation plan for three-field mode status, recommendation-ledger composition reconciliation, stale-claim and path cleanup, final production-boundary verification, and epic closeout alignment."
trigger_phrases:
  - "closeout drift reconciliation plan"
  - "three field mode status plan"
  - "ledger composition reconciliation plan"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
    last_updated_at: "2026-08-14T12:25:54Z"
    last_updated_by: "opencode"
    recent_action: "Planned the measured documentation and ledger closeout sequence"
    next_safe_action: "Wait for fleet cutover, then execute the measured reconciliation"
    blockers:
      - "Predecessor 004-fleet-authority-cutover must complete"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Closeout and Drift Reconcile

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop mode-parent docs, recommendation ledger, closeout evidence, and epic docs |
| **Change class** | Documentation, deterministic data reconciliation, validation, and final evidence rollup |
| **Authority** | Read and report only; authority changes belong to predecessor phases |
| **Primary inputs** | Phase-1 traceability join, phase-4 fleet evidence, 178-row ledger, current code, and production-boundary matrix |

### Overview
Execute a deterministic closeout pipeline after `004-fleet-authority-cutover`. Freeze the final candidate and consume
phase 1's measured inventories. Project three independent status fields into every mode-parent document, join measured
composition into every stable recommendation row, reconcile stale claims and paths against the final tree, run the full
production-boundary matrix, and update epic-completion documents only after all sources agree. The current goal defines
the matrix and requires final status/evidence reconciliation
(`specs/system-deep-loop/036-deep-loop-innovation/goal.md:295-315,496-517`).
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] `004-fleet-authority-cutover` is complete with mode-scoped durable authority evidence and no unresolved blocking rollback or production-boundary result
- [ ] Phase 1 publishes the complete mode-parent inventory, recommendation traceability join, closed `composition_status` vocabulary, and evidence bindings
- [ ] The canonical 178-row ledger, schema, deterministic projection, and validator pass their existing integrity gate before modification
- [ ] One clean candidate, tree identity, toolchain, and final production-boundary matrix manifest are frozen
- [ ] Stale-claim and stale-path candidate inventories are captured before edits, with an owner and replacement evidence source for each entry

### Definition of Done
- [ ] Every inventoried mode parent carries `library/status`, `shadow/status`, and `authority/status` with independent current evidence
- [ ] Every immutable ledger ID joins exactly once to a validated `composition_status`, with source and historical disposition unchanged
- [ ] The ledger schema, projection, and validator reproduce deterministically and reject malformed or incomplete joins
- [ ] No unresolved in-scope stale claim, stale pre-consolidation path, or contradictory epic-completion statement remains
- [ ] Every final production-boundary matrix row is green on the same frozen candidate with zero blocking skips or waivers
- [ ] Recursive strict validation, path resolution, drift scans, and scoped final-diff checks pass after generated metadata reconciliation
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Frozen closeout manifest**: binds the candidate, tree, phase-1 input digests, phase-4 evidence digests, ledger input digest, mode-parent inventory, matrix rows, commands, and expected outputs. Any relevant drift invalidates downstream results.
- **Three-field status projection**: maps each phase-1 mode-parent row to independent library, shadow, and authority evidence. It updates the owning document without deriving one field from another.
- **Traceability-join consumer**: reads the phase-1 recommendation-to-implementation join by immutable ledger ID and rejects missing, duplicate, or unsupported rows before writing any composition result.
- **Ledger composition reconciler**: preserves source fields and historical disposition, adds the measured `composition_status`, updates the schema and deterministic review projection, and reuses the phase-local validator as the integrity boundary. The original ledger contract requires one stable row per source recommendation (`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md:79-87,100-111`).
- **Claim and path drift scanner**: starts from a bounded candidate inventory, verifies each claim against current code and evidence, resolves each replacement path against the final tree, and rescans the same scope for residue.
- **Production-boundary verifier**: executes every frozen matrix row against one candidate and retains command, result, identity, and artifact evidence. It does not accept historical counts as a substitute for execution.
- **Epic closeout reconciler**: updates completion prose and packet status only after status projection, ledger validation, drift cleanup, and matrix verification are green; contradictions reopen their owner.

The order is fixed: freeze inputs -> verify predecessor and phase-1 contracts -> baseline ledger and docs -> project
three-field status -> join composition -> reconcile claims and paths -> execute matrix -> reconcile epic docs and generated
metadata -> rerun all gates -> inspect final diff. An earlier failure blocks later closeout writing.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Freeze the final candidate, predecessor evidence, phase-1 traceability artifacts, ledger baseline, mode-parent inventory, production-boundary manifest, and permitted closeout paths.
- Verify the existing ledger's row identity, source provenance, disposition, deterministic outputs, and validator result before adding composition.
- Capture the pre-edit three-field coverage, stale-claim inventory, stale-path inventory, broken-link set, and epic-document contradictions.
- Confirm the phase-1 field vocabulary and join schema; stop rather than inventing names or values if its delivered contract differs.

### Phase 2: Implementation
- Add `library/status`, `shadow/status`, and `authority/status` to every mode-parent document in the frozen inventory, with separate evidence bindings.
- Join all 178 ledger IDs to phase-1 composition evidence and update the canonical ledger, schema, deterministic projection, validation report, and validator as one coordinated change.
- Correct stale historical claims only after recording the superseding code or final evidence; retain still-true limitations with current wording.
- Replace stale pre-consolidation paths with existing canonical paths and preserve any intentional historical path as explicitly non-current evidence.
- Run the full production-boundary matrix and route each failure to its owning phase; do not update epic completion while any blocking row is red.
- Reconcile the epic goal, phase map, child status records, tasks, checklists, implementation summaries, descriptions, and graph metadata after all factual gates pass.

### Phase 3: Verification
- Rescan the complete mode-parent inventory and prove all three fields are present, independently sourced, and semantically non-collapsed.
- Rebuild and verify the ledger artifacts twice; compare bytes and prove 178 unique IDs, 178 successful joins, immutable source/disposition fields, and zero unsupported composition values.
- Rerun stale-claim, stale-path, broken-link, and contradictory-status scans over the same frozen scope and require zero unresolved entries.
- Rerun every production-boundary row on the final post-reconciliation candidate if any relevant tracked input changed.
- Regenerate scoped metadata, run recursive strict validation, inspect the approved-path diff, and prove no task-created temporary output remains.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Inventory-completeness check compares the phase-1 mode-parent set with documents containing all three exact field names and current evidence references |
| REQ-002 | Semantic fixtures cover library-only, shadow-without-authority, reversible authority, final authority, rollback-pending, and unavailable-evidence cases and reject collapsed or inferred passes |
| REQ-003 | A keyed join test requires every stable ledger ID exactly once and byte-compares all immutable source and disposition fields before and after composition reconciliation |
| REQ-004 | Negative fixtures remove, duplicate, alter, or assign an unsupported composition row and require schema/validator failure; repeated builds must be byte-identical |
| REQ-005 | Before/after scans use the same bounded claim/path inventory, resolve every current path, and report zero unresolved stale or broken entries |
| REQ-006 | Execute every row in the frozen production-boundary matrix on one candidate; candidate, BASE, command set, counts, and evidence drift invalidate the result |
| REQ-007 | Cross-document consistency check compares mode-parent fields, ledger composition, epic prose, completion records, and generated metadata against code and final evidence |
| REQ-008 | Negative owner-routing fixtures show an incomplete predecessor, failed matrix row, or evidence mismatch blocks closeout and identifies the owning phase |

The current runtime evidence confirms that authority reporting must inspect the specific production boundary rather than
the generic gateway alone: the generic gateway checks identity only when an optional resolver exists
(`.opencode/skills/system-deep-loop/runtime/lib/authorized-ledger/transition-authorization-gateway.ts:695-751`), while
the cutover coordinator requires its own resolver and denies unresolved identity
(`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:61-84,291-317`). Tests must
therefore verify the actual mode cutover path represented by phase-4 evidence.
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

The hard predecessor is `../004-fleet-authority-cutover`; this phase starts only after that phase supplies final
mode-scoped authority and production-boundary evidence. The earlier `../001-measurement-and-traceability` phase supplies
the inventories, join, vocabulary, and evidence bindings consumed here. These are execution dependencies even though
phase 1 is not adjacent.

The canonical ledger package is under
`../../../001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/`.
Its implementation report confirms the current 178-row validation baseline and deterministic artifacts
(`implementation-summary.md:137-168`). The durable goal supplies the epic-completion contract and production-boundary
matrix (`../../../goal.md:84-101,496-517`). Current runtime and implementation records supply confirmation evidence, but
phase-4 final receipts determine production authority. This phase has no successor.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase does not mutate runtime authority. Before reconciliation, retain the frozen ledger artifacts, mode-parent
documents, epic docs, generated metadata, and their digests. A failed documentation or ledger change rolls back as one
coordinated closeout set so schema, JSON, projection, validator, and prose cannot remain on different contracts.

Rollback never discards phase-1 traceability evidence, phase-4 authority receipts, production-boundary results, or the
historical recommendation disposition. If the final candidate or authority state changes after reconciliation, mark the
closeout evidence stale, restore the last internally consistent documentation set if needed, reopen the owning phase,
and rerun this plan on the new candidate. Do not edit status prose to conceal the drift.
<!-- /ANCHOR:rollback -->
