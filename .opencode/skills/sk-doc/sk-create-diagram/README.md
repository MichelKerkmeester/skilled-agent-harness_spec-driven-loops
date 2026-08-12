---
title: "sk-create-diagram"
description: "Draw a self-contained HTML/SVG technical diagram across 27 types against one skinnable editorial design system, or redraw an existing draw.io / Mermaid source, for anyone who needs a diagram that looks intentional instead of AI-generic."
trigger_phrases:
  - "create diagram"
  - "architecture diagram"
version: 1.0.0.0
---

# sk-create-diagram

> Draw a self-contained `.html` diagram — architecture, sequence, ER, Gantt, and 23 more types — against one shared editorial design system with a complexity budget and a taste gate, or redraw an existing draw.io / Mermaid source at the format, size, and detail level the destination needs.

---

## 1. AT A GLANCE

| Aspect | What you get |
|---|---|
| **Use it for** | A component diagram, decision flow, data model, timeline, or any of 27 technical/product diagram types that should look custom, not templated |
| **Invoke with** | `/create:diagram` or the keywords "diagram", "architecture diagram", "sequence diagram", "draw.io", "mermaid" |
| **Works on** | 27 diagram types (generate), `.drawio*` / `.mmd` / `.mermaid` sources (import), and PNG/SVG export of a generated diagram |
| **Produces** | A single self-contained `.html` file — inline SVG, inlined CSS, no external images, no required JavaScript |

---

## 2. OVERVIEW

### Why This Skill Exists

A generic AI-drawn diagram is easy to spot: dark mode with a cyan glow, identical rounded boxes for every node, a legend floating inside the drawing area, diagonal connectors crossing at odd angles. It looks technical without a single real design decision behind it. `sk-create-diagram` exists so a diagram starts from a real editorial design system — one accent color, a 4px grid, mandatory orthogonal connectors, a complexity budget — instead of freehand SVG, and never ships without running the same taste gate that catches those failure modes before delivery.

### What It Does

`sk-create-diagram` picks the right one of 27 diagram types for what's being shown, loads that type's layout conventions and complexity budget, draws against the shared design system in `references/foundations/style-guide.md`, and runs the SKILL.md §9 Pre-Output Checklist before handoff. It also redraws an existing draw.io or Mermaid source — extracting the structural content only, never the source's coordinates, colors, or renderer layout — at a chosen format, size, detail level, and audience. It produces standalone `.html` diagrams. Ongoing ASCII flowcharts embedded directly in markdown are `sk-create-flowchart`'s job, not this one.

### The 27 Diagram Types

| Category | Types |
|---|---|
| **Components + connections** | Architecture, IT current-state, high-level, data flow, DP integration, DP security matrix |
| **Behavior + flow** | Flowchart, sequence, state machine, process, swimlane |
| **Data structure** | ER / data model, medallion |
| **Structure + ranking** | Nested, tree, org chart, layer stack, pyramid / funnel, quadrant, venn, loop |
| **Time + quantity** | Timeline, Gantt, bar, line, scatter, radar |

Full selection guide with per-type reference links: `SKILL.md` §1.

---

## 3. QUICK START

**Step 1: Pick the right type for what you're showing.**

```text
Draw an architecture diagram: frontend, backend, database, Redis cache.
```

That request maps to `references/types/type-architecture.md`.

**Step 2: Draw the diagram against the design system, then run the taste gate.**

The taste gate is `SKILL.md` §9's Pre-Output Checklist — self-applied, no external script: type fit, the remove test, signal (accent on ≤2 elements), the five mandatory connector rules, the accessible-SVG contract, and typography.

**Step 3: When redrawing an existing draw.io or Mermaid file, extract first — never render.**

```bash
python3 scripts/drawio_extract.py path/to/diagram.drawio
python3 scripts/mermaid_extract.py path/to/diagram.mmd
```

Each prints the same structural digest shape: nodes, edges, containers, hubs, and budget flags. Redraw from that digest, then report the fidelity ledger — what was merged, collapsed, or dropped.

---

## 4. HOW IT WORKS

Every build follows the same order. Detect the request shape — generate, import, or export. For generate, run the style-guide gate on the first diagram in a new project, load the matching `references/types/type-<name>.md`, and draw against the shared design tokens and that type's complexity budget. For import, route by source extension to `references/import-export/import-drawio.md` or `references/import-export/import-mermaid.md`, extract the structural IR with the matching script, set the four output dials (format, size, detail, audience), and redraw — never invent a component to fill a layout, never silently drop one. For export, extract the `<svg>` node and emit PNG and/or SVG; export is always manual, never automatic. Every path ends at the same taste gate before delivery.

### Key Concept: The Taste Gate Is Not Optional Polish

`SKILL.md` §9 is not a style nicety. It catches the failure modes that make a diagram look AI-generated instead of intentional: a diagonal connector between off-axis nodes, an arrow label sitting on top of its own line, two connectors sharing a stroke path, a legend floating inside the diagram, an accent color used on five "important" things instead of one or two. A diagram that looks right at a glance but never ran through this checklist has not actually been checked. The packet's own success criteria treat a diagram that skipped the taste gate as unfinished, not finished-with-an-unrun-check.

---

## 5. INTEGRATION & NAVIGATION

### When To Use This Skill

Reach for `sk-create-diagram` when a reader will learn more from a visual than from prose, a table, or a bulleted list, and the deliverable is a standalone HTML/SVG artifact. Skip it when a short bullet list or a 3-column table already says the same thing. Skip it too when the actual deliverable is an ASCII flowchart embedded directly in a markdown document — that's `sk-create-flowchart`'s scope, not this one.

### Related Skills

| Skill | Relationship |
|---|---|
| `sk-create-flowchart` | Owns ASCII/box-drawing flowcharts embedded in markdown. `sk-create-diagram` owns everything that needs SVG, HTML, or a real design system. |
| `create-quality-control` | Audits or scores an existing document. `sk-create-diagram` is for authoring a new diagram artifact. |
| `sk-design` | Owns interface/product UI design. `sk-create-diagram` is scoped to standalone technical/product diagrams, not application interfaces. |

---

## 6. TROUBLESHOOTING

| What you see | Why | Fix |
|---|---|---|
| Diagram looks generic or "AI-drawn" | Dark mode + glow, identical boxes, no real accent decision | Re-run the §9 taste gate's Signal checks; pick 1-2 genuinely focal elements |
| Diagonal connector between two boxes | Off-axis nodes connected with a straight `<line>` instead of an orthogonal elbow | Route with a rounded right-angle connector (`r=8`); see `SKILL.md` RULES |
| Arrow label unreadable or overlapping the line | Missing the mandatory 6-10px gap or opaque mask rect | Add the mask rect and the visible gap per the connector-rules checklist |
| Import redraw looks nothing like the source | Wrong output dial (format/size/detail/audience) for the destination | Re-check the four dials in `references/foundations/output-spec.md` against where the diagram is going |
| Fidelity ledger missing after an import | Redraw delivered without reporting what was merged, collapsed, or dropped | Every import must end with the fidelity ledger — see `references/import-export/import-drawio.md` / `import-mermaid.md` |

---

## 7. FAQ

**Q: Why HTML/SVG instead of Mermaid or a design tool?**

A: Self-contained HTML with inline SVG opens in any browser with no renderer, build step, or account. If the deliverable specifically needs an ASCII flowchart in markdown, that's `sk-create-flowchart`; if it needs pixel-level product UI, that's `sk-design`.

**Q: What if my content doesn't fit any of the 27 types?**

A: Pick the closest one and adapt it — the type references are layout-convention guides, not rigid templates. If you're combining two types, pick the dominant axis rather than hybridizing grammars.

**Q: Can this skill fetch my website automatically to onboard my brand colors?**

A: No — the packet has no network-fetch tool. Onboarding is agent-mediated: the calling AI session fetches the URL with its own tools and this skill maps the result to semantic tokens. See `references/foundations/onboarding.md`.

---

## 8. VERIFICATION

| Check | Result |
|---|---|
| Package structure | `python3 .opencode/skills/sk-doc/sk-create-skill/scripts/validate_skill_package.py .opencode/skills/sk-doc/sk-create-diagram --strict` exits 0 |
| Connector rules | Every delivered diagram passes all five mandatory connector rules in `SKILL.md` RULES |
| Accessible SVG | `role="img"`, `aria-labelledby`, first-child `<title>`, `<desc>`, and diagram/variant-prefixed IDs on every delivered SVG |
| Import fidelity | Every import redraw reports a fidelity ledger — merged, collapsed, dropped |
| Manual review | The diagram reflects real source content, stays within its type's complexity budget, and passes the full §9 taste gate |

---

## 9. RELATED DOCUMENTS

| Document | Purpose |
|---|---|
| [`SKILL.md`](./SKILL.md) | Authoritative packet contract, design system, routing, and taste gate |
| [`references/foundations/style-guide.md`](./references/foundations/style-guide.md) | Design tokens — the single source of truth for colors, typography, and spacing |
| [`references/foundations/output-spec.md`](./references/foundations/output-spec.md) | The four import/export dials: format, size, detail, audience |
| [`references/import-export/import-drawio.md`](./references/import-export/import-drawio.md) | draw.io redraw procedure |
| [`references/import-export/import-mermaid.md`](./references/import-export/import-mermaid.md) | Mermaid redraw procedure |
| [`references/import-export/export.md`](./references/import-export/export.md) | PNG/SVG export procedure |
| [`references/types/type-architecture.md`](./references/types/type-architecture.md) | Example of a per-type layout-convention reference |
