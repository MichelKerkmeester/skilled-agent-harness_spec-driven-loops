# 021/001 — Audit remediation tracker

> Tracks which of the 14 audit findings shipped inline (P0/P1) vs deferred (P1 cascade-related + P2).

## Source

`skill-docs-audit.csv` (14 rows: 1 P0, 7 P1, 5 P2, 1 SKIP-intentional).

## Status per finding

| Path | Line | Sev | Status | Shipped in / deferred to |
|---|---|---|---|---|
| `mcp-coco-index/SKILL.md` | 268 | **P0** | ✅ FIXED | commit `d3c899633` — table rebuilt with 5 candidates + jina-code default |
| `mcp-coco-index/SKILL.md` | 272 | P1 | ✅ FIXED | commit `d3c899633` — same table rewrite |
| `mcp-coco-index/README.md` | 80 | P1 | ✅ FIXED | commit `d3c899633` — "unified 768d" stale claim corrected |
| `system-spec-kit/README.md` | 295 | P1 | ✅ FIXED | commit `d3c899633` — vector default updated to jina-v3 1024d per ADR-012 |
| `system-spec-kit/README.md` | 636 | P2 | ⏳ deferred | low-value: clarification of fallback role |
| `system-spec-kit/README.md` | 638 | P2 | ⏳ deferred | same |
| `system-spec-kit/shared/README.md` | 339 | P2 | ⏳ deferred | cascade-ordering documentation; needs architecture verification |
| `system-spec-kit/shared/README.md` | 341 | P2 | ⏳ deferred | same |
| `system-spec-kit/shared/README.md` | 569 | P2 | ⏳ deferred | naming clarification |
| `system-spec-kit/shared/README.md` | 570 | P2 | ⏳ deferred | same |
| `system-spec-kit/mcp_server/README.md` | 58 | **P1** | ⏳ deferred — needs verification | Cascade-ordering claim — agent recommended "jina-v3 in llama-cpp tier" but jina-v3 is actually Ollama HTTP, not llama-cpp. Needs architecture review before fix. |
| `system-spec-kit/mcp_server/README.md` | 60 | **P1** | ⏳ deferred — needs verification | profile naming claim; same architecture-verification concern |
| `system-spec-kit/shared/embeddings/providers/README.md` | 59 | **P1** | ⏳ deferred — needs verification | llama-cpp.ts default claim; same architecture concern |
| `system-spec-kit/shared/embeddings/providers/README.md` | 60 | P2 | ⏳ deferred | clarification |
| `mcp-coco-index/README.md` | 194 | SKIP | n/a | Intentional historical reference (gemma as benchmark baseline) |

## Summary

| Severity | Total | Fixed | Deferred | SKIP |
|---|---|---|---|---|
| P0 | 1 | 1 | 0 | 0 |
| P1 | 7 | 3 | 4 | 0 |
| P2 | 5 | 0 | 5 | 0 |
| SKIP | 1 | 0 | 0 | 1 |
| **Total** | **14** | **4** | **9** | **1** |

## Deferred P1 root cause

All 4 deferred P1s are about the **legacy cascade ordering** in mk-spec-memory's `shared/embeddings/` (the pre-016 cascade). The audit-agent recommended fixes that put jina-v3 inside the llama-cpp tier — but jina-v3 is actually served by **Ollama HTTP**, not llama-cpp. Applying the recommended fix verbatim would create new stale documentation.

Resolution path: **task #44** (skill-advisor still on gemma) and **packet 022** (skill-advisor embedder parity) will retire the legacy cascade for skill-advisor. After 022 ships, the same legacy cascade may be deprecated for mk-spec-memory's own use, at which point these P1s become moot (the documented cascade goes away). If the legacy cascade is kept (as a fallback for hf-local), the docs should be rewritten by an agent that has read the 016 pluggable architecture + the legacy cascade together — separate packet.

## What to do with this tracker

- After 022 ships → revisit the 4 deferred P1s; either delete the legacy-cascade docs OR rewrite per the current architecture
- Periodically check: any new docs that reference "gemma default" → flag against this tracker

## Cross-references

- `skill-docs-audit.csv` — raw audit rows
- `audit-summary.md` — agent's rollup with priority recommendations
- `../../../022-skill-advisor-embedder-parity/spec.md` — the packet that will retire the legacy cascade for skill-advisor
- Memory note `feedback_workflow_invariance_allowlist_for_new_maintainer_docs` — pattern for legitimately-needed legacy-vocabulary docs
