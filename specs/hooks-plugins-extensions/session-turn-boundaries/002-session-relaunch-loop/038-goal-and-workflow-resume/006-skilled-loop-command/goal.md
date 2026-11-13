---
title: "Goal: Phase 6: skilled-loop-command"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "skilled loop command goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "scaffold/006-skilled-loop-command"
    last_updated_at: "2026-11-13T03:55:00Z"
    last_updated_by: "orchestrator"
    recent_action: "Closed the phase after the build, the review fixes and the final suite run"
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
# Goal: Phase 6: skilled-loop-command

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A shell that sources the shim runs the printed `skilled-loop <runtime>` command as typed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Add the function in `.skilled/bin/skilled-loop-shell.sh` and the test in `.skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs`. No other file changes. |
| D2 | The function calls the wrapper with `bash` and passes the runtime and arguments through. The printed manual command text stays unchanged. |
| D3 | Documentation changes stay out. The work package names no doc file, and phase 007 has its own doc scope. |
| D4 | Parent decisions D1 to D5 bind this phase without change. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `zsh -f -c 'source .skilled/bin/skilled-loop-shell.sh; command -v skilled-loop'` prints `skilled-loop`
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-shell.test.cjs` exits 0
- [x] `node --test .skilled/hooks/session-relaunch/tests/skilled-loop-wrapper-claim-goal.test.cjs` exits 0
- [x] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/hooks-plugins-extensions/session-turn-boundaries/002-session-relaunch-loop/038-goal-and-workflow-resume/006-skilled-loop-command --strict` prints `RESULT: PASSED`
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
| Planning documents authored | Done | Five documents filled from `scratch/finding.md` on 2026-11-13 |
| Implementation | Pending | No shim change yet |
| Build | Done | DeepSeek V4.1 Flash max built it through OpenCode, test first, and checked `bash -n` and `zsh -n` on the shim. The review found that an empty checkout variable ran a path under the file system root, which a follow-up pass replaced with a message and exit 127. |
| Suites | Done | The orchestrator reran every suite outside the builders' sandboxes from the final working tree: relaunch and OpenCode plugin suites 1471 of 1471, goal hook suites 200 of 200, Pi relaunch suite 59 of 59, each exit 0. |

### Deviations and findings

| Item | Note |
|------|------|
| None | No deviation from the frozen decisions. |
<!-- /ANCHOR:log -->
