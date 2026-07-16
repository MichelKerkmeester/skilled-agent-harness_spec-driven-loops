---
title: Deep Research Strategy - Spec-Kit Memory MCP External Mining
description: Session tracking for mining aionforge + galadriel for Memory MCP improvements.
trigger_phrases:
  - "deep research strategy"
  - "speckit memory mining strategy"
  - "memory mcp research session"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the Memory MCP external-mining research session. Records key questions, focus decisions, and outcomes across iterations.

---

## 2. TOPIC
Mine the two external memory systems under `.opencode/specs/system-speckit/029-memory-search-intelligence/external/` — AIONFORGE (Rust: `aionforge-memory-development/docs/retrieval.md`, `docs/bi-temporal-model.md`, `docs/consolidation.md`, `docs/decay-and-importance.md`) and GALADRIEL (Python: `galadriel-public-main 2/CACHING.md`, `README.md`, `harness/palace.py`) — for evidence-backed, code-mapped improvements to the Spec-Kit Memory MCP under `.opencode/skills/system-spec-kit/mcp_server/`. Target areas: hybrid 5-channel RRF retrieval (vector+FTS5+BM25+causal-graph+degree), FSRS power-law decay, causal graph, off-state soft-delete tombstones + idempotency receipts, and recall serialization.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
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

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate (deferred to a later packet).
- Modifying the external reference systems.
- Touching the code-graph, skill-advisor, or deep-loop subsystems (sibling phases own those).

---

## 5. STOP CONDITIONS
- All key questions have evidence-backed, code-mapped answers.
- 18 iterations reached (ceiling).
- Genuine saturation: newInfoRatio below 0.02 across the rolling window AND no unexplored frontier remains after a broadening attempt.

---

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

---

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
[None yet]

<!-- /ANCHOR:what-worked -->

---

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
[None yet]

<!-- /ANCHOR:what-failed -->

---

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
[No exhausted approach categories yet]

<!-- /ANCHOR:exhausted-approaches -->

---

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
[None yet]

<!-- /ANCHOR:ruled-out-directions -->

---

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Q1: Which of aionforge's 8 retrieval signals (BM25, lexical-anchor, dense ANN+rerank, support-expansion, Personalized-PageRank, recency, decay-at-rank-time importance, trust) improve the Memory MCP's 5-channel RRF, and which conflict? Where is channel fusion implemented?

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Pre-identified high-leverage mappings (verify against live code): aionforge query-class routing → Memory recall routing (none today); aionforge edge-based bi-temporal currentness → Memory causal graph + tombstones; aionforge deterministic async consolidation + content-addressed IDs → Memory save path + idempotency receipts; galadriel prompt-cache determinism + aionforge SerializationId → Memory recall serialization; aionforge decay-at-rank-time → FSRS decay. Cross-cutting spine: determinism/reproducibility, bi-temporal currentness, query-class routing, graceful degradation.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 18
- Convergence threshold: 0.02
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-06-16T14:35:00Z
