---
title: "Implementation Plan: Deep Research - Sealed Reference Artifacts (010 phase 001 child 003)"
description: "Implementation plan for binding Deep Research lifecycle inputs, evidence, outputs, resume deltas, and memory-save handoff to the shared seal-on-write and tamper-evident read contract."
trigger_phrases:
  - "deep research sealed artifacts implementation plan"
  - "deep-research seal-on-write plan"
importance_tier: "critical"
contextType: "planning"
parent: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/065-deep-loop-innovation/006-recommendations-implementation/010-mode-and-lane-migrations/001-deep-research/003-sealed-artifacts"
    last_updated_at: "2026-07-15T19:20:00Z"
    last_updated_by: "opencode"
    recent_action: "Defined Deep Research seal boundaries and verified-read gates"
    next_safe_action: "Inventory mode artifacts against the phase-009 shared contract"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Implementation Plan: Deep Research - Sealed Reference Artifacts

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: plan-core | v2.2 -->

<!-- ANCHOR:summary -->
## 1. SUMMARY

| Aspect | Value |
|--------|-------|
| **Surface** | system-deep-loop Deep Research mode migration (phase 010 child 001/003) |
| **Change class** | Mode-specific artifact registration and seal/read integration |
| **Execution** | Seal-on-write references across init, iterate, convergence, synthesis, resume, and memory-save; additive-dark |

### Overview
Plan one Deep Research adapter over the shared phase-003 sealing primitives. The adapter maps the autonomous loop's
typed lifecycle to registered artifact kinds, seals exact canonical bytes at each boundary, binds ordered digest
references into the existing event, reducer, projection, replay, and shadow paths, and verifies every reference before
release to a consumer. The mode must preserve the research registry's branch-local context, typed gap-to-query
continuation, claim-level cross-validation, unresolved states, and portable research-object handoff without turning a
prose report into the primary state. The plan consumes the shared sealed-reference contract and the phase-009 mode
interfaces; it does not implement shared storage, a second digest scheme, reducers, certificates, or authority cutover.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:quality-gates -->
## 2. QUALITY GATES

### Definition of Ready
- [ ] Phase-009 shared mode contracts and the executable write-set conflict graph are frozen for the Deep Research lane
- [ ] The mode artifact matrix names every init, gather, analyze, convergence, synthesis, resume, and memory-save input/output
- [ ] Each matrix row identifies a shared artifact kind, canonicalization version, media type, and ordered reference role
- [ ] Seal-on-write and verified-read seams are available without changing the legacy authoritative loop
- [ ] Replay and shadow-parity consumers accept one ordered verified reference set rather than mode-local digests
- [ ] Resume source-refresh behavior distinguishes unchanged, changed, missing, and unverifiable evidence
- [ ] Typed failures, append-only supersession, rollback switch, and handoff rejection behavior are explicit

### Definition of Done
- [ ] Deep Research lifecycle artifacts are sealed and read only through the shared contract, with mode-gate fixtures green
- [ ] The dark path proves parity over identical verified inputs while legacy execution and authority remain unchanged
<!-- /ANCHOR:quality-gates -->

<!-- ANCHOR:architecture -->
## 3. ARCHITECTURE

- **Shared seal adapter**: accepts a typed mode artifact request, delegates canonicalization, atomic publication, digest derivation, and verified reads to the phase-003 primitive, and exposes no alternate hash or blob identity.
- **Mode artifact registry**: registers the initial objective/reference set, source capture, analysis batch, convergence witness, synthesis view, and memory-save handoff as Deep Research specializations of the shared descriptor.
- **Lifecycle seal boundaries**: seal the init set before dispatch, source captures before analysis, atomic claims and evidence before reduction, one convergence snapshot before the stop decision, the synthesis view after projection, and the handoff before memory save.
- **Reference-set binder**: assembles the ordered verified digest set using shared logical branch and event ordering, then supplies the same set to typed events, predecessor reducers, replay fingerprints, resume comparison, and shadow parity.
- **Tamper-evident read path**: resolves exact digest references, recomputes the returned byte length and digest, validates descriptor and artifact-kind compatibility, and releases no bytes on any failure.
- **Living-research refresh**: reruns frozen search recipes, compares result identifiers and content digests, emits new captures for changed evidence, and reprocesses only affected claim dependencies while preserving prior seals.
- **Materialized synthesis**: treats the report and claim/evidence map as a sealed view over immutable observations and reducer versions; it is never the authoritative mutable state.
- **Additive-dark integration**: seal or verification failure blocks new dark evidence, replay, parity, or memory handoff promotion but leaves the legacy loop, state, output, and authority untouched until the staged cutover phase.
<!-- /ANCHOR:architecture -->

<!-- ANCHOR:phases -->
## 4. IMPLEMENTATION PHASES

### Phase 1: Setup
- Confirm the phase-009 shared mode contract and write-set conflict graph; verify predecessor `002-reducers-and-projections` owns the reducer and projection boundary.
- Inventory current Deep Research init state, branch observations, source captures, analysis records, convergence inputs, synthesis outputs, resume state, and memory-save payloads against the pinned baseline.
- Freeze the mode artifact-kind matrix, reference roles, canonicalization profiles, media types, stable logical identities, and ordered reference-set rules using the shared phase-003 primitive.
- Define typed seal/read failures, source-refresh dispositions, append-only supersession, legacy fallback refusal, and the mode rollback switch.

### Phase 2: Implementation
- Register the Deep Research artifact kinds through the shared seal service; reject path-only, alias-only, `latest`, mutable cache, and unverified references at the mode boundary.
- Add init seal-on-write for the objective, plan/frontier, recipes, capability commitments, mode configuration, and replay inputs before the first branch dispatch.
- Add source-capture sealing and verified-read gates for gather-to-analyze handoff, including normalized passage and extraction-profile references.
- Add immutable analysis observation sealing for claims, evidence spans, cross-validation, contradictions, and unresolved or abstention states before reducer consumption.
- Add the convergence witness binding one verified frontier snapshot, then seal the synthesis materialized view and its ordered input references.
- Add resume refresh comparison over result IDs and content digests, append new source and dependent claim revisions, and preserve old artifacts for historical replay.
- Add the verified memory-save handoff package and refuse trusted handoff evidence when any input or output read fails.
- Bind mode references into existing typed events, reducers, projections, replay fingerprints, compatibility adapters, shadow parity, and the mode rollback switch without changing shared primitive ownership.

### Phase 3: Verification
- Prove equivalent source representations produce identical shared canonical bytes and algorithm-qualified digest references for each mode artifact kind.
- Prove every lifecycle boundary rejects missing, mutable-only, changed, truncated, substituted, wrong-kind, wrong-size, corrupted, and unsupported references before consumer release.
- Prove branch-local gathers and analyses preserve stable logical identity, source provenance, claim dependencies, unresolved states, and deterministic reference ordering.
- Prove resume detects changed result IDs and content digests, reprocesses affected claims only, and never overwrites or silently rebaselines a prior seal.
- Prove identical verified reference sets plus the same replay and reducer contracts reproduce byte-identical events, projections, synthesis output, and handoff bytes.
- Prove legacy and dark executions compare only with equivalent verified reference sets and that seal failure leaves legacy result and authority unchanged.
- Prove the independent Deep Research mode gate passes with certificate and authority semantics deferred to the successor and cutover phases.
<!-- /ANCHOR:phases -->

<!-- ANCHOR:testing -->
## 5. TESTING STRATEGY

| Requirement | Verification |
|-------------|--------------|
| REQ-001 | Mode artifact manifest enumerates every lifecycle row and shows each delegates to the shared seal descriptor and reader |
| REQ-002 | Init fixtures reject mutable-only inputs and persist one verified objective/frontier/recipe/capability reference set before dispatch |
| REQ-003 | Gather fixtures bind source identity, retrieval metadata, response bytes, extraction profile, and normalized passages to exact digests |
| REQ-004 | Analysis fixtures preserve immutable claims, spans, cross-validation, contradictions, and abstentions while later judgments append superseding references |
| REQ-005 | Convergence fixtures use one verified snapshot and return a typed mismatch or blocked result for mixed watermarks or changed inputs |
| REQ-006 | Synthesis replay fixtures reproduce identical report and claim/evidence view bytes from identical sealed inputs and reducer versions |
| REQ-007 | Handoff fixtures release memory-save content only after verified reads and refuse trusted completion when the handoff or any input is invalid |
| REQ-008 | Read-path mutation, corruption, truncation, wrong-kind, wrong-size, absence, and unsupported-version tests release zero bytes |
| REQ-009 | Resume fixtures diff source result IDs/content digests, emit affected revisions, and preserve the prior source and claim artifacts |
| REQ-010 | Replay and shadow fixtures bind identical ordered digest sets and report input-equivalence failure before comparing divergent sets |
| REQ-011 | Additive-dark fixtures show seal/read failure blocks dark evidence only and leaves legacy output, state, schema, and authority unchanged |
<!-- /ANCHOR:testing -->

<!-- ANCHOR:dependencies -->
## 6. DEPENDENCIES

This child declares `depends_on: []` as an independent planning contract, while its implementation composes with the
phase-009 shared mode interfaces and write-set conflict graph. The shared phase-003 sealing primitive owns descriptor,
canonicalization, content addressing, atomic publication, verified reads, and lifecycle retention. The phase-003 event
and replay contracts own outer envelopes and fingerprint derivation. Predecessor `002-reducers-and-projections` owns
claim/evidence reductions and projection identity. The compatibility and shadow bridge supplies the parity boundary.
Successor `004-certificates-and-receipts` consumes this mode's verified reference set for boundary evidence; phase 011
alone changes authority. The phase-000 census supplies concrete legacy state and artifact shapes.
<!-- /ANCHOR:dependencies -->

<!-- ANCHOR:rollback -->
## 7. ROLLBACK PLAN

Land the adapter additively behind the dark Deep Research path. If a canonicalization, seal, verified-read, refresh, or
reference-set defect appears, disable new mode sealing and handoff promotion, quarantine the affected digest through
the shared lifecycle contract, and continue only on the unchanged legacy path. Do not delete, overwrite, re-seal, or
rebaseline existing objects. Revert the mode-binding commits while retaining sealed artifacts and their lifecycle records
for audit and replay. A rollback drill must prove that a failed dark seal cannot alter legacy state, output, memory-save
behavior, or authority, and that a byte-identical restored object retains its original digest.
<!-- /ANCHOR:rollback -->
