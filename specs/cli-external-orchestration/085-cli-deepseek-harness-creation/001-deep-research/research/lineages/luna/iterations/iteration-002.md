# Iteration 2 — Provider and model routing

- Focus: Angle 2, provider and model routing
- Timestamp: 2026-11-05T22:20:33Z
- Findings count: 6
- Novelty: 0.92

## Focus

Map the official DeepSeek route and the two operator-provided gateway routes onto DeepSeek Harness provider adapters, model identifiers, credentials, and profile selection. Check live endpoint metadata for drift.

## Actions Taken

- Read the supplied provider-route inventory and the harness provider guide, direct DeepSeek adapter docs, pi-ai adapter docs, model catalog code, and headless option parser.
- Checked the current OpenCode Go route in the Models.dev catalog and OpenCode’s public Go documentation, both fetched 2026-11-05.
- Did not run a dispatch: the harness has no configured provider credentials, and the operator has not supplied any.

## Findings

1. The built-in DeepSeek adapter is for the official DeepSeek API and Messages protocol. It registers provider deepseek-official, defaults reasoning effort to high, and advertises deepseek-flash plus deepseek-v4-pro; use it for the official API, not as the generic OpenAI-compatible gateway adapter. [SOURCE: dsh-src/packages/llm/llm-deepseek/README.md:34-63] [SOURCE: dsh-src/packages/llm/llm-deepseek/src/models.ts:7-21]
2. The LLM Gateway route is a hand-declared pi-ai provider: configure apiKeyEnv, api=openai-completions, baseURL=https://api.llmgateway.io/v1, and an explicit model list containing deepseek-v4.1-flash-1017 (optionally the route’s glm-5.3-flash). The harness stores this provider shape in the selected profile’s cordis.patch.yml and resolves credentials through references rather than a literal secret. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:48-51] [SOURCE: dsh-src/docs/user/guide/providers.md:27-39,49-56,67-80] [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:36-75]
3. OpenCode Go is a separate pi-ai catalog route, provider id opencode-go, using OPENCODE_API_KEY. The current Models.dev catalog lists DeepSeek V4.1 Flash as deepseek-v4.1-flash at https://opencode.ai/inference/go/openai/v1, with OpenAI-compatible chat completions, 1,000,000 context, 384,000 output, reasoning and tool-call support. [SOURCE: dsh-src/packages/llm/llm-pi-ai/src/provider-data.generated.ts:35-36] [SOURCE: https://models.opencode.ai/providers/opencode-go/ (fetched 2026-11-05)] [SOURCE: https://pi.dev/models/opencode-go/deepseek-v4-1-flash?name=pi-open-agents (fetched 2026-11-05)]
4. The two operator routes are not interchangeable aliases: the LLM Gateway model is deepseek-v4.1-flash-1017, while OpenCode Go is deepseek-v4.1-flash, and each route has its own key reference. Keep separate pi-ai provider ids and model entries so sessions and defaults cannot silently cross providers. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:48-55] [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:28-38,77-85]
5. The endpoint evidence diverges: the supplied route inventory and current Models.dev catalog list /inference/go/openai/v1, while OpenCode’s current Go docs list https://opencode.ai/zen/go/v1/chat/completions. These may describe separate catalog and service routes or a migration; the exact endpoint that will authenticate and serve this harness configuration is UNKNOWN without an authorized request. [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:52-54] [SOURCE: https://models.opencode.ai/providers/opencode-go/ (fetched 2026-11-05)] [SOURCE: https://docs.opencode.ai/docs/go/ (fetched 2026-11-05)]
6. Headless exposes no per-dispatch provider or model selector. Route choice must therefore come from the selected profile’s configured/default model or an already-persisted session; using separate profiles is the clearest operator-controlled way to keep these routes distinct, but the exact launch selection should be checked against the chosen headless profile contract before implementation. [SOURCE: dsh-src/packages/bundle/headless/src/startup.ts:53-75,117-155] [SOURCE: dsh-src/docs/user/guide/providers.md:41-56] [SOURCE: dsh-src/apps/cli/reference/README.md:13-17]

## Questions Answered

- None; provider routing is one part of the broader provider, runtime-folder, skills, agents, commands, plugins, hooks, and MCP question.

## Questions Remaining

- How should the two provider routes, repo-local runtime folder, skills, agents, commands, plugins, hooks, and MCP be represented for this mode?
- Which Pi extensions and third-party plugins should be ported, deferred, replaced by native features, or dropped?
- What fan-out executor support and cross-repository touch points are required to integrate the mode safely?
- What constraints, unknowns, and dependency-ordered phases should guide implementation?

## Next Focus

Angle 3: DSH_HOME, profile layering, and repo-local runtime configuration.

## Scope and Source Conflicts

- Iteration 1’s delta was first named iteration-001.jsonl, but the reducer contract requires deltas/iter-NNN.jsonl. It was moved inside this lineage to deltas/iter-001.jsonl and the reducer was run again; the question projection now records Q1 as answered. No state-log file was directly edited.
- The OpenCode Go endpoint mismatch remains unresolved because the local lineage has no configured provider credentials. The record preserves both observed endpoints and treats the dispatch endpoint as UNKNOWN.

## Sources

- dsh-src/packages/llm/llm-deepseek/README.md and src/models.ts
- dsh-src/packages/llm/llm-pi-ai/README.md and src/provider-data.generated.ts
- dsh-src/docs/user/guide/providers.md
- dsh-src/packages/bundle/headless/src/startup.ts
- dsh-src/apps/cli/reference/README.md
- specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md
- https://models.opencode.ai/providers/opencode-go/
- https://pi.dev/models/opencode-go/deepseek-v4-1-flash?name=pi-open-agents
- https://docs.opencode.ai/docs/go/
