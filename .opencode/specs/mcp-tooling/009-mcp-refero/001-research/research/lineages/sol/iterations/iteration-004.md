# Iteration 4: downstream transport architecture and judgment boundary

## Focus

Map the confirmed Refero surface onto this repository's existing hub, Code Mode, and design-judgment contracts so an implementation pass can author `mcp-refero` without inventing a second execution substrate or letting reference retrieval become taste authority.

## Actions Taken

1. Read the `mcp-tooling` hub, mode registry, router, and graph metadata to identify the canonical transport-axis shape.
2. Read the sibling `mcp-figma` packet for transport permissions, cross-hub judgment pairing, discovery proof, and escalation conventions.
3. Read `mcp-code-mode` for configuration boundaries, progressive discovery, exact call naming, error structure, and timeout rules.
4. Read `sk-design` manager intake, registry routing, Brand/Product register, visible-plan, transport-proof, and acceptance gates.
5. Converted those contracts and the eight confirmed Refero tools into a downstream packet blueprint and verification matrix.

## Findings

- F-023: `mcp-refero` should be a fourth `mcp-tooling` mode with `workflowMode:"mcp-refero"`, `packetKind:"transport"`, a distinct backend such as `refero-code-mode-transport`, `routingClass:"metadata"`, `command:null`, `mutatesWorkspace:false`, and a `transport-axis.crossHubPairing` entry to `sk-design`. It is not a new hub and `mcp-code-mode` remains external infrastructure. [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json] [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- F-024: The minimal packet tool surface is `Read`, `Glob`, `Grep`, and the four Code Mode capabilities `mcp__code_mode__search_tools`, `mcp__code_mode__list_tools`, `mcp__code_mode__tool_info`, and `mcp__code_mode__call_tool_chain`; forbid `Write`, `Edit`, `Bash`, and `Task`. Unlike Figma's CLI-first packet, Refero has no local CLI role: every external call must be Code Mode only and every result is evidence, not a workspace mutation. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:4] [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:333]
- F-025: The existing manual name is `refero`, so the downstream callable namespace is `refero.refero_<tool>` after progressive discovery: search/list, inspect exact syntax with `tool_info`, then execute inside `call_tool_chain`. The packet must not claim availability merely because `.utcp_config.json` contains the manual. [SOURCE: file:.utcp_config.json:148] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:213] [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:285]
- F-026: The packet should allowlist exactly the eight current official operations—search/get styles, search/get/similar/image screens, and search/get flows—and reject stale names (`*_tool`, `get_design_guidance`), fabricated element/app endpoints, direct MCP calls, and guessed arguments. “Apps” and “elements” are discovery facets represented in returned style/screen/flow data, not separately documented MCP tool families. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://doc.refero.design/mcp/data-model]
- F-027: A transport-level validator should enforce documented discriminated unions and bounds before execution: exactly one singular-or-batch ID field for detail tools, UUID screen/style identifiers, numeric flow identifiers, `web|ios` platform on screen/flow search, pages starting at 1, similar-screen limit 1–20, image size `thumbnail|full`, and only documented response formats. It should preserve unknown response fields and avoid silently rewriting rejected input. [SOURCE: https://doc.refero.design/mcp/tools] [SOURCE: https://doc.refero.design/mcp/data-model]
- F-028: `sk-design` must run its manager intake before the Refero transport is selected for design-affecting work: establish goal, surface, inputs, constraints, and proof; resolve the smallest judgment mode; set Brand/Product before design decisions; show the visible plan; then fetch Refero evidence. Search phrases and selections are derived from that judgment context, while the selected mode—or `audit`—accepts, rejects, or synthesizes results. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:44] [SOURCE: file:.opencode/skills/sk-design/shared/context_loading_contract.md:22]
- F-029: Workflow pairing should be intent-specific: `interface` owns visual direction and screen composition; `foundations` owns style-system evidence such as typography, color, spacing, and hierarchy; `motion` may use flow sequences only as reference evidence; `audit` evaluates supplied/implemented surfaces against evidence; `md-generator` is not a default partner because it extracts measured live-site CSS rather than choosing references. UI build/redesign retains the hub's ordered interface+foundations bundle. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:144] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:166]
- F-030: The official Refero Skill's reference lock belongs at the judgment boundary: declare one primary structural reference, optional secondary references for isolated traits, record borrowed versus rejected traits, and never average results into a generic mood board. The transport returns candidates, identifiers, metadata, and explicitly requested images; it does not decide what to copy, declare readiness, or bypass accessibility/responsive proof. [SOURCE: https://raw.githubusercontent.com/referodesign/refero_skill/main/SKILL.md] [SOURCE: file:.opencode/skills/sk-design/SKILL.md:174]
- F-031: Non-credentialed verification should cover registry/router parity, tool-permission denial, namespace construction, discovery-before-call, exact eight-tool allowlisting, all argument bounds/unions, response pass-through, structured errors/timeouts, and mandatory `sk-design` ordering. Credentialed smoke tests are separate operator tests: successful OAuth, tool discovery, one metadata search, and one explicit image fetch, with no token/log capture and no automatic auth-state deletion. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:365] [SOURCE: file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md:271] [SOURCE: https://github.com/geelen/mcp-remote#troubleshooting]

## Questions Answered

- What exact read-only transport packet, Code Mode boundary, tool allowlist, `sk-design` pairing, and verification plan should be authored downstream? A registry-driven, non-mutating Code Mode transport with eight allowlisted Refero operations, prevalidated inputs, mandatory design-manager ordering, evidence-only results, and separate credential-free versus operator-authenticated tests.

## Questions Remaining

- Cross-check the complete blueprint against the official Refero workflow references and local packet test conventions; resolve any contradictions and produce the final authoring checklist.
- Preserve open operational unknowns: authenticated live schemas, actual page size, burst/concurrency policy, and end-to-end OAuth behavior.

## Sources Consulted

- file:.opencode/skills/mcp-tooling/SKILL.md
- file:.opencode/skills/mcp-tooling/mode-registry.json
- file:.opencode/skills/mcp-tooling/hub-router.json
- file:.opencode/skills/mcp-tooling/graph-metadata.json
- file:.opencode/skills/mcp-tooling/mcp-figma/SKILL.md
- file:.opencode/skills/mcp-code-mode/SKILL.md
- file:.opencode/skills/sk-design/SKILL.md
- file:.opencode/skills/sk-design/shared/context_loading_contract.md
- https://doc.refero.design/mcp/tools
- https://doc.refero.design/mcp/data-model
- https://raw.githubusercontent.com/referodesign/refero_skill/main/SKILL.md

## Assessment

- newInfoRatio: 0.58
- Novelty justification: This pass converted server/package facts into the repository-specific registry entry, permission set, namespace, argument guardrails, judgment order, and verification boundary required to author the packet.
- Confidence: High for local architecture; high for documented Refero schemas; medium for authenticated runtime behavior not exercised in this scope.

## Reflection

- What worked and why: The existing Figma transport and design hub establish a clear transport-versus-taste precedent, while Code Mode provides the exact execution and discovery boundary.
- What did not work and why: Static inspection cannot prove the live authenticated Code Mode catalog or OAuth callback because doing so would create operator auth state outside this lineage.
- What I would do differently: Keep operator smoke tests explicit and separate from deterministic packet validation so CI never depends on a paid account or browser callback.

## Ruled Out

- Create a standalone Refero hub or embed Refero in `sk-design`: it is an MCP bridge and belongs as a transport mode under `mcp-tooling`; design judgment remains in `sk-design`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- Allow Bash because `mcp-remote` is launched with `npx`: Code Mode owns launching the existing stdio manual; the packet itself has no shell responsibility. [SOURCE: file:.opencode/skills/mcp-code-mode/SKILL.md:269]
- Treat search rank or image similarity as a design verdict: Refero supplies reference evidence and `sk-design` owns acceptance. [SOURCE: file:.opencode/skills/sk-design/SKILL.md:263]

## Dead Ends

- Live Code Mode tool discovery was intentionally not invoked: it can launch `mcp-remote`, trigger browser OAuth, and write credential state outside the bound artifact directory. [SOURCE: https://github.com/geelen/mcp-remote]

## Recommended Next Focus

Run a contradiction-oriented final pass across the official workflow reference, exact tool schemas, router/test conventions, and failure cases, then synthesize the implementation-ready packet blueprint.
