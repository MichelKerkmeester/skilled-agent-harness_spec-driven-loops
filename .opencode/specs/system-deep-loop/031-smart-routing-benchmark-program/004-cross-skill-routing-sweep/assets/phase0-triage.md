# Phase 0 — Cross-Skill Routing Triage (read-only)

Two inputs: a computed `D3-ex-default` diagnostic (waste minus the skill's always-loaded DEFAULT tier) and a read-only orphan classification. No skill was mutated.

## D3 diagnostic — artifact vs genuine over-routing

| Skill | DEFAULT tier | total waste | waste ex-DEFAULT | fix class |
|-------|--------------|------------:|-----------------:|-----------|
| deep-research | 1 file (lean) | 8 | 0 | gold-align (pure DEFAULT-tier artifact) |
| deep-review | 1 (lean) | 4 | 0 | gold-align |
| deep-ai-council | 1 (lean) | 9 | 0 | gold-align |
| code-webflow | 1 (lean) | 1 | 0 | gold-align |
| deep-improvement | 1 (lean) | 12 | 3 | gold-align + investigate 3 genuine |
| code-opencode | 2 (lean) | 45 | 31 | **genuine over-routing → intent-gate (router change)** |

Every flagged skill has a **lean 1–2 file DEFAULT tier**, so `gold=declared-designed-load` is honest here (not the tautology risk code-review's 5-file tier carried). The audit's pre-label of code-opencode as "over-routing only" is confirmed by computation, not guess: 31/45 waste survives DEFAULT-exclusion — a real router-precision issue, not a gold artifact.

## Orphan classification — routable vs exempt vs prune (25 orphans)

**ROUTABLE 16** (genuine task-time guidance → wire into a meaningful intent), **EXEMPT 9** (structural/index/catalog — stay on an intentionally-unrouted allowlist, do NOT wire), **PRUNE 0**, **NEEDS-HUMAN 0**.

### EXEMPT (intentionally-unrouted allowlist seed — must NOT be force-wired)
- deep-research: `references/convergence/convergence_reference_only.md` (design archaeology), `assets/deep_research_dashboard.md` (auto-generated, overwritten each iteration)
- deep-improvement: `assets/skill_benchmark/README.md`, `assets/skill_benchmark/fixtures/README.md`, `assets/model_benchmark/README.md`, `assets/model_benchmark/benchmark-profiles/README.md`, `assets/model_benchmark/benchmark-fixtures/README.md`, `assets/agent_improvement/README.md`, `assets/agent_improvement/target-profiles/README.md` (directory-index catalogs — search-discovery via their own trigger_phrases, not task-intent routing)

### ROUTABLE 18 (per-file proposed intent recorded in the classifier output)
- deep-research (2): context_snapshot → codebase-scoped research init; deep_research_strategy → strategy init/iteration.
- deep-review (4): state_jsonl → state-log validation; completion_criteria → completion verification; loop_state_and_gates → state-machine/gate debugging; convergence_recovery → convergence recovery.
- deep-ai-council (1): prompt_pack_round → seat-round prompting.
- deep-improvement (9): heldout_and_gold_sets, promotion_gate_contract, model_benchmark/mixed_executor_methodology, agent_improvement/{candidate_proposal_format, profiling_audit_log, score_dimensions}, skill_benchmark/fixtures/deep-loop-workflows/routing_precision, model_benchmark/benchmark-fixtures/reviewer_schema, agent_improvement/improvement_config_reference → each maps to its lane's natural intent.

## Consequence for the plan
- **~33% of orphans are NOT wired** — they go on the allowlist. This is why the D5 CI gate must be `orphans ⊆ allowlist`, never "zero orphans."
- The deep-* skills + code-webflow are gold-align (artifact) — low-risk, honest (lean DEFAULT tier).
- **code-opencode is the one genuine over-router** — needs a router (intent-gate) change, handled separately from the orphan/gold work.
- Phase 1 hand-sweeps deep-improvement (the ROUTABLE-9 + EXEMPT-7 + 3-genuine mix — the hardest case) with independent sign-off before any optimizer is generalized.

*Classification was a GPT first-pass over read-only file contents; final per-file judgment is applied during the Phase-1 hand-sweep with an independent reviewer.*
