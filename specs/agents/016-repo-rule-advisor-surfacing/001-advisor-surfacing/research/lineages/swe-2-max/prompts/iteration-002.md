---
title: "Iteration 2 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 Prompt Pack

Research Topic: Repo rule surfacing — candidate (a) advisor-brief pointer line and candidate (b) trigger-index corpus inclusion.
Iteration: 2 of 4
Focus Area: what each candidate would emit, its silence condition, per-turn context cost measured from the code, action-vs-topic matching, and whether it survives the 022 injection bar and the retrieval-exclusion decision.

## State Files

- Config: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-config.json`
- State log: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-state.jsonl`
- Strategy: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deep-research-strategy.md`
- Iteration narrative: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/iterations/iteration-002.md`
- Delta: `specs/agents/016-repo-rule-advisor-surfacing/research/lineages/swe-2-max/deltas/iter-002.jsonl`

## Constraints

Read-only. Cite `file:line` for every claim. Per-turn cost must be measured or bounded from the code (line lengths, dedup conditions, emission paths), not guessed. Evaluate both candidates against the 022 bar ("names a gate-enforced prohibition, not a restated disposition") and the `retrieval-conventions.md:284` exclusion decision. Read: `.skilled/skills/system-skill-advisor/runtime/lib/render.ts`, `hooks/lib/directive-lifecycle.ts` (+ contract/file-store), the Gate 1 lookup `lookup-trigger-index.mjs`, and how a rule file would appear in lookup output if indexed.
