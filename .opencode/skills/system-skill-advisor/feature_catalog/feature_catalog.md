---
title: "Skill Advisor: Feature Catalog"
description: "Current feature inventory for the native-first skill advisor, covering daemon freshness, auto-indexing, lifecycle routing, 5-lane scorer fusion, MCP surface, runtime hooks, plugin bridge and Python compatibility."
trigger_phrases:
  - "skill advisor catalog"
  - "advisor feature catalog"
  - "native advisor features"
  - "skill advisor inventory"
version: 0.8.0.12
---

# Skill Advisor: Feature Catalog

<!-- sk-doc-template: skill_asset_feature_catalog -->

This catalog is the current inventory for the skill advisor. The package source of truth is `.opencode/skills/system-skill-advisor/mcp_server/`, with adjacent OpenCode plugin docs included where the same hook/plugin ownership model applies. Each group links to per-feature files that cite the real implementation and test anchors.

---

## 1. OVERVIEW

The catalog covers 42 features across 7 groups. Group 01 owns daemon correctness. Groups 02-03 own the index and lifecycle surface that feeds the scorer. Group 04 owns scoring. Group 06 exposes the MCP tools plus the daemon-backed CLI fallback. Groups 07-08 cover runtime integrations, OpenCode plugins and Python compatibility.

> **Numbering note (gap-05).** The directory layout skips slot `05--*` between `scorer-fusion` and `mcp-surface`. This is an intentional historical reservation from initial scaffold design that marked the boundary between the core scoring pipeline (groups 01-04) and the integration layer (groups 06-08). The gap is preserved to keep spec-folder cross-reference stability across packets. Do not renumber.

| Group | Count | Scope |
| --- | --- | --- |
| [daemon-and-freshness](./daemon-and-freshness/) | 7 | Watcher, lease, lifecycle, generation, trust state, rebuild-from-source, cache invalidation |
| [auto-indexing](./auto-indexing/) | 7 | Derived extraction, sanitizer, provenance, sync, anti-stuffing, DF/IDF corpus, doc-frontmatter harvest |
| [lifecycle-routing](./lifecycle-routing/) | 5 | Age haircut, supersession, archive handling, schema migration, rollback |
| [scorer-fusion](./scorer-fusion/) | 6 | 5-lane fusion, projection, ambiguity, attribution, ablation, weights config |
| [mcp-surface](./mcp-surface/) | 10 | `advisor_recommend`, `advisor_rebuild`, `advisor_status`, `advisor_validate`, stable compat entrypoint, `skill_graph_scan`, `skill_graph_query`, `skill_graph_status`, `skill_graph_validate`, daemon-backed `skill-advisor` CLI |
| [hooks-and-plugin](./hooks-and-plugin/) | 4 | Claude and OpenCode hooks, OpenCode plugin bridge and the `/goal` plugin |
| [python-compat](./python-compat/) | 3 | Python CLI shim, regression suite, bench runner |

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
| Chokidar narrow-scope watcher | [daemon-and-freshness/watcher.md](./daemon-and-freshness/watcher.md) |
| Workspace single-writer lease | [daemon-and-freshness/lease.md](./daemon-and-freshness/lease.md) |
| Daemon lifecycle and health | [daemon-and-freshness/lifecycle.md](./daemon-and-freshness/lifecycle.md) |
| Generation-tagged snapshot publication | [daemon-and-freshness/generation.md](./daemon-and-freshness/generation.md) |
| Live / stale / absent / unavailable trust state | [daemon-and-freshness/trust-state.md](./daemon-and-freshness/trust-state.md) |
| Rebuild from source on corrupt SQLite | [daemon-and-freshness/rebuild-from-source.md](./daemon-and-freshness/rebuild-from-source.md) |
| Generation-tied cache invalidation | [daemon-and-freshness/cache-invalidation.md](./daemon-and-freshness/cache-invalidation.md) |

---

## 3. AUTO-INDEXING

| Feature | File |
| --- | --- |
| Deterministic derived extraction | [auto-indexing/derived-extraction.md](./auto-indexing/derived-extraction.md) |
| A7 sanitizer at every write boundary | [auto-indexing/sanitizer.md](./auto-indexing/sanitizer.md) |
| Provenance fingerprints and trust lanes | [auto-indexing/provenance-and-trust-lanes.md](./auto-indexing/provenance-and-trust-lanes.md) |
| Graph-metadata derived sync | [auto-indexing/sync.md](./auto-indexing/sync.md) |
| Anti-stuffing and cardinality caps | [auto-indexing/anti-stuffing.md](./auto-indexing/anti-stuffing.md) |
| DF/IDF corpus stats (active-only) | [auto-indexing/df-idf-corpus.md](./auto-indexing/df-idf-corpus.md) |
| Doc-frontmatter trigger harvest (flag-gated) | [auto-indexing/doc-frontmatter-harvest.md](./auto-indexing/doc-frontmatter-harvest.md) |

---

## 4. LIFECYCLE ROUTING

| Feature | File |
| --- | --- |
| Derived-lane-only age haircut | [lifecycle-routing/age-haircut.md](./lifecycle-routing/age-haircut.md) |
| Asymmetric supersession routing | [lifecycle-routing/supersession.md](./lifecycle-routing/supersession.md) |
| Archive and future skills indexed but not routed | [lifecycle-routing/archive-handling.md](./lifecycle-routing/archive-handling.md) |
| Schema v1 to v2 additive backfill | [lifecycle-routing/schema-migration.md](./lifecycle-routing/schema-migration.md) |
| Atomic lifecycle rollback | [lifecycle-routing/rollback.md](./lifecycle-routing/rollback.md) |

---

## 5. SCORER FUSION

| Feature | File |
| --- | --- |
| Five-lane analytical fusion | [scorer-fusion/five-lane-fusion.md](./scorer-fusion/five-lane-fusion.md) |
| Registry projection drift guard and workflowMode publication | [scorer-fusion/projection.md](./scorer-fusion/projection.md) |
| Top-2 ambiguity window | [scorer-fusion/ambiguity.md](./scorer-fusion/ambiguity.md) |
| Lane contribution attribution | [scorer-fusion/attribution.md](./scorer-fusion/attribution.md) |
| Lane-by-lane ablation protocol | [scorer-fusion/ablation.md](./scorer-fusion/ablation.md) |
| Lane weights configuration | [scorer-fusion/weights-config.md](./scorer-fusion/weights-config.md) |

---

## 6. MCP SURFACE

| Feature | File |
| --- | --- |
| `advisor_recommend` MCP tool | [mcp-surface/advisor-recommend.md](./mcp-surface/advisor-recommend.md) |
| `advisor_rebuild` MCP tool | [mcp-surface/advisor-rebuild.md](./mcp-surface/advisor-rebuild.md) |
| `advisor_status` MCP tool | [mcp-surface/advisor-status.md](./mcp-surface/advisor-status.md) |
| `advisor_validate` MCP tool | [mcp-surface/advisor-validate.md](./mcp-surface/advisor-validate.md) |
| Stable `compat/index.ts` entrypoint | [mcp-surface/compat-entrypoint.md](./mcp-surface/compat-entrypoint.md) |
| `skill_graph_scan` MCP tool | [mcp-surface/skill-graph-scan.md](./mcp-surface/skill-graph-scan.md) |
| `skill_graph_query` MCP tool | [mcp-surface/skill-graph-query.md](./mcp-surface/skill-graph-query.md) |
| `skill_graph_status` MCP tool | [mcp-surface/skill-graph-status.md](./mcp-surface/skill-graph-status.md) |
| `skill_graph_validate` MCP tool | [mcp-surface/skill-graph-validate.md](./mcp-surface/skill-graph-validate.md) |
| Daemon-backed `skill-advisor` CLI (9 commands, fail-closed trusted-mutation gate) | [mcp-surface/skill-advisor-cli.md](./mcp-surface/skill-advisor-cli.md) |

---

## 7. HOOKS AND PLUGIN

| Feature | File |
| --- | --- |
| Claude Code `user-prompt-submit` hook | [hooks-and-plugin/claude-hook.md](./hooks-and-plugin/claude-hook.md) |
| OpenCode native SessionStart/UserPromptSubmit hooks with prompt-wrapper fallback | hooks-and-plugin/opencode-hook.md (not yet authored) |
| OpenCode plugin bridge | [hooks-and-plugin/opencode-plugin-bridge.md](./hooks-and-plugin/opencode-plugin-bridge.md) |
| Goal OpenCode plugin (`/goal`, `mk_goal`, `mk_goal_status`) | [hooks-and-plugin/goal-opencode-plugin.md](./hooks-and-plugin/goal-opencode-plugin.md) |

---

## 8. PYTHON COMPAT

| Feature | File |
| --- | --- |
| Python CLI shim (`skill_advisor.py`) | [python-compat/cli-shim.md](./python-compat/cli-shim.md) |
| Python regression dataset | [python-compat/regression-suite.md](./python-compat/regression-suite.md) |
| Python bench runner (`skill_advisor_bench.py`) | [python-compat/bench-runner.md](./python-compat/bench-runner.md) |
