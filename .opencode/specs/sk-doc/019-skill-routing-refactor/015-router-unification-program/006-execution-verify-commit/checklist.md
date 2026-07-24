---
title: "Verification Checklist: Destination-Local Execution Plane"
description: "Phase-local protocol, ledger, fencing, replay, and protected-scorer evidence."
trigger_phrases:
  - "execution plane verification"
  - "prepare verify commit checklist"
  - "idempotency fencing evidence"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Destination-Local Execution Plane

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot advance the shadow destination gate until verified |
| **[P1]** | Required | Must verify or document a destination-owned boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative packet docs, synthesis sections, frozen schemas, canonical hashing, projector, and scorer APIs were read first.
  - **Evidence**: Intake covered `spec.md`, `plan.md`, `tasks.md`, synthesis §§2, 3 Idea 7, 4, 5.2, 8.2, 9, 10, 11.5, both frozen schemas, `lib/canonical.cjs`, the phase-002 projector, and protected exports.
- [x] CHK-002 [P0] Every write remained inside the authorized phase folder.
  - **Evidence**: Phase inventory contains all new runtime, fixture, test, harness, and documentation files; scorer, registry, routing config, guard, and skill paths were read-only.
- [x] CHK-003 [P1] Baseline, blast radius, and rollback were recorded.
  - **Evidence**: Baseline contained three planning docs plus generated metadata; blast radius is zero-live-authority shadow execution; rollback is the tested pre-effect adapter disable path.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] JavaScript and JSON syntax checks pass.
  - **Evidence**: `node --check` covers all five CJS files and a Node `JSON.parse` check covers the fixture; every command exits 0.
- [x] CHK-011 [P0] Comment hygiene reports zero violations.
  - **Evidence**: The project checker exits 0 for each CJS file; the harness independently scans all five code files and reports `commentViolations: 0`.
- [x] CHK-012 [P0] Frozen canonical serialization/hashing is reused without a local implementation.
  - **Evidence**: Protocol and harness imports resolve to `../000-contract-schemas/lib/canonical.cjs`; proof and replay hashes match fixed fixture oracles across 25 runs.
- [x] CHK-013 [P1] Public boundaries are documented and invalid inputs fail with stable codes.
  - **Evidence**: Exported PREPARE, projector, ledger operations, VERIFY, evidence resolution, and COMMIT carry JSDoc; unsafe paths assert exact codes rather than bare throws.
- [x] CHK-014 [P1] The two cohesive protocol/test files exceed the 500-line style target without mixing runtime responsibilities.
  - **Evidence**: `execution-plane.cjs` keeps one state machine and delegates ledger/projector concerns; the long test file is direct transition coverage. Splitting either would add indirection without changing the public contract.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Stale proof reaches VERIFY and cannot reach COMMIT.
  - **Evidence**: Seven drift/supersession/expiry variants return `STALE_PROOF`; specific COMMIT attempts fail `COMMIT_WITHOUT_READY`; effect count remains zero.
- [x] CHK-021 [P0] Duplicate idempotency key attempts a second COMMIT but performs one effect.
  - **Evidence**: The same READY ticket is committed twice; the second returns the original frozen receipt object, with `effectCount: 1` and `receiptCount: 1`.
- [x] CHK-022 [P0] Every closed VERIFY state is exercised.
  - **Evidence**: Harness output contains exactly `STALE_PROOF`, `READY`, `NEEDS_INPUT`, `DEFER`, and `REJECT` from real calls.
- [x] CHK-023 [P0] Mutation fences an actual later prepared leg.
  - **Evidence**: A read-only leg resolves first, the first mutation advances epoch 40→41 and invalidates leg 2, and that leg's next VERIFY returns `STALE_PROOF`.
- [x] CHK-024 [P0] Route-gold invokes the real shared scorer in a write-denied process.
  - **Evidence**: Three independently authored gold rows pass `evaluateRouteGold`; a deliberate intent corruption fails; `routeSkillResources` is present; the write-attempt log is empty.
- [x] CHK-025 [P1] Determinism compares repeated output to fixed checked-in oracles.
  - **Evidence**: Each fixture runs 25 times, produces one replay hash, and matches both `expectedReplayHash` and `expectedProofHash` from the fixture.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] PREPARE binds every required input while preserving frozen `RouteProofV1` bytes.
  - **Evidence**: Exact proof key allowlist passes; seven versioned read entries bind request, policy, registry/authority, targets, authority class, preconditions, and destination state.
- [x] CHK-031 [P0] Negative decisions and bare/forged proofs cannot commit.
  - **Evidence**: All three negative actions emit zero proofs; malformed negative target smuggling is rejected; null, bare, and forged READY values fail with exact codes.
- [x] CHK-032 [P0] Ordering and N=1 cardinality use one code path without name branches.
  - **Evidence**: Single and bundle legs report `PREPARE → VERIFY → COMMIT`; static multiline `if`/`switch`/ternary gate reports zero skill-name violations.
- [x] CHK-033 [P0] Receipt, fencing, and local authority semantics match the destination boundary.
  - **Evidence**: COMMIT re-acquires a destination-owned handle, stores the post-mutation fencing epoch in the receipt, and never serializes the handle into proof or receipt.
- [x] CHK-034 [P1] Atomic and explicitly non-atomic destination behavior is declared.
  - **Evidence**: `execution-plane.md` declares all four roles; a failed non-atomic external attempt remains pending and a retry performs no second effect.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Proof is evidence and carries no capability.
  - **Evidence**: Frozen proof keys contain no authority/capability field; the READY ticket is process-local and COMMIT still requires current destination-local acquisition.
- [x] CHK-041 [P0] Evidence roles cannot mutate or COMMIT.
  - **Evidence**: Mutating evidence targets fail validation; a READY evidence leg fails COMMIT as `ROLE_CANNOT_COMMIT` and resolves through the read-only path.
- [x] CHK-042 [P1] No dependency, credential, network, or live-authority surface was introduced.
  - **Evidence**: Runtime dependencies are Node built-ins, phase-local modules, and the frozen canonical library; no install, environment secret, network request, or live adapter exists.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Canonical docs agree on implemented shadow scope and honest route-gold status.
  - **Evidence**: Spec, plan, tasks, checklist, operating contract, and summary distinguish local pass evidence from `SC-005: shadow-partial` and per-hub activation.
- [x] CHK-051 [P1] Operating decisions cite the approved synthesis.
  - **Evidence**: `execution-plane.md` and `implementation-summary.md` cite synthesis §§2, 3 Idea 7, 4, 5.2, 6, 7, 8.2, 9, 10, and 11.5.
- [x] CHK-052 [P1] Required anchor contracts are exact and balanced.
  - **Evidence**: Anchor scan confirms every checklist and summary anchor appears once, opens and closes once, and follows the required order.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Runtime, ledger, projector, fixtures, tests, harness, and docs remain phase-local.
  - **Evidence**: Runtime is under `lib/`, typed data under `fixtures/`, tests under `tests/`, harness under `harness/`, and operating/docs at the phase root.
- [x] CHK-061 [P1] Protected scorer, router, live config, registries, guards, and skills remain untouched.
  - **Evidence**: Both protected files match pinned SHA-256 constants before and after scoring; phase-local source has no guard import; write inventory contains only phase paths.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 18 | 18/18 |
| P1 Items | 9 | 9/9 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-18  
**Verification Scope**: Phase-local unit, in-memory transition, deterministic replay, projector, protected-byte, and real shared-scorer gates.  
**Overall Status**: Shadow-partial because real hub scenarios through the real router producer belong to per-hub activation.  
**External Boundary**: `validate.sh --strict` intentionally not run; the orchestrator owns that command from the main tree.

<!-- /ANCHOR:summary -->
