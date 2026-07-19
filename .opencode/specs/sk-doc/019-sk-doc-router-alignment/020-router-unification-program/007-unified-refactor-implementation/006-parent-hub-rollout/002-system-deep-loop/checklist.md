---
title: "Verification Checklist: system-deep-loop Per-Hub Canary"
description: "Phase-local Stage-4 evidence for the seven-mode deep-loop compiled-router canary."
trigger_phrases:
  - "system-deep-loop canary verification"
  - "deep-improvement no-collapse evidence"
  - "deep-loop rollback drill"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: system-deep-loop Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot advance the per-hub canary gate until verified |
| **[P1]** | Required | Must verify or state the external boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->
---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative phase docs, synthesis sections, authored inputs, and frozen contracts were read first.
  - **Evidence**: Intake covered `spec.md`, `plan.md`, `tasks.md`; synthesis §§2.2–2.3, 5.3, 7, 8.2–8.3, 9, 10; the live registry and skill; the prior canary; and phases `000`, `002`, and `003`.
- [x] CHK-002 [P0] All writes remained inside this phase folder.
  - **Evidence**: The delivered inventory is rooted under `002-system-deep-loop/`; live skill, registry, scorer, router, manifest, and shared contracts were read-only.
- [x] CHK-003 [P1] The predecessor canary gate was confirmed GREEN.
  - **Evidence**: `../001-sk-code/implementation-summary.md` reports its Stage-4 phase-local canary gate GREEN with legacy serving authority retained.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] CommonJS and strict-JSON syntax checks pass.
  - **Evidence**: Final checks run `node --check` on every phase-local `.cjs` and parse every phase-local `.json` with `JSON.parse`.
- [x] CHK-011 [P0] Runtime code has zero external dependencies.
  - **Evidence**: The validator reports `externalDependencies: 0`; implementation modules use Node built-ins and frozen local libraries only.
- [x] CHK-012 [P0] No skill-name conditional branch exists.
  - **Evidence**: The static gate reports `skillNameBranches: 0`; all seven modes compile from registry data.
- [x] CHK-013 [P1] Comment hygiene passes on every delivered code file.
  - **Evidence**: The phase validator reports `commentViolations: 0` across seven CommonJS files, and the three modified code files pass the focused hygiene scan.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Compilation is byte-identical from the immutable authored registry.
  - **Evidence**: Independent recompilation equals `compiled/policy.json`; a caller object that differs from source bytes fails `AUTHORED_SOURCE_IDENTITY_MISMATCH`.
- [x] CHK-021 [P0] Seven authored modes compile to seven destinations across five packets.
  - **Evidence**: Validator output reports `destinationCount: 7`, `distinctPublicModeCount: 7`, `registryModeCount: 7`, `packetCount: 5`, and `identityInjective: true`.
- [x] CHK-022 [P0] The shared `deep-improvement` packet does not collapse three public modes.
  - **Evidence**: All three rows retain distinct identity tuples and routing classes; an authored-registry routing-class mutation fails full compile as `SHARED_PACKET_COLLAPSE`, while a separate tuple duplicate fails `DESTINATION_IDENTITY_COLLAPSE`.
- [x] CHK-023 [P0] The shared `review` runtime key does not collapse `review` and `alignment`.
  - **Evidence**: Both rows preserve `runtimeLoopType=review` with different packets; an authored-registry packet merge fails full compile as `RUNTIME_KEY_COLLAPSE`.
- [x] CHK-024 [P0] Runtime-loop discriminators come verbatim from the registry.
  - **Evidence**: Coherent mutation fixtures propagate an unexpected authored `review` discriminator onto `agent-improvement`, while an authored `null` removes the optional schema field; no workflow-name inference occurs.
- [x] CHK-025 [P0] Real route-gold scoring separates actual greens from incomplete shadow projections.
  - **Evidence**: Real read-only `evaluateRouteGold` scores all eleven compatibility-projector observations; four negative-control rows are `real-green`, while all seven positive rows are `shadow-partial` because their expected resources are absent.
- [x] CHK-026 [P0] Deep-loop selection is single-only.
  - **Evidence**: `compositionRules` is empty, the card grammar is `single`, every positive case has one target, and a planted `orderedBundle` fails `BUNDLE_EMISSION_FORBIDDEN`.
- [x] CHK-027 [P0] Advisor drift and availability never rewrite a decision.
  - **Evidence**: Live identity-matched evidence may contribute; stale, absent, unavailable, and hash-drift cases preserve route identity and degrade to annotation-only or zero evidence.
- [x] CHK-028 [P0] No-over-emission behavior is exact.
  - **Evidence**: Zero signal emits `defer(no-match)` with empty observations, ambiguity emits one checklist-derived `clarify`, and reject carries no target or authority.
- [x] CHK-029 [P0] Document-only replay genuinely matches the machine policy.
  - **Evidence**: Fifteen full-request cases match with terminal `DOCUMENT_ONLY_UNATTESTED`, including constraint-only reject, explicit-mode, dependency, clarify, and advisor inputs; a planted routing-snapshot divergence fails `DOCUMENT_PARITY_MISMATCH`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every aggregate hard block is driven with a named refusal code.
  - **Evidence**: Shared-packet collapse, runtime-key collapse, bundle emission, negative authority, pinned-tuple mismatch, mixed generations, route recovery artifacts, COMMIT without VERIFY, and scorer-edit-required each block activation.
- [x] CHK-031 [P0] Destination COMMIT requires matching destination-local VERIFY.
  - **Evidence**: Direct COMMIT fails `COMMIT_WITHOUT_READY`; the legal path is exactly `PREPARE → VERIFY → COMMIT` with one effect.
- [x] CHK-032 [P0] Dual-read aliases are complete and fail closed.
  - **Evidence**: All seven workflow modes and commands plus advisor aliases resolve; routing classes are preserved, shared advisor id `deep-improvement` resolves to its authored default, and an unknown alias returns `null`.
- [x] CHK-033 [P0] Legacy remains serving-authoritative after the canary proof.
  - **Evidence**: Candidate manifests report `servingAuthority: legacy` and `shadowOnly: true`; the actual route-gold subgate is incomplete, `shadowPartialEligible` is false, and no live routing configuration changed.
- [x] CHK-034 [P0] Authored public modes are present and unique before destination compilation.
  - **Evidence**: Changing `ai-council` to duplicate `research` fails full compile as `PUBLIC_MODE_DUPLICATE`; removing a `workflowMode` fails as `PUBLIC_MODE_MISSING`. Removing the uniqueness guard makes the duplicate fixture reach six distinct public modes.
- [x] CHK-035 [P0] The real scorer consumes the delivered typed route-gold artifact.
  - **Evidence**: The validator reads `compiled/route-gold.typed.json`, verifies every row projection hash and the acceptance digest, then scores those exact rows. Recomputing both hashes after corrupting the persisted `one-turn-clarify` intent still fails as `DELIVERED_ROUTE_GOLD_MISMATCH`.
- [x] CHK-036 [P0] Document replay consumes the full machine request.
  - **Evidence**: The harmless prompt `unrelated orchard inventory` plus `constraints:["forbidden"]` matches machine `reject(forbidden)`; removing constraint consumption changes document replay to `defer(no-match)`.
- [x] CHK-037 [P0] Compatibility observations never source or backfill resources from the legacy router.
  - **Evidence**: The canary reports `legacyBackfillUsed: false`; `single-research` has `compiledLeafPairs: 0`, projector output `{observedIntents:["research"], observedResources:[]}`, byte-equal scored observation, and row status `shadow-partial`.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Negative decisions cannot carry target or authority.
  - **Evidence**: Structural guards refuse smuggled targets as `NEGATIVE_TARGET_FORBIDDEN` and altered authority as `NEGATIVE_AUTHORITY_INVALID`.
- [x] CHK-041 [P0] Activation uses preimage CAS, a token lock, and a monotonic fencing epoch.
  - **Evidence**: A wrong expected tuple fails `MANIFEST_CAS_MISMATCH`; ship and rollback advance epochs `0→1→2`, and mixed pins fail `MIXED_GENERATION_OBSERVED`.
- [x] CHK-042 [P1] No network, package install, credential, or dynamic-code surface was introduced.
  - **Evidence**: All implementation and verification commands are offline, zero-dependency Node invocations; no environment secret is read.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on the canary state.
  - **Evidence**: Authored docs report 4 real-green rows, 7 `shadow-partial` positive rows, legacy authority retained, and the Stage-4 gate blocked.
- [x] CHK-051 [P0] Design decisions cite the approved synthesis.
  - **Evidence**: `implementation-summary.md` cites synthesis §§2.2–2.3, 5.3, 7, 8.2–8.3, 9, and 10.
- [x] CHK-052 [P1] Required anchors are exact, balanced, and ordered.
  - **Evidence**: The final anchor scan verifies every checklist and implementation-summary anchor opens and closes once in the required sequence.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Compiler, router, card, activation, fixtures, generated projections, and harnesses remain phase-local.
  - **Evidence**: Source and artifacts are separated under `lib/`, `fixtures/`, `harness/`, `compiled/`, and `activation/` beneath this phase root.
- [x] CHK-061 [P1] Protected authored and scorer inputs remain byte-unchanged.
  - **Evidence**: Final validator digests equal the three pinned scorer hashes plus the pinned registry and skill hashes before and after the run.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 28 | 28/28 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-19  
**Verification Scope**: Phase-local compile, manifest-identity projection, honest route-gold classification, delivered-artifact scoring, full-request document parity, authority, activation blocking, and rollback gates.  
**External Boundary**: Strict packet validation remains to run after final reconciliation.

<!-- /ANCHOR:summary -->
