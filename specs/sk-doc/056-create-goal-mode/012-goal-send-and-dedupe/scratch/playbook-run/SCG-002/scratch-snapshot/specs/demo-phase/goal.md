---
title: "Goal: Demo Phase Packet"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
  - "demo phase packet goal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "demo-phase"
    last_updated_at: "2026-09-26T19:57:27Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-26-demo-phase"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Demo Phase Packet

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Concurrent runs appending to counter.txt finish with every run recorded exactly once and in run order, with no duplicated or lost lines.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Counter lines are plain text and counter.txt is append-only: a run only adds its own line and never edits, reorders or removes a line already written. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:binding -->
## 2. BINDING

**Read the child goal before working a phase.** Each is authoritative for its
phase and binds as if written here.

| Phase | Goal document |
|-------|---------------|
| 001-alpha | `001-alpha/goal.md` |
| 002-beta | `002-beta/goal.md` |

**Precedence.** Decisions above outrank child detail. Child detail outranks any
summary of it. Name a conflict rather than resolving it silently.

**Stop.** Only the criteria below decide done. An evaluator sees the objective
string, not these files.
<!-- /ANCHOR:binding -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `001-alpha/goal.md` and `002-beta/goal.md` both exist
- [ ] The BINDING table lists `001-alpha/goal.md` and `002-beta/goal.md`, one row for each phase folder
- [ ] The goal's durable slice measures at most 4,000 characters
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
| Phase-parent goal authored | Done | goal.md filled from goal-phase-parent-template.md |
| 001-alpha child goal | Pending | |
| 002-beta child goal | Pending | |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
