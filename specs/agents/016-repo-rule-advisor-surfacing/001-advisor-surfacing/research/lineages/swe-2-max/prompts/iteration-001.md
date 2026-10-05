---
title: "Iteration 1 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 1 Prompt Pack

Research Topic: Repo rule surfacing through the advisor — should any surface beyond Gate 5 suggest `.skilled/repo-rules/` rules?
Iteration: 1 of 4
Focus Area: current Gate 5 delivery path, repo-rules corpus inventory, and all mandated prior work (what is already decided or ruled out)

## State Files

- Config: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-config.json`
- State log: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-state.jsonl`
- Strategy: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-strategy.md`
- Iteration narrative: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/iterations/iteration-001.md`
- Delta: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deltas/iter-001.jsonl`

## Constraints

Read-only on the repository. Cite `file:line` for every claim. Read all mandated prior work: `specs/hooks/022-smart-rule-injection` (decisions.md, 001-deep-research/implementation-summary.md), `.skilled/hooks/injection-contract.md`, `REPO RULES.md` (trigger table + section 4 scope), `specs/agents/010-repo-rule-system-integration/research`, plus the Gate 5 contract in `AGENTS.md` and the `.skilled/repo-rules/` inventory with `trigger_phrases` frontmatter. Record what prior packets already decided or ruled out — do not re-litigate settled decisions without new evidence.
