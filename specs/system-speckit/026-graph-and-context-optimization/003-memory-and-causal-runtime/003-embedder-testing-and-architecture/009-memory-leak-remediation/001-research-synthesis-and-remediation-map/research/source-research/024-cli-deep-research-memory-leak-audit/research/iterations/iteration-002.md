# Iteration 002 — Retained in-process state behind iteration 001 findings

## Focus

Confirm or refine iteration 001 (F-001..F-010) by drilling into the actual
retention surfaces:

1. `Project.close()` semantics — does it close `coco.App`, `coco.Environment`,
   embedder, sqlite-vec, or just drop one context entry?
2. `ProjectRegistry.close_all()` — does it walk all caches (embedders,
   load-time events, current-index-meta, reranker `_ADAPTERS`) or only the
   `_projects` dict?
3. `system-code-graph` SIGTERM/SIGINT path — does `shutdownCodeIndex()`
   actually invoke `closeDb()`?
4. Embedder construction sites — do they create module-global or long-lived
   HTTP clients (litellm / Voyage / Cohere / httpx / requests / OpenAI SDK)
   without an explicit close?

## Actions Taken

- Read `mcp-coco-index/mcp_server/cocoindex_code/core/project.py` end-to-end
  (134 lines).
- Read `core/shared.py` end-to-end and tracked the `Embedder` type alias plus
  the `_build_embedder` / `create_embedder` factory chain (214 lines).
- Read `embedders/registered_embedders.py` end-to-end (379 lines, declarative
  metadata only — no runtime client construction).
- Read `system-code-graph/mcp_server/lib/code-graph-db.ts` (1246 lines) and
  `mcp_server/index.ts` (95 lines) to map the singleton DB lifecycle.
- Grep-confirmed `closeDb()` callers across the system-code-graph tree:
  `lib/recovery-procedures.ts:171,262` only — never from `shutdownCodeIndex`.
- Read `daemon.py:340-470` (`ProjectRegistry.__init__`, `get_project`,
  `_embedder_for_project`, `_refresh_project_if_config_changed`) and
  `daemon.py:820-852` (`remove_project`, `close_all`, `list_projects`).
- Grep-checked the embedders package for `httpx`, `requests.Session`,
  `aiohttp`, module-level `_CLIENT_CACHE`, `lru_cache`, `cache` decorators —
  zero hits.

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/shared.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/embedders/registered_embedders.py`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` (lines
  340–470, 620–660, 820–852, 1228–1300)
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts`
- `.opencode/skills/system-code-graph/mcp_server/index.ts`
- `.opencode/skills/system-code-graph/mcp_server/lib/recovery-procedures.ts`
  (callers of `closeDb`)

## Findings

Severity prefix is provisional. New IDs are F-011..F-015. Confirmations use
the `C-002-F0NN-confirmation` convention.

### F-011 [P0] — `Project.close()` only closes one sqlite handle; leaves `coco.App` + `coco.Environment` + embedder + sqlite-vec untouched

- Owner: `mcp-coco-index`
- Process kind: in-process CocoIndex Environment + App (Rust + Python state)
- Evidence:
  - `core/project.py:36-42` — body of `close()` is `db = self._env.get_context(SQLITE_DB); db.close()` wrapped in a bare `except Exception: pass`. Nothing else.
  - `core/project.py:107-127` — the Environment is constructed with seven
    context entries (`CODEBASE_DIR`, `SQLITE_DB`, `EMBEDDER`, two prompt
    names, `PROJECT_SETTINGS`, `EXT_LANG_OVERRIDE_MAP`, `GITIGNORE_SPEC`) and
    the `coco.App` is built on top via `coco.App(coco.AppConfig(name=..., environment=env), indexer_main)`. None of them are released by `close()`.
  - `core/project.py:109` — `sqlite.connect(str(target_sqlite_db_path), load_vec=True)` returns a `cocoindex.connectors.sqlite.ManagedConnection`. `close()` reaches this one connection via the context-key lookup — but the SQLite *file* opened by `coco.Settings.from_env(cocoindex_db_path)` at line 104 (the cocoindex metadata DB) is held by `self._env` and never closed here.
- Cleanup boundary: missing. The `_env` and `_app` references are still bound to `self` after `close()` returns. They are released only when the Project object itself is garbage-collected.
- Observed risk: `Project.close()` reads like a full resource release in its docstring ("Close project resources to release file handles (LMDB, SQLite)") but only releases the target sqlite-vec ManagedConnection. The cocoindex.db (settings/metadata) handle, the App's pipeline state, and the embedder reference all survive the call. In long-running daemons that swap projects via `remove_project` (daemon.py:820-830), the `del project; gc.collect()` at line 828-829 is the *only* thing that releases App+Environment — and only if no other reference exists (e.g. if `_embedder_by_config_hash` still pins the embedder, the chain to the App via shared sqlite + EmbedderContext is at risk of partial retention).
- Candidate remediation packet: `<NNN>-project-close-full-release` — extend
  `Project.close()` to explicitly close `self._app`, `self._env`, and the
  cocoindex metadata DB; drop `self._app` and `self._env` after close.

### F-012 [P0] — `ProjectRegistry._embedder_by_config_hash` never cleared by `close_all()` or `remove_project()`

- Owner: `mcp-coco-index`
- Process kind: heavy embedder (sentence-transformers MPS / LiteLLM client)
  cached at registry scope
- Evidence:
  - `daemon.py:354` — `self._embedder_by_config_hash: dict[str, Embedder] = {}` is registry-level state.
  - `daemon.py:392-404` (`_embedder_for_project`) — populated lazily by
    `create_embedder(settings.embedding)` (shared.py:188) keyed by
    `effective_config_hash`. A new entry is created for every distinct
    config (model swap, device swap, prompt-name swap).
  - `daemon.py:820-830` (`remove_project`) — pops `_projects`, `_index_locks`,
    `_load_time_done`, `_project_effective_config_hash`, `_current_index_meta`. **Does not** pop `_embedder_by_config_hash`.
  - `daemon.py:832-841` (`close_all`) — iterates `_projects.values()` to call
    `project.close()`, then `self._projects.clear()`, `self._index_locks.clear()`, `self._load_time_done.clear()`, `gc.collect()`. **Does not** clear `_embedder_by_config_hash` or `_project_effective_config_hash` or `_current_index_meta`.
- Cleanup boundary: missing. Every embedder ever instantiated within the
  daemon's lifetime stays in the dict, preserving live model weights, MPS
  contexts, and any HTTP client litellm caches internally.
- Observed risk: independent of F-001/F-002, this is the *embedder* analog of
  the reranker `_ADAPTERS` leak. Operator-driven model swaps via
  `COCOINDEX_CODE_EMBEDDING_MODEL` or `ccc index --model …` accumulate
  full-sized embedders for every distinct effective config hash for the full
  daemon lifetime.
- Candidate remediation packet: `<NNN>-registry-embedder-cache-lifecycle` —
  unify `close_all` to walk `_embedder_by_config_hash`, call `close()` if the
  embedder exposes one (litellm), drop strong refs, and clear sibling caches.

### F-013 [P1] — `system-code-graph` SIGTERM/SIGINT shutdown never calls `closeDb()`

- Owner: `system-code-graph`
- Process kind: better-sqlite3 singleton (`code-graph.sqlite`) with WAL
- Evidence:
  - `mcp_server/index.ts:53-62` — `shutdownCodeIndex(reason)` awaits
    `ipcBridge.close()` if present, sets `ipcBridge = null`, returns. No
    other resource is touched.
  - `mcp_server/index.ts:64-69` — `SIGINT`/`SIGTERM` handlers call
    `shutdownCodeIndex(...).finally(() => process.exit(0))`.
  - `lib/code-graph-db.ts:22-23` — `let db: Database.Database | null = null` is a module singleton; `let dbPath: string | null = null`.
  - `lib/code-graph-db.ts:301-306` — `closeDb()` exists and `db.close()`s the
    handle, but grep across `mcp_server/**` shows production callers only in
    `lib/recovery-procedures.ts:171, 262` (destructive recovery paths) and
    in tests/stress harnesses.
- Cleanup boundary: relied on process exit. better-sqlite3 closes the file
  descriptor at C++ destructor time when the V8 isolate tears down, but
  WAL checkpoint behavior on abrupt SIGTERM is not as clean as an explicit
  `close()`. Recovery from a wal-tail crash is handled by sqlite, but the
  P1 concern is that any other cleanup hooked off `closeDb()` (none today)
  silently won't fire.
- Observed risk: when the MCP host (claude/codex/opencode CLI) sends SIGTERM
  to the launcher and the launcher cascades to the MCP child, the child exits
  without explicit DB close. Per-file F-007 lookups, the
  `code_graph_*` handlers (e.g. lib/code-graph-context.ts:274,526;
  lib/cross-file-edge-resolver.ts:61) all reuse the singleton via `getDb()`
  — so handle count is bounded — but the lifecycle is implicit and any
  future per-handler DB extension (e.g. read-only attach DBs for impact
  queries) would inherit the same gap.
- Candidate remediation packet: `<NNN>-code-graph-shutdown-closedb` — extend
  `shutdownCodeIndex()` to `closeDb()` after `ipcBridge.close()`.

### F-014 [P1] — `_refresh_project_if_config_changed` partially evicts; leaks `_load_time_done`, `_current_index_meta`, embedders

- Owner: `mcp-coco-index`
- Process kind: registry dictionary entries (asyncio.Event + dict + embedder
  ref)
- Evidence:
  - `daemon.py:406-416` (`_refresh_project_if_config_changed`):
    ```
    project = self._projects.pop(project_root, None)
    if project is not None:
        project.close()
    self._project_effective_config_hash.pop(project_root, None)
    ```
  - Compared with `remove_project` (daemon.py:820-830) which also pops
    `_index_locks`, `_load_time_done`, `_current_index_meta` and calls
    `del project; gc.collect()`.
- Cleanup boundary: partial. After a config change, `_load_time_done` keeps
  a stale `asyncio.Event` for the same `project_root`; the next
  `get_project()` call repopulates `_projects` and *overwrites* the Event
  (daemon.py:373-376), so the leak is bounded to the rotation event but the
  embedder cached under the *previous* `effective_config_hash` (F-012) is
  never reclaimed. The previous-config embedder lives on forever even though
  no project still references it.
- Observed risk: medium-frequency operator events (model swap mid-session,
  prompt-name override, device change) compound F-012 deterministically.
- Candidate remediation packet: subsumed by F-012 remediation; alternately
  `<NNN>-refresh-project-uses-remove-project` to share the eviction code.

### F-015 [P2] — `LiteLLMEmbedder` constructed with no daemon-side close; relies on `litellm` module-globals

- Owner: `mcp-coco-index`
- Process kind: `litellm` provider clients (Voyage / Cohere / OpenAI /
  Anthropic / etc.) backed by httpx
- Evidence:
  - `core/shared.py:172-184` — `_build_embedder` non-sbert branch:
    `from cocoindex.ops.litellm import LiteLLMEmbedder` then
    `instance = LiteLLMEmbedder(settings.model, **kwargs)` and returns.
  - No `close()` invocation anywhere on a LiteLLMEmbedder instance: grep
    inside the embedders/ tree returned zero `httpx`, `requests.Session`,
    `aiohttp`, `lru_cache`, `cache`, `_CLIENT_CACHE` hits — so the project
    code does not own a long-lived HTTP client *directly*, but the upstream
    `litellm` package keeps a process-global async http client pool plus a
    threadpool for sync calls.
- Cleanup boundary: missing on the project side. The upstream `litellm`
  internals are module-global and survive any `del LiteLLMEmbedder()` call.
  Combined with F-012, every Voyage/Cohere/OpenAI variant ever swapped to
  pins those provider HTTP pools for the daemon's whole life.
- Observed risk: in non-sbert deployments, this is the dominant in-process
  growth surface. For the canonical sbert default
  (`sbert/nomic-ai/CodeRankEmbed` per `registered_embedders.py:255`) this
  is inert because the LiteLLM branch is unreachable.
- Candidate remediation packet: `<NNN>-litellm-embedder-pool-shutdown` —
  document the upstream contract; on daemon shutdown call
  `litellm.aclose()` / clear `litellm._aclient` references where exposed.

### C-002-F001-confirmation [P0 unchanged] — F-001 confirmed (close_all walks projects only)

- `daemon.py:832-841` definitively iterates `self._projects.values()`. There
  is no enumeration of `rerankers/reranker.py::_ADAPTERS` and no
  reranker-side close hook. Severity stays P0.

### C-002-F002-confirmation [P0 unchanged] — F-002 confirmed (module-global `_ADAPTERS` untouched by shutdown)

- Same evidence as C-002-F001-confirmation. `close_all` clears
  `_projects`, `_index_locks`, `_load_time_done`; never touches the
  rerankers package. Severity stays P0.

### C-002-F005-refinement [P1 → P1 with scope tightening]

- `daemon.py:378` — the auto-index `asyncio.create_task(self._run_index(project_root))` is fire-and-forget (no local reference).
- `daemon.py:630-635` — the *explicit* `index_streamed` path DOES capture
  `index_task = asyncio.create_task(...)` and awaits it via the
  progress-queue drain loop (lines 637-648). So F-005's "background indexing
  task" is **only** the auto-index path, not every indexing path.
- F-010 (silent "task exception never retrieved") is the more accurate
  framing of the same bug. Recommend merging F-005 into F-010 in the next
  reducer pass: there is one defect (line 378 unreferenced task), with two
  user-visible symptoms (shutdown gather misses it; exceptions are eaten).

## Questions Answered

- **Does `Project.close()` actually close sqlite/sqlite-vec/db handles,
  embedder contexts, index watcher state, and background tasks, or only
  drop references?** Closes ONLY the target sqlite-vec ManagedConnection.
  Does not close `coco.App`, `coco.Environment`, cocoindex.db metadata DB,
  the embedder, or any background tasks. (F-011)
- **Do mcp-coco-index embedders create module-global or long-lived HTTP/API
  clients (litellm, Voyage, Cohere, httpx, requests, OpenAI SDK, etc.)
  without explicit close?** Project-side code does NOT directly create
  httpx/requests/aiohttp clients (grep returned zero hits in embedders/).
  However: (a) the `LiteLLMEmbedder` non-sbert path relies on upstream
  litellm module-globals which carry process-global HTTP pools (F-015), and
  (b) `ProjectRegistry._embedder_by_config_hash` (F-012) holds every
  embedder ever created for the daemon's lifetime regardless of cleanup
  intent.
- **Do system-code-graph database helpers open better-sqlite3 or other
  handles per call and fail to close them?** No. `code-graph-db.ts`
  uses a singleton `db` (line 22) with one process-wide handle. Production
  shutdown never calls `closeDb()` (F-013), but per-call leakage is zero.
- **Which iteration 001 P0/P1 findings get stronger evidence, weaker
  evidence, or need split follow-up packets?** F-001 (confirmed P0), F-002
  (confirmed P0). F-005 should merge into F-010 (one defect, two symptoms).
  F-003, F-004, F-006 unchanged — not re-examined in iteration 002.

## Questions Remaining

- Does the upstream `cocoindex.connectors.sqlite.ManagedConnection.close()`
  actually checkpoint the WAL and release the sqlite-vec extension, or just
  decrement a refcount? Out-of-tree (vendored cocoindex Python package);
  iteration 003 could read `.opencode/external/cocoindex/` if it exists.
- Does `coco.Environment` or `coco.App` expose a Python-level `close()` /
  `__del__` that would let `Project.close()` release Rust-side resources?
  Same out-of-tree question.
- Does `sentence_transformers.SentenceTransformerEmbedder` (the upstream
  cocoindex wrapper, not the HF library) expose a `.close()` or `.unload()`
  hook that the daemon should call?
- Does `litellm` expose a top-level `aclose()` or pool-reset surface usable
  from the daemon shutdown path?
- What is the real RSS delta per `_refresh_project_if_config_changed` event
  on an Apple Silicon host? Still need runtime evidence.

## Ruled Out

- **`embedders/registered_embedders.py` holds runtime HTTP clients.** Read
  end-to-end: it is purely declarative metadata (`@dataclass(frozen=True)`
  `EmbedderMetadata` + `RerankerMetadata`, plus tuple `MANIFESTS`,
  `RERANKER_MANIFESTS`, and `default_embedder()` lookup). The `default_embedder()` call at line 378 runs at module import to validate the
  registry but does not load model weights. Not a leak surface.
- **`closeDb()` reachable from production paths other than recovery.** Grep
  over the entire `system-code-graph/mcp_server/**` (excluding `tests/`,
  `stress_test/`) returned only `lib/recovery-procedures.ts:171,262`. The
  function exists for tests/stress and recovery only.

## Dead Ends

- Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` /
  `aiohttp` in `embedders/` — zero hits. Saved tool calls by stopping there
  rather than reading every embedders/ submodule.

## Reflection

- What worked and why: Reading `project.py`, `shared.py`, and `daemon.py`
  registry methods end-to-end (rather than just the constructor sites) was
  the right move — F-011, F-012, F-014 only become visible when you compare
  `__init__` (lines 349-356) against `close_all` (832-841) and
  `_refresh_project_if_config_changed` (406-416). Cross-referencing the
  three lifecycle paths revealed the asymmetric cleanup.
- What did not work and why: I initially planned to read
  `cocoindex.connectors.sqlite` to confirm whether `ManagedConnection.close()`
  is shallow or deep. The vendored cocoindex source is not under this repo
  (no `external/cocoindex/` checked in), so the question stays open for
  iteration 003 unless a vendored copy is added.
- What I would do differently: Iteration 001 enumerated *spawn sites*;
  iteration 002 should have led with the *cleanup-site* asymmetry table
  (`__init__` keys vs `close_all` keys) instead of reading project.py
  first. Same conclusion either way, but the asymmetry table is the
  shorter path. Save for iteration 003.

## Next Focus

Iteration 003 should:

1. Diff `ProjectRegistry.__init__` registered-state keys against
   `close_all()` + `remove_project()` cleanup keys in a single table to
   surface every leaking dict at a glance. Confirm F-012/F-014 are the
   only two asymmetries.
2. Inspect `rerankers/reranker.py` `_ADAPTERS` mutation surface in detail
   (`get_reranker_adapter` at line 385-414) to characterize how many
   distinct keys an operator-driven session can accumulate (per-model,
   per-device, per-base-url).
3. Audit `mcp-coco-index/mcp_server/cocoindex_code/cli.py` `_bg_index`
   callers (cli.py:1204, server.py:557) — the same `asyncio.create_task`
   without reference capture pattern that produced F-010.
4. If a vendored `cocoindex` python package is present anywhere in the
   workspace, read its `ManagedConnection.close()` and `App.__del__` /
   `Environment.__del__` to settle the "shallow vs deep" close question.

## Recommended Next Focus

Confirm the cleanup-asymmetry diff (F-012 + F-014) is exhaustive, and audit
the `_bg_index` fire-and-forget pattern (cli.py:1204, server.py:557) to see
whether F-010's "task exception never retrieved" repeats outside the daemon.
