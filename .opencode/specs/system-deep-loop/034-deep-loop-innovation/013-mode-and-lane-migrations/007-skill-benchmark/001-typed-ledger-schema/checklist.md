---
title: "Checklist: Skill Benchmark typed ledger schema"
description: "Checklist for the Skill Benchmark typed-ledger schema phase: verify the mode event vocabulary, causal scenario and scoring facts, gold-integrity boundaries, and deterministic compatibility hooks before reducers are planned."
trigger_phrases:
  - "Skill Benchmark typed ledger schema checklist"
  - "skill benchmark event schema verification"
  - "skill benchmark ledger gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/034-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:12:00Z"
    last_updated_by: "opencode"
    recent_action: "Added blocking checks for typed Skill Benchmark event coverage"
    next_safe_action: "Run envelope, treatment, gold, and upcaster fixtures after schema freeze"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Checklist: Skill Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

<!-- ANCHOR:protocol -->
## Verification Protocol

This checklist is the blocking SOL verifier contract for the Skill Benchmark typed-ledger schema phase. Every item is a
check the paired verify agent runs before the schema candidate is accepted; each report pins the candidate SHA, the phase
003/phase 012 input schema digests, the event-registry hash, fixture commands, exit codes, and replay/upcast results. The
phase remains planning-only until its event vocabulary is complete; no reducer or projection is accepted as evidence for a
schema item.
<!-- /ANCHOR:protocol -->

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [ ] CHK-001 [P0] Phase-006 transition authorization and phase-012 shared event contracts are pinned by version, digest, and replay policy
- [ ] CHK-002 [P1] The deep-improvement-common service boundary and Skill Benchmark write set are recorded; shared services are not reimplemented
- [ ] CHK-003 [P1] Current Skill Benchmark scenario, scoring, gold, treatment, and certificate inputs are mapped to immutable event facts
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [ ] CHK-004 [P0] The event registry is closed and typed; required fields, enum domains, digest references, and extension rules are explicit
- [ ] CHK-005 [P0] Changes are scoped to the typed event vocabulary; no reducer, projection, gauge, ranking, attribution, or authority logic is introduced
- [ ] CHK-006 [P1] Every event has stable identifiers, causation/correlation references, sequence, canonical payload identity, and `prevEventHash` linkage
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [ ] CHK-007 [P0] Envelope fixtures reject missing event identity, event type, schema version, run identity, authorization reference, sequence, digest, or hash-chain predecessor
- [ ] CHK-008 [P0] Run and scenario fixtures cover planned, treatment-assigned, started, finished, aborted, and closed states without overwriting prior facts
- [ ] CHK-009 [P0] Paired treatment fixtures cover no-skill/control, auto-route, forced-activation, placebo/distractor, component-ablation, and compatibility-boundary cells with seed, propensity, replicate, task, executor, and environment metadata
- [ ] CHK-010 [P0] Discovery, loading, invocation, resource-canary exposure, trajectory, milestone, and final-outcome fixtures remain separate event types and references
- [ ] CHK-011 [P0] Scoring fixtures retain deterministic checks, dynamic reference results, raw score axes, constraint coverage, evaluator identity, tokens, latency, cost, and workload metadata
- [ ] CHK-012 [P0] Gold-integrity fixtures record `scored`, `negative`, `structural-only`, and `pending` policies; empty or pending positive gold emits an explicit block and cannot enter a numerator
- [ ] CHK-013 [P0] Compatibility, negative-transfer, composition-security, and dependency/workload fixtures bind bundle, gold, registry, executor, tool, permission, environment, and dependency digests
- [ ] CHK-014 [P0] Certificate lifecycle fixtures cover issued, withheld, and expired facts with evidence digest, validity domain, confidence references, compatibility slices, and expiry triggers
- [ ] CHK-015 [P0] Canonical encoding and replay-fingerprint fixtures are stable across repeated serialization and preserve source event identity
- [ ] CHK-016 [P0] Chained upcaster fixtures are deterministic, pure, non-mutating, and explicit about exact, compatible, migrate, pin, and block outcomes
- [ ] CHK-017 [P1] Unknown event types, unsupported payload versions, missing gold, incompatible dependencies, and incomplete evidence fail closed rather than silently degrading
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [ ] CHK-018 [P1] The reviewed event registry covers every Skill Benchmark scenario, treatment, exposure, trajectory, scoring, risk, and certificate fact required by the phase specification
- [ ] CHK-019 [P1] The next sibling `002-reducers-and-projections` receives the registry, field types, fixtures, and explicit reducer-boundary notes without needing new event meanings
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [ ] CHK-020 [P0] Skill content, tool permissions, environment dependencies, composition paths, and security probes are represented as evidence references and cannot authorize their own state transition
- [ ] CHK-021 [P1] Certificate integrity, causal efficacy, and deployment validity remain separate fields; a signature or bundle digest alone cannot produce an efficacy result
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [ ] CHK-022 [P1] The phase outcome is reflected in `spec.md`, `plan.md`, `tasks.md`, and this checklist, including the successor `002-reducers-and-projections`
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [ ] CHK-023 [P1] Schema artifacts and fixtures land in dependency-closed, path-scoped commits after the shared input contracts are pinned
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the input contract digests and event
registry hash, all causal stages and treatment cells have typed evidence, unknown or invalid inputs fail closed, upcasters
replay deterministically, and the next sibling can implement reducers without adding missing vocabulary. Strict validation
must pass for this folder; reducer and projection behavior is not part of this gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 schema contract, the registry and fixtures are bound to the pinned shared
contracts, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
