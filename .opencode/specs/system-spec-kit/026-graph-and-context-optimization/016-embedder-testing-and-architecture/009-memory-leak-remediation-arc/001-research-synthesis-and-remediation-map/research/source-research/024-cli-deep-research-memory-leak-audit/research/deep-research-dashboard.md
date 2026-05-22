---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Memory leaks and process lifecycle hazards in .opencode/skills/mcp-coco-index and .opencode/skills/system-code-graph during CLI deep-flow orchestration
- Started: 2026-05-22T06:00:58.626Z
- Status: INITIALIZED
- Iteration: 15 of 15
- Session ID: 024-cli-memory-leak-audit-auto
- Parent Session: none
- Lifecycle Mode: new
- Generation: 1
- continuedFromRun: none

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| undefined | Inventory mcp-coco-index process spawn, daemon, sidecar, local model, indexing, and cleanup surfaces | - | 1.00 | 10 | in_progress |
| undefined | Retained in-process state behind iter-001: Project.close, registry caches, code-graph shutdown, embedder HTTP clients | - | 0.55 | 5 | complete |
| undefined | Confirm cleanup-asymmetry diff is exhaustive; audit _bg_index fire-and-forget pattern in cli.py and server.py | - | 0.40 | 3 | complete |
| undefined | DaemonClient.index cancellation semantics + protocol cancel-surface audit + remaining create_task survey | - | 0.45 | 3 | complete |
| undefined | RemoveProject-mid-Index cancellation semantics + _ADAPTERS mutation audit | - | 0.35 | 3 | complete |
| undefined | Project.close depth and runtime VM/RSS feasibility | - | 0.30 | 2 | complete |
| undefined | Runtime measurement cross-validation | - | 0.22 | 1 | complete |
| undefined | Ticket-ready remediation packet drafts | - | 0.18 | 10 | complete |
| undefined | Final packet matrix and convergence synthesis | - | 0.12 | 30 | complete |
| undefined | Final synthesis and convergence statement | - | 0.04 | 5 | complete |
| undefined | Validate remove/cancel packet split | - | 0.26 | 7 | complete |
| undefined | Validate bg-index lifecycle and code-graph owner/orphan recommendations | - | 0.28 | 8 | complete |
| undefined | Process sweep and rerank sidecar lifecycle safety | - | 0.24 | 8 | complete |
| undefined | Project, embedder cache, adapter lifecycle validation | - | 0.22 | 7 | complete |
| undefined | Integrated recommendation readiness review | - | 0.16 | 7 | complete |

- iterationsCompleted: 15
- keyFindings: 435
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] Which mcp-coco-index code paths spawn or retain long-lived processes, daemons, sidecars, model runtimes, or file handles?
- [ ] Which system-code-graph code paths spawn or retain long-lived processes, graph scans, SQLite handles, cache state, or recovery locks?
- [ ] Where can CLI skills, deep-research, deep-review, AI council, or nested CLI handoffs create orphan process trees?
- [ ] Which cleanup rules are documented but not enforced by code?
- [ ] Which memory pressure symptoms are true user-process leaks versus Apple Silicon swap/wired pressure?
- [ ] What P0/P1 follow-up remediation packets should be created?

<!-- /ANCHOR:questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- Last 3 ratios: 0.24 -> 0.22 -> 0.16
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 0.16
- coverageBySources: {"code":129,"other":44}

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- **`closeDb()` reachable from production paths other than recovery.** Grep (iteration 2)
- **`embedders/registered_embedders.py` holds runtime HTTP clients.** Read (iteration 2)
- Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` / (iteration 2)
- **An `asyncio.create_task` site in `server.py` beyond line 557.** Grep (iteration 3)
- **An eighth registry cache hiding behind iter-002's seven-cache list.** (iteration 3)
- Did not read `core/client.py` to verify whether `DaemonClient.index` is (iteration 3)
- Did not survey `retrieval/`, `indexer/`, `observability/`, `core/` for (iteration 3)
- **`asyncio.ensure_future` sites anywhere in `cocoindex_code/`.** Zero (iteration 4)
- **`atexit` / `signal.signal` hooks that might own a cleanup path.** (iteration 4)
- **Additional `asyncio.create_task` sites in `retrieval/`, `indexer/`, (iteration 4)
- **An eighth caller-side reachable per-RPC abort verb beyond (iteration 4)
- **Extra `ThreadPoolExecutor(...)` construction sites (custom executor (iteration 4)
- Did not capture runtime `ps` / `vm_stat` evidence for F-001/F-002 weight (iteration 4)
- Did not characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest` (iteration 4)
- **`_ADAPTERS` accumulation is unbounded per request.** Disproven (iteration 5)
- **`RemoveProjectRequest` as-is is a usable cancel primitive.** (iteration 5)
- **Sidecar mode reduces daemon-side memory pressure as designed.** (iteration 5)
- **Test-fixture `monkeypatch.setattr(_ADAPTERS, {})` resets are an (iteration 5)
- Did not capture runtime `ps -p <ppid>,<children>` + `vm_stat` (iteration 5)
- Did not open `rerankers_jina_v3.py::JinaRerankerAdapter` — lazy- (iteration 5)
- Did not search for any `__del__` or `weakref.finalize` registered (iteration 5)
- **Induced sidecar-5xx test in this iteration.** Not safe or useful here: the daemon/sidecar path is inaccessible, and a successful induced failure would intentionally load the bundled fallback model into the daemon. (iteration 6)
- **Process RSS capture through `ps` / `pgrep`.** Both are blocked in this executor, so RSS-based measurement must happen in an unsandboxed follow-up. (iteration 6)
- **Using packet-local venv CLI for normal daemon measurement.** It has dependencies, but cannot create `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` under the current sandbox. (iteration 6)
- **Using the `ccc` shim on `PATH` for measurement.** It fails before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`. (iteration 6)
- `ps` and `pgrep` process enumeration were denied by the execution environment. (iteration 6)
- `sysctl vm.swapusage` was denied by the execution environment. (iteration 6)
- A first runtime script used `datetime.UTC`, which is unavailable in system Python 3.9. Retried with `datetime.timezone.utc`. (iteration 6)
- Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence. (iteration 6)
- Escalating F-023/F-024 from P2 to P1 based on this log would overread the data. The log has process inventory, but no successful query/fallback growth sample. (iteration 7)
- Multiple `ccc mcp` processes alone are not proof of an in-daemon leak. They are compatible with multiple MCP host/session registrations. (iteration 7)
- The measured `ccc status` / `ccc search` failures are not evidence that the CocoIndex daemon is unreachable. They fail in the Homebrew `@naarang/ccc` Node CLI before any daemon query. (iteration 7)
- The measurement does not prove monotonic memory leakage during normal search. Swap, pageout, swapout, and compressor-occupied counters are flat across the failed command window. (iteration 7)
- Treating `/opt/homebrew/bin/ccc` as the code-index CLI is a dead end for this packet; the crash is a dependency/install problem in a different `ccc` executable. (iteration 7)
- Using the short before/after VM snapshot as a leak detector is not valid because the two measured commands exit nonzero before normal daemon work begins. (iteration 7)
- Escalating adapter lifecycle work back to P0 based on iteration 007. The log proves process inventory, not successful-search or fallback growth. (iteration 8)
- Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first. (iteration 8)
- No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis. (iteration 8)
- No packet directories were created because the user explicitly requested drafts only. (iteration 8)
- No target source implementation was attempted because the packet is research-only. (iteration 8)
- Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here. (iteration 8)
- Treating multiple `ccc mcp` children as proof of one daemon leak. Prior evidence says they are compatible with multiple MCP host/session registrations. (iteration 8)
- Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon. (iteration 8)
- A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`. (iteration 9)
- Creating remediation packet folders remains out of scope for this research-only iteration. (iteration 9)
- Escalating adapter lifecycle back to P0 from current measurements. M-006 lacks daemon RSS, and M-007 has process inventory plus flat failed-command VM counters, not successful-search growth. (iteration 9)
- New broad source discovery was unnecessary for this pass and would have diluted the matrix work. (iteration 9)
- New runtime measurement was not attempted; prior deltas already identify the measurement collision and sandbox limits. (iteration 9)
- Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence. (iteration 9)
- Treating multiple `ccc mcp` processes as one CocoIndex daemon leak. Iteration 007 already supports host/session multiplicity as the safer interpretation. (iteration 9)
- Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers. (iteration 10)
- Creating a separate F-004 daemon reset packet instead of folding it into process sweep. (iteration 10)
- Creating remediation packet folders stayed out of scope for this research-only iteration. (iteration 10)
- Escalating adapter or sidecar memory work back to P0 without successful-search or fallback growth evidence. (iteration 10)
- New broad source discovery was not useful for the final pass; it would have diluted the iteration 009 matrix. (iteration 10)
- New runtime measurement was not attempted because prior iterations already identified the sandbox limits and Homebrew `ccc` collision. (iteration 10)
- Treating multiple `ccc mcp` children as proof of one CocoIndex daemon leak. (iteration 10)
- Adding `CancelIndexRequest` before task ownership exists. Without a registry mapping identity to owned tasks, cancel would be unable to distinguish active, queued, completed, stale, or load-time work safely. (iteration 11)
- Existing daemon tests were useful for happy-path coverage, but they do not contain a remove-during-index or cancel-specific safety oracle. (iteration 11)
- Merging `remove-project-cancel-safety` into `daemon-protocol-cancel-index-surface`. Prior strategy already ruled this out at `research/deep-research-strategy.md:249-252`, and source re-read confirms the internal remove race exists before any public cancel request. (iteration 11)
- No runtime cancellation experiment was attempted; this pass was research-only and source evidence was sufficient. (iteration 11)
- Relying on the existing request timeout for streamed index safety. The timeout wraps `_dispatch`, not the later async iterator consumption. (iteration 11)
- Searching for an existing `CancelIndexRequest` or cancel response found none in `core/protocol.py`. (iteration 11)
- Treating `RemoveProjectRequest` as a cancel primitive. It lacks request identity, returns only `RemoveProjectResponse(ok=True)`, and currently closes project resources after popping registry maps. (iteration 11)
- No new tests were run. This iteration was research-only and focused on source-backed acceptance criteria. (iteration 12)
- No source edits or follow-up packet folders were created. (iteration 12)
- Relying on `asyncio.Task.cancel()` to stop `run_in_executor(None, client.index, ...)`. It can cancel the awaiter, but it does not kill a running blocking ThreadPool function. (iteration 12)
- Runtime process enumeration was not retried. Iteration 007 already captured process inventory, and iteration 010 classified parent-PID and DB-dir identity as implementation-packet verification gates. (iteration 12)
- Treating `EPERM` from `process.kill(pid, 0)` as stale. The current launcher correctly treats it as live/held because permission denial still implies possible process existence. (iteration 12)
- Treating PPID 1 as sufficient proof that a code-graph server is stale. It proves orphaning, not inactivity or DB safety. (iteration 12)
- Using the existing launcher duplicate-owner tests as complete coverage. They cover basic live/dead PID and override paths, but not orphan child/server survival or symlink/effective-DB identity drift. (iteration 12)
- Building one shared reaper for sidecar, code-graph, CLI dispatchers, and CocoIndex daemon children. Shared inventory is useful; shared termination policy is too risky. (iteration 13)
- No induced sidecar crash or `pkill` test was run. The point of this pass was to design gates that avoid destructive pattern-based termination. (iteration 13)
- No target source files or follow-up packet folders were edited. (iteration 13)
- Runtime `ps`/`pgrep` enumeration was not retried. Iteration 007 already captured the needed process inventory, and iteration 012 ruled out retrying sandboxed enumeration for this lane. (iteration 13)
- Treating `EPERM` from liveness probes as reclaimable stale. The existing launcher policy is correct: permission denial means live/unknown. (iteration 13)
- Treating a healthy sidecar port as owned by the current session. A healthy port proves service availability, not lineage or termination authority. (iteration 13)
- Treating PPID 1 as stale proof. Iteration 012 already established that it proves orphaning, not inactivity or DB/model safety. (iteration 13)
- Using broad `pkill -f` or `pkill -9 -f` patterns as the process-sweep implementation. They are too coarse for multi-session operator environments. (iteration 13)
- A project-local `App.close()` as the implementation anchor. Source inspection found `App.update()` and core app storage, but no public close/stop/unload method. (iteration 14)
- Closing sidecar fallback adapters immediately after a failed request. That would trade memory for repeated heavy model reloads and surprise reuse behavior. (iteration 14)
- Fixing registry embedder cache via reranker `_ADAPTERS` lifecycle. The caches are separate modules and ownership domains. (iteration 14)
- Raising adapter lifecycle above P2 from current evidence. Iteration 009 ruled out escalation without successful-search or fallback-growth measurement (`iteration-009.md:99-101`), and this pass found API shape, not new growth evidence. (iteration 14)
- Searching for close/unload methods in reranker adapters confirmed absence rather than exposing a hidden cleanup hook. (iteration 14)
- SentenceTransformers/Transformers inspection showed model construction surfaces, but not a simple universal close API that adapter cleanup could delegate to. (iteration 14)
- System `python3` could not import `cocoindex` or `litellm`; installed API inspection used the mcp-coco-index packet-local `.venv` files instead. (iteration 14)
- Merging `remove-project-cancel-safety` with `daemon-protocol-cancel-index-surface`. The internal race exists before public cancel and must be fixed first. (iteration 15)
- No implementation packet folders were created because the user explicitly constrained this iteration to research artifacts. (iteration 15)
- No new source discovery was useful here; iterations 011-014 already supplied the validation evidence needed for the integrated recommendation review. (iteration 15)
- No runtime measurement was attempted; adapter escalation still depends on a controlled successful-search or sidecar-fallback benchmark outside this research-only pass. (iteration 15)
- Raising `adapter-lifecycle-management` above P2 before measurement. (iteration 15)
- Reordering resident-memory optimization ahead of correctness/lifecycle. Iterations 009-010 already rejected that without successful-search or fallback-growth evidence, and iteration 014 added API-shape evidence but no growth measurement. (iteration 15)
- Treating `daemon-and-mcp-bg-index-task-lifecycle` as one undifferentiated implementation change. Daemon registry safety and MCP ThreadPool shutdown have different owners, failure modes, and tests. (iteration 15)
- Using a healthy sidecar port as ownership proof. Health proves availability, not lineage or authority to terminate. (iteration 15)
- Using broad `pkill -f` cleanup patterns as process-sweep implementation. Iteration 013 showed they can kill unrelated sessions and violate current-session safety. (iteration 15)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Open `remove-project-cancel-safety` as the next implementation packet. Its first acceptance gate should prove active explicit, load-time, and queued index work is tracked, cancelled, bounded-awaited, and unable to race registry removal or `Project.close()`.

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
