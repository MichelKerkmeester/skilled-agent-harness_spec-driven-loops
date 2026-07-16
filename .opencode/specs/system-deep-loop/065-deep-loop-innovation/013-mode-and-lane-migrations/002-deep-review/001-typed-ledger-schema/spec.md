---
title: "Feature Specification: Deep Review - Typed Ledger Schema"
description: "Plan the Deep Review mode event vocabulary over the shared typed append-only ledger: a versioned envelope specialization, typed review lifecycle, scope and dimension passes, candidate findings, adjudication, convergence, and review-report handoff. This phase defines events and upcaster hooks only; reducers and projections belong to the next sibling."
trigger_phrases:
  - "deep review typed ledger schema"
  - "deep-review event vocabulary"
  - "deep review append-only events"
  - "deep review ledger migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T19:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Review event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase 012 freeze?"
      - "Which review evidence references remain portable without storing report bodies in ledger rows?"
    answered_questions:
      - "This phase owns Deep Review event vocabulary, not reducers or projections"
      - "Deep Review consumes the shared review-loop contract used by deep-alignment"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Review - Typed Ledger Schema

> Phase adjacency under the 002-deep-review parent (grouping order, not a runtime dependency): predecessor: none (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-review |
| **Origin** | Deep Review mode migration after the phase-006 transition-authorized ledger core and phase-012 shared event contracts |
| **Inputs** | `065-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`, and the checked-in `deep-review/SKILL.md` state contract |
| **Output** | A ratifiable Deep Review event union, field-level payload contract, and version/upcaster hook plan; no reducer or projection implementation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current Deep Review loop externalizes run state through immutable config, append-only JSONL, iteration markdown, a reducer-owned findings registry, strategy and dashboard views, and a synthesized `review-report.md`. The live state contract carries lineage, review dimensions, per-iteration findings, evidence references, convergence signals, graph events, blocked-stop gates, claim adjudication, and final verdicts, but these records are not a mode-owned typed event vocabulary. Scope discovery, dimension scheduling, candidate production, severity adjudication, continuity, convergence, and report publication therefore lack one append-only identity and replay boundary.

The research inputs identify the missing Deep Review contract. A pass should emit candidates before independent validation activates P0/P1 findings; impact, confidence, reachability, exploitability, evidence strength, and evidence scope must remain separate axes; cross-pass identity needs versioned semantic fingerprints and introduced/fixed/preexisting lineage; and a runtime difference is a witness rather than a verdict. These findings are recorded in `findings-registry-modes.json:2619-2876` and the corresponding counterclaims in `findings-registry.json:4436-4510`. Shared runtime findings additionally require immutable observations, raw pre-reduction values, explicit supersession, stable logical identifiers, and versioned replay compatibility (`findings-registry.json:2600-2747`).

This phase plans the typed append-only vocabulary that carries those facts through the shared ledger. It specializes the event envelope supplied by phase 006 and consumes the shared review-loop contract frozen in phase 012, including the contract shared with deep-alignment mode 008. It does not decide how events fold into the findings registry, dashboard metrics, strategy state, convergence projections, or report-derived views. Those responsibilities remain with `002-reducers-and-projections` and the later mode-gate, rollback, and authority phases.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `deep-review` event-envelope specialization that reuses the phase-012 shared identity, causation, authorization, integrity, lineage, and replay fields without redefining them.
- A stable event namespace for run initialization, resume/restart, scope resolution, dimension ordering, per-dimension passes, evidence observations, candidate findings, claim adjudication, finding lineage, convergence, blocked stops, synthesis, review-report publication, and continuity handoff.
- Field-level types and requiredness rules for run, lineage, target, dimension, protocol, iteration, finding candidate, evidence reference, claim-adjudication packet, semantic fingerprint, convergence gate, report revision, and continuity references.
- Append-only provenance rules: immutable raw observations, content and source digests, file-and-line evidence references, causal links, independent evidence classes, supersession references, and event-tail hashes.
- Version boundaries for the envelope and each event payload, plus pure upcaster and compatibility-decision hooks for legacy Deep Review JSONL records.
- Fixtures and validation matrices proving every event type is authorized by the phase-006 gateway and remains replay-addressable without implementing a reducer.

### Out of Scope
- Reducer algorithms, findings-registry folds, dashboard metrics, strategy updates, convergence projections, or `review-report.md` materialized-view generation; these belong to `002-reducers-and-projections`.
- Sealed review artifacts, certificates, mode rollback switches, or the independent mode gate; these are sibling concerns in the Deep Review parent.
- Shared envelope ownership, transition policy, ledger storage, authorization semantics, generic effect receipts, or the shared review-loop contract; phase 006 and phase 012 own those contracts.
- Authority cutover, in-flight state migration, legacy writer retirement, and deletion of `deep-review-state.jsonl`.
- New review behavior beyond the Deep Review lifecycle and recommendations already mapped in the cited registries.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep Review envelope specializes the phase-012 shared envelope without shadow field names, duplicate lineage fields, or mode-local authorization rules | A contract comparison lists every inherited field, every mode extension, and every rejected duplicate; the mode union compiles against the shared contract |
| REQ-002 | The event namespace covers the complete run path from scope initialization through per-dimension passes, convergence, synthesis, and review-report handoff | The vocabulary matrix contains a typed event for each lifecycle boundary and names the required predecessor event or causal reference |
| REQ-003 | Every event has deterministic identity, causal linkage, payload digest, source or artifact references where applicable, and append-only revision semantics | Schema fixtures reject missing IDs, mutable evidence bodies, absent `prevEventHash`, and in-place finding or judgment updates |
| REQ-004 | Review-specific entities and provenance remain explicit | Target, dimension, protocol, iteration, finding candidate, evidence, claim-adjudication, fingerprint, gate, report revision, and lineage payloads have stable typed references |
| REQ-005 | Raw observations remain distinct from derived severity and verdict decisions | Raw analyzer output, test result, runtime witness, candidate score, evidence class, adjudication packet, P0/P1/P2 severity, and convergence decision retain separate fields |
| REQ-006 | Cross-pass finding identity and lineage survive source movement and revision | Fingerprints use semantic anchors, normalized context, program slices, rename mapping, and baseline state; `introduced`, `updated`, `unchanged`, `fixed`, `preexisting`, `absent`, and `disproved` remain distinguishable |
| REQ-007 | Envelope and payload version changes have explicit compatibility and upcaster hooks | The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, and blocked outcomes; an unknown event or version fails closed |
| REQ-008 | All event writes carry the phase-006 transition-authorization reference and phase-012 replay metadata | An unauthorized transition fixture is rejected before append, and a replay fixture resolves the same event identity and fingerprint from the same input |
| REQ-009 | Candidate production cannot silently become verdict-bearing publication | A candidate fixture requires independent validation and typed claim adjudication before P0/P1/P2 activation; confidence and impact remain orthogonal |
| REQ-010 | The schema boundary is limited to event vocabulary and handoff contracts | A scope audit finds no reducer, projection, report view, sealed artifact, certificate, authority-cutover, rollback, or mode-gate implementation in this phase |
<!-- /ANCHOR:requirements -->

The proposed event union is grouped by lifecycle and uses stable event stems with independent `eventVersion` values. Final field names for inherited envelope members remain subordinate to phase 012. The mode-specific payload plan is:

| Event stem | Required payload shape |
|------------|------------------------|
| `deep_review.run_initialized` | `runId: ReviewRunId`, target reference, target type, `sessionId: SessionId`, lineage mode, generation, `maxIterations: uint32`, convergence policy version, review-mode contract digest, and initial release-readiness state |
| `deep_review.run_resumed` / `deep_review.run_restarted` | Prior tail digest, source session or archived lineage, resume/restart reason, generation, continued-from-run, compatibility decision, and recovery receipt reference |
| `deep_review.scope_resolved` / `deep_review.dimension_ordered` | Target set digest, scope class, selected files or pointers, omitted high-risk targets, discovery methods, ordered dimension IDs, risk rationale, and scope evidence references |
| `deep_review.protocol_plan_recorded` | Core and overlay protocol IDs, applicability, gate class, contract version, planned evidence sources, and protocol-plan digest |
| `deep_review.dimension_pass_started` / `deep_review.dimension_pass_completed` | `dimensionId`, pass number, target references, iteration ID, files reviewed, search coverage digest, pass status, raw finding counts, and next-focus reference |
| `deep_review.finding_candidate_emitted` | `candidateId`, dimension, target and evidence references, claim text digest, finding class, impact axis, raw confidence, actionability, reachability, exploitability, evidence type/scope, semantic fingerprint parts, and source pass |
| `deep_review.evidence_observed` / `deep_review.evidence_reconciled` | Evidence ID, candidate ID, file-and-line or artifact locator, observation kind, raw result digest, tool and analyzer fingerprints, independent evidence class, causal-proximity status, stability status, relevance status, and supersession reference |
| `deep_review.claim_adjudication_recorded` | Finding or candidate ID, claim, evidence references, counterevidence sought, alternative explanation, final severity, confidence, downgrade trigger, transitions, validator fingerprint, and adjudication outcome |
| `deep_review.finding_lineage_recorded` / `deep_review.finding_state_changed` | Finding ID, prior and current semantic fingerprints, lineage relation, baseline status, severity or disposition change, reason, evidence set digest, and predecessor event reference; no prior event mutation |
| `deep_review.review_depth_recorded` | Review-depth schema version, applicability, target selection, required bug classes, covered/ruled-out/deferred/blocked classes, search-ledger row digests, and graph/semantic-search status |
| `deep_review.convergence_evaluated` / `deep_review.graph_convergence_evaluated` | Raw and weighted signals, dimension and protocol coverage, finding stability, P0/P1 resolution state, evidence density, hotspot saturation, graph decision, policy fingerprints, blockers, and stop candidate |
| `deep_review.blocked_stop_recorded` | Blocked gate IDs, complete gate-result objects, active finding counts, recovery strategy, target dimension, originating convergence event, and append position |
| `deep_review.pause_recorded` / `deep_review.recovery_started` | Normalized stop reason, sentinel or recovery cause, from-iteration, strategy, target dimension, outcome, lineage, and prior tail digest |
| `deep_review.synthesis_started` / `deep_review.review_report_committed` | Finalized event range, finding-registry input digest, deduplication policy digest, verdict inputs, report revision, report digest, section manifest, unresolved or deferred finding IDs, and report receipt |
| `deep_review.continuity_save_requested` / `deep_review.continuity_save_completed` / `deep_review.continuity_save_failed` | Target packet, continuity payload digest, source event range, route and merge mode, persistence receipt or record references, continuity fingerprint, retryability, and typed failure reason |
| `deep_review.run_completed` | Terminal status, convergence event ID, synthesis event ID, report event ID, continuity event ID, final ledger tail hash, dimension and finding counts, verdict, and completion or incomplete reason |

The envelope extension uses a typed `scope` object rather than repeating identifiers in every top-level field. `scope.runId` and `scope.sessionId` are required on all mode events; `scope.generation`, `scope.iterationId`, `scope.dimensionId`, `scope.candidateId`, `scope.findingId`, `scope.evidenceId`, `scope.protocolId`, and `scope.reportRevisionId` are required only where the event stem needs them. Payloads carry references and digests, not mutable source, code, transcript, strategy, dashboard, or report bodies. A payload that cannot identify its source, causal parent, policy version, or append position is invalid.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep Review event union is complete for scope, dimension passes, convergence, synthesis, review-report publication, and continuity handoff, mapped to the shared envelope and transition vocabulary.
- **SC-002**: Every event payload has field-level types, requiredness, identity links, digest rules, and a declared event version.
- **SC-003**: The vocabulary preserves raw observations and immutable evidence while representing candidate findings, adjudication, lineage, blocked stops, convergence, synthesis, and report publication as new events.
- **SC-004**: The compatibility plan rejects unknown versions and identifies deterministic upcaster hooks for supported legacy JSONL records.
- **SC-005**: Candidate findings cannot become P0/P1/P2 verdict-bearing state without a typed adjudication event that preserves orthogonal impact and confidence.
- **SC-006**: The phase contains no reducer, projection, sealed artifact, certificate, rollback, authority-cutover, or mode-gate contract owned by sibling concerns.

**Given** a valid phase-012 envelope, **When** a Deep Review event is encoded, **Then** its mode payload validates without redefining shared identity, lineage, authorization, or replay fields.

**Given** a dimension pass observes a possible defect, **When** the candidate event is replayed, **Then** its evidence, semantic fingerprint, raw measurements, and candidate status remain reconstructible without a verdict mutation.

**Given** a candidate has high impact but weak or non-independent evidence, **When** adjudication runs, **Then** the ledger preserves the candidate and records a separate confidence and evidence outcome rather than silently activating a blocker.

**Given** a convergence stop is proposed while a required dimension, protocol, evidence, or adjudication gate is incomplete, **When** the legal-stop decision is recorded, **Then** a typed blocked-stop event preserves every failed gate and recovery strategy.

**Given** an old Deep Review JSONL record has a registered compatible version, **When** the compatibility hook reads it, **Then** it produces a current payload with the original digest and upcaster fingerprint retained.

**Given** an event type or version has no registered decoder, **When** the ledger reader encounters it, **Then** replay returns a blocked compatibility result and does not guess a payload shape.

**Given** synthesis is requested with unresolved or deferred findings, **When** the review-report handoff is validated, **Then** the event records those IDs and cannot represent them as silently resolved.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-contract drift** - phase 012 may rename envelope fields, review-loop event stems, or transition tokens after this planning packet. Mitigation: mark inherited fields as shared, run a contract diff before implementation, and reject mode-local aliases.
- **Review/alignment divergence** - Deep Review and deep-alignment share the review-loop backbone, so a mode-local fork would create incompatible lineage, convergence, and report events. Mitigation: consume the frozen phase-012 shared review-loop contract and keep only Deep Review payload extensions here.
- **Candidate/verdict conflation** - treating an LLM or analyzer candidate as a finding can inflate severity and poison convergence. Mitigation: require candidate, evidence, and typed claim-adjudication events before P0/P1/P2 activation.
- **Mutable evidence leakage** - storing source text, code bodies, transcripts, or report bodies in event payloads makes replay and retention unsafe. Mitigation: store immutable artifact references, content digests, exact locators, and observation outcomes only.
- **Fingerprint instability** - absolute line ranges and path-only identity break across unrelated edits. Mitigation: retain semantic anchors, normalized context, program slices, rename mapping, baseline status, and a versioned fingerprint algorithm.
- **False convergence** - low novelty or repeated findings can hide missing dimensions, weak evidence, or correlated validators. Mitigation: preserve raw signals and every gate result; convergence and reducers remain separate consumers.
- **Upcaster loss** - legacy JSONL may lack stable finding, evidence, or lineage identifiers. Mitigation: allow typed `blocked` or `degraded` compatibility outcomes, preserve the original record digest, and never synthesize identity from mutable prose alone.
- **Cross-phase scope creep** - reducers, projections, reports, certificates, and authority changes are tempting to embed in the schema. Mitigation: use the explicit ownership boundary and the phase adjacency contract as review blockers.
- **Dependencies**: phase 006 transition-authorized ledger core, phase 012 shared review-loop/event contracts and write-set conflict graph, current Deep Review state references, the mode findings registry, the later `002-reducers-and-projections` sibling, and the deep-alignment shared-backbone contract.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact shared envelope field names, event identity algorithm, authorization receipt shape, and transition tokens does phase 012 freeze?
- Does the shared review-loop contract provide generic target, dimension, evidence, claim, gate, and report-reference types, or should Deep Review define narrow digest-only extensions?
- Which legacy Deep Review JSONL `type` and `event` values map directly to typed events, and which require a `degraded` or `blocked` compatibility disposition?
- Are graph events, traceability checks, and claim-adjudication packets emitted as shared events with mode payloads or as Deep Review-owned event stems?
- Which semantic fingerprint components and rename-map version are stable enough for the first schema version without coupling the reducer to one analyzer?
- Is review-report publication a mode event or a shared synthesis event with a Deep Review report payload and section manifest?

These questions are deliberately left for contract ratification and implementation planning. They do not authorize a reducer, projection, report view, or authority decision in this phase.
<!-- /ANCHOR:questions -->
