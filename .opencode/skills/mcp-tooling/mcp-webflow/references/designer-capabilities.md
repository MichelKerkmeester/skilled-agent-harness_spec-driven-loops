---
title: "Webflow Designer Capabilities"
description: "How the Webflow MCP 2.0 Designer surface works: canvas model, Bridge App boundary, selection-driven edit loop, element tree, styles and variable modes, components with props/variants/slots, breakpoints, assets, and pages — all draft-only until publish."
trigger_phrases:
  - "webflow designer capabilities"
  - "webflow designer logic"
  - "webflow canvas model"
  - "webflow element tree"
  - "webflow design tokens"
  - "webflow component variants"
  - "webflow breakpoints"
importance_tier: important
contextType: implementation
version: 1.0.0.0
---

# Webflow Designer Capabilities - Canvas Model and Edit Logic

The operational logic of the Webflow MCP 2.0 Designer surface: what the canvas state is, which operations need the Bridge App, and how element, style, variable, component, and breakpoint edits compose into safe design workflows.

---

## 1. OVERVIEW

The Designer surface is the flagship of Webflow MCP 2.0: it operates on the live site tree and the open Designer canvas rather than on content records only. It splits into two planes with different connection requirements:

- **Data-API designer modules** — elements, components, styles, variables, assets, and pages. These target the site tree through the Data API and work without the canvas open; the Bridge App is optional for them.
- **Canvas-bound operations** — current page / mode / branch / component view / selection, canvas navigation, visual snapshots, and breakpoint reads. These read live Designer state and **require the Bridge App open in the Designer** (remote OAuth installs it automatically; local stdio mode needs the Bridge App Designer extension).

Every Designer edit is a **draft on the site tree** — nothing appears on the live site until a separate, gated `publish_site` runs. All Designer-family operations pair with `sk-design`: the transport executes, never decides taste.

---

## 2. CANVAS MODEL AND BRIDGE BOUNDARY

The live canvas exposes five pieces of state that shape every Designer workflow:

| State | Read action | Notes |
|---|---|---|
| Current page | `get_current_page` | Which page is open in the Designer |
| Current mode | `get_current_mode` | Design / preview / editing context |
| Current branch | `get_current_branch_id`, `list_branches`, `get_branch_parent_page_id` | Branch-scoped edit contexts |
| Component view | `get_current_component`, `check_if_inside_component_view` | When inside a component, mutations are scoped to the component |
| Current selection | `get_selected_element` | The element the operator is looking at |

Navigation actions: `open_canvas` (`component_id`, `page_id`), `switch_page` (`page_id`), `open_component_view` (component instance), `close_component_view`, `select_element` (`id {component, element}`).

All of these are **canvas-bound**: they read or move the live Designer state, so they fail when the Bridge App is not connected. `create_page_folder` and `open_canvas` are the only two draft-write actions in this group; everything else is read-only or canvas navigation. The bridge boundary is a failure mode, not a design limitation: a data-only session (CMS, content, publish) must never assume canvas state exists, and a Designer session must confirm the canvas is open before the edit loop starts.

---

## 3. SELECTION-DRIVEN EDIT LOOP

The canonical Designer workflow is a five-step loop, always starting from what is true on the canvas rather than from assumptions about the tree:

1. **Snapshot** — `get_element_snapshot` (`id {component, element}`, RO) captures the element's rendered state before any change.
2. **Discover** — `query_elements` (`queries[]`, RO) or `get_all_elements` (`pageId`, `siteId`, RO) locates the target in the tree. Queries are multi-dimension: element type, display name, tag, and attributes; the target-id shape is always `{component, element}` — a query result that does not resolve to that shape must not be used as a mutation target.
3. **Focus** — `select_element` or `open_canvas` puts the target in view so the operator and the agent agree on what is about to change.
4. **Mutate** — a draft-write (DW) action from the element/style/variable/component sets (§4–§6), with the target id and a write preview.
5. **Verify** — snapshot or query read-back confirms the postcondition; a DS action inside the loop requires operator confirmation plus a rollback statement (version-history restore) before it runs.

The loop is the contract for `sk-design` pairing: the design judgment step (what to change) happens before step 4, and the agent only executes. Every mutation step is individually confirmable, so a multi-edit design pass is a sequence of confirmable steps rather than one bulk write.

---

## 4. ELEMENT TREE SEMANTICS

Elements are addressed by `id {component, element}`: an element can be a plain node in the page tree or an instance inside a component. Positions are expressed as `parent_element_id` + `creation_position`; builder-style mutations add a `build_label` (the human-readable label of the build step) to `create_element` and the two component insertion actions.

| Aspect | Actions | Class |
|---|---|---|
| Read | `get_all_elements`, `query_elements`, `get_display_name`, `get_attributes` | RO |
| Structure | `create_element` (`element_schema{type}`), `move_element` (`anchor_element_id`), `set_display_name` | DW |
| Content | `set_text`, `set_link` (`linkType`, `link`), `set_heading_level`, `set_image_asset`, `set_style` (`style_names`), `set_attributes` | DW |
| Settings | `get_settings`, `set_settings` (`operations[]`), `set_dom_id`, `set_tag`, `set_visibility`, `get_bindable_sources` | RO / DW |
| Destructive | `remove_element`, `remove_attribute` (`attribute_names`), `remove_style` | DS |

Semantics that matter:

- `set_style` references styles by `style_names` — the element points at named styles, it does not inline raw CSS. Styling an element therefore means first ensuring the style exists (§5).
- `remove_element` accepts `{component, element}` ids: removing a component instance vs. a plain element are the same action but different rollback surfaces (component instances can be re-inserted; plain element removal relies on version history).
- `set_visibility` and `set_dom_id` are per-element settings that affect interaction targets (CMS bindings, custom code) — a DW gate with a scope check.

---

## 5. STYLE AND DESIGN TOKENS

Styles are named, reusable property sets; design tokens are typed variables collected into collections with modes. The two compose: styles can be bound to variable modes so a theme switch re-skins every element using the style.

**Style lifecycle** (`data_style_tool`): `create_style` (`name`, `properties[]`, DW), `update_style`, `rename_style`, `remove_style` (DS), reads `query_styles` / `get_styles`. Mode bindings: `set_style_variable_mode` (`style_name`, `variable_collection_id`, `mode_id`, DW), `get_style_variable_modes`, `remove_style_variable_mode` / `remove_all_style_variable_modes` (DS).

**Class semantics**: styles are **named classes** in the Designer's class system — a class can
carry a combo-class chain (multiple class names on one element) and raw-CSS
(designer-applied custom CSS). `set_style` with `style_names` assigns the class chain; element
styling must therefore distinguish: (a) a named class applied to an element, (b) a combo-class
(additional class layered on the same element), and (c) raw-CSS overrides that are invisible to
the style table. Read back the resolved style state (`get_styles` / snapshot) after any class
change — raw-CSS overrides and breakpoint-specific values only surface on read-back.

**Token lifecycle** (`data_variable_tool`): collections `create_variable_collection` / `reorder_variable_collection` (DW); modes `create_variable_mode` (DW); typed variables — color, font family, number, percentage, size — each with `create_*` / `update_*` (DW) and `delete_variable` (DS); reads `get_variable_collections`, `get_variables`, `query_variables`.

Tokenization logic: create collection → create mode (e.g. "Light") → create typed variables → `set_style_variable_mode` to bind a style → apply the style to elements. A second mode ("Dark") then re-skins the same style without touching elements. Renames ripple through every binding; deletes are DS because they break every bound style.

---

## 6. COMPONENTS: BUILDER, PROPS, VARIANTS, SLOTS

Components are the highest-leverage Designer capability: reusable trees with instance-level props, variants, slots, and metadata.

| Aspect | Actions | Class |
|---|---|---|
| Lifecycle | `create_blank_component`, `duplicate_component`, `transform_element_to_component`, `set_component_metadata` | DW |
| | `unregister_component` | DS |
| Instances | `insert_component_instance` (`parent_element_id`, `component_id`, `creation_position`), `unlink_component_instance`, `get_parent_component` | DW / RO |
| Builder | `insert_in_element` / `insert_in_slot` (`component_schema{name}`, `slot_name`, `build_label`) | DW |
| Props | `create_prop`, `update_prop`, `set_component_instance_prop_values`, `reset_all_props_value`, `get_component_instance_props` | DW / RO |
| | `remove_prop` | DS |
| Variants | `create_variant`, `duplicate_variant`, `set_variant_name`, `reorder_variants`, `set_variant_styles`, `get_variant_settings`, `get_variant_styles` | DW / RO |
| | `delete_variant` | DS |
| View scoping | `open_component_view`, `close_component_view`, `get_current_component`, `check_if_inside_component_view` | DW / RO |

Component logic:

- **Props are the API of the component**: instances are customized with `set_component_instance_prop_values`, never by editing the master tree. `reset_all_props_value` returns an instance to defaults (DW, preview the values first).
- **Slots are extension points**: `insert_in_slot` builds inside a component slot, so a card component can accept arbitrary children. Slot targets need the `slot_name` plus the component schema.
- **Variants are style layers**: `set_variant_styles` (`variant_id`, `style_name`) binds named styles to a variant; `get_variant_styles` / `get_variant_settings` read the current layer before changing it. Variant name/set/reorder are cheap; `delete_variant` is DS.
- **Editing inside the component view** scopes element mutations to the component master; `check_if_inside_component_view` decides whether a proposed element edit targets the component or the page.

---

## 7. BREAKPOINTS AND RESPONSIVE LOGIC

Breakpoints are **canvas-bound** state: `get_all_breakpoints` reads the live Designer breakpoint set and requires the Bridge App. Responsive logic is indirect but deliberate:

- Styles carry `style_names` and are defined once; per-breakpoint behavior comes from the style system inside the Designer (a style's properties resolve per breakpoint in the canvas).
- An element's responsive behavior is therefore changed by editing which styles apply (`set_style`) and what those styles contain (`create_style` / `update_style`), not by a dedicated responsive action.
- Snapshot verification is breakpoint-aware: `get_element_snapshot` reflects the current canvas mode, so a responsive change should be verified at the target breakpoint with the canvas on that breakpoint.
- **Version-qualified**: breakpoint reads are canvas-bound and version-dependent — verify
  `get_all_breakpoints` against the pinned server version (see `version-fixture.md`) before
  relying on its result; the local OSS baseline exposes breakpoints read-only.

---

## 8. ASSETS AND PAGES IN DESIGNER CONTEXT

**Assets** feed the visual layer: `list_assets`, `get_asset`, `get_asset_preview`, `create_asset` (`file_name`, `file_hash`), `create_asset_folder`, `update_asset`, `update_asset_folder`, `upload_image_by_url` (DW), `compress_assets` (`format` — WebP/AVIF pipeline, DW), `list_compression_tasks` / `get_compression_task`, and `delete_asset` (DS). Elements bind to assets with `set_image_asset` (`image_asset_id`); the edit loop for an image swap is: upload → list to confirm the asset id → `set_image_asset` → snapshot verify.

**Pages** are the canvas context and the branch vehicle: `create_page` (`siteId`, `title`, `slug`), `create_page_folder`, `update_page_settings`, `switch_page` (canvas-bound), plus branches `create_branch`, `get_branch_details`, `list_branches`, `get_branch_parent_page_id`, `get_current_branch_id` (all RO/DW) and `delete_branch` (DS). Branches are parallel edit contexts: switching the canvas to a branch isolates Designer edits
from the main page. The documented surface covers create/list/details/delete only — **no merge
operation exists in the MCP surface**; merging happens in the Webflow UI/Designer. Do not imply
an MCP merge; document branch state and hand merge to the operator. `delete_branch` is DS.

---

## 9. OPERATION CLASSES AND GATES

| Class | Examples | Gate |
|---|---|---|
| **RO** read-only | snapshot, query elements/styles/variables/components, canvas state reads, asset/pages reads, breakpoints | none |
| **DW** draft-write | create/update elements, styles, variables, components, props, variants, assets, pages | scope check + target id + write preview; `sk-design` pairing for all Designer mutations |
| **DS** destructive | `remove_element`, `remove_style`, `remove_style_variable_mode`, `remove_all_style_variable_modes`, `delete_variable`, `unregister_component`, `remove_prop`, `delete_variant`, `delete_asset`, `delete_branch` | operator confirmation with exact target + rollback statement (version-history restore) |
| **Publish** | `publish_site` (separate surface) | fresh confirmation naming site/page scope + domains |

Two rules dominate: Designer edits are **draft-only until publish** (the Designer gate is upstream of the publish gate), and **taste never comes from the transport** — any layout/style/component decision loads `sk-design` first.

---

## 10. WORKED FLOWS

### Flow A — Tokenized restyle (light theme)

1. `create_variable_collection` "Brand" (DW) → `create_variable_mode` "Light" (DW) → `create_color_variable` "brand-primary" (DW)
2. `create_style` "Button Primary" with `properties[]` (DW) → `set_style_variable_mode` binding the mode (DW)
3. `query_elements` → `set_style` `["Button Primary"]` on the target (DW)
4. `get_element_snapshot` verify (RO)

### Flow B — Component with variants

1. `transform_element_to_component` (DW) or `create_blank_component` (DW)
2. `create_prop` "label" (DW) → `set_component_instance_prop_values` on the inserted instance (DW)
3. `create_variant` "Hover" (DW) → `set_variant_styles` binding a hover style (DW)
4. `open_component_view` → element edits inside the view (DW, scoped) → `close_component_view`
5. `get_element_snapshot` verify (RO)

### Flow C — Image swap

1. `upload_image_by_url` (DW) → `list_assets` to confirm the id (RO)
2. `set_image_asset` on the element (DW)
3. `get_asset_preview` / `get_element_snapshot` verify (RO)

---

## 11. RELATED RESOURCES

- [`action-reference.md`](action-reference.md) — exact required parameters per Designer action
- [`tool-surface.md`](tool-surface.md) — local OSS baseline and module layout
- [`mcp-wiring.md`](mcp-wiring.md) — transport, auth, and Bridge App connection details
- [`troubleshooting.md`](troubleshooting.md) — Bridge App / canvas failure triage
- [`../feature-catalog/design/designer.md`](../feature-catalog/design/designer.md) — capability card
- [`../feature-catalog/design/component-variants.md`](../feature-catalog/design/component-variants.md) — variant capability card
