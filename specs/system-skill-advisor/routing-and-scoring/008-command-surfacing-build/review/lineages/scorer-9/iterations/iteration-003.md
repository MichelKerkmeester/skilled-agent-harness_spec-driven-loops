# Review Iteration 003 - traceability

## Dispatcher

- Lineage: `scorer-9` (pass nine, area `scorer`), detached fan-out lineage.
- Review target: `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build` (spec-folder).
- Scope: the three `scorer` files, read against phase `038-alignment-p1-remediation` as the owning spec.
- Review focus addressed: the brief's area label put the guarded-write verdict, `SELF_AUTO` and `MODE_SUFFIX` in scope; this iteration maps each of those changed behaviors to the requirement that owns it, which is the traceability reading of the operator focus. The holdout rule held: only spec/AC text and the reviewed code were read.

## Files Reviewed

- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` - `MODE_SUFFIX` chain.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1363` - `SELF_AUTO`.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:1507` - guarded write predicate.
- `.skilled/skills/system-skill-advisor/runtime/tests/command-transcript-score.vitest.ts:1530` - the new self-auto case, and `:1539` the chained-suffix case.
- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/README.md:135` - the documented contract.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/spec.md:112` - the Files to Change row for this file.
- `specs/system-skill-advisor/routing-and-scoring/008-command-surfacing-build/038-alignment-p1-remediation/acceptance-criteria.md:55` - AC-002 and AC-003 at `:56`.

## Findings - New

### P0 Findings

None.

### P1 Findings

None.

### P2 Findings

1. **Two behavior changes in the scorer have no requirement or acceptance criterion of their own** -- `.skilled/skills/system-skill-advisor/runtime/scripts/routing-accuracy/score-command-transcripts.mjs:613` -- the phase's Files to Change table describes this file as "Guarded write judged against the checkout" (`spec.md:112`), and REQ-002 (`spec.md:128`) covers the guarded write alone. The diff also widens `MODE_SUFFIX` to a chained mode and `:with-*` chain (`:613`) and re-anchors `SELF_AUTO` so `:auto:with-*` counts as the run's own mode (`:1363`), and both are pinned only by tests (`command-transcript-score.vitest.ts:1539` and `:1530`). REQ-003 (`spec.md:134`) and AC-003 (`acceptance-criteria.md:56`) name `typedCommandIn` in `command-attach.ts`, not this file. The self-auto widening can raise the `unsafe` count on its own, which is the count REQ-005 asks to restate per moved row, so the packet's closure evidence does not say whether that move was intended.
   Finding class: `traceability` (a behavior change without an owning requirement or criterion).
   Scope proof: the Files to Change row, REQ-002/REQ-003 and AC-002/AC-003 were read at HEAD; the two changed patterns and the two tests that pin them were read at `05f776202e0`.
   Affected surface hints: packet closure evidence, `unsafe` restatement rows, the `startShapes`/`startRate` contract in the README row.
   Case: a stored run that speaks `speckit:complete:auto:with-research` scores `unsafe` true after this branch, and no requirement or AC row names that change, so a reviewer closing the packet cannot tell whether the moved unsafe count was intended.

## Traceability Checks

- `spec_code` - status `partial`, gateClass `advisory`. REQ-002 is implemented exactly: `startState` passes the run's checkout to the guard (`score-command-transcripts.mjs:1507`) and the guard bounds the write by that checkout (`:1519-1529`); the spec's three edge cases hold (probed in iterations 1 and 2). The partial is the unowned second and third changes above, not a mismatch in REQ-002.
- `checklist_evidence` - status `pass`, gateClass `hard`. AC-002 names the arena cases and the real-folder case, and those cases exist and assert the claimed outcomes at `command-transcript-score.vitest.ts:1491-1528`; AC-003 names the `command-attach-guards.vitest.ts` suffix cases, which belong to the `attach-config` area. The suite was not executed inside this lineage (its write rules forbid repo tooling), so the result records what was read, not a test run.
- Overlay protocols: `skill_agent`, `agent_cross_runtime`, `feature_catalog_code` and `playbook_capability` are not applicable - no agent definition, catalog row or playbook claim names this script.

## Integration Evidence

- The owning spec phase is `038-alignment-p1-remediation`; its In Scope bullet "The command matcher reads a chain of the advertised mode suffixes and `:with-*` modifiers" is the nearest claim to the scorer's suffix change, and it is assigned in the file table to `command-attach.ts` (`spec.md:111-112`).
- `SC-002` asks `scratch/unsafe-rows.txt` to list exactly the runs whose unsafe count moved; the file's rows are all checkout-boundary moves, and no row records a self-auto move (read).
- The README row (`:135`) documents the guarded write rule that REQ-002 owns; it does not name the suffix chain, so the documented contract and the owning requirement agree.

## Edge Cases

- AC-002's fourth case ("a write into a real folder outside the arena") is present as an `it.each` with three shapes (`:1491-1528`), so the criterion's wording is matched by more than one case.
- No `checklist.md` exists in the packet root, so `checklist_evidence` is read from `acceptance-criteria.md`, the packet's closure gate.

## Confirmed-Clean Surfaces

- REQ-002's implementation, test and spec text agree on the boundary: checkout writes count, scratch notes outside it do not.
- The `attach-config` area's suffix chain (`command-attach.ts:211`) uses the same seven-word vocabulary, so the advertised words are consistent across the two modules even though only one is named by REQ-003.
- The README row's guarded-write sentence matches the code's rule, including the `..` and home-path clauses.

## Ruled Out

- A missing requirement for the guarded write: REQ-002 and AC-002 both own it, so no finding.
- A README contradiction: the row describes the guard as implemented, so no finding.
- A wrong `typedCommandIn` claim in this area: that file is out of this lineage's scope and its AC is owned by `attach-config`.

## Next Focus

- Dimension: maintainability
- Focus: the duplicated suffix vocabulary and the test coverage of the spec's max-input edge case.
- Reason: traceability covered; maintainability is the last remaining dimension.
- Rotation status: D1-D3 complete, D4 next.
- Required evidence: one read of both patterns side by side and one read of the suffix tests.
- Blocked/productive carry-forward: three active P2s are carried to synthesis; do not re-report them.

Review verdict: PASS
