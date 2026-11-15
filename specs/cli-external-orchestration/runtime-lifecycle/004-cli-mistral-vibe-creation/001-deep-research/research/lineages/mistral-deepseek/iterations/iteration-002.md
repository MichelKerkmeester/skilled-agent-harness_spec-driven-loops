# Iteration 2: Angle 2 — providers, models and the subscription

## Focus

How Vibe authenticates (browser sign-in to the Mistral plan, a key from Code > Vibe CLI, or a bring-your-own key), whether a dispatch can pin `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`, how reasoning effort is set, and which usage counter a Vibe turn draws on compared with the same model through OpenCode on the same key.

Secondary: the reducer carried forward one open question from iteration 1 — whether a denied tool call changes the process exit code. Answered here because it belongs to the same launch surface.

## Actions Taken

1. Read the auth resolution order in `utils/api_keys.py`.
2. Read the config schema's `ProviderConfig`, `ModelConfig`, `allowed_models`, `thinking`/`thinking_levels` and `active_model` from the captured `evidence/vibe-config-schema.json`.
3. Read the billing/account read path (`app_server/_billing.py`, `_account.py`) for the usage counters.
4. Read the outside-workdir refusal path (`app_server/_unified_permissions.py`) to close the denied-tool question.
5. Confirmed there is no `--reasoning-effort` CLI flag by scanning the Rust binary's flag table and the Python `reasoning_effort` call sites.

## Findings

1. Authentication resolves in a fixed order: the run's session credential, then the provider's environment variable, then the OS keyring, then the CLI OIDC session. The live smoke in iteration 1 exercised the keyring step and then failed on the environment variable, which matches this order. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/utils/api_keys.py:14-24]

2. A provider is a first-class config object: `name`, `api_base`, `api_key_env_var`, `api_style` (default `openai`), `backend` (`mistral` or `generic`), `reasoning_field_name` (default `reasoning_content`), plus browser-auth URLs and extra headers. Bring-your-own endpoint and key are supported by configuration, not by a plugin. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

3. Models are a name-keyed map of `ModelConfig` (`provider`, `alias`, `thinking`, `temperature`, `max_output_tokens`, `input_price`, `output_price`, `cached_input_price`), with `active_model` selecting the default. An arbitrary model id such as `deepseek-v4-1-flash-1017` or `zai-glm-5-3-flash` is therefore pinnable only by adding a provider and a model entry that names it — the built-in Mistral catalog will not contain those ids. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

4. `allowed_models` is the closed roster a governed mode needs: an explicit list of names or patterns, glob (`mistral-*`) or regex with a `re:` prefix, where an empty list allows every configured model. [SOURCE: specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json]

5. Reasoning effort is a six-level ladder — `off`, `low`, `medium`, `high`, `xhigh`, `max` — but it is **not** a headless CLI flag. It is set per session through the app-server (`reasoning_effort` on session start, or a model write) or statically through a model's `thinking` / `thinking_levels` config. A CLI-only dispatch can therefore pin the level only by config, not by flag. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py:478]

6. Two usage counters exist and they are different things: the Mistral plan's monthly Vibe Code allowance with an optional pay-as-you-go overflow (`billing/subscription`, `billing/budget`, read with a 3 s timeout and tolerated as absent), and ordinary per-token API billing via each model's `input_price` / `output_price` / `cached_input_price`. A key-based dispatch draws on the API counter; a signed-in plan dispatch draws on the allowance first. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py:1-8]

7. A denied tool call does not change the process exit code: the outside-workdir refusal is returned to the model as a tool error "so the turn keeps going". A run that finishes after a denial still exits 0. [SOURCE: /Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_unified_permissions.py:371-380]

## Ruled Out

- Looking for a `--reasoning-effort` flag: the Rust flag table has no such flag, and every Python `reasoning_effort` call site is protocol- or config-level. The flag does not exist in 3.1.2.
- Assuming the built-in catalog can name an OpenCode model id: the catalog is Mistral's, so a foreign id needs a provider entry.

## Dead Ends

- Comparing the actual usage counter for the *same* model on the *same* key across Vibe and OpenCode. That needs an authenticated dispatch on both runtimes and a billing read, which is out of budget and would consume the operator's quota. Left as an explicit open question for a later phase.

## Edge Cases

- Ambiguous input: "which usage counter" could mean the plan allowance or the API bill. Answered both and separated them by auth mode.
- Contradictory evidence: the reducer set `Next Focus` to the iteration-1 denied-tool question, while the dispatch contract fixes one angle per iteration in angle order. Resolved by answering the carried question inside this iteration and continuing with Angle 2; the angle order is the dispatch-bound instruction and outranks reducer prose.
- Missing dependencies: no credential, so no authenticated counter comparison. Fallback: the billing and pricing code paths are readable and definitive about *which* counter each path touches.
- Partial success: auth order, provider/model config, roster, reasoning ladder and denial semantics are confirmed; the live counter comparison is not. Status `complete` for the angle as scoped.

## Sources Consulted

- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/utils/api_keys.py`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_billing.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_account.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/_unified_permissions.py`
- `/Users/michelkerkmeester/.local/share/uv/tools/mistral-vibe/lib/python3.12/site-packages/vibe/app_server/protocol.py`
- `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/evidence/vibe-help.txt`

## Questions Answered

- How does Vibe authenticate, can a dispatch pin `deepseek-v4-1-flash-1017` and `zai-glm-5-3-flash`, how is reasoning effort set, and which usage counter does a turn draw on? — Answered, with the live counter comparison left open.
- Carried from iteration 1: does a denied tool call change the exit code? — No.

## Questions Remaining

- The real counter delta for one identical model on one identical key across Vibe and OpenCode.

## Assessment

- New information ratio: 1.0
- Questions addressed: Angle 2 (providers, models, subscription); the carried denied-tool question
- Questions answered: 2 of 8 strategy key questions

## Reflection

- What worked and why: reading the config JSON schema instead of the docs. `vibe config schema` emits the complete typed surface — provider fields, the `allowed_models` glob/regex semantics, the thinking ladder — which no help screen exposes and which is authoritative because it is generated from the model.
- What did not work and why: searching for a reasoning-effort flag. The absence is itself the finding, but it cost two calls to establish because an absence has to be proven twice (binary flag table and Python call sites).
- What I would do differently: capture `vibe config schema` once at the start of the run and query it for every angle, rather than re-deriving config facts per iteration.

## Recommended Next Focus

Angle 3: configuration and the repo-local runtime folder — what Vibe reads from the working directory and from `~/.vibe/`, what a repo-root `.vibe/` would contain, and which parts should be generated mirrors of `.skilled/` sources. The schema already names `agent_paths`, `skill_paths`, `enabled_plugins` and `project_context`, which are the entries that angle must resolve to concrete directory layouts.
