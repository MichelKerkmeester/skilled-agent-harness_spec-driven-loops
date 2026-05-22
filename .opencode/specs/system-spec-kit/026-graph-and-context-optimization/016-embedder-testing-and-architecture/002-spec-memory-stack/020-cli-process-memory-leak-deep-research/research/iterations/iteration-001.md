# Iteration 001: Inventory process-spawn entrypoints and background execution patterns

## Focus
Catalogue every process-spawn entrypoint and background-execution pattern reachable from `.opencode/skills/system-spec-kit` and the related `cli-X` deep-flow orchestration: shell scripts, Node scripts, Node `child_process` / `fork` callsites, daemon and sidecar lifecycles, generated `dist` scripts, command-asset shell heredocs, hook shims, and the `commands/spec_kit/*` YAML dispatch branches that materialise child processes per iteration.

## Findings

### A. Deep-loop executor dispatch (audited spawnSync path)

1. `runAuditedExecutorCommand` uses `spawnSync` with a node-level `timeout = max(1000, timeoutSeconds*1000 - 1000)` and an unspecified `killSignal` (Node default `SIGTERM`). It writes `stdout`/`stderr` straight to the host process and translates `TimeoutError`/`ETIMEDOUT`/non-zero `status`/`signal` into typed `dispatch_failure` JSONL events, but always returns exit code `0` so the YAML's `post_dispatch_validate` step must surface the failure separately. No `maxBuffer` override, no process-group detachment, no `SIGKILL` escalation if the child ignores `SIGTERM`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:169-227]
2. The same wrapper is the only caller for `cli-codex`, `cli-gemini`, and `cli-claude-code` branches in **deep-research** dispatch — `if_cli_codex` (line 584-629), `if_cli_gemini` (line 630-674), `if_cli_claude_code` (line 675-723). All three import `runAuditedExecutorCommand` and call `process.exit(...)` from a `node --experimental-strip-types --input-type=module` heredoc. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:586-715]
3. `EXECUTOR_KIND_FLAG_SUPPORT` defines per-kind flag whitelists for `cli-codex`, `cli-gemini`, `cli-claude-code`, `cli-opencode`, `cli-devin`. `timeoutSeconds` defaults to `900` for every kind via `executorConfigSchema`. `cli-opencode` and `cli-devin` are explicitly modelled but neither flows through the audited spawnSync wrapper. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:21-49]

### B. Deep-loop executor dispatch (raw-shell heredoc path — unaudited)

4. **deep-research `if_cli_opencode`** is a raw bash heredoc (`opencode run ... "$(cat prompt.md)" </dev/null`) with `working_directory` and `timeout_seconds` carried by the YAML runtime. It is NOT routed through `runAuditedExecutorCommand`, so a stdin-stall / hang surfaces only via the YAML's external timeout policy and no `dispatch_failure` JSONL event is emitted. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:733-757]
5. **deep-research `if_cli_devin`** is a raw bash heredoc wrapped in `gtimeout 900`. Exit 124 surfaces as `ITER_OUTCOME=timeout` on stderr, with stdout and stderr captured to per-iter temp logs under `{state_paths.prompt_dir}`. The branch reformats `<repo-root>` / `<packet-root>` placeholders into a per-iter agent-config json file `{state_paths.prompt_dir}/agent-config-iter-{N}.json` (written, never deleted by the workflow). [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:758-816]
6. **deep-review** dispatches `cli-codex`, `cli-gemini`, `cli-claude-code` AND `cli-opencode` via raw shell — NONE of these branches use `runAuditedExecutorCommand`. Only `if_cli_copilot` uses `spawnSync` directly (with `timeout: timeoutSeconds*1000` and `stdio: 'inherit'`, line 746-750). Result: a deep-review iteration timeout under codex/gemini/claude/opencode produces no typed `dispatch_failure` event — the validator must infer failure from `iteration_file_missing` / `jsonl_not_appended`. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:688-822]
7. `buildCopilotPromptArg` from `executor-config.ts` is invoked inside the copilot heredoc to wrap large prompts with a `TARGET AUTHORITY` preamble, replacing the original prompt file on disk before dispatch. The replaced file persists beyond the iteration. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:706-744]

### C. Loop-level teardown is absent

8. The YAML loop walks `step_dispatch_iteration → post_dispatch_validate → step_reduce_state → step_graph_upsert → step_evaluate_results → step_generate_dashboard → step_update_tracking → step_loop_decision (goto step_read_state)` with NO intermediate teardown step. There is no `pkill`, no `SIGKILL` of any grandchild, no embedder-sidecar reap, no idle pause. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:539-918]
9. The advisory file lock at `{state_paths.lock_file}` has `on_halt` / `on_cancel` / `on_workflow_exit` release hooks, but those handle only the lock file — not in-flight children, not sidecars, not zombie codex/devin/opencode processes. [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:179-195]
10. The `cli-opencode` SKILL.md and `cli-devin` SKILL.md explicitly document a *manual* single-dispatch discipline: "wait for the dispatched agent's work to return, verify outputs exist, then SIGKILL the dispatcher process + any orphan children (`pkill -9 -f "opencode run"` / `pkill -9 -f "devin --print"`, plus `pkill -9 -f "ccc search"` / `gtimeout` / `rerank_sidecar:app` cleanup)". This is enforced by the calling AI / operator, NOT by the YAML runtime — meaning batch-looping iterations with no host involvement leaves spawned grandchildren intact between iterations. [SOURCE: .opencode/skills/cli-opencode/SKILL.md:296]; [SOURCE: .opencode/skills/cli-devin/SKILL.md:372]
11. `deep-research/references/loop_protocol.md:228` calls out the gap explicitly: "Cross-CLI delegation (a running executor invoking other CLIs via its shell) is documented design intent. Runtime recursion detection is out of scope; see the SKILL.md Cross-CLI Delegation subsection." There is a single static marker-scan guard (`step_marker_scan`, line 523-538 of the dispatch YAML) that reads the previous iteration's rendered prompt and aborts only if its first line is exactly `DEEP-REVIEW` / `DEEP-RESEARCH` / `CODE-REVIEW` — a narrow textual filter, not a process-level guard. [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:228]; [SOURCE: .opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:523-538]

### D. Embedder sidecar lifecycle

12. `SidecarClient.ensureWorker()` `fork()`s `sidecar-worker.ts` (or compiled `.js`) with stdio `['pipe','pipe','pipe','ipc']`. The child's stdout, stderr and exit listeners are wired before any request is sent. `child.kill('SIGTERM')` is the only termination primitive — `restartWorker()` and `killWorker()` both use it, never escalating to `SIGKILL`. `shutdown()` first sends a `{type:'shutdown'}` JSON request and only SIGTERMs if that throws. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:250-302]
13. Idle eviction uses `setTimeout(this.killWorker, this.idleMs)` (default 300 s, override via `SPECKIT_EMBEDDER_SIDECAR_IDLE_MS`) with `.unref?.()`. If the timer fires while `this.pending.size > 0`, it reschedules and never reaps. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:419-429]
14. The worker exits via `process.exit(0)` on `reader.on('close')` and on receiving `{type:'shutdown'}` — there is no `SIGTERM` / `SIGINT` handler. If embedding work is CPU-bound on the main thread (e.g. an in-process sentence-transformers call), `SIGTERM` is queued until the JS event loop yields, which can keep the process alive past parent shutdown. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:149-195]

### E. Spec-memory launcher lease + IPC bridge

15. The spec-memory launcher (`.opencode/bin/mk-spec-memory-launcher.cjs`, owner of the spawned `context-server.js`) is documented at `system-spec-kit/references/launcher-lease.md`: it reads `mcp_server/database/.mk-spec-memory-launcher.json`, probes the recorded PID with `process.kill(pid, 0)`, and either prints `LEASE_HELD_BY:<pid>` and exits 0 (lease held), or marks `staleReclaimed: true` and continues. PID-reuse races are explicitly preserved as "treat as held" — manual remediation required. The strict-single-writer guard can be disabled with `MK_SPEC_MEMORY_STRICT_SINGLE_WRITER=0`. [SOURCE: .opencode/skills/system-spec-kit/references/launcher-lease.md:1-83]
16. `socket-server.ts` accepts secondary MCP clients over the UNIX socket at `daemon-ipc.sock`. On `EADDRINUSE` it unconditionally `fs.unlinkSync(socketPath)` and retries `listen()` — without any liveness probe of an existing owner before deletion. Two MCP-server instances starting concurrently can each remove the other's socket. The lease-level guard against duplicate owners is the launcher PID file (point 15), NOT this code path. Default `maxClients = parseInt(SPECKIT_MAX_SECONDARY_CLIENTS) ?? 8`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:95-202]

### F. Hook-shim spawn surfaces (no timeout)

17. Four of the five hook shims under `mcp_server/hooks/{claude,codex,gemini,devin}/user-prompt-submit.ts` and `mcp_server/hooks/codex/prompt-wrapper.ts` use the same pattern: `spawnSync(process.execPath, [TARGET, ...process.argv.slice(2)], { input: readFileSync(0), encoding: 'utf8', env: process.env })`. NONE of them pass a `timeout` option, so if the downstream advisor script hangs (cf. the documented stale-daemon-lease scenario at `feedback_skill_advisor_stale_daemon_lease_recovery.md`), the hook hangs the parent CLI's prompt-submit indefinitely. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:10-15]; [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:10]; [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:10]; [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:10]; [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts:10]
18. The only hook with a timeout is `claude/session-stop.ts`: `spawnSync(process.execPath, [scriptPath, '--json', JSON.stringify(payload)], { timeout: AUTOSAVE_TIMEOUT_MS=4000, stdio:['ignore','pipe','pipe'], maxBuffer: 1024*1024 })`. The `generate-context.js` autosave is bounded at 4 s; a slow embedder backend can silently miss the autosave window without surfacing the failure to the caller. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:35]; [SOURCE: .opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:129-150]

### G. Matrix runner and stress harness

19. `mcp_server/matrix_runners/adapter-common.ts:runCliAdapter` uses async `spawn` with `setTimeout(() => child.kill('SIGKILL'), timeoutMs)`. SIGKILL is correct for the immediate child but does NOT reap grandchildren — codex/devin/opencode all spawn their own sub-processes (e.g. MCP daemons, sandbox helpers) which become orphans unless the parent is in its own process group. The default `stdio: ['pipe','pipe','pipe']` keeps file descriptors open and no `detached: true` is used. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:104-185]
20. `mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs:661-738` spawns the spec-memory launcher (`process.execPath .opencode/bin/mk-spec-memory-launcher.cjs`) and the cocoindex `ccc mcp` daemon as long-lived MCP transports via `StdioClientTransport`. Cleanup in `finally`: `Promise.all(connections.map(c => c.client?.close() ?? noop))` plus stderr-stream `end()`. There is NO SIGKILL fallback if `client.close()` hangs, no PID-tracking for explicit `process.kill`, and the daemon stderr is capped at 200 KB but persisted to `_sandbox/24--local-llm-query-intelligence/evidence/run-2026-05-14-shared-daemon.*.stderr.log`. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs:661-738]

### H. CocoIndex daemon probe

21. `mcp_server/lib/cocoindex/daemon-probe.ts` is a read-only liveness probe — `process.kill(pid, 0)` against `~/.cocoindex_code/daemon.pid`, with a 30 s in-process cache. It can return `degraded` or `reachable` but never starts, stops, or kills any daemon — daemon lifecycle is owned outside `system-spec-kit`. Stale PID-file is downgraded silently to `unreachable`; PID-reuse hijack is not handled here. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:52-141]

### I. Maintenance and test-runner spawns

22. `mcp_server/scripts/run-tests.mjs:7-25` uses `spawnSync('vitest'|'npm', args, { stdio:'inherit', shell:win32 })` with NO `timeout`. A hung Vitest worker keeps the host shell blocked until interrupted; no orphan-reap on the parent side. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/run-tests.mjs:7-25]
23. `mcp_server/scripts/repair-graph-metadata.mjs` imports `execFileSync` (line 3) — git-based metadata repair. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs:3]
24. Session-extractor TS scripts under `scripts/extractors/{session-extractor,git-context-extractor,collect-session-data}.ts` consistently pass `timeout: 5000` to `execSync('git ...')` — short, bounded, no leak surface. [SOURCE: .opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts:99-103]

### J. Schema and audit gap surfaces

25. `runAuditedExecutorCommand` emits `dispatch_failure` only for the typed reasons `timeout|crash|missing_output|invalid_output|other`. Buffer overflow (`spawnSync` enforces a default 1 MB stdout/stderr maxBuffer when `maxBuffer` is unspecified) is not explicitly mapped — it surfaces as `error.code === 'ERR_CHILD_PROCESS_STDIO_MAXBUFFER'` and hits the generic `crash` branch. A noisy codex/devin iteration that prints >1 MB in stdout therefore looks like a crash, not a buffer overrun, in the JSONL audit. [SOURCE: .opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:131-153]; [INFERENCE: Node's documented spawnSync default maxBuffer applies when caller does not override; the code path supplies no override.]

## Ruled Out
- Searching for orchestrator-side process-group / `setsid` usage inside `system-spec-kit` produced zero matches in scripts or YAML — there is no `nohup`, `setsid`, `disown`, or trailing `&` background-fork in the spec-kit shell scripts; this confirms the cli-X dispatch surface is fully synchronous from the YAML runtime's perspective and the orphan-process question reduces to "what happens to grandchildren when the immediate child is killed." (`Grep` `nohup|setsid|disown` under `scripts/` returned no matches.) [SOURCE: .opencode/skills/system-spec-kit/scripts]
- The deep-research / deep-review LEAF agents are constrained by HARD BLOCK invariants to refuse sub-agent dispatch (`Never dispatch sub-agents and never use the Task tool`) — so the per-iter agent itself is not a multiplier of process spawn surface; the multiplier lives entirely in the YAML's executor branches. [SOURCE: .opencode/agents/deep-research.md:37-49]

## Dead Ends
- I did not chase the launcher binary (`.opencode/bin/mk-spec-memory-launcher.cjs`) itself in iteration 001 because it lives outside the target path; the documented behavior in `references/launcher-lease.md` is the in-scope surface. Iteration 002 should pull the binary directly to verify the documented lease semantics against the actual source.
- Skill-graph daemon (referenced in memory `feedback_skill_advisor_stale_daemon_lease_recovery.md`) is owned by `system-skill-advisor`, not in scope for iteration 001 but is the closest sibling pattern to the launcher-lease design — worth a comparative pass in a later iteration to confirm whether the same recovery gap exists for spec-memory.

## Edge Cases
- Ambiguous input: the iteration prompt names "shell scripts" but most YAML dispatch heredocs are bash-via-YAML-runtime, not separate `.sh` files; I treated those as in-scope since they materialize child processes per iteration.
- Contradictory evidence: `loop_protocol.md` says cli-claude-code, cli-gemini, cli-codex dispatch is "all branches share … 3. Executor audit append via `appendExecutorAuditToLastRecord`" — but the live `spec_kit_deep-review_auto.yaml` branches for those kinds run raw shell, not the audited spawnSync wrapper. The protocol doc reflects the deep-research path; deep-review diverged. Flag for follow-on documentation reconciliation. [SOURCE: .opencode/skills/deep-research/references/loop_protocol.md:221-226]
- Missing dependencies: none — every cited file is present at the cited line.
- Partial success: I scanned only top-level spawn callsites; per-iter recovery-of-recovery scenarios (stuck_recovery triggered after dispatch_failure) and the reducer's `reduce-state.cjs` are not yet inspected for process side-effects.

## Sources Consulted
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-audit.ts:1-254`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/executor-config.ts:1-207`
- `.opencode/skills/system-spec-kit/mcp_server/lib/deep-loop/post-dispatch-validate.ts:1-475`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-client.ts:1-437`
- `.opencode/skills/system-spec-kit/mcp_server/lib/embedders/sidecar-worker.ts:149-195`
- `.opencode/skills/system-spec-kit/mcp_server/lib/ipc/socket-server.ts:1-216`
- `.opencode/skills/system-spec-kit/mcp_server/lib/cocoindex/daemon-probe.ts:1-174`
- `.opencode/skills/system-spec-kit/mcp_server/matrix_runners/adapter-common.ts:1-185`
- `.opencode/skills/system-spec-kit/mcp_server/stress_test/substrate/run-substrate-stress-harness.mjs:1-746`
- `.opencode/skills/system-spec-kit/mcp_server/scripts/run-tests.mjs:1-26`
- `.opencode/skills/system-spec-kit/mcp_server/scripts/repair-graph-metadata.mjs:1-30`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/user-prompt-submit.ts:1-22`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/claude/session-stop.ts:35-151`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/user-prompt-submit.ts:1-22`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/prompt-wrapper.ts:1-22`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/codex/setup.ts:1-67`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/gemini/user-prompt-submit.ts:1-22`
- `.opencode/skills/system-spec-kit/mcp_server/hooks/devin/user-prompt-submit.ts:1-22`
- `.opencode/skills/system-spec-kit/scripts/extractors/session-extractor.ts:99-103`
- `.opencode/skills/system-spec-kit/scripts/spec/create.sh:1-90`
- `.opencode/skills/system-spec-kit/references/launcher-lease.md:1-83`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-research_auto.yaml:120-918`
- `.opencode/commands/spec_kit/assets/spec_kit_deep-review_auto.yaml:670-870`
- `.opencode/commands/spec_kit/deep-research.md:100-205`
- `.opencode/skills/cli-opencode/SKILL.md:280-330`
- `.opencode/skills/cli-devin/SKILL.md:360-415`
- `.opencode/skills/deep-research/references/loop_protocol.md:160-232`
- `.opencode/agents/deep-research.md:1-100`

## Assessment
- New information ratio: 0.85
- Questions addressed:
  - "Which system-spec-kit command, MCP, or memory paths can spawn long-lived child processes without cleanup?"
  - "Which deep-research, deep-review, council, or cli-X workflows can produce nested CLI process storms?"
  - "Where are self-invocation guards, timeout handling, signal handling, stale-lock handling, and cleanup traps missing or inconsistent?"
  - "Which sidecars or helpers are expected daemons versus unexpected leftovers after an iteration?"
- Questions answered (partial answers, ready for iteration-002 deepening):
  - Inventoried 25 distinct spawn / sidecar / hook entrypoints with explicit citations.
  - Documented the deep-research vs deep-review audit-wrapper divergence as the highest-priority inconsistency.
  - Documented hook-shim timeout gap (4 of 5 hooks unbounded).
  - Documented the embedder sidecar's SIGTERM-only termination without SIGKILL escalation, plus the idle timer's `.unref()` behavior.
  - Documented the loop's absence of inter-iteration process cleanup and the manual `pkill` discipline that the cli-X SKILL.md rules push onto the calling AI.

## Reflection
- What worked and why: Anchoring the inventory on `child_process` / `spawn` / `fork` keyword grep, then triaging by file path tier (mcp_server/lib > scripts > command assets > hooks > tests). The keyword scan returned 146 files but the test-only and unit-test callsites filtered out cleanly once I excluded `tests/` and the `node_modules` glob, leaving ~20 production-relevant callsites that map back to the four-layer architecture (audited dispatcher, raw-shell dispatcher, sidecar, hook).
- What did not work and why: The initial single grep across the whole directory tree returned a lot of test-fixture noise. Switching to per-directory targeted greps (`mcp_server/lib`, `mcp_server/hooks`, `commands/spec_kit`) collapsed the search to a tractable shape.
- What I would do differently: Iteration 002 should diff the deep-research and deep-review YAML asset families side-by-side to enumerate every place the audited-wrapper invariant breaks, and pull the actual `.opencode/bin/mk-spec-memory-launcher.cjs` source to confirm the lease-recovery code matches `references/launcher-lease.md`. It should also inspect the YAML runtime implementation (whatever consumes `command:` and `timeout_seconds:` fields) to confirm whether YAML-level timeouts use `SIGTERM` or `SIGKILL` and whether they wrap the spawn in a process group.

## Recommended Next Focus
Iteration 002 — confirm whether spawned grandchildren (codex sub-process MCP daemons, devin internal workers, opencode plugin host) survive parent termination across the four enforcement layers (Node `spawnSync`, Node `spawn` + `SIGKILL` timer, `gtimeout 900`, raw YAML `timeout_seconds`). Specifically: (a) trace the YAML runtime's command-execution implementation to determine whether `timeout_seconds` enforces SIGTERM-only or escalates to SIGKILL; (b) trace whether any branch detaches into its own process group (`detached: true` / `setsid`) so a single kill reaches grandchildren; (c) audit `runAuditedExecutorCommand`'s lack of `maxBuffer` and document the failure-mode crossover with `dispatch_failure.reason='crash'`; (d) cross-check the launcher binary at `.opencode/bin/mk-spec-memory-launcher.cjs` against the documented lease semantics and PID-reuse handling.
