# Changelog
j
All notable changes to the system-spec-kit skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

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
