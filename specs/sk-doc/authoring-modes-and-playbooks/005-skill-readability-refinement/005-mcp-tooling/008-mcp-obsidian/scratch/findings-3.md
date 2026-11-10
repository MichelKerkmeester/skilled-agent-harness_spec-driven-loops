### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md:16 | 3 | The H1 is followed directly by `## 1. OVERVIEW`; the file has no intro, so it opens without a hook. | Insert after line 16:
    ```
    Open this first when a request touches Iconic. It maps the file-layer surface and names the companion reference that answers the next question.

    ---

    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md:20 | 4 | The overview has no Purpose or When to Use; the single policy sentence sits bare under the H2. | Replace line 20 with:
    ```
    ### Purpose

    The `mcp-obsidian` mode operates this plugin by **editing its `data.json` rulebook** — never by driving the icon-picker UI.

    ### When to Use

    - A request names Iconic, an icon, a folder color, or an icon rule.
    - Choosing between a rule, a visibility toggle, and a per-item override.
    - Checking a rule's shape before merging it into a vault.
    ```
- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md:93 | 8 | The file is titled "Iconic File-Layer Index" and routes as the plugin index, but it lists none of the three sibling references (`data-model.md`, `workflows.md`, `troubleshooting.md`), so the rest of the tree is unreachable from it. | Append after line 93:
    ```

    ---

    ## 7. RELATED RESOURCES

    | File | Use it for |
    | --- | --- |
    | `data-model.md` | The full `data.json` contract: top-level keys, rulebook schema, visibility toggles, per-item icon maps, and safe-merge discipline |
    | `workflows.md` | Safe recipes: add or edit rules, flip toggles, change colors, and merge the canonical rulebook |
    | `troubleshooting.md` | Cause, detection, and recovery for invalid JSON, lost rules, missing icons, stale reads, and version drift |
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/iconic.md:38 | 7 | The "WHAT IT DOES" paragraph packs three mechanisms — surfaces, matching, and rendering — into one block. | Replace line 38 with:
    ```
    Customizes icons and their colors directly in the Obsidian UI.

    - **Surfaces** — tabs, files & folders, bookmarks, tags, properties, and ribbon commands.
    - **Matching** — rules match by file extension or folder name; per-item overrides exist for individual icons.
    - **Rendering** — in-app; the mode touches only the JSON.
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/troubleshooting.md

- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/troubleshooting.md:23 | 2, 4 | `render_overview_orientation` fires at line 23: the overview opens with the symptom table and has no Purpose or When to Use. | Insert before line 23:
    ```
    ### Purpose

    Name the one cause behind an Iconic failure before changing a file or a rule.

    ### When to Use

    - Icons are missing, wrong, or the wrong color.
    - The plugin will not load after a write.
    - Rules vanished after an edit, or an unknown key appeared after an update.
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/workflows.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/workflows.md:23 | 4 | The overview opens with `### Operating sequence`; it has no Purpose or When to Use, so the reader starts at step 1 without the outcome or the trigger. | Insert before line 23:
    ```
    ### Purpose

    Change one Iconic rule or toggle and leave every other setting exactly as it was.

    ### When to Use

    - Adding, editing, disabling, or recoloring a rule.
    - Flipping a visibility toggle.
    - Applying the canonical rulebook to a vault.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/workflows.md:63 | 6 | The two "add a rule" recipes are split by three unrelated recipes; a reader adding a folder rule meets it after the bulk-apply recipe. | Move lines 63-69 (`### Add a folder rule` through its JSON block) to after line 44, before `### Change a color`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md:24 | 4 | The overview opens on the count and class bullets but never states a Purpose or When to Use. | Insert before line 24:
    ```
    ### Purpose

    Keep the vault's plugin inventory and its documentation status in one place, so an install, enablement, or removal has one place to reconcile.

    ### When to Use

    - A request names an Obsidian plugin and you need its id, version, or repository.
    - Checking whether a plugin still has a dedicated reference tree.
    - Reconciling the roster after an install, enablement, or removal.
    ```
    This moves the `plugin-operation-logic.md` citation at line 47 down; update that line reference when applying.
- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md:87 | 10, 2 | `render_section_order` fires: `## 5. NOTES AND RELATED` is followed by `## 6. KEEPING THIS ROSTER CURRENT`, so the related block is not the last H2. | Move the `## 6. KEEPING THIS ROSTER CURRENT` block (heading through its closing paragraph, currently lines 97-106) to immediately before the `---` that precedes `## 5. NOTES AND RELATED`, renumber the moved heading to `## 5.`, and renumber `## 5. NOTES AND RELATED` to `## 6.`. The swap touches only the file's tail, after the line-47 citation.
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/installed-plugins.md:47 | 7 | The §3 intro paragraph packs four points — the persistence rationale, the docs removal, the count, and the operating instruction — into one 80-word block. | Replace line 47 with:
    ```
    These plugins persist their state as markdown, frontmatter, or a structured file, so the file-layer operating model in `plugin-operation-logic.md` applies to them exactly as it applies in §2.

    - **What changed** — their dedicated reference trees were removed from this skill, so there is no `references/plugins/<name>/` tree and no `feature-catalog/plugins/<name>.md` entry to follow.
    - **Install state** — all 13 remain installed and enabled in the vault.
    - **How to operate one** — locate its on-disk data and edit that directly.
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:26 | 4 | The Purpose opens with a location fragment ("Ships in...") before it states the outcome. | Replace line 26 with:
    ```
    `plugin-operation-logic.md` ships in the `mcp-obsidian` mode at `references/plugins/` and defines one operating model for every plugin the mode covers: locate the plugin's persisted data, edit the data directly, and let the app re-render. The surviving per-plugin and theme references (`health-md`, `iconic`, `minimal`) apply this model to their specific file shapes; this document is the general contract.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/plugin-operation-logic.md:34 | 4 | `### When to Use` sits after `### Core Principle`, so the overview does not open with Purpose and When to Use in template order. | Move lines 34-39 (`### When to Use` through its trailing blank line) to immediately before line 28 (`### Core Principle`). No net line change; line 110 stays fixed.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/customization.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/customization.md:23 | 4 | The overview opens on "There are two customization levers" and a table; it has no Purpose or When to Use. | Insert before line 23:
    ```
    ### Purpose

    Keep every visual change in a snippet the user can toggle off, while the theme underneath stays updatable.

    ### When to Use

    - A user wants a visual change to an installed theme.
    - Deciding between a CSS snippet and a variable override.
    - Checking whether a snippet is actually enabled.
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/plugin-development.md

- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/plugin-development.md:23 | 2, 4 | `render_overview_orientation` fires at line 23: the overview opens with the surface table and has no Purpose or When to Use. | Insert before line 23:
    ```
    ### Purpose

    Choose the right build surface — theme, snippet, or plugin — and know the package a plugin needs before writing code.

    ### When to Use

    - A need is behavioral rather than visual, and a theme or snippet will not cover it.
    - Checking the required plugin files, manifest fields, or the sample starting point.
    - Preparing a plugin for community submission.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/plugin-development.md:19 | 3 | The intro's third sentence is a pointer ("This is an overview that points to ... not an exhaustive tutorial"); the same scope claim is already stated in §5. | Replace line 19 with:
    ```
    A plugin is JavaScript that changes Obsidian's **behavior** — commands, views, settings. It is the behavioral counterpart to a theme (styling only).
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/plugin-development.md:64 | 6 | `## 5. SCOPE OF THIS REFERENCE` is a boundary statement parked after submission, so a reader meets the out-of-scope rule only after the content it bounds. | Move lines 64-66 into §1 as `### Boundaries` after line 29, and renumber `## 6. RELATED RESOURCES` to `## 5.`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/theme-development.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/theme-development.md:23 | 4 | The overview opens on the theme folder tree and two file bullets; it has no Purpose or When to Use. | Insert before line 23:
    ```
    ### Purpose

    Produce a theme package Obsidian loads, that works in both dark and light modes, and that the community catalog accepts.

    ### When to Use

    - Building a theme from the official sample.
    - Checking the two required files or the `manifest.json` name rule.
    - Preparing a theme for submission to the community catalog.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/theme-development.md:19 | 3 | The intro's second sentence is a pure contents pointer ("This reference covers ..."), not a hook. | Replace line 19 with:
    ```
    Building a theme means authoring a `manifest.json` and a single `theme.css` that restyles Obsidian; open this before you create the folder and again at submission time. It is not an exhaustive CSS tutorial.
    ```
