---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Parent-hub routing, out-of-box run 3: radical lateral rethinks over the Out-of-Box Agenda in the packet spec.md.
- Started: 2026-07-18T03:31:09Z
- Status: COMPLETE
- Iteration: 7 of 7
- Session ID: fanout-sol-oob-1784345122095-1gku9b
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Abolish the hub-router layer: test direct Layer-0-to-mode selection against packet modularity, local routing context, and authority boundaries. | architecture | 1.00 | 5 | complete |
| 2 | Design and stress-test a deterministic/adaptive hybrid using a versioned correction overlay and replayable learning loop. | adaptive-routing | 1.00 | 5 | complete |
| 3 | Compare cross-domain no-destination semantics and extract transferable mechanisms for skill routing. | cross-domain-semantics | 1.00 | 5 | complete |
| 4 | Specify and stress-test a no-wrong-door protocol where a mode can accept intake and offer a typed transfer, while execution authority remains with the destination packet. | recoverable-handoff | 1.00 | 5 | complete |
| 5 | Formalize the zero-signal branch as a one-turn negotiation with calibrated confidence, compressed options, typed clarification, and a measurable friction budget; test whether confidence-first routing subsumes default, defer, and detection archetypes. | calibrated-negotiation | 0.80 | 5 | complete |
| 6 | Falsify a capability/type-directed replacement for INTENT_SIGNALS plus RESOURCE_MAP across the composite sk-code hub and the flat system-deep-loop hub, preserving only irreducible routing information. | minimal-routing-contract | 1.00 | 5 | complete |
| 7 | Treat defaultMode as a symptom of irreversible, unobservable commitment and falsify proof-carrying, speculative, reversible route plans. | reversible-routing | 0.90 | 5 | complete |

- iterationsCompleted: 7
- keyFindings: 35
- openQuestions: 0
- resolvedQuestions: 5

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 5/5
- [x] Can Layer 0 safely eliminate hub-local routing while preserving modular packets, local context loading, and explicit authority boundaries?
- [x] What deterministic/adaptive hybrid could learn from routing corrections without making offline replay irreproducible?
- [x] Which no-destination semantics from other routing systems transfer, and what do they imply for abstention, defaults, and failure visibility?
- [x] Can recoverable handoffs or typed dialogue replace one-shot classification without unacceptable latency and context cost?
- [x] What deeper architecture smell does `defaultMode` expose, and what minimal confidence or contract model could replace `INTENT_SIGNALS` plus `RESOURCE_MAP`?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 0
- None

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: ██████████▇▅▂▂▄▆█▇▆▅
- score sparkline: ██████████▇▅▂▂▄▆█▇▆▅
- Last 3 ratios: 0.80 -> 1.00 -> 0.90
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.90
- coverageBySources: {"a2a-protocol.org":1,"arxiv.org":2,"code":69,"docs.aws.amazon.com":1,"kubernetes.io":1,"modelcontextprotocol.io":1,"www.kernel.org":1,"www.modernslavery.gov.au":1,"www.postgresql.org":1,"www.rfc-editor.org":5,"www.usenix.org":1}
- Advisory events: none

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- A one-field `workflowMode` handoff cannot represent ordered bundles, surfaces, fallback resources, confidence, or defer semantics. Treating it as a complete replacement is a dead end unless the handoff becomes a typed route plan. (iteration 1)
- Fully removing hub-local resolution while leaving Layer 0 unchanged: metadata-routed modes are not generally projected to the advisor, and composite local outcomes would be lost. (iteration 1)
- Promoting every nested packet to an independent advisor identity: this contradicts the deliberate single graph identity and makes advisor-invisible evidence packets independently routable. (iteration 1)
- Replacing deterministic router replay with live-only evaluation: this removes the current offline CI oracle rather than replacing it. (iteration 1)
- Automatically promoting every bounded calibration proposal: the current proposal contract freezes live weights and requires held-out validation, so automatic promotion would erase an intentional safety boundary. (iteration 2)
- Mutating live weights or router rules immediately after each correction: this makes the effective policy time-dependent and repeats the blocked live-only evaluation direction. (iteration 2)
- Reusing `shadow-deltas.jsonl` as the complete offline oracle. It can compare scores for an HMAC-keyed invocation, but it cannot replay raw feature extraction and does not identify an immutable base/overlay pair. (iteration 2)
- Treating prompt-free accepted/corrected outcome rows as per-intent gold fixtures: the telemetry contract explicitly prevents prompt or scenario reconstruction. (iteration 2)
- A universal “always fail closed” or “always fail open” law is a dead end. The sources instead make the choice conditional on outcome type, destination capability, and the cost of retry versus wrong execution. (iteration 3)
- Copying domain mechanisms literally—CPU idle loops, routing-table prefixes, DNS TTL syntax, or health-check algorithms—adds machinery without improving the skill-routing contract. (iteration 3)
- Transferring load-balancer fail-open behavior to mutation-capable skill requests: routing to a known-unhealthy target trades correctness for availability, a trade that is not safe when a wrong mode can mutate state. (iteration 3)
- Treating every no-destination state as the same null/default outcome: the authoritative sources distinguish absence of work, absence of a route, useful negative answers, dependency failure, unhealthy destinations, and wrong initial contact. (iteration 3)
- Using a default mode as an unlabelled substitute for absent evidence: IP defaults remain real bounded routes, and the absence of both specific and default routes stays visible. (iteration 3)
- Full-transcript peer handoff: it makes context cost grow with conversation length and transfers unrelated or sensitive material when structured slots and references suffice. (iteration 4)
- Generic rollback after destination mutation: cancellation is not guaranteed even in A2A, so post-execution recovery must be defined by the destination workflow rather than fabricated by the router. (iteration 4)
- Treating `ACCEPTED` as `COMPLETED`: SIP explicitly separates accepting REFER from the later status of the referred action. (iteration 4)
- Unbounded clarification or rerouting: MCP's rate-limit guidance and SIP's hop bound point to explicit budgets, not conversational recursion. (iteration 4)
- Copying one universal numerical threshold across hubs without held-out risk/coverage evidence. (iteration 5)
- Letting a confidence controller replace capability validation, resource loading, or packet authority. (iteration 5)
- Presenting the whole mode registry as a clarification menu; compression is part of the contract. (iteration 5)
- Treating the advisor's `confidence` or top-two margin as a calibrated probability. (iteration 5)
- A single-target result with no target role or bundle order. (iteration 6)
- A solver whose only inputs are requested capability and a mode resource path. (iteration 6)
- Copying full authority and resource arrays into every route decision when the policy-pinned mode reference can derive them. (iteration 6)
- Deleting lexical/surface detection rather than compiling it into typed observations. (iteration 6)
- “Speculate everything, roll back on misroute”: external effects and some generated values are not reproducibly reversible. (iteration 7)
- Claiming atomic router-owned rollback across filesystem or external mutations. (iteration 7)
- Holding locks, tool leases, or reservations while a proof awaits commit. (iteration 7)
- Literal two-phase commit with long-lived reservations: lock and recovery-manager costs exceed routing needs. (iteration 7)
- One proof for a mutating ordered bundle: each commit changes later targets' state. (iteration 7)
- Reusing a proof after any bound input or precondition changes. (iteration 7)
- Treating a valid proof as execution authority. (iteration 7)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
[All tracked questions are resolved]

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
