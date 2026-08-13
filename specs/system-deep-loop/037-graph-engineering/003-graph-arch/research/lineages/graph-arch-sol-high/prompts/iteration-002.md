DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 2 of 20

## State

Focus area: Inventory GraphARC's governance architecture and trust boundaries before specializing into the eight prioritized mechanisms. Trace proposal/admission/materialization, policy/approval/audit, session runtime, trace/replay/OTel, budgets, registry ownership, and execution boundaries. Identify canonical versus convenience objects, forgeable versus independently re-derived facts, and actual enforcement chokepoints.

Build on iteration 1's decision ledger and the orientation seed. Frame every finding as confirm/refine/extend/contradict against a named prior decision. Avoid repeating the ledger. Include when-not-to-use boundaries.

Primary source targets: `context/graph-arch/grapharc/planner/`, `policy/`, `session/`, `observe/`, `runtime/`, and their tests; consult README/ROADMAP only to reconcile claims with code. Tie the inventory to the graph-engineering blogs where they motivate governance-in-structure.

## State files and outputs

- Read config/state/strategy/registry under `specs/system-deep-loop/037-graph-engineering/003-graph-arch/research/lineages/graph-arch-sol-high/` first.
- Write only `iterations/iteration-002.md`, append one canonical record to `deep-research-state.jsonl`, and write `deltas/iter-002.jsonl`.

## Constraints

- Read `.opencode/agents/deep-research.md` completely; exactly one LEAF iteration; 3–5 focused research actions; no subagents.
- Every finding requires `[SOURCE: file:line]` or `[INFERENCE: ...]` and a prior-decision classification.
- Include explicit trust-boundary table and when-not-to-use notes in the narrative.
- Canonical record requirements and route proof are identical to iteration 1, with `iteration:2`, `run:2`, and executor provenance `cli-codex/gpt-5.6-sol/high/fast`.
- Do not stop for convergence; stop policy is max-iterations.
