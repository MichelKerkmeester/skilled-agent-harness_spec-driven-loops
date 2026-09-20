# Detached Deep Review Iteration 001

BINDING: target=specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash
BINDING: maxIterations=1
BINDING: convergence=0.1
BINDING: mode=review
BINDING: dimensions=correctness,security,traceability,maintainability
BINDING: specFolder=specs/cli-external-orchestration/069-llmgateway-deepseek-v4-1-flash

Review the bound spec-folder target read-only. Execute this iteration inline in the current detached lineage process. Do not dispatch a nested CLI, agent, Task, or subprocess. Do not modify target files. Cover all four dimensions in one pass. Compare the packet requirements, operational documentation, Pi settings/model catalog, fan-out allowlist/provider map, executor configuration, and tests. Re-read every cited source before assigning P0/P1. Record only evidence-backed findings with `[SOURCE: file:line]` citations, a finding class, scope proof, affected surface hints, a recommendation, and a content hash in the JSONL delta. Include a typed claim-adjudication packet for every new P0/P1 finding. Treat convergence as telemetry before the cap. The terminal stop reason is `maxIterationsReached`.

The iteration must produce:

- `iterations/iteration-001.md` ending with exactly one `Review verdict: PASS|CONDITIONAL|FAIL` line;
- `deltas/iteration-001.jsonl` with the complete iteration record and finding details;
- a state record that preserves protocol coverage, convergence telemetry, and cap-stop evidence.

