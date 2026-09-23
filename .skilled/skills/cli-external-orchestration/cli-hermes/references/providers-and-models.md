---
title: cli-hermes Providers, Models & Invocation
description: The per-mode catalog of the one fan-out provider (llmgateway), its operator-side configuration contract, the seven-id closed roster, and the reasoning-level lever reachable through cli-hermes.
trigger_phrases:
  - "hermes providers and models"
  - "which model for hermes dispatch"
  - "hermes llmgateway provider"
  - "hermes reasoning level"
  - "hermes roster"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

The single catalog of the provider, the model ids, the reasoning lever and the dispatch shape the cli-hermes mode can reach. Hermes is a multi-provider pass-through with a catalog of some forty providers; this mode deliberately reaches one of them.

---

## 1. OVERVIEW

### Core Principle

One place to answer "which provider, which model, which effort, how to dispatch" for cli-hermes. The roster is closed at seven ids so generic provider routing cannot broaden dispatch, and the provider is the one whose credential the operator already holds for the other runtimes.

### When to Use

- Choosing the `--provider` and `--model` pair for a `hermes chat` dispatch.
- Mapping a reasoning effort onto `--reasoning`.
- Configuring, as the operator, the provider block Hermes needs.

---

## 2. THE PROVIDER CONTRACT

Hermes resolves `--provider NAME` against its built-in providers or a user-defined block under `providers:` in `~/.hermes/config.yaml`. The LLM Gateway (DevPass) is not a built-in, so the operator declares it. The packet pins the block's name and key variable, because the runtime's builder passes `--provider llmgateway` and its env allowlist passes the `LLMGATEWAY_` prefix:

```yaml
providers:
  llmgateway:
    base_url: https://api.llmgateway.io/v1
    key_env: LLMGATEWAY_API_KEY
```

The key itself lives in `~/.hermes/.env` or the shell; it never appears in a prompt, a repo file, or this packet. This is an operator step: no dispatch, plugin or repo file writes it. The field names were confirmed live on 2026-09-14 (`hermes config set providers.llmgateway.base_url ...` and `.key_env`); the shape above follows Hermes's `custom` provider convention (source-read: `cli-config.yaml.example`, `hermes_cli/config_providers.py`).

Other credential kinds on this machine do not transfer: Hermes keeps its own OAuth sessions in `~/.hermes/auth.json`, and its Codex import reads `~/.codex/auth.json` once at login rather than sharing it. A Codex OAuth import is a possible second provider later; it is not on this roster.

---

## 3. THE ROSTER

| Model id | Provider | Reasoning | Standing | Notes |
|---|---|---|---|---|
| `deepseek-v4.1-flash` | `llmgateway` | pinned `max` | **observed 2026-09-14**: smoke exit 0, fan-out lineage dispatched | The rotation default; the same literal cli-pi dispatches through DevPass |
| `glm-5.3-flash` | `llmgateway` | pinned `max` | **observed 2026-09-14**: smoke exit 0 at `max` and `none` | The second lens; flat-price on DevPass |
| `gpt-6-luna` | `llmgateway` | the caller's effort | **probed live 2026-09-23**, a one-turn smoke that replied `OK`; catalog-listed the same day in `/v1/models` (1.05M context, 128K output, efforts `none` to `max`) | In `HERMES_SUPPORTED_MODELS` and its fan-out mirror |
| `gpt-6-sol` | `llmgateway` | the caller's effort | **catalog-listed 2026-09-23** in `/v1/models` (1.05M context, 128K output, efforts `none` to `max`); live probe pending | In `HERMES_SUPPORTED_MODELS` and its fan-out mirror |
| `minimax-m3` | `llmgateway` | the caller's effort | probed live on this route, per `SKILL.md` | In `HERMES_SUPPORTED_MODELS` and its fan-out mirror |
| `mimo-v2.6-pro` | `llmgateway` | the caller's effort | probed live on this route, per `SKILL.md` | In `HERMES_SUPPORTED_MODELS` and its fan-out mirror |
| `qwen3.8-max` | `llmgateway` | the caller's effort | probed live on this route, per `SKILL.md` | In `HERMES_SUPPORTED_MODELS` and its fan-out mirror |

Every id is a bare gateway literal. A provider-prefixed form (`llmgateway/deepseek-v4.1-flash`) is Pi's selector shape, not Hermes's, and the fan-out rejects it. Enforcement: `HERMES_SUPPORTED_MODELS` and `isHermesModelAllowed` in `executor-config.ts`, byte-mirrored as `HERMES_ALLOWED_MODELS` in `fanout-run.cjs`; no `auto` default exists.

To add a model: amend the packet's spec (`071-cli-hermes-creation`), then `HERMES_SUPPORTED_MODELS`, its mirror, this table and the changelog, in that order.

---

## 4. REASONING LEVELS

`--reasoning` accepts `none minimal low medium high xhigh max ultra`, the same set as the runtime's `REASONING_EFFORTS`, so the builder forwards the effort without a map. Both roster models are Flash-family reasoning models the runtime pins to `max` (`isFlashMaxPinnedModel`); a lower requested effort never reaches Hermes from the fan-out. A direct dispatch may pass any level; observed 2026-09-14 through the gateway:

| Model | Level | Result |
|---|---|---|
| `glm-5.3-flash` | `max` | exit 0, `OK`, 17 s |
| `glm-5.3-flash` | `none` | exit 0, `OK`, 17 s |
| `deepseek-v4.1-flash` | `low` | exit 0, `OK`, 21 s |
| `deepseek-v4.1-flash` | `ultra` | exit 0, `OK`, 24 s |

No level was refused. Exit 0 shows the gateway accepted the level, not that the model honored it; `minimal`, `medium`, `high` and `xhigh` were not sent.

---

## 5. INVOCATION

```bash
hermes chat -Q --oneshot --query-file <prompt.md> --provider llmgateway --model deepseek-v4.1-flash \
  --reasoning max --ignore-rules --source tool --max-turns 200 --run-budget 840 \
  -t terminal,file,skills,todo,web --yolo --in "$PWD" </dev/null
```

Fan-out: `--executor=cli-hermes --model=glm-5.3-flash` on `/deep:research` or `/deep:review`; the runtime builds the command.

---

## 6. WHEN THE PROVIDER IS MISSING

`hermes config get providers.llmgateway.base_url` prints nothing (`hermes status` shows `Model: (not set)` and `Provider: Auto` even when the block exists, so it is not the probe), and a dispatch exits 1 with `No inference provider configured. Run 'hermes model' ...` on stdout (observed 2026-09-14). Stop and hand the provider step to the operator; do not run `hermes model` or `hermes setup` from a dispatch.
