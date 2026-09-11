---
title: "Goal: Spec-kit command integration"
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
    packet_pointer: "system-speckit/033-system-speckit-v4/036-goal-unification/006-speckit-command-integration"
    last_updated_at: "2026-09-11T07:40:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-11-system-spec-kit-goals"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Spec-kit command integration

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make speckit commands keep the parent goal current, resend it stripped, and remind without blocking work.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The resend trigger is a hash of the durable slice, never file modification time. |
| D2 | A reminder never halts work; only an explicit operator stop does. |
| D3 | After the operator sets or resets a goal, the agent acknowledges in one line and continues the current work at once; it never waits for a further prompt. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the durable slice
of this file in chat, frontmatter excluded, so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] Five speckit command files carry the goal step and compile
- [ ] A playbook shows update, resend and reminder without halt
- [ ] `validate.sh --strict` on this folder reports RESULT: PASSED
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
| Phase scaffolded and directive authored | Done | This file, 2026-09-11 |
| Workflow YAML | Done | `packet_goal` block in plan, implement, complete; reminder block in both resume YAMLs; `objective_shape` rewritten |
| Save router | Done | Log append step in `save.md` |
| AGENTS.md | Done | GOAL POSTURE RULE block after the MEMORY SAVE RULE and a Quick Reference row |
| Natural language | Done | spec-kit SKILL.md goal section and HOOKS keywords; trigger index regenerated |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
