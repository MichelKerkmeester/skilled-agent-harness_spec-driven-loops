DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 8 of 20

## Focus

R6 — Ledger-first observability plus replay-to-OTel projection. Determine which GraphARC records are canonical, duplicated, inferred, or disconnected across trace JSONL, policy audit JSONL, session SQLite/events, checkpoints, cost, replay, and OTel. Decide an authoritative `GraphExecutionEventV1`/projection contract in which the ledger is evidence and OTel is derived telemetry, with deterministic replay, idempotent export, ordering, correlation, redaction, gap/error behavior, and disagreement detection.

Examine `observe/trace.py`, `observe/replay.py`, `observe/otel.py`, `observe/cost.py`, `policy/audit.py`, `session/events.py`, session store/runtime and tests, graph-observability blog passages, system-deep-loop `runtime/lib/shadow-parity/`, authorized-ledger, and 036. Build on iterations 1–7; every finding names and classifies a specific prior decision. Include when-not-to-use boundaries.

## Outputs and constraints

Read `.opencode/agents/deep-research.md` completely and lineage state first. One LEAF iteration, 3–5 actions, no subagents. Write only `iterations/iteration-008.md`, append one canonical record, and write `deltas/iter-008.jsonl`. Every finding needs `[SOURCE: file:line]` or `[INFERENCE: ...]`. Narrative must include source-of-truth matrix, event/projection schema, replay/export algorithm, audit disagreement failure semantics, shadow-parity mapping, mutants, and non-applicability. Route proof iteration/run 8 with executor `cli-codex/gpt-5.6-sol/high/fast`. Max-iterations policy remains binding.
