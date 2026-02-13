# OpenCode Dev Environment - Rewritten Release Notes

All 16 releases rewritten according to the standardized template based on Keep a Changelog and Conventional Commits.

## How to Update GitHub Releases

For each release below:
1. Go to https://github.com/MichelKerkmeester/opencode-dev-environment/releases
2. Click on the release tag
3. Click "Edit release"
4. Replace the body with the content below (everything after the `## [vX.Y.Z.B]` header)
5. Save

---

## [v1.0.1.6] - 2025-12-30

Fixes critical Narsil MCP parameter naming issues and adds HTTP server workaround for reliable search functionality.

### ⚠️ Breaking Changes

> **Parameter updates required** - All Narsil tool calls need parameter name corrections.

| Before | After | Affected Tools |
|--------|-------|----------------|
| `kind` | `symbol_type` | `find_symbols` |
| `name` | `symbol` | `get_symbol_definition` |
| `function_name` | `function` | `get_call_graph`, `get_callers`, `get_callees` |
| (missing) | `repo: "unknown"` | All repo-scoped tools |

### 🚀 Added

- **narsil-server.sh** - HTTP server management script (start/stop/restart/status/logs)
- **narsil-search.sh** - Search CLI wrapper (neural/semantic/code/hybrid/symbols)
- **Index Dependency Classification** - Documents which tools need warm indexes vs instant AST-based

### 🔧 Changed

- **Tool documentation** - Fixed ALL 39 HIGH PRIORITY tool examples with correct parameters
- **Search commands** - Updated `/search:code` and `/search:index` with correct Narsil signatures

---

### 📁 Files Changed

- **9 files** changed
- Combines: Parameter fixes + HTTP server scripts + Index classification docs

| File | Change |
|------|--------|
| `.opencode/skill/mcp-narsil/SKILL.md` | Fixed params, HTTP workaround, function categories |
| `.opencode/skill/mcp-narsil/README.md` | Updated structure, HTTP troubleshooting |
| `.opencode/skill/mcp-narsil/references/tool_reference.md` | Fixed ALL 39 HIGH PRIORITY tool examples |
| `.opencode/skill/mcp-narsil/references/quick_start.md` | Fixed Key Commands, HTTP workaround |
| `.opencode/skill/mcp-narsil/assets/tool_categories.md` | Added Index Dependency Classification |
| `.opencode/skill/mcp-narsil/scripts/narsil-server.sh` | **NEW** - HTTP server management |
| `.opencode/skill/mcp-narsil/scripts/narsil-search.sh` | **NEW** - Search CLI wrapper |
| `.opencode/command/search/code.md` | Fixed Narsil tool signatures |
| `.opencode/command/search/index.md` | Added Code Mode behavior note |

---

### 🔧 Upgrade Notes

1. **Update** all Narsil tool calls with correct parameter names (see Breaking Changes table)

2. **For reliable search**, use HTTP server instead of Code Mode:
   ```bash
   # Start server (indexes build once and stay warm)
   ./.opencode/skill/mcp-narsil/scripts/narsil-server.sh start
   
   # Wait ~60s for indexes, then search reliably
   ./.opencode/skill/mcp-narsil/scripts/narsil-search.sh neural "how does X work"
   ```

3. **AST-based tools** work immediately via Code Mode (no wait needed):
   - `find_symbols`, `get_symbol_definition`, `scan_security`, `find_dead_code`

---

[v1.0.1.6]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.5...v1.0.1.6

---

## [v1.0.1.5] - 2025-12-29

Documents JavaScript-specific Narsil limitations discovered during testing and adds MCP restart guidance.

### 🚀 Added

- **JavaScript Limitations Documentation** - Call graph, security scan, and neural search limitations for JS

| Limitation | Impact | Workaround |
|------------|--------|------------|
| Call Graph Empty | tree-sitter-javascript doesn't extract dynamic calls | Use `find_symbols` + `get_symbol_definition` |
| Security Scan Limited | Rules focus on backend languages | Use ESLint security plugins, Snyk, npm audit |
| Neural Search After Clear | Clearing index leaves MCP with stale state | Restart OpenCode |

- **Working JS Features** - Documented what works reliably:
  - `find_symbols` - Find all functions/classes
  - `get_symbol_definition` - Get full function body
  - `get_file` - Retrieve file contents
  - Git integration (contributors, recent changes)

### 🔧 Changed

- **Narsil documentation** - Added Known Limitations section for JavaScript projects
- **Search commands** - Added restart guidance and JS limitations

---

### 📁 Files Changed

- **5 files** changed | **~105** insertions
- Combines: JS limitations docs + MCP restart guidance

| File | Change |
|------|--------|
| `.opencode/skill/mcp-narsil/SKILL.md` | Added Known Limitations section (5 items) |
| `.opencode/skill/mcp-narsil/references/quick_start.md` | JS troubleshooting, restart guidance |
| `.opencode/skill/mcp-narsil/references/call_graph_guide.md` | JS call graph limitations |
| `.opencode/skill/mcp-narsil/references/security_guide.md` | JS security coverage limitations |
| `.opencode/command/search/index.md` | Restart guidance, JS limitations |

---

### 🔧 Upgrade Notes

1. **For JavaScript projects**, use structural queries instead of call graph:
   ```javascript
   narsil.narsil_find_symbols({ symbol_type: "function" })
   narsil.narsil_get_symbol_definition({ symbol: "functionName" })
   ```

2. **After clearing index**, restart OpenCode for complete rebuild

3. **For JS security**, supplement Narsil with dedicated tools (ESLint, Snyk, npm audit)

---

[v1.0.1.5]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.4...v1.0.1.5

---

## [v1.0.1.4] - 2025-12-29

Documents discovered Narsil bugs and limitations, updates search commands, and enhances Skill Creation guide.

### 🚀 Added

- **Narsil Known Limitations** - Persistence bug, Unicode bug documentation

| Limitation | Impact | Workaround |
|------------|--------|------------|
| Persistence Bug | Neural/BM25/TF-IDF indexes regenerate on startup (~45-60s) | Run as long-lived server |
| Unicode Bug | Box-drawing chars (─, │) crash chunking | Avoid chunk-based tools or remove chars |

- **Skill Advisor Setup** - Section 12 in Skill Creation guide

### 🔧 Changed

- **Search commands** - Added neural search rebuild warning, error handling, Known Limitations
- **Skill Creation guide** - Added Required Templates table, expanded File Locations, Skill Advisor config

---

### 📁 Files Changed

- **7 files** changed | **~130** insertions
- Combines: Narsil limitations docs + Skill Creation guide updates

| File | Change |
|------|--------|
| `.opencode/skill/mcp-narsil/SKILL.md` | Persistence limitation note |
| `.opencode/skill/mcp-narsil/README.md` | **NEW Section** - Known Limitations & Bugs |
| `.opencode/skill/mcp-narsil/references/tool_reference.md` | Known Limitations section |
| `.opencode/skill/mcp-narsil/assets/tool_categories.md` | Known Limitations section |
| `.opencode/command/search/code.md` | Neural warning, error handling |
| `.opencode/command/search/index.md` | Known Limitations section |
| `.opencode/install_guides/SET-UP - Skill Creation.md` | Templates, Section 12, checklist |

---

### 🔧 Upgrade Notes

1. **For best neural search performance**, run Narsil as long-lived server

2. **If using chunk-based tools**, ensure source files don't contain Unicode box-drawing characters

3. **After creating new skills**, configure Skill Advisor per Section 12

---

[v1.0.1.4]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.3...v1.0.1.4

---

## [v1.0.1.3] - 2025-12-29

Documents Narsil's HTTP server and React frontend visualization for interactive code graph exploration.

### 🚀 Added

- **HTTP Server Documentation** - Backend (port 3000) + Frontend (port 5173) setup
- **Graph Views** - import, call, symbol, hybrid, flow visualization options

| View | Best For | Description |
|------|----------|-------------|
| `import` | JavaScript/TypeScript | Module import/export relationships |
| `call` | Rust, Python | Function call relationships |
| `symbol` | All languages | Symbol definitions and references |
| `hybrid` | Comprehensive | Combined import + call graph |
| `flow` | Security | Data flow visualization |

- **Performance Tips** - Large graph handling, directory indexing, node_modules exclusion

### 🐛 Fixed

- **Tool names** - `narsil_analyze_complexity` → `narsil_get_complexity`
- **Tool names** - `narsil_semantic_search` → `narsil_neural_search`
- **Language count** - 16 → 15 (corrected)

---

### 📁 Files Changed

- **6 files** changed | **+214** insertions, **-32** deletions
- Combines: HTTP visualization docs + Tool name fixes

| File | Change |
|------|--------|
| `.opencode/install_guides/MCP/MCP - Narsil.md` | **NEW Section 5** - HTTP Server & Visualization |
| `.opencode/install_guides/README.md` | HTTP visualization mention |
| `.opencode/skill/mcp-narsil/README.md` | **NEW Section 6** - HTTP Server & Visualization |
| `.opencode/skill/mcp-narsil/SKILL.md` | HTTP info in Integration Points |
| `.opencode/command/search/code.md` | Fixed tool names |
| `.opencode/command/search/index.md` | Fixed HTTP docs, language count |

---

### 🔧 Upgrade Notes

1. **To use visualization**, start both servers:
   ```bash
   # Terminal 1: Backend
   narsil-mcp --repos . --http --http-port 3000
   
   # Terminal 2: Frontend
   cd "${NARSIL_PATH}/frontend" && npm install && npm run dev
   ```

2. **For JavaScript projects**, use `import` view (not `call`)

3. **For large codebases**, index specific directories to avoid browser crashes

---

[v1.0.1.3]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.2...v1.0.1.3

---

## [v1.0.1.2] - 2025-12-29

Adds project-local Narsil index support, documents index persistence, and standardizes output styling.

### 🚀 Added

- **Project-Local Index** - Each project now has isolated `.narsil-index/` instead of shared global cache
- **Index Persistence** - `--persist` flag, `--index-path` option, `save_index` MCP tool
- **HTTP Server Mode** - For pre-warming indexes on large codebases

| Before | After |
|--------|-------|
| `~/.cache/narsil-mcp/` (shared) | `.narsil-index/` (per-project) |

### 🔧 Changed

- **Box diagram styling** - Converted all output examples to consistent format
- **SKILL.md section header** - Changed to "📖 OVERVIEW" for template compliance
- **Version references** - Removed all `Narsil v1.0.0` specific references

---

### 📁 Files Changed

- **9 files** changed
- Combines: Project-local index + Index persistence docs + Style fixes

| File | Change |
|------|--------|
| `.utcp_config.json` | Added `--index-path .narsil-index`, removed v1.0.0 refs |
| `.gitignore` | Added `.narsil-index/` |
| `.opencode/install_guides/MCP/MCP - Narsil.md` | Added Index Persistence section, fixed orphaned marker |
| `.opencode/install_guides/README.md` | Updated Narsil config example |
| `.opencode/command/search/code.md` | Box diagram styling (5 outputs) |
| `.opencode/command/search/index.md` | Added HTTP server mode, box diagram styling (5 outputs) |
| `.opencode/skill/mcp-narsil/SKILL.md` | Added persistence config, section header fix, removed v1.0.0 refs |
| `.opencode/skill/mcp-narsil/README.md` | Added full persistence section, removed v1.0.0 refs |
| `.opencode/skill/mcp-narsil/references/tool_reference.md` | Added save_index tool |

---

### 🔧 Upgrade Notes

1. **Delete old global index** (optional, frees space):
   ```bash
   rm -rf ~/.cache/narsil-mcp/
   ```

2. **Add to .gitignore**:
   ```
   .narsil-index/
   ```

3. **Update .utcp_config.json** to include `--index-path .narsil-index`

---

[v1.0.1.2]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.1...v1.0.1.2

---

## [v1.0.1.1] - 2025-12-29

Fixes Narsil neural search configuration for embedding dimension compatibility.

### 🐛 Fixed

- **Voyage embedding model** - Changed from `voyage-code-3` (1024-dim) to `voyage-code-2` (1536-dim)

| Model | Dimensions | Narsil v1.0.0 Compatible |
|-------|------------|--------------------------|
| `voyage-code-2` | 1536 | ✅ Yes |
| `voyage-code-3` | 1024 | ❌ No |

- **Removed invalid frontmatter** - Cleaned up search command metadata

---

### 📁 Files Changed

- **2 files** changed | **+4** insertions, **-3** deletions
- Combines: Neural model fix + Frontmatter cleanup

| File | Change |
|------|--------|
| `.utcp_config.json` | Fixed neural model to voyage-code-2 (1536-dim) |
| `.opencode/command/search/index.md` | Removed invalid frontmatter field |

---

### 🔧 Upgrade Notes

1. **If neural search was failing**, this fixes it
2. **No action required** if you already use `voyage-code-2`

---

[v1.0.1.1]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.1.0...v1.0.1.1

---

## [v1.0.1.0] - 2025-12-29

Complete migration from LEANN (local MLX embeddings) to Narsil (unified code intelligence with neural search), consolidating all code search into a single, more powerful tool.

### ⚠️ Breaking Changes

> **Migration required** - LEANN is completely removed. See Upgrade Notes below.

| Before | After | Migration |
|--------|-------|-----------|
| `leann_leann_search()` | `narsil.narsil_neural_search()` | Update all search calls |
| LEANN MCP server | Narsil MCP (via Code Mode) | Update opencode.json |
| `mcp-leann` skill | `mcp-narsil` skill | Use new skill |
| MLX local embeddings | Voyage/OpenAI/ONNX backends | Configure API key or ONNX |

### ❌ Removed

- **mcp-leann skill** - Entire skill removed (5 files)
- **LEANN MCP server** - Removed from opencode.json

### 🚀 Added

- **Narsil integration** - 76 specialized tools for code intelligence
- **Multiple embedding backends** - Voyage API, OpenAI API, ONNX local
- **Redesigned search commands** - `/search:code` and `/search:index` rebuilt for Narsil

### 🔧 Changed

- **Skills reduced** from 8 to 7
- **Search routing** now uses Narsil for all semantic search

---

### 📁 Files Changed

- **45 files** changed | **+961** insertions, **-3,352** deletions
- Combines: LEANN removal + Narsil integration + Search command redesign

| File | Change |
|------|--------|
| `.opencode/skill/mcp-leann/SKILL.md` | **DELETED** |
| `.opencode/skill/mcp-leann/README.md` | **DELETED** |
| `.opencode/skill/mcp-leann/references/tool_catalog.md` | **DELETED** |
| `.opencode/skill/mcp-leann/scripts/update-leann.sh` | **DELETED** |
| `opencode.json` | Removed LEANN MCP server |
| `.utcp_config.json` | Added Narsil configuration |
| `.opencode/command/search/code.md` | Redesigned for Narsil |
| `.opencode/command/search/index.md` | Redesigned for Narsil |
| `AGENTS.md` | Updated tool routing |
| *(+36 more files)* | Various Narsil updates |

---

### 🔧 Upgrade Notes

1. **Delete LEANN index** (optional):
   ```bash
   rm -rf ~/.leann/
   ```

2. **Configure Neural Search Backend**:

   | Backend | Best For | Setup |
   |---------|----------|-------|
   | Voyage API | Best quality | `VOYAGE_API_KEY` env var |
   | OpenAI API | Alternative | `OPENAI_API_KEY` env var |
   | ONNX Local | Offline | `--neural-backend onnx` flag |

3. **Restart OpenCode** to load new configuration

4. **Verify** via Code Mode:
   ```javascript
   narsil.narsil_neural_search({ query: "how does auth work", top_k: 5 })
   ```

---

[v1.0.1.0]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.8...v1.0.1.0

---

## [v1.0.0.8] - 2025-12-28

Consolidates to MLX + Qwen3 as the single embedding option for LEANN, establishing clear separation between code search and document search.

### ❌ Removed

- **Voyage AI embedding option** - Removed in favor of MLX
- **Gemini embedding option** - Removed
- **Contriever embedding option** - Removed

### 🔧 Changed

- **Single embedding path** - MLX + Qwen3 only
- **Clear tool separation** established:

| Tool | Purpose | Index |
|------|---------|-------|
| LEANN | Code search | `src/` only |
| Spec Kit Memory | Document search | `specs/`, `.opencode/` |

### 🚀 Added

- **Shell alias** - `leann-build` for simplified indexing

---

### 📁 Files Changed

- **4 files** changed
- Combines: Embedding simplification + Tool separation docs

| File | Change |
|------|--------|
| `.opencode/skill/mcp-leann/SKILL.md` | MLX + Qwen3 only |
| `.opencode/skill/mcp-leann/README.md` | Updated setup guide |
| `.opencode/install_guides/MCP - LEANN.md` | Simplified configuration |
| `AGENTS.md` | Tool separation clarification |

---

### 🔧 Upgrade Notes

1. **Update shell alias** - Replace old LEANN aliases:
   ```bash
   alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'
   ```

2. **Rebuild indexes** for best results with Qwen3:
   ```bash
   leann-build my-project --docs src/ --force
   ```

---

[v1.0.0.8]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.7...v1.0.0.8

---

## [v1.0.0.7] - 2025-12-27

Major upgrade to semantic search with Qwen3 embedding model (50% better code understanding) and memory-efficient indexing for large repositories.

### 🚀 Added

- **Qwen3 Embedding Model** - `mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ`

| Metric | Improvement |
|--------|-------------|
| Semantic Quality | 50% better code understanding |
| Runtime | MLX-native on Apple Silicon |
| Memory | 4-bit quantization for efficiency |

- **Progressive Scope Indexing** - Memory-safe strategy for large projects
- **Shell Alias Support** - `leann-build` for verbose model flags

### 🔧 Changed

- **Default embedding model** - Switched from `facebook/contriever` to Qwen3
- **AGENTS.md** - Made frontend/backend agnostic (removed Chrome DevTools hard dependency)
- **Documentation Levels** - Aligned with `level_specifications.md`

---

### 📁 Files Changed

- **6 files** changed
- Combines: Qwen3 upgrade + Memory-safe indexing + AGENTS.md cleanup

| File | Change |
|------|--------|
| `.opencode/skill/mcp-leann/SKILL.md` | Qwen3 model instructions |
| `.opencode/skill/mcp-leann/README.md` | Updated setup guide |
| `.opencode/skill/mcp-leann/references/tool_catalog.md` | New capabilities |
| `.opencode/install_guides/MCP - LEANN.md` | Qwen3 installation |
| `.opencode/scripts/update-leann.sh` | Automated migration script |
| `AGENTS.md` | Frontend/backend agnostic cleanup |

---

### 🔧 Upgrade Notes

1. **Add alias** to your shell config:
   ```bash
   alias leann-build='leann build --embedding-mode mlx --embedding-model "mlx-community/Qwen3-Embedding-0.6B-4bit-DWQ"'
   ```

2. **Rebuild index** with new model:
   ```bash
   leann-build <index_name> --docs src/
   ```

3. **Run update script** (optional):
   ```bash
   ./update-leann.sh
   ```

---

[v1.0.0.7]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.6...v1.0.0.7

---

## [v1.0.0.6] - 2025-12-27

Enforces `@write` agent requirement for `/create` commands to ensure quality gates for skill creation.

### 🔧 Changed

- **Skill Creation** - Now requires `@write` agent prefix
- **Multiple enforcement layers**:

| Layer | Enforcement |
|-------|-------------|
| HARD BLOCK section | Visual warning with verification checklist |
| Prompt prefix | `@write` added to AI prompt |
| Prompt body | Prerequisite check with STOP instruction |
| Prerequisites table | `@write agent` row added |
| Validation command | `ls .opencode/agent/write.md` check |

---

### 📁 Files Changed

- **2 files** changed
- Combines: Write agent enforcement across multiple layers

| File | Change |
|------|--------|
| `.opencode/install_guides/SET-UP - Skill Creation.md` | Write agent enforcement |
| `AGENTS.md` | Updated agent requirement documentation |

---

### 🔧 Upgrade Notes

1. **Skill creation now requires `@write` prefix**:
   ```
   @write I want to create a new skill...
   ```

2. **Existing skills unaffected** - Enforcement only applies to new skill creation

---

[v1.0.0.6]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.5...v1.0.0.6

---

## [v1.0.0.5] - 2025-12-27

Enforces `@write` agent for skill creation and aligns documentation with current workflows (CDN deployment, JavaScript minification, Narsil integration).

### 🚀 Added

- **Quick Reference entries** in AGENTS_WEBFLOW.md:

| Task | Flow |
|------|------|
| CDN deployment | Minify → Verify → Update HTML versions → Upload to R2 → Browser test |
| JavaScript minify | `minify-webflow.mjs` → `verify-minification.mjs` → `test-minified-runtime.mjs` → Browser test |

### 🔧 Changed

- **SET-UP - Skill Creation.md** - Added write agent enforcement through multiple layers
- **AGENTS_WEBFLOW.md** - Added CDN deployment and JavaScript minify workflows
- **AGENTS.md** - Added Narsil to Code Mode MCP example
- **README.md** - Updated `workflows-code` description

---

### 📁 Files Changed

- **4 files** changed | **+50** insertions, **-13** deletions
- Combines: Write agent enforcement + CDN/minification workflows

| File | Change |
|------|--------|
| `.opencode/install_guides/SET-UP - Skill Creation.md` | +39 lines (write agent enforcement) |
| `AGENTS_WEBFLOW.md` | CDN/minification workflows, Narsil example |
| `AGENTS.md` | Narsil in Code Mode example |
| `README.md` | workflows-code description update |

---

### 🔧 Upgrade Notes

No breaking changes. Skill creation now requires `@write` prefix.

---

[v1.0.0.5]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.4...v1.0.0.5

---

## [v1.0.0.4] - 2025-12-27

Complete skill system overhaul: standardizes 69 reference/asset files across all 8 skills, adds template enforcement to documentation agent, and establishes universal documentation patterns.

### 🚀 Added

- **69 files standardized** across all 8 skills:

| Skill | References | Assets | Total |
|-------|------------|--------|-------|
| system-spec-kit | 12 | 3 | 15 |
| workflows-code | 14 | 2 | 16 |
| workflows-documentation | 7 | 8 | 15 |
| workflows-git | 5 | 3 | 8 |
| mcp-code-mode | 5 | 2 | 7 |
| mcp-narsil | 4 | 1 | 5 |
| workflows-chrome-devtools | 3 | 0 | 3 |
| mcp-leann | 1 | 0 | 1 |

- **Agent Folder README** - Comprehensive documentation at `.opencode/agent/README.md`
- **6 new reference files** - execution_methods.md, folder_structure.md, environment_variables.md, memory_system.md, cdn_deployment.md, minification_guide.md
- **2 update scripts** - update-leann.sh, update-code-mode.sh

### 🔧 Changed

- **SKILL.md bloat reduction** - system-spec-kit reduced from 903 → 689 lines (24%)
- **Universal Template Pattern** - All templates follow consistent structure
- **Documentation Agent** - Template-first workflow with validation

### 🐛 Fixed

- **Hardcoded path** in update-narsil.sh → Now uses `${NARSIL_MCP_DIR:-$HOME/narsil-mcp}`
- **Version numbers** in system-spec-kit → All package.json files now at 16.0.0
- **Anchor links** in workflows-code SKILL.md

---

### 📁 Files Changed

- **92 files** changed | **+4,158** insertions, **-1,410** deletions
- Combines: 69 file standardization + Agent README + New references + Bug fixes

| File | Change |
|------|--------|
| `.opencode/agent/README.md` | **NEW** - Comprehensive agent documentation |
| `.opencode/skill/system-spec-kit/SKILL.md` | Reduced from 903 → 689 lines |
| `.opencode/skill/system-spec-kit/references/environment_variables.md` | **NEW** - 15 env vars documented |
| `.opencode/skill/system-spec-kit/references/execution_methods.md` | **NEW** - Script execution patterns |
| `.opencode/skill/system-spec-kit/references/folder_structure.md` | **NEW** - Folder organization |
| `.opencode/skill/system-spec-kit/references/memory_system.md` | **NEW** - MCP tool behavior |
| `.opencode/skill/workflows-code/references/cdn_deployment.md` | **NEW** - CDN patterns |
| `.opencode/skill/workflows-code/references/minification_guide.md` | **NEW** - Minification guide |
| `.opencode/skill/mcp-leann/scripts/update-leann.sh` | **NEW** - Update script |
| `.opencode/skill/mcp-code-mode/scripts/update-code-mode.sh` | **NEW** - Update script |
| *(+82 more files)* | Standardization updates |

---

### 🔧 Upgrade Notes

1. **Restart MCP servers** to pick up documentation changes

2. **Verify skill routing** (optional):
   ```bash
   python3 .opencode/scripts/skill_advisor.py "test query"
   ```

3. **Re-index memories** if using Spec Kit Memory (optional):
   ```javascript
   memory_index_scan({ force: true })
   ```

---

[v1.0.0.4]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.3...v1.0.0.4

---

## [v1.0.0.3] - 2025-12-27

Significantly improves the constitutional memory system with 4x token budget increase and comprehensive documentation.

### 🚀 Added

- **Constitutional Token Budget** - Increased from ~500 to ~2000 tokens (4x)

| Metric | Before | After |
|--------|--------|-------|
| Token Budget | ~500 | ~2000 |
| Max Memories | ~5 | ~20 |
| Character Estimate | ~2000 | ~8000 |

- **Constitutional README** - Comprehensive documentation at `.opencode/skill/system-spec-kit/constitutional/README.md`
- **Database Cleanup Utility** - `scripts/cleanup-orphaned-vectors.js`

### 🔧 Changed

- **gate-enforcement.md** - Restructured with new sections:
  - First Message Protocol [HARD BLOCK]
  - Violation Recovery (4-step protocol)
  - 5 ANCHOR sections for granular retrieval

- **New trigger phrases** - Added: `build`, `generate`, `configure`, `analyze`

---

### 📁 Files Changed

- **10 files** changed | **+916** insertions, **-92** deletions
- Combines: Token budget increase + Constitutional docs + Cleanup utility

| File | Change |
|------|--------|
| `.opencode/skill/system-spec-kit/constitutional/README.md` | **NEW** - Comprehensive documentation |
| `.opencode/skill/system-spec-kit/constitutional/gate-enforcement.md` | Optimized with new sections |
| `.opencode/skill/system-spec-kit/mcp_server/lib/importance-tiers.js` | Token budget 500→2000 |
| `.opencode/skill/system-spec-kit/mcp_server/lib/vector-index.js` | Token budget 500→2000 |
| `.opencode/skill/system-spec-kit/mcp_server/context-server.js` | Token budget 500→2000 |
| `.opencode/skill/system-spec-kit/mcp_server/README.md` | Documentation update |
| `.opencode/skill/system-spec-kit/README.md` | Documentation update |
| `.opencode/skill/system-spec-kit/templates/context_template.md` | Documentation update |
| `.opencode/skill/system-spec-kit/config/config.jsonc` | Token budget 500→2000 |
| `.opencode/skill/system-spec-kit/scripts/cleanup-orphaned-vectors.js` | **NEW** - Database utility |

---

### 🔧 Upgrade Notes

1. **Restart MCP server** to pick up new token budget

2. **Re-index constitutional memories** (optional):
   ```javascript
   memory_index_scan({ force: true })
   ```

3. **If orphaned vectors cause issues**:
   ```bash
   node .opencode/skill/system-spec-kit/scripts/cleanup-orphaned-vectors.js
   ```

---

[v1.0.0.3]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.2...v1.0.0.3

---

## [v1.0.0.2] - 2025-12-26

Post-release refinement focusing on structural reorganization to `.opencode/` folder, 80+ bug fixes, and making AGENTS.md fully universal.

### 🔧 Changed

- **Structural Reorganization** - All components moved to `.opencode/`:

| Before | After |
|--------|-------|
| `skill/` | `.opencode/skill/` |
| `command/` | `.opencode/command/` |
| `install_guides/` | `.opencode/install_guides/` |
| `scripts/` | `.opencode/scripts/` |
| `agent/` | `.opencode/agent/` |

- **AGENTS.md** - Made fully codebase-agnostic (removed Webflow patterns, local paths)

### 🐛 Fixed

**Critical (P0)**

| Fix | Description |
|-----|-------------|
| Duplicate entries | Fixed checkpoint restore with UPSERT logic |
| Orphaned files | Added detection in `verifyIntegrity()` |
| Broken skill refs | Fixed `system-memory` → `system-spec-kit` |
| Gate numbering | Standardized to match AGENTS.md |
| Hardcoded paths | Replaced with relative paths |
| Transaction safety | Added wrapping to `recordValidation()` |

**High (P1)**

| Fix | Description |
|-----|-------------|
| Missing validators | Created `validate-spec-folder.js`, `validate-memory-file.js` |
| Anchor links | Fixed in workflows-code SKILL.md |
| Embedding failures | Added rollback with `MemoryError` class |
| Index migration | Added `idx_history_timestamp` |
| Cascade delete | Implemented for `memory_history` |
| Tool naming | Standardized LEANN to `leann_leann_*` prefix |

---

### 📁 Files Changed

- **80+ bugs** fixed across multiple files
- Combines: Structural reorganization + Bug fixes + AGENTS.md universalization

| File | Change |
|------|--------|
| `skill/` → `.opencode/skill/` | **MOVED** - All 8 skills |
| `command/` → `.opencode/command/` | **MOVED** - All commands |
| `install_guides/` → `.opencode/install_guides/` | **MOVED** - All guides |
| `scripts/` → `.opencode/scripts/` | **MOVED** - All scripts |
| `agent/` → `.opencode/agent/` | **MOVED** - All agents |
| `AGENTS.md` | Made codebase-agnostic |
| `README.md` | Updated all path references |

---

### 🔧 Upgrade Notes

1. **Update custom scripts** with new paths:
   - `skill/` → `.opencode/skill/`
   - `command/` → `.opencode/command/`

2. **Symlinks fixed** - Now use relative paths for portability

---

[v1.0.0.2]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.1...v1.0.0.2

---

## [v1.0.0.1] - 2025-12-26

First post-release refinement focusing on structural reorganization, critical bug fixes, and documentation improvements.

### 🔧 Changed

- **Structural Reorganization** - All components moved to `.opencode/` folder

| Before | After |
|--------|-------|
| `skill/` | `.opencode/skill/` |
| `command/` | `.opencode/command/` |
| `install_guides/` | `.opencode/install_guides/` |
| `scripts/` | `.opencode/scripts/` |
| `agent/` | `.opencode/agent/` |

- **AGENTS.md** - Removed project-specific references, made codebase-agnostic
- **README.md** - Updated all path references

### 🐛 Fixed

**Critical (P0)**

| Fix | Description |
|-----|-------------|
| Duplicate entries | Fixed checkpoint restore with UPSERT logic |
| Orphaned files | Added detection in `verifyIntegrity()` |
| Broken skill refs | Fixed `system-memory` → `system-spec-kit` |
| Gate numbering | Standardized to match AGENTS.md |
| Hardcoded paths | Replaced with relative paths |
| Transaction safety | Added wrapping to `recordValidation()` |

**High (P1)**

| Fix | Description |
|-----|-------------|
| Missing validators | Created validation scripts |
| Embedding failures | Added rollback with `MemoryError` class |
| Tool naming | Standardized LEANN prefix |
| Error codes | Preserved in MCP responses |

---

### 📁 Files Changed

- **12+ critical bugs** fixed
- Combines: Structural reorganization + Critical bug fixes

| File | Change |
|------|--------|
| `skill/` → `.opencode/skill/` | **MOVED** |
| `command/` → `.opencode/command/` | **MOVED** |
| `install_guides/` → `.opencode/install_guides/` | **MOVED** |
| `scripts/` → `.opencode/scripts/` | **MOVED** |
| `agent/` → `.opencode/agent/` | **MOVED** |
| `AGENTS.md` | Made codebase-agnostic |
| `README.md` | Updated path references |

---

### 🔧 Upgrade Notes

1. **Update path references** in custom scripts:
   - `skill/` → `.opencode/skill/`
   - `command/` → `.opencode/command/`

2. **No breaking changes** to MCP tools or commands

---

[v1.0.0.1]: https://github.com/MichelKerkmeester/opencode-dev-environment/compare/v1.0.0.0...v1.0.0.1

---

## [v1.0.0.0] - 2025-12-26

First official release of the OpenCode development environment featuring persistent semantic memory and enforced documentation workflows.

### 🚀 Added

- **Spec Kit System** - Documentation enforcement beyond the original GitHub Spec Kit

| Feature | Original Spec Kit | This System |
|---------|-------------------|-------------|
| Templates | ~3 basic | 10 purpose-built |
| Commands | None | 7 slash commands with `:auto`/`:confirm` modes |
| Memory | None | Deep integration (memory lives IN spec folders) |
| Versioning | Overwrite | 001/002/003 sub-folder versioning |
| Automation | None | 11 scripts |

- **Semantic Memory MCP** - Custom-built persistent memory system

| Feature | Description |
|---------|-------------|
| Search | Hybrid (vector + FTS5 + RRF fusion) |
| Tiers | 6 importance levels with auto-decay |
| Storage | 100% local (nomic-embed on YOUR machine) |
| Format | ANCHOR = 93% token savings |
| Speed | <50ms proactive surfacing |
| Recovery | Checkpoints = undo button for index |

- **8 Domain-Specific Skills**

| Skill | Purpose |
|-------|---------|
| `system-spec-kit` | Documentation enforcement + context preservation |
| `mcp-leann` | Semantic code search |
| `mcp-narsil` | Security scanning + code intelligence |
| `mcp-code-mode` | External tool orchestration |
| `workflows-code` | Implementation lifecycle |
| `workflows-documentation` | Document quality enforcement |
| `workflows-git` | Git workflows |
| `workflows-chrome-devtools` | Browser automation |

- **17 Slash Commands** - `/spec_kit:*` (7), `/memory:*` (3), `/create:*` (5), `/search:*` (2)

- **MCP Servers** - Sequential Thinking, LEANN, Spec Kit Memory, Code Mode, Narsil (via Code Mode)

---

### 📁 Files Changed

- **Initial release** | **8 skills**, **17 commands**, **4 MCP servers**
- Complete development environment for OpenCode

| Component | Count |
|-----------|-------|
| Skills | 8 |
| Commands | 17 |
| MCP Servers | 4 |
| Templates | 10 |
| Scripts | 11 |

---

*Initial release - no compare link*
