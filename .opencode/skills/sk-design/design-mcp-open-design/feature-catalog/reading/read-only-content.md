---
title: "Read-only content access"
description: "List projects, read the active context, read design-system files, and fetch artifacts — all read-only; pure-transport reads are always safe, design-feeding reads are guarded."
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

After wiring, the agent calls Open Design's MCP tools. Pure-transport reads (`list_projects`, `list_files`, `list_skills`, `list_plugins`, `list_agents`) are always safe to call — they only enumerate inventory, never feed a design decision. Design-feeding reads (`get_active_context`, `get_project`, `get_file`, `search_files`, `get_artifact`, `get_run`) are guarded — per `references/tool-surface.md`, they require `sk-design`'s ground → token-system → critique gate first, except `get_file`/`search_files` with a non-design-use receipt. From the terminal directly, `node "$OD_BIN" tools design-systems read --path <manifest-path>` reads a registered design system's pull-layer files.

### Design-system shape and the live-read rule

A design system is a `DESIGN.md` (9-section prose), a paste-ready `tokens.css` (a `:root` block), and an optional `components.html`. Open Design content is read live and never copied or cached into a repo, because reusing a system's files happens at build time in the target app rather than by vendoring Open Design's files, whose per-source Apache-2.0 or MIT licenses would otherwise attach. None of these tools write anything, but design-feeding reads still pass through `sk-design`'s gate before the content can inform a decision — see `references/tool-surface.md` for the guarded/exempt split.

---

## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `references/tool-surface.md` | Shared | The read-only tools and the surface or gate or omit policy |
| `references/od-cli-reference.md` | Shared | CLI verb surface with read-only classification |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `manual-testing-playbook/reading/read-design-system.md` | Manual playbook | Read a design system's DESIGN.md and tokens.css |

---

## 4. SOURCE METADATA

- Group: Local Content Reads
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `reading/read-only-content.md`

Related references:
- [od-mcp-install.md](../wiring/od-mcp-install.md) covers the wiring that exposes these tools
- [design-system-grounding.md](../grounding/design-system-grounding.md) covers turning a read into a grounded design decision
