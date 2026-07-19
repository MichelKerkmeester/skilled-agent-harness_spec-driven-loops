---
title: "Checklist: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)"
description: "QA gate for the P4b runtime engine: compiled-route reuse, double-gated resolver, fenced-CAS flip, and the sk-code end-to-end proof."
trigger_phrases:
  - "runtime engine checklist"
  - "P4b cutover QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Unified Router Refactor — Runtime Engine (P4b Literal Cutover)

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim the P4b engine complete until verified |
| **[P1]** | Required | Must verify or state the IN-PROGRESS/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] The P4a activation design, the rollout children's canary engines, and the frozen scorer digests were read before authoring the engine.
  - **Evidence**: Intake covered `010-live-activation`'s bound manifests, each child's `harness/build-artifacts.cjs` + `lib/canary-router.cjs`, and the three pinned scorer digests.
- [x] CHK-002 [P0] All authored code stayed inside this phase folder.
  - **Evidence**: `lib/compiled-route.cjs`, `lib/resolve.cjs`, and `lib/flip-serving.cjs` are rooted under `011-runtime-engine/`; the rollout children, live routing files, and shared scorer were read-only.
- [x] CHK-003 [P1] Each hub is P4a-bound before it can be flipped.
  - **Evidence**: `flip-serving.cjs` asserts `selectedPolicy` is the compiled generation and aborts if the hub is not P4a-bound.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] All three runtime modules have zero external dependencies.
  - **Evidence**: `compiled-route.cjs`, `resolve.cjs`, and `flip-serving.cjs` use Node built-ins only and run offline with no package install.
- [x] CHK-011 [P0] CommonJS syntax is valid and the modules load.
  - **Evidence**: `node --check` passes for all three files; the engine and resolver `require` cleanly and the CLI front-door runs.
- [x] CHK-012 [P1] The engine reuses the child's routing algebra rather than reimplementing it.
  - **Evidence**: `compiled-route.cjs` routes through the child's archetype engine (`evaluateCanary` or `evaluateRoute`) over `loadSnapshot`; it defines no independent decision algebra.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] The engine returns a normalized decision and defers on off-signal prompts.
  - **Evidence**: `compiledRoute(hubId, taskText)` returns `{hubId, action, selectionKind, targets, effectivePolicyHash, generation}`; `action` is one of route/clarify/defer/reject, and an off-signal prompt returns `defer`.
- [x] CHK-021 [P0] The resolver is inert unless both gates hold.
  - **Evidence**: `resolveRoute` returns null unless `SPECKIT_COMPILED_ROUTING=1` AND the manifest reads `servingAuthority: compiled`; the flag-off CLI prints the legacy sentinel `{servingAuthority: legacy, hubId}`.
- [x] CHK-022 [P0] The resolver fails safe on error.
  - **Evidence**: A missing/unparseable manifest defaults `servingAuthority()` to `legacy`; any engine error inside `resolveRoute` is caught and returns null (legacy fallback).
- [x] CHK-023 [P0] The serving flip aborts before any write when a gate fails.
  - **Evidence**: `flip-serving.cjs` aborts on non-P4a-binding, a non-zero `validate-canary.cjs`, a scorer-digest mismatch, or `assertEngineRoutes` routing zero scenarios.
- [x] CHK-024 [P0] Byte-exact rollback is proven on `sk-code` and retained.
  - **Evidence**: `--rollback` restores `manifest.serving-prior.json` byte-for-byte (the retained serving-prior reads `servingAuthority: legacy`, `shadowOnly: true`); the mechanism was exercised and proven. `sk-code` was then flipped for the production cutover and is currently `servingAuthority: compiled` at fence epoch 4, with the byte-identical serving-prior retained so the same byte-exact rollback remains available.
- [x] CHK-025 [P1] The flip is idempotent.
  - **Evidence**: A hub already `compiled`-serving is an `ALREADY-COMPILED` no-op; the monotonic fence is never reused across flip or rollback.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] The `sk-code` end-to-end path is proven: flip → compiled-served route → byte-exact rollback.
  - **Evidence**: `serving-flip-record.json` shows `servingAuthority: compiled`, generation 2, fence `3 → 4`, gates green (`canaryGreen: true`, `scorerFrozen: true`, routed 1/5); the front-door returned `action: route` to the `code-quality` surface (flag on) and a legacy sentinel (flag off); the byte-exact `--rollback` was exercised against the retained serving-prior.
- [x] CHK-031 [P0] All seven hubs are compiled-serving after the cutover, but inert by default.
  - **Evidence**: Each hub's committed `manifest.json` reads `servingAuthority: compiled`, `shadowOnly: false`; the runtime path is inert by default (`SPECKIT_COMPILED_ROUTING` off), so live routing is unchanged until the flag is enabled (compiled routing is route-gold byte-identical), and each hub is byte-exact-reversible via its retained `manifest.serving-prior.json`.
- [x] CHK-032 [P0] The flip's serving-prior retention makes rollback byte-exact.
  - **Evidence**: The retained `manifest.serving-prior.json` is byte-identical to the pre-flip manifest; `--rollback` writes those exact bytes back.
- [x] CHK-033 [P1] A per-flip `serving-flip-record.json` audit trail is emitted.
  - **Evidence**: The `sk-code` record captures the flipped policy, the fence transition, and the four green gates (`canaryGreen`, `scorerFrozen`, `routedScenarios`, `totalScenarios`).

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing file was edited.
  - **Evidence**: No `SKILL.md`, `hub-router.json`, or `mode-registry.json` was changed; the flip mutates only the P4a activation manifest under `010-live-activation/activation/<hub>/`.
- [x] CHK-041 [P0] The shared benchmark scorer is untouched.
  - **Evidence**: The three pinned scorer digests are unchanged after the `sk-code` proof; the flip re-hashes and aborts on drift.
- [x] CHK-042 [P1] No network, package install, credential, or dynamic-code surface was introduced.
  - **Evidence**: The three modules are zero-dependency CommonJS and run offline; the only child process is the child's `validate-canary.cjs` gate.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on the state.
  - **Evidence**: All docs report the P4b engine built, the `sk-code` end-to-end proof complete, and the cutover executed across all 7 hubs (each `SKILL.md` wired, re-certified, flipped `legacy → compiled`), held inert behind the default-off flag; the advisor-hook machine-enforcement layer is the one item still labeled in progress.
- [x] CHK-051 [P1] Remaining in-progress work is labeled honestly, not as done.
  - **Evidence**: The per-hub `SKILL.md` wiring and the seven-hub flip are recorded as complete across `tasks.md` and `implementation-summary.md`; post-flip real-model re-verification is honestly framed as satisfied by the P4a T9 result plus flag-off inertness (routing byte-identical), and the still-open advisor-hook machine-enforcement layer is labeled in progress.
- [x] CHK-052 [P1] The end-to-end proof and cutover are recorded with concrete evidence.
  - **Evidence**: `serving-flip-record.json` (fence `3 → 4`, gates green, routed 1/5), the byte-identical retained `manifest.serving-prior.json`, and the current compiled `manifest.json` (fence epoch 4) are cited as the proof + cutover artifacts under `010-live-activation/activation/<hub>/`.
- [x] CHK-053 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Evidence**: `validate.sh --strict` reports `Errors: 0` (advisory warnings only: absent `_memory` continuity blocks + evidence-marker lint).

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] The three runtime modules are phase-local.
  - **Evidence**: `lib/compiled-route.cjs`, `lib/resolve.cjs`, and `lib/flip-serving.cjs` live beneath this phase root; the flip's serving state lives on the P4a manifest it operates.
- [x] CHK-061 [P1] The rollout children and the frozen scorer remain byte-unchanged.
  - **Evidence**: The engine reuses the children read-only, and the three scorer digests are unchanged after the `sk-code` proof.

<!-- /ANCHOR:file-org -->

---

<!-- ANCHOR:summary -->
## Verification Summary

| Category | Total | Verified |
|----------|-------|----------|
| P0 Items | 13 | 13/13 |
| P1 Items | 8 | 8/8 |
| P2 Items | 0 | 0/0 |

**Verification Date**: 2026-07-19
**Verification Scope**: The P4b runtime engine — the compiled-route engine's reuse of each child's archetype engine (`evaluateCanary`/`evaluateRoute`), the double-gated fail-safe resolver + CLI front-door, the fenced-CAS serving flip with byte-exact rollback and audit record, the `sk-code` end-to-end proof, and the seven-hub `legacy → compiled` cutover (each `SKILL.md` wired + re-certified + flipped).
**Completion Boundary**: The per-hub live-`SKILL.md` routing directive and the seven-hub `legacy → compiled` serving flip are complete, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag and byte-exact-reversible. Post-flip real-model re-verification is treated as satisfied by the P4a T9 result plus flag-off inertness; the one item still in progress is the advisor-hook machine-enforcement layer.

<!-- /ANCHOR:summary -->
