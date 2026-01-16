# Changelog

All notable changes to the system-spec-kit skill will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [1.7.2] - 2026-01-16

*Environment version: 1.0.4.1*

Bug fix for constitutional README indexing issue.

### Fixed

- Constitutional indexer now skips `README.md` files (case-insensitive) in `find_constitutional_files()` to prevent documentation from being indexed as memories
- `is_memory_file()` validator now excludes README.md files from constitutional directories during `memory_save` operations

## [1.8.0] - 2026-01-15

*Environment version: 1.0.4.0*

Major quality and architecture release with 231 bug fixes, anchor-based retrieval, modular server architecture, and Voyage 4 support.

### New

- **Anchor System (SK-005)** — `memory_search` now accepts `anchors` parameter for targeted section retrieval
  - Token savings: 73% (summary-only), 87% (decisions-only), 61% (summary+decisions)
  - Response includes `tokenMetrics` with `actualTokens`, `fullFileTokens`, `savingsPercent`
  - Anchor format: `<!-- ANCHOR:id -->...<!-- /ANCHOR:id -->`
- **Voyage 4 Embedding Support** — Added `voyage-4`, `voyage-4-large`, `voyage-4-lite` models
  - Automatic database separation per model (no data loss on upgrade)
  - Shared embedding space enables asymmetric retrieval

### Changed

- **Modular Architecture** — Decomposed `context-server.js` from 2,703 to 319 lines (88% reduction)
  - 19 new modules across 5 directories: `core/`, `handlers/`, `formatters/`, `utils/`, `hooks/`
  - All modules under 300 lines for AI-editable size
- **Default Embedding Model** — Changed from `voyage-3.5` to `voyage-4`
- **Documentation Accuracy** — Corrected ANCHOR token savings claims; standardized debug threshold to "3+"

### Fixed

- **Critical: Missing `await` on formatSearchResults()** — Lines 1085, 1140, 1161 returning Promise objects
- **Critical: E429 Error Code** — Now defined in `errors.js` and documented
- **Critical: Batch API Rate Limiting** — Added `BATCH_DELAY_MS` (100ms default)
- **Critical: vec_memories Cleanup** — Fixed deletion order preventing orphaned rows
- **Race Conditions** — Mutex for warmup; cache clearing on reinitialize; trigger invalidation
- **Memory Leaks** — LRU cache for regex; timer cleanup in with_timeout
- **Null Safety** — Null checks on database query results throughout codebase
- **Cross-Platform** — `os.homedir()` and `os.tmpdir()` replacing hardcoded paths
- **Config Cleanup** — Deleted unused `config-loader.js`; reduced `search-weights.json`
- **parseInt Radix** — Added `, 10` to all parseInt calls
- Plus 200+ additional fixes across templates, commands, references, and documentation

## [1.7.1] - 2026-01-15

*Environment version: 1.0.3.6*

Cognitive Memory v1.7.1 with comprehensive bug fixes and MCP protocol fix.

### Fixed

- **Critical (MCP Protocol)**: Changed `console.log` → `console.error` in embeddings to prevent JSON-RPC corruption
  - `embeddings.js:282`, `factory.js:58`, `factory.js:110`
- `attention-decay.js`: Column name mismatch (`last_session_access`) causing session tracking failures
- `checkpoints.js`: Added backup-before-delete to prevent data loss on restore failures
- `attention-decay.js`: Decay rates returning 1.0 for inactive sessions (should apply decay)
- `checkpoints.js`: Graceful skip for orphaned checkpoint entries without corresponding memories
- `attention-decay.js`: NaN/Infinity validation guards in all decay calculation paths
- `tier-classifier.js`: Added `parse_threshold` helper for safe tier threshold config parsing
- `co-activation.js`: Replaced `console.log` with `console.error` for proper error logging
- `co-activation.js`: Added missing `classifyTier` import fixing undefined function errors
- `context-server.js`: Null/array check before spread in status endpoint response
- `co-activation.js`: Circular reference prevention in co-activation graph traversal
- `tier-classifier.js`: HOT threshold > WARM threshold validation to prevent tier inversion
- `working-memory.js`: Replaced `console.log` with `console.error` for error conditions
- `flushAccessCounts` → `flush_access_counts` (snake_case alignment)

### Added

- 226 comprehensive tests for cognitive memory modules
- 5 cognitive memory modules: attention-decay, co-activation, tier-classifier, working-memory, summary-generator

## [1.7.0] - 2026-01-14

*Environment version: 1.0.3.4*

Major release introducing Cognitive Memory system with session-aware features.

### Added

- **Turn-Based Attention Decay** — Memories fade naturally over conversation turns unless re-activated
- **Tiered Content Delivery** — HOT (≥0.8): full content, WARM (0.25-0.79): summaries only, COLD (<0.25): excluded
- **Co-Activation** — Related memories get boosted (+0.35) when primary memory activates
- **Session-Based Working Memory** — Each conversation maintains independent attention state

### Changed

- All package versions updated to 1.7.0

## [1.6.0] - 2026-01-02

*Environment version: 1.0.2.6*

Major architecture refactoring release.

### Changed

- **generate-context.js modularization**: 4,800-line monolith → 142-line CLI entry point (97% reduction)
- 30 new modules created across 6 directories (core, extractors, utils, renderers, spec-folder, loaders)
- Test scripts reorganized to `scripts/tests/` folder
- 31 JavaScript files standardized with workflows-code style

### Fixed

- 4 failing bug tests (naming convention mismatches)
- Missing `collectSessionData` import in workflow.js
- Empty catch blocks now log errors instead of silently swallowing

## [1.5.0] - 2026-01-01

*Environment version: 1.0.2.4*

Infrastructure release with critical bug fixes and security hardening.

### Fixed

- **Critical**: SQLite transaction nesting error in `memory_index_scan`
- **Critical**: Race condition with database visibility across MCP/script connections
- **Critical**: Failed vector insertions leaving orphaned metadata
- **High**: Schema created with wrong embedding dimensions before provider warmup
- **High**: Constitutional cache invalidation on external database edits

### Added

- MCP Install Scripts Suite with shared utilities library
- Sub-agent delegation for `/spec_kit:handover` and `/memory:save`
- Session behavior modes: `--brief`, `--verbose`, `--debug`
- Universal debugging methodology reference

### Security

- **CWE-22**: Path traversal protection in CLI and DB-stored paths
- **CWE-400**: Input length limits for MCP tool parameters

## [1.4.0] - 2025-12-30

*Environment version: 1.0.2.0*

### Added

- Constitutional memory system with 6 importance tiers
- `memory_validate` tool for feedback tracking
- Unicode normalization for trigger phrase matching

### Fixed

- Embedding dimension mismatch with Voyage/OpenAI providers
- Empty catch blocks replaced with proper logging

## [1.3.0] - 2025-12-29

*Environment version: 1.0.0.0*

Initial release of Spec Kit Memory system.

### Added

- Custom MCP server with hybrid search (vector + FTS5)
- 14 MCP tools for memory management
- Checkpoint system for state management
- 7 slash commands with `:auto`/`:confirm` modes
- 10 purpose-built templates
- Completeness scoring (0-100%)
