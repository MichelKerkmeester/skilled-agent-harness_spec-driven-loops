---
title: "Verification Checklist: sk-code Per-Hub Canary"
description: "Phase-local Stage-4 evidence for the sk-code compiled-router canary."
trigger_phrases:
  - "sk-code canary verification"
  - "surfaceBundle stage-4 evidence"
  - "sk-code rollback drill"
importance_tier: "critical"
contextType: "implementation"
---
# Verification Checklist: sk-code Per-Hub Canary

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

- [x] CHK-001 [P0] Authoritative phase docs, synthesis sections, live authored inputs, and frozen contracts were read first.
  - **Evidence**: Intake covered `spec.md`, `plan.md`, `tasks.md`; synthesis §§2.1–2.3, 7, 8.1–8.3, 9, 10; live `mode-registry.json` and `SKILL.md`; and phases `000`, `001`, `002`, `003`, and `005`.
- [x] CHK-002 [P0] All writes remained inside this phase folder.
  - **Evidence**: The delivered inventory is rooted under `001-sk-code/`; live registry, skill, router config, shared scorer, and frozen contract phases were read-only.
- [x] CHK-003 [P1] Upstream frozen harnesses were green before implementation.
  - **Evidence**: Contract, compiler, evaluator, execution, and calibration harnesses exited 0 before the canary was built.

<!-- /ANCHOR:pre-impl -->
---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] CommonJS and JSON syntax checks pass.
  - **Evidence**: `node --check` passes for every phase-local `.cjs`; every phase-local `.json` parses with `JSON.parse`.
- [x] CHK-011 [P0] Runtime code has zero external dependencies.
  - **Evidence**: The validator reports `externalDependencies: 0`; modules use Node built-ins and frozen local libraries only.
- [x] CHK-012 [P0] No skill-name conditional branch exists.
  - **Evidence**: The static gate reports `skillNameBranches: 0`; `skillId` remains compiled data rather than a control-flow discriminator.
- [x] CHK-013 [P1] Comment hygiene passes on every comment-capable delivered file.
  - **Evidence**: The project comment-hygiene checker exits 0 for every phase-local CJS file (Markdown is outside its supported extension set); the validator also reports `commentViolations: 0` across seven code files.

<!-- /ANCHOR:code-quality -->
---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] Byte-identical compilation is checked against the authored registry bytes.
  - **Evidence**: Independent recompilation returns the fixed canonical policy hash `54bdc95a97fbe397b61d298a09af3a90c9533c92613d9d6b70324300c195cc06`; a caller-supplied self-description is rejected.
- [x] CHK-021 [P0] The reference surface bundle has actor-first order-of-loading.
  - **Evidence**: `review my webflow animation for jank` returns `route(surfaceBundle, [code-review(actor), code-webflow(evidence)])`; execution evidence reports `routeLoadingOrder: [actor, evidence]`.
- [x] CHK-022 [P0] Real route-gold scoring is GREEN without a self-oracle.
  - **Evidence**: Five typed real-hub cases pass the read-only `evaluateRouteGold`; corrupting an observation makes the real scorer fail (`corruptedObservationPass: false`).
- [x] CHK-023 [P0] Evidence cannot COMMIT and actor COMMIT requires VERIFY.
  - **Evidence**: Evidence VERIFY returns `REJECT`, direct COMMIT fails `ROLE_CANNOT_COMMIT`, actor COMMIT without READY fails `COMMIT_WITHOUT_READY`, and the legal path is exactly `PREPARE → VERIFY → COMMIT` with one actor effect.
- [x] CHK-024 [P0] Every aggregate hard block is driven with a specific refusal code.
  - **Evidence**: Fixtures drive evidence COMMIT, negative authority/target/tool, pinned-tuple mismatch, mixed generations, exact-route recovery artifacts, COMMIT without VERIFY, and scorer-edit-required; each maps to its named activation block.
- [x] CHK-025 [P0] Advisor drift and availability never rewrite a decision.
  - **Evidence**: `live` plus identity match contributes rank evidence; stale, absent, unavailable, and projection drift contribute no rank authority and preserve the same route identity.
- [x] CHK-026 [P0] No-over-emission behavior is exact.
  - **Evidence**: Zero leaf signal defers with `no-match`, a surface alone defers, and ambiguity emits one clarify sourced from the fallback checklist; negative projections carry empty intents/resources.
- [x] CHK-027 [P0] Document-only replay genuinely matches the machine snapshot.
  - **Evidence**: All five fixtures match with terminal `DOCUMENT_ONLY_UNATTESTED`; a planted card divergence is rejected instead of falling back to machine policy.
- [x] CHK-028 [P0] Fenced rollback is byte-exact and mixed generations are refused.
  - **Evidence**: The drill performs accept, fenced CAS, pin, and rollback; prior/restored SHA-256 both equal `5485c5a4a6faddca886425dedc59bd0d5340f7946f9bf7f6a8fec36e802a8c23`, final fence epoch is 2, and mixed pins fail `MIXED_GENERATION_OBSERVED`.

<!-- /ANCHOR:testing -->
---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Destination roles and mutation flags derive from `packetKind` only.
  - **Evidence**: The compiler's closed mapping is `workflow → actor/true` and `surface → evidence/false`; it rejects unknown packet kinds and does not accept per-destination role claims.
- [x] CHK-031 [P0] Compatibility projection reuses the frozen evaluator projector.
  - **Evidence**: Positive typed routes project to existing intents/resources; clarify, defer, and reject use the established empty-intent convention; no scorer adapter was added.
- [x] CHK-032 [P0] Dual-read aliases are complete and fail closed.
  - **Evidence**: All 29 authored aliases resolve through the generated compatibility projection; an unmapped alias returns `null`, and projection drift is detected.
- [x] CHK-033 [P0] Legacy remains serving-authoritative after the Stage-4 proof.
  - **Evidence**: Candidate and eligible manifests report `servingAuthority: legacy` and `shadowOnly: true`; no live routing file was changed.

<!-- /ANCHOR:fix-completeness -->
---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] Negative decisions cannot carry target, tool, or authority.
  - **Evidence**: Direct structural guards refuse smuggled tool/target as `NEGATIVE_TARGET_FORBIDDEN` and altered authority as `NEGATIVE_AUTHORITY_INVALID`.
- [x] CHK-041 [P0] Activation uses a preimage check plus token lock and fencing epoch.
  - **Evidence**: A wrong expected generation/hash fails `MANIFEST_CAS_MISMATCH`; the fencing epoch is checked immediately before atomic rename and advances on ship and rollback.
- [x] CHK-042 [P1] No network, package install, credential, or dynamic-code surface was introduced.
  - **Evidence**: The implementation is zero-dependency CommonJS; validation runs offline and reads no environment secret.

<!-- /ANCHOR:security -->
---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on the canary state.
  - **Evidence**: Authored docs report Stage-4 GREEN while retaining legacy serving authority and explicitly excluding a live flip.
- [x] CHK-051 [P0] Design decisions cite the approved synthesis.
  - **Evidence**: `implementation-summary.md` cites synthesis §§2.1–2.3, 7, 8.1–8.3, 9, and 10.
- [x] CHK-052 [P1] Required anchors are exact, balanced, and ordered.
  - **Evidence**: The final anchor scan checks each checklist and implementation-summary anchor appears once, opens/closes once, and follows the required order.

<!-- /ANCHOR:docs -->
---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] Compiler, router, policy card, activation, execution, fixtures, and harnesses remain phase-local.
  - **Evidence**: Source is separated under `lib/`, `fixtures/`, `harness/`, `compiled/`, and `activation/` beneath this phase root.
- [x] CHK-061 [P1] Protected authored and scorer inputs remain byte-unchanged.
  - **Evidence**: Final validator digests equal all three pinned scorer hashes; registry and skill hashes are rechecked after validation, and no protected input was written.

<!-- /ANCHOR:file-org -->
---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 23 | 23/23 |
| P1 Items | 5 | 5/5 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-19  
**Verification Scope**: Phase-local compile, routing, real-scorer replay, authority, advisor, document parity, activation, and rollback gates.  
**External Boundary**: `validate.sh --strict` was not run; the execution brief reserves it for the orchestrator from the main tree.

<!-- /ANCHOR:summary -->
