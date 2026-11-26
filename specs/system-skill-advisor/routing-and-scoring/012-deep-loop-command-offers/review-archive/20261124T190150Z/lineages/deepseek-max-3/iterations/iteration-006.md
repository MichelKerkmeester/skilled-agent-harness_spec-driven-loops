# Review Iteration 006

## Dispatcher

- Mode: review
- Dimension: maintainability (operator focus carried alongside)
- Iteration: 6 of 7
- Focus this pass: duplication between the two gate copies, the exported word lists and their guard, and the maintenance cost the closure docs impose on every further round
- Executor: this lineage process (cli-pi, deepseek-v4.1-flash-1017); no nested dispatch

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:369-460`, `:688-1055`, `:1336-1400`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5165-5220`, `:5442-5480`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:80-120`, `:246-370`
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:1-2`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:140-200`
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84-95`

## Findings

New findings this pass. The operator focus is addressed by measuring whether the traceability evidence the review found stale has a maintenance cause that a future round can prevent.

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Nothing fails when REQ-031's documented counts drift from the guard, which is how the drift survived the ninth round** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/spec.md:243` -- The guard asserts that every entry of `VOCABULARY_PAIRS` matches its Python tuple and that ten lists carry a per-entry case (`tests/deep-loop-offer-cases.vitest.ts:448-460`), but no test reads the counts REQ-031 states ("fifteen compared lists", "ten lists", "eighteen" refusal leads). The counts and the array can therefore diverge silently in either direction, which is what happened: the tree holds 22 pairs and 16 refusal leads while the requirement still names 15 and 18. A one-line assertion that reads the REQ line, or a doc cell generated from `VOCABULARY_PAIRS.length`, would have failed the ninth round's commit.
   - Finding class: `maintainability-gap`
   - Scope proof: `spec.md` and the guard are both named scope files.
   - Affected surface hints: `spec.md` REQ-031, `tests/deep-loop-offer-cases.vitest.ts`, `lib/command-attach.ts`, `scripts/skill_advisor.py`
   - Case: A round adds three lists and leaves the requirement's counts alone; the guard stays green, and the next reviewer files the same drift finding again.

2. **Closure evidence is cited by line number, so every code insertion above a cited symbol invalidates a Met or ticked cell** -- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:184` -- Nine cells across `acceptance-criteria.md` and `tasks.md` name a line that no longer holds the symbol they claim (iterations 1 to 3), and T092/T101 both claim every cell was refreshed. Two mechanisms make this recurrent: the docs cite offsets, and each fix round inserts lines above them (`RUN_ASK_REFUSAL_LEADS` moved from `:581` to `:688` while the requirement list itself grew). Citing the symbol name beside the line, or a test name, would survive the next insertion; a check that each cell's line still contains the named token would catch it at commit time.
   - Finding class: `maintainability-gap`
   - Scope proof: the closure docs and the cited code are all inside the packet's scope.
   - Affected surface hints: `acceptance-criteria.md` AC-033 to AC-038, `tasks.md` T066/T067/T074/T076/T081/T087/T092/T101
   - Case: A later round inserts a word list above `RUN_REFUSED`; every cell that cites its old line now points at unrelated code and no gate notices.

## Traceability Checks

| Protocol | Status | Evidence | Note |
|----------|--------|----------|------|
| `spec_code` | partial | `spec.md:243`, `spec.md:247` | REQ-031's drift now has a maintenance cause; REQ-035's mode-free clause remains open. |
| `checklist_evidence` | partial | `tasks.md:184`, `acceptance-criteria.md:93` | Citation drift carried from iterations 1 to 3. |
| `skill_agent` | notApplicable | - | Not in this pass. |
| `agent_cross_runtime` | notApplicable | - | Not in this pass. |

## Integration Evidence

- The drift guard reads the Python lists out of the source text rather than importing them (`tests/deep-loop-offer-cases.vitest.ts:80-120`, `:448`), so a renamed list fails rather than comparing empty -- a maintainability strength worth keeping.
- `VOCABULARY_PAIRS` and `NUMERIC_PAIRS` (`deep-loop-offer-cases.vitest.ts:80`, `:109`) are the only machine-checked coupling between the two copies; `NAMED_LOOP_MODE` is compared by `PATTERN_PAIRS` (`:435-445`).
- Comment hygiene is clean: no `REQ-`, `ADR-` or spec-path label appears in a comment in `command-attach.ts`, `explicit.ts`, `fusion.ts`, `skill-advisor-cli.ts`, `subprocess.ts`, `advisor-recommend.ts` or `reduce-state.cjs`.

## Edge Cases

- The Python list tuples are read from source rather than imported, so a syntactically valid but semantically duplicated entry would pass the compare. No such case exists today.
- A generated doc cell would remove one drift class but add a codegen step to the packet; recorded as an option, not required.
- Historical per-round numbers in `implementation-summary.md` are expected to differ from the final tree and are not defects; only rows claiming the final tree are.

## Confirmed-Clean Surfaces

- `command-attach.ts` exports every vocabulary list that builds a pattern (`:369`, `:450`, `:494`, `:508`, `:581`, `:688`, `:802`, `:918`, `:970`, `:981`, `:1032`, `:1133`, `:1197`, `:1336`), so the drift guard has a stable surface to read.
- The sentinel comments above `LOOP_NAMES`, `DEFECT_CHECK`, `RUN_REFUSED` and the stage-one rule state the durable why, not a round or requirement label.
- The strategy/dashboard/report files are reducer-owned, so iteration artifacts do not hand-maintain them.

## Ruled Out

- "The two gate copies have drifted on a vocabulary list": ruled out on the lists the guard compares; a scratch edit to one copy fails the guard by design (`tests/deep-loop-offer-cases.vitest.ts:448-460`).
- "A code comment carries an ephemeral label": ruled out by a search of the changed modules for `REQ-`, `ADR-` and `specs/` in comment lines.

## Next Focus

- Dimension: traceability
- Focus area: close the run's core protocols honestly -- re-read the open P1 evidence, record the terminal traceability status, and prepare the synthesis inputs (registry, terminal gates, verdict)
- Reason: seven iterations are nearly spent; the last pass belongs to the operator's named focus and to an honest terminal record
- Rotation status: final pass
- Blocked/productive carry-forward: productive (symbol-plus-doc reading); blocked directions are the accepted ADR waivers, which are not retried
- Required evidence: every active finding's file:line re-read once, and the terminal gate rows

Review verdict: CONDITIONAL
