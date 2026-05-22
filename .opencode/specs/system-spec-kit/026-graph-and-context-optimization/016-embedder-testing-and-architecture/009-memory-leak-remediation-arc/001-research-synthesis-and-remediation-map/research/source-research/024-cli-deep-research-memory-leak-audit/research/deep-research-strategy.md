# Deep Research Strategy - CLI Memory Leak Audit

## 1. OVERVIEW

Research packet for finding memory leaks, orphan-process buildup, daemon lifecycle hazards, stale locks, retained sidecars, and Apple Silicon memory-pressure failure modes in mcp-coco-index and system-code-graph.

## 2. TOPIC
Memory leaks and process lifecycle hazards in .opencode/skills/mcp-coco-index and .opencode/skills/system-code-graph during CLI deep-flow orchestration

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Which mcp-coco-index code paths spawn or retain long-lived processes, daemons, sidecars, model runtimes, or file handles?
- [ ] Which system-code-graph code paths spawn or retain long-lived processes, graph scans, SQLite handles, cache state, or recovery locks?
- [ ] Where can CLI skills, deep-research, deep-review, AI council, or nested CLI handoffs create orphan process trees?
- [ ] Which cleanup rules are documented but not enforced by code?
- [ ] Which memory pressure symptoms are true user-process leaks versus Apple Silicon swap/wired pressure?
- [ ] What P0/P1 follow-up remediation packets should be created?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
Do not implement fixes. Do not edit target skill source files. Do not spawn nested deep-flow or sibling CLI loops from inside an iteration.

## 5. STOP CONDITIONS
Complete fifteen iterations or stop only if executor failures prevent artifact creation. User explicitly overrode swap preflight as a blocker for this run.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- MACHINE-OWNED: START -->
<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Reading `project.py`, `shared.py`, and `daemon.py` (iteration 2)
- Re-reading the cleanup methods side by side and then (iteration 3)
- Reading `core/client.py` end-to-end *plus* the (iteration 4)
- Reading `daemon.py` request dispatch (1000- (iteration 5)
- Static code inspection answered the close-depth question cleanly because `Project.close`, `ManagedConnection.close`, `ContextProvider.provide`, `Environment`, and `App` all expose the relevant ownership boundaries in a small set of files. (iteration 6)
- The native log turned iteration 006's denied `ps`/`pgrep` gap into concrete process inventory, RSS bounds, and parent/elapsed-time evidence. (iteration 7)
- Reusing the prior delta records gave each packet stable finding IDs, severity lineage, and source anchors without reopening broad discovery. (iteration 8)
- Reusing the existing delta records made the final matrix deterministic; each ID could be assigned without reopening source discovery. (iteration 9)
- Using iteration 009 as the authority made the final synthesis deterministic and kept severity/order decisions stable. (iteration 10)
- Reading the registry, protocol, client, and tests side by side made the boundary clear: internal task ownership is a prerequisite for any public cancel surface. (iteration 11)
- Reading the daemon, MCP child, and launcher shutdown paths side by side exposed the process-boundary split cleanly; each path has a different owner, cancellation mechanism, and safe test oracle. (iteration 12)
- Reading the process inventory log alongside the launcher and sidecar ownership code made the missing metadata obvious: PID and port prove existence, not ownership. (iteration 13)
- Reading project, registry, adapter, and installed package APIs side by side separated real close APIs from hoped-for ones. (iteration 14)
- Treating iterations 011-014 as validation layers over the iteration 009/010 matrix exposed exactly where the order should be tightened without reopening broad discovery. (iteration 15)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- I initially planned to read (iteration 2)
- The original plan was to also audit (iteration 3)
- Initially considered also surveying (iteration 4)
- I considered separately reading (iteration 5)
- Runtime RSS measurement did not work because process enumeration and swap sysctl are sandbox-denied, the `ccc` shim has a missing dependency, and the packet-local venv cannot write the daemon spawn lock outside the workspace. (iteration 6)
- The log still did not measure successful normal-search behavior because the shell-resolved Homebrew `ccc` crashes on a missing native Sentry profiler module before contacting the code-index daemon. (iteration 7)
- Some verification commands remain packet-level requirements rather than proven local commands because this iteration was not allowed to implement tests or run full package verification. (iteration 8)
- The no-action F-009 case does not fit cleanly into a remediation-packet matrix, so it needed an explicit final-report bucket. (iteration 9)
- The remaining measurement gaps cannot be resolved inside this synthesis pass because they require successful non-Homebrew code-index searches and controlled sidecar fallback measurement. (iteration 10)
- Existing test coverage did not answer corruption safety directly; it proves index/remove happy paths but not interleavings. (iteration 11)
- Existing tests could confirm basic launcher lease behavior and daemon happy paths, but they do not simulate ThreadPool worker shutdown, orphaned code-graph children, or ambiguous liveness. (iteration 12)
- The current playbook cleanup commands are useful as shorthand for a human smoke test, but they are not safe enough to translate into remediation code. (iteration 13)
- Package-level imports through system Python failed, so API validation had to use direct `.venv` file inspection. (iteration 14)
- A single linear packet list is slightly misleading for process sweep and sidecar lifecycle because inventory can be implemented before sidecar termination authority exists, but destructive actions cannot. (iteration 15)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### **`_ADAPTERS` accumulation is unbounded per request.** Disproven -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`_ADAPTERS` accumulation is unbounded per request.** Disproven
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`_ADAPTERS` accumulation is unbounded per request.** Disproven

### **`asyncio.ensure_future` sites anywhere in `cocoindex_code/`.** Zero -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`asyncio.ensure_future` sites anywhere in `cocoindex_code/`.** Zero
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`asyncio.ensure_future` sites anywhere in `cocoindex_code/`.** Zero

### **`atexit` / `signal.signal` hooks that might own a cleanup path.** -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **`atexit` / `signal.signal` hooks that might own a cleanup path.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`atexit` / `signal.signal` hooks that might own a cleanup path.**

### **`closeDb()` reachable from production paths other than recovery.** Grep -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`closeDb()` reachable from production paths other than recovery.** Grep
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`closeDb()` reachable from production paths other than recovery.** Grep

### **`embedders/registered_embedders.py` holds runtime HTTP clients.** Read -- BLOCKED (iteration 2, 1 attempts)
- What was tried: **`embedders/registered_embedders.py` holds runtime HTTP clients.** Read
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`embedders/registered_embedders.py` holds runtime HTTP clients.** Read

### **`RemoveProjectRequest` as-is is a usable cancel primitive.** -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **`RemoveProjectRequest` as-is is a usable cancel primitive.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **`RemoveProjectRequest` as-is is a usable cancel primitive.**

### **Additional `asyncio.create_task` sites in `retrieval/`, `indexer/`, -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Additional `asyncio.create_task` sites in `retrieval/`, `indexer/`,
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Additional `asyncio.create_task` sites in `retrieval/`, `indexer/`,

### **An `asyncio.create_task` site in `server.py` beyond line 557.** Grep -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An `asyncio.create_task` site in `server.py` beyond line 557.** Grep
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An `asyncio.create_task` site in `server.py` beyond line 557.** Grep

### **An eighth caller-side reachable per-RPC abort verb beyond -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **An eighth caller-side reachable per-RPC abort verb beyond
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An eighth caller-side reachable per-RPC abort verb beyond

### **An eighth registry cache hiding behind iter-002's seven-cache list.** -- BLOCKED (iteration 3, 1 attempts)
- What was tried: **An eighth registry cache hiding behind iter-002's seven-cache list.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **An eighth registry cache hiding behind iter-002's seven-cache list.**

### **Extra `ThreadPoolExecutor(...)` construction sites (custom executor -- BLOCKED (iteration 4, 1 attempts)
- What was tried: **Extra `ThreadPoolExecutor(...)` construction sites (custom executor
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Extra `ThreadPoolExecutor(...)` construction sites (custom executor

### **Induced sidecar-5xx test in this iteration.** Not safe or useful here: the daemon/sidecar path is inaccessible, and a successful induced failure would intentionally load the bundled fallback model into the daemon. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Induced sidecar-5xx test in this iteration.** Not safe or useful here: the daemon/sidecar path is inaccessible, and a successful induced failure would intentionally load the bundled fallback model into the daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Induced sidecar-5xx test in this iteration.** Not safe or useful here: the daemon/sidecar path is inaccessible, and a successful induced failure would intentionally load the bundled fallback model into the daemon.

### **Process RSS capture through `ps` / `pgrep`.** Both are blocked in this executor, so RSS-based measurement must happen in an unsandboxed follow-up. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Process RSS capture through `ps` / `pgrep`.** Both are blocked in this executor, so RSS-based measurement must happen in an unsandboxed follow-up.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Process RSS capture through `ps` / `pgrep`.** Both are blocked in this executor, so RSS-based measurement must happen in an unsandboxed follow-up.

### **Sidecar mode reduces daemon-side memory pressure as designed.** -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Sidecar mode reduces daemon-side memory pressure as designed.**
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Sidecar mode reduces daemon-side memory pressure as designed.**

### **Test-fixture `monkeypatch.setattr(_ADAPTERS, {})` resets are an -- BLOCKED (iteration 5, 1 attempts)
- What was tried: **Test-fixture `monkeypatch.setattr(_ADAPTERS, {})` resets are an
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Test-fixture `monkeypatch.setattr(_ADAPTERS, {})` resets are an

### **Using packet-local venv CLI for normal daemon measurement.** It has dependencies, but cannot create `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` under the current sandbox. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Using packet-local venv CLI for normal daemon measurement.** It has dependencies, but cannot create `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` under the current sandbox.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using packet-local venv CLI for normal daemon measurement.** It has dependencies, but cannot create `/Users/michelkerkmeester/.cocoindex_code/daemon.spawn-lock` under the current sandbox.

### **Using the `ccc` shim on `PATH` for measurement.** It fails before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: **Using the `ccc` shim on `PATH` for measurement.** It fails before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: **Using the `ccc` shim on `PATH` for measurement.** It fails before daemon contact with `ModuleNotFoundError: No module named 'tree_sitter'`.

### `ps` and `pgrep` process enumeration were denied by the execution environment. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `ps` and `pgrep` process enumeration were denied by the execution environment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `ps` and `pgrep` process enumeration were denied by the execution environment.

### `sysctl vm.swapusage` was denied by the execution environment. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: `sysctl vm.swapusage` was denied by the execution environment.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: `sysctl vm.swapusage` was denied by the execution environment.

### A first runtime script used `datetime.UTC`, which is unavailable in system Python 3.9. Retried with `datetime.timezone.utc`. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: A first runtime script used `datetime.UTC`, which is unavailable in system Python 3.9. Retried with `datetime.timezone.utc`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A first runtime script used `datetime.UTC`, which is unavailable in system Python 3.9. Retried with `datetime.timezone.utc`.

### A project-local `App.close()` as the implementation anchor. Source inspection found `App.update()` and core app storage, but no public close/stop/unload method. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: A project-local `App.close()` as the implementation anchor. Source inspection found `App.update()` and core app storage, but no public close/stop/unload method.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A project-local `App.close()` as the implementation anchor. Source inspection found `App.update()` and core app storage, but no public close/stop/unload method.

### A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`.

### Adding `CancelIndexRequest` before task ownership exists. Without a registry mapping identity to owned tasks, cancel would be unable to distinguish active, queued, completed, stale, or load-time work safely. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Adding `CancelIndexRequest` before task ownership exists. Without a registry mapping identity to owned tasks, cancel would be unable to distinguish active, queued, completed, stale, or load-time work safely.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Adding `CancelIndexRequest` before task ownership exists. Without a registry mapping identity to owned tasks, cancel would be unable to distinguish active, queued, completed, stale, or load-time work safely.

### Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers.

### Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence.

### Building one shared reaper for sidecar, code-graph, CLI dispatchers, and CocoIndex daemon children. Shared inventory is useful; shared termination policy is too risky. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Building one shared reaper for sidecar, code-graph, CLI dispatchers, and CocoIndex daemon children. Shared inventory is useful; shared termination policy is too risky.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Building one shared reaper for sidecar, code-graph, CLI dispatchers, and CocoIndex daemon children. Shared inventory is useful; shared termination policy is too risky.

### Closing sidecar fallback adapters immediately after a failed request. That would trade memory for repeated heavy model reloads and surprise reuse behavior. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Closing sidecar fallback adapters immediately after a failed request. That would trade memory for repeated heavy model reloads and surprise reuse behavior.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Closing sidecar fallback adapters immediately after a failed request. That would trade memory for repeated heavy model reloads and surprise reuse behavior.

### Creating a separate F-004 daemon reset packet instead of folding it into process sweep. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Creating a separate F-004 daemon reset packet instead of folding it into process sweep.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating a separate F-004 daemon reset packet instead of folding it into process sweep.

### Creating remediation packet folders remains out of scope for this research-only iteration. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Creating remediation packet folders remains out of scope for this research-only iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating remediation packet folders remains out of scope for this research-only iteration.

### Creating remediation packet folders stayed out of scope for this research-only iteration. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Creating remediation packet folders stayed out of scope for this research-only iteration.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Creating remediation packet folders stayed out of scope for this research-only iteration.

### Did not capture runtime `ps -p <ppid>,<children>` + `vm_stat` -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Did not capture runtime `ps -p <ppid>,<children>` + `vm_stat`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not capture runtime `ps -p <ppid>,<children>` + `vm_stat`

### Did not capture runtime `ps` / `vm_stat` evidence for F-001/F-002 weight -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Did not capture runtime `ps` / `vm_stat` evidence for F-001/F-002 weight
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not capture runtime `ps` / `vm_stat` evidence for F-001/F-002 weight

### Did not characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest` -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Did not characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest`
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not characterize daemon-side `RemoveProjectRequest`-mid-`IndexRequest`

### Did not open `rerankers_jina_v3.py::JinaRerankerAdapter` — lazy- -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Did not open `rerankers_jina_v3.py::JinaRerankerAdapter` — lazy-
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not open `rerankers_jina_v3.py::JinaRerankerAdapter` — lazy-

### Did not read `core/client.py` to verify whether `DaemonClient.index` is -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not read `core/client.py` to verify whether `DaemonClient.index` is
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not read `core/client.py` to verify whether `DaemonClient.index` is

### Did not search for any `__del__` or `weakref.finalize` registered -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Did not search for any `__del__` or `weakref.finalize` registered
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not search for any `__del__` or `weakref.finalize` registered

### Did not survey `retrieval/`, `indexer/`, `observability/`, `core/` for -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Did not survey `retrieval/`, `indexer/`, `observability/`, `core/` for
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Did not survey `retrieval/`, `indexer/`, `observability/`, `core/` for

### Escalating adapter lifecycle back to P0 from current measurements. M-006 lacks daemon RSS, and M-007 has process inventory plus flat failed-command VM counters, not successful-search growth. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Escalating adapter lifecycle back to P0 from current measurements. M-006 lacks daemon RSS, and M-007 has process inventory plus flat failed-command VM counters, not successful-search growth.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating adapter lifecycle back to P0 from current measurements. M-006 lacks daemon RSS, and M-007 has process inventory plus flat failed-command VM counters, not successful-search growth.

### Escalating adapter lifecycle work back to P0 based on iteration 007. The log proves process inventory, not successful-search or fallback growth. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Escalating adapter lifecycle work back to P0 based on iteration 007. The log proves process inventory, not successful-search or fallback growth.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating adapter lifecycle work back to P0 based on iteration 007. The log proves process inventory, not successful-search or fallback growth.

### Escalating adapter or sidecar memory work back to P0 without successful-search or fallback growth evidence. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Escalating adapter or sidecar memory work back to P0 without successful-search or fallback growth evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating adapter or sidecar memory work back to P0 without successful-search or fallback growth evidence.

### Escalating F-023/F-024 from P2 to P1 based on this log would overread the data. The log has process inventory, but no successful query/fallback growth sample. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Escalating F-023/F-024 from P2 to P1 based on this log would overread the data. The log has process inventory, but no successful query/fallback growth sample.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Escalating F-023/F-024 from P2 to P1 based on this log would overread the data. The log has process inventory, but no successful query/fallback growth sample.

### Existing daemon tests were useful for happy-path coverage, but they do not contain a remove-during-index or cancel-specific safety oracle. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Existing daemon tests were useful for happy-path coverage, but they do not contain a remove-during-index or cancel-specific safety oracle.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Existing daemon tests were useful for happy-path coverage, but they do not contain a remove-during-index or cancel-specific safety oracle.

### Fixing registry embedder cache via reranker `_ADAPTERS` lifecycle. The caches are separate modules and ownership domains. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Fixing registry embedder cache via reranker `_ADAPTERS` lifecycle. The caches are separate modules and ownership domains.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Fixing registry embedder cache via reranker `_ADAPTERS` lifecycle. The caches are separate modules and ownership domains.

### Merging `remove-project-cancel-safety` into `daemon-protocol-cancel-index-surface`. Prior strategy already ruled this out at `research/deep-research-strategy.md:249-252`, and source re-read confirms the internal remove race exists before any public cancel request. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Merging `remove-project-cancel-safety` into `daemon-protocol-cancel-index-surface`. Prior strategy already ruled this out at `research/deep-research-strategy.md:249-252`, and source re-read confirms the internal remove race exists before any public cancel request.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging `remove-project-cancel-safety` into `daemon-protocol-cancel-index-surface`. Prior strategy already ruled this out at `research/deep-research-strategy.md:249-252`, and source re-read confirms the internal remove race exists before any public cancel request.

### Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first.

### Merging `remove-project-cancel-safety` with `daemon-protocol-cancel-index-surface`. The internal race exists before public cancel and must be fixed first. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Merging `remove-project-cancel-safety` with `daemon-protocol-cancel-index-surface`. The internal race exists before public cancel and must be fixed first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging `remove-project-cancel-safety` with `daemon-protocol-cancel-index-surface`. The internal race exists before public cancel and must be fixed first.

### Multiple `ccc mcp` processes alone are not proof of an in-daemon leak. They are compatible with multiple MCP host/session registrations. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Multiple `ccc mcp` processes alone are not proof of an in-daemon leak. They are compatible with multiple MCP host/session registrations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Multiple `ccc mcp` processes alone are not proof of an in-daemon leak. They are compatible with multiple MCP host/session registrations.

### New broad source discovery was not useful for the final pass; it would have diluted the iteration 009 matrix. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: New broad source discovery was not useful for the final pass; it would have diluted the iteration 009 matrix.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New broad source discovery was not useful for the final pass; it would have diluted the iteration 009 matrix.

### New broad source discovery was unnecessary for this pass and would have diluted the matrix work. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: New broad source discovery was unnecessary for this pass and would have diluted the matrix work.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New broad source discovery was unnecessary for this pass and would have diluted the matrix work.

### New runtime measurement was not attempted because prior iterations already identified the sandbox limits and Homebrew `ccc` collision. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: New runtime measurement was not attempted because prior iterations already identified the sandbox limits and Homebrew `ccc` collision.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New runtime measurement was not attempted because prior iterations already identified the sandbox limits and Homebrew `ccc` collision.

### New runtime measurement was not attempted; prior deltas already identify the measurement collision and sandbox limits. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: New runtime measurement was not attempted; prior deltas already identify the measurement collision and sandbox limits.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: New runtime measurement was not attempted; prior deltas already identify the measurement collision and sandbox limits.

### No implementation packet folders were created because the user explicitly constrained this iteration to research artifacts. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: No implementation packet folders were created because the user explicitly constrained this iteration to research artifacts.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No implementation packet folders were created because the user explicitly constrained this iteration to research artifacts.

### No induced sidecar crash or `pkill` test was run. The point of this pass was to design gates that avoid destructive pattern-based termination. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: No induced sidecar crash or `pkill` test was run. The point of this pass was to design gates that avoid destructive pattern-based termination.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No induced sidecar crash or `pkill` test was run. The point of this pass was to design gates that avoid destructive pattern-based termination.

### No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis.

### No new source discovery was useful here; iterations 011-014 already supplied the validation evidence needed for the integrated recommendation review. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: No new source discovery was useful here; iterations 011-014 already supplied the validation evidence needed for the integrated recommendation review.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new source discovery was useful here; iterations 011-014 already supplied the validation evidence needed for the integrated recommendation review.

### No new tests were run. This iteration was research-only and focused on source-backed acceptance criteria. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: No new tests were run. This iteration was research-only and focused on source-backed acceptance criteria.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new tests were run. This iteration was research-only and focused on source-backed acceptance criteria.

### No packet directories were created because the user explicitly requested drafts only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No packet directories were created because the user explicitly requested drafts only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No packet directories were created because the user explicitly requested drafts only.

### No runtime cancellation experiment was attempted; this pass was research-only and source evidence was sufficient. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: No runtime cancellation experiment was attempted; this pass was research-only and source evidence was sufficient.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No runtime cancellation experiment was attempted; this pass was research-only and source evidence was sufficient.

### No runtime measurement was attempted; adapter escalation still depends on a controlled successful-search or sidecar-fallback benchmark outside this research-only pass. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: No runtime measurement was attempted; adapter escalation still depends on a controlled successful-search or sidecar-fallback benchmark outside this research-only pass.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No runtime measurement was attempted; adapter escalation still depends on a controlled successful-search or sidecar-fallback benchmark outside this research-only pass.

### No source edits or follow-up packet folders were created. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: No source edits or follow-up packet folders were created.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No source edits or follow-up packet folders were created.

### No target source files or follow-up packet folders were edited. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: No target source files or follow-up packet folders were edited.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No target source files or follow-up packet folders were edited.

### No target source implementation was attempted because the packet is research-only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No target source implementation was attempted because the packet is research-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No target source implementation was attempted because the packet is research-only.

### Raising `adapter-lifecycle-management` above P2 before measurement. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Raising `adapter-lifecycle-management` above P2 before measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising `adapter-lifecycle-management` above P2 before measurement.

### Raising adapter lifecycle above P2 from current evidence. Iteration 009 ruled out escalation without successful-search or fallback-growth measurement (`iteration-009.md:99-101`), and this pass found API shape, not new growth evidence. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Raising adapter lifecycle above P2 from current evidence. Iteration 009 ruled out escalation without successful-search or fallback-growth measurement (`iteration-009.md:99-101`), and this pass found API shape, not new growth evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Raising adapter lifecycle above P2 from current evidence. Iteration 009 ruled out escalation without successful-search or fallback-growth measurement (`iteration-009.md:99-101`), and this pass found API shape, not new growth evidence.

### Relying on `asyncio.Task.cancel()` to stop `run_in_executor(None, client.index, ...)`. It can cancel the awaiter, but it does not kill a running blocking ThreadPool function. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Relying on `asyncio.Task.cancel()` to stop `run_in_executor(None, client.index, ...)`. It can cancel the awaiter, but it does not kill a running blocking ThreadPool function.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on `asyncio.Task.cancel()` to stop `run_in_executor(None, client.index, ...)`. It can cancel the awaiter, but it does not kill a running blocking ThreadPool function.

### Relying on the existing request timeout for streamed index safety. The timeout wraps `_dispatch`, not the later async iterator consumption. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Relying on the existing request timeout for streamed index safety. The timeout wraps `_dispatch`, not the later async iterator consumption.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Relying on the existing request timeout for streamed index safety. The timeout wraps `_dispatch`, not the later async iterator consumption.

### Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence.

### Reordering resident-memory optimization ahead of correctness/lifecycle. Iterations 009-010 already rejected that without successful-search or fallback-growth evidence, and iteration 014 added API-shape evidence but no growth measurement. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Reordering resident-memory optimization ahead of correctness/lifecycle. Iterations 009-010 already rejected that without successful-search or fallback-growth evidence, and iteration 014 added API-shape evidence but no growth measurement.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reordering resident-memory optimization ahead of correctness/lifecycle. Iterations 009-010 already rejected that without successful-search or fallback-growth evidence, and iteration 014 added API-shape evidence but no growth measurement.

### Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here.

### Runtime `ps`/`pgrep` enumeration was not retried. Iteration 007 already captured the needed process inventory, and iteration 012 ruled out retrying sandboxed enumeration for this lane. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Runtime `ps`/`pgrep` enumeration was not retried. Iteration 007 already captured the needed process inventory, and iteration 012 ruled out retrying sandboxed enumeration for this lane.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime `ps`/`pgrep` enumeration was not retried. Iteration 007 already captured the needed process inventory, and iteration 012 ruled out retrying sandboxed enumeration for this lane.

### Runtime process enumeration was not retried. Iteration 007 already captured process inventory, and iteration 010 classified parent-PID and DB-dir identity as implementation-packet verification gates. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Runtime process enumeration was not retried. Iteration 007 already captured process inventory, and iteration 010 classified parent-PID and DB-dir identity as implementation-packet verification gates.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Runtime process enumeration was not retried. Iteration 007 already captured process inventory, and iteration 010 classified parent-PID and DB-dir identity as implementation-packet verification gates.

### Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` / -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` /
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` /

### Searching for an existing `CancelIndexRequest` or cancel response found none in `core/protocol.py`. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Searching for an existing `CancelIndexRequest` or cancel response found none in `core/protocol.py`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for an existing `CancelIndexRequest` or cancel response found none in `core/protocol.py`.

### Searching for close/unload methods in reranker adapters confirmed absence rather than exposing a hidden cleanup hook. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: Searching for close/unload methods in reranker adapters confirmed absence rather than exposing a hidden cleanup hook.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searching for close/unload methods in reranker adapters confirmed absence rather than exposing a hidden cleanup hook.

### SentenceTransformers/Transformers inspection showed model construction surfaces, but not a simple universal close API that adapter cleanup could delegate to. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: SentenceTransformers/Transformers inspection showed model construction surfaces, but not a simple universal close API that adapter cleanup could delegate to.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: SentenceTransformers/Transformers inspection showed model construction surfaces, but not a simple universal close API that adapter cleanup could delegate to.

### System `python3` could not import `cocoindex` or `litellm`; installed API inspection used the mcp-coco-index packet-local `.venv` files instead. -- BLOCKED (iteration 14, 1 attempts)
- What was tried: System `python3` could not import `cocoindex` or `litellm`; installed API inspection used the mcp-coco-index packet-local `.venv` files instead.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: System `python3` could not import `cocoindex` or `litellm`; installed API inspection used the mcp-coco-index packet-local `.venv` files instead.

### The measured `ccc status` / `ccc search` failures are not evidence that the CocoIndex daemon is unreachable. They fail in the Homebrew `@naarang/ccc` Node CLI before any daemon query. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The measured `ccc status` / `ccc search` failures are not evidence that the CocoIndex daemon is unreachable. They fail in the Homebrew `@naarang/ccc` Node CLI before any daemon query.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The measured `ccc status` / `ccc search` failures are not evidence that the CocoIndex daemon is unreachable. They fail in the Homebrew `@naarang/ccc` Node CLI before any daemon query.

### The measurement does not prove monotonic memory leakage during normal search. Swap, pageout, swapout, and compressor-occupied counters are flat across the failed command window. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: The measurement does not prove monotonic memory leakage during normal search. Swap, pageout, swapout, and compressor-occupied counters are flat across the failed command window.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The measurement does not prove monotonic memory leakage during normal search. Swap, pageout, swapout, and compressor-occupied counters are flat across the failed command window.

### Treating `/opt/homebrew/bin/ccc` as the code-index CLI is a dead end for this packet; the crash is a dependency/install problem in a different `ccc` executable. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Treating `/opt/homebrew/bin/ccc` as the code-index CLI is a dead end for this packet; the crash is a dependency/install problem in a different `ccc` executable.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `/opt/homebrew/bin/ccc` as the code-index CLI is a dead end for this packet; the crash is a dependency/install problem in a different `ccc` executable.

### Treating `daemon-and-mcp-bg-index-task-lifecycle` as one undifferentiated implementation change. Daemon registry safety and MCP ThreadPool shutdown have different owners, failure modes, and tests. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Treating `daemon-and-mcp-bg-index-task-lifecycle` as one undifferentiated implementation change. Daemon registry safety and MCP ThreadPool shutdown have different owners, failure modes, and tests.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `daemon-and-mcp-bg-index-task-lifecycle` as one undifferentiated implementation change. Daemon registry safety and MCP ThreadPool shutdown have different owners, failure modes, and tests.

### Treating `EPERM` from `process.kill(pid, 0)` as stale. The current launcher correctly treats it as live/held because permission denial still implies possible process existence. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating `EPERM` from `process.kill(pid, 0)` as stale. The current launcher correctly treats it as live/held because permission denial still implies possible process existence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `EPERM` from `process.kill(pid, 0)` as stale. The current launcher correctly treats it as live/held because permission denial still implies possible process existence.

### Treating `EPERM` from liveness probes as reclaimable stale. The existing launcher policy is correct: permission denial means live/unknown. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating `EPERM` from liveness probes as reclaimable stale. The existing launcher policy is correct: permission denial means live/unknown.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `EPERM` from liveness probes as reclaimable stale. The existing launcher policy is correct: permission denial means live/unknown.

### Treating `RemoveProjectRequest` as a cancel primitive. It lacks request identity, returns only `RemoveProjectResponse(ok=True)`, and currently closes project resources after popping registry maps. -- BLOCKED (iteration 11, 1 attempts)
- What was tried: Treating `RemoveProjectRequest` as a cancel primitive. It lacks request identity, returns only `RemoveProjectResponse(ok=True)`, and currently closes project resources after popping registry maps.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating `RemoveProjectRequest` as a cancel primitive. It lacks request identity, returns only `RemoveProjectResponse(ok=True)`, and currently closes project resources after popping registry maps.

### Treating a healthy sidecar port as owned by the current session. A healthy port proves service availability, not lineage or termination authority. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating a healthy sidecar port as owned by the current session. A healthy port proves service availability, not lineage or termination authority.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a healthy sidecar port as owned by the current session. A healthy port proves service availability, not lineage or termination authority.

### Treating multiple `ccc mcp` children as proof of one CocoIndex daemon leak. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Treating multiple `ccc mcp` children as proof of one CocoIndex daemon leak.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating multiple `ccc mcp` children as proof of one CocoIndex daemon leak.

### Treating multiple `ccc mcp` children as proof of one daemon leak. Prior evidence says they are compatible with multiple MCP host/session registrations. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Treating multiple `ccc mcp` children as proof of one daemon leak. Prior evidence says they are compatible with multiple MCP host/session registrations.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating multiple `ccc mcp` children as proof of one daemon leak. Prior evidence says they are compatible with multiple MCP host/session registrations.

### Treating multiple `ccc mcp` processes as one CocoIndex daemon leak. Iteration 007 already supports host/session multiplicity as the safer interpretation. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Treating multiple `ccc mcp` processes as one CocoIndex daemon leak. Iteration 007 already supports host/session multiplicity as the safer interpretation.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating multiple `ccc mcp` processes as one CocoIndex daemon leak. Iteration 007 already supports host/session multiplicity as the safer interpretation.

### Treating PPID 1 as stale proof. Iteration 012 already established that it proves orphaning, not inactivity or DB/model safety. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Treating PPID 1 as stale proof. Iteration 012 already established that it proves orphaning, not inactivity or DB/model safety.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating PPID 1 as stale proof. Iteration 012 already established that it proves orphaning, not inactivity or DB/model safety.

### Treating PPID 1 as sufficient proof that a code-graph server is stale. It proves orphaning, not inactivity or DB safety. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Treating PPID 1 as sufficient proof that a code-graph server is stale. It proves orphaning, not inactivity or DB safety.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating PPID 1 as sufficient proof that a code-graph server is stale. It proves orphaning, not inactivity or DB safety.

### Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon.

### Using a healthy sidecar port as ownership proof. Health proves availability, not lineage or authority to terminate. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Using a healthy sidecar port as ownership proof. Health proves availability, not lineage or authority to terminate.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using a healthy sidecar port as ownership proof. Health proves availability, not lineage or authority to terminate.

### Using broad `pkill -f` cleanup patterns as process-sweep implementation. Iteration 013 showed they can kill unrelated sessions and violate current-session safety. -- BLOCKED (iteration 15, 1 attempts)
- What was tried: Using broad `pkill -f` cleanup patterns as process-sweep implementation. Iteration 013 showed they can kill unrelated sessions and violate current-session safety.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using broad `pkill -f` cleanup patterns as process-sweep implementation. Iteration 013 showed they can kill unrelated sessions and violate current-session safety.

### Using broad `pkill -f` or `pkill -9 -f` patterns as the process-sweep implementation. They are too coarse for multi-session operator environments. -- BLOCKED (iteration 13, 1 attempts)
- What was tried: Using broad `pkill -f` or `pkill -9 -f` patterns as the process-sweep implementation. They are too coarse for multi-session operator environments.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using broad `pkill -f` or `pkill -9 -f` patterns as the process-sweep implementation. They are too coarse for multi-session operator environments.

### Using the existing launcher duplicate-owner tests as complete coverage. They cover basic live/dead PID and override paths, but not orphan child/server survival or symlink/effective-DB identity drift. -- BLOCKED (iteration 12, 1 attempts)
- What was tried: Using the existing launcher duplicate-owner tests as complete coverage. They cover basic live/dead PID and override paths, but not orphan child/server survival or symlink/effective-DB identity drift.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the existing launcher duplicate-owner tests as complete coverage. They cover basic live/dead PID and override paths, but not orphan child/server survival or symlink/effective-DB identity drift.

### Using the short before/after VM snapshot as a leak detector is not valid because the two measured commands exit nonzero before normal daemon work begins. -- BLOCKED (iteration 7, 1 attempts)
- What was tried: Using the short before/after VM snapshot as a leak detector is not valid because the two measured commands exit nonzero before normal daemon work begins.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using the short before/after VM snapshot as a leak detector is not valid because the two measured commands exit nonzero before normal daemon work begins.

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open `remove-project-cancel-safety` as the next implementation packet. Its first acceptance gate should prove active explicit, load-time, and queued index work is tracked, cancelled, bounded-awaited, and unable to race registry removal or `Project.close()`.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
User reported prior process buildup from AI sessions using CLI skills to orchestrate other CLI sessions. User explicitly overrode the swap preflight blocker for this run.

## 13. RESEARCH BOUNDARIES
- Max iterations: 15
- Iterations 001-005: cli-claude-code Opus profile
- Iterations 006-010: cli-codex gpt-5.5 xhigh fast
- Iterations 011-015: cli-codex gpt-5.5 xhigh fast continuation on final recommendations
- Research artifacts stay under this packet's research/ folder.
