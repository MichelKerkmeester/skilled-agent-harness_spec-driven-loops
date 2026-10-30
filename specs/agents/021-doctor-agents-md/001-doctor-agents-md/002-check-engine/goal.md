---
title: "Goal: check engine"
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
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/002-check-engine"
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
# Goal: check engine

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Report, without writing a byte, where a repository stands against the shipped manifest: its install state, the sections it lost, the lines it owns and the copies that drifted.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Twelve named rows, each reporting `PASS`, `FINDING`, `UNKNOWN` or `INFO`, in one stable order in both text and JSON. |
| D2 | The engine reuses the canary, the pointer sync and the repo-rules checker and never reimplements their rules. |
| D3 | An absent input tool yields `UNKNOWN`, never `PASS`, because a green result without evidence is the failure this row exists to catch. |
| D4 | Exit codes are 0 for no finding, 1 for at least one finding and 2 for a failed precondition. |
| D5 | Fixtures are synthetic and built from the manifest. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node .skilled/commands/doctor/scripts/agents-md-check.cjs` on this repository exits 0 and prints `STATUS=OK` with `A1 install state: pure`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-check.cjs --root .skilled/commands/doctor/scripts/tests/fixtures/agents-md/forked --json` exits 1 and its `state` reads `forked`
- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-check.test.cjs` reports `fail 0`
- [ ] `git status --porcelain | shasum` prints the same digest before and after a run over every fixture
- [ ] The engine's text report names twelve rows, and its JSON carries the same twelve
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
| Implementation | Pending | Waits on the doctor sk-skill command landing on main and on child 001's manifest |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has run |
<!-- /ANCHOR:log -->
