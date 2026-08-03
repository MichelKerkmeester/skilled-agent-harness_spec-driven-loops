---
title: "Webflow MCP Wiring (via Code Mode)"
description: "How the official Webflow MCP 2.0 transport is wired through Code Mode: registered manual, local stdio + WEBFLOW_TOKEN, the remote OAuth alternative, scope model, rate limits, Bridge App boundary, and surface reconciliation."
trigger_phrases:
  - "webflow mcp wiring"
  - "webflow utcp manual"
  - "webflow code mode"
  - "webflow token"
  - "webflow oauth"
  - "webflow bridge app"
importance_tier: important
contextType: implementation
version: 1.2.0.0
---

# Webflow MCP Wiring (via Code Mode)

How the official Webflow MCP 2.0 transport is wired through Code Mode, with the full auth and rate-limit contract.

---

## 1. OVERVIEW

Transport identity (frozen): official `webflow-mcp-server` (npm), local stdio registration with
`WEBFLOW_TOKEN` as the deterministic automation default; remote OAuth (`https://mcp.webflow.com/mcp`
per hosted docs; `/sse` per the repo README — see §6) as the operator-preference alternative.
Version pinning and the README-vs-hosted surface reconciliation are mandatory before first live
use.

Webflow MCP 2.0 exposes Webflow's Data API v2 and Designer API as a bounded combined-tool surface
(18 tool modules, one MCP tool per module with an `actions` array). This skill reaches it through
the repo's **Code Mode** transport. Code Mode consumes stdio; the official server ships as a Node
CLI (`npx -y webflow-mcp-server@latest`), so the registered `webflow` manual is a plain stdio
registration — no bridge needed for the local path. The remote OAuth surface speaks remote HTTP
and requires the `mcp-remote` bridge (§5).

Claims below are tagged **[CONFIRMED]** (read from this repo's config or cited official docs at
research time), **[INFERRED]** (supported but not exercised end-to-end), or **[UNKNOWN]**
(requires an authenticated session or a provisioned test site).

---
## 2. THE REGISTERED `webflow` MANUAL

Registered in `.utcp_config.json` (manual call template, type `mcp`):

```json
{
  "name": "webflow",
  "call_template_type": "mcp",
  "config": {
    "mcpServers": {
      "webflow": {
        "transport": "stdio",
        "command": "npx",
        "args": ["-y", "webflow-mcp-server@latest"],
        "env": { "WEBFLOW_TOKEN": "${WEBFLOW_TOKEN}" }
      }
    }
  }
}
```

**Validated as-is: verify, never re-add, never edit the entry.** The env placeholder resolves from
the operator's environment (`.env.example` documents the namespaced `webflow_WEBFLOW_TOKEN`).
Server prerequisites: Node.js 22.3.0+ **[CONFIRMED]**.

---
## 3. AUTHENTICATION (least privilege)

### Token kinds

| Kind | Scope | Use |
|------|-------|-----|
| **Site Token** | single site; full scope model | automation baseline (deterministic) |
| **Workspace Token** | all sites in workspace; **no `site` scope** | read-only monitoring/auditing only |
| **OAuth token** | multi-site, user-specific | public apps / interactive remote flow |

### Scope model (site-level)

`assets:read/write`, `authorized_user:read`, `cms:read/write`, `comments:read/write`,
`components:read/write`, `custom_code:read/write` (**Data Client apps only** — site tokens cannot
access custom-code endpoints), `ecommerce:read/write`, `forms:read/write`, `pages:read/write`,
`sites:read/write`, `site_activity:read`, `site_config:read/write`, `users:read/write`, `webhooks`
(per trigger type), `workspace:read/write`.

### Frozen baseline (automation)

- Read-only baseline scopes: `cms:read`, `pages:read`, `sites:read`, `assets:read`,
  `components:read`, `forms:read`, `authorized_user:read`.
- Escalate to `sites:write` only for the staging-subdomain publish test.
- Official best practice: minimal scopes; mint a new token when new scopes are needed.
- Role gate: only site owners/admins can authorize the MCP server/app.
- Token values live only in the operator environment; the repo carries names and placeholders.

---
## 4. DISCOVERY-FIRST CONTRACT

Before invoking any Webflow tool:

```ts
const tools = await list_tools();            // live discovery per session
const webflow = tools.filter(t => t.name.startsWith("webflow.webflow."));
```

Expected callable names follow the Code Mode convention `{manual}.{manual}_{tool}` (registry
`webflow.webflow.<tool>` / TypeScript `webflow.webflow_<tool>`) — **UNVERIFIED** until
authenticated discovery (mobbin precedent: `mobbin.mobbin.search_screens` /
`mobbin.mobbin_search_screens`). The research-time inventory (18 modules) is the baseline in
`tool-surface.md`; **always re-discover per session** — never call from memory, and fail closed on
drift.

---
## 5. REMOTE OAUTH ALTERNATIVE

- Endpoint per hosted docs: `https://mcp.webflow.com/mcp` (Streamable HTTP; registry
  `com.webflow/mcp` 2.0.0) — Claude Code: `claude mcp add --transport http webflow
  https://mcp.webflow.com/mcp`; Cursor: URL in MCP config.
- Reached via the same bridge pattern as `refero`: `npx -y mcp-remote https://mcp.webflow.com/mcp`
  as a stdio manual, browser OAuth consent per site/workspace, auth state under `~/.mcp-auth/`.
- The remote transport (`mcp-remote`) is **experimental** — pin the version.
- The Bridge App installs automatically during remote OAuth authorization; local mode needs the
  Bridge App Designer extension for Designer tools (§7).
- Not registered by default; operator decision required (interactive consent is not
  automation-friendly).

---
## 6. VERSION-SURFACE CONTRADICTION (reconcile per session)

| Surface | Documents | Evidence |
|---------|-----------|----------|
| Remote (hosted) | Streamable HTTP `https://mcp.webflow.com/mcp`; resources + Agent Instructions; setup guides for Claude/Cursor/Postman/Windsurf | developers.webflow.com/mcp/* **[CONFIRMED]** |
| Remote (repo README) | `https://mcp.webflow.com/sse`; no `prompts`/`resources` | github.com/webflow/mcp-server README **[CONFIRMED]** |
| Local OSS | stdio + `WEBFLOW_TOKEN`; `dist/index.js` entry; separate from remote path | repo package.json/src/index.ts **[CONFIRMED]** |

Treat the deployed remote surface and the OSS snapshot as **different surfaces** until a
version-specific reconciliation lands; the local stdio server is the deterministic baseline for
automation. Record the tested endpoint + version in [`version-fixture.md`](version-fixture.md) (and `mcp-servers/webflow-mcp/README.md`) after the
first authenticated session.

---
## 7. DESIGNER BRIDGE APP BOUNDARY

- Data API tools work with Webflow closed **[CONFIRMED]**.
- Designer API tools (`de*` families: deAsset, deComponents, deElement, dePages, deStyle,
  deVariable) require the **Bridge App** open in the Designer (auto-installs to authorized sites
  after OAuth; local mode needs a registered/published Bridge App Designer extension).
- Designer edits are draft operations inside the Designer; they become visible only via
  `publish_site`.
- All Designer-family operations must load `sk-design` first (cross-hub pairing).

---
## 8. RATE LIMITS AND ERROR SEMANTICS

- Plan-based general limits: Starter/Basic 60 req/min; CMS/eCommerce/Business 120 req/min;
  Enterprise custom. Headers: `X-RateLimit-Limit` / `X-RateLimit-Remaining`.
- 429 responses carry `Retry-After` (~60s) — honor it; never blind-replay ambiguous
  non-idempotent writes after errors.
- Site publish: **one successful publish per minute**.
- The official SDK (used by the server) has built-in exponential backoff.

---
## 9. DIAGNOSTIC FLOW

1. `scripts/doctor.sh` — node/npx versions, manual presence (verify, never re-add), token
   presence (boolean only), config parse.
2. If discovery fails: check the manual env resolution (`${WEBFLOW_TOKEN}` from the operator
   environment), token scopes (read-only baseline cannot call write actions), 429/`Retry-After`
   backoff, and the pinned server version vs `tool-surface.md`.
3. Designer tools failing → Bridge App not open/authorized; confirm Designer session + pairing.
4. On any drift between live `list_tools` and the baseline inventory → record the drift, fail
   closed on mismatched tools, and update `tool-surface.md` with the dated fixture.

---
## 10. SAFETY BOUNDARY (summary)

- Read-only and draft-safe mutations pass without a gate (scope check only).
- Destructive (`delete_*`, `remove_*`), publish (`publish_site`, `publish_collection_items`,
  publish-status changes), and deploy (`run_workflow`) classes **require operator confirmation**
  and rollback evidence.
- Script registration/application is **draft-write staging** (script config updates ship with the
  next publish) — not itself a deploy; custom-code changes still need confirmation + read-back
  evidence because they affect the production site on publish.
- Publish from smoke/test flows to `publishToWebflowSubdomain` only — never `customDomains`;
  single `pageId` limits blast radius.
- Nothing auto-publishes; CMS mutations are not implicitly draft-safe.
- Workspace tokens are read-only; `custom_code` scopes are Data-Client-app-only.
- API-level site backup/restore does not exist in the Data API v2 surface — DS class carries the
  strongest confirmations.

---
## 11. RELATED RESOURCES

- [`action-reference.md`](action-reference.md) — remote surface (31 tools / 220 actions)
- [`tool-surface.md`](tool-surface.md) — local OSS baseline
- [`troubleshooting.md`](troubleshooting.md) — failure modes
- [`../SKILL.md`](../SKILL.md) — frozen classes and gates