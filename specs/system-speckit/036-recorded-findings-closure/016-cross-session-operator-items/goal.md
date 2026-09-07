---
title: "Goal: Cross-session operator items"
description: "The durable directive this packet executes against and the criteria that decide when it is done."
trigger_phrases:
  - "cross session operator items"
  - "coordinate not overwrite"
  - "spec kit check mirror job"
  - "worktree 046 removal"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/036-recorded-findings-closure/016-cross-session-operator-items"
    last_updated_at: "2026-09-07T00:00:00Z"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "scaffold-016-cross-session-operator-items"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: Cross-session operator items

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Close the five items the simplification-research program attributed to other sessions' surfaces, by coordinating with whatever state each surface is actually in rather than overwriting it and never forcing a destructive action on a surface found dirty.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every surface's git status is checked immediately before that surface's own action, not only once at phase start |
| D2 | A dirty surface blocks only its own item. The other items proceed independently |
| D3 | Worktree 046 is never force-removed. A dirty worktree stops the task and escalates to the operator |
| D4 | An item already fixed by another session (the sk-design invariants, the 036 manifest) is re-verified and its closure documented, not re-worked as if still broken |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend the full text
of this file in chat so the operator can update their copy. A child goal change
that alters a parent decision or criterion is an amendment to the parent: apply
it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] `spec.md`, `plan.md`, `tasks.md` and `acceptance-criteria.md` exist with no bracketed placeholder remaining
- [ ] The opening git-status task reports a clean or dirty state for all five surfaces before any other task runs
- [ ] `spec-kit-check.yml`'s `mirrors` job and `routing-registry-drift.yml`'s `routing-drift` job both pass
- [ ] `test_readme_verdict_parity.py` reports `diff_entries=0`
- [ ] Worktree 046 is removed, or a documented escalation exists explaining why it was not
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
| Packet opened | Done | this file |

### Deviations and findings

| Item | Note |
|------|------|
<!-- /ANCHOR:log -->
