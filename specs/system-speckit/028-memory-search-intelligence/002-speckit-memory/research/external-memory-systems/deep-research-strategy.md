---
title: Deep Research Strategy - External Memory Systems Mining
description: Session tracking for mining Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for Memory MCP search-intelligence improvements.
trigger_phrases:
  - "deep research strategy"
  - "memory systems mining strategy"
  - "mem0 graphiti letta cognee research session"
importance_tier: normal
contextType: planning
---

# Deep Research Strategy - Session Tracking

## 1. OVERVIEW

### Purpose
Persistent brain for the external-memory-systems mining session. Records key questions, focus decisions, and outcomes across 40 iterations run as a 4-model sweep.

---

## 2. TOPIC
Mine four external agent-memory systems vendored under `.opencode/specs/system-speckit/028-memory-search-intelligence/external/` — **Mem0** (`mem0/`, LLM fact-extraction + add/search/update/delete + consolidation/scoring), **Graphiti/Zep** (`graphiti/`, bi-temporal fact graph + fact-invalidation + episode provenance + hybrid retrieval), **Letta/MemGPT** (`letta/`, self-editing memory tiers: core blocks + archival + recall), **Cognee** (`cognee/`, entity-extraction ECL pipeline → knowledge graph) — for evidence-backed, code-mapped, NOVELTY-DIFFED improvements to the Spec-Kit Memory MCP (`.opencode/skills/system-spec-kit/mcp_server/`), Skill-Advisor fusion, and Deep-Loop continuity. The hard bar: every candidate is tagged EXTENDS / NET-NEW / NO-TRANSFER vs already-mined work (aionforge + galadriel in 028; OpenLTM + memclaw in 027).

### Model sweep (4 lineages x 10 iters = 40)
- **DeepSeek v4 Pro** (`deepseek/deepseek-v4-pro --variant high`): deep-extract the hardest algorithmic cores (Graphiti bi-temporal invalidation, Mem0 memory-update/consolidation, scoring/ranking math).
- **MiMo v2.5 Pro** (`xiaomi/mimo-v2.5-pro --variant high`, 1M ctx): broad cross-system sweep — read all 4 systems, map the technique landscape, cross-system synthesis.
- **Kimi K2.7** (`kimi-for-coding/k2p7 --variant high`, 256k): seam-map each technique onto our TS internals (file:line targets).
- **Opus 4.8** (claude2, read-only): adversarial-verify candidates + novelty-diff vs already-mined + GO/no-go synthesis.

---

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Q1: Mem0 — what does its LLM memory extraction + add/update/delete + consolidation/scoring add beyond aionforge's consolidation + the Memory MCP save path? Where would it map (`mcp_server/.../save`, `rrf-fusion.ts`)?
- [ ] Q2: Graphiti — does its bi-temporal fact graph + fact-invalidation-over-time SUPERSEDE or EXTEND 028's bi-temporal candidates (C3-x) and contradiction-detection? Cite Graphiti + internal `temporal-edges.ts`/`contradiction-detection.ts`.
- [ ] Q3: Graphiti — does its hybrid retrieval (semantic + keyword + graph traversal fusion) add a fusion technique beyond the 5-channel RRF / Advisor fusion?
- [ ] Q4: Letta/MemGPT — do self-editing memory tiers (core in-context blocks + archival + recall + char-limit eviction) map to Memory recall assembly / context budgeting / dominance cap (C7-A)?
- [ ] Q5: Cognee — does its ECL (extract-cognify-load) pipeline + entity extraction add a graph-build / dedup technique for the causal graph?
- [ ] Q6: Across all four — ranking/scoring + determinism (Mem0 relevance scoring, Graphiti edge weighting, content-addressed memory ids) → Memory ranking determinism (C5) + Advisor.
- [ ] Q7: Forgetting/decay/contradiction-resolution (Mem0 selective forgetting, Graphiti invalidation) → Memory retention / forget-allowlist / FSRS.
- [ ] Q8: NOVELTY GATE — what do these four encode that aionforge/galadriel (028) + OpenLTM/memclaw (027) do NOT already cover? Refute re-discoveries.
- [ ] Q9: Cross-cutting — which techniques generalize to Deep-Loop continuity (episode provenance, self-editing memory) + Skill-Advisor?
- [ ] Q10: Which candidates are GO (additive/reversible) vs NEEDS-BENCHMARK vs NO-TRANSFER, ranked by leverage x effort?

<!-- /ANCHOR:key-questions -->

---

## 4. NON-GOALS
- Implementing any candidate (deferred to a later packet).
- Modifying the external reference systems.
- Code-search / code-graph as a primary lens (operator scoped to memory systems).

---

## 5. STOP CONDITIONS
- All key questions have evidence-backed, code-mapped, novelty-tagged answers.
- 40 iterations reached (ceiling).
- Genuine saturation: newInfoRatio below 0.02 across the rolling window AND no unexplored frontier after a broadening attempt. Mark saturation; do not pad.

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
Q1: Mem0 — what does its LLM memory extraction + add/update/delete + consolidation/scoring add beyond aionforge's consolidation + the Memory MCP save path? Where would it map (`mcp_server/.../save`, `rrf-fusion.ts`)?

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->

---

## 12. KNOWN CONTEXT
Already-mined (do NOT re-surface as net-new): aionforge (Rust retrieval substrate, consolidation, bi-temporal, decay) + galadriel (memory-palace, prompt-cache) in 028; OpenLTM (trigger semantics, observability, continuity) + memclaw (idempotency, provenance, tombstones, reducers) in 027. The four new systems are Apache-2.0, vendored, full source. Novelty-diff is the load-bearing discipline.

---

## 13. RESEARCH BOUNDARIES
- Max iterations: 40 (4 model lineages x 10)
- Convergence threshold: 0.02
- Per-iteration budget: 12 tool calls, 10 minutes
- Progressive synthesis: true
- research/research.md ownership: workflow-owned canonical synthesis output
- Lifecycle branches: `resume`, `restart` (live); `fork`, `completed-continue` (deferred)
- Machine-owned sections: reducer controls Sections 3, 6, 7-11
- Canonical pause sentinel: `research/.deep-research-pause`
- Current generation: 1
- Started: 2026-06-17T09:30:00Z
