---
title: "Rerank Sidecar Arc — Phase Parent"
description: "Umbrella for the 5-phase arc that brings a shared Python cross-encoder reranker (Qwen3-Reranker-0.6B) to both mk-spec-memory and mk-coco-index via a new `system-rerank-sidecar` skill. Closes the gap where cross-encoder.ts has a pre-wired `local` HTTP provider slot but no sidecar runs at localhost:8765, leaving every memory_search at HIGH_THRESHOLD=0.7 with positional fallback scores capped at ~0.5 (quality=weak)."
trigger_phrases:
  - "rerank sidecar arc"
  - "qwen reranker spec-memory"
  - "system-rerank-sidecar skill"
  - "shared cross-encoder daemon"
  - "008 arc rerank"
  - "qwen3-reranker-0.6b"
importance_tier: "important"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/008-rerank-sidecar-arc"
    last_updated_at: "2026-05-20T19:00:00Z"
    last_updated_by: "main_agent"
    recent_action: "008+009 HOLD; 010 scaffolded; arc closes"
    next_safe_action: "Decide 010 execution or accept rerank as non-load-bearing"
    blockers: []
    key_files:
      - "006-cocoindex-dedup-from-shared-sidecar/spec.md"
---
<!-- SPECKIT_TEMPLATE_SOURCE: spec-phase-parent | v2.2 -->
# Rerank Sidecar Arc

<!-- SPECKIT_LEVEL: phase-parent -->
<!-- CONTENT DISCIPLINE: PHASE PARENT
  This is a lean phase-parent control file. Only {spec.md, description.json,
  graph-metadata.json} live here. Heavy docs (plan, tasks, checklist,
  implementation-summary, decision-record) live in each phase child where they
  stay accurate to that phase's actual work. Phase children own their own
  continuity ladders; resume on this parent first follows
  `graph-metadata.json.derived.last_active_child_id`, else lists children with
  statuses (per /spec_kit:resume step 3b).
-->

---

<!-- ANCHOR:root-purpose -->
## 1. ROOT PURPOSE

The mk-spec-memory MCP server has a fully-built Stage 3 reranker pipeline (`lib/search/cross-encoder.ts`, `lib/search/pipeline/stage3-rerank.ts`) with three provider slots: Voyage (cloud), Cohere (cloud), and **local at `http://localhost:8765/rerank`**. The local slot is the project's preferred path (local-first per ADR-014) but **no sidecar runs there today**. Result: every `memory_search` falls back to positional scoring capped at ~0.5, never crosses the `HIGH_THRESHOLD=0.7` quality gate, and reports `requestQuality: 'weak'` even on clean retrievals. The `WEIGHT_RERANKER=0.20` confidence factor is BOOLEAN (`hasReranker ? 1.0 : 0`), so the missing reranker drops max achievable result confidence from 1.00 to 0.80 across the board.

Cocoindex (the sibling code-search MCP) shipped `Qwen/Qwen3-Reranker-0.6B` as its Stage 2 default on 2026-05-20 (benchmark `mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/`). The same model, served from a shared local HTTP sidecar, would close the gap in spec-memory and let cocoindex stop loading its own copy — saving ~1.5 GB RAM. The shared sidecar lives in its own dedicated skill (`system-rerank-sidecar`) so removal of either MCP doesn't strand the other.

A second-opinion pass from `cli-codex gpt-5.5 xhigh` (recorded in the arc's research notes) surfaced three corrections that this arc folds in before any sidecar work: a flag-routing bug that makes the HTTP path unreachable today, a sigmoid-vs-raw-logits normalization gap, and the absence of a spec-memory-specific A/B benchmark to justify the model choice for memory text (vs. code chunks).
<!-- /ANCHOR:root-purpose -->

---

<!-- ANCHOR:phase-map -->
## 2. PHASE MAP

| Phase | Focus | Status |
|---|---|---|
| `001-flag-routing-fix-for-cross-encoder/` | Flag-routing fix for cross-encoder HTTP local provider | Planned |
| `002-system-rerank-sidecar-skill/` | system-rerank-sidecar skill | Complete |
| `003-ensure-sidecar-from-launchers/` | Ensure rerank sidecar from launchers | Planned |
| `004-spec-memory-rerank-benchmark/` | spec-memory rerank A/B benchmark | Complete — HOLD |
| `005-promote-qwen-as-default/` | Promote Qwen3-Reranker-0.6B as the spec-memory default | Complete (HOLD) |
| `006-cocoindex-dedup-from-shared-sidecar/` | Cocoindex dedup from shared rerank sidecar | Planned |
| `007-spec-memory-mps-rerank-promotion/` | spec-memory MPS rerank promotion candidate | Planned |
| `008-cap-rerank-top-k/` | cap spec-memory rerank top-k | Planned |
| `009-fp16-rerank/` | fp16 cross-encoder weights on MPS | Planned |
| `010-domain-tuned-reranker-finetune/` | domain-tuned reranker fine-tune for spec-memory corpus | Scaffolded (execution deferred) |
<!-- /ANCHOR:phase-map -->

---

## Cross-Cutting Invariants

Future maintainers MUST preserve these across all phases:

1. **Sidecar is independent infrastructure**, not owned by either MCP. Lives at `.opencode/skills/system-rerank-sidecar/`. Either MCP can run standalone (sidecar absent → falls back to positional scores; existing behavior); both MCPs run together (sidecar present → shared HTTP client).
2. **Self-electing primary at port level**. Each launcher probes `localhost:<port>/health`; spawns detached only if absent; attaches as HTTP client otherwise. Port-bind EADDRINUSE is the atomicity primitive (same shape as the file-lease pattern from packet 010/012, just at the port instead of the filesystem).
3. **Sigmoid-normalized output**. The sidecar returns scores in `[0,1]`, not raw cross-encoder logits. spec-memory's `cross-encoder.ts` clamps to `[0,1]` already; raw Qwen logits like `7.625` and `-11.375` would collapse to `{1.0, 0.0}` and destroy ranking signal. Sigmoid happens at the sidecar boundary.
4. **Apache-2.0 model only**. `Qwen/Qwen3-Reranker-0.6B` is Apache-2.0. The previous default jina-v3 was CC BY-NC 4.0 (non-commercial-only). The license shift is the load-bearing argument for the model choice; quality lift is secondary and must be verified per phase 004.
5. **Graceful degradation, never hard failure**. If sidecar is absent, unhealthy, OOM, or slow, the cross-encoder falls back to positional scores (`scoringMethod: 'fallback'`) and the search returns. No memory_search ever fails because the reranker is down.

---

<!-- ANCHOR:what-needs-done -->
## 3. WHAT NEEDS DONE

The arc converges when:

- Phase 001 makes `SPECKIT_CROSS_ENCODER=true` actually route to the HTTP local provider (verified by integration test).
- Phase 002 ships a `system-rerank-sidecar` skill that, when run standalone, accepts `POST /rerank {query, documents, top_k}` and returns `{results: [{index, relevance_score}]}` with sigmoid scores in `[0,1]`.
- Phase 003 makes both launchers idempotently ensure the sidecar before search calls; manual smoke-test confirms one-Qwen-loaded across both MCPs.
- Phase 004 produces a benchmark report comparing positional-fallback vs Qwen on spec-memory's corpus, with confidence intervals (n≥3, ideally n≥5).
- Phase 005 promotes Qwen to default ONLY IF phase 004's report shows a meaningful lift (definition: ≥3 hits/30 fixtures or ≥0.1 mean MRR delta with non-overlapping CIs). If 004 shows no lift, the sidecar still ships but stays opt-in via `SPECKIT_CROSS_ENCODER=true`. (Outcome: HOLD — phase 005 shipped opt-in path.)
- Phase 006 closes the arc's deduplication intent by retargeting cocoindex's rerank dispatch at the shared sidecar via `HttpSidecarRerankerAdapter`. Convergence requires `COCOINDEX_RERANK_VIA_SIDECAR=true` to drive cocoindex's reranker pipeline through `localhost:8765/rerank` with a clean fallback chain to the bundled adapter, plus an A/B benchmark vs the existing bundled baseline. PROMOTE flips the default and removes bundled `CrossEncoder` load at import time; HOLD ships the adapter as opt-in only.
<!-- /ANCHOR:what-needs-done -->

---

<!-- ANCHOR:related-docs -->
## RELATED DOCUMENTS

- **Phase children**: see sub-folders `001-flag-routing-fix-for-cross-encoder/`, `002-*/`, `003-*/`, `004-*/`, `005-*/`
- **Predecessor arc**: `../006-mcp-launcher-concurrency-arc/` (introduced the launcher-lease + IPC-bridge patterns that this arc mirrors at the port-bind level)
- **Sibling research**: cocoindex's benchmark at `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/benchmark-2026-05-20-expanded/benchmark_report.md` (the source of the Qwen3-Reranker-0.6B model choice)
- **Discussion record**: gpt-5.5 xhigh second-opinion captured in `001-*/decision-record.md` (planned) — surfaced the flag-routing bug + sigmoid-normalization requirement + own-benchmark imperative
- **Graph metadata**: see `graph-metadata.json` for `derived.last_active_child_id` pointer
<!-- /ANCHOR:related-docs -->
