# GLM Cross-Lineage Notes

> **A second model (GLM-5.2) explored the same out-of-box agenda in parallel with SOL. This is what it added that the seven SOL ideas did not already cover.**

---

## What GLM was

While the SOL lineage produced the seven ideas in this packet, a **GLM-5.2 lineage** (5 iterations, via opencode, packet `./004-oob-glm-parallel-research/`) ran the same 8-item out-of-box agenda concurrently, deliberately chartered to *diverge*. It described its own job as contributing **an axis system the SOL verdict lives in**, not a competing verdict. It read the repository and reasoned about design; it executed no live router commands (so its design claims are single-model inference, pending cross-check).

## The three ideas GLM produced

1. **Typed handoff primitive** — a small 5-field record (`routeId, fromMode, toMode, reason, evidence`) emitted when a mode discovers it's the wrong home. Turns routing from open-loop into **closed-loop**. (Overlaps SOL Idea 4, no-wrong-door handoff.)
2. **(T, R, P) decomposition** — routing has three orthogonal knobs: **T**hreshold (when is evidence strong enough), **R**ecovery (what happens after a wrong pick), **P**rovenance (where the vocab→mode evidence comes from). `defaultMode` is *one corner* of this 3-D space. (No SOL idea frames the policy **knob space** this way.)
3. **Contrarian: `defaultMode` was a documented bug, not a knob** — you only need a default when wrong picks are unrecoverable; once typed recovery (R) exists, the field has no work to do. (Sharper, recovery-centric version of SOL Ideas 6/7's frame-break.)

## Two sourced, model-independent facts

These are verifiable from the repo, not design inference — high confidence:

- **`weight: 4` is uniform across every hub router.** The weight field does *zero* discrimination work; all of it lives in `vocabularyClasses`. So "learn the weights" is a non-starter — the real learning target is the **vocabulary→mode assignment**.
- **`_apply_deep_skill_routing_layer` is the one shipped precedent** for advisor-side mode pre-resolution (regex-gated, deep-loop only; non-generalizable, but it proves the pattern ships).

## Net-new vs the SOL seven — what's worth pursuing

Most of GLM overlaps SOL with different framing. Three things are genuinely additive:

| GLM contribution | Where it lands | Recommendation |
|------------------|----------------|----------------|
| **(T, R, P) knob decomposition** | Complements Idea 6 (minimal typed contract); reframes the whole policy space and subsumes the shipped keep-1/flip-4 verdict as "corners" | **Candidate 8th idea** — its own 5-iteration dive, if pursued. Strongest new direction. |
| **Handoff records as the training signal** (closed-loop) | Bridges Idea 4 (handoff = recovery) and Idea 2 (overlay = learning): handoff records are the training data for the overlay | Fold into Ideas 2 + 4 as the learning input. |
| **"Learn the vocab table, not the weights"** | Sharpens Idea 2 (overlay), which assumed learnable weight/threshold deltas | Fold into Idea 2 — the overlay's real target is the vocab→mode assignment, since weights are inert. |

## How it maps to each idea

- **Idea 1 (compiled policy):** GLM's advisor-side pre-resolution precedent (`_apply_deep_skill_routing_layer`) is the one existing example of Layer 0 doing mode-level work — relevant to the compiled policy's Layer-0 projection.
- **Idea 2 (correction overlay):** learn the **vocabulary→mode table**, not weights (weights are uniform/inert); the **training signal** is Idea 4's handoff records.
- **Idea 4 (no-wrong-door handoff):** GLM independently reached the same bounded-handoff primitive from the feedback-channel angle, and adds that the handoff record is *also* a closed-loop learning signal, not just recovery.
- **Idea 6 (minimal typed contract):** GLM's **(T, R, P)** is the knob-space companion to Idea 6's decision-shape contract — Idea 6 types the *decision*, (T, R, P) types the *policy*.

## Honest ceiling

Every GLM design claim is **single-lineage inference from one model, with no live router execution.** The two sourced facts (uniform weights; the pre-resolution precedent) are the durable, model-independent takeaways. Treat (T, R, P), the typed-handoff contract details, and the "defaultMode is a bug" reframe as **proposals to validate**, not settled conclusions. Full GLM narrative: `./004-oob-glm-parallel-research/research/lineages/glm-oob/research.md`.
