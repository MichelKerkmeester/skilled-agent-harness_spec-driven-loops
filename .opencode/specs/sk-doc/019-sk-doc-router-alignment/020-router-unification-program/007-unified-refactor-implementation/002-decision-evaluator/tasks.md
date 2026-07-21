---
title: "Tasks: Decision Evaluator — Closed 4-Action Route Algebra"
description: "Task Format: T### [P?] Description (file path)"
trigger_phrases:
  - "decision evaluator tasks"
  - "route algebra task list"
  - "typed route-gold fixtures tasks"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Decision Evaluator — Closed 4-Action Route Algebra

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core | v2.2 -->

---

<!-- ANCHOR:notation -->
## Task Notation

| Prefix | Meaning |
|--------|---------|
| `[ ]` | Pending |
| `[x]` | Completed |
| `[P]` | Parallelizable |
| `[B]` | Blocked |

**Task Format**: `T### [P?] Description (file path)`
<!-- /ANCHOR:notation -->

---

<!-- ANCHOR:phase-1 -->
## Phase 1: Setup

### Contract Intake

- [x] T001 Pin the consumed contracts — import `RouteRequestV1`, `CompiledPolicyV1`, `Target`/identity types from `../000-contract-schemas/` and the compiled artifact + projections from `../001-compiler-n1-shadow/` (REQ-005, REQ-013)
- [x] T002 Confirm `pinnedActivationGeneration` and `effectivePolicyHash` are present and comparable on the pinned request/policy (REQ-013; synthesis §2.1)

**Evidence**: The evaluator imports the frozen canonical library and consumes only the two frozen
compiled-policy fixtures. It validates policy base/effective hashes and binds the request's integer
generation pin to `activationGeneration`; live tuple claims bind and cross-check
`effectivePolicyHash`.
<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

### Decision Type & Guards

- [x] T003 Define `RouteDecisionV1` as a closed discriminated union `route | clarify | defer | reject`, with `selectionKind ∈ {single, orderedBundle, surfaceBundle}` as an interior field of `route` only (REQ-002; synthesis §2.3, §4 seam A)
- [x] T004 Encode reason/basis vocabularies: `defer.reason ∈ {idle, no-match, dependency-failure, handoff-required, stale-policy, evidence-unavailable}`; `route.basis ∈ {signal, bounded-default, degraded-fallback}` (REQ-002, REQ-007)
- [x] T005 Make negatives structurally target-free and authority-`Withheld`; `route.authority = WithheldUntilVerify` — the flat six-value enum and top-level `selectionKind` unrepresentable (REQ-003, REQ-004; synthesis §2.3, §6)
- [x] T006 Write the structural guard layer: reject target-on-negative, out-of-set authority, empty-target route, route-with-recovery-artifacts, off-policy target identity, evidence-role COMMIT, malformed `surfaceBundle`, unnamed/mutating/cached `degraded-fallback` (REQ-003..007; synthesis §2.2, §7)

**Evidence**: `lib/decision-contract.cjs` returns immutable validated copies and the test suite
asserts 12 exact rejection codes rather than bare throws.

---

### Evaluator & Projector

- [x] T007 Implement `evaluate(request, policy) -> RouteDecisionV1` as a pure total function — no I/O, clock, RNG, advisor call, or mutation (REQ-001; synthesis §2 decision plane)
- [x] T008 Encode the branch order at the decision boundary: generation/authority admission → exact route → one-answer `clarify` → named `defer(handoff-required)` → recoverable `defer` → `reject`; confident routes emit no recovery artifacts (REQ-011; synthesis §4)
- [x] T009 [P] Enforce rank-as-evidence: `rankScore`/`scoreMargin` cannot flip a negative into a route or act as a probability (REQ-006; synthesis §3 idea 5)
- [x] T010 [P] Enforce generation pinning: mismatch or mixed-generation ⇒ `defer(stale-policy)`/`reject`, never a route (REQ-013; synthesis §9)
- [x] T011 Enforce N=1 degeneracy: walk empty ranking/bundle/handoff collections; zero leaf signal ⇒ `defer(no-match)` (never default-to-self) (REQ-012; synthesis §5.1, §5.2)
- [x] T012 Build `projectToRouteGold(decision) -> {observedIntents, observedResources}` — positive→intents/resources, negatives→empty-intent convention, typed leaf pairs→manifest-aware resources; `router-replay.cjs` and gold rows read-only (REQ-008; synthesis §8.2)

**Evidence**: `lib/evaluator.cjs` has no effect imports; `lib/projector.cjs` maps typed leaf
pairs only through a supplied frozen manifest projection. The rank-only fixture remains
`defer(no-match)`, and stale/mixed tuple fixtures never route.

---

### Fixtures & Shadow-Evaluate Gate

- [x] T013 Author the typed fixture families: exact single route; ordered + surface bundles; zero-signal idle `defer` with no default union; one-turn clarify; forbidden reject; direct route with no recovery artifacts; singular omission + zero rank-call; stale/mixed-generation refusal (REQ-011; synthesis §8.2)
- [x] T014 Wire the shadow-evaluate replay harness: `evaluate()` → `projectToRouteGold()` → existing scorer → compare to frozen gold; emit a classified mismatch report; never write back to gold (REQ-009; synthesis §9 stage 3)

**Evidence**: `fixtures/evaluator-cases.v1.json` contains 11 typed cases. The replay driver
invokes the unchanged shared scorer, classifies an injected mismatch, and hashes protected gold
before and after without writing it.
<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T015 Static scan confirms no I/O/clock/RNG imports; N-run cross-process replay is byte-identical (SC-001)
- [x] T016 Assert unrepresentability: negative-with-target, negative-with-authority, top-level `selectionKind`, route-with-recovery-artifact all fail the type/guard (SC-002)
- [x] T017 Protected-byte hashes prove `router-replay.cjs` is unchanged; existing route-gold gate stays green with the projector (SC-003)
- [x] T018 Stage 3 gate passes: deterministic typed replay, projection matches gold, mismatches classified, gold untouched (SC-004, MIGRATION GATE)
- [x] T019 N=1 fixture asserts zero rank/bundle/handoff calls and `defer(no-match)` on zero signal (SC-005)

**Evidence**: Unit tests report 112 assertions. Replay reports 11/11 route-gold matches,
25 identical runs per fixture, three matching child processes, protected-byte equality, and zero
N=1 rank/bundle/handoff calls.
<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All tasks marked `[x]`
- [x] No `[B]` blocked tasks remaining
- [x] Stage 3 (Shadow evaluate) gate passes before Phase 3 activates
- [x] `router-replay.cjs` byte-unchanged (a required scorer edit = migration failure)
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Source design**: `../../006-unified-refactor-research/unified-refactor-synthesis.md`
<!-- /ANCHOR:cross-refs -->
