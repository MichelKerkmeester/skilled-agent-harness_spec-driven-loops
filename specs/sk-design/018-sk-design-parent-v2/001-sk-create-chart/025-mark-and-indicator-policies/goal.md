---
title: "Goal: mark policies, tooltip indicator kinds, reference lines and cursor guides"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/025-mark-and-indicator-policies"
    last_updated_at: "2026-09-08T18:22:04Z"
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
# Goal: mark policies, tooltip indicator kinds, reference lines and cursor guides

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Per-form declarations the research asked for: a sparse-point policy, a meaningful-zero signed-area policy, per-series tooltip indicator kinds, declared reference lines, and a cursor guide earned by density, each held by a checker family.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | declarations, not global restyles |
| D2 | the guide is earned by density; the checker refuses it elsewhere |
| D3 | reference lines are data, listed in the table |
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

- [ ] Every form carries the declarations and the four families pass
- [ ] `check-corpus.cjs --render` prints `RESULT: PASSED`; captures show the four effects
- [ ] Contract and changelog v1.9.0.0 updated
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
