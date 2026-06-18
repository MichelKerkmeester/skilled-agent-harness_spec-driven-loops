# Iteration 6: Adversarial Verification — Two-Gate STOP Integration + Continuity-Injection Paths

## Focus
Round A verification of two Deep Loop open items: (a) does D3's two-gate STOP REPLACE or ADD to the current STOP gate? (b) are reducer anchors + prompt-pack variables the ONLY continuity-injection paths? Read-only.

## Actions Taken
1. Read the STOP decision path `convergence.cjs:378-381` + research blocking-guards (`:198,:204,:207-209`).
2. Grepped lib+scripts for `posterior|stopThreshold|kMin|distinctReliable` (0 hits) and confirmed `bayesian-scorer.ts` (computeScore/shouldDemote) is not imported by any STOP path.
3. Traced continuity injection: reducer `replaceAnchorSection` (`reduce-state.cjs:734-745`) + prompt-pack `renderPromptPack` (`prompt-pack.ts:55`, `prompt_pack_iteration.md.tmpl:9-24`); grepped `inject|continuity|anchor`.

## Findings (file:line)

**Two-gate STOP can be ADDED, not replace — [CONFIRMED].** `decision = blockingBlockers.length>0 ? 'STOP_BLOCKED' : evaluated.trace.every(passed) ? 'STOP_ALLOWED' : 'CONTINUE'` [convergence.cjs:378-381]. The STOP_ALLOWED branch is a single conjunction; the lower-risk integration extends it (`... && posterior>=stopThreshold && distinctReliableSourceCount>=kMin`), leaving blockers + per-signal trace untouched. None of posterior/stopThreshold/kMin/distinctReliable exist today (grep=0); `bayesian-scorer.ts` exports computeScore/shouldDemote for executor reliability but is NOT imported by any STOP path → two-gate STOP is net-new + purely additive. **Overlap to reconcile:** `distinctReliableSourceCount` partly duplicates the existing research `sourceDiversity` blocking_guard (`:204,:207-209`). [CONFIRMED — ADD, don't replace.]

**Continuity-injection paths are EXACTLY two — [CONFIRMED].** (1) reducer writes 7 strategy-anchor sections via `replaceAnchorSection` [reduce-state.cjs:734-745]; (2) prompt-pack injection via `renderPromptPack` [prompt-pack.ts:55] substituting `{state_summary}`/`{next_focus}`/`{remaining_questions_list}` + path pointers `{state_paths_*}` [prompt_pack_iteration.md.tmpl:9-24]. The executor's strategy-file read is DRIVEN BY a prompt-pack path variable → subsumed under prompt-pack, not a third channel. Other `inject` hits are DI/test-fault-injection (fanout-pool.cjs:11, cli-guards.cjs:142), not continuity. No env/appended-context seam. [CONFIRMED — roadmap's "not exhaustively traced" closed; two-mechanism model is exhaustive.]

## Questions Answered
- Replace or add? **ADD** (extend the STOP_ALLOWED conjunction) is lower-risk; two-gate STOP is net-new/additive.
- Other continuity paths? **NO** — exactly two (reducer anchors + prompt-pack); exhaustive.

## Questions Remaining
- (new) Should `distinctReliableSourceCount` REUSE/REPLACE the existing `sourceDiversity` blocking_guard rather than add a parallel gate?
- (new) Do the review/context reducers expose the same 7 anchors or a different per-mode set (only the research reducer's 7 were line-verified)?

## Next Focus
Two-gate STOP = additive (extend conjunction + reconcile with sourceDiversity); continuity model = exhaustively two paths. Feeds D3/D4 build sequencing. Residual: per-mode anchor-count enumeration (review/context reducers).
