---
name: mcp-webflow
description: "Webflow MCP 2.0 transport mode: official Webflow Data/Designer API via the webflow Code Mode manual, with frozen safety classes (read-only, draft-write, destructive, publish, deploy), least-privilege auth, and sk-design pairing for Designer-family operations."
compatibility: "Requires the official webflow-mcp-server (Node 22.3.0+ for local mode), a WEBFLOW_TOKEN (site token for automation; workspace tokens read-only) or the remote OAuth flow (https://mcp.webflow.com/mcp), and Code Mode."
allowed-tools: [Read, Bash, Grep, Glob, mcp__code_mode__call_tool_chain]
version: 1.1.0.0
user-invocable: true
---

<!-- Keywords: mcp-webflow, webflow, webflow-mcp, webflow mcp 2.0, cms, publish-site, publish-collection-items, designer, bridge-app, webflow-token, sk-design, webflow-transport, code-mode -->

# Webflow (mcp-webflow)

Official **Webflow MCP 2.0** transport for the `mcp-tooling` hub: operate Webflow sites, pages, CMS
collections, components, variables, assets, scripts, workflows, webhooks, and Designer state through
the official `webflow-mcp-server` (npm) or the remote Webflow MCP service, reached via Code Mode.
The transport executes; the hub orchestrates; `sk-design` owns taste.

> **Discovery status (read first).** The `webflow` Code Mode manual **IS REGISTERED** in this repo's
> `.utcp_config.json` (stdio `npx -y webflow-mcp-server@latest`, `WEBFLOW_TOKEN` env). Live tool
> discovery and calls are **BLOCKED pending an operator-provided token and a dedicated non-production
> test site** — the callable inventory below is the **research-time baseline** (18 tool modules,
> 2026-08-02, from official sources) and the frozen safety contract. Per-session `list_tools()`
> re-confirmation stays MANDATORY before relying on any name: confirm, then call, and fail closed on
> drift. Callable names follow the Code Mode convention (`webflow.webflow.<tool>` registry /
> `webflow.webflow_<tool>` TypeScript) — **UNVERIFIED** until authenticated discovery.

---

## 1. WHEN TO USE

### Activation Triggers

**Use when** the user wants to:

- Read Webflow site, page, CMS, component, script, workflow, webhook, or Designer state
  (`list_*`, `get_*`, `query_*`, `search_*` families).
- Mutate Webflow content: CMS collection items (create/update), page settings, static content,
  scripts, webhooks, 301 redirects, robots.txt.
- Publish or deploy: `publish_site`, `publish_collection_items`, `run_workflow` — **always gated**.
- Perform Designer-family edits: elements, styles, variables, components, assets, pages
  (`de*` tools) — **always paired with `sk-design`**.
- Wire, verify, or troubleshoot the registered `webflow` Code Mode manual, its auth, scopes,
  rate limits, or the Designer Bridge App boundary.

### When NOT to Use

- Design judgment itself — load `sk-design` (this transport never decides taste).
- Workspace-level administration outside the documented scope model.
- Anything that must touch a **production site from a smoke/test flow** — that is structurally
  forbidden (staging subdomain only).

---

## 2. OPERATION CLASSES AND GATES (FROZEN)

Every Webflow operation maps to exactly one class. The gate applies at the agent level before any
`tools/call` reaches the bridge.

| Class | Meaning | Gate | Rollback |
|-------|---------|------|----------|
| **RO** read-only | `list_*`, `get_*`, `query_*`, `ask_webflow_ai`, guide, activity logs | none (scope check) | n/a |
| **DW** draft-write | CMS draft items, page settings, static content, scripts, redirects, webhooks, Designer canvas edits | none (scope check; target id present) | revert content / discard draft |
| **DS** destructive | `delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `delete_webhook`, `delete_301_redirect`, `delete_robots_txt`, `remove_element`, `remove_attribute`, `remove_style`, `remove_properties`, `delete_variable`, `unregister_component` | **operator confirmation** (idempotency guard; before/after listing) | re-publish prior content; Designer version-history snapshot; API-level site restore UNKNOWN → treated as unsupported |
| **PB** publish | `publish_site`, `publish_collection_items`, `update_page_settings` with publishing-status change | **operator confirmation**; staging-first (`publishToWebflowSubdomain` only, never `customDomains`); optional single `pageId`; 1 publish/min queue | re-publish prior content/snapshot |
| **DP** deploy | `run_workflow`, script registration (ships with publish) | **operator confirmation**; named target environment | Webflow-side workflow controls; script removal is DS |

### Critical semantics (from official sources)

- **CMS mutations are NOT implicitly draft-safe.** Collection items can be created/deleted
  directly in the live site, or queued as drafts to publish later — the client must choose.
- **Nothing auto-publishes.** Publishing is always a separate explicit action.
- **One publish per minute** queue on site publish; plan-based general limits (60/120 rpm) with
  `Retry-After` on 429 — honor it, never blind-replay ambiguous non-idempotent writes.
- **Staging vs production is structural**: publish body must carry `customDomains` (production)
  OR `publishToWebflowSubdomain` (`*.webflow.io`). A single `pageId` limits blast radius.
- **Unknown modules fail closed**: anything not in the researched inventory is treated RO/DW until
  discovery proves otherwise — never DS/PB/DP by default.

---

## 3. EXECUTION PROTOCOL

### 3.1 Discovery first (mandatory)

1. `list_tools()` (or Code Mode `tool_info`) in the session before any call.
2. Compare names against `references/tool-surface.md`; on drift, record it and fail closed for
   mismatched tools (never call from memory).
3. Confirm the operation class of the target tool against the frozen matrix.

### 3.2 Intent routing (guarded)

| User intent pattern | Route | Notes |
|---------------------|-------|-------|
| "read/list/get webflow ..." (pages, cms, sites, scripts, workflows, components, webhooks) | RO | scope check only |
| "create/update webflow ..." (draft intent, no publish verb) | DW | confirm target + draft vs live choice for CMS |
| "delete/remove webflow ..." | DS | **confirmation** + rollback statement + before/after listing |
| "publish webflow ..." | PB | **confirmation**; staging-first; single page when possible |
| "run a webflow workflow" | DP | **confirmation**; name the workflow + inputs; blast-radius note |
| "change the hero heading / style / variable / component in webflow" | DW + `sk-design` | Designer-family: load `sk-design` before execution |
| "webflow" alone | discover-first: enumerate what the user can safely do (balance-free read inventory) | never auto-execute |

### 3.3 sk-design pairing

- **MUST pair with `sk-design`**: deElement, deStyle, deVariable, deComponents, deAsset tools,
  `update_page_settings` (SEO/OG metadata), component content/properties updates.
- **Transport-only** (no design judgment): CMS CRUD, analytics, scripts registration, workflow
  runs, webhooks, comments, enterprise rules/redirects.
- The transport may execute an already-approved transformation without re-deciding taste.

### 3.4 Authentication posture

- **Remote mode** (primary for humans): OAuth per-site/per-workspace consent against the Webflow
  MCP service; zero local secrets; only site owners/admins can authorize. Transport is
  experimental (`mcp-remote`) — pin the version.
- **Local mode** (deterministic for automation): `WEBFLOW_TOKEN` site token with least-privilege
  scopes (read-only baseline: `cms:read`, `pages:read`, `sites:read`, `assets:read`,
  `components:read`, `forms:read`, `authorized_user:read`); escalate to `sites:write` only for the
  staging publish test. Workspace tokens: read-only only (no `site` scope). `custom_code` scopes
  are Data-Client-app-only.
- Token values live only in the operator environment; the repo carries names and placeholders.

### 3.5 Version-surface contradiction (must reconcile per session)

The public `webflow/mcp-server` README documents `/sse` + no resources, while current hosted docs
describe the remote Streamable HTTP surface at `https://mcp.webflow.com/mcp` (registry
`com.webflow/mcp` 2.0.0) with read-only resources and Agent Instructions. Treat the deployed
remote surface and the OSS snapshot as different surfaces until a version-specific reconciliation
lands; the local stdio server is the deterministic baseline for automation.

---

## 4. SAFETY RULES

### ✅ ALWAYS
- Discover first; fail closed on drift.
- Classify before executing; apply the frozen gate.
- Confirm destructive/publish/deploy immediately before the call with expected output and
  rollback statement.
- Publish to `publishToWebflowSubdomain` only from smoke/test flows; single `pageId` when possible.
- Honor `Retry-After`; respect the 1-publish/min queue.
- Route Designer-family operations through `sk-design`.
- Keep token values out of the repository, logs, and transcripts (redact tool output).

### ⛔ NEVER
- Never call an unverified tool name from memory.
- Never publish to production `customDomains` from any automated or test flow.
- Never use workspace-token writes.
- Never blind-replay a failed non-idempotent write.
- Never treat CMS mutations as implicitly draft-safe.
- Never perform API-level site backup/restore — it does not exist in the Data API v2 surface.

---

## 5. WIRING

| Concern | Value |
|---------|-------|
| Manual | `webflow` in `.utcp_config.json` (stdio `npx -y webflow-mcp-server@latest`, `WEBFLOW_TOKEN` env) |
| Env name | `webflow_WEBFLOW_TOKEN` in `.env.example` (name only) |
| Local server | `webflow-mcp-server` npm, Node 22.3.0+ |
| Remote endpoint | `https://mcp.webflow.com/mcp` (hosted docs) / `/sse` (README) — reconcile per session |
| Bridge App | Required only for Designer (`de*`) tools; auto-installs on OAuth authorization |
| Docs | `INSTALL-GUIDE.md`, `references/mcp-wiring.md`, `references/tool-surface.md`, `references/troubleshooting.md` |

---

## 6. NEGATIVE KNOWLEDGE (ELIMINATED APPROACHES)

- `npm webflow-mcp` (third-party) — not the official server; official is `webflow-mcp-server` v1.0.1.
- Workspace token as a general write credential — no `site` scope; read-only by design.
- API-based site duplication/backup for test scaffolding — not part of Data API v2.
- Treating CMS mutations as draft-safe by default — official FAQ says live-site writes are possible.
- API-level site restore as a rollback path — UNKNOWN; treated as unsupported (strongest confirmations on DS).
