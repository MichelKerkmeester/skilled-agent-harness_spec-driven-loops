## Focus

Validate the first two implementation recommendations surfaced by the completed audit: `remove-project-cancel-safety` and `daemon-protocol-cancel-index-surface`. The question is whether source evidence supports the existing split, what the smallest safe internal registry looks like, and what request identity is required before a public cancel protocol can be safe.

## Actions Taken

- Read the configured research state, strategy, state log, final synthesis, iterations 009 and 010, and deltas 009 and 010 before source inspection.
- Re-read `daemon.py`, `core/protocol.py`, `core/client.py`, `core/project.py`, and the existing daemon/protocol tests around index, remove, load-time indexing, and request timeout behavior.
- Compared current source behavior against the iteration 009 and 010 packet ordering and verification gates.
- Kept this pass research-only: no target source edits, no follow-up packet folders, no sub-agent or nested CLI dispatch.

## Sources Consulted

- `research/deep-research-config.json:1-10` and `research/deep-research-config.json:46-58` for the 15-iteration continuation and cli-codex executor lane.
- `research/deep-research-strategy.md:21-23` for non-goals.
- `research/deep-research-strategy.md:249-252` for prior evidence ruling out merging remove-project safety into protocol cancel.
- `research/research.md:25-29` and `research/research.md:80-87` for final packet order and dependency.
- `research/iterations/iteration-009.md:48-55` and `research/iterations/iteration-009.md:61-64` for the final matrix entries and first two packet order.
- `research/iterations/iteration-010.md:38-42` and `research/iterations/iteration-010.md:58-63` for synthesis confirmation of the P1 clusters.
- `research/deltas/iter-010.jsonl:5` for the previous acceptance contracts.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:342-379` for current registry maps and load-time task creation.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:443-473` for `_run_index` dictionary lookups, lock ownership, metadata write, event set, and lock release.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:610-659` for explicit streamed indexing, background task creation, and client-disconnect behavior.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:816-830` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1052-1054` for current remove behavior.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:929-944` for request timeout wrapping only `_dispatch` before streaming iteration.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py:17-55` for request types and the absence of `CancelIndexRequest`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py:68-93` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py:188-217` for index/remove response shapes.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:87-123` and `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:193-199` for blocking client index and remove APIs.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:44-77` for project update and SQLite FTS sync in `finally`.
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:205-243` and `.opencode/skills/mcp-coco-index/tests/test_daemon.py:246-330` for existing index/remove/load-time tests.
- `.opencode/skills/mcp-coco-index/tests/test_protocol.py:128-149` and `.opencode/skills/mcp-coco-index/tests/test_protocol.py:225-240` for protocol round-trip coverage.

## Findings

1. The existing split is source-supported. `remove-project-cancel-safety` must stay first because the daemon already has an internal race with no protocol change involved: load-time indexing uses an untracked `asyncio.create_task(self._run_index(project_root))` at `daemon.py:377-378`, explicit streamed indexing creates another task at `daemon.py:630-635`, and `remove_project` currently pops `_projects`, `_index_locks`, `_load_time_done`, metadata, then calls `project.close()` synchronously at `daemon.py:820-827`.

2. The smallest safe internal registry for packet 1 is a per-project task registry plus a remove barrier, not a public cancel protocol. Minimum shape: `_index_tasks: dict[str, set[asyncio.Task[None]]]`, a small metadata map for task kind (`load_time`, `explicit`, later `request_id`), done callbacks that discard completed tasks and observe exceptions, and an async helper that marks the project removing, cancels all tracked tasks for that project, awaits them with a bounded timeout, then removes registry state and closes the project. That covers both load-time and explicit index tasks without introducing wire-level identity yet.

3. Packet 1 should make `remove_project` asynchronous or split it into an async cancel/await phase plus a synchronous final cleanup. A purely synchronous `remove_project` cannot safely wait for `_run_index` to leave `Project.update_index`, whose `finally` block performs SQLite FTS sync at `core/project.py:72-76`. Closing the project before that finally block settles is the close-under-write hazard.

4. Packet 2 needs a stronger identity model than the daemon's current generated `req_id`. `SearchRequest` has `reqId` at `core/protocol.py:21-29`, but `IndexRequest` has only `project_root` at `core/protocol.py:17-19`; `handle_connection` fabricates an id when a request lacks one at `daemon.py:900`. A safe `CancelIndexRequest` therefore needs a client-visible index identity: at minimum `project_root` plus a client-supplied `reqId` or daemon-returned `indexId`, with a per-project generation token so a stale cancel cannot cancel a later index after the same request id or project path is reused.

5. The disagreement paths are concrete. Load-time auto-index starts untracked work before any client can know an identity (`daemon.py:377-378`). Explicit `index_streamed` deliberately lets `_run_index` continue after `GeneratorExit`/client disconnect (`daemon.py:619-620` and `daemon.py:654-657`). `remove_project` removes registry state and closes the project without consulting either path (`daemon.py:820-827`). Request timeout only wraps `_dispatch` (`daemon.py:929-933`); once `_dispatch` returns an async iterator, streaming responses are consumed outside that timeout at `daemon.py:941-944`.

6. Current tests prove happy-path behavior, not cancellation safety. There are tests for index progress, loaded-project removal, idempotent removal of an unloaded path, search waiting during explicit indexing, load-time indexing, and protocol round trips at `tests/test_daemon.py:205-330` and `tests/test_protocol.py:128-149`, but no test removes during active/pending index, cancels a specific index, checks stale cancel identity, or asserts the target SQLite state remains usable after cancel/remove.

7. The packet boundary should stay as recommended with a tighter contract: packet 1 owns internal task tracking, remove barriers, load-time and explicit index cancellation/await, and registry/SQLite state safety. Packet 2 owns the public protocol/client surface: `CancelIndexRequest`, `CancelIndexResponse`, index identity propagation, stale/not-found/already-complete responses, and timeout/client-disconnect semantics that use the packet 1 registry.

## Questions Answered

- What is the smallest safe internal task registry design for `ProjectRegistry` remove/cancel behavior? A per-project set of owned index tasks, minimal task metadata, done callbacks, a removing barrier, and bounded cancel/await before popping registry dictionaries or closing `Project`.
- What request identity model is needed before `CancelIndexRequest` can be safe? Project root plus stable index identity, preferably a client-supplied `reqId` or daemon-returned `indexId` with per-project generation to reject stale cancels.
- Where can `remove_project`, `index_streamed`, load-time auto-index, and client timeout paths disagree? They disagree at task ownership and timeout boundaries: load-time and explicit index tasks are created independently, remove closes registry state synchronously, client disconnect does not stop `_run_index`, and request timeout does not bound async iterator streaming.
- Which tests should prove cancellation is safe? Tests must cover active explicit index removal, load-time removal, queued explicit indexes, client disconnect followed by remove, specific cancel by id, stale/wrong-project cancel, timeout behavior, and post-cancel/post-remove SQLite re-index/search usability.
- Should packet 1 and packet 2 be split exactly as recommended? Yes, with packet 1 kept internal and packet 2 kept protocol-facing. Source evidence supports the dependency because public cancel cannot be safe until all daemon-owned index tasks are tracked and cancellable.

## Questions Remaining

- Should the public cancel identity be named `reqId`, `indexId`, or both for compatibility with existing request logging?
- Should load-time auto-index be externally cancellable in packet 2, or only internally cancellable by remove/shutdown in packet 1?
- What exact response schema should distinguish `cancelled`, `not_found`, `already_complete`, `stale`, and `remove_in_progress`?
- What bounded await timeout is acceptable before returning a remove/cancel error while leaving registry state intact?

## Ruled Out

- Merging `remove-project-cancel-safety` into `daemon-protocol-cancel-index-surface`. Prior strategy already ruled this out at `research/deep-research-strategy.md:249-252`, and source re-read confirms the internal remove race exists before any public cancel request.
- Treating `RemoveProjectRequest` as a cancel primitive. It lacks request identity, returns only `RemoveProjectResponse(ok=True)`, and currently closes project resources after popping registry maps.
- Adding `CancelIndexRequest` before task ownership exists. Without a registry mapping identity to owned tasks, cancel would be unable to distinguish active, queued, completed, stale, or load-time work safely.
- Relying on the existing request timeout for streamed index safety. The timeout wraps `_dispatch`, not the later async iterator consumption.

## Dead Ends

- Searching for an existing `CancelIndexRequest` or cancel response found none in `core/protocol.py`.
- Existing daemon tests were useful for happy-path coverage, but they do not contain a remove-during-index or cancel-specific safety oracle.
- No runtime cancellation experiment was attempted; this pass was research-only and source evidence was sufficient.

## Reflection

- What worked and why: Reading the registry, protocol, client, and tests side by side made the boundary clear: internal task ownership is a prerequisite for any public cancel surface.
- What did not work and why: Existing test coverage did not answer corruption safety directly; it proves index/remove happy paths but not interleavings.
- What I would do differently: Pull the request identity question into iteration 009's matrix earlier, because it is the real dependency between packets 1 and 2.

## Next Focus

Validate the third recommendation, `daemon-and-mcp-bg-index-task-lifecycle`, against the daemon and MCP child background indexing paths, especially exception visibility, shutdown cancellation, and whether protocol cancel changes the required task ownership shape.

## Recommended Next Focus

Use iteration 012 to validate `daemon-and-mcp-bg-index-task-lifecycle` with concrete source evidence from `daemon.py`, `cli.py`, `server.py`, and existing background-index tests.
