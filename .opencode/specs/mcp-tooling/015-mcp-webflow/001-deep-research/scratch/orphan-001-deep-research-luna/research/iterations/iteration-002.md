# Iteration 2: Concrete repository packet design

## Focus
Investigate the narrow repository-design question: how Webflow MCP should be represented in the registry, routed through Code Mode, discovered safely, and covered by validation/playbook artifacts. Authentication and mutation details are carried only where they constrain that packet design.

## Actions Taken
- Read the existing `mcp-tooling` hub contract, `mode-registry.json`, and `hub-router.json` to identify the required discriminator, routing, permissions, and vocabulary fields.
- Compared the remote transport packet contracts for `mcp-magnific` and `mcp-refero`, including discovery-first, OAuth-boundary, fail-closed, and workspace-write rules.
- Read the Code Mode naming convention and inspected `.utcp_config.json` for the registered remote-manual pattern; Webflow is not currently registered.
- Re-read the official Webflow MCP overview and how-it-works documentation to map remote endpoint, Designer Bridge dependency, governance, and capability limitations onto repository checks.
- Read the existing hub manual-testing playbook to identify the required primary route, ambiguous/defer, blind holdout, and packet-level validation coverage.

## Findings
1. A Webflow packet should be registered as a `transport` mode with `backendKind: "code-mode-remote-mcp"`, `mutatesWorkspace: false`, and an allowed tool surface limited to `Read`, `Bash`, `Grep`, `Glob`, and `mcp__code_mode__call_tool_chain`; `Write`, `Edit`, and `Task` should be forbidden in the registry. This matches the repository's remote transport contract and is safer than classifying Webflow as a local-mutating workflow bridge. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29] [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:175-208] [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40]
2. The Code Mode manual should bridge `https://mcp.webflow.com/mcp` through `npx -y mcp-remote` over the repository's existing stdio manual shape, keep the environment empty unless an independently verified provider requirement appears, and use the manual name—not a guessed server name—as the callable namespace. Calls must be preceded by `list_tools`/`search_tools` and `tool_info`, then use `{manual}.{manual}_{tool}` naming. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] [SOURCE: .opencode/skills/mcp-code-mode/references/naming-convention.md:21-38] [SOURCE: .opencode/skills/mcp-code-mode/references/naming-convention.md:349-397] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42]
3. Registry and router vocabulary should use a narrow stable mode key such as `mcp-webflow`, aliases such as `webflow`, `webflow mcp`, and `webflow designer`, and capability-specific classes for Webflow site/page/CMS/design-system operations. Generic `design`, `CMS`, or `analytics` terms alone should not score the mode because they overlap other hub routes; ambiguous provider-neutral requests should defer. This follows the hub's explicit provider-specific scoring and discovery-only vocabulary separation. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:4-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:33-103] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119] [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:56-67]
4. Packet discovery must model Webflow's two capability states instead of treating bridge failures as generic transport failures: most API-backed tools work without Designer, while visual snapshots and current selection/page/mode/branch/canvas/breakpoint operations require the Bridge App and can return `ModeForbidden`. The packet should therefore require a pre-call discovery/`tool_info` check, preserve the provider's mode error, and expose a separate “Designer Bridge required” troubleshooting/playbook case. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-refero/SKILL.md:216-229]
5. Validation should be split into hub-level and packet-level artifacts. Hub coverage needs one Webflow primary route, one provider-neutral ambiguous/defer case, and one blind natural-language Webflow holdout; packet coverage needs manual registration/bridge-shape verification, live discovery and schema-drift fail-closed behavior, OAuth/operator-gated behavior, Bridge-required mode handling, and explicit confirmation around mutations such as publish/unpublish, deletion, custom code, and SEO changes. This extends the existing playbook's exact-resource and seven-mode holdout model without conflating routing validation with provider execution. [SOURCE: .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:7-21] [SOURCE: .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:29-40] [SOURCE: .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:72-84] [SOURCE: https://developers.webflow.com/mcp]

## Questions Answered
- How should the existing mcp-tooling architecture integrate it safely? — Answered at packet-architecture level: registry-driven transport mode, Code Mode remote manual, narrow provider vocabulary, discovery-first calls, bridge-aware errors, and layered validation.

## Questions Remaining
- Exact Webflow MCP manual object shape after live Code Mode registration and the actual discovered callable names/schemas.
- Exact OAuth authorization UX, scope names, workspace selection/revocation behavior, and whether `mcp-remote` requires any Webflow-specific flags.
- Per-tool mutation confirmation semantics and the complete list of Bridge-dependent tools.

## Ruled Out
- A local-mutating `workflow` classification was ruled out because the remote MCP server is the external execution surface and the repository's transport axis defines workspace mutation as false. [SOURCE: .opencode/skills/mcp-tooling/mode-registry.json:18-29]
- Generic `design`/`CMS` routing vocabulary was ruled out because it would overlap existing modes and violate the hub's provider-specific scoring/defer contract. [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:27-31] [SOURCE: .opencode/skills/mcp-tooling/hub-router.json:105-119]

## Dead Ends
- The first attempted Magnific wiring-reference path did not exist in that packet; the available `SKILL.md` architecture contract and the structurally parallel Mobbin wiring reference supplied the needed transport comparison. [SOURCE: .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40] [SOURCE: .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42]

## Edge Cases
- Ambiguous input: the focus was interpreted as repository packet architecture, not implementation or credential provisioning; live registration remains deferred.
- Contradictory evidence: none found between Webflow's overview/how-it-works pages and the local transport contracts.
- Missing dependencies: the exact live Webflow manual/discovery fixture is not present; the design is a documented scaffold and must fail closed until live discovery confirms names and schemas.
- Partial success: repository shape and validation coverage are concrete; exact OAuth and live callable details remain unresolved.

## Sources Consulted
- https://developers.webflow.com/mcp
- https://developers.webflow.com/mcp/reference/how-it-works
- .opencode/skills/mcp-tooling/mode-registry.json:18-29, 175-208
- .opencode/skills/mcp-tooling/hub-router.json:4-31, 33-119
- .opencode/skills/mcp-code-mode/references/naming-convention.md:21-38, 349-397
- .opencode/skills/mcp-tooling/mcp-magnific/SKILL.md:28-40
- .opencode/skills/mcp-tooling/mcp-mobbin/references/mcp-wiring.md:23-42
- .opencode/skills/mcp-tooling/manual-testing-playbook/manual-testing-playbook.md:7-21, 29-40, 72-84

## Assessment
- New information ratio: 1.00 (five focus-specific findings were not present in the registry; each converts prior high-level integration evidence into a concrete registry, transport, routing, discovery, or validation constraint).
- Questions addressed: concrete repository packet design and safe mcp-tooling integration.
- Questions answered: the architecture-level integration question.

## Reflection
- What worked and why: Comparing the registry/router contracts with two existing remote transport packets exposed the exact fields and safety posture Webflow must inherit, while official documentation supplied the Bridge-specific state model.
- What did not work and why: A live Webflow manual/discovery probe was unavailable in this iteration, so callable names, schemas, and exact OAuth behavior cannot be asserted.
- What I would do differently: In the next iteration, follow the official getting-started/OAuth links and obtain a reviewed live discovery fixture before freezing the manual object or tool catalog.

## Recommended Next Focus
Verify the official OAuth/getting-started path and perform operator-gated live Code Mode discovery; record the exact manual shape, callable names, schemas, and Bridge-dependent tool markers before implementation.
