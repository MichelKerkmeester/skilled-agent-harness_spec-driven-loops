---
title: "Agent Instructions"
description: "Webflow Agent Instructions capability card: create/read/search/update/move/delete site rules and skills — the markdown guidance agents follow per site."
trigger_phrases: ["webflow agent instructions", "webflow rules", "webflow skills"]
importance_tier: important
contextType: implementation
version: 1.0.0.0

# Agent Instructions

<!-- sk-doc-template: skill_asset_feature_catalog -->
## 1. OVERVIEW

Manages a site's agent instructions: markdown-based rules and skills that give agents custom
guidance for working on that site. Instructions can reference Webflow primitives (variables,
styles, components, pages, CMS collections and items, locales, and other instructions), which
resolve server-side against the site's own data.

---
## 2. HOW IT WORKS

### Actions (`data_agent_instructions_tool`, read+write)

| Action | Params | Class |
|--------|--------|-------|
| `search_instructions` | `site_id` | RO |
| `read_instruction` | `site_id`, `path` | RO |
| `create_instruction` | `site_id`, `kind`, `path`, `markdown` | DW |
| `update_instruction` | `site_id`, `kind`, `path` | DW |
| `delete_instruction` | `site_id`, `kind`, `path` | DS |
| `move_instruction` | `site_id`, `kind`, `fromPath`, `toPath` | DW |

### Semantics

- `kind` selects the path grammar (rule vs skill); deleting a skill's `SKILL.md` cascades to all
  its descendants.
- `move_instruction` renames/moves with cascade; the destination must keep the same parent folder.
- This is site-scoped configuration — review content before writing; treat deletion as DS.

### Example prompts

- "search the agent instructions on the test site"
- "create a rule 'always use staging subdomain for publishes' on the test site"
- "move the skill 'brand-guidelines' to 'shared/'" (confirmation for cascading renames)

---
## 3. SOURCE FILES

### Implementation

| File | Layer | Role |
|---|---|---|
| `../../references/action-reference.md` | Shared | Required parameters per action (Agent Instructions) |
| `../../references/tool-surface.md` | Shared | Local OSS baseline where applicable |
| `../../SKILL.md` | Shared | Frozen classes and gates |

### Validation And Tests

| File | Type | Role |
|---|---|---|
| `../../manual-testing-playbook/` | Manual playbook | Relevant scenarios for this capability |


## 4. SOURCE METADATA

- Group: Agent Instructions
- Canonical catalog source: `feature-catalog.md`
- Feature file path: `intelligence/agent-instructions.md`

Related references:
- [`analyze.md`](analyze.md) — related capability
