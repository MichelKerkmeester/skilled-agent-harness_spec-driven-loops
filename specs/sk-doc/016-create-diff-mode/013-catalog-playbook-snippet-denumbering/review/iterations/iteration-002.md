# Deep-Review Iteration 002 — sk-doc assets & templates

**Executor:** DeepSeek-v4-pro (cli-opencode, --pure, read-only)
**Findings:** P0=0 P1=20 P2=39 (total 59)

## Summary
Of 85 flagged links, 18 are real WRONG_SLUG_TARGET_EXISTS (P1) where the target file exists at a different relative path — fixable with path-depth corrections (systematic pattern: many use one extra ../ level from assets/). 62 are TEMPLATE_EXAMPLE (P2) — intentional placeholders in copy-paste scaffolds (benchmark report, llmstxt examples, skill/readme/reference templates). 5 are FALSE_POSITIVE — 2 symlinks the checker doesn't follow and 2 references that resolve correctly. None are de-numbering migration (#133) caused. No P0 findings. The common systemic bug is a consistent off-by-one ../ depth when linking from assets/ or assets/readme/ to references/global/ and sibling assets.

## Findings
| Sev | Classification | Source | Reference | 133-caused | Recommendation |
|-----|----------------|--------|-----------|-----------|----------------|
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./SOURCE.md` | no | No fix needed; template instantiates with real files at benchmark time. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./results.csv` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./per-probe.jsonl` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./runtime-measurements.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./SOURCE.md` | no | Same placeholder; no fix needed. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./results.csv` | no | Same placeholder; no fix needed. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./per-probe.jsonl` | no | Same placeholder; no fix needed. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `./runtime-measurements.md` | no | Same placeholder; no fix needed. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/benchmark/benchmark_report_template.md` | `../README.md` | no | No fix needed; template placeholder for a sibling benchmarks README. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `./readme_template.md` | no | Change to ./readme/readme_template.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `./install_guide_template.md` | no | Change to ./readme/install_guide_template.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `../../references/global/hvr_rules.md` | no | Change ../../ to ../ (one level up from assets/ reaches sk-doc/). |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `../../references/global/core_standards.md` | no | Change ../../ to ../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `../../../../command/create/changelog.md` | no | Change to ../../commands/create/changelog.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/changelog_template.md` | `../../../system-spec-kit/references/workflows/nested_changelog.md` | no | Change ../../../ to ../../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/command_template.md` | `./skill_md_template.md` | no | Change to ./skill/skill_md_template.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/command_template.md` | `../../references/global/core_standards.md` | no | Change ../../ to ../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/command_template.md` | `../../references/global/validation.md` | no | Change ../../ to ../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | `../skill/skill_md_template.md` | no | Change to ./skill/skill_md_template.md (stay in assets/). |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | `../command_template.md` | no | Change to ./command_template.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | `../../references/global/core_standards.md` | no | Change ../../ to ../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/frontmatter_templates.md` | `../../references/global/validation.md` | no | Change ../../ to ../. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | `url` | no | No fix needed; intentional placeholder in template examples showing URL format. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | `../docs/guide.md` | no | No fix needed; template example demonstrating what NOT to do. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | `/docs/guide.md` | no | No fix needed; template example demonstrating invalid root-relative path. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | `../skill/skill_md_template.md` | no | Change to ./skill/skill_md_template.md. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/llmstxt_templates.md` | `../../references/global/core_standards.md` | no | Change ../../ to ../. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | `./MCP%20-%20New%20Tool.md` | no | No fix needed; template placeholder for a deprecation notice example. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | `./frontmatter_templates.md` | no | Change ./frontmatter_templates.md to ../frontmatter_templates.md. |
| P2 | FALSE_POSITIVE | `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | `../../../../install_guides/MCP%20-%20Spec%20Kit%20Memory.md` | no | Link is valid; symlink at target resolves correctly. Checker likely does not follow symlinks. |
| P2 | FALSE_POSITIVE | `.opencode/skills/sk-doc/assets/readme/install_guide_template.md` | `../../../../install_guides/MCP%20-%20Code%20Mode.md` | no | Link is valid; symlink at target resolves correctly. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | `../README.md` | no | No fix needed; template placeholder in Related section of scaffold. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | `../../ARCHITECTURE.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/readme_code_template.md` | `../sibling/README.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/readme_template.md` | `../skill-name/SKILL.md` | no | No fix needed; template placeholder for Related Skills table. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/readme/readme_template.md` | `./path/to/doc.md` | no | No fix needed; template placeholder for Related Documents table. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `frontmatter_templates.md` | no | Change to ../frontmatter_templates.md. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `./references/workflow-details.md` | no | No fix needed; example reference in template scaffold. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `./references/reference-name.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `./references/workflow-name.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `./assets/template-name.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `./assets/checklist-name.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_md_template.md` | `INSTALL_GUIDE.md` | no | No fix needed; template placeholder for optional install guide linkage. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | `./SKILL.md` | no | No fix needed; template placeholder for real SKILL.md in a skill package. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | `./references/[name].md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_readme_template.md` | `./assets/[name].md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `./standard_file.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../scripts/script_name.js` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../assets/template_name.md` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../scripts/workflow_name.py` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../assets/workflow_config.yaml` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../scripts/script_name.py` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../assets/config.yaml` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `./scripts/workflow_router.py` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../scripts/` | no | No fix needed; template placeholder. |
| P2 | TEMPLATE_EXAMPLE | `.opencode/skills/sk-doc/assets/skill/skill_reference_template.md` | `../assets/` | no | No fix needed; template placeholder. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | `../../template_rules.json` | no | Change ../../template_rules.json to ../template_rules.json. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | `../../../references/global/core_standards.md` | no | Change ../../../ to ../../. |
| P1 | WRONG_SLUG_TARGET_EXISTS | `.opencode/skills/sk-doc/assets/testing_playbook/manual_testing_playbook_template.md` | `../../../SKILL.md` | no | Change ../../../SKILL.md to ../../SKILL.md. |

Review verdict: CONDITIONAL