### .skilled/skills/mcp-tooling/mcp-figma/README.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/README.md:107 | 7 | The Connect Modes And The Daemon paragraph packs both connect modes and their risk difference into one sentence chain, so the safe/yolo split cannot be scanned. | Replace line 107 with:
  ```markdown
  Connecting has two modes and a sharp difference in risk.

  - **Safe mode (default):** `figma-ds-cli connect --safe` runs the FigCli plugin bridge and patches nothing. Import `plugin/manifest.json` once, then keep `Plugins > Development > FigCli` open each session.
  - **Yolo mode (gated):** `figma-ds-cli connect` with no `--safe` patches Figma Desktop's `app.asar`, codesigns on macOS and restarts Figma with a CDP debug port on 9222. It may need Full Disk Access or admin rights, and it breaks when Figma updates. The skill never runs it without explicit consent and a stated rollback, which is `figma-ds-cli unpatch`.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-figma/README.md:113 | 7 | The Command Safety Model packs all four command classes and their gates into one 250-word paragraph. | Replace line 113 with:
  ```markdown
  The CLI's verbs fall into classes. The gate depends on the class.

  - **Read-only** verbs are the safe default: `status`, `get`, `find`, `inspect`, the `var list` and `var find` queries, `extract`, every `export` form, the analyze and a11y audits plus dry-run variants. None of them change the Figma document, though the local exports do write files, so they still demand an explicit output path and never a silent overwrite.
  - **Mutating** verbs change the open file and are gated behind confirmation: every `create`, `render` and token or variable verb, the bind and set families, layout verbs, variant generation, imports and the app-level `connect`, `unpatch` and `config set`.
  - **Destructive** verbs are gated more strictly, requiring explicit confirmation, an explicit target node or file, a command preview and a one-line rollback. The destructive set is `var delete-all`, `var delete-batch`, `delete` and `remove`, `node delete`, `undo`, `unwrap`, `fj delete`, `plugins uninstall`, `dev unlink`, `component prop delete`, `grid clear` and `annotate clear`.
  - **Arbitrary** verbs are `eval`, `raw` and `run`, which execute arbitrary instructions, so the skill treats them as mutating and reviews the code or command before running it, even when the prompt sounds exploratory.
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-figma/README.md:197 | 8 | The Related Documents index stops at the four references and omits the two assets, the examples guide, the feature catalog, the playbook, the install script and scripts guide, and the two mcp-server docs, so a reader cannot reach them from the README. | Insert after line 203, before the Skills Library row:
  ```markdown
  | [`assets/utcp-figma-manual.md`](./assets/utcp-figma-manual.md) | Paste-ready Framelink `figma` `.utcp_config.json` manual entry and the matching `.env` note for the optional Code Mode path |
  | [`assets/env-template.md`](./assets/env-template.md) | The single prefixed `figma_FIGMA_API_KEY` `.env` line for the optional Figma MCP token |
  | [`examples/README.md`](./examples/README.md) | Safe worked walkthroughs: safe connect and daemon health, read-only inspect/export and the optional MCP context pull |
  | [`feature-catalog/feature-catalog.md`](./feature-catalog/feature-catalog.md) | Capability inventory for every `figma-ds-cli` command group, tagged read-only, mutating or destructive |
  | [`manual-testing-playbook/manual-testing-playbook.md`](./manual-testing-playbook/manual-testing-playbook.md) | Operator validation scenarios across detection, daemon health, read-only access, the safety gate and routing |
  | [`scripts/install.sh`](./scripts/install.sh) | Installs and verifies `figma-ds-cli`, preferring the silships repo when the npm build is stale |
  | [`scripts/README.md`](./scripts/README.md) | What each setup, connect, daemon and diagnostic script changes and the output it prints |
  | [`mcp-servers/figma-cli/README.md`](./mcp-servers/figma-cli/README.md) | Install and verification notes for the `figma-ds-cli` binary the skill drives |
  | [`mcp-servers/figma-mcp/README.md`](./mcp-servers/figma-mcp/README.md) | Configuration notes for the optional Framelink Figma MCP through Code Mode |
  ```
- [P2] .skilled/skills/mcp-tooling/mcp-figma/README.md:204 | 1 | The Skills Library row names its path as plain text instead of a relative markdown link, unlike every other row and the README template's link rule. | Replace line 204 with `| [Skills Library](../../README.txt) | The skill catalog and routing front door |`

### .skilled/skills/mcp-tooling/mcp-figma/ROUTER.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/ROUTER.md:23 | 7 | The overview packs the five resource families the router selects from into one prose sentence, so the selection set cannot be scanned. | Replace line 23 with:
  ```markdown
  A request that names `figma`, `figma-ds-cli`, Figma Desktop, rendering in Figma, tokens and variables, an extract to DESIGN.md, an export, a connect or a daemon reaches mcp-figma. This router picks from these resource families rather than from the whole folder:

  - `references/figma-cli-reference.md` for the CLI command reference
  - `references/tool-surface.md` for the command-gating taxonomy
  - `references/mcp-wiring.md` for the optional MCP wiring
  - `references/troubleshooting.md` for the troubleshooting reference
  - `assets/utcp-figma-manual.md` and `assets/env-template.md` for the paste-ready MCP assets

  Design context pulled through an opt-in Figma MCP loads the wiring doc and the paste-ready assets on top of the CLI baseline, so the MCP path never replaces the transport every other route reads. A request whose keywords barely score loads nothing and asks a disambiguation checklist instead of guessing.
  ```

### .skilled/skills/mcp-tooling/mcp-figma/SKILL.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/SKILL.md:114 | 5 | The discover-first trust rule sits in line 115, after the call naming on line 114 that it governs, so a reader can take the call form without the discovery gate. | Move the sentence `Before invoking a tool, discover it with \`search_tools()\` or \`tool_info()\`.` from line 115 to the start of line 114, leaving line 115 as `Find the full details and snippet in [\`references/mcp-wiring.md\`](references/mcp-wiring.md).`

### .skilled/skills/mcp-tooling/mcp-figma/assets/env-template.md

- clean

### .skilled/skills/mcp-tooling/mcp-figma/assets/utcp-figma-manual.md

- clean

### .skilled/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md:23 | 4 | The overview opens with Core Principle and puts When to Use second; the reference template orders Purpose, When to Use, Core Principle, and this file has no Purpose at all. | Insert after line 21:
  ```markdown
  ### Purpose

  This reference gives a reader the binary identity, connect mode, daemon transport and command class for a `figma-ds-cli` command before that command runs.
  ```
  Then move lines 26-28 (the `### When to Use` heading and its two bullets) to before line 23.
- [P1] .skilled/skills/mcp-tooling/mcp-figma/references/figma-cli-reference.md:36 | 9 | The body asserts "This skill is version 1.0.0.0", which contradicts SKILL.md's 1.2.0.0 frontmatter and puts packet version state in prose where it goes stale. | Replace line 36 with `This skill installs figma-ds-cli through the embedded \`mcp-servers/figma-cli\` scaffold rather than source-vendoring it.`

### .skilled/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/mcp-wiring.md:23 | 4 | The overview opens with Core Principle and puts When to Use second; the reference template orders Purpose, When to Use, Core Principle, and this file has no Purpose at all. | Insert after line 21:
  ```markdown
  ### Purpose

  This reference lets a reader point the optional Figma MCP at Code Mode, confirm the registered `figma` manual and call a discovered tool without guessing its name.
  ```
  Then move lines 27-30 (the `### When to Use` heading and its two bullets) to before line 23.

### .skilled/skills/mcp-tooling/mcp-figma/references/tool-surface.md

- [P2] .skilled/skills/mcp-tooling/mcp-figma/references/tool-surface.md:23 | 4 | The overview opens with Core Principle and puts When to Use second; the reference template orders Purpose, When to Use, Core Principle, and this file has no Purpose at all. | Insert after line 21:
  ```markdown
  ### Purpose

  This reference lets a reader classify any `figma-ds-cli` command and apply the matching gate before it runs.
  ```
  Then move lines 27-31 (the `### When to Use` heading and its three bullets) to before line 23.
