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
