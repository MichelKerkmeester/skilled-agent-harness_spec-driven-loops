# Idea 6 — Minimal Typed Router Contract

> **`defaultMode` hides three different things in one field: "no evidence," "a policy prefers this," and "go execute this." Split them into a typed decision, and the mystery field disappears.**

---

## TL;DR

This is the idea that names the *root* problem. `defaultMode` is convenient but dishonest: a single field can silently mean "we found no discriminating evidence," "policy leans toward this child," **and** "execute this child" — and you can't tell which, or when irreversible authority was actually acquired. The fix isn't a better default value or a confidence number bolted on; it's a **typed decision** that makes the outcome explicit:

```
outcome ∈ single | orderedBundle | surfaceBundle | clarify | defer | reject
```

Around that decision sits the smallest contract that still preserves all of today's information: **RouteRequest** (facts extracted from the request) + **CompiledPolicy** (the content-addressed policy from Idea 1) + **RouteDecision** (the typed outcome with ordered targets, evidence, alternatives, and replay hashes). The two hand-authored maps (`INTENT_SIGNALS`, `RESOURCE_MAP`) collapse into *compiled detectors* and *registry/leaf selectors* — no duplication, no lost meaning.

The research earned this the hard way: it tried smaller contracts and **falsified** them against two very different hubs. `sk-code` needs *ordered bundles* (a workflow then read-only surfaces), so "one capability → one mode" loses information. `system-deep-loop` has *three public modes sharing one packet*, so "packet path = capability" is wrong. The minimal contract is exactly what survives both.

## The problem today

- `defaultMode` conflates missing evidence, a prior, and an action — so you can't observe *when* the router commits to executing something.
- The routing information is spread across parallel hand-authored structures that must be kept consistent.
- There's no single typed answer that says "here's the outcome, here are the ordered targets, here's the evidence, here's how to replay it."

## The idea

Three small pieces:

- **RouteRequest** = an optional explicit mode hint + typed *facts* (intent, surface, lifecycle, capability, mutation/risk).
- **CompiledPolicy** = the content-addressed policy: modes (each with packet, role, backend, authority ref, resource selector), the detectors that turn raw input into facts, and bundle constraints.
- **RouteDecision** = a typed `outcome`, an ordered list of `targets` (each with a role), the `evidence`, the `alternatives`, and the `replay` hashes.

A `modeId` plus the policy hash *derives* packet, backend, authority, and default resources — so the decision carries references, not copied contracts.

## How it would work

```
raw request ──[compiled detectors]──► RouteRequest.facts
                                          │
                     CompiledPolicy ──────┤
                                          ▼
                                    RouteDecision {
                                      outcome: single | orderedBundle | surfaceBundle
                                             | clarify | defer | reject
                                      targets: [{ modeId, role, leafResourceIds }]
                                      evidence, alternatives,
                                      replay: { policyHash, factSchemaHash, normalizedFacts }
                                    }
```

`modeId + policyHash` derives packet path, default resources, backend, and authority — none of that is copied into the decision.

## Before vs after

| Aspect | Today (`defaultMode`) | With typed contract |
|--------|----------------------|---------------------|
| "No evidence" vs "prior" vs "execute" | One field, indistinguishable | A typed `outcome` names it |
| Ordered bundles (workflow + surfaces) | Implicit in hub logic | First-class `targets[]` with roles |
| Same-packet public modes | Ambiguous by packet path | Distinct `modeId`s |
| Routing rules | Two parallel hand-authored maps | Compiled detectors + registry selectors |
| Replay | Depends on static files matching | `replay` hashes on the decision |

## What it buys us

- **The commitment becomes observable** — you can see exactly when the router chose to execute versus defer versus clarify.
- **All information preserved, duplication removed** — the two maps collapse without losing bundle roles or same-packet modes.
- **A machine-checkable shape** route-gold can assert against, with static fields recoverable from the policy hash.

## Risks, costs, open questions

- It's a contract change that touches how every hub expresses a route; adoption is a migration, not a flag flip.
- The falsification so far covers two hubs; **other archetypes** (named-default, transport, complex leaf-resource hubs) still need testing and may add a field.
- Open: the finalized schema and the proof that every omitted static field is recoverable from the policy hash.

## Where it fits

- **Relative to Track B:** this *explains* Track B. The `defaultMode: null` flips were the pragmatic move; this idea articulates why the field was a smell in the first place.
- **Relative to sibling ideas:** it is the *shape* that Idea 1 (compiled policy) emits and consumes; its `clarify`/`defer`/`reject` outcomes are Ideas 5/3; its `orderedBundle` targets are what Idea 7 (proof) prepares and commits.

## What the 5-iteration deep-dive found

Five iterations (`cli-codex / gpt-5.6-sol / xhigh`) treated the seed's three objects as *hypotheses* and tried to shrink or break them against the real repo — `sk-prompt`'s named default, the executor and transport hubs, `sk-doc`'s 139-leaf inventory, the advisor, and Lane-C's gold. The three objects survived, their fields got pinned down, and the biggest open question — what `defaultMode` should actually *become* — got a clean answer. The converged design:

- **Three public objects, now with fields.** `RouteRequestV1` is an immutable snapshot: a fact-schema hash, an optional `explicitMode` (kept separate because commands take precedence, not just extra weight), and a list of atomic `facts` (each with polarity, source, and an evidence pointer). `RouteDecisionV1` carries the outcome, ordered `targets` (each with a role and its exact leaf ids), evidence, alternatives, and replay hashes — and the negative outcomes can't hide: `single`/`orderedBundle`/`surfaceBundle` always have ≥1 target, while `clarify`/`defer`/`reject` have no targets and *must* carry a control block with a reason, so the three "no route" cases never blur into one empty list.
- **One graph, not two maps.** `INTENT_SIGNALS` and `RESOURCE_MAP` collapse into a single content-addressed `CompiledPolicyV1` graph with six jobs: detectors emit facts, mode rules say which facts make a mode eligible, leaf selectors pick the exact leaves a chosen mode returns, bundle rules order multi-target roles, mode entries derive packet/backend/authority refs, and source digests bind every generated view. It's a semantic merge — detection and resource-picking are preserved, not deleted.
- **The key decision: defaults stop being selections.** A named default (like `sk-prompt`'s) becomes a bounded *prior* that can only re-rank an already-eligible candidate or become a defer-time recommendation — it can never create eligibility or invent a fact. Contextual defaults are just ordinary detector facts; when the signal is missing or stale the answer is `clarify` or `defer`, never a silent pick. That is exactly what makes the hidden commitment observable.
- **The compiler is total and fail-closed.** It parses every authored source, validates totality/containment/ownership/order, hashes once, then emits read-only projections; on any gap (`UNBOUND_DETECTOR_FACT`, `UNREACHABLE_MODE`, `ORPHAN_SELECTOR`, …) it publishes nothing rather than a partial policy.
- **The detection boundary is five families, and it's irreducible.** Explicit/command intent, lexical meaning + negation, repository/surface context, runtime/executor capability, and provider/session/auth state. Compilation can version the matchers but can't remove these observations without smuggling in hidden runtime state — and falsification across all five archetype families (named default, executor, transport, cross-hub bundle, huge leaf inventory) added *zero* new public fields.
- **Deterministic gold.** `RouteGoldV1` pins a policy plus a frozen detector fixture and asserts the exact request and decision (order, roles, evidence, replay hashes) with no scoring tolerance; the old benchmark's intent/resource expectations become compatibility views *generated* from the typed gold, never hand-authored.

### Three-dimension read

- **Advisor integration** — The compiler emits a read-only `AdvisorProjectionV1` (hub id, policy hash, modes, projection hash) that advisor recommendations must match. A local adapter turns an advisor recommendation into an ordinary `sourceKind=advisor` fact, pinned to the policy hash and discarded if stale; score/confidence stay as evidence metadata and grant no route authority. So the Layer-0 system-skill-advisor becomes one *optional* detector feeding facts — the local evaluator stays the decision-maker — generalizing today's registry projection-hash drift guard.
- **Benchmark integration** — Lane-C replay loads a pinned `CompiledPolicyV1`, runs a frozen detector fixture to get the request, and compares the result to typed `RouteGoldV1` with *exact* equality — no tolerance, because the output is deterministic. Today's `expected_intent` / `expected_resources` / leaf-pair gold become compatibility views generated from the typed gold, and the legacy router-replay stays a shadow oracle until typed parity is clean; the existing five-class error taxonomy is reused with an added stage field.
- **Standalone on docs alone** — Honestly the weakest leg. Without the compiled bytes and a matching policy hash, an AI reading only `SKILL.md` and skill docs (helped by a generated human-readable policy card of fact cues, mode predicates, bounded recommendations, outcomes, and required preflight) can produce a *transparent, reasonable proposal* and know what to check — but not a replay-verifiable decision. The synthesis is explicit that this path is provisional and must be labeled document-derived, with the destination packet still read before any action.
