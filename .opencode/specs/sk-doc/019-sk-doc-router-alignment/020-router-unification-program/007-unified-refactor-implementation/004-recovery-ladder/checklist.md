---
title: "Verification Checklist: Recovery Ladder"
description: "Phase-local evidence for the ordered ladder, shared uncertainty budget, typed fixtures, and shadow replay."
trigger_phrases:
  - "recovery ladder verification"
  - "uncertainty budget checklist"
  - "recovery shadow replay"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: Recovery Ladder

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot advance the recovery shadow gate until verified |
| **[P1]** | Required | Must verify or document an external boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative packet docs, cited synthesis sections, frozen schemas, canonical library, and protected scorer APIs were read first.
  - **Evidence**: Intake covered `spec.md`, `plan.md`, `tasks.md`, synthesis §§2.1, 2.3, 3-4, 8.1-8.2, 9-10, both consumed schemas, representative frozen fixtures, `lib/canonical.cjs`, and the exported scorer/router functions.
- [x] CHK-002 [P0] All writes stayed inside this phase folder.
  - **Evidence**: Created runtime, fixture, harness, checklist, and summary artifacts are phase-local; only the three existing canonical packet docs were updated.
- [x] CHK-003 [P1] Baseline and rollback were recorded.
  - **Evidence**: Frozen-contract validation and protected API loading passed before implementation; rollback is disabling/removing this authority-free shadow lane.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] CommonJS and JSON syntax checks pass.
  - **Evidence**: `node --check` passed for all three CJS files; Node `JSON.parse` checks passed for the contract, behavioral fixtures, and typed-gold fixtures.
- [x] CHK-011 [P0] Comment hygiene reports zero violations.
  - **Evidence**: `check-comment-hygiene.sh` ran against every CJS file and exited 0; an independent scan found no ephemeral labels in code comments.
- [x] CHK-012 [P0] No destination-name conditional branch exists.
  - **Evidence**: The harness rejects multiline `if`, `switch`, and ternary comparisons of `skillId` to literals; fixture destination names are absent from both runtime libraries.
- [x] CHK-013 [P1] Public CommonJS functions are documented and boundary inputs are guarded.
  - **Evidence**: `evaluateRecovery`, `projectCompatibility`, and `buildTypedRouteGold` carry JSDoc; request, decision, route candidate, clarify candidate target, question, reason, and threaded budget inputs use explicit guards or closed vocabularies.
- [x] CHK-014 [P1] The implementation uses no external dependency.
  - **Evidence**: Runtime imports only the frozen canonical library; the harness imports Node built-ins, the two phase-local libraries, and the same frozen canonical library.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The full six-rung order is exercised with specific terminal reasons.
  - **Evidence**: Twenty-two data-driven cases assert the exact invoked-rung list, terminal rung, terminal reason, decision action, and decision reason where applicable.
- [x] CHK-021 [P0] Clarify and handoff consume one shared counter and recovery is finite.
  - **Evidence**: The output exposes symmetric `budgetState` input/output; a two-call handoff case threads call 1 state into call 2 and asserts cumulative accepted turn and hop increments are exactly one. An unthreaded accepted clarification answer is specifically rejected as a caller-contract violation.
- [x] CHK-022 [P0] Handoff hop and visited guards are driven rather than inferred.
  - **Evidence**: A second hop and a visited destination each record `handoffAttempts=1` before ending with their specific refusal reason; accepted handoff records one hop and one ownership transfer.
- [x] CHK-023 [P0] Downstream `NEEDS_INPUT` cannot allocate another user turn.
  - **Evidence**: The downstream path records one input attempt, one spent turn, one hop, one ownership transfer, and `completionClaimed=false` before typed defer.
- [x] CHK-024 [P0] Confident routes bypass recovery and exact routes emit no handoff artifacts.
  - **Evidence**: The confident case has an empty rung list; the non-confident exact case stops at rung 2 with zero handoff attempts and zero ownership transfers.
- [x] CHK-025 [P0] Replay and typed-gold projection are deterministic.
  - **Evidence**: Twenty-five same-process runs and three child processes reproduce identical result hashes and checked-in `TypedRouteGoldV1` projection hashes for all 22 cases.
- [x] CHK-026 [P1] The real scorer is invoked with a working falsifier.
  - **Evidence**: A write-denied child process invokes `evaluateRouteGold`; 22/22 independently authored gold rows pass, while a deliberately corrupted intent fails. The phase projector supplies shadow observations; `routeSkillResources` is not invoked or claimed as exercised.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every public negative decision is target-free and authority-`Withheld`.
  - **Evidence**: Recursive guards reject `target`, `targets`, and `authorityRef` on every clarify/defer/reject result and assert branch authority exactly; a target-bearing authority-`Granted` confident negative is converted to `reject(invalid)`.
- [x] CHK-031 [P0] Zero signal cannot union a default or fallback route.
  - **Evidence**: `zero-signal-idle-no-default-union` supplies no defer reason yet emits `defer(idle)` with empty projection; a separate fixture carries `invalid: true` and reaches `reject(invalid)`.
- [x] CHK-032 [P1] All six defer reasons are exercised.
  - **Evidence**: The replay set contains `idle`, `no-match`, `dependency-failure`, `handoff-required`, `stale-policy`, and `evidence-unavailable` outcomes.
- [x] CHK-033 [P1] Rank evidence cannot auto-route without certificate validation.
  - **Evidence**: The ranked candidate without a certificate records one rank call and falls through to typed clarify; the declarative contract keeps the unavailable certificate validator inert.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Eligibility and authority dependency checks precede ranking.
  - **Evidence**: No-gate, partial-gate, forbidden, missing-authority, and stale-policy cases stop at rung 1 with `rankCalls=0` even when a ranked candidate is supplied; absent proof is never treated as affirmative.
- [x] CHK-041 [P0] Handoff transfers ownership without commit authority or completion claims.
  - **Evidence**: Handoff trace entries contain only owner ids, acceptance, and `completionClaimed=false`; public decisions carry no capability, proof, lease, fence, or commit token.
- [x] CHK-042 [P1] No network, secret, package, or live routing surface was introduced.
  - **Evidence**: Static scans find no network APIs in phase CJS and no runtime-library filesystem mutation; no package file, install command, credential, registry, or serving config is present.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary report the same shadow-partial state.
  - **Evidence**: Canonical docs distinguish the 22-case local Stage-3 evidence from deferred per-hub activation, state that only `evaluateRouteGold` is invoked, and record the orchestrator-owned strict-validation boundary.
- [x] CHK-051 [P1] Design decisions cite the approved synthesis.
  - **Evidence**: `implementation-summary.md` cites synthesis §§2.1, 2.3, 3 ideas 4-5, 4 seam B, 8.1-8.2, 9, and 10.
- [x] CHK-052 [P1] Required anchor contracts are exact and balanced.
  - **Evidence**: The final anchor scan checks each requested checklist and summary anchor once, in order, with one matching close; both docs pass `validate_document.py --type spec`, and extraction reports DQI 79/75 in the `good` band.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Runtime, fixtures, harness, and documentation remain phase-local.
  - **Evidence**: Runtime code is under `lib/`, fixture data under `fixtures/`, the replay driver under `harness/`, and canonical docs at the phase root.
- [x] CHK-061 [P1] Protected scorer, router, loader, schemas, registries, and skills remain untouched.
  - **Evidence**: Harness before/after SHA-256 checks match five trusted constants; alignment drift reports zero findings across eight implementation/config artifacts.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 17 | 17/17 |
| P1 Items | 10 | 10/10 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-18  
**Verification Scope**: Phase-local unit, structural, deterministic replay, projector, budget, and real shared-scorer gates.  
**Status**: `shadow-partial`; full real-producer/per-hub scenarios are deferred to activation.  
**External Boundary**: `validate.sh --strict` intentionally not run; the orchestrator owns that check from the main tree.

<!-- /ANCHOR:summary -->
