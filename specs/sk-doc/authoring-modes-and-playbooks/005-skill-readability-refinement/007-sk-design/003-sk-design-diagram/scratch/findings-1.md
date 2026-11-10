### .skilled/skills/sk-design/sk-design-diagram/README.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/README.md:94 | 1 | The Related Skills table's `Skill` column holds `Application / product UI` at line 97, a scope boundary rather than a skill, so the table promises a skill that does not exist. | replace line 94 with `| Skill or scope boundary | Relationship |` and replace the first cell at line 97 with `Application / product UI work`.
- [P2] .skilled/skills/sk-design/sk-design-diagram/README.md:88 | 5 | `### When To Use This Skill` sits in §5, after QUICK START (51) and HOW IT WORKS (76), so the skip gate in line 90 reaches the reader after the steps it governs. | move lines 88-90 to after line 35, before `### The 27 Diagram Types` at line 37.
- [P2] .skilled/skills/sk-design/sk-design-diagram/README.md:78 | 7 | The §4 lead paragraph packs generate, import and export into one 120-word block; the three paths are a list. | replace line 78 with:
  ```markdown
  Every build follows the same order. Detect the request shape, generate, import, or export.

  - **Generate:** run the style-guide gate on the first diagram in a new project, load the matching `references/types/type-<name>.md`, and draw against the shared design tokens and that type's complexity budget.
  - **Import:** route by source extension to `references/import-export/import-drawio.md` or `references/import-export/import-mermaid.md`, extract the structural IR with the matching script, set the four output dials (format, size, detail, audience), and redraw: never invent a component to fill a layout: never silently drop one.
  - **Export:** extract the `<svg>` node and emit PNG and/or SVG; export is always manual: never automatic.

  Every path ends at the same taste gate before delivery.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/README.md:156 | 10 | `## SCREENSHOTS` is unnumbered and sits after `## 9. RELATED DOCUMENTS`, so one H2 breaks the integer sequence and the related-resources section is not last. | move lines 156-177 to after line 141, retitle the moved heading `## 9. SCREENSHOTS`, insert a blank line and `---` after the moved block, and renumber line 143 to `## 10. RELATED DOCUMENTS`.

### .skilled/skills/sk-design/sk-design-diagram/ROUTER.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/ROUTER.md:23 | 7 | The §1 OVERVIEW is one 170-word paragraph that packs the request families and all four resource families; the four families are a list. | replace line 23 with:
  ```markdown
  Requests reach this skill when they name a diagram whose structure a reader follows rather than values to compare: an architecture, sequence, ER, swimlane, quadrant, timeline, Gantt or org-chart picture; a `.drawio`, `.mmd` or fenced-Mermaid source to redraw; an export of a finished diagram to PNG or SVG; or a plain-text flowchart in `ascii-markdown` rather than the default `html-svg`.

  The router selects from four resource families:

  - the always-loaded `references/foundations/style-guide.md` with the onboarding, output-spec and derivation references beside it
  - the per-type and import/export references under `references/types/` and `references/import-export/`
  - the `references/ascii-format/pattern-selection.md` reference with one matching `assets/ascii-patterns/` asset
  - the copyable forms, primitives and icon gallery under `assets/` and `references/`

  An ambiguous format returns `UNKNOWN_FALLBACK` rather than a guess.
  ```

### .skilled/skills/sk-design/sk-design-diagram/SKILL.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/SKILL.md:52 | 1 | §2 SMART ROUTING has 7 non-blank lines (52-58), one short of the skill-md template's 8-12 target and the pre-packaging checklist's "8-12 non-blank lines". | split line 52 after `rather than values to compare.` so the remainder starts on its own line as `The hub's diagram mode selects this packet.` — 8 non-blank lines, no wording change.

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/approval-workflow-loops.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/approval-workflow-loops.md:19 | 4, 5 | §1 OVERVIEW is a bare `Use this asset when…` sentence with no Purpose statement, and the concrete selection triggers sit in `## When to Use This Pattern` at line 374, after the 300-line example. | replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Lets a reader copy a proven multi-reviewer layout with loop-backs instead of inventing revision notation from scratch.

  ### When to Use

  Use this asset when documenting approval workflows that can loop through revisions before final sign-off.
  ```
  then move the bullets at lines 376-383 to the end of that block and delete lines 374-375.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/approval-workflow-loops.md:25 | 10 | Every H2 after §1 is unnumbered (currently at 25, 332, 344, 362, 368, 385, 396), so `render_h2_numbering` fires eight times; numbering them also requires ALL CAPS and a `---` separator, which the asset validator enforces. | replace them with:
  ```markdown
  ## 2. USE CASE: MARKETING CONTENT APPROVAL PROCESS
  ## 3. KEY FEATURES DEMONSTRATED
  ## 4. REVIEW STAGES
  ## 5. LOOP-BACK POINTS
  ## 6. ESCALATION TRIGGERS
  ## 7. DESIGN PRINCIPLES APPLIED
  ## 8. TYPICAL TIMELINE
  ```
  inserting a blank line and `---` before any of them that does not already have one.

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md:19 | 4, 5 | §1 OVERVIEW is a bare `Use this asset when…` sentence with no Purpose statement, and the concrete selection triggers sit in `## When to Use This Pattern` at line 295, after the 250-line example. | replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Lets a reader copy a proven branching layout instead of inventing branch, retry, and terminal notation from scratch.

  ### When to Use

  Use this asset when documenting conditional workflows with explicit branch labels, retries, and terminal outcomes.
  ```
  then move the bullets at lines 297-304 to the end of that block and delete lines 295-296.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/decision-tree-flow.md:25 | 10 | Every H2 after §1 is unnumbered (currently at 25, 271, 282, 306), so `render_h2_numbering` fires five times; numbering them also requires ALL CAPS and a `---` separator, which the asset validator enforces. | replace them with:
  ```markdown
  ## 2. USE CASE: E-COMMERCE ORDER PROCESSING SYSTEM
  ## 3. KEY FEATURES DEMONSTRATED
  ## 4. DECISION POINTS COVERED
  ## 5. DESIGN PRINCIPLES APPLIED
  ```
  inserting a blank line and `---` before any of them that does not already have one.

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/parallel-execution.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/parallel-execution.md:19 | 4, 5 | §1 OVERVIEW is a bare `Use this asset when…` sentence with no Purpose statement, and the concrete selection triggers sit in `## When to Use This Pattern` at line 198, after the 160-line example. | replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Lets a reader copy a proven fan-out and join layout instead of inventing synchronization notation from scratch.

  ### When to Use

  Use this asset when documenting workflows that split into concurrent branches and later join at a synchronization point.
  ```
  then move the bullets at lines 200-205 to the end of that block and delete lines 198-199.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/parallel-execution.md:25 | 10 | Every H2 after §1 is unnumbered (currently at 25, 188), so `render_h2_numbering` fires three times; numbering them also requires ALL CAPS and a `---` separator, which the asset validator enforces. | replace them with:
  ```markdown
  ## 2. USE CASE: DEPLOYMENT PIPELINE WITH PARALLEL TESTS
  ## 3. KEY FEATURES DEMONSTRATED
  ```
  inserting a blank line and `---` before any of them that does not already have one.

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/simple-workflow.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/simple-workflow.md:19 | 4, 5 | §1 OVERVIEW is a bare `Use this asset when…` sentence with no Purpose statement, and the concrete selection triggers sit in `## When to Use This Pattern` at line 101, after the 60-line example. | replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Lets a reader copy a proven box-and-arrow layout instead of drawing a linear flow from scratch.

  ### When to Use

  Use this asset when documenting a short linear workflow where each step follows directly from the previous one.
  ```
  then move the bullets at lines 103-108 to the end of that block and delete lines 101-102.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/simple-workflow.md:25 | 10 | Every H2 after §1 is unnumbered (currently at 25, 92), so `render_h2_numbering` fires three times; numbering them also requires ALL CAPS and a `---` separator, which the asset validator enforces. | replace them with:
  ```markdown
  ## 2. USE CASE: NEW USER REGISTRATION
  ## 3. KEY FEATURES DEMONSTRATED
  ```
  inserting a blank line and `---` before any of them that does not already have one.

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/system-architecture-swimlane.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/system-architecture-swimlane.md:19 | 4, 5 | §1 OVERVIEW is a bare `Use this asset when…` sentence with no Purpose statement, and the concrete selection triggers sit in `## When to Use This Pattern` at line 357, after the 260-line example. | replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Lets a reader copy a proven layer-and-service layout instead of inventing swimlane boundaries from scratch.

  ### When to Use

  Use this asset when documenting system interactions across layers, services, stores, caches, and error paths.
  ```
  then move the bullets at lines 359-366 to the end of that block and delete lines 357-358.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/system-architecture-swimlane.md:25 | 10 | Every H2 after §1 is unnumbered (currently at 25, 295, 307, 340, 368, 379), so `render_h2_numbering` fires seven times; numbering them also requires ALL CAPS and a `---` separator, which the asset validator enforces. | replace them with:
  ```markdown
  ## 2. USE CASE: MICROSERVICES AUTHENTICATION & DATA FLOW
  ## 3. KEY FEATURES DEMONSTRATED
  ## 4. ARCHITECTURAL LAYERS
  ## 5. DATA FLOW STEPS
  ## 6. DESIGN PRINCIPLES APPLIED
  ## 7. PERFORMANCE CONSIDERATIONS
  ```
  inserting a blank line and `---` before any of them that does not already have one.
