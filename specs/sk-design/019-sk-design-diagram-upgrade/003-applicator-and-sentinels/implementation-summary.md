---
title: "Implementation Summary"
description: "Open with a hook: what changed and why it matters. One paragraph, impact first."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels"
    last_updated_at: "2026-09-10T22:45:00Z"
    last_updated_by: "markdown-agent"
    recent_action: "Authored the phase documents"
    next_safe_action: "Execute T001"
    blockers: []
    key_files:
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/spec.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/plan.md"
      - "specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels/tasks.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "markdown-003-applicator-and-sentinels"
      parent_session_id: null
    completion_pct: 0
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 3 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 003-applicator-and-sentinels |
| **Completed** | Not yet — planned |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

This phase is authored, not executed. Once T001-T010 run, `sk-design-diagram` will gain what
`sk-design-chart` already has: a `DIAGRAM_PALETTE:BEGIN skin=light|dark|terminal … :END` sentinel
block in each of the four templates, and a third hand-run script, `apply-diagram-tokens.cjs`, that
themes the corpus from its own token source and reproduces the stock bytes exactly with
`--default`.

### Phase 3: applicator-and-sentinels

Once executed, this phase gives the diagram skill a mechanism it does not have today: a way to
regenerate a themed copy of its templates from a single declared token source, gated by the same
contrast arithmetic the chart skill already trusts (`color-gates.cjs`, ported rather than
imported). A future project can then run one script instead of hand-editing four `:root` blocks,
and 004's repaint has something real to drive instead of retyping 1,577 hex literals by hand.

### Files Changed (planned)

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-design/sk-design-diagram/assets/color/diagram-palette.json` | Created | The token source: 25 distinct values across three grounds, four kinds |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/color-gates.cjs` | Created | Ported four-function contrast module (`channel`, `luminance`, `contrast`, `round2`) |
| `.opencode/skills/sk-design/sk-design-diagram/scripts/apply-diagram-tokens.cjs` | Created | The applicator: CLI, gate checks, copy-out write model, `--default` |
| `.opencode/skills/sk-design/sk-design-diagram/assets/templates/*.html` (four files) | Modified | One sentinel block inserted per file |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Not yet delivered. The planned path: T001 has the operator ratify plan.md's three ADRs, then GLM
executes T002-T009 in file order, ending with T007's byte-diff phase gate. T010 is a human review
of the four templates' unchanged font declarations. Rollout is not a deployment — every artifact
is a git-tracked file inside this repository, read by a later hand-run script, not a running
service.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Port `color-gates.cjs` rather than import it across skills (ADR-001) | D12 freezes the chart skill; a runtime cross-skill import would make the diagram applicator depend on a file outside its own boundary with no declared coupling |
| One `DIAGRAM_PALETTE` block per file, not the chart's begin/end pair (ADR-002) | Parent D1 forbids `prefers-color-scheme` blocks, and 0/38 diagram files use that pattern; a diagram is exported at one ground, not switched live |
| The sentinel wraps only `--color-*` declarations inside the existing `:root`, not the whole rule (ADR-003) | D2 already ships the font fallback chains inside the same `:root`; a color-only tool should not have the power to rewrite them |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `apply-diagram-tokens.cjs --default --out <dir>` then `diff -rq <dir> assets/templates` | Not yet run — planned as T007, the phase's own handoff gate to 004 |
| `grep -c "DIAGRAM_PALETTE:BEGIN" assets/templates/*.html` reports `1` per file | Not yet run — planned as T008 |
| `grep -c "DIAGRAM_PALETTE_DARK" assets/templates/*.html` reports `0` per file | Not yet run — planned as T009 |
| `validate.sh specs/sk-design/019-sk-design-diagram-upgrade/003-applicator-and-sentinels --strict` | Not yet run — to be run by the orchestrator, not this authoring pass |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The applicator will only cover the four templates.** Extending `apply-diagram-tokens.cjs` to the 34 examples (a `--forms`/`--all`-style selector, mirroring the chart's own applicator) is left to 004 to add against its own repaint needs — this phase's own gate only requires the four templates.
2. **The gate values are inherited, not re-derived.** `apply-diagram-tokens.cjs` reads whatever gate table 002's derivation record signs; if that record changes after this phase ships, the applicator's refusal threshold changes with it, and T007's diff must be rerun.
<!-- /ANCHOR:limitations -->
