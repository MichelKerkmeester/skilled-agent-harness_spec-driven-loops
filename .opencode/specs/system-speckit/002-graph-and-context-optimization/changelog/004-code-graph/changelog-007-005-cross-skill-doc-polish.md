---
title: "Code Graph Phase 007-005: Cross-Skill Doc Polish"
description: "Aligned system-skill-advisor and system-code-graph SKILL.md files to the sk-doc canonical template shape. Fixed stale tool counts across 6 runtime configs and AGENTS.md. Added 4 new reference docs to the code-graph skill covering tool surface, readiness contract, CocoIndex bridge, naming conventions."
trigger_phrases:
  - "cross-skill doc polish"
  - "code-graph skill md restructure"
  - "mk_code_index tool count fix"
  - "skill-advisor orphan references"
  - "mk_skill_advisor tool count"
importance_tier: "normal"
contextType: "implementation"
---

# Changelog

<!-- SPECKIT_TEMPLATE_SOURCE: changelog/phase.md | v1.0 -->

## 2026-05-16

> Spec folder: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes/005-cross-skill-doc-polish` (Level 2)
> Parent packet: `.opencode/specs/system-spec-kit/026-graph-and-context-optimization/004-code-graph/007-docs-and-readmes`

### Summary

Two system skills had drifted from the sk-doc canonical template shape: `system-code-graph` SKILL.md was missing the structured SMART ROUTING subsections and the RULES section was a flat bullet list instead of H3 ALWAYS/NEVER/ESCALATE IF blocks. Six runtime config files and `AGENTS.md` were undercounting MCP tool surfaces, reporting 10 tools for `mk_code_index` (the correct count is 11, including `code_graph_classify_query_intent`) and 8 tools for `mk_skill_advisor` (the correct count is 9, the internal `skill_graph_propagate_enhances` was missing from five of six configs).

The packet restructured the code-graph SKILL.md to the canonical 8-section shape, fixed the tool counts across all 6 runtime configs and `AGENTS.md`, updated the database-path-policy reference to the post-consolidation shared path, linked 3 previously orphaned reference docs in the skill-advisor SKILL.md and README. It also added 4 new reference docs to the code-graph skill. Operators can now trust the tool count annotations in all runtime configs and find the full code-graph tool surface, readiness contract, CocoIndex bridge, naming conventions through the skill's references.

### Added

- `references/tool-surface.md` (NEW): 11-tool surface reference listing handler files and preconditions for each `mk_code_index` tool
- `references/readiness-and-scope-fingerprint.md` (NEW): readiness state machine and scope fingerprint contract
- `references/ccc-bridge-integration.md` (NEW): guidance on when to use `ccc_status`, `ccc_reindex`, `ccc_feedback` alongside CocoIndex
- `references/naming-conventions.md` (NEW): name map across skill folder, MCP server, launcher, plugin bridge, hook location

### Changed

- `system-code-graph` SKILL.md restructured to canonical 8-section sk-doc shape: new SMART ROUTING subsections (Primary Detection Signal, Phase Detection, Resource Loading Levels), §4 RULES converted from flat bullets to H3 ALWAYS/NEVER/ESCALATE IF blocks, §8 REFERENCES consolidated, `_memory.continuity` frontmatter block removed
- `system-code-graph` `references/database-path-policy.md` updated to canonical shared path `.opencode/.spec-kit/code-graph/database/code-graph.sqlite` with second-migration record added
- `system-skill-advisor` SKILL.md §5 and README §9 now link the 3 previously orphaned reference docs (`skill-graph-drift.md`, `skill-graph-extraction-plan.md`, `deferred-decisions.md`)
- All 6 runtime configs (`opencode.json`, `.codex/config.toml`, `.claude/mcp.json`, `.gemini/settings.json`, `.devin/config.json`, `.vscode/mcp.json`) corrected: `mk_code_index` tool count 10 to 11, `mk_skill_advisor` tool count 8 to 9
- `AGENTS.md` §6 MCP routing block updated to match the corrected counts

### Fixed

- `mk_code_index` was reported as 10 tools in 5 of 6 runtime configs. The tool `code_graph_classify_query_intent` was registered but missing from the count annotation.
- `mk_skill_advisor` was reported as 8 tools in 5 of 6 runtime configs. The internal tool `skill_graph_propagate_enhances` was missing from the count annotation.
- `references/database-path-policy.md` pointed at the pre-consolidation skill-local DB path. Now reflects the canonical shared location.
- `_memory.continuity` block in `system-code-graph` SKILL.md frontmatter referenced a stale packet path (`029-system-code-graph-uplift`) that does not exist. Block removed.

### Verification

| Check | Result |
|-------|--------|
| `bash .opencode/skills/system-spec-kit/scripts/spec/validate.sh 021-cross-skill-doc-polish` | PASS. 0 errors, 0 warnings. |
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-code-graph --check` | PASS. 9 warnings, all pre-existing kebab-case naming (out of scope). |
| `python3 .opencode/skills/sk-doc/scripts/package_skill.py .opencode/skills/system-skill-advisor --check` | PASS. 16 warnings, all pre-existing kebab-case naming. |
| Stale-string sweep across 6 runtime configs and AGENTS.md | PASS. Zero hits for old counts (8 tools skill-advisor, 10 tools code-graph). |
| Fresh-string presence across 6 runtime configs | PASS. All 6 files have both corrected count strings. |
| Code-graph SKILL.md section sequence | PASS. WHEN_TO_USE then SMART_ROUTING then HOW_IT_WORKS then RULES then REFERENCES then SUCCESS_CRITERIA then INTEGRATION_POINTS then REFERENCES_AND_RELATED_RESOURCES. |
| Code-graph §4 RULES subsections | PASS. H3 ALWAYS, NEVER, ESCALATE IF all present. |

### Files Changed

| File | Action | What changed |
|------|--------|--------------|
| `.opencode/skills/system-code-graph/SKILL.md` | Modified | Restructured §2 SMART ROUTING, §4 RULES (H3 subsections), §7 INTEGRATION POINTS, §8 REFERENCES. Removed `_memory.continuity` block. Version 1.0.3.1 to 1.0.3.2. |
| `.opencode/skills/system-code-graph/README.md` | Modified | Added 4 new reference links in §9 RELATED DOCUMENTS. |
| `.opencode/skills/system-code-graph/references/database-path-policy.md` | Modified | Updated §2 POLICY to canonical shared path. Added §5 second-migration record. |
| `.opencode/skills/system-code-graph/references/naming-conventions.md` | Created (NEW) | Name map across skill folder, MCP server, launcher, plugin bridge, hook location. |
| `.opencode/skills/system-code-graph/references/tool-surface.md` | Created (NEW) | 11-tool surface reference with handler files and preconditions. |
| `.opencode/skills/system-code-graph/references/readiness-and-scope-fingerprint.md` | Created (NEW) | Readiness state machine and scope fingerprint contract. |
| `.opencode/skills/system-code-graph/references/ccc-bridge-integration.md` | Created (NEW) | Guidance on when to use the three `ccc_*` tools with CocoIndex. |
| `.opencode/skills/system-skill-advisor/SKILL.md` | Modified | Linked 3 orphan references in §5. |
| `.opencode/skills/system-skill-advisor/README.md` | Modified | Linked same 3 orphan references in §9. |
| `opencode.json` | Modified | Fixed `mk_code_index` count 10 to 11. Added `classify_query_intent` entry. |
| `.codex/config.toml` | Modified | Fixed `mk_skill_advisor` count 8 to 9 and `mk_code_index` count 10 to 11. |
| `.claude/mcp.json` | Modified | Fixed both server counts to match canonical values. |
| `.gemini/settings.json` | Modified | Fixed both server counts to match canonical values. |
| `.devin/config.json` | Modified | Fixed both server counts to match canonical values. |
| `.vscode/mcp.json` | Modified | Fixed both server counts to match canonical values. |
| `AGENTS.md` | Modified | §6 MCP routing block: skill-advisor 8 to 9, code-graph 10 to 11. |

### Follow-Ups

- Tighten `tsconfig.json` `include` and `exclude` in the system-code-graph package so the build only emits its own output and stops mirroring compiled output for sibling packages into `dist/`.
- Remove the deprecation banner and old hook paths from `system-skill-advisor/references/deferred-decisions.md` after the 90-day deprecation window expires on 2026-08-16.
