# Review Iteration 005

## Dispatcher
Resolved route: mode=review; target_agent=@deep-review; execution=single_review_iteration; dimension=traceability (checklist_evidence).
Artifact directory: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2`. Read-only review; no `steer.md` exists in this lineage.

## Files Reviewed
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:36` (T001, T018, T022, T027)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166` (the open T084)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:219` (T112 to T114)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:268` (CHK block, CHK-001 to CHK-051)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:341` (Verification Summary)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (AC-001 to AC-061)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` (REQ-011)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603` (ADR-007)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2227` (the fallback's `autonomous research` boost)
- `.skilled/skills/system-deep-loop/deep-research/SKILL.md` (the mode packet's retained alias)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-focus.txt` (T114)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/results-after.json` (N6, N10, R2, V2, V4, H7, H10, H3b, K2)

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **REQ-011 reads as a global drop of `autonomous research` while four surfaces still carry it** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235` -- The requirement says "`autonomous research` was dropped after its out-of-domain replay pulled a slide-deck prompt to the hub, and ADR-007 amends this requirement to the two aliases the tree carries." ADR-007 scopes the drop to the hub alias lists and states that the deep-research mode packet and the Python fallback keep the alias, but REQ-011's own sentence carries no such qualifier, so a reader who checks the requirement against the tree finds the phrase on four retained surfaces and has to reach the ADR to learn why that is intended.
Finding class: instance-only (one requirement sentence, one missing qualifier).
Scope proof: the sentence is at `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235`; the scoping paragraph is at `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:627`; the retained hits are the fallback boost at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2227` and the mode packet's trigger lists.
Affected surface hints: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md`, `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md`.
Case: a reader runs `rg -n 'autonomous research' .skilled/skills/system-deep-loop .skilled/skills/system-skill-advisor/runtime/scripts` to check REQ-011 and gets the fallback boost and the mode packet's keywords; the requirement says the alias "was dropped", so the reader reports a contradiction with the tree, and the only text that resolves it is ADR-007's constraint section rather than the requirement that states the rule.
Claim adjudication:
```json
{"type":"ambiguous_requirement","claim":"REQ-011 states the alias was dropped without naming the surfaces the drop covers, while the tree keeps the alias on four surfaces that ADR-007 records as out of scope.","evidenceRefs":["specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235","specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:627",".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:2227"],"counterevidenceSought":"read ADR-007 in full for the scoping sentence (present and explicit), checked the hub files for the alias (zero hits, so the built clause holds), and looked for a REQ sentence that names the hub as the scope (the preceding sentence names hub-router.json and ROUTER.md, which is the only in-text cue).","alternativeExplanation":"the surrounding sentence already names the two hub files, so the drop is plainly about them and no qualifier is needed.","finalSeverity":"P2","confidence":"medium","downgradeTrigger":"a reader test, or a review that reports no contradiction from the grep, would show the surrounding sentence is enough context."}
```

## Traceability Checks
- `checklist_evidence` (core, hard), status `pass`: every checklist family was read against the tree. 141 items are ticked and exactly three are open: T084 (the rerun itself), the "All tasks marked `[x]`" completion criterion that depends on it, and CHK-020 (P0), which states that AC-040 is `Unmet` — the three agree with each other and with AC-040. The mechanically checkable ticks were re-run: T001's decision count prints 11, CHK-040's pointer count prints 4/1/2 as claimed, T018's `--extend=N` search prints six lines in `deep-review.yaml` as claimed, T022 prints one line, T027 prints nothing, CHK-042's `convene` search prints nothing, and CHK-021's probe file holds 69 rows. The stage-one and negative probe rows say what AC-013 and CHK-022 claim: R2 tops `system-spec-kit`, V2, V4 and H10 top the hub with `/deep:review`, H7 with `/deep:research`, H3b tops nothing, and N6 and N10 carry no command. One ticked P0 item fails its own command: CHK-001 (already filed as F-004-001, not re-reported here).
- `spec_code` stays `pass` from iteration 4.

## Integration Evidence
- Twelfth round checked as the focus asks: T112 is confirmed by REQ-053's one declaration and the scorer's import ([SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:197], [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27]); T113's items are each checkable (AC-038 states no list count, T076 and T092 state their rounds only, T111 scopes itself to tracked files, REQ-025's dropped caller is absent, ADR-007 scopes itself, and `timeline.md` reaches generation 8); T114's focus file asks for all four dimensions before the last iteration, full repo-relative finding paths, the current REQ, AC and ADR ranges, and no lineage-written `terminal_gates` row ([SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/fanout-review-focus.txt:1]).
- Verification Summary checked: 12 P0 items with 11 verified matches the 12 P0 checks and the one open P0 (CHK-020); 13 P1 and 1 P2 items are all ticked.

## Edge Cases
- **An open item that is the run itself.** T084 and AC-040 are open because they name the review rerun that this lineage is part of. Recording them as unmet is correct; recording them as met would be a claim about a run that has not stopped yet. The synthesis, not this iteration, decides them.
- **A row whose evidence is a dated observation.** Several acceptance rows quote suite counts from the round they were recorded in (`186 files, 3,415 passed` in AC-048, `3,518` in AC-057, `3,418` in AC-055). Each states its round or commit, so a later tree with a different count does not contradict them; they were read as dated observations rather than as current claims.

## Confirmed-Clean Surfaces
- **The open checklist items agree with the acceptance table.** Three open items, one open acceptance row, and no fourth blocker.
- **The task ticks that name a command were re-run and hold** (T001, T018, T022, T027, CHK-040, CHK-042), so the checklist's evidence is not a transcription of intent.
- **The twelfth round's three tasks each leave a checkable trace** (T112 via REQ-053's symbols, T113 via the closure rows it names, T114 via the focus file).

## Ruled Out
1. **The Verification Summary miscounts its own items.** Ruled out: the 12 P0, 13 P1 and 1 P2 checks in `tasks.md` are exactly the counts the summary states, and the single unverified P0 is CHK-020.
2. **An acceptance row claims a current suite count it cannot support.** Ruled out: each such row names the round or commit it observed, so the counts are dated observations, not present-tense claims.
3. **T084 is silently closed by this run.** Ruled out as a documentation defect: T084 stays `[ ]` and AC-040 stays `Unmet`, which is what the terminal gates of this lineage will either satisfy or leave open.

## Next Focus
- Dimension: traceability (overlay protocols)
- Focus area: the four overlay protocols — `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` — against the tree: does each skill, agent, feature-catalog entry and playbook statement the packet changed match the built behaviour?
- Reason: the core protocols are recorded; the overlay set decides whether the packet's doc changes are as claimed, and a second pass over the remaining `Met` rows fits here.
- Rotation status: all four dimensions recorded; traceability continues to iteration 7.
- Required evidence: full repo-relative `path:line` for each overlay surface named.
- Blocked/productive carry-forward: F-004-001 and F-005-001 are doc findings; do not re-report them.
- Recovery note: not applicable.

Review verdict: PASS
