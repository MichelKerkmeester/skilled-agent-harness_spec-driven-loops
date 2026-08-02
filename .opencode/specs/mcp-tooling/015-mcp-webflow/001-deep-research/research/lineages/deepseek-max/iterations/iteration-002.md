# Iteration 2: Per-action operation classification (Q1)

## Focus

Classify every official MCP tool action into read-only / draft-safe / destructive / publish-capable / deployment-capable, from the actual `src/tools/*.ts` source of the `webflow/mcp-server` repo (all 18 modules fetched and inspected).

## Findings

1. **Tool shape.** Each of the 18 modules registers exactly one MCP tool whose input schema is an `actions` array of optional per-action objects; each action maps 1:1 to a Webflow Data API v2 endpoint (GET/POST/PUT/PATCH/DELETE comments in source). `readOnlyHint` annotations: true for `aiChat`, `comments`, `rules`, `localDeMCPConnection`; false for every mutating module. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/pages.ts]

2. **Read-only surface (safe, no mutation).** `ask_webflow_ai` (Webflow AI Q&A over API knowledge); comments: `list_comment_threads`, `get_comment_thread`, `list_comment_replies`; rules: `webflow_guide_tool` (guidance/best-practices text, no side effects); `get_designer_app_connection_info`; sites: `list_sites`, `get_site`; pages: `list_pages`, `get_page_metadata`, `get_page_content`; cms: `get_collection_list`, `get_collection_details`, `list_collection_items`; components: `list_components`, `get_component_content`, `get_component_properties`; scripts: `list_registered_scripts`, `list_applied_scripts`, `get_page_script`; webhooks: `list_webhooks`, `get_webhook`; workflows: `list_workflows`, `list_workflow_runs`, `get_workflow_run`; enterprise: `list_301_redirects`, `get_robots_txt`, `list_site_activity_logs`; plus the `de*` getters/query_* family. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/*.ts]

3. **Draft-safe mutations (need publish to go live).** cms: `create_collection`, `create_collection_*_field`, `update_collection_field`, `create_collection_items`, `update_collection_items` (bulk draft writes; publish is a separate action); pages: `update_page_settings` (SEO/OG/slug/title — the schema also carries publishing status), `update_static_content` (secondary-locale DOM nodes); components: `update_component_content`, `update_component_properties`; scripts: `add_inline_site_script`, `upsert_page_script`; enterprise: `create_301_redirect`, `update_301_redirect`, `update_robots_txt`, `replace_robots_txt`, `add_well_known_file`; webhooks: `create_webhook`, `delete_webhook` (integration config, not site content); workflows: `run_workflow` (executes a pre-approved automation; blast radius depends on the workflow definition). [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/cms.ts]

4. **Explicit publish/deploy actions.** `publish_site` (POST /v2/sites/:site_id/publish) is the single site-level deploy action; `publish_collection_items` (POST /v2/collections/:collection_id/items/publish) deploys CMS item drafts to live. There is no other deploy path — every other mutation is draft/staging-scoped. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/sites.ts]

5. **Destructive actions (no trash/revert via MCP).** cms: `delete_collection_items` (permanent item deletion); scripts: `delete_all_site_scripts`, `delete_all_page_scripts`; webhooks: `delete_webhook`; enterprise: `delete_301_redirect`, `delete_robots_txt`, `remove_well_known_files`; de*: `remove_element`, `remove_attribute`, `remove_style`, `remove_properties`, `delete_variable`, `unregister_component`. None expose an undo endpoint; rollback must be re-applied state or git/site backup. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/deElement.ts]

6. **Designer/bridge-bound module families (`de*` + connection).** deAsset, deComponents, deElement, dePages, deStyle, deVariable, localDeMCPConnection operate on the live Designer canvas via the Bridge App (create/rename/select/switch pages, element builders, style/variable collections, component builder/unregister). These are draft operations inside Designer; they become visible only via `publish_site`. `de*` getters support the bridge's visual-snapshot workflow. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/dePages.ts]

7. **Enterprise module.** `data_enterprise_tool` is gated to Enterprise plans (301 redirects, robots.txt, well-known files, site activity logs) — capability varies by workspace tier. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/enterprise.ts]

## Sources Consulted

- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/{aiChat,cms,comments,components,deAsset,deComponents,deElement,dePages,deStyle,deVariable,enterprise,localDeMCPConnection,pages,rules,scripts,sites,webhooks,workflows}.ts] (18 files, fetched 200)

## Assessment

- **newInfoRatio: 0.85** — module inventory was known (iteration 1); per-action HTTP semantics, readOnlyHint flags, publish/destructive classes, and the Enterprise gate are net-new.
- Confidence: high (primary source code of the official server).

## Dead Ends

- `readOnlyHint` is only a hint: `sites` module carries `publish_site` with `readOnlyHint: false` but the module also hosts read actions — per-action classification from endpoint methods is authoritative, not the module flag.
- Action keys in `deVariable`/`deStyle` share names with schema property keys (`value`), so naive greps overstate action counts; classification above is from endpoint-level comments and handler calls only.

## Reflection

- What worked: HTTP-method comments in source = instant read vs mutate classifier; `actions` array schema makes the whole surface enumerable in one pass.
- What failed: nothing this round; greps needed two passes for property-name noise.

## Recommended Next Focus

Q2: pin the authentication model (remote OAuth flow + scopes, local token scope, per-workspace binding, token creation path, rate limits) and Q4: non-production test-target options from official auth/rate-limit/changelog docs.
