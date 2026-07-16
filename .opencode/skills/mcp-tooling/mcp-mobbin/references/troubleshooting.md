---
title: "Mobbin Troubleshooting"
description: "Symptom, cause, and fix reference for the mcp-mobbin transport: the expected pre-auth 401, OAuth and browser-callback failures, tools not resolving, rate-limit 429 handling, Free-account denial, drift, image and context pressure, all tagged CONFIRMED/INFERRED/UNKNOWN."
trigger_phrases:
  - "mobbin error"
  - "mobbin not working"
  - "mobbin 401"
  - "mobbin 429"
  - "mobbin tools not resolving"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---

# Mobbin Troubleshooting

Failure modes for the `mcp-mobbin` transport, ordered roughly by how often they block first use. Every fix stays inside the transport's read-only boundary: no config edits, no auth-state repair, no invented retry policies beyond the documented rate-limit contract. Remember the packet's registered state: the `mobbin` manual **is registered** in `.utcp_config.json` (2026-07-16), so "no tools resolve" now means a stale Code Mode session (manuals load at startup), incomplete operator OAuth, or a broken registration — never an expected baseline.

---

## 1. SYMPTOM / CAUSE / FIX

| What you see | Why | Safe action |
|---|---|---|
| HTTP 401 before any authorization | The **expected** protected-resource challenge: the endpoint requires browser OAuth, and the empty manual `env` is not anonymous access **[CONFIRMED: live probe]** | Complete browser OAuth (operator-only); **do not add an API key** — none exists for Mobbin MCP |
| Browser/OAuth callback fails | Headless session, blocked localhost callback port, or callback timeout **[INFERRED]** | Move to an interactive, browser-capable session; never ask the user to paste a token — no token-paste path exists |
| No `mobbin.*` tools in Code Mode | Code Mode session predates the registration (manuals load at startup), manual load failure, incomplete OAuth, plan ineligibility, or a broken/reverted registration (`doctor.sh` reports absence as ERR) | Validate the manual JSON read-only, confirm Node/npx, reconnect Code Mode, escalate the OAuth step, then check plan eligibility — in that order; a missing manual is escalated to the operator, never re-added from this packet |
| Callable name or schema mismatch at discovery | Provider or adapter drift against the 2026-07-16 fixture baseline (`mobbin.mobbin_search_screens` + `search_flows` + `search_sections`, confirmed in `discovery_fixture_2026-07-16.json`) | Re-run discovery; **fail closed**; save a fresh dated fixture and update the reviewed packet docs rather than improvising a call |
| HTTP 429 | The 60 requests / 60 seconds / user window was exceeded **[CONFIRMED: docs.mobbin.com/rate-limits]** | Honor `Retry-After`, then exponential backoff with jitter; do not invent finer-grained burst or concurrency contracts |
| Free account blocked | Entitlement boundary: MCP is documented for Pro, Team, and Enterprise only **[CONFIRMED]**; the exact denial status/payload/UX is **[UNVERIFIED]** | Explain that MCP starts at Pro; do not guess or fabricate the exact denial semantics; report the provider's message verbatim |
| Inline images do not appear through `call_tool_chain` | Whether Code Mode faithfully passes inline image content blocks is **[UNKNOWN]** | Verify at install; if images are dropped, report the gap and plan a side-channel for visual inspection — never fabricate an image-download tool |
| Behavior changes after a dependency or provider update | `mcp-remote` is unpinned, experimental, externally versioned; the provider surface can drift | Smoke-test after any dependency change; re-verify discovery at install and on Mobbin releases |
| Large image responses crowd the context | Each screen returns an inline image; wide `limit` values multiply the payload | Default `limit: 5`; work metadata-first; widen deliberately and only after asking |
| Discovery returns an unexpected mutation-capable tool | Provider surface expanded beyond the documented read-only baseline | **Refuse the tool.** The read-only packet boundary is an authorization decision; a mutation-capable surface requires a reviewed contract change |
| Results answer a docs question, not a design question | The wrong server: `docs.mobbin.com/mcp` is a separate Mintlify docs-search MCP | Target `api.mobbin.com/mcp` only; the docs server is out of this packet's scope |

---

## 2. WHAT NEVER TO DO WHILE TROUBLESHOOTING

- Never edit, re-draft, or re-add the `mobbin` manual in `.utcp_config.json`; the registered entry is operator-owned, and a broken or reverted registration is escalated, never repaired from this packet.
- Never invent, request, or wire an API key or auth env var — no `MOBBIN_API_KEY` exists for MCP, and the REST workspace key belongs to a different product surface.
- Never delete, inspect, or "repair" `~/.mcp-auth` / `MCP_REMOTE_CONFIG_DIR`; auth state is operator-owned, and reauthorization is an explicit operator action.
- Never paste tokens, OAuth URLs with codes, Authorization headers, or auth-state contents into output or evidence.
- Never force the SSE transport; the bridge is HTTP-first with SSE fallback only after HTTP 404, and Mobbin requires Streamable HTTP.
- Never hardcode a `deep` parameter while the input-vs-server-behavior conflict stays open.
- Never claim the failure is fixed until a live discovery (`tool_info`) or call confirms it.

---

## 3. RELATED RESOURCES

- [mcp_wiring.md](mcp_wiring.md) - the bridge, OAuth model, inferred naming, and discovery contract behind these fixes.
- [tool_surface.md](tool_surface.md) - the single-tool contract, plan gating, rate limit, and the open questions.
- [utcp_mobbin_manual.md](../assets/utcp_mobbin_manual.md) - the registered manual's reference shape and the post-registration checklist (doc-side items executed; live items pending).
- [SKILL.md](../SKILL.md) - the runtime contract, including the escalation rules these fixes feed.
