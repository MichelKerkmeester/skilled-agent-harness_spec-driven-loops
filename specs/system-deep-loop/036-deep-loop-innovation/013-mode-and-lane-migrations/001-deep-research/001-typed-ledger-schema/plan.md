---
title: "Implementation Plan: Deep Research - Typed Ledger Schema"
description: "Implementation Plan for the Deep Research typed event vocabulary over the phase-006 ledger core and phase-012 shared contracts."
trigger_phrases:
  - "deep research typed ledger implementation plan"
  - "deep-research schema migration plan"
  - "deep research event contract plan"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/001-deep-research/001-typed-ledger-schema"
    last_updated_at: "2026-07-21T16:00:00Z"
    last_updated_by: "codex"
    recent_action: "Implemented and verified the additive-dark typed ledger schema"
    next_safe_action: "Build reducers and projections over the exported union"
    blockers: []
    key_files: []
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "Reducers and projections are owned by the next sibling"
      - "The shared wire namespace requires three kebab-case segments"
---
# Implementation Plan: Deep Research - Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop / deep-research |
| **Change class** | Typed event schema and compatibility hooks |
| **Execution** | Complete and additive-dark; the legacy JSONL path remains authoritative |

### Overview
The delivered module turns the existing Deep Research lifecycle into an explicit event vocabulary without changing the current reducer or authority path. It specializes the shared envelope, defines a discriminated union for run and evidence behavior, preserves raw observations and immutable references, and registers pure compatibility and upcaster hooks. The next sibling consumes these events to build reducers and projections. The checked-in mode contract establishes the lifecycle and current JSONL obligations in `deep-research/SKILL.md:261-323`; the mode findings registry supplies the research-plan, evidence-ledger, admission, convergence, and ClaimRecord requirements in `findings-registry-modes.json:4984-5125`.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [x] Phase 006 publishes the transition-authorized envelope, append API, replay fingerprint, and fail-closed authorization result. [Evidence: authorization matrix in `deep-research-ledger-schema.vitest.ts:466`]
- [x] Phase 012 publishes the shared event identity, causal-link, artifact-reference, version, and write-set contracts. [Evidence: envelope specialization in `deep-research-ledger-types.ts:427`]
- [x] The current Deep Research JSONL record types and required fields are inventoried from the mode state references. [Evidence: compatibility table in `legacy-compatibility.ts:142`]
- [x] The event ownership boundary distinguishes shared ledger events from Deep Research mode events. [Evidence: `implementation-summary.md` records the ownership decisions]
- [x] The target phase remains limited to schema vocabulary and upcaster hooks; no reducer work is scheduled here. [Evidence: scoped public barrel in `index.ts:6`]

### Definition of Done
- [x] The Deep Research event union and payload field matrix are ratified against the shipped shared contracts. [Evidence: `DeepResearchLedgerEvent` at `deep-research-ledger-types.ts:435`; tsc exit 0]
- [x] Version compatibility fixtures cover exact, compatible, migrate, pin-old-runtime, and blocked outcomes. [Evidence: `deep-research-ledger-schema.vitest.ts:642`]
- [x] Append-only, provenance, source-admission, convergence-evidence, exhaustive field-kind, and unresolved-claim invariants are executable as schema checks. [Evidence: targeted Vitest 16/16 passed]
- [x] A handoff packet gives `002-reducers-and-projections` stable event names and references without prescribing its fold algorithm. [Evidence: exported stem table at `deep-research-ledger-types.ts:306`]
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- Specialize the shipped `EventEnvelope` through its exact snake-case wire fields. The mode narrows `event_type`, `event_version`, and `payload`; the gateway and durable ledger retain ownership of authorization references and the record hash chain.
- Keep the mode scope identity stable across retries: `runId` and `lineageId` are required; iteration, logical branch, question, source version, evidence, and claim version IDs appear only on stems that require them.
- Use one namespace grouped into lifecycle, plan/frontier, iteration, evidence, claim lineage, convergence, synthesis, and continuity handoff. Event stems are stable; `eventVersion` and `envelopeVersion` carry compatibility independently.
- Store references, digests, non-blank selectors, and receipts in the ledger. Store source bodies, iteration markdown, reports, and other large artifacts behind content-addressed references; never mutate a prior event to attach a late judgment.
- Derive each event's accepted DATA keys from an exhaustive semantic-rule table. Require an explicit digest, token, enum, numeric, prose, or closed-object kind for every field; do not provide a generic string fallback.
- Make raw observations first-class fields: raw novelty, raw confidence, source capture result, verifier result, admission result, and evaluator output remain distinguishable from trusted or derived decisions.
- Require every append request to pass the phase-006 transition gateway. The durable ledger frame records the authorization reference; the schema does not implement policy or make the later authority cutover decision.
- Register a pure upcaster chain keyed by event stem and source version. Each upcast preserves the original bytes or digest, source version, upcaster fingerprint, warnings, and compatibility outcome; unknown input blocks replay.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm phase 006 and phase 012 artifacts are present, frozen, and compatible with the pinned program sequence.
- Inventory the current Deep Research `config`, `state`, iteration, strategy, findings, convergence, synthesis, resume, and memory-save records from `deep-research/references/state/` and the mode skill.
- Build an event ownership matrix: shared runtime event, Deep Research event, or later sibling event. Reject duplicate ownership before schema names are minted.

### Phase 2: Implementation
- Define the envelope specialization and typed aliases for run, lineage, generation, iteration, question, branch, source version, evidence, claim version, policy, receipt, and digest identifiers.
- Define the event union for initialization, resume/restart, question and branch planning, iteration start/completion, source capture, evidence admission, claim assertion/relation/supersession, gap and next focus, convergence, synthesis, memory save, and terminal completion.
- Define required fields and cross-event references for every payload. Keep raw observations, exact evidence locators, source independence groups, policy versions, artifact digests, and unresolved statuses explicit.
- Define the version registry and upcaster interface. Separate envelope migration from payload migration; permit only registered pure transformations and fail closed for unknown versions or lossy transformations without an explicit degraded result.
- Define schema fixtures for valid sequences, retries, late judgments, source mutation, contradiction, quarantine, blocked convergence, incomplete max-iteration, synthesis with contested claims, and memory-save failure.

### Phase 3: Verification
- Compile or validate the discriminated union against the shared phase-012 envelope and run the phase-006 authorization checks for every event stem.
- Verify event identity, causal links, previous-tail hashes, payload digests, raw-observation retention, source selectors, and append-only supersession rules.
- Replay the compatibility matrix from legacy JSONL records and assert exact, compatible, migrate, pin-old-runtime, and blocked outcomes with no guessed decoder.
- Run a scope audit proving the phase emits no reducer, projection, gauge, sealed artifact, certificate, rollback, or authority-cutover behavior.
- Produce a handoff matrix for `002-reducers-and-projections` listing event names, entity references, raw versus derived fields, and unresolved contract questions.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Compare the mode envelope type to the phase-012 shared type; reject duplicate identity or authorization fields and compile all event payloads |
| REQ-002 | Run a vocabulary coverage matrix from `run_initialized` through `run_completed`; require causal or predecessor references for each transition |
| REQ-003 | Test deterministic event identity, `prevEventHash`, payload digests, immutable source references, non-blank source and passage selectors, exact convergence-signal shapes, exhaustive semantic field kinds, bounded scalar tokens and reason prose, and supersession-only revisions |
| REQ-004 | Validate question, branch, source, evidence, claim, gap, and focus IDs across a complete multi-iteration fixture |
| REQ-005 | Assert raw `newInfoRatio`, raw confidence, trusted evidence yield, admission decision, and convergence decision remain separate fields |
| REQ-006 | Execute legacy JSONL fixtures through every registered compatibility outcome; unknown type/version must return blocked without a payload guess |
| REQ-007 | Send each event through the transition-authorization gateway and verify an unauthorized transition never reaches the append boundary |
| REQ-008 | Scan the phase diff and schema package for reducer/projection/authority symbols and require a clean scope result |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This phase depends on phase 006's transition-authorized typed ledger core and phase 012's shared mode/event contracts. It consumes the current Deep Research lifecycle and state definitions in `deep-research/SKILL.md`, especially the executor invariants, lifecycle modes, state packet, data flow, and reducer ownership sections. It also consumes the Deep Research recommendations in `findings-registry-modes.json:4984-5125` and the shared append-only, replay, evidence, and effect findings in `findings-registry.json:2600-2745`.

The next sibling `002-reducers-and-projections` depends on this phase's stable event names and payload references. Sealed artifacts, certificates, resume adapters, shadow parity, rollback switches, and the independent mode gate remain separate child concerns under `001-deep-research`. The existing JSONL writer stays active until the later compatibility and authority phases permit a staged migration.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

The module is additive-dark and has no shipped writer integration. Removing `runtime/lib/deep-research-ledger-schema/`, its unit test, and this leaf's completion docs restores the prior workspace behavior; the Deep Research JSONL writer and reducer remain unchanged throughout. Historical state is never deleted or rewritten. Unsupported records remain on the legacy path or return explicit pin-old-runtime or blocked compatibility outcomes. Any shared-contract change requires the candidate schema to be regenerated and reverified before a consumer adopts it.
<!-- /ANCHOR:rollback -->
