---
title: "Goal Template: Phase Child"
description: "The blank a phase-child goal is filled from: a checked copy of system-spec-kit's goal template with guidance for a phase that answers to its parent."
trigger_phrases:
  - "phase child goal template"
  - "child goal blank"
  - "nested phase goal"
  - "phase-add child goal"
importance_tier: important
contextType: general
version: 1.1.0.0
---

# Phase-Child Goal Template

Use this blank for a direct phase child of a phase parent. It is the system-spec-kit goal template rendered at a numbered level, with placeholders that keep the goal to its own phase.

---

## 1. OVERVIEW

- **Use it for** the `child` operation, the new child goal in a `phase-add` and a `retrofit` of a child.
- **Scaffolded children.** `create.sh --phase --with-goal` already writes this structure into each child. Fill that file with the guidance here instead of pasting a second copy.
- **Parent first.** Parent decisions bind this phase and are not restated. A change that alters a parent decision or criterion is a parent amendment: make it in the parent first, then resend the parent.
- **Budget.** A child goal that is not itself a phase parent is exempt from the 4,000-character limit, but keep it short. A child with phase children of its own is a phase parent and carries the cap, as section 2 of [`../references/budget-and-handoff.md`](../references/budget-and-handoff.md) says. The parent's binding row is what points a session here.
- **Parents** use [`goal-phase-parent-template.md`](goal-phase-parent-template.md).
- **How to fill it.** Copy the block between the markers to `<packet>/goal.md`. Replace every bracketed placeholder with text from the packet's own `spec.md` and acceptance criteria, following [`../references/authoring-standards.md`](../references/authoring-standards.md). Remove unused placeholder rows.
- **Where it comes from.** The block is a checked copy of system-spec-kit's [`goal.md.tmpl`](../../../system-spec-kit/templates/addons/goal.md.tmpl). Only the placeholder wording differs. `node --test .skilled/skills/sk-doc/sk-create-goal/scripts/tests/` fails when the fixed text of the two drifts apart. When `goal.md.tmpl` changes, re-render it and carry the new fixed text into all three templates.

---

## 2. THE TEMPLATE

<!-- BEGIN TEMPLATE -->
```markdown
---
title: "Goal: [Phase title from this phase's spec.md]"
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
    packet_pointer: "[PACKET-ID]"
    last_updated_at: "[YYYY-MM-DDTHH:MM:SSZ]"
    last_updated_by: "scaffold"
    recent_action: "Authored the durable directive"
    next_safe_action: "Execute against the completion criteria"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
# Goal: [Phase title from this phase's spec.md]

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->
<!-- GOAL_AUTHORING: .skilled/skills/sk-doc/sk-create-goal/SKILL.md -->

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** [One sentence naming what this phase delivers toward the parent objective. Not how, not progress.]

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | [A choice local to this phase. Parent decisions already bind it and are not restated here] |

<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

- [ ] [A check on this phase's own output, answered by an exit code, a count or a named artifact]
- [ ] [Another check that needs no other file to answer]
- [ ] [Another. Keep three to seven in all]
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
| [Item] | [Pending/In Progress/Done] | [Command output, file:line, or artifact] |

### Deviations and findings

| Item | Note |
|------|------|
| [What diverged from the directive] | [Why, and what was done instead] |
<!-- /ANCHOR:log -->
```
<!-- END TEMPLATE -->

---

## 3. WHAT IS FIXED

| Element | Rule |
|---------|------|
| Frontmatter keys | Same keys, same order as `goal.md.tmpl`. Fill the bracketed values and never add or drop a key |
| `SPECKIT_TEMPLATE_SOURCE: goal \| v2.2` | Validators recognize a goal file by this marker |
| Anchors | `goal.cjs` cuts the durable slice and the log at the anchors, so every anchor stays where it is |
| Headings | Same text and numbers as `goal.md.tmpl`, including the section numbering. A child goal has no binding section, so the numbers run 1, 3, 4 |
| Fixed prose | The decisions line and the log introduction are system-spec-kit wording and stay word for word. Nothing above the log addresses the author, so add no instructions there |
| No binding section | The parent holds the only binding table |
---

## 4. SELF-CHECK

- [ ] Every bracketed placeholder is replaced with packet-specific text.
- [ ] The objective is one sentence, and it repeats the completion criteria verbatim when the goal contract asks for objective text.
- [ ] The parent's binding table has a row for this phase.
- [ ] No decision here contradicts or restates a parent decision.
- [ ] The fixed text still matches this template, and `check-goal.cjs <packet>` passes.
