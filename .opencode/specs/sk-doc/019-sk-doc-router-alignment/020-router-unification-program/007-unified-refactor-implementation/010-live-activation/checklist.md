---
title: "Checklist: Unified Router Refactor — Live Activation"
description: "QA gate for the design-faithful fenced-CAS activation of all seven hubs."
trigger_phrases:
  - "live activation checklist"
  - "hub activation QA gate"
importance_tier: "critical"
contextType: "implementation"
---
# Checklist: Unified Router Refactor — Live Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: checklist-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:protocol -->
## Verification Protocol

| Priority | Handling | Completion Impact |
|----------|----------|-------------------|
| **[P0]** | HARD BLOCKER | Cannot claim P4a activation complete until verified |
| **[P1]** | Required | Must verify or state the deferred/gated boundary |
| **[P2]** | Optional | May defer with an explicit reason |

<!-- /ANCHOR:protocol -->

---

<!-- ANCHOR:pre-impl -->
## Pre-Implementation

- [x] CHK-001 [P0] Authoritative design-of-record, per-hub rollout children, and frozen contracts were read before authoring the driver.
  - **Evidence**: Intake covered the two-stage activation design (bind vs serve), each hub's `manifest.prior/candidate.json`, and the three pinned scorer digests.
- [x] CHK-002 [P0] All writes remained inside this phase folder.
  - **Evidence**: The driver and all activation state are rooted under `010-live-activation/`; the rollout children, live routing files, and shared scorer were read-only.
- [x] CHK-003 [P1] Each hub's shadow rollout canary was green before activation.
  - **Evidence**: The driver executes each child's `harness/validate-canary.cjs` as a precondition and aborts on a non-zero exit.

<!-- /ANCHOR:pre-impl -->

---

<!-- ANCHOR:code-quality -->
## Code Quality

- [x] CHK-010 [P0] The activation driver has zero external dependencies.
  - **Evidence**: `lib/activate-hub.cjs` uses Node built-ins only; it runs offline with no package install.
- [x] CHK-011 [P0] CommonJS and JSON syntax are valid.
  - **Evidence**: `node --check` passes for the driver; every `activation/<hub>/*.json` parses with `JSON.parse`.
- [x] CHK-012 [P1] The driver contains no per-hub conditional branch.
  - **Evidence**: One code path runs for all seven hubs; hub identity is data (the seed source), not a control-flow discriminator.

<!-- /ANCHOR:code-quality -->

---

<!-- ANCHOR:testing -->
## Testing

- [x] CHK-020 [P0] All seven hubs bound their compiled generation as `selectedPolicy`.
  - **Evidence**: sk-code (gen 2), mcp-tooling (gen 4), system-deep-loop (gen 3), cli-external-orchestration (gen 5), sk-prompt (gen 5), sk-design (gen 6), sk-doc (gen 5) each report `activated: true`, `shippedThisRun: true`.
- [x] CHK-021 [P0] The fence epoch advanced `0 → 1` monotonically per hub.
  - **Evidence**: Each `activation/<hub>/fence-state.json` shows fence epoch 1 after the CAS.
- [x] CHK-022 [P0] Byte-exact rollback is proven for every hub.
  - **Evidence**: Each record shows `rollbackProof.byteExact: true` with `restoredHash` equal to the accepted `priorManifestHash`; the committed activated state is undisturbed.
- [x] CHK-023 [P0] The frozen-scorer pin aborts on drift.
  - **Evidence**: The driver re-hashes `router-replay.cjs`, `score-skill-benchmark.cjs`, and `load-playbook-scenarios.cjs`; records report `scorerFrozen=true` and the digests are unchanged.
- [x] CHK-024 [P0] The canary green gate aborts on a non-zero exit.
  - **Evidence**: Records report `canaryGreen=true`; a non-GREEN `validate-canary.cjs` exit aborts activation for that hub.
- [x] CHK-025 [P1] Re-running an already-bound hub is idempotent.
  - **Evidence**: A second run is a no-op ship that still executes and proves the rollback drill.

<!-- /ANCHOR:testing -->

---

<!-- ANCHOR:fix-completeness -->
## Fix Completeness

- [x] CHK-030 [P0] Every hub's `selectedPolicy` equals its compiled `candidatePolicy`.
  - **Evidence**: Driver `--json` records and the committed `activation/<hub>/manifest.json` agree on the bound generation.
- [x] CHK-031 [P0] Serving authority stayed `legacy` and `shadowOnly` stayed `true` through P4a (no runtime routing change at bind time).
  - **Evidence**: Each P4a activation record reported `servingAuthority: "legacy"`, `shadowOnly: true`; the sibling P4b flip (`011`) has since advanced the committed manifests to `servingAuthority: "compiled"`, `shadowOnly: false`, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag (route-gold ROUTING byte-identical).
- [x] CHK-032 [P0] Seeding is byte-for-byte from the rollout children.
  - **Evidence**: The seeded prior hash equals the accepted `priorManifestHash`; the candidate `selectedPolicy` equals the accepted `candidatePolicy`.
- [x] CHK-033 [P1] A per-hub `activation-record.json` audit trail was emitted.
  - **Evidence**: Each `activation/<hub>/activation-record.json` records eligibility, the CAS transition, the rollback proof, and a `realModelVerification` slot.

<!-- /ANCHOR:fix-completeness -->

---

<!-- ANCHOR:security -->
## Security

- [x] CHK-040 [P0] No live routing file was edited.
  - **Evidence**: No `SKILL.md`, `hub-router.json`, or `mode-registry.json` was changed; activation state is confined to `010-live-activation/activation/`.
- [x] CHK-041 [P0] The shared benchmark scorer is untouched.
  - **Evidence**: The three pinned scorer digests are unchanged after the full seven-hub run.
- [x] CHK-042 [P1] No network, package install, credential, or dynamic-code surface was introduced.
  - **Evidence**: The driver is zero-dependency CommonJS and runs offline; it reads no environment secret.

<!-- /ANCHOR:security -->

---

<!-- ANCHOR:docs -->
## Documentation

- [x] CHK-050 [P0] Spec, plan, tasks, checklist, and summary agree on the activation state.
  - **Evidence**: All docs report P4a design-faithful activation complete for 7 hubs, T9 real-model verification complete (0 wrong-hub routes), and the P4b cutover complete in `011` (all 7 hubs `compiled`, inert behind the default-off flag); the advisor-hook machine-enforcement layer is the one item still labeled in progress.
- [x] CHK-051 [P1] Remaining in-progress work is labeled honestly, not as done.
  - **Evidence**: Real-model verification (T9) and the P4b cutover (T16-T17) are recorded as complete; the advisor-hook machine-enforcement layer is complete (committed, flag-off byte-parity proven), and a fresh post-flip real-model sweep was re-run — 0 wrong-hub routes across 3 models × 7 hubs (LUNA non-passes are transport timeouts), refreshing `real-model/<hub>/verdict.json`.
- [x] CHK-052 [P1] Real-model routing verification recorded per hub.
  - **Evidence**: 3 models (LUNA/SOL fast, MiniMax M3) × 7 hubs on authentic playbook prompts; 40/42 pass, **0 wrong-hub routes** (2 non-passes are LUNA transport timeouts, run2 correct). Verdicts in `real-model/<hub>/verdict.json`; each record's `realModelVerification` carries its per-model result.
- [x] CHK-053 [P0] Strict Level-2 packet validation passes on this phase folder.
  - **Evidence**: `validate.sh --strict` reports `Errors: 0` (3 advisory warnings: absent `_memory` continuity blocks + evidence-marker lint).

<!-- /ANCHOR:docs -->

---

<!-- ANCHOR:file-org -->
## File Organization

- [x] CHK-060 [P0] The driver and all activation state are phase-local.
  - **Evidence**: `lib/activate-hub.cjs` and `activation/<hub>/{manifest.json, manifest.prior.json, manifest.candidate.json, fence-state.json, activation-record.json}` live beneath this phase root.
- [x] CHK-061 [P1] Protected authored inputs and the completed rollout children remain byte-unchanged.
  - **Evidence**: The seed is a read-only byte copy; the driver never writes under a child path, and the scorer digests are unchanged.

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
**Verification Scope**: Phase-local fenced-CAS activation of all seven hubs — binding, fence advance, byte-exact rollback, frozen-scorer pin, canary green gate, child immutability, and audit records.
**Completion Boundary**: Real-model routing verification (T9) is complete (0 wrong-hub routes across 3 models), and the P4b runtime resolver + serving-authority flip (T16-T17) is complete in `011-runtime-engine` — all 7 hubs flipped `legacy → compiled`, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag and byte-exact-reversible. The advisor-hook machine-enforcement layer is complete (committed, flag-off byte-parity proven). A fresh post-flip real-model sweep was re-run and passed: 0 wrong-hub routes across 3 models × 7 hubs.

<!-- /ANCHOR:summary -->
