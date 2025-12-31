# Changelog

All notable changes to the OpenCode Dev Environment are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

---

## 1.0.2.x Series

### [**1.0.2.1**] - 2025-01-01

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

### [**1.0.2.0**] - 2025-12-30

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

## 1.0.1.x Series

### [**1.0.1.7**] - 2025-12-30

Enhanced install guides with comprehensive H1 descriptions for all MCP servers. Added new `/create:agent` command.

#### Added
- `/create:agent` command with 5-phase workflow for agent creation
- `agent_template.md` for consistent agent structure

#### Changed
- All MCP install guides now include detailed H1 descriptions
- `command_template.md` reduced 27% by removing duplication

### [**1.0.1.6**] - 2025-12-30

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

### [**1.0.1.5**] - 2025-12-29

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

### [**1.0.1.4**] - 2025-12-29

Documents discovered Narsil bugs and limitations with workarounds.

#### Added
- Skill Creation guide with required templates and file locations
- Skill Advisor configuration documentation (Section 12)

#### Known Issues
- Persistence bug: indexes regenerate ~45-60s on startup
- Unicode bug: box-drawing characters crash chunking

### [**1.0.1.3**] - 2025-12-29

Documents Narsil's HTTP server and React frontend for interactive code graph visualization.

#### Added
- HTTP backend server (port 3000) for graph data
- React frontend (port 5173) for interactive visualization
- Five graph view types: `import` · `call` · `symbol` · `hybrid` · `flow`

#### Fixed
- Tool names corrected in documentation
- Language count: 16 → 15

### [**1.0.1.2**] - 2025-12-29

Adds project-local Narsil index support for isolated per-project indexing.

#### Added
- Project-local `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
- `--persist` flag for index persistence
- `--index-path` option for custom index location
- `save_index` tool for manual saves
- HTTP server mode documentation

### [**1.0.1.1**] - 2025-12-29

Fixes Narsil neural search configuration for embedding dimension compatibility.

#### Fixed
- `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions
- Invalid frontmatter in search commands

### [**1.0.1.0**] - 2025-12-29

Complete migration from LEANN to Narsil for unified code intelligence. Adds 76 specialized tools covering semantic search, security scanning, and call graph analysis.

#### Breaking
- LEANN completely removed
- `leann_leann_search()` → `narsil.narsil_neural_search()`
- LEANN MCP → Narsil (via Code Mode)
- `mcp-leann` skill → `mcp-narsil` skill
- MLX embeddings → Voyage/OpenAI/ONNX backends
- Skills reduced from 8 to 7

---

## 1.0.0.x Series

### [**1.0.0.8**] - 2025-12-29

Consolidates embedding options to MLX + Qwen3 as the single path.

#### Changed
- LEANN for code search (`src/` directories)
- Spec Kit Memory for document search (`specs/`, `.opencode/`)
- Removed Voyage, Gemini, and Contriever embedding options

### [**1.0.0.7**] - 2025-12-29

Major semantic search upgrade with Qwen3 embedding model.

#### Added
- `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ` embedding model with 4-bit quantization
- Progressive scope indexing for large projects

#### Changed
- AGENTS.md made frontend/backend agnostic

### [**1.0.0.6**] - 2025-12-29

Strengthens write agent enforcement for /create commands.

#### Added
- HARD BLOCK section for write agent enforcement
- Prompt prefix requirement
- Prerequisite check validation
- Validation command for skill creation

### [**1.0.0.5**] - 2025-12-29

Enforces @write agent for skill creation with multi-layer enforcement.

#### Added
- Skill creation requires `@write` agent prefix
- HARD BLOCK enforcement for write agent
- Prompt prefix and prerequisite checks

#### Changed
- Quick Reference updated with CDN deployment workflow
- Quick Reference updated with JS minification workflow
- Narsil added to Code Mode examples

### [**1.0.0.4**] - 2025-12-29

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

### [**1.0.0.3**] - 2025-12-29

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

### [**1.0.0.2**] - 2025-12-29

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

### [**1.0.0.1**] - 2025-12-29

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

### [**1.0.0.0**] - 2025-12-29

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

