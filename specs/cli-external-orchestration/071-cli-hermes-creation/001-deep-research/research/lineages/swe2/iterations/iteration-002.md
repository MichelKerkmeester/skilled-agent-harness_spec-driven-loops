---
title: "Iteration 2: Hermes providers, models and reasoning (Angle 2)"
trigger_phrases: []
---
# Iteration 2: Providers, models and reasoning

## Focus
Angle 2 — which providers Hermes supports, how a custom OpenAI-compatible endpoint is configured, which of this repo's routed models Hermes can reach with the credential kinds on this machine, how `--reasoning` maps per provider, and what a closed `HERMES_SUPPORTED_MODELS` roster would look like.

## Actions Taken
- Read `hermes_cli/models_catalog_static.py:312-403` — `CANONICAL_PROVIDERS` (40+ slugs) + `PROVIDER_GROUPS` display grouping.
- Read `hermes_cli/provider_catalog.py:23-115` — `auth_type` taxonomy (`api_key | oauth_* | external_process | copilot | aws_sdk | vertex`) and env-var derivation from `PROVIDER_REGISTRY`.
- Read `hermes_cli/auth.py:160-270` — `PROVIDER_REGISTRY` rows with inference base URLs and per-provider `api_key_env_vars`.
- Read `hermes_cli/auth_codex.py:3, 84-177` — Codex OAuth tokens live in `~/.hermes/auth.json` (NOT `~/.codex/`), with `_recover_codex_tokens_from_cli` / `_import_codex_cli_tokens` fallback.
- Read `hermes_cli/models_reasoning_caps.py:1-119` — reasoning-capability catalog contract.
- Ran `hermes model --help </dev/null>` live (exit 0) — the picker is interactive-only; no `--list`.
- Read `cli-config.yaml.example` provider/`providers:` blocks (`base_url`, `api_key` `${ENV}` interpolation, `api_mode`, `key_env`, `default_headers`, Databricks/meta.ai/Ramp worked examples).
- Verified `~/.codex/auth.json` exists (Codex CLI is authenticated on this machine).

## Findings

### F1. The provider universe is ~40 canonical slugs plus plugins and `custom`
`CANONICAL_PROVIDERS` (models_catalog_static.py:312-352): `nous, fireworks, openrouter, moa, novita, lmstudio, anthropic, openai-codex, openai-api, alibaba (+alibaba-cn/coding-plan/token-plan variants), xai-oauth, xiaomi, tencent-tokenhub, tencent-tokenplan, nvidia, copilot, copilot-acp, huggingface, gemini, vertex, deepseek, xai, zai, kimi-coding, kimi-coding-cn, stepfun, minimax, minimax-oauth, minimax-cn, ollama-cloud, arcee, gmi, kilocode, opencode-zen, opencode-go, opencode-free, bedrock, azure-foundry, ai-gateway, qwen-oauth` — auto-extended by `plugins/model-providers/<name>/`, plus the `custom` special case (aliases `ollama|vllm|llamacpp`). This is broader than the `cli-config.yaml.example` comment list the resource map captured. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/models_catalog_static.py:312-403; auth.py:160-270]

### F2. Credential kinds and env vars are registry-declared per provider
Each provider declares `auth_type` + `api_key_env_vars` + `base_url_env_var` in `PROVIDER_REGISTRY` (auth.py:172-257). Examples relevant to this repo's routed models: `deepseek` → `DEEPSEEK_API_KEY` @ `api.deepseek.com/v1`; `zai` → `GLM_API_KEY|ZAI_API_KEY|Z_AI_API_KEY` @ `api.z.ai/api/paas/v4`; `minimax` → `MINIMAX_API_KEY` @ `api.minimax.io/anthropic` (Anthropic-Messages shape); `xiaomi` → `XIAOMI_API_KEY` @ `api.xiaomimimo.com/v1`; `xai` → `XAI_API_KEY` @ `api.x.ai/v1`; `openai-codex` → `oauth_external` @ Codex backend; `anthropic` → `ANTHROPIC_API_KEY|ANTHROPIC_TOKEN|CLAUDE_CODE_OAUTH_TOKEN` (the OAuth token routes by prefix down the OAuth path). [SOURCE: ~/.hermes/hermes-agent/hermes_cli/auth.py:172-257]

### F3. `openai-codex` can recover tokens from the Codex CLI's own auth store
Codex OAuth tokens normally live in `~/.hermes/auth.json` ("NOT ~/.codex/"), but `_recover_codex_tokens_from_cli` → `_import_codex_cli_tokens()` imports the Codex CLI's `~/.codex/auth.json` when Hermes's store is empty. `~/.codex/auth.json` EXISTS on this machine, so the OpenAI-Codex path is the **one provider that could come up without new secrets** — though `hermes status` still reported "not logged in" (the import is lazy, fired on credential resolution, not on status display). Whether import fires unattended on a `-z` run is UNKNOWN pending a contract pin. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/auth_codex.py:3, 84-100, 168-177; `hermes status` 2026-09-14; `ls ~/.codex/auth.json`]

### F4. `custom` / `providers:` entries give arbitrary OpenAI-compatible endpoints
`config.yaml` accepts `providers.<name>.{base_url, api_key, api_mode, key_env, default_headers, models}`; `api_key` supports `${ENV_VAR}` interpolation; aliases `ollama/vllm/llamacpp` map to `custom`. This is the clean route to the repo's LLM Gateway (DeepSeek V4.1 Flash) — a named provider entry pointing at the gateway's OpenAI-compatible URL, no Hermes code needed. It also means a `cli-hermes` packet could ship a `providers:` template with roster-scoped entries. [SOURCE: ~/.hermes/hermes-agent/cli-config.yaml.example:73-215; hermes_cli/config_providers.py:73-107]

### F5. `hermes model` is interactive-only; `opencode-free` is a zero-credential tier
`hermes model` has no `--list`/non-interactive roster dump — it is a curses picker (`--refresh` re-fetches every provider's live `/v1/models`). `opencode-free` (opencode.ai/zen/v1) is served anonymously with deliberately no `api_key_env_vars`, selectable via `hermes model`/`/model free` — the only zero-credential inference path, but choosing it requires an interactive selection or a known free model slug, so it does not satisfy the smoke-dispatch precondition (no configured provider/model). [SOURCE: `hermes model --help` live 2026-09-14; ~/.hermes/hermes-agent/hermes_cli/auth.py:236-238]

### F6. Reasoning is an 8-level flag mapped per-model via catalog caps
`--reasoning {none,minimal,low,medium,high,xhigh,max,ultra}` overrides `agent.reasoning_effort` per run (per-model overrides live under `agent.reasoning_overrides`). Whether a route accepts reasoning controls is resolved from OpenRouter-schema `/v1/models` catalog metadata (`supported_parameters` contains `reasoning`; optional `supported_efforts`/`mandatory`), disk-cached 24h at `~/.hermes/cache/reasoning_caps.json`, tri-state: True / False (definitive no) / None (unknown). A `--reasoning` value outside a model's `supported_efforts` is a catalog-visible mismatch. [SOURCE: ~/.hermes/hermes-agent/hermes_cli/models_reasoning_caps.py:1-119; `hermes chat --help` 2026-09-14]

### F7. Reachability verdict for this repo's routed models
|| Repo model | Hermes route | Credential needed | On this machine |
||-----------|--------------|-------------------|------------------|
|| DeepSeek V4.1 Flash (LLM Gateway) | `deepseek` or `providers.<gw>` custom entry | DEEPSEEK_API_KEY or gateway key | Not present |
|| GLM 5.3 Flash | `zai` | GLM_API_KEY/ZAI_API_KEY | Not present |
|| GPT-5.6 (Codex OAuth) | `openai-codex` | Codex OAuth — recoverable from `~/.codex/auth.json` | **Plausible (import path exists)** |
|| MiniMax M3 | `minimax`/`minimax-oauth`/`minimax-cn` | MINIMAX_API_KEY or OAuth | Not present |
|| MiMo | `xiaomi` | XIAOMI_API_KEY | Not present |
|| Grok | `xai`/`xai-oauth` | XAI_API_KEY or SuperGrok OAuth | Not present |
|| SWE-2 | none — Cognition-internal, served only through `devin` | — | Unreachable by design |

A closed `HERMES_SUPPORTED_MODELS` roster mirrors `PI_SUPPORTED_MODELS`: explicit `provider/model` slugs (`--model` accepts `anthropic/claude-sonnet-4` form), fail-closed `isHermesModelAllowed()` gate, plus a credential-presence check keyed to `api_key_env_vars`/OAuth state — Hermes already knows which env var each provider wants, so the gate can name the missing credential instead of failing at dispatch. [SOURCE: table per PROVIDER_REGISTRY + this repo's routed-model list from `executor-config.ts` DEVIN/PI model tables via resource-map §7]

### F8. `copilot-acp` proves sibling-CLI-as-provider is a first-class shape
`copilot-acp` has `auth_type: external_process` and spawns `copilot --acp --stdio` — Hermes's provider layer natively supports a provider that is a subprocess CLI speaking ACP. This is the shape a hypothetical `devin acp` provider would take (Devin ships `devin acp` stdio JSON-RPC). [SOURCE: ~/.hermes/hermes-agent/hermes_cli/auth.py:189-191; models_catalog_static.py:329; resource-map §6 `devin acp` note]

## Questions Answered
- Angle 2 core: provider universe (40+ slugs + plugins + `custom`), credential kinds per provider, custom-endpoint config shape, reasoning flag mapping, and the reachable-roster table are resolved. The ONLY repo-routed model plausibly reachable today is GPT-5.x through `openai-codex` via Codex-CLI token import.

## Questions Remaining
- Whether `_import_codex_cli_tokens` fires unattended inside a `-z` run or requires `hermes auth` once (UNKNOWN — needs the live contract pin; reading `resolve_codex_runtime_credentials` callers would narrow it).
- Whether the repo's LLM Gateway is OpenAI-compatible at the path a `providers.<gw>` entry would need (UNKNOWN — repo-side check, not Hermes-side).
- Whether `opencode-free` exposes a fixed model slug usable with `-z --provider opencode-free --model <slug>` without an interactive pick (UNKNOWN).

## Dead Ends
- Looking for a non-interactive model roster dump: `hermes model` is picker-only; there is no `--list-models` equivalent. Roster must come from `models_catalog_static.py` + per-provider `/v1/models` cache files, not a CLI command.

## Ruled Out
- **SWE-2 through Hermes** — no provider reaches Devin's internal model; SWE-2 stays exclusive to the `cli-devin` executor.
- **"Hermes reuses `~/.codex` directly"** — it does NOT; it keeps its own `~/.hermes/auth.json` and imports from the Codex CLI store as a recovery path (auth_codex.py:3, 168-177).

## Reflection
What worked: the registry is declarative — one read produced every provider's env vars, auth type, and base URL. What failed: `hermes model` cannot dump a roster non-interactively; the smoke precondition still unmet so nothing was live-verified end-to-end. Negative knowledge: `hermes status`'s "not logged in" for Codex does not prove the import path fails — the import is lazy and status may not trigger it.

## Assessment
- newInfoRatio: 0.90
- Novelty justification: Provider catalog, per-provider env vars, Codex-CLI import path, `providers:` custom-endpoint shape, reasoning caps tri-state, and the reachability table are new; the zero-credential baseline carried over from iteration 1.
- Confidence: high on registry facts (source); medium on whether Codex import fires unattended (documented, unconfirmed).

## Recommended Next Focus
Angle 8 — deep-loop fan-out fitness: map what `buildHermesLineageCommand` needs against `executor-config.ts`/`executor-audit.ts`/`fanout-run.cjs` — write-permitting flags, isolation (`HERMES_HOME`/profiles/`--worktree`), env passthrough, self-invocation signal, exit-code trust, and out-of-repo writes.

## SCOPE VIOLATIONS
None.
