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
