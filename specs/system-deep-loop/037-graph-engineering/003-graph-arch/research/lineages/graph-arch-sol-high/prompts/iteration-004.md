DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 4 of 20

## Focus

R2 — Materialization sealing and TOCTOU closure. Derive the sealed compiled-graph artifact and exact revalidation rules at execution. Trace proposal fingerprinting, registry-owned node bodies, argument forwarding, declared writes, edge confinement, policy/registry mutation, forged admission results, and approval staleness through GraphARC `planner/materialize.py`, `proposal.py`, `loop.py`, relevant tests, and the structural governance blogs. Map the result to system-deep-loop `runtime/lib/locks-and-fencing/`, authorized-ledger, and 036 effect/fencing boundaries.

Build on iterations 1–3. Every finding must identify a specific prior decision and classify it as confirm/refine/extend/contradict. Explicitly distinguish immutable content sealing from runtime-fresh authority checks. Include when-not-to-use boundaries.

## State and outputs

Read lineage config/state/strategy/registry first. Write only `iterations/iteration-004.md`, append one canonical state record, and write `deltas/iter-004.jsonl`.

## Constraints

Read `.opencode/agents/deep-research.md` completely; exactly one LEAF iteration; 3–5 research actions; no subagents. Every finding needs `[SOURCE: file:line]` or `[INFERENCE: ...]`. Narrative must include artifact schema/fields, seal inputs, execution revalidation sequence, TOCTOU mutant cases, and when-not-to-use. Route proof uses iteration/run 4 and executor `cli-codex/gpt-5.6-sol/high/fast`. Max-iterations policy: continue regardless of convergence telemetry.
