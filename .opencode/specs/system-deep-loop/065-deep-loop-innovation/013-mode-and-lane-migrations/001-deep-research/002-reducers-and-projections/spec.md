---
title: "Feature Specification: Deep Research - Reducers & Projections"
description: "Plan the pure reducers and live projections for the deep-research migration: replay the typed event ledger into deterministic iteration/convergence state, an artifact index, and per-mode status without side effects or authority cutover."
trigger_phrases:
  - "deep research reducers"
  - "deep research projections"
  - "deep research event ledger replay"
  - "deterministic research state fold"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections"
    last_updated_at: "2026-07-15T17:30:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined pure deep-research folds and projection ownership boundaries"
    next_safe_action: "Freeze reducer algebra and replay fixtures against the typed ledger contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Reducers & Projections

> Phase adjacency under `001-deep-research` (navigation order, not a hard runtime dependency): predecessor `001-typed-ledger-schema`; successor `003-sealed-artifacts`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/002-reducers-and-projections |
| **Level** | 2 |
| **Priority** | P0 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop (deep-research mode migration) |
| **Origin** | Second child of the `001-deep-research` phase-013 mode migration parent |
| **Depends on** | `[]` in `manifest/phase-tree.json`; sibling references are navigation only |
| **Parent outcome** | Plan the deep-research reducers and projections over the typed event-ledger substrate |
| **Authority posture** | Pure planning and projection-contract work; no ledger authority or runtime cutover |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current deep-research control path does not expose one replayable state model. The live reducer reads the complete
state log and reparses iteration Markdown, while heartbeat paths also inspect the full history; the research findings
explicitly identify this as different from a claimed delta fold (`.opencode/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs` and `.opencode/commands/deep/assets/deep_research_auto.yaml`). A raw `newInfoRatio`, prose-only Next Focus value, or terminal report cannot establish which evidence was trusted, which claims were superseded, which artifacts are reusable, or why a run is incomplete rather than converged.

This phase plans the pure reducers that replay the typed events frozen by predecessor `001-typed-ledger-schema` into
three mode-owned projections: iteration and convergence state, an artifact index, and per-mode status. The fold must
retain immutable observations and versioned judgments while deriving current views. An identical event sequence and
reducer version must yield the same projection, projection fingerprint, ordering, and status. The reducers do not
search, call models, write the ledger, seal artifacts, select production thresholds, or move authority.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A pure `deep-research` fold over the phase-004 typed event envelope, with explicit event ownership, canonical replay order, reducer version, and projection fingerprint.
- Iteration state: research-plan revisions, branch lifecycle, query and evidence admission outcomes, trusted and provisional frontiers, claim/evidence revisions, next-focus obligations, and raw pre-reduction observations.
- Convergence state: observed versus finalized revision, coverage and evidence-yield inputs, contradiction and falsification obligations, cycle/lease observations, health-witness inputs, and the recorded `CONTINUE`, `STOP_ELIGIBLE`, `INDETERMINATE`, `converged`, `incomplete`, or quarantined outcomes.
- An immutable artifact index keyed by logical artifact identity and digest, linking artifact schema, producer event, logical branch, receipt references, validity state, and supersession history without constructing or sealing the artifact.
- Per-mode status derived from typed lifecycle events, including planned, active, paused, awaiting-evidence, converged, incomplete, blocked, quarantined, and failed states with deterministic transition provenance.
- Incremental fold checkpoints and a clean full-replay oracle, including cursor, seen-event identity, keyed entity state, and `rebuild_required` behavior when the projection contract changes.
- Compatibility projections needed to compare the new view with the legacy iteration/status shape while the ledger remains dark and non-authoritative.
- Fixture design for duplicate, late, reordered, superseding, malformed, missing-receipt, source-mutation, and partial-branch events.

### Out of Scope
- Defining or changing the typed event envelope, event names, schema versions, transition vocabulary, or authorization gateway; those belong to `001-typed-ledger-schema` and the shared phase-012/phase-006 contracts.
- Search execution, source capture, claim adjudication, semantic clustering, contradiction resolution, or convergence policy decisions. Reducers consume their typed results and never invoke those services.
- Creating, sealing, signing, or validating the final research artifact and certificate; that belongs to successor `003-sealed-artifacts` and its shared artifact contract.
- Resume classification, upcasting, legacy state migration, shadow-parity ownership, rollback switching, authority cutover, and legacy-writer retirement.
- Shared gauge-store implementation, budget enforcement, fan-out/fan-in orchestration, mode-interface design, write-set scheduling, or the independent mode gate.
- Hand-writing `description.json` or `graph-metadata.json` for this folder.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The reducer is a pure fold over the typed event sequence | Equal event sequence, schema/reducer versions, and fold options produce byte-equivalent projection data and fingerprint with no filesystem, network, clock, random, model, or ledger side effect |
| REQ-002 | Reducer ownership is explicit for every projected field | An ownership matrix maps each iteration, convergence, artifact-index, status, frontier, and fingerprint field to its input event types, fold algebra, and immutable-output rule; no field has competing owners |
| REQ-003 | Replay order is deterministic and arrival-order safe | Canonical ordering uses only persisted logical identity and sequence fields; completion timing, wall-clock values, process order, and object-key enumeration cannot change the projection |
| REQ-004 | Iteration and convergence state preserves evidence risk | The projection retains raw observations and versioned judgments, separates observed and finalized frontiers, distinguishes trusted evidence yield from raw novelty, and exposes unresolved contradiction, falsification, citation-drift, redundancy, health, lease, and incomplete blockers |
| REQ-005 | The artifact index is reversible and provenance-linked | Every artifact reference has stable identity, digest, schema, branch/iteration provenance, receipt links, validity state, and supersession history; invalid or missing artifacts remain explicit states and are never replaced by placeholders |
| REQ-006 | Per-mode status is derived, typed, and fail-closed | Status transitions are replayed from authorized lifecycle events, preserve terminal ambiguity and quarantine, reject impossible transitions, and never infer success from a missing event or absent artifact |
| REQ-007 | Projection fingerprints and rebuild boundaries are explicit | The fingerprint binds event schema, reducer version, codec, ordering policy, and projection content; incompatible changes, cursor gaps, truncation, or unseen event types produce `rebuild_required` or `blocked`, not silent reuse |
| REQ-008 | Incremental and full replay have the same semantics | Cursor-based folds retain per-plane cursors, seen event IDs, keyed state, and frontiers; differential fixtures prove incremental output equals a clean full fold for duplicates, late events, supersession, rotation, and replay from a checkpoint |
| REQ-009 | Compatibility output does not become a second authority | Legacy-shaped views are derived from the typed projection only, expose lossy-field warnings where needed, and remain shadow comparisons until the phase-014 cutover certificate |
| REQ-010 | The projection boundary is testable without live execution | Fixtures can replay deterministic event sequences and inspect all outputs, raw observations, rejection reasons, and fingerprints without invoking search, model, artifact-seal, or persistence code |
<!-- /ANCHOR:requirements -->

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: A reviewed reducer-ownership matrix covers every projected field and every phase-004 deep-research event family with one owner and one fold rule.
- **SC-002**: Replaying the same typed event sequence twice yields identical iteration/convergence state, artifact index, per-mode status, and projection fingerprint.
- **SC-003**: Permutation and late-arrival fixtures prove that logical identity and finalized-frontier rules prevent arrival order from changing trusted state.
- **SC-004**: Raw findings, claim/evidence revisions, contradiction obligations, invalid artifacts, and ambiguous outcomes remain inspectable while derived views expose only their typed current state.
- **SC-005**: Incremental replay matches clean full replay and emits `rebuild_required` for incompatible schema, reducer, cursor, or projection-fingerprint changes.
- **SC-006**: The projection contract is ready for successor `003-sealed-artifacts` to consume without giving this phase artifact-seal authority or changing the phase-013 mode gate boundary.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Schema drift from the predecessor contract** - A reducer can silently discard a new event field or accept an unknown event. Mitigation: bind the fold to the typed schema version, reject unknown required events, and require a fixture update for every schema change.
- **Arrival-order dependence** - Late branches or concurrent evidence can change a current projection even when the logical event set is unchanged. Mitigation: canonical logical ordering plus observed/finalized frontiers and permutation fixtures.
- **Raw novelty laundering untrusted evidence** - Fabricated, duplicate, poisoned, or derivative sources can make a loop look productive. Mitigation: preserve raw observations separately and count only admitted, independently supported claim deltas in trusted convergence inputs.
- **Projection mutation hides history** - Updating a claim, artifact, or judgment in place would break replay and targeted refresh. Mitigation: represent corrections and supersessions as events and derive current state from versioned history.
- **Artifact readiness is confused with artifact sealing** - A projection may claim a usable artifact before the successor verifies its seal. Mitigation: index references and receipt status only; retain `pending`, `invalid`, `unknown`, and `sealed` as distinct states owned by the artifact contract.
- **Legacy compatibility becomes accidental authority** - A legacy-shaped view can be mistaken for the production state. Mitigation: mark compatibility output as shadow-only and reserve authority movement for phase 014.
- **Dependencies**: the planned `001-typed-ledger-schema` contract, phase-012 `001-shared-mode-interfaces` and `004-write-set-conflict-graph`, the parent `013-mode-and-lane-migrations` outcome, and the research registries under `002-deep-loop-effectiveness-and-fanout`. The child remains `depends_on: []` in `manifest/phase-tree.json`; adjacency names are navigation only.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact phase-004 event names carry plan revisions, evidence admission, claim lifecycle, community snapshots, convergence witnesses, artifact references, and mode status, and which fields are required for canonical ordering?
- Is the finalized frontier advanced by the shared fan-in policy or by a deep-research reducer event, and which partial-failure policy is allowed to expose provisional evidence to next-focus selection?
- Which legacy fields can be projected losslessly, and which must carry an explicit lossy or unsupported marker during shadow parity?
- Which artifact validity states and receipt references are authoritative inputs for this projection, versus outputs reserved for `003-sealed-artifacts`?
- What checkpoint compaction and event-retention rule preserves contradiction history, supersession lineage, and resumed-leaf replay without requiring a full history read?

These decisions are resolved against the frozen typed schema and shared mode contract before implementation. They do not authorize a runtime writer, a seal, a convergence threshold, or an authority cutover in this Planned phase.
<!-- /ANCHOR:questions -->
