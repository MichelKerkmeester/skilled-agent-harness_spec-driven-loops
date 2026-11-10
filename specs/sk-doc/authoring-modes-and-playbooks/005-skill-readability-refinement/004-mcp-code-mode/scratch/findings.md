### .skilled/skills/mcp-code-mode/README.md

- [P2] .skilled/skills/mcp-code-mode/README.md:15 | 3 | The hook repeats the Purpose claim that tools run through one TypeScript execution with on-demand schemas. | Replace it with: `> Use this README to decide whether Code Mode fits an external MCP request.`

- [P2] .skilled/skills/mcp-code-mode/README.md:32 | 4 | The overview covers Purpose, but When to Use appears later in Section 5. | Rename `Why This Skill Exists` to `Purpose`, then move `When To Use This Skill` and its paragraphs from lines 141–145 to the overview after the Purpose content under `### When to Use`.

- [P2] .skilled/skills/mcp-code-mode/README.md:113 | 7 | One paragraph packs descriptions of four core tools, followed by three auxiliary tools in another paragraph. | Format each tool description as a separate list item, preserving the existing wording.


### .skilled/skills/mcp-code-mode/ROUTER.md

- [P2] .skilled/skills/mcp-code-mode/ROUTER.md:23 | 4 | The overview presents When to Use material before the router’s purpose. | Move lines 25–27 above line 23 under `### Purpose`; place the existing request-trigger material under `### When to Use`.

- [P2] .skilled/skills/mcp-code-mode/ROUTER.md:23 | 7 | One paragraph combines activation signals, native-tool exclusions, fallback behavior and resource families. | Split the existing clauses into separate lists for triggers, exclusions and fallback, and resource families; preserve their wording.


### .skilled/skills/mcp-code-mode/SKILL.md

- [P1] .skilled/skills/mcp-code-mode/SKILL.md:133 | 2 | The consecutive bold labels render as one paragraph. | Format the statements at lines 132–133 as separate list items, keeping their exact text.

- [P2] .skilled/skills/mcp-code-mode/SKILL.md:50 | 1 | SMART ROUTING has 5 nonblank lines; the skill template calls for 8–12. | Reflow the existing prose into 8–12 nonblank lines without adding or dropping claims.


### .skilled/skills/mcp-code-mode/assets/config-template.md

- [P1] .skilled/skills/mcp-code-mode/assets/config-template.md:238 | 2 | Consecutive bold metadata labels render as joined paragraphs. The same issue occurs at lines 263–265, 288–290, 313–315, 336–339 and 456–458. | Format each consecutive metadata group as one list item per label, preserving the existing text.

- [P2] .skilled/skills/mcp-code-mode/assets/config-template.md:17 | 3 | The intro repeats the Purpose in the overview. | Replace it with: `Open this asset when adding or changing entries in \`manual_call_templates\`.`

- [P2] .skilled/skills/mcp-code-mode/assets/config-template.md:27 | 4 | The overview has Purpose and Usage but no When to Use subsection. | Add `### When to Use` after Purpose with: `Use this template when creating or updating the project-root \`.utcp_config.json\`.` Keep Usage after it.

- [P2] .skilled/skills/mcp-code-mode/assets/config-template.md:457 | 9 | `Last Updated` is authoring history in the document body. | Remove the `Last Updated` line.


### .skilled/skills/mcp-code-mode/assets/env-template.md

- [P1] .skilled/skills/mcp-code-mode/assets/env-template.md:483 | 2 | Consecutive bold metadata labels render as joined paragraphs. | Format the lines 482–484 metadata as one list item per label, preserving the existing text.

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:17 | 3 | The intro repeats the Purpose in the overview. | Replace it with: `Open this asset when creating or updating the project-root \`.env\` file for Code Mode.`

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:27 | 4 | The overview has Purpose and Usage but no When to Use subsection. | Add `### When to Use` after Purpose with: `Use this template when creating the project-root \`.env\` for Code Mode.` Keep Usage after it.

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:122 | 2 | The bare URL is not a clickable Markdown link. | Replace it with `[Notion integrations](https://www.notion.so/my-integrations)`.

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:189 | 2 | This unnumbered H2 sits among numbered H2s. | Change it to `## 4. CRITICAL: Variable Naming Convention` and renumber the existing H2s 4–9 as 5–10, preserving their order.

- [P2] .skilled/skills/mcp-code-mode/assets/env-template.md:483 | 9 | `Last Updated` is authoring history in the document body. | Remove the `Last Updated` line.


### .skilled/skills/mcp-code-mode/references/architecture.md

- [P1] .skilled/skills/mcp-code-mode/references/architecture.md:468 | 2 | Consecutive Before/After/Savings labels render as joined paragraphs. The same issue occurs at lines 473–475, 479–481, 485–487 and 491–493. | Format each comparison group as one list item per label, preserving the existing text.

- [P2] .skilled/skills/mcp-code-mode/references/architecture.md:23 | 4 | The overview defines Code Mode but lacks Purpose and When to Use subsections. | Rename `What is Code Mode UTCP?` to `Purpose`, keep its definition, then add `### When to Use` with: `Use this reference when comparing token costs or tracing a call through the V8 isolate.` Place the existing Key innovation statement after those subsections.


### .skilled/skills/mcp-code-mode/references/configuration.md

- [P2] .skilled/skills/mcp-code-mode/references/configuration.md:23 | 4 | The overview starts with Required Files and lacks Purpose and When to Use subsections. | Add `### Purpose` and `### When to Use` before Required Files. Use: `This guide shows how Code Mode uses server definitions and credentials from \`.utcp_config.json\` and \`.env\`.` and `Use it when setting up or changing either file.` Keep the existing Required Files content after them.


### .skilled/skills/mcp-code-mode/references/naming-convention.md

- [P2] .skilled/skills/mcp-code-mode/references/naming-convention.md:23 | 4 | The overview starts with Core Pattern and lacks Purpose and When to Use subsections. | Add `### Purpose` and `### When to Use` before Core Pattern with: `This reference defines how a manual name and tool name form a callable Code Mode name.` and `Use it when deriving a tool call or diagnosing a naming error.` Preserve the existing H2 order and numbers.
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
