---
title: "Implementation Summary: Unified Router Refactor — Live Activation"
description: "Design-faithful fenced-CAS activation of all seven hubs: selectedPolicy bound to the compiled generation, byte-exact rollback proven, scorer frozen. P4b cutover complete in 011-runtime-engine (all 7 hubs flipped legacy->compiled, inert behind the default-off SPECKIT_COMPILED_ROUTING flag)."
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
| **Status** | Complete — P4a design-faithful activation + T9 real-model verification (0 wrong-hub routes) complete for all 7 hubs, and the P4b cutover (`011-runtime-engine`) is complete: all 7 hubs flipped `legacy → compiled`, inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag, byte-exact rollback retained. Advisor-hook machine-enforcement remains in progress |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | `compiled` (committed) — P4a bound the compiled generation as `selectedPolicy` with legacy serving; the sibling P4b flip (`011`) advanced all 7 manifests to `servingAuthority: compiled`, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag |
| **Strict validation** | `validate.sh --strict` reports Errors: 0 (3 advisory warnings) |

<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A phase-local **activation layer** with one shared, zero-dependency driver, `lib/activate-hub.cjs`. The driver binds each hub's compiled policy generation as the `selectedPolicy` on a dedicated per-hub activation manifest via a fenced compare-and-swap, advancing a monotonic fence epoch, while `servingAuthority` stays `legacy`. It seeds its manifests byte-for-byte from each hub's shadow rollout child (so the completed canary children are never mutated), refuses to run unless the child's canary is green and the three frozen scorer files match their pinned digests, and proves a byte-exact rollback in a scope-validated temp dir on every run.

This is the design-faithful reading of activation: the compiled contract becomes the *accepted, bound* generation; at P4a bind time legacy kept *serving* because no runtime consumer existed yet. The genuine runtime change — a resolver that reads `selectedPolicy` plus a `servingAuthority` flip — is now complete in the sibling `011-runtime-engine`: all seven hubs are flipped `legacy → compiled`, held inert behind the default-off `SPECKIT_COMPILED_ROUTING` flag (route-gold ROUTING byte-identical — only hashes changed), with a byte-identical legacy manifest retained per hub for a byte-exact rollback.

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Driver | `lib/activate-hub.cjs` | The shared fenced-CAS activation driver (one path, run once per hub) |
| Activation state | `activation/<hub>/{manifest.json, manifest.prior.json, manifest.candidate.json, fence-state.json}` | Per-hub serving manifest, seeded prior/candidate, and fence state |
| Audit | `activation/<hub>/activation-record.json` | Per-hub audit trail (eligibility, CAS transition, rollback proof, real-model slot) |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Status, evidence, verification, and the completion boundary |

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
| Bound real-model verification (T9) to a sample; then execute the P4b flip behind a flag | T9 ran 2 authentic playbook prompts per hub × 3 models × 2 runs — bounded but real (0 wrong-hub routes). The serving-authority flip is the only stage that changes runtime routing; it was executed in `011` one-hub-at-a-time behind the default-off `SPECKIT_COMPILED_ROUTING` flag and stays reversible (per-hub serving-prior or fleet-wide flag off). |

<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

All seven hubs, in activation order, returned `ACTIVATION BOUND … serving=legacy shadowOnly=true fence=0->1 rollback.byteExact=true scorerFrozen=true canaryGreen=true` at P4a bind time; the sibling P4b flip (`011`) then advanced all seven to `servingAuthority: compiled`, `shadowOnly: false` behind the default-off `SPECKIT_COMPILED_ROUTING` flag (each flip canary-green via the real scorer, route-gold ROUTING byte-identical, byte-exact rollback retained):

| Hub | Compiled generation | Rollback byte-exact | Serving (post-P4b) |
|-----|--------------------:|:-------------------:|---------|
| sk-code | 2 | ✓ | compiled |
| mcp-tooling | 4 | ✓ | compiled |
| system-deep-loop | 3 | ✓ | compiled |
| cli-external-orchestration | 5 | ✓ | compiled |
| sk-prompt | 5 | ✓ | compiled |
| sk-design | 6 | ✓ | compiled |
| sk-doc | 5 | ✓ | compiled |

Frozen scorer digests (unchanged, pinned in the driver):

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Real-model routing verification is a bounded sample, not exhaustive coverage.** A fresh post-flip sweep was re-run (after all 7 serving-authority flips): LUNA/SOL (fast) + MiniMax M3 on 2 authentic playbook prompts per hub × 2 runs, **0 wrong-hub routes** across all 3 models × 7 hubs — SOL and MiniMax passed 2/2 on every hub; the LUNA non-passes are transport timeouts, not misroutes. Fresh verdicts are in `real-model/<hub>/verdict.json`. This confirms the pre-flip P4a T9 result held post-cutover, consistent with the recompiles being route-gold byte-identical. It remains a 2-prompts-per-hub sample, not the full playbook corpus.
2. **The P4b literal cutover (T16-T17) is complete.** The runtime resolver that consumes `selectedPolicy` and the `servingAuthority` `legacy → compiled` flip — the only stage that changes runtime routing — were delivered in the sibling `011-runtime-engine` (commits engine `d7da0fca43`, sk-code cutover `2fa3357f80`, remaining-6 cutover `337ca43cfa`, pushed on v4). All 7 hubs are flipped, each canary-green via the real scorer with a byte-exact rollback retained; the path is inert by default (`SPECKIT_COMPILED_ROUTING` off) and reversible per-hub or fleet-wide. The advisor-hook machine-enforcement layer that would machine-enforce the wired routing remains in progress.
3. **The four non-hub single-skill routers are out of scope here.** They use a different archetype (`fenced-manifest.cjs`, no `acceptance.json`) and are not part of the seven-hub P4 activation order; they can be activated by that path under a separate follow-up.

<!-- /ANCHOR:limitations -->

<!--
_memory:
  continuity:
    status: complete
    current_focus: "P4a complete (7/7 hubs bound + byte-exact rollback + T9 real-model verification, 0 wrong-hub routes); P4b cutover complete in 011-runtime-engine — all 7 hubs flipped legacy->compiled (servingAuthority: compiled), held inert behind the default-off SPECKIT_COMPILED_ROUTING flag (route-gold byte-identical), byte-exact rollback retained per hub"
    next_steps:
      - "Advisor-hook machine-enforcement layer (program-level) remains in progress"
      - "Enablement is operator-gated: set SPECKIT_COMPILED_ROUTING=1 to serve compiled (routing byte-identical); reversible per-hub (flip-serving --rollback) or fleet-wide (flag off)"
    blockers: []
-->
