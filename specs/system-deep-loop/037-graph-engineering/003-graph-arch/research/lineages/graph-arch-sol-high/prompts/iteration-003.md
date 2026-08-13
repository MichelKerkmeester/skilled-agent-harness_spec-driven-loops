DEEP-RESEARCH
Resolved route: mode=research; target_agent=@deep-research; execution=single_iteration; state_source=externalized_files; do_not_switch_mode=true

# Deep-Research Iteration 3 of 20

## Focus

R1 — Admission proof before 036 authorization. Derive a concrete `GraphAdmissionProofV1` decision: exact checked invariants, evidence/digests, issuer/verifier boundary, freshness, subject binding, failure codes, and the exact order in which the 036 gateway verifies the proof then independently re-binds authorization facts. Prove that `AdmissionResult` is forgeable and admission is only a precondition, never authorization.

Compare GraphARC `planner/admission.py`, `proposal.py`, admission tests, materialization/loop call sites; map to system-deep-loop `runtime/lib/authorized-ledger/` and the 036 authority-plane gateway/spec. Ground the structural rationale in relevant graph-engineering blog passages. Build on iterations 1–2 and name confirm/refine/extend/contradict against a specific prior decision. Include explicit when-not-to-use boundaries.

## State and outputs

Read config/state/strategy/registry first under the lineage. Write only `iterations/iteration-003.md`, append one record to `deep-research-state.jsonl`, and write `deltas/iter-003.jsonl`.

## Constraints

Read `.opencode/agents/deep-research.md` completely; exactly one LEAF iteration; 3–5 focused research actions; no subagents. Every finding needs `[SOURCE: file:line]` or `[INFERENCE: ...]`. The narrative must contain a proposed schema, verification-order sequence, refusal mapping, and when-not-to-use section. Use route-proof fields, `iteration:3`, `run:3`, and executor provenance `cli-codex/gpt-5.6-sol/high/fast`. Do not stop for convergence.
