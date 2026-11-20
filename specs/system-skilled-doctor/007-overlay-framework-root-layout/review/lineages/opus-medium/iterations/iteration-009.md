# Iteration 009 - Frontier node F-1-002: traceability

## Dispatcher
- Lineage opus-medium, iteration 9 (8 prior iteration records). steer.md absent. Node F-1-002, dimension traceability.
- Review focus addressed: test strength and spec-to-code traceability for the engine phases. Each phase 001 and 002 REQ was traced to the engine line and the test that proves it, and each negative-control capture was checked against what it can and cannot prove.

## Files Reviewed
- specs/.../002-engine-framework-root-source-layout/spec.md:142-154 (REQ-001..REQ-008)
- specs/.../002-engine-framework-root-source-layout/scratch/evidence/negative-control.txt:1-253
- specs/.../002-engine-framework-root-source-layout/implementation-summary.md:80-92
- .skilled/commands/doctor/scripts/tests/overlay-engine-strict-writes.test.cjs:186-369 (framework/ and root/ hint assertions)
- .skilled/commands/doctor/scripts/overlay-engine.cjs:5482-5492, :5650-5656, :2824-2828, :3652-3660, :6137-6142
- specs/.../001-engine-out-of-tree-overlay-folder/spec.md:125-141 (REQ-001..REQ-012), cross-checked against the iteration-1 code reads

## Findings - New

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
None.

## Traceability Checks
- spec_code (pass): 002 REQ-001 adoptSource (:5484-5487); REQ-003 root/skilled refusal in plan (:2824), adopt (:5650) and relayout (:6137); REQ-005 cap (:3652-3660); REQ-007 adopt fallback (:5637-5640, :5667). 001 REQ-002 in-tree backup has no `area` key (`tag = area ? { area } : {}` in writeBackup); REQ-011 holds, since overlay-guard.cjs has no diff in the range.
- checklist_evidence (pass): 002 implementation-summary.md:87 says the test-first run was 245 tests with 7 failing, all new; negative-control.txt:246-249 records tests 245, pass 238, fail 7, and the seven ✖ lines are the new cap, old-layout, root/skilled and adopt-preference cases.

## Integration Evidence
- None beyond the engine and its test files.

## Edge Cases
- The 002 negative control was taken before the "old-rule test sweep" (implementation-summary.md:89 step 3), so it does not show the edited strict-writes assertions failing on the old engine. Those assertions require `skilled-overlays/framework/...` and `skilled-overlays/root/REPO RULES.md` (strict-writes.test.cjs:186,202,207), which the old dot-dropped adoptSource cannot produce, so they discriminate by construction. Not raised; the summary describes the run accurately.
- The 001 negative control has the same limit, already recorded in iteration 1.

## Confirmed-Clean Surfaces
- Every 002 REQ has a named test file and a matching engine line.

## Ruled Out
- Phase 002 negative control overstated: the summary's 245/238/7 numbers match the capture.

## Next Focus
- Dimension: traceability
- Focus area: F-1-004 doc cross-references (playbook index, release note, skill version)
- Reason: frontier rotation

Review verdict: PASS
