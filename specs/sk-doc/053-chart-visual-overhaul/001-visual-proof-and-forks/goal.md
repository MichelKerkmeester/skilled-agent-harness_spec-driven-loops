---
title: "Goal: Visual Proof and Forks"
description: "The durable directive this packet executes against, and the criteria that decide when it is done."
trigger_phrases:
  - "packet goal"
  - "durable directive"
  - "completion criteria"
  - "goal binding"
importance_tier: "important"
contextType: "planning"
_memory:
  continuity:
    packet_pointer: "sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-code"
    recent_action: "Authored the durable directive for the chrome proof and both forks"
    next_safe_action: "Capture the baseline corpus check before editing a template"
    blockers:
      - "The operator has not answered the weight fork or the glow fork"
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/bar-columns.html"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-001-visual-proof-and-forks"
      parent_session_id: null
    completion_pct: 0
    open_questions:
      - "Which stroke weight the operator picks"
      - "Whether one glow layer survives a print test"
    answered_questions:
      - "The four-layer glow stack is rejected by both lineages"
      - "Only two templates are touched in this phase"
---
# Goal: Visual Proof and Forks

<!-- SPECKIT_TEMPLATE_SOURCE: goal | v2.2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

> Everything above the log is DURABLE: it is what an operator sets as the session
> objective, and it must stay true for the life of the packet. Keep it short:
> the runtime goal surfaces cap what they will hold, and a truncated objective
> loses its tail, which is where the completion criteria live.

---

<!-- ANCHOR:directive -->
## 1. DURABLE DIRECTIVE

**Objective:** Apply the agreed static chrome to one line form and one bar form, then render the weight and glow forks side by side so the operator chooses by looking rather than by argument.

### Decisions

Frozen choices. Changing one is an amendment.

| ID | Decision |
|----|----------|
| D1 | Exactly two templates are touched: `daily-line.html` and `bar-columns.html`. Rolling out is phase 002 and doing it here defeats the point of proving first |
| D2 | Every chrome value is re-implemented against corpus custom properties. Nothing is copied from the vendored source, per `SKILL.md:134` |
| D3 | The glow is one low-opacity layer and it defaults to off. Both lineages reject the four-layer stack the vendored source ships |
| D4 | The phase stops at the fork rather than choosing. A default picked here is the mistake this phase exists to avoid |
| D5 | Comparison sheets live in `scratch/`. A page carrying three copies of one series is a workbench and is never handed over as a chart |
<!-- /ANCHOR:directive -->

---

<!-- ANCHOR:completion -->
## 3. COMPLETION CRITERIA

Three to seven bullets, each checkable without opening another file. Copy them
verbatim into the objective: nothing dereferences a path, so criteria left only
here are invisible to whatever judges completion.

- [ ] `node .opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs --render` prints `RESULT: PASSED` with `Summary: errors: 0`
- [ ] `git diff --name-only -- .opencode/skills/sk-doc/sk-create-chart/assets/` lists exactly `daily-line.html` and `bar-columns.html`
- [ ] `grep -c 'stroke-dasharray' .opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` returns at least 1, and the same holds for `bar-columns.html`
- [ ] `grep -c 'ui-monospace' .opencode/skills/sk-doc/sk-create-chart/assets/templates/daily-line.html` returns at least 1, and `grep -c 'toLocaleString'` over both templates returns 0
- [ ] `scratch/forks/stroke-weight.html` holds three drawings of the same readings at 2px, 1px and 0.8px, and `scratch/forks/emphasis-glow.html` holds two at one glow layer and none
- [ ] `decision-record.md` carries one ADR per fork, each naming both lineage arguments and an operator disposition
- [ ] `validate.sh specs/sk-doc/053-chart-visual-overhaul/001-visual-proof-and-forks --strict` prints `RESULT: PASSED`
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
| A1 dashed grid | Pending | Requirements table in `spec.md` |
| A1b muted tick ink | Pending | Requirements table in `spec.md` |
| A2 mono face with tabular figures | Pending | Requirements table in `spec.md` |
| A7 two-weight dot language | Pending | Requirements table in `spec.md` |
| A9 area fill fading to the baseline | Pending | Requirements table in `spec.md` |
| D1 stroke weight comparison | Pending | `scratch/forks/stroke-weight.html` |
| D2 glow comparison | Pending | `scratch/forks/emphasis-glow.html` |
| Operator disposition on both forks | Pending | `decision-record.md` |

### Deviations and findings

| Item | Note |
|------|------|
| The corpus comment and the corpus value disagree about stroke weight | `assets/templates/daily-line.html:101` reads "A hairline is the right weight here" while `:61` sets `stroke-width: 2`. No file in the packet records why two pixels was chosen. The rejecting lineage's argument was that the two pixel round cap is a deliberate print register, and the comment that would say so is not there |
| A1b is listed as its own row | It is the tick half of the same one-pass restyle one lineage ranked first, split out because it touches a different CSS rule than the grid |
<!-- /ANCHOR:log -->
