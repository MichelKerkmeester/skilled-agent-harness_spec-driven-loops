# Iteration 1: RQ1 (Daemon-Bypass Enforcement) + RQ3 (Lease/Spawn Races)

**Focus:** RQ1 + RQ3 — the two HIGH-severity structural risks
**Status:** complete
**newInfoRatio:** 1.0 (first iteration; all findings are new to this packet)
**Novelty justification:** First pass on the two highest-severity structural risks — all evidence gathered from the actual launcher and bridge codebase, none was previously classified in a lineage-specific findings registry.

---

## RQ1: Daemon-Bypass Enforcement — RESOLVED (file:line evidence)

### Finding: The public CLI path is provably IPC-only

The launcher spawns `context-server.js` (the daemon) with `SPECKIT_BACKEND_ONLY: '1'` at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1210-1218]. All 37 tools are defined in `TOOL_DEFINITIONS` at [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/tool-schemas.ts:709-756] and dispatched through MCP handler boundaries. The CLI design from run-2 explicitly routes all 37 public subcommands through `daemon-ipc.sock` JSON-RPC, reusing the identical handler surface [SOURCE: file:../cli-backend/lineages/gpt/research.md:12-13, 20-28].

The IPC socket lives at `{dbDir}/daemon-ipc.sock` resolved by `getIpcSocketPath('mk-spec-memory', { dbDir })` [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:59-67]. A CLI that uses this path has no code path to the database; the daemon is the single writer.

### Finding: Unix-socket trust model and socket permissions

Socket permissions are set to **owner-only** via `fs.chmodSync(socketPath, 0o600)` at [SOURCE: file:.opencode/bin/lib/model-server-supervision.cjs:1316]. The database directory is created with `mkdirSync(dbDir, { recursive: true, mode: 0o700 })` [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:228]. Owner lease files use `fs.openSync(tmp, 'wx', 0o600)` [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:302].

**Trust model:** Only the same UID as the launcher process can connect to the socket or read the lease files. A rogue process under the same UID could technically connect, but this is the same trust boundary as the MCP stdio transport (a malicious agent process under the same UID can already send arbitrary MCP commands). The dual-stack design does not widen this surface.

### Finding: Admin direct-DB path inventory

The existing maintenance CLI at `cli.ts` [SOURCE: file:.opencode/skills/system-spec-kit/mcp_server/cli.ts:9] already provides admin direct-DB operations (stats, bulk-delete, reindex-embeddings). The run-2 design explicitly gates these behind `spec-memory admin` subcommands, separate from the 37 public tools. The admin path is intentionally distinct and the launcher's `SPECKIT_BACKEND_ONLY: '1'` flag ensures the public path never opens the DB directly.

The `generate-context.js` script at `scripts/dist/memory/generate-context.js` demonstrates a precedent: it performed a full indexed save with the MCP down on 2026-06-06, proving CLI-path saves work without needing the MCP transport [SOURCE: file:../research/research.md:43].

### Classification: RESOLVED

The public CLI is IPC-only by design. The admin direct-DB paths are a separate concern gated behind a different entry point (`spec-memory admin`). Socket/file permissions are owner-only (0o600/0o700). The trust model is identical to the existing MCP stdio transport — no new attack surface.

---

## RQ3: Lease/Spawn Races — MITIGATED (named design deltas)

### Finding: Owner lease prevents concurrent daemon ownership

The owner lease at `.spec-memory-owner.json` uses exclusive file creation (`'wx'` flag) to ensure exactly one winner [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:300-312]. The `acquireOwnerLeaseFile()` function [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:365-403]:

1. Reads any existing owner lease
2. Classifies it (live/stale-ppid/orphan/stale-heartbeat) via `classifyOwnerLease()` [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:346-363]
3. If live, returns `acquired: false` — second launcher becomes a bridge client
4. If stale/reclaimable, writes a new lease
5. **Re-reads after write** to detect a race where two launchers simultaneously reclaimed a stale lease

Heartbeat refreshes the lease timestamp every `ttlMs/2` (default 30s) [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:427-443]. If heartbeat fails, the launcher **shuts itself down** to preserve single ownership [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:434-441].

### Finding: Bootstrap lock serializes concurrent starts

The bootstrap lock is a `mkdir`-based lock (`{dbDir}/.mk-spec-memory-launcher.lockdir`) at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1151-1194]:

- Atomically acquired via `mkdirSync()` — only one winner
- Stale locks reclaimed after 300s (`BOOTSTRAP_LOCK_STALE_MS`) with rename-claim-then-delete race-safe protocol
- Timeout after 120s; release after build/spawn

This serializes ALL concurrent launcher starts (build + owner lease + first spawn) so two CLI invocations simultaneously calling `spec-memory` will NOT both spawn a daemon.

### Finding: Respawn lock prevents concurrent respawns

The respawn lock (`{dbDir}/.mk-spec-memory-respawn.lock`) at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:565-583] serializes dead-socket respawns. The `respawnAfterDeadSocket()` function [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:671-752]:

1. Acquires bootstrap lock + respawn lock
2. Verifies owner lease hasn't changed (re-read after lock acquisition)
3. Verifies lease hasn't changed (re-read childPid)
4. Reaps old owner process (SIGTERM → SIGKILL after grace)
5. Clears old owner lease, acquires new one (exclusive write)
6. Reaps old child process with clean-close verification
7. Builds if needed, writes lease, launches server
8. Releases locks in `finally`

Multiple launchers detecting a dead socket simultaneously will be serialized — only one wins the respawn lock. The others either bridge to the newly spawned daemon or get -32001 retryable errors.

### Finding: Two CLI invocations spawning simultaneously

Scenario: two CLI processes run `spec-memory` when no daemon exists. Both call `mk-spec-memory-launcher.cjs`.

1. **Bootstrap lock** serializes them. Only winner proceeds through build + owner lease acquisition.
2. Winner acquires owner lease (exclusive write), spawns daemon, starts heartbeat.
3. Loser reaches `acquireOwnerLeaseFile()`, finds a live owner, becomes a secondary launcher.
4. Secondary launcher bridges its client's stdio through the **session proxy** (`bridgeStdioThroughSessionProxy()`) at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:202-211].
5. The session proxy at [SOURCE: file:.opencode/bin/lib/launcher-session-proxy.cjs:1-80] handles reconnection transparently if the daemon recycles, queuing client frames up to `DEFAULT_MAX_QUEUED_CLIENT_FRAMES = 1000`.

If the socket is dead when the secondary probes: `maybeBridgeLeaseHolder()` at [SOURCE: file:.opencode/bin/lib/launcher-ipc-bridge.cjs:311-379] deep-probes the daemon. If dead, returns `{ action: 'respawn' }`, which the launcher routes to `respawnAfterDeadSocket()` with full lock serialization.

**Result:** exactly one daemon starts. Both CLIs get service. Zero window for duplicate DB writers.

### Finding: CLI-spawned daemon lifetime, reaping, and orphan risk

The daemon spawned by the CLI is the **launcher's child** (`childProcess = spawn(...)`) at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1212-1219]. The launcher process is the lifecycle owner.

**Crash-loop guard** handles unexpected daemon deaths: `superviseChildExit()` at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1233-1251] tracks deaths in a window and relaunches with exponential backoff. On `give-up` (too many crashes), clears lease and mirrors the child exit signal.

**RSS watchdog**: `startRssWatchdog()` at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1104-1121] monitors process tree memory and triggers `recycleDaemonInPlace()` which reaps model server + context server children and relaunches.

**Orphan handling for sidecars**: The launcher maintains `lastKnownDescendantPids` [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1022-1048] — a snapshot of grandchild process PIDs from periodic process-tree walks. On crash-loop give-up, the `reapProcessTreeGroups()` function reaps both any still-live child subtree AND the before-death snapshot (filtered to currently alive PIDs). This handles the RC-1 case of a forked-detached sidecar grandchild that re-parents to PID 1 on daemon death.

**Clean shutdown**: `shutdownLauncherForSignal()` at [SOURCE: file:.opencode/bin/mk-spec-memory-launcher.cjs:1263-1300+] sends SIGTERM to context-server and hf-model-server children, waits for exit with grace period, then clears lease files and exits.

**Orphan risk precedent**: Six orphaned mk-skill-advisor launchers were observed on this host (noted in strategy.md Known Context). The mk-spec-memory launcher's design specifically addresses this through:
- Heartbeat-based TTL and self-shutdown on heartbeat failure
- Crash-loop guard with give-up threshold (does not spin forever)
- Bootstrap lock staleness at 300s (a crashed launcher won't block the lockdir forever)
- `lastKnownDescendantPids` + `reapProcessTreeGroups` for sidecar cleanup

### Finding: MCP-owned daemon scenario

When MCP is live: the MCP runtime registers the launcher, which holds the owner lease. A CLI invocation finds the live owner lease, becomes a secondary launcher, bridges through the session proxy. The CLI is just another IPC client alongside the MCP stdio transport. No race — the existing multi-client bridge is test-proven [SOURCE: file:../cli-backend/lineages/gpt/research.md:42-44, citing launcher-ipc-bridge.vitest.ts:279].

### Classification: MITIGATED

All three identified race vectors (simultaneous spawn, spawn vs live MCP, dual-cli spawn) are prevented by a three-tier lock hierarchy (bootstrap → owner lease → respawn) with re-read verification and self-shutdown on lease failure. The CLI-spawned daemon lifetime is covered by heartbeat, crash-loop guard, RSS watchdog, and orphan reap. The **design delta for the implementation packet**: include `--session-id` in the CLI so session-state tools correctly attribute the CLI client, and add a test for the dual-simultaneous-spawn scenario (bootstrap lock already serializes, but the test is missing).

### Orphan risk note (RESOLVED)

The orphan risk precedent (six mk-skill-advisor launchers) motivated the design features above. The mk-spec-memory launcher's heartbeat-based self-shutdown and 300s stale-bootstrap-lock timeout specifically addresses this failure mode. The implementation packet should also ensure the CLI's auto-spawn path runs the launcher's full lifecycle (not a bare `spawn()` without supervision).

---

## Discovered Risks

None added in this iteration — RQ1 and RQ3 were the two highest-severity seed risks. Both are now classified.

## Ruled Out

- "Direct DB access from CLI" — the public CLI path is IPC-only; admin direct-DB is a separate entry point. Attested by the launcher's `SPECKIT_BACKEND_ONLY` flag and the run-2 design.
- "Two simultaneous spawns = two daemons" — bootstrap lock serializes, owner lease exclusive-write prevents the second. Proven by the code at launcher.cjs:1151-1194 and launcher.cjs:365-403.
