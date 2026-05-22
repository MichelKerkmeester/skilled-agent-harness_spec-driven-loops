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
Complete ten iterations or stop only if executor failures prevent artifact creation. User explicitly overrode swap preflight as a blocker for this run.

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

### A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: A separate F-004 daemon-reset packet. Fold it into `mcp-host-session-process-sweep`.

### Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers. -- BLOCKED (iteration 10, 1 attempts)
- What was tried: Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Blocking final synthesis on new runtime measurement. Iteration 009 already separated verification gaps from synthesis blockers.

### Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence. -- BLOCKED (iteration 6, 1 attempts)
- What was tried: Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Both CLI paths failed before daemon contact, so the `vm_stat` snapshots are useful only as negative evidence about the failed attempts, not as daemon behavior evidence.

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

### Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Merging `remove-project-cancel-safety` into protocol cancel. The daemon-internal race exists without any protocol change and must be fixed first.

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

### No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No new runtime measurement was attempted because iteration 008 was scoped to remediation packet synthesis.

### No packet directories were created because the user explicitly requested drafts only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No packet directories were created because the user explicitly requested drafts only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No packet directories were created because the user explicitly requested drafts only.

### No target source implementation was attempted because the packet is research-only. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: No target source implementation was attempted because the packet is research-only.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No target source implementation was attempted because the packet is research-only.

### Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence. -- BLOCKED (iteration 9, 1 attempts)
- What was tried: Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Reordering resident-memory optimization ahead of correctness and lifecycle cleanup without new successful-search evidence.

### Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Retrying sandboxed `ps`, `pgrep`, or `sysctl vm.swapusage` from this executor; iteration 006 already established those are blocked here.

### Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` / -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` /
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Searched for module-level `_CLIENT_CACHE` / `@lru_cache` / `httpx` /

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

### Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon. -- BLOCKED (iteration 8, 1 attempts)
- What was tried: Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Using `/opt/homebrew/bin/ccc` failures as daemon health evidence. Iteration 007 shows that executable crashes before contacting the Python code-index daemon.

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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Open implementation packets in the final remediation order, starting with `remove-project-cancel-safety`, and run each packet's verification gate before claiming completion.

<!-- /ANCHOR:next-focus -->

<!-- MACHINE-OWNED: END -->
## 12. KNOWN CONTEXT
User reported prior process buildup from AI sessions using CLI skills to orchestrate other CLI sessions. User explicitly overrode the swap preflight blocker for this run.

## 13. RESEARCH BOUNDARIES
- Max iterations: 10
- Iterations 001-005: cli-claude-code Opus profile
- Iterations 006-010: cli-codex gpt-5.5 xhigh fast
- Research artifacts stay under this packet's research/ folder.
