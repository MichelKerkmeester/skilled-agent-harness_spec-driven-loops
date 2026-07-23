---
title: "Deep Research: Parent-Hub Routing Out-of-Box Run 3"
description: "Seven-iteration lateral research synthesis on compiled parent-hub policy, typed outcomes, bounded handoff, replayable adaptation, and a proof-carrying prepare/verify/commit boundary."
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
| Session | fanout-sol-oob-1784345122095-1gku9b (generation 1) |
| Iterations | 7 of 7 (stop: maxIterationsReached; stopPolicy=max-iterations) |
| Executor | cli-codex / gpt-5.6-sol |
| Spec folder | .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research |
| Artifact root | research/lineages/sol-oob (direct override; no root-resolution step) |
| Research topic | Parent-hub routing, out-of-box run 3: radical lateral rethinks over the Out-of-Box Agenda |
| Key questions | 5/5 answered; 35 reducer-indexed findings |

## 2. Investigation Report

The packet's Out-of-Box Agenda asked for deliberately non-incremental alternatives: abolish the hub-router, add learning, import mechanisms from other routing domains, guarantee no wrong door, negotiate instead of classify, expose confidence, simplify the contract, and break the framing itself. Seven independent leaf iterations tested those directions in sequence. The work used repository contracts as the primary evidence, cross-domain primary sources for transferable mechanisms, and explicit falsification against dissimilar parent hubs rather than assuming one universal router shape.

The result is not “delete routing.” It is a narrower architectural collapse: remove parallel hand-authored representations while preserving the information and authority boundaries they encode. Parent-local resolution remains necessary, but it can become a small verifier/loader over a compiled immutable policy instead of a second policy-authoring surface.

## 3. Executive Overview

defaultMode is a commitment-boundary smell. The field can make “no discriminating evidence,” “policy prior,” “selected child,” and “permission to execute” look like one event. The recommended model separates them:

~~~text
raw request
  -> typed facts
  -> immutable compiled policy
  -> PREPARE typed RouteProof
  -> destination-local VERIFY
  -> COMMIT immediately before the first side effect
~~~

The hub survives as a thin contract boundary. It validates registry membership, loads packet-local resources, preserves ordered workflow/surface bundles, and enforces destination authority. What disappears is duplicated signal/resource policy: lexical, command, and surface detectors compile into typed facts; static packet, backend, authority, and default-resource data derive from a policy-pinned mode entry.

Three control paths complete the model. First, no-destination is a typed result (idle, no-match, dependency-failure, degraded-fallback, or handoff-required), never an unexplained null or silent default. Second, uncertainty can trigger one bounded clarification or acknowledged handoff without transferring execution authority. Third, adaptation runs in a separate learning plane: immutable base/overlay snapshots, shadow evaluation, held-out validation, explicit promotion, and hash-based rollback.

Proof-carrying preparation is the final frame-break. Read-only planning and validation may be speculative, but the proof grants no capability. The destination revalidates every bound input and its own authority immediately before mutation. Once a side effect occurs, generic router rollback is false assurance; recovery belongs to the destination workflow.

## 4. Core Architecture

### 4.1 Information-preserving collapse

The smallest contract that survived the two-hub falsification has four surfaces:

1. RouteRequest: explicit hint plus evidence-producing typed facts for intent, lifecycle, surface, capability, risk, and mutation class.
2. CompiledPolicy: content-addressed registry projection, detector schema, mode capabilities, ordered-bundle constraints, authority references, and resource selectors.
3. RouteProofV1: a short-lived prepared plan binding decision inputs and ordered targets without granting authority.
4. CommitReceipt: destination-owned record of the revalidation result and exact mutation boundary crossed.

~~~text
RouteProofV1 {
  requestDigest
  policyHash + overlayHash
  registryHash + factSchemaHash
  readSet[{resourceRef, version}]
  targets[{modeId, role, requestLeafResourceIds[]}]
  evidence[] + alternatives[]
  authorityClass + preconditions[]
  expiresAt + idempotencyKey
}
~~~

modeId plus policyHash derives packet identity, backend discriminator, default resources, and the authority reference. The request-specific decision retains only information that cannot be recovered safely: evidence, alternatives, ordered roles, leaf-resource selections, read-set versions, and replay identities. [SOURCE: .opencode/skills/sk-code/mode-registry.json:5] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:104]

### 4.2 Prepare, verify, commit

- Prepare: parse, extract typed facts, score candidates, look up registries, validate readable resources, load permitted read-only evidence, and run deterministic dry-run checks. No locks, leases, writes, messages, deployments, or other externally visible effects.
- Verify: the destination recomputes proof digests, checks policy/registry identities and read-set versions, confirms target order and membership, rechecks preconditions, scope, and current authority, then returns READY, STALE_PROOF, NEEDS_INPUT, DEFER, or REJECT.
- Commit: READY acquires destination-local authority immediately before the first side effect. A mutating leg invalidates later prepared legs; each later leg is replanned against the resulting state.

This borrows the producer-proof/consumer-check split from proof-carrying code and optimistic stale-write rejection from Kubernetes, without importing long-lived transactional locks. [SOURCE: https://www.usenix.org/legacy/publications/library/proceedings/osdi96/full_papers/necula/html/node1.html] [SOURCE: https://kubernetes.io/docs/reference/using-api/api-concepts/] [SOURCE: https://www.postgresql.org/docs/current/sql-prepare-transaction.html]

### 4.3 Typed control outcomes

The decision algebra is single, orderedBundle, surfaceBundle, clarify, defer, or reject. Operational no-destination reasons refine the non-execution branch. A named default remains legal only when it is an explicit capability-bounded route; it cannot manufacture evidence. A degraded fail-open route must be visible and is not safe for mutation-capable requests. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108] [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc9520.html]

## 5. Technical Specifications

| Settled finding | Contract implication | Evidence |
|-----------------|----------------------|----------|
| Full hub deletion loses metadata-only modes, bundles, fallback resources, or packet-local authority | Keep a thin resolver; collapse policy representation instead | Iteration 1; parent_skills_nested_packets.md:49 |
| Raw language cannot enter a capability solver without an evidence boundary | Compile lexical/command/surface detectors; do not delete them | Iteration 6; system-deep-loop/mode-registry.json:104 |
| sk-code can return one acting workflow plus read-only surfaces | Preserve ordered targets and explicit roles | Iteration 6; sk-code/SKILL.md:57 |
| Distinct public modes can share one packet | packetPath is not a stable mode/capability key | Iteration 6; system-deep-loop/mode-registry.json:104 |
| No-route has several operational meanings | Return typed negative/control outcomes with reason and policy identity | Iteration 3; RFC 4191; RFC 9520 |
| Handoff acceptance differs from execution completion | Preserve OFFERED -> ACCEPTED -> ACTIVE -> terminal and destination ownership | Iteration 4; RFC 3515; A2A |
| Advisor confidence is a ranking heuristic, not a posterior probability | Expose rank/margin separately; permit estimated error only after calibration | Iteration 5; fusion.ts:381; Guo et al. |
| Corrections cannot mutate the serving policy online without breaking replay | Use immutable base/overlay hashes, shadow validation, and explicit promotion | Iteration 2; feedback-calibration.ts:259 |
| A prepared proof is evidence, not authority | Destination-local verification gates the first side effect | Iteration 7; Kubernetes API concepts |
| Mutation breaks universal reversibility and invalidates later bundle legs | Replan after each mutation; recovery is destination-owned | Iteration 7; PostgreSQL PREPARE TRANSACTION warning |

## 6. Constraints & Limitations

- The contract was falsified against two deliberately dissimilar hubs (sk-code and system-deep-loop), not every parent-hub archetype. Named-default, contextual-default, transport, and complex leaf-resource hubs still need fixtures.
- The proposed one-turn, three-option, two-attempt, and 256-token interaction limits are auditable engineering caps, not measured optima. No representative request corpus was available.
- Current advisor confidence and margin values were not empirically calibrated in this lineage. “Estimated correctness” remains illegal until a policy-specific held-out evaluation exists.
- Content hashes support replay only when canonical serialization, compiler/detector versions, normalized facts, registry inputs, and feature schemas are pinned together.
- Read-only speculation can still disclose sensitive context, consume paid APIs, or observe mutable external state. “No mutation” is necessary but not sufficient; policy must classify permitted speculative reads.
- Filesystem, network, messaging, deployment, and user-visible effects do not share one transaction manager. Router-level atomic rollback is not promised.
- Graph convergence services supplied no events. Ratio/question convergence was telemetry only because the requested stop policy required all seven iterations.
- The detached lineage write boundary excluded packet-spec writeback, validation, staging, and memory save; this report records research conclusions, not an implementation or packet-completion claim.

## 7. Integration Patterns

- Layer 0 remains hub discovery. It selects the public parent identity; it does not acquire child execution authority or flatten every nested packet into an advisor identity.
- Compiler adapter first. Existing mode-registry.json and hub-router.json remain source inputs during migration. A compiler emits the canonical policy snapshot and detects bidirectional drift.
- Thin hub/destination resolver. The local resolver verifies the route proof, resolves resources, loads packet contracts, and enforces the destination's tool/mutation surface.
- Ordered bundle semantics. Workflow and evidence-surface roles remain explicit. Read-only legs may prepare together; a mutating leg creates a new planning epoch.
- Bounded ambiguity recovery. Confident routes stay one-shot. Ambiguous routes get one schema-bound question or one acknowledged handoff with transfer id, scoped references, hop/deadline budget, and accept/reject/input/timeout states.
- Two-plane learning. Serving uses an immutable basePolicyHash plus overlayHash; the learning plane proposes bounded overlays from opt-in evidence, validates them in shadow and held-out fixtures, and requires explicit promotion.
- Typed observability. Record route outcome, evidence refs, policy identities, proof invalidation reason, clarification/handoff state, commit boundary, and destination-owned compensation state without logging raw prompts by default.

## 8. Implementation Guide — Prioritized Plan

P0-1. Freeze the machine contract. Define schemas for RouteRequest, CompiledPolicy, RouteProofV1, verification outcomes, and CommitReceipt; define canonical serialization, hashing, expiry, read-set versioning, and idempotency rules.

P0-2. Build a compatibility compiler. Compile the current registry/router pair into the immutable policy while retaining the existing router as the comparison oracle. Fail closed on missing modes, role/order drift, unresolved resources, authority mismatch, or non-canonical policy identity.

P0-3. Add destination-local verification. Validate policy/registry freshness, request digest, read set, target roles/order, capability, scope, and authority immediately before the first side effect. A stale proof must recompute, clarify once, defer, or reject; it must never silently fall through to a default.

P1-4. Introduce typed negative and handoff outcomes. Make no-match, dependency failure, degraded fallback, and handoff-required observable. Add the bounded OFFERED -> ACCEPTED -> ACTIVE protocol while keeping acceptance separate from completion.

P1-5. Shadow the adaptive overlay. Pin base, overlay, and schema hashes; keep serving immutable; validate proposals on held-out fixtures; make promotion and rollback explicit governance actions.

P2-6. Calibrate interaction and selective risk. Build a privacy-reviewed corpus and measure selective risk, coverage, option recall, clarification resolution, added turns, latency, token cost, cancellation, and incorrect-mutation rate before choosing thresholds or budgets.

P2-7. Migrate one composite hub, then one mutation-heavy hub. sk-code is the useful first composite case. Do not generalize until route-gold parity, stale-proof behavior, authority checks, and post-mutation replanning pass.

## 9. Verification Commands

~~~bash
# Existing parent-hub structural and routing invariants
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/sk-code
node .opencode/commands/doctor/scripts/parent-skill-check.cjs .opencode/skills/system-deep-loop

# Lineage evidence integrity
node .opencode/skills/system-deep-loop/runtime/scripts/verify-iteration.cjs \
  --loop-type research \
  --artifact-dir .opencode/specs/sk-doc/019-sk-doc-router-alignment/021-default-mode-policy-research/research/lineages/sol-oob \
  --iteration 7 --json
~~~

Implementation acceptance also needs new route-gold fixtures for single, ordered bundle, surface bundle, clarify, defer, reject, stale proof, concurrent acceptance, mutation invalidation, and destination disappearance. Those fixtures do not exist yet; this report does not present them as executed tests.

## 10. Acceptance Matrix

| Area | Acceptance criterion |
|------|----------------------|
| Information parity | Every current single/bundle/surface outcome is reproduced from the compiled policy, or an intentional typed incompatibility is documented |
| Determinism | Same canonical request facts plus policy/overlay/schema hashes produce byte-identical decisions offline |
| Authority | No recommendation, proof, or accepted handoff can execute before destination-local verification |
| Staleness | Any bound request/policy/registry/read-set/authority/precondition change yields STALE_PROOF or a stricter terminal outcome |
| Mutation | First side effect records a commit receipt and invalidates every later prepared leg |
| No destination | Every negative route has a typed reason; mutation-capable requests never take an implicit degraded fail-open path |
| Handoff | Acceptance and completion remain distinct; hops, attempts, deadline, and clarification turns are bounded |
| Adaptation | Serving policy never mutates in place; promotion and rollback select immutable overlay versions |
| Calibration | Numerical auto-route or dialogue thresholds are accepted only from held-out, policy-specific risk/coverage evidence |
| Compatibility | Existing advisor projection, packet resource loading, tool surfaces, and replay fixtures remain operational through migration |

## 11. Recommendations

1. Replace the “which default?” debate with an explicit decision/commit boundary. A default may remain as a bounded policy prior, but it cannot erase the zero-signal state or grant authority.
2. Collapse INTENT_SIGNALS plus RESOURCE_MAP into compiler inputs and registry/leaf selectors, not into a capability-only lookup. The information survives; duplicate authoring does not.
3. Keep the parent hub thin and local. It should verify, load, and enforce, not own a second mutable scoring policy.
4. Make prepare -> verify -> commit the uniform route lifecycle. Prepared plans are short-lived, reservation-free, and discardable; mutation is destination-authorized and creates a new planning epoch.
5. Add bounded clarification/handoff only on the uncertain path. Preserve scoped context, finite hops, explicit acknowledgment, and destination-owned recovery.
6. Separate ranking, calibration, and learning. Rank scores order options; calibrated risk controls auto-route only after evidence; adaptive overlays never self-promote.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|----------|-------------------|----------|--------------|
| Delete hub-local resolution while leaving Layer 0 unchanged | Loses metadata-only modes, composite outcomes, local resources, and packet authority | parent_skills_nested_packets.md:49; sk-code/SKILL.md:86 | 1 |
| Promote every nested packet to an advisor identity | Breaks the deliberate single public graph identity and makes evidence packets independently routable | parent_skills_nested_packets.md:94 | 1 |
| Replace the route plan with one workflowMode or one capability/path | Cannot represent ordered workflow/surface roles or same-packet public modes | sk-code/SKILL.md:57; system-deep-loop/mode-registry.json:104 | 1, 6 |
| Delete lexical/command/surface detection | Raw request language never becomes typed solver evidence | parent_hub_router_schema.md:160; two-hub falsification | 6 |
| Mutate live weights/rules after each correction | Makes serving time-dependent and offline replay irreproducible | feedback-calibration.ts:259; drift-guard tests | 2 |
| Treat sanitized outcome telemetry as a gold routing corpus | Prompt/scenario reconstruction is intentionally unavailable | metrics.ts:452 | 2 |
| Collapse all no-destination states into null/default | Erases idle, no-route, negative answer, dependency failure, degraded health, and handoff distinctions | Linux cpuidle; RFC 4191; RFC 9520 | 3 |
| Use a universal fail-open or fail-closed rule | Correct posture depends on outcome type, capability, and side-effect risk | AWS NLB behavior plus mutation boundary | 3 |
| Copy full transcripts or allow unbounded clarification/rerouting | Context cost, privacy exposure, loops, and latency become unbounded | MCP elicitation; A2A; SIP Max-Forwards | 4, 5 |
| Treat ACCEPTED as COMPLETED | Referral acceptance and destination execution are separate states | RFC 3515; A2A | 4 |
| Read heuristic confidence as probability or use one fleet-wide threshold | Current score is policy/rank evidence; calibration is hub- and corpus-specific | fusion.ts:381; Guo et al.; selective classification | 5 |
| Treat a valid route proof as authority | Consumer verification, current scope, and packet-local tool policy remain required | proof-carrying code analogy; sk-code/SKILL.md:124 | 7 |
| Hold locks or leases while a proof awaits commit | Imports prepared-transaction blocking and recovery costs without a shared transaction manager | PostgreSQL PREPARE TRANSACTION | 7 |
| Promise router-owned atomic rollback across mutations | Filesystem and external effects are not universally reversible; later bundle state changes after each mutation | composite/mutation falsification | 4, 7 |

## Divergence Map

The reducer recorded no formal divergent pivot transactions, failures, Council artifacts, or audited pivot overrides. Breadth came from the forced max-iterations policy: seven distinct tracks covered deletion, adaptation, cross-domain negative semantics, handoff, negotiation/calibration, information-minimal compilation, and proof-carrying commitment. All five charter questions were resolved by iteration 6; that candidate convergence was explicitly treated as telemetry, and iteration 7 broadened the frame before synthesis. The remaining frontier is empirical and implementation-specific rather than another unconstrained architecture lane.

## 12. Open Questions

- What exact schema, canonical serialization, compiler versioning, read-set vocabulary, expiry rule, and idempotency contract make RouteProofV1 machine-checkable?
- Which nominally read-only operations are safe to speculate when reads may expose sensitive context, cost money, or observe mutable external systems?
- How should concurrent acceptance, time-of-check/time-of-use drift, destination disappearance, policy promotion during a request, and duplicate commit attempts resolve?
- What privacy-reviewed corpus and labels can validate selective risk, coverage, latency, option recall, user friction, and incorrect-mutation rate?
- Who owns overlay approval, risk budgets, retention, rollback, and audit review?
- Does the contract survive named-default, contextual-default, single-mode, transport, and complex leaf-resource hubs beyond the two falsification cases?
- What migration preserves advisor projections, installed clients, caches, deterministic route-gold replay, and packet contracts while the compiler becomes canonical?
- Should negative decisions be cached at all, and under what privacy, expiry, and invalidation policy?

## 13. Sources & References

- Parent-hub contracts: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md and parent_hub_router_schema.md
- Composite hub: .opencode/skills/sk-code/SKILL.md, mode-registry.json, and hub-router.json
- Shared-packet hub: .opencode/skills/system-deep-loop/SKILL.md, mode-registry.json, and hub-router.json
- Advisor learning/calibration: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts, lib/scorer/fusion.ts, lib/scorer/feedback-calibration.ts, and lib/metrics.ts
- Deterministic replay: .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md
- No-destination sources: Linux cpuidle; RFC 4191; RFC 9520; AWS Network Load Balancer troubleshooting; Australian Government no-wrong-door guidance
- Handoff/dialogue sources: RFC 3515; RFC 3261; RFC 8693; A2A protocol; MCP elicitation
- Calibration sources: Guo et al., On Calibration of Modern Neural Networks; Geifman and El-Yaniv, Selective Classification for Deep Neural Networks
- Prepare/verify/commit sources: Necula, Proof-Carrying Code; Kubernetes API concepts; PostgreSQL PREPARE TRANSACTION

## 14. Iteration Trail

### Iteration 1 — Direct Layer-0-to-Mode Selection

Complete removal of hub-local routing is unsafe under the current contracts. Packet modularity can survive because `mode-registry.json` already owns packet identity, kind, tool surface, aliases, and advisor-routing metadata, but most nested modes intentionally have no advisor map entry and only the hub has a graph identity. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:49] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:94]

Layer 0 currently publishes a direct `workflowMode` only through a generated deep-loop-specific projection; it does not generically read other hubs' registries at runtime. Meanwhile, a concrete hub such as `sk-code` performs packet loading, fallback, surface bundling, and shared-context selection locally. [SOURCE: .opencode/skills/system-skill-advisor/feature_catalog/scorer_fusion/projection.md:26] [SOURCE: .opencode/skills/sk-code/SKILL.md:86]

The viable reframe is a semantic collapse: compile one canonical registry-derived selection policy for Layer 0 and offline replay, then retain a thin packet-local resolver that validates a typed route plan, loads local resources, and enforces tool authority. This removes duplicate keyword policy without turning advisor recommendation into execution authority or losing the deterministic CI oracle. [SOURCE: .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60] [INFERENCE: the existing hash-checked deep-loop projection supplies the determinism pattern, while the hub remains the authority and context boundary]

Next: investigate a deterministic/adaptive hybrid that learns from corrections without making offline replay irreproducible.

### Iteration 2 — Replayable Correction Overlay

The repository already has the core two-plane split: production recommendations expose frozen live weights while opt-in shadow outputs compare an adaptive candidate, and the feedback reducer produces bounded, read-only calibration proposals with no automatic promotion and held-out validation required. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/handlers/advisor-recommend.ts:448] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/feedback-calibration.ts:259]

The replayable form is an immutable `(basePolicyHash, overlayHash)` snapshot. The overlay should identify its base registry projection, parent overlay, feature schema, calibrator, bounded deltas, training-window digest, held-out-fixture digest, and promotion evidence; every typed route plan should record the two policy hashes plus its normalized feature-schema version. This transfers the existing projection-hash drift guard and deterministic router replay into the adaptive path without allowing online self-modification. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/routing-registry-drift-guard.vitest.ts:159] [SOURCE: .opencode/skills/sk-doc/create-benchmark/assets/skill_benchmark/skill_benchmark_readme_template.md:60] [INFERENCE: pinning all decision inputs makes a learned candidate a replayable policy snapshot]

Operational correction telemetry cannot double as a full gold corpus: it deliberately persists sanitized skill labels and outcomes without prompts or scenarios. Decision replay can retain packet-safe normalized features, but end-to-end feature-extraction replay needs a separate opt-in curated fixture. Promotion is therefore batch-only after shadow and held-out checks; mismatch disables the overlay visibly, and rollback selects a prior overlay hash. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/metrics.ts:452] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/tests/handlers/advisor-validate.vitest.ts:128]

Next: investigate cross-domain no-destination semantics from OS schedulers, IP/default routing, DNS, load balancers, and human reception, extracting only analogies that survive transfer.

### Iteration 3 — Typed No-Destination Control

The five domains do not share one null case. Linux preserves a special idle state when no runnable work exists; IP reports an explicit no-route error after specific and default routes are exhausted; DNS distinguishes useful negative answers from resolution failures; load balancing may enter an explicitly degraded fail-open state when every target is unhealthy; and no-wrong-door intake accepts an initial contact without claiming the destination's competence. [SOURCE: https://www.kernel.org/doc/html/latest/driver-api/pm/cpuidle.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc9520.html] [SOURCE: https://docs.aws.amazon.com/elasticloadbalancing/latest/network/load-balancer-troubleshooting.html] [SOURCE: https://www.modernslavery.gov.au/practice-guidelines-organisations/section-42-practice-areas/practice-area-2-referral]

The transferable model is a typed router-owned control result: `idle`, `no-match`, `dependency-failure`, `degraded-fallback`, or `handoff-required`. A named default is safe only as an explicit capability-bounded route, not as evidence manufactured from zero signal. Negative decisions may be cached when keyed to policy identity, reason, and expiry; policy changes invalidate them. Fail-open must be visible and is inappropriate for mutation-capable requests. [SOURCE: https://www.rfc-editor.org/rfc/rfc4191.html] [SOURCE: https://www.rfc-editor.org/rfc/rfc9520.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:108] [INFERENCE: typed outcomes preserve classification truth while permitting bounded recovery]

No-wrong-door adds the recovery mechanism: the intake mode keeps conversational ownership while it discovers a destination, communicates options, and transfers only scoped context; it does not act beyond its expertise or acquire the destination packet's authority. This points to an acknowledged handoff protocol rather than either a silent child default or a bounce back to the user. [SOURCE: https://www.modernslavery.gov.au/practice-guidelines-organisations/section-42-practice-areas/practice-area-2-referral] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:60]

Next: No-wrong-door and handoff routing, where any mode may accept a request and transfer it through a bounded typed protocol.

### Iteration 4 — Acknowledged No-Wrong-Door Handoff

Recoverable handoff can replace one-shot classification on the ambiguous path, but only as a bounded control protocol. The source retains intake until a destination returns a reasoned `ACCEPTED`, `REJECTED`, `NEEDS_INPUT`, or `TIMED_OUT` result; acceptance transfers execution ownership but remains distinct from execution success. SIP REFER supplies this separation by acknowledging a referral and reporting the referred action later, while A2A supplies explicit rejected, input-required, canceled, failed, and completed task states. [SOURCE: https://www.rfc-editor.org/rfc/rfc3515.html] [SOURCE: https://a2a-protocol.org/v0.3.0/specification/]

The offer should carry an idempotent transfer id, compact intent and capability fields, destination and policy identities, bounded context references, a visited-mode set, hop budget, and deadline. MCP's schema-bound elicitation with accept/decline/cancel states supports at most one compressed clarification turn; A2A's task references and bounded `historyLength` show that correlation need not copy the full transcript. SIP Max-Forwards supplies the finite-hop pattern. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation] [SOURCE: https://a2a-protocol.org/v0.3.0/specification/] [SOURCE: https://www.rfc-editor.org/rfc/rfc3261.html]

An offer requests capability; it never grants authority. The destination validates its registry membership and packet `toolSurface`, then acquires a short-lived lease scoped to that packet and operation, analogous to OAuth token exchange's explicit actor, audience/resource, and scope. Before execution, rejection or timeout rolls control back to intake without mutation. After execution begins, recovery is destination-owned cancellation or compensation, not automatic source replay. [SOURCE: https://www.rfc-editor.org/rfc/rfc8693.html] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_skills_nested_packets.md:65]

This adds one offer/response round trip only for uncertain routes and at most one clarification turn; confident routes remain one-shot. The bound is structurally measurable, but empirical acceptability still requires a real request corpus.

Next: routing as a one-turn typed negotiation with calibrated confidence, option compression, and a measurable clarification budget.

### Iteration 5 — Calibrated One-Turn Routing Negotiation

The current advisor's `confidence` is a bounded ranking heuristic assembled from lane evidence, floors, and bonuses; its separate uncertainty and threshold logic supports abstention but does not make the score or top-two margin a probability of correctness. The route contract should therefore separate always-present `rankScore`/`scoreMargin` from an optional `estimatedError` that is legal only when a versioned held-out corpus, calibration method, and policy hashes validate it. [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:381] [SOURCE: .opencode/skills/system-skill-advisor/mcp_server/lib/scorer/fusion.ts:431] [SOURCE: https://arxiv.org/abs/1706.04599]

Selective classification supplies the outer architecture: auto-route under a validated risk budget; otherwise ask one typed question, then defer or reject if the rescored case still fails. This unifies named-default, defer-routed, and detection-routed hubs only at their terminal action boundary. Their intent, surface detection, capability, resource, and authority evidence remains necessary. [SOURCE: https://arxiv.org/abs/1705.08500] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:227] [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:231]

The provisional interaction budget is one flat enum property, one clarification turn, at most three candidate modes plus `none_of_these`, at most two route attempts, and a 256-token card. These are replayable engineering caps, not empirical optima. Promotion requires corpus-backed selective risk, coverage, option recall, clarification resolution, cancellation, added-turn, and card-size measurements. [SOURCE: https://modelcontextprotocol.io/specification/2025-06-18/client/elicitation] [INFERENCE: hard counters make the one-turn negotiation auditable while held-out measurements prevent arbitrary score thresholds from masquerading as calibration]

Next: radically simplify `INTENT_SIGNALS + RESOURCE_MAP` into a capability/type-directed minimum, proving which evidence, resource, and authority information cannot be removed.

### Iteration 6 — Capability/Type-Directed Minimal Contract

The deeper smell is premature, unobservable commitment: `defaultMode` can collapse no evidence, a policy prior, and execution into one field. A replacement must make the action boundary explicit with `single|orderedBundle|surfaceBundle|clarify|defer|reject`, not attach more confidence semantics to the same implicit commitment. [SOURCE: .opencode/skills/sk-doc/create-skill/references/parent_skill/parent_hub_router_schema.md:225] [SOURCE: .opencode/skills/sk-code/hub-router.json:4] [SOURCE: .opencode/skills/system-deep-loop/hub-router.json:4]

The minimal information-preserving architecture is `RouteRequest facts + content-addressed CompiledPolicy + typed RouteDecision`. Signals compile into evidence-producing lexical/command/surface detectors; resource maps collapse into registry and leaf-manifest selectors. A policy-pinned `modeId` derives packet, backend, authority, and default resources, while the decision carries only request-specific leaf ids, ordered target roles, evidence, alternatives, and replay hashes. [SOURCE: .opencode/skills/sk-code/mode-registry.json:5] [SOURCE: .opencode/skills/system-deep-loop/SKILL.md:38] [INFERENCE: policy-pinned indirection removes duplicated arrays without losing deterministic derivation]

Two dissimilar hubs falsify a smaller capability-only model. `sk-code` needs an acting workflow plus zero-or-more read-only surface packets in order, so single-target capability routing loses bundle role and authority. `system-deep-loop` has three distinct public improvement modes sharing one packet, so packet path cannot stand in for the public/runtime discriminator. Some lexical, command, or surface detection boundary therefore remains irreducible even if its tables are compiled. [SOURCE: .opencode/skills/sk-code/SKILL.md:57] [SOURCE: .opencode/skills/sk-code/SKILL.md:120] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:104] [SOURCE: .opencode/skills/system-deep-loop/mode-registry.json:152]

Next: run the forced seventh frame-break, treating `defaultMode` as irreversible, unobservable commitment and testing proof-carrying or speculative/reversible route plans.

### Iteration 7 — Proof-Carrying Prepare/Verify/Commit

The final divergence pass replaces one opaque commitment with three stages. `PREPARE` may parse, classify, load read-only evidence, validate resources, and simulate side-effect-free checks. It emits a short-lived proof binding the request, policy and registry hashes, read set, ordered target roles, evidence, authority class, preconditions, expiry, and idempotency key. The proof is locally checkable evidence, never a capability. [SOURCE: https://www.usenix.org/legacy/publications/library/proceedings/osdi96/full_papers/necula/html/node1.html] [SOURCE: https://kubernetes.io/docs/reference/using-api/api-concepts/] [SOURCE: .opencode/skills/sk-code/mode-registry.json:17]

`VERIFY` belongs to the destination-local resolver. Immediately before the first side effect it rechecks every version and current authority; a changed request, policy, registry, resource, target, precondition, authorization, or expiry yields `STALE_PROOF` and recomputation, bounded clarification, defer, or reject. [SOURCE: https://kubernetes.io/docs/reference/using-api/api-concepts/] [SOURCE: .opencode/skills/sk-code/SKILL.md:124]

`COMMIT` is narrow. A `[code-review, code-webflow]` bundle can prepare ordered read-only evidence, but mutation-capable `quality` cannot speculate `Edit` or write-capable `Bash`. After one mutating leg commits, later legs require fresh proofs. PostgreSQL shows why preparation must not hold locks or leases: preparation is short-lived and reservation-free; post-commit recovery is destination-owned rollback or compensation. [SOURCE: .opencode/skills/sk-code/SKILL.md:57] [SOURCE: .opencode/skills/sk-code/mode-registry.json:23] [SOURCE: https://www.postgresql.org/docs/current/sql-prepare-transaction.html]

Next: synthesize the seven-iteration lineage. No eighth iteration is proposed.

## 15. Convergence Report

- Stop reason: maxIterationsReached (stopPolicy=max-iterations)
- Total iterations: 7 of 7
- Questions answered: 5 / 5
- Remaining charter questions: 0
- Findings: 35 reducer-indexed findings, five per iteration
- New-information ratios: 1.00, 1.00, 1.00, 1.00, 0.80, 1.00, 0.90
- Average new-information ratio: 0.96
- Last three iteration summaries: run 5 calibrated one-turn negotiation (0.80); run 6 capability/type-directed minimum (1.00); run 7 proof-carrying commitment boundary (0.90)
- Convergence threshold: 0.05; no iteration fell below it
- Early-stop telemetry: all charter questions were resolved after run 6, but the configured policy required the seventh lateral pass
- Graph convergence: no graph events were available; recorded as no_graph_events
- Divergence: no formal pivot transaction; seven manually broadened focus tracks
- Iteration failures/timeouts: 0

## 16. Next Steps

1. Create an implementation packet for P0-1 through P0-3: schema, compatibility compiler, and destination-local verification.
2. Freeze a route-gold corpus before changing serving behavior. Include composite, same-packet, negative, handoff, stale-proof, and mutation cases.
3. Shadow the compiled decision beside the current hub-router and require byte-level replay plus explicit intentional-difference records.
4. Pilot sk-code, because it exercises ordered workflow/surface roles and mutation boundaries in one hub.
5. Add the privacy-reviewed calibration and interaction corpus before choosing confidence, clarification, expiry, or retry numbers.
6. Only after parity and authority gates hold, evaluate immutable adaptive overlays and explicit promotion governance.

## 17. References

Canonical synthesis: this file. Iteration evidence: iterations/iteration-001.md through iterations/iteration-007.md. Machine state: deep-research-state.jsonl, findings-registry.json, deep-research-dashboard.md, and deep-research-strategy.md. Primary source paths and external authorities are enumerated in Section 13 and cited at the load-bearing claims in Sections 3–14.
