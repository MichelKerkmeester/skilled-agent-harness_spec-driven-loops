# Iteration 3: The ask path's two accepted shapes and which runtimes can produce them

## Focus

Question (d). The 033 arm produced exactly one decline-row violation on dsh, where an ask-policy head offered `/deep:review` and the session started `/create:sk-skill`. This iteration asked what the scorer accepts as an ask, which runtimes can produce that shape at all, and whether dsh's violation is a representation loss or an outcome difference.

## Actions Taken

1. Read `askedAndWaited`, the only function that can classify a run as `asked`.
2. Pulled the three run lines for `fresh-decline-refusal-02` on dsh, devin and opencode.
3. Decompressed the dsh on-arm session and counted the model's own `COMMAND:` lines and command-token mentions.
4. Read the per-runtime `offerSeen`, `offerDeclined` and `byPolicy.ask` counts from the arm summary.

## Findings

1. The ask path accepts exactly two representations, and both are transcript shapes rather than policy facts. A run counts as `asked` only when a `COMMAND:` line reports the offer state `offered`, or when the last assistant text contains a `?` and a token naming the expected command. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1283-1296] A session that asked in prose without a question mark, or whose final text was not stored, classifies as `none` even when it did offer and wait.

2. Across five runtimes and two arms the ask classification fired once. Each runtime carries five ask-policy rows per arm, and `workflow.asked` reads claude off 1 and on 0, opencode 0 and 0, pi 0 and 0, devin 0 and 0, dsh 0 and 0. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] So the arm has almost no evidence about the ask path in either direction, and the followed rate's `asked` term contributes one run out of 280.

3. The dsh decline start is an outcome difference, not a representation loss. On `fresh-decline-refusal-02` the head offered `/deep:review` with policy `ask`, the run line records `briefDelivered: true` on both on-arm runs and `changedPaths: []` on both, and the scorer records the row's started command as `/create:sk-skill`. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl] The same session's own text carries twelve `COMMAND: [/deep:review] → declined` lines, so the offer arrived and was refused before a different command was started. [SOURCE: /Users/michelkerkmeester/.dsh/sessions/--private-var-folders-3c-zfqcqsts0kn19cgblj82gqhm0000gn-T-skilled-behaviour-arenas-run033-dsh--/session-6fe5690b-7654-448a-aa28-2ad0d58a3ddb/session.v4.jsonl.zstd]

4. The model's own offer line is the only offer signal that moves with the brief, and it moves on two runtimes only. `offerSeen` off to on reads dsh 2 to 7, opencode 0 to 2, claude 0 to 0, pi 1 to 1 and devin 3 to 3. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] Because `offerSeen` is read from the model's `COMMAND:` line rather than from the brief, it survives opencode's missing delivery reader — which is why opencode shows 0 to 2 there while its delivery column shows 80 unknowns.

5. Devin is the only runtime where the refusal path is observable at all: `offerDeclined` reads 1 in both arms, with every other runtime at 0. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json] The one `asked` classification in the arm belongs to claude off, so the two halves of the ask path — asking and declining — were each observed on a different runtime and never together.

## Ruled Out

- Attributing dsh's decline-row start to a delivery or representation failure. The run line records the brief as delivered and the session records the offer as declined, so the mechanism is present and the outcome still violates the row.
- Reading the near-zero `asked` count as evidence that models do not ask. The classifier only accepts two transcript shapes, so the count measures representability at least as much as behaviour.

## Dead Ends

- Counting ask-policy rows that ended in prose questions without a `?`. The classifier requires the mark, so no such run can be recovered after the fact.

## Edge Cases

- Ambiguous input: the lane boundary. Decline and refusal safety is the `ux-5` lane's subject; this iteration reads only what the cross-CLI reader can represent, and states the policy outcome without ranking it.
- Contradictory evidence: none, but the arm's `declineStarts` and its `offerSeen` counts describe different things — one is a start on a forbidden row, the other is a model-reported offer on any row.
- Missing dependencies: the dsh session is stored zstd-compressed and the scorer reads it through a loader; the count was taken by decompressing the same file the loader reads.
- Partial success: 12 declined lines were counted in one session; that is one row, not a runtime-wide rate.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1283-1296`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/dsh.jsonl`
- `/Users/michelkerkmeester/.dsh/sessions/--private-var-folders-3c-zfqcqsts0kn19cgblj82gqhm0000gn-T-skilled-behaviour-arenas-run033-dsh--/session-6fe5690b-7654-448a-aa28-2ad0d58a3ddb/session.v4.jsonl.zstd`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/devin.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl`

## Assessment

- New information ratio: 0.7
- Questions addressed: (d)
- Questions answered: (d)

## Reflection

- What worked and why: reading the classifier first turned "almost no ask evidence" into a statement about accepted transcript shapes rather than a statement about model behaviour. Then decompressing the one dsh session settled the mechanism: the offer was declined twelve times and a different command started anyway, which separates representation from outcome in one file.
- What did not work and why: the first plan was to count ask-policy rows and their outcomes as a rate. With one `asked` classification in 280 runs the rate would be a fiction, so the finding reports the counts instead.
- What I would do differently: pull the model's own `COMMAND:` lines for every runtime before reading the offer columns. Those lines are the only channel that exists on all six runtimes, and starting from them would have shown the dsh and opencode movement sooner.

## Recommended Next Focus

Question (e): rank the remaining cross-CLI gaps by commands started when useful per unit of floor risk. The candidates now have numbers — opencode's 80 unknown delivery rows, its 8 capped start rows off and 5 on, claude's 6 of 28 followed against 2 of 20 step outputs, and the ask path's one observed run. Each ranking needs the file it changes and the check that would confirm it.
