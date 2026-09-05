---
title: "Implementation Summary: The chart interaction layer"
description: "Seven forms gained a tooltip, four an in-figure legend and five a hover dim, with keyboard focus preserved and every number left selectable."
trigger_phrases:
  - "chart interaction summary"
  - "chart tooltip results"
  - "chart legend dim results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-doc/051-sk-create-chart/009-chart-visual-overhaul/004-interaction-layer"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Wrote the record of what the interaction pass changed"
    next_safe_action: "Run the dark theme phase"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/templates/scatter.html"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-004-interaction-layer"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "A form whose values are already written beside each mark gains no legend"
      - "The hygiene pair becomes one line, because a delivered chart is a document"
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
| **Packet** | sk-doc/051-sk-create-chart/009-chart-visual-overhaul/004-interaction-layer |
| **Status** | Complete |
| **Delivery** | Thirteen skill files. The corpus check passes from the final state |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

The corpus had no interaction at all. It now has three behaviours, each on the forms that can
carry it rather than on all twenty.

A hover tooltip on the seven mark-dense forms: the distribution strip, the box plot, the
treemap, the calendar grid, the candlestick, the heat matrix and the scatter. These are the
forms where a reader cannot read a value off an axis, so a pointer is the only way to get one.

An in-figure legend on four multi-series forms: the parallel axes, the stacked bars, the
stacked area and the grouped bars. The key moves out of the subtitle sentence and into the
drawing, so the reader stops matching a colour against prose.

A dim on five forms, so hovering or selecting one series drops the others and the one under
the pointer stays readable.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

Twelve asset files carry the interaction hygiene, and it is one line rather than the two the
reference ships. A focus ring is suppressed only for pointer interaction, through the selector
that leaves keyboard focus visible. The rule that stops text being selected was rejected, so
every number in a delivered chart stays copyable.

Values in a tooltip go through the corpus formatter. The reference uses a locale-dependent
call, which would make the same file print differently on two machines, and the corpus rejects
that.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Three, each written in full in the decision record. A form whose values are already printed
beside every mark gains no legend, because a detached key would repeat what the picture says.
The hygiene pair becomes one line. And where a key already existed in the subtitle it was
rebuilt rather than duplicated, so no form carries two.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The corpus check passes from the final state with zero errors, including the render, the
settled render the motion phase added, and the script parse. Every form still paints
identically on first load with no pointer input, which is what keeps a static delivery static.

No file introduces a locale-dependent number, and no file stops text being selected.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

A tooltip answers a pointer. A reader on a touch device gets the tap behaviour the browser
chooses, which is not something a single file can normalise across browsers.

One criterion was superseded rather than met: it assumed five forms carried a key in the
subtitle, and the fifth prints its values beside each mark instead. The replacement names the
four that actually gained a legend.
<!-- /ANCHOR:limitations -->
