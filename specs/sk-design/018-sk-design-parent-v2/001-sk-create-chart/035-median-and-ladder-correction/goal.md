---
title: "Goal: the two geometry fixes that did not work"
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
    packet_pointer: "scaffold/035-median-and-ladder-correction"
    last_updated_at: "2026-09-10T07:13:30Z"
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
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: the two geometry fixes that did not work

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Fix the two geometry defects the previous round treated at the symptom, and read both captures before closing.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | A fix to what a figure looks like is not done until someone who did not make it has read the capture |
| D2 | Repair the cause, not the place the symptom showed |
| D3 | Nothing that draws a mark may resolve to the page colour |

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

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [x] Every box in the box plot reads as one shape with a rule across it, on both fills
- [x] The dumbbell axis reads 0, 20, 40, 60 with the furthest dot within one rung of the last label
- [x] `check-corpus.cjs` PASSED and `node --test scripts/tests/` 84/84 from the final state
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
| Median stroke contrasts with its own box | Done | `assets/templates/box-plot.html:143-144`; capture re-read |
| Tick thinning removed | Done | `assets/templates/dumbbell.html`; axis reads 0, 20, 40, 60 |
| Changelog v2.3.0.0 and version field | Done | `changelog/v2.3.0.0.md`, `SKILL.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The previous round shipped before its reader returned | Two of its three fixes were wrong and are corrected here. The sequencing, not the fixes, is the thing to change |
<!-- /ANCHOR:log -->
