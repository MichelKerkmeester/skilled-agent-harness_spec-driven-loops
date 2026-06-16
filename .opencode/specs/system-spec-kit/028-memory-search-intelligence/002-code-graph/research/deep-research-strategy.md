---
title: Deep Research Strategy - Code Graph External Mining
description: Session tracking for mining aionforge + galadriel for code-graph improvements.
trigger_phrases:
  - "deep research strategy"
  - "code graph mining strategy"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW
### Purpose
Persistent brain for the code-graph external-mining session.

---

## 2. TOPIC
Mine AIONFORGE (`external/aionforge-memory-development/docs/bi-temporal-model.md`, `docs/consolidation.md`, `docs/retrieval.md`) and GALADRIEL (zero-token local retrieval) for improvements to the tree-sitter→SQLite code graph under `.opencode/skills/system-code-graph/`. Targets: incremental selective-reindex, parser quarantine, neighborhood/impact retrieval, edge-weight ranking, doc-lane extraction, readiness gates.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Can incremental selective-reindex supersede stale edges with closed validity windows (edge-presence currentness) instead of deleting, enabling as-of-last-green-scan impact queries? Map to aionforge bi-temporal-model.md. Where is the scan/edge-write path?
- [ ] Q2: Do content-addressed edge IDs + transient/fatal parse classification (quarantine-not-wedge) remove the single-poison-file scan wedge? Map to aionforge consolidation.md. Where is parser quarantine + edge-ID assignment?
- [ ] Q3: Does Personalized-PageRank seeding improve impact/neighborhood ranking over flat edge walks at acceptable cost? Map to aionforge retrieval.md PPR. Where is impact/neighborhood retrieval?
- [ ] Q4: Can edge-weight learning fold a rank-time reliability multiplier without corrupting the deterministic structural edges? Map to aionforge trust re-rank. Where are edge weights applied?
- [ ] Q5: Is a zero-token local doc-lane symbol pass worth adding (markdown/json/yaml symbols as graph nodes)? Map to galadriel zero-token retrieval. Where is the doc lane today?
- [ ] Q6: Should readiness become a hard generation watermark (stale=error) rather than a hint? Map to aionforge generation-checked maintained sets. Where are readiness gates?
- [ ] Q7: Which 001 cross-cutting primitives port here — determinism (content-derived render order + apply-once G2 invariant), query-class routing (same retrieval shapes), graceful degradation (graph_available:false vs throw)? (001 flagged code-graph as touched by ALL FOUR spines.)
- [ ] Q8: Does the shared `fuseResultsMulti {bonusOverChannels}` option + apply-once invariant from 001 belong in code-graph ranking?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate. Modifying external systems. Touching sibling subsystems.

---

## 5. STOP CONDITIONS
- All key questions evidence-backed + code-mapped. 12 iterations. Genuine saturation after a broadening attempt.

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
Q1: Can incremental selective-reindex supersede stale edges with closed validity windows (edge-presence currentness) instead of deleting, enabling as-of-last-green-scan impact queries? Map to aionforge bi-temporal-model.md. Where is the scan/edge-write path?

<!-- /ANCHOR:next-focus -->
<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
From 001 (memory) cross-cutting seed: code-graph is the highest-priority sibling (touched by all four spines — determinism, bi-temporal currentness, query-class routing, graceful degradation). Reusable artifacts: shared `fuseResultsMulti {bonusOverChannels}` option + apply-once G2 invariant; content-derived ordering; graph_available:false degrade pattern (consumer already at `memory-context.ts:1513`). Bi-temporal mapping: commit-time=event-time, scan-time=transaction-time; `supersedes` = refactor-superseded call edge; temporal-close vs tombstone = renamed-vs-deleted symbol.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 12 | Convergence threshold: 0.03 | Per-iteration: 12 tool calls, 10 min
- Progressive synthesis: true | research/research.md workflow-owned
- Machine-owned sections: reducer controls 3, 6, 7-11
- Current generation: 1 | Started: 2026-06-16T15:15:00Z
