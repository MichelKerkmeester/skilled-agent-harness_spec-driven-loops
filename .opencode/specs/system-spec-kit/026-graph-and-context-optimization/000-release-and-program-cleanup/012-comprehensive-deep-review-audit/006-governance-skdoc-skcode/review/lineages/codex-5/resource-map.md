# Deep Review Evidence Map

Generated at: 2026-06-04T17:58:13Z

`resource_map_present` was false at init, so no upstream resource-map coverage gate ran. This file maps final findings to evidence files emitted by this lineage.

| Finding | Severity | Primary Evidence |
|---|---|---|
| F001 | P1 | `.opencode/skills/sk-code/assets/opencode/checklists/universal_checklist.md`, `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh` |
| F002 | P2 | `.opencode/skills/sk-code/SKILL.md`, `.opencode/skills/sk-code/scripts/hooks/claude-posttooluse.sh` |
| F003 | P1 | `.opencode/skills/sk-code/scripts/check-comment-hygiene.sh`, `.opencode/hooks/pre-commit`, `.github/workflows/comment-hygiene.yml` |
| F004 | P1 | `.opencode/skills/sk-doc/assets/template_rules.json`, `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` |
| F005 | P2 | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`, `.opencode/skills/sk-doc/assets/frontmatter_templates.md` |

Novel logic gaps:

- Mixed allowed-plus-forbidden comment lines bypass the checker because allowed patterns skip the entire line.
- sk-doc's machine-readable skill rules and skill template disagree about the reference-section requirement.
