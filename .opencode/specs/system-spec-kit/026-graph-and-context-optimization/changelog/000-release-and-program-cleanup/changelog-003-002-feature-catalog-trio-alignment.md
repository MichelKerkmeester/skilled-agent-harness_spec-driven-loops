---
title: "Feature Catalog Trio Alignment for Packets 031-036"
description: "Doc-only refresh that updated system-spec-kit and skill_advisor feature catalogs with shipped packet 031-036 surfaces. Tool count raised to 54. The missing standalone code_graph catalog gap is documented rather than fabricated."
trigger_phrases:
  - "feature catalog trio alignment"
  - "catalog refresh 031 036"
  - "system-spec-kit catalog tool count 54"
  - "advisor rebuild catalog entry"
  - "memory retention sweep catalog"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/002-feature-catalog-trio-alignment` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass`

### Summary

Packets 031-036 shipped new MCP tools, hook diagnostics, CLI matrix runners. Freshness contracts changed too. The feature catalogs for system-spec-kit and skill_advisor had not been updated. Operators reading the catalogs would see a stale tool count of 51. They would miss the retention sweep, CLI matrix adapter runners, Codex freshness smoke check. The advisor rebuild surface was absent.

This doc-only packet refreshed all three catalogs without touching runtime code. New MCP tools and handlers are line-cited against real source files. The system-spec-kit root catalog now shows a tool count of 54. The skill_advisor catalog now lists `advisor_rebuild` as a first-class MCP surface entry and marks `advisor_status` as diagnostic-only. A standalone code_graph feature catalog was not found during discovery, so the gap is recorded in `discovery-notes.md` and the existing code-graph readiness entry inside system-spec-kit category 22 was updated instead.

### Added

- Retention sweep feature entry at `feature_catalog/04--maintenance/037-memory-retention-sweep.md` (system-spec-kit)
- CLI matrix adapter runners entry at `feature_catalog/16--tooling-and-scripts/238-cli-matrix-adapter-runners.md` documenting packet 036 adapter files
- Codex freshness smoke-check entry at `feature_catalog/16--tooling-and-scripts/239-codex-hook-freshness-smoke-check.md`
- Advisor rebuild entry at `system-skill-advisor/feature_catalog/06--mcp-surface/029-advisor-rebuild.md`
- `discovery-notes.md` recording catalog locations, template paths, packet 036 presence. The missing standalone code_graph catalog gap is noted there.

### Changed

- System-spec-kit root catalog tool count raised from 51 to 54
- Code-graph readiness entry updated with no-watcher read-path and manual freshness contract from packet 032
- Skill_advisor `advisor_status` entry updated to state its diagnostic-only contract
- Skill_advisor root catalog count and MCP surface group updated to reflect five entries

### Fixed

- Stale tool count of 51 in system-spec-kit root catalog replaced with verified count of 54 from `TOOL_DEFINITIONS.length`
- Missing catalog entries for packet 031-036 surfaces made the catalogs incomplete for operators

### Verification

| Check | Result |
|-------|--------|
| Discovery commands | PASS: catalog and template paths recorded in `discovery-notes.md` |
| Packet 036 presence | PASS: `mcp_server/matrix_runners/adapter-cli-*.ts` files found |
| Tool count | PASS: `TOOL_DEFINITIONS.length` resolved to 54 from built MCP server module |
| sk-doc validation | PASS: modified root catalogs and per-feature entries passed `validate_document.py --blocking-only` |
| Strict packet validation | PASS: `validate.sh` exited 0 for this packet folder |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-spec-kit/feature_catalog/feature_catalog.md` | Modified | Tool count raised to 54. Root catalog summaries updated. |
| `.opencode/skills/system-spec-kit/feature_catalog/04--maintenance/037-memory-retention-sweep.md` (NEW) | Created | Retention sweep feature catalog entry |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/238-cli-matrix-adapter-runners.md` (NEW) | Created | CLI matrix adapter runners entry citing packet 036 adapter files |
| `.opencode/skills/system-spec-kit/feature_catalog/16--tooling-and-scripts/239-codex-hook-freshness-smoke-check.md` (NEW) | Created | Codex hook freshness smoke-check entry |
| `.opencode/skills/system-spec-kit/feature_catalog/22--context-preservation/` | Modified | Code-graph readiness entry updated with read-path and manual freshness note |
| `.opencode/skills/system-skill-advisor/feature_catalog/feature_catalog.md` | Modified | Advisor MCP surface count updated. `advisor_rebuild` added to entry list. |
| `.opencode/skills/system-skill-advisor/feature_catalog/06--mcp-surface/029-advisor-rebuild.md` (NEW) | Created | Advisor rebuild MCP tool catalog entry |
| `discovery-notes.md` (NEW) | Created | Catalog discovery results and code_graph gap documentation |

### Follow-Ups

- No standalone code_graph feature catalog exists. The discovery gap is documented in `discovery-notes.md` and the existing system-spec-kit code-graph entry was updated in place. A future packet should create a dedicated `system-code-graph` feature catalog when the standalone catalog surface is established.
