---
title: "Goal: shadcn visual upgrade"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/015-shadcn-visual-upgrade"
    last_updated_at: "2026-09-08T05:30:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Build verified: render gate, captures, review; packet closed"
    next_safe_action: "Commit the packet and the chart package together"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-015-shadcn-visual-upgrade"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: shadcn visual upgrade

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Raise the 26 standalone chart templates, their four deliveries, the gallery and the screenshots to the visual register of shadcn's frozen chart examples, card anatomy with a footer, bare axes, horizontal dashed grid, rounded marks, gradient areas, a bordered tooltip card and legend chips, with the checker's visual families retuned to the new values and every palette gate, form decision and phase 14 contract left intact.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Every visual value is measured from the phase 13 frozen shadcn copy and cited; nothing is fetched |
| D2 | Checker visual families are retuned, never removed: per-family assertion counts may rise but not fall |
| D3 | Palette values and their numeric gates do not change; a form that fails a gate is fixed in the form |
| D4 | The form catalogue, phase 14's three contracts, the table fallback and the inert-versus-tooltip register stay as they are |
| D5 | Assertion first: the legend and tooltip-card assertions fail on a mutated copy before the corpus is edited to pass them |

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

- [x] `node .opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with zero errors and lists `legend` and `tooltip-card`
- [x] Every template shows the card footer, bare axes, horizontal-only grid, rounded marks and, where it applies, gradient areas, the tooltip card and legend chips
- [x] `screenshots/` is regenerated for every form and delivery in both schemes, and `gallery.png` shows a light column that is light
- [x] No per-family assertion count in the checker fell, no palette value or gate changed, no external reference entered a template
- [x] `template-contract.md`, `color-system.md` and `changelog/v1.3.0.0.md` state the visual system; an independent review confirms three forms against three shadcn examples
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
| Packet opened with the eight visual moves as scope | Done | this file; `spec.md` section 3 |
| Build by GPT-5.6 Luna via codex: 26 templates, 6 deliveries, checker, gallery, references, changelog | Done | `scratch/codex-luna-last-message.md`; static gate `RESULT: PASSED` |
| Conductor fixes: light pin honoured by templates and checker, ticks in the body typeface, real per-form footer findings in 32 files | Done | `gallery.png` light column light; `Summary: errors: 0` |
| Render gate and screenshots on the final corpus | Done | `--render` `RESULT: PASSED`; `rendered 36, failed 0` |
| Independent Sonnet review of the diff | Done | recorded in `implementation-summary.md` |

### Deviations and findings

| Item | Note |
|------|------|
| Single-series colour | Amended section 3 item 8: a lone series uses the first token of its own colour system, not the categorical palette, because the categorical emphasis token is ink and the orange highlighted mark would vanish |
| Gallery light column | Found rendering dark in `screenshots/gallery.png` before this packet; the frame pins `color-scheme` while templates key off `prefers-color-scheme` |
<!-- /ANCHOR:log -->
