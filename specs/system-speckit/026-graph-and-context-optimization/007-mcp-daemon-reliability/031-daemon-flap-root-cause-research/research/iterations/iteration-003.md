# Iteration 003 — cross-runtime lifecycle + exact live-failure sequence

- **Wave:** 2 (of 5) · **Executor:** `openai/gpt-5.5-fast --variant xhigh` (read-only, exit 0) · **Seat:** briq320xw · **Date:** 2026-06-14
- **Prompt:** `../prompts/iter-003.txt` · **Raw (full file:line):** `../raw/iter-003.out` · **Confidence:** high (static), medium (exact live event — no log)

---

## Cross-runtime lifecycle
- All 3 runtimes wire the SAME 3 launchers + share `/tmp/mk-*` sockets (`.claude/mcp.json`, `opencode.json`, `.codex/config.toml`). Flow: runtime → `mk-*-launcher.cjs` → MCP child → stdio/socket bridge.
- **Lease is process/socket-based, NOT runtime-labeled** — fields are `pid/ownerPid/childPid/modelServerPid/socketPath/ppid/executablePath/ttl`, no Claude/OpenCode/Codex identity (`model-server-supervision.cjs:705-724`, advisor `:373-382`, code-index `:382-392`). So cross-runtime sharing = pure pid/socket contention; any runtime owns, others bridge.
- spec-memory = only hardened (release-for-adopt on shutdown); advisor + code-index kill child + clear leases on signal (advisor `:1185-1200`, code-index `:911-928`).

## The warm-probe trap (confirmed in CLI code)
- Every CLI: probe first; **if not alive AND `warmOnly` → throw retryable backend-unavailable (exit 75); only the non-warm path calls `spawnLauncher()`** (spec-memory-cli `:800-808`, code-index-cli `:958-966`, skill-advisor-cli `:1068-1076`).
- Claude `SessionStart` (`session-prime.js:273-340`) + UserPromptSubmit + the spec-memory/code-index/advisor fallbacks ALL pass `--warm-only` + prompt-time envs. **No `prewarm` hook exists.** → a session that starts with a daemon already dead NEVER cold-starts it and reports "unavailable" all session.

## Idle-timeout mechanism (new)
- All 3 daemons have an idle monitor (`launcher-idle-timeout.ts:98-123`): active secondary clients keep it alive; **no clients + timeout → shutdown** → stale socket. This is the config's "unadopted released daemon bounded by SPECKIT_LAUNCHER_IDLE_TIMEOUT_MIN."

## Exact live-failure sequence (ranked)
1. **(Rank 1) Owner session exited OR daemon idle-timed-out while this Claude session had only warm-only probes.** Advisor/code-index kill-on-signal; released spec-memory is adopt-only and idle-bounded; this Claude session's hooks are warm-only → no cold-start → dead state persists. (advisor disconnected mid-session per live-diagnosis → a transport existed then dropped.)
2. (Rank 2) This session bridged to an existing owner socket that then died; session-proxy reattach exhausted → fail+close (`launcher-session-proxy.cjs:725-751`).
3. (Rank 3) Ungraceful death (SIGKILL/OOM/crash-loop) created the stale socket; but persistence is still caused by no-warm-cold-spawn + no supervisor.
4. (Rank 4, AGAINST) launcher-never-started — config registers them + advisor disconnected mid-session, so not mere absence.

## Cross-session kill (confirmed)
One runtime owning advisor/code-index kills the daemon on its exit **without checking active secondary IPC clients** → kills what other sessions bridge to. spec-memory is the exception (releases). HF embed socket shared by spec-memory+advisor → spec-memory release kills the shared sidecar.

## Universal or Claude-specific?
**Universal** — shared launcher code + sockets + process leases across all 3 runtimes; warm-only prompt-time is cross-runtime (Codex SessionStart + OpenCode code-graph bridge also warm-only). Claude is **worse in the observed session**: hooks only report warm availability + no repo-proven mid-session restart of a disconnected stdio launcher (client-side reconnect = phase 030, NOT shipped, harness-owned).

## Confidence + unknowns
High static. Medium on exact live event (no persistent log). Biggest unknown: which runtime owned advisor/spec-memory when they died. Likely-wrong: SIGKILL-vs-cleanup-race as the socket-creation sub-event (socket evidence supports unclean close; precise event unrecoverable).
