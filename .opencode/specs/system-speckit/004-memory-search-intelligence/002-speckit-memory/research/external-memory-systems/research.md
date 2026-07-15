---
title: "Research Report: External Memory Systems — Search-Intelligence Mining (028 child 007)"
description: "4-model mining of Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for novelty-diffed Memory MCP (+ Advisor, Deep-Loop) improvements. PARTIAL — first wave banked (3-4 systems), remaining iterations handed off."
trigger_phrases:
  - "028 memory systems research report"
  - "mem0 graphiti letta cognee findings"
  - "agent memory search intelligence mining"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "system-speckit/004-memory-search-intelligence/007-memory-systems"
    last_updated_at: "2026-06-17T13:10:00Z"
    last_updated_by: "claude-opus-4-8"
    recent_action: "CLOSED at 22/40 (saturation); synthesis/06 + roadmap addendum + 00-index written"
    next_safe_action: "Done — implementation is a separate later packet (028 §3); nothing to resume"
    blockers: []
    key_files:
      - "research/research.md"
      - "../spec.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-06-17-028-007-memory-systems"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---

# Research Report: External Memory Systems — Search-Intelligence Mining

> **Status: CLOSED at 22/40 (honest saturation point) — synthesis written.** 4-model sweep (DeepSeek v4 Pro · MiMo v2.5 Pro · Kimi K2.7 · Opus 4.8 native) mining Mem0, Graphiti/Zep, Letta/MemGPT, Cognee for Memory MCP (+ Advisor fusion, Deep-Loop continuity). Every candidate novelty-tagged vs already-mined work (aionforge + galadriel [028]; OpenLTM + memclaw [027]). **Deliverable: `../../research/synthesis/06-memory-systems-findings.md` (before→after) + the roadmap addendum + the top-7 below.** Discovery saturated (Mem0/determinism veins returned 0 net-new); padding to 40 was deliberately declined per the strategy STOP CONDITION. Research-only — implementation is a separate later packet.

> **Reconciled with 027/002 (015-019), 2026-06-17 — verdict MINOR-EDITS.** A fresh 3-seat Opus council checked this roadmap against the concurrently-shipped 027/002 search-intelligence work. **8/11 candidate "Before"s pristine, 0 already-built, spearhead + both initiatives untouched.** Two stale Befores: **#6 LT-compaction-fallback-ladder** (017/001 already shipped ~70% of the truncation ladder — content-trim + count-floor + metadata-stubs + binary-search compaction; only the LLM-summarize rung is net-new) and **CG-question-type-router** (a query-*complexity* router is now live via 017/003 `SPECKIT_COMPLEXITY_ROUTER`; my query-*type* router extends it). Plus: 027/015 fixed the broken request-quality gate, so the "no benefit numbers" caveat is now a **cleared blocker (measurable once the reindex runs)**, reindex is **gate-zero**, and 027's correctness-always-on / intelligence-shadow-gated doctrine should overlay the Wave tiers. 016 (independent Opus research) **converged** with this campaign on cold-tier/reranker/fusion-channel conclusions. Full ledger: `../../research/synthesis/07-reconciliation-with-027-002.md`.

## Progress (banked)
| Iter | Model | System | Candidates | Status |
|---|---|---|---|---|
| 1 | DeepSeek v4 Pro | Mem0 | 5 | ✅ banked |
| 2 | Opus 4.8 (claude2) | Cognee | 8 (+novelty-diff) | ✅ banked |
| 3 | MiMo v2.5 Pro | Graphiti/Zep | 6 | ✅ banked |
| 4 | DeepSeek (Kimi reassigned — timed out 2×) | Letta/MemGPT | 5 | ✅ banked |
| 5 | Kimi K2.7 (fix proven: tight+1200s+no-variant) | Letta (cross-check) | 1 | ✅ banked |
| 6 | **Opus 4.8 NATIVE** (Agent `model:opus`, not claude2) | adversarial-verify (all systems) | verdicts | ✅ banked |
| 7 | DeepSeek v4 Pro | Mem0 merge/scoring (deep) | 1 NET-NEW + 2 NO-TRANSFER (saturated) | ✅ banked |
| 8 | MiMo v2.5 Pro | Graphiti community + Cognee retrievers | 8 (5 NET-NEW) | ✅ banked |
| 9 | **Opus 4.8 NATIVE** | verify-2 (iter-1..5 remainder) | 7 GO / 5 REFINE / 0 refute | ✅ banked |
| 10 | **Opus 4.8 NATIVE** | blast-radius `GR-llm-fact-invalidation` | GO-scoped (SMALL, reader-transparent) | ✅ banked |
| 11 | DeepSeek v4 Pro | Cognee retriever internals (agentic/lexical/NL) | 2 NET-NEW + 2 EXTENDS + 1 no-transfer | ✅ banked |
| 12 | MiMo v2.5 Pro | Letta tiers/budgeting + Cognee summary | 2 NET-NEW + 2 EXTENDS + 1 dup | ✅ banked |
| 13 | **Opus 4.8 NATIVE** | verify iter-8 (Cognee/community) | **3 REFUTE / 2 GO / 2 REFINE** (major correction) | ✅ banked |
| 14 | **Opus 4.8 NATIVE** | cross-cutting → Advisor + Deep-Loop (Q9) | 4 deep-loop + 2 advisor + 4 no-transfer | ✅ banked |
| 15 | DeepSeek v4 Pro | forgetting/decay/contradiction (Q7) | 2 new (1× H/S) + 3 overlap/gated | ✅ banked |
| 16 | MiMo v2.5 Pro | ranking determinism (Q6) | **0 new — internal C5 already complete** | ✅ banked |
| 17 | **Opus 4.8 NATIVE** | verify iter-11/12 NET-NEWs | 2 GO + 2 REFINE + merge confirmed | ✅ banked |
| 18 | **Opus 4.8 NATIVE** | consolidation + tiering (synthesis input) | 5 merges, Wave-0/1/2, top-7 | ✅ banked |
| 19 | DeepSeek v4 Pro | Cognee ECL ingest + retriever depth | 1 cheap win + 2 → semantic-edge-layer | ✅ banked |
| 20 | MiMo v2.5 Pro | Letta sleep-time / archival / blocks | 3 → async-sleeptime-consolidation + governor | ✅ banked |
| 21 | **Opus 4.8 NATIVE** | Graphiti dedup + verify iter-15 invalidation | 2 GO + 1 Wave-2 + semantic-edge convergence | ✅ banked |
| 22 | **Opus 4.8 NATIVE** | blast-radius scope top-3 GOs | 2 effort corrections (L not H/L · L not M/M) | ✅ banked |

**~60 candidates surfaced across all 4 systems (net of refutes); all 4 model contracts proven (22 of 40 iters complete). Wave 19-22 frontier was genuinely productive — two new initiatives + roadmap effort corrections (below).** Per-iteration detail: `iterations/iteration-0{01..10}.md` + `deltas/iter-0{01..10}.jsonl`. **Iter-6 native-Opus adversarial-verify (net-deflationary): 1 REFUTED — `CG-composite-edge-dedup` is already implemented (insertEdge superset key); 2 DOWNGRADED NET-NEW→EXTENDS (`CG-uuid5-entity-merge`, `M0-adaptive-additive-fusion`); 1 clean GO (`GR-llm-fact-invalidation`); 1 REFUTE-as-framed (`LT-self-edit-char-limit-blocks`). Iter-9 verify-2 settled the remainder (7 GO, 0 hard-refutes; `CG-incremental-edge-merge` re-scoped to perf-only). Iter-10 scoped the spearhead: `GR-llm-fact-invalidation` event-time-close half = SMALL + reader-transparent, fits C3-A, no C3-B. Systemic caveat: the internal causal graph is memory-ID→memory-ID, NOT entity-node, and there is NO episode model — every Cognee/Graphiti community/episode `maps_to` carries a structural prerequisite.**

## Top picks so far (by leverage × effort)
- **CG-uuid5-entity-merge** (Cognee, NET-NEW, **H/S**) — deterministic `uuid5(normalized-name)` entity identity → same name auto-merges at write, zero LLM. → causal-graph entity creation.
- **CG-composite-edge-dedup** (Cognee, NET-NEW, **H/S**) — edges dedup on `src+rel+tgt` key → idempotent relationship writes. → `causal-edges.ts`.
- **GR-llm-fact-invalidation** (Graphiti, EXTENDS C3-A/B, **H/M**) — LLM-discovered contradictions close old edges with event-time `invalid_at = new.valid_at` (vs internal rule-based `invalid_at = now()`).
- **M0-entity-store-boost** (Mem0, NET-NEW, H/M) — separate entity vector index boosting linked memories at search.
- **GR-fact-embedding-on-edge** (Graphiti, NET-NEW, M/M) — semantic embedding on edges → semantic edge dedup + similarity edge retrieval.
- **CG-iterative-context-extension** (Cognee, NET-NEW, H/M) — answer-as-next-query graph retrieval with convergence stop.

> **⚠ Corrected by iter-6 native-Opus adversarial-verify (vs live internal code):** `CG-composite-edge-dedup` is **REFUTED** (already implemented — drop it). `CG-uuid5-entity-merge` is **EXTENDS not NET-NEW** (entity_catalog already merges on normalized canonical name) and is mis-mapped (causal graph is memory-ID, not entity-node). The durable spearhead is **`GR-llm-fact-invalidation`** (event-time-close half = small, well-scoped GO). Treat any candidate whose `maps_to` assumes an entity-node graph as needing a memory-ID-graph reframe first.

## Per-system findings
- **Mem0** (iter 1): entity-store boost, adaptive channel-gated additive fusion (alt to RRF), query-length-adaptive BM25 sigmoid (EXTENDS aionforge), entity cardinality penalty, LLM memory-linking at extraction (EXTENDS memclaw).
- **Cognee** (iter 2): uuid5 entity-merge, composite-edge dedup, incremental edge merge, ontology canonicalization, iterative context-extension retrieval, neighborhood rescore ranking (EXTENDS Mem0), cascade extraction (EXTENDS Mem0), schema-driven edges. Supersedes Mem0's dedup half (zero-LLM).
- **Graphiti** (iter 3): 5-timestamp edge (EXTENDS C3-B), LLM fact-invalidation (EXTENDS C3-A/B), episode provenance, fact-embedding-on-edge, episode-window context; **NO-TRANSFER** on 3-channel RRF (ours is a superset).

---

<!-- ANCHOR:research-citations -->
## Research Citations

- Source: `spec.md`
- Source: `research/iterations/iteration-001.md` through `research/iterations/iteration-022.md`
- Source: `research/deltas/iter-001.jsonl` through `research/deltas/iter-022.jsonl`
- Source: `../research/synthesis/06-memory-systems-findings.md`
- Source: `../research/synthesis/07-reconciliation-with-027-002.md`
<!-- /ANCHOR:research-citations -->
