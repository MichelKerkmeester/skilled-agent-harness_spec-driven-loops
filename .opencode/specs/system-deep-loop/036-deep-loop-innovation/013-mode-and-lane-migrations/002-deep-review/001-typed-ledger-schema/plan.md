---
title: "Implementation Plan: Deep Review - Typed Ledger Schema"
description: "Implementation Plan for the Deep Review typed event vocabulary over the phase-006 ledger core and phase-012 shared review-loop contracts."
trigger_phrases:
  - "deep review typed ledger implementation plan"
  - "deep-review schema migration plan"
  - "deep review event contract plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/002-deep-review/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T19:00:00Z"
    last_updated_by: "opencode"
    recent_action: "Scoped the Deep Review event vocabulary to ledger planning"
    next_safe_action: "Freeze typed event names against phase-012 shared contracts"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions:
      - "Which exact shared envelope fields and transition tokens does phase 012 freeze?"
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
---
# Implementation Plan: Deep Review - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-review |
| **Change class** | Typed event schema and compatibility contract planning |
| **Execution** | Implement after phase 006 and phase 012 contracts are frozen; ledger remains additive and non-authoritative |

### Overview
The plan turns the existing Deep Review lifecycle into an explicit event vocabulary without changing the current reducer or authority path. The implementation will specialize the shared envelope, define a discriminated union for scope, per-dimension passes, candidate findings, adjudication, convergence, and review-report behavior, preserve raw observations and immutable references, and register pure version/upcaster hooks. The next sibling consumes these events to build reducers and projections. The checked-in mode contract establishes the four dimensions, lineage, JSONL records, blocked-stop gates, typed claim adjudication, and report output in `deep-review/SKILL.md:287-356` and `deep-review/references/state/state_jsonl.md:45-344`; the mode findings registry supplies the candidate-first, orthogonal-severity, fingerprint, evidence, and targeted-verification requirements in `findings-registry-modes.json:2619-2876`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase 006 publishes the transition-authorized envelope, append API, replay fingerprint, and fail-closed authorization result.
- [ ] Phase 012 publishes the shared review-loop identity, lineage, causal-link, artifact-reference, version, convergence, and write-set contracts used by deep-review and deep-alignment.
- [ ] The current Deep Review config, JSONL, iteration, finding, graph, convergence, claim-adjudication, synthesis, resume, and continuity records are inventoried from the mode references.
- [ ] The event ownership boundary distinguishes shared review-loop events from Deep Review mode events and from the next sibling's reducer/projection outputs.
- [ ] The target phase remains limited to schema vocabulary and upcaster hooks; no reducer, report generator, or authority work is scheduled here.

### Definition of Done
- [ ] The Deep Review event union and payload field matrix are ratified against phases 003 and 009.
- [ ] Version compatibility fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes.
- [ ] Append-only, provenance, candidate-admission, adjudication, lineage, and unresolved-report invariants are executable as schema checks.
- [ ] A handoff packet gives `002-reducers-and-projections` stable event names and references without prescribing its fold algorithm.
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Extend `SharedEventEnvelope<Payload>` with `mode: "deep-review"`, a discriminated `eventType`, a versioned payload, and a mode `scope` object. Reuse shared `eventId`, `causationId`, `correlationId`, aggregate, sequence, `prevEventHash`, authorization reference, replay fingerprint, producer fingerprint, and payload digest fields.
- Keep lineage stable across resume and restart: `runId`, `sessionId`, `lineageMode`, `generation`, and `continuedFromRun` are typed shared or mode references; iteration, dimension, candidate, finding, evidence, protocol, and report IDs are event-specific scope members.
- Use one namespace grouped into lifecycle, scope/protocol, dimensions, candidate/evidence, adjudication/lineage, depth/search, convergence/recovery, synthesis/report, and continuity handoff. Event stems are stable; `eventVersion` and `envelopeVersion` carry compatibility independently.
- Store references, digests, selectors, gate results, and receipts in the ledger. Store source bodies, code snapshots, iteration markdown, strategy, dashboards, and reports behind content-addressed references; never mutate a prior event to attach late evidence or a severity change.
- Make raw observations first-class fields: analyzer output, test result, runtime witness, raw score, evidence class, candidate confidence, adjudication result, and convergence signals remain distinguishable from trusted or derived decisions.
- Require every append request to pass the phase-006 transition gateway. The schema records the authorization reference and transition context; it does not implement policy or make the later authority cutover decision.
- Register a pure upcaster chain keyed by event stem and source version. Each upcast preserves original bytes or digest, source version, upcaster fingerprint, warnings, and compatibility outcome; unknown input blocks replay.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase 006 and phase 012 artifacts are present, frozen, and compatible with the pinned migration sequence.
- Inventory current Deep Review config, state JSONL, iteration files, findings registry, strategy, graph events, convergence gates, claim-adjudication packets, report sections, resume paths, and continuity-save handoffs from the mode references.
- Build an event ownership matrix: shared review-loop event, Deep Review event, or later sibling event. Reject duplicate ownership before schema names are minted, including the deep-alignment shared-backbone path.

### Phase 2: Implementation
- Define the `deep-review` envelope specialization and typed aliases for run, session, lineage, target, dimension, protocol, iteration, candidate, finding, evidence, fingerprint, gate, report revision, policy, receipt, and digest identifiers.
- Define the discriminated event union for run lifecycle, scope resolution, dimension ordering, protocol planning, dimension pass start/completion, candidate emission, evidence observation, claim adjudication, finding lineage/state, review-depth search, convergence, graph convergence, blocked stops, pause/recovery, synthesis, review-report publication, continuity save, and completion.
- Define required fields and cross-event references for every payload. Keep raw analyzer/test/runtime observations, file-and-line evidence, independent evidence classes, semantic fingerprint parts, policy versions, gate results, artifact digests, and unresolved statuses explicit.
- Define the version registry and upcaster interface. Separate envelope migration from payload migration; permit only registered pure transformations and fail closed for unknown versions or lossy transformations without an explicit degraded result.
- Define schema fixtures for normal lifecycle, resume/restart, per-dimension passes, candidate-to-adjudication promotion, finding movement, blocked stop, pause/recovery, graph convergence, incomplete max-iteration, report with unresolved findings, and continuity-save failure.

### Phase 3: Verification
- Compile or validate the discriminated union against the shared phase-012 envelope and run phase-006 authorization checks for every event stem.
- Verify event identity, causal links, previous-tail hashes, payload digests, raw-observation retention, file-and-line selectors, semantic fingerprint parts, claim-adjudication packets, gate results, and append-only supersession rules.
- Replay the compatibility matrix from legacy Deep Review JSONL records and assert exact, compatible, migrate, pin-old-runtime, and blocked outcomes with no guessed decoder.
- Run a scope audit proving the phase emits no findings-registry reducer, dashboard or strategy projection, review-report generator, sealed artifact, certificate, rollback, or authority-cutover behavior.
- Produce a handoff matrix for `002-reducers-and-projections` listing event names, entity references, raw versus derived fields, lineage semantics, and unresolved shared-contract questions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the mode envelope type to the phase-012 shared type; reject duplicate identity, lineage, and authorization fields and compile all event payloads |
| REQ-002 | Run a vocabulary coverage matrix from `run_initialized` and `scope_resolved` through dimension passes, convergence, synthesis, `review_report_committed`, and `run_completed`; require causal or predecessor references for each transition |
| REQ-003 | Property-test deterministic event identity, `prevEventHash`, payload digests, immutable evidence references, and supersession-only revisions |
| REQ-004 | Validate target, dimension, protocol, iteration, candidate, finding, evidence, adjudication, fingerprint, gate, report, and continuity IDs across a multi-dimension fixture |
| REQ-005 | Assert raw analyzer/test/runtime observations, raw confidence, evidence strength, impact, P0/P1/P2 severity, and convergence decisions remain separate fields |
| REQ-006 | Replay finding fingerprints across moved lines, renamed symbols, changed source context, and fixed or preexisting states; require explicit lineage rather than identity replacement |
| REQ-007 | Execute legacy JSONL fixtures through every registered compatibility outcome; unknown type/version must return blocked without a payload guess |
| REQ-008 | Send each event through the transition-authorization gateway and verify an unauthorized transition never reaches the append boundary |
| REQ-009 | Verify candidates require evidence and typed adjudication before P0/P1/P2 activation; high impact with weak confidence remains distinguishable from a confirmed blocker |
| REQ-010 | Scan the phase diff and schema package for reducer, projection, report-generation, authority, certificate, rollback, and mode-gate symbols and require a clean scope result |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on phase 006's transition-authorized typed ledger core and phase 012's shared review-loop/event contracts. It consumes the current Deep Review lifecycle, state JSONL, review depth, convergence, claim-adjudication, and report definitions in `deep-review/SKILL.md`, `references/protocol/loop_protocol.md`, `references/state/state_format.md`, `references/state/state_jsonl.md`, and `assets/review_mode_contract.yaml`. It also consumes the Deep Review recommendations in `findings-registry-modes.json:2619-2876` and the shared append-only, replay, evidence, and effect findings in `findings-registry.json:2600-2747`.

The next sibling `002-reducers-and-projections` depends on this phase's stable event names and payload references. Sealed artifacts, certificates, resume adapters, shadow parity, rollback switches, and the independent mode gate remain separate child concerns under `002-deep-review`. The existing JSONL writer and reducer stay active until the later compatibility and authority phases permit a staged migration. Deep-alignment consumes the same shared review-loop contract and must not receive a Deep Review-only fork through this phase.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

This phase is planning-only until its implementation is separately authorized. If schema implementation begins, land the envelope extension, event registry, upcasters, and fixtures in path-scoped commits behind the dark ledger path. Reverting those commits restores the prior Deep Review JSONL writer and leaves existing reducer, dashboard, strategy, and report behavior unchanged. Do not delete or rewrite historical state; unsupported historical records remain readable through the legacy path or are reported as explicit blocked compatibility outcomes. Any phase-006 or phase-012 contract change invalidates the candidate schema and requires regeneration from the shared contract before implementation continues.
<!-- /ANCHOR:rollback -->
