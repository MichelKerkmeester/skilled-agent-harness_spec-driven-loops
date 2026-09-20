---
title: "cli-usage Feature: Surfaces"
description: "The CLI surface, the jev-mcp stdio surface, and the four-provider table with their key variables, endpoints and default models."
trigger_phrases:
  - "jev cli surface"
  - "jev mcp surface"
  - "jev provider table"
importance_tier: "important"
contextType: "reference"
version: 1.0.0.0
---

# Surfaces

---

## 1. The CLI surface

| Aspect | Value |
|---|---|
| Binary | `jev` — `uv tool install jev-cli`, pinned at 0.6.2 |
| Subcommands | `auth` (`set`, `status`, `test`), `install-skills`, `noul`, `choice`, `score`, `run` |
| Shared flags | `--provider`, `--model`, `--json-state`, `--pretty`, `--value`; `--endpoint` is hidden |
| State forms | inline text, `@path`, `-` for stdin (and the omitted flag, which is also stdin) |
| Output | compact JSON on stdout; `--pretty` indents; `--value` prints the primary scalar only |
| Errors | one JSON object on **stderr**, `{"ok": false, "error": …}`, stdout empty |
| Exit codes | 0 judgment, 1 unexpected response, 2 usage, 3 credential, 4 transport, 130 interrupted |

Anchors: `references/cli-reference.md` (all of it, with LIVE/SOURCE tags),
`manual-testing-playbook/cli-invocation/` and `manual-testing-playbook/exit-codes/`.

---

## 2. The MCP surface

| Aspect | Value |
|---|---|
| Binary | `jev-mcp` — installed by the same package, no extra to select |
| Transport | stdio; stdout carries protocol frames only, diagnostics on stderr |
| Tools | exactly four: `noul`, `choice`, `score`, `run` |
| Required args | `[state, question]`, `[state, question, options]`, `[state, question, levels]`, `[request]` |
| Optional args | `provider`, `model`, `endpoint` on all four |
| State handling | **verbatim** — `-` and `@path` are literal strings, not stdin and not a file |
| Cardinality | `options` and `levels` each require at least two entries, refused with a tool error |
| Failures | every `CliError` becomes a tool error, never a protocol failure |

**Start rule**: a host owns the process. Never run it from a shell, where its frames land in the
transcript and nothing is listening.

Anchors: `references/mcp-server.md`, `manual-testing-playbook/mcp-server/handshake-and-four-tools.md` (JEV-020).

---

## 3. Providers

| Provider | Option | Key variable | Endpoint | Default model |
|---|---|---|---|---|
| TypeSafe official | `official` (default) | `TYPESAFE_API_KEY` | `https://api.typesafe.ai/v1/systemone` | `jev-latest` |
| Vercel AI Gateway | `vercel` | `AI_GATEWAY_API_KEY` | `https://ai-gateway.vercel.sh/v4/ai/evaluation-model` | `typesafe-ai/jev` |
| OpenRouter | `openrouter` | `OPENROUTER_API_KEY` | `https://openrouter.ai/api/alpha/decisions` | `typesafe/jev-1.13` |
| Jev-compatible proxy | `custom` | `JEV_API_KEY` | `--endpoint` or `JEV_ENDPOINT`, required | `JEV_MODEL` or `jev-latest` |

**Resolution**: the provider flag, then `JEV_PROVIDER`, then `official`. The key resolves from the
provider's environment variable, then the CLI's own credential store, then the legacy top-level
`api_key` member for `official` only.

**Translation**: only `vercel` rewrites the request (a `noul` becomes a `boolean`, the model id moves
to a header) and normalizes the response back. The other three send and receive the native System One
contract unchanged.

**The gateway-key answer**: an OpenAI-compatible LLM Gateway credential cannot front Jev through
`--provider custom` without a translating proxy, because the payload and the answer path are the
native contract and the bearer variable is `JEV_API_KEY`. Receipts in
`references/providers-and-models.md` §4.

Anchors: `references/providers-and-models.md`, the per-scenario files under `manual-testing-playbook/providers/`
(JEV-009, JEV-014, JEV-021).

---

## 4. What is unconfirmed

At pin time no provider credential existed in this workspace, so the live response body of every
provider, the currency of the pinned default model ids, and any quota or latency figure were
unconfirmed. An operator `official` credential has since been stored: the `official` response body
and its default model id (`jev-1.13.0`) are now observed, while the `vercel`, `openrouter` and
`custom` bodies and every quota or latency figure remain unconfirmed. They are tagged where they
appear rather than restated as fact.
