# Changelog

All notable changes to the system-spec-kit skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

---

## [2.0.1] - 2026-01-22

*Environment version: 1.0.6.1*

Fixes template path references in YAML workflow configs, resolving "File not found" errors when spec_kit workflows attempted to read non-existent root-level templates.

---

### Fixed

1. **Level-specific template paths** — 9 YAML config files updated with correct template references:
   - `spec_kit_plan_auto.yaml` · `spec_kit_plan_confirm.yaml`
   - `spec_kit_complete_auto.yaml` · `spec_kit_complete_confirm.yaml`
   - `spec_kit_research_auto.yaml` · `spec_kit_research_confirm.yaml`
   - `spec_kit_implement_auto.yaml` · `spec_kit_implement_confirm.yaml`
   - `create_skill.yaml`
2. **Template path format** — `templates/spec.md` → `templates/level_2/spec.md` (and similar for all template types)

---

## [2.0.0] - 2026-01-21

*Environment version: 1.0.6.0*

Major template architecture overhaul introducing CORE + ADDENDUM v2.0. This release achieves 74-82% template line reduction through a compositional model, adds 26 verbose templates with extended guidance for new users, creates a comprehensive 557-test validation suite, and standardizes all 19 commands across 4 namespaces. The result: templates that add genuine value at each documentation level instead of boilerplate, with full backward compatibility. Implements specs 073-076.

---

### New

**CORE + ADDENDUM v2.0 Template Architecture (Spec 073)**

1. **Compositional Template Model** — Monolithic templates replaced with modular core + addendum architecture:
   - `templates/core/`: 4 base templates (322 LOC total)
     - `spec-core.md` (94 lines) — Essential what/why/how
     - `plan-core.md` (102 lines) — Technical approach and phases
     - `tasks-core.md` (67 lines) — Task breakdown with notation
     - `impl-summary-core.md` (59 lines) — Post-implementation summary
   - `templates/addendum/level2-verify/`: Verification sections (184 LOC)
     - `spec-level2.md` — NFRs, Edge Cases, Complexity Assessment
     - `plan-level2.md` — Phase Dependencies, Effort Estimates
     - `checklist.md` — QA verification with P0/P1/P2 priorities
   - `templates/addendum/level3-arch/`: Architecture sections (220 LOC)
     - `spec-level3.md` — Executive Summary, Risk Matrix, User Stories
     - `plan-level3.md` — Dependency Graph, Critical Path, Milestones
     - `decision-record.md` — ADR template with alternatives matrix
   - `templates/addendum/level3plus-govern/`: Governance sections (190 LOC)
     - `spec-level3plus.md` — Approval Workflow, Compliance, Stakeholder Matrix
     - `plan-level3plus.md` — AI Execution Framework, Workstream Coordination
     - `checklist-extended.md` — Extended checklist with approval workflow
2. **Value-Based Level Scaling** — Each level adds distinct VALUE sections (not boilerplate):
   - Level 1 (Core): Essential what/why/how — 4 files, ~320 lines
   - Level 2 (+Verify): +NFRs, +Edge Cases, +Complexity Score, +Effort Estimates — 5 files, ~520 lines
   - Level 3 (+Arch): +Executive Summary, +Risk Matrix, +User Stories, +ADRs, +Milestones — 6 files, ~760 lines
   - Level 3+ (+Govern): +Approval Workflow, +Compliance Checkpoints, +Stakeholder Matrix, +AI Framework — 6 files, ~950 lines
3. **Workstream Notation** — Prefixes for parallel sub-agent coordination in multi-agent scenarios:
   - `[W-A]`, `[W-B]`, `[W-C]` — Workstream ownership markers
   - `[SYNC]` — Synchronization points requiring coordination
   - Enables 40% faster spec creation via parallelization (Tier 2 parallel, Tier 3 integration)
4. **Pre-Composed Level Templates** — Ready-to-use templates in `templates/level_N/` directories:
   - `templates/level_1/` — Core only (4 files)
   - `templates/level_2/` — Core + L2 addendums (5 files)
   - `templates/level_3/` — Core + L2 + L3 addendums (6 files)
   - `templates/level_3+/` — All addendums combined (6 files)
5. **Architecture Decision Records** — Three ADRs documenting design decisions:
   - ADR-001: CORE + ADDENDUM architecture (single source of truth, modular maintenance)
   - ADR-002: Value-based level scaling (real usage analysis showed 0% usage of stakeholders, traceability mapping, KPI targets)
   - ADR-003: Workstream notation standard (enables clear task coordination in multi-agent scenarios)

**Verbose Templates (Spec 074)**

6. **26 Verbose Template Files** — Extended guidance scaffolding in `templates/verbose/` for new users:
   - `verbose/core/`: spec-core-verbose.md (201 lines), plan-core-verbose.md (246 lines), tasks-core-verbose.md (210 lines), impl-summary-core-verbose.md (169 lines)
   - `verbose/level_1/` through `verbose/level_3+/`: Pre-composed verbose templates at each level
   - ~2.5-3x longer than minimal templates (~200-300 lines vs ~60-90 lines)
7. **Three Guidance Patterns** — Structured scaffolding for template completion:
   - `[YOUR_VALUE_HERE: description]` — Placeholders with contextual guidance (e.g., `[YOUR_VALUE_HERE: 1 for <100 LOC, 2 for 100-499 LOC, 3 for 500+ LOC]`)
   - `[NEEDS CLARIFICATION: (a) (b) (c)]` — Multiple-choice questions for ambiguous requirements
   - `[example: specific content]` — Inline examples demonstrating expected quality
   - Verbose-only sections: ASSUMPTIONS (spec), COMPLEXITY JUSTIFICATION (plan)
8. **SPECKIT_TEMPLATE_STYLE Environment Variable** — Switch between template variants:
   ```bash
   export SPECKIT_TEMPLATE_STYLE=verbose  # Extended guidance for new users
   export SPECKIT_TEMPLATE_STYLE=minimal  # Clean templates for experienced users (default)
   ```
9. **compose.sh Script** — 1,021-line automated template composition and maintenance tool:
   - Location: `scripts/templates/compose.sh`
   - Usage: `./compose.sh --level 2` to regenerate level 2 templates from core + addendums
   - Supports `--all` flag to regenerate all levels
   - Includes `--dry-run` for preview without changes
10. **WHEN TO USE Sections** — HTML comments in 8 template files for invisible guidance:
    ```html
    <!-- WHEN TO USE: Level 1 for features <100 LOC with clear requirements -->
    ```
    - Visible during editing, invisible in rendered output
    - Added to all spec.md and plan.md templates across levels

**Test Suite (Spec 075)**

11. **test-template-system.js** — 95 tests covering template validation:
    - Core template validation and composition verification
    - SPECKIT_LEVEL marker detection
    - Verbose template guidance pattern validation
    - Template path resolution
12. **test-validation-extended.sh** — 129 tests for all 14 validation rules:
    - Exit code semantics (0=pass, 1=warn, 2=error)
    - JSON/verbose/quiet output modes
    - Path-scoped validation
    - All rules: FILE_EXISTS, FOLDER_NAMING, FRONTMATTER_VALID, PRIORITY_TAGS, EVIDENCE_CITED, PLACEHOLDER_FILLED, ANCHORS_VALID, SECTIONS_PRESENT, LEVEL_DECLARED, COMPLEXITY_MATCH, SECTION_COUNTS, AI_PROTOCOL, LEVEL_MATCH
13. **test-mcp-tools.js** — 148 tests for MCP tool functionality:
    - Memory search (semantic matching, anchor filtering, folder-scoped queries)
    - `memory_match_triggers` pattern detection
    - Checkpoint operations (create/list/restore/delete)
    - Memory CRUD operations
14. **test-scripts-modules.js** — 166 tests for script modules:
    - `generate-context.js` (JSON/folder input modes, ANCHOR format)
    - Extractors module (file, conversation, decision, diagram)
    - Utils module (path, validation, input normalization)
    - Lib module (embedding-client, sqlite-client, index-manager, search-engine)
15. **test-integration.js** — 36 end-to-end workflow tests:
    - Full memory save workflow
    - Complete validation pipeline
    - Cognitive memory session flow
    - Checkpoint roundtrip testing

---

### Changed

**Template System**

1. **74-82% Template Line Reduction** — Unused sections removed based on real usage analysis of 9+ spec folders:
   - Removed: Stakeholders (0% usage), Traceability Mapping (0% usage), KPI Targets (0% usage), Given/When/Then (10% usage), Assumptions Validation (5% usage)
   - Result: L1 from ~800 to ~320 lines, L3 from ~2,100 to ~760 lines
2. **Template Path Conventions** — `templates/level_N/` is canonical location:
   - Clarified from earlier `composed/` references in documentation
   - 12 occurrences corrected in SKILL.md
   - Template path table added to SKILL.md
3. **implementation-summary.md Required at Level 1** — Previously implicit, now explicit requirement:
   - Created after implementation completes, not at spec folder creation
   - Added to Level 1 required files in `spec_kit_plan_*.yaml`

**Documentation**

4. **12 Documentation Files Aligned** — All files now 100% compliant with write.md standards:
   - Section 1 renamed to OVERVIEW (was various names)
   - RELATED RESOURCES section added as final section
   - Sequential numbering fixed in asset files
5. **SKILL.md Updated** — Version bump to v2.0.0 with comprehensive architecture documentation:
   - New template path table showing all level folders
   - CORE + ADDENDUM architecture diagram
   - Verbose templates section with usage examples

**Infrastructure**

6. **Version Convention** — v2.0.0 reflects major architectural change:
   - Major version bump (1.x → 2.x) for CORE + ADDENDUM architecture
   - Aligns with SemVer for breaking conceptual changes

---

### Fixed

**Template Fixes**

1. **Level 2 Template Composition** — Corrected composition issues where L2 templates were missing addendum sections
2. **6 Orphaned COMPLEXITY_GATE Markers** — Removed from `templates/level_2/checklist.md` (deprecated markers from previous architecture)
3. **Template Version Markers** — Added `v2.0` to SPECKIT_TEMPLATE_SOURCE in all templates

**Script Fixes**

4. **create.sh Uninitialized Variables** — Fixed variable initialization issues causing script failures
5. **Validation Script grep Pipeline** — Added `|| true` pattern for `set -eo pipefail` compatibility:
   - `grep` returns exit code 1 when no matches found
   - Scripts now handle no-match case gracefully
6. **Non-Portable Regex** — Fixed regex patterns for cross-platform compatibility (macOS + Linux)

**Cross-Platform**

7. **macOS /tmp Path Security** — Added `/tmp` and `/private/tmp` to allowedBases in `scripts/loaders/data-loader.js`:
   - macOS `/tmp` symlinks to `/private/tmp`
   - Both paths now accepted for cross-platform compatibility

**Documentation**

8. **Cross-Reference Fix** — `/memory:database` line 404 corrected to reference `/memory:checkpoint restore` (was incorrectly referencing `/memory:database restore`)
9. **Path Reference Updates** — 36 documentation paths updated to reflect new template structure

---

### Verification

- **557 tests**: 540 passed, 17 skipped, 0 failures (97% pass rate)
- **P0 Critical Tests**: 100% passing (core initialization, MCP server, database, vector search)
- **P1 Required Tests**: 100% passing (validation rules, cognitive features, memory generation)
- **Template Composition**: `compose.sh` generates identical output to pre-composed templates
- **Cross-Platform**: macOS and Linux path handling verified
- **Backward Compatibility**: All existing spec folders function without modification

---

### Upgrade

1. **No Breaking Changes** — All existing spec folders and APIs maintain backward compatibility
2. **Template Selection** — Choose template variant based on experience level:
   ```bash
   # For new users (extended guidance)
   export SPECKIT_TEMPLATE_STYLE=verbose

   # For experienced users (clean templates, default)
   export SPECKIT_TEMPLATE_STYLE=minimal
   ```
3. **Compose Script** — Regenerate level templates if customizing core templates:
   ```bash
   cd .opencode/skill/system-spec-kit/scripts/templates
   ./compose.sh --all          # Regenerate all levels
   ./compose.sh --level 2      # Regenerate specific level
   ./compose.sh --dry-run      # Preview without changes
   ```
4. **Optional Migration** — To use verbose templates for existing incomplete specs:
   - Copy verbose templates: `cp templates/verbose/level_2/* specs/###-feature/`
   - Fill in guidance patterns, then simplify to core format

---

## [1.9.0] - 2026-01-17

*Environment version: 1.0.5.0*

Major feature release implementing Memory Command Separation, Dynamic Complexity-Based Templates, and Composite Folder Ranking. Consolidates 5 specs (068-072) with ~3,000+ LOC new code, 300+ tests, and critical performance optimizations.

---

### New

**Memory Command Separation (Spec 068)**

1. **`/memory:database` Command** — Dedicated management command with 9 operation modes:
   - `stats` — Database dashboard (total memories, size, tier breakdown)
   - `scan` / `scan --force` — Index new/all memory files
   - `cleanup` — Bulk cleanup with safety gates and auto-checkpoint
   - `tier <id> <tier>` — Change importance tier (constitutional→deprecated)
   - `triggers <id>` — Edit trigger phrases
   - `validate <id> useful|not` — Mark usefulness for confidence tracking
   - `delete <id>` — Delete with confirmation gates
   - `health` — Comprehensive health report
2. **Safety Gates** — Hard block confirmations for destructive operations
3. **Auto-Checkpoint** — Pre-cleanup checkpoint before bulk deletions

**Dynamic Complexity-Based Templates (Spec 069)**

4. **5-Dimension Complexity Detection** — Weighted scoring algorithm:
   - Scope (25%): Files, LOC, systems
   - Risk (25%): Security, auth, breaking changes
   - Research (20%): Investigation, unknowns
   - Multi-Agent (15%): Parallel workstreams
   - Coordination (15%): Dependencies, blocking
5. **Level Classification** — Score-to-level mapping:
   - Level 1 (0-25): spec, plan, tasks, impl-summary
   - Level 2 (26-55): + checklist
   - Level 3 (56-79): + decision-record
   - Level 3+ (80-100): + AI protocols, workstreams, DAGs
6. **Level-Specific Template Folders** — Pre-expanded templates in `level_1/`, `level_2/`, `level_3/`, `level_3+/`
7. **New CLI Tools**:
   - `detect-complexity.js` — `--request`, `--file`, `--json`, `--quiet`
   - `expand-template.js` — `--template`, `--level`, `--all`, `--dry-run`
8. **171 Tests** — 5 test suites with 100% pass rate

**Composite Folder Ranking (Spec 070)**

9. **Ranking Algorithm** — `score = (recency × 0.40) + (importance × 0.30) + (activity × 0.20) + (validation × 0.10) × archive_multiplier`
10. **Archive Detection** — Auto-filtering with multipliers: z_archive (0.1×), scratch/test/prototype (0.2×)
11. **Recency Decay** — 10-day half-life with constitutional tier exemption
12. **New `memory_stats()` Parameters**:
    - `folderRanking`: count | recency | importance | composite
    - `excludePatterns`, `includeScores`, `includeArchived`, `limit`
13. **61 Tests** — All passing

**Level Alignment (Spec 071)**

14. **`get_level_templates_dir()`** — Maps levels to folder paths in create-spec-folder.sh
15. **`selectLevelFolder()`** — JavaScript equivalent in preprocessor.js
16. **COMPLEXITY_GATE Cleanup** — Removed 6 orphaned markers from level_2/checklist.md

**Infrastructure (Spec 072)**

17. **camelCase YAML Frontmatter** — Parser accepts both snake_case and camelCase:
    - `importanceTier` / `importance_tier`
    - `contextType` / `context_type`
    - `triggerPhrases` / `trigger_phrases`
18. **Barrel Export Namespace Prefixes** — 58 explicit exports preventing collision

---

### Changed

1. **`/memory:search` Now Read-Only** — Management operations moved to `/memory:database`
2. **Scripts Use Level Folders** — `create-spec-folder.sh`, `expand-template.js` copy from `level_N/`
3. **COMPLEXITY_GATE Deprecated** — Replaced with pre-expanded level templates
4. **Async File Reading** — `Promise.all()` for parallel I/O in vector-index.js
5. **RRF Fusion O(1) Lookups** — Map-based replacing O(n×m) linear search
6. **Checkpoint Restore Batch Dedup** — O(n) composite key approach
7. **Unified Recency Scoring** — Single implementation in `folder-scoring.js`
8. **MCP Library Reorganized** — Subdirectories: `cognitive/`, `parsing/`, `providers/`, `scoring/`, `search/`, `storage/`, `utils/`
9. **Database Reinitialization Mutex** — Promise-based race condition prevention
10. **Constitutional Double-Fetch Prevention** — Conditional check before redundant queries
11. **All 13 Validation Rules** — Implement consistent `run_check()` interface
12. **36 Path References** — Updated to `scripts/memory/generate-context.js`
13. **`complexity_decision_matrix.md`** — Aligned with workflows-documentation standards

---

### Fixed

1. **Barrel Export Collision** — Spread operators silently overwrote functions
2. **Database Reinitialization Race** — Mutex with finally-block release
3. **Sequential File Reads** — Blocking event loop (now async)
4. **~400 Lines Duplicate Code** — `rank-memories.js` imports from `folder-scoring.js`
5. **Checkpoint O(n²) Dedup** — Batch query approach
6. **`check-section-counts.sh`** — Grep output sanitization
7. **4 Validation Rules Rewritten** — check-complexity, check-section-counts, check-ai-protocols, check-level-match
8. **Constitutional `gate-enforcement.md`** — Now indexed with `constitutional` tier
9. **`level_2/checklist.md`** — Removed orphaned COMPLEXITY_GATE markers

---

## [1.7.2] - 2026-01-16

*Environment version: 1.0.4.1*

Bug fix for constitutional README indexing issue.

---

### Fixed

1. **Constitutional Indexer** — Now skips `README.md` files (case-insensitive) in `find_constitutional_files()` to prevent documentation from being indexed as memories
2. **Memory File Validator** — `is_memory_file()` now excludes README.md files from constitutional directories during `memory_save` operations

---

## [1.8.0] - 2026-01-15

*Environment version: 1.0.4.0*

Major quality and architecture release with 231 bug fixes, anchor-based retrieval, modular server architecture, and Voyage 4 support.

---

### New

1. **Anchor System (SK-005)** — `memory_search` now accepts `anchors` parameter for targeted section retrieval:
   - Token savings: 73% (summary-only), 87% (decisions-only), 61% (summary+decisions)
   - Response includes `tokenMetrics` with `actualTokens`, `fullFileTokens`, `savingsPercent`
   - Anchor format: `<!-- ANCHOR:id -->...<!-- /ANCHOR:id -->`
2. **Voyage 4 Embedding Support** — Added `voyage-4`, `voyage-4-large`, `voyage-4-lite` models:
   - Automatic database separation per model (no data loss on upgrade)
   - Shared embedding space enables asymmetric retrieval

---

### Changed

1. **Modular Architecture** — Decomposed `context-server.js` from 2,703 to 319 lines (88% reduction):
   - 19 new modules across 5 directories: `core/`, `handlers/`, `formatters/`, `utils/`, `hooks/`
   - All modules under 300 lines for AI-editable size
2. **Default Embedding Model** — Changed from `voyage-3.5` to `voyage-4`
3. **Documentation Accuracy** — Corrected ANCHOR token savings claims; standardized debug threshold to "3+"

---

### Fixed

1. **Critical: Missing `await` on formatSearchResults()** — Lines 1085, 1140, 1161 returning Promise objects
2. **Critical: E429 Error Code** — Now defined in `errors.js` and documented
3. **Critical: Batch API Rate Limiting** — Added `BATCH_DELAY_MS` (100ms default)
4. **Critical: vec_memories Cleanup** — Fixed deletion order preventing orphaned rows
5. **Race Conditions** — Mutex for warmup; cache clearing on reinitialize; trigger invalidation
6. **Memory Leaks** — LRU cache for regex; timer cleanup in with_timeout
7. **Null Safety** — Null checks on database query results throughout codebase
8. **Cross-Platform** — `os.homedir()` and `os.tmpdir()` replacing hardcoded paths
9. **Config Cleanup** — Deleted unused `config-loader.js`; reduced `search-weights.json`
10. **parseInt Radix** — Added `, 10` to all parseInt calls
11. Plus 200+ additional fixes across templates, commands, references, and documentation

---

## [1.7.1] - 2026-01-15

*Environment version: 1.0.3.6*

Cognitive Memory v1.7.1 with comprehensive bug fixes and MCP protocol fix.

---

### Fixed

1. **Critical (MCP Protocol)** — Changed `console.log` → `console.error` in embeddings to prevent JSON-RPC corruption:
   - `embeddings.js:282`, `factory.js:58`, `factory.js:110`
2. `attention-decay.js`: Column name mismatch (`last_session_access`) causing session tracking failures
3. `checkpoints.js`: Added backup-before-delete to prevent data loss on restore failures
4. `attention-decay.js`: Decay rates returning 1.0 for inactive sessions (should apply decay)
5. `checkpoints.js`: Graceful skip for orphaned checkpoint entries without corresponding memories
6. `attention-decay.js`: NaN/Infinity validation guards in all decay calculation paths
7. `tier-classifier.js`: Added `parse_threshold` helper for safe tier threshold config parsing
8. `co-activation.js`: Replaced `console.log` with `console.error` for proper error logging
9. `co-activation.js`: Added missing `classifyTier` import fixing undefined function errors
10. `context-server.js`: Null/array check before spread in status endpoint response
11. `co-activation.js`: Circular reference prevention in co-activation graph traversal
12. `tier-classifier.js`: HOT threshold > WARM threshold validation to prevent tier inversion
13. `working-memory.js`: Replaced `console.log` with `console.error` for error conditions
14. `flushAccessCounts` → `flush_access_counts` (snake_case alignment)

---

### Added

1. **226 Comprehensive Tests** for cognitive memory modules
2. **5 Cognitive Memory Modules**: attention-decay, co-activation, tier-classifier, working-memory, summary-generator

---

## [1.7.0] - 2026-01-14

*Environment version: 1.0.3.4*

Major release introducing Cognitive Memory system with session-aware features.

---

### Added

1. **Turn-Based Attention Decay** — Memories fade naturally over conversation turns unless re-activated
2. **Tiered Content Delivery** — HOT (≥0.8): full content, WARM (0.25-0.79): summaries only, COLD (<0.25): excluded
3. **Co-Activation** — Related memories get boosted (+0.35) when primary memory activates
4. **Session-Based Working Memory** — Each conversation maintains independent attention state

---

### Changed

1. All package versions updated to 1.7.0

---

## [1.6.0] - 2026-01-02

*Environment version: 1.0.2.6*

Major architecture refactoring release.

---

### Changed

1. **generate-context.js modularization** — 4,800-line monolith → 142-line CLI entry point (97% reduction)
2. 30 new modules created across 6 directories (core, extractors, utils, renderers, spec-folder, loaders)
3. Test scripts reorganized to `scripts/tests/` folder
4. 31 JavaScript files standardized with workflows-code style

---

### Fixed

1. 4 failing bug tests (naming convention mismatches)
2. Missing `collectSessionData` import in workflow.js
3. Empty catch blocks now log errors instead of silently swallowing

---

## [1.5.0] - 2026-01-01

*Environment version: 1.0.2.4*

Infrastructure release with critical bug fixes and security hardening.

---

### Fixed

1. **Critical**: SQLite transaction nesting error in `memory_index_scan`
2. **Critical**: Race condition with database visibility across MCP/script connections
3. **Critical**: Failed vector insertions leaving orphaned metadata
4. **High**: Schema created with wrong embedding dimensions before provider warmup
5. **High**: Constitutional cache invalidation on external database edits

---

### Added

1. MCP Install Scripts Suite with shared utilities library
2. Sub-agent delegation for `/spec_kit:handover` and `/memory:save`
3. Session behavior modes: `--brief`, `--verbose`, `--debug`
4. Universal debugging methodology reference

---

### Security

1. **CWE-22**: Path traversal protection in CLI and DB-stored paths
2. **CWE-400**: Input length limits for MCP tool parameters

---

## [1.4.0] - 2025-12-30

*Environment version: 1.0.2.0*

---

### Added

1. Constitutional memory system with 6 importance tiers
2. `memory_validate` tool for feedback tracking
3. Unicode normalization for trigger phrase matching

---

### Fixed

1. Embedding dimension mismatch with Voyage/OpenAI providers
2. Empty catch blocks replaced with proper logging

---

## [1.3.0] - 2025-12-29

*Environment version: 1.0.0.0*

Initial release of Spec Kit Memory system.

---

### Added

1. Custom MCP server with hybrid search (vector + FTS5)
2. 14 MCP tools for memory management
3. Checkpoint system for state management
4. 7 slash commands with `:auto`/`:confirm` modes
5. 10 purpose-built templates
6. Completeness scoring (0-100%)
