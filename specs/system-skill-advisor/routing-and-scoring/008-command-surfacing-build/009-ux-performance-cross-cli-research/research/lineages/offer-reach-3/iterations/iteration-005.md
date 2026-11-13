# Iteration 5: Floor risk of the two leading candidates, measured on the silent rows

## Focus

Price the floor risk of the two leading candidates directly: where the 35 silent floor rows sit relative to the doctor family (candidate 2), and which rows the proposed alias wording of candidate 1 can actually reach, including other tune rows that already carry the right command.

## Actions Taken

1. Ran `advisor_recommend` for all 35 counted silent rows (must-not-start, near-miss and partial-slash) and saved the top three recommendations with scores, confidence and uncertainty to `prompts/none-floor-live.jsonl`.
2. Read the three rows whose top is `system-skilled-doctor` and their score margins.
3. Counted tune rows matching the candidate-1 keyword families and read the one tune row that shares a word with the proposed human-voice phrases.

## Findings

1. The floor baseline at HEAD is clean: 0 of 35 silent rows carry a command, 15 return no recommendation at all, and 20 return a skill-only head. Any offer on these rows is a floor break, so candidate 2 has no slack. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl]

2. The doctor-family risk set for candidate 2 is exactly three rows: `mns-chat-03` (must-not-start, top score 0.090611), `nm-system-skilled-doctor-01` (near-miss, 0.240312) and `sv-03` (partial slash, 0.125331). They are the only silent rows a doctor anchor can reach, and their top scores are 0.09 to 0.24. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl]

3. The narrow band for candidate 2 is therefore between a new anchor strong enough to pass the 0.8 confidence gate on the five below-threshold rows and weak enough to stay under three doctor-top rows scoring 0.09 to 0.24. That band is the reason it ranks below a two-row alias despite moving more rows. [INFERENCE: based on findings 1 and 2]

4. Candidate 1's readme keyword is isolated: `overview page` appears only on `cmd-create-readme-plain-tune-01`, so adding it cannot move another tune row. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]

5. Candidate 1's human-voice wording must avoid the bare word `rewrite`. `cmd-create-diff-plain-tune-01` already carries `/create:diff` and its prompt is a before-and-after rewrite request, so a bare `rewrite` keyword would steal a working row; the exact phrases `reads like a person` and `score how human` appear only on the human-voice row. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl]

6. Candidate 1's full exposure is measured: 0 of 35 floor rows, 0 of the other 52 `none` rows, and at most 1 other tune row if the wrong keyword is chosen. That makes it the lowest-risk change that moves a row. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl]

7. The three doctor-top floor rows pass the render gate on confidence 0.82 and uncertainty 0.22 to 0.34 while scoring 0.09 to 0.24, so the floor is protected by the ranking band, not by a comfortable score margin; candidate 2's verification must name those three row ids, not only the aggregate 0 of 35. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl]

## Ruled Out

- Treating the 0 of 35 floor as the whole risk test for candidate 2. The three doctor-top rows are the ones that move first, and the aggregate would only show the failure after the fact.
- Adding a bare `rewrite` keyword to the human-voice class. It would steal a working diff row.
- Measuring candidate 1 with a whole-file alias rewrite. The two exact phrases are isolated, so a narrower edit carries the same gain with no canary exposure.

## Dead Ends

- Estimating candidate 2's new scores without writing the anchors: no read-only switch scores a hypothetical anchor set, so the band is stated as a constraint on the implementing phase, not a predicted number.

## Edge Cases

- Ambiguous input: "floor risk" could mean the 0 of 35 count or the nearest-row margin. Both are reported; the row ids are the actionable form.
- Contradictory evidence: none; the measured 0 of 35 matches the committed floor line.
- Missing dependencies: candidate 2's anchor wording is not authored here, so its exact score effect stays UNKNOWN by design.
- Partial success: none.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/009-ux-performance-cross-cli-research/research/lineages/offer-reach-3/prompts/none-floor-live.jsonl` (35 rows)
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (tune and none rows)
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/012-plain-offer-reach/implementation-summary.md:140`

## Assessment

- New information ratio: 0.55
- Questions addressed: the floor exposure of the two leading candidates and the exact rows that constrain them
- Questions answered: none of the strategy key questions is newly answered; this iteration bounds the risk of the answers already given

## Reflection

- What worked and why: running the silent rows turned the floor from an aggregate into three named rows with score margins, which is what an implementing phase can check.
- What did not work and why: the first canary count checked only the `none` split and missed that a busy tune row shares the word `rewrite`; reading the neighbouring tune prompts caught it.
- What I would do differently: check canary exposure on both splits before proposing any keyword, not after.

## Recommended Next Focus

Iteration 6: reconcile the four plain-offer numbers in play (committed capture 23, live head 27, real capture 28, projected 30 after candidate 1) into one measurement model, and close the lane with the ranked list, the verification each item needs and the one measurement gap that remains.
