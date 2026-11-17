# Iteration 5: What a "start" is on each runtime, and why the two start functions disagree

## Focus

The rank from iteration 4 rests on rows and files. Before synthesizing, the arm's other headline number needs the same treatment the followed rate got: the start rate. This iteration asked what evidence makes a run count as started, whether every runtime can produce that evidence, and whether the two functions that judge a start agree with each other.

## Actions Taken

1. Read `startState`, the function behind the printed start rate.
2. Read `startedCommand`, the function behind the decline and skill-only start counts.
3. Read the comment that defines Claude's host-expansion start shape.
4. Traced both values to the fields the summary prints.

## Findings

1. A start row counts as started without any write. `startState` sets `started` from a document read, a model-reported `COMMAND:` start line, or a host expansion, and never consults a write boundary. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493] The start rate therefore answers "did the run open the command's document or say it started", not "did it do the work".

2. The two start functions disagree about a bare document read. For a decline or skill-only row, `startedCommand` accepts a document read only when a write boundary exists; the same read with no write is not a start there. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1424-1441] So one transcript can be a start under the start rate and not a start under the decline count, and both numbers appear in the same runtime block.

3. The start vocabulary is runtime-asymmetric. `hostExpanded` recognises Claude Code's expansion tag, which exists because Claude expands a typed command before the model sees it and keeps only that tag in the stored user turn; the comment records the consequence that it "is not a spoken command: the model never chose it". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1395-1402] Claude is the only one of the six runtimes that can produce this event, so its start count can include a start the model did not choose while the other five cannot.

4. Nothing in the summary prints which shape produced a start, so the mix cannot be recovered after the fact. `byPolicy` carries counts only [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2399-2403], and `commandStartRuns` lists the row, the run and the command but not the shape [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2300-2304]. With 15 judged start rows per runtime per arm, a two-row difference between claude's 2 and 3 could be one read and one expansion in either order.

5. The fix is a measurement field, not a product change: record the shape (read, reported, expanded, skill) on each scored row and print its distribution per runtime. That would make claude's 2 of 15 and 3 of 15, opencode's 1 of 7 and 3 of 10, pi's 3 of 14 and 6 of 15, devin's 2 of 11 and 6 of 12 and dsh's 6 of 15 and 10 of 15 comparable quantities rather than five differently-earned numerators. No command, vector, brief byte or floor input changes. [INFERENCE: from findings 1 to 4 and the start counts in summary-arm.json]

## Ruled Out

- Treating the printed start rate as "the model took the workflow". A document read alone earns it, and on Claude an expansion the model never chose also earns it.
- Comparing runtimes on start rate without naming the shape mix, while the shape vocabulary differs by runtime.

## Dead Ends

- Searching the run logs for a start-shape field. No such field exists in the line schema; only `changedPaths`, `offeredCommand`, `offeredPolicy`, `offeredAs`, `briefDelivered`, `restored` and `exit` are written.

## Edge Cases

- Ambiguous input: none.
- Contradictory evidence: the two start functions are not contradictory, but they are inconsistent measures of the same word; both are recorded here and the inconsistency is named rather than resolved.
- Missing dependencies: no transcript-level shape census was run, because that would require re-reading 400 session files for a number the summary cannot print anyway.
- Partial success: the shape fix is proposed without a measurement of how much of each runtime's start count is a read. That is stated as the confirming step rather than assumed.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1424-1441`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1477-1493`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1395-1402`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2300-2304`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2399-2403`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/summary-arm.json`

## Assessment

- New information ratio: 0.7
- Questions addressed: (e) follow-on, start-credit attribution
- Questions answered: none as tracked; this closes a gap the rank opened

## Reflection

- What worked and why: reading the second start function paid off. The discrepancy between `startState` and `startedCommand` over a bare read is invisible in any printed table and changes what both numbers mean, so one function would have looked consistent while two disagreed.
- What did not work and why: the first attempt to identify the start rows by row id found none, because the rows are keyed by policy rather than by a `fresh-start-*` name. The policy key is the right handle and it is what `isStartRow` uses.
- What I would do differently: read `startState` and `startedCommand` in the same pass from the beginning. Any two functions that print a field called "started" in one block should be read together.

## Recommended Next Focus

Audit the six inherited `limit:` lines in `arm-evidence.txt` against the 033 counts. They came from phase 026 and one of them ("devin on-arm lost rows acted with no workflow and no offer") does not obviously match 033's devin block, where `improvised` is 0 in both arms. A stale limit line is a reading hazard for every downstream synthesis.
