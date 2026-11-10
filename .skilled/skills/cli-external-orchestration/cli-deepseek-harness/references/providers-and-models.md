---
title: "DeepSeek Harness - Providers and Models"
description: "The closed two-route roster for dsh dispatch, each route's patch and key variable, and the evidence-backed status of both routes."
trigger_phrases:
  - "dsh model roster"
  - "dsh route patch"
  - "dsh llm gateway route"
  - "dsh opencode go route"
  - "deepseek harness providers"
importance_tier: important
contextType: implementation
version: 1.0.2.0
---

# DeepSeek Harness - Providers and Models

Open this file to pick the route patch for a dispatch. The harness, not the caller, selects the model, so the route patch is the model choice.

---

## 1. OVERVIEW

### Purpose

Records the only two routes a dsh dispatch may use, how each one is composed and which of its claims a keyed run still has to prove.

### When to Use

- Choosing the route patch for a dispatch.
- Checking that a command or patch names a roster model.
- Adding or changing a route.

### Why a Closed Roster

dsh has no `model` or `provider` option in headless (see [cli-reference.md](./cli-reference.md) section 3). The model comes from the `agent-default-model` row, and a `--patch` replaces that row. dsh does not check that a patched model id is in any catalog, so this packet and the dispatch preflight enforce the roster, under the `closed-roster` hard rule.

---

## 2. ROSTER

Exactly two routes. Anything else is refused before launch.

| Route | Provider id | Model id | Protocol | Base URL | Key variable | Route patch | Status |
|---|---|---|---|---|---|---|---|
| LLM Gateway | `llmgateway` | `deepseek-v4.1-flash-1017` | `openai-completions` | `https://api.llmgateway.io/v1` | `LLMGATEWAY_API_KEY` | `.dsh/patches/route-llmgateway-deepseek.patch.yml` | Verified 2026-11-06 on dsh 0.2.2-rc.1: exit 0 and `completed` |
| OpenCode Go | `opencode-go` | `deepseek-v4.1-flash` | `openai-completions` | `https://opencode.ai/zen/go/v1` | `OPENCODE_API_KEY` | `.dsh/patches/route-opencode-go-deepseek.patch.yml` | Proven 2026-11-07 with an API key against `https://opencode.ai/zen/go/v1` |

Composition observed means `--dump-config` with the draft route patch and the lineage patch, from a disposable home, showed `agent-default-model` naming that provider and model, and the `llm-pi-ai` row carrying that provider with `apiKeyEnv` naming its key variable (`specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/002-dsh-offline-contract-pin/evidence/dump-config-llmgateway.txt` and `dump-config-opencode-go.txt`). It does not show that a request reaches the provider, which needs a key.

### The OpenCode Go Endpoint Is `https://opencode.ai/zen/go/v1`

Two endpoints are documented for OpenCode Go:

- `https://opencode.ai/inference/go/openai/v1`, from Models.dev.
- `https://opencode.ai/zen/go/v1`, from the OpenCode Go documentation.

The draft route patch used for the offline pin carries the second one, which proves only that the patch composes. A keyed run on 2026-11-07 answered on that endpoint, so `https://opencode.ai/zen/go/v1` is the one this harness uses. Evidence: `specs/cli-external-orchestration/runtime-lifecycle/002-cli-deepseek-harness-creation/013-dsh-live-contract-pin/evidence/latency-and-tokens.md`.

### LLM Gateway

LLM Gateway is the operator's DevPass plan. Its route completed a keyed dsh request on 2026-11-06 with exit 0 and `final.reason.kind` `completed`. The saved run used model `deepseek-v4.1-flash-1017`, the configured endpoint and `reasoningEffort: max`. See `route-llmgateway.stdout.jsonl`, `route-llmgateway.stderr.txt`, `route-llmgateway.exit.txt` and `reasoning-max.md` in the phase evidence folder.

---

## 3. ROUTE PATCH SHAPE

Each route patch replaces two rows. The key appears only as the name of an environment variable, never as a value.

```yaml
- id: llm-pi-ai
  config:
    providers:
      llmgateway:
        displayName: LLM Gateway
        apiKeyEnv: LLMGATEWAY_API_KEY
        api: openai-completions
        baseURL: https://api.llmgateway.io/v1
        compat:
          thinkingFormat: deepseek
          supportsDeveloperRole: false
        models:
          - id: deepseek-v4.1-flash-1017
            name: DeepSeek V4.1 Flash
            reasoningEfforts:
              off:
              high: high
              max: max
- id: agent-default-model
  config:
    provider: llmgateway
    model: deepseek-v4.1-flash-1017
    reasoningEffort: max
```

The OpenCode Go patch has the same shape with provider `opencode-go`, `apiKeyEnv: OPENCODE_API_KEY`, model `deepseek-v4.1-flash` and the endpoint `https://opencode.ai/zen/go/v1`. The draft patches this shape comes from are in `.../002-dsh-offline-contract-pin/scratch/`. The checked-in copies live under `.dsh/patches/` (see [runtime-folder-and-sync.md](./runtime-folder-and-sync.md)).

### Compat Fields

| Field | Effect | Status |
|---|---|---|
| `compat.thinkingFormat: deepseek` | Sends DeepSeek-style thinking control, so `off` sends `thinking: {type: disabled}` | Gateway run emitted a `thinking` event. OpenCode Go's `thinking` event remains UNKNOWN |
| `compat.supportsDeveloperRole: false` | Keeps the system prompt off the `developer` role, which the gateway's upstream refused for Pi | Gateway completed with `false`. Whether `true` also works is UNKNOWN because the closed roster did not allow a variant patch |

### Reasoning Effort

A hand-declared model has no reasoning levels until the profile declares `reasoningEfforts` for it, and an unsupported level fails with `UNSUPPORTED_REASONING_EFFORT` (research synthesis section 9.2). Both checked-in patches declare `off`, `high` and `max`, then set `reasoningEffort: max` on `agent-default-model`. The Gateway run at `max` had no `UNSUPPORTED_REASONING_EFFORT` stderr. OpenCode Go's on-wire reasoning support remains UNKNOWN.

---

## 4. ROUTES THAT ARE NEVER DISPATCHED

These are not roster routes. They are listed so a reviewer knows what a missing patch falls through to.

- **The base default.** Without a route patch, the default composition's `agent-default-model` row names provider `deepseek-official`, the official DeepSeek API, with model `deepseek-flash` (`.../002-dsh-offline-contract-pin/scratch/default-config.yml`). `route-patch-required` exists so no dispatch reaches it.
- **DeepSeek web search and fetch.** The base `web` row uses `searchProvider: deepseek-official`, and two web rows read `DEEPSEEK_API_KEY` (`dump-config-llmgateway.txt`, rows `web`, `web-search-deepseek` and `web-deepseek-api`). With that key absent the model request omits `web_search`. Never put `DEEPSEEK_API_KEY` in a dispatch environment, because it would switch that official route back on.

---

## 5. ADDING OR CHANGING A ROUTE

1. Amend the roster in the spec packet that owns this mode first.
2. Write the route patch in the shape above and compose it with `--dump-config` from a disposable home and a temp cwd. Require exit 0, empty stderr and the new provider and model in `agent-default-model`.
3. Update the roster table here and the `closed-roster` rule message in [../hard-rules.json](../hard-rules.json) together.
4. Add a route to a default only after a keyed harmless task exits 0 with `final.reason.kind` `completed`. LLM Gateway meets that check, and OpenCode Go answered a keyed session on 2026-11-07. OpenCode Go stays non-default.
