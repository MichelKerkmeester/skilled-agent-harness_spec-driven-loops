---
title: "Jev Providers and Models"
description: "The four Jev providers, their key environment variables, endpoints, default model ids, and the per-provider request and response translation rules."
trigger_phrases:
  - "jev providers"
  - "jev model ids"
  - "typesafe api key"
  - "jev custom provider"
  - "jev vercel openrouter"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.2
---

# Jev Providers and Models

> Read from `src/jev_cli/__init__.py` (`PROVIDERS`, `provider_endpoint()`, `provider_model()`,
> `provider_request()`, `normalize_response()`) at `jev-cli` 0.6.2 and confirmed live where a probe
> could reach the branch without a credential. No authenticated call was made: every
> provider-reachability claim below is **SOURCE** unless it says otherwise, and the one live check
> that was run is marked **LIVE**.

---

## 1. THE PROVIDER TABLE

| Provider | `--provider` value | Key variable | Endpoint | Default model |
|---|---|---|---|---|
| TypeSafe official | `official` (default) | `TYPESAFE_API_KEY` | `https://api.typesafe.ai/v1/systemone` | `jev-latest` |
| Vercel AI Gateway | `vercel` | `AI_GATEWAY_API_KEY` | `https://ai-gateway.vercel.sh/v4/ai/evaluation-model` | `typesafe-ai/jev` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/alpha/decisions` | `typesafe/jev-1.13` |
| Jev-compatible proxy | `custom` | `JEV_API_KEY` | `--endpoint` or `JEV_ENDPOINT`; **required** | `JEV_MODEL` or `jev-latest` |

The default provider is `JEV_PROVIDER` when set, otherwise `official`. **LIVE**:
`JEV_PROVIDER=nope jev noul …` → exit 2, `{"ok": false, "error": "invalid JEV_PROVIDER: nope"}` —
the value is validated before any provider access.

`--provider exchange` for `noul` and `choice` on the official, vercel and openrouter providers is
carried in the request body as `questions.<name>.type`:

```json
{"state": "…", "model": "typesafe/jev-1.13",
 "questions": {"answer": {"type": "choice", "instructions": "…", "criteria": {"a": "…", "b": "…"}}}}
```

This is the **native System One shape**, not chat completions. Anything fronting Jev must accept
this body and return `{"answers": {"<name>": {"<type>": <value>}}}`.

---

## 2. KEY RESOLUTION ORDER

For the selected provider, `api_key()` resolves in this order:

1. The provider's environment variable, if set and non-empty.
2. The credential store at `$XDG_CONFIG_HOME/jev-cli/credentials.json`, else
   `~/.config/jev-cli/credentials.json`, under `providers.<provider>`.
3. For `official` only, the legacy top-level `api_key` member.

A miss raises exit 3 with `"<provider> API key is not stored; run: jev auth set --provider
<provider>"`. **LIVE** with every provider key variable cleared, `jev noul …`, `jev choice …`,
`jev score …`, `jev run -` and `jev auth status` all exit 3 with that exact object on stderr and
nothing on stdout. An empty stored value is a separate exit-3 error (`stored <provider> API key is
empty`), and an unparseable credential file is a third (`stored credential file is invalid;
refusing to overwrite it`).

**The store is per-provider.** `jev auth set --provider vercel` writes `providers.vercel` and leaves
`providers.official` alone, so one machine can carry several providers without one displacing
another.

---

## 3. PER-PROVIDER TRANSLATION

Only `vercel` changes the wire format. For every other provider the body is sent byte-for-byte as
built and the response is returned unchanged.

| Aspect | `official` / `openrouter` / `custom` | `vercel` |
|---|---|---|
| Request body | Sent unchanged | `noul` is rewritten to `boolean`; `model` is **removed** from the body |
| Headers | `Authorization`, `Content-Type`, `User-Agent` | Plus `ai-gateway-protocol-version: 0.0.1`, `ai-gateway-auth-method: api-key`, `ai-evaluation-model-specification-version: 4`, `ai-model-id: <model>` |
| Response | Returned unchanged | Normalized: a `boolean` answer becomes `{"noul": <probability>, …}` and the `type` key is dropped from every answer |

**Consequence for a caller that compares providers:** a `vercel` response is the normalized one, so
the same judgment shape comes back from all four. A caller that needs the raw probabilities the
gateway returns must read them before normalization — this client does not expose them.

---

## 4. THE `custom` PROVIDER AND THE OPERATOR'S GATEWAY KEY

The question this packet had to answer: **can the operator's existing LLM Gateway key front Jev
through `--provider custom` with `JEV_ENDPOINT`?**

**Answer: no, not without a translating proxy.** Three source-read facts decide it, and none of them
is a credential question:

1. `custom` sends the **native System One payload** — `state`, `model`, `questions` — because
   `provider_request()` only rewrites for `vercel` and `normalize_response()` is a no-op for
   everything else.
2. The client reads the answer at `answers.<name>.<type>`; an OpenAI-compatible chat response has
   no such path, so a plain gateway endpoint produces exit 1 (`unexpected API response`) rather than
   a judgment.
3. The bearer it sends is `JEV_API_KEY`, and every provider's key variable is a **separate**
   namespace. An `LLMGATEWAY_API_KEY` is not read by this client under any provider.

So the reachable paths are: an official `TYPESAFE_API_KEY`, a `vercel` `AI_GATEWAY_API_KEY`, an
`openrouter` `OPENROUTER_API_KEY`, or a `custom` endpoint that implements the System One contract
and issues its own `JEV_API_KEY`. **LIVE** on the `custom` path: with `--provider custom` and no
endpoint the process exits 2 before any request, and with an endpoint but no key it exits 3 — so the
endpoint override is accepted and a wrong endpoint cannot be mistaken for a missing key.

**Operator step if a proxy is wanted:** stand up an HTTPS endpoint that accepts the System One body
and returns `{"answers": {...}}`, then set `JEV_PROVIDER=custom`, `JEV_ENDPOINT=<proxy>`,
`JEV_API_KEY=<proxy key>` and optionally `JEV_MODEL`. The packet does not build that proxy and does
not claim one exists.

---

## 5. MODEL SELECTION

- `--model` overrides the provider default for one command.
- `run` keeps the `model` carried in the request unless `--model` overrides it; when the request
  omits one, the provider default is added.
- `JEV_MODEL` supplies the default for `custom` only. The three hosted providers use fixed default
  ids and ignore it.
- On `vercel`, the model id travels in the `ai-model-id` header instead of the body. On the other
  three it travels in the body as `model`.

There is no repo-owned roster for Jev. The provider decides which ids exist, the ids are versioned
by the provider, and this packet records defaults rather than a closed allowlist. That is the
honest difference from the executor packets, whose models this repo pins.

---

## 6. VERIFYING A PROVIDER

```bash
command -v jev && jev --version           # binary present
jev auth status                            # a key resolves for the selected provider
jev auth test                              # the key is accepted by the provider
jev auth set --provider <name>             # store one; masked prompt, or pipe it in
```

`auth test` sends `{"state": "authentication test", "questions": {"answer": {"type": "noul",
"instructions": "Is this an authentication test?"}}}` and prints
`{"ok": true, "valid": true, "model": "<model>"}`. It is the only command that proves a key is
*accepted* rather than merely *present*, and it costs one billed call.

---

## 7. CONFIRMED AND STILL UNCONFIRMED

At pin time the following were source-read only, because no provider credential existed in this
workspace and the packet does not spend the operator's quota guessing. An operator credential for
`official` has since been stored, so the `official` half of the first two is now observed rather
than inferred: `jev auth test` printed `{"ok": true, "valid": true, "model": "jev-1.13.0"}`, and
one judgment per type returned the documented shapes (`noul` `0.95`, a `choice` key from the
submitted set, a `score` position). What remains unconfirmed, and is still tagged wherever it
appears:

- The live response body of `vercel`, `openrouter` and `custom`, including any per-provider
  translation behavior that only a call can show. The `official` body is observed; these are not.
- Whether `vercel` and `openrouter` accept their pinned default model ids today. `official` answered
  with `jev-1.13.0`.
- Any rate limit, quota or per-call latency figure.

Every later claim that depends on these is tagged unconfirmed rather than restated.
