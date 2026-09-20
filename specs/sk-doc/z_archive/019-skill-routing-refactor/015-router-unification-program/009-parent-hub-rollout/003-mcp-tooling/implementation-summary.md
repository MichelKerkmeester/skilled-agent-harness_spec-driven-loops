---
title: "Implementation Summary: mcp-tooling Unified Router Canary"
description: "Compiled transport/judgment graph, execution-plane-owned idempotency binding, proof-gated Figma execution, real route-gold, Stage-6 rollout fencing, and byte-exact activation rollback."
trigger_phrases:
  - "mcp-tooling canary implementation"
  - "figma authority route proof"
  - "tooling destination rollout results"
importance_tier: "critical"
contextType: "implementation"
---
# Implementation Summary: mcp-tooling Unified Router Canary

<!-- SPECKIT_LEVEL: 2 -->
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core + level2-verify | v2.2 -->

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Status** | Execution-plane idempotency teeth, Stage-4, and Stage-6 GREEN; strict packet validation blocked |
| **Date** | 2026-07-19 |
| **Level** | 2 |
| **Serving authority** | Legacy; candidate remains shadow-only |
| **Effective policy** | `dba007a997945fb54b899a142d49ef158a6f8adefe1bd4b18486e1e0799652b3` |
| **Destination graph** | `f8afb35281b150280bd764ee0be961a27ffcdcd63e99dd61914614533291daa2` |

<!-- /ANCHOR:metadata -->

<!-- ANCHOR:what-built -->
## What Was Built

The phase contains a zero-dependency compiler, evaluator, document projection, execution fence,
activation gate, fixture set, and validator for the live `mcp-tooling` authored registry. The
compiled destination graph has 11 destinations: six tooling destinations and five cross-hub
design-judgment destinations. Its 15 ordered composition rules carry `composeAfter` and
`requiresAuthorityFrom` directly in data. The frozen `CompiledPolicyV1` remains the compatibility
view used by the existing decision parser and projector; its provenance binds the richer graph
digest, so the graph is not a second untracked control plane (synthesis §§2.1–2.3, 5.3, 7).

The canonical worked route is `orderedBundle[sk-design/interface, mcp-tooling/mcp-figma]`.
The judgment destination produces an approving, intent-pinned `RouteProofV1` during VERIFY.
The transport receives a destination-local authority consumption record only at its own VERIFY,
then reaches COMMIT once. Negative judgment, stale or mismatched bindings, transport-first order,
and COMMIT without VERIFY all fail before an effect (synthesis §§2.1, 2.3, 7, 9).

Every composition proof now derives its idempotency identity in the frozen `RouteProofV1` domain
from `requestFactsHash`, the complete target (`destinationId`, `role`, `authorityRef`, and
`mutatesWorkspace`), and `effectivePolicyHash`. This removes the raw destination-only digest that
allowed different policy generations to collide while preserving proof as evidence and exactly-once
handling as a destination-adapter property (synthesis §3 Idea 7, §8.2).

Generated artifacts include the machine policy, richer destination graph, advisor projection,
typed route gold, document-only policy card, blast-radius evidence, candidate/prior manifests,
acceptance digests, and fence state. Live routing configuration and skills remain untouched.

<!-- /ANCHOR:what-built -->

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The compiler consumes the live hub registry, hub skill, Figma transport identity, `sk-design`
registry and identity, and the external `mcp-code-mode` identity as hashed read-only bytes. Roles
derive from authored packet kinds. Cross-hub pairings derive from the registry's
`crossHubPairing`; judgment modes derive from the paired registry. Mutation signals derive from
the transport packet's authored command taxonomy. No evaluator branch tests a hub or transport
name. A byte-identical second compile and frozen canonical serializer hash validate determinism
(synthesis §§5.3, 6, 7, 10).

The evaluator emits only `single`, `orderedBundle`, or target-free negative decisions. A mutating
transport signal with no selected judgment defers with `dependency-failure`; zero and ambiguous
tooling signals defer without a default union or fallback transport. Advisor output contributes
only when live and identity-matching; drift becomes annotation-only (synthesis §§2.3, 8.1, 10).

All eight typed fixtures pass through the committed compatibility projector and the real
read-only `evaluateRouteGold`. The live `router-replay.cjs` producer also confirms the tooling-hub
leg for each positive route. The document-only lane parses the generated card's compiled payload,
never falls back to the machine snapshot, and reaches the same decisions with
`DOCUMENT_ONLY_UNATTESTED` / `PREPARED_DRAFT` terminals (synthesis §§8.2–8.3).

Activation uses the committed fenced-manifest implementation. It compares the expected prior
generation/hash, acquires a token lock, advances the fencing epoch, rechecks the preimage before
rename, pins one generation per request, retains the prior bytes, and CASes back to those exact
bytes. Stage 6 separately requires successful read-only Figma, Refero, and Mobbin legs before the
external-mutation-capable Figma destination can be enabled (synthesis §9).

The frozen execution plane keeps `idempotencyKey` and `bindingDigest` private, so the composition
executor consumes the frozen `RouteProofV1` domain tag and canonical `hashArtifact` primitive with
the exact owner preimage. The harness then calls the owner's exported `prepareRoute` as an oracle.
One tooth holds request and target constant while changing only `effectivePolicyHash`; the other
requires byte equality with the owner's key for the same binding tuple (synthesis §3 Idea 7, §8.2).

<!-- /ANCHOR:how-delivered -->

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Rationale |
|----------|-----------|
| Keep rich composition in `destination-graph.json` and a frozen policy compatibility view | The frozen schema cannot carry `composeAfter` or `requiresAuthorityFrom`; binding the graph digest into policy provenance preserves one effective identity while retaining scorer/projector compatibility (synthesis §§2.1, 5.3, 7). |
| Compile every paired non-transport design mode as `judgment` | The external registry, not transport code, owns which judgment modes exist; transports remain incapable of approval (synthesis §§2.2, 6–7). |
| Treat Figma as external-mutation-capable without marking workspace mutation | The live registry says Figma document effects land externally while `mutatesWorkspace` remains false; Stage 6 therefore uses an explicit effect class rather than abusing the workspace flag (synthesis §§7, 9). |
| Consume authority at transport VERIFY | The approving proof is evidence until the dependent destination validates the exact intent, policy, graph, and generation tuple (synthesis §§2.1, 2.3, 7). |
| Require all declared read-only transport legs before mutation enablement | External effects cannot rely on manifest rollback for recovery; pre-effect evidence must pass first (synthesis §9). |
| Keep legacy serving-authoritative | This canary proves the candidate and rollback path without editing live routing state (synthesis §9). |
| Keep `mcp-code-mode` outside the graph | Its live identity defines shared execution infrastructure, not design taste or a tooling-hub member (synthesis §§6–7). |
| Bind composition idempotency to the frozen execution-plane identity | Proof remains evidence, while the destination adapter receives a key scoped to request facts, the full target, and effective policy; an owner-oracle fixture prevents domain or preimage drift (synthesis §3 Idea 7, §8.2). |

<!-- /ANCHOR:decisions -->

<!-- ANCHOR:verification -->
## Verification

| Gate | Result | Evidence |
|------|--------|----------|
| Canonical compile | Pass | 11 destinations, 15 composition rules, 23 authority edges, byte-identical recompile, graph digest bound to policy |
| Frozen schemas | Pass | `CompiledPolicyV1`, `AdvisorProjectionV1`, and approving `RouteProofV1` validate against committed schemas |
| Transport never judgment | Pass | Zero transport approvers; planted role escalation hard-blocks; removing the guard makes the fixture pass |
| Figma worked case | Pass | `interface → mcp-figma`; approving judgment proof; transport VERIFY consumes authority; one simulated external receipt |
| Authority refusal | Pass | Negative judgment withholds authority; dependent VERIFY and fabricated-ready COMMIT both fail `REQUIRES_AUTHORITY_UNSATISFIED` |
| Ordering refusal | Pass | Transport COMMIT before its judgment predecessor fails `COMPOSE_AFTER_PREDECESSOR_UNRESOLVED` |
| Stage-6 proof fence | Pass | Hash, epoch, expiry, read-set, authority, idempotency, and receipt fixtures pass |
| Effective-policy idempotency tooth | Pass | Holding request and target constant yields `9dc0b79420a72f924fa0a1c67a71b954f11a58d37c4cc9d72cbb1edc9cc48307` for the current policy and `c2b5a03ff21525d4e36672f6285f8131dd1db95adb116508d9e347f6edba2d00` for the policy-only variant |
| Execution-plane parity tooth | Pass | Composition and the frozen owner's `prepareRoute` both derive `9dc0b79420a72f924fa0a1c67a71b954f11a58d37c4cc9d72cbb1edc9cc48307` for the same binding tuple |
| Read-only rollout | Pass | Premature enable fails; read-only Figma, Refero, and Mobbin proofs precede mutating Figma enablement |
| Route-gold | GREEN | 8/8 typed rows pass real read-only `evaluateRouteGold`; corrupted observation fails; live hub producer confirms every positive tooling leg |
| Advisor | Pass | Match may contribute; stale, absent, and drift cases cannot override |
| Document parity | Pass | 8/8 match with no fallback; planted document divergence detected |
| Aggregate hard blocks | Pass | Nine aggregate activation blocks plus direct structural negative/role/order/authority refusals are driven |
| Guard removal | Pass | Removing role, order, authority, or rollout guard allows its forbidden state |
| Rollback | Pass | Wrong preimage blocked; prior/restored bytes identical; fence epoch advances to 2 |
| Source protection | Pass | Seven live authored inputs and three scorer files have identical before/after digests |
| Static constraints | Pass | Seven code files; zero external dependencies, destination-name branches, or comment violations |
| Strict packet validation | Blocked | `validate.sh <phase-folder> --strict` exits 2 with 11 errors and 3 warnings: legacy anchors/headers/frontmatter are nonconformant, and required validator runtime artifacts (`level-contract-resolver.js`, local `tsx`) are unavailable |

Protected scorer digests:

- `router-replay.cjs`: `d5e13daf3e99469c079e8037c988b31db4d27dfcf5045789d70dceb48de8af47`
- `score-skill-benchmark.cjs`: `d5a9cc72ec7cfcfb6484f0998f78e7ec16160ecdfee9e3c63f3215c72bf8780c`
- `load-playbook-scenarios.cjs`: `5029f22df920418eb0f87859a7146b83656619943a9fe6f010d6d06e96cdd029`

<!-- /ANCHOR:verification -->

<!-- ANCHOR:limitations -->
## Known Limitations

1. No external Figma effect was executed. The harness simulates the destination effect and proves
   authority, ordering, idempotency, and receipt mechanics without network or live-tool access.
2. Legacy remains serving-authoritative and the candidate remains shadow-only. This packet does
   not edit a live router, registry, skill, or activation manifest.
3. Rollback cannot undo a committed external effect. It restores only activation-manifest bytes;
   post-COMMIT recovery is destination-owned.
4. The real scorer independently checks the projected observation, and the live hub producer
   confirms each tooling leg. The new cross-hub judgment expectation is authored in this phase's
   typed fixture because the legacy tooling router exposes only its own hub modes; it is not an
   independent legacy oracle for `sk-design` composition.
5. The fixture set covers canonical Figma interface/foundations routes, unapproved mutation,
   read-only transport, actor single, ambiguity, zero signal, and forbidden rejection. It is not
   an exhaustive natural-language corpus and does not claim calibrated auto-route thresholds.
6. Strict packet validation is blocked. The packet predates the current anchor/header/frontmatter
   contract, while the validator's required `level-contract-resolver.js` and local `tsx` runtime are
   unavailable. Repair would require structural spec/plan/tasks changes or builds outside this
   phase, both excluded by this execution scope.
7. The frozen execution plane does not export its private idempotency helper. The composition
   executor therefore consumes the frozen domain/canonical hash primitive and exact preimage, while
   the owner-oracle fixture guards against drift until a direct helper export exists.

<!-- /ANCHOR:limitations -->
