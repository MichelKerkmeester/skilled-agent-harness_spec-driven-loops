# Iteration 003 - Traceability

## Dispatcher
- Lineage: claude2 (fan-out), session fanout-claude2-1795297959308-ycf8yr, generation 1
- Dimension: traceability
- Sources: spec.md, plan.md, tasks.md, implementation-summary.md, goal.md of packet 056; parent 002 spec.md diff; goal-carry-over.md and troubleshooting.md diffs; the code and test diffs read in iterations 1-2. steer.md: not present.

## Review Focus Coverage
The focus asks for the code to be checked against the spec, tasks and implementation-summary claims. Each REQ, SC, task Verify line and summary decision was matched to the code or test that backs it. Where a doc tells an operator when a worktree goal is carried, I checked that the doc's rule matches the resolver, so a carried or lost goal is diagnosed correctly.

## Files Reviewed
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:33, 85-110, 115-135
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/plan.md:29, 49-56
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/tasks.md:35-58
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/implementation-summary.md:60-118
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/goal.md (completion and log)
- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/spec.md:162, 229
- .skilled/hooks/session-handover/troubleshooting.md:54
- .skilled/hooks/session-handover/goal-carry-over.md:104-126, 144
- .skilled/hooks/session-handover/tests/session-handover-cli.test.cjs:3999-4091

## Findings by Severity

### P0 Findings
None.

### P1 Findings
None.

### P2 Findings
1. **Handoff Criteria says the tampered-root test passes on the old code, but the test now fails there** -- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:33 -- The test `consume and claim drop a goal_root that is not a linked worktree of this repository` (session-handover-cli.test.cjs:4036-4054) plants a copy of the packet in `sandbox.repoRoot`. The old `usableGoalPacket` ignored `goal_root` and checked `goalRoots(repoRoot, noteCwd)` (removed line in the relaunch-core.cjs diff), so it would have returned the packet and the test's `deepEqual` without `goal_packet` would fail. plan.md:29 ("each new test fails on the old code") and implementation-summary.md:93 ("Each new test fails with its fix undone") agree with the code. Only spec.md is stale.
   Finding class: traceability / stale acceptance statement
   Scope proof: the Handoff Criteria row is in this packet; the repo-copy fixture was added with the no-fallback fix.
   Affected surface hints: spec.md metadata Handoff Criteria row
   Case: a reviewer runs the tampered-root test against the pre-change relaunch-core.cjs expecting the pass the spec promises, sees it fail, and cannot tell whether the spec or the fixture is wrong.

2. **troubleshooting.md says a worktree goal is carried only when the log names the worktree** -- .skilled/hooks/session-handover/troubleshooting.md:54 -- The resolver also treats the `goal_root` of the note this session claimed last as named (relaunch-core.cjs:895 and :950), and goal-carry-over.md:104 documents that. An operator who reads troubleshooting.md after a hop-2 session hands over is told the wrong rule for why the goal was or was not carried.
   Finding class: traceability / doc contradicts code
   Scope proof: the sentence was added in this diff; the claimed-root path was added in this diff.
   Affected surface hints: troubleshooting.md "The receiver shows no goal packet"; goal-carry-over.md section 3
   Case: a hop-2 receiver whose log never names worktree W still carries the goal through its claimed note, and troubleshooting.md predicts no goal for it.

3. **Spec, tasks and Files to Change do not cover the three behaviors added after the second-account review** -- specs/hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry/spec.md:89 -- In Scope (spec.md:89) and plan.md:29 search only "the linked worktrees the session log names". No REQ covers the claimed-note `goal_root` carry, the stripping of git repository variables, or the no-fallback rule for a stale root. spec.md:107 and implementation-summary.md:67 list three CLI tests and tasks.md:45-46 verify `pass 3`, but the diff adds five CLI worktree tests (session-handover-cli.test.cjs:3999-4091). The behaviors are recorded only in a Key Decisions row (implementation-summary.md:93).
   Finding class: traceability / requirement set lags implementation
   Scope proof: all five tests and all three behaviors are in this diff; the spec tables are this packet's.
   Affected surface hints: spec.md In Scope and REQ table; tasks.md T003/T004 Verify; implementation-summary.md Files Changed
   Case: running `node --test --test-name-pattern='linked worktree|two linked worktrees|not a linked worktree'` as tasks.md T003 implies reports pass 4 (the claimed-note test also matches 'linked worktree'), not the pass 3 the task promises.

## Traceability Checks
- spec_code: partial. REQ-001 (cli.test:3999), REQ-002 (wrapper.test:893, :908), REQ-003 (cli.test:4036), REQ-004 (cli.test:4020) each map to a test of the stated name and to the code read in iteration 1. REQ-005 and SC-001/SC-002 are packet claims not re-run here. The drifts are P2-001..003.
- checklist_evidence: partial. tasks.md T001-T010 are all ticked. T003/T004 Verify text is stale (P2-003). goal.md's `validate.sh --strict RESULT: PASSED` criterion cannot be confirmed in this lineage, because validate.sh is outside its write limit. That criterion stays UNVERIFIED and is not a finding.
- Parent 002 spec.md: phase 56 row (:162) and transition row (:229) are consistent with the child's counts (1073 / 75 / 509).

## Integration Evidence
- goal-carry-over.md:104-126 and :144 match the code: worktree search after the usual roots, the claimed-root addition, uniqueness per worktree and packet pair, `goal_root` lifecycle, the no-fallback rule, the claim line `in <worktree>`, and `consume`'s `goal_root` key.

## Edge Cases
- The T003 name pattern also matches the claimed-note test, so its count is 4. This is inference from the test names, not a run.
- implementation-summary Known Limitation 2 ("the log must name the worktree") has the same omission as troubleshooting.md. It is folded into P2-002's surface hints rather than reported again.

## Confirmed-Clean Surfaces
- REQ-001..REQ-004 test names exist verbatim, or as a prefix, in the diff.
- SC-002 arithmetic: 1065 + 8 new tests (1 core, 5 CLI, 2 wrapper) = 1073.
- Parent phase map and transition rows.

## Ruled Out
- A missing parent-spec update: present in the diff.

## Next Focus
- Dimension: maintainability
- Focus area: clarity and safe follow-on cost of the new core helpers (duplicate git calls per consume, the `usableGoalPacket` shim, logTailText versus the existing log reader), the shell split of the seeded two-line answer, and test robustness (a regex built from an unescaped temp path in the claim assertion).
- Rotation status: D1-D3 done; D4 remaining.

Review verdict: PASS
