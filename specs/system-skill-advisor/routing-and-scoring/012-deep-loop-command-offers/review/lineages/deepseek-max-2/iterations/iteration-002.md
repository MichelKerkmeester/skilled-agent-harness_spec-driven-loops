# Review Iteration 002 - traceability (spec_code, REQ-015 to REQ-034)

## Dispatcher

- Mode: review, lineage `deepseek-max-2`, iteration 2 of 7, dimension traceability.
- Route: `Resolved route: mode=review target_agent=deep-review`.
- This iteration addressed the operator focus by running `spec_code` over REQ-015 to REQ-034: the fresh-review round and the sixth fix round, including ADR-005 and ADR-006, which the focus names. Each requirement's own prompts were looked up in the shared fixture, and each named symbol or test title was opened in the tree.
- Budget: 24 tool calls, used inside it.

## Files Reviewed

- `spec.md` REQ-015 to REQ-034, SC-005, SC-006 and the "Reopened" sections.
- `decision-record.md:412-600` (ADR-005, ADR-006).
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (359 cases; columns `asksForLoopRun`, `doctorWithheld`, `readOnlyRunKept`, `servedReviewKept`, `servedRun`, `stuckRun`, `typedReviewKept`, `typedRunsKept`, `writingAbout`; `$comment`).
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:688,715,942,1317,1381,1470,1595-1660,1763`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:52,4639,4666,5230,5376,5706`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:10,455,479-493`.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts` (doctor withhold call).
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1000-1030`.
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:121-152,181-191,571`.
- `timeline.md:24,41,53`; `spec.md:309`; `tasks.md:209-218`.
- `implementation-summary.md` limitations 6 to 8 and the "Python typed check" bullet.
- `.skilled/changelog/skilled/v4.2.0.0.md:750-770`.
- `specs/system-skill-advisor/routing-and-scoring/013-deep-loop-offer-in-hint/implementation-summary.md:123`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The packet's timeline stops one review round short of its own record** -- `timeline.md:41` -- The chronological entry says "Four traceability reruns alternated with fix rounds seven to ten", and the milestone at `timeline.md:53` names "a rerun after the tenth fix round" as AC-040's target. The packet records a fifth rerun at `spec.md:309` ("Reopened after the fifth traceability rerun", generation 7) and an eleventh fix round at `tasks.md:209` whose six tasks T106 to T111 are ticked (`tasks.md:213-218`). A reader who follows the timeline alone would not know the eleventh round happened, nor that the review now in flight is the sixth rerun.
   Finding class: docs-drift (instance-only, chronological record)
   Scope proof: `timeline.md` and `spec.md` are both lines of `review-scope-files.txt`; the contradiction is between two packet documents, not between a packet document and code.
   Affected surface hints: `timeline.md` section 2 (last entry) and section 3 milestones; no code surface.
   Case: a reader opens `timeline.md` after the eleventh round to date a change; the last entry dates every later round to "seven to ten" and the milestone still asks for "a rerun after the tenth fix round", so both the round count and the milestone's target are one round behind the tree.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | partial | REQ-001 to REQ-034 resolved (34 of 52). This iteration added REQ-015 to REQ-034. |
| `checklist_evidence` | pending | The acceptance rows for this range are read in iterations 5 and 6. |

What this iteration bound:

- **REQ-015 to REQ-030 prompts are all in the shared fixture.** 48 of the 51 quoted strings across REQ-015 to REQ-034 resolve to a case prompt; the three that do not are not prompts (`"do not run /deep:review."` is the repeated unit inside REQ-030's long prompt, `"typed command boundaries"` and `"A stuck run drops the run row"` are a describe name and a quoted line to rewrite).
- **REQ-023:** twelve `refusal-verb-*` rows; the seven refusals read `asksForLoopRun: false` (skip, avoid, no-need-for, instead-of, refuse, even-think, refused-to), the three controls and the two conjunction controls read `true`.
- **REQ-024:** 47 fixture rows carry `doctorWithheld`, 27 `true` and 20 `false`; the two run-refusing stuck prompts read `true` and `run-refused-stuck-control` reads `false` (`RUN_REFUSED` at `command-attach.ts:942`, read by `isRunRefused` at `:945` and by the fused withhold in `lib/scorer/fusion.ts`).
- **REQ-025:** `typedCommandsIn` (`command-attach.ts:274`) lists every typed key; the two `typed-two-commands-*` rows keep `/deep:review` in `typedRunsKept`, and the two `typed-both-loops-*` rows keep both loops in both orders.
- **REQ-026:** `NAMED_LOOP_MODE` (`command-attach.ts:1763`) is read through the subject check at `:1724` and `DEFECT_CHECK` carries the -ing verbs; the Python copy reads `_NAMED_LOOP_MODE_RE` (`skill_advisor.py:5376`) with the same skip.
- **REQ-027:** `lib/scorer/lanes/explicit.ts:455` gates `passesAsked` on `asksForLoopRun || isStuckRunComplaint`, and the Python copy gates `_is_loop_workflow_request` the same way.
- **REQ-028:** `ADVISOR_PROMPT_MAX_CHARS` is 10_000 on both sides (`skill_advisor.py:52`, read back by `NUMERIC_PAIRS` at `deep-loop-offer-cases.vitest.ts:152-155` through `pythonInteger:181`), and `LEAD_WINDOW` is 400 on both sides (`command-attach.ts:783`, `skill_advisor.py:5230`).
- **REQ-029 (ADR-005):** five rows carry `typedReviewKept` and `servedReviewKept` together, so the two layers are pinned separately; the fixture `$comment` says which layer each column pins, which is what REQ-034 asks of it.
- **REQ-031:** the 25 `VOCABULARY_PAIRS` entries cover every list the requirement names, `SMALL_EDIT_WORDING` is exported (`command-attach.ts:462`) and has no Python copy (no small-edit rule matches `skill_advisor.py`), and `COMMAND_DECLINE_LEADS`/`COMMAND_ASK_LEADS` both exist (`:1321`, `:1385`) and are built from the word lists the guard compares (`:1317`, `:1381`).
- **REQ-032:** `refinesSameLocation` (`reduce-state.cjs:1011`) returns false on a different file or a different declared dimension and true when either side cannot prove a different place, which is the behaviour the requirement states.
- **REQ-034:** the fixture `$comment` names the layer of every typed column; implementation-summary limitations 6, 7 and 8 and the reversed "Python typed check" sentence state the built behaviour; the changelog carries "unless the complaint also refuses a run or a fix", "A `/deep:*` command you typed on a stuck complaint stays" and "A turned-down loop gets no run"; packet 013 records the degraded-path evidence at `implementation-summary.md:123`; the Verification Summary (12 P0 / 11 verified, 13 P1, 1 P2) matches the boxes behind it.

## Integration Evidence

- ADR-005 splits the served head into `attachCommand` and `attachTypedCommand`; the fixture columns `typedReviewKept` and `servedReviewKept` are read by `tests/deep-loop-offer-cases.vitest.ts` and by `tests/python/test_skill_advisor.py`, so one case pins both copies.
- ADR-006's decision is visible as `LOOP_NAMES` behind verb-led alternations, pinned by the fixture row `bare-loop-name`.
- The reducer's refinement rule is exercised by `runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts`, named in the change-set table.

## Edge Cases

- REQ-030's long-prompt claim cannot be timed from this lineage (the suites are not run here). The two numbers it rests on are compared by the drift guard, so the requirement's constants are pinned even though the wall-clock claim is not re-measured. Recorded as unverified rather than as a pass.
- The init strategy pre-ticked two dimensions, and the reducer's `buildDimensionCoverage` reads ticked strategy lines as coverage, so the first reduction reported correctness and security covered before any iteration reviewed them. The strategy was corrected to tick only `traceability` and the reduction re-run; the coverage in the registry now matches the iterations. The behaviour is by design (the agent owns that checklist), and it is noted here so the coverage evidence is auditable.
- REQ-019's "up to three words may now stand before the loop's noun" is an implementation bound with a known miss (limitation 7), not a requirement gap.

## Confirmed-Clean Surfaces

- The fixture is a single source of truth: 359 cases, 11 columns, each column documented in `$comment`, read by both suites.
- Both gate copies export the same refusal, cancel and typed vocabularies, and no comment in either carries an ephemeral label.
- ADR-005 and ADR-006 both state a decision, its alternatives and its consequences, and name the REQ and AC rows that carry them.

## Ruled Out

- **A REQ-015 to REQ-034 prompt missing from the shared fixture.** Ruled out: 48 of 51 quoted strings resolve to a case prompt, and the three that do not are a repeated unit, a describe name and a quoted line, none of which is a prompt.
- **A drift-guard list with no Python counterpart.** Ruled out: `SMALL_EDIT_WORDING` is the one deliberate exception and has no Python copy, and the two command lead lists it was excused for are compared.
- **A refinement folding across files.** Ruled out by reading `refinesSameLocation` and the unit test that names it.

## Next Focus

- Dimension: traceability (`spec_code`).
- Focus area: REQ-035 to REQ-052, the seventh to eleventh rounds, plus the ADR-007, ADR-008 and ADR-009 amendments they cite.
- Reason: it is the last unmapped slice of the requirement table, and it carries four of the five requirement rows whose evidence is a pattern pair or a served-behaviour column.
- Rotation status: traceability stays active; `spec_code` closes here and `checklist_evidence` follows in iterations 4 to 6.
- Blocked / productive carry-forward: productive. The fixture-column lookup found every prompt in this slice.
- Required evidence: `PATTERN_PAIRS` and `PATTERNS_NOT_COMPARED` names, the `servedRun` column, `VOCABULARY_PAIRS`, and the reducer's `stripReviewVerdict` and section-numbering behaviour.

Review verdict: PASS
