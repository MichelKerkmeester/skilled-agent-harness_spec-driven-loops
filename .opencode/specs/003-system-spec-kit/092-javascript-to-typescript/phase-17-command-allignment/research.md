# Research: Command Alignment (Post JS-to-TS Migration)

<!-- SPECKIT_LEVEL: 3 -->

---

## Research Summary

10 parallel research agents (Opus 4.6) conducted a comprehensive audit of all command files in `.opencode/command/` against the post-migration filesystem state. Research outputs are preserved in `scratch/agent-*.md`.

---

## Agent Coverage Map

| Agent | Scope | Key Findings |
|-------|-------|-------------|
| Agent 1 | spec_kit command .md files (7 files) | 5 critical broken paths in 4 files (complete, handover, plan, research). 2 files clean (debug, resume). implement.md clean. |
| Agent 2 | spec_kit YAML assets batch 1 (7 files) | 1 critical (`create-spec-folder.sh` ghost), 1 warning (`generate-context.js` path) in 4 files. 3 files clean (debug, handover). |
| Agent 3 | spec_kit YAML assets batch 2 (6 files) | 2 critical (`generate-context.js` in research YAMLs), 2 warnings (`create-spec-folder.sh` in plan YAMLs). 2 files clean (resume). |
| Agent 4 | create command .md files (6 files) | 3 critical issues in agent.md + create_agent.yaml. 5 files clean. |
| Agent 5 | create YAML assets (6 files) | 1 critical in create_agent.yaml. 5 files clean. |
| Agent 6 | TypeScript file map | Full inventory: 124 .ts source files, 36 non-migrated .js tests, all 3 workspace dist/ directories mapped. |
| Agent 7 | Refactor changes analysis | Decision D2 planned in-place compilation but actual tsconfig uses `outDir: "./dist"`. 3 file moves, 1 deletion, ~200 renames documented. |
| Agent 8 | Cross-reference path validation | 18+ broken refs in 13 files (generate-context.js). 4 broken refs (create-spec-folder.sh). 5 valid paths confirmed. |
| Agent 9 | Runtime configuration check | Zero critical mismatches. opencode.json correctly uses `dist/context-server.js`. All 22 MCP tool names match. |
| Agent 10 | Script reference inventory | 16 broken command refs + 2 CLAUDE.md refs = 18 total. rank-memories, cleanup, reindex, detect-spec-folder not referenced in commands. |

---

## Key Finding: Decision D2 Discrepancy

The parent spec 092's `decision-record.md` Decision D2 stated:
> "opencode.json startup command unchanged" — in-place compilation

But the actual tsconfig implementations use `outDir: "./dist"`:
- `shared/tsconfig.json`: `"outDir": "./dist"`
- `mcp_server/tsconfig.json`: `"outDir": "./dist"`
- `scripts/tsconfig.json`: `"outDir": "./dist"`

**Verification**: `ls scripts/memory/generate-context.js` → NOT FOUND. `ls scripts/dist/memory/generate-context.js` → EXISTS.

This means Decision D2's in-place claim is inaccurate for the scripts workspace. The MCP server entry point (`opencode.json`) was correctly updated to `dist/context-server.js`, but command files were not updated.

---

## Consolidated Issue Inventory

### CRITICAL: Broken generate-context.js Path (18+ references)

| # | File | Line(s) | Occurrences |
|---|------|---------|-------------|
| 1 | `command/spec_kit/complete.md` | 380, 382 | 1 invocation path |
| 2 | `command/spec_kit/handover.md` | 323 | 1 invocation path |
| 3 | `command/spec_kit/plan.md` | 449, 455 | 2 (1 table ref + 1 invocation) |
| 4 | `command/spec_kit/research.md` | 575, 596, 624, 858 | 4 (2 invocations + 2 contextual) |
| 5 | `command/create/agent.md` | 549 | 1 invocation path |
| 6 | `command/memory/save.md` | 282, 424, 457-458, 477, 499, 502, 877 | 8 (mixed invocation + contextual) |
| 7 | `command/create/assets/create_agent.yaml` | 383, 386 | 1 invocation + 1 text |
| 8 | `command/spec_kit/assets/spec_kit_research_auto.yaml` | 975, 976, 977 | 1 invocation + 2 contextual |
| 9 | `command/spec_kit/assets/spec_kit_research_confirm.yaml` | 1068, 1069, 1070 | 1 invocation + 2 contextual |
| 10 | `command/spec_kit/assets/spec_kit_complete_auto.yaml` | 1894, 1896, 1904 | 1 invocation + 2 contextual |
| 11 | `command/spec_kit/assets/spec_kit_complete_confirm.yaml` | 1788, 1790, 1798 | 1 invocation + 2 contextual |

### WARNING: Stale create-spec-folder.sh (4 references)

| # | File | Line | Context |
|---|------|------|---------|
| 1 | `spec_kit/assets/spec_kit_complete_auto.yaml` | 1136 | Activity description |
| 2 | `spec_kit/assets/spec_kit_complete_confirm.yaml` | 1142 | Activity description |
| 3 | `spec_kit/assets/spec_kit_plan_auto.yaml` | 676 | Activity description |
| 4 | `spec_kit/assets/spec_kit_plan_confirm.yaml` | 710 | Activity description |

### VERIFIED CLEAN: Files With No Issues

**spec_kit commands**: debug.md, resume.md, implement.md
**spec_kit assets**: debug_auto.yaml, debug_confirm.yaml, handover_full.yaml, resume_auto.yaml, resume_confirm.yaml
**create commands**: folder_readme.md, install_guide.md, skill_asset.md, skill_reference.md, skill.md
**create assets**: create_folder_readme.yaml, create_install_guide.yaml, create_skill_asset.yaml, create_skill_reference.yaml, create_skill.yaml

### VERIFIED CORRECT: Runtime Configuration

- `opencode.json` → `dist/context-server.js` (correct)
- `.utcp_config.json` → No internal paths (correct)
- All 22 MCP tool names match between server and commands (correct)

---

## Evidence Grade

| Finding | Grade | Source |
|---------|-------|--------|
| Compiled JS is in dist/ | A (Primary) | tsconfig.json outDir, package.json main, ls verification |
| No .js at scripts/memory/ | A (Primary) | ls returns no file |
| Command files use wrong path | A (Primary) | grep results across all files |
| All template/agent paths valid | A (Primary) | ls verification on every referenced path |
| MCP tool names match | A (Primary) | context-server.ts ListToolsRequestSchema vs command grep |
| create-spec-folder.sh missing | A (Primary) | glob search returns 0 results |
| create.sh exists at scripts/spec/ | A (Primary) | ls verification |
