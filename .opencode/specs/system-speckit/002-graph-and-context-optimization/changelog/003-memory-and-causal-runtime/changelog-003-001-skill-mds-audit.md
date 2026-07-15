---
title: "Skill MDs Audit: Stale 016-019 Embedder Refs"
description: "Explore-agent audit of all skill SKILL.md and README.md files for stale embedder defaults after 016-019 flipped from EmbeddingGemma to jina-embeddings-v3 and jina-embeddings-v2-base-code. 14 findings produced. P0 fix and three P1 fixes shipped inline. Remaining P1 and P2 items deferred with a tracker."
trigger_phrases:
  - "skill mds audit"
  - "stale embedder references audit"
  - "021/001 changelog"
  - "jina embedder doc fixes"
  - "embedder default gemma to jina"
importance_tier: "important"
contextType: "review"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment/001-skill-mds-audit` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/003-skill-docs-alignment`

### Summary

After the 016-019 work flipped embedding defaults from EmbeddingGemma to jina-embeddings-v3 (mk-spec-memory) and jina-embeddings-v2-base-code (CocoIndex), skill documentation still claimed gemma as the active default. An Explore agent (Sonnet) swept all skill SKILL.md, README.md, references plus assets files against an explicit severity rubric, producing a 14-row audit CSV with 1 P0, 7 P1, 5 P2 plus 1 intentional-historical-skip finding. The P0 (CocoIndex SKILL.md default claim breaking new-user setup) and three clear-P1 fixes were applied inline in commit `d3c8996338`. Four deferred P1s covering legacy cascade-ordering in mk-spec-memory shared docs were logged to `evidence/remediation-tracker.md` pending architecture verification, as the audit agent had recommended jina-v3 inside llama-cpp which conflicted with the actual Ollama HTTP delivery path.

### Added

None. Review-only phase.

### Changed

None. Review-only phase.

### Fixed

None. Review-only phase.

### Verification

| Artifact | Outcome |
|---|---|
| `evidence/skill-docs-audit.csv` | 14 rows (1 P0, 7 P1, 5 P2, 1 SKIP) |
| `evidence/audit-summary.md` | Rollup with priority recommendations and fix-effort estimates per file |
| `evidence/remediation-tracker.md` | Per-finding status: 4 FIXED, 9 deferred, 1 SKIP |
| P0 fix (`mcp-coco-index/SKILL.md:268`) | Fixed in commit `d3c8996338` |
| P1 fix (`mcp-coco-index/SKILL.md:272`) | Fixed in commit `d3c8996338` |
| P1 fix (`mcp-coco-index/README.md:80`) | Fixed in commit `d3c8996338` |
| P1 fix (`system-spec-kit/README.md:295`) | Fixed in commit `d3c8996338` |
| Deferred P1 root cause documented | Cascade-ordering arch verification required before fix |

### Files Changed

| File | What changed |
|---|---|
| `evidence/skill-docs-audit.csv` (NEW) | 14-row audit output with path, line, current text, recommended fix, severity |
| `evidence/audit-summary.md` (NEW) | Findings rollup with P0-P2 counts, high-severity descriptions, fix-priority table |
| `evidence/remediation-tracker.md` (NEW) | Per-finding fix status: FIXED vs deferred, root cause for deferred P1 block |

### Follow-Ups

- Revisit the four deferred P1 cascade-ordering findings after packet 022 (skill-advisor embedder parity) ships. If the legacy cascade is retired, the documented cascade in `mcp_server/README.md` and `shared/embeddings/providers/README.md` becomes moot. Otherwise rewrite with an agent that has read both the 016 pluggable architecture and the current cascade state.
- Apply the five deferred P2 clarifications in `system-spec-kit/README.md` and `system-spec-kit/shared/README.md` to distinguish primary-default from fallback-cascade tiers.
- Consider adding a lint rule that flags new occurrences of `embeddinggemma-300m` outside `changelog/` and `z_archive/` to prevent similar documentation rot on future embedder flips.
