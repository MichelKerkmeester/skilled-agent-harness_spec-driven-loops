---
title: "007/001 Indexer Surface Investigation"
description: "Research-only mapping of retrieval and indexer surfaces across the 016 embedder umbrella. Identifies which consumer systems route to CocoIndex, mk-spec-memory, Code Graph, Skill Advisor or no indexer at all, with file-and-line evidence for each."
trigger_phrases:
  - "indexer surface investigation"
  - "016 retrieval surface mapping"
  - "system to embedder mapping"
  - "ollama bge promotion indexer research"
  - "which system uses cocoindex or mk-spec-memory"
importance_tier: "important"
contextType: "research"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-18

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion/001-indexer-surface-investigation` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/007-ollama-and-bge-promotion`

### Summary

Before any Ollama or BGE embedder promotion could be scoped, the team needed to know which consumer systems actually retrieve from which indexer. That mapping was absent. CocoIndex, mk-spec-memory, Code Graph, Skill Advisor and every major agent were inspected against their MCP server lists, tool-use tables and YAML workflow configs.

The investigation produced a headline table in `research.md` covering 13 systems with retrieval calls, content type indexed, active embedder and file-and-line evidence. Key findings: CocoIndex is code-only with a local-profile ambiguity between CodeRankEmbed and EmbeddingGemma; Code Graph is structural with no embedder; Skill Advisor is a separate text-embedding surface independent of mk-spec-memory; mixed consumers such as `@context`, `@deep-research` and `@deep-review` route text and code calls to separate stores. These findings feed directly into the scope boundaries for sub-phases 002, 003 and 004.

### Added

None. Research-only phase.

### Changed

None. Research-only phase.

### Fixed

None. Research-only phase.

### Verification

| Check | Status | Notes |
|---|---|---|
| Headline table coverage | Pass | 13 systems mapped. CocoIndex, mk-spec-memory, Code Graph, Skill Advisor, all primary agents covered. |
| File evidence completeness | Pass | Every row cites at least one file path plus line number. |
| Mismatches section | Pass | Four mismatch or ambiguity notes recorded. No confirmed content-tier cross-wiring found. |
| Sub-phase implications section | Pass | Scope guidance written for 002 and 004. |
| Strict validation | Pass | `validate.sh --strict` passes after Level 1 doc repair. |
| Packet completion | Pass | `completion_pct: 100`, no open questions, no blockers. |

### Files Changed

| File | Action | What changed |
|---|---|---|
| `001-indexer-surface-investigation/research.md` | Created | Headline table plus per-system analysis, mismatches and sub-phase implications. |
| `001-indexer-surface-investigation/spec.md` | Updated | Added continuity frontmatter and corrected parent path after folder rename. |
| `001-indexer-surface-investigation/plan.md` | Created | Level 1 research-only plan for strict validation. |
| `001-indexer-surface-investigation/tasks.md` | Created | Level 1 task ledger for strict validation. |
| `001-indexer-surface-investigation/implementation-summary.md` | Created | Closeout summary with verification table and key decisions. |

### Follow-Ups

- Re-check the active CocoIndex embedder with `ccc` status before judging BGE promotion results in 003. The local global profile currently overrides the repo default.
- Include Skill Advisor as a distinct text-embedding surface when surveying text embedders in 004. Its registry already names `jina-embeddings-v3` and is not connected to mk-spec-memory.
- Treat the research table as a snapshot of 2026-05-18. Any agent or command definition that changed after that date should be re-verified before acting on the scope guidance.
