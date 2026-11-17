# Iteration 1: What the 033 arm's per-runtime follow-through numbers actually measure

## Focus

The 033 untuned arm reports a followed rate per runtime that spans 4 of 28 on claude to 24 of 28 on devin. This iteration asked what that measure counts, then compared it with the step-level reader phase 033 produced, so that the per-runtime gap can be attributed either to a runner instrument or to a product surface.

## Actions Taken

1. Read the per-runtime scoring block of `033-untuned-arm-arena-run/scratch/arm-evidence.txt` and `summary-arm.json`.
2. Read the classifier that produces `workflow.followedRate` and the helper it calls.
3. Read phase 033's step-reader report over 20 sessions across five runtimes.
4. Read `briefDelivered` for the per-runtime reader inventory.

## Findings

1. The arm's followed rate is a document-access test, not a step-execution test. `followedBeforeWrite` counts a run as following when it read the command's document (or loaded the command through a skill event) before its first write, and disqualifies it only when a "confirm" document is read after the write. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1182-1212] The classifier's own contract states the intent: "The measure asks whether a run opened a workflow before it acted, not whether it followed each step, so one load decides the path." [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1301-1302] So the 4-of-28 to 24-of-28 spread is a spread in document access, and no arm number today reports whether a workflow's steps ran.

2. Phase 033 did produce the step-level number, and it is far below every followed rate: setup 15 of 20, folder 12 of 20, output 4 of 20 over the 20 sessions the reader examined. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:81] This is the first measured answer in this packet to the limit `arm-evidence.txt` records as "a loaded document is not a followed step". [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt]

3. The step split inverts the arm's runtime order. Per runtime over four sessions each: claude setup 3, folder 3, output 2; devin setup 2, folder 2, output 1; dsh setup 3, folder 2, output 0; opencode setup 3, folder 2, output 1; pi setup 4, folder 3, output 0. [INFERENCE: counted from the 20 blocks of specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:1-81] Pi is the only runtime whose setup step passed in all four sampled sessions, and it produced the named output in none; devin, the arm's highest followed runtime at 24 of 28, produced the named output in one of four. The runtime that opens the document most is not the runtime that finishes the work most.

4. OpenCode's delivery unknown is a missing reader, not a delivery failure. `briefDelivered` has branches for `claude`, for `pi`/`devin`/`dsh` together, and for `codex`, then falls through to `return 'unknown'`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:239-303] The string `opencode` does not occur anywhere in that file. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs] The 36-of-36 off and 44-of-44 on unknown counts are therefore exactly what the code produces for a runtime with no branch, and they carry no information about whether the plugin emitted a brief.

5. The three runtimes that do have a reader still differ in what the reader can see. Claude is read from a transcript attachment of one fixed hook event; pi, devin and dsh are read from session records or an injected block; codex returns `false` without reading when its hook is unapproved and `unknown` when the records do not carry the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:240-300] A `false` on codex is a positive delivery answer, but an `unknown` there is indistinguishable from opencode's structural unknown, because both print as `deliveryUnknown`.

## Ruled Out

- Reading the arm's per-runtime followed rate as a UX or fit measure. The classifier's contract and its helper both define it as a pre-write document read, so the label overstates what the number is.
- Treating opencode's `deliveryUnknown 44` as evidence that the plugin failed to emit. No reader exists to observe either outcome.

## Dead Ends

- Comparing the arm's followed rate with the step reader as two estimates of one quantity. They are not: one is pre-write access, the other is post-hoc step grading on a different row sample (the 20 `fresh-fit-*` rows, not the 28 paired rows).

## Edge Cases

- Ambiguous input: none. The focus came from the strategy's designated next focus.
- Contradictory evidence: none. The arm's own limit line and the classifier's contract agree.
- Missing dependencies: the step reader covers 20 sessions, 4 per runtime, not the 28 paired rows per runtime. Recorded as a sampling limit rather than a failure.
- Partial success: the reader's 20 blocks are complete; what is missing is a reader run over the paired rows themselves.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/step-reader/report.txt:1-81`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1182-1212`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1300-1341`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:239-303`

## Assessment

- New information ratio: 0.75
- Questions addressed: (a), (b), (c)
- Questions answered: (a), (b)

## Reflection

- What worked and why: reading the classifier before the numbers turned a spread into a definition. The 4-of-28 to 24-of-28 range looked like a behaviour difference until the helper showed that one pre-write read decides the path; after that the spread reads as access, which the step reader confirms is not completion.
- What did not work and why: the first plan was to compare the arm's followed rate against the step reader as two measures of one quantity. They sample different rows and different stages, so the comparison had to be reframed as two measures of different things rather than a contradiction.
- What I would do differently: read the reader inventory (`briefDelivered`) before the scoring block next time, because a runtime with no reader cannot contribute a delivery fact no matter how many rows it has.

## Recommended Next Focus

Question (c): enumerate every gap where the measuring reader, not the runtime, is the limit — codex's `unknown`-on-unread path, devin's and dsh's single `offerFieldAbsent` row, and opencode's whole arm — then rank them by whether a reader fix could change a published number. Question (d) follows: what surface decides whether an ask offer is representable per runtime.
