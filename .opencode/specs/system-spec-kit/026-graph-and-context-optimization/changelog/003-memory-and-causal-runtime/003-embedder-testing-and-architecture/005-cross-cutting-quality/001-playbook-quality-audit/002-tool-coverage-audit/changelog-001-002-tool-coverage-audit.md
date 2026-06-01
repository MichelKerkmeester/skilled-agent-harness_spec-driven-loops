---
title: "Playbook Quality Audit 002: Tool-surface coverage audit"
description: "Cross-referenced all 42 mk-spec-memory MCP tools against pre-expansion playbook scenarios and classified coverage gaps. Produced a machine-readable CSV mapping each tool to its invoked scenario count and gap class."
trigger_phrases:
  - "tool-surface coverage audit"
  - "mk-spec-memory tool coverage"
  - "council graph uncovered tools"
  - "embedder tools need scenarios"
  - "playbook tool gap audit"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-17

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit/002-tool-coverage-audit`
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/003-memory-and-causal-runtime/003-embedder-testing-and-architecture/005-cross-cutting-quality/001-playbook-quality-audit`

### Summary

Before this audit the playbook had no systematic record of which mk-spec-memory MCP tools were exercised by existing scenarios and which had zero coverage. All 42 tools were cross-referenced against the pre-expansion playbook scenario set. Each tool received a coverage gap class from the set: `well-covered`, `uncovered`, `embedder-tools-need-new-scenarios`. The resulting CSV gives the playbook authoring pipeline a stable regenerable baseline for targeting new scenarios at the right gaps.

Thirty-eight of the 42 tools were classified as well-covered. Four council graph tools (`council_graph_query`, `council_graph_status`, `council_graph_upsert`, `council_graph_convergence`) had zero scenario invocations and were classified as uncovered. Three embedder tools (`embedder_list`, `embedder_set`, `embedder_status`) had zero invocations and were classified as needing new scenarios. The CSV is regenerable from `generate-playbook-quality-audit.js`.

### Added

- `evidence/tool-coverage-audit.csv` mapping all 42 mk-spec-memory tools to invoked scenario counts and gap classes

### Changed

- None.

### Fixed

- None.

### Verification

| Check | Result |
|-------|--------|
| `evidence/tool-coverage-audit.csv` present and populated with 42 tool rows | PASS |
| All 8 tasks marked complete in `tasks.md` | PASS |
| `node ../evidence/generate-playbook-quality-audit.js` regenerates artifact | PASS |
| Parent packet validates with `validate.sh --strict` | PASS |

### Files Changed

| File | What changed |
|------|-------------|
| `002-tool-coverage-audit/evidence/tool-coverage-audit.csv` (NEW) | 42-row audit CSV classifying all mk-spec-memory tools by coverage gap class. |

### Follow-Ups

- Author new playbook scenarios for the 4 uncovered council graph tools (`council_graph_query`, `council_graph_status`, `council_graph_upsert`, `council_graph_convergence`).
- Author new playbook scenarios for the 3 embedder tools (`embedder_list`, `embedder_set`, `embedder_status`).
