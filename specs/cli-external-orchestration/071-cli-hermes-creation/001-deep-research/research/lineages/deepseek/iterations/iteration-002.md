# Iteration 2: Angle 2 — Providers, models and reasoning

## Focus

Which providers Hermes v0.21.1 supports, how a custom OpenAI-compatible endpoint is
configured, which of the repo's routed models Hermes can reach with the credential kinds
already on this machine (key names only, values never), how `--reasoning` maps per provider,
and what a fail-closed `HERMES_SUPPORTED_MODELS` roster should contain.

## Actions Taken

- Read `hermes_cli/models_catalog_static.py` lines 312-360: `CANONICAL_PROVIDERS` (45+
  providers) and plugin auto-extension.
- Read `hermes_cli/providers.py` lines 100-135: `ProviderDef` (transport
  openai_chat/anthropic_messages/codex_responses, `api_key_env_vars`, `base_url_env_var`) and
  the alias table (`deepseek`, `zai`, `xiaomi`/mimo, `minimax-cn`, `xai`, `anthropic`,
  `github-copilot`, `custom`, `local`/vllm/llamacpp).
- Read `hermes_cli/runtime_provider_custom.py` lines 1-128 and `hermes_cli/config_providers.py`
  lines 60-201: `providers:` config-map handling (`base_url`/`url`/`api`, `api_key` or
  `key_env`/`api_key_env`, `default_model`, `models:` capabilities, camelCase auto-mapping).
- Read `hermes_cli/models_reasoning_caps.py` lines 1-80: tri-state reasoning caps from
  OpenRouter/Nous `/v1/models` catalogs (`supports_reasoning`, `supported_efforts`,
  `mandatory`), disk mirror at `~/.hermes/cache/reasoning_caps.json`.
- Read `hermes_cli/auth_codex.py` lines 1-77: Codex OAuth token store at `~/.hermes/auth.json`,
  explicitly NOT `~/.codex/`.
- Ran `hermes status` (exit 0) and `hermes config show` (exit 0): live credential inventory —
  Model not set, Provider Auto, every listed API key `✗ (not set)`.
- Listed key names in `~/.hermes/.env` (values never read): only debug/timeout settings
  (BROWSERBASE_*, TERMINAL_*, *_TOOLS_DEBUG, etc.) — no provider credentials.
- Read the repo's model routing: `PI_SUPPORTED_MODELS` + `PI_MODEL_PROVIDERS`
  (executor-config.ts:182-215; fanout-run.cjs:2471-2502), cli-devin providers-and-models
  (deepseek-v4-flash-max, glm-5-2*, gpt-5-6-luna*, swe-2*), cli-pi and cli-opencode
  providers-and-models (llmgateway/DevPass details, openai-codex, minimax, xiaomi,
  opencode-go).

## Findings

1. **Hermes's provider universe is broad and mostly API-key-based.** `CANONICAL_PROVIDERS`
   (models_catalog_static.py:312-352) includes `deepseek`, `zai` (GLM), `xiaomi` (MiMo),
   `minimax`/`minimax-oauth`/`minimax-cn`, `xai`/`xai-oauth` (Grok), `openai-codex` (ChatGPT
   subscription OAuth), `openai-api`, `anthropic`, `gemini`, `openrouter`, `nous`,
   `ai-gateway` (Vercel), `azure-foundry`, `lmstudio`, `ollama-cloud`, `custom`, `local`
   (vllm/llamacpp), plus plugin auto-extension for `providers/` plugins. Transports are
   `openai_chat | anthropic_messages | codex_responses` (providers.py:103-105).
   [SOURCE: hermes_cli/models_catalog_static.py:312-352; hermes_cli/providers.py:100-110]

2. **The machine's Hermes install has ZERO configured provider credentials today.** Live
   `hermes status` (2026-09-14, exit 0) shows Model `(not set)`, Provider `Auto`, and every
   listed API key `✗ (not set)`; `~/.hermes/.env` key-name inventory contains only
   debug/timeout settings (BROWSERBASE_*, TERMINAL_*, *_TOOLS_DEBUG, VISION/IMAGE/MOA/WEB
   toggles), no provider keys. `~/.hermes/config.yaml` has only `plugins.enabled:
   [orca-status]`. Therefore no smoke dispatch is permitted under the research rules of
   engagement (provider must be configured), and any dispatch today would fail auth.
   [SOURCE: live `hermes status`/`hermes config show` output, 2026-09-14; key-name inventory
   of `~/.hermes/.env`; ~/.hermes/config.yaml]

3. **The one directly portable credential kind is `LLMGATEWAY_API_KEY` (DevPass / LLM
   Gateway).** The repo's cli-pi route documents it as an env var exported in `~/.zshenv`
   (`${LLMGATEWAY_API_KEY}`, base `https://api.llmgateway.io/v1`, OpenAI-compatible;
   cli-pi providers-and-models.md:99-105). Hermes's `custom` provider accepts exactly this
   shape: a `providers:` entry with `base_url`, `key_env: LLMGATEWAY_API_KEY`, and
   `default_model` (runtime_provider_custom.py:110-128; config_providers.py:117-124). No new
   credential is needed — only a config edit in a later phase.
   [SOURCE: .opencode/skills/cli-external-orchestration/cli-pi/references/providers-and-models.md:99-105;
   hermes_cli/runtime_provider_custom.py:110-128]

4. **Other repo-routed models are NOT portable without Hermes-side credentials.** Codex OAuth
   tokens live in `~/.hermes/auth.json`, "NOT ~/.codex/: Hermes keeps its own Codex OAuth
   session separate from the Codex CLI / VS Code extension" (auth_codex.py:3-4) — the
   machine's existing Codex OAuth (pi/opencode/codex) does not transfer. MiniMax M3, MiMo,
   Grok and opencode-go credentials live inside pi's auth store
   (`~/.pi/agent/auth.json` + `models-store.json`), which pi itself documents other tools do
   not read ("pi does not read opencode's auth store" — cli-pi providers-and-models.md:105).
   Only env-var-keyed credentials are portable into `~/.hermes/.env`.
   [SOURCE: hermes_cli/auth_codex.py:3-4; cli-pi providers-and-models.md:99-105]

5. **Reasoning levels and caps.** `--reasoning` accepts `none|minimal|low|medium|high|xhigh|
   max|ultra` (live help). Per-model capability is a tri-state from OpenRouter/Nous
   `/v1/models` catalogs (supports_reasoning True/False/None + supported_efforts + mandatory),
   cached to `~/.hermes/cache/reasoning_caps.json` (models_reasoning_caps.py:20-80). For the
   llmgateway custom route, whether Hermes's effort names map to the gateway's accepted names
   (`low`/`high`/`max` for deepseek-v4.1-flash; full ladder incl. `xhigh`/`max` for
   glm-5.3-flash — cli-pi providers-and-models.md:113-114) is `documented, unconfirmed`: the
   same mapping problem the repo solved for pi with `REASONING_TO_PI_THINKING`
   (fanout-run.cjs:2504-2516), so a Hermes-side effort map (`HERMES_REASONING_TO_GATEWAY`)
   will likely be needed and must be live-pinned.
   [SOURCE: hermes_cli/models_reasoning_caps.py:20-80; fanout-run.cjs:2504-2516; cli-pi
   providers-and-models.md:113-114]

6. **Proposed fail-closed `HERMES_SUPPORTED_MODELS` roster** (mirroring
   `PI_SUPPORTED_MODELS`, executor-config.ts:182-215): start with exactly the two DevPass
   models reachable via a `custom` provider — `deepseek-v4.1-flash` (reasoning + images,
   effort pin `max`) and `glm-5.3-flash` (effort pin `max`) — as a two-segment
   `llmgateway/<id>` selector. Everything else stays OFF-ROSTER until its credential is
   configured in `~/.hermes/.env` and the route is live-pinned, matching the repo's
   closed-roster discipline ("A provider's live catalog is not a roster").
   [SOURCE: executor-config.ts:182-215; cli-pi providers-and-models.md:17-24]

## Questions Answered

- Q2 (providers/models/reasoning): answered with the evidence above. Hermes reaches the LLM
  Gateway today (credential already on machine); everything else requires new Hermes-side
  credentials. A minimal fail-closed roster = the two DevPass models.

## Questions Remaining

- Q3-Q10 (see strategy). Follow-up within Q2, deferred: whether `hermes model --help`
  exposes per-provider reasoning overrides usable at dispatch time (Angle 8 touches this).

## Assessment

- newInfoRatio: 0.80 — high novelty (live credential inventory, auth isolation, portability
  mapping are all new); the reasoning-name mapping for the custom route is
  `documented, unconfirmed` and needs a live pin.
- Confidence: high on credential facts (live commands + source); medium on reasoning-name
  passthrough behavior.

## Reflection

- What worked: key-name-only `.env` inventory + `hermes status` gave a definitive credential
  picture; mapping the repo's six-runtime model routing onto Hermes's `CANONICAL_PROVIDERS`
  turned "which models" into a concrete portability question.
- What failed / ruled out: ruling out credential portability from pi/opencode auth stores
  (documented non-portable); ruling out Codex OAuth reuse (Hermes keeps its own session).
- Ruled-out direction: assuming `hermes auth` sessions transfer between runtimes — they do
  not; each runtime's OAuth store is isolated.

## Recommended Next Focus

Angle 3: the repo-root `.hermes/` folder and instruction files (`agent/coding_context.py`,
`agent/prompt_builder.py` AGENTS.md/SOUL.md loaders, `agent/skill_utils.py`
`PROJECT_SKILLS_SUBDIRS`, `tools/skills_tool.py` quarantine, `tools/skills_guard.py` static
scan; symlinked skill tree behavior; what must live at repo root vs `~/.hermes`).
