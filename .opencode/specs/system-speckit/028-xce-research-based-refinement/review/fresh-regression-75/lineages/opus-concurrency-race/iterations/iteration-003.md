# Seat opus-concurrency-race — iteration 3 (global #28)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-concurrency-race
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=2 P2=0

## Analysis

## Review — seat `opus-concurrency-race`

**Angle:** single-writer / lease guard in the shared daemon path; shared daemon child re-election; any unguarded concurrent writer.

### What I traced

The single-writer design across the three launchers has two layers:

1. **Owner lease** (`O_EXCL` create via `'wx'` for the no-existing case, last-writer-wins tmp+rename + re-read confirm for the stale-reclaim case) — this is the real mutex; only one launcher survives `acquireOwnerLeaseFile()`.
2. **PID lease** (`process.kill(pid,0)` liveness) — the authoritative "is a live daemon present" backstop.
3. **Bootstrap lock** (`mkdir(lockDir)` directory mutex) — serializes daemon bootstrap/migration and the `requireLock:true` dead-socket **respawn** path.

The owner-lease + PID-lease interplay is sound: the `O_EXCL` create race is closed, and the stale-reclaim path's re-read-after-rename guarantees exactly one survivor (`mk-code-index-launcher.cjs:472-485`). Migration was already hardened to gate on `lockHeld` + `COPYFILE_EXCL`. No double-DB-writer hole there.

The defect is in **layer 3, the bootstrap lock**, and it is a *regression relative to the team's own fix*.

### Finding: bootstrap-lock stale-reclaim is mistuned, defeating its stated purpose (spec-memory + code-index)

`mk-skill-advisor-launcher.cjs:1091-1100` documents the correct design and implements it: the lock dir stamps the holder PID (`:1126`), and `removeStaleBootstrapLock` reclaims **the instant the holder is provably dead** (`processLiveness(ownerPid) === 'dead'`), with the 5-min mtime TTL as a fallback only. Its own comment states the rationale: *"an mtime TTL alone would otherwise wedge every new session for up to staleMs after a launcher is SIGKILLed or crashes while holding the lock."*

The other two launchers still rely on **mtime TTL only**, with the TTL set *above* the wait deadline:

- **spec-memory:** `BOOTSTRAP_LOCK_STALE_MS = 300000` (`:95`); wait `deadline = Date.now() + 120000` (`:1257`); reclaim gated on `ageMs > BOOTSTRAP_LOCK_STALE_MS` (`:1270`); throw at `:1291-1293`. No PID stamp (`:1266` comment admits *"the lockdir records no pid"*).
- **code-index:** `STALE_LOCK_MS = 5*60*1000` (`:822`); `deadline = Date.now() + 120000` (`:821`); reclaim at `:839`; throw at `:855-857`. No PID stamp.

Because **stale-threshold (300s) > wait-deadline (120s)**, the per-iteration reclaim check can never fire for a holder that died within the last 5 minutes: the 120s deadline always throws first. The mtime reclaim only helps when the lock was *already* >5min old at the very first `statSync` (a long-abandoned leftover). For the realistic case — the daemon launcher was SIGKILLed/OOM-killed/crashed seconds ago — a `requireLock:true` respawn (`mk-spec-memory-launcher.cjs:798`, `mk-code-index-launcher.cjs:654`) blocks the **full 120s** then throws `bootstrap lock timed out`, leaving **no daemon** until a later retry.

This directly contradicts the spec-memory comment at `:1266-1267`: *"so a crashed holder cannot block a requireLock respawn for the full 120s deadline"* — the code cannot deliver that guarantee.

**Impact:** bounded but real — after a hard kill of the spec-memory or code-index daemon, the shared-daemon respawn path stalls ~2 min and errors instead of promptly reclaiming and re-electing, degrading memory/code-graph MCP availability across sessions. The fix already exists one file over (PID-stamp the lockdir, reclaim on provable death); two of three launchers simply didn't get it.

Everything else in the single-writer path checked out — no concurrent-writer hole, no unguarded shared-index mutation.

```json
{"seat":"opus-concurrency-race","model":"claude-opus-4-8","angle":"Shared-daemon single-writer under multi-session: the shared git index / shared daemon child — any unguarded concurrent writer.","verdict":"CONDITIONAL","summary":"Bootstrap-lock stale-reclaim in spec-memory & code-index launchers uses mtime-TTL(300s) > wait-deadline(120s), so a SIGKILL'd holder wedges respawn for the full 2min then throws; skill-advisor already fixed this with PID-stamped provable-death reclaim.","files_reviewed":[".opencode/bin/mk-code-index-launcher.cjs",".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/mk-skill-advisor-launcher.cjs",".opencode/bin/lib/launcher-ipc-bridge.cjs"],"findings":[{"severity":"P1","dimension":"correctness","title":"spec-memory bootstrap-lock reclaim can never fire within its own deadline (mtime TTL 300s > wait deadline 120s); comment claims the opposite","file":".opencode/bin/mk-spec-memory-launcher.cjs:1270","evidence":"BOOTSTRAP_LOCK_STALE_MS=300000 (:95) but wait deadline=Date.now()+120000 (:1257); reclaim gated on ageMs>BOOTSTRAP_LOCK_STALE_MS (:1270) and the deadline throws at :1291. No holder PID is stamped (:1266 says 'the lockdir records no pid'). For any holder that died <5min ago, the 120s deadline always throws before the 5min staleness is reached, so the requireLock:true respawn path (:798) blocks the full 120s then errors 'bootstrap lock timed out'. The comment at :1266-1267 ('a crashed holder cannot block a requireLock respawn for the full 120s deadline') is therefore false.","why":"After a SIGKILL/OOM/crash of the spec-memory daemon launcher, the shared-daemon respawn stalls ~2min and throws instead of reclaiming, leaving the memory MCP with no live daemon. The sibling launcher already proves this is a fixable defect, not an accepted tradeoff.","recommendation":"Port skill-advisor's pattern: stamp the holder PID inside lockDir on mkdir (mk-skill-advisor-launcher.cjs:1126) and reclaim as soon as processLiveness(ownerPid)==='dead' (mk-skill-advisor-launcher.cjs:1096-1100), keeping the mtime TTL only as the no-PID fallback. Alternatively set BOOTSTRAP_LOCK_STALE_MS below the 120s deadline, but PID-based reclaim is the correct fix and matches the comment's intent."},{"severity":"P1","dimension":"correctness","title":"code-index bootstrap-lock reclaim has the same mtime-TTL(300s) > deadline(120s) mistuning, blocking dead-socket respawn","file":".opencode/bin/mk-code-index-launcher.cjs:839","evidence":"STALE_LOCK_MS=5*60*1000 (:822) with deadline=Date.now()+120000 (:821); reclaim gated on Date.now()-mtimeMs>STALE_LOCK_MS (:839), deadline throw at :855-857. acquireBootstrapLock is called with requireLock:true from the dead-socket respawn path (:654). No PID stamp on lockDir (acquireBootstrapLock at :818-861 only mkdir's the dir). A holder killed <5min ago cannot be reclaimed before the 120s deadline expires.","why":"Identical regression: after a hard kill of the code-index daemon, respawnAfterDeadSocket blocks 2min and throws rather than promptly reclaiming the bootstrap lock and re-spawning, degrading code-graph MCP availability across sessions.","recommendation":"Apply the same PID-stamp + provable-death reclaim used in mk-skill-advisor-launcher.cjs:1080-1112 (stamp pid at mkdir, reclaim when processLiveness(ownerPid)==='dead'), retaining the 5min mtime path as the unstamped-lock fallback."}]}
```
