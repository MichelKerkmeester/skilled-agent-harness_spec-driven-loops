---
title: "Implementation Summary"
description: "Every capture read by a reviewer who did not make the change; twelve defects the green checks had no opinion about."
trigger_phrases:
  - "implementation summary"
  - "what shipped"
  - "validation evidence"
  - "continuation notes"
importance_tier: "normal"
contextType: "general"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/033-visual-verification"
    last_updated_at: "2026-09-10T06:10:51Z"
    last_updated_by: "claude-conductor"
    recent_action: "Had every capture read by fresh reviewers and fixed the twelve defects that came back"
    next_safe_action: "Re-review the figures the rule change repainted"
    blockers: []
    key_files: []
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "claude-phase-033-visual-verification"
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
| **Spec Folder** | 033-visual-verification |
| **Completed** | 2026-09-10 |
| **Level** | 2 |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The palette was replaced wholesale and every check stayed green. Green proves colour values clear
their ratios and that declarations match code; it has no opinion about whether a figure reads. Two
captures had been read. Thirty-seven had not.

Six reviewers read all of them, briefed without my expectations and told explicitly that a passing
check is no reason to assume anything. Twelve defects came back and were verified here before
anything was changed.

### What they found

A heatmap whose caption said "Darker is more" while its own legend ran dark to bright for less to
more — on a magnitude ramp colour is the only encoding, so the sentence a reader decodes the figure
with was inverted. Four more sentences carried the same assumption, because a ramp runs toward
whichever ground the theme uses and prose naming a shade picks a side the picture does not keep.

A dumbbell drawn with both ends the same colour, so nothing in the figure said which way a row
moved and its headline could not be checked against it. The same form marking the widest change
while the sentence underneath was about the one row that reversed. A tracker whose severity ran
backwards after the palette change, calling a degraded day by a hotter colour than a failed one. A
candlestick painting "up" in the token its own legend defines as a down candle. A screen-reader
description carrying two numbers that contradicted the bars. An axis title painted over its tick
labels. A treemap label drawn into its neighbour. A template's note describing a line that clears
the columns it crosses.

### The rule that arrived mid-round

Half the corpus drew its readings in the ink and reserved its one colour for the mark the headline
was about. That inverts what colour is for: the accent goes to the exception and the subject is left
in the same tone as the labels around it. The ranked system's first series now takes the hue and the
ink becomes its emphasis, so eighteen forms turn from near-white marks with one orange into orange
marks with one white.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

The reviewers were given the images, the sources and no conclusions. They did not know which two
figures had been flagged or that the palette was the likely culprit. Every finding was reproduced
here before acting: the axis overlap by reading the capture, the inverted caption against the
legend, the dumbbell direction by computing the plotted coordinates, the description against the
data block.

Two findings were checked and generalised rather than fixed one at a time. The colour-naming prose
was audited across the whole corpus, which turned five instances into one rule and one check. A
similar audit of numbers in descriptions produced fifteen candidates of which one was real, so that
one stayed a fix and did not become a check.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

| Decision | Why |
|----------|-----|
| The ink becomes the emphasis rather than the default | A plot of ink-coloured marks with one accent spends its only colour on the exception. Inverting it costs nothing and reads better: one white bar among orange is plainly the leader. |
| Prose naming a lightness direction became a rule, prose naming a number did not | The first audit found five instances and every one was real. The second found fifteen and one was real, because prose legitimately carries totals and percentages the data block does not. A check there would be noise. |
| The contact sheet is no longer captured | A viewport shot of it showed one of twenty-nine forms while counting as covered, and a shot tall enough to hold all of it is megabytes rewritten on every palette change. Completeness is what it owes, and the `gallery` family asserts that. |
| Three reviewer judgements were refused | The invisible surface swatch demonstrates the ladder's zero point; `grouped-bars` marks its outlier by pattern rather than colour and its own note argues for that; the ordered ramp sits at its separation floor by construction. Each is recorded rather than quietly ignored. |
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

| Check | Result |
|-------|--------|
| Coverage | 39 figures, 3 proof sheets and the contact sheet, across six reviewers. |
| Each finding before acting | Verified here: captures re-read, coordinates computed, descriptions checked against data. |
| `node scripts/check-corpus.cjs` | PASS. `Summary: errors: 0`, with `ramp-prose` added at 39 assertions. |
| `node --test scripts/tests/` | PASS. 81 tests. |
| Captures | 39 rendered, 0 failed, 0 stale, 0 orphans. |
| The repaired figures, read again | The dumbbell leans the way each row moved and the marked row leans the other way; the tracker escalates teal, orange, red; `bar-columns` is orange marks with one white. |
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

1. **The rule change repainted eighteen forms after the review finished.** Those reviewers read the previous colours. The three I read afterwards are right, and the rest are unverified by eye at their current colours.
2. **The contact sheet has no capture.** Its completeness is machine-checked; what it looks like is not.
<!-- /ANCHOR:limitations -->

---


