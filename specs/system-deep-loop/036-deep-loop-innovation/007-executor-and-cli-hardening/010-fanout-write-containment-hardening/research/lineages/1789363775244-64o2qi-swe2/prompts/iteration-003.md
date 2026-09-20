---
title: "Iteration 3 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 3 Prompt Pack

Research Topic: Lower-cost alternatives to per-lineage git worktrees for fan-out write isolation, preserving parallel fan-out and exact attribution.
Iteration: 3 of 3
Focus Area: single-checkout mechanisms — per-lane write redirection, OS-level write denial, per-process write attribution; the churn detector's role under each mechanism; `git worktree move` / relocation survival matrix; ranked verdict.

## Boundaries

- Write only inside this lineage directory.
- Read anywhere; cite every finding as `[SOURCE: file:line]` or `[SOURCE: url]`.
- Perform the iteration inline in this session; do not dispatch a nested CLI or agent.
- Do not run repository tooling that writes outside this directory (no generate-context.js, no validate.sh, no git write/checkout/commit).
