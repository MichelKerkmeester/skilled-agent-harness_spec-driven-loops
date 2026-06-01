---
title: "Changelog: Promote Qwen3-Reranker-0.6B as the spec-memory default [008/005 HOLD path]"
description: "Phase 005 executed the HOLD verdict from the phase 004 benchmark. Qwen sidecar reranking ships as opt-in only. ENV_REFERENCE.md, embedder_architecture.md and the sidecar skill were updated to document the toggle and the latency rationale. No source code or runtime configs were changed."
trigger_phrases:
  - "promote qwen default reranker hold"
  - "speckit cross encoder opt-in"
  - "arc 008 closes hold path"
  - "qwen sidecar opt-in closure"
  - "rerank sidecar default decision"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-20

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc/005-promote-qwen-as-default` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/008-rerank-sidecar-arc`

### Summary

Phases 001 through 003 of arc 008 shipped a working Qwen3-Reranker-0.6B cross-encoder sidecar for spec-memory, but both the source default (`cross-encoder/ms-marco-MiniLM-L-6-v2`) and the runtime flag (`SPECKIT_CROSS_ENCODER=false`) were held pending a benchmark. Phase 004 ran that benchmark and returned a HOLD verdict: hit-rate delta was only +0.4 pp, MRR delta was +0.004 and p95 latency ballooned to +9832.7 ms on CPU, far exceeding the +400 ms promotion ceiling.

Phase 005 consumed the HOLD verdict mechanically. The source file and all four runtime configs were left unchanged. `ENV_REFERENCE.md`, `embedder_architecture.md` and `system-rerank-sidecar/SKILL.md` were updated to describe `SPECKIT_CROSS_ENCODER=true` as an opt-in path for development and single-query use, with a link to the benchmark report and an explicit note that CPU-to-MPS device tuning is a prerequisite before any future promotion attempt. The arc parent was marked complete.

### Added

None.

### Changed

- `ENV_REFERENCE.md` opt-in row updated to describe `SPECKIT_CROSS_ENCODER=true` as the Qwen sidecar activation path, with the p95 and fallback findings from the phase 004 benchmark as the rationale for keeping default off
- `embedder_architecture.md` Stage 3 section updated to document Qwen sidecar reranking as opt-in and links to the benchmark report
- `system-rerank-sidecar/SKILL.md` updated to name spec-memory as an opt-in consumer and to record the CPU sustained-load latency limitation
- Arc parent `spec.md` phase-map row marked `Complete (HOLD)` for this phase
- Arc parent `graph-metadata.json` updated with `last_active_child_id` pointing to this phase and arc status set to `complete`

### Fixed

None.

### Verification

| Check | Command | Evidence |
|-------|---------|----------|
| ENV doc opt-in row | `grep -n "Default OFF (opt-in)" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | One hit at line 212 |
| Source no-touch audit | `git diff HEAD~1 -- .opencode/skills/system-spec-kit/mcp_server/lib/search/cross-encoder.ts` | Empty output |
| Runtime config no-touch audit | `git diff HEAD~1 -- .mcp.json opencode.json .gemini/settings.json .codex/config.toml` | Empty output |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Opt-in description added for `SPECKIT_CROSS_ENCODER` with benchmark rationale for keeping default off |
| `.opencode/skills/system-spec-kit/references/memory/embedder_architecture.md` | Stage 3 reranker section updated to document Qwen as opt-in with sidecar architecture notes |
| `.opencode/skills/system-rerank-sidecar/SKILL.md` | Spec-memory noted as opt-in consumer. CPU sustained-load latency limitation recorded. (File removed in later cleanup packet 014/004.) |
| `../spec.md` | Phase 005 row marked `Complete (HOLD)` in the arc phase map |
| `../graph-metadata.json` | `last_active_child_id` set to this phase. Arc status set to `complete`. |

### Follow-Ups

- Tune CPU-to-MPS device selection for the Qwen3-Reranker-0.6B model before attempting a future promotion benchmark. Phase 004 made this a hard prerequisite.
- Track CocoIndex sidecar deduplication separately. CocoIndex still loads its own Qwen in-process rather than routing to the shared sidecar.
