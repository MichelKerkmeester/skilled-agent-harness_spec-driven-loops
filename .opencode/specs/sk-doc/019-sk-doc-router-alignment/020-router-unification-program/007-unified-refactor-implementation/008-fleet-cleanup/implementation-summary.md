---
title: "Implementation Summary: Fleet Legacy-Read Cleanup"
description: "Delivered a terminal cleanup contract with external readiness, ordered per-skill deletion, real route-gold, fenced rollback, vocabulary-free hot card, and frozen final state."
importance_tier: "critical"
contextType: "implementation"
status: "implemented-contract"
---
# Implementation Summary

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|---|---|
| Delivery status | Cleanup contract and phase-local artifacts implemented and validated |
| Serving result modeled | Compiled `EffectivePolicy` is the sole resolver after four ordered deletions |
| Live mutation | None; live skills, registries, manifests, routing config, and scorers remain unchanged |
| Runtime dependencies | Node built-ins plus frozen local compiler, canonical, fence, projector, and scorer contracts |
| Final manifest SHA-256 | `062261a3e4746064d2951f7ed34efbaeac5d74e30bc531d97d51f7f6be72fa73` |
| Migration gate | Stage 7 contract validated with retained generations and failure-driven gates |
| Route-gold | 26 total per-deletion rows green through the real read-only `evaluateRouteGold` |
<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Built

The phase now contains a cleanup library whose deletion operation is
parameterized only by `skillId`. The initial modeled selector is derived from
four externally proven compiled policy pins and an issued preflight capability.
Each deletion removes one resolver entry, registry adapter, and compatibility
vocabulary set in the activation order `mcp-code-mode → sk-code →
system-deep-loop → mcp-tooling`. Candidate generation, preimage comparison,
retention, fenced replacement, route-gold decision, and rollback all use one
code path. N=1 therefore differs only by cardinality and empty collections,
matching synthesis §5.2 and §5.3.

The final phase-local manifest records generation 8, all four retired skill
IDs, empty legacy collections, compiled serving authority, and
`resolver:"EffectivePolicy"`. It is canonicalized by the committed serializer
and frozen as `compiled/final-manifest.json`. The regenerated
`compiled/PolicyCardV1.md` binds all four compiled snapshot identities, carries
no compatibility vocabulary array, and encodes zero signal as
`defer(no-match)` with an empty union. This applies synthesis §8.3 and §10
without inventing a fallback.
<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How Delivered

The preflight executes the committed singleton compiler/rollback harness, the
committed execution-plane harness, and all three committed parent-hub canary
harnesses. It reads their committed acceptance records and activation
manifests, confirms candidate tuple identity, real route-gold, rollback, and
PREPARE/VERIFY/COMMIT evidence, and confirms legacy remains serving-authoritative
before cleanup. Only then does `assertFleetReady()` issue an in-process token.
Changing an external receipt to red blocks the token, deletion without the
token fails, and a source mutant with that guard removed proceeds. Readiness is
therefore not a cleanup-owned boolean.

Every deletion retains the exact current bytes before swapping. The file swap
uses an exclusive token lock, the committed fence-state serialization, complete
manifest preimage equality, temp writes, fsync, and rename. Route-gold runs
after the candidate is selected. N=1 calls the committed compiler and
compatibility projector directly; parent rows come from their committed canary
projectors. All observations are then scored by phase-002's write-denying
subprocess around the real exported `evaluateRouteGold`. A corrupted
observation returns red and causes a second fenced swap to retained bytes.

The card and final manifest are generated in memory from the same compiled
snapshots and terminal selector, then compared byte-for-byte with the checked-in
phase artifacts. Planted final drift, retained compatibility vocabulary, and a
default union all reject. The zero-signal replay reaches the compiled N=1 policy
and emits only typed `defer(no-match)`.
<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Decisions

- Fleet readiness comes from committed external gate execution and committed
  candidate/manifest bytes, not from a fixture flag. This preserves the staged
  authority model and gate order in synthesis §9.
- The singleton readiness receipt combines the committed N=1
  compiler/activation rollback proof with the committed execution-plane
  single-leg PREPARE/VERIFY/COMMIT proof. No standalone N=1 parent-hub canary
  artifact exists; both external receipts are mandatory.
- The deletion driver has one data-driven order and one algorithm. It walks the
  singleton's empty composition collections with zero rank calls rather than
  selecting a singleton implementation, as required by synthesis §5.2 and
  §5.3.
- Route-gold executes after each fenced candidate swap. A red verdict rolls
  back immediately to retained bytes. Aggregate scores have no role; this is
  the per-skill deletion gate and rollback discipline in synthesis §9.
- The card generator omits the compatibility vocabulary property structurally
  only when the final manifest has no legacy inputs. It retains compiled policy
  identities and zero-signal semantics, consistent with synthesis §5.3 and
  §8.3.
- Zero signal cannot select a destination or fleet union. The explicit empty
  union plus compiled-policy replay preserves `defer(no-match)` from synthesis
  §5.2 and the no over-emission rule in §10.
- Rollback restores routing bytes and advances the fence monotonically. It does
  not claim to reverse destination effects already committed, which remain
  destination-owned under synthesis §9.
<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

Fresh `node harness/validate-cleanup.cjs` output reported `status:"GREEN"` and:

- external preflight candidate hashes `3ade42a8...`, `77bf5a97...`,
  `8c630732...`, and `cbfeb97e...`, with canary, route-gold, rollback,
  destination rollout, and legacy-before-cleanup checks true;
- ordered deletion generations 5–8 through `deleteLegacySkill`, with real
  route-gold rows `2 → 5 → 11 → 8` and byte-stable replay digests after each;
- a real corrupted scorer observation returning false, `ROUTE_GOLD_RED`, and
  byte-exact restore to `c25a6322...`;
- four retained generations through the bake window and a dedicated rollback
  drill restoring `34eb9f60...` byte-exactly;
- final frozen-manifest equality at `062261a3...`, with planted preimage and
  final-state drift both rejected;
- a regenerated card byte-identical to its phase artifact, zero retained
  compatibility arrays, a planted vocabulary property rejected, a planted
  default union rejected, and zero signal returning only `defer(no-match)`;
- singleton destination count 1, empty composition count 0, rank calls 0, and
  the same deletion driver name as all parent hubs;
- protected scorer hashes unchanged at `b039b8dd...`, `d5a9cc72...`, and
  `249be7c1...`, with zero scorer write attempts.

Both CommonJS files pass `node --check`; both JSON files pass
`python3 -m json.tool`; the project comment-hygiene checker exits 0 for the two
CommonJS files. The Level-2 checklist records the same evidence.
<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

- This phase authors and verifies the cleanup contract and phase-local frozen
  artifacts. It does not delete live legacy artifacts, change a live activation
  manifest, or make any production router compiled-authoritative.
- The N=1 readiness proof is split between the committed compiler/rollback
  harness and committed execution-plane harness. It proves the required
  mechanics, but there is no standalone N=1 parent-hub canary artifact matching
  the three parent-hub packet shapes.
- The final policy card is a compact fleet identity and negative/default posture
  card. Detailed positive selector tables remain in each committed per-hub card
  and compiled policy; this phase does not duplicate roughly 130 KB of parent
  card payload.
- Route-gold covers 26 committed canary rows and the explicit N=1 exact and
  zero-signal rows. It proves the deletion gate boundary, not production traffic
  distribution or an operational quiet-period duration.
- The bake window is modeled as four successful retained generations with
  discard authorization held false. The empirical duration and telemetry signal
  that permit eventual discard remain operational inputs.
- Routing rollback cannot undo an external effect after destination COMMIT.
  Post-COMMIT recovery remains destination-owned.
- `validate.sh` was not run by explicit instruction. Repository-wide strict
  metadata, freshness, and spec validation therefore remain unverified.
<!-- /ANCHOR:limitations -->
