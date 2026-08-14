---
title: "Feature Specification: Closeout and Drift Reconcile"
description: "Plan the final documentation and evidence reconciliation that separates library, shadow, and authority status, joins measured composition into the 178-row recommendation ledger, removes stale claims and paths, and aligns epic completion with the verified production boundary."
trigger_phrases:
  - "closeout and drift reconcile"
  - "deep-loop three field status"
  - "recommendation ledger composition status"
importance_tier: "important"
contextType: "implementation"
parent: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile"
    last_updated_at: "2026-08-14T12:25:54Z"
    last_updated_by: "opencode"
    recent_action: "Authored the planned closeout and drift-reconciliation contract"
    next_safe_action: "Wait for fleet cutover, then execute the measured reconciliation"
    blockers:
      - "Predecessor 004-fleet-authority-cutover must complete"
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Closeout and Drift Reconcile

> Phase adjacency under `009-innovation-gap-remediation`: predecessor `004-fleet-authority-cutover`; successor `none`. The predecessor is a hard execution dependency because this phase reports final authority state.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/009-innovation-gap-remediation/005-closeout-and-drift-reconcile |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-08-14 |
| **Owner skill** | system-deep-loop |
| **Origin** | Final child of the innovation-gap remediation packet |
| **Depends on** | `004-fleet-authority-cutover` |
| **Closes** | rec6, F5.1, F5.2, F5.4, and epic-completion reconciliation |
| **Authority posture** | Reporting and documentation only; this phase does not flip authority |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The program architecture separates three facts that a single status label cannot represent: the typed library can be
built, a mode can run in shadow, and canonical authority can remain on or move from legacy independently. The durable
goal describes the additive-dark sequence followed by per-mode cutover
(`specs/system-deep-loop/036-deep-loop-innovation/goal.md:23-29`). The authority contract likewise distinguishes
legacy-authoritative, shadowing, cutover-ready, reversible dark authority, final dark authority, and rollback-pending
states (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/spec.md:117-147`). A collapsed status can therefore report a mode as complete because its library exists while hiding that shadow wiring or production authority is incomplete.

The confirmed records already show why those facts must remain separate. The authority-flip implementation summary
records a built but dark and unwired library (`specs/system-deep-loop/036-deep-loop-innovation/003-mode-contracts-migration-and-cutover/003-staged-state-migration-and-authority-cutover/002-per-mode-authority-flip/implementation-summary.md:47-48,127-129`), while the current coordinator requires an independently resolved actor and capability before it attempts authorization or a durable write (`.opencode/skills/system-deep-loop/runtime/lib/per-mode-authority-flip/cutover-coordinator.ts:48-84,129-150`). The identity-hardening summary also corrects a broad landed claim into opt-in or partial production behavior (`specs/system-deep-loop/036-deep-loop-innovation/006-runtime-docs-and-integrity-hardening/011-identity-and-lock-ownership-hardening/implementation-summary.md:57-76`). These sources confirm that library presence, production shadow operation, and authority state need independent evidence.

The 178-row recommendation ledger currently proves source bijection and one disposition per row
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/spec.md:79-87,100-111`). Its implementation report confirms disposition totals and phase ownership, not the current composition of each recommendation in the delivered system
(`specs/system-deep-loop/036-deep-loop-innovation/001-research-inputs-and-architecture/004-architecture-coverage-and-transition-contract/002-recommendation-ledger-bijective-map/implementation-summary.md:93-103,116-146`). This phase must preserve those historical dispositions and join the phase-1 traceability result into a separately defined `composition_status`; it must not infer composition from adoption alone.

The purpose of this phase is to close that reporting gap after the fleet cutover. It updates every mode-parent document
to report `library/status`, `shadow/status`, and `authority/status`; reconciles every ledger row through the phase-1
traceability join; removes superseded historical claims and paths; reruns the final production-boundary matrix; and
updates epic-completion documents only when their statements match the final code and evidence. The durable goal makes
this reconciliation part of full completion (`specs/system-deep-loop/036-deep-loop-innovation/goal.md:84-101,295-315`).
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- Consume the phase-1 inventory of mode-parent documents and add three independent reporting fields to every row or metadata block: `library/status`, `shadow/status`, and `authority/status`.
- Define each field by its own evidence source. Library status reports delivered composition, shadow status reports production shadow wiring and verified observation, and authority status reports the durable canonical route; no field may be derived from another.
- Consume the phase-1 recommendation-to-implementation traceability join and write the measured `composition_status` for all 178 stable ledger IDs while preserving source provenance and the original disposition.
- Extend or update the ledger schema, deterministic projection, and validator so every source row joins exactly once and missing, duplicate, contradictory, or unsupported composition evidence fails closed.
- Inventory and remove stale historical gap claims after verifying their current replacement facts against code, final production-boundary evidence, and completed predecessor artifacts.
- Inventory stale pre-consolidation paths, replace them with existing canonical paths, and verify that every updated link resolves in the final tree.
- Execute the complete production-boundary matrix on one frozen candidate and evidence set. The matrix includes candidate freeze, build, eight mode gates, parity, replay, crash recovery, fencing and authority, adjudication, health, legacy retirement, receipts, review, strict validation, and mutation checks (`specs/system-deep-loop/036-deep-loop-innovation/goal.md:496-517`).
- Reconcile the epic goal, parent phase map, mode-parent status fields, recommendation ledger, completion records, tasks, checklists, implementation summaries, descriptions, and graph metadata with the verified code and matrix result.

### Out of Scope
- Implementing missing library capability, shadow wiring, authority cutover, rollback, or legacy retirement. A failed or incomplete fact reopens its owning predecessor instead of being relabeled by this phase.
- Changing a recommendation's immutable ID, source text, source locator, or historical disposition merely to make composition appear complete.
- Inventing `composition_status` from packet status, adoption phase, file presence, or unchecked completion prose. The phase-1 traceability join is the required source.
- Treating historical test counts, landed commits, implementation summaries, or generated metadata as current production-boundary proof without a final-candidate rerun.
- Rewriting research inputs, deleting retained evidence, moving runtime files, or changing canonical authority.
- Creating a replacement runtime status API. This phase reconciles documents, ledger artifacts, validators, and closeout evidence.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | Every mode parent reports three independent status fields | The phase-1 mode-parent inventory is complete and every inventoried document contains `library/status`, `shadow/status`, and `authority/status`; each value cites its own current evidence and no collapsed status substitutes for any field |
| REQ-002 | Status language preserves stage boundaries | Library completion does not imply shadow wiring, shadow success does not imply canonical authority, and authority state is derived from the durable per-mode production record; contradictory or unavailable evidence produces an explicit non-green value rather than an inferred pass |
| REQ-003 | The ledger records measured composition without rewriting disposition | All 178 immutable IDs join exactly once to the phase-1 traceability output; each row preserves source provenance and disposition and gains a `composition_status` accepted by the phase-1-owned vocabulary and evidence contract |
| REQ-004 | Ledger reconciliation fails closed | The schema, deterministic review projection, and validator reject missing IDs, duplicate joins, unknown status values, unsupported evidence, source/disposition mutation, or nondeterministic output |
| REQ-005 | Historical claims and paths are current and resolvable | Every candidate stale claim is checked against current code and final evidence before correction; every stale pre-consolidation path is replaced or explicitly retained with rationale; a repository scan finds zero unresolved in-scope stale claims or broken paths |
| REQ-006 | The final production-boundary matrix is green on one candidate | Every declared matrix row executes against the same frozen candidate and evidence identities, records command/result evidence, has zero omitted or waived blocking rows, and reruns after any relevant drift |
| REQ-007 | Epic completion prose matches code and evidence | The epic goal, phase map, mode-parent fields, ledger composition, completion records, tasks, checklists, summaries, and generated metadata make no contradictory implementation, shadow, authority, or completion claim |
| REQ-008 | Predecessor failures reopen their owner | `004-fleet-authority-cutover` is complete before execution; any missing mode cutover, failed matrix row, unresolved drift, or stale evidence blocks closeout and routes back to the owning phase instead of being documented as complete |

### Status semantics

| Field | Reports | Must not imply |
|-------|---------|----------------|
| `library/status` | Whether the required library composition is present and verified | Production shadow wiring or canonical authority |
| `shadow/status` | Whether the mode is production-shadowed with current parity and observation evidence | Canonical authority or final rollback-window closure |
| `authority/status` | Which durable route is canonical for the mode and at which verified state | Completeness of every optional library recommendation |

The concrete value vocabulary and evidence keys must come from phase 1. This phase may add a value only through an
explicit versioned amendment to that contract; it may not create local aliases while reconciling prose.
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: Every mode-parent document in the phase-1 inventory carries all three status fields with independent current evidence.
- **SC-002**: The 178-row ledger preserves 178 stable IDs and historical dispositions while every row receives exactly one validated `composition_status` from the phase-1 traceability join.
- **SC-003**: The stale-claim and stale-path inventories close with zero unresolved in-scope entries, and every replacement path resolves in the final tree.
- **SC-004**: Every production-boundary matrix row is green on the same frozen candidate with no skipped, waived, stale, or cross-candidate evidence.
- **SC-005**: Epic-completion documents, mode-parent statuses, ledger composition, packet completion records, and generated metadata agree with the verified code and authority state.
- **SC-006**: Recursive strict validation and scoped drift scans pass after deterministic metadata regeneration, and the final diff contains only approved closeout artifacts.

**Given** a mode whose library is implemented but whose shadow or authority evidence is incomplete, **When** its parent
document is reconciled, **Then** the three fields report those facts separately and no aggregate completion label hides
the incomplete stage.

**Given** the immutable recommendation ledger and the phase-1 traceability join, **When** composition is reconciled,
**Then** every stable ID receives exactly one evidence-backed `composition_status` without changing its source or
historical disposition.

**Given** a historical gap statement or pre-consolidation path, **When** closeout evaluates it, **Then** current code,
final evidence, and filesystem resolution either justify a precise replacement or retain the statement with an explicit
current rationale.

**Given** all predecessor work appears complete, **When** the final production-boundary matrix or documentation
reconciliation finds a mismatch, **Then** epic completion remains blocked and the owning phase reopens.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

The hard predecessor is `004-fleet-authority-cutover`; this phase cannot report final authority until the fleet sequence
and its production evidence are complete. Phase 1 is also a data dependency because it owns the mode-parent inventory,
traceability join, `composition_status` vocabulary, and evidence bindings that this phase reconciles. The canonical
178-row ledger and validator are confirmed existing inputs, while the exact phase-1 artifact names are not yet confirmed
in this phase folder; phase-1 completion must supply them before implementation begins.

The principal risk is false closeout: prose, an implementation summary, or generated metadata can appear green while
the underlying production state differs. The goal explicitly requires code and tests to prove current implementation
and directs contradictions to the earlier safe authority state
(`specs/system-deep-loop/036-deep-loop-innovation/goal.md:110-119`). The mitigation is an evidence precedence rule:
frozen-candidate production results and durable authority facts outrank summaries and generated status.

Other risks are mutating the historical ledger while adding composition, treating adoption as implementation, updating
only some mode parents, replacing a stale path with another nonexistent path, and carrying matrix evidence across code
drift. Deterministic joins, immutable-field checks, inventory closure, path-resolution scans, one-candidate evidence,
and owner reopening are mandatory. Historical prep documents themselves warn that claims can be superseded and that
counts can become stale (`specs/system-deep-loop/036-deep-loop-innovation/005-blocker-closeout/004-durable-write-boundaries/build-spec.md:3-14,62-66`), so no old numeric claim is copied forward without a current run.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

None blocking for planning. Before implementation, phase 1 must confirm the exact artifact names, closed status
vocabulary, evidence-key schema, and complete mode-parent inventory. Phase 4 must provide the final fleet-authority and
production-boundary evidence package. If either interface differs from this plan, this phase updates its document and
validator integration before reconciliation; it does not infer a substitute contract.
<!-- /ANCHOR:questions -->
