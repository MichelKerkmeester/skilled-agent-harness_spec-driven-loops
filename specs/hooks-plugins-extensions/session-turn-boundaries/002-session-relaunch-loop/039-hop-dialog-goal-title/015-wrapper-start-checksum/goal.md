---
title: "Goal: Phase 15: wrapper-start-checksum"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "wrapper start checksum goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum"
    last_updated_at: "2026-11-14T14:05:00Z"
    last_updated_by: "code-agent"
    recent_action: "Recorded fix commit f99d3c442d (Commit-Id 0014025) and its scoped file list"
    next_safe_action: "The operator decides the merge"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-wrapper-start-checksum"
      parent_session_id: null
    completion_pct: 100
    open_questions:
      - "Can a real checkout make the start read fail? Not known. The guard is added anyway."
    answered_questions:
      - "Does README line 112 need an edit? No. After the fix it holds for an empty read at loop start and at the hop."
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 15: wrapper-start-checksum

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** The wrapper reports a change of its own file only when it read a checksum at loop start and at the hop and the two differ, so an empty start read never prints a change note or logs `wrapper-changed`.

### Decisions

Frozen choices. Changing one is an amendment. Parent decisions D1 to D4 bind here. The child decisions below add to them.

| ID | Decision |
|----|----------|
| D1 | The comparison requires both checksums. An empty read on either side is unknown, never a change. |
| D2 | The fix lands with a test that failed first, per parent D1. The test makes the start read fail with a `cksum` stub on the sandbox `PATH`. |
| D3 | No harness option, no production test hook, no module and no relaunch record key, per parent D3. The stub lives in the test. |
| D4 | This amends decision D4 of child 012, which left the start read unguarded because no test could produce it. The stub can, so the guard is added. No parent decision changes. |
| D5 | README line 112 is edited only if it is still wrong after the fix. |
| D6 | No live hop is run in this phase. Nothing is merged or pushed without the operator. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] The red run saved in `scratch/red.txt` shows `tests 5`, `pass 4` and `fail 1` for the name pattern `wrapper file` before the source edit, and the failing test is `a hop prints and logs nothing when the wrapper file could not be read at loop start`. Observed 2026-11-14: `scratch/red.txt:5` prints the `✖` line, `:7` `ℹ tests 5`, `:9` `ℹ pass 4`, `:10` `ℹ fail 1` and `:39` `exit=1`, with the false note quoted in the assertion message.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `pass 5` and `fail 0`. Observed: `scratch/green.txt:9`, `:10` and `:15` print `ℹ pass 5`, `ℹ fail 0` and `exit=0`.
- [x] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and one more test than the baseline saved in `scratch/baseline.txt`. Observed: `scratch/final-suite.txt:1564`, `:1567` and `:1572` print `ℹ tests 1551`, `ℹ fail 0` and `exit=0`, against the 1550 baseline.
- [x] `bash -n .skilled/bin/skilled-loop` exits 0 and `rg -n -o 'if \[\[ -n "\$started_wrapper_checksum" && -n "\$hop_wrapper_checksum"' .skilled/bin/skilled-loop` prints one line. Observed on 2026-11-14: `bash -n` exited 0 and the search printed `.skilled/bin/skilled-loop:1473`.
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum --strict` prints `RESULT: PASSED`. Observed 2026-11-14: Errors 0, Warnings 0, `RESULT: PASSED`, exit 0.
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow. Progress, evidence, deviations
and findings belong here.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| Review findings | Done | 2026-11-14. Alignment run finding X-4, deep review R1-P2-001 with its iteration 8 refinement, and both independent reviews: an empty start checksum is not guarded and README line 112 overstates the guard. All four are named in the parent goal log |
| Code read | Done | 2026-11-14 at `99d197475d`, before the fix: line 1472 tested only the hop checksum, and one line of the wrapper calls `cksum`. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written during planning, and `implementation-summary.md` written after the build |
| Build | Done | 2026-11-14: T001 to T011 and T013 complete. Red `scratch/red.txt` tests 5, pass 4, fail 1, exit 1; green `scratch/green.txt` tests 5, pass 5, fail 0, exit 0; full suite `scratch/final-suite.txt` tests 1551, pass 1551, fail 0, exit 0 |
| Fix commit | Done | 2026-11-14: `f99d3c442d`, Commit-Id 0014025. It changes `.skilled/bin/skilled-loop` and the wrapper launch-arguments test plus this child's records, adds no file outside the child folder, and T012 read it. The old wrapper made the new test fail 1 of 1, and the clean suite printed tests 1551, pass 1551, fail 0, exit 0 |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Child 012 decision amended | Child 012 decision D4 said no test can make the start read fail. That holds for `chmod`, because bash has just read the file, but not for a failing `cksum` on `PATH`. D4 here records the amendment |
| Baseline left unadopted | Re-reading the start checksum at the first readable hop would catch later changes in a loop whose start read failed. It is not planned, because no failing case asks for it and the review's spec seed asks only that an empty read is never a change. A loop whose start read failed therefore reports no change for its whole life, as `spec.md` records |
| README sentence | Checked, not changed. `rg -n -o 'A checksum that comes back empty[^.]*' .skilled/hooks/session-relaunch/README.md` printed line 112, and the fixed block makes the sentence true for an empty read at loop start and at the hop |
| Stub count | The stub fails only its first call, so the loop-start read is empty and every later hop read runs the real `cksum`. `scratch/red.txt:5` proves the stub reached the start read, because the wrapper printed the false note before the fix |
<!-- /ANCHOR:log -->
