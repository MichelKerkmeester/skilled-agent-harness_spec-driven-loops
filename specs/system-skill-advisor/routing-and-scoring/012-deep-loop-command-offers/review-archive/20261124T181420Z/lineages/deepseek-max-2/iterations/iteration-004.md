# Iteration 4 - Traceability: checklist_evidence across tasks.md and the Met rows

## Dimension

Traceability, `checklist_evidence` protocol: every ticked task in `tasks.md` and every `Met` row in `acceptance-criteria.md` against evidence that exists in the tree. The operator focus is the whole of this iteration.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/tasks.md:100-316` (all 123 task boxes and the checklist rows)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:56-105` (47 criteria rows)
- `.skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:120-290`
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:74-313`
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:152-178`
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854`
- `.skilled/commands/deep/review.md:80`, `.skilled/commands/deep/research.md:85` (step 0 of both command documents)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/` and `scratch/behaviour/` (the packet artifacts the cells cite)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

None new. The one drift this protocol would raise - AC-041's line anchors - is already filed as R2-P2-001 and is not re-filed here.

## Traceability Checks

| Protocol | Status | Evidence |
|----------|--------|----------|
| `spec_code` | pass | Recorded in iteration 2 and unchanged |
| `checklist_evidence` | pass | 120 ticked boxes, each with a citation or an explicit N/A rationale; 47 criteria rows with 43 Met and the four returned rows backed |

- Task boxes: 123 total, 120 ticked and 3 open. The open ones are T084 (`tasks.md:166`, the rerun this lineage is performing), CHK-020 (`:253`, all criteria met) and the roll-up box at `:193`. Every ticked box carries either a resolved citation, a `$ADV`-relative test or command, an `Observed` clause, or an explicit N/A rationale (CHK-FIX-006, CHK-032).
- Citation resolution: 49 unique `path:line` citations across the four packet docs name a file that exists and a line inside it; none is past the end of its file and none names a missing file.
- Spot checks on the eighth-round rows: the plural run rows open at `deep-loop-offer-cases.json:253` (`plural-deep-reviews-use-verb`), the symptomatic plural at `:261`, the `how do` question at `:266`, the run-after-question at `:271`, the effort complaint at `:273` and its control at `:286`; the drift pair 12 sits at `deep-loop-offer-cases.vitest.ts:83`, the numeric assertion at `:313`, and the five per-entry cases at `:247`, `:255`, `:262`, `:271`, `:293`; `cli-degraded-command-contract.vitest.ts:152` keeps a tracked command and `:178` drops the untrusted ones; the Python parity reader is at `test_skill_advisor.py:2854`.
- Criterion rows: 47 rows, 43 `Met`, 2 `Waived` (AC-008 with ADR-003, AC-017 with ADR-002), 1 `Superseded` (AC-019 with ADR-001) and 1 `Unmet` (AC-040, the rerun). Each returned row names an ADR that exists in `decision-record.md`.
- Packet artifacts: every cited scratch artifact exists - `results-after.json`, `results-final-958fa81-worktree.json`, `results-spec-baseline.json`, `results-ac017-ood.json`, `fresh-review-hook.txt`, `F6.md`, `F6-plan-mode.md`, `F6-other-prompt.md`, `F6-sample-1.md`.
- T052, the one ticked box that cites no `Observed` clause, was opened: both step 0 sections name the three offer options in the same question as the Gate 3 folder, mark A recommended, and send a composed flag into option A (`review.md:80`, `research.md:85`).
- CHK-001's REQ count holds: `spec.md` carries 39 `| REQ-` rows.
- Evidence: `[SOURCE: .skilled/commands/deep/review.md:80]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/fixtures/deep-loop-offer-cases.json:253]`, `[SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:83]`

## Integration Evidence

- `tasks.md` is the document the packet's Verification Summary counts against; its 120 ticked boxes and the checklist rows behind them are what CHK-020's open state depends on, and CHK-020 is the only open P0 item.

## Edge Cases

- Rows headed "Sixth round", "Seventh round" and "Eighth round" quote their round's own counts; they were read as round-scoped records, not as current claims, so the 203/248 fixture history is not counted as staleness.
- Three ticked boxes carry no citation: two are explicit N/A rows whose rationale is the evidence itself, and T052 cites files without backticks, which the citation resolver cannot see; all three were read.
- AC-019's ids (N7/N9/D1/V7/H6/A3) do not name the corpus rows (`nm-*`); ADR-001 supersedes the row, so the mismatch is recorded rather than re-filed.
- The 69-probe and suite results quoted in the `Observed` clauses cannot be re-run from this lineage without writing outside its surface; they were accepted as packet evidence, and the independent list-parity and gate-behaviour checks in iterations 1 and 2 corroborate the parts that can be checked offline.

## Confirmed-Clean Surfaces

- Every `Met` row's evidence cell names either a resolved `path:line`, an existing packet artifact or a named ADR.
- Every open box is open for a reason stated in its own row, and none is stale: T084 is this run, CHK-020 is AC-040, and the roll-up follows them.
- The Verification Summary agrees with the boxes behind it: 12 P0 with one open, 13 P1, 1 P2.

## Ruled Out

- A ticked task with no evidence at all: the three citation-free boxes each carry a rationale or a readable claim.
- A `Met` row whose evidence artifact is missing: all nine cited scratch artifacts exist.
- A criteria row whose waiver ADR is absent: all four returned rows name a present ADR.

## Next Focus

- Dimension: maintainability
- Focus area: comment truth, two-copy parity cost, fixture maintenance and the reducer's refinement fold
- Reason: both core protocols are finished, so the remaining canonical dimension comes next, before the closeout passes
- Rotation status: correctness, traceability (both protocols) and security covered; maintainability is the last canonical dimension
- Blocked/productive carry-forward: citation opening stays PRODUCTIVE; nothing is blocked
- Required evidence: file:line for each maintainability claim, with the test or fixture that pins it
- Recovery note: none

Review verdict: PASS
