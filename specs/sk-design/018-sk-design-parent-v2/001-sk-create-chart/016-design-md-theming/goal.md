---
title: "Goal: DESIGN.md theming"
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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/016-design-md-theming"
    last_updated_at: "2026-09-08T07:11:51Z"
    last_updated_by: "claude-conductor"
    recent_action: "Closed after the conductor render gates and review fixes"
    next_safe_action: "Commit with the chart package"
    blockers:
      - "Headless Chrome returns no document for render, card-readout and pointer-reach in this sandbox"
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-016-design-md-theming"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
# Goal: DESIGN.md theming

<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Let `sk-design-chart` theme any of its forms from any v3 Style Reference `DESIGN.md` that `sk-design-md-generator` produced, on request, through one script that derives a palette in the corpus' role vocabulary, proves it against the corpus' own numeric gates, refuses to write when a gate fails, and emits themed copies with verifiable provenance, without changing a stock palette value or weakening the checker.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Application lives here, extraction stays in `sk-design-md-generator`; the script never fetches |
| D2 | A themed copy is a delivery, never a template; the stock corpus and `palettes.json` do not change |
| D3 | The `design-md` system is accepted by provenance plus the same inline numeric gates; stock systems keep byte equality |
| D4 | A failing gate refuses the write; there is no force flag |
| D5 | Build starts only after phase 15 is committed |

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

- [x] `node .opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` themes two forms from the bundled stripe `DESIGN.md` into a directory and `check-corpus.cjs --extra <dir>` prints `RESULT: PASSED` on them
- [x] The same script refuses a fixture whose accent fails the mark gate, writing nothing and naming role, ratio and gate
- [x] A themed copy differs from its source only in palette blocks, provenance comment, font stacks and corner ladder
- [x] One stripe-themed delivery sits under `assets/examples/` and the full corpus prints `RESULT: PASSED` static and under `--render`
- [x] `SKILL.md` routes a `DESIGN.md` request to the script; `references/design-md-theming.md`, `template-contract.md`, `color-system.md` and `changelog/v1.4.0.0.md` record the fourth system
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
| Packet opened with the seven scope items | Done | this file; `spec.md` section 3 |
| Phase 15 dependency confirmed | Done | `git log -1 --format='%h %s' -- .opencode/skills/sk-design/sk-design-chart` returned `416827fd10 feat(sk-design): bring the chart corpus to the shadcn visual register and plan DESIGN.md theming` |
| Local DESIGN.md applicator and checker branch | Done | `node --test scripts/tests/` passed 4 tests; static and extra corpus runs returned `RESULT: PASSED` |
| Stripe proof delivery | Done | `assets/examples/grouped-bars-stripe-style.html`; exact two-form apply run returned `RESULT: PASSED` |
| Packet close-out | Open on render | strict validation passed with `AC_COVERAGE` 9/9; AC-006 remains open on sandbox render |

### Deviations and findings

| Item | Note |
|------|------|
| Render environment | Inside the codex sandbox `check-corpus.cjs --render` could not open a document; the conductor ran the render gate on the corpus with the proof delivery and on the whole default-themed set, both `RESULT: PASSED`. |
| Mapper amendments by the conductor | Series and emphasis are measured or nothing (the build darkened them toward ink); neutral text tones fill missing series with the ink last; emphasis falls back to the ink; series are ordered by hue distance; muted comes from neutral tones only (the build once chose a crimson text accent) with a minimal darkening allowed; ramp gates dropped for design-md blocks in both the script and the checker; ordered forms refused; `--default` themes from the cursor bundle. The stripe proof delivery was regenerated so its block holds only measured values plus the stock dark chrome. |
| Stock corpus boundary | No stock template or `assets/color/palettes.json` value was changed by the DESIGN.md delivery; the design-md proof remains an example delivery. |
<!-- /ANCHOR:log -->
