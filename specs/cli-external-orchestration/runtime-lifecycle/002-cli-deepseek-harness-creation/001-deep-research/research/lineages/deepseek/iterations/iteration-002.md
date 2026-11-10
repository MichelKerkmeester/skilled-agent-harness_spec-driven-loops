# Iteration 2: Providers, models and reasoning

## Focus

Angle 2: how the harness declares providers and models, whether the operator's two DeepSeek V4.1
Flash routes can be expressed, how reasoning levels work, and what a closed, fail-closed roster
looks like for a mode that mirrors `cli-pi`.

## Actions Taken

- Read the provider guide's custom-model and reasoning sections.
- Read the `llm-pi-ai` package reference for the route schema, credential reference semantics and
  stable error codes.
- Read the base bundle patch to find the shipped default route.
- Cross-checked the operator's route facts against `cli-pi`'s provider roster, which already
  records the two gateway shapes and their compatibility quirks.

## Findings

1. A custom OpenAI-compatible route is a `llm-pi-ai` row in
   `$DSH_HOME/profiles/<profile>/cordis.patch.yml`: `providers.<id>` with `apiKeyEnv`, `api`
   (one of `openai-completions`, `openai-responses`, `anthropic-messages`), `baseURL` and a
   non-empty `models` list. The provider id is permanent, lowercase and hyphenated; one provider
   speaks one protocol, so a gateway serving two protocols needs two providers.
   [SOURCE: dsh-src/docs/user/guide/providers.md:27-33]
   [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:123]
2. The LLM Gateway route is expressible with no harness change:
   `llmgateway` + `api: openai-completions` + `baseURL: https://api.llmgateway.io/v1` +
   `models: [{id: deepseek-v4.1-flash-1017}]`. Two compatibility facts travel with it: the gateway
   takes the bare model id (a provider-prefixed id returns HTTP 400), and its `runware` upstream
   refuses the `developer` role, which pi-ai sends to reasoning models unless
   `compat.supportsDeveloperRole: false` is set. This is an inference from the harness schema plus
   the route behavior already recorded by `cli-pi`, not a live dispatch.
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:89]
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:99]
3. The OpenCode Go route is expressible the same way: id `opencode-go`, base URL
   `https://opencode.ai/inference/go/openai/v1`, `api: openai-completions`, model
   `deepseek-v4.1-flash`, `max` effort. Its declaration is not its availability: the live smoke
   recorded in the resource map failed with `[overloaded] the server is overloaded`, exit 1, so a
   closed roster must separate "configured" from "reachable".
   [SOURCE: specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:52-54]
4. Reasoning levels are declared per model as `reasoningEfforts`, a map from level to the wire
   spelling sent as `reasoning_effort`; `max` is a real level, and a route-level `reasoning` sets
   the default while a session has chosen none. DeepSeek's built-in route already offers
   `off`, `low`, `high` and `max`; a hand-declared model declares none until the profile adds them,
   and an unsupported selection is refused as `UNSUPPORTED_REASONING_EFFORT`.
   [SOURCE: dsh-src/docs/user/guide/providers.md:134-166]
   [SOURCE: dsh-src/docs/config-catalog.md:2225]
5. DeepSeek V4 behind an OpenAI-compatible gateway needs `compat.thinkingFormat: deepseek` so that
   `off` sends `thinking: {type: disabled}` and every other level sends
   `thinking: {type: enabled}` beside the effort. Without it, `off` is only the absence of
   `reasoning_effort`, and a model that thinks unless told not to will still think.
   [SOURCE: dsh-src/docs/user/guide/providers.md:155-166]
6. `apiKeyEnv` is a credential reference resolved per request through the credential seam, so no
   secret enters a config file; a reference that resolves to nothing fails with
   `MISSING_CREDENTIAL`, an unusable key with `INVALID_CREDENTIAL`, an unconfigured model id with
   `UNKNOWN_MODEL`, and terminal provider failures distinguish `QUOTA` from `RATE_LIMIT`.
   [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:38]
   [SOURCE: dsh-src/packages/llm/llm-pi-ai/README.md:123]
7. The shipped default route is `agent-default-model` with `provider: deepseek-official` and
   `model: deepseek-flash`. That row is the per-dispatch lever a `--model` flag would have been:
   a `--patch <path>` overlay can replace it with `provider`, `model` and `reasoningEffort`, which
   is how a dispatch selects one route from a closed roster without editing `$DSH_HOME`.
   [SOURCE: dsh-src/packages/bundle/base/cordis.patch.yml:90-94]
   [SOURCE: dsh-src/packages/core/agent-default-model/README.md:22-33]
   [SOURCE: dsh-src/docs/cli-help.md:41-42]
8. Fail-closed is only partly native: the adapter refuses an unconfigured model id, but
   `agent-default-model` "does not validate catalog membership" and leaves availability diagnostics
   to the consumer opening the request. A closed roster therefore needs the skill packet and the
   dispatch preflight guard to pin both the provider and the model, mirroring `cli-pi`'s
   `pi-provider-qualified-model` rule rather than relying on the harness to reject a stray id.
   [SOURCE: dsh-src/packages/core/agent-default-model/README.md:33]
   [SOURCE: .skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json:28-35]

## Ruled Out

- A `--model`/`--provider` dispatch flag: headless exposes none.
- Relying on the harness catalog to enforce a model allowlist: it validates only what the profile
  declares, and the default-model service does not check catalog membership.

## Dead Ends

- Live verifying either gateway through `dsh`: requires writing a real key into a profile, which is
  out of bounds and would leave operator credentials in the lineage.

## Edge Cases

- Ambiguous input: "reasoning levels per model" could mean the catalog ladder or the wire spelling;
  both are recorded, since the map's value is the spelling.
- Contradictory evidence: none.
- Missing dependencies: no configured key, so every route fact is documentation plus Pi-route
  behavior rather than a live dsh dispatch.
- Partial success: route shape and reasoning semantics are confirmed from source; gateway
  compatibility is inferred.

## Sources Consulted

- `dsh-src/docs/user/guide/providers.md:27-33,134-166`
- `dsh-src/packages/llm/llm-pi-ai/README.md:38,123`
- `dsh-src/packages/core/agent-default-model/README.md:22-33`
- `dsh-src/packages/bundle/base/cordis.patch.yml:90-94`
- `dsh-src/docs/config-catalog.md:2225`
- `dsh-src/docs/cli-help.md:41-42`
- `.skilled/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:89,99`
- `.skilled/skills/cli-external-orchestration/cli-pi/hard-rules.json:28-35`
- `specs/cli-external-orchestration/085-cli-deepseek-harness-creation/001-deep-research/resource-map.md:46-55`

## Assessment

- New information ratio: 0.79 (four fully new findings, three that extend resource-map facts)
- Questions addressed: Angle 2 providers, models, reasoning and roster
- Questions answered: How are providers, models and reasoning levels configured, and can LLM Gateway and OpenCode Go be added as closed, fail-closed routes?

## Reflection

- What worked and why: the provider guide is written for the exact custom-gateway case, and the
  `llm-pi-ai` reference supplies the error-code contract the guide omits. Reading the base bundle
  patch found the default route, which is the missing piece for per-dispatch selection.
- What did not work and why: no route could be exercised, because that needs a credential write.
- What I would do differently: check the base bundle first, since `deepseek-official` explains the
  smoke failure from iteration 1 and would have shortened that diagnosis.

## Recommended Next Focus

Angle 3: profiles, `$DSH_HOME` and repo-local configuration, including what a `.dsh/` runtime folder
must contain and which files can be generated from `.skilled/`.
