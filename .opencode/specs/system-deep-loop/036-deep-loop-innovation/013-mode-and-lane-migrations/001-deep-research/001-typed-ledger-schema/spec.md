---
title: "Feature Specification: Deep Research - Typed Ledger Schema"
description: "Plan the Deep Research mode event vocabulary over the shared typed append-only ledger: a versioned envelope specialization, typed run lifecycle, question and branch planning, evidence and claim provenance, convergence decisions, synthesis, and memory-save handoff events. This phase defines events and upcaster hooks only; reducers and projections belong to the next sibling."
trigger_phrases:
  - "deep research typed ledger schema"
  - "deep-research event vocabulary"
  - "deep research append-only events"
  - "deep research ledger migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T17:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Research event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope field names and transition tokens does phase 012 freeze?"
      - "Which source locator representation is portable without placing evidence blobs in ledger rows?"
    answered_questions:
      - "This phase owns Deep Research event vocabulary, not reducers or projections"
      - "The ledger remains append-only and non-authoritative until the later mode cutover phase"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep Research - Typed Ledger Schema

> Phase adjacency under the 001-deep-research parent (grouping order, not a runtime dependency): predecessor: none (first sibling); successor: `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Planned |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-research |
| **Origin** | Phase 013 Deep Research migration, after phase 012 shared mode contracts and phase 006 transition-authorized ledger core |
| **Inputs** | `036-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`, and the checked-in `deep-research/SKILL.md` state contract |
| **Output** | A ratifiable Deep Research event union, field-level payload contract, and version/upcaster hook plan; no reducer or projection implementation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current Deep Research loop externalizes continuity through configuration, strategy markdown, iteration markdown, a findings registry, a dashboard, and an append-only JSONL state log. The live executor contract requires records with `type`, `iteration`, `newInfoRatio`, `status`, and `focus`, while the reducer reparses the full history and iteration files. This is operationally useful but not a typed event vocabulary: source captures, claim evidence, branch choices, convergence blockers, synthesis, and memory handoff are not independently addressable records.

The research inputs identify the missing mode contract. The mode recommendations call for a reducer-owned research-plan DAG, a claim-evidence-contradiction ledger, deterministic question/query/source identifiers, source admission decisions, a ClaimRecord intermediate representation, pre-synthesis claim promotion, and living-resume invalidation. The runtime findings separately require immutable observations, explicit supersession, replay fingerprints, effect receipts, and versioned compatibility. These findings are recorded in `findings-registry-modes.json:4984-5125` and `findings-registry.json:2600-2745`.

This phase plans the typed append-only vocabulary that can carry those facts through the shared ledger. It specializes the event envelope supplied by phase 006 and the shared event contracts frozen by phase 012. It does not decide how events fold into current state, how gauges are materialized, how reports are reduced, or when authority cuts over. Those responsibilities remain with `002-reducers-and-projections`, the later sibling phases, and the mode gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `deep-research` event-envelope specialization that reuses the phase-012 shared identity, causation, authorization, integrity, and replay fields without redefining them.
- A stable event namespace for `init`, `resume`, `restart`, question and branch planning, iteration execution, source and evidence admission, claim lineage, gap and next-focus decisions, convergence, synthesis, and memory-save handoff.
- Field-level types and requiredness rules for run, lineage, generation, iteration, question, branch, source version, evidence, claim version, convergence, synthesis, and continuity references.
- Append-only provenance rules: immutable raw observations, content and source digests, causal links, independent-source groups, supersession references, and event-tail hashes.
- Version boundaries for the envelope and each event payload, plus pure upcaster and compatibility-decision hooks for legacy Deep Research JSONL records.
- A fixture and validation matrix that proves every event type is authorized by the phase-006 gateway and remains replay-addressable without implementing a reducer.

### Out of Scope
- Reducer algorithms, projections, materialized gauges, `research.md` generation, or state reconstruction; these belong to `002-reducers-and-projections`.
- Sealed research artifacts, certificates, mode rollback switches, or the independent mode gate; these are sibling concerns in the Deep Research parent.
- Shared envelope ownership, transition policy, ledger storage, authorization semantics, or generic effect receipts; phase 006 and phase 012 own those contracts.
- Authority cutover, in-flight state migration, legacy writer retirement, and deletion of the existing JSONL path.
- New research behavior beyond the recommendations already mapped to Deep Research in the cited registries.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep Research envelope specializes the phase-012 shared envelope without shadow field names or mode-local authorization rules | A contract comparison lists every inherited field, every mode extension, and every rejected duplicate; the mode union compiles against the shared contract |
| REQ-002 | The event namespace covers the complete run path from initialization through iteration, convergence, synthesis, and memory-save handoff | The vocabulary matrix contains a typed event for each lifecycle boundary and names the required predecessor event or causal reference |
| REQ-003 | Every event has deterministic identity, causal linkage, payload digest, source or artifact references where applicable, and append-only revision semantics | Schema fixtures reject missing IDs, mutable evidence blobs, absent `prevEventHash`, and in-place claim or judgment updates |
| REQ-004 | Planning and evidence events preserve the mode's research-specific entities and provenance | Question, branch, source version, evidence admission, claim version, relation, gap, and next-focus payloads have explicit types and stable cross-event references |
| REQ-005 | Raw discovery and evaluation observations remain distinct from derived decisions | Iteration novelty, trusted evidence yield, source admission, claim status, and convergence decisions retain raw values and policy fingerprints without encoding reducer output as input |
| REQ-006 | Envelope and payload version changes have explicit compatibility and upcaster hooks | The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, and blocked outcomes; an unknown event or version fails closed |
| REQ-007 | All event writes carry the phase-006 transition-authorization reference and the phase-012 replay metadata | An unauthorized transition fixture is rejected before append, and a replay fixture resolves the same event identity and fingerprint from the same input |
| REQ-008 | The schema boundary is limited to event vocabulary and handoff contracts | A scope audit finds no reducer, projection, authority-cutover, sealed-artifact, certificate, or mode-gate implementation in this phase |
<!-- /ANCHOR:requirements -->

The proposed event union is grouped by lifecycle and uses stable event stems with independent `eventVersion` values. The final field names for inherited envelope members remain subordinate to phase 012. The mode-specific payload plan is:

| Event stem | Required payload shape |
|------------|------------------------|
| `deep_research.run_initialized` | `runId: RunId`, `lineageId: LineageId`, `generation: uint32`, `charterDigest: Digest`, `configDigest: Digest`, `executorFingerprint: Fingerprint`, `replayFingerprint: Fingerprint`, `maxIterations: uint32`, `convergencePolicyVersion: Version` |
| `deep_research.run_resumed` / `deep_research.run_restarted` | Prior tail digest, source lineage or archived lineage, resume/restart reason, generation, compatibility decision, and recovery receipt reference |
| `deep_research.question_registered` | `questionId: QuestionId`, normalized question digest, dependency IDs, required source classes, disconfirming query recipe IDs, and typed budget reference |
| `deep_research.branch_planned` / `deep_research.branch_selected` | `branchId: LogicalBranchId`, question ID, semantic cluster ID, expected-yield score vector, contradiction risk, impact, independence gain, staleness, expected cost, deterministic tie-break key, and reservation reference |
| `deep_research.iteration_started` / `deep_research.iteration_completed` | Iteration number, focus or branch references, state-tail digest, strategy digest, status, raw `newInfoRatio`, trusted evidence yield, output digest, ruled-out approach references, and next-focus causal reference |
| `deep_research.source_captured` | `sourceVersionId: SourceVersionId`, source identity digest, locator, capture timestamp, content digest, media type, retrieval receipt, parent source version, and instruction-scan result; locator is not source identity |
| `deep_research.evidence_admission_decided` | Evidence ID, source version ID, `admit | degrade | quarantine` disposition, exact passage locators, atomic claim references, derivative-source group, admission policy version, contamination status, and reason code |
| `deep_research.claim_asserted` / `deep_research.claim_relation_recorded` | Claim and claim-version IDs, normalized claim digest, evidence IDs, relation `supports | contradicts | qualifies | contextualizes`, independence group, raw confidence, and claim status |
| `deep_research.claim_superseded` | Prior and successor claim-version IDs, supersession reason, effective timestamp, replacement evidence references, and invalidation scope |
| `deep_research.gap_detected` / `deep_research.next_focus_selected` | Gap or obligation ID, gap kind, affected claim/question IDs, criticality, proposed query recipes, selection score vector, visit cooldown, policy version, and chosen branch or question |
| `deep_research.convergence_evaluated` / `deep_research.convergence_blocked` | Convergence decision, raw and trusted signals, quality-gate results, blocker IDs, policy/evaluator fingerprints, evidence tail, and explicit incomplete or recovery reason when applicable |
| `deep_research.synthesis_started` / `deep_research.synthesis_committed` | Admitted ledger revision, selected claim-version set digest, synthesis policy digest, report revision, report digest, citation event references, unresolved or contested claim IDs, and synthesis receipt |
| `deep_research.memory_save_requested` / `deep_research.memory_save_completed` / `deep_research.memory_save_failed` | Target packet, continuity payload digest, route and merge mode, source event range, persistence receipt or record references, continuity fingerprint, retryability, and typed failure reason |
| `deep_research.run_completed` | Terminal status, convergence event ID, synthesis event ID, memory-save event ID, final ledger tail hash, counts, and completion or incomplete reason |

The envelope extension uses a typed `scope` object rather than repeating IDs in every top-level field. `scope.runId` and `scope.lineageId` are required on all mode events; `scope.iteration`, `scope.branchId`, `scope.questionId`, `scope.sourceVersionId`, `scope.evidenceId`, and `scope.claimVersionId` are required only where the event stem needs them. Payloads carry references and digests, not mutable source or report bodies. A payload that cannot identify its source, causal parent, policy version, or append position is invalid.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep Research event union is complete for the run path and is mapped to the shared envelope and transition vocabulary.
- **SC-002**: Every event payload has field-level types, requiredness, identity links, digest rules, and a declared event version.
- **SC-003**: The vocabulary preserves raw observations and immutable evidence while representing admission, relation, supersession, convergence, synthesis, and memory handoff as new events.
- **SC-004**: The compatibility plan rejects unknown versions and identifies deterministic upcaster hooks for supported legacy records.
- **SC-005**: The phase contains no reducer or projection contract owned by `002-reducers-and-projections`.

**Given** a valid phase-012 envelope, **When** a Deep Research event is encoded, **Then** its mode payload validates without redefining shared identity, authorization, or replay fields.

**Given** an iteration captures a source and asserts a claim, **When** the event sequence is replayed, **Then** source version, evidence, claim version, relation, and digest references remain reconstructible without mutable updates.

**Given** a source is poisoned, derivative, stale, or unverifiable, **When** evidence admission runs, **Then** the ledger records `degrade` or `quarantine` with a typed reason instead of silently feeding the trusted frontier.

**Given** an old Deep Research JSONL record has a registered compatible version, **When** the compatibility hook reads it, **Then** it produces a current payload with the original digest and upcaster fingerprint retained.

**Given** an event type or version has no registered decoder, **When** the ledger reader encounters it, **Then** replay returns a blocked compatibility result and does not guess a payload shape.

**Given** synthesis is requested with unsupported or contested claims, **When** the handoff event is validated, **Then** the event records the unresolved claim references and cannot represent them as silently supported.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-contract drift** - phase 012 may rename envelope fields or transition tokens after this planning packet. Mitigation: mark inherited fields as shared, run a contract diff before implementation, and reject mode-local aliases.
- **Vocabulary overlap** - generic ledger events, fan-in events, and Deep Research evidence events can claim the same lifecycle boundary. Mitigation: publish an ownership table with one writer family per event stem and route cross-mode facts through the shared event contract.
- **Mutable evidence leakage** - storing source text or report bodies in event payloads makes replay and retention unsafe. Mitigation: store immutable artifact references, content digests, exact locators, and admission decisions only.
- **False convergence** - raw `newInfoRatio` can be low while evidence risk remains high. Mitigation: retain raw signals but include trusted yield, claim blockers, contradiction risk, citation drift, and incomplete status in convergence events; the convergence reducer remains out of scope.
- **Upcaster loss** - a legacy JSONL record may lack claim or source identifiers. Mitigation: allow a typed `blocked` or `degraded` compatibility outcome, preserve the original record digest, and never synthesize stable identity from mutable prose alone.
- **Source poisoning** - fetched content may contain instructions that must not influence the runtime. Mitigation: record retrieval and instruction-scan outcomes as evidence fields and keep admission separate from trusted claim state.
- **Cross-phase scope creep** - reducers, projections, certificates, and authority changes are tempting to embed in the schema. Mitigation: use the explicit ownership boundary and the phase adjacency contract as review blockers.
- **Dependencies**: phase 006 transition-authorized ledger core, phase 012 shared mode/event contracts and write-set conflict graph, current Deep Research state references under `deep-research/references/state/`, the mode findings registry, and the later `002-reducers-and-projections` sibling.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact shared envelope field names, event identity algorithm, and authorization receipt shape does phase 012 freeze?
- Does the shared contract provide a generic source/evidence reference type, or should Deep Research define a narrow mode extension that remains digest-only?
- Which legacy JSONL `type` values map directly to typed events, and which require a `degraded` or `blocked` compatibility disposition?
- Are memory-save request and completion events emitted by Deep Research or by the shared continuity service with a mode-specific payload?
- Which source identity and independence-group algorithm is stable enough for the first schema version without prematurely coupling the reducer?

These questions are deliberately left for contract ratification and implementation planning. They do not authorize a reducer, projection, or authority decision in this phase.
<!-- /ANCHOR:questions -->
