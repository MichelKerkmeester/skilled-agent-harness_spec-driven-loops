# Review Iteration 006 — deepseek-max-1

**Dimension:** correctness (D1, follow-up)
**Protocol:** behavior execution + code read
**Focus:** a second correctness pass over the guard interactions the first pass did not exercise — no-edit wording, the typed-doctor path — and a re-verification that the three P1 findings still reproduce.

## Dispatcher

- Run: `fanout-deepseek-max-1-1795518961022-7ms9ak`, generation 1, label `deepseek-max-1`.
- Execution: this process; no nested dispatch ran.
- Config: `maxIterations=7`, `stopPolicy=max-iterations`.
- Steering channel: `steer.md` is absent at iteration 6.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:760-790,1280-1375,1400-1500`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4940-5000,5441-5470`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:138-156`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:236-250`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:250-300`

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **A no-edit clause withholds a read-only deep-loop offer** -- `command-attach.ts:1424` -- `attachCommand` returns `undefined` for any prompt `isNoEditRequest` matches, on both the routed (`:1424`) and deferred (`:1472`) paths. That guard is shared by every writing command, but a deep review and a deep research do not edit the tree, so "don't change anything" cannot make either offer unsafe. Measured: "run a deep review of the parser but don't change anything", "do a deep review of the parser, don't edit any files" and "run a deep review on the parser and don't touch anything" all return the hub with no command, while "review the parser in several passes, no code changes" and "run a deep research on caches without editing code" keep theirs — the same intent, opposite outcomes, decided by which phrase the pattern happens to list.
   Case: an operator writes "run a deep review of the parser but don't change anything", the natural way to ask for a read-only audit, and receives no `/deep:review` offer at all.
   Finding class: `correctness` (false negative on a read-only workflow; no wrong command is offered).
   Scope proof: `command-attach.ts` is a `reviewScopeFiles` entry; the five prompts were measured through the built `dist` gate, and the two guard call sites were read at `:1424` and `:1472`. `NO_EDIT_REQUEST` is at `:767`.
   Affected surface hints: `command-attach.ts:1424`, `command-attach.ts:1472`, `command-attach.ts:767` (`NO_EDIT_REQUEST`), `command-attach.ts:775-790` (the separate run-refusal list whose comment explains the distinction).

   ```json
   {
     "type": "correctness",
     "claim": "isNoEditRequest is applied to deep-loop commands even though neither deep workflow edits files, so a read-only constraint withholds the offer.",
     "evidenceRefs": [
       "advisor_recommend('run a deep review of the parser but don't change anything') -> hub, no command",
       "advisor_recommend('review the parser in several passes, no code changes') -> /deep:review ask",
       "command-attach.ts:1424",
       "command-attach.ts:1472",
       "command-attach.ts:767"
     ],
     "counterevidenceSought": "Checked whether the no-edit guard is deliberate for deep commands: the adjacent comment says it gates every writing command and keeps the run-refusal list separate because that says nothing about whether a file may change. A deep review writes no file, so the stated reason does not reach it. Also checked that the inverse phrasings keep the command, confirming the outcome is phrase-dependent rather than a general refusal rule.",
     "alternativeExplanation": "The team may read any no-edit wording as 'do not start a multi-pass process', not only 'do not write'. That reading would make the withholding intentional but would leave the two keeping phrasings inconsistent.",
     "finalSeverity": "P1",
     "confidence": 0.86,
     "downgradeTrigger": "Downgrade to P2 if the team records that no-edit wording is a blanket stop signal and accepts the identical-intent inconsistency."
   }
   ```

### P2 Findings

2. **A typed `/doctor:deep-loop` after a comma is read as a mention, not a request** -- `command-attach.ts:1325` -- Refines `ITER4-P2-001`. `commandOnlyMentioned` treats a `run`-policy command as requested only when it opens a sentence or follows a use verb (`requestedOpeningSentence` / `requestedByUseVerb`, `:1301-1303`). "the deep research run is stuck, /doctor:deep-loop" has neither, so it withholds, while "my research run is stuck; /doctor:deep-loop please" keeps (the semicolon opens a sentence) and "the loop stalled. /doctor:deep-loop now" keeps (the period does). The shared fixture header's claim that "a bare naming on a stuck run keeps it" is broader than the code.
   Case: the same diagnosis request is offered or withheld by punctuation: a comma withholds, a semicolon or period keeps.
   Finding class: `typed-request-withheld` (refinement of `ITER4-P2-001`; documentation and behavior disagree at the margin).
   Scope proof: measured through the built gate and by calling `commandOnlyMentioned` directly; the two pattern anchors were read at `:1301-1303`.
   Affected surface hints: `command-attach.ts:1325`, `command-attach.ts:1301-1303`, fixture header at `deep-loop-offer-cases.json:2`, rows `:138-156`.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | partial (carried) | Iterations 1 and 3 findings re-verified this iteration. |
| `checklist_evidence` | pass (carried) | Iteration 2 result stands. |

What this iteration actually ran:

1. **Re-verification of the three active P1s.** "run a deep loop to review the research loop config" still returns `/deep:research (ask)`; "run two deep loops on the cache layer" still returns the hub with no command; "run deep reviews on the parser, but skip the deep research" still returns `/deep:research (ask)`. The three P1s reproduce.
2. **14 no-edit and constraint prompts.** The three "don't change anything / don't edit / don't touch" prompts withhold; the two equivalent "no code changes / without editing code" prompts keep; the typed doctor variants split by punctuation as finding 2 records.
3. **Typed-layer battery.** `/doctor:deep-loop` alone, "please run /doctor:deep-loop on this packet", "the loop stalled. /doctor:deep-loop now" and "my research run is stuck; /doctor:deep-loop please" all keep the doctor; "the deep research run is stuck, /doctor:deep-loop" withholds.
4. **Typed command battery.** `/deep:review:confirm`, `/deep:review:auto`, `/deep:research:auto`, "run /deep:review on the parser, then /create:changelog", "/deep:review the parser and then /doctor:deep-loop" and "/speckit:save and /deep:review the parser" all keep `/deep:*` with `typed: true`, matching REQ-025 and REQ-029.

## Integration Evidence

- Native gate: built `dist/runtime/lib/command-attach.js`, executed for all measurements.
- Python gate: read only; the no-edit guard and the typed-doctor path are native, and the Python copy has no mode-cue or command-naming layer.
- Shared fixture: header claim at `:2`, doctor rows at `:138-156`.
- Guard tests: `command-attach-guards.vitest.ts:236-250` covers `commandOnlyMentioned` for the doctor command.

## Edge Cases

- **No-edit wording is ambiguous by nature.** The finding rests on the intent "read-only audit", which is what a deep review is; a reader who means "start nothing" is also expressible, but the guard cannot tell the two apart and the packet has no requirement pinning the choice.
- **The typed-doctor refinement changes no severity.** It narrows `ITER4-P2-001` to its root cause and corrects the fixture header's claim.

## Confirmed-Clean Surfaces

- The three active P1s reproduce; none is stale.
- Typed commands keep their command in every combination tested, including two typed commands where one is not a deep command.
- The run-refusal list stays separate from the no-edit list, and the doctor refuses on the eight run-refusal prompts the fixture lists.

## Ruled Out

- **A typed command loses to another typed command.** Ruled out: every dual-typed prompt keeps the expected deep command with `typed: true`.
- **The doctor is withheld on every stuck complaint.** Ruled out: four of six variants keep it.
- **The no-edit guard withholds every deep offer.** Ruled out: "review the parser in several passes, no code changes" keeps `/deep:review`.

## Next Focus

- **Dimension:** traceability (overlay verification)
- **Focus area:** the overlay protocols `skill_agent` and `agent_cross_runtime` over the deep-loop skill and its agent mirrors, plus a final consistency check that every active finding still points at the line it named.
- **Reason:** the run has covered the four canonical dimensions; the last iteration is best spent on the cross-runtime traceability the packet itself changed, and on verifying the accumulated record before synthesis.
- **Rotation status:** correctness complete; overlay verification last.
- **Required evidence:** the deep-loop `SKILL.md`, `deep-review`/`deep-research` packets, agent mirrors and the command documents at `file:line`.

## Assessment

Dimensions addressed: correctness

The second correctness pass found one more real defect: the no-edit guard is shared with writing commands and withholds a read-only deep-loop offer on a common phrasing. The typed-doctor P2 is refined to its punctuation-dependent root cause. The three earlier P1s all still reproduce, so the verdict stays CONDITIONAL with no P0.

Review verdict: CONDITIONAL
