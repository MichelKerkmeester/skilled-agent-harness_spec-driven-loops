---
title: "Feature Specification: Deep-Dive — No-Wrong-Door Bounded Handoff"
description: "Five-iteration SOL xhigh-fast deep-research lineage on a no-wrong-door routing protocol where any mode can accept intake and offer a typed transfer through a bounded INTAKE→OFFERED→ACCEPTED→ACTIVE state machine, where acceptance transfers execution ownership but is distinct from completion, authority stays destination-local via a short-lived scoped lease, and cost is bounded by an idempotent transfer id, visited-mode set, hop budget, deadline, and at most one clarification turn — used only on the ambiguous path, never replacing confident one-shot routes."
trigger_phrases:
  - "no wrong door handoff deep dive"
  - "bounded routing handoff protocol"
  - "acceptance vs completion routing"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: No-Wrong-Door Bounded Handoff

## EXECUTIVE SUMMARY

Iteration 4 of `sol-oob` designed a bounded handoff protocol that can replace one-shot classification on the ambiguous path only. It fuses four protocols — SIP REFER (acknowledged referral), A2A (typed task lifecycle), MCP elicitation (schema-bound clarification), and OAuth token exchange (scoped delegation) — into one small state machine where transfer, dialogue, execution, and authority stay distinct. This lineage hardens that protocol and tests its cost model.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-004.md` (includes the proposed state machine + minimum offer envelope) and lineage `research.md` §11(5). Cross-domain sources already gathered: RFC 3515, RFC 3261 (Max-Forwards), A2A, MCP elicitation, RFC 8693.

<!-- BEGIN GENERATED: deep-research/spec-findings -->
The five-iteration run recommends a durable, versioned transfer lineage only for an explicit ambiguous/defer result with a viable candidate. Confident single routes, ordered and surface bundles, idle/no-match outcomes, dependency failures, and unsafe degraded outcomes remain structurally outside the handoff subsystem and create no transfer, context fetch, lease, state write, or handoff event.

Acceptance is the atomic ownership commit, not completion or activation. The destination transaction records the owner, exact offer decision, acceptance receipt, and a narrowed destination-local lease with a monotonically increasing fence. The source may observe after acceptance but cannot resume execution authority. A strict default hop budget of one is the only profile that supports the literal one-candidate-round-trip claim; at most one schema-bound clarification yields at most two semantic revisions, four candidate control messages, and one added user reply.

The final protocol separates transfer, attempt, revision, delivery, trace, lease, fence, and effect identities. Closed-schema I-JSON offers are canonicalized with RFC 8785 JCS and hashed; same idempotency key with changed content fails closed. Context uses authorized, content-addressed, size-capped references rather than raw prompts or answers. Every effect revalidates holder, state, scope, tool, policy pins, expiry, fence, and effect id. Structural bounds are proven, while acceptable latency, byte caps, recovery yield, and failure amplification remain corpus-backed empirical decisions. See `research/research.md` for the canonical synthesis and `research/resource-map.md` for evidence coverage.
<!-- END GENERATED: deep-research/spec-findings -->

### Idea-specific agenda (deepen, do not survey)
1. **State machine.** Harden `INTAKE→OFFERED→ACCEPTED→ACTIVE→terminal` with `REJECTED`/`NEEDS_INPUT`/`TIMED_OUT` transitions and required effects per state.
2. **Offer envelope.** Finalize `{transferId, sourceMode, candidateMode, requestDigest, intentSummary, requiredCapability, operationClass, contextRefs, policyHashes, visitedModes, hopBudget, deadline}`; idempotency and loop bounds.
3. **Authority.** Destination validates registry membership + `toolSurface` then acquires a short-lived scoped lease; acceptance ≠ completion; no widening of the destination's declared tools.
4. **Cost model.** Prove structural bounds (one offer round trip + at most one clarification) and define the empirical measurements (acceptance rate, clarification frequency, added turns, transferred bytes, cycle rejections, wrong-authority prevention).
5. **Boundary with confident routes.** Confident routes stay one-shot; only ambiguous/low-confidence routes enter the protocol.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the state machine, envelope, authority, cost model, and boundary.
- Out: implementation; a request corpus (measurement is flagged, not performed); re-deriving the shipped `defaultMode` answer.
