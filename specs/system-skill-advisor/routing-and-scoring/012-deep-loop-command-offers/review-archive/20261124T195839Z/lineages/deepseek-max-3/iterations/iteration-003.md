# Review Iteration 003 — traceability (core protocol `spec_code`, full requirement sweep)

## Dispatcher

- Mode: `review`; target agent: `@deep-review` (LEAF, single iteration).
- Resolved route: `Resolved route: mode=review target_agent=deep-review`.
- Lineage: sessionId `fanout-deepseek-max-3-1795546920757-7pyjry`, generation 1, lineageMode `new`, executor cli-pi (deepseek-v4.1-flash-1017).
- Setup bindings (unchanged; emitted in full at iteration 1): target, maxIterations=7, convergence=0.1, mode=review, dimensions=correctness/security/traceability/maintainability, specFolder.
- Review focus for this iteration: the operator's traceability focus is the whole iteration. "Check every REQ in spec.md against the code that implements it or the decision that records it" — the table below does that for all 48 requirements, with the sixth round (REQ-023 to REQ-034) read line by line and the rest read against the code, fixture and probe artifacts.
- `steer.md` is absent at this iteration.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:211-273` (the two requirement tables and the six reopen paragraphs)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001) through `:1239` (ADR-008 interrogative)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1132` (`asksForLoopRun`), `:1537` (`attachCommand`), `:1628` (`deferredLoopCommand`), `:1667` (`loopAskCues`), `:688` (`RUN_ASK_REFUSAL_LEADS`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:888` (`_advisor_prompt_head`), `:4639` (`_RUN_ASK_REFUSAL_LEAD_LIST`), `:5181` (`_LEAD_WINDOW`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:442-495` (the loop lanes)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (347 rows, read through the probe and by id)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80` (`VOCABULARY_PAIRS`), `:434` (`PATTERN_PAIRS`), `:497` (mode vocabulary on four surfaces)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995` (`refinesSameLocation`), `:2362` (`MIN_BLOCKED_ATTEMPTS`), `:2405` (`replaceAnchorSection`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:363` (`enrichCompiledRoutes`), `:442` (`attachTypedCommand`)
- `.skilled/commands/deep/research.md:86`, `.skilled/commands/deep/review.md:81`, both presentation files `:13`, both YAML `next_steps`
- `.skilled/changelog/skilled/v4.2.0.0.md:482-484` (refusal, typed-on-stuck and turned-down loop rows), `:759` (suite row)
- `.skilled/skills/system-deep-loop/hub-router.json:34`, `.skilled/skills/system-deep-loop/ROUTER.md`
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/command-prompts.jsonl` (247 rows, 31 near-miss)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/{probes-spec-baseline,results-after,results-final-958fa81-worktree}.json` (69 rows each)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. The active P1 (REQ-033 unmet and unwaived) is the one this sweep confirms; see the REQ table below.

### P2 Findings

None new. The active P2s from iteration 1 (AC-040's archived evidence path, REQ-031's wider-than-guard promise) are both re-confirmed by this sweep.

## Traceability Checks

| Protocol | Status | Evidence |
|---|---|---|
| `spec_code` | fail | two required behaviours do not match the tree: REQ-031's guard promise (P2) and REQ-033's obligation (P1). Every other requirement in the table below is confirmed against code, fixture, a recorded probe, or a decision |

### Requirement table (all 48)

Status vocabulary: **Confirmed** — read the code/config/test and the claim holds, or probed the built gate; **Recorded** — the requirement is a measurement the packet records, the artifact exists and its shape matches, and it was not re-executed here; **Drift** — a stated claim does not match the tree; **Unmet** — the obligation is absent.

| REQ | Status | Where it is implemented or recorded |
|---|---|---|
| REQ-001 | Recorded | `scratch/probes/results-after.json` holds 69 rows; `implementation-summary.md:154` records the gain lines |
| REQ-002 | Recorded | same probe file; `command-attach.ts:1132` withholds depth wording |
| REQ-003 | Recorded | probe rows for the seventeen keep prompts |
| REQ-004 | Recorded | probe rows for the seventeen negatives |
| REQ-005 | Confirmed | `deep-research-presentation.txt:13` and `deep-review-presentation.txt:13` carry `### Offer From an Advisor Brief`; `research.md:86` and `review.md:81` carry step 0 |
| REQ-006 | Confirmed (probed) | all 347 fixture rows agree with the built `dist` gate on `asksForLoopRun`, `stuckRun`, `writingAbout`, `doctorWithheld`, `servedRun`, `typedReviewKept`, `typedRunsKept`, `readOnlyRunKept`; suite counts are recorded at `implementation-summary.md:178` |
| REQ-007 | Recorded | `.skilled/commands/deep/assets/compiled/` holds the two contracts and the README; `rg 'ASK with SINGLE prompt'` over them prints nothing |
| REQ-008 | Recorded | stage-one lines quoted at `implementation-summary.md:154`; lanes read at `explicit.ts:442-495` |
| REQ-009 | Confirmed | `rg -c -- '--extend=N|--restart|doctor:deep-loop --scope='` reads 11, 11, 14, 14 across the two YAMLs and two presentation files |
| REQ-010 | Confirmed | both presentation files name the `communication-handoff.md` §5 question tool at step 6 (`:223` / `:237`) and carry `Autonomous (Recommended)` plus `Native (Recommended, default)` |
| REQ-011 | Confirmed | `iterative research` and `multi-round research` each appear once in `hub-router.json` and `ROUTER.md`; `autonomous research`, `comprehensive research`, `deep investigation`, `audit spec folder` and `pre-release review` are absent from the named files |
| REQ-012 | Confirmed | `command-prompts.jsonl` holds 31 near-miss rows, including N7→`nm-system-deep-loop-02`, N9→`-03`, V7→`-05`, H6→`nm-sk-code-02`, A3→`nm-sk-code-03`; D1 is `cmd-doctor-deep-loop-plain-tune-02`, a plain `/doctor:deep-loop` row |
| REQ-013 | Confirmed | the three deep-family holdout rows are the `-04` ids (`cmd-deep-research-plain-holdout-04`, `cmd-deep-review-plain-holdout-04`, `cmd-doctor-deep-loop-plain-holdout-04`) |
| REQ-014 | Confirmed (probed) | "summarize the research.md from the last deep research run" → no command on a review route and on a deferred route |
| REQ-015 | Confirmed (probed) | "don't do deep research, just answer quickly" → none; "do a deep review of the parser" → `/deep:review` |
| REQ-016 | Confirmed (probed) | "how many iterations does deep research run by default?" → none |
| REQ-017 | Confirmed (probed) | the hyphen prompt → `/deep:review`; the curly-apostrophe prompt → `/deep:research` |
| REQ-018 | Confirmed (probed) | "the deep research run is not stuck, run 5 more iterations" → `/deep:research`, no doctor |
| REQ-019 | Confirmed (probed) | "refactor the deep research scorer" → none; "run a deep review on the parser" → `/deep:review` |
| REQ-020 | Confirmed (probed, gate layer) | the typed-stuck prompt reads `stuck: true` and `attachCommand` answers `/doctor:deep-loop`, exactly as the requirement states; the served-head exception is ADR-005 |
| REQ-021 | Recorded | `implementation-summary.md:178` records 186 files, 3,418 passed, 4 skipped, drift 0 |
| REQ-022 | Confirmed | `changelog:482-484` states the refusal rule, the typed-on-stuck head and the turned-down loop; `:759` quotes the final suite; AC-008 reads `Waived` with ADR-003 |
| REQ-023 | Confirmed (probed) | six refusals → none, three controls → `/deep:review`; both copies carry the leads (`command-attach.ts:688`, `skill_advisor.py:4639`) |
| REQ-024 | Confirmed (probed) | the two run-refusing stuck prompts lose the doctor; the plain complaint keeps it |
| REQ-025 | Confirmed (probed) | "run /deep:review on the parser, then /create:changelog" keeps `/deep:review` on a review route |
| REQ-026 | Confirmed (probed) | "run a deep loop to review the research loop config" → `/deep:review` on a deferred route |
| REQ-027 | Confirmed | `explicit.ts:457` and `:464` gate both lanes on a pass ask; `stage-one-loop-subject.vitest.ts:26` pins both prompts |
| REQ-028 | Confirmed | `render.ts:250` suppresses the offer for a typed row; `subprocess.ts:245` marks the subprocess row; `skill-advisor-cli.ts:1554` keeps the degraded command row |
| REQ-029 | Confirmed | `attachTypedCommand` (`advisor-recommend.ts:442`) overrides the doctor with the typed run; the fixture row `typed-stuck` carries `servedReviewKept`; `typed-on-stuck-serving.vitest.ts` pins it |
| REQ-030 | Confirmed | `schemas/advisor-tool-schemas.ts:257` and `:262`; `skill_advisor.py:888`; `LEAD_WINDOW` at `command-attach.ts:748` and `skill_advisor.py:5181` |
| REQ-031 | **Drift** | 23 exported word lists, 22 `VOCABULARY_PAIRS` rows, `SMALL_EDIT_WORDING` unpaired — P2 finding R1-P2-002 |
| REQ-032 | Confirmed | `refinesSameLocation` at `reduce-state.cjs:995`, pinned by `reduce-state-refinement-other-file.vitest.ts` and `synthesis-closeout-refinements.vitest.ts` (both present) |
| REQ-033 | **Unmet** | AC-040 `Unmet`, T084 `[ ]`, CHK-020 `[ ]`, Verification Summary 11/12, no ADR waiver — P1 finding R1-P1-001 |
| REQ-034 | Confirmed | fixture header `$comment`; `implementation-summary.md:242`; changelog `:482-484`; packet 013 row "Reopened: degraded paths"; Verification Summary 12/11, 13/13, 1/1 matches the CHK boxes |
| REQ-035 | Confirmed (probed) | the thirteen rows read as AC-044 states; the eight run rows sit at `deep-loop-offer-cases.json:257-264`, the five reads at `:265-273`; `deep-loop-plural-noun.vitest.ts` pins the scorer |
| REQ-036 | Confirmed (probed) | "how do I run a deep review on this?" → none; the run-after-question prompt → `/deep:review` |
| REQ-037 | Confirmed (probed) | "the deep review loop is too slow" → none; "run a fast deep review on the parser" → `/deep:review` |
| REQ-038 | Confirmed | `trackedCommandForOwner` (`skill-advisor-cli.ts:1489`) requires an own-key hit and an owner match; the rejecting branch prints no command, policy, owner or typed marker |
| REQ-039 | Recorded | `implementation-summary.md:156` records `false_offer` 0 and each new row's outcome |
| REQ-040 | Confirmed (probed) | "run a deep review of the parser but don't change anything" → `/deep:review` |
| REQ-041 | Confirmed | the five `refused-cue-*` rows read as asks; `command-attach-guards.vitest.ts:919` pins the deferred cue |
| REQ-042 | Confirmed (probed) | the routed research route serves `/deep:review` for the ask that names review |
| REQ-043 | Confirmed (probed) | "the deep review didn't finish, run it again" is a run ask with no doctor |
| REQ-044 | Confirmed (probed) | the typed `/doctor:deep-loop` after a clause break serves the doctor; manner effort words keep the run |
| REQ-045 | Confirmed | `deep-loop-offer-cases.vitest.ts:497` asserts the four surfaces key the same modes; `PATTERN_PAIRS` at `:434` compares `NAMED_LOOP_MODE`; `NUMERIC_PAIRS` at `:109` compares the two numbers |
| REQ-046 | Confirmed | `MIN_BLOCKED_ATTEMPTS` at `reduce-state.cjs:2362` writes one ruling as reopenable; `authoredHeading` at `:2437` drops the authored heading; `enrichCompiledRoutes` (`advisor-recommend.ts:363`) carries the duplicate guard |
| REQ-047 | Confirmed | the four mode-free rows read `servedRun: "none"` (`deep-loop-offer-cases.json:262`, `:318`, `:323`, plus `run-deep-loop`); the deferred probe returns nothing for them |
| REQ-048 | Confirmed | `replaceAnchorSection` (`reduce-state.cjs:2405-2470`) keeps the file's own ordinal; `golden-review-default/next-focus.txt` holds `## 12. NEXT FOCUS`; `deep-review-strategy-numbering.vitest.ts:80` pins it |

### Sixth fix round, one line each (REQ-023 to REQ-034)

| REQ | Outcome | Note |
|---|---|---|
| REQ-023 | Confirmed | refusal verbs in both copies, fixture rows and guard block agree |
| REQ-024 | Confirmed | run-refusal withholds the doctor; the plain complaint keeps it |
| REQ-025 | Confirmed | a typed command survives a second typed command at the gate layer |
| REQ-026 | Confirmed | deferred mode cue reads only loop names that are asks |
| REQ-027 | Confirmed | stage-one lanes honour the subject and refusal readings |
| REQ-028 | Confirmed | both degraded paths render the typed deep command plainly |
| REQ-029 | Confirmed | typed-on-stuck is pinned at the handler and in the fixture's served column |
| REQ-030 | Confirmed | 10,000-unit head and two 400-character windows |
| REQ-031 | Drift | `SMALL_EDIT_WORDING` is outside the drift guard (P2) |
| REQ-032 | Confirmed | a refinement at another file keeps its own entry |
| REQ-033 | Unmet | the coverage rerun is open on four records and unwaived (P1) |
| REQ-034 | Confirmed | the closure docs state the built behaviour |

## Integration Evidence

- AC-006/AC-007 point at the two presentation files' `### Offer From an Advisor Brief` and the two command documents' step 0; both were read at the cited lines.
- REQ-045's four surfaces are `MODE_COMMANDS`, `MODE_CUES`, `MODE_CUE_WORDS` and `hub-router.json`; the test at `deep-loop-offer-cases.vitest.ts:497` reads all four, and the router file was read directly.
- REQ-032/REQ-046/REQ-048 all land in `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs`; the three functions were read at `:995`, `:2362` and `:2405-2470`.

## Edge Cases

- Two requirements are measurements (REQ-001 to REQ-004, REQ-021) that would need a live advisor run and two full suites to re-execute. They are marked **Recorded**: the artifacts exist and their shape matches the claim, and the packet's own rule is that the registry, not this narrative, carries the release verdict.
- REQ-020 splits by layer. The gate layer is confirmed by probe; the served head is the ADR-005 exception and is confirmed by code and fixture, not by a live head run.
- The probe used the built `dist`, not the TypeScript source. That is deliberate: it also tests REQ-006's "dist is rebuilt" clause, and 347/347 agreement would fail if the build lagged the source.
- `command-prompts.jsonl` maps probe ids through prompts, not through ids of its own; N7/N9/V7/H6/A3 were resolved by matching `probes-spec-baseline.json` prompts to corpus rows, which is recorded here because the mapping is an inference rather than a stated column.

## Confirmed-Clean Surfaces

- 44 of 48 requirements confirmed against code, fixture, probe or decision; two are recorded measurements whose artifacts exist; the two exceptions are the active findings.
- Every `path:line` cell in `acceptance-criteria.md` except AC-040 resolves with its token on that line (49 cells; re-checked in iteration 1).
- `dist` and source agree on the whole shared fixture: 347 rows, eight columns, zero disagreements.

## Ruled Out

- "REQ-020's served-head exception is an undocumented drift": ADR-005 (`decision-record.md:412`) records it, AC-027 and AC-036 both name it, and the fixture carries `servedReviewKept`. The exception is documented at every layer.
- "REQ-011's aliases are missing from the router": both files carry `iterative research` and `multi-round research` once each, and `autonomous research` is absent, which is what ADR-007 amends.
- "REQ-012's near-miss rows are countable but not real": the five probe prompts map to five distinct near-miss rows, and D1 maps to a plain doctor row whose `expected_command` is `/doctor:deep-loop`.
- "REQ-034's Verification Summary does not match its boxes": the CHK rows count 12 P0 (11 ticked), 13 P1, 1 P2, exactly the summary's numbers.

## Next Focus

- Dimension: maintainability
- Focus area: the closure-record layer the ten rounds kept rewriting — counts, cross-references, comment hygiene and the reducer-owned surfaces — still read against the operator's traceability question.
- Reason: traceability's `spec_code` half is complete; `checklist_evidence` needs the tasks/AC row evidence that iteration 5 will read, and maintainability is the last canonical dimension.
- Rotation status: correctness and security complete; traceability half complete; maintainability next.
- Blocked / productive carry-forward: nothing blocked. The requirement table is the base iteration 5 will extend row by row.
- Required evidence: `tasks.md` (ten rounds, 135 boxes), `acceptance-criteria.md`, `implementation-summary.md` limitations, `decision-record.md` ADRs, and the reducer's strategy/dashboard writers.

Review verdict: CONDITIONAL
