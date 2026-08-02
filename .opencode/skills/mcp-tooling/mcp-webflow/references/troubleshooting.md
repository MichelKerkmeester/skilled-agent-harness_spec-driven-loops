---
title: "Webflow MCP Troubleshooting"
description: "Common failure modes for the webflow Code Mode manual: token issues, discovery failures, rate limits, and version-surface contradictions."
trigger_phrases:
  - "webflow troubleshooting"
  - "webflow mcp not working"
  - "webflow token error"
importance_tier: normal
contextType: implementation
version: 1.0.0.0
---

# Webflow MCP Troubleshooting

## Discovery fails (no `webflow.webflow.*` tools in `list_tools`)

1. Confirm the operator environment exports `WEBFLOW_TOKEN` (namespaced `webflow_WEBFLOW_TOKEN` in `.env.example`); the Code Mode manual resolves `${WEBFLOW_TOKEN}` from the environment.
2. Confirm npx can fetch `webflow-mcp-server` (offline cache, registry access). If the pinned version is unreachable, restore the recorded pinned version from `../mcp-servers/webflow-mcp/README.md`.
3. Re-run discovery per session; never call from memory.

## Tool calls fail with auth errors (401/403)

- Token scopes insufficient for the tool's class — check the action's required scope against `tool-surface.md`.
- Workspace tokens lack the `site` scope — use a Site Token for site-level operations.
- Only site owners/admins can authorize the MCP server — confirm role.

## Rate limiting (429)

- Honor `Retry-After` (~60s); the official SDK applies exponential backoff by default.
- Publishing is limited to one successful queue per minute — batch or wait.

## Suspicious or missing tools

- The public `webflow/mcp-server` README and the hosted docs disagree on the surface (`/sse` vs `/mcp`). Treat the **pinned server version's live discovery** as authoritative; record it in `tool-surface.md`.
- Unknown tool modules default to read-only/draft-write until discovery proves otherwise (fail closed).

## Never

- Commit or log token values.
- Blind-replay ambiguous non-idempotent writes after errors.
- Publish to production `customDomains` from smoke flows.
