# Iteration 001: Correctness

## Scope

Focus: correctness of the remediation claims against living `cli-opencode` docs.

Files reviewed:

- `.opencode/skills/cli-opencode/SKILL.md`
- `.opencode/skills/cli-opencode/README.md`
- `.opencode/skills/cli-opencode/references/agent_delegation.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/01--cli-invocation/base-non-interactive-invocation.md`
- `.opencode/skills/cli-opencode/manual_testing_playbook/04--agent-routing/general-agent-default.md`

## Findings

### F001 — P1 — cli-opencode still publishes stale direct-agent guidance

`cli-opencode/SKILL.md` says current `opencode run` should not pass `--agent` for the default path and specifically says `--agent general` fails/rejects or should be omitted [SOURCE: `.opencode/skills/cli-opencode/SKILL.md:261`, `.opencode/skills/cli-opencode/SKILL.md:285`, `.opencode/skills/cli-opencode/SKILL.md:319`]. The README repeats that the live dispatch contract does not support direct top-level `context`, `review`, or `debug`, and says to omit `--agent general` [SOURCE: `.opencode/skills/cli-opencode/README.md:105`, `.opencode/skills/cli-opencode/README.md:125`].

Living linked guidance still contradicts that: `agent_delegation.md` recommends `opencode run --agent general` for ai-council routing and default routing [SOURCE: `.opencode/skills/cli-opencode/references/agent_delegation.md:197`, `.opencode/skills/cli-opencode/references/agent_delegation.md:229`, `.opencode/skills/cli-opencode/references/agent_delegation.md:231`], and its routing matrix still presents direct `--agent context`, `--agent review`, and `--agent debug` invocations [SOURCE: `.opencode/skills/cli-opencode/references/agent_delegation.md:222`, `.opencode/skills/cli-opencode/references/agent_delegation.md:225`, `.opencode/skills/cli-opencode/references/agent_delegation.md:226`]. The manual testing playbook still calls the canonical default invocation `--agent general` and still validates `--agent general` as loading `.opencode/agents/general.md` [SOURCE: `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:190`, `.opencode/skills/cli-opencode/manual_testing_playbook/manual_testing_playbook.md:368`].

Impact: operators following the linked reference/playbook can run commands the main skill now labels rejected or unsupported. This is a required documentation fix, not a runtime security blocker.

## Adversarial Self-Check

No P0 asserted. The finding is grounded in direct contradictory doc lines and classified P1 because it can cause failed dispatches or invalid verification scenarios.

Review verdict: CONDITIONAL
