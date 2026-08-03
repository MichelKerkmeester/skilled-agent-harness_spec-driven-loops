# Research Synthesis: mcp-webflow Webflow MCP 2.0 Quality Gaps

> Detached fan-out lineage: `luna-max-fast` | Executor: `cli-opencode` (`openai/gpt-5.6-luna-fast`) | Stop policy: `max-iterations` (5) | Convergence: telemetry only

## 1. Executive Summary

The `.opencode/skills/mcp-tooling/mcp-webflow` packet is materially useful but is both too concise and missing important Webflow MCP 2.0 logic. It has the right broad safety vocabulary, but several omissions and contradictions can cause an operator or agent to select the wrong surface, treat a draft as live, publish with the wrong blast radius, or believe that a local OSS capability proves the hosted remote contract.

The five iterations produced 36 distinct findings: 5 P0, 24 P1, and 7 P2. The P0 set is concentrated in CMS draft encoding, CMS publish-target semantics, custom-code gate semantics, Enterprise robots replacement, and remote/local/version reproducibility. The P1 set covers the Designer canvas model, CMS and page workflows, scripts/forms/localization/assets, webhooks/Enterprise/governance/WHTML/error handling, and packet release/link/schema traceability. P2 findings are primarily concise operational guidance, incomplete action enumeration, and example provenance.

The final inventory pass read 5/5 named references, 2/2 shared assets, 5/5 `assets/examples/*` files, the feature-catalog root plus 9/9 cards, and 17/17 manual-testing scenarios. The packet is therefore not missing those files as a corpus; it is missing cross-file contracts, exact schemas, surface/version provenance, and coverage traceability. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:3-5]

No Webflow MCP call, credential, OAuth handshake, mutation, publish call, or live-site test was performed. The hosted endpoint, deployed package/commit, exact action schemas, and `prompts`/`resources` capability remain an explicit verification gate rather than an inferred fact. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:113-138]

## 2. Scope and Method

The audit compared packet-local evidence against official Webflow MCP documentation, Webflow Data API references, official changelog entries, and the official `webflow/mcp-server` repository. Local packet files were treated as evidence inputs, not authority when they contradicted the action reference or official surface. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-strategy.md:53-58]

The loop ran exactly five evidence iterations because `stopPolicy=max-iterations`; early convergence was not allowed to terminate the run. The iteration new-information ratios were `1.00`, `0.93`, `1.00`, `1.00`, and `1.00`. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-state.jsonl:3-7]

## 3. Question Status

| Question | Result |
|---|---|
| Q1 Designer canvas, Bridge App, element tree, components, styles, variables, breakpoints | Substantially mapped; six P1 and two P2 corrections remain. |
| Q2 CMS, publish/branches, scripts, forms, localization, sites, assets/compression | Mapped across iterations 2-3; draft, publish, custom-code, localization, and asset boundaries need correction. |
| Q3 Webhooks, Enterprise, AI, Agent Instructions, WHTML, utility tools, rate/error semantics | Mapped in iteration 4; webhook/version and robots safety contradictions remain. |
| Q4 Remote hosted versus local OSS reconciliation | Partially answered; module-level alignment is visible, but a pinned live fixture is missing. |
| Q5 Packet references/assets/cards/scenarios too concise or missing logic | Answered by the complete inventory audit in iteration 5. |
| Q6 Concrete P0/P1/P2 file-level recommendations | Answered by the severity and residual recommendation matrices below. |

The reducer still reports six machine-open questions because leaf `answeredQuestions` were focus-scoped rather than full canonical question strings. This is a state-projection limitation, not evidence that the five focus areas were skipped; the substantive status above is based on the cited iteration evidence. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/findings-registry.json:8-79]

## 4. Official Surface Model

### Designer and Bridge boundary

Webflow separates Data API work from live Designer canvas state. Page, mode, branch, component-view, selection, navigation, snapshots, and current breakpoint behavior are Bridge-App-dependent; data-plane elements, components, styles, variables, CMS, pages, and assets can be handled without the live canvas. Designer edits remain draft-only until an explicit publish operation. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-30]

### Content and release boundary

CMS item draft state is explicit, and item publish is not the same operation as site publish to a selected Webflow subdomain or custom domain. Page branches expose create/list/details/delete behavior in the documented MCP surface; no merge operation was established. Site publishing is queued and has a broader staged-change blast radius than a single page receipt implies. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: https://developers.webflow.com/mcp]

### Remote, OSS, and packet boundary

The official OSS repository is useful for local implementation evidence, but it is not proof of the deployed remote surface. The official hosted page, OSS README, and local packet currently disagree on endpoint and capability provenance, while the local server pointer uses `@latest`. The official OSS export list aligns with the packet's 18-module baseline at module level, but that does not establish the remote 31-tool/220-action snapshot or its schemas. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-24]

## 5. P0 Findings

### P0-1: CMS draft encoding is unsafe

The packet labels a payload and scenario as creating a draft but omits an explicit `isDraft: true`. Official item schemas expose draft/archive/publish/locale state, and the official OSS adapter defaults an omitted draft value to false. Add an explicit draft field, state the remote/local difference, and require read-back of `isDraft`, `lastPublished`, and locale before treating the write as draft-safe. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:7-8] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:48-55] [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/cms.ts]

### P0-2: CMS item publish is falsely described as staging-targeted

The CMS card correctly says item publish has no staging-domain target, while the publish/deploy card calls the same action staging-first. The item endpoint accepts collection/item identifiers, not a domain selector. Reserve staging-subdomain language for `publish_site`, describe item publish as a separate live CMS publish, and add a confirmation scenario that rejects domain assumptions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:9-10] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:26-35] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/publish-deploy.md:24-35] [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md]

### P0-3: Custom-code release gates conflict

The action reference labels script registration/application as draft writes, while `mcp-wiring.md` groups script registration with deploy confirmation and the cards say scripts ship with publish. Official OSS behavior also includes inline-script length and replacement semantics. Reconcile remote and OSS behavior in one matrix, document registration versus application versus publish, and add confirmation plus read-back evidence for custom-code changes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:7-8] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:316-341] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:174-183] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/scripts.ts]

### P0-4: Robots replacement lacks a high-impact safety gate

`replace_robots_txt` is represented as an ungated draft write even though the official Enterprise API distinguishes PATCH, complete PUT replacement, and DELETE behavior that can make a user agent unrestricted. Require a pre-read/diff/post-read flow, Enterprise and scope checks, and explicit confirmation for replacement and rule deletion. Preserve the remote/OSS method-shape discrepancy as version evidence. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:9-10] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:228-244] [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-configuration/robots-txt/put.md] [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-configuration/robots-txt/delete.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/enterprise.ts]

### P0-5: Remote/local authority is not reproducible

The current hosted guidance, OSS README, and local packet disagree on the remote endpoint and capability claims. Local registration launches `webflow-mcp-server@latest` without a pinned package/commit, endpoint fixture, action-schema digest, or recorded `prompts`/`resources` result. Add a dated fixture and make discovery consume it before any action; pin after capture. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:9-10] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:22-39] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:113-138] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/mcp-servers/webflow-mcp/README.md:12-18] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]

## 6. P1 Findings

### Designer and Bridge

1. **Canvas state classification is inconsistent.** Separate Bridge-bound navigation/state mutations from site-tree draft writes and align gate labels. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:7-8] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:25-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]
2. **Element-tree queries are too opaque.** Document query dimensions, target-id shape, and a discovery-to-mutation example. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:9-10] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:188-207]
3. **Style class/combo-class/raw-CSS semantics are omitted.** Add class identity, combo-class, raw-CSS, breakpoint, and read-back behavior. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:11-12] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:86-95]
4. **Breakpoint behavior is incomplete.** Reconcile current-breakpoint selection with the local read-only inventory and add version-qualified verification. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:13-14] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]
5. **Branch isolation implies an unsupported merge.** Document create/list/details/delete, state explicitly whether merge is outside the surface, and add deletion confirmation. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:15-16] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]
6. **The component-variants card contradicts the action reference.** Rebuild it from exact variant actions, parameters, and risk classes, then add read/update/read-back coverage. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:17-18] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:11-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]

### CMS, pages, and release

7. **CMS reads lack state read-back.** Assert draft/archive/locale/last-published state in read and pairing scenarios. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:11-12] [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/update-item.md]
8. **Site publish lacks completion and blast-radius checks.** Distinguish `202 Accepted` from completion, record scope/domain, and separately gate production promotion of all staged changes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:13-14] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/safety-gate/pubgate.md:20-30]
9. **Page-settings writes lack a status-safe contract.** Add separate draft-safe and explicit publish bodies, postconditions, and slug/page-type/locale caveats. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:15-16] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/pages.ts] [SOURCE: https://developers.webflow.com/home/changelog/2026/5/12.md]
10. **Branch lifecycle is not reconciled across remote and OSS.** Add a remote-only lifecycle matrix and explicit no-merge statement. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:17-18] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/dePages.ts]

### Scripts, forms, localization, sites, and assets

11. **Forms have no usable schema or deletion contract.** Add form/schema/submission payloads, scope and pagination fields, redaction, update read-back, and deletion confirmation. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:9-10] [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list.md] [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-submissions.md]
12. **Localization examples promise unsupported locale management.** Reframe the card as locale-scoped content read/update, remove create/delete claims, and add locale read-back. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:11-12] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:280-292]
13. **Schema-markup actions are missing from the site/pages card.** Add bulk/query schema actions, fields, applicability, gates, and a scenario. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:13-14] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]
14. **Asset/compression coverage lacks lifecycle and remote/local boundaries.** Add upload/compress/task polling/variant read-back, deletion isolation, and separate Data Assets versus Designer Assets behavior. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:17-18] [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/deAsset.ts]

### Webhooks, Enterprise, governance, and reliability

15. **Webhook CRUD omits delivery semantics.** Add filters/triggers, signed headers, HMAC provenance, 200 response, retries/deactivation, registration limits, and remote/OSS trigger qualification. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:7-8] [SOURCE: https://developers.webflow.com/data/docs/working-with-webhooks] [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md]
16. **Redirect and activity-log workflows omit pagination and partial results.** Add fields, limits, actor/source attribution, mixed-plan failures, and preserved successful results. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:11-12] [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-configuration/301-redirects/get.md] [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-activity-logs/list.md]
17. **Agent Instructions omit provenance and resolution.** Add search/read URI and inline-reference behavior, Shared Library provenance, cascade effects, and read-back. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:13-14] [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
18. **Utility and AI tools lack guide-first behavior.** Add `get_guidelines`, specialized-tool discovery, asset preview, and AI Q&A scope; distinguish documentation Q&A from site mutation. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:15-16] [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:473-491]
19. **WHTML has no operational contract.** Add remote-only status, valid root/CSS constraints, five-fragment limit, payload, response/read-back, and `sk-design` pairing. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:17-18] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/operations/sitemap-scripts-assets-whtml.md:1-61]
20. **Structured errors and partial results are under-specified.** Add error-code/details mapping, no-retry rules for ambiguous writes, and one successful-plus-failed combined-action scenario. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:19-20] [SOURCE: https://developers.webflow.com/data/reference/error-handling.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/enterprise.ts]
21. **The action-family matrix is incomplete for release semantics.** The above surface families need one authoritative remote/local/version matrix rather than separate prose that can drift. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:28-36] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56]

### Packet controls

22. **Release metadata and scenario counts disagree.** Correct every `16` to `17`, add a common freshness/version stamp, require metadata on cards/examples/scenarios, and add a count/release CI check. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:11-12] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/README.md:33-64] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:21-31]
23. **Catalog and playbook links point to the wrong authority.** Correct the CMS source link and PAIR-002 feature link, then validate category/action-family destinations. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:13-14] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:64-77] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/pairing/pair-data.md:63-86]
24. **Scenario coverage is not action-schema traceable.** Add action-family -> scenario -> surface/version -> evidence or skip mapping, and make discovery use `tool_info`/schema checks rather than counts alone. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:17-18] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/discover.md:20-50]

## 7. P2 Findings

1. Component metadata, prop constraints, and slot behavior are listed but lack field, type/default, validation, and read-back examples. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:19-20] [SOURCE: https://developers.webflow.com/mcp]
2. Variable modes are described as a workflow but lack per-mode value, binding, remove, and verification details. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:21-22] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:374-417]
3. CMS item publish/unpublish has no primary/secondary-locale payload, partial-error, or manual scenario. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:19-20] [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md]
4. The page metadata example/scenario reads content instead of metadata and does not assert SEO/Open Graph/locale fields. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:15-16] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/pages.ts]
5. Rate-limit guidance is generic and SAFE-003 relies on uncontrolled real-server exhaustion rather than an endpoint-aware fixture. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:21-22] [SOURCE: https://developers.webflow.com/data/v2.0.0/reference/rate-limits.md]
6. Analyze is represented as a generic card and one scenario instead of its seven distinct action families. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:19-20] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:51-64]
7. The five worked examples lack a shared surface, pinned fixture, action-schema, postcondition, and known-unknown contract. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:21-22] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/first-session-discovery.md:19-38] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/examples/draft-page-settings.md:19-40]

## 8. File-Level Recommendation Matrix

| Priority | Files or scope | Smallest sufficient addition |
|---|---|---|
| P0 | `references/mcp-wiring.md`, `references/tool-surface.md`, `assets/utcp-manual-reference.md`, `mcp-servers/webflow-mcp/README.md`, `manual-testing-playbook/discovery-setup/{discover,discover-drift,remote-surface}.md`, `assets/examples/first-session-discovery.md` | Dated endpoint/transport/package-or-commit/tool-schema/resource fixture; pin after capture; make discovery consume it. |
| P0 | `assets/payload-examples.md`, `manual-testing-playbook/pairing/pair-data.md`, `feature-catalog/content/{cms,publish-deploy}.md` | Explicit `isDraft`, item-publish/live-target distinction, locale read-back, and confirmation semantics. |
| P0 | `references/mcp-wiring.md`, `references/tool-surface.md`, `feature-catalog/operations/sitemap-scripts-assets-whtml.md`, `feature-catalog/content/site-pages-scripts.md` | Surface-specific script registration/application/publish matrix and custom-code replacement limits. |
| P0 | `references/action-reference.md`, `feature-catalog/content/site-pages-scripts.md`, `manual-testing-playbook/safety-gate/{refuse,deploygate}.md` | Enterprise robots PUT/PATCH/DELETE distinction, pre-read diff, scope/plan gate, and explicit confirmation. |
| P1 | Five named references | Add exact action parameters, surface labels, required gates, response/read-back fields, and shared version/fixture provenance. |
| P1 | All nine feature cards plus `feature-catalog/feature-catalog.md` | Correct stale action/link claims, add missing schema/lifecycle rows, and add common metadata/freshness validation. |
| P1 | `assets/payload-examples.md`, all five `assets/examples/*.md` | Replace invalid variable/sitemap shapes; add forms, assets, webhooks, instructions, WHTML, and shared fixture/postcondition metadata. |
| P1 | `manual-testing-playbook/manual-testing-playbook.md` and the 17 scenario files | Add action-family -> scenario -> surface/version -> evidence/skip traceability and schema-aware discovery. |
| P1 | `feature-catalog/content/{localization-fonts-forms,site-pages-scripts}.md`, `feature-catalog/operations/sitemap-scripts-assets-whtml.md` | Add forms, localization constraints, schema markup, asset/compression, webhooks, Enterprise, and custom-code lifecycle matrices. |
| P2 | `feature-catalog/intelligence/analyze.md`, `manual-testing-playbook/read-only/analyze.md`, `references/action-reference.md` | Enumerate all seven Analyze actions and cover or explicitly skip untested report families. |
| P2 | `assets/examples/*.md` | Add common surface, pinned fixture, action, schema source, postcondition, and known-unknown fields. |

## 9. Requested Inventory Audit

### Five references

All five are present: `action-reference.md`, `designer-capabilities.md`, `tool-surface.md`, `mcp-wiring.md`, and `troubleshooting.md`. The action reference is the strongest static inventory; the Designer reference contains the broad canvas model; the tool-surface reference correctly identifies an OSS baseline; wiring contains the endpoint contradiction; troubleshooting has useful recovery prose but depends on a missing pinned fixture. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:37-45]

### Shared assets and examples

Both shared assets are present: `utcp-manual-reference.md` and `payload-examples.md`. All five examples are present: `first-session-discovery.md`, `read-cms-content.md`, `destructive-refused.md`, `staging-publish.md`, and `draft-page-settings.md`. The residual problems are pin/provenance metadata and invalid or incomplete payload shapes, not missing files. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:47-57]

### Feature catalog

The root and all nine cards are present: `feature-catalog.md`, `design/designer.md`, `design/component-variants.md`, `content/cms.md`, `content/publish-deploy.md`, `content/site-pages-scripts.md`, `content/localization-fonts-forms.md`, `operations/sitemap-scripts-assets-whtml.md`, `intelligence/agent-instructions.md`, and `intelligence/analyze.md`. The cards are discoverable, but variant, CMS link, localization, WHTML, Analyze, and shared freshness/schema issues remain. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:59-72]

### Manual testing playbook

All 17 scenarios are present: `DISCOVER-001`, `DISCOVER-002`, `DISCOVER-003`, `READ-001`, `READ-002`, `READ-003`, `DRAFT-001`, `DRAFT-002`, `DRAFT-003`, `SAFE-001`, `SAFE-002`, `SAFE-003`, `SAFE-004`, `SAFE-005`, `PAIR-001`, `PAIR-002`, and `NEG-001`. The corpus is category-complete but not action-schema traceable; discovery counts do not prove endpoint, schema, resource, prompt, or version parity. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:21-43] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:74-94]

## 10. Remote, OSS, and Local Reconciliation

| Area | Verified evidence | Required packet treatment |
|---|---|---|
| Endpoint and transport | Hosted Webflow guidance, OSS README, and local wiring name different endpoint/capability details. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:113-138] | Do not select a winner statically; persist a dated live fixture. |
| Module baseline | OSS export list aligns with local 18-module baseline. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-24] | Keep the baseline, but label it as OSS evidence and attach commit/version. |
| Remote-only capability | WHTML and Agent Instructions are in hosted/action documentation but absent from OSS module exports. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] | Mark remote-only and require live schema evidence before use. |
| Branches and Designer state | Remote docs describe branch/canvas behavior; local OSS page/Designer modules are narrower. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/dePages.ts] | Add remote-only lifecycle and Bridge boundary labels. |
| Webhooks | Current Data API enum differs from OSS `main` trigger enum. [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/webhooks.ts] | Treat as version drift until a pinned deployed fixture resolves it. |
| Enterprise robots | Remote method semantics differ from the OSS helper shape. [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-configuration/robots-txt/delete.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/enterprise.ts] | Keep both claims and require endpoint/schema verification. |
| Package pinning | Local registration uses `webflow-mcp-server@latest`. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/mcp-servers/webflow-mcp/README.md:12-18] | Replace `@latest` after capturing package/commit and schema fixture. |

## 11. Eliminated Alternatives

- Live MCP discovery, credentials, OAuth, mutation, publish, and live delivery/error testing were not attempted because the detached research contract forbade them. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:23] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13]
- OSS `main` was not treated as proof of hosted behavior; it was used only to expose implementation and surface differences. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-24]
- No generic staging sandbox, universal idempotency, automatic branch merge, or domain-targeted CMS item publish behavior was inferred without official endpoint evidence. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-28]
- Prior feature findings were not duplicated in iteration 5; its seven findings are residual cross-focus controls and Analyze/example completeness. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:96-105]

## 12. Divergence Map

No divergent pivot was used. The max-iterations policy intentionally broadened the review from Designer/Bridge to CMS/release, remaining content operations, governance/reliability, and final packet controls. The remaining frontier is not another broad feature family; it is a pinned live-surface fixture that can resolve endpoint, package/commit, action schemas, `prompts`, `resources`, webhook enums, robots payloads, and the two invalid local payload shapes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-state.jsonl:7] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:129-136]

## 13. Open Questions and Verification Gate

1. Which endpoint and transport does the intended current hosted Webflow MCP deployment expose?
2. Which package version or OSS commit corresponds to that deployment?
3. What do authenticated `list_tools` and `tool_info` return for action schemas, `prompts`, and `resources`?
4. Which webhook trigger enum, robots payload shape, utility/WHTML membership, and error/partial-result behavior are present on the pinned deployment?
5. Do the remote 31-tool/220-action snapshot and local 18-module baseline represent different surfaces or different revisions?

These are evidence gaps, not findings that the packet should fill by guessing. [INFERENCE: based on the unresolved authority comparison in iteration 5] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-005.md:102-112]

## 14. Recommended Implementation Order

1. Capture and pin the endpoint/package/commit/schema fixture. This closes P0-5 and becomes the authority for later edits.
2. Correct the four behavior-safety P0s: CMS draft encoding, CMS item publish target, custom-code gates, and robots replacement.
3. Add the shared freshness/version and action-schema traceability layer before expanding individual cards or scenarios.
4. Correct P1 surface families and payloads, then add deterministic read-back, partial-error, and deletion scenarios.
5. Fill P2 concision debt only after the pinned action inventory is stable.

No packet implementation changes were made during this research run. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-strategy.md:40-45]

## 15. Sources and Resource Map

The generated resource map records the evidence-derived delta sources for all five iterations. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/resource-map.md]

Primary official sources consulted include:

- [SOURCE: https://developers.webflow.com/mcp]
- [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- [SOURCE: https://developers.webflow.com/mcp/tools/utility-tools.md]
- [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md]
- [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md]
- [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md]
- [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list.md]
- [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-submissions.md]
- [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list.md]
- [SOURCE: https://developers.webflow.com/data/docs/working-with-webhooks]
- [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md]
- [SOURCE: https://developers.webflow.com/data/reference/error-handling.md]
- [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-configuration/robots-txt/put.md]
- [SOURCE: https://developers.webflow.com/data/reference/enterprise/site-activity-logs/list.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md]
- [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts]

## 16. Iteration Provenance

| Iteration | Focus | Findings | Ratio |
|---|---|---:|---:|
| 1 | Designer canvas and Bridge App | 8 | 1.00 |
| 2 | CMS drafts, publishing, branches | 7 | 0.93 |
| 3 | Scripts, forms, localization, metadata, assets | 6 | 1.00 |
| 4 | Webhooks, Enterprise, governance, WHTML, utility, reliability | 8 | 1.00 |
| 5 | Cross-focus completeness and authority reconciliation | 7 | 1.00 |

All iteration records carry route proof for `mode=research`, `target_agent=deep-research`, `agent_definition_loaded=true`, and the resolved route. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-state.jsonl:3-7]

## 17. Convergence Report

- Stop reason: `maxIterationsReached`
- Total iterations: 5
- New-information ratios: `1.00, 0.93, 1.00, 1.00, 1.00`
- Average new-information ratio: `0.986`
- Machine-owned questions remaining: 6 open; substantive Q1-Q3 focus slices and Q5-Q6 are covered, Q4 is partial pending the live fixture.
- Quality guard status: source diversity, focus alignment, and no-single-weak-source checks were satisfied by the five leaf reports; live-surface verification remains explicitly unresolved.
- Resource map: emitted from all five lineage deltas at `resource-map.md`.

The run is complete for the requested static packet audit and intentionally does not claim completion of live Webflow surface reconciliation. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-state.jsonl:7] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/README.md:27-29]

## 18. Research Boundaries

- Artifact boundary: `.opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast`
- Session ID: `fanout-luna-max-fast-1785753078466-rijm2e`
- Parent spec, target skill packet, sibling lineages, memory surfaces, and repository source files were not written.
- The parent `spec.md` generated-findings writeback was intentionally deferred because this is a detached lineage whose write authority is the lineage directory only. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/deep-research-state.jsonl:2]
