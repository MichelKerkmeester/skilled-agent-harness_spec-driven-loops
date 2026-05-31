---
title: "Changelog: 037/006 README Cascade Refresh"
description: "First-party README cascade updated after packets 031-037 landed. Tool counts, folder trees, cross-references and version tags across the mcp_server subtree and parent skill docs now match the live post-037 codebase."
trigger_phrases:
  - "readme cascade refresh"
  - "mcp_server readme update"
  - "54-tool count readme"
  - "advisor_rebuild readme"
  - "matrix_runners stress_test readme"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-04-29

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass/006-readme-cascade-refresh` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/000-release-and-program-cleanup/004-followup-post-program/003-post-program-quality-pass`

### Summary

Packets 031-036 and 037/001-005 changed the documentation surface: the MCP registry grew to 54 tools, `matrix_runners/` and `stress_test/` became live folders and `advisor_rebuild` joined the public Skill Advisor surface. Several parent and subfolder READMEs still cited 51 tools, referenced hyphenated subsystem paths that had moved and omitted the new folders and handlers.

A targeted documentation cascade refreshed all first-party READMEs under `.opencode/skills/system-spec-kit/mcp_server/` and the parent skill docs. A `target-list.md` audit file recorded every README inventoried, the stale claims found and the PASS or UPDATED outcome for each. Vendored `node_modules` and cache READMEs were explicitly excluded because they are not authored system-spec-kit documentation.

Operators reading the parent README, the MCP server README, install guides and subfolder handler or library READMEs now see accurate tool counts, correct folder trees and links that resolve.

### Added

- `target-list.md` audit file recording discovery, exclusions, stale-claim findings and PASS or UPDATED verdicts for each first-party README

### Changed

- `.opencode/skills/system-spec-kit/README.md`: updated 54-tool count, feature and playbook counts, structure tree and related links
- `.opencode/skills/system-spec-kit/mcp_server/README.md`: updated tool count, Skill Advisor tool list, structure tree, paths and version footer
- `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md`: updated 54-tool claim and skill_advisor links
- `.opencode/skills/system-spec-kit/mcp_server/handlers/README.md`: added retention sweep entry and refreshed code_graph handler paths
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md`: added verify, detect and CCC tool coverage plus corrected folder name
- `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/README.md`: added verify, detect_changes and CCC handler entries
- `.opencode/skills/system-spec-kit/mcp_server/lib/README.md`: refreshed live library category and module counts plus governance entry
- `.opencode/skills/system-spec-kit/mcp_server/lib/governance/README.md`: added retention sweep helper
- `.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md`: fixed code_graph related-doc link
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md`: added freshness smoke-check helper
- `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md`: updated schema registry explanation for the 54-tool surface
- `.opencode/skills/system-spec-kit/mcp_server/tools/README.md`: added retention sweep dispatch note

### Fixed

- Stale 51-tool count in parent and MCP server docs replaced with the live 54-tool count from `TOOL_DEFINITIONS`
- Hyphenated subsystem paths in cross-references corrected to match the post-rename folder layout
- Missing `advisor_rebuild`, `memory_retention_sweep`, `code_graph_verify` and `detect_changes` entries added to handler and tool reference tables

### Verification

| Check | Result |
|-------|--------|
| `TOOL_DEFINITIONS` count via `awk` | PASS. Count returned 54. |
| Package version check | PASS. `@spec-kit/mcp-server` v1.8.0 and `@modelcontextprotocol/sdk` ^1.24.3 read from `package.json`. |
| Stale claim search (51-tool and hyphenated paths) | PASS. Scoped hits repaired or identified as unrelated spec-folder examples. |
| Markdown local link check | PASS. |
| `validate.sh .../006-readme-cascade-refresh --strict` | PASS. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `target-list.md` (NEW) | Created | README inventory, exclusions, stale-claim audit and PASS or UPDATED verdicts |
| `.opencode/skills/system-spec-kit/README.md` | Modified | 54-tool count, feature and playbook counts, structure tree and related links |
| `.opencode/skills/system-spec-kit/mcp_server/README.md` | Modified | Tool count, Skill Advisor tool list, structure tree, paths and version footer |
| `.opencode/skills/system-spec-kit/mcp_server/INSTALL_GUIDE.md` | Modified | 54-tool claim and skill_advisor links |
| `.opencode/skills/system-spec-kit/mcp_server/handlers/README.md` | Modified | Retention sweep entry. Refreshed code_graph handler paths. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/README.md` | Modified | Verify, detect and CCC tool coverage. Corrected folder name. |
| `.opencode/skills/system-spec-kit/mcp_server/code_graph/handlers/README.md` | Modified | verify, detect_changes and CCC handler entries |
| `.opencode/skills/system-spec-kit/mcp_server/lib/README.md` | Modified | Library category and module counts. Governance entry refreshed. |
| `.opencode/skills/system-spec-kit/mcp_server/lib/governance/README.md` | Modified | Retention sweep helper added |
| `.opencode/skills/system-spec-kit/mcp_server/lib/enrichment/README.md` | Modified | code_graph related-doc link corrected |
| `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/README.md` | Modified | Freshness smoke-check helper added |
| `.opencode/skills/system-spec-kit/mcp_server/schemas/README.md` | Modified | Schema registry explanation updated for 54-tool surface |
| `.opencode/skills/system-spec-kit/mcp_server/tools/README.md` | Modified | Retention sweep dispatch note added |

### Follow-Ups

- Broad runtime tests were not run. This packet is doc-only. Packet 037/005 already recorded the `npm test` suite blocker and the passing `npm run stress` result.
