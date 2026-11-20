# Iteration 1: Lineage honesty signals (F-1-001)

## Focus
Frontier node F-1-001: which runner-side signals flag an unexamined pass or a false stamp without trusting the model, and how convergence.cjs and fanout-merge.cjs should weigh such a pass. I measured the signals on the two prior fan-outs' committed lineages instead of only reasoning about them: the gen2 review (`SPEC/review/lineages/{opus,deepseek}`) and the gen3 research (`SPEC/research_archive/20261120T125555Z/lineages/{opus,deepseek}`).

## Actions Taken
1. Read both conductor logs (`scratch/dogfood-review-gen2.md` P4-P7, `scratch/dogfood-research-gen3.md` P1-P6) and the gen3 `improvement-backlog.md`, to keep built rows out.
2. Traced how a model-written `timestamp` reaches the projection: `append-mode-event.cjs` → `upcastLegacyDeepResearchRecord` → ledger envelope.
3. Read the runner's completion and timestamp-window checks (`fanout-run.cjs`, `lineage-timestamp-window.ts`).
4. Wrote two read-only probes in this lineage's `.executor-state/`:
   - `honesty-probe.cjs` decodes each ledger frame's `canonical_event_bytes` and compares the projected `timestamp` with the gateway's `receipt.committed_at`. It also prints the gap between iteration-file mtimes, the citation count, and the findings count.
   - `toolcalls-probe.cjs` sorts the opencode JSON log's `tool_use` events into passes by the commit time of each iteration row, and counts source reads.
5. Read how convergence and merge consume `newInfoRatio` (`convergence.cjs`, `fanout-merge.cjs`).

## Findings
1. **The gateway lets the model pick the projected time.** A row that carries a UTC `timestamp` keeps it as the event's `occurredAt`, and the projection writes that back as the row's `timestamp`. The gateway's own clock survives only in `receipt.committed_at` / `recordedAt`, which no runner check reads. [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:908-916] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:417-425] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/append-mode-event.cjs:320-321]
   - **Change:** for `type: iteration` rows, take `occurredAt` from the gateway clock. Keep any model stamp as `claimedTimestamp`, and refuse or flag a claim later than the commit.
   - Value H, effort S, risk L. Legacy replay keeps its stamp, because the rule applies only to live appends.
2. **Stamp-to-commit skew detects a false stamp exactly** (measured).
   - The gen2 review deepseek lineage's stamps were whole minutes, with skew against its own commit running from -36 s to **+126 s**. Iterations 8-12 were stamped 8-126 s *after* the gateway committed them, which no honest writer can do.
   - The opus lineages and the gen3 research lineages show skew within ±1 s, because their rows carried no stamp of their own or a real one.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/deepseek/deep-review-state.jsonl] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research/lineages/opus/.executor-state/honesty-probe.cjs]
3. **The runner's timestamp check compares stamps with the slot window, not with each row's own commit**, so it missed the future-dated row.
   - `checkLineageCompletion` and `checkLineageTimestampWindow` judge projected stamps against `[windowStart, windowEnd]` with a symmetric 120 s tolerance. The window end is the moment the process ended.
   - Iteration 12's 19:26:00 stamp was within 120 s of the 19:25:56 end, although it was 126 s past its own commit.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:32] [SOURCE: .skilled/skills/system-deep-loop/runtime/lib/deep-loop/lineage-timestamp-window.ts:83-92] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-run.cjs:4898-4923]
   - **Change:** read `receipt.committed_at` per row from the lineage ledger. Flag `claim > commit` with zero tolerance as `future_stamp`, and flag stamps on whole minutes as `coarse_stamp`. Value H, effort S, risk L.
4. **Tool calls per pass, read from the runner's own log, separate examined passes from stamped ones** (measured).
   - The probe sorted the opencode JSON log's `tool_use` events into passes by commit time. In the gen2 review deepseek lineage, the real passes 2-4 made 112, 64 and 33 calls with 49, 48 and 22 source reads. The stamped passes 5-11 made 3-14 calls with 0-7 source reads.
   - Iteration 12 committed 0.9 s after iteration 11, with **zero** tool calls in between. That is a batched record, not a pass.
   - `fanout-salvage.cjs` already parses this same log for `step_finish` cost, so a sibling `passEvidence(log, commits)` that returns `{toolCalls, sourceReads, commitGapMs}` per iteration is a small change.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-salvage.cjs:76-96] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/review/lineages/deepseek/logs/fanout-lineage.out]
   - Value H, effort S-M, risk L.
5. **Pass duration alone is not a usable signal.**
   - Gen3 research deepseek passes ran 33-98 s apart and gen2 review opus passes 40-275 s, yet the conductor judged both real work (gen3 log P2).
   - Gen3 deepseek passes 7-9 cited 14-29 file:line locations with only 0-2 source reads inside the pass. They lean on context read in earlier passes of the same CLI session, which is legitimate in a long-lived session.
   - **Rule:** combine the signals. A pass is `unexamined` when (sourceReads == 0 AND findings == 0) OR (commitGapMs < 15 s AND toolCalls == 0) OR claim > commit.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:146-153] [INFERENCE: based on the two probes over the four lineages]
6. **The record's own `toolsUsed` and `sourcesQueried` cannot serve as signals.**
   - Gen3 deepseek listed 2-3 tool *names* per pass, while its log shows 8-69 calls per pass.
   - The gen2 review rows carry neither field.
   - Both fields are model claims, so the runner log is the only call count.
   - [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/deep-research-state.jsonl] [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/research_archive/20261120T125555Z/lineages/deepseek/logs/fanout-lineage.out]
7. **Convergence trusts the self-reported ratio in two places.** The stuck counter compares `newInfoRatio` with the threshold, and the stop vote reads the same ratios. Deepseek's 1.0 on 10 of 10 passes therefore made a stop impossible before the cap. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1472-1478] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/convergence.cjs:1785-1788]
   - **Change:** compute an observed ratio per pass from the deltas: finding ids and cited `file:line` locations not seen in earlier passes, over the pass's total. Feed `min(selfReported, observed)` to both readers.
   - Exclude an `unexamined` pass from both by extending `isEvidenceBearingIteration`, which today filters on status alone. A rubber stamp then counts like `thought` or `error`: it neither resets stuck nor votes to stop. [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/frontier-admit.cjs:96-100]
   - Value H, effort S-M, risk M: it changes when lineages stop, so the convergence golden tests move.
8. **The merge weighs every lineage equally and calls a self-reported ratio "Convergence".**
   - The lineage's `convergenceScore` falls back to the last iteration's `newInfoRatio`, the merged score is a plain average, and the attribution table prints it under "Convergence". That is how gen3 showed deepseek "1".
   - **Change:** carry a per-lineage `unexaminedPasses` count and `observedRatio` into `lineageExecutors` and the attribution table. Drop the coverage claims of flagged passes (a review dimension marked covered by a zero-finding stamp) from merged coverage, so "zero P0" on those surfaces reads as *not examined*.
   - [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1430-1433] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:883-886] [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/fanout-merge.cjs:1216-1222]
   - Value H, effort M, risk M.
9. **Text-output lineages are blind to the strongest signal.** cli-claude-code runs `--output-format text` (gen3 log P1), so its log holds only the final answer, with no `tool_use` events. Signals 4 and 5 therefore work today for opencode only. Switching Claude to `stream-json` gives tool events with timestamps, and cost as well. This is a precondition for a cross-CLI honesty check, and it connects to Q2. [SOURCE: specs/system-deep-loop/loop-architecture/002-graph-engineering/007-expansive-depth-mode/scratch/dogfood-research-gen3.md:143-144] [INFERENCE: based on finding 4 and the text-log shape]

## Questions Answered
- None fully. F-1-001's signal half is answered with measurements. The weighing half is proposed (findings 7 and 8) but not yet checked against the convergence golden tests.

## Questions Remaining
- What thresholds separate stamps from real passes across runtimes whose logs differ? (Proposed as a child node.)
- Which runtime logs expose timestamped tool events at all? (Proposed as a child node.)

## Ruled Out
- **Pass duration as a standalone signal:** real deepseek passes run as short as 33 s (finding 5).
- **The record's `toolsUsed` and `sourcesQueried`:** both are model-authored (finding 6).

## Dead Ends
- None.

## Edge Cases
- Ambiguous input: none.
- Contradictory evidence: the brief says deepseek reported ratio 1.0 on "all 10 research passes". That matches gen3, while the gen2 review rows carry no `newInfoRatio` at all (they use review fields). Both hold.
- Missing dependencies: Claude lineage logs carry no tool events (finding 9), so the tool-call probe ran on opencode logs only.
- Partial success: none.

## Sources Consulted
- scratch/dogfood-review-gen2.md:135-150, :280-330, :425-441; scratch/dogfood-research-gen3.md
- research_archive/20261120T125555Z/improvement-backlog.md
- runtime/scripts/append-mode-event.cjs:296-330, :400-425
- runtime/lib/deep-research-ledger-schema/legacy-compatibility.ts:870-935
- runtime/lib/deep-loop/lineage-timestamp-window.ts:32, :83-92, :240-300
- runtime/scripts/fanout-run.cjs:1245-1258, :4850-4930
- runtime/scripts/convergence.cjs:1460-1478, :1775-1830; runtime/scripts/frontier-admit.cjs:96-100
- runtime/scripts/fanout-merge.cjs:875-915, :1216-1232, :1420-1440; runtime/scripts/fanout-salvage.cjs:68-100
- Ledger frames and logs of review/lineages/{opus,deepseek} and research_archive/20261120T125555Z/lineages/{opus,deepseek}

## Assessment
- New information ratio: 0.89
- Questions addressed: F-1-001
- Questions answered: none (partial)

## Reflection
- **What worked:** measuring the signals on the committed lineages instead of arguing them. The skew column alone separated the stamped passes with no false positive.
- **What did not work:** citation counts from the narrative. They stay high on context-carried passes, so they do not separate stamps from real passes.
- **What I would do differently:** decode the ledger frames first. They hold the gateway clock every other check lacks.

## Recommended Next Focus
F-1-003: orchestration robustness (process tree and kill, quota and `--only-lineage` reruns, re-entrancy, the ledger as the live view, capability-aware dealing, a root dashboard).
