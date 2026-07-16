# Iteration 004 - Maintainability

## State Summary

- Iteration: 4 of 7
- Focus dimension: maintainability
- Active findings entering iteration: P0:0 P1:3 P2:1
- Files reviewed:
  - `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
  - `.opencode/skills/sk-doc/assets/frontmatter_templates.md`
  - `.opencode/skills/sk-doc/assets/readme/readme_template.md`
  - `.opencode/skills/sk-doc/assets/changelog_template.md`
  - `.opencode/skills/sk-code/SKILL.md`
  - `.opencode/skills/sk-code/assets/opencode/recipes/spec_folder_write.md`
  - `.opencode/skills/system-spec-kit/constitutional/spec-folder-naming.md`

## Findings

### F005 - P2 - sk-doc's skill template has a stale same-directory link to `frontmatter_templates.md`

The skill template correctly links to `../frontmatter_templates.md` in the description-budget note, but the later "Complete Reference" link points to `frontmatter_templates.md` in the current `assets/skill/` directory. The actual frontmatter asset lives one directory up at `assets/frontmatter_templates.md`. This is a low-risk navigation defect, but it sits in the template authors are told to copy from.

Evidence:

- [SOURCE: .opencode/skills/sk-doc/assets/skill/skill_md_template.md:79] uses the correct `../frontmatter_templates.md` relative link.
- [SOURCE: .opencode/skills/sk-doc/assets/skill/skill_md_template.md:98] uses the stale same-directory `frontmatter_templates.md` link.
- [SOURCE: .opencode/skills/sk-doc/assets/frontmatter_templates.md:1] confirms the referenced frontmatter asset exists at the parent assets level.

Concrete fix: change the line 98 link target to `../frontmatter_templates.md`.

## Adversarial Self-Check

No P0 or P1 findings were reported. This is P2 because it affects navigation and copy-paste template quality, not runtime behavior or a hard validation gate.

## Iteration Metrics

| Metric | Value |
|---|---:|
| New P0 | 0 |
| New P1 | 0 |
| New P2 | 1 |
| Severity-weighted new findings | 1 |
| newFindingsRatio | 0.06 |

Review verdict: PASS
