# Idea 2 — Replayable Correction Overlay

> **Let the router learn from its mistakes — but keep the learning in a separate, versioned, roll-back-able layer, so "what the router did last Tuesday" is always reproducible.**

---

## TL;DR

When the router picks the wrong mode and a human corrects it, we'd like it to get better over time. The danger: if corrections quietly rewrite the live routing rules, then replaying an old decision no longer gives the old answer — and the deterministic route-gold benchmark, which is the whole safety net, becomes meaningless. This idea adapts **without** that danger by splitting routing into two planes:

- **Serving plane** — an *immutable* base policy (a frozen file with a hash). Never edited online.
- **Learning plane** — a *candidate overlay* (also a file with a hash) trained from correction telemetry, tested in the shadows, and only ever activated by an explicit promotion step.

Every routing decision records *which base + which overlay* it used. So any decision is exactly replayable, and "rolling back" a bad learned change just means pointing at the previous overlay hash.

The pleasant surprise from the research: **the codebase already has most of this** — frozen live weights, an opt-in shadow comparison, and a bounded calibration proposal generator that refuses to auto-promote. What's missing is the immutable `(base, overlay)` identity that makes a learned candidate a *replayable snapshot* instead of live mutable state.

## The problem today

- We can't safely learn from corrections online, because mutating the serving policy breaks deterministic replay (and therefore route-gold).
- Correction telemetry is intentionally **prompt-free** (it stores "picked X, corrected to Y," not the prompt). That's good for privacy but means the telemetry alone can't be turned into a gold test set.
- So today, improving routing means a human edits rules and re-runs the benchmark — there's no principled adaptive loop.

## The idea

Two planes, connected only through an explicit gate:

- The **base policy** serves every request and never changes at runtime.
- An **overlay** is a small, bounded set of learned adjustments (weight/threshold deltas) with its own content hash. It is trained offline, compared in shadow mode against the base, validated on a held-out fixture, and **promoted only by an explicit governance action**.
- A decision records `basePolicyHash + overlayHash + featureSchemaVersion`, so it is reproducible forever.

## How it would work

```
corrections (prompt-free) ──► [learning plane] ──► candidate overlay.<hash>
                                                        │  bounded deltas only
                                     shadow compare ◄────┤
                                held-out validation ◄────┤
                                                        ▼
                              explicit promotion gate ──► active (base.<h1>, overlay.<h2>)
                                                                    │
        every decision logs (h1, h2, schemaVersion) ◄──────────────┘
        rollback = point at the previous overlay hash
```

- **Adapt** in the learning plane; **serve** from the frozen base + a promoted overlay.
- **Replay** any decision from its recorded hashes.
- **Roll back** by selecting the prior overlay hash — no "undo the learning," just "select the earlier snapshot."

## Before vs after

| Aspect | Today | With correction overlay |
|--------|-------|-------------------------|
| Learning from corrections | Manual rule edits | Bounded overlay, trained offline |
| Replay of an old decision | Safe (rules are static) | Still safe — decision records its hashes |
| Activating a change | Edit + re-benchmark | Explicit promotion of a hashed overlay |
| Rolling back a bad change | Revert edits by hand | Select the previous overlay hash |
| Online self-modification | Not allowed | Still not allowed — promotion is a gate |

## What it buys us

- A **principled adaptive loop** that never sacrifices deterministic replay.
- **Auditable governance**: every active policy is a `(base, overlay)` pair you can name, diff, and roll back.
- Reuses machinery that already exists (frozen weights, shadow sink, calibration reducer) rather than inventing a trainer.

## Risks, costs, open questions

- **Needs a curated fixture corpus.** Because telemetry is prompt-free, validating an overlay requires a separate, opt-in, privacy-reviewed routing fixture — that corpus doesn't exist yet.
- Bounds matter: delta caps, minimum sample counts, and exclusion of concentrated/unattributed samples, or the overlay overfits to a few loud corrections.
- Open: who owns promotion/rollback/retention, and what the exact overlay schema and held-out gate look like.

## Where it fits

- **Relative to Track B:** unrelated to the `defaultMode` flips; this is a new capability, not a reconciliation.
- **Relative to sibling ideas:** this sits *on top of* Idea 1 (compiled policy) — the "base" here is exactly that compiled artifact. Idea 5 (calibrated negotiation) supplies the calibration semantics the overlay would validate against. It is the only idea in the set explicitly about *learning*.

## What the 5-iteration deep-dive found

The dive ran all five iterations and converged on a **contract-level design** — the exact artifact shapes, boundaries, and rules — while being explicit that none of it has been built or shown to improve routing yet. Its biggest correction to the original sketch: an overlay should **not** be a mutable bag of learned deltas at all. It should be an **immutable, content-addressed snapshot** that a separate pointer switches on or off. "Learning" changes *which* snapshot is active; it never edits a live one.

Concretely, the dive pinned down:

- **Three immutable hashed artifacts + one mutable pointer.** A `base-policy`, a `candidate-overlay`, and a `promoted-overlay` are each frozen and named by a SHA-256 of their canonical bytes. Activation is a *separate* `(baseHash, overlayHash | null, generation)` pointer that only ever moves by compare-and-swap. Rollback is just pointing it at a retained earlier tuple — no "undo the learning."
- **An exact hash boundary (`overlay-canonical-json.v1`).** The dive spelled out what goes into the hash (sorted keys, "absent" written as `null`, set-like arrays deduped and sorted) and what must stay out (timestamps, file paths, signatures, the activation generation). Plain "JSON + SHA-256" was shown to be too loose to be reproducible across runtimes.
- **Three separate replay surfaces, each starting at a declared boundary.** *Decision replay* runs from a normalized `decision-feature-core` (captured after prompt-dependent extraction, before scoring) plus the policy tuple, and emits a canonical *decision receipt*. *Feature-extraction replay* is a separate consent-gated fixture proving the same features fall out of a raw prompt. *Document-only replay* runs off a printed policy card.
- **One request, one pinned tuple — revocation the sole exception.** A request locks its verified tuple before scoring, so generations never mix inside a single decision. A privacy/safety revocation is the only thing allowed to interrupt in-flight: it discards the overlay result and falls back to verified base-only.
- **Prompt-free corrections that can't be re-identified.** Accept/correct/ignore events join a decision only through an opaque random `decisionId`; they never store prompt text or a durable prompt key, so correction telemetry still can't be reconstructed into a gold set.
- **A fail-closed promotion state machine with real numbers.** Admit → shadow → replay → validate → privacy-validate → independent approval → mechanical CAS activation → monitor → rollback, with producer, approver, and activator kept as separate roles. The gates are conjunctive (aggregate gain can't paper over a safety/parity/per-skill regression) and carry an initial *versioned* policy — e.g. ≥8 samples per lane, correction concentration ≤0.60, weight-delta ≤0.03, threshold-delta ≤0.05, byte-identical repeated replay, and ≥2 points top-1 improvement.

The honest caveat the dive keeps repeating: this is the **blueprint, not the building**. The store, schemas, verifier, fixtures, and privacy ledger don't exist yet, and no candidate overlay has demonstrated a routing gain — so no improvement is claimed here.

### Three-dimension read

- **Advisor integration** — The Layer-0 system-skill-advisor shifts from "score and return" to "pin, score, and attest": read the activation pointer once, verify and pin exactly one tuple *before* extraction, wall off any shadow-candidate evaluation from the active result, bind the cache key to the full policy tuple (splitting a cached decision core from a fresh per-request receipt), and re-check revocation before committing. The dive found the advisor already has the right seams — fail-open paths, freshness/lane-health warnings, frozen shadow, a prompt cache — but not the overlay-aware receipt, tuple-bound cache, or closed warning taxonomy.
- **Benchmark integration** — Route-gold stays deterministic precisely because it never calls a live advisor: it replays the same state machine from immutable fixtures and checks that repeated runs produce byte-identical decision bodies (with `decisionId`, timestamps, and cache noise excluded from equality). It gains two lanes — decision-replay and feature-extraction — plus the versioned promotion gates, and a live advisor is demoted to an optional, separately-scored probe rather than an oracle. Private prompts and expected routes never enter public reports.
- **Standalone on docs alone** — With neither advisor nor benchmark, an AI routing purely off `SKILL.md` and a printed "resolved policy card" can still reproduce the decision: the card carries the effective weights/thresholds and the tie/fallback rules, and a seven-step manual trace turns normalized features into a route. But the ceiling is hard, and the dive is blunt about it — documents can make the procedure inspectable and repeatable, yet cannot attest that this policy is the one actually live, nor prove extraction identity, signatures, private gold, revocation, or any real-world gain. Every document-only result must be stamped `DOCUMENT_ONLY_UNATTESTED`.
