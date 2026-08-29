---
title: "Goal: Spec Template Context Optimization"
description: "The durable directive this phase executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "system-speckit/033-spec-kit-template-optimization/001-spec-template-context-optimization"
    last_updated_at: "2026-08-29T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the phase goal document against the shipped template"
    next_safe_action: "None; the phase is closed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-08-29-033-001-spec-template-context-optimization"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
# Goal: Spec Template Context Optimization

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/shared/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short -
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Cut what a spec packet costs to read, without cutting what it records.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Level-gated research templates: a level only renders what it needs |
| D2 | Templates are single-sourced; a rendered view is read through its guard |
| D3 | Acceptance coverage ships as an advisory, not a gate, until it has a canonical home |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Copy these verbatim into the objective: nothing dereferences a path, so criteria
left only here are invisible to whatever judges completion.

- [x] A packet renders only the sections its level declares
- [x] The rendered-view read guard is exercised, not assumed
- [x] The scope-adherence validator reports against a real change-set
<!-- /ANCHOR:completion -->

---

<!-- ANCHOR:log -->
## 4. LOG

Everything below is VOLATILE. It is not part of the directive, it is not copied
into the objective, and it is expected to grow.

### Progress

| Item | State | Evidence |
|------|-------|----------|
| This phase | Complete | Shipped; content frozen and moved verbatim into this child |

### Deviations and findings

| Item | Note |
|------|------|
| Authored after the fact | This document was written once the goal template shipped in packet 042; the directive it records is the one the phase actually executed against. |
<!-- /ANCHOR:log -->
