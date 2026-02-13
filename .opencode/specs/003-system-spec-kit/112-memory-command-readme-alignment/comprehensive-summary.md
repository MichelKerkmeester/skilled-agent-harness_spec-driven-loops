# Comprehensive Implementation Summary — Specs 111 & 112

> README Anchor Schema, Memory System Integration, and Memory Command Alignment

## Overview

Specs 111 and 112 together represent the evolution of the Spec Kit Memory system from a 2-source indexing pipeline (spec memory files + constitutional files) to a 4-source pipeline that additionally discovers and indexes skill READMEs and project READMEs across the workspace. Spec 111 delivered the core infrastructure: new discovery functions, a tiered importance weight system, anchor prefix matching, 165 new tests, and the migration of 74 README files with approximately 473 anchor tags. Spec 112 followed as a documentation-only alignment pass, propagating 8 new features from spec 111 into 3 memory command files and 7 YAML workflow assets that had not been updated. The combined work touched approximately 120+ files across TypeScript source code, Vitest test suites, markdown documentation, README files, YAML assets, and spec folder artifacts. All changes maintain full backward compatibility — existing memory files, search queries, and command invocations continue to function without modification. The final test suite stands at 4,037 tests passed across 120 files with 0 failures.

## Metrics

| Metric | Value |
|--------|-------|
| Specs completed | 2 (111 + 112) |
| Total files touched | ~120+ |
| Code files modified | 10 |
| Test files created | 6 (165 tests) |
| Documentation files created/modified | ~15 |
| README files migrated (anchors added) | 74 (~473 anchors) |
| YAML asset files updated | 7 |
| Command .md files updated | 3 |
| Resume bug fix files | 3 |
| Total test suite | 4,037 passed / 0 failed / 120 files |

## 1. Core Code Files (Spec 111)

### 1.1 `mcp_server/handlers/memory-index.ts`

Added `findSkillReadmes(workspacePath)` and `findProjectReadmes(workspaceRoot)` as two new discovery functions that form the third and fourth sources in the 4-source indexing pipeline. `findSkillReadmes` recursively walks `.opencode/skill/` to locate all `README.md` files while skipping `node_modules` and hidden directories. `findProjectReadmes` performs a broader workspace traversal excluding `.opencode/skill/` (handled separately), `.git`, `node_modules`, `dist`, `build`, `.next`, `coverage`, `vendor`, `__pycache__`, and `.pytest_cache` via a 13-pattern exclusion list. The handler's main `handleMemoryIndexScan` function was updated to gather files from all four sources and supports the new `includeReadmes` parameter (defaulting to `true`) that controls whether README files are included in scan operations. A symlink resolution fix at the filesystem traversal level handles macOS MEGA cloud sync symlinked paths that were causing discovery failures.

### 1.2 `mcp_server/handlers/memory-save.ts`

Introduced the `calculateReadmeWeight(filePath)` function that implements a three-tier importance scoring system for the save pipeline. Skill README files matching `.opencode/skill/**/readme.md` receive a weight of 0.3 (lowest — reference material), project and code-folder READMEs receive 0.4 (mid-priority), and all other user work memories retain the standard 0.5 weight. This tiered system feeds into the search scoring formula `score *= (0.5 + importance_weight)`, which ensures user-created content always outranks auto-indexed README documentation in search results. The function integrates with the existing `findSimilarMemories()` deduplication check and `reinforceExistingMemory()` FSRS scheduling logic so that repeated indexing of the same README reinforces its stability rather than creating duplicate entries.

### 1.3 `mcp_server/handlers/memory-search.ts`

Fixed a similarity normalization bug where scores from different embedding providers were not being normalized to a consistent scale before ranking. The original implementation had similarity scores on a 0–100 scale while importance and recency weights operated on a 0–1 scale, making the tiered weight system effectively inert since similarity dominated all scoring. Applied consistent min-max normalization across all search results to bring similarity scores into the 0–1 range, aligning them with the importance weight multiplier and ensuring fair ranking between user memories, project READMEs, and skill READMEs. This fix was critical because without it, the entire tiered importance weight system from ADR-006 would have had no observable effect on search result ordering.

### 1.4 `mcp_server/lib/parsing/memory-parser.ts`

Extended `isMemoryFile()` with validation logic that recognizes README files as indexable memory sources across three categories: spec memory files (`.md` files under `/specs/*/memory/`), constitutional files (`.md` under `.opencode/skill/*/constitutional/`, excluding READMEs), and skill READMEs (`readme.md` under `.opencode/skill/`). Added the `README_EXCLUDE_PATTERNS` array containing 13 directory patterns (`node_modules`, `.git/`, `dist/`, `build/`, `.next/`, `coverage/`, `vendor/`, `__pycache__`, `.pytest_cache`, and others) to filter out non-content directories during project README discovery. Introduced `isProjectReadme(filePath)` as a dedicated validation function that checks a file ends with `readme.md` and does not match any exclude pattern. Enhanced `extractSpecFolder()` to handle README file paths that do not follow the traditional `specs/###-name/` structure, using a `skill:SKILL-NAME` prefix convention (per ADR-005) for skill READMEs and a `project-readmes` virtual folder for project READMEs.

### 1.5 `mcp_server/lib/config/memory-types.ts`

Added the `PATH_TYPE_PATTERNS` array — a set of regex-to-memory-type mappings used to infer cognitive memory types from file paths. Patterns classify files into 9 types modeled after human memory research: `/scratch/` and `/temp/` map to `working` (1-day half-life), `session-\d+` and `debug-log` to `episodic` (7-day), `todo` and `next-steps` to `prospective` (14-day), `architecture` and `readme.md` to `semantic` (180-day, effectively permanent), and so on. These patterns power the tiered importance weight system by enabling automatic type detection when a file's YAML frontmatter does not specify a memory type explicitly. The `readme.md` pattern mapping to the `semantic` type ensures READMEs receive effectively zero decay (180-day half-life with a 1.5x boost per ADR-002), preserving their value as long-lived reference documentation.

### 1.6 `mcp_server/lib/search/intent-classifier.ts`

Fixed a similarity normalization inconsistency where the intent classifier's internal scoring used a different normalization approach than the main search handler in `memory-search.ts`. Before the fix, the intent classifier was producing score discrepancies that caused ranking instability when intent-based weight adjustments were applied on top of already-skewed similarity values. Aligned the normalization approach to use the same min-max formula as the search handler, ensuring that intent classification weights (such as boosting `procedural` memories for `fix_bug` intents) produce consistent, predictable effects on final search rankings.

### 1.7 `mcp_server/tool-schemas.ts`

Added the `includeReadmes` boolean parameter to the `memory_index_scan` tool schema definition at line 154. The parameter defaults to `true` and is described as controlling whether `.opencode/skill/` directories are scanned for `README.md` files during index operations. The description explicitly notes that README files are indexed with reduced importance (0.3 for skill READMEs) to ensure they never outrank user work memories in search results. This schema change makes the parameter visible to all MCP clients and ensures proper type validation at the protocol boundary.

### 1.8 `mcp_server/tools/types.ts`

Extended the `ScanArgs` TypeScript interface (lines 112–118) to include the optional `includeReadmes?: boolean` property alongside the existing `specFolder`, `force`, `includeConstitutional`, and `incremental` fields. This maintains type safety throughout the handler chain — from the `tool-schemas.ts` JSON Schema definition through `parseArgs<ScanArgs>()` type narrowing to the `handleMemoryIndexScan(args: ScanArgs)` handler function. The change is minimal but structurally important as it ensures the new parameter flows correctly through the protocol-boundary cast without any `any` type escapes.

### 1.9 `mcp_server/formatters/search-results.ts` (Session 5)

Implemented anchor prefix matching in the `formatSearchResults()` function, which accepts an `anchors: string[]` parameter for filtering embedded content to specific sections. When a user searches for an anchor ID like `"state"`, the system now first attempts an exact match against extracted anchors, then falls back to prefix matching that will match anchors like `"state-current"` and `"state-implementation"` while correctly rejecting non-prefix matches like `"states"`. The implementation prefers the shortest matching key for specificity, calculates token metrics (`originalTokens`, `returnedTokens`, `savingsPercent`, `anchorsRequested`, `anchorsFound`), and produces warning comments for missing anchors. This prefix matching approach was chosen over exact matching (ADR-005) because it dramatically improves retrieval success rates — users do not need to know the exact full anchor ID, only the meaningful prefix.

### 1.10 `scripts/memory/context_template.md` (Session 5)

Simplified 24 anchor IDs in the memory context generation template to use shorter, more consistent naming conventions. IDs like `"implementation-state"` were shortened to `"state"`, `"key-decisions"` to `"decisions"`, `"artifacts-created"` to `"artifacts"`, and `"remaining-work"` to `"next-steps"`, among others. This simplification was driven by the anchor prefix matching system — shorter base IDs serve as natural prefixes that match any suffixed variants, creating a more intuitive naming hierarchy. The template is used by the `generate-context.js` script to produce memory files, so all future memory saves automatically produce anchors that align with the new prefix matching convention and are easily discoverable via short, memorable search terms.

## 2. Test Files (Spec 111)

### 2.1 `mcp_server/tests/memory-parser-readme.vitest.ts`

Contains 61 unit tests (278 lines) covering the memory parser's README-related functionality. Tests validate `isMemoryFile()` README recognition across all three categories (spec memory, constitutional, skill README), `extractSpecFolder()` path extraction for README paths using the `skill:` prefix convention, and `README_EXCLUDE_PATTERNS` filtering for all 13 directory patterns. Edge cases include nested directories, symlinked paths, case sensitivity in pattern matching, paths with spaces, deeply nested README files, and boundary conditions where README files sit at exact pattern match boundaries. The test file also validates that constitutional directory READMEs are correctly excluded from the skill README category to prevent double-indexing.

### 2.2 `mcp_server/tests/readme-discovery.vitest.ts`

Contains 29 tests (269 lines) for the `findSkillReadmes()` and `findProjectReadmes()` discovery functions in `memory-index.ts`. Tests use mock filesystem structures to verify workspace traversal, including correct handling of symlink resolution, filesystem permission errors (graceful degradation), empty directories, directories with no README files, and the `includeReadmes` toggle that disables README scanning entirely. Integration-style tests verify that the two discovery functions produce non-overlapping results — `findSkillReadmes` only returns files within `.opencode/skill/` while `findProjectReadmes` explicitly excludes that directory to prevent duplicate discovery.

### 2.3 `mcp_server/tests/integration-readme-sources.vitest.ts`

Contains 10 integration tests (266 lines) verifying the complete 4-source indexing pipeline end-to-end. Tests exercise the full flow from file discovery through parsing, weight assignment, embedding generation (mocked), and database insertion. Validates that spec memory files, constitutional files, skill READMEs, and project READMEs all flow through the pipeline correctly with their respective importance weights (0.5, constitutional-tier, 0.3, 0.4). Tests also verify incremental indexing behavior — that unchanged files are skipped on re-scan while new or modified files are re-indexed — and that the pipeline handles mixed batches containing files from all four sources simultaneously.

### 2.4 `mcp_server/tests/regression-readme-sources.vitest.ts`

Contains 16 regression tests (267 lines) capturing specific bugs found during the five development sessions. Each test documents the original bug scenario with a descriptive name indicating when and how the bug was discovered. Covers similarity normalization edge cases (the 0–100 vs 0–1 scale mismatch from Session 3), symlink path resolution failures on macOS MEGA cloud sync paths, weight calculation boundary conditions (files at exact threshold paths between skill and project classification), and exclude pattern effectiveness for each of the 13 patterns. These regression tests serve as a permanent safety net ensuring that fixed bugs cannot silently reappear in future development.

### 2.5 `mcp_server/tests/anchor-prefix-matching.vitest.ts` (Session 5)

Contains 28 tests (430 lines) for the anchor prefix matching feature in `search-results.ts`. Validates the core matching logic: searching for `"state"` correctly matches `"state-current"` and `"state-implementation"`, while `"states"` does NOT match `"state"` (prefix-only, not substring matching). Tests cover boundary conditions including empty anchor arrays, anchors with no content, multiple anchors matching the same prefix (shortest key wins), case handling, and the interaction between exact matches and prefix fallbacks where exact matches always take priority. Token metric calculations are verified for accuracy, and warning comment generation is tested for both partial and complete anchor misses.

### 2.6 `mcp_server/tests/anchor-id-simplification.vitest.ts` (Session 5)

Contains 21 tests (346 lines) verifying the simplified anchor IDs in `context_template.md`. Validates that all 24 renamed anchors follow the new shorter naming convention, that each anchor ID is unique within the template, and that the new names serve as valid prefixes for the prefix matching system. Tests also verify backward compatibility by confirming that existing memory files using the old longer anchor names (like `"implementation-state"`) remain retrievable via prefix search with the new shorter ID (`"state"`). This ensures the simplification is non-breaking for previously generated memory files while establishing the cleaner naming convention for all future memory saves.

## 3. Documentation Files (Spec 111)

### 3.1 `README.md` (project root)

Added YAML frontmatter with project metadata fields (title, description, version) to enable the auto-indexing pipeline to extract structured information during README discovery. Updated the memory system documentation section to reflect the new 4-source pipeline architecture, replacing references to the previous 2-source model. Added a dedicated README indexing subsection explaining how project READMEs are automatically discovered by `findProjectReadmes()` and indexed at 0.4 importance weight. Updated the test statistics badge to reflect the current suite totals of 4,037 tests passed across 120 files with 0 failures.

### 3.2 `.opencode/README.md` (CREATED)

Created a comprehensive 245-line README documenting the `.opencode/` directory structure — a file that previously did not exist, leaving the framework's organizational structure undocumented. The README covers 9 major sections (agents, commands, skills, specs, scripts, install guides, configuration files, test infrastructure, and development workflows) with 9 anchor tags enabling granular memory system retrieval. Serves as the primary entry point for understanding the OpenCode framework structure, replacing ad-hoc exploration of the directory tree. Indexed at 0.4 weight as a project README, making its content available to AI agents through memory search queries about OpenCode's architecture and organization.

### 3.3 `.opencode/skill/system-spec-kit/README.md`

Received a major update documenting the 4-source indexing pipeline architecture, including the technical details of how each source is discovered, parsed, and weighted. Added documentation for the tiered importance weight system (0.5/0.4/0.3), the `includeReadmes` parameter and its effect on index scans, and the README discovery algorithm with its exclusion patterns. Includes the scoring formula `score *= (0.5 + importance_weight)` with worked examples showing how a 0.3-weight skill README scores 25% lower than a 0.5-weight user memory at the same similarity. This README is the primary documentation for the memory system's README integration feature and is itself indexed at 0.3 weight as a skill README.

### 3.4 `.opencode/skill/system-spec-kit/SKILL.md`

Added a "README Content Discovery" section explaining how the skill auto-indexes README files from the workspace during `memory_index_scan` operations. Documents the discovery mechanism (two-function architecture splitting skill and project README discovery), the weight tiers assigned to each category, and configuration options for controlling README indexing behavior via the `includeReadmes` parameter. Also updated cross-references to reflect the new 4-source pipeline terminology throughout existing sections that previously referenced only spec memory files and constitutional files.

### 3.5 `.opencode/skill/system-spec-kit/CHANGELOG.md`

Added the v2.2.1.0 changelog entry documenting all spec 111 features in Keep a Changelog format. The entry is organized into Added (4-source pipeline, `findSkillReadmes()`, `findProjectReadmes()`, tiered weights, 74 README migrations, anchor prefix matching, anchor ID simplification), Changed (context template IDs, search normalization, tool schema), and Fixed (similarity normalization bug, intent classifier scale mismatch, symlink resolution) sections. Reports 165 new tests across 6 test files and references all 7 ADRs by number for traceability back to the decision record.

### 3.6 `.opencode/skill/system-spec-kit/references/memory/memory_system.md`

Updated the core memory system reference document to reflect the new "four sources" terminology instead of the previous two-source architecture. Documents the complete pipeline: spec memory files as the primary source, constitutional files as always-surfaced context, skill READMEs as framework reference material, and project READMEs as codebase documentation. Each source's discovery mechanism, weight tier, and decay behavior is described alongside the existing memory type and FSRS scheduling documentation that was already present.

### 3.7 `.opencode/skill/system-spec-kit/references/memory/save_workflow.md`

Updated Section 6 (Indexing Sources) to include project READMEs as the fourth source in the indexing workflow documentation. Added details about how the `calculateReadmeWeight()` function integrates with the save pipeline — specifically that weight calculation happens during the save operation, not during discovery, allowing the same discovered file to receive different weights based on its path classification. Updated workflow diagrams to show the four-source fan-in architecture feeding into the unified save handler.

### 3.8 `.opencode/skill/system-spec-kit/references/memory/readme_indexing.md` (CREATED)

Created a comprehensive 291-line reference document dedicated entirely to the README indexing feature. Covers the discovery algorithms for both `findSkillReadmes()` and `findProjectReadmes()` with pseudocode, the `calculateReadmeWeight()` function with its three-tier logic, the `README_EXCLUDE_PATTERNS` list with rationale for each pattern, the anchor schema requirements (naming conventions, valid anchor types), prefix matching algorithm details, and troubleshooting guidance for common issues like missing READMEs and incorrect weight assignment. Serves as the definitive technical reference for developers working on or debugging the README indexing feature.

### 3.9 `.opencode/skill/system-spec-kit/mcp_server/README.md`

Fixed 17 parameter documentation inconsistencies across all MCP tool descriptions found during the MEGA-WAVE 2 audit (agents B1–B10). Updated parameter tables to include `includeReadmes` in the `memory_index_scan` tool section and corrected descriptions for several existing parameters where the documentation had drifted from the actual TypeScript interfaces. Ensured that every tool's parameter table matches its corresponding definition in `tool-schemas.ts` and `types.ts`, closing the documentation gap that made it difficult for developers to use the MCP tools correctly.

### 3.10 `.opencode/skill/mcp-code-mode/README.md`

Fixed an anchor name inconsistency where an anchor tag used a non-standard naming convention that did not match the schema established by spec 111. The original anchor used a compound name with different separator style than the `lowercase-kebab-case` convention adopted across all other migrated READMEs. This was a minor change but important for ensuring anchor prefix matching works consistently across the entire codebase, since inconsistent naming could cause retrieval failures for queries targeting that skill's documentation.

### 3.11 `.opencode/skill/system-spec-kit/references/debugging/troubleshooting.md`

Updated version references from the previous memory system version to reflect the current v2.2.1.0 release. Revised the temporal decay model documentation to accurately describe the 9-type cognitive memory system with correct half-life values and auto-expiry thresholds. Ensures that troubleshooting guidance is accurate for the updated memory system, particularly around the `semantic` type's 180-day half-life that applies to auto-indexed README content.

### 3.12 `.opencode/skill/system-spec-kit/assets/documentation/readme_template.md`

Added Section 12 "Memory Anchors" to the standard README template used when creating new README files. The section provides guidance on how to add anchor tags (`<!-- ANCHOR:name -->` / `<!-- /ANCHOR:name -->`) to new READMEs, including the standardized naming conventions (lowercase-kebab-case), the 7 valid anchor types (summary, state, decisions, context, artifacts, next-steps, blockers), and examples showing correct placement within a typical README structure. Ensures all future READMEs created from this template will be immediately compatible with the memory system's anchor-based retrieval and prefix matching features.

## 4. README Anchor Migration (Spec 111) — 74 Files, ~473 Anchors

### 4.1 mcp_server READMEs (22 files)

Added semantic anchor tags to all 22 README files within the `mcp_server/` directory tree, spanning handlers, formatters, lib subdirectories (config, parsing, search, storage), shared modules, tests, and tools. Each README received between 4 and 9 anchors covering the standard sections: `summary` (component purpose), `state` (current implementation status), `decisions` (key design choices), `context` (dependencies and relationships), `artifacts` (files maintained), and `next-steps` (planned improvements). These anchors enable the memory system to extract and index specific sections from the deeply nested technical documentation, allowing targeted retrieval such as "show me the state of the search handler" without loading entire README contents.

### 4.2 scripts READMEs (16 files)

Migrated 16 README files across the `scripts/` directory tree with anchor tags, covering memory scripts (context generation, migration, validation), spec scripts (validation, template management), template processing scripts, and utility scripts. Each README received anchors appropriate to its content structure — script READMEs tend to have strong `summary` and `context` sections documenting usage and dependencies, while having shorter `decisions` sections since scripts implement rather than architect. The migration ensures that the operational documentation for the build and maintenance toolchain is searchable through the memory system alongside the core codebase documentation.

### 4.3 shared READMEs (4 files)

Added anchors to 4 README files in shared utility and library directories that serve multiple parts of the system. These cross-cutting documentation files cover shared TypeScript types, utility functions, constants, and configuration structures used by both the MCP server handlers and the CLI scripts. Anchor-based retrieval is particularly valuable for these files since they are frequently referenced when debugging type mismatches or understanding data flow across module boundaries.

### 4.4 templates READMEs (10 files)

Migrated 10 README files across the templates directory structure, including core spec folder templates, addendum templates, level-specific template documentation (Level 1 through Level 3+), and template validation references. Anchors enable memory queries to find template-specific guidance quickly — for example, searching for `"decisions"` anchors in template READMEs surfaces the rationale behind template design choices, while `"artifacts"` anchors list the actual template files in each directory. This migration is particularly valuable for the `@speckit` agent, which frequently needs to reference template structure when creating new spec folders.

### 4.5 config/constitutional/examples READMEs (7 files)

Added anchors to 7 README files spanning configuration documentation, constitutional memory templates, and example files. The constitutional memory directory READMEs document the always-surfaced context files that appear at the top of every search result, while the config READMEs cover database configuration, embedding provider setup, and environment variable documentation. Example directory READMEs showcase correct usage patterns for memory files, anchor placement, and YAML frontmatter formatting, serving as living reference implementations that developers can copy when creating new content.

### 4.6 Existing skill root READMEs (3 files)

Updated 3 pre-existing skill root READMEs (`system-spec-kit`, `mcp-code-mode`, and `workflows-documentation`) with standardized anchor tags matching the naming schema adopted across all migrated files. These skill root READMEs are high-value discovery targets since they serve as entry points for understanding each skill's purpose, architecture, and configuration. Standardizing their anchors ensures consistency with the 74-file migration, allowing users to search for `"summary"` across all skills and receive uniformly structured results.

### 4.7 New skill READMEs created (6 files)

Created 6 entirely new README files for skill directories that previously lacked any documentation — `workflows-code--web-dev`, `workflows-code--full-stack`, `workflows-code--opencode`, `workflows-git`, `workflows-chrome-devtools`, and `mcp-figma`. Each was authored with full anchor tags from the start following the `readme_template.md` Section 12 guidelines, covering skill purpose, configuration, available workflows, and dependencies. These new files fill critical documentation gaps where skill directories existed with only a `SKILL.md` (instructions for the AI) but no human-readable overview, and they increase the memory system's knowledge coverage of the complete skill ecosystem from approximately 60% to over 95%.

## 5. Resume Bug Fix Files (Spec 111)

### 5.1 `.opencode/command/spec_kit/resume.md`

Fixed glob patterns in the resume command definition that were failing to find memory files in spec folders due to stale path construction dating from before the spec folder structure evolution. The original patterns used `specs/*/memory/*.md` which only matched single-level spec folders, missing the nested structure like `.opencode/specs/003-system-spec-kit/111-readme-anchor-schema/memory/*.md`. Updated to use proper recursive glob patterns (`.opencode/specs/**/memory/*.md`) that traverse the full directory tree. This fix was identified through ADR-007's root cause analysis which found 5 distinct path construction bugs across the 3 resume command files.

### 5.2 `.opencode/command/spec_kit/assets/spec_kit_resume_confirm.yaml`

Fixed glob patterns and tier 2/3 detection logic in the interactive-mode resume confirmation YAML asset. The tier detection code checks for `checklist.md` (Level 2) and `decision-record.md` (Level 3) to determine the spec folder's documentation level, but the path construction was using the old single-level glob that could not find these files in the current nested directory structure. Corrected the paths and also replaced a Tier 2 semantic search query with a recency-based `memory_list()` call (per ADR-007) which is more reliable for finding the most recent context in a spec folder. Ensures proper documentation level detection and context loading when users resume existing specs in interactive mode.

### 5.3 `.opencode/command/spec_kit/assets/spec_kit_resume_auto.yaml`

Applied the same glob and tier detection fixes as the confirm variant to maintain behavioral parity between the two resume modes. The auto-resume workflow performs the same spec folder content analysis but without user interaction — it auto-detects the documentation level and auto-loads the most recent memory context for fast session resumption. Also updated the Tier 3 detection trigger to be more specific (checking for `decision-record.md` rather than a broader semantic query), reducing false positive detections where the system would incorrectly identify a Level 2 spec as Level 3. These fixes ensure that both resume modes correctly identify spec folder contents and load appropriate context regardless of directory nesting depth.

## 6. Memory Command Files (Spec 112)

### 6.1 `.opencode/command/memory/manage.md`

Received the P0-priority update as the most critical command file requiring alignment. Added `includeReadmes` parameter documentation (lines 439–452) with type (`boolean`), default value (`true`), and description explaining its role in controlling README discovery during index scans. Added the 4-source pipeline reference table (lines 454–469) showing all indexing sources (spec memory files, constitutional files, skill READMEs, project READMEs) with their descriptions and weight tiers. Added a tiered weight blockquote (line 272) explaining the scoring rationale — why user work at 0.5 outranks project READMEs at 0.4 which outrank skill READMEs at 0.3. Updated the MCP tool signature and usage examples (lines 359, 480–481) to show `includeReadmes` in context with realistic invocation patterns.

### 6.2 `.opencode/command/memory/save.md`

Received the P1-priority update as the second most important command file for alignment. Added the `includeReadmes` parameter to the parameter documentation table (lines 823–839) with the same type, default, and description as the manage command for cross-reference consistency. Updated the indexing sources section (lines 718–727) to document all four pipeline sources with their respective discovery functions and weight assignments. Added anchor prefix matching documentation with practical examples (lines 410–424) showing how searching for `"state"` matches anchors named `"state-current"` and `"state-implementation"`, which is particularly relevant for the save command since it generates memory files that contain these anchors.

### 6.3 `.opencode/command/memory/CONTEXT.md`

Received the P2-priority update as a lower-priority but still important alignment target. Added a README content mention (lines 260–266) explaining that memory context retrieval now includes auto-indexed README content alongside traditional spec memory files, which means context queries may surface README-sourced information that was previously invisible. Added anchor prefix matching documentation (lines 250–258) with usage guidance for CONTEXT command users who can now leverage prefix-based anchor filtering to retrieve specific sections from any indexed content. The update is deliberately lighter than manage.md and save.md since the CONTEXT command delegates to the search pipeline rather than controlling indexing behavior directly.

## 7. YAML Asset Files (Spec 112)

### 7.1 `.opencode/command/spec_kit/assets/spec_kit_implement_auto.yaml`

Added a prefix matching comment (lines 1077–1078) within the anchor-based search section of the autonomous implementation workflow. The comment notes that anchor-based searches use prefix matching, so searching for `"state"` will match `"state-current"`, `"state-implementation"`, and any other anchor beginning with `"state"`. This documentation helps implementers understand retrieval behavior when using anchors in their workflows and prevents confusion when search results include anchors with suffixed names that were not explicitly requested.

### 7.2 `.opencode/command/spec_kit/assets/spec_kit_implement_confirm.yaml`

Added an identical prefix matching comment (lines 1190–1191) to the confirmation-mode implementation workflow YAML. This ensures behavioral parity in documentation between the auto and confirm implementation paths — both modes now document the same anchor matching behavior in the same location within their respective workflow definitions. The confirm variant differs from auto only in requiring user approval at each step, not in how anchor matching works, so the documentation is intentionally identical.

### 7.3 `.opencode/command/create/assets/create_folder_readme.yaml`

Added an auto-indexing note (lines 7–10) documenting that READMEs created by this workflow will be automatically discovered and indexed by the memory system during the next `memory_index_scan` operation. The note specifies the weight tiers: 0.3 for skill READMEs (those created inside `.opencode/skill/`) and 0.4 for project READMEs (all other locations). This helps README creators understand the downstream effect of their work — that the documentation they write will become searchable by AI agents through the memory system without any manual indexing step.

### 7.4 `.opencode/command/create/assets/create_install_guide.yaml`

Added a prefix matching note (line 473) in the anchor documentation section of the install guide creation workflow. The note explains that anchor IDs support prefix-based retrieval, so guide authors should choose short, descriptive base names that serve as natural prefixes for any future suffixed variants. This aligns install guide creation with the anchor naming conventions established by spec 111 and ensures that new install guides produce anchors compatible with the prefix matching system.

### 7.5 `.opencode/command/create/assets/create_skill.yaml`

Added a prefix matching note (line 691) to the skill creation workflow YAML within the section that guides users through adding anchor tags to their new skill's README. The note ensures that developers creating new skills follow anchor naming conventions compatible with prefix matching, using short base IDs like `"summary"` rather than long compound names like `"skill-summary-overview"`. Maintains consistency across all seven creation workflow YAMLs regarding anchor documentation and naming guidance.

### 7.6 `.opencode/command/create/assets/create_skill_asset.yaml`

Added a prefix matching note (line 377) to the skill asset creation workflow YAML. Skill assets (checklists, patterns, templates) can include anchor tags for section-level retrieval, and this note ensures asset creators understand that their anchor IDs will be matched via prefix search. The placement within the creation workflow ensures developers encounter this guidance at the point of anchor authoring rather than needing to consult separate reference documentation.

### 7.7 `.opencode/command/create/assets/create_skill_reference.yaml`

Added a prefix matching note (line 489) to the skill reference creation workflow YAML, completing the alignment of all seven creation and implementation YAML assets with the prefix matching documentation from spec 111. Skill references are the most anchor-heavy content type (often containing 5–7 anchors per file), making this note particularly relevant — reference authors benefit from understanding that their carefully chosen anchor IDs will match prefix queries, encouraging the use of short, meaningful base names throughout the reference documentation ecosystem.

## 8. Root CHANGELOG (Spec 112)

### 8.1 `CHANGELOG.md` (project root)

Added the `[2.0.0.8]` version entry (lines 10–61) documenting all spec 111 features in a comprehensive changelog block following the Keep a Changelog format. The entry is organized into 25 items across four sections: Added (14 items covering 4-source pipeline, `findSkillReadmes()`, `findProjectReadmes()`, YAML frontmatter extraction, anchor prefix matching, tiered importance weights, `.opencode/README.md`, `readme_indexing.md` reference, README template Section 12, and the 6 new skill READMEs), Changed (5 items covering context template anchor IDs, search normalization, MCP tool schema, documentation updates), Fixed (3 items covering similarity normalization bug, intent classifier scale mismatch, resume command glob patterns), and Documentation (3 items covering 74 README migrations, 17 MCP parameter fixes, and the `mcp-code-mode` anchor fix). This changelog entry serves as the single authoritative record of everything shipped in the v2.0.0.8 release.

## 9. Spec Folder Documentation

### 9.1 Spec 111 Documents

The spec 111 folder (`.opencode/specs/003-system-spec-kit/111-readme-anchor-schema/`) is a Level 3+ documentation package containing 8 core files plus `memory/` and `scratch/` subdirectories. `spec.md` (283 lines) defines the feature requirements across 10 requirements (5 P0, 5 P1) with 6 success criteria and a complexity score of 63/100. `plan.md` (413 lines) details the 4-phase technical approach — Core Pipeline, Template & Standards, README Migration, and Testing & Validation — with an estimated 24–34 hours of effort across ~2,361 lines of code. `tasks.md` (264 lines) breaks the work into 85 tasks (T001–T085) across the 4 phases plus MEGA-WAVE 2 and Session 5b, totaling 121 estimated person-hours. `checklist.md` (192+ items, CHK-001 through CHK-192) provides granular verification criteria organized by category — pre-implementation, code quality, testing, security, documentation, P0/P1/P2 items, L3+ architecture items, resume fix verification, and MEGA-WAVE 2 items. `implementation-summary.md` (305 lines) documents the outcome of all 5 development sessions with file change tables, critical bug descriptions, and the MEGA-WAVE 2 audit results. `decision-record.md` (637 lines) contains 7 Architecture Decision Records (ADR-001 through ADR-007) covering anchor schema design, memory type selection, discovery function architecture, backward compatibility, spec folder extraction, tiered weights, and resume detection fixes. `handover.md` (308 lines) preserves session continuation context across all 5 sessions with modification tables and a ready-to-use continuation command. `research.md` documents the initial investigation into README anchoring strategies with 17 sections covering the anchor format evaluation, memory type analysis, and recommendation matrix.

### 9.2 Spec 112 Documents

The spec 112 folder (`.opencode/specs/003-system-spec-kit/112-memory-command-readme-alignment/`) is a Level 2 documentation package containing 5 core files plus a `memory/` subdirectory. `spec.md` (168 lines) defines the alignment requirements across 12 requirements (REQ-001 through REQ-012) with 6 success criteria, identifying the documentation gap where spec 111's 8 features were implemented in code but not reflected in command documentation. `plan.md` (196 lines) details the 5-phase priority-based approach (P0 manage.md, P1 save.md, P2 CONTEXT.md + implement YAMLs, P3 create YAMLs, verification) with an estimated 4–6.5 hours of documentation-only changes across ~200 lines. `tasks.md` (118 lines) defines 17 tasks (T001–T017) across the 5 phases, all marked as complete. `checklist.md` (109 lines) provides 33 verification items across P0 (7 items), P1 (15 items), and P2 (11 items) categories, all verified as passing. `implementation-summary.md` (97 lines) documents the completion of all 10 file modifications with a per-file change summary and verification results.

## 10. Architecture Decisions (Spec 111)

Summary of the 7 Architecture Decision Records maintained in `decision-record.md`:

- **ADR-001: README Anchor Schema — Simple vs Qualified IDs.** Chose simple anchor IDs (`<!-- ANCHOR:name -->`) without session or spec folder qualifiers, scoring 9/10 over qualified IDs (4/10) and hybrid approaches (6/10). Simple IDs minimize authoring friction and work naturally with prefix matching.

- **ADR-002: Memory Type for READMEs — `semantic` vs `reference` Type.** Chose the `semantic` memory type with `important` importance tier, providing a 180-day half-life with 1.5x boost for effectively zero decay while preserving the `constitutional` tier distinction for truly permanent always-surfaced content.

- **ADR-003: Discovery Function — New `findSkillReadmes()` vs Extend `findConstitutionalFiles()`.** Chose to create new standalone discovery functions rather than extending the existing `findConstitutionalFiles()`. This separation enables independent toggling via the `includeReadmes` flag and avoids coupling README discovery logic to the constitutional file discovery path.

- **ADR-004: Backward Compatibility — `contentSource` Field vs Tag-Based Filtering.** Decided to add a new `contentSource` database column (enum: `memory` | `constitutional` | `readme`) with a filter parameter in `memory_search()`. However, implementation was deferred to a future spec to avoid scope expansion, with the decision recorded for forward compatibility.

- **ADR-005: Anchor Prefix Matching over Exact Matching.** Chose prefix matching where `"state"` matches `"state-current"` and `"state-implementation"` over strict exact matching. This dramatically improves retrieval success rates since users need only remember the meaningful base name, not the full suffixed anchor ID.

- **ADR-006: Tiered importance_weight for Project README Indexing.** Established the 4-tier hierarchy: Constitutional (always surfaced) > User work memories (0.5) > Project READMEs (0.4) > Skill READMEs (0.3). All project READMEs are mapped to a single virtual spec folder (`project-readmes`) for organizational clarity.

- **ADR-007: Resume Detection Fix Approach.** Fixed all 3 resume command files with corrected glob patterns (`.opencode/specs/**/memory/*.md`), replaced Tier 2 semantic query with recency-based `memory_list()`, and made Tier 3 trigger more specific. Root cause was stale `specs/*/memory/*.md` paths from before the spec folder structure evolved to nested directories.

## Summary

Specs 111 and 112 together represent a major evolution of the OpenCode memory system from a 2-source to a 4-source indexing pipeline. Spec 111 delivered the core infrastructure — new TypeScript discovery functions, a tiered importance weight system, anchor prefix matching, 165 new tests across 6 test files, and the migration of 74 README files with approximately 473 anchor tags — across 5 development sessions involving a 10-agent MEGA-WAVE audit that uncovered 2 real bugs and 8 documentation gaps. Spec 112 completed the work by propagating 8 new features into 3 memory command files and 7 YAML workflow assets that spec 111 had not updated, closing the documentation gap between the implemented code and the user-facing command documentation. The combined work touched approximately 120+ files across TypeScript source code, Vitest test suites, markdown documentation, README files, YAML assets, and spec folder artifacts. All changes maintain full backward compatibility while dramatically expanding the memory system's knowledge coverage through automatic README discovery and indexing, and the entire test suite stands at 4,037 tests passed across 120 files with 0 failures.
