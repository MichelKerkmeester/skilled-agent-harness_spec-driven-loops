# Iteration 2: Every reader gap, ranked by whether a fix would move a published number

## Focus

Question (c). Iteration 1 proved that opencode's delivery unknown comes from a missing branch and that the followed rate is a pre-write access test. This iteration enumerates the remaining places where the measuring instrument, not the runtime, sets the limit: codex's exclusion, devin's and dsh's single unplaceable offer row, and opencode's whole arm. Each is then ranked by whether closing it would change a number the arm prints.

## Actions Taken

1. Read the decision record entry that fixed Codex's exclusion (Q075).
2. Read the runner's Codex gate and the `codexHookApproval` verdict mapping.
3. Read the delivery decision's own documentation of why OpenCode stays unknown.
4. Read the test that pins OpenCode at unknown.
5. Read the offer-field accounting that produces `offerUnknown`.

## Findings

1. Codex has no rows in the 033 arm because the runner refuses the whole arm, not because its reader failed. When the runtime is codex and `codexHookApproval` reports `unapproved`, the runner writes `{ok:false, code:'codex-hooks-unapproved', measurable:false}` and returns the refused exit before any turn runs, with the repair text "open /hooks in a Codex session at <dir> and approve each entry". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1473-1488] The operator's answer to Q075 was to leave Codex out of the arm rather than approve it. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:1486-1499]

2. Approving the Codex hook would not by itself produce a delivery boolean. The reader returns `false` only when the hook is unapproved; otherwise it loads the session and returns `true` when the records or the injected block carry the brief and `unknown` when they do not. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:282-300] So an approved Codex arm whose store does not carry the hook context prints the same `unknown` as OpenCode, and `deliveryUnknown` would not distinguish the two.

3. OpenCode's unknown is a documented design consequence, not an accident: "OpenCode stays `unknown`, because its plugin adds the brief in memory and the store keeps no copy." [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:220-229] That makes a prompt-free receipt necessary but not sufficient: the reader branch must be added too, because the suite currently pins the unknown even for a session whose records do hold the brief. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:259-265]

4. Devin's and DSH's single unplaceable row each is a run-line format gap, not a runtime behaviour gap. `offerFieldAbsent` is true when the line carries no offer field at all [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1991], and a scored owned row with no offer field is counted into `followedByOffer.unknown` rather than into either side of the offer split [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2361-2375]. The scorer's comment is explicit that such a line was "written before that field existed". [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2361-2363]

5. Ranked by whether closing the gap changes a published number, the reader gaps order as OpenCode, Codex, Devin/DSH. OpenCode carries 80 of 80 run lines at `briefDelivered: unknown` (36 off, 44 on) in its own run log [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl] against 0 unknown on claude and pi and 1 on devin and dsh [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt]. Devin and DSH each lose one row to the offer split, which cannot move a rate printed over 28 rows; Codex has 0 rows today, so its fix unlocks a runtime rather than correcting a number. [INFERENCE: from the delivery and offerUnknown counts in summary-arm.json and the per-file unknown tallies above]

## Ruled Out

- Treating Codex as a sixth measured runtime. No row exists, and the gate that stops it is a runner refusal with an operator repair path, not a scoring gap.
- Reading the `offerUnknown: 1` on devin and dsh as a lost offer. The field is absent from the line; it is not a recorded non-offer.

## Dead Ends

- Searching the run logs for opencode rows that carry a delivery answer. All 80 lines read unknown by construction, so no per-row inspection can recover a delivery fact from them.

## Edge Cases

- Ambiguous input: none. Question (c) named all four cases up front.
- Contradictory evidence: none, but one asymmetry is worth recording: codex's `false` is a positive answer while opencode's `unknown` is structural, and both are printed under one `deliveryUnknown` field name.
- Missing dependencies: no Codex session store was read, because no Codex session exists.
- Partial success: the ranking's first item rests on 80 observed rows; the third rests on a single row per runtime, which is stated as such.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/decision-record.md:1486-1499`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/run-command-behaviour.mjs:1465-1499`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:185-229`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-offer.mjs:282-303`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1986-1992`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:2361-2375`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-offer.vitest.ts:232-265`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/runs/opencode.jsonl`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/033-untuned-arm-arena-run/scratch/arm-evidence.txt`

## Assessment

- New information ratio: 0.8
- Questions addressed: (c)
- Questions answered: (c)

## Reflection

- What worked and why: reading the test beside the reader was decisive. A reader branch alone cannot move OpenCode's number while `command-offer.vitest.ts:259` asserts the unknown for a session that does hold the brief, so the fix has a second file and a second proof that a code-only reading would have missed.
- What did not work and why: the first attempt to locate the devin and dsh unplaceable rows by scanning every run line for a missing `offeredCommand` returned 51 to 52 lines per runtime, which is the decline and must-not-start population, not the scored set. The scorer's own condition is the only reliable filter, so the finding rests on the accounting rule rather than a row identity.
- What I would do differently: go to `tallyResult` before scanning logs whenever a count needs attribution. The tally is the definition; the logs only instantiate it.

## Recommended Next Focus

Question (d): what per-runtime surface decides whether an ask offer is representable. Start from `askedAndWaited` and `ASK_POLICY` in the classifier, then the dsh decline start (`fresh-decline-refusal-02`, `/create:sk-skill` against an offered `/deep:review`) and the devin lost rows that acted with no workflow and no offer.
