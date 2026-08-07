## Focus

Produce ticket-ready remediation packet drafts from the current evidence and ordering. This iteration is synthesis-only: no target source edits, no packet directories, no sub-agents, no AI CLI dispatch, and no new runtime measurement.

## Actions Taken

- Read the configured deep-research packet state, strategy, state log, iteration 005-007 narratives, and iter-005 through iter-007 deltas first.
- Pulled earlier delta records for F-001 through F-021 so packet drafts did not depend on unstated memory.
- Re-read source slices for the high-risk surfaces: daemon project/index lifecycle, client/protocol cancel surface, MCP background index tasks, reranker adapters, project close behavior, code-graph launcher/server shutdown, read-path friction, and rerank sidecar spawn.
- Converted the current ordered findings into ten ticket-ready packet drafts with dependencies, scope, acceptance criteria, evidence, verification, and non-goals.
- Answered the merge/reorder, first-safe-packet, downgrade/defer, and verification questions explicitly.

## Sources Consulted

- `research/deep-research-config.json` for max iterations, executor schedule, and topic.
- `research/deep-research-strategy.md` for remaining questions, exhausted approaches, and synthesis focus.
- `research/deep-research-state.jsonl` for iteration status and novelty trend.
- `research/iterations/iteration-005.md` and `research/deltas/iter-005.jsonl` for F-022, F-023, F-024, RemoveProject race evidence, and adapter-cache accumulation bounds.
- `research/iterations/iteration-006.md` and `research/deltas/iter-006.jsonl` for F-025, F-026, sandboxed RSS limits, and downgrade support for adapter memory severity.
- `research/iterations/iteration-007.md` and `research/deltas/iter-007.jsonl` for M-007-001, M-007-002, F-027, process inventory, and final packet ordering.
- `research/deltas/iter-001.jsonl` through `research/deltas/iter-004.jsonl` for F-001 through F-021 source anchors and refinements.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/daemon.py:349-416`, `:443-473`, `:610-660`, `:816-841`, `:1000-1072`, `:1235-1299`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/client.py:87-123`, `:198-205`, `:277-313`, `:400-472`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/protocol.py:13-55`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/cli.py:139-170`, `:1192-1218`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/server.py:210-269`, `:321-359`, `:551-569`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:20-35`, `:130-279`, `:365-414`.
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:36-42`, `:72-76`, `:107-133`.
- `.opencode/bin/mk-code-index-launcher.cjs:183-194`, `:372-383`, `:402-423`, `:471-498`.
- `.opencode/skills/system-code-graph/mcp_server/index.ts:53-69`, `lib/code-graph-db.ts:22-23`, `:301-306`, `handlers/ccc-reindex.ts:8`, `:41-46`, `lib/ensure-ready.ts:86-119`, `lib/ipc/socket-server.ts:34-37`, `:135-138`.
- `.opencode/skills/system-rerank-sidecar/scripts/ensure_rerank_sidecar.py:109-116`, `:118-123`, and `scripts/start.sh:47`.

## Findings

### Packet 1: remove-project-cancel-safety

- Title/slug: Remove Project Cancel Safety / `remove-project-cancel-safety`.
- Severity: P1 correctness and lifecycle. F-026 is P1 when paired with F-022 and P2 independently.
- Dependency: none. This is the smallest safe first implementation packet and prerequisite for protocol-level cancel.
- Scope: teach `ProjectRegistry` to own in-flight index task state per `project_root`, cancel and bounded-await active indexing before removing project registry entries, and prevent `Project.close()` from running while an index write can still touch the same `ManagedConnection`.
- Acceptance criteria: `remove_project` detects active `_run_index`; cancellation is idempotent; cancellation is awaited with a bounded timeout; stale `_load_time_done` waiters are released; registry dict entries are popped only after active work has settled; no second `_run_index` can be created with a fresh lock while an old one is still writing; close-under-write is covered by tests.
- Source evidence: iter-005 F-022; iter-006 F-026; `daemon.py:630-635` creates a local `index_task`; `daemon.py:816-830` pops `_projects`, `_index_locks`, `_load_time_done`, and calls `project.close()` without task lookup, cancel, or await; `daemon.py:443-473` reads project and lock from dicts at task start and releases the captured lock later; `project.py:72-76` re-enters the DB in `finally`; `Project.close` at `project.py:36-42` directly closes the DB context.
- Tests/verification: add async daemon tests for remove-before-task-start, remove-after-task-captures-project, remove-then-readd race, and close-under-write prevention. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "remove_project or cancel or index"`.
- Non-goals: no public `CancelIndexRequest`; no MCP background task refactor; no full App/Environment release beyond the minimum needed for safe remove.

### Packet 2: daemon-protocol-cancel-index-surface

- Title/slug: Daemon Protocol Cancel Index Surface / `daemon-protocol-cancel-index-surface`.
- Severity: P1 lifecycle and correctness.
- Dependency: depends on `remove-project-cancel-safety`, because the protocol handler needs a safe daemon-internal cancel primitive.
- Scope: add a protocol cancel verb, client API surface, daemon dispatch handler, request correlation semantics, and caller behavior for timeouts/disconnects. F-021 belongs here because foreground refresh handlers need a real daemon cancel surface when `asyncio.wait_for` times out.
- Acceptance criteria: `core/protocol.py` contains a `CancelIndexRequest` and response type; `DaemonClient` exposes a cancel method that does not rely on closing the whole connection; daemon dispatch routes cancel to the tracked in-flight index task; cancel is project/request-scoped; repeated cancel is safe; server refresh/search timeout paths attempt cancel and report a clear cancelled/timed-out state.
- Source evidence: iter-004 F-019/F-020/F-021; `core/client.py:87-123` blocks in `recv_bytes()` until an `IndexResponse`; `core/client.py:198-205` only exposes stop/close, not per-index abort; `core/protocol.py:13-55` includes handshake, index, search, project status, daemon status, remove project, and stop, but no cancel; `server.py:210-269` and `:321-359` wrap blocking `client.index()` calls in executor work plus `asyncio.wait_for`.
- Tests/verification: protocol encode/decode tests for cancel request/response; daemon dispatch tests for canceling one project without stopping the daemon; client tests for cancel after timeout; server tests asserting timeout triggers cancel. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "cancel_index or protocol or timeout"`.
- Non-goals: no remove-project semantics beyond consuming packet 1's primitive; no sidecar or adapter cleanup; no global daemon restart flag.

### Packet 3: daemon-and-mcp-bg-index-task-lifecycle

- Title/slug: Daemon and MCP Background Index Task Lifecycle / `daemon-and-mcp-bg-index-task-lifecycle`.
- Severity: P1 lifecycle.
- Dependency: depends on `daemon-protocol-cancel-index-surface` so caller-side cleanup can cancel real daemon work instead of only abandoning a local task.
- Scope: replace fire-and-forget background index calls with tracked task ownership, done callbacks, cancellation on MCP server shutdown, and error logging. Include daemon load-time `_run_index`, CLI `mcp()` `_bg_index`, and alternate `server.py` `_serve()` `_bg_index`.
- Acceptance criteria: all background index tasks have an owner set; task exceptions are logged; shutdown cancels and awaits outstanding tasks; executor work has a cancellation path through packet 2; duplicate `_bg_index` helpers are consolidated or share one helper; daemon shutdown gathers inner index tasks rather than only connection handlers.
- Source evidence: iter-001 F-005/F-010; iter-003 F-017/F-018; iter-004 cluster refinement; `daemon.py:378` fires load-time `_run_index` without storing it; `daemon.py:1235-1299` gathers connection handler tasks only; `cli.py:1204` and `server.py:557` call `asyncio.create_task(_bg_index(...))`; `cli.py:1210-1218` and `server.py:563-569` run blocking `client.index` in an executor and swallow exceptions.
- Tests/verification: async unit tests for shutdown awaiting tracked daemon index tasks; MCP stdio harness tests that background index is cancelled on server shutdown; regression test that `_bg_index` exceptions are observable in logs/diagnostics. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "bg_index or background or shutdown"`.
- Non-goals: no protocol design beyond using packet 2; no registry cache cleanup; no host-level process sweep.

### Packet 4: code-graph-launcher-single-owner-and-orphan-reap

- Title/slug: Code Graph Launcher Single Owner and Orphan Reap / `code-graph-launcher-single-owner-and-orphan-reap`.
- Severity: P1 lifecycle and DB-safety, P2 memory.
- Dependency: independent of CocoIndex cancel packets; should precede broad host/session sweeping so code-graph ownership is clear before external cleanup.
- Scope: make the launcher/server pair enforce one active owner per effective `SPECKIT_CODE_GRAPH_DB_DIR`, bridge to the active owner instead of spawning another server, reap stale PPID 1 children safely, and call `closeDb()` during server shutdown.
- Acceptance criteria: lease files include DB-dir identity; strict single-writer refuses duplicate launchers for the same DB dir; stale owners are reclaimable only after liveness and DB-dir checks; signal handling reaps child servers; server shutdown invokes `closeDb()`; orphan detection is dry-run capable before kill/reap behavior.
- Source evidence: iter-007 F-027; M-007-001 measured five launchers and three code-graph servers, including a PPID 1 server; `mk-code-index-launcher.cjs:372-383` spawns one server child; `:471-498` implements strict lease handling; `:402-423` forwards signals and SIGKILLs after five seconds; `system-code-graph/mcp_server/index.ts:53-69` closes only the IPC bridge; `code-graph-db.ts:301-306` has `closeDb()`.
- Tests/verification: launcher unit tests for duplicate lease, stale lease, EPERM-as-live, and DB-dir mismatch; integration test that SIGTERM closes DB and exits child; dry-run orphan reap test. Run `cd .opencode/skills/system-code-graph/mcp_server && npm test -- --runInBand` and `npm run build`.
- Non-goals: no `ccc_reindex` async conversion except where needed to avoid orphan children; no read-path git caching; no host-wide process killer.

### Packet 5: mcp-host-session-process-sweep

- Title/slug: MCP Host Session Process Sweep / `mcp-host-session-process-sweep`.
- Severity: P1 orchestration hygiene, not an in-daemon leak finding.
- Dependency: should follow or at least coordinate with packets 3 and 4 so sweeping respects per-server shutdown contracts.
- Scope: add a dry-run-first inventory and cleanup path for stale MCP child processes and lingering CLI executor processes across deep-flow sessions. The packet should classify parent PID, elapsed time, command kind, workspace/spec lineage, and whether the process is safe to terminate.
- Acceptance criteria: produces an inventory of `ccc mcp`, `ccc run-daemon`, code-graph launcher/server, sidecar, and CLI executor processes; distinguishes active host/session children from stale children; defaults to dry-run; never kills the current process/session; requires explicit allowlist or age/lineage proof for termination; records evidence in the research/spec packet when used.
- Source evidence: iter-007 M-007-001 measured five `ccc mcp` children totaling about 681.8 MiB RSS, one lingering `claude -p` iteration process at about 504.1 MiB RSS, one detached daemon, one sidecar, five code-graph launchers, and three code-graph servers. Iter-007 O-007-001 ruled that multiple `ccc mcp` processes are compatible with multiple host/session registrations, so this is host lifecycle cleanup rather than proof of daemon duplication.
- Tests/verification: process-classifier tests with fixture `ps` output; dry-run output snapshot tests; safety tests for current PID, parent chain, and stale-lineage detection; manual verification command should be a dry-run inventory first, for example `node .opencode/skills/system-spec-kit/scripts/.../process-sweep --dry-run` once the packet defines the script path.
- Non-goals: no daemon-internal cancel or registry changes; no automatic kill by default; no claim that multiple `ccc mcp` children are one CocoIndex leak.

### Packet 6: rerank-sidecar-lifecycle

- Title/slug: Rerank Sidecar Lifecycle / `rerank-sidecar-lifecycle`.
- Severity: P1 lifecycle, P2 memory until successful-search/fallback growth is measured.
- Dependency: independent, but should coordinate with host process sweep for inventory and stale sidecar reaping.
- Scope: give the rerank sidecar an explicit parent/session lifecycle contract: PID/port metadata, reuse if healthy, stale PID detection, parent-exit or session-exit cleanup, health-check bounded startup, and a non-destructive stop/reap path.
- Acceptance criteria: sidecar start writes discoverable metadata; ensure path reuses a healthy sidecar; failed health startup terminates the child and closes log handles; stale sidecars can be detected and stopped; MCP startup does not spawn duplicate sidecars for the same port; lifecycle docs match code behavior.
- Source evidence: iter-001 F-003; iter-007 M-007-001 measured one detached `uvicorn scripts.rerank_sidecar:app` process with PPID 1 and about 392.9 MiB RSS; `ensure_rerank_sidecar.py:109-116` starts `start.sh` with `start_new_session=True`; `:118-123` SIGTERMs only on startup health failure; `start.sh:47` runs uvicorn workers.
- Tests/verification: unit tests for metadata read/write, healthy reuse, stale PID, and failed startup cleanup; integration test starting the sidecar on a temporary port then stopping it; manual verification captures `ps`/health endpoint before and after. Suggested command: `cd .opencode/skills/system-rerank-sidecar && python -m pytest tests -q`.
- Non-goals: no reranker fallback/model cache cleanup; no proof or claim of monotonic leak growth without successful runtime measurement.

### Packet 7: project-close-full-release

- Title/slug: Project Close Full Release / `project-close-full-release`.
- Severity: P2 independently, P1 only through the F-022/F-026 close-under-write race.
- Dependency: depends on `remove-project-cancel-safety`; close hardening must not run while active indexing can still use the same project.
- Scope: make `Project.close()` idempotent and deeper: close the target SQLite handle, clear strong references to App/Environment/context values where safe, prefer managed context-provider cleanup if CocoIndex supports it, and document what upstream resources remain process-owned.
- Acceptance criteria: repeated `Project.close()` is safe; `_app` and `_env` references are cleared or made inert after close; SQLite handle is closed exactly once; close cannot interleave with active index/update; tests prove objects are releasable after project removal; F-025 severity is reflected by not overclaiming upstream core release if unsupported.
- Source evidence: iter-002 F-011, iter-006 F-025/F-026; `project.py:36-42` only closes the `SQLITE_DB` context; `project.py:107-133` constructs a `ContextProvider`, `Environment`, and `App` stored on the project; `project.py:72-76` uses the DB in `finally`, so close requires ordering with active updates.
- Tests/verification: unit tests for idempotent close, close after successful index, close after failed index, no DB use after close, and object reference release where observable. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "Project.close or close_project or remove_project"`.
- Non-goals: no cancel protocol; no reranker or embedder cache eviction except references directly owned by the Project.

### Packet 8: registry-embedder-cache-lifecycle

- Title/slug: Registry Embedder Cache Lifecycle / `registry-embedder-cache-lifecycle`.
- Severity: P1 deterministic retained embedder state on config changes.
- Dependency: can follow packet 1 or packet 7; safer after remove/close ordering is settled.
- Scope: fix `ProjectRegistry` cleanup asymmetry for `_embedder_by_config_hash`, `_project_effective_config_hash`, `_current_index_meta`, and refresh-on-config-change semantics. The central risk is previous-hash embedder retention, not every registry dict.
- Acceptance criteria: config refresh evicts or reference-counts stale embedders; `remove_project` and `close_all` walk embedder cache ownership intentionally; stale hash entries do not survive the last project using them; cleanup behavior is covered for same-hash, changed-hash, remove, and daemon shutdown paths; tests distinguish true embedder retention from self-healing dict overwrites.
- Source evidence: iter-002 F-012/F-014, iter-003 F-016/C-003; `daemon.py:349-356` initializes `_embedder_by_config_hash` and other caches; `daemon.py:392-404` creates project-scoped embedders by effective config hash; `daemon.py:406-416` refreshes by popping the project but not the old embedder hash; `daemon.py:816-841` remove/close paths do not walk `_embedder_by_config_hash`.
- Tests/verification: tests with two config hashes and mock embedders that expose `close()`/sentinel release; refresh should drop old hash only when no project still needs it; close_all should release all cached embedders. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "embedder or config_hash or refresh_project"`.
- Non-goals: no LiteLLM upstream global shutdown unless represented by the embedder abstraction; no reranker adapter lifecycle.

### Packet 9: adapter-lifecycle-management

- Title/slug: Adapter Lifecycle Management / `adapter-lifecycle-management`.
- Severity: P2 resident-memory risk until a successful search/fallback measurement proves larger growth. Do not keep the initial P0 memory-first severity.
- Dependency: should follow the correctness and host lifecycle packets unless operators need immediate RSS relief.
- Scope: add close/unload lifecycle to reranker adapters and adjacent model/client adapters: close `httpx.Client`, clear CrossEncoder/Jina model references, expose `close_all_adapters()`, clear `_ADAPTERS`, optionally add small bounded eviction, and define how LiteLLM embedder pools are handled or explicitly unsupported.
- Acceptance criteria: `CrossEncoderRerankerAdapter`, `HttpSidecarRerankerAdapter`, and Jina adapter expose idempotent close/unload; `HttpSidecarRerankerAdapter` closes both `_client` and `_fallback_adapter`; `_ADAPTERS` clear path calls close before dropping references; daemon shutdown invokes the adapter cleanup; tests show sidecar toggle/fallback does not leave stale cached adapters after cleanup.
- Source evidence: iter-001 F-001/F-002; iter-002 F-015 and confirmations; iter-005 F-023/F-024; iter-006 and iter-007 severity refinements. `reranker.py:20` defines `_ADAPTERS`; `:130-169` lazy-loads CrossEncoder into `_model`; `:249-257` lazy-creates `httpx.Client`; `:259-279` lazy-creates and uses a bundled fallback adapter; `:365-414` creates/cache-selects fallback, sidecar, Jina, or CrossEncoder adapters. `daemon.py:832-841` does not call adapter cleanup.
- Tests/verification: unit tests for each adapter close path; tests that fallback close unloads nested fallback; cache tests for sidecar key, bare key, fallback key, and env toggles; daemon shutdown test asserting `close_all_adapters()` is called. Run `cd .opencode/skills/mcp-coco-index/mcp_server && .venv/bin/python -m pytest tests -q -k "rerank or adapter or sidecar"`.
- Non-goals: no sidecar process lifecycle; no P0 claim without successful-search RSS growth; no registry embedder hash cleanup except LiteLLM adapter notes if directly in scope.

### Packet 10: code-graph-read-path-friction

- Title/slug: Code Graph Read Path Friction / `code-graph-read-path-friction`.
- Severity: P2.
- Dependency: follow `code-graph-launcher-single-owner-and-orphan-reap`; read-path friction is lower priority than server ownership and DB close correctness.
- Scope: reduce repeated short-lived child processes and passive socket/transport retention in normal read paths. Cache or batch git freshness probes, make timeouts explicit, and add watchdog/idle cleanup for active IPC socket/transport collections.
- Acceptance criteria: read-path freshness checks avoid redundant `git rev-parse`/`git diff` calls within a short TTL or request batch; active socket/transport maps have idle cleanup or heartbeat; close events remain the normal cleanup path; no regression in stale-index detection; metrics/logs expose cache hits and active transport count.
- Source evidence: iter-001 F-007/F-008; `ensure-ready.ts:86-119` shells out to git for HEAD and diff checks; `socket-server.ts:34-37` stores module-global `activeSockets` and `activeTransports`; `socket-server.ts:135-138` cleans them on close only.
- Tests/verification: unit tests for git-head cache TTL and fallback-on-git-error; socket watchdog tests with fake sockets/transports; load-style test that repeated read-path calls do not spawn repeated git children inside the TTL. Run `cd .opencode/skills/system-code-graph/mcp_server && npm test -- --runInBand` and `npm run build`.
- Non-goals: no launcher/single-owner fix; no code-graph DB close work; no CocoIndex daemon changes.

## Questions Answered

- Are any packet drafts duplicates that should be merged or reordered? Yes. F-001/F-002/F-023/F-024 and F-015 should be one `adapter-lifecycle-management` packet, with the initial P0 framing downgraded. F-021 should be subsumed by `daemon-protocol-cancel-index-surface` because foreground timeout handlers need a daemon cancel verb. F-006/F-013 should move under `code-graph-launcher-single-owner-and-orphan-reap` because iteration 007 added F-027 process evidence. `remove-project-cancel-safety` and `daemon-protocol-cancel-index-surface` should not merge: the first creates the safe daemon-internal primitive; the second exposes it over the protocol. `mcp-host-session-process-sweep` should stay separate because multiple `ccc mcp` children can be normal host/session multiplicity, not daemon duplication.
- Which packet is the smallest safe first implementation packet? `remove-project-cancel-safety`. It is narrow, source-local to daemon/project close behavior, does not require public protocol design, and unblocks every later cancel/close packet. Implementing protocol cancel first would force a public API onto an unsafe internal primitive.
- Which findings should be downgraded/deferred because measurement does not support leak-growth severity? Downgrade/defer the initial P0 memory-first framing for F-001/F-002/F-003. Keep F-023/F-024 as P2 fixed-cost resident-memory risks pending successful-search/fallback RSS evidence. Keep F-003 as P1 lifecycle/P2 memory, not P0. Keep F-011 as P2 independently after F-025 clarified that `ManagedConnection.close()` closes the target SQLite connection; it is P1 only through the F-022/F-026 concurrent close race. Keep F-007/F-008 P2. Do not treat multiple `ccc mcp` processes as proof of an in-daemon leak.
- What verification commands or tests should each packet require? Each draft above includes packet-specific tests and a targeted command. The shared minimum is: mcp-coco-index packets run `.venv/bin/python -m pytest tests -q` in `.opencode/skills/mcp-coco-index/mcp_server`; system-code-graph packets run `npm test -- --runInBand` and `npm run build` in `.opencode/skills/system-code-graph/mcp_server`; sidecar packets run `python -m pytest tests -q` in `.opencode/skills/system-rerank-sidecar`; process-sweep work must provide dry-run fixture tests before any live termination behavior.

## Questions Remaining

- Should F-004's detached daemon reset/operator-owned lifecycle be folded into `mcp-host-session-process-sweep`, or should it remain a separate daemon reset flag packet after these ten drafts?
- Which process owners correspond to the measured parent PIDs for `ccc mcp` children, and which are active hosts versus stale sessions?
- Do the three measured code-graph servers share one `SPECKIT_CODE_GRAPH_DB_DIR`, or are they from distinct workspaces/env overrides?
- What is the true RSS slope for a successful Python `.venv/bin/ccc search` path outside the Homebrew `ccc` collision?
- Does a sidecar 5xx/fallback event load the bundled CrossEncoder in this operator environment, and what exact RSS delta does it produce?

## Ruled Out

- Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first.
- Escalating adapter lifecycle work back to P0 based on iteration 007. The log proves process inventory, not successful-search or fallback growth.
- Treating multiple `ccc mcp` children as proof of one daemon leak. Prior evidence says they are compatible with multiple MCP host/session registrations.
- Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon.
- Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here.

## Dead Ends

- No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis.
- No target source implementation was attempted because the packet is research-only.
- No packet directories were created because the user explicitly requested drafts only.

## Reflection

- What worked and why: Reusing the prior delta records gave each packet stable finding IDs, severity lineage, and source anchors without reopening broad discovery.
- What did not work and why: Some verification commands remain packet-level requirements rather than proven local commands because this iteration was not allowed to implement tests or run full package verification.
- What I would do differently: For the final synthesis pass, add a compact matrix that maps every F-ID to exactly one packet, one severity, and one verification gate so implementation packets can be opened without re-reading all iteration narratives.

## Next Focus

Iteration 009 should turn these drafts into a final remediation matrix: F-ID to packet, packet to dependency, packet to first verification command, and downgrade/defer notes. It should also decide whether F-004 needs its own daemon reset/operator lifecycle packet or belongs under host/session sweep.

## Recommended Next Focus

Build the final packet matrix and convergence-ready synthesis. Preserve the ordering from this iteration unless new evidence proves successful-search leak growth; otherwise keep correctness and lifecycle cleanup ahead of resident-memory optimization.
