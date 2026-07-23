# Idea 8 — The (T, R, P) Decomposition

> **`defaultMode` isn't a knob — it's three different knobs jammed into one field. Pull them apart into Threshold, Recovery, and Provenance, and the whole keep-vs-null debate turns into a coordinate you can just read off.**

> **Provenance note:** this direction came from the **GLM-5.2 parallel lineage** (packet `023`), not the SOL seven. It's a single-model design inference — sharp, but **not yet stress-tested** with its own 5-iteration dive. Treat it as a candidate to validate, and see `../../GLM-cross-lineage-notes.md`.

---

## TL;DR

The seven SOL ideas type the *decision* a router makes. This one types the *policy knob-space* the decision lives in — and it's the one genuinely new frame from the GLM lineage. Its claim: routing has **three orthogonal knobs**, and today's `defaultMode` silently sets two of them at once:

- **T — Threshold**: how much evidence is required before the router commits to a mode.
- **R — Recovery**: what happens after an uncertain or wrong pick.
- **P — Provenance**: where the vocabulary→mode evidence comes from.

Once you see routing as a point in `(T, R, P)` space, `defaultMode` stops looking like a design choice and starts looking like *one corner* of that space — specifically `(T low, R none, P static)`: "always take the top scorer, never recover, never learn." The entire run-1/run-2 "keep sk-prompt vs flip the rest" argument was really just *picking different corners while calling them `defaultMode` values* — which is why it could never quite terminate.

## The problem today

- **`defaultMode` conflates T and R.** Setting it to `X` says *both* "threshold is low" (take the top mode) *and* "recovery is none" (no second chance). Setting it to `null` says "threshold is high" *and* "recovery is the defer card." The field literally **cannot express** "low threshold, high recovery" — default aggressively but recover cheaply. That corner is unreachable.
- **The other knobs leak across the policy, too.** `defaultResource` is a Provenance concern; `bundleRules` and `tieBreak` are Recovery/Provenance concerns; `ambiguityDelta` is a Threshold concern. Each field mixes axes, so no field means one thing.
- **Every new hub re-derives a corner by accident** instead of choosing one deliberately — the same debate reopens for each hub.

## The idea

Make the three knobs first-class and independent:

| Knob | The question it answers | Today's value | Lateral values it unlocks |
|------|-------------------------|---------------|----------------------------|
| **T — Threshold** | How strong must the evidence be to commit? | per-hub, implicit | `low` · `calibrated` · `defer-below-threshold` |
| **R — Recovery** | What happens after an uncertain/wrong pick? | none (re-prompt) | `none` · `handoff` · `card` · `orderedBundle` |
| **P — Provenance** | Where does the vocab→mode evidence come from? | static, hand-authored | `static` · `prior` · `offline-learned` |

A hub's routing policy becomes a **`(T, R, P)` triple plus a vocabulary table** — nothing else. The whole `routerPolicy` block collapses to three declared values, and the corners become explicit and *measurable per axis* (T via precision/recall, R via handoff-rate, P via drift-over-time).

## How it would work

```
             defaultMode: X        ≡  (T low,  R none,   P static)   "top scorer, no recovery, no learning"
             defaultMode: null+card ≡  (T high, R card,   P static)   "defer when unsure, show a card"
   the corner defaultMode CAN'T reach ≡  (T low,  R handoff, P learned) "default aggressively, recover cheaply, improve from recoveries"

   routerPolicy today                 →   (T, R, P) + vocabulary
   ─────────────────                      ──────────────────────
   defaultMode      (T+R jammed)      →   T, R  (split apart)
   ambiguityDelta   (T leaking)       →   T
   bundleRules      (R leaking)       →   R = orderedBundle
   defaultResource  (P leaking)       →   derived from (R, P)
   tieBreak         (P leaking)       →   P
```

Two supporting findings the lineage attached to this frame:
- **Learn the vocabulary table, not the weights.** Every hub's signal `weight` is a uniform `4` — the field does zero discrimination work; all of it lives in `vocabularyClasses`. So a "learned" router (P = learned) learns the **vocab→mode assignment**, offline and deterministically, not numeric weights.
- **Handoff records are the training signal.** If Recovery = handoff (Idea 4), each handoff ("mode A took token T, then handed to B") is a labeled example — the input a P = learned provenance needs. So the knobs compose: `R = handoff` *feeds* `P = learned`.

## Before vs after

| Aspect | Today (`defaultMode`) | With (T, R, P) |
|--------|-----------------------|----------------|
| "no evidence" vs "a prior" vs "recovery" | one field, entangled | three independent knobs |
| "default aggressively but recover cheaply" | **unreachable** | `(T low, R handoff, P …)` |
| Why the keep-vs-null debate stalled | unexplained | it was choosing corners with the wrong vocabulary |
| A new hub's routing posture | inherited by accident | three explicit enum/number choices |
| Measuring the policy | one fuzzy "directional" call | per-axis: T, R, P each measurable |

## What it buys us

- **The `defaultMode` debate becomes a non-question** — the field doesn't exist; you pick three values from a documented table.
- **New hubs can't get it wrong by accident** — the corner is explicit, not inherited from a neighbor.
- **Measurable per axis** — turns "directional-pending-measurement" into three things you can actually measure separately.
- **It's a lens, not a rewrite** — even if you never adopt the minimal router, `(T, R, P)` gives you the vocabulary to explain *why* the shipped keep-1/flip-4 verdict is right (those hubs sit at different, defensible corners).

## Risks, costs, open questions

- **Single-model inference.** This is one GLM lineage with **no live-router execution** — the whole frame needs its own dive + falsification against real hubs before it's load-bearing.
- **Migration is non-mechanical.** `defaultMode: X` is ambiguous between `(T low, R none)` and `(T low, R handoff)`, so no automatic codemod — each hub needs human classification.
- **The vocabulary table becomes load-bearing** (it's the only routing data left) — mitigated only if P = learned is trustworthy.
- **`bundleRules` relocation into R** is the fiddly part; the canon (`skill_smart_router.md`) touches every skill.

## Where it fits

- **Relative to the SOL seven:** it's the *policy* companion to **Idea 6** (which types the *decision*). **Idea 3**'s typed outcomes are the values R can take; **Idea 5**'s calibration is what T = `calibrated` means; **Idea 2**'s overlay is P = `learned`; **Idea 4**'s handoff is R = `handoff` *and* the training signal for P. In effect, (T, R, P) is the coordinate system the other ideas are points in.
- **Relative to Track B (shipped):** it *explains* Track B. The keep-1/flip-4 verdict = keeping sk-prompt at one corner and moving four hubs to another; (T, R, P) is why those are the right corners.

## What a 5-iteration deep-dive would investigate

*(This idea is not yet dived — this is the forward agenda, mirroring how the other seven started.)*

1. **Formalize the three axes** — exact value enums for T/R/P and the per-field mapping from today's `routerPolicy`.
2. **The conflation inventory** — prove, per hub, which current field encodes which axis and where they collide.
3. **The minimal-router shape** — a `(T, R, P) + vocabulary` schema, and what it deletes/relocates.
4. **Falsify across dissimilar hubs** — does the decomposition survive named-default, bundle, transport, and same-packet-mode hubs?
5. **The three-dimension read** — advisor integration (does Layer 0 carry the triple?), benchmark integration (can route-gold assert a valid `(T,R,P)` per hub?), and standalone-on-docs effectiveness (can an AI route off the triple + vocab table alone, with no advisor and no scorer?).
