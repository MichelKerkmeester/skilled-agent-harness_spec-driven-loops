# Changelog - system-spec-kit

All notable changes to the system-spec-kit skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)

---

## [**2.2.2.3**] - 2026-02-13

**YAML & .md prompt reduction** (Spec 116) compressing **20 files** by 55.4% total — 9,462 lines removed while preserving all routing logic, workflow steps, and asset paths.

---

### Changed

1. **13 YAML prompt assets** — Compressed from 13,333 to 5,378 lines (59.7% reduction) in `command/spec_kit/assets/` using compact YAML flow notation (`{key: value}`, `[a, b]`), removed Mermaid diagrams (never rendered in CLI), decorative separators, verbose description fields
2. **7 .md command files** — Compressed from 3,746 to 2,239 lines (40.2% reduction) in `command/spec_kit/`; all routing logic, workflow steps, and config keys preserved
3. **Combined** — 9,462 lines removed (55.4% total) across 20 files
4. **Validation** — 13/13 YAML files parse valid, all step counts preserved, all asset paths intact

---

## [**2.2.2.2**] - 2026-02-13

**`/create:folder_readme` YAML & command alignment** (Spec 117) reducing `create_folder_readme.yaml` by 20% and fixing broken references in `folder_readme.md`.

---

### Changed

1. **`create_folder_readme.yaml`** — Aligned 4 README types with canonical 9-section structure from `readme_template.md` §13, replaced embedded templates with reference stubs, fixed emoji inconsistencies, added `template_references` cross-references, updated workflow to `sequential_6_step` (765 to 611 lines, -20% reduction)
2. **`folder_readme.md`** — Fixed broken YAML key references in §4 REFERENCE table, aligned DQI target to 75+ (Good), standardized command name to `/create:folder_readme`, added step numbering explanation in §3

---

## [**2.2.2.1**] - 2026-02-13

**README template alignment** (Spec 115) updating `readme_template.md` with 5 evolved patterns and restructuring the root README from 7 to 9 sections.

---

### Changed

1. **`readme_template.md`** — Updated with 5 evolved patterns: badges, architecture diagrams, Before/After, anchor rules, complete template; reduced from 1,589 to 1,058 lines (33.4%) via 10 deduplication strategies, 16 to 14 sections
2. **Root README** — Restructured: 7 to 9 sections, 756 to 971 lines, 10 valid anchor pairs
3. **9 new feature subsections** — Covering CWB, multi-stack, Code Mode, DevTools, Git, Extensibility

---

## [**2.2.2.0**] - 2026-02-13

**README anchor schema & documentation alignment** (Specs 111-114) deploying ~473 anchor tags across 74 READMEs, aligning memory commands, standardizing styles, and optimizing SKILL.md with agent routing fixes.

---

### New

1. **~473 anchor tags** — Added across 74 README.md files using `<!-- anchor:tag-name -->` format, enabling precise memory retrieval via anchor-based content filtering; covers all `.opencode/` skill, command, agent, and infrastructure READMEs (Spec 111)
2. **5 memory command READMEs aligned** — `save`, `learn`, `manage`, `continue`, `context` aligned with documentation standards for consistent structure, section ordering, and content quality (Spec 112)
3. **7 style rules applied** — Applied from `readme_template.md` to 75 active README.md files, standardizing H1 format, badge placement, section ordering, table formatting, link style, frontmatter, dividers (Spec 113)

---

### Changed

1. **SKILL.md** — Reduced from 1,055 to 701 lines (34% reduction) with all features preserved (Spec 114)
2. **12 command files** — Restored to <=600 lines from over-reduced state (64-114 lines) (Spec 114)
3. **Style alignment** — Applied `command_template.md` style to all 12 command files (~160 H2 headings) (Spec 114)

---

### Fixed

1. **4 YAML assets** — `subagent_type: explore` changed to `subagent_type: context` (per AGENTS.md §7) (Spec 114)
2. **5 .md command files** — Added @context and @speckit routing references (Spec 114)
3. **2 YAML assets** — Added @speckit routing for `debug-delegation.md` (Spec 114)
4. **Full compliance** — 19/19 commands properly route per AGENTS.md agent table (Spec 114)

---

## [**2.2.1.0**] - 2026-02-12

**4-source indexing pipeline**, **anchor prefix matching**, and **165 new tests** expanding memory system to index project READMEs alongside spec files, constitutional files, and skill READMEs.

---

### New

1. **4-source indexing pipeline** — Memory system now indexes from spec files, constitutional files, skill READMEs, AND project READMEs (previously only 3 sources)
2. **`findProjectReadmes()`** — New discovery function for project-level README.md files with importance weight 0.4
3. **`includeReadmes` parameter** — Controls README scanning in `memory_index_scan` (default: true)
4. **Tiered importance weights** — User work (0.5/1.0x), Project READMEs (0.4/0.9x), Skill READMEs (0.3/0.8x) with scoring formula `score *= (0.5 + importance_weight)`
5. **Anchor prefix matching** — `anchors: ['summary']` now matches composite IDs like `summary-session-...` with exact-match priority and shortest-prefix fallback
6. **README anchor schema** — 74 READMEs anchored with ~473 anchor tags across the project
7. **YAML frontmatter support** — READMEs can include frontmatter with title, description, trigger_phrases, importance_tier
8. **`.opencode/README.md`** — New directory structure documentation (245 lines, 9 sections)
9. **`readme_indexing.md`** — Comprehensive reference doc for README indexing pipeline (291 lines)
10. **165 new tests** — Across 8 test files covering README parsing, discovery, integration, regression, prefix matching, and anchor ID validation

---

### Changed

1. **`context_template.md`** — Simplified all 24 anchor IDs, removed `{{SESSION_ID}}-{{SPEC_FOLDER}}` suffixes for clean semantic names
2. **`findSkillReadmes()`** — Now handles symlinked READMEs (`entry.isSymbolicLink()`)
3. **`search-results.ts`** — Anchor filtering supports prefix matching with hyphen-boundary enforcement
4. **`memory_system.md`** — Updated from "three sources" to "four sources"
5. **`save_workflow.md`** — Added project READMEs to indexed content documentation
6. **`SKILL.md`** — Expanded README Content Discovery section with `findProjectReadmes()` and weight tiers
7. **`mcp_server/README.md`** — Fixed 17 parameter documentation mismatches (3 phantom removed, 14 undocumented added)
8. **`troubleshooting.md`** — Fixed version v1.7.1 to v1.7.2, documented dual decay model (FSRS day-based + turn-based)
9. **Test statistics** — Updated from 3,872 to 4,037 tests, 114 to 120 test files
10. **7 ADRs documented** — ADR-001 through ADR-007
11. **85 tasks tracked** — T001-T085
12. **192 checklist items** — CHK-001-192
13. **README indexing audit** — 96 READMEs on disk, 93 to 94 indexed (100% coverage after symlink fix)

---

### Fixed

1. **Anchor lookup failure** — `anchors: ['summary']` returned empty when keys were composite IDs; now uses prefix fallback
2. **Anchor ID validation** — Template-generated IDs (80-120 chars with underscores) violated `VALID_ANCHOR_PATTERN`; simplified to short semantic names
3. **Symlink README discovery** — `findSkillReadmes()` missed symlinked READMEs; added `isSymbolicLink()` check
4. **Resume detection bugs** — 5 root causes: wrong base path in glob patterns, insufficient glob depth, wrong semantic query in tier 2, too-generic trigger in tier 3, tier skipping
5. **`mcp-code-mode/README.md`** — Anchor name mismatch (`structure` to `architecture`)
6. **False bug report corrected** — check-anchors.sh awk was incorrectly reported as having a `/` parsing bug; B5 audit confirmed no bug exists

---

## [**2.2.0.3**] - 2026-02-12

**Frontmatter audit** trimming `description` in SKILL.md from ~430 chars to ~220 chars to reduce system prompt token consumption during auto-discovery.

---

### Changed

1. **SKILL.md frontmatter** — Trimmed `description` from ~430 chars to ~220 chars to reduce system prompt token consumption during auto-discovery

---

## [**2.2.0.2**] - 2026-02-11

**Internal README documentation** adding 4 new README files for shared modules and tool dispatch layer.

---

### New

1. **`shared/scoring/README.md`** — Composite folder scoring documentation: formula breakdown, weight tables, 8 function exports, 5 constants, archive multiplier rules, design decision references (D1/D2/D4/D7/D8), constitutional exemption notes
2. **`shared/utils/README.md`** — Shared utility documentation: path-security module (CWE-22/59/78 prevention, 3-step validation pipeline) and retry module (exponential backoff, transient/permanent error classification, HTTP status codes)
3. **`scripts/types/README.md`** — Session type definitions documentation: 16 interfaces across 4 sections (Decision, Phase/Conversation, Diagram, Session), ASCII type architecture diagram, `SessionData` root type with 35+ fields, P6-05 tech-debt migration notes
4. **`mcp_server/tools/README.md`** — Tool dispatch layer documentation: 22 MCP tools across 5 domains (L1-L7), dispatcher architecture with ASCII flow diagram, `parseArgs<T>()` utility, tool extension guide

---

### Changed

1. **`mcp_server/tests/README.md`** — Added emoji prefixes to all 37 section headers (8 H2 + 29 H3/H4) to match project README styling conventions

---

## [**2.2.0.1**] - 2026-02-11

**Pre-release audit fixes** correcting broken reference paths, stale file listings, and genericized domain references.

---

### Fixed

1. **`constitutional/README.md`** — 2 broken reference paths fixed (`save_workflow.md` and `trigger_config.md` to correct paths)
2. **`constitutional/README.md`** — Stale file listing updated, added `speckit-exclusivity.md`
3. **`README.md`** — Script count corrected `244` to `90`, LOC corrected `~1075` to `~1350`
4. **`references/structure/folder_routing.md`** — Genericized `anobel.com` domain reference
5. **`CHANGELOG.md`** — Genericized 1 `anobel.com` reference

---

## [**2.2.0.0**] - 2026-02-11

**TypeScript conversion completion & documentation accuracy** (Specs 104-107) achieving 0 `tsc` errors, 3,872 tests passing across 114 test files, 303 documentation fixes, and removal of 39 `mcp-narsil` ghost references.

---

### Changed

**Spec 104: TypeScript Conversion Phase 1**

1. **TypeScript conversion** — Continued conversion of remaining source files in `mcp_server/`; converted handler files, library modules, and utility code to strict TypeScript with type annotations across all modules

**Spec 105: TypeScript Cleanup**

2. **0 `tsc` errors** — Achieved across entire codebase
3. **3,872 tests passing** — Across 114 test files (71 skipped, 4 test files skipped)
4. **0 JavaScript source files** — Remaining in `mcp_server/` (all converted to TypeScript)
5. **0 `@ts-nocheck`** — Directives in source files; total: 204 TypeScript files, 86 source + 118 test files, ~68,000 LOC

**Spec 106: Documentation Accuracy Audit**

6. **20-agent parallel audit** — Across all READMEs and reference docs; ~120 critical accuracy issues identified (stale counts, wrong file references, outdated descriptions)

**Spec 107: Documentation Accuracy Fixes**

7. **303 fixes applied** — Across all READMEs and documentation files
8. **39 `mcp-narsil` ghost references** — Removed from skill documents (`workflows-code--opencode/SKILL.md`, `workflows-code--full-stack/SKILL.md`, `mcp-code-mode/INSTALL_GUIDE.md`)
9. **Stale counts corrected** — Install guides: skills 7 to 9, agents 2 to 8, commands 16 to 19; test counts 700+ to 3,872; template LOC counts corrected across SKILL.md and README.md
10. **Version number** — Updated from 1.2.4.0 to 2.2.0.0

---

### Fixed

1. **SKILL.md version** — Stuck at 1.2.4.0 (now 2.2.0.0)
2. **README.md test count** — 700+ to 3,872 tests, 91 to 114 test files
3. **README.md template LOC counts** — ~50% understated (now aligned with SKILL.md)
4. **CHANGELOG.md** — Missing entries for specs 104-107

---

## [**2.1.9.0**] - 2026-02-10

**Final audit post-TypeScript** (Spec 103) resolving 81 issues found by ~40 parallel agents, removing `@ts-nocheck` from 96 test files (~1,100 type errors fixed).

---

### Fixed

1. **81 issues resolved** — Found and fixed by ~40 parallel agents
2. **`@ts-nocheck` removed** — From 96 test files (~1,100 type errors fixed)
3. **Vitest configuration** — Validated across all test suites
4. **Final quality audit** — Comprehensive audit of the full TypeScript codebase

---

## [**2.1.8.0**] - 2026-02-10

**MCP cleanup & alignment** (Spec 102) resolving all 36 findings from the spec 101 misalignment audit, removing 5 obsolete commands, and achieving code-documentation alignment.

---

### Fixed

1. **36 findings resolved** — All findings from spec 101 misalignment audit
2. **6 command files updated** — With `memory_context` integration and standardized quality gates (`spec_kit/{research,plan,resume,implement,complete,handover}.md`)
3. **2 pre-existing test failures** — Fixed
4. **ADR-008** — Written documenting alignment decisions
5. **Code-documentation alignment** — Achieved

---

### Removed

1. **5 obsolete commands** — `search/code.md`, `search/index.md`, `memory/{checkpoint,database,search}.md`

---

## [**2.1.7.0**] - 2026-02-10

**Misalignment audit** (Spec 101) identifying 36 findings across 5 dimensions in a read-only audit with cross-component analysis and prioritized fix matrix.

---

### Changed

1. **36 findings identified** — Across 5 dimensions (read-only audit)
2. **Cross-component analysis** — SKILL.md vs Commands vs MCP Schemas vs Agent definitions
3. **Prioritized fix matrix** — Created for remediation planning
4. **Gap catalog** — Gaps between code and documentation cataloged
5. **No code changes** — Audit and planning only

---

## [**2.1.6.0**] - 2026-02-10

**Test coverage** (Spec 100) adding 1,589 new tests across 26 files, achieving 100% module export coverage with 48 security tests for FTS5 SQL injection prevention.

---

### New

1. **1,589 new tests** — Across 26 files
2. **100% module export coverage** — Achieved
3. **48 security tests** — For FTS5 SQL injection prevention
4. **Comprehensive test infrastructure** — Established

---

## [**2.1.5.0**] - 2026-02-10

**Memory cleanup** (Spec 099) re-indexing the database from 85 to 261 memories, reducing unsafe type casts, and adding 75 new tests.

---

### Changed

1. **Database re-indexed** — 85 to 261 memories
2. **Unsafe type casts reduced** — 48 to 3
3. **75 new tests** — Added
4. **Deprecated types** — Preserved for backward compatibility

---

## [**2.1.4.0**] - 2026-02-10

**Feature/bug/documentation audit** (Spec 098) fixing 10 P0 + 18 P1 issues, restoring 12 non-functional features, and improving documentation-code alignment from 67.9% to 95.5%.

---

### Fixed

1. **10 P0 + 18 P1 issues** — Fixed
2. **12 non-functional features** — Restored to working state
3. **Documentation-code alignment** — Improved from 67.9% to 95.5%
4. **Comprehensive feature audit** — Across entire MCP server

---

## [**2.1.3.0**] - 2026-02-09

**Memory save auto-detect** (Spec 097) adding auto-detection of spec folder from Gate 3 conversation context with a 5-priority detection cascade.

---

### New

1. **Auto-detect spec folder** — From Gate 3 conversation context
2. **5-priority detection cascade** — Explicit path, Gate 3, recent spec, cwd, ask user
3. **Minimal change** — Only 2 files modified
4. **Streamlined workflow** — Memory save workflow simplified

---

## [**2.1.2.1**] - 2026-02-09

**Spec Kit Memory bug audit** (Spec 096) — most comprehensive bug-fix release in project history with **85+ bugs fixed** and **27 new regression tests**.

---

### Fixed

**Critical Severity (8 bugs)**

1. **FSRS formula: 18.45x decay rate error** — Corrected; memories were decaying at the wrong rate due to incorrect factor calculation
2. **macOS crash bug** — In SQLite operations; platform-specific crash during concurrent database access
3. **Database no-op operations** — Writes that silently did nothing, causing data loss without errors

**Overall**

4. **85+ bugs fixed** — Total across all severity levels
5. **27 new tests** — Added for regression coverage
6. **All critical paths** — Verified post-fix

---

## [**2.1.2.0**] - 2026-02-09

**Code audit remediation** (Spec 095) remediating all P0/P1 coding standard violations across 12 task categories and fully rebuilding the `dist/` directory.

---

### Fixed

1. **All P0/P1 violations** — Remediated across 12 task categories
2. **`dist/` directory** — Fully rebuilt to match TypeScript source

---

## [**2.1.1.0**] - 2026-02-09

**20-agent parallel code review** (Spec 094) finding and fixing 5 P0 (critical) and 14 P1 (high) bugs across MCP server with a weighted code quality score of 68/100.

---

### Fixed

1. **5 P0 (critical) bugs** — Found and fixed across MCP server
2. **14 P1 (high) bugs** — Found and fixed
3. **Weighted code quality score** — 68/100

---

## [**2.1.0.0**] - 2026-02-09

**Memory index deep audit & fix** (Spec 093, Sessions 7-11) correcting the **critical FSRS formula** (factor from `19.0` to `19/81`), adding token budget observability, and removing 214 lines of dead code from vector-index.ts.

---

### New

1. **Token budget observability** — `tokenBudget` field in response metadata for all handler responses
2. **`console.error` logging** — When token budgets exceeded
3. **Hint injection** — In responses when budget thresholds are hit

---

### Changed

1. **Test suite** — 46/60 to 58/58 (100% pass rate); 2 orphan test files removed
2. **vector-index.ts** — 705 to 491 lines (214 lines dead code removed)
3. **12+ READMEs** — Rewritten across MCP server subdirectories
4. **search-weights.json** — Cleaned dead parameters and regex patterns

---

### Fixed

1. **CRITICAL: FSRS formula corrected** — Factor changed from `19.0` to `19/81` (approx 0.2346), formula from `R = (1 + t/(FACTOR*S))^(-0.5)` to `R = (1 + FACTOR*t/S)^(-0.5)`; memories were decaying ~4.5x slower than FSRS v4 standard; now R(S,S) = 0.9 as specified
2. **`clearConstitutionalCache` bug** — In vector-index.ts; was calling wrong internal method
3. **3 broken delegations** — In vector-index facade
4. **Integration test paths** — Bug-fix tests, preflight tests
5. **`safeParseJson` security alignment** — Across modules
6. **5 test failures** — confidence-tracker, handler-memory-search, memory-context, tier-classifier, tool-cache

---

### Removed

1. **Orphan `dist/core.js`** — Was shadowing `dist/core/` directory
2. **9 orphaned files** — 7 dist `.js` + 2 test files
3. **3 fabricated sections** — In `references/memory/memory_system.md` (decay formula, computeFingerprint(), 5-state model)

---

## [**2.0.0.0**] - 2026-02-07

**JavaScript to TypeScript migration** (Spec 092) converting the full codebase across `shared/`, `mcp_server/`, and `scripts/` to TypeScript. Compiled CommonJS output preserves backward compatibility — all runtime behavior, file paths, and configurations remain unchanged.

---

### Changed

**Migration Summary**

| Phase | Scope | Files |
|-------|-------|-------|
| Phase 0 | TypeScript standards + infrastructure (`tsconfig.json`, project references, `shared/types.ts`) | 5 |
| Phase 1 | `shared/` workspace — types, embeddings, utilities | ~15 |
| Phase 2 | `mcp_server/core/` — config, database, state management | ~8 |
| Phase 3 | `mcp_server/lib/` — search, scoring, cognitive, session | ~25 |
| Phase 4 | `mcp_server/handlers/` — MCP tool handlers | ~12 |
| Phase 5 | `mcp_server/` root — context-server entry point, tool registration | ~5 |
| Phase 6 | `scripts/` workspace — memory, spec, template scripts | ~15 |
| Phase 7 | Test files — all 59 test files converted | ~59 |
| Phase 8 | Documentation — code examples, file references, changelog | ~16 |

**Architecture Decisions (D1-D8)**

1. **D1: CommonJS output** — `__dirname` works natively; zero changes to path logic or `opencode.json` startup
2. **D2: In-place compilation** — `.ts` to `.js` in same directory; no `dist/` folder; all `require()` paths unchanged
3. **D3: Strict mode from start** — `"strict": true` catches null/undefined at compile time
4. **D4: Circular dependency resolution** — Moved `retry.ts`, `path-security.ts`, `folder-scoring.ts` to `shared/` with re-export stubs
5. **D5: Interface naming** — Kept `I` prefix on existing `IEmbeddingProvider`/`IVectorStore`; new interfaces omit it
6. **D6: Standards before migration** — Phase 0 established TypeScript conventions in `workflows-code--opencode` skill
7. **D7: Central types file** — `shared/types.ts` as single source of truth for cross-workspace types
8. **D8: Test conversion last** — Tests converted in Phase 7 after all source; can run as `.js` against compiled output

**Infrastructure**

9. **`tsconfig.json`** — Added with project references for 3 workspaces (`shared/`, `mcp_server/`, `scripts/`)
10. **Build pipeline** — `tsc --build` for incremental compilation across workspaces

**Source Files**

11. **All `.js` source files** — Converted to `.ts` with full type annotations
12. **23 path references** — Fixed across 15 command and asset files (`command/spec_kit/`, `command/memory/`, `command/create/`) to reflect `.js` to `.ts` migration
13. **TypeScript standards** — Added to `workflows-code--opencode` skill (4 new reference files, v1.1.0 to v1.3.0)
14. **Code examples** — In reference documentation updated from JavaScript to TypeScript
15. **File path references** — In documentation updated: source references use `.ts`, execution commands keep `.js`

---

### New

1. **`shared/types.ts`** — Central type definitions for cross-workspace interfaces
2. **`sqlite-vec.d.ts`** — Type declarations for SQLite vector extension
3. **TypeScript standards** — In `workflows-code--opencode` skill
4. **`tsconfig.json` files** — For each workspace with project references
5. **Backward-compatible CommonJS exports** — Compiled `.js` output identical in behavior
6. **All runtime file paths and configurations** — Unchanged
7. **`opencode.json` startup commands** — Unchanged (`node context-server.js`)
8. **Security patterns** — (path validation, input sanitization) maintained
9. **All 59 test files** — Pass after conversion

---

### Source

- **Decision Record:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/decision-record.md`
- **Spec Folder:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`

---

## [**1.2.4.0**] - 2026-02-05

**Ecosystem-wide deep analysis & remediation** (Specs 087 + 088) with 3 critical bugs fixed, schema unification via Migration v12, gate numbering standardization, and AGENTS.md naming migration across 59 files.

---

### Fixed

**Critical Bugs**

1. **`CREATE_LINKED` SQL constraint** — Added to `memory_conflicts` CHECK constraint in migration v4 schema and `create_schema()` (`vector-index.js`)
2. **Ghost tools in speckit.md** — Rewrote tool layers from wrong 5-layer to correct 7-layer, 22-tool architecture; removed `memory_drift_context` and `memory_drift_learn` references
3. **Stale SKILL.md cross-references** — Fixed 5 section references + standardized template file counts

**Schema Unification (Migration v12)**

4. **Three conflicting DDL schemas unified** — `memory_conflicts` had incompatible column names across `vector-index.js`, `create_schema()`, and `prediction-error-gate.js`; unified to 14-column schema
5. **Migration v12** — DROP+CREATE with unified schema; `SCHEMA_VERSION` 11 to 12
6. **Column renames** — `similarity_score` to `similarity`, `notes` to `reason` in both INSERT paths
7. **Error swallowing removed** — Silent try/catch in `memory-save.js` and `prediction-error-gate.js` replaced with `console.error()` logging
8. **`ensure_conflicts_table()` deprecated** — Converted to no-op in `prediction-error-gate.js`

**Gate Numbering**

9. **gate-enforcement.md** — Full renumbering to match AGENTS.md (Gate 1=Understanding, 2=Skill Routing, 3=Spec Folder)
10. **7 active files** — Removed stale Gate 4/5/6 references
11. **Legacy install guide** — Rewritten from 7-gate to 3-gate + 3 behavioral rules

**Signal Handlers**

12. **context-server.js** — Added `toolCache.shutdown()` to SIGINT/SIGTERM/uncaughtException
13. **access-tracker.js** — Removed duplicate SIGINT/SIGTERM handlers

**Documentation**

14. **schema-migration.test.js** — Column names updated for v12 schema
15. **decision-format.md, epistemic-vectors.md** — Gate number corrections
16. **search/README.md, core/README.md** — Schema version references updated

---

### Changed

17. **AGENTS.md naming** — 59 files updated (~218 replacements) to use `AGENTS.md` instead of `CLAUDE.md`
18. **speckit.md** — Added 4 missing commands + 3 scripts to Capability Scan
19. **SKILL.md** — Added 3 scripts to Key Scripts table
20. **skill_advisor.py** — Memory/context intent boost (passes 0.8 threshold); debug disambiguation
21. **Template counts** — Standardized across speckit.md, SKILL.md, README.md

---

## [**1.2.3.3**] - 2026-02-03

**Infrastructure work domain detection** (Spec 085) fixing root cause of memory files being saved to incorrect spec folders when working on shared infrastructure (`.opencode/`).

---

### Fixed

**alignment-validator.js**

1. **New `detect_work_domain()` function** — Analyzes file paths from observations to detect infrastructure vs project work: calculates ratio of `.opencode/` files, identifies subpath (`skill/system-spec-kit`, `command/memory`, `agent/`, etc.), returns domain info with confidence score and matching patterns
2. **New `calculate_alignment_score_with_domain()` function** — Wraps base scoring with infrastructure awareness: applies +40 bonus to folders matching infrastructure patterns, patterns mapped per subpath (e.g., `skill/system-spec-kit` maps to `['memory', 'spec-kit', 'opencode']`)
3. **Updated `validate_content_alignment()` and `validate_folder_alignment()`** — Now use domain-aware scoring: show infrastructure mismatch warning when detected, list better-matching alternatives with boosted scores (e.g., `003-memory-and-spec-kit` scores 90% vs `005-example.com` at 0% for spec-kit work)

**continue.md**

4. **Added Step 3: Validate Content vs Folder Alignment** — Validates `key_files` against `spec_folder` before recovery: detects when infrastructure work is filed under project folder, presents options to correct mismatch
5. **Fixed step numbering** — Removed half-steps (2.5 to 3, renumbered subsequent steps)
6. **Added KEY FILES to recovery summary** — Allows users to verify spec folder makes sense for the work

---

## [**1.2.3.2**] - 2026-02-03

**generate-context.js script fixes** (Spec 084) resolving API naming mismatch and template warning suppression.

---

### Fixed

1. **API naming mismatch** — Added snake_case export aliases to `vector-index.js` for backward compatibility with `retry-manager.js`: `initialize_db`, `get_db`, `get_memory`, `get_db_path`; fixes `vector_index.get_db is not a function` error during retry processing
2. **Template warning suppression** — Added `OPTIONAL_PLACEHOLDERS` set to `template-renderer.js` to suppress warnings for V2.2 spec'd-but-unimplemented placeholders: Session Integrity Checks (8 placeholders), Memory Classification (6 placeholders), Session Deduplication (3 placeholders), Postflight Learning Delta (9 placeholders)

---

## [**1.2.3.1**] - 2026-02-03

**Test suite updates** (post-modularization alignment) correcting file paths and README exclusion logic.

---

### Fixed

1. **test-bug-fixes.js path corrections** — Updated file paths to match modular lib structure: `lib/vector-index.js` to `lib/search/vector-index.js`, `lib/memory-parser.js` to `lib/parsing/memory-parser.js`, `scripts/generate-context.js` to `scripts/memory/generate-context.js`, rate limiting functions now in `core/db-state.js`, query validation now in `utils/validators.js`, database check functions now in `core/db-state.js`
2. **test-template-system.js README exclusion** — Updated file counting logic to exclude README.md files from template counts (README.md files are documentation, not templates)
3. **Result** — All tests now pass (27/27 bug tests, 95/95 template tests)

---

## [**1.2.3.0**] - 2026-02-03

**30-agent audit bug fixes** (Spec 085) — comprehensive remediation of 34 bugs discovered by 30 parallel agents auditing the Spec Kit v1.2.x release. All P0/P1/P2 issues resolved with independent verification.

---

### Fixed

**Core Infrastructure (Agent 1)**

1. **Schema version mismatch** — Updated `SCHEMA_VERSION` from 9 to 11 in `vector-index.js:108`
2. **Duplicate error codes** — `QUERY_TOO_LONG` changed from E040 to E042, `QUERY_EMPTY` from E041 to E043 (now unique)

**Scoring Modules (Agent 2)**

3. **Tier weight inconsistency** — Aligned `folder-scoring.js` TIER_WEIGHTS with authoritative `importance-tiers.js`
4. **Invalid tier names** — Removed non-existent "high" and "low" tiers from `composite-scoring.js` multipliers
5. **Test alignment** — Updated `five-factor-scoring.test.js` to use valid tier names

**Extractors (Agent 3)**

6. **Null pointer crashes** — Added defensive null checks for `collected_data` and `observations` in `file-extractor.js:61-63`
7. **Process termination** — Replaced `process.exit(1)` with `throw new Error()` in `file-extractor.js:31` and `diagram-extractor.js:22,28`

**Templates (Agents 4 & 5)**

8. **Section numbering** — Fixed `level_2/spec.md` section 10 to 7 (OPEN QUESTIONS)
9. **Progressive inheritance** — Level 3 templates now correctly inherit L2 addendum content
10. **L3+ content removal** — Removed L3+ sections from `level_3/checklist.md` (belongs only in level_3+)
11. **Double separators** — Fixed `------` to `---` in L2 and L3 templates
12. **Template comments** — Updated template source comments to reflect inheritance chain

**Memory Commands (Agent 6)**

13. **Tool prefix standardization** — All memory commands now use full `spec_kit_memory_` prefix
14. **Files updated** — `context.md`, `manage.md`, `save.md`, `learn.md` (MCP Matrix tables and allowed-tools)

**SKILL.md Documentation (Agent 7)**

15. **Tool table expansion** — Added 8 missing tools (14 to 22): `memory_context`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_get_learning_history`
16. **LOC counts** — Updated template line counts to match actual sizes (L1: 450, L2: 890, L3: 890, L3+: 1080)
17. **Path fix** — Corrected `decision-format.md` path to `validation/` subfolder

**Error Handling (Agent 8)**

18. **False positive reduction** — Added `hasWholeWord()` and `areTermsInSameContext()` helpers to `prediction-error-gate.js` for better contradiction detection
19. **Error message clarity** — Improved `workflow.js:279-281` error message with actionable guidance

**Shared Utilities (Agent 9)**

20. **Deduplication logic** — `trigger-extractor.js:448-499` now prefers longer, more specific phrases over shorter ones

**Embedding Providers (Agent 10)**

21. **Provider identification** — Added `getProviderName()` method to all 3 providers (`openai.js`, `voyage.js`, `hf-local.js`)
22. **Documentation accuracy** — Fixed `utils/README.md` API documentation to match actual `process_with_retry()` parameters

**Verification**

All fixes independently verified: schema version 11 confirmed at `vector-index.js:108`, error codes E042/E043 confirmed unique at `core.js:40-41`, zero `process.exit()` calls in extractors, all 3 providers have `getProviderName()` method, memory commands use full tool prefixes.

---

### Source

- **Audit Spec:** `specs/003-memory-and-spec-kit/084-speckit-30-agent-audit/`
- **Fix Spec:** `specs/003-memory-and-spec-kit/085-audit-fixes/`
- **Completion:** 34/34 actual bugs fixed (100%)

---

## [**1.2.1.0**] - 2026-02-02

**Memory command consolidation** reducing from 9 commands to 5 for a simpler mental model, with intent detection improvements and cross-platform temp file handling.

---

### Changed

1. **Memory command consolidation** — Reduced from 9 commands to 5 for simpler mental model
2. **`/memory:learn`** — Now includes `correct` subcommand for corrections
3. **`/memory:manage`** — New unified command for database, checkpoint, and maintenance operations
4. **Intent detection** — Updated to use phrase-based matching (avoids false positives)
5. **Rollback mechanism** — Added for checkpoint restore operations
6. **Checkpoint validation** — Added before cleanup operations
7. **Cross-platform temp file handling** — Added
8. **`/memory:search`** — Replaced by `/memory:context` (unified context retrieval) [deprecated]
9. **`/memory:database`** — Consolidated into `/memory:manage` [deprecated]
10. **`/memory:checkpoint`** — Consolidated into `/memory:manage` [deprecated]
11. **`/memory:why`** — Removed (causal tracing available via MCP tools) [deprecated]
12. **`/memory:correct`** — Consolidated into `/memory:learn correct` subcommand [deprecated]

---

### Fixed

1. **MCP tool references** — Fixed (`memory_drift_context` to `memory_context`)
2. **Non-existent tool reference** — Removed references to non-existent `memory_drift_learn` tool
3. **`autoImportance` type inconsistency** — Fixed in learn.md
4. **Example numbering gap** — Fixed in learn.md
5. **Date typo** — Fixed (2026 to 2025) in context.md

---

## [**1.2.0.0**] - 2026-02-02

Major release implementing **SpecKit Reimagined** (Spec 082) with **33 features**, **107 tasks**, and **5 new memory commands**. Adds session deduplication, causal memory graph, intent-aware retrieval, BM25 hybrid search, and comprehensive crash recovery.

---

### New

**Session Management (W-S)**

1. **Session deduplication** — Hash-based tracking prevents re-surfacing same memories (50% token savings)
2. **Crash recovery** — `session_state` table with automatic `CONTINUE_SESSION.md` generation
3. **SessionStateManager API** — `resetInterruptedSessions()`, `recoverState()` with `_recovered` flag

**Search & Retrieval (W-R)**

4. **BM25 hybrid search** — Pure JavaScript BM25 implementation for lexical search fallback
5. **RRF fusion enhancement** — k=60 parameter with 10% convergence bonus for multi-source results
6. **Intent-aware retrieval** — 5 intent types (add_feature, fix_bug, refactor, security_audit, understand)
7. **Cross-encoder reranking** — Voyage/Cohere/local providers with length penalty (100 char threshold)
8. **Fuzzy matching** — Levenshtein distance (<=2) + ACRONYM_MAP (30+ entries)

**Decay & Scoring (W-D)**

9. **Type-specific half-lives** — 9 memory types with distinct decay rates
10. **Multi-factor decay** — Pattern alignment and citation recency factors
11. **Usage boost scoring** — Enhanced 5-factor composite scoring
12. **Consolidation pipeline** — 5-phase duplicate detection and semantic merge

**Causal Memory Graph (W-G)**

13. **Causal edges** — 6 relationship types (caused, enabled, supersedes, contradicts, derived_from, supports)
14. **Decision lineage** — Depth-limited traversal (max 10 hops) with cycle detection
15. **Learning from corrections** — Stability penalties (0.5x) and boosts (1.2x) for replacements

**Infrastructure (W-I)**

16. **Recovery hints catalog** — 49 error codes with actionable recovery guidance
17. **Tool output caching** — 60s TTL with LRU eviction
18. **Lazy model loading** — Deferred embedding initialization
19. **Standardized response envelope** — `{summary, data, hints, meta}` structure
20. **Layered tool organization** — 7-layer MCP architecture (L1-L7)
21. **Incremental indexing** — Content hash + mtime-based diff updates
22. **Pre-flight quality gates** — ANCHOR validation, duplicate detection, token budget checks
23. **Protocol abstractions** — Provider-agnostic embedding interfaces
24. **API key validation** — Secure key handling with actionable guidance
25. **Fallback chain** — Primary API to Local to BM25-only with logging
26. **Deferred indexing** — Graceful degradation when embeddings fail
27. **Retry logic** — Exponential backoff (1s, 2s, 4s) with jitter
28. **Transaction atomicity** — SAVEPOINT/ROLLBACK patterns

**New Files**

29. `lib/session/session-manager.js` — Session deduplication and crash recovery (~1050 lines)
30. `lib/errors/recovery-hints.js` — 49 error codes with hints (~520 lines)
31. `lib/search/bm25-index.js` — Pure JS BM25 implementation (~380 lines)
32. `lib/search/cross-encoder.js` — Reranking with Voyage/Cohere/local (~490 lines)
33. `lib/search/intent-classifier.js` — Intent detection for 5 types
34. `lib/search/fuzzy-match.js` — Levenshtein + acronym expansion **[NEVER IMPLEMENTED]**
35. `lib/learning/corrections.js` — Memory corrections tracking (~560 lines) **[NEVER IMPLEMENTED]**
36. `lib/cognitive/archival-manager.js` — Automatic archival background job (~450 lines)
37. `lib/cognitive/consolidation.js` — 5-phase consolidation pipeline **[NEVER IMPLEMENTED]**
38. `lib/architecture/layer-definitions.js` — 7-layer MCP architecture (~320 lines)
39. `lib/embeddings/provider-chain.js` — Embedding fallback chain (~340 lines) **[NEVER IMPLEMENTED]**
40. `lib/response/envelope.js` — Standardized response structure (~280 lines)
41. `lib/storage/causal-edges.js` — Causal edge management (~529 lines)
42. `handlers/memory-context.js` — L1 Orchestration unified entry (~420 lines)
43. `handlers/causal-graph.js` — MCP handlers for causal graph (~319 lines)

**New Commands**

44. `/memory:continue` — Session recovery from crash/compaction
45. `/memory:context` — Unified entry with intent awareness
46. `/memory:why` — Decision lineage tracing via causal graph
47. `/memory:correct` — Learning from mistakes with stability penalties
48. `/memory:learn` — Explicit learning capture (patterns, pitfalls, insights)

**New MCP Tools**

49. `memory_drift_why` — Trace causal chain for "why" queries
50. `memory_causal_link` — Create causal relationships between memories
51. `memory_causal_stats` — Graph statistics and coverage metrics
52. `memory_causal_unlink` — Remove causal relationships
53. `memory_drift_context` — Unified context with intent awareness **[NEVER IMPLEMENTED -- removed from roadmap]**
54. `memory_drift_learn` — Capture explicit learning **[NEVER IMPLEMENTED -- removed from roadmap]**

---

### Changed

**Database Schema**

1. **v8** — `causal_edges` table (6 relation types, strength, evidence)
2. **v9** — `memory_corrections` table (stability tracking, pattern extraction)
3. **v10** — `session_state` table (crash recovery, dirty flag)
4. **v11** — Added `is_archived`, `archived_at` columns

**Templates**

5. **context_template.md v2.2** — CONTINUE_SESSION section, session_dedup metadata, causal_links
6. **save.md** — Phase 0 pre-flight validation, §16 session deduplication, deferred indexing
7. **search.md** — Hybrid search architecture, intent-aware retrieval, compression tiers

**Memory Commands**

8. All 9 memory commands updated with spec 082 cross-references
9. All 7 spec_kit commands updated with Five Checks Framework
10. 12 YAML workflow assets updated with context loading integration

---

### Fixed

1. **folder-detector.js** — CLI arguments now take priority over alignment validation (never override explicit user intent)

---

### Source

- **Spec Folder:** `specs/003-memory-and-spec-kit/082-speckit-reimagined/`
- **Test Documentation:** `specs/003-memory-and-spec-kit/082-speckit-reimagined/tests/`
- **Implementation Tasks:** 107 tasks across 5 workstreams (W-S, W-R, W-D, W-G, W-I)
- **Test Coverage:** cross-encoder (22), intent-classifier (25), provider-chain (28), causal-edges (29), archival-manager (32), fuzzy-match (40), five-factor-scoring (65), tier-classifier (78); overall 83.2% (89/107 tasks)

*For full implementation details, see `082-speckit-reimagined/implementation-summary.md`*

---

## [**1.1.0.0**] - 2025-01-29

Major cognitive memory upgrade implementing **FSRS power-law decay** validated on 100M+ users, **Prediction Error Gating** to prevent duplicates, and **30 bug fixes** from comprehensive 10-agent audit. Memory commands aligned with template standards.

---

### New

**Cognitive Memory System**

1. **FSRS power-law algorithm** — `R(t,S) = (1 + (19/81) * t/S)^(-0.5)` replaces arbitrary exponential decay
2. **Prediction Error Gating** — 4-tier thresholds (0.95 DUPLICATE, 0.90 HIGH_MATCH, 0.70 MEDIUM_MATCH, 0.50 LOW_MATCH)
3. **5-state memory model** — HOT (>=0.8), WARM (0.25-0.8), COLD (0.05-0.25), DORMANT (0.02-0.05), ARCHIVED (<0.02)
4. **Testing Effect** — Accessing memories strengthens stability (desirable difficulty bonus)
5. **Schema v4** — New columns: stability, difficulty, last_review, review_count + memory_conflicts table

**New Files**

6. `lib/cognitive/fsrs-scheduler.js` — FSRS algorithm implementation
7. `lib/cognitive/prediction-error-gate.js` — Duplicate detection and conflict resolution
8. `tests/fsrs-scheduler.test.js` — 30 unit tests for FSRS
9. `tests/verify-cognitive-upgrade.js` — Comprehensive verification script

---

### Fixed

**Critical Bugs (P0)**

1. **BUG-001: FSRS function never executed** — Fixed signature mismatch in tier-classifier.js
2. **BUG-002: MEDIUM_MATCH = LOW_MATCH** — Changed LOW_MATCH to 0.50
3. **BUG-003: COLD = DORMANT thresholds** — Changed DORMANT to 0.02

**High Bugs (P1)**

4. **BUG-004: LRUCache missing methods** — Added keys() and delete() methods
5. **BUG-005: Missing await on DB check** — Added await to delete/update handlers
6. **BUG-006: Unhandled promise rejection** — Wrapped reinforce_existing_memory in try/catch
7. **BUG-007: NaN propagation** — Early return with 0.5 default when no timestamps
8. **BUG-008: Data loss on restore failure** — SAVEPOINT/ROLLBACK pattern in checkpoints.js
9. **BUG-009: ReDoS in YAML regex** — Line-by-line parsing in memory-parser.js
10. **BUG-010: ReDoS in trigger patterns** — Bounded greedy quantifiers in trigger-extractor.js
11. **BUG-011: Silent delete errors** — Added console.warn logging

**Medium Bugs (P2)**

12. **BUG-012: Cache thundering herd** — Loading flag with try/finally
13. **BUG-013: Inconsistent tier weights** — Centralized to importance-tiers.js
14. **BUG-014: NaN from env vars** — isNaN() validation in working-memory.js
15. **BUG-015: Negative scores not clamped** — Math.max(0, score) in co-activation.js
16. **BUG-016: Partial transaction commits** — Track failures, rollback all
17. **BUG-017: Token metrics wrong order** — Capture before reassignment
18. **BUG-018: Undo doesn't check result** — Verify changes > 0 in history.js
19. **BUG-019: Migration not transactional** — database.transaction() wrapper
20. **BUG-020: UTF-16 BE unsupported** — Manual byte-swap conversion

**Low Bugs (P3)**

21. **BUG-021-030** — Input validation, error sanitization, Unicode boundaries, symlink detection, division guards

---

### Changed

**MCP Server**

1. **Composite scoring** — Added retrievability weight (0.15), adjusted similarity (0.30 to 0.25)
2. **Tier classifier** — Extended from 3-state to 5-state model
3. **Attention decay** — Integrated FSRS decay functions

**Memory Commands**

4. **checkpoint.md** — Template alignment: emojis, section naming
5. **database.md** — Added section number to COGNITIVE MEMORY MODEL, fixed emoji
6. **save.md** — PHASE 1B to 2 (integer numbering), emoji fixes
7. **search.md** — Numbered CONSTITUTIONAL/COGNITIVE sections

---

## [**1.0.8.2**] - 2025-01-24

Comprehensive test suite adding **1,087 tests** across **8 new test files** for cognitive memory, MCP handlers, session learning, validation rules, and the Five Checks Framework.

---

### New

**MCP Server Tests (3 files, 419 tests)**

1. **test-session-learning.js** — 161 tests for preflight/postflight handlers, Learning Index formula
2. **test-memory-handlers.js** — 162 tests for memory_search, triggers, CRUD, save, index operations
3. **test-cognitive-integration.js** — 96 integration tests for cognitive memory subsystem

**Scripts Tests (5 files, 668 tests)**

4. **test-validation-system.js** — 99 tests for all 13 validation rules, level detection, exit codes
5. **test-template-comprehensive.js** — 154 tests for template rendering, ADDENDUM integration
6. **test_dual_threshold.py** — 71 pytest tests for dual-threshold validation
7. **test-extractors-loaders.js** — 279 tests for session extractors and data loaders
8. **test-five-checks.js** — 65 tests for Five Checks Framework

---

### Fixed

1. **memory-crud.js import mismatch** — `isValidTier` to `is_valid_tier` (snake_case)

---

### Changed

1. **mcp_server/tests/README.md** — Added 3 new test files
2. **scripts/tests/README.md** — Added 5 new test files, corrected file count

---

## [**1.0.8.1**] - 2025-01-24

Cleanup release removing verbose templates.

---

### Removed

1. **`templates/verbose/` directory** — 26 files (~5,000+ lines) removed

---

## [**1.0.8.0**] - 2025-01-23

**Dual-threshold validation**, **Five Checks Framework**, and script reorganization.

---

### New

1. **Dual-Threshold Validation** — `(confidence >= 0.70) AND (uncertainty <= 0.35)`
2. **Five Checks Framework** — Architectural validation for Level 3+ specs
3. **session-learning.js** — Cognitive memory session learning handler

---

### Changed

1. **decision-tree-generator.js** — Moved from `extractors/` to `lib/`
2. **opencode-capture.js** — Moved from `lib/` to `extractors/`

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
