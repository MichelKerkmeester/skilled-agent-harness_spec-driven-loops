# Iteration 2: T2 — Lock the root cause and define the fix surface (socket-server.ts copy divergence)

## Focus
Confirm or refute iter-1's ranked T2 root cause (EADDRINUSE-unlink / teardown race orphaning the inode) by **line-diffing the three `socket-server.ts` copies** (spec-memory WORKING vs code-index + skill-advisor FAILING) and the two launchers' attach-vs-spawn flow, then lock the ranked T2 root cause and name the design-conformant fix surface. Explicit goal: find whether spec-memory has an owner-fence / inode-guard the failing copies lack — or vice-versa. READ-ONLY.

## Actions Taken
1. `diff` spec-memory `socket-server.ts` vs **both** failing copies (code-index, skill-advisor) — full divergence dump.
2. Grepped exact line numbers for the EADDRINUSE branch, `canUnlinkExistingSocket`, `close()`/unlink, `listenOnce` in all three copies.
3. Read the `close()` teardown path (`fs.unlinkSync`) verbatim in spec-memory (`:224-247`) and code-index (`:269-292`).
4. Read the working copy's full EADDRINUSE branch (`socket-server.ts:178-208`) and the code-index launcher's lease-held bridge-vs-report decision (`mk-code-index-launcher.cjs:100-135`).
5. Read `canUnlinkExistingSocket` body (code-index `:118-131`) for ENOENT handling.
6. Cross-checked intent: 012 `implementation-summary.md` (verbatim copy + EADDRINUSE-unlink retry + smoke = single-secondary only) and 018-front-proxy-recycle-hardening spec/summary (recycle hang scope; (c) socket-path divergence DEFERRED).
7. Re-confirmed live state: `ls -lai` inodes + `lsof` on all three sockets.

## Findings (file:line evidence + confidence)

**F1 — SMOKING-GUN ASYMMETRY, and it is the OPPOSITE of iter-1's framing: the WORKING spec-memory copy is the SIMPLE/permissive one; the two FAILING copies carry an extra `canUnlinkExistingSocket()` security gate that is NOT race-safe. [confidence: HIGH]**
- WORKING spec-memory EADDRINUSE branch (`system-spec-kit/mcp_server/lib/ipc/socket-server.ts:196-207`): for a unix socket on `EADDRINUSE` it goes straight to the `else` branch → `fs.unlinkSync(socketPath)` (ENOENT-tolerant, `:200-205`) → `await listenOnce(server, socketPath)` (`:207`). No ownership pre-check, no extra `lstat`. It always reclaims a stale unix socket.
- FAILING copies (code-index `socket-server.ts:239-253`; skill-advisor `:252-266`): same EADDRINUSE arm, but BEFORE unlinking they call `if (!canUnlinkExistingSocket(socketPath)) { throw err; }` (code-index `:242-243`, advisor `:255-256`).
- `canUnlinkExistingSocket()` (code-index `:118-131`, advisor `:131-`) does `fs.realpathSync.native(path.dirname(socketPath))` (`:119`) **then `fs.lstatSync(socketPath)` (`:123`) with NO ENOENT guard**. If a racing sibling daemon unlinked the socket between this daemon's failed `listenOnce` and this `lstat`, `lstatSync` throws `ENOENT`, which propagates UNCAUGHT out of `canUnlinkExistingSocket` and out of the `catch (error)` block → the bridge bind aborts. This is a TOCTOU race that exists in the failing copies and NOT in the working copy.

**F2 — A second, simpler race in the SAME guard: the ownership/realpath checks turn a benign stale-socket into a hard bind failure under N-way churn. [confidence: HIGH]**
- Even when the socket still exists, `canUnlinkExistingSocket` returns `false` (→ `throw err`, bind fails) if `isWithinAllowedSocketRoot(parent)` is false (code-index `:120-121`) or the socket uid != current uid (`:127-128`). Under the documented `SPECKIT_IPC_SOCKET_DIR=/tmp/<service>` with macOS `/tmp`→`/private/tmp` canonicalization, any drift between the racing binder's canonicalized root and this checker's view makes the guard refuse, so the SECOND daemon to hit EADDRINUSE fails its bind instead of reclaiming — leaving the inode present (created by the first/transient binder) with no surviving listener. Matches F2 of iter-1 exactly (file @18:35, process alive, no `lsof` holder).

**F3 — The added dir-ownership `statSync` block is a THIRD throw site on the same path, also added after 012. [confidence: MEDIUM-HIGH]**
- Failing copies add, right after `mkdirSync` (code-index `:171-188`, advisor `:184-201`): `fs.statSync(socketDir)` + throw if `st.uid !== uid` or `(st.mode & 0o022) !== 0` (group/world-writable). ENOENT is tolerated (`if (code !== 'ENOENT') throw`), but a uid/mode mismatch on a pre-existing `/tmp/mk-*` dir (plausible across a recycle that left a dir owned by a prior pid context, or any mode drift) throws and aborts the bind. The working copy has only `fs.mkdirSync(..., { mode: 0o700 })` (`:130`) with no post-check, so it never aborts here.

**F4 — The `close()` teardown paths are IDENTICAL across copies — so iter-1's "close()-unlinks-a-racing-inode" sub-hypothesis is NOT the differentiator. [confidence: HIGH]**
- spec-memory `close()` `:224-247` and code-index `close()` `:269-292` are byte-identical in the unlink arm: `if (!socketPath.startsWith('tcp://')) { fs.unlinkSync(socketPath) }` ENOENT-tolerant, after `server.close()`. Neither copy inode-guards the unlink. Since this path is the same in the working copy too, it cannot explain why ONLY the two non-spec-memory daemons lost their listener. The divergence is entirely in the **bind/EADDRINUSE-reclaim** path (F1–F3), not teardown. This REFINES iter-1's ranked #1/#2 (which leaned on close()).

**F5 — Launchers are NOT the cause; a secondary never reaches the daemon bind. [confidence: MEDIUM-HIGH]**
- `mk-code-index-launcher.cjs` lease-held path delegates to `launcher-ipc-bridge.cjs` `maybeBridgeLeaseHolder` and, on the no-bridge fallback, only `action:'report'` (writes `LEASE_HELD_BY:` , `:100-130`). Secondaries CONNECT to the owner's socket; they do not run `startIpcSocketServer`. So the EADDRINUSE racer is not a "secondary launcher" — it is **two owner-eligible primaries** (e.g. the daemon-owner Claude's trio recycle at 18:35 overlapping a codex session's own primary attempt, per strategy §12 N-way evidence) racing the same `/tmp/mk-<svc>/daemon-ipc.sock` bind. One binds, the loser hits EADDRINUSE → its `canUnlinkExistingSocket` throws/refuses → loser aborts; later the winner's transient instance closes+unlinks, leaving the orphaned inode. spec-memory survives the same race because its permissive branch always reclaims and rebinds.

**F6 — Intent reconciliation: this is post-012 drift, exactly as 012 D-001 warned. [confidence: HIGH]**
- 012 copied `socket-server.ts` **verbatim** (`implementation-summary.md:104`) and its EADDRINUSE handling at copy time was the permissive unlink-retry (`:178` rationale notes "handled by socket-server.ts via unlink-retry"). The `canUnlinkExistingSocket` + dir-ownership hardening (commented `DR-008-01` in the code-index copy `:173`) was added to the two copies LATER (mtimes May 29 / Jun 3 per iter-1 F5) and NEVER back-ported to the spec-memory copy — so the WORKING copy never got the race-introducing guard. 018-front-proxy-recycle-hardening only touched the spec-memory launcher (report→`-32001`, FATAL-throw, proxy probe window) and explicitly DEFERRED owner-socket-path storage ((c), `spec.md:76`); it did not address the code-index/advisor bind race.

**RULED OUT / REFINED this iteration:**
- iter-1 ranked-#1 "close() unlink race" as the prime mechanism — REFINED: close() is identical across copies (F4); the divergence is the bind-time guard, not teardown.
- "A secondary launcher races the primary's bound socket" — RULED OUT: secondaries report/bridge, they never bind (F5). The racer is a second primary.
- "spec-memory has an owner-fence the others lack" (the smoking-gun the brief hypothesized) — INVERTED: the others have the extra gate; spec-memory's ABSENCE of it is why spec-memory works. The asymmetry is real but points the other way.

## Questions Answered
- **KQ3 (T2 why not serving):** LOCKED. The bridge binds at startup (iter-1 F1/F2), but under N-way primary-vs-primary contention the two non-spec-memory daemons hit `EADDRINUSE` and their added `canUnlinkExistingSocket()` gate (`socket-server.ts:118-131` / `:131-`) either throws ENOENT (TOCTOU, F1) or refuses on a uid/realpath mismatch (F2) — so they fail to reclaim+rebind, leaving an orphaned inode with no listener. spec-memory's permissive copy (`:196-207`) always reclaims, so it survives. Root cause = **drifted, non-race-safe socket-reclaim guard in the two copies (post-012 D-001 drift), triggered by N-way EADDRINUSE contention.**
- **KQ T2-design:** Reconciled. 012 shipped the permissive copy and smoke-tested single-secondary only; the race-introducing guard is later drift; 018 hardened only spec-memory's launcher and deferred the socket-path-in-lease fix. N-way primary survival was never an SC.

## Ranked Root-Cause Conclusion (T2) — LOCKED
1. **Non-race-safe `canUnlinkExistingSocket` reclaim gate in the two drifted copies [HIGH].** On EADDRINUSE, `fs.lstatSync(socketPath)` with no ENOENT guard (code-index `socket-server.ts:123`, advisor equiv) throws under a TOCTOU race, OR the uid/realpath checks (`:119-128`) refuse a benign stale socket → `throw err` (`:242-243`/`:255-256`) → bind aborts. spec-memory lacks this gate (`:196-207`) and always reclaims. This is THE asymmetry.
2. **Dir-ownership `statSync` throw block (code-index `:171-188`) [MEDIUM-HIGH]** — a secondary throw site on the same bind path; a uid/mode mismatch on a pre-existing `/tmp/mk-*` dir aborts the bind. Contributing, same root (post-012 hardening drift not in spec-memory).
3. **Contributing: three-copy md5 drift (iter-1 F5)** — the vehicle that let #1/#2 exist in only two copies. Reconvergence is part of the fix, not a separate cause.

(Demoted from iter-1: close()-unlink race — F4 shows close() is identical, so it is not the differentiator.)

## Design-conformant fix surface (do NOT implement)
- **Make `canUnlinkExistingSocket` race-safe:** wrap `lstatSync` so ENOENT → return `true`/`false` gracefully (a vanished socket is reclaimable, not an error); treat realpath/uid checks as best-effort under the workspace+tmp allowlist rather than hard `throw err`. The bind must degrade to reclaim-and-retry (spec-memory's behavior), never abort, on a benign stale unix socket.
- **Reconverge the three `socket-server.ts` copies** behind one shared module (012 D-001 follow-up) so the bind/EADDRINUSE/teardown contract cannot drift again; the security hardening (dir-ownership, owner-only unlink) should live there ONCE and be race-safe.
- Optionally land 018's deferred (c) (store owner's actual socket path in the lease) to remove `SPECKIT_IPC_SOCKET_DIR` canonicalization divergence (`018/spec.md:76`) — it feeds F2.
- Surface is the bridge/socket-server layer + the two daemon copies, NOT the launchers (F5).

## Questions Remaining
- Whether the EADDRINUSE racer is the trio-recycle vs a codex primary specifically (would need a stderr `[ipc-bridge]` capture or a reproduction; current evidence is structural + live-state, sufficient to lock the mechanism).
- T1 entirely unvalidated (probe = demand) — KQ1/KQ2 (`model-server-supervision.cjs` probe→demand, `hf-local.ts` wake path).

## Next Focus
T2 is LOCKED. Iteration 3 pivots to **T1**: validate the probe-equals-demand mechanism in `.opencode/bin/lib/model-server-supervision.cjs` (`prepareModelServerDemandTarget` :1160-1168, `handleModelServerDemand` :1204-1238 — any-HTTP→spawn, routePath log-only) and `launcher-ipc-bridge.cjs` (`probeModelServer` :230-306 emits literal `GET /api/health`), and confirm whether `HfLocalProvider`'s real embed path relies on `GET /api/health` to wake the server (so the conformance fix moves the wake to a real embed POST) — `shared/embeddings/providers/hf-local.ts`. READ-ONLY; do NOT contact hf-embed.sock. Then assemble the unified T1+T2 design-conformance fix plan.
