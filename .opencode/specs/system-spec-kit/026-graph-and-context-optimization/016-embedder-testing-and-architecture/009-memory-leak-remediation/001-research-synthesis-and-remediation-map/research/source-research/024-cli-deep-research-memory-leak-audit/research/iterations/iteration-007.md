## Focus

Cross-validate the native runtime measurement log against F-001..F-026, then refine severity and remediation ordering. The measurement log is unsandboxed process-inventory evidence for this pass, not a successful normal-search growth profile, because the measured `ccc status` and `ccc search` commands exited before contacting the CocoIndex daemon.

## Actions Taken

- Read the current deep-research config, strategy, state log, iteration 005/006 reports, iter-005/iter-006 deltas, and the iteration 007 native runtime measurement log first.
- Skimmed the full F-001..F-026 registry from iter-001..iter-006 deltas to preserve stable severity lineage.
- Inspected `.opencode/bin/mk-code-index-launcher.cjs` only to classify the multiple code-graph launcher/server processes visible in the runtime log.
- Did not run new runtime commands, dispatch sub-agents, invoke AI CLIs, or edit target skill source files.

## Sources Consulted

- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/deep-research-config.json:2`, `:7`, `:31-43`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/deep-research-strategy.md:11-17`, `:21-25`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/deep-research-state.jsonl:4-8`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/deltas/iter-001.jsonl:2-11`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/deltas/iter-003.jsonl:2-4`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-005.md:64-168`, `:169-180`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/iterations/iteration-006.md:40-56`, `:58-70`, `:72-89`, `:117-123`
- `specs/system-spec-kit/026-graph-and-context-optimization/016-embedder-testing-and-architecture/009-memory-leak-remediation/001-research-synthesis-and-remediation-map/research/source-research/024-cli-deep-research-memory-leak-audit/research/logs/iteration-007-runtime-measurement.json:18`, `:35`, `:49`, `:62`, `:92-95`, `:107-110`, `:128`, `:145`, `:159`, `:172`
- `.opencode/bin/mk-code-index-launcher.cjs:183-194`, `:221-231`, `:372-383`, `:402-423`, `:471-498`

## Findings

New IDs continue from F-026.

### M-007-001 - Native process inventory and RSS bounds

The measurement log captured the same process inventory before and after the failed command window. The after snapshot at `iteration-007-runtime-measurement.json:145` gives these resident-set bounds:

- `ccc mcp`: 5 processes, RSS range 58,912-246,208 KiB, total 698,176 KiB (~681.8 MiB). Parents differ (`47859`, `62584`, `925`, `68429`, `62410`), which points to MCP host/session multiplicity rather than one daemon duplicating itself.
- `ccc run-daemon`: 1 detached process, PPID 1, RSS 498,816 KiB (~487.1 MiB), elapsed 18:44:10. This strongly supports F-004's "outlives every CLI" lifecycle framing.
- Rerank sidecar: 1 detached `uvicorn scripts.rerank_sidecar:app` process, PPID 1, RSS 402,352 KiB (~392.9 MiB), elapsed 31:33. This supports F-003's detached sidecar lifecycle concern, but does not prove growth.
- Code-graph launchers: 5 `node .opencode/bin/mk-code-index-launcher.cjs` processes, RSS range 35,392-48,784 KiB, total 200,240 KiB (~195.5 MiB).
- Code-graph servers: 3 `system-code-graph/mcp_server/dist/index.js` node processes, RSS values 32, 45,328, and 79,664 KiB, total 125,024 KiB (~122.1 MiB). One has PPID 1 and elapsed 01-17:17:49.
- Lingering CLI: 1 `claude -p` iteration-004 process, RSS 516,176 KiB (~504.1 MiB), elapsed 06:33, even though state log line 6 marks iteration 4 complete.
- Combined listed RSS after snapshot: 2,440,784 KiB (~2.33 GiB). This is a high process-inventory floor, not a leak-growth slope.

Global memory pressure stayed flat during the measured command window: swap used was unchanged at 40,812.94 MiB before and after (`iteration-007-runtime-measurement.json:49`, `:159`), pageouts stayed at 437,972, swapins at 260,068,204, swapouts at 278,129,527, and compressor-occupied pages stayed at 218,683 (`:62`, `:172`). Because the window is short and both commands failed, this only rules out command-window growth from those failed invocations.

### F-027 [P1 lifecycle / P2 memory] - Multiple code-graph launcher/server processes coexist despite the launcher's strict single-writer lease path

- Owner: `system-code-graph` launcher and MCP host lifecycle.
- Process kind: `node` launcher plus `node` MCP server children.
- Evidence:
  - Runtime log after snapshot shows five launchers and three code-graph server processes, including an orphaned server with PPID 1 and 32 KiB RSS (`iteration-007-runtime-measurement.json:128`, `:145`).
  - The launcher is designed to spawn exactly one server child per successful launcher via `spawn(process.execPath, [server], { stdio: 'inherit' })` at `.opencode/bin/mk-code-index-launcher.cjs:372-383`.
  - Strict single-writer mode checks an existing lease and should bridge/report the holder instead of starting another server at `.opencode/bin/mk-code-index-launcher.cjs:471-498`.
  - Lease liveness treats `EPERM` as a live process, which is correct for sandboxed visibility but also means stale-but-visible holders can block clean replacement (`.opencode/bin/mk-code-index-launcher.cjs:183-194`).
  - Signal handlers forward SIGINT/SIGTERM/SIGHUP/SIGQUIT to the child and SIGKILL after 5 seconds (`.opencode/bin/mk-code-index-launcher.cjs:402-423`), yet the measurement still shows a PPID 1 code-graph server.
- Cleanup boundary: launcher/host lifecycle is not fully coalesced in the measured runtime. The memory footprint is modest, so this is P2 as a pure RSS issue. It is P1 as a lifecycle/DB-safety issue because multiple code-graph MCP servers can contend for the same graph database if they share `SPECKIT_CODE_GRAPH_DB_DIR`.
- Candidate remediation packet: `<NNN>-code-graph-launcher-single-owner-and-orphan-reap`.

### Severity refinements from measurement

- F-022/F-026 stay P1. The measurement does not exercise `RemoveProjectRequest` during active indexing, but iteration 005 shows the internal race (`iteration-005.md:64-168`) and iteration 006 shows `ManagedConnection.close()` is not safe under concurrent write (`iteration-006.md:58-70`). Runtime RSS is not needed for that severity.
- F-019/F-020 stay P1. The failed `ccc` commands did not test cancellation, but prior evidence already establishes blocking RPC with no cancel protocol. Keep them behind F-022 because a cancel protocol needs a safe daemon-internal cancel primitive first.
- F-005/F-010/F-017/F-018 stay P1 as a task-lifecycle cluster. Multiple `ccc mcp` children and one lingering CLI process make the process-hosting context more concerning, but the measurement does not show an active `_bg_index` leak during this window.
- F-003 weakens from P0 memory escalation to P1 lifecycle unless a later successful sidecar/fallback run proves growth. The sidecar is real, detached, PPID 1, and ~393 MiB RSS; that supports cleanup priority, not P0 leak slope.
- F-001/F-002 should be treated through the later F-023/F-024 refinements for remediation ordering. The measurement does not show local reranker model residency or adapter growth, so it does not support P0-first ordering. Keep adapter lifecycle as P2 unless a successful search/fallback measurement shows >GB daemon RSS growth.
- F-004 is strongly supported as P1 lifecycle: the daemon is detached, PPID 1, ~487 MiB RSS, and 18+ hours old in the measured snapshot.
- F-006/F-013 gain lifecycle weight through F-027. The measured memory is modest, but multiple code-graph launchers/servers and an orphaned server make launcher/close discipline a higher remediation priority than F-007/F-008.

## Questions Answered

- **What active process inventory and RSS bounds does the measurement provide?** It shows 5 `ccc mcp` processes totaling ~681.8 MiB, 1 `ccc run-daemon` at ~487.1 MiB, 1 rerank sidecar at ~392.9 MiB, 5 code-graph launchers totaling ~195.5 MiB, 3 code-graph server processes totaling ~122.1 MiB, and 1 lingering `claude -p` at ~504.1 MiB. Combined listed RSS is ~2.33 GiB.
- **Does the measurement support or weaken P0/P1/P2 severities?** It supports detached-process P1 severities (F-003/F-004 and the code-graph lifecycle cluster), supports correctness P1s by not contradicting them (F-019/F-020/F-022/F-026), and weakens P0 memory-first ordering for F-001/F-002/F-003 because it shows resident processes but no successful-search growth slope.
- **Do multiple `ccc mcp` processes point to a separate launcher/host issue or expected per registered MCP server/session?** Both, with the second explanation first. Multiple stdio MCP child processes are expected when multiple hosts/sessions have the same MCP server registered. The measured parent spread and stable before/after count point to host/session lifecycle cleanup as the issue, not one CocoIndex daemon spawning duplicate MCP children.
- **Why did native `ccc status` / `ccc search` exit nonzero despite process visibility?** The shell-resolved `ccc` is `/opt/homebrew/bin/ccc` (`iteration-007-runtime-measurement.json:69-80`), and both commands crash while loading `@naarang/ccc`'s missing Sentry CPU profiler native module (`:92-95`, `:107-110`). The visible `.venv/bin/ccc mcp` and `.venv/bin/ccc run-daemon` processes are separate Python code-index processes. So the nonzero exits do not prove the daemon is absent or unhealthy; they only make this log inventory evidence rather than normal `ccc search` behavior evidence.
- **What remediation order follows from the measurement?** Put correctness/cancel safety first, then host/launcher lifecycle, then resident-memory lifecycle. The measurement makes process reaping and launcher single-owner guarantees more urgent, but it does not justify moving adapter model cleanup ahead of daemon correctness.

## Questions Remaining

- Which parent processes own PIDs `925`, `62584`, `68429`, and `62410`, and are they live CLI sessions, MCP hosts, or stale supervisors?
- Do the three code-graph server processes share the same `SPECKIT_CODE_GRAPH_DB_DIR`, or are they from distinct workspaces/env overrides?
- Does a successful Python `.venv/bin/ccc search` path, run outside the Homebrew `ccc` collision, increase daemon RSS or sidecar RSS over repeated searches?
- Does sidecar 5xx fallback load the bundled CrossEncoder into the daemon in this operator environment, and what RSS delta does that produce?

## Ruled Out

- The measured `ccc status` / `ccc search` failures are not evidence that the CocoIndex daemon is unreachable. They fail in the Homebrew `@naarang/ccc` Node CLI before any daemon query.
- The measurement does not prove monotonic memory leakage during normal search. Swap, pageout, swapout, and compressor-occupied counters are flat across the failed command window.
- Multiple `ccc mcp` processes alone are not proof of an in-daemon leak. They are compatible with multiple MCP host/session registrations.

## Dead Ends

- Treating `/opt/homebrew/bin/ccc` as the code-index CLI is a dead end for this packet; the crash is a dependency/install problem in a different `ccc` executable.
- Escalating F-023/F-024 from P2 to P1 based on this log would overread the data. The log has process inventory, but no successful query/fallback growth sample.
- Using the short before/after VM snapshot as a leak detector is not valid because the two measured commands exit nonzero before normal daemon work begins.

## Reflection

- What worked and why: The native log turned iteration 006's denied `ps`/`pgrep` gap into concrete process inventory, RSS bounds, and parent/elapsed-time evidence.
- What did not work and why: The log still did not measure successful normal-search behavior because the shell-resolved Homebrew `ccc` crashes on a missing native Sentry profiler module before contacting the code-index daemon.
- What I would do differently: Resolve the intended code-index CLI explicitly before measurement, then capture parent process names and DB-dir environment for each launcher/server PID in the same pass.

## Next Focus

Use iteration 008 to synthesize the remediation packets and write ticket-ready scopes. Prioritize correctness and process lifecycle over more static discovery unless a clean code-index CLI measurement can be run without the Homebrew `ccc` collision.

## Recommended Next Focus

Produce packet drafts in this order:

1. `<NNN>-remove-project-cancel-safety` - F-022 plus F-026. P1 correctness. Add daemon-internal task lookup, cancel, bounded await, and only then project close/pop. This is the prerequisite for every cancel/close remediation.
2. `<NNN>-daemon-protocol-cancel-index-surface` - F-019/F-020/F-021. P1 lifecycle/correctness. Depends on the safe internal cancel primitive from packet 1.
3. `<NNN>-daemon-and-mcp-bg-index-task-lifecycle` - F-005/F-010/F-017/F-018. P1 lifecycle. Depends on packet 2 so caller-side task discipline has a real daemon cancel surface.
4. `<NNN>-code-graph-launcher-single-owner-and-orphan-reap` - F-027 with F-006/F-013 context. P1 lifecycle, P2 memory. Verify lease DB-dir identity, bridge behavior, stale PPID 1 children, and shutdown `closeDb()`.
5. `<NNN>-mcp-host-session-process-sweep` - measured multiple `ccc mcp` children plus lingering `claude -p`. P1 orchestration hygiene. Depends on per-server signal/cleanup confidence so sweeping hosts does not corrupt active work.
6. `<NNN>-rerank-sidecar-lifecycle` - F-003. P1 lifecycle. Add parent-exit/reuse/reap contract and health metadata; keep P0 only if later measurement proves runaway sidecar or fallback growth.
7. `<NNN>-project-close-full-release` - F-011/F-025 plus the close half of F-026. P2 independently, P1 when paired with F-022. Depends on packet 1.
8. `<NNN>-registry-embedder-cache-lifecycle` - F-012/F-014/F-016. P1 deterministic retained embedder state on config changes.
9. `<NNN>-adapter-lifecycle-management` - F-001/F-002 as refined by F-023/F-024/F-015. P2 until successful runtime measurement proves >GB growth in this environment.
10. `<NNN>-code-graph-read-path-friction` - F-007/F-008. P2 follow-up after launcher single-owner safety.
