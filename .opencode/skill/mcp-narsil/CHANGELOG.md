# Changelog

All notable changes to the **mcp-narsil** skill are documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/).

Public Release: https://github.com/MichelKerkmeester/opencode-dev-environment

---

## 1.0.2.x Series

### [**1.0.2.5**] - 2026-01-02

Documentation improvements for neural embedding backends.

#### Added
- Neural backend comparison table showing all 3 options: Voyage AI (recommended) · OpenAI · Local ONNX
- Separate configuration examples for each neural backend in install guide
- HTTP server stdin pipe trick documentation (`tail -f /dev/null |` to prevent EOF shutdown)
- Symbol/Hybrid view parameter requirements (`root`, `repo`) in visualization docs

#### Changed
- All Narsil config examples now include `--watch` flag for auto-reindexing
- Install script help text expanded with Neural Search Backends section

#### Fixed
- `install-narsil.sh` generating invalid config with `_note`, `_neural_backends` fields that break Code Mode parsing
- Missing `--watch` flag in all recommended Narsil configurations

---

## 1.0.1.x Series

### [**1.0.1.6**] - 2025-12-30

Critical parameter naming fixes for Narsil tools.

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

### [**1.0.1.5**] - 2025-12-29

Documents JavaScript-specific Narsil limitations.

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

### [**1.0.1.4**] - 2025-12-29

Documents discovered Narsil bugs and limitations.

#### Known Issues
- Persistence bug: indexes regenerate ~45-60s on startup
- Unicode bug: box-drawing characters crash chunking

---

### [**1.0.1.3**] - 2025-12-29

HTTP server and visualization documentation.

#### Added
- HTTP backend server (port 3000) for graph data
- React frontend (port 5173) for interactive visualization
- Five graph view types: `import` · `call` · `symbol` · `hybrid` · `flow`

#### Fixed
- Tool names corrected in documentation
- Language count: 16 → 15

---

### [**1.0.1.2**] - 2025-12-29

Project-local index support.

#### Added
- Project-local `.narsil-index/` instead of shared `~/.cache/narsil-mcp/`
- `--persist` flag for index persistence
- `--index-path` option for custom index location
- `save_index` tool for manual saves
- HTTP server mode documentation

---

### [**1.0.1.1**] - 2025-12-29

Embedding dimension fix.

#### Fixed
- `voyage-code-3` (1024-dim) → `voyage-code-2` (1536-dim) for correct embedding dimensions

---

### [**1.0.1.0**] - 2025-12-29

Initial release - migration from LEANN to Narsil.

#### Breaking
- LEANN completely removed
- `leann_leann_search()` → `narsil.narsil_neural_search()`
- `mcp-leann` skill → `mcp-narsil` skill
- MLX embeddings → Voyage/OpenAI/ONNX backends

#### Added
- **mcp-narsil skill** with 76 specialized tools:
  - Semantic/neural search
  - Security scanning (OWASP, CWE, taint analysis)
  - Call graph analysis (CFG, DFG, callers/callees)
  - Structural queries (symbols, definitions, references)
  - Supply chain security (SBOM, license compliance)
- Tool reference documentation
- Security guide
- Call graph guide
- Quick start guide
