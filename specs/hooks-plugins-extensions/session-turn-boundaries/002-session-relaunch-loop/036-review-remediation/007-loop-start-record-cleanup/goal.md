---
title: "Goal: Phase 7: loop-start-record-cleanup"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "loop start record cleanup goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/007-loop-start-record-cleanup"
    last_updated_at: "2026-11-12T14:27:02Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after one added test and an SWE review"
    next_safe_action: "None; phase closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 7: loop-start-record-cleanup

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Remove the wrapper's own leftover relaunch record before the first launch, so a later wrapper never reads a record it did not create.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Before the first launch, the wrapper removes the record file that carries its own loop id. |
| D2 | It removes that one file only, and other loops' records stay. |
| D3 | No signal trap is added in this phase. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test --test-name-pattern 'own leftover relaunch record' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] `node --test --test-name-pattern 'record for another loop is kept' .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` prints `# pass 1` and `# fail 0`.
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop.test.cjs` exits 0 with a case where a planted `relaunch-<pid>.json` is gone before the first launch.
- [x] `rg -n 'relaunchFilePath' .skilled/bin/skilled-loop` prints one line, the cleanup's path lookup.
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
| Phase 7 planning documents | Done | Five files written in `specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/036-review-remediation/007-loop-start-record-cleanup` on 2026-11-12. The measured behavior is the `rg -n 'SKILLED_LOOP_ID="\$\$"\|relaunch-'` output in `spec.md`. |
| Build, two passes | Done | DeepSeek V4.1 Flash at max through OpenCode Go. `scratch/red.txt` holds the failing run, `scratch/green.txt` the passing file (184 tests, 184 pass, 0 fail) |
| Review | Done | SWE through Devin, read-only, on `scratch/review.diff`: PASS with no finding |
| Suites | Done | Relaunch suite 862 of 862, OpenCode plugin 65 of 65, Pi 59 of 59, each exit 0 |
| Second review | Done | SWE through Devin, read-only, on the later passes: PASS with one P2 on the symlink case, which could not fail. It now reads the launch-time probe, and `scratch/mutation.txt` shows it failing against a wrapper without the cleanup. Relaunch suite 865 of 865, OpenCode plugin 65 of 65, Pi 59 of 59 |

### Deviations and findings

| Item | Note |
|------|------|
| One case added after review | The plan's adversarial list names an own record that is a symlink. The first pass had no case for it, so a second pass added one. It passed without a wrapper change. Loop id generation is not changed and no signal trap is added. |
| Verification wording | The criteria name the `# pass 1` line, which the tap reporter prints. The default reporter prints the same count as `ℹ pass 1`. Both were run. |
<!-- /ANCHOR:log -->
