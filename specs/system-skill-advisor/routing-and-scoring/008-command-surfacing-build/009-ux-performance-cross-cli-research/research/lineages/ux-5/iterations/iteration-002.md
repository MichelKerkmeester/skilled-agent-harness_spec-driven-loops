# Iteration 2: The decline taxonomy, and what a declined or refused offer does

## Focus

Why an ask offer of `/deep:review` reached the refusal decline row `fresh-decline-refusal-02`, and what a declined or refused offer does on each runtime. Narrowed to the eight `decline` rows the fresh set defines and the five runtimes the 033 arm measured.

## Actions Taken

1. Enumerated the fresh row taxonomy by `row_type`, `decline_kind` and `expected_policy`.
2. Read every decline row's prompt, and the offer each runtime recorded for it in both arms.
3. Read the attach path end to end: `attachCommand` and its six gates in `command-attach.ts`.
4. Read the runner's decline-start definition and the per-start list in `summary-arm.json`.
5. Compared explicit declines (`offerSeen`, `offerDeclined`) with starts on the on arm, per runtime.

## Findings

1. The fresh set defines eight decline rows as four kinds twice each: refusal (2), question (2), small-edit (2) and app-problem (2). Every one carries `expected_command: null` and `expected_policy: null`, so the contract is "no command at all", not "a command with a cautious policy". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:28]
2. The built brief still offers a command on five of those eight rows, identically on all five runtimes and in both arms: `fresh-decline-question-01` → `/create:goal (start)`, `fresh-decline-question-02` → `/speckit:ai-council (ask)`, `fresh-decline-refusal-01` → `/create:readme (start)`, `fresh-decline-refusal-02` → `/deep:review (ask)` and `fresh-decline-small-edit-02` → `/create:changelog (ask)`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1]
3. Four of the five are prose mentions that the guard cannot see. "The goal document", "the AI council", "writing a README" and "the deep review" name no typed command, and `commandOnlyMentioned` only tests the literal command string. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:494]
4. The refusal row passes every gate `attachCommand` has: it is not a no-edit request, it types no command, it is not one of the three small-edit gated creation commands, and "deep review" satisfies the depth-request list, so the deep-loop gate attaches the command rather than withholding it. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:510]
5. The fifth offer, `/create:changelog` on the small-edit row, is a named exclusion rather than a miss: the small-edit gate covers only `/create:readme`, `/create:feature-catalog` and `/create:manual-testing-playbook`, and `/create:changelog` is policy `ask`. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:339]
6. The arm's single decline start is dsh on arm run 1 on `fresh-decline-refusal-02`, and the command it started is `/create:sk-skill` while `/deep:review` was the offer. The start is therefore a substitution, not a model following the offered workflow. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
7. Explicitly declining an offer is almost absent: across the on arm the turns echo a command line 7 times on dsh, 2 on OpenCode, 2 on pi, 3 on devin and 0 on Claude, and only one run in the whole arm marks the command `declined` (devin). The other offers are used or silently ignored. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]
8. dsh's on arm also records five runs in `workflow.none` with all five `noneActed`, so on those rows the model acted without opening any tracked workflow. Model action is not mediated by the brief on every row, which bounds what an offer-fit change can promise. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1]

## Ruled Out

- Counting the `startedOfOffered` aggregate as a decline-row rate: that counter only increments when a row's expected command was offered and then started, and decline rows have no expected command, so it cannot describe them.
- Treating an offer on a decline row as a safety failure by itself: 49 of the 50 decline-row offers in the run lines produced no start.
- Re-checking phase 020's question-shape limitation: it is already recorded there and restated here only as mechanism, not as a new finding.

## Dead Ends

- A prose refusal vocabulary anywhere in the attach path: the only refusal lists operate on a typed command name, and `isNoEditRequest` covers change wording, not workflow refusal.
- A per-row declaration of what the model did with the offer: the run line records the offer and the changed paths, not the action; the action only appears in the scorer's per-start list.

## Edge Cases

- Ambiguous input: "what does a declined or refused offer do" can mean the model's behaviour or the brief's policy. Narrow reading: both, reported separately, with the policy from the run line and the behaviour from the scorer's start list.
- Contradictory evidence: none. The offer is present in every runtime's run line; the one start is present in one summary block.
- Missing dependencies: the dsh session transcript is outside the repository; the start command is taken from the scorer's own `commandStartRuns` row rather than re-read from the session.
- Partial success: the per-runtime explicit-decline counts come from summary blocks, not from a re-scoring run.

## Questions Answered

- Why did an ask offer of `/deep:review` reach the refusal decline row `fresh-decline-refusal-02`, and what does a declined or refused offer do on each runtime?

## Questions Remaining

- What does the brief's wording cost a model that would otherwise start a workflow: head line, directive block, command-line order and length?
- Which offer-fit or decline-path UX gaps remain after phases 016 to 033 that no planned or built phase already covers?

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/behaviour-fresh-prompts.jsonl:28`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:339,494,510`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json:1`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt:16`

## Assessment

- New information ratio: 0.75
- Questions addressed: the decline/refusal mechanism and per-runtime behaviour (Q2)
- Questions answered: Q2

## Reflection

- What worked and why: counting the offers per row rather than reading the aggregate made the guard's blind spot measurable; the aggregate `startedOfOffered` would have hidden it because decline rows have no expected command to count against.
- What did not work and why: the summary's `offered` field is scoped to rows with an expected command, so it reads 5 while the run lines carry far more offers; using it as an offer count would have been wrong.
- What I would do differently: read the attach gates before the corpus taxonomy; the gate order explains the row pattern faster than the taxonomy does.

## Recommended Next Focus

Measure the brief's wording cost against what a model must do with it: the head line, the policy word, the companion line and the directive block, using the rendered briefs already captured in the packet rather than a new model run. The open question is whether the wording, not the guard, is what leaves a followed offer unstarted.
