---
title: Deep Research Strategy - luna-max-fast lineage
description: Detached five-iteration audit of mcp-webflow documentation quality and Webflow MCP 2.0 coverage.
trigger_phrases:
  - "mcp-webflow quality gaps"
  - "Webflow MCP 2.0 packet audit"
  - "Webflow MCP documentation concision"
importance_tier: important
contextType: research
version: 1.0.0
---

# Deep Research Strategy - luna-max-fast lineage

## 1. OVERVIEW

Detached fan-out lineage for the `011-deep-research-quality-gaps` packet. Executor: `cli-opencode` (`openai/gpt-5.6-luna-fast`). Stop policy: `max-iterations` (5); convergence is telemetry only. All authored outputs are confined to this lineage directory.

## 2. TOPIC

Audit `.opencode/skills/mcp-tooling/mcp-webflow` for missing or overly concise Webflow MCP 2.0 logic across references, assets, nine feature-catalog cards plus root, and seventeen manual-testing-playbook scenarios. Compare local claims with official Webflow MCP 2.0 documentation and the official OSS server, and classify every actionable gap as P0/P1/P2 with concrete file-level recommendations.

<!-- ANCHOR:key-questions -->
## 3. KEY QUESTIONS (remaining)
- [ ] Does the packet faithfully document the official Designer canvas, Bridge App, element tree, component, style, variable, and breakpoint model?
- [ ] Does the packet cover CMS, publishing, branches, scripts, forms, localization, sites, assets, and compression semantics?
- [ ] Does the packet cover webhooks, Enterprise, AI tools, Agent Instructions, WHTML, utility tools, and rate limits?
- [ ] Does the local OSS/server documentation reconcile with the remote Webflow MCP surface and expose version or capability drift?
- [ ] Which references, assets, feature cards, and manual scenarios are too concise or missing important logic?
- [ ] What concrete P0/P1/P2, file-by-file additions are needed, with official or local citations?

<!-- /ANCHOR:key-questions -->

## 4. NON-GOALS
1. No edits to `.opencode/skills/mcp-tooling/mcp-webflow` or any other repository source.
2. No Webflow MCP tool invocation, credentials, OAuth handshakes, mutations, publish calls, or live-site testing.
3. No unsupported feature claims inferred from marketing language when official evidence is unavailable.
4. No implementation plan beyond concrete documentation/test-content recommendations tied to existing files.
5. No writes to the parent spec, sibling research lineages, memory surfaces, or paths outside this lineage directory.

## 5. STOP CONDITIONS
1. Run exactly five evidence-gathering iterations; low novelty or early convergence is telemetry only.
2. Each iteration selects one focus from `Next Focus`, records source citations, and documents ruled-out directions.
3. Final synthesis preserves negative knowledge, local-versus-remote contradictions, severity, and file-level recommendations.
4. `research.md`, `resource-map.md`, reducer outputs, and all iteration evidence remain inside this lineage.

## 6. KNOWN CONTEXT
- Target packet inventory includes five references, two shared payload/manual assets plus five examples, a feature-catalog root plus nine cards, and seventeen manual-testing scenarios.
- The sibling `.opencode/specs/mcp-tooling/015-mcp-webflow/001-deep-research` research is prior context only; reuse its official source leads but independently verify packet-level claims.
- Required official source families: Webflow MCP reference/how-it-works and getting-started pages, Webflow Data API v2 reference/docs, official MCP 2.0 announcement/changelog, and `webflow/mcp-server` source and metadata.
- Local packet files are evidence inputs. Their current wording, line numbers, and linked examples must be cited as `[SOURCE: file:line]`; official pages must be cited as `[SOURCE: url]`.
- Severity meaning: P0 means a missing boundary or behavior that could cause unsafe/wrong operation; P1 means important capability or workflow coverage needed for reliable use; P2 means concision, discoverability, or completeness debt without immediate safety impact.

<!-- ANCHOR:answered-questions -->
## 6. ANSWERED QUESTIONS
[None yet]

<!-- /ANCHOR:answered-questions -->

<!-- ANCHOR:what-worked -->
## 7. WHAT WORKED
- Comparing the official capability summary with both the local prose and the local action inventory exposed gaps that a prose-only read would miss, especially the navigation-class and variant-card contradictions. (iteration 1)
- Comparing the official endpoint schemas and repository adapters with the packet's action matrix, payloads, feature cards, and deterministic scenarios exposed safety-relevant contradictions that a high-level capability comparison would miss. (iteration 2)
- Starting with the remote action table, then checking official MCP/Data API/repository evidence against the local feature cards, payloads, and scenario index exposed both missing capabilities and contradictions that a prose-only review would miss. (iteration 3)
- Starting from the remote action table, then triangulating official Data API schemas, hosted MCP tool descriptions, the current changelog, official OSS source, and exact local cards/payload/manual indexes exposed both missing lifecycle semantics and safety mismatches rather than only missing action names. (iteration 4)
- reading the complete requested inventory before synthesis exposed cross-file defects that individual feature passes could not: wrong canonical links, stale corpus counts, invalid shared payload shapes, and missing provenance between a static reference and a live surface. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:61-77] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:21-31] (iteration 5)

<!-- /ANCHOR:what-worked -->

<!-- ANCHOR:what-failed -->
## 8. WHAT FAILED
- The first guessed hosted documentation path was unavailable, so it could not provide a second page-level citation; the official canonical MCP page and repository README were sufficient fallback authorities. (iteration 1)
- The first guessed Data API and changelog URL variants were unavailable; canonical similar-page `.md` URLs recovered the evidence. Live validation was intentionally unavailable because the prompt forbids MCP calls and credentials. (iteration 2)
- The first guessed Forms and Assets documentation URLs were page-not-found paths; official similar-page links recovered canonical sources. Live validation could not be used because the dispatch forbade tools and credentials. (iteration 3)
- Live MCP discovery and delivery/error execution were prohibited, and the OSS `main` webhook enum does not match the current Data API enum; neither contradiction can be resolved without a pinned live surface. (iteration 4)
- live discovery could not be used because the dispatch prohibited Webflow MCP tools and credentials, so endpoint/version/resource contradictions remain unresolved rather than being collapsed into a confident claim. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13] (iteration 5)

<!-- /ANCHOR:what-failed -->

<!-- ANCHOR:exhausted-approaches -->
## 9. EXHAUSTED APPROACHES (do not retry)
### CMS item publish and page-branch findings were intentionally not repeated. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:9-13] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: CMS item publish and page-branch findings were intentionally not repeated. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:9-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CMS item publish and page-branch findings were intentionally not repeated. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:9-13]

### CMS, publishing, scripts, forms, localization, sites, assets, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were not re-audited because the rendered prompt restricts this iteration to the Designer/Bridge focus. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:9-13] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: CMS, publishing, scripts, forms, localization, sites, assets, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were not re-audited because the rendered prompt restricts this iteration to the Designer/Bridge focus. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:9-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: CMS, publishing, scripts, forms, localization, sites, assets, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were not re-audited because the rendered prompt restricts this iteration to the Designer/Bridge focus. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:9-13]

### Counting `list_tools()` entries alone is insufficient to validate the 220-action remote snapshot or its safety classes; no further static count variation was found after the complete inventory audit. [INFERENCE: based on action-reference counts and the three discovery scenario contracts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:17-24] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/discover.md:20-50] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-50] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Counting `list_tools()` entries alone is insufficient to validate the 220-action remote snapshot or its safety classes; no further static count variation was found after the complete inventory audit. [INFERENCE: based on action-reference counts and the three discovery scenario contracts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:17-24] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/discover.md:20-50] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-50]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Counting `list_tools()` entries alone is insufficient to validate the 220-action remote snapshot or its safety classes; no further static count variation was found after the complete inventory audit. [INFERENCE: based on action-reference counts and the three discovery scenario contracts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:17-24] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/discover.md:20-50] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-50]

### Designer, CMS/publishing, page-branch, scripts/forms/localization, and prior asset findings were not revisited; they are outside this iteration's override. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:7-13] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-24] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-23] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: Designer, CMS/publishing, page-branch, scripts/forms/localization, and prior asset findings were not revisited; they are outside this iteration's override. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:7-13] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-24] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-23]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Designer, CMS/publishing, page-branch, scripts/forms/localization, and prior asset findings were not revisited; they are outside this iteration's override. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:7-13] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-24] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-23]

### Guessed non-canonical Forms and Assets documentation paths returned page-not-found responses; the official similar-page links supplied the canonical `.md` sources used here. [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list-forms] [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-form-submissions] [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list-assets] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Guessed non-canonical Forms and Assets documentation paths returned page-not-found responses; the official similar-page links supplied the canonical `.md` sources used here. [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list-forms] [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-form-submissions] [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list-assets]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Guessed non-canonical Forms and Assets documentation paths returned page-not-found responses; the official similar-page links supplied the canonical `.md` sources used here. [SOURCE: https://developers.webflow.com/data/reference/forms/forms/list-forms] [SOURCE: https://developers.webflow.com/data/reference/forms/form-submissions/list-form-submissions] [SOURCE: https://developers.webflow.com/data/reference/assets/assets/list-assets]

### No CMS item publish domain parameter or official branch merge action was found in the consulted Data API/MCP action surfaces, so neither behavior was inferred. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No CMS item publish domain parameter or official branch merge action was found in the consulted Data API/MCP action surfaces, so neither behavior was inferred. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No CMS item publish domain parameter or official branch merge action was found in the consulted Data API/MCP action surfaces, so neither behavior was inferred. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]

### No repository `forms.ts` or `localization.ts` module was found in the official `src/tools` directory; this was used as local-OSS surface evidence, not as proof that the remote hosted surface lacks those tools. [SOURCE: https://api.github.com/repos/webflow/mcp-server/contents/src/tools] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No repository `forms.ts` or `localization.ts` module was found in the official `src/tools` directory; this was used as local-OSS surface evidence, not as proof that the remote hosted surface lacks those tools. [SOURCE: https://api.github.com/repos/webflow/mcp-server/contents/src/tools]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No repository `forms.ts` or `localization.ts` module was found in the official `src/tools` directory; this was used as local-OSS surface evidence, not as proof that the remote hosted surface lacks those tools. [SOURCE: https://api.github.com/repos/webflow/mcp-server/contents/src/tools]

### No static source was treated as proof of the deployed endpoint or live action schema; the unresolved three-way hosted/OSS/local contradiction remains an explicit unknown for a future permitted fixture. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No static source was treated as proof of the deployed endpoint or live action schema; the unresolved three-way hosted/OSS/local contradiction remains an explicit unknown for a future permitted fixture. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No static source was treated as proof of the deployed endpoint or live action schema; the unresolved three-way hosted/OSS/local contradiction remains an explicit unknown for a future permitted fixture. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138]

### No Webflow MCP call, credential lookup, OAuth flow, or live-site test was attempted. -- BLOCKED (iteration 1, 1 attempts)
- What was tried: No Webflow MCP call, credential lookup, OAuth flow, or live-site test was attempted.
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP call, credential lookup, OAuth flow, or live-site test was attempted.

### No Webflow MCP tool, credential, OAuth flow, mutation, publish call, or live-site test was attempted; the final prompt explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: No Webflow MCP tool, credential, OAuth flow, mutation, publish call, or live-site test was attempted; the final prompt explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP tool, credential, OAuth flow, mutation, publish call, or live-site test was attempted; the final prompt explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-005.md:11-13]

### No Webflow MCP tool, credential, OAuth handshake, mutation, or live-site test was attempted; the dispatch explicitly prohibited those calls. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:11-13] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: No Webflow MCP tool, credential, OAuth handshake, mutation, or live-site test was attempted; the dispatch explicitly prohibited those calls. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:11-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP tool, credential, OAuth handshake, mutation, or live-site test was attempted; the dispatch explicitly prohibited those calls. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-004.md:11-13]

### No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; the dispatch explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:11-13] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; the dispatch explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:11-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; the dispatch explicitly prohibited those actions. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-003.md:11-13]

### No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; this was an explicit iteration constraint. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; this was an explicit iteration constraint. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: No Webflow MCP tool, credential, OAuth, mutation, publish call, or live-site test was attempted; this was an explicit iteration constraint. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13]

### Prior Designer, CMS/publish, scripts/forms/localization/assets, webhook/Enterprise/WHTML/utility, and rate-limit feature findings were not reissued; this pass records only cross-focus residuals and the Analyze slice not previously audited. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-31] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-27] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:23-30] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Prior Designer, CMS/publish, scripts/forms/localization/assets, webhook/Enterprise/WHTML/utility, and rate-limit feature findings were not reissued; this pass records only cross-focus residuals and the Analyze slice not previously audited. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-31] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-27] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:23-30]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Prior Designer, CMS/publish, scripts/forms/localization/assets, webhook/Enterprise/WHTML/utility, and rate-limit feature findings were not reissued; this pass records only cross-focus residuals and the Analyze slice not previously audited. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-001.md:25-31] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:21-28] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-003.md:19-27] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-004.md:23-30]

### Scripts, forms, localization beyond the CMS locale parameter, broader site metadata, assets, compression, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were deferred to later focus passes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Scripts, forms, localization beyond the CMS locale parameter, broader site metadata, assets, compression, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were deferred to later focus passes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Scripts, forms, localization beyond the CMS locale parameter, broader site metadata, assets, compression, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were deferred to later focus passes. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/prompts/iteration-002.md:11-13]

### Static comparison cannot resolve which remote endpoint, package release, action schema, or `prompts`/`resources` capability the operator's pinned session will expose; live discovery is the smallest missing evidence, not a reason to infer a winner. [INFERENCE: based on the official hosted page, official OSS README, OSS module export list, and local surface-reconciliation contract] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138] -- BLOCKED (iteration 5, 1 attempts)
- What was tried: Static comparison cannot resolve which remote endpoint, package release, action schema, or `prompts`/`resources` capability the operator's pinned session will expose; live discovery is the smallest missing evidence, not a reason to infer a winner. [INFERENCE: based on the official hosted page, official OSS README, OSS module export list, and local surface-reconciliation contract] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Static comparison cannot resolve which remote endpoint, package release, action schema, or `prompts`/`resources` capability the operator's pinned session will expose; live discovery is the smallest missing evidence, not a reason to infer a winner. [INFERENCE: based on the official hosted page, official OSS README, OSS module export list, and local surface-reconciliation contract] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/README.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:127-138]

### The absence of WHTML and remote-only utility/Agent Instruction modules from the OSS `src/tools/index.ts` was used only to document the local/remote boundary, not as proof that the hosted remote surface lacks them. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:212-220] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The absence of WHTML and remote-only utility/Agent Instruction modules from the OSS `src/tools/index.ts` was used only to document the local/remote boundary, not as proof that the hosted remote surface lacks them. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:212-220]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The absence of WHTML and remote-only utility/Agent Instruction modules from the OSS `src/tools/index.ts` was used only to document the local/remote boundary, not as proof that the hosted remote surface lacks them. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/feature-catalog.md:212-220]

### The current Data API webhook enum and the official OSS `main` source disagree about supported trigger names (`user_account_*` appears only in the OSS schema). Without live discovery of the pinned deployed surface, this remains a version-drift edge rather than an invented resolution. [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md] [SOURCE: https://developers.webflow.com/data/reference/webhooks/get.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/webhooks.ts] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The current Data API webhook enum and the official OSS `main` source disagree about supported trigger names (`user_account_*` appears only in the OSS schema). Without live discovery of the pinned deployed surface, this remains a version-drift edge rather than an invented resolution. [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md] [SOURCE: https://developers.webflow.com/data/reference/webhooks/get.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/webhooks.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The current Data API webhook enum and the official OSS `main` source disagree about supported trigger names (`user_account_*` appears only in the OSS schema). Without live discovery of the pinned deployed surface, this remains a version-drift edge rather than an invented resolution. [SOURCE: https://developers.webflow.com/data/reference/webhooks/create.md] [SOURCE: https://developers.webflow.com/data/reference/webhooks/get.md] [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/webhooks.ts]

### The local `component-variants.md` card could not serve as an independent authority because its action claims conflict with the packet's remote action reference; the action reference was treated as the local inventory baseline for this iteration. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The local `component-variants.md` card could not serve as an independent authority because its action claims conflict with the packet's remote action reference; the action reference was treated as the local inventory baseline for this iteration. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The local `component-variants.md` card could not serve as an independent authority because its action claims conflict with the packet's remote action reference; the action reference was treated as the local inventory baseline for this iteration. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]

### The official changelog’s previously audited slug-ignore behavior was reviewed for page metadata context but not promoted again; it remains an iteration-2 finding. [SOURCE: https://developers.webflow.com/home/changelog/2026/5/12.md] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:15] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: The official changelog’s previously audited slug-ignore behavior was reviewed for page metadata context but not promoted again; it remains an iteration-2 finding. [SOURCE: https://developers.webflow.com/home/changelog/2026/5/12.md] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:15]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The official changelog’s previously audited slug-ignore behavior was reviewed for page metadata context but not promoted again; it remains an iteration-2 finding. [SOURCE: https://developers.webflow.com/home/changelog/2026/5/12.md] [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/iterations/iteration-002.md:15]

### The OSS repository exports no WHTML or Agent Instructions module, so repository inspection could not provide a local implementation contract for those remote-only features; official hosted MCP documentation and the local action reference were used instead. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47] -- BLOCKED (iteration 4, 1 attempts)
- What was tried: The OSS repository exports no WHTML or Agent Instructions module, so repository inspection could not provide a local implementation contract for those remote-only features; official hosted MCP documentation and the local action reference were used instead. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The OSS repository exports no WHTML or Agent Instructions module, so repository inspection could not provide a local implementation contract for those remote-only features; official hosted MCP documentation and the local action reference were used instead. [SOURCE: https://raw.githubusercontent.com/webflow/mcp-server/main/src/tools/index.ts] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:36-47]

### The requested hosted path `https://developers.webflow.com/data/docs/ai-tools/mcp-server` returned a page-not-found response; the canonical official MCP page and official repository README were used instead. [SOURCE: https://developers.webflow.com/data/docs/ai-tools/mcp-server] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server] -- BLOCKED (iteration 1, 1 attempts)
- What was tried: The requested hosted path `https://developers.webflow.com/data/docs/ai-tools/mcp-server` returned a page-not-found response; the canonical official MCP page and official repository README were used instead. [SOURCE: https://developers.webflow.com/data/docs/ai-tools/mcp-server] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: The requested hosted path `https://developers.webflow.com/data/docs/ai-tools/mcp-server` returned a page-not-found response; the canonical official MCP page and official repository README were used instead. [SOURCE: https://developers.webflow.com/data/docs/ai-tools/mcp-server] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server]

### Treating a feature-card example prompt as proof that a capability exists was rejected where the action table and official surface disagree; the action inventory and explicit remote/local evidence are the authority for recommendations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:21-55] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:264-292] -- BLOCKED (iteration 3, 1 attempts)
- What was tried: Treating a feature-card example prompt as proof that a capability exists was rejected where the action table and official surface disagree; the action inventory and explicit remote/local evidence are the authority for recommendations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:21-55] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:264-292]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating a feature-card example prompt as proof that a capability exists was rejected where the action table and official surface disagree; the action inventory and explicit remote/local evidence are the authority for recommendations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/localization-fonts-forms.md:21-55] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:264-292]

### Treating an omitted `isDraft` field as proof of a draft was eliminated because the official item model exposes the flag and the official OSS adapter defaults the omitted value to false. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/cms.ts] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating an omitted `isDraft` field as proof of a draft was eliminated because the official item model exposes the flag and the official OSS adapter defaults the omitted value to false. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/cms.ts]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating an omitted `isDraft` field as proof of a draft was eliminated because the official item model exposes the flag and the official OSS adapter defaults the omitted value to false. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/create-item.md] [SOURCE: https://github.com/webflow/mcp-server/blob/main/src/tools/cms.ts]

### Treating the CMS item publish action as a staging-domain deployment was eliminated by the endpoint shape and the packet's own CMS reference; site-level `publish_site` is the separate domain-targeted path. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:26-35] -- BLOCKED (iteration 2, 1 attempts)
- What was tried: Treating the CMS item publish action as a staging-domain deployment was eliminated by the endpoint shape and the packet's own CMS reference; site-level `publish_site` is the separate domain-targeted path. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:26-35]
- Why blocked: Repeated iteration evidence ruled this direction out.
- Do NOT retry: Treating the CMS item publish action as a staging-domain deployment was eliminated by the endpoint shape and the packet's own CMS reference; site-level `publish_site` is the separate domain-targeted path. [SOURCE: https://developers.webflow.com/data/reference/cms/collection-items/staged-items/publish-item.md] [SOURCE: https://developers.webflow.com/data/reference/sites/publish.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/content/cms.md:26-35]

<!-- /ANCHOR:exhausted-approaches -->

<!-- ANCHOR:ruled-out-directions -->
## 10. RULED OUT DIRECTIONS
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

<!-- /ANCHOR:ruled-out-directions -->

<!-- ANCHOR:divergence-frontier -->
## 10A. SATURATED DIRECTIONS AND DIVERGENCE FRONTIER
- Completed pivots: 0
- Failed pivots: 0
- Audited overrides: 0
- Saturated: none yet
- Pivot lineage: none yet
- Remaining frontier: none recorded

<!-- /ANCHOR:divergence-frontier -->

<!-- ANCHOR:carried-forward-open-questions -->
## 11A. CARRIED-FORWARD OPEN QUESTIONS
[None yet]

<!-- /ANCHOR:carried-forward-open-questions -->

<!-- ANCHOR:next-focus -->
## 11. NEXT FOCUS
Follow up on: **P2 — The five worked examples lack a shared surface/provenance/postcondition contract.** `first-session-discovery.md`, `read-cms-content.md`, `destructive-refused.md`, `staging-publish.md`, and `draft-page-settings....

<!-- /ANCHOR:next-focus -->

## 13. BOUNDED CONTEXT SNAPSHOT
- Source pointers: `.opencode/skills/mcp-tooling/mcp-webflow/{references,assets,feature-catalog,manual-testing-playbook}` and official Webflow MCP/Data API documentation.
- Reuse candidates: existing action matrix, tool-surface taxonomy, UTCP manual, payload examples, feature cards, and deterministic scenario files.
- Integration points: `SKILL.md`, `README.md`, `INSTALL-GUIDE.md`, local `mcp-servers/webflow-mcp/README.md`, and packet metadata.
- Constraints: read-only research; five iterations; no parent or target-packet writes; official evidence required for every finding.

## 14. RESEARCH BOUNDARIES
- Max iterations: 5
- Convergence threshold: 0.05 (telemetry only under max-iterations)
- Per-iteration budget: 12 tool calls, 10 minutes target
- Progressive synthesis: true
- Artifact boundary: `.opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast`
- Session ID: `fanout-luna-max-fast-1785753078466-rijm2e`
- Started: 2026-08-03T00:00:00Z
