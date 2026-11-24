# Review Iteration 006

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Dimension: maintainability.
- Operator focus: the closure documents' clarity and the last two traceability records (REQ-047, REQ-048, AC-055, AC-056).

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:195` (declared change set)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:271` (REQ-047, REQ-048)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:112` (AC-055, AC-056)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/review/lineages/deepseek-max-2/deep-review-strategy.md:10` (section numbering after five reducer passes)
- `.skilled/skills/system-deep-loop/runtime/tests/fixtures/deep-loop-offer-cases.json:323` (`plural-deep-loops-served`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:1648` (`routedLoopMode`)
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5321` (`_loop_ask_cues`)
- `.skilled/skills/system-deep-loop/runtime/scripts/reduce-state.cjs:2437` (`authoredHeading`)
- `.skilled/skills/system-deep-loop/runtime/tests/unit/deep-review-strategy-numbering.vitest.ts:80`

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **The declared change set stops at REQ-046 while its rows serve REQ-047 and REQ-048** -- spec.md:195 -- The scope section heading reads "Added by the seventh to tenth rounds (REQ-035 to REQ-046)", but the table under it carries "mode-free asks served without a run row in both copies" and "the machine sections keep the template's numbers", which are REQ-047 and REQ-048. A reader sizing the change from the heading misses two requirements the same table was extended to cover, and a reader tracing REQ-047 back from the requirement table has no scope heading that names it.
   - Finding class: instance-only scope-record drift
   - Scope proof: the heading and both requirements are in `spec.md` inside the declared target; the two rows that serve them are in the same table
   - Affected surface hints: REQ-047/REQ-048 traceability; any later reader who indexes the scope by requirement id
   - Case: a reader who lists the requirements a round touched takes the heading's range at face value and omits REQ-047 and REQ-048, though the rows for both sit directly below it.

## Traceability Checks

- `spec_code` (core, partial). REQ-047 holds: `run-deep-loop`, `plural-deep-loops`, `plural-deep-loops-served` and `two-mode-ask-mode` read `servedRun: "none"`, and `askedLoopMode` returns undefined when the ask names both modes or neither [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:323]. REQ-048 holds: `replaceAnchorSection` keeps the number the file already gives a section through `authoredHeading`, and the strategy this lineage has rewritten five times still numbers every section once.
- `checklist_evidence` (core, pass, carried). AC-055's four `servedRun: "none"` rows and AC-056's numbering test were re-opened here; both hold.
- Maintainability read: the dual TypeScript and Python gate is a deliberate cost, guarded by the 22 compared pairs and the per-entry fixture cases; the closure documents are the weaker surface, and two records apart from this finding remain stale (the task counts in R3-P2-001 and the AC-034 figures in R4-P2-001).

## Integration Evidence

The reducer's own output is the evidence for REQ-048: this lineage's strategy file has been rewritten by the reducer after every iteration and still carries sections 1 to 16, with 10A, each once. The mode-free rows are read by both suites through the shared fixture.

## Edge Cases

- The strategy this review writes is itself a reducer input; a numbering defect would surface as a duplicate heading in `deep-review-strategy.md`, and none appears.
- AC-056 says "the four machine sections keep the template's numbers" without naming them; the check is the absence of a duplicate number, which is what the test pins.

## Confirmed-Clean Surfaces

- Strategy numbering after five reducer passes: every section number appears once.
- Mode-free asks: four fixture rows and both gate copies agree.
- The compared vocabulary pairs: 22, with twelve per-entry lists.

## Ruled Out

- "REQ-047 has no fixture evidence": ruled out; four rows read `servedRun: "none"`.
- "The reducer renumbers a template-derived strategy": ruled out on this lineage's own file and by the numbering test.
- "The closure documents drifted beyond the two task counts": ruled out; the acceptance tails resolve apart from AC-040's archived report.

## Next Focus

- Dimension: traceability, to close the last core protocol.
- Focus area: the whole requirement table read once more against the code and decisions, then the core protocols recorded as finished with file:line evidence.
- Reason: the run reaches its iteration cap next, and `spec_code` must finish where the operator asked it to.
- Required evidence: the requirement-by-requirement audit of iterations 2 and 4, restated with the line each requirement rests on.

Review verdict: PASS
