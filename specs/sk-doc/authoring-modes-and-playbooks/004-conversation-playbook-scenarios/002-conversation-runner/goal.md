---
title: "Goal: Phase 2: conversation-runner"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner"
    last_updated_at: "2026-11-01T21:11:38Z"
    last_updated_by: "scaffold"
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
# Goal: Phase 2: conversation-runner

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Build the shared runner that plays a conversation script into a real interactive session of each requested runtime inside a scratch project and returns one PASS, FAIL or SKIP per runtime with its evidence.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Each runtime runs in its own tmux server on a private `conv-*` socket. The operator's tmux server is never contacted. |
| D2 | Each adapter is written against a question screen recorded from a live probe of that runtime, and a test parses that screen. |
| D3 | Codex tool questions use `--enable default_mode_request_user_input` only after the operator approves it. Without approval, Codex tool-question turns are SKIP with that blocker. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/fixtures/question-screens/` holds 5 files, one per runtime.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` exits 0 and prints `adapter screens: PASS (5 runtimes)`.
- [ ] `run-conversation-scenario.cjs` run without `--scratch`, or with a scratch inside the repository, exits 2 and starts no tmux server.
- [ ] `run-conversation-scenario.cjs` on `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` with `--runtime claude-code` exits 0, and its `matrix.md` row reads PASS.
- [ ] That scenario's `matrix.md` has one row each for claude-code, opencode, codex, pi and devin, and each row names an evidence folder that exists.
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/authoring-modes-and-playbooks/004-conversation-playbook-scenarios/002-conversation-runner --strict` prints `RESULT: PASSED`.
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
| Phase planned | Done | `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` written 2026-11-01 |
| T001 live probes | Pending | Waits for the 001 handoff |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
