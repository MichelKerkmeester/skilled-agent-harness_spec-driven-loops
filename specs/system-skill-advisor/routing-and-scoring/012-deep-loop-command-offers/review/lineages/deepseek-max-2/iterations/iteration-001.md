# Review Iteration 001

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=correctness.
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`.
Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder, Level 2). Read-only. No `steer.md` exists in this lineage at this iteration, so no lead ruling applied.

## Files Reviewed
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1583` (`attachCommand` branch order)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1674` (`deferredLoopCommand`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1694` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1713` (`loopAskCues`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1178` (`asksForLoopRun`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884` (`lowerFolded`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:805` (`runAskNegatedAt`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:795` (`endsBefore` bounded window)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1521` (`commandOnlyMentioned`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36` (`MODE_COMMANDS` hub table)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098` (`_fold_quotes`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378` (`MIN_BLOCKED_ATTEMPTS`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227` (`stripReviewVerdict`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2421` (`replaceAnchorSection`)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None active. Every correctness probe below was resolved to a pass or ruled out; none produced a wrong result that a real input can reach, so nothing is written as a finding.

## Traceability Checks
- `spec_code` (core, hard), status `partial` this iteration: REQ-049's two-copy whitespace rule is confirmed in code at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:884] (`lowerFolded` collapses `\s+` after folding the curly apostrophe) and [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5098] (`_fold_quotes` does the same with `re.sub(r"\s+", " ", ...)`). The remaining REQ rows are not yet checked; `spec_code` is completed in the traceability iterations.
- `checklist_evidence` (core, hard) not run this iteration.

## Integration Evidence
- `@deep-review` iteration contract: this file, the delta at `review/lineages/deepseek-max-2/deltas/iter-001.jsonl`, and the append gateway row are the three artifacts the workflow's `post_dispatch_validate` reads.
- `reduce-state.cjs` `MIN_BLOCKED_ATTEMPTS` at [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2378] is the projection my own strategy's `## 10. EXHAUSTED APPROACHES` will be read through, so the one-attempt wording below is what the reducer will render for a first-pass ruled-out direction.

## Edge Cases
- **Both cues, no mode.** `deferredLoopCommand` calls `askedLoopMode`, which returns `undefined` when two mode cues or none are present ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1740]), so a deferred route whose prompt names both research and review carries no command, matching the spec's Edge Cases line for "run 5 iterations of research and review on the parser". Chosen reading: safe, no offer.
- **Stuck branch before every route shape.** The stuck complaint is answered before the `defer`/`clarify` branch and before the single-target check ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1596]). A stuck complaint on a deferred route therefore gets the doctor rather than no command; the comment states that intent, and the guard cases pin it.
- **Partial success.** None: every probe below reached a decided reading.

## Confirmed-Clean Surfaces
- **Refused phrase settles no mode.** `loopAskCues` blanks a `LOOP_REQUEST` match when `runAskNegatedAt` holds or `LOOP_ASK_REFUSED_AFTER` matches the text right after the phrase ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1719]); the blank keeps the phrase length, so later offsets still point at the same words ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1720]). REQ-041's rule holds at the producer.
- **The refusal-after read lands where the phrase ends.** `LOOP_REQUEST`'s bare-wording alternative ends at the loop name ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:996]), so "a deep review is not needed" leaves " is not needed" for `LOOP_ASK_REFUSED_AFTER` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:813]).
- **No-edit keeps a read-only loop.** Both offer paths test `READ_ONLY_LOOP_MODES` before withholding ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621], [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1686]).
- **Reducer one-ruling wording.** A ruled-out direction with one pass renders as `RULED OUT` with a reopen condition, not `BLOCKED` ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2402]).

## Ruled Out
1. **No-edit guard reads the routed mode, not the served mode** -- `attachCommand` withholds on `isNoEditRequest(prompt) && !READ_ONLY_LOOP_MODES.includes(workflowMode)` at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1621] before `servedMode` is computed at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1637]. Ruled out as unobservable: the only modes the hub maps are `research` and `review` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36]), and both are in `READ_ONLY_LOOP_MODES` ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:558]), so the two reads can never disagree on today's tree. No case produces a wrong result.
2. **Bounded negation window loses a distant refusal** -- `endsBefore` reads a 400-character window ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:784]). Ruled out: `RUN_ASK_NEGATED_SOURCE` itself allows at most two words between the lead and the phrase ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:763]), so the window is never the limiting factor and no prompt that the grammar would refuse is lost to it.
3. **Typed doctor on a stuck complaint bypasses the no-edit guard** -- the first branch returns the doctor for a typed doctor command ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1597]) before the no-edit test. Ruled out: `commandOnlyMentioned` still withholds a mention, and a typed doctor the reader asked for is the request itself, as the comments at [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1593] state and the guard case "my deep research run is stuck, don't fix anything, just run /doctor:deep-loop …" pins.
4. **Reducer section replacement could duplicate a heading** -- `replaceAnchorSection` absorbs an authored heading above the anchor ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2453]) and keeps the file's own ordinal ([SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2430]). Ruled out for the heading-first dialect: the authored-heading pattern requires the marker directly under the heading, and the strategy template this lineage wrote carries `MACHINE-OWNED` markers instead, which the heading fallback matches.

## Next Focus
- Dimension: security
- Focus area: the deep-loop gate's trust boundary — the prompt is untrusted text, and the gate must not let it choose an owner or a policy that the tracked table does not name.
- Reason: coverage needs the security dimension recorded before the last iteration; correctness found no active finding to follow up.
- Rotation status: correctness reviewed (1/4 dimensions).
- Required evidence: file:line for the tracked-command vetting, the policy the attached command carries, and any path where prompt text reaches a command string.
- Blocked/productive carry-forward: none.
- Recovery note: not applicable.

Review verdict: PASS
