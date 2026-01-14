# Changelog

All notable changes to the mcp-narsil skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** This changelog includes both **Skill Wrapper** changes (SKILL.md, install guides, references) and **Narsil MCP Server** releases (the external tool). Skill wrapper entries are marked with environment version references.

---

## Skill Wrapper Changes

### [1.0.3.2] - 2026-01-05

*Environment version: 1.0.3.2*

#### Added
- **Embedded MCP server source** - Narsil source code now included in `mcp_server/` folder for portability
- **Prefixed variable documentation** - Install guide updated with Code Mode `{manual}_{VAR}` requirement

#### Changed
- Install guide: Added "Variable not found" troubleshooting entry
- Install guide: Added note about `narsil_VOYAGE_API_KEY` requirement for Code Mode

#### Fixed
- Documentation gap: Code Mode requires prefixed environment variables (e.g., `narsil_VOYAGE_API_KEY`)

---

### [1.0.2.5] - 2026-01-02

*Environment version: 1.0.2.5*

#### Added
- Neural backend comparison table: Voyage AI (recommended), OpenAI, Local ONNX
- Separate configuration examples for each neural backend
- HTTP server stdin pipe trick documentation

#### Changed
- All config examples now include `--watch` flag for auto-reindexing
- Install script help text expanded with Neural Search Backends section

---

### [1.0.1.6] - 2025-12-30

*Environment version: 1.0.1.6*

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

### [1.0.1.5] - 2025-12-29

*Environment version: 1.0.1.5*

#### Known Issues Documented
- Call graph empty for JavaScript (tree-sitter limitation)
- Security scan limited (backend-focused rules)
- Neural search stale after index clear

#### Working Features
- `find_symbols` for symbol discovery
- `get_symbol_definition` for definitions
- `get_file` for file content
- Git integration features

---

### [1.0.1.4] - 2025-12-29

*Environment version: 1.0.1.4*

#### Added
- Skill Creation guide with required templates
- Skill Advisor configuration documentation

#### Known Issues Documented
- Persistence bug: indexes regenerate ~45-60s on startup
- Unicode bug: box-drawing characters crash chunking

---

### [1.0.1.3] - 2025-12-29

*Environment version: 1.0.1.3*

#### Added
- HTTP backend server (port 3000) documentation
- React frontend (port 5173) visualization docs
- Five graph view types: `import`, `call`, `symbol`, `hybrid`, `flow`

#### Fixed
- Tool names corrected in documentation
- Language count: 16 → 15

---

### [1.0.1.2] - 2025-12-29

*Environment version: 1.0.1.2*

#### Added
- Project-local `.narsil-index/` support
- `--persist` flag documentation
- `--index-path` option documentation
- HTTP server mode documentation

---

### [1.0.1.1] - 2025-12-29

*Environment version: 1.0.1.1*

#### Fixed
- `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions
- Invalid frontmatter in search commands

---

### [1.0.1.0] - 2025-12-29

*Environment version: 1.0.1.0*

#### Breaking
- Complete migration from LEANN to Narsil
- `leann_leann_search()` → `narsil.narsil_neural_search()`
- `mcp-leann` skill → `mcp-narsil` skill
- MLX embeddings → Voyage/OpenAI/ONNX backends

#### Added
- 76 specialized tools for code intelligence
- Semantic search, security scanning, call graph analysis

---

### [1.0.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

#### Added
- Initial skill release
- Narsil MCP integration via Code Mode
- Install guide and reference documentation

---

## Narsil MCP Server Releases

*The following entries track releases of the external Narsil MCP server project.*

### [1.2.0] - 2025-01-04

#### Added

- **`exclude_tests` parameter** - 22 tools now support filtering out test files to reduce noise and token usage:
  - Security tools (5): `check_owasp_top10`, `check_cwe_top25`, `find_injection_vulnerabilities`, `get_taint_sources`, `get_security_summary`
  - Analysis tools (5): `find_dead_code`, `find_uninitialized`, `find_dead_stores`, `check_type_errors`, `find_circular_imports`
  - Symbol tools (3): `find_symbols`, `find_references`, `find_symbol_usages`
  - Search tools (5): `search_code`, `semantic_search`, `hybrid_search`, `search_chunks`, `find_similar_code`
  - CallGraph tools (4): `get_call_graph`, `get_callers`, `get_callees`, `get_function_hotspots`

- **npm package** - Install via `npm install -g narsil-mcp` with automatic binary download
- **Automated npm publishing** - Release workflow now publishes to npm registry

#### Changed

- **README restructured** - Claude Code configuration moved to first position, reduced from 1,186 to 951 lines (20% reduction)
- **Documentation reorganized** - WASM, Neural Search, and Frontend docs moved to dedicated files in `docs/`
- **Install script enhanced** - Now shows Claude Code quick-start guide with `.mcp.json` example after installation

#### Defaults

- Security/Analysis tools: `exclude_tests` defaults to `true` (excludes tests)
- Symbol/Search tools: `exclude_tests` defaults to `false` (includes tests)
- CallGraph tools: accepts parameter but filtering requires call graph rebuild

### [1.1.6] - 2025-01-03

#### Fixed

- **C++ parser** - Fixed tree-sitter query syntax for C++ namespace and class declarations. Previously caused parsing errors on C++ codebases.

### [1.1.5] - 2025-01-01

#### Fixed

- **`--http` timeout with Zed editor** - The HTTP server and MCP server were mutually exclusive, causing timeouts when `--http` was enabled. Now HTTP server runs in background via `tokio::spawn` while MCP always runs on the main task, allowing both to operate concurrently.

- **`--preset` CLI flag missing** - Added the `--preset` flag that was documented but never implemented. This allows overriding editor-detected presets (e.g., `--preset full` forces all tools on Zed which defaults to minimal).

- **`prompts/get` method not found** - Implemented the MCP `prompts/get` method with full prompt templates for `explain_codebase` and `find_implementation` prompts. Previously only `prompts/list` was implemented.

#### Added

- Comprehensive test coverage for CLI preset behavior (6 new tests)
- Test coverage for `prompts/get` functionality (6 new tests)
- Test coverage for HTTP/MCP concurrent operation pattern (6 new tests)

#### Changed

- Documentation updated to clarify `--http` runs alongside MCP (not instead of)
- Added Scoop installation note about optional features (ONNX, frontend) requiring source build

### [1.1.1] - 2025-12-28

#### Added

- **Package manager distribution** - Making installation easier across all platforms:
  - **Homebrew tap** for macOS/Linux (`brew install postrv/narsil/narsil-mcp`)
  - **crates.io** publishing automated in release workflow (`cargo install narsil-mcp`)
  - **AUR packages** for Arch Linux (`narsil-mcp` and `narsil-mcp-bin`)
  - **Scoop bucket** for Windows (`scoop install narsil-mcp`)
- **GitHub releases** now include versioned tarballs (`.tar.gz` for Unix, `.zip` for Windows)
- **SHA256 checksums** generated for all release artifacts
- **Comprehensive installation guide** (`docs/INSTALL.md`) with platform-specific instructions

#### Changed

- Release workflow now creates versioned tarballs instead of individual binaries
- `install.sh` updated to download versioned tarballs with proper extraction

#### Fixed

- Windows CI test failure (`test_claude_code_path`) - now handles both `HOME` and `USERPROFILE` env vars
- Tree-sitter query warnings for TypeScript/TSX (changed `identifier` to `type_identifier` for class names)
- Tree-sitter query warning for Kotlin (removed unsupported `interface_declaration` node)
- Neural API key warning message now suggests running `narsil-mcp config init --neural` for better user experience
- Version string in startup logs now uses `CARGO_PKG_VERSION` instead of hardcoded value

### [1.1.0] - 2025-12-28

#### 🎯 Major Features - Tool Selection & Configuration System

**Solves:** "76 tools? Isn't that much too many? About how many tokens does Narsil add to the context window with this many tools enabled?" - [Reddit](https://www.reddit.com/r/ClaudeAI/)

narsil-mcp v1.1.0 introduces an intelligent tool selection and configuration system that dramatically reduces context window usage while maintaining full backwards compatibility.

#### Added

**Automatic Editor Detection & Presets:**
- **4 built-in presets** optimized for different use cases:
  - **Minimal** (26 tools, ~4,686 tokens) - Zed, Cursor - **61% token reduction**
  - **Balanced** (51 tools, ~8,948 tokens) - VS Code, IntelliJ - **25% token reduction**
  - **Full** (69 tools, ~12,001 tokens) - Claude Desktop, comprehensive analysis
  - **Security-focused** (~30 tools) - Security audits and supply chain analysis

- **Automatic client detection** from MCP `initialize` request

**Configuration System:**
- Multi-source configuration loading (default → user → project → env → CLI)
- Configuration validation with helpful error messages
- Interactive config wizard: `narsil-mcp config init`

**New CLI Commands:**
- `config show`, `config validate`, `config init`, `config preset`, `config export`
- `tools list`, `tools search`

**4 new languages:** Bash, Ruby, Kotlin, PHP

**Security hardening module** with secret redaction, file size limits, sensitive file detection

**Expanded security rules** to all 14 supported languages (111 total rules, 50% increase)

#### Performance

- Config loading: <10ms
- Tool filtering: <1ms
- 494 total tests passing (100% success rate)

#### Token Usage Savings

| Preset | Tools | Tokens | Reduction |
|--------|-------|--------|-----------|
| Minimal | 26 | ~4,686 | **61% fewer** |
| Balanced | 51 | ~8,948 | **25% fewer** |
| Full | 69 | ~12,001 | baseline |

### [1.0.0] - 2025-12-23

#### Security

- **Fixed 7 path traversal vulnerabilities** (CWE-22) in taint analysis, fix suggestions, export map, clone detection, type inference, type errors, and taint flow functions

#### Changed

- Split `neural` feature into `neural` (TF-IDF + API embeddings) and `neural-onnx` (local ONNX inference)
- Updated ort dependency to 2.0.0-rc.10

#### Added

- Test file detection for security scanning
- `exclude_tests` parameter for `scan_security`

### [0.2.0] - 2025-12-22

#### Added

- Phase 6: Advanced Features (Merkle indexing, cross-language symbols, fuzzy search, import/export graphs)
- Phase 5: Supply Chain Security (SBOM, vulnerability checking, license compliance)
- Phase 4: Security Rules Engine (OWASP Top 10, CWE Top 25, custom YAML rules)
- Phase 3: Taint Analysis (source-to-sink tracking, injection detection)

### [0.1.0] - 2025-12-20

#### Added

- Initial release
- MCP server implementation
- Multi-language parsing (9 languages)
- Symbol extraction and search
- Full-text code search with BM25
- TF-IDF similarity search
- Call graph analysis
- Git integration
- LSP integration
- Remote GitHub repository support

---

See [SKILL.md](./SKILL.md) for usage documentation.
