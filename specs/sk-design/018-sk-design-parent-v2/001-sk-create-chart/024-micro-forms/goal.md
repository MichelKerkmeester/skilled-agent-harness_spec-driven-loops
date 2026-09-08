---
title: "Goal: spark, tracker and bar-list forms"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/024-micro-forms"
    last_updated_at: "2026-09-08T18:22:03Z"
    last_updated_by: "scaffold"
    recent_action: "Planned from the phase 21 synthesis; waits for phase 022"
    next_safe_action: "Dispatch the build after phase 022 lands"
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
# Goal: spark, tracker and bar-list forms

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Three question-first micro-forms the library has and the catalogue lacks: spark (line, area and bar variants as one family) for the compact trend, tracker for discrete status over time in the categorical role, and bar-list as a compact ranked list sharing bar-rows semantics; each a template with every corpus contract, a catalogue row and a capture.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | three forms, not five; rings and circles stay out |
| D2 | spark is one family with declared variants, one catalogue row |
| D3 | tracker uses only the categorical role |
| D4 | every existing family applies; no exemption |

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

- [ ] Three templates pass every family static and render
- [ ] Catalogue, identity and gallery list them; three deliveries exist
- [ ] Captures in both schemes; changelog v1.8.0.0
- [ ] `validate.sh --strict` prints `RESULT: PASSED` for this packet
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
| None yet | |
<!-- /ANCHOR:log -->
