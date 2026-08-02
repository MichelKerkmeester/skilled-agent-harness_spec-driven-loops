# Iteration 5: Classification, confirmation policy, and integration recommendation

## Focus

Final classification pass: (Q3) is `mcp-webflow` a workflow or a transport under the mcp-tooling hub contract; (Q5) confirmation/rollback policy mapping; (Q6) sk-design pairing boundary; plus integration recommendation for the 015 packet Phase 2.

## Findings

1. **Hub discriminator is `packetKind` on workspace mutation.** The mcp-tooling hub separates `packetKind: "workflow"` (mutates this repo's workspace, `mutatesWorkspace: true`: mcp-chrome-devtools, mcp-click-up, mcp-obsidian, mcp-aside-devtools) from `packetKind: "transport"` (never mutates this workspace, `mutatesWorkspace: false`: mcp-figma, mcp-refero, mcp-mobbin), each transport declared on the `transport-axis` extension with a mandatory cross-hub judgment pairing to `sk-design` (ADR-002). [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md:53-54; file:.opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md]
2. **Q3: `mcp-webflow` is a TRANSPORT.** Every mutation the MCP server can perform lands in Webflow's cloud (Data API v2 REST and Designer API canvas), never in this repository's workspace. The official surface itself distinguishes the families: `webflow_guide_tool` rules state "Data Tools are REST API calls, and Designer Tools are UI tools" — both are external bridges. There is no managed-operations engine in this repo; `run_workflow` executes Webflow-side managed workflows. Classification: transport leaf on the transport-axis, `backendKind` = remote/local external MCP server (`https://mcp.webflow.com/sse` or `npx webflow-mcp-server`), `mutatesWorkspace: false`. [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md; logs/evidence/tools/rules.ts; inference: transport-leaf registration shape follows mcp-figma/mcp-refero precedent]
3. **Q6: Designer-family operations pair with `sk-design`; Data-family operations do not.** The transport-axis requires judgment pairing for transports. The Webflow surface splits cleanly: (a) **Designer family** (bridge-bound, canvas visual decisions) — `deElement` (create/remove/set style/link/text/image/heading), `deStyle` (create/update/remove styles), `deVariable` (variable collections/modes/tokens), `deComponents` (component creation from screenshot, props/variants/slots/metadata), `deAsset` (asset/folder organization), `dePages` (page creation/switch) — MUST pair with `sk-design` before acting, since taste decisions drive these mutations; (b) **Data family** (content/structure operations, no taste) — CMS items, page settings/metadata, sites publish, scripts, webhooks, workflows, comments, enterprise — do not require design judgment. Boundary note: `update_page_settings` is metadata-only (no design), while `update_static_content` (page DOM) is design-relevant and should pair. [SOURCE: logs/evidence/tools/deElement.ts, deStyle.ts, deVariable.ts, deComponents.ts, deAsset.ts, dePages.ts; file:.opencode/skills/mcp-tooling/SKILL.md:140]
4. **Q5: Confirmation and rollback policy.** Confirmation-gated classes: (a) **publish-capable** — `publish_site`, `publish_collection_items`, `update_page_settings` when the payload flips publishing status; (b) **destructive** — `delete_collection_items`, `delete_all_site_scripts`, `delete_all_page_scripts`, `delete_webhook`, `delete_301_redirect`, `delete_robots_txt`, `remove_well_known_files`, `delete_variable`, `remove_element`, `remove_attribute`, `remove_style`, `unregister_component`; (c) **deployment-capable** — `run_workflow` (executes Webflow-side managed workflows; outcome depends on workflow configuration). Named rollbacks: re-PUT page settings, re-create webhooks/redirects/robots.txt/scripts, re-create CMS items. **UNKNOWN in the official surface**: API-level site restore/backup and restore of previously published item state — no such endpoint exists in Data API v2; CMS deletes on published items may hit the live site. [SOURCE: iteration-002/004 classifications; https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
5. **Integration recommendation (Phase 2 feed).** Register `mcp-webflow` as a transport leaf under the mcp-tooling hub: `packetKind: "transport"`, `transport-axis` extension with `crossHubPairing: sk-design` (Designer-family ops), `mutatesWorkspace: false`; backend = official `webflow/mcp-server` (npm `webflow-mcp-server`), remote OAuth (experimental `mcp-remote`) as primary connection with local `WEBFLOW_TOKEN` (site token) fallback; permission surface from the Q1/Q4 classification; confirmation policy from Q5; smoke target from Q4 (dedicated test workspace, webflow.io staging subdomain). Rate budget: 60/120 rpm per plan + 1 publish/min must be respected in the leaf's guardrails. [SOURCE: inference synthesized from hub contract + official docs; classification-labeled]
6. **Operational constraints for the integration.** Node.js 22.3.0+ runtime requirement for local mode; OAuth token stored by the client (`~/.mcp-auth`), reset-only recovery; only site owners/admins can authorize; per-site authorization means the hub leaf must track which sites are authorized; `ask_webflow_ai` and `webflow_guide_tool` are read-only helpers worth exposing unconditionally; comments tool is fully read-only (safe default). [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md; logs/evidence/tools/comments.ts]

## Sources Consulted

- [SOURCE: file:.opencode/skills/mcp-tooling/SKILL.md]
- [SOURCE: file:.opencode/skills/mcp-tooling/mode-registry.json]
- [SOURCE: file:.opencode/skills/mcp-tooling/feature-catalog/workflow-vs-transport-routing/workflow-vs-transport-routing.md]
- [SOURCE: logs/evidence/tools/rules.ts, deElement.ts, deStyle.ts, deVariable.ts, deComponents.ts, deAsset.ts, dePages.ts, comments.ts]
- [SOURCE: https://developers.webflow.com/data/v2.0.0/docs/ai-tools.md]

## Assessment

- **newInfoRatio: 0.40** — Q3/Q6 classification and integration recommendation are the final synthesis inputs; transport-axis mechanics were inferred from the hub contract (labeled inference).
- Confidence: high for the transport classification (workspace-mutation discriminator is objective); high for the Designer/Data pairing split (matches official tool-family distinction); medium for the specific leaf registration shape (follows mcp-figma/mcp-refero precedent — Phase 2 must confirm with the hub doctor checks).

## Reflection

- What worked: the hub's own two-axis routing doc made Q3 decidable in one pass; the official "Data Tools are REST, Designer Tools are UI" rule aligns with the pairing boundary.
- What failed: nothing material; remote-OAuth exact scope set for the MCP app remains unpublished (recorded UNKNOWN in iteration 3).
- Ruled out: mcp-webflow as a workflow system (no repo-side managed operations; mutations land in Webflow cloud); `run_workflow` as a hub-level orchestration feature (it executes Webflow-side workflows; the hub never orchestrates them).

## Recommended Next Focus

None — all six questions answered. Proceed to synthesis: compile research.md with the 17-section format, write resource-map.md, mark config complete, and emit the synthesis_complete + convergence_report events.
