---
title: "Designer-family"
description: "Webflow Designer capability card: canvas model, elements, styles, variables, components, assets, pages via the Bridge App — always paired with sk-design, draft-only until publish."
trigger_phrases:
  - "webflow designer"
  - "webflow element"
  - "webflow style"
  - "webflow variable"
  - "webflow component"
  - "webflow canvas"
  - "webflow design tokens"
importance_tier: important
contextType: implementation
version: 1.1.0.0

# Designer-family

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

Operates the live Designer canvas and site tree via the Bridge App: elements (deElement), styles
(deStyle), variables (deVariable), components (deComponents), assets (deAsset), and pages
(dePages). Full operational logic lives in
[`../../references/designer-capabilities.md`](../../references/designer-capabilities.md).

---
## 2. HOW IT WORKS

### Canvas model and Bridge boundary

Designer operations split into two planes. **Data-API designer modules** (elements, components,
styles, variables, assets, pages) target the site tree and work without the canvas open. **Canvas
state** — current page / mode / branch / component view / selection (`get_current_page`,
`get_current_mode`, `get_current_branch_id`, `get_current_component`, `get_selected_element`,
`check_if_inside_component_view`), canvas navigation (`open_canvas`, `switch_page`,
`open_component_view`, `close_component_view`, `select_element`), visual snapshots, and breakpoint
reads — requires the **Bridge App open in the Designer** (auto-installed on remote OAuth; local
mode needs the Bridge App Designer extension). A Designer session confirms the canvas is open
before the edit loop starts; a data-only session never assumes canvas state exists.

### Selection-driven edit loop

1. **Snapshot** — `get_element_snapshot` captures rendered state (RO).
2. **Discover** — `query_elements` / `get_all_elements` locate the target (RO).
3. **Focus** — `select_element` / `open_canvas` align agent and operator on the target.
4. **Mutate** — DW action with target id and write preview (sk-design decides what, transport
   executes how).
5. **Verify** — snapshot / query read-back confirms the postcondition.

Every mutation step is individually confirmable; destructive steps (DS) add operator confirmation
plus a version-history rollback statement.

### Action surface

| Module | Actions | Class | Gate |
|--------|---------|-------|------|
| dePages | `create_page`, `create_page_folder`, `switch_page` | DW | Designer session; sk-design for layout intent |
| deElement | `query_elements`, `get_all_elements`, `get_attributes`, `get_display_name`, snapshot | RO | none |
| deElement | `create_element`, `move_element`, `set_text`, `set_style`, `set_link`, `set_heading_level`, `set_image_asset`, `set_display_name`, `set_attributes`, settings (`set_settings`, `set_dom_id`, `set_tag`, `set_visibility`) | DW | **sk-design pairing required** |
| deElement | `remove_element`, `remove_attribute`, `remove_style` | DS | operator confirmation; version-history rollback |
| deStyle | style read/get, create/update/rename, `set_style_variable_mode` | RO/DW | sk-design pairing for DW |
| deStyle | `remove_style`, `remove_style_variable_mode`, `remove_all_style_variable_modes` | DS | confirmation + rollback |
| deVariable | get/query, collection + mode + typed variable create/update/rename/reorder | RO/DW | sk-design pairing for DW |
| deVariable | `delete_variable` | DS | confirmation + rollback |
| deComponents | read/get, `create_blank_component`, `duplicate_component`, `transform_element_to_component`, `set_component_metadata`, instance insert/unlink, builder (`insert_in_element`/`insert_in_slot`), props create/update/set/reset, variants create/duplicate/set/reorder | RO/DW | sk-design pairing for DW |
| deComponents | `unregister_component`, `remove_prop`, `delete_variant` | DS | confirmation + rollback |
| deAsset | asset read/list, create/upload (`upload_image_by_url`), compress, folders | RO/DW | sk-design pairing for DW |
| deAsset | `delete_asset` | DS | confirmation + rollback |
| localDeMCPConnection | `get_designer_app_connection_info` | RO | none (diagnostic) |

### Element-tree and token semantics

Elements are addressed by `id {component, element}` with `parent_element_id` + `creation_position`
positions; builder steps carry a `build_label`. `set_style` references **named styles**, not raw
CSS — ensure the style exists before binding (`create_style` with `properties[]`). Styles bind to
**variable modes** (`set_style_variable_mode`): create collection → create mode → create typed
variables → bind style → apply style to elements; a second mode re-skins the same style without
touching elements. Components expose **props** (instance customization), **slots** (`insert_in_slot`
extension points), and **variants** (style layers via `set_variant_styles`); editing inside the
component view (`open_component_view`) scopes mutations to the component master. Breakpoints are
canvas-bound reads (`get_all_breakpoints`); responsive behavior flows through which styles apply
and what they contain.

### Safety-critical semantics

- Designer tools require the **Bridge App open in the Designer**; Data API tools work with Webflow
  closed.
- Designer edits are **draft-only inside the Designer** — they appear on the live site only after
  `publish_site` (gated separately).
- **All Designer-family operations load `sk-design` first** (cross-hub pairing): the transport
  executes, never decides taste.
- Branches (`create_branch`, `switch_page` to branch) isolate Designer edits until merge — the
  natural staging pattern for design work.

### Example prompts

- "set the hero heading level to H1 in the test site" → sk-design + deElement DW
- "create a variable collection 'Brand' with a mode 'Light'" → sk-design + deVariable DW
- "remove the 'hero' element" → confirmation + rollback statement (DS)

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/designer-capabilities.md` | Shared | Full Designer logic: canvas model, edit loop, element/token/component semantics, worked flows |
| `../../references/action-reference.md` | Shared | Required parameters per action (Elements, Components, Variables, Style, Designer canvas) |
| `../../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Designer edit loop scenario (DRAFT-003) and pairing scenarios |

## 4. SOURCE METADATA

- Group: Elements, Components, Variables, Style, Designer canvas
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `design/designer.md`

Related references:
- [`component-variants.md`](component-variants.md) — related capability
- [`../../references/designer-capabilities.md`](../../references/designer-capabilities.md) — operational logic
