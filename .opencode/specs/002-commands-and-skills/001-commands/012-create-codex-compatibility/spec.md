---
level: 2
status: done
created: 2026-02-17
completed: 2026-02-17
---

# 012 — Create Commands Codex Compatibility

## Problem

Codex misinterprets agent routing metadata in create command `.md` and `.yaml` files as dispatch instructions, causing unintended agent invocations. Same root causes as spec `010` (spec_kit commands) but in a lighter form.

## Root Causes

1. `## Agent Routing` sections in `.md` files with `@agent` names in tables
2. `dispatch:` fields in YAML files with imperative `"Task tool -> @agent..."` strings
3. Weak `<!-- REFERENCE ONLY -->` HTML comment guards that Codex ignores

## Solution

Three-pronged approach (same strategy as spec 010, adapted for create commands):

- **Change A**: Remove `## Agent Routing` sections and `<!-- REFERENCE ONLY -->` guards from all 6 `.md` files
- **Change B**: Add `## CONSTRAINTS` section to all 6 `.md` files with explicit anti-dispatch rules
- **Change C**: Restructure YAML `agent_routing:` to `agent_availability:` — remove `dispatch:` and `agent:` fields, add `condition:` and `not_for:` fields

Additional cleanup (aligned with spec 011):
- **Change D**: Removed all emoji optionality language from create command files — emojis are neither enforced nor mentioned as optional
- Renamed `emoji_conventions:` → `section_icons:` in folder_readme YAML files

## Scope

- 6 `.md` command files in `.opencode/command/create/`
- 14 `.yaml` workflow files in `.opencode/command/create/assets/`
- 20 total `agent_routing:` occurrences replaced across YAML files

## Files Modified

### .md Command Files (6)
| File | Changes |
|------|---------|
| `skill.md` | Removed `## Agent Routing` (3-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS` |
| `agent.md` | Removed `## Agent Routing` (3-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS` |
| `folder_readme.md` | Removed `## Agent Routing` (1-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS`, removed emoji line |
| `install_guide.md` | Removed `## Agent Routing` (1-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS` |
| `skill_asset.md` | Removed `## Agent Routing` (1-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS` |
| `skill_reference.md` | Removed `## Agent Routing` (1-agent table), `<!-- REFERENCE ONLY/END -->` guards, added `## CONSTRAINTS` |

### YAML Workflow Files (14)
All `agent_routing:` blocks restructured to `agent_availability:` with `dispatch:` and `agent:` removed, `condition:` and `not_for:` added. Emoji optionality language stripped.

| File | Blocks Changed |
|------|---------------|
| `create_skill_auto.yaml` | 3 (context, speckit, review) |
| `create_skill_confirm.yaml` | 3 (context, speckit, review) |
| `create_agent_auto.yaml` | 3 (context, speckit, review) |
| `create_agent_confirm.yaml` | 3 (context, speckit, review) |
| `create_folder_readme_auto.yaml` | 1 (review) + emoji cleanup + `emoji_conventions:` → `section_icons:` |
| `create_folder_readme_confirm.yaml` | 1 (review) + emoji cleanup + `emoji_conventions:` → `section_icons:` |
| `create_install_guide_auto.yaml` | 1 (review) + emoji cleanup |
| `create_install_guide_confirm.yaml` | 1 (review) + emoji cleanup |
| `create_skill_asset_auto.yaml` | 1 (review) + emoji cleanup |
| `create_skill_asset_confirm.yaml` | 1 (review) + emoji cleanup |
| `create_skill_reference_auto.yaml` | 1 (review) + emoji cleanup |
| `create_skill_reference_confirm.yaml` | 1 (review) + emoji cleanup |

## Verification Checklist

All checks passed on 2026-02-17:

| # | Check | Expected | Result |
|---|-------|----------|--------|
| 1 | `agent_routing:` in create/ | 0 | 0 |
| 2 | `agent_availability:` in assets/ | 20 | 20 |
| 3 | `dispatch:.*@` in assets/ | 0 | 0 |
| 4 | `## Agent Routing` in *.md | 0 | 0 |
| 5 | `## CONSTRAINTS` in *.md | 6 | 6 |
| 6 | `REFERENCE ONLY` in *.md | 0 | 0 |
| 7 | `[Ee]moji` in create/ | 0 | 0 |
