VERDICT: FIX

- [P2] .skilled/skills/mcp-code-mode/README.md:126 | 7 | The auxiliary-tool list still combines `register_manual` and `deregister_manual` in one item. | Replace lines 126–127 with:
  ```markdown
  - `register_manual` adds an MCP server at runtime without a restart.
  - `deregister_manual` removes one.
  - `get_required_keys_for_tool` reports the prefixed environment variable keys a tool needs before you call it.
  ```

- [P1] .skilled/skills/mcp-code-mode/SKILL.md:136 | 2 | The second list item changes the original label text, despite the finding requiring exact wording. | Replace with: `- **They show only Code Mode manuals — never a natively registered MCP server**`

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:193 | 2 | The heading capitalization differs from the finding’s specified replacement. | Replace with: `## 4. CRITICAL: Variable Naming Convention`