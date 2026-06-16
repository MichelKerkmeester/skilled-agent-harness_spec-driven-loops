# Seat opus-concurrency-race — iteration 4 (global #29)

- Model: `claude-opus-4-8` · Executor: claude · Angle: opus-concurrency-race
- Verdict: **CONDITIONAL** · Findings: P0=0 P1=1 P2=1

## Analysis

## Review: opus-concurrency-race — writer-lock races in 027 new code

I traced the owner-lease writer-lock across all three daemon launchers shipped/hardened in 027. There is a genuine check-then-act gap in the **owner-lease reclaim path** that the 156 self-tests missed — and it is replicated verbatim across all three launchers.

### The defect — non-exclusive reclaim + "I-wrote-last" deletion guard

`acquireOwnerLeaseFile()` has two write paths:

- **No prior lease** (spec-memory `:465-476`): uses `writeOwnerLeaseFileExclusive` (`fs.openSync(path, 'wx')`, O_EXCL) — genuinely race-safe.
- **Reclaim of a stale lease** (`:478-489`): uses non-exclusive `writeOwnerLeaseFile` (write-tmp + `renameSync`, last-writer-wins) followed by a re-read.

The comment at `:478` claims: *"Re-read after reclaim so two launchers racing a stale lease cannot both act as owner."* **This claim is false.** With two launchers (A, B) reclaiming the same crashed owner's stale lease, this interleaving has both return `acquired:true`:

```
A: writeOwnerLeaseFile(A)
A: reread → ownerPid==A → ownerLeasePid=A, acquired:true   (A returns)
B: writeOwnerLeaseFile(B)        // last writer; file now ownerPid==B
B: reread → ownerPid==B → ownerLeasePid=B, acquired:true   (B returns)
```

The re-read only catches a writer that interleaves *between* one process's own write and read — it provides no compare-and-swap. The devs in fact *knew* this: the comment at `mk-spec-memory-launcher.cjs:1613-1617` concedes the reclaim is "a non-exclusive write … two fresh launchers racing a crashed owner could both reach the reap and spawn" and adds the separate **respawn lock** (`:1618`) to serialize the daemon spawn. So daemon-spawn safety is real — but it lives in a *different* lock, and the owner-lease's own re-read does not deliver the invariant its comment advertises.

### Why it causes a real failure — the loser deletes the winner's lease

`clearOwnerLeaseFile()` (`:537-551`) guards its `unlink` with "the file's ownerPid equals *my* `ownerLeasePid`" — i.e. *"I wrote the file last."* That is not the same as *"I won the election."* In the race above, B wrote the owner-lease file last (`ownerPid==B`), so B's guard passes. But the owner-lease write order (`:479`) and the respawn-lock acquisition (`:1618`) are separated by `isLeaseHeld()` + a multi-second JSON-RPC liveness probe (`:1595`) — they are uncorrelated. So this is fully reachable:

1. A and B both `acquired:true`; file ends `ownerPid==B`.
2. A wins the respawn lock (`:1618`); B loses → B runs the loser path `:1619-1624`: `clearOwnerLeaseFile()` → file `ownerPid==B==ownerLeasePid` → **unlinks the owner lease** → exit.
3. A (real winner) reaps + spawns the daemon, then `launchServer` calls `refreshOwnerLeaseFile(A)` (`:1329`) → file is gone → returns false → logs but **does not recreate** (`:1331`).
4. `startOwnerLeaseHeartbeat(A)` fires → `refreshOwnerLeaseFile(A)` → null → false → triggers *"owner lease heartbeat refresh failed; shutting down launcher to preserve single ownership"* (`:520-527`) → **A self-terminates**, despite being the legitimate elected owner.

Net effect: the just-elected owner kills itself within one heartbeat interval, leaving an orphaned (re-elected, detached) daemon and **no live owner/heartbeat** until the next session adopts it. With `SPECKIT_DAEMON_REELECTION=0`, A's shutdown `clearAllLeaseFiles` can tear the daemon down entirely, leaving a window with neither daemon nor owner lease.

**Mitigations that bound severity (honest):** the DB-open kernel single-writer lock prevents corruption; the respawn lock prevents two daemons spawning; the next launcher adopts/respawns, so it self-heals. Impact is spurious owner self-termination, ownership churn, an ownerless window, and misleading "preserve single ownership" log noise — not data loss. I rate it **P1** because the single-ownership invariant the code explicitly claims to hold is violated and the wrong (winning) process loses ownership; a reviewer could defend P2 given self-healing.

### Parity — same code in all three 027 launchers

- `mk-skill-advisor-launcher.cjs:502-512` — identical non-exclusive reclaim; `checkStrictSingleWriter` starts the heartbeat at `:723` then has multiple loser/bridge paths calling `clearOwnerLeaseFile()` (`:727, :752, :769`), each able to delete a lease the racing winner depends on. Same class.
- `mk-code-index-launcher.cjs:475` (`writeOwnerLeaseFile(lease)` reclaim) + `clearOwnerLeaseFile` `:505` + loser path `:975` — same machinery.

**Fix:** make the owner-lease reclaim atomic — on a stale classification, `unlink` the existing lease then `writeOwnerLeaseFileExclusive` (O_EXCL); on `EEXIST`, the other launcher won → re-read and bail. That collapses both the no-prior-lease and reclaim cases to a single CAS so exactly one process can ever hold `acquired:true`, which also makes the "I-wrote-last" deletion guard correct. Apply identically to all three launchers, and correct the misleading `:478`-class comment.

```json
{"seat":"opus-concurrency-race","model":"claude-opus-4-8","angle":"Writer-lock races (nonce + ownership-check class that self-tests missed in 156): scan new write-locks for check-then-act gaps.","verdict":"CONDITIONAL","summary":"Owner-lease stale-reclaim is non-exclusive (rename+reread, not CAS); two launchers can both acquire, and clearOwnerLeaseFile's 'I-wrote-last' guard lets a loser delete the winner's lease, self-terminating the real owner. Replicated in all 3 launchers.","files_reviewed":[".opencode/bin/mk-spec-memory-launcher.cjs",".opencode/bin/mk-skill-advisor-launcher.cjs",".opencode/bin/mk-code-index-launcher.cjs"],"findings":[{"severity":"P1","dimension":"correctness","title":"Owner-lease stale-reclaim is non-exclusive; re-read does not prevent double-acquire, and loser deletes winner's lease","file":".opencode/bin/mk-spec-memory-launcher.cjs:478","evidence":"Reclaim path (:479) writes via renameSync (last-writer-wins) then re-reads; comment (:478) claims 'two launchers racing a stale lease cannot both act as owner' but the re-read is not a CAS — interleave A:write/A:read(A,acquired) then B:write/B:read(B,acquired) and both return acquired:true. The code itself concedes non-exclusivity at :1613-1617 and only serializes the daemon SPAWN via a separate respawn lock (:1618). clearOwnerLeaseFile (:541-543) unlinks when file.ownerPid==my ownerLeasePid ('I wrote last'), not 'I won the election'. Loser path :1619-1624 calls clearOwnerLeaseFile() on respawn-lock loss; if the loser wrote the owner-lease last it unlinks the file. The respawn-lock winner then hits refreshOwnerLeaseFile (:1329→:493) returning false (file gone, not recreated, :1331) and its heartbeat (:520-527) self-terminates the launcher 'to preserve single ownership'.","why":"Defeats the single-ownership invariant the code explicitly claims: the legitimately-elected owner kills itself within one heartbeat, leaving an orphaned/torn-down daemon and an ownerless window. Reachable whenever two sessions start near-simultaneously after an owner crash (the exact ownership-check class 156 self-tests missed). Self-heals via adopt/respawn and DB kernel lock prevents corruption, so no data loss — but real churn, a no-owner window, and misleading shutdown logs.","recommendation":"Make reclaim atomic: on stale classification, unlink the existing owner lease then writeOwnerLeaseFileExclusive (O_EXCL); on EEXIST, re-read and return acquired:false. This collapses both paths to one CAS so only one process gets acquired:true and makes the clearOwnerLeaseFile 'last-writer' guard correct. Apply identically to mk-skill-advisor-launcher.cjs:502-512 and mk-code-index-launcher.cjs:475, and fix the false :478-class comment."},{"severity":"P2","dimension":"correctness","title":"Same non-exclusive owner-lease reclaim race replicated in skill-advisor and code-index launchers","file":".opencode/bin/mk-skill-advisor-launcher.cjs:502","evidence":"mk-skill-advisor-launcher.cjs:502-512 is the identical rename+reread reclaim; checkStrictSingleWriter starts the heartbeat at :723 then calls clearOwnerLeaseFile() on loser/bridge paths :727,:752,:769. mk-code-index-launcher.cjs:475 reclaim + clearOwnerLeaseFile :505 + loser path :975 mirror the pattern.","why":"Identical check-then-act ownership race; without the fix, all three daemons share the spurious self-termination / ownership-churn failure mode.","recommendation":"Apply the same atomic-reclaim (unlink + O_EXCL CAS) fix to both launchers in lockstep with the spec-memory fix; consider hoisting the owner-lease acquire/clear helpers into .opencode/bin/lib to prevent future divergence."}]}
```
