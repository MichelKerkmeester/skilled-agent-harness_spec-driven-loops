# Iteration 4: Q2 fan-out, diff-first (trust merge, stop paths, run_extended lineageId)

## Focus
Q2, the deep-loop runtime, limited to fan-out. Only the in-window trust and stop hunks were read: `2bfee12379d` and `86f6c584b1b` in `fanout-merge.cjs`, and `4fc94bae0d3`, `e111720dc88` and `978b74e8df7` in `fanout-run.cjs`. All five are after `v4.1.0.0` and inside `v4.2.0.0` (`git merge-base --is-ancestor`, both ways). The current stop code also pulled in `a20a1d96a05`, which is in the window too. This iteration also settled the `run_extended` lineageId lead from iteration 3 and closes Q2 with a verdict.

## Actions Taken
1. Checked that all five commits fall inside the window, and read their diffs for the two scripts and the fan-out feature catalog.
2. Read the stop code as it stands now: the signal handlers, `stopActiveLineageProcesses`, `classifyLineagesForStop`, `lineageIdentityRefusal`, `processStartOf`, the `spawned` row writer and the runner's `writeStoppedSummary`. Read the doc paragraphs for `--stop` and for a runner stopped by a signal.
3. Blamed `stopActiveLineageProcesses` across the window. Its current shape comes from `a20a1d96a05` (2026-11-21).
4. Traced the `run_extended` lineageId. Covered where the v4.1.0.0 YAML put it, the gateway's stem path, `assertRunIdentity` in the typed reducer, and the legacy scope mapping.
5. Reproduced `--extend` on a restarted run in a scratch copy of this packet under the session scratchpad. This ran `workflow-steps.cjs extend-research`, then the gateway with the staged `run_extended`, then the gateway with a later iteration record.
6. Checked that the research trust merge's iteration key matches what the reducer writes, and read the fan-out merge doc's lineage-trust paragraph.

## Findings
1. **P2 (regression, platform-limited): a runner stopped by a signal no longer signals its own lineage children when their `spawned` row has no start time. It records them as survivors and exits with them still running.**
   - On Windows `processStartOf` always returns `''` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1279]. On any platform it also returns `''` when `ps` fails [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1284]. In either case the `spawned` row is written without `process_start` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5707].
   - `lineageIdentityRefusal` then returns `no_recorded_identity` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1323], and `classifyLineagesForStop` files the lineage under `refused` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1408].
   - `stopActiveLineageProcesses` signals only `outcome.live` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1037]. It still terminates directly only a child with no `spawned` row at all [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1034].
   - `writeStoppedSummary` puts those refused, unsignalled lineages into the 2.5-second grace wait [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5264]. A lineage that still answers gets no `stopped` row [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5274]. The handler then calls `process.exit` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714].
   - Before `a20a1d96a05`, the runner called `terminateLineageProcess(child, signal)` for every child it held (removed line in `git show a20a1d96a05`). So this is a regression introduced inside the window.
   - The operator also has no fallback. `--stop` runs the same identity check and refuses `no_recorded_identity` by design [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:149]. A Windows fan-out stopped by SIGTERM or by the bootstrap's death (the parent-death poll that maps to SIGHUP [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:723]) leaves lineages that neither the runner nor `--stop` will end.
   - The doc says the runner uses the same identity check as `--stop` [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:173]. It never says that on a host without `ps` start times this means the runner signals nothing. That is drift by omission.
   - The refusal guards against pid reuse, but it cannot happen to a child the runner still holds. An unreaped child keeps its pid as a zombie, which the code's own comment at `liveProcessTable` notes [INFERENCE: based on fanout-run.cjs:1034 holding the child handle and the zombie note above liveProcessTable].
   - Confidence: the code path was read, not executed. It was not run on Windows. A console Ctrl+C may still reach children that share the console, so the gap is surest for SIGTERM and parent death. To confirm: a unit test that stubs `processStartOf` to `''`, sends SIGTERM to the runner, and asserts the child pid is gone.
   - The fix is to let the runner terminate a `no_recorded_identity` child it holds itself, as it did before. Pid reuse is not possible for a child it has not reaped [INFERENCE: based on the removed terminateLineageProcess call and fanout-run.cjs:1034].

## Ruled Out
- **The `run_extended` lineageId breaks a restarted run (iteration 3 lead).** It does not, on the live path, and the line is out of window anyway.
  - The same `lineageId = lineage.parentSessionId || sessionId` was already in the v4.1.0.0 YAML at line 594 (`git show v4.1.0.0:.skilled/commands/deep/assets/deep-research.yaml`). `d239dd6d2ae` only moved it into [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:166].
  - Reproduced on a scratch copy of this packet, which is itself a restart (generation 2, `parentSessionId` set). `extend-research` exited 0 and staged `scope.lineageId = 2026-11-25T08:04:38Z`. The gateway accepted it (exit 0, receipt sequence 8, `projectionRefreshed: true`), and a later iteration record with `lineageId = sessionId` was accepted too (exit 0, sequence 9).
  - Using the parent as the lineage id is the packet's convention, not a slip. The legacy deltas contract reads `scope.lineageId` back as `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96], and `run_restarted` takes its archived lineage from `parentSessionId` [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:654].
  - Residual: the typed reducer's `assertRunIdentity` refuses a lineageId that differs from `run_initialized`'s [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:465]. Its callers were not traced, so a typed full-ledger fold of a restarted and extended run is unverified.
- **The research trust merge keys untrust on the wrong iteration field.** It does not. `findingUntrustReason` is passed `finding.addedAtIteration` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:841], and the reducer writes key findings with `addedAtIteration: iteration.run` [SOURCE: .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818].
  - Untrusted-only answers go back to open, and the doc states the same rule [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50].
- **A second signal re-enters the runner's stop.** It cannot. `writeStoppedSummary` returns early once it has written [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:5255].
  - The grace wait blocks synchronously on `Atomics.wait`, so a queued handler runs only after `process.exit` has already been called in `finally` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:714].
  - `process.on` (from `978b74e8df7`) keeps libuv catching the repeat, so the repeat no longer kills the process with the default disposition. This matches [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:183].
- **The exited-leader member split reads start times in the wrong zone.** It does not. Both sides are rendered under `TZ=UTC` and parsed field by field with `Date.UTC` (commit `4fc94bae0d3`) [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:1282].

## Dead Ends
- The `run_extended` lineageId lead is closed for the live gateway path. The reducer can mark it exhausted.
- The research trust merge's labelling and question reopening read clean. A further pass on it is unlikely to pay, except for the frontier lead below.

## Edge Cases
- Ambiguous input: none. The dispatch named the exact commits.
- Contradictory evidence: none. The lineageId lead read as suspicious from the code alone, and the reproduction resolved it.
- Missing dependencies: no Windows host, so Finding 1 is inference from code. The reducer could not be run on the scratch copy because it refuses an artifact root outside `specs/`, so the typed fold stays unverified.
- Partial success: none of the actions failed.

## Sources Consulted
- git show 2bfee12379d 86f6c584b1b (fanout-merge.cjs), 4fc94bae0d3 e111720dc88 978b74e8df7 a20a1d96a05 (fanout-run.cjs, fanout-run.md)
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:706-723, 1026-1038, 1278-1323, 1395-1420, 5254-5310, 5698-5709
- .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786, 841
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-run.md:142-185
- .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:45-53
- .skilled/skills/system-deep-loop/runtime/scripts/workflow-steps.cjs:158-200
- .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:405-425
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-reducers/deep-research-reducer.ts:452-472
- .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:641-675
- .skilled/skills/system-deep-loop/runtime/lib/legacy-projections/deep-research-deltas-contract.ts:96
- .skilled/skills/system-deep-loop/deep-research/scripts/reduce-state.cjs:2818
- .skilled/commands/deep/assets/deep-research.yaml:556-570
- Scratch reproduction under the session scratchpad (`iter4-extend/`): extend-research exit 0, gateway exit 0 twice

## Assessment
- New information ratio: 1.0. The one finding is new. The settled lead and the clean surfaces are recorded under Ruled Out, not counted as findings.
- Questions addressed: Q2 (the deep-loop runtime), Q4 (UX).
- Questions answered: Q2.

## Reflection
- What worked and why: reading the current code around each in-window hunk, not just the hunk, is what surfaced the regression. It sits in `a20a1d96a05`, a sibling commit outside the five named. A cheap scratch reproduction closed the lineageId lead in one call, where reading alone kept it suspicious.
- What did not work and why: the reducer could not be run on the scratch copy because it refuses artifact roots outside the approved specs roots. So the typed-reducer half of the lead stays open.
- What I would do differently: list every in-window commit touching the stop functions with `git log -L`, before reading the named commits.

## Questions Answered
- Q2 verdict: yes, with a narrow footprint. The in-window deep-loop runtime carries two defects, both found from code and the reproductions:
  - P3 UX: the `--extend` re-stop warning goes silent once the inbox has held a line (iteration 3, `2c80c64f391`).
  - P2: the runner's signal stop leaves `no_recorded_identity` lineages running (this iteration, `a20a1d96a05`).
  - `frontier_drained`, the `--extend-minutes` arithmetic, the gateway's identity minting, the research and review trust merge, the `--stop` identity and member split, and the repeat-signal handling all match their docs.
  - One unverified lead is carried forward: the frontier merge.

## Questions Remaining
- The skill advisor question (loop offers, the typed-only Python fallback, the common-words floor, native versus Python parity).
- Q3: the session hooks and spec tooling.
- Q4: operator UX (one more defect found here).

## Recommended Next Focus
Move to the skill advisor question, diff-first: list the `v4.1.0.0..v4.2.0.0` commits under `.skilled/skills/system-skill-advisor/` and `.skilled/bin/skill-advisor.cjs` whose subjects name loop offers, the Python fallback, the common-words floor or parity. Read only those hunks against the advisor docs.

Optional side check, if budget allows: `mergeResearchFrontier` [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:786] showed no trust or vouch check in its first 30 lines, while the doc says an untrusted lineage claims no coverage [SOURCE: .skilled/skills/system-deep-loop/runtime/feature-catalog/fanout/fanout-merge.md:50]. Confirm whether the merged frontier counts an untrusted lineage's answered nodes before calling it drift.
