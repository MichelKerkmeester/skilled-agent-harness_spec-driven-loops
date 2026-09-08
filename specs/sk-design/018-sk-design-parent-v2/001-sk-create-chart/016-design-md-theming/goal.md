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
    last_updated_at: "2026-09-08T07:20:00Z"
    last_updated_by: "claude-conductor"
    recent_action: "Opened the packet; build waits for phase 15 to be committed"
    next_safe_action: "Dispatch the build once phase 15 is committed"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-016-design-md-theming"
      parent_session_id: null
    completion_pct: 5
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

- [ ] `node .opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs` themes two forms from the bundled stripe `DESIGN.md` into a directory and `check-corpus.cjs --extra <dir>` prints `RESULT: PASSED` on them
- [ ] The same script refuses a fixture whose accent fails the mark gate, writing nothing and naming role, ratio and gate
- [ ] A themed copy differs from its source only in palette blocks, provenance comment, font stacks and corner ladder
- [ ] One stripe-themed delivery sits under `assets/examples/` and the full corpus prints `RESULT: PASSED` static and under `--render`
- [ ] `SKILL.md` routes a `DESIGN.md` request to the script; `references/design-md-theming.md`, `template-contract.md`, `color-system.md` and `changelog/v1.4.0.0.md` record the fourth system
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
| Packet opened with the seven scope items | Done | this file; `spec.md` section 3 |

### Deviations and findings

| Item | Note |
|------|------|
| None yet | |
<!-- /ANCHOR:log -->
