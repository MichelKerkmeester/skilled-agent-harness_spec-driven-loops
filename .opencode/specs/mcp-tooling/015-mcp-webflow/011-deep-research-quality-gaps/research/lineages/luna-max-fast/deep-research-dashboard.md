---
title: Deep Research Dashboard
description: Auto-generated reducer view over the research packet.
---

# Deep Research Dashboard - Session Overview

Auto-generated from JSONL state log, iteration files, findings registry, and strategy state. Never manually edited.

<!-- ANCHOR:overview -->
## 1. OVERVIEW

Reducer-generated observability surface for the active research packet.

<!-- /ANCHOR:overview -->
<!-- ANCHOR:status -->
## 2. STATUS
- Topic: Audit the mcp-webflow skill packet (.opencode/skills/mcp-tooling/mcp-webflow): determine whether its references (action-reference, designer-capabilities, tool-surface, mcp-wiring, troubleshooting), assets (utcp-manual-reference, payload-examples, examples/*), feature-catalog snippets (9 cards + root), and manual-testing-playbook snippets (17 scenarios) are TOO CONCISE or MISSING important Webflow MCP 2.0 logic. Verify against the official Webflow MCP 2.0 surface: Designer canvas model (page/mode/branch/component-view/selection), Bridge App boundary, element tree, components (builder/props/variants/slots/metadata), styles + variable modes, breakpoints, CMS draft semantics, publish/branches, scripts, forms, localization, sites, assets/compression, webhooks, enterprise, AI tools, agent instructions, WHTML, utility tools, rate limits, and local-OSS vs remote-surface reconciliation. Cite [SOURCE: file:line] or [SOURCE: url] for every finding; flag conciseness gaps and missing logic as P0/P1/P2 with concrete recommendations.
- Started: 2026-08-03T00:00:00Z
- Status: COMPLETE
- Iteration: 5 of 5
- Session ID: fanout-luna-max-fast-1785758004736-mkvlvk
- Parent Session: fanout-luna-max-fast-1785753078466-rijm2e
- Lifecycle Mode: resume
- Generation: 1
- continuedFromRun: 5
- stopReason: maxIterationsReached

<!-- /ANCHOR:status -->
<!-- ANCHOR:progress -->
## 3. PROGRESS

| # | Focus | Track | Ratio | Findings | Status |
|---|-------|-------|-------|----------|--------|
| 1 | Audit the local packet and official Designer/Bridge App surface: page, mode, branch, component view, selection, element tree, components and their props/variants/slots/metadata, styles, variable modes, and breakpoints. | designer-bridge | 1.00 | 8 | complete |
| 2 | CMS draft semantics, page/site publishing, and page branch lifecycle | cms-publishing-branches | 0.93 | 7 | complete |
| 3 | Scripts/custom code, forms/submissions, localization, broader site/page metadata, and assets/image compression | remaining-q2 | 1.00 | 6 | complete |
| 4 | webhook lifecycle, Enterprise redirects/robots/activity, AI tools and Agent Instructions, WHTML, utility tools, and rate-limit/error semantics | q3-governance-and-reliability | 1.00 | 8 | complete |
| 5 | Final cross-focus completeness and residual remote/local/version reconciliation across the named references, assets, feature catalog, and 17 manual scenarios | cross-focus-completeness | 1.00 | 7 | complete |

- iterationsCompleted: 5
- keyFindings: 36
- openQuestions: 6
- resolvedQuestions: 0

<!-- /ANCHOR:progress -->
<!-- ANCHOR:questions -->
## 4. QUESTIONS
- Answered: 0/6
- [ ] Does the packet faithfully document the official Designer canvas, Bridge App, element tree, component, style, variable, and breakpoint model? [operator]
- [ ] Does the packet cover CMS, publishing, branches, scripts, forms, localization, sites, assets, and compression semantics? [operator]
- [ ] Does the packet cover webhooks, Enterprise, AI tools, Agent Instructions, WHTML, utility tools, and rate limits? [operator]
- [ ] Does the local OSS/server documentation reconcile with the remote Webflow MCP surface and expose version or capability drift? [operator]
- [ ] Which references, assets, feature cards, and manual scenarios are too concise or missing important logic? [operator]
- [ ] What concrete P0/P1/P2, file-by-file additions are needed, with official or local citations? [operator]

<!-- /ANCHOR:questions -->
<!-- ANCHOR:uncovered-questions -->
## Uncovered Questions
- Count: 6
- [ ] Does the packet faithfully document the official Designer canvas, Bridge App, element tree, component, style, variable, and breakpoint model?
- [ ] Does the packet cover CMS, publishing, branches, scripts, forms, localization, sites, assets, and compression semantics?
- [ ] Does the packet cover webhooks, Enterprise, AI tools, Agent Instructions, WHTML, utility tools, and rate limits?
- [ ] Does the local OSS/server documentation reconcile with the remote Webflow MCP surface and expose version or capability drift?
- [ ] Which references, assets, feature cards, and manual scenarios are too concise or missing important logic?
- [ ] What concrete P0/P1/P2, file-by-file additions are needed, with official or local citations?

<!-- /ANCHOR:uncovered-questions -->
<!-- ANCHOR:trend -->
## 5. TREND
- newInfoRatio sparkline: █▇▅▄▂▁▃▄▆▇██████████
- score sparkline: █▇▅▄▂▁▃▄▆▇██████████
- Last 3 ratios: 1.00 -> 1.00 -> 1.00
- Stuck count: 0
- Guard violations: none recorded by the reducer pass
- convergenceScore: 1.00
- coverageBySources: {"api.github.com":1,"code":111,"developers.webflow.com":20,"github.com":4,"other":17,"raw.githubusercontent.com":9}
- WARNING event: novelty_signal_inert metric=newInfoRatio run=5 window=3 sparkline=▄▄▄ — newInfoRatio held flat at 1 across 3 iterations — the novelty signal is uninformative, so convergence and "not exhausted" claims derived from it are untrustworthy.
- Advisory event: trend_flatline metric=score run=5 window=3 sparkline=▄▄▄

<!-- /ANCHOR:trend -->
<!-- ANCHOR:dead-ends -->
## 6. DEAD ENDS
- CMS, publishing, scripts, forms, localization, sites, assets, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were not re-audited because the rendered prompt restricts this iteration to the Designer/Bridge focus. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:9-13] (iteration 1)
- No Webflow MCP call, credential lookup, OAuth flow, or live-site test was attempted. (iteration 1)
- The local `component-variants.md` card could not serve as an independent authority because its action claims conflict with the packet's remote action reference; the action reference was treated as the local inventory baseline for this iteration. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184] (iteration 1)
- The requested hosted path `https://developers.webflow.com/data/docs/ai-tools/mcp-server` returned a page-not-found response; the canonical official MCP page and official repository README were used instead. [SOURCE: https://developers.webflow.com/data/docs/ai-tools/mcp-server] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server] (iteration 1)
- No CMS item publish domain parameter or official branch merge action was found in the consulted Data API/MCP action surfaces, so neither behavior was inferred. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312] (iteration 2)
- No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; this was an explicit iteration constraint. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13] (iteration 2)
- Scripts, forms, localization beyond the CMS locale parameter, broader site metadata, assets, compression, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were deferred to later focus passes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13] (iteration 2)
- Treating an omitted `isDraft` field as proof of a draft was eliminated because the official item model exposes the flag and the official OSS adapter defaults the omitted value to false. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/cms.ts] (iteration 2)
- Treating the CMS item publish action as a staging-domain deployment was eliminated by the endpoint shape and the packet's own CMS reference; site-level `publish_site` is the separate domain-targeted path. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:26-35] (iteration 2)
- CMS item publish and page-branch findings were intentionally not repeated. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:9-13] (iteration 3)
- Guessed non-canonical Forms and Assets documentation paths returned page-not-found responses; the official similar-page links supplied the canonical `.md` sources used here. [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list-forms] [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-form-submissions] [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list-assets] (iteration 3)
- No repository `forms.ts` or `localization.ts` module was found in the official `src/tools` directory; this was used as local-OSS surface evidence, not as proof that the remote hosted surface lacks those tools. [SOURCE: https://api.github.com/repos/webflow/mcp-server/contents/src/tools] (iteration 3)
- No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; the dispatch explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:11-13] (iteration 3)
- The official changelog’s previously audited slug-ignore behavior was reviewed for page metadata context but not promoted again; it remains an iteration-2 finding. [SOURCE: https://developers.webflow.com/home/changelog/2026/5/12.md] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:15] (iteration 3)
- Treating a feature-card example prompt as proof that a capability exists was rejected where the action table and official surface disagree; the action inventory and explicit remote/local evidence are the authority for recommendations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:21-55] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:264-292] (iteration 3)
- Designer, CMS/publishing, page-branch, scripts/forms/localization, and prior asset findings were not revisited; they are outside this iteration's override. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:7-13] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-24] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-23] (iteration 4)
- No Webflow MCP tool, credential, OAuth handshake, mutation, or live-site test was attempted; the dispatch explicitly prohibited those calls. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:11-13] (iteration 4)
- The absence of WHTML and remote-only utility/Agent Instruction modules from the OSS `src/tools/index.ts` was used only to document the local/remote boundary, not as proof that the hosted remote surface lacks them. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:212-220] (iteration 4)
- The current Data API webhook enum and the official OSS `main` source disagree about supported trigger names (`user_account_*` appears only in the OSS schema). Without live discovery of the pinned deployed surface, this remains a version-drift edge rather than an invented resolution. [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md] [SOURCE: https://developers.webflow.com/data/reference/webhooks/get.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/webhooks.ts] (iteration 4)
- The OSS repository exports no WHTML or Agent Instructions module, so repository inspection could not provide a local implementation contract for those remote-only features; official hosted MCP documentation and the local action reference were used instead. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47] (iteration 4)
- Counting `list_tools()` entries alone is insufficient to validate the 220-action remote snapshot or its safety classes; no further static count variation was found after the complete inventory audit. [INFERENCE: based on action-reference counts and the three discovery scenario contracts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:17-24] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/discover.md:20-50] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-50] (iteration 5)
- No static source was treated as proof of the deployed endpoint or live action schema; the unresolved three-way hosted/OSS/local contradiction remains an explicit unknown for a future permitted fixture. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138] (iteration 5)
- No Webflow MCP tool, credential, OAuth flow, mutation, publish call, or live-site test was attempted; the final prompt explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13] (iteration 5)
- Prior Designer, CMS/publish, scripts/forms/localization/assets, webhook/Enterprise/WHTML/utility, and rate-limit feature findings were not reissued; this pass records only cross-focus residuals and the Analyze slice not previously audited. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-31] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-27] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:23-30] (iteration 5)
- Static comparison cannot resolve which remote endpoint, package release, action schema, or `prompts`/`resources` capability the operator's pinned session will expose; live discovery is the smallest missing evidence, not a reason to infer a winner. [INFERENCE: based on the official hosted page, official OSS README, OSS module export list, and local surface-reconciliation contract] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138] (iteration 5)

<!-- /ANCHOR:dead-ends -->
<!-- ANCHOR:divergent-pivots -->
## 6A. DIVERGENT PIVOTS
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergent-pivots -->
<!-- ANCHOR:next-focus -->
## 7. NEXT FOCUS
Follow up on: **P2 — The five worked examples lack a shared surface/provenance/postcondition contract.** `first-session-discovery.md`, `read-cms-content.md`, `destructive-refused.md`, `staging-publish.md`, and `draft-page-settings....

<!-- /ANCHOR:next-focus -->
<!-- ANCHOR:active-risks -->
## 8. ACTIVE RISKS
- None active beyond normal research uncertainty.

<!-- /ANCHOR:active-risks -->
<!-- ANCHOR:blocked-stops -->
## 9. BLOCKED STOPS
No blocked-stop events recorded.

<!-- /ANCHOR:blocked-stops -->
<!-- ANCHOR:graph-convergence -->
## 10. GRAPH CONVERGENCE
- graphConvergenceScore: 0.00
- graphDecision: [Not recorded]
- graphBlockers: none recorded

<!-- /ANCHOR:graph-convergence -->
