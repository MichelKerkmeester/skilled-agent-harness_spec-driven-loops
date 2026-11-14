# Iteration 1: Route Patch Declarations in `.dsh/patches/`

## Focus

Read every checked-in patch under `.dsh/patches/` and extract what the route patches declare for endpoint, model id, and reasoning effort. The question is scoped to declarations in the files, not to endpoint reachability or harness behavior. All five files were read in full with line numbers; the read was read-only.

## Actions Taken

1. Listed `.dsh/patches/` and found five files: `guards.patch.yml`, `lineage.patch.yml`, `mcp-code-mode.patch.yml`, `route-llmgateway-deepseek.patch.yml`, `route-opencode-go-deepseek.patch.yml`.
2. Read all five files with line numbers.
3. Extracted `baseURL`, model `id`, and `reasoningEffort` from the two `route-*.patch.yml` files, and checked the other three for provider/model keys.

## Findings

1. `route-llmgateway-deepseek.patch.yml` declares the LLM Gateway endpoint `https://api.llmgateway.io/v1`, model id `deepseek-v4.1-flash-1017` (display name "DeepSeek V4.1 Flash"), and `reasoningEffort: max`, selecting the `off` / `high` / `max` ladder. The provider is `openai-completions` with `thinkingFormat: deepseek` and `supportsDeveloperRole: false`. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:14] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:24]

2. `route-opencode-go-deepseek.patch.yml` declares the OpenCode Go endpoint `https://opencode.ai/zen/go/v1`, model id `deepseek-v4.1-flash`, and `reasoningEffort: max` with the same `off` / `high` / `max` ladder. It uses the same `openai-completions` + DeepSeek thinking compatibility shape; its header says the endpoint is unverified until a keyed run proves it. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:15] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:25] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2]

3. The other three patches declare no endpoint, model id, or reasoning effort: `guards.patch.yml` inserts the `repo-guards` plugin, `lineage.patch.yml` disables telemetry/session/goal/plan components and inserts a lineage-leaf marker, and `mcp-code-mode.patch.yml` mounts a `code_mode` MCP server over stdio. [SOURCE: .dsh/patches/guards.patch.yml:3] [SOURCE: .dsh/patches/lineage.patch.yml:2] [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:4]

## Answer (under 150 words)

Two checked-in route patches declare the routing contract. `route-llmgateway-deepseek.patch.yml` sets endpoint `https://api.llmgateway.io/v1`, model id `deepseek-v4.1-flash-1017`, and `reasoningEffort: max`, with an off/high/max effort ladder. `route-opencode-go-deepseek.patch.yml` sets endpoint `https://opencode.ai/zen/go/v1`, model id `deepseek-v4.1-flash`, and `reasoningEffort: max` on the same ladder; its header says the endpoint is unverified until a keyed run. Both configure an `openai-completions` provider with DeepSeek thinking format and `supportsDeveloperRole: false`. The other files - `guards.patch.yml`, `lineage.patch.yml`, and `mcp-code-mode.patch.yml` - declare plugins, telemetry/session disables, and an MCP server, so they declare no endpoint, model id, or reasoning effort.

## Questions Answered

- Which checked-in route patches under .dsh/patches/ declare an endpoint, model id and reasoning effort?
- What endpoint, model id and reasoning effort does the llmgateway route patch declare?
- What endpoint, model id and reasoning effort does the opencode-go route patch declare?
- Do the remaining .dsh/patches/ files declare any routing values?

## Questions Remaining

None for the stated question. Follow-up endpoint verification (keyed runs) is out of this lineage's read-only scope.

## Ruled Out

- Treating `mcp-code-mode.patch.yml` as a route patch: it declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6]
- Searching outside `.dsh/patches/` for route declarations: the question is explicitly scoped to the checked-in patches, and no other source was needed.
- Inferring a base default route: both route patches override `agent-default-model`; the base default is not declared in these files, so no claim is made about it.

## Dead Ends

None. All five files were readable and the two route files contained the requested declarations.

## Edge Cases

- Ambiguous input: "route patches" could be read broadly (anything affecting dispatch). The narrow, evidence-backed interpretation was used: files named `route-*.patch.yml`; the remaining files were still read and verified to contain no routing values.
- Contradictory evidence: none. The two route patches agree on the `max` effort and the `off`/`high`/`max` ladder; they differ only in provider namespace, endpoint, model id, and the unverified-endpoint caveat.
- Missing dependencies: none.
- Partial success: none.

## Sources Consulted

- `.dsh/patches/route-llmgateway-deepseek.patch.yml` (lines 1-24)
- `.dsh/patches/route-opencode-go-deepseek.patch.yml` (lines 1-25)
- `.dsh/patches/guards.patch.yml` (lines 1-6)
- `.dsh/patches/lineage.patch.yml` (lines 1-22)
- `.dsh/patches/mcp-code-mode.patch.yml` (lines 1-35)

## Assessment

- New information ratio: 1.0
- Rationale: all three findings are fully new to this fresh lineage; there was no prior packet evidence for this topic.
- Questions addressed: 4
- Questions answered: 4

## Reflection

- What worked and why: reading all five small YAML files in full with line numbers made the answer direct and auditable; the `route-*` filename convention separated routing declarations from plugin/config patches without guessing.
- What did not work and why: nothing failed. Not verifying endpoints live was deliberate: the question asks what the files declare, and this lineage must not make network or credential calls outside the packet.
- What I would do differently: nothing for this question. A broader follow-up would grep the harness config for the base default route, but that is outside the stated scope.

## Recommended Next Focus

None; the question is answered. If the run were extended, the only useful follow-up would be a keyed smoke test of each declared endpoint, which is out of scope here and belongs to a separate validation packet.
