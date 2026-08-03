# Iteration 2: Official Designer Semantics

## Focus

Compare the packet's Designer doctrine with the official Webflow MCP Designer, Data, and architecture references. This pass focuses on behavior needed to make safe, deterministic element/component/style operations, not the already-inventoried action names.

## Actions Taken

1. Fetched the official MCP overview and limitations.
2. Fetched the official Designer-session tool reference.
3. Fetched the official Data-tool reference sections for elements, settings, components, props, variants, styles, and variables.
4. Fetched the official architecture page for Bridge App, mode awareness, permissions, resources, and activity logging.
5. Compared those semantics with `designer-capabilities.md`, `mcp-wiring.md`, and the action table.

## Findings

### F7 (P1): The packet omits mode-aware execution and the `ModeForbidden` failure contract

Official documentation says the MCP server reports the current Designer mode in tool responses, tool descriptions declare supported modes, and unavailable tools return `ModeForbidden`. The local packet lists `get_current_mode` but reduces it to a generic “Design / preview / editing context” and troubleshooting covers Bridge connectivity without mode-specific recovery. That omission can make a connected Bridge session look healthy while every proposed action is invalid in the active mode. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:36-48] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/troubleshooting.md:69-76]

Recommendation: document the five official modes (`design`, `build`, `preview`, `edit`, `comment`), require mode preflight for mode-sensitive actions, and add a `ModeForbidden` troubleshooting branch.

### F8 (P1): `set_style` replacement semantics are missing and can cause unintended style loss

The official Data-tool reference states that `set_style` replaces an element's styles: existing styles are removed and the supplied names are applied. The local reference says only that it “references styles by `style_names`” and the worked token flow calls `set_style` without requiring a read-before-write merge or preview. An operator could intend to add one class and silently remove every existing class. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:66-82] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:154-161]

Recommendation: elevate `set_style` to replace-all semantics, require current-style readback and a before/after list, and provide separate additive intent guidance if the live schema supports it.

### F9 (P1): Component props and bindings are too concise for safe use

Official docs specify ten prop types; values can bind to component props, CMS, page, or locale data; prop removal aggregates per-prop errors; and instance reads may resolve bindings. The local component section describes props as an instance API but omits type domains, binding source rules, partial-error behavior, and the need to distinguish raw from resolved values. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:98-119]

Recommendation: add a prop-type/binding matrix, raw-versus-resolved read guidance, per-prop failure handling, and examples for CMS/page/locale bindings.

### F10 (P1): Component lifecycle and variant constraints are missing

Official docs say `unlink_component_instance` does not apply to library or code components; `unregister_component` affects all instances; the base variant cannot be deleted; deterministic reordering requires the full ordered list including `base`; duplication copies settings/styles; and variant style updates are breakpoint- and pseudo-aware. The packet's compact table and prose omit all of those constraints. [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:102-119]

Recommendation: add preconditions and blast-radius checks for unlink/unregister, plus complete variant invariants and a full-order payload example.

### F11 (P1): Canvas navigation is mis-modeled as persistent draft-write risk

The official Designer reference marks `designer_tool` read/write at the tool level because access is governed per tool, while action descriptions distinguish reading, selection, and canvas navigation from `create_page_folder`. The local action table maps `select_element`, `switch_page`, open/close component view, and `open_canvas` to DW, while its semantic reference calls most navigation. This conflates “changes remote session state” with “persists a site draft,” which can over-gate harmless focus changes and under-specify their actual mode/Bridge failure behavior. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:443-469] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:34-48]

Recommendation: add a nonpersistent canvas-session class or effect axis alongside RO/DW/DS/PB/DP, while retaining tool-level permission awareness.

### F12 (P2): Breakpoint guidance lacks the official cascade and per-operation semantics

Official docs say breakpoints are returned in cascade order, `get_styles` can filter breakpoints/pseudos/properties, style updates and variable-mode assignment are breakpoint- and pseudo-aware, and variant style overrides are also breakpoint/pseudo-aware. The packet says responsive logic is “indirect” and suggests snapshots at a target breakpoint, but gives no cascade model or payload/readback requirements. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:123-129]

Recommendation: add breakpoint cascade order, pseudo-state handling, targeted read-before-write patterns, and a responsive verification example.

### Confirmed Non-Gap: The Bridge App boundary is materially correct

Official architecture says elements, components, styles, variables, CMS, pages, assets, and fonts work through the Data API without the Designer; only snapshots, selection/page/mode/branch, canvas navigation, and breakpoint state require the Bridge App. The packet captures this split accurately. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md] [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md] [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-30]

## Questions Answered

- Q2 answered: high-level architecture is correct, but six execution-critical Designer semantics are missing or misclassified.

## Questions Remaining

- Q3: content, publish/branch, script, form, localization, asset, webhook, enterprise semantics.
- Q4: AI, instructions, WHTML, utility, rates, and surface reconciliation.
- Q5: feature-card and manual-test traceability.

## Ruled Out

- “All Designer operations require the Bridge App” is false. Official docs restrict the Bridge requirement to live session state and snapshots; page-building data tools run headlessly. [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]

## Dead Ends

- Risk cannot be derived solely from a tool-level read/write flag because `designer_tool` bundles nonpersistent navigation with a persistent page-folder action. [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md]

## Sources Consulted

- [SOURCE: https://developers.webflow.com/mcp]
- [SOURCE: https://developers.webflow.com/mcp/tools/designer-tools.md]
- [SOURCE: https://developers.webflow.com/mcp/tools/data-tools.md]
- [SOURCE: https://developers.webflow.com/mcp/reference/how-it-works.md]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/designer-capabilities.md:23-150]
- [SOURCE: .opencode/skills/mcp-tooling/mcp-webflow/references/action-reference.md:137-225]

## Assessment

- New information ratio: 0.88
- Novelty justification: six new semantic gaps plus one architecture confirmation substantially refine the first-pass inventory.
- Confidence: high; all behavioral claims are anchored to official MCP pages.

## Reflection

- What worked: grouped official tool pages contain action descriptions that the local required-parameter table omits.
- What did not work: guessed per-tool URLs returned 404; the grouped Designer/Data pages are canonical.
- Adjustment: use the grouped Data page and overview limitations for the content/operations pass.

## Recommended Next Focus

Official CMS draft/publish, page/branch, scripts, forms, localization, sites, assets/compression, webhooks, and enterprise semantics.
