DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 5 of 20

## Focus

R3 — Organization-policy compiler. Extract and decide `OrganizationGraphPolicyV1` plus its compiled artifact: resource model (`tool|node|edge|spend`), deny→ask→allow precedence, tenant and role scope, rule specificity/order, immutable document digest/version, request/caller binding, node/edge compilation, and rule-to-036 audit/decision mapping. Resolve the risk that compiled policy loses the exact source rule or audit provenance.

Examine GraphARC `policy/document.py`, `engine.py`, `approvals.py`, `audit.py`, `example.toml`, tests, and relevant organization-graph blog sections. Map to `.opencode/skills/system-deep-loop/mode-registry.json`, authorized-ledger, and 036 authority. Build on iterations 1–4 and classify every finding against a specific prior decision. Include when-not-to-use boundaries.

## Outputs and constraints

Read lineage state first and `.opencode/agents/deep-research.md` completely. Execute exactly one LEAF iteration with 3–5 research actions, no subagents. Write only `iterations/iteration-005.md`, one append to `deep-research-state.jsonl`, and `deltas/iter-005.jsonl`. Every finding needs `[SOURCE: file:line]` or `[INFERENCE: ...]`. Narrative must include source schema, compiled schema, precedence algorithm, audit mapping, mode-registry integration, failure behavior, and non-applicability. Route proof uses iteration/run 5 and executor `cli-codex/gpt-5.6-sol/high/fast`. Continue regardless of convergence telemetry.
