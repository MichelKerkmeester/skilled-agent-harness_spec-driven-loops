---
title: "Implementation Summary: The dark theme for the chart corpus"
description: "Twenty-nine files gained a second palette block, the gates learned to run once per theme, and the contract moved from one block per file to one per theme."
trigger_phrases:
  - "chart dark theme summary"
  - "dark palette results"
  - "palette block amendment results"
importance_tier: "important"
contextType: "implementation"
_memory:
  continuity:
    packet_pointer: "sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/005-dark-theme"
    last_updated_at: "2026-09-03T00:00:00Z"
    last_updated_by: "claude-opus-5"
    recent_action: "Wrote the record of what the dark theme changed and what proved it"
    next_safe_action: "Run phase 006, the catalog and contract pass"
    blockers: []
    key_files:
      - ".opencode/skills/sk-doc/sk-create-chart/assets/color/palettes.json"
      - ".opencode/skills/sk-doc/sk-create-chart/scripts/check-corpus.cjs"
      - ".opencode/skills/sk-doc/sk-create-chart/references/template-contract.md"
    session_dedup:
      fingerprint: "sha256:0000000000000000000000000000000000000000000000000000000000000000"
      session_id: "2026-09-03-053-005-dark-theme"
      parent_session_id: null
    completion_pct: 100
    open_questions: []
    answered_questions:
      - "The dark ground keeps the paper's hue angle at a cut chroma"
      - "All twenty-nine files are themed, with the proof sheets first"
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
| **Packet** | sk-design/018-sk-design-parent-v2/001-sk-create-chart/009-chart-visual-overhaul/005-dark-theme |
| **Status** | Complete |
| **Delivery** | Thirty-four skill files. The corpus check passes from the final state at 20 checks and 0 errors |
<!-- /ANCHOR:metadata -->

---

<!-- ANCHOR:what-built -->
## What Was Built

Every file in the corpus now answers the theme the reader's operating system has already
picked. Twenty chart forms, six deliveries and three proof sheets carry a second palette block
behind a `prefers-color-scheme: dark` query, with its own sentinel pair so the check can find it
and say which region a drifted value came from.

The palette source gained a dark ground, dark text roles and dark series and emphasis values for
all three systems. The corpus check gained a dark gate line that runs the same thresholds against
the dark surface, a block check that understands two regions and counts them, and a third render
open that proves the second block reaches the paint rather than merely sitting in the file.

The contract moved. Rule 4 said exactly one palette block per file and now says one per theme,
two at most, each matched against its own projection of the source in both directions. The
operator answered that amendment before anything was applied.
<!-- /ANCHOR:what-built -->

---

<!-- ANCHOR:how-delivered -->
## How It Was Delivered

In the order the phase's own decision row set: the amendment, then the palette source, then the
checker, then the files. Pasting a block into an asset before the check that governs it exists
produces twenty-nine failures carrying no information.

The dark values came from one rule rather than from taste. A dark value is re-chosen at a hue the
dark ground can carry, and its lightness is set so it holds the same ratio against near-black that
its light counterpart holds against paper. Every value lands within a twentieth of a ratio point
of its counterpart, and because the ladder is mirrored, the emphasis separations came out at 2.72
and 2.19 against the light theme's 2.71 and 2.20 without being aimed at.

| Role | Light | Dark | Ratio against its own ground |
|---|---|---|---|
| surface | `#FAF8F5` | `#161513` | the ground both columns are measured against |
| ink | `#1A1917` | `#F2F0EC` | 16.57 and 16.03 |
| muted | `#52504E` | `#A8A5A0` | 7.57 and 7.43 |
| rule | `#E0DFDC` | `#F2F0EC17` | 1.26 and 1.26, the second composited |
| neutral series | `#292825` to `#8D8B89` | `#E2E1DE` to `#686561` | 13.91, 8.23, 5.10, 3.20 and 13.95, 8.24, 5.10, 3.15 |
| neutral emphasis | `#B4471F` | `#DD6336` | 5.13 and 5.14 |
| ordered series | `#213B3D` to `#A3C4C7` | `#A1D4DC` to `#1F4649` | 11.27, 7.08, 4.39, 2.70, 1.76 and 11.27, 7.08, 4.41, 2.71, 1.76 |
| categorical series | `#28405C` to `#A377B6` | `#DBBD6D` to `#7657BF` | 10.01, 6.88, 4.75, 3.37 and 10.00, 6.87, 4.77, 3.38 |
| categorical emphasis | `#1A1917` | `#F2F0EC` | 16.57 and 16.03 |

The twenty-nine blocks were pasted from the exact text the check printed for each file. Writing a
second implementation of the projection to generate them would have created the one thing the
whole design exists to prevent, which is a second place a value can differ from the source.
<!-- /ANCHOR:how-delivered -->

---

<!-- ANCHOR:decisions -->
## Key Decisions

Six, each written in full in the decision record. The operator approved the two-block ceiling. A
hue may be re-chosen at a theme boundary, and the categorical set rotates every slot because a hue
reaches its own ceiling of lightness and cannot carry a brighter slot with its chroma intact. The
dark ground keeps the paper's hue angle at a cut chroma. All twenty-nine files are themed, with
the proof sheets first because one of them is the skeleton every future template copies. Two gate
keys keep names that now read wrong on one ground, with the rename proposed rather than folded in.
And the render pins its colour scheme and opens each file a third time.
<!-- /ANCHOR:decisions -->

---

<!-- ANCHOR:verification -->
## Verification

The corpus check passes from the final state with 20 checks, 29 files and zero errors, read from a
file rather than through a pipe. Both gate lines report their own assertion counts: `palette-source`
at 38 and `palette-source-dark` at 34, each at zero failures.

### The six mutations, each watched failing before the check was trusted

| Mutation | What fired | What it proves |
|---|---|---|
| `categorical` dark series[3] set to `#3A2C5C` | `palette-source-dark`, 1 failure, light line still green | The gates run against the dark surface, and the two runs are independent |
| The dark ordered ramp reversed | `palette-source-dark`, 5 failures | Reversal keeps every step separation intact, so the ordering assertion is the only thing that catches it |
| One dark value in `bar-columns.html` changed by one digit | `palette-block`, 1 failure naming both values | The dark region is matched against its own projection, not the light one |
| The dark block's query changed to `@media screen` | `palette-block`, 1 failure | A dark block outside its query would paint dark values on every reader |
| The dark sentinel pair pasted twice | `palette-block`, and `colour-literals` caught the unstripped copy | The two-block ceiling is counted rather than assumed |
| The query given `and (min-width: 99999px)` | `dark-render`, 1 failure, alone | A block can match the source in both directions, sit inside a `prefers-color-scheme` query and still never paint |

Every mutation was restored from a copy taken before it, never from a checkout, and each restore
was followed by a green run.

### What was read rather than computed

Two deliveries were opened under a pinned dark scheme and read. The categorical delivery paints a
near-black ground with gold, cyan, rose and violet squares that stay separable from each other,
with a legible source line and a card edge that is findable without competing with the marks. The
neutral delivery paints near-white dots with the orange emphasis carrying its median marks.

`where-the-budget-went.html` was printed to PDF from a browser pinned dark. The page carries
`#1A1917`, `#52504E`, `#E0DFDC`, `#FAF8F5` and the four light category values, and no dark value
at all. A probe page whose only difference between themes is a text colour printed the light
branch from the same browser, which is what confirms the behaviour belongs to the browser rather
than to the file.

### The light theme did not move

All 29 files were rendered from `HEAD` and from the working tree under a pinned light scheme, and
every pair of pictures matched byte for byte. The corpus gained a second ground rather than
changing the first.

### Inventory

286 six-digit hex values across `assets/` and `references/` became 542, plus 30 copies of the one
eight-digit value. An independent scan that strips both palette regions and then looks for any hex
found none, which is the same conclusion `colour-literals` reaches by a different route.
<!-- /ANCHOR:verification -->

---

<!-- ANCHOR:limitations -->
## Known Limitations

The check pins the colour scheme with a browser flag rather than reading an operating system, so
what a particular reader's machine resolves is still a question for a real browser. That is also
how the render inheriting the operator's own scheme was found: with no flag, this machine reported
dark, because the operating system is set to dark.

Whether the dark values are the right ones stays a review question. The gates prove a mark is
distinguishable from its ground and from its neighbour, and they say nothing about whether gold
and rose are easy to tell apart at the size a chart ships. Two deliveries were read and the third
system was read only as a palette proof sheet.

Two gate keys still carry names written for one ground. `rampDarkestOnSurface` names the end that
is brightest on ink. The check tests the right end and says which, and both documents say the
names are wrong, but a reader who reads only the palette source will still be misled for as long
as the rename is unmade.

Nothing here is committed. The evidence in this document is pinned to the working tree.
<!-- /ANCHOR:limitations -->
