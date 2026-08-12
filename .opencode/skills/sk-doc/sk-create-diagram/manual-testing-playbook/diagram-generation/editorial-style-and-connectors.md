---
title: "DIA-002 -- Editorial style and connectors"
description: "This scenario validates the editorial design system and mandatory connector rules for `DIA-002`. It focuses on the 4px grid, single-accent focal rule, orthogonal elbows, fanned attach points, masked arrow labels, and bottom-strip legend."
version: 1.0.0.0
---

# DIA-002 -- Editorial style and connectors

This document captures the realistic user-testing contract, current behavior, execution flow, source anchors, and metadata for `DIA-002`.

---

## 1. OVERVIEW

This scenario validates the editorial design system and mandatory connector rules for `DIA-002`. It focuses on the 4px grid, single-accent focal rule, orthogonal elbows, fanned attach points, masked arrow labels, and bottom-strip legend.

### Why This Matters

Every diagram in the packet must read as a single editorial system, and the five mandatory connector rules are non-negotiable regardless of type. A diagonal connector, an overlapping arrow, a label sitting on its line, or a vertical `writing-mode` label makes a diagram unreadable or visually sloppy even when the content is correct. The 4px grid is the mechanical guarantee behind the system's clean look, and a violated grid is usually the first signal of sloppy layout that no screenshot review catches. This scenario locks those mechanical rules so the taste gate is checkable, not vibes.

---

## 2. SCENARIO CONTRACT

Operators run the exact prompt and command sequence for `DIA-002` and confirm the expected signals without contradictory evidence.

- Objective: verify the editorial design system and the five mandatory connector rules in a generated swimlane diagram
- Real user request: `Make a swimlane diagram of our support handoff process, and make it consistent with our docs.`
- Prompt: `Create a swimlane diagram as a self-contained HTML file of the support handoff process across L1, L2, and ops. Use the editorial design system: 4px grid, accent on at most 2 focal elements, orthogonal rounded elbows on all off-axis connectors, fanned attach points, masked arrow labels with a visible gap, and a horizontal bottom legend. Save it to docs/support-handoff.html.`
- Expected execution process: the agent loads `references/style-guide.md` (always) and `references/type-swimlane.md`, copies `assets/template.html`, authorizes the lanes, handoffs, and connectors, and then runs the taste gate, including a mechanical scan for forbidden patterns.
- Expected signals: every coordinate, dimension, and gap is divisible by 4; every off-axis connector uses rounded right-angle elbows (`r=8`); no two connectors share a stroke path; each edge attach point is fanned ≥12px apart; every arrow label has an opaque mask rect with a visible 6–10px gap; the legend is a horizontal bottom strip.
- Desired user-visible outcome: a clean, readable swimlane whose layout, connectors, and accents all obey the design-system rules.
- Pass/fail: PASS if all five mandatory connector rules are verified plus the 4px grid, accent count ≤ 2, legend placement, and typography roles; FAIL if any connector rule is violated, a coordinate is off-grid, more than 2 accents are used, or the legend floats inside the diagram area.

---

## 3. TEST EXECUTION

### Prompt

- Prompt: `Create a swimlane diagram as a self-contained HTML file of the support handoff process across L1, L2, and ops. Use the editorial design system: 4px grid, accent on at most 2 focal elements, orthogonal rounded elbows on all off-axis connectors, fanned attach points, masked arrow labels with a visible gap, and a horizontal bottom legend. Save it to docs/support-handoff.html.`

### Commands

1. `agent: Read references/style-guide.md and references/type-swimlane.md`
2. `agent: Copy assets/template.html to docs/support-handoff.html`
3. `agent: Author the three lanes, handoff nodes, and connectors using orthogonal elbows, fanned attach points, and masked labels`
4. `bash: grep -nE "writing-mode|<line " docs/support-handoff.html` (expect no vertical-text matches and no diagonal plain lines)

### Expected

Step 1 loads the style guide and the swimlane conventions. Step 3 produces a diagram with no value ending in a non-grid digit. Step 4 returns no `writing-mode` and no `<line` connectors whose endpoints do not share an axis; instead every off-axis connector uses a path with `Q` / `A` quarter-arc elbows at `r=8`. Every arrow label has a `fill="#f5f5f5"` mask rect behind it with a visible gap to its stroke, and the legend sits in the bottom `viewBox` strip.

### Evidence

Capture the prompt used, the output path `docs/support-handoff.html`, the step-4 grep output, a manual audit of connector paths (elbow radius, shared strokes, attach-point spacing), a count of accent-colored elements (must be ≤ 2), the legend's placement, and a screenshot for the human eye-check.

### Pass / Fail

- **Pass**: no diagonal or overlapping connectors, all off-axis elbows are rounded right-angle, all labels are masked with a visible gap, attach points are fanned, every coordinate is divisible by 4, accent ≤ 2, and the legend is a bottom strip.
- **Fail**: any mandatory connector rule is violated, any coordinate is off-grid, more than 2 accents appear, or the legend floats inside the diagram area.

### Failure Triage

1. Confirm the output HTML actually contains the connectors: a connector audit on the wrong file (or the source template) will pass vacuously.
2. Check whether `writing-mode` or diagonal `<line>` elements are the offender, then re-layout those edges with orthogonal elbows and fanned attach points.
3. For an off-grid coordinate, scan the file for coordinates ending in 1, 2, 3, 5, 6, 7, or 9 and fix them to the nearest multiple of 4 (stroke widths and opacity are exempt).

### Optional Supplemental Checks

Run the same audit on a second type, such as an ER diagram, to confirm the connector rules are type-agnostic and the mandatory rules hold on vertical layouts too.

---

## 4. REFERENCES

### Playbook Sources

| File | Role |
|---|---|
| [`manual-testing-playbook.md`](../manual-testing-playbook.md) | Root directory page and scenario summary |
| `../../feature-catalog/diagram-generation/editorial-style-and-connectors.md` | Feature-catalog source describing the implementation contract (authored next) |

### Implementation And Test Anchors

| File | Role |
|---|---|
| `references/style-guide.md` | Design-token source of truth |
| `references/type-swimlane.md` | Type conventions for the lane layout |
| `SKILL.md` (RULES + SUCCESS CRITERIA) | Connector rules and taste-gate contract |

---

## 5. SOURCE METADATA

- Group: DIAGRAM GENERATION
- Playbook ID: DIA-002
- Canonical root source: [`manual-testing-playbook.md`](../manual-testing-playbook.md)
- Feature file path: `diagram-generation/editorial-style-and-connectors.md`
