# Iteration 5: Webflow MCP resource, instruction, and safety surfaces

## Focus
Investigate the strategy's focus on per-tool mutation confirmation semantics and the complete Bridge-dependent capability boundary, using a fresh official-documentation angle and the repository's discovery/playbook contracts. The exact callable-level confirmation metadata remains out of scope because no authenticated Webflow manual is registered in this packet.

## Findings
1. Webflow exposes MCP resources in addition to tools, including a read-only Webflow Guide resource that compatible clients can load into context; this is a distinct read-only surface and should not be treated as an executable tool or mutation path in the integration model. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
2. Site-level Agent Instructions are supplied automatically to connected agents, can reference live Webflow primitives, and may be shared across a workspace through Shared Libraries. The integration should surface this instruction provenance as provider-supplied context and keep it separate from repository routing policy; the source describes the mechanism but does not publish a per-instruction trust or confirmation contract. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
3. The complete Bridge-dependent boundary documented by Webflow remains limited to visual snapshots, current selection/page/mode/branch state, Designer canvas navigation, and breakpoint reads; ordinary element/component/style/variable and site-data operations remain Data API-backed. This supports capability-specific `ModeForbidden` handling, not a global Bridge-required precondition. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works] [SOURCE: https://developers.webflow.com/mcp]
4. No provider-level per-tool confirmation or dry-run contract is published in the official MCP pages reviewed. The repository's playbook separately requires destructive tests to use throwaway data and explicit cleanup, so Webflow mutation confirmation must remain a caller-owned integration/playbook rule rather than an asserted Webflow guarantee. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82] [INFERENCE: based on the absence of a provider confirmation contract and the repository destructive-test rule]

## Ruled Out
- Treating MCP resources or Agent Instructions as callable tool schemas; the official architecture distinguishes resources from tools. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Treating Bridge absence as a transport outage or requiring the Bridge for all mutations; official documentation separates live-Designer capabilities from Data API-backed operations. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works]
- Claiming provider-enforced confirmation, dry-run, or per-tool safety metadata without a published contract; the remaining conclusion is caller-owned policy. [SOURCE: https://developers.webflow.com/mcp] [INFERENCE: based on the reviewed official documentation]

## Dead Ends
Authenticated live discovery, exact callable names, schemas, and tool-level confirmation metadata remain unavailable because the bound packet has no registered Webflow manual or operator-authenticated session. The smallest next evidence needed is a read-only `list_tools`/`tool_info` capture from an authenticated Webflow Code Mode manual.

## Edge Cases
- Ambiguous input: “complete list” was interpreted as the complete Bridge-dependent capability categories explicitly documented by Webflow, not an inferred callable inventory.
- Contradictory evidence: none found between the official overview, architecture page, and repository playbook.
- Missing dependencies: authenticated live Code Mode discovery is unavailable; official documentation and local playbook rules supplied the bounded fallback.
- Partial success: the documented Bridge boundary and caller-owned mutation-safety requirement are reinforced, but callable-level confirmation semantics remain unresolved.

## Sources Consulted
- https://developers.webflow.com/mcp
- https://developers.webflow.com/mcp/reference/how-it-works
- .opencode/skills/mcp-tooling/mcp-click-up/manual-testing-playbook/manual-testing-playbook.md:69-82
- .opencode/skills/mcp-code-mode/references/naming-convention.md:349-397
- https://developers.webflow.com/llms.txt

## Assessment
- New information ratio: 0.75 (two findings are fully new resource/instruction-surface evidence; two refine the carried-forward Bridge and mutation-safety conclusions).
- Questions addressed: per-tool mutation confirmation semantics; complete documented Bridge-dependent capability categories.
- Questions answered: the documented Bridge boundary and the distinction between read-only MCP resources, provider instructions, and executable tools.

## Reflection
- What worked and why: Reading the official architecture page together with the documentation index exposed resource and instruction surfaces that were not covered by the prior mutation-only pass, while the local playbook grounded the caller-owned safety conclusion.
- What did not work and why: No authenticated Webflow manual exists in the bound packet, so exact callable schemas and provider confirmation metadata could not be verified.
- What I would do differently: Capture a read-only authenticated discovery inventory before making any callable-level claim or implementation decision.

## Recommended Next Focus
No further iteration is available under the configured max-iterations stop policy. If research is resumed, perform operator-gated read-only Webflow Code Mode discovery (`list_tools`, then `tool_info`) and compare the live inventory with the documented Bridge/resource/mutation model.
