# Deep Review Iteration 004 - Traceability (checklist_evidence protocol)

## Dispatcher
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iteration: 4 of 5
- Dimension: traceability
- Operator review focus: This iteration completes the focus's checklist half. It reads every ticked sixth-round task in `tasks.md` and every `Met` row in `acceptance-criteria.md` (AC-030 to AC-042) against evidence that exists in the tree.
- Protocol run: `checklist_evidence` (core), first completed pass.

## Files Reviewed
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:140]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:214]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:95]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:164]
- [SOURCE: .skilled/changelog/skilled/v4.2.0.0.md:759]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:806]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:961]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:998]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:20]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:196]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts:91]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings

1. **The release changelog still quotes the fifth-round advisor suite count** -- .skilled/changelog/skilled/v4.2.0.0.md:759 -- The v4.2.0.0 "Tests and scenarios" table reports "Advisor runtime suite with the loop offers | 2,696 passed, 4 skipped, none failed". The same release entry now describes sixth-round behavior (the refusal verbs and the typed-on-stuck head at `:482` to `:484`), while the sixth-round verification rows record the tree's final count as `184 files, 3029 passed, 4 skipped, 0 failed` (`implementation-summary.md:166`) and AC-042 repeats 3,029. AC-029 still reads `Met` citing 2,696 as "the final suite count". A reader of the release entry sees a count 333 tests below the tree it describes.
Finding class: doc-code-drift
Scope proof: .skilled/changelog/skilled/v4.2.0.0.md:759
Affected surface hints: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:86 (AC-029), specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:166, specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99 (AC-042)
Case: a reader checking whether the loop offers are fully tested takes 2,696 as the released count, while the branch that shipped carries 3,029 and 203 fixture cases rather than 118.

## Traceability Checks

### `checklist_evidence` (core)

| Item | Status | Evidence in tree | Note |
|---|---|---|---|
| T068 fixture + guard rows | pass | .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:129, .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:806 | Six refusal rows read `false`, five controls read `true`, 11 `refusal-verb-` rows in total, as AC-030 states. |
| T069 two typed commands | pass | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274, :1320 | `typedCommandsIn` exists and the deep gate reads it; `typedCommandIn` keeps the longest key. |
| T070 deferred cue + -ing defect check | pass | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:480, :1347, .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:961 | Both deferred-route prompts return `/deep:review`; the two controls return nothing. |
| T071 typed-on-stuck served column | pass | .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107, .skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-typed-command.vitest.ts:91 | The native head serves the typed command over the diagnosis; the untyped complaint keeps the diagnosis. |
| T072 Python typed mark | pass | .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5349 | The gate sets `rec["typed"] = True` on the kept run row. |
| T073 Python workflow request | pass | .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5424 | The passes reading is gated on `asks_for_loop_run`/`is_stuck_run_complaint`. |
| T074 ADR-006 fixture row | pass | .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:169 (`bare-loop-name`) | Row reads `asksForLoopRun: false`. |
| T075 bounded window + shared head | pass | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592, .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4886, :6165 | Long-prompt cases exist in both suites (`command-attach-guards.vitest.ts:998`). |
| T076 drift guard per-entry rule | partial | .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206, :214, :221 | Eleven pairs compared, but the per-entry case rule runs for six lists; artifact-after nouns and past-run read verbs have none. R1-P2-001. |
| T077 degraded paths | pass | .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:205, .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1520 | Command, policy, owner and `typed: true` survive the parse; the degraded row marks only the typed tracked command. |
| T078 stage-one passes | pass | .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452, .skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:20 | The lane needs the gate or stuck predicate; the four cases exist. |
| T079 typed-on-stuck handler pins | pass | .skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:107, :148 | Both serving cases exist. |
| T080 reducer refinement | pass | .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995, .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1069 | Split and fold paths both exist, with their unit file. |
| T081 build and rerun | pass (recorded) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/implementation-summary.md:164 | The observed numbers are recorded; this lineage did not execute the suites. |
| T082 closure docs | pass (recorded) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:164 | Cited lines exist (fixture header, limitations, changelog, packet 013). |
| T083 acceptance rows | pass (recorded) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:165 | AC-030 to AC-039 and AC-042 read `Met`; AC-040 reads `Unmet`. |
| T084 rerun | open (correct) | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:166 | Box is unticked; this lineage is the rerun, so it cannot tick it. |
| T085 validate | pass (recorded) | RESULT line recorded in the task; not re-run here | Out of scope for the lineage write surface. |

### Acceptance rows AC-030 to AC-042

| AC | Status in packet | Review verdict |
|---|---|---|
| AC-030 | Met | Supported: 11 `refusal-verb-` rows, six false and five true, guard group at `command-attach-guards.vitest.ts:806`. |
| AC-031 | Met | Supported: 26 `doctorWithheld` rows; both fused-row cases exist at `doctor-handoff-command.vitest.ts:196`. |
| AC-032 | Met | Supported: `typedRunsKept` rows keep `/deep:review`; `typedCommandIn` longest key at `command-attach.ts:250`. |
| AC-033 | Met | Supported: both deferred cases and two controls exist at `command-attach-guards.vitest.ts:961`. |
| AC-034 | Met | Supported: four stage-one cases; the drop and keep cases are at `stage-one-loop-subject.vitest.ts:26` and `:20`. |
| AC-035 | Met | Supported: typed degraded render is plain (`render.ts:250`), subprocess fields carried (`subprocess.ts:205`). |
| AC-036 | Met | Supported: typed-on-stuck serving and handler cases exist. |
| AC-037 | Met | Supported: 400-character window both sides, 10,000-unit head, long-prompt cases in both suites. |
| AC-038 | Met (overstated) | Contradicted in part: the per-entry fixture rule does not cover artifact-after nouns or past-run read verbs. R1-P2-001. |
| AC-039 | Met | Supported: `refinesSameLocation` and its unit file. |
| AC-040 | Unmet (correct) | This lineage is the rerun; the row can only close after synthesis writes the terminal gates. |
| AC-041 | Met | Supported: every cited line exists (fixture header at `:2`, limitations at `:245`/`:246`, changelog at `:482` to `:484`, packet 013 at `:123`, summary counts at `:291` to `:293`). |
| AC-042 | Met | Numbers recorded at `implementation-summary.md:164` to `:171`; this lineage did not re-execute them. |

### Verification-summary arithmetic

| Category | Claimed | Actual (grep of `^- [x] CHK-`) | Verdict |
|---|---|---|---|
| P0 | 12 total, 11 verified | 12 P0 rows, CHK-020 the only unticked one | pass |
| P1 | 13 of 13 | 13 P1 rows, all ticked | pass |
| P2 | 1 of 1 | 1 P2 row, ticked | pass |

## Integration Evidence
- The changelog's test table (`.skilled/changelog/skilled/v4.2.0.0.md:753` to `:768`) is the release entry's single source of suite numbers, and the "with the loop offers" row is the one REQ-022 and AC-029 rely on.
- The sixth-round verification rows (`implementation-summary.md:164` to `:171`) are the tree's own record of the final count (3,029) and the 203-case fixture.

## Edge Cases
- `npx vitest run` numbers are taken from the packet's recorded output, not re-executed in this lineage; the instruction that bounds this lineage forbids running repo tooling. The finding above turns on the two recorded numbers disagreeing, not on which one runs.
- AC-038's Given names "an entry with no fixture case"; the guard file's own comment describes per-entry coverage only for the lists it iterates. A future list added to `VOCABULARY_PAIRS` alone would be compared but never exercised.
- T084 staying open is the honest state, and AC-040 staying `Unmet` is consistent with it; no finding is raised for either.

## Confirmed-Clean Surfaces
- Every sixth-round task that cites a path names one that exists; no out-of-range `path:line` citation was found among the resolvable citations in `tasks.md`, `acceptance-criteria.md` or `implementation-summary.md`.
- The Verification Summary arithmetic matches the checklist boxes exactly.
- The `Met` rows AC-030 to AC-037 and AC-039 to AC-042 each have a real tree surface for their claim.

## Ruled Out
- A wrong Verification Summary count: the three category totals and the 11/12 P0 line match the ticked boxes.
- An unearned `Met` on AC-040: the row reads `Unmet`, so the checklist does not overclaim the rerun.
- A missing `bare-loop-name` fixture row for ADR-006: the row exists and reads `asksForLoopRun: false`.

## Next Focus
- Dimension: maintainability
- Focus area: pattern and documentation cost of the sixth-round additions, and the closure-doc consistency the focus leaves open
- Reason: all three traceability deliverables are now recorded; maintainability is the only dimension without a pass
- Rotation status: correctness complete, security complete, traceability complete, maintainability next
- Required evidence: file:line for any pattern or doc-cost finding

Review verdict: PASS
