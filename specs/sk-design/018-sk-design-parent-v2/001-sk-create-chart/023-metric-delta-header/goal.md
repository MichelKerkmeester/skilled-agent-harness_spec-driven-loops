---
title: "Goal: metric and delta header block for scalar and time-series forms"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/023-metric-delta-header"
    last_updated_at: "2026-09-08T18:22:02Z"
    last_updated_by: "scaffold"
    recent_action: "Metric header built on eight forms and declared on all; packet closed"
    next_safe_action: "Commit with the chart package; start phase 024"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "[SESSION-ID]"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: metric and delta header block for scalar and time-series forms

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** An optional metric-and-delta block in the header zone of scalar and time-series forms: a 24 to 28px value from the data block, a signed 12px delta in verdant or crimson, a period label, and a direction cue, with the new size added to the published type scale and every value still in the chart table.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | the value is a literal from the data block, never computed at draw time |
| D2 | the rung lives in `palettes.json`, not in a template |
| D3 | absent is a valid declaration; the block is optional per form |
| D4 | assertion first, proved on a mutated copy |

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

- [x] Every scalar and time-series form declares `METRIC`; present blocks render and their values are table cells
- [x] The `metric` rung is published in `palettes.json` and `type-scale` accepts it
- [x] `check-corpus.cjs --render` prints `RESULT: PASSED`; captures regenerated; contract and changelog v1.7.0.0 updated
- [x] `validate.sh --strict` prints `RESULT: PASSED` for this packet
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
| Metric rung and the header on one form | Done | `typeScale.roles.metric`; daily-line capture |
| Roll-out to eight baseline forms, 25 declaring absent | Done | `metric-block` 104/0 |
| Contract, changelog v1.7.0.0, versions | Done | conductor |

### Deviations and findings

| Item | Note |
|------|------|
| Two deliveries carry the header | The brief named where-the-budget-went as a present-false case; the executor agreed and recorded why in the block |
<!-- /ANCHOR:log -->
