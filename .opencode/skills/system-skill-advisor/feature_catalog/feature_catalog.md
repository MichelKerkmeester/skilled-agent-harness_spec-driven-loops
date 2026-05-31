---
title: "Skill Advisor: Feature Catalog"
description: "Current feature inventory for the native-first skill advisor, covering daemon freshness, auto-indexing, lifecycle routing, 5-lane scorer fusion, MCP surface, runtime hooks, plugin bridge and Python compatibility."
trigger_phrases:
  - "skill advisor catalog"
  - "advisor feature catalog"
  - "native advisor features"
  - "skill advisor inventory"
---

# Skill Advisor: Feature Catalog

<!-- sk-doc-template: skill_asset_feature_catalog -->

This catalog is the current inventory for the skill advisor. The package source of truth is `.opencode/skills/system-skill-advisor/mcp_server/`. Each group links to per-feature files that cite the real implementation and test anchors.

---

## 1. OVERVIEW

The catalog covers 37 features across 7 groups. Group 01 owns daemon correctness. Groups 02-03 own the index and lifecycle surface that feeds the scorer. Group 04 owns scoring. Group 06 exposes the MCP tools. Groups 07-08 cover runtime integrations plus Python compatibility.

> **Numbering note (gap-05).** The directory layout skips slot `05--*` between `04--scorer-fusion` and `06--mcp-surface`. This is an intentional historical reservation from initial scaffold design that marked the boundary between the core scoring pipeline (groups 01-04) and the integration layer (groups 06-08). The gap is preserved to keep spec-folder cross-reference stability across packets. Do not renumber.

| Group | Count | Scope |
| --- | --- | --- |
| [01--daemon-and-freshness](./01--daemon-and-freshness/) | 7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation |
| [02--auto-indexing](./02--auto-indexing/) | 6 | Derived extraction, sanitizer, provenance, sync, anti-stuffing, DF/IDF corpus |
| [03--lifecycle-routing](./03--lifecycle-routing/) | 5 | Age haircut, supersession, archive handling, schema migration, rollback |
| [04--scorer-fusion](./04--scorer-fusion/) | 6 | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config |
| [06--mcp-surface](./06--mcp-surface/) | 9 | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, stable compat entrypoint, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate` |
| [07--hooks-and-plugin](./07--hooks-and-plugin/) | 5 | Claude, Copilot, Gemini, Codex hooks plus OpenCode plugin bridge |
| [08--python-compat](./08--python-compat/) | 3 | Python CLI shim, regression suite, bench runner |

Baseline numbers (remediation SHA `97a318d83`):

| Metric | Value |
| --- | --- |
| Full-corpus top-1 accuracy | 80.5% |
| Holdout top-1 accuracy | 77.5% |
| UNKNOWN count | <= 10 |
| Python regression suite | regression harness coverage |
| Advisor vitest tests | 167 across 23 files |
| Watcher idle envelope | 0.031% CPU, 5.516 MB RSS |
| Cache-hit p95 | ~6.989 ms |
| Uncached p95 | ~11.45 ms |

---

## 2. DAEMON AND FRESHNESS

| Feature | File |
| --- | --- |
| Chokidar narrow-scope watcher | [01--daemon-and-freshness/001-watcher.md](./01--daemon-and-freshness/001-watcher.md) |
| Workspace single-writer lease | [01--daemon-and-freshness/002-lease.md](./01--daemon-and-freshness/002-lease.md) |
| Daemon lifecycle and health | [01--daemon-and-freshness/003-lifecycle.md](./01--daemon-and-freshness/003-lifecycle.md) |
| Generation-tagged snapshot publication | [01--daemon-and-freshness/004-generation.md](./01--daemon-and-freshness/004-generation.md) |
| Live / stale / absent / unavailable trust state | [01--daemon-and-freshness/005-trust-state.md](./01--daemon-and-freshness/005-trust-state.md) |
| Rebuild from source on corrupt SQLite | [01--daemon-and-freshness/006-rebuild-from-source.md](./01--daemon-and-freshness/006-rebuild-from-source.md) |
| Generation-tied cache invalidation | [01--daemon-and-freshness/007-cache-invalidation.md](./01--daemon-and-freshness/007-cache-invalidation.md) |

---

## 3. AUTO-INDEXING

| Feature | File |
| --- | --- |
| Deterministic derived extraction | [02--auto-indexing/008-derived-extraction.md](./02--auto-indexing/008-derived-extraction.md) |
| A7 sanitizer at every write boundary | [02--auto-indexing/009-sanitizer.md](./02--auto-indexing/009-sanitizer.md) |
| Provenance fingerprints and trust lanes | [02--auto-indexing/010-provenance-and-trust-lanes.md](./02--auto-indexing/010-provenance-and-trust-lanes.md) |
| Graph-metadata derived sync | [02--auto-indexing/011-sync.md](./02--auto-indexing/011-sync.md) |
| Anti-stuffing and cardinality caps | [02--auto-indexing/012-anti-stuffing.md](./02--auto-indexing/012-anti-stuffing.md) |
| DF/IDF corpus stats (active-only) | [02--auto-indexing/013-df-idf-corpus.md](./02--auto-indexing/013-df-idf-corpus.md) |

---

## 4. LIFECYCLE ROUTING

| Feature | File |
| --- | --- |
| Derived-lane-only age haircut | [03--lifecycle-routing/014-age-haircut.md](./03--lifecycle-routing/014-age-haircut.md) |
| Asymmetric supersession routing | [03--lifecycle-routing/015-supersession.md](./03--lifecycle-routing/015-supersession.md) |
| Archive and future skills indexed but not routed | [03--lifecycle-routing/016-archive-handling.md](./03--lifecycle-routing/016-archive-handling.md) |
| Schema v1 to v2 additive backfill | [03--lifecycle-routing/017-schema-migration.md](./03--lifecycle-routing/017-schema-migration.md) |
| Atomic lifecycle rollback | [03--lifecycle-routing/018-rollback.md](./03--lifecycle-routing/018-rollback.md) |

---

## 5. SCORER FUSION

| Feature | File |
| --- | --- |
| Five-lane analytical fusion | [04--scorer-fusion/019-five-lane-fusion.md](./04--scorer-fusion/019-five-lane-fusion.md) |
| Skill-nodes / skill-edges projection | [04--scorer-fusion/020-projection.md](./04--scorer-fusion/020-projection.md) |
| Top-2 ambiguity window | [04--scorer-fusion/021-ambiguity.md](./04--scorer-fusion/021-ambiguity.md) |
| Lane contribution attribution | [04--scorer-fusion/022-attribution.md](./04--scorer-fusion/022-attribution.md) |
| Lane-by-lane ablation protocol | [04--scorer-fusion/023-ablation.md](./04--scorer-fusion/023-ablation.md) |
| Lane weights configuration | [04--scorer-fusion/024-weights-config.md](./04--scorer-fusion/024-weights-config.md) |

---

## 6. MCP SURFACE

| Feature | File |
| --- | --- |
| `advisor_recommend` MCP tool | [06--mcp-surface/025-advisor-recommend.md](./06--mcp-surface/025-advisor-recommend.md) |
| `advisor_rebuild` MCP tool | [06--mcp-surface/029-advisor-rebuild.md](./06--mcp-surface/029-advisor-rebuild.md) |
| `advisor_status` MCP tool | [06--mcp-surface/026-advisor-status.md](./06--mcp-surface/026-advisor-status.md) |
| `advisor_validate` MCP tool | [06--mcp-surface/027-advisor-validate.md](./06--mcp-surface/027-advisor-validate.md) |
| Stable `compat/index.ts` entrypoint | [06--mcp-surface/028-compat-entrypoint.md](./06--mcp-surface/028-compat-entrypoint.md) |
| `skill_graph_scan` MCP tool | [06--mcp-surface/030-skill-graph-scan.md](./06--mcp-surface/030-skill-graph-scan.md) |
| `skill_graph_query` MCP tool | [06--mcp-surface/031-skill-graph-query.md](./06--mcp-surface/031-skill-graph-query.md) |
| `skill_graph_status` MCP tool | [06--mcp-surface/032-skill-graph-status.md](./06--mcp-surface/032-skill-graph-status.md) |
| `skill_graph_validate` MCP tool | [06--mcp-surface/033-skill-graph-validate.md](./06--mcp-surface/033-skill-graph-validate.md) |

---

## 7. HOOKS AND PLUGIN

| Feature | File |
| --- | --- |
| Claude Code `user-prompt-submit` hook | [07--hooks-and-plugin/034-claude-hook.md](./07--hooks-and-plugin/034-claude-hook.md) |
| Gemini CLI `user-prompt-submit` hook | [07--hooks-and-plugin/035-gemini-hook.md](./07--hooks-and-plugin/035-gemini-hook.md) |
| Codex CLI native SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback | [07--hooks-and-plugin/036-codex-hook.md](./07--hooks-and-plugin/036-codex-hook.md) |
| OpenCode plugin bridge | [07--hooks-and-plugin/037-opencode-plugin-bridge.md](./07--hooks-and-plugin/037-opencode-plugin-bridge.md) |

---

## 8. PYTHON COMPAT

| Feature | File |
| --- | --- |
| Python CLI shim (`skill_advisor.py`) | [08--python-compat/038-cli-shim.md](./08--python-compat/038-cli-shim.md) |
| Python regression dataset | [08--python-compat/039-regression-suite.md](./08--python-compat/039-regression-suite.md) |
| Python bench runner (`skill_advisor_bench.py`) | [08--python-compat/040-bench-runner.md](./08--python-compat/040-bench-runner.md) |
