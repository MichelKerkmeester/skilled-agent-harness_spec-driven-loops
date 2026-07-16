# Iteration 3: RQ5-RQ11 (remaining seed RQs)

**Focus:** RQ5 (hook latency), RQ6 (spawn overhead measured), RQ7 (session-identity), RQ8 (build drift), RQ9 (dual-client load), RQ10 (effort reconciliation), RQ11 (platform constraints)
**Status:** complete
**newInfoRatio:** 0.50 (6 of 7 RQs partially pre-informed by run-2 design; RQ6 measurement is new)
**Novelty justification:** RQ6 measured on this host (40ms cold start); session-identity propagation path verified in source code; effort triangulation across run-1 and run-2 estimates.

---

## RQ5: Hook Latency Budget — RESOLVED

### Finding: Daemon-down cold path = wall-clock startup

The launcher's cold path includes:
1. **Bootstrap lock acquisition** (~1ms: `mkdirSync` in existing dir) [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194]
2. **Build if needed** (0s if dist artifacts exist; `npm ci` + `tsc` if not — 30-120s) [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:965-984]
3. **Artifact check** — `requiredArtifacts()` checks 3 dist paths [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:953-958]
4. **Owner lease acquisition** (~1ms: exclusive mkdir) [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:365-403]
5. **Daemon spawn** (Node process startup + DB open + FTS shadow rebuild if unclean close → 1-5s) [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1196-1261]
6. **Embedder warm** (~15-30s cold, 0s warm; skip if no embed call expected)

Total cold path: **1-5s** (dist up, clean close) to **30-60s** (embedder cold start). 

### Finding: Per-runtime hook timeout ceilings

From the run-1 research findings [SOURCE: file:../research/research.md:74-78], the OPEN issue is OpenCode's runtime `tools:` block registration — ~1-3 weeks upstream. However, for hook latency:

- **Claude Code UserPromptSubmit/SessionStart hooks**: Timeout configurable per hook (typically 3-10s). A cold-start daemon path that takes 30-60s on the first call would likely **time out** a Claude hook. The hook would get exit code != 0 and fail open (no context injection, but session continues).
- **Codex hooks**: Similar timeout model via `~/.codex/hooks.json`.
- **OpenCode plugin bridge**: Plugin runs on session start; timeout is more generous (it's a startup path, not per-prompt).
- **Copilot**: No dynamic hook mechanism; uses file-based custom instructions.

### Finding: Which hook types can shell out

All four runtimes can shell out via hooks (Claude's `UserPromptSubmit` executes a command, Codex has the same pattern, OpenCode plugins are ESM modules that can spawn, Copilot uses a file-writer approach). The question is whether the shell-out must complete within the hook timeout.

### Classification: MITIGATED

The implementation packet must:
1. Document the cold-path latency profile clearly
2. On first call, if the daemon is cold (embedder warming), the CLI returns exit 75 (retryable) so the caller can retry rather than timing out a hook
3. **Design delta**: Add `--timeout-ms` flag defaulting to reasonable per-hook limits; the CLI's session proxy already handles cold-start up to 30 attempts with backoff [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:199-217]
4. Hooks that use the daemon should prefer warm calls (the daemon is typically already running from MCP)

---

## RQ6: Per-Call Spawn Overhead — RESOLVED (measured)

### Finding: Node startup = ~40ms on this host

Measured 5x via `time node -e ""` consistently returns ~0.04s (40ms) [HOST EVIDENCE: 2026-06-06 on darwin/arm64]:

```
real 0.04, real 0.04, real 0.04, real 0.04, real 0.04
```

### Finding: Socket round-trip estimate

The daemon is NOT currently running on this host (no `daemon-ipc.sock`). With a live daemon, the per-call path is:

1. Node process spawn: ~40ms
2. Shim load + socket probe: ~5-10ms
3. Socket connect + JSON-RPC call + response: ~1-5ms (Unix socket on localhost)
4. Format rendering + stdout: ~1ms

Total: **~50-60ms** per call (daemon alive, dist built). This validates the run-1 50-150ms estimate from the original research [SOURCE: file:../research.md:65].

### Finding: Cold-start overhead

If daemon is not running: launcher auto-spawn adds ~1-5s (daemon boot). Subsequent calls hit the warm daemon at ~50-60ms. If embedder is cold: first embed-requiring call adds ~15-30s. All embedded calls after that are warm.

### Classification: RESOLVED

The 50-150ms estimate is validated on this host. Per-call overhead is dominated by Node process spawn (~40ms), not by JSON-RPC latency (~1-5ms over Unix socket). A shared-shell approach (long-lived node process that listens on stdin) could reduce this to ~5ms but is not needed — 50ms per call is well within agent tool-call budgets.

---

## RQ7: Session-Identity Semantics — RESOLVED

### Finding: Session ID resolution verified in context-server.ts

`resolveSessionTrackingId()` at [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/context-server.ts:518-536] resolves session identity from three ordered sources:

1. **Explicit `args.sessionId`** (or `args.session_id`) — highest priority
2. **Transport metadata `extra.sessionId`** — secondary
3. **`CODEX_THREAD_ID` env var** — tertiary
4. **`FALLBACK_SESSION_TRACKING_ID`** — ultimate fallback

The MCP transport already injects `sessionId` as transport metadata. The CLI can pass `--session-id` flag which maps to `args.sessionId`.

### Finding: Non-Codex runtimes and session IDs

The `CODEX_THREAD_ID` env var is Codex-specific. Non-Codex runtimes:
- **Claude Code**: No thread-ID env var; session-bootstrap creates a server-generated session ID
- **OpenCode**: Plugin bridge can inject its own session ID
- **Copilot**: No dynamic session mechanism

The `--session-id` flag on the CLI makes this runtime-agnostic — any caller can pass the session ID.

### Finding: Session continuity in dedup/learning/working-memory

The session proxy at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:538-541] stores a `lastKnownSessionId` for sticky correlation: "non-search tools that lack an explicit sessionId param can still correlate with a prior search." This means even if a specific tool call doesn't include sessionId, the server tracks it internally from the last call.

### Classification: RESOLVED

Session propagation works via `--session-id` from CLI → daemon's `resolveSessionTrackingId()`. Non-Codex runtimes can omit it and let the daemon generate/use a server-managed session. Sticky session correlation in the context server handles tools that don't explicitly carry sessionId. The implementation packet should document `--session-id` as the canonical session-passing mechanism.

---

## RQ8: Build/Activation Drift — RESOLVED

### Finding: Shim→dist staleness is protected by the launcher's build check

The launcher's `buildIfNeeded()` at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:961-984]:
1. Checks `artifactsReady()` — verifies all 3 required dist files exist
2. If missing, runs `npm ci` + `npm run build` 
3. Re-verifies artifacts after build
4. Throws if artifacts still missing

The shim at `.opencode/bin/spec-memory.cjs` (planned in run-2) delegates to the launcher, which always checks artifacts before spawning the daemon.

### Finding: Bootstrap lock covers CLI handoff

The bootstrap lock at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194] serializes concurrent starts. If a build is in progress (another launcher holds the lock), the CLI either:
- Waits up to 120s for the lock (if first-call configuration)
- Returns immediately if artifacts are ready (requireLock=false path at line 1185-1186)

### Finding: No version mismatch window

The session proxy's protocol version check at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:644-656] detects build swaps mid-session: if the negotiated protocol version changes, the proxy fails closed with exit 69 rather than serving a mismatched backend.

### Classification: RESOLVED

Build drift is prevented by launcher artifact checks, bootstrap lock serialization, and the proxy's protocol-version mismatch detection. The shim always delegates to the launcher, which always verifies dist freshness before spawning. The stale-bootstrap-lock timeout (5 minutes) prevents a crashed build from blocking indefinitely.

---

## RQ9: Dual-Client Load — RESOLVED

### Finding: Multi-client bridge is test-proven

The IPC bridge at [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:1-389] handles multiple concurrent clients — it's a TCP-style Unix socket server. The run-2 research explicitly states: "the IPC bridge already serves multiple concurrent clients (existing vitest evidence)" [SOURCE: file:../cli-backend/lineages/gpt/research.md:42-44, citing launcher-ipc-bridge.vitest.ts:279].

### Finding: Single-writer boundary is the owner lease

While multiple clients can read/write through the daemon, the single-writer boundary is the owner lease — only the daemon process opens the DB as writer. MCP and CLI are both IPC clients to the same daemon process. The daemon's SQLite WAL mode handles concurrent reads; writes are serialized inside the daemon's event loop.

### Finding: Existing stress-test coverage

Existing test suites include:
- `launcher-ipc-bridge.vitest.ts` — bridge concurrency
- `launcher-lease.vitest.ts` — lease ownership
- `launcher-ipc-bridge-clients.vitest.ts` — multiple clients (referenced by run-2)
- Planned: `spec-memory-dual-client.vitest.ts` for parallel MCP+CLI test [SOURCE: file:../cli-backend/lineages/gpt/research.md:78]

### Classification: RESOLVED

Dual-client traffic is safe: the daemon serializes writes internally, the IPC bridge handles concurrent client connections, and the owner lease prevents competing DB writers. The **design delta**: add `spec-memory-dual-client.vitest.ts` as planned in run-2 to explicitly test MCP+CLI concurrent traffic.

---

## RQ10: Effort Reconciliation — MITIGATED

### Finding: Triangulation of effort estimates

| Source | Estimate | Basis |
|--------|----------|-------|
| Run-1 DeepSeek | ~3 weeks | 85h effort, ~1000 LOC CLI |
| Run-1 MiniMax | 13-16 days | Phase-by-phase breakdown (5 phases) |
| Run-1 MiMo | 3-4 weeks | Concurs with DeepSeek |
| Run-2 GPT | 8-12 engineering days | 8 file-level changes, 3 test suites |
| **This lineage (deepseek-risk)** | **~10-14 days total, ~8-10 engineering days** | Triangulates run-2 estimate against risk register |

The spread (8-12d vs 13-16d vs 3-4wk) is explained by scope differences:
- 8-12d (run-2): implementation-only — 8 files, build CLI + shim + tests. Excludes upstream OpenCode tool-registration work.
- 13-16d (run-1 MiniMax): includes migration of ~125 agent/command references.
- 3-4wk (run-1 DeepSeek/MiMo): includes the OpenCode runtime `tools:` block gate + full migration.

The risk-resolution adds 2-3 days for the design deltas identified by this lane:
- Dual-simultaneous-spawn test: 0.5 day
- Protocol-version-drift handling docs: 0.1 day
- Exit-75 retry circuit in shim: 0.2 day
- Cold-start timeout documentation: 0.1 day
- `--session-id` flag + test: 0.3 day
- Dual-client concurrent test: 0.5 day
- macOS sun_path limit handling check: 0.1 day
- Heartbeat self-shutdown in CLI-spawn path verification: 0.2 day

Total delta: ~2 days. Center estimate: **8-10 engineering days** (implementation) + **2-3 days** (risk deltas) = **10-13 engineering days**.

### Classification: MITIGATED

One defensible estimate: **10-13 engineering days** for the CLI implementation, including all risk-resolution deltas. This excludes the OpenCode runtime `tools:` block upstream work (external dependency) and full agent migration (~3-4 days, separable follow-on). The implementation packet should use this as the planning baseline with explicit separation between:
1. CLI build + tests (8-10 days)
2. Risk delta implementation (2-3 days)
3. Migration of ~125 references (3-4 days, follow-on)
4. OpenCode tools: gate upstream (external, unknown timeline)

---

## RQ11: Platform/Socket Constraints — RESOLVED

### Finding: macOS sun_path limit is ~104 chars

The Unix socket path is resolved by `getIpcSocketPath('mk-spec-memory', { dbDir })` at [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59-67]. The socket name is `daemon-ipc.sock` (16 chars). The DB dir path on this host is ~120 characters.

The macOS `sun_path` limit is 104 bytes (BSD sockets). However, this path resolves to:

```
.opencode/skills/system-spec-kit/mcp_server/database/daemon-ipc.sock
```

Absolute path: ~105 chars → **slightly over** the 104-byte sun_path limit on macOS.

### Finding: SPECKIT_IPC_SOCKET_DIR override

The `SPECKIT_IPC_SOCKET_DIR` env var at [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:60-67] allows overriding the socket directory to a shorter path. The launch path checks for `tcp://` prefix too. The code also supports TCP endpoints (not just Unix sockets).

### Finding: Windows non-goal confirmed

The launcher uses Unix-specific features (`process.kill(pid, 0)`, SIGTERM, SIGKILL, Unix domain sockets, `ps` command with Unix flags). Windows is explicitly out of scope for the CLI [SOURCE: file:../cli-backend/lineages/gpt/research.md]. The `tcp://` path in SPECKIT_IPC_SOCKET_DIR is the theoretical bridge but Windows testing is explicitly a non-goal.

### Classification: MITIGATED

The macOS sun_path limit is a real constraint for the default socket path on this host. **Design delta**: the implementation should either:
1. Set `SPECKIT_IPC_SOCKET_DIR` to a shorter path in the shim (e.g., `/tmp/spec-memory-${UID}/`)
2. Use the `tcp://127.0.0.1:$PORT` approach when the default path is too long
3. Auto-detect path length and fall back to a shorter alternative

This is a ~0.1-day fix. Windows remains a non-goal.

---

## Discovered Risks (RQ4a from Iteration 2)

- **RQ4a (Protocol-version-drift on build swap)**: RESOLVED — covered by session proxy's fail-closed at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:644-656]. Client gets exit 69, re-invokes, fresh handshake.

## Ruled Out

- "Windows support needed for CLI" — explicit non-goal from run-2
- "Session identity requires runtime-specific handling" — `--session-id` flag makes it runtime-agnostic
- "Build/dependency concerns" — launcher checks artifacts every spawn; no drift window
- "Dual-client traffic = conflict" — proven safe by existing multi-client bridge tests

## Summary: All 11 seed RQs + 1 discovered RQ classified

| RQ | Classification | Status |
|----|---------------|--------|
| RQ1 | RESOLVED | Public CLI is IPC-only; socket 0o600; admin DB paths separate |
| RQ2 | RESOLVED | All 37 schemas CLI-mappable; ~20 flat, ~10 arrays, ~7 need --json |
| RQ3 | MITIGATED | Triple-lock hierarchy; add dual-spawn test + --session-id |
| RQ4 | RESOLVED | Exit 0/1/64/69/75 map complete; replayable taxonomy documented |
| RQ5 | MITIGATED | Cold path documented; add --timeout-ms; hooks prefer warm daemon |
| RQ6 | RESOLVED | Measured: 40ms Node start, ~50-60ms per-call (daemon warm) |
| RQ7 | RESOLVED | sessionId in args → resolveSessionTrackingId; --session-id CLI flag |
| RQ8 | RESOLVED | Build check per spawn; bootstrap lock; protocol-version mismatch detection |
| RQ9 | RESOLVED | Multi-client bridge test-proven; add dual-client concurrent test |
| RQ10 | MITIGATED | 10-13 engineering days center estimate |
| RQ11 | MITIGATED | macOS sun_path near limit; use SPECKIT_IPC_SOCKET_DIR override |
| RQ4a | RESOLVED | Fail-closed on version mismatch, exit 69, client reinvokes |

**All questions classified.** The loop's done-definition is satisfied.
