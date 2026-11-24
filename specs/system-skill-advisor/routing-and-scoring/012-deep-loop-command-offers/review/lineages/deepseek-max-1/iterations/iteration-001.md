# Deep Review Iteration 001 - Correctness

## Dispatcher
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iteration: 1 of 5
- Dimension: correctness
- Operator review focus: Traceability of the sixth fix round (REQ-023 to REQ-034, AC-030 to AC-042, ADR-005, ADR-006). This iteration addressed the focus by checking the REQ-031 drift-guard claim against the guard the tree actually builds, and by reading the REQ-023 to REQ-030 predicates that the fix round changed.
- Scope: the 46 files in the pre-bound review scope file.

## Files Reviewed
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:551]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:626]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:738]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:886]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:899]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1254]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1341]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:216]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:248]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:445]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:461]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:6165]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:61]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:226]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **The drift guard's per-entry fixture rule skips two of the five lists REQ-031 names** -- .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206 -- REQ-031 requires that "the count words, run symptoms, artifact-after nouns, past-run read verbs and iterative verbs ... every list entry has a fixture case that uses it." The parity block at `:61` compares eleven TypeScript lists with their Python tuples, so a one-sided edit fails. The per-entry case rule, however, runs only for `LOOP_WORDING`, `LOOP_NAMES`, `LOOP_WANT_LEADS` (`:206`), `COUNT_WORDS`, `ITERATIVE_VERBS` (`:214`) and `LOOP_RUN_SYMPTOMS` (`:221`). `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS`, both named in the REQ, appear only inside `VOCABULARY_PAIRS`; no test asserts that a fixture case exercises each of their entries. AC-038 records the guard as `Met` on that stronger claim.
Finding class: missing-test-coverage
Scope proof: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:226
Affected surface hints: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts (LOOP_ARTIFACT_NOUNS at :809, PAST_RUN_READ_VERBS at :646); .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py (_LOOP_ARTIFACT_NOUN_LIST at :4523, _PAST_RUN_READ_VERB_LIST)
Case: an entry such as `turned up` in LOOP_ARTIFACT_NOUNS, or `recapitulate`-style past-run read verbs, could be added to both copies with no fixture case ever exercising it, and the guard suite still passes because only set equality is checked.

## Traceability Checks

| Protocol | Status | Evidence | Summary |
|---|---|---|---|
| `spec_code` | partial | spec.md:235, deep-loop-offer-cases.vitest.ts:61, deep-loop-offer-cases.vitest.ts:226 | REQ-031's drift-guard half is implemented (eleven compared pairs, six per-entry rules); its "every list entry has a fixture case" half is not implemented for artifact-after nouns and past-run read verbs. Remaining REQ rows are scheduled for iterations 3 and 4. |
| `checklist_evidence` | not run | - | Deferred to iteration 4 so the ticked tasks and Met rows are read as a set. |

## Integration Evidence
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1254` (`attachCommand`): the stuck-run branch answers `/doctor:deep-loop` unless the reader refuses a run or fix, which matches REQ-024.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428` (`attachTypedCommand`): the typed pass runs over the served head and marks the row `typed: true`, the surface REQ-029 names.
- `.skilled/skills/system-skill-advisor/runtime/lib/render.ts:248`: a `typed` row prints the policy word plainly, so `/deep:review (ask)` carries no offer text on the native render path (REQ-028).

## Edge Cases
- REQ-030 names a 96,000-character prompt; the bounded window (`LEAD_WINDOW` 400 in `command-attach.ts:592`, `_LEAD_WINDOW` 400 in `skill_advisor.py:4886`) and the shared 10,000-unit head (`skill_advisor.py:888`, passed at `:6165`) are both present. The Python `_ends_before` uses `pattern.search(text, pos, end)` rather than a slice, so its lookbehind reads real characters before the window while the TypeScript copy adds 16 characters of context to get the same reading. The two copies agree by construction; no drift found.
- `attachCommand` reads `typedCommandsIn(prompt)` for the deep-loop clause, so a second typed command cannot hide the first (REQ-025). `typedCommandIn` still answers with the longest key for its other callers, as the REQ states.

## Confirmed-Clean Surfaces
- Stuck-run refusal vocabulary (`RUN_REFUSED`, `command-attach.ts:738`) covers "please don't run anything" and "I don't want a fix" without swallowing "my deep research run is stuck" alone.
- Refusal leads in `RUN_ASK_NEGATED_SOURCE` (`:580`) withhold the six REQ-023 refusal prompts and keep "skip straight to", "don't hesitate to", "don't forget to".
- `deferredLoopCommand` (`:1341`) blanks a loop name that is the request's subject before reading mode cues, so "run a deep loop to review the research loop config" reads as review.
- `explicit.ts` gates its loop lanes on `asksForLoopRun`/`isStuckRunComplaint` (`:445`, `:461`), so "several passes of the linter failed, review the config" takes no hub lane (REQ-027).

## Ruled Out
- A claimed quadratic-prefix regression in REQ-030: both copies read a bounded 400-character window per match, and the patterns are compiled once per call (TypeScript) or at module load (Python). No whole-prefix scan remains in `hasLoopAsk`, `explicitRunOutranks` or `commandOnlyMentioned`.
- A claimed precedence bug in `typedCommandIn` returning the shorter key: the loop keeps the longer key on a tie at the same index, which is the behaviour REQ-025 preserves for other callers.

## Next Focus
- Dimension: traceability
- Focus area: map REQ-023 to REQ-031 to the implementing lines and to ADR-005/ADR-006, then start the `spec_code` protocol table
- Reason: iteration 1 established that the predicates exist; iteration 2 scores each REQ against its producing line and the decision that records it
- Rotation status: correctness complete, security pending, traceability next, maintainability pending
- Required evidence: one file:line per REQ row and one ADR line per recorded decision

Review verdict: PASS
