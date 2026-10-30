---
title: "Goal: embed engine"
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
    packet_pointer: "agents/021-doctor-agents-md/001-doctor-agents-md/003-embed-engine"
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
# Goal: embed engine

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let a repository take the shipped template while keeping every line it wrote, with a plan it approved, a digest that binds the write and a proof that nothing was dropped.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Composition happens in memory; the plan shows a diff, the full block, the budget and a preservation ledger, and writes nothing. |
| D2 | Apply recomposes and refuses a digest mismatch, backs up before the first write and checks every path against the allowlist. |
| D3 | The four parts of the preservation invariant decide correctness; a violation restores the backup and ends `STATUS=FAIL`. |
| D4 | A merged section is still carried by default, because a merge that stays in place leaves the section edited forever. |
| D5 | Backups go to an ignored directory or the OS temp directory and are never deleted by the command. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `node --test .skilled/commands/doctor/scripts/tests/agents-md-embed.test.cjs` reports `fail 0`
- [ ] `node .skilled/commands/doctor/scripts/agents-md-embed.cjs plan` on this repository prints `NOTHING TO DO` and exits 0
- [ ] On a temporary copy of the `foreign` fixture, plan then apply prints `preservation: kept <n>, carried <m>, shipped-replaced <k>, dropped 0`
- [ ] On the same copy, `restore --run=<dir>` followed by a comparison against the pristine copy exits 0
- [ ] Every path the engine writes appears in the allowlist, and a path outside it is refused with a named cause
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
| Implementation | Pending | Waits on the doctor sk-skill command and on the check engine |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | No work has run |
<!-- /ANCHOR:log -->
