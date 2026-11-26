# Iteration 6 - traceability (spec_code, part 3, decisions and the remaining overlays)

## Dispatcher

- Lineage: `deepseek-max-1`, generation 10, run `fanout-deepseek-max-1-1795556727682-axtzf8`
- Dimension: traceability
- Review target: `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers`
- Operator focus addressed: this pass closes `spec_code` by mapping REQ-053 to REQ-059 to the reducer, the doctor-name export and the two hook paths, then checks every ADR the packet's waived or superseded rows name, and records the two overlays that do not apply to this change set.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:277` (REQ-053 to REQ-059)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:118` (AC-061 to AC-067)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:33` (ADR-001)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:128` (ADR-002)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:223` (ADR-003)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:317` (ADR-004)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` (ADR-006)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:603` (ADR-007)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:703` (ADR-008)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:796` (ADR-009)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202` (`DEEP_LOOP_DOCTOR_COMMAND`)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27` (the import) and `:1064` (the naming pattern)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1075` (`withholdDeepLoopDoctorWithoutRun`)
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:421` (the duplicate-command withhold)
- `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` (the brief owner check)
- `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558` (the CLI owner check)
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:89` (the ownership cases)
- `.skilled/skills/system-skill-advisor/runtime/tests/handlers/advisor-recommend-duplicate-command.vitest.ts`
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:370` (`parseIterationFile`)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:1704` (the ruled-out cases)

## Findings - New

### P0 Findings

None.

### P1 Findings

None new. Carried forward: `L1-P1-001` (a refused run ask after a loop question is read as an ask) is still active.

### P2 Findings

None new. The earlier P2s remain active; this pass confirms that two of them sit on requirement text that does not claim more than the code does:
- `L2-P2-001` is beyond REQ-058's text: the command is vetted as the requirement says, while the policy and owner passthrough is an additional hardening gap.
- `L3-P2-001` and `L1-P2-001` are both in REQ-059's projection area; the requirement says a ruled-out item's reason becomes its "Why ruled out" line, which a single entry does, and neither the code-span cut nor the grouping key is named by the requirement.

## Traceability Checks

- `spec_code` — partial (all REQ-001 to REQ-059 are now mapped; the active P1 keeps REQ-015 from passing alone). The REQ-053 to REQ-059 slice:
  - REQ-053: one declaration at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202`; the scorer imports it at `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:27` and builds `DOCTOR_NAMING_LED` from it at `:1064`; no second declaration exists under `lib` or `handlers`.
  - REQ-054: `isLoopQuestion` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1295` with `questionClause` and `ITERATION_COUNT`; the Python twin at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5338`; fixture rows `how-do-run-count-in-later-clause`, `how-can-stop-loop-count-in-later-clause` and `how-do-run-count-in-question-clause`.
  - REQ-055: `explicitRunOutranks` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:849` with the `\bthen\b` clause mark; Python at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5283`; fixture rows `past-report-then-run-review`, `past-research-then-run-research` and `past-report-and-run-notes`.
  - REQ-056: `lowerFolded` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:917` and `_fold_quotes` at `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5124` carry U+200B, U+200C, U+200D, U+2060 and U+FEFF; fixture rows `loop-wording-zero-width`, `loop-wording-byte-order-mark` and `question-zero-width-control`.
  - REQ-057: `gateCompiled` and the two accounting tests at `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:686` and `:717`; `PATTERNS_NOT_COMPARED` carries a reason per name.
  - REQ-058: `ownedCommandRecommendation` at `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` calls `trackedCommandForOwner` at `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:313`; the CLI calls the same helper at `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558`; `tests/brief-command-owner-check.vitest.ts` pins both cases.
  - REQ-059: `parseIterationFile` at `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:370` reads only `Ruled Out` and `Dead Ends`, never `Confirmed-Clean`; `splitRuledOutEntry` at `:2392` projects a reason. The unit cases at `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-state-reducer.vitest.ts:1704` and `:1734` pin both.
  - Decisions: ADR-001 (AC-019 superseded), ADR-002 (the multi-round alias kept), ADR-003 (AC-008 waived), ADR-004 (loop-as-subject), ADR-005 (typed-on-stuck), ADR-006 (bare loop name), ADR-007 (two aliases), ADR-008 (mode-free plural asks), ADR-009 (AC-020 waived) all exist at the lines named above, and each waived or superseded acceptance row names its ADR.
  - Every requirement now has a code, fixture, probe or decision pointer. The protocol remains `partial` only because REQ-015's general refusal rule is violated by `L1-P1-001`; no other requirement is unmapped.
- `checklist_evidence` — partial. AC-061 to AC-067 were read row by row and each cited symbol exists; AC-040 remains `Unmet`. The task checklist is the remaining pass.
- `skill_agent` — notApplicable (`applicable: false`). The declared change set touches no agent definition under `.skilled/agents/`, and this lineage read no agent file as a change target; the agent surface is not part of this packet.
- `agent_cross_runtime` — notApplicable (`applicable: false`). The packet changes no runtime mirror; the only mirror paths named in the scope are the compiled command contracts, which are covered by REQ-007 and AC-011, not by an agent mirror.

## Integration Evidence

- Doctor surface: `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202` is the one name both the attach layer and the scorer read; `fusion.ts` imports it rather than declaring a copy.
- Hook surface: `.skilled/skills/system-skill-advisor/runtime/lib/skill-advisor-brief.ts:184` and `.skilled/skills/system-skill-advisor/runtime/skill-advisor-cli.ts:1558` both call `trackedCommandForOwner`; the two consumers differ only in whether they keep the helper's returned policy and owner (`L2-P2-001`).
- Reducer surface: `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs` is the reducer this lineage runs; its `parseIterationFile` and `splitRuledOutEntry` are the two functions REQ-059 names.
- Decision surface: `decision-record.md` is the packet's decision record; the nine ADRs named above are the only ones the waived or superseded rows need.

## Edge Cases

- REQ-058's text claims the *command* check, not the policy or owner passthrough; the security finding is therefore recorded as hardening beyond the requirement rather than as a REQ-058 failure. Both statements can be true: the requirement passes and the code still has a P2.
- AC-067's observation that "the two new cases failed before the edit" is a historical claim; this pass reads the current tests and does not re-run them, so the claim is taken as recorded.
- The `skill_agent` and `agent_cross_runtime` overlays are `notApplicable` rather than `pass`; an absent surface is not evidence that it works.
- ADR-002's "keep or drop" record is a decision, not a code pointer; REQ-011's alias clause is checked against the two hub files, and ADR-002 is checked as the record that leaves them there.

## Confirmed-Clean Surfaces

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:202` and `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1064` -- one export, one import, one naming pattern.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1075` -- the doctor row is withheld on a refused run and on a no-edit request, and the fused row agrees with the attach row on the fixture's `doctorWithheld` cases.
- `.skilled/skills/system-skill-advisor/runtime/handlers/advisor-recommend.ts:421` -- a withheld duplicate command strips `command`, `policy`, `ownerSkillId` and `typed`, so no field of the row still offers it.
- `.skilled/skills/system-skill-advisor/runtime/tests/brief-command-owner-check.vitest.ts:89` -- the untracked-command case strips the command and the tracked case keeps it; the field-level passthrough is the uncovered half (`L2-P2-001`).
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:377` and `:381` -- `Confirmed-Clean` is not read as a ruled-out section, and `Dead Ends` is read only when the file carries one.

## Ruled Out

- "The doctor name has a second declaration": ruled out. `rg "DEEP_LOOP_DOCTOR_COMMAND" lib handlers` finds the export and its uses, not a copy.
- "ADR-009 is cited but absent": ruled out. The record exists at `decision-record.md:796` and AC-020 names it.
- "A waived row names no decision": ruled out. AC-008, AC-017, AC-020 and AC-019 each name ADR-003, ADR-002, ADR-009 and ADR-001 respectively.
- "REQ-059 still reads Confirmed-Clean": ruled out. The parser reads `Ruled Out` and `Dead Ends` only.
- "The duplicate-command guard withholds the command but leaves the policy behind": ruled out. The withheld branch destructures `command`, `policy`, `ownerSkillId` and `typed` before returning.

## Next Focus

- Dimension: traceability
- Focus area: `checklist_evidence`: read every checked task in `tasks.md` and every `Met`/`Waived`/`Superseded` row in `acceptance-criteria.md` against the evidence the row names, including the thirteenth round T115 to T121, and confirm the Verification Summary agrees with the boxes.
- Reason: `spec_code` is now fully mapped and the overlays are recorded; the remaining protocol is the checklist, and it is the one the focus says to finish.
- Rotation status: traceability pass 3 of 4 complete.
- Blocked/productive carry-forward: productive -- the tasks and acceptance files are the two surfaces left, and the citation checker already reports `problems=0`.
- Required evidence: one row-level pass over T001 to T122 and AC-001 to AC-067, plus the Verification Summary counts.
- Recovery note: none.

Review verdict: CONDITIONAL
