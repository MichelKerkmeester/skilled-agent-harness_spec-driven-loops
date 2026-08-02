# Iteration 4: Publish semantics and non-production test target

## Focus

Pin down publish semantics (staging vs production, page-level vs site-level) and define the non-production test-target profile for live smoke (Q4), with confirmation-gating evidence for Q5.

## Findings

1. **Publish endpoint semantics.** `POST /v2/sites/{site_id}/publish` publishes a site OR an individual page (via `pageId` parameter) to one or more domains. Request body must include at least one of `customDomains` or `publishToWebflowSubdomain`. Required scope: `sites:write`. Response is `202 Accepted` (async publish queue). Rate limit: **one successful publish per minute**. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]
2. **Staging → production staging semantics.** "If multiple individual pages are published to staging, publishing from staging to production publishes all staged changes." Publishing to staging (`publishToWebflowSubdomain`, the webflow.io subdomain) is a genuinely non-production path: nothing reaches production domains until an explicit production-domain publish is issued. [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]
3. **Page-status flip is publish-capable.** `update_page_settings` (PUT /v2/pages/:page_id) "Update page settings including SEO metadata, Open Graph data, slug, and **publishing status**" — the payload can move a page draft→published. This makes `data_pages_tool` the one Data tool whose "settings" mutation can itself change live status without calling a publish endpoint. [SOURCE: logs/evidence/tools/pages.ts]
4. **CMS publish is bulk and explicit.** `publish_collection_items` (POST /v2/collections/:collection_id/items/publish) takes item IDs (or items) to publish — always an explicit, separate action from create/update. `delete_collection_items` is the destructive CMS action; CMS mutations can affect the live site once items are published (official FAQ). [SOURCE: logs/evidence/tools/cms.ts; https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md]
5. **Official guidance favors a fresh project.** "Start with a fresh project for better MCP performance — MCP servers perform more efficiently with smaller codebases." This corroborates a dedicated small test site rather than a production site for smoke work. [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md §"Start with a fresh project"]
6. **Non-production test target profile (Q4).** (a) Dedicated test **workspace** (not the production workspace): authorization is per-site/workspace and owner/admin-gated, so a separate workspace isolates authz decisions; (b) a small Starter-plan test site inside it — free tier sites still support Data API access with a site token; (c) read-only scope baseline for smoke: `sites:read`, `pages:read`, `cms:read`, `assets:read`, `components:read`, `comments:read`, `forms:read`, `site_activity:read` — writes added per-test with named rollback; (d) publish smoke restricted to `publishToWebflowSubdomain` (webflow.io staging) on the test site, single page via `pageId`, respecting the 1 publish/min limit; (e) never authorize the production site to the MCP app. [SOURCE: inference synthesized from https://developers.webflow.com/data/v2.0.0/reference/scopes.md, publish.md, ai-tools.md — profile assembly is explicit inference]
7. **Confirmation/rollback mapping (Q5 evidence).** Operations requiring explicit operator confirmation: every publish-capable action (`publish_site`, `publish_collection_items`, `update_page_settings` with status flip), every destructive action (`delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `delete_webhook`, `delete_301_redirect`, `delete_robots_txt`, `remove_well_known_files`, `delete_variable`, `remove_element`, `remove_attribute`, `remove_style`, `unregister_component`), and `run_workflow` (deployment-capable). Named rollback exists for CMS items (delete is reversible only via re-create; UNKNOWN whether published-item deletion is recoverable — API-level site restore is not part of the Data API v2 surface), page settings (re-PUT prior values), scripts (re-upload), webhooks/redirects/robots (re-create). Site-level restore and item-level publish history restore are UNKNOWN in the API surface. [SOURCE: inference from src/tools/*.ts classification (iteration 2) + https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/scopes.md]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md]
- [SOURCE: logs/evidence/tools/pages.ts, logs/evidence/tools/cms.ts]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]

## Assessment

- **newInfoRatio: 0.55** — Staging semantics, pageId publishing, fresh-project guidance, and the assembled test-target profile are net-new; publish endpoint and CMS classes carried from iteration 2.
- Confidence: high on publish/staging semantics (official reference). The test-target profile (finding 6) is explicitly assembled inference from official primitives — labeled as such. API-level restore availability: UNKNOWN (not found in Data API v2 surface).

## Reflection

- What worked: publish reference page answered staging semantics precisely; `pageId`/`publishToWebflowSubdomain` params map directly to the tool schema seen in iteration 2.
- What failed: no official "developer workspace"/sandbox doc exists in llms.txt — test-target guidance had to be assembled from primitives (inference labeled).
- Ruled out: treating staging publish as production-safe-by-default (staging→production publish is a separate explicit step; safe only because the production publish is never issued); treating `update_page_settings` as purely metadata (it flips publishing status).

## Recommended Next Focus

Final classification iteration (Q3/Q5/Q6): classify `mcp-webflow` as workflow vs transport against the mcp-tooling hub layout, map confirmation classes to the hub's confirmation/rollback policy, and define the sk-design pairing boundary, then write the synthesis.
