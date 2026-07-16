# Seat opus-launcher-lifecycle — iteration 5 (global #24)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-launcher-lifecycle
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=0 P2=1

## Analysis

I have traced the full slice. Here's my analysis.

## Review: opus-launcher-lifecycle (orphan reap hardening)

**What I verified as correct:**

1. **"N consecutive dead probes before reap"** (`launcher-ipc-bridge.cjs:335-358`, `47-48`) — `probeLeaseHolderWithRetries` loops `1 + SPECKIT_LEASE_PROBE_RETRIES` (default 2) deep JSON-RPC probes, short-circuits to `bridge` on any `alive`, and only returns `dead` after *all* attempts fail. The worst-case wall time (5000ms first + 250ms backoff + 1500ms retry = 6750ms) stays under `RESPAWN_REAP_GRACE_MS` (7000ms). Correct.

2. **Launcher reap path** (`mk-spec-memory-launcher.cjs:709-772`) is fail-*safe* against PID-recycle/second-writer: `reapLeaseChildBeforeRespawn` refuses respawn (`child-kill-unconfirmed`, `child-liveness-unknown-eperm`) rather than risk a second DB writer; the stale-reclaim path re-validates the lease `childPid` under the respawn lock (`:1631-1639`) and probes-before-adopt (`:1595-1610`). No false-reap of a live, responsive daemon here.

3. **Session-scoped Stop-hook kill** (`session-cleanup.sh:86-148`) re-proves ancestry at kill time and fails *closed* (`skip-kill`) when `ps` can't confirm the chain. Safe.

**The one real gap — orphan sweep can kill a live, re-elected daemon:**

Daemon re-election is **default-on** (`mk-spec-memory-launcher.cjs:196-204`) and *intentionally* leaves a released-but-still-serving daemon reparented to pid 1 ("leaves it running for a live secondary to bridge to … reparents to pid 1 … the orphan sweeper bounds any leak"). A secondary live session bridges to it over a **UNIX socket**.

When `SPECKIT_STOP_HOOK_ORPHAN_SWEEP` is enabled and a Stop hook fires with no `CLAUDE_SESSION_PID`, `orphan-mcp-sweeper.sh` scans *all* processes. Its preserve checks (`:308-344`) cannot save such a daemon:
- `live-session-tree` walks descendants of live `claude/opencode/codex` roots — the daemon is `ppid=1`, so it is in *no* session tree.
- `freshest-young-instance` only preserves age `< AGE_MIN_SEC` (300s) — a healthy adopted daemon is older.
- `has_non_mcp_listener` checks **TCP listeners only** (`:303`, `lsof … -iTCP`) — the daemon listens on a UNIX socket, so this never fires.
- It classifies `context-server.js` as a kill candidate (`:187`) and there is **no check for live socket connections**.

→ The daemon is SIGTERM/SIGKILLed (`:401-424`), dropping the transport for any concurrent session bridged to it. This directly contradicts the load-bearing safety claim in two places — `session-cleanup.sh:20-22` ("can never touch a live sibling session") and `ENV_REFERENCE.md:178` ("so it cannot kill a live session"). The only test (`launcher-stop-hook-orphan-sweep.vitest.ts`) stubs the sweeper and never exercises this preserve logic.

I rate this **P2**, not higher: it requires opting into a default-off knob, the no-session-pid branch, and concurrent sessions; and it is self-healing (next request re-elects/respawns; mk-code-index has a reconnecting proxy). But the absolute "cannot kill a live session" guarantee is false under the default-on re-election design, so it's a genuine correctness/traceability defect worth recording.

```json
{"seat":"opus-launcher-lifecycle","model":"claude-opus-4-8","angle":"Orphan reap hardening: N consecutive dead probes before reap; Stop-hook orphan sweep (default off). Verify no live-process false-positive kill.","verdict":"CONDITIONAL","summary":"Probe-retry reap + launcher reap path are correct/fail-safe. Orphan sweep CAN kill a default-on re-elected daemon (ppid=1, UNIX-socket) still serving a live session; docs claim it cannot.","files_reviewed":[".opencode/scripts/session-cleanup.sh",".opencode/scripts/orphan-mcp-sweeper.sh",".opencode/bin/lib/launcher-ipc-bridge.cjs",".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/lib/model-server-supervision.cjs",".opencode/skills/system-spec-kit/mcp_server/ENV_REFERENCE.md",".opencode/skills/system-spec-kit/mcp_server/tests/launcher-stop-hook-orphan-sweep.vitest.ts"],"findings":[{"severity":"P2","dimension":"correctness","title":"Orphan sweep can SIGKILL a live re-elected daemon still bridged by a sibling session; 'cannot kill a live session' guarantee is false","file":".opencode/scripts/orphan-mcp-sweeper.sh:293","evidence":"has_non_mcp_listener() preserves only TCP listeners (lsof -iTCP -sTCP:LISTEN), but the MCP daemons listen on UNIX sockets (daemon-ipc.sock), so it never fires for them. freshest-young-instance (preserve_reason:331-336) only preserves age<300s. Daemon re-election is default-on (mk-spec-memory-launcher.cjs:196-204) and deliberately reparents a still-serving released daemon to pid 1, so build_session_trees (orphan-mcp-sweeper.sh:280-291, walks descendants of live claude/opencode/codex) never covers it. context-server.js is a kill candidate (classify_command:187) and is then SIGTERM/SIGKILLed (terminate_candidates:401-424). No check exists for live UNIX-socket connections.","why":"When SPECKIT_STOP_HOOK_ORPHAN_SWEEP is enabled and a Stop hook fires with no CLAUDE_SESSION_PID, an orphaned-but-actively-bridged re-elected daemon (>300s old, only/freshest instance, ppid=1) matches no preserve rule and is killed, dropping the transport for any concurrent live session using it. This contradicts the explicit safety guarantee in session-cleanup.sh:20-22 ('the ORPHAN-ONLY sweeper ... can never touch a live sibling session') and ENV_REFERENCE.md:178 ('so it cannot kill a live session'). Under default-on re-election, a reparented daemon is precisely the shared LIVE daemon, not an abandoned orphan. The only existing test stubs the sweeper and never exercises this preserve path.","recommendation":"Before reaping a classified MCP daemon, check for live connections on its recorded UNIX socket (e.g. lsof -nP -U on the daemon's daemon-ipc.sock, or read the lease file and confirm the pid is not the current lease childPid) and preserve it if in use; alternatively raise/remove the TCP-only restriction in has_non_mcp_listener to cover UNIX sockets. At minimum, soften the absolute 'cannot kill a live session' wording in session-cleanup.sh:20-22 and ENV_REFERENCE.md:178 to document that an adopted/re-elected orphaned daemon can be swept and recovers via re-election."}]}
```
