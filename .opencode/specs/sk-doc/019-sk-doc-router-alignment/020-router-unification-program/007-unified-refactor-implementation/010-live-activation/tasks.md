---
title: "Tasks: Unified Router Refactor — Live Activation"
description: "Task breakdown for the design-faithful fenced-CAS activation of all seven hubs and the gated cutover."
trigger_phrases:
  - "live activation tasks"
  - "hub activation task list"
importance_tier: "critical"
contextType: "implementation"
---
# Tasks: Unified Router Refactor — Live Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: tasks-core + level2-verify | v2.2 -->

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

- [x] T001 Author `lib/activate-hub.cjs` — the shared, zero-dependency fenced-CAS activation driver.
- [x] T002 Frozen-scorer gate: re-hash the three shared scorer files and abort on any drift from the pinned digests.
- [x] T003 Canary gate: execute each child's `harness/validate-canary.cjs`; abort on a non-zero exit.
- [x] T004 Seed: byte-for-byte copy each child's prior + candidate manifests into `activation/<hub>/`; verify the seeded prior hash equals the accepted `priorManifestHash`.

**Evidence**: The driver runs offline with zero external dependencies; each hub's record reports `scorerFrozen=true` and `canaryGreen=true`, and the seeded prior hash matches the accepted `priorManifestHash`.

<!-- /ANCHOR:phase-1 -->

---

<!-- ANCHOR:phase-2 -->
## Phase 2: Implementation

- [x] T005 Fenced CAS ship for `sk-code` (compiled generation 2) — `activated`, `servingAuthority: legacy`, fence `0 → 1`.
- [x] T006 Fenced CAS ship for `mcp-tooling` (generation 4).
- [x] T007 Fenced CAS ship for `system-deep-loop` (generation 3).
- [x] T008 Fenced CAS ship for `cli-external-orchestration` (generation 5).
- [x] T009 Fenced CAS ship for `sk-prompt` (generation 5).
- [x] T010 Fenced CAS ship for `sk-design` (generation 6).
- [x] T011 Fenced CAS ship for `sk-doc` (generation 5).

**Evidence**: All seven hubs, in activation order, bound their compiled generation as `selectedPolicy` with `servingAuthority: legacy` and `shadowOnly: true`; `fence-state.json` shows epoch 1 per hub.

<!-- /ANCHOR:phase-2 -->

---

<!-- ANCHOR:phase-3 -->
## Phase 3: Verification

- [x] T012 Prove a byte-exact rollback per hub in a scope-validated temp dir (`restoredHash` = accepted `priorManifestHash`); confirm the committed activated state is undisturbed.
- [x] T013 Emit `activation/<hub>/activation-record.json` per hub (eligibility, CAS transition, rollback proof, real-model slot).
- [x] T014 Confirm the completed rollout children remain byte-unchanged and all activation state is confined to `activation/`.
- [ ] T015 [B] P4a T9 — real-model routing verification per hub (LUNA high/fast, SOL medium/fast, MiniMax M3) on playbook prompts; record `real-model/<hub>/verdict.json`. Deferred/in-progress.

**Evidence**: Each record reports `rollback.byteExact=true`; the driver never writes under a child path. Real-model verification (T015) is honestly recorded as pending, not complete.

<!-- /ANCHOR:phase-3 -->

---

<!-- ANCHOR:completion -->
## Completion Criteria

- [x] All seven hubs print `ACTIVATION BOUND … serving=legacy shadowOnly=true fence=0->1 rollback.byteExact=true scorerFrozen=true canaryGreen=true`.
- [x] Frozen scorer digests unchanged (driver re-hash matches the three pinned digests).
- [x] Completed rollout children byte-unchanged; activation state confined to `activation/`.
- [ ] P4a T9 real-model routing verification recorded per hub (gated/deferred).
- [ ] T016 [B] P4b — build a runtime resolver that consumes `selectedPolicy` behind a flag (gated, deferred; legacy reachable).
- [ ] T017 [B] P4b — flip `servingAuthority` `legacy → compiled` one hub at a time with post-flip re-verification and proven rollback (gated, deferred — only stage that changes runtime routing).
- [ ] Strict Level-2 packet validation on this phase folder.

**Evidence**: P4a design-faithful activation is complete for all 7 hubs; T9 real-model verification and P4b cutover (T016-T017) are gated/deferred and NOT claimed done.

<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:cross-refs -->
## Cross-References

- **Specification**: See `spec.md`
- **Plan**: See `plan.md`
- **Verification checklist**: See `checklist.md`
- **Completion record**: See `implementation-summary.md`
- **Activation driver**: `lib/activate-hub.cjs`

<!-- /ANCHOR:cross-refs -->
