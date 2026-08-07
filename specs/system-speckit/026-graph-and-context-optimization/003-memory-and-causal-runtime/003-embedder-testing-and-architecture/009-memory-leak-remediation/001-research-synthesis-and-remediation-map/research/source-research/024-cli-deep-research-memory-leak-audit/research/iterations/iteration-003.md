# Iteration 003 — Cleanup-asymmetry confirmation + fire-and-forget `_bg_index` audit

## Focus

Confirm whether the F-012 + F-014 cleanup-asymmetry diff from iteration 002 is
exhaustive, and audit the fire-and-forget `asyncio.create_task` pattern beyond
`daemon.py:378` — specifically `_bg_index` in `cli.py` and `server.py` — to see
whether F-010's "task exception never retrieved" symptom and F-005's
"shutdown gather misses bg task" symptom repeat outside the daemon process.

## Actions Taken

- Re-read `ProjectRegistry.__init__` (`daemon.py:342-356`), `remove_project`
  (`816-830`), `close_all` (`832-841`), and
  `_refresh_project_if_config_changed` (`406-416`) end-to-end to build the
  exhaustive cleanup-asymmetry table.
- Read `cli.py:1191-1218` (`mcp` command and `_bg_index` definition) and
  `server.py:540-569` (alternate `_serve` MCP entrypoint and matching
  `_bg_index` definition).
- Grepped `daemon.py` for every `asyncio.create_task`, `add_done_callback`,
  `asyncio.gather`, `asyncio.wait_for`, `asyncio.shield` to verify there is
  exactly one untracked task site (line 378), one tracked-and-awaited site
  (lines 630-635), and one correctly-managed handler set (1244-1255).
- Grepped `server.py` for the same task primitives — confirmed lines 266, 345,
  557 are the only matches (266 and 345 are timeout-wrapped request
  dispatchers, NOT create_task, and they correctly bound their callee).

## Sources Consulted

- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py` (lines
  342-356, 367-379, 406-416, 816-830, 832-841, 1244-1255, 1286-1295)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py` (lines
  1191-1218)
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py` (lines
  540-569, 266, 345)

## Findings

New IDs F-016..F-018. Refinements use the `C-003-FNNN-*` convention.

### F-016 [P1] — `_refresh_project_if_config_changed` true leak is the previous-hash embedder; other "missing pops" are overwritten on next `get_project`

- Owner: `mcp-coco-index`
- Process kind: registry-scope embedder reference (heavy: sbert MPS weights or
  upstream litellm pool)
- Evidence:
  - `daemon.py:406-416` — `_refresh_project_if_config_changed` pops only
    `_projects` (after `project.close()`) and `_project_effective_config_hash`.
  - `daemon.py:373-376` — the next `get_project` call rebinds
    `_projects[project_root]`, `_index_locks[project_root] = asyncio.Lock()`,
    `_load_time_done[project_root] = asyncio.Event()`. The previous dict
    entries are clobbered (old Lock/Event drop when no holder remains).
  - `daemon.py:395` — `_embedder_for_project` rebinds
    `_current_index_meta[project_root] = read_index_meta(...)` on every call,
    clobbering the stale value.
  - `daemon.py:396-404` — `_embedder_by_config_hash` is keyed by
    `effective_hash`. After a config change the *new* hash gets a new
    embedder entry, but the *old* hash entry persists forever because nothing
    drops it. THIS is the true leak surface.
- Cleanup boundary: partial. Three of the four "missing" caches are
  self-healing via overwrite on next access; only the embedder cache leaks
  deterministically per config-change event.
- Observed risk: refines F-014's framing. The defect is still real and still
  P1, but the per-event cost is one heavy embedder, not four objects.
- Candidate remediation packet: subsumed by F-012 remediation
  (`<NNN>-registry-embedder-cache-lifecycle`).

### F-017 [P1] — `cli.py:1204` `_bg_index` task is fire-and-forget, silently swallows exceptions, and runs `client.index` in the default ThreadPoolExecutor

- Owner: `mcp-coco-index` (MCP child process side, not daemon)
- Process kind: asyncio task + ThreadPool worker doing RPC to daemon
- Evidence:
  - `cli.py:1192-1207` — `mcp()` command body:
    ```
    async def _run_mcp() -> None:
        from .server import create_mcp_server
        mcp_server = create_mcp_server(client, project_root)
        asyncio.create_task(_bg_index(client, project_root))
        await mcp_server.run_stdio_async()
    asyncio.run(_run_mcp())
    ```
    No reference captured, no `add_done_callback`, no cancellation handle.
  - `cli.py:1210-1218` — `_bg_index` body:
    ```
    loop = asyncio.get_event_loop()
    try:
        await loop.run_in_executor(None, client.index, project_root)
    except Exception:
        pass
    ```
    Bare `except Exception: pass` silences every error path (network, RPC
    timeout, daemon stop mid-call, sqlite-vec lock, embedder failure).
  - The dispatch uses `loop.run_in_executor(None, ...)` (the default
    `ThreadPoolExecutor`). When `asyncio.run` shuts down, the asyncio task is
    cancelled, but the **thread pool worker thread keeps running**
    `client.index(project_root)` synchronously until `asyncio.run` waits for
    `loop.shutdown_default_executor()` to drain. So the MCP child cannot
    return promptly from a SIGTERM mid-index.
- Cleanup boundary: missing. Same root cause as F-010 (no reference + bare
  except), with the additional ThreadPool-survives-cancel hazard specific to
  `run_in_executor`.
- Observed risk: in deep-research / deep-review loops, every fresh MCP child
  invocation triggers `_bg_index`. If the host CLI kills the MCP child while
  the background index is mid-flight, the daemon-side index still runs to
  completion (registry holds the lock), but the MCP child's exit can stall.
  Across a 10-iter loop the per-iter MCP-child shutdown latency compounds.
  Silent exception suppression hides RPC failures from the operator.
- Candidate remediation packet:
  `<NNN>-mcp-bg-index-task-lifecycle` (shared with F-018) — capture the task
  reference, register an `add_done_callback` that logs exceptions, register an
  `atexit` / shutdown hook that cancels the task and joins the threadpool
  worker with a bounded timeout.

### F-018 [P1] — `server.py:557` `_bg_index` is an exact mirror of F-017 in the alternate `_serve` MCP entrypoint

- Owner: `mcp-coco-index` (MCP child process side)
- Process kind: identical to F-017
- Evidence:
  - `server.py:551-560` — `_serve` body:
    ```
    client = ensure_daemon()
    mcp_server = create_mcp_server(client, str(project_root))
    async def _serve() -> None:
        asyncio.create_task(_bg_index(client, str(project_root)))
        await mcp_server.run_stdio_async()
    asyncio.run(_serve())
    ```
  - `server.py:563-569` — `_bg_index` body matches `cli.py:1210-1218`
    byte-for-byte except for the type annotation:
    ```
    async def _bg_index(client: DaemonClient, project_root: str) -> None:
        loop = asyncio.get_event_loop()
        try:
            await loop.run_in_executor(None, client.index, project_root)
        except Exception:
            pass
    ```
- Cleanup boundary: missing, identical to F-017.
- Observed risk: identical to F-017. Worth flagging as a separate finding
  because there are two duplicate copies of `_bg_index` in the codebase; a
  remediation packet must fix both, not just one. Code smell — should be
  consolidated into a single helper.
- Candidate remediation packet: shared with F-017
  (`<NNN>-mcp-bg-index-task-lifecycle`) and add a sub-task to deduplicate
  `_bg_index` into a single import-shared helper.

### C-003-F012-confirmation [P0 unchanged] — cleanup-asymmetry diff confirmed exhaustive (no eighth cache hiding)

- `daemon.py:349-356` enumerates exactly seven registry-scope caches:
  `_projects`, `_index_locks`, `_load_time_done`, `_embedder`,
  `_embedder_by_config_hash`, `_project_effective_config_hash`,
  `_current_index_meta`. No additional dict / set / list is bound in
  `__init__` outside this block.
- The cleanup-asymmetry table from iter-002 stands. The single missing cache
  in `close_all` that is *not* self-healing on overwrite is
  `_embedder_by_config_hash`. The `_embedder` bootstrap reference (line 353)
  is held for the daemon lifetime by design.

### C-003-F014-refinement [P1 → P1, narrowed] — `_refresh_project_if_config_changed` true leak is embedder-only

- See F-016. Iteration 002's F-014 listed three caches as "leaked"
  (`_load_time_done`, `_current_index_meta`, embedder). Two of those three are
  overwritten on next access. Only the embedder leak is deterministic. Severity
  stays P1 but framing tightens.

### C-003-F005-confirmation-extended [P1] — fire-and-forget cluster expands beyond the daemon

- F-005 / F-010 framed the defect as daemon-side (`daemon.py:378`).
- F-017 / F-018 are the same defect in the MCP child process. The cluster now
  has three instances: `daemon.py:378`, `cli.py:1204`, `server.py:557`. All
  three share: no reference capture, no `add_done_callback`, no cancellation
  handle, exceptions either swallowed (cli/server) or only logged via the
  default "task exception never retrieved" warning (daemon).
- Reducer recommendation: keep F-005/F-010 as the daemon-side cluster
  (per iter-002 merger note), add F-017/F-018 as the MCP-side cluster. One
  remediation packet can cover both clusters because the fix pattern is
  identical: follow the `daemon.py:1244-1255` handler-task discipline
  (`task_set.add(task); task.add_done_callback(task_set.discard)` + bounded
  shutdown `gather`).

## Questions Answered

- **Is `_refresh_project_if_config_changed` missing any additional cache
  entries beyond the ones iteration 002 listed?** No new caches; refinement
  is in the *severity* per missing entry. Three of four "missing pops" are
  self-healing via overwrite; only the embedder cache is a deterministic
  leak. (F-016, C-003-F014-refinement)
- **Are there additional eviction paths that should use `remove_project` but
  do not?** Yes — `_refresh_project_if_config_changed` is the only other
  eviction path and it reimplements a subset of `remove_project`'s logic.
  Recommendation stands: have it delegate to `remove_project` after the
  hash-mismatch check.
- **Do `cli.py` / `server.py` create background tasks without retaining
  references, callbacks, cancellation, or exception harvesting?** Yes.
  `cli.py:1204` and `server.py:557` both call
  `asyncio.create_task(_bg_index(...))` with no capture. Both `_bg_index`
  bodies wrap `loop.run_in_executor(None, client.index, project_root)` in a
  bare `except Exception: pass`. (F-017, F-018)
- **Are any background tasks intentionally one-shot with safe callbacks, and
  therefore ruled out?** Yes: `daemon.py:630-635` captures `index_task` and
  awaits via the progress-queue drain loop. `daemon.py:1244-1255` uses
  `task_set.add(task); task.add_done_callback(task_set.discard)` for handler
  tasks and gathers them with a 10 s `asyncio.wait_for` at shutdown
  (1286-1295). These are the correct-discipline reference pattern; not part
  of the defect cluster.
- **Should F-005 and F-010 be merged, split, or expanded based on the new
  evidence?** Confirm the iter-002 recommendation to MERGE F-005 + F-010 into
  one daemon-side defect, AND ADD F-017 + F-018 as the MCP-side analogues.
  One unified remediation packet covers all three instances; F-017 and F-018
  additionally need a `_bg_index` deduplication sub-task.

## Questions Remaining

- Does `loop.shutdown_default_executor()` actually wait for the
  `client.index` thread-pool worker on `asyncio.run` exit, or is the thread
  abandoned (daemon thread)? Python 3.9+ behavior: `asyncio.run` calls
  `shutdown_default_executor` which `wait()`s on the executor. Worth a runtime
  trace to confirm whether the MCP child's exit latency under SIGTERM is the
  drain time of `client.index` (could be tens of seconds for an in-flight
  index over RPC).
- Does `DaemonClient.index` (in `core/client.py`) have its own cancellation
  surface, or is it a blocking send-recv? If blocking, the F-017/F-018
  ThreadPool worker is effectively un-cancellable from the MCP child side.
  Iteration 004 candidate.
- Are there other `create_task` sites in `retrieval/`, `indexer/`,
  `observability/`, or `core/` that follow the same fire-and-forget pattern?
  Not surveyed this iteration. Iteration 004 candidate.

## Ruled Out

- **An eighth registry cache hiding behind iter-002's seven-cache list.**
  `daemon.py:342-356` is the complete attribute set of `ProjectRegistry`.
- **An `asyncio.create_task` site in `server.py` beyond line 557.** Grep
  returned `wait_for` at 266 and 345 (request-dispatch timeouts; correctly
  bound to the awaitable they wrap) and `create_task` only at 557.

## Dead Ends

- Did not read `core/client.py` to verify whether `DaemonClient.index` is
  blocking or cancellable. Worth one read in iteration 004 but out of scope
  for this iteration's "is the bg-task pattern repeated" question.
- Did not survey `retrieval/`, `indexer/`, `observability/`, `core/` for
  additional `create_task` sites; the iteration scope was explicit about
  cli.py / server.py.

## Reflection

- What worked and why: Re-reading the cleanup methods side by side and then
  using a single Grep across `daemon.py` for `create_task` / `add_done_callback`
  / `gather` / `wait_for` was the highest-leverage move. It surfaced the
  correct-discipline pattern at 1244-1255 in the same view as the defect at
  378, which made the remediation prescription obvious (apply the
  handler-set discipline to bg-index too). Reading `cli.py:1191-1218` and
  `server.py:540-569` end-to-end (rather than just grep hits) revealed the
  duplicated `_bg_index` and the ThreadPoolExecutor hazard that grep alone
  would have missed.
- What did not work and why: The original plan was to also audit
  `rerankers/reranker.py::_ADAPTERS` mutation surface (iter-002 step 2). I
  cut it for tool-call budget — F-001/F-002 are already P0 and the
  per-key-accumulation-rate question is better answered by a runtime
  observation than a static read. Defer to iteration 004 or 005.
- What I would do differently: Start with the
  `create_task` / `add_done_callback` grep across the whole `cocoindex_code/`
  tree in one shot, not file-by-file. Would have caught the cli/server
  duplication in tool call 1 instead of tool call 3, freeing budget for the
  reranker mutation surface.

## Next Focus

Iteration 004 should:

1. Read `core/client.py` `DaemonClient.index` to determine whether it is
   blocking-only or cancellable, which decides whether F-017/F-018 require a
   protocol-level Cancel message in addition to task-discipline fixes.
2. Grep `cocoindex_code/{retrieval,indexer,observability,core}/**` for any
   additional `asyncio.create_task` sites and classify each as
   correct-discipline (reference captured + callback + bounded await) or
   defective (fire-and-forget).
3. Read `rerankers/reranker.py::get_reranker_adapter` (lines 385-414) plus
   the `_ADAPTERS` mutation surface to characterize per-session key
   accumulation rate (per-model, per-device, per-base-url).
4. If budget allows, capture an actual `ps` + `vm_stat` pair from the
   operator's last deep-loop session to ground F-001/F-002 weight against
   F-017/F-018 latency.

## Recommended Next Focus

Survey remaining `asyncio.create_task` sites across the `cocoindex_code/`
tree (retrieval, indexer, observability, core) and audit `DaemonClient.index`
in `core/client.py` for cancellation/blocking semantics — that determines
whether the F-017/F-018 remediation needs only task-discipline or also a
protocol-level Cancel surface.
