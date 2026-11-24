# Review Iteration 004

## Dispatcher

- Mode: review, target agent `deep-review`, single review iteration, lineage `deepseek-max-2`.
- Dimension: traceability, protocol `checklist_evidence` on the acceptance table.
- Operator focus: every `Met` row against evidence that really exists, with the sixth fix round (AC-030 to AC-042, ADR-005, ADR-006) read row by row.

## Files Reviewed

- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:58` (AC-001 to AC-005)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:65` (AC-008, waived)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:84` (AC-027)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:91` (AC-034)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:87` (AC-030 to AC-039)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:97` (AC-040)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/acceptance-criteria.md:99` (AC-042)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:412` (ADR-005)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/decision-record.md:508` (ADR-006)
- `.skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:214` (`servedReviewKept` read through `attachTypedCommand`)
- `.skilled/skills/system-skill-advisor/runtime/tests/scorer/stage-one-loop-subject.vitest.ts:26` (AC-034's test)
- `.skilled/skills/system-skill-advisor/runtime/tests/subprocess-typed-fields.vitest.ts:88` (AC-035's test)
- `.skilled/skills/system-skill-advisor/runtime/tests/cli-degraded-command-contract.vitest.ts:81` (typed row) and `:152` (tracked command)
- `.skilled/skills/system-skill-advisor/runtime/tests/python/test_skill_advisor.py:2854` (`test_deep_loop_offer_gate_parity`) and `:3001` (`test_deep_loop_typed_run_row_marked`)
- `.skilled/skills/system-skill-advisor/runtime/tests/typed-on-stuck-serving.vitest.ts:112` and `:153`
- `.skilled/skills/system-skill-advisor/runtime/tests/command-attach-guards.vitest.ts:1125` and `:1151`
- `.skilled/skills/system-skill-advisor/runtime/scripts/skill_advisor.py:5181` (`_LEAD_WINDOW`) and `:5321` (`_loop_ask_cues`)
- `.skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748` (`LEAD_WINDOW`)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/fresh-review-hook.txt:20` (the one recorded head of the REQ-027 prompt)
- `specs/system-skill-advisor/routing-and-scoring/012-deep-loop-command-offers/scratch/probes/` (search for the REQ-027 head scores)

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **AC-034's CLI head scores have no artifact, and the one recorded head shows the pre-fix result** -- acceptance-criteria.md:91 -- AC-034 is `Met` and its cell states that "Through the advisor CLI the first prompt returns only `sk-code` at 0.8754 and `sk-doc` at 0.82 ... and the hub is not among them". The row's Evidence tail points at the stage-one unit test, which proves the lane rule, not the served head. The figures appear in no probe or behaviour artifact: a search over `scratch/` finds `0.8763` in four probe files but `0.8754` only in `spec.md` and the acceptance row. The single recorded run of that prompt, `fresh-review-hook.txt:20`, reads "use system-deep-loop 0.84/0.16 pass", which is the pre-fix head the fix was made to remove. A closure reader therefore cannot confirm the served half of a `Met` row from the tree; the lane half is pinned, the head half is prose.
   - Finding class: instance-only evidence gap
   - Scope proof: the row, the test it cites and every probe artifact that could carry the score are inside the declared target
   - Affected surface hints: AC-034 and REQ-027's parenthetical measurement; any later closure pass that re-checks the served head
   - Case: a closure pass tries to confirm AC-034's served result by opening a recorded advisor run; the only run of that prompt predates the fix and reports the hub at 0.84, and no artifact records the 0.8754 / 0.82 head the row asserts.

## Traceability Checks

- `checklist_evidence` (core, pass with advisories). Every acceptance row was read; the 56 `Evidence:` tails were resolved in iteration 2 (55 resolve, AC-040's does not) and this pass checked the prose claims the tails do not cover:
  - AC-030's twelve `refusal-verb-*` rows with seven false and five true: confirmed by counting the fixture.
  - AC-031's 47 `doctorWithheld` rows with 27 true and 20 false: confirmed.
  - AC-032's four `typedRunsKept` rows: confirmed, and `typedCommandIn` still answers its longest key.
  - AC-033's two deferred-route guard cases and their subject controls: both titles exist at the cited lines.
  - AC-035's three test titles exist in `subprocess-typed-fields.vitest.ts`, `command-brief-golden.vitest.ts` and `cli-degraded-command-contract.vitest.ts`.
  - AC-036's serving and handler tests exist, and the fixture's `typed-stuck` row carries `typedReviewKept: false` with `servedReviewKept: true`, which is what ADR-005 records.
  - AC-037's `DEEP-LOOP-LONG` case exists; both copies read `LEAD_WINDOW = 400` [SOURCE: .skilled/skills/system-skill-advisor/runtime/lib/command-attach.ts:748].
  - AC-038's 22 `VOCABULARY_PAIRS` with twelve per-entry lists and the two `NUMERIC_PAIRS`: confirmed.
  - AC-039's `refinesSameLocation` and its unit test: confirmed.
  - AC-041's closure-doc citations resolve, apart from the two task-level counts recorded in iteration 3.
  - AC-042's numbers are a recorded run; its artifact references (`implementation-summary.md` rows, `results-final-958fa81-worktree.json`) exist.
- ADR-005's claimed mechanism is what the suite implements: the fixture column is read through `attachTypedCommand` on the served head [SOURCE: .skilled/skills/system-skill-advisor/runtime/tests/deep-loop-offer-cases.vitest.ts:226].
- ADR-006's claim that a bare loop name is not an ask holds in the fixture (`bare-loop-name` reads false) and in the gate's lead requirement.

## Integration Evidence

The sixth-round claims run through the shared fixture, its two suite readers, the serving tests and the Python parity test; each named title was opened at its line. The first-round and seventh-to-tenth-round claims were read through their cited artifacts.

## Edge Cases

- AC-012's "35 rows that existed before" cannot be recomputed from the baseline artifact, which stores aggregate counts and per-row top/offered flags but no per-row false-offer flag; the aggregate (0 false offers, 1 attached) is consistent with the one attached row being a post-packet row, and T047 says so, so the claim is recorded rather than challenged.
- AC-019 is `Superseded`; its stale count is read through ADR-001's replacement, as in iteration 2.
- AC-008 and AC-017 are `Waived`, and each names an ADR that exists; a waived row is not evidence-checked for the behaviour it declines.

## Confirmed-Clean Surfaces

- 52 of 56 rows are `Met` and their cited tails resolve, apart from AC-040's archived path.
- Every test title the sixth-round rows cite exists at the line the row names.
- ADR-005 and ADR-006 both describe the built behaviour.

## Ruled Out

- "The sixth-round acceptance rows cite test titles that do not exist": ruled out for all eight checked.
- "ADR-005's served column is asserted only in Python": ruled out; the TypeScript suite reads `servedReviewKept` through `attachTypedCommand`.
- "AC-037 reads a different prompt head on each side": ruled out; both constants are 400, and the numeric pair is compared.

## Next Focus

- Dimension: security, reading the same traceability evidence for the trust and policy claims.
- Focus area: `NFR-S01` and `NFR-S02`, the refusal and no-edit rules, the doctor hand-off, and the typed-command boundaries, each against the code and the fixture.
- Reason: the acceptance table is audited; the security claims are the next dimension with real evidence to check.
- Required evidence: the policy table and each guard's code path.

Review verdict: PASS
