# Changelog

All notable changes to the OpenCode Dev Environment are documented in this file.
Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

> The format is based on [Keep a Changelog](https://keepachangelog.com/)

---

## [**1.0.4.1**] - 2026-01-16

Fixes a bug where README.md files in the constitutional directory were incorrectly indexed as memories. The documentation file's example YAML frontmatter was parsed as real metadata, creating ghost memory entries.

---

**Fixed**
1. Constitutional indexer now skips `README.md` files (case-insensitive) in `find_constitutional_files()` to prevent documentation from being indexed as memories.
2. `is_memory_file()` validator now excludes README.md files from constitutional directories during `memory_save` operations.

---

**Upgrade**
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
1. **Restart Required**: Restart OpenCode to load the updated Spec Kit Memory MCP server with Voyage 4 support.
2. **Automatic Database Migration**: System creates new database file (`context-index__voyage__voyage-4__1024.sqlite`) when switching to Voyage 4. Existing memories preserved.
3. **Optional Re-indexing**: Run `memory_index_scan({ force: true })` to bulk re-index existing memory files.
4. **No Breaking Changes**: All 14 MCP tools maintain identical interfaces.

**Full Changelog**: [v1.0.3.6...v1.0.4.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.6...v1.0.4.0)

---

## [**1.0.3.6**] - 2026-01-15

Critical MCP protocol fix ensuring Cognitive Memory v17.1 functions correctly. Adds VS Code extension install guide and expands workflows-code skill with 16 new reference and asset files.

---

### Fixed
- **Critical (MCP Protocol)**: Changed `console.log` → `console.error` in 3 locations to prevent "invalid character 'v'" JSON-RPC errors
  - `embeddings.js:282` (Provider warmed up message)
  - `factory.js:58` (Using provider message)
  - `factory.js:110` (Warming up message)
  - **Why**: MCP servers use stdout for JSON-RPC communication. Any `console.log()` output corrupts the protocol, causing Antigravity quota and other MCP tools to fail.

---

### Added
- **VS Code Extension Install Guide**: Step-by-step installation guide for non-technical users (`OpenCode - VS Code Extension.md`)
  - AI-first installation prompt for guided setup
  - GitHub Copilot authentication walkthrough
  - Model selection guidance

- **Performance Patterns Asset**: `performance_patterns.js` with production-validated timing utilities
  - Throttle/debounce constants (64ms pointermove, 180ms form validation, 200-250ms resize)
  - IntersectionObserver patterns with 0.1 threshold

- **15 New Reference Files** in workflows-code skill:
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

### Fixed
- **Missing cognitive module files**: Force-added 5 lib files blocked by global gitignore
  - `attention-decay.js`, `co-activation.js`, `tier-classifier.js`, `working-memory.js`, `summary-generator.js`
- **Test suite created**: Added 226 comprehensive tests for cognitive memory modules
  - `attention-decay.test.js` (46 tests)
  - `working-memory.test.js` (51 tests)
  - `tier-classifier.test.js` (39 tests)
  - `co-activation.test.js` (38 tests)
  - `summary-generator.test.js` (52 tests)
- **Documentation inconsistencies**: Aligned decay rate documentation (0.80/turn for normal, 0.60/turn for temporary)
- **CHANGELOG accuracy**: Corrected inflated test count claims from v1.0.3.4
- **Bug fix**: `flushAccessCounts` → `flush_access_counts` (snake_case alignment)
- **Gitignore**: Added `.opencode/` exception to prevent future missing file issues

### Changed
- Updated `.gitignore` to override global gitignore pattern for `.opencode/` directory

---

## [**1.0.3.4**] - 2026-01-14

Cognitive Memory v17.1 delivers comprehensive bug fixes to the session-aware memory system introduced in v17.0. Additionally, a comprehensive audit of 4 workflow skills resolved 9 critical bugs, 13 misalignments, and 18 warnings across 13 files.

---

### Cognitive Memory Features (v17.0)

**Turn-Based Attention Decay** — Memories fade naturally over conversation turns unless re-activated. Decay rates vary by importance tier (constitutional=1.0/never, normal=0.80, temporary=0.60).

**Tiered Content Delivery** — HOT (≥0.8): full content, WARM (0.25-0.79): summaries only, COLD (<0.25): excluded. Achieves 63-86% token savings in typical sessions.

**Co-Activation** — When a memory activates, related memories get boosted (+0.35), surfacing contextually relevant content automatically.

**Session-Based Working Memory** — Each conversation maintains independent attention state. Fully backward compatible with stateless mode.

---

### Workflow Skills Improvements

**workflows-git v1.5.0** — Full Git workflow orchestrator for complete development lifecycle:
- Workspace setup guidance via git-worktrees
- Clean commit workflows with conventional commit conventions
- Work completion flows for branch integration
- Pull request creation and review workflows
- GitHub issue integration
- Fixed 7 GitHub MCP naming patterns (underscore → dot notation)
- Added Gate 3 integration and memory integration examples

**workflows-chrome-devtools v2.1.0** — Enhanced orchestrator with intelligent routing:
- CLI (bdg) approach prioritized for speed and token efficiency
- MCP fallback for multi-tool integration scenarios
- Screenshot capture, network monitoring, console log access
- Cookie manipulation and JavaScript execution
- Unix pipe composability for terminal-based automation
- Fixed section references in session_management.md and cdp_patterns.md

**workflows-documentation** — Validation improvements:
- Added SMART ROUTING and REFERENCES sections to package_skill.py validation
- Fixed Resource Router mode numbering (6 duplicates → 4 unique)
- Added REFERENCES section to init_skill.py template

**workflows-code** — Audit bug fixes:
- Fixed 15 broken asset and relative paths across 3 reference files
- Viewport alignment standardized to 375px
- Removed 60 lines of dead code from wait_patterns.js

**Audit Summary:** 9 critical bugs fixed · 13 misalignments resolved · 18 warnings addressed · 13 files modified

---

**Fixed (Cognitive Memory v17.1)**
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

---

**Added**
1. Five cognitive memory modules for session-aware memory management.
2. Working memory with HOT/WARM/COLD tier classification.
3. Turn-based attention decay with configurable rates per importance tier.
4. Co-activation system for related memory boosting.

---

**Changed**
1. All package versions updated to 17.1.0 for consistency.

---

**New Modules (v17.0)**
- `working-memory.js` — Session state management
- `attention-decay.js` — Turn-based decay calculations
- `tier-classifier.js` — HOT/WARM/COLD classification
- `co-activation.js` — Related memory boosting
- `summary-generator.js` — WARM tier summary generation

---

**Upgrade**
No action required. Pull latest to get bug fixes and cognitive memory improvements.

**Full Changelog**: [v1.0.3.3...v1.0.3.4](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.3...v1.0.3.4)

---

## [**1.0.3.3**] - 2026-01-11

Security hardening and documentation quality improvements for workflows-code skill. Fixes URL validation XSS vulnerability, repairs 35 broken cross-references, and brings all reference files into H2 emoji compliance.

---

**Fixed**
1. URL validation now rejects `javascript:` and `data:` schemes (XSS prevention).
2. 35 broken markdown links across 16 reference files.
3. `debounce()` missing default delay (now 180ms).
4. SKILL.md Quick Reference path (`dist/` → `src/2_javascript/z_minified/`).

---

**Changed**
1. Removed deprecated `SafeDOM` class (107 lines).
2. Removed deprecated `debounce` and `raf_throttle` exports from `wait_patterns.js`.
3. Added Lenis smooth scroll pattern routing to SKILL.md.
4. Added HLS video streaming pattern routing to SKILL.md.
5. Added H2 emojis to 4 reference files (34 headers) for documentation compliance.

---

**Upgrade**
No action required. Pull latest to get security improvements.

**Full Changelog**: [v1.0.3.2...v1.0.3.3](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.2...v1.0.3.3)

---

## [**1.0.3.2**] - 2026-01-05

Embeds MCP server source code into skill folders for improved portability. Documents critical Code Mode prefixed environment variable requirement that was causing "Variable not found" errors. Updates install guides with comprehensive troubleshooting.

---

**New**
1. Embedded MCP servers: Narsil source in `mcp-narsil/mcp_server/`, Code Mode source in `mcp-code-mode/mcp_server/`
2. `.env.example` template with Code Mode prefixed variables documented

---

**Changed**
1. Install guides updated: `MCP - Narsil.md` · `MCP - Code Mode.md` with prefixed variable documentation
2. Code Mode install guide: Added "CRITICAL: Prefixed Environment Variables" section
3. Narsil install guide: Added prefixed variable note in Neural Search Configuration
4. Both guides: New troubleshooting entries for "Variable not found" errors

---

**Fixed**
1. Documentation gap: Code Mode requires `{manual}_{VAR}` format (e.g., `narsil_VOYAGE_API_KEY`)
2. Public repo configs: Removed hardcoded API keys and absolute paths

---

**Upgrade**
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

**Changed**
1. Agent frontmatter: `tools:` object → `permission:` object (v1.1.1+ format)
2. `write.md` · `orchestrate.md`: Consolidated tool permissions into unified permission block
3. `agent_template.md`: Updated with v1.1.1 format, granular permissions example, deprecation note
4. `SET-UP - Opencode Agents.md`: Updated examples, field reference, troubleshooting (v1.2)
5. `/create:agent` command: Now generates v1.1.1 compliant agent files

---

**Upgrade**
Existing agents with `tools:` format continue to work (backwards compatible). New agents should use the `permission:` format. See `agent_template.md` for migration examples.

**Full Changelog**: [v1.0.3.0...v1.0.3.1](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.3.0...v1.0.3.1)

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

- Cross-repo symlink in Public repo: `INSTALL_GUIDE.md` now points locally instead of to external project

---

**Upgrade**

No action required. Existing `specs/` folders continue to work unchanged.

**Full Changelog**: [v1.0.2.9...v1.0.3.0](https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.2.9...v1.0.3.0)

---

## [**1.0.2.9**] - 2026-01-02

Fixes critical MCP server bugs preventing Spec Kit Memory operations. Multiple import naming mismatches caused E040 errors (`is not a function`) across `memory_health`, `memory_index_scan`, and `memory_save` tools.

#### Fixed
- **Critical**: `getDatabasePath` → `get_database_path` method name mismatch:
  - `mcp_server/context-server.js:1454` (health check response)
  - `mcp_server/lib/vector-index.js:100` (database path resolution)
- **Critical**: `validateFilePath` → `validate_file_path` import mismatch:
  - `mcp_server/context-server.js:55`
  - `mcp_server/lib/vector-index.js:13`
- **Critical**: `isTransientError` / `userFriendlyError` → `is_transient_error` / `user_friendly_error` import mismatch:
  - `mcp_server/context-server.js:214`
- **Critical**: `escapeRegex` → `escape_regex` import mismatch:
  - `mcp_server/lib/trigger-matcher.js:7`
  - `mcp_server/lib/memory-parser.js:9`

#### Root Cause
During snake_case refactoring, exports in source modules (`shared/utils.js`, `lib/errors.js`) were renamed but imports in consuming files retained camelCase names. Fixed using import aliasing: `const { snake_case: camelCase } = require(...)`

---

## [**1.0.2.8**] - 2026-01-02

Reorganizes the workflows-documentation skill's asset folder structure for improved discoverability. Renames `assets/components/` to `assets/opencode/` and `assets/documents/` to `assets/documentation/` with 250+ path reference updates across 35+ files. Establishes new organizational principle for skill folder structure.

#### Changed
- `assets/components/` → `assets/opencode/` (OpenCode component templates: skills, agents, commands)
- `assets/documents/` → `assets/documentation/` (document templates: README, install guides, frontmatter)
- 250+ path references updated across: `SKILL.md` · 7 reference files · 9 asset files · `AGENTS.md` · `write.md` agent · 7 command files · 2 install guides
- New organizational principle established and documented:
  - `references/` = FLAT (no subfolders) for simpler AI agent discovery
  - `assets/` = Subfolders ALLOWED for grouping related templates
  - `scripts/` = Typically flat, subfolders OK for large collections
- `skill_md_template.md` updated with "Folder Organization Principle" section
- `skill_creation.md` updated with folder guidance in anatomy and quick reference sections

#### Fixed
- Duplicate `INSTALL_GUIDE.md` in mcp-figma skill root (deleted)
- 3 broken paths in mcp-figma (removed erroneous `/MCP/` from paths)

---

## [**1.0.2.7**] - 2026-01-02

Addresses critical runtime errors, code quality issues, and documentation misalignments discovered by a 20-agent parallel scan.

#### Critical Fixes
- **workflow.js:19**: Added missing `collectSessionData` import that would cause runtime error
- **workflow.js:63**: Empty catch block now logs database notification errors instead of silently swallowing them
- **input-normalizer.js:113,299**: Changed default descriptions from "Modified during session" (flagged as garbage by file-helpers.js) to meaningful defaults: "File modified (description pending)", "Edited via edit tool", "Created via write tool"

#### Code Quality Fixes
- **decision-tree-generator.js:17-20**: Replaced aggressive `process.exit(1)` with graceful fallback - workflow continues with simplified output when `ascii-boxes` library unavailable
- **diagram-extractor.js:35-43**: Fixed inverted null check order - now verifies object existence before property access

#### Documentation Fixes
- **mcp_server/README.md**: Tool count corrected 13→14 (5 locations), file watcher claim clarified as "not yet implemented"
- **SKILL.md:179,234**: Module count corrected 30→44, directory count 6→10, line count 145→142
- **scripts/README.md:138,398**: Line count corrected 145→142
- **debug.md:362**: Path corrected to include `debugging/` subfolder for `universal_debugging_methodology.md`
- **handover.md**: Removed references to non-existent Gates (0, 7) - now references AGENTS.md Section 2
- **resume.md**: Removed references to non-existent Gates (0.5, 4) - now references Memory Context Loading
- **implement.md:222,230**: Step count corrected 8→9
- **complete.md**: Gate 4/5 references updated to "Memory Context Loading" / "Memory Save Rule"
- **spec_kit_complete_*.yaml**: Gate 5 references updated to "Memory Save Rule Enforcement"
- **spec_kit_debug_*.yaml**: Path corrected to include `debugging/` subfolder

#### Verification
- All 44 JavaScript modules pass syntax check
- 25 bug fix tests pass, 0 failures
- Integration test passes (generate-context.js --help)
- All 3 repos (anobel.com, Public, Barter) verified in sync

---

## [**1.0.2.6**] - 2026-01-02

Major architectural refactoring release for the Spec Kit Memory system. The generate-context.js script undergoes complete modularization from a 4,800-line monolith to a 142-line CLI entry point with 30 focused modules across 6 directories. Includes comprehensive code style standardization, test reorganization, 20-agent documentation alignment scan, and cross-repo synchronization.

#### Architecture
- **generate-context.js modularization**: 4,800-line monolith → 142-line CLI entry point (97% reduction)
- 30 new modules created across 6 directories:
  - `core/` (3 files): config.js · index.js · workflow.js (539 lines main orchestration)
  - `extractors/` (9 files): session · conversation · decision · diagram · file · implementation-guide extractors
  - `utils/` (10 files): data-validator · file-helpers · input-normalizer · logger · message-utils · path-utils · prompt-utils · tool-detection · validation-utils
  - `renderers/` (2 files): template-renderer · index.js
  - `spec-folder/` (4 files): alignment-validator · directory-setup · folder-detector · index.js
  - `loaders/` (2 files): data-loader · index.js
- All module imports verified working with full dependency chain

#### Changed
- Test scripts reorganized to `scripts/tests/` folder: `test-bug-fixes.js` · `test-embeddings-factory.js` · `test-validation.sh`
- 31 JavaScript files standardized with workflows-code style:
  - 3-line box-drawing headers (`// ───` format)
  - Numbered section headers (`/* ─── 1. SECTION ─── */`)
  - ~1,000 lines of JSDoc blocks and inline comments removed
- AGENTS.md EXECUTION section restructured with `[script]` placeholder pattern for cleaner display
- 8 documentation files updated with new test folder paths
- scripts-registry.json paths updated for test file locations

#### Fixed
- 4 failing bug tests (naming convention mismatches in test definitions)
- AGENTS.md missing full script path in MEMORY SAVE RULE execution examples
- `mcp_server/README.md` line 404: relative path → full path
- `references/structure/folder_routing.md`: 5 short path references → full paths
- `shared/embeddings/README.md`: broken relative link `../../generate-context.js` → `../../scripts/generate-context.js`
- `shared/embeddings/README.md`: misleading label `lib/README.md` → `shared/README.md`
- `test-bug-fixes.js` ROOT path updated for new tests/ folder location

#### Added
- INDEXING NOTE section in AGENTS.md explaining MCP server database connection behavior
- `INSTALL_GUIDE.md` symlinks in `mcp_server/` folders for all 3 repos (anobel.com, Public, Barter)
- Numbered section headers in all 31 modular JavaScript files
- Complete A-to-Z verification suite:
  - File structure verification (34 files)
  - Syntax check (all 34 JS files pass)
  - Import/Export verification (all modules resolve)
  - Integration test (script runs end-to-end, creates output)

#### Cross-Repo Sync
- AGENTS.md synchronized across anobel.com, Public, and Barter repos
- INDEXING NOTE section added to Public and Barter repos
- EXECUTION section [script] placeholder pattern applied to all repos
- Verified no broken install guide symlinks in any repo

#### Documentation
- 20-agent parallel scan verified alignment across all SpecKit documentation:
  - SKILL.md · README.md · scripts/README.md · mcp_server/README.md
  - All references/ subdirectories (config, memory, templates, validation, workflows, structure)
  - All assets/ and constitutional/ files
  - All command files (memory/*, spec_kit/*, create/*, search/*)
- scripts/README.md updated with complete modular architecture diagram
- SKILL.md updated with 30-module architecture description and 6 directory breakdown

#### Verification
- 27 bug fix tests: 25 passed, 0 failed, 2 intentionally skipped
- All 34 JavaScript files pass syntax check
- All module imports resolve correctly
- Integration test creates valid memory output file

---

## [**1.0.2.5**] - 2026-01-02

Security and documentation release fixing hardcoded API key exposure in `.utcp_config.json` and broken install script configuration. Adds comprehensive documentation for Narsil's three neural embedding backends (Voyage AI, OpenAI, Local ONNX) and HTTP server visualization setup.

#### Security
- **CWE-798 (Hardcoded Credentials)**: Fixed hardcoded `VOYAGE_API_KEY` in `.utcp_config.json` - now uses `${VOYAGE_API_KEY}` variable reference loaded from `.env`

#### Fixed
- `install-narsil.sh` generating invalid config with `_note`, `_neural_backends` fields that break Code Mode parsing
- Missing `--watch` flag in all recommended Narsil configurations

#### Added
- Neural backend comparison table showing all 3 options: Voyage AI (recommended) · OpenAI · Local ONNX
- Separate configuration examples for each neural backend in install guide
- HTTP server stdin pipe trick documentation (`tail -f /dev/null |` to prevent EOF shutdown)
- Symbol/Hybrid view parameter requirements (`root`, `repo`) in visualization docs

#### Changed
- All Narsil config examples now include `--watch` flag for auto-reindexing
- API key references changed from hardcoded values to `${VOYAGE_API_KEY}` variable syntax
- Install script help text expanded with Neural Search Backends section

---

## [**1.0.2.4**] - 2026-01-01

Major infrastructure release with critical bug fixes, security hardening, MCP install automation, and comprehensive codebase standardization across 70+ files. Adds sub-agent delegation for token efficiency and universal stack-agnostic debugging.

#### Fixed
- **Critical**: SQLite transaction nesting error in `memory_index_scan` - `indexMemory()` now uses composable `database.transaction()` wrapper
- **Critical**: Race condition where database changes weren't visible across MCP/script connections - added file-based notification with `reinitializeDatabase()`
- **Critical**: Failed vector insertions leaving orphaned metadata - explicit transaction control with rollback
- **High**: Schema created with wrong embedding dimensions before provider warmup - `getConfirmedEmbeddingDimension()` with polling
- **High**: Constitutional cache didn't invalidate on external database edits - mtime tracking added
- **High**: Rate limiting state lost on server restart - persistent `config` table in SQLite
- **High**: Stale prepared statements after database reset - `clearPreparedStatements()` in reset paths
- Query validation for whitespace-only/empty/null inputs
- UTF-8 BOM (EF BB BF) detection in memory parser
- Cache key collision risk - SHA256 hash-based keys
- Non-interactive mode silently using defaults - now fails with guidance
- Orphaned vectors never auto-cleaned - `verifyIntegrity({ autoClean: true })`

#### Security
- **CWE-22**: Path traversal protection in CLI `CONFIG.DATA_FILE` and DB-stored paths
- **CWE-400**: Input length limits for MCP tool parameters (query 10K, title 500, paths 500 chars)
- MEDIUM severity issues reduced from 4 to 1

#### Added
- **MCP Install Scripts Suite**: Shell-based installers for all 6 MCP servers with shared utilities library (33 functions)
- **Sub-agent delegation**: `/spec_kit:handover` and `/memory:save` now delegate heavy work to sub-agents for token efficiency
- **Session behavior modes**: `--brief`, `--verbose`, `--debug` flags for controlling response verbosity
- **Universal debugging methodology**: Stack-agnostic 4-phase approach (Observe → Analyze → Hypothesize → Fix) with new reference doc
- **Auto/Confirm modes**: 6 `/create` commands now support `:auto` and `:confirm` mode flags
- **Optional research chaining**: `/spec_kit:complete` supports `:with-research` and `:auto-debug` flags
- Configurable scoring weights for smart ranking (`smartRanking.recencyWeight`)
- Configurable trigger phrase limit via `maxTriggersPerMemory`
- Plain-language gates (~50+ "STOP HERE - Wait for X" markers) in 16 command files
- "What Next?" navigation tables in 14 commands
- Confidence checkpoints in 9 YAML workflow files

#### Changed
- **References reorganized**: 18 files moved from flat structure into 7 logical sub-folders (`config/`, `debugging/`, `memory/`, `structure/`, `templates/`, `validation/`, `workflows/`)
- **79 internal links fixed** across reference documentation
- **Lib consolidation**: Shared modules centralized in `lib/` folder with re-export wrappers
- **Asset template alignment**: 9 asset files standardized across 6 skill folders
- **workflows-code skill**: Priority-based resource loading (P1/P2/P3), references reorganized into 5 sub-folders
- **Code style alignment**: 70 files standardized with snake_case naming, 3-line box-drawing headers, ~3,900 lines metadata removed
- `/spec_kit:debug` made stack-agnostic - removed frontend-specific tool references
- `implementation-summary.md` now required for all spec levels
- Template priority standardized to P0/P1/P2 only

#### Documentation
- New `universal_debugging_methodology.md` reference (~150 lines)
- New `lib/README.md` with architecture diagrams (447 lines)
- Updated MCP install guides with multi-provider embedding support
- New install scripts `README.md` with 9-section structure
- SKILL.md routing tables with keyword navigation

---

## [**1.0.2.3**] - 2025-12-31

Comprehensive Spec Kit & Memory system audit with test suite fixes, documentation improvements, and new Script Registry for dynamic script discovery.

#### Fixed
- Test fixtures renamed to follow `###-short-name` naming convention (51 fixtures updated)
- Added `SPECKIT_TEMPLATE_SOURCE` marker to all test fixture frontmatter
- FRONTMATTER_VALID rule now skips template marker check for test-fixtures/ directory
- Updated test-validation.sh references to match renamed fixtures
- All 55 validation tests now pass (previously 90%+ failed)

#### Added
- Script Registry (`scripts-registry.json`) - Centralized JSON config for all 14 scripts and 9 rules
- Registry Loader (`registry-loader.sh`) - CLI tool to query script registry
- 41 new test fixtures for comprehensive edge case coverage
- Documentation for `memory_search` query/concepts requirement (E040 error prevention)
- Documentation for indexing persistence gap between script and MCP server

#### Changed
- `memory_search` documentation clarified: `query` OR `concepts` parameter is REQUIRED
- `check-frontmatter.sh` now supports `SKIP_TEMPLATE_CHECK=1` environment variable
- Updated AGENTS.md, SKILL.md, and memory_system.md with parameter requirements

#### Removed
- Deprecated `mcp_server/INSTALL_GUIDE.md` (duplicate of install_guides/MCP/MCP - Spec Kit Memory.md)

---

## [**1.0.2.2**] - 2025-12-31

Security patch fixing HIGH severity DoS vulnerability in `qs` dependency. Documentation updated with complete MCP tool reference for resume command.

#### Security
- **HIGH (CVE-2025-15284)**: Fixed DoS vulnerability in `qs` query string parser (6.14.0 → 6.14.1) - `arrayLimit` bypass via bracket notation allowed memory exhaustion. Transitive through `express@5.2.1`.

#### Changed
- `resume.md` command: Added 8 missing MCP tools to Section 6 (MCP Tool Usage):
  - Memory tools: `memory_delete`, `memory_update`, `memory_validate`, `memory_index_scan`, `memory_health`
  - Checkpoint tools: `checkpoint_create`, `checkpoint_list`, `checkpoint_delete`
- Added example invocations for all new MCP tools

---

## [**1.0.2.1**] - 2025-12-31

Comprehensive system hardening release with critical bug fixes, security improvements, and performance optimizations for the Spec Kit Memory system.

#### Fixed
- **Critical**: Embedding dimension mismatch - checkpoints now use dynamic dimension detection instead of hardcoded 768, fixing failures with Voyage (1024) and OpenAI (1536) providers
- **Critical**: `getEmbeddingDimension()` now correctly detects dimension from provider, environment variables, or API keys before falling back to default
- **High**: Memory indexing failures caused by dimension validation mismatches
- Empty catch blocks that silently swallowed errors (2 fixed with proper logging)
- Blocking file I/O replaced with async `fs.promises.readFile`
- Stale documentation references to deleted files
- Architecture diagram showing incorrect folder paths
- Version inconsistencies in context-server.js (now 16.0.0)

#### Added
- **Embedding cache**: LRU cache (1000 entries) reduces redundant API calls
- **shared/utils.js**: Consolidated `validateFilePath` and `escapeRegex` utilities
- **Parallel batch embeddings**: 3-5x faster with configurable concurrency (default: 5)
- Test fixtures (37 files across 10 folders) for validation testing
- Unicode normalization for improved trigger phrase matching
- Constitutional directory auto-scanning in `memory_index_scan`
- `dryRun` parameter for `memory_delete` to preview before executing
- New validation scripts: `check-folder-naming.sh`, `check-frontmatter.sh`
- `--help` flag for `generate-context.js`
- 8 missing MCP tools documented in SKILL.md (now 14 total)

#### Changed
- **Lib consolidation**: Shared modules moved to `shared/` folder with re-export wrappers for backward compatibility
- All hardcoded paths now use environment variables for portability
- Deprecated JS validators removed (bash validators preferred)
- Template metadata formats standardized

#### Security
- **CWE-22**: Added path validation to CLI `CONFIG.DATA_FILE` 
- **CWE-22**: Added `validateFilePath()` checks for DB-stored paths
- **CWE-400**: Added input length limits to MCP handler parameters
- Removed personal path references from public release
- Fixed symlinks pointing to personal directories

---

## [**1.0.2.0**] - 2025-12-30

Technical debt remediation for Spec Kit Memory system with 6 infrastructure improvements. Comprehensive skill audit standardizing documentation across 7 skills. New mcp-figma skill added for design-to-code workflows.

#### Added
- `mcp-figma` skill with 18 tools for Figma integration
- `/spec_kit:debug` command assets with auto and confirm modes
- Test fixtures for validation scripts (37 files across 10 folders)

#### Changed
- Standardized RELATED RESOURCES section across all SKILL.md files
- Section reordering and content cleanup in multiple skills

#### Fixed
- Unicode normalization for international trigger phrase matching
- Constitutional directory auto-scanning with `includeConstitutional` parameter
- Portable paths via environment variables
- Deprecated JS validators removed
- `memory_delete` now supports `dryRun: true` for safe preview

---

## [**1.0.1.7**] - 2025-12-30

Enhanced install guides with comprehensive H1 descriptions for all MCP servers. Added new `/create:agent` command.

#### Added
- `/create:agent` command with 5-phase workflow for agent creation
- `agent_template.md` for consistent agent structure

#### Changed
- All MCP install guides now include detailed H1 descriptions
- `command_template.md` reduced 27% by removing duplication

---

## [**1.0.1.6**] - 2025-12-30

Fixes critical Narsil MCP parameter naming issues across all 39 high-priority tools. Adds HTTP server scripts for reliable search functionality.

#### Added
- `narsil-server.sh` for HTTP server management
- `narsil-search.sh` CLI wrapper for reliable search
- Index dependency documentation

#### Breaking
- Parameter names changed in all Narsil tools:
  - `kind` → `symbol_type` in symbol queries
  - `name` → `symbol` in definition lookups
  - `function_name` → `function` in call graph tools
  - Added `repo: "unknown"` requirement for all tools

---

## [**1.0.1.5**] - 2025-12-29

Documents JavaScript-specific Narsil limitations discovered during testing.

#### Known Issues
- Call graph empty for JavaScript (tree-sitter limitation)
- Security scan limited (backend-focused rules)
- Neural search stale after index clear

#### Working
- `find_symbols` for symbol discovery
- `get_symbol_definition` for definitions
- `get_file` for file content
- Git integration features

---

## [**1.0.1.4**] - 2025-12-29

Documents discovered Narsil bugs and limitations with workarounds.

#### Added
- Skill Creation guide with required templates and file locations
- Skill Advisor configuration documentation (Section 12)

#### Known Issues
- Persistence bug: indexes regenerate ~45-60s on startup
- Unicode bug: box-drawing characters crash chunking

---

## [**1.0.1.3**] - 2025-12-29

Documents Narsil's HTTP server and React frontend for interactive code graph visualization.

#### Added
- HTTP backend server (port 3000) for graph data
- React frontend (port 5173) for interactive visualization
- Five graph view types: `import` · `call` · `symbol` · `hybrid` · `flow`

#### Fixed
- Tool names corrected in documentation
- Language count: 16 → 15

---

## [**1.0.1.2**] - 2025-12-29

Adds project-local Narsil index support for isolated per-project indexing.

#### Added
- Project-local `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
- `--persist` flag for index persistence
- `--index-path` option for custom index location
- `save_index` tool for manual saves
- HTTP server mode documentation

---

## [**1.0.1.1**] - 2025-12-29

Fixes Narsil neural search configuration for embedding dimension compatibility.

#### Fixed
- `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions
- Invalid frontmatter in search commands

---

## [**1.0.1.0**] - 2025-12-29

Complete migration from LEANN to Narsil for unified code intelligence. Adds 76 specialized tools covering semantic search, security scanning, and call graph analysis.

#### Breaking
- LEANN completely removed
- `leann_leann_search()` → `narsil.narsil_neural_search()`
- LEANN MCP → Narsil (via Code Mode)
- `mcp-leann` skill → `mcp-narsil` skill
- MLX embeddings → Voyage/OpenAI/ONNX backends
- Skills reduced from 8 to 7

---

## [**1.0.0.8**] - 2025-12-29

Consolidates embedding options to MLX + Qwen3 as the single path.

#### Changed
- LEANN for code search (`src/` directories)
- Spec Kit Memory for document search (`specs/`, `.opencode/`)
- Removed Voyage, Gemini, and Contriever embedding options

---

## [**1.0.0.7**] - 2025-12-29

Major semantic search upgrade with Qwen3 embedding model.

#### Added
- `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` embedding model with 4-bit quantization
- Progressive scope indexing for large projects

#### Changed
- AGENTS.md made frontend/backend agnostic

---

## [**1.0.0.6**] - 2025-12-29

Strengthens write agent enforcement for /create commands.

#### Added
- HARD BLOCK section for write agent enforcement
- Prompt prefix requirement
- Prerequisite check validation
- Validation command for skill creation

---

## [**1.0.0.5**] - 2025-12-29

Enforces @write agent for skill creation with multi-layer enforcement.

#### Added
- Skill creation requires `@write` agent prefix
- HARD BLOCK enforcement for write agent
- Prompt prefix and prerequisite checks

#### Changed
- Quick Reference updated with CDN deployment workflow
- Quick Reference updated with JS minification workflow
- Narsil added to Code Mode examples

---

## [**1.0.0.4**] - 2025-12-29

Complete skill system overhaul standardizing 69 reference/asset files across all 8 skills.

#### Added
- `execution_methods` reference
- `folder_structure` reference
- `environment_variables` reference
- `memory_system` reference
- `cdn_deployment` reference
- `minification_guide` reference

#### Changed
- Standardized structure for all 8 skills (69 files total)
- SKILL.md reduced 24% through better organization

#### Fixed
- Hardcoded paths throughout skills
- Broken anchor links

---

## [**1.0.0.3**] - 2025-12-29

Constitutional memory system improvements with 4x token budget increase.

#### Added
- Constitutional README documentation
- `cleanup-orphaned-vectors.js` utility
- New triggers: `build`, `generate`, `configure`, `analyze`

#### Changed
- Token budget increased from ~500 to ~2000 tokens (~8000 characters)
- Gate enforcement restructured with First Message Protocol [HARD BLOCK]
- 4-step Violation Recovery process
- 5 ANCHOR sections for memory format

---

## [**1.0.0.2**] - 2025-12-29

Continued post-release refinement with 80+ bug fixes.

#### Fixed
- Duplicate entries in checkpoints
- Orphaned file detection
- Broken skill references
- Gate numbering inconsistencies
- Hardcoded paths throughout
- Transaction safety issues
- Missing validators added
- Anchor links fixed
- Embedding rollback support
- Index migration handling
- Cascade delete for orphans

#### Changed
- AGENTS.md made fully universal (no project-specific patterns)
- Symlinks converted to relative paths

---

## [**1.0.0.1**] - 2025-12-29

First post-release refinement focusing on structural reorganization and critical bug fixes.

#### Changed
- Skills, commands, guides, scripts, and agents moved to `.opencode/` folder
- AGENTS.md made fully codebase-agnostic

#### Fixed
- P0: Duplicate checkpoint entries
- P0: Orphaned file detection
- P0: Broken skill references
- P0: Gate numbering issues
- P0: Hardcoded paths
- P0: Transaction safety
- P1: Missing validators
- P1: Embedding rollback
- P1: LEANN naming consistency
- P1: Error codes standardized

---

## [**1.0.0.0**] - 2025-12-29

First official release of the OpenCode Dev Environment.

#### Added
- **Spec Kit**: Unified documentation system with automation, slash commands, integrated semantic memory, and sub-folder versioning
- **Skills Framework**: 8 domain-specific skills that auto-load based on task
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