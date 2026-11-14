# Deep Research Synthesis — Route Patch Declarations in `.dsh/patches/`

**Lineage:** `dsh-rc3` (cli-deepseek-harness / deepseek-v4.1-flash-1017) · **Session:** `fanout-dsh-rc3-1794662312097-eo5r8r` · **Spec:** `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/019-dsh-repin-rc3` · **Iterations:** 1 of 1 (stopPolicy: convergence; max-iterations cap reached)

---

## 1. Research Metadata

| Field | Value |
|---|---|
| Topic | What the checked-in route patches under `.dsh/patches/` declare for endpoint, model id, and reasoning effort |
| Method | One read-only iteration: list and read all five patch files, extract `baseURL`, model `id`, and `reasoningEffort` from the two route patches, and verify the other three carry no routing values |
| Evidence base | All five files under `.dsh/patches/` read in full with line numbers |
| Stop reason | maxIterationsReached |
| Write surface | Lineage artifact directory only |

## 2. Executive Summary

The checked-in patches contain exactly two route patches, and both pin a DeepSeek V4.1 Flash model at `reasoningEffort: max`. The LLM Gateway route pins `https://api.llmgateway.io/v1` with model id `deepseek-v4.1-flash-1017`; the OpenCode Go route pins `https://opencode.ai/zen/go/v1` with model id `deepseek-v4.1-flash`, and its own header flags that endpoint as unverified until a keyed run. Both use the `openai-completions` provider shape with `thinkingFormat: deepseek`, `supportsDeveloperRole: false`, and an `off` / `high` / `max` reasoning ladder. The remaining three patches (`guards`, `lineage`, `mcp-code-mode`) configure plugins, session/telemetry disables, and an MCP server; they declare no endpoint, model id, or reasoning effort.

## 3. Research Question & Objectives

Primary question: what do the checked-in route patches under `.dsh/patches/` declare for endpoint, model id, and reasoning effort? Objectives: identify which files are route patches, extract the three routing values per route patch, and confirm the non-route patches are silent on routing. The answer must fit under 150 words.

## 4. Method

Iteration 1 listed `.dsh/patches/` (five files), read every file with line numbers, and extracted the routing keys. No file was modified; no endpoint was contacted; no credentials were read or used. The scope was the literal declarations in the files, not whether the endpoints work.

## 5. Route Patch Inventory

- `route-llmgateway-deepseek.patch.yml` — pins the LLM Gateway provider and default agent model.
- `route-opencode-go-deepseek.patch.yml` — pins the OpenCode Go provider and default agent model.
- `guards.patch.yml`, `lineage.patch.yml`, `mcp-code-mode.patch.yml` — not route patches; no provider, endpoint, model, or reasoning keys. [SOURCE: .dsh/patches/guards.patch.yml:3] [SOURCE: .dsh/patches/lineage.patch.yml:2] [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:4]

## 6. LLM Gateway Route

The `llm-pi-ai` patch declares provider `llmgateway` with `apiKeyEnv: LLMGATEWAY_API_KEY`, `api: openai-completions`, and `baseURL: https://api.llmgateway.io/v1`. Its model entry is `id: deepseek-v4.1-flash-1017`, `name: DeepSeek V4.1 Flash`, with `reasoningEfforts` entries `off:` (empty), `high: high`, and `max: max`. The `agent-default-model` patch then selects `provider: llmgateway`, `model: deepseek-v4.1-flash-1017`, `reasoningEffort: max`. [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:9] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:14] [SOURCE: .dsh/patches/route-llmgateway-deepseek.patch.yml:24]

## 7. OpenCode Go Route

The same `llm-pi-ai` id declares provider `opencode-go` with `apiKeyEnv: OPENCODE_API_KEY`, `api: openai-completions`, and `baseURL: https://opencode.ai/zen/go/v1`. Its model entry is `id: deepseek-v4.1-flash`, `name: DeepSeek V4.1 Flash`, with the same `off` / `high` / `max` ladder. The `agent-default-model` patch selects `provider: opencode-go`, `model: deepseek-v4.1-flash`, `reasoningEffort: max`. The file header explicitly says the endpoint is unverified until a keyed run proves it. [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:10] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:15] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:25] [SOURCE: .dsh/patches/route-opencode-go-deepseek.patch.yml:2]

## 8. Short Answer (under 150 words)

Two checked-in route patches declare the routing contract. `route-llmgateway-deepseek.patch.yml` sets endpoint `https://api.llmgateway.io/v1`, model id `deepseek-v4.1-flash-1017`, and `reasoningEffort: max`, with an off/high/max effort ladder. `route-opencode-go-deepseek.patch.yml` sets endpoint `https://opencode.ai/zen/go/v1`, model id `deepseek-v4.1-flash`, and `reasoningEffort: max` on the same ladder; its header says the endpoint is unverified until a keyed run. Both configure an `openai-completions` provider with DeepSeek thinking format and `supportsDeveloperRole: false`. The other files - `guards.patch.yml`, `lineage.patch.yml`, and `mcp-code-mode.patch.yml` - declare plugins, telemetry/session disables, and an MCP server, so they declare no endpoint, model id, or reasoning effort.

## 9. Non-Route Patches

`guards.patch.yml` inserts the `repo-guards` plugin with `promptAdvisor: true`. `lineage.patch.yml` disables `session-telemetry-otel`, `session-log-deepseek`, `goal-round-driver`, `command-goal`, `tool-goal`, and `plan-mode`, then inserts the `repo-guards-lineage-leaf` marker. `mcp-code-mode.patch.yml` mounts a `code_mode` MCP server over stdio using `@deepseek-ai/dsh-mcp-client` and the local launcher. None declares a provider endpoint, model id, or reasoning effort. [SOURCE: .dsh/patches/guards.patch.yml:1] [SOURCE: .dsh/patches/lineage.patch.yml:5] [SOURCE: .dsh/patches/mcp-code-mode.patch.yml:6]

## 10. Operational Implications

- The two route patches are mutually exclusive alternatives: each independently overrides `agent-default-model`, so only one should be applied per dispatch.
- Both select the `max` effort despite the cheaper options existing on the ladder.
- The OpenCode Go endpoint is a declared-but-unverified claim; the LLM Gateway endpoint has no such caveat in its own file.
- The model ids differ by suffix: `deepseek-v4.1-flash-1017` (LLM Gateway) vs `deepseek-v4.1-flash` (OpenCode Go). Treating them as interchangeable would be unsupported by these files.

## Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| Treat `mcp-code-mode.patch.yml` as a route patch | Declares an MCP server (`serverName: code_mode`, `transport: stdio`) and no provider/model keys | mcp-code-mode.patch.yml:6-7 | 1 |
| Infer the base default route from these patches | Both route patches override `agent-default-model`; the base default is not declared here | route-*.patch.yml:20-24 | 1 |
| Use the shared provider block to claim identical models | Both use `openai-completions`, but the model ids differ and each patch declares its own list | route-llmgateway:8-19; route-opencode-go:9-20 | 1 |
| Validate endpoints by calling them | Out of the read-only question scope; would require credentials and network writes outside the lineage | task scope | 1 |

## Divergence Map

- Completed pivots: 0 · Failed pivots: 0 · Audited overrides: 0 (convergenceMode: default)
- Saturated: none recorded
- Pivot lineage: none
- Remaining frontier: keyed endpoint verification for both declared providers, which is a separate validation packet, not a gap in the declaration question

## Open Questions

1. Does the OpenCode Go endpoint actually serve `deepseek-v4.1-flash` as declared? The patch header says it is unverified; a keyed run would settle it.
2. Which of the two route patches is intended for the current harness pin? The files are alternatives, and the checked-in selection is not recorded inside `.dsh/patches/`.
3. Does `off:` (empty value) in `reasoningEfforts` mean "supported but no value", or "disable reasoning"? The patch syntax is not explained in the files.

## Risks & Caveats

- **Declaration-only evidence**: this synthesis reports what the files say. It does not prove that either endpoint or model id works.
- **Ambiguous "route patch" reading**: the narrow `route-*.patch.yml` interpretation was used; the other files were still read in full to confirm silence on routing.
- **Spec-write steps skipped by scope**: bounded `spec.md` pre-init mutation and post-synthesis findings write-back are outside this fan-out lineage's write surface; recorded as `spec_synthesis_deferred` instead of executed.
- **Resource-map emission disabled**: `config.resource_map.emit` is false because the fan-out emission path would write outside the lineage; no resource map is required for this declaration question.
- **Single-lineage view**: this is one fan-out lineage; the merge may add sibling evidence, though the question is narrow and file-bounded.

## Appendix: Convergence Report

- Stop reason: **maxIterationsReached** (`config.maxIterations: 1`; the convergence signals were not needed)
- Total iterations: 1
- Questions answered: 4 / 4
- Remaining questions: 0 (the three open questions above are forward-looking, not unanswered key questions)
- Last 3 iteration summaries: run 1 — route patch declarations (1.00)
- Convergence threshold: 0.05
- Divergence summary: no divergent pivots recorded

## References

- `.dsh/patches/route-llmgateway-deepseek.patch.yml`
- `.dsh/patches/route-opencode-go-deepseek.patch.yml`
- `.dsh/patches/guards.patch.yml`
- `.dsh/patches/lineage.patch.yml`
- `.dsh/patches/mcp-code-mode.patch.yml`
- Lineage iteration: `iterations/iteration-001.md`; delta: `deltas/iter-001.jsonl`
