# Iteration 024 Prompt — Verify P1-A Docs and P1-H2 Config Claim

## SITUATION

The packet 037 review-report lists five P1-A documentation findings and P1-H2 config consistency drift.

## TASK

Verify the SKILL.md, feature catalog, manual testing playbook, sk-doc template references, and `_NOTE_1_DB` / `_NOTE_2_TOOLS` config claim.

## SCOPE

- `.opencode/skills/system-code-graph/SKILL.md`
- `.opencode/skills/sk-doc/assets/skill/skill_md_template.md`
- `.opencode/skills/system-code-graph/feature_catalog/feature_catalog.md`
- `.opencode/skills/sk-doc/assets/feature_catalog/feature_catalog_template.md`
- `.opencode/skills/system-code-graph/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/system-code-graph/manual_testing_playbook/10--devin-hooks/025-devin-session-start.md`
- `.claude/mcp.json`
- `.gemini/settings.json`
- Other runtime configs as comparators only

## CONSTRAINTS

- Read-only on `.opencode/skills/system-code-graph/`.
- Cite template evidence when a claim is about sk-doc conformance.
- Separate real doc drift from template-name or severity overclaims.

## OUTPUT FORMAT

Mirror the deep-review iteration format: Summary, Files Reviewed, Findings grouped by severity, and Convergence Signal.
