DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 14 of 20

## Focus

Cross-cutting runtime mapping — hierarchical budgets plus locks-and-fencing. Reconcile iteration 9's budget lifecycle and iterations 3–6's proof/seal/approval contracts with `.opencode/skills/system-deep-loop/runtime/lib/hierarchical-budgets/` and `runtime/lib/locks-and-fencing/`. Decide atomic boundary order across graph admission, budget reservation, approval wait, lease/claim/fence acquisition, authorization, dispatch, debit/settlement, effect receipts, retry, cancellation, and resume. Identify deadlock/race/ABA/stale-fence/reset risks and exact recovery ownership.

Read actual implementations/tests and 036 effect/fencing specs, plus relevant GraphARC budget/session/planner behavior. Build on studies 1–2 and iterations 1–13; every finding classifies a named prior decision. Include state-machine composition, transaction boundaries, failure matrix, mutants, compatibility and when-not-to-use.

## Outputs and constraints

Read `.opencode/agents/deep-research.md` completely and lineage state first. One LEAF iteration, 3–5 actions, no subagents. Write only `iterations/iteration-014.md`, append one state record, and `deltas/iter-014.jsonl`. Every finding cited. Route proof iteration/run 14 with executor `cli-codex/gpt-5.6-sol/high/fast`. Continue to max iterations.
