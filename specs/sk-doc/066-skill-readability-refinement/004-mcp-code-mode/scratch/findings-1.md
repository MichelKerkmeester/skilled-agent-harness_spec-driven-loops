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