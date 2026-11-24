# Iteration 1 - Correctness

## Dispatcher

Dimension: correctness. Operator focus: begin `spec_code` and `checklist_evidence`, and check every REQ against the code or decision that records it. This iteration reads the shared deep-loop offer gate in both copies, because it is the surface the packet exists to change and the one the thirteenth round (T115 to T118) last touched. `spec_code` is opened here (REQ-016 and REQ-011 checked) and stays `partial` until the full REQ sweep in iteration 4.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1213` (`asksForLoopRun`), `:1236` (`LOOP_QUESTION_AUXILIARIES`), `:1256` (`LOOP_QUESTION`), `:1266` (`LOOP_HOW_TO_QUESTION`), `:1275` (`ITERATION_COUNT`), `:1281` (`LOOP_RUN_BY_PRONOUN`), `:1295` (`isLoopQuestion`), `:1690` (`servedMode`), `:1747` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5030` (`_LOOP_QUESTION_AUXILIARY_LIST`), `:5050` (`_LOOP_QUESTION_RE`), `:5338` (`_is_loop_question`), `:5807` (`asked_mode`), `:5848` (mode-equal row gate)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (question and refusal rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1176` (deferred-route mode cases)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (`passesAsked`)

## Findings

### P0 Findings

(none)

### P1 Findings

1. **A plain question about the loop still serves `/deep:review` when its auxiliary or its "how long" shape is outside the question grammar** -- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1236` -- `LOOP_QUESTION_AUXILIARIES` carries seventeen auxiliaries and `LOOP_QUESTION` (`:1256`) admits only `how|why|when|what <aux> <loop subject>`, `how many ... <aux> <loop subject>` and `explain|describe how ... <loop subject>`. A question phrased with an auxiliary outside the list, or with a word between `how` and the auxiliary, matches no alternative, so `isLoopQuestion` (`:1295`) answers false and the broad `LOOP_WORDING` branch ("deep review" or "deep research", `:348`, read by `LOOP_REQUEST` at `:1030`) opens the gate. The Python copy reads the same grammar (`:5030`, `:5050`, `:5338`) and answers the same way. Verified by direct call on both copies: `asksForLoopRun("how long does a deep review take?")`, `"how long will a deep review take?"`, `"how will the deep review decide to stop?"` and `"how has the deep review been going?"` all return true, `attachCommand` on a routed single review route returns `/deep:review` for each, and the Python gate keeps `command-spec-kit-deep-review` for each. `spec.md` REQ-016 states that a question about the loop carries no command; its two fixture rows cover only the `how many` shape (`question-how-many-iterations`, `question-how-many-passes`).
   Finding class: class-of-bug (the question reading is a closed vocabulary and a closed grammar shape).
   Scope proof: the gate is inside the declared review target, in `review-scope-files.txt`, and the finding cites the two copies and the executed calls that produce the false offer.
   Affected surface hints: `command-attach.ts` `LOOP_QUESTION_AUXILIARIES` and `LOOP_QUESTION`; `skill_advisor.py` `_LOOP_QUESTION_AUXILIARY_LIST` and `_LOOP_QUESTION_RE`; the shared fixture and both suites; `.skilled/skills/system-skill-advisor/runtime/lib/README.md` and `feature-catalog/cli-surface/advisor-recommend.md` both state that a question about the loop gets no run.
   Case: "how long does a deep review take?" typed as a request for information -- the served head carries `system-deep-loop → /deep:review (ask: A /deep:review:auto (Recommended), B /deep:review:confirm, C no loop)`.

   ```json
   {
     "type": "claim",
     "claim": "A question about the loop whose auxiliary or shape is outside the question grammar opens the deep-loop command gate in both copies.",
     "evidenceRefs": [
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1236",
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1256",
       ".skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1295",
       ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5030",
       ".skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5338",
       ".skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:98"
     ],
     "counterevidenceSought": "Checked whether the broad 'names deep research or deep review' ask in spec.md section 2 makes any such prompt an ask by definition, and whether the policy word limits the damage. The broad rule does cover the prompt literally; the policy is ask, so nothing runs without a yes. Checked the corpus and fixture for a question row outside the how-many shape: none exists, which is why the suites never see it.",
     "alternativeExplanation": "The auxiliary list is deliberately finite and the two examples in REQ-016 are the whole check; a how-long question is an accepted false offer whose cost is one declined question.",
     "finalSeverity": "P1",
     "confidence": 0.82,
     "downgradeTrigger": "If REQ-016's two examples are read as the exhaustive check rather than as instances of its general sentence, this becomes P2 hardening."
   }

### P2 Findings

(none)

## Traceability Checks

- `spec_code` (core): `partial`. REQ-016 checked and contradicted by R1-P1-001 (question grammar); REQ-011 checked clean -- both hub files carry `iterative research` and `multi-round research`, neither carries `autonomous research` (`hub-router.json:34`, `ROUTER.md:63`), and the hub `SKILL.md:20` names `/doctor:deep-loop`. The remaining 57 REQs are scheduled for iteration 4.
- `checklist_evidence` (core): not run this iteration; iteration 5 owns it.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts` is the hub's command-attach layer, called from `handlers/advisor-recommend.ts:363` (`enrichCompiledRoutes`); the served head reads it through the compiled-route subprocess at `handlers/advisor-recommend.ts:334`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py` is the fallback server's gate, read through `lib/subprocess.ts:383` (`runAdvisorSubprocess`).
- The shared fixture is read by both suites: `tests/deep-loop-offer-cases.vitest.ts:257` and `tests/python/test_skill_advisor.py` `test_deep_loop_offer_gate_parity`.

## Edge Cases

- The auxiliary list is exported and compared by the drift guard, so adding an auxiliary is a two-copy edit plus a fixture pair; the gap is in the grammar shape (`how long`, `how <aux>` with an adverb), not only the vocabulary.
- A misspelt or paraphrased question ("what's the runtime of a deep review?") carries no loop wording at all and is unaffected.
- `NO_EDIT_REQUEST`, refusal and past-run readings are all short-circuited by `asksForLoopRun`'s own order; this finding is only about the question branch.

## Confirmed-Clean Surfaces

- `asksForLoopRun`'s refusal, past-run, writing-about and stuck-run readings were exercised on the 368-case fixture and on 72 hand-built prompts through both copies: 0 divergences between TypeScript and Python.
- The thirteenth-round clause rule (`questionClause`, `:1285`) and the whole-word `then` rule (`explicitRunOutranks`, `:847`) behave as T115 and T116 claim on every probe tried, including `"read the deep review report then run a deep review on the parser"` (asks) and `"summarize the deep review report and run notes"` (withheld).
- The zero-width fold (`lowerFolded`, `:917`) reads U+200B, U+200C, U+200D, U+2060 and U+FEFF as whitespace in both copies, and collapses runs of ordinary whitespace, as REQ-049 and REQ-056 state.
- The stage-one `passesAsked` rule (`explicit.ts:454`) requires `asksForLoopRun` or `isStuckRunComplaint`, so it cannot hand the hub a lane the gate withholds.

## Ruled Out

- "The bare loop name `deep loop` opens the gate": ruled out. `LOOP_REQUEST` reads `deep loop` only behind a use, continue or want verb, which is ADR-006's rule; `"deep loop: audit the payments flow"` returns false in both copies.
- "A statement about the loop always opens the gate": not a defect by itself. `spec.md` section 2 defines naming `deep research` or `deep review` as an explicit loop ask; only the question carve-out in REQ-016 changes that, which is where R1-P1-001 sits.
- "The `how many` carve-out is broken": ruled out. `"how many iterations does deep research run by default?"` and `"how many passes does the deep review do"` are withheld by both copies.

## Next Focus

Dimension: security
Focus area: the prompt-to-brief trust boundary -- `lib/render.ts`, `lib/skill-advisor-brief.ts`, `lib/subprocess.ts`, `skill-advisor-cli.ts` and the child-session downgrade.
Reason: the gate feeds a model-visible brief, so the next risk is what a prompt or a child process can inject into it.
Required evidence: a read of the render path and the subprocess argv/stdin handling; file:line for every claim.

Review verdict: CONDITIONAL
