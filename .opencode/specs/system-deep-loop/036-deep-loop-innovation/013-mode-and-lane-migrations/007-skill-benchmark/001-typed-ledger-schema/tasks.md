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

<!-- SPECKIT_LEVEL: 2 -->
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

- [ ] T001 [B] Pin the phase-006 transition-authorized ledger core and phase-012 shared event contracts, including schema hashes and replay policy
- [ ] T002 [P] Inventory deep-improvement-common services and record the Skill Benchmark-specific write set from the parent conflict graph
- [ ] T003 [P] Inventory current Skill Benchmark scenario, treatment, scoring, gold, and certificate inputs and map each to an immutable fact boundary
<!-- /ANCHOR:phase-1 -->

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [ ] T004 Define `skill_benchmark.*.vN` event registration, the envelope specialization, stable identifiers, sequence/hash linkage, and extension rules
- [ ] T005 Define run-design and `treatment_assigned` payloads for no-skill, auto-route, forced, placebo/distractor, component-ablation, and compatibility-boundary cells
- [ ] T006 Define scenario lifecycle payloads for `scenario_started`, `scenario_finished`, `scenario_aborted`, and `run_closed`
- [ ] T007 [P] Define skill-path payloads for discovery, progressive loading, invocation, resource-canary exposure, and activation failure
- [ ] T008 [P] Define trajectory and evaluation payloads for milestones, final outcomes, deterministic checks, dynamic references, raw score axes, and constraint coverage
- [ ] T009 [P] Define gold-integrity, compatibility, negative-transfer, composition-security, and workload/dependency observation payloads
- [ ] T010 Define effect-certificate issued, withheld, and expired event payloads with evidence digests, validity domains, and expiry triggers
- [ ] T011 Define canonical encoding, replay-fingerprint inputs, unknown-event handling, and pure chained upcaster hooks with exact/compatible/migrate/pin/block outcomes
- [ ] T012 Audit the schema boundary to ensure reducers, projections, gauges, ranking, attribution, and authority decisions are not required or reimplemented
<!-- /ANCHOR:phase-2 -->

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [ ] T013 Verify: Every event uses the shared authorized envelope specialization — malformed identity, sequence, digest, authorization, or hash-chain fixtures fail closed
- [ ] T014 Verify: The run and scenario lifecycle is lossless — planned, assigned, started, observed, finished, aborted, and closed facts retain stable cross-event references
- [ ] T015 Verify: Treatment assignments support causal contrasts — paired seed, propensity, replicate, executor, task, and environment metadata are present in every cell
- [ ] T016 Verify: Discovery, loading, invocation, resource exposure, trajectory, milestone, and outcome remain distinct — no causal stage is inferred from a terminal score
- [ ] T017 Verify: Scoring retains raw evidence and gold integrity — empty, pending, or structural-only gold emits an explicit blocking fact and cannot enter a positive numerator
- [ ] T018 Verify: Compatibility and risk evidence is digest-bound — version mismatch, negative transfer, composition, security, cost, and workload facts remain append-only
- [ ] T019 Verify: Certificate lifecycle facts are validity-bounded — issued, withheld, and expired events reference evidence, confidence, compatibility slices, and expiry triggers
- [ ] T020 Verify: Upcasters are deterministic and non-mutating — source identity/version remains stable and repeated replay yields the same current envelope and fingerprint
- [ ] T021 Verify: The next sibling can consume the complete vocabulary without adding missing event types or changing event meaning
<!-- /ANCHOR:phase-3 -->

<!-- ANCHOR:completion -->
## Completion Criteria

- [ ] All tasks complete
- [ ] All requirements in spec.md met with evidence
- [ ] Phase gate green (validate/schema-fixture/replay checks as applicable)
<!-- /ANCHOR:completion -->

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Next sibling**: `002-reducers-and-projections` consumes this event vocabulary
<!-- /ANCHOR:cross-refs -->
