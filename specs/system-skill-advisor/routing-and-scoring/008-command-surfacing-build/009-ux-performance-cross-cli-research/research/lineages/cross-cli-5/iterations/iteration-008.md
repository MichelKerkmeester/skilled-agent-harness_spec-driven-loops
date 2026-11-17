# Iteration 8: Coverage close-out and the lane's final order

## Focus

Last iteration of the lane. It states what each of the five key questions now has as evidence, orders the lane's recommendations with the files and confirming checks each needs, and names what remains unmeasured so the merged synthesis can carry the limits rather than imply the numbers are stronger than they are.

## Actions Taken

1. Re-read the five strategy questions against the seven iterations.
2. Consolidated the four measurement findings the questions did not originally cover.
3. Assembled the final order with file and confirming check per item.
4. Checked each item's floor risk against the recorded floors.

## Findings

1. Question (a) is answered with a mechanism, not a rate: the arm's followed measure is a pre-write document access test, and phase 033's step reader supplies the step-level counterpart at setup 15 of 20, folder 12 of 20, output 4 of 20. The per-runtime order inverts between the two, so the arm's spread cannot be read as workflow quality. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:81]

2. Question (b) and question (c) are answered by one code fact and one test: `briefDelivered` has no OpenCode branch and returns `unknown` structurally, and the suite pins that answer even for a session whose records hold the brief. Codex is a runner refusal rather than a reader gap, and devin's and dsh's single unplaceable rows are run-line format gaps. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220-303]

3. Question (d) is answered: the ask path accepts two transcript shapes only, and the dsh decline-row start is an outcome difference with the offer delivered, represented and declined twelve times before a different command started. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl]

4. Question (e) is answered with a ranking, but its gain column had to change twice: first from claimed start gain, because no per-runtime interval separates, then to measurement restored, because that is what the evidence prices. [INFERENCE: iteration 4 findings 3 and 5]

5. Four measurement findings sit outside the original five questions and belong in the lane's answer: the start rate credits a bare document read and, on Claude alone, a host expansion the model never chose; the `capped` column mixes exit 143 with exit null and is all exit null on devin; the offer field is a replay in both arms with `offerSeen` as its only cross-check; and Claude's arms carry a 27,730-byte home rules file the harness never isolates. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2035-2038] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1368-1372] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:518-526]

6. The lane's final order, each with file and check. (1) The OpenCode receipt plus reader branch: `.opencode/plugins/system-skill-advisor.js` after the emitted-block observer, an `opencode` branch in `command-offer.mjs` `briefDelivered`, and the test at `command-offer.vitest.ts:259-265`; confirmed when the next arm's OpenCode off rows read `briefDelivered: false` and its `offerReached` reads 0 of 5 against 5 of 5 on, where today both read 5 of 5. (2) The start-shape field and its per-runtime distribution in `score-command-transcripts.mjs`; confirmed by a printed shape count per runtime. (3) The `capped` split into exit 143 and exit null; confirmed by devin's start rate printing over 15 rows instead of 11 and 12, and by a `capped` line that names its cause. (4) `restored: false` scored as unscored with a reason; confirmed by dsh's `unscored` rising from 0 to 1 and devin's by 2. (5) One Claude arm with `CLAUDE_CONFIG_DIR` on an empty directory; confirmed by a same-rows followed comparison against 6 of 28. (6) The Codex arm unlock, blocked on the operator's `/hooks` approval rather than on code. (7) The ask-representation widening, which touches 1 of 280 runs and rewrites prior arms' numbers. [INFERENCE: assembled from iterations 2 to 7]

7. Floor risk is none for items 1 to 5 and 7's product side, because none of them changes a command, a vector, a brief byte or a scoring input: items 1 to 4 are readers and counters, 5 is a run setting, and 6 is an operator action. Item 7 changes a measure, which is why it is last, and it would alter previously published arm numbers if adopted retroactively. [INFERENCE: from the file list and the recorded floors of 24 of 44 typed and 0 of 35 false offers]

8. What remains unmeasured in this lane: whether a longer OpenCode cap would raise its judgeable rows (the `performance-5` lane owns the cap itself); whether Claude's home rules file moves any row (item 5 is the test, not yet run); and which shape produced each existing start count (item 2 is the test). No claim in this lane rests on those three, and each is stated as a proposed measurement rather than a result. [INFERENCE: from the capped and start counts in summary-arm.json and the files named in items 2 and 5]

## Ruled Out

- A sixth answer question. The lane's five questions are answered; the four extra findings are measurement facts about the instrument, and folding them into a new question would hide that they were found while testing the answers.

## Dead Ends

- Ranking by any per-runtime start delta. Recomputed intervals overlap for all five runtimes, so that column cannot carry an order.

## Edge Cases

- Ambiguous input: whether measurement-integrity items belong in a research answer at all. They are included, because every published per-runtime number in this lane depends on them and the merged synthesis would otherwise repeat a confounded comparison.
- Contradictory evidence: the runner's `reruns.txt` calls a restore-failed row unmeasurable while the summary counts it; both are stated, and the scorer's behaviour is named as what decides printed numbers.
- Missing dependencies: no arm can be run from this lane, so all five confirming checks are specified rather than executed.
- Partial success: three numbers the lane would like are unavailable (cap headroom, Claude isolation, shape mix). They are named in finding 8 rather than approximated.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:1-81`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220-303`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2035-2038`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1368-1372`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/prepare-behaviour-arena.mjs:518-526`

## Assessment

- New information ratio: 0.35
- Questions addressed: (a), (b), (c), (d), (e) in consolidation
- Questions answered: none newly; all five were answered earlier

## Reflection

- What worked and why: keeping the four instrument findings separate from the five answers made the order possible. Folding them into a question would have produced a list of six topics and no rank, because the instrument facts do not compete with the product facts for a place.
- What did not work and why: the first draft of this close-out ranked the instrument items by how surprising they were. That is not a gain measure; the order was rebuilt on what each item restores to the published numbers.
- What I would do differently: state the "measurement restored" column in iteration 1. Knowing that the followed and start measures are both document-access tests would have redirected the first two iterations to the counters sooner.

## Recommended Next Focus

None. The lane's five questions are answered and the order is set. The merged synthesis should carry the three unmeasured items as limits and repeat none of the per-runtime comparisons without the instrument caveat attached.
