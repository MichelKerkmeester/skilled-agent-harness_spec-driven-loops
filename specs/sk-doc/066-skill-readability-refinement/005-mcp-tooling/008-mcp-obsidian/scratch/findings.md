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

### .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md:25 | 4 | OVERVIEW has no Purpose or When to Use; the only trigger list sits at §7 (line 175), so the detail arrives before the routing. | insert before line 27:
    ```markdown
    ### Purpose

    Finish a Notion migration at the file layer and prove parity before the source workspace is retired.

    ### When to Use

    Open it once `mcp-notion`'s inventory exists and the Importer has run — or before either, to see what the import will leave behind.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md:29 | 7 | One 90-word paragraph carries two parallel feature lists (eight auto-conversions, six non-conversions); neither list scans. | replace line 29 with:
    ```markdown
    The importer auto-converts:

    - Pages and nested hierarchy
    - Internal links
    - Databases → Bases
    - Properties → frontmatter
    - Formulas and rollups → Bases formulas (a hybrid strategy)
    - Single relations → wikilinks
    - Block attachments
    - Page covers

    It does **not** convert:

    - Comments
    - Secondary database views
    - Two-way relation back-references
    - Gallery cover images
    - External attachments (unless opted in)
    - The `style()`/`name()`/`email()` formula functions (no Obsidian equivalent)

    Treat every one of those as a reconstruction task, not a lost cause — sections 3-5 below cover the recovery path for each.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md:31 | 7 | One paragraph packs the three write surfaces and then a separate no-CLI-authoring rule. | replace line 31 with:
    ```markdown
    The write layer this method operates against has three surfaces:

    - **notesmd-cli** — headless filesystem operations, the default for unattended migration work.
    - **The cyanheads MCP** — app-backed, an accelerator when a live Obsidian session with Local REST API is available.
    - **Direct file-layer edits** — on `.base` files, plugin `_database.md` schemas, and `data.json` configs.

    No CLI or MCP tool authors a `.base` file or a Dataview query block — both are pure file-layer writes the agent performs directly with Read/Write/Edit.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md:184-189 | 10 | §7's "Sibling references" table repeats §8's first two related-resource bullets, so a related-resources block sits before the last H2. | delete lines 184-189 and leave one blank line before the §8 divider; §8 lines 195-196 already carry both entries with the same descriptions.
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/notion-migration.md:198-199 | 2 | Two bare URLs (`render_bare_url`). | replace with: `- [Notion Bases community plugin](https://github.com/bgarciamoura/obsidian-notion-bases-plugin) — the P0 plugin behind sections 3-4's recovery matrix.` and `- [Obsidian Importer](https://github.com/obsidianmd/obsidian-importer) — the source of the auto-conversion behavior this method verifies and extends.`

### .skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md:25 | 4 | OVERVIEW opens with a description of `notesmd-cli`; no Purpose or When to Use, so the reference's job and its triggers are only implied by the intro. | insert before line 27:
    ```markdown
    ### Purpose

    Run the right vault command against the right profile, with the flags and failure behavior that profile actually has.

    ### When to Use

    - Choosing between `notesmd-cli` and the official `obsidian` CLI for a task.
    - Looking up a vault command, flag, or agent invariant before scripting one.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md:231-282 | 5 | `AGENT INVARIANTS (MUST FOLLOW)` sits after every command table it governs, including `delete`, `move`, and the `eval` escape hatch. | move lines 231-282 (the section plus its trailing divider) to before line 87; renumber old §4-§10 as §5-§11 and the moved section as §4; update `(§11)` at line 133 to `(§4)` and `(§8)` at lines 158 and 280 to `(§9)`.
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md:186 | 7 | The "When to prefer it" paragraph packs three decisions — app-only outcomes, file-shaped work, and CLI-vs-MCP overlap — into one block. | replace line 186 with:
    ```markdown
    **When to prefer it:**

    - **App-only outcomes** — the resolved link graph, the computed tag and task index, Bases, sync and file history, plugin and theme state, and the UI itself, none of which the MCP server exposes.
    - **File-shaped outcomes** — `notesmd-cli` is faster and needs no app.
    - **Overlap** — the CLI wins the default on prerequisites and coverage, and loses only on in-place section editing, tag writes and warm-batch latency.

    See [`cli-versus-mcp.md`](cli-versus-mcp.md).
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/obsidian-cli-commands.md:295,299,300 | 2 | Three bare URLs in GETTING HELP (`render_bare_url`). | replace with: `- [notesmd-cli repo](https://github.com/Yakitrak/obsidian-cli)`, `- [Obsidian CLI vendor reference](https://obsidian.md/help/cli)`, and `- [Obsidian help/docs](https://help.obsidian.md/)`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md

- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:38 | 5 | The preflight rule says to check *only the exit status*, but the command it introduces greps the printed version; §10 records every app-up invocation exiting 0, and `obsidian-cli-commands.md:184` says a starting app answers 0 with an error on stdout. | replace line 38 with: `Run one cheap command and test **its output**. The app-down failure is the one failure raised by the launcher rather than by the app, so this is also the one place `$?` carries information — but the status alone is not enough, because an app that is still starting can answer 0 with an error on stdout.`
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:22 | 4 | OVERVIEW opens on registration mechanics; no Purpose or When to Use, so the three properties arrive before the reader knows what the reference is for. | insert before line 24:
    ```markdown
    ### Purpose

    Make the app-backed CLI safe to script: prove it will answer, read its stdout instead of its exit status, and never let the human's open note become the target.

    ### When to Use

    - Scripting the official `obsidian` CLI against a running app.
    - Diagnosing a preflight failure or an exit-0 error.

    ### Registration
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:18 | 3 | The intro's second sentence points at the body ("Everything below follows from that one fact") instead of hooking the reader. | replace that sentence with: `An agent that scripts it like \`curl\` will misread its exit codes and write to the wrong note.`
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/official-cli-agent-usage.md:169 | 7 | One paragraph packs the default choice, the resource comparison, and the escalation condition. | replace line 169 with:
    ```markdown
    **Among the two app-backed surfaces, this CLI is the default.**

    - It needs only the running app, where the MCP server also needs the Local REST API plugin enabled, a bearer token and a Node process.
    - It exposes 106 commands against the server's 12, and it answers in about 38 ms per call with nothing to keep warm.
    - Escalate to the MCP server for the four things this CLI cannot do (patch a section in place, replace text inside a note, write tags as a YAML list, set a JSON-typed frontmatter value) or for a batch over roughly 20 calls, where a warm session costs about 3 ms per call.

    Measured comparison: [`cli-versus-mcp.md`](cli-versus-mcp.md).
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/data-model.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/data-model.md:24 | 4 | OVERVIEW opens with the Canonical identity table; no Purpose or When to Use, so identity precedes the outcome. | insert before line 26:
    ```markdown
    ### Purpose

    Read and write a Health.md data file against the exact schema, layer, and version the plugin expects.

    ### When to Use

    - Reading, validating, or repairing a Health.md data file.
    - Deciding which layer a new file belongs to.
    - Checking a schema version or settings default before a write.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/data-model.md:33 | 9 | The installed-version row carries the packet phase number. | replace `2.1.0 (all vaults, Phase 11)` with `2.1.0 (all vaults)`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md

- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md:21 | 2, 4 | OVERVIEW opens directly with the identity table (`render_overview_orientation`, line 21); no Purpose or When to Use. | insert before line 21:
    ```markdown
    ### Purpose

    Keep every chart trustworthy by treating the folder, the settings, and the files as the contract and the rendered image as an unproven claim.

    ### When to Use

    - Opening the Health.md file layer before trusting a chart.
    - Deciding which reference or data file a request touches.
    - Checking whether the rendered data is real or the bundled fallback.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md:19 | 1 | No `---` divider between the intro and `## 1. OVERVIEW`; the template requires one before every H2. | insert `---` and a blank line between lines 18 and 19.
- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md:19 | 8 | The file is titled "Health.md Plugin Index" and is the entry point for the plugin, but it links none of the three sibling references, so the contract, recipes, and diagnostics are unreachable from it. | insert after line 27 (the H2 numbering is frozen by the inbound references, so this stays an H3 inside §1):
    ```markdown
    ### Reference files

    - [data-model.md](data-model.md) — the full file-layer contract: data folder and settings, supported formats, the v8 daily envelope, v9 roll-ups, the dictionary, and the archives.
    - [workflows.md](workflows.md) — recipes for adding files, placing `health-viz` blocks, restructuring the folder, and proving a chart is real.
    - [troubleshooting.md](troubleshooting.md) — cause, detection, and recovery for empty charts, ignored files, schema drift, and platform gaps.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md:26 | 9 | The version row carries the packet phase number. | replace `Installed in all vaults (Phase 11); desktop and mobile supported` with `Installed in all vaults; desktop and mobile supported`.
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/health-md.md:50 | 9 | `Yes (Phase 11 done)` is a packet progress token in the enablement row. | replace `Yes (Phase 11 done)` with `Yes`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/troubleshooting.md

- [P1] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/troubleshooting.md:24 | 2, 4 | OVERVIEW opens directly with the symptom table (`render_overview_orientation`, line 24); no Purpose or When to Use. | insert before line 24:
    ```markdown
    ### Purpose

    Name the one cause behind a Health.md failure before changing a file or a setting.

    ### When to Use

    - A Health.md chart is empty, missing, or shows data the user did not export.
    - A data file is ignored, misread, or silently best-effort.
    - The cause could sit in the folder, pattern, format, schema, platform, or render block.
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/workflows.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/workflows.md:23 | 4 | OVERVIEW opens with the five-step operating sequence; no Purpose or When to Use, so the reader starts at step 1 without the outcome or the trigger. | insert before line 23:
    ```markdown
    ### Purpose

    Leave the vault with data files the plugin can actually read and a chart that is provably fed by them, without fabricating a single observation.

    ### When to Use

    - Setting up or restructuring the data folder.
    - Adding a real export, roll-up, or entry note.
    - Placing or checking a `health-viz` block.
    - Proving a chart is fed by authentic data.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/health-md/workflows.md:71-77 | 6 | The mock-fallback verification recipe sits after "Switch to a dated structure", so the reader is told to restructure before being told how to prove the chart is real. | move lines 71-77 to after line 63, before `### Switch to a dated structure`.

### .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/data-model.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/data-model.md:23 | 4 | OVERVIEW opens with the Canonical identity table; no Purpose or When to Use. | insert before line 23:
    ```markdown
    ### Purpose

    Edit Iconic's configuration without losing a setting, a rule id, or a user customization.

    ### When to Use

    - Reading or changing `<vault>/.obsidian/plugins/iconic/data.json`.
    - Adding or editing a `fileRules` or `folderRules` entry.
    - Merging the canonical rulebook asset into a vault.
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/plugins/iconic/data-model.md:112 | 6 | Step 5 of SAFE-MERGE DISCIPLINE is an installation rule, not a merge step; numbering it as step 5 makes downgrading look like part of the merge. | move line 112 out of the numbered list to a paragraph after line 111: `**Never downgrade** the plugin binary when installing (the rulebook is the only thing (re)applied).`

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

### .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/themes.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/themes/themes.md:24 | 4 | The overview opens on a definition and the surface table; it has no `### Purpose` or `### When to Use`, so the file never states the outcome it produces or the triggers that send a reader here. | Replace line 24 with:
    ```
    ### Purpose

    A theme is a **full restyle of Obsidian's appearance** shipped as a single `theme.css` plus a `manifest.json`. It is one of three extension surfaces.

    ### When to Use

    - Installing, activating, or managing a community theme.
    - Checking which theme is active from the file layer.
    - Distinguishing a theme from a snippet or a plugin.

    The three extension surfaces are distinct:
    ```

### .skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md

- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:24 | 4 | The overview opens directly on the six-category list; it has no `### Purpose` or `### When to Use`. | Insert before line 24, with a blank line after the last bullet:
    ```
    ### Purpose

    An Obsidian failure reaches the fix for the surface that produced it, whether that is the headless CLI, the official app-backed CLI, or the MCP server.

    ### When to Use

    - A `notesmd-cli` or `obsidian` command fails or is not found.
    - An MCP call returns 401, connection refused, or an npx launch error.
    - A search returns nothing and you need to confirm that is the real answer.
    - A task keeps failing because the app is not running.

    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:40 | 7 | The single MCP prerequisite bullet packs five independent requirements into one long line, so a reader cannot check them one at a time. | Replace line 40 with:
    ```
    - For MCP:
      - a **running Obsidian app**
      - the **Local REST API plugin v4.0.0+** enabled
      - a token
      - the `obsidian` manual registered in `.utcp_config.json`, launching `npx -y obsidian-mcp-server@latest` over stdio
      - `OBSIDIAN_API_KEY` / `OBSIDIAN_BASE_URL` / `OBSIDIAN_VERIFY_SSL` available to Code Mode
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:359 | 2 | The four bare URLs at 359-362 trip `render_bare_url`; the GETTING HELP list renders without link titles. | Replace lines 359-362 with:
    ```
    - `notesmd-cli` repo: [Yakitrak/obsidian-cli](https://github.com/Yakitrak/obsidian-cli)
    - cyanheads `obsidian-mcp-server`: [cyanheads/obsidian-mcp-server](https://github.com/cyanheads/obsidian-mcp-server)
    - Obsidian Local REST API plugin: [obsidian-local-rest-api](https://github.com/coddingtonbear/obsidian-local-rest-api)
    - Obsidian help/docs: [Obsidian Help](https://help.obsidian.md/)
    ```
- [P2] .skilled/skills/mcp-tooling/mcp-obsidian/references/troubleshooting.md:150 | 2, 10 | `render_h2_numbering` fires on `## 5b.` (line 150) and `## 5c.` (line 181); both carry letter suffixes instead of integers. | Keep lines 150 and 181 verbatim: the inbound-reference freeze forbids renumbering this file's H2s, and `changelog/v0.23.0.0.md:86` cites "§5b" and "Section 5c" by number, so renumbering would break both citations.

