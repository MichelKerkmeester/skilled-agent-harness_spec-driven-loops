---
title: "Read-only content access"
description: "List projects, read the active context, read design-system files, and fetch artifacts, all read-only and always safe."
trigger_phrases:
  - "read open design content"
  - "list projects"
  - "get active context"
  - "read design system"
  - "read tokens css"
version: 1.4.0.2
---

# Read-only content access (list_projects / get_file / design-systems read)

<!-- sk-doc-template: skill_asset_feature_catalog -->

## 1. OVERVIEW

Reads local Open Design content without writing anything: projects, files, the active context the user has open now, registered design-systems, and finished artifacts. This is the safe default direction and the one an agent reaches for most.

The read tools never need a cloud account for local content and never mutate state, so they run freely before any decision about a gated verb. They are also the input to design work: a design-system read feeds the judgment that `sk-design` owns.

---

## 2. HOW IT WORKS

### The read-only tool set

After wiring, the agent calls Open Design's MCP tools. The read-only tools are always safe: `list_projects`, `get_active_context` (what the user has open now), `get_project`, `get_file`, `search_files`, `list_files`, `get_artifact`, `list_skills`, `list_plugins`, `list_agents`, and `get_run`. From the terminal directly, `node "$OD_BIN" tools design-systems read --path <manifest-path>` reads a registered design system's pull-layer files.

### Design-system shape and the live-read rule

A design system is a `DESIGN.md` (9-section prose), a paste-ready `tokens.css` (a `:root` block), and an optional `components.html`. Open Design content is read live and never copied or cached into a repo, because reusing a system's files happens at build time in the target app rather than by vendoring Open Design's files, whose per-source Apache-2.0 or MIT licenses would otherwise attach. The read tools are safe to call without confirmation, since nothing is written and the active context is observed rather than changed.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool_surface.md` | Shared | The read-only tools and the surface or gate or omit policy |
| `references/od_cli_reference.md` | Shared | CLI verb surface with read-only classification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual_testing_playbook/02--reading/read-design-system.md` | Manual playbook | Read a design system's DESIGN.md and tokens.css |

---

## 4. SOURCE METADATA

- Group: Local Content Reads
- Canonical catalog source: `feature_catalog.md`
- Feature file path: `02--reading/read-only-content.md`

Related references:
- [od-mcp-install.md](../01--wiring/od-mcp-install.md) covers the wiring that exposes these tools
- [design-system-grounding.md](../03--grounding/design-system-grounding.md) covers turning a read into a grounded design decision
