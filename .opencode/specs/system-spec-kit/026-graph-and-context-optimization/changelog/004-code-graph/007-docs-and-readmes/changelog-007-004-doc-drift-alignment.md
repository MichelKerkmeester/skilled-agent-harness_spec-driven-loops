---
title: "Code Graph Docs 007-004: system-code-graph Doc-Drift Alignment"
description: "Four doc-drift issues reconciled across system-code-graph: tool count unified to 11, graph-metadata topology corrected from co-resident to standalone, SKILL.md continuity pointer refreshed. Version string bumped to 1.0.3.1. Doc-only packet with zero source changes."
trigger_phrases:
  - "system-code-graph doc drift alignment"
  - "mk-code-index tool count drift"
  - "graph-metadata topology standalone"
  - "skill doc version bump 1.0.3.1"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/004-doc-drift-alignment` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

The authored docs for the `system-code-graph` skill had drifted from the live runtime across four dimensions. Three different tool counts circulated across the skill files (10 in five authored surfaces, 12 in `graph-metadata.json`), while `mcp_server/tool-schemas.ts` registered exactly 11. The `graph-metadata.json` file still declared a `co-resident` topology with `mk-spec-memory` as host, which predated the packet-014 server extraction and the v1.0.3.0 three-way isolation. The `SKILL.md` continuity pointer was 14 days stale. The version string read `1.0.0.0` while the newest changelog was at `v1.0.3.0`.

Twelve direct Edit-tool patches and one grep sweep corrected all four surfaces. Every authored doc now agrees on 11 tools. `graph-metadata.json` declares the standalone `mk-code-index` server. The continuity block points at packet 020. The version row reads `1.0.3.1`. No source code was changed. No tests. No database schemas.

### Added

None.

### Changed

- Tool count in SKILL.md, README.md, ARCHITECTURE.md, INSTALL_GUIDE.md, `feature_catalog.md` updated from 10 to 11, citing `mcp_server/tool-schemas.ts` as the single source of truth
- `code_graph_classify_query_intent` row added to README section 3.2 and ARCHITECTURE section 3 to account for the previously unlisted 11th tool
- `graph-metadata.json` topology field changed from `co-resident` to `standalone` with host `mk-code-index`, matching `mcp_server/index.ts:28`
- `graph-metadata.json` `derived.causal_summary` rewritten to drop "12 MCP tools" and "co-resident" references
- `SKILL.md` `_memory.continuity` block refreshed to point at packet 020 with a current timestamp
- SKILL.md frontmatter `version` and README key-stats "Skill version" row bumped from `1.0.0.0` to `1.0.3.1`

### Fixed

- Five authored doc surfaces claimed 10 tools and `graph-metadata.json` claimed 12, while the runtime had 11. All corrected to 11.
- `graph-metadata.json` asserted a pre-extraction co-resident topology that no longer matched the runtime. Corrected to standalone.
- Stale continuity pointer caused `/spec_kit:resume` to land on the older packet 025 rather than the current work. Pointer refreshed.
- Version string `1.0.0.0` lagged the changelog by three releases. Corrected to `1.0.3.1`.

### Verification

| Check | Result |
|-------|--------|
| Post-edit grep for `10 (tools\|MCP tools)` or `12 MCP tools` across 6 scope files | PASS (no matches) |
| `validate.sh --strict` on packet 020 | PASS (exit 0) |
| `tool-schemas.ts` enumeration count | PASS (11 names) |
| `graph-metadata.json` topology field | PASS (`standalone`) |
| SKILL.md frontmatter version | PASS (`1.0.3.1`) |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Frontmatter version 1.0.0.0 to 1.0.3.1. Continuity block refreshed to packet 020. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Active MCP tools row 10 to 11. Skill version row 1.0.0.0 to 1.0.3.1. `classify_query_intent` row added. |
| `.opencode/skills/system-code-graph/ARCHITECTURE.md` | Modified | Section 3 heading updated to 11 tools. Classify row added. Sections 8 and 9 count claims updated to 11. |
| `.opencode/skills/system-code-graph/INSTALL_GUIDE.md` | Modified | `_NOTE_2_TOOLS` JSON and TOML stanzas updated from 10 to 11 tools. `classify_query_intent` added to enumeration. |
| `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md` | Modified | Line 38 tool count updated from 10 to 11 MCP tools. |
| `.opencode/skills/system-code-graph/graph-metadata.json` | Modified | Topology set to standalone. Host set to mk-code-index. Causal summary rewritten. `last_updated_at` bumped. |

### Follow-Ups

- The `mcp_server_topology` field is free-form with no schema enum. Future drift back to `co-resident` would not be caught by validation. A follow-up packet should add an enum constraint to the graph-metadata schema.
- Runtime `package.json` version stays at `1.0.0`. If skill-doc version and runtime package version need to converge, a separate packet should decide the convention.
