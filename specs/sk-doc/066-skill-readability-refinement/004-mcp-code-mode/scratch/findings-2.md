### .skilled/skills/mcp-code-mode/references/tool-catalog.md

- [P1] .skilled/skills/mcp-code-mode/references/tool-catalog.md:43 | 8 | The catalog says there are ten manuals, lists nine rows, and omits four names present in `.utcp_config.json`: `magnific`, `notion`, `obsidian`, and `webflow`. | Replace “ten” with “thirteen” and add those four names to the table.
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:15 | 3 | There is no hook after the H1. | Insert after line 15: `Open this reference when a Code Mode task needs the live callable tools for a configured manual.` Add a blank line, `---`, and a blank line before the overview.
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:19 | 4 | The overview lacks the required Purpose and When to Use headings. | Replace line 19 with:
  ```markdown
  ### Purpose
  
  This reference lists the MCP manuals configured for Code Mode and explains how to discover callable tools and schemas in the live session.
  
  ### When to Use
  
  - When you need the configured manual list for a Code Mode task.
  - When a workflow needs a configured manual's live callable names or schemas.
  
  ### Core Principle
  
  Code Mode does not maintain a hand-counted static tool inventory. The configured manual names below are the current wiring surface; callable names and schemas must be discovered from the live session.
  ```
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:37 | 5 | The exact-name and live-schema requirements follow the discovery steps they govern. | Move line 37 to immediately after line 23, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:57 | 5 | The caveat qualifies the manual table but appears after it. | Move line 57 to immediately after line 41, before the count sentence and table.
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:57 | 7 | The paragraph combines the manual/tool distinction, availability conditions, and source authority. | Reformat it as: `- This table names manuals, not tools.\n- A manual may be disabled, unauthenticated, or changed between sessions.\n- Discovery is authoritative for the callable inventory.`
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:76 | 5 | The rule against inferring tools and the stop condition follow the example they govern. | Move line 76 to immediately after line 61, before the example.
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:82 | 7 | The paragraph packs three separate authority assignments into one sentence. | Reformat it as: `- The configured manual list is sourced from \`.utcp_config.json\`.\n- The generated Code Mode \`leaf-manifest.json\` owns which catalog and workflow resources are routable.\n- The live MCP session owns tool names, schemas, authentication state, and availability.`
- [P2] .skilled/skills/mcp-code-mode/references/tool-catalog.md:89 | 5 | The limitation on the manifest-check command appears after the command it governs. | Move line 89 to immediately after line 82, before the code block.

### .skilled/skills/mcp-code-mode/references/workflows.md

- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:15 | 3 | There is no hook after the H1. | Insert after line 15: `Open this reference when a tool result may affect the next call or the success report.` Add a blank line, `---`, and a blank line before the overview.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:19 | 4 | The overview lacks the required Purpose and When to Use headings. | Replace line 19 with:
  ```markdown
  ### Purpose
  
  This reference provides discovery-first patterns for MCP calls, validation, error handling, and state persistence.
  
  ### When to Use
  
  - When a tool result may affect the next call or the success report.
  - When planning dependent calls, parallel reads, partial-success handling, or timeouts.
  
  ### Core Principle
  
  The configured manuals are fixed in `.utcp_config.json`; callable tools are not. Every workflow therefore discovers the manual and tool schema before calling it.
  ```
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:42 | 5 | The instruction to replace placeholder arguments using the returned schema follows the example it governs. | Move line 42 to immediately after line 23, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:56 | 5 | The rule for interpreting a zero-result enumeration follows the enumeration steps it governs. | Move line 56 to immediately after line 46, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:81 | 5 | The instruction to reconfirm the documented Mobbin tools in a fresh session follows the example. | Move line 81 to immediately after line 60, before the example description and code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:103 | 5 | The dependent-call and result-inspection guidance follows the sequence it governs. | Move line 103 to immediately after line 85, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:118 | 5 | The parallel-execution constraints follow the example they govern. | Move line 118 to immediately after line 107, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:136 | 5 | The partial-success reporting guidance follows the example it governs. | Move line 136 to immediately after line 122, before the code block.
- [P2] .skilled/skills/mcp-code-mode/references/workflows.md:142 | 7 | The paragraph combines separate guidance for intermediate data, timeouts, and result size. | Reformat it as: `- Keep intermediate data in local variables inside one \`call_tool_chain\` execution.\n- Use a timeout appropriate to the number and size of calls.\n- Return a bounded summary rather than dumping large tool responses into logs.`