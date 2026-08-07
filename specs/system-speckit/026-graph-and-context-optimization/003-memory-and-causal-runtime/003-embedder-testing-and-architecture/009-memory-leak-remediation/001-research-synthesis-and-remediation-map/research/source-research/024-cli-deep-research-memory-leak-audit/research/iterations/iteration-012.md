## Focus

Validate the background-index lifecycle and code-graph launcher single-owner/orphan-reap recommendations. This pass checks whether the existing `daemon-and-mcp-bg-index-task-lifecycle` recommendation should stay as one packet or split by process boundary, what shutdown can safely do when background indexing is already in a ThreadPool worker, and what code-graph launcher tests are needed to prevent duplicate owners or DB corruption.

## Actions Taken

- Read the configured research state, strategy, final synthesis, iterations 009 through 011, and deltas 009 through 011 before source inspection.
- Re-read the daemon, CLI, and MCP server background-index paths in `daemon.py`, `cli.py`, and `server.py`.
- Re-read the code-graph launcher lease path, server shutdown path, and DB singleton close path in `mk-code-index-launcher.cjs`, `index.ts`, and `code-graph-db.ts`.
- Checked existing daemon/protocol and code-graph launcher/DB tests to separate existing coverage from the missing safety tests.
- Kept this pass research-only: no target skill source edits, no follow-up spec folders, no sub-agent or nested CLI dispatch.

## Sources Consulted

- `research/deep-research-config.json:1-58` for the continuation settings, max iteration count, and cli-codex executor lane.
- `research/deep-research-strategy.md:21-23` for research-only non-goals.
- `research/research.md:35-48` and `research/research.md:80-101` for final cluster order and packet acceptance contracts.
- `research/iterations/iteration-009.md:34-47` for the final matrix entries mapping F-005, F-010, F-017, and F-018 to `daemon-and-mcp-bg-index-task-lifecycle`.
- `research/iterations/iteration-009.md:35`, `research/iterations/iteration-009.md:42`, and `research/iterations/iteration-009.md:56` for F-006/F-013/F-027 mapping to `code-graph-launcher-single-owner-and-orphan-reap`.
- `research/iterations/iteration-009.md:77` for the ordering rationale placing task lifecycle and code-graph ownership ahead of resident-memory work.
- `research/iterations/iteration-010.md:42-43` for final P1 cluster confirmation.
- `research/iterations/iteration-011.md:35-47` and `research/deltas/iter-011.jsonl:4-10` for the prerequisite internal task-registry and cancel-identity findings.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:1199-1218` for MCP startup background indexing through `asyncio.create_task`, default executor, and swallowed exceptions.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:556-569` for the duplicate MCP server `_bg_index` pattern.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:377-378` for load-time daemon background indexing.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:630-657` for explicit streamed indexing and client-disconnect background continuation.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:1235-1300` for daemon shutdown tracking only connection-handler tasks before `registry.close_all()`.
- `.opencode/bin/mk-code-index-launcher.cjs:157-163`, `.opencode/bin/mk-code-index-launcher.cjs:183-205`, `.opencode/bin/mk-code-index-launcher.cjs:221-231`, and `.opencode/bin/mk-code-index-launcher.cjs:471-498` for effective DB-dir lease path, liveness semantics, atomic lease write, and strict single-writer gate.
- `.opencode/bin/mk-code-index-launcher.cjs:372-413` for child spawn and signal forwarding.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:53-68` for shutdown closing only the IPC bridge.
- `.opencode/skills/system-code-graph/mcp_server/lib/code-graph-db.ts:259-307` for DB singleton initialization and `closeDb()`.
- `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:183-195`, `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:224-250`, and `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts:312-337` for existing duplicate, DB-dir override, stale dead-pid, signal cleanup, and strict-disable coverage.
- `.opencode/skills/mcp-coco-index/tests/test_daemon.py:205-330` and `.opencode/skills/mcp-coco-index/tests/test_protocol.py:128-149` for existing happy-path daemon/protocol coverage.

## Findings

1. The daemon and MCP background-index lifecycle work should split by process boundary, even if the final synthesis keeps the umbrella recommendation name. The daemon side owns `ProjectRegistry` task identity, remove/cancel/shutdown invariants, and active DB safety; the MCP child side owns startup fire-and-forget work, blocking `DaemonClient.index` calls in a ThreadPool worker, exception visibility, and stdio shutdown behavior. The source evidence is separate: daemon load-time and explicit index tasks are created at `daemon.py:377-378` and `daemon.py:630-635`, while MCP child background indexing is created at `cli.py:1204` and `server.py:557`.

2. The daemon half depends on iteration 011's internal task registry and cancel identity. `daemon.py:1235-1300` tracks connection-handler tasks for shutdown, but the load-time `create_task(self._run_index(...))` and explicit `index_task` are not added to that shutdown set. Iteration 011 already found that `ProjectRegistry` has no owned task registry and cannot reason over load-time or explicit index work (`research/deltas/iter-011.jsonl:4`).

3. The MCP half cannot be fixed by cancelling the asyncio task alone. Both `_bg_index` implementations call `loop.run_in_executor(None, client.index, project_root)` at `cli.py:1216` and `server.py:567`. Once the default ThreadPool worker is running, cancelling the asyncio wrapper does not stop the blocking worker function; shutdown must request daemon-side cancellation when an index identity exists, close the client transport, await the worker with a short bound, and log any still-running worker as an ambiguous shutdown condition.

4. The current MCP child background-index path hides the very failures a shutdown test would need to see. Both `cli.py:1215-1218` and `server.py:566-569` catch `Exception` and `pass`, so failed startup indexing, daemon disconnect, timeout, and cancel failures are invisible. The packet should replace silent swallow with structured warning/error telemetry that includes process boundary, project root, and whether the worker was running, cancelled, completed, or unknown.

5. The code-graph launcher already has a reasonable single-owner spine: `resolvedDbDir()` canonicalizes the effective DB dir (`mk-code-index-launcher.cjs:157-163`), the lease file lives next to that DB dir, liveness uses `process.kill(pid, 0)` with `ESRCH` as stale and `EPERM` as live (`mk-code-index-launcher.cjs:183-194`), and strict mode reports `LEASE_HELD_BY` instead of launching a sibling (`mk-code-index-launcher.cjs:471-498`). The missing proof is not basic duplicate-start behavior; it is orphaned child/server behavior after launcher death and same-DB identity across env/path variants.

6. `PPID == 1` is not safe stale proof by itself. Iteration 007 measured an orphaned code-graph server with PPID 1 and multiple launcher/server processes, but the same iteration kept DB-dir identity as an open verification gate (`research/iterations/iteration-007.md:47-52`, `research/iterations/iteration-007.md:75-76`). A live orphan can still hold DB state, so PPID 1 should become "orphan candidate", not "kill/reclaim".

7. `EPERM` must remain live/ambiguous, not reclaimable. The current launcher comment and branch at `mk-code-index-launcher.cjs:192-193` is correct under sandboxed visibility. The safe behavior is to report `LEASE_HELD_BY` or an explicit `liveness=unknown_permission_denied` diagnostic and avoid starting another owner for the same effective DB dir.

8. System-code-graph shutdown still needs DB close wired into the MCP server entrypoint. `shutdownCodeIndex()` closes only the IPC bridge at `index.ts:53-61`, while `closeDb()` exists at `code-graph-db.ts:301-306`. This keeps F-013/F-027 in the code-graph packet: launcher lease discipline prevents duplicate owners, but server shutdown must also release the singleton DB handle.

## Questions Answered

- Are daemon and MCP background task lifecycles best fixed in one packet or split by process boundary? Split by process boundary. Keep the umbrella recommendation only as a tracking theme; implement and verify `daemon-bg-index-task-registry-shutdown` before `mcp-bg-index-threadpool-shutdown`. The daemon side needs task identity and registry invariants. The MCP side needs bounded ThreadPool shutdown and visible errors.
- What should shutdown do when background indexing is in a ThreadPool worker? It should not assume asyncio cancellation stops the worker. It should stop scheduling new background index work, request daemon-side cancellation when an index identity exists, close or invalidate the client transport, await the executor future with a bounded timeout, and emit a structured warning if the worker remains running or liveness is unknown.
- How should code-graph launcher prove one active owner per effective DB dir? Use the canonical effective DB dir as the identity, store the lease beside that DB, atomically write owner metadata, re-read the lease before spawning, report/bridge a live holder, and test same-realpath DB dirs through default, override, symlink, and legacy lease paths. The server should also expose or write a readiness/owner marker that includes the effective DB dir and owner token so an orphaned child can be classified without starting a duplicate.
- What stale/orphan detection is safe when PPID is 1 or EPERM makes liveness ambiguous? `ESRCH` on the recorded owner PID is stale. `EPERM` is live/unknown and must block duplicate launch. `PPID == 1` is only an orphan candidate; reaping should require same DB-dir identity plus dead owner or failed health/bridge checks, and should default to dry-run diagnostics rather than termination.
- Which tests should prevent DB corruption or duplicate owners? Add launcher tests for same effective DB dir through env override and symlink aliases, live-owner `EPERM` simulation, PPID-1 orphan candidate dry-run behavior, dead owner plus live orphan child classification, and SIGTERM/SIGKILL child-survival paths. Add DB/server tests that shutdown calls `closeDb()`, duplicate owners do not both initialize the same SQLite DB, and any intentional strict-disable path is visibly unsafe/test-scoped. Add MCP/daemon tests for active explicit index shutdown, load-time auto-index shutdown, client disconnect plus shutdown/remove, background worker timeout, visible `_bg_index` exceptions, and post-cancel/post-remove re-index/search usability.

## Questions Remaining

- Should the implementation create two new remediation packets or keep one packet with two mandatory acceptance sections? My recommendation is two packets if the spec system allows it; otherwise one parent packet with daemon and MCP child subsections and separate test gates.
- What exact daemon cancel response schema will packet 2 expose for MCP child shutdown to consume? Iteration 011 left `cancelled`, `not_found`, `already_complete`, `stale`, and `remove_in_progress` as schema choices.
- Should orphan code-graph server classification use a bridge socket health check, a readiness marker, a lease heartbeat, or all three? Source evidence supports the need, but the exact mechanism is an implementation design choice.

## Ruled Out

- Relying on `asyncio.Task.cancel()` to stop `run_in_executor(None, client.index, ...)`. It can cancel the awaiter, but it does not kill a running blocking ThreadPool function.
- Treating PPID 1 as sufficient proof that a code-graph server is stale. It proves orphaning, not inactivity or DB safety.
- Treating `EPERM` from `process.kill(pid, 0)` as stale. The current launcher correctly treats it as live/held because permission denial still implies possible process existence.
- Using the existing launcher duplicate-owner tests as complete coverage. They cover basic live/dead PID and override paths, but not orphan child/server survival or symlink/effective-DB identity drift.

## Dead Ends

- Runtime process enumeration was not retried. Iteration 007 already captured process inventory, and iteration 010 classified parent-PID and DB-dir identity as implementation-packet verification gates.
- No new tests were run. This iteration was research-only and focused on source-backed acceptance criteria.
- No source edits or follow-up packet folders were created.

## Reflection

- What worked and why: Reading the daemon, MCP child, and launcher shutdown paths side by side exposed the process-boundary split cleanly; each path has a different owner, cancellation mechanism, and safe test oracle.
- What did not work and why: Existing tests could confirm basic launcher lease behavior and daemon happy paths, but they do not simulate ThreadPool worker shutdown, orphaned code-graph children, or ambiguous liveness.
- What I would do differently: Pull launcher orphan fixtures and MCP ThreadPool-blocking fixtures into the research prompt earlier, because those fixtures are the decisive proof points for this packet.

## Next Focus

Validate the `mcp-host-session-process-sweep` and `rerank-sidecar-lifecycle` recommendations against actual dry-run inventory requirements, stale-process safety, and sidecar reuse/stop metadata.

## Recommended Next Focus

Use iteration 013 to validate process-sweep and sidecar lifecycle acceptance tests, especially parent/lineage classification, dry-run safety, and what must never be killed when liveness is ambiguous.
