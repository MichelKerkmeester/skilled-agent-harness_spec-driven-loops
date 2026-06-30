---
title: "Code Graph Phase 007-002: System Code Graph README Update"
description: "Eight authored README files in the system-code-graph skill were audited and rewritten using sk-doc template variants. The root README became a human-facing skill guide, seven mcp_server subdirectory READMEs became code-section guides. Current mk-code-index naming from packet 010 was applied throughout."
trigger_phrases:
  - "system code graph readme update"
  - "sk-doc readme templates"
  - "mk-code-index readme"
  - "code graph skill readme"
  - "mcp_server readme refresh"
importance_tier: "important"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-14

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/002-system-code-graph-readmes-update` (Level 1)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

The system-code-graph skill READMEs were inconsistent after the packet 010 MCP rename. The root README read like a code-folder guide rather than a human-facing skill entry point. The database README was blank. Several subdirectory READMEs omitted current apply-mode details, the new `mk-code-index` MCP namespace. Valid related-resource links were also missing.

Eight authored README files were audited and rewritten. The root README was converted to the sk-doc skill README profile covering overview, quick-start, features, structure, config, examples, troubleshooting, FAQ and related docs. Seven `mcp_server/` subdirectory READMEs were updated to the sk-doc code-section template covering purpose, structure, boundaries, validation commands and related links. Four third-party `node_modules` READMEs were audited and left untouched. All local README links were verified to resolve and trailing whitespace was removed from the root FAQ section.

### Added

- Database subdirectory README that explains runtime SQLite artifact purpose, schema overview. Recovery guidance was also added. (Replaced a blank file.)

### Changed

- Root skill README converted from code-folder profile to sk-doc skill README profile, covering quick-start, features, structure, config, examples, troubleshooting, FAQ and related docs
- Handler layer README refreshed with current apply-mode coverage, `mk-code-index` MCP namespace and updated links
- Library layer README refreshed with current recovery modules, validation commands and links
- Utility subfolder README refreshed with workspace path helper guide and validation command
- Stress-test README refreshed with current coverage map, boundaries, validation and links
- Test-folder README refreshed with current unit and integration test map
- Tools README refreshed with current MCP dispatch surface, active tool list and `mk-code-index` namespace

### Fixed

- Trailing whitespace in root README FAQ section removed after `git diff --check` flagged it

### Verification

| Check | Result |
|-------|--------|
| Pre-check for existing packet child | PASS, no matching folder found before scaffolding. |
| Current branch check | PASS, `git branch --show-current` returned `main`. |
| README inventory | PASS, `find .opencode/skills/system-code-graph -name 'README*' -type f` found 12 files. |
| Packet 010 status check | PASS, implementation summary showed `mk-code-index` rename complete at 100%. |
| sk-doc README validation | PASS, all eight edited authored READMEs returned VALID with 0 blocking issues. |
| Local README link check | PASS, all local README links in authored README files resolved. |
| `git diff --check` for edited files | PASS after removing trailing spaces from the root README FAQ. |
| `validate.sh --strict` for packet | PASS, exit 0 with 0 errors and 0 warnings. |
| Git staging | BLOCKED, sandbox denied `.git/index.lock` creation. Files were not staged during the authoring session. |

### Files Changed

| File | What changed |
|------|--------------|
| `.opencode/skills/system-code-graph/README.md` | Rewritten as skill overview guide using `skill_readme_template.md`. Diff +196 / -264. |
| `.opencode/skills/system-code-graph/mcp_server/database/README.md` | Replaced blank file with SQLite runtime artifact guide using `readme_code_template.md`. Diff +123 / -0. |
| `.opencode/skills/system-code-graph/mcp_server/handlers/README.md` | Refreshed handler topology, apply-mode coverage, namespace and links. Diff +73 / -87. |
| `.opencode/skills/system-code-graph/mcp_server/lib/README.md` | Refreshed library topology, recovery modules, validation and links. Diff +141 / -121. |
| `.opencode/skills/system-code-graph/mcp_server/lib/utils/README.md` | Refreshed workspace path helper guide and validation command. Diff +40 / -40. |
| `.opencode/skills/system-code-graph/mcp_server/stress_test/code-graph/README.md` | Refreshed stress test coverage map, boundaries, validation and links. Diff +58 / -17. |
| `.opencode/skills/system-code-graph/mcp_server/tests/README.md` | Refreshed unit and integration test map. Diff +75 / -24. |
| `.opencode/skills/system-code-graph/mcp_server/tools/README.md` | Refreshed MCP dispatch surface, active tools, namespace and validation. Diff +107 / -16. |

### Follow-Ups

- Stage and commit the eight edited README files and the packet docs when git index writes are permitted in the operator environment.
- Verify that the database README at `mcp_server/database/README.md` was correctly carried forward after the subsequent database relocation fix in commit `69e7bf12d1`.
