---
title: "Verification Checklist: Decision Evaluator"
description: "Phase-local implementation and replay evidence for the closed route-decision evaluator."
trigger_phrases:
  - "decision evaluator verification"
  - "route decision checklist"
  - "shadow replay evidence"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Decision Evaluator

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot advance the shadow gate until verified |
| **[P1]** | Required | Must verify or document an operator-owned boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative specification, plan, tasks, synthesis sections, and frozen V1 contracts were read before implementation.
  - **Evidence**: Intake covered `spec.md`, `plan.md`, `tasks.md`, synthesis §§2.3, 4, 5, 5.1, 5.2, 6, 8.2, 9, 10, all consumed schemas, both compiled-policy fixtures, decision fixtures, and `lib/canonical.cjs`.
- [x] CHK-002 [P0] Scope remained inside the decision-evaluator folder for all writes.
  - **Evidence**: The created/updated file inventory is entirely rooted in this folder; shared schemas, scorer files, registries, and skills were read-only.
- [x] CHK-003 [P1] Baseline and rollback were recorded.
  - **Evidence**: Baseline contained only planning docs and generated metadata; rollback is removal/disablement of the phase-local shadow lane, which owns no authority or effects.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] JavaScript syntax and JSON syntax checks pass.
  - **Evidence**: `node --check` passed for all five CJS files; a Node `JSON.parse` check for `fixtures/evaluator-cases.v1.json` exited 0.
- [x] CHK-011 [P0] Comment hygiene reports zero violations.
  - **Evidence**: `check-comment-hygiene.sh` ran against every CJS file and emitted no findings; the replay driver's independent five-file comment scan also passed.
- [x] CHK-012 [P0] The evaluator has no filesystem, network, clock, RNG, advisor-call, or mutation path.
  - **Evidence**: Static gates reject seven effect patterns in evaluator sources; frozen input snapshots remain canonically byte-identical after every fixture evaluation.
- [x] CHK-013 [P1] Public boundaries are documented and invalid input is guarded.
  - **Evidence**: Exported evaluator, traced evaluator, policy-checked decision parser, explicitly named shape-only parser, and projector have JSDoc; positive decisions require a content-valid policy before projection.
- [x] CHK-014 [P1] No destination-name special case exists.
  - **Evidence**: Static gates find no quoted destination names in evaluator sources and reject multiline `if`, `switch`, and ternary comparisons of `skillId` to literals.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All typed fixture families replay to fixed expected decisions.
  - **Evidence**: Eleven cases cover exact single, ordered bundle, surface bundle, zero-signal defer, clarify, reject, degraded fallback, rank-only defer, stale refusal, named handoff, and mixed-generation rejection; scorer gold is authored separately from projected observations.
- [x] CHK-021 [P0] Dangerous states fail with specific structural reasons.
  - **Evidence**: Tests assert 13 exact guard codes, including missing route policy, off-policy target, structurally commit-capable evidence authority, malformed surface bundle, and invalid degraded/rank evidence.
- [x] CHK-022 [P0] Determinism is compared to fixed hash oracles across runs and processes.
  - **Evidence**: Each fixture runs 25 times in-process and in three child processes; every hash equals its checked-in expected decision hash.
- [x] CHK-023 [P0] The shared route-gold scorer is actually invoked.
  - **Evidence**: A write-denied child process requires `score-skill-benchmark.cjs` and its real `evaluateRouteGold()` export; 11/11 projected observations pass separately authored intent/resource gold, the write-attempt log is empty, and an injected corruption fails as `intent-mismatch`. No mapping to existing legacy corpus rows is claimed.
- [x] CHK-024 [P1] N=1 constant-folding is instrumented rather than inferred.
  - **Evidence**: Exact-route, zero-signal, and degraded N=1 rows each report `{rankCalls:0,bundleCalls:0,handoffCalls:0}`; zero signal returns `defer(no-match)`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Authority remains destination-local for all outcomes.
  - **Evidence**: Routes carry only `WithheldUntilVerify`; clarify/defer/reject carry only `Withheld`; no capability, lease, proof, fence, or commit token is representable.
- [x] CHK-031 [P0] Target closure and bundle roles are enforced.
  - **Evidence**: Every positive parse requires a hash-valid policy; target identity, role, authority reference, and mutation flag must match exactly one declaration; surface bundles also require a matching composition rule.
- [x] CHK-032 [P1] Rank and degraded evidence remain non-authoritative.
  - **Evidence**: Rank-only input stays `defer(no-match)`; route rank evidence requires `nonAuthority:true`; degraded fallback names unavailable evidence and the pure evaluator has no cache or write path.
- [x] CHK-033 [P1] Generation and tuple mismatch paths refuse routing.
  - **Evidence**: Integer generation mismatch returns `defer(stale-policy)`; a route also requires a live compatibility/runtime claim matching both generation and effective hash. Missing binding defers and conflicting binding rejects before ranking or bundling. The frozen request schema does not make this claim first-class, so a schema amendment remains recommended.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] External inputs are bounded by closed vocabularies and exact object fields.
  - **Evidence**: Guards reject additional decision fields, unknown actions/roles/reasons, malformed identities, invalid hashes, unregistered targets, and malformed evidence.
- [x] CHK-041 [P0] Evidence-role targets cannot commit or mutate.
  - **Evidence**: Authority references resolve through a closed relation class; evidence destinations require a matching `evidenceOnly` edge, and one reference cannot span evidence-only and commit-approval classes. A `commitAuthority` falsifier is rejected structurally rather than lexically.
- [x] CHK-042 [P1] No external dependency or secret surface was introduced.
  - **Evidence**: Runtime code uses Node built-ins only plus the frozen canonical library; no package file, install command, environment credential, network request, or dynamic code execution exists.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Authored canonical docs agree on current evidence and external boundaries.
  - **Evidence**: Spec, plan, tasks, checklist, and implementation summary distinguish phase-local verification from orchestrator-owned strict validation; generated graph metadata remains pending orchestrator refresh.
- [x] CHK-051 [P1] Design decisions cite the approved synthesis.
  - **Evidence**: `implementation-summary.md` cites synthesis §§2.3, 4 seam A, 5.1, 5.2, 6, 7, 8.2, 9, and 10.
- [x] CHK-052 [P1] Required anchor contracts are exact and balanced.
  - **Evidence**: Anchor scan confirms the checklist and summary each contain their required anchors once, in the requested order, with no orphaned close.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Implementation, fixtures, tests, driver, and documentation remain phase-local.
  - **Evidence**: Runtime modules are under `lib/`, typed data under `fixtures/`, tests under `tests/`, and the driver/docs at the phase root.
- [x] CHK-061 [P1] Frozen scorer, route-gold, registries, and skills remain byte-unchanged.
  - **Evidence**: Driver before/after hashes remain equal, and scorer/router bytes independently match two checked-in trusted SHA-256 constants before and after subprocess scoring; no protected file was written.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 15 | 15/15 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-18  
**Verification Scope**: Phase-local unit, structural, deterministic replay, projector, and shared-scorer gates.  
**External Boundary**: `validate.sh --strict` intentionally not run; the orchestrator owns that check from the main tree.

<!-- /ANCHOR:summary -->
