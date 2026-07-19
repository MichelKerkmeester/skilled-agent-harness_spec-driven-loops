---
title: "Implementation Summary: system-deep-loop Per-Hub Canary"
description: "Seven-mode no-collapse compiler, real route-gold proof, fenced activation, and byte-exact rollback evidence."
trigger_phrases:
  - "system-deep-loop canary implementation summary"
  - "deep-loop no-collapse results"
  - "system-deep-loop stage-4 handoff"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: system-deep-loop Per-Hub Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Correctness-hardened; Stage-4 phase-local canary gate GREEN; strict packet validation not run |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy; candidate remains shadow-only |
| **Strict validation** | Prohibited by the execution brief; `T024` remains blocked |

<!-- /ANCHOR:metadata -->
---

<!-- ANCHOR:what-built -->
## What Was Built

The phase now contains a zero-dependency compiler and canary for the real seven-mode
`system-deep-loop` hub. It reads the live authored registry, skill, leaf manifest, and document
router as immutable inputs, then emits a canonical `CompiledPolicyV1`, an advisor projection,
an explicit four-projection graph, typed route gold, a document-only policy card, and fenced
activation artifacts. Seven public modes remain seven destinations even though they share five
packets. The full identity includes the compound destination id, the authored optional runtime
discriminator, and the destination role (synthesis §§2.2, 7).

The compiler now rejects a missing authored public mode as `PUBLIC_MODE_MISSING` and a duplicate
as `PUBLIC_MODE_DUPLICATE` before full-tuple injectivity can mask the defect. The generated typed
route-gold artifact is built from live read-only hub observations and the canary sends the
persisted rows—not a recomputed projection—to the real scorer. Document replay consumes the same
prompt, constraints, explicit mode, and advisor fields as the machine request (synthesis
§§2.2–2.3, 8.2–8.3).

The two live collapse hazards are represented directly. The three improvement lanes retain
distinct `workflowMode` and `routingClass` values while sharing `deep-improvement` and
`improvement-host`. `review` and `alignment` retain separate packets while sharing the authored
runtime key `review`. The policy carries no composition rule, so every positive decision is
`single`; ambiguity clarifies once and zero signal defers with no target (synthesis §§2.3, 5.3).

### Files Delivered

| Area | Files | Purpose |
|------|-------|---------|
| Compiler/router | `lib/registry-compiler.cjs`, `lib/canary-router.cjs` | Registry-bound projections and typed decisions |
| Authority/card | `lib/execution-fence.cjs`, `lib/policy-card.cjs` | Destination-local COMMIT fence and document replay |
| Activation | `lib/activation-gate.cjs`, `activation/*.json` | Hard blocks, accepted candidate, retained prior, fenced state |
| Fixtures/harness | `fixtures/canary-cases.v1.json`, `harness/*.cjs` | Artifact generation and anti-hollow Stage-4 validation |
| Generated snapshot | `compiled/*` | Policy, advisor, projection graph, route gold, and policy card |
| Documentation | `spec.md`, `plan.md`, `tasks.md`, `checklist.md`, `implementation-summary.md` | Current status, evidence, verification, and limitations |

<!-- /ANCHOR:what-built -->
---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Compilation binds parsed inputs to the independently hashed authored bytes before building any
destination. A second compile from the same bytes must equal the generated canonical policy; a
caller object that differs from those bytes is rejected. `runtimeLoopType` is read verbatim. The
frozen policy schema represents a non-null value as `runtimeDiscriminator` and represents authored
`null` by omitting that optional field; the generated projection graph keeps the explicit `null`
so source semantics remain observable. A mutation fixture proves both directions rather than
inferring from `workflowMode` (synthesis §§2.2, 7, 10).

Public-mode cardinality is checked independently of the compound destination identity. The
duplicate-mode fixture changes `ai-council` to `research`, and the missing-mode fixture removes one
authored value; each runs through the complete authored-registry compile. The shared-packet and
runtime-key falsifiers likewise mutate authored registry rows before compiling, so removing either
guard changes an end-to-end result rather than an intermediate assertion.

The compatibility lane calls the live read-only `router-replay.cjs` producer for every positive
mode, persists those observations, and sends all eleven delivered rows to the real read-only
`evaluateRouteGold`. Row projection hashes and the acceptance digest bind the artifact. A
persisted row whose intent plus both hashes are coherently rewritten still fails the scorer as
`DELIVERED_ROUTE_GOLD_MISMATCH` with `intent-mismatch`. Negative decisions use the scorer's
established empty-intent convention, leaving the scorer and producer unchanged (synthesis §8.2).

The document-only lane reconstructs the full machine request from card data and supplied request
fields. Its fifteen parity cases cover the eleven authored route-gold cases plus explicit-mode,
clarification-constraint, dependency-constraint, and advisor-bearing requests. The constraint-only
negative uses the harmless prompt `unrelated orchard inventory` and still matches machine
`reject(forbidden)` (synthesis §8.3).

Activation snapshots all generated artifacts and the expected prior manifest. Ship checks the
prior generation/hash, acquires a token lock, advances and rechecks the fencing epoch immediately
before atomic rename, pins one generation per request, and CASes back to retained byte-identical
bytes. The drill is phase-local; no live router is flipped and legacy remains authoritative
(synthesis §§9–10).

<!-- /ANCHOR:how-delivered -->
---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Preserve one destination per authored mode | Packet and runtime keys are non-unique; only the compound identity plus runtime discriminator and role is safe (synthesis §§2.2, 7). |
| Reject duplicate or missing public modes before tuple checks | Full-tuple injectivity permits the same public mode when another discriminator differs; public-mode cardinality is a separate invariant (synthesis §§2.2, 7). |
| Represent authored `null` with the schema's absent optional discriminator | The frozen `CompiledPolicyV1` schema forbids a null `runtimeDiscriminator`; explicit null remains in the generated projection graph and is mutation-tested (synthesis §§7, 10). |
| Keep `compositionRules` empty | Deep-loop supports only `single`; ordered and surface bundles are activation failures (synthesis §§2.3, 5.3). |
| Preserve `routingClass` in the advisor projection | Alias behavior remains compatible while hash drift degrades to annotation-only and never rewrites a route (synthesis §§7, 8.2). |
| Score the delivered typed artifact | Live hub observations populate the persisted rows; the real scorer consumes those exact bytes after row-hash and acceptance-digest checks (synthesis §8.2). |
| Replay the full request from the policy card | Prompt-only replay cannot reproduce constraint- or explicit-mode-driven outcomes; document replay consumes every machine-request field without a machine fallback (synthesis §8.3). |
| Require destination-local VERIFY before COMMIT | Recommendation evidence cannot acquire effect authority; the only legal effect path is PREPARE→VERIFY→COMMIT (synthesis §§2.3, 9). |
| Retain legacy serving authority | This canary proves activation and rollback mechanics without widening scope to a live flip (synthesis §9). |

<!-- /ANCHOR:decisions -->
---

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Canonical compile | Pass | Seven destinations, seven distinct public modes, five packets, byte-identical recompile, source-object mismatch rejected |
| Public-mode uniqueness | Pass | Duplicate and missing authored values fail full compile as `PUBLIC_MODE_DUPLICATE` and `PUBLIC_MODE_MISSING` |
| Injective identity | Pass | Seven unique tuples in typed gold; planted tuple duplicate fails `DESTINATION_IDENTITY_COLLAPSE` |
| Shared-packet no-collapse | Pass | Authored-registry routing-class mutation fails full compile as `SHARED_PACKET_COLLAPSE` |
| Runtime-key no-collapse | Pass | Authored-registry packet merge fails full compile as `RUNTIME_KEY_COLLAPSE` |
| Runtime source | Pass | Authored non-null and null mutation fixtures propagate verbatim |
| Single-only selection | Pass | Seven positive routes are `single`; planted bundle fails `BUNDLE_EMISSION_FORBIDDEN` |
| Delivered route-gold | GREEN | 11/11 persisted rows pass real `evaluateRouteGold`; 7/7 positives come from live router output; coherent persisted tamper fails as `intent-mismatch` |
| Advisor guard | Pass | Live match may contribute; stale/absent/unavailable/drift cannot rewrite the route |
| No over-emission | Pass | Zero signal defers; ambiguity clarifies once; negatives have empty targets/observations |
| Full-request document parity | Pass | 15/15 match; constraint-only negative is `reject(forbidden)`; planted divergence rejected; terminal is document-only unattested |
| Authority lifecycle | Pass | COMMIT without READY fails; legal path exactly PREPARE→VERIFY→COMMIT |
| Aggregate hard blocks | Pass | Nine activation blocks plus direct structural refusals are driven |
| Rollback | Pass | Prior/restored hashes match; final fence epoch 2; mixed pins refused |
| Dual read | Pass | Seven modes/commands and advisor aliases resolve; unknown alias fails closed |
| Static constraints | Pass | Seven code files; zero external dependencies, name branches, or comment violations |
| Serving state | Pass | `legacy`, `shadowOnly: true` |

Protected inputs after the Stage-4 run:

- `router-replay.cjs`: `b039b8dd22dbfaaa91042f613998d54610080feadef6179362e0d01b83e8bedf`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `249be7c1cae9dcfe1faec8dcfc2965a0a0fc89e0af8e30bdd271625f300a6fde`
- `mode-registry.json`: `ce62a3ba8bacfb3d4c37e4e7ea5daf9e516f66a173ee935b99c313d8f781e79d`
- `SKILL.md`: `1dc9add8cde80d4d8231ad29f9332f2885fd6421d6f7f9219a36de574d7779b1`

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. This phase proves the Stage-4 canary but does not change live serving authority. The candidate
   manifest remains shadow-only and legacy remains authoritative.
2. The eleven-case route-gold fixture set covers all seven positive modes plus clarify, defer,
   prompt-driven reject, and constraint-driven reject. It is not an exhaustive natural-language
   corpus; four additional synthetic requests exercise full-request document parity.
3. Positive route-gold rows are checked against the live producer. Clarify and reject use the
   frozen scorer's empty-intent convention because the legacy producer may over-emit on ambiguity;
   their proof is structural plus real-scorer acceptance, not positive-route parity.
4. `validate.sh --strict` was not run because the execution brief explicitly prohibits it. Task
   `T024` remains blocked, so this report does not claim the packet-level strict-validation gate or
   the all-tasks completion criterion.
5. The compiled schema names the optional runtime field `runtimeDiscriminator`, not
   `runtimeLoopType`. The projection graph and policy card preserve the authored field name and
   explicit null; schema validation proves the canonical policy representation.

<!-- /ANCHOR:limitations -->
