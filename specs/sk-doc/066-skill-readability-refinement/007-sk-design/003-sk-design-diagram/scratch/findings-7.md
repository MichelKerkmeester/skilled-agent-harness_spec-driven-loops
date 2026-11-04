### .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when a reader has to trust what each storage tier holds before they can trust the promotion between tiers.

  ## 1. OVERVIEW

  ### Purpose

  Makes a tier stack reproducible: one inputs schema fixes every card, promotion arc and path label, so two runs from the same inputs produce the same SVG.

  ### When to Use

  **Best for:** documenting a multi-tier data-storage layout where each tier is a distinct *quality / access level* of the same dataset — typically raw landing zone, anonymised, staging/cleaned, aggregated business indicators, and cold archive. Used when the reader needs to see at a glance *what each bucket contains*, *who writes it*, *with what tool and format*, and *how data is promoted between tiers*.
  ```
  This adds 8 lines: the reference recorded at :23 moves to :31 and the one at :258 moves to :266; §5 keeps its number.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:364 | 1 | Two of the three example paths do not exist (`medallion-dark.html`, `medallion-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. The shipped file is a five-tier e-commerce storage example, not a NatStat quarterly survey, and `Gallery default` names a gallery the skill no longer ships. | Replace lines 364-366 with:
  ```markdown
  - `assets/diagrams/medallion.html` — the canonical rendered example: five-tier e-commerce storage (Raw → Anonymized → Staging → Aggregated → Archive), 2 path cards, Aggregated focal.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:135 | 1 | §3.2 promises "four labeled field rows" (line 122) but the coordinate block defines three (tool, format, writer), and the schema on line 70 omits the fourth key; the shipped `medallion.html` draws `Access` at y=300/306. A renderer following the block leaves that row out or invents its position. | Replace lines 135-140 with:
  ```markdown
  field rows (absolute y):
    tool_label  at 180,    tool_value  at 186 (foreignObject, height 24)
    format_label at 220,   format_value at 226 (foreignObject, height 24)
    writer_label at 260,   writer_value at 266 (foreignObject, height 24)
    access_label at 300,   access_value at 306 (foreignObject, height 24)
    # gap (open whitespace below access row, above the example section)
    example_label_text at 360,  example_line_0 at 374,  example_line_1 at 388
  ```
  replace line 70 with "- `tiers[i].fields` — `{tool, format, writer, access, example}`. `example` is a 1- or 2-item list; the section heading uses `example_label`.", and add one `access:` value per tier to the §2 YAML so the fourth row has input.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:372 | 1 | §11 says the §2 YAML is the complete inputs definition for the shipped file and is embedded as a top-of-file HTML comment; neither holds — `medallion.html` has no YAML comment, draws e-commerce order data with an `Access` row, and uses no `color` override. | Replace line 372 with:
  ```markdown
  The YAML in §2 is a worked inputs definition for a five-tier medallion: every coordinate in a render is derivable from §3 applied to those inputs. The shipped `medallion.html` applies the same geometry to an e-commerce order dataset — five tiers from `raw-commerce` to `archive-commerce`, two write-method cards, `Aggregated` focal.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:68 | 10 | Sends the reader to §3.4 for the card fill/stroke palette, but §3.4 is Promotion arcs; the palette is §3.3 Tier styles. | Replace "(§3.4)" with "(§3.3)".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:286 | 10 | Cites `(§4 auto-style rule)`, but the auto-style rules are in §3.4; §4 holds the connector table, markers and z-order. | Replace "(§4 auto-style rule)" with "(§3.4 auto-style rules)".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:344 | 1 | Checklist item 8 tells the renderer to emit "label masks", but §3.4 (line 208) and item 5 say no mask is needed, and line 358's anti-pattern repeats `tier-gap label mask`. A renderer following item 8 draws a mask the type does not use. | Replace line 344 with "8. All promotion arrows emitted **before** any tier card rect (z-order rule — cards mask the line ends inside the cards)." and replace "the tier-gap label mask" on line 358 with "the arc it sits in".
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:273 | 1 | The per-tier table says connectors touching a colored tier are "unchanged — topology-driven", but §3.4 (line 202) and §5.3 (line 286) require the incoming promotion arc, its label and its arrowhead to take that tier's color; line 355 repeats the same over-broad claim. | Replace the `Connectors touching this tier` row at line 273 with "| Connectors touching this tier | **incoming arc follows the §3.4 auto-style** (`C`); outgoing stays muted | same, `C_light` |" and replace line 355 with "- **Custom-colored arrows** — connectors are topology-driven; an arrow takes the target tier's color only through the §3.4 auto-style rule, never from its source tier."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-medallion.md:210 | 1 | The override rule tells the reader to shrink `arc_inset`, but no `arc_inset` is defined anywhere in §3; the arc geometry is built from `tier_cx` alone, so the instruction cannot be applied. | Replace "the arc anchors `arc_inset` may need to shrink correspondingly" with "the arc anchors' inset may need to shrink correspondingly".

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when the question is what contains what, not what connects to what.

  ## 1. OVERVIEW

  ### Purpose

  Makes depth readable as distance: inset padding and stroke strength step from a faint outer ring to a coral inner one, so the innermost box is unmistakably the subject.

  ### When to Use

  **Best for:** hierarchy through containment — scope boundaries, CLAUDE.md cascade, trust zones, folder nesting, blast radius. Outer = broader, inner = more specific.
  ```
  This adds 8 lines: §2 moves from :23 to :31, §3 from :33 to :41, and the EXAMPLES bullets from :42-44 to :50-52.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md:42 | 1 | Two of the three example paths do not exist (`nested-dark.html`, `nested-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 42-44 with:
  ```markdown
  - `assets/diagrams/nested.html` — the canonical rendered example: the CLAUDE.md hierarchy in five nested rings, innermost focal.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md:29 | 1 | `primitive-annotation.md` is a bare filename; from `references/types/` it resolves nowhere, while every other reference names the path (`references/primitives/…` or `../primitives/…`). | Replace "`primitive-annotation.md`" with "[`primitive-annotation.md`](../primitives/primitive-annotation.md)".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-nested.md:24 | 1 | The layout allows "3–5 rounded rectangles", but the anti-pattern fires only above 6 levels (line 34), so a six-level diagram is neither recommended nor forbidden. | Replace line 24 with "- 3–5 rounded rectangles (`rx=8`), six at the outside; nest with consistent inset padding (24–32px horizontal, 32–36px vertical recommended)."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-org-chart.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-org-chart.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when the reader's question is who takes the work, not which box reports to which.

  ## 1. OVERVIEW

  ### Purpose

  Makes ownership legible: one front door is marked, pods and owners take fixed node treatments, and coverage gaps are drawn as gaps instead of left out.

  ### When to Use

  **Best for:** human teams, agent teams, support escalation maps, role ownership, routing maps, and any hierarchy where the reader needs to know *who owns what* rather than just parent → child structure.
  ```
  This adds 8 lines: §2 moves from :25 to :33, §3 from :39 to :47, §4 from :48 to :56, §5 from :57 to :65, and the EXAMPLES bullets from :68-70 to :76-78.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-org-chart.md:68 | 1 | Two of the three example paths do not exist (`org-chart-dark.html`, `org-chart-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 68-70 with:
  ```markdown
  - `assets/diagrams/org-chart.html` — the canonical rendered example: an agent-team responsibility map with one front door, four pods and specialist owners.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when a process diagram has to survive a responsibility audit.

  ## 1. OVERVIEW

  ### Purpose

  Makes a multi-actor process reproducible: one inputs schema fixes every lane, step column, node and data chip, so the same inputs always draw the same figure.

  ### When to Use

  **Best for:** sequential business processes with multiple actors/divisions where the reader needs to see *who* does *what*, *what data* enters and leaves each step, and *which tools* are used — not just the step order. Covers responsibility audits, data-quality gate reviews, cross-divisional handoff maps, and end-to-end workflow documentation.
  ```
  This adds 8 lines: the references recorded at :23, :173, :240 and :342 move to :31, :181, :248 and :350; §5 and §4.1 keep their numbers.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:506 | 1 | Five of the six example paths do not exist (`process-dark`, `process-full`, `process-extended`, `process-extended-dark`, `process-extended-full`); `assets/diagrams/` holds `process.html` only, and that file renders "Order fulfillment across four teams" — 8 steps, 4 lanes — not an 11-step, 6-division quarterly survey. `Gallery default` names a gallery the skill no longer ships. | Replace lines 506-511 with:
  ```markdown
  - `assets/diagrams/process.html` — the canonical rendered example: order fulfillment, 8 steps across 4 lanes (Customer, Support, Warehouse, Finance), data-type chips, one focal step and node.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:407 | 1 | §13 is titled as the full YAML for `process-extended.html` and §13.1 checks its arithmetic against that "rendered SVG", but no `process-extended.html` is shipped anywhere, so the proof points at a file the reader cannot open. | Replace line 407 with "## 13. WORKED EXAMPLE — 6 LANES × 11 STEPS", replace line 409 with "The following inputs describe a 6-lane × 11-step quarterly-survey process end to end. Every coordinate in a render is derivable from this block via §3 + §4 + §5. This is the canonical proof that the parametric contract works end-to-end.", and replace line 480 with "- `viewBox_w = 140 + 11 * 112 + 28 = 1400`. ✓"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:483 | 1 | The step-centre array ends `1208, 1320`, but §3's `step_cx(j) = 140 + 8 + j*112 + 50` gives 1206 and 1318; lines 486 and 488 then explain the resulting 2-px gap as chip-width rounding, which the formula does not contain. | Replace "1094, 1208, 1320" with "1094, 1206, 1318", replace line 486 with "- Node 10 (Public Release): step=9, lane=\"CMM\" (k=5) → x = 1206-50 = 1156, y = 436+8 = 444. ✓", and replace line 488 with "Every node centre follows the same formula, so a fresh generation from this YAML reproduces the coordinates above."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:124 | 1 | "odd-indexed lanes (0, 2, …)" contradicts its own parenthetical: 0 and 2 are even-indexed, and the shipped example tints lanes 0 and 2. A renderer following the word tints the wrong lanes. | Replace "odd-indexed lanes (0, 2, …)" with "even-indexed lanes (0, 2, …)".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-process.md:367 | 6 | Says the colored legend "add[s] a 4th `CONCERN` row", but the row list below makes `CONCERN` row 3 and pushes `FLOW` to row 4, so the count and the order disagree. | Replace "add a 4th `CONCERN` row and grow `legend_h` to 100" with "add a `CONCERN` row (row 3, pushing `FLOW` to row 4) and grow `legend_h` to 100".

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-pyramid.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-pyramid.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when rank or conversion is the message and a bar chart would flatten it.

  ## 1. OVERVIEW

  ### Purpose

  Makes a ranked stack honest: layer widths carry the drop, one coral layer names the stake, and the orientation tells the reader whether to read up or down.

  ### When to Use

  **Best for:** hierarchy of needs, prioritization ranks, value pyramids, conversion funnels, content importance stacks.
  ```
  This adds 8 lines: §2 moves from :23 to :31, §3 from :31 to :39, §4 from :46 to :54, and the EXAMPLES bullets from :55-57 to :63-65.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-pyramid.md:55 | 1 | Two of the three example paths do not exist (`pyramid-dark.html`, `pyramid-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 55-57 with:
  ```markdown
  - `assets/diagrams/pyramid.html` — the canonical rendered example: a four-layer content pyramid, apex focal, with yearly-volume annotations.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when two independent axes, not a ranking, carry the argument.

  ## 1. OVERVIEW

  ### Purpose

  Makes a two-axis judgment readable: each axis is named in one word, and every item sits where its two values put it.

  ### When to Use

  **Best for:** prioritization (Impact × Effort), positioning (Reach × Frequency), portfolio maps, 2×2 decision frames.
  ```
  This adds 8 lines: §2 moves from :23 to :31, §3 from :33 to :41, §4 from :40 to :48, and §5 from :48 to :56.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md:41 | 1 | Two of the four example paths do not exist (`quadrant-dark.html`, `quadrant-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type and §3 lists the consultant variant separately. | Replace lines 41-44 with:
  ```markdown
  - `assets/diagrams/quadrant.html` — the canonical rendered example: content ideas on Impact × Effort.
  - `assets/diagrams/quadrant-consultant.html` — the consultant special: Workplace 2030 on Remote × AI automation (see below).
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md:25 | 7 | One bullet carries three independent rules — the glyph and modifier ban, the type spec, and the placement rule — so a reader cannot scan the axis-label contract. | Replace line 25 with:
  ```markdown
  - **Axis labels: Jobs-minimal.** One single word at each arrow tip.
    - No glyphs baked into the label (no `↑` / `→` / `←` / `↓`), no parentheticals, no "HIGH / LOW" modifiers.
    - Geist Mono 9px regular weight, tracked 0.18em, uppercase.
    - Flank the arrow tips — never sit labels on top of the axis line. Shorten the arrow enough (~60–80px inside the viewBox edge) to leave breathing room for the labels beyond the tips.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-quadrant.md:92 | 1 | "same as the standard quadrant" points at a legend strip and horizontal rule that §2 never defines, so a reader building the standard quadrant has no rule to copy. | Replace "Keep the legend strip + horizontal rule at the bottom — same as the standard quadrant." with "Keep the legend strip + horizontal rule at the bottom."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-radar.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-radar.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when a table of scores buries the comparison a reader is trying to make.

  ## 1. OVERVIEW

  ### Purpose

  Keeps the comparison readable as shape: one normalized scale, concentric rings, and dots only on the focal series.

  ### When to Use

  **Best for:** comparing 3–5 entities across 3–5 quantitative criteria on a single normalized 0–N scale. Capability matrices, product or backend evaluations, framework/team scorecards. Where a comparison table starts running out of horizontal room, radar makes the shape of each option legible at a glance.
  ```
  This adds 8 lines: §2 moves from :23 to :31, §3 from :37 to :45, §4 from :74 to :82, §5 from :89 to :97, and the EXAMPLES bullets from :104-106 to :112-114.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-radar.md:104 | 1 | Two of the three example paths do not exist (`radar-dark.html`, `radar-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 104-106 with:
  ```markdown
  - `assets/diagrams/radar.html` — the canonical rendered example: 4 storage backends × 5 workload dimensions, MinIO focal.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-scatter.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-scatter.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with:
  ```markdown
  Open this when the question is whether two measures move together, and one outlier may be the answer.

  ## 1. OVERVIEW

  ### Purpose

  Keeps both values honest on one canvas: no bubble area, no fitted line unless the trend is obvious, and labels only for the focal point and a couple of outliers.

  ### When to Use

  **Best for:** correlation and distribution — two continuous variables plotted against each other. Use when the relationship (or lack of one) between variables is the message, or when you need to identify clusters, outliers, and high/low performers.
  ```
  This adds 8 lines: §2 moves from :23 to :31, §3 from :47 to :55, and the EXAMPLES bullets from :59-61 to :67-69.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-scatter.md:59 | 1 | Two of the three example paths do not exist (`scatter-dark.html`, `scatter-full.html`); `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 59-61 with:
  ```markdown
  - `assets/diagrams/scatter.html` — the canonical rendered example: deploy frequency vs. lead time across 12 teams.
  ```
