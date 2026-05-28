---
title: "Resource Map — Phase 007 Retrieval Rerank Clients"
description: "File inventory for Phase 007: per-child scope. Spans interface modules + memory adapters + Coco adapter + telemetry + tests + docs. ~20 files."
trigger_phrases:
  - "027 phase 010 resource map"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: ".opencode/specs/system-spec-kit/028-code-graph-and-cocoindex/007-retrieval-rerank-clients"
    last_updated_at: "2026-05-09T11:00:00Z"
    last_updated_by: "claude-opus-4-7"
    recent_action: "Authored per-child resource map"
    next_safe_action: "Update on file changes"
    blockers: []
    key_files: ["resource-map.md"]
    completion_pct: 100
---
# Resource Map

<!-- SPECKIT_TEMPLATE_SOURCE: resource-map | v1.1 -->

---

<!-- ANCHOR:when-to-use -->
## WHEN TO USE THIS TEMPLATE

Per-child resource map for Phase 007. Pt-03 aggregate map at `../research/027-xce-research-pt-03/resource-map.md`.
<!-- /ANCHOR:when-to-use -->

---

<!-- ANCHOR:summary -->
## Summary

- **Total references**: 20
- **By category**: READMEs=3, Documents=3, Specs=8, Scripts=14, Tests=5, Config=2
- **Missing on disk**: 0
- **Scope**: Per-child — files Phase 007 reads, modifies, creates, or cites across 4 sub-phases.
- **Generated**: 2026-05-09T11:00:00Z
<!-- /ANCHOR:summary -->

---

<!-- ANCHOR:readmes -->
## 1. READMEs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/SKILL.md` | Cited | OK | Memory MCP context |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Cited | OK | Coco-side context |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/README.md` | Updated | OK | Future RQ-A5 fusion consumer documentation (REQ-014) |
<!-- /ANCHOR:readmes -->

---

<!-- ANCHOR:documents -->
## 2. Documents

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/research.md` | Cited | OK | Pt-03 §RQ-B5 |
| `.opencode/specs/system-spec-kit/027-xce-research-based-refinement/research/027-xce-research-pt-03/iterations/iteration-010.md` | Cited | OK | RQ-B5 findings |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md` | Cited | OK | Pipeline contract (Stage 4 ordering immutability) |
<!-- /ANCHOR:documents -->

---

<!-- ANCHOR:specs -->
## 6. Specs

| Path | Action | Status | Note |
|------|--------|--------|------|
| `007-retrieval-rerank-clients/spec.md` | Created | OK | This packet |
| `007-retrieval-rerank-clients/plan.md` | Created | OK | This packet |
| `007-retrieval-rerank-clients/tasks.md` | Created | OK | This packet |
| `007-retrieval-rerank-clients/checklist.md` | Created | OK | This packet |
| `007-retrieval-rerank-clients/decision-record.md` | Created | OK | This packet (6 ADRs) |
| `007-retrieval-rerank-clients/implementation-summary.md` | Created | OK | Placeholder |
| `007-retrieval-rerank-clients/description.json` | Created | OK | Spec-folder metadata |
| `007-retrieval-rerank-clients/graph-metadata.json` | Created | OK | Graph metadata |
<!-- /ANCHOR:specs -->

---

<!-- ANCHOR:scripts -->
## 7. Scripts

### Sub-Phase 1 — Interface Extraction (created)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/rerank-client.ts` | Created | PLANNED | `RerankClient<T>` interface |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache-client.ts` | Created | PLANNED | `EmbeddingCacheClient` interface |

### Sub-Phase 2 — Memory Adapter Swap (modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Updated | OK | Implements `RerankClient<MemoryDocument>` (lines 35-554) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Updated | OK | Implements `EmbeddingCacheClient` (lines 45-215) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/stage3-rerank.ts` | Updated | OK | Consumes RerankClient via DI (lines 410-465) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/types.ts` | Cited | OK | Pipeline type context |

### Sub-Phase 3 — Coco Rerank Adapter (created + modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerank_adapter.py` | Created | PLANNED | Python adapter (default option; TS bridge alternative) |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/query.py` | Updated | OK | Optional rerank stage post-`_dedup_and_rank_rows()` |
| `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/shared.py` | Cited | OK | Embedder configuration context |

### Sub-Phase 4 — Telemetry (modified)
| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Updated | OK | Cross-backend telemetry events (also touched in Sub-Phase 2) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/cache/embedding-cache.ts` | Updated | OK | Cross-backend telemetry events (also touched in Sub-Phase 2) |
<!-- /ANCHOR:scripts -->

---

<!-- ANCHOR:tests -->
## 8. Tests

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/rerank-client-contract.vitest.ts` | Created | PLANNED | Sub-Phase 1 — abstraction boundary contract tests |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/memory-rerank-adapter.vitest.ts` | Created | PLANNED | Sub-Phase 2 — pre/post diff parity test |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/circuit-breaker-fallback.vitest.ts` | Created | PLANNED | Sub-Phase 4 — circuit-breaker fallback test |
| `.opencode/skills/system-spec-kit/mcp_server/__tests__/search/cross-backend-telemetry.vitest.ts` | Created | PLANNED | Sub-Phase 4 — telemetry event verification |
| `.opencode/skills/mcp-coco-index/tests/test_rerank_adapter.py` | Created | PLANNED | Sub-Phase 3 — Coco adapter (or TS-bridge equivalent) |
<!-- /ANCHOR:tests -->

---

<!-- ANCHOR:config -->
## 9. Config

| Path | Action | Status | Note |
|------|--------|--------|------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Updated | OK | Document `SPECKIT_COCO_USE_SHARED_RERANK` flag (REQ-015) |
| `.opencode/skills/system-spec-kit/mcp_server/lib/search/pipeline/README.md` | Updated | OK | Document pipeline-stage adapter pattern + future fusion consumer (Documents §) |
<!-- /ANCHOR:config -->

---

<!-- ANCHOR:author-notes -->
## Author Notes

- **Per-child scope** — pt-03 aggregate at `../research/027-xce-research-pt-03/resource-map.md`.
- **Categories omitted (zero entries)**: Commands, Agents, Skills, Meta.
- **PLANNED entries** become OK during implementation.
- **Coco adapter shape decision** (Python vs TS bridge) is an open question per spec.md `_memory.continuity.open_questions`. Resolution documented in commit message or ADR follow-up.
- **NO Coco `EmbeddingCacheClient` adapter** in this phase per ADR-005 — interface ships unused on Coco side; ready for future adoption pending overlap telemetry.
<!-- /ANCHOR:author-notes -->
