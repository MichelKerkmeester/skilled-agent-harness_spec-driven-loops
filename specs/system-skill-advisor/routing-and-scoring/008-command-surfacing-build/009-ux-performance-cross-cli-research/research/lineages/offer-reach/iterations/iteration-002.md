# Iteration 2: Placement versus evidence, and what the semantic lane actually buys

## Focus

Decompose the rows whose top skill is not the command's owner (`create-command`, `create-goal`, `create-manual-testing-playbook`, `deep-review`, `doctor-deep-loop`) into score placement versus evidence absence, and measure what the semantic lane contributes to the plain tune split and to the 16-row chat set. Deferred alternatives from iteration 1: whether a threshold change could substitute for per-row evidence (it cannot, see finding 3).

## Actions Taken

1. Compared the committed stand-in capture (`command-routing-baseline.json`) with the real-embedder capture (`008-embedder-setup-and-cost/scratch/real-embedding-after.json`) row by row over the 45 plain tune rows.
2. Read the explicit lane's `PHRASE_BOOSTS`, `TOKEN_BOOSTS`, the fusion calibration rules (`createAgent`, `createTestingPlaybook`, `speckitResume`, `reviewLoop`) and the command meaning gate (`COMMAND_MEANING_MIN_COSINE`, `COMMAND_MEANING_MARGIN`, `commandMeaningEligible`).
3. Read the semantic lane's weight, cosine cutoff, deadline and embedded text source (`skill.name`, `description`, `domains`, `intentSignals`, `derivedTriggers` from the skill-graph DB).
4. Read phase 003's implementation summary for the previously attempted alias changes and their measured outcome.
5. Re-read the 31 none rows for the phrases proposed in this iteration.

## Findings

1. The real embedder lifts plain tune recall from 9 of 45 to 14 of 45, but the five gained rows are `cmd-doctor-env`, `cmd-doctor-git`, `cmd-doctor-symlink`, `cmd-speckit-handoff` and `cmd-speckit-plan` — none of them in the 16-row chat set. The chat set's five delivered offers are all attached (hub route or doctor handoff), and its own-row recall is 0. So the semantic lane's measured gain is orthogonal to the chat bottleneck: a weight or threshold change to that lane cannot explain or fix the 3-of-16. [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json] [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json] [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/007-per-runtime-behaviour-proof/scratch/runs-post-final.jsonl]

2. A command may pass on meaning only when its real cosine clears 0.72 and leads the strongest other command by 0.02, and the semantic lane's weight is 0.05; the anchor then lifts the row to the confidence threshold. The embedded text per skill is the projection's name, description, domains, intent signals and derived triggers loaded from the skill-graph DB, so improving meaning for a command means enriching that row's metadata and re-embedding — there are no per-command paraphrase exemplars today. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:846] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:921] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:322] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:376]

3. Four of the five wrong-top rows are evidence absence, not placement: `create-command` has no `/create:command` phrase and the `prompt` token lifts sk-prompt; `create-goal` has no "intent file" evidence and system-spec-kit wins; `create-manual-testing-playbook`'s boost keys require the literal "manual testing playbook" or "create a test playbook" and the row says "test script package"; `deep-review`'s wording has `audit` lifting sk-code and no deep-loop phrase at all. Only `create-agent-01` is placement-like (its aliases fired, `/create:agent` sits in the top-3, but the hub answers `clarify`), and `doctor-deep-loop` is a hub gap rather than a score margin. A lower threshold therefore converts none of them. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:28] [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:827] [INFERENCE: baseline top values crossed with the prompt text and the boost keys, tune rows only]

4. Generic alias widening is a proven dead end on this corpus. Phase 003 added "persona file" to the sk-doc agent aliases and removed it again because it attached `/create:agent` to "update the customer persona file for the marketing site"; tune combined reach fell from 10 to 9 of 45. Any new alias has to be narrower than the generic noun phrase — "specialist persona file" or "agent definition", not "persona file". [SOURCE: specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/implementation-summary.md:140]

5. The cheapest evidence fix that does not depend on the embedder is a multi-word explicit anchor per row: "agent definition" and "specialist persona file" for `/create:agent`, "prompt shortcut" and "argument-hint" for `/create:command`, "intent file" for `/create:goal`, "test script package" and "walk through by hand" for `/create:manual-testing-playbook`, "many passes" and "findings stop changing" for `/deep:review`. Each phrase is absent from all 31 none rows, and each is literal, so the change is measurable with the stand-in capture. [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl] [INFERENCE: phrase absence checked against the 31 readable none rows]

6. The only lever that generalizes past literal phrasing is metadata enrichment plus re-embedding: add paraphrase exemplars to the command rows' intent signals in `command-metadata.json` and rebuild the skill-graph vectors, then measure with `--real-embedding`. It is also the only lever this lineage cannot verify, because running the embedder is out of scope; it belongs to the phase that owns the next capture. [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts:349]

## Ruled Out

- Lowering `COMMAND_MEANING_MIN_COSINE` below 0.72: it cannot reach a row with no cosine evidence, and the 5 real-embedder gains are outside the chat set.
- Raising the semantic lane weight: the lane is live at 0.05 and its gains are already counted; a weight change would reorder rows the floor depends on without adding evidence.
- Re-adding "persona file": measured regression in phase 003 (finding 4).
- Treating `doctor-deep-loop` as a scoring miss: the deep hub declares no doctor mode, so there is no command candidate to rank.

## Dead Ends

- Threshold tuning as a substitute for evidence: four of five rows are below top-3, so no threshold reaches them.
- A second meaning lane with a lower cosine bar: it would spend false-offer risk on the doctor and speckit rows that already pass, not on the chat rows.

## Edge Cases

- Ambiguous input: "evidence absence" is scored as "the command row is absent from top-3 and no phrase or command-literal anchor exists"; "placement" is "the row is in top-3 but not top-1".
- Contradictory evidence: the prompt brief cites plain recall 14 of 45 with the real embedder while the committed stand-in capture reads 9 of 45; both are correct for their regime, and the difference is exactly the five rows named in finding 1.
- Missing dependencies: the advisor dist is stale, so no live capture could be rerun; all row facts come from committed captures.
- Partial success: the static decomposition is complete; the proposed anchors are reasoned against the none rows but not measured.

## Sources Consulted

- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/real-embedding-after.json`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/008-embedder-setup-and-cost/scratch/verification-evidence.txt`
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/003-plain-chat-command-reach/implementation-summary.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/scoring-constants.ts`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/semantic-shadow.ts`

## Assessment

- New information ratio: 0.85
- Questions addressed: KQ2, KQ3
- Questions answered: KQ2 (4 of 5 are evidence absence), KQ3 (the semantic lane adds 5 rows, all outside the chat set)

## Reflection

- What worked and why: diffing the two captures row by row turned a headline "9 to 14" into a per-row fact, which is what showed the gain is orthogonal to the chat set; reading phase 003's summary recovered a measured alias regression that would otherwise have been re-proposed.
- What did not work and why: the stand-in capture cannot expose cosine values, so the exact distance from 0.72 for each chat row stays unknown without a re-embed.
- What I would do differently: start from the per-row diff rather than the headline metrics, because aggregate recall hides which prompts move.

## Questions Answered

- KQ2: four of the five wrong-top rows are evidence absence; only create-agent-01 is placement-like and doctor-deep-loop is a hub gap.
- KQ3: the semantic lane contributes five tune rows (doctor env/git/symlink, speckit handoff/plan), none in the chat set, so its present configuration does not move the 3-of-16.

## Questions Remaining

- Which of the proposed explicit anchors can be added without moving any none row, and what is each anchor's measured tune gain in the stand-in capture?
- Can the doctor family gain a deep-loop diagnostic route without breaking the deep hub's defer contract?

## Recommended Next Focus

Iteration 3: the doctor family and the deep-family defer — enumerate every doctor chat row's path, test whether a doctor handoff for deep-loop diagnostics and a `ask`-only defer offer close the three remaining deep/doctor misses, and check each against the none rows.
