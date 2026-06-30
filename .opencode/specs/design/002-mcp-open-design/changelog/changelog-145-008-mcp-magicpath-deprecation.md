---
title: "Changelog: mcp-magicpath deprecation [145-mcp-open-design/008-mcp-magicpath-deprecation]"
description: "Chronological changelog for the mcp-magicpath deprecation and Open Design re-centering phase."
trigger_phrases:
  - "phase changelog"
  - "magicpath deprecation"
  - "open design re-center"
importance_tier: "normal"
contextType: "implementation"
---
# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-06-18

> Spec folder: `.opencode/specs/design/002-mcp-open-design/008-mcp-magicpath-deprecation` (Level 2)
> Parent packet: `.opencode/specs/design/002-mcp-open-design`

### Summary

This phase deprecated `mcp-magicpath`. That skill drove the hosted MagicPath canvas through the `magicpath-ai` CLI, but Spec 145 had already built, live-verified and corrected `mcp-open-design` for the installed Open Design desktop app. With a terminal-native design transport in place, this phase removed the superseded skill and re-centered shared design guidance on Open Design.

### Added

- Completed a voice sweep with no em dashes and no prose semicolons in new prose.
- Recorded `CHK-013`, `CHK-030`, `CHK-042` and `CHK-050`.
- Added changelogs for `sk-design-interface` `v1.3.0.0`, `sk-prompt` `v2.3.0.0` and `mcp-open-design` `v1.2.0.0`.

### Changed

- Grepped every `magicpath` reference across `.opencode/skills/` and the skills index README.
- Classified each reference as live or historical so historical records were preserved.
- Captured baseline `package_skill.py --check` for the three skills to bump.
- Rewrote `sk-design-interface/references/claude_design_parity.md` to two-member parity: `sk-design-interface` and `mcp-open-design`.
- Made fidelity checks use the real `previewUrl` and `get_artifact`.
- Rewrote `sk-prompt/references/design_generation_patterns.md` to the `mcp-open-design` `start_run` use case.
- Dropped the MagicPath canvas-authoring use case.
- Deleted the whole `mcp-magicpath` skill folder, all 16 files.

### Fixed

- Confirmed `mcp-open-design` as the live-verified and corrected design transport.
- Recorded `CHK-FIX-001` through `CHK-FIX-005`, covering deprecation class, reference inventory, consumer inventory, adversarial scope and matrix axes.

### Verification

| Check | Result |
|-------|--------|
| `package_skill.py --check` | PASS: `sk-design-interface`, `sk-prompt` and `mcp-open-design` each valid with no warnings. |
| Live-reference regression grep | PASS: no live `mcp-magicpath` reference remains across skills and the index. |
| Historical-record preservation | PASS: spec 142 references and historical changelog entries unchanged. |
| Graph sibling edges | PASS: reciprocal `mcp-magicpath` edges dropped, `mcp-figma` repointed to `mcp-open-design`. |
| Voice sweep | PASS: no em dashes and no new prose semicolons. |
| `validate.sh --strict` | PASS: this packet returned 0 errors. |
| P0 `CHK-FIX-004` | PASS: adversarial tests scoped, N/A for docs and metadata deprecation with no security, path or parser surface. |
| P1 `CHK-FIX-005` | PASS: matrix axes listed, N/A for removal and re-centering with no test matrix. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/mcp-magicpath/` | Updated | Deleted the whole skill folder, all 16 files. |
| `sk-design-interface/references/claude_design_parity.md` | Updated | Two-member parity onto `mcp-open-design`, fidelity on `previewUrl` and `get_artifact`. |
| `sk-design-interface/SKILL.md`, `README.md`, `feature_catalog/`, `manual_testing_playbook/`, `design_inventory.md`, `graph-metadata.json` | Updated | Live MagicPath references dropped, sibling edge removed and version `v1.3.0`. |
| `sk-design-interface/changelog/v1.3.0.0.md` | Created | Deprecation and re-centering changelog. |
| `sk-prompt/references/design_generation_patterns.md` | Updated | `mcp-open-design` `start_run` use case only. |
| `sk-prompt/SKILL.md`, `README.md` | Updated | Live MagicPath references dropped and version `v2.3.0`. |
| `sk-prompt/changelog/v2.3.0.0.md` | Created | Drop-MagicPath-usecase changelog. |
| `mcp-open-design/SKILL.md`, `README.md`, `graph-metadata.json` | Updated | MagicPath mentions dropped, sibling edge removed and version `v1.2.0`. |
| `mcp-open-design/changelog/v1.2.0.0.md` | Created | MagicPath-deprecation reference changelog. |
| `mcp-figma/SKILL.md`, `README.md`, `graph-metadata.json` | Updated | Sibling edge dropped and sibling language repointed to `mcp-open-design`. |
| `.opencode/skills/README.md` | Updated | `mcp-magicpath` index entry dropped. |
| `147-mcp-magicpath/spec.md` | Updated | Marked superseded by spec 150. |

### Follow-Ups

- The skill-advisor SQLite rescan was deferred at deprecation time, then completed later. `skill_graph_scan` dropped the `mcp-magicpath` node and edges from `skill-graph.sqlite`, verified clean with 0 occurrences across all tables.
- This was documentation and metadata deprecation, not a binary change.
- Recovery is from version control. The deleted folder is not kept in the tree.
