---
title: "Implementation Summary"
description: "The chart packet now carries the Style Reference its stock palette was derived from, with the generator override unchanged."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/026-embedded-style-reference"
    last_updated_at: "2026-09-09T15:42:19Z"
    last_updated_by: "claude-conductor"
    recent_action: "Embedded the stock Style Reference beside the forms and repointed the default"
    next_safe_action: "Decide whether to gate the derivation, and whether to prune the four unread capture files"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-026-embedded-style-reference"
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
| **Spec Folder** | 026-embedded-style-reference |
| **Completed** | 2026-09-09 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The chart corpus's stock palette, typeface and corner ladder are a gated derivation of one Style
Reference. That reference lived in a sibling skill's library of roughly twelve hundred captures,
which the library regenerates. It now lives beside the forms it produced.

### The embedded reference

`assets/style-reference/cursor/` holds the capture verbatim, all six files, byte-identical to the
library copy. An `origin.md` beside them records where the copy came from, when, and the sha256 of
each file, and names the one file whose rename would be a trap: the applicator picks up a sidecar
named exactly `tokens.json` and reads `darkMode` from it, and `design-tokens.json` is a different
schema under a similar name, so renaming it would make the script consult a file that cannot answer
and say nothing.

`--default` reads the local copy. Overriding is untouched: the script always took a local path, so
naming any other `DESIGN.md` — including one the generator has just produced — themes from that
instead.

### Files Changed

| File | Action | Purpose |
|------|--------|---------|
| `assets/style-reference/cursor/**` | Created | The capture verbatim plus its origin record |
| `scripts/apply-design-md.cjs` | Modified | The default path, and why the copy is severed |
| `assets/color/palettes.json`, `references/color-system.md`, `references/design-md-theming.md` | Modified | Provenance now names the local copy |
| `SKILL.md`, `README.md`, `changelog/v1.10.0.0.md` | Modified / Created | Version 1.10.0.0 and the resource tables |
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

A fresh Opus on a second account was asked four questions before anything moved: which files
belong, where they should sit, how the override should behave, and whether the untied derivation is
worth gating. Its findings were verified here rather than taken: the sidecar name, the `.html`
filter in all three walkers, and a dead guard it flagged were each checked directly.

The move was proved by a baseline. `--default --all` was run before it and after it, and the 25
themed forms are identical apart from the provenance line, which now records the local path. The
sha256 that line stamps matches the pin written into `origin.md`.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| All six files embedded, against the advice to take two | The instruction was the capture and its related files, and the four with no consumer cost 130K and carry no hazard while they keep their names. The advice to prune them is recorded below rather than acted on. |
| A severed copy, not a link or a live read | A regeneration upstream would otherwise change what `--default` produces without a diff, and leave the stock palette derived from a capture that no longer exists. The cost is that a genuine upstream improvement has to be pulled in deliberately, which is the property worth having. |
| Nothing renamed | The applicator's sidecar lookup is for a file named exactly `tokens.json`. `design-tokens.json` is a different schema, so a tidying rename would make the script read a file that cannot answer and report nothing. |
| `assets/style-reference/`, not `assets/color/` or `assets/reference/` | Two checker families switch behaviour on the string prefix `assets/color/`, and `references/` already means something one level up. |
| The derivation is still not gated | Nothing holds `palettes.json` against the reference it was derived from. Building that means first promoting the four departures out of a prose note into structure. Recorded as the next step rather than folded into this move. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| `apply-design-md.cjs --default --all`, before and after the move | PASS. 25 forms both times, identical apart from the provenance path. |
| Provenance pin | PASS. The stamped `sha256=c94a9bf3f244…` matches `origin.md`'s record for `DESIGN.md`. |
| Override with a reference the packet does not own | PASS. The stripe reference themed 25 forms and stamped its own path. |
| `check-corpus.cjs` | PASS. `Summary: errors: 0`, identity 78 unchanged, so the new directory is invisible to the corpus walker. |
| Embedded files against the library copy | PASS. All six byte-identical by sha256. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The derivation is documented, not gated.** An edit to `palettes.json` or to the embedded reference drifts silently. Closing it means promoting the four departures from the palette note into structure that names each value, its gate and what it is measured against; the check on top is small by comparison.
2. **The test suite still borrows four references from the sibling skill.** `scripts/tests/apply-design-md.test.cjs` derives the stripe, vercel, linear and supabase references from `sk-design-md-generator/references/examples/`. That is the override path's regression coverage and it is appropriate that it exercises references this packet does not own, but it means the suite fails if the sibling is pruned.

**Adjacent, recorded and not fixed.** Two findings in code this move touched, neither caused by it:

- `check-corpus.cjs` `checkMetricBlock` guards its first assertion with `file.startsWith(TEMPLATE_DIR)`, where `file` is a repository-relative label and `TEMPLATE_DIR` is absolute, so the comparison is never true. Proved: stripping the `METRIC` block from a form that draws no metric header leaves the corpus green. Forms that do draw one are still caught by the second assertion. A one-line fix, matching the relative-string idiom the mark-policy guard already uses.
- `references/color-system.md` describes a categorical hue rotation, "navy, rust, green and violet on paper become gold, cyan, rose and violet-blue on ink". The shipped categorical system is ember, verdant, crimson and amber on paper and the same four on ink. That paragraph describes a palette replaced when the corpus was rebased on this reference.
<!-- /ANCHOR:limitations -->

---


