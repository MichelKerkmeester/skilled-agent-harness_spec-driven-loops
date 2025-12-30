---
title: Narsil Tool Reference - Complete Guide
description: Complete documentation for all 76 Narsil MCP tools, organized by category with priority levels and usage guidance.
---

# Narsil Tool Reference - Complete Guide

Complete reference for all 76 Narsil MCP tools organized by priority level.

---

## 1. 📖 OVERVIEW

### Core Principle

Narsil provides unified code intelligence - STRUCTURE, SECURITY, and SEMANTIC understanding.

### Tool Distribution

| Category                     | Count  | Priority |
| ---------------------------- | ------ | -------- |
| Repository & File Management | 9      | HIGH     |
| Symbol Search & Navigation   | 7      | HIGH     |
| Code Search                  | 6      | MEDIUM   |
| AST-Aware Chunking           | 3      | LOW      |
| Neural Semantic Search       | 3      | HIGH     |
| Call Graph Analysis          | 6      | HIGH     |
| Control Flow Analysis        | 2      | MEDIUM   |
| Data Flow Analysis           | 4      | MEDIUM   |
| Type Inference               | 3      | MEDIUM   |
| Import/Dependency Graph      | 3      | MEDIUM   |
| Security - Taint Tracking    | 4      | HIGH     |
| Security - Rules Engine      | 5      | HIGH     |
| Supply Chain Security        | 4      | HIGH     |
| Git Integration              | 10     | MEDIUM   |
| LSP Integration              | 3      | SKIP     |
| Remote Repository            | 3      | SKIP     |
| Metrics                      | 1      | LOW      |
| **Total**                    | **76** |          |

### Priority Definitions

| Priority   | Description                         | Action          |
| ---------- | ----------------------------------- | --------------- |
| **HIGH**   | Core functionality, frequently used | Use actively    |
| **MEDIUM** | Useful but situational              | Use when needed |
| **LOW**    | Rarely needed                       | Use sparingly   |
| **SKIP**   | Handled better by other tools       | Do not use      |

---

## 2. 🔧 HIGH PRIORITY TOOLS (39 tools)

> **Important**: Most tools require a `repo` parameter. Use `list_repos()` first to discover the repo name (typically "unknown").

### Repository & File Management (9)

| Tool                    | Description                                     | Example                                                              |
| ----------------------- | ----------------------------------------------- | -------------------------------------------------------------------- |
| `list_repos`            | List all indexed repositories                   | `narsil_list_repos({})`                                              |
| `get_project_structure` | Directory tree with file info                   | `narsil_get_project_structure({ repo: "unknown" })`                  |
| `get_file`              | Get file contents with line range               | `narsil_get_file({ repo: "unknown", path: "src/main.rs" })`          |
| `get_excerpt`           | Extract code around lines                       | `narsil_get_excerpt({ repo: "unknown", path: "file.rs", line: 50 })` |
| `reindex`               | Trigger re-indexing                             | `narsil_reindex({ repo: "unknown" })`                                |
| `save_index`            | Save current index to disk (requires --persist) | `narsil_save_index({})`                                              |
| `discover_repos`        | Auto-discover repos in directory                | `narsil_discover_repos({ path: "~/projects" })`                      |
| `validate_repo`         | Check if path is valid repo                     | `narsil_validate_repo({ path: "/path" })`                            |
| `get_index_status`      | Show index stats and features                   | `narsil_get_index_status({ repo: "unknown" })`                       |

### Symbol Search & Navigation (7)

| Tool                      | Description                      | Example                                                              |
| ------------------------- | -------------------------------- | -------------------------------------------------------------------- |
| `find_symbols`            | Find functions, classes, structs | `narsil_find_symbols({ repo: "unknown", symbol_type: "function" })`  |
| `get_symbol_definition`   | Get symbol source code           | `narsil_get_symbol_definition({ repo: "unknown", symbol: "main" })`  |
| `find_references`         | Find all references to symbol    | `narsil_find_references({ repo: "unknown", symbol: "Config" })`      |
| `get_dependencies`        | Analyze imports/dependents       | `narsil_get_dependencies({ repo: "unknown", file: "main.rs" })`      |
| `workspace_symbol_search` | Fuzzy symbol search              | `narsil_workspace_symbol_search({ repo: "unknown", query: "auth" })` |
| `find_symbol_usages`      | Cross-file usage with imports    | `narsil_find_symbol_usages({ repo: "unknown", symbol: "parse" })`    |
| `get_export_map`          | Get exported symbols             | `narsil_get_export_map({ repo: "unknown", path: "lib.rs" })`         |

### Call Graph Analysis (6)

| Tool                    | Description                | Example                                                                |
| ----------------------- | -------------------------- | ---------------------------------------------------------------------- |
| `get_call_graph`        | Function call graph        | `narsil_get_call_graph({ repo: "unknown", function: "main" })`         |
| `get_callers`           | Functions that call X      | `narsil_get_callers({ repo: "unknown", function: "validate" })`        |
| `get_callees`           | Functions called by X      | `narsil_get_callees({ repo: "unknown", function: "process" })`         |
| `find_call_path`        | Path between functions     | `narsil_find_call_path({ repo: "unknown", from: "main", to: "save" })` |
| `get_complexity`        | Cyclomatic complexity      | `narsil_get_complexity({ repo: "unknown", function: "handle" })`       |
| `get_function_hotspots` | Highly connected functions | `narsil_get_function_hotspots({ repo: "unknown" })`                    |

### Security - Taint Tracking (4)

| Tool                             | Description                 | Example                                                         |
| -------------------------------- | --------------------------- | --------------------------------------------------------------- |
| `find_injection_vulnerabilities` | SQL, XSS, command injection | `narsil_find_injection_vulnerabilities({ repo: "unknown" })`    |
| `trace_taint`                    | Trace tainted data flow     | `narsil_trace_taint({ repo: "unknown", source: "user_input" })` |
| `get_taint_sources`              | List input sources          | `narsil_get_taint_sources({ repo: "unknown" })`                 |
| `get_security_summary`           | Risk assessment             | `narsil_get_security_summary({ repo: "unknown" })`              |

### Security - Rules Engine (5)

| Tool                    | Description             | Example                                          |
| ----------------------- | ----------------------- | ------------------------------------------------ |
| `scan_security`         | Full security scan      | `narsil_scan_security({ repo: "unknown" })`      |
| `check_owasp_top10`     | OWASP Top 10 2021       | `narsil_check_owasp_top10({ repo: "unknown" })`  |
| `check_cwe_top25`       | CWE Top 25              | `narsil_check_cwe_top25({ repo: "unknown" })`    |
| `explain_vulnerability` | Detailed explanation    | `narsil_explain_vulnerability({ id: "CWE-89" })` |
| `suggest_fix`           | Remediation suggestions | `narsil_suggest_fix({ finding_id: "123" })`      |

### Supply Chain Security (4)

| Tool                 | Description        | Example                                                            |
| -------------------- | ------------------ | ------------------------------------------------------------------ |
| `generate_sbom`      | Generate SBOM      | `narsil_generate_sbom({ repo: "unknown", format: "cyclonedx" })`   |
| `check_dependencies` | CVE checking       | `narsil_check_dependencies({ repo: "unknown" })`                   |
| `check_licenses`     | License compliance | `narsil_check_licenses({ repo: "unknown" })`                       |
| `find_upgrade_path`  | Safe upgrade paths | `narsil_find_upgrade_path({ repo: "unknown", package: "lodash" })` |

### Type Inference (3)

| Tool                   | Description               | Example                                                            |
| ---------------------- | ------------------------- | ------------------------------------------------------------------ |
| `infer_types`          | Infer variable types      | `narsil_infer_types({ repo: "unknown", path: "script.py" })`       |
| `check_type_errors`    | Find type errors          | `narsil_check_type_errors({ repo: "unknown", path: "script.py" })` |
| `get_typed_taint_flow` | Enhanced taint with types | `narsil_get_typed_taint_flow({ repo: "unknown" })`                 |

### Control Flow (2)

| Tool               | Description           | Example                                                             |
| ------------------ | --------------------- | ------------------------------------------------------------------- |
| `get_control_flow` | CFG with basic blocks | `narsil_get_control_flow({ repo: "unknown", function: "process" })` |
| `find_dead_code`   | Find unreachable code | `narsil_find_dead_code({ repo: "unknown", path: "src/main.js" })`   |

---

## 3. 📊 MEDIUM PRIORITY TOOLS (19 tools)

### Code Search (6)

| Tool                     | Description            | Notes                          |
| ------------------------ | ---------------------- | ------------------------------ |
| `search_code`            | Keyword search         | Use for exact matches          |
| `semantic_search`        | BM25-ranked search     | Good for keyword-based ranking |
| `hybrid_search`          | BM25 + TF-IDF          | Combined ranking               |
| `search_chunks`          | AST-aware chunk search | For structured code blocks     |
| `find_similar_code`      | TF-IDF similarity      | Code clone detection           |
| `find_similar_to_symbol` | Symbol similarity      | Find related symbols           |

> **Note**: For deep semantic understanding, use `neural_search`. Use these tools for keyword/exact matching.

### Data Flow Analysis (4)

| Tool                       | Description               | Example                                      |
| -------------------------- | ------------------------- | -------------------------------------------- |
| `get_data_flow`            | Variable definitions/uses | `narsil_get_data_flow({ function: "calc" })` |
| `get_reaching_definitions` | Assignment analysis       | `narsil_get_reaching_definitions({})`        |
| `find_uninitialized`       | Uninitialized variables   | `narsil_find_uninitialized({})`              |
| `find_dead_stores`         | Unused assignments        | `narsil_find_dead_stores({})`                |

### Import/Dependency Graph (3)

| Tool                     | Description          | Example                             |
| ------------------------ | -------------------- | ----------------------------------- |
| `get_import_graph`       | Import visualization | `narsil_get_import_graph({})`       |
| `find_circular_imports`  | Cycle detection      | `narsil_find_circular_imports({})`  |
| `get_incremental_status` | Change tracking      | `narsil_get_incremental_status({})` |

### Git Integration (6 of 10)

| Tool                 | Description             | Example                                        |
| -------------------- | ----------------------- | ---------------------------------------------- |
| `get_blame`          | Git blame for file      | `narsil_get_blame({ file: "main.rs" })`        |
| `get_file_history`   | File commit history     | `narsil_get_file_history({ file: "lib.rs" })`  |
| `get_recent_changes` | Recent commits          | `narsil_get_recent_changes({ limit: 10 })`     |
| `get_hotspots`       | High churn + complexity | `narsil_get_hotspots({})`                      |
| `get_contributors`   | Repo contributors       | `narsil_get_contributors({})`                  |
| `get_commit_diff`    | Diff for commit         | `narsil_get_commit_diff({ commit: "abc123" })` |

---

## 4. ⚠️ LOW PRIORITY & SKIP TOOLS (18 tools)

### LOW Priority (9 tools)

#### AST-Aware Chunking (3)

| Tool                  | Description           | Use Case               |
| --------------------- | --------------------- | ---------------------- |
| `get_chunks`          | AST-aware code chunks | Rarely needed directly |
| `get_chunk_stats`     | Chunk statistics      | Debugging only         |
| `get_embedding_stats` | Embedding info        | Debugging only         |

#### Git Integration (4 of 10)

| Tool                 | Description    | Alternative          |
| -------------------- | -------------- | -------------------- |
| `get_symbol_history` | Symbol changes | Git CLI often faster |
| `get_branch_info`    | Branch status  | Git CLI              |
| `get_modified_files` | Working tree   | Git CLI              |

#### Metrics (1)

| Tool          | Description       |
| ------------- | ----------------- |
| `get_metrics` | Performance stats |

### SKIP Tools (6 tools)

#### LSP Integration (3) - IDE handles this

| Tool               | Reason to Skip             |
| ------------------ | -------------------------- |
| `get_hover_info`   | IDE provides this natively |
| `get_type_info`    | IDE provides this natively |
| `go_to_definition` | IDE provides this natively |

#### Remote Repository (3) - Not needed locally

| Tool                | Reason to Skip           |
| ------------------- | ------------------------ |
| `add_remote_repo`   | Use `git clone` instead  |
| `list_remote_files` | Not needed for local dev |
| `get_remote_file`   | Not needed for local dev |

---

## 5. 🔄 TOOL SELECTION DECISION TREE

```
User Request
     │
     ├─► "How does X work?" / Understanding intent
     │   └─► Use Narsil: neural_search (semantic)
     │
     ├─► "Find functions/classes/symbols"
     │   └─► Use Narsil: find_symbols
     │
     ├─► "Security scan" / "Vulnerabilities"
     │   └─► Use Narsil: scan_security, check_owasp_top10
     │       └─► See: references/security_guide.md
     │
     ├─► "Call graph" / "Who calls X?"
     │   └─► Use Narsil: get_call_graph, get_callers
     │       └─► See: references/call_graph_guide.md
     │
     ├─► "Dead code" / "Unused"
     │   └─► Use Narsil: find_dead_code, find_dead_stores
     │
     ├─► "SBOM" / "Dependencies" / "Licenses"
     │   └─► Use Narsil: generate_sbom, check_licenses
     │
     ├─► "Git blame" / "History"
     │   └─► Use Narsil: get_blame, get_file_history
     │
     └─► "Project structure" / "Overview"
         └─► Use Narsil: get_project_structure
```

### Quick Reference by Task

| Task                   | Primary Tool         | Secondary Tool                   |
| ---------------------- | -------------------- | -------------------------------- |
| Semantic understanding | `neural_search`      | `semantic_search`                |
| Symbol search          | `find_symbols`       | `workspace_symbol_search`        |
| Security audit         | `scan_security`      | `find_injection_vulnerabilities` |
| Call analysis          | `get_call_graph`     | `get_callers`, `get_callees`     |
| Dead code              | `find_dead_code`     | `find_dead_stores`               |
| Complexity             | `get_complexity`     | `get_function_hotspots`          |
| Dependencies           | `check_dependencies` | `generate_sbom`                  |
| Git analysis           | `get_blame`          | `get_hotspots`                   |

---

## 6. 🔗 RELATED RESOURCES

### Guides

- [security_guide.md](./security_guide.md) - Security scanning workflow
- [call_graph_guide.md](./call_graph_guide.md) - Call graph analysis workflow
- [quick_start.md](./quick_start.md) - Getting started

### Assets

- [tool_categories.md](../assets/tool_categories.md) - Priority categorization

### Parent

- [SKILL.md](../SKILL.md) - Main skill instructions