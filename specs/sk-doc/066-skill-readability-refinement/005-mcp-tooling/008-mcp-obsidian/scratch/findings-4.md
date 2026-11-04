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
