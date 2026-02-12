# Changelog

All notable changes to the system-spec-kit skill are documented in this file.

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [2.2.0.3] - 2026-02-12

### Changed

**Frontmatter Audit**

- Trimmed `description` in SKILL.md from ~430 chars to ~220 chars to reduce system prompt token consumption during auto-discovery

---

## [2.2.0.2] - 2026-02-11

### Added

**Internal README Documentation**

- **shared/scoring/README.md** — Composite folder scoring documentation: formula breakdown, weight tables, 8 function exports, 5 constants, archive multiplier rules, design decision references (D1/D2/D4/D7/D8), constitutional exemption notes
- **shared/utils/README.md** — Shared utility documentation: path-security module (CWE-22/59/78 prevention, 3-step validation pipeline) and retry module (exponential backoff, transient/permanent error classification, HTTP status codes)
- **scripts/types/README.md** — Session type definitions documentation: 16 interfaces across 4 sections (Decision, Phase/Conversation, Diagram, Session), ASCII type architecture diagram, `SessionData` root type with 35+ fields, P6-05 tech-debt migration notes
- **mcp_server/tools/README.md** — Tool dispatch layer documentation: 22 MCP tools across 5 domains (L1–L7), dispatcher architecture with ASCII flow diagram, `parseArgs<T>()` utility, tool extension guide

### Changed

- **mcp_server/tests/README.md** — Added emoji prefixes to all 37 section headers (8 H2 + 29 H3/H4) to match project README styling conventions

---

## [2.2.0.1] - 2026-02-11

### Fixed

**Pre-Release Audit Fixes**

- `constitutional/README.md`: 2 broken reference paths fixed (`save_workflow.md` → correct path, `trigger_config.md` → correct path)
- `constitutional/README.md`: Stale file listing updated — added `speckit-exclusivity.md`
- `README.md`: Script count corrected `244` → `90`, LOC corrected `~1075` → `~1350`
- `references/structure/folder_routing.md`: Genericized `anobel.com` domain reference
- `CHANGELOG.md`: Genericized 1 `anobel.com` reference

---

## [2.2.0.0] - 2026-02-11

### Changed

**TypeScript Conversion Completion & Documentation Accuracy (specs 104-107)**

Full completion of the TypeScript migration and comprehensive documentation accuracy campaign across the entire system-spec-kit project.

**Spec 104: TypeScript Conversion Phase 1**

- Continued TypeScript conversion of remaining source files in `mcp_server/`
- Converted handler files, library modules, and utility code to strict TypeScript
- Added type annotations across all converted modules

**Spec 105: TypeScript Cleanup**

- Achieved **0 `tsc` errors** across entire codebase
- **3,872 tests passing** across **114 test files** (71 skipped, 4 test files skipped)
- **0 JavaScript source files** remaining in `mcp_server/` (all converted to TypeScript)
- **0 `@ts-nocheck`** directives in source files
- Total: 204 TypeScript files, 86 source + 118 test files, ~68,000 LOC

**Spec 106: Documentation Accuracy Audit**

- 20-agent parallel documentation audit across all READMEs and reference docs
- ~120 critical accuracy issues identified (stale counts, wrong file references, outdated descriptions)
- Comprehensive issue catalog produced for remediation

**Spec 107: Documentation Accuracy Fixes**

- 303 fixes applied across all READMEs and documentation files
- Removed 39 `mcp-narsil` ghost references from skill documents (`workflows-code--opencode/SKILL.md`, `workflows-code--full-stack/SKILL.md`, `mcp-code-mode/INSTALL_GUIDE.md`)
- Corrected stale counts in install guides: skills 7 → 9, agents 2 → 8, commands 16 → 19
- Stale test counts updated (700+ → 3,872)
- Stale template LOC counts corrected across SKILL.md and README.md
- Version number updated from 1.2.4.0 → 2.2.0.0
- Missing CHANGELOG entries added for specs 104-107

### Fixed

- SKILL.md version stuck at 1.2.4.0 (now 2.2.0.0)
- README.md test count: 700+ → 3,872 tests, 91 → 114 test files
- README.md template LOC counts: ~50% understated (now aligned with SKILL.md)
- CHANGELOG.md missing entries for specs 104-107

---

## [2.1.9.0] - 2026-02-10

### Fixed

**Final Audit Post-TypeScript (spec 103)**

- 81 issues found and resolved by ~40 parallel agents
- `@ts-nocheck` removed from 96 test files (~1,100 type errors fixed)
- Vitest configuration validated across all test suites
- Final comprehensive quality audit of the full TypeScript codebase

---

## [2.1.8.0] - 2026-02-10

### Fixed

**MCP Cleanup & Alignment (spec 102)**

- All 36 findings from spec 101 misalignment audit resolved
- 6 command files updated with `memory_context` integration and standardized quality gates (`spec_kit/{research,plan,resume,implement,complete,handover}.md`)
- 5 obsolete commands removed: `search/code.md`, `search/index.md`, `memory/{checkpoint,database,search}.md`
- 2 pre-existing test failures fixed
- ADR-008 written documenting alignment decisions
- Code-documentation alignment achieved

---

## [2.1.7.0] - 2026-02-10

### Changed

**Misalignment Audit (spec 101)**

- 36 findings identified across 5 dimensions (read-only audit)
- Cross-component analysis: SKILL.md vs Commands vs MCP Schemas vs Agent definitions
- Prioritized fix matrix created for remediation planning
- Gaps between code and documentation cataloged
- No code changes — audit and planning only

---

## [2.1.6.0] - 2026-02-10

### Added

**Test Coverage (spec 100)**

- 1,589 new tests across 26 files
- 100% module export coverage achieved
- 48 security tests for FTS5 SQL injection prevention
- Comprehensive test infrastructure established

---

## [2.1.5.0] - 2026-02-10

### Changed

**Memory Cleanup (spec 099)**

- Database re-indexed: 85 → 261 memories
- Unsafe type casts reduced: 48 → 3
- 75 new tests added
- Deprecated types preserved for backward compatibility

---

## [2.1.4.0] - 2026-02-10

### Fixed

**Feature/Bug/Documentation Audit (spec 098)**

- 10 P0 + 18 P1 issues fixed
- 12 non-functional features restored to working state
- Documentation-code alignment improved: 67.9% → 95.5%
- Comprehensive feature audit across entire MCP server

---

## [2.1.3.0] - 2026-02-09

### Added

**Memory Save Auto-Detect (spec 097)**

- Auto-detect spec folder from Gate 3 conversation context
- 5-priority detection cascade (explicit path → Gate 3 → recent spec → cwd → ask user)
- Only 2 files modified — minimal, focused change
- Streamlined the memory save workflow

---

## [2.1.2.1] - 2026-02-09

### Fixed

**Spec Kit Memory Bug Audit (spec 096)**

Most comprehensive bug-fix release in project history — 85+ bugs fixed with 27 new regression tests.

**Critical Severity (8 bugs)**

- **FSRS formula: 18.45x decay rate error corrected** — Memories were decaying at the wrong rate due to incorrect factor calculation
- **macOS crash bug in SQLite operations** — Platform-specific crash during concurrent database access
- **Database no-op operations** — Writes that silently did nothing, causing data loss without errors

**Overall**

- 85+ bugs fixed total across all severity levels
- 27 new tests added for regression coverage
- All critical paths verified post-fix

---

## [2.1.2.0] - 2026-02-09

### Fixed

**Code Audit Remediation (spec 095)**

- All P0/P1 coding standard violations remediated across 12 task categories
- `dist/` directory fully rebuilt to match TypeScript source

---

## [2.1.1.0] - 2026-02-09

### Fixed

**20-Agent Parallel Code Review (spec 094)**

- 5 P0 (critical) bugs found and fixed across MCP server
- 14 P1 (high) bugs found and fixed
- Weighted code quality score: 68/100

---

## [2.1.0.0] - 2026-02-09

### Added

**Memory Index Deep Audit & Fix — Sessions 7-11 (spec 093)**

- Token budget observability: `tokenBudget` field in response metadata for all handler responses
- `console.error` logging when token budgets exceeded
- Hint injection in responses when budget thresholds are hit

### Fixed

**CRITICAL: FSRS formula corrected** — Factor changed from `19.0` to `19/81` (≈0.2346), formula from `R = (1 + t/(FACTOR×S))^(-0.5)` to `R = (1 + FACTOR×t/S)^(-0.5)`. Memories were decaying ~4.5x slower than FSRS v4 standard. Now R(S,S) = 0.9 as specified.

- `clearConstitutionalCache` bug in vector-index.ts — was calling wrong internal method
- 3 broken delegations in vector-index facade
- Integration test paths, bug-fix tests, preflight tests
- `safeParseJson` security alignment across modules
- 5 test failures: confidence-tracker, handler-memory-search, memory-context, tier-classifier, tool-cache

### Changed

- Test suite: 46/60 → 58/58 (100% pass rate); 2 orphan test files removed
- vector-index.ts: 705 → 491 lines (214 lines dead code removed)
- 12+ READMEs rewritten across MCP server subdirectories
- search-weights.json: cleaned dead parameters and regex patterns

### Removed

- Orphan `dist/core.js` (was shadowing `dist/core/` directory)
- 9 orphaned files (7 dist `.js` + 2 test files)
- 3 fabricated sections in `references/memory/memory_system.md` (decay formula, computeFingerprint(), 5-state model)

---

## [2.0.0.0] - 2026-02-07

### Changed

**JavaScript to TypeScript Migration (spec 092)**

Full codebase migration from JavaScript to TypeScript across all source files in `shared/`, `mcp_server/`, and `scripts/`. Compiled CommonJS output preserves backward compatibility — all runtime behavior, file paths, and configurations remain unchanged.

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
2. **D2: In-place compilation** — `.ts` → `.js` in same directory; no `dist/` folder; all `require()` paths unchanged
3. **D3: Strict mode from start** — `"strict": true` catches null/undefined at compile time
4. **D4: Circular dependency resolution** — Moved `retry.ts`, `path-security.ts`, `folder-scoring.ts` to `shared/` with re-export stubs
5. **D5: Interface naming** — Kept `I` prefix on existing `IEmbeddingProvider`/`IVectorStore`; new interfaces omit it
6. **D6: Standards before migration** — Phase 0 established TypeScript conventions in `workflows-code--opencode` skill
7. **D7: Central types file** — `shared/types.ts` as single source of truth for cross-workspace types
8. **D8: Test conversion last** — Tests converted in Phase 7 after all source; can run as `.js` against compiled output

**Infrastructure**

- Added `tsconfig.json` with project references for 3 workspaces (`shared/`, `mcp_server/`, `scripts/`)
- Added `shared/types.ts` with shared interfaces (`IEmbeddingProvider`, `IVectorStore`, `SearchResult`, `MemoryRecord`, etc.)
- Added `sqlite-vec.d.ts` type declarations for native SQLite vector extension
- Added TypeScript standards documentation to `workflows-code--opencode` skill
- Build pipeline: `tsc --build` for incremental compilation across workspaces

**Source Files**

- All `.js` source files converted to `.ts` with full type annotations
- 23 path references fixed across 15 command and asset files (`command/spec_kit/`, `command/memory/`, `command/create/`) to reflect `.js` → `.ts` migration
- TypeScript standards added to `workflows-code--opencode` skill (4 new reference files, v1.1.0 → v1.3.0)
- All code examples in reference documentation updated from JavaScript to TypeScript
- File path references in documentation updated: source references use `.ts`, execution commands keep `.js`

### Added

- `shared/types.ts` — Central type definitions for cross-workspace interfaces
- `sqlite-vec.d.ts` — Type declarations for SQLite vector extension
- TypeScript standards in `workflows-code--opencode` skill
- `tsconfig.json` files for each workspace with project references

### Preserved

- Backward-compatible CommonJS exports (compiled `.js` output identical in behavior)
- All runtime file paths and configurations unchanged
- `opencode.json` startup commands unchanged (`node context-server.js`)
- Security patterns (path validation, input sanitization) maintained
- All 59 test files pass after conversion

### References

- **Decision Record:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/decision-record.md`
- **Spec Folder:** `specs/003-memory-and-spec-kit/092-javascript-to-typescript/`

---

## [1.2.4.0] - 2026-02-05

### Fixed

**Ecosystem-Wide Deep Analysis & Remediation (specs 087 + 088)**

Comprehensive audit by 6 Opus agents followed by remediation of 3 critical bugs, schema unification, gate numbering standardization, and AGENTS.md naming migration.

**Critical Bugs**

1. **`CREATE_LINKED` SQL constraint** — Added to `memory_conflicts` CHECK constraint in migration v4 schema and `create_schema()` (`vector-index.js`)
2. **Ghost tools in speckit.md** — Rewrote tool layers from wrong 5-layer to correct 7-layer, 22-tool architecture; removed `memory_drift_context` and `memory_drift_learn` references
3. **Stale SKILL.md cross-references** — Fixed 5 section references + standardized template file counts

**Schema Unification (Migration v12)**

4. **Three conflicting DDL schemas unified** — `memory_conflicts` had incompatible column names across `vector-index.js`, `create_schema()`, and `prediction-error-gate.js`. Unified to 14-column schema.
5. **Migration v12** — DROP+CREATE with unified schema; `SCHEMA_VERSION` 11 → 12
6. **Column renames** — `similarity_score` → `similarity`, `notes` → `reason` in both INSERT paths
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

### Changed

17. **AGENTS.md naming** — 59 files updated (~218 replacements) to use `AGENTS.md` instead of `CLAUDE.md`
18. **speckit.md** — Added 4 missing commands + 3 scripts to Capability Scan
19. **SKILL.md** — Added 3 scripts to Key Scripts table
20. **skill_advisor.py** — Memory/context intent boost (passes 0.8 threshold); debug disambiguation
21. **Template counts** — Standardized across speckit.md, SKILL.md, README.md

---

## [1.2.3.3] - 2026-02-03

### Fixed

**Infrastructure Work Domain Detection (spec 085-alignment-file-paths)**

Root cause fix for memory files being saved to incorrect spec folders when working on shared infrastructure (`.opencode/`).

**alignment-validator.js**

1. **New `detect_work_domain()` function** — Analyzes file paths from observations to detect infrastructure vs project work:
   - Calculates ratio of `.opencode/` files
   - Identifies subpath (`skill/system-spec-kit`, `command/memory`, `agent/`, etc.)
   - Returns domain info with confidence score and matching patterns

2. **New `calculate_alignment_score_with_domain()` function** — Wraps base scoring with infrastructure awareness:
   - Applies +40 bonus to folders matching infrastructure patterns
   - Patterns mapped per subpath (e.g., `skill/system-spec-kit` → `['memory', 'spec-kit', 'opencode']`)

3. **Updated `validate_content_alignment()` and `validate_folder_alignment()`** — Now use domain-aware scoring:
   - Show infrastructure mismatch warning when detected
   - List better-matching alternatives with boosted scores
   - Example: `003-memory-and-spec-kit` scores 90% vs `005-example.com` at 0% for spec-kit work

**continue.md**

4. **Added Step 3: Validate Content vs Folder Alignment** — Validates `key_files` against `spec_folder` before recovery:
   - Detects when infrastructure work is filed under project folder
   - Presents options to correct mismatch

5. **Fixed step numbering** — Removed half-steps (2.5 → 3, renumbered subsequent steps)

6. **Added KEY FILES to recovery summary** — Allows users to verify spec folder makes sense for the work

**Result:** Infrastructure work (files in `.opencode/`) now correctly routes to infrastructure-related spec folders. Mismatches trigger warnings with suggested alternatives.

---

## [1.2.3.2] - 2026-02-03

### Fixed

**generate-context.js Script Issues (spec 084)**

1. **API naming mismatch** — Added snake_case export aliases to `vector-index.js` for backward compatibility with `retry-manager.js`:
   - `initialize_db`, `get_db`, `get_memory`, `get_db_path`
   - Fixes `vector_index.get_db is not a function` error during retry processing

2. **Template warning suppression** — Added `OPTIONAL_PLACEHOLDERS` set to `template-renderer.js` to suppress warnings for V2.2 spec'd-but-unimplemented placeholders:
   - Session Integrity Checks (8 placeholders)
   - Memory Classification (6 placeholders)
   - Session Deduplication (3 placeholders)
   - Postflight Learning Delta (9 placeholders)

**Result:** `generate-context.js` runs cleanly without errors or excessive warnings.

---

## [1.2.3.1] - 2026-02-03

### Fixed

**Test Suite Updates (post-modularization alignment)**

1. **test-bug-fixes.js path corrections** — Updated file paths to match modular lib structure:
   - `lib/vector-index.js` → `lib/search/vector-index.js`
   - `lib/memory-parser.js` → `lib/parsing/memory-parser.js`
   - `scripts/generate-context.js` → `scripts/memory/generate-context.js`
   - Rate limiting functions now found in `core/db-state.js`
   - Query validation now found in `utils/validators.js`
   - Database check functions now in `core/db-state.js`

2. **test-template-system.js README exclusion** — Updated file counting logic to exclude README.md files from template counts (README.md files are documentation, not templates)

**Result:** All tests now pass (27/27 bug tests, 95/95 template tests)

---

## [1.2.3.0] - 2026-02-03

### Fixed

**30-Agent Audit Bug Fixes (spec 085-audit-fixes)**

Comprehensive remediation of 34 bugs discovered by 30 parallel agents auditing the Spec Kit v1.2.x release. All P0/P1/P2 issues resolved with independent verification.

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

8. **Section numbering** — Fixed `level_2/spec.md` section 10 → 7 (OPEN QUESTIONS)
9. **Progressive inheritance** — Level 3 templates now correctly inherit L2 addendum content
10. **L3+ content removal** — Removed L3+ sections from `level_3/checklist.md` (belongs only in level_3+)
11. **Double separators** — Fixed `------` to `---` in L2 and L3 templates
12. **Template comments** — Updated template source comments to reflect inheritance chain

**Memory Commands (Agent 6)**

13. **Tool prefix standardization** — All memory commands now use full `spec_kit_memory_` prefix
14. **Files updated:** `context.md`, `manage.md`, `save.md`, `learn.md` (MCP Matrix tables and allowed-tools)

**SKILL.md Documentation (Agent 7)**

15. **Tool table expansion** — Added 8 missing tools (14→22): `memory_context`, `task_preflight`, `task_postflight`, `memory_drift_why`, `memory_causal_link`, `memory_causal_stats`, `memory_causal_unlink`, `memory_get_learning_history`
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

---

### Verification

All fixes independently verified:
- Schema version 11 confirmed at `vector-index.js:108`
- Error codes E042/E043 confirmed unique at `core.js:40-41`
- Zero `process.exit()` calls in extractors
- All 3 providers have `getProviderName()` method
- Memory commands use full tool prefixes

---

### References

- **Audit Spec:** `specs/003-memory-and-spec-kit/084-speckit-30-agent-audit/`
- **Fix Spec:** `specs/003-memory-and-spec-kit/085-audit-fixes/`
- **Completion:** 34/34 actual bugs fixed (100%)

---

## [1.2.1.0] - 2026-02-02

### Changed
- **Memory command consolidation** - Reduced from 9 commands to 5 for simpler mental model
- `/memory:learn` now includes `correct` subcommand for corrections
- `/memory:manage` is new unified command for database, checkpoint, and maintenance operations
- Updated intent detection to use phrase-based matching (avoids false positives)
- Added rollback mechanism for checkpoint restore operations
- Added checkpoint validation before cleanup operations
- Cross-platform temp file handling

### Deprecated
- `/memory:search` → Replaced by `/memory:context` (unified context retrieval)
- `/memory:database` → Consolidated into `/memory:manage`
- `/memory:checkpoint` → Consolidated into `/memory:manage`
- `/memory:why` → Removed (causal tracing available via MCP tools)
- `/memory:correct` → Consolidated into `/memory:learn correct` subcommand

### Fixed
- Fixed MCP tool references (`memory_drift_context` → `memory_context`)
- Removed references to non-existent `memory_drift_learn` tool
- Fixed `autoImportance` type inconsistency in learn.md
- Fixed example numbering gap in learn.md
- Fixed date typo (2026→2025) in context.md

---

## [**1.2.0.0**] - 2026-02-02

Major release implementing **SpecKit Reimagined** (spec 082) with **33 features**, **107 tasks**, and **5 new memory commands**. Adds session deduplication, causal memory graph, intent-aware retrieval, BM25 hybrid search, and comprehensive crash recovery.

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
8. **Fuzzy matching** — Levenshtein distance (≤2) + ACRONYM_MAP (30+ entries)

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
25. **Fallback chain** — Primary API → Local → BM25-only with logging
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
53. `memory_drift_context` — Unified context with intent awareness **[NEVER IMPLEMENTED — removed from roadmap]**
54. `memory_drift_learn` — Capture explicit learning **[NEVER IMPLEMENTED — removed from roadmap]**

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

### Test Coverage

- 22 tests: cross-encoder.test.js
- 25 tests: intent-classifier.test.js
- 28 tests: provider-chain.test.js
- 29 tests: causal-edges.test.js
- 32 tests: archival-manager.test.js
- 40 tests: fuzzy-match.test.js
- 65 tests: five-factor-scoring.test.js
- 78 tests: tier-classifier.test.js
- **Overall coverage: 83.2%** (89/107 tasks)

---

### References

- **Spec Folder:** `specs/003-memory-and-spec-kit/082-speckit-reimagined/`
- **Test Documentation:** `specs/003-memory-and-spec-kit/082-speckit-reimagined/tests/`
- **Implementation Tasks:** 107 tasks across 5 workstreams (W-S, W-R, W-D, W-G, W-I)

---

*For full implementation details, see `082-speckit-reimagined/implementation-summary.md`*

---

## [**1.1.0.0**] - 2025-01-29

Major cognitive memory upgrade implementing **FSRS power-law decay** validated on 100M+ users, **Prediction Error Gating** to prevent duplicates, and **30 bug fixes** from comprehensive 10-agent audit. Memory commands aligned with template standards.

---

### New

**Cognitive Memory System**

1. **FSRS power-law algorithm** — `R(t,S) = (1 + (19/81) × t/S)^(-0.5)` replaces arbitrary exponential decay
2. **Prediction Error Gating** — 4-tier thresholds (0.95 DUPLICATE, 0.90 HIGH_MATCH, 0.70 MEDIUM_MATCH, 0.50 LOW_MATCH)
3. **5-state memory model** — HOT (≥0.8), WARM (0.25-0.8), COLD (0.05-0.25), DORMANT (0.02-0.05), ARCHIVED (<0.02)
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

1. **Composite scoring** — Added retrievability weight (0.15), adjusted similarity (0.30 → 0.25)
2. **Tier classifier** — Extended from 3-state to 5-state model
3. **Attention decay** — Integrated FSRS decay functions

**Memory Commands**

4. **checkpoint.md** — Template alignment: emojis, section naming
5. **database.md** — Added section number to COGNITIVE MEMORY MODEL, fixed emoji (✓→✅)
6. **save.md** — PHASE 1B→2 (integer numbering), emoji fixes
7. **search.md** — Numbered CONSTITUTIONAL/COGNITIVE sections

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*

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

1. **memory-crud.js import mismatch** — `isValidTier` → `is_valid_tier` (snake_case)

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

Dual-threshold validation, Five Checks Framework, and script reorganization.

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
