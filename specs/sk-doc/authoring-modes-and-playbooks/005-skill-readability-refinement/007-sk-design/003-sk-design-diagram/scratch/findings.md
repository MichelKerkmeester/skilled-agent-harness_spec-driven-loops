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

### .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/user-onboarding.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/user-onboarding.md:21 | 4 | `## 1. OVERVIEW` carries only a when-to-use sentence, so the file never states what the asset gives a reader. | Replace lines 19-21 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  A worked journey that carries a reader from signup to an active account, so a new onboarding diagram can follow the same stages.

  ### When to Use

  Use this asset when documenting onboarding journeys that mix education, validation, progress feedback, and completion states.

  - Multi-phase onboarding flows
  - Progressive feature introduction
  - Embedded sub-processes within main flow
  - User journeys with education and action
  - Flows requiring motivation and context
  - Complex setup with celebrations
  - Gradual feature unlock patterns
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/user-onboarding.md:324 | 5 | The "When to Use This Pattern" selection gate sits 300 lines after the diagram it governs, so a reader meets the exit condition only after reading the whole flow. | Delete lines 324-332; the list now opens the file per the previous bullet.
- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/ascii-patterns/user-onboarding.md:25 | 10 | Four H2s after the overview are unnumbered while §1 is numbered; the validator raises `render_h2_numbering` on each. | `## Use Case: Product Onboarding with Profile & Content Creation` → `## 2. Use Case: Product Onboarding with Profile & Content Creation`; `## Key Features Demonstrated` → `## 3. Key Features Demonstrated`; `## Design Principles Applied` → `## 4. Design Principles Applied`; `## Estimated Time to Complete` → `## 5. Estimated Time to Complete`.

### .skilled/skills/sk-design/sk-design-diagram/assets/diagrams/README.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/diagrams/README.md:29 | 7 | One 40-word sentence packs six separate corpus checks, so a reader verifying a file has to parse the clause back into a list. | Replace lines 28-33 with:
  ```markdown
  Nothing here is a strict template. Change the data, the labels, the geometry, the node count. The
  corpus check holds six things a file can be read for:

  - accessibility wiring
  - the 4px grid
  - arrow-label mask clearance
  - unique ids
  - no external resources
  - the palette block on the four starters whose tokens have to match the palette source

  It says nothing about what you draw, and it leaves whether connectors meet their targets, overlap, or
  fan too close together to the judged reads in the capture review.
  ```

### .skilled/skills/sk-design/sk-design-diagram/assets/style-reference/README.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/assets/style-reference/README.md:15 | 3 | The H1 is followed by a horizontal rule and `## 1. OVERVIEW`; there is no intro, so the page opens on a title and a line. | Insert after line 15:
  ```markdown

  Read this before adding a visual language, or before pointing the applicator at one that already exists. You get the four files a language needs and the reference this skill ships with.
  ```

### .skilled/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/DESIGN.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/assets/style-reference/harness-diagram/origin.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/README.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/README.md:50 | 10 | The italic footer sits after `## 3. RELATED RESOURCES`, so the related section is not the last content, and the footer only restates line 17. | Delete lines 48-50.

### .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/notation-and-validator.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/notation-and-validator.md:23 | 3, 4 | `## 1. OVERVIEW` is a single pointer sentence ("This file explains...") that restates the intro, and it has no Purpose or When to Use. | Replace line 23 with:
  ```markdown
  ### Purpose

  Knowing the mechanism behind each check turns a failed run into a fix rather than a guess at the threshold.

  ### When to Use

  - A flowchart fails `validate-flowchart.sh`.
  - The `>5 width variations` error appears.
  - You need notation the validator accepts before drawing.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/notation-and-validator.md:99 | 9 | `post-merge` records a migration event rather than durable routing guidance. | `no separate SKILL.md notation section exists post-merge` → `no separate SKILL.md notation section exists`

### .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/pattern-selection.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/pattern-selection.md:23 | 3, 4 | `## 1. OVERVIEW` is a single pointer sentence ("This file extends...") that restates the intro, and it has no Purpose or When to Use. | Replace line 23 with:
  ```markdown
  ### Purpose

  Choosing by workflow shape narrows six patterns to the one that fits, so the diagram starts from a shape that already matches its job.

  ### When to Use

  - Choosing which of the six pattern assets to copy.
  - A diagram has outgrown one screen and may need splitting.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/worked-example.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/ascii-format/worked-example.md:23 | 3, 4 | §1 repeats the intro's first sentence almost word for word, and the overview has no Purpose or When to Use heading. The page states its contents twice before naming an outcome. | Replace lines 21-23 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Gives a failing tree something to compare against, property by property.

    ### When to Use

    Use it as a shape to model a real decision tree on — replace the support-triage content with sourced nodes rather than copying it verbatim.
    ```
    The dropped sentence's claim (a compact validator-passing tree plus a breakdown of why it passes) is the intro's first sentence already, so every claim survives.

### .skilled/skills/sk-design/sk-design-diagram/references/catalog.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/catalog.md:13 | 3 | There is no intro after the H1. The page opens directly on `## 1. OVERVIEW`, so a reader gets no hook. | Insert after line 13: `Each row turns one reader question into one type and the canonical example that draws it, so the choice is made in one pass.` followed by a blank line and `---`.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/catalog.md:17 | 4 | OVERVIEW is one six-sentence paragraph with no Purpose or When to Use, packing the machine-read contract, the bidirectional guarantee, the rewrite licence and the two ceiling rules. | Replace lines 15-17 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    The table between the sentinels below is machine-read: the corpus check matches its columns by header name rather than by position. Every row resolves to a canonical example under `assets/diagrams/`, and every canonical example appears in exactly one row.

    ### When to Use

    Read this before choosing a type.

    ### Reading the table

    - Prose outside the sentinels is never asserted on, so rewrite this page freely.
    - A ceiling cell carries the number and qualifier its own type file states.
    - `No stated ceiling` means the file states none of its own, so the general budget of 9 nodes and 12 arrows applies.
    ```

### .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:73 | 7 | Four independent refusal rules sit in one paragraph, so a reader scanning for whether a command is allowed has to parse prose. | Replace lines 73-76 with:
    ```markdown
    - There is no force option.
    - A URL is refused by name rather than fetched, and an URL as the first argument is refused before anything else is parsed.
    - A `--forms` list may not be combined with `--all`.
    - Writing inside `assets/diagrams/` is refused: the stock forms are immutable, and this script only ever writes copies.
    ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:167 | 5 | The role table selects values by `markOnPaper` and the text gate, but both thresholds and the departure rule are defined three sections later in §7, after the reader has applied the rule. | Move lines 206-218 to immediately after line 158, prefix them with `### The gates a selection must clear`, and leave §7 opening at line 220 with `Every selected form's full palette is derived and gated in memory before any file is written.`
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/design-md-theming.md:268 | 6 | The `system=<id>` refusal sits at the end of §8, after every step it governs, so a reader learns a form was ineligible only after choosing and theming it. | Delete line 268 and add it as the last bullet of the §2 refusal list: `- A form that already carries `system=<id>` is refused by name; theming is applied to a stock form.`

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/README.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md:21 | 4, 6 | §1 has no Purpose or When to Use, and it says every value is "one of four kinds" while the fourth bullet is a retired key that applies to files rather than values. A live taxonomy and a migration note sit in one list. | Replace lines 19-26 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    Classifies every diagram-skin value as hand-picked, derived or fixed, and records the rule or source behind it.

    ### When to Use

    Open it when a value's origin is in question, before a re-theme, or when the corpus check reports a drift.

    Every color role the diagram skin themes appears in exactly one of three lists: LIGHT (§2), DARK (§3) and TERMINAL (§4). Every value in those lists is exactly one of three kinds:

    - **primary**: a value chosen by hand, stated verbatim. A re-theme replaces primaries and nothing else.
    - **derived**: computed from a primary by a stated rule, for example `ink` at an alpha. This is stricter than the style guide's prose, which also calls `soft` and `link` "derived" although no rule reproduces them.
    - **fixed**: a value that never re-themes. Onboarding and hand-edits of the skin leave it untouched.

    ### Retired key: `untokenized`

    **untokenized** used to be a fourth kind, applying to files rather than values: it marked a file exempt from this record because it carried its own fixed skin. The key is gone. The one file that held the exemption carried a tone the dark skin never defined, at 4.44:1 under the text gate, so the exemption was hiding a defect rather than recording a decision; repointing that tone onto the dark muted role emptied the list and the key went with it. Every form now regenerates from this record.
    ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/derivation-record.md:28 | 9 | "The applicator of a later phase reads this record" carries a development-phase reference into the body. | Replace with: `The applicator reads this record, and the corpus checker re-derives every value marked **derived** from the primaries recorded here.`

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/onboarding.md:66 | 1 | `### Colors` and `### Fonts` are H3 siblings of `### Step 2 — extract colors and fonts` rather than its children, so the outline reads as two extra steps and Step 2 as an empty heading. | Change `### Colors` at line 66 and `### Fonts` at line 79 to `#### Colors` and `#### Fonts`.

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/output-spec.md:17 | 3 | There is no intro after the H1. The page opens on `## 1. OVERVIEW`, so a reader gets no hook before the four dials. | Insert after line 17: `Open this before an import is redrawn or an export is sized.` followed by a blank line and `---`.

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md:15 | 3 | The intro opens with a pointer sentence, `This is the reference implementation of ...`, which names the artifact instead of telling the reader when to open it. | Replace line 15 with `The whole router in one piece, so a route can be followed from a request to the files it loads without leaving the page.` and move the old contract clauses into the §1 Purpose block below.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/router-pseudocode.md:21 | 4, 7 | §1 has no Purpose or When to Use, and its first sentence packs the four router pieces into one clause. | Replace lines 19-24 with:
    ```markdown
    ## 1. OVERVIEW

    ### Purpose

    The rules in [`../../ROUTER.md#3-machine-router`](../../ROUTER.md#3-machine-router) §3 (MACHINE ROUTER) are the contract; this file is the reference implementation, one way to hold them, kept whole here so the skill contract does not carry a fifth of its bytes as code.

    ### When to Use

    Read it when the routing rules have to be followed as working code.

    Four pieces carry the whole router:

    - the intent model that scores a request
    - the resource map that answers each winning intent
    - the load levels that say how much a run brings in
    - the UNKNOWN fallback for a request that scores nothing

    Read them in that order and the route a request takes is one pass down the file.
    ```

### .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md:25 | 4 | `## 1. OVERVIEW` opens on `### Core Principle`; the template's Purpose and When to Use slots are missing, so the reader meets the mechanism before the reason to open the file. | Insert before line 25:
  ```
  ### Purpose

  One file holds every skin decision, so a diagram resolves a role name instead of carrying a value.

  ### When to Use

  - A type reference or a drawing needs the value behind a semantic role.
  - A project needs a brand palette, a dark variant or the terminal skin.
  - A chart needs a non-focal series color.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/foundations/style-guide.md:48-51 | 7 | Four lines carry three separate rules in one paragraph: the five-role set, the light-only rule and the carried-by-channel rule. Only the first sentence is a lead-in. | Replace lines 48-51 with:
  ```
  The dark skin defines five roles — `paper`, `ink`, `muted`, `accent`, `link` — and no others:

  - A role marked *light only* has no dark value, and no dark form draws one.
  - A translucent treatment marked *carried by channel* needs no dark role either: both applicators match such a value by its channels and re-emit it at whatever alpha the drawing chose, so a dark repaint moves every one of them.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/import-export/README.md
- clean

### .skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md:16-18 | 3 | No intro after the H1: line 17 is blank and line 18 starts `## 1. OVERVIEW`, so the file opens on a section heading. | Insert after line 16 (shifts later lines +2, so the `output-spec.md` §3 citation at :126 becomes :128): "Open this when a finished diagram has to leave the browser for a slide, a doc, a chat message, or a print handout."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/import-export/export.md:65 | 1 | Step 5's example names `example-architecture.svg` for a source called `architecture.html`, contradicting both its own `<basename>.svg` rule and the PNG step at line 120 (`architecture.html` → `architecture.png`). A reader following the example writes the wrong filename. | Replace `example-architecture.svg` with `architecture.svg`.

### .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md:16-18 | 3 | No intro after the H1: line 17 is blank and line 18 starts `## 1. OVERVIEW`. | Insert after line 16 (shifts later lines +2, so the citations at :93, :95, :140, :142 and :186 become :95, :97, :142, :144 and :188): "Open this when a `.drawio` file is the only record of a system's shape and nobody has read it in years."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-drawio.md:133 | 5 | The `viewBox` rule ("Set the `viewBox` from the size preset, then lay out inside it — don't draw first and crop after") is the last bullet of §7, after the five layout bullets it governs; the sibling mermaid procedure puts the same rule first at §7 line 91. | Move line 133 to before line 104, so it becomes the first bullet of §7.

### .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-mermaid.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-mermaid.md:16-18 | 3 | No intro after the H1: line 17 is blank and line 18 starts `## 1. OVERVIEW`. | Insert after line 16 (shifts later lines +2; with the change below, the `output-spec.md` §7 citation at :102 becomes :108): "Open this when a README, an issue, or a design doc hands you a Mermaid block that has to match the rest of the set."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/import-export/import-mermaid.md:42 | 7 | One line carries five separate mechanisms: supported grammars, flowchart extensions, activation normalization, digest contents and the absence of coordinates. | Replace line 42 with:
  ```
  - **Supported grammars:** `flowchart` / `graph`, `sequenceDiagram`, `stateDiagram-v2`, `erDiagram`.
  - **Flowchart extensions:** classic delimiters plus Mermaid v11.3+ `@{ shape: ... }` nodes, multiline Markdown labels, and multidirectional links.
  - **Normalization:** sequence activation suffixes and central-connection `()` markers are normalized without changing participants.
  - **Digest:** mirrors the draw.io IR — diagram list, nodes/edges/containers, depth and cycles, shapes, type candidates, budget flags, hubs, entries, terminals, unconnected nodes, collapsible groups, and tables.
  - **Coordinates:** Mermaid has no source coordinates, so the digest reports `source layout: none (Mermaid is layout-free)` plus the declared direction.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/README.md
- clean

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-annotation.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-annotation.md:21-23 | 4 | `## 1. OVERVIEW` opens on the marginalia rationale and runs straight into `### Grammar`; there is no Purpose or When to Use, so the template's first two overview slots are absent. | Insert `### Purpose` before line 23, then insert after the `Think marginalia…` paragraph:
  ```
  ### When to Use

  - A diagram needs an editorial aside that its labels cannot carry.
  - A detail needs pointing at without adding a node or an arrow.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md:16-18 | 3 | No intro after the H1: line 17 is blank and line 18 starts `## 1. OVERVIEW`. | Insert after line 16: "Open this when a diagram needs a symbol a reader already knows — a database, a queue, a cloud — and a label alone will not carry it."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md:26 | 7 | The usage paragraph packs four actions a reader performs in order: find, copy, place and color. | Replace line 26 with:
  ```
  - **Find:** the icon by name (the `### name` headings below).
  - **Copy:** the fenced `<svg>` snippet into your diagram.
  - **Place:** default size is 24×24; wrap in `<g transform="translate(x,y) scale(s)">` to position and resize.
  - **Color:** set `color`, `fill`, or `stroke` on the parent group/SVG to control color.
  ```
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-icons.md:865-868 | 2 | Four bare URLs in the license list; `validate_document.py` reports `render_bare_url` on each. | Replace lines 865-868 with:
  ```
  - **Tabler Icons** — MIT — [tabler/tabler-icons](https://github.com/tabler/tabler-icons)
  - **Simple Icons** — CC0 — [simple-icons/simple-icons](https://github.com/simple-icons/simple-icons)
  - **Devicon** — MIT — [devicons/devicon](https://github.com/devicons/devicon)
  - **log-z/logos** — MIT — [log-z/logos](https://github.com/log-z/logos)
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-sketchy.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-sketchy.md:21 | 4, 6 | `## 1. OVERVIEW` opens on a bare "Use when…" sentence with no Purpose, and the labelled `### When to use` list sits at line 57, after the grammar, tuning table and critical rule it governs. | Replace lines 21-23 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Gives a diagram the look of a working sketch without costing label legibility.

  ### When to Use

  Use when the diagram accompanies an essay rather than technical docs.

  - Essay / blog post / newsletter where the diagram is the hero of a narrative page.
  - "Working sketch" register — showing something is mid-thought, not final architecture.

  ### When Not to Use

  - Technical documentation (precision matters).
  - Diagrams with dense labels or tight alignments (filter reads as noise).
  - Dark variants — wobble reads as artifact on dark backgrounds. Test first.
  ```
  then delete the now-duplicated `### When to use` … `- Dark variants…` block at lines 57-66.

### .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-terminal.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/primitives/primitive-terminal.md:21 | 4, 6 | `## 1. OVERVIEW` opens on a bare "Use for…" sentence with no Purpose, and the labelled `### When to use` list sits at line 86, after the grammar, typography, titlebar and critical-rule sections. | Replace lines 21-25 with:
  ```markdown
  ## 1. OVERVIEW

  ### Purpose

  Keeps the skin identical across posts: nine fixed tokens with no brand inheritance, so a terminal card always reads as the same tool.

  This is a **second, fixed skin** — see [style-guide.md § Terminal skin](../foundations/style-guide.md) for the token table. It does not inherit from `onboarding.md` brand tokens and isn't part of the light/dark inversion rule; every terminal example uses the same nine tokens regardless of the host site's brand.

  ### When to Use

  Use for dev-tool announcements, CLI-product posts, and technical social cards where a screenshot needs to read as "terminal," not "editorial doc."

  - Dev-tool / CLI-product launch posts (npm package, CLI flag, terminal-based workflow).
  - Technical social cards where "this is a tool for engineers" is part of the message.
  - Screenshots meant to pop in a dark-mode-heavy feed (X, Discord, dev blogs).

  ### When Not to Use

  - Editorial / long-form posts — pair with the default light or full-editorial variant instead.
  - Brand-matched output from `onboarding.md` — terminal is a fixed skin, not brand-tokenized. Don't try to reconcile the two.
  - Any diagram where the audience isn't developer-coded to read `$`/`#`/titlebar-dots as chrome rather than content.
  ```
  then delete the now-duplicated `### When to use` … `- Any diagram where the audience…` block at lines 86-96.

### .skilled/skills/sk-design/sk-design-diagram/references/types/README.md

- clean

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use, so the file opens on a section heading and a diagram list. | Replace lines 16-20 with:
  ```markdown
  # Architecture

  Open this when a topology has more boxes than the space between them allows, and the wires still have to be traceable.

  ## 1. OVERVIEW

  ### Purpose

  Gives every topology the same grammar: orthogonal connectors, bridged crossings, and zones that carry their own boundary label.

  ### When to Use

  **Best for:** system overviews, data-flow diagrams, integration maps, infra topology.
  ```
  This adds 8 lines: the zone-margin bullet at :90 becomes :98 and the EXAMPLES bullets at :105-107 become :113-115.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-architecture.md:90 | 1 | The zone margin is restated with a different minimum than §3: this bullet allows 12–16px, while line 57 requires ≥16px between the label and the node, and the §3 formula (`zone y = node_top − 32`, `label mask y = zone_y + 4`, 12px label) yields exactly 16px. A reader sizing the zone cannot satisfy both. | `- Leave 12–16px above the first enclosed node — the eyebrow label sits in this margin.` → `- Leave the header margin §3 sets: ≥16px between the label's bottom edge and the first enclosed node.`

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # Bar / Column Chart

  Open this when the reader has to compare values across categories, not trace a trend.

  ## 1. OVERVIEW

  ### Purpose

  Turns a quantity comparison into a single message: a capped bar count, one focal bar, and an axis that never distorts magnitude.

  ### When to Use

  **Best for:** comparing discrete quantities across categories or time intervals — sprint velocity, monthly revenue, feature adoption, cohort counts. Use when each category has a single numeric value and the comparison between bars is the primary message.
  ```
  This adds 8 lines: the §3-§5 block at :52-73 becomes :60-81.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:52 | 6 | ANTI-PATTERNS precedes VARIANTS, so a reader choosing between grouped and stacked bars meets the failure list first. The sibling `type-loop.md` puts VARIANTS before ANTI-PATTERNS (188 before 220), and the anti-pattern "More than 8 bars without grouping" governs the variant choice. | Replace lines 52-66 with:
  ```markdown
  ## 3. VARIANTS

  - **Grouped bars:** two bars per category, side by side. Use `accent` for the primary series and `series-1` for the secondary. Max 2 groups.
  - **Stacked bars:** segments stacked to total. Use `accent` for the focal segment; muted tints for others. Document the total at the top of each stack.

  ---

  ## 4. ANTI-PATTERNS

  - More than 8 bars without grouping (illegible at normal scale).
  - Truncated y-axis (not starting at 0) — distorts the magnitude comparison.
  - Accent on more than 1 bar ("everything is important" = nothing is).
  - 3-D bar extrusion — no shadows, no depth.
  - Category labels rotated more than 45°; prefer short labels or horizontal chart instead.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-bar.md:71 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `bar.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. A reader following the list hits two missing files. | Replace lines 71-73 with:
  ```markdown
  - `assets/diagrams/bar.html` — the canonical rendered example.
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # Data Flow

  Open this when a pipeline diagram has to name the role behind every step, not just the tool.

  ## 1. OVERVIEW

  ### Purpose

  Makes a role-scoped pipeline reproducible: one inputs schema, deterministic geometry, and arrow styles bound to topology.

  ### When to Use

  **Best for:** visualising how data moves through a pipeline *across organisational roles* — who initiates, who processes, who publishes, and who consumes. The canonical use case is a multi-role data platform (Admin → Engineers → Scientists → Consumers) with 4–6 process steps. Use when the reader needs to understand **who does what at each stage**, not just the technical components.
  ```
  This adds 8 lines: the EXAMPLES bullets at :386-391 become :394-399.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-data-flow.md:386 | 1 | Five of the six example paths do not exist: `assets/diagrams/` holds `data-flow.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 386-391 with:
  ```markdown
  - `assets/diagrams/data-flow.html` — the canonical rendered example: the platform, 4-role × 5-step (Admin, Engineers, Scientists, Consumers).
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # DP integration

  Open this when a platform diagram is at risk of collapsing six integrations into one bus arrow.

  ## 1. OVERVIEW

  ### Purpose

  Keeps the integration surface countable: every source, consumer and cross-cutting service gets its own wire, and the platform layer is drawn as one zone.

  ### When to Use

  **Best for:** the integration topology of a data platform — which source systems plug in, which consumer surfaces plug out, and which protocol each one speaks. Hub-and-spoke layout wrapped in an explicit **Data platform** layer; no time/phase axis.
  ```
  This adds 8 lines: the §3.1 paragraph at :176 becomes :184, the footer examples at :266-268 become :274-276, the inbound citation at :278 becomes :286, and the EXAMPLES bullets at :422-427 become :430-435.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:176 | 7 | One paragraph carries three separate facts: the canonical y/height values, the zone-bottom clearance, and the reason for the 76-px gap. | Replace line 176 with:
  ```markdown
  This produces the canonical layout for the standard shape (top bar / 3-node row / bottom bar):

  - Trino at `y=104 h=56`, primary row at `y=176 h=72`, Airflow at `y=324 h=44`.
  - Airflow's bottom anchor at y=368, 40-px clear of the zone bottom at y=408.
  - The 76-px gap between the primary row's bottom (y=248) and Airflow's top (y=324) is intentional: Airflow sits at the same y-band as source/consumer row 4 (cy=388), so it reads as a sibling of the bottom side-column row.
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:266 | 1 | The worked examples use 560 as the zone centre, but §3 sets `zone_cx = zone_x + zone_w/2 = 608` and line 257 routes the N=1 line at `x = zone_cx`. Applying the formula at line 262 gives 608 / 592, 624 / 576, 608, 640, so every listed value is 48px left of where the rule draws it. | Replace lines 266-268 with:
  ```markdown
  - N=1 → 608
  - N=2 → 592, 624
  - N=3 → 576, 608, 640
  ```
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-integration.md:422 | 1 | Five of the six example paths do not exist: `assets/diagrams/` holds `dp-integration.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 422-427 with:
  ```markdown
  - `assets/diagrams/dp-integration.html` — the canonical rendered example (1 footer = AD).
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md

- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md:16 | 3, 4 | No intro after the H1 (line 17 is blank and line 18 starts `## 1. OVERVIEW`), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-20 with:
  ```markdown
  # DP security matrix

  Open this when the access question has to be answered per role and per component, not in prose.

  ## 1. OVERVIEW

  ### Purpose

  Turns an access policy into a grid a reviewer can audit: every role-component intersection resolves to a level, and one focal cell carries the exception.

  ### When to Use

  **Best for:** documenting per-role / per-component access permissions for a data platform — a grid where each row is a platform component (Keycloak, MinIO bucket, Trino catalog, JupyterHub, NiFi, …) and each column is a role / AD group (Data Administrators, Data Engineers, Data Scientists, Data Consumers, …). Each intersection cell holds a permission value (Admin / Full / R/W / Read / SELECT / Login / No access) with a visual category that matches the permission level. One cell may be marked focal to flag a critical access rule (e.g., "Data Consumers can ONLY `SELECT` from the aggregated catalog — sole consumer access").
  ```
  This adds 8 lines: the inbound citations at :24 and :192 become :32 and :200, and the EXAMPLES bullets at :311-313 become :319-321.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-dp-security-matrix.md:311 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `dp-security-matrix.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 311-313 with:
  ```markdown
  - `assets/diagrams/dp-security-matrix.html` — the canonical rendered example (NatStat: 4 roles × 8 components, focal at Data Consumers × Trino aggregated).
  ```

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-er.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-er.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this before drawing a schema whose foreign keys outnumber the entities that own them.\n\n## 1. OVERVIEW\n\n### Purpose\n\nTurns a data model into one repeatable figure: every entity box has the same two sections, cardinality sits at each end of a relationship, and related entities cluster so the lines stay straight.\n\n### When to Use\n\n**Best for:** database schemas, API resource relationships, domain models."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-er.md:43 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `er.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. A reader following the list hits two missing files. | Replace lines 43-45 with: "- `assets/diagrams/er.html` — the canonical rendered example."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-flowchart.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-flowchart.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the reader has to follow a decision instead of reading a list of steps.\n\n## 1. OVERVIEW\n\n### Purpose\n\nMakes a branch readable at a glance: shape carries the node type, every exit is labelled, and rejoining branches meet at one dot.\n\n### When to Use\n\n**Best for:** decision logic, algorithms, user-facing branching flows (\"Should I…?\"), onboarding routing, support-triage trees."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-flowchart.md:43 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `flowchart.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 43-45 with: "- `assets/diagrams/flowchart.html` — the canonical rendered example."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-gantt.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-gantt.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the argument is about when work collides, not about what the work is.\n\n## 1. OVERVIEW\n\n### Purpose\n\nPlaces the whole plan on one time axis, so overlap, parallel tracks and milestones are read from the picture rather than explained in a caption.\n\n### When to Use\n\n**Best for:** project plans and roadmaps — tasks with explicit start and end dates, grouped into phases. Use when the reader needs to see temporal overlap, parallel tracks, and milestone sequencing at a glance."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-gantt.md:65 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `gantt.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 65-67 with: "- `assets/diagrams/gantt.html` — the canonical rendered example."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the deployment picture has to answer questions about phasing, boundaries and cross-cutting concerns at once.\n\n## 1. OVERVIEW\n\n### Purpose\n\nMakes an end-to-end stack reproducible: a short input list fixes every chevron, node and connector, so two people drawing it produce the same SVG.\n\n### When to Use\n\n**Best for:** end-to-end data stack overviews — ingestion → storage → query → analytics → visualization — deployed on a container orchestrator (Kubernetes, ECS, Nomad). Combines a phase chevron banner, deployment boundary, orchestration bar, identity footer, and (optionally) a right-side vertical chevron strip for cross-cutting concerns (Orchestration, Security, Observability)." This adds 8 lines: §4.4 moves from :303 to :311, §8 from :434 to :442, §10 from :468 to :476. Inbound citations target §4.4 by number, so they stay valid.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md:470 | 1 | Five of the six example paths do not exist: `assets/diagrams/` holds `high-level.html` only, and no directory holds a dark, full or vertical variant. | Replace lines 470-475 with: "- `assets/diagrams/high-level.html` — the canonical rendered example: 5-phase horizontal chevron banner, light skin."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md:440 | 1 | Checklist item 3 restates the canvas width as `effective_w = 972`, but §3.1 computes `1000 - 28 - 8 = 964` and §6 repeats 964; 972 is the right strip's x, so a reader sizing the body or the strip from this item draws the cluster 8px into the strip margin. | Replace "`effective_w = 972`" with "`effective_w = 964`".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md:108 | 1 | The stated growth is wrong: `strip_y_bot = 388 + n_cross * 44 - 4` and `viewBox_h = max(540, strip_y_bot + 112)` give 584 for two crosscuts, not 600, and 584 is not a multiple of 20, so the "rounds to the next multiple of 20" rule does not produce the numbers on the line. | Replace line 108 with: "`viewBox_h` grows when more than one cross-cutting bar is declared: 1 crosscut → 540, 2 → 584, and each further crosscut adds 44; the result stays on the 4px grid."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-high-level.md:450 | 10 | The reproducibility checklist numbers its last item `11.` immediately after the real item 11 on line 448, so 13 items carry 12 numbers and "#11" names two different checks. | Replace "11. The diagram passes SKILL.md §6" with "13. The diagram passes SKILL.md §6".

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the cost of the current setup still has to be shown, before anyone is asked to fund its replacement.\n\n## 1. OVERVIEW\n\n### Purpose\n\nProduces a before-picture a stakeholder can agree with: the legacy landscape in zones, its pain-points flagged, and every hand-off named.\n\n### When to Use\n\n**Best for:** documenting the *before* picture of a modernization proposal — the legacy IT landscape grouped by phase or department (Collection → Processing → Dissemination, or Frontend / Backend / Storage, or Survey → Analysts → Reports), with pain-points flagged, file-based hand-offs labelled (CSV / Excel / Email / Copy), and pre-platform tooling visible. The companion to `type-dp-integration.md`: this type shows the gap that a data-platform proposal is going to close." This adds 8 lines: §3's formula block moves from :102 to :110, §8's item 4 from :383 to :391, §11.1 from :461 to :469, and the closing paragraph from :486 to :494.
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:412 | 1 | Four of the five example paths do not exist (`it-state-dark`, `-full`, `-extended`, `-extended-dark`), `Gallery default` names a gallery the skill does not ship, and "NatStat canonical" / "SQL Server tinted olive" describe data the shipped `it-state.html` does not contain (it draws Northwind Retail, with `On-prem RDBMS` as the olive survivor). | Replace lines 412-416 with: "- `assets/diagrams/it-state.html` — the canonical rendered example: 3 zones, 9 components, 8 connectors, 0 footer bars, one survivor tinted olive."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:486 | 1 | The closing paragraph points at `it-state-extended.html` via "§10 line 4", a file that does not exist, so the proof it claims has no referent. | Replace line 486 with: "When `N_footer > 0`, `viewBox_h` grows by one `footer_bar_h + footer_gap` step per bar — 64px — because §3's `footer_bottom` term carries every footer row."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:383 | 1 | Checklist item 4 says the focal line-1 sub is "italic", but §3.2's kind table and §6's auto-styling both say the line-1 sub takes the accent colour, and the shipped `it-state.html` declares no italic anywhere. | Replace "italic line-1 sub" with "accent line-1 sub".
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-it-state.md:137 | 1 | `viewBox_h = content_bottom + legend_block_h + 24` with `content_bottom = 412` and `legend_block_h = 40` gives 476, but §11.1 states `52 + 360 + 40 + 24 = 500` and the shipped `it-state.html` viewBox is `0 0 960 500`; the formula's constant is the term that is off. | Replace line 137 with "legend_block_h  = 64" and replace line 465 with "- `viewBox_h = 52 + 360 + 64 + 24 = 500` (no footer bars) ✓".

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-layers.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-layers.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the argument is about where a change belongs, not what it does.\n\n## 1. OVERVIEW\n\n### Purpose\n\nGives a stack one band grammar — index tag, name, note — so depth reads top to bottom without a legend.\n\n### When to Use\n\n**Best for:** OSI model, CSS cascade, context hierarchy, tech stack, abstraction layers, memory hierarchy."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-layers.md:46 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `layers.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 46-48 with: "- `assets/diagrams/layers.html` — the canonical rendered example."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-line.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-line.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when a table of weekly values hides the story a line would show.\n\n## 1. OVERVIEW\n\n### Purpose\n\nPuts a trend on a shared axis so direction and rate of change survive comparison across series.\n\n### When to Use\n\n**Best for:** continuous trends over time or a sequential index — signups over weeks, revenue by month, latency over releases. Use when the direction and rate of change between points is the primary message."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-line.md:64 | 1 | Two of the three example paths do not exist: `assets/diagrams/` holds `line.html` only, and `assets/diagrams/README.md` §2 lists one canonical form per type. | Replace lines 64-66 with: "- `assets/diagrams/line.html` — the canonical rendered example."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-line.md:28 | 1 | "Same faint treatment as bar chart" is unresolvable from this file: the router loads exactly one type reference per request, so the reader never has `type-bar.md` open, and the file states no stroke for its own gridlines. | Replace "Same faint treatment as bar chart." with "Stroke `rgba(45,49,66,0.08)` at 0.8px; the x-axis baseline at `rgba(45,49,66,0.25)` at 1px."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md:16 | 3, 4 | No intro between the H1 (line 15) and `## 1. OVERVIEW` (line 17), and §1 opens on `**Best for:**` with no Purpose or When to Use. | Replace lines 16-19 with: "\nOpen this when the last step feeds the first and the diagram has to show that it does.\n\n## 1. OVERVIEW\n\n### Purpose\n\nMakes a reinforcing cycle reproducible: equal stations on one circle, exactly one hub, and dashed write-backs that show where state accumulates.\n\n### When to Use\n\n**Best for:** reinforcing cycles, flywheels, feedback loops, and operating loops — anything where the last step feeds the first and a shared hub accumulates state. Use Loop when the reader must see both motions at once: work advances clockwise around the ring, while each pass writes durable state back to one common center."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md:237 | 1 | Two of the three example paths do not exist (`loop-dark.html`, `loop-full.html`), while the Loop example that does ship, `loop-terminal.html`, is not listed. | Replace lines 237-239 with: "- `assets/diagrams/loop.html` — the canonical rendered example: six-station self-improving operating loop.\n- `assets/diagrams/loop-terminal.html` — the same six-station loop in the fixed terminal skin."
- [P1] .skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md:21 | 1 | `**Cycle**` reads as a sibling diagram type, but the skill ships 27 types and none is Cycle (`references/catalog.md`, `references/types/README.md`, no `type-cycle.md`), so the fallback the selection rule sends the reader to cannot be loaded. | Replace "Prefer **Cycle** when the center does not accumulate shared state." with "Prefer **Process** when the center does not accumulate shared state."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-loop.md:79 | 1 | "station 1 sits at the top" contradicts the formula above it (`theta_0 = -90deg`, so station 0 is the top one), §2's "`stations[0]` is the top station", and §7 item 2's "Station 0 is at `-90deg`". | Replace "Thus station 1 sits at the top" with "Thus station 0 sits at the top".

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

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Open this before drawing a multi-actor exchange: the message table and branch frames decide whether the call order is readable."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md:19 | 4 | The overview opens with one `**Best for:**` run and states no Purpose; the six triggers are a comma run rather than a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar an exchange over time is drawn against, so the reader can tell who holds control, which kind each arrow is, and which branch a message belongs to.\n\n### When to Use\n\n- Request/response flows\n- Protocol exchanges\n- Multi-actor interactions over time\n- API call traces\n- Incident reconstructions\n- Auth/token refresh paths with branching"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md:108 | 9 | `second PR if needed` is a progress token naming a future change vehicle; the durable claim is that these operators are out of scope. | Replace line 108 with: "- `par`, `critical`, `break`, `ref`, and other UML operators."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-sequence.md:125 | 6 | The lifeline and activation-bar primitives are the only ones split from their topic: section 2 describes both in prose, section 3 embeds its async marker and section 4 its frame primitives, but these two sit after the complexity budget. | Move the `## 6. LIFELINE PRIMITIVE` and `## 7. ACTIVATION BAR PRIMITIVE` sections (lines 125-137) and the `---` that follows them to sit between the section-2 divider (line 33) and `## 3. MESSAGE KINDS`; number them `## 3.` and `## 4.`, then renumber `MESSAGE KINDS`→`## 5.`, `COMBINED FRAGMENTS`→`## 6.`, `COMPLEXITY BUDGET`→`## 7.`

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-state.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-state.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Use this when statuses change into one another and the reader has to know what triggers each move."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-state.md:19 | 4 | The overview is a single `**Best for:**` run: no Purpose is stated and the triggers are not a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar a lifecycle is drawn against, so each status, transition and self-loop reads as one machine rather than a box-and-arrow sketch.\n\n### When to Use\n\n- Finite state logic — order status, auth state, connection lifecycle, form wizard, job queue status"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-state.md:25 | 7 | One bullet packs two different marker treatments under two bold labels. | Replace line 25 with: "- **Start**: filled ink dot (`r=6`).\n- **End**: ringed dot (outer `r=8` outline, inner filled `r=5`)."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Read this when the question is not only what happens, but which team does it and where the work changes hands."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md:19 | 4 | The overview is a single `**Best for:**` run: no Purpose is stated and the triggers are not a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar a cross-functional process is drawn against, so the reader can see which actor performs each step and where ownership passes.\n\n### When to Use\n\n- Cross-functional processes\n- RACI-style flows\n- Vendor handoffs\n- Multi-team shipping workflows"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md:24 | 7 | One bullet carries two operations: the lane geometry and the placement of each lane label. | Replace line 24 with: "- Horizontal lanes (or vertical columns) — one per actor/team.\n- Label each lane in the left margin (or top) with a Geist Mono eyebrow."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-swimlane.md:27 | 6 | The step-count caveat at line 28 is separated from the steps bullet (line 26) by the handoff rule, so the section returns to step layout after leaving it. | Swap lines 27 and 28 so the caveat follows the steps bullet and the handoff rule closes the section.

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-timeline.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-timeline.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Reach for this when dated events must read in sequence and the gaps between them matter as much as the events."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-timeline.md:19 | 4 | The overview is a single `**Best for:**` run: no Purpose is stated and the triggers are not a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar a dated sequence is drawn against, so elapsed time is read from position on the axis rather than from the labels alone.\n\n### When to Use\n\n- Release history\n- Project milestones\n- Incident timelines\n- Roadmaps\n- Changelog visualizations"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-timeline.md:28 | 5 | The honest-scale rule governs where event circles are placed, but the placement bullet (line 26) and milestone bullet (line 27) come first. | Move line 28 ("Time scale must be honest...") to after line 25 (the tick-mark bullet), before the events bullet.

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Open this when a structure has levels and the reader must see which node owns which without tracing diagonals."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md:19 | 4 | The overview is a single `**Best for:**` run: no Purpose is stated and the triggers are not a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar a hierarchy is drawn against, so every level and parent-child link stays readable at a glance.\n\n### When to Use\n\n- Org charts\n- Dependency trees\n- Taxonomy\n- File trees\n- Decision breakdowns\n- Skill trees"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md:30 | 5 | `Draw connectors before nodes` is a build-order instruction that governs the node and connector bullets above it, but it closes the section. | Move line 30 to after line 24 (root/children orientation), before the node-treatment bullet.
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-tree.md:26 | 7 | One bullet packs the orthogonality rule, a three-step elbow path and the stroke width into one sentence. | Replace line 26 with: "- **Connectors are orthogonal (elbow-style), never diagonal.** 1px muted stroke.\n  1. Parent drops a short vertical line.\n  2. A horizontal bus connects siblings.\n  3. Each child has a short vertical drop into its top edge."

### .skilled/skills/sk-design/sk-design-diagram/references/types/type-venn.md
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-venn.md:15 | 3 | No intro between the H1 and `## 1. OVERVIEW`; the reference template requires a 1-2 sentence hook there. | Insert between line 15 and line 17, as its own paragraph: "Use this when two or three categories overlap and the shared ground between them is the point."
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-venn.md:19 | 4 | The overview is a single `**Best for:**` run: no Purpose is stated and the triggers are not a When to Use list. | Replace line 19 with: "### Purpose\n\nSets the grammar a set overlap is drawn against, so the shared region, not the circles, carries the message.\n\n### When to Use\n\n- Intersection of concepts/domains\n- Shared attributes between categories\n- \"where A meets B\"\n- Ikigai-style frames (desirable × feasible × viable)"
- [P2] .skilled/skills/sk-design/sk-design-diagram/references/types/type-venn.md:31 | 6 | The 4px grid constraint governs the circle geometry set out above it, but it trails the section after labels and accent. | Move line 31 ("Circle centers and radii divisible by 4.") to after line 24 ("Prefer 2 or 3 circles..."), before the stroke bullet.

