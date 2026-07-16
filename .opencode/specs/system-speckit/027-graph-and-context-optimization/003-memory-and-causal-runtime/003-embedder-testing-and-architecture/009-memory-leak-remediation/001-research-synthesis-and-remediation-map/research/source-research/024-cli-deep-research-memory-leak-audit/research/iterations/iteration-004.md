# Iteration 004 — DaemonClient.index cancellation semantics + remaining `create_task` survey

## Focus

Answer the iteration-003 leftovers head-on:

1. Read `core/client.py::DaemonClient.index` end-to-end to determine whether
   the RPC is blocking-only or exposes any cancellation / timeout surface.
2. Audit `core/protocol.py` to see whether the daemon protocol carries any
   `CancelIndexRequest` / per-RPC abort surface, or only the
   whole-daemon `StopRequest`.
3. Sweep `cocoindex_code/{retrieval,indexer,observability,core,cli,server}/**`
   for any remaining `asyncio.create_task`, `ensure_future`, `threading.Thread`,
   or extra `ThreadPoolExecutor(...)` sites beyond the three already known
   (daemon.py:378, cli.py:1204, server.py:557).
4. Decide whether F-017/F-018 remediation can stay a pure task-discipline
   packet or whether a protocol-level Cancel surface is required.

## Actions Taken

- Read `core/client.py` end-to-end (594 lines), specifically the `index`
  method body (lines 87-123) and the `close` method (201-205), plus
  `stop_daemon` / `ensure_daemon` to understand the lifecycle surfaces
  available to the MCP-child caller.
- Read `core/protocol.py` end-to-end (246 lines) to enumerate the full
  tagged-union request set and confirm whether a per-RPC cancel exists.
- Grepped the whole `cocoindex_code/` tree for `asyncio.create_task`,
  `create_task(`, `run_in_executor`, `add_done_callback`,
  `asyncio.shield`, `asyncio.wait_for`, `asyncio.gather` — 19 hits across
  4 files, all classified below.
- Grepped the whole tree for `CancelRequest`, `StopRequest`, `CancelIndex`,
  `cancel_index`, `cancel(` — confirmed the only abort verb on the wire
  is `StopRequest` (whole-daemon shutdown).
- Grepped for `ensure_future`, `threading.Thread`, `Thread(`,
  `ThreadPoolExecutor(`, `concurrent.futures`, `atexit`, `signal.signal`
  — found exactly one `threading.Thread` site (daemon.py:1277 accept
  loop, `daemon=True`, normal pattern), zero `ensure_future`, zero extra
  `ThreadPoolExecutor` construction, zero `atexit`/`signal.signal`.
- Re-read `server.py:200-360` to characterize the foreground refresh +
  search uses of `loop.run_in_executor(None, lambda: client.index(...))`
  against the same ThreadPool-survives-cancel hazard as F-017/F-018.

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py`
  (lines 1-594, with focus on 87-123 and 198-223)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py`
  (lines 1-246)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py`
  (lines 200-360)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py`
  (lines 378, 630-648, 882, 930, 1244-1255, 1277, 1286-1295 — re-checked
  via grep against iter-003 inventory)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py`
  (lines 1192-1218 — re-checked via grep)

## Findings

New IDs continue from F-018: F-019, F-020, F-021. Refinements use the
`C-004-FNNN-*` convention.

### F-019 [P1] — `DaemonClient.index` is fully blocking with NO cancellation surface; only a connection close (EOFError) can break the recv loop

- Owner: `mcp-coco-index` (MCP-child client side, called by both bg
  `_bg_index` paths and the foreground refresh handlers)
- Process kind: blocking sync IPC over `multiprocessing.connection.Client`
- Evidence:
  - `core/client.py:87-123` — `index` body:
    ```
    self._conn.send_bytes(encode_request(IndexRequest(project_root=...)))
    while True:
        try:
            data = self._conn.recv_bytes()
        except EOFError:
            raise RuntimeError("Connection to daemon lost during indexing")
        ...
        if isinstance(resp, IndexResponse):
            return resp
    ```
    No `timeout` parameter, no poll, no `select`, no signal hook. Once the
    request is sent, the method blocks on `recv_bytes()` until the daemon
    sends the final `IndexResponse` (or `ErrorResponse`).
  - `core/client.py:201-205` — `DaemonClient.close()` simply does
    `self._conn.close()` inside a bare `except Exception: pass`. Closing the
    connection while `index()` is in `recv_bytes()` is the only abort
    primitive: it raises `EOFError` → `RuntimeError("Connection to daemon
    lost during indexing")`. That is reachable from a sibling thread that
    holds a reference to the same `DaemonClient`, but the bg-task pattern
    in F-017/F-018 stores no such reference.
  - `core/client.py:198-199` — `stop()` issues a `StopRequest`, but this
    stops the **entire** daemon, not a single project's in-flight index.
- Cleanup boundary: missing. There is no per-RPC abort surface and no
  caller-side cancellation that does not also tear down the daemon
  process.
- Observed risk: confirms the iter-003 ThreadPool hazard at the protocol
  level. Even if the MCP child captures the task reference and adds a
  `done_callback`, the ThreadPool worker thread running `client.index` is
  fundamentally un-cancellable from asyncio — and the underlying RPC
  primitive has no abort path short of closing the connection. The
  MCP-child SIGTERM latency under an in-flight index is bounded by the
  daemon-side index duration (tens of seconds to minutes for cold full
  reindex), not by any caller-side intent.
- Candidate remediation packet:
  `<NNN>-daemon-protocol-cancel-index-surface` — separate from the
  `mcp-bg-index-task-lifecycle` packet because this requires a new
  request type on the wire, not just task hygiene.

### F-020 [P1] — Daemon protocol exposes NO `CancelIndexRequest`; only `StopRequest` (whole daemon) and `RemoveProjectRequest`

- Owner: `mcp-coco-index` (protocol surface, shared by daemon + client)
- Process kind: msgspec tagged-union IPC surface
- Evidence:
  - `core/protocol.py:13-55` — `Request` union contains exactly:
    `HandshakeRequest`, `IndexRequest`, `SearchRequest`,
    `ProjectStatusRequest`, `DaemonStatusRequest`, `RemoveProjectRequest`,
    `StopRequest`. No `CancelIndexRequest`, no `AbortRequest`, no per-RPC
    `reqId`-correlated cancel — `IndexRequest` (line 17-18) only carries
    `project_root`; it has no `reqId` field for the daemon to correlate
    against a cancel.
  - `daemon.py:952` and `daemon.py:1056` are the only `StopRequest`
    dispatch sites; both shut the whole daemon down (per iter-001 F-008
    framing).
  - `daemon.py:1244-1255` — handler tasks are tracked and bounded at
    shutdown via `asyncio.wait_for(asyncio.gather(...), timeout=10.0)`
    (1286-1295), but this is daemon-side internal task hygiene. From the
    client's perspective the only abort surface remains "close the
    connection" or "stop the whole daemon".
  - `RemoveProjectRequest` (line 39-40) is project-scoped but, per
    `daemon.py:820-830` (iter-002 F-012 evidence), its handler pops
    registry entries — it does not document any guarantee about
    cancelling an in-flight index for that project. The semantics under
    `RemoveProject` mid-`Index` are undefined here.
- Cleanup boundary: missing at protocol level.
- Observed risk: any client that needs to abort a stuck index (e.g. MCP
  child receiving SIGTERM from a deep-loop host) has only two options
  today: (a) wait for the daemon to finish, (b) stop the entire daemon,
  which then cascades to *every* MCP child of *every* project sharing
  that daemon. In a multi-project, multi-CLI workflow this is a hard
  trade-off — exactly the kind of "kill innocent neighbors to abort one
  RPC" scenario the user reported as the original symptom for this audit.
- Candidate remediation packet: shared with F-019
  (`<NNN>-daemon-protocol-cancel-index-surface`). Sub-tasks:
  1. Add `CancelIndexRequest(project_root, reqId)` to the union.
  2. Tag `IndexRequest` with a correlating `reqId`.
  3. Daemon-side handler holds the in-flight index task per `reqId`,
     cancels on receive, returns `IndexResponse(success=False,
     message="cancelled")` to the original recv loop.
  4. Client-side `DaemonClient.cancel_index(reqId)` API + integration
     into the F-017/F-018 task-discipline cleanup hook.

### F-021 [P2] — Foreground `refresh` + `refresh_index` handlers in `server.py` carry the same ThreadPool-survives-cancel hazard as F-017/F-018, masked by `asyncio.wait_for` timeout

- Owner: `mcp-coco-index` (MCP-child request-handling path)
- Process kind: foreground `loop.run_in_executor(None, ...)` over the
  blocking `client.index(project_root)` RPC, bounded by per-request
  `asyncio.wait_for`
- Evidence:
  - `server.py:210-269` — search handler's `_run_search_request`:
    when `refresh_index=True`, dispatches
    `await loop.run_in_executor(None, lambda: client.index(project_root))`
    at line 215 inside an `await asyncio.wait_for(_run_search_request(),
    timeout=request_timeout_ms/1000)` at line 266.
  - `server.py:321-359` — refresh-only handler's `_run_refresh_request`:
    `await loop.run_in_executor(None, lambda: client.index(project_root))`
    at line 325 inside an `await asyncio.wait_for(_run_refresh_request(),
    timeout=request_timeout_ms/1000)` at line 345.
  - When `asyncio.wait_for` triggers `TimeoutError`, the wrapping coroutine
    is cancelled — but the default ThreadPoolExecutor worker running
    `client.index` is **not** interrupted; the synchronous Python frame
    has no checkpoint. The MCP child returns a timeout response to its
    caller while the worker thread keeps running until the daemon-side
    index completes and `recv_bytes()` finally returns (or the connection
    is closed).
- Cleanup boundary: partially mitigated (the caller sees a timely
  timeout response), structurally missing (the executor worker survives
  cancellation; subsequent MCP requests within the same process compete
  for the same default-executor capacity, default 32 worker threads on
  modern Python, but each abandoned worker still pins one thread).
- Observed risk: lower than F-017/F-018 because the caller actually does
  receive a timeout response (so MCP-protocol latency is bounded), but
  the worker-survives-cancel hazard is the same defect. Within a single
  MCP child, repeated timeouts on slow index calls accumulate abandoned
  worker threads until `loop.shutdown_default_executor()` joins them all
  on `asyncio.run` exit. Under a deep-loop host that issues a fresh
  `refresh_index` per iteration, repeated timeouts could compound.
  Severity P2: the protocol-level fix from F-019/F-020 (real cancel)
  resolves this too.
- Candidate remediation packet: subsumed by
  `<NNN>-daemon-protocol-cancel-index-surface` (the cancel API gives the
  request handler something to call on `asyncio.wait_for` timeout to
  actually release the worker). No separate packet needed.

### C-004-F005-F017-F018-cluster-final [P1 → P1, scope correction]

- The fire-and-forget defect cluster (`daemon.py:378`, `cli.py:1204`,
  `server.py:557`) is the **caller-side symptom**. The **root cause** is
  F-019 + F-020 — the underlying RPC has no abort surface, so even an
  ideal task-discipline fix (capture reference, add callback, bounded
  shutdown gather) cannot make the bg index actually cancellable from
  outside the daemon. Reducer recommendation: keep
  F-005/F-010/F-017/F-018 as the caller-side cluster *and* split off
  F-019/F-020 as a sibling protocol-level cluster. They share a
  remediation umbrella but the protocol packet is a prerequisite for
  the task-discipline packet to deliver real cancellation.

## Questions Answered

- **Does `DaemonClient.index` provide any cancellation, timeout, or stop
  request once an index RPC has started?** No. The method is a blocking
  `while True: recv_bytes()` loop with no timeout, no signal hook, no
  poll. The only abort primitive is closing the underlying `Connection`
  (raises `EOFError` → `RuntimeError`), and the F-017/F-018 bg pattern
  stores no client reference from which to call `close()`. (F-019)
- **Does server/daemon protocol expose a cancel-index action or only
  stop-daemon?** Only `StopRequest` (whole daemon) and
  `RemoveProjectRequest` (registry-scope eviction with undefined
  in-flight-index semantics). `IndexRequest` itself carries no `reqId`,
  so the daemon could not correlate a cancel even if one existed. (F-020)
- **Are remaining `create_task` sites referenced, awaited, callback-
  protected, or orphaned?** The complete tree-wide inventory is five
  sites: `daemon.py:378` orphaned (F-005/F-010), `daemon.py:630`
  referenced + awaited via progress-queue drain (correct), `daemon.py:1244`
  tracked in handler `task_set` with `add_done_callback` (correct),
  `cli.py:1204` orphaned (F-017), `server.py:557` orphaned (F-018). No
  additional sites in `retrieval/`, `indexer/`, `observability/`, `core/`,
  or elsewhere. No `ensure_future` sites. Only one `threading.Thread`
  (daemon.py:1277 accept loop, `daemon=True` — normal pattern).
- **Which sites are safe and should be ruled out?** `daemon.py:630-635`
  (index_streamed task, awaited inline), `daemon.py:1244-1255` (handler
  task_set discipline), `daemon.py:1277` (accept thread, `daemon=True`),
  `daemon.py:882` (recv loop run_in_executor, awaited), `daemon.py:930`
  (asyncio.wait_for on handler), and all `server.py` `asyncio.wait_for`
  sites at 266 / 345 (bound foreground handlers — see F-021 for the
  ThreadPool caveat). These are not part of the defect cluster.
- **Should F-017/F-018 become a separate protocol-level cancellation
  remediation packet or stay under the background-task discipline
  packet?** SPLIT INTO TWO PACKETS. (1) `mcp-bg-index-task-lifecycle`
  (caller-side hygiene: capture reference, callback, dedup helper,
  bounded shutdown gather; subsumes F-017/F-018). (2)
  `daemon-protocol-cancel-index-surface` (wire change: add
  `CancelIndexRequest` + correlating `reqId` on `IndexRequest`; subsumes
  F-019/F-020 and the F-021 worker-survives-cancel hazard). Packet 2 is a
  prerequisite for packet 1 to deliver real cancellation; without it,
  packet 1 is purely cosmetic. (C-004-F005-F017-F018-cluster-final)

## Questions Remaining

- Does `RemoveProjectRequest` mid-`IndexRequest` cancel the in-flight
  index or wait for completion? Not answered by static read of the
  client; needs a focused read of `daemon.py:1056..` request dispatch
  to characterize the daemon-side handler ordering. Iteration 005 or 006
  candidate.
- What is the actual default ThreadPoolExecutor `max_workers` on Python
  3.12+ for asyncio? Documented as `min(32, os.cpu_count() + 4)`; need
  to confirm against the user's CPython version and whether the default
  is overridden anywhere in the daemon startup. Quick, low-priority.
- Is there a `cocoindex.App.close()` or `coco.Environment.close()` upstream
  that would let `Project.close()` fully release Rust resources (F-011)?
  Still out-of-tree (vendored cocoindex Python pkg not under this repo).
  Defer unless a vendored copy lands.
- What is the per-iteration MCP-child shutdown latency on the user's
  current setup, with and without an in-flight `_bg_index`? Needs runtime
  measurement, not static read. Recommended for iteration 005 or later
  if budget allows.

## Ruled Out

- **Additional `asyncio.create_task` sites in `retrieval/`, `indexer/`,
  `observability/`, `core/`.** Tree-wide grep returned the five sites
  already known (daemon.py:378, 630, 1244 + cli.py:1204 + server.py:557).
  None elsewhere.
- **`asyncio.ensure_future` sites anywhere in `cocoindex_code/`.** Zero
  hits.
- **Extra `ThreadPoolExecutor(...)` construction sites (custom executor
  with its own lifecycle).** Zero hits. Every `run_in_executor` call uses
  the default `None` executor.
- **`atexit` / `signal.signal` hooks that might own a cleanup path.**
  Zero hits in `cocoindex_code/`. Process-exit cleanup is fully implicit.
- **An eighth caller-side reachable per-RPC abort verb beyond
  `client.close()` and `client.stop()`.** Read end-to-end; `DaemonClient`
  exposes only the seven RPC wrappers + `close()`.

## Dead Ends

- Did not characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest`
  handler ordering (the open question on `daemon.py:1056..` dispatch
  semantics). One Read away, but out of scope for "does the client offer
  cancellation?" — defer to iteration 005.
- Did not capture runtime `ps` / `vm_stat` evidence for F-001/F-002 weight
  vs F-017-F021 latency. Static-audit budget priority was higher.

## Reflection

- What worked and why: Reading `core/client.py` end-to-end *plus* the
  protocol union in one pair surfaced the missing-cancel-surface
  evidence at both layers (client API + wire schema) in two tool calls.
  The tree-wide `create_task|run_in_executor|add_done_callback` grep
  closed out the "what else is lurking?" question definitively without
  needing per-file reads — exactly the iter-003 reflection's "do this
  in one shot" recommendation, applied successfully.
- What did not work and why: Initially considered also surveying
  `embedders/` and `rerankers/` for adapter-level cancellation hooks,
  but iter-002/iter-003 had already ruled out those subtrees as not
  spawning tasks. Cut to preserve budget — correct call in hindsight.
- What I would do differently: Pull the `daemon.py:1056..` request
  dispatch in the same iteration as the client read, to settle the
  `RemoveProject`-mid-`Index` semantics in one pass instead of leaving
  it open for iteration 005. Cost would have been ~1 tool call.

## Next Focus

Iteration 005 should:

1. Read `daemon.py:1000-1080` request-dispatch + the `RemoveProject` and
   `Index` handler bodies to characterize whether `RemoveProjectRequest`
   mid-`IndexRequest` cancels the in-flight task or queues behind it.
2. Audit `rerankers/reranker.py::get_reranker_adapter` (~lines 385-414)
   and the `_ADAPTERS` mutation surface for per-session key
   accumulation rate (deferred from iter-003 step 3).
3. If a vendored cocoindex Python package surfaces in the workspace,
   read `ManagedConnection.close()` + `coco.Environment.__del__` to
   settle the "shallow vs deep close" question from F-011.
4. (Optional) Capture a runtime `ps -p <ppid>,<children>` + `vm_stat`
   snapshot from a fresh deep-loop run to ground F-001/F-002 against
   F-017/F-018/F-019 in measured RSS / wired-memory deltas.

## Recommended Next Focus

Characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest`
handler ordering on `daemon.py:1056..` to determine whether the
existing project-scoped eviction primitive can be repurposed as a
narrow cancel path while a full `CancelIndexRequest` is being designed,
and complete the deferred `rerankers/reranker.py::_ADAPTERS` mutation
audit so F-001/F-002 has its per-session-accumulation-rate evidence.
