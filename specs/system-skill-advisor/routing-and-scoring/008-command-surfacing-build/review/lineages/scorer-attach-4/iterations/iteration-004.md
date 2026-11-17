# Review Iteration 004

## Dispatcher

- Run: `fanout-scorer-attach-4-1794669272137-9v23rz` (lineage `scorer-attach-4`, pass four, area `scorer-attach`)
- Mode: review; executor: in-process (no nested dispatch)
- Dimension: maintainability
- Review focus addressed: the operator focus asks for the checks the packet's own tests can prove. This iteration tests the changed tables as the regression fence for the four residual behaviors found in iterations 1 to 3: the coordinated refusal, the retired-alias refusal, the generic creation word and the question with the noun `command`. It also records the cost of the changed test surface and confirms the doc count reported in iteration 3. Budget profile: `verify` (11-13 calls), used 10.
- Prior state: iteration 1 three P1s, two of them downgraded in iteration 3; iteration 2 one P2; iteration 3 three P2s and two severity corrections. One active P1 remains (`SA4-P1-002`).

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1-451` (whole changed test file, including `REFUSE8`, `QUESTION2`, `REQUEST6`, `CONTROL5` and the small-edit tables)
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:382-482` (the two new scorer-gate describes)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/doctor-handoff-command.vitest.ts:139-205` (the weak-cue cases and the tune-row read)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:36-56,135-432,487-492` (the gates each table is meant to fence)
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1200-1231` (the two scorer gates)
- Packet checklist: `020-command-offer-fit-guards/tasks.md:200` (`CHK-FIX-004`), `tasks.md:89` (T017 accepted limit), `tasks.md:74-98` (task evidence)
- Executed: `vitest run --cache=false` on the six changed test files → 191 passed, exit 0 (unchanged since iteration 1; no source changed between runs).

## Findings - New

### P0 Findings

None.

### P1 Findings

None new this iteration. `SA4-P1-002` from iteration 1 remains active and keeps the verdict at CONDITIONAL.

### P2 Findings

1. **The changed test tables leave all four residual behaviors unpinned** -- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39` -- The `REFUSE8` table holds eight single-command refusals or requests and no coordinated refusal; the small-edit table holds the two exact `REQ-004` controls and the creation controls, but no correction with a generic creation word; `QUESTION2` holds two questions but not the `Is the X command` noun form. The changed tests are therefore green while the four behaviors from iterations 1 to 3 are live. [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39]
   Finding class: test_coverage_gap
   Scope proof: the test file is in the declared scope; each missing input is a prompt the changed functions already accept, and the current helper probes return the wrong result for it.
   Affected surface hints: `REFUSE8`, the small-edit `it.each`, `QUESTION2`, the phase 020 `CHK-FIX-004` evidence.
   Case: adding `['do not run /deep:review or /deep:research', '/deep:research']` to `REFUSE8` fails today because `commandOnlyMentioned` returns false; adding `fix the typo in the readme and make sure the grammar is right` to the small-edit `offers no creation command` cases fails because `attachCommand` returns `/create:readme`; adding `['Is the /doctor:update command safe?', '/doctor:update']` to `QUESTION2` fails because the bare-ask lead does not allow the noun `command`. The packet's `CHK-FIX-004` claims a "two commands" adversarial case, but the table's two-command case is the request `use /speckit:plan, not /speckit:complete` (`:181`), not a coordinated refusal.

## Traceability Checks

- `spec_code` -- partial (unchanged from iteration 3): the one active P1 is the coordinated refusal; the two accepted limits are recorded as P2s; the REQ-007 text is stale.
- `checklist_evidence` -- partial: the phase checklist's `CHK-FIX-004` overstates the two-command coverage; `AC-007` records 9 against `REQ-007`'s 10.
- `feature_catalog_code` -- partial (unchanged from iteration 3): the two stale docs are P2s.
- `skill_agent` -- notApplicable.
- `agent_cross_runtime` -- partial: no runtime branch; live proof belongs to the phase 007 arm.
- `playbook_capability` -- notApplicable.

## Integration Evidence

- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:39-56` is the `REFUSE8` table; `:181` is the two-command request; `:135-432` is the small-edit suite; `:50-53` is `QUESTION2`.
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:414` is the every-occurrence rule the coordinated refusal misses; `:331` and `:487` are the creation-word guard; `:389` is the bare-ask lead.
- `.skilled/skills/system-skill-advisor/runtime/lib/scorer/fusion.ts:1209` is the gate the doctor question row survives.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-meaning-anchor.vitest.ts:382-482` pins the two scorer gates themselves, but no case connects the mention reader to the `Is the X command` form.
- The six changed test files still report 191 passed; the gap is missing inputs, not a failing assertion.

## Edge Cases

- **A test table can be complete for its named cases and incomplete for the class.** `REFUSE8` covers eight representative refusals, but the class "coordinated refusal" has no row; the finding is about the class, not the eight.
- **The retired-alias case is a documented accepted limit.** The test file pins the mapping (`:409-411`) but not the refusal; adding the refusal case would make the accepted limit visible rather than silently green. The P2 covers it with the other three.
- **The small-edit creation word is a tradeoff, not a crash.** The gate stands down to keep genuine creation requests; the missing test would pin the tradeoff's cost. The P2 is a coverage suggestion, not a code change request.
- **The doctor question is a `P2` from iteration 2.** Its test is the least costly of the three: one row in `QUESTION2` and one row in the `withholdMentionedCommands` table.

## Confirmed-Clean Surfaces

- `command-attach-guards.vitest.ts:390-432` -- the mode-suffix and retired-name mapping cases are precise and pass; the table names the behavior that the accepted limit leaves uncovered.
- `command-attach-guards.vitest.ts:135-390` -- the small-edit suite covers the two exact controls, the creation controls, the exempt commands, the repo-rule/benchmark controls and the out-of-namespace deep-loop case; the only missing class is the generic creation word.
- `command-meaning-anchor.vitest.ts:382-482` -- the two scorer gates have both positive and negative cases, including the read-only survivor and the typed-and-asked exception.
- `doctor-handoff-command.vitest.ts:139-205` -- the weak-cue cases cover both app problems and two toolkit positives; the corpus read selects a tune id and asserts the split.
- All six changed test files: 191 passed, 0 failed.

## Ruled Out

- **The test suite is failing and the gaps are visible as red.** Ruled out: 191 passed; the gaps are missing inputs.
- **The `REFUSE8` table's name is the defect.** Ruled out: the name encodes eight rows but the table is data-driven; the missing class, not the name, is the finding.
- **The small-edit suite's creation controls already cover the generic words.** Ruled out: the controls use `write a readme` and `create a readme ... check it for typos`, where the creation verb is the sentence's verb; the missing cases use `make sure` and `new` as modifiers.
- **The doctor question is covered by the direct `what does` case.** Ruled out: the direct case passes and withholds the row; the noun form does not.

## Next Focus

- Dimension: none remaining; synthesis
- Focus area: the compiled review report, the planning packet and the final verdict.
- Reason: all four dimensions are covered; one active P1 and six P2s are recorded.
- Rotation status: correctness, security, traceability and maintainability complete (CONDITIONAL).
- Blocked/productive carry-forward: no blocked approach; the four iteration trail is complete.
- Required evidence: the registry's active counts, the iteration final lines and the synthesis report.

Review verdict: CONDITIONAL
