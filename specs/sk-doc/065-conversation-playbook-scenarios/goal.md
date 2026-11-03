---
title: "Goal: Conversation playbook scenarios"
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
    packet_pointer: "sk-doc/065-conversation-playbook-scenarios"
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
# Goal: Conversation playbook scenarios

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a playbook scenario script the human side of a conversation, and let one shared runner play that script into a real interactive session of Claude Code, OpenCode, Codex, Pi or Devin, answer the subject's questions and check state after every turn.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A script is one fenced `json conversation` block in the scenario file, with a closed key set that `validate-playbook-package.cjs` checks. |
| D2 | The runner is shared: `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/run-conversation-scenario.cjs`. It reads scripts only through the validator's `parseConversationScript`. |
| D3 | The runner refuses any project but a marked scratch folder outside this repository. A run that changes `specs/` or `.skilled/skills/.state/` here fails. |
| D4 | Implementation workers run `gpt-6-luna` at reasoning `xhigh` on service tier `fast` through cli-codex. When Luna's quota is used up they fall back to `llmgateway/deepseek-v4.1-flash-1017` at thinking `max` through cli-pi. Luna never runs through a gateway. |
| D5 | The orchestrator, not a worker, runs every tmux test and live run, and nothing is installed. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-scenario-contract | `001-scenario-contract/goal.md` |
| 002-conversation-runner | `002-conversation-runner/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/spec/validate.sh specs/sk-doc/065-conversation-playbook-scenarios --strict --recursive` prints `RESULT: PASSED` for the parent, `001-scenario-contract` and `002-conversation-runner`.
- [ ] `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/validate-playbook-package.test.cjs` and `node .skilled/skills/sk-doc/sk-create-manual-testing-playbook/scripts/tests/run-conversation-scenario.test.cjs` both exit 0.
- [ ] `run-conversation-scenario.cjs` on `manual-testing-playbook/conversation-runner/drive-a-scripted-conversation.md` with `--runtime claude-code` exits 0, and its `matrix.md` row reads PASS.
- [ ] That scenario's `matrix.md` has one row each for claude-code, opencode, codex, pi and devin, each PASS, FAIL with a reason or SKIP with a named blocker.
- [ ] After every run in the final passes, `002-conversation-runner/scratch/runs/` `matrix5`, `matrix6`, `claude-code-final` and `codex-final`, `tmux -L <run socket> list-sessions` fails and each runtime's `result.json` reports `repo.changed` false (no `REPO_CHANGED`).
- [ ] `node .skilled/commands/doctor/scripts/parent-skill-check.cjs .skilled/skills/sk-doc` prints a line that begins with `OK: parent-skill-check`.
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
| Planning | Done | Both phases planned 2026-11-01. `validate.sh --strict --recursive` result recorded at handoff |
| 001-scenario-contract | Done | 2026-11-01: fleet 56/1/93 unchanged, suite PASS, hub OK, strict PASSED |
| 002-conversation-runner | In progress | Fake-subject core passes its suite (M2); live probes next |
| 002-conversation-runner | Done | 2026-11-02: review and alignment fixed; matrix3, matrix5, matrix6 five rows; claude-code-final PASS 6/6 exit 0; strict PASSED x3; suites exit 0; parent-skill-check OK |
| Phase 003 adoption research synthesized | partial | research.md ranks candidates; 28 of 56 packages audited, closeout manualStop |
| Phase 003 adoption research completed | done | devin lineage audited the 28 skipped packages; 56 of 56 have a verdict |

### Deviations and findings

| Item | Note |
|------|------|
| Fleet baseline already fails | A planning-time fleet run exits 1 on one `REQUIRED_PROMPT` violation in `.skilled/manual-testing-playbook/doctor-commands/doctor-routing-helper-handoff.md`. Phase 001 compares counts, 56 packages, 1 violation and 93 warnings at planning time |
| 001 raised to Level 2 | `recommend-level.sh` scores it Level 1. It changes a fail-closed CI gate, so it keeps acceptance criteria |
<!-- /ANCHOR:log -->
