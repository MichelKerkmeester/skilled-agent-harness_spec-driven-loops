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
    last_updated_at: "2026-11-14T12:00:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase goal from spec.md and acceptance-criteria.md"
    next_safe_action: "Build the phase from tasks.md after the operator picks the workspace"
    blockers: []
    key_files: [".skilled/bin/skilled-loop", ".skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-015-wrapper-start-checksum"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Can a real checkout make the start read fail? Not known. The guard is added anyway."
    answered_questions: []
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

- [ ] The red run saved in `scratch/red.txt` shows `tests 5`, `pass 4` and `fail 1` for the name pattern `wrapper file` before the source edit, and the failing test is `a hop prints and logs nothing when the wrapper file could not be read at loop start`.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test --test-name-pattern='wrapper file' .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-launch-arguments.test.cjs` exits 0 with `pass 5` and `fail 0`.
- [ ] `env -u AI_SESSION_CHILD -u OPENCODE_DB node --test .skilled/hooks/session-relaunch/tests/*.test.cjs .opencode/plugins/tests/*.test.cjs` exits 0 with `fail 0` and one more test than the baseline saved in `scratch/baseline.txt`.
- [ ] `bash -n .skilled/bin/skilled-loop` exits 0 and `rg -n -o 'if \[\[ -n "\$started_wrapper_checksum" && -n "\$hop_wrapper_checksum"' .skilled/bin/skilled-loop` prints one line.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/039-hop-dialog-goal-title/015-wrapper-start-checksum --strict` prints `RESULT: PASSED`.
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
| Code read | Done | 2026-11-14 at `99d197475d`: line 1472 tests only the hop checksum, and one line of the wrapper calls `cksum`. The output is quoted in `spec.md` Measured Behavior |
| Plan documents | Done | 2026-11-14: spec, plan, tasks, criteria and this goal written. `implementation-summary.md` is written after the build |
| Build | Pending | Tasks T001 to T013 |
| Merge and push | Pending | Parent decision D4: nothing is merged or pushed without the operator |

### Deviations and findings

| Item | Note |
|------|------|
| Child 012 decision amended | Child 012 decision D4 said no test can make the start read fail. That holds for `chmod`, because bash has just read the file, but not for a failing `cksum` on `PATH`. D4 here records the amendment |
| Baseline left unadopted | Re-reading the start checksum at the first readable hop would catch later changes in a loop whose start read failed. It is not planned, because no failing case asks for it and the review's spec seed asks only that an empty read is never a change |
| README sentence | Expected to stay as it is. Task T008 checks it and records the result here |
<!-- /ANCHOR:log -->
