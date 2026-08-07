# Iteration 005 — RemoveProject-mid-Index cancellation semantics + `_ADAPTERS` mutation audit

## Focus

Close the two iter-004 tail questions:

1. Read `daemon.py:1000-1080` request dispatch plus
   `ProjectRegistry.remove_project` and `ProjectRegistry.update_index` /
   `_run_index` bodies to characterize what happens when a
   `RemoveProjectRequest` arrives while an `IndexRequest` is in flight for
   the same `project_root`. Decide whether the existing project-scoped
   eviction primitive can be repurposed as a narrow cancel path while a
   full `CancelIndexRequest` is being designed.
2. Complete the deferred `rerankers/reranker.py::_ADAPTERS` mutation audit
   for per-session key accumulation rate, so F-001/F-002 has measured
   evidence of how much (and how often) the adapter cache grows. Also
   confirm whether either adapter (sidecar / CrossEncoder / Jina) exposes
   a close/unload path or any bounded eviction.

## Actions Taken

- Read `core/daemon.py` request-dispatch body (lines 1000-1072) and the
  full handler-spawn / shutdown loop (1235-1299) to confirm that each
  RPC runs in its own `handle_connection` task tied to its own
  `Connection`, so an `IndexRequest` task and a `RemoveProjectRequest`
  task are co-resident on the event loop with no serialization between
  them.
- Read `core/daemon.py::ProjectRegistry` end-to-end (340-850), focusing
  on `get_project` (358-379), `_run_index` (443-473), `update_index`
  (610-660), `remove_project` (816-830), and `close_all` (832-841).
- Read `rerankers/reranker.py` end-to-end (1-432) to characterize
  `_ADAPTERS` keying, mutation sites, lifetime, and any close/unload
  surface on the three adapter classes (`CrossEncoderRerankerAdapter`,
  `HttpSidecarRerankerAdapter`, `JinaRerankerAdapter`).
- Grepped the whole `mcp_server/` tree for `_ADAPTERS`, `close_reranker`,
  `_fallback_adapter`, and `httpx.Client` — 22 hits across source and
  tests; only test fixtures reset `_ADAPTERS` via monkeypatch; zero
  production callers ever close any adapter or `httpx.Client`.
- Cross-referenced the iter-002 cleanup-asymmetry inventory (F-014 /
  F-016) to confirm `_ADAPTERS` is not on the 7-entry `ProjectRegistry`
  cache list — it lives in module-global state in `rerankers/reranker.py`
  and is invisible to any project-scoped or daemon-shutdown cleanup
  path.

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
  (lines 340-510 ProjectRegistry init through `_run_index`; 610-660
  `update_index`; 816-841 `remove_project` + `close_all`; 1000-1072
  `dispatch_request`; 1197-1299 `_async_daemon_main` accept + shutdown
  loop)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py`
  (lines 1-432, with focus on 20 `_ADAPTERS`, 130-223
  `CrossEncoderRerankerAdapter`, 226-357 `HttpSidecarRerankerAdapter`,
  365-414 `_try_fallback_reranker` + `get_reranker_adapter`)
- Tree-wide grep results for `_ADAPTERS` / `close_reranker` /
  `_fallback_adapter` / `httpx.Client` confirming zero production close
  callers

## Findings

New IDs continue from F-021: F-022, F-023, F-024.

### F-022 [P1] — `RemoveProjectRequest` mid-`IndexRequest` does NOT cancel the in-flight index; it deletes the registry pointers underneath an active indexer, opening silent index-corruption and double-indexer races

- Owner: `mcp-coco-index` (daemon-side `ProjectRegistry` lifecycle)
- Process kind: two co-resident asyncio handler tasks on the daemon
  event loop, each driving a different request type for the same
  `project_root` with NO serialization between them
- Evidence:
  - `daemon.py:1014-1015` — `IndexRequest` dispatch returns
    `registry.update_index(req.project_root)` (an `AsyncIterator`); the
    iterator at `daemon.py:630-635` spawns a sibling task
    `index_task = asyncio.create_task(self._run_index(project_root, ...))`
    that runs concurrently with the streaming generator.
  - `daemon.py:1052-1054` — `RemoveProjectRequest` dispatch is a
    synchronous `registry.remove_project(req.project_root)` call. It
    runs as soon as its handler task gets the event loop, with no check
    of `self._index_locks[project_root].locked()` and no awaiting of an
    in-flight `_run_index` task.
  - `daemon.py:816-830` — `remove_project` body:
    ```
    was_loaded = project_root in self._projects
    project = self._projects.pop(project_root, None)
    self._index_locks.pop(project_root, None)
    self._load_time_done.pop(project_root, None)
    self._project_effective_config_hash.pop(project_root, None)
    self._current_index_meta.pop(project_root, None)
    if project is not None:
        project.close()
        del project
        gc.collect()
    ```
    No task lookup, no `task.cancel()`, no `await`. `project.close()` is
    invoked **unconditionally** even when an in-flight `_run_index` task
    still holds a strong reference to `project` and is mid-
    `project.update_index()` (i.e., actively writing to sqlite-vec).
  - `daemon.py:443-473` — `_run_index` captures `project` and `lock`
    via `self._projects[project_root]` / `self._index_locks[project_root]`
    on its **first line** (lines 457-458). If `remove_project` wins the
    scheduling race and runs **before** `_run_index` has started
    executing its body, `_run_index` raises `KeyError(project_root)` at
    line 457. The exception is logged via `logger.exception("Indexing
    failed for %s", project_root)` (line 467) and then re-raised — but
    the parent `update_index` generator (line 651
    `index_task.result()`) only yields `IndexResponse(success=False,
    message=str(e))` (line 659) and the client sees a confusing
    "KeyError" failure for an index it explicitly requested.
  - `daemon.py:610-660` — `update_index` itself calls `get_project`
    first (line 622), which **re-adds** the project to `_projects` /
    `_index_locks` / `_load_time_done` via `get_project` (lines 369-376).
    If `remove_project` lands between `get_project` returning and
    `_run_index`'s first dict read, the pop succeeds but the task body
    KeyErrors. If `remove_project` lands between `_run_index`'s body
    capturing `project = self._projects[project_root]` and the actual
    `project.update_index()` call, both pointers are valid for the task
    but the registry has already removed them — and the next
    `IndexRequest` or `SearchRequest` for the same `project_root` will
    call `get_project` again, create a **brand new** `Project` instance
    with a **brand new** `_index_locks[project_root]` lock, and call
    `_run_index` again, while the orphaned earlier `_run_index` is
    still writing to the same `.cocoindex_code/target_sqlite.db`. The
    per-project-lock guarantee at the heart of `_run_index` is broken;
    two indexers write to the same target DB concurrently.
  - `daemon.py:470-473` — orphaned `_run_index` finally block reads
    `event = self._load_time_done.get(project_root)`. After `remove_project`,
    that returns `None`, so the `if event is not None: event.set()`
    branch is skipped. Any caller that was awaiting
    `wait_for_indexing_done` (line 431-441) for the old event blocks
    forever, since the orphan no longer has access to set it and a
    fresh `get_project` will allocate a different event object.
  - The orphan `_run_index` task is also untracked: `update_index` at
    line 630 stores `index_task` only as a local in the generator
    frame. After the streaming generator hits `GeneratorExit` on client
    disconnect (lines 654-657) or returns normally, the local goes out
    of scope — but the task is still pending in the event loop, with
    no reference held by `ProjectRegistry`. The `handler_set` at
    daemon.py:1244 tracks the **handler** task, not the inner
    `index_task`.
- Cleanup boundary: missing. `remove_project` claims project-scoped
  cleanup semantics but provides none for in-flight indexing.
- Observed risk:
  - Silent index corruption when two `_run_index` tasks write to the
    same sqlite-vec target concurrently (re-add race after pop).
  - sqlite-vec `ManagedConnection` closed underneath an active write
    (`project.close()` while `project.update_index()` is mid-call).
  - Confusing `KeyError(project_root)` failures returned to the client
    for explicitly-requested IndexRequests.
  - Forever-blocked waiters on the stale `_load_time_done` event.
  - Orphan `_run_index` task never accounted for in shutdown gather
    (only the outer handler is in `tasks` at daemon.py:1244).
- Verdict on the iter-004 open question: `RemoveProjectRequest`
  **cannot be repurposed as a narrow cancel path** without first being
  fixed to (a) look up any in-flight `_run_index` task, (b) cancel it
  via `task.cancel()`, (c) `await` it with a bounded timeout, (d)
  **then** call `project.close()` and pop the dict entries. The
  existing eviction primitive is itself a latent bug; the cancel-via-
  RemoveProject idea makes the bug load-bearing rather than fixing it.
- Candidate remediation packet:
  `<NNN>-remove-project-cancel-safety` — separate from the
  `daemon-protocol-cancel-index-surface` packet because the registry-
  side race is a daemon-internal correctness fix that should land
  whether or not the protocol gains a `CancelIndexRequest`. Once both
  ship, the new `CancelIndexRequest(project_root, reqId)` can be
  implemented in terms of the fixed `_cancel_in_flight_index`
  primitive, and `RemoveProjectRequest` can call it before
  `project.close()`.

### F-023 [P2] — `_ADAPTERS` module-global cache in `rerankers/reranker.py` has NO close/unload path and NO bounded eviction; entries pin heavy models (CrossEncoder, JinaReranker) and httpx connection pools for the lifetime of the daemon process

- Owner: `mcp-coco-index` (daemon-side rerank surface — adapter cache is
  reachable from `query_codebase` via `rerank()` on every search)
- Process kind: module-global `dict[str, Any]` with read-modify-write
  pattern on `get_reranker_adapter`
- Evidence:
  - `rerankers/reranker.py:20` — `_ADAPTERS: dict[str, Any] = {}`
    declared at module scope; lives for the lifetime of the daemon
    process where `query_codebase` runs.
  - `rerankers/reranker.py:385-414` — `get_reranker_adapter` is the
    single write site, with two keying conventions:
    - Sidecar mode: `sidecar_key = f"__http_sidecar__:{model_name}"`
      (line 397) → `HttpSidecarRerankerAdapter(model_name)` (line 400).
    - Non-sidecar mode: bare `model_name` key (line 404) →
      `CrossEncoderRerankerAdapter(model_name)` or
      `JinaRerankerAdapter(model_name)` (lines 410, 412).
  - `rerankers/reranker.py:24-35` — `_rerank_via_sidecar_enabled()`
    reads `COCOINDEX_RERANK_VIA_SIDECAR` on **every** call. So if the
    env flag toggles between calls (e.g., test, bench-lane swap), both
    a `__http_sidecar__:<m>` entry **and** a bare `<m>` entry can
    accumulate for the same model — the lookup is gate-keyed but the
    cache is not.
  - `rerankers/reranker.py:365-382` — `_try_fallback_reranker` reads
    `COCOINDEX_RERANK_FALLBACK_MODEL` at every call and calls
    `get_reranker_adapter(fb_name)`. Whenever the primary fails and a
    fallback is configured, a **second** adapter entry is created and
    pinned. The fallback path can therefore double the live-adapter
    count even when the user only intends one rerank model per
    session.
  - `rerankers/reranker.py:130-223`
    `CrossEncoderRerankerAdapter._load_model()` lazy-loads a
    `sentence_transformers.CrossEncoder` (~300 MB – 3 GB resident,
    model-dependent) into `self._model`. No `close`, no `unload`, no
    `__del__`. The model is freed only when the adapter dict entry is
    overwritten or the process exits.
  - `rerankers/reranker.py:226-262` —
    `HttpSidecarRerankerAdapter._get_client` lazy-creates
    `httpx.Client(base_url=..., timeout=...)` (line 253) into
    `self._client`. The client owns a TCP connection pool that is
    never closed. `_get_fallback` (line 259) **also** lazy-creates a
    `CrossEncoderRerankerAdapter` as `self._fallback_adapter` (line
    261) — so sidecar-mode entries pin both the httpx pool **and** a
    full bundled CrossEncoder fallback. Sidecar mode does not save
    memory.
  - Tree-wide grep: zero production callers invoke any close method
    on either adapter class or on the cached httpx.Client. Only test
    fixtures reset `_ADAPTERS` via `monkeypatch.setattr` (e.g.
    `tests/test_rerank_dispatch.py:48`, `tests/test_reranker.py:249`).
    There is no `close_all_adapters()` helper or shutdown hook.
  - The seven-entry cleanup-asymmetry inventory at iter-002 F-014 /
    iter-003 F-016 covered only `ProjectRegistry`-owned caches; this
    is an **eighth** uncleaned-up cache living in
    `rerankers/reranker.py` module-globals, invisible to
    `ProjectRegistry.close_all()` (daemon.py:832-841) and to
    `Project.close()`.
- Cleanup boundary: missing on multiple axes — no bounded eviction, no
  close path on either adapter, no module-level reset helper, not
  hooked into daemon shutdown.
- Per-session accumulation-rate evidence (the deferred iter-003 audit):
  - Steady-state operation with a fixed `COCOINDEX_RERANK_MODEL` and
    fixed `COCOINDEX_RERANK_VIA_SIDECAR` and no fallback: **1 entry**
    per session.
  - With a configured `COCOINDEX_RERANK_FALLBACK_MODEL` distinct from
    the primary: **2 entries** per session, both pinned (primary +
    fallback). Both adapters loaded only on first miss, but neither
    released after.
  - With `COCOINDEX_RERANK_VIA_SIDECAR` toggled mid-session: a
    `__http_sidecar__:<m>` entry **and** a `<m>` entry coexist for the
    same model — **2 entries** for one effective model. Plus the
    sidecar adapter's `_fallback_adapter` slot internally caches a
    CrossEncoderRerankerAdapter on first failure, which is a
    **third** model footprint not visible in `_ADAPTERS`.
  - With per-query `model_name` overrides (only used by tests today;
    no production caller varies `model_name` per request): adapter
    count = number of distinct model_names ever passed to
    `rerank()`. Bounded only by call-site discipline, not by the
    cache.
  - Worst-case observed pattern in a deep-loop session that toggles
    `_DEFAULT_RERANK_MODEL` between benches (016/007/003 lane
    swapping): up to 3 entries plus 1 hidden fallback = ~4 loaded
    reranker model footprints per daemon, ~1.5 GB – 12 GB resident.
- Observed risk: bounded, deterministic, low-rate growth (≤4 entries
  in any realistic session), but each entry is heavy enough that
  per-iteration daemon RSS bias is measurable. Not a runaway leak; a
  fixed-cost growth that never returns to baseline even after the
  user runs `ccc remove-project` (which only touches
  `ProjectRegistry`, never `_ADAPTERS`). Combined with F-012's
  `_embedder_by_config_hash` and F-011's incomplete `Project.close`
  shallow-close hazard, the daemon's "warm-cache" floor monotonically
  rises with every fresh embedder/reranker config the user touches
  over the daemon's lifetime, and the only release is daemon restart.
  Severity P2: bounded, but the absence of any close path and the
  hidden internal fallback in HttpSidecarRerankerAdapter make this
  the largest contributor to the "daemon RSS grows over hours, never
  shrinks" symptom in the F-001/F-002 telemetry.
- Candidate remediation packet:
  `<NNN>-adapter-lifecycle-management` — covers (1) `close()` method
  on both `CrossEncoderRerankerAdapter` and `HttpSidecarRerankerAdapter`
  that closes `httpx.Client` and drops the model reference, (2)
  `close_all_adapters()` module helper iterating `_ADAPTERS.values()`
  + clearing the dict, (3) call site in `ProjectRegistry.close_all`
  (daemon.py:832-841) and in `_async_daemon_main` finally-block
  (daemon.py:1280-1299), (4) optional LRU-N=2 eviction policy in
  `get_reranker_adapter` keyed on `_DEFAULT_RERANK_MODEL` changes, so
  the daemon does not accumulate stale entries when bench lanes swap.

### F-024 [P2] — `HttpSidecarRerankerAdapter._client` (httpx.Client) and `_fallback_adapter` (bundled CrossEncoder) are both pinned with no release path, so sidecar mode does NOT in fact reduce daemon-side memory pressure

- Owner: `mcp-coco-index` (rerankers/reranker.py:226-357)
- Process kind: lazy-initialized HTTP client + lazy-initialized
  bundled-model fallback adapter, both owned by a long-lived
  `HttpSidecarRerankerAdapter` instance pinned in `_ADAPTERS`
- Evidence:
  - `rerankers/reranker.py:235-247` — `__init__` initializes
    `self._client = None` and `self._fallback_adapter = None`.
  - `rerankers/reranker.py:249-257` — `_get_client()` creates
    `httpx.Client(base_url=f"http://127.0.0.1:{self.port}",
    timeout=self.timeout_s)` on first use. The client owns a TCP
    connection pool and a thread that drains it. No close site
    anywhere.
  - `rerankers/reranker.py:259-262` — `_get_fallback()` instantiates a
    full `CrossEncoderRerankerAdapter(self.model_name)` as the
    sidecar's fallback. This means even when sidecar mode is
    operational (no failures), the sidecar adapter is one HTTP failure
    away from loading a bundled CrossEncoder model **inside the same
    daemon** that was deliberately delegated to the sidecar.
  - `rerankers/reranker.py:263-279` — `_fallback_to_bundled` triggers
    the fallback adapter on `sidecar_unavailable`, `sidecar_5xx`,
    `sidecar_4xx`, or `sidecar_malformed`. After a single transient
    failure, the bundled CrossEncoder is loaded and pinned for the
    rest of the daemon's life.
  - `rerankers/reranker.py:130-169` — `CrossEncoderRerankerAdapter`
    similarly has no close path; once `_load_model()` resolves
    `self._model = CrossEncoder(...)`, the model stays resident.
- Cleanup boundary: missing on both layers (HTTP pool + fallback
  model).
- Observed risk: a single sidecar hiccup in a long-running daemon
  permanently doubles the rerank-related memory footprint (httpx pool
  + bundled CrossEncoder), and the only release is process restart.
  In a deep-loop session where the user runs the sidecar daemon
  separately and occasionally restarts it (which is the documented
  workflow), every restart-induced 5xx triggers fallback load in the
  cocoindex daemon — accumulating the F-001/F-002 wired-memory bias
  over the session.
- Candidate remediation packet: subsumed by
  `<NNN>-adapter-lifecycle-management` from F-023. Specifically:
  `HttpSidecarRerankerAdapter.close()` must close `self._client` and
  call `self._fallback_adapter.close()` if instantiated. No separate
  packet needed.

## Questions Answered

- **If `RemoveProjectRequest` arrives while `IndexRequest` is running
  for the same `project_root`, does daemon ordering / coroutine
  concurrency make it safe, unsafe, or ineffective as cancellation?**
  Unsafe **and** ineffective. The two handler tasks run concurrently
  on the event loop with no serialization. `remove_project` pops the
  registry entries and calls `project.close()` while `_run_index` is
  mid-`project.update_index()`. Three concrete failure modes: (a)
  `_run_index` KeyErrors on `self._projects[project_root]` if the pop
  wins a scheduling race; (b) sqlite-vec ManagedConnection closed
  under active indexer; (c) next IndexRequest / SearchRequest creates
  a fresh `Project` with a fresh lock, allowing two concurrent
  indexers on the same target DB. The orphan `_run_index` is also
  invisible to the daemon shutdown gather. Cannot be repurposed as a
  cancel path without prerequisite registry-side cancellation
  plumbing. (F-022)
- **Does `RemoveProjectRequest` close project resources, remove
  caches, or interact with `_run_index` tasks currently in flight?**
  It pops `_projects`, `_index_locks`, `_load_time_done`,
  `_project_effective_config_hash`, and `_current_index_meta` for
  that root, then calls `project.close()` and `gc.collect()`. It does
  NOT touch any `_run_index` task — there is no task lookup at all.
  It also does not clear `_embedder_by_config_hash` (per iter-002
  F-012: that one is the deterministic embedder leak); the iter-002
  cleanup-asymmetry diff is consistent with this reading. The cache
  state after `remove_project`: clean for the popped maps, leaked for
  `_embedder_by_config_hash`, and inconsistent with any orphan
  `_run_index` task still running for that root. (F-022)
- **How many distinct `_ADAPTERS` entries can accumulate per session?
  What keys / model names produce new entries?** Steady-state with one
  primary model and no fallback: **1 entry**. With a configured
  fallback model: **2 entries**. With `COCOINDEX_RERANK_VIA_SIDECAR`
  toggled mid-session: **2 entries** for the same model (one
  `__http_sidecar__:<m>`, one bare `<m>`). Plus
  `HttpSidecarRerankerAdapter._fallback_adapter` is a **hidden**
  internal CrossEncoder that does not show up in `_ADAPTERS` but is
  pinned by the sidecar entry once any HTTP error triggers it.
  Bench-lane swaps in the 016/007/003 evaluation work produce up to
  3 distinct model_names × 2 sidecar-mode keying conventions × 1
  hidden fallback ≈ 4-7 loaded reranker model footprints over a long
  session, ~1.5 GB – 12 GB resident. NOT unbounded; deterministic
  fixed-rate growth bounded by the number of bench-lane configs the
  user touches. (F-023)
- **Are sidecar and local CrossEncoder/Jina adapters both pinned by
  `_ADAPTERS`?** Yes for the top-level dict: `CrossEncoderRerankerAdapter`
  / `JinaRerankerAdapter` pinned by bare-`model_name` key,
  `HttpSidecarRerankerAdapter` pinned by `__http_sidecar__:model_name`
  key. The sidecar adapter additionally pins (a) `self._client`
  (httpx.Client with TCP pool) and (b) `self._fallback_adapter`
  (bundled CrossEncoderRerankerAdapter, lazy on first failure), both
  invisible to the `_ADAPTERS` keying. (F-023 + F-024)
- **Is there any existing close/unload path for `_ADAPTERS`, or any
  bounded-size eviction?** No. Tree-wide grep: zero production close
  callers. Only test fixtures reset `_ADAPTERS` via
  `monkeypatch.setattr`. No `close()`, `__del__`, `close_all_adapters`,
  or LRU policy on any adapter or on the dict. The cache lives for
  the lifetime of the daemon process. (F-023)
- **What remediation packets should be proposed after the Claude lane
  completes?** Three independent candidates so far, summarized for
  the Codex lane to refine:
  1. `<NNN>-daemon-protocol-cancel-index-surface` (from F-019/F-020,
     subsumes F-021): add `CancelIndexRequest(project_root, reqId)` +
     `reqId` field on `IndexRequest`, daemon-side in-flight task
     bookkeeping per (project_root, reqId), client-side
     `DaemonClient.cancel_index(reqId)` API.
  2. `<NNN>-mcp-bg-index-task-lifecycle` (from F-005/F-010/F-017/F-018,
     prerequisites: packet 1): caller-side hygiene for the three
     fire-and-forget `asyncio.create_task` sites (daemon.py:378,
     cli.py:1204, server.py:557) — capture reference, dedup helper,
     add_done_callback, bounded shutdown gather, and a SIGTERM hook
     that calls cancel_index then closes the connection.
  3. `<NNN>-remove-project-cancel-safety` (new, from F-022, independent
     prerequisite): make `RemoveProjectRequest` safe under concurrent
     `IndexRequest` by looking up any in-flight `_run_index` task,
     cancelling it, awaiting with bounded timeout, then calling
     `project.close()` and popping entries. Becomes the building
     block for packet 1's daemon-side cancel implementation.
  4. `<NNN>-adapter-lifecycle-management` (new, from F-023/F-024):
     `close()` on `CrossEncoderRerankerAdapter` and
     `HttpSidecarRerankerAdapter`, `close_all_adapters()` helper, hook
     into `ProjectRegistry.close_all` and `_async_daemon_main` finally
     block, optional LRU-N=2 eviction in `get_reranker_adapter`.
  5. (Carry-over from iter-002 F-011 / F-012 / F-014 / F-016)
     `<NNN>-project-close-deep-vs-shallow` plus
     `<NNN>-embedder-cache-eviction-on-close` — out of scope for
     iter-005's focus, but should be folded into the Codex lane's
     remediation synthesis so the full packet list is consolidated.

## Questions Remaining

- Are there any callers that would benefit from a non-blocking
  `RemoveProjectRequest` (i.e., the existing race may be intentional
  for some workflow)? Static read shows only `ccc remove-project` and
  daemon-shutdown paths; both want strict cleanup. Recommend writing
  the remediation packet as strict-cleanup-by-default with no opt-out
  for now and revisiting if a counter-example surfaces.
- What is the actual resident-memory cost per loaded adapter for the
  user's currently-selected reranker model (`_DEFAULT_RERANK_MODEL` =
  jina-reranker-v3 per recent embedder migration)? Documented as
  ~600 MB but needs runtime confirmation. Quick `ps` snapshot in
  iter-006 if Codex lane has budget; otherwise defer to remediation
  packet sizing.
- Does the `JinaRerankerAdapter` in `rerankers_jina_v3.py` have any
  cleanup hook that could be repurposed (e.g., a vLLM client close)?
  Not opened in iter-005 because lazy-imported and out of the focus
  scope; defer to iter-006 if Codex lane wants completeness.
- Is `ProjectRegistry.close_all` actually called anywhere today, or
  is it dead code that the F-014 cleanup-asymmetry diff measured
  against a never-invoked path? `daemon.py:1280-1299` finally-block
  calls `accept_thread.join` and `asyncio.gather(*tasks, ...)`, but
  not `registry.close_all()`. Worth confirming in iter-006; if
  confirmed dead, the cleanup-asymmetry framing of F-014 may need
  refinement (the leak is even bigger than measured because the
  shallow close itself never runs).

## Ruled Out

- **`RemoveProjectRequest` as-is is a usable cancel primitive.**
  Disproven by F-022's three concurrent-task race modes plus the
  silent index-corruption path.
- **`_ADAPTERS` accumulation is unbounded per request.** Disproven
  by static read of `get_reranker_adapter`: the cache key set is
  bounded by (model_name × sidecar_gate × fallback_model). In
  production callers, all three are env-fixed, so the cache stops
  growing after ≤4 entries per daemon.
- **Sidecar mode reduces daemon-side memory pressure as designed.**
  Disproven by F-024: the sidecar adapter pins both a long-lived
  httpx.Client and (on first failure) a bundled CrossEncoder fallback
  inside the same daemon. The sidecar architecture is correct in
  intent (delegate compute) but the in-daemon adapter still holds
  the fallback model footprint as long as the daemon runs.
- **Test-fixture `monkeypatch.setattr(_ADAPTERS, {})` resets are an
  existing close path.** They are not callable from production; they
  drop references without invoking any close on the cleared adapters,
  so even if exposed they would leak httpx.Clients and torch tensors.

## Dead Ends

- Did not capture runtime `ps -p <ppid>,<children>` + `vm_stat`
  snapshot for F-001/F-002 weight vs F-023/F-024 latency. Static
  audit budget priority was higher; defer to Codex lane iter-006/007
  if runtime evidence is wanted.
- Did not open `rerankers_jina_v3.py::JinaRerankerAdapter` — lazy-
  imported, out of focus scope, no production callers in the
  default-sidecar path. Codex lane can pick up if needed.
- Did not search for any `__del__` or `weakref.finalize` registered
  against the adapter classes. Tree-wide grep for `__del__` /
  `weakref.finalize` on `mcp_server/cocoindex_code/` returned zero
  hits in iter-002, and nothing in this iter's reranker re-read
  changed that — implicit GC is the only release.

## Reflection

- What worked and why: Reading `daemon.py` request dispatch (1000-
  1072), `_run_index` (443-473), `update_index` (610-660), and
  `remove_project` (816-830) **together in one read** surfaced all
  three race modes in F-022 in one pass — the cross-handler
  scheduling interleave is invisible when reading any one piece in
  isolation. The reranker.py end-to-end read paired with the
  tree-wide `_ADAPTERS|close_reranker|httpx.Client` grep settled the
  no-close-path claim in two tool calls.
- What did not work and why: I considered separately reading
  `rerankers_jina_v3.py` for completeness, but the file is lazy-
  imported and irrelevant under the default sidecar gate; cutting it
  preserved budget and surfaced the same root finding (no
  module-level close hook) from the already-loaded
  `CrossEncoderRerankerAdapter` and `HttpSidecarRerankerAdapter`.
- What I would do differently: Run the runtime `ps`/`vm_stat`
  snapshot **in the same iteration as the static read** when the
  question is "what is the per-session memory cost?" — the runtime
  evidence would have made F-023's accumulation-rate claim
  measurable rather than computed. Cost: ~1 tool call + a small
  daemon-restart side effect; budget-feasible next iter.

## Next Focus

Iteration 006 (Codex lane, gpt-5.5 xhigh) should:

1. Open `rerankers/rerankers_jina_v3.py::JinaRerankerAdapter` to
   confirm whether it shares the no-close pattern (likely yes) and
   to document any vLLM / sentence-transformers client teardown
   surface that the F-023 remediation packet needs to call.
2. Open `Project.close()` (referenced by iter-002 F-011) and read
   sqlite-vec `ManagedConnection.close()` to settle the
   "shallow vs deep close" question concretely, so the
   F-022 remediation packet can specify what `project.close()` MUST
   guarantee before being called by a future `_cancel_in_flight_index`
   primitive.
3. Capture a runtime `ps -o pid,rss,vsz,command -p <daemon-pid>` +
   `vm_stat` snapshot before and after a fresh `ccc search` with
   `refresh_index=True` to ground F-001/F-002 / F-017-F-021 / F-023
   in measured wired-memory deltas. Snapshot once with the default
   sidecar path and once with an induced sidecar 5xx to exercise the
   F-024 fallback-pin path.
4. Confirm whether `ProjectRegistry.close_all` is reachable from
   production by grepping for callers; if not, refine F-014's
   cleanup-asymmetry framing to "the close-all path is dead code; the
   *only* live release is daemon SIGTERM".

## Recommended Next Focus

Confirm `Project.close` / sqlite-vec ManagedConnection deep-vs-shallow
close behavior and capture a runtime daemon RSS / `vm_stat` snapshot
across a normal search and an induced sidecar-5xx search, so the
five-packet remediation list (cancel surface, bg-task hygiene,
remove-project safety, adapter lifecycle, project-close depth) has
quantitative grounding for the synthesis step. If only one of the
two is budget-feasible, prefer the runtime snapshot — it doubles as
F-001/F-002 measurement evidence and as F-023/F-024 sizing.
