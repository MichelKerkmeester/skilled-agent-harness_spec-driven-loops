# Iteration 1: Local Packet Coverage And Conciseness

## Focus

Inventory the five named references, root assets, and governing skill to distinguish healthy compression from missing execution logic. This pass uses only local evidence; official-source validation is deferred to iterations 2-4.

## Actions Taken

1. Read all five references and compared their stated surface counts, action classes, and semantic claims.
2. Read the registered-manual and payload-example assets.
3. Compared the skill's summary and scenario count with the manual-playbook metadata.
4. Cross-checked example payload keys against the packet's own action inventory.

## Findings

### F1 (P1): Representative payload examples are structurally incomplete or use keys that do not match the packet's own action inventory

The color-variable example supplies only `siteId`, `pageId`, and `value`, but the local action inventory says `create_color_variable` also requires `variable_collection_id` and `variable_name`. The sitemap example uses `pageIds` plus a single `sitemapStatus`, while the inventory describes `bulk_update_pages_sitemap_status(site_id, pages[])` and single-page updates using `page_id, includeInSitemap`. These are not harmless omissions in an asset explicitly intended to help agents recognize correct request shapes. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:23-31] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:60-79] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:397-416] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:347-358]

Recommendation: replace each example with a live-schema-derived full envelope, label the exact tool/action and surface, and add a negative example showing the validation error for omitted keys.

### F2 (P1): “Complete action reference” is complete as an index, not as an invocation contract

The action reference provides action names, a compact required-parameter list, and a risk class, but no optional fields, enum domains, action-array envelope, response shapes, pagination/cursor semantics, per-action scopes, idempotency, or errors. Its own global-parameter paragraph also uses mixed naming (`siteId/pageId` globally, then many `site_id/page_id` rows), which leaves normalization unresolved. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-33] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:102-120] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-491]

Recommendation: retain the concise index, but add a schema-semantics companion or generated columns for envelope, optional parameters, enums, result type, pagination, scopes, and retry/idempotency behavior.

### F3 (P1): Canvas action classification is internally contradictory

`designer-capabilities.md` says `create_page_folder` and `open_canvas` are the only draft writes in the canvas group and characterizes the rest as read-only or navigation. The action inventory nevertheless marks `close_component_view`, `open_component_view`, `select_element`, and `switch_page` as DW. This makes confirmation/audit behavior depend on which reference was loaded, even before official semantics are checked. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:34-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]

Recommendation: split “remote state-changing navigation” from “persistent site draft mutation” instead of forcing both into DW, then map each category to an explicit gate.

### F4 (P1): Local and remote surfaces are described separately but lack an actionable reconciliation crosswalk

The packet correctly warns that the remote surface has 31 tools/220 actions while local OSS has 18 combined modules, and it says live discovery is authoritative. However, the local inventory uses names such as `deElement`, `add_inline_site_script`, and `run_workflow`, while the remote inventory uses `data_element_tool`, `register_inline_script`, and no workflow tool. There is no action-level crosswalk identifying equivalent, renamed, remote-only, local-only, or semantically divergent operations. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-56] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:187-193] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:216-222]

Recommendation: add a generated reconciliation table keyed by capability and tested version, with `both-equivalent`, `both-different`, `remote-only`, `local-only`, and `unknown-live` states.

### F5 (P2): The skill carries a stale manual-scenario count

The manual playbook declares 17 scenarios, while the governing skill's resource list says 16. This is minor operationally but directly undermines coverage accounting in the requested audit. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/manual-testing-playbook.md:1-3] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:303-305]

Recommendation: derive the count from the scenario index in validation instead of repeating a hand-maintained number.

### F6 (P1): Several strong semantic claims have no nearby official anchor and need verification before being treated as executable doctrine

The Designer reference states that style renames “ripple through every binding,” branch switching isolates edits “until the branch merges,” snapshots are breakpoint-aware through current canvas state, and Data-API designer modules work without the canvas open. These may be correct, but none is tied to a specific official source in the document, and the action inventory cannot establish those behaviors. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:25-30] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:86-95] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:123-137]

Recommendation: add source annotations per semantic rule and downgrade unverified behavior to `UNKNOWN` until an official page or live probe confirms it.

## Questions Answered

- Q1 partially answered: the packet has broad inventory coverage but lacks enough schema semantics and contains concrete payload/classification drift.

## Questions Remaining

- Validate Designer and Bridge assertions against official documentation.
- Validate Data API draft/publish and advanced surface semantics.
- Audit all feature cards and 17 scenarios for traceability.

## Ruled Out

- “The entire packet is simply too short” is ruled out: the action inventory is long and broad; the problem is uneven depth and missing executable semantics, not total word count. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-24]

## Dead Ends

- Local action names alone cannot establish the deployed remote schema; authenticated discovery remains unavailable by packet design. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:19-28]

## Sources Consulted

- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:12-498]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-186]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/tool-surface.md:18-98]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:22-193]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/troubleshooting.md:19-109]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:19-101]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/SKILL.md:12-311]

## Assessment

- New information ratio: 1.0
- Novelty justification: first pass established six packet-local gaps and one ruled-out framing.
- Confidence: high for internal contradictions and example omissions; external correctness deferred.

## Reflection

- What worked: cross-reading the summary, action table, and examples exposed contradictions that no single file reveals.
- What did not work: local sources cannot prove remote runtime semantics.
- Adjustment: use official Designer docs and official MCP tool pages next.

## Recommended Next Focus

Official Designer canvas model, Bridge App boundary, elements, components, styles, variables, modes, and breakpoints.
