# Deep Review Iteration 003 - Traceability (spec_code protocol)

## Dispatcher
- Target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers` (spec-folder)
- Iteration: 3 of 5
- Dimension: traceability
- Operator review focus: This iteration is the focus. It maps every REQ in `spec.md` to the code that implements it or the decision that records it, starting with the sixth fix round (REQ-023 to REQ-034) and its decisions ADR-005 and ADR-006.
- Protocol run: `spec_code` (core), first completed pass.

## Files Reviewed
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:235]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:245]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:279]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412]
- [SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:480]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:738]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1254]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1320]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1341]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/render.ts:248]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:187]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/subprocess.ts:236]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1490]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1520]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:446]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1074]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:4868]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5320]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5349]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5424]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/schemas/advisor-tool-schemas.ts:257]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:2]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:61]
- [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995]
- [SOURCE: .skilled/skills/system-deep-loop/runtime/tests/unit/reduce-state-refinement-other-file.vitest.ts:80]

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None new. The REQ-031 gap already recorded as R1-P2-001 is restated as the `spec_code` verdict for that row, not re-filed, so this iteration adds no registry entry.

## Traceability Checks

### `spec_code` (core) - REQ-001 to REQ-022 (prior rounds)

| REQ | Status | Implementing surface / decision |
|---|---|---|
| REQ-001 to REQ-005 | pass | `attachCommand` (`command-attach.ts:1254`) reads `LOOP_WORDING` and `MODE_COMMANDS`; the offer sections live in both presentation files in scope. |
| REQ-006 | pass | `attachCommand` asks-gate plus the deep-loop fixture; prior-round behavior unchanged by the sixth round. |
| REQ-007 to REQ-014 | pass | Command edits and stage-one rules are present in the files listed in `review-scope-files.txt`; no sixth-round edit contradicts them. |
| REQ-015 to REQ-019 | pass | Refusal, question, spelling, negated-symptom and loop-as-subject readings are all present in `command-attach.ts:580`, `:738`, `:886`, `:899`. |
| REQ-020 | pass | ADR-005 (`decision-record.md:412`) records the typed-on-stuck exception; `spec.md:232` states it, so the closure-record gap is closed. |
| REQ-021 | pass | The shared fixture (203 cases) is read by both suites; no fixture row was removed by the sixth round. |
| REQ-022 | pass | Changelog and AC-008 rows are outside this iteration's finding scope but were left consistent by the closure round (see REQ-034). |

### `spec_code` (core) - REQ-023 to REQ-034 (sixth fix round)

| REQ | Status | Implementing surface / decision | Evidence |
|---|---|---|---|
| REQ-023 | pass | `RUN_ASK_NEGATED_SOURCE` (`command-attach.ts:580`) adds `skip`/`avoid`/`instead of`/`rather than`/`refuse`/`do not even think about` leads and stops a work-led refusal at a conjunction; the Python copy is the same pattern (`skill_advisor.py:4868`). | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:580 |
| REQ-024 | pass | `attachCommand`'s stuck branch (`command-attach.ts:1266`) withholds the doctor on `isRunRefused`/`isNoEditRequest`; `withholdDeepLoopDoctorWithoutRun` (`fusion.ts:1074`) does the same on the fused row; the Python gate drops the doctor row on the same predicates (`skill_advisor.py:5328`). | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1266 |
| REQ-025 | pass | `typedCommandsIn` (`:274`) returns every typed command in order and the deep gate reads it (`:1320`); `typedCommandForTop` (`:304`) walks it; `typedCommandIn` keeps its longest key; fixture rows `typed-two-commands-*` pin `typedRunsKept`. | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:274 |
| REQ-026 | pass | `deferredLoopCommand` (`:1341`) blanks a `NAMED_LOOP_MODE` match that `namesLoopSubject` reads as the subject, and `DEFECT_CHECK` (`:480`) reads the -ing forms. Python keeps no mode-cue copy, as T070 states. | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1341 |
| REQ-027 | pass | `explicit.ts:452` gates `passesAsked` on `asksForLoopRun`/`isStuckRunComplaint`; the Python `_is_loop_workflow_request` (`skill_advisor.py:5424`) reads the same predicates. The published head scores (0.8754/0.82) are not re-measured in this lineage. | .skilled/skills/system-skill-advisor/runtime/lib/scorer/lanes/explicit.ts:452 |
| REQ-028 | pass | `render.ts:250` prints a typed row plainly; `parseRecommendations` (`subprocess.ts:205`) carries command, policy, owner and a literal `typed: true`; `degradedRecommendations` (`skill-advisor-cli.ts:1520`) marks only the tracked command the reader typed. | .skilled/skills/system-skill-advisor/runtime/lib/render.ts:250 |
| REQ-029 | pass | `attachTypedCommand` (`advisor-recommend.ts:428`) runs over the served head; the Python gate marks the kept typed run row (`skill_advisor.py:5349`); ADR-005 records the choice; fixture column `servedReviewKept` is true on `typed-stuck` and false on the three typed negative rows. | .skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:428 |
| REQ-030 | pass | `LEAD_WINDOW` 400 (`command-attach.ts:592`) and `_LEAD_WINDOW` 400 (`skill_advisor.py:4886`); the schema caps the prompt at 10,000 code units (`advisor-tool-schemas.ts:257`) and the Python gate reads the same head (`skill_advisor.py:888`, passed at `:6165`); long-prompt cases exist in both suites. | .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:592 |
| REQ-031 | partial | Eleven list pairs are compared (`deep-loop-offer-cases.vitest.ts:61`), but the per-entry fixture rule runs for six lists only; `LOOP_ARTIFACT_NOUNS` and `PAST_RUN_READ_VERBS` have no per-entry case. See R1-P2-001. | .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:206 |
| REQ-032 | pass | `refinesSameLocation` (`reduce-state.cjs:995`) splits a refinement at another file or declared dimension and folds one at the same file; the unit file covers both directions. | .skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:995 |
| REQ-033 | partial | This run is the required rerun. `spec_code` completes here and `checklist_evidence` is scheduled for iteration 4; the terminal gates are computed at synthesis. AC-040 is honestly recorded as `Unmet` until that rerun completes. | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97 |
| REQ-034 | pass | Fixture header names each typed column's layer (`deep-loop-offer-cases.json:2`); limitations 6 and 7 are rewritten (`implementation-summary.md:245`, `:246`); the changelog names the refusal exception, the typed-on-stuck head and the refusal verbs (`.skilled/changelog/skilled/v4.2.0.0.md:482` to `:484`); packet 013 records its degraded-path evidence (`013-deep-loop-offer-in-hint/implementation-summary.md:123`); the Verification Summary counts match the boxes (`tasks.md:291` to `:293`: 12 P0/11 verified, 13 P1, 1 P2). | specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:291 |

### Decisions

| ADR | Status | Evidence |
|---|---|---|
| ADR-005 | pass | `decision-record.md:412` records the typed-on-stuck served-head choice; the implementation and fixture column named in its Implementation section exist. |
| ADR-006 | pass | `decision-record.md:508` records the bare-loop-name narrowing; the fixture row `bare-loop-name` reads `asksForLoopRun: false`, and the gate counts loop names only behind a use, continue or want verb (`command-attach.ts:790`). |

## Integration Evidence
- The Python gate `_apply_deep_loop_offer_gate` (`skill_advisor.py:5320`) is the fallback's served layer named by ADR-005; it keeps a typed run row on a stuck complaint and marks it `typed` at `:5349`.
- The shared fixture header (`deep-loop-offer-cases.json:2`) names each column's layer, which is what REQ-034 asks of it.
- `fixture cases = 203`, the count both suites read; this lineage did not execute the suites, so the count is a static read, not a run result.

## Edge Cases
- REQ-027 publishes measured head scores (sk-code 0.8754, sk-doc 0.82). This lineage does not run the advisor, so the numbers are reported as the packet's measurement, not re-confirmed here. The code path that produces them (`explicit.ts:452`) is present.
- REQ-033's AC row is `Unmet` by design; this run is the missing rerun, and the row can only close after synthesis writes the terminal gates.
- ADR-005 rollback text names `_apply_deep_loop_offer_gate` and `servedReviewKept`, both present, so the rollback is executable as written.

## Confirmed-Clean Surfaces
- All twelve sixth-round REQs have an implementing line or a decision line except REQ-031's per-entry half and REQ-033's in-flight rerun.
- Both ADRs have a Context, Decision, Alternatives, Consequences, Five Checks and Implementation section, and each implementation step names a path that exists.
- `spec.md:245` states REQ-033's rerun requirement and `spec.md:279` states the SC-005 exception; neither contradicts the code.

## Ruled Out
- A missing REQ-025 Python alignment: the Python gate keeps every typed run row through the `typed` set it computes before the loop (`skill_advisor.py:5320`), so two typed commands cannot hide each other there either.
- A missing REQ-026 Python mirror: T070 records that the Python fallback keeps no mode-cue copy, so the deferred-route cue is a TypeScript-only surface and no drift exists.
- A REQ-034 count mismatch: the Verification Summary (12 P0 / 11 verified, 13 P1, 1 P2) matches the checklist boxes exactly, with CHK-020 the single open P0.

## Next Focus
- Dimension: traceability
- Focus area: complete `checklist_evidence` by checking every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` (AC-030 to AC-042) against evidence that exists in the tree
- Reason: `spec_code` is complete; the operator focus names the checklist half as the remaining deliverable
- Rotation status: correctness complete, security complete, traceability in progress, maintainability pending
- Required evidence: one cited path per ticked task claimed without an observed line; one cited path per Met row

Review verdict: PASS
