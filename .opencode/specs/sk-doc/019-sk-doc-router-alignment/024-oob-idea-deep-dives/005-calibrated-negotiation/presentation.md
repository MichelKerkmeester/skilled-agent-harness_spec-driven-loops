# Idea 5 — Calibrated One-Turn Routing Negotiation

> **The router's "confidence" is a ranking number, not a probability. Stop pretending it means "80% sure" — and when the router isn't sure, ask exactly one well-formed question, under a hard budget.**

---

## TL;DR

The advisor already emits a `confidence` value, and it's tempting to read it as "there's an X% chance this route is right." The research is blunt: it isn't. It's a bounded ranking heuristic built from floors, bonuses, and evidence counts — useful for *ordering* options and deciding *whether to abstain*, but it has **no calibrated meaning** until it's validated against real outcomes.

So this idea makes the route contract honest:

- **Always** expose `rankScore` and `scoreMargin` (the gap to the runner-up).
- Expose an actual `estimatedError` (a real probability) **only** when a validated held-out corpus backs it. Until then, probability language is simply forbidden.
- Frame the whole decision as **selective classification**: auto-route when you're safely above a *validated* risk budget; otherwise ask **one** typed clarification question; if it still fails, defer or reject.
- Put a **hard friction budget** on that question: one turn, at most three options plus "none of these," at most two attempts, a 256-token card.

## The problem today

- A ranking score gets casually treated as a probability, which can justify auto-routing that isn't actually safe.
- There's no single, honest contract for "how sure are we, and what do we do about it."
- The "just pick the highest score" instinct has no risk budget behind it.

## The idea

Separate three things that are currently blurred:

1. **Ranking** — order the candidate modes (`rankScore`, `scoreMargin`). Always available.
2. **Calibration** — a *validated* probability of correctness (`estimatedError`). Available only with corpus-backed proof; otherwise `status: unvalidated` and no probability claims.
3. **Control** — a selective-classification policy: auto-route under a validated risk budget, else one bounded clarification, else defer/reject.

## How it would work

```
score ──► rankScore + scoreMargin  (always)
             │
   calibration validated? ──yes──► estimatedError available
             │no  → status:unvalidated (no probability language)
             ▼
   selective controller:
     rankScore safely over validated risk budget? ──► auto-route
     else ──► ONE typed clarification (≤3 options + none_of_these, ≤256 tokens)
                 └─ still failing after rescoring? ──► defer | reject
```

The interaction budget ships as **replayable assertions** (you can test "did it ask at most once, with at most three options"). The *risk threshold* cannot ship until a held-out corpus proves the chosen coverage/risk trade-off — no fleet-wide magic number.

## Before vs after

| Aspect | Today | With calibrated negotiation |
|--------|-------|------------------------------|
| What "confidence" means | Read loosely as a probability | `rankScore` (ranking) vs validated `estimatedError` (probability) |
| Auto-route decision | "highest score wins" | Under a *validated* risk budget |
| When unsure | Default or bare defer | One typed clarification, then defer/reject |
| The clarifying question | Ad hoc | Hard budget: 1 turn, ≤3 options, ≤256 tokens |
| Thresholds | Hand-set | Promotable only from held-out risk/coverage evidence |

## What it buys us

- **Honesty about certainty** — no more treating a ranking number as a probability.
- **A principled abstain/ask/route decision** grounded in selective classification.
- **Bounded, testable interaction** — the clarification can't sprawl.
- One controller that unifies the three hub archetypes *at the action boundary* without pretending their evidence channels are interchangeable.

## Risks, costs, open questions

- The payoff threshold (the risk budget) **can't be set without a held-out corpus** — which doesn't exist yet. Until then this is a contract, not a tuned system.
- Asking a clarification adds a turn; the budget bounds it, but acceptability still needs measurement.
- Open: the exact schema, and the metrics (coverage, selective risk, option recall, clarification resolution) that would justify a threshold.

## Where it fits

- **Relative to Track B:** complementary — Track B decided *whether* a hub leans to a default; this decides *how sure* a route is and what to do when it isn't sure.
- **Relative to sibling ideas:** it's the `clarify` outcome from Idea 3 fully expanded, shares the one-turn budget with Idea 4 (handoff), and supplies the calibration semantics that Idea 2 (overlay) would validate against.

## What the 5-iteration deep-dive found

The dive converged on a concrete, contract-level design — it deliberately stopped short of picking thresholds, a calibration method, or labelling a corpus, but it settled the shape of everything else. The load-bearing move: split one overloaded "confidence" number into three separate contracts, and check authority *before* any of them.

- **Three separated contracts.** *Ranking* (`rankScore`, `scoreMargin`) is ordinal and only comparable inside one pinned policy/candidate snapshot. *Calibration* (`estimatedError`, `riskUpperBound`, `confidenceLevel`) exists **only** when a matching, non-stale validation certificate backs it — otherwise those fields are simply absent, never zero or null. *Decision* carries the chosen `action`, `decisionBasis`, `routeId`, `reasonCode`, and evidence tier.
- **A selective controller with four terminal actions** — `auto_route`, `clarify`, `defer`, `reject`. Eligibility and authority are checked *before* ranking; auto-route needs exactly one eligible candidate with a permitted basis (deterministic exact authority, or a validated risk bound within budget). `defer` is recoverable abstention; `reject` is forbidden/invalid input — and they stay distinct.
- **A hard, replayable clarification budget** — one typed question, one property (a flat `routeChoice` enum), at most three candidates plus `none_of_these`, ≤256 tokens under a pinned tokenizer, and exactly one accepted-answer rescore before a typed terminal. Any overflow defers before it's ever shown.
- **Five evidence tiers** — `A_CALIBRATED`, `B_RANK_ONLY`, `C_BENCHMARK_ONLY`, `D_DOCUMENT_ONLY`, `E_UNAVAILABLE` — each with its own serving authority, stamped onto every decision so you always know what the route was allowed to claim.
- **Promotion governance, not a magic number.** Three disjoint data splits (calibration-fit / operating-point / sealed promotion-test), per-slice certificates, joint selective-risk *and* coverage gates, and immutable promotion records. Online feedback stays shadow-only; no single fleet-wide threshold.
- **The key decision:** keep ranking, calibration, and authority as separate contracts, and let authority/eligibility gate the candidate set before the scorer runs — then revalidate at the destination just before the effect. A default is a prior and a detected surface is evidence; neither is ever permission to route.

### Three-dimension read

- **Advisor integration** — The advisor stays an *optional ranking adapter with no execution authority*: it supplies ordinal rank evidence, ambiguity/abstention signals, and lane health, and the dive maps its current `confidence` to `rankScore` and its `uncertainty` to `abstentionPressure` (old fields kept only as deprecated aliases). An adapter validates advisor freshness/trust and discards `_shadow` recommendations for serving; the top tier `A_CALIBRATED` requires a live trusted advisor snapshot *plus* a matching validated certificate.
- **Benchmark integration** — The benchmark is the evidence-and-promotion plane, and route-gold grows into action-gold: fixtures must pin eligible candidate IDs, action, reason code, evidence tier, decision basis, snapshot hashes, the exact clarification card, and budget counters. Deterministic mode asserts byte-identical policy behavior, structural hashes, and every state transition (the determinism guarantee), while live mode measures option recall and clarification acceptance; promotion needs both and benchmark-only evidence (tier C) carries no serving authority.
- **Standalone on docs alone** — This is well covered as tier `D_DOCUMENT_ONLY`: with valid SKILL.md and registry docs and no advisor or benchmark, an AI can still enumerate and filter routes, take deterministic exact-direct-route authority, resolve bundles, generate a bounded clarification card, and explain defer/reject honestly. What it *cannot* do is estimate observed correctness or promote a risk threshold — documents declare policy but never measure it — so document-only routing is genuinely useful for direct routes, bounded clarification, and honest deferral, just never for a calibrated "how likely am I right" claim.
