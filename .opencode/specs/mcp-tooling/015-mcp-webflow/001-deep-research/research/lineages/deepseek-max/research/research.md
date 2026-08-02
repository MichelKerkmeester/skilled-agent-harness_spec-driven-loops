# Research Synthesis: Webflow MCP 2.0 (deepseek-max lineage)

> Detached fan-out lineage of the 015-mcp-webflow Phase 1 deep research. Executor: cli-pi (deepseek-v4-flash). Stop policy: max-iterations (5); convergence off (telemetry only). All claims carry official-source citations or explicit inference markers.

## 1. Executive Summary

Webflow MCP 2.0 is an official, actively maintained MCP server (`webflow/mcp-server`, npm `webflow-mcp-server@1.0.1`) exposing Webflow's Data API v2 and Designer API as MCP tools. It supports two connection modes — remote OAuth (`https://mcp.webflow.com/sse`, experimental `mcp-remote` transport) and local bearer token (`WEBFLOW_TOKEN`) — with a Designer "Bridge App" companion required only for canvas-bound operations. The surface is a bounded tool set (18 tool modules, combined-tool pattern with per-action schemas), not an API passthrough. Operations classify cleanly into read-only, draft-safe, destructive, publish-capable, and deployment-capable buckets, with publishing always an explicit separate action and rate limits per plan (60/120 rpm, 1 publish/min). For the mcp-tooling hub, `mcp-webflow` is a **transport** (mutations land in Webflow's cloud), registered as a transport leaf, with `sk-design` owning all design judgment.

## 2. Research Questions

| ID | Question | Status |
|----|----------|--------|
| Q1 | Which MCP 2.0 actions are read-only, draft-safe, destructive, publish-capable, or deployment-capable? | **Answered** (Section 4) |
| Q2 | Does the official surface use remote OAuth, a local server, an API token, or a client-specific connection flow? | **Answered** (Section 5) |
| Q3 | Is `mcp-webflow` a `workflow` or a `transport`? | **Answered** (Section 9) |
| Q4 | What non-production Webflow workspace or site can support live smoke? | **Answered** (Section 7) |
| Q5 | Which Webflow operations require explicit operator confirmation, and which require a named rollback? | **Answered** (Section 8) |
| Q6 | Which operations must pair with `sk-design` design judgment? | **Answered** (Section 10) |

## 3. Methodology

Five iterations: (1) official surface inventory (announcement blog, README, package.json, GitHub tree); (2) per-module action extraction from server source (`src/tools/*.ts`) with HTTP-method classification; (3) authentication and rate-limit references; (4) scopes reference and publish semantics; (5) classification, confirmation policy, and integration recommendation grounded in the mcp-tooling hub layout. All sources official (webflow.com, developers.webflow.com, github.com/webflow/mcp-server).

## 4. Tool Inventory and Operation Classes (Q1)

Combined-tool pattern: one MCP tool per module with an `actions` array; `annotations.readOnlyHint` exists only at tool level (`false` on all combined tools; `true` on `element_snapshot_tool`), so per-action classes derive from underlying HTTP method + payload.

| Module (tool) | Read-only | Draft-safe mutation | Destructive | Publish-capable | Deployment-capable |
|---|---|---|---|---|---|
| pages (`data_pages_tool`) | `list_pages`, `get_page_metadata`, `get_page_content` | `update_page_settings` (draft settings; payload may flip publishing status) | — | `update_page_settings` (status field) | — |
| cms (`data_cms_tool`) | `get_collection_list`, `get_collection_details`, `list_collection_items` | `create_collection`, `create_collection_*_field`, `update_collection_field`, `create_collection_items`, `update_collection_items` | `delete_collection_items` | `publish_collection_items` | — |
| sites (`data_sites_tool`) | `list_sites`, `get_site` | — | — | `publish_site` | — |
| workflows (`data_workflows_tool`) | `list_workflows`, `list_workflow_runs`, `get_workflow_run` | — | — | — | `run_workflow` |
| scripts (`data_scripts_tool`) | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | `add_inline_site_script`, `upsert_page_script` | `delete_all_site_scripts`, `delete_all_page_scripts` | — | script registration ships with site publish |
| components (`data_components_tool`) | `list_components`, `get_component_content`, `get_component_properties` | `update_component_content`, `update_component_properties` | — | — | — |
| dePages (`de_page_tool`) | — | `create_page`, `create_page_folder`, `switch_page` | — | — | — |
| deElement (`element_tool`/`element_snapshot_tool`) | `query_elements`, `get_selected_element`, snapshot tool | `select_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, `add_or_update_attribute`, `update_id_attribute` | `remove_element`, `remove_attribute` | — | — |
| deVariable (`variable_tool`) | `get_variable_collections`, `get_variables`, `query_variables` | `create_variable_collection`, `create_variable_mode`, `create_*_variable`, `update_*_variable`, `rename_variable` | `delete_variable` | — | — |
| Not inspected (source-verified existence only) | aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection | | | | |

**Key safety fact**: CMS items can be created/deleted "directly in the live site, or... queued/drafted items to publish later" — CMS mutations are NOT implicitly draft-safe; the client must choose. Nothing auto-publishes; publishing is a separate explicit action.

## 5. Authentication Model (Q2)

- **Remote mode**: server runs remotely; OAuth authorization is per-site/per-workspace consent ("Select the Webflow sites and Workspaces... Authorize App"). No API keys stored locally. Transport is `mcp-remote` — **officially experimental**.
- **Local mode**: `npx -y webflow-mcp-server@latest` with `WEBFLOW_TOKEN`; token kinds: Site Token (single site), Workspace Token (all sites in workspace, docs recommend read-only), OAuth token (multi-site user-specific). Local Designer tools additionally require a registered/published MCP Bridge App Designer extension.
- **Role gate**: only site owners/admins can authorize the MCP server/app.
- **Scope model** (site-level): `assets:read/write`, `cms:read/write`, `pages:read/write`, `sites:read/write`, `components:read/write`, `forms:read/write`, `comments:read/write`, `custom_code:read/write` (Data Client apps only — not site tokens), `ecommerce`, `site_activity:read`, `site_config`, `users`, `webhooks`, `workspace:read/write`. Workspace tokens lack the `site` scope.
- Designer tools require the Bridge App open in the Designer (auto-installed to authorized sites after OAuth); Data tools work headless.

## 6. Rate and Permission Limits

- Data API plan-based: Starter/Basic **60 req/min**; CMS/eCommerce/Business **120 req/min**; Enterprise custom. HTTP 429 + `Retry-After` (~60s) on exceed; limits per API key; `X-RateLimit-Limit`/`X-RateLimit-Remaining` headers.
- **Site publish: one successful publish queue per minute** (endpoint-specific).
- Official SDK (used by the server) has built-in exponential backoff.
- MCP surface is a limited tool set — not a full API passthrough.

## 7. Non-Production Test Target (Q4)

Recommended: a **dedicated test workspace + dedicated test site** (free Starter plan suffices) with a site token carrying only read scopes for the smoke baseline (`cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`), escalating to `sites:write` only for a staging-only publish. Publishing to production is structurally separable: `POST /sites/{id}/publish` requires `customDomains` (production) OR `publishToWebflowSubdomain` (the `*.webflow.io` staging subdomain); smoke should only ever pass the staging flag, and can publish a single page via `pageId`. No API-level site duplication or backup/restore exists in Data API v2 (dashboard-only features); workspace tokens are not suitable as general write credentials.

## 8. Safety and Confirmation Requirements (Q5)

- **Confirmation-gated classes**: publish (`publish_site`, `publish_collection_items`, publishing-status changes via `update_page_settings`), destructive (`delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `remove_element`, `delete_variable`), deployment-capable (`run_workflow`, script registration).
- **No gate needed**: read-only actions and draft-safe mutations (beyond scope checks).
- **Named rollback**: staged-first discipline (publish to webflow.io subdomain before any production target). Rollback mechanics: CMS = re-publish prior content; pages = Designer version-history snapshot re-publish. **UNKNOWN**: API-level site restore (no backup/restore endpoints in Data API v2).

## 9. Classification Evidence (Q3)

`mcp-webflow` is a **transport**. Evidence: (a) the mcp-tooling hub registers external integrations as transport leaves (`mcp-<name>` folders, `mode-registry.json` + `hub-router.json` — confirmed by existing leaves mcp-figma, mcp-click-up, mcp-chrome-devtools, mcp-refero, mcp-mobbin, etc.); (b) all Webflow MCP mutations land in Webflow's cloud via Data/Designer APIs — never in this repository; (c) `run_workflow` executes user-configured Webflow workflows — Webflow-side managed operations, not repo orchestration. The transport executes; the hub orchestrates.

## 10. Design-Judgment Pairing (Q6)

- **Must pair with `sk-design`**: Designer-family operations — `deElement`, `deStyle`, `deVariable`, `deComponents`, `deAsset` tools (visual layout, tokens, components, assets, alt text) and `update_page_settings` (SEO/OG metadata).
- **No design judgment needed**: Data-family operations — CMS content CRUD, analytics, scripts registration, workflow runs, webhooks, comments.
- The transport never owns taste; it executes what `sk-design` decides.

## 11. Recommendations

1. Register `mcp-webflow` as a **transport leaf** under the mcp-tooling hub (`mcp-webflow/`), following the hub's mode-registry/hub-router registration pattern.
2. Prefer **remote OAuth mode** (`https://mcp.webflow.com/sse`) for the hub integration — no local secrets; accept the documented `mcp-remote` experimental status with a local `WEBFLOW_TOKEN` fallback (Node 22.3.0+).
3. Adopt the confirmation/rollback policy from Section 8; treat publish/destructive/deploy classes as confirmation-gated in the skill layer; never publish to custom domains from smoke flows.
4. Route all Designer-family operations through `sk-design`; keep Data-family operations transport-only.
5. Use the dedicated test workspace/site pattern (Section 7) for Phase 8 smoke; read-only scopes for baseline, staging-subdomain publish for the publish test.

## 11b. Eliminated Alternatives

| Approach | Reason Eliminated | Evidence | Iteration(s) |
|---|---|---|---|
| npm `webflow-mcp` as the server package | Third-party, unrelated to the official server | npm registry (0.4.0 vs official `webflow-mcp-server` 1.0.1) | 1 |
| Workspace token as general write credential | No `site` scope; docs recommend read-only use | workspace-token reference | 3, 4 |
| API-based site duplication/backup for test scaffolding | Not part of Data API v2 surface | scopes/endpoint index scan | 4 |
| Classifying `mcp-webflow` as a workflow system because of `run_workflow` | Transport executes Webflow-side managed workflows; hub orchestrates | workflows.ts + hub leaf layout | 5 |
| Treating CMS mutations as implicitly draft-safe | Official FAQ: items can be created/deleted directly in the live site | ai-tools FAQ | 3 |

## 12. Open Questions

- None of the six charter questions remain open. Residual unknowns: (a) exact behavior of `aiChat`/`enterprise`/`rules`/`webhooks` tool modules (existence source-verified; semantics not inspected); (b) API-level site restore — UNKNOWN, treated as unsupported; (c) remote OAuth stability given `mcp-remote` experimental status — mitigation chosen (local fallback).

## 13. Sources

1. https://webflow.com/blog/mcp-2-features (seed; MCP 2.0 capabilities)
2. https://raw.githubusercontent.com/webflow/mcp-server/main/README.md
3. https://raw.githubusercontent.com/webflow/mcp-server/main/package.json
4. https://api.github.com/repos/webflow/mcp-server/git/trees/main?recursive=1 (module inventory)
5. https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/*.ts (per-action inventory: index, pages, cms, workflows, scripts, sites, components, dePages, deElement, deVariable)
6. https://developers.webflow.com/data/docs/ai-tools.md (MCP overview, limitations, FAQs)
7. https://developers.webflow.com/data/reference/authentication.md
8. https://developers.webflow.com/data/v2.0.0/reference/scopes.md
9. https://developers.webflow.com/data/v2.0.0/reference/authentication/site-token.md
10. https://developers.webflow.com/data/v2.0.0/reference/authentication/workspace-token.md
11. https://developers.webflow.com/data/reference/rate-limits.md
12. https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md
13. https://developers.webflow.com/llms.txt
14. file:.opencode/skills/mcp-tooling/ (hub leaf + registry layout)
