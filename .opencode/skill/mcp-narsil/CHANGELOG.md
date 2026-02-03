# Changelog - mcp-narsil

All notable changes to the mcp-narsil skill are documented in this file.

> Part of [OpenCode Dev Environment](https://github.com/MichelKerkmeester/opencode-spec-kit-framework)
>
> For upstream Narsil MCP server changes, see [mcp_server/CHANGELOG.md](./mcp_server/CHANGELOG.md)

---

## [**1.0.3.3**] - 2026-02-03

Script comment standardization per workflows-code code_style_guide.md.

---

### Changed

1. **update-narsil.sh** — Added 3-line box-drawing file header (═══ style to match narsil-server.sh, narsil-search.sh)

---

## [**1.0.3.2**] - 2026-01-05

Embeds MCP server source code and documents prefixed environment variable requirement.

---

### New

1. **Embedded MCP Server** — Narsil source embedded in `mcp_server/` directory for portability
2. **Environment Template** — Prefixed variable documentation for Code Mode

---

### Changed

1. **Install Guide** — Added prefixed variable note in Neural Search Configuration
2. **Troubleshooting** — New entry for "Variable not found" errors

---

### Fixed

1. **Documentation Gap** — Code Mode requires `{manual}_{VAR}` format (e.g., `narsil_VOYAGE_API_KEY`)

---

## [**1.0.2.4**] - 2026-01-02

Configuration fixes for Code Mode compatibility.

---

### Fixed

1. **Invalid Config** — `install-narsil.sh` was generating invalid config with `_note`, `_neural_backends` fields that break Code Mode parsing
2. **Missing Flag** — Added missing `--watch` flag in all recommended Narsil configurations

---

## [**1.0.1.9**] - 2025-12-28

Infrastructure updates for Narsil integration.

---

### Added

1. **Server Script** — `narsil-server.sh` for HTTP server management
2. **Search Wrapper** — `narsil-search.sh` CLI wrapper for reliable search
3. **Index Documentation** — Index dependency documentation

---

## [**1.0.1.7**] - 2025-12-28

Index location improvements.

---

### Added

1. **Project-Local Index** — `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
2. **Persist Flag** — `--persist` for index persistence
3. **Custom Path** — `--index-path` option for custom index location

---

## [**1.0.1.6**] - 2025-12-27

Migration from LEANN to Narsil.

---

### Changed

1. **LEANN removed** — Replaced with Narsil for semantic code search
2. **Tool migration** — `leann_leann_search()` → `narsil.narsil_neural_search()`
3. **Skill renamed** — `mcp-leann` → `mcp-narsil`
4. **Embedding backends** — MLX → Voyage/OpenAI/ONNX options

---

## [**1.0.0.0**] - 2025-12-27

Initial release of mcp-narsil skill for code intelligence.

---

### Features

1. **90 Code Intelligence Tools** — Comprehensive codebase analysis:
   - **Symbol Search** — `find_symbols`, `find_references`, `find_symbol_usages`
   - **Neural Search** — `neural_search`, `semantic_search`, `hybrid_search` (requires Voyage API key)
   - **Security Scanning** — `check_owasp_top10`, `check_cwe_top25`, `find_injection_vulnerabilities`
   - **Call Graph** — `get_call_graph`, `get_callers`, `get_callees`, `get_function_hotspots`
   - **Project Structure** — `get_project_structure`, `get_file_tree`, `get_module_dependencies`
   - **Dead Code** — `find_dead_code`, `find_dead_stores`, `find_uninitialized`
   - **Type Analysis** — `infer_types`, `check_type_errors`, `get_typed_taint_flow`
   - **SPARQL/RDF** — `sparql_query`, `list_sparql_templates`, `run_sparql_template`

2. **Multi-Language Support** — 20+ languages including:
   - Rust, Go, Python, JavaScript, TypeScript
   - Java, C#, Kotlin, Swift, C, C++
   - Ruby, PHP, Bash, PowerShell
   - Erlang, Elm, Fortran, Nix, Groovy

3. **Editor Presets**:
   - **Minimal** (26 tools, ~4.7k tokens) — Zed, Cursor
   - **Balanced** (51 tools, ~9k tokens) — VS Code, IntelliJ
   - **Full** (69 tools, ~12k tokens) — Claude Desktop

4. **Code Mode Integration** — Access via `call_tool_chain()` with `narsil.narsil_*` naming

### Documentation

- `SKILL.md` — AI agent instructions with semantic search workflows
- `README.md` — User documentation with tool categories
- `INSTALL_GUIDE.md` — Installation and configuration guide
- `references/` — Tool reference and patterns documentation

---

*For full OpenCode release history, see the [global CHANGELOG](../../../CHANGELOG.md)*
