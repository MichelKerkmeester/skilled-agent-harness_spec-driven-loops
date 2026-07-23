---
title: "Tasks: Skill Benchmark typed ledger schema"
description: "Tasks for the Skill Benchmark typed-ledger schema phase: define the event vocabulary, field types, append-only invariants, and deterministic version/upcaster hooks while leaving reducers to the next sibling."
trigger_phrases:
  - "Skill Benchmark typed ledger schema tasks"
  - "skill benchmark event vocabulary tasks"
  - "skill benchmark upcaster tasks"
importance_tier: "high"
contextType: "planning"
parent: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
_memory:
  continuity:
    packet_pointer: "system-deep-loop/036-deep-loop-innovation/013-mode-and-lane-migrations/007-skill-benchmark/001-typed-ledger-schema"
    last_updated_at: "2026-07-15T21:12:00Z"
    last_updated_by: "opencode"
    recent_action: "Outlined typed event, fixture, and compatibility tasks for Skill Benchmark"
    next_safe_action: "Build the closed event registry from shared envelope invariants"
    blockers: []
    key_files: []
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Tasks: Skill Benchmark Typed Ledger Schema

<!-- SPECKIT_LEVEL: 3 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |
<!-- /ANCHOR:notation -->

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

- [x] T001 Pin the transition-authorized ledger core and shared event contracts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; real gateway, ledger, event-envelope, and replay imports exercised by Vitest 16/16]
- [x] T002 Inventory deep-improvement-common services and the Skill Benchmark-specific write set [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; 35 imported common stems plus 21 namespaced additions]
- [x] T003 Map scenario, treatment, scoring, gold, and certificate inputs to immutable facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed payload and scope maps with references plus digests]
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T004 Define event registration, envelope specialization, stable identities, versions, and hash linkage [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; combined registry and all-stem verified append matrix]
- [x] T005 Define the full treatment lattice with paired assignment metadata [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; eight-arm treatment test]
- [x] T006 Define scenario start, finish, abort, and run closure payloads [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed lifecycle payload rules]
- [x] T007 Define discovery, progressive loading, invocation, and resource-canary exposure payloads [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; four distinct skill-path stems]
- [x] T008 Define milestones, trajectories, outcomes, deterministic/dynamic results, raw axes, and constraint coverage [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed trajectory and evaluation payloads]
- [x] T009 Define gold integrity, compatibility, negative transfer, security, dependency, and workload facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; mode-specific gold and risk guards]
- [x] T010 Define issued, withheld, and expired effect-certificate facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; normalized-score references, validity domains, evidence, confidence, and expiry fields]
- [x] T011 Define canonical encoding, replay metadata, fail-closed compatibility, and pure legacy upcasting [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; deterministic digest and compatibility tests]
- [x] T012 Audit the schema-only boundary [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; no reducer, projection, ranking, attribution, writer integration, or authority implementation]
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T013 Verify shared envelope and authorization behavior [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; malformed identity/hash rejection and unauthorized zero-append test]
- [x] T014 Verify lossless run and scenario lifecycle references [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; all-stem append/readback test]
- [x] T015 Verify paired causal treatment facts [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; treatment fixtures retain seed, propensity, replicate, task, executor, and environment identities]
- [x] T016 Verify causal stages remain distinct [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; separate discovery, loading, invocation, resource, trajectory, milestone, outcome, and score events]
- [x] T017 Verify raw scoring and gold blocking [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; pending and structural-only gold cannot become numerator-eligible]
- [x] T018 Verify compatibility and risk evidence is digest-bound and append-only [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; closed compatibility, negative-transfer, security, cost, and workload fields]
- [x] T019 Verify certificate lifecycle facts are validity-bounded [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; issued, withheld, and expired fixtures]
- [x] T020 Verify deterministic non-mutating upcasting [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; repeated legacy upcast retains source digest and upcaster fingerprint]
- [x] T021 Verify successor handoff completeness [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; exported combined union, maps, registry, preparation, digest, compatibility, and upcaster hooks]
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks complete [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; T001-T021 checked above]
- [x] All requirements in spec.md met with evidence [Evidence: `skill-benchmark-ledger-schema.vitest.ts`; targeted Vitest 16/16]
- [x] Phase gate green [Evidence: `validate.sh --strict` exit 0 with Errors 0 and Warnings 0]
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: `002-reducers-and-projections` consumes this event vocabulary
<!-- /ANCHOR:cross-refs -->
