# Open Question Iteration 001

**Model:** `swe-2-max` via cli-devin  
**Angle:** The sweep's liveness proof: what marker proves a worktree is still owned, who writes it and when, how it survives an interrupted run, and whether the existing loop-lock lease can simply be projected into the worktree namespace instead of inventing a second mechanism

---

Now checking the remaining lock exports, the lock's call-site TTL conventions, and what the prior synthesis already concluded about the sweep.## Findings

- **The loop-lock lease is fully path-agnostic — projection needs no new mechanism.** `acquireLoopLock(lockPath, data)` takes an arbitrary path and is already imported lazily by the runner for a different namespace question (`fanout-run.cjs:587`). A worktree marker is just a new `lockPath`; nothing in the acquire/refresh/release/reclaim path is bound to an artifact dir. `loop-lock.ts:565-590`
- **The lock record already carries every field a sweep needs, no schema change.** `ownerPid`, `startedAtIso`, `ttlMs`, `lastHeartbeatIso`, `packetId`, `runtimeKind`, `acquireNonce`, `phase` — `packetId` can carry the runId (`fanout-run.cjs:2697`) and `phase` the lineage label or a terminal `retained` state. `loop-lock.ts:14-24,74-84`
- **Staleness is already the correct OR.** `isStaleLoopLock` = heartbeat older than `2×ttlMs` **or** `!processAlive(ownerPid)` via `kill(pid,0)`. Clock expiry means a recycled PID cannot keep a dead run's marker alive past `2×ttlMs` — false-keeps are bounded, false-reclaims are impossible while the owner refreshes. `loop-lock.ts:522-555`
- **Reclaim is already race-safe for overlapping sweeps.** `tryReclaimStaleLoopLock` rename-claims the stale file so exactly one contender wins; `writeLoopLockExclusive` publishes via `link()` so a reader only ever sees absent-or-complete. Two concurrent runs' startup sweeps cannot both claim the same worktree. `loop-lock.ts:253-303`
- **The runner already projects this lease into a foreign-ownership question — the pattern is validated in-house.** `holdsLiveLoopLock(dir, …)` reads `.deep-research.lock`/`.deep-review.lock` in a directory and judges liveness; `discoverForeignLiveRunDirs` is the same bounded scan the sweep needs, just over `git worktree list` instead of the packet tree. `fanout-run.cjs:548-622`
- **Refresh cadence is already on the wire.** `startLineageProgressHeartbeat` runs per lineage at `progressHeartbeatMs` (default 60s) with an `onProgress` callback — the same tick can `refreshLoopLock` each live worktree marker. `fanout-run.cjs:3104-3110`
- **But `startHeartbeat` is a process-wide singleton.** One module-level `heartbeatTimer` serves one `LoopLockOwnerToken`; calling it per worktree would keep only the last lock alive. N lineages ⇒ refresh via the existing per-lineage heartbeats (which works), not this driver. `loop-lock.ts:57,661-706`
- **Owner = runner pid, not the leaf.** Worktree ownership is per-run per-label; retries re-dispatch under the same run, so the runner's heartbeat is the correct lifetime. Marker written immediately after `git worktree add` returns, before dispatch.
- **sk-git's reaper will never compete.** Detached worktrees are explicitly report-only, so the runner's own sweep exclusively owns the `<prefix>-<runId>-<label>` lane. `worktree-reaper.sh:188-194`
- **Two reaper lessons are directly load-bearing for the sweep:** enumerate from `git worktree list --porcelain` (the registry is authoritative because `SPECKIT_WORKTREE_BASE` is per-process env a sweeper may lack), and refuse removal while a live process holds cwd inside (`_busy_pid_in`, lsof/`/proc` scan) — an orphaned detached leaf child can outlive its runner. `worktree-reaper.sh:116-124,142-167`
- **`git worktree lock` is not a liveness proof.** It's a boolean in `list --porcelain` with no pid/heartbeat/expiry — a dead run's locked worktree stays locked and `worktree remove` refuses it, permanently blocking the sweep. Useful only as an orthogonal guard against human removal during dispatch.
- **Marker placement: worktree root, not the lineage dir.** `<wt>/.fanout-worktree.lock` stays out of the copy-back set and survives with the directory it describes. It must then be named in `unattributablePaths` for that lineage's containment call — the same supervisor-bookkeeping precedent as `orchestratorOwnedPaths`. `fanout-run.cjs:2677-2687`
- **The copy-back-failure edge case needs a terminal marker state, not a release.** Spec retains the worktree for manual recovery on copy-back failure — a released/absent lock would make it look like an unclaimed leftover. Writing a final record with `phase='retained'` lets the sweep distinguish keep-forever from reap-stale. `spec.md:192`
- **TTL convention for this cadence:** staleness fires at `2×ttlMs`; with refresh on the 60s progress heartbeat, `ttlMs ≈ 3×progressHeartbeatMs` (~180s, ~6-minute dead window) tolerates squeezed/overrun heartbeats, which the test suite shows happen (`fanout-run.vitest.ts:3641-3703`). The 15s `DEFAULT_LOOP_LOCK_HEARTBEAT_INTERVAL_MS` belongs to the singleton driver. `loop-lock.ts:52,552`

## Recommended design

- **Project, don't invent:** reuse `acquireLoopLock`/`refreshLoopLock`/`releaseLoopLock`/`isStaleLoopLock` verbatim with `lockPath = <worktree>/.fanout-worktree.lock`, `ownerPid` = runner pid, `packetId` = runId, `phase` = lineage label → `'retained'` on copy-back failure.
- **Ordering:** `git worktree add --detach` → `acquireLoopLock` → seed → dispatch → on settle `releaseLoopLock` → `git worktree remove`. Refresh rides the existing per-lineage `onProgress` heartbeat; `ttlMs = 3×progressHeartbeatMs`.
- **Sweep:** enumerate `git worktree list --porcelain`, filter the `<prefix>-` basename lane; live lock → keep; stale lock + `_busy_pid_in` negative → `git worktree remove --force` + `git worktree prune`; missing lock + dir younger than one TTL window → keep (creation in flight), else reap; `phase='retained'` → never auto-reap.
- **Containment hygiene:** add the lock path to `unattributablePaths` for that lineage so the supervisor's heartbeat writes aren't attributed to the leaf.
- **Optional belt:** `git worktree lock --reason` during dispatch against human `worktree remove`, unlocked at teardown — never as the liveness proof.

## What would break it

- Reaching for the singleton `startHeartbeat` per worktree silently heartbeats only the last lock; the other N−1 go stale and get reaped under live lineages.
- The `worktree add` → `acquireLoopLock` gap plus a runner kill in that window leaves an unmarked worktree — a sweep with no creation-age grace reaps mid-creation work and one with no age-expiry leaks it forever.
- An orphaned leaf child holding cwd inside the worktree after runner death: the lock correctly goes stale, but without the reaper's busy-pid check the sweep removes the ground under a running process.
