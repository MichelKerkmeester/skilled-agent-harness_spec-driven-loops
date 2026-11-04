### .skilled/skills/mcp-tooling/mcp-obsidian/README.md
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/README.md:32 | 1 | OVERVIEW opens with `### Why This Skill Exists`; the skill README template requires `### What It Does` first, then the optional problem narrative, then the capability table. | Move lines 32-36 (the `### Why This Skill Exists` heading and its two paragraphs) to after line 46, immediately before `### The Plugin Knowledge Layer`.

### .skilled/skills/mcp-tooling/mcp-obsidian/ROUTER.md
- clean

### .skilled/skills/mcp-tooling/mcp-obsidian/SKILL.md
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/SKILL.md:326 | 2 | The three bare URLs at 326-328 trip `render_bare_url`; the External list renders without link titles. | Replace lines 326-328 with:
  ```
  - notesmd-cli repository: [Yakitrak/obsidian-cli](https://github.com/Yakitrak/obsidian-cli)
  - cyanheads obsidian-mcp-server: [cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server)
  - Obsidian Local REST API plugin: [obsidian-local-rest-api](https://github.com/coddingtonbear/obsidian-local-rest-api)
  ```

### .skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/health-md/health-viz-blocks.example.md
- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/health-md/health-viz-blocks.example.md:16 | 1 | The file has no `## 1. OVERVIEW`; the asset validator fails with `Missing required section: overview`. | Insert after line 16, before `## Minimal default`:
  ```
  ## 1. OVERVIEW

  ### Purpose

  A note author can place a working `health-viz` chart without reading the render contract first.

  ### Usage

  Paste the block that matches the window you need, then adjust its dates or `last` value.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/health-md/health-viz-blocks.example.md:18 | 10 | The six example H2s at 18, 25, 34, 42, 49 and 57 carry no integer section numbers. | Renumber the headings: `## 2. Minimal default`, `## 3. Sized chart`, `## 4. Windowed (inclusive from/to)`, `## 5. Last-N days`, `## 6. Click action (pin tooltip)`, `## 7. Dynamic date variable`.

### .skilled/skills/mcp-tooling/mcp-obsidian/assets/plugins/iconic/iconic-rules.full.md
- clean

### .skilled/skills/mcp-tooling/mcp-obsidian/assets/workflows.md
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/assets/workflows.md:20 | 4 | OVERVIEW opens with background prose about the mode and then jumps to `### Shared sequence`; it never states the asset's purpose or its usage under the template's Purpose/Usage headings. | Insert `### Purpose` after line 18 with the sentence `A plugin data edit lands safely, and the operator knows when a reload is the only step left.`, then rename line 22 `### Shared sequence` to `### Usage`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/cli-versus-mcp.md:22 | 2 | `## 1. OVERVIEW AND VERDICT` compounds OVERVIEW with the verdict topic; the render gate reports `render_overview_heading`. | Replace line 22 with `## 1. OVERVIEW` and insert `### Verdict` plus a blank line before line 26.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/mcp-tools.md:18 | 2 | Lines 18-21 are four consecutive bold-label paragraphs; the render gate reports three `render_bold_label_join` warnings and the four contracts collapse into one paragraph. | Prefix lines 18-21 with `- ` so each label becomes its own list item, leaving the text unchanged.
