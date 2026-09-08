---
title: "Goal: visual polish pass on the chart corpus"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/022-visual-polish"
    last_updated_at: "2026-09-08T18:22:02Z"
    last_updated_by: "scaffold"
    recent_action: "Opened the packet; build dispatched to GLM-5.3-Flash via pi"
    next_safe_action: "Verify the build with the render gate and captures"
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
# Goal: visual polish pass on the chart corpus

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make every chart form and delivery read as a finished product card: the authoring note leaves the visible source line, cartesian plots rise to 50 to 56 percent of frame width, the data table folds behind a disclosure, the finding carries an inline direction cue declared in a FINDING block, ticks and cards format large numbers compactly with a declared unit, and the contract text matches the shipped fade, all held by the checker with no palette value or gate changed.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | The source line is the source; instructions live in script comments |
| D2 | Proportion moves per form toward 16:9 only where the data fills the height; ordered and non-cartesian forms may keep theirs |
| D3 | The table stays in the DOM under `data-chart-table`; the disclosure hides paint, not content |
| D4 | Numbers are formatted by hand; `toLocaleString` and `Intl` stay forbidden |
| D5 | Each new assertion is shown failing on a mutated copy before the corpus passes it |

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

- [ ] No visible source line contains "Replace the data block"; the `source-line` family holds it
- [ ] Every cartesian plot is 50 to 56 percent of frame width; `scratch/proportions.md` lists all 26
- [ ] Every table sits under a `details` disclosure and the card-readout render check still passes
- [ ] Every finding declares `FINDING.trend` and draws its cue; every tooltip form declares `READOUT.unit`
- [ ] `check-corpus.cjs --render` prints `RESULT: PASSED`; captures regenerated; contract and changelog updated
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
