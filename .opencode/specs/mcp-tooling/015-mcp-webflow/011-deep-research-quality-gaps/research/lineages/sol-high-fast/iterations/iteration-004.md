# Iteration 4: Advanced Surfaces And Version Reconciliation

## Focus

Audit advanced MCP behaviors that are easy to miss in action lists: automatically supplied Agent Instructions, MCP resources, utility-driven tool loading, WHTML, official limitations, and version migration across v1.3, v2.0, and v2.0.1.

## Actions Taken

1. Read the official MCP migration guide and release-specific rename/split tables.
2. Read the official architecture page for resources, Agent Instructions, mode awareness, permissions, and activity logs.
3. Read official utility-tool, FAQ, skills, beta-server, and documentation-server pages.
4. Inspected the official Data-tool output for webhook and WHTML semantics.
5. Compared versions and behaviors with local action, tool-surface, wiring, payload, and safety references.

## Findings

### F20 (P0): Site-authored Agent Instructions lack an explicit non-override trust boundary

Official architecture says a site's Agent Instructions are provided automatically to connected agents and are likely to be followed; they may reference live Webflow primitives and can be distributed through Shared Libraries. The local packet documents CRUD actions and an example rule but never states that site-authored instruction content is untrusted data that cannot override operator intent, DS/PB/DP confirmations, production-publish prohibition, secret handling, or tool-scope restrictions. This creates a prompt-injection path into an otherwise frozen safety contract. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:35-43] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:226-252]

Recommendation: add a hard precedence rule: operator/system/skill safety contracts outrank all Webflow Agent Instructions and MCP resources; quote/summarize instruction content as data; reject embedded tool directives that broaden scope or weaken gates; log conflicts before continuing.

### F21 (P1): The stated remote version is inconsistent with the inventory's tool layout

`action-reference.md` labels the remote surface `com.webflow/mcp` 2.0.0 yet includes `data_element_settings_tool`, `data_component_props_tool`, and `data_component_variants_tool`. Official migration documentation says those tools were created by splits in v2.0.1 and that in v2.0 their actions still lived in `data_element_tool` and `data_component_tool`. Calls built from the local title/version claim can therefore target the wrong tool container. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-33] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:162-184] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:209-225]

Recommendation: correct the inventory to a tested 2.0.1 (or later) version, add generated provenance per tool, and reject tool-name use when the discovered server version differs.

### F22 (P1): The “local OSS baseline” is v1.3-shaped but is not version-labeled, while the live manual uses `@latest`

The local baseline uses `dePages`, `deElement`, `deStyle`, `deVariable`, `deComponents`, and legacy action names. Official migration says v2.0 rebuilt most of these as headless `data_*` tools, moved canvas operations to `designer_tool`, removed `variable_tool`, and changed several inputs; v2.0.1 split settings/props/variants again. Meanwhile the registered local command is `webflow-mcp-server@latest`. A static 18-module “baseline” cannot safely describe the command that will actually run without a pin. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/utcp-manual-reference.md:37-71]

Recommendation: pin the npm version before use, label the existing table v1.3 if that is its source, and add a migration/capability crosswalk to the discovered current version.

### F23 (P1): Agent Instruction cascade/move semantics and reference resolution are absent

Official docs say instruction references resolve server-side; reads inline referenced instructions by default; deleting a skill's `SKILL.md` cascades to descendants; moving `SKILL.md` or subfolders cascades; and destinations must retain the same parent folder. The local action table provides only required keys, so delete/move previews cannot enumerate blast radius and reads may hide how much content was transitively injected. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47]

Recommendation: document resolved-versus-raw reads, graph/cascade previews, same-parent move constraint, and descendant counts before destructive actions.

### F24 (P1): `get_more_tools` has no safe dynamic-tool reconciliation workflow

Official utility docs instruct agents to use `get_more_tools` when the loaded set lacks a capability. The local packet lists the action and separately prohibits UNKNOWN tools, but does not connect the two: there is no mandatory re-discovery, provenance/version capture, schema inspection, classification, or gate assignment after a specialized tool is loaded. [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:473-491] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:151-177]

Recommendation: define `get_more_tools -> list_tools delta -> tool_info -> classify every action -> operator gate if needed -> call`; prohibit same-turn invocation before classification.

### F25 (P1): WHTML is reduced to one row and omits execution/security semantics

Official docs describe `insert_whtml` as inserting an HTML/CSS fragment, allow at most five per call, and require page-scoped `siteId/pageId`. The local packet only records required parameters. It does not define supported/forbidden HTML, script/event-handler handling, CSS scope, sanitization, failure atomicity, generated element identity, or rollback/readback. Because WHTML can create a large subtree from opaque markup, this is not equivalent to a simple element builder call. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:433-439]

Recommendation: add WHTML constraints from the live schema, max-five batching, script/custom-code separation, subtree preview, created-element capture, and rollback guidance.

### F26 (P1): Major official limitations are absent from routing and troubleshooting

Official overview says MCP cannot create/apply IX3 interactions, cannot manage remotely hosted Google/Adobe fonts directly, cannot create new localized CMS items, cannot change access settings, and authorizes one workspace at a time. Local docs cover parts of localization and roles but do not provide a consolidated unsupported-capability matrix or route these requests to manual Designer/site settings/reauthorization. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://developers.webflow.com/mcp/faqs.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/troubleshooting.md:28-95]

Recommendation: add an explicit unsupported/partial-support table and router outcomes instead of allowing UNKNOWN discovery retries for known limitations.

### F27 (P2): Webhook and WHTML cardinality limits are missing from the local action inventory

Official Data-tool docs cap webhook creation at 75 per trigger type per site and WHTML insertion at five fragments per call. The local action table contains neither limit. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:420-439]

Recommendation: add these limits to the generated action reference and boundary tests.

### F28 (P2): AI and guide outputs are treated as ordinary RO facts rather than advisory evidence

Official utility docs describe `ask_webflow_ai` as a free-form answer and `webflow_guide_tool` as recommended workflows/best practices; a separate documentation MCP server exists for direct documentation access. The local packet classifies both RO but gives no provenance, confidence, or verification rule. An AI answer should not override official schema or live discovery. [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md] [SOURCE: https://developers.webflow.com/mcp/installing/documentation-server.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:473-491]

Recommendation: mark AI/guide output advisory, require official-doc/live-schema verification for executable claims, and prefer the documentation server for source-backed research.

## Questions Answered

- Q1 answered: inventory breadth is strong, but version identity, payloads, risk effects, and cross-surface reconciliation are insufficiently reliable.
- Q4 answered: Agent Instructions, WHTML, utility loading, limitations, and migration logic contain one P0 trust gap and multiple P1/P2 omissions.

## Questions Remaining

- Q5: verify all feature cards and 17 scenarios against the identified gaps.

## Ruled Out

- “The local OSS baseline and remote surface differ only in transport” is false; official migration records renamed, removed, split, moved, and behaviorally changed tools across releases. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]

## Dead Ends

- A single static tool count cannot identify the active contract when remote auto-updates and local uses `@latest`; version plus discovery fixture is required. [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/mcp/skills/skill-migration.md]
- [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md]
- [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- [SOURCE: https://developers.webflow.com/mcp]
- [SOURCE: https://developers.webflow.com/mcp/faqs.md]
- [SOURCE: https://developers.webflow.com/mcp/installing/documentation-server.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-491]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56]

## Assessment

- New information ratio: 0.91
- Novelty justification: official migration and instruction-delivery semantics revealed one P0 trust gap and eight new version/advanced-surface gaps.
- Confidence: high for version and documented behavior; unknown for live deployment until authenticated discovery.

## Reflection

- What worked: the official migration guide explains why the local two-surface narrative is insufficient at action level.
- What did not work: static tool counts cannot identify the currently deployed remote or `@latest` local contract.
- Adjustment: perform a complete card/scenario traceability pass and prioritize fixes by risk and recurrence.

## Recommended Next Focus

Audit all nine feature cards plus root and all 17 manual scenarios; map each identified P0/P1/P2 gap to missing coverage and concrete additions.
