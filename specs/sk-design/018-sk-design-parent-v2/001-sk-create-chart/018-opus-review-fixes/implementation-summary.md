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
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/018-opus-review-fixes"
    last_updated_at: "2026-09-08T08:14:39Z"
    last_updated_by: "claude-conductor"
    recent_action: "Fixed the fresh-review findings and proved the checker rules by mutation"
    next_safe_action: "Commit with the chart package"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-018-opus-review-fixes"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions: []
---
<!-- SPECKIT_TEMPLATE_SOURCE: impl-summary-core | v2.2 -->
# Implementation Summary

<!-- SPECKIT_LEVEL: 1 -->
<!-- HVR_REFERENCE: .opencode/skills/sk-doc/sk-create-with-human-voice/references/hvr-rules.md -->

---

<!-- ANCHOR:metadata -->
## Metadata

| Field | Value |
|-------|-------|
| **Spec Folder** | 018-opus-review-fixes |
| **Completed** | 2026-09-08 |
| **Level** | 1 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

A reviewer with no context reproduced ten findings against the shipped chart packets. The five that mattered are closed with proof; the rest are closed or recorded.

### fixes from the fresh Opus review of the chart packets

The checker no longer lets a themed block through when a role is not a six-digit hex, and it refuses two series a reader cannot tell apart; the mapper applies the same rule, so the cursor default now ends on ember, verdant, crimson and ash rather than two greens. Provenance paths are repository-relative. Multi-series cards name the category in the header and the series on the row. The 016 evidence cells point at lines that hold and at captures made by the committed script.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `scripts/check-corpus.cjs` | Modified | Hex-only roles, distinguishability gate, `hueGap`, unused exports removed, type scale read from the palette source |
| `assets/color/palettes.json`, `references/template-contract.md` | Modified | `typeScale` carries the chart roles, departures and the sheet scale |
| `scripts/apply-design-md.cjs` | Modified | Distinguishability on admit, relative provenance, stack-aware fonts |
| `references/design-md-theming.md` | Modified | Rules as implemented |
| `assets/templates/grouped-bars.html`, `assets/templates/stacked-bars.html`, `assets/examples/grouped-bars-stripe-style.html` | Modified | Category-headed cards; delivery palette regenerated |
| `assets/templates/*.html`, `assets/examples/*.html` | Modified | `fig-label` |
| `../016-design-md-theming/` | Modified | Citations, test count, captures; generated scratch removed |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Each checker rule was proved by a mutation on a themed copy scanned with `--extra`, recorded in `scratch/mutations.txt`. Tests, the static gate, and the render gate on the corpus and on the whole default-themed set were rerun by the conductor. The review's confirmed-clean list (no stock assertion weakened, `--extra` skips nothing, deterministic output, comment hygiene clean) stands as the baseline.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| Distinguishability is contrast or hue, not both | A category set tells colours apart by hue where a ramp tells them apart by weight; requiring the ramp step alone would refuse every real brand palette |
| Ink is the last neutral fallback, not the first | It keeps the highlighted mark distinct from the fourth series |
| The chart type scale lives in the palette source | The checker reads `typeScale.roles` and `departures` for forms and `sheetRoles` for the two proof sheets, so a change of register is a change to one file |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `node --test scripts/tests/` | PASS, 6/6 |
| `check-corpus.cjs` static | PASS, `design-md` 70 assertions, 0 failures |
| `check-corpus.cjs --render`, and `--extra` on the default-themed set with `--render` | PASS |
| Three mutations: rgb role, eight-digit role, twin greens | Each FAIL line recorded in `scratch/mutations.txt` |
| `validate.sh --strict` on 016 | PASS, `AC_COVERAGE advisory: 9/9 ACs have evidence` |
| `validate.sh --strict` on this packet | PASS |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **None open from the review.** Every finding is fixed; the reviewer's confirmed-clean list is the baseline.
<!-- /ANCHOR:limitations -->

---


