# Iteration 6: Offer coverage on the fresh plain rows, and the inverted depth gate

## Focus

Close the source-diversity gap that blocks convergence, and with it verify the one claim R1 rests on that this lane had not measured itself: what the brief actually offered across the twenty fresh plain rows, per runtime.

## Actions Taken

1. Counted the offered command on each of the twenty `fresh-fit-*` rows, per runtime, in the on arm run 1.
2. Compared each offer with the row's `expected_command` and read the three rows whose offer is a different command.
3. Searched the whole fresh set for the depth vocabulary to find every row R1 could touch.
4. Read the hook's replay path to confirm the run-line offer is the hook's own output, not a runner guess.
5. Registered the sources for the questions with their evidence class so the coverage graph can score diversity.

## Findings

1. The on-arm brief carries a command on 7 of the 20 fresh plain rows, and the count is identical on all five runtimes: 7 of 20. The other 13 rows carry no command at all. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1]
2. Five of the seven offers are the row's expected command (`/create:readme`, `/create:goal`, `/design:chart`, `/design:diagram`, and `/doctor:agents-md check` for the `/doctor:agents-md` family). Two are a different doctor command: `/doctor:setup` where the row wants `/doctor:env`, and `/doctor:overlay status` where it wants `/doctor:update`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:11]
3. None of the five ask-policy plain rows carries a command: the changelog row, the deep-research row, the deep-review row, the design-extract row and the skill-advisor doctor row all reach the model as a skill with no runnable command. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1]
4. The depth gate is inverted on the only two fresh rows that use a depth phrase. `fresh-fit-18` asks for "a thorough multi-pass review" and expects `/deep:review`; `fresh-decline-refusal-02` says "skip the deep review" and expects nothing. The brief offers `/deep:review` on the refusal and not on the request, on all five runtimes. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:18]
5. R1 must therefore be two-sided. A prose depth-phrase rule that only reads refusals would remove the false offer on the refusal row and leave the missing offer on the real request; the same change must prove both rows. Confirmation: one render replay shows `/deep:review` in `fresh-fit-18`'s head and not in the refusal row's head. [INFERENCE: from findings 4 and the attach gate at command-attach.ts:510]
6. The 13 no-command rows are not all failures: a skill-only route is counted as followed by the arm's own metric, so 7 of 20 is an offer-surface count, not a success rate. What it does bound is the reach of the policy word: a model cannot act on a `(start)` or `(ask)` word the brief never printed. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2314]

## Ruled Out

- Treating 13 of 20 as 13 failures: the arm's metric follows a skill path, so the count is about the offer surface only.
- Blaming the runner for the missing offers: `replayOffer` spawns the hook with the row's prompt and reads the head it returns, so the run line records the hook's own output.

## Dead Ends

- A stored head for `fresh-fit-18`: the run line records the offer fields, not the rendered string, so the cause of the missing command needs one hook replay of that prompt.

## Edge Cases

- Ambiguous input: "no command" can mean the route chose a skill-only path or the attach gate withheld a command. The run line cannot separate them; both leave the model without a runnable command, which is what this lane measures.
- Contradictory evidence: iteration 4's R1 was scoped from the refusal row only. This iteration shows the same vocabulary has one request row, so the recommendation is amended rather than withdrawn.
- Missing dependencies: no hook replay was run, because this lane must not run the repo's tooling; the cause of the `fresh-fit-18` miss is named as the next check.
- Partial success: the offer counts are per runtime and agree exactly, so the measurement is solid; the cause of each miss is not.

## Questions Answered

- None new. All four lane questions were already answered; this iteration strengthens their evidence.

## Questions Remaining

- None. The confirmation runs named in the recommendations are follow-up work, not open questions.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/claude.jsonl:1`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:11`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:100`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2314`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:510`

## Assessment

- New information ratio: 0.85
- Questions addressed: the offer-surface coverage and R1's scope
- Questions answered: none new (all four were already answered)

## Reflection

- What worked and why: counting per row instead of trusting the aggregate exposed the strongest number in this lane — 7 of 20 offers, identical everywhere — and the depth gate's inversion fell out of the same pass.
- What did not work and why: the first attempt to compute plain-row offers with a shell join returned zero and was wrong; the field is present on the raw line, so the join had failed, not the data. Re-reading one line before trusting the aggregate caught it.
- What I would do differently: start every arm question with a per-row dump of the field being counted; the aggregate names are not the row names.

## Recommended Next Focus

None for research. Synthesis should carry the 7-of-20 offer coverage, the ask-policy zero, and the two-sided R1 as the lane's headline results.
