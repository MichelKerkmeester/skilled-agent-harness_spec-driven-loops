---
title: "Goal: Phase 56: worktree-goal-carry"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "worktree goal carry goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "hooks-plugins-extensions/session-handover/002-session-handover-loop/056-worktree-goal-carry"
    last_updated_at: "2026-11-21T21:40:00Z"
    last_updated_by: "claude"
    recent_action: "Met every completion criterion"
    next_safe_action: "Commit and merge through sk-git when the operator asks"
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
# Goal: Phase 56: worktree-goal-carry

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** A Claude hand-over sets the next session's goal by itself when the goal's packet lives only in a linked git worktree.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The operator is never asked to paste or set a goal slice after a hop. |
| D2 | The note records the worktree as `goal_root`, and readers accept it only while `git worktree list` names it. |
| D3 | Only worktrees the session log names are searched, and two matching worktree and packet pairs refuse. |
| D4 | The receiver's working directory and the `spec_folder` rule stay as they are. |
| D5 | No commit or push without the operator's instruction. |

<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] `node --test .skilled/hooks/session-handover/tests/*.test.cjs` prints `fail 0` with the three CLI and two wrapper worktree tests among the passes
- [x] The two wrapper worktree tests print `fail 2` against the unchanged `.skilled/bin/skilled-loop`
- [x] `node --test .opencode/plugins/tests/session-handover.test.cjs` and hooks vitest exit 0 with the primary-checkout counts
- [x] `validate.sh --strict` on this packet prints `RESULT: PASSED`
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
| Node suite | Done | pass 1073, fail 0, exit 0 (baseline 1065) |
| Second-account review | Done | Three P2s fixed, each new test red with its fix undone |
| Wrapper red check | Done | pass 0, fail 2 on the unchanged wrapper |
| OpenCode plugin suite and hooks vitest | Done | 75 of 75 and 509 of 509, both exit 0 |
| Real session probe | Done | Session 123e1c5d resolves to the 505 packet with the 505 root |

### Deviations and findings

| Item | Note |
|------|------|
| Receiver start directory | The handoff suggested the receiver start in or bind to the worktree. It binds through the recorded root and keeps its directory, because a moved directory changes which hooks and state the receiver reads. |
<!-- /ANCHOR:log -->
