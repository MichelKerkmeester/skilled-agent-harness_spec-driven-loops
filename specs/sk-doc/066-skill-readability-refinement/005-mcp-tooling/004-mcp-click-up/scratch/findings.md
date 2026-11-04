### .skilled/skills/mcp-tooling/mcp-click-up/README.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/README.md:122` | 7 | One sentence packs five command families, so the scan target is buried. | Replace line 122 with:
  ```
  cupt covers every daily task operation:

  - list, with server-side `--tag` filtering (fast) and client-side `--team` filtering (slow on large workspaces)
  - full task detail with `cupt show`
  - notes and comments with `cupt note` and `cupt notes`
  - a full time-tracking lifecycle with `cupt time start`, `stop`, `add` and `status`
  - tag management and task context discovery with `cupt context` and `cupt statuses`
  ```
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/README.md:130-147` | 5 | The trust rules that govern every `cupt done` and the session preflight sit after the cupt path they govern. | Move lines 130-147 (Agent Safety Invariants through the Preflight Check fence) to immediately before line 113.
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/README.md:138` | 7 | Six discrete safety rules share one paragraph. | Replace line 138 with:
  ```
  - Always use `--json` for programmatic reads.
  - Never hardcode status names across tasks.
  - Never use the community `@krodak/clickup-cli` (`cu` command), which conflicts with the Unix `cu` command and is not supported by this skill.
  - Never auto-modify `opencode.json`. Print the MCP config snippet for the user to apply.
  - Never fabricate tasks when `cupt list` returns empty. An empty queue is valid and common.
  ```
- [P1] `.skilled/skills/mcp-tooling/mcp-click-up/README.md:224` | 2 | The unescaped `|` inside the code span splits the row into four cells, so the table gains a phantom column and the command loses its code span. | Replace line 224 with:
  ```
  | cupt health | `cupt --version && cupt status && cupt list --today --json \| python3 -m json.tool` all pass with no errors |
  ```
- [P1] `.skilled/skills/mcp-tooling/mcp-click-up/README.md:230-242` | 8 | RELATED DOCUMENTS is the packet's document map but omits `scripts/doctor.sh`, `scripts/README.md` and both `mcp-servers/*/README.md` files that SKILL.md points to. | Add after line 242:
  ```
  | [`scripts/doctor.sh`](./scripts/doctor.sh) | Read-only diagnostics for the local environment and the registered ClickUp manual |
  | [`scripts/README.md`](./scripts/README.md) | What each script changes and the output it prints |
  | [`mcp-servers/clickup-mcp/README.md`](./mcp-servers/clickup-mcp/README.md) | Configuration notes for the hosted official server, reached through `mcp-remote` by the `clickup_official` manual |
  | [`mcp-servers/clickup-cli/README.md`](./mcp-servers/clickup-cli/README.md) | Install and verification notes for the `cupt` CLI |
  ```

### .skilled/skills/mcp-tooling/mcp-click-up/ROUTER.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/ROUTER.md:23` | 7 | One sentence carries the four resource families and their conditions. | Replace line 23 with:
  ```
  Requests reach this skill when they name `clickup` or `cupt` with a task action such as list, show, done, note, time, tag or context, when they mention a work queue, time tracking, a ClickUp document, a workspace search, an install or auth question, or a ClickUp failure. It routes to four resource families:

  - `references/cupt-commands.md` for the CLI's daily operations
  - `references/mcp-tools.md` for the hosted MCP's task, document, search, list, relation, chat and reminder tools
  - `INSTALL-GUIDE.md` with `references/troubleshooting.md` for setup and auth
  - `references/troubleshooting.md` alone for a failure report
  ```
- [P1] `.skilled/skills/mcp-tooling/mcp-click-up/ROUTER.md:35` | 1 | INTENT MODEL says INSTALL outranks every other intent, but the machine block checks `TROUBLESHOOT > 3` first, so TROUBLESHOOT wins when both fire; the prose and machine block are out of sync. | In line 35, replace `and a score above 4 selects it ahead of every other intent` with `and a score above 4 selects it, unless `TROUBLESHOOT` also scores above 3, which the machine router checks first`.

### .skilled/skills/mcp-tooling/mcp-click-up/SKILL.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md:14` | 10 | Unnumbered H2 among numbered peers (`render_h2_numbering`). | Change the heading to `## 0. MARKDOWN FORMATTING CONTRACT — READ BEFORE ANY CLICKUP WRITE`; the `0.` preamble keeps every existing section number, including SMART ROUTING as Section 2.
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md:170-181` | 5 | The transport choice and the skip gate sit after the prerequisites, configuration and invocation they govern. | Move lines 170-181 (When to prefer MCP and Limitations) to immediately after line 129.
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md:294-296` | 2 | The same file is listed twice with different descriptions, and `the phase-validation reference above` implies a second guide that does not exist. | Replace lines 294-296 with:
  ```
  - [INSTALL-GUIDE.md](INSTALL-GUIDE.md): the condensed top-level install front door at the packet root, with step-by-step install and validation checkpoints, and the router's INSTALL-intent target
  ```
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/SKILL.md:315-317` | 2 | Three `render_bare_url` warnings. | Replace lines 315-317 with:
  ```
  - [cupt repository](https://github.com/newz2000/cupt)
  - [Official ClickUp MCP setup docs](https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server-1)
  - [ClickUp API tokens](https://app.clickup.com/settings/apps)
  ```

### .skilled/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md:22-30` | 4 | The overview has no Purpose label and no When to Use content, so a reader cannot tell from the opening when to open the reference. | Replace lines 22-26 with:
  ```
  ## 1. OVERVIEW

  ### Purpose

  cupt provides a terminal interface to ClickUp designed for agent-driven workflows. Every read command supports `--json` for machine-readable output. Completion uses automatic per-list status resolution so agents never need to hardcode status names. The `--offline` flag uses a local cache populated by `cupt prefetch`, enabling operation without network access.

  ### When to Use

  - You need a daily ClickUp task operation from the terminal.
  - You need machine-readable output for an agent.
  - You need a completion that resolves the per-list closed status.
  - You need to keep working without network access.

  **Key agent advantages over direct API calls:**
  ```
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/references/cupt-commands.md:126-129` | 6 | The creation command `cupt add` is filed under TASK DETAILS, so a reader scanning for task creation has no section to find it in. | Rename line 117 to `## 6. TASK DETAILS AND CREATION`; the section number is unchanged and no inbound reference targets it.

### .skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:20-22` | 2 | Three consecutive bold labels join into one paragraph (two `render_bold_label_join` warnings). | Replace lines 20-22 with the same text as three bullets:
  ```
  - **MCP server:** `clickup_official`, ClickUp's hosted server at `https://mcp.clickup.com/mcp`. The manual in `.utcp_config.json` reaches it over stdio with `npx -y mcp-remote https://mcp.clickup.com/mcp`. The npm package `@clickup/mcp-server` returned 404 on 2026-07-10 and again on 2026-10-08, so the hosted route replaces it.
  - **Auth:** OAuth 2.1 with PKCE. The first launch opens one browser approval, and the manual reads no API key.
  - **Tool naming:** Code Mode names each tool `clickup_official.clickup_official_<server tool name>`. Every server tool name already starts with `clickup_`, so the full name repeats it: `clickup_official.clickup_official_clickup_create_task`. A name without the inner `clickup_`, such as `clickup_official.clickup_official_create_task`, does not exist.
  ```
- [P1] `.skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:151` | 2 | The `What it does` cell is cut off mid-word at `to a task; fo`, so the rendered description is incomplete. | In line 151, replace `to a task; fo` with `to a task`.
- [P1] `.skilled/skills/mcp-tooling/mcp-click-up/references/mcp-tools.md:195` | 2 | The `What it does` cell is cut off mid-word at `request/response body s`. | In line 195, replace `request/response body s` with `request/response body`.

### .skilled/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md

- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md:22-24` | 4 | The overview runs purpose, a procedure and four failure categories together, with no Purpose and When to Use split. | Replace lines 22-24 with:
  ```
  ## 1. OVERVIEW

  ### Purpose

  Diagnostic reference for cupt CLI and official ClickUp MCP errors.

  ### When to Use

  Start with the Quick Diagnostics sequence (§3) before diving into specific issues. Most failures fall into four categories:

  - installation (cupt not found)
  - authentication (401/no credentials)
  - status resolution (wrong status on completion)
  - MCP connection (manual misconfigured, credentials unavailable, stdio launch failure, or wrong tool name)
  ```
- [P2] `.skilled/skills/mcp-tooling/mcp-click-up/references/troubleshooting.md:327-330` | 2 | Four `render_bare_url` warnings. | Replace lines 327-330 with:
  ```
  - [cupt documentation](https://github.com/newz2000/cupt)
  - [ClickUp API docs](https://clickup.com/api/)
  - [Official MCP setup docs](https://developer.clickup.com/docs/connect-an-ai-assistant-to-clickups-mcp-server)
  - [Report cupt bugs](https://github.com/newz2000/cupt/issues)
  ```

