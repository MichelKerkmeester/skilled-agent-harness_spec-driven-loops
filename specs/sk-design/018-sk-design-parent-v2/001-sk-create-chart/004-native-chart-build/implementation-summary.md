---
title: "Implementation Summary: Phase 4 native chart build"
description: "The colour system, the template contract and the corpus check landed first, and the twenty chart forms and six deliveries were authored on top of them. The whole corpus passes the check with rendering on."
trigger_phrases:
  - "chart corpus built"
  - "chart forms authored"
  - "chart corpus check"
  - "native chart build status"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/004-native-chart-build"
    last_updated_at: "2026-09-02T13:45:00Z"
    last_updated_by: "phase-4-forms-author"
    recent_action: "Authored twenty chart forms, six deliveries and their catalog rows"
    next_safe_action: "Route the mode into the sk-doc hub, which phase 5 owns"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/references/catalog.md"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates"
      - ".opencode/skills/sk-doc/sk-create-chart/assets/examples"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "phase-4-forms"
      parent_session_id: null
    completion_pct: 85
    open_questions:
      - "Whether the six question families are the right shelves for a reader picking a chart"
      - "Whether twenty forms leaves a common question with no row"
    answered_questions:
      - "How many colour systems, and what varies between them"
      - "Whether a delivery file carries a shared runtime, recorded as ADR-003"
      - "What a template may depend on, recorded as ADR-004"
      - "Whether report mode is cut, recorded as ADR-007"
      - "What assets/examples holds, recorded as ADR-008"
      - "What a family means once one visual register ships, recorded as ADR-009"
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
| **Completed** | Yes. Foundation layer and chart corpus |
| **Level** | 3 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A chart corpus that opens on a double click: three colour systems with derived values and computed
contrast gates, a template contract of thirteen enforced rules, a corpus check shown to fail on
each of them, twenty chart forms and six finished deliveries.

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

### The chart forms

Twenty files under `assets/templates/`, one catalog row each, sized by data-shape coverage rather
than by chart count. The first pass covers comparison in both orientations, grouped comparison,
part-to-whole as a unit grid and as a ring of countable marks, stacked composition, independent
percentages, the daily line, the daily range, the calendar grid, the distribution strip, the
scatter, the waterfall, single-value progress and a two-level treemap. The second pass adds the
five shapes with no honest substitute: four-value period data, the five-number summary, parallel
axes, continuous-time composition and a heat matrix.

Every form draws its own marks as inline vector output. Nothing animates, nothing fetches and no
file carries a colour value outside its palette block.

### The deliveries

Six files under `assets/examples/`, one per question family, each shaped exactly as a recipient
receives it. A delivery differs from a template in the headline, the subtitle, the source line and
the data, and in nothing else. The drawing code is the same code, which is the point of having a
form.

### The corpus check

`scripts/check-corpus.cjs`, dependency-free, enforcing every rule the contract states. It computes
contrast from the palette file rather than from a copy, resolves the catalog index in both
directions, and never asserts that any document contains any particular sentence. With `--render`
it opens each file in a headless browser, which is the only check that catches a chart that draws
nothing.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/color/palettes.json` | Created | The single source of truth for colour, roles, gates and capacities |
| `assets/color/palette-sheet-neutral.html` | Created | The skeleton every template copies, and the neutral system's proof sheet |
| `assets/color/palette-sheet-ordered.html` | Created | The ordered system's proof sheet |
| `assets/color/palette-sheet-categorical.html` | Created | The categorical system's proof sheet |
| `assets/templates/` | Created | Twenty chart forms: `bar-rows`, `bar-columns`, `grouped-bars`, `unit-grid`, `unit-ring`, `stacked-bars`, `independent-percentages`, `treemap`, `daily-line`, `daily-range`, `calendar-grid`, `waterfall`, `progress-single`, `distribution-strip`, `scatter`, `candlestick`, `stacked-area`, `box-plot`, `parallel-axes`, `heat-matrix` |
| `assets/examples/` | Created | Six deliveries, one per family: `staff-hours-by-service`, `where-the-budget-went`, `orders-after-the-price-change`, `pick-times-by-depot`, `van-age-against-repair-cost`, `calls-by-day-and-hour` |
| `references/color-system.md` | Created | The systems, the roles, the rules and the enforced-against-advisory split |
| `references/template-contract.md` | Created | The delivery unit and the thirteen enforced rules |
| `references/catalog.md` | Created, then filled | The index, its column contract and twenty rows across six families |
| `references/README.md` | Modified | Routes to the three documents above, and no longer says the catalog is empty |
| `scripts/check-corpus.cjs` | Created | The corpus check |
| `scripts/README.md` | Modified | How to run it, how to read a run, how to prove it fails |
| `specs/.../004-native-chart-build/decision-record.md` | Created, then extended | Eleven decisions, six for the foundation and five for the corpus |
| `specs/.../004-native-chart-build/research/foundation-record.md` | Created | Measurements, failing and passing runs, the reference scan |
| `specs/.../004-native-chart-build/research/corpus-record.md` | Created | Coverage, what was left out, and the defects the visual pass caught |

Paths under the packet are relative to `.opencode/skills/sk-doc/sk-create-chart/`.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

This phase ran in two sessions. The foundation layer landed first and the chart forms were
authored on top of it in a second session, both from the capability analysis in
`../002-translation-and-voice/research/`, with the reference tree closed throughout. The colour values were derived with a contrast solver rather than picked
by eye, and a bug in the first solver, a blue channel that skipped linearization, was caught
because the numbers it produced disagreed with the shapes on screen.

The check was written before the corpus grew, then broken nine ways on purpose. Every break was
applied to a passing corpus, run and restored from a backup taken beforehand. It also caught two
defects in itself during construction, an inverted monotonic comparison and a check that could
fail without registering an assertion count.

The forms were authored in three batches, with the check run after each one, so a mistake in the
idiom surfaced on three files rather than on twenty. The first pass was proven complete before the
second pass started. Every form was then opened from a `file://` URL and the rendered page read,
which is where the eight defects listed in `research/corpus-record.md` were found. None of them
was visible to any automated check.

Nothing is committed and nothing is pushed. The two paths are staged.
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
| Report mode is cut, and its directory with it | Keeping it means authoring twelve page layouts from nothing, for a request nobody has made |
| A family is a question group, carried as a catalog column | One visual register ships, so the reading-contract meaning has nothing to separate, and ADR-008 still needs families to be enumerable |
| A label on a mark picks its colour at runtime | A hardcoded map from series slot to text role is a third copy of the palette, wrong the first time a value moves and checked by nothing |
| Demo data is literal, derived spacing uses an integer mixer | A data block holding a generator is a data block an editor cannot edit, and a pure function of the index makes two renders agree |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node scripts/check-corpus.cjs` | PASS. `RESULT: PASSED`, exit 0, fourteen checks reporting assertion counts |
| `node scripts/check-corpus.cjs --render` | PASS. `RESULT: PASSED`, exit 0, 29 files opened in headless Chrome, 20 chart forms reported |
| Nine deliberate breaks, foundation phase | Each produced `RESULT: FAILED` and exit 1 on the intended check, and the corpus returned to `RESULT: PASSED` |
| Catalog check, second direction, observed live | Every template authored before its row existed produced `RESULT: FAILED` naming the file and its identity |
| Empty-box negative control | Static run passed and the `--render` run failed, which is the whole reason render mode exists |
| Visual pass, every template and delivery opened from a `file://` URL | Eight defects found and fixed, none of them visible to any automated check. Listed in `research/corpus-record.md` |
| Browser-side contrast arithmetic | Matches the Node-side computation to two decimals across the ordered system |
| `hvr_scan.py` on the corpus record and this summary | 0 hard blockers each |
| Reference-content scan | No colour literal outside a palette block, asserted 878 times. No reference project name anywhere |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **No check reads a headline against its own numbers.** Three of the eight defects the visual pass caught were headlines that misstated the data beneath them. Every one of those files rendered perfectly and passed every check. A second reader is the only control there is.
2. **`SKILL.md` and `README.md` at the package root still describe report mode and galleries.** They tell an author to open a gallery page and lift a card's render block. There are no gallery pages, report mode is cut by ADR-007 and one form is one file. Phase 5 owns those two files.
3. **Drawing code is duplicated per template.** The consequence of having no build step, accepted in ADR-003. Four templates now carry the same axis ladder and four carry the same contrast arithmetic, which is where a generation step would first pay for itself.
4. **The render check is opt-in.** Without `--render` nothing has been opened. This is deliberate, so that a machine with no browser can never produce a silent skip that looks like a pass.
5. **The separator stroke is a drawing obligation the check cannot see.** A form that stacks shapes without it will pass and still look wrong. Every stacking form here carries it, and that was confirmed by eye rather than by machine.
6. **Sustained headless Chrome launches intermittently fail on this machine.** Render failures appeared in four runs, on four different files, and every one of those files passed the same check in another run. Running all 29 files by hand gave 29 successes, running them from Node the way the check does gave 29 successes, and giving each launch its own profile changed nothing. Clean runs follow a pause and red runs follow other browser work, so the cause is Chrome refusing to start under sustained back-to-back launches. The check discards the browser's stderr, so its message names the symptom. The rule for a future red run: a different file each time that does not reproduce by hand is the browser, and the same file every time is a chart drawing nothing.
<!-- /ANCHOR:limitations -->

---
