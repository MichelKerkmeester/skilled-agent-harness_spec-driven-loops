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
