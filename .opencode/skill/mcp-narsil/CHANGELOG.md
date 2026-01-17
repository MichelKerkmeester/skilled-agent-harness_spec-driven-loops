# Changelog

All notable changes to the mcp-narsil skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

> **Note:** This changelog includes both **Skill Wrapper** changes (SKILL.md, install guides, references) and **Narsil MCP Server** releases (the external tool). Skill wrapper entries are marked with environment version references.

---

## Skill Wrapper Changes

---

### [1.0.3.2] - 2026-01-05

*Environment version: 1.0.3.2*

Embedded MCP server source and prefixed variable documentation for improved portability.

---

#### Added

1. **Embedded MCP Server Source** — Narsil source code now included in `mcp_server/` folder for portability
2. **Prefixed Variable Documentation** — Install guide updated with Code Mode `{manual}_{VAR}` requirement

---

#### Changed

1. **Install Guide** — Added "Variable not found" troubleshooting entry
2. **Install Guide** — Added note about `narsil_VOYAGE_API_KEY` requirement for Code Mode

---

#### Fixed

1. **Documentation Gap** — Code Mode requires prefixed environment variables (e.g., `narsil_VOYAGE_API_KEY`)

---

### [1.0.2.5] - 2026-01-02

*Environment version: 1.0.2.5*

Neural backend comparison and configuration improvements.

---

#### Added

1. **Neural Backend Comparison Table** — Voyage AI (recommended), OpenAI, Local ONNX
2. **Backend Configuration Examples** — Separate examples for each neural backend
3. **HTTP Server Stdin Pipe Trick** — Documentation for advanced server management

---

#### Changed

1. **Config Examples** — All now include `--watch` flag for auto-reindexing
2. **Install Script Help Text** — Expanded with Neural Search Backends section

---

### [1.0.1.6] - 2025-12-30

*Environment version: 1.0.1.6*

Server management scripts and index dependency documentation.

---

#### Added

1. **`narsil-server.sh`** — HTTP server management script
2. **`narsil-search.sh`** — CLI wrapper for reliable search
3. **Index Dependency Documentation** — Clear guidance on indexing requirements

---

#### Breaking

1. **Parameter Names Changed** — All Narsil tools updated:
   - `kind` → `symbol_type` in symbol queries
   - `name` → `symbol` in definition lookups
   - `function_name` → `function` in call graph tools
   - Added `repo: "unknown"` requirement for all tools

---

### [1.0.1.5] - 2025-12-29

*Environment version: 1.0.1.5*

Known issues documentation and working features clarification.

---

#### Known Issues Documented

1. **Call Graph Empty for JavaScript** — tree-sitter limitation
2. **Security Scan Limited** — Backend-focused rules only
3. **Neural Search Stale After Index Clear** — Requires reindex

---

#### Working Features

1. **`find_symbols`** — Symbol discovery
2. **`get_symbol_definition`** — Definition lookups
3. **`get_file`** — File content retrieval
4. **Git Integration** — Full Git features

---

### [1.0.1.4] - 2025-12-29

*Environment version: 1.0.1.4*

Skill creation guide and known issues documentation.

---

#### Added

1. **Skill Creation Guide** — Required templates documentation
2. **Skill Advisor Configuration** — Setup documentation

---

#### Known Issues Documented

1. **Persistence Bug** — Indexes regenerate ~45-60s on startup
2. **Unicode Bug** — Box-drawing characters crash chunking

---

### [1.0.1.3] - 2025-12-29

*Environment version: 1.0.1.3*

HTTP backend and React frontend documentation.

---

#### Added

1. **HTTP Backend Server** — Port 3000 documentation
2. **React Frontend** — Port 5173 visualization docs
3. **Five Graph View Types** — `import`, `call`, `symbol`, `hybrid`, `flow`

---

#### Fixed

1. **Tool Names** — Corrected in documentation
2. **Language Count** — 16 → 15 (accurate count)

---

### [1.0.1.2] - 2025-12-29

*Environment version: 1.0.1.2*

Project-local index support and HTTP server mode documentation.

---

#### Added

1. **Project-Local Index** — `.narsil-index/` support
2. **`--persist` Flag** — Index persistence documentation
3. **`--index-path` Option** — Custom index path documentation
4. **HTTP Server Mode** — Server mode documentation

---

### [1.0.1.1] - 2025-12-29

*Environment version: 1.0.1.1*

Embedding model fix and frontmatter corrections.

---

#### Fixed

1. **Embedding Model** — `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct dimensions
2. **Invalid Frontmatter** — Search commands frontmatter corrected

---

### [1.0.1.0] - 2025-12-29

*Environment version: 1.0.1.0*

Complete migration from LEANN to Narsil.

---

#### Breaking

1. **Complete Migration** — LEANN to Narsil
   - `leann_leann_search()` → `narsil.narsil_neural_search()`
   - `mcp-leann` skill → `mcp-narsil` skill
   - MLX embeddings → Voyage/OpenAI/ONNX backends

---

#### Added

1. **76 Specialized Tools** — Code intelligence tools
2. **Semantic Search** — Neural search capabilities
3. **Security Scanning** — Vulnerability detection
4. **Call Graph Analysis** — Function relationship mapping

---

### [1.0.0.0] - 2025-12-29

*Environment version: 1.0.0.0*

Initial release of mcp-narsil skill.

---

#### Added

1. **Initial Skill Release** — Narsil MCP integration via Code Mode
2. **Install Guide** — Setup documentation
3. **Reference Documentation** — Usage patterns and examples

---

## Narsil MCP Server Releases

*The following entries track releases of the external Narsil MCP server project.*

---

### [1.2.0] - 2025-01-04

New `exclude_tests` parameter across 22 tools, npm package distribution, and documentation improvements.

---

#### Added

1. **`exclude_tests` Parameter** — 22 tools now support filtering out test files:
   - Security tools (5): `check_owasp_top10`, `check_cwe_top25`, `find_injection_vulnerabilities`, `get_taint_sources`, `get_security_summary`
   - Analysis tools (5): `find_dead_code`, `find_uninitialized`, `find_dead_stores`, `check_type_errors`, `find_circular_imports`
   - Symbol tools (3): `find_symbols`, `find_references`, `find_symbol_usages`
   - Search tools (5): `search_code`, `semantic_search`, `hybrid_search`, `search_chunks`, `find_similar_code`
   - CallGraph tools (4): `get_call_graph`, `get_callers`, `get_callees`, `get_function_hotspots`
2. **npm Package** — Install via `npm install -g narsil-mcp` with automatic binary download
3. **Automated npm Publishing** — Release workflow publishes to npm registry

---

#### Changed

1. **README Restructured** — Claude Code configuration moved to first position, reduced from 1,186 to 951 lines (20% reduction)
2. **Documentation Reorganized** — WASM, Neural Search, and Frontend docs moved to dedicated files in `docs/`
3. **Install Script Enhanced** — Now shows Claude Code quick-start guide with `.mcp.json` example

---

#### Defaults

1. **Security/Analysis Tools** — `exclude_tests` defaults to `true` (excludes tests)
2. **Symbol/Search Tools** — `exclude_tests` defaults to `false` (includes tests)
3. **CallGraph Tools** — Accepts parameter but filtering requires call graph rebuild

---

### [1.1.6] - 2025-01-03

C++ parser fix for tree-sitter query syntax.

---

#### Fixed

1. **C++ Parser** — Fixed tree-sitter query syntax for C++ namespace and class declarations (previously caused parsing errors)

---

### [1.1.5] - 2025-01-01

HTTP timeout fix, CLI flag implementation, and MCP method completion.

---

#### Fixed

1. **`--http` Timeout with Zed Editor** — HTTP server and MCP server were mutually exclusive, causing timeouts. Now HTTP runs in background via `tokio::spawn` while MCP runs on main task.
2. **`--preset` CLI Flag Missing** — Added the `--preset` flag that was documented but never implemented
3. **`prompts/get` Method Not Found** — Implemented MCP `prompts/get` method with full prompt templates

---

#### Added

1. **CLI Preset Tests** — 6 new tests for CLI preset behavior
2. **`prompts/get` Tests** — 6 new tests for functionality
3. **HTTP/MCP Concurrent Tests** — 6 new tests for concurrent operation

---

#### Changed

1. **Documentation Updated** — Clarifies `--http` runs alongside MCP (not instead of)
2. **Scoop Note Added** — Optional features (ONNX, frontend) require source build

---

### [1.1.1] - 2025-12-28

Package manager distribution across all platforms.

---

#### Added

1. **Homebrew Tap** — macOS/Linux (`brew install postrv/narsil/narsil-mcp`)
2. **crates.io Publishing** — Automated in release workflow (`cargo install narsil-mcp`)
3. **AUR Packages** — Arch Linux (`narsil-mcp` and `narsil-mcp-bin`)
4. **Scoop Bucket** — Windows (`scoop install narsil-mcp`)
5. **GitHub Releases** — Versioned tarballs (`.tar.gz` for Unix, `.zip` for Windows)
6. **SHA256 Checksums** — Generated for all release artifacts
7. **Comprehensive Install Guide** — `docs/INSTALL.md` with platform-specific instructions

---

#### Changed

1. **Release Workflow** — Now creates versioned tarballs instead of individual binaries
2. **`install.sh` Updated** — Downloads versioned tarballs with proper extraction

---

#### Fixed

1. **Windows CI Test Failure** — `test_claude_code_path` now handles both `HOME` and `USERPROFILE` env vars
2. **Tree-Sitter Query Warnings** — TypeScript/TSX fixed (`identifier` → `type_identifier` for class names)
3. **Kotlin Tree-Sitter Warning** — Removed unsupported `interface_declaration` node
4. **Neural API Key Warning** — Now suggests running `narsil-mcp config init --neural`
5. **Version String** — Now uses `CARGO_PKG_VERSION` instead of hardcoded value

---

### [1.1.0] - 2025-12-28

Major release with intelligent tool selection and configuration system.

---

#### Added

1. **Automatic Editor Detection & Presets** — 4 built-in presets:
   - **Minimal** (26 tools, ~4,686 tokens) - Zed, Cursor - **61% token reduction**
   - **Balanced** (51 tools, ~8,948 tokens) - VS Code, IntelliJ - **25% token reduction**
   - **Full** (69 tools, ~12,001 tokens) - Claude Desktop, comprehensive analysis
   - **Security-focused** (~30 tools) - Security audits and supply chain analysis
2. **Automatic Client Detection** — From MCP `initialize` request
3. **Configuration System** — Multi-source loading (default → user → project → env → CLI)
4. **Configuration Validation** — Helpful error messages
5. **Interactive Config Wizard** — `narsil-mcp config init`
6. **New CLI Commands** — `config show`, `config validate`, `config init`, `config preset`, `config export`, `tools list`, `tools search`
7. **4 New Languages** — Bash, Ruby, Kotlin, PHP
8. **Security Hardening Module** — Secret redaction, file size limits, sensitive file detection
9. **Expanded Security Rules** — All 14 supported languages (111 total rules, 50% increase)

---

#### Performance

1. **Config Loading** — <10ms
2. **Tool Filtering** — <1ms
3. **494 Total Tests** — 100% success rate

---

### [1.0.0] - 2025-12-23

Initial stable release with security fixes.

---

#### Security

1. **Fixed 7 Path Traversal Vulnerabilities** — CWE-22 in taint analysis, fix suggestions, export map, clone detection, type inference, type errors, and taint flow functions

---

#### Changed

1. **Neural Feature Split** — Split into `neural` (TF-IDF + API embeddings) and `neural-onnx` (local ONNX inference)
2. **ort Dependency Updated** — 2.0.0-rc.10

---

#### Added

1. **Test File Detection** — For security scanning
2. **`exclude_tests` Parameter** — For `scan_security`

---

### [0.2.0] - 2025-12-22

Advanced features and security rules engine.

---

#### Added

1. **Phase 6: Advanced Features** — Merkle indexing, cross-language symbols, fuzzy search, import/export graphs
2. **Phase 5: Supply Chain Security** — SBOM, vulnerability checking, license compliance
3. **Phase 4: Security Rules Engine** — OWASP Top 10, CWE Top 25, custom YAML rules
4. **Phase 3: Taint Analysis** — Source-to-sink tracking, injection detection

---

### [0.1.0] - 2025-12-20

Initial release of Narsil MCP server.

---

#### Added

1. **Initial Release** — MCP server implementation
2. **Multi-Language Parsing** — 9 languages
3. **Symbol Extraction and Search** — Code symbol management
4. **Full-Text Code Search** — BM25 ranking
5. **TF-IDF Similarity Search** — Semantic similarity
6. **Call Graph Analysis** — Function relationship mapping
7. **Git Integration** — Version control support
8. **LSP Integration** — Language server protocol
9. **Remote GitHub Repository Support** — Remote codebase access

---

See [SKILL.md](./SKILL.md) for usage documentation.
