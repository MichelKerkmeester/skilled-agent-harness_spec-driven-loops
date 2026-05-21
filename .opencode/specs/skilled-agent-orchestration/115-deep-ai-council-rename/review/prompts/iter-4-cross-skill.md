# Iter-4 — CROSS-SKILL consistency check

## Role
Senior deep-reviewer. Read-only.

## Scope
1. `.opencode/skills/cli-devin/SKILL.md` + `cli-opencode/SKILL.md` + their `references/` + `manual_testing_playbook/`
2. `.opencode/skills/sk-prompt/assets/model-profiles.json`
3. `.opencode/skills/system-spec-kit/SKILL.md` + its `references/cli/`
4. `.opencode/skills/deep-research/SKILL.md` + `deep-review/SKILL.md` + `deep-agent-improvement/SKILL.md`
5. Any skill with `enhances`/`related_to`/`siblings` edge pointing at sk-ai-council or sk-ai-small-model

### Checks
1. Sibling skill metadata correctly references renamed skills.
2. Manual testing playbooks (cli-devin/cli-opencode/manual_testing_playbook/**) reference renamed skill paths.
3. NO broken cross-skill links.

## Output
JSON FINDINGS + NARRATIVE. End.
