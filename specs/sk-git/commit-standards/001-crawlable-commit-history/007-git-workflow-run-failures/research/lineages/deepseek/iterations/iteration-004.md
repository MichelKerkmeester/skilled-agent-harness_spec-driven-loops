## Iteration 4 - Fan-out containment and watchdog

### What was read

- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/write-containment.ts` (787 lines): pre-dispatch snapshot `:486-504`; new-violation detection `:510-540`; revert patch capture `:564-600`; `revertOutOfScopeViolations` (untracked preserved, never deleted) `:613-638`; event builder + `dataLossPossible` `:641-675`; `enforceWriteContainment` `:693-774`; git child env `opts.env ?? process.env` `:196-210`; git invocation itself `:198`.
- `.opencode/skills/system-deep-loop/runtime/scripts/fanout-run.cjs`: containment call site `:3048-3105` (options + fatal throw); orchestrator-owned path list `:2594-2598`; static exclusions (siblings, kind dirs, foreign live runs) `:2961-2982`; stall watchdog `:1524-1563` (default 300000ms `:905`); artifact progress poller `:1621-1640`; dispatch liveness wiring `:2905-2940` (`onOutput: markLineageEvent` `:2998`; `onSpawn/onExit` process liveness `:3003-3008`); `stall_detected` status mapping `:306`; pool `getAttemptLiveness` `:2754`.
- `.opencode/skills/system-deep-loop/runtime/lib/deep-loop/observability-events.cjs:162`: `stall_detected` is a loud observability event.

### What was reproduced

Reproductions ran against the shipped modules (Node 26 imports the TypeScript module directly). Throwaway repo under the lineage scratch; a nested-repo fixture, no writes elsewhere.

**R4.1 -- another process's tracked write is attributed to the lineage and reverted from HEAD**

```text
baseline out-of-scope dirty paths: []
other-process write applied to plan.md          # specs/x/001-p/plan.md, tracked, packet root
orchestrator ledger appended (exempted path)
stray untracked file created

--- enforce result ---
fatal violations: [ { path: "specs/x/001-p/plan.md", kind: "modified", status: " M" } ]
advisories: [ stray untracked preserved ]
revert actions: [ { plan.md, restored_from_head, ok: true },
                  { stray-untracked.txt, preserved_untracked, ok: true } ]
dataLossPossible: { paths: ["specs/x/001-p/plan.md"],
                    recoverFrom: ".../containment-reverted/1-2026-09-11T10-08-43.515Z.patch",
                    note: "Tracked file(s) rolled back to HEAD. Uncommitted work ... survives only in the patch" }

--- post-revert state ---
plan.md now: "plan v1\n"                         # the edit is gone from the tree
ledger line count: 1                             # exempted, untouched
stray-untracked.txt exists: true                 # preserved, advisory only
patch contains orchestrator edit: true
state log event type: containment_violation
```

The leaf wrote only inside its artifact dir. The planning-doc write came from a separate process; the guard still reported it as the lineage's fatal violation and `fanout-run.cjs:3080-3105` throws on `violations.length > 0`, failing the attempt even when all iterations are on disk (observed-failures #1 shape).

**R4.2 -- the real stall watchdog: what resets it and what does not**

```text
quiet child (no streamed output, no artifact writes): resets = 0     -> [deep-loop] stall_detected
progressing child (artifact-progress resets every 100ms): resets = 8 -> no event

ledger events:
  label=quiet-child event=stall_detected quiet_ms=301 severity=warning
stall_detected count: 1
```

### Findings

1. **[confirmed] Containment misattributes any tracked out-of-lineage write to the running lineage and destroys it from the tree.** Detection is a git-tree diff (`write-containment.ts:510-540`); attribution is "not in the baseline, not in an exclusion" -- writer identity is unavailable. A tracked packet planning doc edited by another process is reverted from HEAD and fails the attempt (R4.1). Current mitigations: only three orchestrator ledger paths are exempted (`fanout-run.cjs:2594-2598`), sibling/foreign-run dirs are excluded, the revert is recoverable (patch + `dataLossPossible`, `write-containment.ts:564-600,641-675`). The residual failure is exactly observed-failures #1: an orchestrator editing its own packet docs during a live lineage can fail a completed lineage.
2. **[confirmed] Untracked out-of-scope writes are preserved, never deleted.** R4.1 stray file: `preserved_untracked`, advisory-only when packet-scoped (`write-containment.ts:613-638,740-757`). The one destructive outcome remains the tracked-file rollback, which the event itself names (`dataLossPossible`).
3. **[confirmed] The stall watchdog has exactly two reset sources and ignores process liveness.** Resets: streamed stdout (`fanout-run.cjs:2998`) and artifact-directory progress (`:1621-1640`, wired at `:2927-2940`). A print-mode child with a >5-minute silent phase (reading/analysis, no writes) emits neither and gets `stall_detected` (R4.2; default threshold 300000ms `:905`). The runner already tracks real process liveness (`lineageProcessLiveness`, set `:3003-3008`, consumed by the pool at `:2754`) but the watchdog is not given it. The event maps to status `warning` and the pool's abort path uses process liveness, so the harm is a misleading `warning`/`stall_detected` record (observed-failures #4), not a kill.
4. **[confirmed] Correct liveness signal for a non-streaming executor: child liveness plus CPU progress.** `kill -0` on the tracked pid proves the child is alive; CPU-time advancement proves it is working; artifact-write cadence already proves output. The watchdog should require (or at least report) both `process_alive` and CPU delta before calling a quiet stretch a stall.
5. **[confirmed, incidental] Containment detection depends on the host's ambient git config.** `gitOutput` spawns git with `opts.env ?? process.env` (`write-containment.ts:200`) and `fanout-run.cjs` passes no env, so the host global excludes file applies. Reproduced accidentally: this machine's `~/.gitignore_global` contains `/specs`, which made the untracked fixture invisible to `git status` until the fixture env isolated config. A global ignore rule can therefore hide real out-of-lineage untracked writes from the guard (fail-open) or make detection disagree with the commit hook's view of the same tree.
6. **[confirmed] The seam.** Containment and the stall watchdog belong to the deep-loop runtime (`runtime/lib/deep-loop/write-containment.ts`, `runtime/scripts/fanout-run.cjs`) -- neither is a git workflow producer and neither can be fixed by sk-git or the hooks. The git-facing producers from iterations 1-3 (hooks, git-sync, reaper, advisory) are sk-git/hooks. The freeze rule that avoids the containment collision is an orchestration discipline (ADR-005 chose it), enforced by nothing.

### Adjustments proposed

1. **[fix in runtime, own packet] Stop failing a lineage for a same-packet tracked write; keep cross-tree escapes fatal.** Extend the packet-scope concept that already governs preserved untracked paths (`write-containment.ts:740-757`) to tracked paths: a tracked violation whose directory is inside the packet that owns the artifact dir becomes a non-fatal advisory (patch still saved, event still logged) rather than a thrown failure; a tracked violation outside the packet stays fatal. Producers: `fanout-run.cjs:3080-3105` (partition before throwing) + `write-containment.ts:711-757`. Test: R4.1 must produce an advisory for `specs/x/001-p/plan.md` and a fatal violation for a tracked file outside `specs/x/001-p/`.
2. **[fix in runtime, own packet] Give the watchdog a real liveness input.** Pass `getProcessLiveness` (the existing `lineageProcessLiveness` entry) and a CPU-time sampler into `startLineageStallWatchdog`; suppress or annotate `stall_detected` while the pid is alive and its CPU time advances; include `process_alive` and `cpu_ms` in the ledger event. Producers: `fanout-run.cjs:1524-1563` and the call site `:2913-2919`. Test: R4.2 with a live sleep child and no writes must not emit `stall_detected`; a dead pid must.
3. **[fix in runtime, own packet] Pin the git environment containment reasons about.** Pass an explicit `env` to `enforceWriteContainment`/`snapshotOutOfScopeDirtyPaths` (the runner already computes a dispatch env); at minimum neutralize host-global excludes for detection so the guard's view matches the repository's committed configuration. Producer: `write-containment.ts:196-210` + `fanout-run.cjs:3048`. Test: fixture with a global ignore rule must still detect the untracked out-of-scope write.
4. **[keep] The untracked-preserve + revert-patch behavior is correct.** No adjustment; the patch and `dataLossPossible` are what make the tracked rollback recoverable, and R4.1 confirms both fire.
5. **[documented] The freeze rule remains an operator/agent discipline.** The producer cannot distinguish writers from a git-tree diff; ADR-005 chose "orchestrator does not edit the live checkout". Adjustment 1 makes that discipline non-fatal for same-packet writers; a broader fix (per-writer audit) is out of scope for this packet.

### What this iteration could not settle

- Whether the observed containment incident #1 predates the current mitigations (patch, `dataLossPossible`, ledger exemptions) -- the module comments describe it, and the mechanism reproduces without them mattering for a planning doc.
- Whether the pool's lag ceiling ever aborts on `stall_detected` indirectly (the code path reads `getAttemptLiveness`, not the watchdog event; not exercised against a real stalled run).
- Whether `git status` ignoring tracked-file ignore rules is the only ambient-config influence (only the untracked/ignore direction was observed).
