---
title: "Goal: Manifest Entry and Goal Template"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/042-nested-goal-template-addon/001-manifest-and-goal-template"
    last_updated_at: "2026-08-30T04:17:55Z"
    last_updated_by: "claude-code"
    recent_action: "Shipped the contract entry, template and mapping"
    next_safe_action: "None; this phase is complete"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:c9e0247bf164ade97abf1293bfcbc88543acc0f397cd8b2fe3863b08e0fd1c89"
      session_id: "2026-08-29-042-001-manifest-and-goal-template"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Manifest Entry and Goal Template

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short —
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Put the goal document into the documentation-level contract as a lazy add-on and ship its gated template.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Lazy add-on only; the document collector walks lazy and skips optional |
| D2 | The binding block is scoped to phase parents; a leaf has no children to bind |
| D3 | Review carries no goal document |
<!-- /ANCHOR:directive -->

---


<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] The document resolves to a template at 1/2/3/3+/phase and to nothing at review
- [ ] The template renders a durable directive and a log separable by heading
- [ ] Required document sets are unchanged at every level
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
| This phase | Done | Criteria met and recorded in acceptance-criteria.md |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | - |
<!-- /ANCHOR:log -->
