---
title: "Feature Specification: Deep-Dive — Typed No-Destination Outcomes"
description: "Five-iteration SOL xhigh-fast deep-research lineage on replacing the undifferentiated null / silent-default zero-signal case with a typed router-owned control result (idle / no-match / dependency-failure / degraded-fallback / handoff-required plus defer / clarify), borrowing state distinctions from OS idle, IP no-route, DNS NXDOMAIN/NODATA, load-balancer fail-open, and no-wrong-door intake, with policy-versioned negative caching and a fail-open posture that is visible and forbidden for mutation-capable requests."
trigger_phrases:
  - "typed no-destination deep dive"
  - "no route control outcomes"
  - "typed defer instead of null"
importance_tier: "important"
contextType: "research"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-core + level2-verify | v2.2 -->
<!-- SPECKIT_LEVEL: 2 -->

# Deep-Dive: Typed No-Destination Outcomes

## EXECUTIVE SUMMARY

Iteration 3 of `sol-oob` showed that "no destination" is not one state. Five routing domains each handle it differently, and their *state distinctions* (not their mechanics) transfer to a typed, router-owned control result. This lineage designs that typed negative-control contract and how it replaces `defaultMode: null` as the zero-signal representation.

## 3. RESEARCH CONTEXT

Seed evidence (do NOT re-derive): `../../002-default-mode-policy-research/research/lineages/sol-oob/iterations/iteration-003.md` and lineage `research.md` §4.3, §11(1). Cross-domain sources already gathered: Linux cpuidle, RFC 4191, RFC 9520, AWS NLB fail-open, Australian no-wrong-door referral guidance.

### Idea-specific agenda (deepen, do not survey)
1. **The typed enum.** Define each outcome precisely — `idle`, `no-match`, `dependency-failure`, `degraded-fallback`, `handoff-required`, plus `defer` / `clarify` — with the exact condition that produces it.
2. **Default-as-bounded-route.** Specify when a named default is legal (an explicit capability-bounded route that cannot manufacture evidence) versus when the router must abstain with a reason.
3. **Negative-decision caching.** Keyed to normalized request signature + policy hashes + reason code + expiry; invalidated on registry/policy change; must never turn a cached abstention into a default child.
4. **Fail-open posture.** When degraded fail-open is visible and permitted, and why it is unsafe for mutation-capable requests.
5. **Schema replacement.** How the typed outcome replaces `defaultMode: null` in the hub-router schema, and the route-gold fixtures needed to test each outcome.

### MANDATORY cross-cutting evaluation (every iteration MUST address all three)

Beyond the idea-specific agenda, each iteration must explicitly evaluate this idea along three separated dimensions:

1. **System skill advisor integration** — how the idea interacts with, depends on, or changes the Layer-0 advisor (`system-skill-advisor`): its recommendation, scoring/fusion, mode projections, and calibration/telemetry. State what the advisor must expose or consume for the idea to work, and what degrades if the advisor is absent or stale.
2. **Benchmark integration** — how the idea interacts with the deterministic route-gold / skill-benchmark machinery: replay determinism, typed gold, the offline oracle, and drift guards. State the new fixtures or scorer contracts it needs and whether it preserves byte-identical deterministic replay.
3. **Standalone effectiveness on documents alone** — how effective the idea is with NEITHER the advisor NOR the benchmark present: purely an AI reading the `SKILL.md` + skill docs (the INTENT_SIGNALS / RESOURCE_MAP prose, hub/mode docs) and routing by hand. Does the idea still help, degrade gracefully, or become inert at the pure-document level? This is the primary lens the operator flagged — do not skip it.

### Deliverable
Per-iteration narrative in `research/`; findings feed this packet's `presentation.md` and the parent's combined synthesis.

## 4. SCOPE
- In: 5-iteration SOL xhigh-fast research on the typed outcomes, default-as-route rule, negative caching, fail-open posture, and schema replacement.
- Out: implementation; editing the scorer; re-deriving the shipped `defaultMode` answer (this idea reframes what null *means*, it does not re-litigate the flips).
