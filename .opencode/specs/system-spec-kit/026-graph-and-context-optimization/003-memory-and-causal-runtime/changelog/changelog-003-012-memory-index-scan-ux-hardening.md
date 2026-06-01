---
title: "memory_index_scan UX Hardening: Deep-Research Design Packet"
description: "Five convergence-gated research iterations produced a 17-section cited design for making the spec-kit memory indexing subsystem always-safe-to-call, always-completing, degradation-tolerant and self-healing. No production code was changed."
trigger_phrases:
  - "memory index scan ux hardening"
  - "memory_index_scan async scan job design"
  - "memory index self-healing orphan reconciliation"
  - "012 deep research synthesis"
  - "memory index coalescing caller contract"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-31

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/012-memory-index-scan-ux-hardening` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime`

### Summary

The `memory_index_scan` handler coupled scope discovery, lexical indexing and synchronous vector embedding inside a single MCP request under a global lease. That coupling produced three observed failure classes: a raw `E429` foot-gun when a second scan landed inside the hardcoded 30s cooldown window, a `-32001` request-deadline timeout on large or forced scans and orphan index rows after spec-folder moves.

Five convergence-gated research iterations investigated five design angles (caller contract, timeout hardening, concurrency, embedder resilience and self-healing) and converged on a recommended design. The synthesis is `research/research.md` (17 sections, every current-behavior claim cited to `file:line`), plus `research/resource-map.md`. Iteration 1 ran on cli-codex `gpt-5.5` reasoning xhigh. Iterations 2 through 5 ran on cli-opencode `openai/gpt-5.5 --variant high`. The newInfoRatio trend was 0.92, 0.86, 0.78, 0.74, 0.62 (monotonically decreasing, healthy convergence). No production code was changed.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Result |
|-------|--------|
| 5/5 iteration narratives, delta files and state records present | PASS |
| `research/research.md` present with 17 sections, no fabricated ratios (0.71 removed, real 0.62) | PASS |
| `research/resource-map.md` emitted | PASS |
| `config.status = complete` | PASS |
| Every current-behavior claim cited to `file:line` | PASS (per-iteration narratives) |
| Production code changed | NONE (design research only) |

### Files Changed

| File | Action |
|------|--------|
| `research/research.md` (NEW) | Created. 17-section canonical synthesis with file:line-cited recommendations for the coalescing async scan job design. |
| `research/resource-map.md` (NEW) | Created. Evidence-derived resource map linking design recommendations to source locations. |
| `research/iterations/iteration-001.md` through `iteration-005.md` (NEW) | Created. Per-iteration narratives with delta files and JSONL state records. |

### Follow-Ups

- Implement the minimal first slice: caller-contract coalescing so a second scan returns the in-flight job instead of a raw E429, plus `memory_health.index` freshness block and bounded orphan sweep. A follow-on `/speckit:plan` consumes this research as input.
- The reducer `keyFindings` count shows 0 due to a delta-type-mapping quirk. The findings are fully present in `research/research.md` and the per-iteration `deltas/iter-*.jsonl`. Verify the delta-type mapping before authoring the implementation plan.
