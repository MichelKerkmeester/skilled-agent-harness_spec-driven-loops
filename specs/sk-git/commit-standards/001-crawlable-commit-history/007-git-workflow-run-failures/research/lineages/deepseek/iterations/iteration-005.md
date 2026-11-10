## Iteration 5 - The rest, and the plan

### What was read

- `.opencode/skills/sk-git/scripts/commit-id-naming.sh` (266 lines): lock dir `$common/commit-id-number.lock` `:34-35`; acquisition loop + stale reclaim `:83-126`; the stale branch requires a non-empty owner (`[ -n "$owner" ]` `:107-108`); timeout 300 iterations x 0.1s `:122-124`; `allocate_ordinal` `:165-207`; high-water persistence `:145-162`. Consumer: `prepare-commit-msg:191-194` (allocator failure leaves the message unstamped, never blocks).
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs` (already read in iteration 4): process liveness map and pool `getAttemptLiveness` `:2754`; saved `logs/fanout-lineage.out|err` `:3028-3036`.
- Cross-references for the leftovers: `git-sync.sh:147-160` (detached HEAD skip), live-follow ff-only `:219-238`, reaper `git worktree prune` `:115-116`, install-git-hooks global-hooksPath behavior (iteration 1), host-global excludes observation (iteration 4).

### What was reproduced

**R5.1 -- a killed allocator can leave a lock nobody reclaims**

```text
R5.1a lock dir with NO pid file (kill between mkdir and pid write)
  commit-id-naming: lock acquisition timed out
  allocate_rc=1 elapsed_s=33
  (lock dir empty; still present)

R5.1b lock owned by a LIVE unrelated pid
  commit-id-naming: lock acquisition timed out
  allocate_rc=1 elapsed_s=35

R5.1c clean mint after removal
  0000001
```

**R5.2 -- nohup-detached child survival across the Bash tool-call boundary**

```text
start.sh: nohup bash -c "sleep 4; write marker" &   (call returns immediately)
check.sh (separate tool call):  detached child alive: no (pid 8738)
                               marker: alive
```

The marker exists, so the child ran at least 4s after the shell that started it exited: simple detachment from the tool shell survives here. Observed-failure #2 (a `nohup pi -p ...` dying mid-task) is therefore not explained by the tool-shell boundary alone; it is executor- or OS-specific (the memory-pressure class of #8 is the other candidate). Neither the silent `pi` death nor the OOM kills are reproducible from inside this lineage.

**R5.3 -- GIT_* environment probes (partially inconclusive, reported as such)**

```text
normal toplevel from repoB:      .../repoB
GIT_DIR=repoA/.git from repoB:   .../repoB   (GIT_DIR redirects the gitdir, not the toplevel)
GIT_DIR + GIT_WORK_TREE not set: same
```

`GIT_DIR` alone does not move `rev-parse --show-toplevel` in current git; the already-proven environment effects are the global hooksPath (iteration 1), the host global excludes file (iteration 4), and `GIT_INDEX_FILE=next-index-*` reaching the pre-commit hook (iteration 1 R1.3, where the hook refuses by name).

### Findings

1. **[confirmed] A kill in the allocator's two-syscall window leaves an unreclaimable lock.** `_ci_acquire_lock` creates the lock directory (`commit-id-naming.sh:90`), then writes `pid` by rename (`:92-94`). The stale-reclaim branch runs only when a non-empty owner exists (`:107-108`), so a no-pid lock is never stolen: every contender burns the 30s timeout and fails (R5.1a). A live-but-stale owner (recycled pid or a hung holder) behaves the same while the pid answers `kill -0` (R5.1b). Effect on a commit: `prepare-commit-msg:191-194` catches the failure and commits without `Commit-Id`; the cost is up to 30s of dead wait per commit plus silently unstamped history. Same PID-reuse liveness assumption as the reaper marker (`worktree-reaper.sh:96`) and the live-follow lock (`git-live-follow.sh:132`).
2. **[confirmed] Detached children survive the tool-shell boundary in this runtime; the suffered deaths were not detachment.** R5.2. No producer change is implied by the reproduction itself; the observed `nohup pi -p` death needs executor-level evidence (its stdout buffer is saved by the runner, `fanout-run.cjs:3028-3036`, so an empty log plus a dead pid is the signature of an OS kill or a CLI self-exit, not of the shell tear-down).
3. **[confirmed by code] The stale-worktree-registration case is already handled.** The reaper runs `git worktree prune` unconditionally (`worktree-reaper.sh:115-116`) before any removal, and wrapper paths are timestamp-unique, so a crashed wrapper's registration cannot block a later allocation. No adjustment.
4. **[confirmed by code] A moving live branch during a run is by design and detected, not prevented.** The follower fast-forwards the primary checkout (`git-live-follow.sh:219-226`), autosync rebases a session branch onto the moved tip (iteration 2 F2.1), and a run that pins SHAs/line counts at the start holds stale numbers (observed-failures #6). Adjustment belongs to the run's measurement discipline (pin a SHA, note the moving-ref risk), not to a producer.
5. **[confirmed] Host-global git config is read by more than containment.** Global hooksPath (iteration 1) and the global excludes file (iteration 4 F4.5) both change automated behavior from outside the repository. The hooks that deliberately pin locale (`commit-msg:14`) and ignore stdin (`post-rewrite:6-7`) show the pattern that works: make the interpreter state explicit.

### The consolidated sort and plan

Every confirmed failure in this lineage, sorted by the file that must change. Rank is by how often it bites an automated run, then by blast radius.

**[fix in hooks or sk-git]**

- **A1 (rank 1, highest frequency). Pi dispatch guard denies ordinary compound commands** -- `dispatch-audit.mjs:42,219-231,258` + `dispatch-preflight-lint.ts:185,248-253`. Bit twice in this very run and in two prior lineages. Fix: classify `-p`+expansion as ambiguous only when an executor token is present or the expansion is in command position; name the opt-out in the denial. Test: `dispatch-audit.test.mjs` cases from R1.5 (`mkdir -p "$L/x"` must be `none`).
- **A2 (rank 2, high blast). Reaper deletes a live session's socket dir and marker when its base env is absent** -- `worktree-reaper.sh:60-70,178,190` + `worktree-session.sh:194-204`. Fix: resolve candidate worktrees from `git worktree list --porcelain` (any base) before pruning state, and never prune a marker whose slug appears in that list; persist the wrapper's chosen base into `speckit.worktreeBase`. Test: R2.6a/c (socket and marker survive).
- **A3 (rank 3, high blast). Reaper removes a worktree under a live detached child** -- `worktree-reaper.sh:82-98` + `worktree-session.sh:351-356`. Fix: before `worktree remove`, refuse when any live process resolves inside the directory (cwd scan); or have long-lived children write their own liveness marker. Test: R2.7 (child alive => worktree kept).
- **A4 (rank 4, high blast). Autostash orphan guard never sees the rebase orphan** -- `lib/autostash-orphan-guard.sh:19-43` + hook ordering. Fix: anchor `$(git rev-parse --git-path rebase-merge)/autostash` (and `rebase-apply/autostash`) at post-rewrite time when present, and run the guard from `post-commit` and `git-sync.sh` entry. Test: R2.5 (anchor exists immediately after the conflicting rebase, no manual invocation).
- **A5 (rank 5). pre-commit block branches omit their bypass** -- `pre-commit:416-443,295-303`. Fix: print `SPECKIT_SKIP_SPEC_REMINT=1` / `SPECKIT_SKIP_ROUTE_REMINT=1` on the branches that currently print only a human fix command; treat packets dirty only in the gate's own derived files as re-derivable. Test: R1.2/R1.3 scripts assert the bypass line.
- **A6 (rank 6). Machine-wide hook shadowing and installer re-point** -- `install-git-hooks.sh:30-33,84-99,106-124` + the global symlink set. Fix: `--status` that prints `core.hooksPath` origin and each hook's realpath; a harness scenario with a global hooksPath; qualify README:118. Test: harness asserts the shadow is reported.
- **A7 (rank 7). Diverged autosync rewrites session SHAs without recording the mapping** -- `git-sync.sh:246-263`. Fix: log `old=<sha> new=<sha>` on the rebase publish path. Test: R2.1 asserts the pair in `git-sync.log`.
- **A8 (rank 8). Advisory state reads the wrong cwd** -- `git-rule-checks.mjs:26-28,57-83` + adapter cwd choice (`hooks/pi/git-preflight-advisory.ts:70`, `hooks/git-preflight-advisory.mjs:111,116`). Fix: resolve `-C`/leading `cd` for the context, or fail open when the effective cwd is uncertain; keep advisory-only. Test: R3.2/R3.3 cases (no false fire on `-C`, no false silence on `reset --hard`).
- **A9 (rank 9). Allocator no-pid lock** -- `commit-id-naming.sh:83-126`. Fix: reclaim a lock whose directory has no readable owner after a short grace (the current age-free timeout is the fallback but costs 30s), or write the pid atomically into the lock before returning from `mkdir` (create+write+rename directory). Test: R5.1a (mint succeeds within seconds when the lock has no pid).
- **A10 (rank 10, noise). commit-msg trailer length warning** -- `commit-msg:126-129`. Fix: skip `TRAILER_RE` lines in the length check. Test: R1.4 case B.

**[fix in runtime, own packet]**

- **B1 (rank 1, highest blast). Containment fails a lineage for a same-packet tracked write by another writer** -- `write-containment.ts:510-540,613-638` + `fanout-run.cjs:3048-3105`. Fix: give tracked same-packet violations the same non-fatal advisory + patch treatment the untracked preserved path already gets (`:740-757`); keep cross-packet/cross-tree tracked writes fatal. Test: R4.1 variant (plan.md advisory, an outside tracked file fatal).
- **B2 (rank 2). Stall watchdog false positive for silent-but-working print-mode children** -- `fanout-run.cjs:1524-1563` + call site `:2913-2919`. Fix: feed it the existing `lineageProcessLiveness` plus a CPU-time sample; annotate `process_alive`/`cpu_ms`; suppress or downgrade while the child makes CPU progress. Test: R4.2 extension (live sleeping child with no writes => no `stall_detected`; dead pid => event).
- **B3 (rank 3). Containment detection inherits host-global git config** -- `write-containment.ts:196-210`; `fanout-run.cjs:3048` passes no env. Fix: pass the run env with host-global excludes neutralized (or record which config the detection used). Test: fixture with a global ignore rule still detects the untracked out-of-scope write.
- **B4 (rank 4). Detached-child death diagnostics** -- the runner records exit and saves stdout/stderr (`fanout-run.cjs:3028-3036`) but a killed/self-exited print-mode child leaves an empty log with no cause. Fix (instrumentation first, no behavior change): record the child's exit signal already; add peak RSS / process-tree exit notes at settle so the OOM class (#8) is distinguishable from a clean self-exit. Test: kill -9 a stub child and assert the settled record names the signal.

**Environment/documentation items (no code)**

- Global git config participates in every automated path (hooksPath, excludes). A session should not assume repository-local configuration is what runs.
- Runs that measure the moving live branch must pin a SHA (observed #6); the follower and autosync will keep moving it by design.

### Proposed adjustment order

1. B1 (containment failure semantics) -- highest blast, one partition change at the producer.
2. A1 (dispatch guard) -- highest frequency, small classifier change.
3. A2/A3 (reaper) -- destructive class, same file, one packet.
4. A4 (autostash anchor) -- data-loss class, one guard function.
5. A5 (missing bypasses) -- cheap, unblocks unattended committers.
6. A6/A9 (installer status; allocator lock) -- operational hygiene.
7. B2/B3, A7, A8, A10 (watchdog, env, SHA log, advisory cwd, noise).

### What this iteration could not settle

- The `nohup pi -p` silent death (needs the executor's own exit evidence outside this sandbox) and the OOM-kill class.
- Whether a `GIT_DIR` export ever reaches these scripts in practice (the probe shows it redirects the gitdir but not the toplevel; `GIT_INDEX_FILE` is the one that demonstrably reaches hooks).
- Whether the allocator no-pid window is reachable in practice (it requires a SIGKILL in a two-syscall gap; the reproduction shows the cost, not the frequency).
