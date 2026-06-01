---
title: "022/002 CocoIndex Embedder Doc-Drift Resync: config_templates + embedder-pluggability + ENV_REFERENCE + SKILL.md"
description: "Closed 2 P0 plus 1 P1 plus 1 P2 embedder-side audit findings by updating 4 doc surfaces to cite sbert/nomic-ai/CodeRankEmbed as the canonical CocoIndex default. Reranker-side prose deferred to phase 002b."
trigger_phrases:
  - "022/002 embedder doc drift resync"
  - "CocoIndex config_templates embeddinggemma update"
  - "embedder-pluggability historical annotation"
  - "ENV_REFERENCE date refresh 022"
  - "SKILL.md code-rank-embed keyword"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-23

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc/002-cocoindex-embedder-doc-drift-resync`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/002-spec-memory-stack/022-hardcoded-default-remediation-arc`

### Summary

Three `_NOTE_2` citation lines in `config_templates.md` still named `google/embeddinggemma-300m` as the CocoIndex default even though `DEFAULT_EMBEDDER_NAME = "sbert/nomic-ai/CodeRankEmbed"` shipped on 2026-05-19. An operator copy-pasting the template would misconfigure or under-resource accordingly. Two adjacent surfaces compounded the drift: `embedder-pluggability.md:342` described `jinaai/jina-embeddings-v2-base-code` as the production default without noting supersession, and `SKILL.md:8` listed `embeddinggemma-300m` as a keyword but not `code-rank-embed`, making the canonical current default invisible to operators searching the skill.

All four embedder-side edits shipped in a single main-agent pass. The three `_NOTE_2` lines in `config_templates.md` were updated to `sbert/nomic-ai/CodeRankEmbed`. The `embedder-pluggability.md:342` row was annotated as the historical CocoIndex default per 018 ADR-001, superseded by `sbert/nomic-ai/CodeRankEmbed` in the 018 follow-on. The `ENV_REFERENCE.md` last-updated date was refreshed from `2026-04-01` to `2026-05-23`. The `SKILL.md` keywords block gained `code-rank-embed` alongside the retained `embeddinggemma-300m` entry. Reranker-side prose corrections (four surfaces referencing `BAAI/bge-reranker-v2-m3`) were scoped and deferred to phase 002b.

### Added

- `code-rank-embed` keyword in `.opencode/skills/mcp-coco-index/SKILL.md` keywords block (alongside retained `embeddinggemma-300m` entry for backward-compat search recall)

### Changed

- `.opencode/skills/mcp-coco-index/assets/config_templates.md` three `_NOTE_2` lines (positions 75, 140, 160): `google/embeddinggemma-300m` replaced with `sbert/nomic-ai/CodeRankEmbed` across the OpenCode, Claude JSON, and Codex TOML template stanzas
- `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md:560`: "Last updated" date changed from `2026-04-01` to `2026-05-23`
- `.opencode/skills/system-spec-kit/references/embedder-pluggability.md:342`: `jinaai/jina-embeddings-v2-base-code` table row description updated to mark the entry as historical with supersession note citing `sbert/nomic-ai/CodeRankEmbed` and the 018 follow-on bench result

### Fixed

- `config_templates.md` cited the pre-018 `google/embeddinggemma-300m` as the CocoIndex default in all three provider-template stanzas. Operators copy-pasting any template would deploy with the wrong embedder and stale vector dimensions.
- `embedder-pluggability.md:342` described `jinaai/jina-embeddings-v2-base-code` as "production CocoIndex default per 018 ADR-001" with no supersession note, implying it was still current. Annotation now makes the historical boundary clear.

### Verification

| Check | Result |
|---|---|
| `rg "google/embeddinggemma-300m" .opencode/skills/mcp-coco-index/assets/config_templates.md` | 0 hits |
| `grep "Last updated: 2026-05-23" .opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | 1 hit |
| `grep "code-rank-embed" .opencode/skills/mcp-coco-index/SKILL.md` | 1 hit |
| `grep "historical CocoIndex default" .opencode/skills/system-spec-kit/references/embedder-pluggability.md` | 1 hit |
| Strict-validate phase 002 (`validate.sh --strict`) | exit 0 |

### Files Changed

| File | Action |
|---|---|
| `.opencode/skills/mcp-coco-index/assets/config_templates.md` | Modified. Three `_NOTE_2` citation sites updated from `google/embeddinggemma-300m` to `sbert/nomic-ai/CodeRankEmbed`. |
| `.opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md` | Modified. "Last updated" date at line 560 refreshed from `2026-04-01` to `2026-05-23`. |
| `.opencode/skills/system-spec-kit/references/embedder-pluggability.md` | Modified. Line 342 row for `jinaai/jina-embeddings-v2-base-code` annotated as historical CocoIndex default per 018 ADR-001, superseded by `sbert/nomic-ai/CodeRankEmbed`. |
| `.opencode/skills/mcp-coco-index/SKILL.md` | Modified. Keywords block gained `code-rank-embed` alongside existing `embeddinggemma-300m` entry. |

### Follow-Ups

- Ship phase 002b to close reranker-side prose drift: `007-reranker-opt-in.md`, `manual_testing_playbook.md:402,407`, and `benchmarks/README.md:202` still cite `BAAI/bge-reranker-v2-m3` and BGE-specific size prose requiring Qwen3-Reranker-0.6B disk footprint and daemon-log identifier verification.
- Update memory entry `project_2026_05_19_cocoindex_arc_shipped.md` post-arc to note that 023B promoted `Qwen/Qwen3-Reranker-0.6B` over `jina-reranker-v3` as the production reranker default.
- Audit `README.md:217` and `INSTALL_GUIDE.md:563` embeddinggemma rows for a non-default marker. P2 informational finding deferred pending 002b closure.
