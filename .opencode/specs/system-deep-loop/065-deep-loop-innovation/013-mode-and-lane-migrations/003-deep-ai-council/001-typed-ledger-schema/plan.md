---
title: "Implementation Plan: Deep AI Council - Typed Ledger Schema"
description: "Implementation Plan for the Deep AI Council typed event vocabulary over the phase-003 ledger core and phase-009 shared event contracts."
trigger_phrases:
  - "deep ai council typed ledger implementation plan"
  - "deep-ai-council schema migration plan"
  - "deep ai council event contract plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/013-mode-and-lane-migrations/003-deep-ai-council/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T20:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped Deep AI Council event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-009 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase-009 freeze?"
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
---
# Implementation Plan: Deep AI Council - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-ai-council (mode 003, child 001) |
| **Change class** | Typed event schema and compatibility contract planning |
| **Execution** | Implement after phase 003 and phase 009 contracts are frozen; ledger remains additive and non-authoritative |

### Overview
The plan turns the existing Deep AI Council lifecycle into an explicit event vocabulary without changing the current state writer, artifact parser, reducer, or authority path. The implementation will specialize the shared envelope, define a discriminated union for run setup, independent seat deliberation, critique rounds, blinded adjudication, convergence, packet-local artifact references, and the council test gate, preserve raw observations and information-surface boundaries, and register pure version/upcaster hooks. The next sibling consumes these events to build reducers and projections. The checked-in mode contract establishes the one-CLI-per-round rule, 2-3 seat limit, append-only state rows, artifact persistence, resume semantics, planning-only boundary, and two-of-three convergence baseline; the mode findings registry adds effective independence, pairwise adjudication, calibration, debate escalation, stance trajectories, and anti-groupthink evidence requirements.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 003 publishes the transition-authorized envelope, append API, replay fingerprint, and fail-closed authorization result.
- [ ] Phase 009 publishes the shared event identity, causal-link, branch, receipt, artifact-reference, version, and write-set contracts used by Deep AI Council.
- [ ] The current Deep AI Council state rows, artifact audit rows, output sections, seat rules, convergence signals, rollback records, resume paths, and test-gate obligations are inventoried from the mode references.
- [ ] The event ownership boundary distinguishes shared ledger events from Deep AI Council events and from the next sibling's reducer/projection outputs.
- [ ] The target phase remains limited to schema vocabulary and upcaster hooks; no reducer, artifact generator, test runner, or authority work is scheduled here.

### Definition of Done
- [ ] The Deep AI Council event union and payload field matrix are ratified against phases 003 and 009.
- [ ] Version compatibility fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes.
- [ ] Append-only, role-isolation, blinding, independence, convergence, artifact-reference, and test-gate invariants are executable as schema checks.
- [ ] A handoff packet gives `002-reducers-and-projections` stable event names and references without prescribing its fold algorithm.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Extend `SharedEventEnvelope<Payload>` with `mode: "deep-ai-council"`, a discriminated `eventType`, a versioned payload, and a mode `scope` object. Reuse shared `eventId`, `causationId`, `correlationId`, aggregate/stream identity, sequence, `prevEventHash`, authorization reference, replay fingerprint, producer fingerprint, branch identity, receipt references, and payload digest fields.
- Keep run and round identity stable across resume and restart: `runId`, `roundId`, generation, and continuation references are typed shared or mode references; seat, proposal, critique, candidate, judgment, artifact, and gate IDs are event-specific scope members.
- Use one namespace grouped into lifecycle, round and seat dispatch, proposals and critique, blinded adjudication, stance and independence evidence, convergence and recovery, artifact audit, test gate, and completion. Event stems are stable; `eventVersion` and `envelopeVersion` carry compatibility independently.
- Store references, digests, selectors, raw score vectors, policy versions, visible-information declarations, and receipts in the ledger. Store prompt bodies, seat transcripts, deliberation prose, reports, and artifacts behind safe content-addressed references; never mutate a prior event to attach a late judgment or artifact.
- Make raw observations first-class fields: seat returns, proposal scores, critique findings, pairwise order results, bias flags, calibration support, independence inputs, stance changes, convergence signals, and gate checks remain distinguishable from selected plans or terminal decisions.
- Require every append request to pass the phase-003 transition gateway. The schema records the authorization reference and transition context; it does not implement policy or make the later authority cutover decision.
- Register a pure upcaster chain keyed by event stem and source version. Each upcast preserves original bytes or digest, source version, upcaster fingerprint, warnings, and compatibility outcome; unknown input blocks replay.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase 003 and phase 009 artifacts are present, frozen, and compatible with the pinned migration sequence.
- Inventory the current `ai-council-state.jsonl` row types, optional metadata, artifact audit behavior, report-required sections, seat and CLI rules, convergence escape hatches, rollback semantics, resume checkpoints, and council test-gate inputs.
- Build an event ownership matrix: shared event, Deep AI Council event, artifact reference, or later sibling event. Reject duplicate ownership before schema names are minted, including shared progress and fan-in events.

### Phase 2: Implementation
- Define the `deep-ai-council` envelope specialization and typed aliases for run, round, seat, proposal, critique, candidate, judgment, calibration, independence, convergence, artifact, gate, policy, receipt, and digest identifiers.
- Define the discriminated event union for run lifecycle, round setup, seat selection and dispatch, proposal observation, seat return, critique rounds, candidate blinding, pairwise judging, bias audits, adjudication, stance changes, deliberation synthesis, convergence, round end, artifact audit, council test gate, rollback, and completion.
- Define required fields and cross-event references for every payload. Keep raw seat output, critique, score, confidence, usage, bias, independence, minority, contradiction, gate, and unresolved status explicit.
- Define visible-information and capability rules. The schema must record generator/detector/scorer/orchestrator boundaries, one-CLI-per-round, deterministic candidate aliases, order-swapped judgments, abstentions, and no role-local access to peer judgments before commit.
- Define the version registry and upcaster interface. Separate envelope migration from payload migration; permit only registered pure transformations and fail closed for unknown versions or lossy transformations without an explicit degraded result.
- Define schema fixtures for normal three-seat deliberation, two-seat bounded deliberation, resume/restart, seat timeout, cross-critique, blinded order swap, bias flag, low effective independence, debate escalation, blocked convergence, non-converged max rounds, artifact rollback, incomplete artifact set, and test-gate failure.

### Phase 3: Verification
- Compile or validate the discriminated union against the shared phase-009 envelope and run phase-003 authorization checks for every event stem.
- Verify event identity, causal links, previous-tail hashes, payload digests, one-CLI-per-round boundaries, visible-information declarations, raw-observation retention, candidate blinding, order-swapped judgments, independence references, and append-only supersession rules.
- Replay the compatibility matrix from legacy `ai-council-state.jsonl` and artifact-audit rows and assert exact, compatible, migrate, pin-old-runtime, and blocked outcomes with no guessed decoder.
- Run a scope audit proving the phase emits no council-state reducer, dashboard or graph projection, artifact generator, certificate, rollback switch, mode gate, or authority-cutover behavior.
- Produce a handoff matrix for `002-reducers-and-projections` listing event names, entity references, raw versus derived fields, visible-information semantics, and unresolved shared-contract questions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the mode envelope type to the phase-009 shared type; reject duplicate identity, lineage, authorization, branch, receipt, or replay fields and compile all event payloads |
| REQ-002 | Run a vocabulary coverage matrix from `run_initialized` through seat deliberation, critique, convergence, artifacts, `council_test_gate_evaluated`, rollback, and `council_complete`; require causal or predecessor references for each transition |
| REQ-003 | Property-test deterministic event identity, `prevEventHash`, payload digests, immutable proposal/judgment/artifact references, and supersession-only revisions |
| REQ-004 | Validate run, round, seat, proposal, critique, candidate, judgment, calibration, independence, artifact, gate, and continuity IDs across a multi-round fixture |
| REQ-005 | Assert role capability and visible-information fixtures prevent scorers from seeing generator identity, rationale, peer scores, or vote counts before independent judgments commit |
| REQ-006 | Assert raw seat returns, proposal scores, critique findings, pairwise outcomes, bias flags, independence inputs, stance flips, convergence signals, and gate results remain separate from selected plans or stop outcomes |
| REQ-007 | Execute candidate blinding, deterministic shuffle, both pairwise orders, abstention, inconsistency, and bias-audit fixtures; no disagreement may become an arbitrary tie-break |
| REQ-008 | Execute legacy state and artifact-audit fixtures through every registered compatibility outcome; unknown type/version must return blocked without a payload guess |
| REQ-009 | Send each event through the transition-authorization gateway and verify an unauthorized transition never reaches the append boundary |
| REQ-010 | Replay high nominal agreement with low effective independence, missing minority evidence, critical disagreement, and failed witness fixtures; convergence must remain blocked or non-converged |
| REQ-011 | Validate safe artifact paths, schema versions, byte/content digests, required-section outcomes, source ranges, and test-gate suite/result digests without embedding report or artifact bodies |
| REQ-012 | Scan the phase diff and schema package for reducer, projection, dashboard, graph, artifact-generation, certificate, rollback, authority, and mode-gate symbols and require a clean scope result |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on phase 003's transition-authorized typed ledger core and phase 009's shared event contracts. It consumes the current Deep AI Council lifecycle, append-only state format, packet-local artifact layout, output schema, convergence signals, failure handling, one-CLI-per-round rule, and seat-diversity rules in `deep-ai-council/SKILL.md`, `references/structure/state_format.md`, `references/structure/output_schema.md`, `references/convergence/convergence_signals.md`, and `references/patterns/seat_diversity_patterns.md`. It also consumes the Deep AI Council recommendations in `findings-registry-modes.json` and the shared append-only, replay, independence, blinding, fan-in, budget, and adjudication findings in `findings-registry.json`.

The next sibling `002-reducers-and-projections` depends on this phase's stable event names and payload references. Artifact persistence, certificates, resume adapters, shadow parity, rollback switches, and the independent mode gate remain separate child concerns under `003-deep-ai-council`. The existing JSONL writer, report parser, and packet-local artifacts stay active until the later compatibility and authority phases permit a staged migration. Shared progress, fan-in, and generic artifact events must be consumed rather than forked here.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning-only until its implementation is separately authorized. If schema implementation begins, land the envelope extension, event registry, upcasters, and fixtures in path-scoped commits behind the dark ledger path. Reverting those commits restores the prior Deep AI Council JSONL writer, report parser, resume behavior, and packet-local artifact flow. Do not delete or rewrite historical state; unsupported historical rows remain readable through the legacy path or are reported as explicit blocked compatibility outcomes. Any phase-003 or phase-009 contract change invalidates the candidate schema and requires regeneration from the shared contract before implementation continues.
<!-- /ANCHOR:rollback -->
