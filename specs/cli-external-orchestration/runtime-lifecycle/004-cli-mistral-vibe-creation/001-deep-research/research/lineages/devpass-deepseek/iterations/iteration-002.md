# Iteration 2: providers, models and the subscription

## Focus

Angle 2: how Vibe authenticates, which providers and models a dispatch can pin, how reasoning effort is set, and which usage counter a turn draws on compared with the same model through OpenCode. Scope was kept to source evidence; no key was read and no value was printed.

## Findings

1. A Vibe dispatch has two credential families. The first-party `mistral` provider resolves a browser sign-in (OIDC against `https://console.mistral.ai`) or an API key from `MISTRAL_API_KEY`; any additional `[[providers]]` row is BYOK with its own `api_base` and `api_key_env_var`. First-party code prefers the active provider only when it is a Mistral provider, so a third-party credential never reaches a first-party endpoint. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:137-196] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/_defaults.py:9-19] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/platform_auth/_mistral.py:55-75]

2. Providers are declarative, not a closed list: `ProviderConfig` carries `name`, `api_base`, `api_key_env_var`, browser-auth base URLs, `api_style` (default `openai`), `backend` (`mistral` or `generic`), `project_id`/`region` for Google Vertex ADC, `reasoning_field_name`, `emits_finish_reason` and `extra_headers`. The shipped defaults are only `mistral` and a local `llamacpp` endpoint, so any OpenAI-compatible gateway is a config row. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:137-204] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:200-214]

3. Models are declarative rows too: `name`, `provider`, `alias`, `temperature` (default 0.2), `thinking`, `thinking_levels`, `input_price`/`output_price`/`cached_input_price` per million tokens, `max_context_length`, `auto_compact_threshold`, `supports_images`. Pinning `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash` is therefore a provider row plus a model row each, selected by `--model <alias>`; Vibe compiles in no roster beyond the single default `mistral-medium-3.5` row. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:522-616] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py:216-231]

4. The Mistral-side catalogue is fetched, not shipped: `MODEL_CATALOG_PATH = "/model-catalog"` with surface `vibe-code`, a 5s bounded fetch and a 30-day cache TTL, built from the provider's `api_base`. A dispatch therefore sees whatever the configured Mistral API base advertises, while BYOK providers rely entirely on declared rows. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/model_catalog/_constants.py:1-27]

5. Reasoning effort has no dispatch flag. It is a per-model config field: `thinking` (a `ThinkingLevel`, default `off`) plus the offered `thinking_levels` list, with `thinking_is_set` distinguishing "unset" from "off" and the Mistral backend mapping curated level sets to its own reasoning-effort parameter. A governed executor must therefore pin reasoning through the model row or agent profile, not through the command line. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:551-616] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/llm/reasoning.py:17-62]

6. The usage counter is the org's monthly Vibe Code allowance. `GET /v1/billing/subscription` names the plan and whether pay-as-you-go covers the run past its allowance; `GET /v1/billing/budget` reports `usage_percentage`, `initial_budget`, `reset_at` and `payg_enabled` for the Vibe Code budget. Both are optional and read as `None` on a self-hosted platform or missing permission. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py:1-46]

7. Plan labels are derived from `/whoami`: chat plans map Free/Pro/Student/Team, Mistral Code maps "Free Codestral"/"Code Enterprise", and API plans map "Free API"/"PAYG API". The label is display data; the budget read above is the counter a dispatch actually draws on. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/setup/auth/whoami.py:346-390]

8. Per-dispatch cost is locally computable even without the billing API: `export.json` carries `usage`, `cost_usd`, `steps` and `subagents[].cost_usd`, priced from the model row's per-million rates with cached input billed at `cached_input_price` when set. That gives a governed executor a cost signal per run, independent of the org budget endpoint. [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py:117-160,183-190] [SOURCE: ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py:537-550]

## Ruled Out

- Reading `~/.vibe/config.toml` or any key to confirm the live provider: the directory holds only `trusted_folders.toml`, so there is no local provider state to observe, and reading a key value is out of scope by the angle's own rule.
- Treating the model catalogue as a shipped roster: it is fetched from `/model-catalog` at runtime with a 5s cap and 30-day cache, so an offline install has only declared rows.

## Dead Ends

- Answering the OpenCode-versus-Vibe counter comparison from client code. Both clients send a key to a provider; which internal counter the platform debits is server-side and unobservable locally. Recorded as UNKNOWN with the exact measurement that would settle it.

## Edge Cases

- Ambiguous input: "subscription" could mean the chat plan or the Vibe Code budget. Selected the narrow reading: the budget endpoint that the client reads for Vibe Code usage, with plan labels as display only.
- Contradictory evidence: `--setup` is described as "Setup API key and exit", while the provider defaults also offer browser sign-in. Both are real paths; the install has neither configured, so no live discrimination was possible.
- Missing dependencies: no credential, so the billing read, `/whoami` label and a live model pin could not be observed. Source evidence carried the findings; every live claim is marked unconfirmed.
- Partial success: the provider/model/auth contract is fully answered; the cross-runtime usage-counter comparison is UNKNOWN.

## SCOPE VIOLATIONS

- The read-only capture `vibe config schema </dev/null` (stdout redirected into the lineage `evidence/`) caused the Vibe CLI itself to bootstrap `$VIBE_HOME` and create three files outside the lineage: `~/.vibe/logs/vibe.log` (0 bytes), `~/.vibe/logs/vibe-rs.log` (0 bytes) and `~/.vibe/vibehistory` (12 bytes, "Hello Vibe!"). No credential, key or prompt was written. The files were left in place: deleting them would be a second out-of-scope mutation. This is recorded rather than repaired, and it is a genuine dispatch finding: a governed `cli-mistral-vibe` executor must pin `VIBE_HOME` to a lineage-local directory, as the DSH runner already does with `DSH_HOME`.

## Sources Consulted

- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/models.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/_defaults.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/config/vibe_schema.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/platform_auth/_mistral.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/model_catalog/_constants.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/core/llm/reasoning.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/setup/auth/whoami.py
- ~/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/run_export.py
- specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/devpass-deepseek/evidence/vibe-config-schema.json

## Assessment

- New information ratio: 1.0
- Questions addressed: Which providers, models and authentication paths can a Vibe dispatch use, and which usage counter does a turn draw on?
- Questions answered: Which providers, models and authentication paths can a Vibe dispatch use, and which usage counter does a turn draw on? (Vibe side answered; the OpenCode-counter comparison is UNKNOWN, with the measurement that would settle it recorded below.)

## Reflection

- What worked and why: starting from the config schema and `ProviderConfig`/`ModelConfig` gave the whole model surface in two files, and `_billing.py` answered the counter question directly instead of by inference from marketing copy.
- What did not work and why: looking for a "subscription" flag in the CLI. There is none: the plan is read from the platform, not configured locally.
- What I would do differently: capture `vibe config schema` earlier and query it by definition name; it is the cheapest index to every config field, and it was already on disk from iteration 1's capture.

## Recommended Next Focus

Angle 3: configuration and the repo-local runtime folder. Read the config layer order (`core/config/layers/`), `AGENTS.md`/project-context handling, agent TOML discovery under `~/.vibe/agents/`, and the path resolution module, then state exactly what a repo-root `.vibe/` mirror would contain.
