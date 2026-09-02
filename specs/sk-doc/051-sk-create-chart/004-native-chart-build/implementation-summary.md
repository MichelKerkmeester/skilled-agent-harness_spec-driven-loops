---
title: "Implementation Summary: Phase 4 foundation layer"
description: "The colour system, the template contract and the corpus check landed. The chart forms are authored on top of them and are not built yet."
trigger_phrases:
  - "chart foundation summary"
  - "chart colour system built"
  - "chart corpus check"
  - "native chart build status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/004-native-chart-build"
    last_updated_at: "2026-09-02T12:40:00Z"
    last_updated_by: "phase-4-foundation-implementer"
    recent_action: "Built the phase-4 foundation layer"
    next_safe_action: "Author the chart forms against references/template-contract.md, one catalog row per form"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-4-foundation"
      parent_session_id: null
    completion_pct: 40
    open_questions:
      - "Whether report mode is cut, which decides if assets/reports is dead"
    answered_questions:
      - "How many colour systems, and what varies between them"
      - "Whether a delivery file carries a shared runtime, recorded as ADR-003"
      - "What a template may depend on, recorded as ADR-004"
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
| **Spec Folder** | 004-native-chart-build |
| **Completed** | Partial. Foundation layer only |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The foundation the chart corpus is authored on top of: three colour systems with derived values
and computed contrast gates, a template contract of thirteen enforced rules and a corpus check
that has been shown to fail on each of them. The chart forms themselves are not built. This layer
is a contract later authors code against rather than a first draft they revise.

### The colour system

Three systems, `neutral`, `ordered` and `categorical`, separated by what colour encodes. All
eighteen values live in
`.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json` and nowhere else, and every
one was derived by mixing a base hue toward the surface or the ink until it landed on a target
contrast ratio. Three palette sheets render every value in a browser, and each sheet computes its
own contrast arithmetic from what the browser resolved.

### The template contract

A template is one HTML file that opens with no install, no build step and no remote dependency of
any kind. The palette arrives inline as a sentinel-marked block of CSS custom properties, the data
arrives in a second sentinel-marked block at the top of the script, and everything below the data
renders. The delivered file stays editable by hand end to end, which is the resolution recorded as
ADR-003.

### The corpus check

`scripts/check-corpus.cjs`, dependency-free, enforcing every rule the contract states. It computes
contrast from the palette file rather than from a copy, resolves the catalog index in both
directions, and never asserts that any document contains any particular sentence. With `--render`
it opens each file in a headless browser, which is the only check that catches a chart that draws
nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json` | Created | The single source of truth for colour, roles, gates and capacities |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-neutral.html` | Created | The skeleton every template copies, and the neutral system's proof sheet |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-ordered.html` | Created | The ordered system's proof sheet |
| `.opencode/skills/sk-doc/sk-create-chart/assets/color/palette-sheet-categorical.html` | Created | The categorical system's proof sheet |
| `.opencode/skills/sk-doc/sk-create-chart/references/color-system.md` | Created | The systems, the roles, the rules and the enforced-against-advisory split |
| `.opencode/skills/sk-doc/sk-create-chart/references/template-contract.md` | Created | The delivery unit and the thirteen enforced rules |
| `.opencode/skills/sk-doc/sk-create-chart/references/catalog.md` | Created | The index and its column contract, with no chart rows yet |
| `.opencode/skills/sk-doc/sk-create-chart/references/README.md` | Modified | Routes to the three documents above, and records that report mode is not built |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs` | Created | The corpus check |
| `.opencode/skills/sk-doc/sk-create-chart/scripts/README.md` | Modified | How to run it, how to read a run, how to prove it fails |
| `specs/sk-doc/051-sk-create-chart/004-native-chart-build/decision-record.md` | Created | The six foundation decisions |
| `specs/sk-doc/051-sk-create-chart/004-native-chart-build/research/foundation-record.md` | Created | Measurements, failing and passing runs, the reference scan |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Built from the capability analysis in `../002-translation-and-voice/research/`, with the reference
tree closed throughout. The colour values were derived with a contrast solver rather than picked
by eye, and a bug in the first solver, a blue channel that skipped linearization, was caught
because the numbers it produced disagreed with the shapes on screen.

The check was written before the corpus grew, then broken nine ways on purpose. Every break was
applied to a passing corpus, run and restored from a backup taken beforehand. It also caught two
defects in itself during construction, an inverted monotonic comparison and a check that could
fail without registering an assertion count.

Nothing is committed. The two paths are staged.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Three colour systems rather than four | The fourth, a neutral palette with one accent, is what filling the emphasis role already produces |
| One shared chrome, only the data roles vary | Three grounds would make three charts look like three products |
| The palette is inlined declaratively, with no shared runtime | The tension between a single source and a hand-editable file is false once the inlined thing is values rather than functions |
| No remote dependency at all | A CDN turns "it opens on a double click" into "it opened while the network was up" |
| The contrast gate is selected by what the colour encodes | A flat pairwise gate is arithmetically unsatisfiable past two values, and a flat ramp gate deletes the light end of every scale |
| The index is a parsed table checked in both directions | A row that exists is not a row that points anywhere, which is the reference's most damaging measured defect |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs` | PASS. `RESULT: PASSED`, exit 0, 14 checks reporting assertion counts |
| `node scripts/check-corpus.cjs --render` | PASS. `RESULT: PASSED`, exit 0, three files opened in headless Chrome |
| Nine deliberate breaks | Each produced `RESULT: FAILED` and exit 1 on the intended check, and the corpus returned to `RESULT: PASSED` |
| Empty-box negative control | Static run passed and the `--render` run failed, which is the whole reason render mode exists |
| Browser-side contrast arithmetic | Matches the Node-side computation to two decimals across the ordered system |
| `hvr_scan.py` on all five markdown files | 0 hard blockers each |
| Reference-content scan | 18 hex values declared, 18 found, 0 not traceable to the palette source. No reference project name anywhere |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No chart forms exist.** `assets/templates/` is empty and the catalog carries no rows, so the packet still cannot answer a chart request. The catalog check passes vacuously and the run prints the form count so that cannot be mistaken for coverage.
2. **Report mode is undecided.** The capability analysis recommends cutting it. Nothing was built and nothing was deleted, so `assets/reports/` is empty and the packet's `SKILL.md` and `README.md` still describe report templates.
3. **Drawing code will be duplicated per template.** The consequence of having no build step, accepted in ADR-003. The palette values are the part protected from drift, not the drawing.
4. **The render check is opt-in.** Without `--render` nothing has been opened. This is deliberate, so that a machine with no browser can never produce a silent skip that looks like a pass.
5. **The separator stroke is a drawing obligation the check cannot see.** A form that stacks shapes without it will pass and still look wrong. It is a review question.
<!-- /ANCHOR:limitations -->

---
