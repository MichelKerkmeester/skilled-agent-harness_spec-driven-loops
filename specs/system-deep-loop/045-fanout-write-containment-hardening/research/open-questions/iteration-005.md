# Open Question Iteration 005

**Model:** `swe-2-max` via cli-devin  
**Angle:** Sweep versus resume ordering: what happens when an interrupted run's worktrees are reclaimed while the ledger is about to requeue that lane, plus the retained-worktree case after a copy-back failure, and how the two mechanisms should be sequenced

---

I'll investigate the sweep-vs-resume ordering angle. First, let me map the packet structure and locate the relevant mechanisms.Let me read the orphan/requeue machinery and the startup sequence where the sweep would sit.Now let me check orphan detection semantics, how `baseArtifactDir`/`runId` behave across a resume, and what the spec says about sweep placement.Let me verify the orphan detection semantics and whether a resumed run skips ledger-completed lanes or re-runs everything.One last check: whether a resumed run filters already-completed lanes out of dispatch, or re-runs all config lineages.## Findings

- **Resume re-dispatches every configured lane; the ledger is bookkeeping, not a dispatch filter.** `runCappedPool` receives `items: cliLineages` — the full config expansion — with no completed-label exclusion (fanout-run.cjs:2843). `markOrphanedLineages` only appends `orphan_requeued` events (fanout-pool.cjs:309-326) so `readRetryCountsFromLedger` can consume the already-spent attempt (fanout-pool.cjs:267-284). So "the lane the ledger is about to requeue" re-runs from iteration zero — and its interrupted predecessor's worktree is the *only* copy of its unpublished in-flight work.

- **A requeued lane can never reattach to its old worktree — the name embeds a per-invocation runId.** `runId` is minted fresh per process (`Date.now()-random`, fanout-run.cjs:2697) with no arg to pass a prior one, while ADR-003 names worktrees `<prefix>-<runId>-<label>` (decision-record.md:265). A resumed run's lanes get new-named worktrees by construction; the orphan's worktree is structurally unclaimable by the requeued lane — salvage-only, and the spec defines no salvage step.

- **Sweep placement relative to the ledger read is unspecified, and "at startup" puts it before the only oracle that knows what is orphaned.** T021 says "Sweep … at startup" (tasks.md:91); ADR-003 says "sweeps its own prefix at startup so an interrupted run cleans up on the next one" (decision-record.md:265). The orphan set only becomes known at `markOrphanedLineages` (fanout-run.cjs:2799), which itself sits *after* `resumeWaitingCheckpoint` (2759). A sweep inserted anywhere before 2799 deletes precisely the worktrees holding orphaned lanes' in-flight output before the run learns they are orphaned. Dead-marker liveness cannot fix this — orphans are dead-by-definition; the discriminator is the ledger.

- **The retained-after-copy-back-failure worktree is dead-by-design, so even a perfectly liveness-gated sweep reaps it.** spec.md:192 retains the worktree and names it on the failure event "so the artefacts can be recovered by hand"; the run then exits, heartbeat stops, PID dies. The next run's sweep sees positive proof of death and removes it. Retention's real lifetime is "until the next run's startup" — invisible to the operator holding the failure event. PID/heartbeat gating is necessary but not sufficient; retention needs a terminal state distinct from liveness.

- **The ledger already names retained worktrees, but the orphan→worktree mapping is name-parsing only.** The failure event carries the retained path (spec.md:192), so that exclusion set is ledger-derivable. Orphans' worktree paths are recorded nowhere — the only link is parsing `<label>` out of `<prefix>-<runId>-<label>` directory names; no `worktree_created`/`started`-with-path event exists today (the `started` record carries label/index/at only, fanout-pool.cjs:292-305).

- **AC-009/T028's "no worktree remains" is incompatible with the retention state.** A correct copy-back-failure path leaves a retained worktree; the criterion asserting global absence (acceptance-criteria.md:71, tasks.md:113) either fails the mandated behavior or passes only because retention was never exercised — the same certify-the-hazard shape iteration-004 found, on the retention path.

- **Cross-run race on the claim window:** run B's sweep can reap A's orphan worktrees between A's ledger read and A's salvage/claim — both see dead markers. The run-dir lease does not cover the shared worktree prefix (iteration-003 bounded it to the artifact dir), so ordering alone inside run A doesn't close the window.

## Recommended design

- **Order startup as:** run lock → `markOrphanedLineages` (ledger read) → *claim pass* (for each orphan label, locate `<prefix>-*-<label>`, write a `claimed` marker into it, salvage-copy its lineageDir to the main checkout or retain it until that label's next copy-back succeeds) → *then* sweep the prefix → dispatch. Sweep never runs before the ledger read.
- **Give the per-worktree marker a terminal `state` field:** `active` (heartbeat-refreshed) → `claimed` or `retained`. Teardown writes `retained` *before* the copy-back failure event lands. The sweep removes only `active` entries proven dead (2×TTL **and** `!kill(pid,0)` **and** nonce/start-time corroboration); `claimed`/`retained` are never swept — released only by operator removal or the same label's successful copy-back.
- **Record the worktree path on the lane's `started` ledger event** (or a `worktree_created` event) so claim and retention-release key off the ledger, not directory-name parsing.
- **Take a prefix-level sweep mutex** (a `LoopLockData` lease on the prefix path itself — `acquireLoopLock` already accepts arbitrary paths) covering the claim+ sweep window, since the shared prefix outlives any single run-dir lock.
- **Rewrite the teardown criterion** to "no worktree of this run remains that is not in `retained` state," and assert retained paths survive with intact bytes until released.

## What would break it

- Label-with-separator or renamed labels break the orphan→worktree name mapping if the ledger `started` record doesn't carry the path — the claim pass silently misses and the sweep takes the worktree.
- If an orphaned lane is also *removed from the config* before resume, nothing requeues it and nothing releases the claim — retained/claimed worktrees accumulate forever, re-creating the R-004 accumulation the sweep exists to prevent. Needs an expiry escape valve.
- The `retained` write and the failure event must be ordered retained-marker-first; a crash between them leaves an `active`-looking worktree with a dead heartbeat that the sweep legitimately reaps — same loss window the design was meant to close, narrowed but not eliminated.
