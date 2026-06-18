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
- Topic: Mine the two external memory systems (aionforge-memory Rust, galadriel Python) for evidence-backed, code-mapped improvements to the Spec-Kit Memory MCP: query-class routing, edge-based bi-temporal currentness, deterministic idempotent async consolidation, rank-time-only decay, and byte-identical cache-friendly recall serialization. Map external techniques to the channel-fusion, save-path, recall-rendering, and causal-graph modules under .opencode/skills/system-spec-kit/mcp_server/, and rank candidates by leverage and effort.
- Started: 2026-06-16T14:35:00Z
- Status: IN_PROGRESS
- Iteration: 38 of 24
- Session ID: 2026-06-16-028-001-speckit-memory
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | baseline-map-and-q1-q2 | - | 0.92 | 13 | insight |
| undefined | save-path-and-causal-edges | - | 0.78 | 8 | insight |
| undefined | recall-serialization-and-degrade | - | 0.72 | 9 | insight |
| undefined | decay-and-diversity | - | 0.62 | 10 | insight |
| undefined | fusion-conflict-and-router-design | - | 0.72 | 12 | insight |
| undefined | cross-cutting-and-ranking | - | 0.55 | 9 | insight |
| undefined | galadriel-deepening-and-sequencing | - | 0.25 | 8 | insight |
| undefined | verify-convergence-bonus-channel-interdependence | - | 0.65 | 3 | insight |
| undefined | verify-rrf-k-tuning-coupling | - | 0.65 | 3 | insight |
| undefined | verify-c6a-fsrs-reinforcement-preservation | - | 0.65 | 3 | insight |
| undefined | mine-aionforge-retrieval-decay-for-memory | - | 0.35 | 8 | insight |
| undefined | mine-aionforge-forgetting-erasure-for-memory | - | 0.75 | 6 | insight |
| undefined | mine-aionforge-consolidation-capture-for-memory | - | 0.58 | 7 | insight |
| undefined | mine-aionforge-identifiers-provenance-for-memory | - | 0.75 | 7 | insight |
| undefined | mine-aionforge-core-procedural-memory-for-memory | - | 0.60 | 5 | insight |
| undefined | feasibility-memory-governance-retention | - | 0.70 | 5 | insight |
| undefined | feasibility-memory-determinism-fix-cluster | - | 0.75 | 8 | insight |
| undefined | feasibility-memory-procedural-consolidation | - | 0.70 | 5 | insight |
| undefined | mine-aionforge-security-namespace-redteam-for-memory | - | 0.40 | 4 | insight |
| undefined | verify-memory-determinism-fix-candidates | - | 0.55 | 3 | insight |
| undefined | verify-memory-procedural-candidates | - | 0.20 | 3 | insight |
| undefined | verify-determinism-spine-cross-system | - | 0.55 | 2 | insight |
| undefined | assess-memory-provenance-identity-hardening | - | 0.75 | 5 | insight |
| undefined | assess-memory-capture-and-recall-band | - | 0.70 | 4 | insight |
| undefined | assess-memory-consolidation-remainder | - | 0.70 | 3 | insight |
| undefined | verify-promote-off-state-meta-spine | - | 0.45 | 4 | insight |
| undefined | revalidate-top-ship-first-after-broadening | - | 0.40 | 3 | insight |
| undefined | completeness-critic-memory | - | 0.30 | 5 | insight |
| undefined | assess-cg1-cadence-and-galadriel-promptcache | - | 0.70 | 2 | insight |
| undefined | rust-ref-aionforge-consolidate | - | 0.85 | 7 | insight |
| undefined | rust-ref-aionforge-retrieval | - | 0.90 | 5 | insight |
| undefined | rust-ref-aionforge-forget | - | 0.85 | 3 | insight |
| undefined | rust-ref-aionforge-security-redteam | - | 0.90 | 5 | insight |
| undefined | impl-sketch-C9 | - | 0.45 | 2 | insight |
| undefined | validation-plan-C3-A | - | 0.70 | 2 | insight |
| undefined | impl-sketch-recall-trust-spine | - | 0.70 | 3 | insight |
| undefined | build-sequence-memory | - | 0.25 | 4 | insight |
| undefined | cross-system-shared-infra | - | 0.30 | 5 | insight |

- iterationsCompleted: 38
- keyFindings: 46
- openQuestions: 10
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/10
- [ ] Q1: Which of aionforge's 8 retrieval signals (BM25, lexical-anchor, dense ANN+rerank, support-expansion, Personalized-PageRank, recency, decay-at-rank-time importance, trust) improve the Memory MCP's 5-channel RRF, and which conflict? Where is channel fusion implemented?
- [ ] Q2: Does aionforge's 5-class query-class router (SingleHopFactual/MultiHop/Temporal/Entity/Quote → per-class RetrievalProfile weights, graph-expansion gating) apply to Memory recall, and where would the classifier + per-class weights live?
- [ ] Q3: How would edge-based bi-temporal currentness (SUPERSEDED_BY/CONTRADICTS edges + current-support provider) integrate with the existing causal graph and the off-state soft-delete tombstones? Where is the causal-graph store?
- [ ] Q4: Can the Memory save path split into fast episode-write + deterministic async consolidation with content-addressed idempotent IDs, without breaking continuity? Where is the save/index path?
- [ ] Q5: What is the minimal change to make recall serialization byte-identical (galadriel stable-prefix prompt-cache + aionforge content-derived SerializationId ordering)? Where is recall rendering?
- [ ] Q6: Can FSRS decay become a pure rank-time function (decay-at-rank-time, never written back)? Where is decay applied today?
- [ ] Q7: Does aionforge's session-diversity cap (demote single-session dominance) improve Memory recall mixing, and where is result assembly?
- [ ] Q8: Should recalled memory context be wrapped in an untrusted XML tag (injection-hardening), and where is context injected?
- [ ] Q9: How does graceful embedder-degrade (skip dense, keep lexical, report flag) map to the semantic-trigger fallback (off) and the vector channel?
- [ ] Q10: Which candidates generalize to code-graph / skill-advisor / deep-loop (cross-cutting spine: determinism, bi-temporal currentness, query-class routing, graceful degradation)?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 10
- [ ] Q1: Which of aionforge's 8 retrieval signals (BM25, lexical-anchor, dense ANN+rerank, support-expansion, Personalized-PageRank, recency, decay-at-rank-time importance, trust) improve the Memory MCP's 5-channel RRF, and which conflict? Where is channel fusion implemented?
- [ ] Q2: Does aionforge's 5-class query-class router (SingleHopFactual/MultiHop/Temporal/Entity/Quote → per-class RetrievalProfile weights, graph-expansion gating) apply to Memory recall, and where would the classifier + per-class weights live?
- [ ] Q3: How would edge-based bi-temporal currentness (SUPERSEDED_BY/CONTRADICTS edges + current-support provider) integrate with the existing causal graph and the off-state soft-delete tombstones? Where is the causal-graph store?
- [ ] Q4: Can the Memory save path split into fast episode-write + deterministic async consolidation with content-addressed idempotent IDs, without breaking continuity? Where is the save/index path?
- [ ] Q5: What is the minimal change to make recall serialization byte-identical (galadriel stable-prefix prompt-cache + aionforge content-derived SerializationId ordering)? Where is recall rendering?
- [ ] Q6: Can FSRS decay become a pure rank-time function (decay-at-rank-time, never written back)? Where is decay applied today?
- [ ] Q7: Does aionforge's session-diversity cap (demote single-session dominance) improve Memory recall mixing, and where is result assembly?
- [ ] Q8: Should recalled memory context be wrapped in an untrusted XML tag (injection-hardening), and where is context injected?
- [ ] Q9: How does graceful embedder-degrade (skip dense, keep lexical, report flag) map to the semantic-trigger fallback (off) and the vector channel?
- [ ] Q10: Which candidates generalize to code-graph / skill-advisor / deep-loop (cross-cutting spine: determinism, bi-temporal currentness, query-class routing, graceful degradation)?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.70 -> 0.25 -> 0.30
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.30
- coverageBySources: {}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- None yet

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Q1: Which of aionforge's 8 retrieval signals (BM25, lexical-anchor, dense ANN+rerank, support-expansion, Personalized-PageRank, recency, decay-at-rank-time importance, trust) improve the Memory MCP's 5-channel RRF, and which conflict? Where is channel fusion implemented?

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
