---
title: "Implementation Summary: system-deep-loop Per-Hub Canary"
description: "Seven-mode no-collapse compiler, compatibility-projector route-gold split, fenced activation, and byte-exact rollback evidence."
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
| **Status** | Route-gold fully `real-green`; Stage-4 canary eligible in shadow-only mode |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy; candidate remains shadow-only |
| **Strict validation** | Pending final rerun after documentation reconciliation |

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
as `PUBLIC_MODE_DUPLICATE` before full-tuple injectivity can mask the defect. It also compiles 584
manifest-aware typed leaf identities from the immutable leaf manifest. The authored surface map is
compiled into seven mode selections totaling 19 typed leaf pairs, and every pair must resolve back
to one of those identities before the snapshot exists. The generated typed route-gold artifact
comes only from the frozen compatibility projector applied to each typed decision, the compiled
policy, and the selected compiled identities; no resource is invented or copied from the legacy
router (synthesis §8.2, §3 Ideas 1 and 6). Document replay consumes the same prompt, constraints,
explicit mode, and advisor fields as the machine request (synthesis §§2.2–2.3, 8.2–8.3).

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

The compatibility lane compiles each surface-map resource into a typed pair by matching both its
target `workflowMode` and packet-qualified resource string against the 584 compiled manifest
identities. A route decision selects the compiled pairs for its target modes and passes them to the
frozen `projectToRouteGold`; negative decisions select none. All eleven delivered observations
reach the real read-only `evaluateRouteGold` and all eleven are real green, including all seven
positive modes. `single-research` proves the same canonical resource bytes at the compiled-pair
lookup, projector output, and scorer input boundaries. A persisted `single-research` row whose
resource and both hashes are coherently rewritten fails as `DELIVERED_ROUTE_GOLD_MISMATCH` with
`resource-mismatch`. No legacy prompt router or resource producer is called or used as a backfill
(synthesis §8.2).

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
| Score the delivered typed artifact without legacy backfill | The frozen compatibility projector populates persisted observations from typed decisions and compiled manifest identities; real scoring then distinguishes `real-green` from `shadow-partial` (synthesis §8.2, §3 Ideas 1 and 6). |
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
| Delivered route-gold | Pass | Real `evaluateRouteGold` scores 11/11 projector observations `real-green`, 0 are `shadow-partial`, and coherent persisted resource tamper fails as `resource-mismatch` |
| Advisor guard | Pass | Live match may contribute; stale/absent/unavailable/drift cannot rewrite the route |
| No over-emission | Pass | Zero signal defers; ambiguity clarifies once; negatives have empty targets/observations |
| Full-request document parity | Pass | 15/15 match; constraint-only negative is `reject(forbidden)`; planted divergence rejected; terminal is document-only unattested |
| Authority lifecycle | Pass | COMMIT without READY fails; legal path exactly PREPARE→VERIFY→COMMIT |
| Aggregate hard blocks | Pass | Nine activation blocks plus direct structural refusals are driven; the real-green canary is eligible while serving authority remains legacy/shadow-only |
| Rollback | Pass | Prior/restored hashes match; final fence epoch 2; mixed pins refused |
| Dual read | Pass | Seven modes/commands and advisor aliases resolve; unknown alias fails closed |
| Static constraints | Pass | Seven code files; zero external dependencies, name branches, or comment violations |
| Serving state | Pass | `legacy`, `shadowOnly: true` |

Protected inputs after the Stage-4 run:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`
- `mode-registry.json`: `a26e9ebd5a3a10f29ff56833420cc484de53fdc074b35d943214788f627d3b8e`
- `SKILL.md`: `59fa841a3dc0b85c0c01d87b2aa292b7209597f41d933826f69b87447c0b30dd`

<!-- /ANCHOR:verification -->
---

<!-- ANCHOR:limitations -->
## Known Limitations

1. The Stage-4 canary is real-green, but no serving activation was performed. The candidate manifest
   remains shadow-only and legacy remains authoritative by scope.
2. The eleven-case route-gold fixture set covers all seven positive modes plus clarify, defer,
   prompt-driven reject, and constraint-driven reject. It is not an exhaustive natural-language
   corpus; four additional synthetic requests exercise full-request document parity.
3. The compiled surface map selects the fixed per-mode leaf sets authored in `smart-routing.md`.
   It does not add a new within-mode natural-language selector; changes to those leaf sets require
   authored map and manifest updates followed by recompilation.
4. Strict packet validation is pending the final reconciled document state, so this report does not
   yet claim that gate.
5. The compiled schema names the optional runtime field `runtimeDiscriminator`, not
   `runtimeLoopType`. The projection graph and policy card preserve the authored field name and
   explicit null; schema validation proves the canonical policy representation.

<!-- /ANCHOR:limitations -->
