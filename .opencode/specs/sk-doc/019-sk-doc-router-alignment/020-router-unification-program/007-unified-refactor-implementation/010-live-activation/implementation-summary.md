---
title: "Implementation Summary: Unified Router Refactor — Live Activation"
description: "Design-faithful fenced-CAS activation of all seven hubs: selectedPolicy bound to the compiled generation, serving authority legacy, byte-exact rollback proven, scorer frozen. P4b cutover gated."
trigger_phrases:
  - "live activation implementation summary"
  - "seven hubs activated design-faithful"
  - "P4b cutover gate"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: Unified Router Refactor — Live Activation

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | P4a design-faithful activation complete for all 7 hubs; real-model verification (T9) and P4b cutover (T10-T11) deferred/gated |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy; compiled generation bound as `selectedPolicy`, shadow-only |
| **Strict validation** | Run on this phase folder; TEMPLATE_HEADERS and ANCHORS_VALID pass (Errors: 0) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A phase-local **activation layer** with one shared, zero-dependency driver, `lib/activate-hub.cjs`. The driver binds each hub's compiled policy generation as the `selectedPolicy` on a dedicated per-hub activation manifest via a fenced compare-and-swap, advancing a monotonic fence epoch, while `servingAuthority` stays `legacy`. It seeds its manifests byte-for-byte from each hub's shadow rollout child (so the completed canary children are never mutated), refuses to run unless the child's canary is green and the three frozen scorer files match their pinned digests, and proves a byte-exact rollback in a scope-validated temp dir on every run.

This is the design-faithful reading of activation: the compiled contract becomes the *accepted, bound* generation; legacy keeps *serving* because no runtime consumer exists yet. The genuine runtime change — a resolver that reads `selectedPolicy` plus a `servingAuthority` flip — is scoped as P4b and gated.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Driver | `lib/activate-hub.cjs` | The shared fenced-CAS activation driver (one path, run once per hub) |
| Activation state | `activation/<hub>/{manifest.json, manifest.prior.json, manifest.candidate.json, fence-state.json}` | Per-hub serving manifest, seeded prior/candidate, and fence state |
| Audit | `activation/<hub>/activation-record.json` | Per-hub audit trail (eligibility, CAS transition, rollback proof, real-model slot) |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Status, evidence, verification, and the deferred/gated boundary |

<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Per hub, the driver runs six steps. (1) **Frozen-scorer gate** — re-hash the three shared scorer files (`router-replay.cjs`, `score-skill-benchmark.cjs`, `load-playbook-scenarios.cjs`) and abort on any drift from the pinned digests. (2) **Canary gate** — execute the child's `harness/validate-canary.cjs`; a non-zero exit (route-gold not GREEN, rollback not pass, serving-authority not legacy, or protected-digest drift) aborts. (3) **Seed** — byte-for-byte copy the child's prior + candidate manifests into `activation/<hub>/`, verifying the seeded prior hash equals the accepted `priorManifestHash` and the candidate `selectedPolicy` equals the accepted `candidatePolicy`. (4) **Fenced CAS ship** — assert the serving manifest's `selectedPolicy` equals the expected prior generation at the expected fence epoch (compare), then write the candidate bytes into `manifest.json` and advance the fence epoch (swap), with `servingAuthority` staying `legacy`. (5) **Rollback proof** — in a scope-validated temp dir, restore the prior manifest and assert the restored hash is byte-exact against `priorManifestHash` and `selectedPolicy` reverts to the prior generation, never disturbing the committed activated state. (6) **Record** — emit `activation/<hub>/activation-record.json`.

The completed rollout children are treated strictly as read-only inputs: the driver never mutates a child, and all activation state is confined to `010-live-activation/activation/`. The seven hubs were activated in blast-radius order — `sk-code → mcp-tooling → system-deep-loop → cli-external-orchestration → sk-prompt → sk-design → sk-doc`.

<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Split activation into P4a (bind) and P4b (serve) | Isolates the highest-blast change (live routing) from the low-blast governance binding, so each is gated on its own merits. |
| Bind `selectedPolicy` while `servingAuthority` stays `legacy` | Faithful to the design of record: an activation-pointer CAS never edits a serving policy, and no runtime consumer of the compiled contract exists yet. |
| Seed byte-for-byte from the rollout children | Keeps the completed canary children pristine and green while guaranteeing the seeded prior hash equals the accepted `priorManifestHash`. |
| Re-hash the frozen scorer before every activation | A drifted scorer would invalidate the canary baseline; drift must abort before any manifest write. |
| Prove rollback in a scope-validated temp dir | Demonstrates byte-exact reversibility per hub without disturbing the committed activated state. |
| Confine all writes to `activation/` | Prevents any mutation of a proven child canary or a live routing file. |
| Defer real-model verification (T9) and the P4b flip | The serving-authority flip is the only stage that changes runtime routing; it is gated, reversible, and one-hub-at-a-time, and real-model verification is bounded and honestly labeled rather than rushed. |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All seven hubs, in activation order, returned `ACTIVATION BOUND … serving=legacy shadowOnly=true fence=0->1 rollback.byteExact=true scorerFrozen=true canaryGreen=true`:

| Hub | Compiled generation | Rollback byte-exact | Serving |
|-----|--------------------:|:-------------------:|---------|
| sk-code | 2 | ✓ | legacy |
| mcp-tooling | 4 | ✓ | legacy |
| system-deep-loop | 3 | ✓ | legacy |
| cli-external-orchestration | 5 | ✓ | legacy |
| sk-prompt | 5 | ✓ | legacy |
| sk-design | 6 | ✓ | legacy |
| sk-doc | 5 | ✓ | legacy |

Frozen scorer digests (unchanged, pinned in the driver):

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real-model routing verification (P4a T9) is pending.** Verification across LUNA (high/fast), SOL (medium/fast), and MiniMax M3 on each hub's playbook prompts is deferred; it will be recorded in `real-model/<hub>/verdict.json` with a bounded, honestly labeled breadth. It is not claimed complete.
2. **The P4b literal cutover (T10-T11) is gated and not executed.** Building a runtime resolver that consumes `selectedPolicy` and flipping `servingAuthority` `legacy → compiled` one hub at a time — the only stage that changes runtime routing — requires an explicit go, with post-flip re-verification, proven rollback, and legacy reachable until each hub is green.
3. **The four non-hub single-skill routers are out of scope here.** They use a different archetype (`fenced-manifest.cjs`, no `acceptance.json`) and are not part of the seven-hub P4 activation order; they can be activated by that path under a separate follow-up.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: in-progress
    current_focus: "P4a design-faithful activation complete (7/7 hubs bound, byte-exact rollback proven); real-model verification (T9) and P4b cutover (T10-T11) pending/gated"
    next_steps:
      - "Real-model routing verification per hub (LUNA/SOL/MiniMax) on playbook prompts"
      - "Gate P4b: runtime resolver + serving-authority flip (highest blast, one hub at a time)"
    blockers: []
-->
