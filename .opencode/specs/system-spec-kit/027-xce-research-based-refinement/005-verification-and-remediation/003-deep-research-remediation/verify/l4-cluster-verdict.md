# L4 Launcher-Parity Cluster Verdict (tri-030 / tri-032 / tri-043 / tri-110)

> Fresh Fable 5 verifier, 2026-06-12. Uncommitted working-tree state verified against
> `verify/fable-verify-l4-batch-report.md` per-item proofs. Files examined:
> `.opencode/bin/mk-code-index-launcher.cjs`, `.opencode/bin/mk-spec-memory-launcher.cjs`,
> `.opencode/bin/lib/launcher-ipc-bridge.cjs`,
> `.opencode/skills/system-spec-kit/mcp_server/tests/launcher-clean-close-barrier.vitest.ts`,
> `core/config.ts`, `shared/paths.ts`, `shared/config.ts`, `lib/search/vector-index-store.ts`,
> `lib/storage/ports/vector-store.ts`,
> `.opencode/skills/system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` (dormant baseline).

## Verdicts

- tri-030: CLOSED
- tri-032: CLOSED
- tri-043: CLOSED
- tri-110: CLOSED

## Test evidence

`npx vitest run tests/launcher-clean-close-barrier.vitest.ts tests/launcher-db-lock-exit.vitest.ts tests/launcher-daemon-reelection.vitest.ts tests/launcher-ipc-bridge-probe.vitest.ts` (from `mcp_server/`): **4 files, 29/29 tests passed** (includes the two new tri-110 dir-override tests). `node --check` passes on both modified launchers.

`system-code-graph/mcp_server/tests/launcher-lease.vitest.ts` remains a pre-existing 15/15 environment-baseline failure (per stash round-trip proof in the batch report) and is NOT counted against this cluster.

## tri-030 + tri-043 — leases carry socketPath; bridge threads it (CLOSED)

The original proof: PID lease was `{pid, startedAt}` only (`mk-code-index-launcher.cjs:645-650` pre-fix), `buildOwnerLease()` had no socketPath, and both bridge call sites passed lease results without one. All three gaps are fixed:

- `buildOwnerLease()` now records `socketPath: ownerSocketPath()` (diff at `:375`); `writeLeaseFile()` records it in the PID lease (`:695`).
- `leaseHeldFromFile()` threads `socketPath` through **all six** return shapes: no-lease, foreign-uid mismatch, stat-failure, live (kill-0 ok), ESRCH (stale-reclaimable), EPERM (treat-live). Verified each return in the diff.
- Owner-lease bridge call site passes `holder.socketPath` with a `typeof === 'string'` guard (`launcherMain`, `:953`); the PID-lease path passes the full `leaseHeldFromFile()` result to `bridgeOrReportLeaseHeld(leaseResult)` (`:960`), so socketPath flows there too.

HUNT results:

1. **(a) Bridge consumer semantics** — `maybeBridgeLeaseHolder` (`launcher-ipc-bridge.cjs:393-400`) trusts a stored socketPath only when it is a non-empty string AND (`tcp://` or `fs.existsSync`); otherwise `usableStoredSocketPath = null` and it falls back to `getIpcSocketPath(serviceName, { dbDir })`. A null/missing/legacy socketPath therefore degrades to **exactly** the pre-fix recompute path; legacy leases without the field cannot break.
2. **(b) Cannot throw at lease-write time** — the `loadBridgeModule()` MODULE_NOT_FOUND fallback (`mk-code-index-launcher.cjs:123-138`) exposes only `maybeBridgeLeaseHolder`; `ownerSocketPath()` destructures `getIpcSocketPath` (absent property = `undefined`, no throw), guards `typeof !== 'function' → return null`, and wraps the whole body (including `resolvedDbDir()` and any non-MODULE_NOT_FOUND rethrow from `loadBridgeModule`) in try/catch returning null. Lease writes proceed with `socketPath: null` in every failure mode.
3. **(c) Foreign-uid legacy-lease guard** — both early returns (uid mismatch and statSync catch) return `{ held:false, ..., socketPath: null }`; a foreign socket is never surfaced, and `held:false` means no bridge attempt regardless.
4. **(d) Service-name match** — `ownerSocketPath()` calls `getIpcSocketPath('mk-code-index', { dbDir: resolvedDbDir() })`; `bridgeOrReportLeaseHeld` probes with `serviceName: 'mk-code-index'`, `dbDir: resolvedDbDir()` (`:679-684`). Identical service name and dbDir, so the recorded path equals the recompute in a non-divergent env, and divergent-env preference is the only behavioral delta — the intended fix.

## tri-032 — periodic owner-lease heartbeat (CLOSED)

Original proof: only refresh was the single post-spawn repoint; no `setInterval` in the file; staleness classification at ttl*2 = 120s meant every healthy owner classified `stale-heartbeat-reclaim` ~2 minutes after spawn.

Fix verified: `startOwnerLeaseHeartbeat(ownerPid)` with interval `Math.max(1000, floor(ttlMs/2))` (= 30s for the 60000ms lease ttl, read from the on-disk lease post-repoint), `unref?.()` applied, started at `launchServer` immediately after the repoint (`:877`).

HUNT results:

1. **Pid matches the repointed lease owner in both branches.** `refreshOwnerLeaseFile(ownerPid, patch)` requires `lease.ownerPid === ownerPid` at entry and confirms `reread.ownerPid === nextOwnerPid` after write (`:475-489`). Repoint call: `refreshOwnerLeaseFile(process.pid, { ownerPid: childProcess.pid, ... })`.
   - refreshed=true → disk lease ownerPid = childPid; heartbeat started with `childProcess.pid`; each tick `refreshOwnerLeaseFile(childPid)` passes the equality check and keeps the child as owner. Match.
   - refreshed=false → either nothing was written (lease missing / ownerPid ≠ launcher pid: a concurrent reclaim) or the post-write reread showed a different owner. Heartbeat started with `process.pid`, consistent with the logged "launcher pid remains the recorded owner"; if the disk owner is actually someone else, the first tick fails and the heartbeat self-stops — it cannot fight a successor. Match (safe in all sub-cases).
2. **Heartbeat stops on teardown and cannot prolong life.** `clearAllLeaseFiles()` now calls `clearOwnerLeaseHeartbeat()` first; it runs on child exit (both signal and code paths), and `process.on('exit', clearAllLeaseFiles)` covers the `installSignalHandlers` path (`clearLeaseFile()` then `process.exit(128)` → exit handler). The timer is `unref()`d, so a dying launcher is never kept alive by it.
3. **Stop-not-shutdown judged SOUND for this lifecycle.** Spec-memory's heartbeat shuts the launcher down on failed refresh ("preserve single ownership") because that launcher SUPERVISES — crashLoopGuard, supervisorRelaunchTimer, re-election: two live supervisors would both respawn daemons. The code-index launcher exits with its child and never relaunches (`childProcess.on('exit') → process.exit`), so a superseded owner poses no supervisor fight; shutting down would instead SIGTERM a healthy serving daemon out from under the owner session's `stdio: 'inherit'` MCP transport (code-index owner is NOT front-proxied — tri-148, still open). Double-daemon is prevented by the PID-lease backstop: a reclaimer that wins the owner lease still hits `isLeaseHeld()` → live PID lease → `clearOwnerLeaseFile()` + bridge (`launcherMain :961-965`), never spawning a second daemon. Stopping the heartbeat is the correct branch.

## tri-110 — unclean-shutdown marker path mirrors the daemon (CLOSED)

Original proof: launcher checked only `MEMORY_DB_PATH` dirname → `resolvedDbDir()`; with `SPEC_KIT_DB_DIR` set and no `MEMORY_DB_PATH` it probed the wrong directory. Fixed: `uncleanShutdownMarkerPath()` now resolves `SPEC_KIT_DB_DIR?.trim() || SPECKIT_DB_DIR?.trim()` against `root` before falling back to `resolvedDbDir()` (`mk-spec-memory-launcher.cjs:679-692`).

HUNT results:

1. **cwd alignment confirmed.** The daemon resolves dir overrides against `process.cwd()` (`core/config.ts:70`, `shared/paths.ts:93`); the launcher spawns the context-server child with `cwd: root` (`:1318`, `root = path.resolve(__dirname, '..', '..')` = repo root). So resolve-against-root in the launcher equals resolve-against-cwd in the daemon for relative overrides; absolute overrides resolve identically. Symlinked parent components (e.g. macOS `/tmp`) are harmless: the daemon realpaths, the launcher does not, but `fs.existsSync` traverses symlinks, so both probe the same physical marker.
2. **Precedence verified at the layer that actually writes the marker.** The marker is written beside `target_path` (`vector-index-store.ts:70-78`), and daemon boot reaches `initialize_db()` with no custom path (the vector-store port passes `options.dbPath || null` and nothing in `lib/storage/` or `core/` constructs it with a dbPath), so `target_path = resolve_database_path() = process.env.MEMORY_DB_PATH || resolveDatabasePaths().databasePath` (`vector-index-store.ts:372-383`). Effective marker-directory precedence: **raw MEMORY_DB_PATH dirname → dir override (against cwd=root) → default** — exactly what the launcher now implements, including the both-set case. The new test "MEMORY_DB_PATH wins over a dir override, matching daemon precedence" is TRUE at this layer. (Note: `core/config.ts:computeDatabasePaths` would invert this — dir override wins, MEMORY_DB_PATH contributes only a basename — but that resolver does not feed the marker write path today; see follow-on 2.)
3. **No other consumer assumed the old behavior.** All marker consumers route through the changed function: `uncleanMarkerPresent()` (`:694-700`), the re-probe path (`:718`), and reap forensics (`:746-749`); `:1715-1716` exports exist for the test file only. Grep over `.opencode/bin/` shows no other `.unclean-shutdown` reader.
4. **Test file** widened correctly: saves/restores all three env keys, clears them per-test (fixes cross-contamination the old single-key save had), adds dir-override and both-set cases. 29/29 pass.

## Dormant launcher-lease.vitest.ts — revival impact of new lease fields

Checked per instruction: NO assertion changes needed when revived. Its assertions parse only `pid`/`ownerPid` from lease JSON (`:126`, `:135`) and match `LEASE_HELD_BY:<pid> startedAt=...` stdout lines (`:204`, `:244`, `:561`) — socketPath is never printed in those lines. Fixture-written legacy leases (`{pid, startedAt}`, owner fixtures with `startedAtIso` and no socketPath) flow through the null-socketPath fallback identically to pre-fix. Launcher-written leases in its workspaces will now carry a socketPath pointing at a socket that does not exist in the test env → the bridge's existence check rejects it → recompute fallback → identical decisions. No `toEqual`/`toStrictEqual`/`Object.keys` shape assertions exist in that file, nor in `owner-lease-mutation-lock.vitest.ts` or `code-index-cli-harness.ts`.

## Follow-ons (none blocking)

1. **Stale test comment** — `launcher-ipc-bridge-probe.vitest.ts:355-356` still says "(4) A skill-advisor / code-index style lease (no socketPath)"; after this fix neither launcher matches that description (advisor already recorded it; code-index now does). Reword to "legacy lease predating socketPath". Coverage itself remains valid.
2. **Daemon-internal resolver divergence (pre-existing, informational)** — `core/config.ts:computeDatabasePaths` (feeds the `DATABASE_PATH` export) disagrees with the actual open path (`vector-index-store.ts:resolve_database_path`) in the MEMORY_DB_PATH+dir-override both-set case (dir override + basename join vs raw MEMORY_DB_PATH). The launcher correctly mirrors the marker-writing layer. If the store is ever switched to open `DATABASE_PATH` from core/config, `uncleanShutdownMarkerPath()` precedence must flip with it.
3. **Whitespace-trim micro-divergence** — the launcher trims dir-override envs; `shared/config.ts:getDbDir()` does not (while `core/config.ts` does). A whitespace-only `SPEC_KIT_DB_DIR` would diverge. Degenerate config; not worth a code change on its own — fold into any future touch of `getDbDir()`.
4. **tri-032 vanishing race (recorded, no action)** — if the repoint write lands but the post-write reread transiently fails, the heartbeat starts with the launcher pid while the disk lease says child pid; it self-stops on its first tick and the lease goes stale-classifiable after ~2 min, after which a future secondary reclaims-then-bridges via the PID-lease backstop — i.e. pre-fix behavior in a near-impossible window, never a wrong bridge.
5. **tri-148 unchanged** — the owner session remains un-front-proxied on code-index; the tri-032 stop-not-shutdown judgment partially leans on that fact, so revisit the heartbeat-failure branch if tri-148 ever front-proxies the owner.
