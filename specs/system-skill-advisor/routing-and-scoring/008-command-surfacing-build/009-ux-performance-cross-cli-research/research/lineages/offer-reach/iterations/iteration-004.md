# Iteration 4: Verification, expected gain and ranking

## Focus

Verify every proposed phrase and mechanism against the none rows and the hub canary, compute the expected exact-offer gain per recommendation over the 16-row chat set, check the three floors, and rank the set by expected gain in useful starts per unit of risk.

## Actions Taken

1. Extracted the 31 none prompts and grepped all 17 proposed phrases against them with `grep -Fic` (one count per phrase).
2. Read the sk-doc compiled-policy canary (`009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json`): 22 cases, including `one-turn-clarify` and `zero-signal-defer`.
3. Read `_routes.yaml` for the default target and mutating class of the three matched doctor commands.
4. Recomputed the chat-set offer count from the after-arm log and mapped each of the 11 missing rows onto a named mechanism.
5. Read the floor metrics in the committed capture and the scorer-eval baseline command.

## Findings

1. Every one of the 17 proposed phrases returns 0 matches across the 31 none prompts: "agent definition", "specialist persona file", "prompt shortcut", "argument-hint", "intent file", "test script package", "walk through by hand", "before and after my rewrite", "hub skill", "audit this codebase", "findings stop changing", "find out everything", "several models", "final verdict", "debate the tradeoffs", "stopped converging", "repair path". So the pinned false-offer set cannot move by construction; the residual risk is an unseen paraphrase, which the next capture measures. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl] [INFERENCE: measured grep counts over the extracted none prompts]

2. An sk-doc vocabulary change is a two-artifact change: the hub source (`hub-router.json`) and the compiled policy snapshot the runtime engine loads, and the 22-case canary already pins `one-turn-clarify` and `zero-signal-defer`, so the change must keep both and add paraphrase cases per widened mode. The doctor and deep changes are one-file changes by comparison. [SOURCE: .skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json] [SOURCE: .skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs:36]

3. The matched doctor command needs its default invocation, not the bare base command: `_routes.yaml` marks `/doctor:agents-md` target `check` as `default_target: true` and read-only, `/doctor:ci` target `report` read-only, and `/doctor:deep-loop` add-only with policy `run`. Carrying the resolved default invocation on `DoctorProblemMatch` lets the caller read the policy from the generated tables and offer exactly the command the corpus expects. [SOURCE: .skilled/commands/doctor/_routes.yaml:512] [SOURCE: .skilled/commands/doctor/_routes.yaml:87]

4. Expected exact offers over the 16 chat rows, from today's 3 exact plus 2 helper: deep hub aliases +3 (ai-council, research, review), sk-doc aliases +3 (agent-01, agent-02, diff), explicit anchors +3 (command, goal, manual), doctor cluster +2 new (deep-loop, helper) and 2 conversions (agents-md, ci). That is 14 exact plus 2 converted, so the set covers all 11 currently missing rows on paper; each row must be proven by the capture, and a row that does not move is a finding rather than a silent omission. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl] [INFERENCE: row-by-row mechanism mapping from iterations 1-3]

5. Floor exposure is asymmetric. False offers are protected by the measured phrase absence (finding 1). Typed recall is exposed only through `PHRASE_BOOSTS`, which can reorder a typed row's owner against its command row, so the typed capture must be re-pinned. The scorer eval `[159,50,20,5]` is exposed by any phrase boost because full-corpus top-1 can move in either direction; the calibration override exists for a dry run before the constants are committed. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts:254] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs]

6. Ranking by expected new exact offers plus half a conversion, divided by a risk weight (1 low, 1.5 low-medium, 2 medium): deep hub aliases 3.0, doctor cluster 3.0, sk-doc aliases 2.0, explicit anchors 1.5, metadata re-embed unknown and last. The deep and doctor items lead because both are small, measured at the gate, and pinned by an existing canary or matcher; the sk-doc item is larger but data-only; the explicit anchors are the only scoring change and carry the phase 003 collision precedent. [INFERENCE: ranking formula applied to finding 4 and the risk notes in findings 1-5]

## Ruled Out

- Shipping a phrase that was not grepped against the none set: the measurement is cheap and the floor is pinned at 0 of 35.
- Editing the compiled policy snapshot by hand: the deriver/compiler owns it; only `hub-router.json` is authored.
- Folding the metadata re-embed into the same phase: it needs a capture this lineage cannot run and would hide the smaller items' measured gains.

## Dead Ends

- A single "one rule" for all 11 rows: the causes split across three layers (hub vocabulary, doctor cue/matcher, scorer anchors), and each layer has its own verification surface.

## Edge Cases

- Ambiguous input: "expected gain" counts chat-set rows, not all 45 tune rows; the wider tune gain is a bonus and is not claimed here.
- Contradictory evidence: none; the measured phrase absence and the inferred row gain are different kinds of claim and are labelled as such.
- Missing dependencies: the capture cannot run against the stale dist in this lineage, so the expected gains are not yet measured.
- Partial success: verification is complete for the none-row collision question and incomplete for the row-gain question.

## Sources Consulted

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`
- `.skilled/bin/lib/compiled-routing/009-parent-hub-rollout/007-sk-doc/fixtures/canary-cases.v1.json`
- `.skilled/bin/lib/compiled-routing/014-runtime-engine/lib/compiled-route.cjs`
- `.skilled/commands/doctor/_routes.yaml`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/capture-command-routing-baseline.mjs`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl`

## Assessment

- New information ratio: 0.70
- Questions addressed: KQ5 and the remaining KQ1 gain question
- Questions answered: KQ5 (floor exposure is asymmetric; false offers are protected, typed and scorer need a re-pin)

## Reflection

- What worked and why: the grep over the none prompts converted a judgment call into a count, and the canary read exposed the true cost of an sk-doc change (two artifacts, not one).
- What did not work and why: the expected row gains remain inference because the dist is stale; the only honest claim is "each row has a named mechanism", not "each row will move".
- What I would do differently: read the doctor route defaults before proposing the matched-command rule, because the base command is not itself a policy row.

## Questions Answered

- KQ5: false offers are protected by measured phrase absence; typed recall and the scorer eval need a re-pin because phrase boosts can reorder rows.

## Questions Remaining

- Do the five recommendations move their named rows in a real capture, and does any unseen paraphrase reach a none row?
- Which item does the operator want first if only one phase is funded: the data-only hub pair or the code-level doctor pair?

## Recommended Next Focus

Synthesis: write the ranked recommendation list with file, gain, verify command and floor risk, and record the convergence report. No further research iteration is warranted; the remaining questions are measurement questions for the implementing phase.
