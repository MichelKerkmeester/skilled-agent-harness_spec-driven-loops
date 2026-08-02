# Research Synthesis: Webflow MCP 2.0 (cross-lineage)

> Phase 1 deep research for `mcp-webflow` (015). Two lineages ran to the forced-depth maximum: `deepseek-max` (cli-pi / deepseek-v4-flash / max thinking, 5 iterations) and `luna-fast` (cli-pi transport / gpt-5.6-luna / max reasoning, 5 iterations). Convergence was telemetry-only; the `max-iterations` stop policy was honored. No Webflow MCP tools, credentials, OAuth handshakes, mutations, publish calls, or deployment actions were used anywhere in the research.

## 1. Executive Summary

Webflow MCP 2.0 is an official, actively maintained MCP server (`github.com/webflow/mcp-server`, npm `webflow-mcp-server@1.0.1`) that exposes Webflow's Data API v2 and Designer API as a bounded, combined-tool MCP surface (18 tool modules with per-action schemas) — not a full API passthrough. Two connection modes exist: **remote OAuth** (`https://mcp.webflow.com/sse`, `mcp-remote` transport, officially experimental) and **local bearer token** (`WEBFLOW_TOKEN`, `npx -y webflow-mcp-server@latest`, Node 22.3.0+). The Designer "Bridge App" is required only for canvas-bound Designer operations; data operations run headless. The marketing headline "no more bridge app" is bounded, not absolute.

Operations classify cleanly into read-only, draft-safe, destructive, publish-capable, and deployment-capable buckets. CMS mutations are **not** implicitly draft-safe (items can be created/deleted directly in the live site); nothing auto-publishes; publishing is always a separate explicit action with a one-per-minute queue. Rate limits are plan-based (60/120 rpm with `Retry-After` on 429).

**Classification (both lineages agree): `mcp-webflow` is a `transport`**, not a workflow: the hub registers external integrations as transport leaves; all mutations land in Webflow's cloud; the transport executes, the hub orchestrates, and `sk-design` owns all design judgment.

**Safe integration posture (luna-fast, fail-closed)**: classify every action; require progressively stronger confirmations for destructive/publish/deploy classes; keep publishing behind its own gate; honor `Retry-After`; never blindly replay ambiguous non-idempotent writes; route all Designer-family operations through `sk-design`.

## 2. Research Questions (charter Q1–Q6)

| ID | Question | Result |
|----|----------|--------|
| Q1 | Which MCP 2.0 actions are read-only, draft-safe, destructive, publish-capable, or deployment-capable? | **Answered** — full inventory in §4 (deepseek-max) + announcement-vs-docs confirmation in §3 (luna-fast). |
| Q2 | Does the official surface use remote OAuth, a local server, an API token, or a client-specific connection flow? | **Answered** — both modes exist; remote OAuth is experimental, local bearer token is the stable fallback (§5). |
| Q3 | Is `mcp-webflow` a `workflow` or a `transport`? | **Answered — transport** (§9, both lineages agree). |
| Q4 | What non-production Webflow workspace or site can support live smoke? | **Answered** — dedicated test workspace + Starter site; read-only scopes baseline; staging-subdomain publish only (§7). |
| Q5 | Which operations require explicit operator confirmation, and which require a named rollback? | **Answered** — publish/destructive/deploy gated; staged-first rollback (§8). |
| Q6 | Which operations must pair with `sk-design`? | **Answered** — all Designer-family operations (§10). |

## 3. Announcement vs Documentation (luna-fast lineage)

- The MCP 2.0 announcement's headline categories (components with props/variants/slots, variable collections and modes, Agent Instructions, forms/submissions, page branches, assets/compression, custom code, Enterprise history, analytics) map to official documentation at the category level.
- Several sub-claims (variable reordering/modes, screenshot-to-component, forms/submissions, WebP/AVIF compression, Enterprise history queries, traffic analytics) were **not explicitly confirmed** in the fetched primary pages — recorded as unresolved verification gaps, not as non-existence.
- **Version-surface contradiction (must handle explicitly in Phase 3)**: the public `webflow/mcp-server` README still shows `/sse` and omits resources, while the hosted docs describe the newer remote `/mcp` surface. Phase 3 must pin the transport version and reconcile these surfaces.
- Agent Instructions are confirmed: markdown rules/skills supplied to connected agents, with shared-library distribution, mode awareness, role enforcement, and activity logging.

## 4. Tool Inventory and Operation Classes (deepseek-max lineage)

Combined-tool pattern: one MCP tool per module with an `actions` array; per-action classes derive from the underlying HTTP method + payload.

| Module | Read-only | Draft-safe mutation | Destructive | Publish-capable | Deployment-capable |
|---|---|---|---|---|---|
| pages | `list_pages`, `get_page_metadata`, `get_page_content` | `update_page_settings` | — | `update_page_settings` (status) | — |
| cms | `get_collection_list`, `get_collection_details`, `list_collection_items` | `create_collection`, `create/update_collection_*`, `create/update_collection_items` | `delete_collection_items` | `publish_collection_items` | — |
| sites | `list_sites`, `get_site` | — | — | `publish_site` | — |
| workflows | `list_workflows`, `list_workflow_runs`, `get_workflow_run` | — | — | — | `run_workflow` |
| scripts | `list_registered_scripts`, `list_applied_scripts`, `get_page_script` | `add_inline_site_script`, `upsert_page_script` | `delete_all_site_scripts`, `delete_all_page_scripts` | — | script registration ships with publish |
| components | `list_components`, `get_component_content`, `get_component_properties` | `update_component_content`, `update_component_properties` | — | — | — |
| dePages | — | `create_page`, `create_page_folder`, `switch_page` | — | — | — |
| deElement | `query_elements`, `get_selected_element`, snapshot | `select_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, `add_or_update_attribute`, `update_id_attribute` | `remove_element`, `remove_attribute` | — | — |
| deVariable | `get_variable_collections`, `get_variables`, `query_variables` | `create_variable_collection`, `create_variable_mode`, `create/update_*_variable`, `rename_variable` | `delete_variable` | — | — |
| Not inspected (existence source-verified) | aiChat, comments, enterprise, rules, webhooks, localDeMCPConnection | | | | |

**Key safety fact**: CMS items can be created/deleted "directly in the live site, or queued/drafted to publish later" — the client must choose; CMS mutations are NOT implicitly draft-safe.

## 5. Authentication and Transport (Q2)

- **Remote mode**: OAuth per-site/per-workspace consent; no API keys stored locally; only site owners/admins can authorize. `mcp-remote` is **officially experimental**.
- **Local mode**: `WEBFLOW_TOKEN`; token kinds — Site Token (single site), Workspace Token (all sites, docs recommend read-only; lacks `site` scope), OAuth token (multi-site). Local Designer tools additionally require a registered/published MCP Bridge App Designer extension.
- Scope model (site-level): `assets/cms/pages/sites/components/forms/comments/custom_code:read/write`, `ecommerce`, `site_activity:read`, `site_config`, `users`, `webhooks`, `workspace:read/write`. `custom_code` is Data Client apps only (not site tokens).

## 6. Rate and Operational Limits

- Data API plan-based: Starter/Basic 60 req/min; CMS/eCommerce/Business 120 req/min; Enterprise custom. HTTP 429 + `Retry-After` (~60s); `X-RateLimit-Limit`/`X-RateLimit-Remaining` headers; official SDK has built-in exponential backoff.
- Site publish: one successful publish queue per minute.
- MCP surface is a limited tool set, not a full API passthrough.

## 7. Non-Production Smoke Target (Q4)

Dedicated test workspace + dedicated test site (free Starter plan suffices). Baseline token carries read-only scopes (`cms:read`, `pages:read`, `sites:read`, `assets:read`, `components:read`, `forms:read`, `authorized_user:read`); escalate to `sites:write` only for a staging-subdomain publish. Production vs staging is structurally separable: `POST /sites/{id}/publish` requires `customDomains` (production) **or** `publishToWebflowSubdomain` (`*.webflow.io`); smoke must only ever pass the staging flag, optionally scoped to a single `pageId`. No API-level site duplication/backup/restore exists in Data API v2 (dashboard-only features).

## 8. Safety, Confirmation, and Rollback Policy (Q5)

- **Confirmation-gated classes**: publish (`publish_site`, `publish_collection_items`, publishing-status changes via `update_page_settings`), destructive (`delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `remove_element`, `delete_variable`), deployment-capable (`run_workflow`, script registration).
- **No gate needed**: read-only actions and draft-safe mutations (beyond scope checks).
- **Rollback**: staged-first discipline (webflow.io subdomain before any production target). CMS rollback = re-publish prior content; pages = Designer version-history snapshot re-publish. **UNKNOWN**: API-level site restore (no backup/restore endpoints).

## 9. Classification Evidence (Q3 — transport)

(a) The hub registers external integrations as transport leaves (`mcp-<name>` folders + `mode-registry.json`/`hub-router.json`; existing leaves: mcp-figma, mcp-click-up, mcp-chrome-devtools, mcp-refero, mcp-mobbin). (b) All Webflow MCP mutations land in Webflow's cloud — never in this repository. (c) `run_workflow` executes Webflow-side managed workflows. The transport executes; the hub orchestrates.

## 10. Design-Judgment Pairing (Q6)

- **Must pair with `sk-design`**: Designer-family operations — deElement, deStyle, deVariable, deComponents, deAsset tools and `update_page_settings` (SEO/OG metadata).
- **No design judgment needed**: Data-family operations — CMS CRUD, analytics, scripts registration, workflow runs, webhooks, comments.

## 11. Recommendations (for Phase 2 freeze)

1. Register `mcp-webflow` as a **transport leaf** under the mcp-tooling hub, following the mode-registry/hub-router registration pattern.
2. **Backend**: prefer remote OAuth mode (`https://mcp.webflow.com/sse`) for zero local secrets, accepting the documented experimental `mcp-remote` status with the local `WEBFLOW_TOKEN` fallback (Node 22.3.0+) as the deterministic default for automation. Phase 3 must pin the transport version and reconcile the README `/sse` vs hosted `/mcp` surface contradiction.
3. **Permissions/auth**: site-token scopes for automation (read-only baseline; escalate per operation class); workspace tokens only read-only.
4. **Confirmation policy**: publish/destructive/deploy classes are confirmation-gated in the skill layer (never a bare tool passthrough); read-only and draft-safe pass without a gate.
5. **Rollback**: staged-first; publishing only to `publishToWebflowSubdomain` from smoke flows; never `customDomains`.
6. **Design pairing**: route all Designer-family operations through `sk-design`; Data-family stays transport-only.
7. **Phase 8 smoke**: dedicated test workspace + Starter site; read-only baseline; single-page staging publish as the only mutating test.

## 11b. Eliminated Alternatives (negative knowledge)

| Approach | Reason Eliminated | Evidence |
|---|---|---|
| npm `webflow-mcp` as the server package | Third-party, unrelated to the official server | npm registry (0.4.0 vs official `webflow-mcp-server` 1.0.1) |
| Workspace token as general write credential | No `site` scope; docs recommend read-only | workspace-token reference |
| API-based site duplication/backup for test scaffolding | Not part of Data API v2 surface | scopes/endpoint index |
| Classifying `mcp-webflow` as a workflow because of `run_workflow` | Transport executes Webflow-side managed workflows; hub orchestrates | workflows module + hub leaf layout |
| Treating CMS mutations as implicitly draft-safe | Official FAQ: items can be created/deleted directly in the live site | ai-tools FAQ |
| cli-opencode fan-out lineage for this research | Workflow pool's 5-minute lag ceiling aborts lineages whose first iteration exceeds 5 minutes (observed 9+ min); substituted cli-pi transport with the same model tier | fanout-pool stall records, this research's orchestration logs |

## 12. Methodology, Transport Deviation, and Attribution

- **Lineages**: `deepseek-max` (cli-pi / deepseek-v4-flash / max, 5 iterations, source-level inventory) and `luna-fast` (cli-pi transport / gpt-5.6-luna / max, 5 iterations, announcement-vs-docs verification + fail-closed posture). Both lineage syntheses are complete at `research/lineages/{deepseek-max,luna-fast}/research.md`.
- **Deviation (recorded)**: the packet specified the `luna-fast` lineage on `cli-opencode` (openai/gpt-5.6-luna-fast, xhigh). The workflow's fan-out pool aborts any lineage whose first artifact exceeds the 5-minute lag ceiling (non-disableable, capped at 300000 ms), and the cli-opencode/native dispatch paths were rejected by the workflow's own router in automated contexts. The lineage was therefore run through the pool's `cli-pi` transport with the `gpt-5.6-luna` model tier (the same GPT-5.6 Luna research tier) — same workflow, same state machine, same iteration contract. The dry-run (`confirm` flow) passed before the live run.
- **Infrastructure finding (negative knowledge, for the deep-loop team)**: `fanout-pool.cjs`'s stall detector (lag ceiling, default/cap 5 min) false-fires on lineages whose first iteration legitimately takes longer than 5 minutes; recommend a configurable ceiling or first-iteration grace in a future deep-loop packet.
- **Attribution**: all load-bearing claims carry `[SOURCE: URL]` or `[INFERENCE: ...]` markers inside the lineage iterations. Official sources lead (webflow.com, developers.webflow.com, github.com/webflow/mcp-server); the seed article is `https://webflow.com/blog/mcp-2-features`.
- **No Webflow mutation** was performed at any point (REQ-006 honored; enforced by research scope).

## 13. Open Questions

- None of the six charter questions remain open. Residual unknowns: (a) exact semantics of `aiChat`/`enterprise`/`rules`/`webhooks` tool modules (existence source-verified, semantics not inspected); (b) API-level site restore — UNKNOWN, treated as unsupported; (c) remote OAuth stability given experimental `mcp-remote` status — mitigation chosen (local fallback + version pin).
