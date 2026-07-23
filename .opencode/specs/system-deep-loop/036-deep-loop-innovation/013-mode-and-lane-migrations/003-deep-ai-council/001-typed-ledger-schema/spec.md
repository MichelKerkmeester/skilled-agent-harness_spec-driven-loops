---
title: "Feature Specification: Deep AI Council - Typed Ledger Schema"
description: "Plan the Deep AI Council event vocabulary over the shared typed append-only ledger: a versioned envelope specialization, typed multi-seat deliberation, critique, blinded adjudication, convergence, ai-council artifact, and council test-gate events. This phase defines events, field contracts, and upcaster hooks only; reducers and projections belong to the next sibling."
trigger_phrases:
  - "deep ai council typed ledger schema"
  - "deep-ai-council event vocabulary"
  - "deep ai council append-only events"
  - "deep ai council ledger migration"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
    last_updated_at: "2026-07-23T10:30:00Z"
    last_updated_by: "codex"
    recent_action: "Completed the additive-dark typed ledger schema"
    next_safe_action: "Fold the exported event union in 002-reducers-and-projections"
    blockers: []
    key_files:
      - ".opencode/skills/system-deep-loop/runtime/lib/deep-ai-council-ledger-schema/index.ts"
      - ".opencode/skills/system-deep-loop/runtime/tests/unit/deep-ai-council-ledger-schema.vitest.ts"
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "This phase owns Deep AI Council event vocabulary, not reducers or projections"
      - "The ledger remains append-only and non-authoritative until the later mode cutover phase"
      - "Authorization proof references remain owned by durable ledger frames"
      - "Artifact and test-gate evidence remains reference-and-digest only"
---

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/references/hvr_rules.md -->

# Feature Specification: Deep AI Council - Typed Ledger Schema

> Phase adjacency under the 003-deep-ai-council parent (grouping order, not a runtime dependency): predecessor: none (first sibling); successor `002-reducers-and-projections`.

<!-- ANCHOR:metadata -->
## 1. METADATA

| Field | Value |
|-------|-------|
| **Packet** | system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema |
| **Level** | 2 |
| **Priority** | P1 |
| **Status** | Complete |
| **Created** | 2026-07-15 |
| **Owner skill** | system-deep-loop / deep-ai-council |
| **Origin** | Deep AI Council mode migration after the phase-006 transition-authorized ledger core and phase-012 shared event contracts |
| **Inputs** | `036-deep-loop-innovation/spec.md`, `manifest/phase-tree.json`, `002-deep-loop-effectiveness-and-fanout/research/findings-registry*.json`, and the checked-in `deep-ai-council` state, convergence, output, and seat-diversity contracts |
| **Output** | A ratifiable Deep AI Council event union, field-level payload contract, and version/upcaster hook plan; no reducer or projection implementation |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:problem -->
## 2. PROBLEM & PURPOSE

The current Deep AI Council run persists a useful append-only `ai-council-state.jsonl` history and packet-local `ai-council/**` artifacts, but the state rows are producer-native records rather than one typed mode vocabulary. `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded` currently carry enough convention for basic resume and audit, while proposal isolation, cross-seat critique, blinded selection, effective independence, convergence blockers, and the final council test gate are not independently addressable ledger events. Resume therefore infers progress from a mixture of state rows and mutable artifact paths.

The research inputs identify the missing council contract. Independent generation must precede normalized cross-review and separate selection; seat quality must be estimated from correctness-conditioned errors rather than nominal seat count; candidate identity and order must be blinded during adjudication; swapped-order disagreement must abstain or escalate; debate must be a typed escalation; and agreement must retain minority, contradiction, bias, and independence evidence. These findings are recorded in `findings-registry-modes.json` for `deep-ai-council` and in the council-targeted entries of `findings-registry.json`, including the recommendations for effective independence, role isolation, staged fan-in, judge calibration, pairwise adjudication, adaptive seat selection, and council stance trajectories.

This phase plans the typed append-only vocabulary that carries those facts through the shared ledger. It specializes the event envelope supplied by phase-006 and consumes the shared identity, causal-link, authorization, replay, branch, receipt, and artifact-reference contracts frozen by phase-012. The event set covers the run path `seats deliberate -> critique rounds -> converge -> ai-council artifacts -> council test gate`, plus resume, failure, rollback, and completion. It does not decide how events fold into council state, how gauges or graph views are materialized, how artifacts are generated, or when authority cuts over. Those responsibilities remain with `002-reducers-and-projections`, the later sibling concerns, and the mode gate.
<!-- /ANCHOR:problem -->

<!-- ANCHOR:scope -->
## 3. SCOPE

### In Scope
- A `deep-ai-council` event-envelope specialization that reuses the phase-012 shared identity, causation, authorization, integrity, branch, receipt, and replay fields without redefining them.
- A stable event namespace for run initialization, resume/restart, round setup, seat selection and dispatch, proposal observation, cross-seat critique, blinded candidate handling, pairwise adjudication, bias auditing, deliberation synthesis, convergence, artifacts, the council test gate, rollback, and terminal completion.
- Field-level types and requiredness rules for run, round, seat, proposal, critique, candidate, judgment, independence snapshot, convergence decision, artifact, gate, receipt, and continuity references.
- Append-only provenance rules: immutable raw seat outputs and judgments, content and prompt/tool/model digests, information-surface boundaries, causal links, calibration references, minority and contradiction references, and event-tail hashes.
- Version boundaries for the shared envelope and each event payload, plus pure upcaster and compatibility-decision hooks for legacy `ai-council-state.jsonl` records and audit rows.
- Fixtures and validation matrices proving every event type is authorized by the phase-006 gateway and remains replay-addressable without implementing a reducer.

### Out of Scope
- Reducer algorithms, council-state folds, effective-independence projections, dashboard metrics, graph projections, or any materialized `ai-council/**` view generation; these belong to `002-reducers-and-projections`.
- Sealed council artifacts, certificates, mode rollback switches, or the independent mode gate; these are sibling concerns under `003-deep-ai-council`.
- Shared envelope ownership, transition policy, ledger storage, authorization semantics, generic effect receipts, branch scheduling, or budget policy; phase-006 and phase-012 own those contracts.
- Replacing the existing `ai-council-state.jsonl` writer, rewriting historical rows, changing the markdown output parser, or deleting packet-local artifacts.
- Authority cutover, in-flight state migration, legacy writer retirement, and any production claim that the typed path is authoritative.
- New council behavior beyond the lifecycle and recommendations already mapped to Deep AI Council in the cited registries.
<!-- /ANCHOR:scope -->

<!-- ANCHOR:requirements -->
## 4. REQUIREMENTS

| ID | Requirement | Acceptance Criteria |
|----|-------------|---------------------|
| REQ-001 | The Deep AI Council envelope specializes the phase-012 shared envelope without duplicate identity, authorization, or replay fields | A contract comparison lists inherited fields, council extensions, and rejected duplicates; the event union compiles against the shared contract |
| REQ-002 | The event namespace covers the complete run path from setup through seat deliberation, critique, convergence, artifact persistence, test gate, and completion | The vocabulary matrix contains a typed event for each lifecycle boundary and names the required predecessor or causal reference |
| REQ-003 | Every event has deterministic identity, causal linkage, payload digest, append position, and explicit revision semantics | Schema fixtures reject missing IDs, mutable proposal or artifact bodies, absent `prevEventHash`, and in-place judgment or stance updates |
| REQ-004 | Seat and proposal evidence preserves independence-relevant provenance | Seat, model family, prompt, tool, context, target, proposal, critique, evidence, and calibration references have stable typed IDs and digests |
| REQ-005 | Information surfaces enforce role separation | Generator, detector, scorer, orchestrator, and test-gate payloads identify their capabilities and visible digests; scorer events cannot claim access to generator identity, rationale, peer scores, or vote counts before independent judgments commit |
| REQ-006 | Raw observations remain distinct from adjudication and convergence decisions | Raw proposal scores, critique findings, pairwise outcomes, confidence, costs, seat returns, bias flags, independence inputs, and convergence signals remain separate from selected plans or stop outcomes |
| REQ-007 | Blinded adjudication and disagreement are auditable | Candidate aliases, deterministic shuffle seed digest, order-swapped judgments, abstentions, inconsistency findings, and bias-audit results are immutable events with explicit candidate references |
| REQ-008 | Event and payload version changes have explicit compatibility and upcaster hooks | The compatibility matrix covers exact, compatible, migrate, pin-old-runtime, and blocked outcomes; unknown event types or versions fail closed |
| REQ-009 | All event writes carry phase-006 authorization and phase-012 replay metadata | An unauthorized transition fixture is rejected before append, and a replay fixture resolves the same event identity and fingerprint from the same input |
| REQ-010 | Convergence evidence cannot be reduced to nominal agreement | Convergence events retain effective-independence evidence, calibrated support, minority and contradiction references, required gate results, and explicit `converged`, `non_converged`, `blocked`, or `incomplete` outcomes |
| REQ-011 | Artifacts and the council test gate are evidence references, not mutable ledger bodies | Artifact events carry relative safe paths, schema versions, content digests, required-section results, and source ranges; gate events carry suite and result digests without embedding reports |
| REQ-012 | The schema boundary is limited to event vocabulary and handoff contracts | A scope audit finds no reducer, projection, dashboard, graph rebuild, sealed artifact, certificate, rollback switch, authority cutover, or mode-gate implementation in this phase |
<!-- /ANCHOR:requirements -->

The proposed event union is grouped by lifecycle and uses stable event stems with independent `eventVersion` values. Final field names for inherited envelope members remain subordinate to phase-012. The mode-specific payload plan is:

| Event stem | Required payload shape |
|------------|------------------------|
| `ai_council.run_initialized` | `runId: CouncilRunId`, target reference and digest, task class, config/strategy/convergence/test-gate policy digests, `maxRounds: uint32`, seat-count bounds, planning-only marker, and initial replay fingerprint |
| `ai_council.run_resumed` / `ai_council.run_restarted` | Prior ledger-tail digest, source run or archived lineage, resume/restart reason, generation, compatibility decision, recovery receipt, and requested continuation scope |
| `ai_council.round_started` | `roundId: RoundId`, round number, one-CLI-per-round executor boundary, seat roster digest, protocol version, prompt-pack digest, budget reference, prior-round reference, and exposure policy |
| `ai_council.seat_selected` / `ai_council.seat_dispatched` | `seatId: SeatId`, strategy lens, declared mandate, vantage/model fingerprint, independence group, capability and prompt digests, selection utility, dispatch receipt, logical branch, attempt, and budget lease references |
| `ai_council.proposal_observed` / `ai_council.seat_returned` | Seat and proposal IDs, target version, response status, proposal/artifact digest, raw score vector, raw confidence, usage and cost receipt, evidence references, output schema version, and failure or timeout reason |
| `ai_council.critique_round_started` / `ai_council.critique_recorded` | Critique-round ID, source proposal IDs, critic seat, visible-information policy, critique artifact digest, referenced claims, raw severity/confidence, challenge disposition, and causal proposal references |
| `ai_council.candidate_blinded` | Candidate ID, source proposal IDs, deterministic alias and shuffle digests, visible candidate/artifact digest, target version, redaction policy, and proof that generator identity and peer judgments are withheld |
| `ai_council.pairwise_judgment_recorded` / `ai_council.bias_audit_recorded` | Judgment ID, blinded candidate pair, order token, judge profile fingerprint, raw preference/confidence vector, abstention or inconsistency status, bias features, detector result, and input digest |
| `ai_council.adjudication_decision` | Candidate set digest, protocol and rubric versions, raw and calibrated score vectors, support/opposition mass, effective-independence snapshot reference, minority/contradiction references, veto findings, selected or unresolved disposition, and evaluator receipt |
| `ai_council.stance_recorded` / `ai_council.stance_flipped` | Seat, round, candidate or plan reference, prior/current stance, raw rationale digest, flip direction classification, evidence reference, and influence-observation metadata; the event never edits the prior stance |
| `ai_council.deliberation_synthesized` | Input event range and candidate digest, selected plan or unresolved-plan digest, disagreement and minority references, synthesis policy/evaluator fingerprints, report draft reference, and synthesis receipt |
| `ai_council.convergence_evaluated` / `ai_council.convergence_blocked` | Convergence decision, raw agreement and stability signals, calibrated support, effective seat count, independence and judge-profile references, quality/invariance witnesses, budget and coverage state, blocker IDs, and recovery or escalation reason |
| `ai_council.round_ended` | Round status, convergence-event reference, accepted/rejected/unresolved candidate references, seat outcome counts, late-result disposition, final round-tail digest, and continuation decision |
| `ai_council.artifact_committed` / `ai_council.artifact_superseded` | Artifact ID and kind, safe relative path, schema version, byte/content digest, required-section results, source event range, round ID, supersession reason, and rollback reference; large report or seat bodies remain outside the ledger |
| `ai_council.council_test_gate_evaluated` | Gate ID, test-suite and fixture manifest digests, baseline and candidate fingerprints, required check results, critical failures, metamorphic or bias checks, artifact completeness, verdict, and gate receipt |
| `ai_council.rollback_recorded` | Round or run ID, rollback reason, superseded event/artifact references, failed gate or recovery receipt, restored legacy-path reference, and operator or policy authorization |
| `ai_council.council_complete` | Terminal status, convergence event, final deliberation, artifact manifest, council test-gate event, final ledger-tail digest, seat/round counts, recommendation or user-decision reference, and completion, incomplete, or non-convergence reason |

The envelope extension uses a typed `scope` object rather than repeating identifiers in every top-level field. `scope.runId` and `scope.roundId` are required on all mode events; `scope.generation`, `scope.seatId`, `scope.critiqueRoundId`, `scope.proposalId`, `scope.candidateId`, `scope.judgmentId`, `scope.artifactId`, and `scope.gateId` are required only where the event stem needs them. Payloads carry references, selectors, and digests, not prompt bodies, raw transcripts, reports, or mutable artifact contents. A payload that cannot identify its source, visible information surface, causal parent, policy version, or append position is invalid.

The schema adopts the current state contract without flattening it: legacy `round_start`, `seat_returned`, `deliberation_synthesized`, `round_end`, `council_complete`, `artifact_written`, `rollback`, and `artifact_superseded` rows receive explicit compatibility mappings. The shared `progress_record` event remains owned by the shared event contract and is not redefined here. The typed path records `council_complete` only as an append-only terminal observation; completion, artifact checksums, and council test-gate results are interpreted by the next sibling and mode gate.

<!-- ANCHOR:success-criteria -->
## 5. SUCCESS CRITERIA

- **SC-001**: The Deep AI Council event union is complete for setup, independent seats, critique rounds, blinded adjudication, convergence, artifacts, council test gate, rollback, and completion, mapped to the shared envelope and transition vocabulary.
- **SC-002**: Every event payload has field-level types, requiredness, identity links, digest rules, information-surface rules, and a declared event version.
- **SC-003**: The vocabulary preserves raw seat outputs, critique findings, pairwise judgments, bias signals, independence evidence, minority positions, and contradictions while representing decisions as new events.
- **SC-004**: The compatibility plan maps legacy state and artifact-audit rows to explicit current events, rejects unknown versions, and identifies deterministic upcaster hooks without inventing missing evidence.
- **SC-005**: Blinded candidate and order-swapped judgment events retain abstention and inconsistency evidence; nominal two-of-three agreement cannot erase effective-independence or veto evidence.
- **SC-006**: Artifact and council test-gate events bind safe paths and immutable digests without moving report, artifact, reducer, or gate authority into this schema phase.
- **SC-007**: The phase contains no reducer, projection, certificate, rollback implementation, authority-cutover, or mode-gate implementation.

**Given** a valid phase-012 envelope, **When** a Deep AI Council event is encoded, **Then** its mode payload validates without redefining shared identity, authorization, branch, receipt, or replay fields.

**Given** independent seats return proposals and a critique round begins, **When** the event sequence is replayed, **Then** seat, proposal, critique, visible-information, and artifact references remain reconstructible without mutating an earlier event.

**Given** two candidates are judged in both orders, **When** the pairwise results disagree or a bias detector flags the comparison, **Then** the ledger records abstention or escalation evidence and does not manufacture a selected plan.

**Given** nominal seat agreement is high but effective independence, minority survival, required evidence, or a test-gate witness is insufficient, **When** convergence is evaluated, **Then** the event records `blocked`, `non_converged`, or `incomplete` with the responsible evidence and does not claim convergence.

**Given** a legacy state row or artifact audit row has a registered compatible version, **When** the compatibility hook reads it, **Then** it produces a current payload with the original row digest and upcaster fingerprint retained.

**Given** an event type or version has no registered decoder, **When** the ledger reader encounters it, **Then** replay returns a blocked compatibility result and does not guess a payload shape.
<!-- /ANCHOR:success-criteria -->

<!-- ANCHOR:risks -->
## 6. RISKS & DEPENDENCIES

- **Shared-contract drift** - phase-012 may rename envelope fields, transition tokens, receipt references, or shared branch semantics after this planning packet. Mitigation: mark inherited fields as shared, run a contract diff before implementation, and reject mode-local aliases.
- **Nominal-consensus inflation** - three seats can share model, prompt, evidence, or ancestry bias. Mitigation: retain correctness-conditioned error inputs, calibration support, pairwise dependence measures, effective seat count, and positive marginal-gain evidence as event fields; do not let this phase reduce them.
- **Role leakage and bandwagon effects** - scorers or critics may see generator identity, rationale, peer scores, vote counts, or order cues. Mitigation: record visible-information policy and blinded candidate digests, require separate capability references, and treat violations as typed gate evidence.
- **Candidate/verdict conflation** - a seat proposal or critique can be mistaken for a final recommendation. Mitigation: separate proposal, critique, adjudication, synthesis, convergence, and test-gate event stems with explicit causal links and unresolved states.
- **Mutable artifact leakage** - storing prompt bodies, seat transcripts, reports, or generated artifacts in event payloads makes replay and retention unsafe. Mitigation: store safe relative references, schema versions, selectors, and content digests only.
- **False convergence** - low disagreement or a stable majority can reflect groupthink, a collapsed minority, or a shared judge bias. Mitigation: retain stance flips, minority and contradiction references, quality/invariance witnesses, and a typed blocked-stop path.
- **Upcaster loss** - legacy rows may lack stable run, seat, candidate, or artifact identities. Mitigation: preserve the original row digest and allow `degraded` or `blocked` compatibility outcomes; never synthesize identity from mutable prose alone.
- **One-CLI-per-round ambiguity** - mixing executors inside a round invalidates comparison and rollback semantics. Mitigation: make the executor boundary and round protocol explicit in `round_started` and require additional CLI vantages to form separate rounds.
- **Cross-phase scope creep** - reducers, projections, sealed artifacts, certificates, and authority changes are tempting to embed in the schema. Mitigation: use the explicit ownership boundary and adjacency contract as implementation blockers.
- **Dependencies**: phase-006 transition-authorized ledger core, phase-012 shared event and write-set contracts, current Deep AI Council state/output/convergence/seat-diversity references, the mode findings registry, the later `002-reducers-and-projections` sibling, and the mode gate.
<!-- /ANCHOR:risks -->

<!-- ANCHOR:questions -->
## 7. OPEN QUESTIONS

- Which exact shared envelope field names, event identity algorithm, authorization receipt shape, branch fields, and transition tokens does phase-012 freeze?
- Does the shared contract provide generic proposal, artifact, evidence, judge-profile, independence, and test-gate reference types, or should Deep AI Council define narrow digest-only extensions?
- Which legacy `ai-council-state.jsonl` `event` and optional metadata combinations map directly to current events, and which require `degraded` or `blocked` compatibility?
- Is `council_test_gate_evaluated` a mode-owned event with shared gate references, or a shared gate event specialized by a Deep AI Council payload?
- Which seat-calibration and effective-independence snapshot identity is stable enough for the first schema version without coupling this phase to the next reducer implementation?
- Which artifact kinds are mandatory for the mode gate, and which remain optional diagnostic outputs during the additive-dark window?

Implementation resolved these questions against the landed event envelope, authorized ledger, replay fingerprint, and converged Deep Research schema. Authorization references remain in durable ledger frames; the mode owns 25 logical stems; information surfaces use closed role-specific contracts; artifact and gate events carry references and digests only; and legacy rows without stable identity pin to the old runtime. These resolutions do not authorize a reducer, projection, artifact generator, certificate, rollback switch, or authority decision in this phase.
<!-- /ANCHOR:questions -->
