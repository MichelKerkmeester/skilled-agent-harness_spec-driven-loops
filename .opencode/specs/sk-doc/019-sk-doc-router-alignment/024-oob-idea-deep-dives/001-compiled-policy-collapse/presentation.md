# Idea 1 — Compiled Policy Collapse

> **Stop hand-writing the router twice. Compile it once, from the registry, into one immutable file that both the live router and the offline test read.**

---

## TL;DR

Today a parent hub's routing lives in **two hand-authored places at once** — the keyword/resource tables inside `SKILL.md` (`INTENT_SIGNALS` + `RESOURCE_MAP`) and the generated `hub-router.json` / `mode-registry.json`. Those can drift apart, and a human has to keep them in sync. This idea keeps *all the information* but removes the *duplication*: a compiler reads the registry (the single source of truth for packets) and emits **one content-addressed policy file**. Layer 0 (the advisor) and the offline route-gold benchmark both read that same file. A small "resolver" still lives in each hub to load resources and enforce authority — but it no longer owns a second copy of the routing rules.

The research verdict is important and specific: **this is a semantic collapse, not a governance collapse.** You are not deleting routing or moving authority up to the advisor. You are deleting the *second hand-written representation of the same rules.*

---

## The problem today

- Routing is authored in prose tables **and** in JSON. Keeping them identical is manual work, and route-gold exists partly to catch when they drift.
- The same keyword lives in several spots, so a small change (rename a mode, add a trigger) means editing multiple files consistently — exactly the kind of edit that caused the over-emission bugs the fleet route-gold program just spent weeks curing.
- There is no single artifact you can hash and say "this **is** the routing policy, version abc123." The truth is spread across files.

## The idea

Introduce a **compiled policy**: one immutable, hash-addressed file that is *derived* from the registry, not authored by hand. Everything that decides a route reads it:

- The **advisor (Layer 0)** reads it to rank modes.
- The **offline route-gold** benchmark reads it to replay decisions deterministically.
- A thin **packet-local resolver** reads it to load the right resources and enforce each packet's tool/mutation authority.

The hand-authored `INTENT_SIGNALS` become *compiler input* (they define detectors); the `RESOURCE_MAP` becomes *registry + leaf-manifest selectors*. Nothing is lost — the duplication is.

## How it would work

```
mode-registry.json  ┐
hub-router.json     ├──► [compiler] ──► compiled-policy.<hash>.json  (immutable)
detector sources    ┘                        │
                                             ├──► Layer 0 advisor  (rank modes)
                                             ├──► route-gold        (deterministic replay)
                                             └──► thin hub resolver (load + enforce authority)
```

1. **Compile.** A compiler turns the current registry/router pair into one canonical snapshot. Its hash is computed over canonical serialization + compiler/detector versions, so the same inputs always produce the same policy id.
2. **Keep the old router as an oracle** during migration: run both, compare every decision, and **fail closed** on any drift (missing mode, changed bundle order, unresolved resource, authority mismatch).
3. **Thin resolver stays local.** The hub still validates the chosen mode, loads packet resources, applies defer behavior, and enforces authority — but it reads them *from the compiled policy* instead of re-declaring them.

## Before vs after

| Aspect | Today | With compiled policy |
|--------|-------|----------------------|
| Where routing rules live | Prose tables **and** JSON, hand-synced | One compiled file, derived from the registry |
| Keeping them in sync | Manual, gated by route-gold | Impossible to desync — there is one representation |
| "What is the policy version?" | No single answer | A content hash |
| Advisor vs offline test | Read different-shaped inputs | Read the *same* artifact |
| Authority / resource loading | Hub owns a second copy | Hub resolver reads it from the policy |
| Changing a mode | Edit several files consistently | Edit the registry; recompile |

## What it buys us

- **One source of truth** with a version you can hash, pin, and roll back to.
- **Drift becomes structurally impossible** instead of merely caught after the fact.
- **Determinism for free**: the same compiled policy guarantees byte-identical offline replay — the property route-gold already depends on.
- A clean foundation for every *other* idea in this set (the typed contract, the overlay, the proof) — they all want a single content-addressed policy to bind to.

## Risks, costs, open questions

- **The compiler is now load-bearing.** A compiler bug silently corrupts routing — hence the "old router as oracle + fail closed" migration.
- Some hubs (like `sk-code`) return *ordered bundles* (a workflow plus read-only surfaces); the compiled policy must preserve target roles and order, not just "mode → packet."
- Metadata-only modes have no advisor identity today; the compiler must not accidentally make evidence packets independently routable.
- Open: the exact schema, the exact hash inputs, and the migration order that keeps advisor projections, route-gold fixtures, and packet contracts working throughout.

## Where it fits

- **Relative to what we shipped** (Track B — flipping four hubs to `defaultMode: null`): that was a config reconciliation *within* today's two-file model. This idea changes the model itself. It is a bigger, later, gated step — not a contradiction of Track B.
- **Relative to sibling ideas:** this is the *foundation layer*. Idea 6 (minimal typed contract) defines the *shape* of what the compiler emits and the decision consumes; Idea 2 (correction overlay) layers learning *on top* of the compiled base; Idea 7 (proof-carrying commit) binds its proofs to this policy's hash.

## What the 5-iteration deep-dive found

The five passes turned the sketch into a concrete, testable design — and changed one important assumption along the way. The headline verdict: **the collapse is real and worth doing, but it's "ready for an implementation spike, not a production cutover."** It holds up as a *semantic* collapse (delete the duplicate rules, keep local enforcement), and the dive pinned down the schema, the compiler behavior, and the migration — while surfacing a migration trap that turns "flip one pointer" into a genuine transaction problem.

Concretely, the dive converged on:

- **One content-addressed policy file with a defined shape.** A normalized decision contract carrying the detectors, modes, composition rules, resource routes, resource admissions, an advisor projection, and a human view — all pinned by a `policyHash` computed over canonical JSON plus the compiler / schema / detector-semantics versions (never timestamps or paths). The same inputs always produce the same policy id.
- **Detectors and bundles must stay "shaped."** Two real hubs broke the naive design: `mcp-figma` uses per-keyword weights, and `sk-code` returns ordered bundles (a workflow plus read-only surfaces). So detector kinds are discriminated (keyword-tuples vs vocabulary-classes) and composition is role- and order-aware — a supporting surface can never become an independently routable primary.
- **A fail-closed compiler.** It reads today's registry / router / resource / manifest files, validates them against a typed error taxonomy (bad schema, duplicate modes, illegal composition, escaping resources, authority contradictions…), and publishes *nothing* on any hard failure.
- **Layer 0 carries identities and evidence, never authority.** The advisor's routing plan contains no file paths, tools, or mutation permissions; the thin hub resolver re-derives all authority locally from the compiled policy and packet contracts, so a stale or tampered plan can't widen what a packet is allowed to do.
- **The key decision — activation is a transaction, not a rename.** Content-addressing plus a mutable pointer does *not* make cutover atomic if the machine policy, the advisor projection, the benchmark identity, and the human-readable `SKILL.md` fence can each advance on their own. The dive's central correction: bind all four to **one regular-file activation selector**, flipped with a fenced compare-and-swap (token lock + fencing epoch, checked against the current hash immediately before the rename). Two independent renames are not one transaction.
- **Migration is six gated phases** — baseline freeze → compile candidates → shadow (old router stays authoritative, compare every decision) → canary → atomic cutover → reversible bake — with rollback that selects a *retained, verified-compatible* published generation and never recompiles old sources.

### Three-dimension read

- **Advisor integration** — The compiler emits the advisor's projection from the *same* normalized snapshot and binds it to `policyHash`, so the advisor stops independently reshaping the registry and instead consumes a projection whose identities are a closed subset of the compiled ones. Projection drift or a missing projection blocks *promotion* of a new policy, but a stale/absent/unavailable advisor at runtime just degrades to empty evidence — local routing continues on the last-known-good policy and is never rewritten by recommendation strength.
- **Benchmark integration** — Route-gold reads the same compiled file, which is exactly what makes replay deterministic: identical semantic inputs compile to byte-identical policy bodies and hashes. During migration a dual-run adapter compares legacy vs compiled on a *semantic* parity matrix (legacy stays authoritative and a mismatch never auto-updates the gold baseline); strict byte-for-byte equality only becomes a gate once both lanes call the same compiled evaluator, and a disabled or zero-row benchmark counts as missing evidence that freezes promotion.
- **Standalone on docs alone** — This is the most caveated dimension, and the dive is honest about it: the collapse helps a docs-only reader (an AI routing purely off `SKILL.md`) *only if* the human view stays behaviorally complete — exposing detector terms and weights, the ambiguity/default/defer rules, primary/support roles and bundle order, the mode-to-resource mapping, the authority references, the exact hashes, and a safe defer for unknown versions. A matching `humanViewHash` is explicitly *not* enough (a generator can hash an incomplete view perfectly), so correctness leans on behavioral document-only replay through a human parse/replay lane that can never silently fall back to the machine policy.
