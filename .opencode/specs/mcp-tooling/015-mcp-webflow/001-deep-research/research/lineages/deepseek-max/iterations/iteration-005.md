# Iteration 5: Classification, confirmation policy, and integration recommendation

## Focus

Answer Q3 (workflow vs transport), Q5 (confirmation/rollback policy), and Q6 (sk-design pairing), and consolidate the integration recommendation for the mcp-tooling hub.

## Findings

1. **Q3 answered — `mcp-webflow` is a TRANSPORT.** The mcp-tooling hub registers each external integration as a transport leaf (`mcp-<name>` folders with `mode-registry.json` + `hub-router.json` registration; confirmed by hub layout: mcp-figma, mcp-click-up, mcp-chrome-devtools, etc.). Webflow MCP mutations land in Webflow's cloud via its Data/Designer APIs — they never touch this repository — so the transport classification holds. The surface does include workflow-execution capability (`run_workflow` executes user-configured Webflow workflows), but that is a Webflow-side managed operation, not a replacement for this repo's workflow system: the transport executes, it does not orchestrate. [SOURCE: file:.opencode/skills/mcp-tooling/ leaf layout + hub-router.json; https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/workflows.ts]
2. **Q5 answered — confirmation/rollback policy.** Confirmation-required operation classes: publish (sites `publish_site`, CMS `publish_collection_items`, `update_page_settings` with publishing-status change), destructive (`delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, Designer `remove_element`, `delete_variable`), and deployment-capable (`run_workflow`, script registration). Read-only and draft-safe mutations need no confirmation gate beyond scope checks. Named rollback: Webflow maintains Designer version history and per-minute publish queue; for CMS items the rollback is a re-publish of previous content, and for pages a Designer snapshot re-publish — exact API-level restore is UNKNOWN (no backup/restore endpoints in Data API v2). Rollback must be staged-first: publish to `publishToWebflowSubdomain` before any production target. [SOURCE: iteration-002 action inventory; https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md; UNKNOWN marker on API restore]
3. **Q6 answered — design-pairing boundary.** Designer-family operations MUST pair with `sk-design` judgment: `deElement`/`deStyle`/`deVariable`/`deComponents`/`deAsset` tools (visual layout, tokens, components, assets, alt text) and `update_page_settings` (SEO/OG metadata). Data-family operations do NOT need design judgment: CMS content CRUD, analytics, scripts registration, workflow runs, webhooks, comments. The transport never owns taste; it executes what `sk-design` decides. [SOURCE: iteration-002 module map; https://developers.webflow.com/data/docs/ai-tools.md]
4. **Integration recommendation for the hub**: register `mcp-webflow` as a transport leaf in the mcp-tooling hub. Preferred mode: **remote** (`https://mcp.webflow.com/sse` + OAuth, no local secrets; companion app auto-installs for Designer tools) — with the caveat that remote authorization currently rides the experimental `mcp-remote` package; local fallback (`WEBFLOW_TOKEN`, Node 22.3.0+) fits environments where a token vault already exists. Designer tools require the Bridge App open in the Designer; Data tools work headless. [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md; https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
5. **Supporting surfaces**: per-site Agent Instructions (each site can guide how agents work on it); prompt library and skills in the MCP app; docs LLMS.txt at https://developers.webflow.com/llms.txt; a separate docs MCP at https://developers.webflow.com/_mcp/server (developer documentation Q&A — aiChat-style). [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md; https://developers.webflow.com/llms.txt]

## Sources Consulted

- [SOURCE: file:.opencode/skills/mcp-tooling/ (hub leaf + registry layout)]
- [SOURCE: https://developers.webflow.com/data/docs/ai-tools.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/workflows.ts]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/sites/publish.md]
- [SOURCE: https://developers.webflow.com/llms.txt]

## Assessment

- **newInfoRatio: 0.4** — Classification answers and integration recommendation are new; all supporting facts trace to earlier iterations.
- Confidence: high for Q3 (hub layout is concrete repo evidence) and Q6 (module semantics); Q5 rollback carries an explicit UNKNOWN on API-level restore.

## Reflection

- What worked: grounding classification in the actual hub structure instead of guessing; scopes + publish reference made Q4/Q5 concrete.
- What failed: nothing new; earlier-documented 404 slug issues persist.
- Ruled out: treating `run_workflow` as a reason to classify mcp-webflow as a workflow system (transport executes, hub orchestrates); relying on API-level restore for rollback (unsupported).

## Recommended Next Focus

Lineage complete at 5 iterations; synthesize research.md with the required coverage: tool inventory and operation classes, authentication model, rate/permission limits, safety and confirmation requirements, non-production test target, and Q3 classification evidence.
