# Iteration 001 — opus-3 fan-out lineage (native opus)

**Mode:** review · **Iteration:** 1 of 1 (maxIterations) · **Dimensions this pass:** correctness, security, traceability, maintainability (breadth)
**Target type:** files · **Lineage:** fanout-opus-3

## Scope reviewed (recent daemon-reliability + reap + hook-portability work)

| File | What I focused on |
|------|-------------------|
| `.opencode/bin/mk-spec-memory-launcher.cjs` | The new stale-lease reclaim reap (`main()` 1482–1502), `reapLeaseChildBeforeRespawn` (691–727), release path (`shutdownLauncherForSignal` 1359–1385), lease liveness (`leaseHeldFromFile` 556–572), owner-lease mutex (`acquireOwnerLeaseFile` 443–481), header comment (185–197) |
| `.opencode/bin/lib/model-server-supervision.cjs` | `processLiveness` 274, `signalProcess` 295, `waitForPidExit` 286, `reapProcessTreeGroups` 334 |
| `.opencode/bin/lib/launcher-ipc-bridge.cjs`, `launcher-session-proxy.cjs`, `mk-code-index-launcher.cjs` | Recent-change surface only (reconnecting proxy port, probe hardening) |
| `daemon-reelection-adoption-live.vitest.ts`, `daemon-reelection-release-integration.vitest.ts` | Test coverage vs the shipped guarantees |
| `.claude/settings.local.json`, `.codex/hooks.json`, `.devin/hooks.v1.json` | Hook portability rewrite |
| `.opencode/scripts/session-cleanup.sh`, `check-comment-hygiene.sh` | Ancestry safety + checker logic |

Method: read the actual diffs (`git show` of the 4 reap/hook commits + window log), then re-read every cited file:line. Findings below are substantiated by code, not inference.

---

## FINDINGS

### F1 [P1, borderline P0] — Fresh-session reap kills a daemon a LIVE secondary is still bridged to (defeats the re-election promise)

**Evidence:**
- `.opencode/bin/mk-spec-memory-launcher.cjs:1482-1502` — the stale-reclaim branch reaps `staleLease.childPid` purely on `leaseResult.staleReclaimable`, with **no check that the daemon's socket is dead or that it has no active clients**.
- `.opencode/bin/mk-spec-memory-launcher.cjs:564-567` (`leaseHeldFromFile`) — `staleReclaimable` is keyed on the liveness of the *owner* `lease.pid` (ESRCH → `held:false, staleReclaimable:true`). It is **never** keyed on the daemon `childPid`, which is the process that is actually alive and serving.
- `.opencode/bin/mk-spec-memory-launcher.cjs:1372-1384` (release path) — on owner disposal the launcher KEEPS the daemon lease (`removeListener('exit', clearAllLeaseFiles)` then only `clearOwnerLeaseFile()`). So the surviving daemon lease records a *dead* owner pid plus a *live* `childPid`.
- `daemon-reelection-adoption-live.vitest.ts:194-207` — test case 1 proves a secondary bridges to that exact daemon and `statsOk(secondary)===true` AFTER owner disposal.

**Scenario (normal multi-session workflow):** Owner + Secondary both running; Secondary bridged to daemon D. Owner session is disposed → D is *released* (alive), owner lease dropped, daemon lease kept (`pid=deadOwner, childPid=D`). Secondary keeps using D (the feature's headline guarantee). Now a **third/fresh** session starts: `acquireOwnerLeaseFile()` succeeds (owner lease was dropped → O_EXCL path), `isLeaseHeld()` returns `staleReclaimable` because the recorded owner pid is dead, and `main()` **reaps `childPid=D`** — SIGTERM→SIGKILL — even though the Secondary is actively bridged to D. The Secondary's transport drops mid-flight and its in-flight RPC is lost; the fresh session then spawns D′.

**Why it matters:** This contradicts the shipped guarantee documented in the same commit set ("a session ending does not tear the shared backend out from under other sessions", launcher 185-197) and in shared-context ("a connected secondary keeps transport through owner disposal"). The reap fixes the *no-secondary* double-writer case but regresses the *live-secondary* case: any subsequently-started session evicts the daemon an existing secondary depends on. The dead-socket respawn path (`respawnAfterDeadSocket`, gated on a *confirmed-dead* socket, 749-817) is the correct model; this new path skips the liveness gate.

**Severity rationale:** P1 (degraded behaviour + dropped transport + lost in-flight request) rather than P0 because the Secondary's reconnecting session-proxy can re-attach to D′ on the stable socket path, so the disruption is transient and there is no DB corruption (reap attempts a clean close). Flagged borderline-P0 because it defeats the feature's central promise under a common trigger.

**Right fix (plan seed):** before reaping on `staleReclaimable`, probe the daemon socket; if live, **adopt/bridge** to it (and rewrite the lease owner to self) instead of reaping+respawning. Only reap when the socket is confirmed dead or unowned.

#### Claim-adjudication packet (F1)
- **findingId:** F1
- **claim:** The stale-lease reclaim branch reaps a still-alive daemon `childPid` without verifying its socket is dead, so a fresh session can kill a daemon a live secondary is bridged to.
- **evidenceRefs:** `mk-spec-memory-launcher.cjs:1482`, `mk-spec-memory-launcher.cjs:1491`, `mk-spec-memory-launcher.cjs:564`, `mk-spec-memory-launcher.cjs:1372`, `daemon-reelection-adoption-live.vitest.ts:206`
- **counterevidenceSought:** Looked for (a) a socket-liveness/active-client gate in the `staleReclaimable` branch — none between 1482–1502; (b) a bridge attempt before reap — `main()` 1476-1482 only bridges when `held && !staleReclaimable`, so a stale (dead-owner) lease never bridges; (c) `childPid`-keyed liveness in `leaseHeldFromFile` — absent.
- **alternativeExplanation:** "The reap is the intended single-writer tradeoff and the secondary auto-recovers." Partially true (it recovers via reconnect) but it still drops transport + loses in-flight work and breaks the documented guarantee, so it is a real defect, not merely a tradeoff. Rejected as a reason to dismiss.
- **finalSeverity:** P1
- **confidence:** 0.85 (mechanism), 0.6 (impact bounded by reconnect)
- **downgradeTrigger:** If the daemon lease is in fact cleared by the released daemon itself on the *first* secondary-adoption (so a fresh session never sees a stale lease pointing at a live, secondary-served daemon), this downgrades to P2. I found no such clearing.

---

### F2 [P2] — Reap has no process-identity check → PID reuse can SIGKILL an unrelated process

**Evidence:** `.opencode/bin/mk-spec-memory-launcher.cjs:1491-1492` calls `reapLeaseChildBeforeRespawn(orphanChildPid)`; that function (`691-727`) decides solely on `processLiveness(childPid)` (`model-server-supervision.cjs:274`, a bare `process.kill(pid,0)` existence probe) and then `signalProcess(childPid,'SIGTERM')` + `reapProcessTreeGroups` + SIGKILL. There is **no** verification that the live pid is the daemon (no cmdline match, no `childStartedAt` in the lease, no socket-identity check).

**Why it matters:** A released daemon "reparents to pid 1, bounded by its idle self-exit" (launcher 195-196). When it self-exits (or crashes) and the OS recycles `childPid` before a fresh session arrives, the stale lease still records the old `childPid`, so the reap SIGTERM/SIGKILLs whatever unrelated process now holds that pid. Low probability (pid-space reuse) but the blast radius is "kill an arbitrary process". Same missing-guard root cause as F1; widened here because the stale-lease window can be long (idle timeout, not the dead-socket path's immediate detection).

---

### F3 [P2] — Stale-reclaim EPERM path reports "lease held, reconnect" instead of bridging to the live daemon socket

**Evidence:** `.opencode/bin/mk-spec-memory-launcher.cjs:1493-1500` — when `reapLeaseChildBeforeRespawn` returns `!allowed` (e.g. `child-liveness-unknown-eperm`), the branch does `clearOwnerLeaseFile()` + `writeLeaseHeldJsonRpcError(...)` + `process.exit(0)`. It never tries to bridge to the daemon's (still-live) socket.

**Why it matters:** EPERM means the daemon is alive but unsignalable; its socket is presumably still serving. The dead-socket path uses `bridgeOrReportLeaseHeldAndExit` (1459/1472/1479) to actually attach the host to the live socket. Here the host is told to "reconnect", and the next reconnect re-hits the same EPERM → the same report, i.e. a reconnect loop with no transport even though a usable daemon socket exists. Practically rare (requires the child to run under a different uid than the launcher), hence P2, but the path is inconsistent with the rest of the launcher's lease-held handling.

---

### F4 [P2] — Hook commands switched from absolute `/opt/homebrew/bin/node` to bare `node`; minimal-PATH / GUI-launched environments lose the interpreter

**Evidence:** `.claude/settings.local.json:38,50,62,79,92` (and `.codex/hooks.json:9,20`, `.devin/hooks.v1.json:8,20`) now run `... && node <relative>` instead of `/opt/homebrew/bin/node`.

**Why it matters:** The portability fix correctly removes the Linux-breaking abs path and hardcoded project dir — that part is sound. But replacing the absolute interpreter with bare `node` makes every hook depend on `node` being on the `bash -c` PATH. A macOS Claude/Codex app launched from Finder/Dock (not a terminal) commonly inherits a minimal PATH (`/usr/bin:/bin:/usr/sbin:/sbin`) that excludes `/opt/homebrew/bin`; the previous absolute path worked regardless. Net: fixed Linux/Barter, possibly regressed macOS GUI launches. P2 because the CLI is normally run from a full-PATH terminal and hook failure is non-fatal (timeouts / `|| true`), but it is a real cross-environment tradeoff worth a PATH-resolution guard or `command -v node` fallback.

---

### F5 [P2] — `reapLeaseChildBeforeRespawn` returns `allowed:true` without confirming the SIGKILL'd child actually exited

**Evidence:** `.opencode/bin/mk-spec-memory-launcher.cjs:710-715` — after SIGKILL it does `await waitForPidExit(childPid, 1000)` but **discards the result** and unconditionally returns `{allowed:true, reaped:true}` at 726.

**Why it matters:** If the child survives SIGKILL within the 1 s window (uninterruptible-sleep "D" state, e.g. blocked on slow disk during a WAL flush), the function still reports the reap succeeded, `main()` proceeds to `writeLeaseFile()` + `launchServer()`, and two daemons momentarily hold the same WAL DB — the exact single-writer violation this fix exists to prevent. Rare and shared with the pre-existing dead-socket path, hence P2, but the post-SIGKILL exit should be verified before declaring the reap clean.

---

### F6 [P2, test gap] — The live adoption test only proves single-writer when NO secondary is bridged; it never exercises the F1 regression

**Evidence:** `daemon-reelection-adoption-live.vitest.ts:210-243` ("a FRESH session after owner disposal reaps the released daemon") disposes the owner and starts a fresh session **with no secondary present**, then asserts single-writer. Case 1 (183-208) has a secondary but never starts a fresh session afterward.

**Why it matters:** The two guarantees — "secondary keeps transport" and "fresh session restores single writer" — are tested in isolation, so their interaction (fresh session arrives *while a post-disposal secondary is bridged*) is uncovered. That uncovered interaction is precisely F1. A third case (owner + secondary, dispose owner, secondary still live, start fresh session, assert secondary transport survives AND single writer) would have caught F1.

---

## Adversarial self-check summary
- F1 survived Hunter/Skeptic/Referee: mechanism confirmed across 5 file:line citations + a passing test that proves secondary adoption; impact bounded by reconnect → P1 not P0.
- F2–F6 are P2 (low probability or quality/coverage), each with direct file:line evidence; none upgraded.

## Coverage / convergence note
Single-iteration fan-out lineage (`maxIterations=1`). Breadth pass touched all 4 dimensions: correctness (F1, F2, F5), availability/security-adjacent (F3, F4), traceability (header-vs-code default-off check passed — `daemonReelectionEnabled` 198-200 returns off-by-default, matching the revised comment 185-197), maintainability/tests (F6). Not run to full 4-dimension stabilized convergence by design.

```json
[
  {"severity":"P1","file":".opencode/bin/mk-spec-memory-launcher.cjs","line":1482,"title":"Fresh-session stale-reclaim reap kills a daemon a live secondary is still bridged to","detail":"The staleReclaimable branch (1482-1502) reaps staleLease.childPid with no socket-liveness/active-client gate; staleReclaimable is keyed on the dead OWNER pid (leaseHeldFromFile 564-567), not the live daemon childPid; release path (1372-1384) keeps the daemon lease + drops only the owner lease. So after an owner is disposed while a secondary is bridged to daemon D (proven by adoption test 206-207), a newly-started session reaps D out from under the secondary, dropping its transport + in-flight RPC, then spawns D'. Contradicts the documented 're-election keeps the backend for other sessions' guarantee. Bounded to P1 (not P0) because the secondary's reconnecting proxy re-attaches to D' on the stable socket and there is no DB corruption.","confidence":"high"},
  {"severity":"P2","file":".opencode/bin/mk-spec-memory-launcher.cjs","line":1491,"title":"Reap has no process-identity check; PID reuse can SIGKILL an unrelated process","detail":"reapLeaseChildBeforeRespawn(orphanChildPid) (691-727) decides only on processLiveness existence probe then SIGTERM/SIGKILLs childPid with no cmdline/childStartedAt/socket-identity verification. If the released daemon self-exits on idle timeout and the OS recycles childPid before a fresh session arrives, the stale lease still records the old pid and the reap kills whatever now holds it. Low probability, high blast radius; same missing-guard root as F1, widened by the long idle-timeout window.","confidence":"high"},
  {"severity":"P2","file":".opencode/bin/mk-spec-memory-launcher.cjs","line":1493,"title":"Stale-reclaim EPERM path reports lease-held-reconnect instead of bridging to the live daemon socket","detail":"On reap !allowed (e.g. child-liveness-unknown-eperm) the branch (1493-1500) clears the owner lease, writes a lease-held JSON-RPC error and exits without attempting to bridge to the daemon's still-live socket. EPERM means the daemon is alive; the dead-socket path uses bridgeOrReportLeaseHeldAndExit to attach the host. Here the next reconnect re-hits the same EPERM, yielding a reconnect loop with no transport despite a usable socket. Rare (cross-uid child) hence P2, but inconsistent with the rest of the lease-held handling.","confidence":"med"},
  {"severity":"P2","file":".claude/settings.local.json","line":38,"title":"Hooks switched from absolute /opt/homebrew/bin/node to bare node; minimal-PATH/GUI launches lose the interpreter","detail":"settings.local.json (38,50,62,79,92), .codex/hooks.json (9,20) and .devin/hooks.v1.json (8,20) now run bare `node <relative>`. Removing the abs path fixes Linux/Barter, but bare node depends on the bash -c PATH containing node; a macOS app launched from Finder/Dock inherits a minimal PATH excluding /opt/homebrew/bin, where the previous absolute path worked. Fixed one OS, possibly regressed macOS GUI launches. P2: CLI normally has full PATH and hook failure is non-fatal; consider a `command -v node` / explicit-path fallback.","confidence":"med"},
  {"severity":"P2","file":".opencode/bin/mk-spec-memory-launcher.cjs","line":713,"title":"reapLeaseChildBeforeRespawn returns allowed:true without confirming the SIGKILL'd child exited","detail":"After SIGKILL the function awaits waitForPidExit(childPid,1000) (713) but discards the result and unconditionally returns allowed:true (726). A child surviving SIGKILL within the window (uninterruptible-sleep on a slow WAL flush) is reported as reaped; main() then spawns a replacement while the old daemon still holds the DB — a transient double-writer, the exact invariant this fix protects. Rare and shared with the dead-socket path, hence P2.","confidence":"med"},
  {"severity":"P2","file":".opencode/skills/system-spec-kit/mcp_server/stress_test/durability/daemon-reelection-adoption-live.vitest.ts","line":210,"title":"Adoption test never exercises fresh-session reap while a secondary is bridged (the F1 gap)","detail":"Case 2 (210-243) starts a fresh session with NO secondary present; case 1 (183-208) has a secondary but never starts a fresh session after disposal. The interaction 'fresh session arrives while a post-disposal secondary is bridged' — exactly the F1 regression — is uncovered. A third case (owner+secondary, dispose owner, secondary still live, start fresh session, assert secondary survives AND single writer) would catch F1.","confidence":"high"}
]
```

Review verdict: CONDITIONAL
