---
title: Tool Categories - Priority Classification
description: Categorization of all 76 Narsil tools with priority levels for efficient usage.
---

# Tool Categories - Priority Classification

Quick reference for choosing the right Narsil tool by priority level.

---

## 1. 📋 PRIORITY LEVELS

### Definitions

| Priority   | Description                         | Usage                         |
| ---------- | ----------------------------------- | ----------------------------- |
| **HIGH**   | Core functionality, frequently used | Use actively for most tasks   |
| **MEDIUM** | Useful but situational              | Use when specific need arises |
| **LOW**    | Rarely needed                       | Use sparingly                 |
| **SKIP**   | Handled better by other tools       | Do not use                    |

### Summary Statistics

| Priority  | Count  | Percentage |
| --------- | ------ | ---------- |
| HIGH      | 39     | 51%        |
| MEDIUM    | 19     | 25%        |
| LOW       | 9      | 12%        |
| SKIP      | 9      | 12%        |
| **Total** | **76** | **100%**   |

### Index Dependency Classification

> **Important**: Code Mode spawns fresh Narsil MCP processes for each `call_tool_chain()` batch. This affects tool availability timing.

| Category        | Timing  | Description                                  |
| --------------- | ------- | -------------------------------------------- |
| **AST-Based**   | Instant | Parse source files directly, no index needed |
| **Index-Based** | ~40-60s | Require BM25/TF-IDF/Neural indexes to build  |

#### AST-Based Tools (Work Immediately)

These tools parse source files directly and work instantly:

| Category     | Tools                                                                                                 |
| ------------ | ----------------------------------------------------------------------------------------------------- |
| Repository   | `list_repos`, `get_project_structure`, `get_file`, `get_excerpt`, `get_index_status`, `validate_repo` |
| Symbols      | `find_symbols`, `get_symbol_definition`, `find_references`, `get_dependencies`, `get_export_map`      |
| Call Graph   | `get_call_graph`, `get_callers`, `get_callees`, `find_call_path`, `get_complexity`                    |
| Security     | `scan_security`, `find_injection_vulnerabilities`, `trace_taint`, `get_taint_sources`                 |
| Control Flow | `get_control_flow`, `find_dead_code`                                                                  |
| Git          | `get_blame`, `get_file_history`, `get_recent_changes`                                                 |

#### Index-Based Tools (Need ~40-60s After Server Start)

These tools require search indexes to be built first:

| Category       | Tools                                         | Index Type                    |
| -------------- | --------------------------------------------- | ----------------------------- |
| Neural Search  | `neural_search`                               | Neural embeddings (Voyage AI) |
| Keyword Search | `semantic_search`, `search_code`              | BM25                          |
| Hybrid Search  | `hybrid_search`                               | BM25 + TF-IDF + Neural        |
| Similarity     | `find_similar_code`, `find_similar_to_symbol` | TF-IDF                        |
| Chunk Search   | `search_chunks`                               | Code chunks                   |

**Workaround**: Keep related Narsil calls in the same `call_tool_chain()` batch, or wait ~60s after first call before using search functions.

---

## 2. ⭐ HIGH PRIORITY TOOLS (39)

### Repository & File Management (8)

| Tool                    | Purpose                   | Notes                           |
| ----------------------- | ------------------------- | ------------------------------- |
| `list_repos`            | List indexed repositories | Essential for multi-repo setups |
| `get_project_structure` | Directory tree            | Primary overview tool           |
| `get_file`              | Get file contents         | Core file reading               |
| `get_excerpt`           | Extract code context      | Context extraction              |
| `reindex`               | Trigger re-indexing       | Maintenance                     |
| `discover_repos`        | Auto-discover repos       | Setup                           |
| `validate_repo`         | Validate repo path        | Validation                      |
| `get_index_status`      | Show index stats          | Diagnostics                     |

### Symbol Search & Navigation (7)

| Tool                      | Purpose                | Notes                 |
| ------------------------- | ---------------------- | --------------------- |
| `find_symbols`            | Find functions/classes | Primary symbol search |
| `get_symbol_definition`   | Get source code        | Go to definition      |
| `find_references`         | Find all usages        | Find usages           |
| `get_dependencies`        | Analyze imports        | Import analysis       |
| `workspace_symbol_search` | Fuzzy search           | Quick navigation      |
| `find_symbol_usages`      | Cross-file usage       | Comprehensive search  |
| `get_export_map`          | Module exports         | API discovery         |

### Call Graph Analysis (6)

| Tool                    | Purpose                | Notes                       |
| ----------------------- | ---------------------- | --------------------------- |
| `get_call_graph`        | Function relationships | Essential for understanding |
| `get_callers`           | Who calls X?           | Impact analysis             |
| `get_callees`           | What does X call?      | Dependency tracking         |
| `find_call_path`        | Path between functions | Trace execution             |
| `get_complexity`        | Complexity metrics     | Refactoring targets         |
| `get_function_hotspots` | Central functions      | Find key code               |

### Security - Taint Tracking (4)

| Tool                             | Purpose           | Notes                  |
| -------------------------------- | ----------------- | ---------------------- |
| `find_injection_vulnerabilities` | SQL/XSS/command   | Primary injection scan |
| `trace_taint`                    | Data flow tracing | Follow untrusted data  |
| `get_taint_sources`              | Input sources     | Identify entry points  |
| `get_security_summary`           | Risk overview     | Quick assessment       |

### Security - Rules Engine (5)

| Tool                    | Purpose            | Notes                |
| ----------------------- | ------------------ | -------------------- |
| `scan_security`         | Full security scan | Primary scan         |
| `check_owasp_top10`     | OWASP compliance   | Standard check       |
| `check_cwe_top25`       | CWE compliance     | Standard check       |
| `explain_vulnerability` | Detailed info      | Understanding issues |
| `suggest_fix`           | Remediation        | Fix guidance         |

### Supply Chain Security (4)

| Tool                 | Purpose            | Notes                  |
| -------------------- | ------------------ | ---------------------- |
| `generate_sbom`      | SBOM generation    | Compliance requirement |
| `check_dependencies` | CVE detection      | Vulnerability check    |
| `check_licenses`     | License compliance | Legal compliance       |
| `find_upgrade_path`  | Safe upgrades      | Remediation            |

### Type Inference (3)

| Tool                   | Purpose         | Notes                  |
| ---------------------- | --------------- | ---------------------- |
| `infer_types`          | Type discovery  | Without external tools |
| `check_type_errors`    | Error detection | Quick type check       |
| `get_typed_taint_flow` | Enhanced taint  | Type-aware analysis    |

### Control Flow (2)

| Tool               | Purpose          | Notes        |
| ------------------ | ---------------- | ------------ |
| `get_control_flow` | CFG analysis     | Basic blocks |
| `find_dead_code`   | Unreachable code | Cleanup      |

---

## 3. 📊 MEDIUM PRIORITY TOOLS (19)

### Code Search (6)

| Tool                     | Purpose           | Notes                 |
| ------------------------ | ----------------- | --------------------- |
| `search_code`            | Keyword search    | Exact matches only    |
| `semantic_search`        | BM25 search       | Keyword-based ranking |
| `hybrid_search`          | Combined search   | BM25 + TF-IDF         |
| `search_chunks`          | Chunk search      | Structured blocks     |
| `find_similar_code`      | TF-IDF similarity | Code clone detection  |
| `find_similar_to_symbol` | Symbol similarity | Find related symbols  |

> **Note**: For deep semantic understanding, use `neural_search`.

### Data Flow Analysis (4)

| Tool                       | Purpose             | Notes            |
| -------------------------- | ------------------- | ---------------- |
| `get_data_flow`            | Variable tracking   | Definitions/uses |
| `get_reaching_definitions` | Assignment analysis | Advanced         |
| `find_uninitialized`       | Bug detection       | Quality check    |
| `find_dead_stores`         | Unused assignments  | Cleanup          |

### Import/Dependency Graph (3)

| Tool                     | Purpose              | Notes        |
| ------------------------ | -------------------- | ------------ |
| `get_import_graph`       | Import visualization | Architecture |
| `find_circular_imports`  | Cycle detection      | Quality      |
| `get_incremental_status` | Change tracking      | Debugging    |

### Git Integration (6 of 10)

| Tool                 | Purpose        | Notes       |
| -------------------- | -------------- | ----------- |
| `get_blame`          | Git blame      | Authorship  |
| `get_file_history`   | File commits   | History     |
| `get_recent_changes` | Recent commits | Activity    |
| `get_hotspots`       | Churn analysis | Risk areas  |
| `get_contributors`   | Team info      | Attribution |
| `get_commit_diff`    | Commit diffs   | Review      |

---

## 4. ⚠️ LOW PRIORITY & SKIP TOOLS (18)

### LOW Priority (9)

#### AST-Aware Chunking (3)

| Tool                  | Reason                 |
| --------------------- | ---------------------- |
| `get_chunks`          | Rarely needed directly |
| `get_chunk_stats`     | Debugging only         |
| `get_embedding_stats` | Debugging only         |

#### Git Integration (4 of 10)

| Tool                 | Alternative       |
| -------------------- | ----------------- |
| `get_symbol_history` | Git CLI is faster |
| `get_branch_info`    | Git CLI           |
| `get_modified_files` | Git CLI           |

#### Metrics (1)

| Tool          | Reason                     |
| ------------- | -------------------------- |
| `get_metrics` | Performance debugging only |

### SKIP (6)

#### LSP Integration (3)

| Tool               | Reason                     |
| ------------------ | -------------------------- |
| `get_hover_info`   | IDE provides this natively |
| `get_type_info`    | IDE provides this natively |
| `go_to_definition` | IDE provides this natively |

> **Why Skip**: These duplicate IDE functionality.

#### Remote Repository (3)

| Tool                | Reason             |
| ------------------- | ------------------ |
| `add_remote_repo`   | Use `git clone`    |
| `list_remote_files` | Not needed locally |
| `get_remote_file`   | Not needed locally |

> **Why Skip**: We work with local repositories.

---

## 5. ⚙️ RECOMMENDED CONFIGURATION

### Flags to Use

| Flag           | Purpose                     |
| -------------- | --------------------------- |
| `--repos`      | Repository paths (required) |
| `--git`        | Enable git integration      |
| `--call-graph` | Enable call graph analysis  |
| `--persist`    | Save index to disk          |
| `--watch`      | Auto-reindex on changes     |

### Flags to Skip

| Flag       | Reason                   |
| ---------- | ------------------------ |
| `--lsp`    | IDE handles LSP          |
| `--remote` | Not needed for local dev |

### Example Command

```bash
narsil-mcp \
  --repos ~/project \
  --git \
  --call-graph \
  --persist \
  --watch
```

---

## 6. 🔗 RELATED RESOURCES

### Guides

- [tool_reference.md](../references/tool_reference.md) - Complete tool documentation
- [security_guide.md](../references/security_guide.md) - Security workflow
- [call_graph_guide.md](../references/call_graph_guide.md) - Call graph workflow

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions