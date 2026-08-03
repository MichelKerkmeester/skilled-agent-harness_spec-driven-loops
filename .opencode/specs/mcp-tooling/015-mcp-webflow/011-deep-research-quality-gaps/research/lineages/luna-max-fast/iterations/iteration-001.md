# Iteration 1: Designer canvas and Bridge App model

## Focus
Audit the local packet against the official Webflow Designer/Bridge App boundary and its page, mode, branch, component-view, selection, element-tree, component, style, variable-mode, and breakpoint semantics. The other key-question families were deferred because the rendered prompt specifies one focus only.

## Findings
1. **P1 — Canvas navigation/state is classified inconsistently.** The packet correctly says that canvas-bound page, mode, branch, component-view, selection, navigation, snapshots, and breakpoint operations need the Bridge App, and that data-plane operations can work without the canvas. However, `designer-capabilities.md` says that only `create_page_folder` and `open_canvas` are draft-write actions in this group, while the packet's own action table marks `close_component_view`, `open_component_view`, `select_element`, and `switch_page` as `DW`. The official documentation and repository README confirm the Bridge App/live-canvas boundary, but do not turn canvas navigation into site-tree content writes. The packet should distinguish Bridge-bound state/navigation mutations from site-tree draft writes and align the gate/class labels. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:25-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]

2. **P1 — Element-tree discovery is too concise for reliable targeting.** Official Webflow documentation says elements can be found by type, text, style, tag, attribute, or component. The local packet names `query_elements` and `get_all_elements` but gives no query-key schema or worked selector examples; the action reference exposes only an opaque `queries[]` parameter. Add the supported query dimensions, target-id shape, and one discovery-to-mutation example to the shared Designer reference and payload/manual coverage. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:52-60] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:188-207]

3. **P1 — Style coverage omits official class/combo-class and raw-CSS semantics.** The official surface describes reusing or creating classes and combo classes, editing CSS properties, building styles from raw CSS, and managing styles across breakpoints. The local reference instead describes named styles, `properties[]`, and variable-mode bindings, without explaining class/combo-class identity or raw-CSS input. Add those distinctions and a safe create/update/read-back example; otherwise a reader can mistake the named-style lifecycle for the complete Designer style model. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:86-95] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:374-389]

4. **P1 — Breakpoint behavior is represented as read-only and indirect, while the official boundary includes changing the current breakpoint.** The packet documents `get_all_breakpoints` as a canvas-bound read and says responsive behavior flows indirectly through styles, but it does not state whether changing the active/current breakpoint is supported by the exposed remote version or is only a Designer UI operation. Official documentation explicitly includes reading or changing current breakpoints among the Bridge-App-dependent capabilities and separately promises responsive layouts across breakpoints. Reconcile the action inventory with the hosted capability claim, then add a version-qualified breakpoint-selection/verification scenario. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:123-129] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:71-82] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469]

5. **P1 — Branch isolation is documented with an unsupported or underspecified merge implication.** Official documentation confirms creating, inspecting, and deleting page branches for isolated work. The local reference says edits remain isolated “until the branch merges” and calls branching a staging pattern, but the cited page action inventory contains create/delete/details/list operations and no merge action or merge procedure. Qualify the claim to the supported lifecycle and explicitly document whether merge is outside this MCP surface. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:133-137] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]

6. **P1 — The component-variants feature card is stale and contradicts the packet's authoritative action table.** Official documentation promises full component support for props, variants, slots, and metadata. The variant card claims “eight” actions but invents/assumes `update_variant`, `set_default_variant`, and generic list/get actions, while omitting the action-reference entries `duplicate_variant`, `set_variant_name`, `reorder_variants`, `set_variant_styles`, and `get_variant_styles`. Rewrite the card from the action table, including exact parameters and risk classes, and add a deterministic variant read/update/read-back scenario. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:11-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]

7. **P2 — Component metadata, prop constraints, and slot behavior are listed but not operationally specified.** The shared reference gives useful high-level semantics for props, slots, variants, and component-view scoping, and it lists `set_component_metadata`, but it does not show metadata fields, prop type/default rules, slot validation, or a metadata/prop/slot read-back contract. This is concision/completeness debt rather than a missing safety boundary; add a component-builder example and verification checklist to the Designer card or payload/manual assets. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:98-119] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:71-82] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:137-184]

8. **P2 — Variable-mode coverage is a useful workflow summary but lacks mode/value/read-back detail.** The packet correctly describes collections, modes, typed variables, style bindings, and a second theme mode. It does not explain how per-mode values are populated and verified, how multiple bindings are inspected/removed, or whether the active canvas mode can be changed through the exposed action surface. Official documentation frames variables as design-system primitives for color schemes, typography, and spacing; expand the local mode matrix without claiming an unexposed active-mode operation. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:86-95] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:374-417]

No P0 gap was found in this focus: the packet explicitly documents the Bridge App requirement for canvas-bound operations and the draft-only-until-publish boundary. [SOURCE: https://developers.webflow.com/mcp] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-30] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/mcp-wiring.md:141-149]

## Ruled Out
- CMS, publishing, scripts, forms, localization, sites, assets, webhooks, Enterprise, AI, WHTML, utility tools, and rate limits were not re-audited because the rendered prompt restricts this iteration to the Designer/Bridge focus. [SOURCE: .opencode/specs/mcp-tooling/015-mcp-webflow/011-deep-research-quality-gaps/research/lineages/luna-max-fast/prompts/iteration-001.md:9-13]
- No Webflow MCP call, credential lookup, OAuth flow, or live-site test was attempted.
- The requested hosted path `https://developers.webflow.com/data/docs/ai-tools/mcp-server` returned a page-not-found response; the canonical official MCP page and official repository README were used instead. [SOURCE: https://developers.webflow.com/data/docs/ai-tools/mcp-server] [SOURCE: https://developers.webflow.com/mcp] [SOURCE: https://github.com/webflow/mcp-server]

## Dead Ends
- The local `component-variants.md` card could not serve as an independent authority because its action claims conflict with the packet's remote action reference; the action reference was treated as the local inventory baseline for this iteration. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]

## Edge Cases
- Ambiguous input: none; the rendered prompt selected the Designer/Bridge surface explicitly.
- Contradictory evidence: local navigation risk labels and the component-variants card conflict with the local action inventory; recommendations preserve both claims and identify the authoritative correction. [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:46-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:20-41] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:173-184]
- Missing dependency: one guessed official documentation URL was unavailable; official `/mcp` and the repository README supplied the fallback evidence.
- Partial success: none; the selected focus produced eight cited packet-level findings.

## Sources Consulted
- [SOURCE: https://developers.webflow.com/mcp]
- [SOURCE: https://github.com/webflow/mcp-server]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-186]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:137-184]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:188-225]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:296-312]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:374-469]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/designer.md:27-93]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/feature-catalog/design/component-variants.md:11-41]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/designer-edit/designer-edit.md:20-59]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/manual-testing-playbook/discovery-setup/remote-surface.md:20-59]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/assets/payload-examples.md:19-32]

## Assessment
- New information ratio: **1.00** (8 fully new findings, 0 partially new, 0 redundant; simplicity bonus not needed).
- Questions addressed: Q1, Q5, and Q6 for the Designer/Bridge subset.
- Questions answered: Q1 — the core boundary is present, but the packet is not fully faithful until the eight corrections/expansions are made.
- No P0 finding; five P1 findings identify actionable correctness or workflow gaps, and three P2 findings identify concision/completeness debt.

## Reflection
- What worked and why: Comparing the official capability summary with both the local prose and the local action inventory exposed gaps that a prose-only read would miss, especially the navigation-class and variant-card contradictions.
- What did not work and why: The first guessed hosted documentation path was unavailable, so it could not provide a second page-level citation; the official canonical MCP page and repository README were sufficient fallback authorities.
- What I would do differently: For the next pass, start from the official tool-family pages or repository source inventory for one non-Designer family, then reconcile its local feature cards and scenarios before broadening coverage.

## Recommended Next Focus
Audit CMS draft/publish semantics and page publish/branch lifecycle in the local packet, emphasizing the difference between draft writes, explicit publish actions, and any branch operation not exposed by the MCP action surface.
