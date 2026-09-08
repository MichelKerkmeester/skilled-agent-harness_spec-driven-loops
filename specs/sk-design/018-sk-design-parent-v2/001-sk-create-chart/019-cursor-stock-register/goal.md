---
title: "Goal: cursor bundle as the stock chart register"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/019-cursor-stock-register"
    last_updated_at: "2026-09-08T10:05:17Z"
    last_updated_by: "scaffold"
    recent_action: "Rebased the stock register on the cursor reference and regenerated the corpus"
    next_safe_action: "Commit with the chart package"
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
# Goal: cursor bundle as the stock chart register

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Make the cursor Style Reference the stock chart register: derive the palette source, every stock palette block, the body typeface and the corner ladder from it under the corpus gates, moving a value only where nothing measured clears and naming each move, so a stock template and a `--default` themed copy are the same register.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every stock value is a cursor table value or a minimal move named in the palette source |
| D2 | The checker does not change; the existing families are the proof |
| D3 | The dark ground is the reference's ink; the dark rule is that ground's ink at the stock alpha |
| D4 | The ordered ramp is ember drawn toward each ground; it does not rotate hue at the theme boundary |

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

- [x] `palette-source` and `palette-source-dark` report zero failures on the cursor-derived source
- [x] All 35 stock files carry the regenerated blocks and the typeface; `check-corpus.cjs --render` prints `RESULT: PASSED`
- [x] `color-system.md` names the reference and the four moves; changelog v1.5.0.0 and the version fields carry the bump
- [x] Captures and gallery regenerated and read
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
| Derivation with gates | Done | `scratch/derive-cursor.cjs` prints every ratio |
| Source and 35 blocks rebased | Done | `scratch/rebase-cursor.cjs`; static gate `RESULT: PASSED` |
| References, changelog, versions | Done | files listed in `spec.md` |
| Render gate and captures | Done | `check-corpus.cjs --render` `RESULT: PASSED`; `rendered 37, failed 0` |

### Deviations and findings

| Item | Note |
|------|------|
| Ordered ramp far end | Ember at 3.28:1 leaves no room for five rungs above the parchment; the far end is drawn toward ink to 3.64:1 and named in the source |
| Dark rule | First pass carried the light ink at alpha; the dark rule must be that ground's own ink, so it is parchment at alpha |
<!-- /ANCHOR:log -->
