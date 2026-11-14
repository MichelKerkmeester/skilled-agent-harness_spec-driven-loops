# Route parity: every skill path an agent file stops citing, and whether the skill's entry point reaches it

## Written at commit 3018fbbd44, before any agent file was edited. Each bullet ends with its outcome.

## design.md

### The `sk-code` router was run for a design task and returned action `route` to the frontend packet

### Command: `node .skilled/bin/compiled-route.cjs --hub sk-code --prompt "Decide the spacing scale, colour palette, elevation and motion for a new settings page interface"`

- `sk-code/sk-code-frontend/assets/tokens.css`, named in that packet's `ROUTER.md` and `SKILL.md`: reachable
- `sk-code/sk-code-frontend/references/web-motion-and-interaction.md`, named in that packet's `ROUTER.md` and `SKILL.md` and in the `sk-code` hub `ROUTER.md`: reachable
- `sk-code/sk-code-frontend/references/web-visual-hierarchy.md`, named in that packet's `ROUTER.md` and `SKILL.md` and in the `sk-code` hub `ROUTER.md`: reachable
- `sk-code/sk-code-frontend/references/web-visual-values.md`, named in that packet's `ROUTER.md` and `SKILL.md` and in the `sk-code` hub `ROUTER.md`: reachable

## markdown.md

### The `sk-doc` router was run once per command, with the command's own purpose as the prompt

- `/create:agent`, `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`, router target `sk-create-agent`, named in `sk-create-agent/SKILL.md`, `sk-create-agent/ROUTER.md`: reachable
- `/create:skill`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`, router target `sk-create-skill`, named in `sk-create-skill/SKILL.md`, `sk-create-skill/ROUTER.md`: reachable
- `/create:skill`, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-reference-template.md`, router target `sk-create-skill`, named in `sk-create-skill/SKILL.md`, `sk-create-skill/ROUTER.md`: reachable
- `/create:skill-parent`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-hub-template.md`, router target `sk-create-skill`, named in `sk-create-skill/ROUTER.md`: reachable
- `/create:skill-parent`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-registry-template.json`, router target `sk-create-skill`, named in `sk-create-skill/ROUTER.md`: reachable
- `/create:skill-parent`, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md`, router target `sk-create-skill`, named in `sk-create-skill/ROUTER.md`: reachable
- `/create:feature-catalog`, `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md`, router target `sk-create-feature-catalog`, named in `sk-create-feature-catalog/SKILL.md`, `sk-create-feature-catalog/ROUTER.md`: reachable
- `/create:manual-testing-playbook`, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`, router target `sk-create-manual-testing-playbook`, named in `sk-create-manual-testing-playbook/SKILL.md`, `sk-create-manual-testing-playbook/ROUTER.md`: reachable
- `/create:readme`, `.skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md`, router target `sk-create-readme`, named in `sk-create-readme/SKILL.md`, `sk-create-readme/ROUTER.md`: reachable
- `/create:changelog`, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`, router target `sk-create-changelog`, named in `sk-create-changelog/SKILL.md`, `sk-create-changelog/ROUTER.md`: reachable
- `/create:command`, `.skilled/skills/sk-doc/sk-create-command/assets/command-template.md`, router target `sk-create-command`, named in `sk-create-command/SKILL.md`, `sk-create-command/ROUTER.md`: reachable
- `/create:benchmark`, `.skilled/skills/sk-doc/sk-create-benchmark/assets/shared/benchmark-report-template.md`, router target `sk-create-benchmark`, named in `sk-create-benchmark/SKILL.md`, `sk-create-benchmark/ROUTER.md`: reachable
- `/create:diff`, `.skilled/skills/sk-doc/sk-create-diff/scripts/create_diff.py`, router target `sk-create-diff`, named in `sk-create-diff/SKILL.md`, `sk-create-diff/ROUTER.md`: reachable
- `/create:repo-rule`, `.skilled/skills/sk-doc/sk-create-repo-rule/assets/repo-rule-template.md`, router target `sk-create-repo-rule`, named in `sk-create-repo-rule/SKILL.md`, `sk-create-repo-rule/ROUTER.md`: reachable
- `/create:repo-rule`, `.skilled/skills/sk-doc/sk-create-repo-rule/assets/repo-rules-router-template.md`, router target `sk-create-repo-rule`, named in `sk-create-repo-rule/SKILL.md`, `sk-create-repo-rule/ROUTER.md`: reachable
- `/create:with-human-voice`, `.skilled/skills/sk-doc/sk-create-with-human-voice/assets/voice-report-template.md`, router target `sk-create-with-human-voice`, named in `sk-create-with-human-voice/SKILL.md`, `sk-create-with-human-voice/ROUTER.md`: reachable
- `/create:goal`, `.skilled/skills/sk-doc/sk-create-goal/assets/goal-top-level-template.md`, router target `sk-create-goal`, named in `sk-create-goal/SKILL.md`, `sk-create-goal/ROUTER.md`: reachable
- `markdown` row, `.skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md`: a generic prompt makes the router defer, the same file is selected by the `/create:readme` route to `sk-create-readme` and named in `sk-create-readme/SKILL.md`, `sk-create-readme/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-agent/assets/agent-template.md`, same packet as its command row, named in `sk-create-agent/SKILL.md`, `sk-create-agent/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-skill/assets/skill/skill-md-template.md`, same packet as its command row, named in `sk-create-skill/SKILL.md`, `sk-create-skill/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-skill/assets/parent-skill/parent-skill-root-router-template.md`, same packet as its command row, named in `sk-create-skill/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-feature-catalog/assets/feature-catalog-template.md`, same packet as its command row, named in `sk-create-feature-catalog/SKILL.md`, `sk-create-feature-catalog/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-manual-testing-playbook/assets/manual-testing-playbook-template.md`, same packet as its command row, named in `sk-create-manual-testing-playbook/SKILL.md`, `sk-create-manual-testing-playbook/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-readme/assets/readme-template.md`, same packet as its command row, named in `sk-create-readme/SKILL.md`, `sk-create-readme/ROUTER.md`: reachable
- Related-resources table, `.skilled/skills/sk-doc/sk-create-changelog/assets/changelog-template.md`, same packet as its command row, named in `sk-create-changelog/SKILL.md`, `sk-create-changelog/ROUTER.md`: reachable

## deep-review.md

- `.skilled/skills/sk-code/sk-code-review/references/review-core.md`, named in `sk-code-review/SKILL.md`, `sk-code-review/ROUTER.md` as the first resource the review mode loads: reachable

## Directory citations the new path check rejects

- `markdown`, `.skilled/skills/system-spec-kit/templates/examples/`, named with its per-level folder in `system-spec-kit/references/workflows/spec-authoring-card.md` line 82, which the row already tells the agent to read first: reachable
- `markdown`, `.skilled/skills/system-spec-kit/runtime/cli/spec/`, replaced by the full path of `check-example-drift.sh` in that folder, so no reference is lost: reachable
- `prompt-improver`, `.skilled/skills/sk-prompt/references/`, both reference files are named with their load conditions in `sk-prompt/SKILL.md` lines 60, 179 and 180: reachable
