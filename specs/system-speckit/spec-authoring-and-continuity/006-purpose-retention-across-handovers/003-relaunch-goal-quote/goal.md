---
title: "Goal: Phase 3: relaunch-goal-quote"
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
    packet_pointer: "system-speckit/spec-authoring-and-continuity/006-purpose-retention-across-handovers/003-relaunch-goal-quote"
    last_updated_at: "2026-11-14T08:45:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "ef52f514-275d-4013-b7bd-ab365324057d"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Phase 3: relaunch-goal-quote

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** When a packet is bound, every relaunch note opens its Goal with one line copied word for word from the packet's purpose, so the text that says why the work exists reads the same after every hop.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | This phase changes only the files its `spec.md` lists under Files to Change, plus its own packet docs. |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [x] REQ-001: The nudge that `handoffText` builds asks for the copied Purpose line. The line right after the `spec_folder is a repo-relative` line starts with `   When spec_folder names a packet, open ## Goal with one line` and holds `### Purpose`, `from parent` and `goal.md`
- [x] REQ-002: `handoff.md` Step 3 states the same rule. `rg -n 'open Goal with one line .Purpose' .skilled/commands/speckit/handoff.md` prints one line, and the next three lines name the parent fallback, the `goal.md` Objective and when to leave the line out
- [x] REQ-003: No existing behavior breaks. The full session-relaunch suite passes with 1014 tests and 0 failures, and the four mirror checks each exit 0
- [x] REQ-004: The two writers ask for the same thing. Both texts name the `Purpose (<file>): <text>` form, the `Purpose (from parent <file>): <text>` form, the `goal.md` Objective fallback and leaving the line out when no text exists
- [x] REQ-005: The session goal and the purpose cannot be read as two rival goals. `handoff.md` says a bound `goal.md` still binds the session goal and that the Purpose line says why that goal exists
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
| Phase built | Done | Status Complete in `spec.md`. Criteria marked from that status and `implementation-summary.md`, not rerun on 2026-11-14 |

### Deviations and findings

| Item | Note |
|------|------|
| None recorded | The criteria above are this phase's own requirement rows, copied from its `spec.md` |
<!-- /ANCHOR:log -->
