# Changelog

All notable changes to the **system-spec-kit** skill are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)
---

## [**1.0.3.0**] - 2026-01-04

Adds support for alternative specs folder location inside `.opencode/`. Memory files and spec folders can now be stored in either `specs/` (project root) or `.opencode/specs/` for projects that prefer keeping all OpenCode files in a hidden directory.

---

**New Feature**

- `specs/` OR `.opencode/specs/`: Both locations now supported for spec folders and memory files
- Project root location takes precedence if both exist

---

**File Updates (10 files)**

- `context-server.js`: Path validation updated for dual locations
- `memory-parser.js`: Scans both `specs/` and `.opencode/specs/` directories
- `generate-context.js`: Supports spec folder in either location
- `config.js`: Updated path configuration
- `workflow.js`: Dual location awareness
- `collect-session-data.js`: Updated data collection paths
- `directory-setup.js`: Creates folders in correct location
- `folder-detector.js`: Detects specs in both locations
- `MCP - Spec Kit Memory.md`: Documentation updated with examples

---

**Fixes**

- Cross-repo symlink: `INSTALL_GUIDE.md` now points locally instead of to external project

---

**Upgrade**

No action required. Existing `specs/` folders continue to work unchanged.

---

## [**1.0.2.9**] - 2026-01-02

Fixes critical MCP server bugs preventing Spec Kit Memory operations. Multiple import naming mismatches caused E040 errors (`is not a function`) across `memory_health`, `memory_index_scan`, and `memory_save` tools.

#### Fixed
- **Critical**: `getDatabasePath` → `get_database_path` method name mismatch
- **Critical**: `validateFilePath` → `validate_file_path` import mismatch
- **Critical**: `isTransientError` / `userFriendlyError` → `is_transient_error` / `user_friendly_error` import mismatch
- **Critical**: `escapeRegex` → `escape_regex` import mismatch

#### Root Cause
During snake_case refactoring, exports in source modules were renamed but imports retained camelCase names. Fixed using import aliasing.

---

## [**1.0.2.7**] - 2026-01-02

Addresses critical runtime errors and documentation misalignments in spec-kit components.

#### Critical Fixes
- `workflow.js:19`: Added missing `collectSessionData` import
- `workflow.js:63`: Empty catch block now logs errors instead of silently swallowing
- `input-normalizer.js`: Fixed self-contradicting default descriptions

#### Documentation Fixes
- `mcp_server/README.md`: Tool count corrected 13→14
- `SKILL.md`: Module count corrected 30→44, directory count 6→10
- `scripts/README.md`: Line count corrected 145→142
- Command files updated: `debug.md`, `handover.md`, `resume.md`, `implement.md`, `complete.md`
- YAML workflow files: Gate references updated

#### Verification
- All 44 JavaScript modules pass syntax check
- 25 bug fix tests pass

---

## [**1.0.2.6**] - 2026-01-02

Major architectural refactoring release. The generate-context.js script undergoes complete modularization from a 4,800-line monolith to a 142-line CLI entry point with 30 focused modules.

#### Architecture
- **generate-context.js modularization**: 4,800-line monolith → 142-line CLI entry point (97% reduction)
- 30 new modules created across 6 directories:
  - `core/` (3 files): config.js · index.js · workflow.js
  - `extractors/` (9 files): session · conversation · decision · diagram · file · implementation-guide extractors
  - `utils/` (10 files): data-validator · file-helpers · input-normalizer · logger · message-utils · path-utils · prompt-utils · tool-detection · validation-utils
  - `renderers/` (2 files): template-renderer · index.js
  - `spec-folder/` (4 files): alignment-validator · directory-setup · folder-detector · index.js
  - `loaders/` (2 files): data-loader · index.js

#### Changed
- Test scripts reorganized to `scripts/tests/` folder
- 31 JavaScript files standardized with consistent code style

#### Fixed
- 4 failing bug tests
- Broken relative links in documentation
- Test path references updated

#### Added
- `INSTALL_GUIDE.md` symlinks in `mcp_server/` folder
- Complete A-to-Z verification suite

---

## [**1.0.2.4**] - 2026-01-01

Major infrastructure release with critical bug fixes, security hardening, and MCP install automation.

#### Fixed
- **Critical**: SQLite transaction nesting error in `memory_index_scan`
- **Critical**: Race condition where database changes weren't visible across MCP/script connections
- **Critical**: Failed vector insertions leaving orphaned metadata
- **High**: Schema created with wrong embedding dimensions before provider warmup
- **High**: Constitutional cache didn't invalidate on external database edits
- **High**: Rate limiting state lost on server restart
- **High**: Stale prepared statements after database reset
- Query validation for whitespace-only/empty/null inputs
- UTF-8 BOM detection in memory parser
- Cache key collision risk - SHA256 hash-based keys
- Orphaned vectors never auto-cleaned

#### Security
- **CWE-22**: Path traversal protection in CLI and DB-stored paths
- **CWE-400**: Input length limits for MCP tool parameters

#### Added
- **MCP Install Scripts Suite**: Shell-based installers with shared utilities library
- **Sub-agent delegation**: `/spec_kit:handover` and `/memory:save` delegate heavy work to sub-agents
- **Session behavior modes**: `--brief`, `--verbose`, `--debug` flags
- Configurable scoring weights for smart ranking
- Configurable trigger phrase limit via `maxTriggersPerMemory`
- Plain-language gates in command files
- "What Next?" navigation tables in commands

#### Changed
- **References reorganized**: 18 files moved into 7 logical sub-folders
- **79 internal links fixed** across reference documentation
- **Lib consolidation**: Shared modules centralized in `lib/` folder
- `implementation-summary.md` now required for all spec levels

---

## [**1.0.2.3**] - 2025-12-31

Comprehensive Spec Kit & Memory system audit with test suite fixes and new Script Registry.

#### Fixed
- Test fixtures renamed to follow `###-short-name` naming convention (51 fixtures)
- Added `SPECKIT_TEMPLATE_SOURCE` marker to all test fixture frontmatter
- FRONTMATTER_VALID rule now skips template marker check for test-fixtures/
- All 55 validation tests now pass

#### Added
- Script Registry (`scripts-registry.json`) - Centralized config for 14 scripts and 9 rules
- Registry Loader (`registry-loader.sh`) - CLI tool to query script registry
- 41 new test fixtures for edge case coverage
- Documentation for `memory_search` query/concepts requirement

#### Changed
- `memory_search` documentation clarified: `query` OR `concepts` parameter is REQUIRED

---

## [**1.0.2.2**] - 2025-12-31

Security patch fixing HIGH severity DoS vulnerability in `qs` dependency.

#### Security
- **HIGH (CVE-2025-15284)**: Fixed DoS vulnerability in `qs` query string parser (6.14.0 → 6.14.1)

#### Changed
- `resume.md` command: Added 8 missing MCP tools to Section 6

---

## [**1.0.2.1**] - 2025-12-31

Comprehensive system hardening with critical bug fixes, security improvements, and performance optimizations.

#### Fixed
- **Critical**: Embedding dimension mismatch - checkpoints now use dynamic dimension detection
- **Critical**: `getEmbeddingDimension()` now correctly detects dimension from provider
- **High**: Memory indexing failures caused by dimension validation mismatches
- Empty catch blocks fixed with proper logging
- Blocking file I/O replaced with async operations
- Version inconsistencies in context-server.js (now 16.0.0)

#### Added
- **Embedding cache**: LRU cache (1000 entries) reduces redundant API calls
- **shared/utils.js**: Consolidated `validateFilePath` and `escapeRegex` utilities
- **Parallel batch embeddings**: 3-5x faster with configurable concurrency
- Test fixtures (37 files across 10 folders)
- Unicode normalization for trigger phrase matching
- Constitutional directory auto-scanning in `memory_index_scan`
- `dryRun` parameter for `memory_delete`
- New validation scripts: `check-folder-naming.sh`, `check-frontmatter.sh`
- `--help` flag for `generate-context.js`
- 8 missing MCP tools documented in SKILL.md (now 14 total)

#### Changed
- Shared modules moved to `shared/` folder with re-export wrappers
- All hardcoded paths now use environment variables
- Deprecated JS validators removed

#### Security
- **CWE-22**: Added path validation to CLI and DB-stored paths
- **CWE-400**: Added input length limits to MCP handler parameters

---

## [**1.0.2.0**] - 2025-12-30

Technical debt remediation for Spec Kit Memory system.

#### Added
- `/spec_kit:debug` command assets with auto and confirm modes
- Test fixtures for validation scripts (37 files across 10 folders)

#### Fixed
- Unicode normalization for international trigger phrase matching
- Constitutional directory auto-scanning with `includeConstitutional` parameter
- Portable paths via environment variables
- `memory_delete` now supports `dryRun: true` for safe preview

---

## [**1.0.0.3**] - 2025-12-29

Constitutional memory system improvements with 4x token budget increase.

#### Added
- Constitutional README documentation
- `cleanup-orphaned-vectors.js` utility
- New triggers: `build`, `generate`, `configure`, `analyze`

#### Changed
- Token budget increased from ~500 to ~2000 tokens (~8000 characters)
- Gate enforcement restructured with First Message Protocol
- 4-step Violation Recovery process
- 5 ANCHOR sections for memory format

---

## [**1.0.0.2**] - 2025-12-29

Post-release refinement with 80+ bug fixes.

#### Fixed
- Duplicate entries in checkpoints
- Orphaned file detection
- Gate numbering inconsistencies
- Hardcoded paths throughout
- Transaction safety issues
- Missing validators added
- Anchor links fixed
- Embedding rollback support
- Index migration handling
- Cascade delete for orphans

#### Changed
- Symlinks converted to relative paths

---

## [**1.0.0.1**] - 2025-12-29

First post-release refinement focusing on structural reorganization.

#### Changed
- Skills, commands, guides, scripts moved to `.opencode/` folder

#### Fixed
- P0: Duplicate checkpoint entries
- P0: Orphaned file detection
- P0: Gate numbering issues
- P0: Hardcoded paths
- P0: Transaction safety
- P1: Missing validators
- P1: Embedding rollback
- P1: Error codes standardized

---

## [**1.0.0.0**] - 2025-12-29

First official release of the Spec Kit Memory system.

#### Added
- **Spec Kit**: Unified documentation system with automation, slash commands, integrated semantic memory, and sub-folder versioning
- **Semantic Memory**: Custom MCP server with hybrid search (vector + FTS5), 6 importance tiers, and proactive context surfacing
- **Gate Enforcement**: Mandatory gates verify completion and enforce documentation
- **Memory Integration**: Memory files live inside spec folders with deep integration
- 10 purpose-built templates
- 7 slash commands with `:auto`/`:confirm` modes
- 11 automation scripts
- Completeness scoring (0-100%)

#### Features
- Persistent memory across sessions, models, projects
- Gate 3 enforces spec folders on every change
- ADRs in decision-record.md, searchable forever
- `/spec_kit:handover` produces 15-line summary
- `/spec_kit:debug` spawns sub-agent with full context
- Semantic search by meaning, not text
- <50ms proactive surfacing before you ask
- Checkpoints = undo button for your index
