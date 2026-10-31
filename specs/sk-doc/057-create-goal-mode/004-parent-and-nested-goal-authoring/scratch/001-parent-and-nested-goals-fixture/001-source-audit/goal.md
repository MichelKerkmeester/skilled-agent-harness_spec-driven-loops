---
title: "Goal: Phase 1: source-audit"
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
    packet_pointer: "sk-doc/060-create-goal-mode/004-parent-and-nested-goal-authoring/scratch/001-parent-and-nested-goals-fixture/001-source-audit"
    last_updated_at: "2026-09-25T20:49:06Z"
    last_updated_by: "markdown"
    recent_action: "Completed the source-audit goal from its phase sources"
    next_safe_action: "Reopen the audit if the parent map or child folders change"
    blockers: []
    key_files: ["spec.md", "plan.md", "tasks.md", "acceptance-criteria.md"]
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "fixture-source-audit-session"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: Phase 1: source-audit

<!-- HVR_REFERENCE: .skilled/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything between the frontmatter and the log is the DURABLE SLICE: it is
> what an operator sets as the session objective, and it must stay true for the
> life of the packet. The frontmatter above it is bookkeeping and never leaves
> this file: it is not sent in chat, not injected, not stored in an objective.
> Keep the slice short. A phase parent or top-level packet has one limit, 4000
> characters, measured from the frontmatter's closing fence to the log anchor.
> Up to 4000 passes and past it fails; the runtime goal surfaces cap what they
> hold, and a truncated objective loses its tail, which is where the criteria
> live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Record the parent and child source set, then prove that the three mapped phase names match the direct folders on disk.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The parent Phase Documentation Map defines the expected direct folder names. |
| D2 | Compare exact names, not counts; any mismatch blocks goal authoring. |
| D3 | Use each child's own specification and acceptance criteria as the phase sources. |

### Operator copy

The operator holds this directive as the session objective, and that copy is
what judges completion, not this file. Whenever anything above the log changes
(objective, a decision, the binding table, a criterion), resend this file's
chat slice so the operator can update their copy. The chat slice is the
durable slice without its frontmatter, HTML comments, anchor markers, `---`
dividers or heading section numbers, and `goal.cjs packet` prints it as
`chat_slice`. Never send more than 4000 characters: cut this file first. Keep
reminding while the copy stays unset, and never stop work for it. A child goal
change that alters a parent decision or criterion is an amendment to the
parent: apply it there first, then resend the parent.
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The source inventory names `001-source-audit`, `002-goal-authoring` and `003-binding-check`.
- [ ] The parent map and direct-child folder names match exactly.
- [ ] The parent specification and all six child source documents are present in the inventory.
- [ ] Every acceptance criterion has a backticked single-line verification citation.
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
| Parent map and source pairs | Done | Map and six child source files reviewed. |
| Exact folder comparison | Done | Map and disk names match. |
| Acceptance evidence | Done | Three criteria cite task lines. |

### Deviations and findings

| Item | Note |
|------|------|
| Source inventory | The map and all three direct folders use the same exact names. |
<!-- /ANCHOR:log -->
