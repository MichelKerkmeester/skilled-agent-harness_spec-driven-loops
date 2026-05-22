## Focus

Confirm `Project.close` / sqlite-vec `ManagedConnection` deep-vs-shallow close behavior and capture runtime daemon RSS / `vm_stat` snapshots across normal daemon usage where feasible. The measurement path stayed non-destructive: no process kills, no forced sidecar failure, no target source edits.

## Actions Taken

- Read the current deep-research config, strategy, state log, iteration 004/005 reports, and iter-004/iter-005 deltas before inspecting code.
- Re-read `Project.close`, `Project.create`, and the shared context keys to determine exactly which resources are created and which resource `close()` touches.
- Located the installed CocoIndex package in `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/` and inspected `ManagedConnection`, `sqlite.connect`, `managed_connection`, `Environment`, `LazyEnvironment.stop`, `ContextProvider`, and `App`.
- Attempted non-destructive process/RSS inspection with `ps` and `pgrep`, plus global VM snapshots with `vm_stat` and `sysctl vm.swapusage`.
- Attempted normal `ccc status` and `ccc search` calls through both the `ccc` shim on `PATH` and the packet-local venv CLI with timeouts.
- Explicitly ruled out induced sidecar-5xx testing for this iteration because safe process control and daemon access were unavailable, and the test would deliberately trigger the memory-heavy fallback path under audit.

## Sources Consulted

- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/deep-research-config.json`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/deep-research-strategy.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/deep-research-state.jsonl`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-004.md`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/004-code-index-stack/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-005.md`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/project.py:36-42`, `:44-78`, `:91-133`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/core/shared.py:122-128`, `:188-197`
- `.opencode/skills/mcp-coco-index/mcp_server/cocoindex_code/rerankers/reranker.py:226-357`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/connectors/sqlite/_target.py:66-118`, `:1231-1282`, `:1285-1320`, `:1323-1345`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/environment.py:177-264`, `:417-428`, `:471-522`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/context_keys.py:50-91`
- `.opencode/skills/mcp-coco-index/mcp_server/.venv/lib/python3.11/site-packages/cocoindex/_internal/app.py:124-235`
- Runtime command outputs:
  - `ps -axo pid,ppid,rss,vsz,etime,command` via Python subprocess failed with `Operation not permitted: 'ps'`.
  - `pgrep -fl 'ccc|cocoindex|rerank|sidecar|code-graph|mk-code-index|uvicorn|fastapi'` failed with `pgrep: Cannot get process list`.
  - `sysctl vm.swapusage` failed with `Operation not permitted`.
  - `vm_stat` succeeded at `2026-05-22T06:40:34Z`, `06:40:37Z`, `06:40:40Z`, `06:41:10Z`, `06:41:13Z`, and `06:41:16Z`.
  - `/Users/michelkerkmeester/.local/bin/ccc status` and `ccc search ... --limit 2` failed before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`.
  - `.opencode/skills/mcp-coco-index/mcp_server/.venv/bin/python -m cocoindex_code.cli status` and `search ... --limit 2` failed before daemon contact with `Operation not permitted: '/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock'`.

## Findings

New IDs continue from F-024.

### F-025 [P2] - `ManagedConnection.close()` is deep enough for the one target SQLite handle, but `Project.close()` is still shallow because it leaves the CocoIndex `App`, `Environment`, context provider, and metadata environment lifetime intact

- Owner: `mcp-coco-index` / installed CocoIndex package boundary.
- Process kind: per-project close path over an embedded SQLite target plus CocoIndex runtime objects.
- Evidence:
  - `project.py:36-42` does only `db = self._env.get_context(SQLITE_DB)` followed by `db.close()`.
  - `project.py:107-120` creates a `ContextProvider`, provides `SQLITE_DB` with `sqlite.connect(..., load_vec=True)`, then constructs `coco.Environment(settings, context_provider=context)`.
  - `project.py:121-127` constructs `coco.App(...)`; `project.py:129-133` stores `_env` and `_app` on the `Project`.
  - `shared.py:127` declares `SQLITE_DB = coco.ContextKey[sqlite.ManagedConnection]("index_db", tracked=False)`, so the target DB is an untracked context value, not a lifecycle-managed resource.
  - CocoIndex `ManagedConnection.close()` at `_target.py:115-117` is a direct `self._conn.close()`. That should release the sqlite-vec extension state attached to that SQLite connection and the target DB file descriptor for `target_sqlite.db`.
  - CocoIndex `connect()` at `_target.py:1267-1282` creates the SQLite connection with `check_same_thread=False`, wraps it in `ManagedConnection`, and loads sqlite-vec at `_target.py:1323-1345`.
  - CocoIndex does have a context-manager form at `_target.py:1285-1320`, but `Project.create` uses `context.provide(...)`, not `context.provide_with(...)`; `ContextProvider.provide_with` at `context_keys.py:89-91` is the path that enters cleanup through the provider exit stack.
  - `Environment` notes at `environment.py:181-182` say lifecycle is not driven by the `Environment` class itself. Its constructor stores `_core_env`, `_context_provider`, `_loop_runner`, and `_async_context` at `environment.py:185-235`.
  - `App` stores `_core_env_app` and registers itself with the environment at `app.py:188-219`; no `App.close()` surfaced in the inspected App implementation.
- Cleanup boundary: partial. The target SQLite connection is closed, but the Python objects and CocoIndex core objects remain referenced until the `Project` object itself is dropped. `Project.close()` also does not clear `_app`, `_env`, or the context value, and it does not invoke any CocoIndex stop/lifespan cleanup path.
- Severity/risk adjustment: keep as P2 as an independent memory-retention finding. It becomes P1 only when combined with F-022, where `RemoveProjectRequest` can call `Project.close()` while `_run_index` is still using the same project and SQLite handle.
- Remediation ordering: pair the deeper close design with the F-022 remove-project safety packet. After the daemon can cancel/await in-flight work, add a project close helper that closes lifecycle-managed resources, clears strong references, and uses `managed_connection` / `provide_with` where possible.

### F-026 [P1 when paired with F-022, otherwise P2] - `ManagedConnection.close()` does not acquire the RWLock or mark the connection closed, so `Project.close()` is unsafe as a concurrent close-under-write primitive

- Owner: installed CocoIndex SQLite connector as used by `mcp-coco-index`.
- Process kind: thread-shared SQLite connection with read/write lock wrappers.
- Evidence:
  - `ManagedConnection.transaction()` at `_target.py:87-102` uses `self._rwlock.write()` and manually executes `BEGIN`, `COMMIT`, and `ROLLBACK`.
  - `ManagedConnection.readonly()` at `_target.py:104-113` uses `self._rwlock.read()`.
  - `ManagedConnection.close()` at `_target.py:115-117` does not acquire either read or write lock; it directly calls `self._conn.close()`.
  - `Project.update_index` unconditionally re-enters the same DB in its `finally` block at `project.py:72-76` for FTS sync after `self._app.update()` completes or unwinds.
  - Iteration 005 F-022 already showed `remove_project` can call `project.close()` without finding, cancelling, or awaiting an active `_run_index` task.
- Cleanup boundary: unsafe under concurrent use. The lock protects transactions and reads from each other, but it does not protect the close operation from active transaction/read contexts or from the FTS sync finally-block.
- Severity/risk adjustment: this supports keeping F-022 at P1. It does not prove a standalone runaway memory leak; it proves the existing close primitive is not safe enough to use as cancellation cleanup until the daemon first serializes/cancels/awaits in-flight index work.
- Remediation ordering: fix F-022 before using close as any cancellation primitive. Then harden close to be idempotent and lock-coordinated, or ensure the daemon never calls it while a `ManagedConnection` context may still be active.

### M-006-001 - Runtime RSS evidence could not be captured in this sandbox; global `vm_stat` showed no swap/pageout/compression growth during the failed status/search attempts

- `ps` failed with `Operation not permitted`; `pgrep` failed with `Cannot get process list`; `sysctl vm.swapusage` failed with `Operation not permitted`. So daemon RSS and sidecar RSS are unavailable from this executor.
- The `ccc` shim is present at `/Users/michelkerkmeester/.local/bin/ccc`, but it points to `/Users/michelkerkmeester/.local/pipx/venvs/cocoindex-code/bin/python` and failed before daemon contact because `tree_sitter` is missing from that pipx environment.
- The packet-local venv contains `tree_sitter`, `cocoindex_code`, and `cocoindex`, but status/search failed before daemon contact because the daemon spawn lock under `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` is outside the writable sandbox.
- `vm_stat` deltas from the packet-local venv attempt:
  - Before venv CLI at `2026-05-22T06:41:10Z`: free `1254306`, active `1097051`, inactive `981346`, wired `449719`, compressor occupied `208097`, pageouts `437972`, swapouts `278081364`.
  - After failed venv search at `2026-05-22T06:41:16Z`: free `1257044`, active `1096416`, inactive `980290`, wired `448619`, compressor occupied `208097`, pageouts `437972`, swapouts `278081364`.
  - Bound: no pageout, swapout, or compressor-occupied-page increase occurred during these failed calls. This does not measure daemon behavior because the calls never reached or spawned the daemon.
- Severity/risk adjustment: no quantitative evidence from this iteration supports escalating F-023/F-024 from P2 to P1. Keep them as bounded fixed-cost resident-memory risks unless an unsandboxed normal-search RSS run shows monotonic daemon/sidecar growth.

## Questions Answered

- **Is `ManagedConnection.close` deep enough to release sqlite-vec and WAL resources, or is `Project.close` still shallow because `App` / `Environment` / metadata DB survive?** It is deep enough for the one underlying `sqlite3.Connection` attached to `target_sqlite.db`; sqlite-vec was loaded into that connection, so closing it should release that extension state and file handle. `Project.close()` is still shallow overall: it does not close or clear `_app`, `_env`, `_core_env_app`, `Environment._core_env`, the context provider, or any CocoIndex metadata/runtime state.
- **What current RSS/VM evidence exists for ccc daemon and rerank sidecar in this live session?** RSS evidence is unavailable: `ps` and `pgrep` are denied. VM evidence exists only as global `vm_stat` snapshots. Those snapshots show no pageout/swapout/compressor growth during failed `ccc` status/search attempts, but they do not measure live daemon or sidecar behavior.
- **Can normal search or status calls measurably alter daemon/sidecar RSS without destructive setup?** Not from this executor. The `ccc` shim fails due missing `tree_sitter`; the packet-local venv cannot create the daemon spawn lock outside the sandbox; process listing is denied. Normal status/search calls therefore could not contact or spawn a measurable daemon here.
- **Is induced sidecar fallback/5xx practical to test safely in this packet?** No. It would require controlling or perturbing the sidecar/daemon path that is inaccessible in this sandbox, and the induced failure is expected to load the bundled CrossEncoder fallback into the daemon, which is the exact memory-heavy side effect under audit.
- **How should quantitative evidence adjust P0/P1/P2 severity or remediation ordering?** Quantitative evidence is insufficient for escalation. Keep F-019/F-020/F-022 as P1 correctness/lifecycle hazards. Keep F-023/F-024 as P2 bounded resident-memory risks. Keep the project-close deep-vs-shallow packet as P2 independently, but make it part of the F-022 remediation sequence because close-under-write is P1 in that combined race.

## Questions Remaining

- Unsandboxed measurement still needs one clean baseline/status/search/status sequence with daemon PID RSS, sidecar PID RSS, and `vm_stat` captured before and after.
- Need a live successful search to see whether sidecar mode is active, whether a sidecar process exists, and whether a sidecar success path keeps daemon RSS flat.
- Need code or runtime evidence for whether dropping the final `Project` reference releases CocoIndex Rust/core objects promptly, or whether `_core_env_app` / environment registries keep them alive longer than the Python object graph suggests.

## Ruled Out

- **Induced sidecar-5xx test in this iteration.** Not safe or useful here: the daemon/sidecar path is inaccessible, and a successful induced failure would intentionally load the bundled fallback model into the daemon.
- **Using the `ccc` shim on `PATH` for measurement.** It fails before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`.
- **Using packet-local venv CLI for normal daemon measurement.** It has dependencies, but cannot create `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` under the current sandbox.
- **Process RSS capture through `ps` / `pgrep`.** Both are blocked in this executor, so RSS-based measurement must happen in an unsandboxed follow-up.

## Dead Ends

- A first runtime script used `datetime.UTC`, which is unavailable in system Python 3.9. Retried with `datetime.timezone.utc`.
- `ps` and `pgrep` process enumeration were denied by the execution environment.
- `sysctl vm.swapusage` was denied by the execution environment.
- Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence.

## Reflection

- What worked and why: Static code inspection answered the close-depth question cleanly because `Project.close`, `ManagedConnection.close`, `ContextProvider.provide`, `Environment`, and `App` all expose the relevant ownership boundaries in a small set of files.
- What did not work and why: Runtime RSS measurement did not work because process enumeration and swap sysctl are sandbox-denied, the `ccc` shim has a missing dependency, and the packet-local venv cannot write the daemon spawn lock outside the workspace.
- What I would do differently: Start the runtime pass by checking `pgrep` and the `ccc` shim dependency health before attempting status/search, then immediately fall back to static close-depth analysis when process visibility is denied.

## Next Focus

Use iteration 007 to either perform the missing RSS measurement from a less restricted runtime or skip measurement and move into synthesis. The measurement should capture daemon PID RSS, sidecar PID RSS, and `vm_stat` before and after one successful `ccc status`, one successful `ccc search`, and one follow-up `ccc status`, without inducing sidecar failure.

## Recommended Next Focus

Prefer synthesis and remediation ordering unless an unsandboxed executor is available. The evidence is strong enough to order the packets: F-022 remove-project cancel safety first, F-019/F-020 cancel protocol second, F-005/F-010/F-017/F-018 task lifecycle third, project-close deep/shallow hardening fourth, and F-023/F-024 adapter lifecycle fifth.
