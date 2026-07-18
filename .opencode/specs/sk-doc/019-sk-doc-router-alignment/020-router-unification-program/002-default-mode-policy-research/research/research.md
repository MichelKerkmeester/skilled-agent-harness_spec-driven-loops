---
title: "Deep Research: Parent-Hub Routing Out-of-Box Run 3"
description: "Canonical Run 3 synthesis from seven lateral iterations on compiled routing policy, typed outcomes, bounded handoff, replayable adaptation, and proof-carrying route commitment."
trigger_phrases:
  - "parent hub routing out of box"
  - "typed route decision"
  - "proof carrying route plan"
  - "defaultMode commitment boundary"
  - "compiled routing policy"
importance_tier: "important"
contextType: "research"
---
# Deep Research: Parent-Hub Routing Out-of-Box Run 3

<!-- SPECKIT_TEMPLATE_SOURCE: deep-research-synthesis | v1 -->

## 1. Metadata

| Field | Value |
|-------|-------|
| Session | dr-20260718T032435Z-run3 |
| Lineage | sol-oob / fanout-sol-oob-1784345122095-1gku9b |
| Iterations | 7 of 7 |
| Stop reason | maxIterationsReached |
| Executor | cli-codex / gpt-5.6-sol / ultra / fast |
| Spec folder | `.opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research` |
| Detailed lineage | `research/lineages/sol-oob/` |
| Questions | 5/5 answered |
| Detailed findings | 35 in the lineage registry |

## 2. Investigation Report

Run 3 deliberately questioned the framing established by Runs 1 and 2. Seven iterations examined direct Layer-0 mode selection, replayable adaptation, cross-domain no-destination semantics, no-wrong-door handoff, one-turn negotiation, an information-minimal routing contract, and proof-carrying route preparation.

The result is not to delete routing. It is to remove duplicate policy authoring while preserving packet-local authority, deterministic replay, resource selection, and ordered multi-mode outcomes.

## 3. Executive Overview

`defaultMode` is a commitment-boundary smell. The current field can collapse four distinct facts into one action:

1. No discriminating evidence was found.
2. A policy prior exists.
3. A child was selected.
4. The selected child may execute.

The proposed replacement separates those stages:

```text
raw request
  -> typed facts
  -> immutable compiled policy
  -> PREPARE typed RouteProof
  -> destination-local VERIFY
  -> COMMIT immediately before the first side effect
```

The parent hub remains a thin contract boundary. It verifies registry membership, loads packet-local resources, preserves ordered workflow and surface bundles, and enforces destination authority. Lexical, command, and surface detectors remain, but become compiler inputs rather than a parallel hand-authored runtime policy.

## 4. Core Architecture

### 4.1 Information-Preserving Collapse

The smallest contract that survived falsification against both `sk-code` and `system-deep-loop` has four surfaces:

1. `RouteRequest`: explicit hints plus typed intent, lifecycle, surface, capability, risk, and mutation facts.
2. `CompiledPolicy`: content-addressed registry projection, detector schema, capabilities, bundle constraints, authority references, and resource selectors.
3. `RouteProofV1`: a short-lived prepared plan binding decision inputs and ordered targets without granting authority.
4. `CommitReceipt`: destination-owned evidence of revalidation and the exact mutation boundary crossed.

### 4.2 Prepare, Verify, Commit

- Prepare may parse, classify, read permitted evidence, validate resources, and run deterministic dry checks. It must not acquire locks, mutate files, send messages, deploy, or create externally visible effects.
- Verify belongs to the destination. It rechecks request, policy, registry, resource, target, authority, and precondition identities immediately before mutation.
- Commit starts at the first side effect. A mutating leg invalidates later prepared legs, which must be replanned against the new state.

### 4.3 Typed Control Outcomes

The route decision algebra should expose `single`, `orderedBundle`, `surfaceBundle`, `clarify`, `defer`, or `reject`. Non-execution reasons should distinguish `idle`, `no-match`, `dependency-failure`, `degraded-fallback`, and `handoff-required`. A named default may remain only as an explicit capability-bounded policy route; it cannot manufacture evidence or grant authority.

## 5. Technical Specifications

| Finding | Contract implication |
|---------|----------------------|
| Full hub deletion loses metadata-only modes, bundles, fallback resources, and local authority | Keep a thin resolver; collapse duplicate policy representation instead |
| Raw language cannot enter a capability solver directly | Compile lexical, command, and surface detectors into typed facts |
| `sk-code` can return an acting workflow plus read-only surfaces | Preserve ordered targets with explicit roles |
| Distinct public modes can share one packet | Do not use packet path as the public mode identity |
| No-route has several operational meanings | Return typed negative outcomes with reason and policy identity |
| Handoff acceptance differs from completion | Preserve offered, accepted, active, and terminal states |
| Advisor confidence is a ranking heuristic | Expose rank and margin separately; permit error estimates only after calibration |
| Corrections must not mutate serving policy online | Use immutable base and overlay hashes with shadow validation and explicit promotion |
| A route proof is evidence, not authority | Destination-local verification gates the first side effect |
| Mutation breaks universal reversibility | Replan after mutation; recovery remains destination-owned |

## 6. Constraints and Limitations

- The architecture was falsified against two dissimilar hubs, not every hub archetype.
- One-turn, three-option, two-attempt, and token-budget limits are provisional engineering caps, not measured optima.
- Current advisor confidence values were not calibrated against a representative held-out request corpus.
- Replay requires canonical serialization plus pinned compiler, detector, registry, feature-schema, base-policy, and overlay versions.
- Read-only speculation can still disclose sensitive context, cost money, or observe mutable external state.
- Router-level atomic rollback is not promised across filesystem, network, messaging, deployment, or user-visible effects.
- Graph convergence supplied no events. The forced seven-iteration policy treated convergence as telemetry.

## 7. Integration Patterns

- Layer 0 discovers the public hub identity; it does not acquire child execution authority.
- A compatibility compiler initially consumes existing `mode-registry.json` and `hub-router.json` artifacts and fails closed on drift.
- The local resolver verifies the proof, resolves resources, loads packet contracts, and enforces the destination tool surface.
- Read-only bundle legs may prepare together; mutation starts a new planning epoch.
- Ambiguous routes get one bounded clarification or acknowledged handoff with finite hop, attempt, deadline, and context budgets.
- Serving uses immutable policy snapshots; learning proposes overlays that require shadow and held-out validation before promotion.

## 8. Implementation Guide

1. Define schemas for `RouteRequest`, `CompiledPolicy`, `RouteProofV1`, verification outcomes, and `CommitReceipt`.
2. Define canonical serialization, hashing, expiry, read-set versioning, and idempotency rules.
3. Build a compatibility compiler while retaining the current deterministic replay as the comparison oracle.
4. Add destination-local verification immediately before the first side effect.
5. Introduce typed negative, clarification, and handoff outcomes.
6. Shadow immutable adaptive overlays without changing serving behavior.
7. Build a privacy-reviewed corpus and calibrate selective risk and interaction budgets.
8. Pilot one composite hub and one mutation-heavy hub before fleet-wide adoption.

## 9. Verification Commands

```bash
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-code
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop
node .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs --loop-type research --artifact-dir .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob --iteration 7 --json
```

Implementation acceptance additionally needs route-gold fixtures for single, ordered-bundle, surface-bundle, clarify, defer, reject, stale-proof, concurrent-acceptance, mutation-invalidation, and destination-disappearance outcomes.

## 10. Acceptance Matrix

| Area | Acceptance criterion |
|------|----------------------|
| Information parity | Current single, bundle, and surface outcomes are reproduced or intentionally rejected with a typed reason |
| Determinism | The same canonical facts and policy identities produce byte-identical decisions offline |
| Authority | Recommendation, proof, or handoff acceptance cannot execute before destination verification |
| Staleness | Any bound input change yields `STALE_PROOF` or a stricter terminal result |
| Mutation | The first side effect records a receipt and invalidates every later prepared leg |
| No destination | Every negative route has a typed reason; mutation never takes an implicit fail-open path |
| Adaptation | Serving policy never mutates in place; promotion and rollback select immutable overlays |
| Calibration | Auto-route thresholds require held-out policy-specific risk and coverage evidence |

## 11. Recommendations

1. Replace the keep-versus-null debate with an explicit decision and commit boundary.
2. Compile `INTENT_SIGNALS` and `RESOURCE_MAP` into one immutable policy input while retaining their information.
3. Keep the parent hub thin and local: verify, load, and enforce rather than owning another scoring policy.
4. Standardize prepare, verify, and commit. Prepared plans are short-lived, reservation-free, and discardable.
5. Add bounded clarification or handoff only on the uncertain path.
6. Keep ranking, calibration, and learning separate; adaptive overlays never self-promote.

## Eliminated Alternatives

| Approach | Reason eliminated | Iteration |
|----------|-------------------|-----------|
| Delete hub-local resolution while leaving Layer 0 unchanged | Loses metadata-only modes, bundles, local resources, and packet authority | 1 |
| Promote every nested packet to an advisor identity | Breaks the deliberate single public graph identity | 1 |
| Replace the route plan with one mode or capability path | Cannot represent ordered workflow and surface roles | 1, 6 |
| Delete lexical, command, and surface detection | Raw requests never become typed solver evidence | 6 |
| Mutate live weights after each correction | Makes serving time-dependent and replay irreproducible | 2 |
| Collapse every no-destination result into null or default | Erases idle, negative, dependency, degraded, and handoff distinctions | 3 |
| Copy full transcripts or permit unbounded rerouting | Makes context, privacy, loops, and latency unbounded | 4, 5 |
| Treat accepted handoff as completed work | Transfer acceptance and destination execution are separate states | 4 |
| Treat heuristic confidence as probability | Calibration is corpus- and policy-specific | 5 |
| Treat a valid route proof as execution authority | Current scope and destination policy must still be checked | 7 |
| Hold locks while a prepared route awaits commit | Imports blocking and recovery costs without a shared transaction manager | 7 |
| Promise router-owned rollback across mutations | External effects are not universally reversible | 4, 7 |

## Divergence Map

The seven forced tracks covered deletion, adaptation, cross-domain negative semantics, handoff, negotiation and calibration, information-minimal compilation, and proof-carrying commitment. All charter questions were resolved by iteration 6; iteration 7 intentionally broadened the frame before synthesis. No formal divergent pivot transaction or Council artifact was required.

## 12. Open Questions

- What exact schema and canonical serialization make `RouteProofV1` machine-checkable?
- Which nominally read-only operations are safe to speculate?
- How should concurrent acceptance, stale proofs, destination disappearance, and duplicate commits resolve?
- What privacy-reviewed corpus can calibrate risk, coverage, latency, option recall, and user friction?
- Who owns overlay approval, retention, rollback, and audit review?
- Does the contract survive named-default, contextual-default, transport, and complex leaf-resource hubs?
- What migration preserves advisor projections, installed clients, caches, route-gold replay, and packet contracts?

## 13. Sources and References

- Parent-hub contracts: `.opencode/skills/sk-doc/create-skill/references/parent_skill/`
- Composite hub: `.opencode/skills/sk-code/SKILL.md`, `mode-registry.json`, and `hub-router.json`
- Shared-packet hub: `.opencode/skills/system-deep-loop/SKILL.md`, `mode-registry.json`, and `hub-router.json`
- Advisor learning and calibration: `.opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts` and `lib/scorer/`
- Deterministic replay: `.opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md`
- External primary sources are cited in the detailed lineage report at `research/lineages/sol-oob/research.md`.

## 14. Iteration Trail

| Iteration | Focus | New information ratio |
|-----------|-------|-----------------------|
| 1 | Direct Layer-0-to-mode selection | 1.00 |
| 2 | Replayable correction overlay | 1.00 |
| 3 | Typed no-destination control | 1.00 |
| 4 | Acknowledged no-wrong-door handoff | 1.00 |
| 5 | Calibrated one-turn negotiation | 0.80 |
| 6 | Capability and type-directed minimal contract | 1.00 |
| 7 | Proof-carrying prepare, verify, commit | 0.90 |

Detailed evidence is in `research/lineages/sol-oob/iterations/iteration-001.md` through `iteration-007.md`.

## 15. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 7 of 7
- Questions answered: 5 of 5
- Findings: 35 detailed lineage findings
- Ratios: 1.00, 1.00, 1.00, 1.00, 0.80, 1.00, 0.90
- Average ratio: 0.96
- Convergence threshold: 0.05
- Early-stop telemetry: all questions were resolved after iteration 6, but the configured policy required iteration 7
- Failures and timeouts: 0

## 16. Next Steps

1. Create an implementation packet for the schemas, compatibility compiler, and destination-local verification.
2. Freeze a route-gold corpus before changing serving behavior.
3. Shadow compiled decisions beside the current hub router and require deterministic parity.
4. Pilot `sk-code` because it exercises ordered workflow and surface roles plus mutation boundaries.
5. Calibrate confidence and interaction budgets before choosing production thresholds.

## 17. References

Canonical synthesis: this file. Detailed synthesis: `research/lineages/sol-oob/research.md`. Machine state: `research/deep-research-config.json`, `research/deep-research-findings-registry.json`, `research/orchestration-summary.json`, and the lineage-local state packet.
