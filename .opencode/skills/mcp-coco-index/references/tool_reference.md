---
title: CocoIndex Code Tool Reference
description: Complete reference for the CocoIndex Code CLI commands and MCP tools with parameters, examples, and expected output.
trigger_phrases:
  - ccc commands
  - cocoindex tools
  - search parameters
  - mcp tools cocoindex
  - ccc cli reference
---

# CocoIndex Code Tool Reference

Complete reference for all CLI commands and MCP tools exposed by CocoIndex Code.

---

## Pipeline architecture

CocoIndex Code uses two model stages plus a lexical fusion lane. The Stage 1 embedder and Stage 2 reranker are not interchangeable: the embedder creates independent vectors for stored chunks and queries, while the reranker scores each query/candidate pair together.

| Stage | Model role | Current default | Configuration surface | Output |
| ----- | ---------- | --------------- | --------------------- | ------ |
| Stage 1 | Bi-encoder embedder | `sbert/nomic-ai/CodeRankEmbed` (`nomic-ai/CodeRankEmbed` in `global_settings.yml`) | `embedding.provider`, `embedding.model`, `embedding.device`, or `COCOINDEX_CODE_EMBEDDING_MODEL` | Query/chunk vectors compared by cosine similarity |
| Fusion | Vector + FTS5 RRF | RRF K=60, vector weight 0.9, FTS5 weight 0.5 | `COCOINDEX_HYBRID*` environment variables | Top-K retrieval candidates after reciprocal-rank fusion |
| Dedup | Canonical result grouping | Realpath first, content hash fallback | Built into the forked query path | One representative row per duplicate group |
| Stage 2 | Cross-encoder reranker | `Qwen/Qwen3-Reranker-0.6B` | `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL`, `COCOINDEX_RERANK_TOP_K` | Final candidate order after query+candidate scoring |

## 1. OVERVIEW

This document provides the complete reference for CocoIndex Code CLI commands and MCP tools. It covers all available commands (search, index, status, init, reset, mcp, daemon), their parameters, expected output, supported languages, environment variables, settings schema, and related resources.

**Important distinction:** The MCP server exposes `search` and `cocoindex_refresh_index`. The `status`, index lifecycle, and reset operations are still CLI-only commands and are not available through the MCP protocol.

---

## 1. CLI COMMANDS

### ccc search

Perform a semantic search across the indexed codebase.

```bash
ccc search QUERY [--lang LANG ...] [--path PATH] [--limit N] [--offset N] [--refresh]
```

| Parameter   | Required | Default | Description                                                        |
| ----------- | -------- | ------- | ------------------------------------------------------------------ |
| `QUERY`     | Yes      | -       | Natural language search query                                      |
| `--lang`    | No       | all     | Filter by language (repeatable: `--lang python --lang typescript`) |
| `--path`    | No       | .       | Filter by directory path                                           |
| `--limit`   | No       | 10      | Maximum number of results                                          |
| `--offset`  | No       | 0       | Skip first N results (pagination)                                  |
| `--refresh` | No       | false   | Force index refresh before searching                               |

**Note:** `--lang` is repeatable. Specify it multiple times to filter by multiple languages.

**Examples:**
```bash
# Basic search
ccc search "error handling in API routes"

# Filter by single language
ccc search "database connection pooling" --lang python

# Filter by multiple languages
ccc search "authentication middleware" --lang python --lang typescript

# Scope to directory
ccc search "authentication middleware" --path src/api/

# Paginate results
ccc search "configuration" --limit 5 --offset 10

# Refresh index before searching
ccc search "new feature" --refresh
```

**Output format:** Each result includes:
- File path
- Line range
- Code snippet
- Relevance score (0.0 to 1.0)
- Language

> **Fork-specific telemetry.** This skill bundles a soft-fork of `cocoindex-code` (version `0.2.3+spec-kit-fork.0.2.0`) that adds dedup + path-class reranking. Result rows from `ccc search` carry additional fields (`dedupedAliases`, `uniqueResultCount`, `rankingSignals`, `source_realpath`, `content_hash`, `path_class`, `raw_score`) that vanilla upstream cocoindex-code does NOT emit. See [§7 Fork-Specific Output Telemetry](#-7-fork-specific-output-telemetry) for the full schema.

---

### ccc index

Build or update the semantic index for the current project.

```bash
ccc index
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | No parameters. Indexes from COCOINDEX_CODE_ROOT_PATH |

**Example:**
```bash
cd /path/to/project
ccc index
# Scans files, generates embeddings, stores in .cocoindex_code/
```

**Notes:**
- First run indexes all supported files
- Subsequent runs perform incremental updates (only changed files)
- Duration depends on codebase size (typically 1-5 minutes for first build)
- For forced refresh during search, use `ccc search ... --refresh`; the installed `ccc index` command does not expose a `--refresh` flag

---

### ccc status

Display project and index statistics.

```bash
ccc status
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | No parameters |

**Example:**
```bash
ccc status
# Shows: indexed files count, languages, index size, last update time
```

---

### ccc init

Initialize a new project for indexing. Creates the `.cocoindex_code/` directory.

```bash
ccc init [-f | --force]
```

| Parameter       | Required | Default | Description                                      |
| --------------- | -------- | ------- | ------------------------------------------------ |
| `-f`, `--force` | No       | false   | Force re-initialization even if already exists    |

**Examples:**
```bash
cd /path/to/project
ccc init
# Creates .cocoindex_code/ directory

# Force re-initialization
ccc init --force
```

**Notes:**
- Run this once per project before building the index
- The install script runs `ccc init` automatically if `.cocoindex_code/` does not exist
- Use `-f` / `--force` to re-initialize an existing project

---

### ccc reset

Reset the index databases. Optionally remove all data.

```bash
ccc reset [--all]
```

| Parameter | Required | Default | Description                                       |
| --------- | -------- | ------- | ------------------------------------------------- |
| `--all`   | No       | false   | Remove all data (full clean reset including settings) |

**Examples:**
```bash
# Reset databases only (keep settings)
ccc reset

# Full reset including all data and settings
ccc reset --all

# After reset, rebuild
ccc init
ccc index
```

---

### ccc mcp

Run CocoIndex Code as an MCP server in stdio mode. Used by AI clients.

```bash
ccc mcp
```

| Parameter | Required | Description |
| --------- | -------- | ----------- |
| (none)    | -        | Starts MCP server on stdio. Ctrl+C to stop |

**Notes:**
- This command is used in MCP configuration files (not run manually)
- Communicates via stdin/stdout using the MCP protocol
- Exposes 2 tools: `search` and `cocoindex_refresh_index`
- The `status`, index lifecycle, and `reset` operations are CLI-only and not exposed via MCP

---

### ccc daemon

Manage the background indexing daemon.

```bash
ccc daemon status|restart|stop
```

| Subcommand | Description                          |
| ---------- | ------------------------------------ |
| `status`   | Check if the daemon is running       |
| `restart`  | Restart the running daemon           |
| `stop`     | Stop the running daemon              |

**Examples:**
```bash
# Check daemon status
ccc daemon status

# Restart daemon
ccc daemon restart

# Stop daemon
ccc daemon stop
```

### Daemon lifecycle

The bundled fork shipped daemon resilience patches in commit `1bbe80986` for packet `026/011-cocoindex-daemon-resilience`. Operators should expect the lifecycle behavior below when `ccc search`, `ccc status` or `ccc daemon` touches the background daemon.

Source files:

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/client.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`

| Behavior | Operator-visible result |
| -------- | ----------------------- |
| Atomic idempotent spawn | `start_daemon()` now takes an advisory PID-file lock before it checks stale state or spawns a process. POSIX uses `fcntl.flock`. Win32 uses `msvcrt.locking`. Concurrent clients converge on one daemon instead of racing. |
| Live PID pre-flight | The client checks `daemon.pid` with `_pid_alive` before cleanup. A live daemon keeps ownership. A stale PID allows cleanup and a fresh spawn. |
| In-lock PID write | The daemon writes `daemon.pid` while it still holds the startup lock. The PID file now means the daemon is alive or in controlled startup. |
| Safe client disconnect handling | `_safe_send_bytes` wraps all daemon `conn.send_bytes` calls. It swallows `BrokenPipeError` and `ConnectionResetError`, then logs one INFO line when a client disconnects before receiving the response. |
| Socket-unlink guard | `_unlink_stale_socket` reads `daemon.pid` before removing `daemon.sock`. If the PID belongs to a live sibling daemon, startup raises `RuntimeError` and leaves the sibling socket intact. |
| Bounded daemon logs | The daemon uses `RotatingFileHandler` at 10 MB per file with 5 backups. Disk use for daemon logs caps at 60 MB total. |
| Wider accept backlog | The daemon Listener backlog is 128 instead of the stdlib default of 1. Concurrent client storms queue without the old single-connection bottleneck. |
| Bounded shutdown join | Shutdown wraps handler-task gather in `asyncio.wait_for(..., timeout=10.0)`. A stuck handler task cannot block daemon exit past 10 seconds. |
| Separate lock files | The daemon holds `daemon.lock` for its lifetime. Clients hold `daemon.spawn-lock` only during spawn coordination. `daemon.pid` stays an informational file. |
| Spawn-claim wait | `_wait_for_daemon_claim()` keeps the spawn lock until `daemon.pid` contains a live PID or the spawned process exits. Later callers see the claimed PID and skip duplicate spawn work. |
| Five-file daemon directory | A live daemon has `daemon.pid`, `daemon.sock`, `daemon.log`, `daemon.lock` and `daemon.spawn-lock` under `~/.cocoindex_code/`. The two lock files are 0-byte placeholders. |

Operational notes:

- A second `start_daemon()` caller exits after it fails to acquire the PID lock.
- A daemon that owns a live PID keeps its socket. New startup attempts cannot unlink it.
- Client disconnects no longer create daemon tracebacks during response writes.
- Long-running daemon logs rotate before they can grow without bound.
- Bursty clients get a larger Listener queue before the daemon accepts connections.

Failure signals:

- More than one `ccc run-daemon` process points to stale state or an old install.
- `daemon.pid` with no live process means cleanup did not finish.
- Repeated `BrokenPipeError` traces mean the active daemon predates Patch 2.
- A missing or unlinked socket while a live sibling PID exists indicates Patch 3 is absent.
- Growing `daemon.log` without rotation indicates Patch 5 is absent.

If stale daemon state still blocks startup after a crash or manual process kill, use the operator recovery procedure in `INSTALL_GUIDE.md`.

---

## 2. MCP TOOLS

The MCP server (`ccc mcp`) exposes `search` and `cocoindex_refresh_index`. Status, index lifecycle, and reset remain CLI-only commands.

### search

Perform semantic search across the indexed codebase.

| Parameter       | Type                    | Required | Default | Description                              |
| --------------- | ----------------------- | -------- | ------- | ---------------------------------------- |
| `query`         | string                  | Yes      | -       | Natural language search query            |
| `languages`     | list of strings \| null | No       | null    | Filter by programming languages          |
| `paths`         | list of strings \| null | No       | null    | Filter by file paths                     |
| `limit`         | integer                 | No       | 5       | Maximum number of results to return      |
| `offset`        | integer                 | No       | 0       | Number of results to skip for pagination |
| `refresh_index` | boolean                 | No       | false   | Trigger index refresh before searching   |

**Parameter notes:**
- `languages` accepts a list (e.g., `["python", "typescript"]`), not a single string
- `paths` accepts a list (e.g., `["src/api/", "lib/"]`), not a single string
- `limit` defaults to **5** for MCP (CLI `--limit` defaults to 10)
- `offset` defaults to **0** for MCP and can be used for pagination
- `refresh_index` defaults to `false` for predictable search latency
- `refresh_index=true` remains supported for backward-compatible one-shot refresh-before-search calls
- Stage 1 embedder settings are not MCP request parameters. Configure them with `embedding.provider`, `embedding.model`, `embedding.device`, or `COCOINDEX_CODE_EMBEDDING_MODEL`, then rebuild the index after model changes.
- Stage 2 reranker settings are not MCP request parameters. Configure them with `COCOINDEX_RERANK`, `COCOINDEX_RERANK_MODEL`, and `COCOINDEX_RERANK_TOP_K`; reranking runs only on the retrieved top-K candidates.

**MCP request example:**
```json
{
  "query": "error handling in API routes",
  "languages": ["python", "typescript"],
  "paths": ["src/api/"],
  "limit": 10,
  "offset": 0,
  "refresh_index": false
}
```

**Response:** Array of search results, each containing:
- `file_path`: File path relative to project root
- `start_line`: Start line number
- `end_line`: End line number
- `content`: Code excerpt
- `score`: Relevance score (0.0 to 1.0)
- `language`: Detected programming language

**Interop note:** The live MCP protocol uses snake_case (`file_path`, `start_line`, `end_line`, `content`) as the canonical result shape. Consumers that also support older internal adapters should normalize aliases such as `file`, `filePath`, `lines.start`, `startLine`, and `snippet`, but new MCP callers should emit and expect the snake_case fields. For an in-tree reference normalizer, see the seed-input boundary in `.opencode/skills/system-code-graph/mcp_server/handlers/context.ts` — the `seedFilePath`, `seedStartLine`, `seedEndLine`, and `seedProvider` helpers accept the snake_case wire shape (`file_path`, `start_line`, `end_line`, `content`) and map it to the internal camelCase / `range` representation without scoring or ordering changes.

> **Fork-specific telemetry.** Each result row also carries `dedupedAliases`, `uniqueResultCount`, `rankingSignals`, `source_realpath`, `content_hash`, `path_class`, and `raw_score` — these come from this skill's bundled fork (`0.2.3+spec-kit-fork.0.2.0`) and are NOT present in vanilla upstream cocoindex-code. Callers writing client code against this MCP must account for the extended shape. See [§7 Fork-Specific Output Telemetry](#-7-fork-specific-output-telemetry) for the full schema.

### cocoindex_refresh_index

Refresh the code index without performing a semantic search.

| Parameter | Type                    | Required | Default | Description |
| --------- | ----------------------- | -------- | ------- | ----------- |
| `paths`   | list of strings \| null | No       | null    | Optional changed-path hints; current daemon refresh remains project-wide incremental |

**Parameter notes:**
- Use this tool after file changes when the next search should read a fresh index.
- The current daemon refresh path is project-wide incremental indexing. `paths` is accepted as an MCP contract hint but does not restrict the refresh scope yet.
- The response includes `success`, `reqId`, `paths`, and `message`.

**MCP request example:**
```json
{
  "paths": ["src/api/"]
}
```

---

## 3. CLI vs. MCP PARAMETER MAPPING

| Concept          | CLI Parameter       | MCP Parameter    | Notes                                       |
| ---------------- | ------------------- | ---------------- | ------------------------------------------- |
| Search query     | `QUERY` (positional)| `query`          | Same behavior                               |
| Language filter   | `--lang` (repeatable) | `languages` (list) | CLI: repeatable flag. MCP: list of strings |
| Path filter      | `--path` (string)   | `paths` (list)   | CLI: single path. MCP: list of paths        |
| Result limit     | `--limit` (default: 10) | `limit` (default: 5) | Different defaults        |
| Pagination       | `--offset`          | `offset` (default: 0)  | Available on both surfaces                   |
| Index refresh before search | `--refresh` on `ccc search` | `refresh_index` | CLI search: default false. MCP search: default false |
| Explicit index refresh | `ccc index` | `cocoindex_refresh_index` | MCP refresh is project-wide incremental; CLI index behavior unchanged |

---

## 4. SUPPORTED LANGUAGES

CocoIndex Code supports **28+ programming and markup languages**:

| Language    | Code Value     | Common Extensions                |
| ----------- | -------------- | -------------------------------- |
| C           | `c`            | `.c`, `.h`                       |
| C#          | `csharp`       | `.cs`                            |
| C++         | `cpp`          | `.cpp`, `.cc`, `.cxx`, `.hpp`    |
| CSS         | `css`          | `.css`                           |
| DTD         | `dtd`          | `.dtd`                           |
| Elixir      | `elixir`       | `.ex`, `.exs`                    |
| Fortran     | `fortran`      | `.f`, `.f90`, `.f95`, `.for`     |
| Go          | `go`           | `.go`                            |
| Haskell     | `haskell`      | `.hs`                            |
| HTML        | `html`         | `.html`, `.htm`                  |
| Java        | `java`         | `.java`                          |
| JavaScript  | `javascript`   | `.js`, `.mjs`, `.cjs`            |
| JSON        | `json`         | `.json`                          |
| Kotlin      | `kotlin`       | `.kt`, `.kts`                    |
| Lua         | `lua`          | `.lua`                           |
| OCaml       | `ocaml`        | `.ml`, `.mli`                    |
| Pascal      | `pascal`       | `.pas`, `.pp`                    |
| PHP         | `php`          | `.php`                           |
| Python      | `python`       | `.py`                            |
| R           | `r`            | `.r`, `.R`                       |
| Ruby        | `ruby`         | `.rb`                            |
| Rust        | `rust`         | `.rs`                            |
| Scala       | `scala`        | `.scala`                         |
| Solidity    | `solidity`     | `.sol`                           |
| SQL         | `sql`          | `.sql`                           |
| Swift       | `swift`        | `.swift`                         |
| TOML        | `toml`         | `.toml`                          |
| TypeScript  | `typescript`   | `.ts`                            |
| XML         | `xml`          | `.xml`                           |
| YAML        | `yaml`         | `.yml`, `.yaml`                  |
| Zig         | `zig`          | `.zig`                           |

Use these code values with the CLI `--lang` flag or the MCP `languages` parameter.

---

## 5. ENVIRONMENT VARIABLES

| Variable                      | Required | Default              | Description                                       |
| ----------------------------- | -------- | -------------------- | ------------------------------------------------- |
| `COCOINDEX_CODE_DIR`          | No       | `~/.cocoindex_code`  | Override config/data directory                     |
| `COCOINDEX_CODE_ROOT_PATH`    | No       | auto-detected        | Override project root detection                    |

**Legacy variables (mapped automatically):**

| Legacy Variable           | Maps To                      |
| ------------------------- | ---------------------------- |
| `COCOSEARCH_DIR`          | `COCOINDEX_CODE_DIR`         |
| `COCOSEARCH_ROOT_PATH`    | `COCOINDEX_CODE_ROOT_PATH`   |

Legacy variables are recognized for backward compatibility and automatically mapped to their current equivalents. If both legacy and current variables are set, the current variable takes precedence.

---

## 6. SETTINGS SCHEMA

CocoIndex Code uses YAML settings files stored in the project `.cocoindex_code/` directory and the user home `~/.cocoindex_code/` directory.

**User settings** (`~/.cocoindex_code/global_settings.yml`):
- `embedding.provider` -- Stage 1 bi-encoder embedder provider (e.g., `sentence-transformers`, `litellm`)
- `embedding.model` -- Stage 1 bi-encoder embedding model name (default `nomic-ai/CodeRankEmbed`; alternatives include `text-embedding-3-small`, `voyage/voyage-code-3`, and `gemini/gemini-embedding-001`)
- `embedding.device` -- Stage 1 embedder compute device (e.g., `cpu`, `cuda`, `mps`; default: auto-detect)
- `envs` -- environment variables map (e.g., API keys for LiteLLM providers)

**Reranker environment settings**:
- `COCOINDEX_RERANK` -- enable or disable the Stage 2 cross-encoder reranker (default `true`)
- `COCOINDEX_RERANK_MODEL` -- Stage 2 cross-encoder reranker model name (default `Qwen/Qwen3-Reranker-0.6B`)
- `COCOINDEX_RERANK_TOP_K` -- number of retrieval candidates passed to Stage 2 before the final result cut (default `20`)
- `COCOINDEX_RERANK_PATH_CLASS_BOOST` / `COCOINDEX_RERANK_PATH_CLASS_FACTORS` -- optional path-class reranker tuning controls
- `COCOINDEX_COMMERCIAL_SAFE_PROFILE` -- blocks active non-commercial models when enabled; relevant if opting into non-commercial fallbacks such as `jinaai/jina-reranker-v3`

**Project settings** (`<project>/.cocoindex_code/settings.yml`):
- `include_patterns` -- glob patterns for files to index (default: language-specific patterns)
- `exclude_patterns` -- glob patterns for files to exclude (default: common build/vendor dirs)
- `language_overrides` -- list of `{ext, lang}` mappings for custom file extensions

For detailed schema and configuration examples, see the upstream test files in `tests/test_settings.py` and `tests/test_config.py`.

---

## 7. FORK-SPECIFIC OUTPUT TELEMETRY

This skill bundles a vendored soft-fork of `cocoindex-code` (Python wrapper) at version `0.2.3+spec-kit-fork.0.2.0`. The fork ships REQ-001 through REQ-006 patches that add dedup, canonical path identity, path-class reranking, and ranking telemetry. All search responses (CLI `ccc search` and MCP `search` tool) include the fields below in addition to the standard `file` / `lines` / `snippet` / `score` / `language` baseline. **Vanilla upstream `cocoindex-code` 0.2.3 does NOT emit any of these fields.**

The canonical field-to-REQ mapping lives in [`../changelog/CHANGELOG.md`](../changelog/CHANGELOG.md#0-2-3-spec-kit-fork-0-2-0--2026-04-27); the per-REQ rationale and patch scope live in the originating spec packet at `<spec-folder>`.

### 7.1 Chunk-level fields (stored at index time)

| Field | Type | REQ | When present | Interpretation |
|-------|------|-----|--------------|----------------|
| `source_realpath` | string (absolute filesystem path) | REQ-002 | Always after a fresh `ccc reset && ccc index` against fork ≥0.2.0; absent on chunks indexed by an older binary | Canonical realpath of the source file. Primary dedup key — chunks whose mirror copies share the same realpath are grouped before scoring. |
| `content_hash` | string (16-hex SHA-256 prefix) | REQ-002 | Always after fork ≥0.2.0 reindex | Stable hash of the chunk's source bytes. Fallback dedup key when `source_realpath` is missing (older index rows or symlinked imports). |
| `path_class` | enum string | REQ-004 | Always after fork ≥0.2.0 reindex | One of: `implementation`, `tests`, `docs`, `spec_research`, `generated`, `vendor`. Drives the implementation-intent rerank in §7.3. |

### 7.2 Result-row dedup signals (added at query time)

| Field | Type | REQ | When present | Interpretation |
|-------|------|-----|--------------|----------------|
| `dedupedAliases` | integer (≥0) | REQ-003 | Always on fork queries | Count of mirror-folder duplicates that were collapsed into this representative result. `0` means the chunk was unique; `>0` means N+1 alias copies existed and were folded under this single hit. |
| `uniqueResultCount` | integer | REQ-003 | Top-level metadata on the response (not per-row) | Number of unique results actually returned, after over-fetch (`limit * 4`) and dedup. Lower than `limit` when the corpus has fewer dedup-distinct hits than requested. |

### 7.3 Ranking transparency (added at query time)

| Field | Type | REQ | When present | Interpretation |
|-------|------|-----|--------------|----------------|
| `raw_score` | float (0.0–1.0) | REQ-005 | Always on fork queries | The pre-rerank relevance score. Preserved verbatim so callers can introspect or override the rerank. The `score` field is the post-rerank value. |
| `rankingSignals` | list of strings | REQ-006 | Always on fork queries | Per-result rerank signals emitted by `query._ranked_result`: `implementation_boost`, `spec_research_penalty`, `docs_penalty`, and `canonical_resource_boost`. Empty list means no rerank signal applied. |

### 7.4 Implementation-intent reranking (REQ-005)

When the query intent classifier detects an implementation-seeking question (e.g., "where is X implemented", "show me the function that does Y"), the fork applies a bounded post-vector rerank:

- `path_class == implementation` → score boosted by `+0.05`
- `path_class ∈ {docs, spec_research}` → score reduced by `-0.05`
- All other classes (`tests`, `generated`, `vendor`) → unchanged

Canonical resource paths receive an additional `+0.10` boost and emit `canonical_resource_boost`, regardless of implementation intent. The implementation-intent boost is bounded so it cannot flip an obviously-wrong hit to the top; it nudges ties and near-ties toward implementation files. Both `score` (post-rerank) and `raw_score` (pre-rerank) are emitted so callers can audit the rerank decision.

### 7.5 Reading example

```jsonc
// MCP `search` response excerpt — note the extended fields beyond vanilla shape
{
  "uniqueResultCount": 8,         // top-level: 8 dedup-distinct results returned
  "results": [
    {
      "file": "src/auth/middleware.py",
      "lines": [42, 78],
      "snippet": "def verify_token(token): ...",
      "score": 0.81,              // post-rerank
      "raw_score": 0.76,          // pre-rerank (REQ-005)
      "language": "python",
      "source_realpath": "/repo/src/auth/middleware.py",   // REQ-002
      "content_hash": "a3f2b1c8e9d0",                       // REQ-002
      "path_class": "implementation",                       // REQ-004
      "dedupedAliases": 2,        // 2 mirror copies were collapsed under this row
      "rankingSignals": ["implementation_boost"] // REQ-006
    }
  ]
}
```

Verified against `query._ranked_result` as of mcp-coco-index 1.1.1 (packet 078/004).

### 7.6 Compatibility notes

- **Backward-compatible reads.** A caller written against vanilla `cocoindex-code` will see the standard fields and silently ignore the extras. No breakage.
- **Forward-compatible writes.** Callers SHOULD NOT write code that *requires* these fields to be absent — i.e. don't assert `assert "rankingSignals" not in result`, since that asserts vanilla and breaks under this fork.
- **Reindex required.** Existing indexes built by an older binary won't have `source_realpath` / `content_hash` / `path_class` populated on their chunk rows. Run `ccc reset && ccc index` once after upgrading to fork ≥0.2.0 to populate. The fallback path (using `content_hash` only when `source_realpath` is missing) keeps the dedup correct during the transition.
- **Verifying the binary.** Run `ccc --version` — a fork build reports `0.2.3+spec-kit-fork.0.2.0`. If the version string does NOT contain `+spec-kit-fork.`, the binary is upstream PyPI cocoindex-code and none of the fields above will be emitted. See `INSTALL_GUIDE.md` §Verify and §Reinstall for recovery.

## 8. RELATED RESOURCES

| Resource         | Location                                                            |
| ---------------- | ------------------------------------------------------------------- |
| INSTALL_GUIDE    | `.opencode/skills/mcp-coco-index/INSTALL_GUIDE.md`              |
| Fork CHANGELOG   | `.opencode/skills/mcp-coco-index/changelog/CHANGELOG.md`        |
| Fork MAINTENANCE | `.opencode/skills/mcp-coco-index/mcp_server/MAINTENANCE.md`     |
| Search Patterns  | `.opencode/skills/mcp-coco-index/references/search_patterns.md` |
| Cross-CLI Playbook | `.opencode/skills/mcp-coco-index/references/cross_cli_playbook.md` |
| Config Templates | `.opencode/skills/mcp-coco-index/assets/config_templates.md`    |
| Upstream Tests   | `.opencode/skills/mcp-coco-index/tests/`                        |
