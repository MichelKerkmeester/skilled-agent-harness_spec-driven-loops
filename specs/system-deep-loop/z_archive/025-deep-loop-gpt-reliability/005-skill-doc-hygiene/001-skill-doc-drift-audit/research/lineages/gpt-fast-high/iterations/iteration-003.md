# Iteration 3: cli-opencode Assets and Playbook Drift

## Focus

Check `cli-opencode` references/assets for concrete command examples that still use direct `--agent ai-council`.

## Findings

1. `cli-opencode/assets/prompt_templates.md` Template 10 declares `Agent: ai-council` and gives a copy-paste command using `--agent ai-council`. [SOURCE: .opencode/skills/cli-opencode/assets/prompt_templates.md:369-388]
2. That template contradicts phase 010's redirect: direct `opencode run --agent ai-council` is no longer reachable; callers should use `/deep:ai-council` for a full session or a primary/general/orchestrate Task-dispatch path for a single planning pass. [SOURCE: .opencode/specs/deep-loops/031-deep-loop-issues-with-gpt-opencode/010-ai-council-subagent-only/implementation-summary.md:63-68]
3. `cli-opencode/manual_testing_playbook/manual_testing_playbook.md` still says CO-017 verifies `--agent ai-council`. This is outside the 014 spec's explicit README/SKILL candidate list, but it is an active skill doc surface and is stale for the same phase 010 reason. [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:417]
4. `cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md` is a concrete stale scenario: objective, request, execution step, and table all require `--agent ai-council`. [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:27-43] [SOURCE: .opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md:51]

## Sources Consulted

- `.opencode/skills/cli-opencode/assets/prompt_templates.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/agent-routing/multi-ai-council-multi-strategy.md`
- `010-ai-council-subagent-only/implementation-summary.md`

## Assessment

- newInfoRatio: 0.75
- Novelty: found asset and playbook surfaces beyond the highest-priority README/SKILL files.
- Confidence: high for asset drift; medium-high for playbooks because the user emphasized SKILL/reference/assets/READMEs, not manual-testing docs, but they are living skill docs.

## Reflection

- Worked: follow-on grep for direct command syntax caught copy-paste hazards.
- Failed: none.
- Ruled out: `cli-claude-code` `--agent ai-council` examples are for Claude Code, not OpenCode `mode: subagent`; not a phase 010 contradiction. [SOURCE: .opencode/skills/cli-claude-code/SKILL.md:279]

## Recommended Next Focus

Check whether `cli-opencode` also contradicts phase 009's orchestrate routing rows for deep-review/context.
