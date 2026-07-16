---
title: "Refero Troubleshooting"
description: "Symptom, cause, and fix reference for the mcp-refero transport: authentication and entitlement failures, discovery and naming problems, the Node 25 SIGSEGV, sparse results, batching failures, and quota behavior."
trigger_phrases:
  - "refero error"
  - "refero not working"
  - "refero 401"
  - "refero connection closed"
  - "refero tools not resolving"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Refero Troubleshooting

Failure modes for the `mcp-refero` transport, ordered roughly by how often they block first use. Every fix stays inside the transport's read-only boundary: no config edits, no auth-state repair, no invented retry policies.

---

## 1. SYMPTOM / CAUSE / FIX

| What you see | Why | Fix |
|---|---|---|
| HTTP 401 (Bearer advertised, scope `files:read`) | The endpoint requires authentication; the empty manual `env` is not anonymous access | **Operator-only:** complete the browser OAuth on a Pro (or higher) account, or wire the env-backed Bearer alternative. The agent surfaces the step and waits; it never handles credentials |
| Access denied on a Free account | Free has **no MCP access at all** (denial, not a reduced tool set) | Report the entitlement denial verbatim and stop. Do not retry, and do not model a smaller Free tool list |
| `refero.*` tools do not resolve in Code Mode | The manual was not loaded at Code Mode startup, or OAuth has not been completed | Reconnect Code Mode so manuals reload; confirm the `refero` manual is present in `.utcp_config.json` (read-only grep or `scripts/doctor.sh`); escalate the OAuth step to the operator |
| A callable name fails (`refero.refero_search_styles` not found) | Single-prefix name used; the convention doubles the prefix for tools already named `refero_*` | Use `refero.refero_refero_<tool>(...)`, and confirm the exact callable with `tool_info` first. Never hard-code either form as ground truth |
| Every call returns `-32000 Connection closed` and Code Mode drops | Code Mode is running on Node 25 (isolated-vm has no Node 25 build; `call_tool_chain` SIGSEGVs) | **Operator-side:** run Code Mode on Node 24. This is current local operational evidence, not a server property |
| `await is only valid in async functions...` | Top-level `await` in the `call_tool_chain` body | Call synchronously inside the body, no `await`, per the live-verified pattern |
| A `get_style` / `get_screen` / `get_flow` batch fails | Batch too large (full styles are ~10-15k chars each; a local observation caps flow batches at 10) | Retry with fewer IDs (3-4 styles per batch). The flow cap is a local observation, not a published contract; confirm via `tool_info` |
| Sparse or empty flow results | Query too specific for the flow corpus | Broaden the query, or search screens and reconstruct the journey, reporting the reconstruction as inference |
| Styles search misses in-app or iOS material | Styles coverage is web marketing/product pages only | Use the screens layer with `platform: "web"` or `"ios"` for in-app and iOS patterns |
| An `image_size` or `include_similar` argument is rejected | Deprecated legacy surface: those belong to `refero_get_screen_image` (`image_size`) or nowhere (`include_similar`) | Use `refero_get_screen` for metadata, `refero_get_screen_image` for the screenshot, `refero_get_similar_screens` for comparables |
| A `response_format` argument is rejected | Per-tool availability varies by client, and the image tool never takes it | Check the tool's live schema with `tool_info`; never pass `response_format` to `refero_get_screen_image` |
| HTTP 429 or quota exhaustion | The Pro quota is 8,000 MCP tool calls per month; no short-window limit is published | Relay the provider's message and any header-derived guidance verbatim. Never invent a QPS number, backoff schedule, or retry contract |
| Auth works, then breaks after a runtime move | Auth state lives under `~/.mcp-auth` (or `MCP_REMOTE_CONFIG_DIR`); ephemeral homes lose it | **Operator-only:** re-authenticate. Never inspect, clear, or repair the auth directory as a fix |
| Discovery shows missing, renamed, or extra tools | Provider surface drift against the documented eight-tool contract | Fail closed: report the drift and stop. A changed surface requires a reviewed packet update, not an improvised call |

---

## 2. WHAT NEVER TO DO WHILE TROUBLESHOOTING

- Never edit `.utcp_config.json` (the `refero` manual is validated as-is), and never add a second Refero manual.
- Never delete or modify `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR`; auth state is operator-owned.
- Never paste tokens, OAuth URLs with codes, or auth-state contents into output or evidence.
- Never force the SSE transport; the bridge is HTTP-first with SSE fallback only after HTTP 404.
- Never add `mcp-remote` troubleshooting flags (`--debug`, `--transport`, `--auth-timeout`, `--resource`) to the base manual; they are environment-specific and belong to an operator's temporary local experiment.
- Never claim the failure is fixed until a live discovery (`tool_info`) or call confirms it.

---

## 3. RELATED RESOURCES

- [mcp_wiring.md](mcp_wiring.md) - the bridge, OAuth/Bearer model, naming rule, and discovery contract behind these fixes.
- [tool_surface.md](tool_surface.md) - the eight-tool contract and the deprecated legacy surface.
- [utcp_refero_manual.md](../assets/utcp_refero_manual.md) - the verified manual snapshot and the Bearer alternative.
- [SKILL.md](../SKILL.md) - the runtime contract, including the escalation rules these fixes feed.
