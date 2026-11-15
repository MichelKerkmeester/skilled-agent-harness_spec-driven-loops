---
title: "Mistral Vibe - Providers and Models"
description: "The first-party mistral provider row, the closed two-alias model roster with its toml rows, the allowed_models close by model name, the catalog result and the billing question."
trigger_phrases:
  - "vibe model roster"
  - "vibe provider row"
  - "vibe allowed_models"
  - "vibe mistral provider"
  - "vibe deepseek-flash alias"
  - "vibe glm-flash alias"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Mistral Vibe - Providers and Models

Open this file to pick the alias for `--model` and to check that a config closes the set. Vibe resolves an alias against a model row, so the row is the model choice and a missing row is a refusal, not a fallback.

---

## 1. OVERVIEW

### Purpose

Records the one provider a Vibe dispatch uses, the two model rows that make up the closed roster, how `allowed_models` closes the selectable set, what the catalog offered without those rows, and what remains unproven about billing.

### When to Use

- Choosing the `--model` alias for a dispatch.
- Checking a config's model rows against the roster.
- Deciding whether a config closes the selectable set.
- Answering where reasoning effort lives, since no flag carries it.

### Evidence Base

| Capture | What it pins | Path |
|---|---|---|
| Model rows | The two rows verbatim | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/scratch/vibe-model-rows.toml` |
| Catalog check | The unknown-model exit, the merged built-in rows, the selectable set | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence/catalog.md` |
| Captured config | The provider row values and the empty `allowed_models` | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/004-vibe-contract-pin/evidence/export.json` |
| Provider and billing contract | The five provider fields, the no-flag reasoning ruling, the billing question | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/research.md` section 4 |
| Config schema | The `allowed_models` semantics | `specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json` |

### Why a Closed Roster

Vibe resolves an alias only against a model row, and its built-in catalog adds rows of its own to every config. The hand-written rows therefore establish the two aliases but do not remove `mistral-medium-3.5`, and `allowed_models` is the key that removes it. The `vibe-closed-roster` rule in [../hard-rules.json](../hard-rules.json) is the gate a dispatch passes.

---

## 2. PROVIDER

One provider serves both roster rows: the first-party `mistral` provider. Its key comes from `MISTRAL_API_KEY`, or from a browser sign-in when no key is set. Vibe already configures it: `export.json` records it under `config.providers` beside `llamacpp`, and the phase's only hand-written config artifact holds model rows (`vibe-model-rows.toml`).

| Field | Meaning | Value |
|---|---|---|
| `api_base` | The endpoint the provider calls | `https://api.mistral.ai/v1` |
| `api_key_env_var` | The environment variable that carries the key | `MISTRAL_API_KEY` |
| `api_style` | The request shape; the default is `openai` | `openai` |
| `backend` | Which client the provider uses, `mistral` or `generic` | `mistral` |
| `reasoning_field_name` | The response field that carries reasoning text | `reasoning_content` |

The five field names are the provider row's shape in `research.md` section 4. The values are the captured `config.providers` block in `.../004-vibe-contract-pin/evidence/export.json`, whose `mistral` row also carries `browser_auth_base_url` `https://console.mistral.ai` for the sign-in path.

The same capture holds one more provider row, `llamacpp`, with `backend` `generic` and an empty `api_key_env_var`. No dispatch uses it, and it is the only row in the capture that shows the `generic` value.

---

## 3. ROSTER

Exactly two aliases. A dispatch names one of them, and anything else is refused before launch.

| Alias | Model id | Provider | Reasoning |
|---|---|---|---|
| `deepseek-flash` | `deepseek-v4-1-flash-1017` | `mistral` | Row `thinking` set to `max` |
| `glm-flash` | `zai-glm-5-3-flash` | `mistral` | Row `thinking` set to `max` |

The rows, verbatim from `.../004-vibe-contract-pin/scratch/vibe-model-rows.toml`:

```toml
active_model = "deepseek-flash"

[[models]]
name = "deepseek-v4-1-flash-1017"
provider = "mistral"
alias = "deepseek-flash"
thinking = "max"

[[models]]
name = "zai-glm-5-3-flash"
provider = "mistral"
alias = "glm-flash"
thinking = "max"
```

The file opens with `active_model = "deepseek-flash"`, and the captured `export.json` records the same value under `config.active_model`.

### Reasoning Effort Has No Flag

No CLI flag sets reasoning effort. It is absent from `vibe --help`, and the research records that absence as merge-verified (`research.md` section 4). The row's `thinking` field is the only place it lives, so the `max` pin is a property of the row and a dispatch cannot raise or lower it on the command line.

The captured `export.json` shows the mechanism: each hand-written row carries `thinking` `max` beside a `thinking_levels` ladder of `off`, `low`, `medium`, `high` and `max`. A row whose `thinking` value is not `max` is off-roster, and an executor that needs the `max` pin rejects an alias whose row does not carry it.

---

## 4. ALLOWED_MODELS

The repository config closes the selectable set to the two roster rows. The list names each row's `name`, not its alias:

```toml
allowed_models = ["deepseek-v4-1-flash-1017", "zai-glm-5-3-flash"]
```

Probe runs settled the semantics (`specs/cli-external-orchestration/runtime-lifecycle/004-cli-mistral-vibe-creation/006-vibe-runtime-folder-and-mirrors/scratch/allowed-models-probe.md`). With the two names, `deepseek-flash` and `glm-flash` both finish and `--model mistral-medium-3.5` exits 1 with `usage_error`. With the two aliases instead, Vibe only warns `Allowed model 'deepseek-flash' matches none of your configured models.` and closes nothing, so `mistral-medium-3.5` still runs. The config schema calls the list "model names/patterns", and an empty list allows every configured model (`.../001-deep-research/research/lineages/mistral-deepseek/evidence/vibe-config-schema.json`). The catalog capture ran with the key empty, and its `export.json` records `allowed_models` as `[]`, so `mistral-medium-3.5` stayed selectable in that run (`.../004-vibe-contract-pin/evidence/catalog.md`).

The proof is a dispatch of `--model mistral-medium-3.5` against the repository's `.vibe/config.toml`, which must end in `outcome` `usage_error`.

The `vibe-closed-roster` rule in [../hard-rules.json](../hard-rules.json) still gates every dispatch, because a dispatch with its own `VIBE_HOME` does not read the repository config unless it runs in a trusted folder.

---

## 5. CATALOG RESULT

A fresh empty `VIBE_HOME` with no `config.toml` offers one model, and neither roster id resolves. Each probe ran `vibe -p "<prompt>" --model <id> --output-dir <dir> </dev/null`:

| Id | Exit | First stderr line |
|---|---|---|
| `deepseek-v4-1-flash-1017` | 1 | `Error: Unknown model: deepseek-v4-1-flash-1017. Available: mistral-medium-3.5` |
| `zai-glm-5-3-flash` | 1 | `Error: Unknown model: zai-glm-5-3-flash. Available: mistral-medium-3.5` |

Both `export.json` records show `outcome` `usage_error`, so a missing row is a usage error and not an infrastructure failure (`.../004-vibe-contract-pin/evidence/catalog.md`).

### Built-in Rows Merge In

A run whose `config.toml` carries the hand-written rows records two more rows in its `export.json` config:

| Row name | Alias | `thinking` | Selectable |
|---|---|---|---|
| `mistral-vibe-cli-latest` | `mistral-medium-3.5` | `high` | Yes, until `allowed_models` closes it |
| `zai-glm-5-3-flash-vibe-free` | `zai-glm-5-3-flash` | `high` | No |

The free GLM row is not selectable even though the export records it. With the repository's rows in place, `--model zai-glm-5-3-flash` exits 1 with `Error: Unknown model: zai-glm-5-3-flash. Available: deepseek-flash, glm-flash, mistral-medium-3.5`. The `Available:` list omits the free row, so it is recorded but not offered for resolution; why is UNKNOWN.

The selectable set in that run is therefore the two hand-written aliases plus `mistral-medium-3.5`, and closing it to the roster takes `allowed_models` (section 4).

---

## 6. DEFAULTS

Vibe is never a default route. DevPass, the LLM Gateway route at `llmgateway/deepseek-v4.1-flash-1017`, stays the default on every runtime, and a Mistral route is named per dispatch. The LLM Gateway row is the one that completed a keyed request on 2026-11-06 (`.skilled/skills/cli-external-orchestration/cli-deepseek-harness/references/providers-and-models.md` section 2).

Nothing in this packet changes a default. The deep-loop executor kind is phase 009's, and this reference only fixes which aliases a named Vibe dispatch may carry.

---

## 7. BILLING

Whether a Vibe turn draws on the same Mistral usage pool as an API turn is UNKNOWN. Vibe reads the plan's Vibe Code allowance from `/v1/billing/budget` and the plan from `/v1/billing/subscription`, and Mistral's docs describe one pool shared across Studio, the API and Vibe Code. The two research lineages disagreed on whether a key-based turn draws on that allowance, and the merge kept the question open (`research.md` section 4).

The settling check is a budget read before and after one identical turn per client, and no run in this repository has made it. Until one does, no cost claim may combine a Vibe turn with an API turn.

---

## 8. RELATED

- [cli-reference.md](./cli-reference.md) - the flag set, `--model` resolution, the four budgets and the exit taxonomy.
- [runtime-folder-and-sync.md](./runtime-folder-and-sync.md) - the `.vibe/` config that carries these rows and the close.
- [../hard-rules.json](../hard-rules.json) - the `vibe-closed-roster` rule a dispatch must pass.
