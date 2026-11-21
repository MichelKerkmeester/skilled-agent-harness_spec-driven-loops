# Iteration 009 - Frontier node F-1-001: traceability and maintainability

## Dispatcher

- Lineage: opus-medium, session fanout-opus-medium-1795192401900-xpt66n
- Node: F-1-001 (engine), dimensions traceability (registry next) and maintainability. Both are reviewed here because maintainability is the one dimension no iteration has covered and the depth-1 budget has four iterations left for four nodes; each dimension got its own pass below.
- Review focus addressed: traced phase 006 REQ-001 to REQ-008 to code and tests, checked the remediation commit 3aab896957e for comment hygiene and maintainability, and looked for the test that should have caught R5-P1-001.
- Sources: steer.md absent; strategy; registry frontier (F-1-001 next traceability).

## Files Reviewed

- `specs/system-skilled-doctor/007-overlay-framework-root-layout/006-review-remediation/spec.md:128-140` (REQ-001..REQ-008)
- `git show 3aab896957e` (engine +214 lines, follow-up and strict-writes tests); grep of its added comment lines for ephemeral ids
- `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:817-877` (.git sibling test, hook GIT_DIR test, repository-boundary test)
- `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1171-1227` (relayoutWithFailingRename helper and its two uses)
- `.skilled/commands/doctor/scripts/overlay-engine.cjs:170-177` (relativeKey), `.skilled/commands/doctor/scripts/overlay-engine.cjs:4652` (writeBackup), `.skilled/commands/doctor/scripts/overlay-engine.cjs:6420-6559` (rollbackRelayout, relayoutUnderLock)

## Findings by Severity

### P0 Findings

None.

### P1 Findings

None new. R5-P1-001 stays active; finding 1 below names the test gap that let it through.

### P2 Findings

1. **The one test that runs the engine under a hook's GIT_DIR checks status's repository test, never pre-commit's ownership check** -- .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858 -- "a sibling overlay folder inside the repository is kept when GIT_DIR comes from a hook" sets GIT_DIR exactly as git does for a hook and even asserts the consequence that breaks pre-commit, that `git rev-parse --show-toplevel` reports the tree as the top level (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:863-865`). It then runs only `status` (`.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:868`). No test runs `pre-commit` with GIT_DIR set, so the suite stays green while that command prints allow for an unowned staged change (R5-P1-001, reproduced at iteration 5).
   - Finding class: test-gap (refines R5-P1-001)
   - Scope proof: grep for GIT_DIR in the doctor tests finds only `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:856-872`.
   - Affected surface hints: overlay-engine-strict-writes.test.cjs hook-environment test; a pre-commit case beside it with a staged unowned edit.
   - Case: copy the test at `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:858`, stage an unowned vendored edit and run pre-commit with the same env; it exits 0 with allow, and no existing test fails.

## Traceability Pass

- REQ-001 (relayout restore on mid-loop failure): code `.skilled/commands/doctor/scripts/overlay-engine.cjs:6512-6549`, tests `.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1196, 1212` and the relink case; pass.
- REQ-002 (outside-repository sibling refused at context build): code `.skilled/commands/doctor/scripts/overlay-engine.cjs:466-474`, tests `.skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:786, 806, 817`; pass.
- REQ-003 (tree in no repository keeps its sibling): code `.skilled/commands/doctor/scripts/overlay-engine.cjs:469-470`; pass.
- REQ-004 (LAYOUT overflow split): code `.skilled/commands/doctor/scripts/overlay-engine.cjs:3698-3708`; pass (iteration 2).
- REQ-005 (remove-list strict-write remedy): code `.skilled/commands/doctor/scripts/overlay-engine.cjs:5605-5614`; pass (iteration 8).
- REQ-006 (both LAYOUT remedies in both docs): pass, with the generic next-step rows still unexcepted (R2-P2-001).
- REQ-007 (layoutMoves, overlayOutside, writeBackup read as the code behaves): pass.
- REQ-008 (002 pointers, 005 AC rows, 004 close-out): pass for 002 and 005 (iteration 4).
- Comment hygiene: no added comment line in 3aab896957e carries a finding id, REQ or task id, phase number or spec path.

## Maintainability Pass

- rollbackRelayout keeps undo order (links, manifest, moves, created folders) in one function with one `attempt` wrapper (`.skilled/commands/doctor/scripts/overlay-engine.cjs:6420-6444`); the done record names each step it can undo. Clear and cheap to extend.
- relayoutWithFailingRename (`.skilled/commands/doctor/scripts/tests/overlay-engine-follow-up.test.cjs:1178-1191`) is the right seam for the missing restore-failed test (R1-P2-002): it already counts rename calls.
- The three Barter hooks each carry their own overlaysRootFor; phase 007 records why (bash, CommonJS and ESM with no shared module). Not raised.

## Traceability Checks

- spec_code: pass for REQ-001..REQ-008 as listed.
- checklist_evidence: partial. The test suite backs every REQ, but the hook-environment coverage stops at status (finding 1).

## Edge Cases

- `.skilled/commands/doctor/scripts/overlay-engine.cjs:4652` calls relativeKey only for its throw on an escaping path and discards the value. It predates the remediation (a context line in 3aab896957e) and has no comment saying so; noted, not raised.

## Confirmed-Clean Surfaces

- Comment hygiene of the remediation diff; rollback structure; REQ coverage.

## Ruled Out

- Ephemeral ids in the remediation's code comments: none found.

## Next Focus

- Dimension: traceability
- Focus area: frontier node F-1-003 (docs), with maintainability in the same pass
- Reason: registry rotation; close each node's remaining dimensions inside the depth-1 budget
- Rotation status: F-1-001 all four dimensions done
- Required evidence: doc pointers (file:line) in overlays.md and the presentation contract

Review verdict: CONDITIONAL
