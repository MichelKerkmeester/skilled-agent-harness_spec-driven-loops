# Idea 3 — Typed No-Destination Outcomes

> **"No clear route" isn't one thing. Stop collapsing it into a silent `null` or a guessed default — return a typed reason the system can act on.**

---

## TL;DR

When a request gives the router no clear signal, today it either points at a default child or defers with a bare `null`. But "no destination" actually hides several *different* situations, and other routing systems have known this for decades. This idea replaces the single `null` with a small set of **typed outcomes**, each carrying a reason:

- `idle` — there's genuinely no work to route.
- `no-match` — a real destination was sought and none qualifies.
- `dependency-failure` — a destination exists but its prerequisite is broken.
- `degraded-fallback` — everything is unhealthy, so we're deliberately (and *visibly*) routing to a fallback.
- `handoff-required` — this needs a different mode; hand it off (see Idea 4).
- plus `defer` / `clarify` for the "ask first" cases.

The insight came from comparing five systems that all face "nowhere obvious to send this": the OS scheduler's idle task, IP's "no route to destination," DNS's NXDOMAIN vs. server-failure, a load balancer's fail-open, and a human no-wrong-door desk. None of them uses one undifferentiated null — and neither should we.

## The problem today

- `defaultMode: null` says "defer," but it doesn't say *why*. Downstream, a bare null is easy to silently convert into "just use the default child" — which is exactly the guessing we want to stop.
- A genuine failure (a dependency is down) looks identical to "the user typed something ambiguous," even though they deserve completely different handling.
- There's no principled place to cache "we already determined this request has no route," so we may re-score the same dead end repeatedly.

## The idea

Make the router return a **typed control result** instead of null. Each outcome names its situation and carries a reason code, so the caller can do the right thing — abstain with an explanation, load the routing helper, trigger a handoff, or (only when explicitly safe) take a bounded fallback.

A default is still allowed — but only as an **explicit, capability-bounded route**, never as evidence manufactured from zero signal. And a fallback that fires because everything is unhealthy must be **visible** and is **forbidden for requests that can mutate state** (availability is no excuse for letting the wrong authority write).

## How it would work

```
request ── score ──► matched? ──yes──► route
                         │no
                         ▼
             classify the *reason* ──►  idle | no-match | dependency-failure
                                        degraded-fallback | handoff-required
                                        defer | clarify
                         │
                         ├─ each carries a reason code + policy identity
                         ├─ negative result may be cached (policy-hash + expiry keyed)
                         └─ mutation-capable request never takes a silent fallback
```

- **Classify, don't blank.** Every non-route is a typed outcome with a reason.
- **Cache negatives safely.** A "no route" can be remembered — keyed to the policy hash and an expiry, invalidated when policy changes — but a cached abstention never becomes a default child.
- **Fail-open is a policy, not a default.** Visible, reason-coded, and off-limits for mutations.

## Before vs after

| Situation | Today | With typed outcomes |
|-----------|-------|---------------------|
| Ambiguous request | `null` → maybe default child | `clarify` / `defer` with a reason |
| Genuinely no matching mode | `null` | `no-match` (reason-coded) |
| Prerequisite broken | looks like ambiguity | `dependency-failure` |
| Everything unhealthy | silent default or guess | `degraded-fallback`, visible, no-mutation |
| Needs another mode | default guess | `handoff-required` → Idea 4 |
| Repeated dead-end request | re-scored each time | policy-keyed negative cache |

## What it buys us

- **Failures stop masquerading as ambiguity** (and vice versa) — each gets correct handling.
- **The zero-signal state stays honest**: a default can't fabricate evidence out of nothing.
- **Safety on mutations**: no silent fallback can let the wrong mode write.
- A precise vocabulary that Ideas 4 (handoff) and 5 (negotiation) build directly on.

## Risks, costs, open questions

- More outcomes means more branches to handle — the router's callers must actually *use* the reasons, or the richness is wasted.
- Negative caching needs careful invalidation, or a stale "no route" outlives the policy that produced it.
- Open: the exact enum, the precise condition per outcome, and the route-gold fixtures that prove each one.

## Where it fits

- **Relative to Track B:** this *reframes what `null` means*. Track B flipped four hubs to `defaultMode: null`; this idea says that null should eventually become a *typed* defer with a reason. It refines, rather than reverses, what shipped.
- **Relative to sibling ideas:** it's the vocabulary layer under the "no clear route" family — Idea 4 (handoff) is literally the `handoff-required` outcome expanded, and Idea 5 (negotiation) is the `clarify` outcome expanded.

## What the 5-iteration deep-dive found

Five fresh-context iterations (gpt-5.6-sol, xhigh) answered all five charter questions and converged on one concrete design: **stop returning `null` — return a small closed set of typed results, and put the authority to act *inside* the result itself.** The router hands back one of three top-level decisions — `route`, `clarify`, or `defer` — and only `route` carries execution authority; `clarify` and `defer` always withhold it. That single move makes the dangerous states (a cached "defer" that still lets someone act, a "route" whose reason is `no-match`) impossible to even represent.

- **Two types, not one.** A *static* policy declaration (does this hub have no default, or one explicitly bounded candidate?) stays separate from the *runtime* control result the router returns per request. Request-time facts — health, cache state, reasons — never live in the static file.
- **The typed result.** `route` carries destinations, a selection kind (`single` / `orderedBundle` / `surfaceBundle`), a basis (`signal` / `bounded-default` / `degraded-fallback`), and a granted authority scope. `clarify` carries a bounded question and withheld authority. `defer` carries a reason (`idle` / `no-match` / `dependency-failure` / `handoff-required`), a typed recovery, and withheld authority.
- **A default is a guarded branch, never the final `else`.** A named default becomes a real `route(bounded-default)` only after a full nine-part proof (work exists, evidence puts the request in the hub, no decisive child signal, current policy/registry identity, full capability coverage, caller authority, fresh health, admissible effect/data class, typed consumer). The static name by itself supplies just *one* of those nine terms.
- **Fail-open is its own, stricter proof.** A `degraded-fallback` route needs a separate eight-part proof and is only ever allowed for read-only, non-destructive, non-messaging, non-secret requests — and only when the degradation is *visible* before it runs. Confirmation can't authorize it, and it is never cached.
- **Negatives can be cached, safely.** Only `clarify`/`defer` results cache — keyed by an opaque HMAC over the request facts plus every identity that could change the decision (policy hash, registry hash, detector set, and so on), with the reason stored in the *value*, never the key, and raw prompts/secrets excluded. There is no universal expiry; each entry dies at the earliest of its reason's cap and the evidence it rests on. Any miss, corruption, or cache outage simply triggers fresh routing.
- **Migration is dual-read, not flag-day.** A legacy `defaultMode: null` maps to `defaultRoute: {kind:"none"}`; a legacy *named* default maps to a "legacy-named" route that must earn certification — it is never silently upgraded to a bounded default. Typed results shadow the old ones until every caller is migrated.

### Three-dimension read

- **Advisor integration** — The Layer-0 system-skill-advisor becomes an *evidence supplier, not an authority*: it can provide hub membership, normalized request/effect/data facts, and candidate scores/conflicts (the "in-hub" and "no decisive child signal" terms of the default proof), but it never supplies the caller-authority term. Crucially, an advisor or scorer outage can't become a default edge — it yields a typed negative, not a guessed route.
- **Benchmark integration** — Route-gold owns the deterministic side: it authors the policy/registry/health snapshot and deep-compares the *whole* typed result — decision, basis/reason, destinations, recovery, and exact authority scope — not just the chosen mode. The dive recommends landing the full acceptance matrix as typed route-gold fixtures (a passing case *and* a falsifying case per proof term) before any authoritative migration, while preserving the old intent/resource fields so the legacy corpus still compares.
- **Standalone on docs alone** — The synthesis is deliberately narrow here: pure-document routing is *permitted only when the docs carry complete, current evidence for the same predicates*. SKILL.md and skill docs can satisfy the static terms (which hub, what capabilities, which effect/data class), but the request-time terms — fresh health, caller authority — can't come from a static file, so a docs-only AI must return a *visible typed negative* (`clarify`/`defer`) rather than guess a default. In short: effective for the static half of the decision, honestly incapable of the live half — and the design forces that gap to surface instead of hiding it.
