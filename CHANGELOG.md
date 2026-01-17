# Changelog

All notable changes to the OpenCode Dev Environment are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.0.5.0**] - 2026-01-17

Major feature release introducing Memory Command Separation, Dynamic Complexity-Based Templates, and Composite Folder Ranking. Implements 5 specs (068-072) with ~3,000+ new lines of code, 300+ tests, and comprehensive performance optimizations.

---

### New

**Memory Command Separation (Spec 068)**

1. **`/memory:database` Command** — New dedicated command for database management with 9 modes:
   - `stats` — Dashboard with total memories, database size, tier breakdown
   - `scan` / `scan --force` — Index new memory files (force re-indexes all)
   - `cleanup` — Bulk cleanup of old/deprecated memories with safety gates
   - `tier <id> <tier>` — Change memory importance tier
   - `triggers <id>` — Edit trigger phrases for a memory
   - `validate <id> useful|not` — Mark memories as useful or not
   - `delete <id>` — Delete individual memories with confirmation
   - `health` — Comprehensive database health report
2. **Safety Gates for Destructive Operations** — Hard block confirmations for cleanup and delete operations
3. **Automatic Checkpoint Creation** — Pre-cleanup checkpoint created before bulk deletions

**Dynamic Complexity-Based Templates (Spec 069)**

4. **5-Dimension Complexity Detection** — Analyzes task descriptions across weighted dimensions:
   - Scope (25%): Files affected, LOC estimate, systems touched
   - Risk (25%): Security, auth, config, breaking changes
   - Research (20%): Investigation keywords, unknowns, external deps
   - Multi-Agent (15%): Parallel workstreams, agent coordination
   - Coordination (15%): Cross-system dependencies, blocking relationships
5. **Level Classification System** — Maps complexity scores to documentation levels:
   - Level 1 (Baseline): 0-25 points → spec, plan, tasks, impl-summary
   - Level 2 (Verification): 26-55 points → adds checklist
   - Level 3 (Full): 56-79 points → adds decision-record
   - Level 3+ (Extended): 80-100 points → AI protocols, workstreams, dependency DAGs
6. **Level-Specific Template Folders** — Pre-expanded templates in `templates/level_1/`, `level_2/`, `level_3/`, `level_3+/`
7. **New CLI Tools**:
   - `detect-complexity.js` — Complexity detection with `--request`, `--file`, `--json`, `--quiet` flags
   - `expand-template.js` — Template expansion with `--template`, `--level`, `--all`, `--spec-folder`, `--dry-run` flags
8. **171 Tests** — Comprehensive test suite with 100% coverage across 5 test suites

**Composite Folder Ranking (Spec 070)**

9. **Composite Ranking Algorithm** — Multi-factor scoring replacing simple count-based ranking:
   - Formula: `score = (recency × 0.40) + (importance × 0.30) + (activity × 0.20) + (validation × 0.10) × archive_multiplier`
10. **Archive Detection & Filtering** — Automatic deprioritization of archived folders:
    - `z_archive/` → 0.1× multiplier
    - `scratch/`, `test-`, `prototype/` → 0.2× multiplier
11. **Recency Decay System** — Time-based score decay with 10-day half-life
12. **Constitutional Tier Decay Exemption** — Constitutional memories never decay (always 1.0)
13. **New `memory_stats()` Parameters**:
    - `folderRanking`: `'count'` | `'recency'` | `'importance'` | `'composite'`
    - `excludePatterns`: Array of regex patterns
    - `includeScores`: Boolean for score breakdown
    - `includeArchived`: Boolean to include archived folders
14. **61 Tests** — All passing for folder scoring system

---

### Changed

**Memory Search Refactoring**

1. **`/memory:search` Now Read-Only** — Removed cleanup, tier, triggers, and validate operations (moved to `/memory:database`)
2. **Simplified Actions** — Memory detail view shows only read operations: related, load anchor, search, back, quit

**Template System Updates**

3. **Scripts Use Level Folders** — `create-spec-folder.sh` and `expand-template.js` now copy from level-specific folders
4. **COMPLEXITY_GATE Markers Deprecated** — Replaced with pre-expanded templates per level (markers still functional for backward compatibility)
5. **18 Documentation Files Updated** — All copy commands reference `templates/level_N/` paths

**Performance Optimizations (Spec 072)**

6. **Async File Reading** — `safe_read_file_async()` with `Promise.all()` for parallel I/O
7. **RRF Fusion O(1) Lookups** — Map-based lookups replacing O(n×m) linear search
8. **Checkpoint Restore Batch Deduplication** — O(n) query approach replacing O(n²)
9. **Unified Recency Scoring** — Single implementation in `folder-scoring.js` imported by all consumers
10. **MCP Library Reorganization** — Organized into `cognitive/`, `parsing/`, `providers/`, `scoring/`, `search/`, `storage/`, `utils/`

**Infrastructure**

11. **Barrel Export Namespace Prefixes** — 58 explicit named exports replacing spread operators to prevent collision
12. **Database Reinitialization Mutex** — Promise-based mutex preventing race conditions
13. **Constitutional Memory Double-Fetch Prevention** — Conditional check before redundant queries

---

### Fixed

**Critical Fixes**

1. **Barrel Export Collision Risk** — Spread operators silently overwrote functions; replaced with namespace prefixes
2. **Database Reinitialization Race Condition** — Added mutex with finally-block release
3. **Sequential File Reads Blocking Event Loop** — Added async file reading with Promise.all()
4. **RRF Fusion O(n×m) Complexity** — Map-based O(1) lookups
5. **~400 Lines Duplicate Scoring Code** — `rank-memories.js` now imports from `folder-scoring.js`
6. **Checkpoint Restore O(n²) Deduplication** — Batch query approach with composite keys

**Validation System Fixes**

7. **`check-section-counts.sh`** — Grep output sanitization for comparison operators
8. **4 Validation Rules Rewritten** — check-complexity, check-section-counts, check-ai-protocols, check-level-match now implement `run_check()` interface
9. **Constitutional `gate-enforcement.md`** — Now indexed with `constitutional` tier (was `normal`)

**Template Fixes**

10. **`level_2/checklist.md`** — Removed 6 orphaned COMPLEXITY_GATE markers
11. **36 Path References** — Updated from `scripts/generate-context.js` to `scripts/memory/generate-context.js`

---

### Upgrade

1. **Restart Required** — Restart OpenCode to load updated MCP server with new ranking and search features.
2. **New Commands Available** — `/memory:database` provides management operations; `/memory:search` is now read-only.
3. **Template Level Selection** — Use `--level N` flag with `create-spec-folder.sh` for level-appropriate templates.
4. **No Breaking Changes** — All existing APIs maintain backward compatibility.

**Full Changelog**: [v1.0.4.1...v1.0.5.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.4.1...v1.0.5.0)

---

## [**1.0.4.1**] - 2026-01-16

Fixes a bug where README.md files in the constitutional directory were incorrectly indexed as memories. The documentation file's example YAML frontmatter was parsed as real metadata, creating ghost memory entries.

---

### Fixed

1. **Constitutional Indexer** — Now skips `README.md` files (case-insensitive) in `find_constitutional_files()` to prevent documentation from being indexed as memories.
2. **Memory File Validator** — `is_memory_file()` now excludes README.md files from constitutional directories during `memory_save` operations.

---

### Upgrade

No action required. Pull latest to get the fix. Any previously indexed README memories can be removed with `memory_delete({ id: <id> })`.

**Full Changelog**: [v1.0.4.0...v1.0.4.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.4.0...v1.0.4.1)

---

## [**1.0.4.0**] - 2026-01-15

A major quality and architecture release focusing on system reliability, memory system optimization, and codebase maintainability. This version addresses 231 identified issues across the Spec Kit infrastructure, introduces targeted memory retrieval via the Anchor System (achieving 61-93% token savings), modularizes the core MCP server from 2,703 to 319 lines, and upgrades to Voyage 4 embeddings.

---

### New

1. **Anchor System for Targeted Memory Retrieval** — The `memory_search` tool now accepts an `anchors` parameter enabling retrieval of specific memory sections (e.g., "summary", "decisions") instead of full file content. Verified savings: 73% for summary-only, 87% for decisions-only, 61% for summary+decisions. Response metadata includes `tokenMetrics` with savings calculations.
2. **Modular MCP Server Architecture** — Decomposed `context-server.js` into 19 focused modules across 5 directories:
   - `core/` (3 files, 507 lines) — Server configuration, database state management
   - `handlers/` (7 files, 1,395 lines) — Tool handlers for search, triggers, CRUD, checkpoints
   - `formatters/` (3 files, 353 lines) — Search results and token metrics formatting
   - `utils/` (4 files, 478 lines) — Validators, JSON helpers, batch processing
   - `hooks/` (2 files, 223 lines) — SK-004 auto memory surfacing
3. **Voyage 4 Embedding Support** — Added `voyage-4`, `voyage-4-large`, and `voyage-4-lite` to supported models with automatic database separation per model (existing `voyage-3.5` embeddings preserved).

---

### Changed

1. **Default Embedding Model** — Changed from `voyage-3.5` to `voyage-4` for Spec Kit Memory MCP. Narsil retains `voyage-code-2` until a code-specific Voyage 4 model is released.
2. **Entry Point Reduction** — `context-server.js` reduced from 2,703 lines to 319 lines (88% reduction).
3. **Documentation Accuracy** — ANCHOR system documentation updated from "93% token savings" claim to verified metrics. Debug delegation threshold standardized to "3+ failed attempts" across all documentation.
4. **Attention Decay Documentation** — Corrected to reflect actual turn-based implementation (not time-based as previously documented).
5. **MCP Tool Documentation** — Expanded from 7 to 14 documented tools. Added `searchBoost` multipliers for importance tiers.

---

### Fixed

1. **Critical: Missing `await` in memory_search** — Fixed `formatSearchResults()` calls returning Promise objects instead of resolved results when `includeContent=true`.
2. **Critical: Undefined E429 Error Code** — Added definition to `errors.js` and documented in troubleshooting guide.
3. **Critical: Embedding API Rate Limiting** — Added `BATCH_DELAY_MS` (100ms default) to prevent provider throttling.
4. **Critical: vec_memories Cleanup Order** — Fixed deletion order to prevent orphaned vector rows.
5. **Race Conditions** — Added mutex protection for embedding warmup; fixed constitutional cache clearing; fixed trigger cache invalidation after bulk indexing.
6. **Memory Leaks** — Implemented LRU cache for regex objects in `trigger-matcher.js`; added timer cleanup in `errors.js`.
7. **Null Safety** — Added null checks throughout codebase for database query results.
8. **Cross-Platform Compatibility** — Replaced hardcoded macOS paths with `os.homedir()` and `os.tmpdir()`.
9. **Config System Cleanup** — Deleted unused `config-loader.js` and reduced `search-weights.json` to actively used sections only.
10. **parseInt Radix** — Added explicit radix parameter to all `parseInt()` calls.

---

### Upgrade

1. **Restart Required** — Restart OpenCode to load the updated Spec Kit Memory MCP server with Voyage 4 support.
2. **Automatic Database Migration** — System creates new database file (`context-index__voyage__voyage-4__1024.sqlite`) when switching to Voyage 4. Existing memories preserved.
3. **Optional Re-indexing** — Run `memory_index_scan({ force: true })` to bulk re-index existing memory files.
4. **No Breaking Changes** — All 14 MCP tools maintain identical interfaces.

**Full Changelog**: [v1.0.3.6...v1.0.4.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.6...v1.0.4.0)

---

## [**1.0.3.6**] - 2026-01-15

Critical MCP protocol fix ensuring Cognitive Memory v17.1 functions correctly. Adds VS Code extension install guide and expands workflows-code skill with 16 new reference and asset files.

---

### Fixed

1. **Critical (MCP Protocol)** — Changed `console.log` → `console.error` in 3 locations to prevent "invalid character 'v'" JSON-RPC errors:
   - `embeddings.js:282` (Provider warmed up message)
   - `factory.js:58` (Using provider message)
   - `factory.js:110` (Warming up message)
   - **Why**: MCP servers use stdout for JSON-RPC communication. Any `console.log()` output corrupts the protocol, causing Antigravity quota and other MCP tools to fail.

---

### Added

1. **VS Code Extension Install Guide** — Step-by-step installation guide for non-technical users (`OpenCode - VS Code Extension.md`):
   - AI-first installation prompt for guided setup
   - GitHub Copilot authentication walkthrough
   - Model selection guidance
2. **Performance Patterns Asset** — `performance_patterns.js` with production-validated timing utilities:
   - Throttle/debounce constants (64ms pointermove, 180ms form validation, 200-250ms resize)
   - IntersectionObserver patterns with 0.1 threshold
3. **15 New Reference Files** in workflows-code skill:
   - `debugging/`: `debugging_workflows.md`, `error_recovery.md`
   - `implementation/`: `animation_workflows.md`, `css_patterns.md`, `focus_management.md`, `implementation_workflows.md`, `observer_patterns.md`, `performance_patterns.md`, `security_patterns.md`, `swiper_patterns.md`, `third_party_integrations.md`, `webflow_patterns.md`
   - `standards/`: `css_quick_reference.md`
   - `verification/`: `verification_workflows.md`

---

### Note

This release completes the Cognitive Memory v17.1 rollout by fixing the MCP protocol issue that could prevent the memory system from functioning. The cognitive features themselves (attention-decay, co-activation, tier-classifier, working-memory, summary-generator) were released in v1.0.3.4 and v1.0.3.5.

**Full Changelog**: [v1.0.3.5...v1.0.3.6](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.5...v1.0.3.6)

---

## [**1.0.3.5**] - 2026-01-15

---

### Fixed

1. **Missing Cognitive Module Files** — Force-added 5 lib files blocked by global gitignore:
   - `attention-decay.js`, `co-activation.js`, `tier-classifier.js`, `working-memory.js`, `summary-generator.js`
2. **Test Suite Created** — Added 226 comprehensive tests for cognitive memory modules:
   - `attention-decay.test.js` (46 tests)
   - `working-memory.test.js` (51 tests)
   - `tier-classifier.test.js` (39 tests)
   - `co-activation.test.js` (38 tests)
   - `summary-generator.test.js` (52 tests)
3. **Documentation Inconsistencies** — Aligned decay rate documentation (0.80/turn for normal, 0.60/turn for temporary)
4. **CHANGELOG Accuracy** — Corrected inflated test count claims from v1.0.3.4
5. **Bug Fix** — `flushAccessCounts` → `flush_access_counts` (snake_case alignment)
6. **Gitignore** — Added `.opencode/` exception to prevent future missing file issues

---

### Changed

1. Updated `.gitignore` to override global gitignore pattern for `.opencode/` directory

**Full Changelog**: [v1.0.3.4...v1.0.3.5](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.4...v1.0.3.5)

---

## [**1.0.3.4**] - 2026-01-14

Cognitive Memory v17.1 delivers comprehensive bug fixes to the session-aware memory system introduced in v17.0. Additionally, a comprehensive audit of 4 workflow skills resolved 9 critical bugs, 13 misalignments, and 18 warnings across 13 files.

---

### New

**Cognitive Memory Features (v17.0)**

1. **Turn-Based Attention Decay** — Memories fade naturally over conversation turns unless re-activated. Decay rates vary by importance tier (constitutional=1.0/never, normal=0.80, temporary=0.60).
2. **Tiered Content Delivery** — HOT (≥0.8): full content, WARM (0.25-0.79): summaries only, COLD (<0.25): excluded. Achieves 63-86% token savings in typical sessions.
3. **Co-Activation** — When a memory activates, related memories get boosted (+0.35), surfacing contextually relevant content automatically.
4. **Session-Based Working Memory** — Each conversation maintains independent attention state. Fully backward compatible with stateless mode.

**New Modules (v17.0)**

5. `working-memory.js` — Session state management
6. `attention-decay.js` — Turn-based decay calculations
7. `tier-classifier.js` — HOT/WARM/COLD classification
8. `co-activation.js` — Related memory boosting
9. `summary-generator.js` — WARM tier summary generation

---

### Changed

**Workflow Skills Improvements**

1. **workflows-git v1.5.0** — Full Git workflow orchestrator for complete development lifecycle:
   - Workspace setup guidance via git-worktrees
   - Clean commit workflows with conventional commit conventions
   - Work completion flows for branch integration
   - Pull request creation and review workflows
   - GitHub issue integration
   - Fixed 7 GitHub MCP naming patterns (underscore → dot notation)
   - Added Gate 3 integration and memory integration examples
2. **workflows-chrome-devtools v2.1.0** — Enhanced orchestrator with intelligent routing:
   - CLI (bdg) approach prioritized for speed and token efficiency
   - MCP fallback for multi-tool integration scenarios
   - Screenshot capture, network monitoring, console log access
   - Cookie manipulation and JavaScript execution
   - Unix pipe composability for terminal-based automation
   - Fixed section references in session_management.md and cdp_patterns.md
3. **workflows-documentation** — Validation improvements:
   - Added SMART ROUTING and REFERENCES sections to package_skill.py validation
   - Fixed Resource Router mode numbering (6 duplicates → 4 unique)
   - Added REFERENCES section to init_skill.py template
4. **workflows-code** — Audit bug fixes:
   - Fixed 15 broken asset and relative paths across 3 reference files
   - Viewport alignment standardized to 375px
   - Removed 60 lines of dead code from wait_patterns.js
5. All package versions updated to 17.1.0 for consistency.

---

### Fixed

**Cognitive Memory v17.1**

1. `attention-decay.js`: Column name mismatch (`last_session_access`) causing session tracking failures.
2. `checkpoints.js`: Added backup-before-delete to prevent data loss on restore failures.
3. `attention-decay.js`: Decay rates returning 1.0 for inactive sessions (should apply decay).
4. `checkpoints.js`: Graceful skip for orphaned checkpoint entries without corresponding memories.
5. `attention-decay.js`: NaN/Infinity validation guards in all decay calculation paths.
6. `tier-classifier.js`: Added `parse_threshold` helper for safe tier threshold config parsing.
7. `co-activation.js`: Replaced `console.log` with `console.error` for proper error logging.
8. `co-activation.js`: Added missing `classifyTier` import fixing undefined function errors.
9. `context-server.js`: Null/array check before spread in status endpoint response.
10. `co-activation.js`: Circular reference prevention in co-activation graph traversal.
11. `tier-classifier.js`: HOT threshold > WARM threshold validation to prevent tier inversion.
12. `working-memory.js`: Replaced `console.log` with `console.error` for error conditions.

**Audit Summary:** 9 critical bugs fixed · 13 misalignments resolved · 18 warnings addressed · 13 files modified

---

### Upgrade

No action required. Pull latest to get bug fixes and cognitive memory improvements.

**Full Changelog**: [v1.0.3.3...v1.0.3.4](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.3...v1.0.3.4)

---

## [**1.0.3.3**] - 2026-01-11

Security hardening and documentation quality improvements for workflows-code skill. Fixes URL validation XSS vulnerability, repairs 35 broken cross-references, and brings all reference files into H2 emoji compliance.

---

### Fixed

1. **URL Validation** — Now rejects `javascript:` and `data:` schemes (XSS prevention).
2. **35 Broken Links** — Fixed broken markdown links across 16 reference files.
3. **Missing Default** — `debounce()` missing default delay (now 180ms).
4. **Path Correction** — SKILL.md Quick Reference path (`dist/` → `src/2_javascript/z_minified/`).

---

### Changed

1. Removed deprecated `SafeDOM` class (107 lines).
2. Removed deprecated `debounce` and `raf_throttle` exports from `wait_patterns.js`.
3. Added Lenis smooth scroll pattern routing to SKILL.md.
4. Added HLS video streaming pattern routing to SKILL.md.
5. Added H2 emojis to 4 reference files (34 headers) for documentation compliance.

---

### Upgrade

No action required. Pull latest to get security improvements.

**Full Changelog**: [v1.0.3.2...v1.0.3.3](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.2...v1.0.3.3)

---

## [**1.0.3.2**] - 2026-01-05

Embeds MCP server source code into skill folders for improved portability. Documents critical Code Mode prefixed environment variable requirement that was causing "Variable not found" errors. Updates install guides with comprehensive troubleshooting.

---

### New

1. **Embedded MCP Servers** — Narsil source in `mcp-narsil/mcp_server/`, Code Mode source in `mcp-code-mode/mcp_server/`
2. **Environment Template** — `.env.example` template with Code Mode prefixed variables documented

---

### Changed

1. **Install Guides Updated** — `MCP - Narsil.md` · `MCP - Code Mode.md` with prefixed variable documentation
2. **Code Mode Install Guide** — Added "CRITICAL: Prefixed Environment Variables" section
3. **Narsil Install Guide** — Added prefixed variable note in Neural Search Configuration
4. **Troubleshooting** — New entries for "Variable not found" errors in both guides

---

### Fixed

1. **Documentation Gap** — Code Mode requires `{manual}_{VAR}` format (e.g., `narsil_VOYAGE_API_KEY`)
2. **Public Repo Configs** — Removed hardcoded API keys and absolute paths

---

### Upgrade

Add prefixed variables to `.env` for Code Mode:
```bash
# Standard variable
VOYAGE_API_KEY=pa-your-key

# Code Mode prefixed version (REQUIRED)
narsil_VOYAGE_API_KEY=pa-your-key
```

See `.env.example` for complete template.

**Full Changelog**: [v1.0.3.1...v1.0.3.2](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.1...v1.0.3.2)

---

## [**1.0.3.1**] - 2026-01-05

Updates agent configuration to OpenCode v1.1.1+ format. Migrates deprecated `tools:` object to unified `permission:` format with `allow`/`deny`/`ask` values across all agent files, templates, and documentation.

---

### Changed

1. **Agent Frontmatter** — `tools:` object → `permission:` object (v1.1.1+ format)
2. **Agent Files** — `write.md` · `orchestrate.md`: Consolidated tool permissions into unified permission block
3. **Agent Template** — Updated with v1.1.1 format, granular permissions example, deprecation note
4. **Setup Guide** — `SET-UP - Opencode Agents.md`: Updated examples, field reference, troubleshooting (v1.2)
5. **Create Command** — `/create:agent` now generates v1.1.1 compliant agent files

---

### Upgrade

Existing agents with `tools:` format continue to work (backwards compatible). New agents should use the `permission:` format. See `agent_template.md` for migration examples.

**Full Changelog**: [v1.0.3.0...v1.0.3.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.0...v1.0.3.1)

---

## [**1.0.3.0**] - 2026-01-04

Adds support for alternative specs folder location inside `.opencode/`. Memory files and spec folders can now be stored in either `specs/` (project root) or `.opencode/specs/` for projects that prefer keeping all OpenCode files in a hidden directory.

---

### New

1. **Dual Specs Location** — `specs/` OR `.opencode/specs/`: Both locations now supported for spec folders and memory files
2. **Precedence Rule** — Project root location takes precedence if both exist

---

### Changed

**File Updates (10 files)**

1. `context-server.js`: Path validation updated for dual locations
2. `memory-parser.js`: Scans both `specs/` and `.opencode/specs/` directories
3. `generate-context.js`: Supports spec folder in either location
4. `config.js`: Updated path configuration
5. `workflow.js`: Dual location awareness
6. `collect-session-data.js`: Updated data collection paths
7. `directory-setup.js`: Creates folders in correct location
8. `folder-detector.js`: Detects specs in both locations
9. `MCP - Spec Kit Memory.md`: Documentation updated with examples

---

### Fixed

1. **Cross-Repo Symlink** — `INSTALL_GUIDE.md` in Public repo now points locally instead of to external project

---

### Upgrade

No action required. Existing `specs/` folders continue to work unchanged.

**Full Changelog**: [v1.0.2.9...v1.0.3.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.9...v1.0.3.0)

---

## [**1.0.2.9**] - 2026-01-02

Fixes critical MCP server bugs preventing Spec Kit Memory operations. Multiple import naming mismatches caused E040 errors (`is not a function`) across `memory_health`, `memory_index_scan`, and `memory_save` tools.

---

### Fixed

1. **Critical: getDatabasePath** — `getDatabasePath` → `get_database_path` method name mismatch:
   - `mcp_server/context-server.js:1454` (health check response)
   - `mcp_server/lib/vector-index.js:100` (database path resolution)
2. **Critical: validateFilePath** — `validateFilePath` → `validate_file_path` import mismatch:
   - `mcp_server/context-server.js:55`
   - `mcp_server/lib/vector-index.js:13`
3. **Critical: Error Handlers** — `isTransientError` / `userFriendlyError` → `is_transient_error` / `user_friendly_error` import mismatch:
   - `mcp_server/context-server.js:214`
4. **Critical: escapeRegex** — `escapeRegex` → `escape_regex` import mismatch:
   - `mcp_server/lib/trigger-matcher.js:7`
   - `mcp_server/lib/memory-parser.js:9`

**Root Cause:** During snake_case refactoring, exports in source modules (`shared/utils.js`, `lib/errors.js`) were renamed but imports in consuming files retained camelCase names. Fixed using import aliasing: `const { snake_case: camelCase } = require(...)`

**Full Changelog**: [v1.0.2.8...v1.0.2.9](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.8...v1.0.2.9)

---

## [**1.0.2.8**] - 2026-01-02

Reorganizes the workflows-documentation skill's asset folder structure for improved discoverability. Renames `assets/components/` to `assets/opencode/` and `assets/documents/` to `assets/documentation/` with 250+ path reference updates across 35+ files. Establishes new organizational principle for skill folder structure.

---

### Changed

1. **Asset Folders Renamed**:
   - `assets/components/` → `assets/opencode/` (OpenCode component templates: skills, agents, commands)
   - `assets/documents/` → `assets/documentation/` (document templates: README, install guides, frontmatter)
2. **250+ Path References Updated** across: `SKILL.md` · 7 reference files · 9 asset files · `AGENTS.md` · `write.md` agent · 7 command files · 2 install guides
3. **New Organizational Principle** established and documented:
   - `references/` = FLAT (no subfolders) for simpler AI agent discovery
   - `assets/` = Subfolders ALLOWED for grouping related templates
   - `scripts/` = Typically flat, subfolders OK for large collections
4. **Templates Updated** — `skill_md_template.md` with "Folder Organization Principle" section; `skill_creation.md` with folder guidance

---

### Fixed

1. **Duplicate File** — Deleted duplicate `INSTALL_GUIDE.md` in mcp-figma skill root
2. **Broken Paths** — Fixed 3 broken paths in mcp-figma (removed erroneous `/MCP/` from paths)

**Full Changelog**: [v1.0.2.7...v1.0.2.8](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.7...v1.0.2.8)

---

## [**1.0.2.7**] - 2026-01-02

Addresses critical runtime errors, code quality issues, and documentation misalignments discovered by a 20-agent parallel scan.

---

### Fixed

**Critical Fixes**

1. **workflow.js:19** — Added missing `collectSessionData` import that would cause runtime error
2. **workflow.js:63** — Empty catch block now logs database notification errors instead of silently swallowing them
3. **input-normalizer.js:113,299** — Changed default descriptions from "Modified during session" (flagged as garbage by file-helpers.js) to meaningful defaults: "File modified (description pending)", "Edited via edit tool", "Created via write tool"

**Code Quality Fixes**

4. **decision-tree-generator.js:17-20** — Replaced aggressive `process.exit(1)` with graceful fallback - workflow continues with simplified output when `ascii-boxes` library unavailable
5. **diagram-extractor.js:35-43** — Fixed inverted null check order - now verifies object existence before property access

**Documentation Fixes**

6. **mcp_server/README.md** — Tool count corrected 13→14 (5 locations), file watcher claim clarified as "not yet implemented"
7. **SKILL.md:179,234** — Module count corrected 30→44, directory count 6→10, line count 145→142
8. **scripts/README.md:138,398** — Line count corrected 145→142
9. **debug.md:362** — Path corrected to include `debugging/` subfolder for `universal_debugging_methodology.md`
10. **handover.md** — Removed references to non-existent Gates (0, 7) - now references AGENTS.md Section 2
11. **resume.md** — Removed references to non-existent Gates (0.5, 4) - now references Memory Context Loading
12. **implement.md:222,230** — Step count corrected 8→9
13. **complete.md** — Gate 4/5 references updated to "Memory Context Loading" / "Memory Save Rule"
14. **spec_kit_complete_*.yaml** — Gate 5 references updated to "Memory Save Rule Enforcement"
15. **spec_kit_debug_*.yaml** — Path corrected to include `debugging/` subfolder

---

### Verification

- All 44 JavaScript modules pass syntax check
- 25 bug fix tests pass, 0 failures
- Integration test passes (generate-context.js --help)
- All 3 repos (anobel.com, Public, Barter) verified in sync

**Full Changelog**: [v1.0.2.6...v1.0.2.7](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.6...v1.0.2.7)

---

## [**1.0.2.6**] - 2026-01-02

Major architectural refactoring release for the Spec Kit Memory system. The generate-context.js script undergoes complete modularization from a 4,800-line monolith to a 142-line CLI entry point with 30 focused modules across 6 directories. Includes comprehensive code style standardization, test reorganization, 20-agent documentation alignment scan, and cross-repo synchronization.

---

### New

1. **Modular Architecture** — `generate-context.js` reduced from 4,800 lines to 142-line CLI entry point (97% reduction)
2. **30 New Modules** across 6 directories:
   - `core/` (3 files): config.js · index.js · workflow.js (539 lines main orchestration)
   - `extractors/` (9 files): session · conversation · decision · diagram · file · implementation-guide extractors
   - `utils/` (10 files): data-validator · file-helpers · input-normalizer · logger · message-utils · path-utils · prompt-utils · tool-detection · validation-utils
   - `renderers/` (2 files): template-renderer · index.js
   - `spec-folder/` (4 files): alignment-validator · directory-setup · folder-detector · index.js
   - `loaders/` (2 files): data-loader · index.js
3. **INDEXING NOTE** section in AGENTS.md explaining MCP server database connection behavior
4. **INSTALL_GUIDE.md Symlinks** in `mcp_server/` folders for all 3 repos
5. **Complete A-to-Z Verification Suite** — File structure (34 files), syntax check, import/export verification, integration test

---

### Changed

1. **Test Scripts Reorganized** to `scripts/tests/` folder: `test-bug-fixes.js` · `test-embeddings-factory.js` · `test-validation.sh`
2. **31 JavaScript Files Standardized** with workflows-code style:
   - 3-line box-drawing headers (`// ───` format)
   - Numbered section headers (`/* ─── 1. SECTION ─── */`)
   - ~1,000 lines of JSDoc blocks and inline comments removed
3. **AGENTS.md EXECUTION Section** restructured with `[script]` placeholder pattern
4. **8 Documentation Files** updated with new test folder paths
5. **scripts-registry.json** paths updated for test file locations

---

### Fixed

1. **4 Failing Bug Tests** — Naming convention mismatches in test definitions
2. **AGENTS.md** — Missing full script path in MEMORY SAVE RULE execution examples
3. **mcp_server/README.md line 404** — Relative path → full path
4. **references/structure/folder_routing.md** — 5 short path references → full paths
5. **shared/embeddings/README.md** — Broken relative link `../../generate-context.js` → `../../scripts/generate-context.js`
6. **shared/embeddings/README.md** — Misleading label `lib/README.md` → `shared/README.md`
7. **test-bug-fixes.js** — ROOT path updated for new tests/ folder location

---

### Verification

- 27 bug fix tests: 25 passed, 0 failed, 2 intentionally skipped
- All 34 JavaScript files pass syntax check
- All module imports resolve correctly
- Integration test creates valid memory output file

**Full Changelog**: [v1.0.2.5...v1.0.2.6](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.5...v1.0.2.6)

---

## [**1.0.2.5**] - 2026-01-02

Security and documentation release fixing hardcoded API key exposure in `.utcp_config.json` and broken install script configuration. Adds comprehensive documentation for Narsil's three neural embedding backends (Voyage AI, OpenAI, Local ONNX) and HTTP server visualization setup.

---

### Security

1. **CWE-798 (Hardcoded Credentials)** — Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference loaded from `.env`

---

### Fixed

1. **Invalid Config** — `install-narsil.sh` generating invalid config with `_note`, `_neural_backends` fields that break Code Mode parsing
2. **Missing Flag** — Missing `--watch` flag in all recommended Narsil configurations

---

### Added

1. **Neural Backend Comparison** — Table showing all 3 options: Voyage AI (recommended) · OpenAI · Local ONNX
2. **Configuration Examples** — Separate examples for each neural backend in install guide
3. **HTTP Server Documentation** — Stdin pipe trick (`tail -f /dev/null |` to prevent EOF shutdown)
4. **Visualization Docs** — Symbol/Hybrid view parameter requirements (`root`, `repo`)

---

### Changed

1. All Narsil config examples now include `--watch` flag for auto-reindexing
2. API key references changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax
3. Install script help text expanded with Neural Search Backends section

**Full Changelog**: [v1.0.2.4...v1.0.2.5](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.4...v1.0.2.5)

---

## [**1.0.2.4**] - 2026-01-01

Major infrastructure release with critical bug fixes, security hardening, MCP install automation, and comprehensive codebase standardization across 70+ files. Adds sub-agent delegation for token efficiency and universal stack-agnostic debugging.

---

### Fixed

**Critical**

1. **SQLite Transaction Nesting** — Error in `memory_index_scan` - `indexMemory()` now uses composable `database.transaction()` wrapper
2. **Race Condition** — Database changes weren't visible across MCP/script connections - added file-based notification with `reinitializeDatabase()`
3. **Orphaned Metadata** — Failed vector insertions leaving orphaned metadata - explicit transaction control with rollback

**High**

4. **Wrong Dimensions** — Schema created with wrong embedding dimensions before provider warmup - `getConfirmedEmbeddingDimension()` with polling
5. **Cache Invalidation** — Constitutional cache didn't invalidate on external database edits - mtime tracking added
6. **Rate Limiting** — State lost on server restart - persistent `config` table in SQLite
7. **Stale Statements** — Stale prepared statements after database reset - `clearPreparedStatements()` in reset paths
8. Query validation for whitespace-only/empty/null inputs
9. UTF-8 BOM (EF BB BF) detection in memory parser
10. Cache key collision risk - SHA256 hash-based keys
11. Non-interactive mode silently using defaults - now fails with guidance
12. Orphaned vectors never auto-cleaned - `verifyIntegrity({ autoClean: true })`

---

### Security

1. **CWE-22** — Path traversal protection in CLI `CONFIG.DATA_FILE` and DB-stored paths
2. **CWE-400** — Input length limits for MCP tool parameters (query 10K, title 500, paths 500 chars)
3. MEDIUM severity issues reduced from 4 to 1

---

### Added

1. **MCP Install Scripts Suite** — Shell-based installers for all 6 MCP servers with shared utilities library (33 functions)
2. **Sub-agent Delegation** — `/spec_kit:handover` and `/memory:save` now delegate heavy work to sub-agents for token efficiency
3. **Session Behavior Modes** — `--brief`, `--verbose`, `--debug` flags for controlling response verbosity
4. **Universal Debugging** — Stack-agnostic 4-phase approach (Observe → Analyze → Hypothesize → Fix) with new reference doc
5. **Auto/Confirm Modes** — 6 `/create` commands now support `:auto` and `:confirm` mode flags
6. **Research Chaining** — `/spec_kit:complete` supports `:with-research` and `:auto-debug` flags
7. Configurable scoring weights for smart ranking (`smartRanking.recencyWeight`)
8. Configurable trigger phrase limit via `maxTriggersPerMemory`
9. Plain-language gates (~50+ "STOP HERE - Wait for X" markers) in 16 command files
10. "What Next?" navigation tables in 14 commands
11. Confidence checkpoints in 9 YAML workflow files

---

### Changed

1. **References Reorganized** — 18 files moved from flat structure into 7 logical sub-folders (`config/`, `debugging/`, `memory/`, `structure/`, `templates/`, `validation/`, `workflows/`)
2. **79 Internal Links Fixed** across reference documentation
3. **Lib Consolidation** — Shared modules centralized in `lib/` folder with re-export wrappers
4. **Asset Template Alignment** — 9 asset files standardized across 6 skill folders
5. **workflows-code Skill** — Priority-based resource loading (P1/P2/P3), references reorganized into 5 sub-folders
6. **Code Style Alignment** — 70 files standardized with snake_case naming, 3-line box-drawing headers, ~3,900 lines metadata removed
7. `/spec_kit:debug` made stack-agnostic - removed frontend-specific tool references
8. `implementation-summary.md` now required for all spec levels
9. Template priority standardized to P0/P1/P2 only

**Full Changelog**: [v1.0.2.3...v1.0.2.4](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.3...v1.0.2.4)

---

## [**1.0.2.3**] - 2025-12-31

Comprehensive Spec Kit & Memory system audit with test suite fixes, documentation improvements, and new Script Registry for dynamic script discovery.

---

### Fixed

1. **Test Fixtures Renamed** — 51 fixtures updated to follow `###-short-name` naming convention
2. **Template Marker** — Added `SPECKIT_TEMPLATE_SOURCE` marker to all test fixture frontmatter
3. **Validation Rule** — FRONTMATTER_VALID rule now skips template marker check for test-fixtures/ directory
4. **Test References** — Updated test-validation.sh references to match renamed fixtures
5. **Test Suite** — All 55 validation tests now pass (previously 90%+ failed)

---

### Added

1. **Script Registry** — `scripts-registry.json` - Centralized JSON config for all 14 scripts and 9 rules
2. **Registry Loader** — `registry-loader.sh` - CLI tool to query script registry
3. **Test Fixtures** — 41 new fixtures for comprehensive edge case coverage
4. **Documentation** — `memory_search` query/concepts requirement (E040 error prevention)
5. **Documentation** — Indexing persistence gap between script and MCP server

---

### Changed

1. `memory_search` documentation clarified: `query` OR `concepts` parameter is REQUIRED
2. `check-frontmatter.sh` now supports `SKIP_TEMPLATE_CHECK=1` environment variable
3. Updated AGENTS.md, SKILL.md, and memory_system.md with parameter requirements

---

### Removed

1. Deprecated `mcp_server/INSTALL_GUIDE.md` (duplicate of install_guides/MCP/MCP - Spec Kit Memory.md)

**Full Changelog**: [v1.0.2.2...v1.0.2.3](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.2...v1.0.2.3)

---

## [**1.0.2.2**] - 2025-12-31

Security patch fixing HIGH severity DoS vulnerability in `qs` dependency. Documentation updated with complete MCP tool reference for resume command.

---

### Security

1. **HIGH (CVE-2025-15284)** — Fixed DoS vulnerability in `qs` query string parser (6.14.0 → 6.14.1) - `arrayLimit` bypass via bracket notation allowed memory exhaustion. Transitive through `express@5.2.1`.

---

### Changed

1. **resume.md Command** — Added 8 missing MCP tools to Section 6 (MCP Tool Usage):
   - Memory tools: `memory_delete`, `memory_update`, `memory_validate`, `memory_index_scan`, `memory_health`
   - Checkpoint tools: `checkpoint_create`, `checkpoint_list`, `checkpoint_delete`
2. Added example invocations for all new MCP tools

**Full Changelog**: [v1.0.2.1...v1.0.2.2](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.1...v1.0.2.2)

---

## [**1.0.2.1**] - 2025-12-31

Comprehensive system hardening release with critical bug fixes, security improvements, and performance optimizations for the Spec Kit Memory system.

---

### Fixed

**Critical**

1. **Embedding Dimension Mismatch** — Checkpoints now use dynamic dimension detection instead of hardcoded 768, fixing failures with Voyage (1024) and OpenAI (1536) providers
2. **Dimension Detection** — `getEmbeddingDimension()` now correctly detects dimension from provider, environment variables, or API keys before falling back to default

**High**

3. Memory indexing failures caused by dimension validation mismatches
4. Empty catch blocks that silently swallowed errors (2 fixed with proper logging)
5. Blocking file I/O replaced with async `fs.promises.readFile`
6. Stale documentation references to deleted files
7. Architecture diagram showing incorrect folder paths
8. Version inconsistencies in context-server.js (now 16.0.0)

---

### Added

1. **Embedding Cache** — LRU cache (1000 entries) reduces redundant API calls
2. **Shared Utilities** — `shared/utils.js` consolidated `validateFilePath` and `escapeRegex` utilities
3. **Parallel Embeddings** — 3-5x faster with configurable concurrency (default: 5)
4. **Test Fixtures** — 37 files across 10 folders for validation testing
5. **Unicode Normalization** — Improved trigger phrase matching
6. **Constitutional Scanning** — Auto-scanning in `memory_index_scan`
7. **Dry Run** — `dryRun` parameter for `memory_delete` to preview before executing
8. **New Validation Scripts** — `check-folder-naming.sh`, `check-frontmatter.sh`
9. **Help Flag** — `--help` flag for `generate-context.js`
10. **Tool Documentation** — 8 missing MCP tools documented in SKILL.md (now 14 total)

---

### Changed

1. **Lib Consolidation** — Shared modules moved to `shared/` folder with re-export wrappers for backward compatibility
2. All hardcoded paths now use environment variables for portability
3. Deprecated JS validators removed (bash validators preferred)
4. Template metadata formats standardized

---

### Security

1. **CWE-22** — Added path validation to CLI `CONFIG.DATA_FILE`
2. **CWE-22** — Added `validateFilePath()` checks for DB-stored paths
3. **CWE-400** — Added input length limits to MCP handler parameters
4. Removed personal path references from public release
5. Fixed symlinks pointing to personal directories

**Full Changelog**: [v1.0.2.0...v1.0.2.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.0...v1.0.2.1)

---

## [**1.0.2.0**] - 2025-12-30

Technical debt remediation for Spec Kit Memory system with 6 infrastructure improvements. Comprehensive skill audit standardizing documentation across 7 skills. New mcp-figma skill added for design-to-code workflows.

---

### Added

1. **mcp-figma Skill** — 18 tools for Figma integration
2. **Debug Command Assets** — `/spec_kit:debug` with auto and confirm modes
3. **Test Fixtures** — 37 files across 10 folders for validation scripts

---

### Changed

1. Standardized RELATED RESOURCES section across all SKILL.md files
2. Section reordering and content cleanup in multiple skills

---

### Fixed

1. Unicode normalization for international trigger phrase matching
2. Constitutional directory auto-scanning with `includeConstitutional` parameter
3. Portable paths via environment variables
4. Deprecated JS validators removed
5. `memory_delete` now supports `dryRun: true` for safe preview

**Full Changelog**: [v1.0.1.7...v1.0.2.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.7...v1.0.2.0)

---

## [**1.0.1.7**] - 2025-12-30

Enhanced install guides with comprehensive H1 descriptions for all MCP servers. Added new `/create:agent` command.

---

### Added

1. **Create Agent Command** — `/create:agent` with 5-phase workflow for agent creation
2. **Agent Template** — `agent_template.md` for consistent agent structure

---

### Changed

1. All MCP install guides now include detailed H1 descriptions
2. `command_template.md` reduced 27% by removing duplication

**Full Changelog**: [v1.0.1.6...v1.0.1.7](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.6...v1.0.1.7)

---

## [**1.0.1.6**] - 2025-12-30

Fixes critical Narsil MCP parameter naming issues across all 39 high-priority tools. Adds HTTP server scripts for reliable search functionality.

---

### Added

1. **Server Script** — `narsil-server.sh` for HTTP server management
2. **Search Wrapper** — `narsil-search.sh` CLI wrapper for reliable search
3. **Index Documentation** — Index dependency documentation

---

### Breaking

Parameter names changed in all Narsil tools:
- `kind` → `symbol_type` in symbol queries
- `name` → `symbol` in definition lookups
- `function_name` → `function` in call graph tools
- Added `repo: "unknown"` requirement for all tools

**Full Changelog**: [v1.0.1.5...v1.0.1.6](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.5...v1.0.1.6)

---

## [**1.0.1.5**] - 2025-12-29

Documents JavaScript-specific Narsil limitations discovered during testing.

---

### Known Issues

1. Call graph empty for JavaScript (tree-sitter limitation)
2. Security scan limited (backend-focused rules)
3. Neural search stale after index clear

---

### Working

1. `find_symbols` for symbol discovery
2. `get_symbol_definition` for definitions
3. `get_file` for file content
4. Git integration features

**Full Changelog**: [v1.0.1.4...v1.0.1.5](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.4...v1.0.1.5)

---

## [**1.0.1.4**] - 2025-12-29

Documents discovered Narsil bugs and limitations with workarounds.

---

### Added

1. **Skill Creation Guide** — Required templates and file locations
2. **Skill Advisor Config** — Documentation (Section 12)

---

### Known Issues

1. Persistence bug: indexes regenerate ~45-60s on startup
2. Unicode bug: box-drawing characters crash chunking

**Full Changelog**: [v1.0.1.3...v1.0.1.4](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.3...v1.0.1.4)

---

## [**1.0.1.3**] - 2025-12-29

Documents Narsil's HTTP server and React frontend for interactive code graph visualization.

---

### Added

1. **HTTP Backend** — Server (port 3000) for graph data
2. **React Frontend** — Interactive visualization (port 5173)
3. **Graph Views** — Five types: `import` · `call` · `symbol` · `hybrid` · `flow`

---

### Fixed

1. Tool names corrected in documentation
2. Language count: 16 → 15

**Full Changelog**: [v1.0.1.2...v1.0.1.3](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.2...v1.0.1.3)

---

## [**1.0.1.2**] - 2025-12-29

Adds project-local Narsil index support for isolated per-project indexing.

---

### Added

1. **Project-Local Index** — `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
2. **Persist Flag** — `--persist` for index persistence
3. **Custom Path** — `--index-path` option for custom index location
4. **Manual Save** — `save_index` tool for manual saves
5. **HTTP Server Mode** — Documentation

**Full Changelog**: [v1.0.1.1...v1.0.1.2](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.1...v1.0.1.2)

---

## [**1.0.1.1**] - 2025-12-29

Fixes Narsil neural search configuration for embedding dimension compatibility.

---

### Fixed

1. **Embedding Model** — `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions
2. **Frontmatter** — Invalid frontmatter in search commands

**Full Changelog**: [v1.0.1.0...v1.0.1.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.0...v1.0.1.1)

---

## [**1.0.1.0**] - 2025-12-29

Complete migration from LEANN to Narsil for unified code intelligence. Adds 76 specialized tools covering semantic search, security scanning, and call graph analysis.

---

### Breaking

1. LEANN completely removed
2. `leann_leann_search()` → `narsil.narsil_neural_search()`
3. LEANN MCP → Narsil (via Code Mode)
4. `mcp-leann` skill → `mcp-narsil` skill
5. MLX embeddings → Voyage/OpenAI/ONNX backends
6. Skills reduced from 8 to 7

**Full Changelog**: [v1.0.0.8...v1.0.1.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.8...v1.0.1.0)

---

## [**1.0.0.8**] - 2025-12-29

Consolidates embedding options to MLX + Qwen3 as the single path.

---

### Changed

1. LEANN for code search (`src/` directories)
2. Spec Kit Memory for document search (`specs/`, `.opencode/`)
3. Removed Voyage, Gemini, and Contriever embedding options

**Full Changelog**: [v1.0.0.7...v1.0.0.8](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.7...v1.0.0.8)

---

## [**1.0.0.7**] - 2025-12-29

Major semantic search upgrade with Qwen3 embedding model.

---

### Added

1. **Qwen3 Embeddings** — `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` with 4-bit quantization
2. **Progressive Indexing** — Progressive scope indexing for large projects

---

### Changed

1. AGENTS.md made frontend/backend agnostic

**Full Changelog**: [v1.0.0.6...v1.0.0.7](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.6...v1.0.0.7)

---

## [**1.0.0.6**] - 2025-12-29

Strengthens write agent enforcement for /create commands.

---

### Added

1. HARD BLOCK section for write agent enforcement
2. Prompt prefix requirement
3. Prerequisite check validation
4. Validation command for skill creation

**Full Changelog**: [v1.0.0.5...v1.0.0.6](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.5...v1.0.0.6)

---

## [**1.0.0.5**] - 2025-12-29

Enforces @write agent for skill creation with multi-layer enforcement.

---

### Added

1. Skill creation requires `@write` agent prefix
2. HARD BLOCK enforcement for write agent
3. Prompt prefix and prerequisite checks

---

### Changed

1. Quick Reference updated with CDN deployment workflow
2. Quick Reference updated with JS minification workflow
3. Narsil added to Code Mode examples

**Full Changelog**: [v1.0.0.4...v1.0.0.5](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.4...v1.0.0.5)

---

## [**1.0.0.4**] - 2025-12-29

Complete skill system overhaul standardizing 69 reference/asset files across all 8 skills.

---

### Added

1. `execution_methods` reference
2. `folder_structure` reference
3. `environment_variables` reference
4. `memory_system` reference
5. `cdn_deployment` reference
6. `minification_guide` reference

---

### Changed

1. Standardized structure for all 8 skills (69 files total)
2. SKILL.md reduced 24% through better organization

---

### Fixed

1. Hardcoded paths throughout skills
2. Broken anchor links

**Full Changelog**: [v1.0.0.3...v1.0.0.4](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.3...v1.0.0.4)

---

## [**1.0.0.3**] - 2025-12-29

Constitutional memory system improvements with 4x token budget increase.

---

### Added

1. Constitutional README documentation
2. `cleanup-orphaned-vectors.js` utility
3. New triggers: `build`, `generate`, `configure`, `analyze`

---

### Changed

1. Token budget increased from ~500 to ~2000 tokens (~8000 characters)
2. Gate enforcement restructured with First Message Protocol [HARD BLOCK]
3. 4-step Violation Recovery process
4. 5 ANCHOR sections for memory format

**Full Changelog**: [v1.0.0.2...v1.0.0.3](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.2...v1.0.0.3)

---

## [**1.0.0.2**] - 2025-12-29

Continued post-release refinement with 80+ bug fixes.

---

### Fixed

1. Duplicate entries in checkpoints
2. Orphaned file detection
3. Broken skill references
4. Gate numbering inconsistencies
5. Hardcoded paths throughout
6. Transaction safety issues
7. Missing validators added
8. Anchor links fixed
9. Embedding rollback support
10. Index migration handling
11. Cascade delete for orphans

---

### Changed

1. AGENTS.md made fully universal (no project-specific patterns)
2. Symlinks converted to relative paths

**Full Changelog**: [v1.0.0.1...v1.0.0.2](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.1...v1.0.0.2)

---

## [**1.0.0.1**] - 2025-12-29

First post-release refinement focusing on structural reorganization and critical bug fixes.

---

### Changed

1. Skills, commands, guides, scripts, and agents moved to `.opencode/` folder
2. AGENTS.md made fully codebase-agnostic

---

### Fixed

1. **P0**: Duplicate checkpoint entries
2. **P0**: Orphaned file detection
3. **P0**: Broken skill references
4. **P0**: Gate numbering issues
5. **P0**: Hardcoded paths
6. **P0**: Transaction safety
7. **P1**: Missing validators
8. **P1**: Embedding rollback
9. **P1**: LEANN naming consistency
10. **P1**: Error codes standardized

**Full Changelog**: [v1.0.0.0...v1.0.0.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.0...v1.0.0.1)

---

## [**1.0.0.0**] - 2025-12-29

First official release of the OpenCode Dev Environment.

---

### Added

1. **Spec Kit** — Unified documentation system with automation, slash commands, integrated semantic memory, and sub-folder versioning
2. **Skills Framework** — 8 domain-specific skills that auto-load based on task
3. **Semantic Memory** — Custom MCP server with hybrid search (vector + FTS5), 6 importance tiers, and proactive context surfacing
4. **Gate Enforcement** — Mandatory gates verify completion and enforce documentation
5. **Memory Integration** — Memory files live inside spec folders with deep integration
6. **Templates** — 10 purpose-built templates
7. **Slash Commands** — 7 commands with `:auto`/`:confirm` modes
8. **Automation Scripts** — 11 scripts
9. **Completeness Scoring** — 0-100% scoring

---

### Features

1. Persistent memory across sessions, models, projects
2. Gate 3 enforces spec folders on every change
3. ADRs in decision-record.md, searchable forever
4. `/spec_kit:handover` produces 15-line summary
5. `/spec_kit:debug` spawns sub-agent with full context
6. Semantic search by meaning, not text
7. <50ms proactive surfacing before you ask
8. Checkpoints = undo button for your index
