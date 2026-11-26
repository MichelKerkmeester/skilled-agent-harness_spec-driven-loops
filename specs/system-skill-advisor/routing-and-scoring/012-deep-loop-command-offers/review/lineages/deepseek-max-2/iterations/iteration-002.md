# Review Iteration 002

## Dispatcher

- Route: `Resolved route: mode=review target_agent=deep-review`
- Executor: `cli-pi` model `deepseek-v4.1-flash-1017`, run inline by lineage `deepseek-max-2` (generation 1, lineage mode `new`).
- Iteration 2 of 7, stop policy `max-iterations`.
- Dimension: **correctness**. Operator focus applied: no `gateClass` on protocol results, findings only on files in `review-scope-files.txt`, no `terminal_gates` row. This iteration covers the second of the four dimensions, inside the window the focus sets (correctness, security and maintainability each once within iterations 1 to 4).

## Files Reviewed

- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:227,262,675,700,713,807,923,1014,1086,1192,1213,2381,2392,2413,2445`
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:847,893,917,926,960,981,1285,1300,1595,1640,1676`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5105,5124,5283,5328,5353`
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1064,1079,1084`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json` (368 cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts` (`VOCABULARY_PAIRS`, `PATTERNS_NOT_COMPARED` regions)
- `deep-review-strategy.md` and `deep-review-findings-registry.json` produced by the reducer for iteration 1 (read to judge the reducer's own output)

## Findings - New

### P0 Findings

None.

### P1 Findings

1. **The reducer publishes `findingClass`, `scopeProof` and `affectedSurfaceHints` as null or empty for a finding whose delta row omits them, and it never reads the three fix-completeness lines the iteration narrative must carry** -- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:713` -- The registry entry for a finding is built from the delta row's `findingClass`, `scopeProof` and `affectedSurfaceHints` (`reduce-state.cjs:713`, `:717`, `:718`), under a comment that says those fields are preserved "so registry consumers do not need to re-open raw delta files for scope and surface hints" (`:715`). The narrative parser reads only title, file, line and description from a numbered finding (`:923`, `parseNumberedFindingLine`), and a run that recorded any delta row makes its whole narrative yield to the structured rows (`:1226`). So the only path those three values have into the registry is a delta row, and the delta row shape the run's own prompt pack documents carries none of them. Observed live in this lineage: iteration 1's narrative and its `findingDetails` both stated `findingClass: evidence-cell-stale`, a `scopeProof` string and one `affectedSurfaceHints` entry, and the registry entry for `R1-P2-001` holds `findingClass: null`, `scopeProof: null`, `affectedSurfaceHints: []`. The synthesis step builds the Planning Packet's `findingClasses` and `affectedSurfacesSeed` from this state, so every finding produced by a leaf that follows the documented delta shape reaches `/speckit:plan` as `UNKNOWN`.
   Finding class: `producer-consumer-gap`
   Scope proof: `reduce-state.cjs` is a review-scope file; the value loss is readable in the lineage's own reducer-owned registry, and the field names sit at the lines cited.
   Affected surface hints: `reduce-state.cjs` `parseNumberedFindingLine` and the delta-row builder; the report's Active Finding Registry columns `findingClass`, `scopeProof`, `affectedSurfaceHints`; the Planning Packet keys `findingClasses`, `affectedSurfacesSeed`.
   Case: a leaf writes the delta row the run's prompt pack documents (`{"type":"finding","id","severity","title","file","iteration"}`) and puts the three required lines in the narrative, which is what the agent contract asks for; the reducer then stores nulls, and the review report's Planning Packet reads `UNKNOWN` for that finding's class and surfaces.
   ```json
   {"type":"claim-adjudication","claim":"A finding whose delta row omits findingClass, scopeProof and affectedSurfaceHints loses them even when the narrative carries them, because the narrative parser reads none of the three and a run with delta rows skips its narrative entirely.","evidenceRefs":[".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:713",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:715",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:923",".skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:1226","deep-review-findings-registry.json#R1-P2-001"],"counterevidenceSought":"Read the reducer's narrative parser and its dedup order to see whether the narrative path or a later merge restores the fields; read the registry entry the reducer wrote for this lineage's own iteration 1.","alternativeExplanation":"The delta row is by design the only machine-readable finding surface, and the narrative is prose for a human reader, so the null is the documented contract rather than a loss.","finalSeverity":"P1","confidence":0.82,"downgradeTrigger":"Downgrade to P2 if the delta row's schema is declared the authoritative finding record and expanded to carry the three fields, because the residual defect is then a documentation gap in a file outside this review's scope."}
   ```

### P2 Findings

None this iteration.

## Traceability Checks

| Protocol | Level | Status | Evidence | Summary |
|---|---|---|---|---|
| `spec_code` | core | pass | `[SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1285]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5124]` | The three rules the newest requirements claim are implemented as claimed in both copies: the iteration count is read only inside the question's own clause (`questionClause` and `_loop_question_clause`), `then` is a clause mark (`explicitRunOutranks` and `_explicit_run_outranks`), and the prompt fold reads the five zero-width characters plus every whitespace run in both languages (`lowerFolded` and `_fold_quotes`). |
| `checklist_evidence` | core | partial | `[SOURCE: specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:66]` | Carried from iteration 1: four rows still state the older fixture count. The full ticked-task sweep is iteration 5. |

## Integration Evidence

- `reduce-state.cjs:1226` (`yieldsToStructured`) is the join between the two producer surfaces, and the prompt pack's delta example is the surface it depends on; both were read for finding 1.
- `command-attach.ts:1676` (`isNoEditRequest(prompt) && !(skillId === 'system-deep-loop' && READ_ONLY_LOOP_MODES.includes(workflowMode))`) shows REQ-040's read-only exception on the routed branch, and `:1653` shows the same exception on the stuck-run branch, so the two branches agree.
- `fusion.ts:1064` builds the doctor-naming pattern from the one `DEEP_LOOP_DOCTOR_COMMAND` export (`command-attach.ts:202`), as REQ-053 states.

## Edge Cases

- **The run's delta-row example omits the three fix-completeness fields.** `prompt-pack-iteration.md.tmpl` (outside the review scope, so recorded here rather than as a finding) documents `{"type":"finding","id","severity","title","file","iteration"}` and never names `findingClass`, `scopeProof` or `affectedSurfaceHints`, while `reduce-state.cjs:675` documents them as part of the row. Finding 1 names the reducer side; the pack side is the same gap seen from the producer.
- **This lineage's iteration 1 ran without a coverage graph.** The init seed step was skipped, and the reducer's `graphSignals` stay empty because no `graph_convergence` event exists on a `max-iterations` run. Ruled out as a defect: convergence is telemetry under this stop policy, and the orchestrator computes terminal gates after the run.
- **Exhausted-approach headings carry markdown bold.** The reducer's `splitRuledOutEntry` keeps a direction's `**` markers when the narrative writes `**X** -- reason`, so the strategy's section 10 headings read `### **X** -- RULED OUT`. Not filed: the narrative style is this lineage's own choice, and the direction text is still readable.

## Confirmed-Clean Surfaces

- `stripReviewVerdict` (`reduce-state.cjs:227`) cuts the Next Focus section at the verdict line and keeps the authored line breaks; the projection in this lineage's strategy holds all six focus lines and no verdict.
- `splitRuledOutEntry` (`reduce-state.cjs:2392`) cuts only on a spaced double hyphen or an em dash, so `--extend=N` and a kebab-case name stay whole.
- `explicitRunOutranks` (`command-attach.ts:847`) reads the ask to its end and treats a whole-word `then` as a clause mark; `isPastRunRead` and `isWritingAboutTopic` both consult it before withholding.
- The Python fold (`skill_advisor.py:5124`) spells the same five zero-width characters and the same whitespace collapse as `lowerFolded` (`command-attach.ts:917`).

## Ruled Out

- **The implicit-clause defect the question rule could have** -- ruled out: `questionClause` bounds the count with `QUESTION_CLAUSE_END` before `ITERATION_COUNT` tests it, so a count in a later clause cannot reach the test.
- **A doctor row surviving on a run-refusing stuck complaint** -- ruled out: the stuck branch returns `undefined` when `isRunRefused` holds (`command-attach.ts:1653`), and `withholdDeepLoopDoctorWithoutRun` reads the same predicate.
- **A no-edit clause withholding a read-only loop** -- ruled out on both branches by `READ_ONLY_LOOP_MODES` (`command-attach.ts:1676`).

## Next Focus

- Dimension: security
- Focus area: the trust and safety boundaries the packet's own code touches: the served command's policy, the degraded-path command vetting, and the typed-command override
- Reason: correctness produced one structural finding; security is the third of the four dimensions the focus requires before the last iteration
- Rotation status: traceability done, correctness done, security next, maintainability in iteration 4
- Blocked/productive carry-forward: `spec_code` stays productive; `checklist_evidence` still `partial`
- Required evidence: `file:line` for every boundary claim, and the input a hostile or mistaken caller could send

Review verdict: CONDITIONAL
