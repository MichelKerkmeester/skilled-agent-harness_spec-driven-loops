---
title: "Iteration 2 Prompt Pack"
trigger_phrases: []
---
DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Iteration 2 Prompt Pack

Research Topic: Lower-cost alternatives to per-lineage git worktrees for fan-out write isolation, preserving parallel fan-out and exact attribution.
Iteration: 2 of 3
Focus Area: filesystem-level sharing — APFS copy-on-write clonefile materialization under a real worktree registration, overlay/CoW filesystems, per-lane sandboxed working directories with a shared object store; interaction with symlinked dependency roots, workspace self-links, and compiled entry-point guards.

## Boundaries

- Write only inside this lineage directory.
- Read anywhere; cite every finding as `[SOURCE: file:line]` or `[SOURCE: url]`.
- Perform the iteration inline in this session; do not dispatch a nested CLI or agent.
- Do not run repository tooling that writes outside this directory (no generate-context.js, no validate.sh, no git write/checkout/commit).
