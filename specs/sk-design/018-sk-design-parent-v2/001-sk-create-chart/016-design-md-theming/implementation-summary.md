---
title: "Implementation Summary"
description: "A local DESIGN.md applicator now produces deterministic, gated chart deliveries without changing the stock corpus."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/016-design-md-theming"
    last_updated_at: "2026-09-08T07:11:51Z"
    last_updated_by: "codex-leaf"
    recent_action: "Closed after the conductor render gates and review fixes"
    next_safe_action: "Commit with the chart package"
    blockers:
      - "Chrome headless returned no document for render, card-readout and pointer-reach checks in this sandbox"
    key_files:
      - ".opencode/skills/sk-design/sk-design-chart/scripts/apply-design-md.cjs"
      - ".opencode/skills/sk-design/sk-design-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-design/sk-design-chart/assets/examples/grouped-bars-stripe-style.html"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "codex-016-design-md-theming"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 2 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 016-design-md-theming |
| **Completed** | 2026-09-08 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The chart corpus can now take a local v3 `DESIGN.md` and produce deterministic, provenance-bearing
copies whose colours clear the corpus gates before anything is written. Stock templates, palettes
and the three built-in systems remain untouched; the new path is an adapter for deliveries.

### theme charts from a DESIGN.md style reference

You can select forms with `--forms` or `--all`, choose a light, dark or both-theme derivation, and
optionally supply the local `tokens.json`. The applicator reads the v3 colour, typography and
radius headings, maps them into the chart role vocabulary, prints each mapping and refuses a
palette that misses a gate. A themed file carries the input path, SHA-256 and generator version
under both palette markers, so the checker can accept it without opening a source-equality hole.

The Stripe proof delivery is `assets/examples/grouped-bars-stripe-style.html`. It contains real category data,
the headline `Two periods compared across categories`, and the source line identifies marketing
analytics signup attribution by channel year over year. The checker also accepts outside themed
copies with `--extra` while keeping them out of the stock gallery and catalog.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/apply-design-md.cjs` | Created | Parses v3 headings, derives both themes, gates them, and writes deterministic copies. |
| `scripts/color-gates.cjs` | Created | Shares contrast arithmetic between the applicator and checker. |
| `scripts/check-corpus.cjs` | Modified | Adds the provenance-gated `design-md` branch and `--extra`. |
| `scripts/tests/apply-design-md.test.cjs` and `scripts/tests/fixtures/refusal-design.md` | Created | Covers four fixtures, missing sections, refusal and byte identity. |
| `assets/examples/grouped-bars-stripe-style.html` | Created | Supplies the Stripe-themed proof delivery. |
| `references/design-md-theming.md` | Created | Documents parsing, role mapping, gates, refusal and provenance. |
| `references/template-contract.md`, `references/color-system.md`, `scripts/README.md`, `SKILL.md`, `README.md`, `changelog/v1.4.0.0.md` | Modified/Created | Records the fourth adapter, routing, usage and version bump. |
| `scratch/parse-contract.md`, `scratch/checker-notes.md`, `scratch/mutations.md` | Created/Updated | Keeps the parser contract, checker boundary and mutation receipts. |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The implementation was built after phase 15 was confirmed at commit `6d4ef47150`. The applicator
was syntax-checked, exercised by `node --test` and run against Stripe for `bar-columns` and
`daily-line`; that exact run wrote both files and ended with `RESULT: PASSED`. The outside scan
reported 38 files, 156 `design-md` assertions and zero errors; the in-package scan reported 36
files, 52 `design-md` assertions and zero errors. The malformed provenance, below-mark series and
one-byte stock palette mutations each returned their recorded failure line and were restored.

The requested render gate was attempted. Chrome returned no document for the render, readout and
pointer walks in this sandbox, so that command exited 1 with 82 browser failures; static and
settled/dark checks still reported zero failures. AC-006 therefore remains `Unmet` for the
conductor to rerun outside this sandbox.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Keep extraction in `sk-design-md-generator` and application here | The chart package receives a local v3 artifact and never fetches or invents site values. |
| Share contrast math through `scripts/color-gates.cjs` | The applicator and checker must compute the gates identically, including the transfer curve and rounding. |
| Preserve the existing chart identity while changing only themed regions | The delivery contract requires byte identity outside palettes, fonts and the corner ladder. |
| Require provenance plus inline gates for `design-md` | A themed copy needs a verifiable source without weakening stock source equality. |
| Refuse before creating the output directory on a failed gate | There is no partial delivery and no force escape hatch. |
| Series and emphasis are measured or nothing (conductor amendment) | The first build darkened accents toward ink to clear a gate, which put values in the provenance block the Style Reference never held; a hue that misses the gate is now skipped and neutral text tones fill the rest, with the ink last and available for emphasis. |
| Muted comes from neutral text tones only, darkened minimally when needed (conductor amendment) | The first build chose a crimson text accent as muted and set ticks and captions in it; a caption tone that sits just under the text gate is now darkened by the least amount that clears it, and the mapping line says so. |
| Ramp gates apply to magnitude ramps, not to themed blocks; ordered forms are refused (conductor amendment) | The stock checker gates neutral and categorical systems by the mark ratio alone; a colour table cannot supply a single-hue ramp, so `bullet`, `calendar-grid`, `heat-matrix` and `progress-single` keep the stock ordered system. |
| Series are ordered by hue distance, and `--default` themes from the cursor bundle | Two greens no longer sit side by side while a red waits in the table; the cursor bundle was chosen from a survey of the 1,219 usable style-library bundles for its warm chrome, muted ladder and gate-clearing accents. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --check scripts/apply-design-md.cjs` | PASS, exit 0. |
| `node --test scripts/tests/` | PASS, 6 tests, 0 failures (two added by the conductor: the default reference themes a categorical form; an ordered form named outright is refused). |
| Stripe apply command | PASS, wrote `bar-columns.html` and `daily-line.html`; `RESULT: PASSED`. |
| `check-corpus.cjs --extra <dir>` | PASS on a default-themed set of 22 forms, `Summary: errors: 0`, `RESULT: PASSED`; the generated set is not kept under scratch, one documented command reproduces it. |
| `check-corpus.cjs` | PASS, `Summary: errors: 0`, `RESULT: PASSED`; the `design-md` family reports 70 assertions after the fresh-review fixes (six-digit roles and series distinguishability). |
| Mutation receipts | PASS, three exact failures recorded in `scratch/mutations.md`; all targets restored. |
| `check-corpus.cjs --render` (conductor) | PASS on the corpus with the proof delivery, `Summary: errors: 0`, `RESULT: PASSED`; PASS with `--extra` on the whole default-themed set. |
| Default and example derivations (conductor) | PASS: `--default --all` themed 22 forms and skipped the four ordered ones with a note; stripe, vercel, linear and supabase each derived two gated grounds with measured series. |
| Independent Sonnet review (conductor) | Returned FAIL with one P0, one P1, two P2. P0 (non-deterministic output) was an artefact of the review running while the mapper was being amended; on the settled tree three separate processes produced byte-identical files (sha `d420b59a…` and `d488184…` three times). P1 (themed copy kept its stock `chart-color-system` meta and the checker carried an exception for it) fixed: the writer rewrites the meta and the exception is gone. P2 (delivery name off the spec's path; undocumented chromatic threshold) fixed. |
| `validate.sh --strict --no-recursive` | PASS, `Summary: Errors: 0  Warnings: 0`, `RESULT: PASSED`; AC coverage line pasted from the final run in the fresh-review packet, `018-opus-review-fixes/implementation-summary.md` |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **Muted may leave the table.** When a bundle has no neutral text tone that clears the text gate,
   the nearest one is darkened by the least amount that clears, and the mapping line records the
   value. Every other role is a table value or the stock dark chrome.
2. **A bundle with fewer than four gate-clearing hues borrows neutral tones for the rest.** The
   cursor default does this on the light ground only when a form declares four series; its
   captures under `scratch/captures/`, regenerated from the committed script, show the result.
3. **Ordered forms are not themed.** They keep the stock magnitude ramp inside a themed set.
<!-- /ANCHOR:limitations -->

---
