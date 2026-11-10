---
title: "Goal: Live conversation test"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "live conversation test goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/spec-authoring-and-continuity/004-decision-capture/006-live-conversation-test"
    last_updated_at: "2026-11-01T21:30:00Z"
    last_updated_by: "series-planner"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fe0c9990-06d3-454e-a8e7-7c7bc649bc49"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Live conversation test

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Prove on each runtime, through a scripted conversation typed into a real interactive session with human pauses, that every in-scope operator answer lands once in the decision record and every process question lands nowhere.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The scenario runs on the shared conversation runner from `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios`. This phase builds no runner, driver or tmux script of its own. |
| D2 | Claude Code runs first. OpenCode, Codex, Pi and Devin follow, and a runtime with no question tool gets a no-answer-surface row with the pane or transcript line that shows it. |
| D3 | The three existing decision-capture playbook scenarios stay as unit-level checks and are not changed by this phase. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/system-spec-kit/manual-testing-playbook/plugins-and-hooks/decision-capture-live-conversation.md` holds stage rows S0 to S11, `decision-capture-kill-switch-conversation.md` holds S12, and `manual-testing-playbook.md` lists each once.
- [ ] `scratch/live-runs/claude-run1/checkpoints.tsv` in this folder has 13 rows, each marked PASS, FAIL or SKIP with an evidence path that exists; a FAIL for a subject deviation quotes it and a SKIP names its blocker.
- [ ] In the Claude run, `rg -c --include-zero -i 'spec folder|gate 3'` prints 0 on `queue-S10.jsonl` and on `decision-record-S10.md`, while the S1 pane shows the question was asked.
- [ ] In the Claude run, `cmp decision-record-S10.md decision-record-S11.md` exits 0 and `consumed-S11.jsonl` has 7 lines.
- [ ] A subject started with `SYSTEM_DECISION_CAPTURE_DISABLED=1` leaves no queue file in its scratch project after the human answers one tool question.
- [ ] The results matrix in `implementation-summary.md` has a filled row for each of Claude Code, OpenCode, Codex, Pi and Devin, and `git status --short --ignored specs .skilled/skills/.state` in the real repository matches its pre-run baseline after every run.
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
| Planning docs | Done | `validate.sh --strict` on this folder, 2026-11-01 |
| Shared runner | Pending | Waits on `specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios` |
| Codex row and run report; 006 closed | done | Codex main PASS (attempt 7) + kill-switch 1/1; report 2026-11-02--manual-testing-playbook--decision-capture-live-conversation, 11 PASS; save gate fix in workflow.ts |

### Deviations and findings

| Item | Note |
|------|------|
| Runner ownership | The first brief had this phase build its own runner. The operator then made the runner shared (parent decision-record.md Q004), so this phase only writes the scenario, runs it and keeps the matrix. |

### Scenario files, 2026-11-02

| Item | Evidence |
|------|----------|
| Files | `plugins-and-hooks/decision-capture-live-conversation.md` (S0 to S11, 14 turns) and `decision-capture-kill-switch-conversation.md` (S12), both indexed once under 7.5 |
| Validator | `validate-playbook-package.cjs --package system-spec-kit`: `violations=0 warnings=1`, the warning is the pre-existing `ux-hooks/comment-hygiene-checker-baseline.md`. Scenarios 101 before, 103 after |
| Authoring | Luna wrote the kill-switch file and a first main file the quota cut off mid-block. DeepSeek rewrote the main file with one-line checks. The orchestrator copied the kill-switch file's scratch-only Codex flag line into the main file's `setup` |
| Runs | None yet. They wait for the 065 runner |
<!-- /ANCHOR:log -->
