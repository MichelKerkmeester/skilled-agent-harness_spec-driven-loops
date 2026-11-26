# Review Iteration 002

## Dispatcher

- Mode: review; target agent `deep-review`; lineage `deepseek-max-1`; generation 7; session `fanout-deepseek-max-1-1795546920757-7pyjry`.
- Iteration 2 of 7 (stopPolicy `max-iterations`).
- Dimension: `traceability`. Protocol in progress: `spec_code`, part 2 (REQ-015 to REQ-048), with the sixth fix round's REQ-023 to REQ-034 and ADR-005/ADR-006 as the operator focus names them.
- Operator review focus, addressed here: the requirement sweep now covers every row of `spec.md`, including the sixth-round block and the two decision records it rests on (ADR-005 typed-on-stuck, ADR-006 bare loop name). Each REQ row was resolved to a symbol, a test title, a fixture row or a decision record; the run-level suite claims each row quotes are recorded as this lineage's limitation because a leaf cannot execute repo tooling.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:255` (REQ-015) to `spec.md:380` (REQ-048), `spec.md:382` (Reopened sections).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005), `:508` (ADR-006), `:33` to `:702` (ADR-001 to ADR-008 headings).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688` (`RUN_ASK_REFUSAL_LEADS`), `:897` (`RUN_REFUSED`), `:274` (`typedCommandsIn`), `:1455` (`namesLoopSubject` lead window), `:1718` (`NAMED_LOOP_MODE`), `:1537` (`attachCommand`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:454` (`passesAsked`), `:457`, `:464` (`loops?`).
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (doctor withhold), `.skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:216` (command, policy, owner, typed), `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1489` (`trackedCommandForOwner`), `:1503` (`degradedRecommendations`).
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` (`enrichCompiledRoutes`), `:442` (`attachTypedCommand`).
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:5696` (mode-free run row).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` (`$comment`), and its 347 cases read as data.
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:88`, `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:31`, `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`), `:226` (served head assertion).
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-routing-baseline.json:1` (capture fields and metrics).
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2362` (`MIN_BLOCKED_ATTEMPTS`), `:2386` (reopenable ruling), `:2405` (`replaceAnchorSection`).
- `.skilled/changelog/skilled/v4.2.0.0.md:484` (turned-down loop), `:759` (suite row).
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123` (degraded paths), `013-deep-loop-offer-in-hint/spec.md:104` (its REQ-006).
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/plan.md:62`, `:75`, `:90`, `:106`; `timeline.md:1`; `acceptance-criteria.md:77` (AC-020).

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. `R1-P1-001` (the seeded scope omits twelve declared change-set surfaces) remains active and is not restated here.

### P2 Findings

3. **AC-020 reads `Met` while its own verification says the evidence it needs is not in the packet, and REQ-013 rests on the same unkept record** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:77` -- The row requires that no builder's report says it read a holdout row. Its verification cell states the three `-04` rows replaced the `-01` rows "by row id only" and adds "The lane reports are not kept in the packet, so the blind-writer clause rests on the record in `implementation-summary.md`". REQ-013 (`spec.md:262`) makes the same blind-writer claim. What the tree can prove is the replacement itself (`command-prompts.jsonl:94` and the two rows beside it, no deep-family `-01` row left); what it cannot prove is that the writer never read a holdout row, because the report that would show it was never committed. A `Met` row therefore carries one clause with no in-tree evidence, which is the class of closure drift the fifth to tenth rounds kept correcting.
   Finding class: `matrix/evidence` (the check cannot be performed from the tree; the row admits it).
   Scope proof: `acceptance-criteria.md` and `spec.md` are packet documents inside the review target; `command-prompts.jsonl` was read as context evidence for the replacement, which is the only part this finding relies on.
   Affected surface hints: `spec.md:257` (REQ-013), `tasks.md` T047/T092 (the recapture rounds), `implementation-summary.md` row "Eighth round: 69 probes" where the corpus record lives.
   Case: a reader auditing closure opens AC-020 to see how the blind-writer clause was checked, finds the row marked `Met`, and finds no artefact behind that clause; the same reader then finds REQ-013 asserting it as a completed requirement. Nothing in the tree can move the row either way, so the row's `Met` is a judgement, not an observation.

## Traceability Checks

| Protocol | Status | Coverage this iteration | Evidence |
|---|---|---|---|
| `spec_code` | `partial` | REQ-015 to REQ-048 resolved (part 2); parts 1 and 2 together cover all 48 rows | `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1537`, `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2` |
| `checklist_evidence` | `pending` | Ticked tasks, `Met` rows and `CHK` boxes carried to iteration 3 | `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:77` |

Per-requirement result, part 2:

- REQ-015 to REQ-020 (refusal, question, spelling, negated symptom, subject, Python parity): twelve built-dist probes covering REQ-015 to REQ-020 returned the requirement's result on the stated route, including the two refusal forms, "how many passes does the deep review do", the hyphen and curly-apostrophe spellings, the negated symptom that keeps `/deep:research`, the two subject prompts that carry nothing and the two typed prompts that carry nothing. Met at the gate layer; AC-027's Python half rests on the shared fixture, which both suites read.
- REQ-021 (nothing earlier regresses): the clauses are suite runs and probe comparisons. Recorded output exists in the packet (69 probe rows, `results-after.json`; baseline `false_offer` 0 of 57), but this lineage cannot re-execute them. Carried as `partial` to iteration 7 rather than claimed.
- REQ-022 (docs say what was measured): `.skilled/changelog/skilled/v4.2.0.0.md:484` states the refusal rule as built, names the brief options and the typed `(ask)`, and `:759` quotes 186 files and 3,418 passed; AC-008 reads `Waived` with ADR-003, which exists at `decision-record.md:223`. Met at the doc level; the quoted count is the tenth-round record, not a number this lineage produced.
- REQ-023 to REQ-028 (sixth round, first lane): refusal leads are the exported `RUN_ASK_REFUSAL_LEADS` (`:688`, 17 entries) mirrored entry for entry in the Python tuple; `RUN_REFUSED` (`:897`) is read by the stuck branch and by `withholdDeepLoopDoctorWithoutRun`; `typedCommandsIn` (`:274`) puts every typed key in order while `typedCommandIn` keeps the longest; `namesLoopSubject` blanks a `NAMED_LOOP_MODE` match on both the deferred and the routed route; the stage-one lane gates `passesAsked` on `asksForLoopRun` or `isStuckRunComplaint`; and the degraded paths carry `command`, `policy`, `ownerSkillId` and `typed` through `subprocess.ts:216` and mark the row in `degradedRecommendations` (`skill-advisor-cli.ts:1503`). Met.
- REQ-029 to REQ-034 (sixth round, second half): `attachTypedCommand` (`handlers/advisor-recommend.ts:442`) is the served head the fixture column `servedReviewKept` pins on all five typed cases (`typed-on-stuck-serving.vitest.ts:31`, `deep-loop-offer-cases.vitest.ts:226`); the lead window is 400 in both copies with a 10,000-unit head whose Python cut counts JavaScript code units exactly (`skill_advisor.py:888`); `VOCABULARY_PAIRS` holds 22 pairs and 12 of the lists carry a per-entry case; `refinesSameLocation` keeps a refinement at another file or dimension as its own entry (`reduce-state.cjs`); REQ-033 is this rerun; and the closure docs name the sixth-round limitations at `implementation-summary.md:248`. Met, except REQ-033 (this run).
- REQ-035 to REQ-044 (seventh to ninth rounds): the plural loop name is read in both the gate and the scorer's explicit lane (`explicit.ts:457`, `:464`); the question lead, the effort complaint, the no-edit and refused-cue rules, the pronoun rerun and the clause-break typed doctor each have a fixture row and a probe result; `routedLoopMode` serves the named mode on the routed review route; `trackedCommandForOwner` vets a degraded supplied command; and `hasUnrefusedPronounRerun` counts a rerun only where the prompt names the run. Met.
- REQ-045 (mode vocabulary compared on every surface): `MODE_CUES` and `MODE_CUE_WORDS` key exactly `research` and `review`, which is the key set `hub-router.json` carries, and `NAMED_LOOP_MODE` is compared with the Python `_NAMED_LOOP_MODE_RE` through `PATTERN_PAIRS`. Met.
- REQ-046 (reducer direction reopenable, one heading, one-row enrichment): `MIN_BLOCKED_ATTEMPTS` is 2 and a single-ruling direction is written as `### <direction> -- RULED OUT` with a `Reopen when:` line (`reduce-state.cjs:2386`); `replaceAnchorSection` absorbs an authored heading; `enrichCompiledRoutes` withholds rather than offering twice. Met.
- REQ-047 (no run row for a mode-free ask): the Python gate keeps no run row for a two-mode or mode-free ask (`skill_advisor.py:5696`), the fixture's four such rows read `servedRun: "none"`, and the native route serves no command for them. Met.
- REQ-048 (strategy keeps its own section numbers): the rule lives in `replaceAnchorSection`, and this lineage's own strategy still reads `## 12. NEXT FOCUS` after the reducer's first rewrite, which is the behaviour in the field rather than only in a test. Met.

## Integration Evidence

- Advisor runtime, native side: `lib/command-attach.ts` `attachCommand` on the scorer's single-route shape, probed through the built `dist/runtime/lib/command-attach.js`.
- Advisor runtime, fallback side: `scripts/skill_advisor.py` `_apply_deep_loop_offer_gate` and `_advisor_prompt_head`, checked for the mode-free rule, the typed row and the code-unit head.
- Handler layer: `handlers/advisor-recommend.ts` `attachTypedCommand` and `enrichCompiledRoutes`.
- Degraded paths: `lib/subprocess.ts` `parseRecommendations` and `skill-advisor-cli.ts` `degradedRecommendations` with `trackedCommandForOwner`.
- Deep-loop runtime: `runtime/scripts/reduce-state.cjs` for the reopenable ruling, the heading absorption and the section numbering.
- Commands and changelog: `.skilled/changelog/skilled/v4.2.0.0.md:484` and `:759`, and packet 013's `implementation-summary.md:123` for the degraded-path record its REQ-006 needs.

## Edge Cases

- Missing dependency: the advisor and deep-loop suites were not executed from this lineage, so REQ-021, REQ-039 and REQ-042 keep `partial` on their run-level clause. Recorded rather than converted into a pass.
- Contradiction, adjudicated: `command-routing-baseline.json` carries `capturedAt: 2026-10-11`, which reads like a stale capture against the 2026-11-23 recapture AC-012 describes. `capture-command-routing-baseline.mjs:111` reads that field from the pinned scorer-eval baseline rather than stamping the capture time, so it is the scoring date and not the capture date. Not a finding.
- Partial success: `spec_code` is `partial` at the end of this iteration because the run-level clauses are outstanding, not because a requirement is unresolved.
- Ambiguity: AC-020's `Met` cannot be falsified from the tree either way, so the finding is recorded as evidence-weakness rather than as a false claim.

## Confirmed-Clean Surfaces

- All twelve built-dist probes for REQ-015 to REQ-020 agree with the requirement text, including both refusal spellings and the two typed prompts the Python gate has to answer alike.
- The twenty compared vocabulary lists, including `RUN_ASK_REFUSAL_LEADS` and `LOOP_WANT_LEADS`, agree entry for entry across the two gate copies.
- `VOCABULARY_PAIRS` holds the 22 pairs AC-038 claims, the fixture holds the 347 cases T068 and AC-029 claim, `spec.md` holds the 48 REQ rows CHK-001 claims, and the CHK boxes split 12 P0, 13 P1 and 1 P2 as the Verification Summary says.

## Ruled Out

- "The routing baseline is stale because its `capturedAt` predates the recapture": ruled out. The field is the pinned scorer-eval scoring date, read from another baseline, not the capture time (`capture-command-routing-baseline.mjs:111`).
- "The Python head cuts at a different length than the native schema": ruled out. `_advisor_prompt_head` (`skill_advisor.py:888`) counts a character outside the BMP as two units, which is the JavaScript count `ADVISOR_PROMPT_MAX_CHARS` is measured in.
- "A single ruling is written as permanently BLOCKED": ruled out. `MIN_BLOCKED_ATTEMPTS` (2) routes one attempt to `RULED OUT` with a `Reopen when:` line (`reduce-state.cjs:2386`).
- "A task cites a test title that does not exist": ruled out. The one apparent miss, `withholds the %s command on a refused run: %s`, exists at `tests/command-attach-guards.vitest.ts:803`; the miss was the checker's own double-space normalisation.

## Next Focus

- Dimension: `traceability`.
- Focus area: `checklist_evidence` - all 104 ticked tasks and every `Met` row against the tree, including the `Evidence:` tails, the CHK boxes and the Verification Summary counts.
- Reason: `spec_code` is resolved on all 48 rows; the second core protocol has not been run and gates coverage.
- Rotation status: `traceability` remains active; `correctness`, `security` and `maintainability` are still uncovered and follow in iterations 4 to 6.
- Blocked/productive carry-forward: productive - mechanical citation resolution (58 doc citations, 56 evidence tails) found the two stale pointers; carry the same method into the checklist pass.
- Required evidence: a `checklist_evidence` result row with per-needed-evidence file:line, and one row per `Met` acceptance row whose tail was re-resolved.
- Recovery note: none.

Review verdict: CONDITIONAL
