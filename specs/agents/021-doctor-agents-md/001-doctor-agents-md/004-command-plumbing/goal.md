---
title: "Goal: command plumbing"
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
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/004-command-plumbing"
    last_updated_at: "2026-10-30T12:40:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers:
      - "Waits on /doctor:sk-skill (packet sk-doc/075-doctor-sk-skill-command) landing on main"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "worktree-292-doctor-agents-md"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: command plumbing

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make `/doctor:agents-md` reachable as one command with three targets, validated by the same shape, phrase rule and mutation class every sibling doctor command carries.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | `check` is the bare target and read-only; `embed` and `restore` mutate, and both ask for one explicit yes after a plan. |
| D2 | The router carries the six canonical sections and no inline presentation. |
| D3 | Every generated surface comes from its own script and is never hand-edited. |
| D4 | The derived advisor bridge ships inactive, and the phrase reach probe must still pass. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `bash .skilled/commands/doctor/scripts/route-validate.sh` exits 0 and its summary names the re-measured route count
- [ ] `node --test .skilled/commands/doctor/scripts/tests/doctor-agents-md-contract.test.cjs` reports `fail 0`
- [ ] `node .skilled/commands/doctor/scripts/command-catalog-mirror-check.cjs` prints `STATUS=OK`
- [ ] `bash .skilled/skills/system-spec-kit/runtime/cli/validate-command-tree-parity.sh` exits 0
- [ ] The generated advisor blocks, runtime mirrors and three prompt stub sets each pass their own `--check`, twice in a row
- [ ] `bash .skilled/commands/doctor/scripts/tests/run-all.sh` ends `0 failed`
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
| Specification, plan, tasks and criteria authored | Done | This packet's four documents |
| Implementation | Pending | Waits on the doctor sk-skill command and on both engines |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has run |
<!-- /ANCHOR:log -->
