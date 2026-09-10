---
title: "Goal: one style reference, no examples, open tables, a gallery that sizes its frames"
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
    packet_pointer: "scaffold/036-evilcharts-only-and-open-tables"
    last_updated_at: "2026-09-10T07:41:56Z"
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
# Goal: one style reference, no examples, open tables, a gallery that sizes its frames

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** One Style Reference, one corpus, every data table open, and a gallery whose frames take the height of what they show.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The reference the documents name is the reference the applicator reads |
| D2 | The templates are the corpus; nothing is kept as a second copy of them |
| D3 | The values are part of the deliverable, so the table starts open |
| D4 | A frame takes the height its chart reports, never a guessed one |

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

- [x] `ls assets/style-reference` lists only `evilcharts`; `assets/examples` does not exist
- [x] `check-corpus.cjs` PASSED, suite 87/87, `build-gallery.cjs --check` PASSED
- [x] A rendered gallery shows whole tiles with open tables
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
| Cursor reference and examples removed | Done | 21 deletions in the scoped diff |
| Tables open, height posters, gallery listener | Done | 29 templates; `assets/gallery.html` rebuilt |
| Checker and tests rescoped | Done | corpus PASSED; suite 87/87 |
| Six documents rewritten and reviewed | Done | `changelog/v2.4.0.0.md`; GLM read-only review |

### Deviations and findings

| Item | Note |
|------|------|
| The disclosure rule that closed tables on tooltip forms was reversed | The operator asked for tables open by default; the old rule's reason (the card would duplicate the table) is recorded in the checker comment and the contract, and the new rule's reason beside it |
<!-- /ANCHOR:log -->
