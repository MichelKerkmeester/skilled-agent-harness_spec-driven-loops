---
title: "022/002b CocoIndex Reranker Doc Prose Resync: BAAI to Qwen3 plus daemon-log observability correction"
description: "Resynced reranker prose across 3 CocoIndex docs to the Qwen/Qwen3-Reranker-0.6B canonical default and corrected a false daemon-log load-trace claim. Closes 4 P0 doc-drift findings."
trigger_phrases:
  - "022/002b reranker doc prose"
  - "cocoindex Qwen3 reranker docs"
  - "daemon-log silent-success correction"
  - "reranker doc drift remediation"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002b-cocoindex-reranker-doc-prose`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

CocoIndex reranker documentation still described `BAAI/bge-reranker-v2-m3` after the canonical default moved to `Qwen/Qwen3-Reranker-0.6B`, which packet 021 flagged as 4 P0 doc-drift findings. Three docs were resynced to the Qwen3 default with size corrected from about 2.3 GB to about 1.1 GB. Verification also surfaced a separate problem, the docs claimed the daemon log shows a positive reranker load trace, which was never accurate. The prose now describes silent-success load semantics where warnings appear only on failure paths.

### Added

- None

### Changed

- `007-reranker-opt-in.md`: 8 prose sites updated to the Qwen3 default, size, and silent-success daemon-log semantics. The step-6 grep changed from `rerank|bge|crossencoder` to `warn|error|fallback|fail` so it matches observable behavior
- `manual_testing_playbook.md`: the CFG-007 row updated across 3 prose sites
- `benchmarks/README.md`: the `reranker.py` callout updated, with BGE retained as an opt-in fallback note for historical record

### Fixed

- 4 P0 reranker doc-drift findings from packet 021 (`f-iter006-002` through `f-iter006-005`)
- A false daemon-log observability claim. The original prose asserted a positive cross-encoder load trace that was never emitted (0 hits across a 509KB live `daemon.log`). The daemon uses silent success on load and `logger.warning()` only on failure paths

### Verification

- `rg "Qwen/Qwen3-Reranker-0.6B"` across the 3 files returned 7 hits, all in current-default context
- `rg "BAAI/bge-reranker-v2-m3"` returned 2 hits, both intentional historical or fallback context
- `rg "~?2.3 GB"` returned 2 hits, both historical or fallback context
- Qwen3 disk footprint measured at 1.1 GB, and the live `daemon.log` confirmed 0 reranker-specific load events

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/03--configuration/007-reranker-opt-in.md` | Modified | 8 prose sites resynced to Qwen3 plus silent-success semantics |
| `.opencode/skills/mcp-coco-index/manual_testing_playbook/manual_testing_playbook.md` | Modified | CFG-007 row, 3 prose sites |
| `.opencode/skills/mcp-coco-index/mcp_server/benchmarks/README.md` | Modified | `reranker.py` callout to Qwen3, BGE kept as fallback note |

### Follow-Ups

- If a future CocoIndex version adds explicit reranker load tracing, the docs would need a forward-looking update. That would be a new change, not drift remediation
