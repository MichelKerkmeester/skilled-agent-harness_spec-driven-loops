---
title: "Checklist: Skill Benchmark typed ledger schema"
description: "Checklist for the Skill Benchmark typed-ledger schema phase: verify the mode event vocabulary, causal scenario and scoring facts, gold-integrity boundaries, and deterministic compatibility hooks before reducers are planned."
trigger_phrases:
  - "Skill Benchmark typed ledger schema checklist"
  - "skill benchmark event schema verification"
  - "skill benchmark ledger gate"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
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

<!-- SPECKIT_LEVEL: 3 -->
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

- [x] CHK-001 [P0] Transition authorization and shared event contracts are pinned [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; real substrate imports and 56/56 authorized append/readback matrix]
- [x] CHK-002 [P1] The deep-improvement-common boundary and Skill Benchmark write set are recorded without reimplementation [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; 35 imported common stems plus 21 additions]
- [x] CHK-003 [P1] Scenario, scoring, gold, treatment, and certificate inputs map to immutable event facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed payload and scope maps]
<!-- /ANCHOR:pre-impl -->

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-004 [P0] The registry is closed and typed with explicit field rules [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; exact-key validators plus skill-benchmark narrowing for all shared common definitions]
- [x] CHK-005 [P0] Changes stay schema-only [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; no reducer, projection, gauge, ranking, attribution, writer integration, or authority implementation]
- [x] CHK-006 [P1] Every event retains shared identities, causation/correlation, sequence, canonical payload identity, and tail linkage [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; 56/56 matrix]
<!-- /ANCHOR:code-quality -->

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-007 [P0] Malformed envelopes and absent previous hashes reject before append [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; missing identity/hash, foreign-variant, and unauthorized zero-append tests]
- [x] CHK-008 [P0] Run and scenario fixtures cover planned, assigned, started, finished, aborted, and closed facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; all-stem matrix]
- [x] CHK-009 [P0] Paired treatment fixtures cover all eight treatment cells and causal metadata [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; treatment-lattice test]
- [x] CHK-010 [P0] Discovery, loading, invocation, resource exposure, trajectory, milestone, and outcome remain separate [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; distinct closed stems]
- [x] CHK-011 [P0] Scoring retains raw axes, checks, references, evaluator identity, tokens, latency, cost, and workload [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; score fixture and raw/derived rejection tests]
- [x] CHK-012 [P0] Gold policies are explicit and blocked policies cannot enter a numerator [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; pending and structural-only guard tests]
- [x] CHK-013 [P0] Compatibility, negative-transfer, security, dependency, and workload evidence is digest-bound [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed risk payload rules]
- [x] CHK-014 [P0] Certificate lifecycle covers issued, withheld, and expired facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; validity, confidence, compatibility, evidence, and expiry fixtures]
- [x] CHK-015 [P0] Canonical encoding and replay metadata are deterministic [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; repeated preparation produces identical identities and digests]
- [x] CHK-016 [P0] Upcasting is deterministic, pure, non-mutating, and fail-closed [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; exact/compatible/migrate/two pin paths/block compatibility matrix]
- [x] CHK-017 [P1] Unknown events, versions, invalid gold, and incomplete evidence fail closed [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; version and semantic guard tests]
<!-- /ANCHOR:testing -->

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-018 [P1] The registry covers every required Skill Benchmark fact [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; 21 benchmark stems plus 35 imported common stems]
- [x] CHK-019 [P1] The successor receives the complete schema contract without new meanings [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; exported maps, union, registry, preparation, digest, compatibility, and upcaster hooks]
<!-- /ANCHOR:fix-completeness -->

<!-- ANCHOR:security -->
## Security

- [x] CHK-020 [P0] Skill, permission, environment, composition, and security facts are evidence references and cannot self-authorize [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; real gateway denial leaves the ledger empty]
- [x] CHK-021 [P1] Integrity, efficacy, and validity remain separate [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; certificates require typed normalized-score, gold-integrity, evidence-set, and validity-domain references]
<!-- /ANCHOR:security -->

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-022 [P1] Packet docs reflect the implementation and successor boundary [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; reconciled spec, plan, tasks, checklist, and implementation summary]
<!-- /ANCHOR:docs -->

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-023 [P1] Schema artifacts and fixtures are dependency-closed and path-scoped [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; scoped status audit covers only the new module, test, and leaf docs]
<!-- /ANCHOR:file-org -->

<!-- ANCHOR:summary -->
## Verification Summary

The phase is complete when every P0 verifier check passes, the candidate report pins the input contract digests and event
registry hash, all causal stages and treatment cells have typed evidence, unknown or invalid inputs fail closed, upcasters
replay deterministically, and the next sibling can implement reducers without adding missing vocabulary. Strict validation
must pass for this folder; reducer and projection behavior is not part of this gate.
<!-- /ANCHOR:summary -->

<!-- ANCHOR:arch-verify -->
## L3+: ARCHITECTURE VERIFICATION

The accepted decision record separates digest-bound payload claims from real frame-head linkage. The registry test proves
the lane validator closes the shared-definition extension path.
<!-- /ANCHOR:arch-verify -->

<!-- ANCHOR:perf-verify -->
## L3+: PERFORMANCE VERIFICATION

The change adds one in-memory variant predicate before the existing common validator. It adds no I/O, storage scan, or
network dependency.
<!-- /ANCHOR:perf-verify -->

<!-- ANCHOR:deploy-ready -->
## L3+: DEPLOYMENT READINESS

The lane remains additive-dark with no writer cutover. Rollback is a path-scoped revert of the registry wrapper, tests,
and leaf documentation.
<!-- /ANCHOR:deploy-ready -->

<!-- ANCHOR:compliance-verify -->
## L3+: COMPLIANCE VERIFICATION

No dependency, credential, personal-data, or production-policy surface changes. Closed evidence references and the
existing authorization boundary remain intact.
<!-- /ANCHOR:compliance-verify -->

<!-- ANCHOR:docs-verify -->
## L3+: DOCUMENTATION VERIFICATION

The specification, plan, tasks, checklist, decision record, implementation summary, description, and graph metadata use
the same Level 3 contract and boundary language.
<!-- /ANCHOR:docs-verify -->

<!-- ANCHOR:sign-off -->
## Sign-off

Signed off when the SOL verifier confirms the P0 schema contract, the registry and fixtures are bound to the pinned shared
contracts, and `git diff-index --quiet HEAD --` shows no unexpected tracked mutation after verification.
<!-- /ANCHOR:sign-off -->
