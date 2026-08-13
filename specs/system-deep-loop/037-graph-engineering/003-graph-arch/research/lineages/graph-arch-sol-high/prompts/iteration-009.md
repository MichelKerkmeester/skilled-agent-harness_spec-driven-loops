DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 9 of 20

## Focus

R7 — Budget admission/reservation/debit/receipt lifecycle. Compare GraphARC registry-derived worst-case admission, graph/node/call/token/time meters, gateway spend, approval-wait credits, fan-out/cycle behavior, resume/reset behavior, and tests. Decide a hierarchical budget protocol covering admission quote, atomic reservation, child allocation, dispatch debit, observed settlement, refund/release, retry/idempotency, receipts, exhaustion edge semantics, and interaction with authorization and effects.

Examine `planner/admission.py`, `runtime/budget.py`, `runtime/usage.py`, `gateway/spend.py`, `tests/test_budget_enforcement.py` plus related tests, the alpha-model budget blog, system-deep-loop `runtime/lib/hierarchical-budgets/`, authorized-ledger, locks/fencing, and 036. Build on iterations 1–8; classify each finding against a named prior decision. Include when-not-to-use boundaries.

## Outputs and constraints

Read `.opencode/agents/deep-research.md` completely and lineage state first. One LEAF iteration, 3–5 actions, no subagents. Write only `iterations/iteration-009.md`, one canonical state append, and `deltas/iter-009.jsonl`. Every finding needs a source/inference marker. Narrative must include lifecycle/state machine, schema/receipts, authority ordering, concurrency/fencing, retry/refund rules, exhaustion routing, mutants, runtime mapping, and non-applicability. Route proof iteration/run 9; executor `cli-codex/gpt-5.6-sol/high/fast`. Continue to max iterations.
