---
title: "Webflow MCP Troubleshooting"
description: "Common failure modes for the webflow Code Mode manual: token and scope issues, discovery failures, rate limits, publish queue, Designer Bridge App, version-surface contradictions, and redaction rules."
trigger_phrases:
  - "webflow troubleshooting"
  - "webflow mcp not working"
  - "webflow token error"
  - "webflow 429"
  - "webflow bridge app"
importance_tier: normal
contextType: implementation
version: 1.1.0.0
---
# Webflow MCP Troubleshooting

Common failure modes for the webflow Code Mode manual and their fixes.

---
## 1. OVERVIEW

This reference covers discovery failures, auth/scope errors, rate limiting, publish-queue issues,
Designer Bridge App failures, surface drift, and redaction rules. Run `../scripts/doctor.sh`
(verify-only) first.

---


---
## 2. Discovery Fails (No `Webflow.Webflow.*` Tools In `List_Tools`)

1. Confirm the operator environment exports `WEBFLOW_TOKEN` (namespaced
   `webflow_WEBFLOW_TOKEN` in `.env.example`); the Code Mode manual resolves `${WEBFLOW_TOKEN}`
   from the environment. Check `scripts/doctor.sh` (boolean token check — never prints values).
2. Confirm npx can fetch `webflow-mcp-server` (offline cache, registry access). If the pinned
   version is unreachable, restore the recorded pinned version from
   `../mcp-servers/webflow-mcp/README.md`.
3. Confirm Node >= 22.3.0 (the server's documented runtime requirement).
4. Re-run discovery per session; never call from memory.

---
## 3. Tool Calls Fail With Auth Errors (401/403)

| Symptom | Cause | Fix |
|---------|-------|-----|
| 401 on everything | missing/expired `WEBFLOW_TOKEN` | export a valid token; restart the manual |
| 403 on a specific action | token scopes insufficient for the action's class | check the action's required scope (`tool-surface.md`); mint a least-privilege token with the needed scope |
| 403 on site-level calls | workspace token (no `site` scope) | use a Site Token for site-level operations |
| 403 on custom-code endpoints | `custom_code` scopes are Data-Client-app-only | use a Data Client app token or drop the call |
| 403 on authorize | role below owner/admin | only site owners/admins can authorize the MCP server |

---
## 4. Rate Limiting (429)

- Honor `Retry-After` (~60s); the official SDK applies exponential backoff by default.
- Publishing is limited to one successful queue per minute — batch or wait.
- Plan-based general limits: Starter/Basic 60 rpm; CMS/eCommerce/Business 120 rpm.
- Never blind-replay ambiguous non-idempotent writes after a 429/error.

---
## 5. Publish Failures

- "Publish queue busy": one publish per minute — wait and retry once, verify before retry.
- Staging vs production: the publish body requires `customDomains` OR `publishToWebflowSubdomain`.
  Smoke flows must pass only the staging flag (optionally scoped to a single `pageId`).
- Published drafts didn't appear: CMS items may have been written to the draft queue — publishing
  is a separate explicit action (`publish_collection_items`).

---
## 6. Designer / Bridge App Failures (`De*` Tools)

- Designer tools fail when Webflow is closed or the Designer session has no authorized site —
  Designer API tools require the Bridge App open in the Designer.
- Bridge App not installed: it auto-installs to authorized sites after remote OAuth; local mode
  needs a registered/published MCP Bridge App Designer extension.
- `get_designer_app_connection_info` (RO) reports connection state — check it before Designer work.
- Designer edits are draft-only; they appear on the live site only after `publish_site`.

---
## 7. Suspicious Or Missing Tools

- The public `webflow/mcp-server` README and the hosted docs disagree on the surface (`/sse` vs
  `/mcp`, resources presence). Treat the **pinned server version's live discovery** as
  authoritative; record dated fixtures in `tool-surface.md`.
- Unknown tool modules default to read-only/draft-write until discovery proves otherwise
  (fail closed) — never grant destructive/publish/deploy classes by default.
- Tool named differently than the baseline: record the drift and update the fixture; do not
  guess.

---
## 8. WORKFLOW AND WEBHOOK ISSUES

- `run_workflow` fails: confirm the workflow id and required inputs (`flows`/`workflows` list is
  RO); the blast radius depends on the workflow definition — state it in the confirmation.
- Webhook create/delete: integration config, not site content; `delete_webhook` is destructive
  class.

---
## 9. REDACTION RULES

- Never commit or log token values; redact tool output containing them.
- Never print the resolved `${WEBFLOW_TOKEN}` value (doctor.sh reports presence only).
- Never record account identifiers in fixtures.

---
## 10. RELATED RESOURCES

- [`mcp-wiring.md`](mcp-wiring.md) — wiring and auth details
- [`action-reference.md`](action-reference.md) — action inventory
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates
